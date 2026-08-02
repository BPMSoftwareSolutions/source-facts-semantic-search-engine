import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { loadsSourceFactIndexIntoSqlServer } from "../src/sqlserver/load-sqlserver.js";
import { resolvesSqlAuthConnectionFromEnv } from "../src/sqlserver/resolves-sql-connection.js";
import { validatesLoadReceipt } from "../src/sqlserver/validates-load-receipt.js";

const connectionEnvVar = "source-facts-semantic-search-engine";
const hasConnection = typeof process.env[connectionEnvVar] === "string" && process.env[connectionEnvVar].trim().length > 0;
const skipReason = hasConnection ? false : `${connectionEnvVar} env var not set; skipping live SQL Server integration test.`;

test("loads a fresh index table-by-table, reports LOAD_ADMITTED, and is idempotent on repeat", { skip: skipReason }, async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "load-sqlserver-source-"));
  const connection = resolvesSqlAuthConnectionFromEnv(connectionEnvVar);
  let indexId;
  try {
    fs.writeFileSync(path.join(workspaceRoot, "body.mjs"), [
      "export function execute(request) {",
      "  if (request.valid) return JSON.stringify(request);",
      "  throw new Error('invalid');",
      "}",
      "",
    ].join("\n"), "utf8");
    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: `sqlserver-test-${Date.now()}` });
    indexId = index.indexId;

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
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
    if (indexId !== undefined) await deletesLoadedIndex(connection, indexId);
  }
});

async function deletesLoadedIndex(connection, indexId) {
  const { spawn } = await import("node:child_process");
  const { mkdtemp, rm, writeFile } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = (await import("node:path")).default;
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-sqlcleanup-"));
  const scriptPath = path.join(workDirectory, "cleanup.sql");
  const literal = `'${indexId.replace(/'/g, "''")}'`;
  const script = `SET NOCOUNT ON;
SET ANSI_NULLS ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET ARITHABORT ON; SET CONCAT_NULL_YIELDS_NULL ON; SET QUOTED_IDENTIFIER ON; SET NUMERIC_ROUNDABORT OFF;
DELETE FROM fact.GovernanceRule WHERE IndexId = ${literal};
DELETE FROM fact.Document WHERE IndexId = ${literal};
DELETE FROM fact.ExecutableMechanic WHERE IndexId = ${literal};
DELETE FROM fact.DataFlow WHERE IndexId = ${literal};
DELETE FROM fact.Relationship WHERE IndexId = ${literal};
DELETE FROM source.Symbol WHERE IndexId = ${literal};
DELETE FROM source.SourceReference WHERE IndexId = ${literal};
DELETE FROM inventory.SourceFile WHERE IndexId = ${literal};
DELETE FROM ingestion.Receipt WHERE IndexId = ${literal};
DELETE FROM inventory.Scan WHERE IndexId = ${literal};
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
