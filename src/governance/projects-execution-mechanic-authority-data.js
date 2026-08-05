import {
  resolvesAuthorityFamily,
  resolvesMechanicAuthorityKind,
} from "./mechanic-authority-families.js";

const authorityShapes = Object.freeze({
  branch: Object.freeze({ fields: Object.freeze({ inputs: [], rules: [], outcomes: [], noMatchDisposition: null }), missing: Object.freeze(["inputs", "rules", "outcomes", "noMatchDisposition"]) }),
  iteration: Object.freeze({ fields: Object.freeze({ collectionInputId: null, itemBindingId: null, ordering: null, continuation: null, termination: null }), missing: Object.freeze(["collectionInputId", "itemBindingId", "ordering", "continuation", "termination"]) }),
  "exception-handling": Object.freeze({ fields: Object.freeze({ observedFailures: [], dispositions: [], unhandledDisposition: null }), missing: Object.freeze(["observedFailures", "dispositions", "unhandledDisposition"]) }),
  throw: Object.freeze({ fields: Object.freeze({ terminalDisposition: null, resultOutputId: null }), missing: Object.freeze(["terminalDisposition", "resultOutputId"]) }),
  "object-construction": Object.freeze({ fields: Object.freeze({ projectionId: null, fieldMappings: [], unmappedFieldDisposition: null }), missing: Object.freeze(["projectionId", "fieldMappings", "unmappedFieldDisposition"]) }),
  serialization: Object.freeze({ fields: Object.freeze({ profileId: null, mediaType: null, encoding: null, rules: [] }), missing: Object.freeze(["profileId", "mediaType", "encoding", "rules"]) }),
  normalization: Object.freeze({ fields: Object.freeze({ inputId: null, outputId: null, operations: [], ambiguityDisposition: null }), missing: Object.freeze(["inputId", "outputId", "operations", "ambiguityDisposition"]) }),
  validation: Object.freeze({ fields: Object.freeze({ inputIds: [], constraints: [], validOutcome: null, invalidOutcome: null }), missing: Object.freeze(["inputIds", "constraints", "validOutcome", "invalidOutcome"]) }),
  fallback: Object.freeze({ fields: Object.freeze({ alternatives: [], selectionOrder: [], exhaustedDisposition: null }), missing: Object.freeze(["alternatives", "selectionOrder", "exhaustedDisposition"]) }),
  retry: Object.freeze({ fields: Object.freeze({ operationId: null, maximumAttempts: null, retryableDispositions: [], backoff: null, exhaustedDisposition: null }), missing: Object.freeze(["operationId", "maximumAttempts", "retryableDispositions", "backoff", "exhaustedDisposition"]) }),
  "state-mutation": Object.freeze({ fields: Object.freeze({ stateId: null, fromStates: [], transitions: [], guards: [], effectId: null }), missing: Object.freeze(["stateId", "fromStates", "transitions", "guards", "effectId"]) }),
  "meaning-hidden-in-text": Object.freeze({ fields: Object.freeze({ vocabularyId: null, meanings: [], templates: [], unknownTextDisposition: null }), missing: Object.freeze(["vocabularyId", "meanings", "templates", "unknownTextDisposition"]) }),
});

function copiesAuthorityData(shape, authorityKind, mechanicOccurrenceId) {
  return Object.freeze({
    authorityKind,
    candidateAuthorityId: `candidate-${mechanicOccurrenceId}`,
    ...shape.fields,
  });
}

export function projectsExecutionMechanicAuthorityData(occurrence, context = {}) {
  const mechanicKind = occurrence.mechanic ?? occurrence.mechanicKind ?? null;
  const mechanicOccurrenceId = occurrence.mechanicId ?? occurrence.mechanicOccurrenceId ?? null;
  const authorityFamily = resolvesAuthorityFamily(mechanicKind);
  const authorityKind = resolvesMechanicAuthorityKind(mechanicKind);
  const shape = authorityShapes[mechanicKind];
  const lineageFields = ["featureId", "scenarioId", "obligationId", "responsibilityId"];
  const missingLineage = lineageFields.filter((field) => typeof context[field] !== "string" || context[field].length === 0);
  const rootId = occurrence.rootId ?? context.rootId ?? null;
  const sourceReferenceId = occurrence.sourceReferenceId ?? null;
  const sourceOrderKey = context.sourceOrderKey
    ?? (rootId === null || sourceReferenceId === null || mechanicOccurrenceId === null
      ? null
      : `${rootId}|${sourceReferenceId}|${mechanicOccurrenceId}`);

  let projectionDisposition = "HUMAN_SEMANTIC_COMPLETION_REQUIRED";
  if (authorityFamily === null || authorityKind === null || shape === undefined) {
    projectionDisposition = "AUTHORITY_FAMILY_UNSUPPORTED";
  } else if (missingLineage.length > 0) {
    projectionDisposition = "LINEAGE_CONTEXT_INCOMPLETE";
  } else if (mechanicOccurrenceId === null || sourceReferenceId === null || rootId === null) {
    projectionDisposition = "SOURCE_EVIDENCE_INCOMPLETE";
  }

  return Object.freeze({
    ApplicationId: context.applicationId ?? null,
    MechanicOccurrenceId: mechanicOccurrenceId,
    MechanicKind: mechanicKind,
    AuthorityFamily: authorityFamily,
    FeatureId: context.featureId ?? null,
    ScenarioId: context.scenarioId ?? null,
    ObligationId: context.obligationId ?? null,
    ResponsibilityId: context.responsibilityId ?? null,
    SourceFactIndexId: context.sourceFactIndexId ?? context.indexId ?? null,
    RootId: rootId,
    SourceReferenceId: sourceReferenceId,
    SourceStartOffset: occurrence.sourceStartOffset ?? context.sourceStartOffset ?? null,
    SourceOrderKey: sourceOrderKey,
    ObservedOrdinal: context.observedOrdinal ?? null,
    ExecutionOrdinal: null,
    OccurrenceApplicabilityDisposition:
      context.occurrenceApplicabilityDisposition ?? "HUMAN_CLASSIFICATION_REQUIRED",
    AuthorityData: shape === undefined ? null : copiesAuthorityData(shape, authorityKind, mechanicOccurrenceId),
    ProjectionDisposition: projectionDisposition,
    MissingFields: Object.freeze([
      ...missingLineage,
      "executionOrdinal",
      ...(shape?.missing ?? []),
    ]),
    FieldDerivations: Object.freeze([
      Object.freeze({ FieldPath: "SourceOrderKey", Derivation: "deterministic" }),
      Object.freeze({ FieldPath: "ObservedOrdinal", Derivation: "deterministic" }),
      Object.freeze({ FieldPath: "ExecutionOrdinal", Derivation: "unresolved" }),
      Object.freeze({ FieldPath: "AuthorityData.candidateAuthorityId", Derivation: "deterministic" }),
    ]),
  });
}

export function projectsExecutionMechanicAuthorityRows(occurrences, contextByOccurrence = new Map()) {
  return Object.freeze(occurrences.map((occurrence, index) => projectsExecutionMechanicAuthorityData(
    occurrence,
    { observedOrdinal: (index + 1) * 10, ...(contextByOccurrence.get(occurrence.mechanicId) ?? {}) },
  )));
}
