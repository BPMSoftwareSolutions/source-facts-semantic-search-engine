import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");
const governanceEngineRoot = path.resolve(repoRoot, "..", "contract-driven-artifact-governance-engine");
const schemaPath = path.join(governanceEngineRoot, "schemas", "governed-artifact-contract.schema.json");
const mechanicAuthoritySchemaPath = path.join(governanceEngineRoot, "schemas", "executable-mechanic-authority.schema.json");
const expectedSourceArtifactPaths = [
  "src/console/console-authority-bundles.mjs",
  "src/console/console-routing-adapter.mjs",
  "src/console/console-validation-adapter.mjs",
  "src/console/console-snippet-adapter.mjs",
  "src/console/serves-query-console.mjs",
  "src/console/serves-query-console.conformant.mjs",
  "src/console/serves-query-console.projected.mjs",
];
const expectedBundleArtifactPaths = [
  "src/console/contracts/console-request-routing.bundle.json",
  "src/console/contracts/console-snippet-retrieval.bundle.json",
];
const expectedArtifactPaths = [
  "src/console/console-authority-bundles.mjs",
  "src/console/console-routing-adapter.mjs",
  "src/console/console-validation-adapter.mjs",
  "src/console/contracts/console-request-routing.bundle.json",
  "src/console/contracts/console-snippet-retrieval.bundle.json",
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
  assert.ok(result.stdout.includes("Artifact count: 9"), "CLI should report the projected artifact count");

  const contract = JSON.parse(readFileSync(outputPath, "utf8"));
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const mechanicAuthoritySchema = JSON.parse(readFileSync(mechanicAuthoritySchemaPath, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictTypes: false });
  ajv.addSchema(mechanicAuthoritySchema);
  const validate = ajv.compile(schema);

  assert.ok(validate(contract), `Contract schema validation failed: ${ajv.errorsText(validate.errors)}`);
  assert.equal(contract.interpretationBase.engine.identity, "governed-artifact-engine.0.22.0");
  assert.equal(contract.contract.contractId, "serves-query-console-governed-contract");
  assert.equal(contract.contract.status, "admitted");
  assert.equal(contract.artifacts.length, expectedArtifactPaths.length);

  const sourceArtifacts = contract.artifacts.filter((artifact) => expectedSourceArtifactPaths.includes(artifact.relativePath));
  const bundleArtifacts = contract.artifacts.filter((artifact) => expectedBundleArtifactPaths.includes(artifact.relativePath));
  assert.equal(sourceArtifacts.length, expectedSourceArtifactPaths.length);
  assert.equal(bundleArtifacts.length, expectedBundleArtifactPaths.length);

  assert.ok(
    sourceArtifacts.every((artifact) => artifact.projection.projectorId === "provenance-sealed-source-projector.v1"),
    "console source artifacts should be projected as provenance-sealed source",
  );
  assert.ok(
    sourceArtifacts.every((artifact) => artifact.projection.authority.authorityType === "lossless-source-tokens.v1"),
    "console source artifacts should carry lossless source-token authority",
  );
  assert.ok(
    sourceArtifacts.every(
      (artifact) =>
        artifact.proof.verifierIds.includes("artifact-provenance-verifier.v1")
        && artifact.proof.verifierIds.includes("authority-closure-verifier.v1")
        && artifact.proof.verifierIds.includes("content-digest-verifier.v1")
        && artifact.proof.verifierIds.includes("source-token-structure-verifier.v1"),
    ),
    "console source artifacts should use the source proof verifier set",
  );
  assert.ok(
    sourceArtifacts.every(
      (artifact) => Array.isArray(artifact.projection.authority.tokens) && artifact.projection.authority.tokens.length > 0,
    ),
    "console source artifacts should include lossless source tokens",
  );

  assert.ok(
    bundleArtifacts.every((artifact) => artifact.projection.projectorId === "canonical-json-value-projector.v1"),
    "console bundle artifacts should be projected as canonical JSON values",
  );
  assert.ok(
    bundleArtifacts.every((artifact) => artifact.projection.authority.authorityType === "canonical-json-value.v1"),
    "console bundle artifacts should carry canonical-json-value authority",
  );
  assert.ok(
    bundleArtifacts.every((artifact) => artifact.proof.verifierIds.includes("content-digest-verifier.v1")),
    "console bundle artifacts should use the content-digest verifier",
  );

  assert.deepEqual(
    contract.artifacts.map((artifact) => artifact.relativePath),
    expectedArtifactPaths,
    "projected artifact paths should match the console module family",
  );
  assert.equal(contract.subject.subjectId, "serves-query-console");
  assert.equal(contract.subject.authority.consoleWorkspaceRoot, "src/console");
  assert.ok(
    contract.lineage.responsibilities.every(
      (responsibility) => responsibility.projectionProfileId === "javascript-semantic-execution-body.v1",
    ),
    "lineage should describe the javascript-semantic-execution-body projection profile",
  );
  assert.ok(
    /^sha256:[a-f0-9]{64}$/.test(contract.designAuthority.conversationDigest),
    "designAuthority.conversationDigest must be a sha256 hash",
  );
  assert.ok(
    contract.lineage.features.some((feature) => feature.featureId === "project-console-contract"),
    "lineage should include the console contract projection feature",
  );
});
