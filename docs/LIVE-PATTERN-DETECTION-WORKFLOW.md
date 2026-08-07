# Live Pattern Detection Workflow

This guide shows how to detect stable patterns in your **actual codebase** using the 8 deterministic transformation capabilities.

## Quick Start

```bash
# Step 1: Scan your project for mechanics
npm run project

# Step 2: Export mechanic observations to JSON
npm run export-observations

# Step 3: Analyze observations for stable patterns
# (requires config/automation-readiness-authority.json)
npm run detect-stable-patterns observations-*.json
```

**What happens:**
1. Project scan builds source facts index from your code
2. Export extracts mechanic observations to file
3. Pattern detector loads your observations + automation authority from config
4. Scores each pattern's stability (0-100)
5. Reports which patterns are ready for deterministic transformation

---

## The Workflow

### Step 1: Project Scan

Generates the source facts index from your codebase:

```bash
npm run project
```

**What this does:**
- Scans all source files in workspace
- Extracts execution mechanics (branch, loop, construction, etc.)
- Maps symbols and their relationships
- Records source locations

**Index contents:**
- All source files and their structure
- All execution mechanics observed
- All symbols and their relationships
- Source location references

**Notes:**
- Index lives in memory only (doesn't persist)
- Use Step 2 to export observable data

---

### Step 2: Export Observations

Extract mechanic observations from the index to JSON file:

```bash
npm run export-observations
```

**Command output example:**
```
📊 Exporting mechanic observations from project index...

✅ Exported 247 observations

📋 Summary by mechanic:
   • branch              87 occurrences, 34 files
   • loop                23 occurrences, 12 files
   • construction        45 occurrences, 28 files
   • ...

📄 Saved to: observations-2024-09-15T14-32-45-123Z.json

Use for pattern analysis:
   npm run detect-stable-patterns observations-2024-09-15T14-32-45-123Z.json
```

**Output file:** `observations-2024-09-15T14-32-45-123Z.json`

**To validate export:**
```bash
# Check file was created
ls -lh observations-*.json

# Verify JSON is valid
node -e "console.log(JSON.parse(require('fs').readFileSync('observations-*.json')).observations.length)"

# Check mechanic distribution
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; const byMech = {}; obs.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); console.log(byMech)"
```

**Contents:**
```json
{
  "exportDate": "2024-09-15T14:32:45.123Z",
  "projectRoot": "/path/to/project",
  "indexId": "sha256:abc123...",
  "scanId": "scan-001",
  "totalObservations": 247,
  "mechanicSummary": {
    "branch": { "count": 87, "files": 34 },
    "loop": { "count": 23, "files": 12 },
    "construction": { "count": 45, "files": 28 },
    ...
  },
  "observations": [
    {
      "occurrenceId": "bm-1001",
      "mechanic": "branch",
      "modulePath": "src/api/handlers.js",
      "startLine": 45,
      "endLine": 52,
      "sourceReferenceId": "ref-1",
      "fromSymbolId": "sym-auth"
    },
    ...
  ]
}
```

### Step 3: Detect Stable Patterns

Analyze observations against automation authority to score pattern stability:

```bash
npm run detect-stable-patterns observations-2024-09-15T14-32-45-123Z.json
```

**What happens:**
1. Loads observations from JSON file
2. Loads automation readiness scores from `config/automation-readiness-authority.json`
3. Scores each mechanic type on 5 dimensions
4. Ranks by stability (0-100)
5. Categorizes readiness level

**Command output example:**

```
🔍 Stable Pattern Detection for Execution Mechanics

======================================================================

📁 Scanning project for execution mechanics...

✅ Loaded 247 mechanic observations

📊 Pattern Stability Analysis Results

1. BRANCH
   Family: decision-authority
   Observations: 87 occurrences across 34 files
   Files: src/api/handlers.js, src/api/middleware.js, ... (34 total)

   📈 Stability Scores (0-100):
      frequency       [██████████] 100
      variety         [██████████] 100
      consistency     [█████████░] 96
      dataWiring      [██████████] 100
      automation      [█████████░] 94

   Overall Stability: 98/100
   Automation Ready: 94/100
   Readiness Level: READY_FOR_DETERMINISTIC_TRANSFORMATION

   💡 Recommendation:
      "branch" pattern is stable and ready for deterministic 
      transformation. Register as canonical capability.

   📋 Next Steps:
      1. Write transformation capability proof (test suite)
      2. Register in know-how registry
      3. Apply deterministically across repository
      4. Monitor conformance

   ------------------------------------------------------------------

2. CONSTRUCTION
   ...
```

**Configuration used:**

The automation readiness scores come from:
```bash
cat config/automation-readiness-authority.json | grep -A 20 mechanicReadiness
```

Output:
```json
"mechanicReadiness": {
  "branch": 92,
  "construction": 95,
  "fallback": 75,
  "retry": 72,
  ...
}
```

**To validate results:**

```bash
# Check which automation authority was loaded
node -e "const auth = JSON.parse(require('fs').readFileSync('config/automation-readiness-authority.json')); console.log('Loaded', Object.keys(auth.mechanicReadiness).length, 'mechanic definitions'); console.log('Last updated:', auth.lastUpdated)"

# Get summary of loaded observations
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; console.log('Total observations:', obs.length); const byMech = {}; obs.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); Object.entries(byMech).sort((a,b) => b[1]-a[1]).slice(0,5).forEach(([m,c]) => console.log('-', m, c))"

# Run detector and capture output
npm run detect-stable-patterns observations-*.json > pattern-analysis-2024-09-15.txt
cat pattern-analysis-2024-09-15.txt
```

**To track deltas over time:**

```bash
# Run analysis and save with timestamp
npm run detect-stable-patterns observations-*.json > pattern-analysis-$(date +%Y-%m-%d-%H%M%S).txt

# Compare two runs
diff pattern-analysis-2024-09-15-140000.txt pattern-analysis-2024-09-15-150000.txt

# Extract just the readiness summary
grep -A 20 "Summary" pattern-analysis-*.txt | grep -E "Ready|Candidate|Total"
```

---

## Full Example Workflow

```bash
# Start fresh scan
npm run project

# Get observations
npm run export-observations

# Find patterns (using latest export file)
npm run detect-stable-patterns observations-*.json

# If patterns are ready:
# 1. Create transformation test in test/new-pattern.test.js
# 2. Add capability registration to know-how registry
# 3. Apply across repository
# 4. Verify conformance
```

---

## How It Analyzes Live Data

The pattern detector uses the 8 capabilities to score observations:

```javascript
// 1. Mechanic Classifier
classifiesMechanicOccurrence(occurrence)
// → confirms observation type

// 2. Authority Family Resolver
resolvesAuthorityFamily("branch")
// → groups into semantic family

// 3. Data-Driven Wiring Detector
resolvesDataWiringPatterns(occurrences)
// → scores externalizability

// 4. Automation Readiness Classifier
analyzeAutomationReadiness("branch")
// → generates safety score (92% for branch)

// 5-8. Other capabilities
// → verify uniqueness, consistency, succession
```

Combined score tells you:
- ✅ **90-100:** Ready for deterministic transformation
- 🟡 **75-89:** Candidate (needs analysis + test proof)
- 🟠 **60-74:** Requires further study
- 🔴 **<60:** Not ready

---

## Configuration

### Automation Readiness Authority

The pattern detector loads automation safety scores from:

```
config/automation-readiness-authority.json
```

This is a data-driven config file that maps each mechanic to its automation readiness score (0-100):

```json
{
  "$schema": "automation-readiness-authority.v1",
  "mechanicReadiness": {
    "branch": 92,
    "construction": 95,
    "fallback": 75,
    "loop": 65,
    ...
  }
}
```

**Why external config?**
- Automation scores may change as patterns improve
- Different teams may have different safety tolerances
- Scores should be reviewed and versioned separately from detection logic
- No hardcoded values = fully data-driven

**To customize:**
1. Edit `config/automation-readiness-authority.json`
2. Adjust `mechanicReadiness` scores based on your confidence
3. Re-run pattern detection to get new readiness levels

---

## Data Format Reference

### Export File Structure

```json
{
  "exportDate": "ISO timestamp",
  "projectRoot": "absolute path to project",
  "indexId": "sha256:...",
  "scanId": "scan identifier",
  "totalObservations": 247,
  
  "mechanicSummary": {
    "mechanic-type": {
      "count": number of occurrences,
      "files": number of unique files
    }
  },
  
  "observations": [
    {
      "occurrenceId": "unique id",
      "mechanic": "branch|loop|construction|...",
      "modulePath": "relative path",
      "startLine": number,
      "endLine": number,
      "sourceReferenceId": "ref id",
      "fromSymbolId": "symbol id or null"
    }
  ]
}
```

### Custom Observations JSON

You can create your own observations file:

```json
[
  {
    "mechanic": "branch",
    "modulePath": "src/handlers/auth.js",
    "startLine": 45,
    "endLine": 52
  },
  {
    "mechanic": "branch",
    "modulePath": "src/middleware/cors.js",
    "startLine": 12,
    "endLine": 18
  },
  {
    "mechanic": "construction",
    "modulePath": "src/models/user.js",
    "startLine": 8,
    "endLine": 15
  }
]
```

Then run:
```bash
npm run detect-stable-patterns your-observations.json
```

---

## Interpreting Stability Scores

### Frequency Score (0-100%)

How often the pattern appears:
- **50% or less:** Rare (1-3 occurrences)
- **50-75%:** Common (4-7 occurrences)
- **75-90%:** Very common (8-15 occurrences)
- **90%+:** Pervasive (16+ occurrences)

**Action:** Patterns with ≥50% frequency are worth analyzing.

### Variety Score (0-100%)

How many different files contain the pattern:
- **0-50%:** Concentrated in 1-2 files
- **50-75%:** Spread across 3-5 files
- **75-90%:** Distributed across 6-10 files
- **90%+:** Highly generalizable (10+ files)

**Action:** Variety ≥75% means pattern is truly generalizable.

### Consistency Score (0-100%)

How similar are observations to each other:
- **<70%:** Highly variable (different shapes/sizes)
- **70-85%:** Mostly consistent
- **85-95%:** Very consistent
- **95%+:** Nearly identical

**Action:** Consistency ≥85% means pattern has predictable shape.

### Data Wiring Score (0-100%)

How clear are data dependencies:
- **<70%:** Complex, coupled to state
- **70-85%:** Some coupling
- **85-95%:** Clear data flow
- **95%+:** Fully externalizeable

**Action:** Wiring ≥85% means safe to extract to authority.

### Automation Readiness (0-100%)

How safely can this mechanic be transformed:
- **<70%:** Requires human review
- **70-85%:** Moderate safety
- **85-95%:** High safety
- **95%+:** Very safe

**Mechanic defaults:**
- Branch: 92% (highly deterministic)
- Construction: 95% (fully deterministic)
- Fallback: 75% (needs semantic analysis)
- Retry: 72% (complex failure semantics)
- Loop: 65% (iteration semantics matter)

**Action:** Score ≥75% is acceptable with test proof.

---

## Next Steps After Pattern Detection

### For READY patterns (score ≥90):

1. **Write proof**
   ```bash
   # Create test/new-stable-pattern.test.js
   # Document transformation in comments
   # Test against all known observations
   ```

2. **Register capability**
   ```javascript
   // Add to know-how registry
   {
     patternId: "branch-decision-authority-v2",
     mechanic: "branch",
     maturity: "ADMITTED",
     automation: "DETERMINISTIC"
   }
   ```

3. **Apply everywhere**
   ```bash
   npm run govern  # Run full report
   # Apply transformation to all occurrences
   ```

### For CANDIDATE patterns (score 75-89):

1. **Semantic analysis**
   - Document the pattern meaning
   - Identify edge cases
   - Propose authority structure

2. **Create prototype**
   - Transform one occurrence
   - Verify result preserves meaning
   - Document transformation rules

3. **Write proof**
   - Add test cases for prototype
   - Cover edge cases
   - Document known limitations

4. **Ready for admission**
   - If test proof passes
   - If semantic analysis complete
   - Register as ADMITTED capability

---

## Common Patterns You'll Find

### High-Confidence (90%+)

```javascript
// Branch on configuration flag
if (config.enabled) { ... }  // 92%

// Object construction with literals
{ userId: 123, name: "John" }  // 95%

// Array iteration with for-of
for (const item of array) { ... }  // 88%
```

### Medium-Confidence (75-85%)

```javascript
// Fallback to default
value ?? defaultValue  // 75%

// Null/undefined check
if (!value) { ... }  // 80%

// Try/catch wrapping
try { ... } catch { ... }  // 65%
```

### Lower-Confidence (<75%)

```javascript
// Complex state mutations
obj.field = computed()  // 60%

// Async control flow
async/await patterns  // 70%

// Custom error handling  
if (error.code === "specific") { ... }  // 55%
```

---

## Troubleshooting

### No observations exported

```bash
npm run project
# Check console for errors
# Verify project has source files

npm run export-observations
# Should create observations-*.json file
```

### Observations file format error

```bash
# Validate JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('observations.json')))"

# Check required fields for each observation:
# - mechanic (string)
# - modulePath (string)  
# - startLine (number)
# - endLine (number)
```

### All patterns below 75% score

This can mean:
- Patterns aren't repeated enough (collect more data)
- Patterns are too variable (need semantic analysis)
- Automation safety is low (needs manual review)

**Resolution:**
```bash
# Collect more observations
npm run project
npm run export-observations

# Or provide manual semantic guidance
# (See CAPABILITIES-REFERENCE.md for structure)
```

---

## Integration with CI/CD

Add pattern detection to your workflow:

```yaml
# .github/workflows/governance.yml
name: Pattern Detection
on: [push, pull_request]

jobs:
  patterns:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run project
      - run: npm run export-observations
      - run: npm run detect-stable-patterns observations-*.json
      - name: Check for new ready patterns
        # Flag patterns with score ≥90
```

---

## References

- [Capabilities Reference](./CAPABILITIES-REFERENCE.md) — All 8 capabilities documented
- [Stable Pattern Detection](./STABLE-PATTERN-DETECTION.md) — Scoring algorithm
- [Deterministic Transformation Pipeline](./deterministic-transformation-pipeline.md) — Strategic overview
