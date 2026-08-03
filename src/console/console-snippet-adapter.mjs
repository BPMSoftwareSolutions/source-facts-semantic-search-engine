// @generated
// project-id: serves-query-console
// feature-id: project-console-contract
// scenario-id: project-governed-console-contract
// obligation-id: console-contract-is-projected
// responsibility-id: console-snippet-adapter.v1.responsibility.v1
// projection-profile-id: provenance-sealed-source-projector.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:1b3128a400102343f91bf1a36640b04a4d8bcf7757bebf5369289732a720d43c
// body-sha256: sha256:3c6ac5afd4bde70ea5af7135da8378963446bff104bd56367766516307d62b5e
// artifact-provenance-sha256: sha256:95e6163775e2d20772d5e92504752eb1a44428b2c7fa397d76e0d750cd765ff5
//

/**
 * console-snippet-adapter.mjs
 *
 * Thin code body for source snippet retrieval.
 * All iteration and file access decisions delegated to semantic authority.
 *
 * Handles: Line iteration, context extraction, security checks
 */

import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";
import consoleSnippetBundle from "./contracts/console-snippet-retrieval.bundle.json" assert { type: "json" };

/**
 * Thin code body: Build line array for snippet response
 *
 * Input: {
 *   fileContent: string (full file text, newline-separated)
 *   startLine: number (1-indexed target line)
 *   endLine: number (1-indexed target line)
 *   context: number (lines of context above/below)
 * }
 *
 * Authority: Determines iteration bounds, line numbering, hit flag logic
 * Output: { lines: Array<{line, text, hit}> }
 */
export function extractsSnippetLines(snippetRequest) {
  return executeSemanticAuthority(consoleSnippetBundle, snippetRequest);
}
