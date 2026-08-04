# Deterministic Traceability Gap Closure Implementation Strategies

**Status:** Implementation-ready; both gap closures remain unproved

**Prepared:** 2026-08-04

**Repository revision:** `0ab7c9d`
**Subject:** The two closure claims in the [Feature and Capability Traceability Strategic Roadmap](<./Feature and Capability Traceability Strategic Roadmap.md>)

## Purpose

This document turns the current conversation and repository evidence into two deterministic implementation strategies:

1. close automated, evidence-bound documentation generation; and
2. close repository-wide forward and reverse reachability for the declared Round 2 scope.

The strategy is not a prose-only recommendation. Every current-state claim is bound to one of:

- a SourceFacts relational-query receipt over a named index;
- a hash-bound generated artifact assertion; or
- a recorded tool failure that must be removed before closure.

Every implementation task has an impact surface, an ordered change, a verification query, and a zero-ambiguity exit condition. A passing general test suite is supporting evidence, not a substitute for the exit queries.

## Closure evidence contract

A gap may be marked closed only when one closure receipt binds all of the following:

| Required identity | Rule |
|---|---|
| Repository revision | One exact commit; a dirty worktree is rejected for a release closure receipt |
| Source index | One `indexId` and `scanId` for the declared executable-code boundary |
| Contract index | One `indexId` and `scanId` for the declared contract boundary |
| Call graph | Its `indexId` must equal the source index ID |
| Governance report | Its bound index, subject scope, and revision must match the documentation request |
| Query catalog | One catalog version and content hash |
| Query receipts | Query text, input hash, result hash, row count, and disposition for every required query |
| Generated documentation | Content hash derived from the bound artifacts and receipts |
| Verification | Every required exit query returns its declared result shape and expected value |

No generator may replace a missing property with `unknown` or `0` for a required metric. Missing, stale, incompatible, or unqueryable evidence must fail with a typed disposition.

## Evidence baseline

The evidence was regenerated during this validation. Temporary evidence paths are intentionally excluded from the closure identity; the IDs and hashes below are the stable bindings.

| Evidence plane | Boundary | Index or artifact identity |
|---|---|---|
| Executable source facts | `src/` | index `sha256:495c69b24dd6eb6f6c1127840c14d4565f05864b238c796c7bbcfd3c03cd4997`; scan `3b2e71803eee88a085969f8a15f4a45ceb2654e875e97edf0670a0939acebcaa` |
| Contract facts | `contracts/` | index `sha256:9e6f5214f4a06720f0981161500d81cef670541c5b586a3d1db8a31c20a44455`; scan `d87ae2a9819beca39b5658637f75146300e36dacaf3ddbbedf27198b142c432b` |
| Test facts | `test/` | index `sha256:9d72fda4714d7e158c6a73b4e9326b0e1b8076a25b5040e6803fd38476effc06`; scan `878f37f2c209729c5e8c66eca92c8049162f9c707ee4b54add0f15eebf516782` |
| Fresh call graph | Fresh executable source index | graph index `sha256:495c69b24dd6eb6f6c1127840c14d4565f05864b238c796c7bbcfd3c03cd4997`; file hash `sha256:2091099ba7aa3aada5f8a2ab5a4f5871bd6ab158fb3797167bb05d7498bbe1e7` |
| Checked-in governance report | Historical source scan | bound index `sha256:5f711aa0fbe2f2115f97c5102d9a9606116c685142dce12c8d1f4edbbd08af80`; file hash `sha256:1eb4f4cc286072b23054fb9429cebb2fba7fe41141212bff87600aaa990b9366` |

The checked-in governance report is deliberately not treated as current for the fresh source index. Its values are useful for proving the generator's schema mismatch, but its different index identity prevents it from participating in a valid closure receipt.

### Evidence-plane failures discovered by execution

| Failure | Actual result | Required implementation consequence |
|---|---|---|
| Project repository root as one index | Node reached the heap limit near 4 GB and produced no usable index | Keep explicit source/contract/test boundaries, or implement a streaming/batched repository projection before claiming one repository-wide index |
| Project the 4.9 MB governance report as document facts | `RangeError: Maximum call stack size exceeded` at `documents.push(...projected.facts)` | Replace spread insertion with bounded iteration/streaming and add a large-document fixture |
| Project a fresh call-graph JSON as document facts | The same call-stack overflow | Make graph artifacts queryable without expanding a large fact array on the JavaScript call stack |
| Pass `--report` and `--graph` to `generate-docs` | The CLI parser ignores both options and silently uses default files | Admit both flags in `parseArgs`; reject unknown options instead of treating them as booleans |

These are closure blockers, not incidental tooling notes. Documentation cannot be fully query-driven while the evidence artifacts themselves cannot be safely projected or selected.

## Current query evidence register

All queries below completed with `RELATIONAL_QUERY_EXECUTED`. Full query text is in the reproduction appendix.

| ID | Evidence question | Input/result hashes | Rows | Deterministic finding |
|---|---|---|---:|---|
| `G1` | Which functions implement traceability generation? | input `095fb964...`; result `2db4beab...` | 3 | `generatesTraceabilityDocs`, `countSymbolsByKind`, and `calculateRate` are the complete function impact surface in `generate-traceability-docs.js` |
| `G2` | Which report properties does the generator read? | input `b7be3afb...`; result `68e49608...` | 52 | Reads include obsolete flat names such as `canonicalFeatureCount`, `canonicalScenarioCount`, `unlinkedMechanicsCount`, and top-level `indexId`/`manifest` |
| `G3` | What executable code calls the generator? | input `27ff0c43...`; result `34aab79b...` | 1 | The sole caller is `cli.js#function:runGenerateDocs` |
| `G4` | Do tests invoke the generator? | input `8bc9d639...`; result `ef3c66ce...` | 0 | No test invokes `generatesTraceabilityDocs` |
| `R1` | Which graph functions implement the affected path? | input `b0c38a6e...`; result `0f864fde...` | 9 | The graph inventory, reachability, classification, reverse lookup, and resolution functions are all source-addressable |
| `R2` | Does the top-level graph projection call the inventory stages? | input `044b0465...`; result `08383e30...` | 5 | It calls root graph, entry inventory, entry reachability, callable inventory, and summary exactly once each |
| `R3` | Which public graph behaviors do tests invoke? | input `e6271389...`; result `956a39d2...` | 1 | Tests invoke `projectsCliEntryPointCallGraph`; they do not invoke `findsAffectedEntryPoints` |
| `R4` | Does the source index carry exported-callable facts? | input `45f4ffe0...`; result `0022108e...` | 1 | All 692 callable rows have `isExported = null` |
| `C1` | Where does the report contract place identity and summaries? | input `ec1b411f...`; result `a2b9460f...` | 4 | Identity is nested under `index`; scenario and feature measurements are nested under their respective `summary` objects |

### Selected real query results

`G2` returned the following implementation-relevant property evidence:

| Property candidate | Observed accesses |
|---|---:|
| `scenarioConformance` | 12 |
| `canonicalScenarioCount` | 5 |
| `evidence` | 8 |
| `authority` | 3 |
| `indexId` | 2 |
| `manifest` | 2 |
| `featureCoverage` | 2 |
| `unlinkedMechanicsCount` | 2 |
| `scanId` | 1 |
| `canonicalFeatureCount` | 1 |

`C1` returned these contract pointers:

| Contract pointer | Source reference |
|---|---|
| `/properties/index/properties/indexId` | `source-facts-self-governance-report.schema.v1.json:2493:30` |
| `/properties/index/properties/scanId` | `source-facts-self-governance-report.schema.v1.json:2543:30` |
| `/properties/scenarioConformance/properties/summary` | `source-facts-self-governance-report.schema.v1.json:5235:20` |
| `/properties/featureCoverage/properties/summary` | `source-facts-self-governance-report.schema.v1.json:5682:20` |

This is query-backed proof of the generator/contract mismatch. The implementation reads top-level identity and flat summary fields while the contract declares nested identity and summary objects.

## Strategy 1: deterministic documentation generation

### Current disposition

**`IMPLEMENTATION_REQUIRED`**. The gap is not closed.

A fresh generator execution against current defaults emitted:

| Metric | Generated value | Actual checked-in governance-report value |
|---|---:|---:|
| Report index ID | `unknown` | `sha256:5f711aa0...` |
| Report scan ID | `unknown` | `49c9632b...` |
| Canonical features | 0 | 4 |
| Canonical scenarios | 0 | 6 |
| Mechanics without scenario lineage | 0 | 5,154 |

The actual values above are hash-bound artifact assertions, not relational-query receipts, because large-artifact projection currently fails. Strategy task `D1` removes that limitation before closure.

### Required implementation order

#### D1. Make generated evidence queryable

**Impact:** `src/project.js`, JSON document projection tests, query fixtures.

1. Replace `documents.push(...projected.facts)` with bounded iteration or a streaming sink.
2. Add fixtures larger than the current governance report and call graph.
3. Prove that projection completes without heap or call-stack failure.
4. Prove repeated projections produce the same `indexId`.

**Exit query:** Query the projected governance report for `/index/indexId` and the projected graph for `/indexId`.

**Exit condition:** Both queries execute; each returns exactly one non-null row; repeated runs have identical result hashes.

#### D2. Define a metric catalog contract

**Impact:** new `contracts/traceability-metric-catalog.schema.v1.json` and admitted catalog instance.

Each metric must declare:

- stable `metricId` and version;
- source artifact kind and schema version;
- exact JSON pointer or registered query ID;
- numerator, denominator, and zero-denominator policy where applicable;
- result type and formatting rule;
- required artifact identities and allowed scope relationship;
- factual/derived/interpretive claim type;
- failure disposition when evidence is absent or incompatible.

Do not encode report property paths in Markdown template expressions. The catalog is the authority that maps a metric to evidence.

**Exit query:** Select every required roadmap metric from the catalog and left join its latest query receipt.

**Exit condition:** Missing receipt count, duplicate metric ID count, untyped claim count, and invalid pointer count are all zero.

#### D3. Validate every input before rendering

**Impact:** `src/generate-traceability-docs.js`, report/graph validators, new call-graph schema.

1. Validate the source index, governance report, graph, metric catalog, and query receipts against schemas.
2. Require graph `indexId === source index.indexId`.
3. Require governance subject scope to be compatible with the requested report scope.
4. Require revision identity for release closure generation.
5. Reject `unknown`, null, or fallback zero for every required metric.
6. Emit typed failures such as `ARTIFACT_INDEX_MISMATCH`, `METRIC_POINTER_NOT_FOUND`, and `QUERY_RECEIPT_STALE`.

**Exit condition:** Every negative fixture fails with its declared disposition; no invalid fixture writes output.

#### D4. Replace handwritten field reads with query receipts

**Impact:** `src/generate-traceability-docs.js`, `src/query.js`, registered query catalog.

1. Add query sources for governance-report facts, graph entry points, graph callables, graph edges, and metric receipts.
2. Execute only admitted catalog queries.
3. Bind each rendered table row to query ID, input hash, result hash, and row count.
4. Render a provenance appendix automatically.
5. Keep narrative interpretation outside the factual metric renderer unless it cites a typed claim receipt.

**Exit condition:** A query over rendered claims returns zero claims without a supporting receipt.

#### D5. Fix and close the CLI surface

**Impact:** `src/cli.js`, CLI help, CLI tests.

1. Add `--report` and `--graph` to admitted value-taking options.
2. Reject unknown options.
3. Add `--metric-catalog`, `--query-receipts`, and `--closure-receipt` as explicit inputs.
4. Make `--summary` report the bound identities and output hash.

`G3` proves `runGenerateDocs` is the only executable caller, so this is the complete current CLI caller impact surface.

**Exit condition:** CLI tests prove each admitted option changes the selected input and every unknown option fails.

#### D6. Build one same-index pipeline

**Impact:** governance orchestration and package scripts.

The pipeline must execute in this order:

```text
project source and contracts
→ validate indexes
→ generate graph from the source index
→ generate governance report from the same source index and declared contract index
→ execute registered metric queries
→ validate query receipts
→ render documentation
→ execute documentation exit queries
→ write closure receipt
```

No stage may silently load an older default artifact.

**Exit condition:** Mutating any one bound identity makes the pipeline fail before rendering.

#### D7. Add focused tests and CI gates

`G4` proves generator test invocation count is currently zero.

Required fixtures:

- current report schema with non-zero feature/scenario/lineage values;
- graph/source same-index success;
- graph/source mismatch;
- report subject-scope mismatch;
- missing required metric;
- stale query receipt;
- large governance and graph JSON;
- repeated generation producing identical factual content;
- CLI custom-path selection;
- unknown CLI option rejection.

**Exit condition:** The test query finds every required fixture ID and at least one invocation of the public generator behavior; CI independently runs the closure verifier.

### Documentation-generation closure queries

These queries become admitted assets. The names are normative; physical collection names may change only with a catalog version bump.

| Query ID | Required result |
|---|---|
| `traceability.artifact-binding.v1` | One row; all required identities compatible |
| `traceability.required-metric-receipts.v1` | Missing, stale, duplicate, and invalid receipt counts all zero |
| `traceability.rendered-claim-provenance.v1` | Unsupported factual claims zero |
| `traceability.metric-reconciliation.v1` | Mismatched rendered/source metric count zero |
| `traceability.generator-test-coverage.v1` | Every required failure disposition and success behavior observed |
| `traceability.documentation-byte-stability.v1` | Two identical-input factual outputs have the same hash |

## Strategy 2: complete forward and reverse reachability

### Current disposition

**`PARTIAL_IMPLEMENTATION`**. The new inventory is material progress, but the requested closure is not proved.

Fresh graph results bound to the fresh source index:

| Measure | Value |
|---|---:|
| Runtime callables | 692 |
| CLI roots | 15 |
| Inventory entry points | 230 |
| Product entry points | 178 |
| Inventory-reachable callables | 627 |
| Runtime-resolution-required callables | 13 |
| Inventory-unreachable callables | 65 |
| Invocation edges | 6,333 |
| Resolved edges | 1,404 |
| Ambiguous edges | 8 |
| Unresolved edges | 4,921 |

Entry-point kinds currently emitted:

| Kind | Count |
|---|---:|
| `cli-command` | 15 |
| `cli-subcommand` | 32 |
| `http-server-entry` | 3 |
| `module-api` | 128 |
| `proof-script` | 1 |
| `script-entry` | 1 |
| `module-evaluation` | 50 |

`R4` proves all 692 callable source-fact rows have `isExported = null`. An uncalled exported API therefore cannot be established as a public entry point from the current source index.

### Required implementation order

#### R1. Project export and interface evidence as first-class facts

**Impact:** source scanner contract/dependency or a deterministic local projection overlay, source-index schema, index validator, fixtures.

1. Add `exportDisposition` rather than relying on an optional Boolean: `EXPORTED`, `NOT_EXPORTED`, or `NOT_EVALUATED`.
2. Preserve export kind: named, default, re-export, CommonJS assignment, or contract-declared API.
3. Link every export fact to a source reference.
4. Project declared CLI, HTTP/API, scheduled, event, proof, migration, and public-module interfaces from source and contracts.

**Exit query:** Group callable rows by `exportDisposition` and interface kind.

**Exit condition:** `NOT_EVALUATED` is zero for deterministic Round 2 source forms; every exported callable has a source or contract reference.

#### R2. Define and validate the graph artifact contract

**Impact:** new `contracts/call-graph.schema.v1.json`, graph validator, graph writer.

The artifact must serialize one canonical edge inventory, not only counts and root-local copies. Every edge must contain:

- stable edge ID;
- caller and callee identity or typed boundary identity;
- relationship kind and source reference;
- resolution disposition and reason;
- static/runtime evidence kind;
- owning scope;
- forward and reverse adjacency membership.

Every callable must carry incoming and outgoing edge IDs, originating entry-point IDs, disposition, and path-witness IDs.

**Exit condition:** Schema validation passes; edge count equals unique edge rows; every adjacency edge ID resolves exactly once.

#### R3. Make the entry-point taxonomy contract-driven

**Impact:** graph taxonomy contract and `buildsEntryPointInventory`/classification functions identified by `R1` and `R2`.

Required Round 2 kinds must be declared explicitly:

- CLI command and subcommand;
- HTTP/API entry;
- public module/SDK operation;
- event handler and registration;
- scheduled trigger;
- callback/higher-order invocation;
- proof/test entry where included by policy;
- migration/script entry;
- module evaluation;
- dynamic-dispatch candidate.

Each classification rule declares its evidence requirements, product/non-product status, and allowed closure disposition. Filename/name heuristics alone may produce candidates, not admitted product entry points.

**Exit query:** Compare required taxonomy kinds with observed and explicitly excluded kinds.

**Exit condition:** Missing required kind disposition count is zero; every entry point has typed evidence and policy status.

#### R4. Close deterministic invocation resolution

**Impact:** `resolvesSymbolCandidate`, invocation projection, import/export binding, member-call resolution.

1. Separate external/library boundaries from internal unresolved calls.
2. Resolve deterministic imports, re-exports, member calls, and same-module bindings.
3. Assign every remaining runtime-sensitive edge a specific candidate kind rather than generic `unresolved`.
4. Require owner, debt ID, and closure round for every `RUNTIME_RESOLUTION_REQUIRED` edge.

**Exit query:** Group edges by scope, disposition, and reason.

**Exit condition:** Generic unresolved deterministic internal edge count is zero; unowned runtime-resolution debt count is zero.

#### R5. Project callbacks, module evaluation, and dynamic dispatch

**Impact:** relationship projector and stable synthetic-identity rules.

1. Create stable identities for anonymous callbacks from module path, enclosing callable, registration/reference site, and ordinal.
2. Model callback registration separately from callback invocation.
3. Preserve module-scope execution nodes and their order evidence without inferring aggregate execution order.
4. Model dispatch tables, injected/default function parameters, factories, and service-provider candidates.
5. Accept runtime observations only when bound to source index, graph, revision, and trace identity.

**Exit condition:** Every candidate receives `RESOLVED`, a typed external/platform boundary, or owned `RUNTIME_RESOLUTION_REQUIRED`; no candidate is mislabeled dead.

#### R6. Materialize reverse navigation as queryable evidence

**Impact:** `findsAffectedEntryPoints`, graph query sources, CLI query surface.

Required reverse queries:

- callers of a symbol;
- all originating entry points;
- shortest and all admitted path witnesses;
- impacted interface behaviors, features, and scenarios;
- unresolved candidates that could reach a symbol;
- edges and outcomes affected by a source-reference change.

`R3` proves no test currently invokes `findsAffectedEntryPoints`.

**Exit condition:** Forward-then-reverse round-trip fixtures return the original edge and entry-point identities for cycles, shared helpers, callbacks, exported APIs, and module-scope execution.

#### R7. Add closure-focused fixtures and gates

Required fixtures:

- uncalled exported API;
- named and anonymous callback;
- event registration;
- scheduled trigger;
- module-scope invocation;
- dynamic dispatch table;
- injected/default function parameter;
- re-export chain;
- same-name symbols in different modules;
- internal unresolved import;
- external/library boundary;
- cycle and shared helper;
- dead callable with no candidate path.

**Exit condition:** The fixture inventory query returns every required fixture ID; reverse-navigation and disposition assertions exist for each; CI blocks regression of any zero-count exit query.

### Reachability closure queries

| Query ID | Required result |
|---|---|
| `reachability.callable-dispositions.v1` | Every in-scope callable has exactly one allowed disposition |
| `reachability.edge-resolution.v1` | Generic unresolved deterministic internal edges zero |
| `reachability.entry-taxonomy.v1` | Every required family observed or explicitly excluded by policy |
| `reachability.forward-reverse-integrity.v1` | Missing/dangling adjacency and path-witness references zero |
| `reachability.exported-api-roots.v1` | Every exported API admitted or explicitly non-product/excluded |
| `reachability.runtime-resolution-debt.v1` | Unowned or expired runtime-resolution items zero |
| `reachability.dead-code-certainty.v1` | No callback/dynamic/public-boundary candidate classified as dead |
| `reachability.reverse-navigation-tests.v1` | Every required reverse fixture and behavior tested |

## Deterministic implementation tracker

| Task | Depends on | Completion evidence |
|---|---|---|
| `D1` large-artifact queryability | none | repeatable projection/query receipts for report and graph |
| `D2` metric catalog | `D1` | schema-valid catalog; zero missing/duplicate metrics |
| `D3` input validation | `D2`, `R2` graph schema | negative-fixture receipts and no output on failure |
| `D4` query-driven renderer | `D1`–`D3`, `R6` graph query sources | zero unsupported rendered claims |
| `D5` CLI closure | `D3` | custom-path and unknown-option tests |
| `D6` same-index pipeline | `D3`–`D5` | one closure receipt binding all identities |
| `D7` documentation gate | `D6` | all documentation exit queries pass |
| `R1` export/interface facts | none | zero deterministic export `NOT_EVALUATED` rows |
| `R2` graph schema | none | schema-valid canonical edge inventory |
| `R3` taxonomy authority | `R1`, `R2` | zero missing family dispositions |
| `R4` deterministic resolution | `R2` | zero generic unresolved deterministic internal edges |
| `R5` runtime-sensitive candidates | `R3`, `R4` | typed/owned disposition for every candidate |
| `R6` reverse query plane | `R2`–`R5` | round-trip query fixtures pass |
| `R7` reachability gate | `R6` | all reachability exit queries pass |

The two strategies converge at `D3`/`D4`: deterministic documentation must consume the validated graph and its query receipts, and the graph closure cannot be claimed until those receipts can be rendered and independently reconciled.

## Reproduction appendix

### Rebuild the evidence indexes

```powershell
$evidenceRoot = Join-Path ([System.IO.Path]::GetTempPath()) 'sourcefacts-gap-closure-evidence'
New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null

node src/cli.js project --workspace ./src --workspace-id gap-closure-src `
  --output (Join-Path $evidenceRoot 'src-index.json') --summary

node src/cli.js project --workspace ./contracts --workspace-id gap-closure-contracts `
  --output (Join-Path $evidenceRoot 'contracts-index.json') --summary

node src/cli.js project --workspace ./test --workspace-id gap-closure-tests `
  --output (Join-Path $evidenceRoot 'test-index.json') --summary

node src/cli.js call-graph --index (Join-Path $evidenceRoot 'src-index.json') `
  --output (Join-Path $evidenceRoot 'call-graph.json') --pretty --summary
```

After implementation, the CLI must either support these parenthesized PowerShell paths exactly as passed or documentation should assign paths to variables before invocation. Closure automation should use resolved absolute paths and record them only as non-identity diagnostics.

### `G1` — generator functions

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'generate-traceability-docs.js'
  AND kind = 'function'
ORDER BY name
```

Expected row count for the recorded baseline: 3.

### `G2` — generator field accesses

```sql
SELECT toSymbolCandidate, COUNT(*) AS occurrenceCount
FROM relationships
WHERE fromSymbolId = 'generate-traceability-docs.js#function:generatesTraceabilityDocs'
  AND relationshipKind = 'member-access'
GROUP BY toSymbolCandidate
ORDER BY occurrenceCount DESC
```

Expected recorded result hash: `sha256:68e49608d03081a32ebbf60e42f51e927fa4a7cac7431fdafdb08fb9d8ebc4d7`.

### `G3` / `G4` — production and test callers

```sql
SELECT fromSymbolId, sourceReferenceId
FROM relationships
WHERE toSymbolCandidate = 'generatesTraceabilityDocs'
  AND relationshipKind = 'invocation'
ORDER BY sourceReferenceId
```

Run against both the source and test indexes. Recorded row counts are 1 and 0 respectively.

### `R1` — graph implementation impact

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'call-graph.js'
  AND kind = 'function'
  AND name IN (
    'projectsCliEntryPointCallGraph',
    'findsAffectedEntryPoints',
    'buildsEntryPointInventory',
    'buildsEntryPointReachability',
    'buildsCallableInventory',
    'classifiesCliEntryKinds',
    'classifiesModuleEntryKinds',
    'classifiesSyntheticEntryKinds',
    'resolvesSymbolCandidate'
  )
ORDER BY name
```

Expected recorded row count: 9.

### `R2` — top-level graph orchestration

```sql
SELECT toSymbolCandidate, COUNT(*) AS invocationCount
FROM relationships
WHERE fromSymbolId = 'call-graph.js#function:projectsCliEntryPointCallGraph'
  AND relationshipKind = 'invocation'
  AND toSymbolCandidate IN (
    'buildsEntryPointInventory',
    'buildsEntryPointReachability',
    'buildsCallableInventory',
    'summarizesInventory',
    'buildsRootGraph'
  )
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

Recorded result: five rows, each with `invocationCount = 1`.

### `R3` — graph public-behavior tests

```sql
SELECT toSymbolCandidate, COUNT(*) AS invocationCount
FROM relationships
WHERE relationshipKind = 'invocation'
  AND toSymbolCandidate IN (
    'projectsCliEntryPointCallGraph',
    'findsAffectedEntryPoints'
  )
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

Recorded result: one invocation row for `projectsCliEntryPointCallGraph`; none for `findsAffectedEntryPoints`.

### `R4` — export fact completeness

```sql
SELECT isExported, COUNT(*) AS callableCount
FROM symbols
WHERE kind IN ('function', 'method', 'constructor', 'class')
GROUP BY isExported
ORDER BY isExported
```

Recorded result: `{ "isExported": null, "callableCount": 692 }`.

### `C1` — report contract locations

```sql
SELECT pointer, valuePreview, sourceReferenceId
FROM documents
WHERE relativePath = 'source-facts-self-governance-report.schema.v1.json'
  AND pointer IN (
    '/properties/index/properties/indexId',
    '/properties/index/properties/scanId',
    '/properties/scenarioConformance/properties/summary',
    '/properties/featureCoverage/properties/summary'
  )
ORDER BY pointer
```

Expected recorded row count: 4.

## Final closure rule

Neither roadmap row changes to `Closed` because implementation tasks were completed informally or because the general suite passes. The status changes only when one reproducible closure run:

1. regenerates every bound artifact from the declared revision and boundaries;
2. executes every admitted current-state and exit query;
3. validates every receipt and cross-artifact identity;
4. renders the evidence-bound documentation;
5. reconciles rendered metrics back to query results; and
6. writes a schema-valid closure receipt with zero failed exit conditions.
