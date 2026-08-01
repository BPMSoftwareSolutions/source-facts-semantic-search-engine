import { createHash } from "node:crypto";
import { readdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

const defaultPolicyDefaults = Object.freeze({
  excludeGlobs: [],
  generatedGlobs: [],
  evidenceSnapshotGlobs: [],
});

export async function projectsWebSurfaceInventory({ policy }) {
  const effectivePolicy = readsEffectivePolicy(policy);
  const policyHash = `sha256:${sha256(canonicalizesJson(effectivePolicy))}`;
  const rootAbsolutePaths = effectivePolicy.roots.map((root) => path.resolve(root.path));
  const entries = [];

  for (let rootIndex = 0; rootIndex < effectivePolicy.roots.length; rootIndex++) {
    const root = effectivePolicy.roots[rootIndex];
    const rootAbsolutePath = rootAbsolutePaths[rootIndex];
    await walksRoot({
      root,
      rootAbsolutePath,
      rootAbsolutePaths,
      currentAbsolutePath: rootAbsolutePath,
      policy: effectivePolicy,
      entries,
      visitedRealDirectories: new Set(),
    });
  }

  entries.sort((left, right) => (
    left.rootId < right.rootId ? -1 : left.rootId > right.rootId
      ? 1
      : left.relativePath < right.relativePath ? -1 : left.relativePath > right.relativePath ? 1 : 0
  ));

  const byDisposition = {};
  for (const entry of entries) {
    byDisposition[entry.disposition] = (byDisposition[entry.disposition] ?? 0) + 1;
  }

  const inventoryType = "web-surface-inventory.v1";
  const inventoryId = `sha256:${sha256(entries.map((entry) =>
    `${entry.rootId}\0${entry.relativePath}\0${entry.disposition}\0${entry.contentHash ?? ""}\0`).join(""))}`;

  return Object.freeze({
    indexType: inventoryType,
    inventoryId,
    policyHash,
    manifest: Object.freeze({
      schemaVersion: "1.0.0",
      engine: "source-facts-semantic-search-engine",
      engineVersion: "0.1.0",
    }),
    roots: Object.freeze(effectivePolicy.roots.map((root) => Object.freeze({ ...root }))),
    entries: Object.freeze(entries.map((entry) => Object.freeze(entry))),
    coverage: Object.freeze({
      totalPaths: entries.length,
      byDisposition: Object.freeze(byDisposition),
    }),
  });
}

async function walksRoot({ root, rootAbsolutePath, rootAbsolutePaths, currentAbsolutePath, policy, entries, visitedRealDirectories }) {
  let realCurrent;
  try {
    realCurrent = await realpath(currentAbsolutePath);
  } catch {
    return;
  }
  if (visitedRealDirectories.has(realCurrent)) return;
  visitedRealDirectories.add(realCurrent);

  let dirEntries;
  try {
    dirEntries = await readdir(currentAbsolutePath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const dirEntry of dirEntries) {
    const entryAbsolutePath = path.join(currentAbsolutePath, dirEntry.name);
    const relativePath = path.relative(rootAbsolutePath, entryAbsolutePath).replaceAll("\\", "/");

    if (dirEntry.isSymbolicLink()) {
      if (policy.symlinkPolicy === "skip") {
        entries.push(buildsEntry({ root, relativePath, disposition: "excluded-by-policy", extension: path.extname(dirEntry.name).toLowerCase(), sizeBytes: null, reason: "symlink-skipped-by-policy" }));
        continue;
      }
      let resolvedTarget;
      try {
        resolvedTarget = await realpath(entryAbsolutePath);
      } catch {
        entries.push(buildsEntry({ root, relativePath, disposition: "unreadable", extension: path.extname(dirEntry.name).toLowerCase(), sizeBytes: null, reason: "symlink-target-unreadable" }));
        continue;
      }
      const withinAnyRoot = rootAbsolutePaths.some((candidateRoot) => resolvedTarget === candidateRoot || resolvedTarget.startsWith(candidateRoot + path.sep));
      if (!withinAnyRoot) {
        entries.push(buildsEntry({ root, relativePath, disposition: "external-link", extension: path.extname(dirEntry.name).toLowerCase(), sizeBytes: null, reason: "symlink-target-outside-configured-roots" }));
        continue;
      }
      const targetStats = await statSafely(resolvedTarget);
      if (targetStats?.isDirectory()) {
        await walksRoot({ root, rootAbsolutePath, rootAbsolutePaths, currentAbsolutePath: entryAbsolutePath, policy, entries, visitedRealDirectories });
        continue;
      }
      await evaluatesFile({ root, relativePath, absolutePath: entryAbsolutePath, policy, entries });
      continue;
    }

    if (dirEntry.isDirectory()) {
      if (isExcludedDirectoryName(dirEntry.name, policy.excludeDirectories)) continue;
      await walksRoot({ root, rootAbsolutePath, rootAbsolutePaths, currentAbsolutePath: entryAbsolutePath, policy, entries, visitedRealDirectories });
      continue;
    }

    if (!dirEntry.isFile()) continue;
    await evaluatesFile({ root, relativePath, absolutePath: entryAbsolutePath, policy, entries });
  }
}

async function evaluatesFile({ root, relativePath, absolutePath, policy, entries }) {
  const extension = path.extname(relativePath).toLowerCase();

  const excludeGlob = matchesAnyGlob(relativePath, policy.excludeGlobs);
  if (excludeGlob !== null) {
    entries.push(buildsEntry({ root, relativePath, disposition: "excluded-by-policy", extension, sizeBytes: await sizeOf(absolutePath), reason: `excluded-glob:${excludeGlob}` }));
    return;
  }

  const generatedGlob = matchesAnyGlob(relativePath, policy.generatedGlobs);
  if (generatedGlob !== null) {
    entries.push(buildsEntry({ root, relativePath, disposition: "generated-observation", extension, sizeBytes: await sizeOf(absolutePath), reason: `generated-glob:${generatedGlob}` }));
    return;
  }

  const evidenceGlob = matchesAnyGlob(relativePath, policy.evidenceSnapshotGlobs);
  if (evidenceGlob !== null) {
    entries.push(buildsEntry({ root, relativePath, disposition: "evidence-snapshot", extension, sizeBytes: await sizeOf(absolutePath), reason: `evidence-glob:${evidenceGlob}` }));
    return;
  }

  const beforeStats = await statSafely(absolutePath);
  if (beforeStats === null) {
    entries.push(buildsEntry({ root, relativePath, disposition: "unreadable", extension, sizeBytes: null, reason: "stat-failed" }));
    return;
  }

  if (beforeStats.size > policy.maxFileSizeBytes) {
    entries.push(buildsEntry({ root, relativePath, disposition: "oversized", extension, sizeBytes: beforeStats.size, reason: `exceeds-max-file-size-bytes:${policy.maxFileSizeBytes}` }));
    return;
  }

  const isEntryExtension = policy.entryExtensions.includes(extension);
  const isRelatedExtension = policy.relatedExtensions.includes(extension);
  if (!isEntryExtension && !isRelatedExtension) {
    entries.push(buildsEntry({ root, relativePath, disposition: "unsupported-extension", extension, sizeBytes: beforeStats.size, reason: null }));
    return;
  }

  let content;
  try {
    content = await readFile(absolutePath);
  } catch (error) {
    entries.push(buildsEntry({ root, relativePath, disposition: "unreadable", extension, sizeBytes: beforeStats.size, reason: error.message }));
    return;
  }

  const afterStats = await statSafely(absolutePath);
  const changedDuringObservation = afterStats === null
    || afterStats.size !== beforeStats.size
    || afterStats.mtimeMs !== beforeStats.mtimeMs;

  const contentHash = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  const disposition = changedDuringObservation
    ? "changed-during-observation"
    : isEntryExtension ? "admitted-entry-candidate" : "admitted-related-candidate";

  entries.push(buildsEntry({
    root,
    relativePath,
    disposition,
    extension,
    sizeBytes: content.length,
    contentHash,
    reason: changedDuringObservation ? "file-changed-between-stat-and-read" : null,
  }));
}

function buildsEntry({ root, relativePath, disposition, extension, sizeBytes, contentHash = undefined, reason = null }) {
  const pathId = sha256(`${root.rootId}\0${relativePath}`);
  return {
    pathId,
    rootId: root.rootId,
    relativePath,
    disposition,
    extension,
    sizeBytes,
    ...(contentHash !== undefined ? { contentHash } : {}),
    reason,
  };
}

async function sizeOf(absolutePath) {
  const stats = await statSafely(absolutePath);
  return stats?.size ?? null;
}

async function statSafely(absolutePath) {
  try {
    return await stat(absolutePath);
  } catch {
    return null;
  }
}

function isExcludedDirectoryName(name, excludeDirectories) {
  return excludeDirectories.includes(name);
}

function matchesAnyGlob(relativePath, globs) {
  for (const glob of globs) {
    if (globToRegExp(glob).test(relativePath)) return glob;
  }
  return null;
}

const globRegExpCache = new Map();

function globToRegExp(glob) {
  const cached = globRegExpCache.get(glob);
  if (cached !== undefined) return cached;
  let pattern = "";
  for (let index = 0; index < glob.length; index++) {
    const character = glob[index];
    if (character === "*") {
      if (glob[index + 1] === "*") {
        pattern += ".*";
        index += 1;
        if (glob[index + 1] === "/") index += 1;
        continue;
      }
      pattern += "[^/]*";
      continue;
    }
    if (character === "?") {
      pattern += "[^/]";
      continue;
    }
    if (".+^${}()|[]\\".includes(character)) {
      pattern += `\\${character}`;
      continue;
    }
    pattern += character;
  }
  const regExp = new RegExp(`^${pattern}$`);
  globRegExpCache.set(glob, regExp);
  return regExp;
}

function readsEffectivePolicy(policy) {
  if (policy === null || typeof policy !== "object" || policy.policyType !== "web-know-workspace.v1") {
    throw new Error("policy must be a web-know-workspace.v1 object.");
  }
  if (!Array.isArray(policy.roots) || policy.roots.length === 0) {
    throw new Error("policy.roots must contain at least one root.");
  }
  return Object.freeze({
    policyType: policy.policyType,
    roots: policy.roots.map((root) => Object.freeze({ rootId: root.rootId, path: root.path })),
    entryExtensions: [...policy.entryExtensions],
    relatedExtensions: [...policy.relatedExtensions],
    excludeDirectories: [...policy.excludeDirectories],
    excludeGlobs: [...(policy.excludeGlobs ?? defaultPolicyDefaults.excludeGlobs)],
    generatedGlobs: [...(policy.generatedGlobs ?? defaultPolicyDefaults.generatedGlobs)],
    evidenceSnapshotGlobs: [...(policy.evidenceSnapshotGlobs ?? defaultPolicyDefaults.evidenceSnapshotGlobs)],
    symlinkPolicy: policy.symlinkPolicy,
    maxFileSizeBytes: policy.maxFileSizeBytes,
    expansion: { ...policy.expansion },
  });
}

function canonicalizesJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalizesJson).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizesJson(value[key])}`).join(",")}}`;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
