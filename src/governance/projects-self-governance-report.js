import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics, knownPostures } from "./classifies-execution-mechanics.js";

function compareOccurrences(left, right) {
  return left.modulePath.localeCompare(right.modulePath)
    || (left.startLine ?? 0) - (right.startLine ?? 0)
    || (left.endLine ?? 0) - (right.endLine ?? 0)
    || left.mechanic.localeCompare(right.mechanic);
}

/**
 * A SQL JOIN through the SEJ relational engine over the full bodyMechanics x
 * sourceReferences tables measured at 270-320 seconds for this workspace's
 * ~66k source references -- an unindexed nested-loop join. Every field this
 * report needs is already held in memory, so resolve it with plain Map
 * lookups instead; the equivalent join runs in under 20ms.
 */
function resolvesBodyMechanicOccurrences(index) {
  const sourceReferenceById = new Map(index.sourceReferences.map((reference) => [reference.referenceId, reference]));
  const symbolById = new Map(index.symbols.map((symbol) => [symbol.symbolId, symbol]));

  const occurrences = index.bodyMechanics.map((mechanic) => {
    const sourceReference = sourceReferenceById.get(mechanic.sourceReferenceId) ?? null;
    const symbol = mechanic.fromSymbolId ? symbolById.get(mechanic.fromSymbolId) ?? null : null;
    return {
      mechanic: mechanic.mechanic,
      modulePath: mechanic.modulePath,
      startLine: sourceReference?.startLine ?? null,
      endLine: sourceReference?.endLine ?? null,
      symbolName: symbol?.name ?? null,
    };
  });

  return occurrences.sort(compareOccurrences);
}

/**
 * Loop 2 (execution-mechanics coverage) from the self-governance substrate
 * design: classify every observed mechanic into a governance posture and
 * report the count, not just "N mechanics found." No baseline, no backlog
 * registry, and no build gate exist yet -- disposition stays observational.
 */
export async function projectsSelfGovernanceReport({ index, repositoryId, authorityDocuments = [] }) {
  const occurrences = resolvesBodyMechanicOccurrences(index);
  const declaredAuthorityMechanics = authorityDocuments.flatMap(
    ({ document, filePath }) => extractsDeclaredAuthorityMechanics(document, filePath),
  );

  const byPosture = Object.fromEntries(knownPostures.map((posture) => [posture, 0]));
  const byMechanicType = new Map();
  const classifiedOccurrences = [];

  for (const occurrence of occurrences) {
    const { posture, governingMechanicId, governingAuthorityFile } = classifiesMechanicOccurrence(occurrence, declaredAuthorityMechanics);
    byPosture[posture] += 1;

    const mechanicSummary = byMechanicType.get(occurrence.mechanic) ?? { mechanic: occurrence.mechanic, observed: 0, governed: 0 };
    mechanicSummary.observed += 1;
    if (posture === "GOVERNED_BY_SEMANTIC_AUTHORITY") {
      mechanicSummary.governed += 1;
    }
    byMechanicType.set(occurrence.mechanic, mechanicSummary);

    classifiedOccurrences.push({
      mechanic: occurrence.mechanic,
      modulePath: occurrence.modulePath,
      startLine: occurrence.startLine,
      endLine: occurrence.endLine ?? occurrence.startLine,
      symbolName: occurrence.symbolName ?? null,
      posture,
      governingMechanicId,
      governingAuthorityFile,
    });
  }

  return Object.freeze({
    reportType: "source-facts-self-governance-report.v1",
    generatedAtUtc: new Date().toISOString(),
    repository: Object.freeze({
      repositoryId,
      workspaceId: index.workspace?.workspaceId ?? null,
      workspaceRoot: index.manifest?.scanRequest?.workspaceRoot ?? null,
    }),
    index: Object.freeze({
      indexId: index.indexId ?? null,
      scanId: index.manifest?.scanId ?? null,
    }),
    authoritySources: Object.freeze(
      authorityDocuments.map(({ document, filePath }) => Object.freeze({
        authorityFile: filePath,
        sourceFile: document.sourceFile ?? null,
        mechanicsDeclared: (document.authority?.mechanics ?? document.mechanics ?? []).length,
        mechanicsAuthorityBound: extractsDeclaredAuthorityMechanics(document, filePath).length,
      })),
    ),
    executionMechanics: Object.freeze({
      observed: occurrences.length,
      governed: byPosture.GOVERNED_BY_SEMANTIC_AUTHORITY,
      byPosture: Object.freeze(byPosture),
      byMechanicType: Object.freeze(
        [...byMechanicType.values()].sort((left, right) => right.observed - left.observed || left.mechanic.localeCompare(right.mechanic)),
      ),
    }),
    occurrences: Object.freeze(classifiedOccurrences),
    disposition: "OBSERVATIONAL_NO_GATE_APPLIED",
  });
}
