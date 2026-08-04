# Source Facts Self-Governance Report

Feature Coverage and Scenario Conformance View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T02:10:42.736Z |
| **Repository** | source-facts-semantic-search-engine |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 3914d3c20c5518f7d7cc4576885d31a3d89f09edc20ad619c115e04f8bc6bf6a |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

This report is organized around canonical feature coverage and scenario closure. Static
mechanics, authority documents, wiring, reviews, know-how, and healing drafts are
supporting evidence only. They cannot establish conformance without an explicit
feature → scenario → responsibility → obligation → authority → execution → proof lineage and a passing
execution proof.

| Feature coverage posture | Count |
|---|---:|
| Canonical features | 4 |
| Scenarios | 6 |
| Fully conformant scenarios | 0 |
| Partially conformant scenarios | 6 |
| Feature proposals pending review | 1 |
| Live inference evaluations | 1 |
| Uncovered feature-inference clusters | 577 |
| Optional capability relations proposed | 0 |
| Duplicate proposals prevented | 0 |
| Unclassified mechanics | 5,042 |
| Scenarios affected by `BODY_AUTHORITY_UNCONNECTED` | 1 |
| Scenarios affected by `BODY_NOT_OBSERVED` | 1 |
| Scenarios affected by `BODY_OUTSIDE_REPORT_SUBJECT` | 2 |
| Scenarios affected by `EXECUTION_NOT_OBSERVED` | 6 |
| Scenarios affected by `PROOF_RESULT_NOT_OBSERVED` | 6 |

## Feature Coverage Proposals

Proposals are inferred coverage candidates, not canonical feature authority.

| Proposed feature | Evidence cluster | Scenarios | Coverage gained | Status | Duplicate check |
|---|---|---:|---:|---|---|
| `serialize-successful-responses` — Serialize successful query-console responses | 3 responsibility symbols, 20 targeted serialization mechanics (30 in source file) | 3 | 3 responsibilities | `FEATURE_PROPOSAL_REVIEW_REQUIRED` | `NEW_FEATURE_CANDIDATE` |
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

Evidence: `src/console/serves-query-console.runtime.impl.mjs`; symbols `handleIndexInfo`, `handleQuery`, `handleSnippet`; know-how `success-path-serialization-duplicated-inline`.

## Live Feature-Inference Evaluations

These are real model calls over deterministic query clusters. They are observational test evidence only: they do not establish feature coverage or capability placement.

| Candidate feature | Model call | Query receipt | Candidate comparison | Optional capability relation | Lifecycle |
|---|---|---|---|---|---|
| `serialize-successful-responses` — Serialize Successful Query Console Responses | `gemini-flash-latest`; 15,005 tokens; 12,754 ms; request `sha256:ab6531a94a41970e20d2b2e9247b4e8483f53a755bffc14c5acea23adb84ecf9`; response `sha256:d1cf1d60751a856bc0407ff145e5e5e99c724fe53f52037b443d2aa24d38aebf` | 20 rows; input `sha256:1ed906ddfd966245b8940db1927ae1197bae578b75c8865257b5289d53771a9f`; result `sha256:8a5b2ca0c1aa48ae75b0a9f45113f5ea345ba499f518d30027eceead4c124e6d` | `OVERLAPPING_FEATURES_REQUIRE_REVIEW` | `NO_CAPABILITY_RELATION_DETECTED` | `OBSERVATIONAL_NOT_ADMISSIBLE` |
|  | Evaluation: `reviews/live-evaluations/success-response-serialization.feature-coverage-inference-evaluation.json` | Fingerprint: `sha256:0e223b52b85ebbb5aad093b1f269893c1fc1da6ba924bc32dfcf78c04b5cef7f` |  |  |  |

## Uncovered Feature-Inference Clusters

These bounded clusters are eligible inference inputs after deterministic duplicate checking.

| Evidence cluster | Mechanics | Occurrences | Coverage posture |
|---|---|---:|---|
| `src/governance/generates-connective-tissue.js#generatesConnectiveTissue` | branch, exception-handling, fallback, iteration, normalization, object-construction, serialization, state-mutation, throw, validation | 221 | `FEATURE_COVERAGE_MISSING` |
| `src/web/html-projector.js#projectsHtmlDocument` | branch, fallback, iteration, object-construction, state-mutation | 101 | `FEATURE_COVERAGE_MISSING` |
| `src/projects-governed-console-contract.js#buildsConsoleGovernedContract` | branch, fallback, normalization, object-construction, state-mutation | 83 | `FEATURE_COVERAGE_MISSING` |
| `src/cli.js#parseArgs` | branch, iteration, normalization, object-construction, state-mutation | 82 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/projects-self-governance-report.js#projectsSelfGovernanceReport` | branch, fallback, iteration, object-construction, state-mutation | 74 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/projects-feature-coverage.js#projectsFeatureCoverage` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | 67 | `FEATURE_COVERAGE_MISSING` |
| `src/gallery/plans-surface-previews.js#plansOneItem` | branch, exception-handling, fallback, iteration, object-construction, state-mutation | 65 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/generates-connective-tissue.js#validatesGroundedDraft` | branch, fallback, iteration, object-construction, throw, validation | 57 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/proposes-feature-coverage.js#(module-scope)` | object-construction | 55 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/generates-connective-tissue.js#buildsConditionalSectionSchema` | object-construction | 54 | `FEATURE_COVERAGE_MISSING` |
| `src/projects-governed-console-contract.js#buildsConsoleServerSourceAuthority` | fallback, object-construction | 52 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/projects-feature-coverage.js#validatesFeatureCoverageProposal` | branch, fallback, iteration, object-construction | 51 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/proposes-feature-coverage.js#proposesFeatureCoverage` | branch, fallback, object-construction, state-mutation, throw, validation | 48 | `FEATURE_COVERAGE_MISSING` |
| `src/sqlserver/load-sqlserver.js#loadsSourceFactIndexIntoSqlServer` | branch, fallback, iteration, object-construction, state-mutation, throw, validation | 46 | `FEATURE_COVERAGE_MISSING` |
| `src/gallery/captures-browser-render.js#capturesOneItem` | branch, exception-handling, fallback, iteration, object-construction, state-mutation, validation | 45 | `FEATURE_COVERAGE_MISSING` |
| `src/console/serves-query-console.runtime.impl.mjs#handleRequestWithAuthority` | branch, exception-handling, fallback, object-construction, serialization, state-mutation, throw | 40 | `FEATURE_COVERAGE_MISSING` |
| `src/project.js#projectSourceFactsWorkspace` | branch, fallback, iteration, object-construction, throw | 40 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/proposes-semantic-overlap.js#proposesSemanticOverlap` | branch, fallback, object-construction, throw | 39 | `FEATURE_COVERAGE_MISSING` |
| `src/console/serves-query-console.runtime.impl.mjs#handleSnippet` | branch, fallback, object-construction, state-mutation | 37 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/projects-scenario-conformance.js#projectsFeatureSet` | branch, fallback, iteration, object-construction | 35 | `FEATURE_COVERAGE_MISSING` |
| `src/cli.js#runProposeFeatureCoverage` | branch, fallback, object-construction, serialization, state-mutation, throw | 34 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/formats-scenario-conformance-report.js#formatsScenarioConformanceReportMarkdown` | branch, fallback, iteration | 34 | `FEATURE_COVERAGE_MISSING` |
| `src/web/project-web-surfaces.js#projectsWebSurfaceIndex` | fallback, iteration, object-construction | 31 | `FEATURE_COVERAGE_MISSING` |
| `src/lib/reads-json-file.js#readsLineDelimitedTopLevelJson` | branch, fallback, iteration, object-construction, state-mutation, throw | 30 | `FEATURE_COVERAGE_MISSING` |
| `src/web/family-projector.js#expandsOneFamily` | branch, fallback, iteration, object-construction, state-mutation | 30 | `FEATURE_COVERAGE_MISSING` |
| `src/cli.js#runWebNorthStar` | branch, fallback, object-construction, state-mutation | 29 | `FEATURE_COVERAGE_MISSING` |
| `src/composition/writes-sign-in-composition.js#writesSignInComposition` | branch, fallback, normalization, object-construction, serialization, validation | 29 | `FEATURE_COVERAGE_MISSING` |
| `src/governance/formats-self-governance-report-summary.js#formatsSelfGovernanceReportSummary` | branch, fallback, iteration, object-construction, state-mutation | 29 | `FEATURE_COVERAGE_MISSING` |
| `src/cli.js#runProjectAuthorityViolations` | branch, fallback, object-construction, serialization, throw, validation | 28 | `FEATURE_COVERAGE_MISSING` |
| `src/gallery/materializes-static-preview.js#materializesStaticPreviews` | branch, iteration, object-construction, state-mutation, throw | 28 | `FEATURE_COVERAGE_MISSING` |
| … | 547 additional cluster(s) in JSON |  |  |

## Canonical Feature Drill-Down

| Feature | Optional classifications | Scenarios | Responsibilities | Conformant |
|---|---|---:|---:|---:|
| `delegate-console-authority` | `serves-query-console` | 1 | 1 | 0/1 (0.0%) |
| `project-console-contract` | `serves-query-console` | 1 | 3 | 0/1 (0.0%) |
| `project-governed-messages` | `governed-message-artifact-family` | 3 | 3 | 0/3 (0.0%) |
| `serve-query-console` | `serves-query-console` | 1 | 3 | 0/1 (0.0%) |

## Feature: `delegate-console-authority`

Delegate the admitted console mechanics to helper authorities and runtime dependencies.

Feature authority: `contracts/serves-query-console.governed.contract.json`

Optional classifications: `FEATURE_CLASSIFIED_UNDER_SOURCE_LINEAGE:serves-query-console`. These are derived labels, not feature parents.

### Scenario: `delegate-console-mechanics`

The console body delegates routing, validation, and snippet extraction to admitted authorities.

Closure: `EXECUTION_NOT_OBSERVED`

Blockers: `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `console-authority-bundles.v1.responsibility.v1` | `console-delegates-mechanics` — The console source body must delegate admitted mechanics to authority surfaces. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-authority-bundles.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

## Feature: `project-console-contract`

Project a governed contract draft from the current authority and source-fact evidence.

Feature authority: `contracts/serves-query-console.governed.contract.json`

Optional classifications: `FEATURE_CLASSIFIED_UNDER_SOURCE_LINEAGE:serves-query-console`. These are derived labels, not feature parents.

### Scenario: `project-governed-console-contract`

The translator emits a governed contract draft without hand-authoring the contract bytes.

Closure: `EXECUTION_NOT_OBSERVED`

Blockers: `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `console-routing-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-routing-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |
| `console-validation-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-validation-adapter.mjs` (BODY_STATICALLY_OBSERVED) | TRANSITIVE_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |
| `console-snippet-adapter.v1.responsibility.v1` | `console-contract-is-projected` — The console governed contract must be projected from source facts and admitted authority data. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/console-snippet-adapter.mjs` (BODY_STATICALLY_OBSERVED) | DIRECT_DATA_AND_RUNTIME | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

## Feature: `project-governed-messages`

Render a governed message from declared contract meaning.

Feature authority: `contracts/serves-query-console.contract.json`

Optional classifications: `FEATURE_CLASSIFIED_UNDER_SOURCE_LINEAGE:governed-message-artifact-family`. These are derived labels, not feature parents.

### Scenario: `project-a-declared-message`

A declared message value is projected into canonical output.

Closure: `BODY_NOT_OBSERVED`

Blockers: `BODY_NOT_OBSERVED`, `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `executes-message-projection` | `produce-one-canonical-message` — Exactly one canonical message must be produced from declared semantic authority. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/project-message.mjs` (BODY_NOT_OBSERVED) | NONE_OBSERVED | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

### Scenario: `run-the-message-command`

The projected message is emitted through the declared command port.

Closure: `BODY_OUTSIDE_REPORT_SUBJECT`

Blockers: `BODY_OUTSIDE_REPORT_SUBJECT`, `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `entry-point-for-message-command` | `emit-the-message-once` — The command must emit the projected message exactly once. | AUTHORITY_DECLARED | BINDING_DECLARED | `bin/run-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | NONE_OBSERVED | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

### Scenario: `verify-the-projected-message`

The projected message is proved against its declared expectation.

Closure: `BODY_OUTSIDE_REPORT_SUBJECT`

Blockers: `BODY_OUTSIDE_REPORT_SUBJECT`, `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `evaluates-message-proof` | `prove-the-message-conforms` — Verification must prove the projected message conforms. | AUTHORITY_DECLARED | BINDING_DECLARED | `verification/verifies-message.mjs` (BODY_OUTSIDE_REPORT_SUBJECT) | NONE_OBSERVED | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

## Feature: `serve-query-console`

Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.

Feature authority: `contracts/serves-query-console.governed.contract.json`

Optional classifications: `FEATURE_CLASSIFIED_UNDER_SOURCE_LINEAGE:serves-query-console`. These are derived labels, not feature parents.

### Scenario: `serve-console-over-loopback`

The console binds only to loopback and serves query, index, and snippet responses.

Closure: `BODY_AUTHORITY_UNCONNECTED`

Blockers: `BODY_AUTHORITY_UNCONNECTED`, `EXECUTION_NOT_OBSERVED`, `PROOF_RESULT_NOT_OBSERVED`

| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |
|---|---|---|---|---|---|---|---|---|
| `serves-query-console.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |
| `serves-query-console-conformant.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.conformant.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |
| `serves-query-console-projected.v1.responsibility.v1` | `console-serves-loopback-only` — The console server must bind only to the loopback interface. | AUTHORITY_DECLARED | BINDING_DECLARED | `src/console/serves-query-console.projected.mjs` (BODY_STATICALLY_OBSERVED) | NOT_DETERMINED_BEYOND_MAX_DEPTH | none statically observed | EXECUTION_NOT_OBSERVED | PROOF_DECLARED_RESULT_NOT_OBSERVED |

## Unclassified Inventory

These facts are inside the report subject but are not allowed to influence a
feature or scenario verdict until explicit lineage places them on the spine.

| Inventory | Count | Disposition |
|---|---:|---|
| Static mechanics without scenario lineage | 5,042 | `NO_SCENARIO_LINEAGE` |
| Authority documents without canonical scenario lineage | 10 | `AUTHORITY_WITHOUT_SCENARIO_LINEAGE` |
| Admitted know-how without obligation lineage | 3 | `UNCLASSIFIED_KNOW_HOW` |
| Healing drafts without a scenario target | 1 | `HEALING_WITHOUT_SCENARIO_TARGET` |

### Mechanics without scenario lineage

| Mechanic | Occurrences | Files |
|---|---:|---:|
| object-construction | 1,813 | 80 |
| fallback | 1,090 | 70 |
| branch | 1,024 | 72 |
| iteration | 315 | 58 |
| state-mutation | 266 | 51 |
| validation | 128 | 21 |
| throw | 121 | 38 |
| exception-handling | 109 | 25 |
| normalization | 103 | 24 |
| serialization | 72 | 23 |
| retry | 1 | 1 |

### Authority without scenario lineage

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

### Know-how awaiting obligation lineage

- `citation-and-live-wiring-are-independent` — `FEATURE_COVERAGE_MISSING` — This repo's generated-bundle convention (@generated header + 'Authority source: <mechanicId>' citation comments) can produce a bundle that is structurally correct and correctly cited but never imported anywhere. Citation correctness and live-wiring correctness are independent properties and must be checked separately -- 5 of 11 bundles in console-authority-runtime.mjs demonstrate this.
- `mechanic-type-presence-cannot-detect-dead-duplicates` — `FEATURE_COVERAGE_MISSING` — A duplicate inline implementation sitting next to an unused delegated one both register as the same mechanic type in the source index, which can mask that only one of the two is actually live. Mechanic-type-presence alone (as used by resolvesAuthoritySuccession) cannot distinguish 'the real one' from 'a dead twin'.
- `success-path-serialization-duplicated-inline` — `FEATURE_PROPOSAL_REVIEW_REQUIRED` — Success-path JSON response serialization (handleIndexInfo, handleQuery, handleSnippet) is duplicated inline rather than delegated; only the error path is centralized through serializesErrorResponse(). The codebase clearly intended full centralization -- it just isn't complete yet.

### Healing drafts awaiting a scenario target

- `healing/success-response-serialization.connective-tissue-draft.json` — `FEATURE_PROPOSAL_REVIEW_REQUIRED` — targets `success-response-serialization`, but declares no canonical feature / scenario / responsibility / obligation tuple.

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

`OBSERVATIONAL_NO_GATE_APPLIED` — this static run does not execute scenario proofs or gate a build. A scenario remains non-conformant until its declared responsibilities, authority, binding, projected body, live execution, and passing proof all close.

