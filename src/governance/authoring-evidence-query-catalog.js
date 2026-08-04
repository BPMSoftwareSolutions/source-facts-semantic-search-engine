import { createHash } from "node:crypto";

const next = (queryId, label, parameterBindings = {}) => ({ queryId, label, parameterBindings });
const parameter = (name) => ({ name, type: "string", required: false, nullable: true });

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}

function rowId(queryId, identity) {
  const hash = createHash("sha256").update(JSON.stringify(canonicalizes(identity)), "utf8").digest("hex");
  return `${queryId}:sha256:${hash}`;
}

function identifies(queryId, rows, identityKeys = []) {
  return rows.map((row, position) => ({
    resultRowId: rowId(queryId, identityKeys.length > 0
      ? Object.fromEntries(identityKeys.map((key) => [key, row[key] ?? null]))
      : { position, row }),
    ...row,
  }));
}

function groupsBy(rows, key) {
  const grouped = new Map();
  for (const row of rows) {
    const value = typeof key === "function" ? key(row) : row[key];
    const bucket = grouped.get(value) ?? [];
    bucket.push(row);
    grouped.set(value, bucket);
  }
  return grouped;
}

function scenarioResponsibilities(context) {
  return context.scenarioConformance.features.flatMap((feature) => feature.scenarios.flatMap((scenario) => (
    scenario.obligations.flatMap((obligation) => obligation.responsibilities.map((responsibility) => ({
      featureId: feature.featureId,
      scenarioId: scenario.scenarioId,
      scenarioPurpose: scenario.purpose,
      obligationId: obligation.obligationId,
      obligationStatement: obligation.statement,
      responsibilityId: responsibility.responsibilityId,
      bodyFile: responsibility.bodyFile,
      authorityFile: feature.authorityFile,
      structuralStatus: scenario.structuralStatus,
      runtimeConformance: scenario.runtimeConformance,
    })))
  )));
}

function buildsAuthoringCollections(context) {
  const index = context.sourceIndex;
  const symbols = new Map((index.symbols ?? []).map((row) => [row.symbolId, row]));
  const references = new Map((index.sourceReferences ?? []).map((row) => [row.referenceId, row]));
  const relationshipsBySymbol = groupsBy(index.relationships ?? [], (row) => row.fromSymbolId ?? null);
  const relationshipsByReference = groupsBy(index.relationships ?? [], "sourceReferenceId");
  const dataflowsBySymbol = groupsBy(index.dataflows ?? [], (row) => row.enclosingSymbolId ?? null);
  const callPathsBySymbol = groupsBy(context.callPathRows, "symbolId");
  const responsibilities = scenarioResponsibilities(context);
  const responsibilitiesByBody = groupsBy(responsibilities, "bodyFile");
  const candidateOccurrences = context.occurrenceEvidence
    .filter((row) => row.featureCoveragePosture === "FEATURE_COVERAGE_MISSING");
  const candidateSymbolIds = [...new Set(candidateOccurrences.map((row) => row.symbolId).filter(Boolean))].sort();
  const responsibilityBodyFiles = new Set(responsibilities.map((row) => row.bodyFile));
  const prefix = context.subjectScope.workspaceRelativePrefix;
  const repositoryModulePath = (modulePath) => typeof modulePath !== "string" ? null
    : !prefix || modulePath === prefix || modulePath.startsWith(`${prefix}/`) ? modulePath : `${prefix}/${modulePath}`;
  const authoringSymbolIds = [...new Set([
    ...candidateSymbolIds,
    ...(index.symbols ?? []).filter((row) => responsibilityBodyFiles.has(repositoryModulePath(row.modulePath))).map((row) => row.symbolId),
  ])].sort();
  const interfaceSubjects = [
    ...candidateSymbolIds.map((symbolId) => candidateOccurrences.find((row) => row.symbolId === symbolId)),
    ...candidateOccurrences.filter((row) => !row.symbolId),
    ...responsibilities.map((row) => ({
      occurrenceId: null,
      sourceReferenceId: null,
      symbolId: null,
      responsibility: row.responsibilityId,
      modulePath: row.bodyFile,
      declaredResponsibility: row,
    })),
  ];
  const contractMapRows = identifies("authoring.contract-map.v1", (context.authoringContractMap?.entries ?? []).map((entry) => ({
    ...entry,
    engineVersion: context.authoringContractMap.engineVersion,
    contractMapDisposition: context.authoringContractMap.disposition,
    compatibleProjectorIds: (context.authoringContractMap.projectors ?? []).map((projector) => projector.projectorId),
    compatibleVerifierIds: (context.authoringContractMap.verifiers ?? []).map((verifier) => verifier.verifierId),
  })), ["authorityFacet", "schemaFile", "jsonPointer"]);

  const interfaceRows = identifies("authoring.interface-execution-slice.v1", interfaceSubjects.flatMap((occurrence) => {
    const paths = occurrence.declaredResponsibility
      ? context.callPathRows.filter((row) => row.modulePath === occurrence.modulePath || row.symbolName === occurrence.responsibility)
      : callPathsBySymbol.get(occurrence.symbolId) ?? [];
    const ownedRelationships = occurrence.symbolId ? relationshipsBySymbol.get(occurrence.symbolId) ?? [] : [];
    const ownedDataflows = occurrence.symbolId ? dataflowsBySymbol.get(occurrence.symbolId) ?? [] : [];
    if (paths.length === 0) return [{
      occurrenceId: occurrence.symbolId ? null : occurrence.occurrenceId,
      sourceReferenceId: occurrence.sourceReferenceId,
      symbolId: occurrence.symbolId,
      responsibilityId: occurrence.responsibility,
      modulePath: occurrence.modulePath,
      entryPointId: null,
      interfaceKind: null,
      pathWitness: [],
      reachableResponsibility: occurrence.responsibility,
      nodePosture: "FEATURE_SPECIFIC_UNRESOLVED",
      unresolvedDynamicEdges: ownedRelationships
        .filter((row) => row.relationshipKind === "invocation" && row.toSymbolId === null)
        .map((row) => row.relationshipId),
      observableOutputs: ownedDataflows
        .filter((row) => row.dataflowKind === "return").map((row) => row.fromCandidate),
      sideEffects: ownedRelationships
        .filter((row) => row.relationshipKind === "invocation").map((row) => row.toSymbolCandidate).filter(Boolean),
      reachabilityDisposition: "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    }];
    return paths.map((path) => ({
      occurrenceId: occurrence.symbolId ? null : occurrence.occurrenceId,
      sourceReferenceId: occurrence.sourceReferenceId,
      symbolId: occurrence.symbolId,
      responsibilityId: occurrence.responsibility,
      modulePath: occurrence.modulePath,
      entryPointId: path.entryPointId,
      interfaceKind: path.entryKind,
      pathWitness: path.callPath,
      reachableResponsibility: occurrence.responsibility,
      nodePosture: "FEATURE_SPECIFIC_OBSERVED",
      unresolvedDynamicEdges: ownedRelationships
        .filter((row) => row.relationshipKind === "invocation" && row.toSymbolId === null)
        .map((row) => row.relationshipId),
      observableOutputs: ownedDataflows
        .filter((row) => row.dataflowKind === "return").map((row) => row.fromCandidate),
      sideEffects: ownedRelationships
        .filter((row) => row.relationshipKind === "invocation").map((row) => row.toSymbolCandidate).filter(Boolean),
      reachabilityDisposition: "ORIGINATING_ENTRYPOINT_OBSERVED",
    }));
  }), ["occurrenceId", "symbolId", "responsibilityId", "entryPointId"]);

  const bodyRows = identifies("authoring.responsibility-body-evidence.v1", authoringSymbolIds.map((symbolId) => {
    const symbol = symbols.get(symbolId);
    const sourceReferenceId = symbol?.sourceReferenceId
      ?? context.occurrenceEvidence.find((row) => row.symbolId === symbolId)?.sourceReferenceId
      ?? null;
    const reference = references.get(sourceReferenceId) ?? null;
    const relationships = relationshipsBySymbol.get(symbolId) ?? [];
    const dataflows = dataflowsBySymbol.get(symbolId) ?? [];
    return {
      symbolId,
      symbolName: symbol?.name ?? null,
      modulePath: context.occurrenceEvidence.find((row) => row.symbolId === symbolId)?.modulePath ?? repositoryModulePath(symbol?.modulePath) ?? null,
      sourceReferenceId,
      sourceRange: reference ? { startLine: reference.startLine, startColumn: reference.startColumn, endLine: reference.endLine, endColumn: reference.endColumn } : null,
      parameters: [],
      localDeclarations: (index.symbols ?? []).filter((row) => row.modulePath === symbol?.modulePath && row.scopeParts?.includes(symbol?.name)).map((row) => row.symbolId),
      returnSites: dataflows.filter((row) => row.dataflowKind === "return").map((row) => ({ dataflowId: row.dataflowId, value: row.fromCandidate, sourceReferenceId: row.sourceReferenceId })),
      invokedSymbols: relationships.filter((row) => row.relationshipKind === "invocation").map((row) => ({ relationshipId: row.relationshipId, symbolId: row.toSymbolId, candidate: row.toSymbolCandidate, sourceReferenceId: row.sourceReferenceId })),
      importedDependencies: relationships.filter((row) => row.relationshipKind === "dependency").map((row) => row.toSymbolCandidate).filter(Boolean),
      referencedConstants: relationships.filter((row) => row.relationshipKind === "member-access").map((row) => row.toSymbolCandidate).filter(Boolean),
      mechanicsInSourceOrder: candidateOccurrences.filter((row) => row.symbolId === symbolId).sort((a, b) => (a.startLine ?? 0) - (b.startLine ?? 0)).map((row) => ({ occurrenceId: row.occurrenceId, mechanic: row.mechanic, sourceReferenceId: row.sourceReferenceId })),
      astFacts: reference ? [{ sourceReferenceId: reference.referenceId, kind: reference.kind, sourceKind: reference.sourceKind }] : [],
      unresolvedEvidence: ["PARAMETERS_NOT_INDEXED", "SOURCE_SNIPPET_NOT_INDEXED"],
    };
  }), ["symbolId"]);

  const mechanicRows = (queryId, mechanics, projector) => identifies(queryId, candidateOccurrences
    .filter((row) => mechanics.includes(row.mechanic))
    .map((occurrence) => projector(occurrence, relationshipsByReference.get(occurrence.sourceReferenceId) ?? [], dataflowsBySymbol.get(occurrence.symbolId) ?? [])), ["occurrenceId"]);

  const decisions = mechanicRows("authoring.decision-evidence.v1", ["branch"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    conditionEvidence: relationships.filter((item) => item.relationshipKind === "binary-operation").map((item) => ({ relationshipId: item.relationshipId, operator: item.operator, sourceReferenceId: item.sourceReferenceId })),
    inputSymbolsReferenced: relationships.filter((item) => item.relationshipKind === "member-access").map((item) => item.toSymbolCandidate).filter(Boolean),
    comparisonOperators: relationships.filter((item) => item.operator).map((item) => item.operator),
    truePathEffects: [], falsePathEffects: [],
    downstreamCalls: relationships.filter((item) => item.relationshipKind === "invocation").map((item) => item.toSymbolId ?? item.toSymbolCandidate).filter(Boolean),
    resultDispositions: dataflows.filter((item) => item.dataflowKind === "return").map((item) => item.fromCandidate),
    sourceReferenceId: row.sourceReferenceId,
    unresolvedEvidence: ["BRANCH_ARM_CONTROL_FLOW_NOT_INDEXED"],
  }));
  const fallbacks = mechanicRows("authoring.fallback-evidence.v1", ["fallback"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    subjectValue: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    absenceCondition: relationships.find((item) => item.operator)?.operator ?? null,
    selectedDefault: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    defaultOrigin: "OBSERVED_EXPRESSION_NOT_CLASSIFIED",
    downstreamConsequences: dataflows.filter((item) => item.sourceReferenceId === row.sourceReferenceId).map((item) => item.toCandidate ?? item.calleeCandidate).filter(Boolean),
    sourceReferenceId: row.sourceReferenceId,
  }));
  const validations = mechanicRows("authoring.validation-evidence.v1", ["validation"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    valueValidated: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    predicateEvidence: relationships.filter((item) => item.operator || item.relationshipKind === "invocation").map((item) => ({ relationshipId: item.relationshipId, operator: item.operator, candidate: item.toSymbolCandidate })),
    acceptedShapeOrRange: null, rejectedCondition: null, errorDisposition: null,
    callerEntryPoints: (callPathsBySymbol.get(row.symbolId) ?? []).map((item) => item.entryPointId),
    proofEvidence: [], sourceReferenceId: row.sourceReferenceId,
    unresolvedEvidence: ["ACCEPTED_AND_REJECTED_CONTROL_FLOW_NOT_INDEXED", "PROOF_TEST_EVIDENCE_NOT_INDEXED"],
  }));
  const failures = mechanicRows("authoring.failure-policy-evidence.v1", ["throw", "exception-handling", "retry"], (row, relationships) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath, failureMechanic: row.mechanic,
    throwSite: row.mechanic === "throw" ? row.sourceReferenceId : null,
    caughtExceptionCandidates: row.mechanic === "exception-handling" ? relationships.map((item) => item.toSymbolCandidate).filter(Boolean) : [],
    catchScope: row.mechanic === "exception-handling" ? row.symbolId : null,
    errorNormalization: relationships.filter((item) => item.relationshipKind === "invocation").map((item) => item.toSymbolCandidate).filter(Boolean),
    continuationBehavior: row.mechanic === "retry" ? "RETRY_OBSERVED" : "NOT_DETERMINED",
    emittedDisposition: null, propagationPosture: "NOT_STATICALLY_DETERMINED", sourceReferenceId: row.sourceReferenceId,
  }));
  const objectShapes = mechanicRows("authoring.object-shape-evidence.v1", ["object-construction"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    constructedFields: relationships.filter((item) => item.relationshipKind === "member-access").map((item) => item.toSymbolCandidate).filter(Boolean),
    sourceValues: dataflows.filter((item) => item.sourceReferenceId === row.sourceReferenceId).map((item) => item.fromCandidate),
    optionalFields: [], nestedShapes: [],
    destination: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    schemaReferences: [], repeatedVariantCount: candidateOccurrences.filter((item) => item.symbolId === row.symbolId && item.modulePath === row.modulePath && item.mechanic === "object-construction").length,
    sourceReferenceId: row.sourceReferenceId,
  }));
  const resultContracts = identifies("authoring.result-contract-evidence.v1", bodyRows.flatMap((body) => body.returnSites.map((site) => ({
    symbolId: body.symbolId, modulePath: body.modulePath, resultExpression: site.value,
    destination: "CALLER", serializationDestination: null, schemaReferences: [], sourceReferenceId: site.sourceReferenceId,
  }))), ["symbolId", "sourceReferenceId"]);
  const serializations = mechanicRows("authoring.serialization-evidence.v1", ["serialization"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    sourceObjectShape: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    serializer: relationships.find((item) => item.relationshipKind === "invocation")?.toSymbolCandidate ?? null,
    formattingOptions: [], outputDestination: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    contentType: null, pathPosture: "SUCCESS_OR_ERROR_PATH_NOT_STATICALLY_CLASSIFIED",
    delegationPosture: relationships.some((item) => item.relationshipKind === "invocation") ? "DELEGATED_SERIALIZER_OBSERVED" : "INLINE_OR_UNRESOLVED",
    sourceReferenceId: row.sourceReferenceId,
  }));
  const normalizations = mechanicRows("authoring.normalization-evidence.v1", ["normalization"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    inputRepresentation: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    normalizationOperation: relationships.find((item) => item.relationshipKind === "invocation")?.toSymbolCandidate ?? null,
    outputRepresentation: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    orderingEvidence: null, idempotenceEvidence: null,
    downstreamConsumers: dataflows.filter((item) => item.sourceReferenceId === row.sourceReferenceId).map((item) => item.calleeCandidate).filter(Boolean),
    sourceReferenceId: row.sourceReferenceId,
  }));
  const iterations = mechanicRows("authoring.iteration-evidence.v1", ["iteration"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    collectionSource: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    itemIdentity: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    ordering: "SOURCE_ORDER_OBSERVED_SEMANTIC_ORDER_NOT_EVALUATED", filterCondition: null,
    accumulationBehavior: dataflows.filter((item) => item.dataflowKind === "assignment").map((item) => item.toCandidate),
    terminationCondition: null, resultShape: null,
    sideEffects: relationships.filter((item) => item.relationshipKind === "invocation").map((item) => item.toSymbolCandidate).filter(Boolean),
    sourceReferenceId: row.sourceReferenceId,
  }));
  const stateTransitions = mechanicRows("authoring.state-transition-evidence.v1", ["state-mutation"], (row, relationships, dataflows) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, modulePath: row.modulePath,
    stateSubject: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.toCandidate ?? null,
    previousValueEvidence: null, mutationOperation: relationships.find((item) => item.operator)?.operator ?? "MUTATION_OBSERVED",
    triggeringCondition: null,
    resultingState: dataflows.find((item) => item.sourceReferenceId === row.sourceReferenceId)?.fromCandidate ?? null,
    observableConsequence: relationships.filter((item) => item.relationshipKind === "invocation").map((item) => item.toSymbolCandidate).filter(Boolean),
    sourceReferenceId: row.sourceReferenceId,
  }));
  const dataFlowSlices = identifies("authoring.data-flow-slice.v1", authoringSymbolIds.map((symbolId) => {
    const flows = dataflowsBySymbol.get(symbolId) ?? [];
    return {
      symbolId,
      responsibilityId: symbols.get(symbolId)?.name ?? null,
      interfaceInputs: flows.filter((row) => row.dataflowKind === "argument").map((row) => ({ dataflowId: row.dataflowId, value: row.fromCandidate, callee: row.calleeCandidate, argumentIndex: row.argumentIndex })),
      parameterBindings: flows.filter((row) => row.dataflowKind === "assignment").map((row) => ({ dataflowId: row.dataflowId, from: row.fromCandidate, to: row.toCandidate })),
      transformations: flows.filter((row) => row.dataflowKind === "assignment" || row.dataflowKind === "argument").map((row) => row.dataflowId),
      validations: candidateOccurrences.filter((row) => row.symbolId === symbolId && row.mechanic === "validation").map((row) => row.occurrenceId),
      runtimeInvocations: (relationshipsBySymbol.get(symbolId) ?? []).filter((row) => row.relationshipKind === "invocation").map((row) => row.relationshipId),
      objectProjections: candidateOccurrences.filter((row) => row.symbolId === symbolId && row.mechanic === "object-construction").map((row) => row.occurrenceId),
      serializations: candidateOccurrences.filter((row) => row.symbolId === symbolId && row.mechanic === "serialization").map((row) => row.occurrenceId),
      interfaceOutputs: flows.filter((row) => row.dataflowKind === "return").map((row) => ({ dataflowId: row.dataflowId, value: row.fromCandidate })),
      sourceReferenceIds: [...new Set(flows.map((row) => row.sourceReferenceId))],
    };
  }), ["symbolId"]);

  const overlaps = identifies("authoring.authority-overlap.v1", [
    ...candidateOccurrences.map((row) => ({
    occurrenceId: row.occurrenceId, symbolId: row.symbolId, sourceReferenceId: row.sourceReferenceId,
    nearbyAuthorityDocuments: [row.authorityHomeFile].filter(Boolean),
    matchingMechanicFamilies: [row.mechanic], matchingResponsibilities: [row.responsibility].filter(Boolean),
    matchingDataShapes: [], matchingScenarios: row.scenarioIds,
    exactReuseCandidates: row.authorityHomeFile && row.featureCoveragePosture !== "FEATURE_COVERAGE_MISSING" ? [row.authorityHomeFile] : [],
    extensionCandidates: [row.authorityHomeFile].filter(Boolean), conflicts: row.authorityHomeStatus === "AUTHORITY_HOME_AMBIGUOUS" ? ["AMBIGUOUS_AUTHORITY_HOME"] : [],
    staleOrDeadAuthority: [], evaluationDisposition: "AUTHORITY_OVERLAP_EVALUATED",
    })),
    ...responsibilities.map((row) => ({
      occurrenceId: null, responsibilityId: row.responsibilityId, symbolId: null, sourceReferenceId: null,
      nearbyAuthorityDocuments: [row.authorityFile], matchingMechanicFamilies: [], matchingResponsibilities: [row.responsibilityId],
      matchingDataShapes: [], matchingScenarios: [row.scenarioId], exactReuseCandidates: [row.authorityFile],
      extensionCandidates: [], conflicts: [], staleOrDeadAuthority: [], evaluationDisposition: "AUTHORITY_OVERLAP_EVALUATED",
    })),
  ], ["occurrenceId", "responsibilityId"]);
  const scenarioContexts = identifies("authoring.scenario-context.v1", [
    ...candidateOccurrences.map((row) => {
    const declared = (responsibilitiesByBody.get(row.modulePath) ?? [])[0] ?? null;
    return {
      occurrenceId: row.occurrenceId, symbolId: row.symbolId, sourceReferenceId: row.sourceReferenceId,
      interfaceSurfaceIds: (callPathsBySymbol.get(row.symbolId) ?? []).map((item) => item.entryPointId),
      featureId: row.featureIds[0] ?? declared?.featureId ?? null,
      scenarioId: row.scenarioIds[0] ?? declared?.scenarioId ?? null,
      scenarioAuthorityDisposition: row.scenarioIds.length > 0 || declared ? "SCENARIO_AUTHORITY_OBSERVED" : "SCENARIO_AUTHORITY_MISSING",
      gherkin: null,
      responsibilityId: declared?.responsibilityId ?? row.responsibility,
      obligationId: row.obligationIds[0] ?? declared?.obligationId ?? null,
      expectedObservableResult: null,
      conformanceSignal: declared?.runtimeConformance ?? "NOT_EVALUATED",
      executionSliceQueryId: "authoring.interface-execution-slice.v1",
    };
    }),
    ...responsibilities.map((row) => ({
      occurrenceId: null,
      symbolId: null,
      sourceReferenceId: null,
      interfaceSurfaceIds: context.callPathRows.filter((path) => path.modulePath === row.bodyFile || path.symbolName === row.responsibilityId).map((path) => path.entryPointId),
      featureId: row.featureId,
      scenarioId: row.scenarioId,
      scenarioAuthorityDisposition: "SCENARIO_AUTHORITY_OBSERVED",
      gherkin: null,
      responsibilityId: row.responsibilityId,
      obligationId: row.obligationId,
      expectedObservableResult: null,
      conformanceSignal: row.runtimeConformance,
      authorityFile: row.authorityFile,
      executionSliceQueryId: "authoring.interface-execution-slice.v1",
    })),
  ], ["occurrenceId", "responsibilityId"]);
  const projectionTargets = identifies("authoring.projection-target.v1", authoringSymbolIds.map((symbolId) => ({
    symbolId,
    modulePath: context.occurrenceEvidence.find((row) => row.symbolId === symbolId)?.modulePath ?? symbols.get(symbolId)?.modulePath ?? null,
    currentExecutableBodyReference: symbols.get(symbolId)?.sourceReferenceId ?? null,
    mechanicsProposedForRemoval: candidateOccurrences.filter((row) => row.symbolId === symbolId).map((row) => row.occurrenceId),
    retainedMechanicalAdapterOperations: candidateOccurrences.filter((row) => row.symbolId === symbolId && row.posture === "MECHANICAL_ADAPTER_OPERATION").map((row) => row.occurrenceId),
    requiredSemanticRuntimeCalls: (relationshipsBySymbol.get(symbolId) ?? []).filter((row) => row.relationshipKind === "invocation").map((row) => row.toSymbolId ?? row.toSymbolCandidate).filter(Boolean),
    requiredImports: (relationshipsBySymbol.get(symbolId) ?? []).filter((row) => row.relationshipKind === "dependency").map((row) => row.toSymbolCandidate).filter(Boolean),
    targetGeneratedArtifactShape: "SEMANTIC_EXECUTION_ADAPTER_NOT_YET_AUTHORED",
    projectorAvailability: context.authoringContractMap?.projectors?.length > 0 ? "PROJECTOR_REGISTRY_BOUND" : "PROJECTOR_NOT_EVALUATED",
    compatibleProjectorIds: (context.authoringContractMap?.projectors ?? []).map((row) => row.projectorId),
    unsupportedSyntaxOrDynamicEdges: (relationshipsBySymbol.get(symbolId) ?? []).filter((row) => row.relationshipKind === "invocation" && row.toSymbolId === null).map((row) => row.relationshipId),
  })), ["symbolId"]);
  const proofVectors = identifies("authoring.proof-vector-candidates.v1", authoringSymbolIds.map((symbolId) => ({
    symbolId,
    observedInputClasses: (dataflowsBySymbol.get(symbolId) ?? []).filter((row) => row.dataflowKind === "argument").map((row) => row.fromCandidate),
    branchOutcomesRequiringCoverage: candidateOccurrences.filter((row) => row.symbolId === symbolId && ["branch", "fallback", "throw", "validation"].includes(row.mechanic)).map((row) => row.occurrenceId),
    existingTests: [],
    resultShapes: (dataflowsBySymbol.get(symbolId) ?? []).filter((row) => row.dataflowKind === "return").map((row) => row.fromCandidate),
    errorCases: candidateOccurrences.filter((row) => row.symbolId === symbolId && ["throw", "exception-handling"].includes(row.mechanic)).map((row) => row.occurrenceId),
    boundaryValues: [], deterministicFixtures: [],
    equivalenceDimensions: ["RETURN_VALUE", "FAILURE_DISPOSITION", "OBSERVABLE_SIDE_EFFECTS"],
    proofDisposition: "PROOF_VECTOR_CANDIDATE_REQUIRES_REVIEW",
    compatibleVerifierIds: (context.authoringContractMap?.verifiers ?? []).map((row) => row.verifierId),
    unresolvedEvidence: ["TEST_AND_FIXTURE_EVIDENCE_NOT_INDEXED"],
  })), ["symbolId"]);

  const families = {
    interfaceRows, bodyRows, decisions, fallbacks, validations, failures, objectShapes, resultContracts,
    serializations, normalizations, iterations, stateTransitions, dataFlowSlices, overlaps, scenarioContexts,
    projectionTargets, proofVectors, contractMapRows,
  };
  const byOccurrence = Object.fromEntries([
    ["interfaceRows", groupsBy(interfaceRows.filter((row) => row.occurrenceId), "occurrenceId")], ["decisions", groupsBy(decisions, "occurrenceId")],
    ["fallbacks", groupsBy(fallbacks, "occurrenceId")], ["validations", groupsBy(validations, "occurrenceId")],
    ["failures", groupsBy(failures, "occurrenceId")], ["objectShapes", groupsBy(objectShapes, "occurrenceId")],
    ["serializations", groupsBy(serializations, "occurrenceId")], ["normalizations", groupsBy(normalizations, "occurrenceId")],
    ["iterations", groupsBy(iterations, "occurrenceId")], ["stateTransitions", groupsBy(stateTransitions, "occurrenceId")],
    ["overlaps", groupsBy(overlaps, "occurrenceId")], ["scenarioContexts", groupsBy(scenarioContexts, "occurrenceId")],
  ]);
  const bySymbol = {
    interfaceRows: groupsBy(interfaceRows.filter((row) => row.symbolId), "symbolId"),
    bodyRows: groupsBy(bodyRows, "symbolId"), resultContracts: groupsBy(resultContracts, "symbolId"),
    dataFlowSlices: groupsBy(dataFlowSlices, "symbolId"), projectionTargets: groupsBy(projectionTargets, "symbolId"),
    proofVectors: groupsBy(proofVectors, "symbolId"),
  };
  const byResponsibility = {
    interfaceRows: groupsBy(interfaceRows.filter((row) => row.responsibilityId), "responsibilityId"),
    scenarioContexts: groupsBy(scenarioContexts.filter((row) => row.responsibilityId), "responsibilityId"),
    overlaps: groupsBy(overlaps.filter((row) => row.responsibilityId), "responsibilityId"),
  };
  const queryFor = {
    interfaceRows: "authoring.interface-execution-slice.v1", bodyRows: "authoring.responsibility-body-evidence.v1",
    decisions: "authoring.decision-evidence.v1", fallbacks: "authoring.fallback-evidence.v1",
    validations: "authoring.validation-evidence.v1", failures: "authoring.failure-policy-evidence.v1",
    objectShapes: "authoring.object-shape-evidence.v1", resultContracts: "authoring.result-contract-evidence.v1",
    serializations: "authoring.serialization-evidence.v1", normalizations: "authoring.normalization-evidence.v1",
    iterations: "authoring.iteration-evidence.v1", stateTransitions: "authoring.state-transition-evidence.v1",
    dataFlowSlices: "authoring.data-flow-slice.v1", overlaps: "authoring.authority-overlap.v1",
    scenarioContexts: "authoring.scenario-context.v1", projectionTargets: "authoring.projection-target.v1",
    proofVectors: "authoring.proof-vector-candidates.v1",
    contractMapRows: "authoring.contract-map.v1",
  };
  const occurrenceBundles = identifies("authoring.semantic-authority-evidence-bundle.v1", candidateOccurrences.map((candidate) => {
    const selected = {};
    for (const name of Object.keys(byOccurrence)) selected[name] = byOccurrence[name].get(candidate.occurrenceId) ?? [];
    for (const name of Object.keys(bySymbol)) {
      if (name === "interfaceRows" && !candidate.symbolId) continue;
      selected[name] = bySymbol[name].get(candidate.symbolId) ?? [];
    }
    const mechanicFacets = {
      branch: ["decision"], fallback: ["decision", "failure-policy"], validation: ["decision", "failure-policy"],
      throw: ["failure-policy"], "exception-handling": ["failure-policy"], retry: ["failure-policy"],
      "object-construction": ["projection-mapping", "result-contract", "semantic-properties"],
      serialization: ["result-contract", "execution-binding"], normalization: ["ontology-translations"],
      iteration: ["iteration", "ontology-iterations"], "state-mutation": ["semantic-edge", "ontology-transformations"],
    };
    const requiredFacets = new Set(["responsibility", "proof", "canonical-lineage", "context-schemas", ...(mechanicFacets[candidate.mechanic] ?? [])]);
    selected.contractMapRows = contractMapRows.filter((row) => requiredFacets.has(row.authorityFacet));
    const interfaceObserved = selected.interfaceRows.some((row) => row.reachabilityDisposition === "ORIGINATING_ENTRYPOINT_OBSERVED");
    const scenario = selected.scenarioContexts[0] ?? null;
    const dataFlow = selected.dataFlowSlices[0] ?? null;
    const overlap = selected.overlaps[0] ?? null;
    const proof = selected.proofVectors[0] ?? null;
    const unresolvedEvidence = [];
    if (!candidate.sourceReferenceId) unresolvedEvidence.push("AUTHORING_SOURCE_REFERENCE_MISSING");
    if (!candidate.symbolId) unresolvedEvidence.push("AMBIGUOUS_RESPONSIBILITY_BOUNDARY");
    if (!interfaceObserved) unresolvedEvidence.push("AUTHORING_CALL_PATH_UNRESOLVED");
    if (!scenario || scenario.scenarioAuthorityDisposition === "SCENARIO_AUTHORITY_MISSING") unresolvedEvidence.push("AUTHORING_SCENARIO_CONTEXT_MISSING");
    if (!dataFlow || (dataFlow.sourceReferenceIds?.length ?? 0) === 0) unresolvedEvidence.push("INSUFFICIENT_DATA_FLOW_EVIDENCE");
    if (!overlap || overlap.evaluationDisposition !== "AUTHORITY_OVERLAP_EVALUATED") unresolvedEvidence.push("AUTHORING_AUTHORITY_OVERLAP_NOT_EVALUATED");
    if (!proof) unresolvedEvidence.push("AUTHORING_PROOF_VECTOR_MISSING");
    if (context.authoringContractMap?.disposition !== "AUTHORING_CONTRACT_MAP_BOUND" || selected.contractMapRows.length === 0) {
      unresolvedEvidence.push("AUTHORING_CONTRACT_MAP_MISSING");
    }
    const dynamicEdges = selected.interfaceRows.flatMap((row) => row.unresolvedDynamicEdges ?? []);
    let authoringReadinessDisposition = "READY_FOR_SEMANTIC_AUTHORITY_AUTHORING";
    if (!candidate.sourceReferenceId) authoringReadinessDisposition = "NOT_PROJECTABLE";
    else if (!candidate.symbolId) authoringReadinessDisposition = "AMBIGUOUS_RESPONSIBILITY_BOUNDARY";
    else if (unresolvedEvidence.includes("AUTHORING_CONTRACT_MAP_MISSING")) authoringReadinessDisposition = "NOT_PROJECTABLE";
    else if (overlap?.conflicts.length > 0) authoringReadinessDisposition = "CONFLICTING_AUTHORITY";
    else if (!interfaceObserved) authoringReadinessDisposition = "INSUFFICIENT_INTERFACE_EVIDENCE";
    else if (!scenario?.featureId) authoringReadinessDisposition = "READY_FOR_FEATURE_AUTHORING";
    else if (!scenario?.scenarioId) authoringReadinessDisposition = "READY_FOR_SCENARIO_AUTHORING";
    else if (!dataFlow || dataFlow.sourceReferenceIds.length === 0) authoringReadinessDisposition = "INSUFFICIENT_DATA_FLOW_EVIDENCE";
    else if (dynamicEdges.length > 0) authoringReadinessDisposition = "DYNAMIC_EXECUTION_UNRESOLVED";
    let projectionReadinessDisposition = "READY_FOR_PROJECTION";
    if (!candidate.sourceReferenceId) projectionReadinessDisposition = "PROJECTION_BLOCKED_SOURCE_REFERENCE_MISSING";
    else if (!candidate.symbolId) projectionReadinessDisposition = "PROJECTION_BLOCKED_RESPONSIBILITY_AMBIGUOUS";
    else if (unresolvedEvidence.includes("AUTHORING_CONTRACT_MAP_MISSING")) projectionReadinessDisposition = "PROJECTION_BLOCKED_CONTRACT_MAP_MISSING";
    else if (selected.projectionTargets.length === 0) projectionReadinessDisposition = "PROJECTION_BLOCKED_TARGET_UNRESOLVED";
    else if (!overlap || overlap.evaluationDisposition !== "AUTHORITY_OVERLAP_EVALUATED") projectionReadinessDisposition = "PROJECTION_BLOCKED_AUTHORITY_OVERLAP_NOT_EVALUATED";
    else if (overlap.conflicts.length > 0) projectionReadinessDisposition = "PROJECTION_BLOCKED_AUTHORITY_CONFLICT";
    else if (!interfaceObserved) projectionReadinessDisposition = "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP";
    const queryReceipts = Object.entries(selected).filter(([, rows]) => rows.length > 0).map(([name, rows]) => ({
      queryId: queryFor[name], resultRowIds: rows.map((row) => row.resultRowId),
    }));
    const evidenceSummary = (queryId, rows) => ({ queryId, rowCount: rows.length });
    return {
      documentKind: "semantic-authority-authoring-evidence-bundle.v1",
      lifecycle: "OBSERVED_EVIDENCE",
      subjectKind: "SOURCE_OCCURRENCE",
      subjectKey: candidate.occurrenceId,
      occurrenceId: candidate.occurrenceId,
      subject: {
        interfaceSurfaceId: selected.interfaceRows.find((row) => row.entryPointId)?.entryPointId ?? null,
        candidateFeatureId: scenario?.featureId ?? null,
        candidateScenarioId: scenario?.scenarioId ?? null,
        responsibilityId: scenario?.responsibilityId ?? candidate.responsibility,
        symbolId: candidate.symbolId,
        modulePath: candidate.modulePath,
        sourceReferenceId: candidate.sourceReferenceId,
      },
      queryReceipts,
      featureContext: { featureId: scenario?.featureId ?? null },
      scenarioContext: scenario ? {
        queryId: "authoring.scenario-context.v1",
        resultRowId: scenario.resultRowId,
        featureId: scenario.featureId,
        scenarioId: scenario.scenarioId,
        scenarioAuthorityDisposition: scenario.scenarioAuthorityDisposition,
        responsibilityId: scenario.responsibilityId,
        obligationId: scenario.obligationId,
        conformanceSignal: scenario.conformanceSignal,
      } : null,
      interfaceContext: {
        queryId: "authoring.interface-execution-slice.v1",
        entryPointIds: [...new Set(selected.interfaceRows.map((row) => row.entryPointId).filter(Boolean))],
        interfaceKinds: [...new Set(selected.interfaceRows.map((row) => row.interfaceKind).filter(Boolean))],
        reachabilityDisposition: interfaceObserved ? "ORIGINATING_ENTRYPOINT_OBSERVED" : "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
      },
      callGraphContext: {
        queryId: "authoring.interface-execution-slice.v1",
        pathWitnessCount: selected.interfaceRows.filter((row) => row.pathWitness.length > 0).length,
        unresolvedDynamicEdgeCount: new Set(selected.interfaceRows.flatMap((row) => row.unresolvedDynamicEdges)).size,
      },
      bodyContext: selected.bodyRows[0] ? {
        resultRowId: selected.bodyRows[0].resultRowId,
        symbolId: selected.bodyRows[0].symbolId,
        modulePath: selected.bodyRows[0].modulePath,
        sourceReferenceId: selected.bodyRows[0].sourceReferenceId,
      } : null,
      mechanicEvidence: { mechanic: candidate.mechanic, occurrenceId: candidate.occurrenceId },
      decisionEvidence: evidenceSummary("authoring.decision-evidence.v1", selected.decisions),
      validationEvidence: evidenceSummary("authoring.validation-evidence.v1", selected.validations),
      fallbackEvidence: evidenceSummary("authoring.fallback-evidence.v1", selected.fallbacks),
      failureEvidence: evidenceSummary("authoring.failure-policy-evidence.v1", selected.failures),
      objectShapeEvidence: evidenceSummary("authoring.object-shape-evidence.v1", selected.objectShapes),
      resultContractEvidence: evidenceSummary("authoring.result-contract-evidence.v1", selected.resultContracts),
      serializationEvidence: evidenceSummary("authoring.serialization-evidence.v1", selected.serializations),
      normalizationEvidence: evidenceSummary("authoring.normalization-evidence.v1", selected.normalizations),
      iterationEvidence: evidenceSummary("authoring.iteration-evidence.v1", selected.iterations),
      stateTransitionEvidence: evidenceSummary("authoring.state-transition-evidence.v1", selected.stateTransitions),
      dataFlowEvidence: evidenceSummary("authoring.data-flow-slice.v1", selected.dataFlowSlices),
      existingAuthorityContext: selected.overlaps.map((row) => ({
        resultRowId: row.resultRowId,
        evaluationDisposition: row.evaluationDisposition,
        nearbyAuthorityDocuments: row.nearbyAuthorityDocuments,
        conflicts: row.conflicts,
      })),
      contractMapContext: {
        queryId: "authoring.contract-map.v1",
        requiredAuthorityFacets: selected.contractMapRows.map((row) => row.authorityFacet),
        schemaContentHashes: [...new Set(selected.contractMapRows.map((row) => row.schemaContentHash))],
      },
      projectionTarget: selected.projectionTargets[0] ? { resultRowId: selected.projectionTargets[0].resultRowId, symbolId: selected.projectionTargets[0].symbolId } : null,
      proofCandidates: evidenceSummary("authoring.proof-vector-candidates.v1", selected.proofVectors),
      unresolvedEvidence: [...new Set(unresolvedEvidence)],
      authoringReadinessDisposition,
      projectionReadinessDisposition,
      readyForProjection: projectionReadinessDisposition.startsWith("READY_FOR_PROJECTION"),
    };
  }), ["subjectKind", "subjectKey"]);
  const responsibilityBundles = identifies("authoring.semantic-authority-evidence-bundle.v1", responsibilities.map((responsibility) => {
    const interfaceEvidence = (byResponsibility.interfaceRows.get(responsibility.responsibilityId) ?? [])
      .filter((row) => row.occurrenceId === null);
    const scenario = (byResponsibility.scenarioContexts.get(responsibility.responsibilityId) ?? [])
      .find((row) => row.occurrenceId === null) ?? null;
    const overlap = (byResponsibility.overlaps.get(responsibility.responsibilityId) ?? [])
      .find((row) => row.occurrenceId === null) ?? null;
    const bodies = bodyRows.filter((row) => row.modulePath === responsibility.bodyFile);
    const flows = bodies.flatMap((body) => bySymbol.dataFlowSlices.get(body.symbolId) ?? []);
    const projections = bodies.flatMap((body) => bySymbol.projectionTargets.get(body.symbolId) ?? []);
    const proofs = bodies.flatMap((body) => bySymbol.proofVectors.get(body.symbolId) ?? []);
    const contractRows = contractMapRows.filter((row) => ["responsibility", "proof", "canonical-lineage", "context-schemas", "projection-mapping"].includes(row.authorityFacet));
    const interfaceObserved = interfaceEvidence.some((row) => row.reachabilityDisposition === "ORIGINATING_ENTRYPOINT_OBSERVED");
    const unresolvedEvidence = [];
    if (bodies.length === 0 || !bodies.some((body) => body.sourceReferenceId)) unresolvedEvidence.push("AUTHORING_SOURCE_REFERENCE_MISSING");
    if (bodies.length !== 1) unresolvedEvidence.push("AMBIGUOUS_RESPONSIBILITY_BOUNDARY");
    if (!interfaceObserved) unresolvedEvidence.push("AUTHORING_CALL_PATH_UNRESOLVED");
    if (flows.length === 0) unresolvedEvidence.push("INSUFFICIENT_DATA_FLOW_EVIDENCE");
    if (!overlap) unresolvedEvidence.push("AUTHORING_AUTHORITY_OVERLAP_NOT_EVALUATED");
    if (proofs.length === 0) unresolvedEvidence.push("AUTHORING_PROOF_VECTOR_MISSING");
    if (contractRows.length === 0) unresolvedEvidence.push("AUTHORING_CONTRACT_MAP_MISSING");
    const selected = {
      interfaceRows: interfaceEvidence,
      scenarioContexts: scenario ? [scenario] : [],
      bodyRows: bodies,
      dataFlowSlices: flows,
      overlaps: overlap ? [overlap] : [],
      projectionTargets: projections,
      proofVectors: proofs,
      contractMapRows: contractRows,
    };
    const queryReceipts = Object.entries(selected).filter(([, rows]) => rows.length > 0).map(([name, rows]) => ({
      queryId: queryFor[name], resultRowIds: rows.map((row) => row.resultRowId),
    }));
    let projectionReadinessDisposition = "READY_FOR_PROJECTION";
    if (bodies.length === 0 || !bodies.some((body) => body.sourceReferenceId)) projectionReadinessDisposition = "PROJECTION_BLOCKED_SOURCE_REFERENCE_MISSING";
    else if (contractRows.length === 0) projectionReadinessDisposition = "PROJECTION_BLOCKED_CONTRACT_MAP_MISSING";
    else if (projections.length === 0) projectionReadinessDisposition = "PROJECTION_BLOCKED_TARGET_UNRESOLVED";
    else if (!overlap || overlap.evaluationDisposition !== "AUTHORITY_OVERLAP_EVALUATED") projectionReadinessDisposition = "PROJECTION_BLOCKED_AUTHORITY_OVERLAP_NOT_EVALUATED";
    else if (overlap.conflicts.length > 0) projectionReadinessDisposition = "PROJECTION_BLOCKED_AUTHORITY_CONFLICT";
    else if (!interfaceObserved) projectionReadinessDisposition = "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP";
    return {
      documentKind: "semantic-authority-authoring-evidence-bundle.v1",
      lifecycle: "OBSERVED_EVIDENCE",
      subjectKind: "DECLARED_RESPONSIBILITY",
      subjectKey: responsibility.responsibilityId,
      occurrenceId: null,
      subject: {
        interfaceSurfaceId: interfaceEvidence.find((row) => row.entryPointId)?.entryPointId ?? null,
        candidateFeatureId: responsibility.featureId,
        candidateScenarioId: responsibility.scenarioId,
        responsibilityId: responsibility.responsibilityId,
        symbolId: bodies.length === 1 ? bodies[0].symbolId : null,
        modulePath: responsibility.bodyFile,
        sourceReferenceId: bodies.length === 1 ? bodies[0].sourceReferenceId : null,
      },
      queryReceipts,
      featureContext: { featureId: responsibility.featureId },
      scenarioContext: scenario ? {
        queryId: "authoring.scenario-context.v1", resultRowId: scenario.resultRowId,
        featureId: scenario.featureId, scenarioId: scenario.scenarioId,
        scenarioAuthorityDisposition: scenario.scenarioAuthorityDisposition,
        responsibilityId: scenario.responsibilityId, obligationId: scenario.obligationId,
        conformanceSignal: scenario.conformanceSignal,
      } : null,
      interfaceContext: {
        queryId: "authoring.interface-execution-slice.v1",
        entryPointIds: [...new Set(interfaceEvidence.map((row) => row.entryPointId).filter(Boolean))],
        interfaceKinds: [...new Set(interfaceEvidence.map((row) => row.interfaceKind).filter(Boolean))],
        reachabilityDisposition: interfaceObserved ? "ORIGINATING_ENTRYPOINT_OBSERVED" : "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
      },
      callGraphContext: {
        queryId: "authoring.interface-execution-slice.v1",
        pathWitnessCount: interfaceEvidence.filter((row) => row.pathWitness.length > 0).length,
        unresolvedDynamicEdgeCount: new Set(interfaceEvidence.flatMap((row) => row.unresolvedDynamicEdges)).size,
      },
      bodyContext: { queryId: "authoring.responsibility-body-evidence.v1", rowCount: bodies.length },
      mechanicEvidence: { mechanic: null, occurrenceId: null },
      decisionEvidence: { queryId: "authoring.decision-evidence.v1", rowCount: 0 },
      validationEvidence: { queryId: "authoring.validation-evidence.v1", rowCount: 0 },
      fallbackEvidence: { queryId: "authoring.fallback-evidence.v1", rowCount: 0 },
      failureEvidence: { queryId: "authoring.failure-policy-evidence.v1", rowCount: 0 },
      objectShapeEvidence: { queryId: "authoring.object-shape-evidence.v1", rowCount: 0 },
      resultContractEvidence: { queryId: "authoring.result-contract-evidence.v1", rowCount: bodies.flatMap((body) => bySymbol.resultContracts.get(body.symbolId) ?? []).length },
      serializationEvidence: { queryId: "authoring.serialization-evidence.v1", rowCount: 0 },
      normalizationEvidence: { queryId: "authoring.normalization-evidence.v1", rowCount: 0 },
      iterationEvidence: { queryId: "authoring.iteration-evidence.v1", rowCount: 0 },
      stateTransitionEvidence: { queryId: "authoring.state-transition-evidence.v1", rowCount: 0 },
      dataFlowEvidence: { queryId: "authoring.data-flow-slice.v1", rowCount: flows.length },
      existingAuthorityContext: overlap ? [{ resultRowId: overlap.resultRowId, evaluationDisposition: overlap.evaluationDisposition, nearbyAuthorityDocuments: overlap.nearbyAuthorityDocuments, conflicts: overlap.conflicts }] : [],
      contractMapContext: { queryId: "authoring.contract-map.v1", requiredAuthorityFacets: contractRows.map((row) => row.authorityFacet), schemaContentHashes: [...new Set(contractRows.map((row) => row.schemaContentHash))] },
      projectionTarget: { queryId: "authoring.projection-target.v1", rowCount: projections.length },
      proofCandidates: { queryId: "authoring.proof-vector-candidates.v1", rowCount: proofs.length },
      unresolvedEvidence: [...new Set(unresolvedEvidence)],
      authoringReadinessDisposition: bodies.length === 0 || !bodies.some((body) => body.sourceReferenceId) ? "NOT_PROJECTABLE"
        : contractRows.length === 0 ? "NOT_PROJECTABLE"
          : overlap?.conflicts.length > 0 ? "CONFLICTING_AUTHORITY"
            : !interfaceObserved ? "INSUFFICIENT_INTERFACE_EVIDENCE"
              : bodies.length !== 1 ? "AMBIGUOUS_RESPONSIBILITY_BOUNDARY"
                : flows.length === 0 ? "INSUFFICIENT_DATA_FLOW_EVIDENCE" : "READY_FOR_SEMANTIC_AUTHORITY_AUTHORING",
      projectionReadinessDisposition,
      readyForProjection: projectionReadinessDisposition.startsWith("READY_FOR_PROJECTION"),
    };
  }), ["subjectKind", "subjectKey"]);
  const bundles = [...occurrenceBundles, ...responsibilityBundles];
  const readinessRows = identifies("authoring.readiness.v1", bundles.map((bundle) => ({
    subjectKind: bundle.subjectKind,
    subjectKey: bundle.subjectKey,
    occurrenceId: bundle.occurrenceId,
    responsibilityId: bundle.subject.responsibilityId,
    symbolId: bundle.subject.symbolId,
    modulePath: bundle.subject.modulePath,
    sourceReferenceId: bundle.subject.sourceReferenceId,
    authoringReadinessDisposition: bundle.authoringReadinessDisposition,
    projectionReadinessDisposition: bundle.projectionReadinessDisposition,
    unresolvedEvidence: bundle.unresolvedEvidence,
    evidenceBundleResultRowId: bundle.resultRowId,
    readyForProjection: bundle.readyForProjection,
  })), ["subjectKind", "subjectKey"]);
  const sourceBundles = bundles.filter((row) => row.subjectKind === "SOURCE_OCCURRENCE");
  const authoringReconciliation = {
    disposition: "PASSED",
    healingCandidates: candidateOccurrences.length,
    candidatesWithAuthoringEvidenceBundle: sourceBundles.length,
    candidatesWithCompleteQueryProvenance: sourceBundles.filter((row) => row.queryReceipts.length > 0 && row.queryReceipts.every((receipt) => receipt.resultRowIds.length > 0)).length,
    candidatesWithUnresolvedRequiredEvidence: sourceBundles.filter((row) => row.unresolvedEvidence.length > 0).length,
    candidatesReadyForSemanticAuthorityAuthoring: sourceBundles.filter((row) => row.authoringReadinessDisposition === "READY_FOR_SEMANTIC_AUTHORITY_AUTHORING").length,
    candidatesReadyForProjection: sourceBundles.filter((row) => row.readyForProjection).length,
    declaredResponsibilities: responsibilities.length,
    declaredResponsibilityBundles: responsibilityBundles.length,
    declaredResponsibilitiesBlockedByInterface: responsibilityBundles.filter((row) => row.authoringReadinessDisposition === "INSUFFICIENT_INTERFACE_EVIDENCE").length,
    declaredResponsibilitiesReadyForProjection: responsibilityBundles.filter((row) => row.readyForProjection).length,
    declaredResponsibilitiesProjectableWithInterfaceEvidenceGap: responsibilityBundles.filter((row) => row.projectionReadinessDisposition === "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP").length,
    missingAuthoringQueries: 0,
    incompleteEvidenceBundles: candidateOccurrences.length - sourceBundles.length,
    missingSourceReferences: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_SOURCE_REFERENCE_MISSING")).length,
    unresolvedCallPaths: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_CALL_PATH_UNRESOLVED")).length,
    missingScenarioContexts: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_SCENARIO_CONTEXT_MISSING")).length,
    authorityOverlapNotEvaluated: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_AUTHORITY_OVERLAP_NOT_EVALUATED")).length,
    proofVectorMissing: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_PROOF_VECTOR_MISSING")).length,
    contractMapMissing: sourceBundles.filter((row) => row.unresolvedEvidence.includes("AUTHORING_CONTRACT_MAP_MISSING")).length,
  };
  return { ...families, bundles, readinessRows, authoringReconciliation };
}

export function buildsAuthoringEvidenceContext(context) {
  return buildsAuthoringCollections(context);
}

const definitions = [
  ["authoring.interface-execution-slice.v1", "Interface-to-Responsibility Slice", 3, "interfaceRows", ["entryPointId", "scenarioId", "responsibilityId", "symbolId", "occurrenceId"]],
  ["authoring.responsibility-body-evidence.v1", "Responsibility Body Evidence", 4, "bodyRows", ["responsibilityId", "symbolId", "modulePath"]],
  ["authoring.decision-evidence.v1", "Decision Semantics", 5, "decisions", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.fallback-evidence.v1", "Fallback and Missing-Value Policy", 5, "fallbacks", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.validation-evidence.v1", "Validation and Rejection Semantics", 5, "validations", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.failure-policy-evidence.v1", "Exception and Failure Policy", 5, "failures", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.object-shape-evidence.v1", "Object Shape Evidence", 5, "objectShapes", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.result-contract-evidence.v1", "Result Contract Evidence", 5, "resultContracts", ["symbolId", "sourceReferenceId"]],
  ["authoring.serialization-evidence.v1", "Serialization Profile", 5, "serializations", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.normalization-evidence.v1", "Normalization and Translation", 5, "normalizations", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.iteration-evidence.v1", "Iteration Semantics", 5, "iterations", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.state-transition-evidence.v1", "State-Transition Semantics", 5, "stateTransitions", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.data-flow-slice.v1", "Data-Flow Slice", 4, "dataFlowSlices", ["entryPointId", "responsibilityId", "symbolId", "inputSymbolId", "outputSymbolId"]],
  ["authoring.authority-overlap.v1", "Existing Authority Overlap", 4, "overlaps", ["occurrenceId", "symbolId", "sourceReferenceId"]],
  ["authoring.scenario-context.v1", "Feature and Scenario Context", 4, "scenarioContexts", ["occurrenceId", "featureId", "scenarioId", "responsibilityId", "symbolId", "sourceReferenceId"]],
  ["authoring.projection-target.v1", "Projection Target Evidence", 6, "projectionTargets", ["responsibilityId", "symbolId", "modulePath"]],
  ["authoring.proof-vector-candidates.v1", "Equivalence and Proof Candidates", 6, "proofVectors", ["responsibilityId", "symbolId"]],
  ["authoring.contract-map.v1", "Authority Contract Map", 4, "contractMapRows", ["authorityFacet"]],
  ["authoring.semantic-authority-evidence-bundle.v1", "Semantic Authority Evidence Bundle", 6, "bundles", ["entryPointId", "featureId", "scenarioId", "responsibilityId", "symbolId", "sourceReferenceId", "occurrenceId"]],
  ["authoring.readiness.v1", "Authoring Readiness", 6, "readinessRows", ["occurrenceId", "responsibilityId", "subjectKind", "subjectKey", "symbolId", "authoringReadinessDisposition"]],
];

export const authoringEvidenceQueries = Object.freeze([
  ...definitions.map(([queryId, section, depth, collection, parameters]) => ({
    queryId, section, depth,
    queryText: `SELECT * FROM ${collection} WHERE registered optional parameters match the bounded authoring subject`,
    inputCollections: [collection],
    expectedResultSchema: `${section.toLowerCase()} rows with stable resultRowId and source/query provenance`,
    parameters: parameters.map(parameter),
    rows: (context) => context.authoring[collection],
    drillDowns: queryId === "authoring.readiness.v1"
      ? []
      : queryId === "authoring.semantic-authority-evidence-bundle.v1"
      ? [next("authoring.readiness.v1", "Inspect deterministic readiness", { occurrenceId: ":occurrenceId" })]
      : [next("authoring.semantic-authority-evidence-bundle.v1", "Build complete authority-authoring bundle", { symbolId: ":symbolId", occurrenceId: ":occurrenceId" })],
    rowDrillDowns: (row) => queryId === "authoring.readiness.v1"
      ? []
      : queryId === "authoring.semantic-authority-evidence-bundle.v1"
      ? [next("authoring.readiness.v1", "Inspect readiness and blockers", row.occurrenceId
        ? { occurrenceId: row.occurrenceId }
        : { responsibilityId: row.subject.responsibilityId })]
      : [next("authoring.semantic-authority-evidence-bundle.v1", "Build complete bundle", { ...(row.symbolId ? { symbolId: row.symbolId } : {}), ...(row.occurrenceId ? { occurrenceId: row.occurrenceId } : {}) })],
    terminal: queryId === "authoring.readiness.v1",
  })),
  {
    queryId: "authoring.reconciliation.v1", section: "Authority Authoring Reconciliation", depth: 0,
    queryText: "SELECT * FROM authoringReconciliation",
    inputCollections: ["authoringReconciliation"], expectedResultSchema: "one authoring completeness and readiness reconciliation row",
    parameters: [], rows: (context) => [context.authoring.authoringReconciliation],
    drillDowns: [next("authoring.readiness.v1", "Inspect every candidate readiness disposition", {})],
    rowDrillDowns: () => [next("authoring.readiness.v1", "Inspect candidate readiness", {})],
  },
]);

export const authoringActionDrillDowns = Object.freeze([
  next("authoring.semantic-authority-evidence-bundle.v1", "Build authority evidence bundle", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.scenario-context.v1", "Inspect inferred feature/scenario context", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.decision-evidence.v1", "Inspect decision policy", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.object-shape-evidence.v1", "Inspect data shapes", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.failure-policy-evidence.v1", "Inspect failure behavior", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.authority-overlap.v1", "Inspect existing authority overlap", { occurrenceId: ":occurrenceId", symbolId: ":symbolId" }),
  next("authoring.projection-target.v1", "Build projection target", { symbolId: ":symbolId" }),
  next("authoring.proof-vector-candidates.v1", "Build proof vectors", { symbolId: ":symbolId" }),
]);
