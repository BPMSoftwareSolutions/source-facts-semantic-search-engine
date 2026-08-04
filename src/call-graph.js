const callableKinds = new Set(["function", "method", "constructor", "class"]);
const defaultRootModulePath = "cli.js";
const defaultRuntimeModulePrefix = "";
const defaultRootNamePattern = /^(?:run|runs)[A-Z]/u;
const entryKindPriority = new Map([
  ["cli-command", 0],
  ["cli-subcommand", 1],
  ["http-server-entry", 2],
  ["module-api", 3],
  ["cli-internal-dispatcher", 4],
  ["proof-script", 5],
  ["migration-script", 6],
  ["script-entry", 7],
  ["module-evaluation", 8],
]);
const callableDispositionPriority = new Map([
  ["REACHABLE", 0],
  ["SHARED_SUPPORT", 1],
  ["RUNTIME_RESOLUTION_REQUIRED", 2],
  ["UNREACHABLE", 3],
]);
const httpServerEntryNamePattern = /(?:serve|serves|server)/iu;
const scriptModulePathPattern = /(?:^|\/)(?:scripts?|bin|verification|proofs?|migrations?)(?:\/|$)/iu;
const proofModulePathPattern = /(?:^|\/)(?:verification|proofs?)(?:\/|$)/iu;
const migrationModulePathPattern = /(?:^|\/)migrations?(?:\/|$)|migrat/iu;

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
  const incomingByCalleeId = new Map();
  const ambiguousIncomingByCalleeId = new Map();
  const moduleScopeEdgesByModulePath = new Map();
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

    if (edge.resolutionDisposition === "resolved" && edge.toSymbolId !== null) {
      const calleeEdges = incomingByCalleeId.get(edge.toSymbolId) ?? [];
      calleeEdges.push(edge);
      incomingByCalleeId.set(edge.toSymbolId, calleeEdges);
    }

    if (edge.resolutionDisposition === "ambiguous") {
      for (const symbolId of edge.toSymbolIds) {
        const calleeEdges = ambiguousIncomingByCalleeId.get(symbolId) ?? [];
        calleeEdges.push(edge);
        ambiguousIncomingByCalleeId.set(symbolId, calleeEdges);
      }
    }

    if (relationship.fromSymbolId === null) {
      const moduleEdges = moduleScopeEdgesByModulePath.get(sourceModulePath) ?? [];
      moduleEdges.push(edge);
      moduleScopeEdgesByModulePath.set(sourceModulePath, moduleEdges);
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

  for (const symbol of runtimeSymbols) {
    const alreadyRoot = rootsBySymbolId.has(symbol.symbolId);
    if (symbol.isExported && !alreadyRoot) {
      rootsBySymbolId.set(symbol.symbolId, {
        ...symbol,
        entryKind: "exported-function",
        entryRelationshipId: null,
        entrySourceReferenceId: symbol.sourceReferenceId,
        entryLine: symbol.declarationLine,
        entryColumn: symbol.declarationColumn,
      });
    }
  }

  for (const edges of outgoingByCallerId.values()) {
    edges.sort(comparesEdges);
  }

  const roots = [...rootsBySymbolId.values()]
    .sort(comparesRoots)
    .map((rootEntry) => buildsRootGraph(rootEntry, outgoingByCallerId, incomingByCalleeId, symbolById));

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

  const cliSurfaceSymbolIds = new Set();
  for (const root of roots) {
    for (const node of root.nodes) {
      if (node.modulePath === rootModulePath && rootNamePattern.test(node.name)) {
        cliSurfaceSymbolIds.add(node.symbolId);
      }
    }
  }

  const entryPointInventory = buildsEntryPointInventory({
    roots,
    rootModulePath,
    rootNamePattern,
    cliSurfaceSymbolIds,
    directCliRootIds: new Set(roots.filter((root) => root.entryKind === "cli-command").map((root) => root.symbolId)),
    symbolById,
    outgoingByCallerId,
    incomingByCalleeId,
    ambiguousIncomingByCalleeId,
    moduleScopeEdgesByModulePath,
  });

  const entryPointReachability = buildsEntryPointReachability(
    entryPointInventory.entryPoints,
    entryPointInventory.entryPointOutgoingById,
    outgoingByCallerId,
    symbolById,
  );

  for (const entryPoint of entryPointInventory.entryPoints) {
    const downstream = entryPointReachability.downstreamByEntryPointId.get(entryPoint.entryPointId);
    if (downstream !== undefined) {
      entryPoint.downstreamCallableCount = downstream.downstreamCallableCount;
      entryPoint.downstreamMaxDepth = downstream.downstreamMaxDepth;
    }
  }

  const callables = buildsCallableInventory({
    runtimeSymbols,
    symbolById,
    cliReachabilityBySymbolId: reachableBySymbolId,
    inventoryReachabilityBySymbolId: entryPointReachability.reachableBySymbolId,
    entryPointById: entryPointInventory.entryPointsById,
    entryPointBySymbolId: entryPointInventory.entryPointBySymbolId,
    incomingByCalleeId,
    ambiguousIncomingByCalleeId,
    outgoingByCallerId,
  });

  const inventorySummary = summarizesInventory(entryPointInventory.entryPoints, callables);

  const commandRootCount = roots.filter((root) => root.entryKind === "cli-command").length;
  const exportedFunctionRootCount = roots.filter((root) => root.entryKind === "exported-function").length;

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
    entryPoints: entryPointInventory.entryPoints,
    callables,
    inventorySummary,
    summary: {
      commandRootCount,
      exportedFunctionRootCount,
      totalRootCount: roots.length,
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
  const inventorySummary = graph.inventorySummary ?? {};
  const lines = [
    `Call graph type: ${graph.callGraphType ?? "unknown"}`,
    `Command roots: ${summary.commandRootCount ?? 0}`,
    `Exported function roots: ${summary.exportedFunctionRootCount ?? 0}`,
    `Total entry points: ${summary.totalRootCount ?? 0}`,
    `Inventory entry points: ${inventorySummary.entryPointCount ?? 0}`,
    `Product entry points: ${inventorySummary.productEntryPointCount ?? 0}`,
    `Runtime callables: ${summary.runtimeCallableCount ?? 0}`,
    `Reachable callables: ${summary.reachableCallableCount ?? 0}`,
    `Unreachable callables: ${summary.unreachableCallableCount ?? 0}`,
    `Shared support callables: ${inventorySummary.sharedSupportCallableCount ?? 0}`,
    `Runtime-resolution required callables: ${inventorySummary.runtimeResolutionRequiredCallableCount ?? 0}`,
    `Invocation edges: ${summary.invocationEdgeCount ?? 0}`,
    `Resolved edges: ${summary.resolvedInvocationEdgeCount ?? 0}`,
    `Ambiguous edges: ${summary.ambiguousInvocationEdgeCount ?? 0}`,
    `Unresolved edges: ${summary.unresolvedInvocationEdgeCount ?? 0}`,
    `Max depth: ${summary.maxDepth ?? 0}`,
  ];
  return `${lines.join("\n")}\n`;
}

export function findsAffectedEntryPoints(graph, symbolId, options = {}) {
  const includeSynthetic = options.includeSynthetic !== false;
  const includeNonProduct = options.includeNonProduct !== false;
  const entryPoints = Array.isArray(graph.entryPoints) ? graph.entryPoints : [];
  const callables = Array.isArray(graph.callables) ? graph.callables : [];
  const entryPointById = new Map(entryPoints.map((entryPoint) => [entryPoint.entryPointId, entryPoint]));
  const callable = callables.find((entry) => entry.symbolId === symbolId);
  if (callable === undefined) return [];

  const entryPointIds = callable.inventoryReachableFromEntryPointIds ?? [];
  return entryPointIds
    .map((entryPointId) => entryPointById.get(entryPointId) ?? null)
    .filter((entryPoint) => entryPoint !== null)
    .filter((entryPoint) => includeSynthetic || entryPoint.synthetic !== true)
    .filter((entryPoint) => includeNonProduct || entryPoint.productEntryPoint === true)
    .sort(comparesEntryPoints);
}

function buildsEntryPointInventory({
  roots,
  rootModulePath,
  rootNamePattern,
  cliSurfaceSymbolIds,
  directCliRootIds,
  symbolById,
  outgoingByCallerId,
  incomingByCalleeId,
  ambiguousIncomingByCalleeId,
  moduleScopeEdgesByModulePath,
}) {
  const entryPointsById = new Map();
  const entryPointBySymbolId = new Map();
  const entryPointOutgoingById = new Map();
  const rootEntryBySymbolId = new Map(roots.map((root) => [root.symbolId, root]));

  for (const root of roots) {
    const symbol = symbolById.get(root.symbolId);
    if (symbol === undefined) continue;

    if (root.entryKind === "cli-command") {
      const sameModuleIncomingCount = countsIncomingFromModulePath({
        symbolId: symbol.symbolId,
        modulePath: rootModulePath,
        incomingByCalleeId,
        ambiguousIncomingByCalleeId,
        symbolById,
      });
      const sameModuleOutgoingCount = countsOutgoingToModulePath({
        symbolId: symbol.symbolId,
        modulePath: rootModulePath,
        outgoingByCallerId,
        symbolById,
        rootNamePattern,
      });
      const entryKinds = classifiesCliEntryKinds({
        symbol,
        isDirectCliRoot: directCliRootIds.has(symbol.symbolId),
        sameModuleIncomingCount,
        sameModuleOutgoingCount,
      });
      registersEntryPoint(entryPointsById, entryPointBySymbolId, {
        entryPointId: symbol.symbolId,
        symbol,
        kind: root.entryKind,
        entryKinds,
        productEntryPoint: true,
        synthetic: false,
        justificationDisposition: classifiesEntryPointJustification(entryKinds),
        evidenceKinds: [directCliRootIds.has(symbol.symbolId) ? "direct-cli-root" : "root-tree-reachability"],
        sourceReferenceId: root.sourceReferenceId ?? symbol.sourceReferenceId,
        entryLine: root.entryLine ?? symbol.declarationLine,
        entryColumn: root.entryColumn ?? symbol.declarationColumn,
        entryRelationshipId: root.entryRelationshipId ?? null,
        moduleScopeInvocationCount: 0,
        outgoingInvocationCount: outgoingByCallerId.get(symbol.symbolId)?.length ?? 0,
      });
    } else if (root.entryKind === "exported-function") {
      const entryKinds = classifiesModuleEntryKinds({ symbol });
      registersEntryPoint(entryPointsById, entryPointBySymbolId, {
        entryPointId: symbol.symbolId,
        symbol,
        kind: root.entryKind,
        entryKinds,
        productEntryPoint: true,
        synthetic: false,
        justificationDisposition: classifiesEntryPointJustification(entryKinds),
        evidenceKinds: ["cross-module-invocation"],
        sourceReferenceId: root.sourceReferenceId ?? symbol.sourceReferenceId,
        entryLine: root.entryLine ?? symbol.declarationLine,
        entryColumn: root.entryColumn ?? symbol.declarationColumn,
        entryRelationshipId: root.entryRelationshipId ?? null,
        moduleScopeInvocationCount: 0,
        outgoingInvocationCount: outgoingByCallerId.get(symbol.symbolId)?.length ?? 0,
      });
    }
  }

  for (const symbol of symbolById.values()) {
    if (symbol.modulePath === rootModulePath) {
      const sameModuleIncomingCount = countsIncomingFromModulePath({
        symbolId: symbol.symbolId,
        modulePath: rootModulePath,
        incomingByCalleeId,
        ambiguousIncomingByCalleeId,
        symbolById,
      });
      const sameModuleOutgoingCount = countsOutgoingToModulePath({
        symbolId: symbol.symbolId,
        modulePath: rootModulePath,
        outgoingByCallerId,
        symbolById,
        rootNamePattern,
      });
      const isDirectCliRoot = directCliRootIds.has(symbol.symbolId);
      const isCliSurface = cliSurfaceSymbolIds.has(symbol.symbolId)
        || isDirectCliRoot
        || rootNamePattern.test(symbol.name)
        || sameModuleIncomingCount > 0
        || sameModuleOutgoingCount > 0;
      if (!isCliSurface) continue;

      const entryKinds = classifiesCliEntryKinds({
        symbol,
        isDirectCliRoot,
        sameModuleIncomingCount,
        sameModuleOutgoingCount,
      });
      const rootEntry = rootEntryBySymbolId.get(symbol.symbolId) ?? null;

      registersEntryPoint(entryPointsById, entryPointBySymbolId, {
        entryPointId: symbol.symbolId,
        symbol,
        kind: rootEntry?.kind ?? symbol.kind,
        entryKinds,
        productEntryPoint: true,
        synthetic: false,
        justificationDisposition: classifiesEntryPointJustification(entryKinds),
        evidenceKinds: [isDirectCliRoot ? "direct-cli-root" : "cli-module-surface"],
        sourceReferenceId: rootEntry?.sourceReferenceId ?? symbol.sourceReferenceId,
        entryLine: rootEntry?.entryLine ?? symbol.declarationLine,
        entryColumn: rootEntry?.entryColumn ?? symbol.declarationColumn,
        entryRelationshipId: rootEntry?.entryRelationshipId ?? null,
        moduleScopeInvocationCount: 0,
        outgoingInvocationCount: outgoingByCallerId.get(symbol.symbolId)?.length ?? 0,
      });
      continue;
    }

    if (isScriptModulePath(symbol.modulePath)) continue;

    const externalIncomingCount = countsIncomingFromOtherModules({
      symbol,
      incomingByCalleeId,
      ambiguousIncomingByCalleeId,
      symbolById,
    });
    if (externalIncomingCount === 0) continue;

    const entryKinds = classifiesModuleEntryKinds({ symbol });
    registersEntryPoint(entryPointsById, entryPointBySymbolId, {
      entryPointId: symbol.symbolId,
      symbol,
      kind: symbol.kind,
      entryKinds,
      productEntryPoint: true,
      synthetic: false,
      justificationDisposition: classifiesEntryPointJustification(entryKinds),
      evidenceKinds: ["cross-module-invocation"],
      sourceReferenceId: symbol.sourceReferenceId,
      entryLine: symbol.declarationLine,
      entryColumn: symbol.declarationColumn,
      entryRelationshipId: null,
      moduleScopeInvocationCount: 0,
      outgoingInvocationCount: outgoingByCallerId.get(symbol.symbolId)?.length ?? 0,
    });
  }

  for (const [modulePath, moduleScopeEdges] of moduleScopeEdgesByModulePath.entries()) {
    const entryKinds = classifiesSyntheticEntryKinds(modulePath);
    registersEntryPoint(entryPointsById, entryPointBySymbolId, {
      entryPointId: `module-evaluation:${modulePath}`,
      symbolId: null,
      symbolVersionId: null,
      kind: "synthetic",
      name: "module-evaluation",
      modulePath,
      sourceReferenceId: moduleScopeEdges[0]?.sourceReferenceId ?? null,
      entryLine: moduleScopeEdges[0]?.sourceLine ?? null,
      entryColumn: moduleScopeEdges[0]?.sourceColumn ?? null,
      entryRelationshipId: null,
      entryKinds,
      productEntryPoint: false,
      synthetic: true,
      justificationDisposition: classifiesEntryPointJustification(entryKinds),
      evidenceKinds: ["module-scope-invocation"],
      moduleScopeInvocationCount: moduleScopeEdges.length,
      outgoingInvocationCount: moduleScopeEdges.length,
    });
  }

  const entryPoints = [...entryPointsById.values()].sort(comparesEntryPoints);
  for (const entryPoint of entryPoints) {
    const edges = entryPoint.synthetic === true
      ? (moduleScopeEdgesByModulePath.get(entryPoint.modulePath) ?? [])
      : (outgoingByCallerId.get(entryPoint.symbolId) ?? []);
    entryPointOutgoingById.set(entryPoint.entryPointId, edges);
  }

  return {
    entryPoints,
    entryPointsById,
    entryPointBySymbolId,
    entryPointOutgoingById,
  };
}

function buildsEntryPointReachability(entryPoints, entryPointOutgoingById, outgoingByCallerId, symbolById) {
  const reachableBySymbolId = new Map();
  const downstreamByEntryPointId = new Map();

  for (const entryPoint of entryPoints) {
    const visited = new Map();
    const queue = [];

    if (entryPoint.synthetic === true) {
      for (const edge of entryPointOutgoingById.get(entryPoint.entryPointId) ?? []) {
        if (edge.resolutionDisposition !== "resolved" || edge.toSymbolId === null) continue;
        queue.push({ symbolId: edge.toSymbolId, depth: 1 });
      }
    } else if (entryPoint.symbolId !== null) {
      queue.push({ symbolId: entryPoint.symbolId, depth: 0 });
    }

    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      const knownDepth = visited.get(current.symbolId);
      if (knownDepth !== undefined && knownDepth <= current.depth) continue;
      visited.set(current.symbolId, current.depth);

      for (const edge of outgoingByCallerId.get(current.symbolId) ?? []) {
        if (edge.resolutionDisposition !== "resolved" || edge.toSymbolId === null) continue;
        const targetDepth = current.depth + 1;
        const knownTargetDepth = visited.get(edge.toSymbolId);
        if (knownTargetDepth !== undefined && knownTargetDepth <= targetDepth) continue;
        queue.push({ symbolId: edge.toSymbolId, depth: targetDepth });
      }
    }

    const maxDepth = visited.size === 0 ? 0 : Math.max(...visited.values());
    downstreamByEntryPointId.set(entryPoint.entryPointId, {
      downstreamCallableCount: visited.size,
      downstreamMaxDepth: maxDepth,
    });

    for (const [symbolId, depth] of visited.entries()) {
      const record = reachableBySymbolId.get(symbolId) ?? {
        symbol: symbolById.get(symbolId) ?? null,
        reachableFrom: new Map(),
      };
      const currentDepth = record.reachableFrom.get(entryPoint.entryPointId);
      if (currentDepth === undefined || depth < currentDepth) {
        record.reachableFrom.set(entryPoint.entryPointId, depth);
      }
      reachableBySymbolId.set(symbolId, record);
    }
  }

  return {
    reachableBySymbolId,
    downstreamByEntryPointId,
  };
}

function buildsCallableInventory({
  runtimeSymbols,
  symbolById,
  cliReachabilityBySymbolId,
  inventoryReachabilityBySymbolId,
  entryPointById,
  entryPointBySymbolId,
  incomingByCalleeId,
  ambiguousIncomingByCalleeId,
  outgoingByCallerId,
}) {
  const callables = [];
  for (const symbol of runtimeSymbols) {
    const cliReachabilityRecord = cliReachabilityBySymbolId.get(symbol.symbolId) ?? null;
    const inventoryReachabilityRecord = inventoryReachabilityBySymbolId.get(symbol.symbolId) ?? null;
    const incomingEdges = incomingByCalleeId.get(symbol.symbolId) ?? [];
    const ambiguousIncomingEdges = ambiguousIncomingByCalleeId.get(symbol.symbolId) ?? [];
    const outgoingEdges = outgoingByCallerId.get(symbol.symbolId) ?? [];
    const sameModuleIncomingEdges = incomingEdges.filter((edge) => edge.modulePath === symbol.modulePath);
    const externalIncomingEdges = incomingEdges.filter((edge) => edge.modulePath !== symbol.modulePath);
    const sameModuleOutgoingEdges = outgoingEdges.filter((edge) => {
      const target = symbolById.get(edge.toSymbolId);
      return target !== undefined && target.modulePath === symbol.modulePath;
    });
    const ownEntryPoint = entryPointBySymbolId.get(symbol.symbolId) ?? null;
    const cliReachabilityDisposition = cliReachabilityRecord !== null
      ? "REACHABLE"
      : (ambiguousIncomingEdges.length > 0 ? "RUNTIME_RESOLUTION_REQUIRED" : "UNREACHABLE");
    const inventoryReachabilityDisposition = inventoryReachabilityRecord !== null
      ? "REACHABLE"
      : (ambiguousIncomingEdges.length > 0 ? "RUNTIME_RESOLUTION_REQUIRED" : "UNREACHABLE");
    const justificationDisposition = classifiesCallableJustification({
      symbol,
      ownEntryPoint,
      inventoryReachabilityDisposition,
      externalIncomingCount: externalIncomingEdges.length,
      sameModuleIncomingCount: sameModuleIncomingEdges.length,
      sameModuleOutgoingCount: sameModuleOutgoingEdges.length,
    });
    const callableDisposition = classifiesCallableDisposition({
      inventoryReachabilityDisposition,
      justificationDisposition,
      ambiguousIncomingCount: ambiguousIncomingEdges.length,
    });
    const reachableFromCliRootIds = cliReachabilityRecord === null ? [] : [...cliReachabilityRecord.reachableFrom.keys()]
      .map((rootSymbolId) => rootSymbolId)
      .sort();
    const reachableFromEntryPointIds = inventoryReachabilityRecord === null ? [] : [...inventoryReachabilityRecord.reachableFrom.keys()]
      .sort((left, right) => comparesEntryPointIds(left, right));
    const reachableFromEntryPointKinds = reachableFromEntryPointIds
      .map((entryPointId) => {
        const entryPoint = entryPointById.get(entryPointId) ?? null;
        if (entryPoint !== null) return entryPoint.primaryEntryKind;
        return null;
      })
      .filter((kind) => kind !== null);
    const cliMinDepth = cliReachabilityRecord === null ? null : Math.min(...cliReachabilityRecord.reachableFrom.values());
    const inventoryMinDepth = inventoryReachabilityRecord === null ? null : Math.min(...inventoryReachabilityRecord.reachableFrom.values());

    callables.push({
      ...summarizesSymbol(symbol),
      entryPointId: ownEntryPoint?.entryPointId ?? null,
      entryPointKinds: ownEntryPoint?.entryKinds ?? [],
      entryPointDisposition: ownEntryPoint?.justificationDisposition ?? null,
      reachableFromCliRootIds,
      cliReachabilityDisposition,
      cliMinDepth,
      inventoryReachableFromEntryPointIds: reachableFromEntryPointIds,
      reachableFromEntryPointKinds,
      inventoryReachabilityDisposition,
      inventoryMinDepth,
      justificationDisposition,
      callableDisposition,
      incomingInvocationCount: incomingEdges.length,
      resolvedIncomingInvocationCount: incomingEdges.length,
      ambiguousIncomingInvocationCount: ambiguousIncomingEdges.length,
      sameModuleIncomingInvocationCount: sameModuleIncomingEdges.length,
      externalIncomingInvocationCount: externalIncomingEdges.length,
      outgoingInvocationCount: outgoingEdges.length,
      sameModuleOutgoingInvocationCount: sameModuleOutgoingEdges.length,
    });
  }

  callables.sort(comparesCallables);
  return callables;
}

function summarizesInventory(entryPoints, callables) {
  const entryPointKindCounts = Object.create(null);
  const callableDispositionCounts = Object.create(null);
  let productEntryPointCount = 0;
  let syntheticEntryPointCount = 0;

  for (const entryPoint of entryPoints) {
    const primaryEntryKind = entryPoint.primaryEntryKind ?? "module-evaluation";
    entryPointKindCounts[primaryEntryKind] = (entryPointKindCounts[primaryEntryKind] ?? 0) + 1;
    if (entryPoint.productEntryPoint === true) productEntryPointCount++;
    if (entryPoint.synthetic === true) syntheticEntryPointCount++;
  }

  for (const disposition of ["REACHABLE", "SHARED_SUPPORT", "RUNTIME_RESOLUTION_REQUIRED", "UNREACHABLE"]) {
    callableDispositionCounts[disposition] = 0;
  }
  for (const callable of callables) {
    callableDispositionCounts[callable.callableDisposition] = (callableDispositionCounts[callable.callableDisposition] ?? 0) + 1;
  }

  return {
    entryPointCount: entryPoints.length,
    productEntryPointCount,
    syntheticEntryPointCount,
    nonProductEntryPointCount: entryPoints.length - productEntryPointCount,
    entryPointKindCounts,
    callableDispositionCounts,
    inventoryReachableCallableCount: callables.length - (callableDispositionCounts.UNREACHABLE ?? 0),
    sharedSupportCallableCount: callableDispositionCounts.SHARED_SUPPORT ?? 0,
    runtimeResolutionRequiredCallableCount: callableDispositionCounts.RUNTIME_RESOLUTION_REQUIRED ?? 0,
    unreachableCallableCount: callableDispositionCounts.UNREACHABLE ?? 0,
  };
}

function registersEntryPoint(entryPointsById, entryPointBySymbolId, entryPoint) {
  const normalizedKinds = [...new Set((Array.isArray(entryPoint.entryKinds) ? entryPoint.entryKinds : []).filter(Boolean))].sort(comparesEntryKinds);
  const existing = entryPointsById.get(entryPoint.entryPointId);
  if (existing === undefined) {
    const justificationDisposition = entryPoint.justificationDisposition ?? classifiesEntryPointJustification(normalizedKinds);
    const record = {
      entryPointId: entryPoint.entryPointId,
      symbolId: entryPoint.symbolId ?? null,
      symbolVersionId: entryPoint.symbolVersionId ?? null,
      kind: entryPoint.kind ?? (entryPoint.symbol?.kind ?? "synthetic"),
      name: entryPoint.name ?? entryPoint.symbol?.name ?? "module-evaluation",
      modulePath: normalizesModulePath(entryPoint.modulePath ?? entryPoint.symbol?.modulePath),
      sourceReferenceId: entryPoint.sourceReferenceId ?? entryPoint.symbol?.sourceReferenceId ?? null,
      declarationLine: entryPoint.entryLine ?? entryPoint.symbol?.declarationLine ?? null,
      declarationColumn: entryPoint.entryColumn ?? entryPoint.symbol?.declarationColumn ?? null,
      entryRelationshipId: entryPoint.entryRelationshipId ?? null,
      entryKinds: normalizedKinds,
      primaryEntryKind: selectsPrimaryEntryKind(normalizedKinds),
      productEntryPoint: entryPoint.productEntryPoint === true,
      synthetic: entryPoint.synthetic === true,
      justificationDisposition,
      entryPointDisposition: entryPoint.entryPointDisposition ?? justificationDisposition,
      evidenceKinds: [...new Set((entryPoint.evidenceKinds ?? []).filter(Boolean))].sort(),
      moduleScopeInvocationCount: entryPoint.moduleScopeInvocationCount ?? 0,
      outgoingInvocationCount: entryPoint.outgoingInvocationCount ?? 0,
      downstreamCallableCount: 0,
      downstreamMaxDepth: 0,
    };
    entryPointsById.set(record.entryPointId, record);
    if (record.symbolId !== null) {
      entryPointBySymbolId.set(record.symbolId, record);
    }
    return record;
  }

  const mergedKinds = [...new Set([...existing.entryKinds, ...normalizedKinds])].sort(comparesEntryKinds);
  existing.entryKinds = mergedKinds;
  existing.primaryEntryKind = selectsPrimaryEntryKind(mergedKinds);
  existing.productEntryPoint = existing.productEntryPoint || entryPoint.productEntryPoint === true;
  existing.synthetic = existing.synthetic || entryPoint.synthetic === true;
  existing.justificationDisposition = existing.justificationDisposition ?? entryPoint.justificationDisposition ?? classifiesEntryPointJustification(mergedKinds);
  existing.entryPointDisposition = existing.entryPointDisposition ?? entryPoint.entryPointDisposition ?? existing.justificationDisposition;
  existing.sourceReferenceId = existing.sourceReferenceId ?? entryPoint.sourceReferenceId ?? entryPoint.symbol?.sourceReferenceId ?? null;
  existing.declarationLine = existing.declarationLine ?? entryPoint.entryLine ?? entryPoint.symbol?.declarationLine ?? null;
  existing.declarationColumn = existing.declarationColumn ?? entryPoint.entryColumn ?? entryPoint.symbol?.declarationColumn ?? null;
  existing.entryRelationshipId = existing.entryRelationshipId ?? entryPoint.entryRelationshipId ?? null;
  existing.evidenceKinds = [...new Set([...(existing.evidenceKinds ?? []), ...((entryPoint.evidenceKinds ?? []).filter(Boolean))])].sort();
  existing.moduleScopeInvocationCount = Math.max(existing.moduleScopeInvocationCount ?? 0, entryPoint.moduleScopeInvocationCount ?? 0);
  existing.outgoingInvocationCount = Math.max(existing.outgoingInvocationCount ?? 0, entryPoint.outgoingInvocationCount ?? 0);
  if (existing.symbolId !== null) {
    entryPointBySymbolId.set(existing.symbolId, existing);
  }
  return existing;
}

function classifiesCliEntryKinds({ symbol, isDirectCliRoot, sameModuleIncomingCount, sameModuleOutgoingCount }) {
  const entryKinds = new Set([isDirectCliRoot ? "cli-command" : "cli-subcommand"]);
  if (sameModuleOutgoingCount > 0 || (!isDirectCliRoot && sameModuleIncomingCount > 0 && /^runs/u.test(symbol.name))) {
    entryKinds.add("cli-internal-dispatcher");
  }
  if (looksLikeHttpServerEntry(symbol)) {
    entryKinds.add("http-server-entry");
  }
  return [...entryKinds].sort(comparesEntryKinds);
}

function classifiesModuleEntryKinds({ symbol }) {
  const entryKinds = new Set(["module-api"]);
  if (looksLikeHttpServerEntry(symbol)) {
    entryKinds.add("http-server-entry");
  }
  return [...entryKinds].sort(comparesEntryKinds);
}

function classifiesSyntheticEntryKinds(modulePath) {
  const entryKinds = new Set(["module-evaluation"]);
  if (isProofScriptModulePath(modulePath)) {
    entryKinds.add("proof-script");
  } else if (isMigrationScriptModulePath(modulePath)) {
    entryKinds.add("migration-script");
  } else if (isScriptModulePath(modulePath)) {
    entryKinds.add("script-entry");
  }
  return [...entryKinds].sort(comparesEntryKinds);
}

function classifiesEntryPointJustification(entryKinds) {
  const kinds = new Set(entryKinds ?? []);
  if (kinds.has("proof-script")) return "TEST_ONLY";
  if (kinds.has("migration-script") || kinds.has("script-entry") || kinds.has("module-evaluation")) return "PLATFORM_PRIMITIVE";
  if (kinds.has("cli-command") || kinds.has("cli-subcommand") || kinds.has("http-server-entry")) return "FEATURE_ROOT";
  if (kinds.has("module-api") || kinds.has("cli-internal-dispatcher")) return "SHARED_SUPPORT";
  return "SHARED_SUPPORT";
}

function classifiesCallableJustification({ symbol, ownEntryPoint, inventoryReachabilityDisposition, externalIncomingCount, sameModuleIncomingCount, sameModuleOutgoingCount }) {
  if (ownEntryPoint !== null) return ownEntryPoint.justificationDisposition;
  if (inventoryReachabilityDisposition === "REACHABLE") return "SHARED_SUPPORT";
  if (externalIncomingCount > 0 || sameModuleIncomingCount > 0 || sameModuleOutgoingCount > 0) return "SHARED_SUPPORT";
  if (symbol.modulePath.startsWith("lib/")) return "SHARED_SUPPORT";
  return "PLATFORM_PRIMITIVE";
}

function classifiesCallableDisposition({ inventoryReachabilityDisposition, justificationDisposition, ambiguousIncomingCount }) {
  if (ambiguousIncomingCount > 0) return "RUNTIME_RESOLUTION_REQUIRED";
  if (justificationDisposition === "SHARED_SUPPORT") return "SHARED_SUPPORT";
  if (inventoryReachabilityDisposition === "REACHABLE") return "REACHABLE";
  return "UNREACHABLE";
}

function countsIncomingFromModulePath({ symbolId, modulePath, incomingByCalleeId, ambiguousIncomingByCalleeId, symbolById }) {
  const incomingEdges = incomingByCalleeId.get(symbolId) ?? [];
  const ambiguousEdges = ambiguousIncomingByCalleeId.get(symbolId) ?? [];
  const resolvedCount = incomingEdges.filter((edge) => edge.modulePath === modulePath).length;
  const ambiguousCount = ambiguousEdges.filter((edge) => edge.modulePath === modulePath).length;
  return resolvedCount + ambiguousCount;
}

function countsIncomingFromOtherModules({ symbol, incomingByCalleeId, ambiguousIncomingByCalleeId, symbolById }) {
  const incomingEdges = incomingByCalleeId.get(symbol.symbolId) ?? [];
  const ambiguousEdges = ambiguousIncomingByCalleeId.get(symbol.symbolId) ?? [];
  const resolvedCount = incomingEdges.filter((edge) => edge.modulePath !== symbol.modulePath).length;
  const ambiguousCount = ambiguousEdges.filter((edge) => edge.modulePath !== symbol.modulePath).length;
  return resolvedCount + ambiguousCount;
}

function countsOutgoingToModulePath({ symbolId, modulePath, outgoingByCallerId, symbolById, rootNamePattern }) {
  const outgoingEdges = outgoingByCallerId.get(symbolId) ?? [];
  return outgoingEdges.filter((edge) => {
    if (edge.resolutionDisposition !== "resolved" || edge.toSymbolId === null) return false;
    const target = symbolById.get(edge.toSymbolId);
    return target !== undefined && target.modulePath === modulePath;
  }).length;
}

function looksLikeHttpServerEntry(symbol) {
  return httpServerEntryNamePattern.test(symbol.name) && !isScriptModulePath(symbol.modulePath);
}

function isScriptModulePath(modulePath) {
  return scriptModulePathPattern.test(normalizesModulePath(modulePath));
}

function isProofScriptModulePath(modulePath) {
  return proofModulePathPattern.test(normalizesModulePath(modulePath));
}

function isMigrationScriptModulePath(modulePath) {
  return migrationModulePathPattern.test(normalizesModulePath(modulePath));
}

function selectsPrimaryEntryKind(entryKinds) {
  const kinds = [...new Set((entryKinds ?? []).filter(Boolean))];
  if (kinds.length === 0) return "module-evaluation";
  kinds.sort((left, right) => (entryKindPriority.get(left) ?? 99) - (entryKindPriority.get(right) ?? 99) || left.localeCompare(right));
  return kinds[0];
}

function comparesEntryKinds(left, right) {
  return (entryKindPriority.get(left) ?? 99) - (entryKindPriority.get(right) ?? 99)
    || left.localeCompare(right);
}

function comparesEntryPoints(left, right) {
  return (left.productEntryPoint === right.productEntryPoint ? 0 : (left.productEntryPoint ? -1 : 1))
    || (entryKindPriority.get(left.primaryEntryKind ?? "") ?? 99) - (entryKindPriority.get(right.primaryEntryKind ?? "") ?? 99)
    || left.modulePath.localeCompare(right.modulePath)
    || left.name.localeCompare(right.name)
    || left.entryPointId.localeCompare(right.entryPointId);
}

function comparesEntryPointIds(left, right) {
  return left.localeCompare(right);
}

function comparesCallables(left, right) {
  return (callableDispositionPriority.get(left.callableDisposition) ?? 99) - (callableDispositionPriority.get(right.callableDisposition) ?? 99)
    || (left.modulePath.localeCompare(right.modulePath))
    || (left.name.localeCompare(right.name))
    || (left.symbolId.localeCompare(right.symbolId));
}

function buildsRootGraph(rootEntry, outgoingByCallerId, incomingByCalleeId, symbolById) {
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
  const incomingEdges = [];
  for (const node of nodes) {
    const nodeIncomingEdges = incomingByCalleeId.get(node.symbolId) ?? [];
    incomingEdges.push(...nodeIncomingEdges);
  }
  incomingEdges.sort(comparesEdges);
  const resolvedInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "resolved").length;
  const ambiguousInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "ambiguous").length;
  const unresolvedInvocationEdgeCount = edges.filter((edge) => edge.resolutionDisposition === "unresolved").length;
  const directInvocationCount = edges.filter((edge) => edge.fromSymbolId === rootSymbol.symbolId).length;
  const maxDepth = nodes.reduce((largest, node) => Math.max(largest, node.depth), 0);

  return {
    ...rootEntry,
    nodes,
    edges,
    incomingEdges,
    depthLayers: [...depthLayersByDepth.keys()].sort((left, right) => left - right).map((depth) => depthLayersByDepth.get(depth)),
    summary: {
      reachableCallableCount: nodes.length,
      directInvocationCount,
      invocationEdgeCount: edges.length,
      resolvedInvocationEdgeCount,
      ambiguousInvocationEdgeCount,
      unresolvedInvocationEdgeCount,
      incomingEdgeCount: incomingEdges.length,
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
    isExported: symbol.isExported ?? false,
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
