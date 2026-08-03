import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { detectsAuthorityDocumentKind } from "./detects-authority-document-kind.js";

const ignoredDirectories = Object.freeze(new Set([".git", "node_modules", "dist", "release", "build"]));

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
 * Scans a directory tree for any JSON document detectsAuthorityDocumentKind
 * recognizes as authority-shaped -- not just authority-declaration.v1. This
 * repo has several other live conventions (semantic-projection-authority.v1,
 * semantic-execution-bundle.v1, governed-artifact contracts, projection
 * ledgers); a document the report can't fully verify mechanic-by-mechanic
 * should still be visible, not silently dropped because it isn't the one
 * schema this report knows how to interpret precisely.
 */
export async function discoversAuthorityDocuments(authorityDir, { relativeTo = authorityDir } = {}) {
  const jsonFiles = await collectsJsonFiles(path.resolve(authorityDir));
  const documents = [];
  for (const filePath of jsonFiles) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    const documentKind = detectsAuthorityDocumentKind(parsed);
    if (documentKind === null) continue;
    documents.push({
      filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"),
      documentKind,
      document: parsed,
    });
  }
  return documents;
}

/**
 * Discovers across several roots (e.g. the repository's top-level contracts/
 * folder plus the scanned workspace root, which may hold its own nested
 * contracts/ directories) and dedupes by the final relative path in case a
 * root is nested inside another.
 */
export async function discoversAuthorityDocumentsAcrossRoots(roots, { relativeTo } = {}) {
  const seen = new Map();
  for (const root of roots) {
    if (typeof root !== "string" || root.length === 0) continue;
    const documents = await discoversAuthorityDocuments(root, { relativeTo: relativeTo ?? root });
    for (const entry of documents) seen.set(entry.filePath, entry);
  }
  return [...seen.values()];
}
