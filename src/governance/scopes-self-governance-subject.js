import { resolvesClaimedFiles } from "./resolves-authority-document-claims.js";

function normalizesPath(value) {
  if (typeof value !== "string") return null;
  const withoutLocation = value.replace(/:\d+(?:-\d+)?$/, "");
  const normalized = withoutLocation.replaceAll("\\", "/").replace(/^\.\//, "");
  return normalized.length > 0 ? normalized : null;
}

function collectsKnownModulePaths(index, workspaceRelativePrefix) {
  const paths = new Set();
  const add = (value) => {
    const normalized = normalizesPath(value);
    if (normalized === null) return;
    const prefixed = workspaceRelativePrefix.length > 0
      && normalized !== workspaceRelativePrefix
      && !normalized.startsWith(`${workspaceRelativePrefix}/`)
      ? `${workspaceRelativePrefix}/${normalized}`
      : normalized;
    paths.add(prefixed);
  };

  for (const file of index.files ?? []) add(file.relativePath);
  for (const reference of index.sourceReferences ?? []) add(reference.modulePath);
  for (const symbol of index.symbols ?? []) add(symbol.modulePath);
  for (const relationship of index.relationships ?? []) add(relationship.modulePath);
  for (const mechanic of index.bodyMechanics ?? []) add(mechanic.modulePath);
  return paths;
}

function pathBelongsToSubject(value, workspaceRelativePrefix, knownModulePaths) {
  if (workspaceRelativePrefix.length === 0) return true;
  const candidate = normalizesPath(value);
  if (candidate === null) return false;
  if (candidate === workspaceRelativePrefix || candidate.startsWith(`${workspaceRelativePrefix}/`)) return true;
  if (knownModulePaths.has(candidate)) return true;

  const suffix = `/${candidate}`;
  let matches = 0;
  for (const modulePath of knownModulePaths) {
    if (modulePath.endsWith(suffix)) matches += 1;
    if (matches > 1) return false;
  }
  return matches === 1;
}

function authorityTargetPaths(entry) {
  const claimed = resolvesClaimedFiles(entry.documentKind, entry.document);
  const lineageArtifacts = Array.isArray(entry.document?.artifacts)
    ? entry.document.artifacts.map((artifact) => artifact?.relativePath)
    : [];
  return [...new Set([...claimed, ...lineageArtifacts].map(normalizesPath).filter(Boolean))];
}

function scopeAuthorityDocuments(authorityDocuments, workspaceRelativePrefix, knownModulePaths) {
  if (workspaceRelativePrefix.length === 0) {
    return { inScope: authorityDocuments, excluded: [] };
  }

  const inScope = [];
  const excluded = [];
  for (const entry of authorityDocuments) {
    const targets = authorityTargetPaths(entry);
    const documentLivesInSubject = pathBelongsToSubject(entry.filePath, workspaceRelativePrefix, knownModulePaths);
    const claimsSubject = targets.some((target) => pathBelongsToSubject(target, workspaceRelativePrefix, knownModulePaths));
    if (documentLivesInSubject || claimsSubject) {
      inScope.push(entry);
    } else {
      excluded.push(entry);
    }
  }
  return { inScope, excluded };
}

function proposalBelongsToSubject(batch, inScopeAuthorityFiles, workspaceRelativePrefix, knownModulePaths) {
  if (workspaceRelativePrefix.length === 0) return true;
  const subject = batch.document?.subject ?? {};
  if (inScopeAuthorityFiles.has(normalizesPath(subject.historicalAuthorityFile))) return true;
  return [subject.historicalDeclaredSourceFile, subject.resolvedSuccessorFile]
    .some((candidate) => pathBelongsToSubject(candidate, workspaceRelativePrefix, knownModulePaths));
}

function healingBelongsToSubject(batch, workspaceRelativePrefix, knownModulePaths) {
  if (workspaceRelativePrefix.length === 0) return true;
  const draft = batch.document?.draft ?? {};
  const candidates = [
    ...(Array.isArray(draft.evidenceReferences) ? draft.evidenceReferences : []),
    draft.runtimeWiringDraft?.targetFile,
    draft.collapsedBodyDraft?.targetFile,
    draft.bindingDraft?.bodyRef,
  ];
  return candidates.some((candidate) => pathBelongsToSubject(candidate, workspaceRelativePrefix, knownModulePaths));
}

/**
 * Establishes one report subject before any coverage or semantic-volume
 * calculation. Repository-level discovery is deliberately broad; judgment is
 * not. A workspace-bounded report may use only documents and review evidence
 * that live inside, or explicitly claim a target inside, the scanned subject.
 */
export function scopesSelfGovernanceSubject({
  index,
  workspaceRelativePrefix = "",
  authorityDocuments = [],
  semanticOverlapProposalBatches = [],
  featureCoverageProposalBatches = [],
  featureCoverageInferenceEvaluationBatches = [],
  knowHowRegistry = { admittedKnowHow: [], authorityRemediationCandidates: [] },
  healingDraftBatches = [],
}) {
  const prefix = normalizesPath(workspaceRelativePrefix) ?? "";
  const knownModulePaths = collectsKnownModulePaths(index, prefix);
  const authorityScope = scopeAuthorityDocuments(authorityDocuments, prefix, knownModulePaths);
  const inScopeAuthorityFiles = new Set(authorityScope.inScope.map((entry) => normalizesPath(entry.filePath)));

  const inScopeProposals = semanticOverlapProposalBatches.filter(
    (batch) => proposalBelongsToSubject(batch, inScopeAuthorityFiles, prefix, knownModulePaths),
  );
  const inScopeProposalFiles = new Set(inScopeProposals.map((batch) => normalizesPath(batch.filePath)));
  const inScopeFeatureCoverageProposals = featureCoverageProposalBatches.filter((batch) => {
    if (prefix.length === 0) return true;
    return (batch.document?.evidence?.sourceFiles ?? [])
      .some((candidate) => pathBelongsToSubject(candidate, prefix, knownModulePaths));
  });
  const inScopeFeatureCoverageInferenceEvaluations = featureCoverageInferenceEvaluationBatches.filter((batch) => {
    if (prefix.length === 0) return true;
    return (batch.document?.candidate?.evidence?.sourceFiles ?? [])
      .some((candidate) => pathBelongsToSubject(candidate, prefix, knownModulePaths));
  });

  const admittedKnowHow = (knowHowRegistry.admittedKnowHow ?? []).filter((entry) => {
    if (prefix.length === 0) return true;
    return inScopeProposalFiles.has(normalizesPath(entry.document?.evidence?.inferenceBatch));
  });
  const inScopeKnowHowIds = new Set(admittedKnowHow.map((entry) => entry.document?.knowHowId).filter(Boolean));
  const authorityRemediationCandidates = (knowHowRegistry.authorityRemediationCandidates ?? []).filter((entry) => {
    if (prefix.length === 0) return true;
    return (entry.document?.citesKnowHow ?? []).some((knowHowId) => inScopeKnowHowIds.has(knowHowId));
  });
  const inScopeHealing = healingDraftBatches.filter(
    (batch) => healingBelongsToSubject(batch, prefix, knownModulePaths),
  );

  return Object.freeze({
    workspaceRelativePrefix: prefix,
    scopeMode: prefix.length === 0 ? "REPOSITORY_WIDE" : "WORKSPACE_BOUNDED",
    knownModulePaths,
    authorityDocuments: Object.freeze(authorityScope.inScope),
    semanticOverlapProposalBatches: Object.freeze(inScopeProposals),
    featureCoverageProposalBatches: Object.freeze(inScopeFeatureCoverageProposals),
    featureCoverageInferenceEvaluationBatches: Object.freeze(inScopeFeatureCoverageInferenceEvaluations),
    knowHowRegistry: Object.freeze({
      admittedKnowHow: Object.freeze(admittedKnowHow),
      authorityRemediationCandidates: Object.freeze(authorityRemediationCandidates),
    }),
    healingDraftBatches: Object.freeze(inScopeHealing),
    summary: Object.freeze({
      authorityDocumentsDiscovered: authorityDocuments.length,
      authorityDocumentsInScope: authorityScope.inScope.length,
      authorityDocumentsExcluded: authorityScope.excluded.length,
      proposalBatchesDiscovered: semanticOverlapProposalBatches.length,
      proposalBatchesInScope: inScopeProposals.length,
      proposalBatchesExcluded: semanticOverlapProposalBatches.length - inScopeProposals.length,
      featureCoverageProposalsDiscovered: featureCoverageProposalBatches.length,
      featureCoverageProposalsInScope: inScopeFeatureCoverageProposals.length,
      featureCoverageProposalsExcluded: featureCoverageProposalBatches.length - inScopeFeatureCoverageProposals.length,
      featureCoverageInferenceEvaluationsDiscovered: featureCoverageInferenceEvaluationBatches.length,
      featureCoverageInferenceEvaluationsInScope: inScopeFeatureCoverageInferenceEvaluations.length,
      featureCoverageInferenceEvaluationsExcluded: featureCoverageInferenceEvaluationBatches.length - inScopeFeatureCoverageInferenceEvaluations.length,
      knowHowRecordsDiscovered: (knowHowRegistry.admittedKnowHow ?? []).length,
      knowHowRecordsInScope: admittedKnowHow.length,
      knowHowRecordsExcluded: (knowHowRegistry.admittedKnowHow ?? []).length - admittedKnowHow.length,
      healingDraftsDiscovered: healingDraftBatches.length,
      healingDraftsInScope: inScopeHealing.length,
      healingDraftsExcluded: healingDraftBatches.length - inScopeHealing.length,
    }),
  });
}

export { pathBelongsToSubject };
