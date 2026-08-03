import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

const ignoredDirectories = Object.freeze(new Set([".git", "node_modules", "dist", "release", "build"]));
const admittedKnowHowKind = "reviewed-engineering-know-how.v1";
const authorityRemediationCandidateKind = "authority-remediation-candidate.v1";

async function collectsJsonFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      files.push(...await collectsJsonFiles(path.join(dir, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

/**
 * Scans know-how/ (deliberately its own directory, distinct from reviews/
 * and contracts/) for admitted know-how records and authority-remediation
 * candidates. Both live here because both are downstream of human admission
 * -- reviews/ holds INFERRED_NOT_ADMITTED proposals a human has not yet
 * acted on; know-how/ holds records where a human already decided the
 * candidate was worth keeping. An authority-remediation candidate is still
 * explicitly not authority (lifecycle CANDIDATE_NOT_AUTHORED) even though it
 * lives in the admitted-knowledge directory -- see
 * projects-authority-remediation-candidate.js.
 */
export async function discoversKnowHowRegistry(knowHowDir, { relativeTo = knowHowDir } = {}) {
  const jsonFiles = await collectsJsonFiles(path.resolve(knowHowDir));
  const admittedKnowHow = [];
  const authorityRemediationCandidates = [];

  for (const filePath of jsonFiles) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (parsed === null || typeof parsed !== "object") continue;
    const relativePath = path.relative(relativeTo, filePath).replaceAll("\\", "/");
    if (parsed.documentKind === admittedKnowHowKind) {
      admittedKnowHow.push({ filePath: relativePath, document: parsed });
    } else if (parsed.documentKind === authorityRemediationCandidateKind) {
      authorityRemediationCandidates.push({ filePath: relativePath, document: parsed });
    }
  }

  return {
    admittedKnowHow: admittedKnowHow.sort((left, right) => left.filePath.localeCompare(right.filePath)),
    authorityRemediationCandidates: authorityRemediationCandidates.sort((left, right) => left.filePath.localeCompare(right.filePath)),
  };
}

export { admittedKnowHowKind, authorityRemediationCandidateKind };
