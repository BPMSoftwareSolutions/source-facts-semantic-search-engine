const knownPostures = Object.freeze([
  "KERNEL_PRIMITIVE",
  "UNAUTHORIZED_EXECUTABLE_MEANING",
  "FALSE_POSITIVE",
]);

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

function parsesSourceLocation(sourceLocation) {
  if (typeof sourceLocation !== "string" || sourceLocation.length === 0) {
    return null;
  }
  const [firstLocation] = sourceLocation.split(",");
  const match = firstLocation.trim().match(/^(.*?):(\d+)(?:-(\d+))?$/);
  if (!match) {
    return null;
  }
  return {
    modulePath: normalizesPathKey(match[1]),
    startLine: Number.parseInt(match[2], 10),
    endLine: Number.parseInt(match[3] ?? match[2], 10),
  };
}

function locationsOverlap(left, right) {
  if (left === null || right === null || left.modulePath !== right.modulePath) {
    return false;
  }
  return left.startLine <= right.endLine && right.startLine <= left.endLine;
}

/**
 * Only AUTHORITY_BOUND mechanics count as governance evidence; drafts and
 * candidates describe intent, not an admitted authority.
 */
export function extractsDeclaredAuthorityMechanics(authorityDocument, authorityFilePath) {
  if (authorityDocument === null || typeof authorityDocument !== "object") {
    return [];
  }
  if (authorityDocument.schemaVersion !== "authority-declaration.v1") {
    return [];
  }
  const mechanics = authorityDocument.authority?.mechanics ?? authorityDocument.mechanics ?? [];
  if (!Array.isArray(mechanics)) {
    return [];
  }
  return mechanics
    .filter((mechanic) => mechanic.coverage === "AUTHORITY_BOUND")
    .map((mechanic) => ({
      mechanicId: mechanic.mechanicId ?? null,
      mechanic: mechanic.mechanic ?? null,
      location: parsesSourceLocation(mechanic.sourceLocation),
      authorityFile: authorityFilePath,
    }))
    .filter((entry) => entry.mechanicId !== null && entry.mechanic !== null && entry.location !== null);
}

export function classifiesMechanicOccurrence(occurrence, declaredAuthorityMechanics, { kernelModulePathPrefixes = [], falsePositiveOccurrenceIds = [] } = {}) {
  const occurrenceLocation = {
    modulePath: normalizesPathKey(occurrence.modulePath),
    startLine: occurrence.startLine,
    endLine: occurrence.endLine ?? occurrence.startLine,
  };

  const match = declaredAuthorityMechanics.find(
    (declared) => declared.mechanic === occurrence.mechanic && locationsOverlap(declared.location, occurrenceLocation),
  );

  const inKernel = kernelModulePathPrefixes.some((prefix) => {
    const normalized = normalizesPathKey(prefix).replace(/\/$/u, "");
    return normalized.length > 0 && (occurrenceLocation.modulePath === normalized || occurrenceLocation.modulePath.startsWith(`${normalized}/`));
  });
  if (inKernel) {
    return Object.freeze({
      posture: "KERNEL_PRIMITIVE",
      executionBoundary: "SEMANTIC_KERNEL",
      authorityDisposition: "AUTHORITY_NOT_REQUIRED_IN_KERNEL",
      violationDisposition: "KERNEL_EXECUTION_ALLOWED",
      remediationDisposition: "NONE",
      governingMechanicId: match?.mechanicId ?? null,
      governingAuthorityFile: match?.authorityFile ?? null,
    });
  }

  if (falsePositiveOccurrenceIds.includes(occurrence.occurrenceId)) {
    return Object.freeze({
      posture: "FALSE_POSITIVE",
      executionBoundary: "OUTSIDE_SEMANTIC_KERNEL",
      authorityDisposition: "AUTHORITY_NOT_APPLICABLE_FALSE_POSITIVE",
      violationDisposition: "FALSE_POSITIVE_EXCLUDED",
      remediationDisposition: "NONE",
      governingMechanicId: null,
      governingAuthorityFile: null,
    });
  }

  if (match) {
    return Object.freeze({
      posture: "UNAUTHORIZED_EXECUTABLE_MEANING",
      executionBoundary: "OUTSIDE_SEMANTIC_KERNEL",
      authorityDisposition: "AUTHORITY_ADMITTED",
      violationDisposition: "OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION",
      remediationDisposition: "REPLACEMENT_REQUIRED",
      governingMechanicId: match.mechanicId,
      governingAuthorityFile: match.authorityFile,
    });
  }

  return Object.freeze({
    posture: "UNAUTHORIZED_EXECUTABLE_MEANING",
    executionBoundary: "OUTSIDE_SEMANTIC_KERNEL",
    authorityDisposition: "AUTHORITY_MISSING",
    violationDisposition: "OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION",
    remediationDisposition: "AUTHORITY_REQUIRED",
    governingMechanicId: null,
    governingAuthorityFile: null,
  });
}

export { knownPostures };
