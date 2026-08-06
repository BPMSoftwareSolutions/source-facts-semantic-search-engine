import ts from "typescript";

export class DeterministicMechanicLoweringError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DeterministicMechanicLoweringError";
    this.code = code;
  }
}

export function lowersDeterministicMechanicAuthority({
  mechanicOccurrenceId,
  mechanicKind,
  artifactId,
  artifactDigest,
  sourceText,
  startLine,
  startColumn,
} = {}) {
  requiresString("mechanicOccurrenceId", mechanicOccurrenceId);
  requiresString("artifactId", artifactId);
  requiresString("artifactDigest", artifactDigest);
  requiresString("sourceText", sourceText, { allowEmpty: true });
  requiresPositiveInteger("startLine", startLine);
  requiresPositiveInteger("startColumn", startColumn);
  if (mechanicKind !== "branch") {
    throw new DeterministicMechanicLoweringError(
      "MECHANIC_FAMILY_NOT_DETERMINISTICALLY_LOWERABLE",
      `Mechanic kind '${mechanicKind}' is not supported by the deterministic lowerer.`,
    );
  }

  const sourceFile = ts.createSourceFile(
    artifactId,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKindForPath(artifactId),
  );
  const node = findsNodeAtLocation(sourceFile, startLine, startColumn);
  if (node === null) {
    throw new DeterministicMechanicLoweringError(
      "MECHANIC_SOURCE_NODE_NOT_FOUND",
      `No branch node starts at ${artifactId}:${startLine}:${startColumn}.`,
    );
  }

  const lowered = ts.isIfStatement(node)
    ? lowersIfStatement(node, sourceFile, mechanicOccurrenceId)
    : lowersConditionalExpression(node, sourceFile, mechanicOccurrenceId);
  return Object.freeze({
    disposition: "DETERMINISTIC_MECHANIC_AUTHORITY_PROJECTED",
    derivationKind: "typescript-ast-lowering.v1",
    mechanicOccurrenceId,
    mechanicKind,
    artifactId,
    artifactDigest,
    startLine,
    startColumn,
    sourceKind: ts.SyntaxKind[node.kind],
    authorityData: deeplyFreezes(lowered),
  });
}

function lowersIfStatement(node, sourceFile, mechanicOccurrenceId) {
  const predicate = lowersExpression(node.expression, sourceFile);
  const matchedOutcome = "BRANCH_MATCHED";
  const noMatchOutcome = "BRANCH_NOT_MATCHED";
  return {
    authorityKind: "decision-authority.v1",
    candidateAuthorityId: `candidate-${mechanicOccurrenceId}`,
    inputs: collectsReferencePaths(predicate),
    rules: [{
      ruleId: `match-${mechanicOccurrenceId}`,
      predicate,
      outcomeId: matchedOutcome,
    }],
    outcomes: [
      { outcomeId: matchedOutcome, effects: lowersStatementBody(node.thenStatement, sourceFile) },
      {
        outcomeId: noMatchOutcome,
        effects: node.elseStatement === undefined ? [] : lowersStatementBody(node.elseStatement, sourceFile),
        continuation: node.elseStatement === undefined ? "CONTINUE_AFTER_BRANCH" : "EXECUTE_ELSE_BRANCH",
      },
    ],
    noMatchDisposition: noMatchOutcome,
  };
}

function lowersConditionalExpression(node, sourceFile, mechanicOccurrenceId) {
  const predicate = lowersExpression(node.condition, sourceFile);
  return {
    authorityKind: "decision-authority.v1",
    candidateAuthorityId: `candidate-${mechanicOccurrenceId}`,
    inputs: collectsReferencePaths(predicate),
    rules: [{
      ruleId: `match-${mechanicOccurrenceId}`,
      predicate,
      outcomeId: "CONDITION_TRUE",
    }],
    outcomes: [
      { outcomeId: "CONDITION_TRUE", result: lowersExpression(node.whenTrue, sourceFile) },
      { outcomeId: "CONDITION_FALSE", result: lowersExpression(node.whenFalse, sourceFile) },
    ],
    noMatchDisposition: "CONDITION_FALSE",
  };
}

function findsNodeAtLocation(sourceFile, line, column) {
  let exact = null;
  function visit(node) {
    if (ts.isIfStatement(node) || ts.isConditionalExpression(node)) {
      const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      if (location.line + 1 === line && location.character + 1 === column) exact = node;
    }
    if (exact === null) ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return exact;
}

function lowersStatementBody(statement, sourceFile) {
  const statements = ts.isBlock(statement) ? statement.statements : [statement];
  return statements.map((child) => lowersStatement(child, sourceFile));
}

function lowersStatement(node, sourceFile) {
  if (ts.isExpressionStatement(node)) return { kind: "evaluate", expression: lowersExpression(node.expression, sourceFile) };
  if (ts.isReturnStatement(node)) return { kind: "return", result: node.expression === undefined ? null : lowersExpression(node.expression, sourceFile) };
  if (ts.isThrowStatement(node)) return { kind: "throw", error: lowersExpression(node.expression, sourceFile) };
  if (ts.isVariableStatement(node)) {
    return {
      kind: "declare",
      declarationKind: declarationKind(node.declarationList),
      bindings: node.declarationList.declarations.map((declaration) => ({
        binding: lowersBindingName(declaration.name, sourceFile),
        initializer: declaration.initializer === undefined ? null : lowersExpression(declaration.initializer, sourceFile),
      })),
    };
  }
  if (ts.isIfStatement(node)) {
    return {
      kind: "branch",
      predicate: lowersExpression(node.expression, sourceFile),
      whenTrue: lowersStatementBody(node.thenStatement, sourceFile),
      whenFalse: node.elseStatement === undefined ? [] : lowersStatementBody(node.elseStatement, sourceFile),
    };
  }
  if (ts.isBlock(node)) return { kind: "block", effects: node.statements.map((child) => lowersStatement(child, sourceFile)) };
  if (ts.isEmptyStatement(node)) return { kind: "noop" };
  unsupported(node, sourceFile, "statement");
}

function lowersExpression(node, sourceFile) {
  if (ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
    return lowersExpression(node.expression, sourceFile);
  }
  if (ts.isIdentifier(node)) return { kind: "reference", path: [node.text] };
  if (node.kind === ts.SyntaxKind.ThisKeyword) return { kind: "reference", path: ["this"] };
  if (node.kind === ts.SyntaxKind.NullKeyword) return { kind: "literal", literalType: "null", value: null };
  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
    return { kind: "literal", literalType: "boolean", value: node.kind === ts.SyntaxKind.TrueKeyword };
  }
  if (ts.isStringLiteralLike(node)) return { kind: "literal", literalType: "string", value: node.text };
  if (ts.isNumericLiteral(node)) return { kind: "literal", literalType: "number", value: Number(node.text.replaceAll("_", "")) };
  if (ts.isPropertyAccessExpression(node)) {
    const target = lowersExpression(node.expression, sourceFile);
    if (target.kind === "reference") return { kind: "reference", path: [...target.path, node.name.text] };
    return { kind: "member", target, property: node.name.text };
  }
  if (ts.isElementAccessExpression(node)) {
    return {
      kind: "element",
      target: lowersExpression(node.expression, sourceFile),
      index: lowersExpression(node.argumentExpression, sourceFile),
    };
  }
  if (ts.isBinaryExpression(node)) {
    return {
      kind: "binary",
      operator: ts.tokenToString(node.operatorToken.kind) ?? ts.SyntaxKind[node.operatorToken.kind],
      left: lowersExpression(node.left, sourceFile),
      right: lowersExpression(node.right, sourceFile),
    };
  }
  if (ts.isPrefixUnaryExpression(node)) {
    return { kind: "unary", operator: ts.tokenToString(node.operator) ?? ts.SyntaxKind[node.operator], operand: lowersExpression(node.operand, sourceFile) };
  }
  if (ts.isTypeOfExpression(node)) return { kind: "unary", operator: "typeof", operand: lowersExpression(node.expression, sourceFile) };
  if (ts.isVoidExpression(node)) return { kind: "unary", operator: "void", operand: lowersExpression(node.expression, sourceFile) };
  if (ts.isDeleteExpression(node)) return { kind: "unary", operator: "delete", operand: lowersExpression(node.expression, sourceFile) };
  if (ts.isAwaitExpression(node)) return { kind: "await", operation: lowersExpression(node.expression, sourceFile) };
  if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
    return {
      kind: ts.isNewExpression(node) ? "construct" : "call",
      callee: lowersExpression(node.expression, sourceFile),
      arguments: (node.arguments ?? []).map((argument) => lowersExpression(argument, sourceFile)),
    };
  }
  if (ts.isObjectLiteralExpression(node)) {
    return {
      kind: "object",
      fields: node.properties.map((property) => lowersObjectProperty(property, sourceFile)),
    };
  }
  if (ts.isArrayLiteralExpression(node)) return { kind: "array", items: node.elements.map((element) => lowersExpression(element, sourceFile)) };
  if (ts.isConditionalExpression(node)) {
    return {
      kind: "conditional",
      predicate: lowersExpression(node.condition, sourceFile),
      whenTrue: lowersExpression(node.whenTrue, sourceFile),
      whenFalse: lowersExpression(node.whenFalse, sourceFile),
    };
  }
  if (ts.isTemplateExpression(node)) {
    return {
      kind: "template",
      head: node.head.text,
      spans: node.templateSpans.map((span) => ({ expression: lowersExpression(span.expression, sourceFile), literal: span.literal.text })),
    };
  }
  if (ts.isNoSubstitutionTemplateLiteral(node)) return { kind: "literal", literalType: "string", value: node.text };
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    return {
      kind: "function",
      parameters: node.parameters.map((parameter) => lowersBindingName(parameter.name, sourceFile)),
      body: ts.isBlock(node.body) ? node.body.statements.map((statement) => lowersStatement(statement, sourceFile)) : [{ kind: "return", result: lowersExpression(node.body, sourceFile) }],
    };
  }
  unsupported(node, sourceFile, "expression");
}

function lowersObjectProperty(property, sourceFile) {
  if (ts.isPropertyAssignment(property)) return { kind: "field", name: propertyName(property.name, sourceFile), value: lowersExpression(property.initializer, sourceFile) };
  if (ts.isShorthandPropertyAssignment(property)) return { kind: "field", name: property.name.text, value: { kind: "reference", path: [property.name.text] } };
  if (ts.isSpreadAssignment(property)) return { kind: "spread", value: lowersExpression(property.expression, sourceFile) };
  unsupported(property, sourceFile, "object property");
}

function lowersBindingName(name, sourceFile) {
  if (ts.isIdentifier(name)) return { kind: "binding", name: name.text };
  if (ts.isObjectBindingPattern(name)) {
    return { kind: "object-binding", elements: name.elements.map((element) => ({ name: lowersBindingName(element.name, sourceFile), property: element.propertyName === undefined ? null : propertyName(element.propertyName, sourceFile) })) };
  }
  if (ts.isArrayBindingPattern(name)) {
    return { kind: "array-binding", elements: name.elements.map((element) => ts.isOmittedExpression(element) ? null : lowersBindingName(element.name, sourceFile)) };
  }
  unsupported(name, sourceFile, "binding");
}

function propertyName(name, sourceFile) {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name)) return JSON.stringify(lowersExpression(name.expression, sourceFile));
  unsupported(name, sourceFile, "property name");
}

function collectsReferencePaths(root) {
  const seen = new Set();
  const paths = [];
  function visit(value) {
    if (value === null || typeof value !== "object") return;
    if (value.kind === "reference") {
      const path = value.path.join(".");
      if (!seen.has(path)) {
        seen.add(path);
        paths.push(path);
      }
      return;
    }
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) child.forEach(visit);
      else visit(child);
    }
  }
  visit(root);
  return paths;
}

function declarationKind(list) {
  if ((list.flags & ts.NodeFlags.Const) !== 0) return "const";
  if ((list.flags & ts.NodeFlags.Let) !== 0) return "let";
  return "var";
}

function unsupported(node, sourceFile, role) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  throw new DeterministicMechanicLoweringError(
    "MECHANIC_SYNTAX_NOT_DETERMINISTICALLY_LOWERABLE",
    `Unsupported ${role} ${ts.SyntaxKind[node.kind]} at ${sourceFile.fileName}:${location.line + 1}:${location.character + 1}.`,
  );
}

function scriptKindForPath(filePath) {
  if (/\.tsx$/iu.test(filePath)) return ts.ScriptKind.TSX;
  if (/\.(?:ts|mts|cts)$/iu.test(filePath)) return ts.ScriptKind.TS;
  if (/\.jsx$/iu.test(filePath)) return ts.ScriptKind.JSX;
  if (/\.json$/iu.test(filePath)) return ts.ScriptKind.JSON;
  return ts.ScriptKind.JS;
}

function requiresString(name, value, { allowEmpty = false } = {}) {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0)) throw new Error(`${name} is required.`);
}

function requiresPositiveInteger(name, value) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`);
}

function deeplyFreezes(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deeplyFreezes(child);
  return Object.freeze(value);
}
