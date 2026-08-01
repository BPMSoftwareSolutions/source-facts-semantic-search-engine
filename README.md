# source-facts-semantic-search-engine (MVP)

This repository starts the source-facts semantic-search engine with a deterministic
JavaScript/TypeScript scanner, a source-addressable JSON projector, and a relational
projection/query path:

- `project` extracts from source with `@deterministic-solutions/source-code-taxonomy-scanner`
- `query` projects the resulting facts into a simple index and evaluates SQL over it via
  `@deterministic-solutions/sej-runtime-query`

A web-surface overlay extends the same engine to webpage source (HTML/CSS/JS/JSON):

- `web inventory` walks one or more policy-declared roots and gives every encountered
  path exactly one disposition (admitted, excluded, unsupported, unreadable, oversized,
  generated, evidence-snapshot, or changed-during-observation).
- `web project` extracts exact, source-addressable HTML and CSS facts and expands a
  bounded, cycle-safe artifact-family graph from each admitted HTML entry surface
  through its `<script>`/`<link>`/inline blocks, CSS `@import`/`url()`, and JS/TS
  `import`/`require`/dynamic-`import` specifiers.

See `docs/intent-to-product pipeline-discussion.md` for the design rationale and
explicit scope boundaries (what's covered through Slice 2 vs. left for later slices).

## Commands

- `npm run project -- --workspace <path> [--workspace-id <id>] [--output <file>] [--pretty] [--summary]`
- `npm run query -- --index <file> \"<sql>\" [--pretty]`
- `node src/cli.js web inventory --policy <web-know.workspace.json> [--output <file>] [--pretty] [--summary]`
- `node src/cli.js web project --policy <web-know.workspace.json> [--inventory <file>] [--output <file>] [--pretty] [--summary]`
- `npm test`
- `npm run prove:smoke [-- <workspace>]`
- `npm run prove:smoke:web [-- <policy-file>]`

## Output

The projector emits `source-fact-index.v1` JSON with:

- `files`
- `symbols`
- `relationships`
- `dataflows` (placeholder for now)
- `sourceReferences`
- `documents` (JSON-pointer facts with exact value ranges)
- `governanceRules` (contract/profile rules projected from structured data)
- `bodyMechanics` (syntax-derived candidates, not conformance judgments)
- `coverage`

`web project` emits `web-surface-index.v1` JSON with `htmlDocuments`, `htmlElements`,
`cssStylesheets`, `cssRules`, `cssDeclarations`, `webRelationships` (resolved edges),
`assets`, `webFamilies` (bounded dependency-closure graphs), `sourceReferences`,
`diagnostics`, and `coverage`. `web inventory` emits `web-surface-inventory.v1` JSON
with one disposition per encountered path.

## Notes

- Relationship sources are bound only when the scanner supplies an exact enclosing
  callable. All other sources and all targets remain explicitly unresolved.
- `bodyMechanics` remain `OBSERVED_NOT_EVALUATED` until contract dependency, runtime,
  artifact, responsibility, and semantic-edge bindings establish rule applicability.
- Query shape is intentionally simple and can be extended in later sprints.
- The web-surface overlay stops deliberately short of full scope: no JSX component-tree
  facts, no webpage-classification integration, no manual intent-session contract, and
  no design-document/preview projection. `resolved-workspace-package` edges (bare
  specifiers resolving under `node_modules`) are recorded but never traversed. See the
  "Explicitly out of scope" section of the pipeline-discussion doc for the full list.
