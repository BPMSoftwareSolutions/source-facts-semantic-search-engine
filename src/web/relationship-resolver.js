import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { buildsLineStarts, resolvesLineAndColumn } from "../lib/text-positions.js";

const extensionProbeOrder = Object.freeze([".html", ".htm", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"]);

export function buildsResolutionContext({ inventory }) {
  const rootAbsolutePathById = new Map(inventory.roots.map((root) => [root.rootId, path.resolve(root.path)]));
  const pathIdByAbsolutePath = new Map();
  const extensionByPathId = new Map();
  const sizeByPathId = new Map();
  const absolutePathByPathId = new Map();
  for (const entry of inventory.entries) {
    if (entry.disposition !== "admitted-entry-candidate" && entry.disposition !== "admitted-related-candidate") continue;
    const rootAbsolutePath = rootAbsolutePathById.get(entry.rootId);
    const absolutePath = path.resolve(rootAbsolutePath, ...entry.relativePath.split("/"));
    pathIdByAbsolutePath.set(absolutePath, entry);
    extensionByPathId.set(entry.pathId, entry.extension);
    sizeByPathId.set(entry.pathId, entry.sizeBytes ?? 0);
    absolutePathByPathId.set(entry.pathId, absolutePath);
  }
  return Object.freeze({
    pathIdByAbsolutePath,
    extensionByPathId,
    sizeByPathId,
    absolutePathByPathId,
    rootAbsolutePaths: [...rootAbsolutePathById.values()],
  });
}

export function resolvesReferenceToRelationship({ rawReference, fromPathId = null, fromDocumentId = null, fromAbsoluteDirectory, context }) {
  const resolution = resolvesCandidateTarget({
    candidateTarget: rawReference.candidateTarget,
    resolvedSyntheticPathId: rawReference.resolvedSyntheticPathId ?? null,
    fromAbsoluteDirectory,
    context,
  });
  let edgeKind = rawReference.edgeKind;
  if (resolution.resolutionDisposition === "resolved-local" && (edgeKind === "js-static-import" || edgeKind === "js-dynamic-import-candidate")) {
    const extension = context.extensionByPathId.get(resolution.resolvedPathId);
    if (extension === ".json") edgeKind = "js-json-import";
    else if (extension === ".css") edgeKind = "js-style-import";
  }
  return Object.freeze({
    relationshipId: sha256(`${fromPathId ?? fromDocumentId ?? ""}\0${rawReference.sourceReferenceId}\0${edgeKind}\0${rawReference.candidateTarget}`),
    edgeKind,
    fromPathId,
    fromDocumentId,
    candidateTarget: rawReference.candidateTarget,
    resolvedPathId: resolution.resolvedPathId,
    resolutionDisposition: resolution.resolutionDisposition,
    sourceReferenceId: rawReference.sourceReferenceId,
  });
}

export function extractsJsReferences(text) {
  const lineStarts = buildsLineStarts(text);
  const references = [];

  for (const match of text.matchAll(/\bimport\s+(?:[^'"()]*?\sfrom\s+)?["']([^"']+)["']/g)) {
    references.push(buildsJsReference(match, 1, "js-static-import", lineStarts));
  }
  for (const match of text.matchAll(/\bexport\s+(?:\*|\{[^}]*\}|\*\s+as\s+[A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["']/g)) {
    references.push(buildsJsReference(match, 1, "js-static-import", lineStarts));
  }
  for (const match of text.matchAll(/\brequire\(\s*["']([^"']+)["']\s*\)/g)) {
    references.push(buildsJsReference(match, 1, "js-static-import", lineStarts));
  }
  for (const match of text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) {
    references.push(buildsJsReference(match, 1, "js-dynamic-import-candidate", lineStarts));
  }

  return references;
}

function buildsJsReference(match, groupIndex, edgeKind, lineStarts) {
  const target = match[groupIndex];
  const start = match.index + match[0].lastIndexOf(target);
  const position = resolvesLineAndColumn(lineStarts, start);
  return Object.freeze({ edgeKind, candidateTarget: target, start, length: target.length, line: position.line, column: position.column });
}

function resolvesCandidateTarget({ candidateTarget, resolvedSyntheticPathId, fromAbsoluteDirectory, context }) {
  if (resolvedSyntheticPathId !== null) {
    return Object.freeze({ resolvedPathId: resolvedSyntheticPathId, resolutionDisposition: "resolved-local" });
  }
  const trimmed = candidateTarget.trim();
  if (trimmed.length === 0) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "unsupported-resolution-form" });
  if (trimmed.startsWith("#")) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "fragment-only" });
  if (/^data:/i.test(trimmed)) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "data-url" });
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(trimmed) || /^(mailto|tel):/i.test(trimmed)) {
    return Object.freeze({ resolvedPathId: null, resolutionDisposition: "external-url" });
  }

  const withoutQueryOrFragment = trimmed.split(/[?#]/u)[0];
  if (withoutQueryOrFragment.length === 0) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "fragment-only" });

  if (withoutQueryOrFragment.startsWith(".") || withoutQueryOrFragment.startsWith("/")) {
    return resolvesFileSystemPath({ candidatePath: withoutQueryOrFragment, fromAbsoluteDirectory, context });
  }

  const packageDirectory = locatesWorkspacePackage(withoutQueryOrFragment, fromAbsoluteDirectory);
  if (packageDirectory !== null) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "resolved-workspace-package" });
  return Object.freeze({ resolvedPathId: null, resolutionDisposition: "unsupported-resolution-form" });
}

function resolvesFileSystemPath({ candidatePath, fromAbsoluteDirectory, context }) {
  if (candidatePath.startsWith("/")) {
    return Object.freeze({ resolvedPathId: null, resolutionDisposition: "unsupported-resolution-form" });
  }
  const basePath = path.resolve(fromAbsoluteDirectory, candidatePath);
  const found = probesExtensions(basePath, context);
  if (found !== null) return Object.freeze({ resolvedPathId: found.entry.pathId, resolutionDisposition: "resolved-local" });
  if (existsSyncAnyExtension(basePath)) return Object.freeze({ resolvedPathId: null, resolutionDisposition: "blocked-by-policy" });
  return Object.freeze({ resolvedPathId: null, resolutionDisposition: "missing-local-target" });
}

function probesExtensions(basePath, context) {
  const direct = context.pathIdByAbsolutePath.get(basePath);
  if (direct !== undefined) return { absolutePath: basePath, entry: direct };
  for (const extension of extensionProbeOrder) {
    const candidate = `${basePath}${extension}`;
    const entry = context.pathIdByAbsolutePath.get(candidate);
    if (entry !== undefined) return { absolutePath: candidate, entry };
  }
  for (const extension of extensionProbeOrder) {
    const candidate = path.join(basePath, `index${extension}`);
    const entry = context.pathIdByAbsolutePath.get(candidate);
    if (entry !== undefined) return { absolutePath: candidate, entry };
  }
  return null;
}

function existsSyncAnyExtension(basePath) {
  if (existsSync(basePath)) return true;
  for (const extension of extensionProbeOrder) {
    if (existsSync(`${basePath}${extension}`)) return true;
    if (existsSync(path.join(basePath, `index${extension}`))) return true;
  }
  return false;
}

function locatesWorkspacePackage(specifier, fromAbsoluteDirectory) {
  const segments = specifier.split("/");
  const packageName = specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
  let currentDirectory = fromAbsoluteDirectory;
  for (let depth = 0; depth < 40; depth++) {
    const candidate = path.join(currentDirectory, "node_modules", packageName);
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(currentDirectory);
    if (parent === currentDirectory) break;
    currentDirectory = parent;
  }
  return null;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
