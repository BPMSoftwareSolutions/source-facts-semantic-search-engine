import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { executesWebRelationalQuery } from "../web/web-query.js";
import { validatesGalleryQuery } from "./validates-gallery-artifacts.js";

const defaultGalleryQueriesDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "gallery-queries");

export async function resolvesSavedGalleryQuery(queryId, { galleryQueriesDirectory = defaultGalleryQueriesDirectory } = {}) {
  const entries = await readdir(galleryQueriesDirectory);
  for (const entry of entries) {
    if (!entry.endsWith(".query.v1.json")) continue;
    const declaration = JSON.parse(await readFile(path.join(galleryQueriesDirectory, entry), "utf8"));
    if (declaration.queryId === queryId) {
      await validatesGalleryQuery(declaration);
      return declaration;
    }
  }
  throw new Error(`Unknown gallery query: ${queryId}`);
}

export async function runsSavedGalleryQuery(queryId, index, options = {}) {
  const declaration = await resolvesSavedGalleryQuery(queryId, options);
  const queryResult = await executesWebRelationalQuery(index, declaration.commandText);
  if (queryResult.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new Error(`Saved gallery query '${queryId}' failed to execute: ${queryResult.disposition}`);
  }
  return { declaration, queryResult };
}
