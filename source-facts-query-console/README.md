# Source Facts Semantic Refactor Console

A dependency-free, single-page interface for querying a real `source-fact-index.v1` produced by this engine, and for inspecting `bodyMechanics` observations that remain `OBSERVED_NOT_EVALUATED` pending semantic authority.

This page is no longer a static mockup with an embedded demonstration dataset. It is served by the engine's own loopback query doorway and issues live SQL over the SEJ relational runtime.

## Run

```powershell
node src/cli.js project --workspace ./src --workspace-id self --output ./self-index.json --summary
node src/cli.js console serve --index ./self-index.json --workspace ./src
```

`console serve` prints the loopback URL (for example `http://127.0.0.1:54213`). Open it in a browser. `--workspace` is optional — if omitted, the server falls back to the absolute workspace root already recorded in the index's `manifest.scanRequest.workspaceRoot`, so exact-source inspection keeps working as long as that path is still readable on the machine running the server. If neither resolves to a readable path, query rows still return normally; only the source-snippet panel reports `SOURCE_FILE_UNREADABLE` / `WORKSPACE_ROOT_UNAVAILABLE` instead of code.

Point `--index` at any `source-fact-index.v1` file, including the engine's own self-projected index (see the root [README](../README.md#self-analysis) for that command).

## What the console does

- The query editor posts SQL to `POST /api/query`, which calls `executeRelationalQuery` directly — the same function `npm run query` uses — and renders the returned receipt (`disposition`, `resolvedRule`, hashes, `findings`) unmodified.
- The "Body mechanics by kind" sidebar is a live `SELECT mechanic, COUNT(*) AS count FROM bodyMechanics GROUP BY mechanic` aggregate, not a fixed list — kinds the engine doesn't currently detect (for example `meaning-hidden-in-text`, kept as a preset to demonstrate the negative) simply don't appear.
- Selecting a row with a `modulePath`/`startLine` pair fetches `GET /api/snippet` and renders the exact source lines from disk, with the observed span highlighted.
- The detail panel only ever shows facts the engine actually produced (`mechanic`, `evidenceKind`, `verificationDisposition`, resolved `enclosingSymbol`, exact source range). It does not fabricate a migration target or semantic-authority name — the engine leaves that mapping as an operator judgment call, consistent with the [evidence boundaries](../README.md#evidence-boundaries) in the root README.

## Server surface

`servesQueryConsole` ([`../src/console/serves-query-console.js`](../src/console/serves-query-console.js)) binds only to `127.0.0.1`, matching the restricted-host pattern already used by `web gallery serve`:

- `GET /` — this page.
- `GET /api/index-info` — index id, workspace id, collection counts, and whether snippet resolution is available.
- `POST /api/query` — `{ "commandText": "<sql>" }` → the engine's query receipt.
- `GET /api/snippet?modulePath=&startLine=&endLine=&context=` — exact source lines, containment-checked against the resolved workspace root.

All responses carry `Cache-Control: no-store` and a restrictive CSP (`connect-src 'self'`, no third-party origins reachable).
