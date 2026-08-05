import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { executeRelationalQuery } from "../src/query.js";
import { buildsArtifactQueryIndex, generatesTraceabilityDocs } from "../src/generate-traceability-docs.js";
import { projectsReportQueryLineage } from "../src/governance/projects-report-query-lineage.js";
import { validatesTraceabilityClosureReceiptIntegrity } from "../src/validates-traceability-artifacts.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");
const FIXTURE_INDEX_ID = `sha256:${"0".repeat(64)}`;
const FIXTURE_SCAN_ID = `${"1".repeat(64)}`;
const FIXTURE_ROOT_HASH = `sha256:${"2".repeat(64)}`;
const FIXTURE_DOCUMENT_ROOT_HASH = `sha256:${"3".repeat(64)}`;

function buildsMinimalIndex() {
  return {
    indexType: "source-fact-index.v1",
    indexId: FIXTURE_INDEX_ID,
    manifest: {
      schemaVersion: "1.0.0",
      engine: "traceability-docs-tests",
      engineVersion: "1.0.0",
      scanId: FIXTURE_SCAN_ID,
      documentRootHash: FIXTURE_DOCUMENT_ROOT_HASH,
      scanRequest: {
        workspaceId: "generate-docs-cli-fixture",
        workspaceRoot: "/tmp/generate-docs-cli-fixture",
      },
    },
    workspace: {
      workspaceId: "generate-docs-cli-fixture",
      rootHash: FIXTURE_ROOT_HASH,
      languageId: "typescript",
      languageProfileVersion: "1.0.0",
    },
    files: [],
    symbols: [],
    relationships: [],
    dataflows: [],
    sourceReferences: [],
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
    coverage: {
      filesObserved: 0,
      declarations: 0,
      relationships: 0,
      controlFlow: 0,
      syntax: 0,
      unknownSyntax: 0,
      documentFacts: 0,
      governanceRules: 0,
      bodyMechanics: 0,
      dataflows: 0,
      unknownSyntaxRatio: 0,
    },
  };
}

function buildsMinimalReport() {
  const report = {
    reportType: "source-facts-self-governance-report.v1",
    generatedAtUtc: "2026-01-01T00:00:00Z",
    enterpriseContext: {
      enterpriseId: null,
      portfolioId: null,
      domainId: null,
      applicationId: null,
      capabilityId: null,
      repositoryId: null,
      workspaceId: null,
      contextAuthorityId: null,
    },
    enterpriseSubjects: [],
    enterpriseSubjectRelationships: [],
    index: {
      indexId: FIXTURE_INDEX_ID,
      scanId: FIXTURE_SCAN_ID,
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
    interfaceGovernance: {
      summary: {
        interfacePortfolioDisposition: "CLI_INTERFACE_NOT_OBSERVED",
        cliDispatchEvidenceDisposition: "CLI_DISPATCH_SOURCE_UNAVAILABLE",
        cliDispatchSourceHash: null,
        observedCliCommandHandlers: 0,
        observedCliCommandTokens: 0,
        observedHttpEntryPoints: 0,
        commandsWithCanonicalFeature: 0,
        commandsWithoutCanonicalFeature: 0,
        canonicalFeaturesAccessibleViaCli: 0,
        canonicalFeatureIdsAccessibleViaCli: [],
        cliInterfaceAuthorityDocuments: 0,
        cliInterfaceAuthorityDisposition: "CLI_INTERFACE_AUTHORITY_MISSING",
        admittedCliCommands: 0,
        runtimeCallables: 0,
        cliReachableCallables: 0,
        sharedCliInfrastructure: 0,
        runtimeResolutionRequired: 0,
        noCliReachabilityCallables: 0,
        reachableMechanicOccurrences: 0,
        unreachableMechanicOccurrences: 0,
      },
      commands: [],
      callableInventory: [],
      reachability: [],
      sharedReachability: [],
      runtimeResolutionDebt: [],
      reachableSourceFacts: [],
      unreachableCallables: [],
      unreachableSourceFacts: [],
      originatingCommands: [],
      removalImpact: [],
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
  report.queryLineage = projectsReportQueryLineage(report, buildsMinimalIndex());
  return report;
}

function buildsMinimalGraph() {
  return {
    indexId: FIXTURE_INDEX_ID,
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
          queryText: "SELECT value FROM documents WHERE pointer = '/summary/commandRootCount'",
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
          queryText: "SELECT value FROM documents WHERE pointer = '/featureCoverage/summary/canonicalFeatures'",
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
          queryText: "SELECT value FROM documents WHERE pointer = '/scenarioConformance/summary/canonicalScenarioCount'",
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
          queryText: "SELECT value FROM documents WHERE pointer = '/summary/reachableCallableCount'",
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
          queryText: "SELECT value FROM documents WHERE pointer = '/summary/runtimeCallableCount'",
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

async function buildsMinimalQueryReceipts(metricCatalog) {
  const report = buildsMinimalReport();
  const index = buildsMinimalIndex();
  const graph = buildsMinimalGraph();
  const catalogFingerprint = buildsCatalogFingerprint(metricCatalog);
  const reportBindingHash = hashesArtifact(report);
  const indexBindingHash = hashesArtifact(index);
  const graphBindingHash = hashesArtifact(graph);

  const reportBinding = {
    indexId: report.index.indexId,
    scanId: report.index.scanId,
  };
  const indexBinding = {
    indexId: index.indexId,
    scanId: index.manifest.scanId,
  };
  const graphBinding = { indexId: graph.indexId };

  const queryReceipts = [];
  const catalogType = metricCatalog.catalogType ?? "traceability-metric-catalog.v1";
  const catalogVersion = metricCatalog.catalogVersion ?? "1.0.0";

  for (const metric of metricCatalog.metrics) {
    if (metric.query?.queryId === undefined) continue;
    const queryText = metric.query.queryText ?? "";
    const queryIndex = metric.source.artifactKind === "source-fact-index"
      ? index
      : buildsArtifactQueryIndex(metric.source.artifactKind, metric.source.artifactKind === "call-graph" ? graph : report);
    const queryReceipt = await executeRelationalQuery(queryIndex, queryText);
    if (queryReceipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
      throw new Error(`Cannot build test receipt for ${metric.query.queryId}: ${queryReceipt.disposition}`);
    }
    const rowCount = queryReceipt.result?.value?.rowCount ?? 0;
    const queryTextHash = hashesQueryText(queryText);
    const artifactBinding = resolvesExpectedArtifactBinding(metric.source.artifactKind, {
      reportBinding,
      indexBinding,
      graphBinding,
    });
    if (metric.source.artifactKind === "call-graph") {
      artifactBinding.artifactContentHash = graphBindingHash;
    } else if (metric.source.artifactKind === "source-fact-index") {
      artifactBinding.artifactContentHash = indexBindingHash;
    } else if (metric.source.artifactKind === "governance-report") {
      artifactBinding.artifactContentHash = reportBindingHash;
    } else if (metric.source.artifactKind === "derived") {
      delete artifactBinding.artifactContentHash;
    }
    queryReceipts.push({
      queryId: metric.query.queryId,
      disposition: queryReceipt.disposition,
      queryText,
      queryTextHash,
      artifactBinding,
      catalogBinding: {
        catalogType,
        catalogVersion,
        catalogFingerprint,
      },
      inputHash: queryReceipt.inputHash,
      resultHash: queryReceipt.resultHash,
      rowCount,
    });
  }

  return {
    receiptType: "traceability-query-receipts.v1",
    generatedAtUtc: "2026-01-01T00:00:00Z",
    queryReceipts,
  };
}

function writesMinimalTraceabilityInputs(tempDir, metricCatalog, queryReceipts) {
  const paths = {
    reportPath: path.join(tempDir, "source-facts-self-governance-report.json"),
    graphPath: path.join(tempDir, "call-graph.json"),
    indexPath: path.join(tempDir, "source-fact-index.json"),
    outputPath: path.join(tempDir, "traceability-metrics.md"),
    metricCatalogPath: path.join(tempDir, "traceability-metric-catalog.json"),
    queryReceiptsPath: path.join(tempDir, "traceability-query-receipts.json"),
  };
  fs.writeFileSync(paths.metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
  fs.writeFileSync(paths.queryReceiptsPath, JSON.stringify(queryReceipts), "utf8");
  fs.writeFileSync(paths.reportPath, JSON.stringify(buildsMinimalReport()), "utf8");
  fs.writeFileSync(paths.graphPath, JSON.stringify(buildsMinimalGraph()), "utf8");
  fs.writeFileSync(paths.indexPath, JSON.stringify(buildsMinimalIndex()), "utf8");
  return paths;
}

test("generate-docs CLI accepts report, graph, metric catalog and query receipts overrides", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const queryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
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

test("generate-docs rejects missing query receipts", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const missingQueryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = (await buildsMinimalQueryReceipts(metricCatalog)).queryReceipts.slice(0, 2);
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
    assert.ok(
      result.stderr.includes("QUERY_RECEIPT_SET_MISMATCH")
      || result.stdout.includes("QUERY_RECEIPT_SET_MISMATCH"),
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects stale query receipts", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const staleQueryReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
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

test("generate-docs rejects forged query-input hashes", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const firstReceipt = queryReceipts.queryReceipts[0];
    firstReceipt.inputHash = firstReceipt.resultHash;

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_INPUT_HASH_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_INPUT_HASH_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects forged query-result hashes", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const firstReceipt = queryReceipts.queryReceipts[1];
    firstReceipt.resultHash = firstReceipt.inputHash;

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_RESULT_HASH_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_RESULT_HASH_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects forged query text", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const firstReceipt = queryReceipts.queryReceipts[0];
    firstReceipt.queryText = `${firstReceipt.queryText} --forged`;
    firstReceipt.queryTextHash = hashesQueryText(firstReceipt.queryText);

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_TEXT_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_TEXT_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects wrong query row counts", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const firstReceipt = queryReceipts.queryReceipts[2];
    firstReceipt.rowCount += 3;

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_ROW_COUNT_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_ROW_COUNT_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects forged artifact content bindings", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const firstReceipt = queryReceipts.queryReceipts.find((receipt) => receipt.artifactBinding.artifactKind !== "derived");
    assert.ok(firstReceipt !== undefined);
    firstReceipt.artifactBinding.artifactContentHash = "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_ARTIFACT_CONTENT_HASH_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_ARTIFACT_CONTENT_HASH_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects query-receipts with mismatched catalog fingerprint", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");
    const metricCatalogPath = path.join(tempDir, "traceability-metric-catalog.json");
    const forgedReceiptsPath = path.join(tempDir, "traceability-query-receipts.json");

    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    queryReceipts.queryReceipts[0].catalogBinding.catalogFingerprint = "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    fs.writeFileSync(metricCatalogPath, JSON.stringify(metricCatalog), "utf8");
    fs.writeFileSync(forgedReceiptsPath, JSON.stringify(queryReceipts), "utf8");
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
        forgedReceiptsPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes("QUERY_RECEIPT_CATALOG_BINDING_MISMATCH") || result.stdout.includes("QUERY_RECEIPT_CATALOG_BINDING_MISMATCH"));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects a receipt executed against the wrong artifact query input", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const graphMetric = metricCatalog.metrics.find((metric) => metric.source.artifactKind === "call-graph");
    const graphReceipt = queryReceipts.queryReceipts.find((receipt) => receipt.queryId === graphMetric.query.queryId);
    const wrongExecution = await executeRelationalQuery(buildsMinimalIndex(), graphMetric.query.queryText);
    graphReceipt.inputHash = wrongExecution.inputHash;
    graphReceipt.resultHash = wrongExecution.resultHash;
    graphReceipt.rowCount = wrongExecution.result.value.rowCount;
    const paths = writesMinimalTraceabilityInputs(tempDir, metricCatalog, queryReceipts);

    await assert.rejects(
      generatesTraceabilityDocs(
        paths.reportPath,
        paths.graphPath,
        paths.indexPath,
        paths.outputPath,
        { metricCatalogPath: paths.metricCatalogPath, queryReceiptPath: paths.queryReceiptsPath },
      ),
      /QUERY_RECEIPT_INPUT_HASH_MISMATCH/,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects an executed query whose value does not match its metric", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const metricCatalog = buildsMinimalMetricCatalog();
    metricCatalog.metrics[0].query.queryText = "SELECT value FROM documents WHERE pointer = '/summary/runtimeCallableCount'";
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const paths = writesMinimalTraceabilityInputs(tempDir, metricCatalog, queryReceipts);

    await assert.rejects(
      generatesTraceabilityDocs(
        paths.reportPath,
        paths.graphPath,
        paths.indexPath,
        paths.outputPath,
        { metricCatalogPath: paths.metricCatalogPath, queryReceiptPath: paths.queryReceiptsPath },
      ),
      /QUERY_RESULT_METRIC_MISMATCH/,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs rejects query receipts that are not the exact catalog-required set", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    queryReceipts.queryReceipts.push({
      ...queryReceipts.queryReceipts[0],
      queryId: "traceability.query.unexpected",
    });
    const paths = writesMinimalTraceabilityInputs(tempDir, metricCatalog, queryReceipts);

    await assert.rejects(
      generatesTraceabilityDocs(
        paths.reportPath,
        paths.graphPath,
        paths.indexPath,
        paths.outputPath,
        { metricCatalogPath: paths.metricCatalogPath, queryReceiptPath: paths.queryReceiptsPath },
      ),
      /QUERY_RECEIPT_SET_MISMATCH.*unexpected \[traceability\.query\.unexpected\]/,
    );
    assert.equal(fs.existsSync(paths.outputPath), false);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("artifact query projection is canonical across object key order", async () => {
  const left = buildsArtifactQueryIndex("call-graph", {
    indexId: FIXTURE_INDEX_ID,
    summary: { reachableCallableCount: 6, runtimeCallableCount: 7 },
  });
  const right = buildsArtifactQueryIndex("call-graph", {
    summary: { runtimeCallableCount: 7, reachableCallableCount: 6 },
    indexId: FIXTURE_INDEX_ID,
  });
  const queryText = "SELECT value FROM documents WHERE pointer = '/summary/reachableCallableCount'";
  const [leftReceipt, rightReceipt] = await Promise.all([
    executeRelationalQuery(left, queryText),
    executeRelationalQuery(right, queryText),
  ]);

  assert.equal(leftReceipt.inputHash, rightReceipt.inputHash);
  assert.equal(leftReceipt.resultHash, rightReceipt.resultHash);
});

test("generate-docs writes closure receipt", async () => {
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
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
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

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(result.stdout.includes("Generated traceability metrics documentation."));

    const closureReceipt = JSON.parse(fs.readFileSync(closureReceiptPath, "utf8"));
    assert.equal(closureReceipt.receiptType, "traceability-documentation-closure-receipt.v1");
    assert.equal(closureReceipt.queryReceiptCount, queryReceipts.queryReceipts.length);
    assert.equal(closureReceipt.renderedMetricCount, metricCatalog.metrics.length);
    assert.equal(closureReceipt.document?.path, path.basename(outputPath));
    assert.ok(typeof closureReceipt.document?.hash === "string" && closureReceipt.document.hash.startsWith("sha256:"));
    assert.equal(closureReceipt.disposition, "CLOSED");
    assert.equal(closureReceipt.failedConditionCount, 0);
    assert.ok(closureReceipt.closureConditions.every((condition) => condition.disposition === "PASSED"));
    closureReceipt.document.hash = `sha256:${"f".repeat(64)}`;
    await assert.rejects(
      validatesTraceabilityClosureReceiptIntegrity(closureReceipt),
      /CLOSURE_RECEIPT_HASH_MISMATCH/,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("generate-docs is byte-stable and produces the same deterministic closure hash", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-stability-"));
  try {
    const firstDir = path.join(tempRoot, "first");
    const secondDir = path.join(tempRoot, "second");
    fs.mkdirSync(firstDir);
    fs.mkdirSync(secondDir);
    const metricCatalog = buildsMinimalMetricCatalog();
    const queryReceipts = await buildsMinimalQueryReceipts(metricCatalog);
    const first = writesMinimalTraceabilityInputs(firstDir, metricCatalog, queryReceipts);
    const second = writesMinimalTraceabilityInputs(secondDir, metricCatalog, queryReceipts);
    const firstClosurePath = path.join(firstDir, "traceability-documentation-closure-receipt.json");
    const secondClosurePath = path.join(secondDir, "traceability-documentation-closure-receipt.json");

    await generatesTraceabilityDocs(first.reportPath, first.graphPath, first.indexPath, first.outputPath, {
      metricCatalogPath: first.metricCatalogPath,
      queryReceiptPath: first.queryReceiptsPath,
      closureReceiptPath: firstClosurePath,
    });
    await generatesTraceabilityDocs(second.reportPath, second.graphPath, second.indexPath, second.outputPath, {
      metricCatalogPath: second.metricCatalogPath,
      queryReceiptPath: second.queryReceiptsPath,
      closureReceiptPath: secondClosurePath,
    });

    assert.deepEqual(fs.readFileSync(first.outputPath), fs.readFileSync(second.outputPath));
    const firstClosure = JSON.parse(fs.readFileSync(firstClosurePath, "utf8"));
    const secondClosure = JSON.parse(fs.readFileSync(secondClosurePath, "utf8"));
    assert.equal(firstClosure.document.hash, secondClosure.document.hash);
    assert.equal(firstClosure.deterministicReceiptHash, secondClosure.deterministicReceiptHash);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
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

function hashesArtifact(artifact) {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalizes(artifact)), "utf8").digest("hex")}`;
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
