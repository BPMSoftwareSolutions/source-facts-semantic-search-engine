import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");
const consoleWorkspaceRoot = path.join(repoRoot, "src", "console");
const authorityFile = path.join(repoRoot, "contracts", "serves-query-console.authority.json");

test("cli project-authority-violations writes candidate and draft authority artifacts", async () => {
  const outputDirectory = mkdtempSync(path.join(os.tmpdir(), "source-facts-cli-"));
  const candidateOutput = path.join(outputDirectory, "serves-query-console.candidates.json");
  const authorityOutput = path.join(outputDirectory, "serves-query-console.authority.draft.json");

  const result = spawnSync(
    process.execPath,
    [
      cliPath,
      "project-authority-violations",
      "--workspace",
      consoleWorkspaceRoot,
      "--authority-file",
      authorityFile,
      "--output",
      candidateOutput,
      "--authority-output",
      authorityOutput,
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

  assert.ok(result.stdout.includes(candidateOutput), "CLI should print the candidate output path");
  assert.ok(result.stdout.includes(authorityOutput), "CLI should print the authority draft path");

  const candidateJson = JSON.parse(readFileSync(candidateOutput, "utf8"));
  const authorityJson = JSON.parse(readFileSync(authorityOutput, "utf8"));

  assert.ok(candidateJson.authorityDraft, "candidate artifact should embed an authority draft");
  assert.ok(candidateJson.bindingSuggestions, "candidate artifact should include binding suggestions");
  assert.ok(authorityJson.authority, "authority draft artifact should include authority data");
  assert.equal(
    candidateJson.candidates.length,
    candidateJson.authorityDraft.authority.mechanics.length,
    "candidate projection should mirror authority draft mechanics",
  );
  assert.equal(
    authorityJson.authority.mechanics.length,
    candidateJson.candidates.length,
    "separate authority draft file should match candidate count",
  );
});
