# Source Facts Semantic Search Engine

This repository turns enterprise source into queryable facts, inspectable web experiences, and governed candidate products.

## Local CLI setup

Install dependencies and link the package binary once from this repository so the documented `source-facts-se` commands resolve in a new shell:

```powershell
npm install
npm link
source-facts-se --help
```

For automation that should not depend on a linked binary, use the equivalent repository-local form: `node .\src\cli.js`.

To produce a feature-scoped result and a receipt bound to that exact invocation:

```powershell
source-facts-se report-query `
  --report .\artifacts\governance\source-facts-self-governance-report.json `
  --feature-id source-facts.cli-call-graph `
  --output .\artifacts\governance\call-graph-complete-lineage.json `
  --receipt-output .\artifacts\governance\call-graph-complete-lineage.receipt.json `
  --pretty
```

The north star is now implemented as a narrow, evidence-bound sign-in composition slice:

```text
"Show me all sign-in pages."
        |
        v
Executable enterprise gallery
        |
        v
Select layout A + authentication entry B + messaging C + theme D
        |
        v
Compatibility report
        |
        v
Candidate authority composition
        |
        v
Projected design document + candidate AST
        |
        v
Runnable governed preview
```

The final preview is a script-free simulation of composed authority. It does not execute legacy authentication code, submit credentials, call a network, write storage, or claim that the selected source pages share an implementation.

## What works

### Source facts and relational queries

- `project` extracts deterministic JavaScript/TypeScript symbols, relationships, local dataflow, JSON pointer facts, governance rules, body mechanics, coverage, and exact source references.
- `query` executes SQL over the resulting `source-fact-index.v1` through the SEJ relational runtime.
- Large indexes are written as deterministic, line-delimited top-level JSON and read incrementally, avoiding Node's single-string size ceiling.
- Web queries send only the source collections named by the SQL into the relational capability and its request hash.

### Enterprise web inventory and index

- `web inventory` gives admitted files and policy-dispositioned files explicit outcomes such as admitted, unsupported, oversized, generated, evidence snapshot, unreadable, or changed during observation.
- `web project` extracts source-addressable HTML, CSS, assets, relationships, bounded artifact families, JSX/TSX element facts, diagnostics, coverage, and abstaining page classifications.
- `web query` executes SQL over `web-surface-index.v1` collections.

Two workspace policies are included:

- [`contracts/web-know.workspace.json`](contracts/web-know.workspace.json) is the small pilot corpus.
- [`contracts/web-know.enterprise.workspace.json`](contracts/web-know.enterprise.workspace.json) covers `C:\source\repos\bpm\intelligence\01...09`, `C:\source\repos\bpm\clients`, and `C:\lab\repos` as eleven separately identified roots.

Because `C:\lab\repos` is a governed source root, write enterprise inventory, index, gallery, and composition output outside it, for example beneath `C:\lab\temp`.

### Executable enterprise gallery

- `web gallery plan` executes a registered query, retains every query row in a selection ledger, rechecks source hashes, and assigns an explicit preview disposition.
- `web gallery project` emits a deterministic host, manifest, static preview bundles, preview plan, and projection receipt.
- `web gallery serve` exposes the script-free host at `/` and admitted bundles beneath `/preview/` on ephemeral loopback only.
- `web gallery prove` captures browser receipts, screenshots, DOM observations, ARIA snapshots, request testimony, console testimony, timing, and environment evidence in fresh contexts.

The registered [`sign-in-pages`](gallery-queries/sign-in-pages.query.v1.json) authority maps the product phrase "sign-in pages" to the classifier's governed `login` taxonomy value. It does not use filename matching.

### Governed sign-in composition

`web north-star sign-in` is the one-command operator path. It projects the `sign-in-pages` gallery, resolves reviewed authority selections, evaluates compatibility, emits the candidate contract/design document/AST/preview, and optionally runs Playwright over every admitted gallery preview.

`web compose sign-in` accepts four explicit selections:

- layout authority;
- authentication-entry authority;
- messaging authority; and
- theme authority.

Before projection, the compatibility evaluator proves:

- exactly one authority is selected for each required kind;
- every ID resolves to a reviewed candidate or promoted authority;
- every authority resolves to a source-addressable item in the selected gallery manifest;
- every required port is provided;
- no selected authorities declare conflicts; and
- all required renderer bindings are present and safe.

An incompatible request emits `composition-request.json` and `compatibility-report.json`, then stops. It does not emit a contract, AST, design document, or preview.

A compatible request emits:

```text
composition-request.json
compatibility-report.json
candidate-composition-contract.json
projected-design-document.md
candidate.ast.txt
gallery-host.html
surface-preview-policy.json
previews/composed-sign-in/index.html
composition-projection-receipt.json
```

The initial reviewed authority registry lives in [`composition-authorities/`](composition-authorities/). The runnable request is [`compositions/enterprise-learning-sign-in.request.v1.json`](compositions/enterprise-learning-sign-in.request.v1.json).

## Run the north-star workflow

### Fast path: one command

After inventory and index projection, the entire north-star journey is one command. The included reviewed request supplies the default four selections:

```powershell
node src/cli.js web north-star sign-in `
  --index C:\lab\temp\web-know-enterprise\web-surface-index.json `
  --inventory C:\lab\temp\web-know-enterprise\web-surface.inventory.json `
  --output C:\lab\temp\web-know-enterprise\north-star-sign-in `
  --prove `
  --summary
```

Selections can be overridden with either an authority ID or the source-relative path visible in the gallery:

```powershell
node src/cli.js web north-star sign-in `
  --index C:\lab\temp\web-know-enterprise\web-surface-index.json `
  --inventory C:\lab\temp\web-know-enterprise\web-surface.inventory.json `
  --layout "app-lab/experiment/lab/sketch2html/output-auth-split-side.html" `
  --authentication-entry "app-lab/experiment/lab/sketch2html/output.html" `
  --messaging "youtube-presentations/ai-training-business/public/login.html" `
  --theme "loga/output/raw-check/login-form.html" `
  --output C:\lab\temp\web-know-enterprise\north-star-sign-in `
  --prove `
  --summary
```

The output root contains `authority-choices.json`, a stage-by-stage `north-star-report.json`, the executable gallery under `gallery/`, and the compatibility report, contract, design document, AST, receipt, and governed candidate under `composition/`. The summary prints the exact commands needed to serve either experience.

The lower-level commands remain available when an operator needs to pause, inspect, or substitute evidence at a particular boundary.

### 1. Inventory and project the enterprise scope

```powershell
node src/cli.js web inventory `
  --policy contracts\web-know.enterprise.workspace.json `
  --output C:\lab\temp\web-know-enterprise\web-surface.inventory.json `
  --summary

node src/cli.js web project `
  --policy contracts\web-know.enterprise.workspace.json `
  --inventory C:\lab\temp\web-know-enterprise\web-surface.inventory.json `
  --output C:\lab\temp\web-know-enterprise\web-surface-index.json `
  --summary
```

### 2. Ask for every classified sign-in page

```powershell
node src/cli.js web gallery project `
  --index C:\lab\temp\web-know-enterprise\web-surface-index.json `
  --inventory C:\lab\temp\web-know-enterprise\web-surface.inventory.json `
  --query sign-in-pages `
  --policy static-no-script.v1 `
  --output C:\lab\temp\web-know-enterprise\sign-in-gallery `
  --summary

node src/cli.js web gallery serve `
  --dir C:\lab\temp\web-know-enterprise\sign-in-gallery
```

### 3. Compose the selected authorities

```powershell
node src/cli.js web compose sign-in `
  --request contracts\compositions\enterprise-learning-sign-in.request.v1.json `
  --manifest C:\lab\temp\web-know-enterprise\sign-in-gallery\enterprise-gallery-manifest.json `
  --output C:\lab\temp\web-know-enterprise\enterprise-learning-sign-in `
  --summary

node src/cli.js web gallery serve `
  --dir C:\lab\temp\web-know-enterprise\enterprise-learning-sign-in
```

The same loopback server can host a page gallery or a composed candidate because both outputs preserve the restricted host/preview boundary.

## Current enterprise proof

On 2026-08-01, the included enterprise policy produced:

- 300,547 inventoried paths;
- 1,643 admitted HTML entry candidates;
- 1,643 projected HTML documents and page classifications;
- 181,939 HTML element facts;
- 238,512 CSS rule facts and 655,997 CSS declaration facts;
- 64,052 web relationships;
- 13 classifier-supported login surfaces at support score `0.9`;
- 13 of 13 query rows retained by the sign-in gallery;
- 5 static-ready and 8 script-required gallery dispositions; and
- a compatible four-authority candidate with 8 satisfied checks and 0 failures.

All 5 admitted sign-in previews were exercised in Chromium through `web gallery prove`; all 5 rendered, all browser assertions passed, and all 3 external App Lab stylesheets loaded from rewritten admitted-bundle URLs without console errors. The 2 inline-styled CSS migration documents rendered with the expected form-action CSP limitation. The composed preview was observed in the in-app browser with two input controls, one inert primary action, projected messaging and theme, and zero script elements.

The complete automated suite passes 63 of 63 tests (the SQL Server load test skips gracefully on machines without the connection configured), and both source-facts and web-surface smoke proofs remain green.

## Self-analysis

`project` and `query` are workspace-agnostic: pointing `--workspace` at this repository's own `src/` directory projects the engine's own symbols, relationships, dataflow, and `bodyMechanics` observations, which can then be queried like any other codebase.

```powershell
node src/cli.js project --workspace ./src --workspace-id self --output ./self-index.json --summary
node src/cli.js query --index ./self-index.json "SELECT mechanic, COUNT(*) AS count FROM bodyMechanics GROUP BY mechanic ORDER BY count DESC" --pretty
```

[`source-facts-query-console/`](source-facts-query-console/) is a small browser UI over the same doorway. `console serve` starts a loopback-only HTTP server (matching the restricted-host pattern used by `web gallery serve`) that executes live SQL through `executeRelationalQuery` and resolves exact source snippets from disk:

```powershell
node src/cli.js console serve --index ./self-index.json --workspace ./src
```

## Loading facts into SQL Server

Past a certain point, a custom query runtime and UI are the wrong home for ad hoc analysis — SQL Server is. `load-sqlserver` projects nothing itself; it takes an already-produced `source-fact-index.v1` and loads it into a declared SQL Server database (`sql/`), so SSMS, saved views, and ordinary joins become the query surface instead of a bespoke language. A durable `inventory.SourceRoot` has exactly one current `inventory.Scan`; rescanning that root atomically replaces its prior file and fact graph. Only lightweight ingestion receipts remain as load history. Loading the unchanged current index is a no-op (`LOAD_ALREADY_ADMITTED`).

Both a local trusted (Windows-integrated) connection and Azure SQL (SQL authentication via an ADO.NET connection string held in an environment variable) are supported; the password never appears on the command line or in a log.

```powershell
node src/cli.js load-sqlserver --index ./self-index.json --connection-env source-facts-semantic-search-engine --summary
# or, in one step from a workspace:
node src/cli.js ingest --workspace ./src --workspace-id self --connection-env source-facts-semantic-search-engine --summary
```

Query `inventory.CurrentSourceFile` for current root-scoped files. `reporting.*` views (`ForbiddenExecutableMechanic`, `FunctionMechanicSummary`, `UnresolvedRelationship`, `UngovernedBody`) give SSMS ready-made starting points over the loaded facts; see [`sql/`](sql/) for the full schema and loader procedures.

### Complete current repository projection

Source-fact rows are an analysis surface, not a file backup. Apply
`scripts/sql/016-create-repository-image.sql` to add the separate exact-content
plane. It stores one current repository image per `RootId`, deduplicates identical
bytes globally by SHA-256 digest, and keeps every captured artifact explicitly
`OBSERVED_NOT_ADMITTED`.

`load-repository` captures tracked and non-ignored working-tree files, including
tests, SQL and other scripts, contracts, feature files, documentation, lockfiles,
and binary assets. Secrets and transient dependency/build directories remain
excluded. `extract-repository` accepts only an empty output directory and verifies
the complete image before writing anything:

```powershell
node src/cli.js load-repository `
  --workspace . `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary

node src/cli.js extract-repository `
  --root-id source-facts-semantic-search-engine `
  --output C:\lab\temp\source-facts-projected `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

The resulting files are exact current-state projections. Their behavioral meaning
becomes canonical only through the separate feature, mechanic, and governed-contract
admission planes.

After loading the exact image, `analyze-repository` reads that image back from SQL
and projects normalized current-state knowledge without consulting the original
workspace:

```powershell
node src/cli.js analyze-repository `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --output C:\lab\temp\source-facts-repository-semantics.json `
  --pretty `
  --summary
```

The first analyzer profile projects SQL object declarations and references,
Gherkin features/scenarios/steps and anchors, Markdown headings/links/code blocks,
JSON scalar paths, and package scripts/engines/dependencies/locked packages.
JavaScript and TypeScript are explicitly delegated to the deeper source-fact engine.
Every remaining artifact receives `EXACT_CONTENT_ONLY`, `BINARY_CONTENT`, or
`ANALYZER_FAILED`; nothing silently disappears. Query
`reporting.CurrentRepositorySemanticCoverage` and
`reporting.CurrentRepositoryKnowledge` in SQL Server. All projected facts remain
`OBSERVED_NOT_ADMITTED` until separately bound to admitted authority.

### Inexpensive database-native lineage sealing

Apply `scripts/sql/018-create-repository-lineage-seal.sql` after the repository
image, semantic-analysis, and engineering-truth schemas. `seal-repository` reads
the current image from SQL, reconstructs its canonical feature-intent registry
from those database bytes, normalizes it into authority tables, and stores one
current SHA-256 lineage seal. It creates no receipt, proof, or sidecar file:

```powershell
node src/cli.js seal-repository `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary

node src/cli.js validate-repository-seal `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

Validation is a bounded lookup over
`projection.CurrentRepositoryGovernanceClosure`; it does not rescan artifacts or
re-run analyzers. `LINEAGE_SEAL_VALID` proves the stored identities and digest
agree. `GovernanceDisposition` separately reports whether all feature authority
is closed. The stored value is explicitly `DIGEST_SEALED_NOT_SIGNED`: SHA-256
provides integrity identity, not signer authenticity. A future signing service can
sign this stable database digest without changing the inexpensive query boundary.

### Canonical test and feature closure

Apply `scripts/sql/019-create-canonical-test-closure.sql` to create separate test
authority, observation, candidate-binding, execution-testimony, and current
closure planes. The first database-origin inventory reads test bytes from the SQL
repository image—never the original workspace—and observes test artifacts,
suites, cases, assertions, fixture usage, mock usage, and direct invocations:

```powershell
node src/cli.js analyze-tests `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary

node src/cli.js test-closure `
  --root-id source-facts-semantic-search-engine `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

Observed symbol matches produce only `CANDIDATE_NOT_ADMITTED` bindings. Existing
tests remain `REGRESSION_CANDIDATE` or `UNBOUND_TEST` until reviewed canonical test
vectors, expectations, and proof requirements are admitted. The observation is
bound to the current repository lineage by a second SQL-only SHA-256 closure seal.
`projection.CurrentScenarioTestClosure`, `CurrentFeatureTestClosure`, and
`CurrentRepositoryTestClosure` expose missing proof without generating files.

Apply `scripts/sql/020-admit-reference-test-vector.sql` for the first reviewed
vertical slice. It admits one fixture, execution authority, expectation, proof
policy, and `vitest.v1` vector for
`source-facts.classify-mechanic-authority-family`. Then execute it from SQL
authority:

```powershell
node src/cli.js prove-test-vector `
  --root-id source-facts-semantic-search-engine `
  --test-vector-id classify-mechanic-authority-family.v1 `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

The ephemeral Vitest body receives fixture inputs and execution authority but not
the expected outputs. It emits an observed signal; a separate evaluator compares
that signal with SQL expectation authority and records the projected artifact,
fixture, profile, runtime-plan, output, repository-seal, and test-closure-seal
digests in SQL. The ephemeral workspace is removed after execution.

Canonical authority, call-graph observations, and test evidence have a separate
snapshot-preserving load path. Apply SQL scripts `001`, `006`, `007`, and `008`,
then load an admitted governed contract beside a generated self-governance report:

```powershell
node src/cli.js load-engineering-truth `
  --contract ./contracts/serves-query-console.governed.contract.json `
  --intent-dir ./features `
  --report ./artifacts/governance/source-facts-self-governance-report.json `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

If you want to generate the report and sync the canonical governed contract plus
intent registry in one step, use:

```powershell
node src/cli.js sync-self-governance `
  --workspace ./src `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

`reporting.FeatureTestDisposition` answers whether each canonical responsibility
has mapped test lineage. `reporting.FeatureEngineeringClosure` joins the canonical
feature spine to explicitly bound commands, reachable callables, tests, and proof
dispositions. A matching text identifier alone never promotes observed evidence
into canonical authority; only cross-plane binding rows create that join.

## Other commands

```text
npm run project -- --workspace <path> [--workspace-id <id>] [--output <file>] [--pretty] [--summary]
npm run query -- --index <file> "<sql>" [--pretty]
node src/cli.js console serve --index <source-fact-index.json> [--workspace <dir>] [--port <n>]
node src/cli.js load-sqlserver --index <source-fact-index.json> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js load-repository --workspace <dir> --root-id <id> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js extract-repository --root-id <id> --output <empty-dir> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js analyze-repository --root-id <id> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--output <analysis.json>] [--pretty] [--summary]
node src/cli.js seal-repository --root-id <id> [--application-id <id>] (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js validate-repository-seal --root-id <id> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js analyze-tests --root-id <id> [--application-id <id>] (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js test-closure --root-id <id> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js prove-test-vector --root-id <id> --test-vector-id <id> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js ingest --workspace <dir> [--workspace-id <id>] (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]
node src/cli.js web query --index <web-surface-index.json> "<sql>" [--pretty]
node src/cli.js web gallery plan --index <file> --inventory <file> --query <id> --output <dir>
node src/cli.js web gallery prove --dir <gallery-output-dir>
node src/cli.js web north-star sign-in --index <file> --inventory <file> --output <dir> [--prove]
node scripts/run-landing-page-session.mjs
npm test
npm run prove:smoke
npm run prove:smoke:web
```

## Evidence boundaries

- Page classification remains derived or unresolved according to classifier support; the engine does not relabel weak evidence as fact.
- Static preview fidelity is reported explicitly. Script-bearing pages remain `NOT_EVALUATED_REQUIRES_SCRIPT` under the default policy.
- Reviewed candidate authority and promoted authority remain distinct statuses.
- Declared composition content remains visibly distinct from observed-and-reviewed source evidence.
- `bodyMechanics` remain `OBSERVED_NOT_EVALUATED` until governance bindings establish applicability.
- The current dataflow projector remains local to parameters and bindings within one enclosing function.
- JSX/TSX extraction is syntax-aware but not yet type-aware for prop resolution.
- The engine does not yet provide authorized legacy-script execution, normalized button computed-style comparison, general-purpose drag-and-drop composition, or real authentication effects.

The full design and safety rationale are in [`docs/enterprise-projection-gallery-intent-discussion.md`](docs/enterprise-projection-gallery-intent-discussion.md) and [`docs/intent-to-product pipeline-discussion.md`](docs/intent-to-product%20pipeline-discussion.md).
