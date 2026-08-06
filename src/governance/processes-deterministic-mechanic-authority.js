import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { deterministicMechanicLowererVersion, deterministicallyLowerableMechanicKinds, lowersDeterministicMechanicAuthority } from "./lowers-deterministic-mechanic-authority.js";
import { validatesDeterministicMechanicAuthority } from "./validates-deterministic-mechanic-authority.js";

export async function processesDeterministicMechanicAuthorityBatch({
  rootId,
  workspaceRoot,
  mechanicKind = "branch",
  mechanicOccurrenceId = null,
  limit = 100,
  admit = false,
  connection,
  candidateQuery,
  authorityAdmitter,
  attemptRecorder = null,
  retryRejected = false,
} = {}) {
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof candidateQuery !== "function") throw new Error("candidateQuery is required.");
  if (admit && typeof authorityAdmitter !== "function") throw new Error("authorityAdmitter is required when admit is true.");
  if (mechanicKind !== "all" && !deterministicallyLowerableMechanicKinds.includes(mechanicKind)) throw new Error(`Unsupported mechanic kind '${mechanicKind}'.`);
  const root = path.resolve(workspaceRoot ?? process.cwd());
  const candidates = await candidateQuery({ rootId, mechanicKind, mechanicOccurrenceId, limit, lowererVersion: deterministicMechanicLowererVersion, retryRejected, connection });
  const projected = [];
  const rejected = [];
  const admissions = [];
  const attemptPersistenceFailures = [];

  for (const candidate of candidates) {
    try {
      if (!deterministicallyLowerableMechanicKinds.includes(candidate.mechanicKind)) throw codedError("CANDIDATE_MECHANIC_KIND_UNSUPPORTED", `Candidate mechanic kind '${candidate.mechanicKind}' is unsupported.`, `${candidate.mechanicKind}-authority-lowerer`);
      if (mechanicKind !== "all" && candidate.mechanicKind !== mechanicKind) throw codedError("CANDIDATE_MECHANIC_KIND_MISMATCH", `Candidate mechanic kind '${candidate.mechanicKind}' does not match requested kind '${mechanicKind}'.`, "candidate-query-mechanic-kind-integrity");
      const sourcePath = resolvesContainedPath(root, candidate.artifactId);
      const content = await readFile(sourcePath);
      const actualDigest = `sha256:${createHash("sha256").update(content).digest("hex")}`;
      if (actualDigest !== candidate.artifactDigest) {
        throw codedError("SOURCE_ARTIFACT_DIGEST_MISMATCH", `Current bytes for '${candidate.artifactId}' do not match ${candidate.artifactDigest}.`, "refresh-repository-image-or-workspace");
      }
      const result = lowersDeterministicMechanicAuthority({
        ...candidate,
        sourceText: content.toString("utf8"),
      });
      await validatesDeterministicMechanicAuthority(result.authorityData, result.mechanicKind, { mechanicOccurrenceId: result.mechanicOccurrenceId });
      projected.push(result);
      if (admit) {
        admissions.push(await authorityAdmitter({
          rootId,
          mechanicOccurrenceId: result.mechanicOccurrenceId,
          mechanicKind: result.mechanicKind,
          lowererVersion: result.lowererVersion,
          authorityData: result.authorityData,
          expectedAnalysisDigest: candidate.executionAnalysisDigest,
          expectedArtifactDigest: candidate.artifactDigest,
          connection,
        }));
      } else if (typeof attemptRecorder === "function") {
        await recordsAttempt(attemptRecorder, buildsAttemptRequest(candidate, {
          rootId,
          loweringDisposition: "DETERMINISTIC_AUTHORITY_PROJECTED",
          authorityData: result.authorityData,
          mode: "DRY_RUN",
          connection,
        }), attemptPersistenceFailures);
      }
    } catch (error) {
      const rejection = Object.freeze({
        mechanicOccurrenceId: candidate.mechanicOccurrenceId,
        artifactId: candidate.artifactId,
        code: error?.code ?? "DETERMINISTIC_LOWERING_FAILED",
        requiredPrimitive: error?.requiredPrimitive ?? "deterministic-lowering-investigation",
        message: error instanceof Error ? error.message : String(error),
      });
      rejected.push(rejection);
      if (typeof attemptRecorder === "function") {
        await recordsAttempt(attemptRecorder, buildsAttemptRequest(candidate, {
          rootId,
          loweringDisposition: "DETERMINISTIC_AUTHORITY_REJECTED",
          rejectionReason: rejection.code,
          requiredPrimitive: rejection.requiredPrimitive,
          message: rejection.message,
          mode: admit ? "ADMIT" : "DRY_RUN",
          connection,
        }), attemptPersistenceFailures);
      }
    }
  }

  return deeplyFreezes({
    disposition: attemptPersistenceFailures.length > 0
      ? "DETERMINISTIC_MECHANIC_AUTHORITY_BATCH_ATTEMPT_PERSISTENCE_FAILED"
      : rejected.length === 0 ? "DETERMINISTIC_MECHANIC_AUTHORITY_BATCH_PROJECTED" : "DETERMINISTIC_MECHANIC_AUTHORITY_BATCH_PARTIAL",
    rootId,
    mechanicKind,
    mode: admit ? "ADMIT" : "DRY_RUN",
    candidateCount: candidates.length,
    projectedCount: projected.length,
    rejectedCount: rejected.length,
    admittedCount: admissions.length,
    attemptPersistenceFailureCount: attemptPersistenceFailures.length,
    projected,
    rejected,
    admissions,
    attemptPersistenceFailures,
  });
}

async function recordsAttempt(attemptRecorder, request, failures) {
  try {
    await attemptRecorder(request);
  } catch (error) {
    failures.push(Object.freeze({
      mechanicOccurrenceId: request.mechanicOccurrenceId,
      code: "LOWERING_ATTEMPT_PERSISTENCE_FAILED",
      message: error instanceof Error ? error.message : String(error),
    }));
  }
}

function buildsAttemptRequest(candidate, values) {
  return {
    rootId: values.rootId ?? candidate.rootId,
    mechanicOccurrenceId: candidate.mechanicOccurrenceId,
    mechanicKind: candidate.mechanicKind,
    artifactId: candidate.artifactId,
    expectedAnalysisDigest: candidate.executionAnalysisDigest,
    expectedArtifactDigest: candidate.artifactDigest,
    lowererVersion: deterministicMechanicLowererVersion,
    ...values,
  };
}

function resolvesContainedPath(root, relativePath) {
  if (typeof relativePath !== "string" || relativePath.length === 0 || path.isAbsolute(relativePath)) {
    throw codedError("INVALID_ARTIFACT_PATH", `Invalid repository artifact path '${relativePath}'.`, "repository-contained-artifact-path");
  }
  const resolved = path.resolve(root, ...relativePath.replaceAll("\\", "/").split("/"));
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw codedError("INVALID_ARTIFACT_PATH", `Artifact path '${relativePath}' escapes the workspace.`, "repository-contained-artifact-path");
  return resolved;
}

function codedError(code, message, requiredPrimitive) {
  const error = new Error(message);
  error.code = code;
  error.requiredPrimitive = requiredPrimitive;
  return error;
}

function deeplyFreezes(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deeplyFreezes(child);
  return Object.freeze(value);
}
