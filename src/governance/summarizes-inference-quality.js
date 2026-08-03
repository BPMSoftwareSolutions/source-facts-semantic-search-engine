const knownReviewOutcomes = Object.freeze(["APPROVED_UNCHANGED", "AMENDED", "APPROVED_WITH_ADDITIONAL_FINDING", "REJECTED"]);

function averages(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Not a benchmark of the model. A benchmark of how efficiently THIS review
 * converted candidate understanding into admitted knowledge -- how much of
 * what the model proposed survived unchanged, how much needed correction,
 * how much confidence review actually removed, and how much new reusable
 * meaning (know-how, candidate authority families) the review itself
 * produced on top of just correcting the model.
 *
 * Every count here is derived from the batch document's own recorded
 * reviewOutcomes[] / reviewFindings[], never invented. A proposal with no
 * recorded outcome counts as unrecordedOutcomes, not as an assumed pass --
 * silence is not review.
 */
export function summarizesInferenceQuality(document) {
  const proposals = Array.isArray(document.proposals) ? document.proposals : [];
  const reviewOutcomes = Array.isArray(document.reviewOutcomes) ? document.reviewOutcomes : [];
  const reviewFindings = Array.isArray(document.reviewFindings) ? document.reviewFindings : [];
  const knowHowExtracted = Array.isArray(document.knowHowExtracted) ? document.knowHowExtracted : [];
  const candidateAuthorities = Array.isArray(document.candidateAuthorities) ? document.candidateAuthorities : [];

  const outcomeByMechanicId = new Map(
    reviewOutcomes.filter((entry) => typeof entry?.authorityMechanicId === "string").map((entry) => [entry.authorityMechanicId, entry.outcome]),
  );
  const findingByMechanicId = new Map(
    reviewFindings.filter((finding) => typeof finding?.authorityMechanicId === "string").map((finding) => [finding.authorityMechanicId, finding]),
  );

  const reviewOutcomeCounts = Object.fromEntries(knownReviewOutcomes.map((outcome) => [outcome, 0]));
  let unrecordedOutcomes = 0;
  for (const proposal of proposals) {
    const outcome = outcomeByMechanicId.get(proposal.authorityMechanicId);
    if (typeof outcome === "string" && knownReviewOutcomes.includes(outcome)) {
      reviewOutcomeCounts[outcome] += 1;
    } else {
      unrecordedOutcomes += 1;
    }
  }

  const modelConfidenceAverage = averages(
    proposals.map((proposal) => proposal.confidence).filter((value) => typeof value === "number"),
  );
  const reviewedConfidenceAverage = averages(
    proposals
      .map((proposal) => {
        const finding = findingByMechanicId.get(proposal.authorityMechanicId);
        return typeof finding?.correctedConfidence === "number" ? finding.correctedConfidence : proposal.confidence;
      })
      .filter((value) => typeof value === "number"),
  );

  const newDeterministicFindingsFromReview = reviewFindings.filter(
    (finding) => typeof finding.additionalFinding === "string" && finding.additionalFinding.length > 0,
  ).length;

  return Object.freeze({
    proposalsGenerated: proposals.length,
    reviewOutcomeCounts: Object.freeze(reviewOutcomeCounts),
    unrecordedOutcomes,
    modelConfidenceAverage,
    reviewedConfidenceAverage,
    newDeterministicFindingsFromReview,
    knowHowExtracted: Object.freeze([...knowHowExtracted]),
    candidateAuthorities: Object.freeze(candidateAuthorities.map((entry) => Object.freeze({
      candidateAuthorityId: typeof entry?.candidateAuthorityId === "string" ? entry.candidateAuthorityId : null,
      family: typeof entry?.family === "string" ? entry.family : null,
      rationale: typeof entry?.rationale === "string" ? entry.rationale : null,
    }))),
  });
}

export { knownReviewOutcomes };
