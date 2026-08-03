function tallies(values) {
  const counts = {};
  for (const value of values) {
    if (typeof value !== "string" || value.length === 0) continue;
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

/**
 * A purely descriptive rollup of what's been admitted so far -- never a
 * source of governance evidence itself. Distinguishes admitted know-how
 * (durable, reviewed knowledge) from authority-remediation candidates (still
 * explicitly un-authored, lifecycle CANDIDATE_NOT_AUTHORED) so the report
 * never implies a candidate is already governing anything.
 */
export function summarizesKnowHowRegistry({ admittedKnowHow, authorityRemediationCandidates }) {
  const knowHowRecords = admittedKnowHow.map(({ filePath, document }) => Object.freeze({
    recordFile: filePath,
    knowHowId: typeof document.knowHowId === "string" ? document.knowHowId : null,
    lifecycle: typeof document.lifecycle === "string" ? document.lifecycle : "UNKNOWN",
    kind: typeof document.kind === "string" ? document.kind : "unclassified",
    generalizability: typeof document.scope?.generalizability === "string" ? document.scope.generalizability : "unclassified",
    statement: typeof document.statement === "string" ? document.statement : "",
    inferenceBatch: document.evidence?.inferenceBatch ?? null,
  }));

  const remediationCandidates = authorityRemediationCandidates.map(({ filePath, document }) => Object.freeze({
    recordFile: filePath,
    candidateAuthorityId: typeof document.candidateAuthorityId === "string" ? document.candidateAuthorityId : null,
    lifecycle: typeof document.lifecycle === "string" ? document.lifecycle : "UNKNOWN",
    family: typeof document.family === "string" ? document.family : null,
    rationale: typeof document.rationale === "string" ? document.rationale : "",
    citesKnowHow: Object.freeze(Array.isArray(document.citesKnowHow) ? [...document.citesKnowHow] : []),
  }));

  return Object.freeze({
    admittedKnowHowCount: knowHowRecords.length,
    byKind: Object.freeze(tallies(knowHowRecords.map((record) => record.kind))),
    byGeneralizability: Object.freeze(tallies(knowHowRecords.map((record) => record.generalizability))),
    knowHowRecords: Object.freeze(knowHowRecords),
    authorityRemediationCandidateCount: remediationCandidates.length,
    authorityRemediationCandidates: Object.freeze(remediationCandidates),
  });
}
