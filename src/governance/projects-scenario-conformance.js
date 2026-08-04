const scenarioBlockerOrder = Object.freeze([
  "OBLIGATION_UNAUTHORED",
  "RESPONSIBILITY_UNBOUND",
  "AUTHORITY_UNSEATED",
  "BODY_OUTSIDE_REPORT_SUBJECT",
  "BODY_NOT_OBSERVED",
  "BODY_AUTHORITY_UNCONNECTED",
  "EXECUTION_NOT_OBSERVED",
  "PROOF_RESULT_NOT_OBSERVED",
]);

function normalizesPath(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/").replace(/^\.\//, "") : null;
}

function belongsToWorkspace(modulePath, workspaceRelativePrefix) {
  if (workspaceRelativePrefix.length === 0) return true;
  return modulePath === workspaceRelativePrefix || modulePath.startsWith(`${workspaceRelativePrefix}/`);
}

function countsMechanics(occurrences) {
  const byType = {};
  for (const occurrence of occurrences) byType[occurrence.mechanic] = (byType[occurrence.mechanic] ?? 0) + 1;
  return byType;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function extractsCanonicalLineageDocuments(authorityDocuments) {
  return authorityDocuments.filter(({ document }) => {
    const lineage = document?.lineage;
    return lineage?.authorityType === "canonical-lineage-authority.v1"
      && Array.isArray(lineage.features)
      && Array.isArray(lineage.scenarios);
  });
}

function buildsBodyScenarioIndex(features, authoritySuccession) {
  const direct = new Map();
  const inferred = new Map();
  const add = (map, modulePath, lineage) => {
    if (!modulePath) return;
    const entries = map.get(modulePath) ?? [];
    entries.push(lineage);
    map.set(modulePath, entries);
  };

  for (const feature of features) {
    for (const scenario of feature.scenarios) {
      for (const obligation of scenario.obligations) {
        for (const responsibility of obligation.responsibilities) {
          if (responsibility.bodyFile === null) continue;
          add(direct, responsibility.bodyFile, {
            featureId: feature.featureId,
            featureClassificationIds: feature.classifications.map((classification) => classification.classificationId),
            scenarioId: scenario.scenarioId,
            obligationId: obligation.obligationId,
            responsibilityId: responsibility.responsibilityId,
          });
        }
      }
    }
  }

  for (const succession of authoritySuccession) {
    if (succession.successorFile === null) continue;
    for (const lineage of direct.get(succession.declaredSourceFile) ?? []) add(inferred, succession.successorFile, lineage);
  }
  return { direct, inferred };
}

function projectsResponsibility({
  responsibility,
  artifactsById,
  authorityFile,
  knownModulePaths,
  occurrencesByFile,
  wiringByFile,
  workspaceRelativePrefix,
}) {
  const artifact = artifactsById.get(responsibility.artifactId) ?? null;
  const bodyFile = normalizesPath(artifact?.relativePath);
  const inReportSubject = bodyFile !== null && belongsToWorkspace(bodyFile, workspaceRelativePrefix);
  const bodyObserved = bodyFile !== null && knownModulePaths.has(bodyFile);
  const bodyOccurrences = bodyFile === null ? [] : occurrencesByFile.get(bodyFile) ?? [];
  const wiring = bodyFile === null ? null : wiringByFile.get(bodyFile) ?? null;
  const proofDeclared = Array.isArray(artifact?.proof?.verifierIds) && artifact.proof.verifierIds.length > 0;
  const blockers = [];

  if (artifact === null || bodyFile === null) blockers.push("RESPONSIBILITY_UNBOUND");
  if (bodyFile !== null && !inReportSubject) blockers.push("BODY_OUTSIDE_REPORT_SUBJECT");
  if (bodyFile !== null && inReportSubject && !bodyObserved) blockers.push("BODY_NOT_OBSERVED");
  if (bodyObserved && (wiring === null || !["DIRECT_DATA_AND_RUNTIME", "TRANSITIVE_DATA_AND_RUNTIME"].includes(wiring.wiringDisposition))) {
    blockers.push("BODY_AUTHORITY_UNCONNECTED");
  }
  // The source-fact index is static evidence. It does not contain a runtime
  // execution observation or a passing verifier receipt.
  blockers.push("EXECUTION_NOT_OBSERVED");
  blockers.push("PROOF_RESULT_NOT_OBSERVED");

  return Object.freeze({
    responsibilityId: responsibility.responsibilityId ?? null,
    responsibilityType: responsibility.responsibilityType ?? null,
    artifactId: responsibility.artifactId ?? null,
    authorityFile,
    bindingStatus: artifact === null ? "BINDING_MISSING" : "BINDING_DECLARED",
    bodyFile,
    bodyStatus: bodyFile === null
      ? "BODY_UNDECLARED"
      : !inReportSubject
        ? "BODY_OUTSIDE_REPORT_SUBJECT"
        : bodyObserved
          ? "BODY_STATICALLY_OBSERVED"
          : "BODY_NOT_OBSERVED",
    wiringStatus: wiring?.wiringDisposition ?? "NONE_OBSERVED",
    observedMechanics: bodyOccurrences.length,
    mechanicsByType: Object.freeze(countsMechanics(bodyOccurrences)),
    executionStatus: "EXECUTION_NOT_OBSERVED",
    proofStatus: proofDeclared ? "PROOF_DECLARED_RESULT_NOT_OBSERVED" : "PROOF_NOT_DECLARED",
    blockers: Object.freeze(uniqueSorted(blockers)),
  });
}

function projectsFeatureSet({ entry, knownModulePaths, occurrences, wiring, workspaceRelativePrefix }) {
  const { document, filePath: authorityFile } = entry;
  const lineage = document.lineage;
  const artifactsById = new Map((document.artifacts ?? []).map((artifact) => [artifact.artifactId, artifact]));
  const obligationsByScenario = new Map();
  const responsibilitiesByObligation = new Map();
  const occurrencesByFile = new Map();
  const wiringByFile = new Map(wiring.map((item) => [item.modulePath, item]));

  for (const occurrence of occurrences) {
    const entries = occurrencesByFile.get(occurrence.modulePath) ?? [];
    entries.push(occurrence);
    occurrencesByFile.set(occurrence.modulePath, entries);
  }
  for (const obligation of lineage.obligations ?? []) {
    const entries = obligationsByScenario.get(obligation.scenarioId) ?? [];
    entries.push(obligation);
    obligationsByScenario.set(obligation.scenarioId, entries);
  }
  for (const responsibility of lineage.responsibilities ?? []) {
    const entries = responsibilitiesByObligation.get(responsibility.obligationId) ?? [];
    entries.push(responsibility);
    responsibilitiesByObligation.set(responsibility.obligationId, entries);
  }

  const scenariosByFeature = new Map();
  for (const scenario of lineage.scenarios ?? []) {
    const declaredObligations = obligationsByScenario.get(scenario.scenarioId) ?? [];
    const scenarioBlockers = [];
    if (declaredObligations.length === 0) scenarioBlockers.push("OBLIGATION_UNAUTHORED");
    const obligations = declaredObligations.map((obligation) => {
      const declaredResponsibilities = responsibilitiesByObligation.get(obligation.obligationId) ?? [];
      if (declaredResponsibilities.length === 0) scenarioBlockers.push("RESPONSIBILITY_UNBOUND");
      const responsibilities = declaredResponsibilities.map((responsibility) => projectsResponsibility({
        responsibility,
        artifactsById,
        authorityFile,
        knownModulePaths,
        occurrencesByFile,
        wiringByFile,
        workspaceRelativePrefix,
      }));
      for (const responsibility of responsibilities) scenarioBlockers.push(...responsibility.blockers);
      return Object.freeze({
        obligationId: obligation.obligationId ?? null,
        statement: obligation.statement ?? "(statement not declared)",
        authorityStatus: "AUTHORITY_DECLARED",
        responsibilities: Object.freeze(responsibilities),
      });
    });
    const blockers = uniqueSorted(scenarioBlockers);
    const closureDisposition = scenarioBlockerOrder.find((blocker) => blockers.includes(blocker)) ?? "CONFORMANT";
    const projected = Object.freeze({
      scenarioId: scenario.scenarioId,
      purpose: scenario.purpose ?? "(purpose not declared)",
      closureDisposition,
      blockers: Object.freeze(blockers),
      obligations: Object.freeze(obligations),
    });
    const entries = scenariosByFeature.get(scenario.featureId) ?? [];
    entries.push(projected);
    scenariosByFeature.set(scenario.featureId, entries);
  }

  return Object.freeze((lineage.features ?? []).map((feature) => Object.freeze({
      featureId: feature.featureId,
      purpose: feature.purpose ?? "(feature purpose not declared)",
      authorityFile,
      classifications: Object.freeze(lineage.projectId === undefined ? [] : [Object.freeze({
        relationship: "FEATURE_CLASSIFIED_UNDER_SOURCE_LINEAGE",
        classificationId: lineage.projectId,
      })]),
      scenarios: Object.freeze(scenariosByFeature.get(feature.featureId) ?? []),
    })));
}

function summarizes(features, lineageDocumentCount) {
  const scenarios = features.flatMap((feature) => feature.scenarios);
  const obligations = scenarios.flatMap((scenario) => scenario.obligations);
  const responsibilities = obligations.flatMap((obligation) => obligation.responsibilities);
  const byClosureDisposition = {};
  const byBlocker = {};
  for (const scenario of scenarios) {
    byClosureDisposition[scenario.closureDisposition] = (byClosureDisposition[scenario.closureDisposition] ?? 0) + 1;
    for (const blocker of scenario.blockers) byBlocker[blocker] = (byBlocker[blocker] ?? 0) + 1;
  }
  return Object.freeze({
    lineageDocumentsDiscovered: lineageDocumentCount,
    featuresDiscovered: features.length,
    scenariosDiscovered: scenarios.length,
    obligationsDiscovered: obligations.length,
    responsibilitiesDiscovered: responsibilities.length,
    scenariosConformant: byClosureDisposition.CONFORMANT ?? 0,
    byClosureDisposition: Object.freeze(byClosureDisposition),
    byBlocker: Object.freeze(byBlocker),
  });
}

/** Projects the feature -> scenario -> responsibility -> obligation spine. */
export function projectsScenarioConformance({
  authorityDocuments,
  knownModulePaths,
  occurrences,
  wiring,
  authoritySuccession,
  workspaceRelativePrefix = "",
}) {
  const lineageDocuments = extractsCanonicalLineageDocuments(authorityDocuments);
  const features = lineageDocuments.flatMap((entry) => projectsFeatureSet({
    entry,
    knownModulePaths,
    occurrences,
    wiring,
    workspaceRelativePrefix,
  })).sort((left, right) => left.featureId.localeCompare(right.featureId));
  const bodyScenarioIndex = buildsBodyScenarioIndex(features, authoritySuccession);

  return Object.freeze({
    summary: summarizes(features, lineageDocuments.length),
    features: Object.freeze(features),
    lineageAuthorityFiles: Object.freeze(lineageDocuments.map((entry) => entry.filePath).sort()),
    bodyScenarioIndex,
  });
}

export function resolvesOccurrenceScenarioLineage(modulePath, bodyScenarioIndex) {
  const direct = bodyScenarioIndex.direct.get(modulePath) ?? [];
  const inferred = bodyScenarioIndex.inferred.get(modulePath) ?? [];
  const candidates = direct.length > 0 ? direct : inferred;
  const scenarioIds = uniqueSorted(candidates.map((candidate) => candidate.scenarioId));
  return Object.freeze({
    lineageDisposition: scenarioIds.length > 1
      ? "MULTIPLE_CANDIDATE_SCENARIOS"
      : direct.length > 0
        ? "LINEAGE_CONFIRMED"
        : inferred.length > 0
          ? "LINEAGE_INFERRED_PENDING_REVIEW"
          : "NO_SCENARIO_LINEAGE",
    featureClassificationIds: Object.freeze(uniqueSorted(candidates.flatMap((candidate) => candidate.featureClassificationIds))),
    featureIds: Object.freeze(uniqueSorted(candidates.map((candidate) => candidate.featureId))),
    scenarioIds: Object.freeze(scenarioIds),
    obligationIds: Object.freeze(uniqueSorted(candidates.map((candidate) => candidate.obligationId))),
    lineageResponsibilityIds: Object.freeze(uniqueSorted(candidates.map((candidate) => candidate.responsibilityId))),
  });
}
