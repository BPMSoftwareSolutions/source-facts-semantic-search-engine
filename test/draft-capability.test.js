import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  derivesDraftFeatureId,
  draftsCapabilityFromIntent,
  materializesDraftCapabilityPackage,
  validatesDraftCapabilityBlueprint,
} from "../src/draft-capability/drafts-capability.js";

function fixtureBlueprint() {
  return {
    feature: {
      featureId: "product.runtime-compatibility",
      title: "Evaluate system runtime compatibility",
      purpose: "Tell an operator whether the observed runtime satisfies the required minimum.",
    },
    scenarios: [
      {
        scenarioId: "product.runtime-compatibility.reject-below-minimum",
        title: "Reject a runtime below the required minimum",
        given: "a required minimum and an observed runtime version",
        when: "runtime compatibility is evaluated",
        then: "a below-minimum runtime is rejected with an observable reason",
        responsibilityId: "evaluates-minimum-runtime-version",
        obligationId: "reject-runtime-below-required-minimum",
        bodyName: "evaluatesMinimumRuntimeVersion",
        edgeId: "evaluate-minimum-runtime-version",
        semanticSummary: "Compare an observed runtime version with the required minimum and return compatibility.",
        dependencies: ["runtime version observation"],
        effects: ["returns a compatibility result"],
        failureSemantics: ["invalid version syntax remains a draft decision"],
        inputFields: [
          { name: "observedVersion", type: "string", required: true, description: "Observed runtime version." },
          { name: "minimumVersion", type: "string", required: true, description: "Required minimum version." },
        ],
        outputFields: [
          { name: "compatible", type: "boolean", required: true, description: "Whether the runtime is compatible." },
          { name: "reason", type: "string", required: true, description: "Observable evaluation reason." },
        ],
        proof: {
          fixtureDescription: "Observed 18.0.0 with required minimum 20.0.0.",
          expectedOutcome: "The result rejects the observed runtime.",
          remainingSemanticQuestion: "Which version comparison authority should define prerelease ordering?",
        },
      },
    ],
    runtimeProfile: { interactionSurface: "library function", runtimeNotes: ["Node.js ESM"] },
    openQuestions: ["Should invalid versions be rejected or returned as indeterminate?"],
  };
}

test("derives a stable draft feature identity from unstructured intent", () => {
  assert.equal(
    derivesDraftFeatureId("Evaluate system runtime compatibility\nReject runtimes below the minimum."),
    "draft.evaluate-system-runtime-compatibility",
  );
});

test("obtains a complete blueprint through the governed model connector seam", async () => {
  let capturedRequest;
  const blueprint = fixtureBlueprint();
  const draft = await draftsCapabilityFromIntent({
    intentText: "Evaluate system runtime compatibility.",
    featureId: blueprint.feature.featureId,
    invoke: async (request) => {
      capturedRequest = request;
      return {
        disposition: "MODEL_RESPONSE_OBTAINED",
        requestId: request.requestId,
        result: { structuredValue: blueprint },
        resolvedAuthority: { providerAuthorityId: "test", providerKind: "fixture", resolvedModel: "fixture-model" },
        proof: { requestHash: "sha256:request", responseHash: "sha256:response" },
      };
    },
  });

  assert.equal(capturedRequest.interaction.mode, "structured-generation");
  assert.equal(capturedRequest.responsePolicy.schema.required.includes("scenarios"), true);
  assert.equal(draft.lifecycle, "INTENT_CAPTURED");
  assert.equal(draft.blueprint.scenarios[0].bodyName, "evaluatesMinimumRuntimeVersion");
  assert.equal(draft.inference.responseHash, "sha256:response");
});

test("rejects a blueprint whose identity spine drifts", () => {
  const blueprint = fixtureBlueprint();
  blueprint.scenarios[0].bodyName = "not-valid-name!";
  blueprint.scenarios[0].scenarioId = "unrelated.feature.scenario";
  const findings = validatesDraftCapabilityBlueprint(blueprint, blueprint.feature.featureId);
  assert(findings.includes("scenarios[0].bodyName:INVALID_IDENTIFIER"));
  assert(findings.includes("scenarios[0].scenarioId:WRONG_PREFIX"));
});

test("materializes a runnable, explicitly non-admitted capability package", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "draft-capability-test-"));
  const outputRoot = path.join(temporaryRoot, "projected");
  try {
    const draft = {
      documentKind: "draft-capability-blueprint.v1",
      lifecycle: "INTENT_CAPTURED",
      targetPlatform: "node-esm",
      intentText: "Evaluate system runtime compatibility.",
      blueprint: fixtureBlueprint(),
      inference: { resolvedModel: "fixture-model", requestHash: "sha256:request", responseHash: "sha256:response" },
    };
    const result = await materializesDraftCapabilityPackage(draft, outputRoot);
    assert.equal(result.receipt.disposition, "SKELETON_PROJECTED_NOT_ADMITTED");
    assert.equal(result.receipt.proofScope, "identity-and-edge-wiring-only");
    assert.equal(result.manifest.identitySpine[0].edgeId, "evaluate-minimum-runtime-version");

    const contract = JSON.parse(await readFile(path.join(outputRoot, "contracts", "product-runtime-compatibility.governed.contract.draft.json"), "utf8"));
    assert.equal(contract.admissibility, "NOT_ADMISSIBLE");
    assert.deepEqual(contract.excludedClaims, ["semantic-equivalence", "authority-admission", "signature", "release-lock"]);
    const intent = JSON.parse(await readFile(path.join(outputRoot, "features", "product-runtime-compatibility.intent.json"), "utf8"));
    assert.equal(intent.interfaceRoot, "src/product-runtime-compatibility.mjs#executesDraftCapability");

    const generatedTest = spawnSync(process.execPath, ["--test"], { cwd: outputRoot, encoding: "utf8" });
    assert.equal(generatedTest.status, 0, generatedTest.stderr || generatedTest.stdout);

    await assert.rejects(() => materializesDraftCapabilityPackage(draft, outputRoot), /already exists/u);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
