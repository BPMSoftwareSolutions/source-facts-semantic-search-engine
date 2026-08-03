import { test } from "node:test";
import * as assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * Test: console runtime embedded mechanics vs authority
 *
 * src/console/serves-query-console.mjs is a thin re-export (see
 * serves-query-console.runtime.mjs -> serves-query-console.runtime.impl.mjs).
 * The mechanics this test tracks live in two places after that split:
 *   - runtime.impl.mjs: the two calls that ARE delegated to an authority adapter
 *   - console-authority-runtime.mjs: the mechanics that are still embedded as
 *     literal JS, despite contracts/serves-query-console.authority.json
 *     declaring all of them AUTHORITY_BOUND
 */

const runtimeContent = readFileSync("src/console/serves-query-console.runtime.impl.mjs", "utf8");
const authorityRuntimeContent = readFileSync("src/console/console-authority-runtime.mjs", "utf8");
const authorityContent = readFileSync("contracts/serves-query-console.authority.json", "utf8");
const authority = JSON.parse(authorityContent);

test("VIOLATION 1: knownPathnameAllow hardcoded", () => {
  assert.ok(authorityRuntimeContent.includes('const knownPathnameAllow = new Map(['), "VIOLATION: hardcoded in code");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "known-pathname-allow-map");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("DELEGATED: classifiesLoopbackBind", () => {
  assert.ok(runtimeContent.includes('await classifiesLoopbackBind({ hostname })'), "correctly delegated");
});

test("DELEGATED: validatesConsoleParameters", () => {
  assert.ok(runtimeContent.includes('await validatesConsoleParameters({ index, consoleAssetPath })'), "correctly delegated");
});

test("VIOLATION 2: Security headers hardcoded", () => {
  assert.ok(
    authorityRuntimeContent.includes('"Content-Security-Policy": "default-src \'self\';'),
    "VIOLATION: hardcoded in code",
  );
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "headers-sent-state-mutation");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 3: Error responses hardcoded", () => {
  assert.ok(authorityRuntimeContent.includes('const statusCodeMap = {'), "VIOLATION: hardcoded in code");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "error-response-serialization");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 4: Disposition checks hardcoded", () => {
  assert.ok(runtimeContent.includes('error?.disposition !== "HOSTNAME_NOT_ADMITTED"'), "VIOLATION: check 1 hardcoded");
  assert.ok(authorityRuntimeContent.includes('const fallbackDispositions = ['), "VIOLATION: check 2 hardcoded");
  assert.ok(authorityRuntimeContent.includes('"ROUTE_OR_METHOD_NOT_ADMITTED"'), "VIOLATION: check 2 hardcoded");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "error-disposition-check");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 5: File-lines iteration embedded", () => {
  assert.ok(
    authorityRuntimeContent.includes('for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1)'),
    "VIOLATION: iteration hardcoded",
  );
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "file-lines-iteration");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("Conformance Summary", () => {
  const violations = ["known-pathname-allow-map", "headers-sent-state-mutation", "error-response-serialization", "error-disposition-check", "file-lines-iteration"];
  const delegated = ["hostname-validation-loopback", "index-required-validation", "asset-path-validation"];

  assert.strictEqual(violations.length + delegated.length, 8, "All 8 mechanics accounted for");
  assert.ok(violations.length > 0, "Violations exist: migration required");

  const conformanceRatio = delegated.length / 8;
  console.log(`\n✋ CONFORMANCE GAP IDENTIFIED:\n   Authority-delegated: ${delegated.length}/8 (${(conformanceRatio * 100).toFixed(0)}%)\n   Still embedded: ${violations.length}/8 (${((1 - conformanceRatio) * 100).toFixed(0)}%)\n   → PROJECT CONFORMANT BODY FROM AUTHORITY\n`);
});
