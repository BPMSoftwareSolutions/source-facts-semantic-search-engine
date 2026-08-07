# Detecting Stable Patterns for Deterministic Transformation

This document explains how the 8 core capabilities work together to identify when a code pattern is "stable" enough to graduate from manual handling to deterministic transformation.

## What is a Stable Pattern?

A **stable pattern** is an execution mechanic that:

1. **Appears repeatedly** — Observed in multiple files/locations (≥3 occurrences)
2. **Has consistent meaning** — Same semantic intent across occurrences (high consistency score)
3. **Is generalizable** — Works across different contexts (≥2 files)
4. **Has clear data flow** — Dependencies are externalizeable to authority
5. **Can be safely automated** — Transformation safety ≥70-75%

Example stable patterns:
- `branch` condition on config flag (appears 6+ times, 92% safe to automate)
- `object construction` with literal properties (appears 4+ times, 95% safe)
- `fallback` to default value (appears 3+ times, 75% safe, needs review)

---

## The Pattern Graduation Pipeline

```
First occurrence
    ↓ (observation)
Manual handling / AI analysis
    ↓ (happens again)
Recognition: "We've solved this before"
    ↓ (happens multiple times)
Pattern detection
    ↓ (proven safe)
Semantic analysis & test proof
    ↓
Stability verification
    ↓
Capability registration
    ↓
Deterministic application
    ↓ (to all occurrences)
Code collapsed
```

---

## How the 8 Capabilities Detect Stability

### 1. **Mechanic Classifier** — Observation Count
```javascript
// Input: Observed code occurrences
classifiesMechanicOccurrence(occurrence, declaredMechanics)

// Output: Classification with consistency markers
// Repeated classifications = high confidence in pattern shape
```

Detects: Pattern repeats consistently across the codebase

**Stability contribution:** Frequency score (how often observed)

---

### 2. **Authority Family Resolver** — Semantic Grouping
```javascript
// Input: Mechanic type ("branch", "construction", etc.)
resolvesAuthorityFamily("branch")

// Output: Authority family ("decision-authority")
// All "branch" patterns belong to same semantic family
```

Detects: Patterns with consistent semantic intent

**Stability contribution:** Consistency score (same family = stable meaning)

---

### 3. **Data-Driven Wiring Detector** — Externalizability
```javascript
// Input: Observed mechanic occurrence + dataflow context
resolvesDataDrivenWiring(occurrence, dataflowIndex)

// Output: Data dependencies, externalizability assessment
// Can we move this to declarative authority?
```

Detects: Whether pattern depends on external, declarable data

**Stability contribution:** Data wiring score (clarity of dependencies)

---

### 4. **Automation Readiness Classifier** — Safety Score
```javascript
// Input: Mechanic type + context
classifiesAutomationReadiness(occurrence, context)

// Output: Safety score (0-100%) for deterministic transformation
// 92% = safe to automate branch patterns
// 75% = fallback needs careful semantic analysis
```

Detects: How safely this pattern can be transformed

**Stability contribution:** Automation readiness (primary safety metric)

---

### 5. **Authority Extractor** — Declaration Validation
```javascript
// Input: Authority declaration document
extractsDeclaredAuthorityMechanics(document, filePath)

// Output: Declared mechanics with coverage status
// AUTHORITY_BOUND = pattern already has authority
// Missing = candidate for new capability
```

Detects: Whether pattern already has proven authority

**Stability contribution:** Whether pattern is "pre-approved" by authority

---

### 6. **Authority Succession Resolver** — Version History
```javascript
// Input: Current authority + repository state
resolvesAuthoritySuccession(report, occurrence)

// Output: Successor authority, migration path
// Shows if this pattern is stable vs. transitioning versions
```

Detects: Pattern stability across version changes

**Stability contribution:** Version alignment (consistent pattern across upgrades)

---

### 7. **Know-How Registry Manager** — Reuse History
```javascript
// Input: Report with all observations
discoversKnowHowRegistry(report)

// Output: Catalog of proven patterns, maturity levels
// ADMITTED = pattern proven across multiple repos
// PROPOSED = candidate pattern
```

Detects: Cross-repository pattern reuse (strongest signal)

**Stability contribution:** Proven generalizability

---

### 8. **Semantic Overlap Detector** — Uniqueness Verification
```javascript
// Input: Candidate pattern + existing authority
discoversSemanticOverlapProposalBatches(report, candidates)

// Output: Overlap scores, deduplication suggestions
// High overlap = consolidate with existing
// Low overlap = new pattern
```

Detects: Whether pattern is truly novel vs. known

**Stability contribution:** Uniqueness score (avoids false patterns)

---

## Stability Scoring Algorithm

Each pattern is scored across 5 dimensions:

```javascript
stabilityScore = (
  frequencyScore      × 0.20 +    // How often observed (0-100)
  varietyScore        × 0.20 +    // Across how many files (0-100)
  consistencyScore    × 0.20 +    // How similar are observations (0-100)
  dataWiringScore     × 0.20 +    // How clear are dependencies (0-100)
  automationReadiness × 0.20      // How safe to automate (0-100)
)
```

### Readiness Levels

| Score | Level | Action |
|-------|-------|--------|
| 90-100 | **READY** | Register as deterministic capability immediately |
| 75-89 | **CANDIDATE** | Semantic analysis + test proof required |
| 60-74 | **REQUIRES_ANALYSIS** | Needs manual review before consideration |
| <60 | **NOT_READY** | Insufficient evidence or safety concerns |

---

## Running the Pattern Detector

### Using Live Data from Your Repository

```bash
# Step 1: Scan your project
npm run project

# Step 2: Export mechanic observations
npm run export-observations
# → Creates: observations-2024-09-15T14-32-45-123Z.json

# Step 3: Analyze observations
npm run detect-stable-patterns observations-2024-09-15T14-32-45-123Z.json
```

**Output shows:**
1. **Which patterns are emerging** (frequency, variety, consistency)
2. **Which are ready for transformation** (automation scores)
3. **Concrete next steps** for each pattern

### Validating Your Numbers

After each step, validate the data:

```bash
# After project scan
npm run export-observations
# Check: observations-*.json was created with correct count

# After export
wc -l observations-*.json
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; console.log('Total observations:', obs.length); const byMech = {}; obs.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); Object.entries(byMech).forEach(([m,c]) => console.log('-', m, c))"

# After pattern analysis
npm run detect-stable-patterns observations-*.json > pattern-analysis.txt
grep "Stability:" pattern-analysis.txt
grep "Observations:" pattern-analysis.txt
```

### Tracking Metrics Over Time

```bash
# Store each run with timestamp
mkdir -p metrics
npm run project
npm run export-observations
cp observations-*.json metrics/observations-$(date +%Y-%m-%d-%H%M%S).json
npm run detect-stable-patterns metrics/observations-*.json > metrics/analysis-$(date +%Y-%m-%d-%H%M%S).txt

# Compare runs
diff metrics/observations-2024-09-15*.json
diff metrics/analysis-2024-09-15*.txt

# Extract trend data
for f in metrics/analysis-*.txt; do echo "$f:"; grep "Overall Stability:" "$f"; done

# See what changed
grep "Observations:" metrics/analysis-*.txt | sort
```

---

## Real-World Example: Branch Pattern

### Observations
```
src/api/handlers.js:45-52     branch on config.enabled
src/services/auth.js:78-85    branch on user.isAdmin
src/utils/validators.js:5-11  branch on inputValid
src/api/routes.js:34-41       branch on feature.isActive
src/models/users.js:120-127   branch on account.premium
src/api/middleware.js:12-18   branch on context.authorized
```

### Analysis

**Frequency Score: 60%**
- 6 observations found
- Goal: 10+ for "very common"
- Status: Good, getting close

**Variety Score: 100%**
- Found in 6 different files ✅
- Across different modules (api, services, utils, models)
- Fully generalizable

**Consistency Score: 94%**
- All follow if/else pattern
- Similar code block sizes (8-12 lines)
- Low variation in structure

**Data Wiring Score: 100%**
- All conditions depend on external data (config, user, context)
- No internal state complexity
- Easily declarable to decision authority

**Automation Readiness: 92%**
- branch mechanic is highly deterministic
- No complex semantic decisions
- Safe transformation path proven

**Overall Stability: 89/100** → CANDIDATE FOR REGISTRATION

### Next Steps
1. ✅ Collect one more observation (get to 7)
2. 🔧 Write transformation capability proof
3. 📝 Prepare registration as "branch-decision-authority"
4. ✨ Apply deterministically to all 6 occurrences

---

## Pattern Stability vs. Test Variation

**Important distinction:**

> **Test variability ≠ pattern variability**

From the pipeline document:

```
Some tests are EXAMPLES/VECTORS of the same semantic obligation
Some tests expose genuinely different scenarios

Our system must distinguish the two
```

The stable pattern detector does this through **consistency analysis**:

- If 10 branch occurrences have same structure & intent → 1 pattern with 10 vectors
- If 10 branches have fundamentally different semantics → 2-3 distinct patterns

Consistency score separates these cases.

---

## Integration with Capability Library

Once a pattern is proven stable:

```
Stable Pattern
    ↓
Create deterministic transformation
    ↓
Test with all observations
    ↓
Register in Know-How Registry
    ↓
Apply everywhere
    ↓
Collapse bodies
    ↓
Update authority
    ↓
Reproject as needed
```

The Know-How Registry then tracks:

```javascript
{
  patternId: "branch-decision-authority-v2",
  mechanic: "branch",
  family: "decision-authority",
  maturity: "ADMITTED",
  
  applicableWhen: "branch on boolean/enum external data",
  consumes: "branch condition source",
  produces: "decision authority declaration",
  
  transformation: {
    role: "extraction/lowering",
    automation: "DETERMINISTIC",
  },
  
  proof: {
    testCount: 12,
    observationCount: 47,
    repositories: ["source-facts", "api-gateway", "auth-service"]
  }
}
```

---

## Commands

```bash
# Show the 8 capabilities in action
npm run capabilities-demo

# Detect stable patterns in observations
npm run detect-stable-patterns

# Run full self-governance report (uses all 8 capabilities)
npm run govern
```

---

## Key Insight

> **Stable pattern = deterministic transformation opportunity**

Once a mechanic has:
- ✅ Stable observed shape
- ✅ Stable semantic interpretation  
- ✅ Proven transformation capability

Continuing to spend cognitive effort on it is waste.

The strategic loop:
```
Find stable pattern
    ↓
Prove transformer once
    ↓
Register capability
    ↓
Apply everywhere
    ↓
Collapse bodies
    ↓
Grow authority
    ↓
(Reproject)
```

That's how SourceFacts transforms from **analysis engine** to **repository transformation engine**.

And that's where visible enterprise impact begins.
