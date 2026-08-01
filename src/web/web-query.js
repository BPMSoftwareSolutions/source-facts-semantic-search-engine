import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function executesWebRelationalQuery(index, commandText) {
  if (commandText.length === 0) {
    throw new Error("query is required.");
  }
  const modulePaths = [
    "dist/composition-root/starts-query-engine.js",
    "composition-root/starts-query-engine.js",
  ];
  const startsQueryEngine = await importStartsQueryEngine(modulePaths);
  const { engine } = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
  const request = Object.freeze({
    requestType: "executes-relational-query-request.v1",
    requestId: "web-surface-semantic-query",
    payload: Object.freeze({
      commandText,
      sources: Object.freeze({
        htmlDocuments: index.htmlDocuments,
        htmlElements: index.htmlElements,
        cssStylesheets: index.cssStylesheets,
        cssRules: index.cssRules,
        cssDeclarations: index.cssDeclarations,
        webRelationships: index.webRelationships,
        assets: index.assets,
        webFamilies: index.webFamilies,
        jsxElements: index.jsxElements ?? [],
        webpageClassifications: index.webpageClassifications ?? [],
        sourceReferences: index.sourceReferences,
        diagnostics: index.diagnostics,
      }),
    }),
  });
  return await engine.invoke(request);
}

async function importStartsQueryEngine(candidatePaths) {
  const require = createRequire(import.meta.url);
  const packageRoots = deduceSejPackageRoots(require);
  for (const candidate of candidatePaths) {
    for (const packageRoot of packageRoots) {
      try {
        const moduleUrl = pathToFileURL(path.join(packageRoot, candidate));
        const module = await import(moduleUrl);
        if (typeof module.startsQueryEngine === "function") return module.startsQueryEngine;
      } catch {
        // continue trying fallback module paths
      }
    }
  }
  throw new Error("Unable to import SEJ starts-query-engine module.");
}

function deduceSejPackageRoots(require) {
  const roots = new Set();
  const cwd = path.resolve(process.cwd());
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  roots.add(path.join(cwd, "node_modules", "@deterministic-solutions", "sej-runtime-query"));
  roots.add(path.join(path.dirname(cwd), "node_modules", "@deterministic-solutions", "sej-runtime-query"));
  roots.add(path.join(path.dirname(path.dirname(scriptDir)), "node_modules", "@deterministic-solutions", "sej-runtime-query"));
  try {
    const exported = require.resolve("@deterministic-solutions/sej-runtime-query");
    const candidateRoot = path.dirname(path.dirname(path.dirname(exported)));
    roots.add(candidateRoot);
  } catch {
    // best-effort fallback: if export map blocks resolution, use guessed node_modules paths above
  }
  return [...roots];
}
