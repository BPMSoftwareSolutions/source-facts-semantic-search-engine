# Source Facts Self-Governance Report

Honest Feature Coverage and Scenario Evaluation View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T18:05:20.456Z |
| **Repository** | source-facts-semantic-search-engine |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Source index ID** | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| **Scan ID** | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| **Query catalog** | `self-governance-query-catalog.v1` |
| **Query catalog hash** | `sha256:a06ef7954106d4736dbb3d98f3b361635cea2e38901452e81fcbead55fb25c42` |
| **Query receipts** | 53 executed / 53 valid |
| **Render reconciliation** | `PASSED` |
| **Unsupported factual claims** | 0 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

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
| Mechanics without scenario lineage | [6,652](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with canonical scenario lineage | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with proposed scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents without scenario lineage | [10](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Unresolved responsibility-evidence clusters | [694](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
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

- [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) — 1 row(s), result `sha256:fa7c52974b965abf5c5bac2709949696b14dd2abfabb8fe775248d218713a573`
- [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) — 1 row(s), result `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a`
- [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 694 row(s), result `sha256:2366c89d50c657ab883db6e06384e9a77c1fb681d0d1c129762e98c7464c030e`

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

Query result: [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 694 row(s), result `sha256:2366c89d50c657ab883db6e06384e9a77c1fb681d0d1c129762e98c7464c030e`

| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility | Query result |
|---|---|---|---:|---|---|---|
| `src/governance/authoring-evidence-query-catalog.js#buildsAuthoringCollections` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, serialization, state-mutation, validation | [278](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#generatesConnectiveTissue` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | [221](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-report-query-lineage.js#reconcilesReportQueryLineage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, throw, validation | [129](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/web/html-projector.js#projectsHtmlDocument` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [101](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/report-drill-down-query-catalog.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | branch, fallback, object-construction | [99](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-feature-coverage.js#projectsFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [86](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/call-graph.js#projectsCliEntryPointCallGraph` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw | [83](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/projects-governed-console-contract.js#buildsConsoleGovernedContract` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, state-mutation | [83](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#validatesQueryReceiptBinding` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, throw | [80](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-self-governance-report.js#projectsSelfGovernanceReport` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [76](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#resolveMetric` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [74](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-report-query-lineage.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [67](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
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
| `src/governance/report-drill-down-query-catalog.js#buildsOccurrenceEvidence` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, iteration, object-construction | [33](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
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
| Static mechanics without canonical or proposed lineage | [6,652](#query-result-feature-coverage-unclassified-inventory-v1) | [`NO_SCENARIO_LINEAGE`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Authority documents without canonical scenario lineage | [10](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Admitted know-how without canonical obligation lineage | [0](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Healing drafts without a canonical scenario target | [0](#query-result-feature-coverage-unclassified-inventory-v1) | [`HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |

### Mechanics without lineage

| Mechanic | Occurrences | Files | Query |
|---|---:|---:|---|
| branch | [1,241](#query-result-feature-coverage-unlined-mechanics-v1) | [78](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| exception-handling | [103](#query-result-feature-coverage-unlined-mechanics-v1) | [26](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| fallback | [1,593](#query-result-feature-coverage-unlined-mechanics-v1) | [76](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| iteration | [393](#query-result-feature-coverage-unlined-mechanics-v1) | [64](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| normalization | [136](#query-result-feature-coverage-unlined-mechanics-v1) | [29](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| object-construction | [2,404](#query-result-feature-coverage-unlined-mechanics-v1) | [86](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| retry | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| serialization | [87](#query-result-feature-coverage-unlined-mechanics-v1) | [28](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| state-mutation | [312](#query-result-feature-coverage-unlined-mechanics-v1) | [56](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| throw | [221](#query-result-feature-coverage-unlined-mechanics-v1) | [42](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
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
| Healing candidates | [6652](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with authoring evidence bundle | [6652](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with complete query provenance | [6652](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates with unresolved required evidence | [6652](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates ready for semantic authority authoring | [0](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
| Candidates ready for projection | [6258](#query-result-authoring-reconciliation-v1) | [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) |
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
| Registered factual claim values | 8929 |
| Claims with query pointers | 8929 |
| Claims with required drill-down path | 8929 |
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
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | Executive Summary | 1 | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` | `sha256:fa7c52974b965abf5c5bac2709949696b14dd2abfabb8fe775248d218713a573` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | Executive Summary | 1 | `sha256:b230d306d1b6235c356f228a8fbe154b94ded15c1d017b8459b2c4db455fc944` | `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.proposal-evidence.v1`](#query-result-feature-coverage-proposal-evidence-v1) | Feature Coverage Proposals | 0 | `sha256:24a7bd5de2d4710e8917e12ac89f18418667b3ed56690d4a93dcc04c09b11411` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.live-inference.v1`](#query-result-feature-coverage-live-inference-v1) | Live LLM Feature-Inference Evaluations | 0 | `sha256:6d426be0037939f720654e271d2debfe3737345106909d22a6ef600b792c0bbc` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) | Unresolved Responsibility Evidence | 694 | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` | `sha256:2366c89d50c657ab883db6e06384e9a77c1fb681d0d1c129762e98c7464c030e` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | Canonical Feature Drill-Down | 4 | `sha256:63140f2c93dfaff428cf1792965fca681c1dc8459b409af57bac1ed680df6edb` | `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) | Evidence Without Canonical Lineage | 1 | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` | `sha256:a0d34ae85d5448ebb5dffb1d5e5efa95f4a4f83a365b83ae648abe8e9b62ab73` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | Evidence Without Canonical Lineage | 11 | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` | `sha256:6f8290a9545debd248c722fba2651b3208a1bfa0ce1354b681955ccfd4042948` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | Subject Boundary | 1 | `sha256:bb62a3b13d996b599f8ff93979338026e619914bc0972f42c77d1211de60d3bb` | `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | Canonical Features | 4 | `sha256:b507b9960f74168182112bb151a954844379cf125b19fe84166cbc25a5b68de3` | `sha256:063171974f526756fb724236ea5b36ef9e0966af52c3e7bb29acd8a1133f5701` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.feature-scenarios.v1`](#query-result-feature-coverage-feature-scenarios-v1) | Feature Scenarios | 6 | `sha256:6971565a6037b39edde137eb108803f4360451bbffe1c34b9ed28dccb3e45f7b` | `sha256:3fb54aaf62148af47a5ced46cdd37fc624036b0648beb5061fd1c55389f839a9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | Canonical Scenarios | 6 | `sha256:713f34d346172b89a6d2641cabe6b68b4cdcfab36d97ef84c6aacebaec1ea8d9` | `sha256:3a98900c82bacbbcbb9465b913bb85114c4522861d5fed8059724415fd5fa91d` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.by-structural-status.v1`](#query-result-scenario-conformance-by-structural-status-v1) | Structural Status | 6 | `sha256:c57d1e34cc94400a0112b0f630664f25d804b761ccfce4d6203ef63e1a1838be` | `sha256:9dda679bcce7505b7e4c07910fb3d137b021030e23ea5f6b216b6d335d3630e9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | Scenario Responsibilities | 10 | `sha256:4ebd6c77ccdbd9cb5424de261939db79c47da42a230c2b08f309a9682eb18cc1` | `sha256:d27ae627cf1fe9610ffeb16a31979828fd9dde280261e4e991cf637f792f9343` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | Scenario Call Paths | 10 | `sha256:fbd7a1a7480a478232d79b077bc2dc1ee7820e72195339b31c479e06046150f6` | `sha256:4ef4a19f76ee643e261cbe4cc173494cd45c07a7d5910e76bbe2c4d42c16ece5` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-file.v1`](#query-result-feature-coverage-unlined-mechanics-by-file-v1) | Unlined Mechanics by File | 510 | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` | `sha256:739a21b0103deab9950ffe15a4724072a8383f7aff9cee5943f4f2e2134bd962` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | Unlined Mechanics by Responsibility | 1877 | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` | `sha256:5621546d3c72f409fe1340fca5355a4fce25d036aea22ae0d2a943e85aa80e85` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-symbol.v1`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1) | Unlined Mechanics by Symbol | 1878 | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` | `sha256:5f1dd5259d9a1b439a3af38684fd792ee3084c1dc5a4cd1fb1e97f42dc1eb187` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | Exact Unlined Occurrences | 6652 | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` | `sha256:9052c5ba1b7594150dbc6fba2ca3a562695b5fcc27534b58aa94e0f76574748e` | `RELATIONAL_QUERY_EXECUTED` |
| [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | Physical Source Evidence | 6810 | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` | `sha256:ee51eaebbe9ddc9cdae1df1f2aecd9f8b2ca763274904281acc6bfa26ad5fd68` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | Interface Reachability | 989 | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` | `sha256:c9e18ccb231680f556128df835cd10d39bc39bddf7c96510ae5cf22b12fc82d3` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | Reverse Callers | 6682 | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` | `sha256:1351033960a7411fb09e6372e15045cafdcbd0cdc977941fe66575c7a72f3ac9` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | Forward Callees | 6682 | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` | `sha256:502cf1d181c40a3128d781ff6925b0b83fe3271ef06771e019a24d380803d303` | `RELATIONAL_QUERY_EXECUTED` |
| [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | Responsibility Cluster | 694 | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` | `sha256:2383702e6dfe68dd8a74e23794b464879e4c8dbbd4d645a8b7fbdd3f6e8478ca` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.documents.v1`](#query-result-authority-documents-v1) | Authority Lineage | 12 | `sha256:aa543b2c7ab5577f034bd1257164fc69ec434efa54926c34f63bc305255f5c31` | `sha256:1292556b29e7ad54fc5555e8ed6c07d425cbc6c6c0b5292a27c025de41fa4d0f` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | Authority Near Symbol | 6810 | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` | `sha256:a795bbd80bb28727e91e1857a7cc699b799272f7fbdb6a24f1b2af2149164257` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.items-by-disposition.v1`](#query-result-subject-boundary-items-by-disposition-v1) | Subject Boundary Items | 18 | `sha256:3ddeefdb2493e00e7021c129748933e87fa6fe5c7fa1b140e1538d8af86f6ede` | `sha256:df6183da0e000c80d3dfa9abbdda95a2dc3d2817e28267989529a2c85769d969` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.included-items.v1`](#query-result-subject-boundary-included-items-v1) | Included Subject Items | 12 | `sha256:86ccec9fb998fd3f4ef516f0cbe33beb7c2b636d6ecd330ec487db7f7bf6f5ab` | `sha256:cd5c1b08b0deec4eb5847b548b0bff3acf8ff2022be6f81216a2a59ac6b960c7` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.excluded-items.v1`](#query-result-subject-boundary-excluded-items-v1) | Excluded Subject Items | 6 | `sha256:afafdb3b9d69acd6c8a1d16c0247e29e22d25e96ccf54c0133cce6cc22d4f08c` | `sha256:cd96c3ad8b9374dbccbc0e4a68319ba5b23dbda63c871e9baef49debad679788` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | Subject Item Scope Reason | 18 | `sha256:a3933b1341b539303541191b403c8cc9d2b6e51e484de9e49583c0852b34e435` | `sha256:40f693882dd30b2a4526da2ae692795d3c51180d95e5c7907826260df09710bc` | `RELATIONAL_QUERY_EXECUTED` |
| [`impact.source-reference-reverse-impact.v1`](#query-result-impact-source-reference-reverse-impact-v1) | Reverse Impact | 6810 | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` | `sha256:040ae4bfd51b4b3d9043d383c5981b5886ebc4e57334b01de94816bd70a97016` | `RELATIONAL_QUERY_EXECUTED` |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | Change and Healing | 6652 | `sha256:80ff9ca4e23a4da9a8312b08ba3e148f67675ef5c8c56d3a2d48c6991b2cfdbf` | `sha256:0e89226a87483404d555ccfd76e21708e98081881d214de34b5ced605ea6db16` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.interface-execution-slice.v1`](#query-result-authoring-interface-execution-slice-v1) | Interface-to-Responsibility Slice | 1347 | `sha256:c3366a48fc90431e4874916dba2eb03d7eb73d2b6fda23b841c87da63917debb` | `sha256:0e4a4c536d5391956ec06df01d897a6bfa0d7c6feb2a050e61447dcad0b3301c` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.responsibility-body-evidence.v1`](#query-result-authoring-responsibility-body-evidence-v1) | Responsibility Body Evidence | 686 | `sha256:798add784465cc049ae5fafd026257b873551da34655e12252477cdc6ff57240` | `sha256:f0ca28b4f74fa0505bce0372142396520ace6404fc08cb78bad2b5adb256600e` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.decision-evidence.v1`](#query-result-authoring-decision-evidence-v1) | Decision Semantics | 1241 | `sha256:1b742701efaeeecc5ca8f85fb4db7d8d1fc0b16c6692e41e1298393b848d5487` | `sha256:aa4763c25d453f3e79a37ff498d30004f08305330eca3283021cc39effd53ac4` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.fallback-evidence.v1`](#query-result-authoring-fallback-evidence-v1) | Fallback and Missing-Value Policy | 1593 | `sha256:d4bcb3099a71a172a1d26e52f782473bd1a877fa57833757a02b38ec136c2039` | `sha256:747ae1cec0fe23a4604e1bb1558d6359849dc3ed4cf80868de2291b211015afc` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.validation-evidence.v1`](#query-result-authoring-validation-evidence-v1) | Validation and Rejection Semantics | 161 | `sha256:987e66b52ca7bcefd1c09b4a721f188302f1708c91bbf61e28c7de0e944ea807` | `sha256:b924f38661719fe186ee084762b311b02e8aaf9d5bf065f04f39ed4275983db9` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.failure-policy-evidence.v1`](#query-result-authoring-failure-policy-evidence-v1) | Exception and Failure Policy | 325 | `sha256:8a66c42dfc3fa269b39827bd1fa2c0f6a64008dfd8c668e36d764b270f8e68b5` | `sha256:262c8b7c3970a7fbfe509cc573c0e6833f2caa0a8298c9577d707247f3284879` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.object-shape-evidence.v1`](#query-result-authoring-object-shape-evidence-v1) | Object Shape Evidence | 2404 | `sha256:322a74e7fd1f1bbfaf8e014194ceaafd06dc283e624a96aa398afec32ba04621` | `sha256:e9b24652b504e67d96ae9dadec267a75e994354ad353b745410ee926c43f3cc1` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.result-contract-evidence.v1`](#query-result-authoring-result-contract-evidence-v1) | Result Contract Evidence | 1033 | `sha256:e295e5c199b8e405f479624723ee975cc1a4ab89bb1f8f9a2a309a4e183dd0c3` | `sha256:1ff23a8677a4c4c54722ed9c05a67ea935c19eac8cf0ca9852ef484b41164c31` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.serialization-evidence.v1`](#query-result-authoring-serialization-evidence-v1) | Serialization Profile | 87 | `sha256:66d9960a07465b5af9e5c49cbadb38dc781b1664bae8f38f2a729a69b8c957f0` | `sha256:f4e26563121d542e197da183d2636ffa8467c039b1b48274c40663a2a400fb13` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.normalization-evidence.v1`](#query-result-authoring-normalization-evidence-v1) | Normalization and Translation | 136 | `sha256:e19f5b592048026bb385df580778f608c57c298fd8aea8cc7ae0b90637bd8dc8` | `sha256:80319d590c661e70f3dbf3c8b70929fd5f3a80094d1b5f9174f9dd6216ad0dbd` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.iteration-evidence.v1`](#query-result-authoring-iteration-evidence-v1) | Iteration Semantics | 393 | `sha256:1b7b1d5154de8375af5dc76f91ec87f46affe2bbe4ff7af27599261f1684bcef` | `sha256:233f2ef7ce7549ce9936920b5ff7707b6e1f489cbdc392a0e85de85028591840` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.state-transition-evidence.v1`](#query-result-authoring-state-transition-evidence-v1) | State-Transition Semantics | 312 | `sha256:ead8095a81ee48e74190abe6541bf069075d94dbb900d5dce6a1755cc18fcd7f` | `sha256:3bf2c4f273477522d7d49cf1a17ef45dfad3e4902e282de314c944d72bf30509` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.data-flow-slice.v1`](#query-result-authoring-data-flow-slice-v1) | Data-Flow Slice | 686 | `sha256:93b7ed049ac305c55e6cd12a887b18f5a594e603c2b930996db52058b54a29bb` | `sha256:2a9e6fabb6b0a92bc374f3ff733f52efc2b8eb8fd167e8407ea87bc6a91e45ba` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.authority-overlap.v1`](#query-result-authoring-authority-overlap-v1) | Existing Authority Overlap | 6662 | `sha256:9be4fb88b4dc0cc75eea562b505a03ab159223bacb14d98809a9c74086e70397` | `sha256:0bb6353d16d85276905281a978aafdad60de66dbc8c54f4050a4dafa12d65611` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.scenario-context.v1`](#query-result-authoring-scenario-context-v1) | Feature and Scenario Context | 6662 | `sha256:97b4eb2ae7b3a88a110536b2a42857be7834f14e5efe6f2386f330e85c461f36` | `sha256:aec07161003b46984f79e2ecd7f86adb049f7c89662af83388ce2bd3459826de` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.projection-target.v1`](#query-result-authoring-projection-target-v1) | Projection Target Evidence | 686 | `sha256:10dd92a9a30e97cac4ed07f7bdc5c501de66ced1d0e732a86e659e7d1dcf1505` | `sha256:c702946c3665be5394f2f52fe1ac7e4e4099f47c021f9874b9a6424acc4cfb8f` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.proof-vector-candidates.v1`](#query-result-authoring-proof-vector-candidates-v1) | Equivalence and Proof Candidates | 686 | `sha256:3116890ff31c7b4c5a80c14a67253c9f6312b023eecb25ea3fff8f9382ca4308` | `sha256:7c4da6fd1a7abd136a3f3926ae85936cc809745a031ec036bdb4ee0a9de99280` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.contract-map.v1`](#query-result-authoring-contract-map-v1) | Authority Contract Map | 23 | `sha256:2cab84afc1cf2e4d424570646d118218f21b67d5012f16f5c50afde84898a08a` | `sha256:c937a111b29f531e9648da3292d3cadc4534582833828b93e2f9d70e388f50c5` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.semantic-authority-evidence-bundle.v1`](#query-result-authoring-semantic-authority-evidence-bundle-v1) | Semantic Authority Evidence Bundle | 6662 | `sha256:3348a52e9913d17e1a2b1e9b9020c60a879e3d9107aa5673643cb49b3e9260ca` | `sha256:3c8aa52c047ea6dbefcdff133b9317f1dfd06c2528c28fcf0361683011bdd5d2` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.readiness.v1`](#query-result-authoring-readiness-v1) | Authoring Readiness | 6662 | `sha256:3be2d3d609c7431f172b6d174112f5f225fe9471c92b5cb96099181c51471470` | `sha256:3876577dbc2c5db400e724e66c1283bc4f1ba29e69804db3983aaa4b347f5146` | `RELATIONAL_QUERY_EXECUTED` |
| [`authoring.reconciliation.v1`](#query-result-authoring-reconciliation-v1) | Authority Authoring Reconciliation | 1 | `sha256:326068c7279d28afe22f7ed87720a096fc7d1e1d0cd70604e89a034a56185dfd` | `sha256:a3813dd48d6188bd9c1fc39ff75819cff594ce0c850ff7d56c206dc6c5702219` | `RELATIONAL_QUERY_EXECUTED` |

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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` |
| Result hash | `sha256:fa7c52974b965abf5c5bac2709949696b14dd2abfabb8fe775248d218713a573` |
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
    "unresolvedEvidenceClusters": 694,
    "supportingImplementationClusters": 47,
    "responsibilityEvidenceClusters": 647,
    "confirmedFeatureCandidateClusters": 0,
    "capabilityRelationsProposed": 0,
    "liveInferenceEvaluations": 0,
    "duplicateProposalsPrevented": 0,
    "mechanicsWithCanonicalLineage": 0,
    "mechanicsWithProposedLineage": 158,
    "mechanicsWithAmbiguousLineage": 0,
    "mechanicsWithoutLineage": 6652,
    "authorityWithCanonicalLineage": 2,
    "authorityWithProposedLineage": 0,
    "authorityWithAmbiguousLineage": 0,
    "authorityWithoutLineage": 10,
    "unclassifiedMechanics": 6652,
    "byPosture": {
      "FEATURE_COVERAGE_MISSING": 6652,
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` |
| Result hash | `sha256:2366c89d50c657ab883db6e06384e9a77c1fb681d0d1c129762e98c7464c030e` |
| Rows | 694 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json) |
| Next queries | [`Inspect individual cluster`](#query-result-responsibility-evidence-cluster-by-id-v1) |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters ORDER BY modulePath, responsibility
```

Full 694-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

Full 8612-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

<a id="query-result-scenario-conformance-drilldown-v1"></a>

#### `scenario-conformance.drilldown.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Feature Drill-Down |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` |
| Result hash | `sha256:a0d34ae85d5448ebb5dffb1d5e5efa95f4a4f83a365b83ae648abe8e9b62ab73` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` |
| Result hash | `sha256:6f8290a9545debd248c722fba2651b3208a1bfa0ce1354b681955ccfd4042948` |
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
    "occurrenceCount": 1241,
    "fileCount": 78,
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
    "occurrenceCount": 103,
    "fileCount": 26,
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
    "occurrenceCount": 1593,
    "fileCount": 76,
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
    "occurrenceCount": 393,
    "fileCount": 64,
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
    "occurrenceCount": 2404,
    "fileCount": 86,
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
    "occurrenceCount": 312,
    "fileCount": 56,
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
    "occurrenceCount": 221,
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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

<a id="query-result-feature-coverage-features-v1"></a>

#### `feature-coverage.features.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Features |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` |
| Result hash | `sha256:739a21b0103deab9950ffe15a4724072a8383f7aff9cee5943f4f2e2134bd962` |
| Rows | 510 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json) |
| Next queries | [`Inspect responsibilities`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) `mechanic=:mechanic` `modulePath=:modulePath` |

```sql
SELECT modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) GROUP BY modulePath, mechanic ORDER BY occurrenceCount DESC, modulePath
```

Full 510-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-responsibility-v1"></a>

#### `feature-coverage.unlined-mechanics-by-responsibility.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Responsibility |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` |
| Result hash | `sha256:5621546d3c72f409fe1340fca5355a4fce25d036aea22ae0d2a943e85aa80e85` |
| Rows | 1877 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json) |
| Next queries | [`Inspect interface reachability`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect occurrences`](#query-result-feature-coverage-unlined-occurrences-v1) `responsibility=:responsibility` |

```sql
SELECT modulePath, responsibility, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) GROUP BY modulePath, responsibility, mechanic ORDER BY occurrenceCount DESC
```

Full 1877-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-symbol-v1"></a>

#### `feature-coverage.unlined-mechanics-by-symbol.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Symbol |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` |
| Result hash | `sha256:5f1dd5259d9a1b439a3af38684fd792ee3084c1dc5a4cd1fb1e97f42dc1eb187` |
| Rows | 1878 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolId=:symbolId` |

```sql
SELECT symbolId, symbolName, modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY symbolId, symbolName, modulePath, mechanic ORDER BY occurrenceCount DESC
```

Full 1878-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-occurrences-v1"></a>

#### `feature-coverage.unlined-occurrences.v1`

| Binding | Value |
|---|---|
| Purpose | Exact Unlined Occurrences |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` |
| Result hash | `sha256:9052c5ba1b7594150dbc6fba2ca3a562695b5fcc27534b58aa94e0f76574748e` |
| Rows | 6652 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json) |
| Next queries | [`Inspect physical source references`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) AND (:responsibility IS NULL OR responsibility = :responsibility) ORDER BY modulePath, startLine
```

Full 6652-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-source-facts-occurrence-source-references-v1"></a>

#### `source-facts.occurrence-source-references.v1`

| Binding | Value |
|---|---|
| Purpose | Physical Source Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` |
| Result hash | `sha256:ee51eaebbe9ddc9cdae1df1f2aecd9f8b2ca763274904281acc6bfa26ad5fd68` |
| Rows | 6810 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json) |
| Next queries | [`Inspect reverse semantic impact`](#query-result-impact-source-reference-reverse-impact-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, startLine, startColumn, endLine, endColumn, mechanic, symbolId, symbolName FROM reportOccurrenceEvidence WHERE (:occurrenceId IS NULL OR occurrenceId = :occurrenceId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine, startColumn
```

Full 6810-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-originating-entrypoints-v1"></a>

#### `reachability.symbol-originating-entrypoints.v1`

| Binding | Value |
|---|---|
| Purpose | Interface Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` |
| Result hash | `sha256:c9e18ccb231680f556128df835cd10d39bc39bddf7c96510ae5cf22b12fc82d3` |
| Rows | 989 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json) |
| Next queries | [`Inspect callers`](#query-result-reachability-symbol-callers-v1) `symbolId=:symbolId`<br>[`Inspect callees`](#query-result-reachability-symbol-callees-v1) `symbolId=:symbolId`<br>[`Inspect semantic context`](#query-result-authority-authority-near-symbol-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallPaths WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) ORDER BY symbolId, depth, entryPointId
```

Full 989-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callers-v1"></a>

#### `reachability.symbol-callers.v1`

| Binding | Value |
|---|---|
| Purpose | Reverse Callers |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` |
| Result hash | `sha256:1351033960a7411fb09e6372e15045cafdcbd0cdc977941fe66575c7a72f3ac9` |
| Rows | 6682 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR calleeSymbolId = :symbolId) ORDER BY relationshipId
```

Full 6682-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callees-v1"></a>

#### `reachability.symbol-callees.v1`

| Binding | Value |
|---|---|
| Purpose | Forward Callees |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` |
| Result hash | `sha256:502cf1d181c40a3128d781ff6925b0b83fe3271ef06771e019a24d380803d303` |
| Rows | 6682 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR callerSymbolId = :symbolId) ORDER BY relationshipId
```

Full 6682-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-responsibility-evidence-cluster-by-id-v1"></a>

#### `responsibility-evidence.cluster-by-id.v1`

| Binding | Value |
|---|---|
| Purpose | Responsibility Cluster |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` |
| Result hash | `sha256:2383702e6dfe68dd8a74e23794b464879e4c8dbbd4d645a8b7fbdd3f6e8478ca` |
| Rows | 694 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect nearby authority`](#query-result-authority-authority-near-symbol-v1) `symbolName=:responsibility` |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters WHERE (:clusterId IS NULL OR clusterId = :clusterId)
```

Full 694-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authority-documents-v1"></a>

#### `authority.documents.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Lineage |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` |
| Result hash | `sha256:a795bbd80bb28727e91e1857a7cc699b799272f7fbdb6a24f1b2af2149164257` |
| Rows | 6810 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json) |
| Next queries | [`Inspect physical evidence`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) AND (:authorityFile IS NULL OR authorityHomeFile = :authorityFile)
```

Full 6810-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-items-by-disposition-v1"></a>

#### `subject-boundary.items-by-disposition.v1`

| Binding | Value |
|---|---|
| Purpose | Subject Boundary Items |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` |
| Result hash | `sha256:040ae4bfd51b4b3d9043d383c5981b5886ebc4e57334b01de94816bd70a97016` |
| Rows | 6810 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json) |
| Next queries | [`Inspect missing lineage and healing candidates`](#query-result-healing-source-fact-candidates-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT sourceReferenceId, symbolId, authorityHomeFile, featureIds, scenarioIds, obligationIds, featureCoveragePosture FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId) AND (:symbolId IS NULL OR symbolId = :symbolId)
```

Full 6810-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-healing-source-fact-candidates-v1"></a>

#### `healing.source-fact-candidates.v1`

| Binding | Value |
|---|---|
| Purpose | Change and Healing |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:80ff9ca4e23a4da9a8312b08ba3e148f67675ef5c8c56d3a2d48c6991b2cfdbf` |
| Result hash | `sha256:0e89226a87483404d555ccfd76e21708e98081881d214de34b5ced605ea6db16` |
| Rows | 6652 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json) |
| Next queries | [`Build authority evidence bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect inferred feature/scenario context`](#query-result-authoring-scenario-context-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect decision policy`](#query-result-authoring-decision-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect data shapes`](#query-result-authoring-object-shape-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect failure behavior`](#query-result-authoring-failure-policy-evidence-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Inspect existing authority overlap`](#query-result-authoring-authority-overlap-v1) `occurrenceId=:occurrenceId` `symbolId=:symbolId`<br>[`Build projection target`](#query-result-authoring-projection-target-v1) `symbolId=:symbolId`<br>[`Build proof vectors`](#query-result-authoring-proof-vector-candidates-v1) `symbolId=:symbolId` |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, symbolId, mechanic, featureCoveragePosture, authorityHomeFile FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId)
```

Full 6652-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-interface-execution-slice-v1"></a>

#### `authoring.interface-execution-slice.v1`

| Binding | Value |
|---|---|
| Purpose | Interface-to-Responsibility Slice |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c3366a48fc90431e4874916dba2eb03d7eb73d2b6fda23b841c87da63917debb` |
| Result hash | `sha256:0e4a4c536d5391956ec06df01d897a6bfa0d7c6feb2a050e61447dcad0b3301c` |
| Rows | 1347 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-interface-execution-slice-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM interfaceRows WHERE registered optional parameters match the bounded authoring subject
```

Full 1347-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-interface-execution-slice-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-responsibility-body-evidence-v1"></a>

#### `authoring.responsibility-body-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Responsibility Body Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:798add784465cc049ae5fafd026257b873551da34655e12252477cdc6ff57240` |
| Result hash | `sha256:f0ca28b4f74fa0505bce0372142396520ace6404fc08cb78bad2b5adb256600e` |
| Rows | 686 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-responsibility-body-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM bodyRows WHERE registered optional parameters match the bounded authoring subject
```

Full 686-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-responsibility-body-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-decision-evidence-v1"></a>

#### `authoring.decision-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Decision Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1b742701efaeeecc5ca8f85fb4db7d8d1fc0b16c6692e41e1298393b848d5487` |
| Result hash | `sha256:aa4763c25d453f3e79a37ff498d30004f08305330eca3283021cc39effd53ac4` |
| Rows | 1241 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-decision-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM decisions WHERE registered optional parameters match the bounded authoring subject
```

Full 1241-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-decision-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-fallback-evidence-v1"></a>

#### `authoring.fallback-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Fallback and Missing-Value Policy |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:d4bcb3099a71a172a1d26e52f782473bd1a877fa57833757a02b38ec136c2039` |
| Result hash | `sha256:747ae1cec0fe23a4604e1bb1558d6359849dc3ed4cf80868de2291b211015afc` |
| Rows | 1593 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-fallback-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM fallbacks WHERE registered optional parameters match the bounded authoring subject
```

Full 1593-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-fallback-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-validation-evidence-v1"></a>

#### `authoring.validation-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Validation and Rejection Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:987e66b52ca7bcefd1c09b4a721f188302f1708c91bbf61e28c7de0e944ea807` |
| Result hash | `sha256:b924f38661719fe186ee084762b311b02e8aaf9d5bf065f04f39ed4275983db9` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:8a66c42dfc3fa269b39827bd1fa2c0f6a64008dfd8c668e36d764b270f8e68b5` |
| Result hash | `sha256:262c8b7c3970a7fbfe509cc573c0e6833f2caa0a8298c9577d707247f3284879` |
| Rows | 325 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-failure-policy-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM failures WHERE registered optional parameters match the bounded authoring subject
```

Full 325-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-failure-policy-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-object-shape-evidence-v1"></a>

#### `authoring.object-shape-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Object Shape Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:322a74e7fd1f1bbfaf8e014194ceaafd06dc283e624a96aa398afec32ba04621` |
| Result hash | `sha256:e9b24652b504e67d96ae9dadec267a75e994354ad353b745410ee926c43f3cc1` |
| Rows | 2404 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-object-shape-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM objectShapes WHERE registered optional parameters match the bounded authoring subject
```

Full 2404-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-object-shape-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-result-contract-evidence-v1"></a>

#### `authoring.result-contract-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Result Contract Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:e295e5c199b8e405f479624723ee975cc1a4ab89bb1f8f9a2a309a4e183dd0c3` |
| Result hash | `sha256:1ff23a8677a4c4c54722ed9c05a67ea935c19eac8cf0ca9852ef484b41164c31` |
| Rows | 1033 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-result-contract-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM resultContracts WHERE registered optional parameters match the bounded authoring subject
```

Full 1033-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-result-contract-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-serialization-evidence-v1"></a>

#### `authoring.serialization-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | Serialization Profile |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:66d9960a07465b5af9e5c49cbadb38dc781b1664bae8f38f2a729a69b8c957f0` |
| Result hash | `sha256:f4e26563121d542e197da183d2636ffa8467c039b1b48274c40663a2a400fb13` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:e19f5b592048026bb385df580778f608c57c298fd8aea8cc7ae0b90637bd8dc8` |
| Result hash | `sha256:80319d590c661e70f3dbf3c8b70929fd5f3a80094d1b5f9174f9dd6216ad0dbd` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1b7b1d5154de8375af5dc76f91ec87f46affe2bbe4ff7af27599261f1684bcef` |
| Result hash | `sha256:233f2ef7ce7549ce9936920b5ff7707b6e1f489cbdc392a0e85de85028591840` |
| Rows | 393 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-iteration-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM iterations WHERE registered optional parameters match the bounded authoring subject
```

Full 393-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-iteration-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-state-transition-evidence-v1"></a>

#### `authoring.state-transition-evidence.v1`

| Binding | Value |
|---|---|
| Purpose | State-Transition Semantics |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:ead8095a81ee48e74190abe6541bf069075d94dbb900d5dce6a1755cc18fcd7f` |
| Result hash | `sha256:3bf2c4f273477522d7d49cf1a17ef45dfad3e4902e282de314c944d72bf30509` |
| Rows | 312 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-state-transition-evidence-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM stateTransitions WHERE registered optional parameters match the bounded authoring subject
```

Full 312-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-state-transition-evidence-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-data-flow-slice-v1"></a>

#### `authoring.data-flow-slice.v1`

| Binding | Value |
|---|---|
| Purpose | Data-Flow Slice |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:93b7ed049ac305c55e6cd12a887b18f5a594e603c2b930996db52058b54a29bb` |
| Result hash | `sha256:2a9e6fabb6b0a92bc374f3ff733f52efc2b8eb8fd167e8407ea87bc6a91e45ba` |
| Rows | 686 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-data-flow-slice-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM dataFlowSlices WHERE registered optional parameters match the bounded authoring subject
```

Full 686-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-data-flow-slice-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-authority-overlap-v1"></a>

#### `authoring.authority-overlap.v1`

| Binding | Value |
|---|---|
| Purpose | Existing Authority Overlap |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:9be4fb88b4dc0cc75eea562b505a03ab159223bacb14d98809a9c74086e70397` |
| Result hash | `sha256:0bb6353d16d85276905281a978aafdad60de66dbc8c54f4050a4dafa12d65611` |
| Rows | 6662 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-authority-overlap-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM overlaps WHERE registered optional parameters match the bounded authoring subject
```

Full 6662-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-authority-overlap-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-scenario-context-v1"></a>

#### `authoring.scenario-context.v1`

| Binding | Value |
|---|---|
| Purpose | Feature and Scenario Context |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:97b4eb2ae7b3a88a110536b2a42857be7834f14e5efe6f2386f330e85c461f36` |
| Result hash | `sha256:aec07161003b46984f79e2ecd7f86adb049f7c89662af83388ce2bd3459826de` |
| Rows | 6662 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-scenario-context-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM scenarioContexts WHERE registered optional parameters match the bounded authoring subject
```

Full 6662-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-scenario-context-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-projection-target-v1"></a>

#### `authoring.projection-target.v1`

| Binding | Value |
|---|---|
| Purpose | Projection Target Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:10dd92a9a30e97cac4ed07f7bdc5c501de66ced1d0e732a86e659e7d1dcf1505` |
| Result hash | `sha256:c702946c3665be5394f2f52fe1ac7e4e4099f47c021f9874b9a6424acc4cfb8f` |
| Rows | 686 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-projection-target-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM projectionTargets WHERE registered optional parameters match the bounded authoring subject
```

Full 686-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-projection-target-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-proof-vector-candidates-v1"></a>

#### `authoring.proof-vector-candidates.v1`

| Binding | Value |
|---|---|
| Purpose | Equivalence and Proof Candidates |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3116890ff31c7b4c5a80c14a67253c9f6312b023eecb25ea3fff8f9382ca4308` |
| Result hash | `sha256:7c4da6fd1a7abd136a3f3926ae85936cc809745a031ec036bdb4ee0a9de99280` |
| Rows | 686 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-proof-vector-candidates-v1.json) |
| Next queries | [`Build complete authority-authoring bundle`](#query-result-authoring-semantic-authority-evidence-bundle-v1) `symbolId=:symbolId` `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM proofVectors WHERE registered optional parameters match the bounded authoring subject
```

Full 686-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-proof-vector-candidates-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-contract-map-v1"></a>

#### `authoring.contract-map.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Contract Map |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
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
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3348a52e9913d17e1a2b1e9b9020c60a879e3d9107aa5673643cb49b3e9260ca` |
| Result hash | `sha256:3c8aa52c047ea6dbefcdff133b9317f1dfd06c2528c28fcf0361683011bdd5d2` |
| Rows | 6662 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-semantic-authority-evidence-bundle-v1.json) |
| Next queries | [`Inspect deterministic readiness`](#query-result-authoring-readiness-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM bundles WHERE registered optional parameters match the bounded authoring subject
```

Full 6662-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-semantic-authority-evidence-bundle-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-readiness-v1"></a>

#### `authoring.readiness.v1`

| Binding | Value |
|---|---|
| Purpose | Authoring Readiness |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3be2d3d609c7431f172b6d174112f5f225fe9471c92b5cb96099181c51471470` |
| Result hash | `sha256:3876577dbc2c5db400e724e66c1283bc4f1ba29e69804db3983aaa4b347f5146` |
| Rows | 6662 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authoring-readiness-v1.json) |
| Next queries | terminal physical/healing evidence |

```sql
SELECT * FROM readinessRows WHERE registered optional parameters match the bounded authoring subject
```

Full 6662-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authoring-readiness-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authoring-reconciliation-v1"></a>

#### `authoring.reconciliation.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Authoring Reconciliation |
| Version | `1.0.0` |
| Index ID | `sha256:183896b73af600e74b5155a3bc63a5f7e4c341aacc5572725de8454b6ef330d8` |
| Scan ID | `f48810a90b260d386d6a48a48128c802d0b71182c4b08ccb04a557d325ff78f6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:326068c7279d28afe22f7ed87720a096fc7d1e1d0cd70604e89a034a56185dfd` |
| Result hash | `sha256:a3813dd48d6188bd9c1fc39ff75819cff594ce0c850ff7d56c206dc6c5702219` |
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
    "healingCandidates": 6652,
    "candidatesWithAuthoringEvidenceBundle": 6652,
    "candidatesWithCompleteQueryProvenance": 6652,
    "candidatesWithUnresolvedRequiredEvidence": 6652,
    "candidatesReadyForSemanticAuthorityAuthoring": 0,
    "candidatesReadyForProjection": 6258,
    "declaredResponsibilities": 10,
    "declaredResponsibilityBundles": 10,
    "declaredResponsibilitiesBlockedByInterface": 7,
    "declaredResponsibilitiesReadyForProjection": 7,
    "declaredResponsibilitiesProjectableWithInterfaceEvidenceGap": 7,
    "missingAuthoringQueries": 0,
    "incompleteEvidenceBundles": 0,
    "missingSourceReferences": 0,
    "unresolvedCallPaths": 1404,
    "missingScenarioContexts": 6652,
    "authorityOverlapNotEvaluated": 0,
    "proofVectorMissing": 394,
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

