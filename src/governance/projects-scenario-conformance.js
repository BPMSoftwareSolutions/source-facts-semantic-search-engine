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

function increments(target, key) {
  target[key] = (target[key] ?? 0) + 1;
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
  const structuralBlockers = [];
  const evaluationLimits = [];

  if (artifact === null || bodyFile === null) structuralBlockers.push("RESPONSIBILITY_BINDING_MISSING");
  if (!proofDeclared) structuralBlockers.push("PROOF_UNDECLARED");
  if (bodyFile !== null && !inReportSubject) evaluationLimits.push("BODY_NOT_EVALUATED_OUTSIDE_SUBJECT");
  if (bodyFile !== null && inReportSubject && !bodyObserved) evaluationLimits.push("BODY_NOT_STATICALLY_OBSERVED");
  if (bodyObserved && wiring?.wiringDisposition === "NOT_DETERMINED_BEYOND_MAX_DEPTH") {
    evaluationLimits.push("AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT");
  }

  return Object.freeze({
    responsibilityId: responsibility.responsibilityId ?? null,
    responsibilityType: responsibility.responsibilityType ?? null,
    artifactId: responsibility.artifactId ?? null,
    authorityFile,
    bindingStatus: artifact === null || bodyFile === null ? "BINDING_MISSING" : "BINDING_DECLARED",
    bodyFile,
    bodyStatus: bodyFile === null
      ? "BODY_UNDECLARED"
      : !inReportSubject
        ? "BODY_OUTSIDE_REPORT_SUBJECT"
        : bodyObserved
          ? "BODY_STATICALLY_OBSERVED"
          : "BODY_NOT_STATICALLY_OBSERVED",
    wiringStatus: wiring?.wiringDisposition ?? "WIRING_NOT_STATICALLY_OBSERVED",
    observedMechanics: bodyOccurrences.length,
    mechanicsByType: Object.freeze(countsMechanics(bodyOccurrences)),
    executionStatus: "EXECUTION_NOT_EVALUATED",
    proofStatus: proofDeclared ? "PROOF_DECLARED_RESULT_NOT_EVALUATED" : "PROOF_NOT_DECLARED",
    structuralBlockers: Object.freeze(uniqueSorted(structuralBlockers)),
    evaluationLimits: Object.freeze(uniqueSorted(evaluationLimits)),
  });
}

function hasRelationship(artifact, relationshipType) {
  return (artifact?.relationships ?? []).some((relationship) => relationship.relationshipType === relationshipType);
}

function derivesWithinResponsibilitySet(responsibilities, artifactsById) {
  const artifactIds = new Set(responsibilities.map((responsibility) => responsibility.artifactId).filter(Boolean));
  return responsibilities.some((responsibility) => (artifactsById.get(responsibility.artifactId)?.relationships ?? []).some(
    (relationship) => relationship.relationshipType === "derived-from" && artifactIds.has(relationship.artifactId),
  ));
}

function assessesObligationLineageQuality(obligation, declaredResponsibilities, artifactsById) {
  const findings = [];
  if (declaredResponsibilities.length > 1) {
    findings.push(derivesWithinResponsibilitySet(declaredResponsibilities, artifactsById)
      ? "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
      : "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW");
  }
  if (/\b(?:must|shall)\s+be\s+projected\b|\bis\s+projected\b|\bprojects?\b/i.test(obligation.statement ?? "")
    && declaredResponsibilities.length > 0
    && declaredResponsibilities.every((responsibility) => !hasRelationship(artifactsById.get(responsibility.artifactId), "projects"))) {
    findings.push("PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP");
  }
  return uniqueSorted(findings);
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
    const structuralBlockers = [];
    const evaluationLimits = [];
    const lineageQualityFindings = [];
    if (declaredObligations.length === 0) structuralBlockers.push("OBLIGATION_UNAUTHORED");
    if (declaredObligations.length > 1) structuralBlockers.push("SCENARIO_PRIMARY_OBLIGATION_NOT_ATOMIC");
    const obligations = declaredObligations.map((obligation) => {
      const declaredResponsibilities = responsibilitiesByObligation.get(obligation.obligationId) ?? [];
      if (declaredResponsibilities.length === 0) structuralBlockers.push("RESPONSIBILITY_UNBOUND");
      const obligationQualityFindings = assessesObligationLineageQuality(obligation, declaredResponsibilities, artifactsById);
      lineageQualityFindings.push(...obligationQualityFindings);
      const responsibilities = declaredResponsibilities.map((responsibility) => projectsResponsibility({
        responsibility,
        artifactsById,
        authorityFile,
        knownModulePaths,
        occurrencesByFile,
        wiringByFile,
        workspaceRelativePrefix,
      }));
      for (const responsibility of responsibilities) {
        structuralBlockers.push(...responsibility.structuralBlockers);
        evaluationLimits.push(...responsibility.evaluationLimits);
      }
      return Object.freeze({
        obligationId: obligation.obligationId ?? null,
        statement: obligation.statement ?? "(statement not declared)",
        authorityStatus: "AUTHORITY_DECLARED",
        lineageQualityFindings: Object.freeze(obligationQualityFindings),
        responsibilities: Object.freeze(responsibilities),
      });
    });
    const uniqueStructuralBlockers = uniqueSorted(structuralBlockers);
    const uniqueEvaluationLimits = uniqueSorted(evaluationLimits);
    const projected = Object.freeze({
      scenarioId: scenario.scenarioId,
      purpose: scenario.purpose ?? "(purpose not declared)",
      lineageStatus: "SCENARIO_LINEAGE_CANONICAL",
      structuralStatus: uniqueStructuralBlockers.length > 0
        ? "STRUCTURALLY_INCOMPLETE"
        : uniqueEvaluationLimits.length > 0
          ? "STRUCTURAL_STATUS_NOT_EVALUATED"
          : "STRUCTURALLY_CLOSED",
      runtimeConformance: "NOT_EVALUATED",
      structuralBlockers: Object.freeze(uniqueStructuralBlockers),
      evaluationLimits: Object.freeze(uniqueEvaluationLimits),
      lineageQualityFindings: Object.freeze(uniqueSorted(lineageQualityFindings)),
      obligations: Object.freeze(obligations),
    });
    const entries = scenariosByFeature.get(scenario.featureId) ?? [];
    entries.push(projected);
    scenariosByFeature.set(scenario.featureId, entries);
  }

  return Object.freeze((lineage.features ?? []).map((feature) => {
    const scenarios = scenariosByFeature.get(feature.featureId) ?? [];
    return Object.freeze({
      featureId: feature.featureId,
      purpose: feature.purpose ?? "(feature purpose not declared)",
      authorityFile,
      classifications: Object.freeze(lineage.projectId === undefined ? [] : [Object.freeze({
        relationship: "SOURCE_LINEAGE_CLASSIFICATION",
        classificationId: lineage.projectId,
      })]),
      lineageQualityFindings: Object.freeze(uniqueSorted(scenarios.flatMap((scenario) => scenario.lineageQualityFindings))),
      scenarios: Object.freeze(scenarios),
    });
  }));
}

function summarizes(features, lineageDocumentCount) {
  const scenarios = features.flatMap((feature) => feature.scenarios);
  const obligations = scenarios.flatMap((scenario) => scenario.obligations);
  const responsibilities = obligations.flatMap((obligation) => obligation.responsibilities);
  const byStructuralStatus = {};
  const byRuntimeConformance = {};
  const byStructuralBlocker = {};
  const byEvaluationLimit = {};
  const byLineageQualityFinding = {};
  for (const scenario of scenarios) {
    increments(byStructuralStatus, scenario.structuralStatus);
    increments(byRuntimeConformance, scenario.runtimeConformance);
    for (const blocker of scenario.structuralBlockers) increments(byStructuralBlocker, blocker);
    for (const limit of scenario.evaluationLimits) increments(byEvaluationLimit, limit);
    for (const finding of scenario.lineageQualityFindings) increments(byLineageQualityFinding, finding);
  }
  return Object.freeze({
    lineageDocumentsDiscovered: lineageDocumentCount,
    featuresDiscovered: features.length,
    scenariosDiscovered: scenarios.length,
    obligationsDiscovered: obligations.length,
    responsibilitiesDiscovered: responsibilities.length,
    scenariosStructurallyClosed: byStructuralStatus.STRUCTURALLY_CLOSED ?? 0,
    scenariosStructurallyIncomplete: byStructuralStatus.STRUCTURALLY_INCOMPLETE ?? 0,
    scenariosStructuralStatusNotEvaluated: byStructuralStatus.STRUCTURAL_STATUS_NOT_EVALUATED ?? 0,
    scenariosExecutionEvaluated: scenarios.filter((scenario) => scenario.runtimeConformance !== "NOT_EVALUATED").length,
    scenariosConformant: byRuntimeConformance.CONFORMANT ?? 0,
    scenariosWithLineageQualityFindings: scenarios.filter((scenario) => scenario.lineageQualityFindings.length > 0).length,
    byStructuralStatus: Object.freeze(byStructuralStatus),
    byRuntimeConformance: Object.freeze(byRuntimeConformance),
    byStructuralBlocker: Object.freeze(byStructuralBlocker),
    byEvaluationLimit: Object.freeze(byEvaluationLimit),
    byLineageQualityFinding: Object.freeze(byLineageQualityFinding),
  });
}

/** Projects independent lineage, structural, runtime, and proof dimensions. */
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
