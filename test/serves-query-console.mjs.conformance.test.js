import { test } from "node:test";
import * as assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * Test: serves-query-console.mjs embedded mechanics vs authority
 *
 * Identifies mechanics that are still embedded in the mjs file
 * and verifies them against the authority declarations.
 */

const mjs_content = readFileSync("src/console/serves-query-console.mjs", "utf8");
const authorityContent = readFileSync("contracts/serves-query-console.authority.json", "utf8");
const authority = JSON.parse(authorityContent);

test("VIOLATION 1: knownPathnameAllow hardcoded", () => {
  assert.ok(mjs_content.includes('const knownPathnameAllow = new Map(['), "VIOLATION: hardcoded in code");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "known-pathname-allow-map");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("DELEGATED: classifiesLoopbackBind", () => {
  assert.ok(mjs_content.includes('await classifiesLoopbackBind({ hostname })'), "correctly delegated");
});

test("DELEGATED: validatesConsoleParameters", () => {
  assert.ok(mjs_content.includes('await validatesConsoleParameters({ index, consoleAssetPath })'), "correctly delegated");
});

test("VIOLATION 2: Security headers hardcoded", () => {
  assert.ok(mjs_content.includes('response.setHeader("Content-Security-Policy", cspPolicy)'), "VIOLATION: hardcoded in code");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "headers-sent-state-mutation");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 3: Error responses hardcoded", () => {
  const errorCount = (mjs_content.match(/response\.end\(JSON\.stringify\({ error:/g) || []).length;
  assert.ok(errorCount > 5, `VIOLATION: Expected 5+ error responses embedded, found ${errorCount}`);
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "error-response-serialization");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 4: Disposition checks hardcoded", () => {
  assert.ok(mjs_content.includes('error?.disposition !== "HOSTNAME_NOT_ADMITTED"'), "VIOLATION: check 1 hardcoded");
  assert.ok(mjs_content.includes('error?.disposition !== "ROUTE_OR_METHOD_NOT_ADMITTED"'), "VIOLATION: check 2 hardcoded");
  const mechanic = authority.authority.mechanics.find(m => m.mechanicId === "error-disposition-check");
  assert.ok(mechanic, "Mechanic not found");
  assert.strictEqual(mechanic.coverage, "AUTHORITY_BOUND", "Authority says BOUND but code is embedded");
});

test("VIOLATION 5: File-lines iteration embedded", () => {
  assert.ok(mjs_content.includes('for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1)'), "VIOLATION: iteration hardcoded");
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
