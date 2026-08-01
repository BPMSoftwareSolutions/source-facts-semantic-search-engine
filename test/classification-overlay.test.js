import assert from "node:assert/strict";
import test from "node:test";
import { projectsHtmlDocument } from "../src/web/html-projector.js";
import { classifiesHtmlDocument } from "../src/web/classification-overlay.js";

function classifies(relativePath, html) {
  const projected = projectsHtmlDocument({
    pathId: "pathid1234",
    rootId: "root",
    relativePath,
    contentHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    text: html,
  });
  return classifiesHtmlDocument({ document: projected.document, elements: projected.elements });
}

test("resolves a page-type classification with real cited evidence for a pricing/landing page", async () => {
  const html = [
    "<!doctype html>",
    "<html><head><title>Pricing plans</title></head>",
    "<body>",
    "<nav><a href=\"/\">Home</a></nav>",
    "<h1>Simple pricing plans for every team</h1>",
    "<p>Subscribe today and choose a subscription tier with flexible billing.</p>",
    "<p>Start a free trial before you subscribe to any plan.</p>",
    "</body></html>",
  ].join("\n");

  const classification = await classifies("pricing.html", html);
  assert.equal(classification.dimension, "page-type");
  assert.equal(classification.taxonomyId, "page-types.v1");
  assert.equal(classification.value, "landing-page");
  assert.equal(classification.disposition, "RESOLVED");
  assert.ok(classification.supportScore > 0);
  assert.ok(classification.evidenceReferences.length > 0, "a resolved classification must cite real evidence");
  for (const reference of classification.evidenceReferences) {
    assert.match(reference, /^pricing\.html:\d+:\d+$/u, "evidence references must be our own byte-exact source references, not a foreign identity scheme");
  }
});

test("abstains instead of guessing when there is insufficient evidence", async () => {
  const html = "<!doctype html><html><head><title>Random notes</title></head><body><h1>Random notes</h1><p>Nothing in particular here.</p></body></html>";
  const classification = await classifies("notes.html", html);
  assert.equal(classification.value, null);
  assert.equal(classification.disposition, "UNRESOLVED_INSUFFICIENT_EVIDENCE");
  assert.deepEqual(classification.evidenceReferences, []);
});
