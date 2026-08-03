// @generated
// project-id: serves-query-console
// feature-id: project-console-contract
// scenario-id: project-governed-console-contract
// obligation-id: console-contract-is-projected
// responsibility-id: console-routing-adapter.v1.responsibility.v1
// projection-profile-id: provenance-sealed-source-projector.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:b1a772d086ff42a87fef35ad1e2baecc02e54a57f9cd9d75bde5dc824bb9439a
// body-sha256: sha256:c1d78885794fd73d9d42d16fafe05d2d89ab96778fe6473d2542c3ee87aacde7
// artifact-provenance-sha256: sha256:939c172866c8ac3e8b1cb76f8ce077507ee23e2cf2f67b51bc135d5a8320691c
//

/**
 * console-routing-adapter.mjs
 *
 * Thin code body for console request routing.
 * All routing decisions delegated to semantic authority.
 *
 * Pattern: Load authority bundle → execute semantic authority → return result
 */

import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";
import consoleRoutingBundle from "./contracts/console-request-routing.bundle.json" assert { type: "json" };

/**
 * Thin code body: Route console request based on authority
 *
 * Input: { request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }
 * Authority: Determines route dispatch and handler invocation
 * Output: Handler result (response sent or forwarded)
 */
export function routesConsoleRequest(requestContext) {
  return executeSemanticAuthority(consoleRoutingBundle, requestContext);
}
