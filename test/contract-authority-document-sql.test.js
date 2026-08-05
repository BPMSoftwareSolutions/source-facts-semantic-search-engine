import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/015-create-contract-authority-document.sql", import.meta.url), "utf8");

test("contract authority storage preserves canonical bytes beside a constrained normalized tree", () => {
  assert.match(sql, /CREATE TABLE authority\.ContractDocument/u);
  assert.match(sql, /CanonicalJson nvarchar\(max\) NOT NULL/u);
  assert.match(sql, /CREATE TABLE authority\.ContractNode/u);
  assert.match(sql, /UQ_ContractNode_Pointer UNIQUE/u);
  assert.match(sql, /FK_ContractNode_Parent FOREIGN KEY/u);
  assert.match(sql, /CK_ContractNode_ValueType CHECK/u);
  assert.match(sql, /CK_ContractNode_RootOrChild CHECK/u);
});
