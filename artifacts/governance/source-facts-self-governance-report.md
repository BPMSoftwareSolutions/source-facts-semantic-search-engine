# Source Facts Self-Governance Report

Honest Feature Coverage and Scenario Evaluation View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T17:37:30.332Z |
| **Repository** | engine-self |
| **Workspace** | `c:\lab\repos\source-facts-semantic-search-engine\src` |
| **Source index ID** | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| **Scan ID** | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| **Query catalog** | `self-governance-query-catalog.v1` |
| **Query catalog hash** | `sha256:6529316874ee06aad3015ef2912af10af08e410e2e007d1b44fa01566b7c3f49` |
| **Query receipts** | 32 executed / 32 valid |
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
| Mechanics without scenario lineage | [5,154](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with canonical scenario lineage | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with proposed scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Authority documents without scenario lineage | [10](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
| Unresolved responsibility-evidence clusters | [592](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | [`Inspect canonical features`](#query-result-feature-coverage-features-v1) · [`Inspect canonical scenarios`](#query-result-scenario-conformance-scenarios-v1) · [`Group mechanics without lineage`](#query-result-feature-coverage-unlined-mechanics-v1) `posture=FEATURE_COVERAGE_MISSING` · [`Inspect unresolved responsibility clusters`](#query-result-responsibility-evidence-cluster-by-id-v1) · [`Inspect authority lineage`](#query-result-authority-documents-v1) |
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

- [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) — 1 row(s), result `sha256:0b52eee709f245fea6e507947afd8cfc90b14a761d52085e09dc57cb2016adb9`
- [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) — 1 row(s), result `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a`
- [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 592 row(s), result `sha256:85684416633a634092bd4d50fa5153ff109503f6d28060d5503243f55c10d4f6`

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

Query result: [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 592 row(s), result `sha256:85684416633a634092bd4d50fa5153ff109503f6d28060d5503243f55c10d4f6`

| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility | Query result |
|---|---|---|---:|---|---|---|
| `src/governance/generates-connective-tissue.js#generatesConnectiveTissue` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | [221](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/web/html-projector.js#projectsHtmlDocument` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [101](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-feature-coverage.js#projectsFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [86](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/cli.js#parseArgs` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, iteration, normalization, object-construction, state-mutation | [84](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/projects-governed-console-contract.js#buildsConsoleGovernedContract` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, state-mutation | [83](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-self-governance-report.js#projectsSelfGovernanceReport` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [74](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/gallery/plans-surface-previews.js#plansOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation | [65](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/call-graph.js#projectsCliEntryPointCallGraph` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, throw | [59](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#validatesGroundedDraft` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw, validation | [57](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-feature-coverage.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | object-construction | [55](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/generates-connective-tissue.js#buildsConditionalSectionSchema` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | object-construction | [54](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/projects-governed-console-contract.js#buildsConsoleServerSourceAuthority` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, object-construction | [52](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-feature-coverage.js#validatesFeatureCoverageProposal` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [51](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-feature-coverage.js#proposesFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, state-mutation, throw, validation | [48](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/sqlserver/load-sqlserver.js#loadsSourceFactIndexIntoSqlServer` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | [46](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/gallery/captures-browser-render.js#capturesOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation, validation | [45](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/project.js#projectSourceFactsWorkspace` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw | [40](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/proposes-semantic-overlap.js#proposesSemanticOverlap` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, throw | [39](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/projects-scenario-conformance.js#projectsFeatureSet` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | [35](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/cli.js#runProposeFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, state-mutation, throw | [34](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/formats-scenario-conformance-report.js#formatsScenarioConformanceReportMarkdown` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration | [31](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/web/project-web-surfaces.js#projectsWebSurfaceIndex` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, iteration, object-construction | [31](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/lib/reads-json-file.js#readsLineDelimitedTopLevelJson` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw | [30](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/web/family-projector.js#expandsOneFamily` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [30](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/cli.js#runWebNorthStar` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, state-mutation | [29](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/composition/writes-sign-in-composition.js#writesSignInComposition` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, serialization, validation | [29](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/governance/formats-self-governance-report-summary.js#formatsSelfGovernanceReportSummary` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | [29](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/cli.js#runProjectAuthorityViolations` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, throw, validation | [28](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/gallery/materializes-static-preview.js#materializesStaticPreviews` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, iteration, object-construction, state-mutation, throw | [28](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
| `src/generate-traceability-docs.js#generatesTraceabilityDocs` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, object-construction | [28](#query-result-feature-coverage-unresolved-clusters-v1) | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` | [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) |
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
| Static mechanics without canonical or proposed lineage | [5,154](#query-result-feature-coverage-unclassified-inventory-v1) | [`NO_SCENARIO_LINEAGE`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Authority documents without canonical scenario lineage | [10](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Admitted know-how without canonical obligation lineage | [0](#query-result-feature-coverage-unclassified-inventory-v1) | inspect per-item posture below | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |
| Healing drafts without a canonical scenario target | [0](#query-result-feature-coverage-unclassified-inventory-v1) | [`HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET`](#query-result-feature-coverage-unclassified-inventory-v1) | [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) |

### Mechanics without lineage

| Mechanic | Occurrences | Files | Query |
|---|---:|---:|---|
| branch | [1,052](#query-result-feature-coverage-unlined-mechanics-v1) | [73](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| exception-handling | [99](#query-result-feature-coverage-unlined-mechanics-v1) | [24](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| fallback | [1,185](#query-result-feature-coverage-unlined-mechanics-v1) | [71](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| iteration | [328](#query-result-feature-coverage-unlined-mechanics-v1) | [60](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| normalization | [112](#query-result-feature-coverage-unlined-mechanics-v1) | [25](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| object-construction | [1,823](#query-result-feature-coverage-unlined-mechanics-v1) | [81](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| retry | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [1](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| serialization | [63](#query-result-feature-coverage-unlined-mechanics-v1) | [23](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| state-mutation | [243](#query-result-feature-coverage-unlined-mechanics-v1) | [50](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| throw | [120](#query-result-feature-coverage-unlined-mechanics-v1) | [38](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |
| validation | [128](#query-result-feature-coverage-unlined-mechanics-v1) | [20](#query-result-feature-coverage-unlined-mechanics-v1) | [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) |

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

## Report Claim Reconciliation

| Check | Result |
|---|---:|
| Registered factual claim values | 7599 |
| Claims with query pointers | 7599 |
| Claims with required drill-down path | 7599 |
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
| [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) | Executive Summary | 1 | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` | `sha256:0b52eee709f245fea6e507947afd8cfc90b14a761d52085e09dc57cb2016adb9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) | Executive Summary | 1 | `sha256:b230d306d1b6235c356f228a8fbe154b94ded15c1d017b8459b2c4db455fc944` | `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.proposal-evidence.v1`](#query-result-feature-coverage-proposal-evidence-v1) | Feature Coverage Proposals | 0 | `sha256:24a7bd5de2d4710e8917e12ac89f18418667b3ed56690d4a93dcc04c09b11411` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.live-inference.v1`](#query-result-feature-coverage-live-inference-v1) | Live LLM Feature-Inference Evaluations | 0 | `sha256:6d426be0037939f720654e271d2debfe3737345106909d22a6ef600b792c0bbc` | `sha256:4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) | Unresolved Responsibility Evidence | 592 | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` | `sha256:85684416633a634092bd4d50fa5153ff109503f6d28060d5503243f55c10d4f6` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | Canonical Feature Drill-Down | 4 | `sha256:63140f2c93dfaff428cf1792965fca681c1dc8459b409af57bac1ed680df6edb` | `sha256:58df4b2b1d73dcede8c618b2deea032b3a8ccdecc9dcb35882724a9b6d75afbf` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) | Evidence Without Canonical Lineage | 1 | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` | `sha256:54933a253d5b877055dcf5a9042509435919772a03ceffeb937e09819d4f08f7` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | Evidence Without Canonical Lineage | 11 | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` | `sha256:bc25371d0b2be7bbc1371fab3825413c9e35762f467c4274bd7c8f8c11433a39` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | Subject Boundary | 1 | `sha256:bb62a3b13d996b599f8ff93979338026e619914bc0972f42c77d1211de60d3bb` | `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.features.v1`](#query-result-feature-coverage-features-v1) | Canonical Features | 4 | `sha256:b507b9960f74168182112bb151a954844379cf125b19fe84166cbc25a5b68de3` | `sha256:063171974f526756fb724236ea5b36ef9e0966af52c3e7bb29acd8a1133f5701` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.feature-scenarios.v1`](#query-result-feature-coverage-feature-scenarios-v1) | Feature Scenarios | 6 | `sha256:6971565a6037b39edde137eb108803f4360451bbffe1c34b9ed28dccb3e45f7b` | `sha256:3fb54aaf62148af47a5ced46cdd37fc624036b0648beb5061fd1c55389f839a9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenarios.v1`](#query-result-scenario-conformance-scenarios-v1) | Canonical Scenarios | 6 | `sha256:713f34d346172b89a6d2641cabe6b68b4cdcfab36d97ef84c6aacebaec1ea8d9` | `sha256:3a98900c82bacbbcbb9465b913bb85114c4522861d5fed8059724415fd5fa91d` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.by-structural-status.v1`](#query-result-scenario-conformance-by-structural-status-v1) | Structural Status | 6 | `sha256:c57d1e34cc94400a0112b0f630664f25d804b761ccfce4d6203ef63e1a1838be` | `sha256:9dda679bcce7505b7e4c07910fb3d137b021030e23ea5f6b216b6d335d3630e9` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-responsibilities.v1`](#query-result-scenario-conformance-scenario-responsibilities-v1) | Scenario Responsibilities | 10 | `sha256:4ebd6c77ccdbd9cb5424de261939db79c47da42a230c2b08f309a9682eb18cc1` | `sha256:87938649624f4c4de03cc9c499150ccb18718715b018e88da86d43433477e8a1` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.scenario-call-paths.v1`](#query-result-scenario-conformance-scenario-call-paths-v1) | Scenario Call Paths | 10 | `sha256:fbd7a1a7480a478232d79b077bc2dc1ee7820e72195339b31c479e06046150f6` | `sha256:4ef4a19f76ee643e261cbe4cc173494cd45c07a7d5910e76bbe2c4d42c16ece5` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-file.v1`](#query-result-feature-coverage-unlined-mechanics-by-file-v1) | Unlined Mechanics by File | 466 | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` | `sha256:9ff22f7ede6e37660525e15144fdd75b922fdc949f8930dddafb8d0dd468b46e` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-responsibility.v1`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) | Unlined Mechanics by Responsibility | 1579 | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` | `sha256:6e11cff57e3c1d5794826a00b0ff3733049ee6135c59e2f65f1470ea8e860932` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics-by-symbol.v1`](#query-result-feature-coverage-unlined-mechanics-by-symbol-v1) | Unlined Mechanics by Symbol | 1580 | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` | `sha256:5e7c9f7c235b71abfb5b55a9ad9da7b89181b18e407c9d129c45804c6b462a3b` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-occurrences.v1`](#query-result-feature-coverage-unlined-occurrences-v1) | Exact Unlined Occurrences | 5154 | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` | `sha256:7cb2d2dea21decb668493466049f296cf82aaffd11d6bef798b4c54805b1cf6d` | `RELATIONAL_QUERY_EXECUTED` |
| [`source-facts.occurrence-source-references.v1`](#query-result-source-facts-occurrence-source-references-v1) | Physical Source Evidence | 5312 | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` | `sha256:58429089d98a4929476175a841159801a4da1e8dfbc3d5198990d132c48ac0fa` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-originating-entrypoints.v1`](#query-result-reachability-symbol-originating-entrypoints-v1) | Interface Reachability | 851 | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` | `sha256:46a767a876a87fe5ea3120a1cf8fe7d954b5e0794aa96de9619ffaccec6021ec` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callers.v1`](#query-result-reachability-symbol-callers-v1) | Reverse Callers | 5331 | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` | `sha256:c4f427e52a2e92760d69452a8a3aac5e0cb546c178591235616a2564f1648f4d` | `RELATIONAL_QUERY_EXECUTED` |
| [`reachability.symbol-callees.v1`](#query-result-reachability-symbol-callees-v1) | Forward Callees | 5331 | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` | `sha256:b7938f43e5f0fc027953a09dba9f0638052ae512b064c3931376712d346078fc` | `RELATIONAL_QUERY_EXECUTED` |
| [`responsibility-evidence.cluster-by-id.v1`](#query-result-responsibility-evidence-cluster-by-id-v1) | Responsibility Cluster | 592 | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` | `sha256:a9b51a6045d9d93299da718b651bc2bd6449d5a4449deb6f43f091f9a9368b22` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.documents.v1`](#query-result-authority-documents-v1) | Authority Lineage | 12 | `sha256:aa543b2c7ab5577f034bd1257164fc69ec434efa54926c34f63bc305255f5c31` | `sha256:1292556b29e7ad54fc5555e8ed6c07d425cbc6c6c0b5292a27c025de41fa4d0f` | `RELATIONAL_QUERY_EXECUTED` |
| [`authority.authority-near-symbol.v1`](#query-result-authority-authority-near-symbol-v1) | Authority Near Symbol | 5312 | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` | `sha256:749cf07ca10afc141fea20c928de52aa4e8dfd4c024369b47432bef31390cde6` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.items-by-disposition.v1`](#query-result-subject-boundary-items-by-disposition-v1) | Subject Boundary Items | 18 | `sha256:3ddeefdb2493e00e7021c129748933e87fa6fe5c7fa1b140e1538d8af86f6ede` | `sha256:df6183da0e000c80d3dfa9abbdda95a2dc3d2817e28267989529a2c85769d969` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.included-items.v1`](#query-result-subject-boundary-included-items-v1) | Included Subject Items | 12 | `sha256:86ccec9fb998fd3f4ef516f0cbe33beb7c2b636d6ecd330ec487db7f7bf6f5ab` | `sha256:cd5c1b08b0deec4eb5847b548b0bff3acf8ff2022be6f81216a2a59ac6b960c7` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.excluded-items.v1`](#query-result-subject-boundary-excluded-items-v1) | Excluded Subject Items | 6 | `sha256:afafdb3b9d69acd6c8a1d16c0247e29e22d25e96ccf54c0133cce6cc22d4f08c` | `sha256:cd96c3ad8b9374dbccbc0e4a68319ba5b23dbda63c871e9baef49debad679788` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.item-scope-reason.v1`](#query-result-subject-boundary-item-scope-reason-v1) | Subject Item Scope Reason | 18 | `sha256:a3933b1341b539303541191b403c8cc9d2b6e51e484de9e49583c0852b34e435` | `sha256:40f693882dd30b2a4526da2ae692795d3c51180d95e5c7907826260df09710bc` | `RELATIONAL_QUERY_EXECUTED` |
| [`impact.source-reference-reverse-impact.v1`](#query-result-impact-source-reference-reverse-impact-v1) | Reverse Impact | 5312 | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` | `sha256:c09ad10dcaaf372c75638a5a4d5a3412860fa8998198c07aba78ca2156c56447` | `RELATIONAL_QUERY_EXECUTED` |
| [`healing.source-fact-candidates.v1`](#query-result-healing-source-fact-candidates-v1) | Change and Healing | 5312 | `sha256:adde2fa0bcd7c1ec149fc54152ef567e91b687eb13ca929c9a197b9389f340b3` | `sha256:4092d5f2595dba56073329f25f9f5d0f0d9af5cdb0357b4bd07d5c727f143ff7` | `RELATIONAL_QUERY_EXECUTED` |

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

### Registered Queries and Results

<a id="query-result-feature-coverage-summary-v1"></a>

#### `feature-coverage.summary.v1`

| Binding | Value |
|---|---|
| Purpose | Executive Summary |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:dfa7d56d37bdd8ca458d537b1a511f32562eb95c05dd19157d705a4617b0056b` |
| Result hash | `sha256:0b52eee709f245fea6e507947afd8cfc90b14a761d52085e09dc57cb2016adb9` |
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
    "unresolvedEvidenceClusters": 592,
    "supportingImplementationClusters": 42,
    "responsibilityEvidenceClusters": 550,
    "confirmedFeatureCandidateClusters": 0,
    "capabilityRelationsProposed": 0,
    "liveInferenceEvaluations": 0,
    "duplicateProposalsPrevented": 0,
    "mechanicsWithCanonicalLineage": 0,
    "mechanicsWithProposedLineage": 158,
    "mechanicsWithAmbiguousLineage": 0,
    "mechanicsWithoutLineage": 5154,
    "authorityWithCanonicalLineage": 2,
    "authorityWithProposedLineage": 0,
    "authorityWithAmbiguousLineage": 0,
    "authorityWithoutLineage": 10,
    "unclassifiedMechanics": 5154,
    "byPosture": {
      "FEATURE_COVERAGE_MISSING": 5154,
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` |
| Result hash | `sha256:85684416633a634092bd4d50fa5153ff109503f6d28060d5503243f55c10d4f6` |
| Rows | 592 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json) |
| Next queries | [`Inspect individual cluster`](#query-result-responsibility-evidence-cluster-by-id-v1) |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters ORDER BY modulePath, responsibility
```

Full 592-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

Full 7302-pointer claim map: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json).

<a id="query-result-scenario-conformance-drilldown-v1"></a>

#### `scenario-conformance.drilldown.v1`

| Binding | Value |
|---|---|
| Purpose | Canonical Feature Drill-Down |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` |
| Result hash | `sha256:54933a253d5b877055dcf5a9042509435919772a03ceffeb937e09819d4f08f7` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` |
| Result hash | `sha256:bc25371d0b2be7bbc1371fab3825413c9e35762f467c4274bd7c8f8c11433a39` |
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
    "occurrenceCount": 1052,
    "fileCount": 73,
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
    "occurrenceCount": 99,
    "fileCount": 24,
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
    "occurrenceCount": 1185,
    "fileCount": 71,
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
    "occurrenceCount": 328,
    "fileCount": 60,
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
    "occurrenceCount": 112,
    "fileCount": 25,
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
    "occurrenceCount": 1823,
    "fileCount": 81,
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
    "occurrenceCount": 63,
    "fileCount": 23,
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
    "occurrenceCount": 243,
    "fileCount": 50,
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
    "occurrenceCount": 120,
    "fileCount": 38,
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
    "occurrenceCount": 128,
    "fileCount": 20,
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:4ebd6c77ccdbd9cb5424de261939db79c47da42a230c2b08f309a9682eb18cc1` |
| Result hash | `sha256:87938649624f4c4de03cc9c499150ccb18718715b018e88da86d43433477e8a1` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:2582f0c7032aea45ac90c9cd28622ae599c2c68977459483704a6754173c67e6` |
| Result hash | `sha256:9ff22f7ede6e37660525e15144fdd75b922fdc949f8930dddafb8d0dd468b46e` |
| Rows | 466 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json) |
| Next queries | [`Inspect responsibilities`](#query-result-feature-coverage-unlined-mechanics-by-responsibility-v1) `mechanic=:mechanic` `modulePath=:modulePath` |

```sql
SELECT modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) GROUP BY modulePath, mechanic ORDER BY occurrenceCount DESC, modulePath
```

Full 466-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-file-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-responsibility-v1"></a>

#### `feature-coverage.unlined-mechanics-by-responsibility.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Responsibility |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:b5006477e6033f0ad57959635500ba21c302cf5b3acd8bc23f5d7a8d30273e3c` |
| Result hash | `sha256:6e11cff57e3c1d5794826a00b0ff3733049ee6135c59e2f65f1470ea8e860932` |
| Rows | 1579 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json) |
| Next queries | [`Inspect interface reachability`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect occurrences`](#query-result-feature-coverage-unlined-occurrences-v1) `responsibility=:responsibility` |

```sql
SELECT modulePath, responsibility, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) GROUP BY modulePath, responsibility, mechanic ORDER BY occurrenceCount DESC
```

Full 1579-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-responsibility-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-mechanics-by-symbol-v1"></a>

#### `feature-coverage.unlined-mechanics-by-symbol.v1`

| Binding | Value |
|---|---|
| Purpose | Unlined Mechanics by Symbol |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:830653ecd0f8d113685176d29b42361210d2240d15ccfec633e72aa6ec8c2f9a` |
| Result hash | `sha256:5e7c9f7c235b71abfb5b55a9ad9da7b89181b18e407c9d129c45804c6b462a3b` |
| Rows | 1580 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolId=:symbolId` |

```sql
SELECT symbolId, symbolName, modulePath, mechanic, COUNT(*) AS occurrenceCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY symbolId, symbolName, modulePath, mechanic ORDER BY occurrenceCount DESC
```

Full 1580-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-by-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-feature-coverage-unlined-occurrences-v1"></a>

#### `feature-coverage.unlined-occurrences.v1`

| Binding | Value |
|---|---|
| Purpose | Exact Unlined Occurrences |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:6a0a84598e1e351c5002c0680a73855cdb8f3e7312d18638005b291d2e84a624` |
| Result hash | `sha256:7cb2d2dea21decb668493466049f296cf82aaffd11d6bef798b4c54805b1cf6d` |
| Rows | 5154 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json) |
| Next queries | [`Inspect physical source references`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' AND (:mechanic IS NULL OR mechanic = :mechanic) AND (:modulePath IS NULL OR modulePath = :modulePath) AND (:responsibility IS NULL OR responsibility = :responsibility) ORDER BY modulePath, startLine
```

Full 5154-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/feature-coverage-unlined-occurrences-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-source-facts-occurrence-source-references-v1"></a>

#### `source-facts.occurrence-source-references.v1`

| Binding | Value |
|---|---|
| Purpose | Physical Source Evidence |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:0b89b4d3e3751396bfc0ab6b67462c9374f1ee659e070472b22a92b38d378860` |
| Result hash | `sha256:58429089d98a4929476175a841159801a4da1e8dfbc3d5198990d132c48ac0fa` |
| Rows | 5312 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json) |
| Next queries | [`Inspect reverse semantic impact`](#query-result-impact-source-reference-reverse-impact-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, startLine, startColumn, endLine, endColumn, mechanic, symbolId, symbolName FROM reportOccurrenceEvidence WHERE (:occurrenceId IS NULL OR occurrenceId = :occurrenceId) AND (:symbolId IS NULL OR symbolId = :symbolId) ORDER BY modulePath, startLine, startColumn
```

Full 5312-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/source-facts-occurrence-source-references-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-originating-entrypoints-v1"></a>

#### `reachability.symbol-originating-entrypoints.v1`

| Binding | Value |
|---|---|
| Purpose | Interface Reachability |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:242009af849c0ffd1b366b4a1f3738d9a0096d6ef97a55affcfe10e30122b742` |
| Result hash | `sha256:46a767a876a87fe5ea3120a1cf8fe7d954b5e0794aa96de9619ffaccec6021ec` |
| Rows | 851 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json) |
| Next queries | [`Inspect callers`](#query-result-reachability-symbol-callers-v1) `symbolId=:symbolId`<br>[`Inspect callees`](#query-result-reachability-symbol-callees-v1) `symbolId=:symbolId`<br>[`Inspect semantic context`](#query-result-authority-authority-near-symbol-v1) `symbolId=:symbolId` |

```sql
SELECT * FROM reportCallPaths WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) ORDER BY symbolId, depth, entryPointId
```

Full 851-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-originating-entrypoints-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callers-v1"></a>

#### `reachability.symbol-callers.v1`

| Binding | Value |
|---|---|
| Purpose | Reverse Callers |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:3072ae466d3c8d6933062458482de3c8922d3c2dfbaacae932d61b69cbb6a540` |
| Result hash | `sha256:c4f427e52a2e92760d69452a8a3aac5e0cb546c178591235616a2564f1648f4d` |
| Rows | 5331 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR calleeSymbolId = :symbolId) ORDER BY relationshipId
```

Full 5331-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callers-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-reachability-symbol-callees-v1"></a>

#### `reachability.symbol-callees.v1`

| Binding | Value |
|---|---|
| Purpose | Forward Callees |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:f0078a6d8c0e4e7617a1f3d24415bc84b9c011a179710cfa5306510d8985ad66` |
| Result hash | `sha256:b7938f43e5f0fc027953a09dba9f0638052ae512b064c3931376712d346078fc` |
| Rows | 5331 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json) |
| Next queries | [`Inspect call-site source`](#query-result-source-facts-occurrence-source-references-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT * FROM reportInvocationEdges WHERE (:symbolId IS NULL OR callerSymbolId = :symbolId) ORDER BY relationshipId
```

Full 5331-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/reachability-symbol-callees-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-responsibility-evidence-cluster-by-id-v1"></a>

#### `responsibility-evidence.cluster-by-id.v1`

| Binding | Value |
|---|---|
| Purpose | Responsibility Cluster |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:efd390e1804079a28babb8ed8caf90f3075b0a093be587f663ad2ae9320b5068` |
| Result hash | `sha256:a9b51a6045d9d93299da718b651bc2bd6449d5a4449deb6f43f091f9a9368b22` |
| Rows | 592 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json) |
| Next queries | [`Inspect entry surfaces`](#query-result-reachability-symbol-originating-entrypoints-v1) `symbolName=:responsibility`<br>[`Inspect nearby authority`](#query-result-authority-authority-near-symbol-v1) `symbolName=:responsibility` |

```sql
SELECT * FROM reportUnresolvedEvidenceClusters WHERE (:clusterId IS NULL OR clusterId = :clusterId)
```

Full 592-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/responsibility-evidence-cluster-by-id-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-authority-documents-v1"></a>

#### `authority.documents.v1`

| Binding | Value |
|---|---|
| Purpose | Authority Lineage |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:c1f34de65cd661e85cc9c07f9d950251c8fa4dc8ee743b395907a337116df88c` |
| Result hash | `sha256:749cf07ca10afc141fea20c928de52aa4e8dfd4c024369b47432bef31390cde6` |
| Rows | 5312 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json) |
| Next queries | [`Inspect physical evidence`](#query-result-source-facts-occurrence-source-references-v1) `occurrenceId=:occurrenceId` |

```sql
SELECT * FROM reportOccurrenceEvidence WHERE (:symbolId IS NULL OR symbolId = :symbolId) AND (:symbolName IS NULL OR symbolName = :symbolName) AND (:authorityFile IS NULL OR authorityHomeFile = :authorityFile)
```

Full 5312-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/authority-authority-near-symbol-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-subject-boundary-items-by-disposition-v1"></a>

#### `subject-boundary.items-by-disposition.v1`

| Binding | Value |
|---|---|
| Purpose | Subject Boundary Items |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
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
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:11fee5b05392548326dff3dfaf80ffbb726ed06e182cda40a7f5cdfd81133bf3` |
| Result hash | `sha256:c09ad10dcaaf372c75638a5a4d5a3412860fa8998198c07aba78ca2156c56447` |
| Rows | 5312 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json) |
| Next queries | [`Inspect missing lineage and healing candidates`](#query-result-healing-source-fact-candidates-v1) `sourceReferenceId=:sourceReferenceId` |

```sql
SELECT sourceReferenceId, symbolId, authorityHomeFile, featureIds, scenarioIds, obligationIds, featureCoveragePosture FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId) AND (:symbolId IS NULL OR symbolId = :symbolId)
```

Full 5312-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/impact-source-reference-reverse-impact-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

<a id="query-result-healing-source-fact-candidates-v1"></a>

#### `healing.source-fact-candidates.v1`

| Binding | Value |
|---|---|
| Purpose | Change and Healing |
| Version | `1.0.0` |
| Index ID | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| Scan ID | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| Scope | `workspace-prefix:src` |
| Query hash | `sha256:adde2fa0bcd7c1ec149fc54152ef567e91b687eb13ca929c9a197b9389f340b3` |
| Result hash | `sha256:4092d5f2595dba56073329f25f9f5d0f0d9af5cdb0357b4bd07d5c727f143ff7` |
| Rows | 5312 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json) |
| Next queries | terminal physical/healing evidence |

```sql
SELECT occurrenceId, sourceReferenceId, modulePath, symbolId, mechanic, featureCoveragePosture, authorityHomeFile FROM reportOccurrenceEvidence WHERE (:sourceReferenceId IS NULL OR sourceReferenceId = :sourceReferenceId)
```

Full 5312-row result: [open the bound receipt artifact](source-facts-self-governance-report.receipts/healing-source-fact-candidates-v1.json).

<details><summary>Inspect 0 rendered claim pointer(s) inline</summary>

No scalar claims were rendered from this empty result.

</details>

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains `NOT_EVALUATED` unless a separate execution receipt is supplied.

