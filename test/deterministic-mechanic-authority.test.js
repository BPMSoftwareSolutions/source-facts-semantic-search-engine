import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DeterministicMechanicLoweringError, lowersDeterministicMechanicAuthority } from "../src/governance/lowers-deterministic-mechanic-authority.js";
import { processesDeterministicMechanicAuthorityBatch } from "../src/governance/processes-deterministic-mechanic-authority.js";
import { validatesDeterministicMechanicAuthority } from "../src/governance/validates-deterministic-mechanic-authority.js";
import { projectsMechanicAuthorityInspectionProjection, validatesMechanicAuthorityInspectionProjection } from "../src/governance/mechanic-authority-inspection-projection.js";

const branchSource = `async function collect(contractPath, authorities) {\n  if (contractPath !== null) {\n    authorities.push({ contract: await readsJsonFile(contractPath), sourcePath: contractPath });\n  }\n}\n`;

test("deterministically lowers an if branch into normalized authority data", () => {
  const request = { mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(branchSource), sourceText: branchSource, startLine: 2, startColumn: 3 };
  const first = lowersDeterministicMechanicAuthority(request);
  const repeated = lowersDeterministicMechanicAuthority(request);
  assert.deepEqual(first, repeated);
  assert.equal(first.disposition, "DETERMINISTIC_MECHANIC_AUTHORITY_PROJECTED");
  assert.equal(first.authorityData.authorityBasis, "DETERMINISTIC_SYNTAX_LOWERING");
  assert.equal(first.authorityData.syntaxProfile, "typescript-branch-authority.v2");
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

test("fails closed for unknown mechanic families and source locations", () => {
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "unknown", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "run();", startLine: 1, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "MECHANIC_FAMILY_NOT_DETERMINISTICALLY_LOWERABLE",
  );
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "branch", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "if (ok) run();", startLine: 2, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "MECHANIC_SOURCE_NODE_NOT_FOUND",
  );
});

const mechanicFixtures = [
  ["iteration", "for (const item of items) consume(item);", 1, 1, "iteration-authority.v1", "FOR_OF"],
  ["exception-handling", "try { run(); } catch (error) { recover(error); } finally { clean(); }", 1, 1, "failure-observation-authority.v1", "TRY_BOUNDARY"],
  ["throw", "throw new Error(message);", 1, 1, "terminal-disposition-authority.v1", "THROW"],
  ["object-construction", "new Result(value);", 1, 1, "semantic-projection-authority.v1", "CONSTRUCTOR_INVOCATION"],
  ["serialization", "JSON.stringify(value);", 1, 1, "serialization-profile-authority.v1", "JSON.stringify"],
  ["normalization", "normalize(value);", 1, 1, "canonicalization-authority.v1", "SOURCE_OPERATION_DECIDES"],
  ["validation", "validates(value);", 1, 1, "constraint-authority.v1", "CALL_COMPLETED"],
  ["fallback", "const selected = primary ?? secondary;", 1, 18, "alternative-selection-authority.v1", "??"],
  ["retry", "retry(operation, 3);", 1, 1, "retry-policy-authority.v1", 3],
  ["state-mutation", "state.value = next;", 1, 1, "state-transition-authority.v1", "ASSIGNMENT"],
  ["meaning-hidden-in-text", "\"status.ready\";", 1, 1, "text-meaning-authority.v1", "EXACT_TEXT_IDENTITY"],
];

test("deterministically lowers and validates every executable mechanic family", async () => {
  for (const [mechanicKind, sourceText, startLine, startColumn, authorityKind, expectedSemantic] of mechanicFixtures) {
    const mechanicOccurrenceId = `mechanic-${mechanicKind}`;
    const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId, mechanicKind, artifactId: "src/example.js", artifactDigest: digest(sourceText), sourceText, startLine, startColumn });
    assert.equal(result.authorityData.authorityKind, authorityKind, mechanicKind);
    assert.equal(result.authorityData.authorityBasis, "DETERMINISTIC_SYNTAX_LOWERING", mechanicKind);
    assert.equal(result.authorityData.syntaxProfile, "typescript-mechanic-authority.v1", mechanicKind);
    assert.equal(result.authorityData.candidateAuthorityId, `candidate-${mechanicOccurrenceId}`, mechanicKind);
    assert.ok(JSON.stringify(result.authorityData).includes(String(expectedSemantic)), mechanicKind);
    await assert.doesNotReject(validatesDeterministicMechanicAuthority(result.authorityData, mechanicKind, { mechanicOccurrenceId }), mechanicKind);
    assert.deepEqual(result, lowersDeterministicMechanicAuthority({ mechanicOccurrenceId, mechanicKind, artifactId: "src/example.js", artifactDigest: digest(sourceText), sourceText, startLine, startColumn }), mechanicKind);
  }
});

test("rejects cross-family authority and malformed family-specific data", async () => {
  const [mechanicKind, sourceText, startLine, startColumn] = mechanicFixtures[0];
  const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "mechanic-iteration", mechanicKind, artifactId: "src/example.js", artifactDigest: digest(sourceText), sourceText, startLine, startColumn });
  await assert.rejects(validatesDeterministicMechanicAuthority(result.authorityData, "retry"), /retry authority kind/u);
  await assert.rejects(validatesDeterministicMechanicAuthority({ ...result.authorityData, arbitrary: true }, mechanicKind), /iteration authority is invalid/u);
});

test("covers common loop, projection, retry, mutation, and text variants", async () => {
  const variants = [
    ["iteration", "for (let index = 0; index < items.length; index++) { if (skip) continue; consume(items[index]); }", 1, 1, "FOR"],
    ["object-construction", "({ value, status: currentStatus, ...rest });", 1, 2, "OBJECT_LITERAL"],
    ["retry", "withRetry(async () => await operation(), options);", 1, 1, "lambda"],
    ["state-mutation", "items.push(value);", 1, 1, "MUTATOR_INVOCATION"],
    ["state-mutation", "count++;", 1, 1, "UPDATE"],
    ["meaning-hidden-in-text", "`status:${status}:ready`;", 1, 1, "templates"],
  ];
  for (const [mechanicKind, sourceText, startLine, startColumn, expected] of variants) {
    const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: `variant-${mechanicKind}-${expected}`, mechanicKind, artifactId: "src/variants.js", artifactDigest: digest(sourceText), sourceText, startLine, startColumn });
    assert.ok(JSON.stringify(result.authorityData).includes(expected), `${mechanicKind}:${expected}`);
    await assert.doesNotReject(validatesDeterministicMechanicAuthority(result.authorityData, mechanicKind));
  }
});

test("rejects side-effecting and dynamically evaluated predicates with precise primitives", () => {
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "branch", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "if (enabled = true) run();", startLine: 1, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "UNSUPPORTED_PREDICATE_OPERATOR" && error.requiredPrimitive === "predicate-operator:=",
  );
  assert.throws(
    () => lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "m", mechanicKind: "branch", artifactId: "src/x.js", artifactDigest: "sha256:x", sourceText: "if (isEnabled()) run();", startLine: 1, startColumn: 1 }),
    (error) => error instanceof DeterministicMechanicLoweringError && error.code === "UNSUPPORTED_PREDICATE_FORM" && error.requiredPrimitive === "predicate-form:CallExpression",
  );
});

test("validates completed deterministic branch authority and its references", async () => {
  const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(branchSource), sourceText: branchSource, startLine: 2, startColumn: 3 });
  await assert.doesNotReject(validatesDeterministicMechanicAuthority(result.authorityData, "branch"));
  await assert.rejects(validatesDeterministicMechanicAuthority({ ...result.authorityData, noMatchDisposition: "UNKNOWN" }, "branch"), /does not resolve to an outcome/u);
  await assert.rejects(
    validatesDeterministicMechanicAuthority({ ...result.authorityData, rules: [{ ...result.authorityData.rules[0], predicate: { arbitrary: true } }] }, "branch"),
    /Deterministic branch authority is invalid/u,
  );
});

test("wraps disk output as a non-authoritative digest-bound inspection projection", async () => {
  const result = lowersDeterministicMechanicAuthority({ mechanicOccurrenceId: "mechanic-1", mechanicKind: "branch", artifactId: "src/example.js", artifactDigest: digest(branchSource), executionAnalysisDigest: digest("analysis"), sourceText: branchSource, startLine: 2, startColumn: 3 });
  const projection = await projectsMechanicAuthorityInspectionProjection({ rootId: "root", result });
  assert.equal(projection.documentKind, "mechanic-authority-inspection-projection.v1");
  assert.equal(projection.authorityDisposition, "NON_AUTHORITATIVE_INSPECTION_PROJECTION");
  await assert.doesNotReject(validatesMechanicAuthorityInspectionProjection(projection));
  await assert.rejects(validatesMechanicAuthorityInspectionProjection(result.authorityData), /raw authority JSON is not admissible/u);
  await assert.rejects(validatesMechanicAuthorityInspectionProjection({ ...projection, authorityDigest: digest("forged") }), /digest mismatch/u);
});

test("batch processing verifies source digests and admits only projected rows", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "deterministic-authority-"));
  try {
    await mkdir(path.join(root, "src"));
    await writeFile(path.join(root, "src", "example.js"), branchSource, "utf8");
    const candidates = [candidate("good", digest(branchSource)), candidate("stale", "sha256:stale")];
    const admitted = [];
    const attempts = [];
    const batch = await processesDeterministicMechanicAuthorityBatch({
      rootId: "root",
      workspaceRoot: root,
      admit: true,
      connection: {},
      candidateQuery: async () => candidates,
      authorityAdmitter: async (request) => { admitted.push(request); return { mechanicOccurrenceId: request.mechanicOccurrenceId, disposition: "MECHANIC_AUTHORITY_ADMITTED" }; },
      attemptRecorder: async (request) => { attempts.push(request); return { disposition: "MECHANIC_AUTHORITY_LOWERING_ATTEMPT_RECORDED" }; },
    });
    assert.equal(batch.projectedCount, 1);
    assert.equal(batch.rejectedCount, 1);
    assert.equal(batch.admittedCount, 1);
    assert.equal(batch.rejected[0].code, "SOURCE_ARTIFACT_DIGEST_MISMATCH");
    assert.equal(admitted[0].mechanicOccurrenceId, "good");
    assert.equal(admitted[0].lowererVersion, "typescript-mechanic-lowerer.v3");
    assert.equal(attempts.length, 1);
    assert.equal(attempts[0].loweringDisposition, "DETERMINISTIC_AUTHORITY_REJECTED");
    assert.equal(attempts[0].rejectionReason, "SOURCE_ARTIFACT_DIGEST_MISMATCH");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

function candidate(mechanicOccurrenceId, artifactDigest) {
  return { mechanicOccurrenceId, mechanicKind: "branch", artifactId: "src/example.js", artifactDigest, executionAnalysisDigest: digest("analysis"), startLine: 2, startColumn: 3, authorityFamily: "decision-authority" };
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
