export const authorityDeclarationKind = "authority-declaration.v1";

/**
 * This repo already has several authority/governance JSON conventions beyond
 * authority-declaration.v1 (semantic-projection-authority.v1, semantic-execution-
 * bundle.v1, governed-artifact-projection-ledger.v1, and full governed-artifact
 * contracts with no schemaVersion at all, identified only by contract.contractId).
 * Detect any of them by their known marker field so none are silently treated as
 * "not an authority document" just because they don't match the one schema this
 * report knows how to verify mechanic-by-mechanic.
 */
export function detectsAuthorityDocumentKind(document) {
  if (document === null || typeof document !== "object") return null;
  if (typeof document.schemaVersion === "string" && document.schemaVersion.length > 0) return document.schemaVersion;
  if (typeof document.authorityType === "string" && document.authorityType.length > 0) return document.authorityType;
  if (typeof document.bundleType === "string" && document.bundleType.length > 0) return document.bundleType;
  if (typeof document.ledgerType === "string" && document.ledgerType.length > 0) return document.ledgerType;
  if (typeof document.contract?.contractId === "string" && document.contract.contractId.length > 0) return "governed-artifact-contract";
  return null;
}
