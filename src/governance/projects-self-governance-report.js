import { executeRelationalQuery } from "../query.js";
import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics, knownPostures } from "./classifies-execution-mechanics.js";

async function queriesBodyMechanics(index) {
  const receipt = await executeRelationalQuery(
    index,
    [
      "SELECT bm.mechanic AS mechanic,",
      "       bm.modulePath AS modulePath,",
      "       bm.sourceReferenceId AS sourceReferenceId,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       sym.name AS symbolName",
      "FROM bodyMechanics bm",
      "JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId",
      "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId",
      "ORDER BY bm.modulePath, sr.startLine, sr.endLine, bm.mechanic",
    ].join(" "),
  );
  if (receipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new Error(`bodyMechanics query failed while projecting the self-governance report: ${JSON.stringify(receipt, null, 2)}`);
  }
  return receipt.result.value.rows;
}

/**
 * Loop 2 (execution-mechanics coverage) from the self-governance substrate
 * design: classify every observed mechanic into a governance posture and
 * report the count, not just "N mechanics found." No baseline, no backlog
 * registry, and no build gate exist yet -- disposition stays observational.
 */
export async function projectsSelfGovernanceReport({ index, repositoryId, authorityDocuments = [] }) {
  const occurrences = await queriesBodyMechanics(index);
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
