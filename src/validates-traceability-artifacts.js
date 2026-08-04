import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPaths = Object.freeze({
  "traceability-metric-catalog.v1": fileURLToPath(new URL("../contracts/traceability-metric-catalog.schema.v1.json", import.meta.url)),
  "traceability-query-receipts.v1": fileURLToPath(new URL("../contracts/traceability-query-receipts.schema.v1.json", import.meta.url)),
  "traceability-documentation-closure-receipt.v1": fileURLToPath(new URL("../contracts/traceability-documentation-closure-receipt.schema.v1.json", import.meta.url)),
});
const validatorCache = new Map();

export async function validatesTraceabilityMetricCatalog(catalog) {
  const validate = await loadsValidator("traceability-metric-catalog.v1");
  if (validate(catalog)) return catalog;
  const details = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
  throw new Error(`traceability-metric-catalog schema validation failed: ${details}`);
}

export async function validatesTraceabilityQueryReceipts(receipts) {
  const validate = await loadsValidator("traceability-query-receipts.v1");
  if (validate(receipts)) return receipts;
  const details = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
  throw new Error(`traceability-query-receipts schema validation failed: ${details}`);
}

export async function validatesTraceabilityClosureReceipt(receipt) {
  const validate = await loadsValidator("traceability-documentation-closure-receipt.v1");
  if (validate(receipt)) return receipt;
  const details = validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
  throw new Error(`traceability-documentation-closure-receipt schema validation failed: ${details}`);
}

async function loadsValidator(schemaKey) {
  const cached = validatorCache.get(schemaKey);
  if (cached !== undefined) return cached;
  const schema = JSON.parse(await readFile(schemaPaths[schemaKey], "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  validatorCache.set(schemaKey, validate);
  return validate;
}
