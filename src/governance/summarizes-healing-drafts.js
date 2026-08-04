const tissueTypeLabels = Object.freeze({
  authorityCompletionDraft: "Authority completion",
  bindingDraft: "Execution binding",
  runtimeWiringDraft: "Runtime wiring",
  collapsedBodyDraft: "Collapsed body",
  equivalenceVectorDraft: "Equivalence vector",
});

/**
 * Purely descriptive. A "generated" tissue type here means the model marked
 * that section applicable:true in an unreviewed draft -- it is not a claim
 * that the tissue is correct, admitted, or applied. See
 * generates-connective-tissue.js for the lifecycle boundary this respects.
 */
export function summarizesHealingDraft({ filePath, document }) {
  const draft = document.draft ?? {};
  const generatedTissueTypes = Object.keys(tissueTypeLabels).filter((key) => draft[key]?.applicable === true);
  return Object.freeze({
    draftFile: filePath,
    lifecycle: typeof document.lifecycle === "string" ? document.lifecycle : "UNKNOWN",
    subjectId: document.subject?.subjectId ?? null,
    scenarioTarget: document.subject?.scenarioTarget ?? null,
    healingDisposition: typeof draft.healingDisposition === "string" ? draft.healingDisposition : "UNKNOWN",
    confidence: typeof draft.confidence === "number" ? draft.confidence : null,
    missingTissue: Object.freeze(Array.isArray(draft.missingTissue) ? [...draft.missingTissue] : []),
    generatedTissueTypes: Object.freeze(generatedTissueTypes),
    inferenceModel: document.inference?.resolvedModel ?? null,
  });
}

export function summarizesHealingDraftRegistry(batches) {
  const drafts = batches.map((batch) => summarizesHealingDraft(batch));

  const byDisposition = {};
  for (const draft of drafts) {
    byDisposition[draft.healingDisposition] = (byDisposition[draft.healingDisposition] ?? 0) + 1;
  }

  const byTissueType = {};
  for (const draft of drafts) {
    for (const tissueType of draft.generatedTissueTypes) {
      byTissueType[tissueType] = (byTissueType[tissueType] ?? 0) + 1;
    }
  }

  return Object.freeze({
    totalDrafts: drafts.length,
    byDisposition: Object.freeze(byDisposition),
    byTissueType: Object.freeze(byTissueType),
    drafts: Object.freeze(drafts),
  });
}

export { tissueTypeLabels };
