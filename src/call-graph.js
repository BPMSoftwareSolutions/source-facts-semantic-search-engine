const callableKinds = new Set(["function", "method", "constructor", "class"]);
const defaultRootModulePath = "cli.js";
const defaultRuntimeModulePrefix = "";
const defaultRootNamePattern = /^(?:run|runs)[A-Z]/u;

export function projectsCliEntryPointCallGraph(index, options = {}) {
  const rootModulePath = normalizesModulePath(options.rootModulePath ?? defaultRootModulePath);
  const runtimeModulePrefix = normalizesModulePrefix(options.runtimeModulePrefix ?? defaultRuntimeModulePrefix);
  const rootNamePattern = options.rootNamePattern ?? defaultRootNamePattern;


  const sourceReferenceById = new Map((index.sourceReferences ?? []).map((reference) => [reference.referenceId, reference]));
  const runtimeSymbols = [];
  const symbolById = new Map();
  const symbolsByName = new Map();

  for (const symbol of index.symbols ?? []) {
    const modulePath = normalizesModulePath(symbol.modulePath);
    if (!modulePath.startsWith(runtimeModulePrefix)) continue;
    if (!callableKinds.has(symbol.kind)) continue;

    const runtimeSymbol = summarizesSymbol({ ...symbol, modulePath });
    runtimeSymbols.push(runtimeSymbol);
    symbolById.set(runtimeSymbol.symbolId, runtimeSymbol);
    const bucket = symbolsByName.get(runtimeSymbol.name) ?? [];
    bucket.push(runtimeSymbol);
    symbolsByName.set(runtimeSymbol.name, bucket);
  }

  const outgoingByCallerId = new Map();
  const rootsBySymbolId = new Map();
  const reachableBySymbolId = new Map();
  const globalEdgesById = new Map();

  for (const relationship of index.relationships ?? []) {
    if (relationship.relationshipKind !== "invocation") continue;

    const sourceReference = sourceReferenceById.get(relationship.sourceReferenceId);
    if (sourceReference === undefined) continue;

    const sourceModulePath = normalizesModulePath(sourceReference.modulePath);
    if (!sourceModulePath.startsWith(runtimeModulePrefix)) continue;

    const edge = resolvesInvocationEdge(relationship, sourceReference, symbolById, symbolsByName, runtimeModulePrefix, sourceModulePath);
    const hasCallableCaller = relationship.fromSymbolId !== null && symbolById.has(relationship.fromSymbolId);

    if (hasCallableCaller) {
      const callerEdges = outgoingByCallerId.get(relationship.fromSymbolId) ?? [];
      callerEdges.push(edge);
      outgoingByCallerId.set(relationship.fromSymbolId, callerEdges);
      globalEdgesById.set(edge.relationshipId, edge);
    }

    if (relationship.fromSymbolId === null && sourceModulePath === rootModulePath && rootNamePattern.test(edge.toSymbolCandidate ?? "")) {
      if (edge.resolutionDisposition !== "resolved") {
        throw new Error(`Unable to resolve CLI root candidate ${JSON.stringify(edge.toSymbolCandidate)} at ${edge.sourceReferenceId}: ${edge.resolutionDisposition} (${edge.resolutionReason ?? "unknown"})`);
      }
      const rootSymbol = symbolById.get(edge.toSymbolId);
      if (rootSymbol === undefined) {
        throw new Error(`Resolved CLI root symbol ${edge.toSymbolId} is missing from the runtime symbol index.`);
      }
      if (!rootsBySymbolId.has(rootSymbol.symbolId)) {
        rootsBySymbolId.set(rootSymbol.symbolId, {
          ...summarizesSymbol(rootSymbol),
          entryKind: "cli-command",
          entryRelationshipId: relationship.relationshipId,
          entrySourceReferenceId: relationship.sourceReferenceId,
          entryLine: sourceReference.startLine,
          entryColumn: sourceReference.startColumn,
        });
      }
    }
  }

  for (const edges of outgoingByCallerId.values()) {
    edges.sort(comparesEdges);
  }

  const roots = [...rootsBySymbolId.values()]
    .sort(comparesRoots)
    .map((rootEntry) => buildsRootGraph(rootEntry, outgoingByCallerId, symbolById));

  const rootNameById = new Map(roots.map((root) => [root.symbolId, root.name]));
  for (const root of roots) {
    for (const node of root.nodes) {
      const record = reachableBySymbolId.get(node.symbolId) ?? {
        symbol: symbolById.get(node.symbolId),
        reachableFrom: new Map(),
      };
      const currentDepth = record.reachableFrom.get(root.symbolId);
      if (currentDepth === undefined || node.depth < currentDepth) {
        record.reachableFrom.set(root.symbolId, node.depth);
      }
      reachableBySymbolId.set(node.symbolId, record);
    }
  }

  const reachability = [...reachableBySymbolId.values()]
    .map((record) => ({
      ...summarizesSymbol(record.symbol),
      minDepth: Math.min(...record.reachableFrom.values()),
      reachableFrom: [...record.reachableFrom.entries()]
        .map(([rootSymbolId, depth]) => ({
          rootSymbolId,
          rootName: rootNameById.get(rootSymbolId) ?? null,
          depth,
        }))
        .sort(comparesReachabilityRoots),
    }))
    .sort(comparesReachability);

  const reachableSymbolIds = new Set(reachability.map((entry) => entry.symbolId));
  const unreachableSymbols = runtimeSymbols
    .filter((symbol) => !reachableSymbolIds.has(symbol.symbolId))
    .map((symbol) => ({ ...symbol }))
    .sort(comparesReachability);

  const invocationEdges = [...globalEdgesById.values()];
  const resolvedInvocationEdgeCount = invocationEdges.filter((edge) => edge.resolutionDisposition === "resolved").length;
  const ambiguousInvocationEdgeCount = invocationEdges.filter((edge) => edge.resolutionDisposition === "ambiguous").length;
  const unresolvedInvocationEdgeCount = invocationEdges.filter((edge) => edge.resolutionDisposition === "unresolved").length;
  const maxDepth = roots.reduce((largest, root) => Math.max(largest, root.summary.maxDepth), 0);

  return {
    callGraphType: "cli-entry-point-call-graph.v1",
    indexId: index.indexId ?? null,
    scope: {
      rootModulePath,
      runtimeModulePrefix,
      callableKinds: [...callableKinds],
      rootNamePattern: rootNamePattern.source,
    },
    roots,
    reachability,
    unreachableSymbols,
    summary: {
      commandRootCount: roots.length,
      runtimeCallableCount: runtimeSymbols.length,
      reachableCallableCount: reachability.length,
      unreachableCallableCount: unreachableSymbols.length,
      invocationEdgeCount: invocationEdges.length,
      resolvedInvocationEdgeCount,
      ambiguousInvocationEdgeCount,
      unresolvedInvocationEdgeCount,
      maxDepth,
    },
  };
}

export function formatsCallGraphSummary(graph) {
  const summary = graph.summary ?? {};
  const lines = [
    `Call graph type: ${graph.callGraphType ?? "unknown"}`,
    `Command roots: ${summary.commandRootCount ?? 0}`,
    `Runtime callables: ${summary.runtimeCallableCount ?? 0}`,
    `Reachable callables: ${summary.reachableCallableCount ?? 0}`,
    `Unreachable callables: ${summary.unreachableCallableCount ?? 0}`,
    `Invocation edges: ${summary.invocationEdgeCount ?? 0}`,
    `Resolved edges: ${summary.resolvedInvocationEdgeCount ?? 0}`,
    `Ambiguous edges: ${summary.ambiguousInvocationEdgeCount ?? 0}`,
    `Unresolved edges: ${summary.unresolvedInvocationEdgeCount ?? 0}`,
    `Max depth: ${summary.maxDepth ?? 0}`,
  ];
  return `${lines.join("\n")}\n`;
}

function buildsRootGraph(rootEntry, outgoingByCallerId, symbolById) {
  const rootSymbol = symbolById.get(rootEntry.symbolId);
  if (rootSymbol === undefined) {
    throw new Error(`Unable to build a call graph for missing root symbol ${rootEntry.symbolId}.`);
  }

  const nodesById = new Map([[rootSymbol.symbolId, {
    ...summarizesSymbol(rootSymbol),
    depth: 0,
    parentSymbolId: null,
    viaRelationshipId: null,
  }]]);
  const queue = [rootSymbol.symbolId];
  const edgesByRelationshipId = new Map();

  for (let index = 0; index < queue.length; index++) {
    const callerId = queue[index];
    const callerDepth = nodesById.get(callerId)?.depth ?? 0;
    for (const edge of outgoingByCallerId.get(callerId) ?? []) {
      edgesByRelationshipId.set(edge.relationshipId, edge);
      if (edge.resolutionDisposition !== "resolved") continue;
      if (nodesById.has(edge.toSymbolId)) continue;

      const targetSymbol = symbolById.get(edge.toSymbolId);
      if (targetSymbol === undefined) continue;

      nodesById.set(edge.toSymbolId, {
        ...summarizesSymbol(targetSymbol),
        depth: callerDepth + 1,
        parentSymbolId: callerId,
        viaRelationshipId: edge.relationshipId,
      });
      queue.push(edge.toSymbolId);
    }
  }

  const nodes = [...nodesById.values()].sort(comparesNodes);
  const depthLayersByDepth = new Map();
  for (const node of nodes) {
    const layer = depthLayersByDepth.get(node.depth) ?? [];
    layer.push(node.symbolId);
    depthLayersByDepth.set(node.depth, layer);
  }

  const edges = [...edgesByRelationshipId.values()].sort(comparesEdges);
  const resolvedInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "resolved").length;
  const ambiguousInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "ambiguous").length;
  const unresolvedInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "unresolved").length;
  const directInvocationCount = edges.filter((edge) => edge.fromSymbolId === rootSymbol.symbolId).length;
  const maxDepth = nodes.reduce((largest, node) => Math.max(largest, node.depth), 0);

  return {
    ...rootEntry,
    nodes,
    edges,
    depthLayers: [...depthLayersByDepth.keys()].sort((left, right) => left - right).map((depth) => depthLayersByDepth.get(depth)),
    summary: {
      reachableCallableCount: nodes.length,
      directInvocationCount,
      invocationEdgeCount: edges.length,
      resolvedInvocationEdgeCount,
      ambiguousInvocationEdgeCount,
      unresolvedInvocationEdgeCount,
      maxDepth,
    },
  };
}

function resolvesInvocationEdge(relationship, sourceReference, symbolById, symbolsByName, runtimeModulePrefix, preferredModulePath) {
  const fromSymbol = typeof relationship.fromSymbolId === "string" ? symbolById.get(relationship.fromSymbolId) ?? null : null;
  const resolution = resolvesSymbolCandidate(relationship, sourceReference, symbolById, symbolsByName, runtimeModulePrefix, preferredModulePath);

  return {
    relationshipId: relationship.relationshipId,
    sourceReferenceId: relationship.sourceReferenceId,
    modulePath: normalizesModulePath(sourceReference.modulePath),
    sourceLine: sourceReference.startLine,
    sourceColumn: sourceReference.startColumn,
    fromSymbolId: fromSymbol?.symbolId ?? null,
    fromSymbolName: fromSymbol?.name ?? null,
    toSymbolCandidate: typeof relationship.toSymbolCandidate === "string" ? relationship.toSymbolCandidate : null,
    toSymbolId: resolution.symbol?.symbolId ?? null,
    toSymbolName: resolution.symbol?.name ?? null,
    toSymbolIds: resolution.symbolIds,
    resolutionDisposition: resolution.disposition,
    resolutionReason: resolution.reason,
    operator: relationship.operator ?? null,
  };
}

function resolvesSymbolCandidate(relationship, sourceReference, symbolById, symbolsByName, runtimeModulePrefix, preferredModulePath) {
  if (typeof relationship.toSymbolId === "string" && symbolById.has(relationship.toSymbolId)) {
    const symbol = symbolById.get(relationship.toSymbolId);
    return { disposition: "resolved", symbol, symbolIds: [symbol.symbolId], reason: null };
  }

  const candidate = typeof relationship.toSymbolCandidate === "string" ? relationship.toSymbolCandidate : null;
  if (candidate === null || candidate.length === 0) {
    return { disposition: "unresolved", symbol: null, symbolIds: [], reason: "missing-target-candidate" };
  }

  const matches = symbolsByName.get(candidate) ?? [];
  if (matches.length === 0) {
    return { disposition: "unresolved", symbol: null, symbolIds: [], reason: "no-symbol-match" };
  }

  if (preferredModulePath !== null) {
    const preferredMatches = matches.filter((symbol) => symbol.modulePath === preferredModulePath);
    if (preferredMatches.length === 1) {
      const symbol = preferredMatches[0];
      return { disposition: "resolved", symbol, symbolIds: [symbol.symbolId], reason: null };
    }
    if (preferredMatches.length > 1) {
      return { disposition: "ambiguous", symbol: null, symbolIds: preferredMatches.map((symbol) => symbol.symbolId), reason: "multiple-symbol-matches-in-preferred-module" };
    }
  }

  if (matches.length === 1) {
    const symbol = matches[0];
    return { disposition: "resolved", symbol, symbolIds: [symbol.symbolId], reason: null };
  }

  const sourceModulePath = normalizesModulePath(sourceReference.modulePath);
  const sameModuleMatches = matches.filter((symbol) => symbol.modulePath === sourceModulePath);
  if (sameModuleMatches.length === 1) {
    const symbol = sameModuleMatches[0];
    return { disposition: "resolved", symbol, symbolIds: [symbol.symbolId], reason: null };
  }
  if (sameModuleMatches.length > 1) {
    return { disposition: "ambiguous", symbol: null, symbolIds: sameModuleMatches.map((symbol) => symbol.symbolId), reason: "multiple-symbol-matches-in-source-module" };
  }

  const runtimeMatches = matches.filter((symbol) => symbol.modulePath.startsWith(runtimeModulePrefix));
  if (runtimeMatches.length === 1) {
    const symbol = runtimeMatches[0];
    return { disposition: "resolved", symbol, symbolIds: [symbol.symbolId], reason: null };
  }
  if (runtimeMatches.length > 1) {
    return { disposition: "ambiguous", symbol: null, symbolIds: runtimeMatches.map((symbol) => symbol.symbolId), reason: "multiple-symbol-matches-in-runtime-scope" };
  }

  return { disposition: "ambiguous", symbol: null, symbolIds: matches.map((symbol) => symbol.symbolId), reason: "multiple-symbol-matches" };
}

function summarizesSymbol(symbol) {
  return {
    symbolId: symbol.symbolId,
    symbolVersionId: symbol.symbolVersionId ?? null,
    kind: symbol.kind,
    name: symbol.name,
    modulePath: normalizesModulePath(symbol.modulePath),
    sourceReferenceId: symbol.sourceReferenceId ?? null,
    declarationLine: symbol.declarationLine ?? null,
    declarationColumn: symbol.declarationColumn ?? null,
  };
}

function comparesRoots(left, right) {
  return (left.entryLine - right.entryLine)
    || (left.entryColumn - right.entryColumn)
    || left.name.localeCompare(right.name)
    || left.symbolId.localeCompare(right.symbolId);
}

function comparesNodes(left, right) {
  return (left.depth - right.depth)
    || left.modulePath.localeCompare(right.modulePath)
    || ((left.declarationLine ?? 0) - (right.declarationLine ?? 0))
    || ((left.declarationColumn ?? 0) - (right.declarationColumn ?? 0))
    || left.name.localeCompare(right.name)
    || left.symbolId.localeCompare(right.symbolId);
}

function comparesEdges(left, right) {
  return left.modulePath.localeCompare(right.modulePath)
    || (left.sourceLine - right.sourceLine)
    || (left.sourceColumn - right.sourceColumn)
    || (left.fromSymbolName ?? "").localeCompare(right.fromSymbolName ?? "")
    || (left.toSymbolCandidate ?? "").localeCompare(right.toSymbolCandidate ?? "")
    || left.relationshipId.localeCompare(right.relationshipId);
}

function comparesReachability(left, right) {
  return left.modulePath.localeCompare(right.modulePath)
    || left.name.localeCompare(right.name)
    || left.symbolId.localeCompare(right.symbolId);
}

function comparesReachabilityRoots(left, right) {
  return (left.depth - right.depth)
    || (left.rootName ?? "").localeCompare(right.rootName ?? "")
    || left.rootSymbolId.localeCompare(right.rootSymbolId);
}

function normalizesModulePath(modulePath) {
  return typeof modulePath === "string" ? modulePath.replaceAll("\\", "/") : "";
}

function normalizesModulePrefix(modulePrefix) {
  const normalized = normalizesModulePath(modulePrefix);
  if (normalized.length === 0) return "";
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}
