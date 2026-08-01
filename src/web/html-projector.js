import { createHash } from "node:crypto";
import { buildsLineStarts, resolvesLineAndColumn } from "../lib/text-positions.js";
import { addSourceReference } from "../lib/source-reference.js";

const namedEntities = Object.freeze({
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
});

const landmarkTags = Object.freeze(["nav", "main", "header", "footer", "aside", "section"]);

export function projectsHtmlDocument({ pathId, rootId, relativePath, contentHash, text }) {
  const documentId = sha256(pathId);
  const lineStarts = buildsLineStarts(text);
  const referenceById = new Set();
  const sourceReferences = [];
  const diagnostics = [];
  const elements = [];
  const rawReferences = [];
  const inlineScripts = [];
  const inlineStyles = [];
  const ordinals = new Map();

  const addRef = (kind, sourceKind, start, length) => {
    const position = resolvesLineAndColumn(lineStarts, start);
    return addSourceReference({
      kind,
      sourceKind,
      location: { start, length, line: position.line, column: position.column },
      modulePath: relativePath,
      sourceText: text,
      referenceById,
      sourceReferences,
    });
  };

  const nextOrdinal = (kind) => {
    const next = (ordinals.get(kind) ?? 0) + 1;
    ordinals.set(kind, next);
    return next - 1;
  };

  const pushElement = ({ kind, tag, attributes, text: elementText, start, length, idRefs = [] }) => {
    const ordinal = nextOrdinal(kind);
    const reference = addRef("html-element", tag, start, length);
    const elementId = sha256(`${documentId}\0${kind}\0${tag}\0${ordinal}\0${start}`);
    elements.push(Object.freeze({
      elementId,
      documentId,
      kind,
      tag,
      attributes: Object.freeze({ ...attributes }),
      text: elementText,
      textHash: elementText === null ? null : `sha256:${createHash("sha256").update(elementText, "utf8").digest("hex")}`,
      idRefs: Object.freeze(idRefs.map((idRef) => Object.freeze({ ...idRef }))),
      sourceReferenceId: reference.referenceId,
    }));
    return { elementId, sourceReferenceId: reference.referenceId };
  };

  // Claim script/style/comment byte ranges up front so generic content scans never
  // misinterpret text that only looks like markup inside them.
  const claimedRanges = [];
  const claimRange = (start, end) => claimedRanges.push([start, end]);

  for (const match of text.matchAll(/<!--([\s\S]*?)-->/g)) {
    claimRange(match.index, match.index + match[0].length);
  }
  const lastCommentOpen = text.lastIndexOf("<!--");
  if (lastCommentOpen !== -1 && !isWithinClaimedRange(claimedRanges, lastCommentOpen)) {
    diagnostics.push(buildsDiagnostic({ scope: "html", relativePath, kind: "unterminated-comment", message: "<!-- was not closed with -->", lineStarts, start: lastCommentOpen }));
    claimRange(lastCommentOpen, text.length);
  }

  for (const match of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gdi)) {
    handlesScriptBlock(match);
  }
  scanUnterminatedBlock(/<script\b([^>]*?)(\/?)>/gi, "script", handlesUnterminatedScript);

  for (const match of text.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style\s*>/gdi)) {
    handlesStyleBlock(match);
  }
  scanUnterminatedBlock(/<style\b([^>]*?)>/gi, "style", handlesUnterminatedStyle);

  function scanUnterminatedBlock(openTagRegExp, tagName, onUnterminated) {
    for (const openMatch of text.matchAll(openTagRegExp)) {
      if (tagName === "script" && openMatch[2] === "/") continue;
      if (isWithinClaimedRange(claimedRanges, openMatch.index)) continue;
      const closeIndex = text.slice(openMatch.index).search(new RegExp(`<\\/${tagName}\\s*>`, "i"));
      if (closeIndex === -1) onUnterminated(openMatch);
    }
  }

  function handlesUnterminatedScript(openMatch) {
    diagnostics.push(buildsDiagnostic({ scope: "html", relativePath, kind: "unterminated-script", message: "<script> was not closed with </script>", lineStarts, start: openMatch.index }));
    const attrs = parsesAttributes(openMatch[1] ?? "");
    recordsScriptElement({ attrs, contentStart: openMatch.index + openMatch[0].length, content: text.slice(openMatch.index + openMatch[0].length), start: openMatch.index, length: text.length - openMatch.index });
    claimRange(openMatch.index, text.length);
  }

  function handlesUnterminatedStyle(openMatch) {
    diagnostics.push(buildsDiagnostic({ scope: "html", relativePath, kind: "unterminated-style", message: "<style> was not closed with </style>", lineStarts, start: openMatch.index }));
    const contentStart = openMatch.index + openMatch[0].length;
    recordsStyleElement({ contentStart, content: text.slice(contentStart), start: openMatch.index, length: text.length - openMatch.index });
    claimRange(openMatch.index, text.length);
  }

  function handlesScriptBlock(match) {
    if (isWithinClaimedRange(claimedRanges, match.index)) return;
    claimRange(match.index, match.index + match[0].length);
    const attrs = parsesAttributes(match[1] ?? "");
    const [contentStart] = match.indices[2];
    recordsScriptElement({ attrs, contentStart, content: match[2], start: match.index, length: match[0].length });
  }

  function recordsScriptElement({ attrs, contentStart, content, start, length }) {
    const hasSrc = typeof attrs.src === "string" && attrs.src.length > 0;
    if (hasSrc) {
      const { sourceReferenceId } = pushElement({ kind: "script-ref", tag: "script", attributes: attrs, text: null, start, length });
      rawReferences.push(Object.freeze({
        edgeKind: attrs.type?.toLowerCase() === "module" ? "html-module-script-src" : "html-script-src",
        candidateTarget: attrs.src,
        resolvedSyntheticPathId: null,
        sourceReferenceId,
      }));
      return;
    }
    const { elementId, sourceReferenceId } = pushElement({ kind: "script-inline", tag: "script", attributes: attrs, text: null, start, length });
    if (content.trim().length === 0) return;
    const syntheticPathId = sha256(`${documentId}#inline-script-${elementId}`);
    const position = resolvesLineAndColumn(lineStarts, contentStart);
    inlineScripts.push(Object.freeze({
      syntheticPathId,
      elementId,
      start: contentStart,
      length: content.length,
      line: position.line,
      column: position.column,
      text: content,
    }));
    rawReferences.push(Object.freeze({
      edgeKind: "html-inline-script",
      candidateTarget: "(inline)",
      resolvedSyntheticPathId: syntheticPathId,
      sourceReferenceId,
    }));
  }

  function handlesStyleBlock(match) {
    if (isWithinClaimedRange(claimedRanges, match.index)) return;
    claimRange(match.index, match.index + match[0].length);
    const [contentStart] = match.indices[2];
    recordsStyleElement({ contentStart, content: match[2], start: match.index, length: match[0].length });
  }

  function recordsStyleElement({ contentStart, content, start, length }) {
    const { elementId, sourceReferenceId } = pushElement({ kind: "style-inline", tag: "style", attributes: {}, text: null, start, length });
    if (content.trim().length === 0) return;
    const syntheticPathId = sha256(`${documentId}#inline-style-${elementId}`);
    const position = resolvesLineAndColumn(lineStarts, contentStart);
    inlineStyles.push(Object.freeze({
      syntheticPathId,
      elementId,
      start: contentStart,
      length: content.length,
      line: position.line,
      column: position.column,
      text: content,
    }));
    rawReferences.push(Object.freeze({
      edgeKind: "html-inline-style",
      candidateTarget: "(inline)",
      resolvedSyntheticPathId: syntheticPathId,
      sourceReferenceId,
    }));
  }

  const isClaimed = (index) => isWithinClaimedRange(claimedRanges, index);

  // Document-level metadata.
  const doctypeMatch = text.match(/<!doctype\s+([^>\s]+)[^>]*>/i);
  const doctype = doctypeMatch !== null && !isClaimed(doctypeMatch.index) ? doctypeMatch[1].toLowerCase() : null;

  const htmlTagMatch = text.match(/<html\b([^>]*)>/i);
  const lang = htmlTagMatch !== null && !isClaimed(htmlTagMatch.index) ? (parsesAttributes(htmlTagMatch[1] ?? "").lang ?? null) : null;

  const titleMatch = text.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i);
  let title = null;
  if (titleMatch !== null && !isClaimed(titleMatch.index)) {
    title = decodesEntities(stripsTags(titleMatch[1]));
    pushElement({ kind: "title", tag: "title", attributes: {}, text: title, start: titleMatch.index, length: titleMatch[0].length });
  }

  for (const match of text.matchAll(/<meta\b([^>]*)\/?>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "meta", tag: "meta", attributes: attrs, text: null, start: match.index, length: match[0].length });
  }

  for (const match of text.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[2] ?? "");
    const headingText = decodesEntities(stripsTags(match[3]));
    pushElement({ kind: "heading", tag: `h${match[1]}`, attributes: attrs, text: headingText, start: match.index, length: match[0].length });
  }

  for (const match of text.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    const paragraphText = decodesEntities(stripsTags(match[2]));
    if (paragraphText.trim().length === 0) continue;
    pushElement({ kind: "paragraph", tag: "p", attributes: attrs, text: paragraphText, start: match.index, length: match[0].length });
  }

  for (const tag of landmarkTags) {
    for (const match of text.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "gi"))) {
      if (isClaimed(match.index)) continue;
      const attrs = parsesAttributes(match[1] ?? "");
      pushElement({ kind: "landmark", tag, attributes: attrs, text: null, start: match.index, length: match[0].length });
    }
  }
  for (const match of text.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*\brole\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)[^>]*)>/gi)) {
    if (isClaimed(match.index)) continue;
    if (landmarkTags.includes(match[1].toLowerCase())) continue;
    const attrs = parsesAttributes(match[2] ?? "");
    pushElement({ kind: "landmark", tag: match[1].toLowerCase(), attributes: attrs, text: null, start: match.index, length: match[0].length });
  }

  for (const match of text.matchAll(/<form\b([^>]*)>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "form", tag: "form", attributes: attrs, text: null, start: match.index, length: match[0].length });
  }

  for (const match of text.matchAll(/<input\b([^>]*)\/?>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "control", tag: "input", attributes: attrs, text: null, start: match.index, length: match[0].length, idRefs: idRefsForAttributes(attrs) });
  }
  for (const match of text.matchAll(/<select\b([^>]*)>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "control", tag: "select", attributes: attrs, text: null, start: match.index, length: match[0].length, idRefs: idRefsForAttributes(attrs) });
  }
  for (const match of text.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "control", tag: "textarea", attributes: attrs, text: decodesEntities(match[2]), start: match.index, length: match[0].length, idRefs: idRefsForAttributes(attrs) });
  }
  for (const match of text.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "control", tag: "button", attributes: attrs, text: decodesEntities(stripsTags(match[2])), start: match.index, length: match[0].length, idRefs: idRefsForAttributes(attrs) });
  }
  for (const match of text.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    pushElement({ kind: "label", tag: "label", attributes: attrs, text: decodesEntities(stripsTags(match[2])), start: match.index, length: match[0].length, idRefs: idRefsForAttributes(attrs) });
  }

  for (const match of text.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    const linkText = decodesEntities(stripsTags(match[2]));
    const { sourceReferenceId } = pushElement({ kind: "link", tag: "a", attributes: attrs, text: linkText, start: match.index, length: match[0].length });
    if (typeof attrs.href === "string" && attrs.href.length > 0) {
      rawReferences.push(Object.freeze({ edgeKind: "html-anchor-navigation", candidateTarget: attrs.href, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
  }

  for (const match of text.matchAll(/<img\b([^>]*)\/?>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    const { sourceReferenceId } = pushElement({ kind: "image", tag: "img", attributes: attrs, text: null, start: match.index, length: match[0].length });
    if (typeof attrs.src === "string" && attrs.src.length > 0) {
      rawReferences.push(Object.freeze({ edgeKind: "html-image-src", candidateTarget: attrs.src, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
    for (const url of parsesSrcsetUrls(attrs.srcset ?? "")) {
      rawReferences.push(Object.freeze({ edgeKind: "html-source-srcset", candidateTarget: url, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
  }
  for (const match of text.matchAll(/<source\b([^>]*)\/?>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    const { sourceReferenceId } = pushElement({ kind: "image", tag: "source", attributes: attrs, text: null, start: match.index, length: match[0].length });
    if (typeof attrs.src === "string" && attrs.src.length > 0) {
      rawReferences.push(Object.freeze({ edgeKind: "html-image-src", candidateTarget: attrs.src, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
    for (const url of parsesSrcsetUrls(attrs.srcset ?? "")) {
      rawReferences.push(Object.freeze({ edgeKind: "html-source-srcset", candidateTarget: url, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
  }

  for (const match of text.matchAll(/<link\b([^>]*)\/?>/gi)) {
    if (isClaimed(match.index)) continue;
    const attrs = parsesAttributes(match[1] ?? "");
    const { sourceReferenceId } = pushElement({ kind: "link-ref", tag: "link", attributes: attrs, text: null, start: match.index, length: match[0].length });
    const rel = (attrs.rel ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("stylesheet") && typeof attrs.href === "string" && attrs.href.length > 0) {
      rawReferences.push(Object.freeze({ edgeKind: "html-stylesheet-href", candidateTarget: attrs.href, resolvedSyntheticPathId: null, sourceReferenceId }));
    }
  }

  const documentReference = addRef("html-document", "Document", 0, text.length);

  return Object.freeze({
    document: Object.freeze({
      documentId,
      pathId,
      relativePath,
      rootId,
      contentHash,
      doctype,
      lang,
      title,
      sourceReferenceId: documentReference.referenceId,
    }),
    elements: Object.freeze(elements),
    rawReferences: Object.freeze(rawReferences),
    inlineScripts: Object.freeze(inlineScripts),
    inlineStyles: Object.freeze(inlineStyles),
    sourceReferences: Object.freeze(sourceReferences),
    diagnostics: Object.freeze(diagnostics),
  });
}

function idRefsForAttributes(attrs) {
  const idRefs = [];
  if (typeof attrs.for === "string" && attrs.for.length > 0) idRefs.push({ attribute: "for", targetId: attrs.for });
  for (const attribute of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
    const value = attrs[attribute];
    if (typeof value !== "string" || value.length === 0) continue;
    for (const targetId of value.split(/\s+/).filter((token) => token.length > 0)) {
      idRefs.push({ attribute, targetId });
    }
  }
  return idRefs;
}

function parsesSrcsetUrls(value) {
  if (value.length === 0) return [];
  return value.split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((url) => url !== undefined && url.length > 0);
}

function parsesAttributes(attributeText) {
  const attributes = {};
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of attributeText.matchAll(pattern)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    attributes[name] = decodesEntities(value);
  }
  return attributes;
}

function decodesEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, entity) => {
    if (entity[0] === "#") {
      const codePoint = entity[1]?.toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? whole : String.fromCodePoint(codePoint);
    }
    return namedEntities[entity.toLowerCase()] ?? whole;
  });
}

function stripsTags(value) {
  return value.replace(/<[^>]*>/g, "");
}

function isWithinClaimedRange(claimedRanges, index) {
  for (const [start, end] of claimedRanges) {
    if (index >= start && index < end) return true;
  }
  return false;
}

function buildsDiagnostic({ scope, relativePath, kind, message, lineStarts, start }) {
  const position = resolvesLineAndColumn(lineStarts, start);
  return Object.freeze({
    diagnosticId: sha256(`${relativePath}\0${scope}\0${kind}\0${start}`),
    scope,
    relativePath,
    kind,
    message,
    line: position.line,
    column: position.column,
  });
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
