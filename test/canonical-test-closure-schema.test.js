import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/019-create-canonical-test-closure.sql", import.meta.url), "utf8");

test("canonical test closure schema separates authority, observation, candidates, execution, and current closure", () => {
  for (const name of ["testauthority.TestVector","testauthority.TestExpectation","testauthority.ProofRequirement","testobservation.TestArtifact","testobservation.TestSuite","testobservation.TestCase","testobservation.Assertion","testobservation.FixtureUsage","testobservation.MockUsage","testobservation.TestInvocation","testbinding.TestCaseCandidate","testexecution.TestRun","testexecution.RepositoryTestClosureSeal","projection.CurrentFeatureTestClosure","projection.CurrentScenarioTestClosure","projection.CurrentRepositoryTestClosure"]) assert.match(sql, new RegExp(name.replace(".", "\\."), "u"));
  assert.match(sql, /CANDIDATE_NOT_ADMITTED/u); assert.match(sql, /SCENARIO_PROOF_MISSING/u); assert.match(sql, /DIGEST_SEALED_NOT_SIGNED/u);
});
