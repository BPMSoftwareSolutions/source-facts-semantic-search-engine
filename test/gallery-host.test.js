import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { projectsGalleryHost } from "../src/gallery/projects-gallery-host.js";
import { writesGalleryProjection } from "../src/gallery/projects-gallery.js";

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

test("projects a deterministic script-free host and receipt while retaining every query row", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gallery-host-source-"));
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "gallery-host-output-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "one.html"), "<!doctype html><html><head><title>One</title><link rel=\"stylesheet\" href=\"./app.css\"></head><body><h1>One</h1></body></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "two.html"), "<!doctype html><html><head><title>Two</title></head><body><script src=\"./app.js\"></script></body></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: navy; }", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.js"), "globalThis.sourceScriptExecuted = true;", "utf8");
    const policy = basePolicy(workspaceRoot);
    const inventory = await projectsWebSurfaceInventory({ policy });
    const index = await projectsWebSurfaceIndex({ policy, inventory });

    const first = await writesGalleryProjection({ index, inventory, queryId: "enterprise-pages", outputDirectory });
    const firstManifestBytes = fs.readFileSync(path.join(outputDirectory, "enterprise-gallery-manifest.json"));
    const firstHostBytes = fs.readFileSync(path.join(outputDirectory, "gallery-host.html"));
    const second = await writesGalleryProjection({ index, inventory, queryId: "enterprise-pages", outputDirectory });

    assert.equal(first.selection.items.length, 2);
    assert.equal(first.selection.selectedCount + first.selection.rejectedCount, 2);
    assert.equal(first.manifest.items.length, 2);
    assert.equal(first.receipt.rowCounts.input, 2);
    assert.deepEqual(first.receipt.rowCounts, { input: 2, selected: 2, rejected: 0 });
    assert.equal(first.receipt.deterministicHash, second.receipt.deterministicHash);
    assert.deepEqual(firstManifestBytes, fs.readFileSync(path.join(outputDirectory, "enterprise-gallery-manifest.json")));
    assert.deepEqual(firstHostBytes, fs.readFileSync(path.join(outputDirectory, "gallery-host.html")));

    const host = firstHostBytes.toString("utf8");
    assert.equal(/<script\b/i.test(host), false);
    assert.equal(host.includes(workspaceRoot), false);
    assert.match(host, /Open restricted preview/);
    assert.match(host, /No executable preview admitted/);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

test("renders a valid deterministic empty gallery host", () => {
  const manifest = {
    manifestType: "enterprise-gallery-manifest.v1",
    manifestId: `sha256:${"0".repeat(64)}`,
    requestId: `sha256:${"1".repeat(64)}`,
    selectionId: `sha256:${"2".repeat(64)}`,
    planId: `sha256:${"3".repeat(64)}`,
    items: [],
  };
  const first = projectsGalleryHost({ manifest });
  const second = projectsGalleryHost({ manifest });
  assert.equal(first, second);
  assert.match(first, /No matching surfaces/);
  assert.equal(/<script\b/i.test(first), false);
});
