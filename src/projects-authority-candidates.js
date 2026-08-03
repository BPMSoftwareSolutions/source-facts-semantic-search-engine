import path from "node:path";
import { readFileSync } from "node:fs";
import { executeRelationalQuery } from "./query.js";

/**
 * Projects authority candidate scaffolds from observed executable mechanics.
 *
 * Takes structured facts (mechanic type, source location, expressions) and
 * generates pre-shaped JSON authority candidates with unresolved decisions flagged.
 */

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

function joinsSourceLocation(modulePath, startLine, endLine) {
  if (modulePath === null || modulePath === undefined || modulePath === "") {
    return null;
  }
  if (!Number.isInteger(startLine)) {
    return String(modulePath);
  }
  if (Number.isInteger(endLine) && endLine !== startLine) {
    return `${modulePath}:${startLine}-${endLine}`;
  }
  return `${modulePath}:${startLine}`;
}

function extractsSnippetFromText(text, startLine, endLine) {
  if (typeof text !== "string" || text.length === 0) {
    return null;
  }
  if (!Number.isInteger(startLine) || startLine < 1) {
    return null;
  }
  const lines = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const firstLine = Math.max(1, startLine);
  const lastLine = Math.min(Number.isInteger(endLine) && endLine >= startLine ? endLine : startLine, lines.length);
  if (firstLine > lastLine) {
    return null;
  }
  return lines.slice(firstLine - 1, lastLine).join("\n");
}

function buildsNormalizedSourceCodeMap(sourceCodeMap = new Map()) {
  if (sourceCodeMap instanceof Map) {
    return sourceCodeMap;
  }
  const normalized = new Map();
  for (const [key, value] of Object.entries(sourceCodeMap)) {
    normalized.set(key, value);
  }
  return normalized;
}

export class AuthorityCandidateProjector {
  constructor(index, sourceCodeMap = new Map(), options = {}) {
    this.index = index ?? {};
    this.sourceCodeMap = buildsNormalizedSourceCodeMap(sourceCodeMap);
    this.workspaceRoot = options.workspaceRoot ?? this.index.manifest?.scanRequest?.workspaceRoot ?? null;
    this.sourceReferenceById = new Map((this.index.sourceReferences ?? []).map((reference) => [reference.referenceId, reference]));
    this.symbolById = new Map((this.index.symbols ?? []).map((symbol) => [symbol.symbolId, symbol]));
    this.authorityFamilyMap = this.buildAuthorityFamilyMap();
  }

  /**
   * Authority family mapping: mechanic type → target authority types
   */
  buildAuthorityFamilyMap() {
    return {
      branch: {
        families: ['decision', 'classification', 'result-selection'],
        primaryFamily: 'decision',
        dimensions: [
          'condition/predicate',
          'outcomes (all branches)',
          'no-match behavior',
          'result semantics per outcome'
        ]
      },
      iteration: {
        families: ['iteration', 'execution-model', 'aggregation'],
        primaryFamily: 'iteration',
        dimensions: [
          'collection source',
          'iteration order',
          'per-item processing',
          'aggregation/collection',
          'stopping conditions'
        ]
      },
      'exception-handling': {
        families: ['failure-observation', 'failure-policy'],
        primaryFamily: 'failure-policy',
        dimensions: ['caught error types', 'classification', 'post-catch behavior']
      },
      throw: {
        families: ['failure-disposition', 'result-union'],
        primaryFamily: 'failure-disposition',
        dimensions: ['error identity', 'precondition', 'canonical vs fallback']
      },
      'object-construction': {
        families: ['projection-mapping', 'result-contract'],
        primaryFamily: 'projection-mapping',
        dimensions: [
          'every output field',
          'source of each field',
          'omitted-field policy',
          'field ordering semantics'
        ]
      },
      serialization: {
        families: ['serialization-profile'],
        primaryFamily: 'serialization-profile',
        dimensions: [
          'encoding',
          'canonicalization',
          'newline policy',
          'escape handling',
          'determinism'
        ]
      },
      normalization: {
        families: ['translation', 'classification', 'projection'],
        primaryFamily: 'translation',
        dimensions: ['source variants', 'canonical form', 'lossiness', 'classification']
      },
      validation: {
        families: ['schema-binding', 'validation-policy', 'failure-disposition'],
        primaryFamily: 'validation-policy',
        dimensions: ['validated contract', 'success path', 'failure path']
      },
      fallback: {
        families: ['decision', 'missing-value-policy'],
        primaryFamily: 'missing-value-policy',
        dimensions: ['missing/null detection', 'fallback value', 'canonical vs emergency']
      },
      retry: {
        families: ['continuation-policy', 'iteration', 'failure-policy'],
        primaryFamily: 'continuation-policy',
        dimensions: ['retry trigger', 'limits/backoff', 'progress', 'stop conditions']
      },
      'state-mutation': {
        families: ['state-transition', 'effect', 'proof-requirement'],
        primaryFamily: 'state-transition',
        dimensions: ['mutated state', 'preconditions', 'proof', 'idempotency']
      },
      'meaning-hidden-in-text': {
        families: ['concept', 'fact', 'taxonomy', 'policy', 'identifier'],
        primaryFamily: 'concept',
        dimensions: ['hidden concept', 'location', 'elevation to declaration']
      }
    };
  }

  /**
   * Project all mechanics for a given responsibility/function
   */
  async projectMechanics(filter = {}) {
    const { modulePath = "", responsibilityId = "" } = filter;
    const mechanics = await this.collectMechanics({ modulePath, responsibilityId });
    const grouped = this.groupByMechanicType(mechanics);

    const candidates = [];
    for (const [mechanicType, occurrences] of Object.entries(grouped)) {
      for (const mechanic of occurrences) {
        candidates.push(this.projectCandidate(mechanic, mechanicType, responsibilityId));
      }
    }

    const sourceFiles = [...new Set(mechanics.map((mechanic) => mechanic.modulePath).filter(Boolean))].sort();
    return {
      sourceFile: modulePath || sourceFiles[0] || null,
      sourceFiles,
      responsibility: responsibilityId || null,
      workspaceRoot: this.workspaceRoot,
      generatedAtUtc: new Date().toISOString(),
      observedMechanicsCount: mechanics.length,
      candidates,
      authorityDraft: this.buildAuthorityDraft(candidates, { modulePath, responsibilityId, sourceFiles }),
      coverageSummary: this.summarizeCoverage(candidates)
    };
  }

  /**
   * Query mechanics from index matching filter
   */
  async collectMechanics(filter = {}) {
    const viaQuery = await this.collectMechanicsViaQuery(filter);
    if (Array.isArray(viaQuery) && viaQuery.length > 0) {
      return this.deduplicateMechanics(viaQuery.map((mechanic) => this.enrichMechanic(mechanic)));
    }

    const mechanics = this.index.bodyMechanics || [];
    return this.deduplicateMechanics(
      mechanics
        .filter((mechanic) => this.matchesFilter(mechanic, filter))
        .map((mechanic) => this.enrichMechanic(mechanic))
    );
  }

  async collectMechanicsViaQuery(filter = {}) {
    if (!Array.isArray(this.index.bodyMechanics) || this.index.bodyMechanics.length === 0) {
      return null;
    }

    const where = [];
    if (typeof filter.modulePath === "string" && filter.modulePath.length > 0) {
      where.push(`bm.modulePath = ${this.quoteSqlLiteral(normalizesPathKey(filter.modulePath))}`);
    }
    if (typeof filter.responsibilityId === "string" && filter.responsibilityId.length > 0) {
      const responsibility = this.quoteSqlLiteral(filter.responsibilityId);
      where.push(`(sym.name = ${responsibility} OR sym.symbolId = ${responsibility} OR bm.fromSymbolId = ${responsibility})`);
    }

    const commandText = [
      "SELECT bm.mechanic AS mechanic,",
      "       bm.modulePath AS modulePath,",
      "       bm.sourceReferenceId AS sourceReferenceId,",
      "       bm.fromSymbolId AS fromSymbolId,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       sr.startColumn AS startColumn,",
      "       sr.endColumn AS endColumn,",
      "       sym.name AS symbolName,",
      "       bm.evidenceKind AS evidenceKind,",
      "       bm.classification AS classification,",
      "       bm.verificationDisposition AS verificationDisposition",
      "FROM bodyMechanics bm",
      "JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId",
      "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId",
      where.length > 0 ? `WHERE ${where.join(" AND ")}` : null,
      "ORDER BY bm.modulePath, sr.startLine, sr.endLine, bm.mechanic",
    ].filter((line) => line !== null).join(" ");

    try {
      const receipt = await executeRelationalQuery(this.index, commandText);
      if (receipt?.disposition !== "RELATIONAL_QUERY_EXECUTED") {
        return null;
      }
      return receipt.result?.value?.rows ?? [];
    } catch {
      return null;
    }
  }

  matchesFilter(mechanic, filter = {}) {
    if (typeof filter.modulePath === "string" && filter.modulePath.length > 0) {
      const mechanicPath = normalizesPathKey(mechanic.modulePath);
      const filterPath = normalizesPathKey(filter.modulePath);
      if (mechanicPath !== filterPath && !mechanicPath.endsWith(`/${filterPath}`) && !mechanicPath.endsWith(filterPath)) {
        return false;
      }
    }

    if (typeof filter.responsibilityId === "string" && filter.responsibilityId.length > 0) {
      const symbolName = this.resolvesMechanicSymbol(mechanic);
      const symbolId = mechanic.fromSymbolId ?? mechanic.responsibilityId ?? null;
      if (symbolName !== filter.responsibilityId && symbolId !== filter.responsibilityId) {
        return false;
      }
    }

    return true;
  }

  /**
   * Remove duplicate mechanics (same source location + mechanic type)
   */
  deduplicateMechanics(mechanics) {
    const seen = new Map();
    const deduplicated = [];

    for (const mechanic of mechanics) {
      const key = `${normalizesPathKey(mechanic.modulePath)}:${mechanic.sourceReferenceId ?? mechanic.startLine ?? ""}:${mechanic.mechanic}`;
      if (!seen.has(key)) {
        deduplicated.push(mechanic);
        seen.set(key, true);
      }
    }

    return deduplicated;
  }

  /**
   * Group mechanics by type
   */
  groupByMechanicType(mechanics) {
    const grouped = {};
    for (const mechanic of mechanics) {
      const type = mechanic.mechanic;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(mechanic);
    }
    return grouped;
  }

  /**
   * Project a candidate for a single mechanic occurrence
   */
  projectCandidate(mechanic, mechanicType, responsibilityId) {
    const family = this.authorityFamilyMap[mechanicType];
    if (!family) {
      throw new Error(`Unknown mechanic type: ${mechanicType}`);
    }

    // Dispatch to type-specific projector
    switch (mechanicType) {
      case 'branch':
        return this.projectDecisionCandidate(mechanic, responsibilityId);
      case 'throw':
        return this.projectFailureDispositionCandidate(mechanic, responsibilityId);
      case 'object-construction':
        return this.projectProjectionMappingCandidate(mechanic, responsibilityId);
      case 'serialization':
        return this.projectSerializationProfileCandidate(mechanic, responsibilityId);
      case 'validation':
        return this.projectValidationPolicyCandidate(mechanic, responsibilityId);
      case 'iteration':
        return this.projectIterationAuthorityCandidate(mechanic, responsibilityId);
      case 'state-mutation':
        return this.projectStateTransitionCandidate(mechanic, responsibilityId);
      case 'exception-handling':
        return this.projectFailureObservationCandidate(mechanic, responsibilityId);
      case 'fallback':
        return this.projectFallbackPolicyCandidate(mechanic, responsibilityId);
      case 'normalization':
        return this.projectNormalizationCandidate(mechanic, responsibilityId);
      default:
        return this.projectGenericCandidate(mechanic, mechanicType, responsibilityId);
    }
  }

  resolvesMechanicSymbol(mechanic) {
    const sourceReference = this.findSourceReference(mechanic);
    const symbol = this.symbolById.get(mechanic.fromSymbolId ?? "") ?? null;
    return (
      mechanic.enclosingSymbol
      ?? mechanic.symbolName
      ?? symbol?.name
      ?? symbol?.symbolName
      ?? sourceReference?.symbolName
      ?? mechanic.responsibilityId
      ?? null
    );
  }

  resolvesMechanicResponsibilityId(mechanic) {
    return this.resolvesMechanicSymbol(mechanic) ?? mechanic.modulePath ?? mechanic.mechanicId ?? "UNRESOLVED";
  }

  resolvesMechanicSourceReferenceId(mechanic) {
    return mechanic.sourceReferenceId ?? mechanic.sourceReference?.referenceId ?? null;
  }

  resolvesSourceTextForMechanic(mechanic) {
    const sourceReference = this.findSourceReference(mechanic);
    const candidateKeys = [
      this.resolvesMechanicSourceReferenceId(mechanic),
      sourceReference?.referenceId,
      mechanic.modulePath,
      sourceReference?.modulePath,
    ].filter((key) => typeof key === "string" && key.length > 0);

    for (const key of candidateKeys) {
      const direct = this.sourceCodeMap.get(key);
      if (typeof direct === "string" && direct.length > 0) {
        return direct;
      }
    }

    const modulePath = sourceReference?.modulePath ?? mechanic.modulePath;
    if (typeof this.workspaceRoot === "string" && this.workspaceRoot.length > 0 && typeof modulePath === "string" && modulePath.length > 0) {
      const resolvedPath = path.resolve(this.workspaceRoot, modulePath);
      try {
        const sourceText = readFileSync(resolvedPath, "utf8");
        this.sourceCodeMap.set(resolvedPath, sourceText);
        this.sourceCodeMap.set(modulePath, sourceText);
        return sourceText;
      } catch {
        return null;
      }
    }

    return null;
  }

  enrichMechanic(mechanic) {
    const sourceReference = this.findSourceReference(mechanic);
    const symbolName = this.resolvesMechanicSymbol(mechanic);
    const startLine = sourceReference?.startLine ?? mechanic.startLine ?? null;
    const endLine = sourceReference?.endLine ?? mechanic.endLine ?? startLine;
    return Object.freeze({
      ...mechanic,
      modulePath: normalizesPathKey(mechanic.modulePath),
      sourceReferenceId: this.resolvesMechanicSourceReferenceId(mechanic) ?? sourceReference?.referenceId ?? null,
      startLine,
      endLine,
      startColumn: sourceReference?.startColumn ?? mechanic.startColumn ?? null,
      endColumn: sourceReference?.endColumn ?? mechanic.endColumn ?? null,
      enclosingSymbol: symbolName,
      symbolName,
      sourceLocation: joinsSourceLocation(normalizesPathKey(mechanic.modulePath), startLine, endLine),
      sourceSnippet: this.extractSourceSnippet({
        ...mechanic,
        sourceReferenceId: this.resolvesMechanicSourceReferenceId(mechanic) ?? sourceReference?.referenceId ?? null,
        startLine,
        endLine,
      }),
    });
  }

  quoteSqlLiteral(value) {
    return `'${String(value).replaceAll("'", "''")}'`;
  }

  /**
   * Project decision authority candidate from branch mechanic
   */
  projectDecisionCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'decision-authority-candidate.v1',
      candidateId: this.generateCandidateId(`resolve-${symbolName}`),
      responsibility: {
        responsibilityId: symbolName,
        description: `Decision point in ${symbolName}`
      },
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'branch',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        startColumn: sourceRef?.startColumn ?? mechanic.startColumn ?? null,
        endColumn: sourceRef?.endColumn ?? mechanic.endColumn ?? null,
        sourceSnippet: snippet || '<source snippet unavailable>'
      },
      inputs: this.extractBranchInputs(mechanic, snippet),
      candidateOutcomes: this.extractBranchOutcomes(mechanic, snippet),
      nomatchBehavior: this.inferNomatchBehavior(snippet),
      semanticCompleteness: {
        allConditionsIdentified: false,
        allOutcomesIdentified: false,
        resultTypesClarified: false,
        priorityOrdering: 'unspecified'
      },
      requiredHumanResolution: [
        'confirm condition is complete and accurate',
        'confirm all outcomes are identified',
        'confirm no-match behavior',
        'confirm result type per outcome',
        'confirm decision priority/precedence'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project failure disposition candidate from throw mechanic
   */
  projectFailureDispositionCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'failure-disposition-authority-candidate.v1',
      candidateId: this.generateCandidateId(`failure-${symbolName}-${this.extractErrorType(snippet)}`),
      responsibility: {
        responsibilityId: symbolName
      },
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'throw',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'throw <error>'
      },
      failureIdentity: {
        errorType: this.extractErrorType(snippet) || 'Error',
        errorCode: this.extractErrorCode(snippet),
        errorMessage: this.extractErrorMessage(snippet),
        canonicalFailureId: this.generateCandidateId(`failure-${this.extractErrorType(snippet)}`)
      },
      precondition: {
        description: 'Condition that triggers this throw',
        observedCondition: '<inferred from context>',
        requiredHumanResolution: [
          'identify exact precondition that triggers this throw',
          'confirm whether this is canonical vs error-handling throw'
        ]
      },
      resultUnion: {
        successPath: '<infer from function return type>',
        failurePath: this.extractErrorType(snippet) || 'Error',
        description: 'This function returns success OR this failure type'
      },
      requiredHumanResolution: [
        'confirm failure identity (type, code, message)',
        'confirm precondition',
        'confirm whether canonical behavior or fallback',
        'confirm error classification'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project projection mapping candidate from object-construction mechanic
   */
  projectProjectionMappingCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'projection-mapping-candidate.v1',
      projectionMappingId: this.generateCandidateId(`project-${symbolName}-result`),
      responsibility: {
        responsibilityId: symbolName
      },
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'object-construction',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'return { ... }'
      },
      resultContract: {
        contractId: `${symbolName}-result`,
        description: 'Result object constructed by this function'
      },
      fields: this.extractObjectFields(snippet),
      omittedFieldPolicy: {
        description: 'Fields from input that are NOT included in output',
        omittedFields: [],
        requiredHumanResolution: [
          'identify which input fields are omitted',
          'confirm omission is intentional',
          'confirm no data loss'
        ]
      },
      requiredHumanResolution: [
        'confirm result contract identity',
        'confirm all field mappings are correct',
        'confirm transformation functions',
        'confirm field ordering semantics',
        'confirm omitted-field policy'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project serialization profile candidate
   */
  projectSerializationProfileCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'serialization-profile-candidate.v1',
      serializationProfileId: this.generateCandidateId(`serialize-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'serialization',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'JSON.stringify(...)'
      },
      encoding: {
        format: this.inferSerializationFormat(snippet),
        charset: 'utf-8',
        determinism: {
          required: true,
          description: 'Same input must always produce same bytes',
          observedStrategy: 'unknown'
        }
      },
      canonicalization: {
        fieldOrdering: {
          strategy: 'unknown',
          requiredHumanResolution: ['confirm field order strategy']
        },
        whitespace: {
          strategy: 'unknown',
          requiredHumanResolution: ['confirm whitespace handling']
        },
        escaping: {
          strategy: 'unknown',
          requiredHumanResolution: ['confirm escape strategy']
        }
      },
      resultContractId: `${symbolName}-serialized`,
      requiredHumanResolution: [
        'confirm encoding format',
        'confirm canonicalization strategy',
        'confirm determinism requirement',
        'confirm whether hash-sensitive'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project validation policy candidate
   */
  projectValidationPolicyCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'validation-policy-candidate.v1',
      validationPolicyId: this.generateCandidateId(`validate-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'validation',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || '<validation check>'
      },
      validatedContract: {
        contractId: '<contract being validated>',
        schemaPath: '<path-to-schema>',
        validator: '<ajv|joi|custom>'
      },
      successPath: {
        behavior: 'continue',
        resultType: '<type-after-success>'
      },
      failurePath: {
        behavior: 'throw',
        errorIdentity: '<error-type>',
        requiredHumanResolution: [
          'confirm error handling strategy',
          'confirm error type and message'
        ]
      },
      requiredHumanResolution: [
        'identify validated contract',
        'confirm success path behavior',
        'confirm failure path behavior',
        'confirm error classification'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project iteration authority candidate
   */
  projectIterationAuthorityCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'iteration-authority-candidate.v1',
      iterationId: this.generateCandidateId(`iterate-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'iteration',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'for (...) { ... }'
      },
      sourceCollectionExpression: '<collection>',
      itemIdentity: '<item-variable>',
      orderCandidate: 'source-order',
      forEach: {
        observedInvocation: '<function-called>',
        inputExpression: '<item-expression>'
      },
      collect: {
        target: '<collection-variable>',
        operation: 'append'
      },
      stopWhen: {
        observedExpression: '<stop-condition>',
        candidateDisposition: '<stop-on-condition>'
      },
      requiredHumanResolution: [
        'identify collection source',
        'confirm iteration order is semantically significant',
        'confirm per-item processing',
        'confirm collection/aggregation behavior',
        'confirm stopping conditions'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project state transition candidate
   */
  projectStateTransitionCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'state-transition-authority-candidate.v1',
      stateTransitionId: this.generateCandidateId(`transition-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'state-mutation',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || '<mutation>'
      },
      mutatedState: {
        stateIdentity: '<variable-or-object>',
        currentValueType: '<type>',
        description: 'What state is being modified'
      },
      preconditions: {
        description: 'Conditions that must be true for this mutation',
        requirements: [],
        requiredHumanResolution: [
          'identify all preconditions',
          'confirm mutation safety',
          'confirm idempotency'
        ]
      },
      proof: {
        proofRequirement: 'Demonstrate this mutation is safe under concurrency',
        idempotent: 'unknown',
        commutative: 'unknown',
        requiredHumanResolution: [
          'confirm idempotency guarantee',
          'confirm commutativity guarantee',
          'confirm no deadlock risk'
        ]
      },
      requiredHumanResolution: [
        'identify mutated state',
        'confirm preconditions',
        'prove safety',
        'confirm idempotency',
        'confirm no side effects beyond declared state'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project failure observation candidate
   */
  projectFailureObservationCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'failure-observation-candidate.v1',
      failureObservationId: this.generateCandidateId(`observe-failure-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'exception-handling',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'try { ... } catch { ... }'
      },
      caughtErrors: {
        errorTypes: ['<error-type>'],
        description: 'Which error types are observed here'
      },
      observationOnly: {
        description: 'Does catch only observe, or also transform/rethrow?',
        requiredHumanResolution: [
          'confirm catch block observes only vs transforms',
          'confirm error classification'
        ]
      },
      postCatchBehavior: {
        behavior: '<continue|rethrow|transform>',
        nextDisposition: '<what-happens-after>'
      },
      requiredHumanResolution: [
        'identify caught error types',
        'confirm observe-only vs transform behavior',
        'confirm error classification authority',
        'confirm post-catch disposition'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project fallback policy candidate
   */
  projectFallbackPolicyCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'fallback-policy-candidate.v1',
      fallbackPolicyId: this.generateCandidateId(`fallback-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'fallback',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || 'value ?? default'
      },
      missingValueDetection: {
        condition: '<null|undefined|falsy>',
        observedExpression: '<expression>',
        requiredHumanResolution: ['confirm missing-value condition']
      },
      fallbackValue: {
        expression: '<fallback-expression>',
        type: '<fallback-type>',
        requiredHumanResolution: ['confirm fallback value is correct']
      },
      fallbackNature: {
        isCanonical: false,
        isEmergency: true,
        description: 'Is this a normal default or emergency fallback?'
      },
      requiredHumanResolution: [
        'confirm missing-value detection',
        'confirm fallback value',
        'confirm whether fallback is canonical or emergency',
        'confirm no data loss'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Project normalization candidate
   */
  projectNormalizationCandidate(mechanic, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'normalization-authority-candidate.v1',
      normalizationId: this.generateCandidateId(`normalize-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: 'normalization',
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        sourceSnippet: snippet || '<transformation>'
      },
      sourceVariants: {
        description: 'What forms can input take?',
        variants: ['<variant1>', '<variant2>'],
        requiredHumanResolution: ['identify all source variants']
      },
      canonicalTarget: {
        description: 'What is the single canonical form?',
        form: '<canonical-representation>',
        requiredHumanResolution: ['confirm canonical form']
      },
      lossiness: {
        isLossy: false,
        description: 'Does transformation lose information?',
        requiredHumanResolution: ['confirm lossiness']
      },
      classification: {
        applied: '<classification>',
        requiredHumanResolution: ['confirm classification applied']
      },
      requiredHumanResolution: [
        'identify all source variants',
        'confirm canonical target',
        'confirm lossiness',
        'confirm classification'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  /**
   * Generic candidate for unknown mechanic types
   */
  projectGenericCandidate(mechanic, mechanicType, responsibilityId) {
    const symbolName = this.resolvesMechanicSymbol(mechanic) ?? this.resolvesMechanicResponsibilityId(mechanic);
    const sourceRef = this.findSourceReference(mechanic);
    const snippet = this.extractSourceSnippet(mechanic);

    return {
      authorityCandidateType: 'generic-authority-candidate.v1',
      candidateId: this.generateCandidateId(`candidate-${mechanicType}-${symbolName}`),
      source: {
        modulePath: mechanic.modulePath,
        sourceReferenceId: sourceRef?.referenceId ?? mechanic.sourceReferenceId ?? null,
        enclosingSymbol: symbolName,
        mechanic: mechanicType,
        startLine: sourceRef?.startLine ?? mechanic.startLine ?? null,
        endLine: sourceRef?.endLine ?? mechanic.endLine ?? sourceRef?.startLine ?? mechanic.startLine ?? null,
        startColumn: sourceRef?.startColumn ?? mechanic.startColumn ?? null,
        endColumn: sourceRef?.endColumn ?? mechanic.endColumn ?? null,
        sourceSnippet: snippet || '<source snippet unavailable>'
      },
      requiredHumanResolution: [
        `Identify authority family for ${mechanicType} mechanic`,
        'Manually project appropriate JSON structure',
        'Identify unresolved semantic decisions'
      ],
      status: 'AUTHORITY_CANDIDATE_PROJECTED',
      coverageDisposition: 'SEMANTIC_DECISION_REQUIRED'
    };
  }

  // Helper methods

  findSourceReference(mechanic) {
    const sourceReferenceId = this.resolvesMechanicSourceReferenceId(mechanic);
    if (!sourceReferenceId) {
      return null;
    }
    return this.sourceReferenceById.get(sourceReferenceId) ?? null;
  }

  extractSourceSnippet(mechanic) {
    const sourceReference = this.findSourceReference(mechanic);
    const sourceReferenceId = sourceReference?.referenceId ?? this.resolvesMechanicSourceReferenceId(mechanic);
    const modulePath = normalizesPathKey(sourceReference?.modulePath ?? mechanic.modulePath);
    const startLine = sourceReference?.startLine ?? mechanic.startLine ?? null;
    const endLine = sourceReference?.endLine ?? mechanic.endLine ?? startLine;

    const candidateKeys = [
      sourceReferenceId,
      modulePath,
      sourceReference?.modulePath,
      path.resolve(this.workspaceRoot ?? "", modulePath || ""),
    ].filter((key) => typeof key === "string" && key.length > 0);

    for (const key of candidateKeys) {
      const sourceText = this.sourceCodeMap.get(key);
      if (typeof sourceText === "string" && sourceText.length > 0) {
        return extractsSnippetFromText(sourceText, startLine, endLine) ?? sourceText;
      }
    }

    const sourceText = this.resolvesSourceTextForMechanic(mechanic);
    if (typeof sourceText === "string" && sourceText.length > 0) {
      return extractsSnippetFromText(sourceText, startLine, endLine) ?? sourceText;
    }

    return null;
  }

  buildAuthorityDraft(candidates, context = {}) {
    const mechanics = candidates.map((candidate) => this.buildAuthorityMechanicDraft(candidate));
    const sourceFiles = [...new Set(mechanics.map((mechanic) => mechanic.sourceLocation?.split(":")[0]).filter(Boolean))].sort();
    return Object.freeze({
      schemaVersion: "authority-declaration.draft.v1",
      sourceFile: context.modulePath || sourceFiles[0] || null,
      sourceFiles: context.sourceFiles ?? sourceFiles,
      responsibility: context.responsibilityId || null,
      generatedAtUtc: new Date().toISOString(),
      purpose: "Draft authority declarations projected from observed mechanics",
      authority: Object.freeze({
        mechanics: Object.freeze(mechanics),
      }),
    });
  }

  buildAuthorityMechanicDraft(candidate) {
    const semantic = {};
    for (const [key, value] of Object.entries(candidate)) {
      if (key === "authorityCandidateType" || key === "candidateId" || key === "responsibility" || key === "source" || key === "requiredHumanResolution" || key === "status" || key === "coverageDisposition") {
        continue;
      }
      semantic[key] = value;
    }

    return Object.freeze({
      mechanicId: candidate.candidateId,
      sourceLocation: joinsSourceLocation(
        candidate.source?.modulePath ?? null,
        candidate.source?.startLine ?? null,
        candidate.source?.endLine ?? candidate.source?.startLine ?? null,
      ),
      mechanic: candidate.source?.mechanic ?? null,
      authorityCandidateType: candidate.authorityCandidateType,
      responsibility: candidate.responsibility?.responsibilityId ?? null,
      semantic: Object.freeze(semantic),
      decisions: Object.freeze({
        requiredHumanResolution: Object.freeze([...(candidate.requiredHumanResolution ?? [])]),
        status: candidate.status,
        coverageDisposition: candidate.coverageDisposition,
      }),
      coverage: candidate.status === "AUTHORITY_BOUND" ? "AUTHORITY_BOUND" : "AUTHORITY_CANDIDATE_PROJECTED",
      notes: candidate.source?.sourceSnippet ? ["Source snippet projected"] : ["Source snippet unavailable"],
    });
  }

  extractBranchInputs(mechanic, snippet) {
    // Would need AST parsing to extract conditions accurately
    return [
      {
        inputId: 'condition',
        candidatePath: '<condition-path>',
        observedType: 'unknown',
        observedComparison: 'unknown',
        observedValue: '<condition-value>',
        requiredHumanResolution: [
          'extract condition from source',
          'confirm input type',
          'confirm comparison operator'
        ]
      }
    ];
  }

  extractBranchOutcomes(mechanic, snippet) {
    // Would need AST parsing to extract all branches
    return [
      {
        outcomeId: 'outcome-true',
        description: 'Truthy branch',
        observedEffect: '<effect>',
        resultExpression: '<result>',
        requiredHumanResolution: ['extract true branch outcome']
      },
      {
        outcomeId: 'outcome-false',
        description: 'Falsy branch',
        observedEffect: '<effect>',
        resultExpression: '<result>',
        requiredHumanResolution: ['extract false branch outcome']
      }
    ];
  }

  inferNomatchBehavior(snippet) {
    return {
      description: 'Behavior when no condition matches',
      observedBehavior: 'unknown',
      requiredHumanResolution: ['confirm no-match handling']
    };
  }

  extractErrorType(snippet) {
    // Simple regex extraction; AST parsing would be more accurate
    const match = snippet?.match(/(?:new\s+)?(\w+Error)/);
    return match ? match[1] : 'Error';
  }

  extractErrorCode(snippet) {
    const match = snippet?.match(/["']([A-Z_]+)["']/);
    return match ? match[1] : null;
  }

  extractErrorMessage(snippet) {
    const match = snippet?.match(/["']([^"']+)["']/);
    return match ? match[1] : null;
  }

  extractObjectFields(snippet) {
    // Would need AST parsing to extract fields accurately
    return [
      {
        outputPath: ['field'],
        sourceExpression: '<source>',
        sourceType: 'unknown',
        transformationRequired: false,
        requiredHumanResolution: ['extract field mapping from source']
      }
    ];
  }

  inferSerializationFormat(snippet) {
    if (snippet?.includes('JSON.stringify')) return 'json';
    if (snippet?.includes('Buffer') || snippet?.includes('encode')) return 'utf8';
    return 'unknown';
  }

  generateCandidateId(base) {
    // Convert to kebab-case
    return base
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .substring(0, 60);
  }

  /**
   * Summarize coverage across all candidates
   */
  summarizeCoverage(candidates) {
    const total = candidates.length;
    const fullyAuthorized = candidates.filter(
      c => c.status === 'AUTHORITY_BOUND'
    ).length;
    const partiallyCovered = candidates.filter(
      c => c.coverageDisposition === 'PARTIALLY_COVERED'
    ).length;
    const unresolved = candidates.filter(
      c => c.coverageDisposition === 'SEMANTIC_DECISION_REQUIRED' || c.status === 'AUTHORITY_CANDIDATE_PROJECTED' || c.status === 'CANDIDATE_PROJECTED'
    ).length;

    return {
      totalMechanics: total,
      fullyAuthorized,
      partiallyCovered,
      unresolved,
      authorityConformanceRatio: total > 0 ? fullyAuthorized / total : 0,
      admissionGateStatus: fullyAuthorized === total ? 'READY_FOR_REPLACEMENT' : 'NOT_READY'
    };
  }
}

/**
 * Main entry point
 */
export async function projectsAuthorityFromMechanics(
  index,
  sourceCodeMap = new Map(),
  options = {}
) {
  const projector = new AuthorityCandidateProjector(index, sourceCodeMap, options);

  const { modulePath = '', responsibilityId = '' } = options;

  return projector.projectMechanics({
    modulePath,
    responsibilityId
  });
}
