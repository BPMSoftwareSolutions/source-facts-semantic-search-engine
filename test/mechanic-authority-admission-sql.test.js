import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { admitsMechanicAuthorityInSqlServer, recordsMechanicAuthorityLoweringAttemptInSqlServer } from "../src/sqlserver/repository-execution-knowledge.js";
import { deterministicMechanicLowererVersion, lowersDeterministicMechanicAuthority } from "../src/governance/lowers-deterministic-mechanic-authority.js";

const connection = { buildsArgs: () => [], appliesToChildEnv: (env) => env };
const source = "if (enabled) run();\n";
const analysisDigest = digest("analysis");
const artifactDigest = digest(source);
const authority = lowersDeterministicMechanicAuthority({
  mechanicOccurrenceId: "mechanic-1",
  mechanicKind: "branch",
  artifactId: "src/example.js",
  artifactDigest,
  executionAnalysisDigest: analysisDigest,
  sourceText: source,
  startLine: 1,
  startColumn: 1,
}).authorityData;

test("admits schema-valid authority with mandatory CAS evidence and echoes its identity", async () => {
  let query;
  const receipt = await admitsMechanicAuthorityInSqlServer({
    rootId: "root",
    mechanicOccurrenceId: "mechanic-1",
    mechanicKind: "branch",
    lowererVersion: deterministicMechanicLowererVersion,
    authorityData: authority,
    expectedAnalysisDigest: analysisDigest,
    expectedArtifactDigest: artifactDigest,
    connection,
    queryRunner: async (request) => {
      query = request.query;
      return [`M|${analysisDigest}|mechanic-1|${digest("authority")}|MECHANIC_AUTHORITY_ADMITTED`];
    },
  });
  assert.equal(receipt.disposition, "MECHANIC_AUTHORITY_ADMITTED");
  assert.equal(receipt.analysisDigest, analysisDigest);
  assert.equal(receipt.mechanicOccurrenceId, "mechanic-1");
  assert.match(query, /EXEC ingestion\.AdmitMechanicAuthority/u);
  assert.match(query, /typescript-mechanic-lowerer\.v3/u);
  assert.match(query, new RegExp(analysisDigest, "u"));
  assert.match(query, new RegExp(artifactDigest, "u"));
});

test("rejects missing CAS evidence and invalid authority before invoking SQL", async () => {
  await assert.rejects(
    admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", lowererVersion: deterministicMechanicLowererVersion, authorityData: authority, expectedArtifactDigest: artifactDigest, connection }),
    /expectedAnalysisDigest must be a sha256 digest/u,
  );
  await assert.rejects(
    admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", lowererVersion: deterministicMechanicLowererVersion, authorityData: { arbitrary: true }, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }),
    /Deterministic branch authority is invalid/u,
  );
});

test("records a digest-bound rejected lowering attempt", async () => {
  let query;
  const receipt = await recordsMechanicAuthorityLoweringAttemptInSqlServer({
    rootId: "root",
    mechanicOccurrenceId: "mechanic-1",
    mechanicKind: "branch",
    artifactId: "src/example.js",
    expectedAnalysisDigest: analysisDigest,
    expectedArtifactDigest: artifactDigest,
    lowererVersion: deterministicMechanicLowererVersion,
    loweringDisposition: "DETERMINISTIC_AUTHORITY_REJECTED",
    rejectionReason: "UNSUPPORTED_PREDICATE_FORM",
    requiredPrimitive: "predicate-form:CallExpression",
    message: "Call predicates require a reviewed primitive.",
    connection,
    queryRunner: async (request) => {
      query = request.query;
      return [`L|${analysisDigest}|mechanic-1|MECHANIC_AUTHORITY_LOWERING_ATTEMPT_RECORDED`];
    },
  });
  assert.equal(receipt.disposition, "MECHANIC_AUTHORITY_LOWERING_ATTEMPT_RECORDED");
  assert.match(query, /RecordMechanicAuthorityLoweringAttempt/u);
  assert.match(query, /predicate-form:CallExpression/u);
});

test("admits a non-branch authority through the same validated SQL lane", async () => {
  const iterationSource = "for (const item of items) consume(item);";
  const iterationAuthority = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "iteration-1", mechanicKind: "iteration", artifactId: "src/example.js", artifactDigest: digest(iterationSource), sourceText: iterationSource, startLine: 1, startColumn: 1 }).authorityData;
  let query;
  const receipt = await admitsMechanicAuthorityInSqlServer({
    rootId: "root", mechanicOccurrenceId: "iteration-1", mechanicKind: "iteration",
    lowererVersion: deterministicMechanicLowererVersion, authorityData: iterationAuthority,
    expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: digest(iterationSource), connection,
    queryRunner: async request => { query = request.query; return [`M|${analysisDigest}|iteration-1|${digest("iteration-authority")}|MECHANIC_AUTHORITY_ADMITTED`]; },
  });
  assert.equal(receipt.disposition, "MECHANIC_AUTHORITY_ADMITTED");
  assert.match(query, /iteration-authority\.v1/u);
  assert.match(query, /"mechanicKind":"iteration"/u);
});

test("requires root, occurrence, mechanic, lowerer, authority, and digests", async () => {
  await assert.rejects(admitsMechanicAuthorityInSqlServer({ mechanicOccurrenceId: "m", mechanicKind: "branch", lowererVersion: deterministicMechanicLowererVersion, authorityData: authority, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }), /rootId is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicKind: "branch", lowererVersion: deterministicMechanicLowererVersion, authorityData: authority, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }), /mechanicOccurrenceId is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicOccurrenceId: "m", lowererVersion: deterministicMechanicLowererVersion, authorityData: authority, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }), /mechanicKind is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicOccurrenceId: "m", mechanicKind: "branch", authorityData: authority, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }), /lowererVersion is required/u);
  await assert.rejects(admitsMechanicAuthorityInSqlServer({ rootId: "root", mechanicOccurrenceId: "m", mechanicKind: "branch", lowererVersion: deterministicMechanicLowererVersion, expectedAnalysisDigest: analysisDigest, expectedArtifactDigest: artifactDigest, connection }), /authorityData is required/u);
});

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
