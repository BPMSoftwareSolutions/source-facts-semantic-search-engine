# Deterministic Traceability Gap Closure Implementation Strategies

**Status:** Normative implementation specification; neither gap is closed

**Evidence date:** 2026-08-04

**HEAD observed:** `f71eb33a0f173832b93b62f86d90f33bf1ed3e33`

**Revision qualification:** The evidence was produced from a dirty working tree. It is valid for implementation planning, but it is not eligible for a release closure receipt.

**Subject:** The two closure claims in the [Feature and Capability Traceability Strategic Roadmap](<./Feature and Capability Traceability Strategic Roadmap.md>)

## Purpose

This document is the executable specification for closing two gaps:

1. deterministic, evidence-bound traceability documentation; and
2. complete forward and reverse reachability for the declared repository scope.

It supersedes any earlier prose in this document that could be satisfied by constructing plausible fixtures or copying unverified hashes. Every implementation step below declares:

- the exact SourceFacts query or non-query command that establishes its current state;
- the observed result, including receipt hash and row count where available;
- the required implementation impact;
- negative cases that must fail closed; and
- a binary exit condition.

`Implemented`, `tests added`, and `schema exists` are not closure dispositions. Only the closure algorithm at the end of this document may emit `CLOSED`.

## Normative determinism rules

The terms **MUST**, **MUST NOT**, **REQUIRED**, and **SHALL** are normative.

### Evidence classes

| Evidence class | What it proves | May close a gate? |
|---|---|---|
| SourceFacts query receipt | The exact query executed against the exact admitted input and produced the recorded result | Yes, after independent receipt verification |
| Artifact assertion | A deterministic program read or hashed an artifact | Yes, only for facts not exposed as a relational collection |
| Test receipt | A named behavior produced the expected success or rejection disposition | Yes, for behavioral gates |
| Tool failure | A required pipeline stage could not complete | No; it proves the gate remains open |
| Prose interpretation | A human or model interpreted evidence | No |

### Query definition is not a query receipt

A query definition identifies what should run. A query receipt proves what did run. A closure verifier MUST reject a receipt unless it can reproduce all of these values from admitted inputs:

| Binding | Required verification |
|---|---|
| `queryId` | Exactly one catalog query has the ID |
| `queryText` | Byte-equal to catalog text after the catalog's declared normalization policy |
| `queryTextHash` | Recomputed from the exact query text |
| `catalogFingerprint` | Recomputed from canonical catalog JSON |
| `artifactKind` | Matches the catalog metric source |
| Artifact content | SHA-256 of the queried artifact or projected query input |
| Internal identity | Index ID, scan ID, graph source-index ID, report source-index ID, and scope as applicable |
| `inputHash` | Equal to the hash emitted by a fresh execution of the admitted query engine request |
| `resultHash` | Equal to the hash emitted by that execution |
| `rowCount` | Equal to the actual result row count |
| `disposition` | Exactly `RELATIONAL_QUERY_EXECUTED` |

Well-formed but invented hashes MUST be rejected. A test helper that manufactures hashes without executing the query engine is not success evidence.

### Time and path policy

- Timestamps and absolute temporary paths MUST NOT contribute to deterministic evidence or document content hashes.
- A timestamp MAY appear as receipt metadata after the deterministic digest has been calculated.
- Generation time MUST be supplied as a controlled input when it is rendered into a document.
- Paths MAY be recorded as diagnostics, but artifact identity MUST use content hashes and declared logical roles.
- Two runs with identical admitted inputs MUST produce byte-identical factual Markdown and identical deterministic closure payloads.

### Failure policy

The generator and closure verifier MUST fail before writing final output when any required artifact, identity, query, result, metric, or schema is missing or incompatible. `unknown`, `null`, and fallback `0` MUST NOT replace a required fact.

## Reproducible evidence baseline

### Projection commands used

```powershell
$evidenceRoot = Join-Path ([System.IO.Path]::GetTempPath()) `
  'sourcefacts-deterministic-doc-spec-20260804'
$srcIndex = Join-Path $evidenceRoot 'src-index.json'
$contractIndex = Join-Path $evidenceRoot 'contracts-index.json'
$testIndex = Join-Path $evidenceRoot 'test-index.json'
$freshGraph = Join-Path $evidenceRoot 'fresh-call-graph.json'
New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null

node src/cli.js project --workspace ./src `
  --workspace-id deterministic-doc-src --output $srcIndex --summary
node src/cli.js project --workspace ./contracts `
  --workspace-id deterministic-doc-contracts --output $contractIndex --summary
node src/cli.js project --workspace ./test `
  --workspace-id deterministic-doc-tests --output $testIndex --summary
node src/cli.js call-graph --index $srcIndex `
  --output $freshGraph --pretty --summary
```

### Observed projection results

| Boundary | Observed result |
|---|---|
| `src/` | 94 files, 5,352 symbols, 24,027 relationships; index `sha256:f0aaf385fef56864acae42e1b5071c8409d0b96446d77f72b1d24c6a4021e07f`; scan `b67dd8f9ce2776f9395fedcf1b5a8857061af346af90f614be6339535b13b820` |
| `test/` | 33 files, 1,098 symbols, 7,692 relationships; index `sha256:3ab329138891d586afcf5488a5e290c2f2a14e1b15fe226e13b6e5a94dc3cf6b`; scan `abb234399f4b975ea1e5deb7c2e01ac01cf1c32c8794c782e424911e0c786aca` |
| `contracts/` | **Failed**: `traceability-query-receipts.schema.v1.json:34:9: Expected a JSON value` |
| Fresh graph | Source index `sha256:f0aaf385...`; 710 runtime callables; 235 inventory entry points; 573 reachable; 137 unreachable; 5,051 unresolved invocation edges |

The contract projection failure is a closure failure, not an omitted result. The current receipt schema contains invalid JSON, so a current contract index cannot be produced.

### Large artifact projection commands used

The checked governance report, fresh graph, and metric catalog were each copied into a single-file staging directory and projected with the same `project` command:

```powershell
$reportStage = Join-Path $evidenceRoot 'report-stage'
$graphStage = Join-Path $evidenceRoot 'graph-stage'
$catalogStage = Join-Path $evidenceRoot 'catalog-stage'
$reportIndex = Join-Path $evidenceRoot 'report-index.json'
$graphIndex = Join-Path $evidenceRoot 'graph-index.json'
$catalogIndex = Join-Path $evidenceRoot 'catalog-index.json'
New-Item -ItemType Directory -Force `
  -Path $reportStage, $graphStage, $catalogStage | Out-Null

Copy-Item -LiteralPath `
  artifacts/governance/source-facts-self-governance-report.json `
  -Destination $reportStage -Force
Copy-Item -LiteralPath $freshGraph `
  -Destination (Join-Path $graphStage 'fresh-call-graph.json') -Force
Copy-Item -LiteralPath contracts/traceability-metric-catalog.json `
  -Destination $catalogStage -Force

node src/cli.js project --workspace $reportStage `
  --workspace-id deterministic-doc-report --output $reportIndex --summary
node src/cli.js project --workspace $graphStage `
  --workspace-id deterministic-doc-graph --output $graphIndex --summary
node src/cli.js project --workspace $catalogStage `
  --workspace-id deterministic-doc-catalog --output $catalogIndex --summary
```

The observed results were:

| Artifact | Document facts | Disposition |
|---|---:|---|
| Checked governance report | 164,466 | Projection completed |
| Fresh call graph | 214,620 | Projection completed |
| Metric catalog | 590 | Projection completed |

This closes only the former call-stack-overflow sub-gap. It does not close documentation generation.

## Query evidence register

Every query used to establish this specification is repeated in its relevant strategy section.

| ID | Input hash | Result hash | Rows | Observed fact |
|---|---|---|---:|---|
| `D-GENERATOR-SURFACE` | `sha256:903f0dc...` | `sha256:5cebc581...` | 18 | Current generator implementation functions |
| `D-CALLER-SURFACE` | `sha256:b01c116...` | `sha256:2689c7c...` | 1 | `runGenerateDocs` is the production caller |
| `D-REPORT-FACTS` | `sha256:dc1cedf...` | `sha256:9afbeb98...` | 5 | Real report identity and baseline values |
| `D-GRAPH-FACTS` | `sha256:e48f9fd...` | `sha256:43562dc...` | 5 | Fresh graph identity and summary values; one requested pointer was absent |
| `D-CATALOG-MODES` | `sha256:bd50581...` | `sha256:b7b7c88...` | 5 | 41 catalog metrics partitioned by value mode |
| `D-RECEIPT-CHECKS` | `sha256:4d2b21a...` | `sha256:833e4df...` | 19 | Current verifier accesses query text and identity fields, but not result proof fields |
| `D-CLOSURE-FIELDS` | `sha256:facaef9...` | `sha256:2b5d40f...` | 22 | Current closure builder omits receipt and catalog content hashes |
| `D-TEST-HELPERS` | `sha256:73a0235...` | `sha256:62e1aa5...` | 5 | Generator tests construct minimal artifacts and receipts |
| `R-SURFACE` | `sha256:9904ce0...` | `sha256:0f864fd...` | 9 | Reachability implementation surface |
| `R-ORCHESTRATION` | `sha256:bfb9110...` | `sha256:08383e3...` | 5 | Top-level graph projection invokes all five inventory stages |
| `R-TEST-COVERAGE` | `sha256:a8a1568...` | `sha256:956a39d...` | 1 | Tests call graph projection but not reverse lookup |
| `R-EXPORT-FACTS` | `sha256:e03bed1...` | `sha256:8c34528...` | 1 | All 710 callable rows have `isExported = null` |

Hashes are abbreviated only in this human-readable register. A machine receipt MUST retain all 64 hexadecimal characters.

## Strategy 1: deterministic documentation generation

### Current disposition

**`PARTIAL_IMPLEMENTATION_NOT_CLOSED`**

Confirmed progress:

- large JSON projection completes;
- CLI options are wired and unknown options are rejected;
- catalog value modes are implemented;
- all 31 current `artifact-pointer` metrics resolve against the selected report, fresh graph, and source index;
- query text, catalog fingerprint, and artifact internal identity checks exist.

Blocking evidence:

- the query-receipt schema is invalid JSON;
- query `inputHash`, `resultHash`, and `rowCount` are accepted without verification;
- the call graph is not schema-validated;
- the closure receipt has no schema and does not bind catalog content or receipt content;
- the generated timestamp changes the document hash for identical factual inputs;
- four of five focused generator tests fail, and the full suite is 152 passed / 4 failed.

Queries used to establish the current implementation and caller surfaces, both run against `$srcIndex`:

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'generate-traceability-docs.js'
  AND kind = 'function'
ORDER BY name
```

This returned 18 functions with result hash `sha256:5cebc581ce2a5e3f535970bd75556e703e6ec565e83bc3730d44ee0c87379e53`.

```sql
SELECT fromSymbolId, sourceReferenceId
FROM relationships
WHERE toSymbolCandidate = 'generatesTraceabilityDocs'
  AND relationshipKind = 'invocation'
ORDER BY sourceReferenceId
```

This returned the single production caller `cli.js#function:runGenerateDocs`, result hash `sha256:2689c7c84a78630f8678ebb58c6e3ae4e79962eade51f478e7410f631636fdcb`.

### D1 — Large artifacts are queryable

**Status:** Evidence gate passes.

#### Report query actually used

Run this query against `$reportIndex`.

```sql
SELECT pointer, valuePreview
FROM documents
WHERE pointer IN (
  '/index/indexId',
  '/index/scanId',
  '/featureCoverage/summary/canonicalFeatures',
  '/scenarioConformance/summary/scenariosDiscovered',
  '/featureCoverage/summary/mechanicsWithoutLineage'
)
ORDER BY pointer
```

Observed receipt: result hash `sha256:9afbeb98dc44f14c84d3ea66ceb477626eb79ed00fb40e467f349aeec65441fd`, five rows.

| Pointer | Value |
|---|---|
| `/featureCoverage/summary/canonicalFeatures` | `4` |
| `/featureCoverage/summary/mechanicsWithoutLineage` | `5154` |
| `/index/indexId` | `sha256:5f711aa0fbe2f2115f97c5102d9a9606116c685142dce12c8d1f4edbbd08af80` |
| `/index/scanId` | `49c9632b050e44f8fc3910aa3497458ebf8a8b186ff4d660892ac69d741a373a` |
| `/scenarioConformance/summary/scenariosDiscovered` | `6` |

#### Graph query actually used

Run this query against `$graphIndex`.

```sql
SELECT pointer, valuePreview
FROM documents
WHERE pointer IN (
  '/indexId',
  '/summary/runtimeCallableCount',
  '/summary/inventoryEntryPointCount',
  '/summary/reachableCallableCount',
  '/summary/unreachableCallableCount',
  '/summary/unresolvedInvocationEdgeCount'
)
ORDER BY pointer
```

Observed receipt: result hash `sha256:43562dc5fb5d3817c169ca9b24ea55ddeb71e893d406dc8e96a75511742e8840`, five rows. `/summary/inventoryEntryPointCount` did not exist and therefore did not produce a row. Missing requested rows MUST be detected by expected-row assertions; `RELATIONAL_QUERY_EXECUTED` alone is insufficient.

**Exit condition:** Two repeated projections of each unchanged artifact produce identical document-fact roots, and each admitted pointer query returns exactly its cataloged pointer set with no missing or duplicate rows.

### D2 — Metric catalog is executable authority

#### Catalog query actually used

Run this query against `$catalogIndex`.

```sql
SELECT valuePreview AS valueMode, COUNT(*) AS metricCount
FROM documents
WHERE pointer LIKE '/metrics/%/source/valueMode'
GROUP BY valuePreview
ORDER BY valuePreview
```

Observed result hash: `sha256:b7b7c88e32880aea0cb35f5b5c1bdde7ef5c4eb98da6326777010c97a05f742d`.

| Value mode | Metrics |
|---|---:|
| `artifact-pointer` | 31 |
| `ratio` | 4 |
| `sum-metrics` | 1 |
| `sum-symbol-counts` | 1 |
| `symbol-count` | 4 |

A deterministic pointer audit over the selected artifacts resolved all 31 current artifact pointers. That audit MUST become an admitted query/verifier behavior, not remain an ad hoc script.

Required catalog invariants:

1. `metricId` and `queryId` are globally unique.
2. Every value mode has a conditional schema defining exactly its required and forbidden properties.
3. Every factual metric declares a query with exact text and expected result shape.
4. Every derived metric declares its operand metric IDs, formula, numeric type, and zero-denominator policy.
5. Every artifact pointer is proven to exist before rendering.
6. Interpretive claims are excluded from factual metric tables.

**Exit query ID:** `traceability.metric-catalog-integrity.v1`

**Required result:** one row with `duplicateMetricIds = 0`, `duplicateQueryIds = 0`, `invalidValueModes = 0`, `missingPointers = 0`, `untypedMetrics = 0`.

### D3 — Every input has a valid, compatible contract

The current `contracts/` projection command fails at:

```text
traceability-query-receipts.schema.v1.json:34:9: Expected a JSON value
```

Required implementation impact:

- repair and validate the receipt schema as JSON and JSON Schema;
- add a versioned call-graph schema and validator;
- add a versioned closure-receipt schema and validator;
- define scope compatibility as an explicit relation instead of comparing `repositoryId` and `workspaceId` as if they were the same identity domain;
- require source revision and dirty-tree disposition in release mode;
- validate all inputs before creating output directories or files.

Required negative fixtures:

| Fixture | Required disposition |
|---|---|
| Invalid JSON contract | `CONTRACT_JSON_INVALID` |
| Schema-invalid report | `REPORT_SCHEMA_INVALID` |
| Schema-invalid graph | `CALL_GRAPH_SCHEMA_INVALID` |
| Graph/source index mismatch | `ARTIFACT_INDEX_MISMATCH` |
| Report/source scope incompatibility | `REPORT_SCOPE_MISMATCH` |
| Dirty release closure | `REPOSITORY_REVISION_NOT_CLOSABLE` |

**Exit condition:** `project --workspace ./contracts` succeeds, every schema compiles, every negative fixture produces exactly its declared disposition, and no failure writes final Markdown or a closure receipt.

### D4 — Query receipts are independently verifiable

#### Query used to inspect the implemented verifier

```sql
SELECT toSymbolCandidate, COUNT(*) AS occurrenceCount
FROM relationships
WHERE fromSymbolId =
  'generate-traceability-docs.js#function:validatesQueryReceiptBinding'
  AND relationshipKind IN ('member-access', 'invocation')
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

Observed result hash: `sha256:833e4dfbe9c54f23c52843313e4c4ae3b51188b1ac0848d85aacc176a650c694`.

The result includes `queryText`, `queryTextHash`, `catalogFingerprint`, `artifactKind`, `indexId`, and `scanId`. It contains no accesses for `inputHash`, `resultHash`, or `rowCount`. Therefore the current verifier proves query identity but not query execution or result integrity.

The verifier MUST perform this exact algorithm:

1. Load and schema-validate the catalog and receipt bundle.
2. Canonicalize the catalog and recompute its fingerprint.
3. Select exactly one catalog query by `queryId`.
4. Verify exact query text and query-text hash.
5. Load the declared artifact and verify content hash plus internal identities.
6. Reconstruct the query-engine request from that artifact.
7. Execute the query through the real SourceFacts query engine.
8. Compare engine disposition, input hash, result hash, row count, columns, and expected row assertions.
9. Reject on any difference.
10. Return the freshly verified engine receipt; do not trust copied values from the supplied wrapper.

Required rejection tests:

- one-character query change;
- catalog change without receipt regeneration;
- artifact content change with unchanged internal ID;
- correct-looking but fabricated input hash;
- correct-looking but fabricated result hash;
- wrong row count;
- executed empty result where a required pointer was expected;
- receipt generated by a different query-engine authority/version.

**Exit query ID:** `traceability.query-receipt-verification.v1`

**Required result:** one row with all rejection fixtures observed and `unverifiedReceipts = 0`.

### D5 — Closure receipt binds the whole proof

#### Query used to inspect the closure builder

```sql
SELECT toSymbolCandidate, COUNT(*) AS occurrenceCount
FROM relationships
WHERE fromSymbolId =
  'generate-traceability-docs.js#function:buildsClosureReceipt'
  AND relationshipKind = 'member-access'
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

Observed result hash: `sha256:2b5d40fdd0a7bd459e5330ef985c42f3f382821886e9d68c8baee7684f5e47e5`.

The current closure builder reads catalog type/version and receipt count, but it does not bind catalog content, the receipt-bundle content, individual receipt result hashes, repository revision, or a contract index.

A valid closure receipt MUST include:

- clean commit ID and repository-content or subject-scope hash;
- source and contract index IDs, scan IDs, schema versions, and content hashes;
- report and graph content hashes plus their internal source bindings;
- catalog version and canonical content hash;
- receipt-bundle hash and an ordered list of every query ID, query-text hash, input hash, result hash, row count, and disposition;
- rendered metric rows with source receipt IDs;
- factual Markdown hash calculated without uncontrolled metadata;
- every exit-query receipt;
- final disposition and zero failed conditions.

**Exit condition:** Changing one byte in any bound input invalidates verification. Changing only an excluded diagnostic path or post-digest timestamp does not alter the deterministic payload hash.

### D6 — Renderer is byte-stable and claim-reconcilable

The SourceFacts query used against `$srcIndex` was:

```sql
SELECT toSymbolCandidate, COUNT(*) AS occurrenceCount
FROM relationships
WHERE fromSymbolId =
  'generate-traceability-docs.js#function:generatesTraceabilityDocs'
  AND relationshipKind = 'invocation'
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

It returned `new Date().toISOString` once; full result hash `sha256:fe5aa03d3e7c1a779e17a5ff176194d57824f59c43c55e8ab6d21e7805fb8240`. The current timestamp is rendered into Markdown before the document hash is calculated, so identical evidence does not produce an identical hash.

Required behavior:

1. Accept an explicit generation time or omit time from factual Markdown.
2. Render every factual row with its metric ID and receipt ID.
3. Generate a provenance appendix from verified receipts.
4. Parse the produced Markdown back into rendered metric facts.
5. Compare every rendered fact to the verified source result.

**Exit query IDs:** `traceability.rendered-claim-provenance.v1`, `traceability.metric-reconciliation.v1`, and `traceability.documentation-byte-stability.v1`.

**Required results:** unsupported factual claims `0`; metric mismatches `0`; two identical-input output hashes equal.

### D7 — Tests exercise real contracts and real queries

Commands actually used:

```powershell
node --test test/generate-docs.test.js test/project.test.js
npm test
```

Observed focused result: 8 tests, 4 passed, 4 failed. The four generator failures occur before their intended assertions because `buildsMinimalIndex` does not construct a schema-valid source-fact index.

Observed full result: 156 tests, 152 passed, 4 failed.

The test index query used to inventory helpers was:

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'generate-docs.test.js'
  AND kind = 'function'
ORDER BY name
```

It returned five helper functions: `buildsMinimalGraph`, `buildsMinimalIndex`, `buildsMinimalMetricCatalog`, `buildsMinimalQueryReceipts`, and `buildsMinimalReport`.

Required test policy:

- success fixtures MUST be projected or validated by the same production validators used by the CLI;
- receipt fixtures for success MUST come from executing the real query engine;
- mutation helpers MAY corrupt one field only after a valid fixture and receipt exist;
- each negative test MUST prove it reached the intended rejection stage;
- an end-to-end test MUST use the shipped catalog against freshly generated compatible artifacts;
- the full suite MUST pass before closure.

### Strategy 1 implementation order

| Order | Task | Blocking exit evidence |
|---:|---|---|
| 1 | Repair receipt JSON/schema and add graph/closure schemas | Contract projection and schema compilation pass |
| 2 | Make test fixtures production-schema-valid | Focused tests reach intended assertions |
| 3 | Implement independent receipt replay verification | All forged/stale receipt mutations rejected |
| 4 | Complete closure-receipt provenance | One-byte mutation invalidates closure |
| 5 | Remove uncontrolled time from deterministic output | Identical-input byte-stability passes |
| 6 | Add rendered-claim reconciliation | Zero unsupported or mismatched factual rows |
| 7 | Run same-revision end-to-end pipeline | All documentation exit queries pass |
| 8 | Run full suite | 156 of 156, or the then-current complete suite, passes |

## Strategy 2: complete forward and reverse reachability

### Current disposition

**`PARTIAL_IMPLEMENTATION_NOT_CLOSED`**

The graph is useful and reproducible for its current taxonomy, but it cannot yet prove repository-wide reachability. Fresh observed values are:

| Measure | Value |
|---|---:|
| CLI command roots | 15 |
| Inventory entry points | 235 |
| Product entry points | 181 |
| Runtime callables | 710 |
| Reachable callables | 573 |
| Unreachable callables | 137 |
| Runtime-resolution-required callables | 14 |
| Invocation edges | 6,493 |
| Resolved edges | 1,434 |
| Ambiguous edges | 8 |
| Unresolved edges | 5,051 |

### R1 — Implementation impact surface

Query actually used:

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

Observed result hash `sha256:0f864fde983ea36bd0cc9e8069e6daae61b9745d4e4cf030fcc9a5f92cff4cca`, nine rows. These functions are the minimum implementation impact surface; new taxonomy or graph modules discovered during implementation must be added by a versioned catalog change.

### R2 — Top-level orchestration

Query actually used:

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

Observed result hash `sha256:08383e30390b5fb79090894ceb6058cdc9c34eb70acc38d93ec782b592d59e55`, five rows, each count `1`.

### R3 — Reverse behavior test gap

Query actually used against the test index:

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

Observed result hash `sha256:956a39d2da02cec495b9820c98d014fb3e55b975daec3b11230bc6199e155ef1`. It returned one row for `projectsCliEntryPointCallGraph` and no row for `findsAffectedEntryPoints`.

### R4 — Exported API evidence gap

Query actually used:

```sql
SELECT isExported, COUNT(*) AS callableCount
FROM symbols
WHERE kind IN ('function', 'method', 'constructor', 'class')
GROUP BY isExported
ORDER BY isExported
```

Observed result hash `sha256:8c34528574cccbf52ca7c1a8d9981a5a3cea5c9b1124e7510cfcef98c896e4d5`. The sole row was `isExported = null`, `callableCount = 710`.

### R5 — Required graph contract

The graph schema MUST require:

- source index ID, scan ID, revision, and subject scope;
- versioned entry-point taxonomy and exclusions;
- one disposition for every in-scope callable;
- canonical forward and reverse adjacency;
- path witnesses with stable node and edge IDs;
- edge resolution class: resolved internal, ambiguous internal, unresolved dynamic, external, or invalid;
- callback, registration, module-evaluation, and public-export roots;
- runtime-resolution owner, evidence requirement, and expiry where static resolution is impossible.

Generic unresolved internal edges MUST NOT be counted as valid reachability proof.

### R6 — Required reverse query plane

The implementation MUST answer both directions from the same canonical edge inventory:

```text
entry point -> reachable callable -> source reference
source reference or symbol -> affected callable -> affected entry point
```

Forward and reverse results MUST round-trip: every forward edge has exactly one reverse counterpart, and every path witness references existing nodes and edges.

Required fixtures:

- direct invocation;
- multi-hop invocation;
- shared helper reached by multiple roots;
- callback registration;
- module-scope execution;
- uniquely resolvable export;
- ambiguous export;
- dynamic dispatch requiring runtime evidence;
- external dependency;
- truly dead internal callable.

### R7 — Reachability closure queries

| Query ID | Required result |
|---|---|
| `reachability.callable-dispositions.v1` | Every in-scope callable has exactly one allowed disposition |
| `reachability.edge-resolution.v1` | Generic unresolved deterministic internal edges `0` |
| `reachability.entry-taxonomy.v1` | Every required family observed or explicitly excluded by policy |
| `reachability.forward-reverse-integrity.v1` | Missing or dangling adjacency and path references `0` |
| `reachability.exported-api-roots.v1` | Every exported API admitted or explicitly excluded |
| `reachability.runtime-resolution-debt.v1` | Unowned or expired runtime-resolution items `0` |
| `reachability.dead-code-certainty.v1` | No callback, dynamic, or public-boundary candidate classified as dead |
| `reachability.reverse-navigation-tests.v1` | Every required reverse fixture observed |

### Strategy 2 implementation order

| Order | Task | Blocking exit evidence |
|---:|---|---|
| 1 | Project export and interface evidence as first-class source facts | No callable has unknown export disposition |
| 2 | Define and validate the graph schema | Current graph and negative fixtures validate as expected |
| 3 | Make entry taxonomy contract-driven | Every family admitted or explicitly excluded |
| 4 | Resolve deterministic internal invocations | Generic deterministic unresolved edges `0` |
| 5 | Model callbacks, registrations, module execution, and dynamic dispatch | Every runtime-sensitive edge typed and owned |
| 6 | Materialize reverse adjacency and path witnesses | Forward/reverse round-trip passes |
| 7 | Add reverse-navigation and dead-code fixtures | All reachability closure queries pass |

## One same-revision closure pipeline

The two strategies converge in one pipeline. No stage may load an older default artifact.

```text
assert clean declared revision and scope
-> project source index
-> project contract index
-> validate both indexes
-> generate and schema-validate graph from source index
-> generate and schema-validate governance report from the same source identity
-> project report, graph, catalog, and receipt evidence for querying
-> execute every admitted metric and reachability query
-> independently replay and verify every query receipt
-> resolve and reconcile every metric
-> render byte-stable factual documentation
-> execute documentation and reachability exit queries
-> build deterministic closure payload
-> validate closure receipt schema
-> emit CLOSED only when failedExitConditionCount = 0
```

Mutating any bound identity or content byte MUST make the pipeline fail before final output is promoted.

## Closure receipt minimum result

A closure receipt is valid only if its independently verified payload contains:

```json
{
  "disposition": "CLOSED",
  "dirtyWorktree": false,
  "failedExitConditionCount": 0,
  "unsupportedFactualClaimCount": 0,
  "metricMismatchCount": 0,
  "unverifiedQueryReceiptCount": 0,
  "missingArtifactBindingCount": 0,
  "schemaFailureCount": 0,
  "testFailureCount": 0
}
```

Each zero is a computed value backed by a named exit-query or test receipt. It MUST NOT be a caller-supplied assertion.

## Final closure rule

Neither roadmap row changes to `Closed` because files were added, focused tests were written, or most of the suite passes. A row changes only when the same clean revision and declared scope complete the entire pipeline above and an independent verifier recomputes every binding and every zero-valued exit condition.

At the recorded baseline:

- large-artifact queryability is proven;
- metric pointer resolution is proven for the selected artifacts;
- documentation closure is **not proven**;
- repository-wide forward/reverse reachability is **not proven**.
