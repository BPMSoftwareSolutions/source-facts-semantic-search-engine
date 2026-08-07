import assert from "node:assert/strict";
import { test } from "node:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const workspaceRoot = join(__dirname, "..");

test("workspace-file-system.contract.json: root files comply with rootAllowList", () => {
  const allowList = ["LICENSE", "README.md", "package.json", "package-lock.json", ".gitignore"];
  const dotPrefixIgnoreList = [".git", ".gitignore", ".tmp", ".claude", ".codex-live-inference"];

  const rootEntries = readdirSync(workspaceRoot);

  const violations = rootEntries.filter((entry) => {
    // Ignore dot-files and dot-directories (system/config)
    if (entry.startsWith(".")) {
      return dotPrefixIgnoreList.includes(entry) ? false : true;
    }

    // Ignore directories (contracts, src, test, etc.)
    const fullPath = join(workspaceRoot, entry);
    try {
      const stat = readdirSync(fullPath);
      // If it's readable as a directory, it's OK
      return false;
    } catch {
      // It's a file; check against allowList
      return !allowList.includes(entry);
    }
  });

  if (violations.length > 0) {
    assert.fail(
      `Workspace contract violation: rootAllowList policy rejected these files on root:\n` +
      violations.map(v => `  ❌ ${v}`).join("\n") +
      `\n\nContract: ./contracts/workspace-file-system.contract.json\n` +
      `Policy: "unexpectedPaths": { "policy": "reject" }\n` +
      `Allowed: ${allowList.join(", ")}\n\n` +
      `Move to docs/, artifacts/, or evidence/ per contract specification.`
    );
  }

  assert.equal(violations.length, 0, "Workspace file system contract compliance");
});

test("workspace-file-system.contract.json: required directories exist", () => {
  const requiredDirectories = [
    "artifacts",
    "contracts",
    "docs",
    "evidence",
    "features",
    "scripts",
    "source-facts-query-console",
    "src",
    "test",
  ];

  const violations = requiredDirectories.filter((dir) => {
    try {
      readdirSync(join(workspaceRoot, dir));
      return false;
    } catch {
      return true;
    }
  });

  assert.equal(
    violations.length,
    0,
    `Missing required directories per workspace contract: ${violations.join(", ")}`
  );
});

test("workspace-file-system.contract.json: src/governance directory exists", () => {
  try {
    readdirSync(join(workspaceRoot, "src", "governance"));
  } catch {
    assert.fail("src/governance directory required by workspace contract");
  }
});

test("workspace-file-system.contract.json: test directory contains test files", () => {
  const testDir = join(workspaceRoot, "test");
  const testFiles = readdirSync(testDir).filter(
    (f) => f.endsWith(".test.js") || f.endsWith(".test.ts")
  );

  assert(testFiles.length > 0, "test directory must contain .test.js files per workspace contract");
});
