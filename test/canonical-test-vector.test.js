import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { executesCanonicalTestVector, projectsVitestArtifact } from "../src/canonical-test-vector.js";

const expectedSignal = { signalId: "mechanic-authority-family-classification", values: [{ input: "branch", output: "decision-authority" }, { input: "not-a-real-mechanic", output: null }] };

test("projects an observation-only Vitest body and evaluates expectation independently", async () => {
  const root=await mkdtemp(path.join(os.tmpdir(),"source-facts-vector-"));
  try {
    await mkdir(path.join(root,"src","governance"),{recursive:true});
    await writeFile(path.join(root,"src","governance","mechanic-authority-families.js"),`export const resolvesAuthorityFamily=(value)=>value==="branch"?"decision-authority":null;\n`,`utf8`);
    const image=await capturesRepositoryImage({workspaceRoot:root,rootId:"fixture-root"});
    const authority={rootId:"fixture-root",repositoryImageDigest:image.imageDigest,testClosureSealDigest:"sha256:closure",testVectorId:"fixture-vector",scenarioId:"fixture-scenario",fixture:{fixture:{inputs:["branch","not-a-real-mechanic"]},authorityDigest:"sha256:fixture"},execution:{modulePath:"src/governance/mechanic-authority-families.js",exportName:"resolvesAuthorityFamily",invocationKind:"map-single-argument"},expectation:{signalId:expectedSignal.signalId,expectation:expectedSignal},projectionProfile:{projectionProfileId:"vitest.v1",profileDigest:"sha256:profile"},proofRequirements:[{proofRequirementId:"shape",requirementKind:"observed-signal-shape"},{proofRequirementId:"negative",requirementKind:"negative-control"}]};
    const projection=projectsVitestArtifact(authority);
    assert.doesNotMatch(projection.source,/decision-authority/u);
    const result=await executesCanonicalTestVector({authority,image});
    assert.equal(result.conformanceDisposition,"CANONICAL_EXPECTATION_CONFORMS");
    assert.deepEqual(result.observedSignal,expectedSignal);
    assert.ok(result.requirementResults.every((row)=>row.passed));
    const changedExpectation={...authority,expectation:{...authority.expectation,expectation:{...expectedSignal,values:[{input:"branch",output:"wrong-authority"},{input:"not-a-real-mechanic",output:null}]}}};
    const mismatch=await executesCanonicalTestVector({authority:changedExpectation,image});
    assert.equal(mismatch.projectedTestArtifactDigest,result.projectedTestArtifactDigest);
    assert.equal(mismatch.conformanceDisposition,"CANONICAL_EXPECTATION_MISMATCH");
  } finally {await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:50});}
});
