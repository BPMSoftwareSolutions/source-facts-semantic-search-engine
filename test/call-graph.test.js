import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { projectsCliEntryPointCallGraph } from "../src/call-graph.js";
import { validatesSourceFactIndex } from "../src/validate-index.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");

test("projectsCliEntryPointCallGraph builds a rooted transitive graph and reports dead callables", async () => {
  const index = buildsFixtureIndex();
  await validatesSourceFactIndex(index);

  const graph = projectsCliEntryPointCallGraph(index, { rootModulePath: "src/cli.js", runtimeModulePrefix: "src/" });
  assert.equal(graph.callGraphType, "cli-entry-point-call-graph.v1");
  assert.equal(graph.roots.length, 4);
  assert.equal(graph.summary.commandRootCount, 1);
  assert.equal(graph.summary.exportedFunctionRootCount, 3);
  assert.equal(graph.summary.runtimeCallableCount, 5);

  const cliRoot = graph.roots.find((root) => root.entryKind === "cli-command");
  assert.ok(cliRoot);
  assert.equal(cliRoot.name, "runGovern");
  assert.equal(cliRoot.entryRelationshipId, "1".repeat(64));
  assert.equal(cliRoot.summary.reachableCallableCount, 4);
  assert.equal(cliRoot.summary.directInvocationCount, 2);
  assert.deepEqual(cliRoot.depthLayers, [
    [cliRoot.symbolId],
    ["src/governance/projects-self-governance-report.js#function:projectsSelfGovernanceReport"],
    ["src/governance/proposes-feature-coverage.js#function:proposesFeatureCoverage"],
    ["src/governance/invokes-live-model-inference.js#function:invokesLiveModelInference"],
  ]);
  assert.equal(cliRoot.edges.length, 4);
  assert.ok(cliRoot.edges.some((edge) => edge.resolutionDisposition === "unresolved" && edge.toSymbolCandidate === "process.stdout.write"));
  assert.ok(graph.unreachableSymbols.some((symbol) => symbol.name === "deadHelper"));

  const target = graph.reachability.find((entry) => entry.name === "invokesLiveModelInference");
  assert.ok(target);
  assert.equal(target.reachableFrom.length, 4);
  const reachableFromSelf = target.reachableFrom.find((r) => r.rootName === "invokesLiveModelInference");
  assert.ok(reachableFromSelf);
  assert.equal(reachableFromSelf.depth, 0);
  const reachableFromProposesFeatureCoverage = target.reachableFrom.find((r) => r.rootName === "proposesFeatureCoverage");
  assert.ok(reachableFromProposesFeatureCoverage);
  assert.equal(reachableFromProposesFeatureCoverage.depth, 1);
  const reachableFromProjectsSelfGovernanceReport = target.reachableFrom.find((r) => r.rootName === "projectsSelfGovernanceReport");
  assert.ok(reachableFromProjectsSelfGovernanceReport);
  assert.equal(reachableFromProjectsSelfGovernanceReport.depth, 2);
  const reachableFromCli = target.reachableFrom.find((r) => r.rootName === "runGovern");
  assert.ok(reachableFromCli);
  assert.equal(reachableFromCli.depth, 3);
});

test("call-graph CLI writes the graph artifact and summary", async () => {
  const outputDirectory = mkdtempSync(path.join(os.tmpdir(), "source-facts-call-graph-"));
  const indexPath = path.join(outputDirectory, "source-fact-index.json");
  const outputPath = path.join(outputDirectory, "call-graph.json");
  writeFileSync(indexPath, JSON.stringify(buildsFixtureIndex(), null, 2), "utf8");

  try {
    const result = spawnSync(
      process.execPath,
      [cliPath, "call-graph", "--index", indexPath, "--output", outputPath, "--root-module-path", "src/cli.js", "--runtime-module-prefix", "src/", "--pretty", "--summary"],
      {
        cwd: repoRoot,
        encoding: "utf8",
        env: { ...process.env, DEBUG_CALL_GRAPH: "true" },
      },
    );

    assert.equal(result.status, 0, `CLI failed with status ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
    assert.ok(result.stdout.includes(outputPath), "CLI should print the output path");
    assert.ok(result.stdout.includes("Command roots: 1"), "CLI summary should include CLI root count");
    assert.ok(result.stdout.includes("Exported function roots: 3"), "CLI summary should include exported function root count");
    assert.ok(result.stdout.includes("Unreachable callables: 1"), "CLI summary should include the dead-code count");

    const graph = JSON.parse(readFileSync(outputPath, "utf8"));
    const cliRoot = graph.roots.find((root) => root.entryKind === "cli-command");
    assert.ok(cliRoot, "Should have a CLI command root");
    assert.equal(cliRoot.name, "runGovern");
    assert.equal(graph.summary.commandRootCount, 1);
    assert.equal(graph.summary.exportedFunctionRootCount, 3);
    assert.equal(graph.summary.reachableCallableCount, 4);
    assert.ok(graph.unreachableSymbols.some((symbol) => symbol.name === "deadHelper"));
  } finally {
    rmSync(outputDirectory, { recursive: true, force: true });
  }
});

function buildsFixtureIndex() {
  const rootSymbolId = "src/cli.js#function:runGovern";
  const projectReportSymbolId = "src/governance/projects-self-governance-report.js#function:projectsSelfGovernanceReport";
  const proposesFeatureCoverageSymbolId = "src/governance/proposes-feature-coverage.js#function:proposesFeatureCoverage";
  const invokesLiveModelInferenceSymbolId = "src/governance/invokes-live-model-inference.js#function:invokesLiveModelInference";
  const deadHelperSymbolId = "src/dead.mjs#function:deadHelper";

  return {
    indexType: "source-fact-index.v1",
    indexId: `sha256:${"a".repeat(64)}`,
    manifest: {
      schemaVersion: "1.1.0",
      engine: "source-facts-semantic-search-engine",
      engineVersion: "0.2.0",
      scanId: "b".repeat(64),
      documentRootHash: `sha256:${"c".repeat(64)}`,
      scanRequest: {
        workspaceId: "fixture",
        workspaceRoot: repoRoot,
      },
    },
    workspace: {
      workspaceId: "fixture",
      rootHash: `sha256:${"d".repeat(64)}`,
      languageId: "typescript",
      languageProfileVersion: "1.0.0",
    },
    files: [],
    symbols: [
      buildsFixtureSymbol(rootSymbolId, "runGovern", "src/cli.js", 10),
      buildsFixtureSymbol(projectReportSymbolId, "projectsSelfGovernanceReport", "src/governance/projects-self-governance-report.js", 20),
      buildsFixtureSymbol(proposesFeatureCoverageSymbolId, "proposesFeatureCoverage", "src/governance/proposes-feature-coverage.js", 30),
      buildsFixtureSymbol(invokesLiveModelInferenceSymbolId, "invokesLiveModelInference", "src/governance/invokes-live-model-inference.js", 40),
      buildsFixtureSymbol(deadHelperSymbolId, "deadHelper", "src/dead.mjs", 50, false),
    ],
    relationships: [
      buildsFixtureRelationship({
        relationshipId: "1".repeat(64),
        sourceReferenceId: "src/cli.js:120:12",
        fromSymbolId: null,
        fromSymbolResolution: "unresolved",
        toSymbolId: rootSymbolId,
        toSymbolCandidate: "runGovern",
        modulePath: "src/cli.js",
      }),
      buildsFixtureRelationship({
        relationshipId: "2".repeat(64),
        sourceReferenceId: "src/cli.js:121:20",
        fromSymbolId: rootSymbolId,
        fromSymbolResolution: "enclosing-callable",
        toSymbolId: projectReportSymbolId,
        toSymbolCandidate: "projectsSelfGovernanceReport",
        modulePath: "src/cli.js",
      }),
      buildsFixtureRelationship({
        relationshipId: "3".repeat(64),
        sourceReferenceId: "src/governance/projects-self-governance-report.js:31:18",
        fromSymbolId: projectReportSymbolId,
        fromSymbolResolution: "enclosing-callable",
        toSymbolId: proposesFeatureCoverageSymbolId,
        toSymbolCandidate: "proposesFeatureCoverage",
        modulePath: "src/governance/projects-self-governance-report.js",
      }),
      buildsFixtureRelationship({
        relationshipId: "4".repeat(64),
        sourceReferenceId: "src/governance/proposes-feature-coverage.js:47:10",
        fromSymbolId: proposesFeatureCoverageSymbolId,
        fromSymbolResolution: "enclosing-callable",
        toSymbolId: invokesLiveModelInferenceSymbolId,
        toSymbolCandidate: "invokesLiveModelInference",
        modulePath: "src/governance/proposes-feature-coverage.js",
      }),
      buildsFixtureRelationship({
        relationshipId: "5".repeat(64),
        sourceReferenceId: "src/cli.js:122:8",
        fromSymbolId: rootSymbolId,
        fromSymbolResolution: "enclosing-callable",
        toSymbolId: null,
        toSymbolCandidate: "process.stdout.write",
        modulePath: "src/cli.js",
      }),
    ],
    dataflows: [],
    sourceReferences: [
      buildsFixtureSourceReference("src/cli.js:120:12", "src/cli.js", 120, 12, 120, 26, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/cli.js:121:20", "src/cli.js", 121, 20, 121, 58, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/cli.js:122:8", "src/cli.js", 122, 8, 122, 34, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/governance/projects-self-governance-report.js:31:18", "src/governance/projects-self-governance-report.js", 31, 18, 31, 52, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/governance/proposes-feature-coverage.js:47:10", "src/governance/proposes-feature-coverage.js", 47, 10, 47, 46, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/governance/projects-self-governance-report.js:39:16", "src/governance/projects-self-governance-report.js", 39, 16, 39, 38, "invocation", "call-expression"),
      buildsFixtureSourceReference("src/cli.js:10:1", "src/cli.js", 10, 1, 10, 20, "declaration", "function"),
      buildsFixtureSourceReference("src/governance/projects-self-governance-report.js:20:1", "src/governance/projects-self-governance-report.js", 20, 1, 20, 48, "declaration", "function"),
      buildsFixtureSourceReference("src/governance/proposes-feature-coverage.js:30:1", "src/governance/proposes-feature-coverage.js", 30, 1, 30, 44, "declaration", "function"),
      buildsFixtureSourceReference("src/governance/invokes-live-model-inference.js:40:1", "src/governance/invokes-live-model-inference.js", 40, 1, 40, 40, "declaration", "function"),
      buildsFixtureSourceReference("src/dead.mjs:50:1", "src/dead.mjs", 50, 1, 50, 24, "declaration", "function"),
    ],
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
    coverage: {
      filesObserved: 0,
      declarations: 5,
      relationships: 5,
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

function buildsFixtureSymbol(symbolId, name, modulePath, declarationLine, isExported = true) {
  return {
    symbolId,
    symbolVersionId: `sha256:${"e".repeat(64)}`,
    kind: "function",
    name,
    modulePath,
    sourceReferenceId: `${modulePath}:${declarationLine}:1`,
    declarationLine,
    declarationColumn: 1,
    declarationHeaderHash: "f".repeat(64),
    isExported,
  };
}

function buildsFixtureRelationship({ relationshipId, sourceReferenceId, fromSymbolId, fromSymbolResolution, toSymbolId, toSymbolCandidate, modulePath }) {
  return {
    relationshipId,
    relationshipKind: "invocation",
    sourceReferenceId,
    fromSymbolId,
    fromSymbolResolution,
    toSymbolId,
    toSymbolCandidate,
    operator: null,
    modulePath,
  };
}

function buildsFixtureSourceReference(referenceId, modulePath, startLine, startColumn, endLine, endColumn, kind, sourceKind) {
  return {
    referenceId,
    modulePath,
    startLine,
    startColumn,
    endLine,
    endColumn,
    kind,
    sourceKind,
  };
}
