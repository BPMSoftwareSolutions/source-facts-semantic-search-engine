# Source Facts Query Cookbook
## Practical SQL Examples for Codebase Analysis

*All queries execute against your source-facts index via `npm run query`*

---

## SECTION 1: Structure & Mechanics

### 1.1 Body Mechanics Distribution

```sql
-- Find top 10 mechanics in entire codebase
SELECT mechanic, COUNT(*) as count 
FROM bodyMechanics 
GROUP BY mechanic 
ORDER BY count DESC 
LIMIT 10;
```

**Real output from your codebase:**
```
object-construction    1820
fallback              1108
branch                1030
iteration              319
state-mutation         267
validation             128
throw                  121
exception-handling     109
normalization          103
serialization           92
```

### 1.2 Mechanics by Module

```sql
-- Find which modules are most complex (by mechanic count)
SELECT 
  modulePath,
  COUNT(*) as mechanicCount,
  COUNT(DISTINCT mechanic) as mechanicTypes
FROM bodyMechanics
GROUP BY modulePath
ORDER BY mechanicCount DESC
LIMIT 20;
```

This reveals:
- Most mechanically complex modules (candidate refactoring targets)
- Modules using diverse mechanic types (higher feature richness)
- Dead code (modules with only fallback/throw)

### 1.3 Specific Mechanic Locations

```sql
-- Find all validation mechanics (constraint checking)
SELECT 
  modulePath,
  COUNT(*) as validationCount
FROM bodyMechanics
WHERE mechanic = 'validation'
GROUP BY modulePath
ORDER BY validationCount DESC;
```

Use for:
- Finding where safety/constraint checks happen
- Locating input validation code
- Auditing security boundaries

### 1.4 State Mutation Patterns

```sql
-- Find state mutations (assignments, mutations)
SELECT 
  modulePath,
  COUNT(*) as mutations
FROM bodyMechanics
WHERE mechanic = 'state-mutation'
GROUP BY modulePath
ORDER BY mutations DESC;
```

Use for:
- Finding mutable state (potential race conditions)
- Identifying imperative vs functional code
- Locating side effects

---

## SECTION 2: Coverage & Implementation Patterns

### 2.1 Find Duplicated Mechanics

```sql
-- Find mechanics that appear multiple times in same module
-- (potential for consolidation/DRY violation)
SELECT 
  modulePath,
  mechanic,
  COUNT(*) as occurrences
FROM bodyMechanics
WHERE mechanic IN ('object-construction', 'serialization', 'normalization')
GROUP BY modulePath, mechanic
HAVING COUNT(*) > 5
ORDER BY occurrences DESC;
```

### 2.2 Identify Dead Branches

```sql
-- Find fallback-only modules (no real logic)
SELECT 
  modulePath,
  COUNT(*) as mechanicCount
FROM bodyMechanics
GROUP BY modulePath
HAVING COUNT(DISTINCT mechanic) = 1 
  AND modulePath NOT LIKE '%test%'
ORDER BY mechanicCount DESC;
```

### 2.3 Find Exception Handling Patterns

```sql
-- Modules with high exception-handling density
SELECT 
  modulePath,
  COUNT(*) as handlerCount
FROM bodyMechanics
WHERE mechanic = 'exception-handling'
GROUP BY modulePath
ORDER BY handlerCount DESC;
```

Use for:
- Finding error-prone code
- Identifying where errors are swallowed
- Validating resilience patterns

### 2.4 Serialization Hotspots

```sql
-- Where is data serialized? (JSON, strings, etc)
SELECT 
  modulePath,
  COUNT(*) as serializationCount
FROM bodyMechanics
WHERE mechanic = 'serialization'
GROUP BY modulePath
ORDER BY serializationCount DESC;
```

Use for:
- Finding where data leaves the system
- Identifying security boundaries
- Locating performance hotspots (serialization is expensive)

---

## SECTION 3: Governance & Authority Alignment

### 3.1 Symbol Inventory by Kind

```sql
-- How many functions, classes, variables, parameters?
SELECT 
  kind,
  COUNT(*) as count
FROM symbols
GROUP BY kind
ORDER BY count DESC;
```

**Expected output:**
```
variable           (highest - locals and fields)
parameter          (second - function parameters)
function           (exported/imported functions)
class              (class definitions)
```

### 3.2 Find Public Entry Points

```sql
-- Functions exported/imported (governance entry points)
SELECT 
  name,
  kind
FROM symbols
WHERE kind = 'function'
  AND (name LIKE 'exports.%' OR name LIKE 'import:%')
ORDER BY name;
```

### 3.3 Authority Declaration Symbols

```sql
-- Find all authority/contract/responsibility-related symbols
SELECT 
  name,
  kind
FROM symbols
WHERE name LIKE '%authority%'
   OR name LIKE '%contract%'
   OR name LIKE '%responsibility%'
   OR name LIKE '%obligation%'
ORDER BY name;
```

### 3.4 Governance-Related Modules

```sql
-- Modules dedicated to governance
SELECT 
  modulePath,
  COUNT(*) as mechanicCount
FROM bodyMechanics
WHERE modulePath LIKE '%governance%'
GROUP BY modulePath
ORDER BY mechanicCount DESC;
```

---

## SECTION 4: Feature Coverage Candidates

### 4.1 Feature-Related Symbols

```sql
-- All symbols mentioning "feature"
SELECT 
  name,
  kind
FROM symbols
WHERE name LIKE '%feature%'
  OR name LIKE '%coverage%'
ORDER BY name;
```

### 4.2 Feature Proposal Functions

```sql
-- The feature inference pipeline
SELECT 
  name,
  kind
FROM symbols
WHERE kind = 'function'
  AND (name LIKE '%proposes%Feature%'
    OR name LIKE '%discovers%Feature%'
    OR name LIKE '%projects%Feature%')
ORDER BY name;
```

### 4.3 Mechanics in Feature Coverage

```sql
-- What operations power feature coverage?
SELECT 
  mechanic,
  COUNT(*) as count
FROM bodyMechanics
WHERE modulePath LIKE '%feature-coverage%'
   OR modulePath LIKE '%proposes-feature%'
GROUP BY mechanic
ORDER BY count DESC;
```

**Real output:**
```
object-construction    144
fallback              116
branch                 63
iteration              17
throw                  10
state-mutation          8
exception-handling      6
validation              6
normalization           2
serialization           1
```

### 4.4 Evidence Collection Points

```sql
-- Where is feature evidence gathered?
SELECT 
  modulePath,
  COUNT(*) as count
FROM bodyMechanics
WHERE modulePath LIKE '%discover%'
   OR modulePath LIKE '%extracts%'
   OR modulePath LIKE '%resolves%'
GROUP BY modulePath
ORDER BY count DESC;
```

---

## SECTION 5: Scenario Lineage & Quality

### 5.1 Scenario-Related Symbols

```sql
-- All scenario/obligation/responsibility definitions
SELECT 
  name,
  kind
FROM symbols
WHERE name LIKE '%scenario%'
   OR name LIKE '%obligation%'
   OR name LIKE '%responsibility%'
ORDER BY name;
```

### 5.2 Scenario Conformance Functions

```sql
-- Functions that evaluate scenario conformance
SELECT 
  name,
  kind
FROM symbols
WHERE kind = 'function'
  AND (name LIKE '%conforms%'
    OR name LIKE '%evaluates%'
    OR name LIKE '%projects%'
    OR name LIKE '%validates%')
ORDER BY name;
```

### 5.3 Validation Logic Distribution

```sql
-- Which modules do heavy validation?
SELECT 
  modulePath,
  COUNT(*) as validationOps
FROM bodyMechanics
WHERE mechanic = 'validation'
GROUP BY modulePath
ORDER BY validationOps DESC;
```

Use for:
- Finding constraint-checking code
- Identifying schema validation
- Locating type guards

---

## SECTION 6: Queryable Facts & Performance

### 6.1 Document Parsing Facts

```sql
-- JSON/YAML document structures found
SELECT 
  COUNT(*) as totalDocumentFacts
FROM documentFacts;
```

### 6.2 Complex Reference Navigation

```sql
-- Symbols with most relationships (high coupling)
SELECT 
  fromSymbolCandidate,
  COUNT(*) as relationshipCount
FROM relationships
WHERE fromSymbolCandidate IS NOT NULL
GROUP BY fromSymbolCandidate
ORDER BY relationshipCount DESC
LIMIT 20;
```

These are your "hub" functions - high-coupling candidates.

### 6.3 Dependency Structure

```sql
-- External dependencies (Node modules, etc)
SELECT 
  toSymbolCandidate,
  COUNT(*) as dependencyCount
FROM relationships
WHERE relationshipKind = 'dependency'
  AND toSymbolCandidate LIKE 'node:%'
GROUP BY toSymbolCandidate
ORDER BY dependencyCount DESC;
```

### 6.4 Index Health Check

```sql
-- How well-indexed is your codebase?
SELECT 
  COUNT(*) as totalMechanics,
  COUNT(DISTINCT modulePath) as modulesWithMechanics,
  COUNT(DISTINCT fromSymbolId) as resolvedSymbols
FROM bodyMechanics;
```

---

## Advanced Query Patterns

### Pattern A: Function Complexity Analysis

```sql
-- Rank functions by mechanic diversity (complexity)
SELECT 
  modulePath,
  COUNT(DISTINCT mechanic) as mechanicTypes,
  COUNT(*) as totalMechanics
FROM bodyMechanics
GROUP BY modulePath
ORDER BY mechanicTypes DESC, totalMechanics DESC;
```

**Interpretation:**
- High mechanicTypes + high totalMechanics = complex function (refactor candidate)
- High mechanicTypes + low totalMechanics = tightly focused (good)

### Pattern B: Risk Analysis (Security/Stability)

```sql
-- High-risk functions: many exceptions, few validations
SELECT 
  modulePath,
  COUNT(CASE WHEN mechanic = 'exception-handling' THEN 1 END) as handlers,
  COUNT(CASE WHEN mechanic = 'validation' THEN 1 END) as validations,
  COUNT(*) as total
FROM bodyMechanics
WHERE modulePath NOT LIKE '%test%'
GROUP BY modulePath
HAVING handlers > 3 AND validations < 2
ORDER BY handlers DESC;
```

### Pattern C: Data Flow Tracing

```sql
-- Find all data constructions in specific module
SELECT 
  modulePath,
  COUNT(CASE WHEN mechanic = 'object-construction' THEN 1 END) as constructions,
  COUNT(CASE WHEN mechanic = 'serialization' THEN 1 END) as serializations,
  COUNT(CASE WHEN mechanic = 'normalization' THEN 1 END) as normalizations
FROM bodyMechanics
WHERE modulePath LIKE '%your-module%'
GROUP BY modulePath;
```

### Pattern D: Coverage Gap Analysis

```sql
-- Mechanics without scenario lineage (untraced code)
SELECT 
  mechanic,
  COUNT(*) as count
FROM bodyMechanics
WHERE modulePath NOT LIKE '%governance%'
  AND modulePath NOT LIKE '%feature%'
  AND modulePath NOT LIKE '%scenario%'
GROUP BY mechanic
ORDER BY count DESC;
```

---

## Connecting Queries to Execution Tracing

### Tracing a Specific Feature Coverage Invocation:

```sql
-- 1. Find the feature coverage functions
SELECT name FROM symbols 
WHERE name IN ('proposesFeatureCoverage', 'projectsFeatureCoverage');

-- 2. Find what they call
SELECT toSymbolCandidate, COUNT(*) as calls 
FROM relationships 
WHERE fromSymbolCandidate LIKE '%Feature%' 
GROUP BY toSymbolCandidate;

-- 3. Find what mechanics they use
SELECT mechanic, COUNT(*) as count 
FROM bodyMechanics 
WHERE modulePath LIKE '%feature-coverage%' 
GROUP BY mechanic 
ORDER BY count DESC;

-- 4. Find validation boundaries
SELECT COUNT(*) as validationOps 
FROM bodyMechanics 
WHERE mechanic = 'validation' 
  AND modulePath LIKE '%feature-coverage%';

-- 5. Find error paths
SELECT COUNT(*) as exceptions 
FROM bodyMechanics 
WHERE mechanic = 'exception-handling' 
  AND modulePath LIKE '%feature-coverage%';
```

---

## Query Execution Tips

### Performance:
- Start with `GROUP BY` queries (fast aggregation)
- Use `LIKE %pattern%` for substring matching
- Use `WHERE` before `GROUP BY` for early filtering

### Readability:
- Add `ORDER BY` for deterministic results
- Use `LIMIT` for exploration (then remove for full results)
- Format queries as multi-line with comments

### Debugging:
- Start simple: `SELECT * FROM mechanics LIMIT 5`
- Then add WHERE clauses incrementally
- Use aggregate functions (COUNT, SUM) to validate assumptions

---

## Saving Query Results

```bash
# Run query and capture output
npm run query -- --index ./engine-self-index.json "YOUR_QUERY" --pretty > results.json

# Pretty-print for analysis
npm run query -- --index ./engine-self-index.json "YOUR_QUERY" --pretty | jq '.result.value.rows'

# Count results
npm run query -- --index ./engine-self-index.json "SELECT COUNT(*) as count FROM ..." --pretty
```

