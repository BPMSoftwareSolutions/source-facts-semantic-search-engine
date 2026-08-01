import { createHash } from "node:crypto";

const contractType = "web-know-landing-page-contract.v1";

export function buildsLandingPageContract({ sessionId, subject, purpose, audience, pageRegions, selectedLayout = null }) {
  requiresNonEmpty("subject", subject);
  requiresNonEmpty("purpose", purpose);
  requiresNonEmpty("audience", audience);
  if (!Array.isArray(pageRegions) || pageRegions.length === 0) {
    throw new Error("pageRegions must be a non-empty array.");
  }

  const regionIdByName = new Map();
  for (const region of pageRegions) {
    if (regionIdByName.has(region.name)) throw new Error(`duplicate page region name: ${region.name}`);
    regionIdByName.set(region.name, `sha256:${sha256(`region\0${region.name}`)}`);
  }

  const builtRegions = pageRegions.map((region) => {
    const parentRegionId = region.parentName != null ? regionIdByName.get(region.parentName) ?? null : null;
    if (region.parentName != null && parentRegionId === null) {
      throw new Error(`unknown parentName '${region.parentName}' for region '${region.name}'.`);
    }
    return Object.freeze({
      regionId: regionIdByName.get(region.name),
      name: region.name,
      parentRegionId,
      depth: computesDepth(region.name, pageRegions),
      reusedKnowHow: Object.freeze((region.reusedKnowHow ?? []).map((item) => Object.freeze({
        label: item.label,
        evidenceReferences: Object.freeze([...item.evidenceReferences]),
      }))),
      notes: region.notes ?? null,
    });
  });

  const selectedLayoutFrozen = selectedLayout === null
    ? null
    : Object.freeze({ label: selectedLayout.label, rationale: selectedLayout.rationale });

  const contractId = `sha256:${sha256(JSON.stringify({ subject, purpose, audience, builtRegions, selectedLayoutFrozen }))}`;

  return Object.freeze({
    contractType,
    contractId,
    sessionId,
    subject,
    purpose,
    audience,
    pageRegions: Object.freeze(builtRegions),
    selectedLayout: selectedLayoutFrozen,
  });
}

function computesDepth(name, pageRegions) {
  let depth = 0;
  let current = pageRegions.find((region) => region.name === name);
  const visited = new Set();
  while (current?.parentName != null) {
    if (visited.has(current.name)) throw new Error(`cycle detected in page region parentage at '${current.name}'.`);
    visited.add(current.name);
    depth += 1;
    current = pageRegions.find((region) => region.name === current.parentName);
  }
  return depth;
}

function requiresNonEmpty(name, value) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${name} must be a non-empty string.`);
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
