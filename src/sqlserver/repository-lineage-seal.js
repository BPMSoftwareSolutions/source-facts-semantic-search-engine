import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export async function refreshesRepositoryLineageSealInSqlServer({ rootId, applicationId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesInputs({ rootId, connection });
  if (typeof applicationId !== "string" || applicationId.trim().length === 0) throw new Error("applicationId is required.");
  const query = `SET NOCOUNT ON;\nEXEC projection.RefreshRepositoryLineageSeal @RootId = ${sqlStringLiteral(rootId)}, @ApplicationId = ${sqlStringLiteral(applicationId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("R|"));
  if (!result) throw new Error("SQL Server returned no repository lineage seal result.");
  const [, sealDigest, governanceDisposition, featureCount, closedFeatureCount, scenarioCount, responsibilityCount, semanticFactCount, analyzerFailureCount, contractSnapshotId] = result.split("|");
  return Object.freeze({
    rootId, applicationId, sealDigest, governanceDisposition, contractSnapshotId,
    featureCount: Number(featureCount), closedFeatureCount: Number(closedFeatureCount),
    scenarioCount: Number(scenarioCount), responsibilityCount: Number(responsibilityCount),
    semanticFactCount: Number(semanticFactCount), analyzerFailureCount: Number(analyzerFailureCount),
    signingDisposition: "DIGEST_SEALED_NOT_SIGNED", disposition: "REPOSITORY_LINEAGE_SEALED_IN_SQL",
  });
}

export async function validatesRepositoryLineageSealInSqlServer({ rootId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesInputs({ rootId, connection });
  const query = `SET NOCOUNT ON;
SELECT CONCAT('V|', SealDigest, '|', SealIntegrityDisposition, '|', GovernanceDisposition, '|', SigningDisposition,
              '|', FeatureCount, '|', ClosedFeatureCount, '|', ScenarioCount, '|', ResponsibilityCount,
              '|', SemanticFactCount, '|', AnalyzerFailureCount, '|', CanonicalIntentContractSnapshotId)
FROM projection.CurrentRepositoryGovernanceClosure WHERE RootId = ${sqlStringLiteral(rootId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("V|"));
  if (!result) return Object.freeze({ rootId, sealIntegrityDisposition: "LINEAGE_SEAL_MISSING", disposition: "REPOSITORY_LINEAGE_SEAL_INVALID" });
  const [, sealDigest, sealIntegrityDisposition, governanceDisposition, signingDisposition, featureCount, closedFeatureCount, scenarioCount, responsibilityCount, semanticFactCount, analyzerFailureCount, contractSnapshotId] = result.split("|");
  return Object.freeze({
    rootId, sealDigest, sealIntegrityDisposition, governanceDisposition, signingDisposition, contractSnapshotId,
    featureCount: Number(featureCount), closedFeatureCount: Number(closedFeatureCount), scenarioCount: Number(scenarioCount),
    responsibilityCount: Number(responsibilityCount), semanticFactCount: Number(semanticFactCount), analyzerFailureCount: Number(analyzerFailureCount),
    disposition: sealIntegrityDisposition === "LINEAGE_SEAL_VALID" ? "REPOSITORY_LINEAGE_SEAL_VALID" : "REPOSITORY_LINEAGE_SEAL_INVALID",
  });
}

function verifiesInputs({ rootId, connection }) {
  if (typeof rootId !== "string" || rootId.trim().length === 0) throw new Error("rootId is required.");
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") throw new Error("connection is required (see resolves-sql-connection.js).");
}

async function runsSqlcmdQuery({ connection, sqlcmdPath, query }) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-lineage-seal-"));
  const scriptPath = path.join(workDirectory, "query.sql");
  try {
    await writeFile(scriptPath, query, "utf8");
    return await new Promise((resolve, reject) => {
      const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", "8000", "-y", "8000", "-b"];
      const child = spawn(sqlcmdPath, args, { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
      let stdout = ""; let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("error", reject);
      child.on("close", (code) => code === 0
        ? resolve(stdout.split(/\r?\n/u).map((line) => line.trimEnd()).filter(Boolean))
        : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`)));
    });
  } finally {
    await rm(workDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
}

function sqlStringLiteral(value) { return `N'${String(value).replaceAll("'", "''")}'`; }
