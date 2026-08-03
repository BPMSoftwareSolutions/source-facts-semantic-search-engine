import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

const ignoredDirectories = Object.freeze(new Set([".git", "node_modules", "dist", "release", "build"]));
const connectiveTissueDraftBatchKind = "connective-tissue-draft-batch.v1";

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
 * Scans healing/ (its own directory, distinct from reviews/ and know-how/)
 * for connective-tissue-draft-batch.v1 files. Nothing here is authority,
 * a binding, or applied source -- every batch's lifecycle stays
 * DRAFT_NOT_ADMITTED until acted on by a capability this repo does not yet
 * have (see generates-connective-tissue.js for why that boundary is
 * deliberate).
 */
export async function discoversHealingDrafts(healingDir, { relativeTo = healingDir } = {}) {
  const jsonFiles = await collectsJsonFiles(path.resolve(healingDir));
  const batches = [];
  for (const filePath of jsonFiles) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (parsed === null || typeof parsed !== "object" || parsed.documentKind !== connectiveTissueDraftBatchKind) continue;
    batches.push({ filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"), document: parsed });
  }
  return batches.sort((left, right) => left.filePath.localeCompare(right.filePath));
}

export { connectiveTissueDraftBatchKind };
