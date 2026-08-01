import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPaths = Object.freeze({
  "gallery-query.v1": fileURLToPath(new URL("../../contracts/gallery-query.schema.v1.json", import.meta.url)),
  "gallery-projector.v1": fileURLToPath(new URL("../../contracts/gallery-projector.schema.v1.json", import.meta.url)),
  "surface-preview-policy.v1": fileURLToPath(new URL("../../contracts/surface-preview-policy.schema.v1.json", import.meta.url)),
  "gallery-projection-request.v1": fileURLToPath(new URL("../../contracts/gallery-projection-request.schema.v1.json", import.meta.url)),
  "gallery-selection.v1": fileURLToPath(new URL("../../contracts/gallery-selection.schema.v1.json", import.meta.url)),
  "surface-preview-plan.v1": fileURLToPath(new URL("../../contracts/surface-preview-plan.schema.v1.json", import.meta.url)),
  "enterprise-gallery-manifest.v1": fileURLToPath(new URL("../../contracts/enterprise-gallery-manifest.schema.v1.json", import.meta.url)),
  "gallery-projection-receipt.v1": fileURLToPath(new URL("../../contracts/gallery-projection-receipt.schema.v1.json", import.meta.url)),
  "browser-render-receipt.v1": fileURLToPath(new URL("../../contracts/browser-render-receipt.schema.v1.json", import.meta.url)),
});
const validatorsBySchema = new Map();

export async function validatesGalleryQuery(value) { return await validatesAgainst("gallery-query.v1", value); }
export async function validatesGalleryProjector(value) { return await validatesAgainst("gallery-projector.v1", value); }
export async function validatesSurfacePreviewPolicy(value) { return await validatesAgainst("surface-preview-policy.v1", value); }
export async function validatesGalleryProjectionRequest(value) { return await validatesAgainst("gallery-projection-request.v1", value); }
export async function validatesGallerySelection(value) { return await validatesAgainst("gallery-selection.v1", value); }
export async function validatesSurfacePreviewPlan(value) { return await validatesAgainst("surface-preview-plan.v1", value); }
export async function validatesEnterpriseGalleryManifest(value) { return await validatesAgainst("enterprise-gallery-manifest.v1", value); }
export async function validatesGalleryProjectionReceipt(value) { return await validatesAgainst("gallery-projection-receipt.v1", value); }
export async function validatesBrowserRenderReceipt(value) { return await validatesAgainst("browser-render-receipt.v1", value); }

async function validatesAgainst(schemaKey, value) {
  const validate = await loadsValidator(schemaKey);
  if (validate(value)) return value;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`${schemaKey} schema validation failed: ${details}`);
}

async function loadsValidator(schemaKey) {
  const cached = validatorsBySchema.get(schemaKey);
  if (cached !== undefined) return cached;
  const schema = JSON.parse(await readFile(schemaPaths[schemaKey], "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  validatorsBySchema.set(schemaKey, validate);
  return validate;
}
