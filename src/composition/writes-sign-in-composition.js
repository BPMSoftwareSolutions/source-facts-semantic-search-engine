import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validatesEnterpriseGalleryManifest, validatesSurfacePreviewPolicy } from "../gallery/validates-gallery-artifacts.js";
import { resolvesGalleryPreviewPolicy } from "../gallery/projects-gallery.js";
import {
  buildsSignInCompositionRequest,
  canonicalizesJson,
  evaluatesSignInCompositionCompatibility,
  hashText,
  projectsCompositionHost,
  projectsSignInCandidateAst,
  projectsSignInCompositionContract,
  projectsSignInDesignDocument,
  projectsSignInPreview,
} from "./projects-sign-in-composition.js";
import {
  validatesCompositionAuthority,
  validatesCompositionCompatibilityReport,
  validatesCompositionProjectionReceipt,
  validatesSignInCompositionContract,
  validatesSignInCompositionRequest,
} from "./validates-composition-artifacts.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const defaultAuthoritiesDirectory = path.join(repositoryRoot, "contracts", "composition-authorities");

export const compositionArtifactNames = Object.freeze({
  request: "composition-request.json",
  compatibilityReport: "compatibility-report.json",
  contract: "candidate-composition-contract.json",
  designDocument: "projected-design-document.md",
  candidateAst: "candidate.ast.txt",
  preview: "previews/composed-sign-in/index.html",
  host: "gallery-host.html",
  policy: "surface-preview-policy.json",
  receipt: "composition-projection-receipt.json",
});

export async function writesSignInComposition({
  requestInput,
  manifest,
  outputDirectory,
  authoritiesDirectory = defaultAuthoritiesDirectory,
  previewPolicy,
}) {
  await validatesSignInCompositionRequest(requestInput);
  await validatesEnterpriseGalleryManifest(manifest);
  const activePreviewPolicy = previewPolicy ?? await resolvesGalleryPreviewPolicy(requestInput.previewPolicyId);
  await validatesSurfacePreviewPolicy(activePreviewPolicy);
  const request = buildsSignInCompositionRequest(requestInput, manifest.manifestId);
  await validatesSignInCompositionRequest(request);
  const authorities = await loadsCompositionAuthorities(authoritiesDirectory);
  const compatibilityReport = evaluatesSignInCompositionCompatibility({ request, authorities, manifest });
  await validatesCompositionCompatibilityReport(compatibilityReport);

  const outputRoot = path.resolve(outputDirectory);
  await clearsManagedCompositionArtifacts(outputRoot);
  await mkdir(outputRoot, { recursive: true });
  const emittedFiles = [];
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.request, serializesJson(request)));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.compatibilityReport, serializesJson(compatibilityReport)));

  if (compatibilityReport.disposition !== "COMPATIBLE") {
    return Object.freeze({ request, compatibilityReport, contract: null, receipt: null, emittedFiles: Object.freeze(emittedFiles) });
  }

  const contract = projectsSignInCompositionContract({ request, authorities, compatibilityReport });
  await validatesSignInCompositionContract(contract);
  const designDocument = projectsSignInDesignDocument({ contract, compatibilityReport });
  const candidateAst = projectsSignInCandidateAst({ contract });
  const preview = projectsSignInPreview({ contract });
  const host = projectsCompositionHost({ contract, compatibilityReport });

  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.contract, serializesJson(contract)));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.designDocument, designDocument));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.candidateAst, candidateAst));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.preview, preview));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.host, host));
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.policy, serializesJson(activePreviewPolicy)));

  const projectorAuthorityHash = await calculatesProjectorAuthorityHash();

  const deterministicHash = hashText(canonicalizesJson({
    requestId: request.requestId,
    compatibilityReportId: compatibilityReport.reportId,
    contractId: contract.contractId,
    projectorAuthorityHash,
    emittedFiles,
  }));
  const receiptBody = Object.freeze({
    receiptType: "composition-projection-receipt.v1",
    requestId: request.requestId,
    compatibilityReportId: compatibilityReport.reportId,
    contractId: contract.contractId,
    projectorId: "sign-in-composition.v1",
    projectorAuthorityHash,
    previewPolicyId: activePreviewPolicy.policyId,
    projectionLevel: "constructive-composition",
    emittedFiles: Object.freeze(emittedFiles.map((file) => Object.freeze({ ...file }))),
    deterministicHash,
  });
  const receipt = Object.freeze({ ...receiptBody, receiptId: hashText(canonicalizesJson(receiptBody)) });
  await validatesCompositionProjectionReceipt(receipt);
  emittedFiles.push(await writesArtifact(outputRoot, compositionArtifactNames.receipt, serializesJson(receipt)));

  return Object.freeze({
    request,
    compatibilityReport,
    contract,
    receipt,
    emittedFiles: Object.freeze(emittedFiles),
  });
}

async function clearsManagedCompositionArtifacts(outputRoot) {
  const managedPaths = [
    compositionArtifactNames.request,
    compositionArtifactNames.compatibilityReport,
    compositionArtifactNames.contract,
    compositionArtifactNames.designDocument,
    compositionArtifactNames.candidateAst,
    compositionArtifactNames.preview,
    compositionArtifactNames.host,
    compositionArtifactNames.policy,
    compositionArtifactNames.receipt,
  ];
  await Promise.all(managedPaths.map((relativePath) => rm(path.join(outputRoot, ...relativePath.split("/")), { recursive: true, force: true })));
}

async function calculatesProjectorAuthorityHash() {
  const sourcePaths = [
    fileURLToPath(new URL("./projects-sign-in-composition.js", import.meta.url)),
    fileURLToPath(new URL("./writes-sign-in-composition.js", import.meta.url)),
  ];
  const source = (await Promise.all(sourcePaths.map((sourcePath) => readFile(sourcePath, "utf8")))).join("\0");
  return hashText(source);
}

export async function loadsCompositionAuthorities(authoritiesDirectory = defaultAuthoritiesDirectory) {
  const entries = (await readdir(authoritiesDirectory)).filter((entry) => entry.endsWith(".authority.v1.json")).sort();
  const authorities = [];
  const ids = new Set();
  for (const entry of entries) {
    const authority = JSON.parse(stripsByteOrderMark(await readFile(path.join(authoritiesDirectory, entry), "utf8")));
    await validatesCompositionAuthority(authority);
    if (ids.has(authority.authorityId)) throw new Error(`Duplicate composition authorityId: ${authority.authorityId}`);
    ids.add(authority.authorityId);
    authorities.push(Object.freeze(authority));
  }
  return Object.freeze(authorities);
}

async function writesArtifact(outputRoot, relativePath, content) {
  const absolutePath = path.join(outputRoot, ...relativePath.split("/"));
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, "utf8");
  return Object.freeze({ path: relativePath, contentHash: `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}` });
}

function serializesJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function stripsByteOrderMark(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
