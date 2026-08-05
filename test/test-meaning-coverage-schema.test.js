import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/021-create-canonical-test-meaning-coverage.sql", import.meta.url), "utf8");

test("separates observed meaning recommendations, reviewed authority, coverage, and backlog", () => {
  for (const subject of ["testobservation.TestMeaningClassification", "testauthority.TestMeaningReview", "projection.CurrentTestMeaning", "projection.CurrentTestMeaningCoverage", "projection.CurrentCapabilityBacklog", "DETERMINISTIC_RECOMMENDATION_NOT_ADMITTED", "REVIEW_ADMITTED"]) {
    assert.match(sql, new RegExp(subject.replace(".", "\\."), "u"));
  }
  assert.match(sql, /Every observed test requires one meaning recommendation/u);
  assert.match(sql, /TEST_MEANING_REVIEW_INCOMPLETE/u);
});
