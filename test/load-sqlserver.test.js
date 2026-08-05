import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { loadsSourceFactIndexIntoSqlServer, sqlNvarcharMaxExpression } from "../src/sqlserver/load-sqlserver.js";
import { resolvesSqlAuthConnectionFromEnv } from "../src/sqlserver/resolves-sql-connection.js";
import { validatesLoadReceipt } from "../src/sqlserver/validates-load-receipt.js";

const connectionEnvVar = "source-facts-semantic-search-engine";
const hasConnection = typeof process.env[connectionEnvVar] === "string" && process.env[connectionEnvVar].trim().length > 0;
const skipReason = hasConnection ? false : `${connectionEnvVar} env var not set; skipping live SQL Server integration test.`;

test("bounds generated nvarchar tokens without corrupting quotes or surrogate pairs", () => {
  const value = `${"x".repeat(9)}'🚀${"y".repeat(9)}`;
  const expression = sqlNvarcharMaxExpression(value, 10);
  assert.match(expression, /^CAST\(N'/u);
  assert.match(expression, /''/u);
  assert.doesNotMatch(expression, /�/u);
  assert.ok(expression.split(/\r?\n/u).every((line) => line.length < 80));
});

test("loads a fresh index table-by-table, reports LOAD_ADMITTED, and is idempotent on repeat", { skip: skipReason }, async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "load-sqlserver-source-"));
  const connection = resolvesSqlAuthConnectionFromEnv(connectionEnvVar);
  const rootId = `sqlserver-test-${Date.now()}`;
  const indexIds = [];
  try {
    fs.writeFileSync(path.join(workspaceRoot, "body.mjs"), [
      "export function execute(request) {",
      "  if (request.valid) return JSON.stringify(request);",
      "  throw new Error('invalid');",
      "}",
      "",
    ].join("\n"), "utf8");
    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: rootId });
    indexIds.push(index.indexId);

    const steps = [];
    const firstReceipt = await loadsSourceFactIndexIntoSqlServer({ index, connection, onStep: (step) => steps.push(step) });
    await validatesLoadReceipt(firstReceipt);
    assert.equal(firstReceipt.disposition, "LOAD_ADMITTED");
    assert.equal(firstReceipt.alreadyLoaded, false);
    assert.equal(firstReceipt.counts.files, 1);
    assert.equal(firstReceipt.counts.bodyMechanics, index.bodyMechanics.length);
    assert.ok(steps.length >= 8, "expected at least 8 per-table progress steps");
    assert.ok(steps.every((step) => Number.isInteger(step.elapsedMs)));

    const secondReceipt = await loadsSourceFactIndexIntoSqlServer({ index, connection });
    assert.equal(secondReceipt.disposition, "LOAD_ALREADY_ADMITTED");
    assert.equal(secondReceipt.alreadyLoaded, true);
    assert.deepEqual(secondReceipt.counts, firstReceipt.counts);

    fs.appendFileSync(path.join(workspaceRoot, "body.mjs"), "// replacement scan\n", "utf8");
    const replacement = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: rootId });
    indexIds.push(replacement.indexId);
    assert.notEqual(replacement.indexId, index.indexId);
    const replacementReceipt = await loadsSourceFactIndexIntoSqlServer({ index: replacement, connection });
    assert.equal(replacementReceipt.disposition, "LOAD_ADMITTED");
    assert.equal(replacementReceipt.alreadyLoaded, false);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    if (indexIds.length > 0) await deletesLoadedRoot(connection, rootId, indexIds);
  }
});

async function deletesLoadedRoot(connection, rootId, indexIds) {
  const { spawn } = await import("node:child_process");
  const { mkdtemp, rm, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = (await import("node:path")).default;
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-sqlcleanup-"));
  const scriptPath = path.join(workDirectory, "cleanup.sql");
  const rootLiteral = `'${rootId.replace(/'/g, "''")}'`;
  const indexList = indexIds.map((indexId) => `'${indexId.replace(/'/g, "''")}'`).join(", ");
  const script = `SET NOCOUNT ON;
SET ANSI_NULLS ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET ARITHABORT ON; SET CONCAT_NULL_YIELDS_NULL ON; SET QUOTED_IDENTIFIER ON; SET NUMERIC_ROUNDABORT OFF;
DECLARE @CurrentIndexId varchar(120) = (SELECT IndexId FROM inventory.Scan WHERE RootId = ${rootLiteral});
IF OBJECT_ID('authority.MechanicCanonicalLineage', 'U') IS NOT NULL
    EXEC sp_executesql N'DELETE FROM authority.MechanicCanonicalLineage WHERE IndexId = @IndexId;', N'@IndexId varchar(120)', @IndexId = @CurrentIndexId;
DELETE FROM fact.GovernanceRule WHERE IndexId = @CurrentIndexId;
DELETE FROM fact.Document WHERE IndexId = @CurrentIndexId;
DELETE FROM fact.ExecutableMechanic WHERE IndexId = @CurrentIndexId;
DELETE FROM fact.DataFlow WHERE IndexId = @CurrentIndexId;
DELETE FROM fact.Relationship WHERE IndexId = @CurrentIndexId;
DELETE FROM source.Symbol WHERE IndexId = @CurrentIndexId;
DELETE FROM source.SourceReference WHERE IndexId = @CurrentIndexId;
DELETE FROM inventory.SourceFile WHERE IndexId = @CurrentIndexId;
DELETE FROM inventory.Scan WHERE IndexId = @CurrentIndexId;
DELETE FROM inventory.SourceRoot WHERE RootId = ${rootLiteral};
DELETE FROM ingestion.Receipt WHERE IndexId IN (${indexList});
`;
  try {
    await writeFile(scriptPath, script, "utf8");
    await new Promise((resolve, reject) => {
      const args = [...connection.buildsArgs(), "-i", scriptPath, "-b"];
      const env = connection.appliesToChildEnv({ ...process.env });
      const child = spawn("sqlcmd", args, { windowsHide: true, env });
      child.on("error", reject);
      child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`cleanup sqlcmd exited with code ${code}`))));
    });
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}
