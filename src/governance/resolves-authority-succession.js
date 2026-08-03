import path from "node:path";
import { joinsRepositoryRelativePath } from "./resolves-authority-home-status.js";

const candidateExtensions = Object.freeze([".mjs", ".js", ".cjs", ".ts", ".tsx", ".jsx", ".mts", ".cts"]);
const defaultMaxHopDepth = 4;

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

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

function resolvesDeclaredFilePath(declaredPath, knownModulePaths) {
  if (knownModulePaths.has(declaredPath)) {
    return Object.freeze({ resolvedModulePath: declaredPath, status: "RESOLVED" });
  }
  const suffixMatches = [...knownModulePaths].filter((known) => known.endsWith(`/${declaredPath}`));
  if (suffixMatches.length === 1) {
    return Object.freeze({ resolvedModulePath: suffixMatches[0], status: "RESOLVED_BY_SUFFIX" });
  }
  if (suffixMatches.length > 1) {
    return Object.freeze({ resolvedModulePath: null, status: "AMBIGUOUS" });
  }
  return Object.freeze({ resolvedModulePath: null, status: "MOVED_OR_REMOVED" });
}

/**
 * A declared mechanic here means "structurally a mechanic declaration"
 * (mechanicId + mechanic + sourceLocation), regardless of coverage --
 * succession asks whether current code still carries this meaning anywhere,
 * which matters equally for AUTHORITY_BOUND and AUTHORITY_CANDIDATE_PROJECTED
 * entries.
 */
function extractsAllDeclaredMechanics(document) {
  if (document === null || typeof document !== "object") return [];
  const mechanics = document.authority?.mechanics ?? document.mechanics ?? [];
  if (!Array.isArray(mechanics)) return [];
  return mechanics.filter((mechanic) => typeof mechanic.mechanicId === "string" && typeof mechanic.mechanic === "string" && typeof mechanic.sourceLocation === "string");
}

function buildsLocalEdgeGraph(index, workspaceRelativePrefix) {
  const sourceReferenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
  const localEdgesByFile = new Map();
  for (const relationship of index.relationships) {
    if (relationship.relationshipKind !== "dependency") continue;
    const specifier = relationship.toSymbolCandidate;
    if (!isLocalSpecifier(specifier)) continue;
    const sourceReference = sourceReferenceById.get(relationship.sourceReferenceId);
    if (sourceReference === undefined) continue;
    const modulePath = joinsRepositoryRelativePath(workspaceRelativePrefix, sourceReference.modulePath);
    const edges = localEdgesByFile.get(modulePath) ?? [];
    edges.push(specifier);
    localEdgesByFile.set(modulePath, edges);
  }
  return localEdgesByFile;
}

/**
 * Breadth-first search over local import edges only, starting from the file
 * an authority document's own sourceFile resolves to. A file with no
 * mechanics of its own (a pure re-export shim, e.g. "export const x =
 * runtimeImpl.x") is followed through rather than treated as a dead end --
 * that is exactly the "meaning moved one file over" shape this resolver
 * exists to catch. The first hop depth where one or more files DO carry
 * their own observed mechanics stops the search: one such file is a
 * resolved successor, more than one at the same depth is ambiguous (the
 * shim fans out and this resolver has no basis to prefer one).
 */
function findsSuccessorFile(startModulePath, localEdgesByFile, knownModulePaths, mechanicTypesByFile, maxHopDepth) {
  const visited = new Set([startModulePath]);
  let frontier = [startModulePath];

  for (let depth = 1; depth <= maxHopDepth; depth++) {
    const nextFrontier = [];
    const foundAtThisDepth = [];
    for (const node of frontier) {
      for (const specifier of localEdgesByFile.get(node) ?? []) {
        const resolved = resolvesLocalSpecifier(node, specifier, knownModulePaths);
        if (resolved === null || visited.has(resolved)) continue;
        visited.add(resolved);
        const ownMechanicTypes = mechanicTypesByFile.get(resolved);
        if (ownMechanicTypes !== undefined && ownMechanicTypes.size > 0) {
          foundAtThisDepth.push(resolved);
        } else {
          nextFrontier.push(resolved);
        }
      }
    }
    if (foundAtThisDepth.length === 1) {
      return Object.freeze({ status: "RESOLVED", successorModulePath: foundAtThisDepth[0], hopCount: depth });
    }
    if (foundAtThisDepth.length > 1) {
      return Object.freeze({ status: "AMBIGUOUS", successorModulePath: null, hopCount: depth });
    }
    frontier = nextFrontier;
    if (frontier.length === 0) {
      return Object.freeze({ status: "NO_SUCCESSOR", successorModulePath: null, hopCount: null });
    }
  }
  return Object.freeze({ status: "NOT_DETERMINED_BEYOND_MAX_DEPTH", successorModulePath: null, hopCount: null });
}

/**
 * Answers a question neither authorityHomeStatus nor contractSemanticVolume
 * asks: when an authority document's declared sourceFile exists but has
 * stopped carrying its declared meaning (a re-export shim after a runtime
 * split, e.g. serves-query-console.mjs -> .runtime.mjs -> .runtime.impl.mjs),
 * or doesn't exist at all, is there a current file that plausibly inherited
 * that meaning -- and if so, how much of it does that file actually still
 * carry?
 *
 * Deliberately narrow about what counts as "overlap": presence of the same
 * mechanic TYPE in the successor file, not a semantic comparison of what the
 * mechanic means. Comparing declared prose ("why_guard": "Cannot expose
 * internal tool to network...") against current code would require
 * interpreting meaning this deterministic pipeline cannot honestly claim to
 * do -- fabricating an EXACT/PARTIAL/CONFLICT semantic verdict from that
 * would be a guess wearing a confident label. Mechanic-type presence is the
 * strongest claim the available evidence (SEJ mechanic observations + import
 * graph) actually supports.
 */
export function resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix = "", knownModulePaths, maxHopDepth = defaultMaxHopDepth }) {
  const mechanicTypesByFile = new Map();
  for (const occurrence of occurrences) {
    const set = mechanicTypesByFile.get(occurrence.modulePath) ?? new Set();
    set.add(occurrence.mechanic);
    mechanicTypesByFile.set(occurrence.modulePath, set);
  }
  const localEdgesByFile = buildsLocalEdgeGraph(index, workspaceRelativePrefix);

  const results = [];
  for (const { document, filePath } of authorityDocuments) {
    const declaredMechanics = extractsAllDeclaredMechanics(document);
    if (declaredMechanics.length === 0) continue;
    const declaredSourceFile = normalizesPathKey(document.sourceFile);
    if (declaredSourceFile.length === 0) continue;

    const sourceResolution = resolvesDeclaredFilePath(declaredSourceFile, knownModulePaths);
    if (sourceResolution.resolvedModulePath === null) {
      results.push(Object.freeze({
        authorityFile: filePath,
        declaredSourceFile,
        anchorFile: null,
        succession: "AUTHORITY_HAS_NO_CURRENT_SUCCESSOR",
        successorFile: null,
        hopCount: null,
        mechanicsDeclared: declaredMechanics.length,
        mechanicsPresentInSuccessor: 0,
        recommendedAction: "RECONCILE_MANUALLY_NO_ANCHOR",
      }));
      continue;
    }

    const anchorFile = sourceResolution.resolvedModulePath;
    const anchorOwnTypes = mechanicTypesByFile.get(anchorFile) ?? new Set();

    // A file with ANY observed mechanics of its own is not a re-export shim,
    // regardless of whether it covers every declared type -- searching further
    // hops away from a substantial, non-shim file would chase an unrelated
    // sibling file rather than a genuine successor (this is exactly what a
    // coverage-fraction trigger got wrong for serves-query-console.runtime.impl.mjs,
    // which has thousands of its own mechanics but not literally every type this
    // draft declares). Only a true shim -- zero mechanics of its own -- earns a
    // successor search.
    if (anchorOwnTypes.size > 0) {
      const presentCount = declaredMechanics.filter((mechanic) => anchorOwnTypes.has(mechanic.mechanic)).length;
      const allPresent = presentCount === declaredMechanics.length;
      results.push(Object.freeze({
        authorityFile: filePath,
        declaredSourceFile,
        anchorFile,
        succession: allPresent ? "AUTHORITY_SOURCE_STILL_CURRENT" : "AUTHORITY_SOURCE_CURRENT_BUT_INCOMPLETE",
        successorFile: null,
        hopCount: null,
        mechanicsDeclared: declaredMechanics.length,
        mechanicsPresentInSuccessor: presentCount,
        recommendedAction: allPresent ? "NONE_ALREADY_CURRENT" : "REVIEW_SOURCE_FOR_MISSING_MECHANIC_TYPES",
      }));
      continue;
    }

    const successorSearch = findsSuccessorFile(anchorFile, localEdgesByFile, knownModulePaths, mechanicTypesByFile, maxHopDepth);
    if (successorSearch.status !== "RESOLVED") {
      const successionByStatus = {
        AMBIGUOUS: "AUTHORITY_SUCCESSOR_AMBIGUOUS",
        NO_SUCCESSOR: "AUTHORITY_HAS_NO_CURRENT_SUCCESSOR",
        NOT_DETERMINED_BEYOND_MAX_DEPTH: "AUTHORITY_SUCCESSOR_NOT_DETERMINED_BEYOND_MAX_DEPTH",
      };
      const actionByStatus = {
        AMBIGUOUS: "RECONCILE_MANUALLY_AMBIGUOUS_SUCCESSOR",
        NO_SUCCESSOR: "RECONCILE_MANUALLY_NO_SUCCESSOR",
        NOT_DETERMINED_BEYOND_MAX_DEPTH: "RECONCILE_MANUALLY_NO_SUCCESSOR",
      };
      results.push(Object.freeze({
        authorityFile: filePath,
        declaredSourceFile,
        anchorFile,
        succession: successionByStatus[successorSearch.status],
        successorFile: null,
        hopCount: successorSearch.hopCount,
        mechanicsDeclared: declaredMechanics.length,
        mechanicsPresentInSuccessor: 0,
        recommendedAction: actionByStatus[successorSearch.status],
      }));
      continue;
    }

    const successorTypes = mechanicTypesByFile.get(successorSearch.successorModulePath) ?? new Set();
    const presentCount = declaredMechanics.filter((mechanic) => successorTypes.has(mechanic.mechanic)).length;
    const allPresent = presentCount === declaredMechanics.length;
    const nonePresent = presentCount === 0;

    results.push(Object.freeze({
      authorityFile: filePath,
      declaredSourceFile,
      anchorFile,
      succession: allPresent
        ? "AUTHORITY_SUCCESSOR_RESOLVED"
        : nonePresent
          ? "AUTHORITY_SUCCESSOR_RESOLVED_NO_MECHANIC_OVERLAP"
          : "AUTHORITY_SUCCESSOR_PARTIAL",
      successorFile: successorSearch.successorModulePath,
      hopCount: successorSearch.hopCount,
      mechanicsDeclared: declaredMechanics.length,
      mechanicsPresentInSuccessor: presentCount,
      recommendedAction: allPresent
        ? "REVIEW_AND_REBIND_TO_SUCCESSOR"
        : nonePresent
          ? "RECONCILE_MANUALLY_LOW_CONFIDENCE"
          : "REVIEW_PARTIAL_SUCCESSOR_AND_AUTHOR_GAPS",
    }));
  }

  return results.sort((left, right) => left.authorityFile.localeCompare(right.authorityFile));
}
