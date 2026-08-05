import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { projectSourceFactsWorkspace } from "./project.js";
import { validatesSourceFactIndex } from "./validate-index.js";
import { projectsRepositoryImageToWorkspace, verifiesRepositoryImage } from "./repository-image.js";
import { discoversAuthorityDocumentsAcrossRoots } from "./governance/discovers-authority-documents.js";
import { discoversCanonicalFeatureIntents } from "./governance/canonical-feature-intent.js";
import { projectsSelfGovernanceReport } from "./governance/projects-self-governance-report.js";
import { validatesSelfGovernanceReport } from "./governance/validates-self-governance-report.js";
import { projectsCanonicalIntentRegistryContract } from "./sqlserver/load-engineering-truth.js";

const digest = (value) => `sha256:${createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;

export async function projectsRepositoryExecutionKnowledge(image, { applicationId = image?.rootId } = {}) {
  verifiesRepositoryImage(image);
  const temporaryParent = await mkdtemp(path.join(tmpdir(), "source-facts-sql-execution-"));
  const workspaceRoot = path.join(temporaryParent, "repository");
  try {
    await projectsRepositoryImageToWorkspace(image, workspaceRoot);
    const projectedIndex = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId: image.rootId, languageId: "typescript" });
    await validatesSourceFactIndex(projectedIndex);
    const testIndex = await projectSourceFactsWorkspace({ workspaceRoot: path.join(workspaceRoot, "test"), workspaceId: `${image.rootId}-tests`, languageId: "typescript" });
    await validatesSourceFactIndex(testIndex);
    const [authorityDocuments, canonicalFeatureIntents] = await Promise.all([
      discoversAuthorityDocumentsAcrossRoots([workspaceRoot], { relativeTo: workspaceRoot }),
      discoversCanonicalFeatureIntents(path.join(workspaceRoot, "features"), { relativeTo: workspaceRoot }),
    ]);
    const enterpriseContext = { applicationId, repositoryId: image.rootId, workspaceId: image.rootId };
    const fullReport = await projectsSelfGovernanceReport({
      index: projectedIndex,
      testIndex,
      repositoryId: image.rootId,
      authorityDocuments,
      canonicalFeatureIntents,
      enterpriseContext,
    });
    await validatesSelfGovernanceReport(fullReport);
    const index = canonicalizesSqlImageSourceFactIndex(projectedIndex, image.rootId);
    await validatesSourceFactIndex(index);
    const report = projectsBoundedExecutionReport(fullReport, index.indexId);
    const intents = canonicalFeatureIntents.pairs.map((pair) => pair.intent);
    const contract = projectsCanonicalIntentRegistryContract({ intents, projectId: image.rootId, enterpriseContext });
    const summary = Object.freeze({
      artifacts: image.artifactCount,
      sourceFiles: index.files.length,
      callables: report.interfaceGovernance?.callableInventory?.length ?? 0,
      commands: report.interfaceGovernance?.commands?.length ?? 0,
      reachabilityRows: report.interfaceGovernance?.reachability?.length ?? 0,
      mechanics: index.bodyMechanics.length,
      testFiles: testIndex.files.length,
      testMechanics: testIndex.bodyMechanics.length,
    });
    const authority = {
      analysisType: "repository-execution-knowledge.v1",
      rootId: image.rootId,
      applicationId,
      repositoryImageDigest: image.imageDigest,
      sourceFactIndexId: index.indexId,
      sourceFactIndex: index,
      report,
      contract,
      summary,
    };
    return Object.freeze({ ...authority, analysisDigest: digest(authority) });
  } finally {
    await rm(temporaryParent, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
}

function projectsBoundedExecutionReport(report, indexId) {
  return Object.freeze({
    reportType: report.reportType,
    generatedAtUtc: null,
    enterpriseContext: report.enterpriseContext,
    repository: Object.freeze({ ...report.repository, workspaceRoot: null }),
    index: Object.freeze({ ...report.index, indexId }),
    interfaceGovernance: Object.freeze({
      commands: report.interfaceGovernance.commands,
      callableInventory: report.interfaceGovernance.callableInventory,
      reachability: report.interfaceGovernance.reachability,
    }),
    testTraceability: Object.freeze({
      inventory: report.testTraceability.inventory,
      productionReachability: report.testTraceability.productionReachability,
      scenarioLineage: report.testTraceability.scenarioLineage,
      scenarioProofCoverage: report.testTraceability.scenarioProofCoverage,
    }),
  });
}

function canonicalizesSqlImageSourceFactIndex(index, rootId) {
  const scanId = digest({ rootId, rootHash: index.workspace.rootHash, languageId: index.workspace.languageId, languageProfileVersion: index.workspace.languageProfileVersion }).slice("sha256:".length);
  const manifest = Object.freeze({
    ...index.manifest,
    scanId,
    scanRequest: Object.freeze({ ...index.manifest.scanRequest, workspaceRoot: `sql://repository/${encodeURIComponent(rootId)}` }),
  });
  const indexId = digest({ indexType: index.indexType, schemaVersion: manifest.schemaVersion, engine: manifest.engine, engineVersion: manifest.engineVersion, rootId, scanId, rootHash: index.workspace.rootHash });
  return Object.freeze({ ...index, indexId, manifest });
}

export function verifiesRepositoryExecutionKnowledge(analysis) {
  if (analysis?.analysisType !== "repository-execution-knowledge.v1") throw new Error("A repository-execution-knowledge.v1 payload is required.");
  if (analysis.sourceFactIndex?.indexId !== analysis.sourceFactIndexId) throw new Error("Execution knowledge source-fact index identity is invalid.");
  const { analysisDigest, ...authority } = analysis;
  if (digest(authority) !== analysisDigest) throw new Error("Repository execution knowledge digest is invalid.");
  return analysis;
}
