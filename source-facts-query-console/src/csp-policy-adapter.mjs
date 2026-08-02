import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("../contracts/query-console-csp-policy.bundle.json", import.meta.url));
const cspPolicyBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

export function projectsCspPolicy() {
  return executeSemanticAuthority(cspPolicyBundle, {}).cspPolicy;
}
