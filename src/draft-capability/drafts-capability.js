import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { invokesLiveModelInference } from "../governance/invokes-live-model-inference.js";

const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;
const identityPattern = /^[a-z0-9][a-z0-9._-]*$/u;
const fieldTypes = new Set(["string", "number", "integer", "boolean", "object", "array"]);

const fieldSchema = {
  type: "object",
  required: ["name", "type", "required", "description"],
  properties: {
    name: { type: "string" },
    type: { type: "string", enum: [...fieldTypes] },
    required: { type: "boolean" },
    description: { type: "string" },
  },
  additionalProperties: false,
};

export const draftCapabilityResponseSchema = Object.freeze({
  type: "object",
  required: ["feature", "scenarios", "runtimeProfile", "openQuestions"],
  properties: {
    feature: {
      type: "object",
      required: ["featureId", "title", "purpose"],
      properties: {
        featureId: { type: "string" },
        title: { type: "string" },
        purpose: { type: "string" },
      },
      additionalProperties: false,
    },
    scenarios: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: [
          "scenarioId", "title", "given", "when", "then", "responsibilityId", "obligationId",
          "bodyName", "edgeId", "semanticSummary", "dependencies", "effects", "failureSemantics",
          "inputFields", "outputFields", "proof",
        ],
        properties: {
          scenarioId: { type: "string" },
          title: { type: "string" },
          given: { type: "string" },
          when: { type: "string" },
          then: { type: "string" },
          responsibilityId: { type: "string" },
          obligationId: { type: "string" },
          bodyName: { type: "string" },
          edgeId: { type: "string" },
          semanticSummary: { type: "string" },
          dependencies: { type: "array", items: { type: "string" } },
          effects: { type: "array", items: { type: "string" } },
          failureSemantics: { type: "array", items: { type: "string" } },
          inputFields: { type: "array", items: fieldSchema },
          outputFields: { type: "array", minItems: 1, items: fieldSchema },
          proof: {
            type: "object",
            required: ["fixtureDescription", "expectedOutcome", "remainingSemanticQuestion"],
            properties: {
              fixtureDescription: { type: "string" },
              expectedOutcome: { type: "string" },
              remainingSemanticQuestion: { type: "string" },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    },
    runtimeProfile: {
      type: "object",
      required: ["interactionSurface", "runtimeNotes"],
      properties: {
        interactionSurface: { type: "string" },
        runtimeNotes: { type: "array", items: { type: "string" } },
      },
      additionalProperties: false,
    },
    openQuestions: { type: "array", items: { type: "string" } },
  },
  additionalProperties: false,
});

const systemPrompt = `You project a COMPLETE DRAFT CAPABILITY SKELETON from natural-language feature intent.

Your output is an exploratory projection hypothesis, never admitted authority. Produce the smallest coherent package whose identity is aligned from feature to scenario to obligation to responsibility to executable body to semantic edge to proof expectation.

Hard constraints:
- Preserve the exact required feature ID.
- Use lowercase stable IDs. Scenario IDs must begin with the feature ID followed by a dot.
- Use lowerCamelCase JavaScript identifiers for bodyName.
- Give each scenario exactly one responsibility, obligation, body, semantic edge, input contract, output contract, and proof expectation.
- Bodies will be thin delegations to context.edges.invokes(edgeId, input); do not bury domain algorithms in them.
- Treat semantic summaries, dependencies, effects, failure semantics, schemas, and proof expectations as DRAFTS requiring curation.
- Prefer 1-4 scenarios that express distinct observable outcomes, including meaningful rejection/failure behavior when the intent calls for it.
- Field names must be valid JavaScript identifiers and field types must use the declared finite vocabulary.
- Do not claim the capability is proven, admitted, signed, production-ready, or release-locked.
- Respond only with the declared JSON shape.`;

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function slugifies(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "").slice(0, 64) || "capability";
}

function scenarioArtifactStem(featureId, scenarioId) {
  const suffix = scenarioId.startsWith(`${featureId}.`) ? scenarioId.slice(featureId.length + 1) : scenarioId;
  return slugifies(suffix);
}

export function derivesDraftFeatureId(intentText) {
  const firstMeaningfulLine = intentText.split(/\r?\n/u).map((line) => line.trim()).find(Boolean) ?? "capability";
  return `draft.${slugifies(firstMeaningfulLine.split(/\s+/u).slice(0, 8).join(" "))}`;
}

function inferenceReceipt(response) {
  return Object.freeze({
    performedBy: "live model call via generic-llm-connector",
    providerAuthorityId: response.resolvedAuthority?.providerAuthorityId ?? null,
    providerKind: response.resolvedAuthority?.providerKind ?? null,
    resolvedModel: response.resolvedAuthority?.resolvedModel ?? null,
    requestId: response.requestId ?? null,
    invocationId: response.invocationId ?? null,
    requestHash: response.proof?.requestHash ?? null,
    responseHash: response.proof?.responseHash ?? null,
    usage: response.usage ?? null,
  });
}

function validatesNonempty(label, value, findings) {
  if (typeof value !== "string" || value.trim().length === 0) findings.push(`${label}:REQUIRED`);
}

export function validatesDraftCapabilityBlueprint(blueprint, requiredFeatureId) {
  const findings = [];
  if (blueprint === null || typeof blueprint !== "object") return ["BLUEPRINT_REQUIRED"];
  if (blueprint.feature?.featureId !== requiredFeatureId) findings.push("FEATURE_ID_CHANGED");
  if (!identityPattern.test(blueprint.feature?.featureId ?? "")) findings.push("FEATURE_ID_INVALID");
  validatesNonempty("feature.title", blueprint.feature?.title, findings);
  validatesNonempty("feature.purpose", blueprint.feature?.purpose, findings);
  if (!Array.isArray(blueprint.scenarios) || blueprint.scenarios.length === 0) findings.push("SCENARIOS_REQUIRED");
  const identities = new Set();
  const bodyNames = new Set();
  for (const [index, scenario] of (blueprint.scenarios ?? []).entries()) {
    const prefix = `scenarios[${index}]`;
    for (const [name, value] of Object.entries({
      scenarioId: scenario.scenarioId,
      responsibilityId: scenario.responsibilityId,
      obligationId: scenario.obligationId,
      edgeId: scenario.edgeId,
    })) {
      if (!identityPattern.test(value ?? "")) findings.push(`${prefix}.${name}:INVALID_ID`);
      if (identities.has(value)) findings.push(`${prefix}.${name}:DUPLICATE_ID`);
      identities.add(value);
    }
    if (!String(scenario.scenarioId ?? "").startsWith(`${requiredFeatureId}.`)) findings.push(`${prefix}.scenarioId:WRONG_PREFIX`);
    if (!identifierPattern.test(scenario.bodyName ?? "")) findings.push(`${prefix}.bodyName:INVALID_IDENTIFIER`);
    if (scenario.bodyName === "executesDraftCapability") findings.push(`${prefix}.bodyName:RESERVED_IDENTIFIER`);
    if (bodyNames.has(scenario.bodyName)) findings.push(`${prefix}.bodyName:DUPLICATE`);
    bodyNames.add(scenario.bodyName);
    for (const name of ["title", "given", "when", "then", "semanticSummary"]) validatesNonempty(`${prefix}.${name}`, scenario[name], findings);
    for (const collection of ["dependencies", "effects", "failureSemantics", "inputFields", "outputFields"]) {
      if (!Array.isArray(scenario[collection])) findings.push(`${prefix}.${collection}:ARRAY_REQUIRED`);
    }
    if (!Array.isArray(scenario.outputFields) || scenario.outputFields.length === 0) findings.push(`${prefix}.outputFields:REQUIRED`);
    const fieldNames = new Set();
    for (const [fieldIndex, field] of [...(scenario.inputFields ?? []), ...(scenario.outputFields ?? [])].entries()) {
      if (!identifierPattern.test(field?.name ?? "")) findings.push(`${prefix}.fields[${fieldIndex}].name:INVALID_IDENTIFIER`);
      if (!fieldTypes.has(field?.type)) findings.push(`${prefix}.fields[${fieldIndex}].type:INVALID`);
      if (typeof field?.required !== "boolean") findings.push(`${prefix}.fields[${fieldIndex}].required:BOOLEAN_REQUIRED`);
      validatesNonempty(`${prefix}.fields[${fieldIndex}].description`, field?.description, findings);
      const laneName = `${fieldIndex < (scenario.inputFields?.length ?? 0) ? "input" : "output"}:${field?.name}`;
      if (fieldNames.has(laneName)) findings.push(`${prefix}.fields[${fieldIndex}].name:DUPLICATE`);
      fieldNames.add(laneName);
    }
    validatesNonempty(`${prefix}.proof.fixtureDescription`, scenario.proof?.fixtureDescription, findings);
    validatesNonempty(`${prefix}.proof.expectedOutcome`, scenario.proof?.expectedOutcome, findings);
    validatesNonempty(`${prefix}.proof.remainingSemanticQuestion`, scenario.proof?.remainingSemanticQuestion, findings);
  }
  if (!Array.isArray(blueprint.openQuestions)) findings.push("OPEN_QUESTIONS_ARRAY_REQUIRED");
  return findings;
}

export async function draftsCapabilityFromIntent({
  intentText,
  featureId = derivesDraftFeatureId(intentText),
  targetPlatform = "node-esm",
  requestId = `draft-capability-${randomUUID()}`,
  invoke = invokesLiveModelInference,
}) {
  if (typeof intentText !== "string" || intentText.trim().length === 0) throw new Error("Feature intent text is required.");
  if (!identityPattern.test(featureId)) throw new Error(`Feature ID is invalid: ${featureId}`);
  if (targetPlatform !== "node-esm") throw new Error(`Unsupported target platform: ${targetPlatform}`);
  const modelRequest = {
    "$schema": "../authority/model-request.schema.v1.json",
    requestId,
    providerAuthorityId: "primary-cognitive-provider",
    modelAlias: "instruction-capable-model",
    interaction: {
      mode: "structured-generation",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Required feature ID: ${featureId}\nTarget platform: ${targetPlatform}\n\nFeature intent:\n${intentText}` },
      ],
    },
    responsePolicy: { format: "json", maximumOutputTokens: 16384, temperature: 0, schema: draftCapabilityResponseSchema },
    executionPolicy: {
      timeoutMilliseconds: 60000,
      attemptAuthority: {
        maximumAuthorizedAttempts: 3,
        continuationRule: "continue-while-provider-reports-transient-failure",
      },
      providerSubstitution: { allowed: false },
    },
    evidencePolicy: { captureRequestHash: true, captureResponseHash: true, captureResolvedProvider: true, captureResolvedModel: true, captureTokenUsage: true, captureTiming: true },
  };
  const response = await invoke(modelRequest);
  if (response.disposition !== "MODEL_RESPONSE_OBTAINED") {
    const details = (response.findings ?? []).map((finding) => finding.detail).filter(Boolean).join("; ");
    throw new Error(`Model invocation did not succeed: ${response.disposition}${details.length > 0 ? ` (${details})` : ""}`);
  }
  const blueprint = response.result?.structuredValue;
  const findings = validatesDraftCapabilityBlueprint(blueprint, featureId);
  if (findings.length > 0) throw new Error(`Draft capability failed deterministic validation: ${findings.join(", ")}`);
  return Object.freeze({
    documentKind: "draft-capability-blueprint.v1",
    lifecycle: "INTENT_CAPTURED",
    targetPlatform,
    intentText,
    blueprint,
    inference: inferenceReceipt(response),
  });
}

function jsonSchemaFor(contractId, fields) {
  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": contractId,
    title: contractId,
    type: "object",
    additionalProperties: false,
    required: fields.filter((field) => field.required).map((field) => field.name),
    properties: Object.fromEntries(fields.map((field) => [field.name, { type: field.type, description: field.description }])),
  };
}

function projectsGherkin(feature) {
  const lines = [`&feature:${feature.featureId}`, `Feature: ${feature.title}`, ""];
  for (const scenario of feature.scenarios) {
    lines.push(`  &scenario:${scenario.scenarioId}`, `  Scenario: ${scenario.title}`, "", `    &given:${scenario.scenarioId}.given`, `    Given ${scenario.given}`, "", `    &when:${scenario.scenarioId}.when`, `    When ${scenario.when}`, "", `    &then:${scenario.scenarioId}.then`, `    Then ${scenario.then}`, "");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function projectsSource(feature) {
  const bodies = feature.scenarios.map((scenario) => `/**\n * DRAFT projection for ${scenario.scenarioId}.\n * Semantic authority is not admitted; domain meaning belongs behind the named edge.\n */\nexport async function ${scenario.bodyName}(input, context) {\n  if (context?.edges === undefined || typeof context.edges.invokes !== "function") {\n    throw new TypeError("context.edges.invokes is required");\n  }\n  return context.edges.invokes(${JSON.stringify(scenario.edgeId)}, input);\n}`).join("\n\n");
  const cases = feature.scenarios.map((scenario) => `    case ${JSON.stringify(scenario.responsibilityId)}:\n      return ${scenario.bodyName}(input, context);`).join("\n");
  return `/** Feature-level interface root. Every scenario body is statically reachable here. */\nexport async function executesDraftCapability(responsibilityId, input, context) {\n  switch (responsibilityId) {\n${cases}\n    default:\n      throw new RangeError(\`Unknown draft responsibility: \${responsibilityId}\`);\n  }\n}\n\n${bodies}\n`;
}

function projectsTests(feature, slug) {
  const imports = feature.scenarios.map((scenario) => scenario.bodyName).join(", ");
  const tests = feature.scenarios.map((scenario) => `test(${JSON.stringify(`${scenario.title} [draft wiring proof]`)}, async () => {\n  const calls = [];\n  const expected = { disposition: "DRAFT_EXPECTATION", scenarioId: ${JSON.stringify(scenario.scenarioId)} };\n  const context = { edges: { invokes: async (edgeId, input) => { calls.push({ edgeId, input }); return expected; } } };\n  const input = {};\n\n  const result = await ${scenario.bodyName}(input, context);\n\n  assert.equal(result, expected);\n  assert.deepEqual(calls, [{ edgeId: ${JSON.stringify(scenario.edgeId)}, input }]);\n});`).join("\n\n");
  return `import assert from "node:assert/strict";\nimport test from "node:test";\nimport { ${imports} } from "../src/${slug}.mjs";\n\n${tests}\n`;
}

function projectsReadme(feature, artifactPaths) {
  return `# ${feature.title}\n\n${feature.purpose}\n\nThis workspace is a disposable projection hypothesis. It proves identity and edge wiring only; semantic authority and domain equivalence remain drafts.\n\nLifecycle: \`SKELETON_PROJECTED\`\n\n## Exercise\n\n\`\`\`powershell\nnpm test\n\`\`\`\n\n## Projected family\n\n${artifactPaths.map((item) => `- \`${item}\``).join("\n")}\n`;
}

async function pathExists(target) {
  try { await stat(target); return true; } catch (error) { if (error?.code === "ENOENT") return false; throw error; }
}

export async function materializesDraftCapabilityPackage(draft, outputDirectory) {
  const feature = { ...draft.blueprint.feature, scenarios: draft.blueprint.scenarios };
  const findings = validatesDraftCapabilityBlueprint(draft.blueprint, feature.featureId);
  if (findings.length > 0) throw new Error(`Draft capability failed deterministic validation: ${findings.join(", ")}`);
  const outputRoot = path.resolve(outputDirectory);
  if (await pathExists(outputRoot)) throw new Error(`Output directory already exists: ${outputRoot}`);
  const slug = slugifies(feature.featureId);
  // Use a sibling temporary directory so the final rename is atomic on the target volume.
  const stagingRoot = `${outputRoot}.staging-${randomUUID()}`;
  const artifacts = new Map();
  const addJson = (relativePath, value) => artifacts.set(relativePath, `${JSON.stringify(value, null, 2)}\n`);
  const scenarioContracts = [];
  for (const scenario of feature.scenarios) {
    const inputContractId = `${scenario.scenarioId}.input.v1`;
    const outputContractId = `${scenario.scenarioId}.output.v1`;
    const scenarioStem = scenarioArtifactStem(feature.featureId, scenario.scenarioId);
    const inputPath = `contracts/${slug}.${scenarioStem}.input.schema.json`;
    const outputPath = `contracts/${slug}.${scenarioStem}.output.schema.json`;
    addJson(inputPath, jsonSchemaFor(inputContractId, scenario.inputFields));
    addJson(outputPath, jsonSchemaFor(outputContractId, scenario.outputFields));
    scenarioContracts.push({ scenarioId: scenario.scenarioId, inputContractId, inputPath, outputContractId, outputPath });
  }
  const intent = {
    documentKind: "canonical-feature-intent.v1",
    featureId: feature.featureId,
    featureFile: `features/${slug}.feature`,
    featureAnchor: `&feature:${feature.featureId}`,
    purpose: feature.purpose,
    scenarios: feature.scenarios.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      scenarioAnchor: `&scenario:${scenario.scenarioId}`,
      responsibilityId: scenario.responsibilityId,
      obligationId: scenario.obligationId,
      givenId: `${scenario.scenarioId}.given`,
      whenId: `${scenario.scenarioId}.when`,
      thenId: `${scenario.scenarioId}.then`,
      implementationSymbols: [scenario.bodyName],
      purpose: scenario.semanticSummary,
    })),
    interfaceRoot: `src/${slug}.mjs#executesDraftCapability`,
    lifecycle: "SKELETON_PROJECTED",
    authorityStatus: "DRAFT_NOT_ADMITTED",
  };
  const semanticAuthority = {
    documentKind: "draft-semantic-authority.v1",
    lifecycle: "SEMANTIC_TISSUE_IN_PROGRESS",
    featureId: feature.featureId,
    authorities: feature.scenarios.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      responsibilityId: scenario.responsibilityId,
      obligationId: scenario.obligationId,
      edgeId: scenario.edgeId,
      semanticSummary: scenario.semanticSummary,
      dependencies: scenario.dependencies,
      effects: scenario.effects,
      failureSemantics: scenario.failureSemantics,
      draftQuality: "REQUIRES_HUMAN_CURATION",
    })),
    openQuestions: draft.blueprint.openQuestions,
  };
  const governedContract = {
    documentKind: "draft-governed-capability-contract.v1",
    lifecycle: "CAPABILITY_DRAFT_ACTIVE",
    admissibility: "NOT_ADMISSIBLE",
    featureId: feature.featureId,
    artifacts: feature.scenarios.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      obligationId: scenario.obligationId,
      responsibilityId: scenario.responsibilityId,
      projectedBody: `src/${slug}.mjs#${scenario.bodyName}`,
      semanticEdge: scenario.edgeId,
      contracts: scenarioContracts.find((item) => item.scenarioId === scenario.scenarioId),
      proof: { ...scenario.proof, disposition: "DRAFT_PROOF_EXPECTATION" },
    })),
    runtimeProfile: { target: "node-esm", minimumNodeVersion: "20", edgePort: "context.edges.invokes", ...draft.blueprint.runtimeProfile },
    excludedClaims: ["semantic-equivalence", "authority-admission", "signature", "release-lock"],
  };
  addJson(`features/${slug}.intent.json`, intent);
  artifacts.set(`features/${slug}.feature`, projectsGherkin(feature));
  addJson(`authority/${slug}.semantic-authority.draft.json`, semanticAuthority);
  addJson(`contracts/${slug}.governed.contract.draft.json`, governedContract);
  artifacts.set(`src/${slug}.mjs`, projectsSource(feature));
  artifacts.set(`test/${slug}.test.mjs`, projectsTests(feature, slug));
  addJson("package.json", { name: `${slug}-draft-capability`, private: true, type: "module", engines: { node: ">=20" }, scripts: { test: "node --test" } });
  const projectedPaths = [...artifacts.keys(), "capability-package.json", "projection-receipt.json", "README.md"].sort();
  artifacts.set("README.md", projectsReadme(feature, projectedPaths));
  const manifest = {
    documentKind: "draft-capability-package.v1",
    lifecycle: "SKELETON_PROJECTED",
    featureId: feature.featureId,
    intent: { text: draft.intentText, digest: `sha256:${sha256(draft.intentText)}` },
    identitySpine: feature.scenarios.map((scenario) => ({ scenarioId: scenario.scenarioId, obligationId: scenario.obligationId, responsibilityId: scenario.responsibilityId, bodyName: scenario.bodyName, edgeId: scenario.edgeId })),
    artifacts: projectedPaths,
    inference: draft.inference,
    nextLifecycle: "CAPABILITY_DRAFT_ACTIVE",
  };
  addJson("capability-package.json", manifest);
  const hashes = Object.fromEntries([...artifacts.entries()].map(([artifactPath, content]) => [artifactPath, `sha256:${sha256(content)}`]).sort(([left], [right]) => left.localeCompare(right)));
  const receipt = {
    documentKind: "draft-capability-projection-receipt.v1",
    disposition: "SKELETON_PROJECTED_NOT_ADMITTED",
    featureId: feature.featureId,
    intentDigest: manifest.intent.digest,
    artifactHashes: hashes,
    proofScope: "identity-and-edge-wiring-only",
    unresolvedSemanticQuestions: [...draft.blueprint.openQuestions, ...feature.scenarios.map((scenario) => scenario.proof.remainingSemanticQuestion)],
  };
  addJson("projection-receipt.json", receipt);
  try {
    await mkdir(path.dirname(outputRoot), { recursive: true });
    for (const [relativePath, content] of artifacts) {
      const target = path.join(stagingRoot, ...relativePath.split("/"));
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content, "utf8");
    }
    await rename(stagingRoot, outputRoot);
  } catch (error) {
    await rm(stagingRoot, { recursive: true, force: true });
    throw error;
  }
  return Object.freeze({ outputRoot, manifest, receipt });
}

export async function readsIntentText({ intent, intentFile }) {
  if (typeof intent === "string" && intent.trim().length > 0) return intent.trim();
  if (typeof intentFile === "string") return (await readFile(path.resolve(intentFile), "utf8")).trim();
  throw new Error("Provide feature intent with --intent or --intent-file.");
}
