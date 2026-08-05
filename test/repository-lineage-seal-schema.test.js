import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/018-create-repository-lineage-seal.sql", import.meta.url), "utf8");

test("lineage seal schema stores one honest current SQL closure", () => {
  assert.match(sql, /CREATE TABLE projection\.RepositoryLineageSeal/u);
  assert.match(sql, /PRIMARY KEY \(RootId\)/u);
  assert.match(sql, /CREATE OR ALTER PROCEDURE projection\.RefreshRepositoryLineageSeal/u);
  assert.match(sql, /CREATE OR ALTER VIEW projection\.CurrentRepositoryGovernanceClosure/u);
  assert.match(sql, /IX_ContractSnapshot_CurrentIntent/u);
  assert.match(sql, /DIGEST_SEALED_NOT_SIGNED/u);
  assert.match(sql, /LINEAGE_SEAL_STALE/u);
  assert.doesNotMatch(sql, /proof.*file|receipt.*file/iu);
});
