import assert from "node:assert/strict";
import test from "node:test";
import { extractsCanonicalTestVectorFromSqlServer, recordsCanonicalTestExecutionInSqlServer } from "../src/sqlserver/canonical-test-vector.js";

const connection={buildsArgs:()=>[],appliesToChildEnv:(env)=>env};

test("extracts admitted vector authority and records only SQL testimony",async()=>{
  const authority={rootId:"root",testVectorId:"vector"}; let extractionQuery;
  const extracted=await extractsCanonicalTestVectorFromSqlServer({rootId:"root",testVectorId:"vector",connection,queryRunner:async({query})=>{extractionQuery=query;return[`A|${Buffer.from(JSON.stringify(authority),"utf16le").toString("base64")}`];}});
  assert.deepEqual(extracted,authority); assert.match(extractionQuery,/testauthority\.TestExpectation/u); assert.match(extractionQuery,/testexecution\.RepositoryTestClosureSeal/u);
  const result={testRunId:"sha256:run",conformanceDisposition:"CANONICAL_EXPECTATION_CONFORMS"}; let recordQuery;
  const receipt=await recordsCanonicalTestExecutionInSqlServer({result,connection,queryRunner:async({query})=>{recordQuery=query;return["E|sha256:run|CANONICAL_EXPECTATION_CONFORMS|CANONICAL_TEST_EXECUTION_RECORDED"];}});
  assert.equal(receipt.disposition,"CANONICAL_TEST_EXECUTION_RECORDED"); assert.match(recordQuery,/ingestion\.RecordCanonicalTestExecution/u);
});
