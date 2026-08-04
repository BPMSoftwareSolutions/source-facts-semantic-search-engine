import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { projectsCliEntryPointCallGraph } from "../call-graph.js";
import Ajv2020 from "ajv/dist/2020.js";

const anchorPattern = /^\s*&(feature|scenario|given|when|then|and|but):([a-z0-9][a-z0-9._-]*)\s*$/iu;
const nodePattern = /^\s*(Feature|Scenario|Given|When|Then|And|But):?\s+(.+)\s*$/iu;
const schemaPath = fileURLToPath(new URL("../../contracts/canonical-feature-intent.schema.v1.json", import.meta.url));
let intentValidator;

function normalizesPath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//u, "");
}

function finding(code, identity, message) {
  return Object.freeze({ code, identity, message });
}

export function parsesCanonicalGherkin(source, { featureFile = "(unknown.feature)" } = {}) {
  const findings = [];
  const scenarios = [];
  let feature = null;
  let currentScenario = null;
  let pendingAnchor = null;
  const lines = source.replaceAll("\r\n", "\n").split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const anchorMatch = anchorPattern.exec(line);
    if (anchorMatch) {
      if (pendingAnchor !== null) findings.push(finding("GHERKIN_ANCHOR_ORPHANED", pendingAnchor.id, `Anchor on line ${pendingAnchor.line} is not attached to a Gherkin node.`));
      pendingAnchor = { kind: anchorMatch[1].toLowerCase(), id: anchorMatch[2], line: index + 1 };
      continue;
    }
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const nodeMatch = nodePattern.exec(line);
    if (!nodeMatch) {
      if (pendingAnchor !== null) {
        findings.push(finding("GHERKIN_ANCHOR_ORPHANED", pendingAnchor.id, `Anchor on line ${pendingAnchor.line} is followed by an unsupported node.`));
        pendingAnchor = null;
      }
      continue;
    }

    const keyword = nodeMatch[1][0].toUpperCase() + nodeMatch[1].slice(1).toLowerCase();
    const expectedKind = keyword.toLowerCase();
    if (pendingAnchor !== null && pendingAnchor.kind !== expectedKind) {
      findings.push(finding("GHERKIN_ANCHOR_KIND_MISMATCH", pendingAnchor.id, `&${pendingAnchor.kind} cannot identify ${keyword} on line ${index + 1}.`));
    }
    const anchor = pendingAnchor?.kind === expectedKind ? `&${pendingAnchor.kind}:${pendingAnchor.id}` : null;
    const id = pendingAnchor?.kind === expectedKind ? pendingAnchor.id : null;
    pendingAnchor = null;

    if (keyword === "Feature") {
      feature = { featureId: id, featureAnchor: anchor, title: nodeMatch[2], line: index + 1 };
    } else if (keyword === "Scenario") {
      currentScenario = { scenarioId: id, scenarioAnchor: anchor, title: nodeMatch[2], line: index + 1, steps: [] };
      scenarios.push(currentScenario);
    } else if (currentScenario !== null) {
      currentScenario.steps.push({ stepId: id, stepAnchor: anchor, keyword, text: nodeMatch[2], line: index + 1 });
    }
  }
  if (pendingAnchor !== null) findings.push(finding("GHERKIN_ANCHOR_ORPHANED", pendingAnchor.id, `Anchor on line ${pendingAnchor.line} is not attached to a Gherkin node.`));

  return Object.freeze({
    documentKind: "canonical-gherkin.v1",
    featureFile: normalizesPath(featureFile),
    feature: feature === null ? null : Object.freeze(feature),
    scenarios: Object.freeze(scenarios.map((scenario) => Object.freeze({ ...scenario, steps: Object.freeze(scenario.steps.map(Object.freeze)) }))),
    findings: Object.freeze(findings),
  });
}

async function loadsIntentValidator() {
  if (intentValidator !== undefined) return intentValidator;
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  intentValidator = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  return intentValidator;
}

function addsDuplicateFindings(nodes, code, findings) {
  const counts = new Map();
  for (const node of nodes.filter((candidate) => candidate.id !== null)) counts.set(node.id, (counts.get(node.id) ?? 0) + 1);
  for (const [id, count] of counts) if (count > 1) findings.push(finding(code, id, `Canonical identity occurs ${count} times.`));
}

function scenarioIntentSteps(scenario) {
  return [
    ["Given", scenario.givenId],
    ["When", scenario.whenId],
    ["Then", scenario.thenId],
    ["And", scenario.andId],
  ].filter(([, stepId]) => typeof stepId === "string").map(([keyword, stepId]) => ({ keyword, stepId }));
}

export async function validatesCanonicalFeatureIntent({ gherkinSource, featureFile, intent }) {
  const parsed = parsesCanonicalGherkin(gherkinSource, { featureFile });
  const findings = [...parsed.findings];
  const validate = await loadsIntentValidator();
  if (!validate(intent)) {
    for (const error of validate.errors ?? []) findings.push(finding("CANONICAL_INTENT_SCHEMA_INVALID", error.instancePath || "/", error.message));
    return Object.freeze({ valid: false, parsed, findings: Object.freeze(findings) });
  }

  if (normalizesPath(intent.featureFile) !== parsed.featureFile) findings.push(finding("INTENT_FEATURE_FILE_MISMATCH", intent.featureId, `${intent.featureFile} does not identify ${parsed.featureFile}.`));
  if (parsed.feature?.featureId !== intent.featureId || parsed.feature?.featureAnchor !== intent.featureAnchor) findings.push(finding("FEATURE_ANCHOR_UNRESOLVED", intent.featureId, "The feature identity does not resolve bidirectionally."));

  const parsedScenariosById = new Map();
  for (const scenario of parsed.scenarios) {
    const entries = parsedScenariosById.get(scenario.scenarioId) ?? [];
    entries.push(scenario);
    parsedScenariosById.set(scenario.scenarioId, entries);
  }
  addsDuplicateFindings(parsed.scenarios.map((scenario) => ({ id: scenario.scenarioId })), "SCENARIO_ANCHOR_DUPLICATED", findings);

  const intentScenarioIds = new Set(intent.scenarios.map((scenario) => scenario.scenarioId));
  const allIntentStepKeys = new Set(intent.scenarios.flatMap(scenarioIntentSteps).map((step) => `${step.keyword.toLowerCase()}:${step.stepId}`));
  for (const scenario of parsed.scenarios) {
    if (scenario.scenarioId === null || !intentScenarioIds.has(scenario.scenarioId)) findings.push(finding("SCENARIO_ANCHOR_UNRESOLVED", scenario.scenarioId ?? `line:${scenario.line}`, "Gherkin scenario has no canonical intent."));
    for (const step of scenario.steps) {
      const key = `${step.keyword.toLowerCase()}:${step.stepId}`;
      if (step.stepId === null || !allIntentStepKeys.has(key)) findings.push(finding("GHERKIN_STEP_INTENT_MISSING", step.stepId ?? `line:${step.line}`, "Gherkin step has no matching canonical step intent."));
    }
  }
  for (const scenarioIntent of intent.scenarios) {
    const matches = parsedScenariosById.get(scenarioIntent.scenarioId) ?? [];
    if (matches.length !== 1 || matches[0].scenarioAnchor !== scenarioIntent.scenarioAnchor) {
      findings.push(finding(matches.length > 1 ? "SCENARIO_ANCHOR_DUPLICATED" : "SCENARIO_ANCHOR_UNRESOLVED", scenarioIntent.scenarioId, "Canonical scenario does not resolve to exactly one Gherkin anchor."));
      continue;
    }
    const parsedSteps = matches[0].steps;
    const intendedSteps = scenarioIntentSteps(scenarioIntent);
    const parsedKeys = new Set(parsedSteps.map((step) => `${step.keyword.toLowerCase()}:${step.stepId}`));
    const intentKeys = new Set(intendedSteps.map((step) => `${step.keyword.toLowerCase()}:${step.stepId}`));
    for (const step of parsedSteps) {
      const key = `${step.keyword.toLowerCase()}:${step.stepId}`;
      if (step.stepId === null || !intentKeys.has(key)) findings.push(finding("GHERKIN_STEP_INTENT_MISSING", step.stepId ?? `line:${step.line}`, "Gherkin step has no matching canonical step intent."));
    }
    for (const step of intendedSteps) {
      const key = `${step.keyword.toLowerCase()}:${step.stepId}`;
      if (!parsedKeys.has(key)) findings.push(finding("GHERKIN_STEP_INTENT_MISSING", step.stepId, "Canonical step intent has no matching Gherkin anchor."));
    }
  }

  addsDuplicateFindings(intent.scenarios.map((scenario) => ({ id: scenario.responsibilityId })), "RESPONSIBILITY_CARDINALITY_INVALID", findings);
  addsDuplicateFindings(intent.scenarios.map((scenario) => ({ id: scenario.obligationId })), "OBLIGATION_CARDINALITY_INVALID", findings);
  const allIds = [{ id: intent.featureId }, ...intent.scenarios.flatMap((scenario) => [
    { id: scenario.scenarioId }, { id: scenario.responsibilityId }, { id: scenario.obligationId }, ...scenarioIntentSteps(scenario).map((step) => ({ id: step.stepId })),
  ])];
  addsDuplicateFindings(allIds, "CANONICAL_ID_REUSED", findings);

  const uniqueFindings = [...new Map(findings.map((entry) => [`${entry.code}\0${entry.identity}\0${entry.message}`, entry])).values()]
    .sort((left, right) => left.code.localeCompare(right.code) || String(left.identity).localeCompare(String(right.identity)));
  return Object.freeze({ valid: uniqueFindings.length === 0, parsed, findings: Object.freeze(uniqueFindings) });
}

function relativePath(relativeTo, filePath) {
  return path.relative(relativeTo, filePath).replaceAll("\\", "/");
}

async function listsCanonicalFeatureFiles(featuresDir) {
  let entries;
  try {
    entries = await readdir(featuresDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.filter((entry) => entry.isFile() && (entry.name.endsWith(".feature") || entry.name.endsWith(".intent.json")))
    .map((entry) => path.join(featuresDir, entry.name)).sort();
}

export async function discoversCanonicalFeatureIntents(featuresDir, { relativeTo = featuresDir } = {}) {
  const root = path.resolve(featuresDir);
  const files = await listsCanonicalFeatureFiles(root);
  const featureFiles = new Map(files.filter((file) => file.endsWith(".feature")).map((file) => [path.basename(file, ".feature"), file]));
  const intentFiles = new Map(files.filter((file) => file.endsWith(".intent.json")).map((file) => [path.basename(file, ".intent.json"), file]));
  const pairNames = [...new Set([...featureFiles.keys(), ...intentFiles.keys()])].sort();
  const pairs = [];
  const findings = [];

  for (const pairName of pairNames) {
    const featurePath = featureFiles.get(pairName);
    const intentPath = intentFiles.get(pairName);
    if (!featurePath) {
      findings.push(finding("FEATURE_ANCHOR_UNRESOLVED", pairName, `No .feature file exists for ${relativePath(relativeTo, intentPath)}.`));
      continue;
    }
    if (!intentPath) {
      findings.push(finding("FEATURE_INTENT_MISSING", pairName, `No canonical intent exists for ${relativePath(relativeTo, featurePath)}.`));
      continue;
    }
    const featureFile = relativePath(relativeTo, featurePath);
    const intentFile = relativePath(relativeTo, intentPath);
    const [gherkinSource, intentSource] = await Promise.all([readFile(featurePath, "utf8"), readFile(intentPath, "utf8")]);
    let intent;
    try {
      intent = JSON.parse(intentSource);
    } catch (error) {
      findings.push(finding("CANONICAL_INTENT_JSON_INVALID", intentFile, error.message));
      continue;
    }
    const validation = await validatesCanonicalFeatureIntent({ gherkinSource, featureFile, intent });
    findings.push(...validation.findings.map((entry) => finding(entry.code, `${intentFile}:${entry.identity}`, entry.message)));
    pairs.push(Object.freeze({ pairName, featureFile, intentFile, intent: Object.freeze(intent), parsed: validation.parsed, validation }));
  }

  const identityOwners = new Map();
  for (const pair of pairs) {
    const scenarioIntents = Array.isArray(pair.intent.scenarios) ? pair.intent.scenarios : [];
    const identities = [pair.intent.featureId, ...scenarioIntents.flatMap((scenario) => [
      scenario.scenarioId, scenario.responsibilityId, scenario.obligationId,
      ...scenarioIntentSteps(scenario).map((step) => step.stepId),
    ])];
    for (const identity of identities) {
      if (typeof identity !== "string") continue;
      const owners = identityOwners.get(identity) ?? [];
      owners.push(pair.intentFile);
      identityOwners.set(identity, owners);
    }
  }
  for (const [identity, owners] of identityOwners) {
    if (owners.length > 1) findings.push(finding("CANONICAL_ID_REUSED", identity, `Identity is declared by ${owners.join(", ")}.`));
  }
  const uniqueFindings = [...new Map(findings.map((entry) => [`${entry.code}\0${entry.identity}\0${entry.message}`, entry])).values()]
    .sort((left, right) => left.code.localeCompare(right.code) || String(left.identity).localeCompare(String(right.identity)));
  return Object.freeze({
    documentKind: "canonical-feature-intent-registry.v1",
    featuresDirectory: relativePath(relativeTo, root),
    pairs: Object.freeze(pairs),
    findings: Object.freeze(uniqueFindings),
    disposition: uniqueFindings.length === 0 ? "CANONICAL_FEATURE_INTENTS_VALID" : "CANONICAL_FEATURE_INTENT_FINDINGS",
  });
}

function splitsInterfaceRoot(interfaceRoot) {
  if (typeof interfaceRoot !== "string") return { interfaceFile: null, interfaceSymbol: null };
  const separator = interfaceRoot.lastIndexOf("#");
  if (separator < 1 || separator === interfaceRoot.length - 1) return { interfaceFile: null, interfaceSymbol: null };
  return { interfaceFile: normalizesPath(interfaceRoot.slice(0, separator)), interfaceSymbol: interfaceRoot.slice(separator + 1) };
}

function moduleMatchesInterfaceFile(modulePath, interfaceFile) {
  if (typeof modulePath !== "string" || typeof interfaceFile !== "string") return false;
  const normalized = normalizesPath(modulePath);
  return normalized === interfaceFile || interfaceFile.endsWith(`/${normalized}`) || normalized.endsWith(`/${interfaceFile}`);
}

function buildsPreResolvedReachability(rootSymbolId, symbolsById, relationships) {
  if (!rootSymbolId) return [];
  const outgoing = new Map();
  for (const relationship of relationships) {
    if (!relationship.fromSymbolId || !relationship.toSymbolId) continue;
    const rows = outgoing.get(relationship.fromSymbolId) ?? [];
    rows.push(relationship.toSymbolId);
    outgoing.set(relationship.fromSymbolId, rows);
  }
  const queue = [{ symbolId: rootSymbolId, depth: 0, parentSymbolId: null }];
  const seen = new Set();
  const nodes = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (seen.has(current.symbolId)) continue;
    seen.add(current.symbolId);
    if (symbolsById.has(current.symbolId)) nodes.push({ ...current });
    for (const target of outgoing.get(current.symbolId) ?? []) queue.push({ symbolId: target, depth: current.depth + 1, parentSymbolId: current.symbolId });
  }
  const root = { nodes };
  return nodes.map((node) => ({ symbol: symbolsById.get(node.symbolId), depth: node.depth, node, pathWitness: buildsNodePath(root, node) }));
}

function callableIdentity(symbol) {
  return `${normalizesPath(symbol.modulePath)}#${symbol.name}`;
}

function projectsLifecycle(lifecycle, subject) {
  if (typeof lifecycle !== "string") return null;
  return lifecycle.replace(/^FEATURE/u, subject);
}

export function projectsCanonicalFeatureQueryPlane(discovery, index) {
  const features = [];
  const scenarios = [];
  const steps = [];
  const intentFeatures = [];
  const intentScenarios = [];
  const responsibilities = [];
  const featureToInterface = [];
  const featureToCallgraph = [];
  const scenarioToSourceFacts = [];
  const obligationToMechanics = [];
  const responsibilityToCallgraph = [];
  const symbolsById = new Map((index.symbols ?? []).map((symbol) => [symbol.symbolId, symbol]));
  let callGraph;
  try {
    callGraph = projectsCliEntryPointCallGraph(index);
  } catch {
    callGraph = { roots: [] };
  }
  const graphRootsBySymbolId = new Map((callGraph.roots ?? []).map((root) => [root.symbolId, root]));
  const referencesById = new Map((index.sourceReferences ?? []).map((reference) => [reference.referenceId, reference]));
  const mechanicsBySymbol = new Map();
  for (const mechanic of index.bodyMechanics ?? []) {
    if (!mechanic.fromSymbolId) continue;
    const rows = mechanicsBySymbol.get(mechanic.fromSymbolId) ?? [];
    rows.push(mechanic);
    mechanicsBySymbol.set(mechanic.fromSymbolId, rows);
  }

  for (const pair of discovery?.pairs ?? []) {
    const intent = pair.intent;
    const scenarioIntents = Array.isArray(intent.scenarios) ? intent.scenarios : [];
    const parsedFeature = pair.parsed.feature;
    const validationDisposition = pair.validation.valid ? "CANONICAL_INTENT_VALID" : "CANONICAL_INTENT_INVALID";
    const parsedScenarioIds = pair.parsed.scenarios.map((scenario) => scenario.scenarioId).filter(Boolean);
    features.push({ featureId: parsedFeature?.featureId ?? intent.featureId, featureFile: pair.featureFile, featureAnchor: parsedFeature?.featureAnchor ?? null, purpose: parsedFeature?.title ?? null, scenarios: parsedScenarioIds, lineNumber: parsedFeature?.line ?? null, intentFile: pair.intentFile, validationDisposition });
    intentFeatures.push({ featureId: intent.featureId, intentFile: pair.intentFile, featureFile: intent.featureFile, featureAnchor: intent.featureAnchor, purpose: intent.purpose, scenarios: scenarioIntents.map((scenario) => scenario.scenarioId), interfaceRoot: intent.interfaceRoot ?? null, lifecycle: intent.lifecycle ?? null, authorityStatus: intent.authorityStatus ?? null, validationDisposition });
    const parsedScenarioById = new Map(pair.parsed.scenarios.map((scenario) => [scenario.scenarioId, scenario]));
    for (const scenarioIntent of scenarioIntents) {
      const parsedScenario = parsedScenarioById.get(scenarioIntent.scenarioId);
      const stepIds = (parsedScenario?.steps ?? []).map((step) => step.stepId).filter(Boolean);
      scenarios.push({ featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, scenarioAnchor: parsedScenario?.scenarioAnchor ?? null, featureFile: pair.featureFile, purpose: parsedScenario?.title ?? null, steps: stepIds, lineNumber: parsedScenario?.line ?? null, validationDisposition });
      intentScenarios.push({ featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, scenarioAnchor: scenarioIntent.scenarioAnchor, responsibilityId: scenarioIntent.responsibilityId, obligationId: scenarioIntent.obligationId, purpose: scenarioIntent.purpose ?? null, stepIds: scenarioIntentSteps(scenarioIntent).map((step) => step.stepId), intentFile: pair.intentFile, lifecycle: projectsLifecycle(intent.lifecycle, "SCENARIO") });
      responsibilities.push({ featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, responsibilityId: scenarioIntent.responsibilityId, obligationId: scenarioIntent.obligationId, obligationStatement: scenarioIntent.purpose ?? null, responsibilityType: "command-entry", implementationSymbols: scenarioIntent.implementationSymbols ?? [], lifecycle: projectsLifecycle(intent.lifecycle, "RESPONSIBILITY"), intentFile: pair.intentFile });
      for (const parsedStep of parsedScenario?.steps ?? []) steps.push({ featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, stepId: parsedStep.stepId, stepType: parsedStep.keyword, stepText: parsedStep.text, stepAnchor: parsedStep.stepAnchor, featureFile: pair.featureFile, lineNumber: parsedStep.line, validationDisposition });
    }

    const { interfaceFile, interfaceSymbol } = splitsInterfaceRoot(intent.interfaceRoot);
    const matchingSymbols = (index.symbols ?? []).filter((symbol) => symbol.name === interfaceSymbol && moduleMatchesInterfaceFile(symbol.modulePath, interfaceFile));
    const interfaceDisposition = matchingSymbols.length === 1 ? "INTERFACE_ROOT_RESOLVED" : matchingSymbols.length === 0 ? "INTERFACE_ROOT_MISSING" : "INTERFACE_ROOT_AMBIGUOUS";
    featureToInterface.push({ featureId: intent.featureId, featureFile: pair.featureFile, intentFile: pair.intentFile, interfaceRoot: intent.interfaceRoot ?? null, interfaceFile, interfaceSymbol, lineNumber: matchingSymbols.length === 1 ? matchingSymbols[0].declarationLine ?? null : null, symbolId: matchingSymbols.length === 1 ? matchingSymbols[0].symbolId : null, interfaceDisposition });
    const graphRoot = matchingSymbols.length === 1 ? graphRootsBySymbolId.get(matchingSymbols[0].symbolId) ?? null : null;
    const reachable = graphRoot
      ? graphRoot.nodes.map((node) => ({ symbol: symbolsById.get(node.symbolId) ?? node, depth: node.depth, node, pathWitness: buildsNodePath(graphRoot, node) }))
      : (matchingSymbols.length === 1 ? buildsPreResolvedReachability(matchingSymbols[0].symbolId, symbolsById, index.relationships ?? []) : []);
    for (const { symbol, depth, pathWitness } of reachable) {
      const graphEdges = graphRoot?.edges ?? (index.relationships ?? []);
      const incomingEdges = graphEdges.filter((edge) => edge.toSymbolId === symbol.symbolId).length;
      const outgoingEdges = graphEdges.filter((edge) => edge.fromSymbolId === symbol.symbolId && (edge.resolutionDisposition === undefined || edge.resolutionDisposition === "resolved")).length;
      featureToCallgraph.push({ featureId: intent.featureId, interfaceRoot: intent.interfaceRoot, callableId: callableIdentity(symbol), sourceSymbolId: symbol.symbolId, callableFile: symbol.modulePath, callableSymbol: symbol.name, depth, pathWitness, incomingEdges, outgoingEdges, interfaceDisposition });
    }
    for (const scenarioIntent of scenarioIntents) {
      const requestedSymbols = scenarioIntent.implementationSymbols ?? [];
      const boundSymbols = reachable.filter(({ symbol }) => requestedSymbols.includes(symbol.name));
      responsibilityToCallgraph.push({
        featureId: intent.featureId,
        scenarioId: scenarioIntent.scenarioId,
        responsibilityId: scenarioIntent.responsibilityId,
        obligationId: scenarioIntent.obligationId,
        interfaceRoot: intent.interfaceRoot ?? null,
        entryPointId: graphRoot?.symbolId ?? null,
        requestedImplementationSymbols: requestedSymbols,
        boundImplementationSymbols: boundSymbols.map(({ symbol }) => symbol.name).sort(),
        supportingCallableIds: reachable.map(({ symbol }) => callableIdentity(symbol)),
        bindingDisposition: requestedSymbols.length === 0 ? "RESPONSIBILITY_IMPLEMENTATION_BINDING_NOT_DECLARED"
          : boundSymbols.length === requestedSymbols.length ? "RESPONSIBILITY_EXECUTION_GRAPH_BOUND"
            : boundSymbols.length > 0 ? "RESPONSIBILITY_EXECUTION_GRAPH_PARTIALLY_BOUND" : "RESPONSIBILITY_EXECUTION_GRAPH_MISSING",
      });
      const mechanics = reachable.flatMap(({ symbol, depth }) => (mechanicsBySymbol.get(symbol.symbolId) ?? []).map((mechanic) => ({ symbol, depth, mechanic })));
      const counts = new Map();
      for (const row of mechanics) {
        const key = `${row.symbol.symbolId}\0${row.mechanic.mechanic}`;
        const aggregate = counts.get(key) ?? { featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, responsibilityId: scenarioIntent.responsibilityId, obligationId: scenarioIntent.obligationId, callableId: callableIdentity(row.symbol), sourceSymbolId: row.symbol.symbolId, callableFile: row.symbol.modulePath, callableSymbol: row.symbol.name, mechanicType: row.mechanic.mechanic, mechanicCount: 0, sourceReferences: [], bindingDisposition: "FEATURE_INTERFACE_ROOT_APPLIED" };
        aggregate.mechanicCount += 1;
        const reference = referencesById.get(row.mechanic.sourceReferenceId);
        aggregate.sourceReferences.push({ file: row.symbol.modulePath, line: reference?.startLine ?? null, column: reference?.startColumn ?? null, sourceReferenceId: row.mechanic.sourceReferenceId });
        counts.set(key, aggregate);
        obligationToMechanics.push({ featureId: intent.featureId, scenarioId: scenarioIntent.scenarioId, responsibilityId: scenarioIntent.responsibilityId, obligationId: scenarioIntent.obligationId, callableId: callableIdentity(row.symbol), sourceSymbolId: row.symbol.symbolId, mechanicType: row.mechanic.mechanic, mechanicLocation: { file: row.symbol.modulePath, line: reference?.startLine ?? null, column: reference?.startColumn ?? null, snippet: null, sourceReferenceId: row.mechanic.sourceReferenceId }, mechanicSemantic: `Observable ${row.mechanic.mechanic} mechanic; semantic authority is not yet admitted.`, mechanicSemanticDisposition: "SEMANTIC_AUTHORITY_NOT_ADMITTED", bindingDisposition: "FEATURE_INTERFACE_ROOT_APPLIED" });
      }
      scenarioToSourceFacts.push(...counts.values());
    }
  }
  const by = (keys) => (left, right) => keys.map((key) => {
    if (typeof left[key] === "number" && typeof right[key] === "number") return left[key] - right[key];
    return String(left[key] ?? "").localeCompare(String(right[key] ?? ""));
  }).find((value) => value !== 0) ?? 0;
  return Object.freeze({
    canonicalFeatures: Object.freeze({ features: Object.freeze(features.sort(by(["featureId"]))), scenarios: Object.freeze(scenarios.sort(by(["scenarioId"]))), steps: Object.freeze(steps.sort(by(["scenarioId", "lineNumber"]))) }),
    canonicalIntents: Object.freeze({ features: Object.freeze(intentFeatures.sort(by(["featureId"]))), scenarios: Object.freeze(intentScenarios.sort(by(["scenarioId"]))), responsibilities: Object.freeze(responsibilities.sort(by(["scenarioId"]))) }),
    canonicalTraces: Object.freeze({ featureToInterface: Object.freeze(featureToInterface.sort(by(["featureId"]))), featureToCallgraph: Object.freeze(featureToCallgraph.sort(by(["featureId", "depth", "callableId"]))), responsibilityToCallgraph: Object.freeze(responsibilityToCallgraph.sort(by(["featureId", "scenarioId", "responsibilityId"]))), scenarioToSourceFacts: Object.freeze(scenarioToSourceFacts.sort(by(["scenarioId", "callableId", "mechanicType"]))), obligationToMechanics: Object.freeze(obligationToMechanics.sort(by(["obligationId", "file", "line"]))) }),
  });
}

function buildsNodePath(root, node) {
  const nodesById = new Map(root.nodes.map((candidate) => [candidate.symbolId, candidate]));
  const path = [];
  let current = node;
  while (current) {
    path.push(current.symbolId);
    current = current.parentSymbolId ? nodesById.get(current.parentSymbolId) ?? null : null;
  }
  return path.reverse();
}
