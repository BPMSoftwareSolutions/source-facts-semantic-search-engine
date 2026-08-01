import { createHash } from "node:crypto";
import ts from "typescript";
import { buildsLineStarts, resolvesLineAndColumn } from "./lib/text-positions.js";
import { addSourceReference } from "./lib/source-reference.js";

const enclosingCallableKinds = Object.freeze(new Set(["function", "method", "constructor"]));
const maxCandidateTextLength = 160;

export function projectsDataflowFacts({ relativePath, sourceText, declarationRows, referenceById, sourceReferences }) {
  const sourceFile = ts.createSourceFile(relativePath, sourceText, ts.ScriptTarget.Latest, true, scriptKindForPath(relativePath));
  const context = {
    relativePath,
    sourceText,
    sourceFile,
    lineStarts: buildsLineStarts(sourceText),
    declarationRows,
    referenceById,
    sourceReferences,
    rows: [],
  };
  const scopeStack = [{ parameterNames: new Set(), localNames: new Set() }];
  ts.forEachChild(sourceFile, (child) => walksForDataflow(child, context, scopeStack));
  return Object.freeze(context.rows);
}

function walksForDataflow(node, context, scopeStack) {
  if (isFunctionLike(node)) {
    const frame = { parameterNames: new Set(), localNames: new Set() };
    for (const parameter of node.parameters ?? []) collectsBindingNames(parameter.name, frame.parameterNames);
    scopeStack.push(frame);
    ts.forEachChild(node, (child) => walksForDataflow(child, context, scopeStack));
    scopeStack.pop();
    return;
  }

  if (ts.isVariableDeclaration(node)) {
    const names = new Set();
    collectsBindingNames(node.name, names);
    const frame = scopeStack[scopeStack.length - 1];
    for (const name of names) frame.localNames.add(name);
    if (node.initializer !== undefined) {
      emitsAssignmentRow(context, scopeStack, node, node.name, node.initializer);
    }
    ts.forEachChild(node, (child) => walksForDataflow(child, context, scopeStack));
    return;
  }

  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
    emitsAssignmentRow(context, scopeStack, node, node.left, node.right);
  }
  if (ts.isReturnStatement(node) && node.expression !== undefined) {
    emitsReturnRow(context, scopeStack, node, node.expression);
  }
  if (ts.isCallExpression(node)) {
    emitsArgumentRows(context, scopeStack, node);
  }

  ts.forEachChild(node, (child) => walksForDataflow(child, context, scopeStack));
}

function emitsAssignmentRow(context, scopeStack, locationNode, targetNode, sourceNode) {
  const target = describesOperand(targetNode, context, scopeStack);
  const source = describesOperand(sourceNode, context, scopeStack);
  pushesRow(context, {
    dataflowKind: "assignment",
    fromCandidate: source.text,
    fromBindingKind: source.bindingKind,
    toCandidate: target.text,
    toBindingKind: target.bindingKind,
    toRole: "assignment-target",
    calleeCandidate: null,
    argumentIndex: null,
    locationNode,
  });
}

function emitsReturnRow(context, scopeStack, locationNode, expressionNode) {
  const source = describesOperand(expressionNode, context, scopeStack);
  pushesRow(context, {
    dataflowKind: "return",
    fromCandidate: source.text,
    fromBindingKind: source.bindingKind,
    toCandidate: null,
    toBindingKind: null,
    toRole: "return",
    calleeCandidate: null,
    argumentIndex: null,
    locationNode,
  });
}

function emitsArgumentRows(context, scopeStack, node) {
  const calleeText = truncatesText(context.sourceText.slice(node.expression.getStart(context.sourceFile), node.expression.getEnd()));
  node.arguments.forEach((argument, index) => {
    const source = describesOperand(argument, context, scopeStack);
    pushesRow(context, {
      dataflowKind: "argument",
      fromCandidate: source.text,
      fromBindingKind: source.bindingKind,
      toCandidate: null,
      toBindingKind: null,
      toRole: "argument",
      calleeCandidate: calleeText,
      argumentIndex: index,
      locationNode: argument,
    });
  });
}

function pushesRow(context, { dataflowKind, fromCandidate, fromBindingKind, toCandidate, toBindingKind, toRole, calleeCandidate, argumentIndex, locationNode }) {
  const start = locationNode.getStart(context.sourceFile);
  const end = locationNode.getEnd();
  const position = resolvesLineAndColumn(context.lineStarts, start);
  const enclosing = findsEnclosingCallable(context.declarationRows, start);
  const reference = addSourceReference({
    kind: "dataflow",
    sourceKind: ts.SyntaxKind[locationNode.kind],
    location: { start, length: end - start, line: position.line, column: position.column },
    modulePath: context.relativePath,
    sourceText: context.sourceText,
    referenceById: context.referenceById,
    sourceReferences: context.sourceReferences,
  });
  context.rows.push(Object.freeze({
    dataflowId: sha256(`${context.relativePath}\0${dataflowKind}\0${toRole}\0${start}`),
    dataflowKind,
    fromCandidate,
    fromBindingKind,
    toCandidate,
    toBindingKind,
    toRole,
    calleeCandidate,
    argumentIndex,
    enclosingSymbolId: enclosing?.symbolId ?? null,
    enclosingSymbolResolution: enclosing === null ? "unresolved" : "enclosing-callable",
    sourceReferenceId: reference.referenceId,
    modulePath: context.relativePath,
  }));
}

function describesOperand(node, context, scopeStack) {
  if (ts.isIdentifier(node)) {
    return { text: node.text, bindingKind: classifiesBinding(node.text, scopeStack) };
  }
  const text = context.sourceText.slice(node.getStart(context.sourceFile), node.getEnd());
  return { text: truncatesText(text), bindingKind: "unresolved" };
}

function classifiesBinding(name, scopeStack) {
  for (let index = scopeStack.length - 1; index >= 0; index--) {
    const frame = scopeStack[index];
    if (frame.parameterNames.has(name)) return "parameter";
    if (frame.localNames.has(name)) return "local-declaration";
  }
  return "unresolved";
}

function findsEnclosingCallable(declarationRows, position) {
  let best = null;
  for (const declaration of declarationRows) {
    if (!enclosingCallableKinds.has(declaration.kind)) continue;
    if (position < declaration.start || position >= declaration.end) continue;
    if (best === null || (declaration.end - declaration.start) < (best.end - best.start)) best = declaration;
  }
  return best;
}

function collectsBindingNames(node, names) {
  if (ts.isIdentifier(node)) {
    names.add(node.text);
    return;
  }
  if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
    for (const element of node.elements) {
      if (ts.isOmittedExpression(element)) continue;
      collectsBindingNames(element.name, names);
    }
  }
}

function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node)
    || ts.isFunctionExpression(node)
    || ts.isArrowFunction(node)
    || ts.isMethodDeclaration(node)
    || ts.isConstructorDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node);
}

function scriptKindForPath(relativePath) {
  const extension = relativePath.slice(relativePath.lastIndexOf(".")).toLowerCase();
  if (extension === ".tsx") return ts.ScriptKind.TSX;
  if (extension === ".ts" || extension === ".mts" || extension === ".cts") return ts.ScriptKind.TS;
  if (extension === ".jsx") return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function truncatesText(text) {
  const collapsed = text.replace(/\s+/gu, " ").trim();
  return collapsed.length > maxCandidateTextLength ? `${collapsed.slice(0, maxCandidateTextLength - 3)}...` : collapsed;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
