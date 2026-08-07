import crypto from "node:crypto";

/**
 * Projects an auditable query receipt that combines query + results into a verifiable hash.
 * Enables reports to reference query/result pairs by hash and regenerate them for inspection.
 */
export function projectsAuditableQueryReceipt(receipt, queryText, results) {
  if (!receipt || !queryText || results === undefined) {
    return receipt;
  }

  // Normalize query text (remove extra whitespace for determinism)
  const normalizedQuery = queryText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ");

  // Serialize results deterministically (sorted JSON)
  const resultJson = JSON.stringify(results, (key, value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  });

  // Combine query + results for content-addressable proof
  const queryResultContent = `${normalizedQuery}\n---\n${resultJson}`;

  // Generate SHA256 hash of combined content
  const contentHash = crypto
    .createHash("sha256")
    .update(queryResultContent)
    .digest("hex");

  // Generate metadata hash (query signature only, for query verification)
  const queryHash = crypto
    .createHash("sha256")
    .update(normalizedQuery)
    .digest("hex");

  // Enhance receipt with hashes
  const auditableReceipt = {
    ...receipt,
    auditability: {
      queryHash: queryHash, // Uniquely identifies this query
      resultHash: crypto
        .createHash("sha256")
        .update(resultJson)
        .digest("hex"), // Uniquely identifies these results
      contentHash: contentHash, // Combines query + results (proof of execution)
      contentAddressable: true, // Can regenerate by hash
      timestamp: new Date().toISOString(),
      queryLength: normalizedQuery.length,
      resultSize: resultJson.length,
    },
  };

  return auditableReceipt;
}

/**
 * Validates that a query receipt's hashes are consistent with query/results
 */
export function validatesAuditableReceipt(receipt, queryText, results) {
  if (
    !receipt?.auditability ||
    !queryText ||
    results === undefined
  ) {
    return {
      valid: false,
      reason: "Missing auditability metadata or query/results",
    };
  }

  const auditableReceipt = projectsAuditableQueryReceipt(receipt, queryText, results);

  const contentHashMatches =
    auditableReceipt.auditability.contentHash ===
    receipt.auditability.contentHash;
  const queryHashMatches =
    auditableReceipt.auditability.queryHash === receipt.auditability.queryHash;
  const resultHashMatches =
    auditableReceipt.auditability.resultHash === receipt.auditability.resultHash;

  return {
    valid: contentHashMatches && queryHashMatches && resultHashMatches,
    contentHashValid: contentHashMatches,
    queryHashValid: queryHashMatches,
    resultHashValid: resultHashMatches,
    reason: contentHashMatches
      ? "Valid"
      : "Content hash mismatch - query or results modified",
  };
}

/**
 * Creates a reference to a query/result pair by hash for use in reports
 */
export function createsQueryReference(receipt, queryName) {
  if (!receipt?.auditability) {
    return null;
  }

  return {
    queryName: queryName,
    queryHash: receipt.auditability.queryHash, // Reference to specific query
    contentHash: receipt.auditability.contentHash, // Reference to specific query + results
    shortHash: receipt.auditability.contentHash.substring(0, 12), // For readability
    timestamp: receipt.auditability.timestamp,
    queryLength: receipt.auditability.queryLength,
    resultSize: receipt.auditability.resultSize,
  };
}

/**
 * Formats query references for reports with hashes as evidence
 */
export function formatsQueryEvidenceForReport(queryReferences) {
  if (!Array.isArray(queryReferences)) {
    return "";
  }

  return queryReferences
    .map((ref) => {
      return `**Query:** \`${ref.queryName}\`
\`\`\`
Hash: ${ref.shortHash}
Content: ${ref.contentHash}
\`\`\``;
    })
    .join("\n\n");
}

/**
 * Hash-based evidence registry for auditable queries.
 * Stores hashes and metadata that reference governance artifacts.
 * No physical file persistence - hashes point back to live governance queries.
 */
export class QueryEvidenceRegistry {
  constructor() {
    this.hashes = new Map(); // Map<contentHash, {queryName, queryHash, metadata}>
    this.queryNames = new Map(); // Map<queryName, contentHash>
  }

  /**
   * Register query/result hash as evidence (metadata only, not full data)
   * Hash can be verified by re-running the query against governance artifacts
   */
  register(queryName, queryText, results, receipt) {
    const auditableReceipt = projectsAuditableQueryReceipt(
      receipt,
      queryText,
      results
    );

    const contentHash = auditableReceipt.auditability.contentHash;
    const queryHash = auditableReceipt.auditability.queryHash;

    this.hashes.set(contentHash, {
      queryName: queryName,
      queryHash: queryHash,
      contentHash: contentHash,
      timestamp: auditableReceipt.auditability.timestamp,
      queryLength: auditableReceipt.auditability.queryLength,
      resultSize: auditableReceipt.auditability.resultSize,
      governance: {
        artifact: `source-facts-self-governance-report.v1.json`,
        queryId: receipt.queryId || "unknown",
      },
    });

    this.queryNames.set(queryName, contentHash);
  }

  /**
   * Look up hash evidence by query name
   * Returns metadata that can be used to verify/regenerate via governance artifacts
   */
  evidence(queryName) {
    const contentHash = this.queryNames.get(queryName);
    if (!contentHash) return null;
    return this.hashes.get(contentHash);
  }

  /**
   * List all registered query hashes as evidence
   */
  allEvidence() {
    return Array.from(this.hashes.values());
  }

  /**
   * Export evidence references for reports
   * These are hashes that reference governance artifacts, not file receipts
   */
  exportEvidence() {
    return {
      documentKind: "query-evidence-registry.v1",
      purpose: "Hash-based evidence referencing governance artifacts",
      registryNote: "Hashes reference live governance queries - not persisted query files",
      registeredAt: new Date().toISOString(),
      evidenceCount: this.hashes.size,
      evidence: Array.from(this.hashes.values()).map((entry) => ({
        queryName: entry.queryName,
        shortHash: entry.contentHash.substring(0, 12),
        contentHash: entry.contentHash,
        queryHash: entry.queryHash,
        governance: entry.governance,
        timestamp: entry.timestamp,
      })),
    };
  }
}
