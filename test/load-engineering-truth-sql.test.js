import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const loadEngineeringTruthSql = await readFile(
  new URL("../scripts/sql/007-load-engineering-truth.sql", import.meta.url),
  "utf8",
);

test("engineering-truth load backfills missing application context without overwriting conflicts", () => {
  assert.match(loadEngineeringTruthSql, /Existing contract snapshot ApplicationId conflicts/u);
  assert.match(loadEngineeringTruthSql, /existing\.ApplicationId IS NULL\s+AND source\.ApplicationId IS NOT NULL/u);
  assert.match(loadEngineeringTruthSql, /Existing enterprise subject ApplicationId conflicts/u);
  assert.match(loadEngineeringTruthSql, /Existing enterprise subject relationship ApplicationId conflicts/u);
  assert.doesNotMatch(loadEngineeringTruthSql, /SET ApplicationId = NULL/u);
});
