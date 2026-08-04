import { createHash } from "node:crypto";
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

export async function validatesTraceabilityClosureReceiptIntegrity(receipt) {
  await validatesTraceabilityClosureReceipt(receipt);
  if (receipt.queryReceiptCount !== receipt.queryReceiptBundle.queryReceiptRows.length) {
    throw new Error("CLOSURE_RECEIPT_COUNT_MISMATCH: queryReceiptCount does not match queryReceiptRows.");
  }
  if (receipt.renderedMetricCount !== receipt.metricRows.length) {
    throw new Error("CLOSURE_RECEIPT_COUNT_MISMATCH: renderedMetricCount does not match metricRows.");
  }
  const expectedBundleHash = hashCanonical(receipt.queryReceiptBundle);
  if (receipt.queryReceiptBundleHash !== expectedBundleHash) {
    throw new Error("CLOSURE_RECEIPT_HASH_MISMATCH: queryReceiptBundleHash is invalid.");
  }
  const expectedMetricRowsHash = hashCanonical(receipt.metricRows);
  if (receipt.metricRowsHash !== expectedMetricRowsHash) {
    throw new Error("CLOSURE_RECEIPT_HASH_MISMATCH: metricRowsHash is invalid.");
  }
  const failedConditions = receipt.closureConditions
    .filter((condition) => condition.disposition !== "PASSED")
    .map((condition) => condition.conditionId);
  if (receipt.failedConditionCount !== failedConditions.length
      || JSON.stringify(receipt.failedConditions) !== JSON.stringify(failedConditions)) {
    throw new Error("CLOSURE_RECEIPT_CONDITION_MISMATCH: failed-condition summary is invalid.");
  }
  const expectedDisposition = failedConditions.length === 0 ? "CLOSED" : "OPEN";
  if (receipt.disposition !== expectedDisposition) {
    throw new Error("CLOSURE_RECEIPT_CONDITION_MISMATCH: disposition does not match closure conditions.");
  }
  const {
    generatedAtUtc: _generatedAtUtc,
    deterministicReceiptHash: _deterministicReceiptHash,
    ...deterministicPayload
  } = receipt;
  if (receipt.deterministicReceiptHash !== hashCanonical(deterministicPayload)) {
    throw new Error("CLOSURE_RECEIPT_HASH_MISMATCH: deterministicReceiptHash is invalid.");
  }
  return receipt;
}

async function loadsValidator(schemaKey) {
  const cached = validatorCache.get(schemaKey);
  if (cached !== undefined) return cached;
  const schema = JSON.parse(await readFile(schemaPaths[schemaKey], "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  validatorCache.set(schemaKey, validate);
  return validate;
}

function hashCanonical(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(canonicalizes(value)), "utf8").digest("hex")}`;
}

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}
