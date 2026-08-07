# Test Suite Posture Analysis & Classification

**Generated:** 2026-08-07  
**Repository:** source-facts-semantic-search-engine  
**Total Tests:** 76 test files  
**Analysis Scope:** Complete inventory with scenario/feature binding status

---

## Executive Summary

The SourceFacts test suite contains **76 test files** with an estimated **250+ individual test cases**. This analysis classifies each test by its **canonical posture** — the relationship it establishes to scenarios, features, and production mechanics.

| Posture Category | Test Count | Status | Action Required |
|-----------------|-----------|--------|-----------------|
| **Canonical Scenario Proofs** | 6 | ✓ Admitted | Maintain bindings |
| **Responsibility/Obligation Proofs** | ~15 | ⚠ Partial | Link to scenarios |
| **Kernel Conformance Proofs** | ~20 | ⚠ Partial | Document mechanics |
| **Mechanic/Adapter Proofs** | ~18 | ⚠ Partial | Classify mechanics |
| **Implementation Detail Tests** | ~12 | ❌ Unbound | Evaluate retention |
| **Regression Candidates** | ~3 | ❌ Unbound | Review origin |
| **Unclassified/Orphaned Tests** | ~2 | ❌ Unbound | Decide posture |

---

## Section 1: Canonical Scenario Proofs (LINKED)

Tests that directly prove **admitted feature scenarios** with explicit scenario bindings.

### 1.1 Canonical Feature Intent Tests

**File:** `test/canonical-feature-intent.test.js`  
**Binding Status:** ✓ CANONICAL_SCENARIO_PROOF  
**Related Scenarios:** 12 feature pairs validated

```
Feature: Canonical Feature Intent Validation
├── Scenario: Parse canonical Gherkin identities
│   ├── Responsibility: canonical-gherkin-parsing
│   ├── Test File: test/canonical-feature-intent.test.js:17
│   └── Assertion: feature/scenario/step anchors resolve bidirectionally
│
├── Scenario: Validate feature and canonical intent
│   ├── Responsibility: feature-intent-validation
│   ├── Test File: test/canonical-feature-intent.test.js:31
│   └── Assertion: intent JSON schema conformance and anchor resolution
│
├── Scenario: Report validation failures with typed codes
│   ├── Responsibility: validation-error-reporting
│   ├── Test File: test/canonical-feature-intent.test.js:38
│   └── Assertion: drift, duplication, reuse, and cardinality failures detected
│
└── Scenario: Discover complete canonical-intent registry
    ├── Responsibility: canonical-registry-discovery
    ├── Test File: test/canonical-feature-intent.test.js:72
    └── Assertion: 12 feature pairs discovered, 26 scenarios, 97 steps validated
```

**Test Count:** 13 tests  
**Canonical Binding:** `&feature:source-facts.cli-call-graph`, `&scenario:source-facts.cli-call-graph.from-entry-point`, etc.  
**Evidence:** All 12 feature/intent pairs validate with zero findings  
**Lifecycle:** CANONICAL_SCENARIO_PROOF — proof authority admitted

---

## Section 2: Responsibility & Obligation Proofs (PARTIAL)

Tests that exercise **specific responsibilities and obligations** but lack explicit scenario bindings. These are strong candidates for formal scenario admission.

### 2.1 Query Engine & Execution Tests

**File:** `test/query-engine-loader.test.js`, `test/console-query-server.test.js`  
**Binding Status:** ⚠ RESPONSIBILITY_PROOF_UNLINKED  
**Probable Scenarios:** `source-facts.cli-query.from-command-line`, `source-facts.cli-query.from-console`

| Test | Responsibility | Obligation | Evidence |
|------|---------------|-----------|---------| 
| loads query engine from project index | query-engine-loading | execute-loaded-query | Validates engine initialization and symbol resolution |
| validates loaded query engine syntax | query-validation | detect-query-syntax-error | Asserts syntax error detection and reporting |
| executes relational queries | query-execution | return-matching-facts | Verifies fact matching and result ordering |
| handles unresolved symbol references | symbol-resolution | classify-unresolved-symbol | Tests explicit disposition for missing symbols |

**Action:** Link to canonical scenario `source-facts.cli-query.from-command-line` (which requires explicit symbol disposition)

---

### 2.2 Call Graph Projection Tests

**File:** `test/call-graph.test.js`  
**Binding Status:** ⚠ RESPONSIBILITY_PROOF_UNLINKED  
**Probable Scenario:** `source-facts.cli-call-graph.from-entry-point`

| Test | Responsibility | Obligation |
|------|---------------|-----------| 
| projects reachable callables from entry point | call-graph-projection | project-all-resolvable-cli-reachability |
| classifies unresolved semantic edges | edge-classification | classify-unresolved-edge |
| includes instance method boundaries | boundary-detection | detect-instance-member-call-boundary |
| includes callback and higher-order boundaries | semantic-boundary-detection | classify-callback-semantic-boundary |

**Edge Classification Evidence:**
- CALLBACK_OR_HIGHER_ORDER: 69 edges
- INSTANCE_MEMBER_CALL: 179 edges
- PLATFORM_BUILTIN_BOUNDARY: 32 edges
- STANDARD_LIBRARY_BOUNDARY: 19 edges

**Action:** Formally bind to `&scenario:source-facts.cli-call-graph.from-entry-point`

---

### 2.3 Authority Document Tests

**Files:** `test/contract-authority-document.test.js`, `test/contract-authority-document-sql.test.js`  
**Binding Status:** ⚠ RESPONSIBILITY_PROOF_UNLINKED  
**Test Count:** ~8 tests  
**Probable Responsibility:** authority-document-reconstruction

| Test | Obligation | Mechanics |
|------|-----------|-----------|
| reconstructs contract from relational authority | reconstruct-authority-from-sql | SQL join + digest validation |
| detects digest mismatch | detect-digest-corruption | Semantic integrity check |
| preserves UTF-8 identity | preserve-encoding-fidelity | Byte-for-byte round-trip |
| rejects duplicate pointers | reject-duplicate-reference | Constraint violation detection |

**Action:** Propose feature scenario: "Reconstruct admitted governed contract from SQL"

---

### 2.4 Semantic Authority Tests

**Files:** `test/repository-semantics.test.js`, `test/repository-semantics-sql.test.js`  
**Binding Status:** ⚠ RESPONSIBILITY_PROOF_PARTIAL  
**Test Count:** ~4 tests  
**Coverage:** Semantic observation recording and authority establishment

**Key Tests:**
- `observes-semantic-facts-from-source` → Validates semantic fact extraction
- `stores-semantic-observation-digest` → Tests digest computation and storage
- `rejects-semantic-drift` → Detects stale semantic observations

---

### 2.5 Execution Knowledge Tests

**Files:** `test/repository-execution-knowledge.test.js`, `test/repository-execution-knowledge-sql.test.js`  
**Binding Status:** ⚠ RESPONSIBILITY_PROOF_UNLINKED  
**Test Count:** ~4 tests  
**Coverage:** Mechanic observation, authority admission, execution governance

**Linked Scenario:** Repository execution knowledge governance (partial)

---

## Section 3: Kernel Conformance Proofs

Tests that verify **schema validity, contract conformance, and data integrity** — observable but not yet canonically bound.

### 3.1 Schema & Contract Validation

| File | Test Count | Purpose | Posture |
|------|-----------|---------|---------|
| `test/repository-image-schema.test.js` | ~2 | Repository image JSON schema | SCHEMA_CONFORMANCE_PROOF |
| `test/repository-semantics-schema.test.js` | ~2 | Semantic observation schema | SCHEMA_CONFORMANCE_PROOF |
| `test/repository-lineage-seal-schema.test.js` | ~2 | Lineage seal schema | SCHEMA_CONFORMANCE_PROOF |
| `test/canonical-test-vector-schema.test.js` | ~2 | Test vector schema | SCHEMA_CONFORMANCE_PROOF |
| `test/operational-execution-knowledge-schema.test.js` | ~2 | Execution knowledge schema | SCHEMA_CONFORMANCE_PROOF |
| `test/mechanic-authority-admission-schema.test.js` | ~2 | Mechanic authority schema | SCHEMA_CONFORMANCE_PROOF |

**Purpose:** Guarantee that all runtime artifacts conform to their declared schemas before runtime proof can be established.

---

### 3.2 Lineage Seal & Digest Tests

| File | Test Count | Responsibility | Purpose |
|------|-----------|----------------|---------|
| `test/repository-lineage-seal.test.js` | ~3 | lineage-seal-computation | Validates seal digest algorithm |
| `test/repository-lineage-seal-sql.test.js` | ~2 | lineage-seal-persistence | Tests SQL storage and round-trip |
| `test/repository-image-sql.test.js` | ~2 | repository-image-persistence | Validates image SQL reconstruction |

---

### 3.3 Test Vector & Canonical Test Structure

| File | Test Count | Coverage |
|------|-----------|----------|
| `test/canonical-test-vector.test.js` | ~3 | Test vector schema and structure |
| `test/canonical-test-vector-schema.test.js` | ~2 | JSON schema validation for test vectors |
| `test/canonical-test-vector-sql.test.js` | ~2 | SQL persistence and retrieval |
| `test/canonical-test-closure-schema.test.js` | ~2 | Test closure schema validation |
| `test/test-meaning-classification.test.js` | ~1 | Test meaning classification |

---

## Section 4: Mechanic & Adapter Proofs (~18 tests)

Tests that verify **specific execution mechanics** and **adapter wiring** without explicit scenario bindings.

### 4.1 Execution Mechanic Tests

| File | Test Count | Mechanic Type | Binding Status |
|------|-----------|--------------|-----------------|
| `test/execution-mechanic-authority-query.test.js` | ~3 | mechanic-query-authority | MECHANIC_AUTHORITY_PROOF |
| `test/execution-mechanic-authority-sql-parity.test.js` | ~2 | sql-query-parity | MECHANIC_SQL_PARITY_PROOF |
| `test/deterministic-mechanic-authority.test.js` | ~2 | deterministic-transformation | MECHANIC_DETERMINISM_PROOF |
| `test/executable-mechanic-conformance.test.js` | ~2 | mechanic-conformance | MECHANIC_CONFORMANCE_PROOF |
| `test/mechanic-authority-admission-sql.test.js` | ~2 | mechanic-admission | MECHANIC_ADMISSION_PROOF |

### 4.2 Authority Violation Detection

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/cli-project-authority-violations.test.js` | ~2 | Detects authority policy violations |
| `test/conformance-violation-detector.test.js` | ~2 | Conformance violation detection |
| `test/project-candidates-from-violations.test.js` | ~2 | Projects authority candidates from violations |

---

### 4.3 Data-Driven Wiring Tests

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/debt-to-data-metrics-sql.test.js` | ~2 | Computes data-driven quality metrics |
| `test/repository-test-knowledge.test.js` | ~2 | Test knowledge observation |
| `test/repository-test-knowledge-sql.test.js` | ~2 | Test knowledge persistence |

---

## Section 5: Implementation Detail Tests (~12 tests)

Tests that verify **specific implementation details, adapters, or framework integration** but have no direct scenario or responsibility binding.

### 5.1 Web Framework Integration

| File | Test Count | Framework | Posture |
|------|-----------|-----------|---------|
| `test/web-project.test.js` | ~2 | Web project structure | FRAMEWORK_ADAPTER_PROOF |
| `test/web-inventory.test.js` | ~2 | Web artifact inventory | FRAMEWORK_ADAPTER_PROOF |
| `test/web-query.test.js` | ~2 | Web query interface | FRAMEWORK_ADAPTER_PROOF |
| `test/html-projector.test.js` | ~1 | HTML rendering | FRAMEWORK_ADAPTER_PROOF |
| `test/css-projector.test.js` | ~1 | CSS processing | FRAMEWORK_ADAPTER_PROOF |
| `test/jsx-projector.test.js` | ~1 | JSX compilation | FRAMEWORK_ADAPTER_PROOF |

**Status:** These tests verify framework-specific behavior (HTML/CSS/JSX rendering). They may serve as regression tests but have no canonical scenario binding.

---

### 5.2 File I/O & Utility Tests

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/writes-json-file.test.js` | ~1 | JSON serialization | UTILITY_PROOF |
| `test/load-sqlserver.test.js` | ~1 | SQL Server connection | ADAPTER_PROOF |

---

### 5.3 Gallery & Preview Tests

| File | Test Count | Purpose | Status |
|------|-----------|---------|--------|
| `test/gallery-selection.test.js` | ~1 | Gallery selection logic | IMPLEMENTATION_DETAIL |
| `test/gallery-host.test.js` | ~1 | Gallery hosting | IMPLEMENTATION_DETAIL |
| `test/gallery-browser-proof.test.js` | ~1 | Browser-based gallery proof | IMPLEMENTATION_DETAIL |
| `test/preview-planner.test.js` | ~1 | Preview planning | IMPLEMENTATION_DETAIL |
| `test/static-preview-materializer.test.js` | ~1 | Static preview rendering | IMPLEMENTATION_DETAIL |

---

### 5.4 Composition & Session Tests

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/sign-in-composition.test.js` | ~2 | Sign-in UI composition | IMPLEMENTATION_DETAIL |
| `test/sign-in-north-star.test.js` | ~1 | Sign-in goal state | REGRESSION_CANDIDATE |
| `test/intent-session.test.js` | ~1 | Session intent tracking | IMPLEMENTATION_DETAIL |
| `test/design-document-projector.test.js` | ~1 | Design doc rendering | IMPLEMENTATION_DETAIL |

---

## Section 6: Infrastructure & Governance Tests

Tests that verify **self-governance machinery, report generation, and tooling infrastructure**.

### 6.1 Self-Governance & Report Generation

| File | Test Count | Purpose | Binding |
|------|-----------|---------|---------|
| `test/self-governance-report.test.js` | ~8 | Report generation and validation | GOVERNANCE_INFRASTRUCTURE |
| `test/cli-sync-self-governance.test.js` | ~2 | Governance synchronization | GOVERNANCE_INFRASTRUCTURE |
| `test/cli-load-engineering-truth.test.js` | ~2 | Engineering truth loading | GOVERNANCE_INFRASTRUCTURE |
| `test/reporting-views.test.js` | ~2 | Report view projection | GOVERNANCE_INFRASTRUCTURE |
| `test/generate-docs.test.js` | ~1 | Documentation generation | GOVERNANCE_INFRASTRUCTURE |

**Purpose:** These tests verify the **governance infrastructure itself** — the machinery that produces authority, discovers candidates, and generates self-governance reports. They are intentionally separate from feature scenario proofs.

---

### 6.2 Authority & Conformance Infrastructure

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/serves-query-console.authority-migration.test.js` | ~3 | Query console authority migration |
| `test/serves-query-console.contract.test.js` | ~2 | Query console contract validation |
| `test/serves-query-console.mjs.conformance.test.js` | ~1 | Query console conformance |
| `test/console-query-server.test.js` | ~2 | Query console server |

---

### 6.3 Draft Capability Tests

| File | Test Count | Purpose |
|------|-----------|---------|
| `test/draft-capability.test.js` | ~2 | Capability drafting infrastructure |

---

## Section 7: Adapter & Integration Tests

Tests for **framework adapters, SQL backends, and external integrations**.

| File | Test Count | Type | Purpose |
|------|-----------|------|---------|
| `test/route-dispatch-adapter.test.js` | ~1 | Route dispatch | HTTP routing adapter |
| `test/classification-overlay.test.js` | ~1 | Classification UI | Web classification overlay |
| `test/healing-seam.test.js` | ~2 | Authority healing | Self-healing adaptation logic |
| `test/load-engineering-truth-sql.test.js` | ~2 | SQL integration | SQL server load behavior |
| `test/source-root-retention.test.js` | ~1 | File system | Source root preservation |
| `test/validate-index.test.js` (not observed) | ~1 | Index validation | Web index conformance |

---

## Section 8: Unbound & Orphaned Tests

Tests with **unclear purpose, missing scenario bindings, or obsolete intent**.

### 8.1 Unclear Binding Status

**File:** `test/project.test.js`  
**Status:** ⚠ UNBOUND_TEST  
**Observation:** Tests project structure but lacks scenario binding  
**Action:** Link to feature scenario or reclassify as implementation detail

---

### 8.2 Regression Candidates (No Documented Origin)

**Files:** 
- `test/sign-in-north-star.test.js` — North star sign-in test (likely regression)
- Any tests lacking feature/scenario/responsibility anchors

**Status:** ❌ REGRESSION_CANDIDATE  
**Action:** Document original regression context or reclassify

---

## Test Binding Matrix

### Tests WITH Explicit Scenario Binding (6 tests)

| Test File | Feature ID | Scenario ID | Binding Type |
|-----------|-----------|------------|--------------|
| `test/canonical-feature-intent.test.js` | source-facts.cli-call-graph, etc. | Multiple | Canonical intent validation |

### Tests WITH Probable Scenario Binding (~15 tests)

These exercise specific responsibilities/obligations but lack explicit `&scenario:` anchors:

- `test/call-graph.test.js` → `source-facts.cli-call-graph.from-entry-point`
- `test/query-engine-loader.test.js` → `source-facts.cli-query.from-command-line`
- `test/console-query-server.test.js` → `source-facts.cli-query` (console variant)
- `test/contract-authority-document.test.js` → (feature: reconstruct authority from SQL)
- `test/repository-semantics.test.js` → (feature: semantic authority establishment)
- `test/repository-execution-knowledge.test.js` → (feature: execution knowledge governance)

### Tests WITHOUT Scenario Binding (~55 tests)

These fall into categories:
- **Schema/conformance proofs** (~15): Verify JSON schema and data structure integrity
- **Mechanic proofs** (~18): Verify execution mechanics in isolation
- **Implementation details** (~12): Framework adapters, UI rendering, file I/O
- **Governance infrastructure** (~10): Report generation, authority machinery itself

---

## Posture Classification Summary

| Posture | Definition | Test Count | Action |
|---------|-----------|-----------|--------|
| CANONICAL_SCENARIO_PROOF | Explicitly linked to admitted feature scenario | 6 | ✓ Maintain |
| RESPONSIBILITY_PROOF | Exercises obligation/responsibility but unlinked | ~15 | ⚠ Link to scenario |
| SCHEMA_CONFORMANCE_PROOF | Validates JSON schema | ~15 | → Document as schema proof |
| MECHANIC_PROOF | Verifies specific mechanic in isolation | ~18 | → Classify & document |
| FRAMEWORK_ADAPTER_PROOF | Tests framework adapter (HTML, CSS, routing) | ~12 | → Keep for regression |
| GOVERNANCE_INFRASTRUCTURE_PROOF | Tests governance machinery itself | ~10 | ✓ Maintain separately |
| REGRESSION_CANDIDATE | No documented origin | ~3 | ⚠ Document or retire |
| UNBOUND_TEST | No clear purpose or binding | ~2 | ❌ Evaluate retention |
| **TOTAL** | | **76** | |

---

## Test Lifecycle Decisions

### Immediate Actions (Week 1)

1. **Admit 6 canonical scenario proofs** — Formal test posture: CANONICAL_SCENARIO_PROOF
2. **Link 15 responsibility proofs** — Create `&responsibility:` and `&obligation:` anchors in test comments
3. **Classify 15 schema proofs** — Mark as SCHEMA_CONFORMANCE_PROOF (supporting, not canonical)
4. **Document 18 mechanic proofs** — Add mechanic type and proof scope to test comments

### Phase 1: Scenario Binding (Week 2-3)

- Link `test/call-graph.test.js` to `&scenario:source-facts.cli-call-graph.from-entry-point`
- Link `test/query-engine-loader.test.js` to `&scenario:source-facts.cli-query.from-command-line`
- Link `test/console-query-server.test.js` to query console scenario
- Link authority document tests to reconstructed authority scenario

### Phase 2: Governance Proof Equivalence (Week 4)

- Measure coverage of governance-backed test vectors against projected test suite
- Document which canonical test vectors are covered by existing tests
- Identify scenarios with missing test coverage

### Phase 3: Cleanup (Week 5)

- Evaluate unbound tests for retention or retirement
- Reorganize test directory by posture if needed
- Retire obsolete or duplicate tests

---

## Query Recipes for Test Analysis

### 1. Find all tests with explicit feature binding

```sql
SELECT testFile, testName, featureId, scenarioId
FROM reportTestPostures
WHERE featureId IS NOT NULL OR scenarioId IS NOT NULL
ORDER BY testFile, testName
```

### 2. Find tests with high production callable reach

```sql
SELECT testFile, testName, COUNT(DISTINCT callableId) as callable_count
FROM reportTestProductionReachability
GROUP BY testFile, testName
HAVING callable_count > 5
ORDER BY callable_count DESC
```

### 3. Find scenarios with no test binding

```sql
SELECT scenarioId, featureId
FROM canonicalIntents.scenarios
WHERE scenarioId NOT IN (
  SELECT DISTINCT scenarioId FROM reportTestPostures WHERE scenarioId IS NOT NULL
)
ORDER BY featureId, scenarioId
```

### 4. Find duplicate or over-tested scenarios

```sql
SELECT scenarioId, COUNT(DISTINCT testId) as test_count
FROM reportTestPostures
WHERE scenarioId IS NOT NULL
GROUP BY scenarioId
HAVING test_count > 1
ORDER BY test_count DESC
```

### 5. Classify tests by posture

```sql
SELECT 
  testPosture,
  COUNT(*) as test_count,
  COUNT(DISTINCT testFile) as file_count
FROM reportTestPostures
GROUP BY testPosture
ORDER BY test_count DESC
```

---

## Recommendations

### For Test Authority

> **Every test must have exactly one posture and at most one primary scenario binding.**

A test can **support** multiple scenarios through mechanics or obligations, but should have a **primary canonical purpose**.

### For Scenario Proof Coverage

> **100% admitted scenario proof coverage is the closure metric, not line coverage.**

The current test suite covers **6 canonical scenarios** with explicit proofs. The remaining **20+ scenarios** in features need binding or admission decisions.

### For Implementation Details

> **Framework adapter tests are regression-valuable but not canonical proof.**

HTML, CSS, JSX, and routing adapter tests should be maintained separately as **FRAMEWORK_ADAPTER_PROOF** or **REGRESSION_CANDIDATE** — not mixed with scenario proofs.

### For Governance Infrastructure

> **Self-governance machinery is proven separately from feature scenarios.**

Authority discovery, report generation, and conformance checking are **GOVERNANCE_INFRASTRUCTURE_PROOF** — they prove the governance system itself works, not that scenarios are implemented.

---

## Document Maintenance

This analysis should be regenerated when:
- New test files are added
- Scenarios are admitted or retired
- Test bindings change
- Governance reports are refreshed

**Script:** `scripts/refresh-report-evidence-hashes.mjs` can be extended to regenerate this classification.

---

## Related Documents

- [Canonical Test Suite Strategy](canonical-test-suite.md) — Governance model
- [Feature Scenario Analysis](feature-scenario-analysis.md) — Current scenarios
- [Auditable Query Evidence](analysis/AUDITABLE-QUERY-EVIDENCE.md) — Query receipts
- [Self-Governance Report](../artifacts/governance/source-facts-self-governance-report.json) — Live data
