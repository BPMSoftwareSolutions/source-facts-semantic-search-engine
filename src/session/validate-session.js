import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPaths = Object.freeze({
  session: fileURLToPath(new URL("../../contracts/intent-to-product-session.schema.v1.json", import.meta.url)),
  contract: fileURLToPath(new URL("../../contracts/web-know-landing-page-contract.schema.v1.json", import.meta.url)),
});
const validatorsBySchema = new Map();

export async function validatesIntentSession(session) {
  return await validatesAgainst("session", session, "intent-to-product-session");
}

export async function validatesLandingPageContract(contract) {
  return await validatesAgainst("contract", contract, "web-know-landing-page-contract");
}

async function validatesAgainst(schemaKey, value, label) {
  const validate = await loadsValidator(schemaKey);
  if (validate(value)) return value;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`${label} schema validation failed: ${details}`);
}

async function loadsValidator(schemaKey) {
  const cached = validatorsBySchema.get(schemaKey);
  if (cached !== undefined) return cached;
  const schema = JSON.parse(await readFile(schemaPaths[schemaKey], "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  validatorsBySchema.set(schemaKey, validate);
  return validate;
}
