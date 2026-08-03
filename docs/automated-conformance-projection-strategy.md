# Automated Conformance Projection Strategy

## Goal

Reach 100% conformance in `src/console` (and every future target module) by
authoring exactly one artifact by hand — a JSON contract — and never hand
authoring a code body again. Detection, candidate scaffolding, semantic
authoring, and code-body generation should all be tool-driven, chaining this
repo's existing analytics (the source-fact query engine, the violation
detector, the candidate projector) into the external projection engine at
`C:\lab\repos\contract-driven-artifact-governance-engine` (`governed-artifacts`
CLI, package `contract-driven-artifact-governance-engine`).

This document is a strategy, not a plan of record: it names the stages, what
already exists, what has to be newly built, and the concrete schema mapping
that makes the two repos composable. It does not implement anything.

## Current state: what's actually automated today

A live scan against `src/console` (`node --test
test/conformance-violation-detector.test.js`, run 2026-08-02) currently
reports **493 forbidden-mechanic hits across all 7 target files** — branch,
iteration, exception-handling, throw, object-construction, serialization,
state-mutation, normalization, and validation mechanics embedded directly in
code bodies. `docs/PIPELINE-COMPLETE.md` records an earlier, narrower snapshot
of 16 violations against a single file; the pilot plan below should scope
against the current 493, not the earlier number.

**Genuinely automated already:**

| Stage | Tool | Status |
| --- | --- | --- |
| Detect forbidden mechanics | `executeRelationalQuery` over `bodyMechanics`/`sourceReferences`/`symbols` (used by `test/conformance-violation-detector.test.js`, now also wired as `node src/cli.js project-authority-violations`) | Live, CLI-wired |
| Scaffold candidates from violations | [`src/projects-authority-from-violations.js`](../src/projects-authority-from-violations.js), [`src/projects-authority-candidates.js`](../src/projects-authority-candidates.js) | Live, tested (`test/project-candidates-from-violations.test.js` passes) |

**Still hand-authored, despite the naming:**

| File | Lines | What it actually is |
| --- | --- | --- |
| `src/console/console-authority-bundles.mjs` | 172 | Hand-written implementation functions (`pathnameLookupAuthority`, `projectsSecurityHeaders`, etc.) |
| `src/console/serves-query-console.conformant.mjs` | 376 | Hand-written file with a comment block *asserting* "8/8 mechanics authority-bound (100%)" — never independently verified by an engine |
| `src/console/serves-query-console.projected.mjs` | 344 | Despite the filename, this is a hand-typed `.mjs` file with `try/catch` and control flow still in it — not the output of any projector |
| `src/console/serves-query-console.mjs` | 344 | The file actually imported by `src/cli.js`; still contains the violations the detector counts |

Net effect: **zero bytes in this repo are currently produced by mechanical
projection from a declared contract.** "Authority-delegated" today means
"hand-typed code that calls other hand-typed code," which is an improvement in
organization but not a change in authorship model. It doesn't get us to
"without authoring any code."

## The lever: one shared vocabulary across two repos

This repo's `AuthorityProjectorFromViolations.buildAuthorityFamilyMap()`
(mirrored in `AuthorityCandidateProjector`) already maps each detected
mechanic type to `families` and a `primaryFamily` — and those family names are
not generic labels. They are, almost verbatim, the closed-world authority
surfaces that `contract-driven-artifact-governance-engine`'s
`governed-artifact-contract.schema.json` requires per function
(`decision`, `iteration`, `failure-policy`, `projection-mapping`,
`result-contract`, `effect`). That's the seam to build on: the JSON this repo
already drafts is one deterministic transform away from being an admitted
Governed Artifact Contract.

Confirmed by reading the schema and a real example contract
(`examples/governed-message-artifact-family.contract.json`):

| Mechanic type (this repo) | Primary family | Governed Artifact Contract surface | Declared under |
| --- | --- | --- | --- |
| `branch` | `decision` | `decisionAuthority { decisionId, responsibilityId, syntaxKind, conditionExpression, occurrences, policy }` | `artifact.sourceAuthority.decisions[]` |
| `iteration` | `iteration` | `iterationAuthority { iterationId, responsibilityId, syntaxKind, controlExpression, occurrences, continuationPolicy, terminationPolicy }` | `artifact.sourceAuthority.iterations[]` |
| `exception-handling` | `failure-policy` | `failurePolicy { failurePolicyId, responsibilityId, syntaxKind: CatchClause, expression, policy }` | `artifact.sourceAuthority.failurePolicies[]` |
| `throw` | `failure-disposition` | `failurePolicy { syntaxKind: ThrowStatement, expression, policy }` | `artifact.sourceAuthority.failurePolicies[]` |
| `object-construction` | `projection-mapping` | `projectionMapping { projectionMappingId, fields: [{ outputField, sourceExpression }], purpose }` (or a `semanticEdge` invocation if it's an ambient constructor, e.g. `new Map`) | `artifact.sourceAuthority.projectionMappings[]` / `semanticEdges[]` |
| `serialization` | `serialization-profile` | `resultContract { resultContractId, resultKind, mediaType, source: { expression, sourceType, returnKind } }` | `artifact.sourceAuthority.resultContracts[]` |
| `state-mutation` | `state-transition` | `effect { effectId, operation, usedByArtifacts, authority }` | **top-level `contract.effects[]`**, not per-artifact |
| `fallback` | `missing-value-policy` | Decomposes into a `decisionAuthority` (the null/undefined check) + the two candidate `resultContract`/`projectionMapping` outcomes — no dedicated primitive | `decisions[]` + `resultContracts[]` |
| `retry` | `continuation-policy` | `iterationAuthority` with `continuationPolicy`/`terminationPolicy` carrying the retry semantics, plus a `failurePolicy` for exhaustion | `iterations[]` + `failurePolicies[]` |
| `validation` | `validation-policy` | Usually a `failurePolicy` (throws on invalid) plus, when it's real JSON Schema validation, `artifact.proof.metaSchemaValidationRequired` + `json-meta-schema-verifier.v1` | `failurePolicies[]` + `proof` |
| `normalization` | `translation` | Does **not** map cleanly to the base contract surfaces — see risk below | Ontology track (see below) |
| `meaning-hidden-in-text` | `concept` | Does **not** map to the base contract at all — it's a signal to elevate, not wire | Ontology track (see below) |

Every function also needs a `responsibilities[]` entry (module + one entry per
function) and `semanticEdges[]` binding each invocation/effect back to its
authority ID — both already implicit in what the source-fact index captures
(`symbols`, `bodyMechanics.fromSymbolId`).

## Target pipeline: seven stages

```
1. DETECT      (exists)   query tool -> forbidden-mechanic violations
2. SCAFFOLD    (exists)   violations -> candidate JSON + authorityDraft
3. AUTHOR      (new)      candidates -> fully-resolved authority JSON, automated
4. TRANSLATE   (new)      authority JSON -> governed-artifact-contract.json
5. PROJECT     (new)      contract -> code bytes, via governed-artifacts engine
6. GATE        (new)      contract + workspace -> TRUSTED / REJECTED
7. LOOP        (new)      any drift/escape patches the contract, never the file
```

Stages 1-2 need no new work — they're live today (see table above). Stages
3-7 are what closes the gap to "no hand-authored code."

### Stage 3 — Author, without hand-typing

Split by what kind of field is missing, using the `requiredHumanResolution`
flags the candidate projector already emits:

- **Structural fields** (`conditionExpression`, `syntaxKind`, `occurrences`,
  `sourceExpression`, `argumentExpressions`, `responsibilityId`) are already
  fully derivable from the source-fact index — zero authoring, pure query.
  This is what Stage 2 already does.
- **Semantic/judgment fields** (`policy` prose, `purpose`, omission policy,
  which caught errors are expected vs. should propagate) are the actual
  authoring bottleneck today (`docs/PIPELINE-COMPLETE.md` Stage 3 status:
  "AWAITING AUTHOR"). Automate the *drafting* of these with an LLM pass keyed
  off the same `dimensions` checklist already encoded per family in
  `AuthorityCandidateProjector.buildAuthorityFamilyMap()` (e.g. for `branch`:
  `condition/predicate`, `outcomes (all branches)`, `no-match behavior`,
  `result semantics per outcome`). Feed the flagged source snippet + its
  `dimensions` list to Claude, get a draft `authorityDraft` back with every
  `requiredHumanResolution` field filled in.
- **Review, don't author.** A human (or an LLM-judge pass) reviews the
  drafted JSON in a batch — accept/reject/edit — instead of hand-typing it
  from scratch. This is the actual time savings: authoring becomes reviewing.
  Anything security- or compliance-relevant (the loopback hostname guard is
  the example already in this codebase) keeps a named human accountable for
  the accept, even though they never write JSON or code by hand.

### Stage 4 — Translate (new, one-time tool)

A deterministic converter — written once, run against every module — that
takes this repo's authored `authority.json` + `violation-bindings.json` +
the source-fact index and emits one
`governed-artifact-contract.schema.json`-conformant document per target file:
artifact declaration (`relativePath`, `artifactKind: javascript-module`,
`projectorId: provenance-sealed-source-projector.v1`),
`projection.authority.authorityType: lossless-source-tokens.v1`,
`sourceAuthority.responsibilities[]` from `symbols`,
`decisions[]`/`iterations[]`/`failurePolicies[]`/`projectionMappings[]`/
`resultContracts[]` from the mapping table above, `semanticEdges[]` binding
every remaining invocation to its authority, and a `forbiddenSyntaxKinds[]`
closure list (everything the source language can express that this function
does *not* declare authority for). This is the only genuinely new production
code this strategy requires.

### Stage 5 — Project

```
governed-artifacts project --contract <module>.contract.json --workspace . --write
```

Replaces `console-authority-bundles.mjs`, `serves-query-console.conformant.mjs`,
and `serves-query-console.projected.mjs` outright. The engine's own
"body-purity" rule — enforced independently of anything in this repo — requires
the projected body to contain exactly one semantic execution invocation, one
direct result flow, and zero local decisions/iterations/failure
mechanics/DTO construction. No projector "selects content from an artifact
kind or subject identity" (per the engine's README); the contract is the only
authored input. Delete the hand-written bundle/conformant/projected files once
a module's projected output supersedes them — keeping them around would be
authoring code that the contract already governs.

For the console pilot, the repo wrapper now exposes the same handoff directly:

```text
source-facts-se project-console-contract --output ./contracts/serves-query-console.governed.contract.json --project --write
```

### Stage 6 — Gate

```
governed-artifacts gate --contract <module>.contract.json --workspace . --write-receipt
```

`gate` is the one true trust gate in the external engine: it exits non-zero
unless the terminal disposition is `TRUSTED`, and `TRUSTED` requires
`CONTRACT_AUTHORITY_CLOSED`, `ARTIFACT_SCOPE_CLOSED`, and a complete proof —
all independently re-checkable from the written receipt. This is strictly
stronger than this repo's current `conformance-violation-detector.test.js`,
which only checks that the source-fact scanner's mechanic classifier doesn't
observe a forbidden mechanic type. The engine's check is exhaustive over AST
`syntaxKind`s (`forbiddenSyntaxKinds`), not dependent on the scanner's
heuristic mechanic list, so it catches escapes the current detector structurally
cannot (e.g. a forbidden mechanic hidden inside a helper the query tool
doesn't classify the same way).

The repo wrapper can also invoke the gate directly:

```text
source-facts-se project-console-contract --output ./contracts/serves-query-console.governed.contract.json --gate
```

Recommendation: keep the existing detector as a cheap pre-flight check (it's
already fast and already wired), but make `governed-artifacts gate` the
actual merge-blocking gate once a module is migrated.

### Stage 7 — Loop on drift, never on the file

Any `DRIFTED`, `ARTIFACT_ESCAPES_CONTRACT`, or `ARTIFACT_MISSING` finding is
fixed by editing the contract JSON and re-running Stage 5 (`project --write`)
then Stage 6 (`gate`). Once Stage 5 has run once for a module, no human opens
that module's `.mjs`/`.js` file in an editor again — every future change is a
contract edit followed by reprojection.

## Redefining "100% conformance"

Today "100% conformance" is measured two different, weaker ways in this repo:

- `coverageSummary.authorityConformanceRatio` / `admissionGateStatus` in
  `src/projects-authority-candidates.js` — a candidate-coverage ratio, not a
  byte or structure check.
- The red/green count in `test/conformance-violation-detector.test.js` — a
  mechanic-classification check, not exhaustive over syntax.

Proposed replacement: adopt `governed-artifacts gate`'s terminal
`trustDisposition: TRUSTED` as the authoritative "100% conformant" bar for any
module that has been migrated through Stage 5. It's byte-exact (SHA-256 +
length per artifact), syntax-exhaustive (`forbiddenSyntaxKinds` closure), and
independently reproducible from the canonical receipt — properties neither of
the current two metrics has.

## New work this strategy actually requires

Being explicit about what doesn't exist yet, so this isn't oversold as
"just wire it up":

1. **The Stage 4 translator** — new code, written once in this repo (or as a
   small adapter package), not per-module.
2. **An LLM-authoring harness for Stage 3** — a prompt/skill that feeds a
   flagged candidate's snippet + its family's `dimensions` checklist to
   Claude and gets back a filled `authorityDraft`, plus a batch review UI/CLI
   (could be as simple as a diff-style CLI report).
3. **A dependency edge that doesn't exist yet** — `package.json` here has no
   reference to `contract-driven-artifact-governance-engine`. The two repos
   are siblings under `C:\lab\repos\`, so `"contract-driven-artifact-governance-engine":
   "file:../contract-driven-artifact-governance-engine"` follows the same
   pattern already used for `source-code-taxonomy-scanner`, `sej-runtime-query`,
   etc.
4. **A fix for a pre-existing, unrelated bug that currently blocks running
   `node src/cli.js` at all.** `src/console/console-validation-adapter.mjs:17-18`
   resolves `../contracts/console-validation.bundle.json` relative to its own
   location (`src/console/`), landing on `src/contracts/console-validation.bundle.json`
   — one directory short of the real `contracts/` at the repo root. Because
   `src/cli.js` imports `serves-query-console.mjs` (which imports this
   adapter) at module scope, **every** `node src/cli.js` invocation currently
   crashes at import time, regardless of which command is requested. This
   needs a one-line fix (either correct the relative path or move/duplicate
   the bundle file) before any of the CLI-driven automation above — including
   the `project-authority-violations` command wired earlier in this
   session — can actually run end-to-end from the CLI entrypoint.

Console pilot status: the repo wrapper now generates the governed contract and can hand it to the external engine. The remaining work is to tighten the authority JSON and reduce the remaining red findings, not to fix a CLI import crash.

## Pilot plan

1. Target `src/console/serves-query-console.mjs` first — it already has the
   most scaffolding (`contracts/serves-query-console.authority.json`,
   `.binding.json`, `.violation-bindings.json`, and
   `docs/console-authority-coverage-report.md`).
2. Run Stage 3 (automated authoring + review) against the existing candidate
   set for this module.
3. Keep `contracts/serves-query-console.governed.contract.json` synchronized
   with the Stage 4 translator output.
4. Use the repo wrapper to invoke the external engine: `source-facts-se
   project-console-contract --project --write`, then `source-facts-se
   project-console-contract --gate`. Treat anything other than `TRUSTED` as a
   contract gap, not a reason to hand-edit the projected file.
5. Delete `console-authority-bundles.mjs`, `serves-query-console.conformant.mjs`,
   and `serves-query-console.projected.mjs` once the projected file is live.
6. Generalize the Stage 4 translator across the remaining 6 files (of the 493
   currently-live violations) one module at a time.

## Open questions / risks

- **`normalization` and `meaning-hidden-in-text` don't map to the base
  contract surfaces.** The external engine has a separate track for this —
  `deterministic-ontology-authority.v1` (concepts, typed facts, finite
  classifications, total translations) — designed for exactly this shape of
  mechanic. Any candidate whose `primaryFamily` is `translation` or `concept`
  should be routed to the ontology track in Stage 4, not forced into a
  `decision`/`projectionMapping` shape it doesn't fit.
- **Automating authoring removes typing, not accountability.** Security- or
  compliance-relevant semantic fields (the loopback hostname guard is the
  concrete example already in this codebase) still need a named human to
  accept the LLM-drafted decision, even though they never hand-write the
  JSON or the code.
- **The translator (Stage 4) is unverified against the real schema's full
  validation rules** — this document confirms field shapes against the
  schema and one example contract, but the first real translator run should
  be checked with `governed-artifacts validate` before attempting `project`.
