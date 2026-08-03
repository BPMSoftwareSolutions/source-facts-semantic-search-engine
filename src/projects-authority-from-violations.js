import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { AuthorityCandidateProjector } from "./projects-authority-candidates.js";

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

function parseViolationLocation(sourceLocation) {
  if (typeof sourceLocation !== "string" || sourceLocation.length === 0) {
    return {};
  }
  const [firstLocation] = sourceLocation.split(",");
  const match = firstLocation.trim().match(/^(.*?):(\d+)(?:-(\d+))?$/);
  if (!match) {
    return {};
  }
  return {
    modulePath: normalizesPathKey(match[1]),
    startLine: Number.parseInt(match[2], 10),
    endLine: Number.parseInt(match[3] ?? match[2], 10),
  };
}

function parsesAuthoritySourceLocations(sourceLocation) {
  if (typeof sourceLocation !== "string" || sourceLocation.length === 0) {
    return [];
  }
  return sourceLocation
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?):(\d+)(?:-(\d+))?$/);
      if (!match) {
        return null;
      }
      return {
        modulePath: normalizesPathKey(match[1]),
        startLine: Number.parseInt(match[2], 10),
        endLine: Number.parseInt(match[3] ?? match[2], 10),
      };
    })
    .filter((value) => value !== null);
}

function sourceLocationsOverlap(left, right) {
  if (left.modulePath !== right.modulePath) {
    return false;
  }
  return left.startLine <= right.endLine && right.startLine <= left.endLine;
}

function resolvesDefaultWorkspaceRoot(codeFile, workspaceRoot) {
  if (typeof workspaceRoot === "string" && workspaceRoot.length > 0) {
    return path.resolve(workspaceRoot);
  }
  return path.dirname(path.resolve(codeFile));
}

function resolvesRelativeModulePath(workspaceRoot, modulePath, fallbackCodeFile) {
  if (typeof modulePath === "string" && modulePath.length > 0) {
    if (path.isAbsolute(modulePath)) {
      return normalizesPathKey(path.relative(workspaceRoot, modulePath));
    }
    return normalizesPathKey(modulePath);
  }
  return normalizesPathKey(path.relative(workspaceRoot, path.resolve(fallbackCodeFile)));
}

function buildsSourceCodeMap({ codeFile, workspaceRoot, violations }) {
  const sourceCodeMap = new Map();
  const loadedFiles = new Set();
  const resolvedCodeFile = path.resolve(codeFile);
  const primaryFiles = [resolvedCodeFile];

  for (const violation of violations) {
    if (typeof violation.modulePath !== "string" || violation.modulePath.length === 0) {
      continue;
    }
    const moduleFile = path.isAbsolute(violation.modulePath)
      ? violation.modulePath
      : path.resolve(workspaceRoot, violation.modulePath);
    primaryFiles.push(moduleFile);
  }

  for (const filePath of primaryFiles) {
    const resolvedFilePath = path.resolve(filePath);
    if (loadedFiles.has(resolvedFilePath)) {
      continue;
    }
    try {
      const sourceText = readFileSync(resolvedFilePath, "utf8");
      loadedFiles.add(resolvedFilePath);
      sourceCodeMap.set(resolvedFilePath, sourceText);
      sourceCodeMap.set(normalizesPathKey(resolvedFilePath), sourceText);
      sourceCodeMap.set(path.basename(resolvedFilePath), sourceText);
      const relativeToWorkspace = normalizesPathKey(path.relative(workspaceRoot, resolvedFilePath));
      if (relativeToWorkspace.length > 0) {
        sourceCodeMap.set(relativeToWorkspace, sourceText);
      }
      sourceCodeMap.set(normalizesPathKey(path.relative(process.cwd(), resolvedFilePath)), sourceText);
    } catch {
      // Best effort only; candidates can still be projected without snippets.
    }
  }

  return sourceCodeMap;
}

function loadsAuthorityMechanics(authorityFile) {
  try {
    const parsed = JSON.parse(readFileSync(authorityFile, "utf8"));
    return parsed.authority?.mechanics ?? parsed.mechanics ?? [];
  } catch {
    return [];
  }
}

function suggestsAuthorityMechanicId(violation, authorityMechanics) {
  const mechanicType = violation.mechanicType ?? violation.mechanic ?? null;

  if (typeof violation.authorityMechanicId === "string" && violation.authorityMechanicId.length > 0) {
    return violation.authorityMechanicId;
  }

  if (!Array.isArray(authorityMechanics) || authorityMechanics.length === 0) {
    return null;
  }

  const exactMatch = authorityMechanics.find((mechanic) => {
    if (mechanic.mechanic !== mechanicType) {
      return false;
    }
    const authorityLocations = parsesAuthoritySourceLocations(mechanic.sourceLocation);
    return authorityLocations.some((authorityLocation) => sourceLocationsOverlap(authorityLocation, violation));
  });
  if (exactMatch) {
    return exactMatch.mechanicId;
  }

  const sameMechanicType = authorityMechanics.find((mechanic) => mechanic.mechanic === mechanicType);
  return sameMechanicType?.mechanicId ?? null;
}

function buildsBindingSuggestion(violation, authorityMechanicId) {
  return Object.freeze({
    violationId: violation.violationId,
    mechanicType: violation.mechanicType,
    sourceLocation: violation.sourceLocation,
    authorityMechanicId,
    status: authorityMechanicId ? "VIOLATION_MAPS_TO_AUTHORITY" : "VIOLATION_REQUIRES_AUTHORITY",
    reason: authorityMechanicId
      ? `Violation maps to authority mechanic ${authorityMechanicId}`
      : `No authority mechanic was matched for ${violation.mechanicType}`,
  });
}

function buildsCoverageSummary(violations, candidates, bindingSuggestions, authorityMechanics) {
  const mappedViolations = bindingSuggestions.filter((suggestion) => suggestion.authorityMechanicId !== null).length;
  const projectedMechanics = candidates.length;
  const candidateTypes = [...new Set(candidates.map((candidate) => candidate.authorityCandidateType))].sort();
  return {
    totalViolations: violations.length,
    candidatesProjected: projectedMechanics,
    violationsMappedToAuthority: mappedViolations,
    authorityMechanicsCovered: [...new Set(bindingSuggestions.map((suggestion) => suggestion.authorityMechanicId).filter(Boolean))].length,
    candidateTypes,
    authorityMechanicsKnown: authorityMechanics.length,
    requiresHumanAuthoring: candidates.filter((candidate) => candidate.status === "AUTHORITY_CANDIDATE_PROJECTED").length,
    nextStep: "Review each candidate and author semantic decisions in requiredHumanResolution fields",
  };
}

function normalizesViolation(violation, index, defaults) {
  const parsedLocation = parseViolationLocation(violation.sourceLocation ?? "");
  const mechanicType = violation.mechanicType ?? violation.mechanic ?? "unknown";
  const modulePath = normalizesPathKey(
    violation.modulePath
      ?? parsedLocation.modulePath
      ?? defaults.modulePath
      ?? ""
  );
  const startLine = Number.isInteger(violation.startLine) ? violation.startLine : parsedLocation.startLine ?? null;
  const endLine = Number.isInteger(violation.endLine) ? violation.endLine : parsedLocation.endLine ?? startLine;
  const sourceReferenceId = violation.sourceReferenceId ?? (modulePath && Number.isInteger(startLine) ? `${modulePath}:${startLine}:${endLine ?? startLine}` : null);
  const symbolName = violation.symbolName ?? violation.enclosingSymbol ?? null;
  const symbolId = violation.symbolId ?? (sourceReferenceId ? `${sourceReferenceId}#symbol` : null);
  return Object.freeze({
    violationId: violation.violationId ?? `${mechanicType}-violation-${index + 1}`,
    mechanicType,
    modulePath,
    sourceLocation: violation.sourceLocation ?? (sourceReferenceId ? `${modulePath}:${startLine}${endLine !== startLine ? `-${endLine}` : ""}` : null),
    sourceReferenceId,
    symbolId,
    symbolName,
    startLine,
    endLine,
    startColumn: violation.startColumn ?? null,
    endColumn: violation.endColumn ?? null,
    codePattern: violation.codePattern ?? violation.pattern ?? null,
    sourceSnippet: violation.sourceSnippet ?? violation.snippet ?? null,
    authorityMechanicId: violation.authorityMechanicId ?? null,
    reason: violation.reason ?? null,
    status: violation.status ?? "VIOLATION_DETECTED",
  });
}

function buildsPseudoIndex(normalizedViolations, workspaceRoot) {
  const sourceReferences = [];
  const symbols = [];
  const bodyMechanics = [];

  for (const violation of normalizedViolations) {
    if (violation.sourceReferenceId && Number.isInteger(violation.startLine)) {
      sourceReferences.push(Object.freeze({
        referenceId: violation.sourceReferenceId,
        modulePath: violation.modulePath,
        startLine: violation.startLine,
        startColumn: violation.startColumn ?? 1,
        endLine: violation.endLine ?? violation.startLine,
        endColumn: violation.endColumn ?? 1,
        kind: "violation",
        sourceKind: "Violation",
      }));
    }

    if (violation.symbolId) {
      symbols.push(Object.freeze({
        symbolId: violation.symbolId,
        name: violation.symbolName,
        modulePath: violation.modulePath,
        sourceReferenceId: violation.sourceReferenceId ?? null,
        declarationLine: violation.startLine ?? null,
        declarationColumn: violation.startColumn ?? null,
        kind: "function",
        sourceKind: "Violation",
      }));
    }

      bodyMechanics.push(Object.freeze({
      mechanicId: violation.violationId,
      mechanic: violation.mechanicType ?? violation.mechanic ?? "unknown",
      modulePath: violation.modulePath,
      sourceReferenceId: violation.sourceReferenceId ?? null,
      fromSymbolId: violation.symbolId ?? null,
      evidenceKind: violation.codePattern ?? violation.mechanicType ?? violation.mechanic ?? "unknown",
      classification: "observed-violation",
      verificationDisposition: "OBSERVED_NOT_EVALUATED",
    }));
  }

  return Object.freeze({
    manifest: Object.freeze({
      scanRequest: Object.freeze({
        workspaceRoot,
      }),
    }),
    workspace: Object.freeze({
      workspaceRoot,
    }),
    sourceReferences: Object.freeze(sourceReferences),
    symbols: Object.freeze(symbols),
    bodyMechanics: Object.freeze(bodyMechanics),
  });
}

export class AuthorityProjectorFromViolations {
  constructor(options = {}) {
    this.options = options;
    this.authorityFamilyMap = this.buildAuthorityFamilyMap();
  }

  buildAuthorityFamilyMap() {
    return {
      branch: {
        families: ["decision", "classification", "result-selection"],
        primaryFamily: "decision",
        candidateTemplate: "decision-authority-candidate.v1",
      },
      iteration: {
        families: ["iteration", "execution-model", "aggregation"],
        primaryFamily: "iteration",
        candidateTemplate: "iteration-authority-candidate.v1",
      },
      "exception-handling": {
        families: ["failure-observation", "failure-policy"],
        primaryFamily: "failure-policy",
        candidateTemplate: "failure-policy-candidate.v1",
      },
      throw: {
        families: ["failure-disposition", "result-union"],
        primaryFamily: "failure-disposition",
        candidateTemplate: "failure-disposition-candidate.v1",
      },
      "object-construction": {
        families: ["projection-mapping", "result-contract"],
        primaryFamily: "projection-mapping",
        candidateTemplate: "projection-mapping-candidate.v1",
      },
      serialization: {
        families: ["serialization-profile"],
        primaryFamily: "serialization-profile",
        candidateTemplate: "serialization-profile-candidate.v1",
      },
      normalization: {
        families: ["translation", "classification", "projection"],
        primaryFamily: "translation",
        candidateTemplate: "normalization-candidate.v1",
      },
      validation: {
        families: ["schema-binding", "validation-policy", "failure-disposition"],
        primaryFamily: "validation-policy",
        candidateTemplate: "validation-policy-candidate.v1",
      },
      fallback: {
        families: ["decision", "missing-value-policy"],
        primaryFamily: "missing-value-policy",
        candidateTemplate: "fallback-policy-candidate.v1",
      },
      retry: {
        families: ["continuation-policy", "iteration", "failure-policy"],
        primaryFamily: "continuation-policy",
        candidateTemplate: "retry-policy-candidate.v1",
      },
      "state-mutation": {
        families: ["state-transition", "effect", "proof-requirement"],
        primaryFamily: "state-transition",
        candidateTemplate: "state-transition-candidate.v1",
      },
      "meaning-hidden-in-text": {
        families: ["concept", "fact", "taxonomy", "policy", "identifier"],
        primaryFamily: "concept",
        candidateTemplate: "concept-candidate.v1",
      },
    };
  }

  normalizeViolations(violations, codeFile) {
    const workspaceRoot = resolvesDefaultWorkspaceRoot(
      codeFile,
      this.options.workspaceRoot,
    );
    const defaultModulePath = resolvesRelativeModulePath(workspaceRoot, null, codeFile);
    return violations.map((violation, index) => normalizesViolation(violation, index, { modulePath: defaultModulePath }));
  }

  buildsSourceCodeMap(codeFile, normalizedViolations) {
    const workspaceRoot = resolvesDefaultWorkspaceRoot(
      codeFile,
      this.options.workspaceRoot,
    );
    return buildsSourceCodeMap({
      codeFile,
      workspaceRoot,
      violations: normalizedViolations,
    });
  }

  buildsProjector(codeFile, normalizedViolations, authorityFile) {
    const workspaceRoot = resolvesDefaultWorkspaceRoot(
      codeFile,
      this.options.workspaceRoot,
    );
    const pseudoIndex = buildsPseudoIndex(normalizedViolations, workspaceRoot);
    const sourceCodeMap = this.buildsSourceCodeMap(codeFile, normalizedViolations);
    const projector = new AuthorityCandidateProjector(pseudoIndex, sourceCodeMap, { workspaceRoot });
    const authorityMechanics = loadsAuthorityMechanics(authorityFile);
    return {
      projector,
      authorityMechanics,
      workspaceRoot,
    };
  }

  projectCandidatesFromViolations(violations, codeFile, authorityFile) {
    const normalizedViolations = this.normalizeViolations(violations, codeFile);
    const { projector, authorityMechanics, workspaceRoot } = this.buildsProjector(codeFile, normalizedViolations, authorityFile);

    const candidates = normalizedViolations.map((violation) => {
      const mechanic = {
        mechanic: violation.mechanicType,
        modulePath: violation.modulePath,
        sourceReferenceId: violation.sourceReferenceId,
        fromSymbolId: violation.symbolId,
        enclosingSymbol: violation.symbolName,
        symbolName: violation.symbolName,
        startLine: violation.startLine,
        endLine: violation.endLine,
        startColumn: violation.startColumn,
        endColumn: violation.endColumn,
        codePattern: violation.codePattern,
      };

      try {
        return projector.projectCandidate(mechanic, violation.mechanicType, violation.symbolName ?? violation.modulePath);
      } catch {
        return projector.projectGenericCandidate(mechanic, violation.mechanicType, violation.symbolName ?? violation.modulePath);
      }
    });

    const bindingSuggestions = normalizedViolations.map((violation, index) => {
      const authorityMechanicId = suggestsAuthorityMechanicId(violation, authorityMechanics);
      return buildsBindingSuggestion({
        ...violation,
        candidateId: candidates[index]?.candidateId ?? null,
      }, authorityMechanicId);
    });

    const authorityDraft = projector.buildAuthorityDraft(candidates, {
      modulePath: normalizedViolations[0]?.modulePath ?? path.relative(workspaceRoot, path.resolve(codeFile)),
      sourceFiles: [...new Set(normalizedViolations.map((violation) => violation.modulePath).filter(Boolean))].sort(),
      responsibilityId: null,
    });

    return {
      $schema: "authority-candidates.schema.v1",
      generatedAtUtc: new Date().toISOString(),
      generatedFromViolations: {
        codeFile,
        authorityFile,
        workspaceRoot,
        violationCount: normalizedViolations.length,
        mechanicTypes: [...new Set(normalizedViolations.map((violation) => violation.mechanicType))].sort(),
        sourceFiles: [...new Set(normalizedViolations.map((violation) => violation.modulePath).filter(Boolean))].sort(),
      },
      violations: normalizedViolations,
      candidates,
      bindingSuggestions,
      authorityDraft,
      coverageSummary: buildsCoverageSummary(normalizedViolations, candidates, bindingSuggestions, authorityMechanics),
    };
  }

  saveCandidates(candidatesData, outputPath, authorityOutputPath = null) {
    try {
      writeFileSync(outputPath, JSON.stringify(candidatesData, null, 2), "utf8");
      if (typeof authorityOutputPath === "string" && authorityOutputPath.length > 0) {
        writeFileSync(authorityOutputPath, JSON.stringify(candidatesData.authorityDraft, null, 2), "utf8");
      }
      return {
        success: true,
        file: outputPath,
        authorityFile: typeof authorityOutputPath === "string" && authorityOutputPath.length > 0 ? authorityOutputPath : null,
        candidateCount: candidatesData.candidates.length,
        message: typeof authorityOutputPath === "string" && authorityOutputPath.length > 0
          ? `Saved ${candidatesData.candidates.length} authority candidates to ${outputPath} and authority draft to ${authorityOutputPath}`
          : `Saved ${candidatesData.candidates.length} authority candidates to ${outputPath}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export async function projectAuthorityCandidatesFromViolations(
  codeFile,
  authorityFile,
  violations,
  outputPath,
  options = {},
) {
  const projector = new AuthorityProjectorFromViolations(options);
  const candidatesData = projector.projectCandidatesFromViolations(
    violations,
    codeFile,
    authorityFile,
  );

  const result = projector.saveCandidates(candidatesData, outputPath, options.authorityOutputPath ?? null);
  return {
    ...result,
    candidatesData: result.success ? candidatesData : null,
  };
}
