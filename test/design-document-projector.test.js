import assert from "node:assert/strict";
import test from "node:test";
import { startsSession, recordsQuery, recordsConsideration, recordsSelection, finalizesSession } from "../src/session/intent-session.js";
import { buildsLandingPageContract } from "../src/session/landing-page-contract.js";
import { validatesLandingPageContract } from "../src/session/validate-session.js";
import { projectsDesignDocument, projectsCandidateAstText } from "../src/session/design-document-projector.js";

function buildsFixtureSessionAndContract() {
  let session = startsSession({
    subject: "Know-How Intelligence Center landing page",
    intentText: "Build the public landing page for the Know-How Intelligence Center.",
    rationale: "First mission from the pipeline discussion.",
  });
  session = recordsQuery(session, { queryText: "SELECT familyId FROM webFamilies", resultSummary: "21 families found.", rowCount: 21 });
  session = recordsConsideration(session, {
    category: "hero-pattern",
    candidateLabel: "centered-educational-hero",
    evidenceReferences: ["index.html:10:50"],
    outcome: "selected",
    rationale: "Matches the documentation-first posture.",
  });
  session = recordsConsideration(session, {
    category: "hero-pattern",
    candidateLabel: "split-hero-with-product-preview",
    evidenceReferences: [],
    outcome: "rejected",
    rationale: "No product preview exists yet to show.",
  });
  session = recordsSelection(session, {
    category: "hero-pattern",
    selectedLabel: "centered-educational-hero",
    consideredConsiderationIds: session.considerations.map((consideration) => consideration.considerationId),
    rationale: "Best fit for an educational, documentation-first audience.",
  });
  session = finalizesSession(session, "design-document-projected");

  const contract = buildsLandingPageContract({
    sessionId: session.sessionId,
    subject: "Know-How Intelligence Center landing page",
    purpose: "Introduce the deterministic know-how intelligence conveyor to technical visitors.",
    audience: "Engineers evaluating deterministic tooling for their own codebases.",
    pageRegions: [
      { name: "GlobalHeader", parentName: null, reusedKnowHow: [], notes: null },
      { name: "PrimaryNavigation", parentName: "GlobalHeader", reusedKnowHow: [{ label: "header-primary-nav-with-search", evidenceReferences: ["index.html:40:80"] }], notes: null },
      { name: "Hero", parentName: null, reusedKnowHow: [{ label: "centered-educational-hero", evidenceReferences: ["index.html:10:50"] }], notes: "Selected hero pattern" },
    ],
    selectedLayout: { label: "documentation-homepage", rationale: "Matches the technical audience." },
  });

  return { session, contract };
}

test("builds a schema-valid contract with correctly resolved region depth and parentage", async () => {
  const { contract } = buildsFixtureSessionAndContract();
  await validatesLandingPageContract(contract);

  const header = contract.pageRegions.find((region) => region.name === "GlobalHeader");
  const nav = contract.pageRegions.find((region) => region.name === "PrimaryNavigation");
  const hero = contract.pageRegions.find((region) => region.name === "Hero");

  assert.equal(header.depth, 0);
  assert.equal(header.parentRegionId, null);
  assert.equal(nav.depth, 1);
  assert.equal(nav.parentRegionId, header.regionId);
  assert.equal(hero.depth, 0);
});

test("rejects a page region with an unknown parent", () => {
  assert.throws(() => buildsLandingPageContract({
    sessionId: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    subject: "x",
    purpose: "y",
    audience: "z",
    pageRegions: [{ name: "Orphan", parentName: "DoesNotExist", reusedKnowHow: [], notes: null }],
  }));
});

test("projects a design document that cites real session and contract content", () => {
  const { session, contract } = buildsFixtureSessionAndContract();
  const document = projectsDesignDocument({ session, contract });

  assert.match(document, /# Design Document: Know-How Intelligence Center landing page/);
  assert.match(document, /Build the public landing page for the Know-How Intelligence Center\./);
  assert.match(document, /Engineers evaluating deterministic tooling/);
  assert.match(document, /centered-educational-hero/);
  assert.match(document, /~~split-hero-with-product-preview~~/);
  assert.match(document, /SELECT familyId FROM webFamilies/);
  assert.match(document, /documentation-homepage/);
  assert.match(document, /design-document-projected/);
});

test("projects a deterministic candidate AST text view matching page region nesting", () => {
  const { contract } = buildsFixtureSessionAndContract();
  const ast = projectsCandidateAstText({ contract });
  const lines = ast.trim().split("\n");
  assert.equal(lines[0], "Know-How Intelligence Center landing page");
  assert.equal(lines[1], "└── GlobalHeader");
  assert.equal(lines[2], "    └── PrimaryNavigation");
  assert.equal(lines[3], "└── Hero");
});
