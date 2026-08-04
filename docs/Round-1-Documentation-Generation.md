# Round 1: Automated Documentation Generation

**Status:** ✅ Gap closed  
**Date:** 2026-08-04

## What Was the Gap?

From the Strategic Roadmap (line 51):

> **Gap:** Counts and percentages are embedded in narrative snapshots  
> **Consequence:** Documentation drifts as the source and scan boundary change  
> **Required response:** Generate metrics and tables from a versioned traceability report

Previous state: Manual narrative documents with hardcoded numbers (e.g., "30 CLI runners", "373 total mechanics") that became stale when the index changed.

## What Changed

### New Capability: Automated Documentation Generation

**Command:**
```bash
npm run generate-docs
```

**What it does:**
1. Reads `source-facts-self-governance-report.json` (governance measurements)
2. Reads `call-graph.json` (entry-point reachability)
3. Reads `source-fact-index.json` (symbol inventory)
4. Generates `docs/generated/traceability-metrics.md` with current metrics

**Key features:**
- ✅ All metrics tied to versioned artifact IDs (index, scan, timestamp)
- ✅ Machine-generated (not manually maintained)
- ✅ Reproducible from the same artifacts
- ✅ 100% current with the index
- ✅ No narrative snapshot drift

### Example Output

```markdown
# Traceability Metrics Report

**Generated:** 2026-08-04T13:29:42.281Z
**Report Index ID:** `sha256:...`
**Call Graph Index ID:** `sha256:...`

## Entry Point Reachability (Call Graph)

| Metric | Value |
|---|---:|
| Command roots discovered | 15 |
| Runtime callable functions | 667 |
| Reachable from CLI | 535 |
| Unreachable (dead code) | 132 |
| Reachability Coverage | 80.2% |
```

All numbers are **pulled from the index**, not hardcoded.

## Integration Points

### 1. Standalone Usage
```bash
npm run generate-docs
npm run generate-docs --report path/to/report.json --graph path/to/graph.json --index path/to/index.json
```

### 2. Part of Governance Pipeline (Future)

In Round 1 final implementation, `npm run govern` will automatically:
```bash
1. Project source-facts index
2. Generate call-graph
3. Generate self-governance report
4. Auto-generate traceability-metrics.md
```

### 3. CI/CD Integration (Round 1 exit gate)
```bash
npm run govern --summary
npm run generate-docs --summary
# If either fails, block the commit
```

## Files Changed

| File | Change |
|---|---|
| `src/generate-traceability-docs.js` | **New:** Doc generator (reads JSON, outputs markdown) |
| `src/cli.js` | Added `generate-docs` command with CLI routing |
| `package.json` | Added `"generate-docs"` npm script |
| `docs/generated/traceability-metrics.md` | **Generated:** Versioned metrics report |

## Metrics in the Report

The generated documentation includes eight sections:

1. **Entry Point Reachability** (from call-graph)
   - Command roots, runtime callables, reachable/unreachable counts
   - Reachability coverage percentage

2. **Symbol Inventory** (from source-facts index)
   - Functions, variables, parameters, classes, total

3. **Feature Coverage** (from governance report)
   - Canonical/proposed features and scenarios
   - Structural closure and runtime conformance rates

4. **Evidence Lineage** (from governance report)
   - Mechanics with canonical/proposed/ambiguous/missing lineage
   - Unresolved responsibility clusters

5. **Authority Document Status** (from governance report)
   - Document canonical/proposed/missing lineage

6. **Completeness Dimensions** (Round 1 baseline)
   - I, R, L, C, S, P dimensions with current vs. target
   - Strict traceability score formula

7. **Lineage Quality Findings** (from governance report)
   - Implementation variant counts
   - Multiple-owner and projection-gap findings

8. **Evaluation Limits** (from governance report)
   - Structural blockers and evaluation limits

## Round 1 Checkpoint

**Exit Criterion (line 226 of Roadmap):**
> "The documented runner count, mechanics total, and coverage tables are **generated** or snapshot-labeled."

**Status:** ✅ SATISFIED

- Runner count: dynamically pulled from call-graph
- Mechanics total: dynamically pulled from index
- Coverage tables: dynamically pulled from governance report
- All tables now state: "Generated [timestamp] from index [ID]"

## No More Snapshot Drift

**Before:**
```markdown
# Hardcoded in narrative
The engine has 30 CLI runners and 373 total mechanics.
```
→ Becomes stale when index updates

**After:**
```markdown
# Auto-generated from JSON
| Command roots discovered | 15 |
| Runtime callable functions | 667 |
```
→ Always current with the index

## Next Steps (Round 2+)

- **Round 2:** Call-graph extends to callback/dynamic-dispatch taxonomy
- **Round 3:** Feature and capability mappings added to metrics
- **Round 4:** Scenario execution receipts added to metrics
- **Round 5:** Make generation part of the CI gate (block commits that reduce any metric)

## Running It Yourself

```bash
# Fresh index
npm run project -- --workspace ./src --output ./source-fact-index.json

# Fresh call-graph
npm run call-graph -- --index ./source-fact-index.json

# Fresh governance report
npm run govern -- --workspace ./src --output ./source-facts-self-governance-report.json

# Generate documentation
npm run generate-docs

# View the generated report
cat docs/generated/traceability-metrics.md
```

Every run produces a new report with current metrics tied to the exact index ID.
