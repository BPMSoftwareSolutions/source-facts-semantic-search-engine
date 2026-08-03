/**
 * console-snippet-adapter.mjs
 *
 * Thin code body for source snippet retrieval.
 * All iteration and file access decisions delegated to semantic authority.
 *
 * Handles: Line iteration, context extraction, security checks
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("./contracts/console-snippet-retrieval.bundle.json", import.meta.url));
const consoleSnippetBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

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
