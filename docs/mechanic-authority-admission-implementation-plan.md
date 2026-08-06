# Mechanic Authority Admission: Remaining Work Implementation Plan

Status: all 12 deterministic mechanic-family lowerers complete locally; reapply SQL script 023 before the next live admission

Plan date: 2026-08-05

Primary design doc: [inexpensive-transformation-loop.md](./inexpensive-transformation-loop.md)
Schema/code delivered: [`scripts/sql/023-admit-mechanic-authority.sql`](../scripts/sql/023-admit-mechanic-authority.sql)

## Kernel-only correction

Only the semantic kernel may contain executable mechanics. An authority
admission outside the kernel closes the deterministic authority-recovery phase
only. It does not legalize the source occurrence, clear its violation, or prove
transformation closure. Every admitted outside-kernel occurrence remains
`OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION` with
`RemediationDisposition = 'REPLACEMENT_REQUIRED'` until a mechanic-free
replacement is proven and a fresh source-fact index confirms the original
occurrence is absent.

## Completion evidence

Completed on 2026-08-05 against the configured
`source-facts-semantic-search-engine` Azure SQL database.

- Applied script 023 and verified the admission table, procedure, and updated
  projection views.
- Loaded repository image
  `sha256:85a5ae64aaa7f5ec9a047fb06cd4f3dad987742a88097998c5f738efbd06d130`.
- Recorded execution analysis
  `sha256:243642b781b2fbdb871a56c0e45bd144034c904ed88a983a0a3849ca1f6c7975`.
- Captured the baseline: `0` admitted mechanics and `3,084` distinct
  body/mechanic-kind backlog groups.
- Admitted the branch at `src/cli.js:1142`, mechanic occurrence
  `2be4e398311235051df5d774aed2dfb4ebbb0555bbccbc9b3a35a2b6117a55db`,
  from the persisted authority artifact under `artifacts/admissions/`.
- Verified `AUTHORITY_ADMITTED` with authority digest
  `sha256:89ac431a8e84678860ebb7639e680fd7727d1cbfe9e5eec9700349a558e2f8b7`.
- Verified the admitted count increased to `1`. The aggregate backlog remains
  `3,084` because it counts distinct body/mechanic-kind groups and this function
  has two other unadmitted branch occurrences. Its backlog row now correctly
  reports `OccurrenceCount = 2`.
- Live verification exposed and closed one read-side gap: script 023 now makes
  `projection.CurrentAuthorityCompletionBacklog` exclude admitted occurrences.
- `npm test` passes `252/252`, including workspace governance.

## Deterministic lowering extension

The branch lane was added and live-verified on 2026-08-05. On 2026-08-06 the
same hardened lane was generalized locally to all 12 configured executable
mechanic families. No LLM is used:

```text
current SQL mechanic candidate
  -> verify local source bytes against repository-image artifact digest
  -> locate the exact family-specific AST node
  -> lower its operands, policy, effects, transitions, or text vocabulary
  -> validate the closed deterministic-mechanic-authority.schema.json grammar
  -> compare expected analysis and artifact digests atomically inside SQL admission
  -> admit
```

The bounded live dry run selected 10 current branch candidates, projected 5,
and rejected 5 unsupported syntax forms without guessing. Occurrence
`5dd4cbee9ff5d8501d6c604484842de8cf9418e70d6034821d0e79fe545acc02`
at `scripts/generate-console-authority-candidates-detailed-report.mjs:122:7`
was then projected and admitted with no model call and no review-authored fields.
Its current analysis is
`sha256:361590ab782b1b8334dc1bc17b82781f3df9f683f813995a872a5ae6c3e0226b`
and its admitted authority digest is
`sha256:f5f4f45307cf7775f3c02f08e7a7b39eb916f9d8eece9e4646536e1bee73e92a`.
The same bounded batch was then run with explicit admission: 5 candidates were
projected and admitted, 5 remained fail-closed, and the current aggregate rose
to 6 admitted mechanics including the first pilot.

The production dispatcher supports `branch`, `iteration`,
`exception-handling`, `throw`, `object-construction`, `serialization`,
`normalization`, `validation`, `fallback`, `retry`, `state-mutation`, and
`meaning-hidden-in-text`. Unsupported syntax inside a supported family receives
precise rejection codes and required primitives instead of guessed authority.
Text authority is limited to exact literal/template identity when no domain
interpretation is declared. Attempts are persisted in
`observation.MechanicAuthorityLoweringAttempt` and surfaced through
`projection.CurrentMechanicAuthorityTransformationQueue`; they are scale
measurements and implementation queues, not inference prompts.

Disk JSON under `artifacts/admissions/` is optional non-authoritative inspection
evidence. New files are typed inspection wrappers and raw legacy payloads are
not admissible. SQL `authority.MechanicAuthorityAdmission` is the sole durable
admitted authority store.

The hardened script adds schema, basis, and lowerer-version testimony to new
admissions. Existing pilot rows without that testimony, and branch-v2 rows
under the former branch-only schema ID, are retained for audit but excluded
from current projections until a validated v3 payload atomically replaces them
with disposition `MECHANIC_AUTHORITY_LEGACY_REPLACED`.

## 1. What is already done

`authority.MechanicAuthorityAdmission`, `ingestion.AdmitMechanicAuthority`, and the
updated `CurrentExecutionMechanicOccurrence` / `CurrentOperationalExecutionSummary`
views exist in `scripts/sql/023-admit-mechanic-authority.sql`, with a JS wrapper
(`admitsMechanicAuthorityInSqlServer` in
[`src/sqlserver/repository-execution-knowledge.js`](../src/sqlserver/repository-execution-knowledge.js))
and a CLI command (`admit-mechanic-authority` in [`src/cli.js`](../src/cli.js)).
Two new test files cover the SQL text and the JS wrapper. `npm test` passes
246/246 locally. None of this required a live database — it's schema authoring
plus mocked-`queryRunner` unit tests, same as every other script in this repo.

What's left is not code — it's *proving the loop actually closes* against the
live `source-facts-semantic-search-engine` Azure SQL database (connection
already configured via the `source-facts-semantic-search-engine` env var), which
this session's auto-mode permission classifier blocked at the first write step
(applying DDL to a live remote database). Nothing below requires further design
work; it's a runbook.

## 2. Resolved blocker

Step 3.1 (apply script 023) was previously denied by the harness's auto-mode classifier —
not by the user — because it's a schema-changing (`CREATE TABLE`/`CREATE
PROCEDURE`) command against a live, credentialed, remote SQL Server. This is a
one-time application (the script is idempotent — `IF OBJECT_ID(...) IS NULL` /
`CREATE OR ALTER` throughout, safe to re-run).

Two ways to clear it:

- **You run it directly** from a shell where you already have DB credentials
  and permission, then tell me it's applied so I continue from step 3.2:
  ```powershell
  sqlcmd -S bpmsoftwaresolutions.database.windows.net -U cmsappaccount -d source-facts-semantic-search-engine -N `
    -i scripts\sql\023-admit-mechanic-authority.sql
  ```
  (or equivalently `node src/cli.js` has no generic "apply script" command —
  this repo's convention, per the README, is that schema scripts are applied
  directly via `sqlcmd`, not through the CLI.)
- **I retry it** in a future turn/session in case the classifier prompts you
  for approval instead of auto-denying (behavior may differ outside this
  specific auto-mode session).

Everything from step 3.2 onward is normal CLI usage against an already-deployed
schema and can proceed however that gate gets cleared.

## 3. Runbook

### 3.1 Apply the schema (completed)

```powershell
sqlcmd -S bpmsoftwaresolutions.database.windows.net -U cmsappaccount -d source-facts-semantic-search-engine -N -i scripts\sql\023-admit-mechanic-authority.sql
```

Verify: `authority.MechanicAuthorityAdmission` and `ingestion.AdmitMechanicAuthority` exist.

### 3.2 Refresh the repository image

Captures the current tracked working tree (including the new `admit-mechanic-authority`
command in `src/cli.js`) into SQL as the current repository image:

```powershell
node src/cli.js load-repository `
  --workspace . `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

### 3.3 Re-run execution analysis

```powershell
node src/cli.js analyze-execution `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary

node src/cli.js execution-knowledge `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

The second command's output is the baseline: note `Authority-admitted mechanics`
(should be `0`) and `Authority-completion backlog` before admission, to compare
against after.

### 3.4 Pick one real candidate mechanic

Query the backlog view for something concrete and easy to reason about — a
`branch` or `validation` mechanic in `src/cli.js` itself is a good pick, since
it's freshly re-scanned and easy to read:

```sql
SELECT TOP (5) RootId, ResponsibilityId, SymbolName, ArtifactId, MechanicKind, AuthorityFamily, OccurrenceCount, BacklogDisposition
FROM projection.CurrentAuthorityCompletionBacklog
WHERE RootId = 'source-facts-semantic-search-engine' AND ArtifactId = 'src/cli.js' AND MechanicKind = 'branch'
ORDER BY LeverageScore DESC;
```

Then fetch its exact candidate row (the JSON template plus what's missing):

```sql
SELECT MechanicOccurrenceId, MechanicKind, AuthorityFamily, SourceReferenceId, AuthorityData, MissingFields, ProjectionDisposition
FROM projection.ExecutionMechanicAuthority
WHERE RootId = 'source-facts-semantic-search-engine' AND MechanicOccurrenceId = '<chosen-id>';
```

### 3.5 Complete the authority JSON

> **Superseded:** Raw or hand-authored authority JSON is no longer admissible.
> Run `lower-mechanic-authority --output-dir artifacts/admissions/deterministic`
> to produce a validated `mechanic-authority-inspection-projection.v1` wrapper
> bound to the exact analysis digest, artifact digest, occurrence, and lowerer
> version. The historical instructions below describe the original pilot only.

Read the actual source at the mechanic's `SourceReferenceId`/line (via
`projection.CurrentExecutionMechanicOccurrence.StartLine`/`ArtifactId`), then
hand-author the completed JSON matching the family's shape from
`scripts/sql/010-create-mechanic-authority-query.sql` (e.g. for `branch`:
`authorityKind`, `candidateAuthorityId`, `inputs`, `rules`, `outcomes`,
`noMatchDisposition` — this time with real, non-null values instead of the
candidate template's nulls). Save it as a JSON file, e.g.
`artifacts/admissions/<mechanic-occurrence-id>.authority.json`.

Note: `schemas/execution-mechanic-authority-candidate.schema.json` validates the
*candidate* shape (it requires these fields to be `null`) — it intentionally
does not apply to admitted data. There is no separate "admitted" JSON Schema
yet (out of scope, called out in the original admission-gap plan); completion
is a manual/judgment step for now.

### 3.6 Admit it

```powershell
node src/cli.js admit-mechanic-authority `
  --root-id source-facts-semantic-search-engine `
  --mechanic-occurrence-id <chosen-id> `
  --authority-file artifacts\admissions\deterministic\<chosen-id>.authority.json `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

Expect `MECHANIC_AUTHORITY_ADMITTED` plus the analysis/authority digests. An
identical retry returns `MECHANIC_AUTHORITY_ALREADY_ADMITTED` without changing
the stored row; a different payload for the same analysis and occurrence is
rejected.

### 3.7 Prove the authority-recovery phase closed

```powershell
node src/cli.js execution-knowledge `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

`Authority-admitted mechanics` should be `1` higher than the 3.3 baseline.
`Authority-completion backlog` counts distinct body/mechanic-kind groups, so it
decreases only when the admitted occurrence was the final outstanding occurrence
in its group. Then confirm the specific row flipped:

```sql
SELECT MechanicOccurrenceId, AdmissionDisposition, AdmittedAuthorityDigest
FROM projection.CurrentExecutionMechanicOccurrence
WHERE RootId = 'source-facts-semantic-search-engine' AND MechanicOccurrenceId = '<chosen-id>';
```

`AdmissionDisposition` should read `AUTHORITY_ADMITTED` (was `CANDIDATE_NOT_ADMITTED`
before step 3.6) — this is the concrete, queryable proof that a completed
candidate can now reach admitted state, closing the gap this whole effort was
about.

## 4. Historical scope notes and current closure gap

The bullets below describe the original branch-pilot scope and are retained as
history. The 12-family deterministic admission lane now exists. Current
transformation closure instead requires all of the following:

- project a mechanic-free consumer from the admitted data counterpart;
- admit behavioral-equivalence proof;
- remove the original executable source occurrence;
- re-index and prove that occurrence is absent; and
- pass `govern --gate` or `sync-self-governance --gate` with zero
  outside-kernel executable-mechanic violations.

Authority admission by itself satisfies none of these removal obligations.

- The interactive "show missing fields, prompt for completion" agent workflow —
  admission exists as a primitive now; nothing yet drives it automatically.
- A dedicated JSON Schema for *admitted* (non-null) authority data, distinct
  from the existing candidate schema.
- Responsibility-level `AUTHORITY_SLICE_CLOSED` readiness (requires every
  mechanic in a responsibility admitted, not just one) — one admission proves
  the mechanism works; closing a whole responsibility is a larger, separate
  effort of repeated 3.4–3.6 passes.

## 5. Safety notes

Everything in `scripts/sql/023` is additive: a new table, a new procedure, and
two views redefined via `CREATE OR ALTER` to add a `LEFT JOIN` and swap two
hardcoded literals for real lookups. No existing table is altered, no existing
row is mutated, and every downstream view that reads `AdmissionDisposition`
picks up real values automatically without being touched. Re-running the whole
script is safe (idempotent `IF OBJECT_ID(...) IS NULL` guards throughout).
