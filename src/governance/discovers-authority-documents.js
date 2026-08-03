import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

async function collectsJsonFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectsJsonFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(entryPath);
    }
  }
  return files;
}

/**
 * Scans a directory tree for admitted authority-declaration.v1 documents.
 * Any file that isn't valid JSON or doesn't declare that schemaVersion is
 * silently skipped -- contracts/ holds many unrelated schema/contract kinds.
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
    if (parsed?.schemaVersion === "authority-declaration.v1") {
      documents.push({
        filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"),
        document: parsed,
      });
    }
  }
  return documents;
}
