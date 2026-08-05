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

function sourceLocation(occurrence, context) {
  const sourceReferenceId = occurrence.sourceReferenceId ?? null;
  const match = typeof sourceReferenceId === "string"
    ? /^(.*):(\d+):(\d+)$/u.exec(sourceReferenceId)
    : null;
  return {
    modulePath: occurrence.modulePath ?? context.modulePath ?? match?.[1] ?? null,
    startLine: occurrence.sourceStartLine ?? context.sourceStartLine ?? (match === null ? null : Number(match[2])),
    startColumn: occurrence.sourceStartColumn ?? context.sourceStartColumn ?? (match === null ? null : Number(match[3])),
  };
}

export function derivesCanonicalSourceOrderKey(occurrence, context = {}) {
  const mechanicOccurrenceId = occurrence.mechanicId ?? occurrence.mechanicOccurrenceId ?? null;
  const rootId = occurrence.rootId ?? context.rootId ?? null;
  const { modulePath, startLine, startColumn } = sourceLocation(occurrence, context);
  if ([rootId, modulePath, startLine, startColumn, mechanicOccurrenceId].some((value) => value === null)) return null;
  return `${rootId}|${modulePath}|${String(startLine).padStart(10, "0")}:${String(startColumn).padStart(10, "0")}|${mechanicOccurrenceId}`;
}

export function projectsExecutionMechanicAuthorityData(occurrence, context = {}) {
  const mechanicKind = occurrence.mechanic ?? occurrence.mechanicKind ?? null;
  const mechanicOccurrenceId = occurrence.mechanicId ?? occurrence.mechanicOccurrenceId ?? null;
  const authorityFamily = resolvesAuthorityFamily(mechanicKind);
  const authorityKind = resolvesMechanicAuthorityKind(mechanicKind);
  const shape = authorityShapes[mechanicKind];
  const lineageAmbiguous = (context.lineageCandidateCount ?? 0) > 1;
  const effectiveContext = lineageAmbiguous
    ? { ...context, featureId: null, scenarioId: null, obligationId: null, responsibilityId: null }
    : context;
  const lineageFields = ["featureId", "scenarioId", "obligationId", "responsibilityId"];
  const missingLineage = lineageFields.filter((field) => typeof effectiveContext[field] !== "string" || effectiveContext[field].length === 0);
  const rootId = occurrence.rootId ?? context.rootId ?? null;
  const sourceReferenceId = occurrence.sourceReferenceId ?? null;
  const sourceOrderKey = context.sourceOrderKey ?? derivesCanonicalSourceOrderKey(occurrence, context);

  let projectionDisposition = "HUMAN_SEMANTIC_COMPLETION_REQUIRED";
  if (authorityFamily === null || authorityKind === null || shape === undefined) {
    projectionDisposition = "AUTHORITY_FAMILY_UNSUPPORTED";
  } else if (lineageAmbiguous) {
    projectionDisposition = "LINEAGE_CONTEXT_AMBIGUOUS";
  } else if (missingLineage.length > 0) {
    projectionDisposition = "LINEAGE_CONTEXT_INCOMPLETE";
  } else if (mechanicOccurrenceId === null || sourceReferenceId === null || rootId === null) {
    projectionDisposition = "SOURCE_EVIDENCE_INCOMPLETE";
  }

  return Object.freeze({
    ApplicationId: effectiveContext.applicationId ?? null,
    MechanicOccurrenceId: mechanicOccurrenceId,
    MechanicKind: mechanicKind,
    AuthorityFamily: authorityFamily,
    FeatureId: effectiveContext.featureId ?? null,
    ScenarioId: effectiveContext.scenarioId ?? null,
    ObligationId: effectiveContext.obligationId ?? null,
    ResponsibilityId: effectiveContext.responsibilityId ?? null,
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
  const ordered = occurrences.map((occurrence) => {
    const context = contextByOccurrence.get(occurrence.mechanicId) ?? {};
    return { occurrence, context, sourceOrderKey: derivesCanonicalSourceOrderKey(occurrence, context) };
  }).sort((left, right) => {
    if (left.sourceOrderKey === null) return right.sourceOrderKey === null ? 0 : 1;
    if (right.sourceOrderKey === null) return -1;
    return left.sourceOrderKey.localeCompare(right.sourceOrderKey, "en", { sensitivity: "variant" });
  });
  return Object.freeze(ordered.map(({ occurrence, context }, index) => projectsExecutionMechanicAuthorityData(
    occurrence,
    { ...context, observedOrdinal: (index + 1) * 10 },
  )));
}
