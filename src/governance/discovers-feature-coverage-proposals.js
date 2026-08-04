import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

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

export async function discoversFeatureCoverageProposals(proposalsDir, { relativeTo = proposalsDir } = {}) {
  const proposals = [];
  for (const filePath of await collectsJsonFiles(path.resolve(proposalsDir))) {
    let document;
    try {
      document = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (document?.documentKind !== "feature-coverage-proposal.v1") continue;
    proposals.push(Object.freeze({
      filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"),
      document,
    }));
  }
  return proposals.sort((left, right) => left.filePath.localeCompare(right.filePath));
}

export async function discoversFeatureCoverageInferenceEvaluations(proposalsDir, { relativeTo = proposalsDir } = {}) {
  const evaluations = [];
  for (const filePath of await collectsJsonFiles(path.resolve(proposalsDir))) {
    let document;
    try {
      document = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (document?.documentKind !== "feature-coverage-inference-evaluation.v1") continue;
    evaluations.push(Object.freeze({
      filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"),
      document,
    }));
  }
  return evaluations.sort((left, right) => left.filePath.localeCompare(right.filePath));
}
