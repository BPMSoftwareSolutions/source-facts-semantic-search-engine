import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const branchSchemaPath = fileURLToPath(new URL("../../schemas/deterministic-branch-authority.schema.json", import.meta.url));
const mechanicSchemaPath = fileURLToPath(new URL("../../schemas/deterministic-mechanic-authority.schema.json", import.meta.url));
let mechanicValidator;

const authorityKindByMechanic = new Map([
  ["branch", "decision-authority.v1"], ["iteration", "iteration-authority.v1"],
  ["exception-handling", "failure-observation-authority.v1"], ["throw", "terminal-disposition-authority.v1"],
  ["object-construction", "semantic-projection-authority.v1"], ["serialization", "serialization-profile-authority.v1"],
  ["normalization", "canonicalization-authority.v1"], ["validation", "constraint-authority.v1"],
  ["fallback", "alternative-selection-authority.v1"], ["retry", "retry-policy-authority.v1"],
  ["state-mutation", "state-transition-authority.v1"], ["meaning-hidden-in-text", "text-meaning-authority.v1"],
]);

export async function validatesDeterministicMechanicAuthority(authorityData, mechanicKind, { mechanicOccurrenceId = null } = {}) {
  const expectedAuthorityKind = authorityKindByMechanic.get(mechanicKind);
  if (expectedAuthorityKind === undefined) throw new Error(`No deterministic admitted-authority schema exists for mechanic kind '${mechanicKind}'.`);
  const validate = await loadsMechanicValidator();
  if (!validate(authorityData)) {
    const findings = (validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
    throw new Error(`Deterministic ${mechanicKind} authority is invalid: ${findings}`);
  }
  if (authorityData.authorityKind !== expectedAuthorityKind) {
    throw new Error(`Deterministic ${mechanicKind} authority kind must be '${expectedAuthorityKind}'.`);
  }
  if (mechanicKind === "branch") {
    const outcomeIds = new Set(authorityData.outcomes.map((outcome) => outcome.outcomeId));
    if (outcomeIds.size !== authorityData.outcomes.length) throw new Error("Deterministic branch authority contains duplicate outcome IDs.");
    const ruleIds = new Set(authorityData.rules.map((rule) => rule.ruleId));
    if (ruleIds.size !== authorityData.rules.length) throw new Error("Deterministic branch authority contains duplicate rule IDs.");
    if (!outcomeIds.has(authorityData.noMatchDisposition)) throw new Error("Deterministic branch authority noMatchDisposition does not resolve to an outcome.");
    for (const rule of authorityData.rules) {
      if (!outcomeIds.has(rule.outcomeId)) throw new Error(`Deterministic branch authority rule '${rule.ruleId}' has an unresolved outcome.`);
    }
  }
  if (mechanicOccurrenceId !== null && authorityData.candidateAuthorityId !== `candidate-${mechanicOccurrenceId}`) {
    throw new Error(`Deterministic ${mechanicKind} authority candidate identity does not match its mechanic occurrence.`);
  }
  return authorityData;
}

async function loadsMechanicValidator() {
  if (mechanicValidator !== undefined) return mechanicValidator;
  const [branchSchema, mechanicSchema] = await Promise.all([
    readFile(branchSchemaPath, "utf8").then(JSON.parse),
    readFile(mechanicSchemaPath, "utf8").then(JSON.parse),
  ]);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  ajv.addSchema(branchSchema);
  mechanicValidator = ajv.compile(mechanicSchema);
  return mechanicValidator;
}
