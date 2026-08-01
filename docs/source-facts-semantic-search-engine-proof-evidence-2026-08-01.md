# Proof evidence ledger for source-facts-semantic-search-engine (2026-08-01)

This ledger links each risk section to code and command evidence and points back to the matching discussion section.

## 1) Dependency entry-point and consumability checks

- Evidence files: [source-facts-semantic-search-engine/scripts/check-deps.mjs](C:/lab/repos/source-facts-semantic-search-engine/scripts/check-deps.mjs), [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js), [source-facts-semantic-search-engine/src/query.js](C:/lab/repos/source-facts-semantic-search-engine/src/query.js).
- Command evidence: `npm run check:deps` output includes `dependencies resolved`.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#1-dependency-entry-point-and-consumability-checks).

## 2) Empty-index / unsupported corpus risk

- Evidence files: [source-code-taxonomy-scanner/src/registration/registers-language-profile.ts](C:/lab/repos/source-code-taxonomy-scanner/src/registration/registers-language-profile.ts), [source-code-taxonomy-scanner/src/registration/registers-scanner-semantic-authority.ts](C:/lab/repos/source-code-taxonomy-scanner/src/registration/registers-scanner-semantic-authority.ts), [source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts](C:/lab/repos/source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts), [source-facts-semantic-search-engine/src/cli.js](C:/lab/repos/source-facts-semantic-search-engine/src/cli.js), [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js).
- Command evidence: `node src/cli.js project --workspace C:\lab\repos\contract-driven-artifact-governance-engine --output proof-governance-v4.json --summary` returns 37 files, 3642 symbols, 8192 relationships, 97883 document facts.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#2-empty-index-and-ingestion-correctness).

## 3) Query startup and positional-form blockers

- Evidence files: [source-facts-semantic-search-engine/src/cli.js](C:/lab/repos/source-facts-semantic-search-engine/src/cli.js), [source-facts-semantic-search-engine/src/query.js](C:/lab/repos/source-facts-semantic-search-engine/src/query.js).
- Command evidence: `node src/cli.js query "SELECT symbolId, name FROM symbols LIMIT 3" --index <proof-index> --pretty` and `node src/cli.js query --query "select symbolId, name FROM symbols limit 3" --index <proof-index> --pretty` both return `RELATIONAL_QUERY_EXECUTED`.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#3-query-startup-blockers-and-positional-sql).

## 4) Schema contract and generatedAt removal

- Evidence file: [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json).
- Command evidence: project outputs succeed with `documents` payload and without requiring run-time `generatedAt` in schema-required checks.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#4-schema-contract-and-generatedat).

## 5) Candidate-vs-resolved relationship ownership

- Evidence files: [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js), [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json).
- Command evidence: unresolved and resolved conflict counters are `0`; unresolved links are present in `toSymbolCandidate` with explicit unresolved status.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#5-candidate-vs-resolved-relationship-links).

## 6) Source-range semantics and identity stability

- Evidence files: [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js).
- Command evidence: repeated projection and range checks produce `badRanges: 0`, with stable `indexId` and repeated symbol/relationship ordering behavior.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#6-source-range-semantics), [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#5-identity-stability).

## 7) Parser-family correctness

- Evidence file: [source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts](C:/lab/repos/source-code-taxonomy-scanner/src/adapters/typescript/parses-typescript-source.ts).
- Runtime consequence: JS-family files parse correctly in admitted corpus, avoiding TS-only parser assumptions.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#7-parser-family-correctness-for-js-family-files).

## 8) JSON-first class document facts

- Evidence files: [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js), [source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json).
- Command evidence: governance projection includes `coverage.documentFacts: 97883` and `Document facts: 97883`.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#8-json-documents-as-first-class-facts).

## 9) AST enclosure metadata for from-symbol ownership

- Evidence files: [source-code-taxonomy-scanner/src/adapters/typescript/observes-typescript-node.ts](C:/lab/repos/source-code-taxonomy-scanner/src/adapters/typescript/observes-typescript-node.ts), [source-facts-semantic-search-engine/src/project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js).
- Command evidence: the smoke proof reports only functions and methods as resolved relationship sources; non-callable or unavailable enclosures remain `unresolved`.
- Cross-reference: [discussion section](C:/lab/repos/source-facts-semantic-search-engine/docs/source-facts-semantic-search-engine-discussion.md#6-identity-stability).

## 10) Closed-world body-purity know-how projection

- Authority evidence: [closed-world-artifact-conformance.v8.json](C:/lab/repos/contract-driven-artifact-governance-engine/profiles/closed-world-artifact-conformance.v8.json), [governed-artifact-engine.mjs](C:/lab/repos/contract-driven-artifact-governance-engine/lib/governed-artifact-engine.mjs).
- Projection evidence: [json-projector.js](C:/lab/repos/source-facts-semantic-search-engine/src/json-projector.js), [project.js](C:/lab/repos/source-facts-semantic-search-engine/src/project.js), [source-fact-index.schema.v1.json](C:/lab/repos/source-facts-semantic-search-engine/contracts/source-fact-index.schema.v1.json).
- Accuracy evidence: every projected forbidden mechanic has its own JSON-pointer fact and exact source range; code mechanics are labeled `OBSERVED_NOT_EVALUATED` until applicability bindings exist.
- Command evidence: `npm run prove:smoke` returns `SOURCE_FACTS_SMOKE_PROOF_COMPLETE`, 123 governance rules, 3,255 body-mechanic observations, and 11 required v8 mechanics proved and queried.

## 11) Automated verification surface

- `npm test` proves schema validity, exact JSON value slicing, callable-only relationship ownership, and logical symbol stability across comments, line movement, and body-only changes.
- `npm run conformance` in `source-code-taxonomy-scanner` passes all authority gates and eight scenarios, including explicit JS/JSX/TS/TSX parser-mode checks.
- `npm run prove:smoke` projects the advertised governance corpus twice, proves stable `indexId`, validates both outputs, checks v8 rule recovery, and executes a relational query over `governanceRules`.
