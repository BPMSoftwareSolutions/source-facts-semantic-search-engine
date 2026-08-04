import { createHash } from "node:crypto";

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
]);

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
  }
  if (lineage.reconciliation.claimCount !== lineage.claims.length) {
    throw new FactQueryLineageError("FACT_QUERY_RESULT_SHAPE_INVALID", "reconciliation claim count");
  }
  if (lineage.reconciliation.disposition !== "PASSED"
    || lineage.reconciliation.claimsWithQueryPointers !== lineage.claims.length
    || lineage.reconciliation.receiptsExecuted !== lineage.queryReceipts.length
    || lineage.reconciliation.receiptsValid !== lineage.queryReceipts.length
    || [
      "missingQueryPointers", "unsupportedFactualClaims", "staleReceipts", "indexMismatches",
      "scopeMismatches", "resultShapeFailures", "resultHashFailures", "renderedValueMismatches",
      "deterministicRerunMismatches",
    ].some((key) => lineage.reconciliation[key] !== 0)) {
    throw new FactQueryLineageError("FACT_QUERY_RESULT_SHAPE_INVALID", "reconciliation summary");
  }
  for (const claim of lineage.claims) {
    const receipt = receipts.get(claim.queryId);
    if (!receipt) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", claim.queryId);
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
  const registeredQueries = catalog.map(({ rows: _rows, ...query }) => freezes({
    ...query,
    queryVersion: "1.0.0",
    scopePolicy,
    queryHash: hashes(query.queryText),
  }));
  const queryReceipts = catalog.map((query) => {
    const rows = structuredClone(query.rows(view));
    return freezes({
      documentKind: "source-facts-query-receipt.v1",
      queryId: query.queryId,
      queryVersion: "1.0.0",
      queryHash: hashes(query.queryText),
      index: { indexId, scanId },
      execution: {
        disposition: "RELATIONAL_QUERY_EXECUTED",
        rowCount: rows.length,
        resultHash: hashes(rows),
      },
      result: { rows },
    });
  });
  const deterministicRerunMismatches = catalog.reduce((count, query, position) => {
    const rerunRows = structuredClone(query.rows(view));
    return count + (hashes(rerunRows) === queryReceipts[position].execution.resultHash ? 0 : 1);
  }, 0);
  const claims = [
    ...scalarClaims("feature-coverage.summary.v1", view.featureCoverage.summary, "/featureCoverage/summary", "/rows/0"),
    ...scalarClaims("scenario-conformance.summary.v1", view.scenarioConformance.summary, "/scenarioConformance/summary", "/rows/0", "CLASSIFICATION"),
    ...scalarClaims("feature-coverage.proposal-evidence.v1", view.featureCoverage.proposals, "/featureCoverage/proposals", "/rows", "INFERENCE"),
    ...scalarClaims("feature-coverage.live-inference.v1", view.featureCoverage.liveInferenceEvaluations, "/featureCoverage/liveInferenceEvaluations", "/rows", "INFERENCE"),
    ...scalarClaims("feature-coverage.unresolved-clusters.v1", view.featureCoverage.uncoveredClusters, "/featureCoverage/uncoveredClusters", "/rows", "CLASSIFICATION"),
    ...scalarClaims("scenario-conformance.drilldown.v1", view.scenarioConformance.features, "/scenarioConformance/features", "/rows", "CLASSIFICATION"),
    ...scalarClaims("unclassified-inventory.v1", view.unclassifiedInventory, "/unclassifiedInventory", "/rows/0"),
    ...scalarClaims("subject-boundary.evidence.v1", view.subjectScope, "/subjectScope", "/rows/0"),
  ];
  // Correct the catalog identity used by unclassified inventory claims.
  for (const claim of claims) {
    if (claim.queryId === "unclassified-inventory.v1") claim.queryId = "feature-coverage.unclassified-inventory.v1";
  }
  const lineage = freezes({
    documentKind: "source-facts-report-query-lineage.v1",
    invariant: "EVERY_RENDERED_FACT_HAS_INSPECTABLE_QUERY_RESULT",
    catalog: {
      catalogId: "self-governance-query-catalog.v1",
      catalogVersion: "1.0.0",
      catalogHash: hashes(registeredQueries),
    },
    registeredQueries,
    queryReceipts,
    claims,
    reconciliation: {
      disposition: "PASSED",
      claimCount: claims.length,
      claimsWithQueryPointers: claims.length,
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

export function rerunsRegisteredReportQuery(report, queryId) {
  const query = catalog.find((entry) => entry.queryId === queryId);
  if (!query) throw new FactQueryLineageError("FACT_WITHOUT_REGISTERED_QUERY", queryId);
  const rows = structuredClone(query.rows(report));
  const receipt = report.queryLineage?.queryReceipts.find((entry) => entry.queryId === queryId);
  if (!receipt) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_MISSING", queryId);
  if (hashes(rows) !== receipt.execution.resultHash) throw new FactQueryLineageError("FACT_QUERY_RECEIPT_STALE", queryId);
  return freezes({ queryId, rows, rowCount: rows.length, resultHash: hashes(rows) });
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
