import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  capabilityConveyorFamilies,
  conveysCapabilityThroughFamilyWorkers,
  validatesProjectableCapabilitySubject,
  writesFamilyConveyorProjectionInput,
} from "../src/capability-conveyor/conveys-capability-through-family-workers.js";

const contributions = {
  "feature-authority": { featureId: "source-facts.resolve-direct-wiring-disposition", title: "Resolve direct wiring disposition", actor: "SourceFacts", purpose: "Classify direct wiring evidence", outcome: "One canonical disposition", exclusions: ["transitive traversal"] },
  "scenario-authority": { scenarioId: "source-facts.resolve-direct-wiring-disposition.resolve-valid-pair", title: "Resolve a valid pair", given: ["two boolean observations"], when: "the disposition is requested", then: ["one canonical disposition is returned"] },
  "obligation-authority": { obligationId: "map-direct-wiring-flags", statement: "Every valid pair maps exactly once." },
  "responsibility-authority": { responsibilityId: "resolves-direct-wiring-disposition", statement: "Resolve the direct disposition.", semanticOperationId: "resolve-direct-wiring-disposition", bodyName: "resolvesDirectWiringDisposition" },
  "input-authority": { inputContractId: "direct-wiring-input", fields: [{ name: "hasContractData", type: "boolean", required: true, description: "Contract data observed." }, { name: "hasSemanticRuntimeInvocation", type: "boolean", required: true, description: "Runtime invocation observed." }] },
  "decision-authority": { decisionTableId: "direct-wiring-table", cases: [
    { caseId: "data-and-runtime", observations: [{ field: "hasContractData", value: true }, { field: "hasSemanticRuntimeInvocation", value: true }], disposition: "DIRECT_DATA_AND_RUNTIME" },
    { caseId: "runtime-only", observations: [{ field: "hasContractData", value: false }, { field: "hasSemanticRuntimeInvocation", value: true }], disposition: "RUNTIME_ONLY" },
    { caseId: "data-only", observations: [{ field: "hasContractData", value: true }, { field: "hasSemanticRuntimeInvocation", value: false }], disposition: "DATA_ONLY" },
    { caseId: "none", observations: [{ field: "hasContractData", value: false }, { field: "hasSemanticRuntimeInvocation", value: false }], disposition: "NONE" },
  ] },
  "result-authority": { resultContractId: "direct-wiring-result", resultType: "direct-wiring-disposition", dispositionField: "disposition", dispositions: ["DIRECT_DATA_AND_RUNTIME", "RUNTIME_ONLY", "DATA_ONLY", "NONE"] },
  "failure-authority": { invalidDisposition: "INVALID_DIRECT_WIRING_INPUT", findingContractId: "direct-wiring-finding", missingFieldCode: "FIELD_REQUIRED", invalidTypeCode: "BOOLEAN_REQUIRED", producesDisposition: false },
  "proof-authority": { proofId: "prove-direct-wiring-table", validVectors: [
    { vectorId: "prove-data-and-runtime", observations: [{ field: "hasContractData", value: true }, { field: "hasSemanticRuntimeInvocation", value: true }], expectedDisposition: "DIRECT_DATA_AND_RUNTIME" },
    { vectorId: "prove-runtime-only", observations: [{ field: "hasContractData", value: false }, { field: "hasSemanticRuntimeInvocation", value: true }], expectedDisposition: "RUNTIME_ONLY" },
    { vectorId: "prove-data-only", observations: [{ field: "hasContractData", value: true }, { field: "hasSemanticRuntimeInvocation", value: false }], expectedDisposition: "DATA_ONLY" },
    { vectorId: "prove-none", observations: [{ field: "hasContractData", value: false }, { field: "hasSemanticRuntimeInvocation", value: false }], expectedDisposition: "NONE" },
  ], invalidVectors: [
    { vectorId: "missing-contract-data", inputJson: "{\"hasSemanticRuntimeInvocation\":true}", expectedFindingCode: "FIELD_REQUIRED", expectedField: "hasContractData" },
    { vectorId: "invalid-contract-data", inputJson: "{\"hasContractData\":\"yes\",\"hasSemanticRuntimeInvocation\":true}", expectedFindingCode: "BOOLEAN_REQUIRED", expectedField: "hasContractData" },
    { vectorId: "missing-runtime", inputJson: "{\"hasContractData\":true}", expectedFindingCode: "FIELD_REQUIRED", expectedField: "hasSemanticRuntimeInvocation" },
    { vectorId: "invalid-runtime", inputJson: "{\"hasContractData\":true,\"hasSemanticRuntimeInvocation\":1}", expectedFindingCode: "BOOLEAN_REQUIRED", expectedField: "hasSemanticRuntimeInvocation" },
  ], repeatedExecutionMustMatch: true },
  "projection-authority": { projectionId: "project-direct-wiring-body", artifactPath: "capabilities/resolve-direct-wiring-disposition/resolves-direct-wiring-disposition.ts", contextType: "DirectWiringContext", resultType: "DirectWiringDisposition" },
};

function familyFromRequest(request) {
  return capabilityConveyorFamilies.find((familyId) => request.requestId.includes(`-${familyId}-attempt-`));
}

test("passes one accumulated semantic subject through bounded family workers and compiles a projectable contract", async () => {
  const seen = [];
  const result = await conveysCapabilityThroughFamilyWorkers({
    intentText: "Resolve direct wiring from two booleans.",
    featureId: contributions["feature-authority"].featureId,
    requestId: "test",
    invoke: async (request) => {
      const familyId = familyFromRequest(request);
      seen.push({ familyId, content: request.interaction.messages[1].content });
      return { disposition: "MODEL_RESPONSE_OBTAINED", requestId: request.requestId, invocationId: `invoke-${familyId}`, result: { structuredValue: structuredClone(contributions[familyId]) }, resolvedAuthority: { providerAuthorityId: "fixture", resolvedModel: "fixture-model" }, proof: { requestHash: `sha256:${"1".repeat(64)}`, responseHash: `sha256:${"2".repeat(64)}` } };
    },
  });
  assert.deepEqual(seen.map((entry) => entry.familyId), capabilityConveyorFamilies);
  assert.match(seen.at(-1).content, /DIRECT_DATA_AND_RUNTIME/u);
  assert.equal(result.contract.lifecycle, "PROJECTABLE_CONTRACT");
  assert.equal(result.contract.mechanicAuthorities.decisionTable.cases.length, 4);
  assert.deepEqual(validatesProjectableCapabilitySubject(result.subject, contributions["feature-authority"].featureId), []);

  const root = await mkdtemp(path.join(os.tmpdir(), "family-conveyor-"));
  const output = path.join(root, "projection");
  try {
    const written = await writesFamilyConveyorProjectionInput(result, output);
    const contract = JSON.parse(await readFile(written.contractPath, "utf8"));
    const projection = JSON.parse(await readFile(written.projectionAuthorityPath, "utf8"));
    assert.equal(contract.mechanicAuthorities.decisionTable.cases[2].disposition, "DATA_ONLY");
    assert.equal(projection.function.semanticEdgeId, "resolve-direct-wiring-disposition");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("rejects an incomplete truth table before projection", () => {
  const subject = { families: structuredClone(contributions) };
  subject.families["decision-authority"].cases.pop();
  assert(validatesProjectableCapabilitySubject(subject, contributions["feature-authority"].featureId).some((finding) => finding.startsWith("DECISION_TABLE_NOT_TOTAL")));
});
