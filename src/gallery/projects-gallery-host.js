const dispositionOrder = Object.freeze([
  "STATIC_REPRODUCTION_READY",
  "PARTIAL_STATIC_REPRODUCTION",
  "NOT_EVALUATED_REQUIRES_SCRIPT",
  "BLOCKED_STALE_SOURCE",
  "BLOCKED_MISSING_DEPENDENCY",
  "BLOCKED_BY_POLICY",
  "AUTHORIZED_SCRIPTED_REPRODUCTION_READY",
]);

export function projectsGalleryHost({ manifest }) {
  const itemsByDisposition = new Map();
  for (const disposition of dispositionOrder) itemsByDisposition.set(disposition, []);
  for (const item of manifest.items) {
    const items = itemsByDisposition.get(item.previewDisposition) ?? [];
    items.push(item);
    itemsByDisposition.set(item.previewDisposition, items);
  }

  const summaryLinks = dispositionOrder
    .filter((disposition) => (itemsByDisposition.get(disposition)?.length ?? 0) > 0)
    .map((disposition) => `<a class="posture" href="#${idForDisposition(disposition)}"><span>${escapesHtml(humanizesDisposition(disposition))}</span><strong>${itemsByDisposition.get(disposition).length}</strong></a>`)
    .join("\n");

  const sections = dispositionOrder
    .filter((disposition) => (itemsByDisposition.get(disposition)?.length ?? 0) > 0)
    .map((disposition) => projectsDispositionSection(disposition, itemsByDisposition.get(disposition)))
    .join("\n");

  const emptyState = manifest.items.length === 0
    ? `<section class="empty"><h2>No matching surfaces</h2><p>The saved query completed successfully and produced an empty manifest.</p></section>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Enterprise Surface Explorer</title>
<style>
  :root { color-scheme: light; --ink: #172033; --muted: #596579; --line: #d8deea; --panel: #f6f8fc; --accent: #2457d6; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #fff; color: var(--ink); font: 16px/1.5 system-ui, sans-serif; }
  header, main { width: min(1180px, calc(100% - 2rem)); margin-inline: auto; }
  header { padding: 3rem 0 1.5rem; }
  h1 { margin: 0 0 .5rem; font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -.04em; }
  h2 { margin: 0 0 1rem; font-size: 1.35rem; }
  p { margin: .35rem 0; }
  code { overflow-wrap: anywhere; }
  .lede { max-width: 78ch; color: var(--muted); }
  .postures { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: .75rem; margin: 1.5rem 0 2.25rem; }
  .posture { display: flex; justify-content: space-between; gap: 1rem; border: 1px solid var(--line); border-radius: .75rem; padding: .85rem 1rem; color: inherit; text-decoration: none; background: var(--panel); }
  .posture:hover, .posture:focus-visible { border-color: var(--accent); outline: 2px solid transparent; }
  .group { scroll-margin-top: 1rem; margin: 0 0 2.5rem; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 1rem; }
  article { border: 1px solid var(--line); border-radius: .9rem; padding: 1rem; min-width: 0; }
  article h3 { margin: 0 0 .25rem; font-size: 1.08rem; }
  .path, .meta, .limits { color: var(--muted); font-size: .9rem; overflow-wrap: anywhere; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: .25rem .75rem; margin: .85rem 0; font-size: .9rem; }
  dt { color: var(--muted); }
  dd { margin: 0; }
  .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
  .actions a { border-radius: .45rem; padding: .45rem .7rem; color: #fff; background: var(--accent); text-decoration: none; }
  .tag { display: inline-block; margin-top: .55rem; border-radius: 999px; padding: .2rem .55rem; background: var(--panel); font-size: .78rem; }
  .empty { border: 1px dashed var(--line); border-radius: .9rem; padding: 2rem; }
  footer { width: min(1180px, calc(100% - 2rem)); margin: 3rem auto; color: var(--muted); font-size: .85rem; }
</style>
</head>
<body>
<header>
  <p class="tag">Evidence catalog · restricted previews</p>
  <h1>Enterprise Surface Explorer</h1>
  <p class="lede">${manifest.items.length} gallery item(s) projected from manifest <code>${escapesHtml(manifest.manifestId)}</code>. This host is a deterministic, non-executing catalog: source HTML and JavaScript are not embedded here, and eligible previews are served from isolated bundles.</p>
  <nav class="postures" aria-label="Browse by preview posture">${summaryLinks}</nav>
</header>
<main>
${emptyState}${sections}
</main>
<footer>Preview eligibility is evidence, not a claim of application fidelity. Script-bearing and incomplete surfaces remain explicitly dispositioned.</footer>
</body>
</html>
`;
}

function projectsDispositionSection(disposition, items) {
  return `<section class="group" id="${idForDisposition(disposition)}">
  <h2>${escapesHtml(humanizesDisposition(disposition))} · ${items.length}</h2>
  <div class="cards">
${items.map(projectsCard).join("\n")}
  </div>
</section>`;
}

function projectsCard(item) {
  const limitations = item.limitations.length === 0
    ? "No declared limitations beyond the active preview policy."
    : item.limitations.map(escapesHtml).join("; ");
  const actions = item.previewRoute === null
    ? `<span class="meta">No executable preview admitted</span>`
    : `<a href="${escapesHtml(item.previewRoute)}">Open restricted preview</a>`;
  return `    <article data-root="${escapesHtml(item.rootId)}" data-disposition="${escapesHtml(item.previewDisposition)}">
      <h3>${escapesHtml(item.title ?? item.relativePath)}</h3>
      <p class="path">${escapesHtml(item.rootId)} · ${escapesHtml(item.relativePath)}</p>
      <span class="tag">${escapesHtml(item.classification.value ?? "unclassified")} · ${escapesHtml(item.classification.disposition)}</span>
      <dl>
        <dt>Dependencies</dt><dd>${item.dependencySummary.resolvedLocal} local · ${item.dependencySummary.unresolved} unresolved · ${item.dependencySummary.external} external</dd>
        <dt>Inspectors</dt><dd>${item.allowedInspectorTabs.map(escapesHtml).join(", ")}</dd>
        <dt>Selectable</dt><dd>${item.selectable ? "yes" : "no"}</dd>
      </dl>
      <p class="limits">${limitations}</p>
      <div class="actions">${actions}</div>
    </article>`;
}

function idForDisposition(disposition) {
  return `disposition-${disposition.toLowerCase().replaceAll("_", "-")}`;
}

function humanizesDisposition(disposition) {
  return disposition.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function escapesHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
