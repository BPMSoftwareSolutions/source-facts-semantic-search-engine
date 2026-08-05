import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { verifiesRepositorySemanticAnalysis } from "../repository-semantics.js";

export async function loadsRepositorySemanticAnalysisIntoSqlServer({ analysis, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") {
    throw new Error("connection is required (see resolves-sql-connection.js).");
  }
  verifiesRepositorySemanticAnalysis(analysis);
  const query = `SET NOCOUNT ON;
DECLARE @PayloadJson nvarchar(max) = ${sqlStringLiteral(JSON.stringify(analysis))};
EXEC ingestion.LoadRepositorySemanticAnalysis @PayloadJson = @PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("R|"));
  if (!result) throw new Error("SQL Server returned no repository semantic analysis load result.");
  const [, analysisDigest, artifactCount, semanticFactCount, disposition] = result.split("|");
  if (analysisDigest !== analysis.analysisDigest) throw new Error("SQL Server semantic analysis identity does not match the requested analysis.");
  return Object.freeze({
    rootId: analysis.rootId,
    imageDigest: analysis.imageDigest,
    analysisDigest,
    artifactCount: Number(artifactCount),
    semanticFactCount: Number(semanticFactCount),
    disposition,
  });
}

async function runsSqlcmdQuery({ connection, sqlcmdPath, query }) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-repository-semantics-"));
  const scriptPath = path.join(workDirectory, "load.sql");
  try {
    await writeFile(scriptPath, query, "utf8");
    return await new Promise((resolve, reject) => {
      const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", "8000", "-y", "8000", "-b"];
      const child = spawn(sqlcmdPath, args, { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("error", reject);
      child.on("close", (code) => code === 0
        ? resolve(stdout.split(/\r?\n/u).map((line) => line.trimEnd()).filter((line) => line.length > 0))
        : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`)));
    });
  } finally {
    await rm(workDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
}

function sqlStringLiteral(value) {
  return `N'${String(value).replace(/'/g, "''")}'`;
}
