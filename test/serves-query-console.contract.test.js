import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import Ajv from "ajv";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");
const schemaPath = "C:/lab/repos/contract-driven-artifact-governance-engine/schemas/governed-artifact-contract.schema.json";
const expectedArtifactPaths = [
  "src/console/console-authority-bundles.mjs",
  "src/console/console-routing-adapter.mjs",
  "src/console/console-validation-adapter.mjs",
  "src/console/console-snippet-adapter.mjs",
  "src/console/serves-query-console.mjs",
  "src/console/serves-query-console.conformant.mjs",
  "src/console/serves-query-console.projected.mjs",
];

test("project-console-contract writes a governed console contract draft", () => {
  const outputDirectory = mkdtempSync(path.join(os.tmpdir(), "source-facts-console-contract-"));
  const outputPath = path.join(outputDirectory, "serves-query-console.governed.contract.json");

  const result = spawnSync(
    process.execPath,
    [
      cliPath,
      "project-console-contract",
      "--output",
      outputPath,
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
  assert.ok(result.stdout.includes(outputPath), "CLI should print the governed contract path");
  assert.ok(result.stdout.includes("Artifact count: 7"), "CLI should report the projected artifact count");

  const contract = JSON.parse(readFileSync(outputPath, "utf8"));
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv({ allErrors: true });
  ajv.addMetaSchema({ $id: "https://json-schema.org/draft/2020-12/schema" });
  const validate = ajv.compile(schema);

  assert.ok(validate(contract), `Contract schema validation failed: ${ajv.errorsText(validate.errors)}`);
  assert.equal(contract.contract.contractId, "serves-query-console-governed-contract");
  assert.equal(contract.contract.status, "admitted");
  assert.equal(contract.artifacts.length, expectedArtifactPaths.length);
  assert.deepEqual(
    contract.artifacts.map((artifact) => artifact.relativePath),
    expectedArtifactPaths,
    "projected artifact paths should match the console module family",
  );
  assert.equal(contract.subject.subjectId, "serves-query-console");
  assert.equal(contract.subject.authority.consoleWorkspaceRoot, "src/console");
  assert.ok(
    /^sha256:[a-f0-9]{64}$/.test(contract.designAuthority.conversationDigest),
    "designAuthority.conversationDigest must be a sha256 hash",
  );
  assert.ok(
    contract.lineage.features.some((feature) => feature.featureId === "project-console-contract"),
    "lineage should include the console contract projection feature",
  );
});
