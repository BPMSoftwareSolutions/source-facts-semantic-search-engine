# source-facts-semantic-search-engine (MVP)

This repository starts the source-facts semantic-search engine with a deterministic
JavaScript/TypeScript scanner, a source-addressable JSON projector, and a relational
projection/query path:

- `project` extracts from source with `@deterministic-solutions/source-code-taxonomy-scanner`
- `query` projects the resulting facts into a simple index and evaluates SQL over it via
  `@deterministic-solutions/sej-runtime-query`

## Commands

- `npm run project -- --workspace <path> [--workspace-id <id>] [--output <file>] [--pretty] [--summary]`
- `npm run query -- --index <file> \"<sql>\" [--pretty]`
- `npm test`
- `npm run prove:smoke [-- <workspace>]`

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

## Notes

- Relationship sources are bound only when the scanner supplies an exact enclosing
  callable. All other sources and all targets remain explicitly unresolved.
- `bodyMechanics` remain `OBSERVED_NOT_EVALUATED` until contract dependency, runtime,
  artifact, responsibility, and semantic-edge bindings establish rule applicability.
- Query shape is intentionally simple and can be extended in later sprints.
