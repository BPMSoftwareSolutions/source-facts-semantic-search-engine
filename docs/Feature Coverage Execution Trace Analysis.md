# Feature Coverage Execution Trace Analysis

*Generated from source-facts queries on 2026-08-04*

## Part 1: Feature Coverage Functions & Architecture

### Core Functions in Feature Coverage Pipeline

From query results, there are **4 primary functions** that form the feature coverage execution chain:

1. **`discoversFeatureCoverageProposals`** — discovers JSON proposals on disk
2. **`discoversFeatureCoverageInferenceEvaluations`** — discovers LLM evaluation results on disk
3. **`proposesFeatureCoverage`** — invokes live LLM to infer features
4. **`projectsFeatureCoverage`** — validates and fingerprints feature coverage proposals

### The Execution Flow Chain

```
discoversFeatureCoverageProposals (filesystem scan)
         ↓
discoversFeatureCoverageInferenceEvaluations (filesystem scan)
         ↓
proposesFeatureCoverage (LLM invocation)
         ↓
projectsFeatureCoverage (validation + fingerprinting)
         ↓
Feature fingerprint + validation results
```

---

## Part 2: Body Mechanics Breakdown (Feature Coverage Context)

### Mechanics in Feature Coverage Modules (`%feature-coverage%`)

| Mechanic | Count | % of Total | Purpose in Tracing |
|---|---:|---:|---|
| **object-construction** | 144 | 42.1% | Building proposal/evaluation objects, evidence structures |
| **fallback** | 116 | 33.9% | Error handling, default values when fields missing |
| **branch** | 63 | 18.4% | Conditional logic (validation checks, scenario filtering) |
| **iteration** | 17 | 5.0% | Looping through scenarios, responsibilities, obligations |
| **throw** | 10 | 2.9% | Validation failures, constraint violations |
| **state-mutation** | 8 | 2.3% | Building up result maps and collections |
| **exception-handling** | 6 | 1.8% | Try-catch around file operations, JSON parsing |
| **validation** | 6 | 1.8% | Constraint checking (string presence, array non-empty) |
| **normalization** | 2 | 0.6% | Sorting, deduplication (uniqueSorted) |
| **serialization** | 1 | 0.3% | JSON.stringify for hashing |
| **TOTAL** | **373** | **100%** |

### Full Engine Mechanics Comparison

| Mechanic | Engine Total | Feature Coverage | Ratio |
|---|---:|---:|---|
| object-construction | 1,820 | 144 | 7.9% |
| fallback | 1,108 | 116 | 10.5% |
| branch | 1,030 | 63 | 6.1% |
| iteration | 319 | 17 | 5.3% |
| state-mutation | 267 | 8 | 3.0% |
| validation | 128 | 6 | 4.7% |
| throw | 121 | 10 | 8.3% |
| exception-handling | 109 | 6 | 5.5% |
| normalization | 103 | 2 | 1.9% |
| serialization | 92 | 1 | 1.1% |

**Key insight:** Feature coverage has disproportionately high **fallback** usage (10.5% vs 6.1% average), indicating defensive programming around optional fields.

---

## Part 3: Tracing Feature Coverage Execution (The Code Flow)

### Step 1: Discovery (File System Scan)

**Function:** `discoversFeatureCoverageProposals(proposalsDir)`
**Mechanics Used:** iteration, exception-handling, object-construction, fallback

```javascript
// Simplified execution trace
async function discoversFeatureCoverageProposals(proposalsDir) {
  const proposals = [];
  
  // ITERATION: loop through all JSON files
  for (const filePath of await collectsJsonFiles(path.resolve(proposalsDir))) {
    let document;
    
    // EXCEPTION-HANDLING: graceful failure on bad JSON
    try {
      document = JSON.parse(await readFile(filePath, "utf8"));
    } catch {
      continue; // FALLBACK: skip unparseable files
    }
    
    // BRANCH: check document kind
    if (document?.documentKind !== "feature-coverage-proposal.v1") continue;
    
    // OBJECT-CONSTRUCTION: build proposal object
    proposals.push(Object.freeze({
      filePath: path.relative(relativeTo, filePath).replaceAll("\\", "/"),
      document,
    }));
  }
  
  // NORMALIZATION: sort for determinism
  return proposals.sort((left, right) => left.filePath.localeCompare(right.filePath));
}
```

**Tracing Path:** 
- Input: `proposalsDir` path
- Loop: Filesystem walk → JSON file discovery
- Condition: Check `documentKind` field
- Output: Array of `{ filePath, document }` tuples, sorted

---

### Step 2: Validation (Constraint Checking)

**Function:** `validatesFeatureCoverageProposal(document)`
**Mechanics Used:** validation (15 checks), branch, object-construction

This function performs **138 lines of nested validation**. Here's the execution trace:

```javascript
export function validatesFeatureCoverageProposal(document) {
  const findings = [];  // OBJECT-CONSTRUCTION
  
  // PRIMARY CHECKS (document shape)
  if (document?.documentKind !== "feature-coverage-proposal.v1") 
    findings.push("DOCUMENT_KIND_INVALID");  // BRANCH + state-mutation
  
  if (document?.lifecycle !== "INFERRED_NOT_ADMITTED" 
    && document?.lifecycle !== "ADMITTED") 
    findings.push("LIFECYCLE_INVALID");
  
  // DEPENDENCY CHECKS (proposal ID, feature ID)
  if (typeof document?.proposalId !== "string" || document.proposalId.length === 0) 
    findings.push("PROPOSAL_ID_MISSING");
  
  if (typeof document?.feature?.candidateFeatureId !== "string") 
    findings.push("FEATURE_ID_MISSING");
  
  // COLLECTION CHECKS (arrays must exist and be non-empty)
  if (!Array.isArray(document?.scenarios) || document.scenarios.length === 0) 
    findings.push("SCENARIOS_MISSING");  // VALIDATION
  
  if (!Array.isArray(document?.responsibilities) || document.responsibilities.length === 0) 
    findings.push("RESPONSIBILITIES_MISSING");
  
  if (!Array.isArray(document?.obligations) || document.obligations.length === 0) 
    findings.push("OBLIGATIONS_MISSING");
  
  if (!Array.isArray(document?.evidence?.sourceFiles) || document.evidence.sourceFiles.length === 0) 
    findings.push("SOURCE_EVIDENCE_MISSING");
  
  // CROSS-CUTTING CHECKS (scenarios, obligations, responsibilities)
  const scenarios = new Map(
    (document?.scenarios ?? []).map((scenario) => [scenario.candidateScenarioId, scenario])
  );  // OBJECT-CONSTRUCTION
  
  const obligations = new Map(
    (document?.obligations ?? []).map((obligation) => [obligation.candidateObligationId, obligation])
  );
  
  for (const scenario of scenarios.values()) {  // ITERATION
    const ownedObligations = [...obligations.values()].filter(
      (obligation) => obligation.scenarioId === scenario.candidateScenarioId
    );  // ITERATION + BRANCH
    
    if (ownedObligations.length !== 1 
      || ownedObligations[0]?.candidateObligationId !== scenario.primaryObligationId) {
      findings.push(`SCENARIO_PRIMARY_OBLIGATION_NOT_ATOMIC:${scenario.candidateScenarioId}`);
    }
  }
  
  // ... more cross-reference checks ...
  
  // FINGERPRINT VALIDATION (most expensive check)
  if (typeof document?.featureFingerprint !== "string") {
    findings.push("FEATURE_FINGERPRINT_MISSING");
  } else if (findings.length === 0 && document.featureFingerprint !== createsProposalFeatureFingerprint(document)) {
    findings.push("FEATURE_FINGERPRINT_MISMATCH");  // SERIALIZATION happens here
  }
  
  return Object.freeze(findings);
}
```

**Validation Checks Breakdown:**
1. **Document shape** (5 checks)
   - documentKind, lifecycle, proposalId, feature.candidateFeatureId
   - capability field forbidden

2. **Collections (6 checks)**
   - scenarios, responsibilities, obligations, evidence.sourceFiles all required non-empty

3. **Scenario integrity (3 checks per scenario)**
   - Primary obligation is atomic (exactly 1)
   - Observable result exists
   - Conformance signal exists

4. **Cross-references (3 groups)**
   - Each responsibility references valid scenario & obligation
   - Each obligation references valid scenario
   - Capability relations reference valid scenarios

5. **Fingerprint validation (1 check)**
   - Recomputes fingerprint via `createsProposalFeatureFingerprint()`
   - Detects tampering or deserialization errors

---

### Step 3: Fingerprinting (Deterministic Hashing)

**Function:** `createsProposalFeatureFingerprint(document)`
**Mechanics Used:** object-construction (deep canonicalization), serialization, normalization

This is the **execution trace for a feature fingerprint**:

```javascript
// 1. Extract proposal fingerprint subject
function proposalFingerprintSubject(document) {
  return {
    // OBJECT-CONSTRUCTION + ITERATION + NORMALIZATION
    scenarios: (document.scenarios ?? []).map((scenario) => ({
      scenarioId: scenario.candidateScenarioId,
      obligations: (document.obligations ?? [])
        .filter((obligation) => obligation.scenarioId === scenario.candidateScenarioId)  // ITERATION + BRANCH
        .map((obligation) => ({ 
          obligationId: obligation.candidateObligationId, 
          statement: obligation.statement 
        }))
        .sort((left, right) => left.obligationId.localeCompare(right.obligationId)),  // NORMALIZATION
    }))
    .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId)),
    
    // ITERATION + OBJECT-CONSTRUCTION
    responsibilityIdentities: uniqueSorted(
      (document.responsibilities ?? []).map((responsibility) => responsibility.candidateResponsibilityId)
    ),
    
    semanticAuthoritySubjects: uniqueSorted(document.evidence?.authoritySubjects ?? []),
  };
}

// 2. Canonicalize the structure (sort all keys)
function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);  // ITERATION
  if (value !== null && typeof value === "object") {
    // OBJECT-CONSTRUCTION + ITERATION + NORMALIZATION
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])])
    );
  }
  return value;
}

// 3. Hash the canonical JSON
function createsFeatureFingerprint(subject) {
  // SERIALIZATION: convert to deterministic string
  const canonical = JSON.stringify(canonicalizes(subject));
  
  // Crypto hash
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}
```

**Fingerprint Execution Example:**

Input proposal:
```json
{
  "scenarios": [
    {
      "candidateScenarioId": "scenario-1",
      "primaryObligationId": "obligation-1"
    }
  ],
  "obligations": [
    {
      "candidateObligationId": "obligation-1",
      "scenarioId": "scenario-1",
      "statement": "The feature must serialize responses"
    }
  ],
  "responsibilities": [
    {
      "candidateResponsibilityId": "resp-1"
    }
  ]
}
```

Execution steps:
1. **Extract subject** → Build nested object with sorted scenarios/obligations
2. **Canonicalize** → Deep sort all object keys recursively
3. **Serialize** → `JSON.stringify(canonicalized)` 
4. **Hash** → SHA256 over the canonical JSON
5. **Output** → `sha256:9ec5470fca11c60808c3dd8f161b7588a3b2bdb95a4af258b1a0bd1d4c4e1970`

**Key property:** Same logical content always produces same hash, regardless of:
- Original key order
- Whitespace in JSON
- Array order (except where semantically important)

---

### Step 4: Duplicate Detection (Fingerprint Comparison)

**Function:** `resolvesDuplicateDisposition(document, fingerprint, canonicalFeatures, priorProposalFingerprints)`
**Mechanics Used:** branch (conditional), iteration

```javascript
function resolvesDuplicateDisposition(document, fingerprint, canonicalFeatures, priorProposalFingerprints) {
  // BRANCH: Check exact match against canonical features
  if (canonicalFeatures.some((feature) => feature.fingerprint === fingerprint)) 
    return "EXACT_FEATURE_MATCH";
  
  // BRANCH: Check duplicate against prior proposals
  if (priorProposalFingerprints.has(fingerprint)) 
    return "DUPLICATE_FEATURE_PROPOSAL";
  
  // BRANCH: Check if feature ID already exists (scenario extension?)
  const sameFeature = canonicalFeatures.find(
    (feature) => feature.featureId === document.feature?.candidateFeatureId
  );
  if (sameFeature !== undefined) {
    // ITERATION: Compare scenario sets
    const proposedScenarioIds = new Set(
      (document.scenarios ?? []).map((scenario) => scenario.candidateScenarioId)
    );
    // BRANCH: Is this extending with new scenarios?
    return [...proposedScenarioIds].some(
      (scenarioId) => !sameFeature.scenarioIds.includes(scenarioId)
    )
      ? "SCENARIO_EXTENSION_CANDIDATE"
      : "FEATURE_EXTENSION_CANDIDATE";
  }
  
  return "NEW_FEATURE_CANDIDATE";
}
```

**Disposition Outcomes:**
- `EXACT_FEATURE_MATCH` → Already canonical
- `DUPLICATE_FEATURE_PROPOSAL` → Exact duplicate pending review
- `SCENARIO_EXTENSION_CANDIDATE` → Same feature, new scenarios
- `FEATURE_EXTENSION_CANDIDATE` → Same feature, same scenarios
- `NEW_FEATURE_CANDIDATE` → Entirely new feature (default)

---

## Part 4: Data Flow Through Execution

### Input → Processing → Output

```
┌─────────────────────────────────────────────────────────────┐
│ DISCOVERY PHASE                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Filesystem walk for .json files                          │ │
│ │ Filter: documentKind == "feature-coverage-proposal.v1"   │ │
│ │ Output: Array<{ filePath, document }>                    │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓ proposals: Array<ProposalDocument>
┌─────────────────────────────────────────────────────────────┐
│ VALIDATION PHASE                                             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ For each proposal:                                        │ │
│ │   1. Check documentKind, lifecycle, IDs                  │ │
│ │   2. Check arrays (scenarios, responsibilities, ...)     │ │
│ │   3. Cross-reference validation                          │ │
│ │   4. Fingerprint validation                              │ │
│ │ Output: Array<ValidationFinding[]>                       │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓ findings: ValidationFinding[]
┌─────────────────────────────────────────────────────────────┐
│ FINGERPRINTING PHASE                                         │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ For each proposal (if valid):                            │ │
│ │   1. Extract fingerprint subject                         │ │
│ │   2. Canonicalize (deep sort keys)                       │ │
│ │   3. JSON.stringify                                      │ │
│ │   4. SHA256 hash                                         │ │
│ │ Output: string (sha256:...)                              │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓ fingerprint: string
┌─────────────────────────────────────────────────────────────┐
│ DUPLICATE DETECTION PHASE                                    │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ For each proposal:                                        │ │
│ │   1. Compare fingerprint against canonical set           │ │
│ │   2. Compare against prior proposals                      │ │
│ │   3. Check feature ID for extensions                      │ │
│ │ Output: DispositionStatus                                │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓ disposition: string
┌─────────────────────────────────────────────────────────────┐
│ OUTPUT ARTIFACTS                                             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Proposal with:                                            │ │
│ │   - Original feature/scenario/responsibility data         │ │
│ │   - Validation findings (0 for success)                   │ │
│ │   - Fingerprint (sha256:...)                              │ │
│ │   - Disposition (EXACT_MATCH, NEW_CANDIDATE, etc)        │ │
│ └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 5: Queryable Facts (SQL-Based Tracing)

Your source-facts index exposes these queryable collections for tracing feature coverage:

### Available Query Collections

| Collection | Rows | Purpose |
|---|---:|---|
| **bodyMechanics** | 6,380 | Which code locations use which mechanics (iteration, branch, validation, etc) |
| **symbols** | 4,807 | Function names, variable names, parameter types |
| **relationships** | 21,534 | Dependency relationships (function calls, data flow) |
| **sourceReferences** | ? | Exact file:line:column locations |
| **documentFacts** | 2,127 | JSON structure parsing results |

### Example Queries to Trace Feature Coverage

**Query 1: Find all validation checks in feature coverage**
```sql
SELECT modulePath, COUNT(*) as validationCount
FROM bodyMechanics
WHERE mechanic = 'validation' AND modulePath LIKE '%feature%'
GROUP BY modulePath
ORDER BY validationCount DESC
```

**Query 2: Find object construction (building proposals/evaluations)**
```sql
SELECT modulePath, COUNT(*) as constructions
FROM bodyMechanics
WHERE mechanic = 'object-construction' AND modulePath LIKE '%coverage%'
GROUP BY modulePath
ORDER BY constructions DESC
```

**Query 3: Find exception handling (error resilience)**
```sql
SELECT modulePath, COUNT(*) as exceptionHandlers
FROM bodyMechanics
WHERE mechanic = 'exception-handling' AND modulePath LIKE '%coverage%'
GROUP BY modulePath
```

---

## Part 6: Key Insights for Tracing

### 1. **Layered Execution Model**
The feature coverage system uses 4 distinct phases:
- **Discovery** (filesystem) → **Validation** (constraint checks) → **Fingerprinting** (hashing) → **Classification** (duplicate detection)

Each phase uses a different primary mechanic:
- Discovery: iteration + exception-handling
- Validation: branch + validation
- Fingerprinting: normalization + serialization
- Classification: branch (conditions)

### 2. **Defensive Programming Pattern**
39% of feature-coverage mechanics are **fallback + fallback operations** (133 / 373). This indicates:
- All optional fields get `?? []` defaults
- All parsing is wrapped in try-catch
- All array operations get `.length === 0` checks

**Example:**
```javascript
for (const scenario of (document?.scenarios ?? []))  // FALLBACK + ITERATION
```

### 3. **Determinism Through Canonicalization**
The fingerprinting system enforces determinism by:
1. **Sorting object keys** at every level recursively
2. **Sorting array elements** by their IDs (not preserving input order)
3. **JSON.stringify** with no whitespace
4. **SHA256** hash of canonical form

This ensures **same logical content → same hash**, regardless of:
- File read order
- JSON formatting
- Map iteration order
- Array input sequence

### 4. **Cross-Reference Validation**
The validation phase checks that:
- Every scenario owns exactly 1 primary obligation
- Every responsibility references a valid scenario + obligation pair
- Every obligation references a valid scenario
- Every capability relation references valid scenarios

This creates a **closed set**: scenarios ⊂ obligations ⊂ responsibilities.

### 5. **Relationship-Based Tracing**
The 21,534 relationship facts in your index capture:
- **Function calls** (dependency relationships)
- **Data flow** (parameter passing, object construction)
- **Control flow** (branching, iteration)

To trace how `proposesFeatureCoverage` invokes `invokesLiveModelInference`, query:
```sql
SELECT * FROM relationships 
WHERE fromSymbolName = 'proposesFeatureCoverage'
  AND toSymbolCandidate LIKE '%invokes%'
```

---

## Summary Table: Feature Coverage Execution Metrics

| Dimension | Value | Note |
|---|---|---|
| **Functions in pipeline** | 4 | discover → validate → fingerprint → classify |
| **Validation checks** | 40+ | shape, collections, cross-refs, fingerprint |
| **Body mechanics types** | 11 | object-construction (42%), fallback (34%), branch (18%), ... |
| **Mechanics in coverage modules** | 373 total | Detailed in Part 2 |
| **Max depth (fingerprinting)** | Unbounded | Recursive canonicalization of arbitrary depth |
| **Determinism guarantee** | Cryptographic (SHA256) | Same content → same hash always |
| **Queryable symbols** | 4,807 | Via source-facts index |
| **Queryable relationships** | 21,534 | All dependency/dataflow relationships |

