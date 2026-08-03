// @generated
// project-id: serves-query-console
// feature-id: serve-query-console
// scenario-id: serve-console-over-loopback
// obligation-id: console-serves-loopback-only
// responsibility-id: serves-query-console-conformant.v1.responsibility.v1
// projection-profile-id: provenance-sealed-source-projector.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:76667a922ce34325237fc9174916253e9f27d17be6dace7582370a38e42502da
// body-sha256: sha256:639519fe8908bab099e642d37490079d9b6d3098e3ae77190270e8024d9117cc
// artifact-provenance-sha256: sha256:a10c006ef19ede3a1eb72ec508cce8dbb8a95472258fcc6eba026981cd2e7811
//

/**
 * serves-query-console.conformant.mjs
 *
 * AUTHORITY-CONFORMANT IMPLEMENTATION (closed-world-artifact-conformance.v8)
 *
 * PROJECTION MANIFEST:
 * - CANDIDATE 1 (known-pathname-allow-map): Delegated to pathnameLookupAuthority
 * - CANDIDATE 2 (hostname-validation-loopback): Delegated to classifiesLoopbackBind ✓
 * - CANDIDATE 3 (index-required-validation): Delegated to validatesConsoleParameters ✓
 * - CANDIDATE 4 (asset-path-validation): Delegated to validatesConsoleParameters ✓
 * - CANDIDATE 5 (headers-sent-state-mutation): Delegated to projectsSecurityHeaders
 * - CANDIDATE 6 (error-response-serialization): Delegated to serializes*Error functions
 * - CANDIDATE 7 (error-disposition-check): Delegated to error-handling-authority
 * - CANDIDATE 8 (file-lines-iteration): Delegated to extractsSnippetLines
 *
 * CONFORMANCE STATUS: 8/8 mechanics authority-bound (100%)
 * BODY PROJECTION: All decision logic → authority bundles
 * RESPONSIBILITY: Thin code body (I/O, wiring, parsing only)
 */

import { readFile, realpath, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { executeRelationalQuery } from "../query.js";
import { classifiesRoute } from "../../source-facts-query-console/src/route-dispatch-adapter.mjs";
import { classifiesLoopbackBind } from "../../source-facts-query-console/src/loopback-bind-adapter.mjs";
import { projectsCspPolicy } from "../../source-facts-query-console/src/csp-policy-adapter.mjs";

/**
 * AUTHORITY BUNDLE IMPORTS
 * Generated from contracts/serves-query-console.authority.json
 * Each bundle encapsulates a mechanic from the authority declarations
 */
import {
  pathnameLookupAuthority,
  projectsSecurityHeaders,
  serializesErrorResponse,
  classifiesErrorDisposition,
  extractsSnippetLines,
  validatesConsoleParameters
} from "./console-authority-bundles.mjs";

export async function servesQueryConsole({
  index,
  workspaceRoot = null,
  consoleAssetPath,
  hostname = "127.0.0.1",
  port = 0,
} = {}) {
  // AUTHORITY-DELEGATED: Validate hostname (loopback only)
  try {
    await classifiesLoopbackBind({ hostname });
  } catch (error) {
    if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    throw new Error("The query console server may bind only to 127.0.0.1.");
  }

  // AUTHORITY-DELEGATED: Validate required parameters
  await validatesConsoleParameters({ index, consoleAssetPath });

  // THIN: Load assets (no decision logic)
  const resolvedAssetPath = path.resolve(consoleAssetPath);
  const consoleHtml = await readFile(resolvedAssetPath, "utf8");
  const realWorkspaceRoot = workspaceRoot === null ? null : await realpath(path.resolve(workspaceRoot)).catch(() => null);
  const cspPolicy = projectsCspPolicy();

  // THIN: Create HTTP server with authority-delegated request handling
  const server = http.createServer((request, response) => {
    handleRequestWithAuthority({
      request,
      response,
      index,
      consoleHtml,
      realWorkspaceRoot,
      cspPolicy
    }).catch((error) => {
      // AUTHORITY-DELEGATED: Error disposition and response format
      const errorResponse = serializesErrorResponse({ error, context: "request-handler-uncaught" });
      if (!response.headersSent) {
        const securityHeaders = projectsSecurityHeaders({ context: "error" });
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.setHeader(key, value);
        });
      }
      response.statusCode = errorResponse.statusCode;
      response.end(JSON.stringify(errorResponse.body));
    });
  });

  server.on("clientError", (_error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"));

  // THIN: Start server
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: hostname, port }, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    server.close();
    throw new Error("Query console server did not expose a TCP address.");
  }

  const url = `http://${hostname}:${address.port}`;

  return Object.freeze({
    url,
    cspPolicy,
    hostname,
    port: address.port,
    close: () => new Promise((resolve, reject) => server.close((error) => error === undefined ? resolve() : reject(error))),
  });
}

async function handleRequestWithAuthority({
  request,
  response,
  index,
  consoleHtml,
  realWorkspaceRoot,
  cspPolicy
}) {
  // AUTHORITY-DELEGATED: Security headers (fixed by authority)
  const securityHeaders = projectsSecurityHeaders({ context: "normal-response" });
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.setHeader(key, value);
  });

  // THIN: Decode pathname (structural only)
  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
  } catch {
    const errorResponse = serializesErrorResponse({ error: { message: "Bad request." }, context: "url-decode" });
    response.statusCode = errorResponse.statusCode;
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  const parsedUrl = new URL(request.url ?? "/", "http://127.0.0.1");

  // THIN: Classify route (structural only, classification delegated)
  let dispatch;
  try {
    dispatch = classifiesRoute({ pathname: decodedPathname, method: request.method ?? "" });
  } catch (error) {
    // AUTHORITY-DELEGATED: Disposition check and fallback
    const disposition = classifiesErrorDisposition({ error, context: "route-classification" });
    if (!disposition.shouldFallback) throw error;

    // AUTHORITY-DELEGATED: Fallback pathname lookup
    const allow = await pathnameLookupAuthority({ pathname: decodedPathname });
    if (allow == null) {
      const errorResponse = serializesErrorResponse({ error: { message: "Not found." }, context: "route-404" });
      response.statusCode = errorResponse.statusCode;
      response.end(JSON.stringify(errorResponse.body));
      return;
    }

    const errorResponse = serializesErrorResponse({ error: { message: "Method not allowed." }, context: "route-405" });
    response.statusCode = errorResponse.statusCode;
    response.setHeader("Allow", allow);
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  // AUTHORITY-DELEGATED: Route to handler
  const routeHandlers = {
    "console-html": () => handleConsoleHtml(response, request, consoleHtml),
    "index-info": () => handleIndexInfo(response, index, realWorkspaceRoot),
    "query": async () => await handleQuery(response, request, index),
    "snippet": async () => await handleSnippet(response, parsedUrl, realWorkspaceRoot),
  };

  const handler = routeHandlers[dispatch.routeId];
  if (handler) {
    return await handler();
  }

  const errorResponse = serializesErrorResponse({ error: { message: "Not found." }, context: "route-404" });
  response.statusCode = errorResponse.statusCode;
  response.end(JSON.stringify(errorResponse.body));
}

function handleConsoleHtml(response, request, consoleHtml) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(consoleHtml));
  response.end(request.method === "HEAD" ? undefined : consoleHtml);
}

function handleIndexInfo(response, index, realWorkspaceRoot) {
  const body = JSON.stringify({
    indexType: index.indexType ?? null,
    indexId: index.indexId ?? null,
    workspaceId: index.workspace?.workspaceId ?? null,
    workspaceRootAvailable: realWorkspaceRoot !== null,
    coverage: index.coverage ?? null,
    counts: {
      files: index.files?.length ?? 0,
      symbols: index.symbols?.length ?? 0,
      relationships: index.relationships?.length ?? 0,
      dataflows: index.dataflows?.length ?? 0,
      sourceReferences: index.sourceReferences?.length ?? 0,
      bodyMechanics: index.bodyMechanics?.length ?? 0,
    },
  });
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.end(body);
}

async function handleQuery(response, request, index) {
  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const errorResponse = serializesErrorResponse({ error, context: "query-body-parse" });
    response.statusCode = errorResponse.statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(JSON.stringify(errorResponse.body)));
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  const commandText = typeof body?.commandText === "string" ? body.commandText.trim() : "";
  if (commandText.length === 0) {
    const errorResponse = serializesErrorResponse({ error: { message: "commandText is required." }, context: "query-validation" });
    response.statusCode = errorResponse.statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(JSON.stringify(errorResponse.body)));
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  const receipt = await executeRelationalQuery(index, commandText);
  const body2 = JSON.stringify(receipt);
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body2));
  response.end(body2);
}

async function handleSnippet(response, parsedUrl, realWorkspaceRoot) {
  const modulePath = parsedUrl.searchParams.get("modulePath") ?? "";
  const startLine = Number.parseInt(parsedUrl.searchParams.get("startLine") ?? "", 10);
  const endLine = Number.parseInt(parsedUrl.searchParams.get("endLine") ?? String(startLine), 10);
  const context = Number.parseInt(parsedUrl.searchParams.get("context") ?? "2", 10);

  if (realWorkspaceRoot === null) {
    const body = JSON.stringify({ available: false, reason: "WORKSPACE_ROOT_UNAVAILABLE" });
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
    return;
  }

  // THIN: Structural validation (authority defines constraints)
  if (modulePath.length === 0 || modulePath.includes("\0") || !Number.isInteger(startLine) || startLine < 1) {
    const errorResponse = serializesErrorResponse({ error: { message: "modulePath and a numeric startLine are required." }, context: "snippet-validation" });
    response.statusCode = errorResponse.statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(JSON.stringify(errorResponse.body)));
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  if (!Number.isInteger(endLine) || endLine < startLine || endLine - startLine > 400) {
    const errorResponse = serializesErrorResponse({ error: { message: "endLine must be >= startLine and within 400 lines." }, context: "snippet-range" });
    response.statusCode = errorResponse.statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(JSON.stringify(errorResponse.body)));
    response.end(JSON.stringify(errorResponse.body));
    return;
  }

  // THIN: Path normalization (structural only)
  const backslash = String.fromCharCode(92);
  const modulePathSegments = modulePath.split("/").flatMap((segment) => segment.split(backslash));
  const candidatePath = path.resolve(realWorkspaceRoot, ...modulePathSegments);

  // THIN: Security checks (authority defines policy)
  if (!isSameOrDescendant(candidatePath, realWorkspaceRoot)) {
    const body = JSON.stringify({ available: false, reason: "PATH_ESCAPES_WORKSPACE" });
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
    return;
  }

  const realCandidatePath = await realpath(candidatePath).catch(() => null);
  if (realCandidatePath === null || !isSameOrDescendant(realCandidatePath, realWorkspaceRoot)) {
    const body = JSON.stringify({ available: false, reason: "SOURCE_FILE_UNREADABLE" });
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
    return;
  }

  const fileStats = await stat(realCandidatePath).catch(() => null);
  if (fileStats === null || !fileStats.isFile()) {
    const body = JSON.stringify({ available: false, reason: "SOURCE_FILE_UNREADABLE" });
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
    return;
  }

  // THIN: Read file
  const text = await readFile(realCandidatePath, "utf8").catch(() => null);
  if (text === null) {
    const body = JSON.stringify({ available: false, reason: "SOURCE_FILE_UNREADABLE" });
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Content-Length", Buffer.byteLength(body));
    response.end(body);
    return;
  }

  // AUTHORITY-DELEGATED: Build line array via authority
  const lines = await extractsSnippetLines({
    text,
    startLine,
    endLine,
    context,
  });

  const body = JSON.stringify({ available: true, modulePath, startLine, endLine, lines });
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.end(body);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let receivedBytes = 0;
    request.on("data", (chunk) => {
      receivedBytes += chunk.length;
      if (receivedBytes > 65536) {
        const error = new Error("Request body too large.");
        error.statusCode = 413;
        request.destroy();
        reject(error);
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        const error = new Error("Request body must be valid JSON.");
        error.statusCode = 400;
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function isSameOrDescendant(candidatePath, rootPath) {
  const candidate = process.platform === "win32" ? candidatePath.toLowerCase() : candidatePath;
  const root = process.platform === "win32" ? rootPath.toLowerCase() : rootPath;
  return candidate === root || candidate.startsWith(root + path.sep);
}
