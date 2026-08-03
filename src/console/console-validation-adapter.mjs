/**
 * console-validation-adapter.mjs
 *
 * Thin code body for console server validation.
 * All validation decisions delegated to semantic authority.
 *
 * Validates:
 * - Hostname (must be loopback)
 * - Index (must be provided and valid)
 * - Asset path (must be provided and non-empty)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("./contracts/console-validation.bundle.json", import.meta.url));
const consoleValidationBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

/**
 * Thin code body: Validate console server initialization parameters
 *
 * Input: { hostname, index, consoleAssetPath }
 * Authority: Determines if each parameter meets constraints
 * Output: { isValid, errors } or throws on critical validation failure
 */
export async function validatesConsoleParameters(parameters) {
  return await executeSemanticAuthority(consoleValidationBundle, parameters);
}

/**
 * Thin code body: Validate hostname binding constraint
 *
 * Input: { hostname }
 * Authority: classifiesLoopbackBind (external, delegated)
 * Output: { allowed: boolean } or throws HOSTNAME_NOT_ADMITTED
 */
export async function validatesLoopbackBinding(hostname) {
  return await executeSemanticAuthority(consoleValidationBundle, {
    validation: "loopback-binding",
    hostname
  });
}
