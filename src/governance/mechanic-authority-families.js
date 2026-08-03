/**
 * Mirrors the mechanic -> primary authority family mapping already used by
 * AuthorityCandidateProjector (src/projects-authority-candidates.js) and
 * AuthorityProjectorFromViolations (src/projects-authority-from-violations.js).
 * Kept as a standalone lookup here rather than importing those classes so the
 * governance report doesn't depend on projector machinery it doesn't use.
 */
const primaryAuthorityFamilyByMechanic = Object.freeze({
  branch: "decision",
  iteration: "iteration",
  "exception-handling": "failure-policy",
  throw: "failure-disposition",
  "object-construction": "projection-mapping",
  serialization: "serialization-profile",
  normalization: "translation",
  validation: "validation-policy",
  fallback: "missing-value-policy",
  retry: "continuation-policy",
  "state-mutation": "state-transition",
  "meaning-hidden-in-text": "concept",
});

export function resolvesAuthorityFamily(mechanic) {
  return primaryAuthorityFamilyByMechanic[mechanic] ?? "unclassified";
}
