import { createHash } from "node:crypto";

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}

export function createsFeatureFingerprint(subject) {
  const canonical = JSON.stringify(canonicalizes(subject));
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function canonicalFeatureSubjects(authorityDocuments) {
  const subjects = [];
  for (const { document } of authorityDocuments) {
    const lineage = document?.lineage;
    if (lineage?.authorityType !== "canonical-lineage-authority.v1") continue;
    const artifactsById = new Map((document.artifacts ?? []).map((artifact) => [artifact.artifactId, artifact]));
    for (const feature of lineage.features ?? []) {
      const scenarios = (lineage.scenarios ?? []).filter((scenario) => scenario.featureId === feature.featureId);
      const scenarioIds = new Set(scenarios.map((scenario) => scenario.scenarioId));
      const obligations = (lineage.obligations ?? []).filter((obligation) => scenarioIds.has(obligation.scenarioId));
      const obligationIds = new Set(obligations.map((obligation) => obligation.obligationId));
      const responsibilities = (lineage.responsibilities ?? []).filter((responsibility) => obligationIds.has(responsibility.obligationId));
      const authoritySubjects = [];
      for (const responsibility of responsibilities) {
        const artifact = artifactsById.get(responsibility.artifactId);
        for (const relationship of artifact?.relationships ?? []) {
          authoritySubjects.push(relationship.artifactId, relationship.runtimeAuthorityId);
        }
      }
      const fingerprintSubject = {
        scenarios: scenarios.map((scenario) => ({
          scenarioId: scenario.scenarioId,
          obligations: obligations
            .filter((obligation) => obligation.scenarioId === scenario.scenarioId)
            .map((obligation) => ({ obligationId: obligation.obligationId, statement: obligation.statement }))
            .sort((left, right) => left.obligationId.localeCompare(right.obligationId)),
        })).sort((left, right) => left.scenarioId.localeCompare(right.scenarioId)),
        responsibilityIdentities: uniqueSorted(responsibilities.map((responsibility) => responsibility.responsibilityId)),
        semanticAuthoritySubjects: uniqueSorted(authoritySubjects),
      };
      subjects.push({
        featureId: feature.featureId,
        fingerprint: createsFeatureFingerprint(fingerprintSubject),
        scenarioIds: uniqueSorted(scenarios.map((scenario) => scenario.scenarioId)),
      });
    }
  }
  return subjects;
}

function proposalFingerprintSubject(document) {
  return {
    scenarios: (document.scenarios ?? []).map((scenario) => ({
      scenarioId: scenario.candidateScenarioId,
      obligations: (document.obligations ?? [])
        .filter((obligation) => obligation.scenarioId === scenario.candidateScenarioId)
        .map((obligation) => ({ obligationId: obligation.candidateObligationId, statement: obligation.statement }))
        .sort((left, right) => left.obligationId.localeCompare(right.obligationId)),
    })).sort((left, right) => left.scenarioId.localeCompare(right.scenarioId)),
    responsibilityIdentities: uniqueSorted((document.responsibilities ?? []).map((responsibility) => responsibility.candidateResponsibilityId)),
    semanticAuthoritySubjects: uniqueSorted(document.evidence?.authoritySubjects ?? []),
  };
}

export function createsProposalFeatureFingerprint(document) {
  return createsFeatureFingerprint(proposalFingerprintSubject(document));
}

export function validatesFeatureCoverageProposal(document) {
  const findings = [];
  if (document?.documentKind !== "feature-coverage-proposal.v1") findings.push("DOCUMENT_KIND_INVALID");
  if (document?.lifecycle !== "INFERRED_NOT_ADMITTED" && document?.lifecycle !== "ADMITTED") findings.push("LIFECYCLE_INVALID");
  if (typeof document?.proposalId !== "string" || document.proposalId.length === 0) findings.push("PROPOSAL_ID_MISSING");
  if (document?.capability !== undefined) findings.push("CAPABILITY_PARENT_FIELD_NOT_ALLOWED");
  if (typeof document?.feature?.candidateFeatureId !== "string") findings.push("FEATURE_ID_MISSING");
  if (!Array.isArray(document?.scenarios) || document.scenarios.length === 0) findings.push("SCENARIOS_MISSING");
  if (!Array.isArray(document?.responsibilities) || document.responsibilities.length === 0) findings.push("RESPONSIBILITIES_MISSING");
  if (!Array.isArray(document?.obligations) || document.obligations.length === 0) findings.push("OBLIGATIONS_MISSING");
  if (!Array.isArray(document?.evidence?.sourceFiles) || document.evidence.sourceFiles.length === 0) findings.push("SOURCE_EVIDENCE_MISSING");

  const scenarios = new Map((document?.scenarios ?? []).map((scenario) => [scenario.candidateScenarioId, scenario]));
  const obligations = new Map((document?.obligations ?? []).map((obligation) => [obligation.candidateObligationId, obligation]));
  for (const scenario of scenarios.values()) {
    const ownedObligations = [...obligations.values()].filter((obligation) => obligation.scenarioId === scenario.candidateScenarioId);
    if (ownedObligations.length !== 1 || ownedObligations[0]?.candidateObligationId !== scenario.primaryObligationId) {
      findings.push(`SCENARIO_PRIMARY_OBLIGATION_NOT_ATOMIC:${scenario.candidateScenarioId}`);
    }
    if (typeof scenario.observableResult !== "string" || scenario.observableResult.length === 0) findings.push(`SCENARIO_OBSERVABLE_RESULT_MISSING:${scenario.candidateScenarioId}`);
    if (typeof scenario.conformanceSignal !== "string" || scenario.conformanceSignal.length === 0) findings.push(`SCENARIO_CONFORMANCE_SIGNAL_MISSING:${scenario.candidateScenarioId}`);
  }
  for (const responsibility of document?.responsibilities ?? []) {
    if (!scenarios.has(responsibility.scenarioId)) findings.push(`RESPONSIBILITY_SCENARIO_NOT_RESOLVED:${responsibility.candidateResponsibilityId}`);
    if (!obligations.has(responsibility.obligationId)) findings.push(`RESPONSIBILITY_OBLIGATION_NOT_RESOLVED:${responsibility.candidateResponsibilityId}`);
  }
  for (const obligation of obligations.values()) {
    if (!scenarios.has(obligation.scenarioId)) findings.push(`OBLIGATION_SCENARIO_NOT_RESOLVED:${obligation.candidateObligationId}`);
  }
  const allowedCapabilityDispositions = new Set([
    "CAPABILITY_RELATION_CONFIRMED",
    "CAPABILITY_RELATION_PROPOSED",
    "CAPABILITY_RELATION_AMBIGUOUS",
    "FEATURE_SUPPORTS_MULTIPLE_CAPABILITIES",
  ]);
  for (const relation of document?.capabilityRelations ?? []) {
    if (relation.relationship !== "FEATURE_CONTRIBUTES_TO_CAPABILITY") findings.push(`CAPABILITY_RELATION_TYPE_INVALID:${relation.candidateCapabilityId ?? "(missing)"}`);
    if (!allowedCapabilityDispositions.has(relation.disposition)) findings.push(`CAPABILITY_RELATION_DISPOSITION_INVALID:${relation.candidateCapabilityId ?? "(missing)"}`);
    if (!(relation.supportedByFeatures ?? []).includes(document.feature?.candidateFeatureId)) findings.push(`CAPABILITY_RELATION_FEATURE_NOT_LINKED:${relation.candidateCapabilityId ?? "(missing)"}`);
    if (typeof relation.evidence?.sharedSubject !== "string" || typeof relation.evidence?.sharedOutcome !== "string"
      || !Array.isArray(relation.evidence?.sharedResponsibilities)) {
      findings.push(`CAPABILITY_RELATION_EVIDENCE_MISSING:${relation.candidateCapabilityId ?? "(missing)"}`);
    }
  }
  const capabilityRelationDisposition = document?.capabilityRelationDisposition;
  if (capabilityRelationDisposition !== undefined && !new Set([
    "CAPABILITY_RELATION_CONFIRMED",
    "CAPABILITY_RELATION_PROPOSED",
    "CAPABILITY_RELATION_AMBIGUOUS",
    "FEATURE_SUPPORTS_MULTIPLE_CAPABILITIES",
    "NO_CAPABILITY_RELATION_DETECTED",
  ]).has(capabilityRelationDisposition)) findings.push("CAPABILITY_RELATION_ASSESSMENT_INVALID");
  if (capabilityRelationDisposition === "NO_CAPABILITY_RELATION_DETECTED" && (document?.capabilityRelations ?? []).length > 0) {
    findings.push("CAPABILITY_RELATION_ASSESSMENT_CONTRADICTS_RELATIONS");
  }
  if (typeof document?.featureFingerprint !== "string") {
    findings.push("FEATURE_FINGERPRINT_MISSING");
  } else if (findings.length === 0 && document.featureFingerprint !== createsProposalFeatureFingerprint(document)) {
    findings.push("FEATURE_FINGERPRINT_MISMATCH");
  }
  return Object.freeze(findings);
}

function resolvesDuplicateDisposition(document, fingerprint, canonicalFeatures, priorProposalFingerprints) {
  if (canonicalFeatures.some((feature) => feature.fingerprint === fingerprint)) return "EXACT_FEATURE_MATCH";
  if (priorProposalFingerprints.has(fingerprint)) return "DUPLICATE_FEATURE_PROPOSAL";
  const sameFeature = canonicalFeatures.find((feature) => feature.featureId === document.feature?.candidateFeatureId);
  if (sameFeature !== undefined) {
    const proposedScenarioIds = new Set((document.scenarios ?? []).map((scenario) => scenario.candidateScenarioId));
    return [...proposedScenarioIds].some((scenarioId) => !sameFeature.scenarioIds.includes(scenarioId))
      ? "SCENARIO_EXTENSION_CANDIDATE"
      : "FEATURE_EXTENSION_CANDIDATE";
  }
  return "NEW_FEATURE_CANDIDATE";
}

function resolvesEvaluationComparison(candidate, fingerprint, canonicalFeatures, proposals) {
  if (canonicalFeatures.some((feature) => feature.fingerprint === fingerprint)) return "EXACT_FEATURE_MATCH";
  if (proposals.some((proposal) => proposal.fingerprint === fingerprint)) return "DUPLICATE_FEATURE_PROPOSAL";
  const candidateEvidence = candidate.evidence ?? {};
  const overlaps = (left = [], right = []) => left.some((value) => right.includes(value));
  const sharesEvidenceCluster = proposals.some((proposal) => (
    overlaps(candidateEvidence.sourceFiles, proposal.evidence.sourceFiles)
    && overlaps(candidateEvidence.mechanics, proposal.evidence.mechanics)
    && (candidateEvidence.symbols?.length === 0
      || proposal.evidence.symbols.length === 0
      || overlaps(candidateEvidence.symbols, proposal.evidence.symbols))
  ));
  if (sharesEvidenceCluster) return "OVERLAPPING_FEATURES_REQUIRE_REVIEW";
  const featureId = candidate.feature?.candidateFeatureId;
  if (canonicalFeatures.some((feature) => feature.featureId === featureId)
    || proposals.some((proposal) => proposal.featureId === featureId)) {
    return "OVERLAPPING_FEATURES_REQUIRE_REVIEW";
  }
  return "NEW_FEATURE_CANDIDATE";
}

function proposalMatchesOccurrence(proposal, occurrence) {
  const evidence = proposal.evidence;
  if (!evidence.sourceFiles.includes(occurrence.modulePath)) return false;
  if (evidence.mechanics.length > 0 && !evidence.mechanics.includes(occurrence.mechanic)) return false;
  if (evidence.symbols.length > 0 && !evidence.symbols.includes(occurrence.symbolName)) {
    const moduleResponsibilityMatch = occurrence.symbolName === null && (proposal.responsibilities ?? []).some(
      (responsibility) => responsibility.sourceFile === occurrence.modulePath && evidence.symbols.includes(responsibility.symbol),
    );
    if (!moduleResponsibilityMatch) return false;
  }
  return true;
}

function classifiesFeatureCoverage(occurrence, proposals) {
  if (occurrence.lineageDisposition === "LINEAGE_CONFIRMED") return "FEATURE_COVERED";
  if (occurrence.lineageDisposition === "MULTIPLE_CANDIDATE_SCENARIOS") return "FEATURE_LINEAGE_AMBIGUOUS";
  if (occurrence.lineageDisposition === "LINEAGE_INFERRED_PENDING_REVIEW") return "FEATURE_COVERAGE_PROPOSED";
  const matching = proposals.filter((proposal) => proposalMatchesOccurrence(proposal, occurrence));
  if (matching.length > 1) return "FEATURE_LINEAGE_AMBIGUOUS";
  if (matching.length === 1) {
    return matching[0].lifecycle === "ADMITTED" ? "FEATURE_COVERED" : "FEATURE_COVERAGE_PROPOSED";
  }
  return "FEATURE_COVERAGE_MISSING";
}

function clustersUncoveredOccurrences(occurrences) {
  const clusters = new Map();
  for (const occurrence of occurrences) {
    if (occurrence.featureCoveragePosture !== "FEATURE_COVERAGE_MISSING") continue;
    const clusterId = `${occurrence.modulePath}#${occurrence.symbolName ?? "(module-scope)"}`;
    const cluster = clusters.get(clusterId) ?? {
      clusterId,
      modulePath: occurrence.modulePath,
      responsibility: occurrence.symbolName ?? null,
      clusterKind: occurrence.symbolName === null
        ? "SUPPORTING_IMPLEMENTATION_CLUSTER"
        : "RESPONSIBILITY_EVIDENCE_CLUSTER",
      featureCandidateDisposition: "FEATURE_CANDIDACY_NOT_EVALUATED",
      inferenceEligibility: "REQUIRES_FEATURE_SHAPING_REVIEW",
      occurrences: 0,
      mechanics: new Set(),
      authorityFamilies: new Set(),
    };
    cluster.occurrences += 1;
    cluster.mechanics.add(occurrence.mechanic);
    cluster.authorityFamilies.add(occurrence.authorityFamily);
    clusters.set(clusterId, cluster);
  }
  return [...clusters.values()].map((cluster) => Object.freeze({
    ...cluster,
    mechanics: Object.freeze([...cluster.mechanics].sort()),
    authorityFamilies: Object.freeze([...cluster.authorityFamilies].sort()),
  })).sort((left, right) => right.occurrences - left.occurrences || left.clusterId.localeCompare(right.clusterId));
}

function projectsEntityCoverage({ authorityDocuments, scenarioConformance, proposals, uncoveredClusters, knowHowRegistry, healingDraftRegistry }) {
  const lineageAuthorityFiles = new Set(scenarioConformance.lineageAuthorityFiles);
  const proposalAuthoritySubjects = new Set(proposals.flatMap((proposal) => proposal.evidence.authoritySubjects));
  const proposalKnowHow = new Set(proposals.flatMap((proposal) => proposal.evidence.knowHow));
  const proposalHealingDrafts = new Set(proposals.flatMap((proposal) => proposal.evidence.healingDrafts));
  const canonicalResponsibilities = scenarioConformance.features
    .flatMap((feature) => feature.scenarios)
    .flatMap((scenario) => scenario.obligations)
    .flatMap((obligation) => obligation.responsibilities)
    .map((responsibility) => Object.freeze({
      responsibilityId: responsibility.responsibilityId,
      source: responsibility.bodyFile,
      featureCoveragePosture: "FEATURE_COVERED",
    }));
  const proposedResponsibilities = proposals.flatMap((proposal) => proposal.responsibilities.map((responsibility) => Object.freeze({
    responsibilityId: responsibility.candidateResponsibilityId,
    source: responsibility.sourceFile ?? null,
    featureCoveragePosture: proposal.lifecycle === "ADMITTED" ? "FEATURE_COVERED" : "FEATURE_COVERAGE_PROPOSED",
  })));
  const uncoveredResponsibilities = uncoveredClusters.map((cluster) => Object.freeze({
    responsibilityId: cluster.responsibility,
    source: cluster.modulePath,
    featureCoveragePosture: "FEATURE_COVERAGE_MISSING",
  }));

  return Object.freeze({
    authoritySubjects: Object.freeze(authorityDocuments.map((entry) => {
      const authorityIdentities = [
        entry.filePath,
        entry.document?.subjectId,
        entry.document?.subject?.subjectId,
        ...(entry.document?.authority?.mechanics ?? []).map((mechanic) => mechanic.mechanicId),
      ].filter(Boolean);
      return Object.freeze({
        authorityFile: entry.filePath,
        featureCoveragePosture: lineageAuthorityFiles.has(entry.filePath)
          ? "FEATURE_COVERED"
          : authorityIdentities.some((identity) => proposalAuthoritySubjects.has(identity))
            ? "FEATURE_COVERAGE_PROPOSED"
            : "FEATURE_COVERAGE_MISSING",
      });
    })),
    responsibilities: Object.freeze([...canonicalResponsibilities, ...proposedResponsibilities, ...uncoveredResponsibilities]),
    knowHow: Object.freeze(knowHowRegistry.knowHowRecords.map((record) => Object.freeze({
      knowHowId: record.knowHowId,
      featureCoveragePosture: proposalKnowHow.has(record.knowHowId)
        ? "FEATURE_COVERAGE_PROPOSED"
        : "FEATURE_COVERAGE_MISSING",
    }))),
    healingDrafts: Object.freeze(healingDraftRegistry.drafts.map((draft) => Object.freeze({
      draftFile: draft.draftFile,
      featureCoveragePosture: proposalHealingDrafts.has(draft.draftFile)
        ? "FEATURE_COVERAGE_PROPOSED"
        : "FEATURE_COVERAGE_MISSING",
    }))),
  });
}

export function projectsFeatureCoverage({ authorityDocuments, proposalBatches, evaluationBatches = [], occurrences, scenarioConformance, knowHowRegistry, healingDraftRegistry }) {
  const canonicalFeatures = canonicalFeatureSubjects(authorityDocuments);
  const priorProposalFingerprints = new Set();
  const proposals = proposalBatches.map(({ filePath, document }) => {
    const validationFindings = validatesFeatureCoverageProposal(document);
    if (validationFindings.length > 0) {
      throw new Error(`feature coverage proposal validation failed for ${filePath}: ${validationFindings.join(", ")}`);
    }
    const fingerprint = createsProposalFeatureFingerprint(document);
    const duplicateDisposition = resolvesDuplicateDisposition(document, fingerprint, canonicalFeatures, priorProposalFingerprints);
    priorProposalFingerprints.add(fingerprint);
    return Object.freeze({
      proposalFile: filePath,
      proposalId: document.proposalId,
      lifecycle: document.lifecycle,
      featureId: document.feature?.candidateFeatureId ?? null,
      featureTitle: document.feature?.title ?? null,
      narrative: Object.freeze(document.feature?.narrative ?? {}),
      scenarios: Object.freeze(document.scenarios ?? []),
      responsibilities: Object.freeze(document.responsibilities ?? []),
      obligations: Object.freeze(document.obligations ?? []),
      capabilityRelationDisposition: document.capabilityRelationDisposition ?? null,
      capabilityRelations: Object.freeze(document.capabilityRelations ?? []),
      evidence: Object.freeze({
        sourceFiles: Object.freeze(document.evidence?.sourceFiles ?? []),
        symbols: Object.freeze(document.evidence?.symbols ?? []),
        mechanics: Object.freeze(document.evidence?.mechanics ?? []),
        authoritySubjects: Object.freeze(document.evidence?.authoritySubjects ?? []),
        knowHow: Object.freeze(document.evidence?.knowHow ?? []),
        inferenceBatches: Object.freeze(document.evidence?.inferenceBatches ?? []),
        healingDrafts: Object.freeze(document.evidence?.healingDrafts ?? []),
      }),
      coverageTarget: Object.freeze(document.coverageTarget ?? {}),
      fingerprint,
      declaredFingerprint: document.featureFingerprint ?? null,
      fingerprintVerified: document.featureFingerprint === undefined || document.featureFingerprint === fingerprint,
      validationFindings,
      duplicateDisposition,
    });
  });

  const classifiedOccurrences = occurrences.map((occurrence) => Object.freeze({
    ...occurrence,
    featureCoveragePosture: classifiesFeatureCoverage(occurrence, proposals),
  }));
  const proposalsWithObservedCoverage = proposals.map((proposal) => Object.freeze({
    ...proposal,
    matchedOccurrences: classifiedOccurrences.filter((occurrence) => proposalMatchesOccurrence(proposal, occurrence)).length,
  }));
  const liveInferenceEvaluations = evaluationBatches.map(({ filePath, document }) => {
    if (document?.lifecycle !== "OBSERVATIONAL_NOT_ADMISSIBLE") {
      throw new Error(`feature inference evaluation lifecycle invalid for ${filePath}`);
    }
    const candidate = document.candidate;
    const validationFindings = validatesFeatureCoverageProposal(candidate);
    if (validationFindings.length > 0) {
      throw new Error(`live feature inference validation failed for ${filePath}: ${validationFindings.join(", ")}`);
    }
    const fingerprint = createsProposalFeatureFingerprint(candidate);
    return Object.freeze({
      evaluationFile: filePath,
      evaluationId: document.evaluationId ?? null,
      lifecycle: document.lifecycle,
      featureId: candidate.feature?.candidateFeatureId ?? null,
      featureTitle: candidate.feature?.title ?? null,
      scenarios: candidate.scenarios?.length ?? 0,
      responsibilities: candidate.responsibilities?.length ?? 0,
      capabilityRelations: Object.freeze(candidate.capabilityRelations ?? []),
      capabilityRelationDisposition: candidate.capabilityRelationDisposition ?? null,
      fingerprint,
      comparisonDisposition: resolvesEvaluationComparison(candidate, fingerprint, canonicalFeatures, proposalsWithObservedCoverage),
      model: candidate.inference?.resolvedModel ?? null,
      providerKind: candidate.inference?.providerKind ?? null,
      requestId: candidate.inference?.requestId ?? null,
      requestHash: candidate.inference?.requestHash ?? null,
      responseHash: candidate.inference?.responseHash ?? null,
      usage: Object.freeze(candidate.inference?.usage ?? {}),
      durationMilliseconds: candidate.inference?.durationMilliseconds ?? null,
      queryEvidence: Object.freeze(candidate.queryEvidence ?? {}),
      modelAssessment: Object.freeze(candidate.modelAssessment ?? {}),
    });
  });
  const byPosture = {};
  for (const occurrence of classifiedOccurrences) {
    byPosture[occurrence.featureCoveragePosture] = (byPosture[occurrence.featureCoveragePosture] ?? 0) + 1;
  }
  const uncoveredClusters = clustersUncoveredOccurrences(classifiedOccurrences);
  const entityCoverage = projectsEntityCoverage({
    authorityDocuments,
    scenarioConformance,
    proposals: proposalsWithObservedCoverage,
    uncoveredClusters,
    knowHowRegistry,
    healingDraftRegistry,
  });
  const scenarioSummary = scenarioConformance.summary;
  const pendingProposals = proposals.filter((proposal) => proposal.lifecycle !== "ADMITTED");
  const countsEntityPostures = (entries) => {
    const counts = {};
    for (const entry of entries) counts[entry.featureCoveragePosture] = (counts[entry.featureCoveragePosture] ?? 0) + 1;
    return counts;
  };
  const authorityByPosture = countsEntityPostures(entityCoverage.authoritySubjects);
  const clustersByKind = {};
  for (const cluster of uncoveredClusters) clustersByKind[cluster.clusterKind] = (clustersByKind[cluster.clusterKind] ?? 0) + 1;
  return Object.freeze({
    summary: Object.freeze({
      canonicalFeatures: scenarioSummary.featuresDiscovered,
      proposedFeatures: pendingProposals.length,
      canonicalScenarios: scenarioSummary.scenariosDiscovered,
      proposedScenarios: pendingProposals.reduce((count, proposal) => count + proposal.scenarios.length, 0),
      scenarios: scenarioSummary.scenariosDiscovered,
      fullyConformantScenarios: scenarioSummary.scenariosConformant,
      scenariosStructurallyClosed: scenarioSummary.scenariosStructurallyClosed,
      scenariosStructurallyIncomplete: scenarioSummary.scenariosStructurallyIncomplete,
      scenariosStructuralStatusNotEvaluated: scenarioSummary.scenariosStructuralStatusNotEvaluated,
      scenariosExecutionEvaluated: scenarioSummary.scenariosExecutionEvaluated,
      scenariosRuntimeNotEvaluated: scenarioSummary.byRuntimeConformance.NOT_EVALUATED ?? 0,
      scenariosWithLineageQualityFindings: scenarioSummary.scenariosWithLineageQualityFindings,
      featureProposalsPendingReview: pendingProposals.length,
      unresolvedEvidenceClusters: uncoveredClusters.length,
      supportingImplementationClusters: clustersByKind.SUPPORTING_IMPLEMENTATION_CLUSTER ?? 0,
      responsibilityEvidenceClusters: clustersByKind.RESPONSIBILITY_EVIDENCE_CLUSTER ?? 0,
      confirmedFeatureCandidateClusters: 0,
      capabilityRelationsProposed: proposals.flatMap((proposal) => proposal.capabilityRelations ?? []).length,
      liveInferenceEvaluations: liveInferenceEvaluations.length,
      duplicateProposalsPrevented: proposals.filter((proposal) => ["EXACT_FEATURE_MATCH", "DUPLICATE_FEATURE_PROPOSAL"].includes(proposal.duplicateDisposition)).length,
      mechanicsWithCanonicalLineage: byPosture.FEATURE_COVERED ?? 0,
      mechanicsWithProposedLineage: byPosture.FEATURE_COVERAGE_PROPOSED ?? 0,
      mechanicsWithAmbiguousLineage: byPosture.FEATURE_LINEAGE_AMBIGUOUS ?? 0,
      mechanicsWithoutLineage: byPosture.FEATURE_COVERAGE_MISSING ?? 0,
      authorityWithCanonicalLineage: authorityByPosture.FEATURE_COVERED ?? 0,
      authorityWithProposedLineage: authorityByPosture.FEATURE_COVERAGE_PROPOSED ?? 0,
      authorityWithAmbiguousLineage: authorityByPosture.FEATURE_LINEAGE_AMBIGUOUS ?? 0,
      authorityWithoutLineage: authorityByPosture.FEATURE_COVERAGE_MISSING ?? 0,
      unclassifiedMechanics: byPosture.FEATURE_COVERAGE_MISSING ?? 0,
      byPosture: Object.freeze(byPosture),
      authorityByPosture: Object.freeze(authorityByPosture),
    }),
    proposals: Object.freeze(proposalsWithObservedCoverage),
    liveInferenceEvaluations: Object.freeze(liveInferenceEvaluations),
    uncoveredClusters: Object.freeze(uncoveredClusters),
    entityCoverage,
    occurrences: Object.freeze(classifiedOccurrences),
  });
}
