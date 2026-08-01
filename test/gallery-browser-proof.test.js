import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { writesGalleryProjection } from "../src/gallery/projects-gallery.js";
import { capturesBrowserRenders } from "../src/gallery/captures-browser-render.js";
import { servesIsolatedPreviews } from "../src/gallery/serves-isolated-previews.js";

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

test("serves only materialized previews with restrictive headers and captures an isolated Chromium receipt", async (t) => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gallery-browser-source-"));
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "gallery-browser-output-"));
  let previewServer;
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), [
      "<!doctype html><html><head><title>Negative controls</title><link rel=\"stylesheet\" href=\"./app.css\"></head>",
      "<body><h1>Safe preview</h1><img src=\"https://external.example/x.png\" alt=\"blocked external image\">",
      "<form action=\"https://external.example/submit\"><button>Submit</button></form></body></html>",
    ].join(""), "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: rgb(23, 32, 51); }", "utf8");
    const policy = basePolicy(workspaceRoot);
    const inventory = await projectsWebSurfaceInventory({ policy });
    const index = await projectsWebSurfaceIndex({ policy, inventory });
    const projected = await writesGalleryProjection({ index, inventory, queryId: "enterprise-pages", outputDirectory });
    assert.equal(projected.manifest.items[0].previewDisposition, "PARTIAL_STATIC_REPRODUCTION");

    previewServer = await servesIsolatedPreviews({ outputDirectory, previewPolicy: projected.previewPolicy });
    const galleryResponse = await fetch(previewServer.url);
    assert.equal(galleryResponse.status, 200);
    assert.match(await galleryResponse.text(), /Enterprise Surface Explorer/);
    assert.match(galleryResponse.headers.get("content-security-policy"), /default-src 'none'/);
    const previewResponse = await fetch(new URL(projected.manifest.items[0].previewRoute, previewServer.url));
    assert.equal(previewResponse.status, 200);
    assert.match(previewResponse.headers.get("content-security-policy"), /default-src 'none'/);
    assert.match(previewResponse.headers.get("content-security-policy"), /sandbox allow-same-origin/);
    assert.equal((await fetch(`${previewServer.url}/preview/../../package.json`)).status, 404);
    assert.equal((await fetch(`${previewServer.url}/enterprise-gallery-manifest.json`)).status, 404);
    assert.equal((await fetch(new URL(projected.manifest.items[0].previewRoute, previewServer.url), { method: "POST" })).status, 405);

    const proof = await capturesBrowserRenders({
      manifest: projected.manifest,
      plan: projected.plan,
      outputDirectory,
      baseUrl: previewServer.url,
      previewPolicy: projected.previewPolicy,
      cspPolicy: previewServer.cspPolicy,
    });
    if (!proof.browserAvailable) {
      t.skip("Chromium is not launchable in this environment; NOT_EVALUATED receipt was emitted.");
      return;
    }

    assert.equal(proof.receipts.length, 1);
    const receipt = proof.receipts[0];
    assert.equal(receipt.verdict, "RENDERED_WITH_LIMITATIONS");
    assert.ok(receipt.requestsAttempted.some((request) => request.url === "https://external.example/x.png" && request.disposition === "blocked"));
    assert.ok(receipt.requestsAttempted.some((request) => request.url === "https://external.example/submit" && request.disposition === "blocked"));
    assert.ok(receipt.domAssertions.every((assertion) => assertion.passed));
    assert.match(receipt.ariaSnapshotDigest, /^sha256:[0-9a-f]{64}$/);
    assert.match(receipt.screenshotDigest, /^sha256:[0-9a-f]{64}$/);
    assert.ok(proof.emittedFiles.some((file) => file.path.endsWith(".png")));
    assert.ok(proof.emittedFiles.some((file) => file.path.endsWith(".aria.yml")));
  } finally {
    if (previewServer !== undefined) await previewServer.close();
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});
