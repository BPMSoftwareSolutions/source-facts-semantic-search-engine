---
name: generate-test-scenarios-from-source-facts
description: Use source facts to systematically generate acceptance test scenarios with evidence links, identifying critical test areas based on code metrics (validation, error handling, branching, serialization) and tracing each scenario back to specific source code locations.
---

# Generate Test Scenarios from Source Facts

This skill turns a codebase's structural facts into **evidence-based acceptance test scenarios**.
Instead of guessing what to test, you query the code's decision points, error cases, and state mutations
to generate concrete Gherkin scenarios—each one traceable to exact line numbers and mechanic counts.

## When to Use This

- You need acceptance test coverage for a **critical module**
- You want to know **where tests will have highest impact** (based on code complexity)
- You want **audit-trail evidence** linking test scenarios to source code
- You're onboarding a feature and need to quickly identify test cases without reading the whole file
- You want to document **why** each test scenario exists (not just that it does)

## Prerequisites

1. **source-facts-semantic-search-engine** project available
2. **Target file or directory** you want to test (JavaScript/TypeScript)
3. Access to source code you're analyzing

## Workflow Overview

```
1. Project workspace to fact index (2-7 seconds)
   ↓
2. Query code metrics (complexity, mechanics)
   ↓
3. Identify high-priority test areas (validation, errors, branching)
   ↓
4. Map entry points (exported functions)
   ↓
5. Trace dependencies and decision points for each function
   ↓
6. Generate Gherkin scenarios with evidence links
   ↓
7. Document with source line numbers and query proofs
```

## Step-by-Step Guide

### Step 1: Project the Target Workspace

Scope the projection narrowly—a single file takes ~2s, a small directory ~6-7s.

```bash
cd <path-to-source-facts-semantic-search-engine>
node src/cli.js project \
  --workspace <target-directory-or-file's-parent> \
  --output <absolute-path>/index.json \
  --summary
```

**Example:**
```bash
node src/cli.js project \
  --workspace "C:\lab\repos\contract-driven-artifact-governance-engine\lib" \
  --output "C:\tmp\governed-artifact-index.json" \
  --summary
```

**What to check:**
- Files: count is plausible for your scope
- Symbols: non-zero (should be 100s if it's a real file)
- Relationships: should be in 1000s for a meaningful codebase

### Step 2: Query Code Metrics (What Needs Testing)

Run this query to see mechanic distribution:

```bash
node src/cli.js query --index <index.json> --pretty \
  "SELECT mechanic, COUNT(*) as Count FROM bodyMechanics \
   WHERE modulePath LIKE '%<target-file>%' \
   GROUP BY mechanic ORDER BY Count DESC"
```

**Example:**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT mechanic, COUNT(*) as Count FROM bodyMechanics \
   WHERE modulePath LIKE '%governed-artifact-engine.mjs%' \
   GROUP BY mechanic ORDER BY Count DESC"
```

**Interpret the results:**
| Mechanic | Test Focus |
|----------|-----------|
| **validation** (21) | Input contract tests, schema violations |
| **throw** (47) | Error cases, exception paths |
| **exception-handling** (18) | Resilience, recovery behavior |
| **branch** (533) | Decision path coverage, conditionals |
| **fallback** (351) | Null handling, defaults |
| **object-construction** (643) | Data shape, payload correctness |
| **serialization** (36) | Deterministic output, hash consistency |
| **iteration** (181) | Collection edge cases (empty, large) |
| **state-mutation** (180) | Idempotency, side effects |

**Priority rule:** Validation + Throws + Serialization = CRITICAL. Test these first.

### Step 3: Identify Entry Points (Functions to Test)

```bash
node src/cli.js query --index <index.json> --pretty \
  "SELECT name, symbolId FROM symbols \
   WHERE modulePath LIKE '%<target-file>%' \
   AND kind = 'function' \
   ORDER BY name"
```

**Example:**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT name, symbolId FROM symbols \
   WHERE modulePath LIKE '%governed-artifact-engine.mjs%' \
   AND kind = 'function' \
   ORDER BY name"
```

This lists all functions. Pick the **exported/public** ones first—those are your acceptance test subjects.

### Step 4: Trace What Each Function Calls (Dependencies)

For each function you want to test, find its invocations:

```bash
node src/cli.js query --index <index.json> --pretty \
  "SELECT relationshipKind, toSymbolCandidate \
   FROM relationships \
   WHERE fromSymbolId = '<exact-symbolId-from-step-3>' \
   AND relationshipKind = 'invocation'"
```

**Example:**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT relationshipKind, toSymbolCandidate \
   FROM relationships \
   WHERE fromSymbolId = 'governed-artifact-engine.mjs#function:validateConformanceProfile' \
   AND relationshipKind = 'invocation'"
```

**Use this to:**
- Identify what the function depends on (so you know what to mock in tests)
- Understand the call chain (for integration test scope)

### Step 5: Find Decision Points & Error Cases Within Each Function

```bash
node src/cli.js query --index <index.json> --pretty \
  "SELECT mechanic, sr.startLine, sr.startColumn \
   FROM bodyMechanics bm \
   JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId \
   WHERE bm.modulePath LIKE '%<target-file>%' \
   AND bm.mechanic IN ('branch', 'throw', 'validation', 'exception-handling') \
   ORDER BY sr.startLine"
```

**Example:**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT mechanic, sr.startLine, sr.startColumn \
   FROM bodyMechanics bm \
   JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId \
   WHERE bm.modulePath LIKE '%governed-artifact-engine.mjs%' \
   AND bm.mechanic IN ('branch', 'throw', 'validation', 'exception-handling') \
   ORDER BY sr.startLine"
```

**Result shows:**
- Exact line numbers for every decision point and error case
- Mechanic type (branch, throw, etc.)
- This is where your test cases come from

### Step 6: Read Source Code at Key Lines

Now that you know *where* the decisions are, read those specific lines:

```bash
# Use Read tool or your IDE to navigate to line numbers from Step 5
# Example: Line 173 has a throw, line 177 has a validation
```

**Read just the relevant sections**, not the whole file. You now know exactly what to focus on.

### Step 7: Generate Gherkin Scenarios with Evidence

For each decision point found in Step 5, create a Gherkin scenario:

**Template:**
```gherkin
Feature: <Behavior> [Mechanic type: count]

  Scenario: <Happy path description>
    Given <input condition>
      [Evidence: <mechanic type> at line X-Y]
    When <action occurs>
      [Evidence: <function name> called, query shows count=N]
    Then <expected output>
```

**Example (from actual analysis):**
```gherkin
Feature: Validate governed artifact contracts [Validation: 21 mechanics]

  Scenario: Accept valid contract structure
    Given a contract matching schema at DEFAULT_SCHEMA_PATH
      [Evidence: governed-artifact-engine.mjs line 43-47]
    When AJV schema validation executes
      [Evidence: Ajv2020 imported at line 14, validation count = 21]
    Then validation succeeds
    And no SemanticExecutionDispositionError is raised
      [Evidence: throw mechanics = 47]
```

**Evidence checklist for each scenario:**
- ✅ Line number from source code (Step 6)
- ✅ Mechanic type and count from Step 2
- ✅ Function/import name from Step 5
- ✅ Symbol ID or exact code location

### Step 8: Document in Markdown with Full Traceability

Create a test analysis document following this structure:

```markdown
# Test Scenario Analysis: [target-file]

## File Metrics
[Include results from Step 2: mechanic counts]

## Critical Areas (Priority)
[List validation, throws, serialization first]

## Entry Points
[List functions from Step 3]

## Gherkin Scenarios

### Feature: [Behavior Name] [Mechanic: count]

#### Scenario: [Case Name]
- Given ... [Evidence: line X-Y]
- When ... [Evidence: query result showing count]
- Then ... [Expected outcome]

## Actionable Queries

[Include exact queries from Steps 2-5 so work is reproducible]

## Evidence Summary

| Analysis | Evidence Source | Result |
|----------|---|---|
| Total Symbols | Query: symbols.count | 1844 |
| Validation Points | Query: mechanics='validation' | 21 |
| Error Cases | Query: mechanics='throw' | 47 |
```

## Example: Complete Walkthrough

### Target: `governed-artifact-engine.mjs`

**Step 1: Project**
```bash
node src/cli.js project \
  --workspace "C:\lab\repos\contract-driven-artifact-governance-engine\lib" \
  --output index.json --summary
```
Result: 5 files, 3,009 symbols, 13,805 relationships ✓

**Step 2: Metrics Query**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT mechanic, COUNT(*) as Count FROM bodyMechanics \
   WHERE modulePath LIKE '%governed-artifact-engine.mjs%' \
   GROUP BY mechanic ORDER BY Count DESC"
```
Result: validation=21, throw=47, branch=533, serialization=36, ... ✓

**Step 3: Entry Points**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT name FROM symbols \
   WHERE modulePath LIKE '%governed-artifact-engine.mjs%' \
   AND kind = 'function' LIMIT 25"
```
Result: admittedSourceScanner, applyConformanceProfile, validateConformanceProfile, ... ✓

**Step 4: Dependencies for `validateConformanceProfile`**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT toSymbolCandidate FROM relationships \
   WHERE fromSymbolId = 'governed-artifact-engine.mjs#function:validateConformanceProfile' \
   AND relationshipKind = 'invocation'"
```
Result: Ajv instance, schema validation, error reporting ✓

**Step 5: Decision Points in File**
```bash
node src/cli.js query --index index.json --pretty \
  "SELECT mechanic, sr.startLine FROM bodyMechanics bm \
   JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId \
   WHERE bm.modulePath LIKE '%governed-artifact-engine.mjs%' \
   AND bm.mechanic IN ('throw', 'validation') \
   ORDER BY sr.startLine"
```
Result: branch at line 215, throw at line 220, validation at line 225, ... ✓

**Step 6: Read Source at Key Lines**
- Read line 215-220 for branch/throw context
- See what condition causes throw
- Identify input that would trigger it ✓

**Step 7: Write Scenario**
```gherkin
Scenario: Reject contract with missing required fields
  Given a contract missing required fields
    [Evidence: Ajv validation at line 215-220]
  When validation is attempted
    [Evidence: query shows 21 validation mechanics]
  Then validation fails
  And error identifies missing fields
    [Evidence: throw mechanics = 47]
```

**Step 8: Document**
Create `governed-artifact-engine-test-generation-analysis.md` with:
- All metrics from Step 2
- All scenarios from Step 7
- All queries from Steps 2-5 (for reproducibility)
- Evidence links to line numbers

## Customization

### For Different File Types
- **JavaScript/TypeScript:** Works as-is (this skill's default)
- **Python/other languages:** Adjust the filter: `modulePath LIKE '%filename.py%'`

### For Different Priorities
- Want to focus on **performance**: Look for `iteration`, `state-mutation`, `serialization` metrics
- Want to focus on **correctness**: Look for `validation`, `throw`, `branch` metrics
- Want to focus on **resilience**: Look for `exception-handling`, `fallback` metrics

### For Different Documentation Styles
- **Minimal:** Generate only critical scenarios (validation + throw + serialization)
- **Comprehensive:** Include all mechanics (branch, iteration, state-mutation, etc.)
- **Audit:** Add full query evidence and line-by-line source citations

## Common Queries Reference

**Count total symbols by kind:**
```sql
SELECT kind, COUNT(*) FROM symbols 
WHERE modulePath LIKE '%<file>%' 
GROUP BY kind
```

**Find high-complexity functions:**
```sql
SELECT COUNT(DISTINCT mechanic) as MechanicTypes, COUNT(*) as Total
FROM bodyMechanics 
WHERE modulePath LIKE '%<file>%' 
GROUP BY sourceSymbolId 
ORDER BY Total DESC LIMIT 10
```

**Find all error paths:**
```sql
SELECT sr.startLine, bm.mechanic 
FROM bodyMechanics bm
JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId
WHERE modulePath LIKE '%<file>%' AND mechanic = 'throw'
ORDER BY sr.startLine
```

**Find all validation points:**
```sql
SELECT sr.startLine 
FROM bodyMechanics bm
JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId
WHERE modulePath LIKE '%<file>%' AND mechanic = 'validation'
ORDER BY sr.startLine
```

## Troubleshooting

### Query Returns 0 Rows
- **Check file path spelling:** Use `LIKE '%filename%'` not exact path
- **Verify index was generated:** Check `--summary` output, should show non-zero Files/Symbols
- **Confirm mechanic name:** Valid values: `branch`, `throw`, `validation`, `exception-handling`, `fallback`, `iteration`, `serialization`, `object-construction`, `state-mutation`, `normalization`

### Query Returns Too Many Rows
- **Narrow scope:** Project single file instead of whole directory
- **Use limit:** Add `LIMIT 50` to see first 50 results
- **Filter by mechanic:** `WHERE mechanic = 'throw'` instead of all mechanics

### Can't Find Expected Function
- **Run Step 3 query:** List all symbols to verify function exists
- **Check function is exported:** Private functions still appear, but check if you need public ones
- **Verify spelling:** Exact match required (case-sensitive)

## Inputs & Outputs

### Inputs
- **Workspace path:** Directory containing target file
- **Target file name:** Exact filename (e.g., `governed-artifact-engine.mjs`)
- **Query scope:** Which mechanics to focus on (validation, error, performance, etc.)

### Outputs
- **Index file:** JSON with all symbols, relationships, mechanics
- **Metrics summary:** Mechanic counts and complexity distribution
- **Gherkin scenarios:** Acceptance test cases with evidence links
- **Analysis document:** Markdown with full traceability and queries
- **Query proofs:** Exact SQL queries that support each claim

## Notes on Evidence & Traceability

Every claim in your output should have a line of evidence:
- **Line numbers:** `[Evidence: line 173-175]`
- **Query results:** `[Evidence: query shows validation count = 21]`
- **Imports/definitions:** `[Evidence: SemanticExecutionDispositionError imported at line 19]`

This makes your test scenarios **auditable**—anyone can run the same queries and verify the claims.

## Time Investment

- **Projection:** 2-7 seconds
- **Queries:** 1-2 seconds per query
- **Analysis:** 5-10 minutes to interpret results and write scenarios
- **Documentation:** 10-15 minutes to write markdown with evidence links

**Total for a single file: 20-35 minutes → High-quality, evidence-based test scenarios**

## References

- Source facts schema: `source-fact-index.schema.v1.json`
- Mechanic kinds: `fact.ExecutableMechanic.MechanicKind`
- Query language: Relational query syntax (SQL-like)
- Related skill: `query-source-facts-before-reading-code` (for fine-grained lookups)
