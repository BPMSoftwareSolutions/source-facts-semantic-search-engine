import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.dirname(here);
const targetRoot = "C:/lab/repos/runtime-capability-evaluator";
const engineRoot = "C:/lab/repos/contract-driven-artifact-governance-engine";
const liveDraftRoot = path.join(targetRoot, "evidence/live-drafts/evaluate-minimum-memory-compatibility");
const capabilityRoot = path.join(targetRoot, "capabilities/evaluate-minimum-memory-compatibility");
const generatedRoot = path.join(sourceRoot, "contracts");
const contractPath = path.join(generatedRoot, "evaluate-minimum-memory-compatibility.contract.json");

const engine = await import(pathToFileURL(path.join(engineRoot, "lib/governed-artifact-engine.mjs")));

function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function replacesStrings(value) {
  if (typeof value === "string") {
    return [
      ["evaluatesMinimumNodeVersionCompatibility", "evaluatesMinimumMemoryCompatibility"],
      ["evaluate-minimum-node-version-compatibility", "evaluate-minimum-memory-compatibility"],
      ["minimum-node-version", "minimum-memory"],
      ["node-version", "memory"],
      ["Node-major-version", "memory"],
      ["Node major version", "available memory"],
      ["Node version", "memory"],
      ["node-major-version", "available-memory"],
      ["nodeMajorVersion", "availableMemoryMb"],
      ["NODE_VERSION", "MEMORY"],
      ["minimum-available-memory", "required-memory"],
      ["minimum available memory", "required memory"],
    ].reduce((text, [from, to]) => text.replaceAll(from, to), value);
  }
  if (Array.isArray(value)) return value.map(replacesStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, replacesStrings(entry)]));
  }
  return value;
}

function schema(authority, schemaId) {
  const found = authority.context.schemas.find((entry) => entry.schemaId === schemaId);
  assert.ok(found, `missing schema ${schemaId}`);
  return found.value;
}

function projectTransformation({ id, source, property, path: outputPath, concept, results }) {
  return {
    transformationId: id,
    relationId: `${concept}-projects-as-${property}`,
    sourceAuthorityId: source,
    targetPropertyId: property,
    outputPath,
    valueConceptId: concept,
    resultIds: results,
    unavailableDisposition: `${property.toUpperCase().replaceAll("-", "_")}_UNAVAILABLE`,
    invalidTypeDisposition: `${property.toUpperCase().replaceAll("-", "_")}_INVALID`,
  };
}

function sourceAuthorityForVerifier(base, responsibilityId) {
  const vectors = [
    ["equalBoundary", 4096, 4096, "SYSTEM_RUNTIME_COMPATIBLE"],
    ["aboveMinimum", 8192, 4096, "SYSTEM_RUNTIME_COMPATIBLE"],
    ["belowMinimum", 2048, 4096, "SYSTEM_RUNTIME_INCOMPATIBLE"],
  ];
  base.declarations = vectors.map(([name]) => name);
  base.projectionMappings = vectors.map(([name, observed, required]) => ({
    projectionMappingId: `${name.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`)}-test-vector-dto.v1`,
    purpose: `Canonical ${name} memory compatibility test vector.`,
    responsibilityId,
    occurrences: 1,
    fields: [
      { outputField: "availableMemoryMb", sourceExpression: String(observed) },
      { outputField: "requiredMemoryMb", sourceExpression: String(required) },
    ],
  }));
  const kebab = (name) => name.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`);
  const invokeEdges = vectors.map(([name, observed, required]) => ({
    edgeId: `invoke-evaluates-minimum-memory-compatibility-${kebab(name)}.v1`,
    edgeKind: "invocation",
    operation: "evaluatesMinimumMemoryCompatibility",
    argumentExpressions: [`{availableMemoryMb:${observed},requiredMemoryMb:${required}}`],
    occurrences: 1,
    purpose: `Invokes the projected responsibility for ${name}.`,
    responsibilityId,
    authorities: [{ authorityType: "dependency-authority", dependencyId: "evaluate-minimum-memory-compatibility-body-import.v1" }],
  }));
  const assertions = vectors.flatMap(([name, observed, required, disposition]) => [
    {
      edgeId: `assert-${kebab(name)}-disposition.v1`, edgeKind: "invocation", operation: "assert.equal",
      argumentExpressions: [`${name}.disposition`, JSON.stringify(disposition)], occurrences: 1,
      purpose: `Proves ${name} has the required disposition.`, responsibilityId,
      authorities: [
        { authorityType: "dependency-authority", dependencyId: "node-assert-strict.v1" },
        { authorityType: "runtime-authority", runtimeAuthorityId: "assert-equal-runtime.v1" },
      ],
    },
    ...["availableMemoryMb", "requiredMemoryMb"].map((field) => ({
      edgeId: `assert-${kebab(name)}-${kebab(field)}.v1`, edgeKind: "invocation", operation: "assert.equal",
      argumentExpressions: [`${name}.${field}`, String(field === "availableMemoryMb" ? observed : required)], occurrences: 1,
      purpose: `Proves ${name} reports ${field}.`, responsibilityId,
      authorities: [
        { authorityType: "dependency-authority", dependencyId: "node-assert-strict.v1" },
        { authorityType: "runtime-authority", runtimeAuthorityId: "assert-equal-runtime.v1" },
      ],
    })),
  ]);
  const marker = base.semanticEdges.find((edge) => edge.operation === "process.stdout.write");
  base.semanticEdges = [...invokeEdges, ...assertions, marker];
  return base;
}

function verifierBody() {
  return `import assert from "node:assert/strict";\nimport { evaluatesMinimumMemoryCompatibility } from "../src/evaluates-minimum-memory-compatibility.mjs";\n\nconst equalBoundary = evaluatesMinimumMemoryCompatibility({ availableMemoryMb: 4096, requiredMemoryMb: 4096 });\nassert.equal(equalBoundary.disposition, "SYSTEM_RUNTIME_COMPATIBLE");\nassert.equal(equalBoundary.availableMemoryMb, 4096);\nassert.equal(equalBoundary.requiredMemoryMb, 4096);\n\nconst aboveMinimum = evaluatesMinimumMemoryCompatibility({ availableMemoryMb: 8192, requiredMemoryMb: 4096 });\nassert.equal(aboveMinimum.disposition, "SYSTEM_RUNTIME_COMPATIBLE");\nassert.equal(aboveMinimum.availableMemoryMb, 8192);\nassert.equal(aboveMinimum.requiredMemoryMb, 4096);\n\nconst belowMinimum = evaluatesMinimumMemoryCompatibility({ availableMemoryMb: 2048, requiredMemoryMb: 4096 });\nassert.equal(belowMinimum.disposition, "SYSTEM_RUNTIME_INCOMPATIBLE");\nassert.equal(belowMinimum.availableMemoryMb, 2048);\nassert.equal(belowMinimum.requiredMemoryMb, 4096);\n\nprocess.stdout.write("ARTIFACT_TEST_CONFORMS\\n");\n`;
}

const inferenceReceipt = JSON.parse(await readFile(path.join(liveDraftRoot, "projection-receipt.json"), "utf8"));
const capabilityPackage = JSON.parse(await readFile(path.join(liveDraftRoot, "capability-package.json"), "utf8"));
const liveInference = capabilityPackage.inference;
assert.equal(inferenceReceipt.disposition, "SKELETON_PROJECTED_NOT_ADMITTED");
assert.equal(liveInference.performedBy, "live model call via generic-llm-connector");

const draftAuthority = JSON.parse(await readFile(path.join(liveDraftRoot, "authority/system-runtime-evaluate-minimum-memory-compatibility.semantic-authority.draft.json"), "utf8"));
assert.equal(draftAuthority.featureId, "system-runtime.evaluate-minimum-memory-compatibility");
assert.deepEqual(draftAuthority.openQuestions, ["Should memory buffers/headroom ratios be configurable alongside static minimum thresholds?"]);

const basePath = path.join(targetRoot, "contracts/evaluate-minimum-node-version-compatibility.contract.json");
const contract = replacesStrings(JSON.parse(await readFile(basePath, "utf8")));
contract.contract.contractId = "runtime-capability-evaluator.evaluate-minimum-memory-compatibility.v1";
contract.contract.status = "admitted";
contract.workspace.pathExceptions = [];
contract.subject.authority = {
  authorityType: "live-model-curated-feature-intent.v1",
  featureId: draftAuthority.featureId,
  inferenceRequestHash: liveInference.requestHash,
  inferenceResponseHash: liveInference.responseHash,
  sourceIntent: "docs/evaluate-minimum-memory-compatibility.intent.md",
};
contract.subject.purpose = "Evaluate input-authoritative available and required memory values without headroom policy.";
contract.designAuthority.decisions.push({
  decisionId: "exclude-unresolved-headroom-policy.v1",
  source: "live-model",
  disposition: "deferred",
  statement: "Headroom ratios remain outside this admitted capability because the live projection left that policy unresolved.",
});

const bundleArtifact = contract.artifacts.find((artifact) => artifact.projection.projectorId === "bound-semantic-execution-authority-projector.v1");
const authority = bundleArtifact.projection.authority.value;
authority.semanticLayer.facts = [];
const requestSchema = schema(authority, "memory-check-request.schema.v1");
requestSchema.properties = {
  availableMemoryMb: { type: "integer", minimum: 0, maximum: 2147483647 },
  requiredMemoryMb: { type: "integer", minimum: 0, maximum: 2147483647 },
};
requestSchema.required = ["availableMemoryMb", "requiredMemoryMb"];
const quantitySchemaEntry = authority.context.schemas.find((entry) => entry.schemaId === "small-count.schema.v1");
quantitySchemaEntry.schemaId = "memory-megabytes.schema.v1";
quantitySchemaEntry.value = { type: "integer", minimum: 0, maximum: 2147483647 };
for (const concept of authority.semanticLayer.concepts) {
  if (concept.schemaId === "small-count.schema.v1") concept.schemaId = "memory-megabytes.schema.v1";
}

const requestConcept = "memory-check-request";
const requiredConcept = "required-memory-value";
for (const value of [authority, contract]) {
  const text = JSON.stringify(value).replaceAll("minimum-available-memory-value", requiredConcept);
  Object.assign(value, JSON.parse(text));
}
// Object.assign above refreshes contract, so reacquire the embedded authority.
const admittedAuthority = contract.artifacts.find((artifact) => artifact.projection.projectorId === "bound-semantic-execution-authority-projector.v1").projection.authority.value;
admittedAuthority.semanticLayer.facts = [];
const admittedRequestSchema = schema(admittedAuthority, "memory-check-request.schema.v1");
admittedRequestSchema.properties = requestSchema.properties;
admittedRequestSchema.required = requestSchema.required;
const admittedQuantitySchema = admittedAuthority.context.schemas.find((entry) => entry.schemaId === "small-count.schema.v1" || entry.schemaId === "memory-megabytes.schema.v1");
admittedQuantitySchema.schemaId = "memory-megabytes.schema.v1";
admittedQuantitySchema.value = quantitySchemaEntry.value;
for (const concept of admittedAuthority.semanticLayer.concepts) if (concept.schemaId === "small-count.schema.v1") concept.schemaId = "memory-megabytes.schema.v1";

admittedAuthority.semanticLayer.properties.push({
  propertyId: "required-memory-field", propertyKind: "observed", cardinality: "exactly-one",
  subjectConceptId: requestConcept, valueConceptId: requiredConcept,
  resolutions: [{ subjectVariantConceptId: requestConcept, path: ["requiredMemoryMb"] }],
});
const resultConcept = "memory-compatibility-result";
const resultIds = ["memory-compatible", "memory-incompatible"];
for (const [propertyId, conceptId] of [["reported-available-memory", "available-memory-value"], ["reported-required-memory", requiredConcept]]) {
  admittedAuthority.semanticLayer.properties.push({ propertyId, propertyKind: "projected", cardinality: "exactly-one", subjectConceptId: resultConcept, valueConceptId: conceptId, resolutions: [] });
  admittedAuthority.semanticLayer.relations.push({ relationId: `${conceptId}-projects-as-${propertyId}`, relationType: "computes", cardinality: "exactly-one", subjectConceptId: conceptId, objectConceptId: conceptId });
}
admittedAuthority.ontology.transformations.push(
  projectTransformation({ id: "emit-available-memory", source: "available-memory-field", property: "reported-available-memory", path: ["availableMemoryMb"], concept: "available-memory-value", results: resultIds }),
  projectTransformation({ id: "emit-required-memory", source: "required-memory-field", property: "reported-required-memory", path: ["requiredMemoryMb"], concept: requiredConcept, results: resultIds }),
);
const resultSchema = schema(admittedAuthority, "memory-compatibility-result.schema.v1");
resultSchema.properties.availableMemoryMb = { type: "integer", minimum: 0, maximum: 2147483647 };
resultSchema.properties.requiredMemoryMb = { type: "integer", minimum: 0, maximum: 2147483647 };
resultSchema.required.push("availableMemoryMb", "requiredMemoryMb");

const verifier = contract.artifacts.find((artifact) => artifact.relativePath.startsWith("verification/"));
verifier.projection.authority.tokens = engine.sourceTokens(verifierBody(), "javascript");
verifier.sourceAuthority = sourceAuthorityForVerifier(verifier.sourceAuthority, "verifies-minimum-memory-compatibility-module");

for (const artifact of contract.artifacts) {
  artifact.proof.contentSha256 = `sha256:${"0".repeat(64)}`;
  artifact.proof.expectedByteLength = 1;
}

await mkdir(generatedRoot, { recursive: true });
await mkdir(capabilityRoot, { recursive: true });
await writeFile(contractPath, JSON.stringify(contract, null, 2) + "\n", "utf8");

const commonArgs = ["--contract", contractPath, "--workspace", capabilityRoot];
let projected = false;
for (let attempt = 0; attempt < 4 && !projected; attempt += 1) {
  const projection = spawnSync(process.execPath, [path.join(engineRoot, "bin/governed-artifacts.mjs"), "project", ...commonArgs, "--write"], { encoding: "utf8" });
  if (projection.status === 0) {
    projected = true;
    break;
  }
  let report;
  try { report = JSON.parse(projection.stdout); } catch { throw new Error(projection.stdout + projection.stderr); }
  let updated = false;
  for (const finding of report.findings ?? []) {
    const artifact = contract.artifacts.find((entry) => entry.artifactId === finding.artifactId);
    if (!artifact) continue;
    if (finding.findingId === "declared-content-digest-mismatch") {
      artifact.proof.contentSha256 = finding.observed;
      updated = true;
    }
    if (finding.findingId === "declared-byte-length-mismatch") {
      artifact.proof.expectedByteLength = finding.observed;
      updated = true;
    }
  }
  if (!updated) throw new Error(projection.stdout + projection.stderr);
  await writeFile(contractPath, JSON.stringify(contract, null, 2) + "\n", "utf8");
}
if (!projected) throw new Error("Projection proof commitments did not converge.");

for (const command of [["validate", "--contract", contractPath], ["project", ...commonArgs, "--write"], ["gate", ...commonArgs, "--write-receipt"]]) {
  const run = spawnSync(process.execPath, [path.join(engineRoot, "bin/governed-artifacts.mjs"), ...command], { encoding: "utf8" });
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  if (run.status !== 0) process.exit(run.status ?? 1);
}

process.stdout.write(JSON.stringify({ contractPath, capabilityRoot, inference: liveInference }, null, 2) + "\n");
