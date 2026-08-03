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

function isJsonImport(specifier) {
  return typeof specifier === "string" && specifier.toLowerCase().endsWith(".json");
}

function isSemanticRuntimeImport(specifier) {
  return typeof specifier === "string" && semanticRuntimeMarkers.some((marker) => specifier.includes(marker));
}

function resolvesWiringDisposition({ importsContractData, invokesSemanticRuntime }) {
  if (importsContractData.length > 0 && invokesSemanticRuntime.length > 0) return "DIRECT_DATA_AND_RUNTIME";
  if (invokesSemanticRuntime.length > 0) return "RUNTIME_ONLY";
  if (importsContractData.length > 0) return "DATA_ONLY";
  return "NONE";
}

/**
 * Answers a different question than posture or authorityHomeStatus: not
 * "is this occurrence governed" or "does an authority document claim this
 * file," but "does this file's own source code already import a JSON
 * contract/authority/bundle artifact and/or invoke a semantic execution
 * runtime." That's derived directly from the scanner's "dependency"
 * relationships -- real import statements, not inferred from documents.
 *
 * This is one-hop only: it does not follow the local import graph (e.g. a
 * file that imports a helper which itself imports the runtime is not
 * detected here). Chasing that transitively is a real added complexity
 * (relative-path resolution, cycles) left for a later pass.
 */
export function resolvesDataDrivenWiring(index, workspaceRelativePrefix, modulePaths) {
  const sourceReferenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
  const wanted = modulePaths instanceof Set ? modulePaths : new Set(modulePaths);
  const byFile = new Map();

  for (const relationship of index.relationships) {
    if (relationship.relationshipKind !== "dependency") continue;
    const sourceReference = sourceReferenceById.get(relationship.sourceReferenceId);
    if (sourceReference === undefined) continue;
    const modulePath = joinsRepositoryRelativePath(workspaceRelativePrefix, sourceReference.modulePath);
    if (wanted.size > 0 && !wanted.has(modulePath)) continue;

    const specifier = relationship.toSymbolCandidate;
    const entry = byFile.get(modulePath) ?? { modulePath, importsContractData: [], invokesSemanticRuntime: [] };
    if (isJsonImport(specifier)) entry.importsContractData.push(specifier);
    if (isSemanticRuntimeImport(specifier)) entry.invokesSemanticRuntime.push(specifier);
    byFile.set(modulePath, entry);
  }

  return [...byFile.values()]
    .map((entry) => Object.freeze({ ...entry, wiringDisposition: resolvesWiringDisposition(entry) }))
    .sort((left, right) => left.modulePath.localeCompare(right.modulePath));
}
