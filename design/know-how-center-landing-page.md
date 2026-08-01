# Design Document: Deterministic Know-How Intelligence Center — public landing page

_Projected from session `sha256:ed6d9e7527972ba6a7ba95fd8ffcc84fd62ae46cf8b9c4b4b19feb52adc715ff` and contract `sha256:1af209c02594df8fe9710c1909ba262c4a21fe3cf316b9092f5f0a24839a9520`. This document is a deterministic projection — every claim below cites session or contract evidence; edits belong in the session or contract, not this file._

## 1. Human Intent

Build the public landing page for the Deterministic Know-How Intelligence Center.

> This is the pipeline-discussion doc's own proposed first mission: scan existing repositories for webpage know-how and use that know-how to design the first governed landing page.

## 2. Intended Audience

Engineers and technical leads evaluating deterministic source-fact and web-know tooling, arriving with no prior context.

## 3. Website Purpose

Introduce the deterministic know-how intelligence conveyor to technical visitors evaluating it for their own codebases, and route them toward documentation or a live demo.

## 4. Page Regions

- GlobalHeader — Reused structural skeleton; search and sign-in entries are open gaps, not populated here.
  - PrimaryNavigation
- Hero — Headline, supporting paragraph, primary + secondary CTA.
- KnowHowFamilies — New authority — no corpus precedent for a capability-family grid; not populated beyond the region placeholder in this pass.
- FeatureSections — Reused three-section body shape (service/service/why-choose-us) from managed-services-homepage.html.
- GlobalFooter
- AuthenticationEntry — Deferred: no sign-in pattern exists anywhere in the pilot corpus (0 of many <input> elements are type=password). Navigates to a separate governed authentication capability once one exists; posture (magic link vs. SSO vs. passkey) intentionally left unselected.

## 5. Reused Know-How

- **GlobalHeader** reuses _header-primary-nav-flat-links_ (evidence: managed-services-homepage.html:565:5)
- **PrimaryNavigation** reuses _header-primary-nav-flat-links_ (evidence: managed-services-homepage.html:575:20, managed-services-homepage.html:600:32)
- **Hero** reuses _centered-hero-with-dual-cta_ (evidence: managed-services-homepage.html:771:75, managed-services-homepage.html:1069:44, managed-services-homepage.html:1753:55)
- **FeatureSections** reuses _three-feature-section-layout_ (evidence: managed-services-homepage.html:1135:25, managed-services-homepage.html:1411:31, managed-services-homepage.html:1845:29)
- **GlobalFooter** reuses _footer-with-direct-contact_ (evidence: managed-services-homepage.html:2132:8)

## 6. Selections Made

- **structural-posture**: managed-services-homepage structural skeleton — Best (and only) fit for a first-time public visitor, drawn from real corpus evidence rather than the majority internal-tooling pattern.
- **hero-pattern**: centered-hero-with-dual-cta — Only hero pattern with real corpus precedent; the alternatives would require net-new authority this pass doesn't cover.
- **navigation-pattern**: header-primary-nav-flat-links — Direct reuse of the one real navigation exemplar found by query.
- **sign-in-entry**: deferred — no corpus precedent — Honest gap: the landing page will link out to a dedicated authentication capability (per the pipeline doc's own separation of concerns) but this pass does not select magic-link vs. SSO vs. passkey without real evidence.
- **theme-tokens**: shared-dark-theme-custom-property-scale — Only token system with real, repeated corpus precedent.

## 7. Considered and Rejected Patterns

- ~~internal-dark-console-shell (majority pattern across the corpus)~~ (structural-posture) — This is the most common shape in the corpus, but it is an internal operator-console posture (dense telemetry panels, control-plane cockpits) built for operators already inside the system, not for a first-time public visitor evaluating the product. Reusing it would misrepresent the audience.
- ~~hero-with-code-sample~~ (hero-pattern) — No page in the pilot corpus pairs a hero with an inline code sample. Selecting this pattern would require new authority, not reuse — out of scope for this pass.
- ~~hero-with-interactive-architecture-diagram~~ (hero-pattern) — Same gap: not observed anywhere in the corpus. Recording the absence honestly rather than inventing a precedent.
- ~~any-authentication-pattern-from-corpus~~ (sign-in-entry) — Zero password inputs and zero authentication forms exist anywhere in the 21-page pilot corpus (verified: 2 <input> elements total, none of type password). Per the pipeline discussion's own guidance, the sign-in posture must come from repository findings and security constraints, not visual preference — since there are no findings to draw on, this decision is deferred rather than invented.

## 8. Evidence Queries Run

1. `SELECT relativePath, title FROM htmlDocuments` — 21 HTML entry surfaces found. Nearly all are internal operator/console prototypes (AI engine telemetry, LOC control plane, warehouse/shipment consoles, UX choreography inspectors). Exactly one, managed-services-homepage.html, is a public marketing homepage (a labeled webpage-classification-scanner fixture); index.html is the governed procedural-dungeon-webpage bootstrap reference.
2. `SELECT dimension, value, disposition, supportScore FROM webpageClassifications` — The page-type classifier (page-type.heuristics.sej.v1 pack) abstained on all 21 pages — consistent with the survey above: this corpus is overwhelmingly internal tooling, not deployed marketing pages, so its URL-path-dependent heuristics (e.g. homepage requires site-root path) have little to work with here.
3. `SELECT tag, text, sourceReferenceId FROM htmlElements WHERE kind = 'heading' AND tag = 'h1'` — 23 <h1> headings found across the corpus. Only managed-services-homepage.html's h1 ("Managed IT and cybersecurity services for growing enterprise teams") sits inside a hero region with supporting copy and two calls to action; the rest are console/dashboard page titles, not marketing heroes.
4. `SELECT text, attributes FROM htmlElements WHERE kind = 'link' AND documentId = '051ae101c68f6c7e783a69de289be1e5e08341c9d17342effb69f532bcaafb92'` — managed-services-homepage.html's navigation and body links: Home, Services, Case Studies, Careers, Contact, Request an assessment, Book a demo, Customer success stories, Join our team - open positions and benefits. The header nav itself carries 5 primary links (Home, Services, Case Studies, Careers, Contact) and no search entry, no sign-in entry.
5. `SELECT tag, attributes FROM htmlElements WHERE tag = 'input'` — 2 <input> elements found corpus-wide; 0 are password inputs. No authentication form of any kind exists in this pilot corpus.
6. `SELECT propertyName, COUNT(*) AS usageCount FROM cssDeclarations WHERE isCustomProperty = true GROUP BY propertyName ORDER BY usageCount DESC LIMIT 5` — Top reused custom-property tokens by usage count: --bg (12x), --muted (12x), --line (11x), --shadow (8x), --danger (7x). A consistent dark-theme token scale (--bg/--surface/--text/--accent/--muted/--border) recurs across most console pages, independent of the marketing-page source used for structure.

## 9. Selected Layout

documentation-homepage-with-dark-theme-tokens — Structural skeleton and hero reused from managed-services-homepage.html; visual theme reused from the corpus-wide dark custom-property token scale. Combines the only two real, evidence-backed patterns found in the pilot corpus.

## 10. Terminal Disposition

design-document-projected
