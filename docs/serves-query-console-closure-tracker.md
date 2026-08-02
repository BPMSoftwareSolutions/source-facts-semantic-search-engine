# `src/console/serves-query-console.js` — Executable Mechanic Closure Tracker

Target-state design (the full 7-authority decomposition this file is migrating toward): [serves-query-console-closure-strategy.md](serves-query-console-closure-strategy.md). This tracker is the empirical log of what's actually been validated and wired in against that design — the strategy doc's JSON sketches are aspirational until a row below says otherwise.

Source of truth: `fact.ExecutableMechanic` in the loaded Azure SQL database, filtered to `ModulePath = 'console/serves-query-console.js'`. Every `project` + `load-sqlserver` pass gets its own `IndexId` (content-derived, nothing overwritten), so before/after snapshots for a migration stay queryable side by side:

- Pre-migration (93 mechanics, whole file, unmigrated): `sha256:014f4734576f7040a9696fc7dff528ba86c47ef772a39f7bc2a64ed53aa6d566`
- Post route-dispatch migration: `sha256:c8df85e20586c786df0ef345e795b3ae1627a53a08b6cc8f1d62e028bfb3eacc`

Regenerate with:

```sql
SELECT m.MechanicKind, r.StartLine, s.Name AS EnclosingSymbol, m.EvidenceKind
FROM fact.ExecutableMechanic m
JOIN source.SourceReference r ON r.SourceReferenceKey = m.SourceReferenceKey
LEFT JOIN source.Symbol s ON s.SymbolKey = m.FromSymbolKey
WHERE m.IndexId = 'sha256:014f4734576f7040a9696fc7dff528ba86c47ef772a39f7bc2a64ed53aa6d566'
  AND m.ModulePath = 'console/serves-query-console.js'
ORDER BY r.StartLine;
```

Goal: every mechanic below moves from an authored body to declared ontology data, executed by `executeSemanticAuthority` (reused from `contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs`). A row is **Closed** only once a bundle + adapter replace the authored code and the adapter's output is verified equivalent to the original for the same inputs.

Forbidden mechanic kinds (the full closure target — same taxonomy as `fact.ExecutableMechanic.MechanicKind`):
`branch`, `iteration`, `exception-handling`, `throw`, `object-construction`, `serialization`, `normalization`, `validation`, `fallback`, `retry`, `state-mutation`, `meaning-hidden-in-text`.

## Status vocabulary

Progress is tracked per **mechanic or coherent mechanic cluster**, not per function. A function closes incrementally; partial closure is expected, not a failure state.

- `CLOSED` — mechanic(s) fully replaced by a projected semantic authority + adapter, equivalence-proven.
- `READY_TO_CLOSE` — fits an already-admitted runtime primitive; not yet authored.
- `PARTIALLY_CLOSED` — some mechanics in the function/cluster moved; residual mechanics remain, isolated in a mechanical adapter seam.
- `RUNTIME_PRIMITIVE_GAP` — genuinely needs a primitive the runtime doesn't admit today. Program disposition: **CONTINUE** — this never blocks other work. Revisit only once the same gap recurs across multiple independent migrations (see [governance-migration-log.md](governance-migration-log.md) once it exists).
- `MECHANICAL_ADAPTER_REQUIRED` — effect-bearing (I/O); needs a declared port (authority owns policy, adapter owns mechanics), not a pure primitive.
- `NOT_YET_ANALYZED` — not evaluated yet.

## Summary

| Function | Mechanic count | Has effects (I/O)? | Status |
| --- | ---: | --- | --- |
| `buildsConsoleCsp` | not in original 93-baseline (see migration log #5) | No — pure, no input | `CLOSED` — `source-facts-query-console/contracts/query-console-csp-policy.authority.json` → `.bundle.json` + `src/csp-policy-adapter.mjs` |
| `isSameOrDescendant` | 1 | No — pure | `RUNTIME_PRIMITIVE_GAP` (case-fold + prefix-test not in the admitted primitive set) — impact: local only, does not block the program |
| `writesJson` | 2 | Yes — mutates `response` | `MECHANICAL_ADAPTER_REQUIRED` |
| `methodNotAllowed` | 2 | Yes — mutates `response` | `MECHANICAL_ADAPTER_REQUIRED` (its policy — "what does this route admit" — is now emitted by the route-classification authority below; only the actual header/status write remains adapter-side) |
| `readsJsonBody` | 10 | Yes — Promise executor over request stream events | `NOT_YET_ANALYZED` |
| `servesQueryConsole` | 11 | Yes — process/server bootstrap | `NOT_YET_ANALYZED` |
| `writesSnippetResponse` | 16 | Yes — filesystem + response | `NOT_YET_ANALYZED` |
| `handlesRequest` | 35 | Yes — HTTP route dispatch | `PARTIALLY_CLOSED` — see below |
| **Total** | **93** | | |

### `handlesRequest` mechanic-cluster breakdown

| Cluster | Status |
| --- | --- |
| Route classification (pathname + method → dispatch disposition) | `CLOSED` — `source-facts-query-console/contracts/route-dispatch.authority.json` (projected to `route-dispatch.bundle.json`) + `source-facts-query-console/src/route-dispatch-adapter.mjs` |
| 404-vs-405 status selection on rejection | `MECHANICAL_ADAPTER_REQUIRED` — small, named, isolated (`knownPathnameAllow` lookup in `serves-query-console.js`); intentionally not folded into the authority because HTTP status selection is response-shaping, not part of "which capability does this request address" |
| Per-route response bodies (`writesJson`, `writesSnippetResponse`, streaming) | `NOT_YET_ANALYZED` |

**Measured reduction** (`fact.ExecutableMechanic`, `handlesRequest`, before `sha256:014f...` vs after `sha256:c8df...`):

| Mechanic kind | Before | After | Δ |
| --- | ---: | ---: | ---: |
| `branch` | 9 | 3 | **−6** |
| `exception-handling` | 4 | 6 | +2 |
| `state-mutation` | 5 | 6 | +1 |
| `throw` | 0 | 1 | +1 |
| `fallback` | 14 | 14 | 0 |
| `object-construction` | 2 | 2 | 0 |
| `serialization` | 2 | 2 | 0 |
| **Total** | **36** | **34** | **−2** |

Authored decision logic (`branch`) dropped two-thirds. Total count barely moved because the residual rejection-handling seam (catch the declared disposition, translate to 404/405) adds its own small `exception-handling`/`throw`/`state-mutation` — isolated and named, not hidden, per the operating rule below.

## Operating rule (per-mechanic, not per-function)

```text
Can this mechanic move today?
    yes → move it, reproject, prove equivalence, measure, repeat
    no  → tag RUNTIME_PRIMITIVE_GAP or MECHANICAL_ADAPTER_REQUIRED, continue with the next mechanic
```

A function closes incrementally. Do not block the whole program on one unsupported mechanic in one function. Do not extend the shared runtime kernel from a single isolated case — wait for the same residual shape to recur across multiple independent migrations first.

## Detail by function

### `isSameOrDescendant` — `RUNTIME_PRIMITIVE_GAP`, program disposition `CONTINUE`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 234 | fallback | binary-operation |

Note: the function also contains two ternary case-fold expressions (`process.platform === "win32" ? ... : ...`) that the engine's current control-flow projector does not classify as `branch` facts (ternary conditional expressions aren't yet detected the same way `if` statements are) — a real gap in `src/project.js`'s own coverage, noted here rather than silently treated as "nothing to close."

### `writesJson`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 215 | serialization | invocation |
| 216 | state-mutation | binary-operation |

### `methodNotAllowed`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 209 | state-mutation | binary-operation |
| 211 | serialization | invocation |

### `readsJsonBody`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 180 | object-construction | object-construction |
| 184 | state-mutation | binary-operation |
| 185 | branch | condition |
| 186 | object-construction | object-construction |
| 187 | state-mutation | binary-operation |
| 195 | branch | condition |
| 196 | exception-handling | exception-boundary |
| 198 | exception-handling | catch-boundary |
| 199 | object-construction | object-construction |
| 200 | state-mutation | binary-operation |

### `servesQueryConsole`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 32 | object-construction, throw, branch | object-construction, throw, condition |
| 33 | object-construction, throw, fallback, branch | object-construction, throw, binary-operation, condition |
| 34 | fallback, branch | binary-operation, condition |
| 35 | object-construction, throw | object-construction, throw |
| 44 | branch | condition |
| 45 | state-mutation | binary-operation |
| 46 | serialization | invocation |
| 51 | object-construction | object-construction |
| 59 | branch, fallback | condition, binary-operation |
| 61 | object-construction, throw | object-construction, throw |
| 70 | object-construction | object-construction |

### `writesSnippetResponse`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 138–141 | fallback ×5 | binary-operation |
| 143 | branch | condition |
| 146 | branch, fallback ×3 | condition, binary-operation |
| 149 | branch, fallback ×2 | condition, binary-operation |
| 154 | branch | condition |
| 158 | branch, fallback | condition, binary-operation |
| 162 | branch, fallback | condition, binary-operation |
| 167 | branch | condition |
| 173 | iteration, state-mutation | loop, binary-operation |
| 174 | fallback | binary-operation |

### `handlesRequest`

| Line | Mechanic | Evidence |
| ---: | --- | --- |
| 77 | exception-handling | exception-boundary |
| 78 | fallback, state-mutation, object-construction | binary-operation, binary-operation, object-construction |
| 79 | exception-handling | catch-boundary |
| 80 | state-mutation | binary-operation |
| 81 | serialization | invocation |
| 84 | object-construction, fallback | object-construction, binary-operation |
| 86 | fallback, branch | binary-operation, condition |
| 87 | branch | condition |
| 88 | state-mutation | binary-operation |
| 95–96 | branch ×2 | condition |
| 98–109 | fallback ×8 | binary-operation |
| 114–115 | branch ×2 | condition |
| 117 | exception-handling | exception-boundary |
| 118 | state-mutation | binary-operation |
| 119 | exception-handling | catch-boundary |
| 120 | fallback | binary-operation |
| 123 | branch | condition |
| 128–129 | branch ×2 | condition |
| 133 | state-mutation | binary-operation |
| 134 | serialization | invocation |

## Migration log

| # | Mechanic cluster | Result |
| --- | --- | --- |
| 1 | `isSameOrDescendant` (case-fold + prefix-test) | `RUNTIME_PRIMITIVE_GAP` — no admitted primitive for string case-folding or substring testing over an unbounded domain. |
| 2 | `handlesRequest` route classification (pathname + method → dispatch disposition) | **CLOSED.** Multi-observation `classify-observations.v1` over 9 admitted `(pathname, method)` pairs, `noMatchDisposition: ROUTE_OR_METHOD_NOT_ADMITTED`. `branch` count in `handlesRequest`: 9 → 3. Proven in `test/route-dispatch-adapter.test.js` + `test/console-query-server.test.js`. |
| 3 | `servesQueryConsole` hostname admission (must be `127.0.0.1`) | **CLOSED.** `contracts/loopback-bind.authority.json` → `.bundle.json` + `src/loopback-bind-adapter.mjs`. Finite-value classification, `unmatchedDisposition: HOSTNAME_NOT_ADMITTED`; adapter re-throws the pre-existing error text so the observable contract is unchanged. Proven by the existing `test/console-query-server.test.js` loopback-only assertion. |
| 4 | `readsJsonBody` size-limit check (`receivedBytes > maxRequestBodyBytes`) | `RUNTIME_PRIMITIVE_GAP` — attempted via `compare-bounded.v1`; the runtime rejected it with `ONTOLOGY_ARITHMETIC_OPERAND_UNBOUNDED`. Declaration kept at `contracts/body-size-limit.authority.json` as a negative-result record; no `.bundle.json` was produced (it doesn't validate). |
| 5 | `buildsConsoleCsp` (CSP directive catalog + join) | **CLOSED.** `source-facts-query-console/contracts/query-console-csp-policy.authority.json` → `.bundle.json` + `src/csp-policy-adapter.mjs`. The function takes no input and always returns the same header string, so there's no join/computation to represent at runtime (the ontology bundle schema has no string-concatenation primitive anyway — `admittedPrimitives` in `semantic-execution-bundle.schema.json` tops out at `translate-value.v1`/`project-value.v1`, no join). The fully-serialized CSP string is declared as one `fact` (`csp-header-value-fact`) and projected into the result via a same-concept passthrough `transformation`; a trivial always-satisfied obligation over the input-variant classification drives result selection (same two-rule "satisfied and violated both resolve to the one result" shape as `loopback-bind`). Zero validation findings on first attempt; adapter output diffed byte-for-byte equal to the original `.join("; ")` string before wiring in. Full residual mechanics: none — this is a full closure, not partial. Not present in the original 93-mechanic SQL baseline (`buildsConsoleCsp` wasn't separately surveyed there), so no before/after mechanic-count delta is claimed; `npm test` (65 tests, 64 pass / 1 skipped-by-design) is the equivalence proof for this entry. |

**Precise shape of the arithmetic gap** (`lib/semantic-execution-runtime.mjs:855-871`, `boundedIntegerConceptRange`): an arithmetic operand's schema must be `type: "integer"` with explicit `minimum`/`maximum`, and `maximum − minimum + 1 ≤ 64` (`SEMANTIC_RUNTIME_PROFILE.limits.maxOperandDomainSize`). `compare-bounded.v1`/`add-bounded.v1`/`subtract-bounded.v1` are built for small enumerable domains (dungeon grid coordinates, 0-63), not realistic magnitudes like a 65,536-byte request-size ceiling or arbitrary source-file line numbers. This also rules out `writesSnippetResponse`'s `startLine`/`endLine`/span bounds checks for the same reason — not attempted separately, since the gap is now already diagnosed.

**Recurring gap shape across attempts 1 and 4**: both are "the runtime's finite/small-domain closure guarantee doesn't scale to realistic real-world magnitudes" — unbounded strings in one case, numeric domains over 64 values in the other. Two occurrences. Per the operating rule, this is *watched*, not yet acted on — extending the kernel needs more independent recurrences than this, not a decision from two data points.

Remaining candidates still to survey: `writesJson`/`methodNotAllowed` (assessed — pure effect writers, no decision content left to move), `readsJsonBody`'s JSON-parse-failure branch (needs real string parsing, same string-domain gap as #1), `servesQueryConsole`'s `index`/`consoleAssetPath` presence checks (whole-object type validation, out of scope for finite-value classification without a much larger schema).

## Artifact layout

Mirrors `contract-driven-artifact-governance-engine/procedural-dungeon-webpage/`:

```text
source-facts-query-console/
├── contracts/
│   ├── route-dispatch.authority.json          (hand-authored declaration)
│   ├── route-dispatch.bundle.json              (projected, digested, executable)
│   ├── loopback-bind.authority.json
│   ├── loopback-bind.bundle.json
│   ├── query-console-csp-policy.authority.json
│   └── query-console-csp-policy.bundle.json
└── src/
    ├── route-dispatch-adapter.mjs
    ├── loopback-bind-adapter.mjs
    └── csp-policy-adapter.mjs
```

Runtime dependency: `contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs`, imported today via a relative sibling-repo path (`../../../contract-driven-artifact-governance-engine/lib/...`) rather than a package dependency, since that module isn't in the engine's published `exports` map yet. Fine for this local pilot; revisit if/when this crosses into a real package boundary.
