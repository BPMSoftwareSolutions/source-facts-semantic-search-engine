import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const testCallNames = new Set(["test", "it"]);
const suiteCallNames = new Set(["describe", "suite"]);

function hashes(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function normalizes(value) {
  return value.replaceAll("\\", "/");
}

function callName(expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return `${callName(expression.expression)}.${expression.name.text}`;
  return "";
}

function literalText(node) {
  return node && (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;
}

function callbackBody(call) {
  const candidate = call.arguments.find((argument) => ts.isArrowFunction(argument) || ts.isFunctionExpression(argument));
  return candidate?.body ?? null;
}

function resolvesImportedModule(testModulePath, specifier) {
  if (!specifier.startsWith(".")) return null;
  const resolved = path.posix.normalize(path.posix.join("test", path.posix.dirname(testModulePath), specifier));
  const withoutExtension = resolved.replace(/\.[cm]?[jt]sx?$/iu, "");
  const relativeToSrc = withoutExtension.startsWith("src/") ? withoutExtension.slice(4) : null;
  return relativeToSrc;
}

function inventoriesFile(sourceText, modulePath) {
  const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const imports = new Map();
  const localFunctions = new Map();
  const tests = [];

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const clause = statement.importClause;
      if (clause?.name) imports.set(clause.name.text, { importedName: "default", specifier });
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) imports.set(element.name.text, { importedName: element.propertyName?.text ?? element.name.text, specifier });
      }
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) imports.set(clause.namedBindings.name.text, { importedName: "*", specifier });
    }
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) localFunctions.set(statement.name.text, statement.body);
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer
          && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))) {
          localFunctions.set(declaration.name.text, declaration.initializer.body);
        }
      }
    }
  }

  function visits(node, suites = []) {
    if (ts.isCallExpression(node)) {
      const name = callName(node.expression);
      const baseName = name.split(".")[0];
      const title = literalText(node.arguments[0]);
      if (suiteCallNames.has(baseName) && title) {
        const body = callbackBody(node);
        if (body) visits(body, [...suites, title]);
        return;
      }
      if (testCallNames.has(baseName) && title) {
        const position = source.getLineAndCharacterOfPosition(node.getStart(source));
        const body = callbackBody(node);
        tests.push({
          testId: hashes(`${modulePath}\0${node.getStart(source)}\0${title}`),
          modulePath: `test/${modulePath}`,
          suite: suites,
          testName: title,
          framework: "node:test",
          startLine: position.line + 1,
          startColumn: position.character + 1,
          executionStatus: name.includes(".skip") ? "SKIPPED" : name.includes(".todo") ? "TODO" : "ENABLED",
          runtimeResultDisposition: "TEST_EXECUTION_NOT_EVALUATED",
          body,
          source,
          imports,
          localFunctions,
        });
        return;
      }
    }
    ts.forEachChild(node, (child) => visits(child, suites));
  }
  visits(source);
  return tests;
}

function invokedNames(root, localFunctions) {
  const names = new Set();
  const visitedHelpers = new Set();
  function visits(node) {
    if (ts.isCallExpression(node)) {
      const name = callName(node.expression);
      if (name) names.add(name);
      const base = name.split(".")[0];
      if (localFunctions.has(base) && !visitedHelpers.has(base)) {
        visitedHelpers.add(base);
        visits(localFunctions.get(base));
      }
    }
    ts.forEachChild(node, visits);
  }
  if (root) visits(root);
  return [...names].sort();
}

function resolvesDirectSymbols(test, productionSymbols) {
  const rows = [];
  for (const invokedName of invokedNames(test.body, test.localFunctions)) {
    const [binding, member] = invokedName.split(".");
    const imported = test.imports.get(binding);
    if (!imported) continue;
    const moduleStem = resolvesImportedModule(test.modulePath.replace(/^test\//u, ""), imported.specifier);
    if (!moduleStem) continue;
    const symbolName = imported.importedName === "*" ? member : imported.importedName === "default" ? binding : imported.importedName;
    if (!symbolName) continue;
    const matches = productionSymbols.filter((symbol) => symbol.name === symbolName
      && symbol.modulePath.replace(/\.[cm]?[jt]sx?$/iu, "") === moduleStem);
    for (const symbol of matches) rows.push({ symbol, invokedName, resolutionDisposition: matches.length === 1 ? "DIRECT_PRODUCTION_SYMBOL_RESOLVED" : "DIRECT_PRODUCTION_SYMBOL_AMBIGUOUS" });
  }
  return rows;
}

function buildsProductionAdjacency(index) {
  const symbols = index.symbols ?? [];
  const byId = new Map(symbols.map((symbol) => [symbol.symbolId, symbol]));
  const byName = new Map();
  for (const symbol of symbols) {
    const rows = byName.get(symbol.name) ?? [];
    rows.push(symbol);
    byName.set(symbol.name, rows);
  }
  const adjacency = new Map();
  for (const edge of (index.relationships ?? []).filter((row) => row.relationshipKind === "invocation" && row.fromSymbolId)) {
    let targets = edge.toSymbolId ? [byId.get(edge.toSymbolId)].filter(Boolean) : byName.get(edge.toSymbolCandidate) ?? [];
    if (targets.length > 1) {
      const caller = byId.get(edge.fromSymbolId);
      const sameModule = targets.filter((target) => target.modulePath === caller?.modulePath);
      if (sameModule.length === 1) targets = sameModule;
    }
    if (targets.length !== 1) continue;
    const rows = adjacency.get(edge.fromSymbolId) ?? [];
    rows.push({ target: targets[0], relationshipId: edge.relationshipId });
    adjacency.set(edge.fromSymbolId, rows);
  }
  return adjacency;
}

function productionReachability(directRows, adjacency) {
  const queue = directRows.map((row) => ({ symbol: row.symbol, depth: 0, path: [row.symbol.symbolId], viaRelationshipId: null }));
  const seen = new Set();
  const rows = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (seen.has(current.symbol.symbolId)) continue;
    seen.add(current.symbol.symbolId);
    rows.push(current);
    for (const edge of adjacency.get(current.symbol.symbolId) ?? []) queue.push({ symbol: edge.target, depth: current.depth + 1, path: [...current.path, edge.target.symbolId], viaRelationshipId: edge.relationshipId });
  }
  return rows;
}

export async function projectsTestTraceability({ testIndex = null, productionIndex, interfaceGovernance, canonicalFeatureQueryPlane }) {
  if (!testIndex?.manifest?.scanRequest?.workspaceRoot) return emptyProjection();
  const testRoot = testIndex.manifest.scanRequest.workspaceRoot;
  const inventory = [];
  for (const file of testIndex.files ?? []) {
    if (!/\.test\.[cm]?[jt]sx?$/iu.test(file.relativePath)) continue;
    const source = await readFile(path.join(testRoot, file.relativePath), "utf8");
    inventory.push(...inventoriesFile(source, normalizes(file.relativePath)));
  }
  const adjacency = buildsProductionAdjacency(productionIndex);
  const cliReachabilityBySymbol = new Map();
  for (const row of interfaceGovernance.reachability ?? []) {
    const rows = cliReachabilityBySymbol.get(row.symbolId) ?? [];
    rows.push(row);
    cliReachabilityBySymbol.set(row.symbolId, rows);
  }
  const responsibilityBindings = canonicalFeatureQueryPlane.canonicalTraces?.responsibilityToCallgraph ?? [];
  const commandsByEntryPoint = new Map((interfaceGovernance.commands ?? []).map((command) => [command.entryPointId, command]));
  const intentByFeature = new Map((canonicalFeatureQueryPlane.canonicalIntents?.features ?? []).map((row) => [row.featureId, row]));
  const expectedStepsByScenario = new Map();
  for (const step of canonicalFeatureQueryPlane.canonicalFeatures?.steps ?? []) {
    if (!["Then", "And"].includes(step.stepType)) continue;
    const rows = expectedStepsByScenario.get(step.scenarioId) ?? [];
    rows.push({ expectationId: step.stepId, expectedSignal: step.stepText });
    expectedStepsByScenario.set(step.scenarioId, rows);
  }
  const productionReachabilityRows = [];
  const originatingCliFeatures = [];
  const scenarioLineage = [];
  const testPostures = [];
  for (const test of inventory) {
    const direct = resolvesDirectSymbols(test, productionIndex.symbols ?? []);
    const reachable = productionReachability(direct, adjacency);
    for (const row of reachable) productionReachabilityRows.push({
      testId: test.testId, testFile: test.modulePath, testName: test.testName,
      productionSymbolId: row.symbol.symbolId, productionSymbolName: row.symbol.name, productionModulePath: `src/${row.symbol.modulePath}`,
      depth: row.depth, reachabilityPosture: row.depth === 0 ? "DIRECT_PRODUCTION_INVOCATION" : "INDIRECT_PRODUCTION_INVOCATION",
      pathWitness: row.path, viaRelationshipId: row.viaRelationshipId,
      cliClosureClassification: interfaceGovernance.callableInventory.find((candidate) => candidate.symbolId === row.symbol.symbolId)?.cliClosureClassification ?? "NO_CLI_REACHABILITY",
    });
    const commandCandidates = direct.flatMap((directRow) => (cliReachabilityBySymbol.get(directRow.symbol.symbolId) ?? []).flatMap((reachability) => reachability.commandNames.map((commandName) => ({ commandName, reachability, directRow }))));
    const commandGroups = new Map();
    for (const candidate of commandCandidates) {
      const key = `${candidate.commandName}\0${candidate.reachability.entryPointId}`;
      const group = commandGroups.get(key) ?? { commandName: candidate.commandName, entryPointId: candidate.reachability.entryPointId, symbols: [] };
      group.symbols.push(candidate.directRow.symbol);
      commandGroups.set(key, group);
    }
    for (const group of commandGroups.values()) {
      const classifications = group.symbols.map((symbol) => interfaceGovernance.callableInventory.find((row) => row.symbolId === symbol.symbolId)?.cliClosureClassification);
      const commandFeatureIds = commandsByEntryPoint.get(group.entryPointId)?.canonicalFeatureIds ?? [];
      const boundFeatureSymbols = new Set(responsibilityBindings.filter((binding) => commandFeatureIds.includes(binding.featureId)).flatMap((binding) => binding.boundImplementationSymbols));
      originatingCliFeatures.push({
        testId: test.testId,
        commandName: group.commandName,
        entryPointId: group.entryPointId,
        productionSymbolIds: [...new Set(group.symbols.map((symbol) => symbol.symbolId))].sort(),
        coverageDisposition: group.symbols.some((symbol) => boundFeatureSymbols.has(symbol.name))
          || classifications.some((classification) => ["CLI_FEATURE_ROOT", "CLI_FEATURE_REACHABLE"].includes(classification)) ? "FEATURE_SPECIFIC_TEST_REACHABILITY" : "SHARED_INFRASTRUCTURE_TEST_REACHABILITY",
      });
    }
    const reachedNames = new Set(direct.map((row) => row.symbol.name));
    const bound = responsibilityBindings.filter((binding) => binding.boundImplementationSymbols.some((name) => reachedNames.has(name)));
    for (const binding of bound) scenarioLineage.push({
      testId: test.testId, testFile: test.modulePath, testName: test.testName,
      featureId: binding.featureId, scenarioId: binding.scenarioId, responsibilityId: binding.responsibilityId, obligationId: binding.obligationId,
      expectedSignals: expectedStepsByScenario.get(binding.scenarioId) ?? [],
      lineageStatus: intentByFeature.get(binding.featureId)?.lifecycle === "FEATURE_CANONICAL" ? "CANONICAL_SCENARIO_LINEAGE" : "PROPOSED_SCENARIO_LINEAGE",
      proofPosture: "OBLIGATION_SIGNAL_PROOF",
      executionDisposition: "TEST_EXECUTION_NOT_EVALUATED",
      observedResult: null,
    });
    const reachableClassifications = direct.map((row) => interfaceGovernance.callableInventory.find((candidate) => candidate.symbolId === row.symbol.symbolId)?.cliClosureClassification ?? "NO_CLI_REACHABILITY");
    const posture = bound.length > 1 ? "AMBIGUOUS_TEST_LINEAGE"
      : bound.length === 1 ? "OBLIGATION_SIGNAL_PROOF"
        : reachableClassifications.includes("SHARED_CLI_INFRASTRUCTURE") ? "SHARED_INFRASTRUCTURE_PROOF"
          : direct.length === 0 ? "TEST_ONLY_HELPER" : "NO_CANONICAL_TEST_LINEAGE";
    testPostures.push({ testId: test.testId, testFile: test.modulePath, testName: test.testName, posture, productionCallableCount: reachable.length, canonicalLineageCount: bound.length });
  }
  const scenarioProofCoverage = (canonicalFeatureQueryPlane.canonicalIntents?.scenarios ?? []).map((scenario) => {
    const tests = scenarioLineage.filter((row) => row.scenarioId === scenario.scenarioId);
    return { featureId: scenario.featureId, scenarioId: scenario.scenarioId, responsibilityId: scenario.responsibilityId, obligationId: scenario.obligationId, testIds: tests.map((row) => row.testId).sort(), declaredProofCount: tests.length, proofCount: 0, expectedSignals: expectedStepsByScenario.get(scenario.scenarioId) ?? [], proofDisposition: tests.length > 0 ? "SCENARIO_TEST_PROOF_DECLARED_EXECUTION_NOT_EVALUATED" : "SCENARIO_WITHOUT_TEST_PROOF" };
  });
  const unreachableProductionDependencies = productionReachabilityRows.filter((row) => row.depth === 0 && row.cliClosureClassification === "NO_CLI_REACHABILITY").map((row) => ({ ...row, disposition: "TEST_PRESERVED_UNJUSTIFIED_IMPLEMENTATION" }));
  const withoutCanonicalLineage = testPostures.filter((row) => row.posture === "NO_CANONICAL_TEST_LINEAGE");
  const duplicateObligationProof = [...new Set(scenarioLineage.map((row) => row.obligationId))].flatMap((obligationId) => {
    const rows = scenarioLineage.filter((row) => row.obligationId === obligationId);
    return rows.length > 1 ? [{ obligationId, testIds: rows.map((row) => row.testId).sort(), testCount: rows.length, disposition: "DUPLICATE_OBLIGATION_PROOF_CANDIDATE" }] : [];
  });
  const scenarioWithoutTestProof = scenarioProofCoverage.filter((row) => row.proofCount === 0);
  const removalImpact = withoutCanonicalLineage.map((test) => {
    const production = productionReachabilityRows.filter((row) => row.testId === test.testId && row.depth === 0);
    return { ...test, productionSymbolIds: production.map((row) => row.productionSymbolId), exclusivelyPreservesCliUnreachableCode: production.length > 0 && production.every((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY"), removalDisposition: production.length > 0 && production.every((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY") ? "REMOVE_WITH_UNJUSTIFIED_IMPLEMENTATION_CANDIDATE" : "REVIEW_TEST_LINEAGE" };
  });
  const summary = {
    testsObserved: inventory.length,
    testsWithCanonicalScenarioLineage: new Set(scenarioLineage.filter((row) => row.lineageStatus === "CANONICAL_SCENARIO_LINEAGE").map((row) => row.testId)).size,
    testsWithProposedLineageOnly: new Set(scenarioLineage.filter((row) => row.lineageStatus === "PROPOSED_SCENARIO_LINEAGE").map((row) => row.testId)).size,
    sharedInfrastructureTests: testPostures.filter((row) => row.posture === "SHARED_INFRASTRUCTURE_PROOF").length,
    testsProvingCliUnreachableCode: new Set(unreachableProductionDependencies.map((row) => row.testId)).size,
    testsWithoutCanonicalLineage: withoutCanonicalLineage.length,
    canonicalScenariosWithoutTestProof: scenarioWithoutTestProof.length,
    duplicateProofCandidates: duplicateObligationProof.length,
  };
  return { summary, inventory: inventory.map(({ body, source, imports, localFunctions, ...row }) => row), productionReachability: productionReachabilityRows, originatingCliFeatures, scenarioLineage, scenarioProofCoverage, unreachableProductionDependencies, withoutCanonicalLineage, duplicateObligationProof, scenarioWithoutTestProof, removalImpact, testPostures };
}

function emptyProjection() {
  return { summary: { testsObserved: 0, testsWithCanonicalScenarioLineage: 0, testsWithProposedLineageOnly: 0, sharedInfrastructureTests: 0, testsProvingCliUnreachableCode: 0, testsWithoutCanonicalLineage: 0, canonicalScenariosWithoutTestProof: 0, duplicateProofCandidates: 0 }, inventory: [], productionReachability: [], originatingCliFeatures: [], scenarioLineage: [], scenarioProofCoverage: [], unreachableProductionDependencies: [], withoutCanonicalLineage: [], duplicateObligationProof: [], scenarioWithoutTestProof: [], removalImpact: [], testPostures: [] };
}
