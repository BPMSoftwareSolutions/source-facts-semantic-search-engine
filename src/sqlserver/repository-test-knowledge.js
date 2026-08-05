import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { verifiesRepositoryTestKnowledge } from "../repository-test-knowledge.js";

export async function loadsRepositoryTestKnowledgeIntoSqlServer({ analysis, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection); verifiesRepositoryTestKnowledge(analysis);
  const query = `SET NOCOUNT ON;\nDECLARE @PayloadJson nvarchar(max) = ${sqlStringLiteral(JSON.stringify(analysis))};\nEXEC ingestion.LoadRepositoryTestKnowledge @PayloadJson=@PayloadJson;\nEXEC projection.RefreshRepositoryTestClosureSeal @RootId=${sqlStringLiteral(analysis.rootId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("R|"));
  if (!result) throw new Error("SQL Server returned no repository test knowledge result.");
  const [, analysisDigest, testArtifactCount, testCaseCount, assertionCount, candidateTestCount, unboundTestCount, disposition] = result.split("|");
  if (analysisDigest !== analysis.analysisDigest) throw new Error("SQL Server test analysis identity does not match the requested analysis.");
  const sealResult = lines.find((line) => line.startsWith("S|"));
  if (!sealResult) throw new Error("SQL Server returned no repository test closure seal result.");
  const [, testClosureSealDigest] = sealResult.split("|");
  return Object.freeze({ rootId: analysis.rootId, analysisDigest, testClosureSealDigest, testArtifactCount: Number(testArtifactCount), testCaseCount: Number(testCaseCount), assertionCount: Number(assertionCount), candidateTestCount: Number(candidateTestCount), unboundTestCount: Number(unboundTestCount), disposition });
}

export async function queriesCurrentRepositoryTestClosure({ rootId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  const query = `SET NOCOUNT ON;
SELECT CONCAT('C|',COALESCE(TestArtifactCount,0),'|',COALESCE(TestCaseCount,0),'|',COALESCE(AssertionCount,0),'|',COALESCE(CandidateTestCount,0),'|',COALESCE(UnboundTestCount,0),'|',COALESCE(AdmittedScenarioCount,0),'|',COALESCE(ClosedScenarioCount,0),'|',RepositoryTestDisposition,'|',CurrentRepositorySealDigest,'|',COALESCE(TestAnalysisDigest,''),'|',COALESCE(TestClosureSealDigest,''))
FROM projection.CurrentRepositoryTestClosure WHERE RootId=${sqlStringLiteral(rootId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("C|"));
  if (!result) return Object.freeze({ rootId, disposition: "REPOSITORY_TEST_CLOSURE_MISSING" });
  const [, testArtifactCount, testCaseCount, assertionCount, candidateTestCount, unboundTestCount, admittedScenarioCount, closedScenarioCount, repositoryTestDisposition, currentRepositorySealDigest, testAnalysisDigest, testClosureSealDigest] = result.split("|");
  return Object.freeze({ rootId, testArtifactCount: Number(testArtifactCount), testCaseCount: Number(testCaseCount), assertionCount: Number(assertionCount), candidateTestCount: Number(candidateTestCount), unboundTestCount: Number(unboundTestCount), admittedScenarioCount: Number(admittedScenarioCount), closedScenarioCount: Number(closedScenarioCount), repositoryTestDisposition, currentRepositorySealDigest, testAnalysisDigest, testClosureSealDigest, disposition: "REPOSITORY_TEST_CLOSURE_QUERIED" });
}

function verifiesConnection(connection) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") throw new Error("connection is required (see resolves-sql-connection.js).");
}
async function runsSqlcmdQuery({ connection, sqlcmdPath, query }) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-test-knowledge-")); const scriptPath = path.join(workDirectory, "query.sql");
  try {
    await writeFile(scriptPath, query, "utf8");
    return await new Promise((resolve, reject) => {
      const child = spawn(sqlcmdPath, [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", "8000", "-y", "8000", "-b"], { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
      let stdout=""; let stderr=""; child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.on("error", reject);
      child.on("close", (code) => code===0 ? resolve(stdout.split(/\r?\n/u).map((line) => line.trimEnd()).filter(Boolean)) : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`)));
    });
  } finally { await rm(workDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 }); }
}
function sqlStringLiteral(value) { return `N'${String(value).replaceAll("'", "''")}'`; }
