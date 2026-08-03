import { authorityDeclarationKind } from "./detects-authority-document-kind.js";
import { resolvesClaimedFiles } from "./resolves-authority-document-claims.js";

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
 * Builds two claim tiers per file:
 *  - verified: authority-declaration.v1 documents, whose sourceFile + per-
 *    mechanic sourceLocation this report can check against actual occurrences.
 *  - unverified: every other recognized authority-shaped document (governed-
 *    artifact contracts, projection bundles, ledgers, ...). Their claimed
 *    files (where resolvesClaimedFiles can determine them) still count as "a
 *    home exists" -- just not one this report can confirm covers a specific
 *    mechanic occurrence.
 */
export function buildsAuthorityHomeIndex(authorityDocuments) {
  const verifiedBySourceFile = new Map();
  const unverifiedBySourceFile = new Map();

  for (const { document, filePath, documentKind } of authorityDocuments) {
    if (documentKind === authorityDeclarationKind) {
      const sourceFile = normalizesPathKey(document.sourceFile);
      if (sourceFile.length === 0) continue;
      const claimants = verifiedBySourceFile.get(sourceFile) ?? [];
      claimants.push(filePath);
      verifiedBySourceFile.set(sourceFile, claimants);
      continue;
    }
    for (const claimedFile of resolvesClaimedFiles(documentKind, document)) {
      const claimants = unverifiedBySourceFile.get(claimedFile) ?? [];
      claimants.push({ filePath, documentKind });
      unverifiedBySourceFile.set(claimedFile, claimants);
    }
  }

  return { verifiedBySourceFile, unverifiedBySourceFile };
}

/**
 * modulePath must already be normalized to the same base authority documents
 * use (repository-root-relative), not the workspace-relative path a scan
 * emits -- see joinsRepositoryRelativePath.
 */
export function resolvesAuthorityHomeStatus({ modulePath, isGoverned }, authorityHomeIndex) {
  const normalizedModulePath = normalizesPathKey(modulePath);
  const verifiedClaimants = authorityHomeIndex.verifiedBySourceFile.get(normalizedModulePath) ?? [];
  if (verifiedClaimants.length > 1) {
    return Object.freeze({ status: "AUTHORITY_HOME_AMBIGUOUS", authorityFile: verifiedClaimants[0], authorityHomeVerified: false });
  }
  if (verifiedClaimants.length === 1) {
    return Object.freeze({
      status: isGoverned ? "AUTHORITY_HOME_EXISTS" : "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
      authorityFile: verifiedClaimants[0],
      authorityHomeVerified: true,
    });
  }

  const unverifiedClaimants = authorityHomeIndex.unverifiedBySourceFile.get(normalizedModulePath) ?? [];
  if (unverifiedClaimants.length > 1) {
    return Object.freeze({ status: "AUTHORITY_HOME_AMBIGUOUS", authorityFile: unverifiedClaimants[0].filePath, authorityHomeVerified: false });
  }
  if (unverifiedClaimants.length === 1) {
    return Object.freeze({
      status: "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
      authorityFile: unverifiedClaimants[0].filePath,
      authorityHomeVerified: false,
    });
  }

  return Object.freeze({ status: "AUTHORITY_HOME_MISSING", authorityFile: null, authorityHomeVerified: false });
}

export function joinsRepositoryRelativePath(workspaceRelativePrefix, modulePath) {
  const normalizedModulePath = normalizesPathKey(modulePath);
  if (typeof workspaceRelativePrefix !== "string" || workspaceRelativePrefix.length === 0) {
    return normalizedModulePath;
  }
  return `${normalizesPathKey(workspaceRelativePrefix)}/${normalizedModulePath}`;
}

export { knownHomeStatuses };
