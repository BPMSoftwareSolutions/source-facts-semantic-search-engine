import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql=await readFile(new URL("../scripts/sql/020-admit-reference-test-vector.sql",import.meta.url),"utf8");
test("reference vector admits independent fixture, execution, expectation, projection, and SQL testimony authority",()=>{
  for(const subject of ["testauthority.TestFixture","testauthority.TestExecutionAuthority","testauthority.TestAuthoritySnapshot","classify-mechanic-authority-family.v1","vitest.v1","ingestion.RecordCanonicalTestExecution","CANONICAL_TEST_VECTOR_BOUND","SCENARIO_PROOF_PASSED","repository-test-closure-seal.v2"]) assert.match(sql,new RegExp(subject.replace(".","\\."),"u"));
});
