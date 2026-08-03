const knownPostures = Object.freeze([
  "GOVERNED_BY_SEMANTIC_AUTHORITY",
  "MECHANICAL_ADAPTER_OPERATION",
  "KERNEL_PRIMITIVE",
  "AUTHORIZED_TEMPORARY_BACKLOG",
  "UNAUTHORIZED_EXECUTABLE_MEANING",
  "UNKNOWN_CLASSIFICATION",
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

export function classifiesMechanicOccurrence(occurrence, declaredAuthorityMechanics) {
  const occurrenceLocation = {
    modulePath: normalizesPathKey(occurrence.modulePath),
    startLine: occurrence.startLine,
    endLine: occurrence.endLine ?? occurrence.startLine,
  };

  const match = declaredAuthorityMechanics.find(
    (declared) => declared.mechanic === occurrence.mechanic && locationsOverlap(declared.location, occurrenceLocation),
  );

  if (match) {
    return Object.freeze({
      posture: "GOVERNED_BY_SEMANTIC_AUTHORITY",
      governingMechanicId: match.mechanicId,
      governingAuthorityFile: match.authorityFile,
    });
  }

  return Object.freeze({
    posture: "UNKNOWN_CLASSIFICATION",
    governingMechanicId: null,
    governingAuthorityFile: null,
  });
}

export { knownPostures };
