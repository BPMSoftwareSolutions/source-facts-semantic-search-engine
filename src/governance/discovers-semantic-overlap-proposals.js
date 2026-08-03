import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

const ignoredDirectories = Object.freeze(new Set([".git", "node_modules", "dist", "release", "build"]));
const semanticOverlapProposalBatchKind = "semantic-overlap-proposal-batch.v1";

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
 * Scans a directory (default: reviews/, deliberately outside contracts/) for
 * agent-inferred semantic-overlap proposal batches. These are never authority
 * -- discoversAuthorityDocuments never looks here, and this reader never
 * feeds projectsSelfGovernanceReport's governed/coverage counts. It exists
 * only so the report can show what has been inferred and reviewed, alongside
 * the deterministic findings, without conflating the two: everything surfaced
 * from here keeps its own lifecycle field (INFERRED_NOT_ADMITTED or whatever
 * a future review records) rather than being folded into governance state.
 */
export async function discoversSemanticOverlapProposalBatches(reviewsDir, { relativeTo = reviewsDir } = {}) {
  const jsonFiles = await collectsJsonFiles(path.resolve(reviewsDir));
  const batches = [];
  for (const filePath of jsonFiles) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (parsed === null || typeof parsed !== "object" || parsed.documentKind !== semanticOverlapProposalBatchKind) continue;
    batches.push({ filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"), document: parsed });
  }
  return batches.sort((left, right) => left.filePath.localeCompare(right.filePath));
}

export { semanticOverlapProposalBatchKind };
