import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { projectsExecutionMechanicAuthorityData } from "../src/governance/projects-execution-mechanic-authority-data.js";
import { resolvesSqlAuthConnectionFromEnv } from "../src/sqlserver/resolves-sql-connection.js";

const connectionEnvVar = "source-facts-semantic-search-engine";
const hasConnection = typeof process.env[connectionEnvVar] === "string" && process.env[connectionEnvVar].trim().length > 0;
const skipReason = hasConnection ? false : `${connectionEnvVar} env var not set; skipping live SQL/JavaScript parity proof.`;

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}

function digest(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalizes(value))).digest("hex")}`;
}

test("SQL and JavaScript candidate projection produce identical canonical row digests", { skip: skipReason }, (t) => {
  const connection = resolvesSqlAuthConnectionFromEnv(connectionEnvVar);
  const childEnvironment = connection.appliesToChildEnv({ ...process.env });
  const preflight = spawnSync("sqlcmd", [...connection.buildsArgs(), "-Q", "SET NOCOUNT ON; SELECT CASE WHEN COL_LENGTH('fact.ExecutableMechanic', 'RootId') IS NOT NULL THEN 'CURRENT' ELSE 'STALE' END", "-h", "-1", "-W", "-b"], {
    encoding: "utf8",
    windowsHide: true,
    env: childEnvironment,
  });
  assert.equal(preflight.status, 0, preflight.stderr || preflight.stdout);
  if (preflight.stdout.trim() !== "CURRENT") {
    t.skip("configured SQL Server uses a historical source-fact schema; a fresh current-schema database is required for parity proof");
    return;
  }
  const install = spawnSync("sqlcmd", [...connection.buildsArgs(), "-i", path.resolve("scripts/sql/010-create-mechanic-authority-query.sql"), "-b"], {
    encoding: "utf8",
    windowsHide: true,
    env: childEnvironment,
  });
  assert.equal(install.status, 0, install.stderr || install.stdout);
  const workDirectory = mkdtempSync(path.join(os.tmpdir(), "mechanic-authority-parity-"));
  const queryPath = path.join(workDirectory, "query.sql");
  writeFileSync(queryPath, `SET NOCOUNT ON;
IF OBJECT_ID('projection.ExecutionMechanicAuthority', 'V') IS NULL
    THROW 51000, 'projection.ExecutionMechanicAuthority is not installed.', 1;
SELECT TOP (100)
       (SELECT candidate.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES) AS CandidateJson
FROM projection.ExecutionMechanicAuthority AS candidate
WHERE candidate.ProjectionDisposition <> 'SOURCE_EVIDENCE_INCOMPLETE'
ORDER BY candidate.SourceOrderKey;
`, "utf8");
  try {
    const result = spawnSync("sqlcmd", [...connection.buildsArgs(), "-i", queryPath, "-h", "-1", "-w", "8000", "-y", "8000", "-b"], {
      encoding: "utf8",
      windowsHide: true,
      env: childEnvironment,
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const sqlRows = result.stdout.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
    assert.ok(sqlRows.length > 0, "the live parity corpus must contain at least one candidate row");
    for (const sqlRow of sqlRows) {
      const occurrence = {
        mechanicId: sqlRow.MechanicOccurrenceId,
        mechanic: sqlRow.MechanicKind,
        rootId: sqlRow.RootId,
        sourceReferenceId: sqlRow.SourceReferenceId,
        sourceStartOffset: sqlRow.SourceStartOffset,
      };
      const context = {
        applicationId: sqlRow.ApplicationId,
        featureId: sqlRow.FeatureId,
        scenarioId: sqlRow.ScenarioId,
        obligationId: sqlRow.ObligationId,
        responsibilityId: sqlRow.ResponsibilityId,
        sourceFactIndexId: sqlRow.SourceFactIndexId,
        sourceOrderKey: sqlRow.SourceOrderKey,
        observedOrdinal: sqlRow.ObservedOrdinal,
        occurrenceApplicabilityDisposition: sqlRow.OccurrenceApplicabilityDisposition,
        lineageCandidateCount: sqlRow.ProjectionDisposition === "LINEAGE_CONTEXT_AMBIGUOUS" ? 2 : 1,
      };
      const javascriptRow = projectsExecutionMechanicAuthorityData(occurrence, context);
      assert.equal(digest(javascriptRow), digest(sqlRow), JSON.stringify({ sqlRow, javascriptRow }));
    }
  } finally {
    rmSync(workDirectory, { recursive: true, force: true });
  }
});
