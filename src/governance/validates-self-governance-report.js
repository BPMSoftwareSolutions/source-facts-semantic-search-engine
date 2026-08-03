import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaPath = fileURLToPath(new URL("../../contracts/source-facts-self-governance-report.schema.v1.json", import.meta.url));
let validate;

export async function validatesSelfGovernanceReport(report) {
  if (validate === undefined) {
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true, validateFormats: false }).compile(schema);
  }
  if (validate(report)) return report;
  const details = validate.errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
  throw new Error(`source-facts-self-governance-report schema validation failed: ${details}`);
}
