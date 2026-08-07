# Metrics Validation & Delta Tracking Guide

This guide shows how to validate numbers reported by the pattern detection system and track changes over time.

---

## Quick Reference: All Commands & Their Outputs

### 1. Project Scan

**Command:**
```bash
npm run project
```

**Produces:**
- In-memory source facts index
- Extracts mechanics, symbols, references from source code

**Validate it ran:**
```bash
npm run project 2>&1 | tail -20
# Should show: index creation, mechanics found, etc.
```

---

### 2. Export Observations

**Command:**
```bash
npm run export-observations
```

**Produces:**
- File: `observations-YYYY-MM-DDTHH-mm-ss-SSSZ.json`
- Contents: 247 mechanic occurrences with locations

**Example output:**
```
📊 Exporting mechanic observations from project index...

✅ Exported 247 observations

📋 Summary by mechanic:
   • branch              87 occurrences, 34 files
   • loop                23 occurrences, 12 files
   • construction        45 occurrences, 28 files
   • fallback             3 occurrences,  3 files
   • retry                2 occurrences,  2 files

📄 Saved to: observations-2024-09-15T14-32-45-123Z.json
```

**Validate the file:**
```bash
# List files
ls -lh observations-*.json

# Count lines (observations)
wc -l observations-*.json

# Verify JSON validity
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); console.log('Valid JSON with', obs.observations.length, 'observations')"

# Extract mechanic summary
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); console.log('Mechanic Summary:'); const byMech = {}; obs.observations.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); Object.entries(byMech).sort((a,b) => b[1]-a[1]).forEach(([m,c]) => console.log('-', m.padEnd(15), c))"

# Extract file distribution
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')); const byFile = {}; obs.observations.forEach(o => byFile[o.modulePath] = (byFile[o.modulePath] || 0) + 1); console.log('Top 10 files:'); Object.entries(byFile).sort((a,b) => b[1]-a[1]).slice(0,10).forEach(([f,c]) => console.log('-', f, c))"
```

---

### 3. Pattern Analysis

**Command:**
```bash
npm run detect-stable-patterns observations-2024-09-15T14-32-45-123Z.json
```

**Produces:**
- Stability scores for each mechanic (0-100)
- Readiness categorization
- Recommendations and next steps

**Example output:**
```
🔍 Stable Pattern Detection for Execution Mechanics

======================================================================

✅ Loaded 247 mechanic observations

📊 Pattern Stability Analysis Results

1. BRANCH
   Observations: 87 occurrences across 34 files
   
   📈 Stability Scores (0-100):
      frequency       [██████████] 100
      variety         [██████████] 100
      consistency     [█████████░] 96
      dataWiring      [██████████] 100
      automation      [█████████░] 94

   Overall Stability: 98/100
   Automation Ready: 94/100
   Readiness Level: READY_FOR_DETERMINISTIC_TRANSFORMATION
```

**Validate the analysis:**
```bash
# Save output for comparison
npm run detect-stable-patterns observations-*.json > analysis-run-1.txt

# Extract readiness summary
grep "Readiness Level:" analysis-run-1.txt

# Extract stability scores
grep -A 8 "Stability Scores" analysis-run-1.txt

# Count ready vs. candidate patterns
echo "Patterns by readiness:"
grep "Readiness Level:" analysis-run-1.txt | sort | uniq -c
```

---

## Tracking Deltas Over Time

### Setup: Create a Metrics Directory

```bash
mkdir -p metrics
cd metrics
```

### Method 1: Date-Based Snapshots

Capture a complete snapshot with timestamp:

```bash
# Create snapshot
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
mkdir -p $TIMESTAMP

# Run full pipeline
npm run project
npm run export-observations
cp observations-*.json $TIMESTAMP/
npm run detect-stable-patterns $TIMESTAMP/observations-*.json > $TIMESTAMP/analysis.txt

# Extract key metrics
echo "=== $TIMESTAMP ===" > $TIMESTAMP/metrics.txt
echo "Export Date: $(date)" >> $TIMESTAMP/metrics.txt
echo "" >> $TIMESTAMP/metrics.txt
echo "Total Observations:" >> $TIMESTAMP/metrics.txt
node -e "const obs = JSON.parse(require('fs').readFileSync('$TIMESTAMP/observations-*.json')); console.log(obs.observations.length)" >> $TIMESTAMP/metrics.txt
echo "" >> $TIMESTAMP/metrics.txt
echo "Mechanic Distribution:" >> $TIMESTAMP/metrics.txt
node -e "const obs = JSON.parse(require('fs').readFileSync('$TIMESTAMP/observations-*.json')); const byMech = {}; obs.observations.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); Object.entries(byMech).sort((a,b) => b[1]-a[1]).forEach(([m,c]) => console.log('-', m, c))" >> $TIMESTAMP/metrics.txt
echo "" >> $TIMESTAMP/metrics.txt
echo "Readiness Summary:" >> $TIMESTAMP/metrics.txt
grep "Readiness Level:" $TIMESTAMP/analysis.txt | sort | uniq -c >> $TIMESTAMP/metrics.txt

# View snapshot
cat $TIMESTAMP/metrics.txt
```

### Method 2: Continuous Tracking Script

Create `scripts/track-metrics.mjs`:

```bash
cat > scripts/track-metrics.mjs << 'EOF'
#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const metricsDir = path.join('metrics', timestamp);

// Create directory
fs.mkdirSync(metricsDir, { recursive: true });

console.log(`📊 Capturing metrics snapshot: ${timestamp}\n`);

try {
  // Run project scan
  console.log('1️⃣  Running project scan...');
  execSync('npm run project', { stdio: 'inherit' });
  
  // Export observations
  console.log('\n2️⃣  Exporting observations...');
  execSync('npm run export-observations', { stdio: 'inherit' });
  
  // Copy observations
  const obsFile = fs.readdirSync('.').find(f => f.startsWith('observations-'));
  if (obsFile) {
    fs.copyFileSync(obsFile, path.join(metricsDir, obsFile));
  }
  
  // Run analysis
  console.log('\n3️⃣  Analyzing patterns...');
  execSync(`npm run detect-stable-patterns ${obsFile} > ${path.join(metricsDir, 'analysis.txt')}`, { stdio: 'inherit' });
  
  // Extract metrics
  const metrics = {
    timestamp,
    date: new Date().toISOString(),
  };
  
  fs.writeFileSync(path.join(metricsDir, 'metrics.json'), JSON.stringify(metrics, null, 2));
  
  console.log(`\n✅ Metrics saved to: ${metricsDir}`);
  
} catch (error) {
  console.error('❌ Error capturing metrics:', error.message);
  process.exit(1);
}
EOF
chmod +x scripts/track-metrics.mjs
```

Add to `package.json`:
```json
"track-metrics": "node ./scripts/track-metrics.mjs"
```

Run it:
```bash
npm run track-metrics
```

### Method 3: Compare Two Runs

```bash
# Run analysis twice, 10 minutes apart
npm run detect-stable-patterns observations-1.json > analysis-before.txt
sleep 600
npm run project
npm run export-observations
npm run detect-stable-patterns observations-2.json > analysis-after.txt

# Compare readiness scores
echo "=== Readiness Changes ==="
diff <(grep "Readiness Level:" analysis-before.txt | sort) \
     <(grep "Readiness Level:" analysis-after.txt | sort)

# Compare stability scores
echo "=== Stability Score Changes ==="
diff <(grep "Overall Stability:" analysis-before.txt) \
     <(grep "Overall Stability:" analysis-after.txt)

# See full diff
diff analysis-before.txt analysis-after.txt | less
```

---

## Key Metrics to Track

### Observation Counts

```bash
# Total observations
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; console.log('Total:', obs.length)"

# By mechanic
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; const byMech = {}; obs.forEach(o => byMech[o.mechanic] = (byMech[o.mechanic] || 0) + 1); Object.entries(byMech).sort((a,b) => b[1]-a[1]).forEach(([m,c]) => console.log(m, c))"

# By file
node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; const byFile = {}; obs.forEach(o => byFile[o.modulePath] = (byFile[o.modulePath] || 0) + 1); console.log('Files:', Object.keys(byFile).length)"
```

### Stability Scores

```bash
# Extract all stability scores
grep "Overall Stability:" analysis.txt

# Get average stability
grep "Overall Stability:" analysis.txt | sed 's/.* \([0-9]*\)\/100.*/\1/' | awk '{sum+=$1; n++} END {print "Average Stability:", sum/n}'

# Get patterns ready for transformation
grep -B 2 "READY_FOR_DETERMINISTIC_TRANSFORMATION" analysis.txt | grep -E "^[0-9]"
```

### Readiness Breakdown

```bash
# Count by readiness level
echo "Patterns by readiness:"
grep "Readiness Level:" analysis.txt | cut -d: -f2 | sort | uniq -c

# Ready patterns
grep "READY_FOR_DETERMINISTIC" analysis.txt | wc -l

# Candidates
grep "CANDIDATE_FOR_PATTERN" analysis.txt | wc -l

# Ready names
grep -B 2 "READY_FOR_DETERMINISTIC" analysis.txt | grep "^[0-9]" | sed 's/[0-9]*\. \(.*\)/\1/'
```

---

## Setting Up Automated Tracking

### GitHub Actions Workflow

Create `.github/workflows/metrics-tracking.yml`:

```yaml
name: Track Pattern Metrics
on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Mondays at 9 AM
  workflow_dispatch:

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm install
      - run: npm run project
      - run: npm run export-observations
      
      - name: Analyze patterns
        run: |
          npm run detect-stable-patterns observations-*.json > analysis.txt
          cat analysis.txt
      
      - name: Extract metrics
        run: |
          mkdir -p metrics
          TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
          cp observations-*.json metrics/observations-$TIMESTAMP.json
          cp analysis.txt metrics/analysis-$TIMESTAMP.txt
          
          # Extract key metrics
          {
            echo "# Metrics - $TIMESTAMP"
            echo ""
            echo "## Observations"
            grep "Loaded" analysis.txt
            echo ""
            echo "## Readiness Summary"
            grep "Readiness Level:" analysis.txt | sort | uniq -c
            echo ""
            echo "## Ready Patterns"
            grep -B 2 "READY_FOR_DETERMINISTIC" analysis.txt
          } > metrics/summary-$TIMESTAMP.md
      
      - name: Commit metrics
        run: |
          git config user.name "Metrics Bot"
          git config user.email "metrics@example.com"
          git add metrics/
          git commit -m "📊 Pattern metrics snapshot [$(date +%Y-%m-%d)]" || true
          git push
```

---

## Validation Checklist

Before trusting your numbers:

- [ ] Project scan completed without errors (`npm run project`)
- [ ] Observations exported (`observations-*.json` exists)
- [ ] JSON file is valid (parse succeeds)
- [ ] Observation count matches export output
- [ ] Mechanic distribution adds up correctly
- [ ] File count is reasonable (not all in 1 file, not split across 1000+)
- [ ] Pattern analysis ran without errors
- [ ] Readiness levels are assigned to all patterns
- [ ] Stability scores are 0-100 range
- [ ] Automation authority loaded (`config/automation-readiness-authority.json`)

**Full validation script:**

```bash
#!/bin/bash
set -e

echo "🔍 Validating metrics capture..."

# Check files exist
[ -f "observations-*.json" ] || { echo "❌ Observations file not found"; exit 1; }
[ -f "config/automation-readiness-authority.json" ] || { echo "❌ Automation authority not found"; exit 1; }

# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('observations-*.json'))" || { echo "❌ Observations JSON invalid"; exit 1; }
node -e "JSON.parse(require('fs').readFileSync('config/automation-readiness-authority.json'))" || { echo "❌ Authority JSON invalid"; exit 1; }

# Check observation counts
OBS_COUNT=$(node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; console.log(obs.length)")
echo "✅ Observations: $OBS_COUNT"

# Check mechanic variety
MECHANIC_COUNT=$(node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; const m = new Set(obs.map(o => o.mechanic)); console.log(m.size)")
echo "✅ Mechanic types: $MECHANIC_COUNT"

# Check file distribution
FILE_COUNT=$(node -e "const obs = JSON.parse(require('fs').readFileSync('observations-*.json')).observations; const f = new Set(obs.map(o => o.modulePath)); console.log(f.size)")
echo "✅ Files affected: $FILE_COUNT"

# Check automation authority definitions
AUTH_COUNT=$(node -e "const auth = JSON.parse(require('fs').readFileSync('config/automation-readiness-authority.json')); console.log(Object.keys(auth.mechanicReadiness).length)")
echo "✅ Automation definitions: $AUTH_COUNT"

echo ""
echo "✅ All validations passed!"
```

Save as `scripts/validate-metrics.sh` and run:
```bash
bash scripts/validate-metrics.sh
```

---

## Interpreting Deltas

When comparing two runs, look for:

**Positive changes (fewer needs):**
- ✅ More observations (pattern usage growing)
- ✅ Higher stability scores (pattern more stable)
- ✅ Readiness level improvement (CANDIDATE → READY)
- ✅ Wider file distribution (more generalizable)

**Negative changes (requires attention):**
- ⚠️ Fewer observations (pattern usage declining)
- ⚠️ Lower stability scores (pattern becoming inconsistent)
- ⚠️ Readiness level decline (regression)
- ⚠️ Concentration in fewer files (becoming less generalizable)

**Normal variation:**
- ±1-2% in scores (measurement noise)
- Small observation count changes (minor code edits)
- File count stable (no major refactor)

---

## References

- [Live Pattern Detection Workflow](./LIVE-PATTERN-DETECTION-WORKFLOW.md)
- [Stable Pattern Detection](./STABLE-PATTERN-DETECTION.md)
- [Capabilities Reference](./CAPABILITIES-REFERENCE.md)
