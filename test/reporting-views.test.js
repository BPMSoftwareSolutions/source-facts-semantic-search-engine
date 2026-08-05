import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportingViewsPath = path.join(repoRoot, "scripts", "sql", "005-create-reporting-views.sql");

test("reporting views stay root-aware when joining executable mechanics to source files", () => {
  const sql = readFileSync(reportingViewsPath, "utf8");
  assert.ok(sql.includes("CREATE OR ALTER VIEW inventory.CurrentSourceFile"));
  assert.ok(sql.includes("ON scan.RootId = root.RootId"));
  assert.ok(sql.includes("AND sourceFile.RootId = scan.RootId"));
  assert.ok(sql.includes("ON f.IndexId = m.IndexId AND f.RootId = m.RootId AND f.RelativePath = m.ModulePath"));
  assert.ok(sql.includes("m.RootId AS SourceRootId"));
  assert.ok(sql.includes("GROUP BY m.IndexId, m.RootId, m.ModulePath, s.Name;"));
});
