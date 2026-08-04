import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");

function buildsMinimalIndex() {
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:fixture-index-id",
    manifest: { scanId: "scan-index", scanRequest: { workspaceId: "generate-docs-cli-fixture" } },
    workspace: {
      workspaceId: "generate-docs-cli-fixture",
      rootHash: "sha256:workspace",
      languageId: "typescript",
      languageProfileVersion: "1.0.0",
    },
    files: [],
    symbols: [
      { kind: "function", name: "run" },
      { kind: "variable", name: "cache" },
      { kind: "class", name: "Writer" },
      { kind: "parameter", name: "input" },
    ],
    relationships: [],
    dataflows: [],
    sourceReferences: [],
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
  };
}

function buildsMinimalReport() {
  return {
    reportType: "source-facts-self-governance-report.v1",
    generatedAtUtc: "2026-01-01T00:00:00Z",
    index: {
      indexId: "sha256:fixture-index-id",
      scanId: "scan-report",
    },
    repository: {
      repositoryId: "generate-docs-cli-fixture",
      workspaceId: "generate-docs-cli-fixture",
      workspaceRoot: "/tmp/generate-docs-cli-fixture",
    },
    subjectScope: {
      workspaceRelativePrefix: "",
      scopeMode: "REPOSITORY_WIDE",
      authorityDocumentsDiscovered: 0,
      authorityDocumentsInScope: 0,
      authorityDocumentsExcluded: 0,
      proposalBatchesDiscovered: 0,
      proposalBatchesInScope: 0,
      proposalBatchesExcluded: 0,
      featureCoverageProposalsDiscovered: 0,
      featureCoverageProposalsInScope: 0,
      featureCoverageProposalsExcluded: 0,
      featureCoverageInferenceEvaluationsDiscovered: 0,
      featureCoverageInferenceEvaluationsInScope: 0,
      featureCoverageInferenceEvaluationsExcluded: 0,
      knowHowRecordsDiscovered: 0,
      knowHowRecordsInScope: 0,
      knowHowRecordsExcluded: 0,
      healingDraftsDiscovered: 0,
      healingDraftsInScope: 0,
      healingDraftsExcluded: 0,
    },
    scenarioConformance: {
      summary: {
        canonicalScenarioCount: 6,
        structurallyClosedCount: 4,
        executionEvaluatedCount: 5,
        conformantCount: 3,
        scenariosDiscovered: 6,
        scenariosStructurallyClosed: 4,
        scenariosExecutionEvaluated: 5,
        scenariosConformant: 3,
      },
      features: [],
      lineageAuthorityFiles: [],
    },
    featureCoverage: {
      summary: {
        canonicalFeatures: 4,
        proposedFeatures: 2,
        canonicalMechanicsCount: 10,
        proposedMechanicsCount: 1,
        ambiguousMechanicsCount: 1,
        unlinkedMechanicsCount: 2,
        unresolvedClustersCount: 0,
        mechanicsWithCanonicalLineage: 10,
        mechanicsWithProposedLineage: 1,
        mechanicsWithAmbiguousLineage: 1,
        mechanicsWithoutLineage: 2,
        unresolvedEvidenceClusters: 0,
      },
      proposals: [],
      liveInferenceEvaluations: [],
      uncoveredClusters: [],
      entityCoverage: {},
    },
    unclassifiedInventory: {
      mechanicsByLineageDisposition: {},
      mechanicsByFeatureCoveragePosture: {},
      unclassifiedAuthorityDocumentCount: 0,
      unclassifiedAuthorityDocuments: [],
      knowHowWithoutScenarioLineage: 0,
      healingDraftsWithoutScenarioTarget: 0,
    },
    authoritySources: [],
    otherAuthorityDocuments: [],
    executionMechanics: {
      observed: 0,
      governed: 0,
      byPosture: {
        GOVERNED_BY_SEMANTIC_AUTHORITY: 0,
        MECHANICAL_ADAPTER_OPERATION: 0,
        KERNEL_PRIMITIVE: 0,
        AUTHORIZED_TEMPORARY_BACKLOG: 0,
        UNAUTHORIZED_EXECUTABLE_MEANING: 0,
        UNKNOWN_CLASSIFICATION: 0,
      },
      byMechanicType: [],
    },
    fileBreakdown: [],
    dataDrivenWiring: [],
    contractSemanticVolume: [],
    authoritySuccession: [],
    semanticOverlapProposals: [],
    knowHowRegistry: {
      admittedKnowHowCount: 0,
      byKind: {},
      byGeneralizability: {},
      knowHowRecords: [],
      authorityRemediationCandidateCount: 0,
      authorityRemediationCandidates: [],
    },
    healingDraftRegistry: {
      totalDrafts: 0,
      byDisposition: {},
      byTissueType: {},
      drafts: [],
    },
    automationReadiness: {
      byDisposition: {
        ALREADY_GOVERNED: 0,
        NOT_APPLICABLE: 0,
        AUTOMATABLE_AFTER_REVIEW: 0,
        REQUIRES_HUMAN_SEMANTIC_DECISION: 0,
        AUTOMATABLE_AFTER_AUTHORITY_COMPLETION: 0,
        REQUIRES_NEW_AUTHORITY: 0,
        NOT_CURRENTLY_PROJECTABLE: 0,
      },
    },
    occurrences: [],
    disposition: "OBSERVATIONAL_NO_GATE_APPLIED",
  };
}

function buildsMinimalGraph() {
  return {
    indexId: "sha256:fixture-index-id",
    summary: {
      commandRootCount: 1,
      exportedFunctionRootCount: 1,
      totalRootCount: 1,
      runtimeCallableCount: 7,
      reachableCallableCount: 6,
      unreachableCallableCount: 1,
      invocationEdgeCount: 11,
      resolvedInvocationEdgeCount: 9,
      ambiguousInvocationEdgeCount: 1,
      unresolvedInvocationEdgeCount: 1,
      maxDepth: 4,
    },
  };
}

function buildsMinimalMetricCatalog() {
  return {
    catalogType: "traceability-metric-catalog.v1",
    catalogVersion: "1.0.0",
    schemaVersion: "1.0.0",
    metrics: [
      {
        metricId: "traceability.entry.command-root-count.v1",
        metricVersion: "1",
        metricLabel: "CLI command roots",
        section: "entry-point-reachability",
        claimType: "factual",
        resultType: "integer",
        disposition: "METRIC_POINTER_NOT_FOUND",
        query: {
          queryId: "traceability.query.call-graph.command-root-count",
          queryText: "SELECT COUNT(*) FROM call_graph WHERE root_type = 'command';",
        },
        source: {
          artifactKind: "call-graph",
          valueMode: "artifact-pointer",
          pointer: "/summary/commandRootCount",
        },
      },
      {
        metricId: "traceability.feature.canonical-feature-count.v1",
        metricVersion: "1",
        metricLabel: "Canonical features",
        section: "feature-coverage",
        claimType: "factual",
        resultType: "integer",
        disposition: "METRIC_POINTER_NOT_FOUND",
        query: {
          queryId: "traceability.query.feature.canonical-feature-count",
          queryText: "SELECT COUNT(*) FROM features WHERE posture = 'canonical';",
        },
        source: {
          artifactKind: "governance-report",
          valueMode: "artifact-pointer",
          pointer: "/featureCoverage/summary/canonicalFeatures",
        },
      },
      {
        metricId: "traceability.scenario.canonical-scenario-count.v1",
        metricVersion: "1",
        metricLabel: "Canonical scenarios",
        section: "feature-coverage",
        claimType: "factual",
        resultType: "integer",
        disposition: "METRIC_POINTER_NOT_FOUND",
        query: {
          queryId: "traceability.query.scenario.canonical-scenario-count",
          queryText: "SELECT COUNT(*) FROM scenarios WHERE posture = 'canonical';",
        },
        source: {
          artifactKind: "governance-report",
          valueMode: "artifact-pointer",
          pointer: "/scenarioConformance/summary/canonicalScenarioCount",
        },
      },
      {
        metricId: "traceability.entry.reachable-callable-count.v1",
        metricVersion: "1",
        metricLabel: "Reachable (from entry points)",
        section: "derived-rates",
        claimType: "factual",
        resultType: "integer",
        disposition: "METRIC_POINTER_NOT_FOUND",
        query: {
          queryId: "traceability.query.entry.reachable-callable-count",
          queryText: "SELECT COUNT(*) FROM summary WHERE metric = 'reachable_callable_count';",
        },
        source: {
          artifactKind: "call-graph",
          valueMode: "artifact-pointer",
          pointer: "/summary/reachableCallableCount",
        },
      },
      {
        metricId: "traceability.entry.runtime-callable-count.v1",
        metricVersion: "1",
        metricLabel: "Runtime callable functions",
        section: "derived-rates",
        claimType: "factual",
        resultType: "integer",
        disposition: "METRIC_POINTER_NOT_FOUND",
        query: {
          queryId: "traceability.query.entry.runtime-callable-count",
          queryText: "SELECT COUNT(*) FROM summary WHERE metric = 'runtime_callable_count';",
        },
        source: {
          artifactKind: "call-graph",
          valueMode: "artifact-pointer",
          pointer: "/summary/runtimeCallableCount",
        },
      },
      {
        metricId: "traceability.rate.reachability-coverage.v1",
        metricVersion: "1",
        metricLabel: "Reachability coverage",
        section: "derived-rates",
        claimType: "derived",
        resultType: "percentage",
        disposition: "ZERO_DENOMINATOR",
        query: {
          queryId: "traceability.query.rate.reachability-coverage",
          queryText: "SELECT reachable_callable_count / runtime_callable_count FROM summary;",
        },
        source: {
          artifactKind: "derived",
          valueMode: "ratio",
          numeratorMetricId: "traceability.entry.reachable-callable-count.v1",
          denominatorMetricId: "traceability.entry.runtime-callable-count.v1",
        },
      },
    ],
  };
}

function buildsMinimalQueryReceipts(metricCatalog) {
  const report = buildsMinimalReport();
  const index = buildsMinimalIndex();
  const graph = buildsMinimalGraph();
  const catalogFingerprint = buildsCatalogFingerprint(metricCatalog);

  const reportBinding = {
    indexId: report.index.indexId,
    scanId: report.index.scanId,
  };
  const indexBinding = {
    indexId: index.indexId,
    scanId: index.manifest.scanId,
  };
  const graphBinding = { indexId: graph.indexId };

  const makesDeterministicHash = (seed) => {
    const payload = Number(seed).toString(16).padStart(64, "0");
    return `sha256:${payload}`;
  };

  const queryReceipts = metricCatalog.metrics
    .filter((metric) => metric.query?.queryId !== undefined)
    .map((metric, offset) => {
      const queryText = metric.query.queryText ?? "";
      return {
        queryId: metric.query.queryId,
        disposition: "RELATIONAL_QUERY_EXECUTED",
        queryText,
        queryTextHash: hashesQueryText(queryText),
        artifactBinding: resolvesExpectedArtifactBinding(metric.source.artifactKind, {
          reportBinding,
          indexBinding,
          graphBinding,
        }),
        catalogBinding: {
          catalogType: metricCatalog.catalogType ?? "traceability-metric-catalog.v1",
          catalogVersion: metricCatalog.catalogVersion ?? "1.0.0",
          catalogFingerprint,
        },
        inputHash: makesDeterministicHash(offset),
        resultHash: makesDeterministicHash(offset + 16),
        rowCount: 2,
      };
    });

  return {
    receiptType: "traceability-query-receipts.v1",
    generatedAtUtc: "2026-01-01T00:00:00Z",
    queryReceipts,
  };
}

test("generate-docs CLI accepts report, graph, metric catalog and query receipts overrides", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const queryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = buildsMinimalQueryReceipts(metricCatalog);
    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(queryReceiptsPath, JSON.stringify(queryReceipts), "utf8");
    fs.writeFileSync(reportPath, JSON.stringify(buildsMinimalReport()), "utf8");
    fs.writeFileSync(graphPath, JSON.stringify(buildsMinimalGraph()), "utf8");
    fs.writeFileSync(indexPath, JSON.stringify(buildsMinimalIndex()), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "generate-docs",
        "--report",
        reportPath,
        "--graph",
        graphPath,
        "--index",
        indexPath,
        "--metric-catalog",
        metricCatalogPath,
        "--query-receipts",
        queryReceiptsPath,
        "--output",
        outputPath,
        "--summary",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.equal(result.status, 0, `CLI failed with status ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
    assert.ok(result.stdout.includes(outputPath));
    assert.ok(result.stdout.includes("Generated traceability metrics documentation."));

    const markdown = fs.readFileSync(outputPath, "utf8");
    assert.ok(markdown.includes("## 1. Entry Point Reachability (Call Graph)"));
    assert.ok(markdown.includes("## 3. Feature Coverage (Governance Report)"));
    assert.ok(markdown.includes("| traceability.entry.command-root-count.v1 (entry-point-reachability) | 1 |"));
    assert.ok(markdown.includes("| traceability.feature.canonical-feature-count.v1 (feature-coverage) | 4 |"));
    assert.ok(markdown.includes("Strict Traceability Score"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects missing query receipts", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const missingQueryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = buildsMinimalQueryReceipts(metricCatalog).queryReceipts.slice(0, 2);
    const truncatedReceipts = { receiptType: "traceability-query-receipts.v1", queryReceipts };

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(missingQueryReceiptsPath, JSON.stringify(truncatedReceipts), "utf8");
    fs.writeFileSync(reportPath, JSON.stringify(buildsMinimalReport()), "utf8");
    fs.writeFileSync(graphPath, JSON.stringify(buildsMinimalGraph()), "utf8");
    fs.writeFileSync(indexPath, JSON.stringify(buildsMinimalIndex()), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "generate-docs",
        "--report",
        reportPath,
        "--graph",
        graphPath,
        "--index",
        indexPath,
        "--metric-catalog",
        metricCatalogPath,
        "--query-receipts",
        missingQueryReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_MISSING") || result.stdout.includes("QUERY_RECEIPT_MISSING"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects stale query receipts", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const staleQueryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = buildsMinimalQueryReceipts(metricCatalog);
    queryReceipts.queryReceipts[0].disposition = "RELATIONAL_QUERY_FAILED";
    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(staleQueryReceiptsPath, JSON.stringify(queryReceipts), "utf8");
    fs.writeFileSync(reportPath, JSON.stringify(buildsMinimalReport()), "utf8");
    fs.writeFileSync(graphPath, JSON.stringify(buildsMinimalGraph()), "utf8");
    fs.writeFileSync(indexPath, JSON.stringify(buildsMinimalIndex()), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "generate-docs",
        "--report",
        reportPath,
        "--graph",
        graphPath,
        "--index",
        indexPath,
        "--metric-catalog",
        metricCatalogPath,
        "--query-receipts",
        staleQueryReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_STALE") || result.stdout.includes("QUERY_RECEIPT_STALE"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs writes closure receipt", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const closureReceiptPath = path.join(tempDir, "traceability-documentation-closure-receipt.json");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const queryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = buildsMinimalQueryReceipts(metricCatalog);
    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(queryReceiptsPath, JSON.stringify(queryReceipts), "utf8");
    fs.writeFileSync(reportPath, JSON.stringify(buildsMinimalReport()), "utf8");
    fs.writeFileSync(graphPath, JSON.stringify(buildsMinimalGraph()), "utf8");
    fs.writeFileSync(indexPath, JSON.stringify(buildsMinimalIndex()), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "generate-docs",
        "--report",
        reportPath,
        "--graph",
        graphPath,
        "--index",
        indexPath,
        "--metric-catalog",
        metricCatalogPath,
        "--query-receipts",
        queryReceiptsPath,
        "--closure-receipt",
        closureReceiptPath,
        "--output",
        outputPath,
        "--summary",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes("Generated traceability metrics documentation."));

    const closureReceipt = JSON.parse(fs.readFileSync(closureReceiptPath, "utf8"));
    assert.equal(closureReceipt.receiptType, "traceability-documentation-closure-receipt.v1");
    assert.equal(closureReceipt.queryReceiptCount, queryReceipts.queryReceipts.length);
    assert.equal(closureReceipt.renderedMetricCount, metricCatalog.metrics.length);
    assert.ok(closureReceipt.document?.path === outputPath);
    assert.ok(typeof closureReceipt.document?.hash === "string" && closureReceipt.document.hash.startsWith("sha256:"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs CLI rejects unknown options", () => {
  const result = spawnSync(
    process.execPath,
    [cliPath, "generate-docs", "--unknown-option"],
    { cwd: repoRoot, encoding: "utf8" },
  );

  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes("Unknown CLI option") || result.stdout.includes("Unknown CLI option"));
});

function hashesQueryText(queryText) {
  return `sha256:${createHash("sha256").update(queryText, "utf8").digest("hex")}`;
}

function buildsCatalogFingerprint(metricCatalog) {
  return hashesQueryText(JSON.stringify(canonicalizes(metricCatalog)));
}

function resolvesExpectedArtifactBinding(artifactKind, { reportBinding, indexBinding, graphBinding }) {
  if (artifactKind === "call-graph") {
    return {
      artifactKind: "call-graph",
      indexId: graphBinding.indexId,
    };
  }
  if (artifactKind === "source-fact-index") {
    return {
      artifactKind: "source-fact-index",
      indexId: indexBinding.indexId,
      scanId: indexBinding.scanId,
    };
  }
  if (artifactKind === "governance-report") {
    return {
      artifactKind: "governance-report",
      indexId: reportBinding.indexId,
      scanId: reportBinding.scanId,
    };
  }
  return {
    artifactKind: "derived",
    indexId: "derived-no-binding",
  };
}

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}
