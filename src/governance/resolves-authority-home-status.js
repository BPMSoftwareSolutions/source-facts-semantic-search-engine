const knownHomeStatuses = Object.freeze([
  "AUTHORITY_HOME_EXISTS",
  "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
  "AUTHORITY_HOME_MISSING",
  "AUTHORITY_HOME_AMBIGUOUS",
]);

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

/**
 * Indexes admitted authority documents by the single file each one claims to
 * govern (authorityDocument.sourceFile). More than one document claiming the
 * same source file is a real authoring conflict, not something to silently
 * pick a winner for -- it surfaces as AUTHORITY_HOME_AMBIGUOUS.
 */
export function buildsAuthorityHomeIndex(authorityDocuments) {
  const bySourceFile = new Map();
  for (const { document, filePath } of authorityDocuments) {
    if (document?.schemaVersion !== "authority-declaration.v1") continue;
    const sourceFile = normalizesPathKey(document.sourceFile);
    if (sourceFile.length === 0) continue;
    const claimants = bySourceFile.get(sourceFile) ?? [];
    claimants.push(filePath);
    bySourceFile.set(sourceFile, claimants);
  }
  return bySourceFile;
}

/**
 * modulePath must already be normalized to the same base authority documents
 * use (repository-root-relative), not the workspace-relative path a scan
 * emits -- see joinsRepositoryRelativePath.
 */
export function resolvesAuthorityHomeStatus({ modulePath, isGoverned }, authorityHomeIndex) {
  const claimants = authorityHomeIndex.get(normalizesPathKey(modulePath)) ?? [];
  if (claimants.length === 0) {
    return Object.freeze({ status: "AUTHORITY_HOME_MISSING", authorityFile: null });
  }
  if (claimants.length > 1) {
    return Object.freeze({ status: "AUTHORITY_HOME_AMBIGUOUS", authorityFile: claimants[0] });
  }
  return Object.freeze({
    status: isGoverned ? "AUTHORITY_HOME_EXISTS" : "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
    authorityFile: claimants[0],
  });
}

export function joinsRepositoryRelativePath(workspaceRelativePrefix, modulePath) {
  const normalizedModulePath = normalizesPathKey(modulePath);
  if (typeof workspaceRelativePrefix !== "string" || workspaceRelativePrefix.length === 0) {
    return normalizedModulePath;
  }
  return `${normalizesPathKey(workspaceRelativePrefix)}/${normalizedModulePath}`;
}

export { knownHomeStatuses };
