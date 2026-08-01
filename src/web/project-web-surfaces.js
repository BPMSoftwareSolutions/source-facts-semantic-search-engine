import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { projectsWebSurfaceInventory } from "./inventory.js";
import { projectsHtmlDocument } from "./html-projector.js";
import { projectsCssStylesheet } from "./css-projector.js";
import { buildsResolutionContext, resolvesReferenceToRelationship } from "./relationship-resolver.js";
import { projectsWebArtifactFamilies } from "./family-projector.js";

const assetEdgeKinds = Object.freeze(new Set(["html-image-src", "html-source-srcset", "css-url"]));

export async function projectsWebSurfaceIndex({ policy, inventory: providedInventory }) {
  const inventory = providedInventory ?? await projectsWebSurfaceInventory({ policy });
  const resolutionContext = buildsResolutionContext({ inventory });

  const htmlDocuments = [];
  const htmlElements = [];
  const cssStylesheets = [];
  const cssRules = [];
  const cssDeclarations = [];
  const webRelationships = [];
  const sourceReferences = [];
  const diagnostics = [];
  const edgesByFromPathId = new Map();
  const inlineContentBySyntheticPathId = new Map();
  const entryPathIdsByRelativePath = new Map();

  const htmlEntries = inventory.entries.filter((entry) => entry.disposition === "admitted-entry-candidate");
  const cssEntries = inventory.entries.filter((entry) => entry.disposition === "admitted-related-candidate" && entry.extension === ".css");

  for (const entry of htmlEntries) {
    const absolutePath = resolutionContext.absolutePathByPathId.get(entry.pathId);
    const text = await readFile(absolutePath, "utf8");
    const projected = projectsHtmlDocument({
      pathId: entry.pathId,
      rootId: entry.rootId,
      relativePath: entry.relativePath,
      contentHash: entry.contentHash,
      text,
    });
    htmlDocuments.push(projected.document);
    htmlElements.push(...projected.elements);
    sourceReferences.push(...projected.sourceReferences);
    diagnostics.push(...projected.diagnostics);
    entryPathIdsByRelativePath.set(entry.pathId, entry);

    const fromAbsoluteDirectory = path.dirname(absolutePath);
    const relationships = projected.rawReferences.map((rawReference) => resolvesReferenceToRelationship({
      rawReference,
      fromPathId: entry.pathId,
      fromAbsoluteDirectory,
      context: resolutionContext,
    }));
    webRelationships.push(...relationships);
    edgesByFromPathId.set(entry.pathId, relationships);

    for (const inlineStyle of projected.inlineStyles) {
      inlineContentBySyntheticPathId.set(inlineStyle.syntheticPathId, {
        text: inlineStyle.text,
        hostAbsoluteDirectory: fromAbsoluteDirectory,
        hostRelativePath: entry.relativePath,
        role: "stylesheet",
      });
      const inlineCss = projectsCssStylesheet({
        stylesheetId: inlineStyle.syntheticPathId,
        origin: "inline",
        hostDocumentId: projected.document.documentId,
        contentHash: `sha256:${sha256(inlineStyle.text)}`,
        modulePath: entry.relativePath,
        text: inlineStyle.text,
        hostText: text,
        baseOffset: { start: inlineStyle.start, line: inlineStyle.line, column: inlineStyle.column },
      });
      cssStylesheets.push(inlineCss.stylesheet);
      cssRules.push(...inlineCss.rules);
      cssDeclarations.push(...inlineCss.declarations);
      sourceReferences.push(...inlineCss.sourceReferences);
      diagnostics.push(...inlineCss.diagnostics);
      const inlineRelationships = inlineCss.rawReferences.map((rawReference) => resolvesReferenceToRelationship({
        rawReference,
        fromPathId: inlineStyle.syntheticPathId,
        fromAbsoluteDirectory,
        context: resolutionContext,
      }));
      webRelationships.push(...inlineRelationships);
      edgesByFromPathId.set(inlineStyle.syntheticPathId, inlineRelationships);
    }

    for (const inlineScript of projected.inlineScripts) {
      inlineContentBySyntheticPathId.set(inlineScript.syntheticPathId, {
        text: inlineScript.text,
        hostAbsoluteDirectory: fromAbsoluteDirectory,
        hostRelativePath: entry.relativePath,
        role: "script",
      });
    }
  }

  for (const entry of cssEntries) {
    const absolutePath = resolutionContext.absolutePathByPathId.get(entry.pathId);
    const text = await readFile(absolutePath, "utf8");
    const projected = projectsCssStylesheet({
      stylesheetId: entry.pathId,
      origin: "file",
      pathId: entry.pathId,
      relativePath: entry.relativePath,
      contentHash: entry.contentHash,
      modulePath: entry.relativePath,
      text,
    });
    cssStylesheets.push(projected.stylesheet);
    cssRules.push(...projected.rules);
    cssDeclarations.push(...projected.declarations);
    sourceReferences.push(...projected.sourceReferences);
    diagnostics.push(...projected.diagnostics);

    const fromAbsoluteDirectory = path.dirname(absolutePath);
    const relationships = projected.rawReferences.map((rawReference) => resolvesReferenceToRelationship({
      rawReference,
      fromPathId: entry.pathId,
      fromAbsoluteDirectory,
      context: resolutionContext,
    }));
    webRelationships.push(...relationships);
    edgesByFromPathId.set(entry.pathId, relationships);
  }

  const familyResult = await projectsWebArtifactFamilies({
    entries: htmlEntries,
    edgesByFromPathId,
    resolutionContext,
    absolutePathByPathId: resolutionContext.absolutePathByPathId,
    inlineContentBySyntheticPathId,
    readsFileText: (absolutePath) => readFile(absolutePath, "utf8"),
    expansionLimits: policy.expansion,
    policyHash: inventory.policyHash,
  });
  webRelationships.push(...familyResult.discoveredRelationships);

  const relativePathByPathId = new Map(inventory.entries.map((entry) => [entry.pathId, entry.relativePath]));
  const contentHashByPathId = new Map(inventory.entries.map((entry) => [entry.pathId, entry.contentHash ?? null]));
  const assets = webRelationships
    .filter((relationship) => assetEdgeKinds.has(relationship.edgeKind))
    .map((relationship) => Object.freeze({
      assetId: sha256(`asset\0${relationship.relationshipId}`),
      pathId: relationship.resolvedPathId,
      relativePath: relationship.resolvedPathId !== null ? relativePathByPathId.get(relationship.resolvedPathId) ?? null : null,
      candidateTarget: relationship.candidateTarget,
      resolutionDisposition: relationship.resolutionDisposition,
      contentHash: relationship.resolvedPathId !== null ? contentHashByPathId.get(relationship.resolvedPathId) ?? null : null,
      referencedByRelationshipId: relationship.relationshipId,
    }));

  const indexType = "web-surface-index.v1";
  const indexId = `sha256:${sha256([
    inventory.policyHash,
    htmlDocuments.map((document) => document.documentId).sort().join(","),
    webRelationships.map((relationship) => relationship.relationshipId).sort().join(","),
    familyResult.families.map((family) => `${family.familyId}:${family.familyRootHash}`).sort().join(","),
  ].join("\0"))}`;

  return Object.freeze({
    indexType,
    indexId,
    manifest: Object.freeze({
      schemaVersion: "1.0.0",
      engine: "source-facts-semantic-search-engine",
      engineVersion: "0.1.0",
      policyHash: inventory.policyHash,
    }),
    roots: Object.freeze(inventory.roots.map((root) => Object.freeze({ ...root }))),
    htmlDocuments: Object.freeze(htmlDocuments),
    htmlElements: Object.freeze(htmlElements),
    cssStylesheets: Object.freeze(cssStylesheets),
    cssRules: Object.freeze(cssRules),
    cssDeclarations: Object.freeze(cssDeclarations),
    webRelationships: Object.freeze(webRelationships),
    assets: Object.freeze(assets),
    webFamilies: familyResult.families,
    sourceReferences: Object.freeze(sourceReferences),
    diagnostics: Object.freeze(diagnostics),
    coverage: Object.freeze({
      htmlDocuments: htmlDocuments.length,
      htmlElements: htmlElements.length,
      cssStylesheets: cssStylesheets.length,
      cssRules: cssRules.length,
      cssDeclarations: cssDeclarations.length,
      webRelationships: webRelationships.length,
      assets: assets.length,
      webFamilies: familyResult.families.length,
      diagnostics: diagnostics.length,
    }),
  });
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
