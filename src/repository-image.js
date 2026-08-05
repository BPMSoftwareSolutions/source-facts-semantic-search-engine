import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { chmod, lstat, mkdir, readFile, readdir, readlink, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const excludedDirectoryNames = new Set([".git", "node_modules", "dist", "dist-test", "release", "build", ".tmp", ".proofs"]);
const excludedFileNames = new Set([".env", ".env.local"]);

export async function capturesRepositoryImage({ workspaceRoot, rootId } = {}) {
  const root = path.resolve(workspaceRoot ?? process.cwd());
  const resolvedRootId = String(rootId ?? path.basename(root)).trim();
  if (resolvedRootId.length === 0) throw new Error("rootId is required.");

  const discovered = await discoversRepositoryPaths(root);
  const artifacts = [];
  const directorySet = new Set([""]);
  for (const relativePath of discovered.paths) {
    const absolutePath = resolvesContainedPath(root, relativePath);
    const metadata = await lstat(absolutePath);
    const trackedMode = discovered.trackedModes.get(relativePath);
    let content;
    let artifactType;
    let fileMode;
    if (metadata.isSymbolicLink()) {
      artifactType = "symbolic-link";
      content = Buffer.from(await readlink(absolutePath), "utf8");
      fileMode = "120000";
    } else if (metadata.isFile()) {
      artifactType = "file";
      content = await readFile(absolutePath);
      fileMode = trackedMode ?? ((metadata.mode & 0o111) === 0 ? "100644" : "100755");
    } else {
      continue;
    }
    for (const directory of parentDirectories(relativePath)) directorySet.add(directory);
    artifacts.push(Object.freeze({
      relativePath,
      artifactType,
      artifactClass: classifiesArtifact(relativePath),
      mediaType: resolvesMediaType(relativePath),
      encoding: detectsUtf8(content) ? "utf-8" : null,
      fileMode,
      byteLength: content.length,
      contentDigest: sha256(content),
      contentBase64: content.toString("base64"),
      authorityDisposition: "OBSERVED_NOT_ADMITTED",
    }));
  }
  artifacts.sort((left, right) => comparesOrdinal(left.relativePath, right.relativePath));
  await addsDeclaredDirectories(root, directorySet);
  const directories = [...directorySet].sort(comparesOrdinal);
  const manifestAuthority = {
    imageType: "repository-current-image.v1",
    rootId: resolvedRootId,
    directories,
    artifacts: artifacts.map(({ contentBase64: _contentBase64, ...artifact }) => artifact),
  };
  return Object.freeze({
    ...manifestAuthority,
    workspaceRoot: root,
    discoveryMode: discovered.discoveryMode,
    imageDigest: sha256(Buffer.from(JSON.stringify(manifestAuthority), "utf8")),
    artifactCount: artifacts.length,
    totalByteLength: artifacts.reduce((sum, artifact) => sum + artifact.byteLength, 0),
    artifacts: Object.freeze(artifacts),
  });
}

export function verifiesRepositoryImage(image) {
  if (image?.imageType !== "repository-current-image.v1") throw new Error("A repository-current-image.v1 payload is required.");
  if (typeof image.rootId !== "string" || image.rootId.length === 0) throw new Error("image.rootId is required.");
  const seen = new Set();
  let totalByteLength = 0;
  for (const artifact of image.artifacts ?? []) {
    validatesRelativePath(artifact.relativePath);
    if (seen.has(artifact.relativePath)) throw new Error(`Duplicate repository artifact path '${artifact.relativePath}'.`);
    seen.add(artifact.relativePath);
    const content = Buffer.from(artifact.contentBase64, "base64");
    if (content.length !== artifact.byteLength) throw new Error(`Repository artifact '${artifact.relativePath}' byte length is invalid.`);
    if (sha256(content) !== artifact.contentDigest) throw new Error(`Repository artifact '${artifact.relativePath}' content digest is invalid.`);
    totalByteLength += content.length;
  }
  if (seen.size !== image.artifactCount) throw new Error("Repository image artifact count is invalid.");
  if (totalByteLength !== image.totalByteLength) throw new Error("Repository image total byte length is invalid.");
  const manifestAuthority = {
    imageType: image.imageType,
    rootId: image.rootId,
    directories: image.directories,
    artifacts: image.artifacts.map(({ contentBase64: _contentBase64, ...artifact }) => artifact),
  };
  if (sha256(Buffer.from(JSON.stringify(manifestAuthority), "utf8")) !== image.imageDigest) throw new Error("Repository image manifest digest is invalid.");
  return image;
}

export async function projectsRepositoryImageToWorkspace(image, outputRoot) {
  verifiesRepositoryImage(image);
  const root = path.resolve(outputRoot);
  let existingEntries = [];
  try {
    existingEntries = await readdir(root);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (existingEntries.length > 0) throw new Error(`Projection output '${root}' must be empty.`);
  await mkdir(root, { recursive: true });
  for (const relativeDirectory of image.directories ?? []) {
    if (relativeDirectory === "") continue;
    validatesRelativePath(relativeDirectory);
    await mkdir(resolvesContainedPath(root, relativeDirectory), { recursive: true });
  }
  for (const artifact of image.artifacts) {
    const outputPath = resolvesContainedPath(root, artifact.relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const content = Buffer.from(artifact.contentBase64, "base64");
    if (artifact.artifactType === "symbolic-link") {
      await symlink(content.toString("utf8"), outputPath);
    } else {
      await writeFile(outputPath, content, { flag: "wx" });
      if (process.platform !== "win32" && artifact.fileMode === "100755") await chmod(outputPath, 0o755);
    }
  }
  return Object.freeze({
    disposition: "REPOSITORY_IMAGE_PROJECTED",
    rootId: image.rootId,
    imageDigest: image.imageDigest,
    outputRoot: root,
    artifactCount: image.artifactCount,
    totalByteLength: image.totalByteLength,
  });
}

async function discoversRepositoryPaths(root) {
  try {
    const [{ stdout: pathsOutput }, { stdout: modesOutput }] = await Promise.all([
      execFileAsync("git", ["-C", root, "ls-files", "-z", "--cached", "--others", "--exclude-standard"], { encoding: "buffer", maxBuffer: 100 * 1024 * 1024 }),
      execFileAsync("git", ["-C", root, "ls-files", "-z", "--stage"], { encoding: "buffer", maxBuffer: 100 * 1024 * 1024 }),
    ]);
    const paths = splitsNullDelimited(pathsOutput).map(normalizesRelativePath).filter(isSafeIncludedPath).sort(comparesOrdinal);
    const trackedModes = new Map();
    for (const entry of splitsNullDelimited(modesOutput)) {
      const match = entry.match(/^(\d+)\s+[0-9a-f]+\s+\d+\t([\s\S]+)$/u);
      if (match) trackedModes.set(normalizesRelativePath(match[2]), match[1]);
    }
    return { paths, trackedModes, discoveryMode: "git-governed-working-tree" };
  } catch {
    return { paths: await listsFallbackFiles(root), trackedModes: new Map(), discoveryMode: "filesystem-default-policy" };
  }
}

async function listsFallbackFiles(root) {
  const pending = [root];
  const result = [];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (entry.isDirectory() && excludedDirectoryNames.has(entry.name)) continue;
      const absolutePath = path.join(current, entry.name);
      const relativePath = normalizesRelativePath(path.relative(root, absolutePath));
      if (!isSafeIncludedPath(relativePath)) continue;
      if (entry.isDirectory()) pending.push(absolutePath);
      else if (entry.isFile() || entry.isSymbolicLink()) result.push(relativePath);
    }
  }
  return result.sort(comparesOrdinal);
}

async function addsDeclaredDirectories(root, directorySet) {
  const contractPath = path.join(root, "contracts", "workspace-file-system.contract.json");
  try {
    const contract = JSON.parse(await readFile(contractPath, "utf8"));
    for (const entry of contract.directories ?? []) {
      if (typeof entry.relativePath !== "string") continue;
      const normalized = normalizesRelativePath(entry.relativePath);
      validatesRelativePath(normalized);
      directorySet.add(normalized);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function classifiesArtifact(relativePath) {
  if (relativePath.startsWith("test/") || relativePath.startsWith("verification/")) return "test-proof";
  if (relativePath.startsWith("scripts/")) return "operational-script";
  if (relativePath.startsWith("features/")) return "feature-authority";
  if (relativePath.startsWith("contracts/") || relativePath.startsWith("schemas/") || relativePath.includes("/contracts/")) return "contract-authority";
  if (relativePath.startsWith("docs/") || relativePath.endsWith("README.md")) return "documentation";
  if (relativePath.startsWith("src/") || relativePath.startsWith("bin/")) return "implementation";
  if (relativePath.startsWith("artifacts/") || relativePath.startsWith("evidence/")) return "derived-evidence";
  if (["package.json", "package-lock.json"].includes(relativePath)) return "runtime-manifest";
  return "repository-support";
}

function resolvesMediaType(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  return new Map([
    [".js", "text/javascript"], [".mjs", "text/javascript"], [".cjs", "text/javascript"], [".ts", "text/typescript"],
    [".json", "application/json"], [".md", "text/markdown"], [".sql", "application/sql"], [".feature", "text/x-gherkin"],
    [".html", "text/html"], [".css", "text/css"], [".txt", "text/plain"], [".mmd", "text/vnd.mermaid"],
  ]).get(extension) ?? "application/octet-stream";
}

function detectsUtf8(content) {
  if (content.includes(0)) return false;
  const decoded = content.toString("utf8");
  return Buffer.from(decoded, "utf8").equals(content);
}

function parentDirectories(relativePath) {
  const parts = relativePath.split("/").slice(0, -1);
  return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
}

function splitsNullDelimited(buffer) {
  return buffer.toString("utf8").split("\0").filter((value) => value.length > 0);
}

function normalizesRelativePath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//u, "");
}

function isSafeIncludedPath(relativePath) {
  if (excludedFileNames.has(path.posix.basename(relativePath))) return false;
  return !relativePath.split("/").some((part) => excludedDirectoryNames.has(part));
}

function resolvesContainedPath(root, relativePath) {
  validatesRelativePath(relativePath);
  const resolved = path.resolve(root, ...relativePath.split("/"));
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Repository artifact path '${relativePath}' escapes its root.`);
  return resolved;
}

export function validatesRelativePath(relativePath) {
  if (typeof relativePath !== "string" || relativePath.length === 0 || relativePath.includes("\\") || path.posix.isAbsolute(relativePath)) {
    throw new Error(`Invalid repository-relative path '${relativePath}'.`);
  }
  if (relativePath.split("/").some((part) => part.length === 0 || part === "." || part === "..")) {
    throw new Error(`Invalid repository-relative path '${relativePath}'.`);
  }
}

function sha256(content) {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

function comparesOrdinal(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
