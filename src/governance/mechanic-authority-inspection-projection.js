import { createHash } from "node:crypto";
import { validatesDeterministicMechanicAuthority } from "./validates-deterministic-mechanic-authority.js";

export async function projectsMechanicAuthorityInspectionProjection({ rootId, result } = {}) {
  requiresString("rootId", rootId);
  if (result === null || typeof result !== "object") throw new Error("result is required.");
  for (const key of ["mechanicOccurrenceId", "mechanicKind", "artifactId", "artifactDigest", "executionAnalysisDigest", "lowererVersion"]) {
    requiresString(`result.${key}`, result[key]);
  }
  await validatesDeterministicMechanicAuthority(result.authorityData, result.mechanicKind, { mechanicOccurrenceId: result.mechanicOccurrenceId });
  return deeplyFreezes({
    documentKind: "mechanic-authority-inspection-projection.v1",
    authorityDisposition: "NON_AUTHORITATIVE_INSPECTION_PROJECTION",
    rootId,
    mechanicOccurrenceId: result.mechanicOccurrenceId,
    mechanicKind: result.mechanicKind,
    artifactId: result.artifactId,
    artifactDigest: result.artifactDigest,
    executionAnalysisDigest: result.executionAnalysisDigest,
    lowererVersion: result.lowererVersion,
    authorityDigest: hashes(result.authorityData),
    authorityData: result.authorityData,
  });
}

export async function validatesMechanicAuthorityInspectionProjection(projection) {
  if (projection === null || typeof projection !== "object" || Array.isArray(projection)) throw new Error("Mechanic authority inspection projection must be an object.");
  if (projection.documentKind !== "mechanic-authority-inspection-projection.v1"
    || projection.authorityDisposition !== "NON_AUTHORITATIVE_INSPECTION_PROJECTION") {
    throw new Error("Authority files must be typed non-authoritative inspection projections; raw authority JSON is not admissible.");
  }
  for (const key of ["rootId", "mechanicOccurrenceId", "mechanicKind", "artifactId", "artifactDigest", "executionAnalysisDigest", "lowererVersion", "authorityDigest"]) {
    requiresString(key, projection[key]);
  }
  await validatesDeterministicMechanicAuthority(projection.authorityData, projection.mechanicKind, { mechanicOccurrenceId: projection.mechanicOccurrenceId });
  if (hashes(projection.authorityData) !== projection.authorityDigest) throw new Error("Mechanic authority inspection projection authority digest mismatch.");
  return projection;
}

function hashes(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;
}

function requiresString(name, value) {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${name} is required.`);
}

function deeplyFreezes(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deeplyFreezes(child);
  return Object.freeze(value);
}
