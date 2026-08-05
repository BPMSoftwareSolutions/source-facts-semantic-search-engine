import assert from "node:assert/strict";
import test from "node:test";
import { loadsRepositoryTestKnowledgeIntoSqlServer, queriesCurrentRepositoryTestClosure, queriesCurrentTestMeaningCoverage } from "../src/sqlserver/repository-test-knowledge.js";

const connection = { buildsArgs: () => [], appliesToChildEnv: (env) => env };
const analysis = { analysisType: "repository-test-knowledge.v2", rootId: "root", applicationId: "app", imageDigest: "sha256:image", contractSnapshotId: "sha256:contract", artifacts: [], suites: [], testCases: [], assertions: [], fixtureUsages: [], mockUsages: [], invocations: [], candidates: [], meaningClassifications: [], summary: { testArtifacts: 0, testCases: 0, suites: 0, assertions: 0, fixtureUsages: 0, mockUsages: 0, invocations: 0, candidateTests: 0, unboundTests: 0, meaningRecommendations: 0, unresolvedMeanings: 0 } };
analysis.analysisDigest = `sha256:${(await import("node:crypto")).createHash("sha256").update(JSON.stringify(analysis)).digest("hex")}`;

test("loads current test observations and seals their SQL lineage", async () => {
  let query;
  const receipt = await loadsRepositoryTestKnowledgeIntoSqlServer({ analysis, connection, queryRunner: async (request) => { query=request.query; return [`R|${analysis.analysisDigest}|0|0|0|0|0|0|0|TEST_KNOWLEDGE_ADMITTED_AS_OBSERVATION`, "S|sha256:test-seal|TEST_CLOSURE_SEALED_IN_SQL"]; } });
  assert.equal(receipt.testClosureSealDigest, "sha256:test-seal");
  assert.match(query, /LoadRepositoryTestKnowledge/u); assert.match(query, /RefreshRepositoryTestClosureSeal/u);
});

test("queries bounded current test-meaning coverage without reading repository bytes", async () => {
  let query;
  const coverage = await queriesCurrentTestMeaningCoverage({ rootId: "root", connection, queryRunner: async (request) => { query=request.query; return ["M|232|232|0|7|181|0|1|1|7|1|1|TEST_MEANING_REVIEW_INCOMPLETE"]; } });
  assert.equal(coverage.meaningRecommendationCount, 232);
  assert.equal(coverage.testMeaningCoverageDisposition, "TEST_MEANING_REVIEW_INCOMPLETE");
  assert.match(query, /projection\.CurrentTestMeaningCoverage/u);
  assert.doesNotMatch(query, /inventory\.RepositoryArtifact|SourceFile/u);
});

test("queries only the bounded current repository test closure", async () => {
  let query;
  const closure = await queriesCurrentRepositoryTestClosure({ rootId: "root", connection, queryRunner: async (request) => { query=request.query; return ["C|54|225|900|12|213|1|0|REPOSITORY_SCENARIO_PROOF_INCOMPLETE|sha256:repo|sha256:analysis|sha256:test-seal"]; } });
  assert.equal(closure.testCaseCount, 225); assert.equal(closure.repositoryTestDisposition, "REPOSITORY_SCENARIO_PROOF_INCOMPLETE");
  assert.match(query, /projection\.CurrentRepositoryTestClosure/u); assert.doesNotMatch(query, /testobservation\.TestCase|RepositoryArtifact/u);
});
