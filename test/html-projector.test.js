import assert from "node:assert/strict";
import test from "node:test";
import { projectsHtmlDocument } from "../src/web/html-projector.js";

function project(text, overrides = {}) {
  return projectsHtmlDocument({
    pathId: "pathid1234",
    rootId: "root",
    relativePath: "index.html",
    contentHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    text,
    ...overrides,
  });
}

function byReferenceId(sourceReferences) {
  return new Map(sourceReferences.map((reference) => [reference.referenceId, reference]));
}

test("extracts document metadata, form controls, links, and stylesheet/script refs", () => {
  const html = [
    "<!doctype html>",
    "<html lang=\"en\">",
    "<head><title>Sign in</title>",
    "<link rel=\"stylesheet\" href=\"./app.css\">",
    "</head>",
    "<body>",
    "<nav role=\"navigation\"><a href=\"/pricing\">Pricing</a></nav>",
    "<main>",
    "<h1>Welcome</h1>",
    "<p>Sign in to continue to your dashboard.</p>",
    "<form id=\"login\" action=\"/login\" method=\"post\">",
    "<label for=\"email\">Email</label>",
    "<input id=\"email\" type=\"email\" required>",
    "<button type=\"submit\">Sign in</button>",
    "</form>",
    "<img src=\"logo.svg\" srcset=\"logo.svg 1x, logo@2x.svg 2x\" alt=\"logo\">",
    "</main>",
    "<script type=\"module\" src=\"./app.mjs\"></script>",
    "</body></html>",
  ].join("\n");

  const result = project(html);

  assert.equal(result.document.doctype, "html");
  assert.equal(result.document.lang, "en");
  assert.equal(result.document.title, "Sign in");

  const byKind = (kind) => result.elements.filter((element) => element.kind === kind);
  assert.equal(byKind("landmark").length, 2, "expected the nav (role=navigation) and main landmarks");
  assert.equal(byKind("form").length, 1);
  assert.equal(byKind("control").length, 2);
  assert.equal(byKind("link").length, 1);
  assert.equal(byKind("image").length, 1);
  assert.equal(byKind("heading")[0].text, "Welcome");
  assert.equal(byKind("paragraph")[0].text, "Sign in to continue to your dashboard.");

  const label = byKind("label")[0];
  assert.deepEqual(label.idRefs, [{ attribute: "for", targetId: "email" }]);

  const edgeKinds = result.rawReferences.map((reference) => reference.edgeKind).sort();
  assert.deepEqual(edgeKinds, [
    "html-anchor-navigation",
    "html-image-src",
    "html-module-script-src",
    "html-source-srcset",
    "html-source-srcset",
    "html-stylesheet-href",
  ].sort());

  const stylesheetRef = result.rawReferences.find((reference) => reference.edgeKind === "html-stylesheet-href");
  assert.equal(stylesheetRef.candidateTarget, "./app.css");
  const scriptRef = result.rawReferences.find((reference) => reference.edgeKind === "html-module-script-src");
  assert.equal(scriptRef.candidateTarget, "./app.mjs");

  // byte-slice round trip: every element's source reference must resolve back to its own tag text.
  const referenceById = byReferenceId(result.sourceReferences);
  for (const element of result.elements) {
    const [, start, length] = /:(\d+):(\d+)$/u.exec(element.sourceReferenceId);
    const slice = html.slice(Number(start), Number(start) + Number(length));
    assert.equal(slice.startsWith(`<${element.tag}`), true, `expected slice to start with <${element.tag}, got: ${slice.slice(0, 30)}`);
    const reference = referenceById.get(element.sourceReferenceId);
    assert.ok(reference !== undefined);
  }
});

test("captures inline script and inline style byte ranges distinct from src-based refs", () => {
  const html = [
    "<html><head><style>",
    "body { color: red; }",
    "</style></head><body>",
    "<script>",
    "console.log('hi');",
    "</script>",
    "</body></html>",
  ].join("\n");

  const result = project(html);
  assert.equal(result.inlineStyles.length, 1);
  assert.equal(result.inlineScripts.length, 1);
  assert.equal(html.slice(result.inlineStyles[0].start, result.inlineStyles[0].start + result.inlineStyles[0].length), "\nbody { color: red; }\n");
  assert.equal(html.slice(result.inlineScripts[0].start, result.inlineScripts[0].start + result.inlineScripts[0].length), "\nconsole.log('hi');\n");

  const inlineEdgeKinds = result.rawReferences.map((reference) => reference.edgeKind).sort();
  assert.deepEqual(inlineEdgeKinds, ["html-inline-script", "html-inline-style"]);

  // each inline edge must carry the synthetic pathId of its own block, not a null resolution.
  const styleRef = result.rawReferences.find((reference) => reference.edgeKind === "html-inline-style");
  assert.equal(styleRef.resolvedSyntheticPathId, result.inlineStyles[0].syntheticPathId);
  const scriptRef = result.rawReferences.find((reference) => reference.edgeKind === "html-inline-script");
  assert.equal(scriptRef.resolvedSyntheticPathId, result.inlineScripts[0].syntheticPathId);
});

test("reports diagnostics for unterminated comment, script, and style without throwing", () => {
  const unterminatedComment = "<html><!-- never closed<body></body></html>";
  const commentResult = project(unterminatedComment);
  assert.equal(commentResult.diagnostics.some((diagnostic) => diagnostic.kind === "unterminated-comment"), true);

  const unterminatedScript = "<html><body><script>console.log('no close')</body></html>";
  const scriptResult = project(unterminatedScript);
  assert.equal(scriptResult.diagnostics.some((diagnostic) => diagnostic.kind === "unterminated-script"), true);

  const unterminatedStyle = "<html><head><style>body { color: red; }</head><body></body></html>";
  const styleResult = project(unterminatedStyle);
  assert.equal(styleResult.diagnostics.some((diagnostic) => diagnostic.kind === "unterminated-style"), true);
});

test("recomputes line/column correctly across CRLF line endings", () => {
  const html = "<html>\r\n<body>\r\n<h1>Hello</h1>\r\n</body>\r\n</html>";
  const result = project(html);
  const heading = result.elements.find((element) => element.kind === "heading");
  const reference = byReferenceId(result.sourceReferences).get(heading.sourceReferenceId);
  assert.equal(reference.startLine, 3);
  assert.equal(reference.startColumn, 1);
});

test("does not misinterpret markup-like text inside HTML comments as live elements", () => {
  const html = "<html><body><!-- <a href=\"/danger\">nope</a> --><p>real</p></body></html>";
  const result = project(html);
  assert.equal(result.elements.some((element) => element.kind === "link"), false);
});
