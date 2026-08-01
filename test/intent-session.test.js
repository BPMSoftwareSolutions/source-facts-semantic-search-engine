import assert from "node:assert/strict";
import test from "node:test";
import {
  startsSession,
  revisesIntent,
  recordsQuery,
  recordsInspection,
  recordsConsideration,
  recordsSelection,
  revisesContract,
  finalizesSession,
} from "../src/session/intent-session.js";
import { validatesIntentSession } from "../src/session/validate-session.js";

test("builds a session through every recorded step, staying schema-valid at each point", async () => {
  let session = startsSession({
    subject: "Public landing page",
    intentText: "Build the public landing page for the Know-How Intelligence Center.",
    rationale: "Matches the pipeline discussion's first mission.",
  });
  await validatesIntentSession(session);
  assert.equal(session.intentRevisions.length, 1);
  assert.equal(session.terminalDisposition, null);

  session = revisesIntent(session, { intentText: "Emphasize technical documentation posture.", rationale: "Query results showed documentation-style pages perform best for this audience." });
  await validatesIntentSession(session);
  assert.equal(session.intentRevisions.length, 2);

  session = recordsQuery(session, {
    queryText: "SELECT familyId, entryRelativePath FROM webFamilies",
    resultSummary: "21 families returned across the pilot corpus.",
    rowCount: 21,
  });
  await validatesIntentSession(session);
  assert.equal(session.queries[0].ordinal, 1);

  session = recordsInspection(session, {
    sourceReferenceIds: ["index.html:0:120"],
    note: "Inspected the dungeon webpage's bootstrap structure as a governed-projection reference.",
  });
  await validatesIntentSession(session);

  session = recordsConsideration(session, {
    category: "navigation-pattern",
    candidateLabel: "header-primary-nav-with-search",
    evidenceReferences: ["index.html:40:80"],
    outcome: "selected",
    rationale: "Only nav pattern in the corpus combining search entry with primary links.",
  });
  session = recordsConsideration(session, {
    category: "navigation-pattern",
    candidateLabel: "sidebar-nav",
    evidenceReferences: [],
    outcome: "rejected",
    rationale: "No sidebar navigation pattern was observed anywhere in the pilot corpus.",
  });
  await validatesIntentSession(session);
  assert.equal(session.considerations.length, 2);

  session = recordsSelection(session, {
    category: "navigation-pattern",
    selectedLabel: "header-primary-nav-with-search",
    consideredConsiderationIds: session.considerations.map((consideration) => consideration.considerationId),
    rationale: "Best matches the documentation-first posture chosen above.",
  });
  await validatesIntentSession(session);

  session = revisesContract(session, {
    summary: "Added GlobalHeader and Hero page regions.",
    contractHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  });
  await validatesIntentSession(session);

  session = finalizesSession(session, "design-document-projected");
  await validatesIntentSession(session);
  assert.equal(session.terminalDisposition, "design-document-projected");
});

test("rejects further recording once a session is finalized", () => {
  let session = startsSession({ subject: "Test", intentText: "Test intent." });
  session = finalizesSession(session, "abandoned");
  assert.throws(() => recordsQuery(session, { queryText: "SELECT 1", resultSummary: "n/a" }));
});
