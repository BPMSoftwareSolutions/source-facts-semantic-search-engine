# Source Facts Self-Governance Report

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-03T18:39:17.031Z |
| **Repository** | src |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 2242e0bf589af3b9e2b2bdb747d71e8105c181481214973899335e26aca99d1e |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

SourceFacts indexed its own source tree and classified every observed executable
mechanic against admitted (`AUTHORITY_BOUND`) semantic authority. This report is
**observational**: no build gate, backlog baseline, or regression policy is wired
to it yet, so nothing here blocks a build.

| Metric | Count | Share of observed |
|---|---:|---:|
| Execution mechanics observed | 3,433 | 100.0% |
| Governed by semantic authority | 0 | 0.0% |
| Unknown classification | 3,433 | 100.0% |
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
| object-construction | projection-mapping | 1,250 | 57 | 0 | 0 | 0 | 1,250 | 0.0% |
| fallback | missing-value-policy | 701 | 50 | 0 | 0 | 0 | 701 | 0.0% |
| branch | decision | 663 | 50 | 0 | 0 | 0 | 663 | 0.0% |
| state-mutation | state-transition | 214 | 33 | 0 | 0 | 0 | 214 | 0.0% |
| iteration | iteration | 162 | 40 | 0 | 0 | 0 | 162 | 0.0% |
| validation | validation-policy | 103 | 18 | 0 | 0 | 0 | 103 | 0.0% |
| throw | failure-disposition | 92 | 33 | 0 | 0 | 0 | 92 | 0.0% |
| serialization | serialization-profile | 85 | 19 | 0 | 0 | 0 | 85 | 0.0% |
| exception-handling | failure-policy | 84 | 19 | 0 | 0 | 0 | 84 | 0.0% |
| normalization | translation | 78 | 14 | 0 | 0 | 0 | 78 | 0.0% |
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

*52 more file(s) for `object-construction` omitted; see `fileBreakdown` in the JSON report.*

### fallback (missing-value-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/projects-authority-candidates.js` | 196 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityDraft, buildAuthorityMechanicDraft, collectMechanics |
| `src/cli.js` | 72 | 0 | AUTHORITY_HOME_MISSING | formatSummary, formatsGallerySummary, formatsViolationCandidatesSummary |
| `src/projects-authority-from-violations.js` | 53 | 0 | AUTHORITY_HOME_MISSING | buildsPseudoIndex, buildsSourceCodeMap, loadsAuthorityMechanics |
| `src/web/html-projector.js` | 28 | 0 | AUTHORITY_HOME_MISSING | decodesEntities, handlesScriptBlock, handlesUnterminatedScript |
| `src/project.js` | 27 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, projectSourceFactsWorkspace, projectsControlMechanics |

*45 more file(s) for `fallback` omitted; see `fileBreakdown` in the JSON report.*

### branch (decision authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/cli.js` | 121 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, readsPolicy |
| `src/project.js` | 40 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, extractDeclarationHeader, loadsScanner |
| `src/projects-authority-candidates.js` | 39 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, collectMechanics |
| `src/web/html-projector.js` | 36 | 0 | AUTHORITY_HOME_MISSING | decodesEntities, handlesScriptBlock, handlesStyleBlock |
| `src/web/css-projector.js` | 32 | 0 | AUTHORITY_HOME_MISSING | extractsImportTarget, extractsUrls, findsStatementBoundary |

*45 more file(s) for `branch` omitted; see `fileBreakdown` in the JSON report.*

### state-mutation (state-transition authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/console/serves-query-console.runtime.impl.mjs` | 24 | 0 | AUTHORITY_HOME_MISSING | handleConsoleHtml, handleIndexInfo, handleQuery |
| `src/cli.js` | 22 | 0 | AUTHORITY_HOME_MISSING | parseArgs, readsPersistedGalleryPolicy, runConsole |
| `src/json-projector.js` | 18 | 0 | AUTHORITY_HOME_MISSING | consumeLiteral, parseNumber, parseObject |
| `src/projects-governed-console-contract.js` | 15 | 0 | AUTHORITY_HOME_MISSING | buildsConsoleGovernedContract |
| `src/gallery/plans-surface-previews.js` | 13 | 0 | AUTHORITY_HOME_MISSING | plansOneItem |

*28 more file(s) for `state-mutation` omitted; see `fileBreakdown` in the JSON report.*

### iteration (iteration authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/web/html-projector.js` | 26 | 0 | AUTHORITY_HOME_MISSING | idRefsForAttributes, isWithinClaimedRange, parsesAttributes |
| `src/project.js` | 17 | 0 | AUTHORITY_HOME_MISSING | buildsDeclarationRows, loadsScanner, projectSourceFactsWorkspace |
| `src/governance/formats-self-governance-report-summary.js` | 10 | 0 | AUTHORITY_HOME_MISSING | formatsFileDrillDown, formatsSelfGovernanceReportMarkdown, formatsSelfGovernanceReportSummary |
| `src/web/relationship-resolver.js` | 10 | 0 | AUTHORITY_HOME_MISSING | buildsResolutionContext, existsSyncAnyExtension, extractsJsReferences |
| `src/projects-authority-candidates.js` | 8 | 0 | AUTHORITY_HOME_MISSING | buildAuthorityMechanicDraft, buildsNormalizedSourceCodeMap, deduplicateMechanics |

*35 more file(s) for `iteration` omitted; see `fileBreakdown` in the JSON report.*

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

*9 more file(s) for `normalization` omitted; see `fileBreakdown` in the JSON report.*

### retry (continuation-policy authority family)

| File | Occurrences | Governed | Home status | Responsibilities |
|---|---:|---:|---|---|
| `src/project.js` | 1 | 0 | AUTHORITY_HOME_MISSING | projectsRelationshipMechanics |

## Authority Sources

| Authority file | Declares governance for | Mechanics declared | Authority-bound | Resolved against observed code |
|---|---|---:|---:|---:|
| `contracts/serves-query-console.authority.json` | `src/console/serves-query-console.js` | 11 | 11 | 0 ⚠️ |

## Notable Findings

- **Dangling authority source:** `contracts/serves-query-console.authority.json` declares 11 `AUTHORITY_BOUND` mechanic(s) against `src/console/serves-query-console.js`, but none resolved against any observed occurrence in this scan. The declared source file most likely no longer exists at that path (renamed or moved), so its coverage cannot currently be verified.
- **57 distinct file(s)** contain at least one mechanic with no authority document claiming them at all (`AUTHORITY_HOME_MISSING`). See File Drill-Down above and `fileBreakdown` in the JSON report for the full list.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.

