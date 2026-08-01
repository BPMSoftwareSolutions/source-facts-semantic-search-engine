import assert from "node:assert/strict";
import test from "node:test";
import { projectsCssStylesheet } from "../src/web/css-projector.js";

function project(text, overrides = {}) {
  return projectsCssStylesheet({
    stylesheetId: "stylesheet1234",
    origin: "file",
    pathId: "pathid1234",
    relativePath: "app.css",
    contentHash: "sha256:0000000000000000000000000000000000000000000000000000000000000",
    modulePath: "app.css",
    text,
    ...overrides,
  });
}

function byReferenceId(sourceReferences) {
  return new Map(sourceReferences.map((reference) => [reference.referenceId, reference]));
}

test("extracts rules, declarations, custom properties, and !important", () => {
  const css = [
    ":root {",
    "  --surface: #07111f;",
    "  color: red !important;",
    "}",
  ].join("\n");
  const result = project(css);

  assert.equal(result.rules.length, 1);
  assert.equal(result.rules[0].ruleKind, "style-rule");
  assert.equal(result.rules[0].prelude, ":root");
  assert.equal(result.declarations.length, 2);

  const custom = result.declarations.find((declaration) => declaration.propertyName === "--surface");
  assert.equal(custom.isCustomProperty, true);
  assert.equal(custom.value, "#07111f");

  const color = result.declarations.find((declaration) => declaration.propertyName === "color");
  assert.equal(color.important, true);
  assert.equal(color.value, "red");

  const referenceById = byReferenceId(result.sourceReferences);
  for (const declaration of result.declarations) {
    const [, start, length] = /:(\d+):(\d+)$/u.exec(declaration.sourceReferenceId);
    const slice = css.slice(Number(start), Number(start) + Number(length));
    assert.equal(slice.startsWith(declaration.propertyName), true);
    assert.ok(referenceById.has(declaration.sourceReferenceId));
  }
});

test("nests rules inside @media and links parentRuleId", () => {
  const css = [
    "@media (min-width: 40em) {",
    "  .card { padding: 1rem; }",
    "}",
  ].join("\n");
  const result = project(css);

  const mediaRule = result.rules.find((rule) => rule.ruleKind === "at-rule" && rule.atKeyword === "media");
  assert.ok(mediaRule);
  const cardRule = result.rules.find((rule) => rule.ruleKind === "style-rule");
  assert.equal(cardRule.parentRuleId, mediaRule.ruleId);
  assert.equal(result.declarations[0].ruleId, cardRule.ruleId);
});

test("extracts css-import edges from both string and url() forms", () => {
  const css = '@import "reset.css";\n@import url(theme.css) screen;\n';
  const result = project(css);
  const importTargets = result.rawReferences
    .filter((reference) => reference.edgeKind === "css-import")
    .map((reference) => reference.candidateTarget);
  assert.deepEqual(importTargets.sort(), ["reset.css", "theme.css"]);
});

test("extracts css-url edges from declaration values", () => {
  const css = '.hero { background: url("./bg.png") no-repeat; }';
  const result = project(css);
  const urlTargets = result.rawReferences.filter((reference) => reference.edgeKind === "css-url").map((reference) => reference.candidateTarget);
  assert.deepEqual(urlTargets, ["./bg.png"]);
});

test("reports diagnostics for unterminated blocks and strings without throwing", () => {
  const unterminatedBlock = ".a { color: red;";
  const blockResult = project(unterminatedBlock);
  assert.equal(blockResult.diagnostics.some((diagnostic) => diagnostic.kind === "unterminated-block"), true);

  const unterminatedString = '.a { background: url("never-closed.png); }';
  const stringResult = project(unterminatedString);
  assert.equal(stringResult.diagnostics.some((diagnostic) => diagnostic.kind === "unterminated-string"), true);
});

test("translates positions correctly for inline stylesheets embedded in a host HTML document", () => {
  const hostText = "<html><body>\n<style>\n.a { color: red; }\n</style>\n</body></html>";
  const inlineStart = hostText.indexOf(".a");
  const inlineText = ".a { color: red; }";
  const result = projectsCssStylesheet({
    stylesheetId: "inline-stylesheet",
    origin: "inline",
    hostDocumentId: "doc123",
    contentHash: "sha256:0000000000000000000000000000000000000000000000000000000000000",
    modulePath: "index.html",
    text: inlineText,
    hostText,
    baseOffset: { start: inlineStart, line: 3, column: 1 },
  });
  assert.equal(result.rules.length, 1);
  const referenceById = byReferenceId(result.sourceReferences);
  const rule = referenceById.get(result.rules[0].sourceReferenceId);
  assert.equal(rule.modulePath, "index.html");
  assert.equal(rule.startLine, 3);
  assert.equal(rule.startColumn, 1);
  const [, start, length] = /:(\d+):(\d+)$/u.exec(result.rules[0].sourceReferenceId);
  assert.equal(hostText.slice(Number(start), Number(start) + Number(length)), inlineText);
});
