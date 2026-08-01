import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const nonLoadBearingPreviewEdgeKinds = Object.freeze(new Set(["html-anchor-navigation"]));

export async function plansSurfacePreviews({ selectionId, selection, previewPolicyId, index, resolutionContext, readsFileText = (absolutePath) => readFile(absolutePath, "utf8") }) {
  const familyByEntryPathId = new Map(index.webFamilies.map((family) => [family.entryPathId, family]));
  const relationshipById = new Map(index.webRelationships.map((relationship) => [relationship.relationshipId, relationship]));
  const nonExecutableInlineScriptPathIds = new Set(index.htmlElements
    .filter((element) => element.kind === "script-inline" && isStructuredDataScriptType(element.attributes?.type))
    .map((element) => sha256(`${element.documentId}#inline-script-${element.elementId}`)));

  const items = [];
  for (const selected of selection.items.filter((item) => item.disposition === "selected")) {
    items.push(await plansOneItem(selected, familyByEntryPathId, relationshipById, nonExecutableInlineScriptPathIds, resolutionContext, readsFileText));
  }

  const planId = `sha256:${sha256(JSON.stringify({ selectionId, previewPolicyId, items }))}`;
  return Object.freeze({
    planType: "surface-preview-plan.v1",
    planId,
    selectionId,
    previewPolicyId,
    items: Object.freeze(items),
  });
}

async function plansOneItem(selectedItem, familyByEntryPathId, relationshipById, nonExecutableInlineScriptPathIds, resolutionContext, readsFileText) {
  const entryPathId = selectedItem.rowIdentity.pathId;
  const family = familyByEntryPathId.get(entryPathId);
  const targetRoute = `/preview/${shortHash(selectedItem.itemId)}/index.html`;

  if (family === undefined) {
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: null, sourceHashAtPlanTime: null, admittedMembers: [], unresolvedEdgeCount: 0, externalEdgeCount: 0, transformations: [], targetRoute: null, reproductionDisposition: "BLOCKED_MISSING_DEPENDENCY", reason: "no artifact family was projected for this entry surface" });
  }

  const entryAbsolutePath = resolutionContext.absolutePathByPathId.get(entryPathId);
  const entryInventory = entryAbsolutePath === undefined
    ? undefined
    : resolutionContext.pathIdByAbsolutePath.get(entryAbsolutePath);
  if (entryAbsolutePath === undefined || entryInventory === undefined) {
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime: null, admittedMembers: [], unresolvedEdgeCount: 0, externalEdgeCount: 0, transformations: [], targetRoute: null, reproductionDisposition: "BLOCKED_MISSING_DEPENDENCY", reason: "entry surface no longer resolves through the current inventory" });
  }

  let entryText;
  try {
    entryText = await readsFileText(entryAbsolutePath);
  } catch (error) {
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime: null, admittedMembers: [], unresolvedEdgeCount: 0, externalEdgeCount: 0, transformations: [], targetRoute: null, reproductionDisposition: "BLOCKED_STALE_SOURCE", reason: `entry surface is no longer readable: ${error.message}` });
  }
  const sourceHashAtPlanTime = `sha256:${sha256(entryText)}`;
  if (sourceHashAtPlanTime !== entryInventory.contentHash) {
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime, admittedMembers: [], unresolvedEdgeCount: 0, externalEdgeCount: 0, transformations: [], targetRoute: null, reproductionDisposition: "BLOCKED_STALE_SOURCE", reason: "entry surface content changed since the index was projected" });
  }

  let hasScriptMember = false;
  let hasStructuredDataScript = false;
  let hasStaleMember = false;
  let staleDetail = null;
  const admittedMembers = [];
  const transformations = [];

  for (const member of family.members) {
    if (member.pathId === entryPathId) continue;
    if (member.role === "script") {
      if (nonExecutableInlineScriptPathIds.has(member.pathId)) hasStructuredDataScript = true;
      else hasScriptMember = true;
    }

    const absolutePath = resolutionContext.absolutePathByPathId.get(member.pathId);
    if (absolutePath === undefined) continue; // synthetic inline block: content lives inside the entry document itself

    const inventoryEntry = resolutionContext.pathIdByAbsolutePath.get(absolutePath);
    if (inventoryEntry === undefined) continue;

    let currentText;
    try {
      currentText = await readsFileText(absolutePath);
    } catch (error) {
      hasStaleMember = true;
      staleDetail = `member ${inventoryEntry.relativePath} is no longer readable: ${error.message}`;
      continue;
    }
    const currentHash = `sha256:${sha256(currentText)}`;
    if (currentHash !== inventoryEntry.contentHash) {
      hasStaleMember = true;
      staleDetail = `member ${inventoryEntry.relativePath} content changed since the index was projected`;
      continue;
    }

    admittedMembers.push(Object.freeze({
      pathId: member.pathId,
      relativePath: inventoryEntry.relativePath,
      role: member.role,
      contentHash: inventoryEntry.contentHash,
    }));
    if (member.role === "stylesheet") transformations.push(Object.freeze({ kind: "stylesheet-copied", detail: inventoryEntry.relativePath }));
    else if (member.role === "asset") transformations.push(Object.freeze({ kind: "asset-copied", detail: inventoryEntry.relativePath }));
  }

  let unresolvedEdgeCount = 0;
  let externalEdgeCount = 0;
  for (const edgeId of family.unresolvedEdgeIds) {
    const edge = relationshipById.get(edgeId);
    if (edge !== undefined && nonLoadBearingPreviewEdgeKinds.has(edge.edgeKind)) continue;
    if (edge?.resolutionDisposition === "external-url") externalEdgeCount += 1;
    else unresolvedEdgeCount += 1;
  }
  for (const edgeId of family.resolvedEdgeIds) {
    const edge = relationshipById.get(edgeId);
    if (edge !== undefined && nonLoadBearingPreviewEdgeKinds.has(edge.edgeKind)) continue;
    if (edge !== undefined && (edge.edgeKind === "html-script-src" || edge.edgeKind === "html-module-script-src")) hasScriptMember = true;
    if (edge?.edgeKind === "html-inline-script") {
      if (edge.resolvedPathId !== null && nonExecutableInlineScriptPathIds.has(edge.resolvedPathId)) hasStructuredDataScript = true;
      else hasScriptMember = true;
    }
    if (edge !== undefined && edge.resolvedPathId !== null) {
      const resolvedAbsolutePath = resolutionContext.absolutePathByPathId.get(edge.resolvedPathId);
      const resolvedInventory = resolvedAbsolutePath === undefined ? undefined : resolutionContext.pathIdByAbsolutePath.get(resolvedAbsolutePath);
      if (resolvedInventory !== undefined) {
        transformations.push(Object.freeze({ kind: "link-rewritten", detail: resolvedInventory.relativePath }));
      }
    }
  }

  if (hasStaleMember) {
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime, admittedMembers, unresolvedEdgeCount, externalEdgeCount, transformations: [], targetRoute: null, reproductionDisposition: "BLOCKED_STALE_SOURCE", reason: staleDetail });
  }
  if (hasStructuredDataScript) {
    transformations.push(Object.freeze({ kind: "script-removed", detail: "non-executable structured-data script removed from the restricted visual preview" }));
  }
  if (hasScriptMember) {
    transformations.push(Object.freeze({ kind: "script-removed", detail: "all <script> content stripped under the static-no-script preview policy" }));
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime, admittedMembers, unresolvedEdgeCount, externalEdgeCount, transformations, targetRoute: null, reproductionDisposition: "NOT_EVALUATED_REQUIRES_SCRIPT", reason: "family includes script content; the default static-no-script policy does not evaluate script-bearing pages" });
  }
  if (unresolvedEdgeCount > 0 || externalEdgeCount > 0 || family.truncated) {
    const reasons = [];
    if (unresolvedEdgeCount > 0) reasons.push(`${unresolvedEdgeCount} unresolved local dependency edge(s) could not be materialized`);
    if (externalEdgeCount > 0) reasons.push(`${externalEdgeCount} external dependency edge(s) will be denied`);
    if (family.truncated) reasons.push(`artifact family expansion was truncated by ${family.truncationReason ?? "policy"}`);
    return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime, admittedMembers, unresolvedEdgeCount, externalEdgeCount, transformations, targetRoute, reproductionDisposition: "PARTIAL_STATIC_REPRODUCTION", reason: reasons.join("; ") });
  }
  return buildsPlanItem({ itemId: selectedItem.itemId, entryPathId, familyId: family.familyId, sourceHashAtPlanTime, admittedMembers, unresolvedEdgeCount, externalEdgeCount, transformations, targetRoute, reproductionDisposition: "STATIC_REPRODUCTION_READY", reason: null });
}

function buildsPlanItem({ itemId, entryPathId, familyId, sourceHashAtPlanTime, admittedMembers, unresolvedEdgeCount, externalEdgeCount, transformations, targetRoute, reproductionDisposition, reason }) {
  return Object.freeze({
    itemId,
    entryPathId,
    familyId,
    sourceHashAtPlanTime,
    admittedMembers: Object.freeze(admittedMembers),
    unresolvedEdgeCount,
    externalEdgeCount,
    transformations: Object.freeze(transformations),
    requiredMocks: Object.freeze([]),
    targetRoute,
    reproductionDisposition,
    reason,
  });
}

function shortHash(prefixedHash) {
  return prefixedHash.replace("sha256:", "").slice(0, 16);
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function isStructuredDataScriptType(type) {
  if (typeof type !== "string") return false;
  const normalized = type.trim().toLowerCase().split(";", 1)[0];
  return normalized === "application/ld+json" || normalized === "application/json";
}
