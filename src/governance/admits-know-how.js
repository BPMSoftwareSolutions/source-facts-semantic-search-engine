/**
 * Admission is a deterministic shaping of an already-reviewed candidate, not
 * a decision-making step -- the decision (is this candidate trustworthy
 * enough to keep) already happened during human review of the source batch
 * (see reviewOutcomes/reviewFindings in the batch this candidate came from).
 * This function stamps the canonical record and its lifecycle; it does not
 * evaluate whether the candidate deserves admission.
 */
export function admitsKnowHow(candidate, { admittedBy, admittedAtUtc, repositoryId }) {
  return Object.freeze({
    documentKind: "reviewed-engineering-know-how.v1",
    knowHowId: candidate.knowHowId,
    lifecycle: "ADMITTED",
    kind: candidate.kind,
    statement: candidate.statement,
    scope: Object.freeze({ repositoryId, generalizability: candidate.generalizability }),
    evidence: Object.freeze({
      inferenceBatch: candidate.sourceBatchFile,
      reviewFinding: candidate.reviewFinding,
      supportingSubjects: candidate.supportingSubjects,
    }),
    admittedAtUtc,
    admittedBy,
  });
}
