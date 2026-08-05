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

test("engineering-truth load persists and conflict-checks canonical contract documents and normalized nodes", () => {
  assert.match(loadEngineeringTruthSql, /JSON_QUERY\(@PayloadJson, '\$\.contractDocument'\) IS NULL/u);
  assert.doesNotMatch(loadEngineeringTruthSql, /COUNT\(\*\) FROM OPENJSON\(@PayloadJson, '\$\.contractDocument'\)/u);
  assert.match(loadEngineeringTruthSql, /INSERT authority\.ContractDocument/u);
  assert.match(loadEngineeringTruthSql, /contractDocument\.authorityDigest must match/u);
  assert.match(loadEngineeringTruthSql, /Existing canonical contract document conflicts/u);
  assert.match(loadEngineeringTruthSql, /INSERT authority\.ContractNode/u);
  assert.match(loadEngineeringTruthSql, /Existing normalized contract authority nodes conflict/u);
  assert.match(loadEngineeringTruthSql, /contractNodes must contain the complete normalized contract authority document/u);
  assert.match(loadEngineeringTruthSql, /contractNodes must contain unique pointer identities/u);
  assert.match(loadEngineeringTruthSql, /contractNodes must contain exactly one root node/u);
});
