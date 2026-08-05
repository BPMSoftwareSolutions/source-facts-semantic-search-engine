export const mechanicAuthorityFamilies = Object.freeze([
  Object.freeze({ mechanicKind: "branch", authorityFamily: "decision-authority", authorityKind: "decision-authority.v1" }),
  Object.freeze({ mechanicKind: "iteration", authorityFamily: "iteration-authority", authorityKind: "iteration-authority.v1" }),
  Object.freeze({ mechanicKind: "exception-handling", authorityFamily: "failure-policy-authority", authorityKind: "failure-observation-authority.v1" }),
  Object.freeze({ mechanicKind: "throw", authorityFamily: "terminal-result-authority", authorityKind: "terminal-disposition-authority.v1" }),
  Object.freeze({ mechanicKind: "object-construction", authorityFamily: "projection-authority", authorityKind: "semantic-projection-authority.v1" }),
  Object.freeze({ mechanicKind: "serialization", authorityFamily: "serialization-profile-authority", authorityKind: "serialization-profile-authority.v1" }),
  Object.freeze({ mechanicKind: "normalization", authorityFamily: "normalization-authority", authorityKind: "canonicalization-authority.v1" }),
  Object.freeze({ mechanicKind: "validation", authorityFamily: "validation-authority", authorityKind: "constraint-authority.v1" }),
  Object.freeze({ mechanicKind: "fallback", authorityFamily: "alternative-selection-authority", authorityKind: "alternative-selection-authority.v1" }),
  Object.freeze({ mechanicKind: "retry", authorityFamily: "retry-policy-authority", authorityKind: "retry-policy-authority.v1" }),
  Object.freeze({ mechanicKind: "state-mutation", authorityFamily: "state-transition-authority", authorityKind: "state-transition-authority.v1" }),
  Object.freeze({ mechanicKind: "meaning-hidden-in-text", authorityFamily: "text-meaning-authority", authorityKind: "text-meaning-authority.v1" }),
]);

const primaryAuthorityFamilyByMechanic = new Map(
  mechanicAuthorityFamilies.map((entry) => [entry.mechanicKind, entry.authorityFamily]),
);

const authorityKindByMechanic = new Map(
  mechanicAuthorityFamilies.map((entry) => [entry.mechanicKind, entry.authorityKind]),
);

export function resolvesAuthorityFamily(mechanic) {
  return primaryAuthorityFamilyByMechanic.get(mechanic) ?? null;
}

export function resolvesMechanicAuthorityKind(mechanic) {
  return authorityKindByMechanic.get(mechanic) ?? null;
}
