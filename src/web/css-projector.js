import { createHash } from "node:crypto";
import { buildsLineStarts, resolvesLineAndColumn } from "../lib/text-positions.js";
import { addSourceReference } from "../lib/source-reference.js";

export function projectsCssStylesheet({
  stylesheetId,
  origin,
  pathId = null,
  relativePath = null,
  hostDocumentId = null,
  contentHash,
  modulePath,
  text,
  hostText = text,
  baseOffset = { start: 0, line: 1, column: 1 },
}) {
  const lineStarts = buildsLineStarts(text);
  const referenceById = new Set();
  const sourceReferences = [];
  const diagnostics = [];
  const rules = [];
  const declarations = [];
  const rawReferences = [];
  let cursor = 0;

  parsesStatements(null);

  const stylesheetReference = addRef("css-stylesheet", "Stylesheet", 0, text.length);

  return Object.freeze({
    stylesheet: Object.freeze({
      stylesheetId,
      origin,
      pathId,
      relativePath,
      hostDocumentId,
      contentHash,
      sourceReferenceId: stylesheetReference.referenceId,
    }),
    rules: Object.freeze(rules),
    declarations: Object.freeze(declarations),
    rawReferences: Object.freeze(rawReferences),
    sourceReferences: Object.freeze(sourceReferences),
    diagnostics: Object.freeze(diagnostics),
  });

  function parsesStatements(parentRuleId) {
    while (true) {
      skipsWhitespaceAndComments();
      if (cursor >= text.length) return;
      if (text[cursor] === "}") {
        if (parentRuleId !== null) return;
        diagnostics.push(buildsDiagnostic("unexpected-closing-brace", cursor, "unmatched } at the top level of the stylesheet"));
        cursor++;
        continue;
      }
      const boundary = findsStatementBoundary(cursor);
      if (boundary.kind === "eof") {
        diagnostics.push(buildsDiagnostic("unterminated-block", cursor, "statement ran to end of file without a closing ; or }"));
        cursor = text.length;
        return;
      }
      if (boundary.kind === "eof-string") {
        diagnostics.push(buildsDiagnostic("unterminated-string", cursor, "a quoted string was not closed before end of file"));
        cursor = text.length;
        return;
      }
      if (boundary.kind === "block") {
        parsesRuleOrAtRuleWithBlock(parentRuleId, boundary.index);
        continue;
      }
      const raw = text.slice(cursor, boundary.index).trim();
      if (raw.startsWith("@")) {
        parsesAtRuleStatement(parentRuleId, boundary.index);
        continue;
      }
      parsesDeclaration(parentRuleId, boundary.index);
    }
  }

  function parsesRuleOrAtRuleWithBlock(parentRuleId, braceIndex) {
    const start = cursor;
    const preludeRaw = text.slice(cursor, braceIndex).trim();
    cursor = braceIndex + 1;
    const isAtRule = preludeRaw.startsWith("@");
    const atMatch = isAtRule ? preludeRaw.match(/^@([a-zA-Z-]+)\s*([\s\S]*)$/) : null;
    const atKeyword = atMatch ? atMatch[1].toLowerCase() : null;
    const prelude = isAtRule ? (atMatch ? atMatch[2].trim() : "") : preludeRaw;
    const ruleId = sha256(`${stylesheetId}\0${start}`);

    parsesStatements(ruleId);
    if (cursor < text.length && text[cursor] === "}") {
      cursor++;
    } else {
      diagnostics.push(buildsDiagnostic("unterminated-block", start, "rule block was not closed with }"));
    }

    const length = cursor - start;
    const reference = addRef("css-rule", isAtRule ? "AtRule" : "StyleRule", start, length);
    rules.push(Object.freeze({
      ruleId,
      stylesheetId,
      ruleKind: isAtRule ? "at-rule" : "style-rule",
      atKeyword,
      prelude,
      parentRuleId,
      sourceReferenceId: reference.referenceId,
    }));
  }

  function parsesAtRuleStatement(parentRuleId, semicolonIndex) {
    const start = cursor;
    const preludeRaw = text.slice(cursor, semicolonIndex).trim();
    cursor = semicolonIndex + 1;
    const match = preludeRaw.match(/^@([a-zA-Z-]+)\s*([\s\S]*)$/);
    const atKeyword = match ? match[1].toLowerCase() : null;
    const prelude = match ? match[2].trim() : "";
    const ruleId = sha256(`${stylesheetId}\0${start}`);
    const length = cursor - start;
    const reference = addRef("css-rule", "AtRule", start, length);
    rules.push(Object.freeze({
      ruleId,
      stylesheetId,
      ruleKind: "at-rule",
      atKeyword,
      prelude,
      parentRuleId,
      sourceReferenceId: reference.referenceId,
    }));
    if (atKeyword === "import") {
      const target = extractsImportTarget(prelude);
      if (target !== null) {
        rawReferences.push(Object.freeze({ edgeKind: "css-import", candidateTarget: target, resolvedSyntheticPathId: null, sourceReferenceId: reference.referenceId }));
      }
    }
  }

  function parsesDeclaration(ruleId, delimiterIndex) {
    const start = cursor;
    const terminatedBySemicolon = text[delimiterIndex] === ";";
    const raw = text.slice(cursor, delimiterIndex);
    cursor = terminatedBySemicolon ? delimiterIndex + 1 : delimiterIndex;
    if (ruleId === null) {
      diagnostics.push(buildsDiagnostic("declaration-outside-rule", start, "a declaration appeared outside of any rule block"));
      return;
    }
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) {
      diagnostics.push(buildsDiagnostic("malformed-declaration", start, "declaration is missing a ':' between property and value"));
      return;
    }
    const propertyName = raw.slice(0, colonIndex).trim();
    let value = raw.slice(colonIndex + 1).trim();
    let important = false;
    const importantMatch = value.match(/!\s*important\s*$/i);
    if (importantMatch) {
      important = true;
      value = value.slice(0, importantMatch.index).trim();
    }
    const length = cursor - start;
    const reference = addRef("css-declaration", "Declaration", start, length);
    const declarationId = sha256(`${ruleId}\0${start}`);
    declarations.push(Object.freeze({
      declarationId,
      ruleId,
      propertyName,
      value,
      important,
      isCustomProperty: propertyName.startsWith("--"),
      sourceReferenceId: reference.referenceId,
    }));
    for (const url of extractsUrls(value)) {
      rawReferences.push(Object.freeze({ edgeKind: "css-url", candidateTarget: url, resolvedSyntheticPathId: null, sourceReferenceId: reference.referenceId }));
    }
  }

  function findsStatementBoundary(startCursor) {
    let index = startCursor;
    let parenDepth = 0;
    while (index < text.length) {
      const character = text[index];
      if (character === "\"" || character === "'") {
        const stringEnd = scansString(index, character);
        if (stringEnd === -1) return { kind: "eof-string", index: text.length };
        index = stringEnd;
        continue;
      }
      if (character === "/" && text[index + 1] === "*") {
        const close = text.indexOf("*/", index + 2);
        if (close === -1) return { kind: "eof", index: text.length };
        index = close + 2;
        continue;
      }
      if (character === "(") {
        parenDepth++;
        index++;
        continue;
      }
      if (character === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
        index++;
        continue;
      }
      if (parenDepth === 0) {
        if (character === "{") return { kind: "block", index };
        if (character === ";") return { kind: "declaration", index };
        if (character === "}") return { kind: "declaration", index };
      }
      index++;
    }
    return { kind: "eof", index: text.length };
  }

  function scansString(startIndex, quote) {
    let index = startIndex + 1;
    while (index < text.length) {
      const character = text[index];
      if (character === "\\") {
        index += 2;
        continue;
      }
      if (character === quote) return index + 1;
      index++;
    }
    return -1;
  }

  function skipsWhitespaceAndComments() {
    while (cursor < text.length) {
      const character = text[cursor];
      if (/\s/u.test(character)) {
        cursor++;
        continue;
      }
      if (character === "/" && text[cursor + 1] === "*") {
        const close = text.indexOf("*/", cursor + 2);
        if (close === -1) {
          diagnostics.push(buildsDiagnostic("unterminated-comment", cursor, "/* was not closed with */"));
          cursor = text.length;
          return;
        }
        cursor = close + 2;
        continue;
      }
      break;
    }
  }

  function addRef(kind, sourceKind, start, length) {
    const absoluteStart = baseOffset.start + start;
    const position = translatesPosition(start);
    return addSourceReference({
      kind,
      sourceKind,
      location: { start: absoluteStart, length, line: position.line, column: position.column },
      modulePath,
      sourceText: hostText,
      referenceById,
      sourceReferences,
    });
  }

  function translatesPosition(offset) {
    const internal = resolvesLineAndColumn(lineStarts, offset);
    if (internal.line === 1) return { line: baseOffset.line, column: baseOffset.column + internal.column - 1 };
    return { line: baseOffset.line + internal.line - 1, column: internal.column };
  }

  function buildsDiagnostic(kind, offset, message) {
    return Object.freeze({
      diagnosticId: sha256(`${modulePath}\0css\0${kind}\0${baseOffset.start + offset}`),
      scope: "css",
      relativePath: modulePath,
      kind,
      message,
      ...translatesPosition(offset),
    });
  }
}

function extractsUrls(value) {
  const urls = [];
  for (const match of value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
    const url = (match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (url.length > 0) urls.push(url);
  }
  return urls;
}

function extractsImportTarget(prelude) {
  const urlMatch = prelude.match(/^url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/i);
  if (urlMatch !== null) return (urlMatch[1] ?? urlMatch[2] ?? urlMatch[3] ?? "").trim() || null;
  const stringMatch = prelude.match(/^(?:"([^"]*)"|'([^']*)')/);
  if (stringMatch !== null) return stringMatch[1] ?? stringMatch[2] ?? null;
  return null;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
