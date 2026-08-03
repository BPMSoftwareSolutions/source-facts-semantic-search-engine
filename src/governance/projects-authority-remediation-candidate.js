/**
 * Projects a candidate authority (already identified during review) into its
 * own governed record. This is explicitly NOT authored authority -- lifecycle
 * stays CANDIDATE_NOT_AUTHORED until a human writes and admits a real
 * authority-declaration document. Nothing here authors mechanics,
 * sourceLocations, or any of the semantic content that document would need;
 * it only carries forward the rationale, evidence, and know-how lineage that
 * justified proposing it, so a future authoring step starts from a fully
 * cited proposal rather than a bare idea.
 */
export function projectsAuthorityRemediationCandidate(candidateAuthority, { citesKnowHowIds, sourceEvidence, projectedAtUtc }) {
  return Object.freeze({
    documentKind: "authority-remediation-candidate.v1",
    candidateAuthorityId: candidateAuthority.candidateAuthorityId,
    lifecycle: "CANDIDATE_NOT_AUTHORED",
    family: candidateAuthority.family,
    rationale: candidateAuthority.rationale,
    citesKnowHow: Object.freeze([...citesKnowHowIds]),
    sourceEvidence: Object.freeze({ ...sourceEvidence }),
    projectedAtUtc,
  });
}
