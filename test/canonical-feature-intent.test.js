import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { discoversCanonicalFeatureIntents, parsesCanonicalGherkin, projectsCanonicalFeatureQueryPlane, validatesCanonicalFeatureIntent } from "../src/governance/canonical-feature-intent.js";

const featureFile = "features/cli-call-graph-command.feature";

async function readsFixture() {
  const [gherkinSource, intentSource] = await Promise.all([
    readFile(new URL("../features/cli-call-graph-command.feature", import.meta.url), "utf8"),
    readFile(new URL("../features/cli-call-graph-command.intent.json", import.meta.url), "utf8"),
  ]);
  return { gherkinSource, intent: JSON.parse(intentSource) };
}

test("parses canonical identities without treating readable Gherkin as authority", async () => {
  const { gherkinSource } = await readsFixture();
  const parsed = parsesCanonicalGherkin(gherkinSource, { featureFile });
  assert.equal(parsed.feature.featureId, "source-facts.cli-call-graph");
  assert.equal(parsed.scenarios[0].scenarioId, "source-facts.cli-call-graph.from-entry-point");
  assert.deepEqual(parsed.scenarios[0].steps.map(({ keyword, stepId }) => ({ keyword, stepId })), [
    { keyword: "Given", stepId: "validated-source-index" },
    { keyword: "When", stepId: "call-graph-projection-requested" },
    { keyword: "Then", stepId: "reachable-callables-returned" },
    { keyword: "And", stepId: "unresolved-edges-classified" },
  ]);
  assert.deepEqual(parsed.findings, []);
});

test("validates the real feature and canonical intent bidirectionally", async () => {
  const fixture = await readsFixture();
  const result = await validatesCanonicalFeatureIntent({ ...fixture, featureFile });
  assert.equal(result.valid, true);
  assert.deepEqual(result.findings, []);
});

test("reports missing, duplicated, reused, cardinality, and file-drift failures with typed codes", async () => {
  const { gherkinSource, intent } = await readsFixture();
  const driftedGherkin = gherkinSource
    .replace("&scenario:source-facts.cli-call-graph.from-entry-point", "&scenario:duplicate-scenario")
    .replace("&given:validated-source-index", "&given:shared-id")
    .concat("\n&scenario:duplicate-scenario\nScenario: Duplicate\n&given:orphan-step\nGiven duplicate evidence\n");
  const driftedIntent = structuredClone(intent);
  driftedIntent.featureFile = "docs/features/other.feature";
  driftedIntent.scenarios[0].givenId = "shared-id";
  driftedIntent.scenarios.push({ ...structuredClone(driftedIntent.scenarios[0]), scenarioId: "duplicate-scenario", scenarioAnchor: "&scenario:duplicate-scenario" });
  const result = await validatesCanonicalFeatureIntent({ gherkinSource: driftedGherkin, featureFile, intent: driftedIntent });
  const codes = new Set(result.findings.map(({ code }) => code));
  assert.equal(result.valid, false);
  for (const code of ["INTENT_FEATURE_FILE_MISMATCH", "SCENARIO_ANCHOR_DUPLICATED", "RESPONSIBILITY_CARDINALITY_INVALID", "OBLIGATION_CARDINALITY_INVALID", "GHERKIN_STEP_INTENT_MISSING", "CANONICAL_ID_REUSED"]) assert.ok(codes.has(code), code);
});

test("reports an unresolved feature anchor in either direction", async () => {
  const { gherkinSource, intent } = await readsFixture();
  const result = await validatesCanonicalFeatureIntent({ gherkinSource: gherkinSource.replace("source-facts.cli-call-graph\nFeature", "different-feature\nFeature"), featureFile, intent });
  assert.ok(result.findings.some(({ code }) => code === "FEATURE_ANCHOR_UNRESOLVED"));
});

for (const fixtureName of ["cli-project-command", "cli-query-command", "cli-call-graph-command", "cli-govern-command", "cli-propose-feature-coverage-command", "cli-sync-self-governance-command"]) {
  test(`validates canonical CLI feature pair: ${fixtureName}`, async () => {
    const pairFeatureFile = `features/${fixtureName}.feature`;
    const [gherkinSource, intentSource] = await Promise.all([
      readFile(new URL(`../${pairFeatureFile}`, import.meta.url), "utf8"),
      readFile(new URL(`../features/${fixtureName}.intent.json`, import.meta.url), "utf8"),
    ]);
    const result = await validatesCanonicalFeatureIntent({ gherkinSource, featureFile: pairFeatureFile, intent: JSON.parse(intentSource) });
    assert.deepEqual(result.findings, []);
  });
}

test("discovers the complete canonical-intent registry and projects queryable trace rows", async () => {
  const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
  const discovery = await discoversCanonicalFeatureIntents(fileURLToPath(new URL("../features", import.meta.url)), { relativeTo: repositoryRoot });
  assert.equal(discovery.disposition, "CANONICAL_FEATURE_INTENTS_VALID");
  assert.equal(discovery.pairs.length, 9);
  assert.deepEqual(discovery.findings, []);

  const index = {
    symbols: [
      { symbolId: "query-root", name: "runQuery", modulePath: "src/cli.js" },
      { symbolId: "query-child", name: "executeRelationalQuery", modulePath: "src/query.js" },
    ],
    relationships: [{ fromSymbolId: "query-root", toSymbolId: "query-child" }],
    sourceReferences: [{ referenceId: "query-mechanic-ref", startLine: 8, startColumn: 3 }],
    bodyMechanics: [{ bodyMechanicId: "query-branch", fromSymbolId: "query-child", sourceReferenceId: "query-mechanic-ref", mechanic: "branch" }],
  };
  const plane = projectsCanonicalFeatureQueryPlane(discovery, index);
  assert.equal(plane.canonicalFeatures.features.length, 9);
  assert.equal(plane.canonicalFeatures.scenarios.length, 18);
  assert.equal(plane.canonicalFeatures.steps.length, 65);
  assert.equal(plane.canonicalIntents.responsibilities.length, 18);
  assert.equal(plane.canonicalTraces.featureToInterface.find((row) => row.featureId === "source-facts.cli-query").interfaceDisposition, "INTERFACE_ROOT_RESOLVED");
  assert.deepEqual(plane.canonicalTraces.featureToCallgraph.filter((row) => row.featureId === "source-facts.cli-query").map((row) => row.callableId), ["src/cli.js#runQuery", "src/query.js#executeRelationalQuery"]);
  assert.equal(plane.canonicalTraces.obligationToMechanics.find((row) => row.obligationId === "execute-semantic-search-query").mechanicLocation.sourceReferenceId, "query-mechanic-ref");
});
