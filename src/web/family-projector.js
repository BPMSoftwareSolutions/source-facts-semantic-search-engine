import { createHash } from "node:crypto";
import path from "node:path";
import { extractsJsReferences, resolvesReferenceToRelationship } from "./relationship-resolver.js";
import { projectsJsxOrTsFile } from "./jsx-projector.js";
import { addSourceReference } from "../lib/source-reference.js";

const jsLikeExtensions = Object.freeze([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx"]);
const tsAstExtensions = Object.freeze(new Set([".ts", ".tsx", ".jsx"]));
const nonTraversableEdgeKinds = Object.freeze(new Set(["html-anchor-navigation"]));

export async function projectsWebArtifactFamilies({
  entries,
  edgesByFromPathId,
  resolutionContext,
  absolutePathByPathId,
  inlineContentBySyntheticPathId,
  readsFileText,
  expansionLimits,
  policyHash,
}) {
  const families = [];
  const discoveredRelationships = [];
  const discoveredJsxElements = [];
  const discoveredSourceReferences = [];
  const lazyScannedPathIds = new Set();

  for (const entry of entries) {
    const family = await expandsOneFamily({
      entry,
      edgesByFromPathId,
      resolutionContext,
      absolutePathByPathId,
      inlineContentBySyntheticPathId,
      readsFileText,
      expansionLimits,
      policyHash,
      discoveredRelationships,
      discoveredJsxElements,
      discoveredSourceReferences,
      lazyScannedPathIds,
    });
    families.push(family);
  }

  return Object.freeze({
    families: Object.freeze(families),
    discoveredRelationships: Object.freeze(discoveredRelationships),
    discoveredJsxElements: Object.freeze(discoveredJsxElements),
    discoveredSourceReferences: Object.freeze(discoveredSourceReferences),
  });
}

async function expandsOneFamily({
  entry,
  edgesByFromPathId,
  resolutionContext,
  absolutePathByPathId,
  inlineContentBySyntheticPathId,
  readsFileText,
  expansionLimits,
  policyHash,
  discoveredRelationships,
  discoveredJsxElements,
  discoveredSourceReferences,
  lazyScannedPathIds,
}) {
  const startTime = Date.now();
  const visited = new Set([entry.pathId]);
  const members = [{ pathId: entry.pathId, role: "entry", depth: 0 }];
  const resolvedEdgeIds = [];
  const unresolvedEdgeIds = [];
  const queue = [{ pathId: entry.pathId, depth: 0 }];
  let totalBytes = sizeOfMember(entry.pathId, { resolutionContext, absolutePathByPathId, inlineContentBySyntheticPathId, entrySizeBytes: entry.sizeBytes });
  let truncated = false;
  let truncationReason = null;

  while (queue.length > 0) {
    if (members.length >= expansionLimits.maxMembers) {
      truncated = true;
      truncationReason = "maxMembers";
      break;
    }
    if (Date.now() - startTime > expansionLimits.maxTimeMs) {
      truncated = true;
      truncationReason = "maxTimeMs";
      break;
    }
    const current = queue.shift();
    if (current.depth >= expansionLimits.maxDepth) continue;

    const edges = await resolvesEdgesFor({
      pathId: current.pathId,
      edgesByFromPathId,
      resolutionContext,
      absolutePathByPathId,
      inlineContentBySyntheticPathId,
      readsFileText,
      discoveredRelationships,
      discoveredJsxElements,
      discoveredSourceReferences,
      lazyScannedPathIds,
    });

    for (const edge of edges) {
      const isResolvedLocal = edge.resolutionDisposition === "resolved-local";
      if (isResolvedLocal) resolvedEdgeIds.push(edge.relationshipId);
      else unresolvedEdgeIds.push(edge.relationshipId);

      if (!isResolvedLocal || nonTraversableEdgeKinds.has(edge.edgeKind)) continue;
      if (visited.has(edge.resolvedPathId)) continue;

      const memberSize = sizeOfMember(edge.resolvedPathId, { resolutionContext, absolutePathByPathId, inlineContentBySyntheticPathId });
      if (totalBytes + memberSize > expansionLimits.maxBytes) {
        truncated = true;
        truncationReason = truncationReason ?? "maxBytes";
        continue;
      }

      visited.add(edge.resolvedPathId);
      totalBytes += memberSize;
      const role = rolesForPathId(edge.resolvedPathId, { resolutionContext, inlineContentBySyntheticPathId });
      members.push({ pathId: edge.resolvedPathId, role, depth: current.depth + 1 });
      queue.push({ pathId: edge.resolvedPathId, depth: current.depth + 1 });
    }
  }

  const familyId = sha256(`${policyHash}\0${entry.pathId}`);
  const familyRootHash = `sha256:${sha256([
    policyHash,
    entry.pathId,
    ...resolvedEdgeIds.slice().sort(),
    ...members.map((member) => `${member.pathId}:${member.role}:${member.depth}`).sort(),
  ].join("\0"))}`;

  return Object.freeze({
    familyId,
    entryPathId: entry.pathId,
    entryRelativePath: entry.relativePath,
    rootId: entry.rootId,
    members: Object.freeze(members.map((member) => Object.freeze({ ...member }))),
    resolvedEdgeIds: Object.freeze(resolvedEdgeIds),
    unresolvedEdgeIds: Object.freeze(unresolvedEdgeIds),
    expansionLimits: Object.freeze({ ...expansionLimits }),
    truncated,
    truncationReason,
    familyRootHash,
  });
}

async function resolvesEdgesFor({ pathId, edgesByFromPathId, resolutionContext, absolutePathByPathId, inlineContentBySyntheticPathId, readsFileText, discoveredRelationships, discoveredJsxElements, discoveredSourceReferences, lazyScannedPathIds }) {
  const precomputed = edgesByFromPathId.get(pathId);
  if (precomputed !== undefined) return precomputed;
  if (lazyScannedPathIds.has(pathId)) return [];
  if (!isJsLikePathId(pathId, { resolutionContext, inlineContentBySyntheticPathId })) return [];

  lazyScannedPathIds.add(pathId);
  const inlineContent = inlineContentBySyntheticPathId.get(pathId);
  const absolutePath = absolutePathByPathId.get(pathId);
  const text = inlineContent !== undefined ? inlineContent.text : absolutePath !== undefined ? await readsFileText(absolutePath) : null;
  if (text === null) return [];

  const fromAbsoluteDirectory = inlineContent !== undefined ? inlineContent.hostAbsoluteDirectory : path.dirname(absolutePath);
  const extension = inlineContent !== undefined ? null : resolutionContext.extensionByPathId.get(pathId);
  const relativePath = inlineContent !== undefined
    ? inlineContent.hostRelativePath
    : resolutionContext.pathIdByAbsolutePath.get(absolutePath)?.relativePath ?? pathId;

  if (extension !== null && tsAstExtensions.has(extension)) {
    const projected = projectsJsxOrTsFile({ pathId, relativePath, text });
    const relationships = projected.rawReferences.map((rawReference) => resolvesReferenceToRelationship({
      rawReference,
      fromPathId: pathId,
      fromAbsoluteDirectory,
      context: resolutionContext,
    }));
    discoveredRelationships.push(...relationships);
    discoveredJsxElements.push(...projected.jsxElements);
    discoveredSourceReferences.push(...projected.sourceReferences);
    return relationships;
  }

  const referenceById = new Set();
  const sourceReferences = [];
  const jsReferences = extractsJsReferences(text);
  const rawReferences = jsReferences.map((jsReference) => {
    const reference = addSourceReference({
      kind: "js-import",
      sourceKind: jsReference.edgeKind,
      location: jsReference,
      modulePath: relativePath,
      sourceText: text,
      referenceById,
      sourceReferences,
    });
    return {
      edgeKind: jsReference.edgeKind,
      candidateTarget: jsReference.candidateTarget,
      resolvedSyntheticPathId: null,
      sourceReferenceId: reference.referenceId,
    };
  });
  const relationships = rawReferences.map((rawReference) => resolvesReferenceToRelationship({
    rawReference,
    fromPathId: pathId,
    fromAbsoluteDirectory,
    context: resolutionContext,
  }));

  discoveredRelationships.push(...relationships);
  discoveredSourceReferences.push(...sourceReferences);
  return relationships;
}

function isJsLikePathId(pathId, { resolutionContext, inlineContentBySyntheticPathId }) {
  const inlineContent = inlineContentBySyntheticPathId.get(pathId);
  if (inlineContent !== undefined) return inlineContent.role === "script";
  const extension = resolutionContext.extensionByPathId.get(pathId);
  return jsLikeExtensions.includes(extension);
}

function rolesForPathId(pathId, { resolutionContext, inlineContentBySyntheticPathId }) {
  const inlineContent = inlineContentBySyntheticPathId.get(pathId);
  if (inlineContent !== undefined) return inlineContent.role;
  const extension = resolutionContext.extensionByPathId.get(pathId);
  if (extension === ".css") return "stylesheet";
  if (jsLikeExtensions.includes(extension)) return "script";
  if (extension === ".json") return "json";
  return "asset";
}

function sizeOfMember(pathId, { resolutionContext, absolutePathByPathId, inlineContentBySyntheticPathId, entrySizeBytes }) {
  if (entrySizeBytes !== undefined) return entrySizeBytes;
  const inlineContent = inlineContentBySyntheticPathId.get(pathId);
  if (inlineContent !== undefined) return inlineContent.text.length;
  return resolutionContext.sizeByPathId?.get(pathId) ?? 0;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
