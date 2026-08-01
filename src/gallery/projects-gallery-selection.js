import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export async function projectsGallerySelection({ requestId, queryResult, index, resolutionContext, readsFileText = (absolutePath) => readFile(absolutePath, "utf8") }) {
  const value = queryResult.result.value;
  const documentByIdentity = new Map(index.htmlDocuments.map((document) => [`${document.documentId}\0${document.pathId}`, document]));

  const items = [];
  for (let ordinal = 0; ordinal < value.rows.length; ordinal++) {
    const row = value.rows[ordinal];
    items.push(await evaluatesRow(ordinal, row, documentByIdentity, resolutionContext, readsFileText));
  }

  const selectedCount = items.filter((item) => item.disposition === "selected").length;
  const rejectedCount = items.length - selectedCount;
  if (selectedCount + rejectedCount !== items.length || items.length !== value.rows.length) {
    throw new Error("Gallery selection row-count invariant failed.");
  }
  const queryEnvelope = Object.freeze({ commandText: value.commandText, columns: Object.freeze([...value.columns]), rowCount: value.rows.length });
  const selectionId = `sha256:${sha256(JSON.stringify({ requestId, queryEnvelope, items }))}`;

  return Object.freeze({
    selectionType: "gallery-selection.v1",
    selectionId,
    requestId,
    queryEnvelope,
    items: Object.freeze(items),
    selectedCount,
    rejectedCount,
  });
}

async function evaluatesRow(ordinal, row, documentByIdentity, resolutionContext, readsFileText) {
  const rowIdentity = Object.freeze({
    documentId: row.documentId ?? null,
    pathId: row.pathId ?? null,
    rootId: row.rootId ?? null,
    relativePath: row.relativePath ?? null,
  });

  if (typeof rowIdentity.documentId !== "string" || typeof rowIdentity.pathId !== "string") {
    return buildsItem(ordinal, rowIdentity, "rejected-missing-identity", "row is missing a documentId/pathId identity pair", []);
  }
  const document = documentByIdentity.get(`${rowIdentity.documentId}\0${rowIdentity.pathId}`);
  if (document === undefined) {
    return buildsItem(ordinal, rowIdentity, "rejected-missing-identity", "documentId/pathId do not resolve to a known htmlDocuments entry", []);
  }

  const absolutePath = resolutionContext.absolutePathByPathId.get(document.pathId);
  if (absolutePath === undefined) {
    return buildsItem(ordinal, rowIdentity, "rejected-missing-identity", "pathId has no resolvable absolute path in the current inventory", [document.sourceReferenceId]);
  }

  let currentText;
  try {
    currentText = await readsFileText(absolutePath);
  } catch (error) {
    return buildsItem(ordinal, rowIdentity, "rejected-stale-source", `entry file is no longer readable: ${error.message}`, [document.sourceReferenceId]);
  }
  const currentHash = `sha256:${sha256(currentText)}`;
  if (currentHash !== document.contentHash) {
    return buildsItem(ordinal, rowIdentity, "rejected-stale-source", "entry file content has changed since the index was projected", [document.sourceReferenceId]);
  }

  return buildsItem(ordinal, rowIdentity, "selected", null, [document.sourceReferenceId]);
}

function buildsItem(ordinal, rowIdentity, disposition, reason, sourceReferenceIds) {
  const itemId = `sha256:${sha256(JSON.stringify({ ordinal, rowIdentity }))}`;
  return Object.freeze({
    itemId,
    ordinal,
    rowIdentity,
    sourceReferenceIds: Object.freeze([...sourceReferenceIds]),
    disposition,
    reason,
  });
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
