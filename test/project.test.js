import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { validatesSourceFactIndex } from "../src/validate-index.js";

test("projects schema-valid, source-addressable governance rules", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-json-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "body.mjs"), [
      "export function execute(request) {",
      "  if (request.valid) return JSON.stringify(request);",
      "  throw new Error('invalid');",
      "}",
      "",
    ].join("\n"), "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "profile.json"), JSON.stringify({
      operationAuthorities: {
        bodyPurity: {
          profileType: "semantic-execution-body.v2",
          applicability: "artifacts-bound-to-semantic-authority-executor-port",
          executionPortEffect: "execute-semantic-authority",
          forbiddenExecutableMechanics: ["branch", "serialization"],
          semanticAuthorityLocation: "contract",
        },
      },
    }, null, 2), "utf8");

    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "fixture" });
    await validatesSourceFactIndex(index);
    assert.ok(index.files.every((file) => file.rootId === "fixture"));
    assert.ok(index.bodyMechanics.every((fact) => fact.rootId === "fixture"));
    assert.deepEqual(index.governanceRules.map((rule) => rule.mechanic), ["branch", "serialization"]);
    const referenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
    for (const rule of index.governanceRules) {
      const reference = referenceById.get(rule.sourceReferenceId);
      assert.equal(reference?.modulePath, "profile.json");
      assert.ok(reference.startLine > 1);
      const [, start, length] = /:(\d+):(\d+)$/u.exec(rule.sourceReferenceId);
      const source = fs.readFileSync(path.join(workspaceRoot, "profile.json"), "utf8");
      assert.equal(JSON.parse(source.slice(Number(start), Number(start) + Number(length))), rule.mechanic);
    }
    assert.ok(index.bodyMechanics.some((fact) => fact.mechanic === "branch"));
    assert.ok(index.bodyMechanics.some((fact) => fact.mechanic === "serialization"));
    assert.ok(index.relationships.every((relationship) => {
      if (relationship.fromSymbolId === null) return relationship.fromSymbolResolution === "unresolved";
      const symbol = index.symbols.find((candidate) => candidate.symbolId === relationship.fromSymbolId);
      return relationship.fromSymbolResolution === "enclosing-callable"
        && ["function", "method", "constructor"].includes(symbol?.kind);
    }));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("projects large JSON documents without call-stack overflow", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-json-large-"));
  try {
    const largeReport = {
      records: Array.from({ length: 70000 }, (_, index) => index),
    };
    fs.writeFileSync(path.join(workspaceRoot, "large-report.json"), JSON.stringify(largeReport), "utf8");

    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "large-json-fixture" });
    await validatesSourceFactIndex(index);

    const reportDocumentFacts = index.documents.filter((document) => document.relativePath === "large-report.json");
    assert.ok(reportDocumentFacts.length > 70000);
    assert.ok(reportDocumentFacts.some((documentFact) => documentFact.pointer === "/records"));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("classifies mutation and retry by operator and callee identity without detector self-matches", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-mechanic-fidelity-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "mechanics.mjs"), [
      "export function changes(values, cache) {",
      "  let index = 0;",
      "  index++;",
      "  --index;",
      "  values.push(index);",
      "  cache.set('index', index);",
      "  retry();",
      "  return /retry/u.test('inert text');",
      "}",
      "function retry() {}",
      "",
    ].join("\n"), "utf8");
    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "mechanic-fidelity" });
    const mechanics = index.bodyMechanics.filter((fact) => fact.modulePath === "mechanics.mjs");
    assert.ok(mechanics.filter((fact) => fact.mechanic === "state-mutation").length >= 4);
    assert.equal(mechanics.filter((fact) => fact.mechanic === "retry").length, 1);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("projects text meaning only when an applicable governance rule authorizes the literal classification", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-text-meaning-"));
  try {
    fs.writeFileSync(path.join(workspaceRoot, "governed.mjs"), "export const governed = 'EXECUTE_ME';\n", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "inert.mjs"), "export const inert = 'EXECUTE_ME';\n", "utf8");
    fs.writeFileSync(path.join(workspaceRoot, "profile.json"), JSON.stringify({
      textMeaning: {
        forbiddenExecutableMechanics: ["meaning-hidden-in-text"],
        executionPortEffect: "execute-semantic-authority",
        applicability: "module:governed.mjs",
      },
    }), "utf8");
    const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "text-meaning-fidelity" });
    const textMechanics = index.bodyMechanics.filter((fact) => fact.mechanic === "meaning-hidden-in-text");
    assert.ok(textMechanics.length > 0);
    assert.ok(textMechanics.every((fact) => fact.modulePath === "governed.mjs"));
    assert.equal(index.bodyMechanics.some((fact) => fact.mechanic === "meaning-hidden-in-text" && fact.modulePath === "inert.mjs"), false);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("keeps logical symbol identity across comments, line movement, and body-only changes", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "source-facts-identity-"));
  try {
    const sourcePath = path.join(workspaceRoot, "identity.mjs");
    fs.writeFileSync(sourcePath, "export function calculate(value) {\n  return value + 1;\n}\n", "utf8");
    const first = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "identity-fixture" });
    fs.writeFileSync(sourcePath, "// inserted comment\n\nexport function calculate(value) {\n  const adjusted = value + 2;\n  return adjusted;\n}\n", "utf8");
    const second = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "identity-fixture" });
    const firstSymbol = first.symbols.find((symbol) => symbol.kind === "function" && symbol.name === "calculate");
    const secondSymbol = second.symbols.find((symbol) => symbol.kind === "function" && symbol.name === "calculate");
    assert.equal(firstSymbol?.symbolId, secondSymbol?.symbolId);
    assert.equal(firstSymbol?.symbolVersionId, secondSymbol?.symbolVersionId);
    assert.notEqual(firstSymbol?.moduleHash, secondSymbol?.moduleHash);
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});
