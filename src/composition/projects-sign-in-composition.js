import { createHash } from "node:crypto";

const authorityKindOrder = Object.freeze(["layout", "authentication-entry", "messaging", "theme"]);
const requiredBindingKeys = Object.freeze({
  layout: Object.freeze(["layout.variant", "layout.brand-side"]),
  "authentication-entry": Object.freeze(["auth.method", "auth.identity-label", "auth.primary-action-label"]),
  messaging: Object.freeze(["message.eyebrow", "message.heading", "message.body", "message.failure", "message.continuation"]),
  theme: Object.freeze(["theme.background", "theme.surface", "theme.ink", "theme.muted", "theme.accent", "theme.danger", "theme.focus", "theme.radius", "theme.font"]),
});

export function buildsSignInCompositionRequest(input, galleryManifestId) {
  if (input.galleryManifestId !== null && input.galleryManifestId !== galleryManifestId) {
    throw new Error("The composition request is bound to a different gallery manifest.");
  }
  const selections = [...input.selections]
    .map((selection) => Object.freeze({ ...selection }))
    .sort((left, right) => {
      const kindDifference = authorityKindOrder.indexOf(left.authorityKind) - authorityKindOrder.indexOf(right.authorityKind);
      return kindDifference !== 0 ? kindDifference : left.authorityId.localeCompare(right.authorityId);
    });
  const body = {
    requestType: "sign-in-composition-request.v1",
    subject: input.subject,
    purpose: input.purpose,
    audience: input.audience,
    galleryManifestId,
    selections: Object.freeze(selections),
    previewPolicyId: input.previewPolicyId,
  };
  const requestId = hashText(canonicalizesJson(body));
  if (input.requestId !== undefined && input.requestId !== requestId) {
    throw new Error("The supplied composition requestId does not match its canonical content.");
  }
  return Object.freeze({ ...body, requestId });
}

export function evaluatesSignInCompositionCompatibility({ request, authorities, manifest }) {
  const authorityById = new Map(authorities.map((authority) => [authority.authorityId, authority]));
  const selected = request.selections.map((selection) => authorityById.get(selection.authorityId)).filter(Boolean);
  const checks = [];
  const addsCheck = (category, disposition, message, authorityIds = []) => {
    const ordinal = checks.length;
    checks.push(Object.freeze({
      checkId: hashText(`${request.requestId}\0${ordinal}\0${category}\0${message}`),
      category,
      disposition,
      message,
      authorityIds: Object.freeze([...authorityIds]),
    }));
  };

  const selectionKinds = request.selections.map((selection) => selection.authorityKind);
  const missingKinds = authorityKindOrder.filter((kind) => selectionKinds.filter((candidate) => candidate === kind).length !== 1);
  addsCheck("selection", missingKinds.length === 0 ? "SATISFIED" : "FAILED",
    missingKinds.length === 0 ? "Exactly one authority is selected for each required sign-in authority kind." : `Missing or duplicate authority kinds: ${missingKinds.join(", ")}.`,
    request.selections.map((selection) => selection.authorityId));

  const unknownSelections = request.selections.filter((selection) => !authorityById.has(selection.authorityId));
  addsCheck("selection", unknownSelections.length === 0 ? "SATISFIED" : "FAILED",
    unknownSelections.length === 0 ? "Every selected authority resolves in the reviewed registry." : `Unknown authorities: ${unknownSelections.map((selection) => selection.authorityId).join(", ")}.`,
    unknownSelections.map((selection) => selection.authorityId));

  const kindMismatches = request.selections.filter((selection) => authorityById.get(selection.authorityId)?.authorityKind !== selection.authorityKind);
  addsCheck("selection", kindMismatches.length === 0 ? "SATISFIED" : "FAILED",
    kindMismatches.length === 0 ? "Every selected authority is bound to its declared authority kind." : `Authority-kind mismatches: ${kindMismatches.map((selection) => selection.authorityId).join(", ")}.`,
    kindMismatches.map((selection) => selection.authorityId));

  const unreviewed = selected.filter((authority) => authority.reviewStatus !== "reviewed-candidate" && authority.reviewStatus !== "promoted");
  addsCheck("review", unreviewed.length === 0 ? "SATISFIED" : "FAILED",
    unreviewed.length === 0 ? "Every selected authority is reviewed or promoted." : `Unreviewed authorities: ${unreviewed.map((authority) => authority.authorityId).join(", ")}.`,
    unreviewed.map((authority) => authority.authorityId));

  const manifestItems = new Map(manifest.items.map((item) => [`${item.documentId}\0${item.rootId}\0${item.relativePath}`, item]));
  const unbound = selected.filter((authority) => {
    const manifestItem = manifestItems.get(`${authority.source.documentId}\0${authority.source.rootId}\0${authority.source.relativePath}`);
    return manifestItem === undefined || authority.source.sourceReferenceIds.some((referenceId) => !manifestItem.sourceReferenceIds.includes(referenceId));
  });
  addsCheck("source-binding", unbound.length === 0 ? "SATISFIED" : "FAILED",
    unbound.length === 0 ? "Every authority resolves to a source-addressable item in the selected gallery manifest." : `Authorities outside the gallery manifest: ${unbound.map((authority) => authority.authorityId).join(", ")}.`,
    unbound.map((authority) => authority.authorityId));

  const providedPorts = new Set(selected.flatMap((authority) => authority.provides));
  const missingPorts = selected.flatMap((authority) => authority.requires
    .filter((requiredPort) => !providedPorts.has(requiredPort))
    .map((requiredPort) => ({ authorityId: authority.authorityId, requiredPort })));
  addsCheck("port-binding", missingPorts.length === 0 ? "SATISFIED" : "FAILED",
    missingPorts.length === 0 ? "Every required composition port is provided by a selected authority." : `Unresolved required ports: ${missingPorts.map((item) => `${item.authorityId}:${item.requiredPort}`).join(", ")}.`,
    [...new Set(missingPorts.map((item) => item.authorityId))]);

  const selectedIds = new Set(selected.map((authority) => authority.authorityId));
  const conflicts = selected.flatMap((authority) => authority.conflictsWith
    .filter((conflictId) => selectedIds.has(conflictId))
    .map((conflictId) => [authority.authorityId, conflictId]));
  addsCheck("conflict", conflicts.length === 0 ? "SATISFIED" : "FAILED",
    conflicts.length === 0 ? "No selected authority declares a conflict with another selection." : `Declared authority conflicts: ${conflicts.map(([left, right]) => `${left} -> ${right}`).join(", ")}.`,
    [...new Set(conflicts.flat())]);

  const missingBindings = selected.flatMap((authority) => {
    const availableKeys = new Set(authority.bindings.map((binding) => binding.key));
    return requiredBindingKeys[authority.authorityKind]
      .filter((key) => !availableKeys.has(key))
      .map((key) => ({ authorityId: authority.authorityId, key }));
  });
  const unsafeThemeBindings = selected
    .filter((authority) => authority.authorityKind === "theme")
    .flatMap((authority) => authority.bindings.filter((binding) => binding.key.startsWith("theme.") && !isSafeThemeBinding(binding))
      .map((binding) => ({ authorityId: authority.authorityId, key: binding.key })));
  const invalidSemanticBindings = selected.flatMap((authority) => authority.bindings
    .filter((binding) => !isValidSemanticBinding(binding))
    .map((binding) => ({ authorityId: authority.authorityId, key: binding.key })));
  const duplicateBindings = selected.flatMap((authority) => {
    const counts = new Map();
    for (const binding of authority.bindings) counts.set(binding.key, (counts.get(binding.key) ?? 0) + 1);
    return [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => ({ authorityId: authority.authorityId, key }));
  });
  const invalidBindings = [...missingBindings, ...unsafeThemeBindings, ...invalidSemanticBindings, ...duplicateBindings];
  addsCheck("projection-binding", invalidBindings.length === 0 ? "SATISFIED" : "FAILED",
    invalidBindings.length === 0 ? "All projection bindings are complete and safe for the script-free renderer." : `Missing or unsafe projection bindings: ${invalidBindings.map((item) => `${item.authorityId}:${item.key}`).join(", ")}.`,
    [...new Set(invalidBindings.map((item) => item.authorityId))]);

  const failedCount = checks.filter((check) => check.disposition === "FAILED").length;
  const reportBody = Object.freeze({
    reportType: "composition-compatibility-report.v1",
    requestId: request.requestId,
    disposition: failedCount === 0 ? "COMPATIBLE" : "INCOMPATIBLE",
    checks: Object.freeze(checks),
    satisfiedCount: checks.length - failedCount,
    failedCount,
  });
  return Object.freeze({ ...reportBody, reportId: hashText(canonicalizesJson(reportBody)) });
}

export function projectsSignInCompositionContract({ request, authorities, compatibilityReport }) {
  if (compatibilityReport.disposition !== "COMPATIBLE") throw new Error("Cannot project a sign-in composition contract from an incompatible request.");
  const authorityById = new Map(authorities.map((authority) => [authority.authorityId, authority]));
  const selected = request.selections.map((selection) => ({ selection, authority: authorityById.get(selection.authorityId) }));
  const bindings = selected.flatMap(({ authority }) => authority.bindings.map((binding) => Object.freeze({ ...binding, authorityId: authority.authorityId })));
  const authorityIdByKind = new Map(selected.map(({ authority }) => [authority.authorityKind, authority.authorityId]));
  const regionsInput = [
    ["SignInSurface", authorityIdByKind.get("layout"), ["BrandRegion", "MessageRegion", "AuthenticationRegion"]],
    ["BrandRegion", authorityIdByKind.get("layout"), []],
    ["MessageRegion", authorityIdByKind.get("messaging"), ["PrimaryMessage", "FailureMessage", "ContinuationMessage"]],
    ["AuthenticationRegion", authorityIdByKind.get("authentication-entry"), ["IdentityEntry", "SecretEntry", "PrimaryAuthenticationAction"]],
    ["ThemeTokens", authorityIdByKind.get("theme"), []],
  ];
  const regions = regionsInput.map(([role, authorityId, children]) => Object.freeze({
    regionId: hashText(`${request.requestId}\0region\0${role}`),
    role,
    authorityId,
    children: Object.freeze(children),
  }));
  const contractBody = Object.freeze({
    contractType: "sign-in-composition-contract.v1",
    requestId: request.requestId,
    compatibilityReportId: compatibilityReport.reportId,
    subject: request.subject,
    purpose: request.purpose,
    audience: request.audience,
    galleryManifestId: request.galleryManifestId,
    authorities: Object.freeze(selected.map(({ selection, authority }) => Object.freeze({
      authorityKind: authority.authorityKind,
      authorityId: authority.authorityId,
      authorityHash: hashText(canonicalizesJson(authority)),
      label: authority.label,
      reviewStatus: authority.reviewStatus,
      evidenceClass: authority.evidenceClass,
      source: authority.source,
      rationale: selection.rationale,
    }))),
    regions: Object.freeze(regions),
    bindings: Object.freeze(bindings),
    unresolvedBindings: Object.freeze([]),
    conflicts: Object.freeze([]),
    disposition: "COMPOSABLE",
  });
  return Object.freeze({ ...contractBody, contractId: hashText(canonicalizesJson(contractBody)) });
}

export function projectsSignInDesignDocument({ contract, compatibilityReport }) {
  const lines = [
    `# Design Document: ${contract.subject}`,
    "",
    `_Deterministically projected from composition contract \`${contract.contractId}\` and compatibility report \`${compatibilityReport.reportId}\`._`,
    "",
    "## Intent",
    "",
    contract.purpose,
    "",
    `Audience: ${contract.audience}`,
    "",
    "## Compatibility",
    "",
    `Disposition: **${compatibilityReport.disposition}** (${compatibilityReport.satisfiedCount} satisfied, ${compatibilityReport.failedCount} failed).`,
    "",
    ...compatibilityReport.checks.map((check) => `- ${check.disposition}: ${check.message}`),
    "",
    "## Selected Authorities",
    "",
    ...contract.authorities.map((authority) => `- **${authority.authorityKind}** — ${authority.label} (\`${authority.authorityId}\`, ${authority.evidenceClass}), from \`${authority.source.rootId}:${authority.source.relativePath}\`. ${authority.rationale}`),
    "",
    "## Candidate Regions",
    "",
    ...contract.regions.map((region) => `- **${region.role}** — authority \`${region.authorityId}\`${region.children.length === 0 ? "" : `; children: ${region.children.join(", ")}`}`),
    "",
    "## Evidence Boundary",
    "",
    "This is constructive composition from reviewed candidate authorities. It is not a claim that the source pages share an implementation, and it does not execute legacy authentication behavior.",
    "",
  ];
  return lines.join("\n");
}

export function projectsSignInCandidateAst({ contract }) {
  const authority = (kind) => contract.authorities.find((candidate) => candidate.authorityKind === kind).authorityId;
  return [
    `SignInSurface [layout=${authority("layout")}, theme=${authority("theme")}]`,
    "├── BrandRegion",
    `├── MessageRegion [authority=${authority("messaging")}]`,
    "│   ├── PrimaryMessage",
    "│   ├── FailureMessage",
    "│   └── ContinuationMessage",
    `└── AuthenticationRegion [authority=${authority("authentication-entry")}]`,
    "    ├── IdentityEntry",
    "    ├── SecretEntry",
    "    └── PrimaryAuthenticationAction",
    "",
  ].join("\n");
}

export function projectsSignInPreview({ contract }) {
  const values = new Map(contract.bindings.map((binding) => [binding.key, binding.value]));
  const layoutVariant = values.get("layout.variant");
  const split = layoutVariant === "split";
  const brandOnRight = values.get("layout.brand-side") === "right";
  const method = values.get("auth.method");
  const asksForSecret = method === "email-password";
  const style = [
    `--background:${values.get("theme.background")}`,
    `--surface:${values.get("theme.surface")}`,
    `--ink:${values.get("theme.ink")}`,
    `--muted:${values.get("theme.muted")}`,
    `--accent:${values.get("theme.accent")}`,
    `--danger:${values.get("theme.danger")}`,
    `--focus:${values.get("theme.focus")}`,
    `--radius:${values.get("theme.radius")}`,
    `--font:${values.get("theme.font")}`,
  ].join(";");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapesHtml(contract.subject)}</title>
<style>
  :root { ${style}; color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; background: var(--background); color: var(--ink); font: 16px/1.5 var(--font); }
  .surface { min-height: 100vh; display: grid; grid-template-columns: ${split ? "minmax(18rem, .9fr) minmax(24rem, 1.1fr)" : "minmax(0, 1fr)"}; }
  .brand { order: ${brandOnRight ? "2" : "0"}; padding: clamp(2rem, 7vw, 6rem); display: grid; align-content: space-between; gap: 3rem; background: var(--accent); color: #fff; }
  .brand strong { font-size: 1.15rem; letter-spacing: .02em; }
  .brand h2 { max-width: 12ch; margin: 0; font-size: clamp(2.3rem, 6vw, 5rem); line-height: .98; letter-spacing: -.055em; }
  .panel-shell { order: ${brandOnRight ? "0" : "2"}; display: grid; place-items: center; padding: clamp(1.25rem, 5vw, 5rem); }
  .panel { width: min(30rem, 100%); background: var(--surface); border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent); border-radius: var(--radius); padding: clamp(1.5rem, 5vw, 3rem); box-shadow: 0 1.5rem 5rem color-mix(in srgb, var(--ink) 12%, transparent); }
  .eyebrow { margin: 0 0 .65rem; color: var(--accent); font-weight: 750; text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; }
  h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1; letter-spacing: -.045em; }
  .lede, .continuation { color: var(--muted); }
  .auth-form { display: grid; gap: 1rem; margin-top: 2rem; }
  label { display: grid; gap: .4rem; font-weight: 700; }
  input { width: 100%; border: 1px solid color-mix(in srgb, var(--ink) 24%, transparent); border-radius: calc(var(--radius) * .55); padding: .8rem .9rem; background: var(--background); color: var(--ink); font: inherit; }
  input:focus-visible, button:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
  button { border: 0; border-radius: calc(var(--radius) * .55); padding: .9rem 1rem; background: var(--accent); color: #fff; font: inherit; font-weight: 800; cursor: pointer; }
  .failure { border-left: .25rem solid var(--danger); padding: .75rem 1rem; color: var(--danger); background: color-mix(in srgb, var(--danger) 9%, transparent); }
  .provenance { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent); color: var(--muted); font-size: .78rem; }
  @media (max-width: 760px) { .surface { grid-template-columns: 1fr; } .brand { min-height: 16rem; } }
</style>
</head>
<body>
<main class="surface" data-contract-id="${escapesHtml(contract.contractId)}">
  <section class="brand" aria-label="Product identity">
    <strong>${escapesHtml(contract.subject)}</strong>
    <h2>${escapesHtml(values.get("message.continuation"))}</h2>
    <span>Governed candidate composition</span>
  </section>
  <section class="panel-shell">
    <div class="panel">
      <p class="eyebrow">${escapesHtml(values.get("message.eyebrow"))}</p>
      <h1>${escapesHtml(values.get("message.heading"))}</h1>
      <p class="lede">${escapesHtml(values.get("message.body"))}</p>
      <div class="failure" role="status">${escapesHtml(values.get("message.failure"))}</div>
      <div class="auth-form" role="form" aria-label="Sign in">
        <label>${escapesHtml(values.get("auth.identity-label"))}<input type="email" autocomplete="email" inputmode="email"></label>
        ${asksForSecret ? `<label>${escapesHtml(values.get("auth.secret-label") ?? "Password")}<input type="password" autocomplete="current-password"></label>` : ""}
        <button type="button">${escapesHtml(values.get("auth.primary-action-label"))}</button>
      </div>
      <p class="continuation">${escapesHtml(values.get("message.continuation"))}</p>
      <p class="provenance">Static simulation only · no source scripts, network, storage, submission, or authentication effects.</p>
    </div>
  </section>
</main>
</body>
</html>
`;
}

export function projectsCompositionHost({ contract, compatibilityReport }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Governed Sign-In Composition</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#172033;font:16px/1.5 system-ui,sans-serif}main{width:min(900px,calc(100% - 2rem));margin:4rem auto;background:#fff;border:1px solid #d8deea;border-radius:1rem;padding:clamp(1.5rem,5vw,3rem)}h1{font-size:clamp(2rem,6vw,4rem);line-height:1;letter-spacing:-.05em}.ok{color:#087443;font-weight:800}.authorities{display:grid;gap:.75rem;margin:2rem 0}.authority{padding:1rem;border:1px solid #d8deea;border-radius:.75rem}.authority strong{display:block}.authority span{color:#596579}a{display:inline-block;border-radius:.55rem;padding:.75rem 1rem;background:#2457d6;color:#fff;text-decoration:none;font-weight:750}code{overflow-wrap:anywhere}</style></head><body><main><p class="ok">${compatibilityReport.disposition}</p><h1>${escapesHtml(contract.subject)}</h1><p>${escapesHtml(contract.purpose)}</p><p><code>${escapesHtml(contract.contractId)}</code></p><div class="authorities">${contract.authorities.map((authority) => `<div class="authority"><strong>${escapesHtml(authority.authorityKind)} · ${escapesHtml(authority.label)}</strong><span>${escapesHtml(authority.source.rootId)} · ${escapesHtml(authority.source.relativePath)}</span></div>`).join("")}</div><a href="/preview/composed-sign-in/index.html">Open governed preview</a></main></body></html>\n`;
}

function isSafeThemeBinding(binding) {
  if (["theme.background", "theme.surface", "theme.ink", "theme.muted", "theme.accent", "theme.danger", "theme.focus"].includes(binding.key)) {
    return /^#[0-9a-f]{6}$/iu.test(binding.value);
  }
  if (binding.key === "theme.radius") return /^(?:[0-9]|[12][0-9]|3[0-2])(?:px|rem)$/u.test(binding.value);
  if (binding.key === "theme.font") return /^[a-z0-9 ,'-]{1,80}$/iu.test(binding.value);
  return true;
}

function isValidSemanticBinding(binding) {
  if (binding.key === "layout.variant") return ["split", "centered"].includes(binding.value);
  if (binding.key === "layout.brand-side") return ["left", "right"].includes(binding.value);
  if (binding.key === "auth.method") return ["email-password", "magic-link", "sso"].includes(binding.value);
  if (binding.key.startsWith("auth.") || binding.key.startsWith("message.")) return binding.value.trim().length > 0;
  return true;
}

function escapesHtml(value) {
  return String(value ?? "").replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;");
}

export function canonicalizesJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalizesJson).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizesJson(value[key])}`).join(",")}}`;
}

export function hashText(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}
