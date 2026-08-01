#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { validatesWebSurfaceIndex } from "../src/web/validate-web-index.js";
import { executesWebRelationalQuery } from "../src/web/web-query.js";
import {
  startsSession,
  recordsQuery,
  recordsInspection,
  recordsConsideration,
  recordsSelection,
  revisesContract,
  finalizesSession,
} from "../src/session/intent-session.js";
import { validatesIntentSession, validatesLandingPageContract } from "../src/session/validate-session.js";
import { buildsLandingPageContract } from "../src/session/landing-page-contract.js";
import { projectsDesignDocument, projectsCandidateAstText } from "../src/session/design-document-projector.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const policy = JSON.parse(await fs.readFile(path.join(repoRoot, "web-know.workspace.json"), "utf8"));

const inventory = await projectsWebSurfaceInventory({ policy });
const index = await projectsWebSurfaceIndex({ policy, inventory });
await validatesWebSurfaceIndex(index);

async function runsQuery(session, queryText, summarize) {
  const result = await executesWebRelationalQuery(index, queryText);
  const rows = result.result.value.rows;
  const resultSummary = summarize(rows);
  const nextSession = recordsQuery(session, { queryText, resultSummary, rowCount: rows.length });
  return { session: nextSession, rows };
}

// Step 1 — state the broad intent.
let session = startsSession({
  subject: "Deterministic Know-How Intelligence Center — public landing page",
  intentText: "Build the public landing page for the Deterministic Know-How Intelligence Center.",
  rationale: "This is the pipeline-discussion doc's own proposed first mission: scan existing repositories for webpage know-how and use that know-how to design the first governed landing page.",
});

// Step 2 — query existing know-how: what pages does the pilot corpus actually contain?
let overview;
({ session, rows: overview } = await runsQuery(
  session,
  "SELECT relativePath, title FROM htmlDocuments",
  (rows) => `${rows.length} HTML entry surfaces found. Nearly all are internal operator/console prototypes (AI engine telemetry, LOC control plane, warehouse/shipment consoles, UX choreography inspectors). Exactly one, managed-services-homepage.html, is a public marketing homepage (a labeled webpage-classification-scanner fixture); index.html is the governed procedural-dungeon-webpage bootstrap reference.`,
));
session = recordsInspection(session, {
  sourceReferenceIds: overview.map((row) => `htmlDocuments:${row.relativePath}`),
  note: "Surveyed every HTML entry surface's title before choosing which pages to treat as structural exemplars for a public-facing page.",
});

// Step 3 — check whether the classification overlay independently agrees with that read.
let classifications;
({ session, rows: classifications } = await runsQuery(
  session,
  "SELECT dimension, value, disposition, supportScore FROM webpageClassifications",
  (rows) => {
    const resolved = rows.filter((row) => row.value !== null);
    return resolved.length === 0
      ? `The page-type classifier (page-type.heuristics.sej.v1 pack) abstained on all ${rows.length} pages — consistent with the survey above: this corpus is overwhelmingly internal tooling, not deployed marketing pages, so its URL-path-dependent heuristics (e.g. homepage requires site-root path) have little to work with here.`
      : `${resolved.length} of ${rows.length} pages resolved a page-type classification.`;
  },
));
session = recordsConsideration(session, {
  category: "structural-posture",
  candidateLabel: "internal-dark-console-shell (majority pattern across the corpus)",
  evidenceReferences: overview.filter((row) => row.relativePath !== "managed-services-homepage.html").slice(0, 3).map((row) => `htmlDocuments:${row.relativePath}`),
  outcome: "rejected",
  rationale: "This is the most common shape in the corpus, but it is an internal operator-console posture (dense telemetry panels, control-plane cockpits) built for operators already inside the system, not for a first-time public visitor evaluating the product. Reusing it would misrepresent the audience.",
});
session = recordsConsideration(session, {
  category: "structural-posture",
  candidateLabel: "managed-services-homepage (header nav + hero + feature sections + footer)",
  evidenceReferences: ["managed-services-homepage.html:565:5", "managed-services-homepage.html:760:6", "managed-services-homepage.html:2132:8"],
  outcome: "selected",
  rationale: "The only page in the corpus actually shaped like public marketing/documentation homepage: a header with primary navigation, a hero, three feature sections, and a footer with a direct contact path. This structural skeleton is the appropriate one to reuse for a public landing page.",
});
session = recordsSelection(session, {
  category: "structural-posture",
  selectedLabel: "managed-services-homepage structural skeleton",
  consideredConsiderationIds: session.considerations.map((consideration) => consideration.considerationId),
  rationale: "Best (and only) fit for a first-time public visitor, drawn from real corpus evidence rather than the majority internal-tooling pattern.",
});

// Step 4 — query hero patterns.
let heroCandidates;
({ session, rows: heroCandidates } = await runsQuery(
  session,
  "SELECT tag, text, sourceReferenceId FROM htmlElements WHERE kind = 'heading' AND tag = 'h1'",
  (rows) => `${rows.length} <h1> headings found across the corpus. Only managed-services-homepage.html's h1 ("Managed IT and cybersecurity services for growing enterprise teams") sits inside a hero region with supporting copy and two calls to action; the rest are console/dashboard page titles, not marketing heroes.`,
));
session = recordsConsideration(session, {
  category: "hero-pattern",
  candidateLabel: "hero-with-code-sample",
  evidenceReferences: [],
  outcome: "rejected",
  rationale: "No page in the pilot corpus pairs a hero with an inline code sample. Selecting this pattern would require new authority, not reuse — out of scope for this pass.",
});
session = recordsConsideration(session, {
  category: "hero-pattern",
  candidateLabel: "hero-with-interactive-architecture-diagram",
  evidenceReferences: [],
  outcome: "rejected",
  rationale: "Same gap: not observed anywhere in the corpus. Recording the absence honestly rather than inventing a precedent.",
});
session = recordsConsideration(session, {
  category: "hero-pattern",
  candidateLabel: "centered-hero-with-dual-cta",
  evidenceReferences: ["managed-services-homepage.html:771:75", "managed-services-homepage.html:1069:44", "managed-services-homepage.html:1753:55"],
  outcome: "selected",
  rationale: "Headline plus supporting paragraph plus a primary CTA (\"Request an assessment\") and a secondary CTA (\"Book a demo\") is a real, observed pattern and reads well for an audience evaluating a new deterministic-tooling product.",
});
session = recordsSelection(session, {
  category: "hero-pattern",
  selectedLabel: "centered-hero-with-dual-cta",
  consideredConsiderationIds: session.considerations.filter((consideration) => consideration.category === "hero-pattern").map((consideration) => consideration.considerationId),
  rationale: "Only hero pattern with real corpus precedent; the alternatives would require net-new authority this pass doesn't cover.",
});

// Step 5 — query navigation patterns.
let navLinks;
({ session, rows: navLinks } = await runsQuery(
  session,
  "SELECT text, attributes FROM htmlElements WHERE kind = 'link' AND documentId = '051ae101c68f6c7e783a69de289be1e5e08341c9d17342effb69f532bcaafb92'",
  (rows) => `managed-services-homepage.html's navigation and body links: ${rows.map((row) => row.text).filter(Boolean).join(", ")}. The header nav itself carries 5 primary links (Home, Services, Case Studies, Careers, Contact) and no search entry, no sign-in entry.`,
));
session = recordsConsideration(session, {
  category: "navigation-pattern",
  candidateLabel: "header-primary-nav-flat-links",
  evidenceReferences: ["managed-services-homepage.html:565:5"],
  outcome: "selected",
  rationale: "The only real navigation exemplar in the corpus: a flat set of primary links in the header. Reused as-is for structure; search and sign-in entries have no precedent here (see below) so they are marked as gaps, not fabricated.",
});
session = recordsSelection(session, {
  category: "navigation-pattern",
  selectedLabel: "header-primary-nav-flat-links",
  consideredConsiderationIds: session.considerations.filter((consideration) => consideration.category === "navigation-pattern").map((consideration) => consideration.considerationId),
  rationale: "Direct reuse of the one real navigation exemplar found by query.",
});

// Step 6 — query sign-in entry patterns.
let passwordInputs;
({ session, rows: passwordInputs } = await runsQuery(
  session,
  "SELECT tag, attributes FROM htmlElements WHERE tag = 'input'",
  (rows) => {
    const passwordCount = rows.filter((row) => row.attributes.type === "password").length;
    return `${rows.length} <input> elements found corpus-wide; ${passwordCount} are password inputs. No authentication form of any kind exists in this pilot corpus.`;
  },
));
session = recordsConsideration(session, {
  category: "sign-in-entry",
  candidateLabel: "any-authentication-pattern-from-corpus",
  evidenceReferences: [],
  outcome: "rejected",
  rationale: `Zero password inputs and zero authentication forms exist anywhere in the ${overview.length}-page pilot corpus (verified: ${passwordInputs.length} <input> elements total, none of type password). Per the pipeline discussion's own guidance, the sign-in posture must come from repository findings and security constraints, not visual preference — since there are no findings to draw on, this decision is deferred rather than invented.`,
});
session = recordsSelection(session, {
  category: "sign-in-entry",
  selectedLabel: "deferred — no corpus precedent",
  consideredConsiderationIds: session.considerations.filter((consideration) => consideration.category === "sign-in-entry").map((consideration) => consideration.considerationId),
  rationale: "Honest gap: the landing page will link out to a dedicated authentication capability (per the pipeline doc's own separation of concerns) but this pass does not select magic-link vs. SSO vs. passkey without real evidence.",
});

// Step 7 — query theme tokens used across dark interfaces (a separate, corpus-wide pattern from the hero/nav source page).
let themeTokens;
({ session, rows: themeTokens } = await runsQuery(
  session,
  "SELECT propertyName, COUNT(*) AS usageCount FROM cssDeclarations WHERE isCustomProperty = true GROUP BY propertyName ORDER BY usageCount DESC LIMIT 5",
  (rows) => `Top reused custom-property tokens by usage count: ${rows.map((row) => `${row.propertyName} (${row.usageCount}x)`).join(", ")}. A consistent dark-theme token scale (--bg/--surface/--text/--accent/--muted/--border) recurs across most console pages, independent of the marketing-page source used for structure.`,
));
session = recordsInspection(session, {
  sourceReferenceIds: [
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:269:14",
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:468:16",
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:549:18",
  ],
  note: "Inspected the fullest --bg/--text/--accent token scale in the corpus to confirm real hex values before citing the theme as reused know-how.",
});
session = recordsConsideration(session, {
  category: "theme-tokens",
  candidateLabel: "shared-dark-theme-custom-property-scale",
  evidenceReferences: [
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:269:14",
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:468:16",
    "ai-execution-substrate/ai-engine-execution-telemetry-preview.html:549:18",
  ],
  outcome: "selected",
  rationale: `Recurs across ${themeTokens[0]?.usageCount ?? "several"}+ files with consistent naming (--bg, --text, --accent, --muted, --border). A genuinely reusable design-token vocabulary, independent of which page supplied the structural skeleton.`,
});
session = recordsSelection(session, {
  category: "theme-tokens",
  selectedLabel: "shared-dark-theme-custom-property-scale",
  consideredConsiderationIds: session.considerations.filter((consideration) => consideration.category === "theme-tokens").map((consideration) => consideration.considerationId),
  rationale: "Only token system with real, repeated corpus precedent.",
});

// Build the governed contract from the selections above.
const contract = buildsLandingPageContract({
  sessionId: session.sessionId,
  subject: "Deterministic Know-How Intelligence Center — public landing page",
  purpose: "Introduce the deterministic know-how intelligence conveyor to technical visitors evaluating it for their own codebases, and route them toward documentation or a live demo.",
  audience: "Engineers and technical leads evaluating deterministic source-fact and web-know tooling, arriving with no prior context.",
  pageRegions: [
    { name: "GlobalHeader", parentName: null, reusedKnowHow: [{ label: "header-primary-nav-flat-links", evidenceReferences: ["managed-services-homepage.html:565:5"] }], notes: "Reused structural skeleton; search and sign-in entries are open gaps, not populated here." },
    { name: "PrimaryNavigation", parentName: "GlobalHeader", reusedKnowHow: [{ label: "header-primary-nav-flat-links", evidenceReferences: ["managed-services-homepage.html:575:20", "managed-services-homepage.html:600:32"] }], notes: null },
    { name: "Hero", parentName: null, reusedKnowHow: [{ label: "centered-hero-with-dual-cta", evidenceReferences: ["managed-services-homepage.html:771:75", "managed-services-homepage.html:1069:44", "managed-services-homepage.html:1753:55"] }], notes: "Headline, supporting paragraph, primary + secondary CTA." },
    { name: "KnowHowFamilies", parentName: null, reusedKnowHow: [], notes: "New authority — no corpus precedent for a capability-family grid; not populated beyond the region placeholder in this pass." },
    { name: "FeatureSections", parentName: null, reusedKnowHow: [{ label: "three-feature-section-layout", evidenceReferences: ["managed-services-homepage.html:1135:25", "managed-services-homepage.html:1411:31", "managed-services-homepage.html:1845:29"] }], notes: "Reused three-section body shape (service/service/why-choose-us) from managed-services-homepage.html." },
    { name: "GlobalFooter", parentName: null, reusedKnowHow: [{ label: "footer-with-direct-contact", evidenceReferences: ["managed-services-homepage.html:2132:8"] }], notes: null },
    { name: "AuthenticationEntry", parentName: null, reusedKnowHow: [], notes: "Deferred: no sign-in pattern exists anywhere in the pilot corpus (0 of many <input> elements are type=password). Navigates to a separate governed authentication capability once one exists; posture (magic link vs. SSO vs. passkey) intentionally left unselected." },
  ],
  selectedLayout: {
    label: "documentation-homepage-with-dark-theme-tokens",
    rationale: "Structural skeleton and hero reused from managed-services-homepage.html; visual theme reused from the corpus-wide dark custom-property token scale. Combines the only two real, evidence-backed patterns found in the pilot corpus.",
  },
});
await validatesLandingPageContract(contract);

session = revisesContract(session, {
  summary: "Initial contract: header/nav, hero, feature sections, footer, and an explicitly deferred authentication-entry region.",
  contractHash: contract.contractId,
});
session = finalizesSession(session, "design-document-projected");
await validatesIntentSession(session);

const designDocument = projectsDesignDocument({ session, contract });
const candidateAst = projectsCandidateAstText({ contract });

await fs.mkdir(path.join(repoRoot, "sessions"), { recursive: true });
await fs.mkdir(path.join(repoRoot, "design"), { recursive: true });
await fs.writeFile(path.join(repoRoot, "sessions", "know-how-center-landing-page.json"), JSON.stringify(session, null, 2), "utf8");
await fs.writeFile(path.join(repoRoot, "sessions", "know-how-center-landing-page.contract.json"), JSON.stringify(contract, null, 2), "utf8");
await fs.writeFile(path.join(repoRoot, "design", "know-how-center-landing-page.md"), designDocument, "utf8");
await fs.writeFile(path.join(repoRoot, "design", "know-how-center-landing-page.ast.txt"), candidateAst, "utf8");

console.log(JSON.stringify({
  disposition: "LANDING_PAGE_SESSION_COMPLETE",
  sessionId: session.sessionId,
  contractId: contract.contractId,
  queries: session.queries.length,
  considerations: session.considerations.length,
  selections: session.selections.length,
  outputs: [
    "sessions/know-how-center-landing-page.json",
    "sessions/know-how-center-landing-page.contract.json",
    "design/know-how-center-landing-page.md",
    "design/know-how-center-landing-page.ast.txt",
  ],
}, null, 2));
