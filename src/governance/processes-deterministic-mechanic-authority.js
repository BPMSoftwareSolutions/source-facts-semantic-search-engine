import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { lowersDeterministicMechanicAuthority } from "./lowers-deterministic-mechanic-authority.js";
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
} = {}) {
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof candidateQuery !== "function") throw new Error("candidateQuery is required.");
  if (admit && typeof authorityAdmitter !== "function") throw new Error("authorityAdmitter is required when admit is true.");
  const root = path.resolve(workspaceRoot ?? process.cwd());
  const candidates = await candidateQuery({ rootId, mechanicKind, mechanicOccurrenceId, limit, connection });
  const projected = [];
  const rejected = [];
  const admissions = [];

  for (const candidate of candidates) {
    try {
      const sourcePath = resolvesContainedPath(root, candidate.artifactId);
      const content = await readFile(sourcePath);
      const actualDigest = `sha256:${createHash("sha256").update(content).digest("hex")}`;
      if (actualDigest !== candidate.artifactDigest) {
        throw codedError("SOURCE_ARTIFACT_DIGEST_MISMATCH", `Current bytes for '${candidate.artifactId}' do not match ${candidate.artifactDigest}.`);
      }
      const result = lowersDeterministicMechanicAuthority({
        ...candidate,
        sourceText: content.toString("utf8"),
      });
      await validatesDeterministicMechanicAuthority(result.authorityData, result.mechanicKind);
      projected.push(result);
      if (admit) {
        admissions.push(await authorityAdmitter({
          rootId,
          mechanicOccurrenceId: result.mechanicOccurrenceId,
          authorityData: result.authorityData,
          expectedAnalysisDigest: candidate.executionAnalysisDigest,
          expectedArtifactDigest: candidate.artifactDigest,
          connection,
        }));
      }
    } catch (error) {
      rejected.push(Object.freeze({
        mechanicOccurrenceId: candidate.mechanicOccurrenceId,
        artifactId: candidate.artifactId,
        code: error?.code ?? "DETERMINISTIC_LOWERING_FAILED",
        message: error instanceof Error ? error.message : String(error),
      }));
    }
  }

  return deeplyFreezes({
    disposition: rejected.length === 0 ? "DETERMINISTIC_MECHANIC_AUTHORITY_BATCH_PROJECTED" : "DETERMINISTIC_MECHANIC_AUTHORITY_BATCH_PARTIAL",
    rootId,
    mechanicKind,
    mode: admit ? "ADMIT" : "DRY_RUN",
    candidateCount: candidates.length,
    projectedCount: projected.length,
    rejectedCount: rejected.length,
    admittedCount: admissions.length,
    projected,
    rejected,
    admissions,
  });
}

function resolvesContainedPath(root, relativePath) {
  if (typeof relativePath !== "string" || relativePath.length === 0 || path.isAbsolute(relativePath)) {
    throw codedError("INVALID_ARTIFACT_PATH", `Invalid repository artifact path '${relativePath}'.`);
  }
  const resolved = path.resolve(root, ...relativePath.replaceAll("\\", "/").split("/"));
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw codedError("INVALID_ARTIFACT_PATH", `Artifact path '${relativePath}' escapes the workspace.`);
  return resolved;
}

function codedError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function deeplyFreezes(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deeplyFreezes(child);
  return Object.freeze(value);
}
