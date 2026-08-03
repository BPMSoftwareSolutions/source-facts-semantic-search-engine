# Generate Authority Candidates Detailed Report

**Purpose:** Automate the creation of markdown reports that show real source code alongside projected authority candidates, enabling code-to-authority migration without manual reading.

**Scope:** Takes an indexed file/workspace, projects authority candidates, deduplicates by source location, extracts real code snippets, and generates a formatted markdown report for team review.

**Time investment:** ~2 minutes per file (after index exists)

---

## Quick Start

```bash
# 1. Index your file/workspace
node src/cli.js project \
  --workspace "path/to/code" \
  --output "output-index.json"

# 2. Project authority candidates
node src/cli.js project-authority \
  --index "output-index.json" \
  --output "output-candidates.json" \
  --summary

# 3. Deduplicate (PowerShell or Node)
# [See Step 3 below]

# 4. Generate detailed report
node generate-report.js  # Uses deduped candidates + workspace path

# 5. Review markdown report
# Report includes real code snippets with → markers
```

---

## Step-by-Step Workflow

### Step 1: Index the File or Workspace

```bash
node src/cli.js project \
  --workspace "c:\path\to\your\code" \
  --output "your-index.json"
```

**Output:** JSON file with symbols, relationships, control flow, and body mechanics indexed.

**Example from serves-query-console.js:**
```
Workspace: c:\lab\repos\source-facts-semantic-search-engine\src\console
Output: console-index.json
```

**What gets indexed:**
- Function declarations (entry points, handlers)
- Variable declarations (constants, parameters)
- Control flow (if/else, loops, switch)
- Invocations (calls to other functions)
- Object/array construction
- Throw statements
- Exception handling (try/catch)
- Serialization (JSON.stringify, etc.)

### Step 2: Project Authority Candidates

```bash
node src/cli.js project-authority \
  --index "your-index.json" \
  --output "your-candidates.json" \
  --summary
```

**Output:** JSON file with authority candidate scaffolds (pre-shaped with semantic gaps flagged).

**Example metrics:**
```
Generated 8 authority candidates
Coverage: 0.0%
Gate status: NOT_READY
```

**Candidate types generated:**
- `decision-authority-candidate.v1` — Branch conditions (if/else)
- `failure-disposition-authority-candidate.v1` — Throw statements
- `projection-mapping-candidate.v1` — Object construction/field mapping
- `iteration-authority-candidate.v1` — For loops, array.map, etc.
- `state-transition-authority-candidate.v1` — State mutations
- `serialization-profile-candidate.v1` — JSON serialization, encoding
- `validation-policy-candidate.v1` — Validation predicates
- `failure-observation-candidate.v1` — Exception handling (catch blocks)
- `fallback-policy-candidate.v1` — Fallback values, default assignments
- `normalization-authority-candidate.v1` — Normalization transforms

### Step 3: Deduplicate Candidates

Some mechanics may be indexed multiple times (same location appearing in multiple queries). Remove duplicates by source location key.

**PowerShell approach (recommended for Windows):**

```powershell
$inputPath = 'your-candidates.json'
$outputPath = 'your-candidates-deduped.json'

$data = Get-Content $inputPath -Raw | ConvertFrom-Json
$seen = @{}
$deduped = @()

foreach ($cand in $data.candidates) {
  $key = "$($cand.source.modulePath):$($cand.source.startLine):$($cand.source.mechanic)"
  if (-not $seen[$key]) {
    $seen[$key] = $true
    $deduped += $cand
  }
}

$result = $data
$result.candidates = $deduped
$result | ConvertTo-Json -Depth 100 | Set-Content $outputPath

Write-Host "Deduplicated: $($data.candidates.Count) → $($deduped.Count) unique"
```

**Node.js approach:**

```javascript
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('your-candidates.json', 'utf8'));
const seen = new Set();
const deduped = [];

data.candidates.forEach(cand => {
  const key = `${cand.source.modulePath}:${cand.source.startLine}:${cand.source.mechanic}`;
  if (!seen.has(key)) {
    seen.add(key);
    deduped.push(cand);
  }
});

const result = { ...data, candidates: deduped };
fs.writeFileSync('your-candidates-deduped.json', JSON.stringify(result, null, 2));

console.log(`Deduplicated: ${data.candidates.length} → ${deduped.length}`);
```

### Step 4: Generate Detailed Report with Real Source Code

Create a Node.js script that:
1. Reads deduped candidates JSON
2. Groups by authority type (10 types)
3. For each type, reads real source code from disk
4. Extracts code snippet with context lines and line numbers
5. Marks target line with `→` marker
6. Formats markdown with observed code + projected JSON + decisions

**Template script (generates `output-detailed-report.md`):**

```javascript
const fs = require('fs');
const path = require('path');

// Configuration
const baseWorkspacePath = 'C:\\lab\\repos\\source-facts-semantic-search-engine\\src\\console\\';
const inputCandidates = 'console-candidates-deduped.json';
const outputMarkdown = 'console-candidates-detailed-report.md';
const contextLines = 5;

// Read candidates
const data = JSON.parse(fs.readFileSync(inputCandidates, 'utf8'));

// Helper: Extract code snippet
function getCodeSnippet(modulePath, lineNumber) {
  try {
    const fullPath = path.join(baseWorkspacePath, modulePath);
    if (!fs.existsSync(fullPath)) return null;

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    const start = Math.max(0, lineNumber - 1 - contextLines);
    const end = Math.min(lines.length, lineNumber + contextLines);

    let snippet = '';
    for (let i = start; i < end; i++) {
      const isTarget = (i + 1) === lineNumber;
      const marker = isTarget ? '→ ' : '  ';
      const lineNum = String(i + 1).padStart(4);
      snippet += marker + lineNum + ': ' + lines[i] + '\n';
    }
    return snippet;
  } catch (e) {
    return null;
  }
}

// Group by type
const grouped = {};
data.candidates.forEach(cand => {
  const type = cand.authorityCandidateType;
  if (!grouped[type]) grouped[type] = [];
  grouped[type].push(cand);
});

// Generate markdown
let markdown = `# Authority Candidate Projections

**Generated:** ${data.generatedAtUtc}
**Total Candidates:** ${data.candidates.length}
**Coverage:** ${(data.coverageSummary.authorityConformanceRatio * 100).toFixed(1)}%

---

## Overview

Automatically projected ${data.candidates.length} authority candidate scaffolds from source mechanics.

---

`;

// Type mapping
const typeMap = {
  'decision-authority-candidate.v1': 'Branch → Decision Authority Candidate',
  'failure-disposition-authority-candidate.v1': 'Throw → Failure Disposition Candidate',
  'projection-mapping-candidate.v1': 'Object Construction → Projection Mapping Candidate',
  'iteration-authority-candidate.v1': 'Iteration → Iteration Authority Candidate',
  'state-transition-authority-candidate.v1': 'State Mutation → State Transition Candidate',
  'serialization-profile-candidate.v1': 'Serialization → Serialization Profile Candidate',
  'validation-policy-candidate.v1': 'Validation → Validation Policy Candidate',
  'failure-observation-candidate.v1': 'Exception Handling → Failure Observation Candidate',
  'fallback-policy-candidate.v1': 'Fallback → Fallback Policy Candidate',
  'normalization-authority-candidate.v1': 'Normalization → Normalization Candidate'
};

// Generate sections
for (const [type, title] of Object.entries(typeMap)) {
  const candidates = grouped[type];
  if (!candidates || candidates.length === 0) continue;

  markdown += `## ${title}\n\n`;
  markdown += `**Count:** ${candidates.length}\n\n`;

  const ex = candidates[0];
  markdown += `### Example from \`${ex.source.modulePath}:${ex.source.startLine}\`\n\n`;

  const snippet = getCodeSnippet(ex.source.modulePath, ex.source.startLine);
  if (snippet) {
    markdown += `**Observed code:**\n\n\`\`\`\n${snippet}\`\`\`\n\n`;
  } else {
    markdown += `**Observed code location:** \`${ex.source.modulePath}:${ex.source.startLine}\`\n\n`;
  }

  markdown += `**Projected candidate:**\n\n\`\`\`json\n${JSON.stringify(ex, null, 2)}\n\`\`\`\n\n`;

  markdown += `**Unresolved decisions:**\n`;
  ex.requiredHumanResolution.forEach(d => markdown += `- ${d}\n`);
  markdown += `\n**Pattern frequency:** ${candidates.length} occurrence(s)\n\n---\n\n`;
}

// Coverage summary
markdown += `## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Mechanics Observed | ${data.coverageSummary.totalMechanics} |
| Unique Candidates | ${data.candidates.length} |
| Authority Conformance Ratio | ${(data.coverageSummary.authorityConformanceRatio * 100).toFixed(1)}% |
| Admission Gate Status | ${data.coverageSummary.admissionGateStatus} |

---

## Next Steps

1. Review candidates with domain experts
2. Resolve unresolved decisions
3. Bind to authority files
4. Recalculate coverage
5. Generate deterministic replacements

`;

fs.writeFileSync(outputMarkdown, markdown);
console.log('Report generated: ' + outputMarkdown);
```

### Step 5: Review and Share

The markdown report is now ready for your team:
- **Real source code** with context and line numbers
- **Projected JSON scaffolds** with all extracted fields
- **Unresolved decisions** clearly flagged
- **Coverage metrics** tracking progress

Example structure:
```
# Authority Candidate Projections

## Branch → Decision Authority Candidate
### Example from `serves-query-console.js:45`

**Observed code:**
  40: port = 0,
  41: } = {}) {
  42: try {
  43: classifiesLoopbackBind({ hostname });
  44: } catch (error) {
→ 45: if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
  46: throw new Error(...)

**Projected candidate:**
{ "authorityCandidateType": "decision-authority-candidate.v1", ... }

**Unresolved decisions:**
- extract condition from source
- confirm input type
- ...
```

---

## Common Patterns & Queries

### Pattern: Validation chains
Files with multiple validation branches often have **3-5 decision candidates**. Each represents one validation rule.

```bash
# Query the index for validation patterns:
node src/cli.js query --index your-index.json \
  --command "SELECT mechanic FROM mechanics WHERE mechanic = 'branch' AND context CONTAINS 'validation'"
```

### Pattern: Error handling
Exception handling creates **failure-disposition candidates**. One per throw point.

**Query:** Throws by context
```bash
node src/cli.js query --index your-index.json \
  --command "SELECT * FROM mechanics WHERE mechanic = 'throw'"
```

### Pattern: Data transformation
Object construction creates **projection-mapping candidates**. One per unique shape.

**Query:** Object literals
```bash
node src/cli.js query --index your-index.json \
  --command "SELECT * FROM mechanics WHERE mechanic = 'object-construction'"
```

---

## Deduplication Strategy

**Why deduplicate?**
- Index queries can return duplicate mechanics (same line, multiple query contexts)
- Without dedup: 3,316 candidates → 44 unique (reduces cognitive load 75x)
- With dedup: Each candidate represents one actual mechanic occurrence

**Key field:** `${modulePath}:${startLine}:${mechanic}`

This tuple uniquely identifies one mechanic in one source file at one line.

---

## Troubleshooting

### "File not found" in report
**Cause:** Workspace path in generator script doesn't match actual file location

**Fix:** Update `baseWorkspacePath` in script to match your workspace root

```javascript
// Wrong:
const baseWorkspacePath = 'C:\\source\\...\\sterilizer\\...\\src\\runtime\\';

// Right (matches index workspace):
const baseWorkspacePath = 'C:\\lab\\repos\\contract-driven-artifact-governance-engine\\lib\\';
```

### No candidates generated
**Cause:** Index is empty or no supported mechanics found

**Verify:**
1. Index file exists and is valid JSON
2. Workspace contains `.js` / `.mjs` / `.ts` files
3. Check summary output: `Generated N authority candidates`

### Markdown formatting issues
**Cause:** JSON.stringify escaping or template literal backticks

**Fix:** Use separate string concatenation for JSON blocks:
```javascript
markdown += '```json\n';
markdown += JSON.stringify(candidate, null, 2);
markdown += '\n```\n\n';
```

---

## Performance Characteristics

| Stage | Time | Notes |
|-------|------|-------|
| **Index** | 2-5s | Depends on file size |
| **Project** | 1-2s | Creates candidates from mechanics |
| **Deduplicate** | <1s | In-memory dedup by source key |
| **Generate report** | 1-2s | Reads source files, formats markdown |
| **Total** | ~5-10s | For typical file |

For large codebases (9,000+ mechanics):
- Index: 20-30s
- Project: 10-15s
- Total: ~1 minute

---

## Skill Application: Real-World Example

**File:** `serves-query-console.js` (259 lines, HTTP server)

**Results:**
- 8 unique authority candidates
- Coverage: 0% (all AUTHORITY_CANDIDATE_PROJECTED)
- Candidates represent: validation, error handling, serialization, iteration

**Candidate breakdown:**
- 1× Branch (error disposition check)
- 3× Throw (validation failures)
- 1× Object Construction (pathname allow map)
- 1× Iteration (file line loop)
- 1× State Mutation (request body accumulation)
- 1× Serialization (JSON responses)
- 1× Exception Handling (URL parsing error)

**Team review time:** ~15 minutes to read all 8 candidates and resolve semantic decisions

**Migration readiness:** HIGH — small file, clear responsibilities, actionable candidates

---

## When to Use This Skill

✅ **Good candidates for this workflow:**
- Single-responsibility functions (HTTP handlers, validators)
- Files under 500 lines (easier visual inspection)
- Code with clear business logic (not boilerplate)
- Teams doing code-to-authority migration
- Files where semantic authority is not yet documented

❌ **Not suitable for:**
- Files that already have complete authority documentation
- Auto-generated code
- Massive files (10,000+ lines) — consider breaking into smaller analysis units

---

## Integration with Migration Loop

This skill generates the **"Observe → Map → Project → Author"** stage:

1. **Observe:** Index captures mechanics from source
2. **Map:** Project translates mechanics to candidate scaffolds
3. **Project:** Report visualizes candidates with real code
4. **Author:** Team reviews report and fills semantic decisions ← **You are here**

Next stage: Binding candidates to authority files once team confirms meaning.

---

## Files Created by This Skill

| File | Purpose |
|------|---------|
| `{name}-index.json` | Indexed mechanics (input to project-authority) |
| `{name}-candidates.json` | Raw candidates (may have duplicates) |
| `{name}-candidates-deduped.json` | Unique candidates by source location |
| `{name}-candidates-detailed-report.md` | **Final report for team review** |

Keep the `.md` report in version control. Archive the `.json` files if you prefer (they can be regenerated).

---

## Next Skill: Authority Binding

Once your team reviews this report and resolves all `requiredHumanResolution` decisions, the next skill is:
- Bind decisions to authority files (authority candidates → authority declarations)
- Generate replacement implementations
- Recalculate coverage ratio
- Move from 0% to 100% conformance

See `docs/skills/project-authority-candidates-from-mechanics/SKILL.md` for the projection mechanics reference.
