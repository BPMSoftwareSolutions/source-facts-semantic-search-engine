import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const contentTypeByExtension = Object.freeze(new Map([
  [".html", "text/html; charset=utf-8"],
  [".htm", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]));

export function buildsPreviewCsp(previewPolicy = {}) {
  const sandboxTokens = Array.isArray(previewPolicy.sandboxTokens)
    ? previewPolicy.sandboxTokens.filter((token) => token === "allow-same-origin")
    : ["allow-same-origin"];
  const sandbox = ["sandbox", ...sandboxTokens].join(" ");
  return [
    "default-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "media-src 'self'",
    "connect-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    sandbox,
  ].join("; ");
}

export async function servesIsolatedPreviews({
  outputDirectory,
  previewPolicy = {},
  hostname = "127.0.0.1",
  port = 0,
} = {}) {
  if (hostname !== "127.0.0.1") throw new Error("The gallery preview server may bind only to 127.0.0.1.");
  const previewsRoot = path.resolve(outputDirectory, "previews");
  const rootStats = await stat(previewsRoot).catch(() => null);
  if (rootStats === null || !rootStats.isDirectory()) throw new Error(`Materialized preview directory does not exist: ${previewsRoot}`);
  const realPreviewsRoot = await realpath(previewsRoot);
  const cspPolicy = buildsPreviewCsp(previewPolicy);

  const server = http.createServer((request, response) => {
    handlesRequest({ request, response, realPreviewsRoot, cspPolicy }).catch(() => {
      if (!response.headersSent) writesSecurityHeaders(response, cspPolicy);
      response.statusCode = 500;
      response.end("Preview server error.");
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
    throw new Error("Preview server did not expose a TCP address.");
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

async function handlesRequest({ request, response, realPreviewsRoot, cspPolicy }) {
  writesSecurityHeaders(response, cspPolicy);
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.statusCode = 405;
    response.setHeader("Allow", "GET, HEAD");
    response.end("Method not allowed.");
    return;
  }

  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
  } catch {
    response.statusCode = 400;
    response.end("Bad request.");
    return;
  }
  if (!decodedPathname.startsWith("/preview/") || decodedPathname.includes("\0") || decodedPathname.includes("\\")) {
    response.statusCode = 404;
    response.end("Not found.");
    return;
  }

  const relativePath = decodedPathname.slice("/preview/".length);
  const candidatePath = path.resolve(realPreviewsRoot, ...relativePath.split("/"));
  if (!isSameOrDescendant(candidatePath, realPreviewsRoot)) {
    response.statusCode = 404;
    response.end("Not found.");
    return;
  }
  const candidateRealPath = await realpath(candidatePath).catch(() => null);
  if (candidateRealPath === null || !isSameOrDescendant(candidateRealPath, realPreviewsRoot)) {
    response.statusCode = 404;
    response.end("Not found.");
    return;
  }
  const fileStats = await stat(candidateRealPath).catch(() => null);
  if (fileStats === null || !fileStats.isFile()) {
    response.statusCode = 404;
    response.end("Not found.");
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", contentTypeByExtension.get(path.extname(candidateRealPath).toLowerCase()) ?? "application/octet-stream");
  response.setHeader("Content-Length", fileStats.size);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const stream = createReadStream(candidateRealPath);
  stream.on("error", () => response.destroy());
  stream.pipe(response);
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
