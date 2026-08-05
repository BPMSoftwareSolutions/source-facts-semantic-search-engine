import assert from "node:assert/strict";
import test from "node:test";
import { classifiesTestMeaning } from "../src/classifies-test-meaning.js";

const base = { testId: "test", testFilePath: "test/example.test.js", testName: "does work", suitePath: [], executionStatus: "ENABLED" };

test("recommends scenario meaning from unique lineage evidence without admitting it", () => {
  const result = classifiesTestMeaning({
    testCase: base,
    assertions: [{ assertionId: "a" }],
    invocations: [{ importedModulePath: "src/work.js", invocationName: "doesWork" }],
    candidates: [{ scenarioId: "feature.scenario" }],
  });
  assert.equal(result.recommendedProofType, "SCENARIO_TEST");
  assert.equal(result.confidence, "HIGH");
  assert.equal(result.reviewDisposition, "REVIEW_REQUIRED");
  assert.equal(result.classificationDisposition, "DETERMINISTIC_RECOMMENDATION_NOT_ADMITTED");
});

test("keeps unowned asserted behavior in the candidate lane", () => {
  const result = classifiesTestMeaning({ testCase: base, assertions: [{ assertionId: "a" }] });
  assert.equal(result.recommendedProofType, "REGRESSION_EVIDENCE");
  assert.equal(result.recommendedOntologyLane, "CANDIDATE");
});

test("classifies skipped evidence as inactive before vocabulary heuristics", () => {
  const result = classifiesTestMeaning({ testCase: { ...base, testName: "projection parity", executionStatus: "SKIPPED" } });
  assert.equal(result.recommendedProofType, "HISTORICAL_OR_INACTIVE");
  assert.equal(result.recommendedOntologyLane, "INACTIVE");
});
