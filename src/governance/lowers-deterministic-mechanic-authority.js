import ts from "typescript";

export const deterministicMechanicLowererVersion = "typescript-mechanic-lowerer.v3";
export const deterministicBranchSyntaxProfile = "typescript-branch-authority.v2";
export const deterministicMechanicSyntaxProfile = "typescript-mechanic-authority.v1";

export const deterministicallyLowerableMechanicKinds = Object.freeze([
  "branch", "iteration", "exception-handling", "throw", "object-construction",
  "serialization", "normalization", "validation", "fallback", "retry",
  "state-mutation", "meaning-hidden-in-text",
]);

export class DeterministicMechanicLoweringError extends Error {
  constructor(code, message, requiredPrimitive = null) {
    super(message);
    this.name = "DeterministicMechanicLoweringError";
    this.code = code;
    this.requiredPrimitive = requiredPrimitive;
  }
}

export function lowersDeterministicMechanicAuthority({
  mechanicOccurrenceId,
  mechanicKind,
  artifactId,
  artifactDigest,
  executionAnalysisDigest = null,
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
  if (!deterministicallyLowerableMechanicKinds.includes(mechanicKind)) {
    throw new DeterministicMechanicLoweringError(
      "MECHANIC_FAMILY_NOT_DETERMINISTICALLY_LOWERABLE",
      `Mechanic kind '${mechanicKind}' is not supported by the deterministic lowerer.`,
      `${mechanicKind}-authority-lowerer`,
    );
  }

  const sourceFile = ts.createSourceFile(
    artifactId,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKindForPath(artifactId),
  );
  const node = findsNodeAtLocation(sourceFile, startLine, startColumn, mechanicKind);
  if (node === null) {
    throw new DeterministicMechanicLoweringError(
      "MECHANIC_SOURCE_NODE_NOT_FOUND",
      `No ${mechanicKind} node starts at ${artifactId}:${startLine}:${startColumn}.`,
      `source-node:${mechanicKind}`,
    );
  }

  const lowered = lowersMechanicNode(mechanicKind, node, sourceFile, mechanicOccurrenceId);
  return Object.freeze({
    disposition: "DETERMINISTIC_MECHANIC_AUTHORITY_PROJECTED",
    derivationKind: "typescript-ast-lowering.v1",
    lowererVersion: deterministicMechanicLowererVersion,
    mechanicOccurrenceId,
    mechanicKind,
    artifactId,
    artifactDigest,
    executionAnalysisDigest,
    startLine,
    startColumn,
    sourceKind: ts.SyntaxKind[node.kind],
    authorityData: deeplyFreezes(lowered),
  });
}

function lowersMechanicNode(mechanicKind, node, sourceFile, mechanicOccurrenceId) {
  if (mechanicKind === "branch") {
    return ts.isIfStatement(node)
      ? lowersIfStatement(node, sourceFile, mechanicOccurrenceId)
      : lowersConditionalExpression(node, sourceFile, mechanicOccurrenceId);
  }
  if (mechanicKind === "iteration") return lowersIteration(node, sourceFile, mechanicOccurrenceId);
  if (mechanicKind === "exception-handling") return lowersExceptionHandling(node, sourceFile, mechanicOccurrenceId);
  if (mechanicKind === "throw") return lowersThrow(node, sourceFile, mechanicOccurrenceId);
  if (mechanicKind === "object-construction") return lowersObjectConstruction(node, sourceFile, mechanicOccurrenceId);
  if (["serialization", "normalization", "validation", "retry"].includes(mechanicKind)) {
    return lowersInvocationMechanic(mechanicKind, node, sourceFile, mechanicOccurrenceId);
  }
  if (mechanicKind === "fallback") return lowersFallback(node, sourceFile, mechanicOccurrenceId);
  if (mechanicKind === "state-mutation") return lowersStateMutation(node, sourceFile, mechanicOccurrenceId);
  if (mechanicKind === "meaning-hidden-in-text") return lowersMeaningHiddenInText(node, sourceFile, mechanicOccurrenceId);
  throw new DeterministicMechanicLoweringError("MECHANIC_FAMILY_NOT_DETERMINISTICALLY_LOWERABLE", `Mechanic kind '${mechanicKind}' is not supported.`, `${mechanicKind}-authority-lowerer`);
}

function authorityBase(authorityKind, mechanicOccurrenceId) {
  return {
    authorityKind,
    authorityBasis: "DETERMINISTIC_SYNTAX_LOWERING",
    syntaxProfile: deterministicMechanicSyntaxProfile,
    candidateAuthorityId: `candidate-${mechanicOccurrenceId}`,
  };
}

function lowersIteration(node, sourceFile, mechanicOccurrenceId) {
  const authority = {
    ...authorityBase("iteration-authority.v1", mechanicOccurrenceId),
    iterationKind: iterationKind(node),
    initializer: null,
    predicate: null,
    binding: null,
    iterable: null,
    incrementor: null,
    body: lowersStatementBody(node.statement, sourceFile),
    continuationPolicy: "SOURCE_DEFINED",
    terminationPolicy: "PREDICATE_FALSE",
  };
  if (ts.isForStatement(node)) {
    authority.initializer = node.initializer === undefined ? null : lowersForInitializer(node.initializer, sourceFile);
    authority.predicate = node.condition === undefined ? null : lowersPredicate(node.condition, sourceFile);
    authority.incrementor = node.incrementor === undefined ? null : lowersExpression(node.incrementor, sourceFile);
  } else if (ts.isForInStatement(node) || ts.isForOfStatement(node)) {
    authority.binding = lowersForInitializer(node.initializer, sourceFile);
    authority.iterable = lowersExpression(node.expression, sourceFile);
    authority.terminationPolicy = ts.isForOfStatement(node) ? "ITERATOR_EXHAUSTED" : "PROPERTY_ENUMERATION_EXHAUSTED";
  } else {
    authority.predicate = lowersPredicate(node.expression, sourceFile);
  }
  return authority;
}

function lowersForInitializer(node, sourceFile) {
  if (ts.isVariableDeclarationList(node)) {
    return {
      kind: "declaration",
      declarationKind: declarationKind(node),
      bindings: node.declarations.map((declaration) => ({
        binding: lowersBindingName(declaration.name, sourceFile),
        initializer: declaration.initializer === undefined ? null : lowersExpression(declaration.initializer, sourceFile),
      })),
    };
  }
  return { kind: "expression", expression: lowersExpression(node, sourceFile) };
}

function lowersExceptionHandling(node, sourceFile, mechanicOccurrenceId) {
  const tryNode = ts.isTryStatement(node) ? node : node.parent;
  if (!ts.isTryStatement(tryNode)) unsupportedMechanicNode("exception-handling", node, sourceFile);
  const catchClause = tryNode.catchClause;
  return {
    ...authorityBase("failure-observation-authority.v1", mechanicOccurrenceId),
    boundaryKind: ts.isCatchClause(node) ? "CATCH_BOUNDARY" : "TRY_BOUNDARY",
    protectedEffects: tryNode.tryBlock.statements.map((statement) => lowersStatement(statement, sourceFile)),
    catchBinding: catchClause?.variableDeclaration === undefined ? null : lowersBindingName(catchClause.variableDeclaration.name, sourceFile),
    handledEffects: catchClause === undefined ? [] : catchClause.block.statements.map((statement) => lowersStatement(statement, sourceFile)),
    finalizationEffects: tryNode.finallyBlock === undefined ? [] : tryNode.finallyBlock.statements.map((statement) => lowersStatement(statement, sourceFile)),
    unhandledDisposition: catchClause === undefined ? "PROPAGATE" : "CATCH_CLAUSE_DECIDES",
  };
}

function lowersThrow(node, sourceFile, mechanicOccurrenceId) {
  return {
    ...authorityBase("terminal-disposition-authority.v1", mechanicOccurrenceId),
    error: lowersExpression(node.expression, sourceFile),
    terminalDisposition: "THROW",
    resultOutputId: null,
  };
}

function lowersObjectConstruction(node, sourceFile, mechanicOccurrenceId) {
  if (ts.isNewExpression(node)) {
    return {
      ...authorityBase("semantic-projection-authority.v1", mechanicOccurrenceId),
      constructionKind: "CONSTRUCTOR_INVOCATION",
      constructor: lowersExpression(node.expression, sourceFile),
      arguments: (node.arguments ?? []).map((argument) => lowersExpression(argument, sourceFile)),
      fieldMappings: [],
      unmappedFieldDisposition: "CONSTRUCTOR_DECIDES",
    };
  }
  return {
    ...authorityBase("semantic-projection-authority.v1", mechanicOccurrenceId),
    constructionKind: "OBJECT_LITERAL",
    constructor: null,
    arguments: [],
    fieldMappings: node.properties.map((property) => lowersObjectProperty(property, sourceFile)),
    unmappedFieldDisposition: "NO_UNMAPPED_FIELDS",
  };
}

function lowersInvocationMechanic(mechanicKind, node, sourceFile, mechanicOccurrenceId) {
  if (!ts.isCallExpression(node)) unsupportedMechanicNode(mechanicKind, node, sourceFile);
  const invocation = { operation: lowersExpression(node.expression, sourceFile), arguments: node.arguments.map((argument) => lowersExpression(argument, sourceFile)) };
  const inputs = collectsReferencePaths(invocation);
  if (mechanicKind === "serialization") return { ...authorityBase("serialization-profile-authority.v1", mechanicOccurrenceId), profileId: expressionIdentity(invocation.operation), mediaType: null, encoding: null, rules: [invocation] };
  if (mechanicKind === "normalization") return { ...authorityBase("canonicalization-authority.v1", mechanicOccurrenceId), inputIds: inputs, operations: [invocation], ambiguityDisposition: "SOURCE_OPERATION_DECIDES" };
  if (mechanicKind === "validation") return { ...authorityBase("constraint-authority.v1", mechanicOccurrenceId), inputIds: inputs, constraints: [invocation], validOutcome: "CALL_COMPLETED", invalidOutcome: "CALL_REJECTED_OR_THREW" };
  return { ...authorityBase("retry-policy-authority.v1", mechanicOccurrenceId), operation: invocation, maximumAttempts: null, retryableDispositions: [], backoff: null, exhaustedDisposition: "SOURCE_OPERATION_DECIDES" };
}

function lowersFallback(node, sourceFile, mechanicOccurrenceId) {
  const operator = ts.tokenToString(node.operatorToken.kind) ?? ts.SyntaxKind[node.operatorToken.kind];
  return {
    ...authorityBase("alternative-selection-authority.v1", mechanicOccurrenceId),
    operator,
    alternatives: flattensBinaryOperator(node, operator).map((item) => lowersExpression(item, sourceFile)),
    selectionOrder: "LEFT_TO_RIGHT_SHORT_CIRCUIT",
    exhaustedDisposition: operator === "??" ? "ALL_NULLISH" : "ALL_FALSY",
  };
}

function lowersStateMutation(node, sourceFile, mechanicOccurrenceId) {
  if (ts.isBinaryExpression(node)) {
    const operator = ts.tokenToString(node.operatorToken.kind) ?? ts.SyntaxKind[node.operatorToken.kind];
    return { ...authorityBase("state-transition-authority.v1", mechanicOccurrenceId), stateTarget: lowersExpression(node.left, sourceFile), transitionKind: "ASSIGNMENT", operator, value: lowersExpression(node.right, sourceFile), arguments: [], guards: [] };
  }
  if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
    return { ...authorityBase("state-transition-authority.v1", mechanicOccurrenceId), stateTarget: lowersExpression(node.operand, sourceFile), transitionKind: "UPDATE", operator: ts.tokenToString(node.operator) ?? ts.SyntaxKind[node.operator], value: null, arguments: [], guards: [] };
  }
  if (ts.isCallExpression(node)) {
    return { ...authorityBase("state-transition-authority.v1", mechanicOccurrenceId), stateTarget: lowersMutationTarget(node.expression, sourceFile), transitionKind: "MUTATOR_INVOCATION", operator: mutationOperation(node.expression), value: null, arguments: node.arguments.map((argument) => lowersExpression(argument, sourceFile)), guards: [] };
  }
  unsupportedMechanicNode("state-mutation", node, sourceFile);
}

function lowersMeaningHiddenInText(node, sourceFile, mechanicOccurrenceId) {
  const value = lowersExpression(node, sourceFile);
  return {
    ...authorityBase("text-meaning-authority.v1", mechanicOccurrenceId),
    interpretationMode: "EXACT_TEXT_IDENTITY",
    vocabulary: ts.isTemplateExpression(node) ? [] : [{ text: node.text, semanticToken: node.text }],
    templates: ts.isTemplateExpression(node) ? [{ head: node.head.text, spans: node.templateSpans.map((span, index) => ({ slot: index, expression: lowersExpression(span.expression, sourceFile), literal: span.literal.text })) }] : [],
    sourceExpression: value,
    unknownTextDisposition: "REJECT_UNKNOWN_TEXT",
  };
}

function lowersIfStatement(node, sourceFile, mechanicOccurrenceId) {
  const predicate = lowersPredicate(node.expression, sourceFile);
  const matchedOutcome = "BRANCH_MATCHED";
  const noMatchOutcome = "BRANCH_NOT_MATCHED";
  return {
    authorityKind: "decision-authority.v1",
    authorityBasis: "DETERMINISTIC_SYNTAX_LOWERING",
    syntaxProfile: deterministicBranchSyntaxProfile,
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
  const predicate = lowersPredicate(node.condition, sourceFile);
  return {
    authorityKind: "decision-authority.v1",
    authorityBasis: "DETERMINISTIC_SYNTAX_LOWERING",
    syntaxProfile: deterministicBranchSyntaxProfile,
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

function findsNodeAtLocation(sourceFile, line, column, mechanicKind) {
  const exact = [];
  function visit(node) {
    if (isMechanicNode(node, mechanicKind)) {
      const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      if (location.line + 1 === line && location.character + 1 === column) exact.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (exact.length > 1) {
    throw new DeterministicMechanicLoweringError(
      "SOURCE_NODE_NOT_UNIQUE",
      `More than one ${mechanicKind} node starts at ${sourceFile.fileName}:${line}:${column}.`,
      "unique-source-node-identity",
    );
  }
  return exact[0] ?? null;
}

function isMechanicNode(node, mechanicKind) {
  if (mechanicKind === "branch") return ts.isIfStatement(node) || ts.isConditionalExpression(node);
  if (mechanicKind === "iteration") return ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node);
  if (mechanicKind === "exception-handling") return ts.isTryStatement(node) || ts.isCatchClause(node);
  if (mechanicKind === "throw") return ts.isThrowStatement(node);
  if (mechanicKind === "object-construction") return ts.isNewExpression(node) || ts.isObjectLiteralExpression(node);
  if (["serialization", "normalization", "validation", "retry"].includes(mechanicKind)) return ts.isCallExpression(node) && invocationMatchesMechanic(node, mechanicKind);
  if (mechanicKind === "fallback") return ts.isBinaryExpression(node) && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(node.operatorToken.kind);
  if (mechanicKind === "state-mutation") return isMutationNode(node);
  if (mechanicKind === "meaning-hidden-in-text") return ts.isStringLiteralLike(node) || ts.isTemplateExpression(node);
  return false;
}

function invocationMatchesMechanic(node, mechanicKind) {
  const name = mutationOperation(node.expression).toLowerCase();
  const patterns = {
    serialization: /^(?:stringify|serialize|serializes|tojson)$/u,
    normalization: /^(?:normalize|normalizes|canonicalize|canonicalizes)/u,
    validation: /^(?:validate|validates|assert|asserts)/u,
    retry: /^(?:retry|retries|withretry|executewithretry)$/u,
  };
  return patterns[mechanicKind].test(name);
}

function isMutationNode(node) {
  if (ts.isBinaryExpression(node)) return assignmentOperators.has(node.operatorToken.kind);
  if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) return [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(node.operator);
  return ts.isCallExpression(node) && /^(?:set|add|delete|push|pop|splice)$/u.test(mutationOperation(node.expression).toLowerCase());
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
      predicate: lowersPredicate(node.expression, sourceFile),
      whenTrue: lowersStatementBody(node.thenStatement, sourceFile),
      whenFalse: node.elseStatement === undefined ? [] : lowersStatementBody(node.elseStatement, sourceFile),
    };
  }
  if (ts.isBlock(node)) return { kind: "block", effects: node.statements.map((child) => lowersStatement(child, sourceFile)) };
  if (ts.isEmptyStatement(node)) return { kind: "noop" };
  if (ts.isBreakStatement(node)) return { kind: "break", label: node.label?.text ?? null };
  if (ts.isContinueStatement(node)) return { kind: "continue", label: node.label?.text ?? null };
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
    if (target.kind === "reference" && node.questionDotToken === undefined) return { kind: "reference", path: [...target.path, node.name.text] };
    return { kind: "member", target, property: node.name.text, optional: node.questionDotToken !== undefined };
  }
  if (ts.isElementAccessExpression(node)) {
    return {
      kind: "element",
      target: lowersExpression(node.expression, sourceFile),
      index: lowersExpression(node.argumentExpression, sourceFile),
      optional: node.questionDotToken !== undefined,
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
  if (ts.isPostfixUnaryExpression(node)) {
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
      ...(ts.isCallExpression(node) ? { optional: node.questionDotToken !== undefined } : {}),
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
      predicate: lowersPredicate(node.condition, sourceFile),
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
      kind: "lambda",
      async: node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword) ?? false,
      generator: ts.isFunctionExpression(node) && node.asteriskToken !== undefined,
      parameters: node.parameters.map((parameter) => ({
        binding: lowersBindingName(parameter.name, sourceFile),
        optional: parameter.questionToken !== undefined,
        rest: parameter.dotDotDotToken !== undefined,
        initializer: parameter.initializer === undefined ? null : lowersExpression(parameter.initializer, sourceFile),
      })),
      body: ts.isBlock(node.body)
        ? { kind: "statements", statements: node.body.statements.map((statement) => lowersStatement(statement, sourceFile)) }
        : { kind: "expression", expression: lowersExpression(node.body, sourceFile) },
    };
  }
  unsupported(node, sourceFile, "outcome expression", "outcome-expression-lowering");
}

function lowersPredicate(node, sourceFile) {
  if (ts.isParenthesizedExpression(node) || ts.isNonNullExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
    return lowersPredicate(node.expression, sourceFile);
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
    const target = lowersPredicate(node.expression, sourceFile);
    if (target.kind === "reference" && node.questionDotToken === undefined) return { kind: "reference", path: [...target.path, node.name.text] };
    return { kind: "member", target, property: node.name.text, optional: node.questionDotToken !== undefined };
  }
  if (ts.isElementAccessExpression(node)) {
    return {
      kind: "element",
      target: lowersPredicate(node.expression, sourceFile),
      index: lowersPredicate(node.argumentExpression, sourceFile),
      optional: node.questionDotToken !== undefined,
    };
  }
  if (ts.isBinaryExpression(node)) {
    const operator = ts.tokenToString(node.operatorToken.kind) ?? ts.SyntaxKind[node.operatorToken.kind];
    if (!predicateBinaryOperators.has(operator)) {
      throw new DeterministicMechanicLoweringError(
        "UNSUPPORTED_PREDICATE_OPERATOR",
        `Predicate operator '${operator}' is not side-effect-free at ${formatsLocation(node, sourceFile)}.`,
        `predicate-operator:${operator}`,
      );
    }
    return { kind: "binary", operator, left: lowersPredicate(node.left, sourceFile), right: lowersPredicate(node.right, sourceFile) };
  }
  if (ts.isPrefixUnaryExpression(node)) {
    const operator = ts.tokenToString(node.operator) ?? ts.SyntaxKind[node.operator];
    if (!predicateUnaryOperators.has(operator)) {
      throw new DeterministicMechanicLoweringError(
        "UNSUPPORTED_PREDICATE_OPERATOR",
        `Predicate operator '${operator}' is not side-effect-free at ${formatsLocation(node, sourceFile)}.`,
        `predicate-operator:${operator}`,
      );
    }
    return { kind: "unary", operator, operand: lowersPredicate(node.operand, sourceFile) };
  }
  if (ts.isTypeOfExpression(node)) return { kind: "unary", operator: "typeof", operand: lowersPredicate(node.expression, sourceFile) };
  if (ts.isVoidExpression(node)) return { kind: "unary", operator: "void", operand: lowersPredicate(node.expression, sourceFile) };
  if (ts.isConditionalExpression(node)) {
    return {
      kind: "conditional",
      predicate: lowersPredicate(node.condition, sourceFile),
      whenTrue: lowersPredicate(node.whenTrue, sourceFile),
      whenFalse: lowersPredicate(node.whenFalse, sourceFile),
    };
  }
  throw new DeterministicMechanicLoweringError(
    "UNSUPPORTED_PREDICATE_FORM",
    `Predicate form ${ts.SyntaxKind[node.kind]} is not in the side-effect-free profile at ${formatsLocation(node, sourceFile)}.`,
    `predicate-form:${ts.SyntaxKind[node.kind]}`,
  );
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
    return { kind: "object-binding", elements: name.elements.map((element) => {
      if (element.dotDotDotToken !== undefined || element.initializer !== undefined) {
        unsupported(element, sourceFile, "outcome expression", "destructuring-default-or-rest-binding");
      }
      return { name: lowersBindingName(element.name, sourceFile), property: element.propertyName === undefined ? null : propertyName(element.propertyName, sourceFile) };
    }) };
  }
  if (ts.isArrayBindingPattern(name)) {
    return { kind: "array-binding", elements: name.elements.map((element) => {
      if (ts.isOmittedExpression(element)) return null;
      if (element.dotDotDotToken !== undefined || element.initializer !== undefined) {
        unsupported(element, sourceFile, "outcome expression", "destructuring-default-or-rest-binding");
      }
      return lowersBindingName(element.name, sourceFile);
    }) };
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

function iterationKind(node) {
  if (ts.isForStatement(node)) return "FOR";
  if (ts.isForInStatement(node)) return "FOR_IN";
  if (ts.isForOfStatement(node)) return node.awaitModifier === undefined ? "FOR_OF" : "FOR_AWAIT_OF";
  if (ts.isWhileStatement(node)) return "WHILE";
  return "DO_WHILE";
}

function flattensBinaryOperator(node, operator) {
  const values = [];
  function visit(candidate) {
    if (ts.isBinaryExpression(candidate) && (ts.tokenToString(candidate.operatorToken.kind) ?? ts.SyntaxKind[candidate.operatorToken.kind]) === operator) {
      visit(candidate.left);
      visit(candidate.right);
    } else values.push(candidate);
  }
  visit(node);
  return values;
}

function expressionIdentity(expression) {
  return expression.kind === "reference" ? expression.path.join(".") : JSON.stringify(expression);
}

function mutationOperation(expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  if (ts.isElementAccessExpression(expression) && ts.isStringLiteralLike(expression.argumentExpression)) return expression.argumentExpression.text;
  return ts.SyntaxKind[expression.kind];
}

function lowersMutationTarget(expression, sourceFile) {
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) return lowersExpression(expression.expression, sourceFile);
  return lowersExpression(expression, sourceFile);
}

function unsupportedMechanicNode(mechanicKind, node, sourceFile) {
  throw new DeterministicMechanicLoweringError(
    "UNSUPPORTED_MECHANIC_SYNTAX",
    `Unsupported ${mechanicKind} syntax ${ts.SyntaxKind[node.kind]} at ${formatsLocation(node, sourceFile)}.`,
    `${mechanicKind}-syntax:${ts.SyntaxKind[node.kind]}`,
  );
}

function declarationKind(list) {
  if ((list.flags & ts.NodeFlags.Const) !== 0) return "const";
  if ((list.flags & ts.NodeFlags.Let) !== 0) return "let";
  return "var";
}

function unsupported(node, sourceFile, role, requiredPrimitive = null) {
  throw new DeterministicMechanicLoweringError(
    role === "statement" ? "UNSUPPORTED_OUTCOME_STATEMENT" : "UNSUPPORTED_OUTCOME_EXPRESSION",
    `Unsupported ${role} ${ts.SyntaxKind[node.kind]} at ${formatsLocation(node, sourceFile)}.`,
    requiredPrimitive ?? `${role.replaceAll(" ", "-")}:${ts.SyntaxKind[node.kind]}`,
  );
}

function formatsLocation(node, sourceFile) {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${sourceFile.fileName}:${location.line + 1}:${location.character + 1}`;
}

const predicateBinaryOperators = new Set([
  "===", "!==", "==", "!=", "<", "<=", ">", ">=", "&&", "||", "??",
  "+", "-", "*", "/", "%", "**", "&", "|", "^", "<<", ">>", ">>>",
  "in", "instanceof",
]);
const predicateUnaryOperators = new Set(["!", "+", "-", "~"]);
const assignmentOperators = new Set([
  ts.SyntaxKind.EqualsToken, ts.SyntaxKind.PlusEqualsToken, ts.SyntaxKind.MinusEqualsToken,
  ts.SyntaxKind.AsteriskEqualsToken, ts.SyntaxKind.AsteriskAsteriskEqualsToken,
  ts.SyntaxKind.SlashEqualsToken, ts.SyntaxKind.PercentEqualsToken,
  ts.SyntaxKind.LessThanLessThanEqualsToken, ts.SyntaxKind.GreaterThanGreaterThanEqualsToken,
  ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken, ts.SyntaxKind.AmpersandEqualsToken,
  ts.SyntaxKind.BarEqualsToken, ts.SyntaxKind.CaretEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken, ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
]);

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
