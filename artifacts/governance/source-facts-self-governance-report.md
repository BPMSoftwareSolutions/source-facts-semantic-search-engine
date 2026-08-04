# Source Facts Self-Governance Report

Honest Feature Coverage and Scenario Evaluation View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T17:17:27.600Z |
| **Repository** | self |
| **Workspace** | `c:\lab\repos\source-facts-semantic-search-engine\src` |
| **Source index ID** | `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4` |
| **Scan ID** | `542be855f26631947c1fcfd9b62a3458ffb3f92421c8afb55c2aa1481486d6b6` |
| **Query catalog** | `self-governance-query-catalog.v1` |
| **Query catalog hash** | `sha256:a590a01aee976ad600ad3e439d3cf3b8c758234ea48d8b3e682ba2f02d439ce0` |
| **Query receipts** | 9 executed / 9 valid |
| **Render reconciliation** | `PASSED` |
| **Unsupported factual claims** | 0 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

This report keeps four independent questions separate: whether lineage is canonical or proposed,
whether the declared structure is closed, whether execution was evaluated, and whether a proof
passed. Static source evidence and live LLM inference calls can support discovery, but neither is
a runtime execution receipt for a scenario.

| Dimension | Count | Query |
|---|---:|---|
| Canonical feature declarations | [4](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Proposed features, not admitted | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios | [6](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Proposed scenarios, not admitted | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios structurally closed | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios structurally incomplete | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios with structural status not evaluated | [4](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios with execution evaluated | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios with runtime conformance `NOT_EVALUATED` | [6](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios conformant by execution proof | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Canonical scenarios with lineage-quality findings | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Mechanics with canonical scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Mechanics with proposed scenario lineage | [158](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Mechanics with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Mechanics without scenario lineage | [5,154](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Authority documents with canonical scenario lineage | [2](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Authority documents with proposed scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Authority documents with ambiguous scenario lineage | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Authority documents without scenario lineage | [10](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Unresolved responsibility-evidence clusters | [592](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Clusters confirmed as feature candidates | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Live LLM inference evaluations | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Optional capability relations proposed from evidence | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Duplicate proposals prevented | [0](#query-result-feature-coverage-summary-v1) | [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) |
| Scenarios with evaluation limit `AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |
| Scenarios with evaluation limit `BODY_NOT_EVALUATED_OUTSIDE_SUBJECT` | [2](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |
| Scenarios with evaluation limit `BODY_NOT_STATICALLY_OBSERVED` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |
| Scenarios with lineage-quality finding `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |
| Scenarios with lineage-quality finding `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |
| Scenarios with lineage-quality finding `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` | [1](#query-result-scenario-conformance-summary-v1) | [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) |

**Query evidence**

- [`feature-coverage.summary.v1`](#query-result-feature-coverage-summary-v1) — 1 row(s), result `sha256:0b52eee709f245fea6e507947afd8cfc90b14a761d52085e09dc57cb2016adb9`
- [`scenario-conformance.summary.v1`](#query-result-scenario-conformance-summary-v1) — 1 row(s), result `sha256:c3fcd087e881750d3cf83381a22ecf525fd0d50f4503a448d5883df1ad902f1a`
- [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 592 row(s), result `sha256:255d8025317c9b7eb352201668575cba9d7a36d8aabbf86129ea6527a1aad797`

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

Query result: [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) — 592 row(s), result `sha256:255d8025317c9b7eb352201668575cba9d7a36d8aabbf86129ea6527a1aad797`

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

Query result: [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) — 4 row(s), result `sha256:a048543d2626de1299c7320543e325e4785a57c819abf03c1591574b3d7bafbf`

| Feature | Source lineage classification | Scenarios | Responsibilities | Structurally closed | Runtime conformant | Lineage-quality findings | Query result |
|---|---|---:|---:|---:|---:|---:|---|
| `delegate-console-authority` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `project-console-contract` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [2](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `project-governed-messages` | `governed-message-artifact-family` | [3](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |
| `serve-query-console` | `serves-query-console` | [1](#query-result-scenario-conformance-drilldown-v1) | [3](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [0](#query-result-scenario-conformance-drilldown-v1) | [1](#query-result-scenario-conformance-drilldown-v1) | [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) |

Claim type: `QUERYED_DETERMINISTIC_CLASSIFICATION`

Supporting query result: [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) — 4 row(s), result `sha256:a048543d2626de1299c7320543e325e4785a57c819abf03c1591574b3d7bafbf`

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
| [`feature-coverage.unresolved-clusters.v1`](#query-result-feature-coverage-unresolved-clusters-v1) | Unresolved Responsibility Evidence | 592 | `sha256:f0194dd8100b3ee64d528a4253968fe48f0b7212badf2575b852c5b948cb780b` | `sha256:255d8025317c9b7eb352201668575cba9d7a36d8aabbf86129ea6527a1aad797` | `RELATIONAL_QUERY_EXECUTED` |
| [`scenario-conformance.drilldown.v1`](#query-result-scenario-conformance-drilldown-v1) | Canonical Feature Drill-Down | 4 | `sha256:63140f2c93dfaff428cf1792965fca681c1dc8459b409af57bac1ed680df6edb` | `sha256:a048543d2626de1299c7320543e325e4785a57c819abf03c1591574b3d7bafbf` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unclassified-inventory.v1`](#query-result-feature-coverage-unclassified-inventory-v1) | Evidence Without Canonical Lineage | 1 | `sha256:1aafa4839d6a214e6acc0be187c500279ab27a67382b4bbe5160a099c2a0e6a0` | `sha256:54933a253d5b877055dcf5a9042509435919772a03ceffeb937e09819d4f08f7` | `RELATIONAL_QUERY_EXECUTED` |
| [`feature-coverage.unlined-mechanics.v1`](#query-result-feature-coverage-unlined-mechanics-v1) | Evidence Without Canonical Lineage | 11 | `sha256:8d95fc7d5b7dc91ad64e723c18eaf7f43aec31da133f1ec9eb82ca6423d987ef` | `sha256:36d1c19221a834db9a1efe26b1058c058c1b9ae9ae6f9cda01bd773c5fc68202` | `RELATIONAL_QUERY_EXECUTED` |
| [`subject-boundary.evidence.v1`](#query-result-subject-boundary-evidence-v1) | Subject Boundary | 1 | `sha256:bb62a3b13d996b599f8ff93979338026e619914bc0972f42c77d1211de60d3bb` | `sha256:593f3a0d4ba5545debcc6a1739061dd7618401ffe7c489256e16a16ed6e1a615` | `RELATIONAL_QUERY_EXECUTED` |

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
| Result hash | `sha256:255d8025317c9b7eb352201668575cba9d7a36d8aabbf86129ea6527a1aad797` |
| Rows | 592 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unresolved-clusters-v1.json) |

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
| Result hash | `sha256:a048543d2626de1299c7320543e325e4785a57c819abf03c1591574b3d7bafbf` |
| Rows | 4 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/scenario-conformance-drilldown-v1.json) |

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
    "lineageQualityFindingCount": 0
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
    "lineageQualityFindingCount": 2
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
    "lineageQualityFindingCount": 0
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
    "lineageQualityFindingCount": 1
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
| Result hash | `sha256:36d1c19221a834db9a1efe26b1058c058c1b9ae9ae6f9cda01bd773c5fc68202` |
| Rows | 11 |
| Execution | `RELATIONAL_QUERY_EXECUTED` |
| Full receipt artifact | [Open query, rows, and claim pointers](source-facts-self-governance-report.receipts/feature-coverage-unlined-mechanics-v1.json) |

```sql
SELECT mechanic, COUNT(*) AS occurrenceCount, COUNT(DISTINCT modulePath) AS fileCount FROM reportOccurrences WHERE featureCoveragePosture = 'FEATURE_COVERAGE_MISSING' GROUP BY mechanic ORDER BY mechanic
```

<details><summary>Inspect 11 result row(s) inline</summary>

```json
[
  {
    "mechanic": "branch",
    "occurrenceCount": 1052,
    "fileCount": 73
  },
  {
    "mechanic": "exception-handling",
    "occurrenceCount": 99,
    "fileCount": 24
  },
  {
    "mechanic": "fallback",
    "occurrenceCount": 1185,
    "fileCount": 71
  },
  {
    "mechanic": "iteration",
    "occurrenceCount": 328,
    "fileCount": 60
  },
  {
    "mechanic": "normalization",
    "occurrenceCount": 112,
    "fileCount": 25
  },
  {
    "mechanic": "object-construction",
    "occurrenceCount": 1823,
    "fileCount": 81
  },
  {
    "mechanic": "retry",
    "occurrenceCount": 1,
    "fileCount": 1
  },
  {
    "mechanic": "serialization",
    "occurrenceCount": 63,
    "fileCount": 23
  },
  {
    "mechanic": "state-mutation",
    "occurrenceCount": 243,
    "fileCount": 50
  },
  {
    "mechanic": "throw",
    "occurrenceCount": 120,
    "fileCount": 38
  },
  {
    "mechanic": "validation",
    "occurrenceCount": 128,
    "fileCount": 20
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

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains `NOT_EVALUATED` unless a separate execution receipt is supplied.

