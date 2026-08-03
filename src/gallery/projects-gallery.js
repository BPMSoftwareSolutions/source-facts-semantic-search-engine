import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runsSavedGalleryQuery } from "./resolves-saved-gallery-query.js";
import { projectsGallerySelection } from "./projects-gallery-selection.js";
import { plansSurfacePreviews } from "./plans-surface-previews.js";
import { materializesStaticPreviews, requiresOutsideSourceRoots } from "./materializes-static-preview.js";
import { projectsGalleryManifest } from "./projects-gallery-manifest.js";
import { projectsGalleryHost } from "./projects-gallery-host.js";
import { buildsResolutionContext } from "../web/relationship-resolver.js";
import {
  validatesEnterpriseGalleryManifest,
  validatesGalleryProjectionReceipt,
  validatesGalleryProjectionRequest,
  validatesGalleryProjector,
  validatesGallerySelection,
  validatesSurfacePreviewPlan,
  validatesSurfacePreviewPolicy,
} from "./validates-gallery-artifacts.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const defaultPoliciesDirectory = path.join(repoRoot, "contracts", "gallery-policies");
const defaultProjectorsDirectory = path.join(repoRoot, "contracts", "gallery-projectors");

export const galleryArtifactNames = Object.freeze({
  selection: "gallery-selection.json",
  plan: "surface-preview-plan.json",
  manifest: "enterprise-gallery-manifest.json",
  policy: "surface-preview-policy.json",
  host: "gallery-host.html",
  projectionReceipt: "gallery-projection-receipt.json",
});

export async function resolvesGalleryPreviewPolicy(policyReference = "static-no-script.v1", options = {}) {
  const declaration = await resolvesDeclaration({
    reference: policyReference,
    directory: options.policiesDirectory ?? defaultPoliciesDirectory,
    suffix: ".policy.v1.json",
    idProperty: "policyId",
  });
  await validatesSurfacePreviewPolicy(declaration);
  return declaration;
}

export async function resolvesGalleryProjector(projectorId, options = {}) {
  const declaration = await resolvesDeclaration({
    reference: projectorId,
    directory: options.projectorsDirectory ?? defaultProjectorsDirectory,
    suffix: ".projection.v1.json",
    idProperty: "projectorId",
  });
  await validatesGalleryProjector(declaration);
  return declaration;
}

export async function plansGalleryProjection({
  index,
  inventory,
  queryId,
  previewPolicyId = "static-no-script.v1",
  outputDirectory,
  writeMode = "overwrite",
  galleryQueriesDirectory,
  policiesDirectory,
  projectorsDirectory,
}) {
  validatesIndexInventoryBinding(index, inventory);
  const resolutionContext = buildsResolutionContext({ inventory });
  await requiresOutsideSourceRoots(outputDirectory, resolutionContext.rootAbsolutePaths);

  const { declaration: queryDeclaration, queryResult } = await runsSavedGalleryQuery(queryId, index, {
    ...(galleryQueriesDirectory === undefined ? {} : { galleryQueriesDirectory }),
  });
  const previewPolicy = await resolvesGalleryPreviewPolicy(previewPolicyId, { policiesDirectory });
  const projectorId = queryDeclaration.allowedProjectorIds[0];
  const projectorDeclaration = await resolvesGalleryProjector(projectorId, { projectorsDirectory });
  validatesQueryProjectorBinding(queryDeclaration, queryResult, projectorDeclaration);
  const projectorAuthorityHash = await calculatesProjectorAuthorityHash();
  if (projectorDeclaration.projectorDigest !== projectorAuthorityHash) {
    throw new Error(`Projector authority digest mismatch for '${projectorDeclaration.projectorId}'.`);
  }

  const requestInput = {
    inventoryId: inventory.inventoryId,
    webSurfaceIndexId: index.indexId,
    savedQueryId: queryId,
    queryText: queryDeclaration.commandText,
    queryHash: hashText(queryDeclaration.commandText),
    projectorId: projectorDeclaration.projectorId,
    projectorAuthorityHash,
    previewPolicyId: previewPolicy.policyId,
    previewPolicyHash: hashText(canonicalizesJson(previewPolicy)),
    sortColumns: [],
    limit: null,
    emptyResultPosture: "empty-manifest",
    outputDirectory: path.resolve(outputDirectory),
    writeMode,
    redactionProfile: "none",
  };
  const request = Object.freeze({
    requestType: "gallery-projection-request.v1",
    requestId: hashText(canonicalizesJson(requestInput)),
    ...requestInput,
  });
  await validatesGalleryProjectionRequest(request);

  const selection = await projectsGallerySelection({ requestId: request.requestId, queryResult, index, resolutionContext });
  validatesSelectionInvariant(selection);
  await validatesGallerySelection(selection);

  const plan = await plansSurfacePreviews({
    selectionId: selection.selectionId,
    selection,
    previewPolicyId: previewPolicy.policyId,
    index,
    resolutionContext,
  });
  await validatesSurfacePreviewPlan(plan);

  return Object.freeze({ request, selection, plan, resolutionContext, previewPolicy, projectorDeclaration });
}

export async function projectsGallery({
  index,
  inventory,
  queryId,
  previewPolicyId = "static-no-script.v1",
  outputDirectory,
  writeMode = "overwrite",
  materialize = true,
  ...options
}) {
  const projectionPlan = await plansGalleryProjection({
    index,
    inventory,
    queryId,
    previewPolicyId,
    outputDirectory,
    writeMode,
    ...options,
  });

  let materialized = { emittedFiles: [], transformationsByItem: [] };
  if (materialize) {
    materialized = await materializesStaticPreviews({
      plan: projectionPlan.plan,
      resolutionContext: projectionPlan.resolutionContext,
      sourceRootAbsolutePaths: projectionPlan.resolutionContext.rootAbsolutePaths,
      outputDirectory,
      previewPolicy: projectionPlan.previewPolicy,
    });
  }

  const manifest = projectsGalleryManifest({
    requestId: projectionPlan.request.requestId,
    selection: projectionPlan.selection,
    plan: projectionPlan.plan,
    index,
  });
  await validatesEnterpriseGalleryManifest(manifest);
  const host = projectsGalleryHost({ manifest });

  return Object.freeze({
    ...projectionPlan,
    manifest,
    host,
    emittedFiles: materialized.emittedFiles,
    transformationsByItem: materialized.transformationsByItem,
  });
}

export async function writesGalleryPlan({ outputDirectory, ...options }) {
  const projected = await plansGalleryProjection({ outputDirectory, ...options });
  await preparesOutputDirectory(outputDirectory, projected.request.writeMode, [galleryArtifactNames.selection, galleryArtifactNames.plan]);
  const emittedFiles = [];
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.selection, serializesJson(projected.selection)));
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.plan, serializesJson(projected.plan)));
  return Object.freeze({ ...projected, emittedFiles: Object.freeze(emittedFiles) });
}

export async function writesGalleryProjection({ outputDirectory, ...options }) {
  const knownArtifacts = [
    galleryArtifactNames.selection,
    galleryArtifactNames.plan,
    galleryArtifactNames.manifest,
    galleryArtifactNames.policy,
    galleryArtifactNames.host,
    galleryArtifactNames.projectionReceipt,
    "previews",
  ];
  if ((options.writeMode ?? "overwrite") === "fail-if-exists") {
    await rejectsExistingArtifacts(outputDirectory, knownArtifacts);
  }
  const projected = await projectsGallery({ outputDirectory, ...options });
  await preparesOutputDirectory(outputDirectory, "overwrite", knownArtifacts);

  const emittedFiles = [...projected.emittedFiles];
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.selection, serializesJson(projected.selection)));
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.plan, serializesJson(projected.plan)));
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.manifest, serializesJson(projected.manifest)));
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.policy, serializesJson(projected.previewPolicy)));
  emittedFiles.push(await writesArtifact(outputDirectory, galleryArtifactNames.host, projected.host));
  emittedFiles.sort((left, right) => left.path.localeCompare(right.path));

  const receipt = buildsGalleryProjectionReceipt({ projected, emittedFiles });
  await validatesGalleryProjectionReceipt(receipt);
  const receiptFile = await writesArtifact(outputDirectory, galleryArtifactNames.projectionReceipt, serializesJson(receipt));

  return Object.freeze({
    ...projected,
    receipt,
    emittedFiles: Object.freeze([...emittedFiles, receiptFile]),
  });
}

export function buildsGalleryProjectionReceipt({ projected, emittedFiles }) {
  validatesSelectionInvariant(projected.selection);
  const deterministicInput = Object.freeze({
    requestId: projected.request.requestId,
    selectionId: projected.selection.selectionId,
    planId: projected.plan.planId,
    manifestId: projected.manifest.manifestId,
    projectorId: projected.request.projectorId,
    emittedFiles,
  });
  const deterministicHash = hashText(canonicalizesJson(deterministicInput));
  const receiptBody = {
    receiptType: "gallery-projection-receipt.v1",
    requestId: projected.request.requestId,
    selectionId: projected.selection.selectionId,
    planId: projected.plan.planId,
    manifestId: projected.manifest.manifestId,
    projectorId: projected.request.projectorId,
    emittedFiles: Object.freeze(emittedFiles.map((file) => Object.freeze({ ...file }))),
    rowCounts: Object.freeze({
      input: projected.selection.queryEnvelope.rowCount,
      selected: projected.selection.selectedCount,
      rejected: projected.selection.rejectedCount,
    }),
    redactions: Object.freeze([]),
    writeDisposition: "written",
    deterministicHash,
  };
  return Object.freeze({
    ...receiptBody,
    receiptId: hashText(canonicalizesJson(receiptBody)),
  });
}

function validatesIndexInventoryBinding(index, inventory) {
  if (index?.indexType !== "web-surface-index.v1") throw new Error("Gallery projection requires a web-surface-index.v1 input.");
  if (inventory?.indexType !== "web-surface-inventory.v1") throw new Error("Gallery projection requires a web-surface-inventory.v1 input.");
  if (index.manifest?.policyHash !== inventory.policyHash) throw new Error("The web surface index and inventory policy hashes do not match.");
  const indexRoots = new Map(index.roots.map((root) => [root.rootId, path.resolve(root.path)]));
  for (const root of inventory.roots) {
    if (indexRoots.get(root.rootId) !== path.resolve(root.path)) {
      throw new Error(`The web surface index and inventory root '${root.rootId}' do not match.`);
    }
  }
}

function validatesQueryProjectorBinding(queryDeclaration, queryResult, projectorDeclaration) {
  if (!queryDeclaration.allowedProjectorIds.includes(projectorDeclaration.projectorId)) {
    throw new Error(`Projector '${projectorDeclaration.projectorId}' is not allowed by saved query '${queryDeclaration.queryId}'.`);
  }
  if (projectorDeclaration.implementationStatus !== "materialized") {
    throw new Error(`Projector '${projectorDeclaration.projectorId}' is declared but not materialized.`);
  }
  const resultColumns = new Set(queryResult.result.value.columns);
  const missingColumns = [...new Set([...queryDeclaration.requiredColumns, ...projectorDeclaration.requiredColumns])]
    .filter((column) => !resultColumns.has(column));
  if (missingColumns.length > 0) throw new Error(`Gallery query result is missing required column(s): ${missingColumns.join(", ")}`);
}

function validatesSelectionInvariant(selection) {
  if (selection.selectedCount + selection.rejectedCount !== selection.items.length
    || selection.items.length !== selection.queryEnvelope.rowCount) {
    throw new Error("Gallery selection row-count invariant failed.");
  }
}

async function resolvesDeclaration({ reference, directory, suffix, idProperty }) {
  if (typeof reference !== "string" || reference.length === 0) throw new Error("A gallery declaration reference is required.");
  const explicitPath = path.resolve(reference);
  if (reference.endsWith(".json") && await exists(explicitPath)) {
    return JSON.parse(stripsByteOrderMark(await readFile(explicitPath, "utf8")));
  }
  const entries = (await readdir(directory)).filter((entry) => entry.endsWith(suffix)).sort();
  for (const entry of entries) {
    const declaration = JSON.parse(stripsByteOrderMark(await readFile(path.join(directory, entry), "utf8")));
    if (declaration[idProperty] === reference) return declaration;
  }
  throw new Error(`Unknown gallery declaration: ${reference}`);
}

async function calculatesProjectorAuthorityHash() {
  const sourcePaths = [
    fileURLToPath(new URL("./projects-gallery-manifest.js", import.meta.url)),
    fileURLToPath(new URL("./projects-gallery-host.js", import.meta.url)),
  ];
  const source = (await Promise.all(sourcePaths.map((sourcePath) => readFile(sourcePath, "utf8")))).join("\0");
  return hashText(source);
}

async function preparesOutputDirectory(outputDirectory, writeMode, knownFiles) {
  const outputRoot = path.resolve(outputDirectory);
  if (writeMode === "fail-if-exists") await rejectsExistingArtifacts(outputRoot, knownFiles);
  await mkdir(outputRoot, { recursive: true });
}

async function rejectsExistingArtifacts(outputDirectory, knownFiles) {
  const outputRoot = path.resolve(outputDirectory);
  const conflicts = [];
  for (const file of knownFiles) if (await exists(path.join(outputRoot, file))) conflicts.push(file);
  if (conflicts.length > 0) throw new Error(`Gallery output already exists: ${conflicts.join(", ")}`);
}

async function writesArtifact(outputDirectory, relativePath, content) {
  const absolutePath = path.join(path.resolve(outputDirectory), relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
  return Object.freeze({ path: relativePath.replaceAll("\\", "/"), contentHash: hashBytes(content) });
}

async function exists(candidatePath) {
  try {
    await access(candidatePath);
    return true;
  } catch {
    return false;
  }
}

function serializesJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function stripsByteOrderMark(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function hashText(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function hashBytes(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function canonicalizesJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalizesJson).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizesJson(value[key])}`).join(",")}}`;
}
