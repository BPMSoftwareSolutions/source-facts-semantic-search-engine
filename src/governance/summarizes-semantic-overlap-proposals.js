import { summarizesInferenceQuality } from "./summarizes-inference-quality.js";

function tallyDispositions(dispositions) {
  const counts = {};
  for (const disposition of dispositions) {
    if (typeof disposition !== "string" || disposition.length === 0) continue;
    counts[disposition] = (counts[disposition] ?? 0) + 1;
  }
  return counts;
}

/**
 * The report never trusts a batch file's own precomputed summary block --
 * the same "verify, don't trust a document's self-reported claim" rule
 * findsDanglingAuthoritySources and buildsAuthorityHomeIndex already apply to
 * authority documents. modelDispositionCounts and reviewedDispositionCounts
 * are both derived here directly from proposals[] and reviewFindings[]: the
 * former is exactly what the model returned, the latter applies any recorded
 * reviewFindings[].correctedDisposition on top. A proposal with no matching
 * review finding keeps its original model disposition in both tallies --
 * "not yet reviewed" is not the same as "reviewed and confirmed."
 */
export function summarizesSemanticOverlapProposalBatch({ filePath, document }) {
  const proposals = Array.isArray(document.proposals) ? document.proposals : [];
  const reviewFindings = Array.isArray(document.reviewFindings) ? document.reviewFindings : [];
  const reviewFindingByMechanicId = new Map(
    reviewFindings
      .filter((finding) => typeof finding?.authorityMechanicId === "string")
      .map((finding) => [finding.authorityMechanicId, finding]),
  );

  const modelDispositionCounts = tallyDispositions(proposals.map((proposal) => proposal.overlapDisposition));
  const reviewedDispositionCounts = tallyDispositions(
    proposals.map((proposal) => reviewFindingByMechanicId.get(proposal.authorityMechanicId)?.correctedDisposition ?? proposal.overlapDisposition),
  );

  return Object.freeze({
    proposalFile: filePath,
    lifecycle: typeof document.lifecycle === "string" ? document.lifecycle : "UNKNOWN",
    historicalAuthorityFile: document.subject?.historicalAuthorityFile ?? null,
    resolvedSuccessorFile: document.subject?.resolvedSuccessorFile ?? null,
    inferenceModel: document.inference?.resolvedModel ?? null,
    inferredAtUtc: document.inference?.completedAt ?? null,
    totalProposed: proposals.length,
    modelDispositionCounts: Object.freeze(modelDispositionCounts),
    reviewedDispositionCounts: Object.freeze(reviewedDispositionCounts),
    reviewFindings: Object.freeze(reviewFindings.map((finding) => Object.freeze({
      authorityMechanicId: typeof finding?.authorityMechanicId === "string" ? finding.authorityMechanicId : null,
      reviewVerdict: typeof finding?.reviewVerdict === "string" ? finding.reviewVerdict : null,
      correctedDisposition: typeof finding?.correctedDisposition === "string" ? finding.correctedDisposition : null,
      reason: typeof finding?.reason === "string" ? finding.reason : null,
    }))),
    inferenceQuality: summarizesInferenceQuality(document),
  });
}
