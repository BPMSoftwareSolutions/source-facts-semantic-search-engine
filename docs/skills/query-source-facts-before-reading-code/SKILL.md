---
name: query-source-facts-before-reading-code
description: Use this skill whenever you're about to investigate an unfamiliar or large codebase (or a specific file/function in one) to answer questions like "what does this function call," "where exactly does mechanic X occur," or "which files/functions are the hot spots for kind Y" — before reaching for Grep or reading whole files by hand. Applies to any workspace this engine can project (JS/TS), including this repo's own dependencies. Triggers on: "find where," "exact remediation location," "what calls this," "how big is this file," "where is X handled," or any question about code structure/mechanics that could be answered by structured facts instead of manual reading.
---

# Query source facts before reading code

This engine (`source-facts-semantic-search-engine`) turns a workspace into structured,
queryable facts — symbols, call/reference relationships, and per-mechanic body facts
(`branch`, `fallback`, `object-construction`, etc.) with exact `startLine`/`startColumn`.
For "where exactly is X" or "what does Y call" questions, querying these facts is faster
and more precise than Grep + manual reading, and it scales to files too large to read
in one pass.

## When to use this

- Investigating an unfamiliar file or dependency (including a sibling/vendored repo) before
  proposing a change.
- Locating the *exact* line/column of a specific decision (a branch, a fallback, a specific
  mechanic kind) rather than eyeballing line numbers from a manual read.
- Getting an aggregate view of a directory or repo (mechanic-kind counts per file) to find
  where the real complexity/risk is concentrated, before deciding what to migrate/refactor/fix.
- Tracing a call graph (what does function `foo` invoke) without opening the file, when you
  only need the shape of the calls, not the full implementation.

Don't use this for questions that need the actual source text/logic of a line — the facts
give you structural shape and exact coordinates, not the code itself. Follow up with a
targeted `Read` (or `GET /api/snippet` via the query console) once you know the exact
line to look at.

## Steps

### 1. Project the target workspace to a fact index

Scope the projection as narrowly as the question allows — a single file takes ~2s, a
~40-file directory ~6-7s, don't project an entire monorepo if you only care about one
subdirectory.

```bash
node src/cli.js project --workspace <path-to-dir-or-file's-dir> --output <abs-path>/index.json --summary
```

The command prints file/symbol/relationship counts — sanity-check these look plausible
(non-zero, roughly matching expected file count) before querying.

**The index is a point-in-time snapshot.** If the target code changed since you last
projected it (including your own edits this session), re-run `project` before trusting
query results against current code.

### 2. Find the symbol(s) you care about

```sql
SELECT symbolId, name, kind, modulePath FROM symbols WHERE name IN ('funcA', 'funcB')
```

`symbolId` has the shape `<modulePath>#<kind>:<name>` (e.g.
`governed-artifact-engine.mjs#function:projectArtifactFamily`) — you'll need the exact
string for step 3.

### 3. Trace what a function calls, without opening the file

```sql
SELECT relationshipKind, toSymbolCandidate
FROM relationships
WHERE fromSymbolId = '<exact symbolId from step 2>' AND relationshipKind = 'invocation'
```

This returns every call the function makes (`toSymbolCandidate` is the callee name/expression
as written, e.g. `knownProjectors.get`, `Array.isArray`). Chase interesting names by repeating
step 2/3 on them to walk a call graph several hops deep in seconds, instead of reading each
function body in full.

**Known gap:** `relationships` has no `modulePath` column. Don't add `WHERE r.modulePath = ...`
to a join — it silently falls through to a full cross-join and can hang. Scope by projecting
only the target directory (step 1) instead, or filter by `sourceReferenceId` string prefix.

### 4. Pinpoint the exact location of a specific mechanic

```sql
SELECT bm.mechanic, sr.startLine, sr.startColumn, bm.evidenceKind
FROM bodyMechanics bm
JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId
WHERE bm.modulePath = '<file>' AND bm.mechanic = '<kind>'
ORDER BY sr.startLine
```

`bodyMechanics.sourceReferenceId` alone is an opaque `file:offset:length` string — it is
**not** a line number. Always join to `sourceReferences` to get real `startLine`/`startColumn`.
Mechanic kinds are the taxonomy in `fact.ExecutableMechanic.MechanicKind`: `branch`, `iteration`,
`exception-handling`, `throw`, `object-construction`, `serialization`, `normalization`,
`validation`, `fallback`, `retry`, `state-mutation`, `meaning-hidden-in-text`.

### 5. Get an aggregate view before deciding scope

```sql
SELECT modulePath, mechanic, COUNT(*) AS n
FROM bodyMechanics
GROUP BY modulePath, mechanic
ORDER BY n DESC
```

Surfaces the highest-count file/mechanic combinations across a whole projected tree in a
few seconds — useful for finding the next migration/refactor candidate instead of guessing.

## Windows/Bash path gotcha

If running the CLI through the Bash tool, `--output /tmp/foo.json` and reading it back
with a plain `node -e "...readFileSync('/tmp/foo.json')..."` can resolve to two *different*
directories (MSYS `/tmp` vs. Windows `C:\Users\<you>\...\Temp`). Either read back the file
using the exact absolute path the CLI printed on success, or write outputs to this session's
scratchpad directory instead of `/tmp`.

## Worked example

See the investigation that produced this skill: projecting
`contract-driven-artifact-governance-engine/lib` (5 files) and querying it resolved, in
under two minutes, whether that repo's `governed-artifact-engine.mjs` and
`semantic-execution-runtime.mjs` were "two competing projectors" — a question that would
otherwise have required reading a 9,473-line file by hand. The answer (one pipeline, not
two) came from three symbol lookups and three `relationships`/`invocation` queries.
