Here is the sensible starting point:

You are describing a **manual intent-to-product pipeline** that begins by harvesting existing web know-how from disk, then uses that know-how to shape one governed landing page. The point is not merely to produce a website. The point is to observe the entire construction process closely enough that we can later encode it into the inference engine.

# The first practical mission

> **Scan the existing repositories for webpage knowledge, normalize that knowledge into queryable facts, inspect what we already know, and use it to design the first governed landing page.**

That gives us one bounded surface:

```text
HTML
CSS
related JavaScript
design assets
browser interactions
page structure
layout behavior
authentication entry surfaces
```

We do not begin by scanning every possible programming-language concern across the enterprise.

We begin with:

```text
Web Surface Know-How
```

# The initial repository scope

From what you described, the first scan roots are approximately:

```text
C:\
├── source\
│   └── repos\
│       └── bpm\
│           └── intelligence\
│               ├── 01-...
│               ├── 02-...
│               ├── 03-...
│               ├── ...
│               └── 09-...
│
├── source\
│   └── repos\
│       └── bpm\
│           └── clients\
└── lab\
    └── repos\
```

The first inventory should discover files without yet pretending all discovered files belong to a website.

```text
Admitted primary surfaces
├── .html
├── .htm
├── .css
└── possibly embedded HTML/CSS authorities

Related surfaces
├── .js
├── .mjs
├── .cjs
├── .ts
├── .tsx
├── .jsx
└── JSON configuration referenced by webpage code
```

The research already supports beginning with a canonical JSON fact index, extending the existing scanner for JavaScript-family files, and using the SEJ query engine over those collections before introducing a larger persistent database. 

# Do not scan all JavaScript indiscriminately

The important phrase is:

> **related JavaScript files**

A repository may contain thousands of JavaScript or TypeScript files unrelated to any webpage surface. We need deterministic relationship expansion.

Start from HTML and CSS entry points, then follow declared and observed links.

```text
HTML entry point
├── <script src="...">
├── inline <script>
├── <link rel="stylesheet" href="...">
├── inline <style>
├── module imports
├── asset references
└── framework entry roots
```

Then expand:

```text
HTML
  └── script module
       ├── imports another module
       ├── imports component
       ├── imports stylesheet
       ├── imports JSON configuration
       └── registers browser behavior
```

This creates a bounded **web artifact family**.

# The first pipeline

```text
Scan roots
    ↓
Inventory HTML and CSS
    ↓
Parse each webpage entry surface
    ↓
Follow related JavaScript and TypeScript imports
    ↓
Extract structural facts
    ↓
Create web artifact families
    ↓
Classify reusable webpage know-how
    ↓
Store queryable facts
    ↓
Inspect patterns manually
    ↓
Select know-how for the new landing page
    ↓
Build the governed design contract
    ↓
Project design documentation
    ↓
Review and refine
    ↓
Project the executable webpage body
```

That is the first full manual circuit.

# Phase 1 — Inventory the web estate

The first micro-capability should be:

```text
inventories-web-surfaces
```

Its job:

> Given one or more repository roots, find all potential webpage entry surfaces and classify every discovered file disposition.

Example command:

```bash
web-know inventory \
  --root C:\source\repos\bpm\intelligence \
  --root C:\lab\repos
```

Output:

```text
Web Surface Inventory

Roots scanned
├── C:\source\repos\bpm\intelligence
└── C:\lab\repos

Discovered
├── HTML files: 84
├── CSS files: 137
├── JavaScript-family files: 1,423
└── candidate webpage repositories: 31

Excluded
├── node_modules
├── dist
├── build
├── coverage
├── release
├── generated caches
└── temporary folders

Unsupported
└── explicitly listed by extension
```

The inventory must record what was excluded, unsupported, unreadable, or changed during observation. The source-facts research explicitly warns against reporting only the files that happened to parse and calling the index complete. 

# Phase 2 — Discover webpage artifact families

The next micro-capability:

```text
discovers-web-artifact-families
```

A webpage family might look like:

```text
Healthcare Portal Login
├── login.html
├── css/
│   ├── tokens.css
│   ├── layout.css
│   └── login.css
├── js/
│   ├── login.js
│   ├── validation.js
│   └── authentication-client.js
└── assets/
    └── logo.svg
```

Or:

```text
Prompt Shell
├── index.html
├── app.css
├── app.mjs
├── providers.mjs
├── prompt-history.mjs
└── response-view.mjs
```

Each family should retain:

```json
{
  "webFamilyId": "healthcare-portal-login",
  "entrySurfaces": ["login.html"],
  "stylesheets": [],
  "scriptModules": [],
  "assets": [],
  "relationships": [],
  "repositoryId": "healthcare-portal",
  "classificationStatus": "observed"
}
```

# Phase 3 — Extract facts by surface

## HTML facts

```text
document landmarks
headings
sections
forms
inputs
buttons
links
navigation
dialogs
IDs
classes
ARIA relationships
data attributes
script references
stylesheet references
```

Example:

```text
LoginPage
├── BrandRegion
├── AuthenticationForm
│   ├── EmailInput
│   ├── PasswordInput
│   ├── RememberMe
│   └── SubmitControl
├── RecoveryLink
├── SingleSignOnControl
└── RegistrationLink
```

## CSS facts

```text
custom properties
theme tokens
layout modes
grid and flex structures
responsive breakpoints
component selectors
state selectors
form styling
spacing scale
typography scale
color usage
animation declarations
```

Example:

```text
Authentication Layout
├── centered-card
├── full-height-shell
├── narrow-form-column
├── responsive-padding
└── mobile-collapse
```

## JavaScript and TypeScript facts

```text
imports
exports
functions
event registrations
DOM queries
form submissions
validation calls
network calls
authentication calls
state transitions
redirects
error handling
storage access
token handling
```

Example:

```text
submitLogin
├── reads email input
├── reads password input
├── validates request
├── calls authentication client
├── stores session result
├── redirects on success
└── presents error on failure
```

The domain-region inspection research already defines the useful distinction between declared, derived, observed, and inferred evidence. HTML, CSS, and JavaScript extraction begins as observed evidence; labels such as “clean login flow” or “authentication shell” remain inferred until reviewed and promoted. 

# Phase 4 — Build the Web Know-How Store

The store should not initially be a giant abstract ontology.

Start with concrete collections:

```json
{
  "repositories": [],
  "files": [],
  "webFamilies": [],
  "htmlElements": [],
  "cssRules": [],
  "symbols": [],
  "relationships": [],
  "interactions": [],
  "assets": [],
  "candidatePatterns": [],
  "sourceReferences": []
}
```

Then build normalized views.

```text
Web Know-How
├── Page Types
├── Layout Patterns
├── Navigation Patterns
├── Authentication Surfaces
├── Content Patterns
├── Form Patterns
├── Responsive Patterns
├── Theme Patterns
├── Interaction Patterns
└── Application Shells
```

# The first queries

After indexing, the human exploration begins.

## What webpage families exist?

```sql
SELECT familyId, repositoryId, entrySurface
FROM webFamilies
ORDER BY repositoryId, familyId
```

## Find landing pages

```sql
SELECT *
FROM candidatePatterns
WHERE patternKind = 'landing-page'
```

## Find authentication entry surfaces

```sql
SELECT *
FROM webFamilies
WHERE observedRoles CONTAINS 'authentication-entry'
```

## Find pages containing SSO controls

```sql
SELECT familyId, elementId, sourceReference
FROM htmlElements
WHERE semanticRole = 'single-sign-on-control'
```

## Find forms with magic-link behavior

```sql
SELECT familyId, functionId, endpoint
FROM interactions
WHERE interactionKind = 'magic-link-request'
```

## Find common page layouts

```sql
SELECT layoutKind, COUNT(*) AS usageCount
FROM candidatePatterns
WHERE patternFamily = 'layout'
GROUP BY layoutKind
ORDER BY usageCount DESC
```

## Find the CSS tokens used across dark interfaces

```sql
SELECT propertyName, normalizedValue, COUNT(*) AS usageCount
FROM cssFacts
WHERE surfaceClassification = 'dark-interface'
GROUP BY propertyName, normalizedValue
ORDER BY usageCount DESC
```

# The first manual design journey

Once the scan exists, the landing-page design process should be intentionally sequential.

## Step 1 — State the broad intent

```text
Build the public landing page for the
Deterministic Know-How Intelligence Center.
```

That creates only the initial root:

```text
KnowHowIntelligenceCenterWebsite
└── PublicLandingPage
```

## Step 2 — Query existing landing-page know-how

```bash
web-know find "landing page"
```

The system might return:

```text
Observed landing-page candidates

1. Product education landing page
2. Developer-tool landing page
3. Public course landing page
4. Enterprise platform landing page
5. Technical documentation homepage
```

Then we inspect them.

```bash
web-know inspect developer-tool-landing-page
web-know inspect technical-documentation-homepage
```

## Step 3 — Select the structural posture

Perhaps the decision becomes:

```text
Primary posture
└── Technical documentation homepage

Borrowed behavior
└── Developer-tool product introduction

Visual posture
└── Dark Markdown-oriented technical publication
```

The AST grows:

```text
PublicLandingPage
├── DocumentationHomePattern
└── DeveloperProductIntroductionPattern
```

## Step 4 — Query hero patterns

```bash
web-know find "technical hero section"
```

Inspect:

```text
Centered educational hero
Split hero with product preview
Hero with code sample
Hero with interactive architecture diagram
```

Choose one.

## Step 5 — Query navigation patterns

```bash
web-know find "documentation navigation"
```

## Step 6 — Query sign-in entry patterns

```bash
web-know find "clean sign-in entry"
```

Now compare:

```text
Header sign-in link
Header sign-in button
Account menu
Dedicated authentication panel
Magic-link-first entry
SSO-first enterprise entry
```

Only after reviewing existing implementations do we decide what belongs in the new site.

# Design documentation becomes the first projection

This is critical.

The first artifact projected from the evolving contract should not be the final webpage.

It should be a **design inspection document**.

```text
Intent
    ↓
Governed contract
    ↓
Design-document projection
    ↓
Human review
    ↓
Contract refinement
    ↓
Updated design-document projection
```

The design document should show:

```text
1. Human intent
2. Intended audience
3. Website purpose
4. Landing-page feature
5. Scenario inventory
6. Page regions
7. Reused know-how
8. New know-how candidates
9. Layout structure
10. Navigation structure
11. Authentication entry strategy
12. Content hierarchy
13. Responsive behavior
14. Interaction behavior
15. Candidate AST
16. Projected executable-body preview
```

# The contract grows progressively

The developer should not author the entire contract upfront.

## First pass

```text
subject
purpose
audience
public landing page
```

## Second pass

```text
page regions
navigation
hero
content sections
sign-in entry
footer
```

## Third pass

```text
layout choices
responsive behavior
theme system
interaction states
```

## Fourth pass

```text
feature
scenario
responsibility
obligation
signal
```

## Fifth pass

```text
semantic authority
projection authority
AST authority
executable body
```

The documentation projection gives feedback after every pass.

# First landing-page candidate AST

A likely early shape might become:

```text
KnowHowIntelligenceCenterLandingPage
├── GlobalHeader
│   ├── BrandIdentity
│   ├── PrimaryNavigation
│   ├── SearchEntry
│   └── SignInEntry
│
├── Hero
│   ├── HumanPromise
│   ├── SupportingExplanation
│   ├── PrimaryAction
│   ├── SecondaryAction
│   └── ArchitecturePreview
│
├── KnowHowFamilies
│   ├── Web
│   ├── APIs
│   ├── SDKs
│   ├── AI
│   ├── Security
│   └── EnterpriseDomains
│
├── HowItWorks
│   ├── Intent
│   ├── Authority
│   ├── Projection
│   └── ExecutableBody
│
├── FeaturedArticles
├── ModelAnalysis
├── ScenarioLaboratoryPreview
├── CommunityOrEducationCallout
└── GlobalFooter
```

That is only a candidate. The scan should help us determine whether these regions reuse known patterns or require new authority.

# Sign-in should be treated as a separate capability

Do not bury sign-in inside the landing-page body.

```text
Landing Page
    └── presents authentication entry

Authentication Entry
    └── navigates to governed authentication capability
```

Then inspect existing know-how:

```text
Email and password
Magic link
Enterprise SSO
Social identity
Passkey
Hybrid entry
```

For an early educational platform, we may discover that the appropriate first design is:

```text
Primary:
magic link

Enterprise option:
SSO

Future:
passkey
```

But that decision should emerge from the repository findings, current operating needs, and security constraints—not from visual preference alone.

# The manual inference-engine experiment

You described this perfectly. We are manually performing the operations the future inference engine must learn to orchestrate.

```text
Human intent
    ↓
Find known capability families
    ↓
Inspect examples
    ↓
Compare patterns
    ↓
Select or reject reuse
    ↓
Bind selected patterns
    ↓
Grow candidate AST
    ↓
Project design documentation
    ↓
Inspect consequences
    ↓
Refine intent
    ↓
Grow contract
    ↓
Project executable body
```

Every manual step becomes a future deterministic or inferential tool boundary.

# The first official sprint

## Sprint objective

> Inventory and index webpage surfaces across the two local repository roots, then use the resulting facts to produce the first governed landing-page design document.

## Deliverables

### 1. Scope policy

```text
web-know.workspace.json
```

Contains:

```text
roots
include patterns
exclude patterns
symlink policy
file-size ceiling
supported extensions
generated-file policy
```

### 2. Web inventory

```text
web-surface.inventory.json
```

### 3. Web fact index

```text
web-know.index.json
```

### 4. Query CLI

```bash
web-know find
web-know inspect
web-know compare
web-know usages
web-know relationships
```

### 5. Landing-page design session

```text
sessions/know-how-center-landing-page.json
```

### 6. Initial governed contract

```text
contracts/know-how-center-landing-page.contract.json
```

### 7. Projected design document

```text
design/know-how-center-landing-page.md
```

### 8. Candidate AST view

```text
design/know-how-center-landing-page.ast.txt
```

### 9. Executable-body preview

```text
design/know-how-center-landing-page.preview.html
```

Not necessarily the final production webpage—just enough to inspect the physical consequence of the evolving contract.

# The reusable pipeline after the website

Once we have proven this once, the exact same operating model can be applied to:

```text
Résumé
├── scan prior résumé artifacts
├── inspect patterns
├── shape intent
├── build contract
├── project design document
└── project final résumé surfaces

Marketing campaign
├── scan prior marketing material
├── inspect messaging patterns
├── shape audience and outcome
├── build contract
├── project campaign plan
└── project content assets

Go-to-market strategy
├── scan prior strategies and product material
├── extract market and positioning know-how
├── shape strategic intent
├── build authority
├── project review document
└── project operational plan
```

The domain changes.

The conveyor remains stable.

# The full first circuit

```text
LOCAL REPOSITORIES
        │
        ▼
WEB-SURFACE INVENTORY
        │
        ▼
HTML / CSS / JS FACT EXTRACTION
        │
        ▼
WEB KNOW-HOW STORE
        │
        ▼
MANUAL QUERY AND INSPECTION
        │
        ▼
REUSE / CONFIGURE / COMPOSE / CREATE
        │
        ▼
LANDING-PAGE CANDIDATE AST
        │
        ▼
GOVERNED ARTIFACT CONTRACT
        │
        ▼
DESIGN-DOCUMENT PROJECTION
        │
        ▼
HUMAN REVIEW AND CURATION
        │
        ▼
EXECUTABLE WEBPAGE BODY
        │
        ▼
OBSERVED FEEDBACK
        │
        ▼
IMPROVED INFERENCE TOOLING
```

That makes the know-how operational immediately.

We are not waiting for the fully autonomous inference engine before receiving value. The manual process produces:

* a repository inventory;
* queryable facts;
* reusable web patterns;
* a real landing-page design;
* governed documentation;
* an executable body;
* and the exact interaction data needed to design the eventual automated inference engine.

That is absolutely the right first build.

# Implementation-readiness analysis (2026-08-01)

## Conclusion

This pipeline is buildable from the local codebase, but it should not become one monolithic scanner that owns inventory, parsing, classification, design selection, contract authoring, and webpage generation.

Five independently useful capability families already exist:

1. `source-facts-semantic-search-engine` provides deterministic JavaScript/TypeScript and JSON facts, exact source references, schema validation, and relational querying.
2. `webpage-classification-scanner` provides evidence-separated HTML snapshot observation, deterministic heuristics and taxonomy classification, abstention, and proof receipts.
3. `layout-shaper` converts explicit intent into three deterministic semantic layout candidates, requires explicit selection, and projects ASCII or CSS Grid.
4. `cognitive-codebase/visual-intelligence` contains governed composition, component, visualization, design-system, motion, and primitive catalogs.
5. `contract-driven-artifact-governance-engine` proves that browser structure, CSS, events, workflows, and semantic selections can be contract-owned while HTML remains a small bootstrap.

The missing product is the evidence-preserving conveyor between them:

```text
multi-root inventory
    -> admitted web entry surfaces
    -> bounded relationship expansion
    -> HTML/CSS/JS/JSON observations
    -> web artifact families
    -> evidence-backed candidate patterns
    -> explicit human selections
    -> layout and visual authorities
    -> governed landing-page contract
    -> design-document projection
    -> executable preview
    -> browser and conformance evidence
```

The first implementation should add a web-specific overlay and pipeline receipt around the existing source-fact index. It should not replace that index, and it should never promote recurring observations into authority automatically.

## Evidence gathered from the current estate

### Preliminary broad inventory

A read-only extension count was taken across the three named roots with common dependency, VCS, build, coverage, and release directories excluded. These are discovery counts, not completeness claims:

| Root | HTML | CSS | JS | JSX | MJS | CJS | TS | TSX | JSON |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `ai-engine` | 97 | 352 | 750 | 6 | 141 | 44 | 2,612 | 1,980 | 11,221 |
| `cognitive-codebase` | 462 | 86 | 153 | 0 | 18 | 2 | 1,241 | 0 | 11,148 |
| `C:\lab\repos` | 4 | 0 | 8 | 0 | 132 | 0 | 859 | 0 | 2,331 |

The roots contain generated publications, DOM evidence snapshots, IDE captures, virtual-environment files, runtime output, and manually authored prototypes. Extension alone cannot decide which material is reusable know-how. Inventory disposition is therefore part of the product, not a preprocessing convenience.

### Recommended pilot corpus

Start with explicit subroots rather than the full trees:

| Pilot subroot | HTML | CSS | JS/TS family | JSON | Evidence value |
| --- | ---: | ---: | ---: | ---: | --- |
| `ai-engine/docs` | 9 | 0 | 7 | 127 | reviewable prototypes and design discussions |
| `ai-engine/experimentation` | 8 | 0 | 15 | 47 | experimental pages and inspectors |
| `ai-engine/site` | 1 | 5 | 2 | 30 | compact site with separate styles |
| `contract-driven-artifact-governance-engine/procedural-dungeon-webpage` | 1 | 0 | 7 | 11 | governed bootstrap/context/adapter reference |
| `webpage-classification-scanner/proof/fixtures` | 2 | 0 | 0 | 1 | labeled positive and insufficient-evidence fixtures |

The first wave therefore contains 21 HTML files, 5 CSS files, 31 JavaScript/TypeScript-family files, and 216 JSON files before relationship filtering. It is small enough for a hand-reviewed gold corpus and varied enough to prove source linkage, authorship disposition, family discovery, and taxonomy behavior.

Add `ai-engine/operator-console` in the second wave. It adds one HTML bootstrap, 23 CSS files, and 185 JavaScript/TypeScript-family files, including 78 TSX files. The source scanner parses TSX but does not yet project JSX elements, props, or component trees as canonical web facts.

## Capability reuse matrix

| Pipeline need | Existing evidence | Posture | Missing work |
| --- | --- | --- | --- |
| JS/TS/JSON facts | source-facts engine and source taxonomy scanner | reuse | multi-root orchestration and web overlay |
| Relational queries | SEJ runtime query | reuse | register web collections |
| Static HTML observations | webpage classifier DOM adapter | adapt | disk adapter, exact offsets, dependency edges, complete parser boundary |
| Page taxonomy and heuristics | webpage classifier packs | reuse | bind findings to repository evidence |
| Rendered capture | webpage classifier browser port | contract only | no concrete browser engine is currently seated |
| CSS facts | no complete CSS scanner found | new | syntax, tokens, queries, imports, URLs, diagnostics, source ranges |
| Artifact-family discovery | no executable implementation found | new | bounded graph expansion and receipt |
| Layout candidates | layout-shaper | reuse | web evidence to `layout-intent.v1` adapter |
| Visual vocabulary | visual-intelligence catalogs | adapt | catalog loader, compatibility and implementation-status checks |
| Governed web projection | dungeon page contract/context/runtime | reference reuse | landing-specific context and contract |
| Domain-region inference | domain-region-projector discussion | future | repository currently contains discussion only |
| Promoted source integrity | source-integrity-registry | optional reuse | apply when candidates become declared authority |

Verified during this analysis:

- `webpage-classification-scanner`: 15 of 15 proof scenarios passed.
- `layout-shaper`: test suite passed.
- governed procedural dungeon webpage: the current receipt reports `TRUSTED`.
- source-facts engine: its companion proof ledger records schema-valid deterministic projection and query evidence.

Concrete evidence anchors:

- source-fact projection and query: [`src/project.js`](../src/project.js), [`src/query.js`](../src/query.js), [`source-fact-index.schema.v1.json`](../contracts/source-fact-index.schema.v1.json), and [`source-facts-semantic-search-engine-proof-evidence-2026-08-01.md`](./source-facts-semantic-search-engine-proof-evidence-2026-08-01.md)
- HTML observation and classification: [`src/adapters/dom.ts`](../../webpage-classification-scanner/src/adapters/dom.ts), [`src/runtime/index-builder.ts`](../../webpage-classification-scanner/src/runtime/index-builder.ts), [`observed-webpage-facts.schema.v1.json`](../../webpage-classification-scanner/contracts/observed-webpage-facts.schema.v1.json), and [`test/run-proof.mjs`](../../webpage-classification-scanner/test/run-proof.mjs)
- deterministic layout selection: [`layout-intent.schema.v1.json`](../../layout-shaper/contracts/layout-intent.schema.v1.json), [`layout-candidate.schema.v1.json`](../../layout-shaper/contracts/layout-candidate.schema.v1.json), and [`layout-selection.schema.v1.json`](../../layout-shaper/contracts/layout-selection.schema.v1.json)
- governed visual vocabulary: [`visual-intelligence/README.md`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/visual-intelligence/README.md), [`composition.catalog.v1.json`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/visual-intelligence/composition-families/composition.catalog.v1.json), and [`design-system.catalog.v1.json`](../../../../source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/visual-intelligence/design-systems/design-system.catalog.v1.json)
- governed browser projection: [`browser-context.json`](../../contract-driven-artifact-governance-engine/procedural-dungeon-webpage/browser-context.json), [`index.html`](../../contract-driven-artifact-governance-engine/procedural-dungeon-webpage/index.html), and [`src/application-adapter.mjs`](../../contract-driven-artifact-governance-engine/procedural-dungeon-webpage/src/application-adapter.mjs)

These anchors demonstrate reusable behavior; they do not imply that the missing inventory, CSS, family-resolution, or session contracts already exist.

## Existing HTML scanner: correct reuse and limitations

The webpage classifier is valuable, but it cannot by itself serve as the repository harvester:

- It accepts an authorized URL or supplied HTML snapshot, not a multi-root inventory.
- Its DOM adapter is deliberately a dependency-free regular-expression tokenizer, not a complete HTML parser.
- Its locators use captured token ordinals and snapshot hashes, not repository-relative byte ranges.
- It extracts headings, links, buttons, forms, media, content, metadata, and technology markers, but not the complete local graph needed here: script sources, stylesheet links, CSS imports, CSS URLs, module closure, and asset resolution.
- Rendered capture fails closed because no browser engine is seated.

Reuse its evidence model, taxonomy packs, heuristic engine, abstention rules, indexes, and proof receipt. Add a repository HTML parser adapter underneath that boundary.

## Product boundary and indexes

Keep `source-fact-index.v1` responsible for physical code/JSON evidence:

```text
files, symbols, relationships, JSON facts, governance rules,
body-mechanic observations, source references, and coverage
```

Add `web-surface-index.v1`, bound to one or more source index IDs:

```json
{
  "indexType": "web-surface-index.v1",
  "sourceIndexIds": [],
  "inventoryEntries": [],
  "htmlDocuments": [],
  "htmlElements": [],
  "cssStylesheets": [],
  "cssRules": [],
  "cssDeclarations": [],
  "designTokens": [],
  "webRelationships": [],
  "assets": [],
  "interactions": [],
  "webFamilies": [],
  "classifications": [],
  "candidatePatterns": [],
  "sourceReferences": [],
  "coverage": {}
}
```

`symbol`, `CSS declaration`, `DOM element`, `page classification`, and `candidate pattern` have different identity and evidence semantics. They should be queryable together without being flattened into one fact type.

## Required contracts

### `web-know.workspace.v1`

Declare root IDs and paths, includes/excludes, admitted file kinds, symlink policy, size and count limits, generated/evidence/runtime dispositions, unreadable-file policy, hashing, and stable-snapshot policy. Equal relative paths under different roots must remain distinct.

### `web-surface-inventory.v1`

Every encountered path receives exactly one disposition:

```text
admitted-entry-candidate
admitted-related-candidate
excluded-by-policy
unsupported-extension
unreadable
oversized
external-link
generated-observation
evidence-snapshot
changed-during-observation
```

Completeness means every encountered path received a disposition; it does not mean every path parsed successfully.

### `web-artifact-family.v1`

A family is a graph projection, not a folder heuristic. Retain entry surfaces, member files, resolved relationships, unresolved/external dependencies, expansion policy and depth, family root hash, classification status, and evidence references.

### `intent-to-product-session.v1`

Record intent revisions, queries, inspected evidence, considered patterns, selection/rejection decisions, human rationale, selected layout and visual authorities, contract revisions, projection receipts, review findings, and terminal disposition. Otherwise the future inference engine sees only the final page and loses the decisions it is meant to learn.

## Deterministic artifact-family expansion

Admitted edge kinds should include:

```text
html-script-src
html-module-script-src
html-stylesheet-href
html-image-src
html-source-srcset
html-anchor-navigation
html-inline-script
html-inline-style
css-import
css-url
js-static-import
js-dynamic-import-candidate
js-json-import
js-style-import
jsx-component-reference
```

Every edge resolves to one disposition:

```text
resolved-local
resolved-workspace-package
external-url
data-url
fragment-only
missing-local-target
ambiguous-package-target
blocked-by-policy
unsupported-resolution-form
```

Expansion rules:

1. Begin only from explicitly admitted entry candidates.
2. Resolve HTML/CSS references relative to the containing file and declared base rules.
3. Resolve JS/TS imports through a declared resolver profile; never guess package aliases silently.
4. Traverse only resolved local or authorized workspace-package edges.
5. Detect cycles by logical file identity.
6. Enforce maximum depth, members, bytes, and time.
7. Preserve unresolved and external edges instead of dropping them.
8. Hash policy, entry IDs, resolved edges, and member versions into the receipt.

## Surface observation requirements

### HTML

Retain doctype and metadata; element identity and order; tags, attributes and text hashes; landmarks and heading hierarchy; forms and controls; ARIA/IDREF relationships; inline script/style ranges; dependency references; parse diagnostics; and exact source references.

Element logical identity must be separate from occurrence identity. A byte offset identifies evidence in one file version, not the durable meaning of an element.

### CSS

Create a new projector for stylesheets, selector structure, declarations, custom properties and references, at-rules, layers, media/supports/container queries, keyframes, imports, URLs, diagnostics, and exact source references.

`background-color: #07111f`, `display: grid`, and a media query are observations. `dark interface`, `centered card`, and `responsive shell` are candidate interpretations.

### JavaScript, TypeScript, JSX, and TSX

Reuse the source scanner for declarations, import candidates, relationships, control flow, and mechanics. Add web packs incrementally for DOM queries, element bindings, events, form submissions, network/authentication calls, storage/token access, navigation effects, JSX structure, and style/asset imports.

Labels such as `authentication flow` remain inferred until reviewed authority supports them.

## Evidence and promotion states

| State | Meaning | May drive executable projection? |
| --- | --- | --- |
| `observed` | parser or filesystem directly witnessed it | no, not alone |
| `derived` | deterministic rule joined observations | only if a contract admits the rule |
| `inferred` | heuristic or model proposed meaning | no |
| `reviewed-candidate` | human accepted it for consideration | no |
| `selected-for-session` | human selected it for one design session | only in that candidate contract |
| `promoted-authority` | governed contract/catalog owns the meaning | yes |
| `projected` | artifact was deterministically produced | yes, with receipt |
| `verified` | observation satisfied declared checks | subject to claim policy |

Repeated occurrence proves recurrence, not correctness or authority.

## Concrete implementation map

Add orchestration commands without changing the meaning of the existing `project` command:

```text
source-facts-se web inventory --policy web-know.workspace.json
source-facts-se web project --inventory web-surface.inventory.json
```

Candidate files:

```text
contracts/web-know-workspace.schema.v1.json
contracts/web-surface-inventory.schema.v1.json
contracts/web-surface-index.schema.v1.json
contracts/web-artifact-family.schema.v1.json
contracts/intent-to-product-session.schema.v1.json
src/web/inventory.js
src/web/html-projector.js
src/web/css-projector.js
src/web/relationship-resolver.js
src/web/family-projector.js
src/web/project-web-surfaces.js
```

Persist webpage classification outputs separately from raw observations: profiles, heuristic findings, taxonomy classifications, cognitive inferences, and proof receipts. The cognitive lane remains optional; the offline MVP needs no model access.

For layout, create `layout-intent.v1`, invoke `layout-shaper`, retain all three candidates, and record one explicit candidate ID plus source-intent hash. Visual catalog entries are candidates only when their compatibility and implementation status admit the target.

Use the dungeon webpage as the projection-boundary reference: a small HTML bootstrap, contract-owned browser context, mechanical runtime, semantic authorities, and a conformance receipt. The landing page needs its own context and contract; dungeon-specific workflows, canvas mechanics, and ontologies are not reusable landing-page authority.

## Revised build slices

### Slice 0: gold corpus and scope policy

Create the five-subroot policy, a reviewed manifest for 21 HTML entries, generated/evidence/manual dispositions, expected relationships for at least five families, and fixtures for malformed HTML, inline CSS/JS, missing targets, cycles, external URLs, and LF/CRLF.

Exit: all paths have dispositions, repeated runs are byte-stable, and policy mutations change the inventory receipt.

### Slice 1: HTML/CSS source facts

Project exact observations and diagnostics without page-type classification.

Exit: expected byte slices, line/column recomputation, malformed-input behavior, unique IDs, and schema validation all pass.

### Slice 2: artifact-family graph

Resolve bounded relationships from explicit HTML entries through CSS, JS/TS, JSON, and assets.

Exit: expected members, unresolved/external edges, cycles, and exclusion boundaries match the gold manifest; precision and recall are reported separately.

### Slice 3: webpage classification overlay

Integrate the existing classifier in offline snapshot mode.

Exit: its 15 proof scenarios remain green, local classifications cite web-index evidence, and insufficient evidence abstains.

### Slice 4: manual intent session

Run real queries, record considered/rejected patterns, generate three layouts, and select one explicitly.

Exit: the session replays from intent and evidence IDs; changed evidence or intent invalidates stale selection.

### Slice 5: governed design document and preview

Create the landing-page contract, project and review the design document, then project a minimal preview.

Exit: contract valid; projected bytes match authority; read-only conformance is `TRUSTED`; browser checks satisfy declared structure, accessibility, and responsive assertions; no unreviewed candidate becomes authority.

## Accuracy proof matrix

| Risk | Required proof |
| --- | --- |
| silent inventory omission | expected manifest plus excluded/unsupported/unreadable/changed testimony |
| generated output presented as authored know-how | labeled fixtures and disposition tests |
| HTML/CSS location drift | byte-slice and line/column recomputation tests |
| parser information loss | canonical fixtures and malformed-syntax diagnostics |
| family over-expansion | unrelated-JS negative controls and limit tests |
| family under-expansion | hand-labeled HTML/CSS/JS/JSON/asset edges |
| false relationship binding | resolved/candidate/unresolved invariants |
| heuristic presented as fact | schema-enforced testimony state and evidence reference |
| stale human selection | intent/evidence hash-bound selection tests |
| unreviewed promotion | fail-closed missing-review negative control |
| projection drift | deterministic replay and mutation rejection |
| browser-only behavior missed | `requiresRender` plus `NOT_EVALUATED` until capture is seated |

## Query contracts to implement and prove

After the web overlay collections are registered with the existing SEJ relational query engine, the MVP should prove at least these queries as acceptance fixtures:

```sql
SELECT familyId, rootId, entryModulePath, classificationStatus
FROM webFamilies
ORDER BY rootId, entryModulePath
```

```sql
SELECT familyId, relationshipKind, candidateTarget, resolutionDisposition
FROM webRelationships
WHERE resolutionDisposition <> 'resolved-local'
```

```sql
SELECT profileId, taxonomyNodeId, evidenceReference, disposition
FROM webpageClassifications
WHERE taxonomyNodeId = 'landing-page'
```

```sql
SELECT stylesheetId, propertyName, normalizedValue, sourceReferenceId
FROM cssDeclarations
WHERE propertyName = '--surface'
```

Do not initially promise natural-language `find`, semantic similarity, `CONTAINS`, or automatic pattern ranking unless those operations are implemented and proved. The current SEJ relational query path is the reliable starting surface.

## Decisions that remain human in the first circuit

The system may retrieve and compare evidence, but a person still decides which files are legitimate exemplars, which page pattern fits the audience and purpose, which security/authentication posture applies, which layout and visual candidates are selected, whether recurrence deserves promotion, and whether the design document is ready for executable projection.

The session record turns these decisions into future inference-engine training and evaluation evidence without pretending the current tool already owns them.

## Immediate implementation recommendation

The next coding sprint should stop after Slice 2:

> Build a policy-driven multi-root web inventory, add exact HTML and CSS facts, and project bounded web artifact families for the 21-page first-wave corpus.

That is the missing foundation. Classification, layout shaping, contract growth, and webpage projection can then remain independently testable consumers of the same evidence.

# Slice 3–5 and cross-cutting facts implementation evidence (2026-08-01)

Following the Slice 0–2 build above, five more capabilities were added: data-flow
facts (a placeholder since before this repository's first commit), real JSX/TSX
component-tree facts, the webpage-classification overlay (Slice 3), a query surface
for the web-surface collections, manual intent-session tooling (Slice 4), and
governed-contract/design-document projection (Slice 5). A real session was then run
against the pilot corpus, producing genuine session, contract, and design-document
artifacts — not just the machinery.

## Scope actually covered

- **Data-flow facts** (`source-fact-index.v1.dataflows`): assignment, return, and
  call-argument edges, resolved against parameter/local bindings only within the
  same enclosing function (mirrors the existing `relationships.fromSymbolResolution`
  philosophy) — not cross-file flow analysis.
- **JSX component-tree facts**: real `ts.createSourceFile`-based extraction (the
  TypeScript compiler, not a regex approximation), covering element/prop structure,
  fragments, and `jsx-component-reference` edges resolved through local imports —
  not type-aware prop resolution.
- **Classification overlay**: the `page-type` dimension only, reusing
  `webpage-classification-scanner`'s heuristic evaluator and taxonomy/lexicon packs
  directly rather than its network-bound harness.
- **Governed contract**: subject/purpose/audience, a page-region tree with cited
  reused-know-how evidence, and one selected layout — not the doc's full five-pass
  feature/scenario/responsibility/obligation/signal formalism.
- **Design-document projection**: the markdown design document and a candidate-AST
  text view — not the executable HTML preview (Slice 5's "project the executable
  webpage body" remains future work).

## Concrete evidence anchors

- data-flow facts: [`src/dataflow-projector.js`](../src/dataflow-projector.js),
  wired into [`src/project.js`](../src/project.js), schema in
  [`source-fact-index.schema.v1.json`](../contracts/source-fact-index.schema.v1.json),
  proof in [`test/dataflow-projector.test.js`](../test/dataflow-projector.test.js)
- JSX component-tree facts: [`src/web/jsx-projector.js`](../src/web/jsx-projector.js),
  wired into [`src/web/family-projector.js`](../src/web/family-projector.js), proof
  in [`test/jsx-projector.test.js`](../test/jsx-projector.test.js)
- webpage-classification overlay:
  [`src/web/classification-overlay.js`](../src/web/classification-overlay.js), proof
  in [`test/classification-overlay.test.js`](../test/classification-overlay.test.js)
  — reuses
  [`webpage-classification-scanner/src/runtime/index-builder.ts`](../../webpage-classification-scanner/src/runtime/index-builder.ts),
  [`heuristic-evaluator.ts`](../../webpage-classification-scanner/src/runtime/heuristic-evaluator.ts),
  and
  [`classification-resolver.ts`](../../webpage-classification-scanner/src/runtime/classification-resolver.ts)
  directly, with only the two classification decision declarations registered on a
  fresh `SemanticKernel`
- web-surface query engine: [`src/web/web-query.js`](../src/web/web-query.js), CLI
  `web query` in [`src/cli.js`](../src/cli.js), proof in
  [`test/web-query.test.js`](../test/web-query.test.js)
- manual intent sessions: contract in
  [`intent-to-product-session.schema.v1.json`](../contracts/intent-to-product-session.schema.v1.json),
  builder in [`src/session/intent-session.js`](../src/session/intent-session.js),
  proof in [`test/intent-session.test.js`](../test/intent-session.test.js)
- governed contract and design-document projection: contract schema in
  [`web-know-landing-page-contract.schema.v1.json`](../contracts/web-know-landing-page-contract.schema.v1.json),
  builder in
  [`src/session/landing-page-contract.js`](../src/session/landing-page-contract.js),
  projector in
  [`src/session/design-document-projector.js`](../src/session/design-document-projector.js),
  proof in
  [`test/design-document-projector.test.js`](../test/design-document-projector.test.js)

## The real session

[`scripts/run-landing-page-session.mjs`](../scripts/run-landing-page-session.mjs)
runs the actual manual conveyor against the pilot corpus's `web-surface-index.json`
(regenerated via `web project` so it includes the new `jsxElements` and
`webpageClassifications` collections), querying real evidence through
`web-query.js` before making each selection:

- Surveyed all 21 HTML entry surfaces: nearly all are internal operator/console
  prototypes; exactly one (`managed-services-homepage.html`, a labeled
  webpage-classification-scanner fixture) is a public marketing homepage.
- Confirmed independently via the classification overlay that all 21 pages abstain
  from `page-type` classification — consistent with the survey, since the pack's
  URL-path-dependent heuristics have little to work with on internal tooling pages.
  Abstention here is correct behavior, not a bug; the overlay's own tests
  (`test/classification-overlay.test.js`) prove it resolves `landing-page`
  correctly against a page shaped like one.
- Selected `managed-services-homepage.html`'s structural skeleton (header/nav,
  hero, three feature sections, footer) over the majority internal-console pattern,
  explicitly rejecting the majority pattern as audience-inappropriate.
- Selected the corpus-wide dark-theme custom-property token scale
  (`--bg`/`--text`/`--accent`/`--muted`/`--border`, recurring 6–12× independently
  of the structural source page) as reused visual authority.
- Found **zero** authentication forms anywhere in the pilot corpus (0 of the
  corpus's `<input>` elements are `type=password`) and recorded the sign-in-entry
  decision as an explicit, honest gap rather than inventing a posture.

Outputs, all schema-validated during the run:
[`sessions/know-how-center-landing-page.json`](../sessions/know-how-center-landing-page.json),
[`sessions/know-how-center-landing-page.contract.json`](../sessions/know-how-center-landing-page.contract.json),
[`design/know-how-center-landing-page.md`](../design/know-how-center-landing-page.md),
[`design/know-how-center-landing-page.ast.txt`](../design/know-how-center-landing-page.ast.txt).
Every byte-level evidence reference cited in the session was independently checked
against the index's own `sourceReferences` collection and resolves to a real
citation — none are fabricated.
