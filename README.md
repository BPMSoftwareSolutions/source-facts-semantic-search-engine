# source-facts-semantic-search-engine (MVP)

This repository starts the source-facts semantic-search engine with a deterministic
JavaScript/TypeScript scanner, a source-addressable JSON projector, and a relational
projection/query path:

- `project` extracts from source with `@deterministic-solutions/source-code-taxonomy-scanner`
- `query` projects the resulting facts into a simple index and evaluates SQL over it via
  `@deterministic-solutions/sej-runtime-query`

A web-surface overlay extends the same engine to webpage source (HTML/CSS/JS/JSON/JSX/TSX):

- `web inventory` walks one or more policy-declared roots and gives every encountered
  path exactly one disposition (admitted, excluded, unsupported, unreadable, oversized,
  generated, evidence-snapshot, or changed-during-observation).
- `web project` extracts exact, source-addressable HTML and CSS facts, real JSX/TSX
  component-tree facts (via the TypeScript compiler), resolves a `page-type`
  classification per page, and expands a bounded, cycle-safe artifact-family graph
  from each admitted HTML entry surface through its `<script>`/`<link>`/inline
  blocks, CSS `@import`/`url()`, and JS/TS `import`/`require`/dynamic-`import`/JSX
  component specifiers.
- `web query` runs SQL over a projected `web-surface-index.v1`, the same way `query`
  runs SQL over a `source-fact-index.v1`.

An enterprise-gallery layer now implements Slices G0-G3 from the projection-gallery
design:

- `web gallery plan` runs a registered saved query, retains every input row in a
  schema-validated selection ledger, rechecks source hashes, and assigns an explicit
  preview disposition.
- `web gallery project` emits a deterministic, script-free catalog host, restricted
  static preview bundles, a manifest, and a projection receipt. It refuses output
  locations inside any configured source root and rechecks every admitted file at
  materialization time.
- `web gallery serve` exposes the generated script-free catalog at `/` and only its
  materialized preview bytes beneath `/preview/` from an ephemeral `127.0.0.1`
  server with deny-by-default CSP, sandbox, permissions, method, and path controls.
- `web gallery prove` opens each eligible preview in a fresh Playwright Chromium
  context with outbound routing denied and emits browser, request, DOM, ARIA,
  screenshot, console, timing, and environment evidence.

The first authority is `enterprise-page-gallery.v1`. Button facts remain a source-only
occurrence inventory: `WHERE tag = 'button'` currently returns 144 authored occurrences
across 10 documents, but the engine does not call those occurrences reusable visual
patterns without DOM/cascade/computed-style and reviewed promotion evidence.

A session layer sits on top of the web overlay for the doc's manual
intent-to-product conveyor: `src/session/intent-session.js` records an append-only,
schema-validated log of queries run, evidence inspected, patterns considered and
selected (with rationale), and contract revisions; `src/session/landing-page-contract.js`
builds a governed page-region contract from those selections; and
`src/session/design-document-projector.js` deterministically projects a markdown
design document and a candidate-AST text view from the session + contract — every
claim in the document traces back to a real, checkable source reference.
[`scripts/run-landing-page-session.mjs`](scripts/run-landing-page-session.mjs) runs
a real instance of this against the pilot corpus; its outputs live in `sessions/`
and `design/`.

See `docs/intent-to-product pipeline-discussion.md` for the design rationale and
explicit scope boundaries (what's covered vs. left for later work).

## Commands

- `npm run project -- --workspace <path> [--workspace-id <id>] [--output <file>] [--pretty] [--summary]`
- `npm run query -- --index <file> \"<sql>\" [--pretty]`
- `node src/cli.js web inventory --policy <web-know.workspace.json> [--output <file>] [--pretty] [--summary]`
- `node src/cli.js web project --policy <web-know.workspace.json> [--inventory <file>] [--output <file>] [--pretty] [--summary]`
- `node src/cli.js web query --index <web-surface-index.json> \"<sql>\" [--pretty]`
- `node src/cli.js web gallery plan --index <web-surface-index.json> --inventory <web-surface.inventory.json> --query enterprise-pages --policy static-no-script.v1 --output <dir> [--summary]`
- `node src/cli.js web gallery project --index <web-surface-index.json> --inventory <web-surface.inventory.json> --query enterprise-pages --policy static-no-script.v1 --output <dir> [--summary]`
- `node src/cli.js web gallery serve --dir <gallery-output-dir>`
- `node src/cli.js web gallery prove --dir <gallery-output-dir>`
- `node scripts/run-landing-page-session.mjs` — runs the real landing-page intent session
- `npm test`
- `npm run prove:smoke [-- <workspace>]`
- `npm run prove:smoke:web [-- <policy-file>]`

## Output

The projector emits `source-fact-index.v1` JSON with:

- `files`
- `symbols`
- `relationships`
- `dataflows` (assignment/return/argument edges, resolved against
  parameter/local bindings only within the same enclosing function)
- `sourceReferences`
- `documents` (JSON-pointer facts with exact value ranges)
- `governanceRules` (contract/profile rules projected from structured data)
- `bodyMechanics` (syntax-derived candidates, not conformance judgments)
- `coverage`

`web project` emits `web-surface-index.v1` JSON with `htmlDocuments`, `htmlElements`,
`cssStylesheets`, `cssRules`, `cssDeclarations`, `webRelationships` (resolved edges,
including `jsx-component-reference`), `assets`, `webFamilies` (bounded
dependency-closure graphs), `jsxElements` (component-tree facts for `.jsx`/`.tsx`
members reached by the graph), `webpageClassifications` (`page-type` dimension,
abstains rather than guessing below the support threshold), `sourceReferences`,
`diagnostics`, and `coverage`. `web inventory` emits `web-surface-inventory.v1` JSON
with one disposition per encountered path.

`web gallery project` writes `gallery-selection.json`, `surface-preview-plan.json`,
`enterprise-gallery-manifest.json`, `surface-preview-policy.json`,
`gallery-host.html`, `gallery-projection-receipt.json`, and eligible files below
`previews/`. `web gallery prove` adds per-item receipts, screenshots, and ARIA snapshots
below `browser-proof/`. Gallery artifacts contain root IDs and repository-relative
paths; projection output never serializes configured absolute source-root paths.

## Notes

- Relationship sources are bound only when the scanner supplies an exact enclosing
  callable. All other sources and all targets remain explicitly unresolved.
- `bodyMechanics` remain `OBSERVED_NOT_EVALUATED` until contract dependency, runtime,
  artifact, responsibility, and semantic-edge bindings establish rule applicability.
- Query shape is intentionally simple and can be extended in later sprints.
- The web-surface overlay still stops short of full scope: no type-aware JSX prop
  resolution, no cross-file data-flow analysis, no authorized source-script execution,
  no normalized button cascade/computed-style comparison, and no constructive
  composition. The governed contract covers subject/purpose/audience/regions/layout
  rather than the doc's full five-pass feature/scenario/responsibility/obligation/signal
  formalism. `resolved-workspace-package` edges (bare specifiers resolving under
  `node_modules`) are recorded but never traversed. See the pipeline-discussion doc's
  "Scope actually covered" section for the current, complete list.

The implementation and safety rationale are recorded in
[`docs/enterprise-projection-gallery-intent-discussion.md`](docs/enterprise-projection-gallery-intent-discussion.md).
The core evidence boundaries are
[`src/gallery/projects-gallery.js`](src/gallery/projects-gallery.js),
[`src/gallery/materializes-static-preview.js`](src/gallery/materializes-static-preview.js),
[`src/gallery/serves-isolated-previews.js`](src/gallery/serves-isolated-previews.js), and
[`src/gallery/captures-browser-render.js`](src/gallery/captures-browser-render.js).
