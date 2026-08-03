/**
 * console-routing-adapter.mjs
 *
 * Thin code body for console request routing.
 * All routing decisions delegated to semantic authority.
 *
 * Pattern: Load authority bundle → execute semantic authority → return result
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("./contracts/console-request-routing.bundle.json", import.meta.url));
const consoleRoutingBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

/**
 * Thin code body: Route console request based on authority
 *
 * Input: { request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }
 * Authority: Determines route dispatch and handler invocation
 * Output: Handler result (response sent or forwarded)
 */
export async function routesConsoleRequest(requestContext) {
  return await executeSemanticAuthority(consoleRoutingBundle, requestContext);
}
