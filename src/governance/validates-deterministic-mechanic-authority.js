import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const branchSchemaPath = fileURLToPath(new URL("../../schemas/deterministic-branch-authority.schema.json", import.meta.url));
let branchValidator;

export async function validatesDeterministicMechanicAuthority(authorityData, mechanicKind, { mechanicOccurrenceId = null } = {}) {
  if (mechanicKind !== "branch") throw new Error(`No deterministic admitted-authority schema exists for mechanic kind '${mechanicKind}'.`);
  const validate = await loadsBranchValidator();
  if (!validate(authorityData)) {
    const findings = (validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
    throw new Error(`Deterministic branch authority is invalid: ${findings}`);
  }
  const outcomeIds = new Set(authorityData.outcomes.map((outcome) => outcome.outcomeId));
  if (outcomeIds.size !== authorityData.outcomes.length) throw new Error("Deterministic branch authority contains duplicate outcome IDs.");
  const ruleIds = new Set(authorityData.rules.map((rule) => rule.ruleId));
  if (ruleIds.size !== authorityData.rules.length) throw new Error("Deterministic branch authority contains duplicate rule IDs.");
  if (!outcomeIds.has(authorityData.noMatchDisposition)) throw new Error("Deterministic branch authority noMatchDisposition does not resolve to an outcome.");
  for (const rule of authorityData.rules) {
    if (!outcomeIds.has(rule.outcomeId)) throw new Error(`Deterministic branch authority rule '${rule.ruleId}' has an unresolved outcome.`);
  }
  if (mechanicOccurrenceId !== null && authorityData.candidateAuthorityId !== `candidate-${mechanicOccurrenceId}`) {
    throw new Error("Deterministic branch authority candidate identity does not match its mechanic occurrence.");
  }
  return authorityData;
}

async function loadsBranchValidator() {
  if (branchValidator !== undefined) return branchValidator;
  const schema = JSON.parse(await readFile(branchSchemaPath, "utf8"));
  branchValidator = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  return branchValidator;
}
