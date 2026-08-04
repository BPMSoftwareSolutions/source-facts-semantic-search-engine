import assert from "node:assert/strict";
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
    index: {
      indexId: "sha256:report",
      scanId: "scan-report",
      subject: { repositoryId: "generate-docs-report-fixture" },
    },
    featureCoverage: {
      summary: {
        canonicalFeatures: 4,
        proposedFeatures: 2,
      },
    },
    scenarioConformance: {
      summary: {
        canonicalScenarioCount: 6,
        structurallyClosedCount: 4,
        executionEvaluatedCount: 5,
        conformantCount: 3,
      },
    },
    evidence: {
      summary: {
        canonicalMechanicsCount: 10,
        proposedMechanicsCount: 1,
        ambiguousMechanicsCount: 1,
        unlinkedMechanicsCount: 2,
        unresolvedClustersCount: 0,
      },
    },
    authority: {
      summary: {
        canonicalLineageCount: 3,
        proposedLineageCount: 2,
        missingLineageCount: 1,
      },
    },
    findings: {
      summary: {
        implementationVariantsCount: 2,
        multipleOwnersCount: 1,
        projectionGapsCount: 0,
      },
    },
    evaluationLimits: {
      summary: {
        authorityDepthCount: 1,
        bodyOutOfScopeCount: 2,
        bodyNotObservedCount: 3,
      },
    },
  };
}

function buildsMinimalGraph() {
  return {
    indexId: "sha256:fixture-graph-id",
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

test("generate-docs CLI accepts report and graph overrides", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-generate-docs-"));
  try {
    const reportPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const graphPath = path.join(tempDir, "call-graph.json");
    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "traceability-metrics.md");

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
    assert.ok(markdown.includes("## 3. Feature Coverage (Governance Report)"));
    assert.ok(markdown.includes("| Canonical features | 4 |"));
    assert.ok(markdown.includes("| Canonical scenarios | 6 |"));
    assert.ok(markdown.includes("| Mechanics with canonical scenario lineage | 10 |"));
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
