import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { executeRelationalQuery } from "../src/query.js";

const consoleWorkspaceRoot = path.resolve(process.cwd(), "src", "console");
const targetModulePaths = new Set([
  "console-authority-bundles.mjs",
  "console-routing-adapter.mjs",
  "console-snippet-adapter.mjs",
  "console-validation-adapter.mjs",
  "serves-query-console.conformant.mjs",
  "serves-query-console.mjs",
  "serves-query-console.projected.mjs",
]);

const forbiddenMechanics = new Set([
  "branch",
  "iteration",
  "exception-handling",
  "throw",
  "object-construction",
  "serialization",
  "normalization",
  "validation",
  "fallback",
  "retry",
  "state-mutation",
  "meaning-hidden-in-text",
]);

async function buildsConsoleIndex() {
  return await projectSourceFactsWorkspace({
    workspaceRoot: consoleWorkspaceRoot,
    workspaceId: "console-conformance-scan",
  });
}

async function queriesBodyMechanics(index) {
  const receipt = await executeRelationalQuery(
    index,
    [
      "SELECT bm.mechanic AS mechanic,",
      "       bm.modulePath AS modulePath,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       sym.name AS symbolName",
      "FROM bodyMechanics bm",
      "JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId",
      "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId",
    ].join(" "),
  );

  assert.equal(
    receipt.disposition,
    "RELATIONAL_QUERY_EXECUTED",
    `Query tool failed while scanning console mechanics: ${JSON.stringify(receipt, null, 2)}`,
  );

  return receipt.result.value.rows;
}

function compareRows(a, b) {
  return a.modulePath.localeCompare(b.modulePath)
    || a.mechanic.localeCompare(b.mechanic)
    || a.startLine - b.startLine
    || a.endLine - b.endLine
    || (a.symbolName ?? "").localeCompare(b.symbolName ?? "");
}

function compareMechanics(a, b) {
  return a[0].localeCompare(b[0]);
}

function formatLineRange(row) {
  const endLine = row.endLine ?? row.startLine;
  const range = row.startLine === endLine ? `L${row.startLine}` : `L${row.startLine}-L${endLine}`;
  return row.symbolName ? `${range} in ${row.symbolName}` : range;
}

function buildRedSignalReport(violations) {
  if (violations.length === 0) {
    return "Query-tool conformance scan found no forbidden mechanics.";
  }

  const byFile = new Map();
  for (const row of [...violations].sort(compareRows)) {
    const fileEntry = byFile.get(row.modulePath) ?? {
      modulePath: row.modulePath,
      mechanics: new Map(),
    };
    const mechanicRows = fileEntry.mechanics.get(row.mechanic) ?? [];
    mechanicRows.push(row);
    fileEntry.mechanics.set(row.mechanic, mechanicRows);
    byFile.set(row.modulePath, fileEntry);
  }

  const lines = [
    `Query-tool conformance scan found ${violations.length} forbidden mechanic hit(s):`,
  ];

  for (const fileEntry of [...byFile.values()].sort((a, b) => a.modulePath.localeCompare(b.modulePath))) {
    lines.push("");
    lines.push(`[RED] ${path.resolve(consoleWorkspaceRoot, fileEntry.modulePath)}`);
    for (const [mechanic, mechanicRows] of [...fileEntry.mechanics.entries()].sort(compareMechanics)) {
      lines.push(`  - ${mechanic} (${mechanicRows.length})`);
      for (const row of mechanicRows) {
        lines.push(`    - ${formatLineRange(row)}`);
      }
    }
  }

  return lines.join("\n");
}

test("query tool flags forbidden console mechanics with line-accurate red signals", async () => {
  const index = await buildsConsoleIndex();
  const rows = await queriesBodyMechanics(index);

  const observedTargets = new Set();
  const violations = [];

  for (const row of rows) {
    if (!targetModulePaths.has(row.modulePath)) {
      continue;
    }

    observedTargets.add(row.modulePath);
    if (forbiddenMechanics.has(row.mechanic)) {
      violations.push(row);
    }
  }

  for (const targetModulePath of targetModulePaths) {
    assert.ok(
      observedTargets.has(targetModulePath),
      `Query scan did not observe any body mechanics for ${path.resolve(consoleWorkspaceRoot, targetModulePath)}`,
    );
  }

  const report = buildRedSignalReport(violations);
  if (violations.length > 0) {
    console.error(report);
  }

  assert.equal(violations.length, 0, report);
});
