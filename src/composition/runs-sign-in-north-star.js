import path from "node:path";
import { writesJsonFile } from "../lib/writes-json-file.js";
import { capturesBrowserRenders } from "../gallery/captures-browser-render.js";
import { writesGalleryProjection } from "../gallery/projects-gallery.js";
import { servesIsolatedPreviews } from "../gallery/serves-isolated-previews.js";
import { loadsCompositionAuthorities, writesSignInComposition } from "./writes-sign-in-composition.js";

const authorityKindOrder = Object.freeze(["layout", "authentication-entry", "messaging", "theme"]);

export const northStarArtifactNames = Object.freeze({
  authorityChoices: "authority-choices.json",
  report: "north-star-report.json",
  galleryDirectory: "gallery",
  compositionDirectory: "composition",
});

export async function runsSignInNorthStar({
  index,
  inventory,
  requestInput,
  outputDirectory,
  selectionOverrides = {},
  authoritiesDirectory,
  previewPolicyId = "static-no-script.v1",
  prove = false,
}) {
  const outputRoot = path.resolve(outputDirectory);
  const galleryOutputDirectory = path.join(outputRoot, northStarArtifactNames.galleryDirectory);
  const compositionOutputDirectory = path.join(outputRoot, northStarArtifactNames.compositionDirectory);

  const gallery = await writesGalleryProjection({
    index,
    inventory,
    queryId: "sign-in-pages",
    previewPolicyId,
    outputDirectory: galleryOutputDirectory,
    writeMode: "overwrite",
  });

  const authorities = await loadsCompositionAuthorities(authoritiesDirectory);
  const authorityChoices = buildsSignInAuthorityChoices({ authorities, manifest: gallery.manifest });
  await writesJsonFile(path.join(outputRoot, northStarArtifactNames.authorityChoices), authorityChoices, { pretty: true });

  const resolvedRequestInput = appliesSelectionOverrides({ requestInput, authorities, selectionOverrides });
  const composition = await writesSignInComposition({
    requestInput: resolvedRequestInput,
    manifest: gallery.manifest,
    outputDirectory: compositionOutputDirectory,
    ...(authoritiesDirectory === undefined ? {} : { authoritiesDirectory }),
    previewPolicy: gallery.previewPolicy,
  });

  const galleryProof = prove
    ? await provesGallery({ gallery, outputDirectory: galleryOutputDirectory })
    : null;
  const report = buildsNorthStarReport({
    gallery,
    galleryProof,
    composition,
    authorityChoices,
    outputRoot,
  });
  await writesJsonFile(path.join(outputRoot, northStarArtifactNames.report), report, { pretty: true });

  return Object.freeze({
    gallery,
    galleryProof,
    composition,
    authorityChoices,
    report,
    outputRoot,
    galleryOutputDirectory,
    compositionOutputDirectory,
  });
}

export function buildsSignInAuthorityChoices({ authorities, manifest }) {
  const manifestItemBySource = new Map(manifest.items.map((item) => [
    `${item.documentId}\0${item.rootId}\0${normalizesSelector(item.relativePath)}`,
    item,
  ]));
  return Object.freeze({
    catalogType: "sign-in-authority-choices.v1",
    galleryManifestId: manifest.manifestId,
    choices: Object.freeze([...authorities]
      .sort((left, right) => {
        const kindDifference = authorityKindOrder.indexOf(left.authorityKind) - authorityKindOrder.indexOf(right.authorityKind);
        return kindDifference !== 0 ? kindDifference : left.authorityId.localeCompare(right.authorityId);
      })
      .map((authority) => {
        const galleryItem = manifestItemBySource.get(`${authority.source.documentId}\0${authority.source.rootId}\0${normalizesSelector(authority.source.relativePath)}`);
        return Object.freeze({
          authorityKind: authority.authorityKind,
          authorityId: authority.authorityId,
          label: authority.label,
          reviewStatus: authority.reviewStatus,
          evidenceClass: authority.evidenceClass,
          source: Object.freeze({ ...authority.source }),
          galleryItemId: galleryItem?.galleryItemId ?? null,
          previewRoute: galleryItem?.previewRoute ?? null,
          previewDisposition: galleryItem?.previewDisposition ?? null,
          disposition: galleryItem === undefined ? "OUTSIDE_ACTIVE_GALLERY" : "AVAILABLE",
        });
      })),
  });
}

export function appliesSelectionOverrides({ requestInput, authorities, selectionOverrides }) {
  const authorityByKindAndSelector = new Map();
  for (const authority of authorities) {
    for (const selector of [authority.authorityId, authority.source.relativePath]) {
      const key = `${authority.authorityKind}\0${normalizesSelector(selector)}`;
      const matches = authorityByKindAndSelector.get(key) ?? [];
      matches.push(authority);
      authorityByKindAndSelector.set(key, matches);
    }
  }

  const selections = requestInput.selections.map((selection) => {
    const selector = selectionOverrides[selection.authorityKind];
    if (selector === undefined) return Object.freeze({ ...selection });
    const matches = authorityByKindAndSelector.get(`${selection.authorityKind}\0${normalizesSelector(selector)}`) ?? [];
    if (matches.length === 0) {
      const available = authorities
        .filter((authority) => authority.authorityKind === selection.authorityKind)
        .map((authority) => `${authority.authorityId} (${authority.source.relativePath})`)
        .join(", ");
      throw new Error(`No reviewed ${selection.authorityKind} authority matches '${selector}'. Available: ${available || "none"}.`);
    }
    if (matches.length > 1) throw new Error(`Selector '${selector}' is ambiguous for ${selection.authorityKind} authority.`);
    const authority = matches[0];
    return Object.freeze({
      authorityKind: selection.authorityKind,
      authorityId: authority.authorityId,
      rationale: `Selected through the north-star workflow from reviewed source ${authority.source.relativePath}.`,
    });
  });

  const { requestId: _requestId, ...requestWithoutId } = requestInput;
  return Object.freeze({
    ...requestWithoutId,
    selections: Object.freeze(selections),
  });
}

async function provesGallery({ gallery, outputDirectory }) {
  const previewServer = await servesIsolatedPreviews({ outputDirectory, previewPolicy: gallery.previewPolicy });
  try {
    return await capturesBrowserRenders({
      manifest: gallery.manifest,
      plan: gallery.plan,
      outputDirectory,
      baseUrl: previewServer.url,
      previewPolicy: gallery.previewPolicy,
      cspPolicy: previewServer.cspPolicy,
    });
  } finally {
    await previewServer.close();
  }
}

function buildsNorthStarReport({ gallery, galleryProof, composition, authorityChoices, outputRoot }) {
  const selectedAuthorityById = new Map(authorityChoices.choices.map((choice) => [choice.authorityId, choice]));
  const selectedAuthorities = composition.request.selections.map((selection) => {
    const choice = selectedAuthorityById.get(selection.authorityId);
    return Object.freeze({
      authorityKind: selection.authorityKind,
      authorityId: selection.authorityId,
      label: choice?.label ?? null,
      sourceRelativePath: choice?.source.relativePath ?? null,
      rationale: selection.rationale,
    });
  });
  const proofSummary = galleryProof === null ? null : Object.freeze({
    browserAvailable: galleryProof.browserAvailable,
    receiptCount: galleryProof.receipts.length,
    renderedCount: galleryProof.receipts.filter((receipt) => receipt.verdict.startsWith("RENDERED_")).length,
    staticVerifiedCount: galleryProof.receipts.filter((receipt) => receipt.verdict === "RENDERED_STATIC_VERIFIED").length,
    renderedWithLimitationsCount: galleryProof.receipts.filter((receipt) => receipt.verdict === "RENDERED_WITH_LIMITATIONS").length,
    blockedCount: galleryProof.receipts.filter((receipt) => receipt.verdict === "BLOCKED").length,
  });
  const compatible = composition.compatibilityReport.disposition === "COMPATIBLE";
  const proofBlocked = proofSummary?.blockedCount > 0;
  const disposition = !compatible ? "INCOMPATIBLE" : proofBlocked ? "READY_WITH_GALLERY_PROOF_FAILURES" : "READY";
  const galleryDispositionCounts = Object.fromEntries(gallery.plan.items.reduce((counts, item) => {
    counts.set(item.reproductionDisposition, (counts.get(item.reproductionDisposition) ?? 0) + 1);
    return counts;
  }, new Map()));

  const stage = (stageId, stageDisposition, artifact = null, detail = null) => Object.freeze({ stageId, disposition: stageDisposition, artifact, detail });
  return Object.freeze({
    reportType: "sign-in-north-star-report.v1",
    intent: "Show me all sign-in pages.",
    disposition,
    stages: Object.freeze([
      stage("intent-query", "EXECUTED", "gallery/gallery-selection.json", `${gallery.selection.queryEnvelope.rowCount} sign-in surface(s) returned and retained.`),
      stage("executable-enterprise-gallery", "PROJECTED", "gallery/gallery-host.html", JSON.stringify(galleryDispositionCounts)),
      stage("authority-selection", "RESOLVED", northStarArtifactNames.authorityChoices, `${selectedAuthorities.length} reviewed authority selections.`),
      stage("compatibility-report", composition.compatibilityReport.disposition, "composition/compatibility-report.json", `${composition.compatibilityReport.satisfiedCount} satisfied; ${composition.compatibilityReport.failedCount} failed.`),
      stage("candidate-authority-composition", compatible ? "PROJECTED" : "WITHHELD", compatible ? "composition/candidate-composition-contract.json" : null),
      stage("projected-design-document", compatible ? "PROJECTED" : "WITHHELD", compatible ? "composition/projected-design-document.md" : null),
      stage("candidate-ast", compatible ? "PROJECTED" : "WITHHELD", compatible ? "composition/candidate.ast.txt" : null),
      stage("runnable-governed-preview", compatible ? "READY" : "WITHHELD", compatible ? "composition/previews/composed-sign-in/index.html" : null),
    ]),
    gallery: Object.freeze({
      manifestId: gallery.manifest.manifestId,
      rowCount: gallery.selection.queryEnvelope.rowCount,
      selectedCount: gallery.selection.selectedCount,
      rejectedCount: gallery.selection.rejectedCount,
      dispositionCounts: Object.freeze(galleryDispositionCounts),
      proof: proofSummary,
    }),
    selectedAuthorities: Object.freeze(selectedAuthorities),
    compatibility: Object.freeze({
      reportId: composition.compatibilityReport.reportId,
      disposition: composition.compatibilityReport.disposition,
      satisfiedCount: composition.compatibilityReport.satisfiedCount,
      failedCount: composition.compatibilityReport.failedCount,
    }),
    candidate: Object.freeze({
      contractId: composition.contract?.contractId ?? null,
      receiptId: composition.receipt?.receiptId ?? null,
      previewRoute: compatible ? "/preview/composed-sign-in/index.html" : null,
    }),
    serveCommands: Object.freeze({
      gallery: `node src/cli.js web gallery serve --dir "${path.join(outputRoot, northStarArtifactNames.galleryDirectory)}"`,
      candidate: compatible ? `node src/cli.js web gallery serve --dir "${path.join(outputRoot, northStarArtifactNames.compositionDirectory)}"` : null,
    }),
  });
}

function normalizesSelector(value) {
  return String(value).trim().replaceAll("\\", "/").toLowerCase();
}
