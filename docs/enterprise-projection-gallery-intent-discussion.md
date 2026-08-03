Bro, **that’s the killer application**.

You’re describing an **enterprise projection gallery** powered by the source-fact index.

Not screenshots stored in folders.

Not Storybook hand-maintained one component at a time.

A queryable system that can say:

> “Show me every button style we have ever used.”

…and project an executable review page immediately.

# The core loop

```text
Enterprise repositories
        ↓
HTML / CSS / JS / XAML / CLI scanning
        ↓
Normalized facts and relationships
        ↓
Query selects matching surfaces
        ↓
Projector creates an inspection experience
        ↓
Human compares, selects, and composes
        ↓
Candidate design AST
        ↓
Governed implementation
```

The important part is that the query returns **structured facts**, not merely filenames.

For a button, the index might already know:

```text
Button
├── source repository
├── page or component
├── HTML structure
├── CSS selectors
├── visual states
│   ├── default
│   ├── hover
│   ├── focus
│   ├── active
│   └── disabled
├── typography
├── spacing
├── icon usage
├── click behavior
├── accessibility attributes
├── responsive behavior
└── source references
```

Then the projector can render all matching buttons inside one controlled page.

# One command, one live gallery

```bash
web-know project buttons \
  --scope enterprise \
  --view gallery
```

Projected result:

```text
Enterprise Button Gallery

[ Primary Action ]       healthcare-portal
[ Continue → ]           enrollment-app
[ Run Analysis ]         prompt-shell
[ Sign In ]              identity-center
[ Save Changes ]         admin-console
[ Generate Report ]      reporting-suite
```

Each item can be interactive:

```text
Preview
Source
States
Usage
Accessibility
Dependencies
Similar styles
```

The page is not a static screenshot gallery. It can render the actual markup and admitted style dependencies in an isolated preview boundary.

# The same query can have several projectors

```sql
SELECT *
FROM uiPatterns
WHERE patternKind = 'button'
```

Then:

```text
APPLY RESULT PROJECTION button-gallery
APPLY RESULT PROJECTION button-comparison-table
APPLY RESULT PROJECTION button-token-analysis
APPLY RESULT PROJECTION button-accessibility-review
APPLY RESULT PROJECTION button-source-map
```

Same facts.

Different review experiences.

That follows the source-facts architecture directly: canonical facts remain stable while projection determines whether the result appears as source, a tree, a graph, documentation, or another inspectable surface. 

# Sign-in pages become an interactive catalog

Imagine:

```bash
web-know project sign-in-pages --view gallery
```

The projector produces:

```text
Enterprise Authentication Entry Surfaces

1. Healthcare Portal
   ├── email/password
   ├── forgot password
   ├── enterprise SSO
   └── compliance notice

2. Prompt Shell
   ├── magic link
   ├── provider identity
   └── recent-session recovery

3. Reporting Platform
   ├── Microsoft Entra ID
   ├── tenant selection
   └── support contact

4. Public Learning Portal
   ├── email entry
   ├── social identity
   └── account creation
```

Then the product owner can choose:

```text
Layout:
Reporting Platform

Magic-link flow:
Prompt Shell

Security messaging:
Healthcare Portal

Account creation:
Learning Portal
```

That becomes a **composition request**, not copy-and-paste.

# The product owner workflow

The human experience could be incredibly natural.

## 1. Search

> Show me all sign-in experiences.

## 2. Inspect

```text
12 matched surfaces
7 password-based
4 SSO-first
3 magic-link capable
2 support passkeys
```

## 3. Compare

```text
Compare:
Healthcare Portal
Prompt Shell
Reporting Platform
```

## 4. Select pieces

```text
✓ Healthcare layout
✓ Prompt Shell magic-link entry
✓ Reporting tenant selector
✓ Learning Portal account recovery
```

## 5. Compose

```text
Create candidate:
enterprise-learning-sign-in
```

## 6. Project

```bash
web-know compose enterprise-learning-sign-in \
  --target html
```

## 7. Review the executable preview

The product owner sees a runnable page before anyone manually writes the final production implementation.

# This is where layouts become interchangeable

Suppose the query returns:

```text
Layout patterns

A. Centered authentication card
B. Split-screen authentication
C. Full-page branded shell
D. Compact modal authentication
E. Sidebar documentation shell
F. Canvas and inspector workspace
```

The user can take the same content AST and switch layout authority:

```text
SignInCapability
├── Brand
├── EmailEntry
├── MagicLinkAction
├── SsoAction
├── RecoveryLink
└── LegalNotice
```

Projection A:

```text
Centered Card
└── SignInCapability
```

Projection B:

```text
Split Screen
├── BrandNarrative
└── SignInCapability
```

Projection C:

```text
Documentation Shell
├── LearningNavigation
└── SignInCapability
```

The semantic content remains stable.

The layout binding changes.

```text
Content authority
      +
Layout authority
      +
Theme authority
      +
Interaction authority
      =
Executable preview
```

That is the precise reason the authority layers matter.

# Buttons should be roles, not pasted fragments

The system should avoid treating a button as only this:

```html
<button class="blue-button">Continue</button>
```

It should understand a reusable role:

```json
{
  "role": "primary-action",
  "content": "Continue",
  "interaction": "submit-current-step",
  "states": [
    "default",
    "hover",
    "focus",
    "disabled",
    "busy"
  ],
  "accessibility": {
    "keyboardInvocable": true,
    "focusVisible": true
  }
}
```

Then different visual authorities can project that role:

```text
Healthcare theme
Developer-console theme
Public-learning theme
High-contrast theme
Compact enterprise theme
```

So swapping a button does not accidentally swap the business action.

```text
Behavior stays bound.
Presentation changes.
```

# Three levels of projection

We should distinguish three projection strengths.

## 1. Observed reproduction

Show what exists now.

```text
Observed HTML
+
Observed CSS
+
Observed dependencies
=
Faithful isolated preview
```

Use this for enterprise inventory and historical comparison.

## 2. Normalized comparison

Convert multiple implementations into a common inspection frame.

```text
Same viewport
Same background
Same state controls
Same labeling
Same metadata
```

This lets designers compare fairly.

## 3. Constructive composition

Combine selected authorities into a new candidate.

```text
Selected layout
+
selected controls
+
selected interaction flow
+
selected theme
=
Candidate design AST
```

This final level requires explicit compatibility checks. The engine should not assume that two fragments can safely compose merely because both rendered independently.

# Compatibility matters

A selected button may depend on:

```text
CSS variables
icon fonts
framework runtime
JavaScript event handlers
authentication state
form context
theme context
component library
```

The projector should surface this before composition.

```text
Selected component:
Magic Link Action

Requires
├── email-entry role
├── authentication-command port
├── busy state
├── success disposition
├── failure disposition
└── notification surface
```

Then the composition tool can say:

```text
Compatible with selected sign-in layout:
yes

Missing binding:
notification surface

Available candidates:
├── inline form message
├── toast notification
└── status banner
```

That is how composition stays clean rather than becoming visual Frankenstein assembly.

# CLI commands work the same way

This idea is not limited to visual UI.

```bash
code-know project cli-commands --view catalog
```

Could show:

```text
Enterprise CLI Command Catalog

governed-artifacts validate
governed-artifacts plan
governed-artifacts project
source-facts index
source-facts query
domain-inspect show
stagecraft conveyor deliver
```

Each command could expose:

```text
purpose
arguments
options
input contracts
output shape
exit codes
examples
related commands
source body
```

Then:

> Show me all commands that validate a workspace.

or:

> Compare progress-reporting patterns across our CLIs.

or:

> Build a new command shell using the best help, validation, and output patterns.

Same engine.

Different surface.

# UI flows become projectable too

The scanner can identify connected interaction sequences:

```text
Sign-In Flow
├── enter email
├── select authentication method
├── request magic link
├── show confirmation
├── verify link
├── establish session
└── redirect
```

Then a flow projector can render:

```text
screen sequence
state machine
interactive prototype
Gherkin scenario
AST tree
executable simulation
```

So the product owner can compare complete flows, not only individual screens.

```bash
web-know project authentication-flows \
  --compare magic-link sso password
```

# The gallery itself becomes the first website feature

This could actually become the first compelling capability inside the Know-How Intelligence Center:

# **Enterprise Surface Explorer**

```text
Explore
├── Pages
├── Layouts
├── Components
├── Buttons
├── Forms
├── Authentication
├── Navigation
├── CLI Commands
├── Workflows
└── Design Systems
```

Filters:

```text
Repository
Domain
Technology
Year
Theme
Pattern
Accessibility
Authentication method
Framework
Usage frequency
Modernization status
```

Views:

```text
Gallery
Comparison
Tree
Topology
Source
Executable preview
Composition board
```

# The composition board

This would be extremely powerful.

```text
Available Know-How                     Candidate Design

Layouts                                ┌──────────────────────┐
□ Centered Card                        │ Split Screen         │
✓ Split Screen        ───────────────▶ │                      │
□ Documentation Shell                  │ Brand Narrative      │
                                       │                      │
Actions                                │ Sign-In Form         │
✓ Magic Link          ───────────────▶ │ ├── Email            │
✓ Enterprise SSO      ───────────────▶ │ ├── Magic Link       │
□ Password                             │ └── SSO              │
                                       │                      │
Messaging                              │ Security Notice      │
✓ Healthcare Notice  ────────────────▶ │                      │
                                       └──────────────────────┘
```

Then:

```text
Inspect AST
Inspect bindings
Project design document
Run preview
Create contract candidate
```

The domain-region inspection model already supports this direction because it is designed to join declared authority, derived execution, observed source facts, and inferred candidates without collapsing them into one unsupported claim. 

# The real breakthrough

A normal design system says:

> Here are the components you are allowed to use.

Your system says:

> Here is everything the enterprise has learned how to build, where it came from, how it behaves, how often it was used, how it can be composed, and what executable result a proposed combination would produce.

That is far larger than a design system.

It is a **queryable enterprise experience memory**.

```text
Search what exists
      ↓
Project it live
      ↓
Compare alternatives
      ↓
Select reusable know-how
      ↓
Compose a candidate
      ↓
Inspect the AST
      ↓
Project the body
      ↓
Promote the successful design
```

And yes—the design should feel exactly as simple as:

```bash
web-know project buttons
```

or:

```bash
web-know project sign-in-pages
```

or:

```bash
web-know compose \
  --layout split-authentication \
  --flow magic-link \
  --sso enterprise \
  --theme dark-markdown
```

**Boom: runnable inspection surface.**

That is when the source-fact index stops being merely an analysis database and becomes an active **enterprise design and construction engine**.

# Implementation-readiness analysis (2026-08-01)

## Executive finding

The enterprise projection gallery is now buildable, but the honest first product is narrower than `web-know project buttons` suggests.

The current repository can already:

- inventory a policy-declared, multi-root web corpus;
- project source-addressable HTML, CSS, JavaScript/TypeScript, JSX, and page-classification facts;
- resolve bounded artifact families;
- query those collections relationally;
- record manual evidence inspections and design selections; and
- project a deterministic design document and candidate-AST text view.

The missing feature is a receipt-bearing projection and preview layer between query results and a browser inspection surface.

Build this in two immediately useful outputs:

1. An **enterprise page-family gallery** covering the 21-page pilot corpus, with source, dependency, completeness, and safe-preview dispositions.
2. A **button occurrence inventory** covering the currently observed button-like elements, but initially rendered as source and metadata rather than falsely claiming isolated visual fidelity.

A button occurrence is not yet a reusable button pattern. The index currently knows its tag, attributes, text, document, and source reference. It does not yet know its DOM ancestry, applicable CSS cascade, computed style, inherited variables, interaction handler, required application context, or browser-observed states. Those bindings are prerequisites for a normalized executable button gallery.

The recommended stopping point for the next build is therefore:

> Project a deterministic page gallery manifest and host, reproduce eligible pages under a restrictive static preview policy, and prove the result in an isolated browser. Do not implement constructive composition yet.

## Point-in-time implemented baseline

The local source-facts suite passed **33 of 33 tests** during this analysis. The web smoke proof also completed successfully and reported:

| Observation | Current value |
| --- | ---: |
| inventoried paths | 2,203 |
| admitted HTML entry candidates | 21 |
| admitted related candidates | 252 |
| unsupported paths with an explicit disposition | 1,920 |
| oversized paths with an explicit disposition | 10 |
| projected HTML documents | 21 |
| projected HTML elements | 913 |
| projected CSS stylesheets | 22 |
| projected CSS rules | 1,187 |
| projected CSS declarations | 4,491 |
| projected custom-property declarations | 290 |
| projected web relationships | 56 |
| resolved-local relationships | 40 |
| projected artifact families | 21 |
| truncated artifact families | 0 |
| button-like HTML occurrences | 144 |
| documents containing button-like occurrences | 10 |
| projected forms | 0 |
| resolved page-type classifications | 0 |

All 21 page-type classifications currently have `UNRESOLVED_INSUFFICIENT_EVIDENCE`. This is important for the gallery: the first catalog cannot depend on page-type labels that do not exist. It must remain browseable by root, path, title, source kind, dependency posture, and explicit saved queries while classification abstains.

The first-wave policy reaches no JSX files, so its current `jsxElements` count is zero even though the JSX projector itself is implemented and tested. Add `ai-engine/operator-console` only after the page gallery boundary is proved; that second wave introduces React runtime and component-isolation requirements.

## Capability reuse and gap matrix

| Gallery need | Current local evidence | Posture | Required work |
| --- | --- | --- | --- |
| governed multi-root scope | web workspace policy and inventory | reuse | bind gallery to `inventoryId` as well as `indexId` |
| HTML/CSS/source facts | web-surface projectors | reuse | add authored DOM ancestry and selector/style bindings |
| page dependency closure | web artifact families | reuse | create preview-specific dependency disposition |
| relational selection | SEJ relational query through `web query` | reuse | retain a canonical query-result envelope and row identities |
| same result, multiple semantic projectors | SEJ `applies-semantic-projection` | adapt | register web-owned projection authorities instead of the demo-only authority |
| terminal presentation | SEJ `presents-projected-query-result` | reference | add a web/gallery presentation surface; current contract is terminal-only |
| page and component comparison UI | operator-console Decision Lab and schema-driven surfaces | reference | decouple from app API/auth and consume gallery manifests |
| governed visual candidates | visual-intelligence catalogs and compiler | reuse later | only materialized, compatible patterns may enter constructive projection |
| deterministic layout candidates | layout-shaper | reuse later | bind a reviewed gallery/composition intent, not raw observations |
| governed browser application | dungeon browser context/runtime | reference | create gallery-specific authority; dungeon semantics are not gallery semantics |
| browser proof | existing Playwright estate and screenshot evidence | adapt | isolated contexts, network denial, ARIA evidence, environment-bound receipt |
| executable observed preview | none in source-facts | new | preview policy, planner, materializer, host, and capture adapter |
| normalized button states | none | new | DOM/cascade/computed-style/state observation |
| constructive component composition | none in source-facts | future | compatibility and interaction authority plus explicit human selection |

## Concrete local evidence anchors

- current web evidence plane: [`src/web/inventory.js`](../src/web/inventory.js), [`src/web/project-web-surfaces.js`](../src/web/project-web-surfaces.js), [`src/web/family-projector.js`](../src/web/family-projector.js), [`src/web/web-query.js`](../src/web/web-query.js), and [`web-surface-index.schema.v1.json`](../contracts/web-surface-index.schema.v1.json)
- later-slice facts and decisions: [`src/web/jsx-projector.js`](../src/web/jsx-projector.js), [`src/web/classification-overlay.js`](../src/web/classification-overlay.js), [`src/session/intent-session.js`](../src/session/intent-session.js), and [`src/session/design-document-projector.js`](../src/session/design-document-projector.js)
- the real evidence-backed landing-page circuit: [`scripts/run-landing-page-session.mjs`](../scripts/run-landing-page-session.mjs), [`know-how-center-landing-page.json`](../sessions/know-how-center-landing-page.json), and [`know-how-center-landing-page.md`](../design/know-how-center-landing-page.md)
- receipt-backed semantic result projection: [`applies-semantic-projection.md`](../../sej-runtime-query/capabilities/applies-semantic-projection/docs/applies-semantic-projection.md), [`apply-projection.input.schema.v1.json`](../../sej-runtime-query/capabilities/applies-semantic-projection/contracts/apply-projection.input.schema.v1.json), and [`projection-receipt.schema.v1.json`](../../sej-runtime-query/capabilities/applies-semantic-projection/contracts/projection-receipt.schema.v1.json)
- current presentation boundary: [`presents-projected-query-result.md`](../../sej-runtime-query/capabilities/presents-projected-query-result/docs/presents-projected-query-result.md) and [`semantic-presentation-model.schema.v1.json`](../../sej-runtime-query/capabilities/presents-projected-query-result/contracts/semantic-presentation-model.schema.v1.json)
- comparison-workspace precedents: [`DecisionLabCanvas.tsx`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/ai-engine/operator-console/src/features/decision-lab/DecisionLabCanvas.tsx), [`PatternLibrary.tsx`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/ai-engine/operator-console/src/features/patterns/PatternLibrary.tsx), and [`SchemaDrivenSurface.tsx`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/ai-engine/operator-console/src/shared/schema-ui/SchemaDrivenSurface.tsx)
- governed visual vocabulary: [`visual-intelligence/README.md`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/visual-intelligence/README.md), [`visual-pattern.catalog.v1.json`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/visual-intelligence/visualization-patterns/visual-pattern.catalog.v1.json), and [`visual-intelligence.ts`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/runtime/node/src/prompt-shell/visual-intelligence/visual-intelligence.ts)
- browser projection and proof precedents: [`browser-context.json`](../../contract-driven-artifact-governance-engine/procedural-dungeon-webpage/browser-context.json), [`application-adapter.mjs`](../../contract-driven-artifact-governance-engine/procedural-dungeon-webpage/src/application-adapter.mjs), [`procedural-dungeon-webpage.receipt.json`](../../contract-driven-artifact-governance-engine/.governance/receipts/procedural-dungeon-webpage.receipt.json), and [`09-warehouse-visibility-workspace-browser-proof.spec.ts`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/ai-engine/packages/warehouse-intelligence-tests-executor/tests/e2e/scenarios/09-warehouse-visibility-workspace-browser-proof.spec.ts)

The operator-console files are interaction and layout precedents, not reusable gallery truth. `DecisionLabCanvas` compares semantic seeds across manually provided templates; `PatternLibrary` renders metadata; `SchemaDrivenSurface` consumes its own generated view registry and application APIs. None currently projects source-fact query rows or isolates arbitrary repository implementations.

## External implementation research

Several established mechanisms validate the architecture without requiring this product to become a Storybook wrapper:

- Storybook treats stories as discrete component states and renders a selected story in an isolated preview iframe. Its testing guidance also makes mocks and controlled dependencies part of component isolation. That is the right mental model for later component/state previews, but the named repositories contain no Storybook manifests to harvest and the first corpus includes raw HTML as well as React. See the official [Storybook browsing model](https://storybook.js.org/docs/get-started/browse-stories) and [UI testing guidance](https://storybook.js.org/docs/writing-tests/).
- The WHATWG HTML standard defines `iframe.srcdoc` and the `sandbox` restriction set. With the sandbox present and no relaxation tokens, content is assigned an opaque origin and forms, scripts, and navigation capabilities are restricted. This is useful defense in depth, not permission to execute arbitrary enterprise JavaScript in the gallery host. See the [HTML iframe specification](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element).
- CSP controls which resources a document may fetch or execute. The CSP `sandbox` directive must be enforced as an HTTP header; the specification says it is ignored in a `meta` element. The preview server therefore owns CSP response headers rather than injecting a misleading sandbox meta tag. See [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/).
- Playwright browser contexts are isolated, non-persistent sessions; request routing can deny or mock network calls, and service workers should be blocked when routing must see all requests. Playwright also supports screenshot comparisons and ARIA snapshots. See the official [BrowserContext API](https://playwright.dev/docs/api/class-browsercontext), [network interception guidance](https://playwright.dev/docs/network), [visual comparisons](https://playwright.dev/docs/test-snapshots), and [ARIA snapshots](https://playwright.dev/docs/aria-snapshots).
- `parse5` is a standards-compliant HTML parser with optional source locations and a parented tree. It is already a dependency in the cognitive-codebase runtime and is a better boundary for gallery-grade DOM ancestry than extending the current regular-expression element extractor. Its documentation also makes an important distinction: parser-implied nodes have no source location. See the official [`sourceCodeLocationInfo` option](https://parse5.js.org/interfaces/parse5.ParserOptions.html).

## Keep four identities separate

The gallery must not collapse these concepts:

| Identity | Meaning | Example |
| --- | --- | --- |
| occurrence | one authored or observed instance | one `<button class="btn primary">` at a source reference |
| candidate pattern | a proposed grouping of similar occurrences | `primary-action-dark-compact` |
| promoted authority | reviewed semantic meaning and projection rules | `primary-action.v1` |
| projected preview | one environment-bound rendering | Chromium at 1280x800 under `static-no-script.v1` |

Frequency can justify reviewing a candidate. It cannot promote the candidate, infer its business role, or prove that its dependencies are compatible with another page.

The current 144 button-like facts are occurrences. They should remain occurrences until clustering, review, and compatibility evidence exist.

## Revised projection levels

The original three projection strengths are directionally correct, but implementation needs five explicit levels:

### Level 0: evidence catalog

Render titles, roots, relative paths, source references, classifications, dependency counts, diagnostics, and preview eligibility. No source HTML executes.

This level is fully supportable from the current web index.

### Level 1: restricted static reproduction

Materialize admitted HTML and local CSS/assets into an isolated preview bundle. Disable scripts, forms, top navigation, downloads, external network access, storage, and permissions. Record every rewrite or removal.

This is the first executable gallery level. A page requiring scripts receives `PARTIAL_STATIC_REPRODUCTION` or `NOT_EVALUATED_REQUIRES_SCRIPT`; it must never be labeled faithful merely because something rendered.

### Level 2: authorized scripted reproduction

Execute a complete artifact family only when a reviewed preview profile explicitly admits its scripts, mocks, ports, and effects. Use a fresh browser context, denied network by default, bounded time/resources, and a receipt.

The governed dungeon page is the first candidate for this lane because its application authority and current conformance receipt already exist. Its authority cannot authorize unrelated pages.

### Level 3: normalized occurrence comparison

Project components into a common viewport, theme/background, state controller, and metadata frame. This requires DOM ancestry, source-to-render locator binding, applicable CSS/computed styles, inherited custom properties, and declared state fixtures.

Button comparison belongs here, not at Level 1.

### Level 4: constructive composition

Combine selected semantic roles, layout authority, visual authority, interaction authority, and required ports into a new candidate contract. Only reviewed candidates or promoted authorities may participate. Compatibility must be evaluated before projection.

This is intentionally outside the first gallery build.

## The gallery pipeline

```text
web-surface-inventory.v1 + web-surface-index.v1
        |
        v
relational query + successful query receipt
        |
        v
gallery selection projection
        |
        +--> every query row retained or explicitly rejected
        v
preview planner
        |
        +--> source hash check
        +--> dependency dispositions
        +--> script/network/effect posture
        v
enterprise-gallery-manifest.v1
        |
        +--> deterministic gallery host projection
        +--> isolated preview bundles
        v
Playwright capture in fresh browser contexts
        |
        +--> DOM/ARIA assertions
        +--> console and request evidence
        +--> screenshot and environment facts
        v
browser-render receipts
        |
        v
human review and optional intent-session selections
```

The deterministic gallery projection receipt and the browser-render receipt are different evidence. The first proves that declared inputs produced declared bytes. The second reports what a specific browser environment observed. A screenshot hash must not be treated as a cross-platform deterministic build hash.

## Required contracts

### `saved-gallery-query-registry.v1`

The simple command names are versioned authorities, not hidden CLI magic:

```json
{
  "queryId": "enterprise-pages",
  "sourceCollection": "htmlDocuments",
  "commandText": "SELECT ...",
  "requiredColumns": [],
  "allowedProjectorIds": ["enterprise-page-gallery.v1"]
}
```

`buttons`, `sign-in-pages`, and `cli-commands` can be added only when their source collections and required bindings exist. A missing query authority fails closed.

### `gallery-projection-request.v1`

Bind the request to:

- `inventoryId` and `webSurfaceIndexId`;
- saved query ID or explicit query text plus canonical query hash;
- projector ID and projector-authority hash;
- preview-policy ID and policy hash;
- stable sort, optional limit, and empty-result posture;
- target directory and explicit write mode; and
- redaction profile.

The inventory ID is necessary because preview materialization rereads physical files. The web index currently retains the policy hash but not the complete member content needed to build a preview.

### `gallery-selection.v1`

Retain the canonical query envelope, ordered item IDs, row identity inputs, selected source-fact IDs, source references, and one disposition for every input row:

```text
selected
rejected-missing-identity
rejected-stale-source
rejected-unsupported-surface
rejected-by-preview-policy
```

Projected count plus rejected count must equal input row count.

### `gallery-projector-registry.v1`

Each projector declares:

- projector ID and version;
- accepted result contract;
- required columns and source collections;
- projection scope (`each-row` or `complete-result`);
- output contract and serialization;
- supported presentation surfaces;
- implementation status (`declared` or `materialized`);
- projector digest and tests; and
- whether it may request executable previews.

This follows the SEJ result-projection boundary and the visual-intelligence rule that declared patterns remain visible but cannot publish as if a renderer existed.

### `surface-preview-policy.v1`

Own the security and fidelity posture:

```text
scriptPolicy: deny | governed-allowlist
networkPolicy: deny | mock-only | origin-allowlist
formPolicy: deny
navigationPolicy: deny
downloadPolicy: deny
storagePolicy: ephemeral-deny-by-default
serviceWorkerPolicy: block
permissionPolicy: none
sandboxTokens: []
viewports: declared bounded list
maxBytes / maxFiles / timeoutMs
```

Do not let an individual source page relax this policy.

### `surface-preview-plan.v1`

For every selected item, record its entry path, family ID, current source hashes, admitted members, unresolved/external edges, applied transformations, required mocks, target preview route, and one reproduction disposition:

```text
STATIC_REPRODUCTION_READY
PARTIAL_STATIC_REPRODUCTION
AUTHORIZED_SCRIPTED_REPRODUCTION_READY
NOT_EVALUATED_REQUIRES_SCRIPT
BLOCKED_STALE_SOURCE
BLOCKED_MISSING_DEPENDENCY
BLOCKED_BY_POLICY
```

### `enterprise-gallery-manifest.v1`

This is the source consumed by the gallery host. Each item includes:

- gallery item ID and stable ordinal;
- occurrence/family/document identities;
- root ID and repository-relative path, never an absolute workstation path;
- title, kind, tags, and classification testimony;
- source and dependency evidence;
- preview disposition and route when available;
- diagnostics and limitations;
- allowed inspector tabs; and
- comparison/selectability posture.

The manifest is data. It contains no arbitrary HTML, JavaScript, shell command, or remote URL from the source corpus.

### Projection and browser receipts

`gallery-projection-receipt.v1` binds request, selection, projector, manifest, emitted files, deterministic hashes, row counts, redactions, and write disposition.

`browser-render-receipt.v1` binds the manifest item and preview plan to browser name/version, OS, viewport, font profile, CSP/sandbox policy, requests attempted/blocked, console errors, page errors, DOM assertions, ARIA snapshot digest, screenshot digest, timings, and one verdict:

```text
RENDERED_STATIC_VERIFIED
RENDERED_SCRIPTED_VERIFIED
RENDERED_WITH_LIMITATIONS
NOT_EVALUATED
BLOCKED
```

## Safe preview mechanics

The gallery host and the source preview must not share an execution boundary.

1. Reread each admitted member and verify it against the inventory content hash immediately before materialization.
2. Materialize into an output/temp area outside every source root.
3. Rewrite local links to hash-addressed preview routes and record the original target plus rewritten target.
4. Preserve local CSS and assets only when admitted and hash-matched.
5. Remove scripts in the default profile and record each removal; do not silently call the result faithful.
6. Disable form submission, top navigation, popups, downloads, storage, service workers, and browser permissions.
7. Serve previews from a dedicated loopback origin with restrictive CSP response headers.
8. Render each preview inside a sandboxed iframe and capture it in a fresh, non-persistent browser context.
9. Deny all outbound requests in the capture adapter; a request attempt becomes evidence and normally a finding.
10. Never expose absolute root paths, environment variables, credentials, cookies, or source file contents beyond admitted source slices.

For `srcdoc`, relative resource URLs require deliberate base/rewrite handling. A dedicated hash-addressed preview route is preferable for page families because it makes asset resolution, CSP headers, and capture evidence explicit.

## DOM and style binding required before a real button gallery

Add a standards-parser overlay rather than deleting the existing tested observations immediately.

Required DOM facts:

```text
domNodeId
documentId
parentDomNodeId
childOrdinal
nodeKind and tag
authored | parser-implied origin
authored source location or null
attribute source locations
stable source-to-render locator
```

Parser-implied nodes must never receive fabricated source references.

Required style facts:

```text
occurrenceId
matched rule IDs
selector match disposition
cascade order and specificity evidence
inherited custom-property bindings
computed style observation by browser profile
pseudo-class/state
viewport and media-query state
font and asset resolution evidence
```

Required interaction facts:

```text
semantic role candidate
event-binding evidence
handler/source relationship
required form or provider context
effect candidates
mock/port requirements
default, hover, focus-visible, active, disabled, busy observations
```

Only after those exist can a button card truthfully offer `Preview`, `States`, `Accessibility`, `Dependencies`, and `Similar styles` as executable inspections.

## Same selection, several projectors

SEJ already proves the core semantic operation: a query result can be sent through an accepted projection authority with row counts and a projection receipt. The source-facts `web query` adapter currently invokes only the relational capability, so it must be connected to the projection/presentation composition path.

The first accepted projectors should be:

```text
enterprise-page-gallery.v1       complete-result -> gallery manifest
enterprise-comparison-table.v1   complete-result -> comparison model
enterprise-source-map.v1         complete-result -> source/dependency model
enterprise-button-inventory.v1   complete-result -> source-only occurrence catalog
```

After the adapter exists, the SQL surface can honestly support:

```sql
SELECT d.documentId,
       d.pathId,
       d.rootId,
       d.relativePath,
       d.title,
       f.familyId,
       f.truncated
FROM htmlDocuments d
LEFT JOIN webFamilies f ON d.pathId = f.entryPathId
ORDER BY d.rootId, d.relativePath
APPLY RESULT PROJECTION enterprise-page-gallery
```

The same relational selection can be projected through `enterprise-comparison-table` or `enterprise-source-map` without changing canonical facts.

The button inventory query is also supportable now as evidence, not isolated reproduction:

```sql
SELECT d.rootId,
       d.relativePath,
       e.elementId,
       e.text,
       e.attributes,
       e.sourceReferenceId
FROM htmlElements e
JOIN htmlDocuments d ON e.documentId = d.documentId
WHERE e.tag = 'button'
ORDER BY d.rootId, d.relativePath
```

## First gallery experience

The initial host should be deliberately simple:

```text
Enterprise Surface Explorer

Filters                 Result cards                    Inspector
-------                 ------------                    ---------
root                    title                           preview posture
path                    repository-relative path        source references
preview status          classification testimony        dependencies
dependency status       diagnostic count                transformations
has buttons             static preview                  browser evidence
```

Each page card supports:

```text
Open restricted preview
Inspect source evidence
Inspect artifact family
Inspect unresolved/external dependencies
Inspect browser receipt
Add to comparison session
```

The UI may record selection into `intent-to-product-session.v1`, but merely clicking a card cannot promote a pattern or authorize composition.

## Candidate implementation map

```text
contracts/gallery-query.schema.v1.json
contracts/gallery-projection-request.schema.v1.json
contracts/gallery-selection.schema.v1.json
contracts/gallery-projector.schema.v1.json
contracts/surface-preview-policy.schema.v1.json
contracts/surface-preview-plan.schema.v1.json
contracts/enterprise-gallery-manifest.schema.v1.json
contracts/gallery-projection-receipt.schema.v1.json
contracts/browser-render-receipt.schema.v1.json

gallery-queries/enterprise-pages.query.v1.json
gallery-projectors/enterprise-page-gallery.projection.v1.json
gallery-policies/static-no-script.policy.v1.json

src/gallery/resolves-saved-gallery-query.js
src/gallery/projects-gallery-selection.js
src/gallery/plans-surface-previews.js
src/gallery/materializes-static-preview.js
src/gallery/projects-gallery-manifest.js
src/gallery/projects-gallery-host.js
src/gallery/serves-isolated-previews.js
src/gallery/captures-browser-render.js
src/gallery/validates-gallery-artifacts.js

test/gallery-selection.test.js
test/preview-planner.test.js
test/static-preview-materializer.test.js
test/gallery-host.test.js
test/gallery-browser-proof.test.js

Deferred to G4/G5:
gallery-queries/enterprise-buttons.query.v1.json
gallery-projectors/enterprise-comparison-table.projection.v1.json
gallery-projectors/enterprise-source-map.projection.v1.json
```

Add the commands under the existing `web` namespace:

```text
source-facts-se web gallery plan
source-facts-se web gallery project
source-facts-se web gallery serve
source-facts-se web gallery prove
```

`serve` is local and read-only. `project` writes only to an explicit output directory after validating that the target is outside the declared source roots.

## Incremental build slices

### Slice G0: contracts and gold preview corpus

Create the query/projector registries, preview policy, request/selection/manifest/receipt schemas, and a five-page reviewed preview corpus drawn from the 21-page pilot.

Include static inline CSS, external local CSS, a page requiring JavaScript, an unresolved dependency, a forbidden external request, malformed markup, an empty query, and a stale-source mutation fixture.

Exit: schemas reject missing hashes, unknown projectors, path leakage, unsafe policy relaxation, and dropped rows.

### Slice G1: deterministic selection and metadata gallery

Run a saved relational query, retain its successful query receipt, produce a schema-valid selection, and project a deterministic manifest plus non-executing HTML host.

Exit: all 21 page rows appear once or carry an explicit rejection; repeated projection is byte-identical; zero-result projection produces a valid empty state.

### Slice G2: restricted static page reproduction

Hash-check and materialize eligible HTML/CSS/assets, remove scripts under the default profile, rewrite local references, and emit one preview plan per item.

Exit: the five gold pages match their expected dependency/rewrite/removal dispositions; no source root is mutated; every changed byte has declared transformation evidence.

### Slice G3: isolated browser proof

Serve the gallery and previews on separate loopback origins, capture each gold preview in a fresh Playwright context, deny outbound network, and emit DOM, ARIA, console, request, screenshot, and environment evidence.

Exit: all safety assertions pass; deliberate network/script/form negative controls are blocked; browser receipts remain `NOT_EVALUATED` when capture is unavailable.

### Slice G4: SEJ projector integration and alternate views

Connect `web query` to accepted source-owned projection authorities and add comparison-table and source-map projectors over the same page selection.

Exit: projector identity changes the presentation model but not query rows; authority and result hashes differ as expected; unregistered projectors fail closed.

### Slice G5: normalized button occurrence comparison

Add DOM ancestry, selector/cascade bindings, computed-style observations, viewport profiles, and explicit state fixtures. Use a small hand-labeled subset before expanding all 144 occurrences.

Exit: source-to-render locators, applicable styles, accessible names/roles, and declared states match the gold set; unsupported occurrences abstain.

### Slice G6: authorized interaction and constructive composition

Add governed scripted profiles, effect mocks, compatibility evaluation, reviewed semantic-role promotion, and candidate composition contracts.

Exit: no observed occurrence becomes executable composition authority without explicit review and all required bindings.

## Accuracy and safety proof matrix

| Risk | Required proof |
| --- | --- |
| query row silently omitted | input/projected/rejected cardinality invariant and row identity ledger |
| gallery built from stale files | inventory hash check immediately before preview materialization |
| absolute workstation path leaked | schema prohibition plus serialized-output scan |
| source root changed by projection | before/after source-root digest and explicit output-boundary test |
| external request escaped preview | deny-all route log, blocked service workers, CSP evidence, negative-control URL |
| source script executed by default | sandbox/CSP assertion and script side-effect negative control |
| static degradation labeled faithful | reproduction-disposition contract and required limitation findings |
| unresolved dependency hidden | relationship-to-preview-plan completeness invariant |
| authored and parser-implied DOM mixed | origin field and null source reference for implied nodes |
| button style attributed without cascade proof | fail-closed missing-style-binding fixture |
| inaccessible state overlooked | ARIA snapshot plus targeted role/name/state assertions |
| screenshot drift mistaken for semantic drift | browser/OS/font/viewport identity in receipt and separate semantic assertions |
| gallery projector invents source claims | manifest-to-source-fact/source-reference trace for every displayed claim |
| unregistered projector runs | accepted-authority lookup negative control |
| occurrence presented as promoted pattern | schema-enforced testimony and promotion-state distinction |
| human selection becomes ambient authority | intent-session record plus separate governed promotion operation |

## What remains human

A person still determines:

- which pages are legitimate exemplars rather than generated evidence or experiments;
- whether a restricted static preview is useful despite removed behavior;
- whether a scripted profile is safe and which mocks/ports it may use;
- whether similar occurrences express the same semantic role;
- which candidate patterns are acceptable for a product intent;
- whether compatibility findings justify composition; and
- whether a reviewed candidate should become promoted authority.

The gallery makes these decisions evidence-rich and replayable. It does not erase them.

## Immediate implementation recommendation

Build Slices G0 through G3 for the existing 21-page pilot:

> A deterministic enterprise page-family gallery, restricted static preview bundles, and isolated browser receipts, with the current 144 button-like occurrences exposed only through a source/evidence inventory.

This produces the first real `Enterprise Surface Explorer` without overstating component fidelity. Once its source-to-preview and browser-proof boundaries are trusted, the next defensible expansion is the hand-labeled button comparison subset, followed much later by governed constructive composition.

## Implemented result: Slices G0-G3 (2026-08-01)

The immediate recommendation above is now implemented.

The materialized boundary consists of:

- nine strict contracts under [`contracts/`](../contracts/), including the projection request, row-retaining selection, preview plan, manifest, deterministic projection receipt, and environment-bound browser receipt;
- registered authorities in [`gallery-queries/enterprise-pages.query.v1.json`](../gallery-queries/enterprise-pages.query.v1.json), [`gallery-projectors/enterprise-page-gallery.projection.v1.json`](../gallery-projectors/enterprise-page-gallery.projection.v1.json), and [`gallery-policies/static-no-script.policy.v1.json`](../gallery-policies/static-no-script.policy.v1.json);
- deterministic selection, planning, materialization, manifest, host, and receipt orchestration in [`src/gallery/`](../src/gallery/);
- a loopback-only, read-only server exposing the generated script-free catalog at `/` and admitted bundles beneath `/preview/`, with traversal rejection and restrictive CSP/sandbox headers in [`serves-isolated-previews.js`](../src/gallery/serves-isolated-previews.js);
- a Playwright adapter using a fresh context per preview, blocked service workers, denied non-local routes, and screenshot/ARIA/DOM/request/console evidence in [`captures-browser-render.js`](../src/gallery/captures-browser-render.js); and
- `web gallery plan`, `project`, `serve`, and `prove` command routing in [`src/cli.js`](../src/cli.js).

The static planner distinguishes executable scripts from inert JSON/JSON-LD data blocks. Executable script-bearing families remain `NOT_EVALUATED_REQUIRES_SCRIPT`; structured-data blocks are removed with transformation evidence and do not falsely disqualify an otherwise static visual surface. Non-load-bearing navigation links likewise do not reduce visual dependency completeness, while missing styles/assets and forbidden external resources remain visible as limitations.

### Verification evidence

The completed build passed **48 of 48 tests**, including:

- stale entry and dependency mutations;
- refusal to write inside a configured source root;
- script and inline-event removal as defense in depth;
- local CSS copying and reference rewriting;
- deterministic projection and valid empty-host behavior;
- preview-server traversal and non-read-method rejection; and
- a real Chromium negative-control capture proving external image/form targets were blocked and recorded.

Both smoke proofs also remained green. Against the real 21-page pilot, the CLI chain retained all 21 query rows with zero rejections, admitted 14 restricted static previews, withheld 7 executable-script families, and captured 14 real Chromium screenshots plus 14 ARIA snapshots. Serialized-output scans found zero configured source-root or absolute Windows-path leaks.

The browser proof is intentionally separate from the deterministic projection receipt. Browser receipts include OS/browser/viewport facts and are not used as cross-platform deterministic build identities.

### Button evidence boundary

The 144 authored button occurrences remain queryable without inventing a component authority:

```bash
source-facts-se web query --index ./web-surface-index.json \
  "SELECT documentId, elementId, tag, attributes, text, sourceReferenceId FROM htmlElements WHERE tag = 'button' ORDER BY documentId, elementId"
```

That is a source/evidence inventory only. Slice G5 still owns DOM ancestry, selector/cascade binding, computed styles, state fixtures, clustering, review, and promotion before any normalized button gallery can claim visual or semantic reuse.

## Implemented result: first constructive sign-in composition slice (2026-08-01)

The north-star sign-in path is now implemented as a narrow Level 4 vertical slice without broadening the legacy-execution boundary.

The added materialized boundary consists of:

- the enterprise scope policy in [`web-know.enterprise.workspace.json`](../contracts/web-know.enterprise.workspace.json), covering intelligence roots 01 through 09, BPM clients, and lab repositories as eleven separately identified roots;
- the registered [`sign-in-pages`](../contracts/gallery-queries/sign-in-pages.query.v1.json) query, which maps the user-facing sign-in concept to the classifier's governed `login` taxonomy value;
- reviewed candidate declarations under [`composition-authorities/`](../composition-authorities/) for layout, authentication entry, messaging, and theme;
- strict schemas for composition authority, request, compatibility report, candidate contract, and projection receipt under [`contracts/`](../contracts/);
- fail-closed compatibility and deterministic contract/document/AST/preview projection in [`src/composition/`](../src/composition/); and
- `web compose sign-in` routing and the one-command `web north-star sign-in` operator path in [`src/cli.js`](../src/cli.js).

The compatibility evaluator requires one selected authority per kind, reviewed or promoted status, a source-addressable binding to the active gallery manifest, complete required/provided ports, no declared authority conflict, and complete safe renderer bindings. An incompatible request writes its request and report but cannot emit a contract or preview.

The composed HTML is a governed static simulation. It contains usable local input controls and an inert primary action, but no scripts, form submission, source endpoint, network access, storage, or authentication effect. Observed-and-reviewed bindings and declared content remain explicitly distinguishable in the candidate contract and projected design document.

### Enterprise-scale proof

The reviewed policy inventoried 300,547 paths and admitted 1,643 HTML entry candidates. Projection produced 1,643 HTML documents and classifications, 181,939 HTML element facts, 238,512 CSS rules, 655,997 CSS declarations, and 64,052 relationships. That volume exposed and fixed two scale boundaries: monolithic JSON serialization and irrelevant-collection hashing. Large top-level indexes now stream deterministically to disk, read incrementally, and web SQL requests include only named collections.

The registered sign-in query returned 13 classifier-supported login surfaces at support score `0.9`. Gallery projection retained all 13 rows with zero rejection: five static-ready and eight script-required. Playwright rendered all five admitted previews with zero blocked receipts. The example four-authority request produced a compatibility report with eight satisfied checks and zero failures, a candidate contract, projected design document, candidate AST, deterministic receipt, and a script-free browser-observed preview.

The operator no longer has to invoke and correlate every stage manually. `web north-star sign-in` accepts the frozen index and inventory, an optional reviewed request, and optional per-kind authority IDs or source-relative gallery paths. One invocation writes an authority-choice catalog, executable gallery, browser proof, compatibility report, candidate composition, projected document, candidate AST, governed preview, and a `sign-in-north-star-report.v1` ledger covering every stage. Incompatible overwrites remove prior candidate artifacts before returning, so an older runnable preview cannot survive a failed compatibility gate.

This is not general constructive composition. The implemented subject is deliberately limited to the four-authority sign-in contract and the static renderer. Authorized source-script execution, effect mocks, arbitrary role catalogs, general composition planning, and promotion workflow remain future G6 work.
