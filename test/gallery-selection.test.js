import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { buildsResolutionContext } from "../src/web/relationship-resolver.js";
import { projectsGallerySelection } from "../src/gallery/projects-gallery-selection.js";
import { validatesGallerySelection } from "../src/gallery/validates-gallery-artifacts.js";

function basePolicy(workspaceRoot) {
  return {
    policyType: "web-know-workspace.v1",
    roots: [{ rootId: "fixture", path: workspaceRoot }],
    entryExtensions: [".html", ".htm"],
    relatedExtensions: [".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"],
    excludeDirectories: ["node_modules", "dist", ".git"],
    symlinkPolicy: "skip",
    maxFileSizeBytes: 1_000_000,
    expansion: { maxDepth: 6, maxMembers: 200, maxBytes: 20_000_000, maxTimeMs: 30_000 },
  };
}

async function buildsFixtureIndex() {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gallery-selection-"));
  fs.writeFileSync(path.join(workspaceRoot, "a.html"), "<!doctype html><html><head><title>A</title></head><body><h1>A</h1></body></html>", "utf8");
  const policy = basePolicy(workspaceRoot);
  const inventory = await projectsWebSurfaceInventory({ policy });
  const index = await projectsWebSurfaceIndex({ policy, inventory });
  return { workspaceRoot, policy, inventory, index };
}

test("selects a row whose identity resolves and whose entry file is unchanged", async () => {
  const { workspaceRoot, inventory, index } = await buildsFixtureIndex();
  try {
    const resolutionContext = buildsResolutionContext({ inventory });
    const queryResult = {
      result: { value: { commandText: "SELECT documentId, pathId, rootId, relativePath FROM htmlDocuments", columns: ["documentId", "pathId", "rootId", "relativePath"], rows: index.htmlDocuments.map((d) => ({ documentId: d.documentId, pathId: d.pathId, rootId: d.rootId, relativePath: d.relativePath })) } },
    };
    const selection = await projectsGallerySelection({ requestId: "sha256:0000000000000000000000000000000000000000000000000000000000000000", queryResult, index, resolutionContext });
    await validatesGallerySelection(selection);
    assert.equal(selection.selectedCount, 1);
    assert.equal(selection.rejectedCount, 0);
    assert.equal(selection.items[0].disposition, "selected");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("rejects a row with missing identity columns and one with a stale entry file", async () => {
  const { workspaceRoot, inventory, index } = await buildsFixtureIndex();
  try {
    const resolutionContext = buildsResolutionContext({ inventory });
    const realDocument = index.htmlDocuments[0];
    fs.writeFileSync(path.join(workspaceRoot, "a.html"), "<!doctype html><html><head><title>Changed</title></head><body><h1>Changed</h1></body></html>", "utf8");

    const queryResult = {
      result: {
        value: {
          commandText: "SELECT documentId, pathId FROM htmlDocuments",
          columns: ["documentId", "pathId"],
          rows: [
            { documentId: null, pathId: null },
            { documentId: realDocument.documentId, pathId: realDocument.pathId },
          ],
        },
      },
    };
    const selection = await projectsGallerySelection({ requestId: "sha256:0000000000000000000000000000000000000000000000000000000000000000", queryResult, index, resolutionContext });
    assert.equal(selection.items[0].disposition, "rejected-missing-identity");
    assert.equal(selection.items[1].disposition, "rejected-stale-source");
    assert.equal(selection.selectedCount, 0);
    assert.equal(selection.rejectedCount, 2);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
