import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { mkdir, mkdtemp, readFile, rm, rmdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifiesRepositoryImage } from "./repository-image.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const digest = (value) => `sha256:${createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value), "utf8").digest("hex")}`;

export function projectsVitestArtifact(authority) {
  if (authority?.projectionProfile?.projectionProfileId !== "vitest.v1") throw new Error("vitest.v1 authority is required.");
  if (authority.execution.invocationKind !== "map-single-argument") throw new Error(`Unsupported invocation kind '${authority.execution.invocationKind}'.`);
  const source = `import { test } from "vitest";
import { ${authority.execution.exportName} } from "./subject.mjs";

const fixture = ${JSON.stringify(authority.fixture.fixture)};

test(${JSON.stringify(authority.testVectorId)}, () => {
  const observedSignal = {
    signalId: ${JSON.stringify(authority.expectation.signalId)},
    values: fixture.inputs.map((input) => ({ input, output: ${authority.execution.exportName}(input) })),
  };
  process.stdout.write("SOURCE_FACTS_OBSERVED:" + Buffer.from(JSON.stringify(observedSignal), "utf8").toString("base64") + "\\n");
});
`;
  return Object.freeze({ source, artifactDigest: digest(source), targetProfileDigest: authority.projectionProfile.profileDigest });
}

export async function executesCanonicalTestVector({ authority, image } = {}) {
  verifiesRepositoryImage(image);
  if (authority.rootId !== image.rootId || authority.repositoryImageDigest !== image.imageDigest) throw new Error("Test authority does not match the current repository image.");
  const subject = image.artifacts.find((artifact) => artifact.relativePath.replaceAll("\\", "/") === authority.execution.modulePath);
  if (!subject) throw new Error(`Execution subject '${authority.execution.modulePath}' is absent from the SQL repository image.`);
  const projection = projectsVitestArtifact(authority);
  const tempParent = path.join(repositoryRoot, ".tmp");
  await mkdir(tempParent, { recursive: true });
  const executionRoot = await mkdtemp(path.join(tempParent, "canonical-test-"));
  const projectedPath = path.join(executionRoot, "projected.test.mjs");
  const subjectPath = path.join(executionRoot, "subject.mjs");
  const startedAtUtc = new Date().toISOString();
  try {
    await Promise.all([writeFile(projectedPath, projection.source, "utf8"), writeFile(subjectPath, Buffer.from(subject.contentBase64, "base64"))]);
    const vitestPackage = JSON.parse(await readFile(path.join(repositoryRoot, "node_modules", "vitest", "package.json"), "utf8"));
    const commandArgs = [path.join(repositoryRoot, "node_modules", "vitest", "vitest.mjs"), "run", projectedPath, "--reporter=default"];
    const runtimePlan = { nodeVersion: process.version, vitestVersion: vitestPackage.version, command: "vitest run <ephemeral-projected-test> --reporter=default" };
    const execution = await runsProcess(process.execPath, commandArgs, repositoryRoot);
    const marker = /SOURCE_FACTS_OBSERVED:([A-Za-z0-9+/=]+)/u.exec(`${execution.stdout}\n${execution.stderr}`);
    if (!marker) throw new Error(`Projected test emitted no observed signal. ${(execution.stderr || execution.stdout).trim()}`);
    const observedSignal = JSON.parse(Buffer.from(marker[1], "base64").toString("utf8"));
    const expectedSignal = authority.expectation.expectation;
    const requirementResults = authority.proofRequirements.map((requirement) => evaluatesRequirement(requirement, observedSignal, expectedSignal));
    const conforms = execution.exitCode === 0 && isDeepStrictEqual(observedSignal, expectedSignal) && requirementResults.every((row) => row.passed);
    const completedAtUtc = new Date().toISOString();
    const result = {
      rootId: authority.rootId, testVectorId: authority.testVectorId, testClosureSealDigest: authority.testClosureSealDigest,
      testCommand: runtimePlan.command, startedAtUtc, completedAtUtc,
      executionDisposition: execution.exitCode === 0 ? "PROJECTED_TEST_EXECUTION_COMPLETED" : "PROJECTED_TEST_EXECUTION_FAILED",
      conformanceDisposition: conforms ? "CANONICAL_EXPECTATION_CONFORMS" : "CANONICAL_EXPECTATION_MISMATCH",
      projectedTestArtifactDigest: projection.artifactDigest, projectionProfileDigest: projection.targetProfileDigest,
      fixtureDigest: authority.fixture.authorityDigest, runtimePlanDigest: digest(runtimePlan), outputDigest: digest(observedSignal),
      observedSignal, expectedSignal, requirementResults,
    };
    result.testRunId = digest(result);
    return Object.freeze(result);
  } finally {
    await rm(executionRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
    try { await rmdir(tempParent); } catch (error) { if (!['ENOTEMPTY', 'ENOENT'].includes(error?.code)) throw error; }
  }
}

function evaluatesRequirement(requirement, observed, expected) {
  if (requirement.requirementKind === "observed-signal-shape") return { proofRequirementId: requirement.proofRequirementId, passed: observed.values?.length === expected.values?.length };
  if (requirement.requirementKind === "negative-control") return { proofRequirementId: requirement.proofRequirementId, passed: observed.values?.some((row) => row.input === "not-a-real-mechanic" && row.output === null) };
  return { proofRequirementId: requirement.proofRequirementId, passed: false };
}

function runsProcess(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true, env: { ...process.env, NO_COLOR: "1" } });
    let stdout=""; let stderr=""; child.stdout.on("data", (chunk) => { stdout += chunk; }); child.stderr.on("data", (chunk) => { stderr += chunk; }); child.on("error", reject);
    child.on("close", (exitCode) => resolve({ exitCode, stdout, stderr }));
  });
}
