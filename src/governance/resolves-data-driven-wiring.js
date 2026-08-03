import path from "node:path";
import { joinsRepositoryRelativePath } from "./resolves-authority-home-status.js";

/**
 * Known semantic-execution / contract-governance runtime modules in this
 * ecosystem. Matched as a substring of the import specifier because these
 * are frequently imported via relative paths ("../../../contract-driven-
 * artifact-governance-engine/lib/semantic-execution-runtime.mjs") as well as
 * bare package specifiers ("contract-driven-artifact-governance-engine").
 */
const semanticRuntimeMarkers = Object.freeze([
  "semantic-execution-runtime",
  "contract-driven-artifact-governance-engine",
  "sej-runtime-query",
  "semantic-kernel",
]);

const candidateExtensions = Object.freeze([".mjs", ".js", ".cjs", ".ts", ".tsx", ".jsx", ".mts", ".cts"]);
const defaultMaxHopDepth = 4;

function isJsonImport(specifier) {
  return typeof specifier === "string" && specifier.toLowerCase().endsWith(".json");
}

function isSemanticRuntimeImport(specifier) {
  return typeof specifier === "string" && semanticRuntimeMarkers.some((marker) => specifier.includes(marker));
}

/**
 * Only "./" and "../" specifiers are local hops. A bare package specifier
 * ("contract-driven-artifact-governance-engine") may itself be direct runtime
 * evidence (checked separately), but it is never followed as a graph edge --
 * there is no local file to resolve it to within this workspace's own tree.
 */
function isLocalSpecifier(specifier) {
  return typeof specifier === "string" && (specifier.startsWith("./") || specifier.startsWith("../"));
}

function resolvesLocalSpecifier(fromModulePath, specifier, knownModulePaths) {
  const fromDir = path.posix.dirname(fromModulePath.replaceAll("\\", "/"));
  const resolved = path.posix.normalize(path.posix.join(fromDir, specifier));
  if (knownModulePaths.has(resolved)) return resolved;
  for (const extension of candidateExtensions) {
    if (knownModulePaths.has(resolved + extension)) return resolved + extension;
  }
  return null;
}

function resolvesDirectDisposition(entry) {
  if (entry.importsContractData.length > 0 && entry.invokesSemanticRuntime.length > 0) return "DIRECT_DATA_AND_RUNTIME";
  if (entry.invokesSemanticRuntime.length > 0) return "RUNTIME_ONLY";
  if (entry.importsContractData.length > 0) return "DATA_ONLY";
  return "NONE";
}

/**
 * Builds direct-evidence + local-edge data for every file in the index, not
 * just the ones the caller wants results for -- traversal needs to walk
 * through local helper files that may have no observed mechanics of their
 * own (and so are outside the caller's "wanted" set) to find evidence a few
 * hops away.
 */
function buildsWiringGraph(index, workspaceRelativePrefix) {
  const sourceReferenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
  const byFile = new Map();

  for (const relationship of index.relationships) {
    if (relationship.relationshipKind !== "dependency") continue;
    const sourceReference = sourceReferenceById.get(relationship.sourceReferenceId);
    if (sourceReference === undefined) continue;
    const modulePath = joinsRepositoryRelativePath(workspaceRelativePrefix, sourceReference.modulePath);
    const specifier = relationship.toSymbolCandidate;

    const entry = byFile.get(modulePath) ?? { modulePath, importsContractData: [], invokesSemanticRuntime: [], localEdges: [] };
    if (isJsonImport(specifier)) entry.importsContractData.push(specifier);
    if (isSemanticRuntimeImport(specifier)) entry.invokesSemanticRuntime.push(specifier);
    if (isLocalSpecifier(specifier)) entry.localEdges.push(specifier);
    byFile.set(modulePath, entry);
  }

  const knownModulePaths = new Set(
    index.sourceReferences.map((reference) => joinsRepositoryRelativePath(workspaceRelativePrefix, reference.modulePath)),
  );

  return { byFile, knownModulePaths };
}

/**
 * Breadth-first search over local ("./" / "../") import edges only, starting
 * one hop out from a file that has no direct evidence of its own. Stops at
 * the first depth where evidence is found (recording the shortest hop path),
 * a cycle would revisit an already-seen file, or maxHopDepth is reached.
 *
 * The distinction that matters for the report: a chain that terminates
 * (no more local imports) within maxHopDepth with nothing found is a
 * confident "NONE" -- there is no local wiring to find. A chain still open
 * at maxHopDepth is "NOT_DETERMINED_BEYOND_MAX_DEPTH" -- the search stopped,
 * not the evidence.
 */
function resolvesTransitiveWiring(startModulePath, byFile, knownModulePaths, maxHopDepth) {
  const visited = new Set([startModulePath]);
  let frontier = [{ modulePath: startModulePath, hopPath: [startModulePath] }];
  const transitiveContractPaths = [];
  const transitiveRuntimePaths = [];
  let evidenceHopPath = null;
  let evidenceHopCount = null;
  let stoppedWithUnexploredFrontier = false;

  for (let depth = 1; depth <= maxHopDepth; depth++) {
    const nextFrontier = [];
    for (const node of frontier) {
      const nodeEntry = byFile.get(node.modulePath);
      if (nodeEntry === undefined) continue;
      for (const specifier of nodeEntry.localEdges) {
        const resolved = resolvesLocalSpecifier(node.modulePath, specifier, knownModulePaths);
        if (resolved === null || visited.has(resolved)) continue;
        visited.add(resolved);
        const hopPath = [...node.hopPath, resolved];
        const targetEntry = byFile.get(resolved);
        if (targetEntry !== undefined) {
          if (targetEntry.importsContractData.length > 0) {
            transitiveContractPaths.push(...targetEntry.importsContractData);
            evidenceHopPath ??= hopPath;
            evidenceHopCount ??= depth;
          }
          if (targetEntry.invokesSemanticRuntime.length > 0) {
            transitiveRuntimePaths.push(...targetEntry.invokesSemanticRuntime);
            evidenceHopPath ??= hopPath;
            evidenceHopCount ??= depth;
          }
        }
        nextFrontier.push({ modulePath: resolved, hopPath });
      }
    }
    frontier = nextFrontier;
    if (frontier.length === 0) break;
    if (depth === maxHopDepth && transitiveContractPaths.length === 0 && transitiveRuntimePaths.length === 0) {
      stoppedWithUnexploredFrontier = true;
    }
  }

  let wiringDisposition;
  if (transitiveContractPaths.length > 0 && transitiveRuntimePaths.length > 0) wiringDisposition = "TRANSITIVE_DATA_AND_RUNTIME";
  else if (transitiveRuntimePaths.length > 0) wiringDisposition = "TRANSITIVE_RUNTIME_ONLY";
  else if (transitiveContractPaths.length > 0) wiringDisposition = "TRANSITIVE_DATA_ONLY";
  else if (stoppedWithUnexploredFrontier) wiringDisposition = "NOT_DETERMINED_BEYOND_MAX_DEPTH";
  else wiringDisposition = "NONE";

  return {
    transitiveContractPaths,
    transitiveRuntimePaths,
    hopCount: evidenceHopCount,
    hopPath: evidenceHopPath,
    wiringDisposition,
  };
}

/**
 * Answers a different question than posture or authorityHomeStatus: not
 * "is this occurrence governed" or "does an authority document claim this
 * file," but "does this file already have data-driven capabilities wired
 * in" -- directly (its own imports) or transitively (a local helper it
 * imports has that wiring, one or more hops away).
 */
export function resolvesDataDrivenWiring(index, workspaceRelativePrefix, modulePaths, { maxHopDepth = defaultMaxHopDepth } = {}) {
  const { byFile, knownModulePaths } = buildsWiringGraph(index, workspaceRelativePrefix);
  const wanted = modulePaths instanceof Set ? modulePaths : new Set(modulePaths);

  const results = [];
  for (const modulePath of wanted) {
    const directEntry = byFile.get(modulePath) ?? { modulePath, importsContractData: [], invokesSemanticRuntime: [], localEdges: [] };
    const directDisposition = resolvesDirectDisposition(directEntry);

    if (directDisposition !== "NONE") {
      results.push(Object.freeze({
        modulePath,
        importsContractData: Object.freeze([...directEntry.importsContractData]),
        invokesSemanticRuntime: Object.freeze([...directEntry.invokesSemanticRuntime]),
        transitiveContractPaths: Object.freeze([]),
        transitiveRuntimePaths: Object.freeze([]),
        hopCount: null,
        hopPath: null,
        wiringDisposition: directDisposition,
      }));
      continue;
    }

    const transitive = resolvesTransitiveWiring(modulePath, byFile, knownModulePaths, maxHopDepth);
    results.push(Object.freeze({
      modulePath,
      importsContractData: Object.freeze([]),
      invokesSemanticRuntime: Object.freeze([]),
      transitiveContractPaths: Object.freeze(transitive.transitiveContractPaths),
      transitiveRuntimePaths: Object.freeze(transitive.transitiveRuntimePaths),
      hopCount: transitive.hopCount,
      hopPath: transitive.hopPath === null ? null : Object.freeze(transitive.hopPath),
      wiringDisposition: transitive.wiringDisposition,
    }));
  }

  return results.sort((left, right) => left.modulePath.localeCompare(right.modulePath));
}
