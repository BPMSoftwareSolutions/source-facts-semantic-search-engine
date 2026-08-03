import { test } from "node:test";
import * as assert from "node:assert";
import { readFileSync } from "node:fs";
import Ajv from "ajv";

/**
 * Test: serves-query-console.contract.json conforms to governed-artifact-contract.schema.json
 *
 * This test ensures the contract we create for serves-query-console matches
 * the exact schema required by the governed-artifacts engine.
 */

const contractPath = "./contracts/serves-query-console.contract.json";
const schemaPath = "C:/lab/repos/contract-driven-artifact-governance-engine/schemas/governed-artifact-contract.schema.json";

let contract;
let schema;

try {
  const contractData = readFileSync(contractPath, "utf8");
  contract = JSON.parse(contractData);
} catch (error) {
  console.error(`❌ Cannot read contract: ${contractPath}`);
  console.error(error.message);
  process.exit(1);
}

try {
  const schemaData = readFileSync(schemaPath, "utf8");
  schema = JSON.parse(schemaData);
} catch (error) {
  console.error(`❌ Cannot read schema: ${schemaPath}`);
  console.error(error.message);
  process.exit(1);
}

test("serves-query-console.contract.json validates against governed-artifact-contract.schema.json", (t) => {
  const ajv = new Ajv();
  // Add the JSON Schema meta-schema that the schema references
  ajv.addMetaSchema({ $id: "https://json-schema.org/draft/2020-12/schema" });
  const validate = ajv.compile(schema);
  const isValid = validate(contract);

  if (!isValid) {
    console.error("\n❌ SCHEMA VALIDATION FAILED\n");
    console.error("Errors:");
    validate.errors.forEach((error, i) => {
      console.error(`  ${i + 1}. ${error.instancePath || "root"}: ${error.message}`);
      if (error.params) {
        console.error(`     params: ${JSON.stringify(error.params)}`);
      }
    });
    console.error("\nContract:");
    console.error(JSON.stringify(contract, null, 2).slice(0, 500) + "...");
  }

  assert.ok(isValid, `Contract schema validation failed: ${ajv.errorsText(validate.errors)}`);
});

test("contract has required top-level fields", () => {
  const required = [
    "$schema",
    "artifacts",
    "claims",
    "conformance",
    "contract",
    "dependencies",
    "designAuthority",
    "effects",
    "exclusions",
    "interpretationBase",
    "lineage",
    "projectionLedger",
    "receipt",
    "runtimeAuthorities",
    "subject",
    "workspace"
  ];

  for (const field of required) {
    assert.ok(
      contract.hasOwnProperty(field),
      `Missing required field: ${field}`
    );
  }
});

test("contract.$schema is correct", () => {
  assert.strictEqual(
    contract.$schema,
    "https://canonical.local/schemas/governed-artifact-contract.schema.json"
  );
});

test("contract.contract has correct type and status", () => {
  assert.strictEqual(contract.contract.contractType, "governed-artifact-contract.v1");
  assert.strictEqual(contract.contract.status, "admitted");
  assert.ok(/^\d+\.\d+\.\d+$/.test(contract.contract.contractVersion), "contractVersion must be semver");
});

test("contract.artifacts is non-empty array", () => {
  assert.ok(Array.isArray(contract.artifacts), "artifacts must be an array");
  assert.ok(contract.artifacts.length > 0, "artifacts must have at least one entry");
});

test("each artifact has required fields", () => {
  for (const artifact of contract.artifacts) {
    assert.ok(artifact.artifactId, `Artifact missing artifactId`);
    assert.ok(artifact.artifactKind, `Artifact ${artifact.artifactId} missing artifactKind`);
    assert.ok(artifact.mediaType, `Artifact ${artifact.artifactId} missing mediaType`);
    assert.ok(artifact.projection, `Artifact ${artifact.artifactId} missing projection`);
    assert.ok(artifact.proof, `Artifact ${artifact.artifactId} missing proof`);
    assert.ok(artifact.purpose, `Artifact ${artifact.artifactId} missing purpose`);
    assert.ok(artifact.relativePath !== undefined, `Artifact ${artifact.artifactId} missing relativePath`);
  }
});

test("contract.subject has authority with closedLoop", () => {
  assert.ok(contract.subject, "Missing subject");
  assert.ok(contract.subject.authority, "subject missing authority");
  assert.ok(Array.isArray(contract.subject.authority.closedLoop), "authority.closedLoop must be array");
  assert.ok(contract.subject.authority.closedLoop.length > 0, "closedLoop must not be empty");
});

test("contract.workspace has required governance scope", () => {
  assert.ok(contract.workspace, "Missing workspace");
  assert.ok(contract.workspace.governedScope, "workspace missing governedScope");
  assert.ok(contract.workspace.governedScope.scopeType, "governedScope missing scopeType");
});

test("contract.conformance has evaluations", () => {
  assert.ok(contract.conformance, "Missing conformance");
  assert.ok(Array.isArray(contract.conformance.artifactEvaluations), "conformance.artifactEvaluations must be array");
});

test("contract.designAuthority has conversation digest", () => {
  assert.ok(contract.designAuthority, "Missing designAuthority");
  assert.ok(contract.designAuthority.conversationDigest, "designAuthority missing conversationDigest");
  assert.ok(/^sha256:[a-f0-9]{64}$/.test(contract.designAuthority.conversationDigest), "conversationDigest must be sha256 hash");
});

test("contract.interpretationBase has all engine dependencies", () => {
  const required = ["engine", "schema", "conformanceProfile", "projectorRegistry", "verifierRegistry", "migrationRegistry"];
  for (const dep of required) {
    assert.ok(contract.interpretationBase[dep], `interpretationBase missing ${dep}`);
    assert.ok(contract.interpretationBase[dep].identity, `${dep} missing identity`);
    assert.ok(/^sha256:[a-f0-9]{64}$/.test(contract.interpretationBase[dep].digest), `${dep}.digest must be sha256 hash`);
  }
});
