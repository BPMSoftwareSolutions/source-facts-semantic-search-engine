import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { projectsEngineeringTruthSqlPayload } from "../src/sqlserver/load-engineering-truth.js";
import { projectsCanonicalIntentRegistryFromRepositoryImage } from "../src/repository-lineage-seal.js";

test("projects canonical intent authority entirely from repository image bytes", () => {
  const intent = { documentKind: "canonical-feature-intent.v1", featureId: "fixture.feature", purpose: "Fixture", lifecycle: "FEATURE_INTENT_ADMITTED", authorityStatus: "FEATURE_LINEAGE_CLOSED", scenarios: [{ scenarioId: "fixture.scenario", purpose: "Fixture", obligationId: "fixture.obligation", responsibilityId: "fixture.responsibility" }] };
  const artifact = { relativePath: "features/fixture.intent.json", artifactType: "file", artifactClass: "text", mediaType: "application/json", encoding: "utf-8", fileMode: "100644", byteLength: Buffer.byteLength(JSON.stringify(intent)), contentDigest: `sha256:${createHash("sha256").update(JSON.stringify(intent)).digest("hex")}`, authorityDisposition: "OBSERVED_NOT_ADMITTED", contentBase64: Buffer.from(JSON.stringify(intent)).toString("base64") };
  const image = { imageType: "repository-current-image.v1", rootId: "fixture-root", workspaceRoot: "C:/absent", discoveryMode: "governed-workspace", artifacts: [artifact], directories: ["features"], artifactCount: 1, totalByteLength: artifact.byteLength };
  const manifest = { imageType: image.imageType, rootId: image.rootId, directories: image.directories, artifacts: image.artifacts.map(({ contentBase64: _contentBase64, ...row }) => row) };
  image.imageDigest = `sha256:${createHash("sha256").update(JSON.stringify(manifest)).digest("hex")}`;
  const result = projectsCanonicalIntentRegistryFromRepositoryImage(image, { applicationId: "fixture-app" });
  assert.equal(result.intentCount, 1);
  assert.equal(result.contract.enterpriseContext.applicationId, "fixture-app");
  assert.equal(result.contract.enterpriseContext.repositoryId, "fixture-root");
  const payload = projectsEngineeringTruthSqlPayload({ contract: result.contract, report: result.report, contractSourcePath: "sql://fixture/features", reportSourcePath: "sql://fixture/observation" });
  assert.equal(payload.features.length, 1);
  assert.equal(payload.responsibilities.length, 1);
});
