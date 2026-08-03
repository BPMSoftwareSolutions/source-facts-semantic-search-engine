import { loadsQueryEngineStartResult } from "../query-engine-loader.js";

export async function executesWebRelationalQuery(index, commandText) {
  if (commandText.length === 0) {
    throw new Error("query is required.");
  }

  const { engine } = await loadsQueryEngineStartResult();
  const availableSources = {
    htmlDocuments: index.htmlDocuments ?? [],
    htmlElements: index.htmlElements ?? [],
    cssStylesheets: index.cssStylesheets ?? [],
    cssRules: index.cssRules ?? [],
    cssDeclarations: index.cssDeclarations ?? [],
    webRelationships: index.webRelationships ?? [],
    assets: index.assets ?? [],
    webFamilies: index.webFamilies ?? [],
    jsxElements: index.jsxElements ?? [],
    webpageClassifications: index.webpageClassifications ?? [],
    sourceReferences: index.sourceReferences ?? [],
    diagnostics: index.diagnostics ?? [],
  };
  const selectedSourceNames = deducesWebQuerySourceNames(commandText);
  const sources = Object.fromEntries(selectedSourceNames.map((sourceName) => [sourceName, availableSources[sourceName]]));
  const request = Object.freeze({
    requestType: "executes-relational-query-request.v1",
    requestId: "web-surface-semantic-query",
    payload: Object.freeze({
      commandText,
      sources: Object.freeze(sources),
    }),
  });
  return await engine.invoke(request);
}

export function deducesWebQuerySourceNames(commandText) {
  const sourceNames = [
    "htmlDocuments",
    "htmlElements",
    "cssStylesheets",
    "cssRules",
    "cssDeclarations",
    "webRelationships",
    "assets",
    "webFamilies",
    "jsxElements",
    "webpageClassifications",
    "sourceReferences",
    "diagnostics",
  ];
  const selected = sourceNames.filter((sourceName) => new RegExp(`\\b${sourceName}\\b`, "iu").test(commandText));
  if (selected.length === 0) throw new Error("query must reference at least one registered web source collection.");
  return Object.freeze(selected);
}
