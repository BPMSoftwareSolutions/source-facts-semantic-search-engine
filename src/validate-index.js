import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPath = fileURLToPath(new URL("../contracts/source-fact-index.schema.v1.json", import.meta.url));
let validate;

export async function validatesSourceFactIndex(index) {
  if (validate === undefined) {
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  }
  if (validate(index)) return index;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`source-fact-index schema validation failed: ${details}`);
}
