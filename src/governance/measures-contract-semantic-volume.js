function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

const artifactSemanticFields = Object.freeze([
  "decisions",
  "semanticEdges",
  "failurePolicies",
  "projectionMappings",
  "resultContracts",
  "responsibilities",
  "declarations",
]);

function emptySemanticElementCounts() {
  return Object.fromEntries([...artifactSemanticFields, "mechanics"].map((field) => [field, 0]));
}

/**
 * Resolves a mechanic's declared "path:line[-line]" sourceLocation against the
 * files this scan actually knows about. Different authority-shaped documents
 * in this repo use different path bases -- the admitted authority declares
 * repo-relative paths ("src/console/serves-query-console.js"), while the draft
 * authority declares paths relative to whatever --workspace it was generated
 * from ("serves-query-console.runtime.impl.mjs", no prefix). An exact match is
 * tried first; if that fails, a unique suffix match ("some/known/path" ending
 * in "/" + declared) is accepted as resolved-by-suffix. More than one file
 * sharing that suffix is reported ambiguous rather than guessed.
 */
export function resolvesMechanicLocationReachability(sourceLocation, knownModulePaths) {
  if (typeof sourceLocation !== "string" || sourceLocation.length === 0) {
    return Object.freeze({ declaredModulePath: null, resolvedModulePath: null, status: "UNRESOLVABLE_LOCATION" });
  }
  const [firstLocation] = sourceLocation.split(",");
  const match = firstLocation.trim().match(/^(.*?):(\d+)(?:-(\d+))?$/);
  const declaredModulePath = normalizesPathKey(match ? match[1] : firstLocation.trim());
  if (declaredModulePath.length === 0) {
    return Object.freeze({ declaredModulePath: null, resolvedModulePath: null, status: "UNRESOLVABLE_LOCATION" });
  }
  if (knownModulePaths.has(declaredModulePath)) {
    return Object.freeze({ declaredModulePath, resolvedModulePath: declaredModulePath, status: "RESOLVED" });
  }
  const suffixMatches = [...knownModulePaths].filter((known) => known.endsWith(`/${declaredModulePath}`));
  if (suffixMatches.length === 1) {
    return Object.freeze({ declaredModulePath, resolvedModulePath: suffixMatches[0], status: "RESOLVED_BY_SUFFIX" });
  }
  if (suffixMatches.length > 1) {
    return Object.freeze({ declaredModulePath, resolvedModulePath: null, status: "AMBIGUOUS" });
  }
  return Object.freeze({ declaredModulePath, resolvedModulePath: null, status: "MOVED_OR_REMOVED" });
}

function countsArtifactSemanticElements(artifact) {
  const sourceAuthority = artifact.sourceAuthority ?? {};
  const counts = {};
  let total = 0;
  for (const field of artifactSemanticFields) {
    const count = Array.isArray(sourceAuthority[field]) ? sourceAuthority[field].length : 0;
    counts[field] = count;
    total += count;
  }
  return { counts, total };
}

/**
 * governed-artifact-contract documents declare their own artifacts[], each
 * with its own relativePath and its own sourceAuthority (decisions, semantic
 * edges, failure policies, ...). Reachability is exact per artifact -- no
 * proportional estimate needed the way a whole-document heuristic would.
 */
function measuresArtifactContract(document, knownModulePaths) {
  const artifacts = Array.isArray(document.artifacts) ? document.artifacts : [];
  const semanticElementCounts = emptySemanticElementCounts();
  let reachableSemanticElements = 0;
  let orphanedSemanticElements = 0;
  const artifactReachability = [];

  for (const artifact of artifacts) {
    const relativePath = normalizesPathKey(artifact.relativePath);
    const reachable = relativePath.length > 0 && knownModulePaths.has(relativePath);
    const { counts, total } = countsArtifactSemanticElements(artifact);
    for (const field of artifactSemanticFields) semanticElementCounts[field] += counts[field];
    if (reachable) reachableSemanticElements += total;
    else orphanedSemanticElements += total;
    artifactReachability.push(Object.freeze({ artifactId: artifact.artifactId ?? null, relativePath: relativePath.length > 0 ? relativePath : null, reachable, semanticElementCount: total }));
  }

  return {
    semanticElementCounts: Object.freeze(semanticElementCounts),
    totalSemanticElements: reachableSemanticElements + orphanedSemanticElements,
    reachableSemanticElements,
    orphanedSemanticElements,
    undeterminedSemanticElements: 0,
    mechanicReachability: null,
    artifactReachability: Object.freeze(artifactReachability),
  };
}

/**
 * authority-declaration-shaped documents (admitted or draft) declare a flat
 * mechanics[] with a sourceLocation each -- the finest-grained evidence this
 * report has. A draft can carry far more mechanics than were ever admitted;
 * this measures how many of ALL of them (admitted or not) still resolve to a
 * real file in the current scan versus one that moved or was removed.
 */
function measuresMechanicDeclarationDocument(document, knownModulePaths) {
  const mechanics = document.authority?.mechanics ?? document.mechanics ?? [];
  const byStatus = { RESOLVED: 0, RESOLVED_BY_SUFFIX: 0, MOVED_OR_REMOVED: 0, AMBIGUOUS: 0, UNRESOLVABLE_LOCATION: 0 };
  for (const mechanic of mechanics) {
    const { status } = resolvesMechanicLocationReachability(mechanic.sourceLocation, knownModulePaths);
    byStatus[status] += 1;
  }
  const resolved = byStatus.RESOLVED + byStatus.RESOLVED_BY_SUFFIX;
  const unresolved = byStatus.MOVED_OR_REMOVED + byStatus.UNRESOLVABLE_LOCATION;
  const ambiguous = byStatus.AMBIGUOUS;
  const total = mechanics.length;

  return {
    semanticElementCounts: Object.freeze({ ...emptySemanticElementCounts(), mechanics: total }),
    totalSemanticElements: total,
    reachableSemanticElements: resolved,
    orphanedSemanticElements: unresolved,
    undeterminedSemanticElements: ambiguous,
    mechanicReachability: Object.freeze({ total, resolved, unresolved, ambiguous, byStatus: Object.freeze({ ...byStatus }) }),
    artifactReachability: null,
  };
}

function emptyMeasurement() {
  return {
    semanticElementCounts: Object.freeze(emptySemanticElementCounts()),
    totalSemanticElements: 0,
    reachableSemanticElements: 0,
    orphanedSemanticElements: 0,
    undeterminedSemanticElements: 0,
    mechanicReachability: null,
    artifactReachability: null,
  };
}

/**
 * "How much declared meaning exists in this repo's contracts, and how much
 * of it is actually reachable from the code currently on disk." A document
 * with real semantic content (decisions, semantic edges, failure policies,
 * mechanics, ...) whose target file no longer exists represents orphaned
 * meaning -- authored, but disconnected from any execution body.
 */
export function measuresContractSemanticVolume(authorityDocuments, knownModulePaths) {
  return authorityDocuments
    .map(({ document, filePath, documentKind }) => {
      const mechanics = document.authority?.mechanics ?? document.mechanics ?? [];
      const hasMechanics = Array.isArray(mechanics) && mechanics.length > 0 && typeof mechanics[0]?.sourceLocation === "string";
      const hasArtifacts = Array.isArray(document.artifacts) && document.artifacts.length > 0;

      const measurement = hasMechanics
        ? measuresMechanicDeclarationDocument(document, knownModulePaths)
        : hasArtifacts
          ? measuresArtifactContract(document, knownModulePaths)
          : emptyMeasurement();

      return Object.freeze({
        authorityFile: filePath,
        documentKind,
        ...measurement,
      });
    })
    .sort((left, right) => right.totalSemanticElements - left.totalSemanticElements || left.authorityFile.localeCompare(right.authorityFile));
}
