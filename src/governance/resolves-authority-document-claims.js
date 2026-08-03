function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

/**
 * Only resolve claimed files where the convention is unambiguous from the
 * document's own content. A governed-artifact-contract's artifacts[].relativePath
 * is repo-root-relative and directly verifiable against real files. Other kinds
 * observed in this repo (semantic-projection-authority.v1, semantic-execution-
 * bundle.v1, governed-artifact-projection-ledger.v1) don't self-declare which
 * file(s) they govern -- that binding only exists via being imported from a
 * specific module, or via a path convention relative to an artifact root this
 * function has no reliable way to resolve. Guessing wrong would be worse than
 * reporting no claimed files: it would attribute a document to the wrong file.
 */
export function resolvesClaimedFiles(documentKind, document) {
  if (documentKind === "governed-artifact-contract") {
    const artifacts = Array.isArray(document.artifacts) ? document.artifacts : [];
    return artifacts
      .map((artifact) => normalizesPathKey(artifact.relativePath))
      .filter((relativePath) => relativePath.length > 0);
  }
  if (typeof document.sourceFile === "string" && document.sourceFile.length > 0) {
    return [normalizesPathKey(document.sourceFile)];
  }
  return [];
}
