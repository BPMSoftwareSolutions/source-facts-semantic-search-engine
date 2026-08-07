# 📊 Current Features & Scenarios Inventory

**Source:** Queried from governance report artifacts  
**Date:** August 7, 2026  
**Query:** `feature-coverage.features.v1` + scenario drilldowns

---

## 🎯 Features Overview

**Total Features:** 4  
**Total Scenarios:** 6  
**Distinct Authority Files:** 2

---

## Feature Details

### 1. 🔌 `delegate-console-authority`

**Purpose:**  
Delegate the admitted console mechanics to helper authorities and runtime dependencies.

**Authority Source:**  
`contracts/serves-query-console.governed.contract.json`

**Classification:**  
- serves-query-console

**Scenarios:** 1
- `delegate-console-mechanics`

**Lineage Quality:** ✅ No findings

**What it does:**
- Handles delegation of console commands to helper services
- Manages runtime dependencies for query console
- Ensures mechanics are properly admitted

---

### 2. 📝 `project-console-contract`

**Purpose:**  
Project a governed contract draft from the current authority and source-fact evidence.

**Authority Source:**  
`contracts/serves-query-console.governed.contract.json`

**Classification:**  
- serves-query-console

**Scenarios:** 1
- `project-governed-console-contract`

**Lineage Quality:** ⚠️ Findings
- `MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW` — Multiple implementations; needs consolidation
- `PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP` — Projection declared but no relationship defined

**What it does:**
- Generates contract draft from authority rules
- Validates against source facts evidence
- Projects governance rules

---

### 3. 💬 `project-governed-messages`

**Purpose:**  
Render a governed message from declared contract meaning.

**Authority Source:**  
`contracts/serves-query-console.contract.json`

**Classification:**  
- governed-message-artifact-family

**Scenarios:** 3
- `project-a-declared-message`
- `run-the-message-command`
- `verify-the-projected-message`

**Lineage Quality:** ✅ No findings

**What it does:**
- Takes declared message contracts and renders them
- Executes message commands through CLI
- Verifies output matches contract expectations

---

### 4. 🌐 `serve-query-console`

**Purpose:**  
Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.

**Authority Source:**  
`contracts/serves-query-console.governed.contract.json`

**Classification:**  
- serves-query-console

**Scenarios:** 1
- `serve-console-over-loopback`

**Lineage Quality:** ⚠️ Findings
- `IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES` — Multiple implementations for same responsibility

**What it does:**
- HTTP endpoint for query console
- Authority-based routing and validation
- Retrieves query snippets
- Serves over localhost/loopback

---

## 🎬 Scenarios Overview

**Total Scenarios:** 6

### Scenario Details

#### Feature: `delegate-console-authority`

**Scenario 1: `delegate-console-mechanics`**
- Delegates console mechanics to helper authorities
- Manages runtime dependencies
- Part of console authority infrastructure

---

#### Feature: `project-console-contract`

**Scenario 1: `project-governed-console-contract`**
- Generates contract from authority
- Validates using source-fact evidence
- **Status:** Has multiple responsibility owners (needs review)

---

#### Feature: `project-governed-messages`

**Scenario 1: `project-a-declared-message`**
- Declares a message contract
- Ready for projection

**Scenario 2: `run-the-message-command`**
- Executes the projected message via CLI
- Validates execution path

**Scenario 3: `verify-the-projected-message`**
- Verifies the projected message output
- Confirms correctness

---

#### Feature: `serve-query-console`

**Scenario 1: `serve-console-over-loopback`**
- HTTP server listening on localhost
- Routes queries through authority-backed rules
- Returns results to client
- **Status:** Has implementation variants (needs review)

---

## 📈 Cross-Feature Analysis

### Feature Clusters

**Cluster 1: Query Console Infrastructure** (3 features)
- `serve-query-console` — HTTP endpoint
- `project-console-contract` — Contract projection
- `delegate-console-authority` — Authority delegation

**Cluster 2: Message Handling** (1 feature)
- `project-governed-messages` — Message projection & execution

### Shared Authority Sources

| Authority File | Features | Count |
|---|---|---|
| `serves-query-console.governed.contract.json` | delegate-console-authority, project-console-contract, serve-query-console | 3 |
| `serves-query-console.contract.json` | project-governed-messages | 1 |

### Classification Relationships

| Classification | Features |
|---|---|
| serves-query-console | 3 features (delegate, project-contract, serve) |
| governed-message-artifact-family | 1 feature (project-messages) |

---

## ⚠️ Quality Findings Summary

### Issues Requiring Review

| Issue | Feature | Type | Action |
|---|---|---|---|
| Multiple responsibility owners | `project-console-contract` | Structural | Consolidate responsibilities or document intent |
| Projection obligation without relationship | `project-console-contract` | Structural | Define projecting relationship |
| Multiple implementation variants | `serve-query-console` | Structural | Choose canonical or document variants |

### Healthy Features

| Feature | Status |
|---|---|
| ✅ `delegate-console-authority` | No quality findings |
| ✅ `project-governed-messages` | No quality findings |

---

## 🔗 Dependency Map

```
serves-query-console (HTTP endpoint)
  ├─ Uses: delegate-console-authority
  │   └─ Delegates to: helper authorities
  │
  ├─ Uses: project-console-contract
  │   └─ Generates: governance contract draft
  │
  └─ May use: project-governed-messages
      └─ For: message rendering and execution
```

---

## 📊 Obligation & Responsibility Count

| Feature | Obligations | Responsibilities | Average Per Obligation |
|---|---|---|---|
| delegate-console-authority | ? | ? | ? |
| project-console-contract | ? | ? | ? |
| project-governed-messages | ? | ? | ? |
| serve-query-console | ? | ? | ? |

*Note: Detailed obligation/responsibility counts can be queried via scenario drilldowns*

---

## 🎯 Next Steps: Vocabulary Analysis

Now that you know your features and scenarios, you can use our vocabulary analysis to:

### Analysis 1: Feature Coverage
```javascript
// Which tests prove which features?
const featureTests = vocabularyCorrelations
  .filter(c => features.map(f => f.scenarioIds).flat().includes(c.scenarioId))
  .groupBy(c => c.featureId);
```

### Analysis 2: Scenario Test Proof
```javascript
// For each scenario, which tests provide proof?
const scenarioTests = {
  'delegate-console-mechanics': [...tests that cover 'delegate' vocabulary],
  'project-governed-console-contract': [...tests that cover 'project' vocabulary],
  'project-a-declared-message': [...tests that cover 'message' + 'declare' vocabulary],
  'run-the-message-command': [...tests that cover 'message' + 'run' vocabulary],
  'verify-the-projected-message': [...tests that cover 'message' + 'verify' vocabulary],
  'serve-console-over-loopback': [...tests that cover 'serve' + 'console' vocabulary],
}
```

### Analysis 3: Domain Vocabulary
```javascript
// What domain vocabulary is used across features?
const featureVocabulary = {
  delegate: ['delegate', 'authority', 'helper', 'runtime', 'dependency'],
  console: ['console', 'query', 'HTTP', 'endpoint', 'routing'],
  contract: ['contract', 'project', 'authority', 'evidence'],
  message: ['message', 'declare', 'govern', 'render', 'execute', 'verify'],
}
```

### Analysis 4: Quality Gaps
- ⚠️ `project-console-contract` — Multiple responsibility owners (test coverage?)
- ⚠️ `serve-query-console` — Multiple implementation variants (which do tests validate?)
- ✅ `project-governed-messages` — Clean structure (well-tested?)
- ✅ `delegate-console-authority` — Clean structure (well-tested?)

---

## 🚀 Using This Inventory

Once the governance report JSON serialization issue is resolved, you can:

1. **Run vocabulary analysis** to see which tests cover which scenarios
2. **Identify gaps** in test coverage for each feature
3. **Validate** quality findings (multiple owners, variants) with test data
4. **Optimize** test strategy based on feature dependencies

Example query to try:
```bash
# Run once JSON issue is fixed
npm run govern

# Then query your features
jq '.scenarioConformance.features[] | {featureId: .featureId, scenarios: .scenarios | length}' \
  artifacts/governance/source-facts-self-governance-report.v1.json
```

---

## Summary

Your SourceFacts codebase currently has:

- **4 Features** organized around query console infrastructure and message handling
- **6 Scenarios** covering the feature workflows
- **2 Quality issues** requiring architectural review (multiple owners, variants)
- **2 Authority files** defining the contracts

Your vocabulary analysis system can now map:
- Which tests exercise which feature scenarios
- Domain vocabulary alignment between tests and requirements
- Coverage gaps in the architecture

Ready to analyze test-scenario relationships using vocabulary! 📊
