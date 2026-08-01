import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPaths = Object.freeze({
  "web-know-workspace.v1": fileURLToPath(new URL("../../contracts/web-know-workspace.schema.v1.json", import.meta.url)),
  "web-surface-inventory.v1": fileURLToPath(new URL("../../contracts/web-surface-inventory.schema.v1.json", import.meta.url)),
  "web-surface-index.v1": fileURLToPath(new URL("../../contracts/web-surface-index.schema.v1.json", import.meta.url)),
});
const validatorsBySchema = new Map();

export async function validatesWebKnowWorkspace(policy) {
  return await validatesAgainst("web-know-workspace.v1", policy);
}

export async function validatesWebSurfaceInventory(inventory) {
  return await validatesAgainst("web-surface-inventory.v1", inventory);
}

export async function validatesWebSurfaceIndex(index) {
  return await validatesAgainst("web-surface-index.v1", index);
}

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
