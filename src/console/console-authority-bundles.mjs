// @generated
// project-id: serves-query-console
// feature-id: delegate-console-authority
// scenario-id: delegate-console-mechanics
// obligation-id: console-delegates-mechanics
// responsibility-id: console-authority-bundles.v1.responsibility.v1
// projection-profile-id: provenance-sealed-source-projector.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:60431b363e434c665099851b5502d26b373398766b645893c1f6882f5b696ac3
// body-sha256: sha256:df334463a48e3a1ccc610de9e4ad3a4c1d06318e0ea9b93e5cc866f4d94fdc45
// artifact-provenance-sha256: sha256:64c4079a23bfef7d52025aa66680b24741b1bba0a250310fd922742a6cd82bd2
//

import { validatesConsoleParameters as validatesConsoleParametersFromAdapter } from "./console-validation-adapter.mjs";

/**
 * AUTHORITY BUNDLES FOR serves-query-console
 *
 * Generated from contracts/serves-query-console.authority.json
 * Each bundle encapsulates a decision/mechanic from the authority declarations
 */

/**
 * BUNDLE 1: pathnameLookupAuthority
 * Authority source: known-pathname-allow-map
 * Mechanic type: object-construction
 */
export function pathnameLookupAuthority({ pathname }) {
  const knownPathnameAllow = new Map([
    ["/", "GET, HEAD"],
    ["/index.html", "GET, HEAD"],
    ["/api/index-info", "GET, HEAD"],
    ["/api/query", "POST"],
    ["/api/snippet", "GET, HEAD"],
  ]);
  return knownPathnameAllow.get(pathname) ?? null;
}

/**
 * BUNDLE 2: projectsSecurityHeaders
 * Authority source: headers-sent-state-mutation
 * Mechanic type: state-mutation
 */
export function projectsSecurityHeaders({ context = "normal-response" }) {
  // Authority: CSP, Cache-Control, X-Content-Type-Options, Referrer-Policy, etc.
  return {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'",
    "Cache-Control": "no-store",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()"
  };
}

/**
 * BUNDLE 3: serializesErrorResponse
 * Authority source: error-response-serialization
 * Mechanic type: serialization
 */
export function serializesErrorResponse({ error, context = "default" }) {
  // Authority: Always serialize as { error: string } with appropriate status code
  const statusCodeMap = {
    "url-decode": 400,
    "route-classification": 405,
    "route-405": 405,
    "route-404": 404,
    "snippet-validation": 400,
    "snippet-range": 400,
    "query-body-parse": 400,
    "query-validation": 400,
    "request-handler-uncaught": 500
  };

  const message = typeof error?.message === "string"
    ? error.message
    : (typeof error === "string" ? error : "Query console server error.");

  return {
    statusCode: statusCodeMap[context] || 500,
    body: { error: message }
  };
}

/**
 * BUNDLE 4: classifiesErrorDisposition
 * Authority source: error-disposition-check
 * Mechanic type: branch
 */
export function classifiesErrorDisposition({ error, context = "default" }) {
  // Authority: Route by disposition, fallback if HOSTNAME_NOT_ADMITTED or ROUTE_OR_METHOD_NOT_ADMITTED
  const disposition = error?.disposition;

  const fallbackDispositions = [
    "HOSTNAME_NOT_ADMITTED",
    "ROUTE_OR_METHOD_NOT_ADMITTED"
  ];

  return {
    shouldFallback: fallbackDispositions.includes(disposition),
    disposition
  };
}

/**
 * BUNDLE 5: extractsSnippetLines
 * Authority source: file-lines-iteration
 * Mechanic type: iteration
 */
export function extractsSnippetLines({ text, startLine, endLine, context }) {
  // Authority: Build line array from startLine to endLine, 1-indexed, ascending order
  const allLines = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");

  // Apply context (lines before/after the snippet)
  const contextLines = Math.max(0, Math.min(context ?? 2, 20));
  const firstLine = Math.max(1, startLine - contextLines);
  const lastLine = Math.max(1, Math.min(endLine + contextLines, allLines.length));

  // Authority: Iteration in ascending order, hit-flag classification
  const lines = [];
  for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {
    lines.push({
      line: lineNumber,
      text: allLines[lineNumber - 1] ?? "",
      hit: lineNumber >= startLine && lineNumber <= endLine
    });
  }

  return lines;
}

/**
 * BUNDLE 6: normalizesPathSegments
 * Authority source: file normalization for security checks
 * Mechanic type: normalization
 */
export function normalizesPathSegments({ modulePath, backslash }) {
  // Authority: Split path by both / and \ to normalize segments
  return modulePath.replaceAll(backslash, "/").split("/");
}

/**
 * BUNDLE 7: normalizesLineEndings
 * Authority source: line ending normalization for file parsing
 * Mechanic type: normalization
 */
export function normalizesLineEndings({ text }) {
  // Authority: Normalize CRLF and CR to LF, then split
  return text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
}

/**
 * BUNDLE 8: normalizesPathForComparison
 * Authority source: platform-aware path normalization
 * Mechanic type: normalization, fallback
 */
export function normalizesPathForComparison({ path, toLowerCase = false }) {
  // Authority: Case-insensitive on Windows, case-sensitive on Unix
  return toLowerCase ? path.toLowerCase() : path;
}

/**
 * BUNDLE 10: buildsErrorResponse
 * Authority source: error-response-serialization
 * Mechanic type: object-construction, serialization
 */
export function buildsErrorResponse({ message, statusCode = 500 }) {
  return { statusCode, body: { error: message } };
}

/**
 * BUNDLE 11: selectsDefaultValue
 * Authority source: missing-value-policy
 * Mechanic type: fallback
 */
export function selectsDefaultValue({ value, defaultValue }) {
  return value || defaultValue;
}

/**
 * BUNDLE 9: validatesConsoleParameters (delegated to adapter)
 * Authority source: index-required-validation, asset-path-validation
 * Mechanic type: fallback/validation
 *
 * Delegates through the validation adapter so the body stays thin and projected.
 */
export function validatesConsoleParameters(parameters) {
  return validatesConsoleParametersFromAdapter(parameters);
}
