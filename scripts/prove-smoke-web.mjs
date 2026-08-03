#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projectsWebSurfaceInventory } from "../src/web/inventory.js";
import { projectsWebSurfaceIndex } from "../src/web/project-web-surfaces.js";
import { validatesWebSurfaceIndex, validatesWebSurfaceInventory, validatesWebKnowWorkspace } from "../src/web/validate-web-index.js";

const defaultPolicyPath = fileURLToPath(new URL("../contracts/web-know.workspace.json", import.meta.url));
const policyPath = path.resolve(process.env.WEB_KNOW_SMOKE_POLICY ?? process.argv[2] ?? defaultPolicyPath);
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
await validatesWebKnowWorkspace(policy);

const firstInventory = await projectsWebSurfaceInventory({ policy });
const secondInventory = await projectsWebSurfaceInventory({ policy });
await validatesWebSurfaceInventory(firstInventory);
assert.equal(firstInventory.inventoryId, secondInventory.inventoryId, "inventoryId drifted across unchanged reprojection");
assert.ok(firstInventory.entries.length > 0, "no paths were inventoried");

const dispositionTotal = Object.values(firstInventory.coverage.byDisposition).reduce((sum, count) => sum + count, 0);
assert.equal(dispositionTotal, firstInventory.coverage.totalPaths, "every inventoried path must carry exactly one disposition");
assert.equal(dispositionTotal, firstInventory.entries.length);

const first = await projectsWebSurfaceIndex({ policy, inventory: firstInventory });
const second = await projectsWebSurfaceIndex({ policy, inventory: firstInventory });
await validatesWebSurfaceIndex(first);
assert.equal(first.indexId, second.indexId, "indexId drifted across unchanged reprojection");
assert.ok(first.htmlDocuments.length > 0, "no HTML entry surfaces were projected");

const relationshipById = new Map(first.webRelationships.map((relationship) => [relationship.relationshipId, relationship]));
for (const relationship of first.webRelationships) {
  const hasResolvedPathId = relationship.resolvedPathId !== null;
  assert.equal(hasResolvedPathId, relationship.resolutionDisposition === "resolved-local",
    `resolvedPathId must be set if and only if resolutionDisposition is resolved-local (edge ${relationship.relationshipId})`);
}
for (const family of first.webFamilies) {
  for (const edgeId of [...family.resolvedEdgeIds, ...family.unresolvedEdgeIds]) {
    assert.ok(relationshipById.has(edgeId), `family ${family.familyId} references unknown relationship ${edgeId}`);
  }
}
for (const asset of first.assets) {
  assert.ok(relationshipById.has(asset.referencedByRelationshipId), `asset ${asset.assetId} references unknown relationship`);
}

console.log(JSON.stringify({
  disposition: "WEB_SURFACES_SMOKE_PROOF_COMPLETE",
  policyPath,
  roots: policy.roots.map((root) => root.rootId),
  inventoryId: firstInventory.inventoryId,
  totalPaths: firstInventory.coverage.totalPaths,
  byDisposition: firstInventory.coverage.byDisposition,
  indexId: first.indexId,
  htmlDocuments: first.htmlDocuments.length,
  cssStylesheets: first.cssStylesheets.length,
  webRelationships: first.webRelationships.length,
  webFamilies: first.webFamilies.length,
  diagnostics: first.diagnostics.length,
}, null, 2));
