import { createHash } from "node:crypto";
import { mkdir, readFile, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolvesLocalReferenceTarget } from "../web/relationship-resolver.js";

const materializableDispositions = Object.freeze(new Set(["STATIC_REPRODUCTION_READY", "PARTIAL_STATIC_REPRODUCTION"]));
const copiedRoles = Object.freeze(new Set(["stylesheet", "asset"]));

export async function materializesStaticPreviews({
  plan,
  resolutionContext,
  sourceRootAbsolutePaths,
  outputDirectory,
  previewPolicy = {},
}) {
  const outputRoot = path.resolve(outputDirectory);
  const previewsRoot = path.join(outputRoot, "previews");
  await requiresOutsideSourceRoots(previewsRoot, sourceRootAbsolutePaths);
  await rm(previewsRoot, { recursive: true, force: true });

  const emittedFiles = [];
  const transformationsByItem = [];

  for (const planItem of plan.items) {
    if (!materializableDispositions.has(planItem.reproductionDisposition)) continue;
    if (planItem.targetRoute === null) continue;

    const previewDirectory = path.join(previewsRoot, extractsRouteHash(planItem.targetRoute));
    await requiresOutsideSourceRoots(previewDirectory, sourceRootAbsolutePaths);

    const entryAbsolutePath = resolutionContext.absolutePathByPathId.get(planItem.entryPathId);
    if (entryAbsolutePath === undefined) {
      throw new Error(`Preview entry path no longer resolves: ${planItem.entryPathId}`);
    }

    const memberBytesByPathId = new Map();
    const outputPathByPathId = new Map();
    const copiedMembers = planItem.admittedMembers.filter((member) => copiedRoles.has(member.role));
    for (const member of copiedMembers) {
      const memberAbsolutePath = resolutionContext.absolutePathByPathId.get(member.pathId);
      if (memberAbsolutePath === undefined) {
        throw new Error(`Admitted preview member no longer resolves: ${member.relativePath}`);
      }
      outputPathByPathId.set(member.pathId, path.join(
        previewDirectory,
        "files",
        member.pathId,
        sanitizesFileName(path.basename(memberAbsolutePath)),
      ));
    }

    const entryBytes = await readsAndVerifies(entryAbsolutePath, planItem.sourceHashAtPlanTime, "entry surface");
    let totalBytes = entryBytes.length;
    for (const member of planItem.admittedMembers) {
      const memberAbsolutePath = resolutionContext.absolutePathByPathId.get(member.pathId);
      if (memberAbsolutePath === undefined) continue; // synthetic inline content remains within the verified entry document
      const bytes = await readsAndVerifies(memberAbsolutePath, member.contentHash, member.relativePath);
      memberBytesByPathId.set(member.pathId, bytes);
      totalBytes += bytes.length;
    }

    enforcesPreviewLimits({
      fileCount: 1 + copiedMembers.length,
      totalBytes,
      maxFiles: previewPolicy.maxFiles,
      maxBytes: previewPolicy.maxBytes,
    });

    await mkdir(previewDirectory, { recursive: true });
    const entryOutputPath = path.join(previewDirectory, "index.html");
    const appliedTransformations = [];
    const stripped = stripsExecutableHtml(entryBytes.toString("utf8"));
    if (stripped.removedScriptCount > 0) {
      appliedTransformations.push(Object.freeze({
        kind: "script-removed",
        detail: `${stripped.removedScriptCount} executable HTML construct(s) removed`,
      }));
    }
    const rewrittenEntry = rewritesHtmlReferences(stripped.html, {
      sourceAbsolutePath: entryAbsolutePath,
      outputAbsolutePath: entryOutputPath,
      outputPathByPathId,
      resolutionContext,
      transformations: appliedTransformations,
    });
    await writesOutsideSourceRoots(entryOutputPath, rewrittenEntry, sourceRootAbsolutePaths);
    emittedFiles.push(buildsEmittedFile(outputRoot, entryOutputPath, rewrittenEntry));

    for (const member of copiedMembers) {
      const memberAbsolutePath = resolutionContext.absolutePathByPathId.get(member.pathId);
      const memberOutputPath = outputPathByPathId.get(member.pathId);
      const sourceBytes = memberBytesByPathId.get(member.pathId);
      let outputBytes = sourceBytes;
      if (member.role === "stylesheet") {
        outputBytes = Buffer.from(rewritesCssReferences(sourceBytes.toString("utf8"), {
          sourceAbsolutePath: memberAbsolutePath,
          outputAbsolutePath: memberOutputPath,
          outputPathByPathId,
          resolutionContext,
          transformations: appliedTransformations,
        }), "utf8");
      }
      await writesOutsideSourceRoots(memberOutputPath, outputBytes, sourceRootAbsolutePaths);
      emittedFiles.push(buildsEmittedFile(outputRoot, memberOutputPath, outputBytes));
    }

    transformationsByItem.push(Object.freeze({
      itemId: planItem.itemId,
      transformations: Object.freeze(appliedTransformations),
    }));
  }

  return Object.freeze({
    emittedFiles: Object.freeze(emittedFiles),
    transformationsByItem: Object.freeze(transformationsByItem),
  });
}

async function readsAndVerifies(absolutePath, expectedHash, label) {
  let bytes;
  try {
    bytes = await readFile(absolutePath);
  } catch (error) {
    throw new Error(`Refusing stale preview materialization; ${label} is unreadable: ${error.message}`);
  }
  const currentHash = hashBytes(bytes);
  if (currentHash !== expectedHash) {
    throw new Error(`Refusing stale preview materialization; ${label} changed after planning.`);
  }
  return bytes;
}

function enforcesPreviewLimits({ fileCount, totalBytes, maxFiles, maxBytes }) {
  if (Number.isInteger(maxFiles) && fileCount > maxFiles) {
    throw new Error(`Preview would emit ${fileCount} files, exceeding policy maxFiles ${maxFiles}.`);
  }
  if (Number.isInteger(maxBytes) && totalBytes > maxBytes) {
    throw new Error(`Preview would read ${totalBytes} bytes, exceeding policy maxBytes ${maxBytes}.`);
  }
}

function stripsExecutableHtml(html) {
  let removedScriptCount = 0;
  let result = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, () => {
    removedScriptCount += 1;
    return "<!-- script removed by static-no-script preview policy -->";
  });
  result = result.replace(/<script\b[^>]*\/>/gi, () => {
    removedScriptCount += 1;
    return "<!-- script removed by static-no-script preview policy -->";
  });
  result = result.replace(/\son[a-z][\w:-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, () => {
    removedScriptCount += 1;
    return "";
  });
  result = result.replace(/\s(href|src|action)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, (_match, attribute) => {
    removedScriptCount += 1;
    return ` ${attribute}="#"`;
  });
  return { html: result, removedScriptCount };
}

function rewritesHtmlReferences(html, context) {
  return html.replace(/\b(href|src)\s*=\s*(["'])([^"']*)\2/gi, (match, attribute, quote, value) => {
    const rewritten = resolvesRewrittenReference(value, {
      ...context,
      allowAncestorFallback: attribute.toLowerCase() === "href" && /\.css(?:[?#]|$)/i.test(value),
    });
    if (rewritten === null) return match;
    context.transformations.push(Object.freeze({ kind: "link-rewritten", detail: `${attribute} rewritten to admitted preview member` }));
    return `${attribute}=${quote}${rewritten}${quote}`;
  });
}

function rewritesCssReferences(css, context) {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (match, quote, value) => {
    const rewritten = resolvesRewrittenReference(value.trim(), context);
    if (rewritten === null) return match;
    context.transformations.push(Object.freeze({ kind: "link-rewritten", detail: "CSS url() rewritten to admitted preview member" }));
    return `url(${quote}${rewritten}${quote})`;
  });
}

function resolvesRewrittenReference(value, { sourceAbsolutePath, outputAbsolutePath, outputPathByPathId, resolutionContext, allowAncestorFallback = false }) {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) return null;
  const suffixIndex = trimmed.search(/[?#]/u);
  const pathPart = suffixIndex === -1 ? trimmed : trimmed.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : trimmed.slice(suffixIndex);
  const resolution = resolvesLocalReferenceTarget({
    candidateTarget: pathPart,
    fromAbsoluteDirectory: path.dirname(sourceAbsolutePath),
    context: resolutionContext,
    allowAncestorFallback,
  });
  if (resolution.resolvedPathId === null) return null;
  const targetOutputPath = outputPathByPathId.get(resolution.resolvedPathId);
  if (targetOutputPath === undefined) return null;
  let relativeUrl = path.relative(path.dirname(outputAbsolutePath), targetOutputPath).replaceAll("\\", "/");
  if (!relativeUrl.startsWith(".")) relativeUrl = `./${relativeUrl}`;
  return `${relativeUrl}${suffix}`;
}

async function writesOutsideSourceRoots(absolutePath, content, sourceRootAbsolutePaths) {
  await requiresOutsideSourceRoots(absolutePath, sourceRootAbsolutePaths);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
}

function buildsEmittedFile(outputRoot, absolutePath, content) {
  return Object.freeze({
    path: path.relative(outputRoot, absolutePath).replaceAll("\\", "/"),
    contentHash: hashBytes(content),
  });
}

function extractsRouteHash(targetRoute) {
  const match = targetRoute.match(/^\/preview\/([0-9a-f]+)\/index\.html$/u);
  if (match === null) throw new Error(`Unrecognized preview route shape: ${targetRoute}`);
  return match[1];
}

function sanitizesFileName(fileName) {
  const sanitized = fileName.replace(/[^A-Za-z0-9._-]/g, "_");
  return sanitized.length === 0 ? "member.bin" : sanitized;
}

export async function requiresOutsideSourceRoots(candidatePath, sourceRootAbsolutePaths) {
  const resolvedCandidate = await resolvesThroughExistingAncestor(candidatePath);
  for (const root of sourceRootAbsolutePaths) {
    const resolvedRoot = await resolvesThroughExistingAncestor(root);
    if (isSameOrDescendant(resolvedCandidate, resolvedRoot)) {
      throw new Error(`Refusing to write inside a configured source root: ${path.resolve(candidatePath)}`);
    }
  }
}

async function resolvesThroughExistingAncestor(candidatePath) {
  let current = path.resolve(candidatePath);
  const missingSegments = [];
  while (true) {
    try {
      const existingRealPath = await realpath(current);
      return path.resolve(existingRealPath, ...missingSegments.reverse());
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return path.resolve(candidatePath);
      missingSegments.push(path.basename(current));
      current = parent;
    }
  }
}

function isSameOrDescendant(candidatePath, rootPath) {
  const candidate = process.platform === "win32" ? candidatePath.toLowerCase() : candidatePath;
  const root = process.platform === "win32" ? rootPath.toLowerCase() : rootPath;
  return candidate === root || candidate.startsWith(root + path.sep);
}

function hashBytes(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
