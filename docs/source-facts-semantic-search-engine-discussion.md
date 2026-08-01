# Source-facts semantic-search engine: implementation research and evidence

> Research snapshot: 2026-08-01. The implementation target is initially
> `C:\lab\repos\contract-driven-artifact-governance-engine`; the design is kept
> extensible to `C:\lab\repos`,
> `C:\source\repos\bpm\intelligence\01-cognitive-governance\ai-engine`, and
> `C:\source\repos\bpm\intelligence\01-cognitive-governance\cognitive-codebase`.

## Executive conclusion

This engine can be implemented without inventing the entire extraction and
query stack. Four adjacent repositories already contain useful, executable
parts:

1. `source-code-taxonomy-scanner` parses TypeScript and emits deterministic,
   source-located taxonomy facts and receipts.
2. `sej-runtime-query` executes relational queries over JSON sources and can
   project and present query results.
3. `source-integrity-registry` supplies contained-path resolution, byte-level
   SHA-256 identity, stable observation, schema admission, and drift receipts.
4. `contract-driven-artifact-governance-engine` supplies both the first real
   corpus and an independent, contract-aware source observer against which the
   new facts can be compared.

There is nevertheless no finished source-facts semantic-search engine today.
The reusable pieces stop at important boundaries:

- the scanner admits only `.ts`, `.tsx`, `.mts`, and `.cts`;
- it parses each file in isolation and does not bind a call to its resolved
  target symbol;
- its public source-fact JSON Schemas are placeholders containing `TODO`
  comments rather than enforceable record shapes;
- the query engine consumes in-memory JSON sources but is not a persistent
  source index, graph traversal engine, full-text index, or vector store;
- neither repository has a judged retrieval corpus that measures search
  precision or recall;
- no existing component joins observed source facts to the governance
  contract's declared `sourceAuthority`, ontology concepts, and artifacts.

The smallest credible first release is therefore an integration and hardening
release, not a new parser project:

```text
Governance-engine JavaScript corpus
        ↓
extended source-code-taxonomy-scanner profile
        ↓
concrete, versioned source-fact index + coverage receipt
        ↓
bound symbol and relationship pass
        ↓
SEJ Runtime Query over canonical JSON collections
        ↓
source / contract / ontology comparison views
        ↓
gold fixtures, mutation controls, and retrieval metrics
```

The MVP should remain deterministic. Exact structural search, relational
selection, and bounded graph traversal come first. Lexical ranking can follow.
Embedding search is an optional inferred layer and must never be presented as
declared or observed authority.

## What “semantic search” means here

The phrase must not collapse four different evidence classes into one claim.

| Layer | Mechanism | Evidence posture | MVP |
| --- | --- | --- | --- |
| Structural | AST kind, declaration, scope, type, call, branch, loop, effect | observed | yes |
| Relational | exact filters, joins, callers/callees, bounded traversal | derived deterministically from observed facts | yes |
| Lexical | token, phrase, prefix, proximity, and BM25 ranking over names/docs/body text | derived and ranked | later |
| Embedding | vector similarity and hybrid reranking | inferred relevance | optional, after evaluation |

This distinction preserves the import discipline established in the inspection
discussion:

```text
Source files provide observations.
Repeated structures provide candidates.
Human review provides meaning.
Promotion provides authority.
```

A structurally resolved query such as “which function calls
`executeSemanticAuthority`?” can have an exact answer. A query such as “where is
movement policy implemented?” may combine declared ontology links, lexical
ranking, and inferred candidates. Its response must expose which part came from
which evidence class.

## Point-in-time evidence and repository state

This discussion repository currently contains only this document. The evidence
comes from neighboring local repositories. Several of those worktrees contain
uncommitted changes, so the measurements below describe the observed local
filesystem on 2026-08-01, not a published package or clean Git revision. A real
receipt must always record repository identity, revision when available, dirty
state, input byte hashes, extractor version, and configuration digest.

The broad roots confirm that extension matters, but also confirm that a
whole-enterprise first release would be untestable. With common dependency,
build, generated, cache, temporary, and output directories excluded, a scoped
inventory found:

| Future corpus root | Candidate code files | Dominant admitted extensions |
| --- | ---: | --- |
| `C:\lab\repos` | 1,019 | 854 `.ts`, 130 `.mjs`, 31 `.js`, 4 `.html` |
| `...\ai-engine` | 6,675 | 4,247 `.py`, 1,273 `.sql`, 503 `.js`, 325 `.ts/.tsx`, 115 `.cs`, 97 `.mjs` |
| `...\cognitive-codebase` | 1,377 | 1,239 `.ts`, 79 `.js`, 15 `.mjs`, 14 `.sql`, 12 `.py` |

These are discovery counts, not a trusted inventory. Their exclusion rules were
command-line rules rather than a reviewed workspace policy, and the roots were
changing during research. The future product must emit admitted, excluded,
unsupported, unreadable, generated, and ignored counts instead of reporting
only the files that happened to parse.

The MVP corpus is deliberately smaller: the first-party JavaScript-family
source in `contract-driven-artifact-governance-engine`, excluding `.git`,
`node_modules`, and `release`.

## Existing implementation assets we can leverage

### 1. The source-code taxonomy scanner

Repository:
`C:\lab\repos\source-code-taxonomy-scanner`

Useful files:

| File or area | What is already real |
| --- | --- |
| `src/adapters/file-system/lists-source-files.ts` | recursive, ordinally sorted inventory with dependency/build exclusions |
| `src/adapters/file-system/reads-source-file.ts` | lexical workspace-escape check and SHA-256 content hashing |
| `src/adapters/typescript/parses-typescript-source.ts` | TypeScript 5 compiler-API parsing |
| `src/adapters/typescript/observes-typescript-node.ts` | full AST walk with kind, parent kind, operator, source offset, line, and column |
| `src/adapters/typescript/resolves-typescript-symbol.ts` | textual names for declarations, calls, construction, and imports |
| `src/registration/registers-scanner-semantic-authority.ts` | deterministic taxonomy application, fact IDs, root hash, scan ID, and receipt construction |
| `language-profiles/typescript/*.json` | reviewed declaration, control-flow, relationship, and unknown-syntax taxonomy packs |
| `proof/scenarios/*.test.ts` | deterministic positive scenario and unsupported-language negative scenario |
| `proof/conformance/*.test.ts` | adapter-purity, source-traceability, portability, and boundary tests |

The scanner is useful now, but its name `resolves-typescript-symbol.ts` is
stronger than its behavior. It extracts the source text of a name. It does not
create a TypeScript `Program`, ask a type checker for the referenced symbol, or
emit `fromSymbolId` and `toSymbolId`. Its current relationship fact is an
unbound occurrence.

The following schemas also exist but are not yet contracts in the validation
sense; each currently contains only `$schema` and a `TODO` comment:

```text
contracts/source-code-taxonomy-facts.schema.v1.json
contracts/source-declaration-fact.schema.v1.json
contracts/source-relationship-fact.schema.v1.json
contracts/source-control-flow-fact.schema.v1.json
contracts/source-code-taxonomy-receipt.schema.v1.json
```

The TypeScript interfaces in `src/types/` describe a usable initial shape, but
TypeScript types disappear at runtime. Concrete Draft 2020-12 schemas are a
first-release gate, not documentation polish. [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
provides the applicable dialect and validation vocabulary.

Current scanner scope is also narrower than the MVP corpus:

```text
admitted: .ts .tsx .mts .cts
missing:  .js .jsx .mjs .cjs
```

Its `typescript` dependency declares `^5.8.3` and the installed lock resolves
to 5.9.3. That stable compiler API is preferable for the first extractor over
silently importing the governance engine's TypeScript 7 dependency.

### 2. The SEJ Runtime Query engine

Repository:
`C:\lab\repos\sej-runtime-query`

Useful files:

| File or area | What is already real |
| --- | --- |
| `capabilities/executes-relational-query/` | parse, authorize, and execute a relational plan over named JSON sources |
| `test/integration/relational-query.test.mjs` | joins, grouping, `HAVING`, distinct, ordering, scalar functions, pagination, immutable resolved plans, and fail-closed cases |
| `capabilities/applies-semantic-projection/` | declared row- or result-scoped projection |
| `capabilities/presents-projected-query-result/` | presentation binding and canonical JSON fallback |
| `composition-root/exports-query-library.ts` | public library composition surface |
| `doorways/cli/q.ts` | CLI doorway |

This is a strong query evaluator for an MVP because source facts are already
JSON rows. It does not yet provide persistent indexing, recursive code-graph
operators, FTS, vector similarity, or repository ingestion. Those belong in
the source-facts engine or later adapters; they should not be implied by the
word “query.”

### 3. The source-integrity registry

Repository:
`C:\lab\repos\source-integrity-registry`

Useful exports from `src/index.ts` include:

```text
resolvesRealContainedPath
resolvesRealRoot
isContainedBy
digestsBytes
observesSourceBodies
admitsSchemaCatalog
createsSirSchemaValidator
```

`src/observation/observe-source-bodies.ts` also demonstrates a valuable
stable-snapshot discipline: resolve the real contained path, read bytes, stat
again, and reject an observable identity/size/mtime change. The source-facts
engine should reuse these exported primitives or their public package rather
than create a weaker path and digest implementation.

SIR's current body observation is whole-file and declaration-driven. It does
not replace the AST extractor. It supplies the file-identity and schema-
admission layer beneath it.

### 4. The governance engine as corpus and independent oracle

Repository:
`C:\lab\repos\contract-driven-artifact-governance-engine`

Its `lib/governed-artifact-engine.mjs` exports
`inspectSourceAuthority(text, language)`. The implementation tokenizes admitted
JavaScript/TypeScript and observes:

```text
static imports
ambient operations
top-level declarations
function forms and scopes
invocation occurrences and argument expressions
semantic operations
decisions and iterations
failure events
object projections
return expressions
syntax kinds
unresolved tokens/forms
```

`verifySourceAuthorityClosure` then compares these observations to each
artifact's declared `sourceAuthority`, including exact declarations,
responsibilities, semantic edges, decisions, iterations, failures,
projections, results, and forbidden syntax.

That observer is valuable as an independent oracle for narrow governed bodies.
It is not a general repository indexer. It uses token patterns, intentionally
normalizes expressions, and reports unresolved forms rather than constructing a
bound compiler graph.

The contract and ontology surfaces to index and compare are concrete:

```text
examples/procedural-dungeon-webpage.contract.json
schemas/governed-artifact-contract.schema.json
schemas/bound-semantic-execution-authority.schema.json
schemas/semantic-execution-bundle.schema.json
procedural-dungeon-webpage/browser-context.json
procedural-dungeon-webpage/contracts/*.bundle.json
procedural-dungeon-webpage/contracts/procedural-dungeon-application.authority.json
procedural-dungeon-webpage/src/*.mjs
lib/semantic-execution-runtime.mjs
lib/browser-semantic-runtime.mjs
lib/browser-application-runtime.mjs
verification-tools/*.mjs
test/fixtures/*-ontology.mjs
```

The current dungeon webpage contract contains 18 governed artifacts. Seven are
JavaScript-module artifacts with structured `sourceAuthority`; six are
deterministic ontology bundles; the rest include the interactive page, browser
context, application authority, port schema, and README. This provides declared
meaning, projected bodies, manually authored runtime/mechanical bodies, and
tests in one small artifact family.

## Measurements performed during this research

### Governance-engine AST feasibility scan

Using the installed TypeScript 7.0.2 native preview API through
`typescript/unstable/sync` and `typescript/unstable/ast`, an inferred project
was opened over the current first-party JavaScript-family corpus:

```text
requested/parsed files             37 / 37
source bytes                       625,125
AST nodes                           81,371
import declarations                   124
variable declarations               1,912
function-like nodes                  1,055
call expressions                     4,709
new expressions                        319
return statements                       676
decision nodes                        1,066
loop nodes                              307
syntactic diagnostics                     0
identifier call targets              2,164
identifier call targets with symbol  2,164
```

The last two counts cover identifier callees only, not every property access,
dynamic call, or constructed expression. They prove that bound lookup is
available; they do not prove a complete call graph.

This experiment also exposes a dependency decision. TypeScript 7's locally
installed API works, but its package explicitly exposes the surface under
`unstable/*`. Microsoft's current TypeScript 7 announcement says there is not
yet a stable programmatic API for tools that embed TypeScript. Therefore the
production extractor should keep using the scanner's pinned TypeScript 5.9 API
behind an adapter, while TypeScript 7 is retained as a parity experiment until
its API stabilizes. [Microsoft: Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)

### Governance observer whole-corpus stress test

The same current corpus was passed file-by-file through
`inspectSourceAuthority`:

```text
requested/scanned files          37 / 36
scanned bytes                    546,612
scanned lines                     16,514
functions                            574
invocation occurrence records      3,670
semantic-operation records          3,687
decisions                           1,443
iterations                            268
unresolved function forms             292
unresolved tokens                      34
fatal scan errors                       1
```

`test/engine.test.mjs` failed token scanning at offset 26,691. Twelve other
files reported unresolved tokens or function forms; the largest source file,
`lib/governed-artifact-engine.mjs`, contributed 133 unresolved function forms.
The backslash tokens observed in several files occur in regular-expression or
escaped source surfaces that the narrow observer does not classify.

This comparison is the clearest implementation evidence in the research:

```text
TypeScript AST parser: 37/37 files parsed, 0 syntax diagnostics
contract observer:      36/37 files scanned, unresolved coverage remains
```

The contract observer should remain the contract-closure oracle. A compiler
AST and checker should be the general source-fact extractor.

### Existing scanner and query proofs

The existing compiled scanner and its current authority passed:

```text
scanner conformance gates     3 / 3
scanner Node tests            7 / 7
```

A live self-scan produced:

```text
TypeScript files                 29
declaration facts               155
control-flow facts               65
relationship occurrences        309
syntax-classification facts     104
preserved unknown syntax      3,375
```

The 3,375 unknown nodes are not parse errors. They are an honest indication
that the reviewed taxonomy maps only a small subset of the full TypeScript AST.
The new engine must turn that into an explicit coverage report rather than
calling `SCAN_COMPLETED` alone sufficient for semantic completeness.

The current compiled SEJ query engine then passed nine focused integration
tests. Finally, a live composition fed the scanner's 155 declaration rows into
the query engine and executed:

```sql
SELECT kind, COUNT(*) AS count
FROM declarations
GROUP BY kind
ORDER BY count DESC, kind
```

It returned:

```text
variable     64
parameter    57
function     24
type-alias   10
```

That is an actual scanner-to-query path, not an architectural sketch.

### Governance proof status

The current 18-artifact procedural-dungeon gate returned:

```text
workspace authority  WORKSPACE_AUTHORITY_CLOSED
conformance          CONTRACT_AUTHORITY_CLOSED
trust posture        CONFORMS
trust                TRUSTED
```

The focused source-observation and scanner-termination tests passed 2/2. The
full governance-engine suite passed 57 of 59 tests. The two failures were the
existing release-boundary drift assertion and disallowed public vocabulary in
`examples/procedural-dungeon-fog-of-war.contract.json`. Those failures are not
source-extraction failures, but they must be recorded so the research does not
claim a globally green worktree.

## Recommended component boundary

The source-facts repository should be the integration and index owner, not a
copy of every neighboring implementation.

```text
source-integrity-registry
  owns contained file identity, byte digests, schema admission

source-code-taxonomy-scanner
  owns language profiles, parsing adapters, syntax observation

source-facts-semantic-search-engine
  owns canonical index schema, cross-file binding, query facade,
  graph traversal, authority alignment, evaluation corpus, receipts

sej-runtime-query
  owns authorized relational plan execution and result projection

contract-driven-artifact-governance-engine
  supplies the first corpus and contract-aware comparison oracle
```

The integration repository may initially consume adjacent packages through
local `file:` dependencies for development, but version and authority digests
must be captured in every receipt. A local path is not durable identity.

## Two operating modes

The engine needs the two modes described in the inspection discussions, backed
by the same fact index.

### Known-authority mode

```text
contract / ontology / governed body
        ↓
load declared facts and relationships
        ↓
observe physical source independently
        ↓
compare declaration to observation
        ↓
project region, body, alignment, and gaps
```

This mode can say that a relationship is declared, observed, both, or in
conflict. Only the governance engine's gate may confer its `TRUSTED`
disposition; the search engine reports and links gate evidence rather than
minting trust itself.

### Existing-implementation mode

```text
repository source
        ↓
observe syntax, symbols, topology, and bounded dataflow
        ↓
group evidence into candidate regions
        ↓
rank or explain candidates
        ↓
human review
        ↓
separate promotion workflow
```

Observed code is evidence of implementation, not canonical know-how. Candidate
semantic labels and embeddings belong to the `inferred` evidence class until a
human promotes them through the authority workflow.

## Canonical source-fact model

The existing four-collection idea remains sound, but the durable model needs
file identity, occurrences, diagnostics, and authority alignment as first-class
collections.

```json
{
  "indexType": "source-fact-index.v1",
  "indexId": "sha256:...",
  "manifest": {},
  "files": [],
  "symbols": [],
  "occurrences": [],
  "relationships": [],
  "controlFlow": [],
  "localDataflow": [],
  "authorityFacts": [],
  "alignments": [],
  "diagnostics": []
}
```

### Manifest

The manifest must make the observation reproducible:

```json
{
  "repositoryId": "contract-driven-artifact-governance-engine",
  "workspaceRoot": "<observation-only, not part of durable IDs>",
  "revision": {
    "gitCommit": "...",
    "dirty": true,
    "rootHash": "sha256:..."
  },
  "extractors": [
    {
      "languageProfileId": "javascript-typescript.v1",
      "adapterId": "typescript-compiler-api.v1",
      "adapterVersion": "5.9.3",
      "authorityDigest": "sha256:..."
    }
  ],
  "scope": {
    "includes": ["**/*.mjs", "**/*.js"],
    "excludes": ["node_modules/**", "release/**", ".git/**"],
    "policyDigest": "sha256:..."
  },
  "coverage": {
    "discovered": 37,
    "admitted": 37,
    "parsed": 37,
    "failed": 0,
    "unsupported": 0,
    "unresolvedRelationships": 0
  }
}
```

The numbers above illustrate the record; a production receipt must calculate
them from one stable observation rather than copy this research measurement.

### File identity

Durable IDs must never contain `C:\...` absolute paths. A file record needs:

```text
repositoryId
normalized repository-relative path
languageId
mediaType
contentSha256
sizeBytes
lineCount
authorship classification: manual | projected | generated | unknown
governance classification: governed | declared-only | ungoverned | unknown
```

`fileId` should be a digest of repository identity plus normalized relative
path. `fileVersionId` should additionally include the content hash. That lets a
file keep logical identity while its observed bytes change.

### Symbol identity

One identifier cannot serve both navigation and revision evidence.

```text
symbolId
  stable logical identity:
  repository + language + module + qualified name + kind + overload ordinal

symbolVersionId
  symbolId + normalized declaration-header digest

occurrenceId
  fileVersionId + syntax kind + UTF-16 start/end offsets
```

Line numbers are display locations, not identity. Adding a comment above a
function should not rename the function. Offsets belong on occurrences so an
exact source slice can always be revalidated against the recorded content hash.

Anonymous functions require a different posture. Their logical identity should
derive from a stable enclosing symbol plus a structural role and ordinal, while
the exact occurrence still uses offsets. If an extractor cannot establish that
identity, it must emit `anonymousIdentityUnresolved`; it must not pretend a
line-based label is stable.

### Source reference

The TypeScript compiler reports offsets in UTF-16 code units. The canonical
record must say so explicitly:

```json
{
  "fileVersionId": "sha256:...",
  "offsetUnit": "utf16-code-unit",
  "start": 120,
  "length": 24,
  "startLine": 8,
  "startColumn": 3,
  "endLine": 8,
  "endColumn": 27,
  "sliceSha256": "sha256:..."
}
```

Future Python, SQL, and C# profiles may expose different native offset
conventions. Each adapter must normalize to the contract or declare its unit;
implicit offset conversion is a source-link corruption risk.

### Relationship identity and resolution

A relationship is an occurrence-backed edge:

```json
{
  "relationshipId": "sha256:...",
  "relationshipKind": "calls",
  "fromSymbolId": "...",
  "target": {
    "resolution": "resolved",
    "symbolId": "..."
  },
  "sourceReferenceId": "...",
  "evidenceClass": "observed"
}
```

Unresolved edges are retained with a reason vocabulary:

```text
external-library-not-indexed
dynamic-property
dynamic-import
ambiguous-overload
parse-recovery
unsupported-syntax
missing-module
checker-unresolved
```

Completeness means every admitted occurrence is resolved or explicitly
classified. It does not mean pretending every dynamic JavaScript call has a
static target.

### Evidence class

Every fact and alignment must carry one of:

```text
declared   read from a contract, schema, ontology, or reviewed authority
observed   read mechanically from physical source or workspace state
derived    computed deterministically from declared/observed inputs
inferred   ranked, labeled, or proposed by heuristic or model
```

The record also carries `supportedBy` references and the rule/model/version
that produced it. This prevents a high similarity score from being displayed
as if a contract declared it.

## Extraction design for the MVP

### Phase 0: governed inventory

Add a repository-local scope document rather than hard-coding exclusions:

```text
source-facts.workspace.json
```

It declares:

```text
repositoryId
roots
include patterns
exclude patterns
language profiles
authority roots
generated/projected path rules
maximum file size
symlink posture
unreadable-file posture
unsupported-language posture
```

Inventory uses SIR containment and byte-digest primitives. The receipt includes
every disposition, including excluded files. This is how a “0 files scanned”
result is distinguished from successful empty input.

### Phase 1: JavaScript-family profile

Extend the existing scanner through a reviewed language profile rather than
placing JavaScript cases in the search engine. The TypeScript compiler adapter
can parse JavaScript-family syntax when given the correct `ScriptKind`:

```text
.ts/.mts/.cts   → TS
.tsx            → TSX
.js/.mjs/.cjs   → JS
.jsx            → JSX
```

The profile must preserve module-format information separately; `ScriptKind.JS`
does not by itself say whether a file is ESM or CommonJS.

### Phase 2: program and checker binding

Replace isolated `createSourceFile` extraction for relationship resolution with
a repository program:

```text
discover admitted roots
→ resolve tsconfig/jsconfig when present
→ otherwise create an explicit inferred-project configuration
→ build Program
→ walk source ASTs
→ ask TypeChecker for declaration/reference identity
→ emit symbols, occurrences, and resolved/unresolved edges
```

Parsing and binding stay distinct. A file may parse perfectly while imports or
types remain unresolved. Diagnostics need separate categories:

```text
inventory
decode
parse
bind
module-resolution
type-check
fact-projection
authority-alignment
```

For the governance engine, the inferred-project settings and dependency
resolution inputs must be written into the receipt. “The compiler found it” is
not reproducible configuration.

### Phase 3: bounded local dataflow

The first dataflow implementation should be intentionally small:

```text
parameter → local initializer
identifier read → assignment target
binary/unary expression inputs → result
local value → call argument position
expression → returned value or returned object field
indexed receiver/indexes → indexed value
```

Explicitly out of scope for v1:

```text
whole-program alias analysis
arbitrary heap/property mutation
closure capture across asynchronous lifetimes
reflection/eval
dynamic dispatch proof
interprocedural taint or security claims
```

Unsupported flows are diagnostics, not silently missing edges.

### Phase 4: authority ingestion and alignment

Load the dungeon contract through its admitted JSON Schema and emit declared
facts for:

```text
artifacts and relative paths
artifact relationships
sourceAuthority declarations and responsibilities
semantic edges and exact argument expressions
decisions, iterations, failures, projections, results
forbidden syntax
ontology concepts, relations, properties, and facts
ontology classifications, constraints, transformations, obligations, results
runtime authorities, dependencies, effects, proof requirements, and claims
```

Then join declared and observed records using explicit keys:

```text
contract relativePath ↔ observed file
declared declaration ↔ bound symbol in that file
declared operation ↔ observed call occurrence
artifact relationship ↔ file/symbol relationship
ontology authorityId ↔ projected bundle and adapter import
```

The result is not a Boolean alone:

```text
aligned
declared-not-observed
observed-not-declared
ambiguous
not-applicable
unresolved
```

The existing `inspectSourceAuthority` output is run in parallel for the seven
governed JavaScript-module artifacts. Agreement between the compiler extractor,
the contract observer, and the declaration is stronger evidence than making
the new extractor its own oracle.

## Query and storage design

### MVP: canonical JSON plus in-memory relational query

For the small governance corpus, persistence should be a canonical JSON index
and receipt. The existing query engine already accepts arrays of JSON objects,
so no database dependency is required to prove extraction, joining, and
projection.

The public query input should be a contract, even if the CLI accepts SQL text:

```json
{
  "queryType": "source-fact-query.v1",
  "queryId": "calls-semantic-runtime",
  "sourceIndexId": "sha256:...",
  "commandText": "SELECT ...",
  "limits": {
    "maxRows": 500,
    "maxTraversalDepth": 4,
    "maxVisitedEdges": 5000
  },
  "projectionId": "project-source-symbol-summary.v1"
}
```

The query receipt binds query digest, index digest, resolved plan digest,
limits, row counts, diagnostics, projection authority, and result digest.

Graph operations should be typed operations above the relational engine, not
fictional recursive SQL syntax:

```text
callers(symbolId, maxDepth)
callees(symbolId, maxDepth)
imports(fileId, maxDepth)
reads(symbolId)
writes(symbolId)
upstream(valueId, maxDepth)
downstream(valueId, maxDepth)
```

Every traversal needs deterministic ordering, a visited set, cycle reporting,
and hard depth/edge ceilings. Its output becomes an ordinary JSON source that
SEJ Runtime Query can further filter and project.

### Later: SQLite/FTS adapter

SQLite is a reasonable larger-corpus adapter because FTS5 provides phrase,
prefix, `NEAR`, Boolean, `highlight`, `snippet`, and BM25 ranking. It is lexical
full-text search, not embedding search. [SQLite FTS5](https://www.sqlite.org/fts5.html)
documents the query and ranking behavior, while SQLite's
[JSON functions](https://www.sqlite.org/json1.html) can retain structured
payloads alongside normalized columns.

There is a runtime constraint: Node's built-in `node:sqlite` was added in Node
22.5.0, while the current repositories admit Node 20. The MVP therefore must
not quietly depend on `node:sqlite`. A later SQLite adapter must either raise
the runtime floor through an explicit decision or use a separately reviewed
binding behind a storage port. [Node.js SQLite API](https://nodejs.org/download/release/latest-v25.x/docs/api/sqlite.html)
records the addition version.

### Optional embeddings

No inspected repository currently contains an embedding model, vector index,
or judged vector-search pipeline. An embedding phase must therefore be a new,
optional adapter with:

```text
model identity and version
input text projection identity
chunk/symbol identity
vector dimension and normalization
index build digest
similarity function
top-k and reranking policy
evaluation-corpus version
```

Embedding hits are `inferred`. They can retrieve candidate symbols or regions,
but they cannot prove a call edge, dataflow, contract alignment, or semantic
authority.

## Revealing know-how across contracts, ontology, and code bodies

The index should answer the same question through three connected evidence
planes.

### Declared contract plane

Answers:

```text
Which artifacts and bodies are governed?
What responsibility, dependency, effect, and result is declared?
What syntax is forbidden?
What proof is required?
```

### Declared ontology plane

Answers:

```text
What concepts, facts, classifications, constraints, obligations,
transformations, iterations, and results define the domain region?
```

### Observed implementation plane

Answers:

```text
What modules, functions, calls, branches, iterations, effects,
state reads/writes, and local flows physically exist?
```

An inspection projection can then show:

```text
Region: Dungeon Movement

Declared ontology
  movement-request
  target arithmetic
  indexed grid read
  floor/wall classification
  movement result

Declared source authority
  movement-adapter.v1
  resolveMovement
  executeSemanticAuthority(bundle, request)
  one direct return

Observed source
  src/movement-adapter.mjs
  imported runtime and bundle
  bound resolveMovement symbol
  bound call occurrence and arguments
  return occurrence

Alignment
  declared and observed adapter agree
  ontology bundle is the observed call input
  page/runtime consumers are traversable

Candidate unmodeled know-how
  post-movement browser refresh sequence
  evidence class: inferred
```

This is how the engine reveals know-how without claiming that every code shape
is already ontology.

## Accuracy verification plan

“Accuracy” must be decomposed. A single percentage would hide important
failures.

### 1. Inventory accuracy

For every workspace:

```text
expected admitted files
observed admitted files
excluded files by rule
unsupported files by extension/language
unreadable files
parse failures
files changed during observation
```

The MVP fixture has an explicit expected manifest. Add/remove/rename mutations
must change the receipt and produce the correct finding.

### 2. Parser and location accuracy

For every AST occurrence in the gold corpus:

```text
syntax kind matches expected
source file matches expected
offset/length slice hashes to the expected bytes
line/column recompute to the same offset
parent/enclosing symbol is correct
parse diagnostics are preserved
```

Include non-ASCII identifiers, CRLF/LF variants, comments, templates, regexes,
private fields, JSX, import attributes, and nested anonymous functions.

### 3. Symbol identity stability

Metamorphic tests must prove:

```text
whitespace/comment insertion keeps symbolId
line movement keeps symbolId
declaration rename changes symbolId
signature/header change changes symbolVersionId
body-only change keeps symbolId but changes fileVersionId and affected occurrences
same name in different scopes produces different IDs
overloads and merged declarations remain deterministic
```

### 4. Relationship precision and recall

Create hand-labeled fixtures for:

```text
local call
imported call
aliased import
re-export
namespace import
default import
class/static/instance method
constructor
shadowed name
callback and arrow function
recursive call
dynamic import
computed property
missing external dependency
```

For statically resolvable cases, compare the emitted edge set to the gold edge
set and report precision, recall, and exact-set equality. Dynamic cases must
match the expected unresolved reason. No edge may disappear silently.

### 5. Local-dataflow accuracy

Each supported flow primitive has positive and negative fixtures. Compare the
entire edge set, not a visual snapshot. Mutation controls change an operator,
argument position, assignment target, or returned field and require the fact
digest and query result to change.

### 6. Contract/ontology alignment accuracy

Use the seven governed JavaScript adapters as the initial oracle set:

1. read the declared `sourceAuthority` from the contract;
2. extract compiler facts from the projected body;
3. run `inspectSourceAuthority` independently;
4. run the existing contract gate;
5. compare all declared responsibilities and source operations;
6. mutate one fact class at a time in a temporary fixture and require the
   expected alignment finding.

Positive agreement alone is insufficient. Required negative controls include
an extra call, missing return, renamed declaration, branch insertion,
undeclared import, changed argument expression, forbidden syntax, and body
drift.

### 7. Query correctness and determinism

Every query fixture binds:

```text
source index digest
query digest
expected ordered row IDs
expected traversal diagnostics
expected result digest
expected projection
```

Execute each query twice, concurrently, and after irrelevant input-key
reordering. Results must be byte-identical under canonical serialization. Test
cycle and ceiling behavior for graph traversal.

### 8. Retrieval quality

Lexical or embedding search needs a separate judged corpus:

```json
{
  "query": "where is movement legality decided?",
  "relevant": [
    { "symbolId": "...resolveMovement", "grade": 2 },
    { "authorityId": "dungeon-movement", "grade": 3 }
  ]
}
```

Report at least Precision@k, Recall@k, reciprocal rank/MRR, and nDCG for graded
results. TREC's published [common evaluation measures](https://trec.nist.gov/pubs/trec16/appendices/measures.pdf)
provide standard definitions. Search accuracy is not established by showing a
few plausible examples.

### 9. Coverage as a terminal disposition

Recommended dispositions:

```text
INDEX_COMPLETE
INDEX_PARTIAL_UNSUPPORTED_LANGUAGE
INDEX_PARTIAL_PARSE_FAILURE
INDEX_PARTIAL_BIND_FAILURE
INDEX_PARTIAL_CHANGED_DURING_OBSERVATION
INDEX_INVALID_CONTRACT
INDEX_UNTRUSTED_INPUT_IDENTITY
```

A query receipt inherits the index coverage disposition. It must not answer
from a partial index as if the corpus were complete.

## Proposed implementation files

The discussion-only repository can grow into this small integration package:

```text
source-facts-semantic-search-engine/
├── package.json
├── source-facts.workspace.json
├── contracts/
│   ├── source-fact-index.schema.v1.json
│   ├── source-fact-query.schema.v1.json
│   ├── source-fact-query-receipt.schema.v1.json
│   ├── source-authority-alignment.schema.v1.json
│   └── source-fact-evaluation-corpus.schema.v1.json
├── src/
│   ├── inventory/
│   │   └── observes-workspace-manifest.ts
│   ├── extraction/
│   │   ├── invokes-source-taxonomy-scanner.ts
│   │   ├── binds-typescript-program-symbols.ts
│   │   └── extracts-local-dataflow.ts
│   ├── authority/
│   │   ├── loads-governed-artifact-contract.ts
│   │   └── aligns-declared-and-observed-source.ts
│   ├── index/
│   │   ├── projects-canonical-source-index.ts
│   │   └── validates-source-index.ts
│   ├── query/
│   │   ├── executes-source-fact-query.ts
│   │   └── traverses-source-topology.ts
│   └── projection/
│       ├── projects-symbol-summary.ts
│       ├── projects-call-tree.ts
│       └── projects-authority-alignment.ts
├── test/
│   ├── fixtures/source/
│   ├── fixtures/expected-facts/
│   ├── fixtures/queries/
│   ├── fixtures/relevance-judgments/
│   └── integration/governance-engine-corpus.test.ts
└── bin/source-facts.ts
```

Enhancements that belong upstream in `source-code-taxonomy-scanner`:

```text
language-profiles/javascript/*
concrete source-fact schemas
ScriptKind selection by extension
program/checker observation port
coverage and diagnostic facts
gold JavaScript fixtures
```

The source-facts engine should not patch generated scanner bodies directly;
changes begin in that repository's authority/profile/projection workflow.

## CLI proof path

The first useful commands can remain few:

```bash
source-facts inventory --config source-facts.workspace.json

source-facts index \
  --config source-facts.workspace.json \
  --out .source-facts/source-facts.index.json \
  --receipt .source-facts/source-facts.receipt.json

source-facts query \
  --index .source-facts/source-facts.index.json \
  "SELECT name, relativePath FROM symbols WHERE kind = 'function'"

source-facts calls \
  --index .source-facts/source-facts.index.json \
  --symbol <symbol-id> \
  --depth 3

source-facts align \
  --index .source-facts/source-facts.index.json \
  --contract ../contract-driven-artifact-governance-engine/examples/procedural-dungeon-webpage.contract.json
```

The commands must expose index coverage and receipt identity before results.
`--allow-partial` may permit investigation, but it cannot relabel a partial
index as complete.

## Extensibility to the broader codebases

The large roots change the profile roadmap, not the MVP acceptance standard.
Every language adapter implements the same boundary:

```typescript
interface SourceLanguageAdapter {
  languageProfile(): LanguageProfile;
  discover(request: DiscoveryRequest): Promise<DiscoveredFile[]>;
  parse(file: ObservedFile): Promise<ParseObservation>;
  bind(project: ProjectObservation): Promise<BindingObservation>;
  projectFacts(observation: BindingObservation): Promise<CanonicalFactSet>;
}
```

The actual contract should be JSON Schema plus a port identity; the interface
above only illustrates the mechanical TypeScript seat.

Suggested promotion order after the JavaScript governance MVP:

1. TypeScript/TSX through the existing profile and gold corpus.
2. Python because `ai-engine` contains more than four thousand candidate `.py`
   files after coarse exclusions.
3. SQL because the same root contains more than twelve hundred `.sql` files and
   SQL requires statement/object lineage rather than pretending functions are
   universal.
4. C# for the real SDK/solution surfaces.
5. HTML/CSS cross-surface facts for domain-region inspection.

Language-neutral does not mean reducing every language to “function” and
“call.” Canonical facts should have a common spine plus language-profile
extensions. SQL tables/procedures/CTEs, Python decorators/import semantics, C#
namespaces/properties/attributes, and HTML/CSS bindings retain their native
structure.

Each new profile must ship:

```text
profile authority
admitted extensions
parser and version
taxonomy mapping
unsupported-syntax policy
gold source fixtures
expected fact sets
negative controls
cross-version compatibility tests
coverage thresholds
```

## MVP acceptance criteria

The first release is acceptable when all of the following are mechanically
proved for the governance-engine corpus:

1. A reviewed scope policy inventories every first-party JavaScript-family
   file and classifies every exclusion.
2. Every admitted file parses, or the index terminates with an explicit partial
   disposition; zero parse failures is the release target.
3. Concrete JSON Schemas validate the index, queries, alignments, evaluation
   corpus, and receipts with `additionalProperties: false` where the contract is
   closed.
4. Logical symbol IDs survive whitespace, comments, and line movement; version
   and occurrence IDs change at the documented boundaries.
5. Every supported relationship fixture matches its exact gold edge set, and
   every unsupported/dynamic occurrence has a declared unresolved reason.
6. Source references reproduce the exact recorded slice against the file hash.
7. The scanner-to-SEJ relational query integration runs from source, not only
   from pre-existing compiled output.
8. Callers/callees traversal is deterministic, cycle-safe, and bounded.
9. All seven governed adapter bodies produce declared-versus-observed alignment
   records and agree with the independent contract observer on the positive
   corpus.
10. Negative mutations produce the expected inventory, syntax, relationship,
    dataflow, or alignment finding.
11. Query receipts bind index, query, plan, limits, projection, and result
    digests.
12. A small, reviewed relevance corpus reports retrieval metrics before any
    lexical or embedding claim is promoted.
13. No search result or candidate can mint the governance engine's `TRUSTED`
    disposition.

## Delivery sequence

### Milestone 1: executable structural search

```text
concrete v1 fact schemas
JavaScript-family scanner profile
stable file/symbol/occurrence identity
canonical JSON index and coverage receipt
SEJ relational query facade
symbol summary and exact source projection
```

### Milestone 2: topology and governance alignment

```text
program/checker binding
resolved and explicitly unresolved relationships
bounded callers/callees traversal
contract/ontology ingestion
declared-vs-observed alignment
governed adapter gold and mutation corpus
```

### Milestone 3: bounded flow and domain-region views

```text
local dataflow subset
effect classification with declared rules
region grouping supported by explicit evidence
call-tree, dataflow, and alignment projectors
```

### Milestone 4: scale and ranked retrieval

```text
incremental manifests and sharded index format
SQLite/FTS storage adapter after a runtime decision
lexical relevance corpus and metrics
optional embedding/hybrid adapter
Python, SQL, C#, HTML, and CSS profile promotion
```

This sequence starts small, proves useful source-fact search on one real
repository, and preserves the extension seams required by the much larger
enterprise codebase.

---

# Prior discussion and conceptual direction

Yes—this makes a lot of sense. What you’re describing is essentially a **semantic search engine over source-code facts**, where the query result can be projected into multiple useful forms:

```text
Source code
    ↓
AST extraction
    ↓
Normalized symbol graph
    ↓
Queryable JSON facts
    ↓
Semantic queries
    ↓
Code / tree / graph / Markdown projection
```

The powerful part is that the code itself stops being the only practical interface to the codebase.

The durable JSON representation becomes the **inspection and retrieval plane**, while the source remains the executable body.

# The basic code-knowledge model

For Node and TypeScript, the first layer is straightforward:

```text
Repository
├── Module
├── Import
├── Export
├── Function
├── Method
├── Class
├── Type
├── Interface
├── Constant
├── Variable
├── Parameter
├── Call
├── Return
├── Assignment
├── Branch
└── Iteration
```

Each observed symbol becomes a queryable record.

For example:

```json
{
  "symbolId": "src/render-page.ts#renderPage",
  "symbolKind": "function",
  "name": "renderPage",
  "modulePath": "src/render-page.ts",
  "exported": true,
  "async": true,
  "parameters": [
    {
      "name": "request",
      "type": "RenderPageRequest"
    }
  ],
  "returnType": "Promise<RenderedPage>",
  "sourceRange": {
    "startLine": 12,
    "endLine": 28
  }
}
```

A constant:

```json
{
  "symbolId": "src/config.ts#DEFAULT_LAYOUT",
  "symbolKind": "constant",
  "name": "DEFAULT_LAYOUT",
  "modulePath": "src/config.ts",
  "declaredType": "LayoutKind",
  "initializerKind": "string-literal",
  "literalValue": "responsive-two-column"
}
```

The first win is simple:

> Every symbol has identity, type, location, and classification.

But the real value begins when you store the relationships.

# Symbols are nodes; observations are edges

A function is not very useful as an isolated record. It becomes valuable when connected to everything it touches.

```text
renderPage
├── accepts → RenderPageRequest
├── calls → resolveLayout
├── calls → renderSections
├── reads → DEFAULT_LAYOUT
├── returns → RenderedPage
├── declared-in → src/render-page.ts
└── exported-by → src/render-page.ts
```

That can be represented with explicit relationship facts:

```json
{
  "relationshipId": "call:renderPage:resolveLayout:1",
  "relationshipKind": "calls",
  "fromSymbolId": "src/render-page.ts#renderPage",
  "toSymbolId": "src/resolve-layout.ts#resolveLayout",
  "sourceReference": {
    "modulePath": "src/render-page.ts",
    "line": 17,
    "column": 24
  }
}
```

And variable usage:

```json
{
  "relationshipKind": "reads",
  "fromSymbolId": "src/render-page.ts#renderPage",
  "toSymbolId": "src/config.ts#DEFAULT_LAYOUT",
  "sourceReference": {
    "modulePath": "src/render-page.ts",
    "line": 16,
    "column": 42
  }
}
```

Now you have a **code topology**.

# Separate taxonomy from topology

This distinction will make the querying much cleaner.

## Taxonomy

What kind of thing is this?

```text
function
method
class
constant
interface
parameter
call expression
branch
loop
effect
```

## Topology

How is it connected?

```text
declares
imports
exports
calls
reads
writes
returns
constructs
passes-to
receives-from
implements
extends
invokes-effect
```

So:

```text
Taxonomy = what the source element is
Topology = how source elements relate
```

The AST extractor gives you the raw observations for both.

# Add dataflow facts

Calls alone give you a dependency graph. Dataflow gives you the much richer reasoning surface you are imagining.

Consider:

```typescript
export function resolveMovement(
  request: MovementRequest
): MovementResult {
  const targetX = request.playerX + request.dx;
  const targetY = request.playerY + request.dy;
  const cell = request.grid[targetY][targetX];

  return cell === FLOOR
    ? { status: "AUTHORIZED", x: targetX, y: targetY }
    : { status: "BLOCKED", x: request.playerX, y: request.playerY };
}
```

The tool could extract:

```text
request.playerX ──────┐
request.dx ───────────┴─→ targetX

request.playerY ──────┐
request.dy ───────────┴─→ targetY

request.grid
targetY
targetX ─────────────────→ cell

cell ─────────────────────→ movement disposition
targetX / targetY ────────→ authorized result
request.playerX / playerY → blocked result
```

Normalized facts:

```json
{
  "flowKind": "derives",
  "sources": [
    "request.playerX",
    "request.dx"
  ],
  "target": "targetX",
  "operation": "addition"
}
```

```json
{
  "flowKind": "indexes",
  "sources": [
    "request.grid",
    "targetY",
    "targetX"
  ],
  "target": "cell"
}
```

```json
{
  "flowKind": "influences",
  "sources": [
    "cell"
  ],
  "target": "return.status"
}
```

This allows queries that would otherwise require an AI to repeatedly re-read and reason over code.

# The query engine becomes the code browser

Once the facts are normalized, the user can query them declaratively.

## Find all functions

```sql
SELECT symbolId, name, modulePath, returnType
FROM symbols
WHERE symbolKind = "function"
```

## Find callers of a function

```sql
SELECT fromSymbolId, sourceReference
FROM relationships
WHERE relationshipKind = "calls"
  AND toSymbolId = "src/resolve-layout.ts#resolveLayout"
```

## Find everything called by a function

```sql
SELECT toSymbolId, sourceReference
FROM relationships
WHERE relationshipKind = "calls"
  AND fromSymbolId = "src/render-page.ts#renderPage"
```

## Find functions that read a constant

```sql
SELECT fromSymbolId
FROM relationships
WHERE relationshipKind = "reads"
  AND toSymbolId = "src/config.ts#DEFAULT_LAYOUT"
```

## Find exported functions performing direct effects

```sql
SELECT symbolId, name, modulePath
FROM symbols
WHERE symbolKind = "function"
  AND exported = true
  AND symbolId IN (
    SELECT fromSymbolId
    FROM relationships
    WHERE relationshipKind = "invokes-effect"
  )
```

## Trace where a value comes from

```sql
SELECT *
FROM dataflow
WHERE target = "renderResult.layout"
APPLY RESULT PROJECTION project-upstream-dataflow-tree
```

## Trace where a parameter goes

```sql
SELECT *
FROM dataflow
WHERE sources CONTAINS "request.layout"
APPLY RESULT PROJECTION project-downstream-dataflow-tree
```

# Query results can become code

This is where it aligns beautifully with your SEJ projection model.

The query does not necessarily return a final textual table. It returns a canonical fact set.

```text
Query
    ↓
Selected code facts
    ↓
Result projection
    ↓
Code body
```

For example:

```sql
SELECT symbolId, name, parameters, returnType, calls
FROM code-knowledge
WHERE symbolId = "src/render-page.ts#renderPage"
APPLY RESULT PROJECTION project-typescript-function-outline
```

Could produce:

```typescript
export async function renderPage(
  request: RenderPageRequest
): Promise<RenderedPage> {
  const layout = await resolveLayout(request);
  const sections = await renderSections(request, layout);

  return {
    layout,
    sections
  };
}
```

But there are two distinct projection cases here.

## Reconstructive projection

Project the observed source facts back into a representation of the existing body.

```text
Observed AST facts
    ↓
Source-compatible projection
    ↓
Equivalent code representation
```

This is useful for inspection, translation, and comparison.

## Constructive projection

Select known functions or semantic shapes and compose a new executable body.

```text
Selected reusable symbols
    +
declared composition
    ↓
candidate AST
    ↓
new executable body
```

That second case needs stronger constraints, because a query result alone should not silently define a valid composition.

# Project the same query several ways

This is where the system becomes dramatically more useful than conventional code search.

One query:

```sql
SELECT *
FROM code-knowledge
WHERE symbolId = "src/render-page.ts#renderPage"
```

Could be projected as:

## Symbol summary

```text
renderPage

Kind: function
Exported: yes
Async: yes
Parameters: 1
Calls: 2
Returns: RenderedPage
```

## Source body

```typescript
export async function renderPage(...) {
  ...
}
```

## Call tree

```text
renderPage
├── resolveLayout
└── renderSections
    ├── renderHero
    ├── renderFeatures
    └── renderFooter
```

## Dataflow tree

```text
request
├── request.layout
│   └── resolveLayout
│       └── resolvedLayout
└── request.sections
    └── renderSections
        └── renderedSections

resolvedLayout
renderedSections
    └── RenderedPage
```

## Mermaid or SVG graph

```text
renderPage ──calls──▶ resolveLayout
     │
     └────calls────▶ renderSections
```

## Markdown documentation

```text
### `renderPage`

Resolves the requested layout, renders page sections, and returns a
`RenderedPage`.
```

The query is stable. The projection determines the view.

# The first normalized JSON structure

I would start with four collections rather than one giant record.

```json
{
  "symbols": [],
  "relationships": [],
  "dataflows": [],
  "sourceReferences": []
}
```

## Symbols

```json
{
  "symbolId": "src/page.ts#renderPage",
  "symbolKind": "function",
  "name": "renderPage",
  "modulePath": "src/page.ts"
}
```

## Relationships

```json
{
  "relationshipKind": "calls",
  "fromSymbolId": "src/page.ts#renderPage",
  "toSymbolId": "src/layout.ts#resolveLayout"
}
```

## Dataflow

```json
{
  "flowKind": "argument-passing",
  "source": "src/page.ts#renderPage.request",
  "target": "src/layout.ts#resolveLayout.request"
}
```

## Source reference

```json
{
  "referenceId": "src/page.ts:17:24",
  "modulePath": "src/page.ts",
  "startLine": 17,
  "startColumn": 24,
  "endLine": 17,
  "endColumn": 52
}
```

This lets the system navigate both directions:

```text
Semantic fact → exact source
Exact source → semantic facts
```

# Function-level inspection

The first tiny interactive query should probably be:

```bash
code inspect renderPage
```

Result:

```text
Function
└── renderPage

Declared at
└── src/page.ts:12-31

Input
└── request: RenderPageRequest

Calls
├── resolveLayout(request)
└── renderSections(request, resolvedLayout)

Reads
└── DEFAULT_LAYOUT

Returns
└── Promise<RenderedPage>

Effects
└── none observed

Control flow
├── branches: 0
└── iterations: 0
```

Then:

```bash
code inspect renderPage --view flow
```

```text
RenderPageRequest
        │
        ├──────────────▶ resolveLayout
        │                       │
        │                       ▼
        │                ResolvedLayout
        │                       │
        └──────────────▶ renderSections
                                │
                                ▼
                        RenderedSections
                                │
                                ▼
                         RenderedPage
```

Then:

```bash
code inspect renderPage --view body
```

Shows the executable body.

# Recursive query expansion

The engine should support bounded traversal.

## Direct calls

```bash
code calls renderPage --depth 1
```

```text
renderPage
├── resolveLayout
└── renderSections
```

## Expanded call tree

```bash
code calls renderPage --depth 3
```

```text
renderPage
├── resolveLayout
│   ├── resolveBreakpoint
│   └── selectLayoutPattern
└── renderSections
    ├── renderHero
    ├── renderFeatureGrid
    └── renderFooter
```

## Upstream callers

```bash
code callers renderPage --depth 2
```

```text
startApplication
└── handlePageRequest
    └── renderPage
```

The depth boundary matters because enterprise call graphs can become enormous.

# Querying behavior rather than names

The real step forward is querying by source behavior, not just symbol names.

Examples:

```bash
code find-functions --calls resolveLayout
```

```bash
code find-functions --returns RenderedPage
```

```bash
code find-functions --reads DEFAULT_LAYOUT
```

```bash
code find-functions --has-branch
```

```bash
code find-functions --has-loop
```

```bash
code find-functions --constructs "RenderedPage"
```

```bash
code find-functions --effect filesystem.write
```

```bash
code find-functions --parameter-type RenderRequest
```

```bash
code find-functions --passes-value-to resolveLayout.layout
```

These are deterministic AST queries. They drastically reduce the amount of code a model or human must inspect.

# Connecting implementation AST to semantic AST

There are really two trees.

```text
Implementation AST
    describes exact syntax

Semantic AST
    describes capability meaning
```

Example implementation AST:

```text
FunctionDeclaration
├── Identifier: resolveMovement
├── Parameter: request
├── VariableDeclaration: targetX
├── VariableDeclaration: targetY
├── VariableDeclaration: cell
└── ConditionalExpression
```

Semantic interpretation:

```text
ResolveMovement
├── ReceiveMovementRequest
├── ComputeTargetPosition
├── ObserveTargetCell
├── ClassifyCellDisposition
└── SelectMovementResult
```

The implementation AST gives objective structure.

The semantic AST gives reusable know-how.

The bridge should be explicit:

```json
{
  "semanticNodeId": "compute-target-position",
  "supportedBy": [
    {
      "syntaxNodeId": "src/movement.ts:13:17",
      "role": "computes-target-x"
    },
    {
      "syntaxNodeId": "src/movement.ts:14:17",
      "role": "computes-target-y"
    }
  ]
}
```

So the query engine can answer:

```text
Which syntax implements this semantic responsibility?
```

And:

```text
Which semantic responsibilities are evidenced by this function?
```

# A powerful query example

Suppose you ask:

> Show me how movement is resolved.

The engine can perform several deterministic queries:

```text
1. Find symbols matching “movement”
2. Select exported functions
3. Traverse direct calls
4. Extract reads, writes, and returns
5. Trace parameter-to-return dataflow
6. Match known semantic patterns
7. Project a movement-resolution view
```

Result:

```text
Movement Resolution

Entry body
└── resolveMovement(request)

Dataflow
├── playerX + dx → targetX
├── playerY + dy → targetY
├── grid[targetY][targetX] → targetCell
└── targetCell → movement status

Decision
├── floor → authorize target position
└── wall → retain current position

Executable body
└── src/movement.ts:11-27
```

An AI no longer has to independently infer that whole structure from raw tokens every time.

# First sprint micro-capabilities

This could be a tight first implementation sequence.

## 1. `extracts-node-symbols`

Produces functions, methods, classes, constants, variables, parameters, types, and modules.

## 2. `extracts-symbol-relationships`

Produces imports, exports, declarations, calls, reads, writes, returns, and constructions.

## 3. `extracts-local-dataflow`

Tracks parameters, assignments, derived values, arguments, and return-field sources within one function.

## 4. `indexes-code-knowledge`

Stores normalized facts in JSON or SQLite.

## 5. `queries-code-symbols`

Supports selection by name, kind, module, type, and source location.

## 6. `traverses-code-topology`

Supports callers, callees, imports, dependencies, and bounded graph expansion.

## 7. `projects-symbol-inspection`

Projects summary, tree, Markdown, or JSON.

## 8. `projects-code-body`

Projects selected syntax facts into an inspectable source representation.

## 9. `projects-dataflow`

Projects variable and argument relationships as a readable tree or diagram.

## 10. `links-semantic-responsibilities`

Associates observed implementation regions with candidate semantic AST nodes.

# The architecture

```text
Node / TypeScript repository
          │
          ▼
    TypeScript compiler API
          │
          ▼
    Syntax observation facts
          │
     ┌────┴─────────┐
     ▼              ▼
Symbol taxonomy   Code topology
     │              │
     └──────┬───────┘
            ▼
       Dataflow facts
            │
            ▼
      Durable code index
            │
            ▼
        SEJ query engine
            │
     ┌──────┼──────────┬───────────┐
     ▼      ▼          ▼           ▼
   Code   AST tree   Dataflow    Markdown
 projection          diagram    explanation
```

# The economic advantage

Without this index:

```text
Human or AI
    ↓
Open files
    ↓
Search names
    ↓
Read functions
    ↓
Follow imports
    ↓
Trace calls
    ↓
Infer dataflow
    ↓
Construct mental model
```

With the index:

```text
Human or AI
    ↓
Ask a bounded query
    ↓
Receive exact connected facts
    ↓
Choose a projection
```

That changes the model’s work from:

> Analyze the repository.

to:

> Interpret this already-resolved code topology and decide what it means for the current task.

That is far less expensive and much more deterministic.

The deepest insight here is that you would not merely have a search engine **for text inside code**. You would have a search engine for:

```text
symbols
relationships
execution structure
dataflow
effects
responsibilities
and reusable implementation shapes
```

And because the query output remains structured, it can be projected directly into code, AST trees, diagrams, documentation, or candidate semantic authority without the agent hand-stitching those connections every time.

## Execution-path proof (2026-08-01)

### 1) Dependency entry-point risk checks

Observed package manifests:

- `C:\lab\repos\source-facts-semantic-search-engine\node_modules\@deterministic-solutions\sej-runtime-query\package.json`
  - has `exports` and no root `package.json` export subpath; package root resolution is blocked by export map.
- `C:\lab\repos\source-facts-semantic-search-engine\node_modules\@deterministic-solutions\source-code-taxonomy-scanner\package.json`
  - no `exports` field, and no top-level `main`.

Direct module probe proof:

- `@deterministic-solutions/source-code-taxonomy-scanner` resolves from sibling source-workspace (`source-code-taxonomy-scanner/package.json`) only, not from `source-facts-semantic-search-engine\node_modules`.
- `@deterministic-solutions/source-code-taxonomy-scanner` package root resolution from `createRequire().resolve()` fails in this environment, so probing for a specific entry must be done via explicit package-root candidate files.
- `@deterministic-solutions/sej-runtime-query` fails both:
  - `.../` => `ERR_PACKAGE_PATH_NOT_EXPORTED`
  - `.../package.json` => `ERR_PACKAGE_PATH_NOT_EXPORTED`

Implemented guardrails in code reflect this:

- `src/project.js` (`loadsScanner`) tries concrete scanner entry candidates under the resolved package root (`dist/index.js`, `src/index.ts`, etc.).
- `src/query.js` (`deduceSejPackageRoots` + `importStartsQueryEngine`) resolves SEJ by trying `dist/composition-root/starts-query-engine.js` and `composition-root/starts-query-engine.js` across local root candidates.

### 2) Positional `query` form proof

CLI usage is now verified for both forms against the same materialized index:

- `node src/cli.js query "SELECT symbolId, name FROM symbols LIMIT 3" --index <proof-index> --pretty`
- `node src/cli.js query --query "select symbolId, name from symbols limit 3" --index <proof-index> --pretty`

Before fixing argument handling, positional mode incorrectly included non-flag tokens from `rawArgs` and could fail (`RELATIONAL_QUERY_REJECTED`) when `--index` was present. This is now fixed in `src/cli.js` by deriving positional SQL only from parsed positional tokens.

Result: both calls now return `RELATIONAL_QUERY_EXECUTED` receipts with identical first rows (for the example projection).

### 3) Generated index semantic checks

Projection command used:

- `node src/cli.js project --workspace C:\lab\repos\source-code-taxonomy-scanner --output proof-index.json --summary`

Observed index metrics from `proof-index.json`:

- `files: 29`
- `symbols: 155`
- `relationships: 309`
- `coverage.unknownSyntax: 3375`
- `coverage.unknownSyntaxRatio: 0.8420658682634731`

### 4) Source-range semantics

`sourceReferences` were recomputed from source text + byte length. Validation check:

- `badRangeCount: 0`
- all calculated `endLine`/`endColumn` values are valid and non-regressive

### 5) Identity stability

Re-running projection on the same workspace twice produced stable identifiers and content semantics for all key identity fields:

- `indexId` stable: `true`
- first symbol stable: `true`
- last symbol stable: `true`
- coverage stable: `true`
- symbol array stability: `true`
- relationship array stability: `true`
- workspace hash stable: `true`

### 6) Candidate-vs-resolved relationship links

From `proof-index.json`:

- unresolved relationships: `288`
- resolved relationships: `21`
- candidate-only unresolved rows: `238`
- candidate + resolved conflict rows: `0`

Interpretation:

- `toSymbolCandidate` is only populated when `toSymbolId` is unresolved, and there are no rows where both fields are set.

## Post-fix proof log (2026-08-01)

### Dependency-entrypoint hardening

The implementation no longer relies on package roots or `package.json` subpaths that are blocked by export maps.

- `source-facts-semantic-search-engine/src/project.js:196` loads scanner entrypoints from explicit concrete candidates (e.g., `dist/index.js`) after resolving `@deterministic-solutions/source-code-taxonomy-scanner/package.json`.
- `source-facts-semantic-search-engine/src/query.js:37` imports `startsQueryEngine` via explicit `composition-root/starts-query-engine.js` candidates and initializes it with `{ capabilityPacks: [], portAdapters: {} }`.

Observed at runtime:

- Scanner candidate probe: `dist/index.js` exists and imports.
- SEJ package path probes: root and `package.json` are blocked by exports, so candidate-module probing is required.

### Ingestion completeness against advertised corpus

The governance-engine command now projects non-empty source facts with js-family files admitted:

- Command: `node src/cli.js project --workspace C:\lab\repos\contract-driven-artifact-governance-engine --output proof-governance-v4.json --summary`
- Result: `Files: 37`, `Symbols: 3642`, `Relationships: 8192`, `Document facts: 97883`.

This is enforced in scanner support updates:

- `source-code-taxonomy-scanner/src/registration/registers-language-profile.ts:6` includes `.js/.jsx/.mjs/.cjs` in its language profile extensions.
- `source-code-taxonomy-scanner/src/registration/registers-scanner-semantic-authority.ts:17` uses the same admission extension set.
- `source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts:7` handles `.jsx` as `TSX`.

### CLI query interface

Positional SQL parsing is fixed to use parsed positional arguments only.

- `source-facts-semantic-search-engine/src/cli.js:104` now resolves SQL from `flags.query` first, else from `positional` arguments.
- Both positional and `--query` forms return `RELATIONAL_QUERY_EXECUTED` for the same source against the governance index.

### Index semantics validation

From the governance projection at `proof-governance-v4.json`:

- Coverage:
  - `coverage.filesObserved: 37`
  - `coverage.unknownSyntax: 67914`
  - `coverage.unknownSyntaxRatio: 0.830909375`
  - `coverage.documentFacts: 97883`
- Source range integrity:
  - `badRanges: 0` (computed by scanning all reference ranges for regressions).
- Identity stability:
  - `indexId` is derived from deterministic metadata (`indexType`, `schema version`, `engine version`, `workspaceId`, `scanId`, `rootHash`) at `project.js:162`.
  - `manifest.schemaVersion` is present and explicit (`source-facts-semantic-search-engine/src/project.js:163`).
- Relationship semantics:
  - All unresolved links are explicit candidates (no resolved/candidate conflicts): `resolved: 0`, `conflict: 0` (`project.js:109`).

### Empty scan guardrails

A hard fail now triggers when scan output is empty but supported file extensions are present in the workspace, preventing silent "empty corpus" success for unsupported profiles (`source-facts-semantic-search-engine/src/project.js:19`, `source-facts-semantic-search-engine/src/project.js:276`).

### Remaining intended limitations

This pass intentionally keeps name-to-symbol binding as explicit candidates (`toSymbolId: null`) and `fromSymbolId` heuristic-only until checker-backed symbol binding is introduced later.

## Section-by-section proof ledger (2026-08-01)

### 1) Dependency entry-point and consumability checks

Status: closed.

Evidence:

- [source-facts-semantic-search-engine/scripts/check-deps.mjs](C:/lab/repos/source-facts-semantic-search-engine/scripts/check-deps.mjs)
- [source-facts-semantic-search-engine/src/project.js:204](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/query.js:32](C:/lab/repos/source-facts-semantic-search-engine/src/query.js)

Runtime assertion: `npm run check:deps` prints `dependencies resolved`.

### 2) Empty-index and ingestion correctness

Status: closed.

Evidence:

- [source-code-taxonomy-scanner/src/registration/registers-language-profile.ts](C:/lab/repos/source-code-taxonomy-scanner/src/registration/registers-language-profile.ts)
- [source-code-taxonomy-scanner/src/registration/registers-scanner-semantic-authority.ts](C:/lab/repos/source-code-taxonomy-scanner/src/registration/registers-scanner-semantic-authority.ts)
- [source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts:6](C:/lab/repos/source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts)
- [source-facts-semantic-search-engine/src/cli.js](C:/lab/repos/source-facts-semantic-search-engine/src/cli.js)

Runtime assertion: `node src/cli.js project --workspace C:\lab\repos\contract-driven-artifact-governance-engine --output proof-governance-v4.json --summary` shows 37 files and non-zero symbol relationships.

### 3) Query startup blockers and positional SQL

Status: closed.

Evidence:

- [source-facts-semantic-search-engine/src/cli.js:55](C:/lab/repos/source-facts-semantic-search-engine/src/cli.js)
- [source-facts-semantic-search-engine/src/query.js:13](C:/lab/repos/source-facts-semantic-search-engine/src/query.js)

Runtime assertion: both query forms return `RELATIONAL_QUERY_EXECUTED`.

### 4) Schema contract drift (`generatedAt`)

Status: closed.

Evidence:

- [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json)

Runtime assertion: project commands now emit required `documents` and no longer rely on required `generatedAt`.

### 5) Candidate-vs-resolved relationship truthfulness

Status: closed with explicit caveat.

Evidence:

- [source-facts-semantic-search-engine/src/project.js:96](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/project.js:106](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json:152](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json)

Runtime assertion: resolved and conflict counters remain `0`, unresolved targets are preserved in `toSymbolCandidate`.

### 6) Source-range and identity stability

Status: closed.

Evidence:

- [source-facts-semantic-search-engine/src/project.js:268](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/project.js:359](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/project.js:415](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)

Runtime assertion: `badRanges: 0` and stable identity fields on repeated projection.

### 7) Parser-family correctness for js-family files

Status: closed.

Evidence:

- [source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts](C:/lab/repos/source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts)

Runtime assertion: governance corpus projection includes js-family files under `C:\lab\repos\contract-driven-artifact-governance-engine`.

### 8) JSON documents as first-class facts

Status: closed.

Evidence:

- [source-facts-semantic-search-engine/src/project.js:359](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json:186](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json)

Runtime assertion: governance projection reports `Document facts: 97883` and `coverage.documentFacts: 97883`.

### 9) AST enclosure metadata for ownership

Status: implemented.

Evidence:

- [source-facts-semantic-search-engine/src/project.js:12](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/project.js:281](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)
- [source-facts-semantic-search-engine/src/project.js:297](C:/lab/repos/source-facts-semantic-search-engine/src/project.js)

Runtime assertion: ownership now tracks enclosing declaration scope (`function`, `method`, `constructor`, `class`, `interface`) and avoids global nearest-declaration heuristics.

## Proof evidence ledger

### Accuracy-hardening proof (2026-08-01)

The executable MVP now distinguishes three evidence layers:

1. `documents` preserve structured JSON facts at JSON pointers with exact value source ranges.
2. `governanceRules` project contract/profile rules such as the v8 forbidden executable mechanics without flattening applicability away.
3. `bodyMechanics` preserve syntax-derived code observations as `OBSERVED_NOT_EVALUATED`; they do not become violations until dependency, runtime, artifact, responsibility, and semantic-edge bindings establish that the profile applies.

For `profiles/closed-world-artifact-conformance.v8.json`, the projector recovers the requested 11 mechanics—branch, iteration, exception handling, throw, object construction, serialization, normalization, validation, fallback, retry, and state mutation—with a distinct source reference for every array item.

Verification commands:

- `npm test`
- `npm run check:deps`
- `npm run prove:smoke`
- `npm run conformance` in `C:\lab\repos\source-code-taxonomy-scanner`

The governance-corpus smoke proof completed with 37 code files, 3,642 symbols, 8,192 relationships, 97,883 JSON facts, 123 governance rules, and 3,255 body-mechanic observations. The projected index validates against schema v1.1.0 and has a stable content-derived `indexId` across unchanged runs.

The complete evidence index is available at:

- [C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-proof-evidence-2026-08-01.md](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-proof-evidence-2026-08-01.md)

