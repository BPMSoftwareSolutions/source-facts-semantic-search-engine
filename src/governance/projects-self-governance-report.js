import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics, knownPostures } from "./classifies-execution-mechanics.js";
import { resolvesAuthorityFamily } from "./mechanic-authority-families.js";
import { buildsAuthorityHomeIndex, resolvesAuthorityHomeStatus, joinsRepositoryRelativePath, knownHomeStatuses } from "./resolves-authority-home-status.js";
import { authorityDeclarationKind } from "./detects-authority-document-kind.js";
import { resolvesClaimedFiles } from "./resolves-authority-document-claims.js";
import { resolvesDataDrivenWiring } from "./resolves-data-driven-wiring.js";
import { measuresContractSemanticVolume } from "./measures-contract-semantic-volume.js";
import { extractsCandidateAuthorityMechanics, resolvesCandidateAuthorityMatch, classifiesAutomationReadiness, knownAutomationDispositions } from "./classifies-automation-readiness.js";
import { resolvesAuthoritySuccession } from "./resolves-authority-succession.js";
import { summarizesSemanticOverlapProposalBatch } from "./summarizes-semantic-overlap-proposals.js";
import { summarizesKnowHowRegistry } from "./summarizes-know-how-registry.js";
import { summarizesHealingDraftRegistry } from "./summarizes-healing-drafts.js";
import { scopesSelfGovernanceSubject } from "./scopes-self-governance-subject.js";
import { projectsScenarioConformance, resolvesOccurrenceScenarioLineage } from "./projects-scenario-conformance.js";
import { projectsFeatureCoverage } from "./projects-feature-coverage.js";
import { projectsReportQueryLineage, reconcilesReportQueryLineage } from "./projects-report-query-lineage.js";
import { projectsInterfaceGovernance } from "./projects-interface-governance.js";

function compareOccurrences(left, right) {
  return left.modulePath.localeCompare(right.modulePath)
    || (left.startLine ?? 0) - (right.startLine ?? 0)
    || (left.endLine ?? 0) - (right.endLine ?? 0)
    || left.mechanic.localeCompare(right.mechanic);
}

/**
 * A SQL JOIN through the SEJ relational engine over the full bodyMechanics x
 * sourceReferences tables measured at 270-320 seconds for this workspace's
 * ~66k source references -- an unindexed nested-loop join. Every field this
 * report needs is already held in memory, so resolve it with plain Map
 * lookups instead; the equivalent join runs in under 20ms.
 *
 * modulePath is normalized to repository-root-relative here (not left
 * workspace-relative) because authority documents declare sourceFile and
 * sourceLocation relative to the repository root. Comparing a workspace-
 * relative "console/foo.mjs" against a repo-relative "src/console/foo.mjs"
 * would never match even when they name the same file.
 */
function resolvesBodyMechanicOccurrences(index, workspaceRelativePrefix) {
  const sourceReferenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
  const symbolById = new Map(index.symbols.map((symbol) => [symbol.symbolId, symbol]));

  const occurrences = index.bodyMechanics.map((mechanic) => {
    const sourceReference = sourceReferenceById.get(mechanic.sourceReferenceId) ?? null;
    const symbol = mechanic.fromSymbolId ? symbolById.get(mechanic.fromSymbolId) ?? null : null;
    return {
      mechanic: mechanic.mechanic,
      modulePath: joinsRepositoryRelativePath(workspaceRelativePrefix, mechanic.modulePath),
      startLine: sourceReference?.startLine ?? null,
      endLine: sourceReference?.endLine ?? null,
      symbolName: symbol?.name ?? null,
    };
  });

  return occurrences.sort(compareOccurrences);
}

function fileBreakdownKey(mechanic, modulePath) {
  return `${mechanic}\u0000${modulePath}`;
}

/**
 * Loop 2 (execution-mechanics coverage) + the file/authority-home slice of
 * loop 3 from the self-governance substrate design: classify every observed
 * mechanic into a governance posture, classify it into the authority family
 * that should own its meaning, and resolve whether a home for that family
 * already exists for its file. dataDrivenWiring answers a related but
 * distinct question -- not "is this occurrence governed" but "does this
 * file's own code already import a JSON contract and/or a semantic
 * execution runtime" -- since a file can be one step from full governance
 * (wired to the runtime, just not yet AUTHORITY_BOUND) or zero steps in.
 * contractSemanticVolume answers a third question: how much declared meaning
 * (decisions, semantic edges, failure policies, mechanics, ...) exists across
 * every discovered authority-shaped document, and how much of it is reachable
 * from files that still exist versus orphaned by a moved or removed target.
 * automationDisposition (per occurrence, rolled up as automationReadiness)
 * answers a fourth, narrower question for every ungoverned occurrence: not
 * "does authority exist for this file" but "can this specific occurrence be
 * connected to authority without new authoring, and if not, what is missing."
 * It reuses the same reachable-candidate evidence contractSemanticVolume
 * measures at the document level, but at occurrence granularity and with
 * mechanic-type + line-range matching, so a not-yet-admitted draft candidate
 * that already describes this occurrence is surfaced as reachable even when
 * resolvesAuthorityHomeStatus's exact-sourceFile match would call the file's
 * authority home missing or merely unverified.
 * authoritySuccession answers a fifth, related question at the document
 * level: when a declared sourceFile exists but no longer carries its
 * declared mechanic types (a re-export shim left behind by a runtime
 * split), is there a current file downstream in the local import graph that
 * plausibly inherited that meaning, and how much of it does that file still
 * carry? Narrower than it sounds -- it claims mechanic-TYPE presence, never
 * a semantic verdict on whether the meaning itself still holds.
 * semanticOverlapProposals surfaces a sixth source, gathered from outside
 * this deterministic pipeline entirely: agent-inferred, human-reviewed
 * semantic-overlap proposals discovered under reviews/ (see
 * discovers-semantic-overlap-proposals.js). Nothing here is computed by this
 * function -- every batch already carries its own lifecycle
 * (INFERRED_NOT_ADMITTED) and review findings; this report only tallies and
 * displays them next to the deterministic findings without ever treating
 * them as governance evidence.
 * Still observational only -- no gap remediation records or projection
 * actions are produced yet.
 */
export async function projectsSelfGovernanceReport({ index, repositoryId, authorityDocuments = [], semanticOverlapProposalBatches = [], featureCoverageProposalBatches = [], featureCoverageInferenceEvaluationBatches = [], knowHowRegistry = { admittedKnowHow: [], authorityRemediationCandidates: [] }, healingDraftBatches = [], authoringContractMap = { disposition: "AUTHORING_CONTRACT_MAP_UNAVAILABLE", engineVersion: null, root: null, entries: [], projectors: [], verifiers: [], inputs: [] }, workspaceRelativePrefix = "" }) {
  const subject = scopesSelfGovernanceSubject({
    index,
    workspaceRelativePrefix,
    authorityDocuments,
    semanticOverlapProposalBatches,
    featureCoverageProposalBatches,
    featureCoverageInferenceEvaluationBatches,
    knowHowRegistry,
    healingDraftBatches,
  });
  const scopedAuthorityDocuments = subject.authorityDocuments;
  const occurrences = resolvesBodyMechanicOccurrences(index, workspaceRelativePrefix);
  const authorityDeclarationDocuments = scopedAuthorityDocuments.filter((entry) => entry.documentKind === authorityDeclarationKind);
  const otherAuthorityDocuments = scopedAuthorityDocuments.filter((entry) => entry.documentKind !== authorityDeclarationKind);
  const declaredAuthorityMechanics = authorityDeclarationDocuments.flatMap(
    ({ document, filePath }) => extractsDeclaredAuthorityMechanics(document, filePath),
  );
  const authorityHomeIndex = buildsAuthorityHomeIndex(scopedAuthorityDocuments);
  const knownModulePaths = subject.knownModulePaths;
  const candidateAuthorityMechanics = scopedAuthorityDocuments.flatMap(
    ({ document, filePath }) => extractsCandidateAuthorityMechanics(document, filePath),
  );

  const byPosture = Object.fromEntries(knownPostures.map((posture) => [posture, 0]));
  const byAutomationDisposition = Object.fromEntries(knownAutomationDispositions.map((disposition) => [disposition, 0]));
  const byMechanicType = new Map();
  const fileBreakdownByKey = new Map();
  const classifiedOccurrences = [];

  for (const occurrence of occurrences) {
    const { posture, governingMechanicId, governingAuthorityFile } = classifiesMechanicOccurrence(occurrence, declaredAuthorityMechanics);
    const isGoverned = posture === "GOVERNED_BY_SEMANTIC_AUTHORITY";
    const authorityFamily = resolvesAuthorityFamily(occurrence.mechanic);
    const home = resolvesAuthorityHomeStatus({ modulePath: occurrence.modulePath, isGoverned }, authorityHomeIndex);
    const candidateMatch = isGoverned ? null : resolvesCandidateAuthorityMatch(occurrence, candidateAuthorityMechanics, knownModulePaths);
    const { automationDisposition, missingTissue } = classifiesAutomationReadiness({ posture, authorityHomeStatus: home.status, candidateMatch });
    byPosture[posture] += 1;
    byAutomationDisposition[automationDisposition] += 1;

    const mechanicSummary = byMechanicType.get(occurrence.mechanic) ?? {
      mechanic: occurrence.mechanic,
      authorityFamily,
      observed: 0,
      governed: 0,
      files: new Set(),
      byHomeStatus: Object.fromEntries(knownHomeStatuses.map((status) => [status, 0])),
    };
    mechanicSummary.observed += 1;
    if (isGoverned) mechanicSummary.governed += 1;
    mechanicSummary.files.add(occurrence.modulePath);
    mechanicSummary.byHomeStatus[home.status] += 1;
    byMechanicType.set(occurrence.mechanic, mechanicSummary);

    const breakdownKey = fileBreakdownKey(occurrence.mechanic, occurrence.modulePath);
    const fileEntry = fileBreakdownByKey.get(breakdownKey) ?? {
      mechanic: occurrence.mechanic,
      modulePath: occurrence.modulePath,
      authorityFamily,
      occurrenceCount: 0,
      governedCount: 0,
      responsibilities: new Set(),
      homeStatus: home.status,
      authorityFile: home.authorityFile,
      authorityHomeVerified: home.authorityHomeVerified,
    };
    fileEntry.occurrenceCount += 1;
    if (isGoverned) fileEntry.governedCount += 1;
    if (occurrence.symbolName) fileEntry.responsibilities.add(occurrence.symbolName);
    fileBreakdownByKey.set(breakdownKey, fileEntry);

    classifiedOccurrences.push({
      mechanic: occurrence.mechanic,
      modulePath: occurrence.modulePath,
      startLine: occurrence.startLine,
      endLine: occurrence.endLine ?? occurrence.startLine,
      symbolName: occurrence.symbolName ?? null,
      posture,
      governingMechanicId,
      governingAuthorityFile,
      authorityFamily,
      authorityHomeStatus: home.status,
      authorityHomeFile: home.authorityFile,
      authorityHomeVerified: home.authorityHomeVerified,
      automationDisposition,
      missingTissue,
      candidateAuthorityFile: candidateMatch?.authorityFile ?? null,
      candidateMechanicId: candidateMatch?.mechanicId ?? null,
      candidateCoverageDisposition: candidateMatch?.coverageDisposition ?? null,
    });
  }

  const fileBreakdown = [...fileBreakdownByKey.values()]
    .map((entry) => Object.freeze({
      ...entry,
      responsibilities: Object.freeze([...entry.responsibilities].sort()),
    }))
    .sort((left, right) => left.mechanic.localeCompare(right.mechanic)
      || right.occurrenceCount - left.occurrenceCount
      || left.modulePath.localeCompare(right.modulePath));

  const filesWithObservedMechanics = new Set(fileBreakdown.map((entry) => entry.modulePath));
  const lineageBodyFiles = new Set();
  for (const { document } of scopedAuthorityDocuments) {
    if (document?.lineage?.authorityType !== "canonical-lineage-authority.v1") continue;
    const artifactsById = new Map((document.artifacts ?? []).map((artifact) => [artifact.artifactId, artifact]));
    for (const responsibility of document.lineage.responsibilities ?? []) {
      const bodyFile = artifactsById.get(responsibility.artifactId)?.relativePath?.replaceAll("\\", "/");
      if (knownModulePaths.has(bodyFile)) lineageBodyFiles.add(bodyFile);
    }
  }
  const dataDrivenWiring = resolvesDataDrivenWiring(
    index,
    workspaceRelativePrefix,
    new Set([...filesWithObservedMechanics, ...lineageBodyFiles]),
  );

  const contractSemanticVolume = measuresContractSemanticVolume(scopedAuthorityDocuments, knownModulePaths);
  const authoritySuccession = resolvesAuthoritySuccession({ authorityDocuments: scopedAuthorityDocuments, occurrences, index, workspaceRelativePrefix, knownModulePaths });
  const semanticOverlapProposals = subject.semanticOverlapProposalBatches.map((batch) => summarizesSemanticOverlapProposalBatch(batch));
  const knowHowRegistrySummary = summarizesKnowHowRegistry(subject.knowHowRegistry);
  const healingDraftRegistry = summarizesHealingDraftRegistry(subject.healingDraftBatches);
  const projectedScenarioConformance = projectsScenarioConformance({
    authorityDocuments: scopedAuthorityDocuments,
    knownModulePaths,
    occurrences,
    wiring: dataDrivenWiring,
    authoritySuccession,
    workspaceRelativePrefix: subject.workspaceRelativePrefix,
  });
  const classifiedOccurrencesWithLineage = classifiedOccurrences.map((occurrence) => Object.freeze({
    ...occurrence,
    ...resolvesOccurrenceScenarioLineage(occurrence.modulePath, projectedScenarioConformance.bodyScenarioIndex),
  }));
  const lineageDispositionCounts = {};
  for (const occurrence of classifiedOccurrencesWithLineage) {
    lineageDispositionCounts[occurrence.lineageDisposition] = (lineageDispositionCounts[occurrence.lineageDisposition] ?? 0) + 1;
  }
  const scenarioConformance = Object.freeze({
    summary: projectedScenarioConformance.summary,
    features: projectedScenarioConformance.features,
    lineageAuthorityFiles: projectedScenarioConformance.lineageAuthorityFiles,
  });
  const featureCoverageProjection = projectsFeatureCoverage({
    authorityDocuments: scopedAuthorityDocuments,
    proposalBatches: subject.featureCoverageProposalBatches,
    evaluationBatches: subject.featureCoverageInferenceEvaluationBatches,
    occurrences: classifiedOccurrencesWithLineage,
    scenarioConformance,
    knowHowRegistry: knowHowRegistrySummary,
    healingDraftRegistry,
  });
  const featureCoverage = Object.freeze({
    summary: featureCoverageProjection.summary,
    proposals: featureCoverageProjection.proposals,
    liveInferenceEvaluations: featureCoverageProjection.liveInferenceEvaluations,
    uncoveredClusters: featureCoverageProjection.uncoveredClusters,
    entityCoverage: featureCoverageProjection.entityCoverage,
  });
  const cliAuthorityFiles = scopedAuthorityDocuments.filter((entry) => (
    resolvesClaimedFiles(entry.documentKind, entry.document).includes("src/cli.js")
  )).map((entry) => entry.filePath).sort();
  const interfaceGovernance = await projectsInterfaceGovernance({
    index,
    scenarioConformance,
    workspaceRelativePrefix: subject.workspaceRelativePrefix,
    cliAuthorityFiles,
  });
  const lineageAuthorityFileSet = new Set(projectedScenarioConformance.lineageAuthorityFiles);
  const unclassifiedAuthorityDocuments = scopedAuthorityDocuments
    .filter((entry) => !lineageAuthorityFileSet.has(entry.filePath))
    .map((entry) => Object.freeze({ authorityFile: entry.filePath, documentKind: entry.documentKind }));
  const knowHowWithoutScenarioLineage = (subject.knowHowRegistry.admittedKnowHow ?? []).filter((entry) => {
    const lineage = entry.document?.lineage;
    return !(lineage?.featureId && lineage?.scenarioId && lineage?.obligationId);
  }).length;
  const healingDraftsWithoutScenarioTarget = subject.healingDraftBatches.filter((entry) => {
    const scenarioTarget = entry.document?.subject?.scenarioTarget;
    return !(scenarioTarget?.featureId && scenarioTarget?.scenarioId
      && scenarioTarget?.responsibilityId && scenarioTarget?.obligationId);
  }).length;

  const reportView = {
    reportType: "source-facts-self-governance-report.v1",
    generatedAtUtc: new Date().toISOString(),
    repository: Object.freeze({
      repositoryId,
      workspaceId: index.workspace?.workspaceId ?? null,
      workspaceRoot: index.manifest?.scanRequest?.workspaceRoot ?? null,
    }),
    index: Object.freeze({
      indexId: index.indexId ?? null,
      scanId: index.manifest?.scanId ?? null,
    }),
    subjectScope: Object.freeze({
      workspaceRelativePrefix: subject.workspaceRelativePrefix,
      scopeMode: subject.scopeMode,
      ...subject.summary,
    }),
    subjectBoundaryItems: subject.scopeItems,
    authoringContractMap: Object.freeze(authoringContractMap),
    interfaceGovernance,
    scenarioConformance,
    featureCoverage,
    unclassifiedInventory: Object.freeze({
      mechanicsByLineageDisposition: Object.freeze(lineageDispositionCounts),
      mechanicsByFeatureCoveragePosture: featureCoverage.summary.byPosture,
      unclassifiedAuthorityDocumentCount: unclassifiedAuthorityDocuments.length,
      unclassifiedAuthorityDocuments: Object.freeze(unclassifiedAuthorityDocuments),
      knowHowWithoutScenarioLineage,
      healingDraftsWithoutScenarioTarget,
    }),
    authoritySources: Object.freeze(
      authorityDeclarationDocuments.map(({ document, filePath }) => Object.freeze({
        authorityFile: filePath,
        sourceFile: document.sourceFile ?? null,
        mechanicsDeclared: (document.authority?.mechanics ?? document.mechanics ?? []).length,
        mechanicsAuthorityBound: extractsDeclaredAuthorityMechanics(document, filePath).length,
      })),
    ),
    otherAuthorityDocuments: Object.freeze(
      otherAuthorityDocuments.map(({ document, filePath, documentKind }) => Object.freeze({
        authorityFile: filePath,
        documentKind,
        claimedFiles: Object.freeze(resolvesClaimedFiles(documentKind, document)),
      })),
    ),
    executionMechanics: Object.freeze({
      observed: occurrences.length,
      governed: byPosture.GOVERNED_BY_SEMANTIC_AUTHORITY,
      byPosture: Object.freeze(byPosture),
      byMechanicType: Object.freeze(
        [...byMechanicType.values()]
          .map((entry) => Object.freeze({ ...entry, files: entry.files.size, byHomeStatus: Object.freeze(entry.byHomeStatus) }))
          .sort((left, right) => right.observed - left.observed || left.mechanic.localeCompare(right.mechanic)),
      ),
    }),
    fileBreakdown: Object.freeze(fileBreakdown),
    dataDrivenWiring: Object.freeze(dataDrivenWiring),
    contractSemanticVolume: Object.freeze(contractSemanticVolume),
    authoritySuccession: Object.freeze(authoritySuccession),
    semanticOverlapProposals: Object.freeze(semanticOverlapProposals),
    knowHowRegistry: knowHowRegistrySummary,
    healingDraftRegistry,
    automationReadiness: Object.freeze({ byDisposition: Object.freeze(byAutomationDisposition) }),
    occurrences: featureCoverageProjection.occurrences,
    disposition: "OBSERVATIONAL_NO_GATE_APPLIED",
  };
  const report = Object.freeze({
    ...reportView,
    queryLineage: projectsReportQueryLineage(reportView, index),
  });
  reconcilesReportQueryLineage(report);
  return report;
}
