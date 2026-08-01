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
import { materializesStaticPreviews } from "../src/gallery/materializes-static-preview.js";

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

async function buildsPlan(workspaceRoot) {
  const policy = basePolicy(workspaceRoot);
  const inventory = await projectsWebSurfaceInventory({ policy });
  const index = await projectsWebSurfaceIndex({ policy, inventory });
  const resolutionContext = buildsResolutionContext({ inventory });
  const queryResult = {
    result: { value: { commandText: "SELECT documentId, pathId, rootId, relativePath FROM htmlDocuments", columns: ["documentId", "pathId", "rootId", "relativePath"], rows: index.htmlDocuments.map((d) => ({ documentId: d.documentId, pathId: d.pathId, rootId: d.rootId, relativePath: d.relativePath })) } },
  };
  const requestId = `sha256:${"3".repeat(64)}`;
  const selection = await projectsGallerySelection({ requestId, queryResult, index, resolutionContext });
  const plan = await plansSurfacePreviews({ selectionId: selection.selectionId, selection, previewPolicyId: "static-no-script.v1", index, resolutionContext });
  return { plan, resolutionContext };
}

test("materializes a static page with its stylesheet and never touches the source root", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-static-"));
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-output-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), [
      "<!doctype html><html><head><link rel=\"stylesheet\" href=\"./app.css\"></head>",
      "<body><h1>Hi</h1></body></html>",
    ].join(""), "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: red; }", "utf8");
    const { plan, resolutionContext } = await buildsPlan(workspaceRoot);

    const sourceStatBefore = fs.statSync(path.join(workspaceRoot, "index.html"));
    const { emittedFiles } = await materializesStaticPreviews({
      plan,
      resolutionContext,
      sourceRootAbsolutePaths: resolutionContext.rootAbsolutePaths,
      outputDirectory,
    });
    const sourceStatAfter = fs.statSync(path.join(workspaceRoot, "index.html"));
    assert.equal(sourceStatBefore.mtimeMs, sourceStatAfter.mtimeMs, "the source file must never be modified");

    assert.ok(emittedFiles.length >= 2, "expected at least the entry html and the stylesheet to be emitted");
    const entryFile = emittedFiles.find((file) => file.path.endsWith("index.html"));
    const materializedHtml = fs.readFileSync(path.join(outputDirectory, entryFile.path), "utf8");
    assert.match(materializedHtml, /href="\.\/files\/[0-9a-f]{64}\/app\.css"/);

    const stylesheetFile = emittedFiles.find((file) => file.path.endsWith("app.css"));
    assert.ok(stylesheetFile, "the local stylesheet must be copied into the preview bundle");
    assert.equal(fs.readFileSync(path.join(outputDirectory, stylesheetFile.path), "utf8"), "body { color: red; }");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

test("strips source scripts and inline event handlers as a defense-in-depth materialization control", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-script-strip-"));
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-script-output-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), [
      "<!doctype html><html><body onload=\"globalThis.executed=true\">",
      "<button onclick=\"globalThis.clicked=true\">Run</button>",
      "<script>globalThis.executed=true</script></body></html>",
    ].join(""), "utf8");
    const { plan, resolutionContext } = await buildsPlan(workspaceRoot);
    assert.equal(plan.items[0].reproductionDisposition, "NOT_EVALUATED_REQUIRES_SCRIPT");

    // The planner fails closed for script-bearing pages. This deliberately coerced
    // plan proves the materializer still strips executable HTML if an upstream
    // caller is ever wrong about that disposition.
    const defensivePlan = {
      ...plan,
      items: [{
        ...plan.items[0],
        reproductionDisposition: "STATIC_REPRODUCTION_READY",
        targetRoute: `/preview/${"a".repeat(16)}/index.html`,
      }],
    };
    const result = await materializesStaticPreviews({
      plan: defensivePlan,
      resolutionContext,
      sourceRootAbsolutePaths: resolutionContext.rootAbsolutePaths,
      outputDirectory,
    });
    const entryFile = result.emittedFiles.find((file) => file.path.endsWith("index.html"));
    const materializedHtml = fs.readFileSync(path.join(outputDirectory, entryFile.path), "utf8");
    assert.equal(materializedHtml.includes("<script"), false);
    assert.equal(materializedHtml.includes("globalThis.executed"), false);
    assert.equal(materializedHtml.includes("onclick"), false);
    assert.ok(result.transformationsByItem[0].transformations.some((item) => item.kind === "script-removed"));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

test("fails closed when the entry changes after planning", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-stale-"));
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-stale-output-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><body><h1>Before</h1></body></html>", "utf8");
    const { plan, resolutionContext } = await buildsPlan(workspaceRoot);
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><body><h1>After</h1></body></html>", "utf8");
    await assert.rejects(() => materializesStaticPreviews({
      plan,
      resolutionContext,
      sourceRootAbsolutePaths: resolutionContext.rootAbsolutePaths,
      outputDirectory,
    }), /changed after planning/);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});

test("refuses to materialize into a configured source root", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "materializer-escape-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<!doctype html><html><body><h1>Hi</h1></body></html>", "utf8");
    const { plan, resolutionContext } = await buildsPlan(workspaceRoot);

    await assert.rejects(() => materializesStaticPreviews({
      plan,
      resolutionContext,
      sourceRootAbsolutePaths: resolutionContext.rootAbsolutePaths,
      outputDirectory: path.join(workspaceRoot, "gallery-output"),
    }));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
