import { projectsCliEntryPointCallGraph } from "../call-graph.js";
import { authoringActionDrillDowns, authoringEvidenceQueries, buildsAuthoringEvidenceContext } from "./authoring-evidence-query-catalog.js";
import { buildsEnterpriseSubjectRegistry } from "../sqlserver/load-engineering-truth.js";

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
      authorityHomeStatus: projected?.authorityHomeStatus ?? null,
      posture: projected?.posture ?? null,
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

const higherOrderMethods = new Set(["every", "filter", "find", "findIndex", "flatMap", "forEach", "map", "reduce", "reduceRight", "some", "sort"]);
const platformRoots = new Set(["Array", "BigInt", "Boolean", "Date", "Error", "JSON", "Map", "Math", "Number", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "WeakMap", "WeakSet", "console", "process"]);
const standardLibraryRoots = new Set(["assert", "buffer", "crypto", "events", "fs", "http", "https", "os", "path", "perf_hooks", "querystring", "stream", "url", "util", "worker_threads", "zlib"]);
const standardLibraryFunctions = new Set([
  "access", "basename", "createHash", "createReadStream", "createServer", "createWriteStream", "dirname", "finished",
  "fileURLToPath", "join", "mkdir", "once", "readFile", "readdir", "realpath", "resolve", "stat", "unlink", "writeFile",
]);

function classifiesInvocationEdge(edge) {
  if (edge.resolutionDisposition === "resolved") return "RESOLVED_INTERNAL_SYMBOL";
  if (edge.resolutionDisposition === "ambiguous") return "AMBIGUOUS_INTERNAL_SYMBOL";
  const candidate = String(edge.toSymbolCandidate ?? "").trim();
  if (/\bimport\s*\(/u.test(candidate) || edge.operator === "dynamic-import") return "DYNAMIC_IMPORT";
  const member = candidate.match(/\.([A-Za-z_$][\w$]*)\s*$/u)?.[1] ?? null;
  if (member && higherOrderMethods.has(member)) return "CALLBACK_OR_HIGHER_ORDER";
  const root = candidate.match(/^([A-Za-z_$][\w$]*)\./u)?.[1] ?? null;
  if (root && platformRoots.has(root)) return "PLATFORM_BUILTIN_BOUNDARY";
  if (root && standardLibraryRoots.has(root)) return "STANDARD_LIBRARY_BOUNDARY";
  if (standardLibraryFunctions.has(candidate)) return "STANDARD_LIBRARY_BOUNDARY";
  if (["validate", "validator", "callback", "handler", "listener", "predicate"].includes(candidate)) return "CALLBACK_OR_HIGHER_ORDER";
  if (member || candidate.includes(".")) return "INSTANCE_MEMBER_CALL";
  return "UNRESOLVED_INTERNAL_SYMBOL";
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

function buildsCommandExecutionGraphRows(context) {
  const commandsByEntryPoint = new Map();
  for (const command of context.interfaceGovernance.commands ?? []) {
    const rows = commandsByEntryPoint.get(command.entryPointId) ?? [];
    rows.push(command);
    commandsByEntryPoint.set(command.entryPointId, rows);
  }
  const rows = [];
  for (const root of context.callGraph.roots ?? []) {
    const nodesById = new Map(root.nodes.map((node) => [node.symbolId, node]));
    const nodes = root.nodes.map((node) => {
      const pathWitness = [];
      let current = node;
      while (current) {
        pathWitness.push({
          symbolId: current.symbolId,
          symbolName: current.name,
          modulePath: repositoryPath(context, current.modulePath),
        });
        current = current.parentSymbolId ? nodesById.get(current.parentSymbolId) ?? null : null;
      }
      return {
        symbolId: node.symbolId,
        symbolName: node.name,
        modulePath: repositoryPath(context, node.modulePath),
        depth: node.depth,
        parentSymbolId: node.parentSymbolId,
        viaRelationshipId: node.viaRelationshipId,
        pathWitness: pathWitness.reverse(),
      };
    });
    const edges = root.edges.map((edge) => ({
      relationshipId: edge.relationshipId,
      sourceReferenceId: edge.sourceReferenceId,
      modulePath: repositoryPath(context, edge.modulePath),
      sourceLine: edge.sourceLine,
      sourceColumn: edge.sourceColumn,
      fromSymbolId: edge.fromSymbolId,
      fromSymbolName: edge.fromSymbolName,
      toSymbolCandidate: edge.toSymbolCandidate,
      toSymbolId: edge.toSymbolId,
      toSymbolName: edge.toSymbolName,
      candidateSymbolIds: edge.toSymbolIds,
      resolutionDisposition: edge.resolutionDisposition,
      resolutionReason: edge.resolutionReason,
      operator: edge.operator,
      semanticBoundaryDisposition: classifiesInvocationEdge(edge),
    }));
    const commandRows = commandsByEntryPoint.get(root.symbolId) ?? [{ commandName: null, handlerName: root.name }];
    for (const command of commandRows) {
      rows.push({
        commandName: command.commandName,
        interfaceExposure: command.commandName === null ? "INTERNAL_EXPORTED_ROOT" : "CONSUMER_CLI_COMMAND",
        handlerName: root.name,
        entryPointId: root.symbolId,
        entryKind: root.entryKind,
        modulePath: repositoryPath(context, root.modulePath),
        declarationLine: root.entryLine,
        summary: {
          ...root.summary,
          semanticBoundaryCounts: Object.fromEntries([...new Set(edges.map((edge) => edge.semanticBoundaryDisposition))]
            .sort().map((disposition) => [disposition, edges.filter((edge) => edge.semanticBoundaryDisposition === disposition).length])),
          actionableInternalClosureDebt: edges.filter((edge) => ["UNRESOLVED_INTERNAL_SYMBOL", "AMBIGUOUS_INTERNAL_SYMBOL"].includes(edge.semanticBoundaryDisposition)).length,
        },
        depthLayers: root.depthLayers,
        nodes,
        edges,
        unresolvedOrAmbiguousEdges: edges.filter((edge) => edge.resolutionDisposition !== "resolved"),
        internalClosureDebtEdges: edges.filter((edge) => ["UNRESOLVED_INTERNAL_SYMBOL", "AMBIGUOUS_INTERNAL_SYMBOL"].includes(edge.semanticBoundaryDisposition)),
        boundaryEdges: edges.filter((edge) => !["RESOLVED_INTERNAL_SYMBOL", "UNRESOLVED_INTERNAL_SYMBOL", "AMBIGUOUS_INTERNAL_SYMBOL"].includes(edge.semanticBoundaryDisposition)),
        canonicalCommandName: command.canonicalCommandName ?? command.commandName,
        commandAliases: command.commandAliases ?? [command.commandName].filter(Boolean),
        executionSliceDisposition: command.executionSliceDisposition ?? "ONE_INTERFACE_ONE_EXECUTION_SLICE",
      });
    }
  }
  return rows.sort((left, right) => String(left.commandName ?? "~internal").localeCompare(String(right.commandName ?? "~internal"))
    || left.handlerName.localeCompare(right.handlerName));
}

function buildsFeatureIntentProposalPackets(context) {
  const packets = [];
  const seen = new Set();
  const callableById = new Map((context.interfaceGovernance.callableInventory ?? []).map((row) => [row.symbolId, row]));
  const responsibilities = context.canonicalTraces?.responsibilityToCallgraph ?? [];
  for (const graph of context.commandExecutionGraphRows ?? []) {
    if (seen.has(graph.entryPointId)) continue;
    seen.add(graph.entryPointId);
    const commands = (context.interfaceGovernance.commands ?? []).filter((row) => row.entryPointId === graph.entryPointId);
    const featureIds = uniqueSorted(commands.flatMap((row) => row.canonicalFeatureIds ?? []));
    const responsibilityBindings = responsibilities.filter((row) => featureIds.includes(row.featureId));
    const explicitlyBoundSymbols = new Set(responsibilityBindings.flatMap((row) => row.boundImplementationSymbols));
    const classifiedNodes = graph.nodes.map((node) => ({
      ...node,
      nodeDisposition: node.symbolId === graph.entryPointId ? "FEATURE_ROOT"
        : explicitlyBoundSymbols.has(node.symbolName) ? "FEATURE_RESPONSIBILITY"
          : callableById.get(node.symbolId)?.cliClosureClassification === "SHARED_CLI_INFRASTRUCTURE" ? "SHARED_INFRASTRUCTURE"
            : "SUPPORTING_EXECUTION",
    }));
    const boundaryCandidate = (edge) => ({
      candidate: edge.toSymbolCandidate,
      disposition: edge.semanticBoundaryDisposition,
      sourceReferenceId: edge.sourceReferenceId,
      modulePath: edge.modulePath,
      sourceLine: edge.sourceLine,
    });
    const observable = graph.boundaryEdges.map(boundaryCandidate);
    packets.push({
      commandId: graph.canonicalCommandName,
      commandAliases: graph.commandAliases,
      aliasDisposition: graph.executionSliceDisposition,
      handler: graph.handlerName,
      entryPointId: graph.entryPointId,
      reachableCallables: classifiedNodes,
      pathWitnesses: classifiedNodes.map((node) => ({ symbolId: node.symbolId, pathWitness: node.pathWitness })),
      resolvedInternalEdges: graph.edges.filter((edge) => edge.semanticBoundaryDisposition === "RESOLVED_INTERNAL_SYMBOL"),
      ambiguousInternalEdges: graph.edges.filter((edge) => edge.semanticBoundaryDisposition === "AMBIGUOUS_INTERNAL_SYMBOL"),
      unresolvedInternalEdges: graph.edges.filter((edge) => edge.semanticBoundaryDisposition === "UNRESOLVED_INTERNAL_SYMBOL"),
      platformBoundaries: observable,
      inputs: observable.filter((edge) => /(?:read|parse|argv|input|request|get)/iu.test(edge.candidate ?? "")),
      outputs: observable.filter((edge) => /(?:write|print|stringify|response|send)/iu.test(edge.candidate ?? "")),
      sideEffects: observable.filter((edge) => /(?:write|set|push|serve|load|create|delete|remove)/iu.test(edge.candidate ?? "")),
      existingFeatureMatches: featureIds,
      responsibilityBindings,
      proposalDisposition: featureIds.length === 0 ? "FEATURE_INTENT_REQUIRED"
        : responsibilityBindings.some((row) => row.bindingDisposition === "RESPONSIBILITY_EXECUTION_GRAPH_BOUND") ? "FEATURE_INTENT_EXECUTION_GRAPH_BOUND"
          : "FEATURE_INTENT_RESPONSIBILITY_BINDING_REQUIRED",
    });
  }
  return packets.sort((left, right) => String(left.commandId).localeCompare(String(right.commandId)));
}

function buildsCompleteFeatureLineageRows(context) {
  return (context.canonicalFeatures?.features ?? []).map((gherkinFeature) => {
    const featureId = gherkinFeature.featureId;
    const intent = (context.canonicalIntents?.features ?? []).find((row) => row.featureId === featureId) ?? null;
    const interfaceTrace = (context.canonicalTraces?.featureToInterface ?? []).find((row) => row.featureId === featureId) ?? null;
    const commands = (context.interfaceGovernance.commands ?? []).filter((row) => row.canonicalFeatureIds.includes(featureId));
    const graph = interfaceTrace?.symbolId ? (context.commandExecutionGraphRows ?? []).find((row) => row.entryPointId === interfaceTrace.symbolId) ?? null : null;
    const callables = (context.canonicalTraces?.featureToCallgraph ?? []).filter((row) => row.featureId === featureId);
    const responsibilityBindings = (context.canonicalTraces?.responsibilityToCallgraph ?? []).filter((row) => row.featureId === featureId);
    const scenarioRows = (context.canonicalFeatures?.scenarios ?? []).filter((row) => row.featureId === featureId);
    const scenarios = scenarioRows.map((gherkinScenario) => {
      const scenarioId = gherkinScenario.scenarioId;
      const intentScenario = (context.canonicalIntents?.scenarios ?? []).find((row) => row.scenarioId === scenarioId) ?? null;
      const responsibility = (context.canonicalIntents?.responsibilities ?? []).find((row) => row.scenarioId === scenarioId) ?? null;
      const binding = responsibilityBindings.find((row) => row.scenarioId === scenarioId) ?? null;
      const tests = (context.testTraceability?.scenarioLineage ?? []).filter((row) => row.scenarioId === scenarioId);
      const proofCoverage = (context.testTraceability?.scenarioProofCoverage ?? []).find((row) => row.scenarioId === scenarioId) ?? null;
      return {
        gherkin: gherkinScenario,
        intent: intentScenario,
        steps: (context.canonicalFeatures?.steps ?? []).filter((row) => row.scenarioId === scenarioId),
        responsibility,
        obligation: responsibility ? { obligationId: responsibility.obligationId, statement: responsibility.obligationStatement } : null,
        executionBinding: binding,
        sourceFacts: (context.canonicalTraces?.scenarioToSourceFacts ?? []).filter((row) => row.scenarioId === scenarioId),
        mechanics: (context.canonicalTraces?.obligationToMechanics ?? []).filter((row) => row.scenarioId === scenarioId),
        tests,
        proofCoverage,
      };
    });
    return {
      featureId,
      gherkin: gherkinFeature,
      intent,
      interface: interfaceTrace,
      cliSurfaces: commands.map((row) => ({ commandName: row.commandName, commandAliases: row.commandAliases, handlerName: row.handlerName, entryPointId: row.entryPointId, governanceGapDisposition: row.governanceGapDisposition })),
      executionGraph: graph,
      callables,
      responsibilityBindings,
      scenarios,
      testSummary: {
        linkedTestIds: uniqueSorted(scenarios.flatMap((scenario) => scenario.tests.map((test) => test.testId))),
        proofLinkedScenarios: scenarios.filter((scenario) => scenario.tests.length > 0).length,
        runtimeProvenScenarios: scenarios.filter((scenario) => (scenario.proofCoverage?.proofCount ?? 0) > 0).length,
        scenarioProofGaps: scenarios.filter((scenario) => (scenario.proofCoverage?.proofCount ?? 0) === 0).map((scenario) => scenario.gherkin.scenarioId),
      },
      lineageDisposition: !intent ? "FEATURE_INTENT_MISSING"
        : interfaceTrace?.interfaceDisposition !== "INTERFACE_ROOT_RESOLVED" ? "FEATURE_INTERFACE_UNRESOLVED"
          : !graph ? "FEATURE_EXECUTION_GRAPH_MISSING"
            : scenarios.some((scenario) => scenario.executionBinding?.bindingDisposition !== "RESPONSIBILITY_EXECUTION_GRAPH_BOUND") ? "FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE"
              : scenarios.some((scenario) => (scenario.proofCoverage?.proofCount ?? 0) === 0) ? "FEATURE_LINEAGE_BOUND_RUNTIME_PROOF_MISSING"
                : "FEATURE_LINEAGE_AND_RUNTIME_PROOF_COMPLETE",
    };
  });
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

function enterpriseContextColumns(context) {
  const enterpriseContext = context.enterpriseContext ?? null;
  return {
    enterpriseId: enterpriseContext?.enterpriseId ?? null,
    portfolioId: enterpriseContext?.portfolioId ?? null,
    domainId: enterpriseContext?.domainId ?? null,
    applicationId: enterpriseContext?.applicationId ?? null,
    capabilityId: enterpriseContext?.capabilityId ?? null,
    repositoryId: enterpriseContext?.repositoryId ?? null,
    workspaceId: enterpriseContext?.workspaceId ?? null,
    contextAuthorityId: enterpriseContext?.contextAuthorityId ?? null,
  };
}

const enterpriseContextSubjectOrder = Object.freeze([
  { field: "enterpriseId", subjectType: "enterprise" },
  { field: "portfolioId", subjectType: "portfolio" },
  { field: "domainId", subjectType: "domain" },
  { field: "applicationId", subjectType: "application" },
  { field: "capabilityId", subjectType: "capability" },
  { field: "repositoryId", subjectType: "repository" },
  { field: "workspaceId", subjectType: "workspace" },
]);

function enterpriseContextSubjectRows(context) {
  const enterpriseContext = context.enterpriseContext ?? null;
  if (enterpriseContext === null) return [];
  const contextColumns = enterpriseContextColumns(context);
  const rows = [];
  for (const [depth, entry] of enterpriseContextSubjectOrder.entries()) {
    const subjectId = enterpriseContext[entry.field];
    if (subjectId === null || subjectId === undefined) continue;
    rows.push({
      ...contextColumns,
      subjectType: entry.subjectType,
      subjectId,
      depth,
    });
  }
  return rows;
}

function enterpriseContextRelationshipRows(context) {
  const subjects = enterpriseContextSubjectRows(context);
  if (subjects.length === 0) return [];
  const contextColumns = enterpriseContextColumns(context);
  const rows = [];
  for (let index = 1; index < subjects.length; index += 1) {
    rows.push({
      ...contextColumns,
      fromSubjectType: subjects[index - 1].subjectType,
      fromSubjectId: subjects[index - 1].subjectId,
      toSubjectType: subjects[index].subjectType,
      toSubjectId: subjects[index].subjectId,
      relationshipType: "CONTEXT_PARENT_OF",
    });
  }
  return rows;
}

const parameter = (name, type = "string", nullable = true) => ({ name, type, required: false, nullable });
const next = (queryId, label, parameterBindings = {}) => ({ queryId, label, parameterBindings });

export function buildsReportQueryContext(view, index, canonicalFeatureQueryPlane = {}) {
  const context = { ...view, ...canonicalFeatureQueryPlane, sourceIndex: index, callGraph: safelyBuildsCallGraph(index) };
  context.occurrenceEvidence = buildsOccurrenceEvidence(context);
  context.callPathRows = buildsCallPathRows(context);
  context.invocationRows = buildsInvocationRows(context);
  context.commandExecutionGraphRows = buildsCommandExecutionGraphRows(context);
  context.featureIntentProposalPackets = buildsFeatureIntentProposalPackets(context);
  const enterpriseRegistry = buildsEnterpriseSubjectRegistry(context.enterpriseContext);
  context.enterpriseSubjects = enterpriseRegistry.enterpriseSubjects;
  context.enterpriseSubjectRelationships = enterpriseRegistry.enterpriseSubjectRelationships;
  context.testCliCoverage = (context.interfaceGovernance.commands ?? []).map((command) => {
    const commandTests = (context.testTraceability?.originatingCliFeatures ?? []).filter((row) => row.commandName === command.commandName);
    const testIds = uniqueSorted(commandTests.map((row) => row.testId));
    const featureSpecificTestIds = uniqueSorted(commandTests.filter((row) => row.coverageDisposition === "FEATURE_SPECIFIC_TEST_REACHABILITY").map((row) => row.testId));
    const sharedOnlyTestIds = testIds.filter((testId) => !featureSpecificTestIds.includes(testId));
    const proofLinkedScenarioIds = uniqueSorted((context.testTraceability?.scenarioLineage ?? []).filter((row) => command.canonicalScenarioIds.includes(row.scenarioId)).map((row) => row.scenarioId));
    const provenScenarioIds = uniqueSorted((context.testTraceability?.scenarioProofCoverage ?? []).filter((row) => command.canonicalScenarioIds.includes(row.scenarioId) && row.proofCount > 0).map((row) => row.scenarioId));
    return { commandName: command.commandName, handlerName: command.handlerName, entryPointId: command.entryPointId, reachableCallableCount: command.reachableCallableCount, testIds, testsReachingGraph: testIds.length, featureSpecificTestIds, featureSpecificTests: featureSpecificTestIds.length, sharedOnlyTestIds, sharedOnlyTests: sharedOnlyTestIds.length, canonicalScenarioIds: command.canonicalScenarioIds, proofLinkedScenarioIds, provenScenarioIds, scenarioGapIds: command.canonicalScenarioIds.filter((scenarioId) => !provenScenarioIds.includes(scenarioId)) };
  });
  context.completeFeatureLineageRows = buildsCompleteFeatureLineageRows(context);
  context.authoring = buildsAuthoringEvidenceContext(context);
  return context;
}

export const reportDrillDownQueries = Object.freeze([
  {
    queryId: "cli.traceability-summary.v1", section: "CLI Traceability", depth: 0,
    queryText: "SELECT * FROM reportInterfaceGovernanceSummary",
    inputCollections: ["reportInterfaceGovernanceSummary"], expectedResultSchema: "one CLI-first closure and subtraction summary row", parameters: [],
    rows: (context) => [context.interfaceGovernance.summary],
    drillDowns: [next("cli.entry-points.v1", "Inspect CLI roots", {}), next("cli.callable-inventory.v1", "Inspect classified runtime callables", {}), next("cli.unreachable-callables.v1", "Inspect NO_CLI_REACHABILITY remainder", {})],
  },
  {
    queryId: "cli.feature-intent-proposal-packets.v1", section: "CLI Execution Graphs", depth: 1,
    queryText: "SELECT * FROM reportCliFeatureIntentProposalPackets WHERE (:commandName IS NULL OR commandId = :commandName) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY commandId",
    inputCollections: ["reportCliCommandExecutionGraphs", "intentFeatureRegistry", "intentResponsibilityRegistry"], expectedResultSchema: "one graph-backed feature-intent proposal or reconciliation packet per distinct CLI execution slice",
    parameters: [parameter("commandName"), parameter("entryPointId"), parameter("proposalDisposition")],
    rows: (context) => context.featureIntentProposalPackets,
    drillDowns: [next("cli.command-execution-graphs.v1", "Inspect execution graph evidence", { entryPointId: ":entryPointId" }), next("trace.responsibility-to-command-graph.v1", "Inspect responsibility bindings", { entryPointId: ":entryPointId" })],
    rowDrillDowns: (row) => [next("cli.command-execution-graphs.v1", "Inspect execution graph evidence", { entryPointId: row.entryPointId }), next("trace.responsibility-to-command-graph.v1", "Inspect responsibility bindings", { entryPointId: row.entryPointId })],
  },
  {
    queryId: "trace.feature-complete-lineage.v1", section: "Canonical Trace", depth: 0,
    queryText: "SELECT * FROM completeFeatureLineage WHERE featureId = :featureId",
    inputCollections: ["gherkinFeatureRegistry", "intentFeatureRegistry", "intentScenarioRegistry", "intentResponsibilityRegistry", "reportCliCommands", "reportCliCommandExecutionGraphs", "sourceMechanics", "reportTestScenarioLineage", "reportScenarioProofCoverage"],
    expectedResultSchema: "one nested feature-rooted lineage row containing Gherkin, intent, interface, complete execution graph, source mechanics, tests, and proof posture",
    parameters: [parameter("featureId")], rows: (context) => context.completeFeatureLineageRows,
    drillDowns: [next("gherkin.feature-by-id.v1", "Inspect Gherkin feature", { featureId: ":featureId" }), next("cli.command-execution-graphs.v1", "Inspect execution graph", {}), next("test.scenario-lineage.v1", "Inspect test lineage", { featureId: ":featureId" })],
    terminal: true,
  },
  {
    queryId: "test.summary.v1", section: "Test Traceability", depth: 0,
    queryText: "SELECT * FROM reportTestTraceabilitySummary",
    inputCollections: ["reportTestTraceabilitySummary"], expectedResultSchema: "one test-to-intent closure summary row",
    parameters: [], rows: (context) => [context.testTraceability?.summary ?? {}],
    drillDowns: [next("test.inventory.v1", "Inspect test inventory", {}), next("test.scenario-lineage.v1", "Inspect scenario lineage", {}), next("test.without-canonical-lineage.v1", "Inspect unresolved test lineage", {})],
  },
  {
    queryId: "test.inventory.v1", section: "Test Traceability", depth: 0,
    queryText: "SELECT * FROM reportTestInventory WHERE (:testId IS NULL OR testId = :testId) AND (:modulePath IS NULL OR modulePath = :modulePath) ORDER BY modulePath, startLine",
    inputCollections: ["reportTestInventory"], expectedResultSchema: "every statically declared test case with stable identity and source location",
    parameters: [parameter("testId"), parameter("modulePath"), parameter("executionStatus")], rows: (context) => context.testTraceability?.inventory ?? [],
    drillDowns: [next("test.production-reachability.v1", "Inspect production execution", { testId: ":testId" }), next("test.scenario-lineage.v1", "Inspect canonical lineage", { testId: ":testId" })],
    rowDrillDowns: (row) => [next("test.production-reachability.v1", "Inspect production execution", { testId: row.testId }), next("test.scenario-lineage.v1", "Inspect canonical lineage", { testId: row.testId })],
  },
  {
    queryId: "test.production-reachability.v1", section: "Test Traceability", depth: 1,
    queryText: "SELECT * FROM reportTestProductionReachability WHERE (:testId IS NULL OR testId = :testId) AND (:productionSymbolId IS NULL OR productionSymbolId = :productionSymbolId) ORDER BY testFile, testId, depth",
    inputCollections: ["reportTestProductionReachability"], expectedResultSchema: "test-rooted production call paths with direct or indirect posture",
    parameters: [parameter("testId"), parameter("productionSymbolId"), parameter("cliClosureClassification")], rows: (context) => context.testTraceability?.productionReachability ?? [],
    drillDowns: [next("test.originating-cli-features.v1", "Join production paths to CLI graphs", { testId: ":testId" })],
    rowDrillDowns: (row) => [next("test.originating-cli-features.v1", "Join production path to CLI graphs", { testId: row.testId })],
  },
  {
    queryId: "test.originating-cli-features.v1", section: "Test Traceability", depth: 2,
    queryText: "SELECT * FROM reportTestOriginatingCliFeatures WHERE (:testId IS NULL OR testId = :testId) AND (:commandName IS NULL OR commandName = :commandName)",
    inputCollections: ["reportTestProductionReachability", "reportCliCommandExecutionGraphs"], expectedResultSchema: "tests joined to consumer CLI command execution slices",
    parameters: [parameter("testId"), parameter("commandName"), parameter("entryPointId")], rows: (context) => context.testTraceability?.originatingCliFeatures ?? [],
    drillDowns: [next("cli.command-execution-graphs.v1", "Inspect covered CLI graph", { entryPointId: ":entryPointId" }), next("test.scenario-lineage.v1", "Inspect scenario proof lineage", { testId: ":testId" })],
  },
  {
    queryId: "test.scenario-lineage.v1", section: "Test Traceability", depth: 2,
    queryText: "SELECT * FROM reportTestScenarioLineage WHERE (:testId IS NULL OR testId = :testId) AND (:scenarioId IS NULL OR scenarioId = :scenarioId)",
    inputCollections: ["reportTestProductionReachability", "intentResponsibilityRegistry"], expectedResultSchema: "test to feature, scenario, responsibility, obligation, and expected-signal lineage",
    parameters: [parameter("testId"), parameter("featureId"), parameter("scenarioId"), parameter("responsibilityId"), parameter("obligationId"), parameter("lineageStatus")], rows: (context) => context.testTraceability?.scenarioLineage ?? [],
    drillDowns: [next("test.scenario-proof-coverage.v1", "Inspect scenario proof coverage", { scenarioId: ":scenarioId" })],
  },
  {
    queryId: "test.scenario-proof-coverage.v1", section: "Test Traceability", depth: 1,
    queryText: "SELECT * FROM reportScenarioProofCoverage WHERE (:scenarioId IS NULL OR scenarioId = :scenarioId) ORDER BY featureId, scenarioId",
    inputCollections: ["intentScenarioRegistry", "reportTestScenarioLineage"], expectedResultSchema: "canonical scenario proof counts, expected signals, and test identities",
    parameters: [parameter("featureId"), parameter("scenarioId"), parameter("proofDisposition")], rows: (context) => context.testTraceability?.scenarioProofCoverage ?? [],
    drillDowns: [next("test.scenario-lineage.v1", "Inspect proving tests", { scenarioId: ":scenarioId" })],
  },
  {
    queryId: "test.unreachable-production-dependencies.v1", section: "Test Fat and Waste", depth: 1,
    queryText: "SELECT * FROM reportTestProductionReachability WHERE cliClosureClassification = 'NO_CLI_REACHABILITY'",
    inputCollections: ["reportTestProductionReachability", "reportCallableInventory"], expectedResultSchema: "tests preserving production callables with no CLI reachability",
    parameters: [parameter("testId"), parameter("productionSymbolId")], rows: (context) => context.testTraceability?.unreachableProductionDependencies ?? [],
    drillDowns: [next("test.removal-impact.v1", "Inspect joint removal impact", { testId: ":testId" })],
  },
  {
    queryId: "test.without-canonical-lineage.v1", section: "Test Fat and Waste", depth: 1,
    queryText: "SELECT * FROM reportTestPostures WHERE posture = 'NO_CANONICAL_TEST_LINEAGE'",
    inputCollections: ["reportTestPostures"], expectedResultSchema: "tests reaching production without canonical or admitted supporting lineage",
    parameters: [parameter("testId"), parameter("modulePath")], rows: (context) => context.testTraceability?.withoutCanonicalLineage ?? [],
    drillDowns: [next("test.production-reachability.v1", "Inspect unjustified production paths", { testId: ":testId" }), next("test.removal-impact.v1", "Inspect removal impact", { testId: ":testId" })],
  },
  {
    queryId: "test.supporting-lineage.v1", section: "Test Traceability", depth: 1,
    queryText: "SELECT * FROM reportTestPostures WHERE posture IN ('SHARED_INFRASTRUCTURE_PROOF','KERNEL_PRIMITIVE_CONFORMANCE','MECHANIC_FREE_ADAPTER_WIRING_PROOF')",
    inputCollections: ["reportTestPostures"], expectedResultSchema: "tests justified by admitted supporting infrastructure posture",
    parameters: [parameter("testId"), parameter("posture")], rows: (context) => (context.testTraceability?.testPostures ?? []).filter((row) => ["SHARED_INFRASTRUCTURE_PROOF", "KERNEL_PRIMITIVE_CONFORMANCE", "MECHANIC_FREE_ADAPTER_WIRING_PROOF"].includes(row.posture)),
    terminal: true,
  },
  {
    queryId: "test.duplicate-obligation-proof.v1", section: "Test Fat and Waste", depth: 1,
    queryText: "SELECT * FROM reportDuplicateObligationProofCandidates ORDER BY obligationId",
    inputCollections: ["reportTestScenarioLineage"], expectedResultSchema: "obligations restated by multiple tests and requiring fixture-class review",
    parameters: [parameter("obligationId")], rows: (context) => context.testTraceability?.duplicateObligationProof ?? [],
    drillDowns: [next("test.scenario-lineage.v1", "Inspect duplicate proving tests", { obligationId: ":obligationId" })],
  },
  {
    queryId: "scenario.without-test-proof.v1", section: "Test Fat and Waste", depth: 1,
    queryText: "SELECT * FROM reportScenarioProofCoverage WHERE proofDisposition = 'SCENARIO_WITHOUT_TEST_PROOF'",
    inputCollections: ["intentScenarioRegistry", "reportTestScenarioLineage"], expectedResultSchema: "canonical or proposed scenarios with no observed executable test proof",
    parameters: [parameter("featureId"), parameter("scenarioId")], rows: (context) => context.testTraceability?.scenarioWithoutTestProof ?? [],
    drillDowns: [next("intent.scenario-lineage.v1", "Inspect unproved scenario intent", { scenarioId: ":scenarioId" })],
  },
  {
    queryId: "test.removal-impact.v1", section: "Test Fat and Waste", depth: 2,
    queryText: "SELECT * FROM reportTestRemovalImpact WHERE (:testId IS NULL OR testId = :testId)",
    inputCollections: ["reportTestPostures", "reportTestProductionReachability"], expectedResultSchema: "tests and production symbols that must be reviewed or removed together",
    parameters: [parameter("testId"), parameter("removalDisposition")], rows: (context) => context.testTraceability?.removalImpact ?? [],
    terminal: true,
  },
  {
    queryId: "test.cli-coverage.v1", section: "Test Traceability", depth: 1,
    queryText: "SELECT * FROM reportTestCliCoverage WHERE (:commandName IS NULL OR commandName = :commandName) ORDER BY commandName",
    inputCollections: ["reportCliCommands", "reportTestOriginatingCliFeatures", "reportTestScenarioLineage"], expectedResultSchema: "per-command callable, test, canonical scenario, proven scenario, and gap counts",
    parameters: [parameter("commandName"), parameter("entryPointId")], rows: (context) => context.testCliCoverage,
    drillDowns: [next("test.originating-cli-features.v1", "Inspect covering tests", { commandName: ":commandName" }), next("scenario.without-test-proof.v1", "Inspect proof gaps", {})],
  },
  {
    queryId: "cli.entry-points.v1", section: "CLI Traceability", depth: 0,
    queryText: "SELECT * FROM reportCliCommands WHERE (:commandName IS NULL OR commandName = :commandName) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY commandName",
    inputCollections: ["reportCliCommands"], expectedResultSchema: "observed CLI command token, runner symbol, exact source reference, product posture, feature access, and admission posture",
    parameters: [parameter("commandName"), parameter("entryPointId"), parameter("handlerName")], rows: (context) => context.interfaceGovernance.commands,
    drillDowns: [next("cli.entry-point-reachability.v1", "Inspect complete reachable graph slice", { entryPointId: ":entryPointId" })],
    rowDrillDowns: (row) => [next("cli.entry-point-reachability.v1", "Inspect complete reachable graph slice", { entryPointId: row.entryPointId })],
  },
  {
    queryId: "cli.command-execution-graphs.v1", section: "CLI Execution Graphs", depth: 1,
    queryText: "SELECT * FROM reportCliCommandExecutionGraphs WHERE (:commandName IS NULL OR commandName = :commandName) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY commandName, handlerName",
    inputCollections: ["reportCliCommandExecutionGraphs"], expectedResultSchema: "one complete resolved execution graph per exposed CLI command or internal exported root",
    parameters: [parameter("commandName"), parameter("entryPointId"), parameter("handlerName"), parameter("interfaceExposure")],
    rows: (context) => context.commandExecutionGraphRows,
    drillDowns: [next("cli.entry-point-reachability.v1", "Inspect flattened reachable callables", { entryPointId: ":entryPointId" }), next("cli.reachable-source-facts.v1", "Inspect mechanics reachable from the command", { entryPointId: ":entryPointId" })],
    rowDrillDowns: (row) => [next("cli.entry-point-reachability.v1", "Inspect flattened reachable callables", { entryPointId: row.entryPointId }), next("cli.reachable-source-facts.v1", "Inspect reachable mechanics", { entryPointId: row.entryPointId })],
  },
  {
    queryId: "cli.callable-inventory.v1", section: "CLI Traceability", depth: 0,
    queryText: "SELECT * FROM reportCallableInventory WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:classification IS NULL OR cliClosureClassification = :classification) ORDER BY modulePath, declarationLine",
    inputCollections: ["reportCallableInventory"], expectedResultSchema: "every runtime callable classified into the CLI-first closure taxonomy",
    parameters: [parameter("symbolId"), parameter("classification"), parameter("modulePath")], rows: (context) => context.interfaceGovernance.callableInventory,
    drillDowns: [next("cli.symbol-originating-commands.v1", "Inspect justifying CLI commands", { symbolId: ":symbolId" }), next("cli.unreachable-removal-impact.v1", "Inspect removal impact", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => row.cliClosureClassification === "NO_CLI_REACHABILITY"
      ? [next("cli.unreachable-removal-impact.v1", "Inspect removal impact", { symbolId: row.symbolId })]
      : [next("cli.symbol-originating-commands.v1", "Inspect justifying CLI commands", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.entry-point-reachability.v1", section: "CLI Reachability", depth: 1,
    queryText: "SELECT * FROM reportCliReachability WHERE (:entryPointId IS NULL OR entryPointId = :entryPointId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY entryPointId, depth, symbolId",
    inputCollections: ["reportCliReachability"], expectedResultSchema: "CLI root to reachable symbol rows with complete path and relationship witnesses",
    parameters: [parameter("entryPointId"), parameter("symbolId"), parameter("commandName")], rows: (context) => context.interfaceGovernance.reachability,
    drillDowns: [next("cli.symbol-originating-commands.v1", "Invert reachability to originating commands", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("cli.symbol-originating-commands.v1", "Inspect all originating commands", { symbolId: row.symbolId }), next("reachability.symbol-callees.v1", "Inspect outgoing calls", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.shared-reachability.v1", section: "CLI Reachability", depth: 1,
    queryText: "SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'SHARED_CLI_INFRASTRUCTURE' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine",
    inputCollections: ["reportCallableInventory"], expectedResultSchema: "callables reachable from more than one CLI root",
    parameters: [parameter("symbolId"), parameter("modulePath")], rows: (context) => context.interfaceGovernance.sharedReachability,
    drillDowns: [next("cli.symbol-originating-commands.v1", "Inspect sharing CLI commands", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("cli.symbol-originating-commands.v1", "Inspect sharing CLI commands", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.runtime-resolution-debt.v1", section: "CLI Reachability", depth: 1,
    queryText: "SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'RUNTIME_RESOLUTION_REQUIRED' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine",
    inputCollections: ["reportCallableInventory"], expectedResultSchema: "callables requiring runtime-sensitive resolution before CLI closure",
    parameters: [parameter("symbolId"), parameter("modulePath")], rows: (context) => context.interfaceGovernance.runtimeResolutionDebt,
    drillDowns: [next("reachability.symbol-callers.v1", "Inspect candidate callers", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("reachability.symbol-callers.v1", "Inspect candidate callers", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.reachable-source-facts.v1", section: "CLI Reachable Source Facts", depth: 2,
    queryText: "SELECT * FROM reportSourceFacts WHERE cliClosureClassification IN ('CLI_FEATURE_ROOT','CLI_FEATURE_REACHABLE','SHARED_CLI_INFRASTRUCTURE') AND (:entryPointId IS NULL OR :entryPointId IN originatingEntryPointIds) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine",
    inputCollections: ["reportSourceFacts"], expectedResultSchema: "exact mechanic occurrences owned by CLI-reachable symbols",
    parameters: [parameter("entryPointId"), parameter("symbolId"), parameter("modulePath"), parameter("mechanic")], rows: (context) => context.interfaceGovernance.reachableSourceFacts,
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect exact physical source", { occurrenceId: ":occurrenceId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect exact physical source", { occurrenceId: row.occurrenceId })],
  },
  {
    queryId: "cli.unreachable-callables.v1", section: "Fat and Waste Inventory", depth: 1,
    queryText: "SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'NO_CLI_REACHABILITY' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine",
    inputCollections: ["reportCallableInventory"], expectedResultSchema: "executable callable remainder after CLI reachability and explicit exclusions",
    parameters: [parameter("symbolId"), parameter("modulePath")], rows: (context) => context.interfaceGovernance.unreachableCallables,
    drillDowns: [next("cli.unreachable-removal-impact.v1", "Inspect deterministic removal impact", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("cli.unreachable-removal-impact.v1", "Inspect deterministic removal impact", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.unreachable-source-facts.v1", section: "Fat and Waste Inventory", depth: 2,
    queryText: "SELECT * FROM reportSourceFacts WHERE cliClosureClassification = 'NO_CLI_REACHABILITY' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine",
    inputCollections: ["reportSourceFacts"], expectedResultSchema: "exact executable mechanic occurrences owned by NO_CLI_REACHABILITY callables",
    parameters: [parameter("symbolId"), parameter("modulePath"), parameter("mechanic"), parameter("occurrenceId")], rows: (context) => context.interfaceGovernance.unreachableSourceFacts,
    drillDowns: [next("source-facts.occurrence-source-references.v1", "Inspect exact physical source", { occurrenceId: ":occurrenceId" }), next("cli.unreachable-removal-impact.v1", "Inspect owner removal impact", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect exact physical source", { occurrenceId: row.occurrenceId }), next("cli.unreachable-removal-impact.v1", "Inspect owner removal impact", { symbolId: row.symbolId })],
  },
  {
    queryId: "cli.symbol-originating-commands.v1", section: "Reverse CLI Justification", depth: 2,
    queryText: "SELECT * FROM reportCliOriginatingCommands WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY symbolId, depth, entryPointId",
    inputCollections: ["reportCliOriginatingCommands"], expectedResultSchema: "CLI commands and path witnesses that justify a callable",
    parameters: [parameter("symbolId"), parameter("entryPointId"), parameter("commandName")], rows: (context) => context.interfaceGovernance.originatingCommands,
    drillDowns: [next("cli.entry-point-reachability.v1", "Inspect complete path", { entryPointId: ":entryPointId", symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("cli.entry-point-reachability.v1", "Inspect complete path", { entryPointId: row.entryPointId, symbolId: row.symbolId })],
  },
  {
    queryId: "cli.unreachable-removal-impact.v1", section: "Removal Impact", depth: 3,
    queryText: "SELECT * FROM reportCliRemovalImpact WHERE (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, symbolName",
    inputCollections: ["reportCliRemovalImpact"], expectedResultSchema: "callers, callees, exports, authority, affected files, and deterministic removal disposition",
    parameters: [parameter("symbolId"), parameter("modulePath"), parameter("removalDisposition")], rows: (context) => context.interfaceGovernance.removalImpact,
    drillDowns: [next("reachability.symbol-callers.v1", "Inspect callers", { symbolId: ":symbolId" }), next("reachability.symbol-callees.v1", "Inspect callees", { symbolId: ":symbolId" })],
    rowDrillDowns: (row) => [next("reachability.symbol-callers.v1", "Inspect callers", { symbolId: row.symbolId }), next("reachability.symbol-callees.v1", "Inspect callees", { symbolId: row.symbolId })],
  },
  {
    queryId: "interface.summary.v1", section: "Interface Governance", depth: 0,
    queryText: "SELECT * FROM reportInterfaceGovernanceSummary",
    inputCollections: ["reportInterfaceGovernanceSummary"], expectedResultSchema: "one observed interface-governance summary row", parameters: [],
    rows: (context) => [context.interfaceGovernance.summary],
    drillDowns: [next("interface.cli-commands.v1", "Inspect CLI commands and feature access", {}), next("interface.authority-gaps.v1", "Inspect CLI governance gaps", {})],
  },
  {
    queryId: "interface.cli-commands.v1", section: "CLI Command Inventory", depth: 1,
    queryText: "SELECT * FROM reportCliCommands WHERE (:commandName IS NULL OR commandName = :commandName) AND (:handlerName IS NULL OR handlerName = :handlerName) AND (:featureId IS NULL OR :featureId IN canonicalFeatureIds) ORDER BY commandName, handlerName",
    inputCollections: ["reportCliCommands"], expectedResultSchema: "observed CLI command, handler, reachability, canonical feature access, and authority rows",
    parameters: [parameter("commandName"), parameter("handlerName"), parameter("featureId")],
    rows: (context) => context.interfaceGovernance.commands,
    drillDowns: [next("reachability.symbol-originating-entrypoints.v1", "Inspect command execution paths", { symbolId: ":entryPointId" }), next("feature-coverage.features.v1", "Inspect accessible canonical features", { featureId: ":featureId" }), next("interface.authority-gaps.v1", "Inspect interface authority gaps", { commandName: ":commandName" })],
    rowDrillDowns: (row) => [
      next("reachability.symbol-originating-entrypoints.v1", "Inspect command execution paths", { symbolId: row.entryPointId }),
      ...row.canonicalFeatureIds.map((featureId) => next("feature-coverage.features.v1", "Inspect accessible canonical feature", { featureId })),
      next("interface.authority-gaps.v1", "Inspect command governance gap", { commandName: row.commandName }),
    ],
  },
  {
    queryId: "interface.authority-gaps.v1", section: "CLI Authority Gaps", depth: 2,
    queryText: "SELECT * FROM reportCliCommands WHERE governanceGapDisposition <> 'CLI_INTERFACE_GOVERNED' AND (:commandName IS NULL OR commandName = :commandName) AND (:gapDisposition IS NULL OR governanceGapDisposition = :gapDisposition) ORDER BY governanceGapDisposition, commandName",
    inputCollections: ["reportCliCommands"], expectedResultSchema: "observed CLI commands lacking canonical feature linkage or direct interface authority",
    parameters: [parameter("commandName"), parameter("handlerName"), parameter("gapDisposition")],
    rows: (context) => context.interfaceGovernance.commands.filter((row) => row.governanceGapDisposition !== "CLI_INTERFACE_GOVERNED")
      .map((row) => ({ ...row, gapDisposition: row.governanceGapDisposition })),
    drillDowns: [next("interface.cli-commands.v1", "Inspect command evidence", { commandName: ":commandName" }), next("authority.documents.v1", "Inspect canonical authority", {})],
    rowDrillDowns: (row) => [next("interface.cli-commands.v1", "Inspect command evidence", { commandName: row.commandName }), next("reachability.symbol-originating-entrypoints.v1", "Inspect execution paths", { symbolId: row.entryPointId })],
  },
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
    rowDrillDowns: (row) => [next("scenario-conformance.scenario-call-paths.v1", "Inspect entry surfaces", { scenarioId: row.scenarioId }), next("source-facts.occurrence-source-references.v1", "Inspect source rows", { modulePath: row.bodyFile }), next("authoring.semantic-authority-evidence-bundle.v1", "Build authority-authoring evidence bundle", { responsibilityId: row.responsibilityId })],
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
    rowDrillDowns: (row) => [next("source-facts.occurrence-source-references.v1", "Inspect physical source reference", { occurrenceId: row.occurrenceId }), next("reachability.symbol-originating-entrypoints.v1", "Inspect originating interfaces", { symbolId: row.symbolId }), next("authoring.semantic-authority-evidence-bundle.v1", "Build authority-authoring evidence bundle", { occurrenceId: row.occurrenceId })],
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
    rowDrillDowns: (row) => [next("reachability.symbol-originating-entrypoints.v1", "Inspect entry surfaces", { symbolName: row.responsibility }), next("feature-coverage.unlined-occurrences.v1", "Inspect exact mechanics", { modulePath: row.modulePath, responsibility: row.responsibility }), next("authority.authority-near-symbol.v1", "Inspect authority", { modulePath: row.modulePath, symbolName: row.responsibility }), next("authoring.semantic-authority-evidence-bundle.v1", "Build authority-authoring evidence bundle", { responsibilityId: row.responsibility })],
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
    queryId: "enterprise.context.v1", section: "Enterprise Context", depth: 1,
    queryText: "SELECT * FROM reportEnterpriseContext WHERE (:enterpriseId IS NULL OR enterpriseId = :enterpriseId) AND (:portfolioId IS NULL OR portfolioId = :portfolioId) AND (:domainId IS NULL OR domainId = :domainId) AND (:applicationId IS NULL OR applicationId = :applicationId) AND (:capabilityId IS NULL OR capabilityId = :capabilityId) AND (:repositoryId IS NULL OR repositoryId = :repositoryId) AND (:workspaceId IS NULL OR workspaceId = :workspaceId)",
    inputCollections: ["reportEnterpriseContext"], expectedResultSchema: "one enterprise context row",
    parameters: [parameter("enterpriseId"), parameter("portfolioId"), parameter("domainId"), parameter("applicationId"), parameter("capabilityId"), parameter("repositoryId"), parameter("workspaceId"), parameter("contextAuthorityId")],
    rows: (context) => [context.enterpriseContext],
    drillDowns: [next("enterprise.subject-registry.v1", "Inspect enterprise subject registry", {})],
    rowDrillDowns: () => [next("enterprise.subject-registry.v1", "Inspect enterprise subject registry", {})],
  },
  {
    queryId: "enterprise.subject-registry.v1", section: "Enterprise Context", depth: 1,
    queryText: "SELECT * FROM reportEnterpriseSubjectRegistry WHERE (:enterpriseId IS NULL OR enterpriseId = :enterpriseId) AND (:portfolioId IS NULL OR portfolioId = :portfolioId) AND (:domainId IS NULL OR domainId = :domainId) AND (:applicationId IS NULL OR applicationId = :applicationId) AND (:capabilityId IS NULL OR capabilityId = :capabilityId) AND (:repositoryId IS NULL OR repositoryId = :repositoryId) AND (:workspaceId IS NULL OR workspaceId = :workspaceId)",
    inputCollections: ["reportEnterpriseContext"], expectedResultSchema: "zero or more typed enterprise subject rows",
    parameters: [parameter("enterpriseId"), parameter("portfolioId"), parameter("domainId"), parameter("applicationId"), parameter("capabilityId"), parameter("repositoryId"), parameter("workspaceId"), parameter("contextAuthorityId")],
    rows: (context) => context.enterpriseSubjects,
    drillDowns: [next("enterprise.subject-relationships.v1", "Inspect enterprise subject relationships", {})],
    rowDrillDowns: (row) => [next("enterprise.subject-relationships.v1", "Inspect enterprise subject relationships", { subjectType: row.subjectType, subjectId: row.subjectId })],
  },
  {
    queryId: "enterprise.subject-relationships.v1", section: "Enterprise Context", depth: 1,
    queryText: "SELECT * FROM reportEnterpriseSubjectRelationships WHERE (:enterpriseId IS NULL OR enterpriseId = :enterpriseId) AND (:portfolioId IS NULL OR portfolioId = :portfolioId) AND (:domainId IS NULL OR domainId = :domainId) AND (:applicationId IS NULL OR applicationId = :applicationId) AND (:capabilityId IS NULL OR capabilityId = :capabilityId) AND (:repositoryId IS NULL OR repositoryId = :repositoryId) AND (:workspaceId IS NULL OR workspaceId = :workspaceId) AND (:subjectType IS NULL OR fromSubjectType = :subjectType OR toSubjectType = :subjectType) AND (:subjectId IS NULL OR fromSubjectId = :subjectId OR toSubjectId = :subjectId)",
    inputCollections: ["reportEnterpriseContext"], expectedResultSchema: "zero or more typed enterprise subject relationship rows",
    parameters: [parameter("enterpriseId"), parameter("portfolioId"), parameter("domainId"), parameter("applicationId"), parameter("capabilityId"), parameter("repositoryId"), parameter("workspaceId"), parameter("subjectType"), parameter("subjectId"), parameter("contextAuthorityId")],
    rows: (context) => context.enterpriseSubjectRelationships,
    drillDowns: [next("subject-boundary.items-by-disposition.v1", "Inspect subject boundary items", {})],
    terminal: true,
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
    queryText: "SELECT occurrenceId, sourceReferenceId, modulePath, symbolId, mechanic, featureCoveragePosture, authorityHomeFile FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId)",
    inputCollections: ["reportOccurrenceEvidence"], expectedResultSchema: "source facts with missing lineage and healing posture", parameters: [parameter("sourceReferenceId")],
    rows: (context) => context.occurrenceEvidence.filter((row) => row.featureCoveragePosture === "FEATURE_COVERAGE_MISSING")
      .map((row) => ({ ...row, healingDisposition: "CONNECTIVE_TISSUE_CANDIDATE" })),
    drillDowns: authoringActionDrillDowns,
    rowDrillDowns: (row) => authoringActionDrillDowns.map((action) => ({
      ...action,
      parameterBindings: Object.fromEntries(Object.entries(action.parameterBindings)
        .filter(([, value]) => value !== ":symbolId" || row.symbolId)
        .map(([key, value]) => [key, value === ":occurrenceId" ? row.occurrenceId : value === ":symbolId" ? row.symbolId : value])),
    })),
    terminal: false,
  },
  ...authoringEvidenceQueries,
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
    if (key === "featureId") return row.featureId === value || row.subject?.candidateFeatureId === value || row.featureIds?.includes(value) || row.canonicalFeatureIds?.includes(value);
    if (key === "scenarioId") return row.scenarioId === value || row.subject?.candidateScenarioId === value || row.scenarioIds?.includes(value);
    if (key === "subjectType") return row.subjectType === value || row.fromSubjectType === value || row.toSubjectType === value;
    if (key === "subjectId") return row.subjectId === value || row.fromSubjectId === value || row.toSubjectId === value;
    if (key === "authorityFile") return row.authorityFile === value || row.authorityHomeFile === value;
    const candidate = row[key]
      ?? row.subject?.[key]
      ?? (key === "featureId" ? row.subject?.candidateFeatureId : undefined)
      ?? (key === "scenarioId" ? row.subject?.candidateScenarioId : undefined)
      ?? (key === "entryPointId" ? row.subject?.interfaceSurfaceId : undefined);
    return Array.isArray(candidate) ? candidate.includes(value) : candidate === value;
  }));
}
