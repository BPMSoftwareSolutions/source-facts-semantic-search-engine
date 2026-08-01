import { createHash } from "node:crypto";

export function projectsGalleryManifest({ requestId, selection, plan, index }) {
  const documentByPathId = new Map(index.htmlDocuments.map((document) => [document.pathId, document]));
  const classificationByDocumentId = new Map((index.webpageClassifications ?? []).map((classification) => [classification.documentId, classification]));
  const planItemByItemId = new Map(plan.items.map((item) => [item.itemId, item]));

  const items = [];
  let ordinal = 0;
  for (const selectedItem of selection.items.filter((item) => item.disposition === "selected")) {
    const document = documentByPathId.get(selectedItem.rowIdentity.pathId);
    if (document === undefined) continue;
    const planItem = planItemByItemId.get(selectedItem.itemId);
    const classification = classificationByDocumentId.get(document.documentId);

    const limitations = [];
    if (planItem?.reproductionDisposition === "NOT_EVALUATED_REQUIRES_SCRIPT") {
      limitations.push("script content is stripped under the default static-no-script preview policy");
    }
    if ((planItem?.unresolvedEdgeCount ?? 0) > 0) {
      limitations.push(`${planItem.unresolvedEdgeCount} unresolved local dependency edge(s)`);
    }
    if ((planItem?.externalEdgeCount ?? 0) > 0) {
      limitations.push(`${planItem.externalEdgeCount} external dependency edge(s) are never fetched`);
    }

    const galleryItemId = `sha256:${sha256(`${requestId}\0${selectedItem.itemId}`)}`;
    items.push(Object.freeze({
      galleryItemId,
      ordinal: ordinal++,
      documentId: document.documentId,
      familyId: planItem?.familyId ?? null,
      pathId: document.pathId,
      rootId: document.rootId,
      relativePath: document.relativePath,
      title: document.title,
      kind: "html-document",
      classification: Object.freeze({
        dimension: classification?.dimension ?? "page-type",
        value: classification?.value ?? null,
        disposition: classification?.disposition ?? "NOT_EVALUATED",
      }),
      sourceReferenceIds: Object.freeze([...selectedItem.sourceReferenceIds]),
      dependencySummary: Object.freeze({
        resolvedLocal: planItem?.admittedMembers.length ?? 0,
        unresolved: planItem?.unresolvedEdgeCount ?? 0,
        external: planItem?.externalEdgeCount ?? 0,
      }),
      previewDisposition: planItem?.reproductionDisposition ?? "BLOCKED_MISSING_DEPENDENCY",
      previewRoute: planItem?.reproductionDisposition === "STATIC_REPRODUCTION_READY" || planItem?.reproductionDisposition === "PARTIAL_STATIC_REPRODUCTION"
        ? planItem.targetRoute
        : null,
      diagnostics: Object.freeze([]),
      limitations: Object.freeze(limitations),
      allowedInspectorTabs: Object.freeze(buildsAllowedTabs(planItem)),
      selectable: true,
    }));
  }

  const manifestId = `sha256:${sha256(JSON.stringify({ requestId, selectionId: selection.selectionId, planId: plan.planId, items }))}`;
  return Object.freeze({
    manifestType: "enterprise-gallery-manifest.v1",
    manifestId,
    requestId,
    selectionId: selection.selectionId,
    planId: plan.planId,
    items: Object.freeze(items),
  });
}

function buildsAllowedTabs(planItem) {
  const tabs = ["source", "dependencies"];
  if (planItem?.reproductionDisposition === "STATIC_REPRODUCTION_READY" || planItem?.reproductionDisposition === "PARTIAL_STATIC_REPRODUCTION") {
    tabs.push("preview");
  }
  return tabs;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
