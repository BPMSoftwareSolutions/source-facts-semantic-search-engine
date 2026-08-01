import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPaths = Object.freeze({
  authority: fileURLToPath(new URL("../../contracts/composition-authority.schema.v1.json", import.meta.url)),
  request: fileURLToPath(new URL("../../contracts/sign-in-composition-request.schema.v1.json", import.meta.url)),
  report: fileURLToPath(new URL("../../contracts/composition-compatibility-report.schema.v1.json", import.meta.url)),
  contract: fileURLToPath(new URL("../../contracts/sign-in-composition-contract.schema.v1.json", import.meta.url)),
  receipt: fileURLToPath(new URL("../../contracts/composition-projection-receipt.schema.v1.json", import.meta.url)),
});

const validators = new Map();

export async function validatesCompositionAuthority(value) {
  return await validatesAgainst("authority", value, "composition authority");
}

export async function validatesSignInCompositionRequest(value) {
  return await validatesAgainst("request", value, "sign-in composition request");
}

export async function validatesCompositionCompatibilityReport(value) {
  return await validatesAgainst("report", value, "composition compatibility report");
}

export async function validatesSignInCompositionContract(value) {
  return await validatesAgainst("contract", value, "sign-in composition contract");
}

export async function validatesCompositionProjectionReceipt(value) {
  return await validatesAgainst("receipt", value, "composition projection receipt");
}

async function validatesAgainst(schemaKey, value, label) {
  const validate = await loadsValidator(schemaKey);
  if (validate(value)) return value;
  const details = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
  throw new Error(`${label} schema validation failed: ${details}`);
}

async function loadsValidator(schemaKey) {
  const cached = validators.get(schemaKey);
  if (cached !== undefined) return cached;
  const schema = JSON.parse(await readFile(schemaPaths[schemaKey], "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  validators.set(schemaKey, validate);
  return validate;
}
