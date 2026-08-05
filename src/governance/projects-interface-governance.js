import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { projectsCliEntryPointCallGraph } from "../call-graph.js";

function repositoryPath(workspaceRelativePrefix, modulePath) {
  if (!workspaceRelativePrefix || modulePath === workspaceRelativePrefix || modulePath.startsWith(`${workspaceRelativePrefix}/`)) return modulePath;
  return `${workspaceRelativePrefix}/${modulePath}`;
}

function parsesTopLevelCliDispatch(source) {
  const rows = [];
  const branchPattern = /\b(?:if|else\s+if)\s*\(([^\n]+)\)\s*\{\s*(?:await\s+)?([A-Za-z_$][\w$]*)\(args\.slice\(1\)\);/gu;
  for (const match of source.matchAll(branchPattern)) {
    const commandNames = [...match[1].matchAll(/command\s*===\s*["']([^"']+)["']/gu)].map((item) => item[1]);
    for (const commandName of commandNames) rows.push({ commandName, handlerName: match[2] });
  }
  return rows;
}

function scenarioBindings(scenarioConformance) {
  return scenarioConformance.features.flatMap((feature) => feature.scenarios.flatMap((scenario) => (
    scenario.obligations.flatMap((obligation) => obligation.responsibilities.map((responsibility) => ({
      featureId: feature.featureId,
      scenarioId: scenario.scenarioId,
      responsibilityId: responsibility.responsibilityId,
      bodyFile: responsibility.bodyFile,
      authorityFile: feature.authorityFile,
    })))
  )));
}

function classifiesCallable(callable, rootIds) {
  if (rootIds.has(callable.symbolId)) return "CLI_FEATURE_ROOT";
  if ((callable.reachableFromCliRootIds?.length ?? 0) > 1) return "SHARED_CLI_INFRASTRUCTURE";
  if ((callable.reachableFromCliRootIds?.length ?? 0) === 1) return "CLI_FEATURE_REACHABLE";
  if (callable.callableDisposition === "RUNTIME_RESOLUTION_REQUIRED") return "RUNTIME_RESOLUTION_REQUIRED";
  if (/(?:^|\/)(?:test|tests|verification|proofs?)(?:\/|$)|(?:^|\.)test\.[cm]?[jt]s$/iu.test(callable.modulePath)) return "TEST_OR_PROOF_ONLY";
  if (/(?:^|\/)(?:generated|artifacts|dist|build)(?:\/|$)|\.generated\./iu.test(callable.modulePath)) return "GENERATED_ARTIFACT";
  return "NO_CLI_REACHABILITY";
}

function buildsReachabilityRows(callGraph, commandNamesByHandler, workspaceRelativePrefix) {
  return callGraph.roots.flatMap((root) => {
    const nodes = new Map(root.nodes.map((node) => [node.symbolId, node]));
    return root.nodes.map((node) => {
      const path = [];
      const relationshipIds = [];
      let current = node;
      while (current) {
        path.push(current.symbolId);
        if (current.viaRelationshipId) relationshipIds.push(current.viaRelationshipId);
        current = current.parentSymbolId ? nodes.get(current.parentSymbolId) ?? null : null;
      }
      return {
        entryPointId: root.symbolId,
        commandNames: commandNamesByHandler.get(root.name) ?? [],
        runnerSymbol: root.name,
        symbolId: node.symbolId,
        reachableSymbolId: node.symbolId,
        reachableSymbolName: node.name,
        modulePath: repositoryPath(workspaceRelativePrefix, node.modulePath),
        depth: node.depth,
        pathWitness: path.reverse(),
        relationshipIds: relationshipIds.reverse(),
        resolutionDisposition: "STATICALLY_RESOLVED",
      };
    });
  });
}

export async function projectsInterfaceGovernance({
  index,
  scenarioConformance,
  canonicalFeatureQueryPlane = {},
  workspaceRelativePrefix = "",
  cliAuthorityFiles = [],
}) {
  const rootModulePath = resolvesCliRootModulePath(index);
  const callGraph = projectsCliEntryPointCallGraph(index, { rootModulePath });
  const workspaceRoot = index.manifest?.scanRequest?.workspaceRoot ?? null;
  let source = null;
  let dispatchEvidenceDisposition = "CLI_DISPATCH_SOURCE_UNAVAILABLE";
  if (typeof workspaceRoot === "string" && workspaceRoot.length > 0) {
    try {
      source = await fs.readFile(path.join(workspaceRoot, ...rootModulePath.split("/")), "utf8");
      dispatchEvidenceDisposition = "CLI_DISPATCH_SOURCE_PARSED";
    } catch {
      // The source-fact entrypoint inventory remains usable without raw source text.
    }
  }
  const dispatchRows = source ? parsesTopLevelCliDispatch(source) : [];
  const dispatchByHandler = new Map();
  for (const row of dispatchRows) {
    const bucket = dispatchByHandler.get(row.handlerName) ?? [];
    bucket.push(row.commandName);
    dispatchByHandler.set(row.handlerName, bucket);
  }
  const bindings = scenarioBindings(scenarioConformance);
  const canonicalInterfacesBySymbolId = new Map();
  for (const trace of canonicalFeatureQueryPlane.canonicalTraces?.featureToInterface ?? []) {
    if (!trace.symbolId || trace.interfaceDisposition !== "INTERFACE_ROOT_RESOLVED") continue;
    const rows = canonicalInterfacesBySymbolId.get(trace.symbolId) ?? [];
    rows.push(trace);
    canonicalInterfacesBySymbolId.set(trace.symbolId, rows);
  }
  const intentFeaturesById = new Map((canonicalFeatureQueryPlane.canonicalIntents?.features ?? []).map((feature) => [feature.featureId, feature]));
  const intentScenarios = canonicalFeatureQueryPlane.canonicalIntents?.scenarios ?? [];
  const intentResponsibilities = canonicalFeatureQueryPlane.canonicalIntents?.responsibilities ?? [];
  const rootIds = new Set(callGraph.roots.map((root) => root.symbolId));
  const callableInventory = callGraph.callables.map((callable) => ({
    ...callable,
    modulePath: repositoryPath(workspaceRelativePrefix, callable.modulePath),
    cliClosureClassification: classifiesCallable(callable, rootIds),
  }));
  const callableById = new Map(callableInventory.map((row) => [row.symbolId, row]));
  const reachability = buildsReachabilityRows(callGraph, dispatchByHandler, workspaceRelativePrefix);
  const commands = callGraph.roots.flatMap((root) => {
    const reachableModulePaths = new Set(root.nodes.map((node) => repositoryPath(workspaceRelativePrefix, node.modulePath)));
    const reachableSymbolNames = new Set(root.nodes.map((node) => node.name));
    const matched = bindings.filter((binding) => reachableModulePaths.has(binding.bodyFile)
      || reachableSymbolNames.has(binding.responsibilityId));
    const canonicalInterfaceTraces = canonicalInterfacesBySymbolId.get(root.symbolId) ?? [];
    const canonicalFeatureIds = [...new Set([...matched.map((item) => item.featureId), ...canonicalInterfaceTraces.map((item) => item.featureId)])].sort();
    const canonicalScenarioIds = [...new Set([
      ...matched.map((item) => item.scenarioId),
      ...intentScenarios.filter((item) => canonicalFeatureIds.includes(item.featureId)).map((item) => item.scenarioId),
    ])].sort();
    const canonicalResponsibilityIds = [...new Set([
      ...matched.map((item) => item.responsibilityId),
      ...intentResponsibilities.filter((item) => canonicalFeatureIds.includes(item.featureId)).map((item) => item.responsibilityId),
    ])].sort();
    const canonicalAuthorityFiles = [...new Set(matched.map((item) => item.authorityFile))].sort();
    const commandNames = dispatchByHandler.get(root.name) ?? [null];
    return commandNames.map((commandName) => {
      const featureLinked = canonicalFeatureIds.length > 0;
      const interfaceAuthorityBound = cliAuthorityFiles.length > 0;
      return {
        commandName,
        subcommandName: null,
        handlerName: root.name,
        entryPointId: root.symbolId,
        interfaceKind: "CLI_COMMAND",
        interfaceStatus: "FIRST_CLASS_OBSERVED_INTERFACE",
        productDisposition: "PRODUCT_ENTRY_POINT",
        admissionDisposition: cliAuthorityFiles.length > 0 ? "ADMITTED_CLI_SURFACE" : "OBSERVED_NOT_ADMITTED",
        modulePath: repositoryPath(workspaceRelativePrefix, root.modulePath),
        sourceReferenceId: root.entrySourceReferenceId,
        declarationLine: root.entryLine,
        reachableCallableCount: root.nodes.length,
        canonicalFeatureIds,
        canonicalScenarioIds,
        canonicalResponsibilityIds,
        canonicalAuthorityFiles,
        canonicalFeatureIntentFiles: canonicalFeatureIds.map((featureId) => intentFeaturesById.get(featureId)?.intentFile).filter(Boolean).sort(),
        canonicalFeatureLifecycles: canonicalFeatureIds.map((featureId) => intentFeaturesById.get(featureId)?.lifecycle).filter(Boolean).sort(),
        cliInterfaceAuthorityFiles: [...cliAuthorityFiles],
        featureAccessDisposition: featureLinked ? "CANONICAL_FEATURE_ACCESS_OBSERVED" : "CANONICAL_FEATURE_LINK_MISSING",
        interfaceAuthorityDisposition: interfaceAuthorityBound ? "CLI_INTERFACE_AUTHORITY_BOUND" : "CLI_INTERFACE_AUTHORITY_MISSING",
        governanceGapDisposition: featureLinked
          ? (interfaceAuthorityBound ? "CLI_INTERFACE_GOVERNED" : "CLI_INTERFACE_AUTHORITY_MISSING")
          : (interfaceAuthorityBound ? "CANONICAL_FEATURE_LINK_MISSING" : "FEATURE_AND_INTERFACE_AUTHORITY_MISSING"),
      };
    });
  }).sort((left, right) => String(left.commandName).localeCompare(String(right.commandName)) || left.handlerName.localeCompare(right.handlerName));
  const commandsByEntryPoint = new Map();
  for (const command of commands) {
    const rows = commandsByEntryPoint.get(command.entryPointId) ?? [];
    rows.push(command);
    commandsByEntryPoint.set(command.entryPointId, rows);
  }
  const commandsWithAliases = commands.map((command) => {
    const aliases = (commandsByEntryPoint.get(command.entryPointId) ?? []).map((row) => row.commandName).filter(Boolean).sort();
    return Object.freeze({
      ...command,
      canonicalCommandName: aliases[0] ?? command.commandName,
      commandAliases: Object.freeze(aliases),
      executionSliceDisposition: aliases.length > 1 ? "MULTIPLE_INTERFACE_ALIASES_ONE_EXECUTION_SLICE" : "ONE_INTERFACE_ONE_EXECUTION_SLICE",
    });
  });
  const observedHttpEntryPoints = (callGraph.entryPoints ?? [])
    .filter((entry) => entry.entryKinds.includes("http-server-entry")).length;
  const linkedFeatureIds = [...new Set(commandsWithAliases.flatMap((row) => row.canonicalFeatureIds))].sort();
  const commandsWithCanonicalFeature = commandsWithAliases.filter((row) => row.canonicalFeatureIds.length > 0).length;
  const references = new Map((index.sourceReferences ?? []).map((row) => [row.referenceId, row]));
  const symbols = new Map((index.symbols ?? []).map((row) => [row.symbolId, row]));
  const relationships = index.relationships ?? [];
  const callersByTargetName = new Map();
  const calleesByOwner = new Map();
  for (const relationship of relationships.filter((row) => row.relationshipKind === "invocation")) {
    if (relationship.toSymbolCandidate) {
      const callers = callersByTargetName.get(relationship.toSymbolCandidate) ?? [];
      callers.push(relationship);
      callersByTargetName.set(relationship.toSymbolCandidate, callers);
    }
    if (relationship.fromSymbolId) {
      const callees = calleesByOwner.get(relationship.fromSymbolId) ?? [];
      callees.push(relationship);
      calleesByOwner.set(relationship.fromSymbolId, callees);
    }
  }
  const sourceFacts = (index.bodyMechanics ?? []).map((mechanic) => {
    const reference = references.get(mechanic.sourceReferenceId) ?? null;
    const symbol = callableById.get(mechanic.fromSymbolId) ?? null;
    const callers = symbol ? callersByTargetName.get(symbol.name) ?? [] : [];
    const callees = symbol ? calleesByOwner.get(symbol.symbolId) ?? [] : [];
    const authorityBindings = symbol ? bindings.filter((row) => row.bodyFile === symbol.modulePath || row.responsibilityId === symbol.name) : [];
    return {
      occurrenceId: mechanic.bodyMechanicId ?? mechanic.mechanicId,
      symbolId: mechanic.fromSymbolId ?? null,
      symbolName: symbols.get(mechanic.fromSymbolId)?.name ?? null,
      modulePath: repositoryPath(workspaceRelativePrefix, mechanic.modulePath),
      mechanic: mechanic.mechanic,
      sourceReferenceId: mechanic.sourceReferenceId,
      startLine: reference?.startLine ?? null,
      startColumn: reference?.startColumn ?? null,
      cliClosureClassification: symbol?.cliClosureClassification ?? "RUNTIME_RESOLUTION_REQUIRED",
      originatingEntryPointIds: symbol?.reachableFromCliRootIds ?? [],
      callerCount: callers.length,
      calleeCount: callees.length,
      exportPosture: symbol?.isExported ? "EXPORTED_CALLABLE" : "NOT_EXPORTED",
      dynamicCandidatePosture: symbol?.callableDisposition === "RUNTIME_RESOLUTION_REQUIRED" || !mechanic.fromSymbolId
        ? "RUNTIME_RESOLUTION_REQUIRED" : "STATIC_OWNER_OBSERVED",
      authorityContext: [...new Set(authorityBindings.map((row) => row.authorityFile))].sort(),
    };
  });
  const unreachableCallables = callableInventory.filter((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY");
  const unreachableSourceFacts = sourceFacts.filter((row) => row.cliClosureClassification === "NO_CLI_REACHABILITY");
  const sharedReachability = callableInventory.filter((row) => row.cliClosureClassification === "SHARED_CLI_INFRASTRUCTURE");
  const runtimeResolutionDebt = callableInventory.filter((row) => row.cliClosureClassification === "RUNTIME_RESOLUTION_REQUIRED");
  const reachableSourceFacts = sourceFacts.filter((row) => ["CLI_FEATURE_ROOT", "CLI_FEATURE_REACHABLE", "SHARED_CLI_INFRASTRUCTURE"].includes(row.cliClosureClassification));
  const originatingCommands = reachability.map((row) => ({
    symbolId: row.reachableSymbolId,
    symbolName: row.reachableSymbolName,
    modulePath: row.modulePath,
    entryPointId: row.entryPointId,
    commandNames: row.commandNames,
    depth: row.depth,
    pathWitness: row.pathWitness,
    relationshipIds: row.relationshipIds,
  }));
  const removalImpact = unreachableCallables.map((callable) => {
    const callers = callersByTargetName.get(callable.name) ?? [];
    const callees = calleesByOwner.get(callable.symbolId) ?? [];
    const authorityBindings = bindings.filter((row) => row.bodyFile === callable.modulePath || row.responsibilityId === callable.name);
    return {
      symbolId: callable.symbolId,
      symbolName: callable.name,
      modulePath: callable.modulePath,
      sourceReferenceId: callable.sourceReferenceId,
      cliClosureClassification: callable.cliClosureClassification,
      callerInvocationCount: callers.length,
      calleeInvocationCount: callees.length,
      callerSymbolIds: [...new Set(callers.map((row) => row.fromSymbolId).filter(Boolean))].sort(),
      calleeSymbolIds: [...new Set(callees.map((row) => row.toSymbolId).filter(Boolean))].sort(),
      unresolvedCalleeCandidates: [...new Set(callees.filter((row) => !row.toSymbolId).map((row) => row.toSymbolCandidate).filter(Boolean))].sort(),
      isExported: callable.isExported,
      canonicalAuthorityFiles: [...new Set(authorityBindings.map((row) => row.authorityFile))].sort(),
      canonicalFeatureIds: [...new Set(authorityBindings.map((row) => row.featureId))].sort(),
      importReferences: relationships.filter((row) => row.relationshipKind === "dependency"
        && (row.toSymbolCandidate === callable.name || row.toSymbolCandidate === callable.modulePath)).map((row) => row.relationshipId).sort(),
      testReferenceFiles: [],
      testReferenceDisposition: "TEST_REFERENCES_OUTSIDE_REPORT_SUBJECT",
      generatedArtifactPaths: callable.cliClosureClassification === "GENERATED_ARTIFACT" ? [callable.modulePath] : [],
      affectedFiles: [...new Set([callable.modulePath, ...callers.map((row) => references.get(row.sourceReferenceId)?.modulePath).filter(Boolean), ...callees.map((row) => references.get(row.sourceReferenceId)?.modulePath).filter(Boolean)])].sort(),
      removalDisposition: callable.isExported || callers.length > 0 || authorityBindings.length > 0
        ? "REVIEW_BEFORE_REMOVAL"
        : "REMOVE_CANDIDATE",
    };
  });
  const summary = {
    interfacePortfolioDisposition: commands.length > 0 ? "CLI_IS_FIRST_CLASS_OBSERVED_INTERFACE" : "CLI_INTERFACE_NOT_OBSERVED",
    cliDispatchEvidenceDisposition: dispatchEvidenceDisposition,
    cliDispatchSourceHash: source ? `sha256:${createHash("sha256").update(source, "utf8").digest("hex")}` : null,
    observedCliCommandHandlers: callGraph.roots.length,
    observedCliCommandTokens: commandsWithAliases.filter((row) => row.commandName !== null).length,
    distinctCliExecutionSlices: commandsByEntryPoint.size,
    aliasedCliCommandTokens: commandsWithAliases.filter((row) => row.commandAliases.length > 1).length,
    observedHttpEntryPoints,
    commandsWithCanonicalFeature,
    commandsWithoutCanonicalFeature: commandsWithAliases.length - commandsWithCanonicalFeature,
    canonicalFeaturesAccessibleViaCli: linkedFeatureIds.length,
    canonicalFeatureIdsAccessibleViaCli: linkedFeatureIds,
    cliInterfaceAuthorityDocuments: cliAuthorityFiles.length,
    cliInterfaceAuthorityDisposition: cliAuthorityFiles.length > 0 ? "CLI_INTERFACE_AUTHORITY_BOUND" : "CLI_INTERFACE_AUTHORITY_MISSING",
    admittedCliCommands: cliAuthorityFiles.length > 0 ? commandsWithAliases.length : 0,
    runtimeCallables: callableInventory.length,
    cliReachableCallables: callableInventory.filter((row) => ["CLI_FEATURE_ROOT", "CLI_FEATURE_REACHABLE", "SHARED_CLI_INFRASTRUCTURE"].includes(row.cliClosureClassification)).length,
    sharedCliInfrastructure: sharedReachability.length,
    runtimeResolutionRequired: runtimeResolutionDebt.length,
    noCliReachabilityCallables: unreachableCallables.length,
    reachableMechanicOccurrences: reachableSourceFacts.length,
    unreachableMechanicOccurrences: unreachableSourceFacts.length,
  };
  return Object.freeze({
    summary: Object.freeze(summary),
    commands: Object.freeze(commandsWithAliases),
    callableInventory: Object.freeze(callableInventory),
    reachability: Object.freeze(reachability),
    sharedReachability: Object.freeze(sharedReachability),
    runtimeResolutionDebt: Object.freeze(runtimeResolutionDebt),
    reachableSourceFacts: Object.freeze(reachableSourceFacts),
    unreachableCallables: Object.freeze(unreachableCallables),
    unreachableSourceFacts: Object.freeze(unreachableSourceFacts),
    originatingCommands: Object.freeze(originatingCommands),
    removalImpact: Object.freeze(removalImpact),
  });
}

function resolvesCliRootModulePath(index) {
  const paths = new Set((index.files ?? []).map((file) => String(file.relativePath).replace(/\\/gu, "/")));
  if (paths.has("cli.js")) return "cli.js";
  if (paths.has("src/cli.js")) return "src/cli.js";
  const candidates = [...paths].filter((candidate) => candidate.endsWith("/cli.js")).sort();
  return candidates.length === 1 ? candidates[0] : "cli.js";
}
