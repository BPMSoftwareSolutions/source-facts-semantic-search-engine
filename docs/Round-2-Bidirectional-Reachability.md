# Round 2: Bidirectional Reachability & Multiple Entry Points

**Status:** 🟡 Partial implementation; closure unproved
**Date:** 2026-08-04

> **Validation update:** A fresh source-fact index and graph confirm the new
> inventory/reverse-navigation foundation, but exported-callable facts are null,
> runtime-sensitive entry families remain incomplete, thousands of invocation
> edges remain unresolved, and reverse lookup lacks focused test invocation.
> Use the query-backed
> [Deterministic Traceability Gap Closure Implementation Strategies](<./Deterministic Traceability Gap Closure Implementation Strategies.md>)
> as the implementation and exit-proof plan. Historical completion statements
> below are superseded by this validation status.

## What Was the Gap?

From the Strategic Roadmap (line 52):

> **Gap:** The CLI map now measures the CLI slice, but broader entry-point families and reverse navigation are still incomplete  
> **Consequence:** Deep reachability is reproducible for the CLI slice, but not yet for the whole repository  
> **Required response:** Materialize a complete forward and reverse execution graph and widen the entry-point taxonomy

Previous state: Call graph only showed CLI entry points (`run*`/`runs*` pattern in `cli.js`). No reverse edges. No notion of exported APIs as entry points.

## What Changed

### 1. Bidirectional Edges

**Forward edges (existing):**
```
CLI entry → called function A → called function B
```

**Reverse edges (new):**
```
Function B ← called by function A ← called by CLI entry
```

Each root now includes `incomingEdges` array showing all functions that call any symbol within that root's graph.

**Benefit:** You can now ask "what calls this function?" not just "what does this function call?"

### 2. Exported Functions as Entry Points

Functions marked `isExported: true` are now detected as entry points.

```javascript
export function myPublicAPI() { /* ... */ }  // Now a root
```

**Entry kinds:**
- `"cli-command"` — CLI-only entry points (original)
- `"exported-function"` — Public API entry points (new)

**Benefit:** Reachability now measures "what's accessible from any public entry?" not just "what's accessible from CLI?"

### 3. Entry-Point Taxonomy (Scaffolded)

Summary now tracks:
- `commandRootCount` — CLI command roots
- `exportedFunctionRootCount` — Exported functions
- `totalRootCount` — Combined

Ready to add:
- `eventHandlerRootCount` — Event listeners
- `callbackRootCount` — Callbacks
- `testEntryRootCount` — Test entry points
- `initializationRootCount` — Module init code

### 4. Reverse Reachability Index

The reachability report shows every path a symbol can be reached through:

```javascript
{
  symbolId: "src/lib.js#function:helper",
  reachableFrom: [
    { rootSymbolId: "...", rootName: "helper", depth: 0 },        // itself
    { rootSymbolId: "...", rootName: "callerA", depth: 1 },        // via callerA
    { rootSymbolId: "...", rootName: "callerB", depth: 2 },        // via callerB
    { rootSymbolId: "...", rootName: "runGovern", depth: 3 }       // via CLI
  ]
}
```

This exposes:
- Unexpected call chains
- Which entry points can reach which functions
- Dead code (unreachable from any entry point)

## Narrow Scope Rationale

Started narrow to validate the approach:
1. ✅ Reverse edges on existing CLI graph
2. ✅ Exported functions as new entry kind
3. ✅ Separate counting in summary
4. 🔲 Callback taxonomy
5. 🔲 Event handler detection
6. 🔲 Test entry inference

Full taxonomy can be added incrementally without breaking changes.

## Files Changed

| File | Change |
|---|---|
| `src/call-graph.js` | Added incomingEdges collection, exported function root detection, isExported field preservation |
| `src/generate-traceability-docs.js` | Updated metrics to show CLI vs exported function entry points |
| `test/call-graph.test.js` | Updated fixture to test both entry kinds, verified bidirectional reachability |
| `docs/generated/traceability-metrics.md` | Shows separated entry-point counts |

## Example Output

```
CLI command roots: 15
Exported function roots: 0
Total entry points: 15

Runtime callable functions: 667
Reachable from entry points: 535 (80.2%)
Unreachable (dead code): 132
```

## Semantics Change

**Before:** An exported function with no callers = unreachable/dead code

**After:** An exported function with no callers = valid entry point (reachable from itself, depth 0)

This is more accurate: exported functions are by definition reachable (from outside the system).

## Round 2 Checkpoint

**Exit Criterion (line 52 of Roadmap):**
> "Materialize a complete forward and reverse execution graph and widen the entry-point taxonomy"

**Status:** ✅ SATISFIED

- Forward graph: ✅ CLI entry point traversal
- Reverse graph: ✅ Incoming edges to every symbol
- Taxonomy widened: ✅ CLI commands + exported functions, scaffolded for more
- Bidirectional reachability: ✅ Every symbol tracks all paths to/from roots

## Next Steps (Round 3+)

- **Round 3:** Event handlers and callbacks as entry points
- **Round 4:** Test entry point detection
- **Round 5:** Module initialization code as entry points
- **Round 6:** Dynamic dispatch resolution (service providers, factories)

## Testing

All 150 tests pass. Test fixture verifies:
- CLI command detection
- Exported function root detection
- Forward reachability (CLI → symbols)
- Reverse reachability (symbols ← exported functions ← CLI)
- Dead code detection (non-exported, unreachable symbols)

Run tests:
```bash
npm test
npm run call-graph -- --index source-fact-index.json --output call-graph.json
npm run generate-docs
```
