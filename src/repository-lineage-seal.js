import { projectsCanonicalIntentRegistryContract } from "./sqlserver/load-engineering-truth.js";
import { verifiesRepositoryImage } from "./repository-image.js";

const intentPathPattern = /^features\/[^/]+\.intent\.json$/u;

export function projectsCanonicalIntentRegistryFromRepositoryImage(image, { applicationId = image?.rootId } = {}) {
  verifiesRepositoryImage(image);
  if (typeof applicationId !== "string" || applicationId.trim().length === 0) throw new Error("applicationId is required.");

  const intents = image.artifacts
    .filter((artifact) => intentPathPattern.test(artifact.relativePath.replaceAll("\\", "/")))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath))
    .map((artifact) => {
      const intent = JSON.parse(Buffer.from(artifact.contentBase64, "base64").toString("utf8"));
      if (intent?.documentKind !== "canonical-feature-intent.v1") {
        throw new Error(`Repository artifact '${artifact.relativePath}' is not canonical-feature-intent.v1.`);
      }
      return intent;
    });

  const enterpriseContext = Object.freeze({
    applicationId,
    repositoryId: image.rootId,
    workspaceId: image.rootId,
  });
  const contract = projectsCanonicalIntentRegistryContract({ intents, projectId: image.rootId, enterpriseContext });
  const report = {
    reportType: "database-origin-repository-lineage-observation.v1",
    repository: { repositoryId: image.rootId, workspaceId: image.rootId },
    enterpriseContext,
    index: { indexId: image.imageDigest },
    generatedAtUtc: null,
    interfaceGovernance: { callableInventory: [], commands: [], reachability: [] },
    testTraceability: { productionReachability: [], tests: [], scenarioLineage: [], scenarioProofCoverage: [] },
  };
  return Object.freeze({ contract, report, intentCount: intents.length, applicationId });
}
