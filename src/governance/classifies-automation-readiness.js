const knownAutomationDispositions = Object.freeze([
  "AUTHORITY_ADMITTED_REPLACEMENT_REQUIRED",
  "KERNEL_EXECUTION_ALLOWED",
  "FALSE_POSITIVE",
  "NOT_APPLICABLE",
  "AUTOMATABLE_AFTER_REVIEW",
  "REQUIRES_HUMAN_SEMANTIC_DECISION",
  "AUTOMATABLE_AFTER_AUTHORITY_COMPLETION",
  "REQUIRES_NEW_AUTHORITY",
  "NOT_CURRENTLY_PROJECTABLE",
]);

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

function parsesLocationRange(sourceLocation) {
  if (typeof sourceLocation !== "string" || sourceLocation.length === 0) {
    return null;
  }
  const [firstLocation] = sourceLocation.split(",");
  const match = firstLocation.trim().match(/^(.*?):(\d+)(?:-(\d+))?$/);
  if (!match) {
    return null;
  }
  const modulePath = normalizesPathKey(match[1]);
  if (modulePath.length === 0) {
    return null;
  }
  return {
    modulePath,
    startLine: Number.parseInt(match[2], 10),
    endLine: Number.parseInt(match[3] ?? match[2], 10),
  };
}

function resolvesDeclaredModulePath(declaredModulePath, knownModulePaths) {
  if (knownModulePaths.has(declaredModulePath)) {
    return declaredModulePath;
  }
  const suffixMatches = [...knownModulePaths].filter((known) => known.endsWith(`/${declaredModulePath}`));
  return suffixMatches.length === 1 ? suffixMatches[0] : null;
}

function locationsOverlap(left, right) {
  return left.startLine <= right.endLine && right.startLine <= left.endLine;
}

/**
 * A "candidate" is any declared mechanic whose coverage is NOT AUTHORITY_BOUND --
 * an AUTHORITY_CANDIDATE_PROJECTED entry from a draft, or any other not-yet-
 * admitted coverage value a future authoring step introduces. Unlike
 * extractsDeclaredAuthorityMechanics (classifies-execution-mechanics.js), this
 * accepts any document with a mechanics-array shape regardless of schemaVersion
 * -- mirroring measuresContractSemanticVolume's structural check -- because
 * drafts in this repo carry a distinct schemaVersion ("authority-declaration.
 * draft.v1") and would otherwise be invisible to automation-readiness scoring
 * even though they are exactly the inventory this question is about.
 *
 * coverageDisposition is read from mechanic.decisions.coverageDisposition
 * first, not mechanic.coverageDisposition -- every AUTHORITY_CANDIDATE_PROJECTED
 * mechanic in this repo's actual drafts nests it under decisions (alongside
 * requiredHumanResolution), never at the mechanic's own top level. A
 * top-level mechanic.coverageDisposition is still accepted as a fallback in
 * case a future authoring convention flattens it there.
 */
export function extractsCandidateAuthorityMechanics(authorityDocument, authorityFilePath) {
  if (authorityDocument === null || typeof authorityDocument !== "object") {
    return [];
  }
  const mechanics = authorityDocument.authority?.mechanics ?? authorityDocument.mechanics ?? [];
  if (!Array.isArray(mechanics)) {
    return [];
  }
  return mechanics
    .filter((mechanic) => typeof mechanic.coverage === "string" && mechanic.coverage.length > 0 && mechanic.coverage !== "AUTHORITY_BOUND")
    .map((mechanic) => ({
      mechanicId: mechanic.mechanicId ?? null,
      mechanic: mechanic.mechanic ?? null,
      location: parsesLocationRange(mechanic.sourceLocation),
      coverage: mechanic.coverage,
      coverageDisposition: mechanic.decisions?.coverageDisposition ?? mechanic.coverageDisposition ?? null,
      authorityFile: authorityFilePath,
    }))
    .filter((entry) => entry.mechanicId !== null && entry.mechanic !== null && entry.location !== null);
}

/**
 * Finds a candidate that plausibly already describes this exact occurrence:
 * same mechanic type, and a declared location that resolves (exact or unique
 * suffix, same tolerance measuresContractSemanticVolume uses -- draft and
 * admitted authority documents in this repo declare sourceFile/sourceLocation
 * relative to different bases) to this occurrence's file with overlapping
 * lines. Returns the first match; ambiguity between multiple candidates for
 * the same occurrence is not scored here, only file-level location ambiguity.
 */
export function resolvesCandidateAuthorityMatch(occurrence, candidates, knownModulePaths) {
  const occurrenceLocation = {
    modulePath: normalizesPathKey(occurrence.modulePath),
    startLine: occurrence.startLine,
    endLine: occurrence.endLine ?? occurrence.startLine,
  };
  if (occurrenceLocation.startLine === null || occurrenceLocation.startLine === undefined) {
    return null;
  }

  for (const candidate of candidates) {
    if (candidate.mechanic !== occurrence.mechanic) continue;
    const resolvedModulePath = resolvesDeclaredModulePath(candidate.location.modulePath, knownModulePaths);
    if (resolvedModulePath !== occurrenceLocation.modulePath) continue;
    if (!locationsOverlap(candidate.location, occurrenceLocation)) continue;
    return candidate;
  }
  return null;
}

/**
 * The automation-readiness question, distinct from posture and home status:
 * "can connecting this occurrence to authority be automated, and what is
 * still missing?" Reachability of a candidate is necessary but not
 * sufficient -- a candidate can carry its own coverageDisposition
 * (SEMANTIC_DECISION_REQUIRED today, the only value this repo's drafts use)
 * declaring that a human judgment call is still open even though the
 * mechanical scaffolding (type, location, semantic shape) is complete.
 */
export function classifiesAutomationReadiness({ posture, authorityDisposition = null, authorityHomeStatus, candidateMatch }) {
  if (posture === "KERNEL_PRIMITIVE") {
    return Object.freeze({ automationDisposition: "KERNEL_EXECUTION_ALLOWED", missingTissue: Object.freeze([]) });
  }
  if (posture === "FALSE_POSITIVE") {
    return Object.freeze({ automationDisposition: "FALSE_POSITIVE", missingTissue: Object.freeze([]) });
  }
  if (authorityDisposition === "AUTHORITY_ADMITTED") {
    return Object.freeze({ automationDisposition: "AUTHORITY_ADMITTED_REPLACEMENT_REQUIRED", missingTissue: Object.freeze(["MECHANIC_FREE_REPLACEMENT_MISSING", "EQUIVALENCE_PROOF_MISSING", "ORIGINAL_MECHANIC_REMOVAL_MISSING"]) });
  }
  if (authorityHomeStatus === "AUTHORITY_HOME_AMBIGUOUS") {
    return Object.freeze({ automationDisposition: "NOT_CURRENTLY_PROJECTABLE", missingTissue: Object.freeze(["AUTHORITY_HOME_AMBIGUOUS"]) });
  }

  if (candidateMatch !== null) {
    if (candidateMatch.coverageDisposition === "SEMANTIC_DECISION_REQUIRED") {
      return Object.freeze({
        automationDisposition: "REQUIRES_HUMAN_SEMANTIC_DECISION",
        missingTissue: Object.freeze(["RESPONSIBILITY_BINDING_MISSING", "EXECUTION_BINDING_MISSING", "EQUIVALENCE_PROOF_MISSING"]),
      });
    }
    return Object.freeze({
      automationDisposition: "AUTOMATABLE_AFTER_REVIEW",
      missingTissue: Object.freeze(["RESPONSIBILITY_BINDING_MISSING", "EXECUTION_BINDING_MISSING"]),
    });
  }

  if (authorityHomeStatus === "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE") {
    return Object.freeze({ automationDisposition: "AUTOMATABLE_AFTER_AUTHORITY_COMPLETION", missingTissue: Object.freeze(["AUTHORITY_ENTRY_MISSING"]) });
  }

  return Object.freeze({ automationDisposition: "REQUIRES_NEW_AUTHORITY", missingTissue: Object.freeze(["AUTHORITY_DOCUMENT_MISSING", "AUTHORITY_FAMILY_MISSING"]) });
}

export { knownAutomationDispositions };
