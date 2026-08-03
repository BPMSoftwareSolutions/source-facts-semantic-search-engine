---
name: verify-capability-is-operational
description: Use this skill when you need to decide whether a piece of code — a file, a directory that got moved/renamed/quarantined, or one of several candidate implementations of the same capability — is actually live and safe to depend on, restore, or delete, versus orphaned or broken scaffolding. Triggers on questions like "is this still used," "which implementation is the real one," "does this overlap or contradict that other file," "was this abandoned on purpose or by accident," "can we delete this," "prove this actually works," or any judgment call about quarantined/duplicated code surfaced by a repo reorg. Produces evidence and a decision table, not the architectural decision itself — that stays with the human.
---

# Verify a capability is operational (not just present)

A file existing, importing cleanly by eye, or living in a directory named
`failed-projection-attempts/` tells you nothing certain about whether it runs.
This skill replaces "read the code and guess" with three independent kinds of
evidence — structural queries against this engine's own fact index, call-graph
invocation counts, and a small probe script that actually executes the code —
so the final writeup is auditable instead of asserted.

The core discipline: **a declarative read (JSON authority bundle, docstring,
comment claiming `AUTHORITY-DELEGATED`, a directory name) is a claim, not a
proof.** Only running the code, or querying real call-graph facts extracted
from running the projector, counts as proof. This skill exists because a
naive read of one bundle's `selectionRules` in this exact investigation looked
like a security no-op — and was wrong. Executing it directly overturned that
reading in under a minute.

## When to use this

- A repo reorg moved, renamed, or "quarantined" a directory and you need to
  know whether anything still depends on it before deciding to restore,
  fix, or finish abandoning it.
- Two or more files/modules appear to implement the same responsibility
  (same function names, same feature-id in generated-code comments, same
  concept in two different bundle formats) and you need to know which one
  is real.
- You're asked to delete something and want to confirm it's actually dead
  first, not just unreferenced by grep in the one file you happened to check.
- A test is failing after a move and you want to know if it's failing
  because of the move, or because of a pre-existing, unrelated bug — before
  you "fix" it in a way that hides the real issue.

## Prerequisites

1. `source-facts-semantic-search-engine` available (this engine).
2. The repo under investigation is JS/TS (or otherwise projectable).
3. A concrete symbol name, feature name, or pair of candidate files to compare.

## Workflow overview

```
1. Enumerate every candidate implementation (Grep/Glob, including
   relocated/quarantined paths)
        ↓
2. Project the LIVE tree (not the suspect directory) to a fact index
        ↓
3. Look up every candidate symbol by name across all implementations
        ↓
4. Query invocation counts per symbol — 0 = orphaned, ≥1 = live, note the
   call site
        ↓
5. Walk the call site upward to a real entry point (CLI command, exported
   API) to confirm it's actually reachable, not called only by other
   orphaned code
        ↓
6. For anything moved/relocated: check relative-import arithmetic
   independently of any runtime error, as a second line of evidence
        ↓
7. Never trust the declarative read alone — write a probe script that
   imports and executes the suspect unit with both a passing and a
   failing input, and compare real output to what the static read implied
        ↓
8. Build a decision table: implementation | backing authority | live
   invocation count | verdict
        ↓
9. Write findings as Gherkin scenarios, every Given/When/Then tagged with
   its exact evidence (line ref, query result, or probe output)
        ↓
10. Hand the evidence + open question back — this skill stops at evidence,
    it does not choose the architecture for you
```

## Step-by-step guide

### Step 1: Enumerate every candidate implementation

Grep for the symbol/feature name across the whole repo, not just the
directory you suspect — a quarantined copy and a "replacement" scaffold
often coexist under different subtrees.

```bash
grep -rln "theSymbolOrFeatureName" --include=*.{js,mjs,ts} .
```

Note every file that defines it, every file that imports it, and every
generated-code comment (`// feature-id:`, `// responsibility-id:`) that
claims to implement the same responsibility under a different name.

### Step 2: Project the live tree, not the suspect one

Project the workspace that's actually shipped/wired-in (e.g. `./src`),
per [query-source-facts-before-reading-code](../query-source-facts-before-reading-code/SKILL.md).
This is deliberate: you want the call graph as the *live* code sees it,
not as the quarantined copy would see itself in isolation.

```bash
node src/cli.js project --workspace ./src --workspace-id self --output ./.tmp/self-index.json --summary
```

Sanity-check file/symbol/relationship counts look plausible before trusting
anything downstream.

### Step 3: Look up every candidate symbol by name

```sql
SELECT symbolId, name, kind, modulePath FROM symbols
WHERE name IN ('candidateFnA', 'candidateFnB', 'candidateFnC')
```

If a name defined in the suspect/quarantined directory doesn't show up at
all, that's your first signal it's outside the live tree's boundary —
expected if it was moved out, but confirm nothing inside the live tree
still points at it (next step).

### Step 4: Query invocation counts — this is the load-bearing step

```sql
SELECT relationshipKind, toSymbolCandidate FROM relationships
WHERE toSymbolCandidate IN ('candidateFnA', 'candidateFnB', 'candidateFnC')
```

Read the `relationshipKind` column carefully:
- `invocation` rows are real calls.
- `member-access` rows (e.g. `export const x = mod.x`) are re-exports, not
  proof anything downstream calls it.

**Zero invocation rows = orphaned code**, no matter how complete or
well-commented it looks. **≥1 invocation row = live**, and the row tells
you the one place to go read.

> **Known gap:** `relationships` has no `modulePath` column — don't join on
> it, it silently cross-joins. Filter by `sourceReferenceId` string prefix
> or scope the projection narrowly instead.

### Step 5: Walk the call site up to a real entry point

A symbol can have exactly one invocation and still be dead, if that one
caller is itself never reached. Repeat Step 4 from the caller's own
`symbolId` until you land on something you know is externally triggered
(a CLI subcommand handler, an exported public API, a route handler).

```sql
SELECT relationshipKind, toSymbolCandidate FROM relationships
WHERE fromSymbolId = 'cli.js#function:runConsoleServe' AND relationshipKind = 'invocation'
```

### Step 6: Check relative-import arithmetic independently

If the suspect code was moved, don't rely solely on the crash message.
Count `../` segments in its own imports against its *current* file depth,
by hand, and compare to what it would have resolved to at its *original*
location. This gives you a second, static line of evidence that doesn't
depend on successfully running anything — useful when the runtime error
is noisy or the dependency chain is deep.

```bash
ls "<repo-root>/<n-levels-up-from-new-location>/<expected-sibling>"
ls "<repo-root>/<n-levels-up-from-original-location>/<expected-sibling>"
```

### Step 7: Execute the suspect unit directly — do not trust the declarative read

This is the step that catches you being wrong. Declarative authority
bundles, control-flow-as-JSON, and comments describing intended behavior
are all *claims*. Write a tiny probe script, import the real runtime the
suspect code depends on, and call it with both an admitted and a rejected
input:

```js
import { executeSemanticAuthority } from "file:///<sibling-repo>/lib/semantic-execution-runtime.mjs";
import bundle from "file:///<path>/some.bundle.json" with { type: "json" };

for (const input of [validCase, invalidCase]) {
  try {
    console.log(input, "->", JSON.stringify(executeSemanticAuthority(bundle, input)));
  } catch (error) {
    console.log(input, "-> THREW", error?.disposition, error?.message);
  }
}
```

Write this to your scratchpad directory, not inside the repo. If the
executed result contradicts your reading of the bundle's declarative
rules, **the execution wins — retract the reading out loud** rather than
quietly keeping the wrong mental model.

### Step 8: Build a decision table

One row per candidate implementation:

| Implementation | Backing authority/bundle | Live invocation count | Verdict |
|---|---|---|---|
| adapter A (quarantined dir) | bundle-x.json | 1 (single call site, currently broken import) | load-bearing but broken |
| adapter B (newer scaffold) | bundle-y.json | 0 | orphaned, never wired in |

This table *is* the answer to "which one is real" — resist the urge to
recommend a fix before this table is complete.

### Step 9: Write findings as evidence-tagged Gherkin

For each Given/When/Then, cite exactly which piece of evidence backs it —
a source line, a query's `rowCount`, or a probe script's printed output.
See [generate-test-scenarios-from-source-facts](../generate-test-scenarios-from-source-facts/SKILL.md)
for the evidence-tagging convention this borrows.

```gherkin
Scenario: The server refuses to bind to anything but loopback
  Given runtime.impl.mjs calls classifiesLoopbackBind({ hostname }) first
  When the hostname is "0.0.0.0"
  Then the call throws disposition HOSTNAME_NOT_ADMITTED
    # evidence: probe script executed against the real semantic-execution-runtime,
    # not inferred from reading the bundle's selectionRules
```

### Step 10: Hand back evidence, not a decision

This skill's output is a decision table and an evidence-tagged writeup.
When multiple plausible resolutions exist (restore vs. finish the
replacement vs. something else), that is an architectural call for the
human, not something to resolve unilaterally — even when one option looks
obviously simpler. Present the table and ask.

## Common queries reference

**All symbols matching a set of candidate names:**
```sql
SELECT symbolId, name, kind, modulePath FROM symbols WHERE name IN (...)
```

**Invocation count for a set of candidate symbols:**
```sql
SELECT relationshipKind, toSymbolCandidate FROM relationships
WHERE toSymbolCandidate IN (...)
```

**What a specific entry point calls, to walk up the chain:**
```sql
SELECT relationshipKind, toSymbolCandidate FROM relationships
WHERE fromSymbolId = '<exact symbolId>' AND relationshipKind = 'invocation'
```

## Troubleshooting

- **A symbol shows 0 invocations but you're sure it's used:** you may have
  projected the wrong workspace (e.g. only `./src` when the caller lives
  outside it), or the call happens via dynamic `import()`/reflection the
  scanner can't statically resolve — check `fromSymbolResolution` on
  related rows for `unresolved` markers.
- **The probe script can't resolve a sibling-repo import:** that's often
  the finding itself (see Step 6) rather than a setup problem — confirm
  the path arithmetic before assuming your probe is broken.
- **Two bundles look like they contradict each other on paper:** confirm
  with Step 4 whether both are actually invocation-live. Two authorities
  existing is duplication debt; two authorities both *executing* on the
  same request is an actual contradiction — they are not the same finding.

## Notes on evidence & traceability

Every claim needs one of: a query `rowCount`, a probe script's printed
result, or a cited line number — not "this looks right" or "the comment
says it's delegated." If a static read and an execution disagree, the
execution is authoritative, and the write-up should say so explicitly
rather than silently using the corrected version.

## Related skills

- [query-source-facts-before-reading-code](../query-source-facts-before-reading-code/SKILL.md) —
  the underlying query mechanics this skill builds on.
- [generate-test-scenarios-from-source-facts](../generate-test-scenarios-from-source-facts/SKILL.md) —
  the evidence-tagged Gherkin convention reused in Step 9.
