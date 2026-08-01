import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { validatesWebSurfaceIndex } from "../src/web/validate-web-index.js";

function basePolicy(workspaceRoot, expansionOverrides = {}) {
  return {
    policyType: "web-know-workspace.v1",
    roots: [{ rootId: "fixture", path: workspaceRoot }],
    entryExtensions: [".html", ".htm"],
    relatedExtensions: [".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"],
    excludeDirectories: ["node_modules", "dist", ".git"],
    symlinkPolicy: "skip",
    maxFileSizeBytes: 1_000_000,
    expansion: { maxDepth: 6, maxMembers: 200, maxBytes: 20_000_000, maxTimeMs: 30_000, ...expansionOverrides },
  };
}

function buildsFixture() {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "web-project-"));
  fs.writeFileSync(path.join(workspaceRoot, "index.html"), [
    "<!doctype html>",
    "<html><head><link rel=\"stylesheet\" href=\"./app.css\"></head>",
    "<body>",
    "<a href=\"https://example.com\">external</a>",
    "<a href=\"./missing.html\">missing-nav</a>",
    "<script src=\"./app.js\"></script>",
    "<script src=\"./missing.js\"></script>",
    "</body></html>",
  ].join("\n"), "utf8");
  fs.writeFileSync(path.join(workspaceRoot, "app.css"), [
    "@import \"./base.css\";",
    ".hero { background: url(\"./missing-icon.png\"); }",
  ].join("\n"), "utf8");
  fs.writeFileSync(path.join(workspaceRoot, "base.css"), ".base { color: blue; }", "utf8");
  fs.writeFileSync(path.join(workspaceRoot, "app.js"), [
    "import \"./util.js\";",
    "import data from \"./data.json\";",
  ].join("\n"), "utf8");
  fs.writeFileSync(path.join(workspaceRoot, "util.js"), "import \"./app.js\";", "utf8");
  fs.writeFileSync(path.join(workspaceRoot, "data.json"), "{}", "utf8");
  return workspaceRoot;
}

test("projects a schema-valid web-surface-index end to end with correct family expansion", async () => {
  const workspaceRoot = buildsFixture();
  try {
    const policy = basePolicy(workspaceRoot);
    const index = await projectsWebSurfaceIndex({ policy });
    await validatesWebSurfaceIndex(index);

    assert.equal(index.htmlDocuments.length, 1);
    assert.equal(index.cssStylesheets.length, 2);
    assert.equal(index.webFamilies.length, 1);

    const family = index.webFamilies[0];
    assert.equal(family.members.length, 6, `expected 6 members, got: ${JSON.stringify(family.members)}`);
    assert.equal(family.truncated, false);

    const relationshipsById = new Map(index.webRelationships.map((relationship) => [relationship.relationshipId, relationship]));
    const resolvedEdgeKinds = family.resolvedEdgeIds.map((id) => relationshipsById.get(id).edgeKind).sort();
    assert.deepEqual(resolvedEdgeKinds, [
      "css-import",
      "html-script-src",
      "html-stylesheet-href",
      "js-json-import",
      "js-static-import",
      "js-static-import",
    ].sort());

    const unresolvedEdges = family.unresolvedEdgeIds.map((id) => relationshipsById.get(id));
    const unresolvedByDisposition = unresolvedEdges.map((edge) => edge.resolutionDisposition).sort();
    assert.deepEqual(unresolvedByDisposition, ["external-url", "missing-local-target", "missing-local-target", "missing-local-target"].sort());

    const jsonImport = index.webRelationships.find((relationship) => relationship.edgeKind === "js-json-import");
    assert.ok(jsonImport, "data.json import must be reclassified to js-json-import");

    const cycleEdge = index.webRelationships.find((relationship) =>
      relationship.edgeKind === "js-static-import" && relationship.candidateTarget === "./app.js");
    assert.equal(cycleEdge.resolutionDisposition, "resolved-local", "the cycle back to app.js must still resolve");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("respects maxDepth and stops expanding before transitive members", async () => {
  const workspaceRoot = buildsFixture();
  try {
    const policy = basePolicy(workspaceRoot, { maxDepth: 1 });
    const index = await projectsWebSurfaceIndex({ policy });
    const family = index.webFamilies[0];
    assert.equal(family.members.length, 3, `expected only entry + direct deps, got: ${JSON.stringify(family.members)}`);
    assert.deepEqual(family.members.map((member) => member.depth).sort(), [0, 1, 1]);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("indexId is stable across repeated projections of the same workspace", async () => {
  const workspaceRoot = buildsFixture();
  try {
    const policy = basePolicy(workspaceRoot);
    const first = await projectsWebSurfaceIndex({ policy });
    const second = await projectsWebSurfaceIndex({ policy });
    assert.equal(first.indexId, second.indexId);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
