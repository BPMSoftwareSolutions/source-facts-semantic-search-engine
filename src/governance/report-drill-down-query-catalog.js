import { projectsCliEntryPointCallGraph } from "../call-graph.js";

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))].sort();
}

function repositoryPath(context, modulePath) {
  const prefix = context.subjectScope.workspaceRelativePrefix;
  if (!prefix || modulePath === prefix || modulePath.startsWith(`${prefix}/`)) return modulePath;
  return `${prefix}/${modulePath}`;
}

function buildsOccurrenceEvidence(context) {
  const references = new Map((context.sourceIndex.sourceReferences ?? []).map((entry) => [entry.referenceId, entry]));
  const symbols = new Map((context.sourceIndex.symbols ?? []).map((entry) => [entry.symbolId, entry]));
  const projectedByKey = new Map();
  for (const occurrence of context.occurrences) {
    const key = `${occurrence.modulePath}\0${occurrence.startLine}\0${occurrence.mechanic}\0${occurrence.symbolName ?? ""}`;
    const bucket = projectedByKey.get(key) ?? [];
    bucket.push(occurrence);
    projectedByKey.set(key, bucket);
  }
  return (context.sourceIndex.bodyMechanics ?? []).map((mechanic) => {
    const reference = references.get(mechanic.sourceReferenceId) ?? null;
    const symbol = mechanic.fromSymbolId ? symbols.get(mechanic.fromSymbolId) ?? null : null;
    const modulePath = repositoryPath(context, mechanic.modulePath);
    const key = `${modulePath}\0${reference?.startLine ?? ""}\0${mechanic.mechanic}\0${symbol?.name ?? ""}`;
    const projected = projectedByKey.get(key)?.[0] ?? null;
    return {
      occurrenceId: mechanic.bodyMechanicId ?? mechanic.mechanicId,
      bodyMechanicId: mechanic.bodyMechanicId ?? mechanic.mechanicId,
      mechanic: mechanic.mechanic,
      modulePath,
      responsibility: symbol?.name ?? null,
      symbolId: symbol?.symbolId ?? mechanic.fromSymbolId ?? null,
      symbolName: symbol?.name ?? null,
      sourceReferenceId: mechanic.sourceReferenceId,
      startLine: reference?.startLine ?? null,
      startColumn: reference?.startColumn ?? null,
      endLine: reference?.endLine ?? null,
      endColumn: reference?.endColumn ?? null,
      featureCoveragePosture: projected?.featureCoveragePosture ?? null,
      lineageDisposition: projected?.lineageDisposition ?? null,
      authorityHomeFile: projected?.authorityHomeFile ?? null,
      featureIds: projected?.featureIds ?? [],
      scenarioIds: projected?.scenarioIds ?? [],
      obligationIds: projected?.obligationIds ?? [],
    };
  });
}

function safelyBuildsCallGraph(index) {
  try {
    return projectsCliEntryPointCallGraph(index);
  } catch {
    return { roots: [], reachability: [], unreachableSymbols: [], entryPoints: [], callables: [] };
  }
}

function buildsCallPathRows(context) {
  const rows = [];
  for (const root of context.callGraph.roots ?? []) {
    const nodes = new Map(root.nodes.map((node) => [node.symbolId, node]));
    for (const node of root.nodes) {
      const path = [];
      let current = node;
      while (current) {
        path.push(current.symbolId);
        current = current.parentSymbolId ? nodes.get(current.parentSymbolId) ?? null : null;
      }
      rows.push({
        symbolId: node.symbolId,
        symbolName: node.name,
        modulePath: repositoryPath(context, node.modulePath),
        entryPointId: root.symbolId,
        entryPointName: root.name,
        entryKind: root.entryKind,
        depth: node.depth,
        callPath: path.reverse(),
        viaRelationshipId: node.viaRelationshipId,
      });
    }
  }
  return rows.sort((left, right) => left.symbolId.localeCompare(right.symbolId)
    || left.depth - right.depth || left.entryPointId.localeCompare(right.entryPointId));
}

function buildsInvocationRows(context) {
  const seen = new Set();
  const rows = [];
  for (const root of context.callGraph.roots ?? []) {
    for (const edge of root.edges ?? []) {
      if (seen.has(edge.relationshipId)) continue;
      seen.add(edge.relationshipId);
      rows.push({
        relationshipId: edge.relationshipId,
        sourceReferenceId: edge.sourceReferenceId,
        callerSymbolId: edge.fromSymbolId,
        callerName: edge.fromSymbolName ?? null,
        calleeSymbolId: edge.toSymbolId,
        calleeName: edge.toSymbolName ?? edge.toSymbolCandidate ?? null,
        modulePath: repositoryPath(context, edge.modulePath),
        resolutionDisposition: edge.resolutionDisposition,
      });
    }
  }
  return rows.sort((left, right) => left.relationshipId.localeCompare(right.relationshipId));
}

function featureRows(context) {
  return context.scenarioConformance.features.map((feature) => ({
    featureId: feature.featureId,
    purpose: feature.purpose,
    authorityFile: feature.authorityFile,
    classificationIds: feature.classifications.map((item) => item.classificationId),
    scenarioIds: feature.scenarios.map((scenario) => scenario.scenarioId),
    lineageQualityFindings: feature.lineageQualityFindings,
  }));
}

function scenarioRows(context) {
  return context.scenarioConformance.features.flatMap((feature) => feature.scenarios.map((scenario) => ({
    featureId: feature.featureId,
    scenarioId: scenario.scenarioId,
    purpose: scenario.purpose,
    authorityFile: feature.authorityFile,
    lineageStatus: scenario.lineageStatus,
    structuralStatus: scenario.structuralStatus,
    runtimeConformance: scenario.runtimeConformance,
    responsibilityCount: scenario.obligations.flatMap((item) => item.responsibilities).length,
    obligationCount: scenario.obligations.length,
    structuralBlockers: scenario.structuralBlockers,
    evaluationLimits: scenario.evaluationLimits,
    lineageQualityFindings: scenario.lineageQualityFindings,
  })));
}

function scenarioResponsibilityRows(context) {
  return context.scenarioConformance.features.flatMap((feature) => feature.scenarios.flatMap((scenario) => (
    scenario.obligations.flatMap((obligation) => obligation.responsibilities.map((responsibility) => ({
      featureId: feature.featureId,
      scenarioId: scenario.scenarioId,
      obligationId: obligation.obligationId,
      obligationStatement: obligation.statement,
      responsibilityId: responsibility.responsibilityId,
      bodyFile: responsibility.bodyFile,
      bindingStatus: responsibility.bindingStatus,
      bodyStatus: responsibility.bodyStatus,
      wiringStatus: responsibility.wiringStatus,
      executionStatus: responsibility.executionStatus,
      proofStatus: responsibility.proofStatus,
    })))
  )));
}

function groups(rows, keys, countName = "occurrenceCount") {
  const grouped = new Map();
  for (const row of rows) {
    const id = keys.map((key) => row[key] ?? "").join("\0");
    const value = grouped.get(id) ?? Object.fromEntries(keys.map((key) => [key, row[key] ?? null]));
    value[countName] = (value[countName] ?? 0) + 1;
    grouped.set(id, value);
  }
  return [...grouped.values()].sort((left, right) => right[countName] - left[countName]
    || keys.map((key) => String(left[key] ?? "").localeCompare(String(right[key] ?? ""))).find((value) => value !== 0) || 0);
}

function authorityRows(context) {
  const documents = [
    ...context.authoritySources.map((item) => ({ ...item, documentKind: "authority-declaration.v1" })),
    ...context.otherAuthorityDocuments.map((item) => ({ ...item, sourceFile: null, mechanicsDeclared: null, mechanicsAuthorityBound: null })),
  ];
  return documents.map((document) => ({
    ...document,
    canonicalFeatureIds: context.scenarioConformance.features
      .filter((feature) => feature.authorityFile === document.authorityFile).map((feature) => feature.featureId),
    occurrenceCount: context.occurrences.filter((item) => item.authorityHomeFile === document.authorityFile
      || item.governingAuthorityFile === document.authorityFile).length,
  }));
}

function subjectItemRows(context) {
  return context.subjectBoundaryItems ?? [];
}

const parameter = (name, type = "string", nullable = true) => ({ name, type, required: false, nullable });
const next = (queryId, label, parameterBindings = {}) => ({ queryId, label, parameterBindings });

export function buildsReportQueryContext(view, index) {
  const context = { ...view, sourceIndex: index, callGraph: safelyBuildsCallGraph(index) };
  context.occurrenceEvidence = buildsOccurrenceEvidence(context);
  context.callPathRows = buildsCallPathRows(context);
  context.invocationRows = buildsInvocationRows(context);
  return context;
}

export const reportDrillDownQueries = Object.freeze([
  {
    queryId: "feature-coverage.features.v1", section: "Canonical Features", depth: 1,
    queryText: "SELECT * FROM reportCanonicalFeatures WHERE (:featureId IS NULL OR featureId = :featureId) ORDER BY featureId",
    inputCollections: ["reportCanonicalFeatures"], expectedResultSchema: "canonical feature rows", parameters: [parameter("featureId")],
    rows: featureRows,
    drillDowns: [next("feature-coverage.feature-scenarios.v1", "Inspect feature scenarios", { featureId: ":featureId" }), next("authority.documents.v1", "Inspect feature authority", { featureId: ":featureId" })],
    rowDrillDowns: (row) => [next("feature-coverage.feature-scenarios.v1", "Inspect scenarios", { featureId: row.featureId }), next("scenario-conformance.scenario-call-paths.v1", "Inspect call paths", { featureId: row.featureId })],
  },
  {
    queryId: "feature-coverage.feature-scenarios.v1", section: "Feature Scenarios", depth: 2,
    queryText: "SELECT * FROM reportCanonicalScenarios WHERE (:featureId IS NULL OR featureId = :featureId) ORDER BY featureId, scenarioId",
    inputCollections: ["reportCanonicalScenarios"], expectedResultSchema: "scenario rows for a feature", parameters: [parameter("featureId")], rows: scenarioRows,
    drillDowns: [next("scenario-conformance.scenario-responsibilities.v1", "Inspect responsibilities", { featureId: ":featureId" })],
    rowDrillDowns: (row) => [next("scenario-conformance.scenario-responsibilities.v1", "Inspect scenario responsibilities", { scenarioId: row.scenarioId })],
  },
  {
    queryId: "scenario-conformance.scenarios.v1", section: "Canonical Scenarios", depth: 1,
    queryText: "SELECT * FROM reportCanonicalScenarios WHERE (:scenarioId IS NULL OR scenarioId = :scenarioId) ORDER BY scenarioId",
    inputCollections: ["reportCanonicalScenarios"], expectedResultSchema: "canonical scenario rows", parameters: [parameter("scenarioId")], rows: scenarioRows,
    drillDowns: [next("scenario-conformance.scenario-responsibilities.v1", "Inspect responsibility/obligation cardinality", { scenarioId: ":scenarioId" })],
    rowDrillDowns: (row) => [next("scenario-conformance.scenario-responsibilities.v1", "Inspect responsibilities", { scenarioId: row.scenarioId }), next("scenario-conformance.scenario-call-paths.v1", "Inspect call paths", { scenarioId: row.scenarioId })],
  },
  {
    queryId: "scenario-conformance.by-structural-status.v1", section: "Structural Status", depth: 1,
    queryText: "SELECT * FROM reportCanonicalScenarios WHERE (:structuralStatus IS NULL OR structuralStatus = :structuralStatus) ORDER BY scenarioId",
    inputCollections: ["reportCanonicalScenarios"], expectedResultSchema: "scenarios by structural status", parameters: [parameter("structuralStatus")], rows: scenarioRows,
    drillDowns: [next("scenario-conformance.scenario-responsibilities.v1", "Inspect blockers and responsibility evidence", { scenarioId: ":scenarioId" })],
    rowDrillDowns: (row) => [next("scenario-conformance.scenario-responsibilities.v1", "Inspect missing evidence", { scenarioId: row.scenarioId })],
  },
  {
    queryId: "scenario-conformance.scenario-responsibilities.v1", section: "Scenario Responsibilities", depth: 2,
    queryText: "SELECT * FROM reportScenarioResponsibilities WHERE (:scenarioId IS NULL OR scenarioId = :scenarioId) AND (:responsibilityId IS NULL OR responsibilityId = :responsibilityId) ORDER BY scenarioId, obligationId, responsibilityId",
    inputCollections: ["reportScenarioResponsibilities"], expectedResultSchema: "scenario responsibility and obligation rows", parameters: [parameter("scenarioId"), parameter("responsibilityId"), parameter("featureId")], rows: scenarioResponsibilityRows,
    drillDowns: [next("scenario-conformance.scenario-call-paths.v1", "Inspect originating interfaces", { scenarioId: ":scenarioId" }), next("source-facts.occurrence-source-references.v1", "Inspect body source evidence", { modulePath: ":bodyFile" })],
    rowDrillDowns: (row) => [next("scenario-conformance.scenario-call-paths.v1", "Inspect entry surfaces", { scenarioId: row.scenarioId }), next("source-facts.occurrence-source-references.v1", "Inspect source rows", { modulePath: row.bodyFile })],
  },
  {
    queryId: "scenario-conformance.scenario-call-paths.v1", section: "Scenario Call Paths", depth: 3,
    queryText: "SELECT sr.featureId, sr.scenarioId, sr.responsibilityId, cp.* FROM reportScenarioResponsibilities sr LEFT JOIN reportCallPaths cp ON cp.symbolName = sr.responsibilityId OR cp.modulePath = sr.bodyFile WHERE (:scenarioId IS NULL OR sr.scenarioId = :scenarioId) AND (:featureId IS NULL OR sr.featureId = :featureId)",
    inputCollections: ["reportCallPaths", "reportScenarioResponsibilities"], expectedResultSchema: "entrypoint-to-responsibility call paths", parameters: [parameter("scenarioId"), parameter("featureId")],
    rows: (context) => scenarioResponsibilityRows(context).flatMap((responsibility) => {
      const matches = context.callPathRows.filter((item) => item.symbolName === responsibility.responsibilityId
        || item.modulePath === responsibility.bodyFile);
      const semantic = {
        featureId: responsibility.featureId,
        scenarioId: responsibility.scenarioId,
        obligationId: responsibility.obligationId,
        responsibilityId: responsibility.responsibilityId,
      };
      if (matches.length === 0) return [{
        ...semantic,
        symbolId: null,
        symbolName: null,
        modulePath: responsibility.bodyFile,
        entryPointId: null,
        entryPointName: null,
        entryKind: null,
        depth: null,
        callPath: [],
        viaRelationshipId: null,
        reachabilityDisposition: "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
      }];
      return matches.map((item) => ({ ...item, ...semantic, reachabilityDisposition: "ORIGINATING_ENTRYPOINT_OBSERVED" }));
    }),
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect source evidence", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect target source", row.symbolId ? { symbolId: row.symbolId } : { modulePath: row.modulePath })],
  },
  {
    queryId: "feature-coverage.unlined-mechanics-by-file.v1", section: "Unlined Mechanics by File", depth: 2,
    queryText: "SELECT modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) GROUP BY modulePath, mechanic ORDER BY occurrenceCount DESC, modulePath",
    inputCollections: ["reportOccurrences"], expectedResultSchema: "unlined mechanic file aggregates", parameters: [parameter("mechanic"), parameter("modulePath")],
    rows: (context) => groups(context.occurrenceEvidence.filter((item) => item.featureCoveragePosture === "FEATURE_COVERAGE_MISSING"), ["modulePath", "mechanic"]),
    drillDowns: [next("feature-coverage.unlined-mechanics-by-responsibility.v1", "Inspect responsibilities", { mechanic: ":mechanic", modulePath: ":modulePath" })],
    rowDrillDowns: (row) => [next("feature-coverage.unlined-mechanics-by-responsibility.v1", "Inspect responsibilities", { mechanic: row.mechanic, modulePath: row.modulePath }), next("feature-coverage.unlined-occurrences.v1", "Inspect exact occurrences", { mechanic: row.mechanic, modulePath: row.modulePath })],
  },
  {
    queryId: "feature-coverage.unlined-mechanics-by-responsibility.v1", section: "Unlined Mechanics by Responsibility", depth: 2,
    queryText: "SELECT modulePath, responsibility, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) GROUP BY modulePath, responsibility, mechanic ORDER BY occurrenceCount DESC",
    inputCollections: ["reportOccurrences"], expectedResultSchema: "unlined mechanic responsibility aggregates", parameters: [parameter("mechanic"), parameter("modulePath"), parameter("responsibility")],
    rows: (context) => groups(context.occurrenceEvidence.filter((item) => item.featureCoveragePosture === "FEATURE_COVERAGE_MISSING"), ["modulePath", "responsibility", "mechanic"]),
    drillDowns: [next("reachability.symbol-originating-entrypoints.v1", "Inspect interface reachability", { symbolName: ":responsibility" }), next("feature-coverage.unlined-occurrences.v1", "Inspect occurrences", { responsibility: ":responsibility" })],
    rowDrillDowns: (row) => [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolName: row.responsibility }), next("feature-coverage.unlined-occurrences.v1", "Inspect exact occurrences", { responsibility: row.responsibility, modulePath: row.modulePath, mechanic: row.mechanic })],
  },
  {
    queryId: "feature-coverage.unlined-mechanics-by-symbol.v1", section: "Unlined Mechanics by Symbol", depth: 2,
    queryText: "SELECT symbolId, symbolName, modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY symbolId, symbolName, modulePath, mechanic ORDER BY occurrenceCount DESC",
    inputCollections: ["reportOccurrences"], expectedResultSchema: "unlined mechanic symbol aggregates", parameters: [parameter("mechanic"), parameter("symbolId"), parameter("symbolName")],
    rows: (context) => groups(context.occurrenceEvidence.filter((item) => item.featureCoveragePosture === "FEATURE_COVERAGE_MISSING"), ["symbolId", "symbolName", "modulePath", "mechanic"]),
    drillDowns: [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolId: row.symbolId }), next("authority.authority-near-symbol.v1", "Inspect nearby authority", { symbolId: row.symbolId })],
  },
  {
    queryId: "feature-coverage.unlined-occurrences.v1", section: "Exact Unlined Occurrences", depth: 3,
    queryText: "SELECT * FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) AND (:responsibility IS NULL OR responsibility = :responsibility) ORDER BY modulePath, startLine",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "exact unlined source occurrences", parameters: [parameter("mechanic"), parameter("modulePath"), parameter("responsibility"), parameter("symbolId")],
    rows: (context) => context.occurrenceEvidence.filter((item) => item.featureCoveragePosture === "FEATURE_COVERAGE_MISSING"),
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect physical source references", { occurrenceId: ":occurrenceId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect physical source reference", { occurrenceId: row.occurrenceId }), next("reachability.symbol-originating-entrypoints.v1", "Inspect originating interfaces", { symbolId: row.symbolId })],
  },
  {
    queryId: "source-facts.occurrence-source-references.v1", section: "Physical Source Evidence", depth: 5,
    queryText: "SELECT occurrenceId, sourceReferenceId, modulePath, startLine, startColumn, endLine, endColumn, mechanic, symbolId, symbolName FROM reportOccurrenceEvidence WHERE (:occurrenceId IS NULL OR occurrenceId = :occurrenceId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine, startColumn",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "physical occurrence and source-reference rows", parameters: [parameter("occurrenceId"), parameter("symbolId"), parameter("responsibility"), parameter("sourceReferenceId"), parameter("modulePath")], rows: (context) => context.occurrenceEvidence,
    drillDowns: [next("impact.source-reference-reverse-impact.v1", "Inspect reverse semantic impact", { sourceReferenceId: ":sourceReferenceId" })],
    rowDrillDowns: (row) => [next("impact.source-reference-reverse-impact.v1", "Inspect affected features and healing", { sourceReferenceId: row.sourceReferenceId, symbolId: row.symbolId })],
  },
  {
    queryId: "reachability.symbol-originating-entrypoints.v1", section: "Interface Reachability", depth: 3,
    queryText: "SELECT * FROM reportCallPaths WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) ORDER BY symbolId, depth, entryPointId",
    inputCollections: ["reportCallPaths"], expectedResultSchema: "originating interface and call-path rows", parameters: [parameter("symbolId"), parameter("symbolName")], rows: (context) => context.callPathRows,
    drillDowns: [next("reachability.symbol-callers.v1", "Inspect callers", { symbolId: ":symbolId" }), next("reachability.symbol-callees.v1", "Inspect callees", { symbolId: ":symbolId" }), next("authority.authority-near-symbol.v1", "Inspect semantic context", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("reachability.symbol-callers.v1", "Inspect callers", { symbolId: row.symbolId }), next("authority.authority-near-symbol.v1", "Inspect nearby authority", { symbolId: row.symbolId })],
  },
  {
    queryId: "reachability.symbol-callers.v1", section: "Reverse Callers", depth: 3,
    queryText: "SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR calleeSymbolId = :symbolId) ORDER BY relationshipId",
    inputCollections: ["reportInvocationEdges"], expectedResultSchema: "resolved caller edges", parameters: [parameter("symbolId")],
    rows: (context) => context.invocationRows.map((row) => ({ ...row, symbolId: row.calleeSymbolId })),
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect call-site source", { sourceReferenceId: ":sourceReferenceId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect call site", { sourceReferenceId: row.sourceReferenceId })],
  },
  {
    queryId: "reachability.symbol-callees.v1", section: "Forward Callees", depth: 3,
    queryText: "SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR callerSymbolId = :symbolId) ORDER BY relationshipId",
    inputCollections: ["reportInvocationEdges"], expectedResultSchema: "resolved callee edges", parameters: [parameter("symbolId")],
    rows: (context) => context.invocationRows.map((row) => ({ ...row, symbolId: row.callerSymbolId })),
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect call-site source", { sourceReferenceId: ":sourceReferenceId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect call site", { sourceReferenceId: row.sourceReferenceId })],
  },
  {
    queryId: "responsibility-evidence.cluster-by-id.v1", section: "Responsibility Cluster", depth: 2,
    queryText: "SELECT * FROM reportUnresolvedEvidenceClusters WHERE (:clusterId IS NULL OR clusterId = :clusterId)",
    inputCollections: ["reportUnresolvedEvidenceClusters"], expectedResultSchema: "responsibility evidence cluster rows", parameters: [parameter("clusterId")], rows: (context) => context.featureCoverage.uncoveredClusters,
    drillDowns: [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolName: ":responsibility" }), next("authority.authority-near-symbol.v1", "Inspect nearby authority", { symbolName: ":responsibility" })],
    rowDrillDowns: (row) => [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolName: row.responsibility }), next("feature-coverage.unlined-occurrences.v1", "Inspect exact mechanics", { modulePath: row.modulePath, responsibility: row.responsibility }), next("authority.authority-near-symbol.v1", "Inspect authority", { modulePath: row.modulePath, symbolName: row.responsibility })],
  },
  {
    queryId: "authority.documents.v1", section: "Authority Lineage", depth: 4,
    queryText: "SELECT * FROM reportAuthorityDocuments WHERE (:authorityFile IS NULL OR authorityFile = :authorityFile) AND (:featureId IS NULL OR :featureId IN canonicalFeatureIds) ORDER BY authorityFile",
    inputCollections: ["reportAuthorityDocuments"], expectedResultSchema: "authority document lineage rows", parameters: [parameter("authorityFile"), parameter("featureId")], rows: authorityRows,
    drillDowns: [next("authority.authority-near-symbol.v1", "Inspect bound symbols and occurrences", { authorityFile: ":authorityFile" })],
    rowDrillDowns: (row) => [next("authority.authority-near-symbol.v1", "Inspect bound source evidence", { authorityFile: row.authorityFile })],
  },
  {
    queryId: "authority.authority-near-symbol.v1", section: "Authority Near Symbol", depth: 4,
    queryText: "SELECT * FROM reportOccurrenceEvidence WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) AND (:authorityFile IS NULL OR authorityHomeFile = :authorityFile)",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "symbol occurrence rows with authority and feature context", parameters: [parameter("symbolId"), parameter("symbolName"), parameter("modulePath"), parameter("authorityFile")], rows: (context) => context.occurrenceEvidence,
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect physical evidence", { occurrenceId: ":occurrenceId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect source", { occurrenceId: row.occurrenceId })],
  },
  {
    queryId: "subject-boundary.items-by-disposition.v1", section: "Subject Boundary Items", depth: 1,
    queryText: "SELECT * FROM reportSubjectItems WHERE (:disposition IS NULL OR disposition = :disposition) AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId",
    inputCollections: ["reportSubjectItems"], expectedResultSchema: "subject item disposition and reason rows", parameters: [parameter("disposition"), parameter("itemId")], rows: subjectItemRows,
    drillDowns: [next("subject-boundary.item-scope-reason.v1", "Inspect exact inclusion or exclusion reason", { itemId: ":itemId" })],
    rowDrillDowns: (row) => [
      next("subject-boundary.item-scope-reason.v1", "Inspect scope reason", { itemId: row.itemId }),
      ...(row.evidenceClass === "authority-document" && row.disposition === "IN_SUBJECT"
        ? [next("authority.documents.v1", "Inspect authority", { authorityFile: row.itemId })]
        : []),
    ],
  },
  {
    queryId: "subject-boundary.included-items.v1", section: "Included Subject Items", depth: 1,
    queryText: "SELECT * FROM reportSubjectItems WHERE disposition = 'IN_SUBJECT' AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId",
    inputCollections: ["reportSubjectItems"], expectedResultSchema: "included subject item rows", parameters: [parameter("itemId")],
    rows: (context) => subjectItemRows(context).filter((row) => row.disposition === "IN_SUBJECT"),
    drillDowns: [next("subject-boundary.item-scope-reason.v1", "Inspect inclusion reason", { itemId: ":itemId" })],
    rowDrillDowns: (row) => [next("subject-boundary.item-scope-reason.v1", "Inspect inclusion reason", { itemId: row.itemId })],
  },
  {
    queryId: "subject-boundary.excluded-items.v1", section: "Excluded Subject Items", depth: 1,
    queryText: "SELECT * FROM reportSubjectItems WHERE disposition = 'EXCLUDED' AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId",
    inputCollections: ["reportSubjectItems"], expectedResultSchema: "excluded subject item rows", parameters: [parameter("itemId")],
    rows: (context) => subjectItemRows(context).filter((row) => row.disposition === "EXCLUDED"),
    drillDowns: [next("subject-boundary.item-scope-reason.v1", "Inspect exclusion reason", { itemId: ":itemId" })],
    rowDrillDowns: (row) => [next("subject-boundary.item-scope-reason.v1", "Inspect exclusion reason", { itemId: row.itemId })],
  },
  {
    queryId: "subject-boundary.item-scope-reason.v1", section: "Subject Item Scope Reason", depth: 2,
    queryText: "SELECT evidenceClass, itemId, disposition, scopeReason FROM reportSubjectItems WHERE (:itemId IS NULL OR itemId = :itemId)",
    inputCollections: ["reportSubjectItems"], expectedResultSchema: "terminal subject disposition reason rows", parameters: [parameter("itemId")],
    rows: subjectItemRows, drillDowns: [], rowDrillDowns: () => [], terminal: true,
  },
  {
    queryId: "impact.source-reference-reverse-impact.v1", section: "Reverse Impact", depth: 6,
    queryText: "SELECT sourceReferenceId, symbolId, authorityHomeFile, featureIds, scenarioIds, obligationIds, featureCoveragePosture FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId) AND (:symbolId IS NULL OR symbolId = :symbolId)",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "source-to-semantic-lineage reverse impact rows", parameters: [parameter("sourceReferenceId"), parameter("symbolId"), parameter("artifactId")], rows: (context) => context.occurrenceEvidence,
    drillDowns: [next("healing.source-fact-candidates.v1", "Inspect missing lineage and healing candidates", { sourceReferenceId: ":sourceReferenceId" })],
    rowDrillDowns: (row) => [next("healing.source-fact-candidates.v1", "Inspect healing candidate", { sourceReferenceId: row.sourceReferenceId })],
  },
  {
    queryId: "healing.source-fact-candidates.v1", section: "Change and Healing", depth: 6,
    queryText: "SELECT occurrenceId, sourceReferenceId, modulePath, symbolId, mechanic, featureCoveragePosture, authorityHomeFile FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId)",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "source facts with missing lineage and healing posture", parameters: [parameter("sourceReferenceId")],
    rows: (context) => context.occurrenceEvidence.map((row) => ({ ...row, healingDisposition: row.featureCoveragePosture === "FEATURE_COVERAGE_MISSING" ? "CONNECTIVE_TISSUE_CANDIDATE" : "NO_HEALING_REQUIRED" })),
    drillDowns: [], rowDrillDowns: () => [], terminal: true,
  },
]);

export function decoratesDrillDownRows(query, rows) {
  if (typeof query.rowDrillDowns !== "function") return rows;
  return rows.map((row) => ({ ...row, drillDowns: query.rowDrillDowns(row) }));
}

export function validatesParameterBindings(query, bindings) {
  const parameters = new Map((query.parameters ?? []).map((item) => [item.name, item]));
  for (const [name, value] of Object.entries(bindings ?? {})) {
    const definition = parameters.get(name);
    if (!definition) return false;
    if (typeof value === "string" && value.startsWith(":")) continue;
    if (value === null && definition.nullable) continue;
    if (definition.type === "string" && typeof value !== "string") return false;
  }
  return true;
}

export function filtersRowsByParameters(rows, parameters = {}) {
  const active = Object.entries(parameters).filter(([, value]) => value !== null && value !== undefined);
  if (active.length === 0) return rows;
  return rows.filter((row) => active.every(([key, value]) => {
    if (key === "responsibility") return row.responsibility === value || row.symbolName === value || row.responsibilityId === value;
    if (key === "structuralStatus") return row.structuralStatus === value;
    if (key === "sourceReferenceId") return row.sourceReferenceId === value;
    if (key === "artifactId") return row.itemId === value || row.authorityFile === value;
    if (key === "featureId") return row.featureId === value || row.featureIds?.includes(value) || row.canonicalFeatureIds?.includes(value);
    if (key === "authorityFile") return row.authorityFile === value || row.authorityHomeFile === value;
    const candidate = row[key];
    return Array.isArray(candidate) ? candidate.includes(value) : candidate === value;
  }));
}
