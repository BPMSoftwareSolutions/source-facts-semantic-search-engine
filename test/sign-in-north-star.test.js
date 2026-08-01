import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runsSignInNorthStar } from "../src/composition/runs-sign-in-north-star.js";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";

const kinds = Object.freeze(["layout", "authentication-entry", "messaging", "theme"]);

test("runs the complete sign-in north star from one request and accepts source-path authority selectors", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-north-star-source-"));
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-north-star-run-"));
  try {
    for (const kind of kinds) {
      fs.writeFileSync(path.join(workspaceRoot, `${kind}.html`), buildsLoginHtml(kind), "utf8");
    }
    const policy = buildsPolicy(workspaceRoot);
    const inventory = await projectsWebSurfaceInventory({ policy });
    const index = await projectsWebSurfaceIndex({ policy, inventory });
    const authorities = buildsAuthorities(index);
    const authoritiesDirectory = path.join(runRoot, "authorities");
    fs.mkdirSync(authoritiesDirectory);
    for (const authority of authorities) {
      fs.writeFileSync(path.join(authoritiesDirectory, `${authority.authorityId}.authority.v1.json`), JSON.stringify(authority), "utf8");
    }

    const result = await runsSignInNorthStar({
      index,
      inventory,
      requestInput: buildsRequest(),
      outputDirectory: path.join(runRoot, "output"),
      authoritiesDirectory,
      selectionOverrides: { layout: "layout.html" },
      prove: true,
    });

    assert.equal(result.report.disposition, "READY");
    assert.equal(result.report.gallery.rowCount, 4);
    assert.equal(result.report.selectedAuthorities.length, 4);
    assert.equal(result.report.selectedAuthorities[0].sourceRelativePath, "layout.html");
    assert.equal(result.report.compatibility.disposition, "COMPATIBLE");
    assert.equal(result.report.gallery.proof.receiptCount, 4);
    assert.equal(result.report.gallery.proof.renderedCount, 4);
    assert.equal(result.report.stages.at(-1).stageId, "runnable-governed-preview");
    assert.equal(result.report.stages.at(-1).disposition, "READY");
    assert.ok(fs.existsSync(path.join(result.outputRoot, "authority-choices.json")));
    assert.ok(fs.existsSync(path.join(result.outputRoot, "north-star-report.json")));
    assert.ok(fs.existsSync(path.join(result.galleryOutputDirectory, "gallery-host.html")));
    assert.ok(fs.existsSync(path.join(result.compositionOutputDirectory, "projected-design-document.md")));
    assert.ok(fs.existsSync(path.join(result.compositionOutputDirectory, "candidate.ast.txt")));
    assert.ok(fs.existsSync(path.join(result.compositionOutputDirectory, "previews", "composed-sign-in", "index.html")));
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true });
    fs.rmSync(runRoot, { recursive: true, force: true });
  }
});

function buildsLoginHtml(kind) {
  return [
    "<!doctype html><html><head>",
    `<title>${kind} secure account sign in</title>`,
    "<style>body{font-family:system-ui;background:#eef2ff;color:#172033}main{max-width:32rem;margin:4rem auto;padding:2rem;background:#fff;border-radius:1rem}</style>",
    "</head><body><main>",
    `<h1>Sign in with the reviewed ${kind}</h1>`,
    "<form><label>Email address<input type=\"email\" autocomplete=\"email\"></label>",
    "<label>Password<input type=\"password\" autocomplete=\"current-password\"></label>",
    "<button type=\"submit\">Sign in</button></form>",
    "</main></body></html>",
  ].join("");
}

function buildsPolicy(workspaceRoot) {
  return {
    policyType: "web-know-workspace.v1",
    roots: [{ rootId: "fixture", path: workspaceRoot }],
    entryExtensions: [".html", ".htm"],
    relatedExtensions: [".css", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json"],
    excludeDirectories: ["node_modules", "dist", ".git"],
    symlinkPolicy: "skip",
    maxFileSizeBytes: 1_000_000,
    expansion: { maxDepth: 6, maxMembers: 200, maxBytes: 20_000_000, maxTimeMs: 30_000 },
  };
}

function buildsAuthorities(index) {
  const documentByPath = new Map(index.htmlDocuments.map((document) => [document.relativePath, document]));
  const common = (authorityKind, provides, requires, bindings) => {
    const document = documentByPath.get(`${authorityKind}.html`);
    return {
      authorityType: "composition-authority.v1",
      authorityId: `${authorityKind}-fixture.v1`,
      authorityKind,
      label: `${authorityKind} fixture`,
      reviewStatus: "reviewed-candidate",
      evidenceClass: "observed-and-reviewed",
      source: {
        documentId: document.documentId,
        rootId: document.rootId,
        relativePath: document.relativePath,
        sourceReferenceIds: [document.sourceReferenceId],
      },
      provides,
      requires,
      conflictsWith: [],
      bindings,
    };
  };
  return [
    common("layout", ["slot.brand", "slot.authentication-entry", "slot.messaging", "surface.sign-in"], ["role.identity-entry", "content.primary-message", "tokens.theme"], [
      { key: "layout.variant", value: "split" }, { key: "layout.brand-side", value: "left" },
    ]),
    common("authentication-entry", ["role.identity-entry", "role.primary-authentication-action", "state.busy", "state.confirmation", "state.failure"], ["slot.authentication-entry", "content.failure-message"], [
      { key: "auth.method", value: "email-password" }, { key: "auth.identity-label", value: "Email" }, { key: "auth.secret-label", value: "Password" }, { key: "auth.primary-action-label", value: "Sign in" },
    ]),
    common("messaging", ["content.primary-message", "content.failure-message", "content.continuation"], ["slot.messaging", "state.failure"], [
      { key: "message.eyebrow", value: "Student access" }, { key: "message.heading", value: "Welcome back" }, { key: "message.body", value: "Use your approved account." }, { key: "message.failure", value: "Try again." }, { key: "message.continuation", value: "Need an account? Apply." },
    ]),
    common("theme", ["tokens.theme", "tokens.focus-treatment", "tokens.contrast"], ["surface.sign-in"], [
      { key: "theme.background", value: "#0a0f1f" }, { key: "theme.surface", value: "#0c1428" }, { key: "theme.ink", value: "#d0e2ff" }, { key: "theme.muted", value: "#9dc5ff" }, { key: "theme.accent", value: "#6ea8ff" }, { key: "theme.danger", value: "#ef4444" }, { key: "theme.focus", value: "#fee440" }, { key: "theme.radius", value: "12px" }, { key: "theme.font", value: "system-ui, sans-serif" },
    ]),
  ];
}

function buildsRequest() {
  return {
    requestType: "sign-in-composition-request.v1",
    subject: "North-star sign-in",
    purpose: "Compose a governed sign-in candidate from reviewed authority.",
    audience: "Approved enterprise learners.",
    galleryManifestId: null,
    selections: kinds.map((authorityKind) => ({ authorityKind, authorityId: `${authorityKind}-fixture.v1`, rationale: `Use ${authorityKind}.` })),
    previewPolicyId: "static-no-script.v1",
  };
}
