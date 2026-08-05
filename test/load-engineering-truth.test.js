import assert from "node:assert/strict";
import test from "node:test";
import { projectsCanonicalIntentRegistryContract, projectsEngineeringTruthSqlPayload } from "../src/sqlserver/load-engineering-truth.js";

function fixture() {
  const contract = {
    contract: { contractId: "contract.v1", contractType: "governed-artifact-contract.v1" },
    subject: { subjectId: "subject.v1" },
    artifacts: [{
      artifactId: "artifact.v1", artifactKind: "javascript-module", purpose: "Execute the feature.",
      relativePath: "src/feature.js", mediaType: "text/javascript", projection: { projectorId: "javascript.v1" },
    }],
    lineage: {
      authorityType: "canonical-lineage-authority.v1", projectId: "project.v1",
      features: [{ featureId: "feature.v1", projectId: "project.v1", purpose: "Provide the feature." }],
      scenarios: [{ scenarioId: "scenario.v1", featureId: "feature.v1", purpose: "Exercise it." }],
      obligations: [{ obligationId: "obligation.v1", scenarioId: "scenario.v1", statement: "It works." }],
      responsibilities: [{ responsibilityId: "responsibility.v1", obligationId: "obligation.v1", responsibilityType: "semantic-execution", projectionProfileId: "javascript.v1", artifactId: "artifact.v1" }],
    },
  };
  const callable = { symbolId: "feature.js#function:runFeature", name: "runFeature", modulePath: "src/feature.js", kind: "function", cliClosureClassification: "CLI_FEATURE_ROOT" };
  const report = {
    reportType: "source-facts-self-governance-report.v1", generatedAtUtc: "2026-08-04T00:00:00.000Z",
    repository: { repositoryId: "repo" }, index: { indexId: "sha256:index" },
    interfaceGovernance: {
      commands: [{ commandName: "feature", entryPointId: callable.symbolId, canonicalResponsibilityIds: ["responsibility.v1"] }],
      callableInventory: [callable],
      reachability: [{ entryPointId: callable.symbolId, reachableSymbolId: callable.symbolId, depth: 0, pathWitness: [callable.symbolId], relationshipIds: [], resolutionDisposition: "STATICALLY_RESOLVED" }],
    },
    testTraceability: {
      inventory: [{ testId: "sha256:test", modulePath: "test/feature.test.js", testName: "runs feature", framework: "node:test", executionStatus: "ENABLED", runtimeResultDisposition: "TEST_EXECUTION_NOT_EVALUATED" }],
      productionReachability: [{ testId: "sha256:test", productionSymbolId: callable.symbolId, depth: 0, reachabilityPosture: "DIRECT_PRODUCTION_INVOCATION", pathWitness: [callable.symbolId] }],
      scenarioLineage: [{ testId: "sha256:test", scenarioId: "scenario.v1", responsibilityId: "responsibility.v1", executionDisposition: "TEST_EXECUTION_NOT_EVALUATED", lineageStatus: "CANONICAL_SCENARIO_LINEAGE" }],
      scenarioProofCoverage: [{ scenarioId: "scenario.v1", proofDisposition: "SCENARIO_TEST_PROOF_DECLARED_EXECUTION_NOT_EVALUATED" }],
    },
  };
  return { contract, report };
}

test("projects separate canonical, observed, binding, and proof planes", () => {
  const payload = projectsEngineeringTruthSqlPayload(fixture());
  assert.equal(payload.payloadType, "engineering-truth-sql-load.v1");
  assert.match(payload.contract.contractSnapshotId, /^sha256:[a-f0-9]{64}$/u);
  assert.match(payload.observation.observationSnapshotId, /^sha256:[a-f0-9]{64}$/u);
  assert.equal(payload.features.length, 1);
  assert.equal(payload.commandReachability.length, 1);
  assert.equal(payload.responsibilityCommands.length, 1);
  assert.equal(payload.responsibilityCallables.length, 1);
  assert.equal(payload.responsibilityCommands[0].bindingDisposition, "OBSERVED_CANONICAL_COMMAND_BINDING");
  assert.equal(payload.tests.length, 1);
  assert.equal(payload.scenarioTestBindings.length, 1);
  assert.equal(payload.scenarioProofs[0].proofDisposition, "SCENARIO_TEST_PROOF_DECLARED_EXECUTION_NOT_EVALUATED");
  assert.notEqual(payload.contract.contractSnapshotId, payload.observation.observationSnapshotId);
});

test("rejects a canonical responsibility whose owned artifact is absent", () => {
  const input = fixture();
  input.contract.lineage.responsibilities[0].artifactId = "missing.v1";
  assert.throws(() => projectsEngineeringTruthSqlPayload(input), /unknown artifact 'missing\.v1'/u);
});

test("projects the canonical intent registry without inventing artifact ownership or obligation prose", () => {
  const intents = [
    { documentKind: "canonical-feature-intent.v1", featureId: "feature.one", purpose: "One", lifecycle: "FEATURE_INTENT_PROPOSED", authorityStatus: "AUTHORITY_MISSING", scenarios: [
      { scenarioId: "scenario.one", obligationId: "obligation.one", responsibilityId: "responsibility.one", purpose: "First scenario" },
      { scenarioId: "scenario.two", obligationId: "obligation.two", responsibilityId: "responsibility.two", purpose: "Second scenario" },
    ] },
  ];
  const contract = projectsCanonicalIntentRegistryContract({ intents, projectId: "project.one" });
  assert.equal(contract.lineage.features.length, 1);
  assert.equal(contract.lineage.scenarios.length, 2);
  assert.equal(contract.lineage.features[0].lifecycleStatus, "FEATURE_INTENT_PROPOSED");
  assert.equal(contract.lineage.obligations[0].statement, null);
  assert.equal(contract.lineage.responsibilities[0].artifactId, null);
});
