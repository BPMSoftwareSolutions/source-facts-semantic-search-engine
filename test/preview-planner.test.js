import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { buildsResolutionContext } from "../src/web/relationship-resolver.js";
import { projectsGallerySelection } from "../src/gallery/projects-gallery-selection.js";
import { plansSurfacePreviews } from "../src/gallery/plans-surface-previews.js";
import { validatesSurfacePreviewPlan } from "../src/gallery/validates-gallery-artifacts.js";

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

async function plansFor(workspaceRoot) {
  const policy = basePolicy(workspaceRoot);
  const inventory = await projectsWebSurfaceInventory({ policy });
  const index = await projectsWebSurfaceIndex({ policy, inventory });
  const resolutionContext = buildsResolutionContext({ inventory });
  const queryResult = {
    result: { value: { commandText: "SELECT documentId, pathId, rootId, relativePath FROM htmlDocuments", columns: ["documentId", "pathId", "rootId", "relativePath"], rows: index.htmlDocuments.map((d) => ({ documentId: d.documentId, pathId: d.pathId, rootId: d.rootId, relativePath: d.relativePath })) } },
  };
  const requestId = `sha256:${"1".repeat(64)}`;
  const selection = await projectsGallerySelection({ requestId, queryResult, index, resolutionContext });
  const plan = await plansSurfacePreviews({ selectionId: selection.selectionId, selection, previewPolicyId: "static-no-script.v1", index, resolutionContext });
  await validatesSurfacePreviewPlan(plan);
  return { plan, index };
}

test("a page with only local CSS is STATIC_REPRODUCTION_READY", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-static-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><head><link rel=\"stylesheet\" href=\"./app.css\"></head><body><h1>Hi</h1></body></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: red; }", "utf8");
    const { plan } = await plansFor(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "STATIC_REPRODUCTION_READY");
    assert.ok(plan.items[0].targetRoute.startsWith("/preview/"));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("a page with a script is NOT_EVALUATED_REQUIRES_SCRIPT under the static-no-script policy", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-script-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><body><script src=\"./app.js\"></script></body></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.js"), "console.log('hi');", "utf8");
    const { plan } = await plansFor(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "NOT_EVALUATED_REQUIRES_SCRIPT");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("a JSON-LD data block is removable structured data, not an executable-script requirement", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-jsonld-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><head><script type=\"application/ld+json\">{\"@type\":\"WebSite\"}</script></head><body><h1>Hi</h1></body></html>", "utf8");
    const { plan } = await plansFor(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "STATIC_REPRODUCTION_READY");
    assert.ok(plan.items[0].transformations.some((transformation) => transformation.kind === "script-removed"));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("unresolved navigation links do not reduce static visual reproduction fidelity", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-navigation-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><body><a href=\"/contact\">Contact</a><h1>Hi</h1></body></html>", "utf8");
    const { plan } = await plansFor(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "STATIC_REPRODUCTION_READY");
    assert.equal(plan.items[0].unresolvedEdgeCount, 0);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("a page with a missing local dependency is PARTIAL_STATIC_REPRODUCTION", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-missing-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><head><link rel=\"stylesheet\" href=\"./missing.css\"></head><body><h1>Hi</h1></body></html>", "utf8");
    const { plan } = await plansFor(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "PARTIAL_STATIC_REPRODUCTION");
    assert.ok(plan.items[0].unresolvedEdgeCount > 0);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("a family member that changes on disk after selection is BLOCKED_STALE_SOURCE at planning time", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "preview-planner-stale-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><head><link rel=\"stylesheet\" href=\"./app.css\"></head><body><h1>Hi</h1></body></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: red; }", "utf8");

    const policy = basePolicy(workspaceRoot);
    const inventory = await projectsWebSurfaceInventory({ policy });
    const index = await projectsWebSurfaceIndex({ policy, inventory });
    const resolutionContext = buildsResolutionContext({ inventory });

    // mutate the stylesheet after the index was projected but before planning re-verifies it.
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: blue; }", "utf8");

    const queryResult = {
      result: { value: { commandText: "SELECT documentId, pathId, rootId, relativePath FROM htmlDocuments", columns: ["documentId", "pathId", "rootId", "relativePath"], rows: index.htmlDocuments.map((d) => ({ documentId: d.documentId, pathId: d.pathId, rootId: d.rootId, relativePath: d.relativePath })) } },
    };
    const requestId = `sha256:${"2".repeat(64)}`;
    const selection = await projectsGallerySelection({ requestId, queryResult, index, resolutionContext });
    assert.equal(selection.items[0].disposition, "selected", "the entry HTML itself did not change, only its dependency");

    const plan = await plansSurfacePreviews({ selectionId: selection.selectionId, selection, previewPolicyId: "static-no-script.v1", index, resolutionContext });
    assert.equal(plan.items[0].reproductionDisposition, "BLOCKED_STALE_SOURCE");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
