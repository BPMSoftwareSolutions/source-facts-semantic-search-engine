# Deterministic Traceability Gap Closure Implementation Strategies

**Status:** Deterministic-documentation implementation gates closed; release closure and reverse-reachability closure remain open

**Evidence date:** 2026-08-04

**HEAD observed:** `cee3eebdbe4cc3f173726d006ec70a3331cc3ec1`

**Revision qualification:** The evidence below was regenerated from a dirty shared working tree after the implementation changes. It proves the local deterministic-documentation gates, but it is not a clean-revision release closure receipt and does not close the separate reverse-reachability strategy.

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
| `src/` | 95 files, 5,555 symbols, 24,997 relationships; index `sha256:7d66fad11dfdc44847b0607a6951c9ba393872958f29fe9471f2281b5713ff65`; scan `eb258103cfcd672b63783ae909690d0872e499f0dc628f7b762907a0a462d317` |
| `test/` | 33 files, 1,098 symbols, 7,692 relationships; index `sha256:3ab329138891d586afcf5488a5e290c2f2a14e1b15fe226e13b6e5a94dc3cf6b`; scan `abb234399f4b975ea1e5deb7c2e01ac01cf1c32c8794c782e424911e0c786aca` |
| `contracts/` | 37,929 document facts; index `sha256:82e2289554658a13d7bb2ce37fa9865a12331d2a4b5b67383a7acccdf43e7c19`; scan `8ba6238fcf5c92992d4f6e69e279fd3f13cd3063584ae8f8ac03caefd110e9b2` |
| Fresh graph | Not regenerated in the documentation-only closure pass; the prior reachability evidence remains evidence for Strategy 2 only |

The current contract projection succeeds. This closes the invalid-receipt-schema blocker recorded in the earlier baseline, but it does not supply the still-missing versioned call-graph schema.

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
| `D-GENERATOR-SURFACE` | `sha256:dc41396d1a6596695baee84ad1fbd12c593f3e5b6cf16936a5cc461a30990613` | `sha256:a7b92ce7a38aa16e4fc946a99a3cc7f13ac17153277db3df50c28bb695256a29` | 29 | Current generator implementation functions |
| `D-CATALOG-CLAIMS` | `sha256:f191152d75f652b71c2b6f523c78eff4c769f17e2227d7a4ebd08534901f956c` | `sha256:108b8c891e909bab7ea2e3f407e5345c9308a7b197d60804ed0e82bd0f089347` | 2 | Catalog has 36 factual and 5 derived metrics |
| `D-CATALOG-QUERIES` | `sha256:081ec0732b3fd699d95100a4aa3120035a35795881a93efeb5ab8c60763d7e7a` | `sha256:b3e63b28edc4997a2c317e4520010032b9197abc127842f9fb76de4ec80d35e1` | 1 | All 36 factual metrics have catalog-owned query text |
| `D-REPORT-FACTS` | `sha256:dc1cedf...` | `sha256:9afbeb98...` | 5 | Real report identity and baseline values |
| `D-GRAPH-FACTS` | `sha256:e48f9fd...` | `sha256:43562dc...` | 5 | Fresh graph identity and summary values; one requested pointer was absent |
| `D-CATALOG-MODES` | `sha256:bd50581...` | `sha256:b7b7c88...` | 5 | 41 catalog metrics partitioned by value mode |
| `D-RECEIPT-CHECKS` | `sha256:ee53c88fd776f1c1b8abd7c9f97d0704884fbb77e06d853f744d3a32b99e0da9` | `sha256:5efa5efe196175bc5b22ebc14bd823d3f5870383dc14353a7c3c437fa550e6c2` | 31 | Verifier re-executes the catalog query and compares input/result proof fields |
| `D-CLOSURE-FIELDS` | `sha256:20226905796eaaacf9d24604ae053af1c2a098b1c2091731b0194f70d507b55e` | `sha256:d76541cbad7ca16d5817e22dd17493e3715ff146a0e6330d57484b563a6a4c4a` | 51 | Closure builder binds ordered receipts, metrics, artifacts, conditions, and document hash |
| `D-GENERATOR-CALLS` | `sha256:d04b6266068bd4db78c441bf3d3b50379088bbdc9136d248c01d246c46394c9b` | `sha256:41bff0a949af7f620a2dc10f4a3a8fbd8ee61d95aeb4718c2c2b12a11a27df27` | 31 | Generator validates, reconciles, closes, then writes output |
| `D-TEST-HELPERS` | `sha256:73a0235...` | `sha256:62e1aa5...` | 5 | Generator tests construct minimal artifacts and receipts |
| `R-SURFACE` | `sha256:9904ce0...` | `sha256:0f864fd...` | 9 | Reachability implementation surface |
| `R-ORCHESTRATION` | `sha256:bfb9110...` | `sha256:08383e3...` | 5 | Top-level graph projection invokes all five inventory stages |
| `R-TEST-COVERAGE` | `sha256:a8a1568...` | `sha256:956a39d...` | 1 | Tests call graph projection but not reverse lookup |
| `R-EXPORT-FACTS` | `sha256:e03bed1...` | `sha256:8c34528...` | 1 | All 710 callable rows have `isExported = null` |

Hashes are abbreviated only in this human-readable register. A machine receipt MUST retain all 64 hexadecimal characters.

## Strategy 1: deterministic documentation generation

### Current disposition

**`IMPLEMENTATION_GATES_CLOSED_RELEASE_RECEIPT_PENDING`**

Confirmed progress:

- large JSON and contract projection complete;
- CLI options are wired and unknown options are rejected;
- all 36 factual metrics own exact query text; the 5 derived metrics own formulas rather than ceremonial queries;
- report and graph JSON are canonically projected into artifact-specific SourceFacts query inputs;
- supplied receipts are replayed through `executeRelationalQuery` and reconciled to the rendered metric value;
- the exact catalog-required receipt set is enforced before output;
- the closure receipt binds artifact, catalog, ordered query-receipt, metric-row, closure-condition, and document hashes;
- repeated identical inputs produce byte-identical Markdown and the same deterministic closure hash;
- the focused generator suite is 16/16 and the full suite is 170/170.

Remaining release-level blockers are outside this implementation tranche: a clean immutable revision receipt, the separate call-graph/reverse-reachability closure, and any repository-wide release policy that requires those gates together.

Queries used to establish the current implementation and caller surfaces, both run against `$srcIndex`:

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'generate-traceability-docs.js'
  AND kind = 'function'
ORDER BY name
```

This returned 29 functions with input hash `sha256:dc41396d1a6596695baee84ad1fbd12c593f3e5b6cf16936a5cc461a30990613` and result hash `sha256:a7b92ce7a38aa16e4fc946a99a3cc7f13ac17153277db3df50c28bb695256a29`.

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

**Status:** Implementation gate passes.

These are the current catalog queries, run against the freshly projected `$contractIndex`.

```sql
SELECT valuePreview AS claimType, COUNT(*) AS metricCount
FROM documents
WHERE relativePath = 'traceability-metric-catalog.json'
  AND pointer LIKE '/metrics/%/claimType'
GROUP BY valuePreview
ORDER BY valuePreview
```

Receipt: input hash `sha256:f191152d75f652b71c2b6f523c78eff4c769f17e2227d7a4ebd08534901f956c`; result hash `sha256:108b8c891e909bab7ea2e3f407e5345c9308a7b197d60804ed0e82bd0f089347`; 2 rows: `factual = 36`, `derived = 5`.

```sql
SELECT COUNT(*) AS queryTextCount
FROM documents
WHERE relativePath = 'traceability-metric-catalog.json'
  AND pointer LIKE '/metrics/%/query/queryText'
```

Receipt: input hash `sha256:081ec0732b3fd699d95100a4aa3120035a35795881a93efeb5ab8c60763d7e7a`; result hash `sha256:b3e63b28edc4997a2c317e4520010032b9197abc127842f9fb76de4ec80d35e1`; 1 row with `queryTextCount = 36`. Thus every factual metric has catalog-owned query text and derived metrics do not need invented receipt evidence.

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

A deterministic pointer audit over the selected artifacts resolved all current artifact pointers. That audit is now enforced by executing each factual catalog query against the artifact selected by `source.artifactKind` and requiring one numeric column named `value` whose value equals the resolved metric.

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

**Status:** Traceability contracts pass; the broader call-graph contract gate remains open.

The exact projection command used was:

```powershell
node src/cli.js project --workspace ./contracts `
  --workspace-id gap-closure-current-contracts `
  --output $contractIndex --summary
```

It completed with 37,929 document facts and scan ID `8ba6238fcf5c92992d4f6e69e279fd3f13cd3063584ae8f8ac03caefd110e9b2`. The metric-catalog, query-receipt, and documentation-closure-receipt schemas compile in the 170/170 full test run. No versioned call-graph schema is present yet, so D3 as a whole is not a release-closure gate pass.

Required implementation impact:

- retain receipt and closure schemas as valid JSON and JSON Schema;
- add a versioned call-graph schema and validator;
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

**Status:** Implementation gate passes.

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

Current receipt: input hash `sha256:ee53c88fd776f1c1b8abd7c9f97d0704884fbb77e06d853f744d3a32b99e0da9`; result hash `sha256:5efa5efe196175bc5b22ebc14bd823d3f5870383dc14353a7c3c437fa550e6c2`; 31 rows.

The rows include `executeRelationalQuery`, `inputHash`, `resultHash`, `rowCount`, `queryText`, `queryTextHash`, `artifactContentHash`, catalog binding fields, artifact kind, index ID, and scan ID. The implementation now performs the algorithm below.

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

Implemented rejection tests:

- one-character query change;
- catalog change without receipt regeneration;
- artifact content change with unchanged internal ID;
- correct-looking but fabricated input hash;
- correct-looking but fabricated result hash;
- wrong row count;
- query result that is not exactly one numeric `value` column;
- real query result whose `value` differs from the catalog-resolved metric;
- missing or unexpected receipt IDs.

Graph and report metrics are replayed against deterministic, canonical document-fact projections of their own artifacts. Source-index metrics are replayed against the source index itself. A receipt executed against the wrong artifact is rejected by `QUERY_RECEIPT_INPUT_HASH_MISMATCH`.

**Exit query ID:** `traceability.query-receipt-verification.v1`

**Observed result:** focused tests reject forged query text, input hash, result hash, row count, artifact content hash, catalog fingerprint, wrong artifact input, metric mismatch, and non-exact receipt sets. No supplied hash is accepted without fresh engine execution.

### D5 — Closure receipt binds the whole proof

**Status:** Local documentation-closure gate passes; clean-revision release binding remains a separate gate.

#### Query used to inspect the closure builder

```sql
SELECT toSymbolCandidate, COUNT(*) AS occurrenceCount
FROM relationships
WHERE fromSymbolId =
  'generate-traceability-docs.js#function:buildsClosureReceipt'
  AND relationshipKind IN ('member-access', 'invocation')
GROUP BY toSymbolCandidate
ORDER BY toSymbolCandidate
```

Current receipt: input hash `sha256:20226905796eaaacf9d24604ae053af1c2a098b1c2091731b0194f70d507b55e`; result hash `sha256:d76541cbad7ca16d5817e22dd17493e3715ff146a0e6330d57484b563a6a4c4a`; 51 rows.

The current closure payload binds source/report/graph content and identity, canonical catalog content and fingerprint, the ordered query-receipt rows, metric rows, document basename and content hash, closure conditions, and failed-condition summary. `validatesTraceabilityClosureReceiptIntegrity` independently recomputes the bundle hash, metric-row hash, conditions, disposition, and deterministic receipt hash. Altering the document hash is covered by a negative integrity test.

A valid closure receipt MUST include:

- clean commit ID and repository-content or subject-scope hash for release closure;
- source index ID, scan ID, schema version, and content hash;
- report and graph content hashes plus their internal source bindings;
- catalog version and canonical content hash;
- receipt-bundle hash and an ordered list of every query ID, query-text hash, input hash, result hash, row count, and disposition;
- rendered metric rows with source receipt IDs;
- factual Markdown hash calculated without uncontrolled metadata;
- every exit-query receipt;
- final disposition and zero failed conditions.

**Observed local exit:** changing a bound document hash invalidates verification; `generatedAtUtc` is added after the deterministic digest; absolute temporary directories are excluded by binding only the document basename. A clean commit and contract-index binding remain required before calling this a repository release closure.

### D6 — Renderer is byte-stable and claim-reconcilable

**Status:** Implementation gate passes.

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

Current receipt: input hash `sha256:d04b6266068bd4db78c441bf3d3b50379088bbdc9136d248c01d246c46394c9b`; result hash `sha256:41bff0a949af7f620a2dc10f4a3a8fbd8ee61d95aeb4718c2c2b12a11a27df27`; 31 rows. The rows include calls to artifact-specific projection, exact-receipt-set validation, metric resolution, closure evaluation, closure integrity validation, and final writes. No uncontrolled timestamp is rendered into Markdown.

Implemented behavior:

1. Omit uncontrolled time from factual Markdown.
2. Resolve every factual metric only after its catalog query is freshly executed.
3. Require exactly one numeric column named `value` and compare it to the catalog-resolved metric.
4. Render metric IDs and source query IDs in the factual table.
5. Hash the final Markdown into the closure receipt.
6. Generate twice from identical admitted inputs and compare raw document bytes and deterministic receipt hashes.

**Exit query IDs:** `traceability.rendered-claim-provenance.v1`, `traceability.metric-reconciliation.v1`, and `traceability.documentation-byte-stability.v1`.

**Observed results:** the mismatch mutation fails with `QUERY_RESULT_METRIC_MISMATCH`; the byte-stability test proves equal raw Markdown bytes, equal document hashes, and equal deterministic closure hashes across different temporary parent directories.

### D7 — Tests exercise real contracts and real queries

**Status:** Implementation test gate passes.

Commands actually used:

```powershell
node --test test/generate-docs.test.js
npm test
```

Observed focused result: 16 tests, 16 passed, 0 failed.

Observed full result after the workspace governance gate: 170 tests, 170 passed, 0 failed.

The test index query used to inventory helpers was:

```sql
SELECT symbolId, name, sourceReferenceId
FROM symbols
WHERE modulePath = 'generate-docs.test.js'
  AND kind = 'function'
ORDER BY name
```

The current success helpers construct production-schema-valid artifacts and build receipts by calling `executeRelationalQuery`. Mutation tests alter one verified field at a time. The suite also exercises canonical artifact projection, wrong-artifact replay, exact receipt-set enforcement, query/metric reconciliation, closure-integrity mutation, and two-run byte stability.

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
| 1 | Repair receipt JSON/schema and add closure schema | Complete: contract projection succeeds |
| 2 | Make test fixtures production-schema-valid | Complete: focused tests reach intended assertions |
| 3 | Implement independent receipt replay verification | Complete: forged/stale mutations rejected |
| 4 | Complete local documentation closure provenance | Complete: bound document mutation invalidates closure |
| 5 | Remove uncontrolled time from deterministic output | Complete: identical-input byte stability passes |
| 6 | Add rendered-claim reconciliation | Complete: mismatched query value fails closed |
| 7 | Run full suite | Complete: 170 of 170 passes |
| 8 | Add call-graph schema and clean-revision release binding | Open: required for repository release closure |

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

At the current recorded baseline:

- large-artifact queryability is proven;
- catalog-owned factual query coverage, artifact-specific replay, metric reconciliation, exact receipt-set enforcement, local closure integrity, and byte stability are proven by current SourceFacts receipts and the 170/170 test run;
- local deterministic-documentation closure is proven for schema-valid supplied artifacts;
- clean-revision repository release closure is **not proven** because revision/contract-index and call-graph schema gates remain open;
- repository-wide forward/reverse reachability is **not proven**.
