import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { validatesSourceFactIndex } from "../src/validate-index.js";

test("projects assignment, return, and argument dataflow facts with binding classification", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dataflow-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "body.mjs"), [
      "function execute(request) {",
      "  const normalized = request;",
      "  outer = normalized;",
      "  log(normalized);",
      "  return normalized;",
      "}",
      "",
    ].join("\n"), "utf8");

    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "dataflow-fixture" });
    await validatesSourceFactIndex(index);

    const byKind = (kind) => index.dataflows.filter((row) => row.dataflowKind === kind);
    assert.equal(byKind("assignment").length, 2, "expects the const declaration and the bare assignment");
    assert.equal(byKind("return").length, 1);
    assert.equal(byKind("argument").length, 1);

    const declarationAssignment = byKind("assignment").find((row) => row.toCandidate === "normalized");
    assert.equal(declarationAssignment.toBindingKind, "local-declaration");
    assert.equal(declarationAssignment.fromCandidate, "request");
    assert.equal(declarationAssignment.fromBindingKind, "parameter");
    assert.equal(declarationAssignment.enclosingSymbolResolution, "enclosing-callable");
    assert.ok(declarationAssignment.enclosingSymbolId);

    const outerAssignment = byKind("assignment").find((row) => row.toCandidate === "outer");
    assert.equal(outerAssignment.toBindingKind, "unresolved", "outer is not declared anywhere in scope");
    assert.equal(outerAssignment.fromCandidate, "normalized");
    assert.equal(outerAssignment.fromBindingKind, "local-declaration");

    const returnRow = byKind("return")[0];
    assert.equal(returnRow.fromCandidate, "normalized");
    assert.equal(returnRow.fromBindingKind, "local-declaration");
    assert.equal(returnRow.toRole, "return");

    const argumentRow = byKind("argument")[0];
    assert.equal(argumentRow.fromCandidate, "normalized");
    assert.equal(argumentRow.calleeCandidate, "log");
    assert.equal(argumentRow.argumentIndex, 0);

    const referenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
    for (const row of index.dataflows) {
      const reference = referenceById.get(row.sourceReferenceId);
      assert.ok(reference !== undefined, `dataflow row ${row.dataflowId} must cite a real source reference`);
      assert.equal(reference.modulePath, "body.mjs");
    }
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test("leaves member-expression assignment targets textual and unresolved", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dataflow-member-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "state.mjs"), [
      "function update(context) {",
      "  context.value = 42;",
      "}",
      "",
    ].join("\n"), "utf8");

    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "dataflow-member-fixture" });
    const assignment = index.dataflows.find((row) => row.dataflowKind === "assignment");
    assert.equal(assignment.toCandidate, "context.value");
    assert.equal(assignment.toBindingKind, "unresolved");
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
  }
});
