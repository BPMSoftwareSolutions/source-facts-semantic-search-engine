import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DeterministicMechanicLoweringError, lowersDeterministicMechanicAuthority } from "../src/governance/lowers-deterministic-mechanic-authority.js";
import { processesDeterministicMechanicAuthorityBatch } from "../src/governance/processes-deterministic-mechanic-authority.js";
import { validatesDeterministicMechanicAuthority } from "../src/governance/validates-deterministic-mechanic-authority.js";

const branchSource = `async function collect(contractPath, authorities) {\n  if (contractPath !== null) {\n    authorities.push({ contract: await readsJsonFile(contractPath), sourcePath: contractPath });\n  }\n}\n`;

test("deterministically lowers an if branch into normalized authority data", () => {
  const request = { mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(branchSource), sourceText: branchSource, startLine: 2, startColumn: 3 };
  const first = lowersDeterministicMechanicAuthority(request);
  const repeated = lowersDeterministicMechanicAuthority(request);
  assert.deepEqual(first, repeated);
  assert.equal(first.disposition, "DETERMINISTIC_MECHANIC_AUTHORITY_PROJECTED");
  assert.deepEqual(first.authorityData.inputs, ["contractPath"]);
  assert.equal(first.authorityData.rules[0].predicate.operator, "!==");
  assert.equal(first.authorityData.outcomes[0].effects[0].expression.callee.path.join("."), "authorities.push");
  assert.equal(first.authorityData.outcomes[1].continuation, "CONTINUE_AFTER_BRANCH");
  assert.equal(JSON.stringify(first), JSON.stringify(repeated));
});

test("lowers both outcomes of a conditional expression", () => {
  const source = "const result = enabled ? run() : skip();\n";
  const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "mechanic-2", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(source), sourceText: source, startLine: 1, startColumn: 16 });
  assert.deepEqual(result.authorityData.inputs, ["enabled"]);
  assert.equal(result.authorityData.outcomes[0].result.callee.path[0], "run");
  assert.equal(result.authorityData.outcomes[1].result.callee.path[0], "skip");
});

test("fails closed for unsupported mechanic families and source locations", () => {
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "retry", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "retry();", startLine: 1, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "MECHANIC_FAMILY_NOT_DETERMINISTICALLY_LOWERABLE",
  );
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "branch", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "if (ok) run();", startLine: 2, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "MECHANIC_SOURCE_NODE_NOT_FOUND",
  );
});

test("validates completed deterministic branch authority and its references", async () => {
  const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(branchSource), sourceText: branchSource, startLine: 2, startColumn: 3 });
  await assert.doesNotReject(validatesDeterministicMechanicAuthority(result.authorityData, "branch"));
  await assert.rejects(validatesDeterministicMechanicAuthority({ ...result.authorityData, noMatchDisposition: "UNKNOWN" }, "branch"), /does not resolve to an outcome/u);
});

test("batch processing verifies source digests and admits only projected rows", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "deterministic-authority-"));
  try {
    await mkdir(path.join(root, "src"));
    await writeFile(path.join(root, "src", "example.js"), branchSource, "utf8");
    const candidates = [candidate("good", digest(branchSource)), candidate("stale", "sha256:stale")];
    const admitted = [];
    const batch = await processesDeterministicMechanicAuthorityBatch({
      rootId: "root",
      workspaceRoot: root,
      admit: true,
      connection: {},
      candidateQuery: async () => candidates,
      authorityAdmitter: async (request) => { admitted.push(request); return { mechanicOccurrenceId: request.mechanicOccurrenceId, disposition: "MECHANIC_AUTHORITY_ADMITTED" }; },
    });
    assert.equal(batch.projectedCount, 1);
    assert.equal(batch.rejectedCount, 1);
    assert.equal(batch.admittedCount, 1);
    assert.equal(batch.rejected[0].code, "SOURCE_ARTIFACT_DIGEST_MISMATCH");
    assert.equal(admitted[0].mechanicOccurrenceId, "good");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

function candidate(mechanicOccurrenceId, artifactDigest) {
  return { mechanicOccurrenceId, mechanicKind: "branch", artifactId: "src/example.js", artifactDigest, startLine: 2, startColumn: 3, authorityFamily: "decision-authority" };
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
