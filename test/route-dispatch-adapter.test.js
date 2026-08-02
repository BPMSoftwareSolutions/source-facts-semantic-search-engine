import assert from "node:assert/strict";
import test from "node:test";
import { classifiesRoute } from "../source-facts-query-console/src/route-dispatch-adapter.mjs";

// Equivalence fixtures for the route-dispatch mechanic migrated out of
// src/console/serves-query-console.js's handlesRequest into
// source-facts-query-console/contracts/route-dispatch.authority.json.
// See docs/serves-query-console-closure-tracker.md.

test("classifies every admitted (pathname, method) pair to its routeId", () => {
  const admitted = [
    ["/", "GET", "console-html"],
    ["/", "HEAD", "console-html"],
    ["/index.html", "GET", "console-html"],
    ["/index.html", "HEAD", "console-html"],
    ["/api/index-info", "GET", "index-info"],
    ["/api/index-info", "HEAD", "index-info"],
    ["/api/query", "POST", "query"],
    ["/api/snippet", "GET", "snippet"],
    ["/api/snippet", "HEAD", "snippet"],
  ];
  for (const [pathname, method, routeId] of admitted) {
    const result = classifiesRoute({ pathname, method });
    assert.deepEqual(result, { kind: "route-dispatch-result", routeId });
  }
});

test("rejects an unknown pathname with the same disposition as a known pathname with the wrong method", () => {
  const rejected = [
    ["/nowhere", "GET"],
    ["/api/query", "GET"],
    ["/api/snippet", "POST"],
    ["/", "DELETE"],
  ];
  for (const [pathname, method] of rejected) {
    assert.throws(
      () => classifiesRoute({ pathname, method }),
      (error) => error.disposition === "ROUTE_OR_METHOD_NOT_ADMITTED",
    );
  }
});
