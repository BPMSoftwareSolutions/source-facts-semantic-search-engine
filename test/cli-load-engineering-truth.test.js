import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");

test("cli load-engineering-truth rejects report enterprise context drift before collecting authorities", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "source-facts-load-truth-"));
  try {
    const cases = [
      {
        fileName: "repository-mismatch.json",
        enterpriseContext: { repositoryId: "repo.other", workspaceId: "workspace.v1" },
        pattern: /report\.enterpriseContext\.repositoryId \(repo\.other\) must match report\.repository\.repositoryId \(repo\)\./u,
      },
      {
        fileName: "workspace-mismatch.json",
        enterpriseContext: { repositoryId: "repo", workspaceId: "workspace.other" },
        pattern: /report\.enterpriseContext\.workspaceId \(workspace\.other\) must match report\.repository\.workspaceId \(workspace\.v1\)\./u,
      },
    ];

    for (const { fileName, enterpriseContext, pattern } of cases) {
      const reportPath = path.join(tempDir, fileName);
      writeFileSync(reportPath, JSON.stringify({
        reportType: "source-facts-self-governance-report.v1",
        repository: { repositoryId: "repo", workspaceId: "workspace.v1" },
        enterpriseContext,
      }, null, 2), "utf8");

      const result = spawnSync(
        process.execPath,
        [cliPath, "load-engineering-truth", "--report", reportPath],
        {
          cwd: repoRoot,
          encoding: "utf8",
        },
      );

      assert.notEqual(result.status, 0, "CLI should fail fast on enterprise context drift");
      assert.match(result.stderr, pattern);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
