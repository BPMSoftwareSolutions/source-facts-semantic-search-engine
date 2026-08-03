import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const consoleDir = path.join(repoRoot, "src", "console");
const projectedFiles = [
  "console-authority-bundles.mjs",
  "console-routing-adapter.mjs",
  "console-snippet-adapter.mjs",
  "console-validation-adapter.mjs",
  "serves-query-console.conformant.mjs",
  "serves-query-console.mjs",
  "serves-query-console.projected.mjs",
];

test("legacy serves-query-console.js has been retired", () => {
  assert.equal(
    existsSync(path.join(consoleDir, "serves-query-console.js")),
    false,
    "the old JS entrypoint should no longer exist",
  );
});

test("projected console artifacts remain in the workspace", () => {
  for (const fileName of projectedFiles) {
    assert.equal(
      existsSync(path.join(consoleDir, fileName)),
      true,
      `${fileName} should exist as part of the console migration set`,
    );
  }
});
