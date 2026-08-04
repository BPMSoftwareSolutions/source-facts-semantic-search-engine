# Scenario Lineage Validation Report

**Generated:** 2026-08-04

**Project:** source-facts-semantic-search-engine

**Analysis:** Feature → scenario → responsibility → execution graph → test-lineage validation

## Query Commands (Every Claim Has a SQL Query)

All data in this report is extracted using native SQL queries against the governance report.

**Query Syntax:**
```bash
node src/cli.js query <index-or-report-file> "SELECT ... FROM ..."
```

---

## Available Tables in Governance Report

**Feature & Scenario Tables:**
- `gherkinFeatureRegistry` - Feature definitions
- `gherkinScenarioRegistry` - Scenario definitions  
- `gherkinStepRegistry` - Scenario steps
- `intentFeatureRegistry` - Feature intents
- `intentScenarioRegistry` - Scenario intents
- `intentResponsibilityRegistry` - Responsibility intent mappings

**Execution & Coverage Tables:**
- `reportFeatureCoverageSummary` - Feature coverage metrics
- `reportScenarioConformanceSummary` - Scenario conformance
- `reportOccurrences` - Source mechanics and their coverage
- `responsibilityCommandGraphRegistry` - Responsibility to call graph bindings

---

## Executive Summary

### Query: Feature Coverage Summary

```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM reportFeatureCoverageSummary"
```

**Output (sample):**
```
featureId | scenarioCount | callableCount | edgeCount | resolvedEdges | linkedTests | lineageDisposition
source-facts.cli-call-graph | 1 | 41 | 383 | 84 | 1 | FEATURE_LINEAGE_BOUND_RUNTIME_PROOF_MISSING
source-facts.cli-query | 1 | 14 | 85 | 13 | 0 | FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE
source-facts.cli-govern | 1 | 306 | 4053 | 934 | 0 | FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE
source-facts.cli-project | 1 | 61 | 436 | 128 | 0 | FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE
source-facts.cli-propose-feature-coverage | 2 | 32 | 274 | 55 | 0 | FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE
```

| Feature | Nodes | Edges | Scenarios | Linked tests | Runtime-proven scenarios | Lineage disposition |
|---|---:|---:|---:|---:|---:|---|
| `source-facts.cli-call-graph` | 41 | 383 | 1 | 1 | 0 | `FEATURE_LINEAGE_BOUND_RUNTIME_PROOF_MISSING` |
| `source-facts.cli-query` | 14 | 85 | 1 | 0 | 0 | `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE` |
| `source-facts.cli-govern` | 306 | 4,053 | 1 | 0 | 0 | `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE` |
| `source-facts.cli-project` | 61 | 436 | 1 | 0 | 0 | `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE` |
| `source-facts.cli-propose-feature-coverage` | 32 | 274 | 2 | 0 | 0 | `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE` |

---

## Detailed Results

### 1. CLI Call Graph

**Feature ID:** `source-facts.cli-call-graph`

**Query: Get Feature Registry Entry**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinFeatureRegistry WHERE featureId = 'source-facts.cli-call-graph'"
```

**Lineage disposition:** `FEATURE_LINEAGE_BOUND_RUNTIME_PROOF_MISSING`

#### Execution graph

**Query: Call Graph Metrics**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     featureId, 
     callableCount as reachableNodes,
     edgeCount as invocationEdges,
     resolvedEdges,
     unresolvedEdges,
     maxDepth
   FROM reportFeatureCoverageSummary 
   WHERE featureId = 'source-facts.cli-call-graph'"
```

**Output:**
```
featureId | reachableNodes | invocationEdges | resolvedEdges | unresolvedEdges | maxDepth
source-facts.cli-call-graph | 41 | 383 | 84 | 299 | 4
```

| Metric | Value |
|---|---:|
| Reachable nodes | 41 |
| Invocation edges | 383 |
| Resolved edges | 84 |
| Ambiguous edges | 0 |
| Unresolved edges | 299 |
| Maximum depth | 4 |
| Depth layers, including root depth 0 | 5 |

**Query: Semantic Boundary Counts**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT mechanic, COUNT(*) as count FROM reportOccurrences 
   WHERE featureId = 'source-facts.cli-call-graph' 
   GROUP BY mechanic ORDER BY count DESC"
```

| Disposition | Count |
|---|---:|
| `CALLBACK_OR_HIGHER_ORDER` | 69 |
| `INSTANCE_MEMBER_CALL` | 179 |
| `PLATFORM_BUILTIN_BOUNDARY` | 32 |
| `RESOLVED_INTERNAL_SYMBOL` | 84 |
| `STANDARD_LIBRARY_BOUNDARY` | 19 |

#### Scenario and responsibility binding

**Query: Get Scenario Details**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinScenarioRegistry 
   WHERE scenarioId = 'source-facts.cli-call-graph.from-entry-point'"
```

**Query: Get Responsibility Binding**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM intentResponsibilityRegistry 
   WHERE scenarioId = 'source-facts.cli-call-graph.from-entry-point'"
```

**Output:**
- Scenario: `source-facts.cli-call-graph.from-entry-point`
- Responsibility: `cli-call-graph-projection`
- Obligation: `project-all-resolvable-cli-reachability`
- Requested implementation symbols: `runCallGraph`, `projectsCliEntryPointCallGraph`
- Bound implementation symbols: `runCallGraph`, `projectsCliEntryPointCallGraph`
- Supporting callable IDs: 41
- Binding disposition: `RESPONSIBILITY_EXECUTION_GRAPH_BOUND`

#### Source facts and mechanics

- Scenario source-fact rows: 114
- Mechanic occurrences: 501
- Supporting callables containing those facts: 41
- Mechanic semantics remain `SEMANTIC_AUTHORITY_NOT_ADMITTED`
- Mechanic binding disposition is `FEATURE_INTERFACE_ROOT_APPLIED`

#### Test lineage

**Query: Get Test Bindings**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     scenarioId,
     COUNT(DISTINCT testId) as linkedTestCount,
     COUNT(CASE WHEN executionStatus = 'PASSED' THEN 1 END) as passedTests
   FROM reportScenarioConformanceSummary 
   WHERE featureId = 'source-facts.cli-call-graph'
   GROUP BY scenarioId"
```

**Output:**
```
scenarioId | linkedTestCount | passedTests
source-facts.cli-call-graph.from-entry-point | 1 | 0
```

- Linked tests: 1
- Test ID: `sha256:5b3dc0e9d335cc507bb2a0a87d68bc71e4000bcb43591bb089f66f656dd4bb20`
- Test name: `projectsCliEntryPointCallGraph builds a rooted transitive graph and reports dead callables`
- Test file: `test/call-graph.test.js`
- Declared proof count: 1
- Ingested proof count: 0
- Proof disposition: `SCENARIO_TEST_PROOF_DECLARED_EXECUTION_NOT_EVALUATED`

**Assessment:** The static feature-to-scenario-to-responsibility-to-execution-graph lineage is complete for the declared implementation symbols and full supporting call graph. This does not prove runtime execution, semantic authority, or feature authority.

---

### 2. CLI Query

**Feature ID:** `source-facts.cli-query`

**Query: Get Feature Details**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinFeatureRegistry WHERE featureId = 'source-facts.cli-query'"
```

**Lineage disposition:** `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE`

**Query: Get Metrics**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     featureId,
     callableCount,
     edgeCount,
     resolvedEdges,
     unresolvedEdges
   FROM reportFeatureCoverageSummary 
   WHERE featureId = 'source-facts.cli-query'"
```

| Metric | Value |
|---|---:|
| Reachable nodes | 14 |
| Invocation edges | 85 |
| Resolved / ambiguous / unresolved | 13 / 0 / 72 |
| Maximum depth | 5 |
| Supporting callable IDs | 14 |

**Query: Check Test Bindings**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT COUNT(*) as testCount FROM reportScenarioConformanceSummary 
   WHERE featureId = 'source-facts.cli-query' AND testId IS NOT NULL"
```

- Scenario: `source-facts.cli-query.from-command-line`
- Responsibility: `cli-query-entrypoint-execution`
- Obligation: `execute-semantic-search-query`
- Requested implementation symbols: none
- Bound implementation symbols: none
- Binding disposition: `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`
- Linked tests: 0
- Declared proof count: 0
- Proof disposition: `SCENARIO_WITHOUT_TEST_PROOF`

**Required remediation:** Declare the scenario's responsibility-specific `implementationSymbols` in `features/cli-query-command.intent.json`, regenerate the report, and verify that the intended symbols bind. Separately select and validate a test whose behavior proves this scenario before admitting scenario test lineage.

---

### 3. CLI Govern

**Feature ID:** `source-facts.cli-govern`

**Query: Get Feature Details**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinFeatureRegistry WHERE featureId = 'source-facts.cli-govern'"
```

**Lineage disposition:** `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE`

**Query: Get Metrics**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     featureId,
     callableCount,
     edgeCount,
     resolvedEdges,
     unresolvedEdges
   FROM reportFeatureCoverageSummary 
   WHERE featureId = 'source-facts.cli-govern'"
```

| Metric | Value |
|---|---:|
| Reachable nodes | 306 |
| Invocation edges | 4,053 |
| Resolved / ambiguous / unresolved | 934 / 2 / 3,117 |
| Maximum depth | 8 |
| Supporting callable IDs | 306 |

- Scenario: `source-facts.cli-govern.scan-and-report`
- Responsibility: `cli-governance-report-generation`
- Obligation: `produce-self-governance-report`
- Requested implementation symbols: none
- Bound implementation symbols: none
- Binding disposition: `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`
- Linked tests: 0
- Proof disposition: `SCENARIO_WITHOUT_TEST_PROOF`

**Required remediation:** Declare the minimal implementation symbols that define this responsibility. Do not create hundreds of per-callable mappings: the 306-callable supporting closure is already present. If one responsibility cannot accurately describe the behavior, first decompose the feature into atomic scenarios and obligations, then declare distinct implementation symbols for each.

---

### 4. CLI Project

**Feature ID:** `source-facts.cli-project`

**Query: Get Feature Details**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinFeatureRegistry WHERE featureId = 'source-facts.cli-project'"
```

**Lineage disposition:** `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE`

**Query: Get Metrics**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     featureId,
     callableCount,
     edgeCount,
     resolvedEdges,
     unresolvedEdges
   FROM reportFeatureCoverageSummary 
   WHERE featureId = 'source-facts.cli-project'"
```

| Metric | Value |
|---|---:|
| Reachable nodes | 61 |
| Invocation edges | 436 |
| Resolved / ambiguous / unresolved | 128 / 0 / 308 |
| Maximum depth | 6 |
| Supporting callable IDs | 61 |

- Scenario: `source-facts.cli-project.from-authority-declarations`
- Responsibility: `cli-artifact-projection`
- Obligation: `project-executable-from-authority`
- Requested implementation symbols: none
- Bound implementation symbols: none
- Binding disposition: `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`
- Linked tests: 0
- Proof disposition: `SCENARIO_WITHOUT_TEST_PROOF`

**Required remediation:** Declare the responsibility's implementation symbols in `features/cli-project-command.intent.json`, regenerate the report, and validate the binding. Test cases for successful projection, invalid authority, and partial authority may be useful, but none should be labeled scenario proof until its expected signals and production reachability are verified.

---

### 5. CLI Propose Feature Coverage

**Feature ID:** `source-facts.cli-propose-feature-coverage`

**Query: Get Feature Details**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinFeatureRegistry WHERE featureId = 'source-facts.cli-propose-feature-coverage'"
```

**Lineage disposition:** `FEATURE_RESPONSIBILITY_BINDING_INCOMPLETE`

**Query: Get Scenario Count**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT COUNT(DISTINCT scenarioId) as scenarioCount FROM gherkinScenarioRegistry 
   WHERE featureId = 'source-facts.cli-propose-feature-coverage'"
```

**Query: Get Metrics**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     featureId,
     callableCount,
     edgeCount,
     resolvedEdges,
     unresolvedEdges
   FROM reportFeatureCoverageSummary 
   WHERE featureId = 'source-facts.cli-propose-feature-coverage'"
```

| Metric | Value |
|---|---:|
| Reachable nodes | 32 |
| Invocation edges | 274 |
| Resolved / ambiguous / unresolved | 55 / 0 / 219 |
| Maximum depth | 5 |
| Supporting callable IDs per responsibility | 32 |

Scenario 1:

**Query: Get First Scenario**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinScenarioRegistry 
   WHERE scenarioId = 'source-facts.cli-propose-feature-coverage.discover-candidate-features'"
```

- Scenario: `source-facts.cli-propose-feature-coverage.discover-candidate-features`
- Responsibility: `cli-feature-candidate-discovery`
- Obligation: `propose-feature-candidates-from-evidence`
- Requested and bound implementation symbols: none
- Binding disposition: `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`
- Linked tests: 0

Scenario 2:

**Query: Get Second Scenario**
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM gherkinScenarioRegistry 
   WHERE scenarioId = 'source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference'"
```

- Scenario: `source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference`
- Responsibility: `cli-inference-evaluation`
- Obligation: `evaluate-proposals-with-live-inference`
- Requested and bound implementation symbols: none
- Binding disposition: `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`
- Linked tests: 0

Both scenarios currently inherit the same 32-callable supporting closure because neither responsibility declares implementation symbols.

**Required remediation:** Declare distinct implementation symbols for discovery and evaluation, regenerate the report, and verify that the responsibility slices separate as intended. Then select tests that independently demonstrate candidate discovery and live-inference evaluation without automatic admission.

---

## Summary Queries

### Query: All Feature Coverage Summary
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT * FROM reportFeatureCoverageSummary ORDER BY featureId"
```

### Query: All Scenarios with Test Count
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     s.featureId,
     s.scenarioId,
     COUNT(DISTINCT c.testId) as linkedTests,
     COUNT(CASE WHEN c.executionStatus = 'PASSED' THEN 1 END) as passedTests
   FROM gherkinScenarioRegistry s
   LEFT JOIN reportScenarioConformanceSummary c ON s.scenarioId = c.scenarioId
   GROUP BY s.featureId, s.scenarioId
   ORDER BY s.featureId, s.scenarioId"
```

### Query: Feature Disposition Summary
```bash
node src/cli.js query ./artifacts/governance/source-facts-self-governance-report.json \
  "SELECT 
     lineageDisposition,
     COUNT(*) as featureCount
   FROM reportFeatureCoverageSummary
   GROUP BY lineageDisposition"
```

---

## Gap Summary

### 1. Responsibility implementation bindings

Four features have `RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED`. This means their intent scenarios do not declare implementation symbols. It does not mean every supporting callable needs an individual mapping.

### 2. Scenario test lineage

Five scenarios have `SCENARIO_WITHOUT_TEST_PROOF`:

- `source-facts.cli-query.from-command-line`
- `source-facts.cli-govern.scan-and-report`
- `source-facts.cli-project.from-authority-declarations`
- `source-facts.cli-propose-feature-coverage.discover-candidate-features`
- `source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference`

Tests exercising related production code exist in the suite, but the current report does not establish that any particular test proves these scenario obligations.

### 3. Runtime proof ingestion

All six scenarios have `proofCount: 0`. The current test-traceability projector emits `TEST_EXECUTION_NOT_EVALUATED` and does not accept or ingest runtime execution receipts. Running tests demonstrates current workspace health but does not mutate the governance report or establish runtime proof.

### 4. Feature and interface authority

All five intents declare `FEATURE_AND_INTERFACE_AUTHORITY_MISSING`. Runtime proof cannot substitute for feature or interface authority.

### 5. Lifecycle

All five intent files declare `FEATURE_INTENT_PROPOSED`. Lifecycle promotion requires an explicit, governed update to the intent or authority model; it is not an automatic consequence of passing tests or ingesting runtime proof.

---

## Remediation Plan

### Priority 1: Declare responsibility implementation symbols

For query, govern, project, and both propose-feature-coverage scenarios:

1. Identify the smallest implementation symbols that embody each responsibility.
2. Add those symbols to the scenario's `implementationSymbols` in its intent JSON.
3. Regenerate the source index and governance report.
4. Rerun the feature lineage queries.
5. Require `RESPONSIBILITY_EXECUTION_GRAPH_BOUND` and inspect the resulting supporting closure.

### Priority 2: Admit scenario test lineage

For each unlinked scenario:

1. Identify candidate tests by production reachability.
2. Compare the test's assertions with the scenario's expected signals.
3. Add or refine a test when existing assertions do not prove the obligation.
4. Regenerate the test index and report.
5. Verify that the test appears in `reportScenarioConformanceSummary` for exactly the intended responsibility.

### Priority 3: Implement runtime-proof ingestion

This is missing product functionality, not an operator-only step. A complete implementation should:

1. Define a runtime-proof receipt contract binding commit/source identity, index ID, test ID, scenario ID, execution command, result, and timestamp.
2. Capture test-run results in that contract.
3. Validate receipts fail-closed against the current report and test declarations.
4. Accept validated receipts in the governance projection.
5. Set `proofCount` and `observedResult` only from validated, current receipts.
6. Add stale, mismatched, failed, and forged-proof tests.

Until that exists, the accurate status is `TEST_EXECUTION_NOT_EVALUATED` even after a successful test run.

To execute the call-graph test for workspace verification only:

```bash
node --test ./test/call-graph.test.js
```

This command does not ingest runtime proof.

### Priority 4: Establish authority and promote lifecycle separately

1. Establish admitted feature authority.
2. Establish admitted interface authority.
3. Reconcile the canonical intent with those authorities.
