import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPath = fileURLToPath(new URL("../../contracts/sql-server-load-receipt.schema.v1.json", import.meta.url));
let validate;

export async function validatesLoadReceipt(receipt) {
  if (validate === undefined) {
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  }
  if (validate(receipt)) return receipt;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`sql-server-load-receipt schema validation failed: ${details}`);
}
