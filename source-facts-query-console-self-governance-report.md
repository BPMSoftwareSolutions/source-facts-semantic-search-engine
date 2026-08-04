# Source Facts Self-Governance Report

Feature Coverage and Scenario Conformance View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T02:10:38.313Z |
| **Repository** | source-facts-query-console |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\source-facts-query-console` |
| **Scan ID** | ea4e3671cdab66ac6953d4d036137e21ea79dec40d0449003f98783e81518827 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

This report is organized around canonical feature coverage and scenario closure. Static
mechanics, authority documents, wiring, reviews, know-how, and healing drafts are
supporting evidence only. They cannot establish conformance without an explicit
feature → scenario → responsibility → obligation → authority → execution → proof lineage and a passing
execution proof.

| Feature coverage posture | Count |
|---|---:|
| Canonical features | 0 |
| Scenarios | 0 |
| Fully conformant scenarios | 0 |
| Partially conformant scenarios | 0 |
| Feature proposals pending review | 1 |
| Live inference evaluations | 1 |
| Uncovered feature-inference clusters | 0 |
| Optional capability relations proposed | 0 |
| Duplicate proposals prevented | 0 |
| Unclassified mechanics | 0 |

## Feature Coverage Proposals

Proposals are inferred coverage candidates, not canonical feature authority.

| Proposed feature | Evidence cluster | Scenarios | Coverage gained | Status | Duplicate check |
|---|---|---:|---:|---|---|
| `apply-query-console-boundary-policies` — Apply query-console boundary policies | 3 responsibility symbols, 4 targeted object-construction mechanics (4 in source file) | 3 | 3 responsibilities | `FEATURE_PROPOSAL_REVIEW_REQUIRED` | `NEW_FEATURE_CANDIDATE` |
|  | Fingerprint: `sha256:2ecc8b28b9d8df67feea8dad2e9cca4c57faf22659e9c494f3b5412185062c19` (verified) |  |  |  |  |

### Proposed Feature: `apply-query-console-boundary-policies`

**As a** query-console operator; **I need** console boundary decisions to execute from admitted semantic policies; **so that** network admission, route dispatch, and browser access remain explicit and reviewable.

```gherkin
Feature: Apply query-console boundary policies

  Scenario: Admit only a loopback bind target
    Given a requested query-console bind hostname
    When the bind target is classified
    Then only an admitted loopback hostname is accepted
    And a non-loopback hostname produces the declared rejection disposition

  Scenario: Dispatch only an admitted console route
    Given a query-console method and pathname
    When the route request is classified
    Then an admitted method and pathname resolve to their canonical route
    And an unsupported route produces the declared rejection disposition

  Scenario: Project the restrictive query-console CSP
    Given the query console is preparing an HTTP response
    When the content-security policy is projected
    Then the canonical query-console CSP is returned
    And no undeclared third-party origin is admitted
```

Evidence: `source-facts-query-console/src/csp-policy-adapter.mjs`, `source-facts-query-console/src/loopback-bind-adapter.mjs`, `source-facts-query-console/src/route-dispatch-adapter.mjs`; symbols `classifiesLoopbackBind`, `classifiesRoute`, `projectsCspPolicy`; know-how .

## Live Feature-Inference Evaluations

These are real model calls over deterministic query clusters. They are observational test evidence only: they do not establish feature coverage or capability placement.

| Candidate feature | Model call | Query receipt | Candidate comparison | Optional capability relation | Lifecycle |
|---|---|---|---|---|---|
| `apply-query-console-boundary-policies` — Apply Query Console Boundary Policies | `gemini-flash-latest`; 11,158 tokens; 13,043 ms; request `sha256:27f331a72981a11c8eb0b9296c49699ff647e8c399734b06b7e9c8dc974efb20`; response `sha256:de7a3dd2f7f99b0e9949bb983725759ab5812e2fa032a4388c2404d1c3d95896` | 4 rows; input `sha256:04583cc3b4aa375358c0a9c021b94478decb0a9a97f3282e5066b57a07b5c174`; result `sha256:89d0a0a484ca52f313cf70c007c15cac57a5a1417e0fb3dd9ed84daf25df1b3a` | `OVERLAPPING_FEATURES_REQUIRE_REVIEW` | `NO_CAPABILITY_RELATION_DETECTED` | `OBSERVATIONAL_NOT_ADMISSIBLE` |
|  | Evaluation: `reviews/live-evaluations/query-console-boundary.feature-coverage-inference-evaluation.json` | Fingerprint: `sha256:55c9595d8213f99e4856c2e5f154ef1de021ecbac8b2a58576056f6bf712c0d3` |  |  |  |

## Canonical Feature Drill-Down

**No canonical feature lineage is declared for this report subject.** The scan can inventory static mechanics, but it cannot make a scenario-conformance claim. The next required authority is a canonical feature declaration for this workspace.

## Unclassified Inventory

These facts are inside the report subject but are not allowed to influence a
feature or scenario verdict until explicit lineage places them on the spine.

| Inventory | Count | Disposition |
|---|---:|---|
| Static mechanics without scenario lineage | 0 | `NO_SCENARIO_LINEAGE` |
| Authority documents without canonical scenario lineage | 7 | `AUTHORITY_WITHOUT_SCENARIO_LINEAGE` |
| Admitted know-how without obligation lineage | 0 | `UNCLASSIFIED_KNOW_HOW` |
| Healing drafts without a scenario target | 0 | `HEALING_WITHOUT_SCENARIO_TARGET` |

### Authority without scenario lineage

- `source-facts-query-console/contracts/body-size-limit.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/loopback-bind.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_PROPOSAL_REVIEW_REQUIRED`
- `source-facts-query-console/contracts/loopback-bind.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/query-console-csp-policy.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_PROPOSAL_REVIEW_REQUIRED`
- `source-facts-query-console/contracts/query-console-csp-policy.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/route-dispatch.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_PROPOSAL_REVIEW_REQUIRED`
- `source-facts-query-console/contracts/route-dispatch.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`

## Subject Boundary

Scope mode: `WORKSPACE_BOUNDED`; repository-relative workspace prefix: `source-facts-query-console`.

| Evidence class | Discovered | In subject | Excluded as out of subject |
|---|---:|---:|---:|
| Authority documents | 19 | 7 | 12 |
| Semantic-overlap proposal batches | 2 | 0 | 2 |
| Feature-coverage proposals | 2 | 1 | 1 |
| Live feature-inference evaluations | 2 | 1 | 1 |
| Know-how records | 3 | 0 | 3 |
| Healing drafts | 1 | 0 | 1 |

Excluded evidence is not called orphaned: it belongs to a different subject and is not judged by this scan.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this static run does not execute scenario proofs or gate a build. A scenario remains non-conformant until its declared responsibilities, authority, binding, projected body, live execution, and passing proof all close.

