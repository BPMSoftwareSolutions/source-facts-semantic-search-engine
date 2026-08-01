import assert from "node:assert/strict";
import test from "node:test";
import { projectsJsxOrTsFile } from "../src/web/jsx-projector.js";

test("projects a nested component tree with intrinsic/component classification and byte-exact refs", () => {
  const text = [
    "import { Button } from \"./button.jsx\";",
    "",
    "export function Card({ title }) {",
    "  return (",
    "    <div className=\"card\">",
    "      <h2>{title}</h2>",
    "      <Button disabled onClick={handleClick}>Go</Button>",
    "    </div>",
    "  );",
    "}",
    "",
  ].join("\n");

  const result = projectsJsxOrTsFile({ pathId: "pathid1234", relativePath: "Card.jsx", text });

  const byTag = (tagName) => result.jsxElements.find((element) => element.tagName === tagName);
  const div = byTag("div");
  const h2 = byTag("h2");
  const button = byTag("Button");

  assert.equal(div.tagKind, "intrinsic");
  assert.equal(div.parentJsxElementId, null);
  assert.equal(div.depth, 0);

  assert.equal(h2.tagKind, "intrinsic");
  assert.equal(h2.parentJsxElementId, div.jsxElementId);
  assert.equal(h2.depth, 1);

  assert.equal(button.tagKind, "component");
  assert.equal(button.parentJsxElementId, div.jsxElementId);
  assert.deepEqual(
    button.attributes.map((attribute) => ({ name: attribute.name, valueKind: attribute.valueKind, value: attribute.value })),
    [
      { name: "disabled", valueKind: "boolean", value: "true" },
      { name: "onClick", valueKind: "expression", value: "handleClick" },
    ],
  );

  // byte-slice round trip for every element's source reference.
  const referenceById = new Map(result.sourceReferences.map((reference) => [reference.referenceId, reference]));
  for (const element of result.jsxElements) {
    const [, start, length] = /:(\d+):(\d+)$/u.exec(element.sourceReferenceId);
    const slice = text.slice(Number(start), Number(start) + Number(length));
    assert.ok(referenceById.has(element.sourceReferenceId));
    if (element.tagKind !== "fragment") assert.ok(slice.includes(element.tagName));
  }

  const componentReference = result.rawReferences.find((reference) => reference.edgeKind === "jsx-component-reference");
  assert.equal(componentReference.candidateTarget, "./button.jsx");

  const importReference = result.rawReferences.find((reference) => reference.edgeKind === "js-static-import");
  assert.equal(importReference.candidateTarget, "./button.jsx");
});

test("extracts static imports, re-exports, dynamic import, and require from a .ts file without JSX", () => {
  const text = [
    "import { readsConfig } from \"./config.js\";",
    "export { helper } from \"./helper.js\";",
    "const legacy = require(\"./legacy.cjs\");",
    "async function load() {",
    "  const module = await import(\"./lazy.js\");",
    "  return module;",
    "}",
    "",
  ].join("\n");

  const result = projectsJsxOrTsFile({ pathId: "pathid5678", relativePath: "loader.ts", text });
  assert.equal(result.jsxElements.length, 0, "a .ts file must never produce JSX facts");

  const targets = result.rawReferences.map((reference) => `${reference.edgeKind}:${reference.candidateTarget}`).sort();
  assert.deepEqual(targets, [
    "js-dynamic-import-candidate:./lazy.js",
    "js-static-import:./config.js",
    "js-static-import:./helper.js",
    "js-static-import:./legacy.cjs",
  ].sort());
});

test("recognizes JSX fragments and namespaced/dotted component tags", () => {
  const text = [
    "import * as Icons from \"./icons.jsx\";",
    "export function Toolbar() {",
    "  return (",
    "    <>",
    "      <Icons.Save />",
    "    </>",
    "  );",
    "}",
    "",
  ].join("\n");

  const result = projectsJsxOrTsFile({ pathId: "pathid9999", relativePath: "Toolbar.jsx", text });
  const fragment = result.jsxElements.find((element) => element.tagKind === "fragment");
  assert.ok(fragment);
  const dotted = result.jsxElements.find((element) => element.tagName === "Icons.Save");
  assert.equal(dotted.tagKind, "component");
  assert.equal(dotted.parentJsxElementId, fragment.jsxElementId);

  const componentReference = result.rawReferences.find((reference) => reference.edgeKind === "jsx-component-reference");
  assert.equal(componentReference.candidateTarget, "./icons.jsx");
});
