import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { projectsRepositoryExecutionKnowledge, verifiesRepositoryExecutionKnowledge } from "../src/repository-execution-knowledge.js";

test("derives mechanics and callable reachability from SQL-image-equivalent bytes", async () => {
  const root=await mkdtemp(path.join(os.tmpdir(),"source-facts-execution-fixture-"));
  try {
    await mkdir(path.join(root,"src"),{recursive:true}); await mkdir(path.join(root,"test"),{recursive:true}); await mkdir(path.join(root,"features"),{recursive:true});
    await writeFile(path.join(root,"src","cli.js"),`const command=process.argv[2];\nif(command==="run") runThing();\nexport function runThing(){ return { ok: true }; }\n`,"utf8");
    await writeFile(path.join(root,"test","cli.test.js"),`import test from "node:test"; import assert from "node:assert/strict"; import { runThing } from "../src/cli.js"; test("runs",()=>assert.equal(runThing().ok,true));\n`,"utf8");
    await writeFile(path.join(root,"features","run.feature"),`&feature:fixture.run\nFeature: Run\n&scenario:fixture.run.once\nScenario: Run once\n&given:input\nGiven input\n&when:run\nWhen run\n&then:result\nThen result\n`,"utf8");
    await writeFile(path.join(root,"features","run.intent.json"),JSON.stringify({documentKind:"canonical-feature-intent.v1",featureId:"fixture.run",featureFile:"features/run.feature",featureAnchor:"&feature:fixture.run",purpose:"Run",scenarios:[{scenarioId:"fixture.run.once",scenarioAnchor:"&scenario:fixture.run.once",responsibilityId:"run-thing",obligationId:"run-once",givenId:"input",whenId:"run",thenId:"result",implementationSymbols:["runThing"],purpose:"Run once"}],interfaceRoot:"src/cli.js#runThing",lifecycle:"FEATURE_INTENT_PROPOSED",authorityStatus:"FEATURE_AND_INTERFACE_AUTHORITY_MISSING",createdAt:"2026-08-05T00:00:00Z"}),"utf8");
    const image=await capturesRepositoryImage({workspaceRoot:root,rootId:"fixture-execution"});
    const analysis=await projectsRepositoryExecutionKnowledge(image);
    const repeated=await projectsRepositoryExecutionKnowledge(image);
    verifiesRepositoryExecutionKnowledge(analysis);
    assert.equal(analysis.repositoryImageDigest,image.imageDigest);
    assert.equal(analysis.summary.sourceFiles,2);
    assert.ok(analysis.summary.mechanics>0);
    assert.ok(analysis.summary.commands>0);
    assert.ok(analysis.summary.reachabilityRows>0);
    assert.equal(analysis.analysisDigest,repeated.analysisDigest);
    assert.equal(analysis.report.generatedAtUtc,null);
    assert.ok(analysis.sourceFactIndex.bodyMechanics.some(row=>row.modulePath==="src/cli.js"));
  } finally { await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:50}); }
});
