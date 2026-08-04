# Six Dimensions Analysis Guide
## Comprehensive Reference for Codebase Introspection

---

## Overview: The Six Dimensions

Your codebase can be analyzed across **six orthogonal dimensions**. Each reveals different insights:

| Dimension | Focus | Primary Tools | Key Question |
|---|---|---|---|
| **1. Structure & Mechanics** | Code operation patterns | Body mechanics queries | *What operations is the code doing?* |
| **2. Coverage & Implementation** | Duplication and gaps | Mechanic grouping, pattern matching | *Where is code duplicated or missing?* |
| **3. Governance & Authority** | Authority alignment | Symbol inventory, lineage queries | *Does code conform to declared rules?* |
| **4. Feature Coverage** | Feature proposals | Feature fingerprinting, validation | *What features exist or are proposed?* |
| **5. Scenario Lineage & Quality** | Scenario structure | Obligation/responsibility queries | *Are scenarios complete and valid?* |
| **6. Queryable Facts (SQL)** | Raw relational data | SQL queries, aggregations | *What custom analysis can I run?* |

---

## Dimension 1: Structure & Mechanics

### What It Shows
The **atomic operations** your code performs: branching, iteration, state mutation, validation, exception handling, etc.

### Core Concepts

**Body Mechanics** = the 11 observable operation types:

```
1. object-construction    — building objects/maps/arrays
2. fallback              — default values, || operator
3. branch                — if/else, switch, ternary
4. iteration             — for, forEach, while loops
5. state-mutation        — variable assignment, push, etc
6. validation            — null checks, constraints
7. throw                 — error throwing
8. exception-handling    — try-catch blocks
9. normalization         — sorting, deduplication
10. serialization        — JSON.stringify, encoding
11. retry                — retry logic
```

### Key Queries

```sql
-- Distribution of operations in codebase
SELECT mechanic, COUNT(*) as count 
FROM bodyMechanics 
GROUP BY mechanic 
ORDER BY count DESC;

-- Complexity of modules
SELECT modulePath, COUNT(DISTINCT mechanic) as complexity 
FROM bodyMechanics 
GROUP BY modulePath 
ORDER BY complexity DESC;

-- Which modules do each operation?
SELECT modulePath, mechanic, COUNT(*) 
FROM bodyMechanics 
WHERE mechanic = 'serialization' 
GROUP BY modulePath, mechanic;
```

### Insights from Your Engine

```
Your engine uses:
- 1,820 object-construction operations (26.8%)
- 1,108 fallback operations (16.4%)
- 1,030 branch operations (15.2%)
- 319 iteration operations (4.7%)

Feature coverage specifically:
- 144 object-construction (building proposals)
- 116 fallback (defensive programming)
- 63 branch (conditional logic)
```

### How to Trace

Start with a specific module:
1. Query mechanic distribution
2. Identify which operations dominate
3. Read the code at those locations
4. Cross-reference with Dimension 2 (coverage)

**Example flow:**
```
modulePath = "proposes-feature-coverage.js"
  → 63 branch operations (18% of total)
  → suggests high validation/conditional logic
  → indicates feature proposal inference rules
```

---

## Dimension 2: Coverage & Implementation Patterns

### What It Shows
**Duplicated code**, **missing implementations**, **code consolidation opportunities**.

### Key Concepts

**Coverage Posture** = is this code path covered by:
- Canonical feature lineage? (FEATURE_COVERED)
- Proposed feature candidates? (FEATURE_COVERAGE_PROPOSED)
- Nothing? (FEATURE_COVERAGE_MISSING)

**Duplication Detection** = found identical:
- Mechanic sequences
- Function implementations
- Data flow patterns

### Key Queries

```sql
-- Find duplicated serialization (your real case)
SELECT modulePath, COUNT(*) as serCount
FROM bodyMechanics
WHERE mechanic = 'serialization'
GROUP BY modulePath
HAVING COUNT(*) > 1
ORDER BY serCount DESC;

-- Find unreachable code (fallback-only modules)
SELECT modulePath
FROM bodyMechanics
GROUP BY modulePath
HAVING COUNT(DISTINCT mechanic) = 1
  AND MAX(mechanic) = 'fallback';

-- Modules that could be consolidated
SELECT mechanic, modulePath, COUNT(*) as ops
FROM bodyMechanics
WHERE mechanic IN ('normalization', 'serialization', 'validation')
GROUP BY mechanic, modulePath
HAVING COUNT(*) > 3
ORDER BY mechanic, ops DESC;
```

### Real Example: serialize-successful-responses

Your self-governance report identified:

```
Proposed feature: serialize-successful-responses
  Evidence: 3 symbols (handleIndexInfo, handleQuery, handleSnippet)
  Mechanics: 20 matching serialization mechanics
  Issue: "Success-path JSON serialization is duplicated inline 
          rather than delegated; only error path is centralized"
```

**Execution trace:**
1. Query found 3 separate implementations
2. All use same mechanic type (serialization)
3. Same module (serves-query-console.runtime.impl.mjs)
4. Identical logic flow in each
5. BUT error path uses centralized serializesErrorResponse()

### How to Trace

```sql
-- 1. Find the symbols mentioned in report
SELECT name FROM symbols 
WHERE name IN ('handleIndexInfo', 'handleQuery', 'handleSnippet');

-- 2. Find their serialization code
SELECT modulePath, COUNT(*) as serCount
FROM bodyMechanics
WHERE mechanic = 'serialization'
  AND modulePath LIKE '%console%'
GROUP BY modulePath;

-- 3. Compare against centralized error serialization
SELECT modulePath, COUNT(*) as errorCount
FROM bodyMechanics
WHERE modulePath LIKE '%serializesError%'
GROUP BY modulePath;

-- 4. Calculate duplication gap
-- (3 separate implementations vs 1 centralized)
```

---

## Dimension 3: Governance & Authority Alignment

### What It Shows
**Declaration vs reality**. Does actual code implement declared authority?

### Key Concepts

**Authority** = declared responsibilities + obligations
```
Authority Document:
  ├─ Feature (user-facing capability)
  │  ├─ Scenario (observable test case)
  │  │  └─ Obligation (what must happen)
  │  │     └─ Responsibility (who does it)
  │  │        └─ Artifact (code location)
  └─ Binding (which module implements it)
```

**Lineage** = path from code → scenario → feature
- CANONICAL: admitted authority
- PROPOSED: inferred from code evidence
- AMBIGUOUS: multiple possible interpretations

### Key Queries

```sql
-- Symbols that ARE declared authorities
SELECT name FROM symbols
WHERE name LIKE '%authority%'
   OR name LIKE '%contract%'
   OR name LIKE '%responsibility%';

-- Symbols that SHOULD BE authorities (inferred)
SELECT name FROM symbols
WHERE name LIKE '%projects%'
   OR name LIKE '%validates%'
   OR name LIKE '%conformance%';

-- Authority-related mechanics
SELECT mechanic, COUNT(*) as count
FROM bodyMechanics
WHERE modulePath LIKE '%authority%'
   OR modulePath LIKE '%governance%'
GROUP BY mechanic
ORDER BY count DESC;
```

### Real Example: serve-query-console

Your self-governance report shows:

```
Feature: serve-query-console
  Status: CANONICAL (admitted)
  Scenarios: 1 (serve-console-over-loopback)
  Structural status: NOT_EVALUATED (can't prove it's complete)
  Runtime conformance: NOT_EVALUATED (hasn't been executed)
  
  Lineage quality findings:
    ⚠ IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES
    (3 separate implementations should be one)
```

### How to Trace

```sql
-- 1. Find console-related responsibilities
SELECT name FROM symbols
WHERE name LIKE '%console%'
  AND name LIKE '%responsibility%';

-- 2. Check their mechanics
SELECT modulePath, mechanic, COUNT(*) as ops
FROM bodyMechanics
WHERE modulePath LIKE '%console%'
GROUP BY modulePath, mechanic
ORDER BY modulePath, ops DESC;

-- 3. Find authority bindings
SELECT name FROM symbols
WHERE name LIKE '%serves-query-console%'
   OR name LIKE '%console-routing%'
   OR name LIKE '%console-validation%';

-- 4. Measure conformance
SELECT COUNT(CASE WHEN mechanic = 'validation' THEN 1 END) as validations
FROM bodyMechanics
WHERE modulePath LIKE '%console%';
```

---

## Dimension 4: Feature Coverage Candidates

### What It Shows
**What features exist** (canonical) and **what features are proposed** (inferred).

### Key Concepts

**Feature Lifecycle:**
```
1. PROPOSED (inferred from code evidence)
   ↓ (after review/governance)
2. ADMITTED (canonical authority)
   ↓ (after execution testing)
3. PROVEN (runtime conformance verified)
```

**Feature Fingerprinting** = deterministic identity based on:
- Scenarios owned by feature
- Obligations within scenarios
- Responsibilities implementing those
- Authority relationships

### Key Queries

```sql
-- All feature-related functions
SELECT name FROM symbols
WHERE kind = 'function'
  AND (name LIKE '%Feature%' 
    OR name LIKE '%Coverage%');

-- What mechanics power feature inference?
SELECT mechanic, COUNT(*) as count
FROM bodyMechanics
WHERE modulePath LIKE '%feature-coverage%'
   OR modulePath LIKE '%proposes-feature%'
GROUP BY mechanic
ORDER BY count DESC;

-- Evidence collection points
SELECT modulePath, COUNT(*) as evidenceOps
FROM bodyMechanics
WHERE mechanic IN ('object-construction', 'serialization')
  AND modulePath LIKE '%discovers%'
GROUP BY modulePath;
```

### Real Example: serialize-successful-responses

**Proposal details:**
```
Feature: serialize-successful-responses
  Status: PROPOSED (not yet canonical)
  Fingerprint: sha256:9ec5470fca11...
  Evidence cluster: 
    - 3 symbols (handleIndexInfo, handleQuery, handleSnippet)
    - 20 serialization mechanics matched
    - 1 source file (serves-query-console.runtime.impl.mjs)
  
  Scenarios proposed:
    1. Serialize successful index-information response
    2. Serialize successful query response
    3. Serialize successful snippet response
  
  Disposition: NEW_FEATURE_CANDIDATE (not yet admitted)
```

### How to Trace Feature Fingerprinting

```
Input: feature proposal document
  ↓
Extract fingerprint subject:
  - List all scenarios
  - For each scenario, list its obligations (sorted by ID)
  - For each obligation, list statement text
  - Collect all responsibility IDs (sorted, unique)
  - Collect all authority subjects (sorted, unique)
  ↓
Canonicalize (deep sort all keys):
  { obligations: { scenario: {...}, scenario: {...} },
    responsibilities: [...],
    authority: [...] }
  ↓
JSON.stringify (no whitespace)
  ↓
SHA256 hash
  ↓
Output: sha256:9ec5470fca11c60808c3dd8f161b7588a3b2bdb95a4af258b1a0bd1d4c4e1970
```

**Key property:** Same logical feature always produces same hash

---

## Dimension 5: Scenario Lineage & Quality

### What It Shows
**Are scenarios complete and valid?** Do they form a closed set of interrelated concepts?

### Key Concepts

**Scenario Structure:**
```
Scenario
  ├─ Given (initial state)
  ├─ When (action/trigger)
  ├─ Then (expected outcome)
  ├─ Primary obligation (what must be delivered)
  ├─ Observable result (how to detect success)
  └─ Conformance signal (proof mechanism)
```

**Structural Closure** = all references resolve:
- Each responsibility → valid scenario
- Each obligation → valid scenario
- Each scenario → valid feature
- No dangling references

**Lineage Quality Findings** = structural issues:
- IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES
- MULTIPLE_RESPONSIBILITY_OWNERS_REQUIRE_REVIEW
- PROJECTION_OBLIGATION_HAS_NO_PROJECTING_RELATIONSHIP

### Key Queries

```sql
-- Scenario/obligation/responsibility symbols
SELECT name FROM symbols
WHERE name LIKE '%scenario%'
   OR name LIKE '%obligation%'
   OR name LIKE '%responsibility%'
ORDER BY name;

-- Validation mechanics (enforcing constraints)
SELECT modulePath, COUNT(*) as checks
FROM bodyMechanics
WHERE mechanic = 'validation'
GROUP BY modulePath
ORDER BY checks DESC;

-- Conformance testing functions
SELECT name FROM symbols
WHERE kind = 'function'
  AND (name LIKE '%conforms%'
    OR name LIKE '%validates%'
    OR name LIKE '%proves%');
```

### Real Example: delegate-console-authority

**Scenario lineage analysis:**

```
Feature: delegate-console-authority
  Scenario: delegate-console-mechanics
    
    Given: console authority defined
    When: console body processes request
    Then: routing/validation/extraction delegated
    
    Responsibility: console-authority-bundles
      ├─ Obligation: "console-delegates-mechanics"
      ├─ File: src/console/console-authority-bundles.mjs
      ├─ Status: BODY_STATICALLY_OBSERVED (code exists)
      ├─ Wiring: TRANSITIVE_DATA_AND_RUNTIME (called indirectly)
      └─ Proof: NOT_EVALUATED (not yet executed)

    Structural status: STRUCTURALLY_CLOSED ✓
    Runtime conformance: NOT_EVALUATED ✗
```

### How to Trace Quality Findings

**Trace for: IMPLEMENTATION_VARIANTS_DECLARED_AS_DISTINCT_RESPONSIBILITIES**

```sql
-- 1. Find the feature
SELECT name FROM symbols
WHERE name LIKE '%serve-query-console%';

-- 2. Find its responsibilities
SELECT name FROM symbols
WHERE kind = 'variable' OR kind = 'parameter'
  AND name LIKE '%responsibility%'
  AND (name LIKE '%serves%' OR name LIKE '%console%');

-- 3. Check if implementations are duplicated
SELECT modulePath, mechanic, COUNT(*) as count
FROM bodyMechanics
WHERE modulePath IN (
  'console-routing-adapter.mjs',
  'console-validation-adapter.mjs',
  'console-snippet-adapter.mjs'
)
GROUP BY modulePath, mechanic
ORDER BY modulePath, mechanic;

-- 4. Result: 3 adapters with identical mechanics
--          suggests variants could be unified
```

---

## Dimension 6: Queryable Facts (SQL-Based Tracing)

### What It Shows
**Raw relational data** that powers all other dimensions.

### Available Collections

| Collection | Rows in Your Index | What It Represents |
|---|---:|---|
| **bodyMechanics** | 6,380 | Operations (branch, iteration, etc) at specific locations |
| **symbols** | 4,807 | Functions, variables, classes, parameters |
| **relationships** | 21,534 | Function calls, data flow, dependencies |
| **sourceReferences** | (many) | Exact file:line:column locations |
| **documentFacts** | 2,127 | JSON structure observations |
| **files** | 91 | Source files scanned |

### Query Patterns

**Pattern A: Find all occurrences of a mechanic**
```sql
SELECT modulePath, COUNT(*) as count
FROM bodyMechanics
WHERE mechanic = 'serialization'
GROUP BY modulePath
ORDER BY count DESC;
```

**Pattern B: Multi-mechanic analysis**
```sql
SELECT 
  modulePath,
  COUNT(CASE WHEN mechanic = 'object-construction' THEN 1 END) as constructions,
  COUNT(CASE WHEN mechanic = 'serialization' THEN 1 END) as serializations,
  COUNT(CASE WHEN mechanic = 'validation' THEN 1 END) as validations
FROM bodyMechanics
GROUP BY modulePath
ORDER BY constructions DESC;
```

**Pattern C: Relationship traversal**
```sql
-- How many functions call specific dependencies?
SELECT toSymbolCandidate, COUNT(*) as callers
FROM relationships
WHERE relationshipKind = 'dependency'
GROUP BY toSymbolCandidate
ORDER BY callers DESC;
```

### Advanced Analysis: Dataflow Reconstruction

```sql
-- Reconstruct data flow: what gets constructed, validated, serialized?
SELECT 
  'construction' as phase,
  COUNT(*) as operations
FROM bodyMechanics
WHERE mechanic = 'object-construction'
  AND modulePath LIKE '%feature-coverage%'

UNION ALL

SELECT 
  'validation' as phase,
  COUNT(*) as operations
FROM bodyMechanics
WHERE mechanic = 'validation'
  AND modulePath LIKE '%feature-coverage%'

UNION ALL

SELECT 
  'serialization' as phase,
  COUNT(*) as operations
FROM bodyMechanics
WHERE mechanic = 'serialization'
  AND modulePath LIKE '%feature-coverage%';
```

**Interpretation:**
- Construction before validation = defensive (good)
- Serialization before validation = risky (bad)
- No validation = untraced (needs governance)

---

## Connecting the Dimensions: A Complete Example

### Question: "How is feature coverage inferred?"

**Dimension 1 (Structure):**
```sql
SELECT mechanic, COUNT(*) 
FROM bodyMechanics 
WHERE modulePath LIKE '%proposes-feature%'
GROUP BY mechanic 
ORDER BY count DESC;
```
→ Shows: 63 branches, 144 constructions (decision logic + building objects)

**Dimension 2 (Coverage):**
```sql
-- Check for duplicated inference logic
SELECT modulePath, COUNT(*) as duplicates
FROM bodyMechanics
WHERE mechanic = 'object-construction'
  AND modulePath LIKE '%feature%'
GROUP BY modulePath
HAVING COUNT(*) > 20;
```
→ Shows: proposesFeatureCoverage (144), projectsFeatureCoverage (many)

**Dimension 3 (Governance):**
```sql
-- Is feature inference declared in authority?
SELECT name FROM symbols
WHERE name LIKE '%invokesLiveModel%'
   OR name LIKE '%inferenceEvaluation%';
```
→ Shows: live model invocation is authorized

**Dimension 4 (Features):**
```sql
-- What features does this produce?
SELECT name FROM symbols
WHERE name LIKE '%featureCoverage%'
   AND kind = 'variable';
```
→ Shows: featureCoverageProposalBatches, featureCoverageInferenceEvaluationBatches

**Dimension 5 (Scenarios):**
```sql
-- What scenarios are validated?
SELECT name FROM symbols
WHERE name LIKE '%scenario%'
  AND (name LIKE '%validate%' OR name LIKE '%check%');
```
→ Shows: scenario validation functions

**Dimension 6 (Queryable Facts):**
```sql
-- Raw trace: relationships from inference → validation
SELECT COUNT(*) as steps
FROM relationships
WHERE fromSymbolCandidate LIKE '%proposes%'
  OR fromSymbolCandidate LIKE '%validates%';
```
→ Shows: 21+ relationships in inference chain

---

## Analysis Workflow

### For Feature Coverage Tracing:

1. **Start with Dimension 1** (Structure)
   - Query: What mechanics are used?
   - Goal: Understand operation types

2. **Move to Dimension 4** (Features)
   - Query: What features are proposed?
   - Goal: Identify inference targets

3. **Check Dimension 5** (Scenarios)
   - Query: Are scenarios valid?
   - Goal: Validate structure

4. **Verify Dimension 3** (Governance)
   - Query: Is inference authorized?
   - Goal: Check authority alignment

5. **Optimize with Dimension 2** (Coverage)
   - Query: Are there duplicates?
   - Goal: Find consolidation opportunities

6. **Deep dive with Dimension 6** (SQL)
   - Query: Custom relationship analysis
   - Goal: Answer specific questions

---

## Summary: When to Use Each Dimension

| You want to... | Use Dimension | Query Example |
|---|---|---|
| Understand operation types | 1 (Structure) | `SELECT mechanic, COUNT(*) FROM bodyMechanics...` |
| Find duplicated code | 2 (Coverage) | `WHERE mechanic = 'serialization' GROUP BY modulePath...` |
| Verify authority compliance | 3 (Governance) | `SELECT name FROM symbols WHERE name LIKE '%authority%'` |
| Identify proposed features | 4 (Features) | `WHERE modulePath LIKE '%feature-coverage%'` |
| Validate scenarios | 5 (Scenarios) | `WHERE modulePath LIKE '%validates%Scenario%'` |
| Custom analysis | 6 (SQL) | Write specific JOIN/GROUP/aggregate queries |

