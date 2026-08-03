import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { mkdtemp, writeFile, rm } from "node:fs/promises";

const defaultConnectorRepoRoot = "C:/lab/repos/generic-llm-connector";
const defaultProviderAuthorityPath = path.join(defaultConnectorRepoRoot, "config", "provider-authority.json");

export class ModelInvocationError extends Error {}

/**
 * Spawns the sibling generic-llm-connector CLI as a child process for exactly
 * one model request and returns its parsed model-response JSON.
 *
 * This repo carries no LLM SDK dependency of its own and never will -- every
 * live call goes through that connector's own provider authority, credential
 * reference, and proof receipt (request/response SHA-256 hashes, resolved
 * model, token usage), so every inference this repo produces is independently
 * reproducible and auditable outside this codebase too.
 *
 * spawnFunction is injectable so the invocation plumbing (temp file handling,
 * argv shape, response parsing) is unit-testable without a real network call
 * or the connector repo present on disk.
 */
export async function invokesLiveModelInference(modelRequest, {
  connectorRepoRoot = defaultConnectorRepoRoot,
  providerAuthorityPath = defaultProviderAuthorityPath,
  spawnFunction = spawnSync,
} = {}) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-model-request-"));
  const requestPath = path.join(tempDir, "request.json");
  try {
    await writeFile(requestPath, JSON.stringify(modelRequest, null, 2), "utf8");
    const connectorBinPath = path.join(connectorRepoRoot, "bin", "llm-connector.ts");
    const timeoutMilliseconds = (modelRequest.executionPolicy?.timeoutMilliseconds ?? 60000) + 15000;

    const result = spawnFunction(process.execPath, [
      "--import", "tsx",
      connectorBinPath,
      "obtain",
      "--request", requestPath,
      "--provider-authority", providerAuthorityPath,
    ], {
      cwd: connectorRepoRoot,
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
      timeout: timeoutMilliseconds,
    });

    if (result.error) {
      throw new ModelInvocationError(`Failed to spawn the model connector: ${result.error.message}`);
    }
    if (typeof result.stdout !== "string" || result.stdout.trim().length === 0) {
      throw new ModelInvocationError(`Model connector produced no stdout output.${typeof result.stderr === "string" && result.stderr.length > 0 ? ` stderr: ${result.stderr}` : ""}`);
    }
    let response;
    try {
      response = JSON.parse(result.stdout);
    } catch (error) {
      throw new ModelInvocationError(`Model connector stdout was not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
    return response;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
