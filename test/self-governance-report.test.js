import assert from "node:assert/strict";
import { test } from "node:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics } from "../src/governance/classifies-execution-mechanics.js";
import { detectsAuthorityDocumentKind, authorityDeclarationKind } from "../src/governance/detects-authority-document-kind.js";
import { resolvesAuthorityFamily } from "../src/governance/mechanic-authority-families.js";
import { resolvesDataDrivenWiring } from "../src/governance/resolves-data-driven-wiring.js";
import { resolvesMechanicLocationReachability, measuresContractSemanticVolume } from "../src/governance/measures-contract-semantic-volume.js";
import { extractsCandidateAuthorityMechanics, resolvesCandidateAuthorityMatch, classifiesAutomationReadiness } from "../src/governance/classifies-automation-readiness.js";
import { resolvesAuthoritySuccession } from "../src/governance/resolves-authority-succession.js";
import { discoversSemanticOverlapProposalBatches } from "../src/governance/discovers-semantic-overlap-proposals.js";
import { summarizesSemanticOverlapProposalBatch } from "../src/governance/summarizes-semantic-overlap-proposals.js";
import { summarizesInferenceQuality } from "../src/governance/summarizes-inference-quality.js";
import { extractsReviewedKnowHow } from "../src/governance/extracts-reviewed-know-how.js";
import { admitsKnowHow } from "../src/governance/admits-know-how.js";
import { projectsAuthorityRemediationCandidate } from "../src/governance/projects-authority-remediation-candidate.js";
import { discoversKnowHowRegistry } from "../src/governance/discovers-know-how-registry.js";
import { summarizesKnowHowRegistry } from "../src/governance/summarizes-know-how-registry.js";
import { invokesLiveModelInference, ModelInvocationError } from "../src/governance/invokes-live-model-inference.js";
import { proposesSemanticOverlap } from "../src/governance/proposes-semantic-overlap.js";
import { projectsSelfGovernanceReport } from "../src/governance/projects-self-governance-report.js";
import { validatesSelfGovernanceReport } from "../src/governance/validates-self-governance-report.js";
import { formatsSelfGovernanceReportMarkdown } from "../src/governance/formats-self-governance-report-summary.js";
import { FactQueryLineageError, projectsBoundReportQueryReceiptArtifact, projectsReportQueryReceiptArtifacts, rerunsRegisteredReportQuery } from "../src/governance/projects-report-query-lineage.js";
import { discoversFeatureCoverageInferenceEvaluations, discoversFeatureCoverageProposals } from "../src/governance/discovers-feature-coverage-proposals.js";
import { createsProposalFeatureFingerprint, validatesFeatureCoverageProposal } from "../src/governance/projects-feature-coverage.js";
import { proposesFeatureCoverage, wrapsFeatureCoverageInferenceEvaluation } from "../src/governance/proposes-feature-coverage.js";
import { discoversAuthorityAuthoringContractMap } from "../src/governance/discovers-authority-authoring-contract-map.js";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { projectsInterfaceGovernance } from "../src/governance/projects-interface-governance.js";
import { discoversCanonicalFeatureIntents } from "../src/governance/canonical-feature-intent.js";
import { fileURLToPath } from "node:url";

function buildsAuthorityDocument() {
  return {
    schemaVersion: "authority-declaration.v1",
    sourceFile: "src/example.js",
    authority: {
      mechanics: [
        {
          mechanicId: "resolve-example-decision",
          mechanic: "branch",
          sourceLocation: "src/example.js:10-12",
          coverage: "AUTHORITY_BOUND",
        },
        {
          mechanicId: "draft-only-mechanic",
          mechanic: "fallback",
          sourceLocation: "src/example.js:30",
          coverage: "AUTHORITY_CANDIDATE_PROJECTED",
        },
      ],
    },
  };
}

function buildsAuthorityDocumentEntry(filePath, document = buildsAuthorityDocument()) {
  return { filePath, document, documentKind: detectsAuthorityDocumentKind(document) };
}

test("extractsDeclaredAuthorityMechanics only admits AUTHORITY_BOUND mechanics with a resolvable location", () => {
  const declared = extractsDeclaredAuthorityMechanics(buildsAuthorityDocument(), "contracts/example.authority.json");
  assert.equal(declared.length, 1);
  assert.equal(declared[0].mechanicId, "resolve-example-decision");
  assert.deepEqual(declared[0].location, { modulePath: "src/example.js", startLine: 10, endLine: 12 });
});

test("extractsDeclaredAuthorityMechanics ignores documents with a different or missing schemaVersion", () => {
  assert.deepEqual(extractsDeclaredAuthorityMechanics({ schemaVersion: "authority-declaration.draft.v1" }, "x.json"), []);
  assert.deepEqual(extractsDeclaredAuthorityMechanics(null, "x.json"), []);
});

test("classifiesMechanicOccurrence marks an overlapping same-mechanic occurrence as governed", () => {
  const declared = extractsDeclaredAuthorityMechanics(buildsAuthorityDocument(), "contracts/example.authority.json");

  const governed = classifiesMechanicOccurrence({ mechanic: "branch", modulePath: "src/example.js", startLine: 11, endLine: 11 }, declared);
  assert.equal(governed.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
  assert.equal(governed.governingMechanicId, "resolve-example-decision");
  assert.equal(governed.governingAuthorityFile, "contracts/example.authority.json");

  const wrongMechanic = classifiesMechanicOccurrence({ mechanic: "throw", modulePath: "src/example.js", startLine: 11, endLine: 11 }, declared);
  assert.equal(wrongMechanic.posture, "UNKNOWN_CLASSIFICATION");

  const outsideLocation = classifiesMechanicOccurrence({ mechanic: "branch", modulePath: "src/example.js", startLine: 50, endLine: 50 }, declared);
  assert.equal(outsideLocation.posture, "UNKNOWN_CLASSIFICATION");
});

test("detectsAuthorityDocumentKind recognizes schemas beyond authority-declaration.v1", () => {
  assert.equal(detectsAuthorityDocumentKind(buildsAuthorityDocument()), authorityDeclarationKind);
  assert.equal(detectsAuthorityDocumentKind({ authorityType: "semantic-projection-authority.v1" }), "semantic-projection-authority.v1");
  assert.equal(detectsAuthorityDocumentKind({ bundleType: "semantic-execution-bundle.v1" }), "semantic-execution-bundle.v1");
  assert.equal(detectsAuthorityDocumentKind({ ledgerType: "governed-artifact-projection-ledger.v1" }), "governed-artifact-projection-ledger.v1");
  assert.equal(detectsAuthorityDocumentKind({ contract: { contractId: "x.v1" } }), "governed-artifact-contract");
  assert.equal(detectsAuthorityDocumentKind({ someUnrelatedField: true }), null);
  assert.equal(detectsAuthorityDocumentKind(null), null);
});

test("resolvesAuthorityFamily maps known mechanics and falls back for unknown ones", () => {
  assert.equal(resolvesAuthorityFamily("branch"), "decision");
  assert.equal(resolvesAuthorityFamily("object-construction"), "projection-mapping");
  assert.equal(resolvesAuthorityFamily("state-mutation"), "state-transition");
  assert.equal(resolvesAuthorityFamily("not-a-real-mechanic"), "unclassified");
});

test("CLI-first closure inventories every command, classifies every callable, and isolates the unreachable remainder", async () => {
  const workspaceRoot = path.resolve(process.cwd(), "src");
  const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "cli-closure-test", languageId: "typescript" });
  const projection = await projectsInterfaceGovernance({
    index,
    scenarioConformance: { features: [] },
    workspaceRelativePrefix: "src",
    cliAuthorityFiles: [],
  });
  const commandNames = projection.commands.map((row) => row.commandName);
  assert.ok(commandNames.includes("govern"));
  assert.ok(commandNames.includes("propose-feature-coverage"));
  assert.ok(commandNames.includes("project-governed-console-contract"));
  assert.equal(projection.summary.observedCliCommandHandlers, 16);
  assert.equal(projection.summary.observedCliCommandTokens, 17);
  assert.equal(projection.summary.distinctCliExecutionSlices, 16);
  assert.equal(projection.summary.aliasedCliCommandTokens, 2);
  assert.equal(projection.commands.find((row) => row.commandName === "project-console-contract").executionSliceDisposition, "MULTIPLE_INTERFACE_ALIASES_ONE_EXECUTION_SLICE");
  assert.equal(projection.summary.admittedCliCommands, 0);
  assert.equal(projection.callableInventory.length, projection.summary.runtimeCallables);
  assert.ok(projection.callableInventory.every((row) => [
    "CLI_FEATURE_ROOT", "CLI_FEATURE_REACHABLE", "SHARED_CLI_INFRASTRUCTURE",
    "RUNTIME_RESOLUTION_REQUIRED", "TEST_OR_PROOF_ONLY", "GENERATED_ARTIFACT", "NO_CLI_REACHABILITY",
  ].includes(row.cliClosureClassification)));
  assert.ok(projection.unreachableCallables.every((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY"));
  assert.ok(projection.unreachableSourceFacts.every((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY"));
  assert.ok(projection.removalImpact.every((row) => ["REMOVE_CANDIDATE", "REVIEW_BEFORE_REMOVAL"].includes(row.removalDisposition)));

  const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
  const canonicalFeatureIntents = await discoversCanonicalFeatureIntents(path.join(repositoryRoot, "features"), { relativeTo: repositoryRoot });
  const testIndex = await projectSourceFactsWorkspace({ workspaceRoot: path.join(repositoryRoot, "test"), workspaceId: "test-traceability-test", languageId: "typescript" });
  const report = await projectsSelfGovernanceReport({
    index,
    testIndex,
    repositoryId: "cli-execution-graph-test",
    workspaceRelativePrefix: "src",
    canonicalFeatureIntents,
  });
  const governGraph = rerunsRegisteredReportQuery(report, "cli.command-execution-graphs.v1", { commandName: "govern" });
  assert.equal(governGraph.rowCount, 1);
  assert.equal(governGraph.rows[0].handlerName, "runGovern");
  assert.ok(governGraph.rows[0].nodes.length > 1);
  assert.ok(governGraph.rows[0].nodes.every((node) => node.pathWitness[0].symbolName === "runGovern"));
  assert.equal(governGraph.rows[0].edges.length, governGraph.rows[0].summary.invocationEdgeCount);
  assert.ok(governGraph.rows[0].unresolvedOrAmbiguousEdges.every((edge) => edge.resolutionDisposition !== "resolved"));
  assert.ok(governGraph.rows[0].edges.every((edge) => typeof edge.semanticBoundaryDisposition === "string"));
  assert.ok(governGraph.rows[0].summary.actionableInternalClosureDebt < governGraph.rows[0].summary.unresolvedInvocationEdgeCount);

  const packets = rerunsRegisteredReportQuery(report, "cli.feature-intent-proposal-packets.v1", {});
  assert.equal(packets.rowCount, 16);
  assert.deepEqual(packets.rows.find((row) => row.handler === "runProjectConsoleContract").commandAliases, ["project-console-contract", "project-governed-console-contract"]);
  const callGraphPacket = packets.rows.find((row) => row.commandId === "call-graph");
  assert.equal(callGraphPacket.proposalDisposition, "FEATURE_INTENT_EXECUTION_GRAPH_BOUND");
  assert.deepEqual(callGraphPacket.existingFeatureMatches, ["source-facts.cli-call-graph"]);
  assert.ok(callGraphPacket.resolvedInternalEdges.length > 0);
  assert.ok(callGraphPacket.platformBoundaries.length > 0);

  const responsibilityTrace = rerunsRegisteredReportQuery(report, "trace.responsibility-to-command-graph.v1", { responsibilityId: "cli-call-graph-projection" });
  assert.equal(responsibilityTrace.rowCount, 1);
  assert.equal(responsibilityTrace.rows[0].bindingDisposition, "RESPONSIBILITY_EXECUTION_GRAPH_BOUND");
  assert.deepEqual(responsibilityTrace.rows[0].boundImplementationSymbols, ["projectsCliEntryPointCallGraph", "runCallGraph"]);

  const testInventory = rerunsRegisteredReportQuery(report, "test.inventory.v1", {});
  assert.ok(testInventory.rowCount > 100);
  assert.ok(testInventory.rows.every((row) => row.testId.startsWith("sha256:") && row.modulePath.startsWith("test/") && row.startLine > 0));
  const callGraphProofs = rerunsRegisteredReportQuery(report, "test.scenario-lineage.v1", { scenarioId: "source-facts.cli-call-graph.from-entry-point" });
  assert.equal(callGraphProofs.rowCount, 1);
  assert.equal(callGraphProofs.rows[0].testFile, "test/call-graph.test.js");
  assert.equal(callGraphProofs.rows[0].lineageStatus, "PROPOSED_SCENARIO_LINEAGE");
  const unreachableTestDependencies = rerunsRegisteredReportQuery(report, "test.unreachable-production-dependencies.v1", {});
  assert.ok(unreachableTestDependencies.rows.every((row) => row.depth === 0 && row.cliClosureClassification === "NO_CLI_REACHABILITY"));
  const completeLineage = rerunsRegisteredReportQuery(report, "trace.feature-complete-lineage.v1", { featureId: "source-facts.cli-call-graph" });
  assert.equal(completeLineage.rowCount, 1);
  assert.equal(completeLineage.rows[0].gherkin.featureId, "source-facts.cli-call-graph");
  assert.equal(completeLineage.rows[0].executionGraph.nodes.length, 41);
  assert.equal(completeLineage.rows[0].scenarios.length, 1);
  assert.equal(completeLineage.rows[0].scenarios[0].tests.length, 1);
  assert.equal(completeLineage.rows[0].scenarios[0].proofCoverage.proofCount, 0);
  assert.equal(completeLineage.rows[0].lineageDisposition, "FEATURE_LINEAGE_BOUND_RUNTIME_PROOF_MISSING");

  const boundReceiptArtifact = projectsBoundReportQueryReceiptArtifact(report, "trace.feature-complete-lineage.v1", { featureId: "source-facts.cli-call-graph" });
  assert.equal(boundReceiptArtifact.artifactDisposition, "PARAMETER_BOUND_REGISTERED_QUERY_EXECUTION");
  assert.deepEqual(boundReceiptArtifact.queryReceipt.parameterBindings, { featureId: "source-facts.cli-call-graph" });
  assert.equal(boundReceiptArtifact.queryReceipt.execution.rowCount, 1);
  assert.equal(boundReceiptArtifact.queryReceipt.execution.resultHash, completeLineage.resultHash);
  assert.deepEqual(boundReceiptArtifact.queryReceipt.result.rows, completeLineage.rows);
});

function buildsSyntheticIndex({ modulePathPrefix = "src/" } = {}) {
  const path = (name) => `${modulePathPrefix}${name}`;
  const sourceReferences = [
    { referenceId: "ref-1", modulePath: path("example.js"), startLine: 11, endLine: 11, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-2", modulePath: path("example.js"), startLine: 40, endLine: 40, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-3", modulePath: path("other.js"), startLine: 5, endLine: 5, startColumn: 1, endColumn: 1 },
  ];
  const symbols = [
    { symbolId: "sym-1", name: "resolvesExample", modulePath: path("example.js") },
  ];
  const bodyMechanics = [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: path("example.js"), sourceReferenceId: "ref-1", fromSymbolId: "sym-1" },
    { mechanicId: "bm-2", mechanic: "fallback", modulePath: path("example.js"), sourceReferenceId: "ref-2", fromSymbolId: null },
    { mechanicId: "bm-3", mechanic: "throw", modulePath: path("other.js"), sourceReferenceId: "ref-3", fromSymbolId: null },
  ];
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "self-governance-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "self-governance-test" },
    symbols,
    relationships: [],
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
}

test("projectsSelfGovernanceReport classifies observed mechanics against admitted authority evidence", async () => {
  const index = buildsSyntheticIndex();
  const authorityDocuments = [buildsAuthorityDocumentEntry("contracts/example.authority.json")];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.executionMechanics.observed, 3);
  assert.equal(report.executionMechanics.governed, 1);
  assert.equal(report.executionMechanics.byPosture.GOVERNED_BY_SEMANTIC_AUTHORITY, 1);
  assert.equal(report.executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, 2);

  const branchSummary = report.executionMechanics.byMechanicType.find((entry) => entry.mechanic === "branch");
  assert.equal(branchSummary.authorityFamily, "decision");
  assert.equal(branchSummary.observed, 1);
  assert.equal(branchSummary.governed, 1);
  assert.equal(branchSummary.files, 1);
  assert.equal(branchSummary.byHomeStatus.AUTHORITY_HOME_EXISTS, 1);

  const governedOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
  assert.equal(governedOccurrence.governingMechanicId, "resolve-example-decision");
  assert.equal(governedOccurrence.authorityFamily, "decision");
  assert.equal(governedOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS");
  assert.equal(governedOccurrence.authorityHomeFile, "contracts/example.authority.json");

  // Same file as the governed branch, same authority document claims it, but this
  // specific occurrence isn't AUTHORITY_BOUND -- a home exists but doesn't cover it.
  const fallbackOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "fallback");
  assert.equal(fallbackOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE");

  // Different file, no authority document claims it at all.
  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_MISSING");
  assert.equal(throwOccurrence.authorityHomeFile, null);

  const fileBreakdownForExample = report.fileBreakdown.find((entry) => entry.mechanic === "branch" && entry.modulePath === "src/example.js");
  assert.equal(fileBreakdownForExample.occurrenceCount, 1);
  assert.equal(fileBreakdownForExample.governedCount, 1);
  assert.deepEqual(fileBreakdownForExample.responsibilities, ["resolvesExample"]);
  assert.equal(fileBreakdownForExample.homeStatus, "AUTHORITY_HOME_EXISTS");

  assert.equal(report.authoritySources.length, 1);
  assert.equal(report.authoritySources[0].mechanicsDeclared, 2);
  assert.equal(report.authoritySources[0].mechanicsAuthorityBound, 1);
  assert.equal(report.disposition, "OBSERVATIONAL_NO_GATE_APPLIED");
});

test("projectsSelfGovernanceReport reports everything as unknown when no authority evidence is supplied", async () => {
  const index = buildsSyntheticIndex();
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [] });
  assert.equal(report.executionMechanics.governed, 0);
  assert.equal(report.executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, 3);
  assert.equal(report.authoritySources.length, 0);
  assert.ok(report.fileBreakdown.every((entry) => entry.homeStatus === "AUTHORITY_HOME_MISSING"));
});

test("projectsSelfGovernanceReport binds rendered facts to inspectable registered-query receipts", async () => {
  const report = await projectsSelfGovernanceReport({
    index: buildsSyntheticIndex(),
    repositoryId: "self-governance-test",
    authorityDocuments: [buildsAuthorityDocumentEntry("contracts/example.authority.json")],
  });

  assert.equal(report.queryLineage.invariant, "EVERY_RENDERED_FACT_HAS_INSPECTABLE_QUERY_RESULT");
  assert.equal(report.queryLineage.drillDownInvariant, "EVERY_RENDERED_FACT_HAS_PROVING_QUERY_AND_INSPECTABLE_DRILL_DOWN_PATH");
  assert.equal(report.queryLineage.catalog.catalogId, "self-governance-query-catalog.v1");
  assert.match(report.queryLineage.catalog.catalogHash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(report.queryLineage.reconciliation.disposition, "PASSED");
  assert.equal(report.queryLineage.reconciliation.missingQueryPointers, 0);
  assert.equal(report.queryLineage.reconciliation.claimsLackingDrillDownPath, 0);
  assert.equal(report.queryLineage.reconciliation.brokenDrillDownQueryReferences, 0);
  assert.equal(report.queryLineage.reconciliation.invalidDrillDownParameterBindings, 0);
  assert.ok(report.queryLineage.claims.every((claim) => claim.drillDowns.length > 0));
  assert.ok(report.queryLineage.claims.length > 0);
  const receipt = report.queryLineage.queryReceipts.find((entry) => entry.queryId === "feature-coverage.summary.v1");
  assert.equal(receipt.index.indexId, report.index.indexId);
  assert.equal(receipt.index.scanId, report.index.scanId);
  assert.equal(receipt.execution.rowCount, 1);
  assert.match(receipt.queryHash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(receipt.result.rows[0].mechanicsWithoutLineage, report.featureCoverage.summary.mechanicsWithoutLineage);

  const rerun = rerunsRegisteredReportQuery(report, "feature-coverage.summary.v1");
  assert.equal(rerun.resultHash, receipt.execution.resultHash);
  assert.deepEqual(rerun.rows, receipt.result.rows);

  const branchFiles = rerunsRegisteredReportQuery(
    report,
    "feature-coverage.unlined-mechanics-by-file.v1",
    { mechanic: "fallback" },
  );
  assert.ok(branchFiles.rows.length > 0);
  assert.ok(branchFiles.rows.every((row) => row.mechanic === "fallback"));
  assert.ok(branchFiles.rows.every((row) => row.drillDowns.some((drillDown) => drillDown.queryId === "feature-coverage.unlined-occurrences.v1")));
  assert.throws(
    () => rerunsRegisteredReportQuery(report, "feature-coverage.unlined-mechanics-by-file.v1", { unsupported: "value" }),
    (error) => error instanceof FactQueryLineageError && error.disposition === "FACT_DRILLDOWN_PARAMETER_INVALID",
  );

  const artifact = projectsReportQueryReceiptArtifacts(report)
    .find((entry) => entry.document.queryReceipt.queryId === "feature-coverage.summary.v1");
  assert.equal(artifact.fileName, "feature-coverage-summary-v1.json");
  assert.equal(artifact.document.registeredQuery.queryText, "SELECT * FROM reportFeatureCoverageSummary");
  assert.deepEqual(artifact.document.queryReceipt.result.rows, receipt.result.rows);
});

test("canonical Gherkin and intent queries resolve the supplied CLI identities through receipt-backed drill-downs", async () => {
  const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
  const canonicalFeatureIntents = await discoversCanonicalFeatureIntents(path.join(repositoryRoot, "features"), { relativeTo: repositoryRoot });
  const report = await projectsSelfGovernanceReport({
    index: buildsSyntheticIndex(),
    repositoryId: "canonical-feature-query-test",
    canonicalFeatureIntents,
  });

  const feature = rerunsRegisteredReportQuery(report, "gherkin.feature-by-id.v1", { featureId: "source-facts.cli-query" });
  assert.equal(feature.rowCount, 1);
  assert.equal(feature.rows[0].featureFile, "features/cli-query-command.feature");
  assert.ok(feature.rows[0].drillDowns.some((entry) => entry.queryId === "intent.feature-by-id.v1"));

  const scenario = rerunsRegisteredReportQuery(report, "intent.scenario-lineage.v1", { scenarioId: "source-facts.cli-query.from-command-line" });
  assert.equal(scenario.rowCount, 1);
  assert.equal(scenario.rows[0].responsibilityId, "cli-query-entrypoint-execution");
  assert.equal(scenario.rows[0].obligationId, "execute-semantic-search-query");

  const steps = rerunsRegisteredReportQuery(report, "gherkin.step-identities.v1", { scenarioId: "source-facts.cli-query.from-command-line" });
  assert.deepEqual(steps.rows.map((row) => row.stepType), ["Given", "When", "Then", "And"]);
  assert.ok(report.queryLineage.registeredQueries.find((entry) => entry.queryId === "trace.obligation-to-mechanics.v1").terminal);
});

test("authority authoring bundles bind every healing candidate to contract maps, source evidence, and explicit readiness", async () => {
  const authoringContractMap = await discoversAuthorityAuthoringContractMap(
    path.resolve(process.cwd(), "..", "contract-driven-artifact-governance-engine"),
  );
  assert.equal(authoringContractMap.disposition, "AUTHORING_CONTRACT_MAP_BOUND");
  assert.equal(authoringContractMap.engineVersion, "0.21.0");
  assert.ok(authoringContractMap.entries.some((row) => row.authorityFacet === "decision"));
  assert.ok(authoringContractMap.entries.some((row) => row.authorityFacet === "projection-mapping"));

  const report = await projectsSelfGovernanceReport({
    index: buildsSyntheticIndex(),
    repositoryId: "authoring-evidence-test",
    authoringContractMap,
  });
  await validatesSelfGovernanceReport(report);

  const reconciliation = report.queryLineage.authoringReconciliation;
  assert.equal(reconciliation.disposition, "PASSED");
  assert.equal(reconciliation.healingCandidates, report.featureCoverage.summary.mechanicsWithoutLineage);
  assert.equal(reconciliation.candidatesWithAuthoringEvidenceBundle, reconciliation.healingCandidates);
  assert.equal(reconciliation.candidatesWithCompleteQueryProvenance, reconciliation.healingCandidates);
  assert.equal(reconciliation.incompleteEvidenceBundles, 0);
  assert.equal(reconciliation.contractMapMissing, 0);

  const bundleReceipt = report.queryLineage.queryReceipts
    .find((receipt) => receipt.queryId === "authoring.semantic-authority-evidence-bundle.v1");
  assert.equal(bundleReceipt.result.rows.filter((row) => row.subjectKind === "SOURCE_OCCURRENCE").length, reconciliation.healingCandidates);
  assert.equal(bundleReceipt.result.rows.filter((row) => row.subjectKind === "DECLARED_RESPONSIBILITY").length, reconciliation.declaredResponsibilities);
  const bundle = bundleReceipt.result.rows.find((row) => row.subjectKind === "SOURCE_OCCURRENCE");
  assert.equal(bundle.documentKind, "semantic-authority-authoring-evidence-bundle.v1");
  assert.equal(bundle.lifecycle, "OBSERVED_EVIDENCE");
  assert.ok(bundle.contractMapContext.requiredAuthorityFacets.length > 0);
  assert.ok(bundle.queryReceipts.some((receipt) => receipt.queryId === "authoring.contract-map.v1"));
  assert.notEqual(bundle.subject.sourceReferenceId, null);
  assert.notEqual(bundle.authoringReadinessDisposition, "READY_FOR_PROJECTION");
  assert.equal(typeof bundle.projectionReadinessDisposition, "string");
  assert.equal(bundle.readyForProjection, bundle.projectionReadinessDisposition.startsWith("READY_FOR_PROJECTION"));
  assert.ok(bundleReceipt.result.rows
    .filter((row) => row.authoringReadinessDisposition === "INSUFFICIENT_INTERFACE_EVIDENCE")
    .every((row) => row.readyForProjection && row.projectionReadinessDisposition === "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP"));

  const selected = rerunsRegisteredReportQuery(
    report,
    "authoring.semantic-authority-evidence-bundle.v1",
    { occurrenceId: bundle.occurrenceId },
  );
  assert.equal(selected.rowCount, 1);
  assert.equal(selected.rows[0].resultRowId, bundle.resultRowId);
});

test("query-lineage reconciliation fails closed when a receipt result is changed", async () => {
  const projected = await projectsSelfGovernanceReport({ index: buildsSyntheticIndex(), repositoryId: "self-governance-test" });
  const forged = structuredClone(projected);
  forged.queryLineage.queryReceipts.find((entry) => entry.queryId === "feature-coverage.summary.v1").result.rows[0].canonicalFeatures = 999;

  await assert.rejects(
    validatesSelfGovernanceReport(forged),
    (error) => error instanceof FactQueryLineageError && error.disposition === "FACT_QUERY_RECEIPT_STALE",
  );
});

test("self-governance Markdown exposes inline query identities, receipts, exact query text, and result rows", async () => {
  const report = await projectsSelfGovernanceReport({ index: buildsSyntheticIndex(), repositoryId: "self-governance-test" });
  const markdown = formatsSelfGovernanceReportMarkdown(report);

  assert.match(markdown, /Canonical feature declarations.*feature-coverage\.summary\.v1/);
  assert.match(markdown, /## CLI Traceability Summary/);
  assert.match(markdown, /## CLI Feature Coverage/);
  assert.match(markdown, /## CLI Command Execution Graphs/);
  assert.match(markdown, /cli\.command-execution-graphs\.v1/);
  assert.match(markdown, /## Fat and Waste Inventory/);
  assert.match(markdown, /cli\.unreachable-callables\.v1/);
  assert.match(markdown, /cli\.unreachable-removal-impact\.v1/);
  assert.match(markdown, /## Report Claim Reconciliation/);
  assert.match(markdown, /## Query Evidence Appendix/);
  assert.match(markdown, /### Query Evidence Register/);
  assert.match(markdown, /### Drill-Down Query Register/);
  assert.match(markdown, /## Authority Authoring Readiness/);
  assert.match(markdown, /### Authoring Actions/);
  assert.match(markdown, /authoring\.semantic-authority-evidence-bundle\.v1/);
  assert.match(markdown, /\| Dimension \| Count \| Proving query \| Drill down \|/);
  assert.match(markdown, /### Registered Queries and Results/);
  assert.match(markdown, /\[\d+\]\(#query-result-feature-coverage-summary-v1\)/);
  assert.match(markdown, /<a id="query-result-feature-coverage-summary-v1"><\/a>/);
  assert.match(markdown, /SELECT \* FROM reportFeatureCoverageSummary/);
  assert.match(markdown, /Inspect 1 result row\(s\)/);
});

test("projectsSelfGovernanceReport flags a file claimed by more than one authority document as ambiguous", async () => {
  const index = buildsSyntheticIndex();
  const authorityDocuments = [
    buildsAuthorityDocumentEntry("contracts/example-a.authority.json", { ...buildsAuthorityDocument(), sourceFile: "src/other.js" }),
    buildsAuthorityDocumentEntry("contracts/example-b.authority.json", { ...buildsAuthorityDocument(), sourceFile: "src/other.js" }),
  ];
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_AMBIGUOUS");
});

test("projectsSelfGovernanceReport normalizes workspace-relative modulePath to the repository-relative form authority documents use", async () => {
  // Regression test: a scan run with --workspace ./src emits modulePath like
  // "example.js" (relative to src/), while authority documents declare paths
  // relative to the repository root, e.g. "src/example.js". Without
  // workspaceRelativePrefix these can never match even for the identical file.
  const workspaceRelativeIndex = buildsSyntheticIndex({ modulePathPrefix: "" });
  const authorityDocuments = [buildsAuthorityDocumentEntry("contracts/example.authority.json")];

  const unnormalized = await projectsSelfGovernanceReport({ index: workspaceRelativeIndex, repositoryId: "self-governance-test", authorityDocuments });
  assert.equal(unnormalized.executionMechanics.governed, 0, "without the prefix, the identical file/line never resolves");

  const normalized = await projectsSelfGovernanceReport({
    index: workspaceRelativeIndex,
    repositoryId: "self-governance-test",
    authorityDocuments,
    workspaceRelativePrefix: "src",
  });
  assert.equal(normalized.executionMechanics.governed, 1);
  const governedOccurrence = normalized.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.modulePath, "src/example.js");
  assert.equal(governedOccurrence.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
});

test("projectsSelfGovernanceReport treats non-authority-declaration.v1 documents as an unverified home, not as missing or as coverage", async () => {
  const index = buildsSyntheticIndex();
  const governedArtifactContract = {
    contract: { contractId: "example-contract.v1" },
    artifacts: [{ artifactId: "other-module.v1", relativePath: "src/other.js" }],
  };
  const authorityDocuments = [
    { filePath: "contracts/example.governed.contract.json", document: governedArtifactContract, documentKind: detectsAuthorityDocumentKind(governedArtifactContract) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  // This document isn't authority-declaration.v1, so it must never grant GOVERNED coverage.
  assert.equal(report.executionMechanics.governed, 0);

  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE");
  assert.equal(throwOccurrence.authorityHomeVerified, false);
  assert.equal(throwOccurrence.authorityHomeFile, "contracts/example.governed.contract.json");

  // authoritySources stays scoped to authority-declaration.v1; this shows up separately.
  assert.equal(report.authoritySources.length, 0);
  assert.equal(report.otherAuthorityDocuments.length, 1);
  assert.equal(report.otherAuthorityDocuments[0].documentKind, "governed-artifact-contract");
  assert.deepEqual(report.otherAuthorityDocuments[0].claimedFiles, ["src/other.js"]);
});

function buildsDependencyIndex() {
  const sourceReferences = [];
  const relationships = [];
  let refCounter = 0;

  function addsDependency(modulePath, specifier) {
    refCounter += 1;
    const referenceId = `ref-${refCounter}`;
    sourceReferences.push({ referenceId, modulePath, startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 });
    relationships.push({ relationshipId: `rel-${refCounter}`, relationshipKind: "dependency", sourceReferenceId: referenceId, toSymbolCandidate: specifier });
  }

  // Direct evidence: imports both a JSON contract and the semantic runtime.
  addsDependency("src/wired.mjs", "./contracts/wired.authority.json");
  addsDependency("src/wired.mjs", "../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs");

  // Transitive positive: only imports wired.mjs locally, no direct evidence of its own.
  addsDependency("src/one-hop-away.mjs", "./wired.mjs");

  // Bare (non-relative) specifier that happens to equal a real file's path if it
  // were (wrongly) treated as local -- must never be followed as a graph edge.
  addsDependency("src/bare-importer.mjs", "wired.mjs");

  // Cycle: neither side has any evidence anywhere in the loop.
  addsDependency("src/cycle-a.mjs", "./cycle-b.mjs");
  addsDependency("src/cycle-b.mjs", "./cycle-a.mjs");

  // Dead-end chain: terminates within one hop with nothing found -- a confident NONE.
  // dead-end-helper.mjs is registered via its own (non-local, non-evidence) import so
  // it counts as a *known, resolved* file with zero further local edges -- a genuine
  // dead end, not an unresolvable specifier that would dead-end for the wrong reason.
  addsDependency("src/dead-end.mjs", "./dead-end-helper.mjs");
  addsDependency("src/dead-end-helper.mjs", "node:path");

  // Chain exactly as long as the default max hop depth (4), with no evidence
  // anywhere -- the search should stop at the cap, not claim a confident NONE.
  addsDependency("src/chain-l0.mjs", "./chain-l1.mjs");
  addsDependency("src/chain-l1.mjs", "./chain-l2.mjs");
  addsDependency("src/chain-l2.mjs", "./chain-l3.mjs");
  addsDependency("src/chain-l3.mjs", "./chain-l4.mjs");
  addsDependency("src/chain-l4.mjs", "node:path");

  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "wiring-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "wiring-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
  };
}

test("resolvesDataDrivenWiring detects direct JSON-contract and semantic-runtime imports", () => {
  const index = buildsDependencyIndex();
  const wired = resolvesDataDrivenWiring(index, "", ["src/wired.mjs"]).find((entry) => entry.modulePath === "src/wired.mjs");
  assert.deepEqual(wired.importsContractData, ["./contracts/wired.authority.json"]);
  assert.deepEqual(wired.invokesSemanticRuntime, ["../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"]);
  assert.equal(wired.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");
  assert.equal(wired.hopCount, null);
  assert.equal(wired.hopPath, null);
});

test("resolvesDataDrivenWiring follows one local hop to find transitive evidence", () => {
  const index = buildsDependencyIndex();
  const oneHopAway = resolvesDataDrivenWiring(index, "", ["src/one-hop-away.mjs"]).find((entry) => entry.modulePath === "src/one-hop-away.mjs");
  assert.equal(oneHopAway.wiringDisposition, "TRANSITIVE_DATA_AND_RUNTIME");
  assert.deepEqual(oneHopAway.transitiveContractPaths, ["./contracts/wired.authority.json"]);
  assert.deepEqual(oneHopAway.transitiveRuntimePaths, ["../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"]);
  assert.equal(oneHopAway.hopCount, 1);
  assert.deepEqual(oneHopAway.hopPath, ["src/one-hop-away.mjs", "src/wired.mjs"]);
});

test("resolvesDataDrivenWiring never follows a bare (non-relative) specifier as a local hop", () => {
  const index = buildsDependencyIndex();
  const bareImporter = resolvesDataDrivenWiring(index, "", ["src/bare-importer.mjs"]).find((entry) => entry.modulePath === "src/bare-importer.mjs");
  assert.equal(bareImporter.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring terminates safely on an import cycle", () => {
  const index = buildsDependencyIndex();
  const cycleA = resolvesDataDrivenWiring(index, "", ["src/cycle-a.mjs"]).find((entry) => entry.modulePath === "src/cycle-a.mjs");
  assert.equal(cycleA.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring reports a confident NONE when the local chain terminates within depth", () => {
  const index = buildsDependencyIndex();
  const deadEnd = resolvesDataDrivenWiring(index, "", ["src/dead-end.mjs"]).find((entry) => entry.modulePath === "src/dead-end.mjs");
  assert.equal(deadEnd.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring reports NOT_DETERMINED_BEYOND_MAX_DEPTH instead of a false NONE at the depth cap", () => {
  const index = buildsDependencyIndex();
  const chainStart = resolvesDataDrivenWiring(index, "", ["src/chain-l0.mjs"], { maxHopDepth: 4 }).find((entry) => entry.modulePath === "src/chain-l0.mjs");
  assert.equal(chainStart.wiringDisposition, "NOT_DETERMINED_BEYOND_MAX_DEPTH");

  // A shallower search that reaches the same unresolved evidence sooner behaves the same way.
  const shallowSearch = resolvesDataDrivenWiring(index, "", ["src/chain-l0.mjs"], { maxHopDepth: 2 }).find((entry) => entry.modulePath === "src/chain-l0.mjs");
  assert.equal(shallowSearch.wiringDisposition, "NOT_DETERMINED_BEYOND_MAX_DEPTH");
});

test("projectsSelfGovernanceReport exposes dataDrivenWiring scoped to files with observed mechanics", async () => {
  const index = { ...buildsDependencyIndex(), bodyMechanics: [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "src/wired.mjs", sourceReferenceId: "ref-1", fromSymbolId: null },
    { mechanicId: "bm-2", mechanic: "branch", modulePath: "src/one-hop-away.mjs", sourceReferenceId: "ref-3", fromSymbolId: null },
  ] };
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "wiring-test", authorityDocuments: [] });
  await validatesSelfGovernanceReport(report);

  const wiredEntry = report.dataDrivenWiring.find((entry) => entry.modulePath === "src/wired.mjs");
  assert.equal(wiredEntry.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");
  const oneHopEntry = report.dataDrivenWiring.find((entry) => entry.modulePath === "src/one-hop-away.mjs");
  assert.equal(oneHopEntry.wiringDisposition, "TRANSITIVE_DATA_AND_RUNTIME");
  // cycle-a.mjs has no observed mechanics, so it's outside this report's scope entirely.
  assert.equal(report.dataDrivenWiring.some((entry) => entry.modulePath === "src/cycle-a.mjs"), false);
});

test("resolvesMechanicLocationReachability resolves exact matches, unique suffix matches, ambiguity, and moved/removed files", () => {
  const knownModulePaths = new Set(["src/console/foo.mjs", "src/other/foo.mjs", "src/console/bar.mjs"]);

  const exact = resolvesMechanicLocationReachability("src/console/bar.mjs:10", knownModulePaths);
  assert.equal(exact.status, "RESOLVED");
  assert.equal(exact.resolvedModulePath, "src/console/bar.mjs");

  // "foo.mjs" alone matches two known files by suffix -- must not silently pick one.
  const ambiguous = resolvesMechanicLocationReachability("foo.mjs:5", knownModulePaths);
  assert.equal(ambiguous.status, "AMBIGUOUS");
  assert.equal(ambiguous.resolvedModulePath, null);

  const suffix = resolvesMechanicLocationReachability("bar.mjs:5", knownModulePaths);
  assert.equal(suffix.status, "RESOLVED_BY_SUFFIX");
  assert.equal(suffix.resolvedModulePath, "src/console/bar.mjs");

  const moved = resolvesMechanicLocationReachability("src/console/gone.mjs:1", knownModulePaths);
  assert.equal(moved.status, "MOVED_OR_REMOVED");

  const unresolvable = resolvesMechanicLocationReachability("", knownModulePaths);
  assert.equal(unresolvable.status, "UNRESOLVABLE_LOCATION");
});

test("measuresContractSemanticVolume measures per-mechanic reachability for authority-declaration-shaped documents", () => {
  const draftDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    authority: {
      mechanics: [
        { mechanicId: "m1", mechanic: "branch", sourceLocation: "src/console/bar.mjs:10", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
        { mechanicId: "m2", mechanic: "fallback", sourceLocation: "src/console/vanished.mjs:5", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
        { mechanicId: "m3", mechanic: "throw", sourceLocation: "bar.mjs:20", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
      ],
    },
  };
  const knownModulePaths = new Set(["src/console/bar.mjs"]);
  const [measurement] = measuresContractSemanticVolume(
    [{ document: draftDocument, filePath: "contracts/x.draft.json", documentKind: "authority-declaration.draft.v1" }],
    knownModulePaths,
  );

  assert.equal(measurement.totalSemanticElements, 3);
  assert.equal(measurement.semanticElementCounts.mechanics, 3);
  assert.equal(measurement.reachableSemanticElements, 2); // m1 (exact) + m3 (suffix)
  assert.equal(measurement.orphanedSemanticElements, 1); // m2, moved or removed
  assert.equal(measurement.mechanicReachability.total, 3);
  assert.equal(measurement.mechanicReachability.byStatus.RESOLVED, 1);
  assert.equal(measurement.mechanicReachability.byStatus.RESOLVED_BY_SUFFIX, 1);
  assert.equal(measurement.mechanicReachability.byStatus.MOVED_OR_REMOVED, 1);
  assert.equal(measurement.artifactReachability, null);
});

test("measuresContractSemanticVolume measures per-artifact reachability for governed-artifact-contract documents", () => {
  const contractDocument = {
    contract: { contractId: "example.v1" },
    artifacts: [
      {
        artifactId: "reachable-artifact.v1",
        relativePath: "src/console/bar.mjs",
        sourceAuthority: { decisions: [{ decisionId: "d1" }], semanticEdges: [{ edgeId: "e1" }, { edgeId: "e2" }] },
      },
      {
        artifactId: "orphaned-artifact.v1",
        relativePath: "src/console/vanished.mjs",
        sourceAuthority: { failurePolicies: [{ failurePolicyId: "f1" }] },
      },
    ],
  };
  const knownModulePaths = new Set(["src/console/bar.mjs"]);
  const [measurement] = measuresContractSemanticVolume(
    [{ document: contractDocument, filePath: "contracts/example.contract.json", documentKind: "governed-artifact-contract" }],
    knownModulePaths,
  );

  assert.equal(measurement.totalSemanticElements, 4);
  assert.equal(measurement.reachableSemanticElements, 3); // decisions + semanticEdges on the reachable artifact
  assert.equal(measurement.orphanedSemanticElements, 1); // failurePolicies on the orphaned artifact
  assert.equal(measurement.mechanicReachability, null);
  assert.equal(measurement.artifactReachability.length, 2);
  const orphaned = measurement.artifactReachability.find((artifact) => artifact.artifactId === "orphaned-artifact.v1");
  assert.equal(orphaned.reachable, false);
  assert.equal(orphaned.semanticElementCount, 1);
});

test("measuresContractSemanticVolume returns an empty measurement for documents with neither mechanics nor artifacts", () => {
  const bundleDocument = { bundleType: "semantic-execution-bundle.v1", bundleId: "x.v1" };
  const [measurement] = measuresContractSemanticVolume(
    [{ document: bundleDocument, filePath: "contracts/x.bundle.json", documentKind: "semantic-execution-bundle.v1" }],
    new Set(),
  );
  assert.equal(measurement.totalSemanticElements, 0);
  assert.equal(measurement.mechanicReachability, null);
  assert.equal(measurement.artifactReachability, null);
});

test("projectsSelfGovernanceReport exposes contractSemanticVolume for every discovered authority document", async () => {
  const index = buildsSyntheticIndex();
  const draftAuthorityDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    authority: { mechanics: [{ mechanicId: "d1", mechanic: "branch", sourceLocation: "src/example.js:11", coverage: "AUTHORITY_CANDIDATE_PROJECTED" }] },
  };
  const authorityDocuments = [
    buildsAuthorityDocumentEntry("contracts/example.authority.json"),
    { filePath: "contracts/example.draft.json", document: draftAuthorityDocument, documentKind: detectsAuthorityDocumentKind(draftAuthorityDocument) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.contractSemanticVolume.length, 2);
  const draftMeasurement = report.contractSemanticVolume.find((entry) => entry.authorityFile === "contracts/example.draft.json");
  assert.equal(draftMeasurement.reachableSemanticElements, 1);
  assert.equal(draftMeasurement.orphanedSemanticElements, 0);
});

test("extractsCandidateAuthorityMechanics keeps only non-AUTHORITY_BOUND mechanics with a resolvable location, plus their coverageDisposition", () => {
  const document = {
    schemaVersion: "authority-declaration.draft.v1",
    sourceFile: "widget.mjs",
    authority: {
      mechanics: [
        { mechanicId: "bound", mechanic: "branch", sourceLocation: "src/widget.mjs:5", coverage: "AUTHORITY_BOUND" },
        // Real drafts (e.g. serves-query-console.authority.draft.json) nest
        // coverageDisposition under decisions, not at the mechanic's own top level.
        { mechanicId: "candidate", mechanic: "fallback", sourceLocation: "widget.mjs:20-22", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
        { mechanicId: "flattened-candidate", mechanic: "validation", sourceLocation: "widget.mjs:30", coverage: "AUTHORITY_CANDIDATE_PROJECTED", coverageDisposition: "SEMANTIC_DECISION_REQUIRED" },
        { mechanicId: "no-location", mechanic: "throw", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
      ],
    },
  };
  const candidates = extractsCandidateAuthorityMechanics(document, "contracts/widget.draft.json");
  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].mechanicId, "candidate");
  assert.equal(candidates[0].coverage, "AUTHORITY_CANDIDATE_PROJECTED");
  assert.equal(candidates[0].coverageDisposition, "SEMANTIC_DECISION_REQUIRED");
  assert.deepEqual(candidates[0].location, { modulePath: "widget.mjs", startLine: 20, endLine: 22 });
  // A top-level coverageDisposition (no nested decisions object) still resolves as a fallback.
  assert.equal(candidates[1].mechanicId, "flattened-candidate");
  assert.equal(candidates[1].coverageDisposition, "SEMANTIC_DECISION_REQUIRED");
});

test("resolvesCandidateAuthorityMatch resolves a candidate declared without a path prefix by unique suffix, requiring both mechanic type and line overlap", () => {
  const candidates = extractsCandidateAuthorityMechanics({
    authority: {
      mechanics: [
        { mechanicId: "candidate", mechanic: "fallback", sourceLocation: "widget.mjs:20-22", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
      ],
    },
  }, "contracts/widget.draft.json");
  const knownModulePaths = new Set(["src/console/widget.mjs"]);

  const matched = resolvesCandidateAuthorityMatch({ mechanic: "fallback", modulePath: "src/console/widget.mjs", startLine: 21, endLine: 21 }, candidates, knownModulePaths);
  assert.equal(matched.mechanicId, "candidate");

  const wrongMechanic = resolvesCandidateAuthorityMatch({ mechanic: "throw", modulePath: "src/console/widget.mjs", startLine: 21, endLine: 21 }, candidates, knownModulePaths);
  assert.equal(wrongMechanic, null);

  const outsideLines = resolvesCandidateAuthorityMatch({ mechanic: "fallback", modulePath: "src/console/widget.mjs", startLine: 100, endLine: 100 }, candidates, knownModulePaths);
  assert.equal(outsideLines, null);
});

test("classifiesAutomationReadiness tiers ungoverned occurrences by candidate reachability, coverageDisposition, and authority home status", () => {
  assert.equal(classifiesAutomationReadiness({ posture: "GOVERNED_BY_SEMANTIC_AUTHORITY", authorityHomeStatus: "AUTHORITY_HOME_EXISTS", candidateMatch: null }).automationDisposition, "ALREADY_GOVERNED");
  assert.equal(classifiesAutomationReadiness({ posture: "KERNEL_PRIMITIVE", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: null }).automationDisposition, "NOT_APPLICABLE");
  assert.equal(classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_AMBIGUOUS", candidateMatch: null }).automationDisposition, "NOT_CURRENTLY_PROJECTABLE");

  const semanticDecisionCandidate = { mechanicId: "c1", coverageDisposition: "SEMANTIC_DECISION_REQUIRED" };
  const readyCandidate = { mechanicId: "c2", coverageDisposition: null };
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: semanticDecisionCandidate }).automationDisposition,
    "REQUIRES_HUMAN_SEMANTIC_DECISION",
  );
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: readyCandidate }).automationDisposition,
    "AUTOMATABLE_AFTER_REVIEW",
  );

  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE", candidateMatch: null }).automationDisposition,
    "AUTOMATABLE_AFTER_AUTHORITY_COMPLETION",
  );
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: null }).automationDisposition,
    "REQUIRES_NEW_AUTHORITY",
  );
});

test("projectsSelfGovernanceReport classifies automation readiness per occurrence, finding a reachable draft candidate the exact-match authority home index misses", async () => {
  const index = buildsSyntheticIndex();
  const admittedAuthorityDocument = buildsAuthorityDocumentEntry("contracts/example.authority.json");
  // Declares sourceFile without the "src/" prefix the admitted authority document
  // uses -- resolvesAuthorityHomeStatus's exact-match home index will not claim
  // src/example.js from this document at all, but the suffix-aware candidate
  // matcher below still finds this candidate for the fallback occurrence.
  const draftDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    sourceFile: "example.js",
    authority: {
      mechanics: [
        { mechanicId: "draft-fallback", mechanic: "fallback", sourceLocation: "example.js:40", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
      ],
    },
  };
  const authorityDocuments = [
    admittedAuthorityDocument,
    { filePath: "contracts/example.draft.json", document: draftDocument, documentKind: detectsAuthorityDocumentKind(draftDocument) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  const governedOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.automationDisposition, "ALREADY_GOVERNED");

  const fallbackOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "fallback");
  assert.equal(fallbackOccurrence.automationDisposition, "REQUIRES_HUMAN_SEMANTIC_DECISION");
  assert.equal(fallbackOccurrence.candidateAuthorityFile, "contracts/example.draft.json");
  assert.equal(fallbackOccurrence.candidateMechanicId, "draft-fallback");
  assert.deepEqual(fallbackOccurrence.missingTissue, ["RESPONSIBILITY_BINDING_MISSING", "EXECUTION_BINDING_MISSING", "EQUIVALENCE_PROOF_MISSING"]);

  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.automationDisposition, "REQUIRES_NEW_AUTHORITY");
  assert.equal(throwOccurrence.candidateAuthorityFile, null);

  assert.equal(report.automationReadiness.byDisposition.ALREADY_GOVERNED, 1);
  assert.equal(report.automationReadiness.byDisposition.REQUIRES_HUMAN_SEMANTIC_DECISION, 1);
  assert.equal(report.automationReadiness.byDisposition.REQUIRES_NEW_AUTHORITY, 1);
});

test("detectsAuthorityDocumentKind falls back to authority-declaration-unmarked.v1 for a document with a mechanics-array shape but no marker field", () => {
  const unmarked = { sourceFile: "x.mjs", authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "x.mjs:1" }] } };
  assert.equal(detectsAuthorityDocumentKind(unmarked), "authority-declaration-unmarked.v1");

  // An empty or malformed mechanics array must not be treated as evidence of this shape.
  assert.equal(detectsAuthorityDocumentKind({ authority: { mechanics: [] } }), null);
  assert.equal(detectsAuthorityDocumentKind({ mechanics: [{ mechanicId: "m1" }] }), null);
});

function buildsMinimalSuccessionIndex({ sourceReferences = [], relationships = [], bodyMechanics = [] }) {
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "succession-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "succession-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
}

function addsDependencyRef(sourceReferences, relationships, modulePath, specifier, refIdPrefix) {
  const referenceId = `${refIdPrefix}-dep`;
  sourceReferences.push({ referenceId, modulePath, startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 });
  relationships.push({ relationshipId: `${refIdPrefix}-rel`, relationshipKind: "dependency", sourceReferenceId: referenceId, toSymbolCandidate: specifier });
}

function addsMechanicRef(sourceReferences, bodyMechanics, modulePath, mechanic, line, refIdPrefix) {
  const referenceId = `${refIdPrefix}-ref`;
  sourceReferences.push({ referenceId, modulePath, startLine: line, endLine: line, startColumn: 1, endColumn: 1 });
  bodyMechanics.push({ mechanicId: `${refIdPrefix}-bm`, mechanic, modulePath, sourceReferenceId: referenceId, fromSymbolId: null });
}

function buildsAuthoritySuccessionDocument(sourceFile, mechanics) {
  return {
    document: { sourceFile, authority: { mechanics } },
    filePath: "contracts/x.authority.json",
  };
}

test("resolvesAuthoritySuccession follows a re-export shim to a successor file that carries every declared mechanic type", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl.mjs", "shim");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/impl.mjs" },
    { mechanic: "fallback", modulePath: "src/impl.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "shim.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_RESOLVED");
  assert.equal(result.successorFile, "src/impl.mjs");
  assert.equal(result.hopCount, 1);
  assert.equal(result.mechanicsPresentInSuccessor, 2);
  assert.equal(result.recommendedAction, "REVIEW_AND_REBIND_TO_SUCCESSOR");
});

test("resolvesAuthoritySuccession treats a source file that already carries every declared mechanic type as already current", () => {
  const index = buildsMinimalSuccessionIndex({});
  const knownModulePaths = new Set(["src/file.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/file.mjs" },
    { mechanic: "fallback", modulePath: "src/file.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("file.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "file.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "file.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SOURCE_STILL_CURRENT");
  assert.equal(result.successorFile, null);
  assert.equal(result.recommendedAction, "NONE_ALREADY_CURRENT");
});

test("resolvesAuthoritySuccession treats a source file with any of its own mechanics as still current -- incomplete, not a shim needing a successor search", () => {
  // The anchor has its own "branch" mechanic (so it is not a re-export shim), but
  // the document also declares a "retry" mechanic never observed there. A naive
  // "must cover every declared type" trigger would wrongly go hunting a
  // successor from a substantial file that plainly isn't a passthrough.
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/file.mjs", "./unrelated.mjs", "file");
  const knownModulePaths = new Set(["src/file.mjs", "src/unrelated.mjs"]);
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const occurrences = [
    { mechanic: "branch", modulePath: "src/file.mjs" },
    { mechanic: "retry", modulePath: "src/unrelated.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("file.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "file.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "retry", sourceLocation: "file.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SOURCE_CURRENT_BUT_INCOMPLETE");
  assert.equal(result.successorFile, null, "must not search further hops away from a file that already has its own mechanics");
  assert.equal(result.mechanicsPresentInSuccessor, 1);
  assert.equal(result.recommendedAction, "REVIEW_SOURCE_FOR_MISSING_MECHANIC_TYPES");
});

test("resolvesAuthoritySuccession reports no current successor when the declared sourceFile does not exist and there is no anchor to search from", () => {
  const index = buildsMinimalSuccessionIndex({});
  const knownModulePaths = new Set(["src/unrelated.mjs"]);
  const authorityDocuments = [buildsAuthoritySuccessionDocument("gone.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "gone.mjs:10", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences: [], index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_HAS_NO_CURRENT_SUCCESSOR");
  assert.equal(result.anchorFile, null);
  assert.equal(result.recommendedAction, "RECONCILE_MANUALLY_NO_ANCHOR");
});

test("resolvesAuthoritySuccession reports ambiguous when the shim's chain forks to two files that both carry mechanics", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl-a.mjs", "shim-a");
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl-b.mjs", "shim-b");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl-a.mjs", "src/impl-b.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/impl-a.mjs" },
    { mechanic: "branch", modulePath: "src/impl-b.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_AMBIGUOUS");
  assert.equal(result.successorFile, null);
  assert.equal(result.recommendedAction, "RECONCILE_MANUALLY_AMBIGUOUS_SUCCESSOR");
});

test("resolvesAuthoritySuccession reports partial overlap when the resolved successor only carries some declared mechanic types", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl.mjs", "shim");
  const bodyMechanics = [];
  addsMechanicRef(sourceReferences, bodyMechanics, "src/impl.mjs", "branch", 5, "impl-branch");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships, bodyMechanics });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl.mjs"]);
  const occurrences = [{ mechanic: "branch", modulePath: "src/impl.mjs" }];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "shim.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_PARTIAL");
  assert.equal(result.successorFile, "src/impl.mjs");
  assert.equal(result.mechanicsPresentInSuccessor, 1);
  assert.equal(result.mechanicsDeclared, 2);
  assert.equal(result.recommendedAction, "REVIEW_PARTIAL_SUCCESSOR_AND_AUTHOR_GAPS");
});

test("projectsSelfGovernanceReport exposes authoritySuccession, resolving a re-export shim's successor end to end", async () => {
  const sourceReferences = [
    { referenceId: "ref-shim-dep", modulePath: "shim.mjs", startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-impl-branch", modulePath: "impl.mjs", startLine: 5, endLine: 5, startColumn: 1, endColumn: 1 },
  ];
  const relationships = [
    { relationshipId: "rel-shim", relationshipKind: "dependency", sourceReferenceId: "ref-shim-dep", toSymbolCandidate: "./impl.mjs" },
  ];
  const bodyMechanics = [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "impl.mjs", sourceReferenceId: "ref-impl-branch", fromSymbolId: null },
  ];
  const index = {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "succession-report-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "succession-report-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
  // No schemaVersion/authorityType/etc -- only detectable via the mechanics-array structural fallback.
  const unmarkedDocument = { sourceFile: "shim.mjs", authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" }] } };
  const authorityDocuments = [{ filePath: "contracts/shim.authority.complete.json", document: unmarkedDocument, documentKind: detectsAuthorityDocumentKind(unmarkedDocument) }];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "succession-report-test", authorityDocuments, workspaceRelativePrefix: "" });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.authoritySuccession.length, 1);
  assert.equal(report.authoritySuccession[0].succession, "AUTHORITY_SUCCESSOR_RESOLVED");
  assert.equal(report.authoritySuccession[0].successorFile, "impl.mjs");
  assert.equal(report.authoritySuccession[0].recommendedAction, "REVIEW_AND_REBIND_TO_SUCCESSOR");
});

function buildsProposalBatchDocument({ withReviewFindings = true } = {}) {
  return {
    documentKind: "semantic-overlap-proposal-batch.v1",
    lifecycle: "INFERRED_NOT_ADMITTED",
    subject: { historicalAuthorityFile: "contracts/x.authority.complete.json", resolvedSuccessorFile: "src/x.runtime.impl.mjs" },
    inference: { resolvedModel: "gemini-flash-latest", completedAt: "2026-08-03T21:17:46.489Z" },
    proposals: [
      { authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP" },
      { authorityMechanicId: "m2", overlapDisposition: "PROPOSED_EXACT_OVERLAP" },
      { authorityMechanicId: "m3", overlapDisposition: "PROPOSED_NO_MATCH" },
    ],
    reviewFindings: withReviewFindings
      ? [{ authorityMechanicId: "m2", reviewVerdict: "AMEND_TO_PARTIAL_OVERLAP", correctedDisposition: "PROPOSED_PARTIAL_OVERLAP", reason: "Overclaimed coverage on the success path." }]
      : [],
  };
}

test("summarizesSemanticOverlapProposalBatch derives disposition tallies from proposals and reviewFindings rather than trusting a self-reported summary block", () => {
  const summary = summarizesSemanticOverlapProposalBatch({ filePath: "reviews/x.json", document: buildsProposalBatchDocument() });

  assert.equal(summary.lifecycle, "INFERRED_NOT_ADMITTED");
  assert.equal(summary.historicalAuthorityFile, "contracts/x.authority.complete.json");
  assert.equal(summary.resolvedSuccessorFile, "src/x.runtime.impl.mjs");
  assert.equal(summary.totalProposed, 3);
  // Raw model output, unamended.
  assert.deepEqual(summary.modelDispositionCounts, { PROPOSED_EXACT_OVERLAP: 2, PROPOSED_NO_MATCH: 1 });
  // m2's disposition flips to PARTIAL_OVERLAP once the review finding is applied; m1 and m3 are untouched.
  assert.deepEqual(summary.reviewedDispositionCounts, { PROPOSED_EXACT_OVERLAP: 1, PROPOSED_PARTIAL_OVERLAP: 1, PROPOSED_NO_MATCH: 1 });
  assert.equal(summary.reviewFindings.length, 1);
  assert.equal(summary.reviewFindings[0].authorityMechanicId, "m2");
});

test("summarizesSemanticOverlapProposalBatch leaves both tallies identical when no review findings exist yet -- unreviewed is not the same as confirmed", () => {
  const summary = summarizesSemanticOverlapProposalBatch({ filePath: "reviews/x.json", document: buildsProposalBatchDocument({ withReviewFindings: false }) });
  assert.deepEqual(summary.modelDispositionCounts, summary.reviewedDispositionCounts);
  assert.equal(summary.reviewFindings.length, 0);
});

function buildsInferenceQualityDocument() {
  return {
    proposals: [
      { authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
      { authorityMechanicId: "m2", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
      { authorityMechanicId: "m3", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
    ],
    reviewOutcomes: [
      { authorityMechanicId: "m1", outcome: "APPROVED_UNCHANGED" },
      { authorityMechanicId: "m2", outcome: "AMENDED" },
      // m3 intentionally has no recorded outcome.
    ],
    reviewFindings: [
      { authorityMechanicId: "m2", correctedDisposition: "PROPOSED_PARTIAL_OVERLAP", correctedConfidence: 0.5, additionalFinding: "found something else along the way" },
    ],
    knowHowExtracted: [
      { knowHowId: "insight-one", kind: "implementation-gap", generalizability: "repository-specific", statement: "insight one", reviewFinding: "m2", supportingSubjects: ["thing-a"] },
      "insight two as a legacy bare string",
    ],
    candidateAuthorities: [{ candidateAuthorityId: "cand-1", family: "serialization", rationale: "because" }],
  };
}

test("summarizesInferenceQuality tallies review outcomes, tracks unrecorded outcomes as unrecorded (not as an assumed pass), and averages confidence before/after review", () => {
  const quality = summarizesInferenceQuality(buildsInferenceQualityDocument());
  assert.equal(quality.proposalsGenerated, 3);
  assert.deepEqual(quality.reviewOutcomeCounts, { APPROVED_UNCHANGED: 1, AMENDED: 1, APPROVED_WITH_ADDITIONAL_FINDING: 0, REJECTED: 0 });
  assert.equal(quality.unrecordedOutcomes, 1);
  assert.equal(quality.modelConfidenceAverage, 1);
  // m1 keeps confidence 1 (no finding), m2 drops to its correctedConfidence 0.5, m3 keeps 1 (no finding).
  assert.equal(quality.reviewedConfidenceAverage, (1 + 0.5 + 1) / 3);
  assert.equal(quality.newDeterministicFindingsFromReview, 1);
  assert.equal(quality.knowHowExtracted.length, 2);
  assert.equal(quality.knowHowExtracted[0].knowHowId, "insight-one");
  assert.equal(quality.knowHowExtracted[0].kind, "implementation-gap");
  // A legacy bare-string entry is tolerated, not upgraded by guessing a kind for it.
  assert.equal(quality.knowHowExtracted[1].statement, "insight two as a legacy bare string");
  assert.equal(quality.knowHowExtracted[1].kind, "unclassified");
  assert.equal(quality.candidateAuthorities.length, 1);
  assert.equal(quality.candidateAuthorities[0].candidateAuthorityId, "cand-1");
});

test("summarizesInferenceQuality tolerates a document with none of the optional review fields present", () => {
  const quality = summarizesInferenceQuality({ proposals: [{ authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP" }] });
  assert.equal(quality.proposalsGenerated, 1);
  assert.equal(quality.unrecordedOutcomes, 1);
  assert.equal(quality.modelConfidenceAverage, null);
  assert.equal(quality.reviewedConfidenceAverage, null);
  assert.equal(quality.newDeterministicFindingsFromReview, 0);
  assert.deepEqual(quality.knowHowExtracted, []);
  assert.deepEqual(quality.candidateAuthorities, []);
});

test("extractsReviewedKnowHow shapes structured entries, defaults an unknown kind to unclassified, and slugifies a missing knowHowId", () => {
  const document = {
    knowHowExtracted: [
      { knowHowId: "real-id", statement: "a real statement", kind: "implementation-gap", generalizability: "repository-specific", reviewFinding: "m1", supportingSubjects: ["thing"] },
      { statement: "no id given", kind: "not-a-known-kind" },
      "a legacy bare string",
    ],
  };
  const candidates = extractsReviewedKnowHow({ filePath: "reviews/x.json", document });
  assert.equal(candidates.length, 3);
  assert.equal(candidates[0].knowHowId, "real-id");
  assert.equal(candidates[0].kind, "implementation-gap");
  // Unknown kind is not trusted blindly -- falls back to unclassified rather than inventing a category.
  assert.equal(candidates[1].kind, "unclassified");
  assert.equal(candidates[1].knowHowId, "reviews-x-json-know-how-2");
  assert.equal(candidates[2].statement, "a legacy bare string");
  assert.equal(candidates[2].kind, "unclassified");
  assert.equal(candidates[2].generalizability, "unclassified");
});

test("admitsKnowHow stamps a canonical ADMITTED record carrying forward the candidate's evidence lineage", () => {
  const candidate = {
    knowHowId: "some-id",
    statement: "a statement",
    kind: "governance-invariant",
    generalizability: "cross-repository",
    reviewFinding: "m1",
    supportingSubjects: ["a", "b"],
    sourceBatchFile: "reviews/x.json",
  };
  const record = admitsKnowHow(candidate, { admittedBy: "test-reviewer", admittedAtUtc: "2026-01-01T00:00:00.000Z", repositoryId: "test-repo" });
  assert.equal(record.documentKind, "reviewed-engineering-know-how.v1");
  assert.equal(record.lifecycle, "ADMITTED");
  assert.equal(record.knowHowId, "some-id");
  assert.equal(record.kind, "governance-invariant");
  assert.deepEqual(record.scope, { repositoryId: "test-repo", generalizability: "cross-repository" });
  assert.deepEqual(record.evidence, { inferenceBatch: "reviews/x.json", reviewFinding: "m1", supportingSubjects: ["a", "b"] });
  assert.equal(record.admittedBy, "test-reviewer");
});

test("projectsAuthorityRemediationCandidate never claims authored authority -- lifecycle stays CANDIDATE_NOT_AUTHORED", () => {
  const candidateAuthority = { candidateAuthorityId: "success-response-serialization", family: "serialization", rationale: "close the gap" };
  const record = projectsAuthorityRemediationCandidate(candidateAuthority, {
    citesKnowHowIds: ["success-path-serialization-duplicated-inline"],
    sourceEvidence: { inferenceBatch: "reviews/x.json", targetFile: "src/x.mjs" },
    projectedAtUtc: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(record.documentKind, "authority-remediation-candidate.v1");
  assert.equal(record.lifecycle, "CANDIDATE_NOT_AUTHORED");
  assert.equal(record.candidateAuthorityId, "success-response-serialization");
  assert.deepEqual(record.citesKnowHow, ["success-path-serialization-duplicated-inline"]);
  assert.deepEqual(record.sourceEvidence, { inferenceBatch: "reviews/x.json", targetFile: "src/x.mjs" });
});

test("discoversKnowHowRegistry separates admitted know-how from authority-remediation candidates and ignores unrelated JSON", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-know-how-"));
  try {
    await mkdir(path.join(tempDir, "authority-remediation-candidates"), { recursive: true });
    await writeFile(path.join(tempDir, "kh1.json"), JSON.stringify({ documentKind: "reviewed-engineering-know-how.v1", knowHowId: "kh1" }), "utf8");
    await writeFile(path.join(tempDir, "authority-remediation-candidates", "cand1.json"), JSON.stringify({ documentKind: "authority-remediation-candidate.v1", candidateAuthorityId: "cand1" }), "utf8");
    await writeFile(path.join(tempDir, "unrelated.json"), JSON.stringify({ documentKind: "something-else.v1" }), "utf8");

    const registry = await discoversKnowHowRegistry(tempDir, { relativeTo: tempDir });
    assert.equal(registry.admittedKnowHow.length, 1);
    assert.equal(registry.admittedKnowHow[0].document.knowHowId, "kh1");
    assert.equal(registry.authorityRemediationCandidates.length, 1);
    assert.equal(registry.authorityRemediationCandidates[0].document.candidateAuthorityId, "cand1");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("summarizesKnowHowRegistry tallies admitted know-how by kind and generalizability, and keeps remediation candidates explicitly unauthored", () => {
  const admittedKnowHow = [
    { filePath: "know-how/a.json", document: { knowHowId: "a", lifecycle: "ADMITTED", kind: "implementation-gap", statement: "s1", scope: { generalizability: "repository-specific" }, evidence: { inferenceBatch: "reviews/x.json" } } },
    { filePath: "know-how/b.json", document: { knowHowId: "b", lifecycle: "ADMITTED", kind: "governance-invariant", statement: "s2", scope: { generalizability: "cross-repository" }, evidence: { inferenceBatch: "reviews/x.json" } } },
  ];
  const authorityRemediationCandidates = [
    { filePath: "know-how/authority-remediation-candidates/c.json", document: { candidateAuthorityId: "c", lifecycle: "CANDIDATE_NOT_AUTHORED", family: "serialization", rationale: "r", citesKnowHow: ["a"] } },
  ];

  const summary = summarizesKnowHowRegistry({ admittedKnowHow, authorityRemediationCandidates });
  assert.equal(summary.admittedKnowHowCount, 2);
  assert.deepEqual(summary.byKind, { "implementation-gap": 1, "governance-invariant": 1 });
  assert.deepEqual(summary.byGeneralizability, { "repository-specific": 1, "cross-repository": 1 });
  assert.equal(summary.authorityRemediationCandidateCount, 1);
  assert.equal(summary.authorityRemediationCandidates[0].lifecycle, "CANDIDATE_NOT_AUTHORED");
  assert.deepEqual(summary.authorityRemediationCandidates[0].citesKnowHow, ["a"]);
});

test("projectsSelfGovernanceReport exposes knowHowRegistry, purely descriptive and schema-valid, defaulting to empty when nothing is discovered", async () => {
  const index = buildsSyntheticIndex();
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [] });
  await validatesSelfGovernanceReport(report);
  assert.equal(report.knowHowRegistry.admittedKnowHowCount, 0);
  assert.equal(report.knowHowRegistry.authorityRemediationCandidateCount, 0);

  const knowHowRegistry = {
    admittedKnowHow: [{ filePath: "know-how/a.json", document: { knowHowId: "a", lifecycle: "ADMITTED", kind: "implementation-gap", statement: "s1", scope: { generalizability: "repository-specific" }, evidence: { inferenceBatch: "reviews/x.json" } } }],
    authorityRemediationCandidates: [],
  };
  const reportWithRegistry = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [], knowHowRegistry });
  await validatesSelfGovernanceReport(reportWithRegistry);
  assert.equal(reportWithRegistry.knowHowRegistry.admittedKnowHowCount, 1);
});

function buildsFakeSpawnFunction({ stdout = "", stderr = "", error = undefined } = {}) {
  const calls = [];
  const spawnFunction = (command, args, options) => {
    calls.push({ command, args, options });
    return { stdout, stderr, error, status: 0 };
  };
  spawnFunction.calls = calls;
  return spawnFunction;
}

test("invokesLiveModelInference writes the request to a temp file and spawns the connector CLI with the expected argv shape", async () => {
  const canned = { requestId: "r1", disposition: "MODEL_RESPONSE_OBTAINED", result: { format: "json", structuredValue: { proposals: [] } } };
  const spawnFunction = buildsFakeSpawnFunction({ stdout: JSON.stringify(canned) });

  const response = await invokesLiveModelInference(
    { requestId: "r1", executionPolicy: { timeoutMilliseconds: 1000 } },
    { connectorRepoRoot: "C:/fake/connector", providerAuthorityPath: "C:/fake/connector/config/provider-authority.json", spawnFunction },
  );

  assert.deepEqual(response, canned);
  assert.equal(spawnFunction.calls.length, 1);
  const call = spawnFunction.calls[0];
  assert.equal(call.args[0], "--import");
  assert.equal(call.args[1], "tsx");
  assert.ok(call.args[2].includes("llm-connector.ts"));
  assert.equal(call.args[3], "obtain");
  assert.equal(call.args[4], "--request");
  assert.ok(call.args[5].endsWith("request.json"));
  assert.equal(call.args[6], "--provider-authority");
  assert.equal(call.args[7], "C:/fake/connector/config/provider-authority.json");
  assert.equal(call.options.cwd, "C:/fake/connector");
});

test("invokesLiveModelInference throws ModelInvocationError when spawning fails", async () => {
  const spawnFunction = buildsFakeSpawnFunction({ error: new Error("ENOENT") });
  await assert.rejects(() => invokesLiveModelInference({ requestId: "r1" }, { spawnFunction }), ModelInvocationError);
});

test("invokesLiveModelInference throws ModelInvocationError when the connector produces no stdout", async () => {
  const spawnFunction = buildsFakeSpawnFunction({ stdout: "" });
  await assert.rejects(() => invokesLiveModelInference({ requestId: "r1" }, { spawnFunction }), ModelInvocationError);
});

test("invokesLiveModelInference throws ModelInvocationError when stdout is not valid JSON", async () => {
  const spawnFunction = buildsFakeSpawnFunction({ stdout: "not json" });
  await assert.rejects(() => invokesLiveModelInference({ requestId: "r1" }, { spawnFunction }), ModelInvocationError);
});

function buildsCannedModelResponse(proposals) {
  return {
    requestId: "req-1",
    invocationId: "inv-1",
    disposition: "MODEL_RESPONSE_OBTAINED",
    resolvedAuthority: { providerAuthorityId: "primary-cognitive-provider", providerKind: "gemini", modelAlias: "instruction-capable-model", resolvedModel: "gemini-flash-latest" },
    result: { format: "json", structuredValue: { proposals } },
    usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
    proof: { requestHash: "sha256:abc", responseHash: "sha256:def", attemptCount: 1, startedAt: "2026-01-01T00:00:00.000Z", completedAt: "2026-01-01T00:00:01.000Z", durationMilliseconds: 1000 },
  };
}

test("proposesSemanticOverlap builds a request citing every historical mechanic and evidence file, and shapes the model response into an unreviewed batch", async () => {
  const proposals = [{ authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1, currentEvidenceLocation: "x()", authorityOnlyMeaning: [], bodyOnlyMeaning: [], conflicts: [], recommendedAction: "REBASE_AND_BIND", rationale: "matches" }];
  let capturedRequest;
  const invoke = async (modelRequest) => {
    capturedRequest = modelRequest;
    return buildsCannedModelResponse(proposals);
  };

  const historicalAuthorityDocument = {
    sourceFile: "src/old.mjs",
    authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "src/old.mjs:10", responsibility: "does a thing", semantic: { note: "x" } }] },
  };

  const batch = await proposesSemanticOverlap({
    historicalAuthorityFile: "contracts/old.authority.json",
    historicalAuthorityDocument,
    resolvedSuccessorFile: "src/new.mjs",
    successionEvidence: "2-hop chain",
    evidenceFiles: [{ path: "src/new.mjs", content: "export function x() {}" }],
    invoke,
  });

  assert.equal(batch.documentKind, "semantic-overlap-proposal-batch.v1");
  assert.equal(batch.lifecycle, "INFERRED_NOT_ADMITTED");
  assert.equal(batch.subject.historicalAuthorityFile, "contracts/old.authority.json");
  assert.equal(batch.subject.historicalDeclaredSourceFile, "src/old.mjs");
  assert.equal(batch.subject.resolvedSuccessorFile, "src/new.mjs");
  assert.equal(batch.subject.successionEvidence, "2-hop chain");
  assert.equal(batch.inference.resolvedModel, "gemini-flash-latest");
  assert.equal(batch.inference.requestHash, "sha256:abc");
  assert.deepEqual(batch.proposals, proposals);
  // Never pre-reviewed -- a human must fill these in before admission can act on the batch.
  assert.deepEqual(batch.reviewFindings, []);
  assert.deepEqual(batch.reviewOutcomes, []);
  assert.deepEqual(batch.knowHowExtracted, []);
  assert.deepEqual(batch.candidateAuthorities, []);

  assert.equal(capturedRequest.responsePolicy.format, "json");
  assert.ok(capturedRequest.interaction.messages[1].content.includes("m1"));
  assert.ok(capturedRequest.interaction.messages[1].content.includes("export function x()"));
});

test("proposesSemanticOverlap refuses to invoke the model when the historical document declares no mechanics", async () => {
  await assert.rejects(
    () => proposesSemanticOverlap({
      historicalAuthorityFile: "contracts/empty.json",
      historicalAuthorityDocument: {},
      resolvedSuccessorFile: "src/new.mjs",
      evidenceFiles: [{ path: "src/new.mjs", content: "x" }],
      invoke: async () => { throw new Error("should not be called"); },
    }),
    /declares no mechanics/,
  );
});

test("proposesSemanticOverlap throws when the model invocation does not succeed", async () => {
  const historicalAuthorityDocument = { authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "x:1" }] } };
  await assert.rejects(
    () => proposesSemanticOverlap({
      historicalAuthorityFile: "contracts/x.json",
      historicalAuthorityDocument,
      resolvedSuccessorFile: "src/new.mjs",
      evidenceFiles: [{ path: "src/new.mjs", content: "x" }],
      invoke: async () => ({ disposition: "PROVIDER_UNAVAILABLE", findings: [{ code: "X", detail: "overloaded" }] }),
    }),
    /disposition=PROVIDER_UNAVAILABLE/,
  );
});

test("discoversSemanticOverlapProposalBatches finds only documentKind semantic-overlap-proposal-batch.v1 files, recursively, ignoring unrelated JSON", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-reviews-"));
  try {
    await mkdir(path.join(tempDir, "nested"), { recursive: true });
    await writeFile(path.join(tempDir, "batch-a.json"), JSON.stringify(buildsProposalBatchDocument()), "utf8");
    await writeFile(path.join(tempDir, "nested", "batch-b.json"), JSON.stringify(buildsProposalBatchDocument()), "utf8");
    await writeFile(path.join(tempDir, "not-a-batch.json"), JSON.stringify({ documentKind: "something-else.v1" }), "utf8");
    await writeFile(path.join(tempDir, "unparseable.json"), "{ not valid json", "utf8");

    const batches = await discoversSemanticOverlapProposalBatches(tempDir, { relativeTo: tempDir });
    assert.deepEqual(batches.map((batch) => batch.filePath).sort(), ["batch-a.json", "nested/batch-b.json"]);
    assert.equal(batches[0].document.documentKind, "semantic-overlap-proposal-batch.v1");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("discoversSemanticOverlapProposalBatches returns an empty list for a directory that does not exist", async () => {
  const batches = await discoversSemanticOverlapProposalBatches("C:/definitely/does/not/exist/reviews");
  assert.deepEqual(batches, []);
});

test("projectsSelfGovernanceReport exposes semanticOverlapProposals as a purely observational tally, never affecting governance counts", async () => {
  const index = buildsSyntheticIndex();
  const semanticOverlapProposalBatches = [{ filePath: "reviews/x.json", document: buildsProposalBatchDocument() }];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [], semanticOverlapProposalBatches });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.semanticOverlapProposals.length, 1);
  assert.equal(report.semanticOverlapProposals[0].proposalFile, "reviews/x.json");
  assert.deepEqual(report.semanticOverlapProposals[0].reviewedDispositionCounts, { PROPOSED_EXACT_OVERLAP: 1, PROPOSED_PARTIAL_OVERLAP: 1, PROPOSED_NO_MATCH: 1 });
  assert.equal(report.semanticOverlapProposals[0].inferenceQuality.proposalsGenerated, 3);
  // Untouched by the proposal batch -- this remains purely deterministic.
  assert.equal(report.executionMechanics.governed, 0);
});

function buildsFeatureCoverageProposal(overrides = {}) {
  const document = {
    documentKind: "feature-coverage-proposal.v1",
    lifecycle: "INFERRED_NOT_ADMITTED",
    proposalId: "handle-other-failure",
    feature: {
      candidateFeatureId: "handle-other-failure",
      title: "Handle another failure",
      narrative: { asA: "caller", iNeed: "a stable failure", soThat: "failure is observable" },
    },
    capabilityRelations: [],
    scenarios: [{
      candidateScenarioId: "reject-other",
      title: "Reject another input",
      given: ["an invalid input"],
      when: ["the input is handled"],
      then: ["the input is rejected"],
      primaryObligationId: "reject-invalid-other",
      observableResult: "a rejection",
      conformanceSignal: "OTHER_REJECTED",
    }],
    responsibilities: [{
      candidateResponsibilityId: "rejects-other",
      scenarioId: "reject-other",
      obligationId: "reject-invalid-other",
      sourceFile: "src/other.js",
      symbol: null,
    }],
    obligations: [{ candidateObligationId: "reject-invalid-other", scenarioId: "reject-other", statement: "Reject invalid other input." }],
    evidence: { sourceFiles: ["src/other.js"], symbols: [], mechanics: ["throw"], authoritySubjects: [], knowHow: [] },
    coverageTarget: { currentlyUncoveredOccurrences: 1, responsibilitiesCovered: 1 },
    ...overrides,
  };
  document.featureFingerprint = createsProposalFeatureFingerprint(document);
  return document;
}

function buildsCanonicalLineageContract() {
  return {
    contract: { contractId: "example-capability-contract", contractType: "governed-artifact-contract.v1" },
    subject: { subjectId: "example-capability", purpose: "Exercise one example capability." },
    lineage: {
      authorityType: "canonical-lineage-authority.v1",
      projectId: "example-capability",
      features: [{ featureId: "resolve-example", projectId: "example-capability", purpose: "Resolve the example." }],
      scenarios: [{ scenarioId: "resolve-valid-example", featureId: "resolve-example", purpose: "Resolve one valid example." }],
      obligations: [{ obligationId: "produce-example", scenarioId: "resolve-valid-example", statement: "Produce the example result." }],
      responsibilities: [{ responsibilityId: "resolves-example", obligationId: "produce-example", artifactId: "example-body", responsibilityType: "semantic-execution" }],
    },
    artifacts: [{ artifactId: "example-body", relativePath: "src/example.js", relationships: [], proof: { verifierIds: ["example-verifier"] } }],
  };
}

test("validatesFeatureCoverageProposal enforces atomic scenario obligations and a stable fingerprint", () => {
  const valid = buildsFeatureCoverageProposal();
  assert.deepEqual(validatesFeatureCoverageProposal(valid), []);

  const withDerivedCapability = buildsFeatureCoverageProposal({
    capabilityRelations: [{
      relationship: "FEATURE_CONTRIBUTES_TO_CAPABILITY",
      lifecycle: "INFERRED_NOT_ADMITTED",
      disposition: "CAPABILITY_RELATION_PROPOSED",
      candidateCapabilityId: "operate-example",
      name: "Operate the example",
      supportedByFeatures: ["handle-other-failure"],
      evidence: { sharedSubject: "example", sharedOutcome: "observable handling", sharedResponsibilities: ["rejects-other"] },
    }],
  });
  assert.equal(withDerivedCapability.featureFingerprint, valid.featureFingerprint, "derived capability classification must not change feature identity");

  const invalid = buildsFeatureCoverageProposal();
  invalid.obligations.push({ candidateObligationId: "second", scenarioId: "reject-other", statement: "Do another thing." });
  assert.equal(validatesFeatureCoverageProposal(invalid).some((finding) => finding.startsWith("SCENARIO_PRIMARY_OBLIGATION_NOT_ATOMIC")), true);
});

test("discoversFeatureCoverageProposals finds only feature proposal artifacts", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-feature-proposals-"));
  try {
    await writeFile(path.join(tempDir, "feature.json"), JSON.stringify(buildsFeatureCoverageProposal()), "utf8");
    await writeFile(path.join(tempDir, "other.json"), JSON.stringify({ documentKind: "other.v1" }), "utf8");
    const proposals = await discoversFeatureCoverageProposals(tempDir, { relativeTo: tempDir });
    assert.deepEqual(proposals.map((proposal) => proposal.filePath), ["feature.json"]);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("proposesFeatureCoverage uses the bounded query receipt, authors a standalone feature, and leaves capability optional", async () => {
  let capturedRequest;
  const candidate = await proposesFeatureCoverage({
    clusterId: "src/other.js#rejectsOther",
    featureIdHint: "reject-other-input",
    sourceEvidenceFiles: [{ path: "src/other.js", content: "export function rejectsOther() { throw new Error('rejected'); }" }],
    authorityEvidenceFiles: [{ path: "contracts/other.authority.json", content: "{}" }],
    mechanics: ["throw"],
    symbols: ["rejectsOther"],
    uncoveredOccurrences: 1,
    queryEvidence: { inputHash: "sha256:query", resultHash: "sha256:result", commandText: "SELECT ...", rowCount: 1 },
    requestId: "feature-request-1",
    invoke: async (request) => {
      capturedRequest = request;
      return {
        requestId: request.requestId,
        invocationId: "invocation-1",
        disposition: "MODEL_RESPONSE_OBTAINED",
        resolvedAuthority: { providerAuthorityId: "primary-cognitive-provider", providerKind: "gemini", resolvedModel: "gemini-flash-latest" },
        result: {
          format: "json",
          structuredValue: {
            feature: {
              candidateFeatureId: "reject-other-input",
              title: "Reject another input",
              narrative: { asA: "caller", iNeed: "invalid input rejected", soThat: "failure is observable" },
            },
            scenarios: [{
              candidateScenarioId: "reject-other",
              title: "Reject another input",
              given: ["an invalid input"],
              when: ["the input is handled"],
              then: ["the input is rejected"],
              primaryObligationId: "reject-invalid-other",
              observableResult: "a rejection",
              conformanceSignal: "OTHER_REJECTED",
            }],
            responsibilities: [{
              candidateResponsibilityId: "rejects-other",
              scenarioId: "reject-other",
              obligationId: "reject-invalid-other",
              sourceFile: "src/other.js",
              symbol: "rejectsOther",
            }],
            obligations: [{ candidateObligationId: "reject-invalid-other", scenarioId: "reject-other", statement: "Reject invalid other input." }],
            capabilityRelationDisposition: "NO_CAPABILITY_RELATION_DETECTED",
            capabilityRelations: [],
            confidence: 0.9,
            rationale: "The bounded source and authority support one observable rejection feature.",
          },
        },
        proof: { requestHash: "sha256:req", responseHash: "sha256:res", durationMilliseconds: 12 },
        usage: { totalTokens: 123 },
      };
    },
  });

  assert.equal(candidate.feature.candidateFeatureId, "reject-other-input");
  assert.equal(Object.hasOwn(candidate, "capability"), false);
  assert.deepEqual(candidate.capabilityRelations, []);
  assert.equal(candidate.queryEvidence.resultHash, "sha256:result");
  assert.equal(validatesFeatureCoverageProposal(candidate).length, 0);
  assert.match(capturedRequest.interaction.messages[1].content, /Query result hash: sha256:result/);
  assert.match(capturedRequest.interaction.messages[0].content, /Feature is authored; capability is detected/);
});

test("live feature evaluations are discovered and compared without becoming feature coverage", async () => {
  const proposal = buildsFeatureCoverageProposal();
  proposal.inference = { resolvedModel: "gemini-flash-latest", requestId: "live-1", requestHash: "sha256:req", responseHash: "sha256:res", usage: { totalTokens: 50 }, durationMilliseconds: 10 };
  proposal.queryEvidence = { inputHash: "sha256:q", resultHash: "sha256:r", rowCount: 1 };
  const evaluation = wrapsFeatureCoverageInferenceEvaluation(proposal, { evaluationId: "evaluation-1" });
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-feature-evaluations-"));
  try {
    await writeFile(path.join(tempDir, "live.feature-coverage-inference-evaluation.json"), JSON.stringify(evaluation), "utf8");
    const discovered = await discoversFeatureCoverageInferenceEvaluations(tempDir, { relativeTo: tempDir });
    assert.deepEqual(discovered.map((entry) => entry.filePath), ["live.feature-coverage-inference-evaluation.json"]);

    const report = await projectsSelfGovernanceReport({
      index: buildsSyntheticIndex(),
      repositoryId: "live-feature-evaluation-test",
      featureCoverageProposalBatches: [{ filePath: "reviews/other.feature.json", document: buildsFeatureCoverageProposal() }],
      featureCoverageInferenceEvaluationBatches: discovered,
    });
    await validatesSelfGovernanceReport(report);
    assert.equal(report.featureCoverage.summary.liveInferenceEvaluations, 1);
    assert.equal(report.featureCoverage.liveInferenceEvaluations[0].comparisonDisposition, "DUPLICATE_FEATURE_PROPOSAL");
    assert.equal(report.featureCoverage.summary.featureProposalsPendingReview, 1);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("live feature comparison detects an overlapping evidence cluster when the model renames the feature", async () => {
  const admittedProposal = buildsFeatureCoverageProposal();
  const renamedCandidate = buildsFeatureCoverageProposal();
  renamedCandidate.feature.candidateFeatureId = "alternate-other-failure";
  renamedCandidate.scenarios[0].candidateScenarioId = "alternate-other-scenario";
  renamedCandidate.scenarios[0].primaryObligationId = "alternate-other-obligation";
  renamedCandidate.obligations[0].candidateObligationId = "alternate-other-obligation";
  renamedCandidate.obligations[0].scenarioId = "alternate-other-scenario";
  renamedCandidate.responsibilities[0].candidateResponsibilityId = "alternate-other-responsibility";
  renamedCandidate.responsibilities[0].scenarioId = "alternate-other-scenario";
  renamedCandidate.responsibilities[0].obligationId = "alternate-other-obligation";
  renamedCandidate.featureFingerprint = createsProposalFeatureFingerprint(renamedCandidate);
  renamedCandidate.inference = { resolvedModel: "gemini-flash-latest", requestId: "renamed-live" };
  renamedCandidate.queryEvidence = { inputHash: "sha256:q", resultHash: "sha256:r", rowCount: 1 };

  const report = await projectsSelfGovernanceReport({
    index: buildsSyntheticIndex(),
    repositoryId: "renamed-live-feature-test",
    featureCoverageProposalBatches: [{ filePath: "reviews/other.feature.json", document: admittedProposal }],
    featureCoverageInferenceEvaluationBatches: [{
      filePath: "reviews/live/renamed.feature.json",
      document: wrapsFeatureCoverageInferenceEvaluation(renamedCandidate, { evaluationId: "renamed-evaluation" }),
    }],
  });
  await validatesSelfGovernanceReport(report);
  assert.equal(report.featureCoverage.liveInferenceEvaluations[0].comparisonDisposition, "OVERLAPPING_FEATURES_REQUIRE_REVIEW");
});

test("projectsSelfGovernanceReport separates canonical, proposed, structural, and runtime status", async () => {
  const index = buildsSyntheticIndex();
  const canonical = buildsCanonicalLineageContract();
  const authorityDocuments = [buildsAuthorityDocumentEntry("contracts/example-capability.json", canonical)];
  const featureCoverageProposalBatches = [{ filePath: "reviews/handle-other.feature.json", document: buildsFeatureCoverageProposal() }];
  const authoringContractMap = await discoversAuthorityAuthoringContractMap(
    path.resolve(process.cwd(), "..", "contract-driven-artifact-governance-engine"),
  );
  const report = await projectsSelfGovernanceReport({
    index,
    repositoryId: "feature-coverage-test",
    authorityDocuments,
    featureCoverageProposalBatches,
    authoringContractMap,
  });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.featureCoverage.summary.canonicalFeatures, 1);
  assert.equal(report.featureCoverage.summary.proposedFeatures, 1);
  assert.equal(report.featureCoverage.summary.canonicalScenarios, 1);
  assert.equal(report.featureCoverage.summary.proposedScenarios, 1);
  assert.equal(report.featureCoverage.summary.scenariosStructurallyClosed, 1);
  assert.equal(report.featureCoverage.summary.scenariosExecutionEvaluated, 0);
  assert.equal(report.featureCoverage.summary.scenariosRuntimeNotEvaluated, 1);
  assert.equal(report.featureCoverage.summary.fullyConformantScenarios, 0);
  assert.equal("partiallyConformantScenarios" in report.featureCoverage.summary, false);
  assert.equal(report.featureCoverage.summary.featureProposalsPendingReview, 1);
  assert.equal(report.featureCoverage.proposals[0].fingerprintVerified, true);
  assert.equal(report.featureCoverage.proposals[0].duplicateDisposition, "NEW_FEATURE_CANDIDATE");
  assert.equal(report.occurrences.find((occurrence) => occurrence.modulePath === "src/example.js").featureCoveragePosture, "FEATURE_COVERED");
  assert.equal(report.occurrences.find((occurrence) => occurrence.modulePath === "src/other.js").featureCoveragePosture, "FEATURE_COVERAGE_PROPOSED");
  assert.equal(report.featureCoverage.summary.mechanicsWithProposedLineage, 1);
  assert.equal(report.featureCoverage.summary.mechanicsWithoutLineage, 0);
  assert.equal(report.scenarioConformance.features[0].classifications[0].relationship, "SOURCE_LINEAGE_CLASSIFICATION");
  assert.equal(report.scenarioConformance.features[0].scenarios[0].structuralStatus, "STRUCTURALLY_CLOSED");
  assert.equal(report.scenarioConformance.features[0].scenarios[0].runtimeConformance, "NOT_EVALUATED");
  const scenarioPaths = rerunsRegisteredReportQuery(
    report,
    "scenario-conformance.scenario-call-paths.v1",
    { scenarioId: report.scenarioConformance.features[0].scenarios[0].scenarioId },
  );
  assert.ok(scenarioPaths.rows.length > 0, "an unreachable responsibility must still return an explicit reachability row");
  assert.ok(scenarioPaths.rows.every((row) => row.scenarioId === report.scenarioConformance.features[0].scenarios[0].scenarioId));
  const responsibilityId = report.scenarioConformance.features[0].scenarios[0].obligations[0].responsibilities[0].responsibilityId;
  const authoringBundle = rerunsRegisteredReportQuery(
    report,
    "authoring.semantic-authority-evidence-bundle.v1",
    { responsibilityId },
  );
  assert.equal(authoringBundle.rowCount, 1);
  assert.equal(authoringBundle.rows[0].subjectKind, "DECLARED_RESPONSIBILITY");
  assert.equal(authoringBundle.rows[0].authoringReadinessDisposition, "INSUFFICIENT_INTERFACE_EVIDENCE");
  assert.equal(authoringBundle.rows[0].projectionReadinessDisposition, "READY_FOR_PROJECTION_WITH_INTERFACE_EVIDENCE_GAP");
  assert.equal(authoringBundle.rows[0].readyForProjection, true);
});

test("canonical lineage quality findings expose projection mismatches and implementation variants", async () => {
  const canonical = buildsCanonicalLineageContract();
  canonical.lineage.obligations[0].statement = "The example must be projected from admitted authority.";
  canonical.lineage.responsibilities.push({
    responsibilityId: "resolves-example-projected-variant",
    obligationId: "produce-example",
    artifactId: "example-projected-body",
    responsibilityType: "semantic-execution",
  });
  canonical.artifacts.push({
    artifactId: "example-projected-body",
    relativePath: "src/other.js",
    relationships: [{ relationshipType: "derived-from", artifactId: "example-body" }],
    proof: { verifierIds: ["example-verifier"] },
  });

  const report = await projectsSelfGovernanceReport({
    index: buildsSyntheticIndex(),
    repositoryId: "lineage-quality-test",
    authorityDocuments: [buildsAuthorityDocumentEntry("contracts/example-lineage.json", canonical)],
  });
  await validatesSelfGovernanceReport(report);

  const scenario = report.scenarioConformance.features[0].scenarios[0];
  assert.deepEqual(scenario.lineageQualityFindings, [
    "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES",
    "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP",
  ]);
  assert.equal(scenario.structuralStatus, "STRUCTURALLY_CLOSED");
  assert.equal(scenario.runtimeConformance, "NOT_EVALUATED");
});

test("projectsSelfGovernanceReport excludes broader repository authority from a bounded workspace subject", async () => {
  const index = buildsSyntheticIndex({ modulePathPrefix: "" });
  const rootAuthority = buildsAuthorityDocumentEntry("contracts/root.authority.json", buildsAuthorityDocument());
  const localAuthorityDocument = buildsAuthorityDocument();
  localAuthorityDocument.sourceFile = "source-facts-query-console/src/example.js";
  localAuthorityDocument.authority.mechanics[0].sourceLocation = "source-facts-query-console/src/example.js:10-12";
  const localAuthority = buildsAuthorityDocumentEntry("source-facts-query-console/contracts/local.authority.json", localAuthorityDocument);
  const report = await projectsSelfGovernanceReport({
    index,
    repositoryId: "bounded-test",
    authorityDocuments: [rootAuthority, localAuthority],
    workspaceRelativePrefix: "source-facts-query-console",
  });

  assert.equal(report.subjectScope.authorityDocumentsDiscovered, 2);
  assert.equal(report.subjectScope.authorityDocumentsInScope, 1);
  assert.equal(report.subjectScope.authorityDocumentsExcluded, 1);
  assert.deepEqual(
    report.subjectBoundaryItems.filter((item) => item.evidenceClass === "authority-document")
      .map((item) => [item.itemId, item.disposition]),
    [
      ["contracts/root.authority.json", "EXCLUDED"],
      ["source-facts-query-console/contracts/local.authority.json", "IN_SUBJECT"],
    ],
  );
  const excluded = rerunsRegisteredReportQuery(
    report,
    "subject-boundary.items-by-disposition.v1",
    { disposition: "EXCLUDED" },
  );
  assert.deepEqual(excluded.rows.map((item) => item.itemId), ["contracts/root.authority.json"]);
  assert.equal(report.contractSemanticVolume.length, 1);
  assert.equal(report.contractSemanticVolume[0].authorityFile, "source-facts-query-console/contracts/local.authority.json");
});
