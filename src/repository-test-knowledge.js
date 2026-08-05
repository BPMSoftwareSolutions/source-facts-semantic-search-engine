import { createHash } from "node:crypto";
import path from "node:path";
import ts from "typescript";
import { verifiesRepositoryImage } from "./repository-image.js";
import { projectsCanonicalIntentRegistryContract, projectsEngineeringTruthSqlPayload } from "./sqlserver/load-engineering-truth.js";
import { classifiesTestMeaning } from "./classifies-test-meaning.js";

const testCallNames = new Set(["test", "it"]);
const suiteCallNames = new Set(["describe", "suite"]);

const digest = (value) => `sha256:${createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value), "utf8").digest("hex")}`;
const callName = (expression) => ts.isIdentifier(expression) ? expression.text
  : ts.isPropertyAccessExpression(expression) ? `${callName(expression.expression)}.${expression.name.text}` : "";
function literalText(node, bindings = new Map()) {
  if (!node) return null;
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (!ts.isTemplateExpression(node)) return null;
  let value = node.head.text;
  for (const span of node.templateSpans) {
    if (!ts.isIdentifier(span.expression) || !bindings.has(span.expression.text)) return null;
    value += `${bindings.get(span.expression.text)}${span.literal.text}`;
  }
  return value;
}
const callbackBody = (call) => call.arguments.find((argument) => ts.isArrowFunction(argument) || ts.isFunctionExpression(argument))?.body ?? null;
const lineOf = (source, node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

export function projectsRepositoryTestKnowledge(image, { applicationId = image?.rootId } = {}) {
  verifiesRepositoryImage(image);
  const intents = image.artifacts
    .filter((artifact) => /^features\/[^/]+\.intent\.json$/u.test(artifact.relativePath.replaceAll("\\", "/")))
    .map((artifact) => JSON.parse(Buffer.from(artifact.contentBase64, "base64").toString("utf8")));
  const enterpriseContext = { applicationId, repositoryId: image.rootId, workspaceId: image.rootId };
  const contract = projectsCanonicalIntentRegistryContract({ intents, projectId: image.rootId, enterpriseContext });
  const contractSnapshotId = projectsEngineeringTruthSqlPayload({
    contract,
    report: { reportType: "repository-test-observation-subject.v1", repository: { repositoryId: image.rootId, workspaceId: image.rootId }, enterpriseContext, interfaceGovernance: {}, testTraceability: {} },
  }).contract.contractSnapshotId;
  const scenarios = intents.flatMap((intent) => intent.scenarios.map((scenario) => ({
    featureId: intent.featureId, scenarioId: scenario.scenarioId, responsibilityId: scenario.responsibilityId,
    obligationId: scenario.obligationId, implementationSymbols: scenario.implementationSymbols ?? [],
  })));
  const artifacts = []; const suites = []; const testCases = []; const assertions = [];
  const fixtureUsages = []; const mockUsages = []; const invocations = []; const candidates = [];

  for (const artifact of image.artifacts.filter((row) => /\.(?:test|spec)\.[cm]?[jt]sx?$/iu.test(row.relativePath.replaceAll("\\", "/")))) {
    const relativePath = artifact.relativePath.replaceAll("\\", "/");
    const sourceText = Buffer.from(artifact.contentBase64, "base64").toString("utf8");
    const source = ts.createSourceFile(relativePath, sourceText, ts.ScriptTarget.Latest, true, scriptKind(relativePath));
    const imports = collectsImports(source);
    const localFunctions = collectsLocalFunctions(source);
    const artifactTests = [];

    function visit(node, suiteStack = [], bindings = new Map()) {
      if (ts.isForOfStatement(node) && ts.isVariableDeclarationList(node.initializer) && node.initializer.declarations.length === 1
          && ts.isIdentifier(node.initializer.declarations[0].name) && ts.isArrayLiteralExpression(node.expression)) {
        const values = node.expression.elements.map((element) => literalText(element, bindings));
        if (values.every((value) => value !== null)) {
          const bindingName = node.initializer.declarations[0].name.text;
          for (const value of values) visit(node.statement, suiteStack, new Map([...bindings, [bindingName, value]]));
          return;
        }
      }
      if (ts.isCallExpression(node)) {
        const name = callName(node.expression); const base = name.split(".")[0]; const title = literalText(node.arguments[0], bindings);
        if (suiteCallNames.has(base) && title) {
          const suiteId = digest(`${relativePath}\0${node.getStart(source)}\0${title}`);
          suites.push({ suiteId, testFilePath: relativePath, parentSuiteId: suiteStack.at(-1)?.suiteId ?? null, suiteName: title, startLine: lineOf(source, node) });
          const body = callbackBody(node); if (body) visit(body, [...suiteStack, { suiteId, suiteName: title }], bindings);
          return;
        }
        if (testCallNames.has(base) && title) {
          const testId = digest(`${relativePath}\0${node.getStart(source)}\0${title}`);
          const body = callbackBody(node);
          const observedCalls = collectsBodyCalls(body, source, localFunctions);
          const invokedProductionSymbols = new Set();
          for (const observed of observedCalls) {
            const invocationId = digest(`${testId}\0${observed.start}\0${observed.name}`);
            const imported = imports.get(observed.name.split(".")[0]);
            const production = resolvesProductionInvocation(relativePath, observed.name, imported);
            if (production?.symbolName) invokedProductionSymbols.add(production.symbolName);
            invocations.push({ invocationId, testId, invocationName: observed.name, startLine: observed.line, importedModulePath: production?.modulePath ?? null, importedSymbolName: production?.symbolName ?? null });
            if (/^(assert(?:\.|$)|expect(?:\.|$))/u.test(observed.name)) assertions.push({ assertionId: invocationId, testId, assertionKind: observed.name, startLine: observed.line, expressionText: observed.text });
            if (/(^|\.)(fixture|mkdtemp|mkdir|writeFile|readFile|tmpdir)(\.|$)/iu.test(observed.name)) fixtureUsages.push({ fixtureUsageId: invocationId, testId, fixtureKind: observed.name, startLine: observed.line });
            if (/^(mock|jest|vi|sinon)(\.|$)|\.mock(?:Implementation|ReturnValue|ResolvedValue)?$/iu.test(observed.name)) mockUsages.push({ mockUsageId: invocationId, testId, mockKind: observed.name, startLine: observed.line });
          }
          const matched = scenarios.filter((scenario) => scenario.implementationSymbols.some((symbol) => invokedProductionSymbols.has(symbol)));
          const distinctScenarioIds = [...new Set(matched.map((row) => row.scenarioId))];
          const posture = distinctScenarioIds.length === 1 ? "REGRESSION_CANDIDATE" : "UNBOUND_TEST";
          const bindingDisposition = distinctScenarioIds.length > 1 ? "TEST_NOT_ATOMIC" : distinctScenarioIds.length === 1 ? "CANDIDATE_NOT_ADMITTED" : "NO_SCENARIO_CANDIDATE";
          testCases.push({ testId, testFilePath: relativePath, suiteId: suiteStack.at(-1)?.suiteId ?? null, suitePath: suiteStack.map((row) => row.suiteName), testName: title, framework: "node:test", startLine: lineOf(source, node), executionStatus: name.includes(".skip") ? "SKIPPED" : name.includes(".todo") ? "TODO" : "ENABLED", currentPosture: posture, canonicalBindingDisposition: "UNBOUND_TEST", candidateBindingDisposition: bindingDisposition });
          for (const scenario of matched) candidates.push({ candidateId: digest(`${testId}\0${scenario.scenarioId}`), testId, ...scenario, distinctScenarioCount: distinctScenarioIds.length, bindingDisposition });
          artifactTests.push(testId);
          return;
        }
      }
      ts.forEachChild(node, (child) => visit(child, suiteStack, bindings));
    }
    visit(source);
    artifacts.push({ testArtifactKey: digest(`${image.rootId}\0${relativePath}`), testFilePath: relativePath, contentDigest: artifact.contentDigest, testCaseCount: artifactTests.length, analysisDisposition: "TEST_STRUCTURE_OBSERVED_NOT_ADMITTED" });
  }

  const uniqueSuites = uniqueBy(suites, "suiteId");
  const uniqueTests = uniqueBy(testCases, "testId");
  const uniqueAssertions = uniqueBy(assertions, "assertionId");
  const uniqueFixtures = uniqueBy(fixtureUsages, "fixtureUsageId");
  const uniqueMocks = uniqueBy(mockUsages, "mockUsageId");
  const uniqueInvocations = uniqueBy(invocations, "invocationId");
  const uniqueCandidates = uniqueBy(candidates, "candidateId");
  const meaningClassifications = uniqueTests.map((testCase) => classifiesTestMeaning({
    testCase,
    invocations: uniqueInvocations.filter((row) => row.testId === testCase.testId),
    assertions: uniqueAssertions.filter((row) => row.testId === testCase.testId),
    fixtureUsages: uniqueFixtures.filter((row) => row.testId === testCase.testId),
    mockUsages: uniqueMocks.filter((row) => row.testId === testCase.testId),
    candidates: uniqueCandidates.filter((row) => row.testId === testCase.testId),
  }));
  const analysis = {
    analysisType: "repository-test-knowledge.v2", rootId: image.rootId, applicationId, imageDigest: image.imageDigest, contractSnapshotId,
    artifacts, suites: uniqueSuites, testCases: uniqueTests, assertions: uniqueAssertions, fixtureUsages: uniqueFixtures, mockUsages: uniqueMocks, invocations: uniqueInvocations, candidates: uniqueCandidates,
    meaningClassifications,
    summary: {
      testArtifacts: artifacts.length, testCases: uniqueTests.length, suites: uniqueSuites.length, assertions: uniqueAssertions.length,
      fixtureUsages: uniqueFixtures.length, mockUsages: uniqueMocks.length, invocations: uniqueInvocations.length,
      candidateTests: uniqueTests.filter((row) => row.currentPosture === "REGRESSION_CANDIDATE").length,
      unboundTests: uniqueTests.filter((row) => row.currentPosture === "UNBOUND_TEST").length,
      meaningRecommendations: meaningClassifications.length,
      unresolvedMeanings: meaningClassifications.filter((row) => row.recommendedProofType === "NOISE_OR_UNRESOLVED").length,
    },
  };
  analysis.analysisDigest = digest(analysis);
  return Object.freeze(analysis);
}

export function verifiesRepositoryTestKnowledge(analysis) {
  if (analysis?.analysisType !== "repository-test-knowledge.v2") throw new Error("A repository-test-knowledge.v2 payload is required.");
  if (digest(Object.fromEntries(Object.entries(analysis).filter(([key]) => key !== "analysisDigest"))) !== analysis.analysisDigest) throw new Error("Repository test knowledge digest is invalid.");
  if (analysis.testCases.length !== analysis.summary.testCases || analysis.artifacts.length !== analysis.summary.testArtifacts) throw new Error("Repository test knowledge counts are invalid.");
  if (analysis.meaningClassifications.length !== analysis.testCases.length || analysis.summary.meaningRecommendations !== analysis.testCases.length) throw new Error("Every observed test must receive one meaning recommendation.");
  return analysis;
}

function collectsImports(source) {
  const imports = new Map();
  for (const statement of source.statements) if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
    const specifier = statement.moduleSpecifier.text; const clause = statement.importClause;
    if (clause?.name) imports.set(clause.name.text, { importedName: "default", specifier });
    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) for (const element of clause.namedBindings.elements) imports.set(element.name.text, { importedName: element.propertyName?.text ?? element.name.text, specifier });
    if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) imports.set(clause.namedBindings.name.text, { importedName: "*", specifier });
  }
  return imports;
}

function collectsLocalFunctions(source) {
  const functions = new Map();
  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) functions.set(statement.name.text, statement.body);
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name) && declaration.initializer && (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))) functions.set(declaration.name.text, declaration.initializer.body);
  }
  return functions;
}

function collectsBodyCalls(root, source, localFunctions) {
  const calls = []; const visitedHelpers = new Set();
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const name = callName(node.expression);
      if (name) calls.push({ name, start: node.getStart(source), line: lineOf(source, node), text: node.getText(source) });
      const helper = name.split(".")[0];
      if (localFunctions.has(helper) && !visitedHelpers.has(helper)) { visitedHelpers.add(helper); visit(localFunctions.get(helper)); }
    }
    ts.forEachChild(node, visit);
  }
  if (root) visit(root);
  return calls;
}

function resolvesProductionInvocation(testPath, invokedName, imported) {
  if (!imported?.specifier?.startsWith(".")) return null;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(testPath), imported.specifier));
  if (!resolved.startsWith("src/")) return null;
  const member = invokedName.split(".")[1];
  return { modulePath: resolved.replace(/\.[cm]?[jt]sx?$/iu, ""), symbolName: imported.importedName === "*" ? member : imported.importedName === "default" ? invokedName.split(".")[0] : imported.importedName };
}

function scriptKind(relativePath) {
  return /tsx$/iu.test(relativePath) ? ts.ScriptKind.TSX : /ts$/iu.test(relativePath) ? ts.ScriptKind.TS : /jsx$/iu.test(relativePath) ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
}

function uniqueBy(rows, key) { return [...new Map(rows.map((row) => [row[key], row])).values()]; }
