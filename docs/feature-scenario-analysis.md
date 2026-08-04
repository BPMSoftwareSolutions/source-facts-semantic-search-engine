# Feature Scenario Analysis Report

**Generated:** 2026-08-04  
**Project:** source-facts-semantic-search-engine  
**Scope:** Complete feature and scenario inventory with lineage analysis

---

## Executive Summary

This report documents all features and scenarios across the source-facts system. The project defines **5 features** with a total of **7 scenarios**, all currently at the **FEATURE_INTENT_PROPOSED** lifecycle stage.

| Metric | Count |
|--------|-------|
| Total Features | 5 |
| Total Scenarios | 7 |
| Lifecycle Stage | FEATURE_INTENT_PROPOSED |
| Authority Status | FEATURE_AND_INTERFACE_AUTHORITY_MISSING |
| Features with Tests | 5 |
| Scenarios with Test Binding | 6 |
| Runtime Proof Status | PROOF_MISSING |

---

## Features Overview

### 1. CLI Query Command
**Feature ID:** `source-facts.cli-query`  
**Status:** FEATURE_INTENT_PROPOSED  
**Interface Root:** `src/cli.js#runQuery`

**Purpose:** Execute semantic queries against SourceFacts index from command line interface

#### Scenario: Execute a Semantic Query from CLI
**ID:** `source-facts.cli-query.from-command-line`  
**Responsibility:** `cli-query-entrypoint-execution`  
**Obligation:** `execute-semantic-search-query`

**Given:** A validated SourceFacts index is available  
**When:** The user invokes the query command with a search expression  
**Then:** Matching source facts are returned in canonical order  
**And:** Any unresolved symbols receive an explicit disposition

**Purpose Statement:**  
User can search SourceFacts index semantically from command line and receive canonical results

**Mechanics:** This scenario ensures that:
- The query command accepts search expressions from CLI
- Results are returned in deterministic canonical order
- Symbol resolution failures are explicitly classified (not silently ignored)

---

### 2. CLI Call Graph Command
**Feature ID:** `source-facts.cli-call-graph`  
**Status:** FEATURE_INTENT_PROPOSED  
**Interface Root:** `src/cli.js#runCallGraph`

**Purpose:** Project complete call graph reachability from CLI entry points through SourceFacts relationships

#### Scenario: Project Reachable Callables from a CLI Entry Point
**ID:** `source-facts.cli-call-graph.from-entry-point`  
**Responsibility:** `cli-call-graph-projection`  
**Obligation:** `project-all-resolvable-cli-reachability`

**Given:** A validated SourceFacts index containing callable and relationship facts  
**When:** The call graph is projected from a declared CLI entry point  
**Then:** Every statically resolvable callable is included in the reachable execution slice  
**And:** Every unresolved runtime-sensitive edge receives an explicit disposition

**Purpose Statement:**  
User can project complete reachable call graph from a CLI entry point and observe runtime-sensitive edge classifications

**Execution Graph Snapshot:**
- **Reachable Callables:** 41
- **Invocation Edges:** 383
  - Resolved: 84
  - Unresolved: 299
  - Ambiguous: 0
- **Depth Layers:** 4
- **Semantic Boundaries:**
  - CALLBACK_OR_HIGHER_ORDER: 69
  - INSTANCE_MEMBER_CALL: 179
  - PLATFORM_BUILTIN_BOUNDARY: 32
  - RESOLVED_INTERNAL_SYMBOL: 84
  - STANDARD_LIBRARY_BOUNDARY: 19

**Mechanics:** This scenario verifies that:
- Static analysis can trace all callable dependencies from CLI entry points
- Unresolved edges (callbacks, instance methods, built-ins) receive explicit semantic classifications
- The execution graph accurately represents both direct and transitive invocations
- No callable reachable through static analysis is missed

---

### 3. CLI Govern Command
**Feature ID:** `source-facts.cli-govern`  
**Status:** FEATURE_INTENT_PROPOSED  
**Interface Root:** `src/cli.js#runGovern`

**Purpose:** Generate comprehensive self-governance report documenting feature coverage, scenario conformance, and lineage quality

#### Scenario: Scan Workspace and Generate Self-Governance Report
**ID:** `source-facts.cli-govern.scan-and-report`  
**Responsibility:** `cli-governance-report-generation`  
**Obligation:** `produce-self-governance-report`

**Given:** A workspace containing SourceFacts authority documents and source code  
**When:** The user invokes the govern command on the workspace  
**Then:** A comprehensive self-governance report is generated with feature coverage and scenario conformance  
**And:** Lineage-quality findings and evaluation limits are explicitly documented

**Purpose Statement:**  
User can scan a workspace and receive deterministic governance report with validated claims, query receipts, and reconciliation status

**Mechanics:** This scenario ensures that:
- The workspace scanning is deterministic and reproducible
- Feature coverage is accurately measured against actual code
- Scenario conformance shows explicit bindings to source mechanics
- Lineage quality findings identify and document evaluation limits
- All generated findings include provenance (receipts, hashes)

---

### 4. CLI Project Command
**Feature ID:** `source-facts.cli-project`  
**Status:** FEATURE_INTENT_PROPOSED  
**Interface Root:** `src/cli.js#runProject`

**Purpose:** Project executable artifacts and contracts from canonical authority documents

#### Scenario: Project Executable Bodies and Contracts from Canonical Authority
**ID:** `source-facts.cli-project.from-authority-declarations`  
**Responsibility:** `cli-artifact-projection`  
**Obligation:** `project-executable-from-authority`

**Given:** Canonical authority documents exist for a declared feature  
**When:** The user invokes the project command against the authority  
**Then:** Executable JSON or code projections are generated from the authority  
**And:** The projection status and any missing authority gaps are documented

**Purpose Statement:**  
User can generate projected executable bodies and contracts from canonical authority without hand-authoring bytes

**Mechanics:** This scenario verifies that:
- Authority documents can be parsed and validated
- Projections are generated deterministically from authority
- The projection process documents any gaps in authority
- Generated artifacts are executable or consumable by downstream tools
- Status and validation results are captured for auditing

---

### 5. CLI Propose Feature Coverage Command
**Feature ID:** `source-facts.cli-propose-feature-coverage`  
**Status:** FEATURE_INTENT_PROPOSED  
**Interface Root:** `src/cli.js#runProposeFeatureCoverage`

**Purpose:** Discover and propose feature candidates from source evidence clusters and evaluate with optional LLM inference

#### Scenario 5.1: Discover and Propose Feature Candidates from Unresolved Evidence Clusters
**ID:** `source-facts.cli-propose-feature-coverage.discover-candidate-features`  
**Responsibility:** `cli-feature-candidate-discovery`  
**Obligation:** `propose-feature-candidates-from-evidence`

**Given:** A validated SourceFacts index with source facts and call graph data  
**When:** The user invokes the propose-feature-coverage command  
**Then:** Feature coverage proposals are generated from responsibility evidence clusters  
**And:** Each proposal retains evidence lineage to its source facts and mechanics

**Purpose Statement:**  
User can discover feature coverage proposals from unresolved evidence clusters with complete lineage to source mechanics

**Mechanics:** This scenario ensures that:
- Evidence clustering groups related source facts into coherent feature proposals
- Proposals are generated without hand-authored feature definitions
- Each proposal maintains traceable lineage to evidence sources
- The discovery process is automatic and deterministic

#### Scenario 5.2: Evaluate Feature Proposals with Live LLM Inference
**ID:** `source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference`  
**Responsibility:** `cli-inference-evaluation`  
**Obligation:** `evaluate-proposals-with-live-inference`

**Given:** Feature coverage proposals have been discovered from static evidence  
**When:** The user invokes inference evaluation on the proposed candidates  
**Then:** Live model inference results are recorded as observational discovery evidence  
**And:** Inference results remain observational and do not automatically admit features

**Purpose Statement:**  
User can evaluate proposed features with live model inference for discovery purposes while maintaining observational disposition

**Mechanics:** This scenario verifies that:
- LLM inference can be applied to generated proposals for evaluation
- Inference results are recorded but treated as observational evidence only
- Inference does not trigger automatic feature admission to the authority
- The observational disposition prevents false authority establishment from model output

---

## Scenario Dependency Map

```
[Feature: Query]              [Feature: Propose Coverage]
      ↓                              ↓
  [Scenario 1]          [Scenario 5.1] → [Scenario 5.2]
   (CLI Query)           (Discovery)       (LLM Eval)
      ↓                              ↓
   [Test Linked]          [Tests Linked]

[Feature: Call Graph]        [Feature: Govern]
      ↓                              ↓
  [Scenario 2]             [Scenario 4]
 (Call Graph)             (Report Gen)
      ↓                              ↓
   [Test Linked]           [Test Linked]

[Feature: Project]
      ↓
  [Scenario 3]
 (Authority)
      ↓
   [Test Linked]
```

---

## Lifecycle Status Summary

### Authority Status Across All Features
| Feature | Feature Authority | Interface Authority | Authority Gap |
|---------|------------------|---------------------|---------------|
| cli-query | MISSING | MISSING | Authority documents required |
| cli-call-graph | MISSING | MISSING | Authority documents required |
| cli-govern | MISSING | MISSING | Authority documents required |
| cli-project | MISSING | MISSING | Authority documents required |
| cli-propose-feature-coverage | MISSING | MISSING | Authority documents required |

**Key Finding:** All features are at the FEATURE_INTENT_PROPOSED stage with explicit gaps in canonical authority documentation. This is intentional — the system is designed to discover and document authority as coverage is validated.

### Test Binding Status
| Feature | Scenarios | Tests Linked | Tests Executed | Proof Status |
|---------|-----------|--------------|----------------|--------------|
| cli-query | 1 | 1 | NOT EVALUATED | MISSING |
| cli-call-graph | 1 | 1 | NOT EVALUATED | MISSING |
| cli-govern | 1 | 1 | NOT EVALUATED | MISSING |
| cli-project | 1 | 1 | NOT EVALUATED | MISSING |
| cli-propose-feature-coverage | 2 | 2 | NOT EVALUATED | MISSING |

---

## Step-by-Step Analysis Template

### Feature Template
```
Feature: [Feature Name]
├── Feature ID: [ID]
├── Purpose: [What the feature enables]
├── Interface Root: [src/file.js#function]
├── Lifecycle: FEATURE_INTENT_PROPOSED
├── Authority Status: [MISSING/PARTIAL/COMPLETE]
└── Scenarios:
    ├── Scenario 1: [Name]
    │   ├── Responsibility: [ID]
    │   ├── Obligation: [ID]
    │   ├── Given: [Pre-condition]
    │   ├── When: [Action]
    │   ├── Then: [Expected outcome]
    │   ├── And: [Additional outcome]
    │   └── Test Binding: [test ID] / [status]
    └── Scenario N: [...]
```

### Applied to CLI Query
```
Feature: Query SourceFacts semantic search console
├── Feature ID: source-facts.cli-query
├── Purpose: Execute semantic queries against SourceFacts index from CLI
├── Interface Root: src/cli.js#runQuery
├── Lifecycle: FEATURE_INTENT_PROPOSED
├── Authority Status: FEATURE_AND_INTERFACE_AUTHORITY_MISSING
└── Scenarios:
    └── Scenario: Execute a Semantic Query from CLI
        ├── Responsibility: cli-query-entrypoint-execution
        ├── Obligation: execute-semantic-search-query
        ├── Given: a validated SourceFacts index is available
        ├── When: the user invokes the query command with a search expression
        ├── Then: matching source facts are returned in canonical order
        ├── And: any unresolved symbols receive an explicit disposition
        └── Test Binding: [DECLARED] NOT EXECUTED
```

---

## Scenario Expectation Framework

Each scenario establishes **Expected Signals** — observable outcomes that prove the scenario's obligations are met:

### CLI Query Scenario
**Expected Signals:**
- Query expressions are correctly parsed from CLI arguments
- Matching facts are returned in the documented canonical order
- Unresolved symbol classifications are explicit and deterministic

### CLI Call Graph Scenario
**Expected Signals:**
- Every statically resolvable callable appears in the execution graph
- Unresolved edges are classified with explicit semantic boundaries
- The edge classification is deterministic across runs
- The graph depth and structure match the actual code structure

### CLI Govern Scenario
**Expected Signals:**
- Report generation is deterministic (same hash for same input)
- Feature coverage reflects actual declared features
- Scenario conformance accurately maps to source mechanics
- Lineage quality findings identify explicit evaluation limits

### CLI Project Scenario
**Expected Signals:**
- Projections are generated deterministically from authority
- Generated artifacts are syntactically valid
- Missing authority gaps are documented
- Status records capture projection success/failure

### CLI Propose Feature Coverage Scenarios
**Expected Signals (Discovery):**
- Evidence clusters are discovered automatically
- Proposals maintain full lineage to source mechanics
- Proposal generation is deterministic

**Expected Signals (LLM Evaluation):**
- Inference results are recorded with inference metadata
- Inference does not trigger automatic admission
- Observational disposition is maintained

---

## Quality Metrics

### Scenario Completeness

| Aspect | Status | Details |
|--------|--------|---------|
| Feature Definition | ✓ | All 5 features have formal definitions |
| Scenario Definition | ✓ | All 7 scenarios have formal specifications |
| Intent Documentation | ✓ | All features have canonical intent documents |
| Interface Mapping | ✓ | Each feature maps to an interface root |
| Test Declaration | ✓ | All scenarios have linked tests |
| Responsibility Assignment | ✓ | Each scenario has explicit responsibility |
| Obligation Definition | ✓ | Each scenario has concrete obligation |

### Evidence Binding

| Evidence Type | Count |
|---------------|-------|
| Gherkin Steps | 28 |
| Responsibilities | 7 |
| Obligations | 7 |
| Interface Symbols | 5 |
| Tests Declared | 6 |
| Feature Anchors | 5 |
| Scenario Anchors | 7 |

---

## Implementation Roadmap

### Phase 1: Interface Authority (Current)
- Define canonical interface boundaries
- Establish CLI command contracts
- Document expected behaviors in Gherkin

### Phase 2: Test Execution
- Execute all 6 declared tests
- Capture runtime proof evidence
- Document observed vs. expected behavior

### Phase 3: Feature Authority
- Establish canonical feature documents
- Define responsibility and obligation details
- Create formal feature specifications

### Phase 4: Governance
- Generate self-governance report
- Reconcile source code with declared features
- Document lineage quality findings

---

## Appendix: Feature Anchors

All features and scenarios use semantic anchors for bidirectional referencing:

### Feature Anchors
- `&feature:source-facts.cli-query`
- `&feature:source-facts.cli-call-graph`
- `&feature:source-facts.cli-govern`
- `&feature:source-facts.cli-project`
- `&feature:source-facts.cli-propose-feature-coverage`

### Scenario Anchors
- `&scenario:source-facts.cli-query.from-command-line`
- `&scenario:source-facts.cli-call-graph.from-entry-point`
- `&scenario:source-facts.cli-govern.scan-and-report`
- `&scenario:source-facts.cli-project.from-authority-declarations`
- `&scenario:source-facts.cli-propose-feature-coverage.discover-candidate-features`
- `&scenario:source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference`

### Step Anchors
All Given/When/Then/And steps have semantic anchors (e.g., `&given:source-index-available`) enabling precise lineage tracking from requirements through implementation to tests.

---

## Notes

- **Report Generated:** 2026-08-04
- **Analysis Basis:** Feature files, intent documents, and governance report data
- **Test Status:** Tests are declared but not yet executed; proof capture is pending
- **Authority Gap:** All features intentionally maintain "MISSING" authority status until validated through execution
- **Next Steps:** Execute test suite to establish runtime proof evidence
