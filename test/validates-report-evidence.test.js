import assert from "node:assert/strict";
import { test } from "node:test";
import {
  validatesSectionEvidence,
  parseAndExecuteQuery,
  exportsValidationJSON,
} from "../src/governance/validates-report-evidence.js";
import crypto from "node:crypto";

function createHashForQuery(queryText, results) {
  const normalizedQuery = queryText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ");
  const resultJson = JSON.stringify(results, null, 0);
  const combined = `${normalizedQuery}\n---\n${resultJson}`;

  return crypto.createHash("sha256").update(combined).digest("hex");
}

const governanceFixture = Object.freeze({
  testTraceability: {
    testPostures: [
      { testId: "t1", testName: "alpha", posture: "OBLIGATION_SIGNAL_PROOF" },
      { testId: "t2", testName: "beta", posture: "DIRECT_PROOF" },
    ],
  },
});

test("validatesSectionEvidence validates hash for results computed from real governance data", () => {
  const queryText = "SELECT COUNT(*) FROM reportTestPostures";
  const results = parseAndExecuteQuery(queryText, governanceFixture);
  const expectedHash = createHashForQuery(queryText, results);

  const validation = validatesSectionEvidence(queryText, expectedHash, governanceFixture);

  assert.equal(validation.valid, true);
  assert.equal(validation.hashMatches, true);
  assert.equal(validation.resultRowCount, 1);
});

test("validatesSectionEvidence detects hash mismatch", () => {
  const queryText = "SELECT COUNT(*) FROM reportTestPostures";
  const wrongHash = "a".repeat(64);

  const validation = validatesSectionEvidence(queryText, wrongHash, governanceFixture);

  assert.equal(validation.valid, false);
  assert.equal(validation.hashMatches, false);
});

test("validatesSectionEvidence fails closed on an unknown table instead of returning invented rows", () => {
  const queryText = "SELECT * FROM unknown_table";
  const someHash = "a".repeat(64);

  const validation = validatesSectionEvidence(queryText, someHash, governanceFixture);

  assert.equal(validation.valid, false);
  assert.equal(validation.queryExecuted, false);
  assert.match(validation.error, /unknown governance table/i);
});

test("validatesSectionEvidence fails closed when no governance data is supplied", () => {
  const queryText = "SELECT COUNT(*) FROM reportTestPostures";
  const someHash = "a".repeat(64);

  const validation = validatesSectionEvidence(queryText, someHash, {});

  assert.equal(validation.valid, false);
  assert.equal(validation.queryExecuted, false);
  assert.match(validation.error, /refusing to fabricate/i);
});

test("parseAndExecuteQuery refuses to fabricate results when governance data is missing", () => {
  assert.throws(
    () => parseAndExecuteQuery("SELECT COUNT(*) FROM reportTestPostures", {}),
    /refusing to fabricate/i
  );
  assert.throws(
    () => parseAndExecuteQuery("SELECT COUNT(*) FROM reportTestPostures", null),
    /refusing to fabricate/i
  );
});

test("parseAndExecuteQuery rejects unknown tables instead of returning invented rows", () => {
  assert.throws(
    () => parseAndExecuteQuery("SELECT * FROM mechanic_analysis", governanceFixture),
    /unknown governance table/i
  );
});

test("parseAndExecuteQuery extracts COUNT(*) from real governance data", () => {
  const results = parseAndExecuteQuery("SELECT COUNT(*) FROM reportTestPostures", governanceFixture);

  assert.deepEqual(results, [{ count: 2 }]);
});

test("parseAndExecuteQuery filters real governance rows with a WHERE clause", () => {
  const results = parseAndExecuteQuery(
    "SELECT * FROM reportTestPostures WHERE posture = 'DIRECT_PROOF'",
    governanceFixture
  );

  assert.equal(results.length, 1);
  assert.equal(results[0].testId, "t2");
});

test("exportsValidationJSON creates proper structure", () => {
  const validationResults = {
    validatedAt: "2026-08-07T15:00:00Z",
    reportPath: "/path/to/report.md",
    governanceArtifact: "/path/to/artifact.json",
    sectionsValidated: 4,
    sectionsValid: 4,
    valid: true,
    errors: [],
    sections: [
      {
        sectionNumber: 1,
        valid: true,
        hashMatches: true,
        resultRowCount: 10,
      },
    ],
  };

  const json = exportsValidationJSON(validationResults);

  assert.equal(json.documentKind, "report-evidence-validation.v1");
  assert.equal(json.summary.totalSections, 4);
  assert.equal(json.summary.validSections, 4);
  assert.equal(json.summary.overallValid, true);
  assert.equal(json.sections.length, 1);
});

test("parseAndExecuteQuery is insensitive to extra internal whitespace even though hashing is not", () => {
  const query1 = "SELECT COUNT(*) FROM reportTestPostures";
  const query2 = `SELECT  COUNT(*)  FROM  reportTestPostures`; // Extra spaces

  // Execution normalizes whitespace, so both queries hit the same table and produce the same rows.
  assert.deepEqual(
    parseAndExecuteQuery(query1, governanceFixture),
    parseAndExecuteQuery(query2, governanceFixture)
  );

  // Hashing is over the literal (line-trimmed) query text, so a hash computed for one
  // exact query string does not validate against a differently-formatted equivalent query.
  const hash = createHashForQuery(query1, parseAndExecuteQuery(query1, governanceFixture));
  assert.equal(validatesSectionEvidence(query1, hash, governanceFixture).valid, true);
  assert.equal(validatesSectionEvidence(query2, hash, governanceFixture).valid, false);
});

test("validation identifies section count from real governance rows", () => {
  const queryText = "SELECT * FROM reportTestPostures";
  const results = parseAndExecuteQuery(queryText, governanceFixture);
  const hash = createHashForQuery(queryText, results);

  const validation = validatesSectionEvidence(queryText, hash, governanceFixture);

  assert.equal(validation.resultRowCount, 2);
});
