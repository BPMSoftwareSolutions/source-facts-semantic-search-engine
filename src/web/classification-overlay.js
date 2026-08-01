import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SemanticKernel } from "@deterministic-solutions/semantic-kernel";

const decisionRelativePaths = Object.freeze([
  "semantic-authority/decisions/webpage-dimension.decision.sej.v1.json",
  "semantic-authority/decisions/webpage-classification.decision.sej.v1.json",
]);
const heuristicPackRelativePaths = Object.freeze([
  "heuristic-packs/page-type/page-type.heuristics.sej.v1.json",
]);
const lexiconRelativePath = "heuristic-packs/lexicon/signal-lexicon.sej.v1.json";
const taxonomyRelativePath = "taxonomy-packs/page-types/default-page-type.taxonomy.v1.json";
const classificationPolicy = Object.freeze({
  minimumSupportScore: 0.6,
  allowPartialProfile: true,
  requestedDimensions: ["page-type"],
});

let cachedRuntime;

export async function classifiesHtmlDocument({ document, elements }) {
  const runtime = await loadsClassificationRuntime();
  const facts = translatesToObservedWebpageFacts(document, elements);
  const finalUrl = `https://pilot.local/${synthesizesUrlPath(document.relativePath)}`;
  const { signals } = runtime.buildsWebpageIndexes(facts, runtime.lexicon, finalUrl);
  const findings = runtime.evaluatesHeuristicPacks(runtime.kernel, runtime.heuristicPacks, signals);
  const classification = runtime.resolvesDimensionClassification(runtime.kernel, "page-type", findings, classificationPolicy);

  const evidenceReferences = classification.evidenceReferences.filter((reference) => typeof reference === "string" && reference.length > 0);
  return Object.freeze({
    classificationId: sha256(`${document.documentId}\0page-type`),
    documentId: document.documentId,
    dimension: "page-type",
    taxonomyId: runtime.taxonomy.taxonomyId,
    value: classification.value,
    disposition: classification.disposition,
    supportScore: classification.supportScore,
    evidenceReferences: Object.freeze(evidenceReferences),
    findingReferences: Object.freeze([...classification.findingReferences]),
    alternatives: Object.freeze(classification.alternatives.map((alternative) => Object.freeze({ ...alternative }))),
    sourceReferenceId: document.sourceReferenceId,
  });
}

function translatesToObservedWebpageFacts(document, elements) {
  const mappedElements = elements.map((element) => Object.freeze({
    evidenceId: element.sourceReferenceId,
    kind: mapsElementKind(element),
    tag: element.tag,
    text: element.text ?? "",
    attributes: element.attributes ?? {},
    semanticPath: `${mapsElementKind(element)}/${element.elementId}`,
    locator: { strategy: "byte-source-reference", value: element.sourceReferenceId },
    textHash: element.textHash ?? "sha256:none",
    visibility: "visible",
    sourceSnapshotHash: document.contentHash,
  }));

  const titleElement = elements.find((element) => element.kind === "title");
  const descriptionMeta = elements.find((element) => element.kind === "meta" && (element.attributes.name ?? "").toLowerCase() === "description");
  const visibleText = mappedElements.map((element) => element.text).filter((text) => text.length > 0).join(" ");

  return {
    document: {
      title: document.title ?? "",
      titleEvidenceReference: titleElement?.sourceReferenceId ?? document.sourceReferenceId,
      metaDescription: descriptionMeta?.attributes.content ?? "",
      metaDescriptionEvidenceReference: descriptionMeta?.sourceReferenceId ?? null,
      declaredLanguage: document.lang ?? "",
      canonicalLink: "",
      robots: "",
      charset: "",
      openGraph: {},
      structuredDataTypes: [],
      faviconHref: "",
    },
    elements: mappedElements,
    visibleText,
    requiresRender: false,
    technologyMarkers: [],
  };
}

function synthesizesUrlPath(relativePath) {
  // Static-site routing convention: index.html at a directory root serves that
  // directory's own path, so pathDepth-based heuristics (e.g. "homepage") can
  // fire the same way they would against a deployed site. Files that aren't
  // named index.html keep their literal on-disk path.
  const match = relativePath.match(/^(.*\/)?index\.html?$/iu);
  return match === null ? relativePath : match[1] ?? "";
}

function mapsElementKind(element) {
  if (element.kind === "control" && element.tag === "button") return "button";
  if (element.kind === "control" && element.tag === "input") return "input";
  if (element.kind === "landmark" && element.tag === "nav") return "navigation";
  return element.kind;
}

async function loadsClassificationRuntime() {
  if (cachedRuntime !== undefined) return cachedRuntime;
  const packageRoot = await resolvesWebpageClassificationScannerRoot();

  const { buildsWebpageIndexes } = await import(pathToFileURL(path.join(packageRoot, "dist", "runtime", "index-builder.js")));
  const { evaluatesHeuristicPacks } = await import(pathToFileURL(path.join(packageRoot, "dist", "runtime", "heuristic-evaluator.js")));
  const { resolvesDimensionClassification } = await import(pathToFileURL(path.join(packageRoot, "dist", "runtime", "classification-resolver.js")));

  const decisions = await Promise.all(decisionRelativePaths.map((relativePath) => readsJson(path.join(packageRoot, relativePath))));
  const kernel = new SemanticKernel();
  kernel.registerCapabilityPacks([{ decisions, projections: [] }]);

  const heuristicPacks = await Promise.all(heuristicPackRelativePaths.map((relativePath) => readsJson(path.join(packageRoot, relativePath))));
  const lexicon = await readsJson(path.join(packageRoot, lexiconRelativePath));
  const taxonomy = await readsJson(path.join(packageRoot, taxonomyRelativePath));

  cachedRuntime = { buildsWebpageIndexes, evaluatesHeuristicPacks, resolvesDimensionClassification, kernel, heuristicPacks, lexicon, taxonomy };
  return cachedRuntime;
}

async function resolvesWebpageClassificationScannerRoot() {
  const require = createRequire(import.meta.url);
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(scriptDir, "..", "..", "node_modules", "webpage-classification-scanner"),
    path.join(process.cwd(), "node_modules", "webpage-classification-scanner"),
  ];
  try {
    candidates.push(path.dirname(require.resolve("webpage-classification-scanner/package.json")));
  } catch {
    // fallback candidates above are enough for local workspaces
  }
  for (const candidate of candidates) {
    try {
      await readFile(path.join(candidate, "package.json"), "utf8");
      return candidate;
    } catch {
      // try next candidate
    }
  }
  throw new Error("Unable to locate the webpage-classification-scanner package root.");
}

async function readsJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
