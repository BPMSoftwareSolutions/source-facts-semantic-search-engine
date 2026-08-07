# Data Integrity Verification

Verify that all metrics are legitimate, sourced from live code analysis, and not hardcoded or fake.

---

## Quick Verification

Run before trusting any metrics:

```bash
npm run verify-data-integrity
```

**This checks:**
- ✅ Observations file structure and content
- ✅ All observations reference real source files
- ✅ Line numbers are reasonable (no fake ranges)
- ✅ No hardcoded demo data mixed in
- ✅ Automation authority config is valid
- ✅ Automation scores are in range (0-100)
- ✅ Source code files exist and have content
- ✅ Test suite covers capabilities

**Example output:**

```
🔍 Data Integrity Verification

======================================================================

📋 Observations File Integrity

✅ Observations JSON structure
   All required fields present
✅ Observations count
   247 observations loaded
✅ Observation record structure
   All required fields present
✅ File paths reference real files
   34/34 files verified as real (100%)
✅ Line numbers are reasonable
   All line ranges valid
✅ No hardcoded demo data detected
   No demo patterns detected
✅ Export is recent
   Exported 0 hours ago

⚙️  Automation Authority Configuration

✅ Automation authority file exists
   config/automation-readiness-authority.json found
✅ Authority JSON structure
   mechanicReadiness object present
✅ Automation scores are valid
   All 15 scores valid (0-100)
✅ No suspicious extreme scores
   Scores are distributed across range
✅ Authority has update date
   Last updated: 2024-09-15

📁 Source Code Verification

✅ Source files present
   115 .js files found in src/
✅ No empty source files
   All source files have content

🧪 Test Coverage

✅ Test files present
   74 test files found
✅ Core capability tests exist
   All 8 capabilities tested

======================================================================

📊 Integrity Summary

✅ Passed: 14
⚠️  Warnings: 0
❌ Failed: 0

✅ Data integrity verified - no hardcoded or fake data detected
```

---

## What Gets Verified

### Observations Data

✅ **File Structure**
- Contains `exportDate`, `projectRoot`, `observations`
- Each observation has `mechanic`, `modulePath`, `startLine`, `endLine`

✅ **File Paths**
- Every referenced source file actually exists on disk
- Paths use forward slashes consistently
- No obvious fake paths like `src/example`, `mock/`, `demo/`

✅ **Line Numbers**
- All `startLine` ≥ 1
- All `endLine` ≥ `startLine`
- No ranges larger than 500 lines (unrealistic)

✅ **Recency**
- Export date is recent (< 24 hours for live data)
- Warns if stale (> 7 days)

### Automation Authority

✅ **Configuration Structure**
- File: `config/automation-readiness-authority.json`
- Contains `mechanicReadiness` object
- Has `lastUpdated` field

✅ **Score Validity**
- All scores are integers (not floats)
- All scores in range 0-100
- No suspicious extremes (0% or 100% for all mechanics)
- Scores show variety (not all the same value)

### Source Code

✅ **Files Exist**
- `src/` directory present
- Contains real `.js` source files
- No empty files (all have content)

✅ **Tests Exist**
- `test/` directory present
- Test files exist for capabilities
- Core capabilities have test coverage

---

## Verification Before Each Run

**1. Before exporting observations:**
```bash
# Make sure project scanned
npm run project
# Output should show mechanics found
```

**2. Before analyzing patterns:**
```bash
# Verify observations are real
npm run verify-data-integrity

# Should show: File paths reference real files at 100%
```

**3. Before trusting metrics:**
```bash
# Full integrity check
npm run verify-data-integrity

# Should show: All checks PASS (no FAIL)
# May show WARN for stale data
```

---

## Common Verification Scenarios

### Scenario: Validating a colleague's metrics

Your team member ran:
```bash
npm run project
npm run export-observations
npm run detect-stable-patterns observations-*.json
```

To verify their numbers are real:

```bash
# 1. Check that observations reference real files
npm run verify-data-integrity
# → Should show: File paths reference real files at 100%

# 2. Spot-check a few files
npm run export-observations  # (creates observations-*.json)
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; obs.slice(0,5).forEach(o => console.log(o.modulePath, o.startLine, o.endLine))"

# 3. Verify those files exist
ls src/governance/classifies-execution-mechanics.js
sed -n '45,52p' src/governance/classifies-execution-mechanics.js  # Check line 45-52
```

### Scenario: Detecting fake observations

Someone added fake demo observations. Detection:

```bash
# Run verification
npm run verify-data-integrity

# Will detect:
# ❌ File paths reference real files
#    20/50 files verified as real (40%)
# 
# ⚠️  No hardcoded demo data detected
#    15 observations from known demo paths
```

### Scenario: Stale metrics

Export is 2 weeks old:

```bash
npm run verify-data-integrity

# Will warn:
# ⚠️  Export is recent
#    Exported 14 days ago (stale data, re-run export)
```

**Fix:**
```bash
npm run project
npm run export-observations
npm run verify-data-integrity  # Should now pass
```

### Scenario: Invalid automation scores

Someone manually edited config with bad values:

```bash
npm run verify-data-integrity

# Will catch:
# ❌ Automation scores are valid
#    3/15 invalid scores
# 
#    ⚠️  branch: 120 (should be 0-100 integer)
#    ⚠️  construction: 50.5 (should be integer)
#    ⚠️  loop: -10 (should be 0-100)
```

---

## Manual Verification Commands

For detailed investigation:

```bash
# Check observations file structure
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); console.log('Total:', obs.observations.length); console.log('Fields:', Object.keys(obs.observations[0]))"

# Verify all files exist
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); const fs = require('fs'); const root = obs.projectRoot; let count = 0; obs.observations.forEach(o => { if (fs.existsSync(root + '/' + o.modulePath)) count++; }); console.log('Files exist:', count + '/' + obs.observations.length)"

# Check mechanic variety
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); const m = new Set(obs.observations.map(o => o.mechanic)); console.log('Mechanic types:', Array.from(m).sort().join(', '))"

# Verify specific observation
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); const o = obs.observations[0]; console.log('Sample:', o.mechanic, 'in', o.modulePath, '@', o.startLine + '-' + o.endLine)"

# Check automation authority format
node -e "const auth = JSON.parse(require('fs').readFileSync('config/automation-readiness-authority.json')); Object.entries(auth.mechanicReadiness).forEach(([m,s]) => console.log(m.padEnd(15), s))"

# Verify score distribution
node -e "const auth = JSON.parse(require('fs').readFileSync('config/automation-readiness-authority.json')); const scores = Object.values(auth.mechanicReadiness); console.log('Min:', Math.min(...scores), 'Max:', Math.max(...scores), 'Avg:', (scores.reduce((a,b) => a+b)/scores.length).toFixed(1))"
```

---

## Verification in CI/CD

Add to your workflow:

```yaml
# .github/workflows/verify-metrics.yml
name: Verify Data Integrity
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - run: npm install
      - run: npm run project
      - run: npm run export-observations
      
      - name: Verify data integrity
        run: npm run verify-data-integrity
        
      - name: Fail if integrity issues
        if: failure()
        run: echo "Data integrity check failed" && exit 1
```

---

## Red Flags (Things to Investigate)

If you see these, something's wrong:

- 🚩 File paths don't reference real files
- 🚩 Large number of fake/demo patterns detected
- 🚩 Observations from only 1-2 files (not diverse)
- 🚩 All line numbers identical (e.g., all start at line 1)
- 🚩 Automation scores all at 50% or 100%
- 🚩 Export date is months old
- 🚩 Source code directory is empty
- 🚩 No tests found

**If you see any of these:**
1. Run `npm run verify-data-integrity` for details
2. Check git history: `git log --oneline scripts/ config/`
3. Verify project state: `npm run project 2>&1 | head -20`
4. Check for uncommitted fake files: `git status`

---

## Trust, But Verify

The verification script checks that:

1. **Data comes from live code** ✅
   - Every observation references real file on disk
   - Line numbers are in reasonable ranges

2. **Configuration is real** ✅
   - Automation authority file exists
   - Scores are valid and diverse

3. **No mixing of sources** ✅
   - No hardcoded demo data
   - No synthetic observations

4. **Tests cover capabilities** ✅
   - Core capabilities have test coverage
   - Tests exist and are not empty

**But it cannot verify:**
- Whether line numbers are 100% accurate (that's the source scanner's job)
- Whether the semantic analysis is correct (requires manual review)
- Whether automation scores reflect true safety (requires expert judgment)

For those, review the code and test suite:
```bash
cat test/self-governance-report.test.js | grep -A 10 "test.*branch"
```

---

## Reference

- [Metrics Validation Guide](./METRICS-VALIDATION-GUIDE.md)
- [Live Pattern Detection Workflow](./LIVE-PATTERN-DETECTION-WORKFLOW.md)
