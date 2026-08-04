# Source Facts CLI-First Closure Report

CLI reachability, canonical feature access, and deterministic cleanup inventory

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T18:24:23.254Z |
| **Repository** | source-facts-semantic-search-engine |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Source index ID** | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| **Scan ID** | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| **Query catalog** | `self-governance-query-catalog.v1` |
| **Query catalog hash** | `sha256:33d89aeb3a2f7e8304dd18655b2f9616c024b55762d05c3140634585767f9425` |
| **Query receipts** | 67 executed / 67 valid |
| **Render reconciliation** | `PASSED` |
| **Unsupported factual claims** | 0 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## CLI Traceability Summary

This is the primary closure circuit: enumerate CLI roots, union their complete reachable graph slices, join them to exact source facts, and classify the unexplained executable remainder.
A command can be physically observed while still not admitted by direct CLI authority; those states remain separate.

Portfolio posture: [`CLI_IS_FIRST_CLASS_OBSERVED_INTERFACE`](#query-result-cli-traceability-summary-v1)
CLI authority posture: [`CLI_INTERFACE_AUTHORITY_MISSING`](#query-result-cli-traceability-summary-v1)

| Metric | Count | Proving query |
|---|---:|---|
| Observed CLI command handlers | [15](#query-result-cli-traceability-summary-v1) | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| Admitted CLI commands | [0](#query-result-cli-traceability-summary-v1) | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| Runtime callables | [788](#query-result-cli-traceability-summary-v1) | [`cli.callable-inventory.v1`](#query-result-cli-callable-inventory-v1) |
| CLI-reachable callables | [640](#query-result-cli-traceability-summary-v1) | [`cli.entry-point-reachability.v1`](#query-result-cli-entry-point-reachability-v1) |
| Shared CLI infrastructure | [131](#query-result-cli-traceability-summary-v1) | [`cli.shared-reachability.v1`](#query-result-cli-shared-reachability-v1) |
| Runtime-resolution-required | [6](#query-result-cli-traceability-summary-v1) | [`cli.runtime-resolution-debt.v1`](#query-result-cli-runtime-resolution-debt-v1) |
| No CLI reachability | [142](#query-result-cli-traceability-summary-v1) | [`cli.unreachable-callables.v1`](#query-result-cli-unreachable-callables-v1) |
| CLI-reachable mechanic occurrences | [5517](#query-result-cli-traceability-summary-v1) | [`cli.reachable-source-facts.v1`](#query-result-cli-reachable-source-facts-v1) |
| Unreachable mechanic occurrences | [989](#query-result-cli-traceability-summary-v1) | [`cli.unreachable-source-facts.v1`](#query-result-cli-unreachable-source-facts-v1) |

## CLI Feature Coverage

| CLI surface | Handler | Reachable symbols | Canonical features | Scenarios | Status | Evidence |
|---|---|---:|---|---:|---|---|
| `call-graph` | `runCallGraph` | [41](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `console` | `runConsole` | [28](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `generate-connective-tissue` | `runGenerateConnectiveTissue` | [14](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `generate-docs` | `runGenerateDocs` | [52](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `govern` | `runGovern` | [274](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `ingest` | `runIngest` | [78](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `load-sqlserver` | `runLoadSqlServer` | [25](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `project` | `runProject` | [61](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `project-authority` | `runProjectAuthority` | [13](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `project-authority-violations` | `runProjectAuthorityViolations` | [63](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `project-console-contract` | `runProjectConsoleContract` | [35](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `project-governed-console-contract` | `runProjectConsoleContract` | [35](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `propose-feature-coverage` | `runProposeFeatureCoverage` | [32](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `propose-semantic-overlap` | `runProposeSemanticOverlap` | [15](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `query` | `runQuery` | [14](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |
| `web` | `runWeb` | [251](#query-result-cli-entry-points-v1) | none | 0 | `FEATURE_AND_INTERFACE_AUTHORITY_MISSING` | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) |

## Fat and Waste Inventory

Only `NO_CLI_REACHABILITY` appears here. Test/proof, generated, runtime-sensitive, and explicitly reachable classes have already been subtracted.

| Symbol | File | Why classified as waste | Callers | Exported | Authority | Action | Evidence |
|---|---|---|---:|---|---|---|---|
| `projectMessage` | `src/console/governed-message-artifact-family/src/project-message.mjs` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `projectsCard` | `src/gallery/projects-gallery-host.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `extractsReviewedKnowHow` | `src/governance/extracts-reviewed-know-how.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `slugify` | `src/governance/extracts-reviewed-know-how.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `formatsDrillDownLink` | `src/governance/formats-scenario-conformance-report.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsConditionalSectionSchema` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 5 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsGroundingManifest` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsUserPrompt` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `formatsEvidenceFiles` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 5 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `formatsGroundingManifest` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `parsesCodeSymbols` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `parsesJsonEvidence` | `src/governance/generates-connective-tissue.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `rerunsRegisteredReportQuery` | `src/governance/projects-report-query-lineage.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `filtersRowsByParameters` | `src/governance/report-drill-down-query-catalog.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `groups` | `src/governance/report-drill-down-query-catalog.js` | `NO_CLI_REACHABILITY` | 3 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `scenarioResponsibilityRows` | `src/governance/report-drill-down-query-catalog.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `subjectItemRows` | `src/governance/report-drill-down-query-catalog.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildAuthorityMechanicDraft` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsNormalizedSourceCodeMap` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `collectMechanicsViaQuery` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `deduplicateMechanics` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `enrichMechanic` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `extractSourceSnippet` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `extractsSnippetFromText` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `joinsSourceLocation` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `matchesFilter` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `normalizesPathKey` | `src/projects-authority-candidates.js` | `NO_CLI_REACHABILITY` | 32 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsBindingSuggestion` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsCoverageSummary` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsProjector` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsPseudoIndex` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `loadsAuthorityMechanics` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `normalizesPathKey` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 32 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `normalizesViolation` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `normalizeViolations` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `parsesAuthoritySourceLocations` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `parseViolationLocation` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `projectCandidatesFromViolations` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `resolvesDefaultWorkspaceRoot` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 3 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `resolvesRelativeModulePath` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `sourceLocationsOverlap` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `suggestsAuthorityMechanicId` | `src/projects-authority-from-violations.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildArtifactReferenceEdge` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 7 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildDecisionAuthority` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 8 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildFailurePolicy` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 6 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildIterationAuthority` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 2 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildProjectionMapping` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 9 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildResponsibilityAuthorityReference` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 1 | no | none | `REVIEW_BEFORE_REMOVAL` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsConsoleAuthorityBundlesSourceAuthority` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| `buildsConsoleServerSourceAuthority` | `src/projects-governed-console-contract.js` | `NO_CLI_REACHABILITY` | 0 | no | none | `REMOVE_CANDIDATE` | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) |
| ... | ... | 92 additional rows | ... | ... | ... | Open full receipt | [`cli.unreachable-callables.v1`](#query-result-cli-unreachable-callables-v1) |

Reverse justification: [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1). Removal impact: [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1).

## Secondary Governance Summary

This report keeps four independent questions separate: whether lineage is canonical or proposed,
whether the declared structure is closed, whether execution was evaluated, and whether a proof
passed. Static source evidence and live LLM inference calls can support discovery, but neither is
a runtime execution receipt for a scenario.

| Dimension | Count | Proving query | Drill down |
|---|---:|---|---|
| Canonical feature declarations | [4](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Proposed features, not admitted | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios | [6](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Proposed scenarios, not admitted | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios structurally closed | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios structurally incomplete | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios with structural status not evaluated | [4](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios with execution evaluated | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios with runtime conformance `NOT_EVALUATED` | [6](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios conformant by execution proof | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Canonical scenarios with lineage-quality findings | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Mechanics with canonical scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Mechanics with proposed scenario lineage | [158](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Mechanics with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Mechanics without scenario lineage | [6,860](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with canonical scenario lineage | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with proposed scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents without scenario lineage | [10](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Unresolved responsibility-evidence clusters | [701](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Clusters confirmed as feature candidates | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Live LLM inference evaluations | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Optional capability relations proposed from evidence | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Duplicate proposals prevented | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Scenarios with evaluation limit `AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |
| Scenarios with evaluation limit `BODY_NOT_EVALUATED_OUTSIDE_SUBJECT` | [2](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |
| Scenarios with evaluation limit `BODY_NOT_STATICALLY_OBSERVED` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |
| Scenarios with lineage-quality finding `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |
| Scenarios with lineage-quality finding `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |
| Scenarios with lineage-quality finding `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |

**Query evidence**

- [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) — 1 row(s), result `sha256:639a627077574b6d019020d1b42389fea5a176484a9113a77093a7437be558eb`
- [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) — 1 row(s), result `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a`
- [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 701 row(s), result `sha256:d5b1cb3199c241da8e1ad57307c0e4fa588e4f49dc80d4014dfec4da718b4d62`

## Feature Coverage Proposals

Claim type: `QUERYED_INFERENCE_ARTIFACT_FACT`

Query result: [`feature-coverage.proposal-evidence.v1`](#query-result-feature-coverage-proposal-evidence-v1) — 0 row(s), result `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`

No in-subject feature coverage proposals were discovered.

## Live LLM Feature-Inference Evaluations

Claim type: `QUERYED_INFERENCE_ARTIFACT_FACT`

These are receipts from real model calls over deterministic query results. They test the inference target, but remain observational discovery evidence: they neither admit a feature nor execute a product scenario.

Query result: [`feature-coverage.live-inference.v1`](#query-result-feature-coverage-live-inference-v1) — 0 row(s), result `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`

No in-subject live feature-inference evaluation artifacts were discovered.

## Unresolved Responsibility Evidence

Claim type: `QUERYED_GAP_FACT`

These are bounded static-evidence clusters, not feature candidates. A function or module scope becomes eligible for feature inference only after a separate feature-shaping review establishes an actor, outcome, scenario boundary, responsibility, and obligation.

Query result: [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 701 row(s), result `sha256:d5b1cb3199c241da8e1ad57307c0e4fa588e4f49dc80d4014dfec4da718b4d62`

| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility | Query result |
|---|---|---|---:|---|---|---|
| `src/governance/authoring-evidence-query-catalog.js#buildsAuthoringCollections` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, serialization, state-mutation, validation | [278](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#generatesConnectiveTissue` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | [221](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/report-drill-down-query-catalog.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | branch, fallback, object-construction | [156](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-report-query-lineage.js#reconcilesReportQueryLineage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, throw, validation | [141](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-report-query-lineage.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [107](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/web/html-projector.js#projectsHtmlDocument` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [101](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-feature-coverage.js#projectsFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [86](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/call-graph.js#projectsCliEntryPointCallGraph` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw | [83](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/projects-governed-console-contract.js#buildsConsoleGovernedContract` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, state-mutation | [83](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#validatesQueryReceiptBinding` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, throw | [80](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-self-governance-report.js#projectsSelfGovernanceReport` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [77](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#resolveMetric` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [74](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-interface-governance.js#projectsInterfaceGovernance` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation | [68](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/call-graph.js#registersEntryPoint` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, state-mutation | [65](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/gallery/plans-surface-previews.js#plansOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation | [65](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/call-graph.js#buildsEntryPointInventory` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [57](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#validatesGroundedDraft` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw, validation | [57](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-feature-coverage.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | object-construction | [55](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#buildsConditionalSectionSchema` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | object-construction | [54](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/projects-governed-console-contract.js#buildsConsoleServerSourceAuthority` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, object-construction | [52](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-feature-coverage.js#validatesFeatureCoverageProposal` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [51](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-feature-coverage.js#proposesFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, state-mutation, throw, validation | [48](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/sqlserver/load-sqlserver.js#loadsSourceFactIndexIntoSqlServer` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [46](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/gallery/captures-browser-render.js#capturesOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation, validation | [45](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#generatesTraceabilityDocs` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | [44](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/project.js#projectSourceFactsWorkspace` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw | [42](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-semantic-overlap.js#proposesSemanticOverlap` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, throw | [39](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/formats-scenario-conformance-report.js#formatsScenarioConformanceReportMarkdown` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [38](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-scenario-conformance.js#projectsFeatureSet` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [35](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/cli.js#runProposeFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, state-mutation, throw | [34](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| … |  | Full result continues in the cited query receipt |  |  |  | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |

## Canonical Feature Drill-Down

Claim type: `QUERYED_CANONICAL_AUTHORITY_FACT` and `QUERYED_DETERMINISTIC_CLASSIFICATION`

Query result: [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) — 4 row(s), result `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf`

| Feature | Source lineage classification | Scenarios | Responsibilities | Structurally closed | Runtime conformant | Lineage-quality findings | Query result |
|---|---|---:|---:|---:|---:|---:|---|
| `delegate-console-authority` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `project-console-contract` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [2](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `project-governed-messages` | `governed-message-artifact-family` | [3](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `serve-query-console` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

Claim type: `QUERYED_DETERMINISTIC_CLASSIFICATION`

Supporting query result: [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) — 4 row(s), result `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf`

## Feature: `delegate-console-authority`

Delegate the admitted console mechanics to helper authorities and runtime dependencies.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

### Scenario: `delegate-console-mechanics`

The console body delegates routing, validation, and snippet extraction to admitted authorities.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURALLY_CLOSED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `console-authority-bundles.v1.responsibility.v1` | `console-delegates-mechanics` — The console source body must delegate admitted mechanics to authority surfaces. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-authority-bundles.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

## Feature: `project-console-contract`

Project a governed contract draft from the current authority and source-fact evidence.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

Feature lineage-quality findings: `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW`, `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP`.

### Scenario: `project-governed-console-contract`

The translator emits a governed contract draft without hand-authoring the contract bytes.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURALLY_CLOSED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [`MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW`, `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `console-routing-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-routing-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `console-validation-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-validation-adapter.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `console-snippet-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-snippet-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

## Feature: `project-governed-messages`

Render a governed message from declared contract meaning.

Canonical feature authority: `contracts/serves-query-console.contract.json`

Source lineage classification: `governed-message-artifact-family`. This is source-family metadata, not a capability relation or feature parent.

### Scenario: `project-a-declared-message`

A declared message value is projected into canonical output.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURAL_STATUS_NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [`BODY_NOT_STATICALLY_OBSERVED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `executes-message-projection` | `produce-one-canonical-message` — Exactly one canonical message must be produced from declared semantic authority. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/project-message.mjs` (BODY_NOT_STATICALLY_OBSERVED) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

### Scenario: `run-the-message-command`

The projected message is emitted through the declared command port.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURAL_STATUS_NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [`BODY_NOT_EVALUATED_OUTSIDE_SUBJECT`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `entry-point-for-message-command` | `emit-the-message-once` — The command must emit the projected message exactly once. | AUTHORITY_DECLARED | BINDING_DECLARED | `bin/run-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

### Scenario: `verify-the-projected-message`

The projected message is proved against its declared expectation.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURAL_STATUS_NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [`BODY_NOT_EVALUATED_OUTSIDE_SUBJECT`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `evaluates-message-proof` | `prove-the-message-conforms` — Verification must prove the projected message conforms. | AUTHORITY_DECLARED | BINDING_DECLARED | `verification/verifies-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

## Feature: `serve-query-console`

Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

Feature lineage-quality findings: `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES`.

### Scenario: `serve-console-over-loopback`

The console binds only to loopback and serves query, index, and snippet responses.

| Evaluation dimension | Result | Query result |
|---|---|---|
| Scenario lineage | [`SCENARIO_LINEAGE_CANONICAL`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural status | [`STRUCTURAL_STATUS_NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Runtime conformance | [`NOT_EVALUATED`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Structural blockers | [none](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Evaluation limits | [`AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| Lineage-quality findings | [`IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES`](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |
|---|---|---|---|---|---|---|---|---|---|
| `serves-query-console.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `serves-query-console-conformant.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.conformant.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `serves-query-console-projected.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.projected.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

## Evidence Without Canonical Lineage

Claim type: `QUERYED_GAP_FACT`

These facts are inside the report subject but have no admitted scenario lineage. A proposal is
shown as proposed coverage; it is never counted as canonical coverage.

| Inventory | Count | Disposition | Query |
|---|---:|---|---|
| Static mechanics without canonical or proposed lineage | [6,860](#query-result-feature-coverage-unclassified-inventory-v1) | [`NO_SCENARIO_LINEAGE`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Authority documents without canonical scenario lineage | [10](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Admitted know-how without canonical obligation lineage | [0](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Healing drafts without a canonical scenario target | [0](#query-result-feature-coverage-unclassified-inventory-v1) | [`HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |

### Mechanics without lineage

| Mechanic | Occurrences | Files | Query |
|---|---:|---:|---|
| branch | [1,255](#query-result-feature-coverage-unlined-mechanics-v1) | [79](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| exception-handling | [105](#query-result-feature-coverage-unlined-mechanics-v1) | [27](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| fallback | [1,638](#query-result-feature-coverage-unlined-mechanics-v1) | [77](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| iteration | [401](#query-result-feature-coverage-unlined-mechanics-v1) | [65](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| normalization | [136](#query-result-feature-coverage-unlined-mechanics-v1) | [29](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| object-construction | [2,538](#query-result-feature-coverage-unlined-mechanics-v1) | [87](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| retry | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| serialization | [87](#query-result-feature-coverage-unlined-mechanics-v1) | [28](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| state-mutation | [315](#query-result-feature-coverage-unlined-mechanics-v1) | [57](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| throw | [223](#query-result-feature-coverage-unlined-mechanics-v1) | [42](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| validation | [161](#query-result-feature-coverage-unlined-mechanics-v1) | [24](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |

### Authority without canonical scenario lineage

- `contracts/serves-query-console.admitted.contract.json` (governed-artifact-contract) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.authority.complete.json` (authority-declaration-unmarked.v1) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.authority.draft.json` (authority-declaration.draft.v1) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.authority.json` (authority-declaration.v1) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.binding.json` (authority-binding.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/.governance/projections/governed-message-artifact-family.ledger.json` (governed-artifact-projection-ledger.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-request-routing.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-snippet-retrieval.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-validation.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/governed-message-artifact-family/contracts/project-message.authority.json` (semantic-projection-authority.v1) — `FEATURE_COVERAGE_MISSING`

## Subject Boundary

Claim type: `QUERYED_SCOPE_FACT`

Scope mode: `WORKSPACE_BOUNDED`; repository-relative workspace prefix: `src`.

Query result: [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) — 1 row(s), result `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615`

| Evidence class | Discovered | In subject | Excluded as out of subject | Query result |
|---|---:|---:|---:|---|
| Authority documents | [18](#query-result-subject-boundary-evidence-v1) | [12](#query-result-subject-boundary-evidence-v1) | [6](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |
| Semantic-overlap proposal batches | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |
| Feature-coverage proposals | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |
| Live feature-inference evaluations | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |
| Know-how records | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |
| Healing drafts | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [0](#query-result-subject-boundary-evidence-v1) | [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) |

Excluded evidence is not called orphaned: it belongs to a different subject and is not judged by this scan.

## Authority Authoring Readiness

Claim type: `QUERYED_DETERMINISTIC_CLASSIFICATION`

Reconciliation query: [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1)

| Check | Result | Proving query |
|---|---:|---|
| Healing candidates | [6860](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with authoring evidence bundle | [6860](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with complete query provenance | [6860](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with unresolved required evidence | [6860](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates ready for semantic authority authoring | [0](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates ready for projection | [6369](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Declared responsibilities with authoring bundles | [10](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Declared responsibilities awaiting interface evidence for authoring | [7](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Declared responsibilities ready for projection | [7](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Declared responsibilities projectable with interface evidence gap | [7](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |

### Authoring Actions

| Action | Query |
|---|---|
| Build authority evidence bundle | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) |
| Inspect inferred feature/scenario context | [`authoring.scenario-context.v1`](#query-result-authoring-scenario-context-v1) |
| Inspect decision policy | [`authoring.decision-evidence.v1`](#query-result-authoring-decision-evidence-v1) |
| Inspect data shapes | [`authoring.object-shape-evidence.v1`](#query-result-authoring-object-shape-evidence-v1) |
| Inspect failure behavior | [`authoring.failure-policy-evidence.v1`](#query-result-authoring-failure-policy-evidence-v1) |
| Inspect existing authority overlap | [`authoring.authority-overlap.v1`](#query-result-authoring-authority-overlap-v1) |
| Inspect admitted contract maps | [`authoring.contract-map.v1`](#query-result-authoring-contract-map-v1) |
| Build projection target | [`authoring.projection-target.v1`](#query-result-authoring-projection-target-v1) |
| Build proof vectors | [`authoring.proof-vector-candidates.v1`](#query-result-authoring-proof-vector-candidates-v1) |

Lifecycle: `OBSERVED_EVIDENCE` â†’ `INFERRED_AUTHORITY_DRAFT` â†’ `REVIEWED_AUTHORITY_DRAFT` â†’ `ADMITTED_AUTHORITY` â†’ `PROJECTED_BODY` â†’ `EQUIVALENCE_PROVEN`.

## Report Claim Reconciliation

| Check | Result |
|---|---:|
| Registered factual claim values | 164394 |
| Claims with query pointers | 164394 |
| Claims with required drill-down path | 164394 |
| Claims lacking drill-down path | 0 |
| Broken drill-down query references | 0 |
| Invalid parameter bindings | 0 |
| Drill-down result-schema failures | 0 |
| Missing query pointers | 0 |
| Unsupported factual claims | 0 |
| Stale receipts | 0 |
| Index mismatches | 0 |
| Scope mismatches | 0 |
| Result-shape failures | 0 |
| Result-hash failures | 0 |
| Rendered-value mismatches | 0 |
| Deterministic rerun mismatches | 0 |

**Reconciliation disposition:** `PASSED`

## Query Evidence Appendix

### Query Evidence Register

| Query ID | Purpose | Rows | Query hash | Result hash | Status |
|---|---|---:|---|---|---|
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | Executive Summary | 1 | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` | `sha256:639a627077574b6d019020d1b42389fea5a176484a9113a77093a7437be558eb` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | Executive Summary | 1 | `sha256:b230d306d1b6235c356f228a8fbe154b94ded15c1d017b8459b2c4db455fc944` | `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.proposal-evidence.v1`](#query-result-feature-coverage-proposal-evidence-v1) | Feature Coverage Proposals | 0 | `sha256:24a7bd5de2d4710e8917e12ac89f18418667b3ed56690d4a93dcc04c09b11411` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.live-inference.v1`](#query-result-feature-coverage-live-inference-v1) | Live LLM Feature-Inference Evaluations | 0 | `sha256:6d426be0037939f720654e271d2debfe3737345106909d22a6ef600b792c0bbc` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) | Unresolved Responsibility Evidence | 701 | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` | `sha256:d5b1cb3199c241da8e1ad57307c0e4fa588e4f49dc80d4014dfec4da718b4d62` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | Canonical Feature Drill-Down | 4 | `sha256:63140f2c93dfaff428cf1792965fca681c1dc8459b409af57bac1ed680df6edb` | `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) | Evidence Without Canonical Lineage | 1 | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` | `sha256:27bac21b1887ed1eed6be6c16e284e079c9c49e99eeaa4dcc94b37b3c06c11ca` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | Evidence Without Canonical Lineage | 11 | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` | `sha256:d9da9dfcefb667361f4f959d2c820f9a1c6f1434e2fbbbfdf8e19838311fc487` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | Subject Boundary | 1 | `sha256:bb62a3b13d996b599f8ff93979338026e619914bc0972f42c77d1211de60d3bb` | `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.traceability-summary.v1`](#query-result-cli-traceability-summary-v1) | CLI Traceability | 1 | `sha256:167954990db828bda5b3a5f828280f6e21e26397b49e31c2d1b70d0c19d23966` | `sha256:64e1e2c89c121c163cbcd7494baeacc1ed832e5227ad6ec0c0a8db7b3010cb29` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) | CLI Traceability | 16 | `sha256:6d63d220b5df0ae523d1ff1bae9742a3d6a400ec59564d56f5a8f3147303212f` | `sha256:828b9dd612c211d7c5b267d4f4d4937cf0c54ba2511300d2d602579e8833586a` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.callable-inventory.v1`](#query-result-cli-callable-inventory-v1) | CLI Traceability | 788 | `sha256:9a9868803ac90ade1ac49f7fcc41a520e88f19150efd87435c0333c7f34b3be4` | `sha256:02336c9e4d52b474d479366b126a7ad31f20cf0e4b3c0d57634b59b5798bf960` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.entry-point-reachability.v1`](#query-result-cli-entry-point-reachability-v1) | CLI Reachability | 996 | `sha256:5a68b386bc943e7983c3e20e6f2afd468d25a89683b0cfe2abeddffd3cea9e6a` | `sha256:cfab047f4f95d375f460332b88563006c4255cd303abe242fcbb6e0ed4af0fb2` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.shared-reachability.v1`](#query-result-cli-shared-reachability-v1) | CLI Reachability | 131 | `sha256:49a77e977b9941a90b7e7d9ee847c286c1322508bc70f195aa16834ad43b1e25` | `sha256:77010d8f9da60f6db55ebd17882194fef5cddf0b64970b2a016a4a1d8b4b5ac1` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.runtime-resolution-debt.v1`](#query-result-cli-runtime-resolution-debt-v1) | CLI Reachability | 6 | `sha256:5dd66999c648686e342b1d7e7847cca6bc2d6aba3b46a83eca08b9f639612160` | `sha256:33ba6b41de07bb934b92a5c2660fa88b4f8da8d7c121fff4849b75f2df0173b1` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.reachable-source-facts.v1`](#query-result-cli-reachable-source-facts-v1) | CLI Reachable Source Facts | 5517 | `sha256:9a90cc569a898443ff2911aa820c437abfd1e09df76cb8fc97f9af450eca4cbb` | `sha256:8058e224f11b62a837bb29b36a9b223927f11f91cbc3470ea9b3c24202712730` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.unreachable-callables.v1`](#query-result-cli-unreachable-callables-v1) | Fat and Waste Inventory | 142 | `sha256:b9685d65ca5e3116ff73e36a4fcc75bcde6ee74d27ae1c53571b27e806caeb3d` | `sha256:6aa059110b72ca84003c58efaeca5054a85baa6b15be48bbca1dc36ac13cd304` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.unreachable-source-facts.v1`](#query-result-cli-unreachable-source-facts-v1) | Fat and Waste Inventory | 989 | `sha256:94440b0342c83f2f7820cda1a4e12a1b41e3b294c43be109c2cae564636110de` | `sha256:1df8818b575000b741ae9bd641c0a0ace3428b2485167feaecea385892c8e544` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1) | Reverse CLI Justification | 996 | `sha256:414642febefcfb3b5cb7888a130f5c1d578619fc38e661aef67ec6b8e797e853` | `sha256:8965cb72c7b03bc6a6bb6ecd865118d9fdf58a7cbc73b93837e41bf67a240f84` | `RELATIONAL_QUERY_EXECUTED` |
| [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | Removal Impact | 142 | `sha256:d01ecae4d4e7adc553ea633a4bf509d430835ac4495d2f338a454cea8a152027` | `sha256:2f6664d4fcea683b3b5252b79acaef2410c06342a100ba038a8ae0fe4b1d7465` | `RELATIONAL_QUERY_EXECUTED` |
| [`interface.summary.v1`](#query-result-interface-summary-v1) | Interface Governance | 1 | `sha256:167954990db828bda5b3a5f828280f6e21e26397b49e31c2d1b70d0c19d23966` | `sha256:64e1e2c89c121c163cbcd7494baeacc1ed832e5227ad6ec0c0a8db7b3010cb29` | `RELATIONAL_QUERY_EXECUTED` |
| [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | CLI Command Inventory | 16 | `sha256:1cb099fc098a9301e59dae42cf27ab6c5b78a9e37cd5f5e5b21ead9785ee0454` | `sha256:48fae04fdb40427fe2ea2c213ced4e0b4dc7be4dbd8daeabec4c2de7a5ff4035` | `RELATIONAL_QUERY_EXECUTED` |
| [`interface.authority-gaps.v1`](#query-result-interface-authority-gaps-v1) | CLI Authority Gaps | 16 | `sha256:9489a56fb6b3fd0b380f95572d062b54e7c1a0e641832c581d4b02e214d6b38a` | `sha256:c09032f566ad186d3d428deca6b2279cf3e26606f7df59546616fcf94d40dfd9` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | Canonical Features | 4 | `sha256:b507b9960f74168182112bb151a954844379cf125b19fe84166cbc25a5b68de3` | `sha256:063171974f526756fb724236ea5b36ef9e0966af52c3e7bb29acd8a1133f5701` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.feature-scenarios.v1`](#query-result-feature-coverage-feature-scenarios-v1) | Feature Scenarios | 6 | `sha256:6971565a6037b39edde137eb108803f4360451bbffe1c34b9ed28dccb3e45f7b` | `sha256:3fb54aaf62148af47a5ced46cdd37fc624036b0648beb5061fd1c55389f839a9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | Canonical Scenarios | 6 | `sha256:713f34d346172b89a6d2641cabe6b68b4cdcfab36d97ef84c6aacebaec1ea8d9` | `sha256:3a98900c82bacbbcbb9465b913bb85114c4522861d5fed8059724415fd5fa91d` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.by-structural-status.v1`](#query-result-scenario-conformance-by-structural-status-v1) | Structural Status | 6 | `sha256:c57d1e34cc94400a0112b0f630664f25d804b761ccfce4d6203ef63e1a1838be` | `sha256:9dda679bcce7505b7e4c07910fb3d137b021030e23ea5f6b216b6d335d3630e9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | Scenario Responsibilities | 10 | `sha256:4ebd6c77ccdbd9cb5424de261939db79c47da42a230c2b08f309a9682eb18cc1` | `sha256:d27ae627cf1fe9610ffeb16a31979828fd9dde280261e4e991cf637f792f9343` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | Scenario Call Paths | 10 | `sha256:fbd7a1a7480a478232d79b077bc2dc1ee7820e72195339b31c479e06046150f6` | `sha256:4ef4a19f76ee643e261cbe4cc173494cd45c07a7d5910e76bbe2c4d42c16ece5` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-file.v1`](#query-result-feature-coverage-unlined-mechanics-by-file-v1) | Unlined Mechanics by File | 516 | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` | `sha256:610558d23a39157d6f30d7b7d7348eaaf2eeb578bb977527cdc2c57bfcf26c9e` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | Unlined Mechanics by Responsibility | 1899 | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` | `sha256:569f58628b28689eb554e154e65630bfa0dd5ab8fcabcba29b520964ba782b08` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-symbol.v1`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1) | Unlined Mechanics by Symbol | 1900 | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` | `sha256:0824dc7829a9f1c92890d5823c651f286e2478a76c20e437d154459ca0d8bcca` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | Exact Unlined Occurrences | 6860 | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` | `sha256:809d91200faaaa55f8070272057c93076f446347f1c19bf407e0cf0dd0dbff3a` | `RELATIONAL_QUERY_EXECUTED` |
| [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | Physical Source Evidence | 7018 | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` | `sha256:d827a8c7a2b5e7d24442cda4b635e8e65051f19e85813c9a0cd6996b358eb797` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | Interface Reachability | 996 | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` | `sha256:8a06804f11a1ba1204d34534011464a0709b8b3613a0e5444bc6c4a35814af5d` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | Reverse Callers | 6891 | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` | `sha256:908a85992edbddab81e369c95990153874aaa6288ead97bdf8c9dcc16bb024b4` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | Forward Callees | 6891 | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` | `sha256:3713b2cdf9df8231b08b9ca273fb52a1a5f3f93854c5f811fabe9d9ec822b20d` | `RELATIONAL_QUERY_EXECUTED` |
| [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | Responsibility Cluster | 701 | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` | `sha256:284a228e61e5e016bf992f63b7dab7a52741f9d1960dde899366d105554f6b3c` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.documents.v1`](#query-result-authority-documents-v1) | Authority Lineage | 12 | `sha256:aa543b2c7ab5577f034bd1257164fc69ec434efa54926c34f63bc305255f5c31` | `sha256:1292556b29e7ad54fc5555e8ed6c07d425cbc6c6c0b5292a27c025de41fa4d0f` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | Authority Near Symbol | 7018 | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` | `sha256:738ff1925172699e5e165dcbed4b6e5a98948c87f8135961af702ce19f9f8e54` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.items-by-disposition.v1`](#query-result-subject-boundary-items-by-disposition-v1) | Subject Boundary Items | 18 | `sha256:3ddeefdb2493e00e7021c129748933e87fa6fe5c7fa1b140e1538d8af86f6ede` | `sha256:df6183da0e000c80d3dfa9abbdda95a2dc3d2817e28267989529a2c85769d969` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.included-items.v1`](#query-result-subject-boundary-included-items-v1) | Included Subject Items | 12 | `sha256:86ccec9fb998fd3f4ef516f0cbe33beb7c2b636d6ecd330ec487db7f7bf6f5ab` | `sha256:cd5c1b08b0deec4eb5847b548b0bff3acf8ff2022be6f81216a2a59ac6b960c7` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.excluded-items.v1`](#query-result-subject-boundary-excluded-items-v1) | Excluded Subject Items | 6 | `sha256:afafdb3b9d69acd6c8a1d16c0247e29e22d25e96ccf54c0133cce6cc22d4f08c` | `sha256:cd96c3ad8b9374dbccbc0e4a68319ba5b23dbda63c871e9baef49debad679788` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | Subject Item Scope Reason | 18 | `sha256:a3933b1341b539303541191b403c8cc9d2b6e51e484de9e49583c0852b34e435` | `sha256:40f693882dd30b2a4526da2ae692795d3c51180d95e5c7907826260df09710bc` | `RELATIONAL_QUERY_EXECUTED` |
| [`impact.source-reference-reverse-impact.v1`](#query-result-impact-source-reference-reverse-impact-v1) | Reverse Impact | 7018 | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` | `sha256:cb665978faaddad663457faec1c69043a98a68d11ad787cc1b0233ed872f5f92` | `RELATIONAL_QUERY_EXECUTED` |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | Change and Healing | 6860 | `sha256:80ff9ca4e23a4da9a8312b08ba3e148f67675ef5c8c56d3a2d48c6991b2cfdbf` | `sha256:6c5f966f9a8ce6ea91455807b749fdf14e1f971f8fb2115ec4f2079a90b119a3` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.interface-execution-slice.v1`](#query-result-authoring-interface-execution-slice-v1) | Interface-to-Responsibility Slice | 1451 | `sha256:c3366a48fc90431e4874916dba2eb03d7eb73d2b6fda23b841c87da63917debb` | `sha256:057c4ab5a07afb6b87231b89297fccc64a2b32797c35c6e1641d48bf47b3a527` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.responsibility-body-evidence.v1`](#query-result-authoring-responsibility-body-evidence-v1) | Responsibility Body Evidence | 693 | `sha256:798add784465cc049ae5fafd026257b873551da34655e12252477cdc6ff57240` | `sha256:4305d35c133a0d82ba8a1620b47bdba7ff051ac41d4a20d4769b85d2e73ebe37` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.decision-evidence.v1`](#query-result-authoring-decision-evidence-v1) | Decision Semantics | 1255 | `sha256:1b742701efaeeecc5ca8f85fb4db7d8d1fc0b16c6692e41e1298393b848d5487` | `sha256:85766697236a1eedeaf27e8f6fae8c522e37c9820af0005b5c5e9329a9fe7578` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.fallback-evidence.v1`](#query-result-authoring-fallback-evidence-v1) | Fallback and Missing-Value Policy | 1638 | `sha256:d4bcb3099a71a172a1d26e52f782473bd1a877fa57833757a02b38ec136c2039` | `sha256:d067696995b9487ad14057560f7713e21df697468801e86f423d8cc54c3d0830` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.validation-evidence.v1`](#query-result-authoring-validation-evidence-v1) | Validation and Rejection Semantics | 161 | `sha256:987e66b52ca7bcefd1c09b4a721f188302f1708c91bbf61e28c7de0e944ea807` | `sha256:fa28de0704d3e318acfbe2674b647f1393eb1dd685cd945555db92ee91240fca` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.failure-policy-evidence.v1`](#query-result-authoring-failure-policy-evidence-v1) | Exception and Failure Policy | 329 | `sha256:8a66c42dfc3fa269b39827bd1fa2c0f6a64008dfd8c668e36d764b270f8e68b5` | `sha256:fc188a783865b711b538f9e34e1d6b34e3763f40f2bead588cbb8bd3690881ac` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.object-shape-evidence.v1`](#query-result-authoring-object-shape-evidence-v1) | Object Shape Evidence | 2538 | `sha256:322a74e7fd1f1bbfaf8e014194ceaafd06dc283e624a96aa398afec32ba04621` | `sha256:e6aaf54cec3cc6f468db2d52b7e7d5a3ad95d375eec8666cbc17b9f9b3532fd4` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.result-contract-evidence.v1`](#query-result-authoring-result-contract-evidence-v1) | Result Contract Evidence | 1053 | `sha256:e295e5c199b8e405f479624723ee975cc1a4ab89bb1f8f9a2a309a4e183dd0c3` | `sha256:6f2ed725555ed62d210188aad4147594c14e7d0ad88a218f7060c0176323580a` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.serialization-evidence.v1`](#query-result-authoring-serialization-evidence-v1) | Serialization Profile | 87 | `sha256:66d9960a07465b5af9e5c49cbadb38dc781b1664bae8f38f2a729a69b8c957f0` | `sha256:c6874f84db0b4e85b3d88db74db1bf05cf77382f0ffffe9b0f36c8bb98570ce3` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.normalization-evidence.v1`](#query-result-authoring-normalization-evidence-v1) | Normalization and Translation | 136 | `sha256:e19f5b592048026bb385df580778f608c57c298fd8aea8cc7ae0b90637bd8dc8` | `sha256:1c1e8cf2652b7968410a274ef78705a92e8ba68eca5e35b37b4f658ba062d5ae` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.iteration-evidence.v1`](#query-result-authoring-iteration-evidence-v1) | Iteration Semantics | 401 | `sha256:1b7b1d5154de8375af5dc76f91ec87f46affe2bbe4ff7af27599261f1684bcef` | `sha256:2cdbe49ee9646cfc9bf91bd5cb60a8b63c073df2a3f4a9fac83806a129410c52` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.state-transition-evidence.v1`](#query-result-authoring-state-transition-evidence-v1) | State-Transition Semantics | 315 | `sha256:ead8095a81ee48e74190abe6541bf069075d94dbb900d5dce6a1755cc18fcd7f` | `sha256:ab4c82a55c0bb146168cd5c3e06ed2437036cc484f696da129f2d937d402fa33` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.data-flow-slice.v1`](#query-result-authoring-data-flow-slice-v1) | Data-Flow Slice | 693 | `sha256:93b7ed049ac305c55e6cd12a887b18f5a594e603c2b930996db52058b54a29bb` | `sha256:eef7c78e95de10d9ae44392513b2aa58dd8deaa8ef2070ac429fa022732fc5e4` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.authority-overlap.v1`](#query-result-authoring-authority-overlap-v1) | Existing Authority Overlap | 6870 | `sha256:9be4fb88b4dc0cc75eea562b505a03ab159223bacb14d98809a9c74086e70397` | `sha256:53487eb859ef187e496e92b417aa0ddaf91bb55a7113c988e886628a3dca2cf7` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.scenario-context.v1`](#query-result-authoring-scenario-context-v1) | Feature and Scenario Context | 6870 | `sha256:97b4eb2ae7b3a88a110536b2a42857be7834f14e5efe6f2386f330e85c461f36` | `sha256:596fcf09846f061532ff0b23ab7ed40ad4b6aeb0f159bbb81671841288b11e7e` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.projection-target.v1`](#query-result-authoring-projection-target-v1) | Projection Target Evidence | 693 | `sha256:10dd92a9a30e97cac4ed07f7bdc5c501de66ced1d0e732a86e659e7d1dcf1505` | `sha256:0f8c770f5e2d848b12fc957e364e5a984364caa29ee8727bb3c3f075231d60ba` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.proof-vector-candidates.v1`](#query-result-authoring-proof-vector-candidates-v1) | Equivalence and Proof Candidates | 693 | `sha256:3116890ff31c7b4c5a80c14a67253c9f6312b023eecb25ea3fff8f9382ca4308` | `sha256:587907fcfac7cea8fcee0676833af09cd82dabaa1c9e7e18b1135af237d09f96` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.contract-map.v1`](#query-result-authoring-contract-map-v1) | Authority Contract Map | 23 | `sha256:2cab84afc1cf2e4d424570646d118218f21b67d5012f16f5c50afde84898a08a` | `sha256:c937a111b29f531e9648da3292d3cadc4534582833828b93e2f9d70e388f50c5` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | Semantic Authority Evidence Bundle | 6870 | `sha256:3348a52e9913d17e1a2b1e9b9020c60a879e3d9107aa5673643cb49b3e9260ca` | `sha256:c0d8a8c82eed6854b2d4297504b1394c8d4afe1a26ecc569574b59545d5491df` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.readiness.v1`](#query-result-authoring-readiness-v1) | Authoring Readiness | 6870 | `sha256:3be2d3d609c7431f172b6d174112f5f225fe9471c92b5cb96099181c51471470` | `sha256:b3a8d0e3f1019924369a1b2381ea26357842d756023057a86f3812b793eb61a0` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) | Authority Authoring Reconciliation | 1 | `sha256:326068c7279d28afe22f7ed87720a096fc7d1e1d0cd70604e89a034a56185dfd` | `sha256:6f7010d848ccc2ed1b803da9dcd33e646a15c0df66271b5a409cc7f323d145ee` | `RELATIONAL_QUERY_EXECUTED` |

### Drill-Down Query Register

| Parent query | Depth | Next query | Parameter bindings | Purpose |
|---|---:|---|---|---|
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | 0 | [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | none | Inspect canonical features |
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | 0 | [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | none | Inspect canonical scenarios |
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | 0 | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | `posture=FEATURE_COVERAGE_MISSING` | Group mechanics without lineage |
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | 0 | [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | none | Inspect unresolved responsibility clusters |
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | 0 | [`authority.documents.v1`](#query-result-authority-documents-v1) | none | Inspect authority lineage |
| [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | 0 | [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | none | Inspect scenarios |
| [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | 0 | [`scenario-conformance.by-structural-status.v1`](#query-result-scenario-conformance-by-structural-status-v1) | none | Filter by structural status |
| [`feature-coverage.proposal-evidence.v1`](#query-result-feature-coverage-proposal-evidence-v1) | 0 | [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | none | Inspect grounding responsibility cluster |
| [`feature-coverage.live-inference.v1`](#query-result-feature-coverage-live-inference-v1) | 0 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | none | Inspect inference source evidence |
| [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) | 0 | [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | none | Inspect individual cluster |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | 0 | [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | none | Inspect scenario responsibilities |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | 0 | [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | none | Inspect scenario call paths |
| [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) | 0 | [`authority.documents.v1`](#query-result-authority-documents-v1) | none | Inspect authority without lineage |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | 0 | [`feature-coverage.unlined-mechanics-by-file.v1`](#query-result-feature-coverage-unlined-mechanics-by-file-v1) | none | Group by file |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | 0 | [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | none | Group by responsibility |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | 0 | [`feature-coverage.unlined-mechanics-by-symbol.v1`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1) | none | Group by symbol |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | 0 | [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | none | Inspect exact occurrences |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | 0 | [`subject-boundary.items-by-disposition.v1`](#query-result-subject-boundary-items-by-disposition-v1) | none | Inspect included and excluded items |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | 0 | [`subject-boundary.included-items.v1`](#query-result-subject-boundary-included-items-v1) | none | Inspect included items |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | 0 | [`subject-boundary.excluded-items.v1`](#query-result-subject-boundary-excluded-items-v1) | none | Inspect excluded items |
| [`cli.traceability-summary.v1`](#query-result-cli-traceability-summary-v1) | 0 | [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) | none | Inspect CLI roots |
| [`cli.traceability-summary.v1`](#query-result-cli-traceability-summary-v1) | 0 | [`cli.callable-inventory.v1`](#query-result-cli-callable-inventory-v1) | none | Inspect classified runtime callables |
| [`cli.traceability-summary.v1`](#query-result-cli-traceability-summary-v1) | 0 | [`cli.unreachable-callables.v1`](#query-result-cli-unreachable-callables-v1) | none | Inspect NO_CLI_REACHABILITY remainder |
| [`cli.entry-points.v1`](#query-result-cli-entry-points-v1) | 0 | [`cli.entry-point-reachability.v1`](#query-result-cli-entry-point-reachability-v1) | `entryPointId=:entryPointId` | Inspect complete reachable graph slice |
| [`cli.callable-inventory.v1`](#query-result-cli-callable-inventory-v1) | 0 | [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1) | `symbolId=:symbolId` | Inspect justifying CLI commands |
| [`cli.callable-inventory.v1`](#query-result-cli-callable-inventory-v1) | 0 | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | `symbolId=:symbolId` | Inspect removal impact |
| [`cli.entry-point-reachability.v1`](#query-result-cli-entry-point-reachability-v1) | 1 | [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1) | `symbolId=:symbolId` | Invert reachability to originating commands |
| [`cli.shared-reachability.v1`](#query-result-cli-shared-reachability-v1) | 1 | [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1) | `symbolId=:symbolId` | Inspect sharing CLI commands |
| [`cli.runtime-resolution-debt.v1`](#query-result-cli-runtime-resolution-debt-v1) | 1 | [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | `symbolId=:symbolId` | Inspect candidate callers |
| [`cli.reachable-source-facts.v1`](#query-result-cli-reachable-source-facts-v1) | 2 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `occurrenceId=:occurrenceId` | Inspect exact physical source |
| [`cli.unreachable-callables.v1`](#query-result-cli-unreachable-callables-v1) | 1 | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | `symbolId=:symbolId` | Inspect deterministic removal impact |
| [`cli.unreachable-source-facts.v1`](#query-result-cli-unreachable-source-facts-v1) | 2 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `occurrenceId=:occurrenceId` | Inspect exact physical source |
| [`cli.unreachable-source-facts.v1`](#query-result-cli-unreachable-source-facts-v1) | 2 | [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | `symbolId=:symbolId` | Inspect owner removal impact |
| [`cli.symbol-originating-commands.v1`](#query-result-cli-symbol-originating-commands-v1) | 2 | [`cli.entry-point-reachability.v1`](#query-result-cli-entry-point-reachability-v1) | `entryPointId=:entryPointId`, `symbolId=:symbolId` | Inspect complete path |
| [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | 3 | [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | `symbolId=:symbolId` | Inspect callers |
| [`cli.unreachable-removal-impact.v1`](#query-result-cli-unreachable-removal-impact-v1) | 3 | [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | `symbolId=:symbolId` | Inspect callees |
| [`interface.summary.v1`](#query-result-interface-summary-v1) | 0 | [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | none | Inspect CLI commands and feature access |
| [`interface.summary.v1`](#query-result-interface-summary-v1) | 0 | [`interface.authority-gaps.v1`](#query-result-interface-authority-gaps-v1) | none | Inspect CLI governance gaps |
| [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | 1 | [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | `symbolId=:entryPointId` | Inspect command execution paths |
| [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | 1 | [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | `featureId=:featureId` | Inspect accessible canonical features |
| [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | 1 | [`interface.authority-gaps.v1`](#query-result-interface-authority-gaps-v1) | `commandName=:commandName` | Inspect interface authority gaps |
| [`interface.authority-gaps.v1`](#query-result-interface-authority-gaps-v1) | 2 | [`interface.cli-commands.v1`](#query-result-interface-cli-commands-v1) | `commandName=:commandName` | Inspect command evidence |
| [`interface.authority-gaps.v1`](#query-result-interface-authority-gaps-v1) | 2 | [`authority.documents.v1`](#query-result-authority-documents-v1) | none | Inspect canonical authority |
| [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | 1 | [`feature-coverage.feature-scenarios.v1`](#query-result-feature-coverage-feature-scenarios-v1) | `featureId=:featureId` | Inspect feature scenarios |
| [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | 1 | [`authority.documents.v1`](#query-result-authority-documents-v1) | `featureId=:featureId` | Inspect feature authority |
| [`feature-coverage.feature-scenarios.v1`](#query-result-feature-coverage-feature-scenarios-v1) | 2 | [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | `featureId=:featureId` | Inspect responsibilities |
| [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | 1 | [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | `scenarioId=:scenarioId` | Inspect responsibility/obligation cardinality |
| [`scenario-conformance.by-structural-status.v1`](#query-result-scenario-conformance-by-structural-status-v1) | 1 | [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | `scenarioId=:scenarioId` | Inspect blockers and responsibility evidence |
| [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | 2 | [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | `scenarioId=:scenarioId` | Inspect originating interfaces |
| [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | 2 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `modulePath=:bodyFile` | Inspect body source evidence |
| [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | 3 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `symbolId=:symbolId` | Inspect source evidence |
| [`feature-coverage.unlined-mechanics-by-file.v1`](#query-result-feature-coverage-unlined-mechanics-by-file-v1) | 2 | [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | `mechanic=:mechanic`, `modulePath=:modulePath` | Inspect responsibilities |
| [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | 2 | [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | `symbolName=:responsibility` | Inspect interface reachability |
| [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | 2 | [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | `responsibility=:responsibility` | Inspect occurrences |
| [`feature-coverage.unlined-mechanics-by-symbol.v1`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1) | 2 | [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | `symbolId=:symbolId` | Inspect entry surfaces |
| [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | 3 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `occurrenceId=:occurrenceId` | Inspect physical source references |
| [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | 5 | [`impact.source-reference-reverse-impact.v1`](#query-result-impact-source-reference-reverse-impact-v1) | `sourceReferenceId=:sourceReferenceId` | Inspect reverse semantic impact |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | 3 | [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | `symbolId=:symbolId` | Inspect callers |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | 3 | [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | `symbolId=:symbolId` | Inspect callees |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | 3 | [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | `symbolId=:symbolId` | Inspect semantic context |
| [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | 3 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `sourceReferenceId=:sourceReferenceId` | Inspect call-site source |
| [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | 3 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `sourceReferenceId=:sourceReferenceId` | Inspect call-site source |
| [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | 2 | [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | `symbolName=:responsibility` | Inspect entry surfaces |
| [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | 2 | [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | `symbolName=:responsibility` | Inspect nearby authority |
| [`authority.documents.v1`](#query-result-authority-documents-v1) | 4 | [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | `authorityFile=:authorityFile` | Inspect bound symbols and occurrences |
| [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | 4 | [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | `occurrenceId=:occurrenceId` | Inspect physical evidence |
| [`subject-boundary.items-by-disposition.v1`](#query-result-subject-boundary-items-by-disposition-v1) | 1 | [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | `itemId=:itemId` | Inspect exact inclusion or exclusion reason |
| [`subject-boundary.included-items.v1`](#query-result-subject-boundary-included-items-v1) | 1 | [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | `itemId=:itemId` | Inspect inclusion reason |
| [`subject-boundary.excluded-items.v1`](#query-result-subject-boundary-excluded-items-v1) | 1 | [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | `itemId=:itemId` | Inspect exclusion reason |
| [`impact.source-reference-reverse-impact.v1`](#query-result-impact-source-reference-reverse-impact-v1) | 6 | [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | `sourceReferenceId=:sourceReferenceId` | Inspect missing lineage and healing candidates |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Build authority evidence bundle |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.scenario-context.v1`](#query-result-authoring-scenario-context-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Inspect inferred feature/scenario context |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.decision-evidence.v1`](#query-result-authoring-decision-evidence-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Inspect decision policy |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.object-shape-evidence.v1`](#query-result-authoring-object-shape-evidence-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Inspect data shapes |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.failure-policy-evidence.v1`](#query-result-authoring-failure-policy-evidence-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Inspect failure behavior |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.authority-overlap.v1`](#query-result-authoring-authority-overlap-v1) | `occurrenceId=:occurrenceId`, `symbolId=:symbolId` | Inspect existing authority overlap |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.projection-target.v1`](#query-result-authoring-projection-target-v1) | `symbolId=:symbolId` | Build projection target |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | 6 | [`authoring.proof-vector-candidates.v1`](#query-result-authoring-proof-vector-candidates-v1) | `symbolId=:symbolId` | Build proof vectors |
| [`authoring.interface-execution-slice.v1`](#query-result-authoring-interface-execution-slice-v1) | 3 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.responsibility-body-evidence.v1`](#query-result-authoring-responsibility-body-evidence-v1) | 4 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.decision-evidence.v1`](#query-result-authoring-decision-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.fallback-evidence.v1`](#query-result-authoring-fallback-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.validation-evidence.v1`](#query-result-authoring-validation-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.failure-policy-evidence.v1`](#query-result-authoring-failure-policy-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.object-shape-evidence.v1`](#query-result-authoring-object-shape-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.result-contract-evidence.v1`](#query-result-authoring-result-contract-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.serialization-evidence.v1`](#query-result-authoring-serialization-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.normalization-evidence.v1`](#query-result-authoring-normalization-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.iteration-evidence.v1`](#query-result-authoring-iteration-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.state-transition-evidence.v1`](#query-result-authoring-state-transition-evidence-v1) | 5 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.data-flow-slice.v1`](#query-result-authoring-data-flow-slice-v1) | 4 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.authority-overlap.v1`](#query-result-authoring-authority-overlap-v1) | 4 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.scenario-context.v1`](#query-result-authoring-scenario-context-v1) | 4 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.projection-target.v1`](#query-result-authoring-projection-target-v1) | 6 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.proof-vector-candidates.v1`](#query-result-authoring-proof-vector-candidates-v1) | 6 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.contract-map.v1`](#query-result-authoring-contract-map-v1) | 4 | [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | `symbolId=:symbolId`, `occurrenceId=:occurrenceId` | Build complete authority-authoring bundle |
| [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | 6 | [`authoring.readiness.v1`](#query-result-authoring-readiness-v1) | `occurrenceId=:occurrenceId` | Inspect deterministic readiness |
| [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) | 0 | [`authoring.readiness.v1`](#query-result-authoring-readiness-v1) | none | Inspect every candidate readiness disposition |

### Registered Queries and Results

<a id="query-result-feature-coverage-summary-v1"></a>

#### `feature-coverage.summary.v1`

| Binding | Value |
|---|---|
| Purpose | Executive Summary |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` |
| Result hash | `sha256:639a627077574b6d019020d1b42389fea5a176484a9113a77093a7437be558eb` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-summary-v1.json) |
| Next queries | [`Inspect canonical features`](#query-result-feature-coverage-features-v1)<br>[`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1)<br>[`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING`<br>[`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1)<br>[`Inspect authority lineage`](#query-result-authority-documents-v1) |

```sql
SELECT * FROM reportFeatureCoverageSummary
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "canonicalFeatures": 4,
    "proposedFeatures": 0,
    "canonicalScenarios": 6,
    "proposedScenarios": 0,
    "scenarios": 6,
    "fullyConformantScenarios": 0,
    "scenariosStructurallyClosed": 2,
    "scenariosStructurallyIncomplete": 0,
    "scenariosStructuralStatusNotEvaluated": 4,
    "scenariosExecutionEvaluated": 0,
    "scenariosRuntimeNotEvaluated": 6,
    "scenariosWithLineageQualityFindings": 2,
    "featureProposalsPendingReview": 0,
    "unresolvedEvidenceClusters": 701,
    "supportingImplementationClusters": 47,
    "responsibilityEvidenceClusters": 654,
    "confirmedFeatureCandidateClusters": 0,
    "capabilityRelationsProposed": 0,
    "liveInferenceEvaluations": 0,
    "duplicateProposalsPrevented": 0,
    "mechanicsWithCanonicalLineage": 0,
    "mechanicsWithProposedLineage": 158,
    "mechanicsWithAmbiguousLineage": 0,
    "mechanicsWithoutLineage": 6860,
    "authorityWithCanonicalLineage": 2,
    "authorityWithProposedLineage": 0,
    "authorityWithAmbiguousLineage": 0,
    "authorityWithoutLineage": 10,
    "unclassifiedMechanics": 6860,
    "byPosture": {
      "FEATURE_COVERAGE_MISSING": 6860,
      "FEATURE_COVERAGE_PROPOSED": 158
    },
    "authorityByPosture": {
      "FEATURE_COVERAGE_MISSING": 10,
      "FEATURE_COVERED": 2
    }
  }
]
```

</details>

<details><summary>Inspect 33 rendered claim pointer(s) inline</summary>

- `/featureCoverage/summary/canonicalFeatures` ← `/rows/0/canonicalFeatures` (DIRECT_FACT)
- `/featureCoverage/summary/proposedFeatures` ← `/rows/0/proposedFeatures` (DIRECT_FACT)
- `/featureCoverage/summary/canonicalScenarios` ← `/rows/0/canonicalScenarios` (DIRECT_FACT)
- `/featureCoverage/summary/proposedScenarios` ← `/rows/0/proposedScenarios` (DIRECT_FACT)
- `/featureCoverage/summary/scenarios` ← `/rows/0/scenarios` (DIRECT_FACT)
- `/featureCoverage/summary/fullyConformantScenarios` ← `/rows/0/fullyConformantScenarios` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosStructurallyClosed` ← `/rows/0/scenariosStructurallyClosed` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosStructurallyIncomplete` ← `/rows/0/scenariosStructurallyIncomplete` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosStructuralStatusNotEvaluated` ← `/rows/0/scenariosStructuralStatusNotEvaluated` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosExecutionEvaluated` ← `/rows/0/scenariosExecutionEvaluated` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosRuntimeNotEvaluated` ← `/rows/0/scenariosRuntimeNotEvaluated` (DIRECT_FACT)
- `/featureCoverage/summary/scenariosWithLineageQualityFindings` ← `/rows/0/scenariosWithLineageQualityFindings` (DIRECT_FACT)
- `/featureCoverage/summary/featureProposalsPendingReview` ← `/rows/0/featureProposalsPendingReview` (DIRECT_FACT)
- `/featureCoverage/summary/unresolvedEvidenceClusters` ← `/rows/0/unresolvedEvidenceClusters` (DIRECT_FACT)
- `/featureCoverage/summary/supportingImplementationClusters` ← `/rows/0/supportingImplementationClusters` (DIRECT_FACT)
- `/featureCoverage/summary/responsibilityEvidenceClusters` ← `/rows/0/responsibilityEvidenceClusters` (DIRECT_FACT)
- `/featureCoverage/summary/confirmedFeatureCandidateClusters` ← `/rows/0/confirmedFeatureCandidateClusters` (DIRECT_FACT)
- `/featureCoverage/summary/capabilityRelationsProposed` ← `/rows/0/capabilityRelationsProposed` (DIRECT_FACT)
- `/featureCoverage/summary/liveInferenceEvaluations` ← `/rows/0/liveInferenceEvaluations` (DIRECT_FACT)
- `/featureCoverage/summary/duplicateProposalsPrevented` ← `/rows/0/duplicateProposalsPrevented` (DIRECT_FACT)
- `/featureCoverage/summary/mechanicsWithCanonicalLineage` ← `/rows/0/mechanicsWithCanonicalLineage` (DIRECT_FACT)
- `/featureCoverage/summary/mechanicsWithProposedLineage` ← `/rows/0/mechanicsWithProposedLineage` (DIRECT_FACT)
- `/featureCoverage/summary/mechanicsWithAmbiguousLineage` ← `/rows/0/mechanicsWithAmbiguousLineage` (DIRECT_FACT)
- `/featureCoverage/summary/mechanicsWithoutLineage` ← `/rows/0/mechanicsWithoutLineage` (DIRECT_FACT)
- `/featureCoverage/summary/authorityWithCanonicalLineage` ← `/rows/0/authorityWithCanonicalLineage` (DIRECT_FACT)
- `/featureCoverage/summary/authorityWithProposedLineage` ← `/rows/0/authorityWithProposedLineage` (DIRECT_FACT)
- `/featureCoverage/summary/authorityWithAmbiguousLineage` ← `/rows/0/authorityWithAmbiguousLineage` (DIRECT_FACT)
- `/featureCoverage/summary/authorityWithoutLineage` ← `/rows/0/authorityWithoutLineage` (DIRECT_FACT)
- `/featureCoverage/summary/unclassifiedMechanics` ← `/rows/0/unclassifiedMechanics` (DIRECT_FACT)
- `/featureCoverage/summary/byPosture/FEATURE_COVERAGE_MISSING` ← `/rows/0/byPosture/FEATURE_COVERAGE_MISSING` (DIRECT_FACT)
- `/featureCoverage/summary/byPosture/FEATURE_COVERAGE_PROPOSED` ← `/rows/0/byPosture/FEATURE_COVERAGE_PROPOSED` (DIRECT_FACT)
- `/featureCoverage/summary/authorityByPosture/FEATURE_COVERAGE_MISSING` ← `/rows/0/authorityByPosture/FEATURE_COVERAGE_MISSING` (DIRECT_FACT)
- `/featureCoverage/summary/authorityByPosture/FEATURE_COVERED` ← `/rows/0/authorityByPosture/FEATURE_COVERED` (DIRECT_FACT)

</details>

<a id="query-result-scenario-conformance-summary-v1"></a>

#### `scenario-conformance.summary.v1`

| Binding | Value |
|---|---|
| Purpose | Executive Summary |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b230d306d1b6235c356f228a8fbe154b94ded15c1d017b8459b2c4db455fc944` |
| Result hash | `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-summary-v1.json) |
| Next queries | [`Inspect scenarios`](#query-result-scenario-conformance-scenarios-v1)<br>[`Filter by structural status`](#query-result-scenario-conformance-by-structural-status-v1) |

```sql
SELECT * FROM reportScenarioConformanceSummary
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "lineageDocumentsDiscovered": 2,
    "featuresDiscovered": 4,
    "scenariosDiscovered": 6,
    "obligationsDiscovered": 6,
    "responsibilitiesDiscovered": 10,
    "scenariosStructurallyClosed": 2,
    "scenariosStructurallyIncomplete": 0,
    "scenariosStructuralStatusNotEvaluated": 4,
    "scenariosExecutionEvaluated": 0,
    "scenariosConformant": 0,
    "scenariosWithLineageQualityFindings": 2,
    "byStructuralStatus": {
      "STRUCTURALLY_CLOSED": 2,
      "STRUCTURAL_STATUS_NOT_EVALUATED": 4
    },
    "byRuntimeConformance": {
      "NOT_EVALUATED": 6
    },
    "byStructuralBlocker": {},
    "byEvaluationLimit": {
      "BODY_NOT_STATICALLY_OBSERVED": 1,
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT": 2,
      "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT": 1
    },
    "byLineageQualityFinding": {
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW": 1,
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP": 1,
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES": 1
    }
  }
]
```

</details>

<details><summary>Inspect 20 rendered claim pointer(s) inline</summary>

- `/scenarioConformance/summary/lineageDocumentsDiscovered` ← `/rows/0/lineageDocumentsDiscovered` (CLASSIFICATION)
- `/scenarioConformance/summary/featuresDiscovered` ← `/rows/0/featuresDiscovered` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosDiscovered` ← `/rows/0/scenariosDiscovered` (CLASSIFICATION)
- `/scenarioConformance/summary/obligationsDiscovered` ← `/rows/0/obligationsDiscovered` (CLASSIFICATION)
- `/scenarioConformance/summary/responsibilitiesDiscovered` ← `/rows/0/responsibilitiesDiscovered` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosStructurallyClosed` ← `/rows/0/scenariosStructurallyClosed` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosStructurallyIncomplete` ← `/rows/0/scenariosStructurallyIncomplete` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosStructuralStatusNotEvaluated` ← `/rows/0/scenariosStructuralStatusNotEvaluated` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosExecutionEvaluated` ← `/rows/0/scenariosExecutionEvaluated` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosConformant` ← `/rows/0/scenariosConformant` (CLASSIFICATION)
- `/scenarioConformance/summary/scenariosWithLineageQualityFindings` ← `/rows/0/scenariosWithLineageQualityFindings` (CLASSIFICATION)
- `/scenarioConformance/summary/byStructuralStatus/STRUCTURALLY_CLOSED` ← `/rows/0/byStructuralStatus/STRUCTURALLY_CLOSED` (CLASSIFICATION)
- `/scenarioConformance/summary/byStructuralStatus/STRUCTURAL_STATUS_NOT_EVALUATED` ← `/rows/0/byStructuralStatus/STRUCTURAL_STATUS_NOT_EVALUATED` (CLASSIFICATION)
- `/scenarioConformance/summary/byRuntimeConformance/NOT_EVALUATED` ← `/rows/0/byRuntimeConformance/NOT_EVALUATED` (CLASSIFICATION)
- `/scenarioConformance/summary/byEvaluationLimit/BODY_NOT_STATICALLY_OBSERVED` ← `/rows/0/byEvaluationLimit/BODY_NOT_STATICALLY_OBSERVED` (CLASSIFICATION)
- `/scenarioConformance/summary/byEvaluationLimit/BODY_NOT_EVALUATED_OUTSIDE_SUBJECT` ← `/rows/0/byEvaluationLimit/BODY_NOT_EVALUATED_OUTSIDE_SUBJECT` (CLASSIFICATION)
- `/scenarioConformance/summary/byEvaluationLimit/AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT` ← `/rows/0/byEvaluationLimit/AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT` (CLASSIFICATION)
- `/scenarioConformance/summary/byLineageQualityFinding/MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` ← `/rows/0/byLineageQualityFinding/MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` (CLASSIFICATION)
- `/scenarioConformance/summary/byLineageQualityFinding/PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` ← `/rows/0/byLineageQualityFinding/PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` (CLASSIFICATION)
- `/scenarioConformance/summary/byLineageQualityFinding/IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` ← `/rows/0/byLineageQualityFinding/IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` (CLASSIFICATION)

</details>

<a id="query-result-feature-coverage-proposal-evidence-v1"></a>

#### `feature-coverage.proposal-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Feature Coverage Proposals |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:24a7bd5de2d4710e8917e12ac89f18418667b3ed56690d4a93dcc04c09b11411` |
| Result hash | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| Rows | 0 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-proposal-evidence-v1.json) |
| Next queries | [`Inspect grounding responsibility cluster`](#query-result-responsibility-evidence-cluster-by-id-v1) |

```sql
SELECT * FROM reportFeatureCoverageProposals ORDER BY featureId
```

<details><summary>Inspect 0 result row(s) inline</summary>

```json
[]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-live-inference-v1"></a>

#### `feature-coverage.live-inference.v1`

| Binding | Value |
|---|---|
| Purpose | Live LLM Feature-Inference Evaluations |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6d426be0037939f720654e271d2debfe3737345106909d22a6ef600b792c0bbc` |
| Result hash | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` |
| Rows | 0 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-live-inference-v1.json) |
| Next queries | [`Inspect inference source evidence`](#query-result-source-facts-occurrence-source-references-v1) |

```sql
SELECT * FROM reportLiveInferenceEvaluations ORDER BY featureId, evaluationFile
```

<details><summary>Inspect 0 result row(s) inline</summary>

```json
[]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unresolved-clusters-v1"></a>

#### `feature-coverage.unresolved-clusters.v1`

| Binding | Value |
|---|---|
| Purpose | Unresolved Responsibility Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` |
| Result hash | `sha256:d5b1cb3199c241da8e1ad57307c0e4fa588e4f49dc80d4014dfec4da718b4d62` |
| Rows | 701 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json) |
| Next queries | [`Inspect individual cluster`](#query-result-responsibility-evidence-cluster-by-id-v1) |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters ORDER BY modulePath, responsibility
```

Full 701-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

Full 8705-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

<a id="query-result-scenario-conformance-drilldown-v1"></a>

#### `scenario-conformance.drilldown.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Feature Drill-Down |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:63140f2c93dfaff428cf1792965fca681c1dc8459b409af57bac1ed680df6edb` |
| Result hash | `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf` |
| Rows | 4 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-drilldown-v1.json) |
| Next queries | [`Inspect scenario responsibilities`](#query-result-scenario-conformance-scenario-responsibilities-v1)<br>[`Inspect scenario call paths`](#query-result-scenario-conformance-scenario-call-paths-v1) |

```sql
SELECT * FROM reportCanonicalFeatureDrilldown ORDER BY featureId
```

<details><summary>Inspect 4 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "purpose": "Delegate the admitted console mechanics to helper authorities and runtime dependencies.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classifications": [
      {
        "relationship": "SOURCE_LINEAGE_CLASSIFICATION",
        "classificationId": "serves-query-console"
      }
    ],
    "lineageQualityFindings": [],
    "scenarios": [
      {
        "scenarioId": "delegate-console-mechanics",
        "purpose": "The console body delegates routing, validation, and snippet extraction to admitted authorities.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURALLY_CLOSED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [],
        "lineageQualityFindings": [],
        "obligations": [
          {
            "obligationId": "console-delegates-mechanics",
            "statement": "The console source body must delegate admitted mechanics to authority surfaces.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [],
            "responsibilities": [
              {
                "responsibilityId": "console-authority-bundles.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "console-authority-bundles.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/console-authority-bundles.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "TRANSITIVE_DATA_AND_RUNTIME",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": []
              }
            ]
          }
        ]
      }
    ],
    "scenarioCount": 1,
    "responsibilityCount": 1,
    "structurallyClosedCount": 1,
    "runtimeConformantCount": 0,
    "lineageQualityFindingCount": 0,
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect feature scenarios",
        "parameterBindings": {
          "featureId": "delegate-console-authority"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect feature call paths",
        "parameterBindings": {
          "featureId": "delegate-console-authority"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "purpose": "Project a governed contract draft from the current authority and source-fact evidence.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classifications": [
      {
        "relationship": "SOURCE_LINEAGE_CLASSIFICATION",
        "classificationId": "serves-query-console"
      }
    ],
    "lineageQualityFindings": [
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
    ],
    "scenarios": [
      {
        "scenarioId": "project-governed-console-contract",
        "purpose": "The translator emits a governed contract draft without hand-authoring the contract bytes.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURALLY_CLOSED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [],
        "lineageQualityFindings": [
          "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
          "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
        ],
        "obligations": [
          {
            "obligationId": "console-contract-is-projected",
            "statement": "The console governed contract must be projected from source facts and admitted authority data.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [
              "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
              "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
            ],
            "responsibilities": [
              {
                "responsibilityId": "console-routing-adapter.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "console-routing-adapter.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/console-routing-adapter.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "DIRECT_DATA_AND_RUNTIME",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": []
              },
              {
                "responsibilityId": "console-validation-adapter.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "console-validation-adapter.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/console-validation-adapter.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "TRANSITIVE_DATA_AND_RUNTIME",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": []
              },
              {
                "responsibilityId": "console-snippet-adapter.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "console-snippet-adapter.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/console-snippet-adapter.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "DIRECT_DATA_AND_RUNTIME",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": []
              }
            ]
          }
        ]
      }
    ],
    "scenarioCount": 1,
    "responsibilityCount": 3,
    "structurallyClosedCount": 1,
    "runtimeConformantCount": 0,
    "lineageQualityFindingCount": 2,
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect feature scenarios",
        "parameterBindings": {
          "featureId": "project-console-contract"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect feature call paths",
        "parameterBindings": {
          "featureId": "project-console-contract"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "purpose": "Render a governed message from declared contract meaning.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "classifications": [
      {
        "relationship": "SOURCE_LINEAGE_CLASSIFICATION",
        "classificationId": "governed-message-artifact-family"
      }
    ],
    "lineageQualityFindings": [],
    "scenarios": [
      {
        "scenarioId": "project-a-declared-message",
        "purpose": "A declared message value is projected into canonical output.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [
          "BODY_NOT_STATICALLY_OBSERVED"
        ],
        "lineageQualityFindings": [],
        "obligations": [
          {
            "obligationId": "produce-one-canonical-message",
            "statement": "Exactly one canonical message must be produced from declared semantic authority.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [],
            "responsibilities": [
              {
                "responsibilityId": "executes-message-projection",
                "responsibilityType": "semantic-execution",
                "artifactId": "message-projector.v1",
                "authorityFile": "contracts/serves-query-console.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/project-message.mjs",
                "bodyStatus": "BODY_NOT_STATICALLY_OBSERVED",
                "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "BODY_NOT_STATICALLY_OBSERVED"
                ]
              }
            ]
          }
        ]
      },
      {
        "scenarioId": "run-the-message-command",
        "purpose": "The projected message is emitted through the declared command port.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [
          "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
        ],
        "lineageQualityFindings": [],
        "obligations": [
          {
            "obligationId": "emit-the-message-once",
            "statement": "The command must emit the projected message exactly once.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [],
            "responsibilities": [
              {
                "responsibilityId": "entry-point-for-message-command",
                "responsibilityType": "command-entry",
                "artifactId": "message-command.v1",
                "authorityFile": "contracts/serves-query-console.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "bin/run-message.mjs",
                "bodyStatus": "BODY_OUTSIDE_REPORT_SUBJECT",
                "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
                ]
              }
            ]
          }
        ]
      },
      {
        "scenarioId": "verify-the-projected-message",
        "purpose": "The projected message is proved against its declared expectation.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [
          "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
        ],
        "lineageQualityFindings": [],
        "obligations": [
          {
            "obligationId": "prove-the-message-conforms",
            "statement": "Verification must prove the projected message conforms.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [],
            "responsibilities": [
              {
                "responsibilityId": "evaluates-message-proof",
                "responsibilityType": "proof-evaluation",
                "artifactId": "message-verification.v1",
                "authorityFile": "contracts/serves-query-console.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "verification/verifies-message.mjs",
                "bodyStatus": "BODY_OUTSIDE_REPORT_SUBJECT",
                "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
                ]
              }
            ]
          }
        ]
      }
    ],
    "scenarioCount": 3,
    "responsibilityCount": 3,
    "structurallyClosedCount": 0,
    "runtimeConformantCount": 0,
    "lineageQualityFindingCount": 0,
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect feature scenarios",
        "parameterBindings": {
          "featureId": "project-governed-messages"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect feature call paths",
        "parameterBindings": {
          "featureId": "project-governed-messages"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "purpose": "Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classifications": [
      {
        "relationship": "SOURCE_LINEAGE_CLASSIFICATION",
        "classificationId": "serves-query-console"
      }
    ],
    "lineageQualityFindings": [
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
    ],
    "scenarios": [
      {
        "scenarioId": "serve-console-over-loopback",
        "purpose": "The console binds only to loopback and serves query, index, and snippet responses.",
        "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
        "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
        "runtimeConformance": "NOT_EVALUATED",
        "structuralBlockers": [],
        "evaluationLimits": [
          "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
        ],
        "lineageQualityFindings": [
          "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
        ],
        "obligations": [
          {
            "obligationId": "console-serves-loopback-only",
            "statement": "The console server must bind only to the loopback interface.",
            "authorityStatus": "AUTHORITY_DECLARED",
            "lineageQualityFindings": [
              "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
            ],
            "responsibilities": [
              {
                "responsibilityId": "serves-query-console.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "serves-query-console.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/serves-query-console.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
                ]
              },
              {
                "responsibilityId": "serves-query-console-conformant.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "serves-query-console-conformant.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/serves-query-console.conformant.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
                ]
              },
              {
                "responsibilityId": "serves-query-console-projected.v1.responsibility.v1",
                "responsibilityType": "semantic-execution",
                "artifactId": "serves-query-console-projected.v1",
                "authorityFile": "contracts/serves-query-console.governed.contract.json",
                "bindingStatus": "BINDING_DECLARED",
                "bodyFile": "src/console/serves-query-console.projected.mjs",
                "bodyStatus": "BODY_STATICALLY_OBSERVED",
                "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
                "observedMechanics": 0,
                "mechanicsByType": {},
                "executionStatus": "EXECUTION_NOT_EVALUATED",
                "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
                "structuralBlockers": [],
                "evaluationLimits": [
                  "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
                ]
              }
            ]
          }
        ]
      }
    ],
    "scenarioCount": 1,
    "responsibilityCount": 3,
    "structurallyClosedCount": 0,
    "runtimeConformantCount": 0,
    "lineageQualityFindingCount": 1,
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect feature scenarios",
        "parameterBindings": {
          "featureId": "serve-query-console"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect feature call paths",
        "parameterBindings": {
          "featureId": "serve-query-console"
        }
      }
    ]
  }
]
```

</details>

Full 197-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/scenario-conformance-drilldown-v1.json).

<a id="query-result-feature-coverage-unclassified-inventory-v1"></a>

#### `feature-coverage.unclassified-inventory.v1`

| Binding | Value |
|---|---|
| Purpose | Evidence Without Canonical Lineage |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` |
| Result hash | `sha256:27bac21b1887ed1eed6be6c16e284e079c9c49e99eeaa4dcc94b37b3c06c11ca` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unclassified-inventory-v1.json) |
| Next queries | [`Inspect authority without lineage`](#query-result-authority-documents-v1) |

```sql
SELECT * FROM reportUnclassifiedInventory
```

Full 1-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unclassified-inventory-v1.json).

<details><summary>Inspect 27 rendered claim pointer(s) inline</summary>

- `/unclassifiedInventory/mechanicsByLineageDisposition/NO_SCENARIO_LINEAGE` ← `/rows/0/mechanicsByLineageDisposition/NO_SCENARIO_LINEAGE` (DIRECT_FACT)
- `/unclassifiedInventory/mechanicsByLineageDisposition/LINEAGE_INFERRED_PENDING_REVIEW` ← `/rows/0/mechanicsByLineageDisposition/LINEAGE_INFERRED_PENDING_REVIEW` (DIRECT_FACT)
- `/unclassifiedInventory/mechanicsByFeatureCoveragePosture/FEATURE_COVERAGE_MISSING` ← `/rows/0/mechanicsByFeatureCoveragePosture/FEATURE_COVERAGE_MISSING` (DIRECT_FACT)
- `/unclassifiedInventory/mechanicsByFeatureCoveragePosture/FEATURE_COVERAGE_PROPOSED` ← `/rows/0/mechanicsByFeatureCoveragePosture/FEATURE_COVERAGE_PROPOSED` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocumentCount` ← `/rows/0/unclassifiedAuthorityDocumentCount` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/0/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/0/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/0/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/0/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/1/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/1/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/1/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/1/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/2/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/2/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/2/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/2/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/3/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/3/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/3/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/3/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/4/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/4/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/4/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/4/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/5/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/5/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/5/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/5/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/6/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/6/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/6/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/6/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/7/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/7/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/7/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/7/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/8/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/8/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/8/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/8/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/9/authorityFile` ← `/rows/0/unclassifiedAuthorityDocuments/9/authorityFile` (DIRECT_FACT)
- `/unclassifiedInventory/unclassifiedAuthorityDocuments/9/documentKind` ← `/rows/0/unclassifiedAuthorityDocuments/9/documentKind` (DIRECT_FACT)
- `/unclassifiedInventory/knowHowWithoutScenarioLineage` ← `/rows/0/knowHowWithoutScenarioLineage` (DIRECT_FACT)
- `/unclassifiedInventory/healingDraftsWithoutScenarioTarget` ← `/rows/0/healingDraftsWithoutScenarioTarget` (DIRECT_FACT)

</details>

<a id="query-result-feature-coverage-unlined-mechanics-v1"></a>

#### `feature-coverage.unlined-mechanics.v1`

| Binding | Value |
|---|---|
| Purpose | Evidence Without Canonical Lineage |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` |
| Result hash | `sha256:d9da9dfcefb667361f4f959d2c820f9a1c6f1434e2fbbbfdf8e19838311fc487` |
| Rows | 11 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-v1.json) |
| Next queries | [`Group by file`](#query-result-feature-coverage-unlined-mechanics-by-file-v1)<br>[`Group by responsibility`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1)<br>[`Group by symbol`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1)<br>[`Inspect exact occurrences`](#query-result-feature-coverage-unlined-occurrences-v1) |

```sql
SELECT mechanic, COUNT(*) AS occurrenceCount, COUNT(DISTINCT modulePath) AS fileCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY mechanic ORDER BY mechanic
```

<details><summary>Inspect 11 result row(s) inline</summary>

```json
[
  {
    "mechanic": "branch",
    "occurrenceCount": 1255,
    "fileCount": 79,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "branch"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "branch"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "branch"
        }
      }
    ]
  },
  {
    "mechanic": "exception-handling",
    "occurrenceCount": 105,
    "fileCount": 27,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "exception-handling"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "exception-handling"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "exception-handling"
        }
      }
    ]
  },
  {
    "mechanic": "fallback",
    "occurrenceCount": 1638,
    "fileCount": 77,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "fallback"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "fallback"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "fallback"
        }
      }
    ]
  },
  {
    "mechanic": "iteration",
    "occurrenceCount": 401,
    "fileCount": 65,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "iteration"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "iteration"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "iteration"
        }
      }
    ]
  },
  {
    "mechanic": "normalization",
    "occurrenceCount": 136,
    "fileCount": 29,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "normalization"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "normalization"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "normalization"
        }
      }
    ]
  },
  {
    "mechanic": "object-construction",
    "occurrenceCount": 2538,
    "fileCount": 87,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "object-construction"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "object-construction"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "object-construction"
        }
      }
    ]
  },
  {
    "mechanic": "retry",
    "occurrenceCount": 1,
    "fileCount": 1,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "retry"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "retry"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "retry"
        }
      }
    ]
  },
  {
    "mechanic": "serialization",
    "occurrenceCount": 87,
    "fileCount": 28,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "serialization"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "serialization"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "serialization"
        }
      }
    ]
  },
  {
    "mechanic": "state-mutation",
    "occurrenceCount": 315,
    "fileCount": 57,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "state-mutation"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "state-mutation"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "state-mutation"
        }
      }
    ]
  },
  {
    "mechanic": "throw",
    "occurrenceCount": 223,
    "fileCount": 42,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "throw"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "throw"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "throw"
        }
      }
    ]
  },
  {
    "mechanic": "validation",
    "occurrenceCount": 161,
    "fileCount": 24,
    "drillDowns": [
      {
        "queryId": "feature-coverage.unlined-mechanics-by-file.v1",
        "label": "Inspect files",
        "parameterBindings": {
          "mechanic": "validation"
        }
      },
      {
        "queryId": "feature-coverage.unlined-mechanics-by-responsibility.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "mechanic": "validation"
        }
      },
      {
        "queryId": "feature-coverage.unlined-occurrences.v1",
        "label": "Inspect exact occurrences",
        "parameterBindings": {
          "mechanic": "validation"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-evidence-v1"></a>

#### `subject-boundary.evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Subject Boundary |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:bb62a3b13d996b599f8ff93979338026e619914bc0972f42c77d1211de60d3bb` |
| Result hash | `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/subject-boundary-evidence-v1.json) |
| Next queries | [`Inspect included and excluded items`](#query-result-subject-boundary-items-by-disposition-v1)<br>[`Inspect included items`](#query-result-subject-boundary-included-items-v1)<br>[`Inspect excluded items`](#query-result-subject-boundary-excluded-items-v1) |

```sql
SELECT * FROM reportSubjectBoundary
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "workspaceRelativePrefix": "src",
    "scopeMode": "WORKSPACE_BOUNDED",
    "authorityDocumentsDiscovered": 18,
    "authorityDocumentsInScope": 12,
    "authorityDocumentsExcluded": 6,
    "proposalBatchesDiscovered": 0,
    "proposalBatchesInScope": 0,
    "proposalBatchesExcluded": 0,
    "featureCoverageProposalsDiscovered": 0,
    "featureCoverageProposalsInScope": 0,
    "featureCoverageProposalsExcluded": 0,
    "featureCoverageInferenceEvaluationsDiscovered": 0,
    "featureCoverageInferenceEvaluationsInScope": 0,
    "featureCoverageInferenceEvaluationsExcluded": 0,
    "knowHowRecordsDiscovered": 0,
    "knowHowRecordsInScope": 0,
    "knowHowRecordsExcluded": 0,
    "healingDraftsDiscovered": 0,
    "healingDraftsInScope": 0,
    "healingDraftsExcluded": 0
  }
]
```

</details>

<details><summary>Inspect 20 rendered claim pointer(s) inline</summary>

- `/subjectScope/workspaceRelativePrefix` ← `/rows/0/workspaceRelativePrefix` (DIRECT_FACT)
- `/subjectScope/scopeMode` ← `/rows/0/scopeMode` (DIRECT_FACT)
- `/subjectScope/authorityDocumentsDiscovered` ← `/rows/0/authorityDocumentsDiscovered` (DIRECT_FACT)
- `/subjectScope/authorityDocumentsInScope` ← `/rows/0/authorityDocumentsInScope` (DIRECT_FACT)
- `/subjectScope/authorityDocumentsExcluded` ← `/rows/0/authorityDocumentsExcluded` (DIRECT_FACT)
- `/subjectScope/proposalBatchesDiscovered` ← `/rows/0/proposalBatchesDiscovered` (DIRECT_FACT)
- `/subjectScope/proposalBatchesInScope` ← `/rows/0/proposalBatchesInScope` (DIRECT_FACT)
- `/subjectScope/proposalBatchesExcluded` ← `/rows/0/proposalBatchesExcluded` (DIRECT_FACT)
- `/subjectScope/featureCoverageProposalsDiscovered` ← `/rows/0/featureCoverageProposalsDiscovered` (DIRECT_FACT)
- `/subjectScope/featureCoverageProposalsInScope` ← `/rows/0/featureCoverageProposalsInScope` (DIRECT_FACT)
- `/subjectScope/featureCoverageProposalsExcluded` ← `/rows/0/featureCoverageProposalsExcluded` (DIRECT_FACT)
- `/subjectScope/featureCoverageInferenceEvaluationsDiscovered` ← `/rows/0/featureCoverageInferenceEvaluationsDiscovered` (DIRECT_FACT)
- `/subjectScope/featureCoverageInferenceEvaluationsInScope` ← `/rows/0/featureCoverageInferenceEvaluationsInScope` (DIRECT_FACT)
- `/subjectScope/featureCoverageInferenceEvaluationsExcluded` ← `/rows/0/featureCoverageInferenceEvaluationsExcluded` (DIRECT_FACT)
- `/subjectScope/knowHowRecordsDiscovered` ← `/rows/0/knowHowRecordsDiscovered` (DIRECT_FACT)
- `/subjectScope/knowHowRecordsInScope` ← `/rows/0/knowHowRecordsInScope` (DIRECT_FACT)
- `/subjectScope/knowHowRecordsExcluded` ← `/rows/0/knowHowRecordsExcluded` (DIRECT_FACT)
- `/subjectScope/healingDraftsDiscovered` ← `/rows/0/healingDraftsDiscovered` (DIRECT_FACT)
- `/subjectScope/healingDraftsInScope` ← `/rows/0/healingDraftsInScope` (DIRECT_FACT)
- `/subjectScope/healingDraftsExcluded` ← `/rows/0/healingDraftsExcluded` (DIRECT_FACT)

</details>

<a id="query-result-cli-traceability-summary-v1"></a>

#### `cli.traceability-summary.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Traceability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:167954990db828bda5b3a5f828280f6e21e26397b49e31c2d1b70d0c19d23966` |
| Result hash | `sha256:64e1e2c89c121c163cbcd7494baeacc1ed832e5227ad6ec0c0a8db7b3010cb29` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-traceability-summary-v1.json) |
| Next queries | [`Inspect CLI roots`](#query-result-cli-entry-points-v1)<br>[`Inspect classified runtime callables`](#query-result-cli-callable-inventory-v1)<br>[`Inspect NO_CLI_REACHABILITY remainder`](#query-result-cli-unreachable-callables-v1) |

```sql
SELECT * FROM reportInterfaceGovernanceSummary
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "interfacePortfolioDisposition": "CLI_IS_FIRST_CLASS_OBSERVED_INTERFACE",
    "cliDispatchEvidenceDisposition": "CLI_DISPATCH_SOURCE_PARSED",
    "cliDispatchSourceHash": "sha256:09dd4e9b1480712de3722544236329732c30d10e7f9057c8c1b6fec75c4e428c",
    "observedCliCommandHandlers": 15,
    "observedCliCommandTokens": 16,
    "observedHttpEntryPoints": 8,
    "commandsWithCanonicalFeature": 0,
    "commandsWithoutCanonicalFeature": 16,
    "canonicalFeaturesAccessibleViaCli": 0,
    "canonicalFeatureIdsAccessibleViaCli": [],
    "cliInterfaceAuthorityDocuments": 0,
    "cliInterfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "admittedCliCommands": 0,
    "runtimeCallables": 788,
    "cliReachableCallables": 640,
    "sharedCliInfrastructure": 131,
    "runtimeResolutionRequired": 6,
    "noCliReachabilityCallables": 142,
    "reachableMechanicOccurrences": 5517,
    "unreachableMechanicOccurrences": 989
  }
]
```

</details>

<details><summary>Inspect 19 rendered claim pointer(s) inline</summary>

- `/interfaceGovernance/summary/interfacePortfolioDisposition` ← `/rows/0/interfacePortfolioDisposition` (CLASSIFICATION)
- `/interfaceGovernance/summary/cliDispatchEvidenceDisposition` ← `/rows/0/cliDispatchEvidenceDisposition` (CLASSIFICATION)
- `/interfaceGovernance/summary/cliDispatchSourceHash` ← `/rows/0/cliDispatchSourceHash` (CLASSIFICATION)
- `/interfaceGovernance/summary/observedCliCommandHandlers` ← `/rows/0/observedCliCommandHandlers` (CLASSIFICATION)
- `/interfaceGovernance/summary/observedCliCommandTokens` ← `/rows/0/observedCliCommandTokens` (CLASSIFICATION)
- `/interfaceGovernance/summary/observedHttpEntryPoints` ← `/rows/0/observedHttpEntryPoints` (CLASSIFICATION)
- `/interfaceGovernance/summary/commandsWithCanonicalFeature` ← `/rows/0/commandsWithCanonicalFeature` (CLASSIFICATION)
- `/interfaceGovernance/summary/commandsWithoutCanonicalFeature` ← `/rows/0/commandsWithoutCanonicalFeature` (CLASSIFICATION)
- `/interfaceGovernance/summary/canonicalFeaturesAccessibleViaCli` ← `/rows/0/canonicalFeaturesAccessibleViaCli` (CLASSIFICATION)
- `/interfaceGovernance/summary/cliInterfaceAuthorityDocuments` ← `/rows/0/cliInterfaceAuthorityDocuments` (CLASSIFICATION)
- `/interfaceGovernance/summary/cliInterfaceAuthorityDisposition` ← `/rows/0/cliInterfaceAuthorityDisposition` (CLASSIFICATION)
- `/interfaceGovernance/summary/admittedCliCommands` ← `/rows/0/admittedCliCommands` (CLASSIFICATION)
- `/interfaceGovernance/summary/runtimeCallables` ← `/rows/0/runtimeCallables` (CLASSIFICATION)
- `/interfaceGovernance/summary/cliReachableCallables` ← `/rows/0/cliReachableCallables` (CLASSIFICATION)
- `/interfaceGovernance/summary/sharedCliInfrastructure` ← `/rows/0/sharedCliInfrastructure` (CLASSIFICATION)
- `/interfaceGovernance/summary/runtimeResolutionRequired` ← `/rows/0/runtimeResolutionRequired` (CLASSIFICATION)
- `/interfaceGovernance/summary/noCliReachabilityCallables` ← `/rows/0/noCliReachabilityCallables` (CLASSIFICATION)
- `/interfaceGovernance/summary/reachableMechanicOccurrences` ← `/rows/0/reachableMechanicOccurrences` (CLASSIFICATION)
- `/interfaceGovernance/summary/unreachableMechanicOccurrences` ← `/rows/0/unreachableMechanicOccurrences` (CLASSIFICATION)

</details>

<a id="query-result-cli-entry-points-v1"></a>

#### `cli.entry-points.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Traceability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6d63d220b5df0ae523d1ff1bae9742a3d6a400ec59564d56f5a8f3147303212f` |
| Result hash | `sha256:828b9dd612c211d7c5b267d4f4d4937cf0c54ba2511300d2d602579e8833586a` |
| Rows | 16 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-entry-points-v1.json) |
| Next queries | [`Inspect complete reachable graph slice`](#query-result-cli-entry-point-reachability-v1) `entryPointId=:entryPointId` |

```sql
SELECT * FROM reportCliCommands WHERE (:commandName IS NULL OR commandName = :commandName) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY commandName
```

<details><summary>Inspect 16 result row(s) inline</summary>

```json
[
  {
    "commandName": "call-graph",
    "subcommandName": null,
    "handlerName": "runCallGraph",
    "entryPointId": "cli.js#function:runCallGraph",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:5859:27",
    "declarationLine": 99,
    "reachableCallableCount": 41,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runCallGraph"
        }
      }
    ]
  },
  {
    "commandName": "console",
    "subcommandName": null,
    "handlerName": "runConsole",
    "entryPointId": "cli.js#function:runConsole",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6814:25",
    "declarationLine": 119,
    "reachableCallableCount": 28,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runConsole"
        }
      }
    ]
  },
  {
    "commandName": "generate-connective-tissue",
    "subcommandName": null,
    "handlerName": "runGenerateConnectiveTissue",
    "entryPointId": "cli.js#function:runGenerateConnectiveTissue",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6663:42",
    "declarationLine": 115,
    "reachableCallableCount": 14,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runGenerateConnectiveTissue"
        }
      }
    ]
  },
  {
    "commandName": "generate-docs",
    "subcommandName": null,
    "handlerName": "runGenerateDocs",
    "entryPointId": "cli.js#function:runGenerateDocs",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:5938:30",
    "declarationLine": 101,
    "reachableCallableCount": 52,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runGenerateDocs"
        }
      }
    ]
  },
  {
    "commandName": "govern",
    "subcommandName": null,
    "handlerName": "runGovern",
    "entryPointId": "cli.js#function:runGovern",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6368:24",
    "declarationLine": 109,
    "reachableCallableCount": 274,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runGovern"
        }
      }
    ]
  },
  {
    "commandName": "ingest",
    "subcommandName": null,
    "handlerName": "runIngest",
    "entryPointId": "cli.js#function:runIngest",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6968:24",
    "declarationLine": 123,
    "reachableCallableCount": 78,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runIngest"
        }
      }
    ]
  },
  {
    "commandName": "load-sqlserver",
    "subcommandName": null,
    "handlerName": "runLoadSqlServer",
    "entryPointId": "cli.js#function:runLoadSqlServer",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6892:31",
    "declarationLine": 121,
    "reachableCallableCount": 25,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runLoadSqlServer"
        }
      }
    ]
  },
  {
    "commandName": "project",
    "subcommandName": null,
    "handlerName": "runProject",
    "entryPointId": "cli.js#function:runProject",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:5718:25",
    "declarationLine": 95,
    "reachableCallableCount": 61,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProject"
        }
      }
    ]
  },
  {
    "commandName": "project-authority",
    "subcommandName": null,
    "handlerName": "runProjectAuthority",
    "entryPointId": "cli.js#function:runProjectAuthority",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6024:34",
    "declarationLine": 103,
    "reachableCallableCount": 13,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProjectAuthority"
        }
      }
    ]
  },
  {
    "commandName": "project-authority-violations",
    "subcommandName": null,
    "handlerName": "runProjectAuthorityViolations",
    "entryPointId": "cli.js#function:runProjectAuthorityViolations",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6125:44",
    "declarationLine": 105,
    "reachableCallableCount": 63,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProjectAuthorityViolations"
        }
      }
    ]
  },
  {
    "commandName": "project-console-contract",
    "subcommandName": null,
    "handlerName": "runProjectConsoleContract",
    "entryPointId": "cli.js#function:runProjectConsoleContract",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6283:40",
    "declarationLine": 107,
    "reachableCallableCount": 35,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProjectConsoleContract"
        }
      }
    ]
  },
  {
    "commandName": "project-governed-console-contract",
    "subcommandName": null,
    "handlerName": "runProjectConsoleContract",
    "entryPointId": "cli.js#function:runProjectConsoleContract",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6283:40",
    "declarationLine": 107,
    "reachableCallableCount": 35,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProjectConsoleContract"
        }
      }
    ]
  },
  {
    "commandName": "propose-feature-coverage",
    "subcommandName": null,
    "handlerName": "runProposeFeatureCoverage",
    "entryPointId": "cli.js#function:runProposeFeatureCoverage",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6558:40",
    "declarationLine": 113,
    "reachableCallableCount": 32,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProposeFeatureCoverage"
        }
      }
    ]
  },
  {
    "commandName": "propose-semantic-overlap",
    "subcommandName": null,
    "handlerName": "runProposeSemanticOverlap",
    "entryPointId": "cli.js#function:runProposeSemanticOverlap",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6455:40",
    "declarationLine": 111,
    "reachableCallableCount": 15,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runProposeSemanticOverlap"
        }
      }
    ]
  },
  {
    "commandName": "query",
    "subcommandName": null,
    "handlerName": "runQuery",
    "entryPointId": "cli.js#function:runQuery",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:5787:23",
    "declarationLine": 97,
    "reachableCallableCount": 14,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runQuery"
        }
      }
    ]
  },
  {
    "commandName": "web",
    "subcommandName": null,
    "handlerName": "runWeb",
    "entryPointId": "cli.js#function:runWeb",
    "interfaceKind": "CLI_COMMAND",
    "interfaceStatus": "FIRST_CLASS_OBSERVED_INTERFACE",
    "productDisposition": "PRODUCT_ENTRY_POINT",
    "admissionDisposition": "OBSERVED_NOT_ADMITTED",
    "modulePath": "src/cli.js",
    "sourceReferenceId": "cli.js:6747:21",
    "declarationLine": 117,
    "reachableCallableCount": 251,
    "canonicalFeatureIds": [],
    "canonicalScenarioIds": [],
    "canonicalResponsibilityIds": [],
    "canonicalAuthorityFiles": [],
    "cliInterfaceAuthorityFiles": [],
    "featureAccessDisposition": "CANONICAL_FEATURE_LINK_MISSING",
    "interfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "governanceGapDisposition": "FEATURE_AND_INTERFACE_AUTHORITY_MISSING",
    "drillDowns": [
      {
        "queryId": "cli.entry-point-reachability.v1",
        "label": "Inspect complete reachable graph slice",
        "parameterBindings": {
          "entryPointId": "cli.js#function:runWeb"
        }
      }
    ]
  }
]
```

</details>

Full 240-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-entry-points-v1.json).

<a id="query-result-cli-callable-inventory-v1"></a>

#### `cli.callable-inventory.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Traceability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:9a9868803ac90ade1ac49f7fcc41a520e88f19150efd87435c0333c7f34b3be4` |
| Result hash | `sha256:02336c9e4d52b474d479366b126a7ad31f20cf0e4b3c0d57634b59b5798bf960` |
| Rows | 788 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-callable-inventory-v1.json) |
| Next queries | [`Inspect justifying CLI commands`](#query-result-cli-symbol-originating-commands-v1) `symbolId=:symbolId`<br>[`Inspect removal impact`](#query-result-cli-unreachable-removal-impact-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallableInventory WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:classification IS NULL OR cliClosureClassification = :classification) ORDER BY modulePath, declarationLine
```

Full 788-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-callable-inventory-v1.json).

Full 21988-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-callable-inventory-v1.json).

<a id="query-result-cli-entry-point-reachability-v1"></a>

#### `cli.entry-point-reachability.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:5a68b386bc943e7983c3e20e6f2afd468d25a89683b0cfe2abeddffd3cea9e6a` |
| Result hash | `sha256:cfab047f4f95d375f460332b88563006c4255cd303abe242fcbb6e0ed4af0fb2` |
| Rows | 996 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-entry-point-reachability-v1.json) |
| Next queries | [`Invert reachability to originating commands`](#query-result-cli-symbol-originating-commands-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCliReachability WHERE (:entryPointId IS NULL OR entryPointId = :entryPointId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY entryPointId, depth, symbolId
```

Full 996-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-entry-point-reachability-v1.json).

Full 16547-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-entry-point-reachability-v1.json).

<a id="query-result-cli-shared-reachability-v1"></a>

#### `cli.shared-reachability.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:49a77e977b9941a90b7e7d9ee847c286c1322508bc70f195aa16834ad43b1e25` |
| Result hash | `sha256:77010d8f9da60f6db55ebd17882194fef5cddf0b64970b2a016a4a1d8b4b5ac1` |
| Rows | 131 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-shared-reachability-v1.json) |
| Next queries | [`Inspect sharing CLI commands`](#query-result-cli-symbol-originating-commands-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'SHARED_CLI_INFRASTRUCTURE' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine
```

Full 131-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-shared-reachability-v1.json).

Full 4024-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-shared-reachability-v1.json).

<a id="query-result-cli-runtime-resolution-debt-v1"></a>

#### `cli.runtime-resolution-debt.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:5dd66999c648686e342b1d7e7847cca6bc2d6aba3b46a83eca08b9f639612160` |
| Result hash | `sha256:33ba6b41de07bb934b92a5c2660fa88b4f8da8d7c121fff4849b75f2df0173b1` |
| Rows | 6 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-runtime-resolution-debt-v1.json) |
| Next queries | [`Inspect candidate callers`](#query-result-reachability-symbol-callers-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'RUNTIME_RESOLUTION_REQUIRED' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine
```

<details><summary>Inspect 6 result row(s) inline</summary>

```json
[
  {
    "symbolId": "console/console-authority-runtime.mjs#function:extractsSnippetLines",
    "symbolVersionId": "sha256:09cb9a4888c6362938ec5a00b1cecc4da0c737b6e4189c704aeae3a69a8ed5c7",
    "kind": "function",
    "name": "extractsSnippetLines",
    "modulePath": "src/console/console-authority-runtime.mjs",
    "sourceReferenceId": "console/console-authority-runtime.mjs:3687:853",
    "declarationLine": 111,
    "declarationColumn": 1,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "PLATFORM_PRIMITIVE",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 9,
    "sameModuleOutgoingInvocationCount": 0,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "console/console-authority-runtime.mjs#function:extractsSnippetLines"
        }
      }
    ]
  },
  {
    "symbolId": "console/console-authority-runtime.mjs#function:validatesConsoleParameters",
    "symbolVersionId": "sha256:b08b89ecbc53abb6ca8d9c68dbfe237492d0541d3bf36d1f1a3ed6944469a4a4",
    "kind": "function",
    "name": "validatesConsoleParameters",
    "modulePath": "src/console/console-authority-runtime.mjs",
    "sourceReferenceId": "console/console-authority-runtime.mjs:6281:118",
    "declarationLine": 188,
    "declarationColumn": 1,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "PLATFORM_PRIMITIVE",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 1,
    "sameModuleOutgoingInvocationCount": 0,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "console/console-authority-runtime.mjs#function:validatesConsoleParameters"
        }
      }
    ]
  },
  {
    "symbolId": "console/console-snippet-adapter.mjs#function:extractsSnippetLines",
    "symbolVersionId": "sha256:54b019093a802202821b02af7de93886a349067b3ad84b010bfa5adc49f70106",
    "kind": "function",
    "name": "extractsSnippetLines",
    "modulePath": "src/console/console-snippet-adapter.mjs",
    "sourceReferenceId": "console/console-snippet-adapter.mjs:1634:129",
    "declarationLine": 40,
    "declarationColumn": 1,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "PLATFORM_PRIMITIVE",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 1,
    "sameModuleOutgoingInvocationCount": 0,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "console/console-snippet-adapter.mjs#function:extractsSnippetLines"
        }
      }
    ]
  },
  {
    "symbolId": "console/console-validation-adapter.runtime.mjs#function:validatesConsoleParameters",
    "symbolVersionId": "sha256:b4e2b8df34c87d0554b2781e7df8ddff76d20afba8388b62f5a9b66ed5495dfc",
    "kind": "function",
    "name": "validatesConsoleParameters",
    "modulePath": "src/console/console-validation-adapter.runtime.mjs",
    "sourceReferenceId": "console/console-validation-adapter.runtime.mjs:985:173",
    "declarationLine": 18,
    "declarationColumn": 1,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "PLATFORM_PRIMITIVE",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 1,
    "sameModuleOutgoingInvocationCount": 0,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "console/console-validation-adapter.runtime.mjs#function:validatesConsoleParameters"
        }
      }
    ]
  },
  {
    "symbolId": "projects-authority-from-violations.js#function:buildsSourceCodeMap",
    "symbolVersionId": "sha256:671c150137256aa8b4c0c8c929306492a905c1e01f987b706c8ffe6fcf2f303f",
    "kind": "function",
    "name": "buildsSourceCodeMap",
    "modulePath": "src/projects-authority-from-violations.js",
    "sourceReferenceId": "projects-authority-from-violations.js:2191:1497",
    "declarationLine": 71,
    "declarationColumn": 1,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "SHARED_SUPPORT",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 20,
    "sameModuleOutgoingInvocationCount": 3,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "projects-authority-from-violations.js#function:buildsSourceCodeMap"
        }
      }
    ]
  },
  {
    "symbolId": "projects-authority-from-violations.js#method:class:AuthorityProjectorFromViolations/buildsSourceCodeMap",
    "symbolVersionId": "sha256:5f4485abbc5daded5abdb6b795d7b0f88b201fd27c1f0183105cd9b3d7b162fb",
    "kind": "method",
    "name": "buildsSourceCodeMap",
    "modulePath": "src/projects-authority-from-violations.js",
    "sourceReferenceId": "projects-authority-from-violations.js:13063:288",
    "declarationLine": 348,
    "declarationColumn": 3,
    "isExported": false,
    "entryPointId": null,
    "entryPointKinds": [],
    "entryPointDisposition": null,
    "reachableFromCliRootIds": [],
    "cliReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "cliMinDepth": null,
    "inventoryReachableFromEntryPointIds": [],
    "reachableFromEntryPointKinds": [],
    "inventoryReachabilityDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "inventoryMinDepth": null,
    "justificationDisposition": "SHARED_SUPPORT",
    "callableDisposition": "RUNTIME_RESOLUTION_REQUIRED",
    "incomingInvocationCount": 0,
    "resolvedIncomingInvocationCount": 0,
    "ambiguousIncomingInvocationCount": 1,
    "sameModuleIncomingInvocationCount": 0,
    "externalIncomingInvocationCount": 0,
    "outgoingInvocationCount": 2,
    "sameModuleOutgoingInvocationCount": 1,
    "cliClosureClassification": "RUNTIME_RESOLUTION_REQUIRED",
    "drillDowns": [
      {
        "queryId": "reachability.symbol-callers.v1",
        "label": "Inspect candidate callers",
        "parameterBindings": {
          "symbolId": "projects-authority-from-violations.js#method:class:AuthorityProjectorFromViolations/buildsSourceCodeMap"
        }
      }
    ]
  }
]
```

</details>

Full 150-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-runtime-resolution-debt-v1.json).

<a id="query-result-cli-reachable-source-facts-v1"></a>

#### `cli.reachable-source-facts.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Reachable Source Facts |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:9a90cc569a898443ff2911aa820c437abfd1e09df76cb8fc97f9af450eca4cbb` |
| Result hash | `sha256:8058e224f11b62a837bb29b36a9b223927f11f91cbc3470ea9b3c24202712730` |
| Rows | 5517 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-reachable-source-facts-v1.json) |
| Next queries | [`Inspect exact physical source`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportSourceFacts WHERE cliClosureClassification IN ('CLI_FEATURE_ROOT','CLI_FEATURE_REACHABLE','SHARED_CLI_INFRASTRUCTURE') AND (:entryPointId IS NULL OR :entryPointId IN originatingEntryPointIds) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine
```

Full 5517-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-reachable-source-facts-v1.json).

Full 79917-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-reachable-source-facts-v1.json).

<a id="query-result-cli-unreachable-callables-v1"></a>

#### `cli.unreachable-callables.v1`

| Binding | Value |
|---|---|
| Purpose | Fat and Waste Inventory |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b9685d65ca5e3116ff73e36a4fcc75bcde6ee74d27ae1c53571b27e806caeb3d` |
| Result hash | `sha256:6aa059110b72ca84003c58efaeca5054a85baa6b15be48bbca1dc36ac13cd304` |
| Rows | 142 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-unreachable-callables-v1.json) |
| Next queries | [`Inspect deterministic removal impact`](#query-result-cli-unreachable-removal-impact-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallableInventory WHERE cliClosureClassification = 'NO_CLI_REACHABILITY' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, declarationLine
```

Full 142-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-callables-v1.json).

Full 3562-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-callables-v1.json).

<a id="query-result-cli-unreachable-source-facts-v1"></a>

#### `cli.unreachable-source-facts.v1`

| Binding | Value |
|---|---|
| Purpose | Fat and Waste Inventory |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:94440b0342c83f2f7820cda1a4e12a1b41e3b294c43be109c2cae564636110de` |
| Result hash | `sha256:1df8818b575000b741ae9bd641c0a0ace3428b2485167feaecea385892c8e544` |
| Rows | 989 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-unreachable-source-facts-v1.json) |
| Next queries | [`Inspect exact physical source`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId`<br>[`Inspect owner removal impact`](#query-result-cli-unreachable-removal-impact-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportSourceFacts WHERE cliClosureClassification = 'NO_CLI_REACHABILITY' AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine
```

Full 989-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-source-facts-v1.json).

Full 12857-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-source-facts-v1.json).

<a id="query-result-cli-symbol-originating-commands-v1"></a>

#### `cli.symbol-originating-commands.v1`

| Binding | Value |
|---|---|
| Purpose | Reverse CLI Justification |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:414642febefcfb3b5cb7888a130f5c1d578619fc38e661aef67ec6b8e797e853` |
| Result hash | `sha256:8965cb72c7b03bc6a6bb6ecd865118d9fdf58a7cbc73b93837e41bf67a240f84` |
| Rows | 996 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-symbol-originating-commands-v1.json) |
| Next queries | [`Inspect complete path`](#query-result-cli-entry-point-reachability-v1) `entryPointId=:entryPointId` `symbolId=:symbolId` |

```sql
SELECT * FROM reportCliOriginatingCommands WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:entryPointId IS NULL OR entryPointId = :entryPointId) ORDER BY symbolId, depth, entryPointId
```

Full 996-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-symbol-originating-commands-v1.json).

Full 13559-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-symbol-originating-commands-v1.json).

<a id="query-result-cli-unreachable-removal-impact-v1"></a>

#### `cli.unreachable-removal-impact.v1`

| Binding | Value |
|---|---|
| Purpose | Removal Impact |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:d01ecae4d4e7adc553ea633a4bf509d430835ac4495d2f338a454cea8a152027` |
| Result hash | `sha256:2f6664d4fcea683b3b5252b79acaef2410c06342a100ba038a8ae0fe4b1d7465` |
| Rows | 142 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/cli-unreachable-removal-impact-v1.json) |
| Next queries | [`Inspect callers`](#query-result-reachability-symbol-callers-v1) `symbolId=:symbolId`<br>[`Inspect callees`](#query-result-reachability-symbol-callees-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCliRemovalImpact WHERE (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, symbolName
```

Full 142-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-removal-impact-v1.json).

Full 2509-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/cli-unreachable-removal-impact-v1.json).

<a id="query-result-interface-summary-v1"></a>

#### `interface.summary.v1`

| Binding | Value |
|---|---|
| Purpose | Interface Governance |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:167954990db828bda5b3a5f828280f6e21e26397b49e31c2d1b70d0c19d23966` |
| Result hash | `sha256:64e1e2c89c121c163cbcd7494baeacc1ed832e5227ad6ec0c0a8db7b3010cb29` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/interface-summary-v1.json) |
| Next queries | [`Inspect CLI commands and feature access`](#query-result-interface-cli-commands-v1)<br>[`Inspect CLI governance gaps`](#query-result-interface-authority-gaps-v1) |

```sql
SELECT * FROM reportInterfaceGovernanceSummary
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "interfacePortfolioDisposition": "CLI_IS_FIRST_CLASS_OBSERVED_INTERFACE",
    "cliDispatchEvidenceDisposition": "CLI_DISPATCH_SOURCE_PARSED",
    "cliDispatchSourceHash": "sha256:09dd4e9b1480712de3722544236329732c30d10e7f9057c8c1b6fec75c4e428c",
    "observedCliCommandHandlers": 15,
    "observedCliCommandTokens": 16,
    "observedHttpEntryPoints": 8,
    "commandsWithCanonicalFeature": 0,
    "commandsWithoutCanonicalFeature": 16,
    "canonicalFeaturesAccessibleViaCli": 0,
    "canonicalFeatureIdsAccessibleViaCli": [],
    "cliInterfaceAuthorityDocuments": 0,
    "cliInterfaceAuthorityDisposition": "CLI_INTERFACE_AUTHORITY_MISSING",
    "admittedCliCommands": 0,
    "runtimeCallables": 788,
    "cliReachableCallables": 640,
    "sharedCliInfrastructure": 131,
    "runtimeResolutionRequired": 6,
    "noCliReachabilityCallables": 142,
    "reachableMechanicOccurrences": 5517,
    "unreachableMechanicOccurrences": 989
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-interface-cli-commands-v1"></a>

#### `interface.cli-commands.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Command Inventory |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1cb099fc098a9301e59dae42cf27ab6c5b78a9e37cd5f5e5b21ead9785ee0454` |
| Result hash | `sha256:48fae04fdb40427fe2ea2c213ced4e0b4dc7be4dbd8daeabec4c2de7a5ff4035` |
| Rows | 16 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/interface-cli-commands-v1.json) |
| Next queries | [`Inspect command execution paths`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolId=:entryPointId`<br>[`Inspect accessible canonical features`](#query-result-feature-coverage-features-v1) `featureId=:featureId`<br>[`Inspect interface authority gaps`](#query-result-interface-authority-gaps-v1) `commandName=:commandName` |

```sql
SELECT * FROM reportCliCommands WHERE (:commandName IS NULL OR commandName = :commandName) AND (:handlerName IS NULL OR handlerName = :handlerName) AND (:featureId IS NULL OR :featureId IN canonicalFeatureIds) ORDER BY commandName, handlerName
```

Full 16-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/interface-cli-commands-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-interface-authority-gaps-v1"></a>

#### `interface.authority-gaps.v1`

| Binding | Value |
|---|---|
| Purpose | CLI Authority Gaps |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:9489a56fb6b3fd0b380f95572d062b54e7c1a0e641832c581d4b02e214d6b38a` |
| Result hash | `sha256:c09032f566ad186d3d428deca6b2279cf3e26606f7df59546616fcf94d40dfd9` |
| Rows | 16 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/interface-authority-gaps-v1.json) |
| Next queries | [`Inspect command evidence`](#query-result-interface-cli-commands-v1) `commandName=:commandName`<br>[`Inspect canonical authority`](#query-result-authority-documents-v1) |

```sql
SELECT * FROM reportCliCommands WHERE governanceGapDisposition <> 'CLI_INTERFACE_GOVERNED' AND (:commandName IS NULL OR commandName = :commandName) AND (:gapDisposition IS NULL OR governanceGapDisposition = :gapDisposition) ORDER BY governanceGapDisposition, commandName
```

Full 16-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/interface-authority-gaps-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-features-v1"></a>

#### `feature-coverage.features.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Features |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b507b9960f74168182112bb151a954844379cf125b19fe84166cbc25a5b68de3` |
| Result hash | `sha256:063171974f526756fb724236ea5b36ef9e0966af52c3e7bb29acd8a1133f5701` |
| Rows | 4 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-features-v1.json) |
| Next queries | [`Inspect feature scenarios`](#query-result-feature-coverage-feature-scenarios-v1) `featureId=:featureId`<br>[`Inspect feature authority`](#query-result-authority-documents-v1) `featureId=:featureId` |

```sql
SELECT * FROM reportCanonicalFeatures WHERE (:featureId IS NULL OR featureId = :featureId) ORDER BY featureId
```

<details><summary>Inspect 4 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "purpose": "Delegate the admitted console mechanics to helper authorities and runtime dependencies.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classificationIds": [
      "serves-query-console"
    ],
    "scenarioIds": [
      "delegate-console-mechanics"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect scenarios",
        "parameterBindings": {
          "featureId": "delegate-console-authority"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "featureId": "delegate-console-authority"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "purpose": "Project a governed contract draft from the current authority and source-fact evidence.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classificationIds": [
      "serves-query-console"
    ],
    "scenarioIds": [
      "project-governed-console-contract"
    ],
    "lineageQualityFindings": [
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
    ],
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect scenarios",
        "parameterBindings": {
          "featureId": "project-console-contract"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "featureId": "project-console-contract"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "purpose": "Render a governed message from declared contract meaning.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "classificationIds": [
      "governed-message-artifact-family"
    ],
    "scenarioIds": [
      "project-a-declared-message",
      "run-the-message-command",
      "verify-the-projected-message"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect scenarios",
        "parameterBindings": {
          "featureId": "project-governed-messages"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "featureId": "project-governed-messages"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "purpose": "Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "classificationIds": [
      "serves-query-console"
    ],
    "scenarioIds": [
      "serve-console-over-loopback"
    ],
    "lineageQualityFindings": [
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
    ],
    "drillDowns": [
      {
        "queryId": "feature-coverage.feature-scenarios.v1",
        "label": "Inspect scenarios",
        "parameterBindings": {
          "featureId": "serve-query-console"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "featureId": "serve-query-console"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-feature-scenarios-v1"></a>

#### `feature-coverage.feature-scenarios.v1`

| Binding | Value |
|---|---|
| Purpose | Feature Scenarios |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6971565a6037b39edde137eb108803f4360451bbffe1c34b9ed28dccb3e45f7b` |
| Result hash | `sha256:3fb54aaf62148af47a5ced46cdd37fc624036b0648beb5061fd1c55389f839a9` |
| Rows | 6 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-feature-scenarios-v1.json) |
| Next queries | [`Inspect responsibilities`](#query-result-scenario-conformance-scenario-responsibilities-v1) `featureId=:featureId` |

```sql
SELECT * FROM reportCanonicalScenarios WHERE (:featureId IS NULL OR featureId = :featureId) ORDER BY featureId, scenarioId
```

<details><summary>Inspect 6 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "scenarioId": "delegate-console-mechanics",
    "purpose": "The console body delegates routing, validation, and snippet extraction to admitted authorities.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "delegate-console-mechanics"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "purpose": "The translator emits a governed contract draft without hand-authoring the contract bytes.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "project-a-declared-message",
    "purpose": "A declared message value is projected into canonical output.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_STATICALLY_OBSERVED"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "project-a-declared-message"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "run-the-message-command",
    "purpose": "The projected message is emitted through the declared command port.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "run-the-message-command"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "verify-the-projected-message",
    "purpose": "The projected message is proved against its declared expectation.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "verify-the-projected-message"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "purpose": "The console binds only to loopback and serves query, index, and snippet responses.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
    ],
    "lineageQualityFindings": [
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect scenario responsibilities",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-scenario-conformance-scenarios-v1"></a>

#### `scenario-conformance.scenarios.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Scenarios |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:713f34d346172b89a6d2641cabe6b68b4cdcfab36d97ef84c6aacebaec1ea8d9` |
| Result hash | `sha256:3a98900c82bacbbcbb9465b913bb85114c4522861d5fed8059724415fd5fa91d` |
| Rows | 6 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-scenarios-v1.json) |
| Next queries | [`Inspect responsibility/obligation cardinality`](#query-result-scenario-conformance-scenario-responsibilities-v1) `scenarioId=:scenarioId` |

```sql
SELECT * FROM reportCanonicalScenarios WHERE (:scenarioId IS NULL OR scenarioId = :scenarioId) ORDER BY scenarioId
```

<details><summary>Inspect 6 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "scenarioId": "delegate-console-mechanics",
    "purpose": "The console body delegates routing, validation, and snippet extraction to admitted authorities.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "delegate-console-mechanics"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "delegate-console-mechanics"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "purpose": "The translator emits a governed contract draft without hand-authoring the contract bytes.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "project-a-declared-message",
    "purpose": "A declared message value is projected into canonical output.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_STATICALLY_OBSERVED"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "project-a-declared-message"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "project-a-declared-message"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "run-the-message-command",
    "purpose": "The projected message is emitted through the declared command port.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "run-the-message-command"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "run-the-message-command"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "verify-the-projected-message",
    "purpose": "The projected message is proved against its declared expectation.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "verify-the-projected-message"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "verify-the-projected-message"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "purpose": "The console binds only to loopback and serves query, index, and snippet responses.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
    ],
    "lineageQualityFindings": [
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect responsibilities",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      },
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect call paths",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-scenario-conformance-by-structural-status-v1"></a>

#### `scenario-conformance.by-structural-status.v1`

| Binding | Value |
|---|---|
| Purpose | Structural Status |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c57d1e34cc94400a0112b0f630664f25d804b761ccfce4d6203ef63e1a1838be` |
| Result hash | `sha256:9dda679bcce7505b7e4c07910fb3d137b021030e23ea5f6b216b6d335d3630e9` |
| Rows | 6 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-by-structural-status-v1.json) |
| Next queries | [`Inspect blockers and responsibility evidence`](#query-result-scenario-conformance-scenario-responsibilities-v1) `scenarioId=:scenarioId` |

```sql
SELECT * FROM reportCanonicalScenarios WHERE (:structuralStatus IS NULL OR structuralStatus = :structuralStatus) ORDER BY scenarioId
```

<details><summary>Inspect 6 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "scenarioId": "delegate-console-mechanics",
    "purpose": "The console body delegates routing, validation, and snippet extraction to admitted authorities.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "delegate-console-mechanics"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "purpose": "The translator emits a governed contract draft without hand-authoring the contract bytes.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURALLY_CLOSED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [],
    "lineageQualityFindings": [
      "MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW",
      "PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "project-a-declared-message",
    "purpose": "A declared message value is projected into canonical output.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_STATICALLY_OBSERVED"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "project-a-declared-message"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "run-the-message-command",
    "purpose": "The projected message is emitted through the declared command port.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "run-the-message-command"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "verify-the-projected-message",
    "purpose": "The projected message is proved against its declared expectation.",
    "authorityFile": "contracts/serves-query-console.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 1,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "BODY_NOT_EVALUATED_OUTSIDE_SUBJECT"
    ],
    "lineageQualityFindings": [],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "verify-the-projected-message"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "purpose": "The console binds only to loopback and serves query, index, and snippet responses.",
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "lineageStatus": "SCENARIO_LINEAGE_CANONICAL",
    "structuralStatus": "STRUCTURAL_STATUS_NOT_EVALUATED",
    "runtimeConformance": "NOT_EVALUATED",
    "responsibilityCount": 3,
    "obligationCount": 1,
    "structuralBlockers": [],
    "evaluationLimits": [
      "AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT"
    ],
    "lineageQualityFindings": [
      "IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES"
    ],
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-responsibilities.v1",
        "label": "Inspect missing evidence",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-scenario-conformance-scenario-responsibilities-v1"></a>

#### `scenario-conformance.scenario-responsibilities.v1`

| Binding | Value |
|---|---|
| Purpose | Scenario Responsibilities |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:4ebd6c77ccdbd9cb5424de261939db79c47da42a230c2b08f309a9682eb18cc1` |
| Result hash | `sha256:d27ae627cf1fe9610ffeb16a31979828fd9dde280261e4e991cf637f792f9343` |
| Rows | 10 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-scenario-responsibilities-v1.json) |
| Next queries | [`Inspect originating interfaces`](#query-result-scenario-conformance-scenario-call-paths-v1) `scenarioId=:scenarioId`<br>[`Inspect body source evidence`](#query-result-source-facts-occurrence-source-references-v1) `modulePath=:bodyFile` |

```sql
SELECT * FROM reportScenarioResponsibilities WHERE (:scenarioId IS NULL OR scenarioId = :scenarioId) AND (:responsibilityId IS NULL OR responsibilityId = :responsibilityId) ORDER BY scenarioId, obligationId, responsibilityId
```

<details><summary>Inspect 10 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "scenarioId": "delegate-console-mechanics",
    "obligationId": "console-delegates-mechanics",
    "obligationStatement": "The console source body must delegate admitted mechanics to authority surfaces.",
    "responsibilityId": "console-authority-bundles.v1.responsibility.v1",
    "bodyFile": "src/console/console-authority-bundles.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "TRANSITIVE_DATA_AND_RUNTIME",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "delegate-console-mechanics"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/console-authority-bundles.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "console-authority-bundles.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "obligationStatement": "The console governed contract must be projected from source facts and admitted authority data.",
    "responsibilityId": "console-routing-adapter.v1.responsibility.v1",
    "bodyFile": "src/console/console-routing-adapter.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "DIRECT_DATA_AND_RUNTIME",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/console-routing-adapter.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "console-routing-adapter.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "obligationStatement": "The console governed contract must be projected from source facts and admitted authority data.",
    "responsibilityId": "console-validation-adapter.v1.responsibility.v1",
    "bodyFile": "src/console/console-validation-adapter.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "TRANSITIVE_DATA_AND_RUNTIME",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/console-validation-adapter.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "console-validation-adapter.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "obligationStatement": "The console governed contract must be projected from source facts and admitted authority data.",
    "responsibilityId": "console-snippet-adapter.v1.responsibility.v1",
    "bodyFile": "src/console/console-snippet-adapter.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "DIRECT_DATA_AND_RUNTIME",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "project-governed-console-contract"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/console-snippet-adapter.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "console-snippet-adapter.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "project-a-declared-message",
    "obligationId": "produce-one-canonical-message",
    "obligationStatement": "Exactly one canonical message must be produced from declared semantic authority.",
    "responsibilityId": "executes-message-projection",
    "bodyFile": "src/project-message.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_NOT_STATICALLY_OBSERVED",
    "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "project-a-declared-message"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/project-message.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "executes-message-projection"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "run-the-message-command",
    "obligationId": "emit-the-message-once",
    "obligationStatement": "The command must emit the projected message exactly once.",
    "responsibilityId": "entry-point-for-message-command",
    "bodyFile": "bin/run-message.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_OUTSIDE_REPORT_SUBJECT",
    "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "run-the-message-command"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "bin/run-message.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "entry-point-for-message-command"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "verify-the-projected-message",
    "obligationId": "prove-the-message-conforms",
    "obligationStatement": "Verification must prove the projected message conforms.",
    "responsibilityId": "evaluates-message-proof",
    "bodyFile": "verification/verifies-message.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_OUTSIDE_REPORT_SUBJECT",
    "wiringStatus": "WIRING_NOT_STATICALLY_OBSERVED",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "verify-the-projected-message"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "verification/verifies-message.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "evaluates-message-proof"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "obligationStatement": "The console server must bind only to the loopback interface.",
    "responsibilityId": "serves-query-console.v1.responsibility.v1",
    "bodyFile": "src/console/serves-query-console.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "serves-query-console.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "obligationStatement": "The console server must bind only to the loopback interface.",
    "responsibilityId": "serves-query-console-conformant.v1.responsibility.v1",
    "bodyFile": "src/console/serves-query-console.conformant.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.conformant.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "serves-query-console-conformant.v1.responsibility.v1"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "obligationStatement": "The console server must bind only to the loopback interface.",
    "responsibilityId": "serves-query-console-projected.v1.responsibility.v1",
    "bodyFile": "src/console/serves-query-console.projected.mjs",
    "bindingStatus": "BINDING_DECLARED",
    "bodyStatus": "BODY_STATICALLY_OBSERVED",
    "wiringStatus": "NOT_DETERMINED_BEYOND_MAX_DEPTH",
    "executionStatus": "EXECUTION_NOT_EVALUATED",
    "proofStatus": "PROOF_DECLARED_RESULT_NOT_EVALUATED",
    "drillDowns": [
      {
        "queryId": "scenario-conformance.scenario-call-paths.v1",
        "label": "Inspect entry surfaces",
        "parameterBindings": {
          "scenarioId": "serve-console-over-loopback"
        }
      },
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect source rows",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.projected.mjs"
        }
      },
      {
        "queryId": "authoring.semantic-authority-evidence-bundle.v1",
        "label": "Build authority-authoring evidence bundle",
        "parameterBindings": {
          "responsibilityId": "serves-query-console-projected.v1.responsibility.v1"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-scenario-conformance-scenario-call-paths-v1"></a>

#### `scenario-conformance.scenario-call-paths.v1`

| Binding | Value |
|---|---|
| Purpose | Scenario Call Paths |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:fbd7a1a7480a478232d79b077bc2dc1ee7820e72195339b31c479e06046150f6` |
| Result hash | `sha256:4ef4a19f76ee643e261cbe4cc173494cd45c07a7d5910e76bbe2c4d42c16ece5` |
| Rows | 10 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-scenario-call-paths-v1.json) |
| Next queries | [`Inspect source evidence`](#query-result-source-facts-occurrence-source-references-v1) `symbolId=:symbolId` |

```sql
SELECT sr.featureId, sr.scenarioId, sr.responsibilityId, cp.* FROM reportScenarioResponsibilities sr LEFT JOIN reportCallPaths cp ON cp.symbolName = sr.responsibilityId OR cp.modulePath = sr.bodyFile WHERE (:scenarioId IS NULL OR sr.scenarioId = :scenarioId) AND (:featureId IS NULL OR sr.featureId = :featureId)
```

<details><summary>Inspect 10 result row(s) inline</summary>

```json
[
  {
    "featureId": "delegate-console-authority",
    "scenarioId": "delegate-console-mechanics",
    "obligationId": "console-delegates-mechanics",
    "responsibilityId": "console-authority-bundles.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/console-authority-bundles.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/console-authority-bundles.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "responsibilityId": "console-routing-adapter.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/console-routing-adapter.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/console-routing-adapter.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "responsibilityId": "console-validation-adapter.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/console-validation-adapter.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/console-validation-adapter.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-console-contract",
    "scenarioId": "project-governed-console-contract",
    "obligationId": "console-contract-is-projected",
    "responsibilityId": "console-snippet-adapter.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/console-snippet-adapter.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/console-snippet-adapter.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "project-a-declared-message",
    "obligationId": "produce-one-canonical-message",
    "responsibilityId": "executes-message-projection",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/project-message.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/project-message.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "run-the-message-command",
    "obligationId": "emit-the-message-once",
    "responsibilityId": "entry-point-for-message-command",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "bin/run-message.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "bin/run-message.mjs"
        }
      }
    ]
  },
  {
    "featureId": "project-governed-messages",
    "scenarioId": "verify-the-projected-message",
    "obligationId": "prove-the-message-conforms",
    "responsibilityId": "evaluates-message-proof",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "verification/verifies-message.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "verification/verifies-message.mjs"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "responsibilityId": "serves-query-console.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/serves-query-console.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.mjs"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "responsibilityId": "serves-query-console-conformant.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/serves-query-console.conformant.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.conformant.mjs"
        }
      }
    ]
  },
  {
    "featureId": "serve-query-console",
    "scenarioId": "serve-console-over-loopback",
    "obligationId": "console-serves-loopback-only",
    "responsibilityId": "serves-query-console-projected.v1.responsibility.v1",
    "symbolId": null,
    "symbolName": null,
    "modulePath": "src/console/serves-query-console.projected.mjs",
    "entryPointId": null,
    "entryPointName": null,
    "entryKind": null,
    "depth": null,
    "callPath": [],
    "viaRelationshipId": null,
    "reachabilityDisposition": "NO_ORIGINATING_ENTRYPOINT_OBSERVED",
    "drillDowns": [
      {
        "queryId": "source-facts.occurrence-source-references.v1",
        "label": "Inspect target source",
        "parameterBindings": {
          "modulePath": "src/console/serves-query-console.projected.mjs"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-file-v1"></a>

#### `feature-coverage.unlined-mechanics-by-file.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by File |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` |
| Result hash | `sha256:610558d23a39157d6f30d7b7d7348eaaf2eeb578bb977527cdc2c57bfcf26c9e` |
| Rows | 516 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json) |
| Next queries | [`Inspect responsibilities`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) `mechanic=:mechanic` `modulePath=:modulePath` |

```sql
SELECT modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) GROUP BY modulePath, mechanic ORDER BY occurrenceCount DESC, modulePath
```

Full 516-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-responsibility-v1"></a>

#### `feature-coverage.unlined-mechanics-by-responsibility.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Responsibility |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` |
| Result hash | `sha256:569f58628b28689eb554e154e65630bfa0dd5ab8fcabcba29b520964ba782b08` |
| Rows | 1899 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json) |
| Next queries | [`Inspect interface reachability`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect occurrences`](#query-result-feature-coverage-unlined-occurrences-v1) `responsibility=:responsibility` |

```sql
SELECT modulePath, responsibility, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) GROUP BY modulePath, responsibility, mechanic ORDER BY occurrenceCount DESC
```

Full 1899-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-symbol-v1"></a>

#### `feature-coverage.unlined-mechanics-by-symbol.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Symbol |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` |
| Result hash | `sha256:0824dc7829a9f1c92890d5823c651f286e2478a76c20e437d154459ca0d8bcca` |
| Rows | 1900 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolId=:symbolId` |

```sql
SELECT symbolId, symbolName, modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY symbolId, symbolName, modulePath, mechanic ORDER BY occurrenceCount DESC
```

Full 1900-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-occurrences-v1"></a>

#### `feature-coverage.unlined-occurrences.v1`

| Binding | Value |
|---|---|
| Purpose | Exact Unlined Occurrences |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` |
| Result hash | `sha256:809d91200faaaa55f8070272057c93076f446347f1c19bf407e0cf0dd0dbff3a` |
| Rows | 6860 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json) |
| Next queries | [`Inspect physical source references`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) AND (:responsibility IS NULL OR responsibility = :responsibility) ORDER BY modulePath, startLine
```

Full 6860-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-source-facts-occurrence-source-references-v1"></a>

#### `source-facts.occurrence-source-references.v1`

| Binding | Value |
|---|---|
| Purpose | Physical Source Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` |
| Result hash | `sha256:d827a8c7a2b5e7d24442cda4b635e8e65051f19e85813c9a0cd6996b358eb797` |
| Rows | 7018 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json) |
| Next queries | [`Inspect reverse semantic impact`](#query-result-impact-source-reference-reverse-impact-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, startLine, startColumn, endLine, endColumn, mechanic, symbolId, symbolName FROM reportOccurrenceEvidence WHERE (:occurrenceId IS NULL OR occurrenceId = :occurrenceId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine, startColumn
```

Full 7018-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-originating-entrypoints-v1"></a>

#### `reachability.symbol-originating-entrypoints.v1`

| Binding | Value |
|---|---|
| Purpose | Interface Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` |
| Result hash | `sha256:8a06804f11a1ba1204d34534011464a0709b8b3613a0e5444bc6c4a35814af5d` |
| Rows | 996 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json) |
| Next queries | [`Inspect callers`](#query-result-reachability-symbol-callers-v1) `symbolId=:symbolId`<br>[`Inspect callees`](#query-result-reachability-symbol-callees-v1) `symbolId=:symbolId`<br>[`Inspect semantic context`](#query-result-authority-authority-near-symbol-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallPaths WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) ORDER BY symbolId, depth, entryPointId
```

Full 996-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callers-v1"></a>

#### `reachability.symbol-callers.v1`

| Binding | Value |
|---|---|
| Purpose | Reverse Callers |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` |
| Result hash | `sha256:908a85992edbddab81e369c95990153874aaa6288ead97bdf8c9dcc16bb024b4` |
| Rows | 6891 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR calleeSymbolId = :symbolId) ORDER BY relationshipId
```

Full 6891-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callees-v1"></a>

#### `reachability.symbol-callees.v1`

| Binding | Value |
|---|---|
| Purpose | Forward Callees |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` |
| Result hash | `sha256:3713b2cdf9df8231b08b9ca273fb52a1a5f3f93854c5f811fabe9d9ec822b20d` |
| Rows | 6891 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR callerSymbolId = :symbolId) ORDER BY relationshipId
```

Full 6891-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-responsibility-evidence-cluster-by-id-v1"></a>

#### `responsibility-evidence.cluster-by-id.v1`

| Binding | Value |
|---|---|
| Purpose | Responsibility Cluster |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` |
| Result hash | `sha256:284a228e61e5e016bf992f63b7dab7a52741f9d1960dde899366d105554f6b3c` |
| Rows | 701 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect nearby authority`](#query-result-authority-authority-near-symbol-v1) `symbolName=:responsibility` |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters WHERE (:clusterId IS NULL OR clusterId = :clusterId)
```

Full 701-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authority-documents-v1"></a>

#### `authority.documents.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Lineage |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:aa543b2c7ab5577f034bd1257164fc69ec434efa54926c34f63bc305255f5c31` |
| Result hash | `sha256:1292556b29e7ad54fc5555e8ed6c07d425cbc6c6c0b5292a27c025de41fa4d0f` |
| Rows | 12 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authority-documents-v1.json) |
| Next queries | [`Inspect bound symbols and occurrences`](#query-result-authority-authority-near-symbol-v1) `authorityFile=:authorityFile` |

```sql
SELECT * FROM reportAuthorityDocuments WHERE (:authorityFile IS NULL OR authorityFile = :authorityFile) AND (:featureId IS NULL OR :featureId IN canonicalFeatureIds) ORDER BY authorityFile
```

<details><summary>Inspect 12 result row(s) inline</summary>

```json
[
  {
    "authorityFile": "contracts/serves-query-console.authority.json",
    "sourceFile": "src/console/serves-query-console.js",
    "mechanicsDeclared": 11,
    "mechanicsAuthorityBound": 11,
    "documentKind": "authority-declaration.v1",
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.admitted.contract.json",
    "documentKind": "governed-artifact-contract",
    "claimedFiles": [
      "src/console/serves-query-console.js",
      "contracts/serves-query-console.authority.json"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.admitted.contract.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.authority.complete.json",
    "documentKind": "authority-declaration-unmarked.v1",
    "claimedFiles": [
      "src/console/serves-query-console.mjs"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.complete.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.authority.draft.json",
    "documentKind": "authority-declaration.draft.v1",
    "claimedFiles": [
      "serves-query-console.runtime.impl.mjs"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.draft.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.binding.json",
    "documentKind": "authority-binding.v1",
    "claimedFiles": [
      "src/console/serves-query-console.js"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.binding.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.contract.json",
    "documentKind": "governed-artifact-contract",
    "claimedFiles": [
      "contracts/message.schema.json",
      "contracts/message.json",
      "contracts/project-message.authority.json",
      "src/project-message.mjs",
      "bin/run-message.mjs",
      "verification/verifies-message.mjs",
      "README.md",
      "architecture/closed-loop.mmd",
      "package.json",
      "architecture/decisions/cryptographic-lineage.md"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [
      "project-governed-messages"
    ],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.contract.json"
        }
      }
    ]
  },
  {
    "authorityFile": "contracts/serves-query-console.governed.contract.json",
    "documentKind": "governed-artifact-contract",
    "claimedFiles": [
      "src/console/console-authority-bundles.mjs",
      "src/console/console-routing-adapter.mjs",
      "src/console/console-validation-adapter.mjs",
      "src/console/contracts/console-request-routing.bundle.json",
      "src/console/contracts/console-snippet-retrieval.bundle.json",
      "src/console/console-snippet-adapter.mjs",
      "src/console/serves-query-console.mjs",
      "src/console/serves-query-console.conformant.mjs",
      "src/console/serves-query-console.projected.mjs"
    ],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [
      "delegate-console-authority",
      "project-console-contract",
      "serve-query-console"
    ],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.governed.contract.json"
        }
      }
    ]
  },
  {
    "authorityFile": "src/console/.governance/projections/governed-message-artifact-family.ledger.json",
    "documentKind": "governed-artifact-projection-ledger.v1",
    "claimedFiles": [],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "src/console/.governance/projections/governed-message-artifact-family.ledger.json"
        }
      }
    ]
  },
  {
    "authorityFile": "src/console/contracts/console-request-routing.bundle.json",
    "documentKind": "semantic-execution-bundle.v1",
    "claimedFiles": [],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-request-routing.bundle.json"
        }
      }
    ]
  },
  {
    "authorityFile": "src/console/contracts/console-snippet-retrieval.bundle.json",
    "documentKind": "semantic-execution-bundle.v1",
    "claimedFiles": [],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-snippet-retrieval.bundle.json"
        }
      }
    ]
  },
  {
    "authorityFile": "src/console/contracts/console-validation.bundle.json",
    "documentKind": "semantic-execution-bundle.v1",
    "claimedFiles": [],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-validation.bundle.json"
        }
      }
    ]
  },
  {
    "authorityFile": "src/console/governed-message-artifact-family/contracts/project-message.authority.json",
    "documentKind": "semantic-projection-authority.v1",
    "claimedFiles": [],
    "sourceFile": null,
    "mechanicsDeclared": null,
    "mechanicsAuthorityBound": null,
    "canonicalFeatureIds": [],
    "occurrenceCount": 0,
    "drillDowns": [
      {
        "queryId": "authority.authority-near-symbol.v1",
        "label": "Inspect bound source evidence",
        "parameterBindings": {
          "authorityFile": "src/console/governed-message-artifact-family/contracts/project-message.authority.json"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authority-authority-near-symbol-v1"></a>

#### `authority.authority-near-symbol.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Near Symbol |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` |
| Result hash | `sha256:738ff1925172699e5e165dcbed4b6e5a98948c87f8135961af702ce19f9f8e54` |
| Rows | 7018 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json) |
| Next queries | [`Inspect physical evidence`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) AND (:authorityFile IS NULL OR authorityHomeFile = :authorityFile)
```

Full 7018-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-items-by-disposition-v1"></a>

#### `subject-boundary.items-by-disposition.v1`

| Binding | Value |
|---|---|
| Purpose | Subject Boundary Items |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3ddeefdb2493e00e7021c129748933e87fa6fe5c7fa1b140e1538d8af86f6ede` |
| Result hash | `sha256:df6183da0e000c80d3dfa9abbdda95a2dc3d2817e28267989529a2c85769d969` |
| Rows | 18 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/subject-boundary-items-by-disposition-v1.json) |
| Next queries | [`Inspect exact inclusion or exclusion reason`](#query-result-subject-boundary-item-scope-reason-v1) `itemId=:itemId` |

```sql
SELECT * FROM reportSubjectItems WHERE (:disposition IS NULL OR disposition = :disposition) AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId
```

<details><summary>Inspect 18 result row(s) inline</summary>

```json
[
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-midnight-theme.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/loga-midnight-theme.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-student-access-messaging.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/loga-student-access-messaging.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.admitted.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.admitted.contract.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.admitted.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.complete.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.complete.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.complete.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.draft.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.draft.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.draft.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.authority.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.binding.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.binding.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.binding.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.contract.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.governed.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.governed.contract.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "contracts/serves-query-console.governed.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/traceability-metric-catalog.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/traceability-metric-catalog.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/workspace-file-system.contract.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "contracts/workspace-file-system.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/.governance/projections/governed-message-artifact-family.ledger.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "src/console/.governance/projections/governed-message-artifact-family.ledger.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "src/console/.governance/projections/governed-message-artifact-family.ledger.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-request-routing.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-request-routing.bundle.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-request-routing.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-snippet-retrieval.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-snippet-retrieval.bundle.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-snippet-retrieval.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-validation.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-validation.bundle.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "src/console/contracts/console-validation.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/governed-message-artifact-family/contracts/project-message.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect scope reason",
        "parameterBindings": {
          "itemId": "src/console/governed-message-artifact-family/contracts/project-message.authority.json"
        }
      },
      {
        "queryId": "authority.documents.v1",
        "label": "Inspect authority",
        "parameterBindings": {
          "authorityFile": "src/console/governed-message-artifact-family/contracts/project-message.authority.json"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-included-items-v1"></a>

#### `subject-boundary.included-items.v1`

| Binding | Value |
|---|---|
| Purpose | Included Subject Items |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:86ccec9fb998fd3f4ef516f0cbe33beb7c2b636d6ecd330ec487db7f7bf6f5ab` |
| Result hash | `sha256:cd5c1b08b0deec4eb5847b548b0bff3acf8ff2022be6f81216a2a59ac6b960c7` |
| Rows | 12 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/subject-boundary-included-items-v1.json) |
| Next queries | [`Inspect inclusion reason`](#query-result-subject-boundary-item-scope-reason-v1) `itemId=:itemId` |

```sql
SELECT * FROM reportSubjectItems WHERE disposition = 'IN_SUBJECT' AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId
```

<details><summary>Inspect 12 result row(s) inline</summary>

```json
[
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.admitted.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.admitted.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.complete.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.complete.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.draft.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.draft.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.authority.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.binding.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.binding.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.governed.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "contracts/serves-query-console.governed.contract.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/.governance/projections/governed-message-artifact-family.ledger.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "src/console/.governance/projections/governed-message-artifact-family.ledger.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-request-routing.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-request-routing.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-snippet-retrieval.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-snippet-retrieval.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-validation.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "src/console/contracts/console-validation.bundle.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/governed-message-artifact-family/contracts/project-message.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect inclusion reason",
        "parameterBindings": {
          "itemId": "src/console/governed-message-artifact-family/contracts/project-message.authority.json"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-excluded-items-v1"></a>

#### `subject-boundary.excluded-items.v1`

| Binding | Value |
|---|---|
| Purpose | Excluded Subject Items |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:afafdb3b9d69acd6c8a1d16c0247e29e22d25e96ccf54c0133cce6cc22d4f08c` |
| Result hash | `sha256:cd96c3ad8b9374dbccbc0e4a68319ba5b23dbda63c871e9baef49debad679788` |
| Rows | 6 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/subject-boundary-excluded-items-v1.json) |
| Next queries | [`Inspect exclusion reason`](#query-result-subject-boundary-item-scope-reason-v1) `itemId=:itemId` |

```sql
SELECT * FROM reportSubjectItems WHERE disposition = 'EXCLUDED' AND (:itemId IS NULL OR itemId = :itemId) ORDER BY evidenceClass, itemId
```

<details><summary>Inspect 6 result row(s) inline</summary>

```json
[
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-midnight-theme.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/loga-midnight-theme.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-student-access-messaging.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/composition-authorities/loga-student-access-messaging.authority.v1.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/traceability-metric-catalog.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/traceability-metric-catalog.json"
        }
      }
    ]
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/workspace-file-system.contract.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": [
      {
        "queryId": "subject-boundary.item-scope-reason.v1",
        "label": "Inspect exclusion reason",
        "parameterBindings": {
          "itemId": "contracts/workspace-file-system.contract.json"
        }
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-item-scope-reason-v1"></a>

#### `subject-boundary.item-scope-reason.v1`

| Binding | Value |
|---|---|
| Purpose | Subject Item Scope Reason |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:a3933b1341b539303541191b403c8cc9d2b6e51e484de9e49583c0852b34e435` |
| Result hash | `sha256:40f693882dd30b2a4526da2ae692795d3c51180d95e5c7907826260df09710bc` |
| Rows | 18 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/subject-boundary-item-scope-reason-v1.json) |
| Next queries | terminal physical/healing evidence |

```sql
SELECT evidenceClass, itemId, disposition, scopeReason FROM reportSubjectItems WHERE (:itemId IS NULL OR itemId = :itemId)
```

<details><summary>Inspect 18 result row(s) inline</summary>

```json
[
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-midnight-theme.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/composition-authorities/loga-student-access-messaging.authority.v1.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.admitted.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.complete.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.draft.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.binding.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/serves-query-console.governed.contract.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/traceability-metric-catalog.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "contracts/workspace-file-system.contract.json",
    "disposition": "EXCLUDED",
    "scopeReason": "document neither lives in nor claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/.governance/projections/governed-message-artifact-family.ledger.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-request-routing.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-snippet-retrieval.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/contracts/console-validation.bundle.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  },
  {
    "evidenceClass": "authority-document",
    "itemId": "src/console/governed-message-artifact-family/contracts/project-message.authority.json",
    "disposition": "IN_SUBJECT",
    "scopeReason": "document lives in or claims a target in the bounded subject",
    "drillDowns": []
  }
]
```

</details>

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-impact-source-reference-reverse-impact-v1"></a>

#### `impact.source-reference-reverse-impact.v1`

| Binding | Value |
|---|---|
| Purpose | Reverse Impact |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` |
| Result hash | `sha256:cb665978faaddad663457faec1c69043a98a68d11ad787cc1b0233ed872f5f92` |
| Rows | 7018 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json) |
| Next queries | [`Inspect missing lineage and healing candidates`](#query-result-healing-source-fact-candidates-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT sourceReferenceId, symbolId, authorityHomeFile, featureIds, scenarioIds, obligationIds, featureCoveragePosture FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId) AND (:symbolId IS NULL OR symbolId = :symbolId)
```

Full 7018-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-healing-source-fact-candidates-v1"></a>

#### `healing.source-fact-candidates.v1`

| Binding | Value |
|---|---|
| Purpose | Change and Healing |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:80ff9ca4e23a4da9a8312b08ba3e148f67675ef5c8c56d3a2d48c6991b2cfdbf` |
| Result hash | `sha256:6c5f966f9a8ce6ea91455807b749fdf14e1f971f8fb2115ec4f2079a90b119a3` |
| Rows | 6860 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json) |
| Next queries | [`Build authority evidence bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect inferred feature/scenario context`](#query-result-authoring-scenario-context-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect decision policy`](#query-result-authoring-decision-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect data shapes`](#query-result-authoring-object-shape-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect failure behavior`](#query-result-authoring-failure-policy-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect existing authority overlap`](#query-result-authoring-authority-overlap-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Build projection target`](#query-result-authoring-projection-target-v1) `symbolId=:symbolId`<br>[`Build proof vectors`](#query-result-authoring-proof-vector-candidates-v1) `symbolId=:symbolId` |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, symbolId, mechanic, featureCoveragePosture, authorityHomeFile FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId)
```

Full 6860-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-interface-execution-slice-v1"></a>

#### `authoring.interface-execution-slice.v1`

| Binding | Value |
|---|---|
| Purpose | Interface-to-Responsibility Slice |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c3366a48fc90431e4874916dba2eb03d7eb73d2b6fda23b841c87da63917debb` |
| Result hash | `sha256:057c4ab5a07afb6b87231b89297fccc64a2b32797c35c6e1641d48bf47b3a527` |
| Rows | 1451 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-interface-execution-slice-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM interfaceRows WHERE registered optional parameters match the bounded authoring subject
```

Full 1451-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-interface-execution-slice-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-responsibility-body-evidence-v1"></a>

#### `authoring.responsibility-body-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Responsibility Body Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:798add784465cc049ae5fafd026257b873551da34655e12252477cdc6ff57240` |
| Result hash | `sha256:4305d35c133a0d82ba8a1620b47bdba7ff051ac41d4a20d4769b85d2e73ebe37` |
| Rows | 693 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-responsibility-body-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM bodyRows WHERE registered optional parameters match the bounded authoring subject
```

Full 693-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-responsibility-body-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-decision-evidence-v1"></a>

#### `authoring.decision-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Decision Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1b742701efaeeecc5ca8f85fb4db7d8d1fc0b16c6692e41e1298393b848d5487` |
| Result hash | `sha256:85766697236a1eedeaf27e8f6fae8c522e37c9820af0005b5c5e9329a9fe7578` |
| Rows | 1255 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-decision-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM decisions WHERE registered optional parameters match the bounded authoring subject
```

Full 1255-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-decision-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-fallback-evidence-v1"></a>

#### `authoring.fallback-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Fallback and Missing-Value Policy |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:d4bcb3099a71a172a1d26e52f782473bd1a877fa57833757a02b38ec136c2039` |
| Result hash | `sha256:d067696995b9487ad14057560f7713e21df697468801e86f423d8cc54c3d0830` |
| Rows | 1638 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-fallback-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM fallbacks WHERE registered optional parameters match the bounded authoring subject
```

Full 1638-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-fallback-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-validation-evidence-v1"></a>

#### `authoring.validation-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Validation and Rejection Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:987e66b52ca7bcefd1c09b4a721f188302f1708c91bbf61e28c7de0e944ea807` |
| Result hash | `sha256:fa28de0704d3e318acfbe2674b647f1393eb1dd685cd945555db92ee91240fca` |
| Rows | 161 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-validation-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM validations WHERE registered optional parameters match the bounded authoring subject
```

Full 161-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-validation-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-failure-policy-evidence-v1"></a>

#### `authoring.failure-policy-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Exception and Failure Policy |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:8a66c42dfc3fa269b39827bd1fa2c0f6a64008dfd8c668e36d764b270f8e68b5` |
| Result hash | `sha256:fc188a783865b711b538f9e34e1d6b34e3763f40f2bead588cbb8bd3690881ac` |
| Rows | 329 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-failure-policy-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM failures WHERE registered optional parameters match the bounded authoring subject
```

Full 329-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-failure-policy-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-object-shape-evidence-v1"></a>

#### `authoring.object-shape-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Object Shape Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:322a74e7fd1f1bbfaf8e014194ceaafd06dc283e624a96aa398afec32ba04621` |
| Result hash | `sha256:e6aaf54cec3cc6f468db2d52b7e7d5a3ad95d375eec8666cbc17b9f9b3532fd4` |
| Rows | 2538 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-object-shape-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM objectShapes WHERE registered optional parameters match the bounded authoring subject
```

Full 2538-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-object-shape-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-result-contract-evidence-v1"></a>

#### `authoring.result-contract-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Result Contract Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:e295e5c199b8e405f479624723ee975cc1a4ab89bb1f8f9a2a309a4e183dd0c3` |
| Result hash | `sha256:6f2ed725555ed62d210188aad4147594c14e7d0ad88a218f7060c0176323580a` |
| Rows | 1053 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-result-contract-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM resultContracts WHERE registered optional parameters match the bounded authoring subject
```

Full 1053-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-result-contract-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-serialization-evidence-v1"></a>

#### `authoring.serialization-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Serialization Profile |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:66d9960a07465b5af9e5c49cbadb38dc781b1664bae8f38f2a729a69b8c957f0` |
| Result hash | `sha256:c6874f84db0b4e85b3d88db74db1bf05cf77382f0ffffe9b0f36c8bb98570ce3` |
| Rows | 87 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-serialization-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM serializations WHERE registered optional parameters match the bounded authoring subject
```

Full 87-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-serialization-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-normalization-evidence-v1"></a>

#### `authoring.normalization-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Normalization and Translation |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:e19f5b592048026bb385df580778f608c57c298fd8aea8cc7ae0b90637bd8dc8` |
| Result hash | `sha256:1c1e8cf2652b7968410a274ef78705a92e8ba68eca5e35b37b4f658ba062d5ae` |
| Rows | 136 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-normalization-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM normalizations WHERE registered optional parameters match the bounded authoring subject
```

Full 136-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-normalization-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-iteration-evidence-v1"></a>

#### `authoring.iteration-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Iteration Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1b7b1d5154de8375af5dc76f91ec87f46affe2bbe4ff7af27599261f1684bcef` |
| Result hash | `sha256:2cdbe49ee9646cfc9bf91bd5cb60a8b63c073df2a3f4a9fac83806a129410c52` |
| Rows | 401 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-iteration-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM iterations WHERE registered optional parameters match the bounded authoring subject
```

Full 401-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-iteration-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-state-transition-evidence-v1"></a>

#### `authoring.state-transition-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | State-Transition Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:ead8095a81ee48e74190abe6541bf069075d94dbb900d5dce6a1755cc18fcd7f` |
| Result hash | `sha256:ab4c82a55c0bb146168cd5c3e06ed2437036cc484f696da129f2d937d402fa33` |
| Rows | 315 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-state-transition-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM stateTransitions WHERE registered optional parameters match the bounded authoring subject
```

Full 315-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-state-transition-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-data-flow-slice-v1"></a>

#### `authoring.data-flow-slice.v1`

| Binding | Value |
|---|---|
| Purpose | Data-Flow Slice |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:93b7ed049ac305c55e6cd12a887b18f5a594e603c2b930996db52058b54a29bb` |
| Result hash | `sha256:eef7c78e95de10d9ae44392513b2aa58dd8deaa8ef2070ac429fa022732fc5e4` |
| Rows | 693 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-data-flow-slice-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM dataFlowSlices WHERE registered optional parameters match the bounded authoring subject
```

Full 693-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-data-flow-slice-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-authority-overlap-v1"></a>

#### `authoring.authority-overlap.v1`

| Binding | Value |
|---|---|
| Purpose | Existing Authority Overlap |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:9be4fb88b4dc0cc75eea562b505a03ab159223bacb14d98809a9c74086e70397` |
| Result hash | `sha256:53487eb859ef187e496e92b417aa0ddaf91bb55a7113c988e886628a3dca2cf7` |
| Rows | 6870 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-authority-overlap-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM overlaps WHERE registered optional parameters match the bounded authoring subject
```

Full 6870-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-authority-overlap-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-scenario-context-v1"></a>

#### `authoring.scenario-context.v1`

| Binding | Value |
|---|---|
| Purpose | Feature and Scenario Context |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:97b4eb2ae7b3a88a110536b2a42857be7834f14e5efe6f2386f330e85c461f36` |
| Result hash | `sha256:596fcf09846f061532ff0b23ab7ed40ad4b6aeb0f159bbb81671841288b11e7e` |
| Rows | 6870 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-scenario-context-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM scenarioContexts WHERE registered optional parameters match the bounded authoring subject
```

Full 6870-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-scenario-context-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-projection-target-v1"></a>

#### `authoring.projection-target.v1`

| Binding | Value |
|---|---|
| Purpose | Projection Target Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:10dd92a9a30e97cac4ed07f7bdc5c501de66ced1d0e732a86e659e7d1dcf1505` |
| Result hash | `sha256:0f8c770f5e2d848b12fc957e364e5a984364caa29ee8727bb3c3f075231d60ba` |
| Rows | 693 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-projection-target-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM projectionTargets WHERE registered optional parameters match the bounded authoring subject
```

Full 693-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-projection-target-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-proof-vector-candidates-v1"></a>

#### `authoring.proof-vector-candidates.v1`

| Binding | Value |
|---|---|
| Purpose | Equivalence and Proof Candidates |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3116890ff31c7b4c5a80c14a67253c9f6312b023eecb25ea3fff8f9382ca4308` |
| Result hash | `sha256:587907fcfac7cea8fcee0676833af09cd82dabaa1c9e7e18b1135af237d09f96` |
| Rows | 693 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-proof-vector-candidates-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM proofVectors WHERE registered optional parameters match the bounded authoring subject
```

Full 693-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-proof-vector-candidates-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-contract-map-v1"></a>

#### `authoring.contract-map.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Contract Map |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:2cab84afc1cf2e4d424570646d118218f21b67d5012f16f5c50afde84898a08a` |
| Result hash | `sha256:c937a111b29f531e9648da3292d3cadc4534582833828b93e2f9d70e388f50c5` |
| Rows | 23 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-contract-map-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM contractMapRows WHERE registered optional parameters match the bounded authoring subject
```

Full 23-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-contract-map-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-semantic-authority-evidence-bundle-v1"></a>

#### `authoring.semantic-authority-evidence-bundle.v1`

| Binding | Value |
|---|---|
| Purpose | Semantic Authority Evidence Bundle |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3348a52e9913d17e1a2b1e9b9020c60a879e3d9107aa5673643cb49b3e9260ca` |
| Result hash | `sha256:c0d8a8c82eed6854b2d4297504b1394c8d4afe1a26ecc569574b59545d5491df` |
| Rows | 6870 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-semantic-authority-evidence-bundle-v1.json) |
| Next queries | [`Inspect deterministic readiness`](#query-result-authoring-readiness-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM bundles WHERE registered optional parameters match the bounded authoring subject
```

Full 6870-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-semantic-authority-evidence-bundle-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-readiness-v1"></a>

#### `authoring.readiness.v1`

| Binding | Value |
|---|---|
| Purpose | Authoring Readiness |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3be2d3d609c7431f172b6d174112f5f225fe9471c92b5cb96099181c51471470` |
| Result hash | `sha256:b3a8d0e3f1019924369a1b2381ea26357842d756023057a86f3812b793eb61a0` |
| Rows | 6870 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-readiness-v1.json) |
| Next queries | terminal physical/healing evidence |

```sql
SELECT * FROM readinessRows WHERE registered optional parameters match the bounded authoring subject
```

Full 6870-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-readiness-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-reconciliation-v1"></a>

#### `authoring.reconciliation.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Authoring Reconciliation |
| Version | `1.0.0` |
| Index ID | `sha256:1ad73b53cc6765676ffa894e270fb3829a5cd0b51ca31ae52c7f9697d58b2c73` |
| Scan ID | `5a48d105b6b3326d0a15f9beadfdfed63efbbbb9c41d8fd4ec48e05aea9e8c29` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:326068c7279d28afe22f7ed87720a096fc7d1e1d0cd70604e89a034a56185dfd` |
| Result hash | `sha256:6f7010d848ccc2ed1b803da9dcd33e646a15c0df66271b5a409cc7f323d145ee` |
| Rows | 1 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-reconciliation-v1.json) |
| Next queries | [`Inspect every candidate readiness disposition`](#query-result-authoring-readiness-v1) |

```sql
SELECT * FROM authoringReconciliation
```

<details><summary>Inspect 1 result row(s) inline</summary>

```json
[
  {
    "disposition": "PASSED",
    "healingCandidates": 6860,
    "candidatesWithAuthoringEvidenceBundle": 6860,
    "candidatesWithCompleteQueryProvenance": 6860,
    "candidatesWithUnresolvedRequiredEvidence": 6860,
    "candidatesReadyForSemanticAuthorityAuthoring": 0,
    "candidatesReadyForProjection": 6369,
    "declaredResponsibilities": 10,
    "declaredResponsibilityBundles": 10,
    "declaredResponsibilitiesBlockedByInterface": 7,
    "declaredResponsibilitiesReadyForProjection": 7,
    "declaredResponsibilitiesProjectableWithInterfaceEvidenceGap": 7,
    "missingAuthoringQueries": 0,
    "incompleteEvidenceBundles": 0,
    "missingSourceReferences": 0,
    "unresolvedCallPaths": 1501,
    "missingScenarioContexts": 6860,
    "authorityOverlapNotEvaluated": 0,
    "proofVectorMissing": 491,
    "contractMapMissing": 0,
    "drillDowns": [
      {
        "queryId": "authoring.readiness.v1",
        "label": "Inspect candidate readiness",
        "parameterBindings": {}
      }
    ]
  }
]
```

</details>

<details><summary>Inspect 20 rendered claim pointer(s) inline</summary>

- `/queryLineage/authoringReconciliation/disposition` ← `/rows/0/disposition` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/healingCandidates` ← `/rows/0/healingCandidates` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/candidatesWithAuthoringEvidenceBundle` ← `/rows/0/candidatesWithAuthoringEvidenceBundle` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/candidatesWithCompleteQueryProvenance` ← `/rows/0/candidatesWithCompleteQueryProvenance` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/candidatesWithUnresolvedRequiredEvidence` ← `/rows/0/candidatesWithUnresolvedRequiredEvidence` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/candidatesReadyForSemanticAuthorityAuthoring` ← `/rows/0/candidatesReadyForSemanticAuthorityAuthoring` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/candidatesReadyForProjection` ← `/rows/0/candidatesReadyForProjection` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/declaredResponsibilities` ← `/rows/0/declaredResponsibilities` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/declaredResponsibilityBundles` ← `/rows/0/declaredResponsibilityBundles` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/declaredResponsibilitiesBlockedByInterface` ← `/rows/0/declaredResponsibilitiesBlockedByInterface` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/declaredResponsibilitiesReadyForProjection` ← `/rows/0/declaredResponsibilitiesReadyForProjection` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/declaredResponsibilitiesProjectableWithInterfaceEvidenceGap` ← `/rows/0/declaredResponsibilitiesProjectableWithInterfaceEvidenceGap` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/missingAuthoringQueries` ← `/rows/0/missingAuthoringQueries` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/incompleteEvidenceBundles` ← `/rows/0/incompleteEvidenceBundles` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/missingSourceReferences` ← `/rows/0/missingSourceReferences` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/unresolvedCallPaths` ← `/rows/0/unresolvedCallPaths` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/missingScenarioContexts` ← `/rows/0/missingScenarioContexts` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/authorityOverlapNotEvaluated` ← `/rows/0/authorityOverlapNotEvaluated` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/proofVectorMissing` ← `/rows/0/proofVectorMissing` (CLASSIFICATION)
- `/queryLineage/authoringReconciliation/contractMapMissing` ← `/rows/0/contractMapMissing` (CLASSIFICATION)

</details>

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains `NOT_EVALUATED` unless a separate execution receipt is supplied.

