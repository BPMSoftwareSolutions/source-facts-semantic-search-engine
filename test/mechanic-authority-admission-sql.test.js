import assert from "node:assert/strict";
import test from "node:test";
import { admitsMechanicAuthorityInSqlServer } from "../src/sqlserver/repository-execution-knowledge.js";

const connection={buildsArgs:()=>[],appliesToChildEnv:env=>env};

test("admits completed mechanic authority and echoes its identity",async()=>{
  let query;
  const receipt=await admitsMechanicAuthorityInSqlServer({
    rootId:"root",
    mechanicOccurrenceId:"sha256:mechanic-1",
    authorityData:{authorityKind:"decision-authority.v1",candidateAuthorityId:"candidate-sha256:mechanic-1",inputs:[],rules:[],outcomes:[],noMatchDisposition:"DECISION_NOT_RESOLVED"},
    connection,
    queryRunner:async request=>{
      query=request.query;
      return ["M|sha256:analysis|sha256:mechanic-1|sha256:authority|MECHANIC_AUTHORITY_ADMITTED"];
    },
  });
  assert.equal(receipt.disposition,"MECHANIC_AUTHORITY_ADMITTED");
  assert.equal(receipt.analysisDigest,"sha256:analysis");
  assert.equal(receipt.mechanicOccurrenceId,"sha256:mechanic-1");
  assert.equal(receipt.authorityDigest,"sha256:authority");
  assert.match(query,/EXEC ingestion\.AdmitMechanicAuthority/u);
  assert.match(query,/mechanic-1/u);
  assert.match(query,/DECISION_NOT_RESOLVED/u);
});

test("rejects a mismatched identity echoed back from SQL Server",async()=>{
  await assert.rejects(
    admitsMechanicAuthorityInSqlServer({
      rootId:"root",
      mechanicOccurrenceId:"sha256:mechanic-1",
      authorityData:{authorityKind:"decision-authority.v1"},
      connection,
      queryRunner:async()=>["M|sha256:analysis|sha256:mechanic-2|sha256:authority|MECHANIC_AUTHORITY_ADMITTED"],
    }),
    /identity mismatch/u,
  );
});

test("requires rootId, mechanicOccurrenceId, and authorityData",async()=>{
  await assert.rejects(admitsMechanicAuthorityInSqlServer({mechanicOccurrenceId:"m",authorityData:{},connection}),/rootId is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({rootId:"root",authorityData:{},connection}),/mechanicOccurrenceId is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({rootId:"root",mechanicOccurrenceId:"m",connection}),/authorityData is required/u);
});
