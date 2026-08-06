# `console serve`: Operationality & Overlap Verification

**Status:** 🟢 **OPERATIONAL — resolved 2026-08-06**

The authority sources and projected runtime bundles are now versioned instead
of being hidden by the repository-wide JSON ignore rule. The console server,
route adapter, and relational query integration are covered by the portable
test suite. The investigation below is retained as the historical diagnosis.

**Investigated:** 2026-08-03
**Subject:** `node src/cli.js console serve` (query console HTTP server)
**Method:** [verify-capability-is-operational](skills/verify-capability-is-operational/SKILL.md)
**Trigger:** A working-tree reorg moved `source-facts-query-console/` into
`failed-projection-attempts/incomplete-projections/source-facts-query-console/`,
and a naive read of that destination name ("failed projection attempt")
would have led to treating live, load-bearing code as dead scaffolding.

---

## Executive summary

`console serve` is real, CLI-wired, README-documented capability — not test-only
scaffolding — and it is currently **non-functional** because the directory its
runtime depends on was relocated without updating three import paths, one of
which is broken independent of the relocation's caller. Separately, `src/console/`
already contains a second, unfinished implementation of the same routing/loopback
authorities, built to a different bundle format, that the live call graph shows
is **never invoked** — duplication debt, not a live contradiction.

Every claim below is tagged with the exact query, execution log, or line
reference that backs it, per the verification skill's evidence discipline.
One initial reading (of the loopback-bind bundle's `selectionRules`) was
**wrong** and was retracted after actually executing the code — noted
explicitly in place, not silently corrected.

| Question | Answer | Evidence |
|---|---|---|
| Is `console serve` real, wired-in capability? | Yes | `src/cli.js:388` hardcodes its asset path; README.md:207-238 documents it; `docs/skills/generate-authority-candidates-detailed-report/SKILL.md` and ~8 other docs treat it as the flagship migration subject |
| Does it run today? | No | `ERR_MODULE_NOT_FOUND`, see [§3](#3-runtime-crash) |
| Is the crash a simple caller-side path fix? | No | the adapter's own sibling-repo import is broken independent of caller, see [§4](#4-independent-path-arithmetic) |
| Do the quarantined adapters work correctly once loadable? | Yes | direct execution, see [§5](#5-execution-probe-and-one-retraction) |
| Does anything else in `src/console/` already replace them? | No — it exists but is dead code | call-graph query, see [§2](#2-call-graph-reality) |

---

## 1. Background — what `console serve` actually is

In plain terms: a human runs

```powershell
node src/cli.js console serve --index ./self-index.json --workspace ./src
```

and gets a loopback-only local webpage for running ad hoc SQL against a
`source-fact-index.json` and jumping to exact source lines. It is an
operator convenience, not infrastructure anything else in the repo calls
into — confirmed by the call-graph query in [§2](#2-call-graph-reality), which
shows exactly one caller (`cli.js#runConsoleServe`) and no other consumers.

The full call chain, as wired today:

```
cli.js#runConsoleServe
  → dynamic import("./console/serves-query-console.mjs")
    → re-exports serves-query-console.runtime.mjs   (byte-identical to
      .conformant.mjs and .projected.mjs — three names, one implementation)
      → re-exports serves-query-console.runtime.impl.mjs   (the real body)
```

---

## 2. Call-graph reality

Projected `./src` and queried its `symbols`/`relationships` tables directly
(see [Appendix: reproducible queries](#appendix-reproducible-queries)), rather
than inferring reachability from grep or comments.

| Authority | Backing bundle | Invocations in live `./src` call graph | Verdict |
|---|---|---|---|
| `classifiesRoute` | `route-dispatch.bundle.json` (quarantined) | **1** — sole call site is `runtime.impl.mjs` | **live, broken** |
| `classifiesLoopbackBind` | `loopback-bind.bundle.json` (quarantined) | **1** — sole call site is `runtime.impl.mjs` | **live, broken** |
| `projectsCspPolicy` | `query-console-csp-policy.bundle.json` (quarantined) | **1** — sole call site is `runtime.impl.mjs` | **live, broken** |
| `console-routing-adapter.mjs`'s `routesConsoleRequest` | `console-request-routing.bundle.json` | **0** | orphaned scaffold, never wired in |
| `console-validation-adapter.mjs`'s `validatesLoopbackBinding` | `console-validation.bundle.json` | **0** | orphaned scaffold, duplicates the quarantined loopback check |
| `console-validation-adapter.mjs`'s `validatesConsoleParameters` | same bundle | live (via `console-authority-runtime.mjs` delegation) | **live, working** |

`relationshipKind` matters here: rows for the orphaned symbols only ever
appear as `member-access` (re-export statements), never `invocation` — the
distinction the verification skill calls out as the load-bearing check.

**Conclusion:** no live contradiction exists today — only one routing/loopback
path actually executes — but a second, unfinished authority generation
already exists in `src/console/contracts/` and is dead weight, not a
migration target that's ready to take over.

---

## 3. Runtime crash

```
$ node --test test/console-query-server.test.js
Error [ERR_MODULE_NOT_FOUND]:
  Cannot find module 'source-facts-semantic-search-engine\source-facts-query-console\src\route-dispatch-adapter.mjs'
  imported from src/console/serves-query-console.runtime.impl.mjs
```

`runtime.impl.mjs` imports all three quarantined adapters via static
top-level `import`, so any invocation of `console serve` fails at
module-load time, before any request-handling logic runs.

---

## 4. Independent path arithmetic

The crash alone only proves the *current* import string is wrong. To rule
out "just fix the three import strings and move on," the adapters' own
internal dependency was checked independently of the crash:

```
failed-projection-attempts/incomplete-projections/source-facts-query-console/src/route-dispatch-adapter.mjs
  imports "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"

../   → .../source-facts-query-console/
../../  → .../incomplete-projections/
../../../ → .../failed-projection-attempts/     ← lands here, wrong

At the ORIGINAL root-level location (source-facts-query-console/src/...):
../   → source-facts-query-console/
../../  → <repo root>
../../../ → C:\lab\repos\      ← correct: this is where the sibling repo
                                  contract-driven-artifact-governance-engine
                                  actually lives
```

Confirmed by direct filesystem check: `C:\lab\repos\contract-driven-artifact-governance-engine\lib\semantic-execution-runtime.mjs`
exists; `<repo>\failed-projection-attempts\contract-driven-artifact-governance-engine\`
does not. **The adapters cannot load from their current nesting regardless
of who imports them** — this is not solely a caller-side fix.

---

## 5. Execution probe — and one retraction

Reading `loopback-bind.bundle.json`'s `selectionRules` in isolation looked
concerning: both the `satisfied` and `violated` obligation states appeared
to route to the same `loopback-bind-ok` result member, which read like the
security check was a no-op regardless of hostname. That reading was **wrong**,
and only executing the code — not re-reading the JSON more carefully —
surfaced the correction.

Probe (written to scratchpad, not committed):

```js
import { executeSemanticAuthority } from "file:///C:/lab/repos/contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";
import bundle from "file:///.../failed-projection-attempts/.../contracts/loopback-bind.bundle.json" with { type: "json" };

for (const hostname of ["127.0.0.1", "0.0.0.0", "evil.example.com", ""]) {
  try { console.log(hostname, "->", JSON.stringify(executeSemanticAuthority(bundle, { hostname }))); }
  catch (e) { console.log(hostname, "-> THREW", e?.disposition); }
}
```

Actual output:

```
hostname="127.0.0.1"        -> DID NOT THROW, result={"kind":"loopback-bind-result"}
hostname="0.0.0.0"          -> THREW disposition=HOSTNAME_NOT_ADMITTED
hostname="evil.example.com" -> THREW disposition=HOSTNAME_NOT_ADMITTED
hostname=""                 -> THREW disposition=LOOPBACK_BIND_REQUEST_VARIANT_UNRESOLVED
```

**The executor enforces loopback-only binding correctly.** The declarative
graph reads misleadingly on paper but behaves correctly at runtime — the
gap between "reads like a no-op" and "is a no-op" is exactly why this skill
insists on execution over inference.

---

## 6. Evidence-tagged Gherkin

```gherkin
Feature: Query console server
  A loopback-only browser UI over an already-projected source-fact-index,
  so a human can run ad hoc SQL and jump to exact source lines without
  reading the index JSON by hand.

  Background:
    Given a source-fact-index.json produced by `node src/cli.js project --workspace <dir>`

  Scenario: Operator starts the console against their own codebase
    When the operator runs `node src/cli.js console serve --index ./self-index.json --workspace ./src`
    Then cli.js#runConsoleServe dynamically imports "./console/serves-query-console.mjs"
      # evidence: §2 relationships query on cli.js#function:runConsoleServe shows
      # an `import` invocation immediately followed by `servesQueryConsole`
    And that module is a 9-line re-export of runtime.mjs, which re-exports runtime.impl.mjs
      # evidence: Read of serves-query-console.mjs/.conformant.mjs/.projected.mjs —
      # all three are byte-identical thin re-exports

  Scenario: The server refuses to bind to anything but loopback
    Given runtime.impl.mjs calls classifiesLoopbackBind({ hostname }) before doing anything else
    When the hostname is "127.0.0.1"
    Then the call passes
    When the hostname is "0.0.0.0" or "evil.example.com"
    Then the call throws disposition HOSTNAME_NOT_ADMITTED
      # evidence: §5 direct execution against the real semantic-execution-runtime —
      # not just reading the bundle's JSON, which was initially misread as a
      # no-op and had to be retracted after actually running it

  Scenario: Right now, starting the console crashes
    Given source-facts-query-console/ was moved to
      failed-projection-attempts/incomplete-projections/source-facts-query-console/
    When runtime.impl.mjs is loaded
    Then Node throws ERR_MODULE_NOT_FOUND for
      ../../source-facts-query-console/src/route-dispatch-adapter.mjs
      # evidence: §3 node --test test/console-query-server.test.js output
    And a caller-side path fix alone would still not be enough
      # evidence: §4 the adapter's own "../../../" import to
      # contract-driven-artifact-governance-engine/lib resolves one directory
      # too deep from the new nesting, independent of who imports it

  Scenario: A second, unfinished implementation already exists but nothing calls it
    Given console-routing-adapter.mjs (routesConsoleRequest) and
      console-validation-adapter.mjs's validatesLoopbackBinding use a
      different bundle format under src/console/contracts/
    When the live call graph is queried for invocations of those two symbols
    Then rowCount is 0 for both
      # evidence: §2 relationships query WHERE toSymbolCandidate IN
      # ('routesConsoleRequest','validatesLoopbackBinding') returns no invocation rows
```

---

## 7. Open decision (not resolved by this document)

This document establishes *what is true*, not *what to do about it*. Two
resolutions were identified and neither has been chosen:

1. **Restore `source-facts-query-console/` to a live top-level path** and fix
   the three broken imports plus `cli.js`'s hardcoded asset path to match.
   Leaves the orphaned `console-routing-adapter.mjs`/`validatesLoopbackBinding`
   scaffolding in place as separate future cleanup.
2. **Finish wiring the newer scaffolding instead** — make
   `console-routing-adapter.mjs` and `console-validation-adapter.mjs`'s
   `validatesLoopbackBinding` the real implementation, reconciling their
   different bundle format with what `runtime.impl.mjs` expects. This is
   real design work, not a path fix.

---

## Appendix: reproducible queries

```bash
# 1. Project the live tree
node src/cli.js project --workspace ./src --workspace-id self --output ./.tmp/self-index.json --summary

# 2. Locate every candidate symbol across implementations
node src/cli.js query --index ./.tmp/self-index.json --pretty \
  "SELECT symbolId, name, kind, modulePath FROM symbols \
   WHERE name IN ('classifiesRoute','classifiesLoopbackBind','projectsCspPolicy', \
                  'servesQueryConsole','routesConsoleRequest','validatesConsoleParameters', \
                  'validatesLoopbackBinding','runConsoleServe')"

# 3. Invocation counts — the load-bearing check (member-access != invocation)
node src/cli.js query --index ./.tmp/self-index.json --pretty \
  "SELECT relationshipKind, toSymbolCandidate FROM relationships \
   WHERE toSymbolCandidate IN ('classifiesLoopbackBind','classifiesRoute', \
                               'projectsCspPolicy','routesConsoleRequest', \
                               'validatesLoopbackBinding')"

# 4. Walk the entry point up
node src/cli.js query --index ./.tmp/self-index.json --pretty \
  "SELECT relationshipKind, toSymbolCandidate FROM relationships \
   WHERE fromSymbolId = 'cli.js#function:runConsoleServe' AND relationshipKind = 'invocation'"

# 5. Reproduce the crash
node --test test/console-query-server.test.js

# 6. Reproduce the execution probe — see §5 for the full script
```
