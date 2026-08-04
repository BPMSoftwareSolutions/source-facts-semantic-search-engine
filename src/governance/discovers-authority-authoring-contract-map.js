import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function digest(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

async function readsJson(root, relativePath) {
  const text = await fs.readFile(path.join(root, relativePath), "utf8");
  return { document: JSON.parse(text), contentHash: digest(text) };
}

function mapEntry(authorityFacet, schemaFile, jsonPointer, schema, contentHash) {
  const segments = jsonPointer.slice(2).split("/").map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
  const target = segments.reduce((value, segment) => value?.[segment], schema);
  if (target === undefined) throw new Error(`AUTHORING_CONTRACT_MAP_POINTER_INVALID: ${schemaFile}${jsonPointer}`);
  return Object.freeze({ authorityFacet, schemaFile, schemaContentHash: contentHash, jsonPointer });
}

/**
 * Binds authority authoring to the admitted schema and projector/verifier maps
 * of the contract-driven artifact governance engine. No engine file is
 * mutated; the returned map is a content-addressed read-only interpretation
 * input for report queries.
 */
export async function discoversAuthorityAuthoringContractMap(root) {
  if (typeof root !== "string" || root.length === 0) {
    return Object.freeze({ disposition: "AUTHORING_CONTRACT_MAP_UNAVAILABLE", engineVersion: null, root: null, entries: [], projectors: [], verifiers: [], inputs: [] });
  }
  try {
    const [packageFile, governedSchema, semanticSchema, projectorRegistry, verifierRegistry] = await Promise.all([
      readsJson(root, "package.json"),
      readsJson(root, "schemas/governed-artifact-contract.schema.json"),
      readsJson(root, "schemas/bound-semantic-execution-authority.schema.json"),
      readsJson(root, "registries/projector-registry.json"),
      readsJson(root, "registries/verifier-registry.json"),
    ]);
    const governed = governedSchema.document;
    const semantic = semanticSchema.document;
    const entries = [
      ["responsibility", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/responsibilities"],
      ["semantic-edge", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/semanticEdges"],
      ["decision", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/decisions"],
      ["iteration", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/iterations"],
      ["failure-policy", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/failurePolicies"],
      ["projection-mapping", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/projectionMappings"],
      ["result-contract", "schemas/governed-artifact-contract.schema.json", "#/$defs/sourceAuthority/properties/resultContracts"],
      ["proof", "schemas/governed-artifact-contract.schema.json", "#/$defs/proof"],
      ["canonical-lineage", "schemas/governed-artifact-contract.schema.json", "#/$defs/canonicalLineage"],
    ].map(([facet, file, pointer]) => mapEntry(facet, file, pointer, governed, governedSchema.contentHash));
    for (const [facet, pointer] of [
      ["semantic-concepts", "#/properties/semanticLayer/properties/concepts"],
      ["semantic-relations", "#/properties/semanticLayer/properties/relations"],
      ["semantic-properties", "#/properties/semanticLayer/properties/properties"],
      ["semantic-facts", "#/properties/semanticLayer/properties/facts"],
      ["ontology-classifications", "#/properties/ontology/properties/classifications"],
      ["ontology-constraints", "#/properties/ontology/properties/constraints"],
      ["ontology-translations", "#/properties/ontology/properties/translations"],
      ["ontology-obligations", "#/properties/ontology/properties/obligations"],
      ["ontology-transformations", "#/properties/ontology/properties/transformations"],
      ["ontology-results", "#/properties/ontology/properties/results"],
      ["ontology-iterations", "#/properties/ontology/properties/iterations"],
      ["context-schemas", "#/properties/context/properties/schemas"],
      ["context-catalogs", "#/properties/context/properties/catalogs"],
      ["execution-binding", "#/properties/context/properties/executionBinding"],
    ]) entries.push(mapEntry(facet, "schemas/bound-semantic-execution-authority.schema.json", pointer, semantic, semanticSchema.contentHash));
    return Object.freeze({
      disposition: "AUTHORING_CONTRACT_MAP_BOUND",
      engineVersion: packageFile.document.version,
      root: path.resolve(root),
      entries: Object.freeze(entries),
      projectors: Object.freeze(projectorRegistry.document.projectors ?? []),
      verifiers: Object.freeze(verifierRegistry.document.verifiers ?? []),
      inputs: Object.freeze([
        { relativePath: "package.json", contentHash: packageFile.contentHash },
        { relativePath: "schemas/governed-artifact-contract.schema.json", contentHash: governedSchema.contentHash },
        { relativePath: "schemas/bound-semantic-execution-authority.schema.json", contentHash: semanticSchema.contentHash },
        { relativePath: "registries/projector-registry.json", contentHash: projectorRegistry.contentHash },
        { relativePath: "registries/verifier-registry.json", contentHash: verifierRegistry.contentHash },
      ]),
    });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return Object.freeze({ disposition: "AUTHORING_CONTRACT_MAP_UNAVAILABLE", engineVersion: null, root: path.resolve(root), entries: [], projectors: [], verifiers: [], inputs: [] });
    }
    throw error;
  }
}
