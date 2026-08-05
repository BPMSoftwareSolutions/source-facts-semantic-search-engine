import assert from "node:assert/strict";
import { test } from "node:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");
const connectionEnvVar = "source-facts-semantic-search-engine";
const hasConnection = typeof process.env[connectionEnvVar] === "string" && process.env[connectionEnvVar].trim().length > 0;
const skipReason = hasConnection ? false : `${connectionEnvVar} env var not set; skipping live SQL Server integration test.`;

function buildsMinimalIndex(workspaceRoot) {
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "sync-self-governance-test", workspaceRoot } },
    workspace: { workspaceId: "sync-self-governance-test" },
    symbols: [],
    relationships: [],
    dataflows: [],
    sourceReferences: [],
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
  };
}

test("cli sync-self-governance generates the report and syncs canonical authorities into SQL Server", { skip: skipReason }, async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-sync-governance-"));
  try {
    const workspaceDir = path.join(tempDir, "workspace");
    const authorityDir = path.join(tempDir, "authority");
    const reviewsDir = path.join(tempDir, "reviews");
    const knowHowDir = path.join(tempDir, "know-how");
    const healingDir = path.join(tempDir, "healing");
    const testWorkspaceDir = path.join(tempDir, "tests");
    const contractMapRoot = path.join(tempDir, "contract-map");
    await mkdir(workspaceDir, { recursive: true });
    await mkdir(authorityDir, { recursive: true });
    await mkdir(reviewsDir, { recursive: true });
    await mkdir(knowHowDir, { recursive: true });
    await mkdir(healingDir, { recursive: true });
    await mkdir(testWorkspaceDir, { recursive: true });
    await mkdir(contractMapRoot, { recursive: true });

    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "source-facts-self-governance-report.json");
    const reportPath = outputPath;
    const summaryPath = outputPath.replace(/\.json$/i, ".md");
    await writeFile(indexPath, JSON.stringify(buildsMinimalIndex(workspaceDir)), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "sync-self-governance",
        "--index",
        indexPath,
        "--authority-dir",
        authorityDir,
        "--reviews-dir",
        reviewsDir,
        "--know-how-dir",
        knowHowDir,
        "--healing-dir",
        healingDir,
        "--contract-map-root",
        contractMapRoot,
        "--test-workspace",
        testWorkspaceDir,
        "--output",
        outputPath,
        "--repository-id",
        "sync-self-governance-test",
        "--connection-env",
        connectionEnvVar,
        "--summary",
      ],
      {
        cwd: repoRoot,
        encoding: "utf8",
      },
    );

    assert.equal(
      result.status,
      0,
      `CLI failed with status ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
    );

    assert.ok(result.stdout.includes(reportPath), "CLI should print the report output path");
    assert.ok(result.stdout.includes(summaryPath), "CLI should print the report summary path");
    const loadDispositions = result.stdout.split(/\r?\n/u).filter((line) => line.startsWith("ENGINEERING_TRUTH_"));
    assert.equal(loadDispositions.length, 2, `Expected two SQL load dispositions, saw: ${loadDispositions.join(", ")}`);
    assert.ok(loadDispositions.every((line) => ["ENGINEERING_TRUTH_LOADED", "ENGINEERING_TRUTH_ALREADY_LOADED"].includes(line)));

    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    const summary = await readFile(summaryPath, "utf8");
    assert.equal(report.reportType, "source-facts-self-governance-report.v1");
    assert.equal(report.queryLineage.catalog.catalogId, "self-governance-query-catalog.v1");
    assert.ok(summary.length > 0);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
