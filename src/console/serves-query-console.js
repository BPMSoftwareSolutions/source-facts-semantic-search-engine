import { readFile, realpath, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { executeRelationalQuery } from "../query.js";
import { classifiesRoute } from "../../source-facts-query-console/src/route-dispatch-adapter.mjs";
import { classifiesLoopbackBind } from "../../source-facts-query-console/src/loopback-bind-adapter.mjs";
import { projectsCspPolicy } from "../../source-facts-query-console/src/csp-policy-adapter.mjs";

// Which pathname belongs to which route, and what it admits, is declared meaning
// now owned by contracts/route-dispatch.authority.json (see docs/serves-query-console-closure-tracker.md).
// This map is residual, mechanical-only: it exists solely to choose 404 vs 405 when
// the authority rejects a request, not to make the routing decision itself.
const knownPathnameAllow = new Map([
  ["/", "GET, HEAD"],
  ["/index.html", "GET, HEAD"],
  ["/api/index-info", "GET, HEAD"],
  ["/api/query", "POST"],
  ["/api/snippet", "GET, HEAD"],
]);

const maxRequestBodyBytes = 65536;
const defaultSnippetContextLines = 2;
const maxSnippetContextLines = 20;
const maxSnippetSpanLines = 400;

// The CSP directive set is declared meaning now owned by
// source-facts-query-console/contracts/query-console-csp-policy.authority.json
// (see docs/serves-query-console-closure-tracker.md). It is a fixed, input-independent
// value, so the authority declares the fully-serialized header string as one constant
// fact rather than assembling it from a join at request time.
export function buildsConsoleCsp() {
  return projectsCspPolicy();
}

export async function servesQueryConsole({
  index,
  workspaceRoot = null,
  consoleAssetPath,
  hostname = "127.0.0.1",
  port = 0,
} = {}) {
  try {
    classifiesLoopbackBind({ hostname });
  } catch (error) {
    if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    throw new Error("The query console server may bind only to 127.0.0.1.");
  }
  if (index === null || typeof index !== "object") throw new Error("A loaded source-fact-index.v1 is required.");
  if (typeof consoleAssetPath !== "string" || consoleAssetPath.trim().length === 0) {
    throw new Error("consoleAssetPath is required.");
  }
  const resolvedAssetPath = path.resolve(consoleAssetPath);
  const consoleHtml = await readFile(resolvedAssetPath, "utf8");
  const realWorkspaceRoot = workspaceRoot === null ? null : await realpath(path.resolve(workspaceRoot)).catch(() => { return null; });
  const cspPolicy = buildsConsoleCsp();

  const server = http.createServer((request, response) => {
    handlesRequest({ request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }).catch(() => {
      if (!response.headersSent) writesSecurityHeaders(response, cspPolicy);
      response.statusCode = 500;
      response.end(JSON.stringify({ error: "Query console server error." }));
    });
  });
  server.on("clientError", (_error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"));

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

async function handlesRequest({ request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }) {
  writesSecurityHeaders(response, cspPolicy);
  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
  } catch {
    response.statusCode = 400;
    response.end(JSON.stringify({ error: "Bad request." }));
    return undefined;
  }
  const parsedUrl = new URL(request.url ?? "/", "http://127.0.0.1");

  let dispatch;
  try {
    dispatch = classifiesRoute({ pathname: decodedPathname, method: request.method ?? "" });
  } catch (error) {
    if (error?.disposition !== "ROUTE_OR_METHOD_NOT_ADMITTED") throw error;
    const allow = knownPathnameAllow.get(decodedPathname);
    if (allow === undefined) {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: "Not found." }));
      return undefined;
    }
    return methodNotAllowed(response, allow);
  }

  const routeBodies = {
    "console-html": () => {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("Content-Length", Buffer.byteLength(consoleHtml));
      response.end(request.method === "HEAD" ? undefined : consoleHtml);
    },
    "index-info": () => writesJson(response, 200, {
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
    }),
    query: async () => {
      let body;
      try {
        body = await readsJsonBody(request);
      } catch (error) {
        return writesJson(response, error.statusCode ?? 400, { error: error.message });
      }
      const commandText = typeof body?.commandText === "string" ? body.commandText.trim() : "";
      if (commandText.length === 0) return writesJson(response, 400, { error: "commandText is required." });
      const receipt = await executeRelationalQuery(index, commandText);
      return writesJson(response, 200, receipt);
    },
    snippet: () => writesSnippetResponse({ response, parsedUrl, realWorkspaceRoot }),
  };
  return await routeBodies[dispatch.routeId]();
}

async function writesSnippetResponse({ response, parsedUrl, realWorkspaceRoot }) {
  const modulePath = parsedUrl.searchParams.get("modulePath") ?? "";
  const startLine = Number.parseInt(parsedUrl.searchParams.get("startLine") ?? "", 10);
  const endLine = Number.parseInt(parsedUrl.searchParams.get("endLine") ?? String(startLine), 10);
  const context = clamp(Number.parseInt(parsedUrl.searchParams.get("context") ?? String(defaultSnippetContextLines), 10) || defaultSnippetContextLines, 0, maxSnippetContextLines);

  if (realWorkspaceRoot === null) {
    return writesJson(response, 200, { available: false, reason: "WORKSPACE_ROOT_UNAVAILABLE" });
  }
  if (modulePath.length === 0 || modulePath.includes("\0") || !Number.isInteger(startLine) || startLine < 1) {
    return writesJson(response, 400, { error: "modulePath and a numeric startLine are required." });
  }
  if (!Number.isInteger(endLine) || endLine < startLine || endLine - startLine > maxSnippetSpanLines) {
    return writesJson(response, 400, { error: `endLine must be >= startLine and within ${maxSnippetSpanLines} lines.` });
  }

  const backslash = String.fromCharCode(92);
  const modulePathSegments = modulePath.split("/").flatMap((segment) => segment.split(backslash));
  const candidatePath = path.resolve(realWorkspaceRoot, ...modulePathSegments);
  if (!isSameOrDescendant(candidatePath, realWorkspaceRoot)) {
    return writesJson(response, 200, { available: false, reason: "PATH_ESCAPES_WORKSPACE" });
  }
  const realCandidatePath = await realpath(candidatePath).catch(() => { return null; });
  if (realCandidatePath === null || !isSameOrDescendant(realCandidatePath, realWorkspaceRoot)) {
    return writesJson(response, 200, { available: false, reason: "SOURCE_FILE_UNREADABLE" });
  }
  const fileStats = await stat(realCandidatePath).catch(() => { return null; });
  if (fileStats === null || !fileStats.isFile()) {
    return writesJson(response, 200, { available: false, reason: "SOURCE_FILE_UNREADABLE" });
  }

  const text = await readFile(realCandidatePath, "utf8").catch(() => { return null; });
  if (text === null) return writesJson(response, 200, { available: false, reason: "SOURCE_FILE_UNREADABLE" });

  const allLines = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const firstLine = clamp(startLine - context, 1, allLines.length);
  const lastLine = clamp(endLine + context, 1, allLines.length);
  const lines = [];
  for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {
    lines.push({ line: lineNumber, text: allLines[lineNumber - 1] ?? "", hit: lineNumber >= startLine && lineNumber <= endLine });
  }
  return writesJson(response, 200, { available: true, modulePath, startLine, endLine, lines });
}

function readsJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let receivedBytes = 0;
    request.on("data", (chunk) => {
      receivedBytes += chunk.length;
      if (receivedBytes > maxRequestBodyBytes) {
        const error = new Error("Request body too large.");
        error.statusCode = 413;
        request.destroy();
        reject(error);
        return undefined;
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

function methodNotAllowed(response, allow) {
  response.statusCode = 405;
  response.setHeader("Allow", allow);
  response.end(JSON.stringify({ error: "Method not allowed." }));
}

function writesJson(response, statusCode, value) {
  const body = JSON.stringify(value);
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Content-Length", Buffer.byteLength(body));
  response.end(body);
}

function writesSecurityHeaders(response, cspPolicy) {
  response.setHeader("Content-Security-Policy", cspPolicy);
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()");
}

function isSameOrDescendant(candidatePath, rootPath) {
  const candidate = process.platform === "win32" ? candidatePath.toLowerCase() : candidatePath;
  const root = process.platform === "win32" ? rootPath.toLowerCase() : rootPath;
  return candidate === root || candidate.startsWith(root + path.sep);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
