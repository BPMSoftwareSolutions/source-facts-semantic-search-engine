import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { projectsRepositoryTestKnowledge, verifiesRepositoryTestKnowledge } from "../src/repository-test-knowledge.js";

test("accounts for test structure from repository image bytes without admitting proof", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-facts-test-knowledge-"));
  try {
    await mkdir(path.join(root, "features"), { recursive: true }); await mkdir(path.join(root, "src"), { recursive: true }); await mkdir(path.join(root, "test"), { recursive: true });
    const intent = { documentKind: "canonical-feature-intent.v1", featureId: "fixture.feature", purpose: "Fixture", lifecycle: "FEATURE_INTENT_ADMITTED", authorityStatus: "FEATURE_LINEAGE_CLOSED", scenarios: [{ scenarioId: "fixture.scenario", responsibilityId: "fixture-responsibility", obligationId: "fixture-obligation", purpose: "Fixture", implementationSymbols: ["doesThing"] }] };
    await writeFile(path.join(root, "features", "fixture.intent.json"), JSON.stringify(intent), "utf8");
    await writeFile(path.join(root, "src", "thing.js"), "export const doesThing = (value) => value;\n", "utf8");
    await writeFile(path.join(root, "test", "thing.test.js"), `import test from "node:test";\nimport assert from "node:assert/strict";\nimport { doesThing } from "../src/thing.js";\ntest("does the thing", () => { const actual = doesThing("value"); assert.equal(actual, "value"); });\n`, "utf8");
    const image = await capturesRepositoryImage({ workspaceRoot: root, rootId: "fixture-root" });
    const analysis = projectsRepositoryTestKnowledge(image, { applicationId: "fixture-app" });
    verifiesRepositoryTestKnowledge(analysis);
    assert.equal(analysis.summary.testArtifacts, 1); assert.equal(analysis.summary.testCases, 1); assert.equal(analysis.summary.assertions, 1);
    assert.equal(analysis.testCases[0].currentPosture, "REGRESSION_CANDIDATE");
    assert.equal(analysis.testCases[0].canonicalBindingDisposition, "UNBOUND_TEST");
    assert.equal(analysis.candidates[0].bindingDisposition, "CANDIDATE_NOT_ADMITTED");
  } finally { await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 }); }
});
