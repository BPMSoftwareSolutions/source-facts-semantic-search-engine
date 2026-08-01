import { createHash } from "node:crypto";
import ts from "typescript";
import { buildsLineStarts, resolvesLineAndColumn } from "../lib/text-positions.js";
import { addSourceReference } from "../lib/source-reference.js";

const jsxCapableExtensions = Object.freeze(new Set([".tsx", ".jsx"]));
const maxExpressionSnippetLength = 160;

export function projectsJsxOrTsFile({ pathId, relativePath, text }) {
  const extension = relativePath.slice(relativePath.lastIndexOf(".")).toLowerCase();
  const scriptKind = extension === ".tsx" ? ts.ScriptKind.TSX : extension === ".jsx" ? ts.ScriptKind.JSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true, scriptKind);
  const lineStarts = buildsLineStarts(text);
  const referenceById = new Set();
  const sourceReferences = [];
  const rawReferences = [];
  const jsxElements = [];

  const addRef = (kind, sourceKind, node) => {
    const start = node.getStart(sourceFile);
    const end = node.getEnd();
    const position = resolvesLineAndColumn(lineStarts, start);
    return addSourceReference({
      kind,
      sourceKind,
      location: { start, length: end - start, line: position.line, column: position.column },
      modulePath: relativePath,
      sourceText: text,
      referenceById,
      sourceReferences,
    });
  };

  const importBindings = collectsImportBindings(sourceFile);

  ts.forEachChild(sourceFile, function walksForImports(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const reference = addRef("js-import", "ImportDeclaration", node);
      rawReferences.push(Object.freeze({
        edgeKind: "js-static-import",
        candidateTarget: node.moduleSpecifier.text,
        resolvedSyntheticPathId: null,
        sourceReferenceId: reference.referenceId,
      }));
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier !== undefined && ts.isStringLiteral(node.moduleSpecifier)) {
      const reference = addRef("js-import", "ExportDeclaration", node);
      rawReferences.push(Object.freeze({
        edgeKind: "js-static-import",
        candidateTarget: node.moduleSpecifier.text,
        resolvedSyntheticPathId: null,
        sourceReferenceId: reference.referenceId,
      }));
    } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "require" && node.arguments.length > 0 && ts.isStringLiteral(node.arguments[0])) {
      const reference = addRef("js-import", "CallExpression", node);
      rawReferences.push(Object.freeze({
        edgeKind: "js-static-import",
        candidateTarget: node.arguments[0].text,
        resolvedSyntheticPathId: null,
        sourceReferenceId: reference.referenceId,
      }));
    } else if (ts.isImportCall(node) && node.arguments.length > 0 && ts.isStringLiteral(node.arguments[0])) {
      const reference = addRef("js-import", "ImportCall", node);
      rawReferences.push(Object.freeze({
        edgeKind: "js-dynamic-import-candidate",
        candidateTarget: node.arguments[0].text,
        resolvedSyntheticPathId: null,
        sourceReferenceId: reference.referenceId,
      }));
    }
    ts.forEachChild(node, walksForImports);
  });

  if (jsxCapableExtensions.has(extension)) {
    ts.forEachChild(sourceFile, (child) => walksForJsx(child, { sourceFile, text, addRef, importBindings, rawReferences, jsxElements, pathId }, null, 0));
  }

  return Object.freeze({
    jsxElements: Object.freeze(jsxElements),
    rawReferences: Object.freeze(rawReferences),
    sourceReferences: Object.freeze(sourceReferences),
  });
}

function walksForJsx(node, context, parentJsxElementId, depth) {
  if (ts.isJsxElement(node)) {
    const elementId = recordsJsxElement(context, node.openingElement.tagName, node.openingElement.attributes, node, parentJsxElementId, depth);
    for (const child of node.children) walksForJsx(child, context, elementId, depth + 1);
    return;
  }
  if (ts.isJsxSelfClosingElement(node)) {
    recordsJsxElement(context, node.tagName, node.attributes, node, parentJsxElementId, depth);
    return;
  }
  if (ts.isJsxFragment(node)) {
    const elementId = recordsFragmentElement(context, node, parentJsxElementId, depth);
    for (const child of node.children) walksForJsx(child, context, elementId, depth + 1);
    return;
  }
  ts.forEachChild(node, (child) => walksForJsx(child, context, parentJsxElementId, depth));
}

function recordsJsxElement(context, tagNameNode, attributesNode, locationNode, parentJsxElementId, depth) {
  const { sourceFile, text, addRef, importBindings, rawReferences, jsxElements, pathId } = context;
  const tagName = tagNameNode.getText(sourceFile);
  const firstSegment = tagName.split(".")[0].replace(/^\{|\}$/gu, "");
  const tagKind = /^[a-z]/u.test(firstSegment) ? "intrinsic" : "component";
  const reference = addRef("jsx-element", "JsxElement", locationNode);
  const jsxElementId = sha256(`${pathId}\0${tagName}\0${locationNode.getStart(sourceFile)}`);

  jsxElements.push(Object.freeze({
    jsxElementId,
    pathId,
    tagName,
    tagKind,
    attributes: Object.freeze(describesJsxAttributes(attributesNode, sourceFile, text)),
    parentJsxElementId,
    depth,
    sourceReferenceId: reference.referenceId,
  }));

  if (tagKind === "component") {
    const moduleSpecifier = importBindings.get(firstSegment);
    if (moduleSpecifier !== undefined) {
      rawReferences.push(Object.freeze({
        edgeKind: "jsx-component-reference",
        candidateTarget: moduleSpecifier,
        resolvedSyntheticPathId: null,
        sourceReferenceId: reference.referenceId,
      }));
    }
  }

  return jsxElementId;
}

function recordsFragmentElement(context, node, parentJsxElementId, depth) {
  const { sourceFile, addRef, jsxElements, pathId } = context;
  const reference = addRef("jsx-element", "JsxFragment", node);
  const jsxElementId = sha256(`${pathId}\0<>\0${node.getStart(sourceFile)}`);
  jsxElements.push(Object.freeze({
    jsxElementId,
    pathId,
    tagName: "<>",
    tagKind: "fragment",
    attributes: Object.freeze([]),
    parentJsxElementId,
    depth,
    sourceReferenceId: reference.referenceId,
  }));
  return jsxElementId;
}

function describesJsxAttributes(attributesNode, sourceFile, text) {
  const attributes = [];
  for (const property of attributesNode.properties) {
    if (ts.isJsxSpreadAttribute(property)) {
      attributes.push({
        name: null,
        valueKind: "spread",
        value: truncatesText(text.slice(property.expression.getStart(sourceFile), property.expression.getEnd())),
      });
      continue;
    }
    const name = property.name.getText(sourceFile);
    if (property.initializer === undefined) {
      attributes.push({ name, valueKind: "boolean", value: "true" });
      continue;
    }
    if (ts.isStringLiteral(property.initializer)) {
      attributes.push({ name, valueKind: "string", value: property.initializer.text });
      continue;
    }
    if (ts.isJsxExpression(property.initializer) && property.initializer.expression !== undefined) {
      const expression = property.initializer.expression;
      if (expression.kind === ts.SyntaxKind.TrueKeyword || expression.kind === ts.SyntaxKind.FalseKeyword) {
        attributes.push({ name, valueKind: "boolean", value: expression.kind === ts.SyntaxKind.TrueKeyword ? "true" : "false" });
        continue;
      }
      if (ts.isStringLiteral(expression)) {
        attributes.push({ name, valueKind: "string", value: expression.text });
        continue;
      }
      if (ts.isNumericLiteral(expression)) {
        attributes.push({ name, valueKind: "number", value: expression.text });
        continue;
      }
      attributes.push({ name, valueKind: "expression", value: truncatesText(text.slice(expression.getStart(sourceFile), expression.getEnd())) });
      continue;
    }
    attributes.push({ name, valueKind: "expression", value: null });
  }
  return attributes;
}

function collectsImportBindings(sourceFile) {
  const bindings = new Map();
  ts.forEachChild(sourceFile, function walksForBindings(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.importClause !== undefined) {
      const specifier = node.moduleSpecifier.text;
      const clause = node.importClause;
      if (clause.name !== undefined) bindings.set(clause.name.text, specifier);
      if (clause.namedBindings !== undefined) {
        if (ts.isNamespaceImport(clause.namedBindings)) {
          bindings.set(clause.namedBindings.name.text, specifier);
        } else if (ts.isNamedImports(clause.namedBindings)) {
          for (const element of clause.namedBindings.elements) bindings.set(element.name.text, specifier);
        }
      }
    }
    ts.forEachChild(node, walksForBindings);
  });
  return bindings;
}

function truncatesText(value) {
  const collapsed = value.replace(/\s+/gu, " ").trim();
  return collapsed.length > maxExpressionSnippetLength ? `${collapsed.slice(0, maxExpressionSnippetLength - 3)}...` : collapsed;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
