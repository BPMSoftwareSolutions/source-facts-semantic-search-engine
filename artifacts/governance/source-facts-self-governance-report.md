# Source Facts Self-Governance Report

Honest Feature Coverage and Scenario Evaluation View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T13:29:35.600Z |
| **Repository** | self |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 49c9632b050e44f8fc3910aa3497458ebf8a8b186ff4d660892ac69d741a373a |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

This report keeps four independent questions separate: whether lineage is canonical or proposed,
whether the declared structure is closed, whether execution was evaluated, and whether a proof
passed. Static source evidence and live LLM inference calls can support discovery, but neither is
a runtime execution receipt for a scenario.

| Dimension | Count |
|---|---:|
| Canonical feature declarations | 4 |
| Proposed features, not admitted | 1 |
| Canonical scenarios | 6 |
| Proposed scenarios, not admitted | 3 |
| Canonical scenarios structurally closed | 2 |
| Canonical scenarios structurally incomplete | 0 |
| Canonical scenarios with structural status not evaluated | 4 |
| Canonical scenarios with execution evaluated | 0 |
| Canonical scenarios with runtime conformance `NOT_EVALUATED` | 6 |
| Canonical scenarios conformant by execution proof | 0 |
| Canonical scenarios with lineage-quality findings | 2 |
| Mechanics with canonical scenario lineage | 0 |
| Mechanics with proposed scenario lineage | 158 |
| Mechanics with ambiguous scenario lineage | 0 |
| Mechanics without scenario lineage | 5,154 |
| Authority documents with canonical scenario lineage | 2 |
| Authority documents with proposed scenario lineage | 2 |
| Authority documents with ambiguous scenario lineage | 0 |
| Authority documents without scenario lineage | 8 |
| Unresolved responsibility-evidence clusters | 592 |
| Clusters confirmed as feature candidates | 0 |
| Live LLM inference evaluations | 1 |
| Optional capability relations proposed from evidence | 0 |
| Duplicate proposals prevented | 0 |
| Scenarios with evaluation limit `AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT` | 1 |
| Scenarios with evaluation limit `BODY_NOT_EVALUATED_OUTSIDE_SUBJECT` | 2 |
| Scenarios with evaluation limit `BODY_NOT_STATICALLY_OBSERVED` | 1 |
| Scenarios with lineage-quality finding `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` | 1 |
| Scenarios with lineage-quality finding `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` | 1 |
| Scenarios with lineage-quality finding `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` | 1 |

## Feature Coverage Proposals

These are inferred candidates. They do not become canonical feature or scenario lineage until admitted into canonical authority.

| Proposed feature | Evidence cluster | Scenarios | Responsibilities | Coverage posture | Duplicate check |
|---|---|---:|---:|---|---|
| `serialize-successful-responses` — Serialize successful query-console responses | 3 symbols; 20 matching serialization mechanics | 3 | 3 | `FEATURE_COVERAGE_PROPOSED` | `NEW_FEATURE_CANDIDATE` |
|  | Fingerprint: `sha256:9ec5470fca11c60808c3dd8f161b7588a3b2bdb95a4af258b1a0bd1d4c4e1970` (verified) |  |  |  |  |

### Proposed Feature: `serialize-successful-responses`

**As a** query-console consumer; **I need** successful responses to use one canonical serialization policy; **so that** every successful route emits a consistent and governed result shape.

```gherkin
Feature: Serialize successful query-console responses

  Scenario: Serialize a successful index-information response
    Given index information has been resolved
    When the successful response is projected
    Then the canonical index-information result is serialized
    And the serialization disposition is recorded

  Scenario: Serialize a successful query response
    Given a query result has been resolved
    When the successful response is projected
    Then the canonical query result is serialized
    And the serialization disposition is recorded

  Scenario: Serialize a successful snippet response
    Given a snippet result has been resolved
    When the successful response is projected
    Then the canonical snippet result is serialized
    And the serialization disposition is recorded
```

Evidence files: `src/console/serves-query-console.runtime.impl.mjs`; symbols: `handleIndexInfo`, `handleQuery`, `handleSnippet`; know-how: `success-path-serialization-duplicated-inline`.

## Live LLM Feature-Inference Evaluations

These are receipts from real model calls over deterministic query results. They test the inference target, but remain observational discovery evidence: they neither admit a feature nor execute a product scenario.

| Candidate feature | Model call | Query receipt | Candidate comparison | Optional capability relation | Lifecycle |
|---|---|---|---|---|---|
| `serialize-successful-query-console-responses` — Serialize Successful Query Console Responses | `gemini-flash-latest`; 14,691 tokens; 16,400 ms; request `sha256:f7777dd22ba87b97eb3b218511ba94303698c06d124eb4b968749957381dd865`; response `sha256:2766777a371aebc8e4440831591a4b7d81d4063b5dd7a0c9a760019a4c848bed` | 20 rows; input `sha256:1ed906ddfd966245b8940db1927ae1197bae578b75c8865257b5289d53771a9f`; result `sha256:8a5b2ca0c1aa48ae75b0a9f45113f5ea345ba499f518d30027eceead4c124e6d` | `OVERLAPPING_FEATURES_REQUIRE_REVIEW` | `NO_CAPABILITY_RELATION_DETECTED` | `OBSERVATIONAL_NOT_ADMISSIBLE` |
|  | Evaluation: `reviews/live-evaluations/success-response-serialization.feature-coverage-inference-evaluation.json` | Fingerprint: `sha256:d07b8d761a82e57bb53219aae4f85f379b347ddb74118c55b4af730a5a4296ba` |  |  |  |

## Unresolved Responsibility Evidence

These are bounded static-evidence clusters, not feature candidates. A function or module scope becomes eligible for feature inference only after a separate feature-shaping review establishes an actor, outcome, scenario boundary, responsibility, and obligation.

| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility |
|---|---|---|---:|---|---|
| `src/governance/generates-connective-tissue.js#generatesConnectiveTissue` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | 221 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/web/html-projector.js#projectsHtmlDocument` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | 101 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/projects-feature-coverage.js#projectsFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | 86 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/cli.js#parseArgs` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, iteration, normalization, object-construction, state-mutation | 84 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/projects-governed-console-contract.js#buildsConsoleGovernedContract` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, state-mutation | 83 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/projects-self-governance-report.js#projectsSelfGovernanceReport` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | 74 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/gallery/plans-surface-previews.js#plansOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation | 65 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/call-graph.js#projectsCliEntryPointCallGraph` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, normalization, object-construction, serialization, throw | 59 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/generates-connective-tissue.js#validatesGroundedDraft` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw, validation | 57 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/proposes-feature-coverage.js#(module-scope)` | `SUPPORTING_IMPLEMENTATION_CLUSTER` | object-construction | 55 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/generates-connective-tissue.js#buildsConditionalSectionSchema` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | object-construction | 54 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/projects-governed-console-contract.js#buildsConsoleServerSourceAuthority` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, object-construction | 52 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/projects-feature-coverage.js#validatesFeatureCoverageProposal` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | 51 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/proposes-feature-coverage.js#proposesFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, state-mutation, throw, validation | 48 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/sqlserver/load-sqlserver.js#loadsSourceFactIndexIntoSqlServer` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | 46 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/gallery/captures-browser-render.js#capturesOneItem` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, exception-handling, fallback, iteration, object-construction, state-mutation, validation | 45 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/project.js#projectSourceFactsWorkspace` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, throw | 40 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/proposes-semantic-overlap.js#proposesSemanticOverlap` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, throw | 39 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/projects-scenario-conformance.js#projectsFeatureSet` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction | 35 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/cli.js#runProposeFeatureCoverage` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, state-mutation, throw | 34 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/formats-scenario-conformance-report.js#formatsScenarioConformanceReportMarkdown` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration | 31 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/web/project-web-surfaces.js#projectsWebSurfaceIndex` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, iteration, object-construction | 31 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/lib/reads-json-file.js#readsLineDelimitedTopLevelJson` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation, throw | 30 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/web/family-projector.js#expandsOneFamily` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | 30 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/cli.js#runWebNorthStar` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, state-mutation | 29 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/composition/writes-sign-in-composition.js#writesSignInComposition` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, normalization, object-construction, serialization, validation | 29 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/governance/formats-self-governance-report-summary.js#formatsSelfGovernanceReportSummary` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, iteration, object-construction, state-mutation | 29 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/cli.js#runProjectAuthorityViolations` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, fallback, object-construction, serialization, throw, validation | 28 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/gallery/materializes-static-preview.js#materializesStaticPreviews` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | branch, iteration, object-construction, state-mutation, throw | 28 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| `src/generate-traceability-docs.js#generatesTraceabilityDocs` | `RESPONSIBILITY_EVIDENCE_CLUSTER` | fallback, object-construction | 28 | `FEATURE_CANDIDACY_NOT_EVALUATED` | `REQUIRES_FEATURE_SHAPING_REVIEW` |
| … |  | 562 additional cluster(s) in JSON |  |  |  |

## Canonical Feature Drill-Down

| Feature | Source lineage classification | Scenarios | Responsibilities | Structurally closed | Runtime conformant | Lineage-quality findings |
|---|---|---:|---:|---:|---:|---:|
| `delegate-console-authority` | `serves-query-console` | 1 | 1 | 1 | 0 | 0 |
| `project-console-contract` | `serves-query-console` | 1 | 3 | 1 | 0 | 2 |
| `project-governed-messages` | `governed-message-artifact-family` | 3 | 3 | 0 | 0 | 0 |
| `serve-query-console` | `serves-query-console` | 1 | 3 | 0 | 0 | 1 |

## Feature: `delegate-console-authority`

Delegate the admitted console mechanics to helper authorities and runtime dependencies.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

### Scenario: `delegate-console-mechanics`

The console body delegates routing, validation, and snippet extraction to admitted authorities.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURALLY_CLOSED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: none.

Lineage-quality findings: none.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `console-authority-bundles.v1.responsibility.v1` | `console-delegates-mechanics` — The console source body must delegate admitted mechanics to authority surfaces. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-authority-bundles.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

## Feature: `project-console-contract`

Project a governed contract draft from the current authority and source-fact evidence.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

Feature lineage-quality findings: `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW`, `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP`.

### Scenario: `project-governed-console-contract`

The translator emits a governed contract draft without hand-authoring the contract bytes.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURALLY_CLOSED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: none.

Lineage-quality findings: `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW`, `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP`.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `console-routing-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-routing-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |
| `console-validation-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-validation-adapter.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |
| `console-snippet-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-snippet-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

## Feature: `project-governed-messages`

Render a governed message from declared contract meaning.

Canonical feature authority: `contracts/serves-query-console.contract.json`

Source lineage classification: `governed-message-artifact-family`. This is source-family metadata, not a capability relation or feature parent.

### Scenario: `project-a-declared-message`

A declared message value is projected into canonical output.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURAL_STATUS_NOT_EVALUATED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: `BODY_NOT_STATICALLY_OBSERVED`.

Lineage-quality findings: none.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `executes-message-projection` | `produce-one-canonical-message` — Exactly one canonical message must be produced from declared semantic authority. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/project-message.mjs` (BODY_NOT_STATICALLY_OBSERVED) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

### Scenario: `run-the-message-command`

The projected message is emitted through the declared command port.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURAL_STATUS_NOT_EVALUATED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: `BODY_NOT_EVALUATED_OUTSIDE_SUBJECT`.

Lineage-quality findings: none.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `entry-point-for-message-command` | `emit-the-message-once` — The command must emit the projected message exactly once. | AUTHORITY_DECLARED | BINDING_DECLARED | `bin/run-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

### Scenario: `verify-the-projected-message`

The projected message is proved against its declared expectation.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURAL_STATUS_NOT_EVALUATED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: `BODY_NOT_EVALUATED_OUTSIDE_SUBJECT`.

Lineage-quality findings: none.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `evaluates-message-proof` | `prove-the-message-conforms` — Verification must prove the projected message conforms. | AUTHORITY_DECLARED | BINDING_DECLARED | `verification/verifies-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | WIRING_NOT_STATICALLY_OBSERVED | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

## Feature: `serve-query-console`

Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.

Canonical feature authority: `contracts/serves-query-console.governed.contract.json`

Source lineage classification: `serves-query-console`. This is source-family metadata, not a capability relation or feature parent.

Feature lineage-quality findings: `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES`.

### Scenario: `serve-console-over-loopback`

The console binds only to loopback and serves query, index, and snippet responses.

Scenario lineage: `SCENARIO_LINEAGE_CANONICAL`; structural status: `STRUCTURAL_STATUS_NOT_EVALUATED`; runtime conformance: `NOT_EVALUATED`.

Structural blockers: none.

Evaluation limits: `AUTHORITY_WIRING_NOT_EVALUATED_DEPTH_LIMIT`.

Lineage-quality findings: `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES`.

| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |
|---|---|---|---|---|---|---|---|---|
| `serves-query-console.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |
| `serves-query-console-conformant.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.conformant.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |
| `serves-query-console-projected.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.projected.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_EVALUATED | PROOF_DECLARED_RESULT_NOT_EVALUATED |

## Evidence Without Canonical Lineage

These facts are inside the report subject but have no admitted scenario lineage. A proposal is
shown as proposed coverage; it is never counted as canonical coverage.

| Inventory | Count | Disposition |
|---|---:|---|
| Static mechanics without canonical or proposed lineage | 5,154 | `NO_SCENARIO_LINEAGE` |
| Authority documents without canonical scenario lineage | 10 | inspect per-item posture below |
| Admitted know-how without canonical obligation lineage | 3 | inspect per-item posture below |
| Healing drafts without a canonical scenario target | 1 | `HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET` |

### Mechanics without lineage

| Mechanic | Occurrences | Files |
|---|---:|---:|
| object-construction | 1,823 | 81 |
| fallback | 1,185 | 71 |
| branch | 1,052 | 73 |
| iteration | 328 | 60 |
| state-mutation | 243 | 50 |
| validation | 128 | 20 |
| throw | 120 | 38 |
| normalization | 112 | 25 |
| exception-handling | 99 | 24 |
| serialization | 63 | 23 |
| retry | 1 | 1 |

### Authority without canonical scenario lineage

- `contracts/serves-query-console.admitted.contract.json` (governed-artifact-contract) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.authority.complete.json` (authority-declaration-unmarked.v1) — `FEATURE_COVERAGE_PROPOSED`
- `contracts/serves-query-console.authority.draft.json` (authority-declaration.draft.v1) — `FEATURE_COVERAGE_MISSING`
- `contracts/serves-query-console.authority.json` (authority-declaration.v1) — `FEATURE_COVERAGE_PROPOSED`
- `contracts/serves-query-console.binding.json` (authority-binding.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/.governance/projections/governed-message-artifact-family.ledger.json` (governed-artifact-projection-ledger.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-request-routing.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-snippet-retrieval.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/contracts/console-validation.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `src/console/governed-message-artifact-family/contracts/project-message.authority.json` (semantic-projection-authority.v1) — `FEATURE_COVERAGE_MISSING`

### Know-how without canonical obligation lineage

- `citation-and-live-wiring-are-independent` — `FEATURE_COVERAGE_MISSING` — This repo's generated-bundle convention (@generated header + 'Authority source: <mechanicId>' citation comments) can produce a bundle that is structurally correct and correctly cited but never imported anywhere. Citation correctness and live-wiring correctness are independent properties and must be checked separately -- 5 of 11 bundles in console-authority-runtime.mjs demonstrate this.
- `mechanic-type-presence-cannot-detect-dead-duplicates` — `FEATURE_COVERAGE_MISSING` — A duplicate inline implementation sitting next to an unused delegated one both register as the same mechanic type in the source index, which can mask that only one of the two is actually live. Mechanic-type-presence alone (as used by resolvesAuthoritySuccession) cannot distinguish 'the real one' from 'a dead twin'.
- `success-path-serialization-duplicated-inline` — `FEATURE_COVERAGE_PROPOSED` — Success-path JSON response serialization (handleIndexInfo, handleQuery, handleSnippet) is duplicated inline rather than delegated; only the error path is centralized through serializesErrorResponse(). The codebase clearly intended full centralization -- it just isn't complete yet.

### Healing drafts without a canonical scenario target

- `healing/success-response-serialization.connective-tissue-draft.json` — `FEATURE_COVERAGE_PROPOSED` — targets `success-response-serialization`, but declares no canonical feature / scenario / responsibility / obligation tuple.

## Subject Boundary

Scope mode: `WORKSPACE_BOUNDED`; repository-relative workspace prefix: `src`.

| Evidence class | Discovered | In subject | Excluded as out of subject |
|---|---:|---:|---:|
| Authority documents | 17 | 12 | 5 |
| Semantic-overlap proposal batches | 2 | 2 | 0 |
| Feature-coverage proposals | 2 | 1 | 1 |
| Live feature-inference evaluations | 2 | 1 | 1 |
| Know-how records | 3 | 3 | 0 |
| Healing drafts | 1 | 1 | 0 |

Excluded evidence is not called orphaned: it belongs to a different subject and is not judged by this scan.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains `NOT_EVALUATED` unless a separate execution receipt is supplied.

