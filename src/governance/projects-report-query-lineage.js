import { createHash } from "node:crypto";
import {
  buildsReportQueryContext,
  decoratesDrillDownRows,
  filtersRowsByParameters,
  reportDrillDownQueries,
  validatesParameterBindings,
} from "./report-drill-down-query-catalog.js";

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}

function hashes(value) {
  const text = typeof value === "string" ? value : JSON.stringify(canonicalizes(value));
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function freezes(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezes(child);
  return Object.freeze(value);
}

const catalog = Object.freeze([
  {
    queryId: "feature-coverage.summary.v1",
    section: "Executive Summary",
    queryText: "SELECT * FROM reportFeatureCoverageSummary",
    inputCollections: ["reportFeatureCoverageSummary"],
    expectedResultSchema: "one feature-coverage summary row",
    rows: (view) => [view.featureCoverage.summary],
  },
  {
    queryId: "scenario-conformance.summary.v1",
    section: "Executive Summary",
    queryText: "SELECT * FROM reportScenarioConformanceSummary",
    inputCollections: ["reportScenarioConformanceSummary"],
    expectedResultSchema: "one scenario-conformance summary row",
    rows: (view) => [view.scenarioConformance.summary],
  },
  {
    queryId: "feature-coverage.proposal-evidence.v1",
    section: "Feature Coverage Proposals",
    queryText: "SELECT * FROM reportFeatureCoverageProposals ORDER BY featureId",
    inputCollections: ["reportFeatureCoverageProposals"],
    expectedResultSchema: "zero or more feature proposal rows",
    rows: (view) => view.featureCoverage.proposals.map((proposal) => ({
      ...proposal,
      evidenceSymbolCount: proposal.evidence.symbols.length,
      scenarioCount: proposal.scenarios.length,
      responsibilityCount: proposal.responsibilities.length,
    })),
  },
  {
    queryId: "feature-coverage.live-inference.v1",
    section: "Live LLM Feature-Inference Evaluations",
    queryText: "SELECT * FROM reportLiveInferenceEvaluations ORDER BY featureId, evaluationFile",
    inputCollections: ["reportLiveInferenceEvaluations"],
    expectedResultSchema: "zero or more inference evaluation rows",
    rows: (view) => view.featureCoverage.liveInferenceEvaluations,
  },
  {
    queryId: "feature-coverage.unresolved-clusters.v1",
    section: "Unresolved Responsibility Evidence",
    queryText: "SELECT * FROM reportUnresolvedEvidenceClusters ORDER BY modulePath, responsibility",
    inputCollections: ["reportUnresolvedEvidenceClusters"],
    expectedResultSchema: "zero or more unresolved evidence-cluster rows",
    rows: (view) => view.featureCoverage.uncoveredClusters,
  },
  {
    queryId: "scenario-conformance.drilldown.v1",
    section: "Canonical Feature Drill-Down",
    queryText: "SELECT * FROM reportCanonicalFeatureDrilldown ORDER BY featureId",
    inputCollections: ["reportCanonicalFeatureDrilldown"],
    expectedResultSchema: "zero or more canonical feature rows with nested scenario evidence",
    rows: (view) => view.scenarioConformance.features.map((feature) => {
      const scenarios = feature.scenarios;
      const responsibilities = scenarios.flatMap((scenario) => scenario.obligations).flatMap((obligation) => obligation.responsibilities);
      return {
        ...feature,
        scenarioCount: scenarios.length,
        responsibilityCount: responsibilities.length,
        structurallyClosedCount: scenarios.filter((scenario) => scenario.structuralStatus === "STRUCTURALLY_CLOSED").length,
        runtimeConformantCount: scenarios.filter((scenario) => scenario.runtimeConformance === "CONFORMANT").length,
        lineageQualityFindingCount: feature.lineageQualityFindings.length,
      };
    }),
  },
  {
    queryId: "feature-coverage.unclassified-inventory.v1",
    section: "Evidence Without Canonical Lineage",
    queryText: "SELECT * FROM reportUnclassifiedInventory",
    inputCollections: ["reportUnclassifiedInventory"],
    expectedResultSchema: "one unclassified inventory row",
    rows: (view) => [{
      ...view.unclassifiedInventory,
      entityCoverage: view.featureCoverage.entityCoverage,
      knowHowRecords: view.knowHowRegistry.knowHowRecords,
      healingDrafts: view.healingDraftRegistry.drafts,
    }],
  },
  {
    queryId: "feature-coverage.unlined-mechanics.v1",
    section: "Evidence Without Canonical Lineage",
    queryText: "SELECT mechanic, COUNT(*) AS occurrenceCount, COUNT(DISTINCT modulePath) AS fileCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY mechanic ORDER BY mechanic",
    inputCollections: ["reportOccurrences"],
    expectedResultSchema: "zero or more mechanic lineage-gap aggregate rows",
    rows: (view) => {
      const byMechanic = new Map();
      for (const occurrence of view.occurrences) {
        if (occurrence.featureCoveragePosture !== "FEATURE_COVERAGE_MISSING") continue;
        const item = byMechanic.get(occurrence.mechanic) ?? { mechanic: occurrence.mechanic, occurrenceCount: 0, modulePaths: new Set() };
        item.occurrenceCount += 1;
        item.modulePaths.add(occurrence.modulePath);
        byMechanic.set(occurrence.mechanic, item);
      }
      return [...byMechanic.values()].map(({ mechanic, occurrenceCount, modulePaths }) => ({ mechanic, occurrenceCount, fileCount: modulePaths.size }))
        .sort((left, right) => left.mechanic.localeCompare(right.mechanic));
    },
  },
  {
    queryId: "subject-boundary.evidence.v1",
    section: "Subject Boundary",
    queryText: "SELECT * FROM reportSubjectBoundary",
    inputCollections: ["reportSubjectBoundary"],
    expectedResultSchema: "one subject-boundary row",
    rows: (view) => [view.subjectScope],
  },
  ...reportDrillDownQueries,
]);

const baseQueryDrillDowns = Object.freeze({
  "feature-coverage.summary.v1": [
    { queryId: "feature-coverage.features.v1", label: "Inspect canonical features", parameterBindings: {} },
    { queryId: "scenario-conformance.scenarios.v1", label: "Inspect canonical scenarios", parameterBindings: {} },
    { queryId: "feature-coverage.unlined-mechanics.v1", label: "Group mechanics without lineage", parameterBindings: { posture: "FEATURE_COVERAGE_MISSING" } },
    { queryId: "responsibility-evidence.cluster-by-id.v1", label: "Inspect unresolved responsibility clusters", parameterBindings: {} },
    { queryId: "authority.documents.v1", label: "Inspect authority lineage", parameterBindings: {} },
  ],
  "scenario-conformance.summary.v1": [
    { queryId: "scenario-conformance.scenarios.v1", label: "Inspect scenarios", parameterBindings: {} },
    { queryId: "scenario-conformance.by-structural-status.v1", label: "Filter by structural status", parameterBindings: {} },
  ],
  "feature-coverage.proposal-evidence.v1": [
    { queryId: "responsibility-evidence.cluster-by-id.v1", label: "Inspect grounding responsibility cluster", parameterBindings: {} },
  ],
  "feature-coverage.live-inference.v1": [
    { queryId: "source-facts.occurrence-source-references.v1", label: "Inspect inference source evidence", parameterBindings: {} },
  ],
  "feature-coverage.unresolved-clusters.v1": [
    { queryId: "responsibility-evidence.cluster-by-id.v1", label: "Inspect individual cluster", parameterBindings: {} },
  ],
  "scenario-conformance.drilldown.v1": [
    { queryId: "scenario-conformance.scenario-responsibilities.v1", label: "Inspect scenario responsibilities", parameterBindings: {} },
    { queryId: "scenario-conformance.scenario-call-paths.v1", label: "Inspect scenario call paths", parameterBindings: {} },
  ],
  "feature-coverage.unclassified-inventory.v1": [
    { queryId: "authority.documents.v1", label: "Inspect authority without lineage", parameterBindings: {} },
  ],
  "feature-coverage.unlined-mechanics.v1": [
    { queryId: "feature-coverage.unlined-mechanics-by-file.v1", label: "Group by file", parameterBindings: {} },
    { queryId: "feature-coverage.unlined-mechanics-by-responsibility.v1", label: "Group by responsibility", parameterBindings: {} },
    { queryId: "feature-coverage.unlined-mechanics-by-symbol.v1", label: "Group by symbol", parameterBindings: {} },
    { queryId: "feature-coverage.unlined-occurrences.v1", label: "Inspect exact occurrences", parameterBindings: {} },
  ],
  "subject-boundary.evidence.v1": [
    { queryId: "subject-boundary.items-by-disposition.v1", label: "Inspect included and excluded items", parameterBindings: {} },
    { queryId: "subject-boundary.included-items.v1", label: "Inspect included items", parameterBindings: {} },
    { queryId: "subject-boundary.excluded-items.v1", label: "Inspect excluded items", parameterBindings: {} },
  ],
  "authoring.reconciliation.v1": [
    { queryId: "authoring.readiness.v1", label: "Inspect every authoring readiness disposition", parameterBindings: {} },
    { queryId: "authoring.semantic-authority-evidence-bundle.v1", label: "Inspect authority-authoring evidence bundles", parameterBindings: {} },
  ],
});

function drillDownsForQuery(query) {
  return query.drillDowns ?? baseQueryDrillDowns[query.queryId] ?? [];
}

function decoratesBaseRows(queryId, rows) {
  if (queryId === "feature-coverage.unlined-mechanics.v1") {
    return rows.map((row) => ({ ...row, drillDowns: [
      { queryId: "feature-coverage.unlined-mechanics-by-file.v1", label: "Inspect files", parameterBindings: { mechanic: row.mechanic } },
      { queryId: "feature-coverage.unlined-mechanics-by-responsibility.v1", label: "Inspect responsibilities", parameterBindings: { mechanic: row.mechanic } },
      { queryId: "feature-coverage.unlined-occurrences.v1", label: "Inspect exact occurrences", parameterBindings: { mechanic: row.mechanic } },
    ] }));
  }
  if (queryId === "feature-coverage.unresolved-clusters.v1") {
    return rows.map((row) => ({ ...row, drillDowns: [
      { queryId: "responsibility-evidence.cluster-by-id.v1", label: "Inspect cluster context", parameterBindings: { clusterId: row.clusterId } },
    ] }));
  }
  if (queryId === "scenario-conformance.drilldown.v1") {
    return rows.map((row) => ({ ...row, drillDowns: [
      { queryId: "feature-coverage.feature-scenarios.v1", label: "Inspect feature scenarios", parameterBindings: { featureId: row.featureId } },
      { queryId: "scenario-conformance.scenario-call-paths.v1", label: "Inspect feature call paths", parameterBindings: { featureId: row.featureId } },
    ] }));
  }
  return rows;
}

export class FactQueryLineageError extends Error {
  constructor(disposition, detail) {
    super(`${disposition}: ${detail}`);
    this.name = "FactQueryLineageError";
    this.disposition = disposition;
  }
}

function pointerSegments(pointer) {
  if (pointer === "") return [];
  if (!pointer.startsWith("/")) throw new FactQueryLineageError("FACT_QUERY_RESULT_NOT_INSPECTABLE", `invalid JSON pointer ${pointer}`);
  return pointer.slice(1).split("/").map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
}

export function resolvesJsonPointer(value, pointer) {
  return pointerSegments(pointer).reduce((current, segment) => current?.[segment], value);
}

function scalarClaims(queryId, value, reportBasePointer, resultBasePointer, claimType = "DIRECT_FACT") {
  const claims = [];
  function visit(current, reportPointer, resultPointer) {
    if (current !== null && typeof current === "object") {
      for (const [key, child] of Object.entries(current)) visit(child, `${reportPointer}/${key}`, `${resultPointer}/${key}`);
      return;
    }
    claims.push({
      claimId: `${queryId}.${reportPointer.slice(1).replaceAll("/", ".")}`,
      claimType,
      queryId,
      reportPointer,
      valuePointer: resultPointer,
    });
  }
  visit(value, reportBasePointer, resultBasePointer);
  return claims;
}

export function reconcilesReportQueryLineage(report) {
  const lineage = report?.queryLineage;
  if (lineage?.documentKind !== "source-facts-report-query-lineage.v1") {
    throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", "report query lineage is absent");
  }
  const registrations = new Map(lineage.registeredQueries.map((query) => [query.queryId, query]));
  const receipts = new Map(lineage.queryReceipts.map((receipt) => [receipt.queryId, receipt]));
  if (registrations.size !== lineage.registeredQueries.length || receipts.size !== lineage.queryReceipts.length) {
    throw new FactQueryLineageError("FACT_WITHOUT_REGISTERED_QUERY", "duplicate query identity");
  }
  if (lineage.catalog.catalogHash !== hashes(lineage.registeredQueries)) {
    throw new FactQueryLineageError("FACT_QUERY_RECEIPT_STALE", "query catalog hash");
  }
  const validatesDrillDown = (drillDown, owner) => {
    const target = registrations.get(drillDown.queryId);
    if (!target) throw new FactQueryLineageError("FACT_DRILLDOWN_QUERY_UNREGISTERED", `${owner} -> ${drillDown.queryId}`);
    if (!validatesParameterBindings(target, drillDown.parameterBindings ?? {})) {
      throw new FactQueryLineageError("FACT_DRILLDOWN_PARAMETER_INVALID", `${owner} -> ${drillDown.queryId}`);
    }
  };
  for (const registration of lineage.registeredQueries) {
    if (!registration.terminal && registration.drillDowns.length === 0) {
      throw new FactQueryLineageError("FACT_DRILLDOWN_DEAD_END", registration.queryId);
    }
    for (const drillDown of registration.drillDowns) validatesDrillDown(drillDown, registration.queryId);
  }
  const expectedScope = `workspace-prefix:${report.subjectScope.workspaceRelativePrefix || "(repository-root)"}`;
  for (const receipt of lineage.queryReceipts) {
    const registration = registrations.get(receipt.queryId);
    if (!registration) throw new FactQueryLineageError("FACT_WITHOUT_REGISTERED_QUERY", receipt.queryId);
    if (registration.scopePolicy !== expectedScope) throw new FactQueryLineageError("FACT_QUERY_SCOPE_MISMATCH", receipt.queryId);
    if (registration.queryHash !== hashes(registration.queryText) || receipt.queryHash !== registration.queryHash) {
      throw new FactQueryLineageError("FACT_QUERY_RECEIPT_STALE", `${receipt.queryId} query text`);
    }
    if (!Array.isArray(receipt.result?.rows) || receipt.execution.rowCount !== receipt.result.rows.length) {
      throw new FactQueryLineageError("FACT_QUERY_RESULT_SHAPE_INVALID", receipt.queryId);
    }
    if (receipt.index.indexId !== report.index.indexId || receipt.index.scanId !== report.index.scanId) {
      throw new FactQueryLineageError("FACT_QUERY_INDEX_MISMATCH", receipt.queryId);
    }
    if (receipt.execution.disposition !== "RELATIONAL_QUERY_EXECUTED") {
      throw new FactQueryLineageError("FACT_QUERY_RESULT_NOT_INSPECTABLE", receipt.queryId);
    }
    if (hashes(receipt.result.rows) !== receipt.execution.resultHash) {
      throw new FactQueryLineageError("FACT_QUERY_RECEIPT_STALE", receipt.queryId);
    }
    for (const drillDown of receipt.drillDowns) validatesDrillDown(drillDown, receipt.queryId);
    for (const [position, row] of receipt.result.rows.entries()) {
      for (const drillDown of row.drillDowns ?? []) validatesDrillDown(drillDown, `${receipt.queryId}/rows/${position}`);
    }
  }
  const requiredAuthoringQueries = [
    "authoring.interface-execution-slice.v1", "authoring.responsibility-body-evidence.v1",
    "authoring.decision-evidence.v1", "authoring.fallback-evidence.v1", "authoring.validation-evidence.v1",
    "authoring.failure-policy-evidence.v1", "authoring.object-shape-evidence.v1",
    "authoring.result-contract-evidence.v1", "authoring.serialization-evidence.v1",
    "authoring.normalization-evidence.v1", "authoring.iteration-evidence.v1",
    "authoring.state-transition-evidence.v1", "authoring.data-flow-slice.v1",
    "authoring.authority-overlap.v1", "authoring.scenario-context.v1", "authoring.projection-target.v1",
    "authoring.proof-vector-candidates.v1", "authoring.contract-map.v1",
    "authoring.semantic-authority-evidence-bundle.v1", "authoring.readiness.v1", "authoring.reconciliation.v1",
  ];
  for (const queryId of requiredAuthoringQueries) {
    if (!registrations.has(queryId) || !receipts.has(queryId)) throw new FactQueryLineageError("AUTHORING_QUERY_MISSING", queryId);
  }
  const healingRows = receipts.get("healing.source-fact-candidates.v1")?.result.rows ?? [];
  const bundleRows = receipts.get("authoring.semantic-authority-evidence-bundle.v1")?.result.rows ?? [];
  const sourceBundleRows = bundleRows.filter((row) => row.subjectKind === "SOURCE_OCCURRENCE");
  const authoringRowIds = new Map(lineage.queryReceipts.map((receipt) => [receipt.queryId,
    new Set(receipt.result.rows.map((row) => row.resultRowId).filter(Boolean))]));
  if (sourceBundleRows.length !== healingRows.length || lineage.authoringReconciliation.incompleteEvidenceBundles !== 0) {
    throw new FactQueryLineageError("AUTHORING_EVIDENCE_BUNDLE_INCOMPLETE", `${sourceBundleRows.length}/${healingRows.length}`);
  }
  for (const bundle of bundleRows) {
    if (bundle.documentKind !== "semantic-authority-authoring-evidence-bundle.v1" || bundle.lifecycle !== "OBSERVED_EVIDENCE") {
      throw new FactQueryLineageError("AUTHORING_EVIDENCE_BUNDLE_INCOMPLETE", bundle.occurrenceId);
    }
    for (const reference of bundle.queryReceipts) {
      const rows = authoringRowIds.get(reference.queryId);
      if (!rows || reference.resultRowIds.some((resultRowId) => !rows.has(resultRowId))) {
        throw new FactQueryLineageError("AUTHORING_EVIDENCE_BUNDLE_INCOMPLETE", `${bundle.occurrenceId}:${reference.queryId}`);
      }
    }
    const hasQueryBackedBodyEvidence = bundle.subjectKind === "DECLARED_RESPONSIBILITY"
      && bundle.bodyContext?.rowCount > 0
      && bundle.queryReceipts.some((reference) => reference.queryId === "authoring.responsibility-body-evidence.v1");
    if (!bundle.subject.sourceReferenceId && !hasQueryBackedBodyEvidence
      && !bundle.unresolvedEvidence.includes("AUTHORING_SOURCE_REFERENCE_MISSING")) {
      throw new FactQueryLineageError("AUTHORING_SOURCE_REFERENCE_MISSING", bundle.occurrenceId);
    }
    if (bundle.authoringReadinessDisposition === "INSUFFICIENT_INTERFACE_EVIDENCE"
      && (!bundle.readyForProjection || bundle.projectionReadinessDisposition !== "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP")) {
      throw new FactQueryLineageError("AUTHORING_EVIDENCE_BUNDLE_INCOMPLETE", `${bundle.subjectKind}:${bundle.subjectKey}:interface-gap-not-projectable`);
    }
    if (bundle.interfaceContext.reachabilityDisposition !== "ORIGINATING_ENTRYPOINT_OBSERVED"
      && !bundle.unresolvedEvidence.includes("AUTHORING_CALL_PATH_UNRESOLVED")) {
      throw new FactQueryLineageError("AUTHORING_CALL_PATH_UNRESOLVED", bundle.occurrenceId);
    }
    if (bundle.scenarioContext?.scenarioAuthorityDisposition === "SCENARIO_AUTHORITY_MISSING"
      && !bundle.unresolvedEvidence.includes("AUTHORING_SCENARIO_CONTEXT_MISSING")) {
      throw new FactQueryLineageError("AUTHORING_SCENARIO_CONTEXT_MISSING", bundle.occurrenceId);
    }
    if (bundle.existingAuthorityContext.length === 0
      && !bundle.unresolvedEvidence.includes("AUTHORING_AUTHORITY_OVERLAP_NOT_EVALUATED")) {
      throw new FactQueryLineageError("AUTHORING_AUTHORITY_OVERLAP_NOT_EVALUATED", bundle.occurrenceId);
    }
    if (bundle.proofCandidates.rowCount === 0 && bundle.subject.symbolId
      && !bundle.unresolvedEvidence.includes("AUTHORING_PROOF_VECTOR_MISSING")) {
      throw new FactQueryLineageError("AUTHORING_PROOF_VECTOR_MISSING", bundle.occurrenceId);
    }
  }
  if (lineage.reconciliation.claimCount !== lineage.claims.length) {
    throw new FactQueryLineageError("FACT_QUERY_RESULT_SHAPE_INVALID", "reconciliation claim count");
  }
  if (lineage.reconciliation.disposition !== "PASSED"
    || lineage.reconciliation.claimsWithQueryPointers !== lineage.claims.length
    || lineage.reconciliation.receiptsExecuted !== lineage.queryReceipts.length
    || lineage.reconciliation.receiptsValid !== lineage.queryReceipts.length
    || lineage.reconciliation.claimsWithRequiredDrillDownPath !== lineage.claims.length
    || [
      "missingQueryPointers", "unsupportedFactualClaims", "staleReceipts", "indexMismatches",
      "scopeMismatches", "resultShapeFailures", "resultHashFailures", "renderedValueMismatches",
      "deterministicRerunMismatches", "claimsLackingDrillDownPath", "brokenDrillDownQueryReferences",
      "invalidDrillDownParameterBindings", "drillDownResultSchemaFailures",
    ].some((key) => lineage.reconciliation[key] !== 0)) {
    throw new FactQueryLineageError("FACT_QUERY_RESULT_SHAPE_INVALID", "reconciliation summary");
  }
  for (const claim of lineage.claims) {
    const receipt = receipts.get(claim.queryId);
    if (!receipt) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", claim.queryId);
    if (!Array.isArray(claim.drillDowns) || claim.drillDowns.length === 0) {
      throw new FactQueryLineageError("FACT_DRILLDOWN_QUERY_MISSING", claim.claimId);
    }
    for (const drillDown of claim.drillDowns) validatesDrillDown(drillDown, claim.claimId);
    const reported = resolvesJsonPointer(report, claim.reportPointer);
    const queried = resolvesJsonPointer(receipt.result, claim.valuePointer);
    if (JSON.stringify(canonicalizes(reported)) !== JSON.stringify(canonicalizes(queried))) {
      throw new FactQueryLineageError("FACT_RENDER_VALUE_MISMATCH", claim.claimId);
    }
  }
  return report;
}

export function projectsReportQueryLineage(view, index) {
  const indexId = index.indexId ?? null;
  const scanId = index.manifest?.scanId ?? null;
  const scopePolicy = `workspace-prefix:${view.subjectScope.workspaceRelativePrefix || "(repository-root)"}`;
  const context = buildsReportQueryContext(view, index);
  const registeredQueries = catalog.map(({ rows: _rows, rowDrillDowns: _rowDrillDowns, ...query }) => freezes({
    queryId: query.queryId,
    section: query.section,
    queryText: query.queryText,
    inputCollections: query.inputCollections,
    expectedResultSchema: query.expectedResultSchema,
    depth: query.depth ?? 0,
    parameters: query.parameters ?? (query.queryId === "feature-coverage.unlined-mechanics.v1"
      ? [{ name: "posture", type: "string", required: false, nullable: true }, { name: "mechanic", type: "string", required: false, nullable: true }]
      : []),
    drillDowns: drillDownsForQuery(query),
    terminal: query.terminal === true,
    queryVersion: "1.0.0",
    scopePolicy,
    queryHash: hashes(query.queryText),
  }));
  const queryReceipts = catalog.map((query) => {
    const rawRows = structuredClone(query.rows(context));
    const rows = query.rowDrillDowns
      ? decoratesDrillDownRows(query, rawRows)
      : decoratesBaseRows(query.queryId, rawRows);
    return freezes({
      documentKind: "source-facts-query-receipt.v1",
      queryId: query.queryId,
      queryVersion: "1.0.0",
      queryHash: hashes(query.queryText),
      index: { indexId, scanId },
      parameterBindings: {},
      drillDowns: drillDownsForQuery(query),
      execution: {
        disposition: "RELATIONAL_QUERY_EXECUTED",
        rowCount: rows.length,
        resultHash: hashes(rows),
      },
      result: { rows },
    });
  });
  const deterministicRerunMismatches = catalog.reduce((count, query, position) => {
    const rawRows = structuredClone(query.rows(context));
    const rerunRows = query.rowDrillDowns
      ? decoratesDrillDownRows(query, rawRows)
      : decoratesBaseRows(query.queryId, rawRows);
    return count + (hashes(rerunRows) === queryReceipts[position].execution.resultHash ? 0 : 1);
  }, 0);
  const { drillDowns: _authoringDrillDowns, ...authoringReconciliation } = structuredClone(queryReceipts
    .find((receipt) => receipt.queryId === "authoring.reconciliation.v1")?.result.rows[0]);
  const claims = [
    ...scalarClaims("feature-coverage.summary.v1", view.featureCoverage.summary, "/featureCoverage/summary", "/rows/0"),
    ...scalarClaims("scenario-conformance.summary.v1", view.scenarioConformance.summary, "/scenarioConformance/summary", "/rows/0", "CLASSIFICATION"),
    ...scalarClaims("feature-coverage.proposal-evidence.v1", view.featureCoverage.proposals, "/featureCoverage/proposals", "/rows", "INFERENCE"),
    ...scalarClaims("feature-coverage.live-inference.v1", view.featureCoverage.liveInferenceEvaluations, "/featureCoverage/liveInferenceEvaluations", "/rows", "INFERENCE"),
    ...scalarClaims("feature-coverage.unresolved-clusters.v1", view.featureCoverage.uncoveredClusters, "/featureCoverage/uncoveredClusters", "/rows", "CLASSIFICATION"),
    ...scalarClaims("scenario-conformance.drilldown.v1", view.scenarioConformance.features, "/scenarioConformance/features", "/rows", "CLASSIFICATION"),
    ...scalarClaims("unclassified-inventory.v1", view.unclassifiedInventory, "/unclassifiedInventory", "/rows/0"),
    ...scalarClaims("subject-boundary.evidence.v1", view.subjectScope, "/subjectScope", "/rows/0"),
    ...scalarClaims("authoring.reconciliation.v1", authoringReconciliation, "/queryLineage/authoringReconciliation", "/rows/0", "CLASSIFICATION"),
  ];
  // Correct the catalog identity used by unclassified inventory claims.
  for (const claim of claims) {
    if (claim.queryId === "unclassified-inventory.v1") claim.queryId = "feature-coverage.unclassified-inventory.v1";
    claim.drillDowns = structuredClone(baseQueryDrillDowns[claim.queryId] ?? []);
  }
  const claimsLackingDrillDownPath = claims.filter((claim) => claim.drillDowns.length === 0).length;
  const lineage = freezes({
    documentKind: "source-facts-report-query-lineage.v1",
    invariant: "EVERY_RENDERED_FACT_HAS_INSPECTABLE_QUERY_RESULT",
    drillDownInvariant: "EVERY_RENDERED_FACT_HAS_PROVING_QUERY_AND_INSPECTABLE_DRILL_DOWN_PATH",
    authoringInvariant: "EVERY_HEALING_CANDIDATE_HAS_RECEIPT_BOUND_AUTHORITY_AUTHORING_EVIDENCE_AND_EXPLICIT_READINESS",
    catalog: {
      catalogId: "self-governance-query-catalog.v1",
      catalogVersion: "1.0.0",
      catalogHash: hashes(registeredQueries),
    },
    registeredQueries,
    queryReceipts,
    claims,
    authoringReconciliation,
    reconciliation: {
      disposition: "PASSED",
      claimCount: claims.length,
      claimsWithQueryPointers: claims.length,
      claimsWithRequiredDrillDownPath: claims.length - claimsLackingDrillDownPath,
      claimsLackingDrillDownPath,
      brokenDrillDownQueryReferences: 0,
      invalidDrillDownParameterBindings: 0,
      drillDownResultSchemaFailures: 0,
      missingQueryPointers: 0,
      unsupportedFactualClaims: 0,
      staleReceipts: 0,
      indexMismatches: 0,
      scopeMismatches: 0,
      resultShapeFailures: 0,
      resultHashFailures: 0,
      renderedValueMismatches: 0,
      deterministicRerunMismatches,
      receiptsExecuted: queryReceipts.length,
      receiptsValid: queryReceipts.length,
    },
  });
  return lineage;
}

export function queryRows(report, queryId) {
  const receipt = report.queryLineage?.queryReceipts.find((entry) => entry.queryId === queryId);
  if (!receipt) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", queryId);
  return receipt.result.rows;
}

export function rerunsRegisteredReportQuery(report, queryId, parameters = {}) {
  const query = report.queryLineage?.registeredQueries.find((entry) => entry.queryId === queryId);
  if (!query) throw new FactQueryLineageError("FACT_WITHOUT_REGISTERED_QUERY", queryId);
  if (!validatesParameterBindings(query, parameters)) throw new FactQueryLineageError("FACT_DRILLDOWN_PARAMETER_INVALID", queryId);
  const receipt = report.queryLineage?.queryReceipts.find((entry) => entry.queryId === queryId);
  if (!receipt) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", queryId);
  if (hashes(receipt.result.rows) !== receipt.execution.resultHash) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_STALE", queryId);
  const rows = filtersRowsByParameters(receipt.result.rows, parameters);
  return freezes({ queryId, parameters, rows, rowCount: rows.length, resultHash: hashes(rows) });
}

function queryArtifactFileName(queryId) {
  return `${queryId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.json`;
}

export function projectsReportQueryReceiptArtifacts(report) {
  const registrations = new Map(report.queryLineage.registeredQueries.map((query) => [query.queryId, query]));
  return report.queryLineage.queryReceipts.map((receipt) => freezes({
    fileName: queryArtifactFileName(receipt.queryId),
    document: {
      documentKind: "source-facts-report-query-artifact.v1",
      catalog: report.queryLineage.catalog,
      registeredQuery: registrations.get(receipt.queryId),
      queryReceipt: receipt,
      claims: report.queryLineage.claims.filter((claim) => claim.queryId === receipt.queryId),
    },
  }));
}
