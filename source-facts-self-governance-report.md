# Source Facts Self-Governance Report

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-03T19:28:34.471Z |
| **Repository** | src |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 2cf355a16eea8e080131ffda099ac5ffd60d5563737147b1a351bb6fa0318cb1 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

SourceFacts indexed its own source tree and classified every observed executable
mechanic against admitted (`AUTHORITY_BOUND`) semantic authority. This report is
**observational**: no build gate, backlog baseline, or regression policy is wired
to it yet, so nothing here blocks a build.

| Metric | Count | Share of observed |
|---|---:|---:|
| Execution mechanics observed | 3,600 | 100.0% |
| Governed by semantic authority | 0 | 0.0% |
| Unknown classification | 3,600 | 100.0% |
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
| object-construction | projection-mapping | 1,299 | 59 | 0 | 0 | 0 | 1,299 | 0.0% |
| fallback | missing-value-policy | 723 | 54 | 0 | 0 | 0 | 723 | 0.0% |
| branch | decision | 711 | 54 | 0 | 0 | 0 | 711 | 0.0% |
| state-mutation | state-transition | 234 | 36 | 0 | 0 | 0 | 234 | 0.0% |
| iteration | iteration | 184 | 42 | 0 | 0 | 0 | 184 | 0.0% |
| validation | validation-policy | 103 | 18 | 0 | 0 | 0 | 103 | 0.0% |
| throw | failure-disposition | 92 | 33 | 0 | 0 | 0 | 92 | 0.0% |
| serialization | serialization-profile | 85 | 19 | 0 | 0 | 0 | 85 | 0.0% |
| exception-handling | failure-policy | 84 | 19 | 0 | 0 | 0 | 84 | 0.0% |
| normalization | translation | 84 | 17 | 0 | 0 | 0 | 84 | 0.0% |
| retry | continuation-policy | 1 | 1 | 0 | 0 | 0 | 1 | 0.0% |

## File Drill-Down

Top files per mechanic type by occurrence count. Full per-file detail for every
mechanic/file pair is in `fileBreakdown` in the JSON report.

### object-construction (projection-mapping authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-governed-console-contract.js` | 185 | 0 | AUTHORITY_HOME_MISSING | artifactProvenance, buildArtifactReferenceEdge, buildDecisionAuthority |
| `src/projects-authority-candidates.js` | 108 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityDraft, buildAuthorityFamilyMap, buildAuthorityMechanicDraft |
| `src/cli.js` | 78 | 0 | AUTHORITY_HOME_MISSING | formatsGallerySummary, parseArgs, readsGalleryInputs |
| `src/web/html-projector.js` | 56 | 0 | AUTHORITY_HOME_MISSING | buildsDiagnostic, handlesScriptBlock, handlesStyleBlock |
| `src/gallery/projects-gallery.js` | 52 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, calculatesProjectorAuthorityHash, plansGalleryProjection |

*54 more file(s) for `object-construction` omitted; see `fileBreakdown` in the JSON report.*

### fallback (missing-value-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-authority-candidates.js` | 196 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityDraft, buildAuthorityMechanicDraft, collectMechanics |
| `src/cli.js` | 72 | 0 | AUTHORITY_HOME_MISSING | formatSummary, formatsGallerySummary, formatsViolationCandidatesSummary |
| `src/projects-authority-from-violations.js` | 53 | 0 | AUTHORITY_HOME_MISSING | buildsPseudoIndex, buildsSourceCodeMap, loadsAuthorityMechanics |
| `src/web/html-projector.js` | 28 | 0 | AUTHORITY_HOME_MISSING | decodesEntities, handlesScriptBlock, handlesUnterminatedScript |
| `src/project.js` | 27 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, projectSourceFactsWorkspace, projectsControlMechanics |

*49 more file(s) for `fallback` omitted; see `fileBreakdown` in the JSON report.*

### branch (decision authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/cli.js` | 121 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, readsPolicy |
| `src/project.js` | 40 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, extractDeclarationHeader, loadsScanner |
| `src/projects-authority-candidates.js` | 39 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, collectMechanics |
| `src/web/html-projector.js` | 36 | 0 | AUTHORITY_HOME_MISSING | decodesEntities, handlesScriptBlock, handlesStyleBlock |
| `src/web/css-projector.js` | 32 | 0 | AUTHORITY_HOME_MISSING | extractsImportTarget, extractsUrls, findsStatementBoundary |

*49 more file(s) for `branch` omitted; see `fileBreakdown` in the JSON report.*

### state-mutation (state-transition authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/console/serves-query-console.runtime.impl.mjs` | 24 | 0 | AUTHORITY_HOME_MISSING | handleConsoleHtml, handleIndexInfo, handleQuery |
| `src/cli.js` | 22 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, runConsole |
| `src/json-projector.js` | 18 | 0 | AUTHORITY_HOME_MISSING | consumeLiteral, parseNumber, parseObject |
| `src/projects-governed-console-contract.js` | 15 | 0 | AUTHORITY_HOME_MISSING | buildsConsoleGovernedContract |
| `src/gallery/plans-surface-previews.js` | 13 | 0 | AUTHORITY_HOME_MISSING | plansOneItem |

*31 more file(s) for `state-mutation` omitted; see `fileBreakdown` in the JSON report.*

### iteration (iteration authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/web/html-projector.js` | 26 | 0 | AUTHORITY_HOME_MISSING | idRefsForAttributes, isWithinClaimedRange, parsesAttributes |
| `src/governance/formats-self-governance-report-summary.js` | 19 | 0 | AUTHORITY_HOME_MISSING | formatsContractSemanticVolume, formatsDataDrivenWiring, formatsFileDrillDown |
| `src/project.js` | 17 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, loadsScanner, projectSourceFactsWorkspace |
| `src/web/relationship-resolver.js` | 10 | 0 | AUTHORITY_HOME_MISSING | buildsResolutionContext, existsSyncAnyExtension, extractsJsReferences |
| `src/projects-authority-candidates.js` | 8 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, deduplicateMechanics |

*37 more file(s) for `iteration` omitted; see `fileBreakdown` in the JSON report.*

### validation (validation-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/validates-gallery-artifacts.js` | 16 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesBrowserRenderReceipt |
| `src/cli.js` | 13 | 0 | AUTHORITY_HOME_MISSING | readsGalleryInputs, readsPersistedGalleryPolicy, readsPolicy |
| `src/composition/validates-composition-artifacts.js` | 12 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesCompositionAuthority |
| `src/gallery/projects-gallery.js` | 11 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, plansGalleryProjection, projectsGallery |
| `src/web/validate-web-index.js` | 10 | 0 | AUTHORITY_HOME_MISSING | loadsValidator, validatesAgainst, validatesWebKnowWorkspace |

*13 more file(s) for `validation` omitted; see `fileBreakdown` in the JSON report.*

### throw (failure-disposition authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/projects-gallery.js` | 12 | 0 | AUTHORITY_HOME_MISSING | plansGalleryProjection, rejectsExistingArtifacts, resolvesDeclaration |
| `src/cli.js` | 10 | 0 | AUTHORITY_HOME_MISSING | readsPersistedGalleryPolicy, readsPolicy, resolvesSqlServerConnection |
| `src/gallery/materializes-static-preview.js` | 8 | 0 | AUTHORITY_HOME_MISSING | enforcesPreviewLimits, extractsRouteHash, materializesStaticPreviews |
| `src/sqlserver/resolves-sql-connection.js` | 6 | 0 | AUTHORITY_HOME_MISSING | resolvesSqlAuthConnectionFromEnv, resolvesTrustedConnection |
| `src/session/landing-page-contract.js` | 5 | 0 | AUTHORITY_HOME_MISSING | buildsLandingPageContract, computesDepth, requiresNonEmpty |

*28 more file(s) for `throw` omitted; see `fileBreakdown` in the JSON report.*

### serialization (serialization-profile authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/console/serves-query-console.runtime.impl.mjs` | 30 | 0 | AUTHORITY_HOME_MISSING | handleIndexInfo, handleQuery, handleRequestWithAuthority |
| `src/gallery/projects-gallery.js` | 11 | 0 | AUTHORITY_HOME_MISSING | canonicalizesJson, serializesJson, writesGalleryPlan |
| `src/cli.js` | 6 | 0 | AUTHORITY_HOME_MISSING | runProjectAuthorityViolations, runQuery, runWebQuery |
| `src/composition/writes-sign-in-composition.js` | 6 | 0 | AUTHORITY_HOME_MISSING | serializesJson, writesSignInComposition |
| `src/lib/writes-json-file.js` | 5 | 0 | AUTHORITY_HOME_MISSING | writesArray, writesJsonFile, writesTopLevelObject |

*14 more file(s) for `serialization` omitted; see `fileBreakdown` in the JSON report.*

### exception-handling (failure-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/gallery/captures-browser-render.js` | 11 | 0 | AUTHORITY_HOME_MISSING | capturesBrowserRenders, capturesOneItem, safelyReadsOrigin |
| `src/console/serves-query-console.runtime.impl.mjs` | 10 | 0 | AUTHORITY_HOME_MISSING | handleQuery, handleRequestWithAuthority, readJsonBody |
| `src/web/inventory.js` | 10 | 0 | AUTHORITY_HOME_MISSING | evaluatesFile, statSafely, walksRoot |
| `src/projects-authority-from-violations.js` | 8 | 0 | AUTHORITY_HOME_MISSING | buildsSourceCodeMap, loadsAuthorityMechanics, projectCandidatesFromViolations |
| `src/cli.js` | 5 | 0 | AUTHORITY_HOME_MISSING | readsPersistedGalleryPolicy, runWebGalleryProve, waitsForTerminationSignal |

*14 more file(s) for `exception-handling` omitted; see `fileBreakdown` in the JSON report.*

### normalization (translation authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-authority-from-violations.js` | 22 | 0 | AUTHORITY_HOME_MISSING | buildsSourceCodeMap, normalizeViolations, normalizesViolation |
| `src/projects-authority-candidates.js` | 10 | 0 | AUTHORITY_HOME_MISSING | buildsNormalizedSourceCodeMap, collectMechanicsViaQuery, deduplicateMechanics |
| `src/composition/projects-sign-in-composition.js` | 7 | 0 | AUTHORITY_HOME_MISSING | buildsSignInCompositionRequest, canonicalizesJson, evaluatesSignInCompositionCompatibility |
| `src/gallery/projects-gallery.js` | 7 | 0 | AUTHORITY_HOME_MISSING | buildsGalleryProjectionReceipt, canonicalizesJson, plansGalleryProjection |
| `src/composition/runs-sign-in-north-star.js` | 4 | 0 | AUTHORITY_HOME_MISSING | appliesSelectionOverrides, buildsSignInAuthorityChoices |

*12 more file(s) for `normalization` omitted; see `fileBreakdown` in the JSON report.*

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
| Direct data and runtime | 1 | 1.6% |
| Direct runtime only | 2 | 3.3% |
| Direct data only | 0 | 0.0% |
| Transitive data and runtime | 4 | 6.6% |
| Transitive runtime only | 2 | 3.3% |
| Transitive data only | 0 | 0.0% |
| Not determined (beyond max depth) | 2 | 3.3% |
| None determined | 50 | 82.0% |

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

299 total semantic element(s) declared across 16 document(s).

| | Elements | Share |
|---|---:|---:|
| Reachable | 255 | 85.3% |
| Orphaned (target moved or removed) | 44 | 14.7% |
| Undetermined | 0 | 0.0% |

| Document | Kind | Total | Reachable | Orphaned | Undetermined |
|---|---|---:|---:|---:|---:|
| `contracts/serves-query-console.authority.draft.json` | authority-declaration.draft.v1 | 170 | 170 | 0 | 0 |
| `contracts/serves-query-console.governed.contract.json` | governed-artifact-contract | 85 | 85 | 0 | 0 |
| `contracts/serves-query-console.contract.json` | governed-artifact-contract | 33 | 0 | 33 | 0 |
| `contracts/serves-query-console.authority.json` | authority-declaration.v1 | 11 | 0 | 11 | 0 |

**contracts/serves-query-console.authority.draft.json** -- mechanic-location reachability (170 mechanic(s) declared):

- Resolved (matched by unique suffix): 170

**contracts/serves-query-console.contract.json** -- orphaned artifacts (semantic content whose declared file no longer exists):

| Artifact | Declared path | Orphaned elements |
|---|---|---:|
| `message-projector.v1` | `src/project-message.mjs` | 13 |
| `message-command.v1` | `bin/run-message.mjs` | 11 |
| `message-verification.v1` | `verification/verifies-message.mjs` | 9 |

**contracts/serves-query-console.authority.json** -- mechanic-location reachability (11 mechanic(s) declared):

- Moved or removed: 11

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
- **61 distinct file(s)** contain at least one mechanic with no authority document claiming them at all (`AUTHORITY_HOME_MISSING`). See File Drill-Down above and `fileBreakdown` in the JSON report for the full list.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.

