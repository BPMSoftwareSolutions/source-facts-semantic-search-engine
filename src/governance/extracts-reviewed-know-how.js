const knownKnowHowKinds = Object.freeze([
  "governance-invariant",
  "implementation-gap",
  "analysis-limitation",
  "domain-principle",
  "operational-procedure",
  "security-rule",
  "business-rule",
  "projection-opportunity",
]);

function slugify(value) {
  return value.replaceAll(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

/**
 * Extraction never classifies -- it only shapes and validates whatever kind
 * and generalizability a batch's own knowHowExtracted[] already declared
 * during review. A candidate with no recorded kind, or a legacy batch
 * authored before this shape existed (a bare string), surfaces as
 * "unclassified" rather than being assigned a guessed category: admission is
 * for a human to decide, extraction only carries forward what review
 * actually recorded.
 */
export function extractsReviewedKnowHow({ filePath, document }) {
  const entries = Array.isArray(document.knowHowExtracted) ? document.knowHowExtracted : [];
  return entries.map((entry, index) => {
    if (typeof entry === "string") {
      return Object.freeze({
        knowHowId: `${slugify(filePath)}-know-how-${index + 1}`,
        statement: entry,
        kind: "unclassified",
        generalizability: "unclassified",
        reviewFinding: null,
        supportingSubjects: Object.freeze([]),
        sourceBatchFile: filePath,
      });
    }
    return Object.freeze({
      knowHowId: typeof entry?.knowHowId === "string" ? entry.knowHowId : `${slugify(filePath)}-know-how-${index + 1}`,
      statement: typeof entry?.statement === "string" ? entry.statement : "",
      kind: knownKnowHowKinds.includes(entry?.kind) ? entry.kind : "unclassified",
      generalizability: typeof entry?.generalizability === "string" ? entry.generalizability : "unclassified",
      reviewFinding: typeof entry?.reviewFinding === "string" ? entry.reviewFinding : null,
      supportingSubjects: Object.freeze(Array.isArray(entry?.supportingSubjects) ? [...entry.supportingSubjects] : []),
      sourceBatchFile: filePath,
    });
  });
}

export { knownKnowHowKinds };
