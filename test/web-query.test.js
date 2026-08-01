import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { executesWebRelationalQuery } from "../src/web/web-query.js";

test("queries webFamilies, htmlElements, and webpageClassifications through the SEJ engine", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "web-query-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "pricing.html"), [
      "<!doctype html>",
      "<html><head><title>Pricing plans</title></head>",
      "<body>",
      "<nav><a href=\"/\">Home</a></nav>",
      "<h1>Simple pricing plans for every team</h1>",
      "<p>Subscribe today and choose a subscription tier with flexible billing.</p>",
      "<p>Start a free trial before you subscribe to any plan.</p>",
      "</body></html>",
    ].join("\n"), "utf8");

    const policy = {
      policyType: "web-know-workspace.v1",
      roots: [{ rootId: "fixture", path: workspaceRoot }],
      entryExtensions: [".html", ".htm"],
      relatedExtensions: [".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"],
      excludeDirectories: ["node_modules", "dist", ".git"],
      symlinkPolicy: "skip",
      maxFileSizeBytes: 1_000_000,
      expansion: { maxDepth: 6, maxMembers: 200, maxBytes: 20_000_000, maxTimeMs: 30_000 },
    };
    const index = await projectsWebSurfaceIndex({ policy });

    const families = await executesWebRelationalQuery(index, "SELECT entryRelativePath FROM webFamilies");
    assert.equal(families.disposition, "RELATIONAL_QUERY_EXECUTED");
    assert.equal(families.result.value.rowCount, 1);

    const classifications = await executesWebRelationalQuery(index, "SELECT dimension, value, disposition FROM webpageClassifications");
    assert.equal(classifications.result.value.rows[0].value, "landing-page");

    const headings = await executesWebRelationalQuery(index, "SELECT tag, text FROM htmlElements WHERE kind = 'heading'");
    assert.equal(headings.result.value.rows[0].text, "Simple pricing plans for every team");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
