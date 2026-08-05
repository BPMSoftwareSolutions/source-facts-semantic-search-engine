import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { writesSignInComposition } from "../src/composition/writes-sign-in-composition.js";
import { validatesCompositionAuthority } from "../src/composition/validates-composition-artifacts.js";

const kinds = ["layout", "authentication-entry", "messaging", "theme"];
const documents = Object.freeze(kinds.map((kind, index) => Object.freeze({
  documentId: String(index + 1).repeat(64),
  pathId: String(index + 5).repeat(64),
  rootId: "fixture",
  relativePath: `${kind}.html`,
  sourceReferenceId: `fixture:${kind}:0:100`,
})));

test("projects a compatible reviewed sign-in composition through contract, design, AST, and script-free preview", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-composition-"));
  try {
    const authoritiesDirectory = path.join(workspace, "authorities");
    const outputDirectory = path.join(workspace, "output");
    fs.mkdirSync(authoritiesDirectory);
    const authorities = buildsAuthorities();
    for (const authority of authorities) {
      await validatesCompositionAuthority(authority);
      fs.writeFileSync(path.join(authoritiesDirectory, `${authority.authorityId}.authority.v1.json`), JSON.stringify(authority), "utf8");
    }

    const result = await writesSignInComposition({
      requestInput: buildsRequest(),
      manifest: buildsManifest(),
      outputDirectory,
      authoritiesDirectory,
      previewPolicy: buildsPreviewPolicy(),
    });

    assert.equal(result.compatibilityReport.disposition, "COMPATIBLE");
    assert.equal(result.compatibilityReport.failedCount, 0);
    assert.equal(result.contract.disposition, "COMPOSABLE");
    assert.equal(result.contract.authorities.length, 4);
    assert.deepEqual(result.contract.authorities.map((authority) => authority.authorityKind), kinds);

    const preview = fs.readFileSync(path.join(outputDirectory, "previews", "composed-sign-in", "index.html"), "utf8");
    assert.match(preview, /Welcome to the governed workspace/);
    assert.match(preview, /Email address/);
    assert.match(preview, /Continue securely/);
    assert.doesNotMatch(preview, /<script\b/iu);
    assert.doesNotMatch(preview, /\son[a-z]+=/iu);

    const ast = fs.readFileSync(path.join(outputDirectory, "candidate.ast.txt"), "utf8");
    assert.match(ast, /SignInSurface/);
    assert.match(ast, /AuthenticationRegion/);
    assert.ok(fs.existsSync(path.join(outputDirectory, "composition-projection-receipt.json")));
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

test("fails closed with an explicit compatibility report when a required port is missing", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-incompatible-"));
  try {
    const authoritiesDirectory = path.join(workspace, "authorities");
    const outputDirectory = path.join(workspace, "output");
    fs.mkdirSync(authoritiesDirectory);
    const authorities = buildsAuthorities();
    authorities[0] = { ...authorities[0], requires: [...authorities[0].requires, "port.that-does-not-exist"] };
    for (const authority of authorities) {
      fs.writeFileSync(path.join(authoritiesDirectory, `${authority.authorityId}.authority.v1.json`), JSON.stringify(authority), "utf8");
    }

    const result = await writesSignInComposition({
      requestInput: buildsRequest(),
      manifest: buildsManifest(),
      outputDirectory,
      authoritiesDirectory,
      previewPolicy: buildsPreviewPolicy(),
    });

    assert.equal(result.compatibilityReport.disposition, "INCOMPATIBLE");
    assert.equal(result.contract, null);
    assert.ok(result.compatibilityReport.checks.some((check) => check.category === "port-binding" && check.disposition === "FAILED"));
    assert.ok(fs.existsSync(path.join(outputDirectory, "compatibility-report.json")));
    assert.equal(fs.existsSync(path.join(outputDirectory, "previews", "composed-sign-in", "index.html")), false);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

test("fails closed when reviewed authority evidence is not present in the selected gallery item", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-unbound-evidence-"));
  try {
    const authoritiesDirectory = path.join(workspace, "authorities");
    const outputDirectory = path.join(workspace, "output");
    fs.mkdirSync(authoritiesDirectory);
    const authorities = buildsAuthorities();
    authorities[0] = {
      ...authorities[0],
      source: { ...authorities[0].source, sourceReferenceIds: ["fixture:not-in-the-manifest:0:1"] },
    };
    for (const authority of authorities) {
      fs.writeFileSync(path.join(authoritiesDirectory, `${authority.authorityId}.authority.v1.json`), JSON.stringify(authority), "utf8");
    }

    const result = await writesSignInComposition({
      requestInput: buildsRequest(),
      manifest: buildsManifest(),
      outputDirectory,
      authoritiesDirectory,
      previewPolicy: buildsPreviewPolicy(),
    });

    assert.equal(result.compatibilityReport.disposition, "INCOMPATIBLE");
    assert.ok(result.compatibilityReport.checks.some((check) => check.category === "source-binding" && check.disposition === "FAILED"));
    assert.equal(fs.existsSync(path.join(outputDirectory, "candidate-composition-contract.json")), false);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

test("an incompatible overwrite removes every stale runnable candidate artifact", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "sign-in-stale-candidate-"));
  try {
    const authoritiesDirectory = path.join(workspace, "authorities");
    const outputDirectory = path.join(workspace, "output");
    fs.mkdirSync(authoritiesDirectory);
    const authorities = buildsAuthorities();
    for (const authority of authorities) {
      fs.writeFileSync(path.join(authoritiesDirectory, `${authority.authorityId}.authority.v1.json`), JSON.stringify(authority), "utf8");
    }
    const first = await writesSignInComposition({
      requestInput: buildsRequest(),
      manifest: buildsManifest(),
      outputDirectory,
      authoritiesDirectory,
      previewPolicy: buildsPreviewPolicy(),
    });
    assert.equal(first.compatibilityReport.disposition, "COMPATIBLE");
    assert.ok(fs.existsSync(path.join(outputDirectory, "previews", "composed-sign-in", "index.html")));

    const incompatibleLayout = { ...authorities[0], requires: [...authorities[0].requires, "missing.port"] };
    fs.writeFileSync(path.join(authoritiesDirectory, `${incompatibleLayout.authorityId}.authority.v1.json`), JSON.stringify(incompatibleLayout), "utf8");
    const second = await writesSignInComposition({
      requestInput: buildsRequest(),
      manifest: buildsManifest(),
      outputDirectory,
      authoritiesDirectory,
      previewPolicy: buildsPreviewPolicy(),
    });

    assert.equal(second.compatibilityReport.disposition, "INCOMPATIBLE");
    for (const stalePath of [
      "candidate-composition-contract.json",
      "projected-design-document.md",
      "candidate.ast.txt",
      "gallery-host.html",
      "composition-projection-receipt.json",
      path.join("previews", "composed-sign-in", "index.html"),
    ]) {
      assert.equal(fs.existsSync(path.join(outputDirectory, stalePath)), false, `${stalePath} must not survive an incompatible overwrite`);
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

function buildsRequest() {
  return {
    requestType: "sign-in-composition-request.v1",
    subject: "Enterprise Learning sign-in",
    purpose: "Give approved learners a governed authentication entry surface.",
    audience: "Enterprise learners with approved accounts.",
    galleryManifestId: null,
    selections: kinds.map((authorityKind) => ({
      authorityKind,
      authorityId: `${authorityKind}-fixture.v1`,
      rationale: `Use the reviewed ${authorityKind} evidence for this candidate.`,
    })),
    previewPolicyId: "static-no-script.v1",
  };
}

function buildsAuthorities() {
  const common = (authorityKind, index, provides, requires, bindings) => ({
    authorityType: "composition-authority.v1",
    authorityId: `${authorityKind}-fixture.v1`,
    authorityKind,
    label: `${authorityKind} fixture`,
    reviewStatus: "reviewed-candidate",
    evidenceClass: "observed-and-reviewed",
    source: {
      documentId: documents[index].documentId,
      rootId: documents[index].rootId,
      relativePath: documents[index].relativePath,
      sourceReferenceIds: [documents[index].sourceReferenceId],
    },
    provides,
    requires,
    conflictsWith: [],
    bindings,
  });
  return [
    common("layout", 0,
      ["slot.brand", "slot.authentication-entry", "slot.messaging", "surface.sign-in"],
      ["role.identity-entry", "content.primary-message", "tokens.theme"],
      [{ key: "layout.variant", value: "split" }, { key: "layout.brand-side", value: "left" }]),
    common("authentication-entry", 1,
      ["role.identity-entry", "role.primary-authentication-action", "state.busy", "state.confirmation", "state.failure"],
      ["slot.authentication-entry", "content.failure-message"],
      [
        { key: "auth.method", value: "email-password" },
        { key: "auth.identity-label", value: "Email address" },
        { key: "auth.secret-label", value: "Password" },
        { key: "auth.primary-action-label", value: "Continue securely" },
      ]),
    common("messaging", 2,
      ["content.primary-message", "content.failure-message", "content.continuation"],
      ["slot.messaging", "state.failure"],
      [
        { key: "message.eyebrow", value: "Approved access" },
        { key: "message.heading", value: "Welcome to the governed workspace" },
        { key: "message.body", value: "Use your approved enterprise identity to continue." },
        { key: "message.failure", value: "We could not verify those details." },
        { key: "message.continuation", value: "Your work stays connected to reviewed authority." },
      ]),
    common("theme", 3,
      ["tokens.theme", "tokens.focus-treatment", "tokens.contrast"],
      ["surface.sign-in"],
      [
        { key: "theme.background", value: "#eef2ff" },
        { key: "theme.surface", value: "#ffffff" },
        { key: "theme.ink", value: "#172033" },
        { key: "theme.muted", value: "#596579" },
        { key: "theme.accent", value: "#2457d6" },
        { key: "theme.danger", value: "#b42318" },
        { key: "theme.focus", value: "#f59e0b" },
        { key: "theme.radius", value: "18px" },
        { key: "theme.font", value: "system-ui, sans-serif" },
      ]),
  ];
}

function buildsManifest() {
  return {
    manifestType: "enterprise-gallery-manifest.v1",
    manifestId: `sha256:${"a".repeat(64)}`,
    requestId: `sha256:${"b".repeat(64)}`,
    selectionId: `sha256:${"c".repeat(64)}`,
    planId: `sha256:${"d".repeat(64)}`,
    items: documents.map((document, ordinal) => ({
      galleryItemId: `sha256:${String(ordinal + 1).repeat(64)}`,
      ordinal,
      documentId: document.documentId,
      familyId: null,
      pathId: document.pathId,
      rootId: document.rootId,
      relativePath: document.relativePath,
      title: `${kinds[ordinal]} page`,
      kind: "html-document",
      classification: { dimension: "page-type", value: "sign-in-page", disposition: "RESOLVED" },
      sourceReferenceIds: [document.sourceReferenceId],
      dependencySummary: { resolvedLocal: 0, unresolved: 0, external: 0 },
      previewDisposition: "STATIC_REPRODUCTION_READY",
      previewRoute: `/preview/${ordinal}/index.html`,
      diagnostics: [],
      limitations: [],
      allowedInspectorTabs: ["source", "preview"],
      selectable: true,
    })),
  };
}

function buildsPreviewPolicy() {
  return {
    declarationType: "surface-preview-policy.v1",
    policyId: "static-no-script.v1",
    scriptPolicy: "deny",
    networkPolicy: "deny",
    formPolicy: "deny",
    navigationPolicy: "deny",
    downloadPolicy: "deny",
    storagePolicy: "ephemeral-deny-by-default",
    serviceWorkerPolicy: "block",
    permissionPolicy: "none",
    sandboxTokens: ["allow-same-origin"],
    viewports: [{ label: "desktop", width: 1440, height: 1000 }],
    maxBytes: 5000000,
    maxFiles: 200,
    timeoutMs: 10000,
  };
}
