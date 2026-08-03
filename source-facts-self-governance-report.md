# Source Facts Self-Governance Report

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-03T21:57:14.270Z |
| **Repository** | src |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 4080e930ee6bcd5057a580a5bd77e5279cf203d6dabf3c8532a687db03d63af5 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

SourceFacts indexed its own source tree and classified every observed executable
mechanic against admitted (`AUTHORITY_BOUND`) semantic authority. This report is
**observational**: no build gate, backlog baseline, or regression policy is wired
to it yet, so nothing here blocks a build.

| Metric | Count | Share of observed |
|---|---:|---:|
| Execution mechanics observed | 3,859 | 100.0% |
| Governed by semantic authority | 0 | 0.0% |
| Unknown classification | 3,859 | 100.0% |
| Authorized temporary backlog | 0 | 0.0% |
| Unauthorized executable meaning | 0 | 0.0% |
| Mechanical adapter operation | 0 | 0.0% |
| Kernel primitive | 0 | 0.0% |

## Coverage by Mechanic Type

Home status answers a different question than coverage: coverage is whether an
occurrence resolves to an admitted authority mechanic; home status is whether an
authority *file* claiming that mechanic's file exists at all, even incompletely.

| Mechanic | Authority family | Observed | Files | Governed | Home exists | Home incomplete | Home missing | Coverage |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| object-construction | projection-mapping | 1,371 | 69 | 0 | 0 | 0 | 1,371 | 0.0% |
| fallback | missing-value-policy | 788 | 60 | 0 | 0 | 0 | 788 | 0.0% |
| branch | decision | 779 | 62 | 0 | 0 | 0 | 779 | 0.0% |
| state-mutation | state-transition | 245 | 42 | 0 | 0 | 0 | 245 | 0.0% |
| iteration | iteration | 214 | 49 | 0 | 0 | 0 | 214 | 0.0% |
| validation | validation-policy | 103 | 18 | 0 | 0 | 0 | 103 | 0.0% |
| exception-handling | failure-policy | 92 | 21 | 0 | 0 | 0 | 92 | 0.0% |
| throw | failure-disposition | 92 | 33 | 0 | 0 | 0 | 92 | 0.0% |
| normalization | translation | 89 | 20 | 0 | 0 | 0 | 89 | 0.0% |
| serialization | serialization-profile | 85 | 19 | 0 | 0 | 0 | 85 | 0.0% |
| retry | continuation-policy | 1 | 1 | 0 | 0 | 0 | 1 | 0.0% |

## File Drill-Down

Top files per mechanic type by occurrence count. Full per-file detail for every
mechanic/file pair is in `fileBreakdown` in the JSON report.

### object-construction (projection-mapping authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-governed-console-contract.js` | 185 | 0 | AUTHORITY_HOME_MISSING | artifactProvenance, buildArtifactReferenceEdge, buildDecisionAuthority |
| `src/projects-authority-candidates.js` | 108 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityDraft, buildAuthorityFamilyMap, buildAuthorityMechanicDraft |
| `src/cli.js` | 80 | 0 | AUTHORITY_HOME_MISSING | formatsGallerySummary, parseArgs, readsGalleryInputs |
| `src/web/html-projector.js` | 56 | 0 | AUTHORITY_HOME_MISSING | buildsDiagnostic, handlesScriptBlock, handlesStyleBlock |
| `src/gallery/projects-gallery.js` | 52 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, calculatesProjectorAuthorityHash, plansGalleryProjection |

*64 more file(s) for `object-construction` omitted; see `fileBreakdown` in the JSON report.*

### fallback (missing-value-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-authority-candidates.js` | 196 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityDraft, buildAuthorityMechanicDraft, collectMechanics |
| `src/cli.js` | 74 | 0 | AUTHORITY_HOME_MISSING | formatSummary, formatsGallerySummary, formatsViolationCandidatesSummary |
| `src/projects-authority-from-violations.js` | 53 | 0 | AUTHORITY_HOME_MISSING | buildsPseudoIndex, buildsSourceCodeMap, loadsAuthorityMechanics |
| `src/governance/formats-self-governance-report-summary.js` | 39 | 0 | AUTHORITY_HOME_MISSING | formatsAuthoritySuccession, formatsAutomationReadiness, formatsContractSemanticVolume |
| `src/governance/projects-self-governance-report.js` | 29 | 0 | AUTHORITY_HOME_MISSING | compareOccurrences, projectsSelfGovernanceReport, resolvesBodyMechanicOccurrences |

*55 more file(s) for `fallback` omitted; see `fileBreakdown` in the JSON report.*

### branch (decision authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/cli.js` | 121 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, readsPolicy |
| `src/project.js` | 40 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, extractDeclarationHeader, loadsScanner |
| `src/projects-authority-candidates.js` | 39 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, collectMechanics |
| `src/web/html-projector.js` | 36 | 0 | AUTHORITY_HOME_MISSING | decodesEntities, handlesScriptBlock, handlesStyleBlock |
| `src/web/css-projector.js` | 32 | 0 | AUTHORITY_HOME_MISSING | extractsImportTarget, extractsUrls, findsStatementBoundary |

*57 more file(s) for `branch` omitted; see `fileBreakdown` in the JSON report.*

### state-mutation (state-transition authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/console/serves-query-console.runtime.impl.mjs` | 24 | 0 | AUTHORITY_HOME_MISSING | handleConsoleHtml, handleIndexInfo, handleQuery |
| `src/cli.js` | 22 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, runConsole |
| `src/json-projector.js` | 18 | 0 | AUTHORITY_HOME_MISSING | consumeLiteral, parseNumber, parseObject |
| `src/projects-governed-console-contract.js` | 15 | 0 | AUTHORITY_HOME_MISSING | buildsConsoleGovernedContract |
| `src/gallery/plans-surface-previews.js` | 13 | 0 | AUTHORITY_HOME_MISSING | plansOneItem |

*37 more file(s) for `state-mutation` omitted; see `fileBreakdown` in the JSON report.*

### iteration (iteration authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/governance/formats-self-governance-report-summary.js` | 34 | 0 | AUTHORITY_HOME_MISSING | formatsAuthoritySuccession, formatsAutomationReadiness, formatsContractSemanticVolume |
| `src/web/html-projector.js` | 26 | 0 | AUTHORITY_HOME_MISSING | idRefsForAttributes, isWithinClaimedRange, parsesAttributes |
| `src/project.js` | 17 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, loadsScanner, projectSourceFactsWorkspace |
| `src/web/relationship-resolver.js` | 10 | 0 | AUTHORITY_HOME_MISSING | buildsResolutionContext, existsSyncAnyExtension, extractsJsReferences |
| `src/projects-authority-candidates.js` | 8 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, deduplicateMechanics |

*44 more file(s) for `iteration` omitted; see `fileBreakdown` in the JSON report.*

### validation (validation-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/validates-gallery-artifacts.js` | 16 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesBrowserRenderReceipt |
| `src/cli.js` | 13 | 0 | AUTHORITY_HOME_MISSING | readsGalleryInputs, readsPersistedGalleryPolicy, readsPolicy |
| `src/composition/validates-composition-artifacts.js` | 12 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesCompositionAuthority |
| `src/gallery/projects-gallery.js` | 11 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, plansGalleryProjection, projectsGallery |
| `src/web/validate-web-index.js` | 10 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesWebKnowWorkspace |

*13 more file(s) for `validation` omitted; see `fileBreakdown` in the JSON report.*

### exception-handling (failure-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/captures-browser-render.js` | 11 | 0 | AUTHORITY_HOME_MISSING | capturesBrowserRenders, capturesOneItem, safelyReadsOrigin |
| `src/console/serves-query-console.runtime.impl.mjs` | 10 | 0 | AUTHORITY_HOME_MISSING | handleQuery, handleRequestWithAuthority, readJsonBody |
| `src/web/inventory.js` | 10 | 0 | AUTHORITY_HOME_MISSING | evaluatesFile, statSafely, walksRoot |
| `src/projects-authority-from-violations.js` | 8 | 0 | AUTHORITY_HOME_MISSING | buildsSourceCodeMap, loadsAuthorityMechanics, projectCandidatesFromViolations |
| `src/cli.js` | 5 | 0 | AUTHORITY_HOME_MISSING | readsPersistedGalleryPolicy, runWebGalleryProve, waitsForTerminationSignal |

*16 more file(s) for `exception-handling` omitted; see `fileBreakdown` in the JSON report.*

### throw (failure-disposition authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/projects-gallery.js` | 12 | 0 | AUTHORITY_HOME_MISSING | plansGalleryProjection, rejectsExistingArtifacts, resolvesDeclaration |
| `src/cli.js` | 10 | 0 | AUTHORITY_HOME_MISSING | readsPersistedGalleryPolicy, readsPolicy, resolvesSqlServerConnection |
| `src/gallery/materializes-static-preview.js` | 8 | 0 | AUTHORITY_HOME_MISSING | enforcesPreviewLimits, extractsRouteHash, materializesStaticPreviews |
| `src/sqlserver/resolves-sql-connection.js` | 6 | 0 | AUTHORITY_HOME_MISSING | resolvesSqlAuthConnectionFromEnv, resolvesTrustedConnection |
| `src/session/landing-page-contract.js` | 5 | 0 | AUTHORITY_HOME_MISSING | buildsLandingPageContract, computesDepth, requiresNonEmpty |

*28 more file(s) for `throw` omitted; see `fileBreakdown` in the JSON report.*

### normalization (translation authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-authority-from-violations.js` | 22 | 0 | AUTHORITY_HOME_MISSING | buildsSourceCodeMap, normalizeViolations, normalizesViolation |
| `src/projects-authority-candidates.js` | 10 | 0 | AUTHORITY_HOME_MISSING | buildsNormalizedSourceCodeMap, collectMechanicsViaQuery, deduplicateMechanics |
| `src/composition/projects-sign-in-composition.js` | 7 | 0 | AUTHORITY_HOME_MISSING | buildsSignInCompositionRequest, canonicalizesJson, evaluatesSignInCompositionCompatibility |
| `src/gallery/projects-gallery.js` | 7 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, canonicalizesJson, plansGalleryProjection |
| `src/composition/runs-sign-in-north-star.js` | 4 | 0 | AUTHORITY_HOME_MISSING | appliesSelectionOverrides, buildsSignInAuthorityChoices |

*15 more file(s) for `normalization` omitted; see `fileBreakdown` in the JSON report.*

### serialization (serialization-profile authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/console/serves-query-console.runtime.impl.mjs` | 30 | 0 | AUTHORITY_HOME_MISSING | handleIndexInfo, handleQuery, handleRequestWithAuthority |
| `src/gallery/projects-gallery.js` | 11 | 0 | AUTHORITY_HOME_MISSING | canonicalizesJson, serializesJson, writesGalleryPlan |
| `src/cli.js` | 6 | 0 | AUTHORITY_HOME_MISSING | runProjectAuthorityViolations, runQuery, runWebQuery |
| `src/composition/writes-sign-in-composition.js` | 6 | 0 | AUTHORITY_HOME_MISSING | serializesJson, writesSignInComposition |
| `src/lib/writes-json-file.js` | 5 | 0 | AUTHORITY_HOME_MISSING | writesArray, writesJsonFile, writesTopLevelObject |

*14 more file(s) for `serialization` omitted; see `fileBreakdown` in the JSON report.*

### retry (continuation-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/project.js` | 1 | 0 | AUTHORITY_HOME_MISSING | projectsRelationshipMechanics |

## Data-Driven Wiring

A different question again: not "is this occurrence governed" or "does an
authority document claim this file," but "does this file's own source code
already import a JSON contract/authority artifact and/or invoke a semantic
execution runtime" -- directly, or transitively through a local helper file.
Detected from the scanner's import (`dependency`) relationships.

| Wiring posture | Files | Share |
|---|---:|---:|
| Direct data and runtime | 1 | 1.4% |
| Direct runtime only | 2 | 2.8% |
| Direct data only | 0 | 0.0% |
| Transitive data and runtime | 4 | 5.6% |
| Transitive runtime only | 2 | 2.8% |
| Transitive data only | 0 | 0.0% |
| Not determined (beyond max depth) | 2 | 2.8% |
| None determined | 60 | 84.5% |

| File | Wiring | Direct evidence | Transitive evidence | Hops | Hop path |
|---|---|---|---|---:|---|
| `src/cli.js` | TRANSITIVE_RUNTIME_ONLY | — | `../../contract-driven-artifact-governance-engine/lib/governed-artifact-engine.mjs`, `@deterministic-solutions/semantic-kernel` | 1 | `src/cli.js` → `src/projects-governed-console-contract.js` |
| `src/composition/runs-sign-in-north-star.js` | NOT_DETERMINED_BEYOND_MAX_DEPTH | — | — | capped | — |
| `src/composition/writes-sign-in-composition.js` | NOT_DETERMINED_BEYOND_MAX_DEPTH | — | — | capped | — |
| `src/console/console-authority-runtime.mjs` | TRANSITIVE_DATA_AND_RUNTIME | — | `./contracts/console-validation.bundle.json`, `../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs` | 2 | `src/console/console-authority-runtime.mjs` → `src/console/console-validation-adapter.mjs` → `src/console/console-validation-adapter.runtime.mjs` |
| `src/console/console-validation-adapter.runtime.mjs` | DIRECT_DATA_AND_RUNTIME | `./contracts/console-validation.bundle.json`, `../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs` | — | — | — |
| `src/console/governed-message-artifact-family/bin/run-message.mjs` | TRANSITIVE_DATA_AND_RUNTIME | — | `../contracts/message.schema.json`, `../contracts/project-message.authority.json`, `contract-driven-artifact-governance-engine` | 1 | `src/console/governed-message-artifact-family/bin/run-message.mjs` → `src/console/governed-message-artifact-family/src/project-message.mjs` |
| `src/console/governed-message-artifact-family/verification/verifies-message.mjs` | TRANSITIVE_DATA_AND_RUNTIME | — | `../contracts/message.schema.json`, `../contracts/project-message.authority.json`, `contract-driven-artifact-governance-engine` | 1 | `src/console/governed-message-artifact-family/verification/verifies-message.mjs` → `src/console/governed-message-artifact-family/src/project-message.mjs` |
| `src/console/serves-query-console.runtime.impl.mjs` | TRANSITIVE_DATA_AND_RUNTIME | — | `./contracts/console-validation.bundle.json`, `../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs` | 3 | `src/console/serves-query-console.runtime.impl.mjs` → `src/console/console-authority-runtime.mjs` → `src/console/console-validation-adapter.mjs` → `src/console/console-validation-adapter.runtime.mjs` |
| `src/projects-governed-console-contract.js` | RUNTIME_ONLY | `../../contract-driven-artifact-governance-engine/lib/governed-artifact-engine.mjs` | — | — | — |
| `src/web/classification-overlay.js` | RUNTIME_ONLY | `@deterministic-solutions/semantic-kernel` | — | — | — |
| `src/web/project-web-surfaces.js` | TRANSITIVE_RUNTIME_ONLY | — | `@deterministic-solutions/semantic-kernel` | 1 | `src/web/project-web-surfaces.js` → `src/web/classification-overlay.js` |

## Contract Semantic Volume

A third question, distinct from coverage and wiring: how much declared
meaning -- decisions, semantic edges, failure policies, projection
mappings, result contracts, mechanics -- exists across every discovered
authority-shaped document, and how much of it still points at a file that
exists in the current scan versus one that moved, was renamed, or was
removed. This is measured per-artifact or per-mechanic where the document
shape allows it (exact), and left undetermined where it doesn't rather
than guessed.

313 total semantic element(s) declared across 17 document(s).

| | Elements | Share |
|---|---:|---:|
| Reachable | 269 | 85.9% |
| Orphaned (target moved or removed) | 44 | 14.1% |
| Undetermined | 0 | 0.0% |

| Document | Kind | Total | Reachable | Orphaned | Undetermined |
|---|---|---:|---:|---:|---:|
| `contracts/serves-query-console.authority.draft.json` | authority-declaration.draft.v1 | 170 | 170 | 0 | 0 |
| `contracts/serves-query-console.governed.contract.json` | governed-artifact-contract | 85 | 85 | 0 | 0 |
| `contracts/serves-query-console.contract.json` | governed-artifact-contract | 33 | 0 | 33 | 0 |
| `contracts/serves-query-console.authority.complete.json` | authority-declaration-unmarked.v1 | 14 | 14 | 0 | 0 |
| `contracts/serves-query-console.authority.json` | authority-declaration.v1 | 11 | 0 | 11 | 0 |

**contracts/serves-query-console.authority.draft.json** -- mechanic-location reachability (170 mechanic(s) declared):

- Resolved (matched by unique suffix): 170

**contracts/serves-query-console.contract.json** -- orphaned artifacts (semantic content whose declared file no longer exists):

| Artifact | Declared path | Orphaned elements |
|---|---|---:|
| `message-projector.v1` | `src/project-message.mjs` | 13 |
| `message-command.v1` | `bin/run-message.mjs` | 11 |
| `message-verification.v1` | `verification/verifies-message.mjs` | 9 |

**contracts/serves-query-console.authority.complete.json** -- mechanic-location reachability (14 mechanic(s) declared):

- Resolved (exact path): 14

**contracts/serves-query-console.authority.json** -- mechanic-location reachability (11 mechanic(s) declared):

- Moved or removed: 11

## Authority Succession

A fifth question, at the document level: when a declared `sourceFile`
exists but no longer carries its declared mechanic types -- a re-export
shim left behind by a runtime split, e.g. `serves-query-console.mjs` ->
`.runtime.mjs` -> `.runtime.impl.mjs` -- is there a current file
downstream in the local import graph that plausibly inherited that
meaning? This claims only mechanic-TYPE presence in a resolved
successor, never a semantic verdict on whether the declared meaning
itself still holds -- that remains a human review decision.

| Authority file | Declared source | Succession | Successor file | Hops | Mechanics present |
|---|---|---|---|---:|---:|
| `contracts/serves-query-console.authority.complete.json` | `src/console/serves-query-console.mjs` | Successor resolved (partial mechanic-type overlap) | `src/console/serves-query-console.runtime.impl.mjs` | 2 | 10/14 |
| `contracts/serves-query-console.authority.draft.json` | `serves-query-console.runtime.impl.mjs` | Source still current, but missing some declared mechanic types | — | — | 166/170 |
| `contracts/serves-query-console.authority.json` | `src/console/serves-query-console.js` | No current successor found | — | — | 0/11 |

Recommended next action:

- `contracts/serves-query-console.authority.complete.json`: **REVIEW_PARTIAL_SUCCESSOR_AND_AUTHOR_GAPS**
- `contracts/serves-query-console.authority.draft.json`: **REVIEW_SOURCE_FOR_MISSING_MECHANIC_TYPES**
- `contracts/serves-query-console.authority.json`: **RECONCILE_MANUALLY_NO_ANCHOR**

## Semantic Overlap Proposals

A sixth source, gathered from outside the deterministic pipeline: agent-
inferred, human-reviewed proposals for whether current code still embodies
specific historical authority meaning. Discovered from `reviews/` (never
`contracts/`, never scanned as authority). Every batch keeps its own
lifecycle -- nothing here is admitted authority, and nothing here changes
any coverage number elsewhere in this report.

### `reviews/serves-query-console.authority-complete.semantic-overlap-proposals.json`

- **Lifecycle:** `INFERRED_NOT_ADMITTED`
- **Subject:** `contracts/serves-query-console.authority.complete.json` -> `src/console/serves-query-console.runtime.impl.mjs`
- **Inferred by:** gemini-flash-latest at 2026-08-03T21:17:46.489Z
- **Model proposed:** 14 proposal(s) -- PROPOSED_EXACT_OVERLAP: 14
- **After human review:** PROPOSED_EXACT_OVERLAP: 13, PROPOSED_PARTIAL_OVERLAP: 1

| Mechanic | Review verdict | Corrected disposition | Reason |
|---|---|---|---|
| `error-response-serialization` | AMEND_TO_PARTIAL_OVERLAP | PROPOSED_PARTIAL_OVERLAP | The model's rationale conflates 'JSON.stringify happens everywhere' with 'this mechanic's delegated serialization policy governs everywhere'. serializesErrorResponse() only covers the error-response path. The three success-path handlers (handleIndexInfo, handleQuery, handleSnippet in serves-query-console.runtime.impl.mjs) build and JSON.stringify their own response bodies inline, not through any delegated authority function. That inline success-path serialization is exactly the 'serialization' mechanic type the deterministic automationReadiness layer already flags 30 times as REQUIRES_HUMAN_SEMANTIC_DECISION in the unrelated 170-candidate draft -- same file, same unresolved gap, confirmed from two independent angles now. |
| `line-ending-normalization` | APPROVE_WITH_ADDITIONAL_FINDING | PROPOSED_EXACT_OVERLAP | console-authority-runtime.mjs exports a dedicated normalizesLineEndings() function citing this exact mechanicId, but it is never imported by serves-query-console.runtime.impl.mjs -- grep confirms its only consumer is a re-export barrel (console-authority-bundles.mjs) with no further importer. The live behavior is actually the inline text.replaceAll(...) duplicated directly inside extractsSnippetLines(). The model cited both functions as if they were one confirming pair of evidence without noticing one of them is unreachable. Overlap verdict (EXACT) stands for the live path, but the file also carries dead authority-shaped code: normalizesLineEndings, normalizesPathSegments, normalizesPathForComparison, buildsErrorResponse, and selectsDefaultValue are all defined and cite real mechanicIds but have zero live callers. |

**Inference quality** -- not a benchmark of the model; a benchmark of how efficiently this review converted candidate understanding into admitted knowledge:

| Metric | Value |
|---|---:|
| Proposals generated | 14 |
| Approved unchanged | 12 |
| Approved with additional finding | 1 |
| Amended | 1 |
| Rejected | 0 |
| Model confidence (average) | 1.00 |
| Confidence after review (average) | 0.96 |
| New deterministic findings from review | 1 |
| Know-how extracted | 3 |
| Candidate authorities identified | 1 |

Know-how extracted:

- **[implementation-gap, repository-specific]** Success-path JSON response serialization (handleIndexInfo, handleQuery, handleSnippet) is duplicated inline rather than delegated; only the error path is centralized through serializesErrorResponse(). The codebase clearly intended full centralization -- it just isn't complete yet.
- **[governance-invariant, cross-repository]** This repo's generated-bundle convention (@generated header + 'Authority source: <mechanicId>' citation comments) can produce a bundle that is structurally correct and correctly cited but never imported anywhere. Citation correctness and live-wiring correctness are independent properties and must be checked separately -- 5 of 11 bundles in console-authority-runtime.mjs demonstrate this.
- **[analysis-limitation, cross-repository]** A duplicate inline implementation sitting next to an unused delegated one both register as the same mechanic type in the source index, which can mask that only one of the two is actually live. Mechanic-type-presence alone (as used by resolvesAuthoritySuccession) cannot distinguish 'the real one' from 'a dead twin'.

Candidate authorities identified:

- **success-response-serialization** (serialization) -- Formally declare and, ideally, delegate the three success-path JSON.stringify call sites (handleIndexInfo, handleQuery, handleSnippet) the same way error-response-serialization is already delegated through serializesErrorResponse(). Closes the exact gap review found in error-response-serialization above.

## Know-How Registry

What review has actually admitted, downstream of Semantic Overlap
Proposals. Discovered from `know-how/` (distinct from `reviews/`, which
holds proposals no human has acted on yet). An authority-remediation
candidate here is still explicitly not authority -- lifecycle stays
`CANDIDATE_NOT_AUTHORED` until a human writes and admits the real
authority document.

3 admitted know-how record(s), 1 authority-remediation candidate(s).

By kind: governance-invariant (1), analysis-limitation (1), implementation-gap (1)
By generalizability: cross-repository (2), repository-specific (1)

| Know-how ID | Kind | Generalizability | Statement |
|---|---|---|---|
| `citation-and-live-wiring-are-independent` | governance-invariant | cross-repository | This repo's generated-bundle convention (@generated header + 'Authority source: <mechanicId>' citation comments) can produce a bundle that is structurally correct and correctly cited but never imported anywhere. Citation correctness and live-wiring correctness are independent properties and must be checked separately -- 5 of 11 bundles in console-authority-runtime.mjs demonstrate this. |
| `mechanic-type-presence-cannot-detect-dead-duplicates` | analysis-limitation | cross-repository | A duplicate inline implementation sitting next to an unused delegated one both register as the same mechanic type in the source index, which can mask that only one of the two is actually live. Mechanic-type-presence alone (as used by resolvesAuthoritySuccession) cannot distinguish 'the real one' from 'a dead twin'. |
| `success-path-serialization-duplicated-inline` | implementation-gap | repository-specific | Success-path JSON response serialization (handleIndexInfo, handleQuery, handleSnippet) is duplicated inline rather than delegated; only the error path is centralized through serializesErrorResponse(). The codebase clearly intended full centralization -- it just isn't complete yet. |

| Candidate authority | Lifecycle | Family | Cites know-how | Rationale |
|---|---|---|---|---|
| `success-response-serialization` | `CANDIDATE_NOT_AUTHORED` | serialization | `success-path-serialization-duplicated-inline` | Formally declare and, ideally, delegate the three success-path JSON.stringify call sites (handleIndexInfo, handleQuery, handleSnippet) the same way error-response-serialization is already delegated through serializesErrorResponse(). Closes the exact gap review found in error-response-serialization above. |

## Automation Readiness

A fourth question, narrower than coverage or wiring: for every occurrence
that isn't yet `GOVERNED_BY_SEMANTIC_AUTHORITY`, can connecting it to
authority be automated without new authoring, and if not, exactly what is
missing? Reachable candidate evidence is necessary but not sufficient -- a
candidate can carry its own `coverageDisposition` (this repo's drafts only
use `SEMANTIC_DECISION_REQUIRED` today) declaring that a human judgment
call is still open even though the mechanical scaffolding (type, location,
semantic shape) is already complete.

| Automation posture | Occurrences | Share |
|---|---:|---:|
| Already governed | 0 | 0.0% |
| Automatable after review | 0 | 0.0% |
| Requires human semantic decision | 158 | 4.1% |
| Automatable after authority completion | 0 | 0.0% |
| Requires new authority | 3,701 | 95.9% |
| Not currently projectable | 0 | 0.0% |
| Not applicable (mechanical/kernel/backlog) | 0 | 0.0% |

| Mechanic | File | Automation posture | Candidate authority | Occurrences |
|---|---|---|---|---:|
| object-construction | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 47 |
| serialization | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 30 |
| fallback | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 26 |
| state-mutation | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 24 |
| branch | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 16 |
| exception-handling | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 10 |
| throw | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 4 |
| validation | `src/console/serves-query-console.runtime.impl.mjs` | Requires human semantic decision | `contracts/serves-query-console.authority.draft.json` | 1 |

## Authority Sources

| Authority file | Declares governance for | Mechanics declared | Authority-bound | Resolved against observed code |
|---|---|---:|---:|---:|
| `contracts/serves-query-console.authority.json` | `src/console/serves-query-console.js` | 11 | 11 | 0 ⚠️ |

## Other Authority Documents

Authority-shaped JSON documents this report found but cannot verify mechanic-by-
mechanic, because they use a different convention than `authority-declaration.v1`
(a bundle, a full governed-artifact contract, a projection ledger, ...). They still
count toward `AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE` for any file they claim, rather
than being silently ignored.

| Document | Kind | Claimed files |
|---|---|---|
| `contracts/composition-authorities/app-lab-email-password-entry.authority.v1.json` | composition-authority.v1 | (not determinable from this document alone) |
| `contracts/composition-authorities/app-lab-split-auth-layout.authority.v1.json` | composition-authority.v1 | (not determinable from this document alone) |
| `contracts/composition-authorities/loga-midnight-theme.authority.v1.json` | composition-authority.v1 | (not determinable from this document alone) |
| `contracts/composition-authorities/loga-student-access-messaging.authority.v1.json` | composition-authority.v1 | (not determinable from this document alone) |
| `contracts/serves-query-console.admitted.contract.json` | governed-artifact-contract | `src/console/serves-query-console.js`, `contracts/serves-query-console.authority.json` |
| `contracts/serves-query-console.authority.complete.json` | authority-declaration-unmarked.v1 | `src/console/serves-query-console.mjs` |
| `contracts/serves-query-console.authority.draft.json` | authority-declaration.draft.v1 | `serves-query-console.runtime.impl.mjs` |
| `contracts/serves-query-console.binding.json` | authority-binding.v1 | `src/console/serves-query-console.js` |
| `contracts/serves-query-console.contract.json` | governed-artifact-contract | `contracts/message.schema.json`, `contracts/message.json`, `contracts/project-message.authority.json`, `src/project-message.mjs`, `bin/run-message.mjs`, `verification/verifies-message.mjs`, `README.md`, `architecture/closed-loop.mmd`, `package.json`, `architecture/decisions/cryptographic-lineage.md` |
| `contracts/serves-query-console.governed.contract.json` | governed-artifact-contract | `src/console/console-authority-bundles.mjs`, `src/console/console-routing-adapter.mjs`, `src/console/console-validation-adapter.mjs`, `src/console/contracts/console-request-routing.bundle.json`, `src/console/contracts/console-snippet-retrieval.bundle.json`, `src/console/console-snippet-adapter.mjs`, `src/console/serves-query-console.mjs`, `src/console/serves-query-console.conformant.mjs`, `src/console/serves-query-console.projected.mjs` |
| `contracts/workspace-file-system.contract.json` | governed-artifact-contract | (not determinable from this document alone) |
| `src/console/.governance/projections/governed-message-artifact-family.ledger.json` | governed-artifact-projection-ledger.v1 | (not determinable from this document alone) |
| `src/console/contracts/console-request-routing.bundle.json` | semantic-execution-bundle.v1 | (not determinable from this document alone) |
| `src/console/contracts/console-snippet-retrieval.bundle.json` | semantic-execution-bundle.v1 | (not determinable from this document alone) |
| `src/console/contracts/console-validation.bundle.json` | semantic-execution-bundle.v1 | (not determinable from this document alone) |
| `src/console/governed-message-artifact-family/contracts/project-message.authority.json` | semantic-projection-authority.v1 | (not determinable from this document alone) |

## Notable Findings

- **Dangling authority source:** `contracts/serves-query-console.authority.json` declares 11 `AUTHORITY_BOUND` mechanic(s) against `src/console/serves-query-console.js`, but none resolved against any observed occurrence in this scan. The declared source file most likely no longer exists at that path (renamed or moved), so its coverage cannot currently be verified.
- **71 distinct file(s)** contain at least one mechanic with no authority document claiming them at all (`AUTHORITY_HOME_MISSING`). See File Drill-Down above and `fileBreakdown` in the JSON report for the full list.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.

