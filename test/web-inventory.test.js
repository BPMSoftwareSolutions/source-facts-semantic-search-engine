import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { validatesWebSurfaceInventory } from "../src/web/validate-web-index.js";

function basePolicy(roots) {
  return {
    policyType: "web-know-workspace.v1",
    roots,
    entryExtensions: [".html", ".htm"],
    relatedExtensions: [".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"],
    excludeDirectories: ["node_modules", "dist", ".git"],
    excludeGlobs: ["**/*.secret.json"],
    generatedGlobs: ["**/generated/**"],
    evidenceSnapshotGlobs: ["**/*.snapshot.html"],
    symlinkPolicy: "skip",
    maxFileSizeBytes: 1024,
    expansion: { maxDepth: 6, maxMembers: 200, maxBytes: 20_000_000, maxTimeMs: 30_000 },
  };
}

test("dispositions every encountered path deterministically", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "web-inventory-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "index.html"), "<html></html>", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "app.css"), "body { color: red; }", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "readme.txt"), "not a web file", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "config.secret.json"), "{}", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "big.js"), "x".repeat(2048), "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "snapshot.snapshot.html"), "<html></html>", "utf8");
    fs.mkdirSync(path.join(workspaceRoot, "node_modules", "left-pad"), { recursive: true });
    fs.writeFileSync(path.join(workspaceRoot, "node_modules", "left-pad", "index.js"), "module.exports = {};", "utf8");
    fs.mkdirSync(path.join(workspaceRoot, "generated"), { recursive: true });
    fs.writeFileSync(path.join(workspaceRoot, "generated", "output.js"), "// generated", "utf8");

    const policy = basePolicy([{ rootId: "fixture", path: workspaceRoot }]);
    const inventory = await projectsWebSurfaceInventory({ policy });
    await validatesWebSurfaceInventory(inventory);

    const byRelativePath = new Map(inventory.entries.map((entry) => [entry.relativePath, entry]));
    assert.equal(byRelativePath.get("index.html")?.disposition, "admitted-entry-candidate");
    assert.equal(byRelativePath.get("app.css")?.disposition, "admitted-related-candidate");
    assert.equal(byRelativePath.get("readme.txt")?.disposition, "unsupported-extension");
    assert.equal(byRelativePath.get("config.secret.json")?.disposition, "excluded-by-policy");
    assert.equal(byRelativePath.get("big.js")?.disposition, "oversized");
    assert.equal(byRelativePath.get("snapshot.snapshot.html")?.disposition, "evidence-snapshot");
    assert.equal(byRelativePath.get("generated/output.js")?.disposition, "generated-observation");
    assert.equal(byRelativePath.has("node_modules/left-pad/index.js"), false, "node_modules must be pruned, not individually dispositioned");

    assert.equal(inventory.entries.length, 7);
    assert.equal(inventory.coverage.totalPaths, 7);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("keeps equal relative paths under different roots distinct and stays byte-stable across repeated runs", async () => {
  const rootA = fs.mkdtempSync(path.join(os.tmpdir(), "web-inventory-a-"));
  const rootB = fs.mkdtempSync(path.join(os.tmpdir(), "web-inventory-b-"));
  try {
    fs.writeFileSync(path.join(rootA, "index.html"), "<html>A</html>", "utf8");
    fs.writeFileSync(path.join(rootB, "index.html"), "<html>B</html>", "utf8");

    const policy = basePolicy([{ rootId: "root-a", path: rootA }, { rootId: "root-b", path: rootB }]);
    const first = await projectsWebSurfaceInventory({ policy });
    const second = await projectsWebSurfaceInventory({ policy });

    assert.equal(first.inventoryId, second.inventoryId);
    assert.equal(first.policyHash, second.policyHash);
    const pathIds = new Set(first.entries.map((entry) => entry.pathId));
    assert.equal(pathIds.size, 2, "identical relative paths under different roots must produce distinct pathIds");
  } finally {
    fs.rmSync(rootA, { recursive: true, force: true });
    fs.rmSync(rootB, { recursive: true, force: true });
  }
});

test("records unreadable and continues instead of throwing", async () => {
  if (process.platform === "win32") return;
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "web-inventory-unreadable-"));
  try {
    const blockedPath = path.join(workspaceRoot, "blocked.html");
    fs.writeFileSync(blockedPath, "<html></html>", "utf8");
    fs.chmodSync(blockedPath, 0o000);
    fs.writeFileSync(path.join(workspaceRoot, "ok.html"), "<html></html>", "utf8");

    const policy = basePolicy([{ rootId: "fixture", path: workspaceRoot }]);
    const inventory = await projectsWebSurfaceInventory({ policy });
    const byRelativePath = new Map(inventory.entries.map((entry) => [entry.relativePath, entry]));
    assert.equal(byRelativePath.get("blocked.html")?.disposition, "unreadable");
    assert.equal(byRelativePath.get("ok.html")?.disposition, "admitted-entry-candidate");
  } finally {
    fs.chmodSync(path.join(workspaceRoot, "blocked.html"), 0o644);
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
