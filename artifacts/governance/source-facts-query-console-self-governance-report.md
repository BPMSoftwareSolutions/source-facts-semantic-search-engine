# Source Facts Self-Governance Report

Honest Feature Coverage and Scenario Evaluation View

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-04T11:56:56.233Z |
| **Repository** | source-facts-query-console |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\source-facts-query-console` |
| **Scan ID** | ea4e3671cdab66ac6953d4d036137e21ea79dec40d0449003f98783e81518827 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

This report keeps four independent questions separate: whether lineage is canonical or proposed,
whether the declared structure is closed, whether execution was evaluated, and whether a proof
passed. Static source evidence and live LLM inference calls can support discovery, but neither is
a runtime execution receipt for a scenario.

| Dimension | Count |
|---|---:|
| Canonical feature declarations | 0 |
| Proposed features, not admitted | 1 |
| Canonical scenarios | 0 |
| Proposed scenarios, not admitted | 3 |
| Canonical scenarios structurally closed | 0 |
| Canonical scenarios structurally incomplete | 0 |
| Canonical scenarios with structural status not evaluated | 0 |
| Canonical scenarios with execution evaluated | 0 |
| Canonical scenarios with runtime conformance `NOT_EVALUATED` | 0 |
| Canonical scenarios conformant by execution proof | 0 |
| Canonical scenarios with lineage-quality findings | 0 |
| Mechanics with canonical scenario lineage | 0 |
| Mechanics with proposed scenario lineage | 4 |
| Mechanics with ambiguous scenario lineage | 0 |
| Mechanics without scenario lineage | 0 |
| Authority documents with canonical scenario lineage | 0 |
| Authority documents with proposed scenario lineage | 3 |
| Authority documents with ambiguous scenario lineage | 0 |
| Authority documents without scenario lineage | 4 |
| Unresolved responsibility-evidence clusters | 0 |
| Clusters confirmed as feature candidates | 0 |
| Live LLM inference evaluations | 1 |
| Optional capability relations proposed from evidence | 0 |
| Duplicate proposals prevented | 0 |

## Feature Coverage Proposals

These are inferred candidates. They do not become canonical feature or scenario lineage until admitted into canonical authority.

| Proposed feature | Evidence cluster | Scenarios | Responsibilities | Coverage posture | Duplicate check |
|---|---|---:|---:|---|---|
| `apply-query-console-boundary-policies` — Apply query-console boundary policies | 3 symbols; 4 matching object-construction mechanics | 3 | 3 | `FEATURE_COVERAGE_PROPOSED` | `NEW_FEATURE_CANDIDATE` |
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

Evidence files: `source-facts-query-console/src/csp-policy-adapter.mjs`, `source-facts-query-console/src/loopback-bind-adapter.mjs`, `source-facts-query-console/src/route-dispatch-adapter.mjs`; symbols: `classifiesLoopbackBind`, `classifiesRoute`, `projectsCspPolicy`; know-how: none.

## Live LLM Feature-Inference Evaluations

These are receipts from real model calls over deterministic query results. They test the inference target, but remain observational discovery evidence: they neither admit a feature nor execute a product scenario.

| Candidate feature | Model call | Query receipt | Candidate comparison | Optional capability relation | Lifecycle |
|---|---|---|---|---|---|
| `apply-query-console-boundary-policies` — Apply Query Console Boundary Policies | `gemini-flash-latest`; 10,485 tokens; 11,076 ms; request `sha256:c1434ae9a6b740bfcaa4497dffe30648c06bc5b90e25d3f149a533e2e385aebc`; response `sha256:2f634a73318dfb286f403ae450fc5e5191aa95dd2ba5b10e67478fc712f05092` | 4 rows; input `sha256:859a25c565c0bc6474427b49c75651460a6ec44132e97dc6f24f7242204d7dad`; result `sha256:ccc3fd6fac15d37eb7bc3121439d471f34425ada0f09b1fa545bf3b30af28cee` | `OVERLAPPING_FEATURES_REQUIRE_REVIEW` | `NO_CAPABILITY_RELATION_DETECTED` | `OBSERVATIONAL_NOT_ADMISSIBLE` |
|  | Evaluation: `reviews/live-evaluations/query-console-boundary.feature-coverage-inference-evaluation.json` | Fingerprint: `sha256:9eb128922546b3094202025b95d39b0ad6f9581d967b1b192c35aff31688d393` |  |  |  |

## Canonical Feature Drill-Down

**No canonical feature lineage is declared for this report subject.** Static mechanics and inference proposals can be inventoried, but no canonical scenario structural or runtime verdict can be made.

## Evidence Without Canonical Lineage

These facts are inside the report subject but have no admitted scenario lineage. A proposal is
shown as proposed coverage; it is never counted as canonical coverage.

| Inventory | Count | Disposition |
|---|---:|---|
| Static mechanics without canonical or proposed lineage | 0 | `NO_SCENARIO_LINEAGE` |
| Authority documents without canonical scenario lineage | 7 | inspect per-item posture below |
| Admitted know-how without canonical obligation lineage | 0 | inspect per-item posture below |
| Healing drafts without a canonical scenario target | 0 | `HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET` |

### Authority without canonical scenario lineage

- `source-facts-query-console/contracts/body-size-limit.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/loopback-bind.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_COVERAGE_PROPOSED`
- `source-facts-query-console/contracts/loopback-bind.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/query-console-csp-policy.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_COVERAGE_PROPOSED`
- `source-facts-query-console/contracts/query-console-csp-policy.bundle.json` (semantic-execution-bundle.v1) — `FEATURE_COVERAGE_MISSING`
- `source-facts-query-console/contracts/route-dispatch.authority.json` (bound-semantic-execution-authority.v1) — `FEATURE_COVERAGE_PROPOSED`
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

`OBSERVATIONAL_NO_GATE_APPLIED` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains `NOT_EVALUATED` unless a separate execution receipt is supplied.

