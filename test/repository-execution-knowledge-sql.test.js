import assert from "node:assert/strict";
import test from "node:test";
import { recordsRepositoryExecutionKnowledgeInSqlServer, queriesCurrentMechanicAuthorityCandidates, queriesCurrentOperationalExecutionSummary } from "../src/sqlserver/repository-execution-knowledge.js";

const connection={buildsArgs:()=>[],appliesToChildEnv:env=>env};
const analysis={analysisType:"repository-execution-knowledge.v1",rootId:"root",applicationId:"app",repositoryImageDigest:"sha256:image",sourceFactIndexId:"sha256:index",sourceFactIndex:{indexId:"sha256:index"},report:{},contract:{},summary:{artifacts:1,sourceFiles:1,callables:1,commands:1,reachabilityRows:1,mechanics:1,testFiles:0,testMechanics:0}};
analysis.analysisDigest=`sha256:${(await import("node:crypto")).createHash("sha256").update(JSON.stringify(analysis)).digest("hex")}`;

test("records execution analysis identity without writing a disk report",async()=>{
  let query; const receipt=await recordsRepositoryExecutionKnowledgeInSqlServer({analysis,observationSnapshotId:"sha256:observation",contractSnapshotId:"sha256:contract",connection,queryRunner:async request=>{query=request.query;return [`X|${analysis.analysisDigest}|sha256:index|REPOSITORY_EXECUTION_KNOWLEDGE_RECORDED`];}});
  assert.equal(receipt.disposition,"REPOSITORY_EXECUTION_KNOWLEDGE_RECORDED"); assert.match(query,/RecordRepositoryExecutionAnalysis/u); assert.match(query,/sha256:contract/u);
});

test("queries one bounded operational execution summary",async()=>{
  let query; const summary=await queriesCurrentOperationalExecutionSummary({rootId:"root",connection,queryRunner:async request=>{query=request.query;return ["O|188|900|30|4000|5000|2000|3000|250|25|700|0|600|300|1200|EXECUTION_ANALYSIS_CURRENT"];}});
  assert.equal(summary.mechanicCount,5000); assert.equal(summary.responsibilityLinkedMechanicCount,250); assert.equal(summary.executionAnalysisDisposition,"EXECUTION_ANALYSIS_CURRENT"); assert.match(query,/CurrentOperationalExecutionSummary/u); assert.doesNotMatch(query,/RepositoryArtifact|ExecutableMechanic/u);
});

test("queries bounded current mechanic candidates for deterministic lowering",async()=>{
  let query;
  const candidate={mechanicOccurrenceId:"m1",mechanicKind:"branch",artifactId:"src/cli.js",artifactDigest:"sha256:file",executionAnalysisDigest:"sha256:analysis",startLine:10,startColumn:3,authorityFamily:"decision-authority"};
  const rows=await queriesCurrentMechanicAuthorityCandidates({rootId:"root",mechanicKind:"branch",mechanicOccurrenceId:"m1",limit:5,connection,queryRunner:async request=>{query=request.query;return [`C|${JSON.stringify(candidate)}`];}});
  assert.deepEqual(rows,[candidate]);
  assert.match(query,/TOP \(5\)/u);
  assert.match(query,/CurrentExecutionMechanicOccurrence/u);
  assert.match(query,/AdmissionDisposition<>'AUTHORITY_ADMITTED'/u);
  assert.match(query,/MechanicOccurrenceId=N'm1'/u);
  assert.rejects(queriesCurrentMechanicAuthorityCandidates({rootId:"root",limit:0,connection}),/limit must be an integer/u);
});
