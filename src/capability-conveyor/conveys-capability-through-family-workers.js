import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { invokesLiveModelInference } from "../governance/invokes-live-model-inference.js";

const idPattern = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/u;
const identifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;
const edgePattern = /^[a-z][a-z0-9-]*$/u;
const schemaId = "https://schemas.deterministic.solutions/projection/semantic-invocation-function-request/1.0.0/schema.json";
const schemaDigest = "sha256:923b757154a0b858f9cc418d4d270993aa7e3a68b4acce81aac0f5cfab6b31bd";

const object = (properties, required = Object.keys(properties)) => ({
  type: "object", additionalProperties: false, required, properties,
});
const string = { type: "string", minLength: 1 };
const id = { type: "string", pattern: "^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$" };

const families = Object.freeze([
  Object.freeze({
    familyId: "feature-authority",
    instructions: "Establish only the bounded feature identity, actor, purpose, outcome, and exclusions. Preserve requiredFeatureId exactly.",
    schema: object({ featureId: id, title: string, actor: string, purpose: string, outcome: string, exclusions: { type: "array", items: string } }),
  }),
  Object.freeze({
    familyId: "scenario-authority",
    instructions: "Add one atomic observable scenario for the current feature. Do not alter the feature.",
    schema: object({ scenarioId: id, title: string, given: { type: "array", minItems: 1, items: string }, when: string, then: { type: "array", minItems: 1, items: string } }),
  }),
  Object.freeze({
    familyId: "obligation-authority",
    instructions: "State the one truth the scenario must establish. Do not add another scenario or responsibility.",
    schema: object({ obligationId: id, statement: string }),
  }),
  Object.freeze({
    familyId: "responsibility-authority",
    instructions: "Name the single bounded worker that owns the obligation and its semantic operation. Use a lowerCamelCase bodyName.",
    schema: object({ responsibilityId: id, statement: string, semanticOperationId: { type: "string", pattern: "^[a-z][a-z0-9-]*$" }, bodyName: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" } }),
  }),
  Object.freeze({
    familyId: "input-authority",
    instructions: "Declare the complete input contract. For this finite decision-table profile every input must be a required boolean. Do not invent observations outside the confirmed intent.",
    schema: object({ inputContractId: id, fields: { type: "array", minItems: 1, items: object({ name: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" }, type: { const: "boolean" }, required: { const: true }, description: string }) } }),
  }),
  Object.freeze({
    familyId: "decision-authority",
    instructions: "Express the complete finite truth table as structured cases. Each case must bind every declared input exactly once. No prose evaluation rule and no fallback case.",
    schema: object({ decisionTableId: id, cases: { type: "array", minItems: 1, items: object({ caseId: id, observations: { type: "array", minItems: 1, items: object({ field: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" }, value: { type: "boolean" } }) }, disposition: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" } }) } }),
  }),
  Object.freeze({
    familyId: "result-authority",
    instructions: "Declare the canonical result contract for the decision table. The output is one disposition selected from the table's values.",
    schema: object({ resultContractId: id, resultType: id, dispositionField: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" }, dispositions: { type: "array", minItems: 1, uniqueItems: true, items: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" } } }),
  }),
  Object.freeze({
    familyId: "failure-authority",
    instructions: "Declare fail-closed invalid-input behavior. Missing and non-boolean fields must produce structured field findings and no disposition.",
    schema: object({ invalidDisposition: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" }, findingContractId: id, missingFieldCode: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" }, invalidTypeCode: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" }, producesDisposition: { const: false } }),
  }),
  Object.freeze({
    familyId: "proof-authority",
    instructions: "Bind executable proof vectors to every decision-table row plus missing-field and non-boolean negative controls. Expected valid dispositions must exactly match decision authority.",
    schema: object({ proofId: id, validVectors: { type: "array", minItems: 1, items: object({ vectorId: id, observations: { type: "array", minItems: 1, items: object({ field: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" }, value: { type: "boolean" } }) }, expectedDisposition: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" } }) }, invalidVectors: { type: "array", minItems: 2, items: object({ vectorId: id, inputJson: { type: "string", minLength: 2 }, expectedFindingCode: { type: "string", pattern: "^[A-Z][A-Z0-9_]*$" }, expectedField: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" } }) }, repeatedExecutionMustMatch: { const: true } }),
  }),
  Object.freeze({
    familyId: "projection-authority",
    instructions: "Declare only the thin signed TypeScript projection boundary. The body must invoke the semantic operation through context.edges; decision cases remain contract data.",
    schema: object({ projectionId: { type: "string", pattern: "^[a-z][a-z0-9-]*$" }, artifactPath: { type: "string", pattern: "^capabilities/[A-Za-z0-9._/-]+\\.ts$" }, contextType: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" }, resultType: { type: "string", pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$" } }),
  }),
]);

function sha256(value) { return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`; }
function receipt(response) {
  return Object.freeze({
    familyId: null,
    requestId: response.requestId ?? null,
    invocationId: response.invocationId ?? null,
    providerAuthorityId: response.resolvedAuthority?.providerAuthorityId ?? null,
    resolvedModel: response.resolvedAuthority?.resolvedModel ?? null,
    requestHash: response.proof?.requestHash ?? null,
    responseHash: response.proof?.responseHash ?? null,
  });
}

function modelRequest({ family, subject, intentText, featureId, requestId }) {
  return {
    "$schema": "../authority/model-request.schema.v1.json",
    requestId,
    providerAuthorityId: "primary-cognitive-provider",
    modelAlias: "instruction-capable-model",
    interaction: { mode: "structured-generation", messages: [
      { role: "system", content: `You are the ${family.familyId} worker in a governed capability conveyor. ${family.instructions} The evolving semantic subject is authoritative upstream context. Return only your family's JSON contribution. Never claim admission, proof, or implementation.` },
      { role: "user", content: `Required feature ID: ${featureId}\n\nConfirmed intent:\n${intentText}\n\nCurrent semantic subject:\n${JSON.stringify(subject)}` },
    ] },
    responsePolicy: { format: "json", maximumOutputTokens: 8192, temperature: 0, schema: family.schema },
    executionPolicy: { timeoutMilliseconds: 60000, attemptAuthority: { maximumAuthorizedAttempts: 3, continuationRule: "continue-while-provider-reports-transient-failure" }, providerSubstitution: { allowed: false } },
    evidencePolicy: { captureRequestHash: true, captureResponseHash: true, captureResolvedProvider: true, captureResolvedModel: true, captureTokenUsage: true, captureTiming: true },
  };
}

function stableKey(value) { return JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))); }
function observationsAsObject(observations) { return Object.fromEntries((observations ?? []).map((entry) => [entry.field, entry.value])); }
function syntaxId(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, ""); }
function artifactStem(value) { return syntaxId(String(value).replace(/([a-z0-9])([A-Z])/gu, "$1-$2")); }
function typeName(value) { return String(value).split(/[^A-Za-z0-9]+/u).filter(Boolean).map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join(""); }

function validatesFamilyContribution(subject, familyId, requiredFeatureId) {
  const family = subject.families;
  const findings = [];
  if (familyId === "feature-authority" && family[familyId]?.featureId !== requiredFeatureId) findings.push("FEATURE_ID_CHANGED");
  if (familyId === "scenario-authority" && !idPattern.test(family[familyId]?.scenarioId ?? "")) findings.push("SCENARIO_ID_INVALID");
  if (familyId === "responsibility-authority") {
    if (!identifierPattern.test(family[familyId]?.bodyName ?? "")) findings.push("BODY_NAME_INVALID");
  }
  const fieldNames = (family["input-authority"]?.fields ?? []).map((field) => field.name);
  if (familyId === "input-authority" && new Set(fieldNames).size !== fieldNames.length) findings.push("INPUT_FIELDS_DUPLICATE");
  if (familyId === "decision-authority") {
    const cases = family[familyId]?.cases ?? [];
    const expectedRows = 2 ** fieldNames.length;
    if (cases.length !== expectedRows) findings.push(`DECISION_TABLE_NOT_TOTAL:${cases.length}/${expectedRows}`);
    const observed = new Set();
    for (const entry of cases) {
      const when = observationsAsObject(entry.observations);
      const exact = Object.fromEntries(fieldNames.map((name) => [name, when[name]]));
      if ((entry.observations?.length ?? 0) !== fieldNames.length || stableKey(when) !== stableKey(exact)) findings.push(`${entry.caseId}:DECISION_INPUTS_MISMATCH`);
      if (fieldNames.some((name) => typeof when[name] !== "boolean")) findings.push(`${entry.caseId}:DECISION_INPUT_NOT_BOOLEAN`);
      const key = stableKey(when);
      if (observed.has(key)) findings.push(`${entry.caseId}:DUPLICATE_DECISION_ROW`);
      observed.add(key);
    }
  }
  if (familyId === "result-authority") {
    const expected = [...new Set((family["decision-authority"]?.cases ?? []).map((entry) => entry.disposition))].sort();
    const actual = [...(family[familyId]?.dispositions ?? [])].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) findings.push("RESULT_DISPOSITIONS_MISMATCH");
  }
  if (familyId === "proof-authority") {
    const proof = family[familyId];
    const decision = family["decision-authority"];
    const failure = family["failure-authority"];
    const proofRows = new Map((proof?.validVectors ?? []).map((vector) => [stableKey(observationsAsObject(vector.observations)), vector.expectedDisposition]));
    for (const entry of decision?.cases ?? []) if (proofRows.get(stableKey(observationsAsObject(entry.observations))) !== entry.disposition) findings.push(`${entry.caseId}:PROOF_VECTOR_MISSING_OR_WRONG`);
    if ((proof?.validVectors?.length ?? 0) !== (decision?.cases?.length ?? 0)) findings.push("PROOF_VALID_VECTOR_COUNT_MISMATCH");
    for (const name of fieldNames) {
      if (!(proof?.invalidVectors ?? []).some((vector) => vector.expectedField === name && vector.expectedFindingCode === failure?.missingFieldCode)) findings.push(`${name}:MISSING_FIELD_PROOF_REQUIRED`);
      if (!(proof?.invalidVectors ?? []).some((vector) => vector.expectedField === name && vector.expectedFindingCode === failure?.invalidTypeCode)) findings.push(`${name}:INVALID_TYPE_PROOF_REQUIRED`);
    }
  }
  return findings;
}

export function validatesProjectableCapabilitySubject(subject, requiredFeatureId) {
  const findings = [];
  for (const family of families) if (subject.families?.[family.familyId] === undefined) findings.push(`${family.familyId}:REQUIRED`);
  const feature = subject.families?.["feature-authority"];
  const scenario = subject.families?.["scenario-authority"];
  const responsibility = subject.families?.["responsibility-authority"];
  const input = subject.families?.["input-authority"];
  const decision = subject.families?.["decision-authority"];
  const result = subject.families?.["result-authority"];
  const failure = subject.families?.["failure-authority"];
  const proof = subject.families?.["proof-authority"];
  if (feature?.featureId !== requiredFeatureId) findings.push("FEATURE_ID_CHANGED");
  if (!idPattern.test(feature?.featureId ?? "")) findings.push("FEATURE_ID_INVALID");
  if (!idPattern.test(scenario?.scenarioId ?? "")) findings.push("SCENARIO_ID_INVALID");
  if (!identifierPattern.test(responsibility?.bodyName ?? "")) findings.push("BODY_NAME_INVALID");
  const fields = input?.fields ?? [];
  const fieldNames = fields.map((field) => field.name);
  if (new Set(fieldNames).size !== fieldNames.length) findings.push("INPUT_FIELDS_DUPLICATE");
  const expectedRows = 2 ** fieldNames.length;
  if ((decision?.cases?.length ?? 0) !== expectedRows) findings.push(`DECISION_TABLE_NOT_TOTAL:${decision?.cases?.length ?? 0}/${expectedRows}`);
  const observedRows = new Set();
  for (const entry of decision?.cases ?? []) {
    const when = observationsAsObject(entry.observations);
    if ((entry.observations?.length ?? 0) !== fieldNames.length || stableKey(when) !== stableKey(Object.fromEntries(fieldNames.map((name) => [name, when[name]])))) findings.push(`${entry.caseId}:DECISION_INPUTS_MISMATCH`);
    if (fieldNames.some((name) => typeof when[name] !== "boolean")) findings.push(`${entry.caseId}:DECISION_INPUT_NOT_BOOLEAN`);
    const key = stableKey(when);
    if (observedRows.has(key)) findings.push(`${entry.caseId}:DUPLICATE_DECISION_ROW`);
    observedRows.add(key);
  }
  const decisionDispositions = [...new Set((decision?.cases ?? []).map((entry) => entry.disposition))].sort();
  const resultDispositions = [...(result?.dispositions ?? [])].sort();
  if (JSON.stringify(decisionDispositions) !== JSON.stringify(resultDispositions)) findings.push("RESULT_DISPOSITIONS_MISMATCH");
  const proofRows = new Map((proof?.validVectors ?? []).map((vector) => [stableKey(observationsAsObject(vector.observations)), vector.expectedDisposition]));
  for (const entry of decision?.cases ?? []) if (proofRows.get(stableKey(observationsAsObject(entry.observations))) !== entry.disposition) findings.push(`${entry.caseId}:PROOF_VECTOR_MISSING_OR_WRONG`);
  if ((proof?.validVectors?.length ?? 0) !== expectedRows) findings.push("PROOF_VALID_VECTOR_COUNT_MISMATCH");
  if (failure?.producesDisposition !== false) findings.push("INVALID_INPUT_MUST_NOT_PRODUCE_DISPOSITION");
  for (const name of fieldNames) {
    if (!(proof?.invalidVectors ?? []).some((vector) => vector.expectedField === name && vector.expectedFindingCode === failure?.missingFieldCode)) findings.push(`${name}:MISSING_FIELD_PROOF_REQUIRED`);
    if (!(proof?.invalidVectors ?? []).some((vector) => vector.expectedField === name && vector.expectedFindingCode === failure?.invalidTypeCode)) findings.push(`${name}:INVALID_TYPE_PROOF_REQUIRED`);
  }
  return findings;
}

function compilesProjectableContract(subject) {
  const family = subject.families;
  const feature = family["feature-authority"];
  const scenario = family["scenario-authority"];
  const obligation = family["obligation-authority"];
  const responsibility = family["responsibility-authority"];
  const input = family["input-authority"];
  const decision = family["decision-authority"];
  const result = family["result-authority"];
  const failure = family["failure-authority"];
  const proof = family["proof-authority"];
  const projection = family["projection-authority"];
  return Object.freeze({
    documentKind: "projectable-family-capability-contract.v1",
    lifecycle: "PROJECTABLE_CONTRACT",
    feature,
    scenario,
    lineage: { featureId: feature.featureId, scenarioId: scenario.scenarioId, obligationId: obligation.obligationId, responsibilityId: responsibility.responsibilityId, semanticOperationId: responsibility.semanticOperationId },
    input: { contractId: input.inputContractId, schema: { type: "object", additionalProperties: false, required: input.fields.map((field) => field.name), properties: Object.fromEntries(input.fields.map((field) => [field.name, { type: "boolean", description: field.description }])) } },
    mechanicAuthorities: { decisionTable: { ...decision, cases: decision.cases.map(({ observations, ...entry }) => ({ ...entry, when: observationsAsObject(observations) })) } },
    result,
    failure,
    proof: { ...proof, repeatedExecutionMustMatch: true, validVectors: proof.validVectors.map(({ observations, ...vector }) => ({ ...vector, input: observationsAsObject(observations) })), invalidVectors: proof.invalidVectors.map(({ inputJson, ...vector }) => ({ ...vector, input: JSON.parse(inputJson) })) },
    projection: { ...projection, projectionId: syntaxId(projection.projectionId), artifactPath: `capabilities/${artifactStem(feature.featureId)}/${artifactStem(responsibility.bodyName)}.ts`, contextType: identifierPattern.test(projection.contextType) ? projection.contextType : `${typeName(feature.featureId)}Context`, resultType: identifierPattern.test(projection.resultType) ? projection.resultType : `${typeName(feature.featureId)}Result`, bodyName: responsibility.bodyName, semanticEdgeId: syntaxId(responsibility.semanticOperationId) },
    familyProvenance: subject.familyProvenance,
  });
}

export async function conveysCapabilityThroughFamilyWorkers({ intentText, featureId, invoke = invokesLiveModelInference, requestId = `family-conveyor-${randomUUID()}` }) {
  if (typeof intentText !== "string" || intentText.trim().length === 0) throw new Error("Feature intent text is required.");
  if (!idPattern.test(featureId ?? "")) throw new Error(`Feature ID is invalid: ${featureId}`);
  const subject = { documentKind: "family-capability-semantic-subject.v1", intentDigest: sha256(intentText), requiredFeatureId: featureId, families: {}, familyProvenance: [] };
  for (const family of families) {
    let findings = [];
    let contribution;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const request = modelRequest({ family, subject, intentText, featureId, requestId: `${requestId}-${family.familyId}-attempt-${attempt}` });
      if (attempt > 1) request.interaction.messages.push({ role: "user", content: `Your previous family contribution was rejected. Return a complete corrected contribution, not an explanation.\n\nDeterministic findings:\n${findings.join("\n")}\n\nRejected contribution:\n${JSON.stringify(contribution)}` });
      const response = await invoke(request);
      if (response.disposition !== "MODEL_RESPONSE_OBTAINED") throw new Error(`${family.familyId} failed: ${response.disposition}`);
      contribution = response.result?.structuredValue;
      if (contribution === null || typeof contribution !== "object" || Array.isArray(contribution)) throw new Error(`${family.familyId} returned no structured contribution.`);
      subject.families[family.familyId] = contribution;
      findings = validatesFamilyContribution(subject, family.familyId, featureId);
      subject.familyProvenance.push(Object.freeze({ ...receipt(response), familyId: family.familyId, attempt, accepted: findings.length === 0, findings: Object.freeze([...findings]) }));
      if (findings.length === 0) break;
    }
    if (findings.length > 0) throw new Error(`${family.familyId} rejected after 3 attempts: ${findings.join(", ")}`);
  }
  const findings = validatesProjectableCapabilitySubject(subject, featureId);
  if (findings.length > 0) throw new Error(`Family conveyor contract rejected: ${findings.join(", ")}`);
  return Object.freeze({ subject: Object.freeze(subject), contract: compilesProjectableContract(subject), findings: Object.freeze([]) });
}

async function exists(target) { try { await stat(target); return true; } catch (error) { if (error?.code === "ENOENT") return false; throw error; } }

export async function writesFamilyConveyorProjectionInput(result, outputDirectory) {
  const outputRoot = path.resolve(outputDirectory);
  if (await exists(outputRoot)) throw new Error(`Output directory already exists: ${outputRoot}`);
  const staging = `${outputRoot}.staging-${randomUUID()}`;
  const contract = result.contract;
  const request = {
    contract: { schemaId, schemaVersion: "1.0.0", schemaDigest },
    projectionId: contract.projection.projectionId,
    targetLanguage: "typescript",
    artifact: { relativePath: contract.projection.artifactPath },
    lineage: { featureId: syntaxId(contract.lineage.featureId), scenarioId: syntaxId(contract.lineage.scenarioId), obligationId: syntaxId(contract.lineage.obligationId), responsibilityId: syntaxId(contract.lineage.responsibilityId), signalId: syntaxId(contract.result.resultContractId) },
    function: { identity: contract.lineage.responsibilityId, name: contract.projection.bodyName, contextParameter: { name: "context", typeReference: contract.projection.contextType }, resultTypeReference: contract.projection.resultType, semanticEdgeId: contract.projection.semanticEdgeId, awaited: true },
  };
  const authorityPath = path.join(staging, "authority", "projectable-capability.contract.json");
  const requestPath = path.join(staging, "projection-authority", `${contract.projection.projectionId}.json`);
  try {
    await mkdir(path.dirname(authorityPath), { recursive: true });
    await mkdir(path.dirname(requestPath), { recursive: true });
    await writeFile(authorityPath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
    await writeFile(requestPath, `${JSON.stringify(request, null, 2)}\n`, "utf8");
    await writeFile(path.join(staging, "authority", "semantic-subject.json"), `${JSON.stringify(result.subject, null, 2)}\n`, "utf8");
    await mkdir(path.dirname(outputRoot), { recursive: true });
    await rename(staging, outputRoot);
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
  return Object.freeze({ outputRoot, contractPath: path.join(outputRoot, "authority", "projectable-capability.contract.json"), projectionAuthorityPath: path.join(outputRoot, "projection-authority", `${contract.projection.projectionId}.json`) });
}

export async function readsIntentText({ intent, intentFile }) {
  if (typeof intent === "string" && intent.trim().length > 0) return intent.trim();
  if (typeof intentFile === "string") return (await readFile(path.resolve(intentFile), "utf8")).trim();
  throw new Error("Provide feature intent with --intent or --intent-file.");
}

export const capabilityConveyorFamilies = families.map(({ familyId }) => familyId);
