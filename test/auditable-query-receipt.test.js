import assert from "node:assert/strict";
import { test } from "node:test";
import {
  projectsAuditableQueryReceipt,
  validatesAuditableReceipt,
  createsQueryReference,
  formatsQueryEvidenceForReport,
  QueryEvidenceRegistry,
  QueryHashIndex,
} from "../src/governance/projects-auditable-query-receipt.js";

test("projectsAuditableQueryReceipt generates deterministic content hash from query + results", () => {
  const receipt = {
    queryId: "test.query.v1",
    disposition: "QUERY_EXECUTED",
  };

  const queryText = "SELECT * FROM tests WHERE type = 'governance'";
  const results = [
    { testId: "test-1", name: "Test One" },
    { testId: "test-2", name: "Test Two" },
  ];

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    results
  );

  assert(auditableReceipt.auditability);
  assert(auditableReceipt.auditability.contentHash);
  assert(auditableReceipt.auditability.queryHash);
  assert(auditableReceipt.auditability.resultHash);
  assert(auditableReceipt.auditability.contentAddressable === true);
  assert(auditableReceipt.auditability.timestamp);
});

test("projectsAuditableQueryReceipt produces same hash for identical query and results", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id, name FROM users";
  const results = [{ id: "1", name: "Alice" }];

  const receipt1 = projectsAuditableQueryReceipt(receipt, queryText, results);
  const receipt2 = projectsAuditableQueryReceipt(receipt, queryText, results);

  assert.equal(
    receipt1.auditability.contentHash,
    receipt2.auditability.contentHash,
    "Same query + results should produce same hash"
  );
});

test("projectsAuditableQueryReceipt produces different hash when results change", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM users";

  const receipt1 = projectsAuditableQueryReceipt(receipt, queryText, [
    { id: "1" },
  ]);
  const receipt2 = projectsAuditableQueryReceipt(receipt, queryText, [
    { id: "2" },
  ]);

  assert.notEqual(
    receipt1.auditability.contentHash,
    receipt2.auditability.contentHash,
    "Different results should produce different hash"
  );
});

test("projectsAuditableQueryReceipt normalizes whitespace in query text", () => {
  const receipt = { queryId: "test.query.v1" };
  const results = [{ id: "1" }];

  // Same query with different whitespace
  const query1 = "SELECT id FROM users WHERE active = true";
  const query2 = `SELECT id FROM users
                  WHERE active = true`;

  const receipt1 = projectsAuditableQueryReceipt(receipt, query1, results);
  const receipt2 = projectsAuditableQueryReceipt(receipt, query2, results);

  assert.equal(
    receipt1.auditability.queryHash,
    receipt2.auditability.queryHash,
    "Whitespace-normalized queries should have same hash"
  );
});

test("validatesAuditableReceipt confirms query/results match hash", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const results = [{ id: "1" }];

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    results
  );

  const validation = validatesAuditableReceipt(
    auditableReceipt,
    queryText,
    results
  );

  assert.equal(validation.valid, true);
  assert.equal(validation.contentHashValid, true);
  assert.equal(validation.queryHashValid, true);
  assert.equal(validation.resultHashValid, true);
});

test("validatesAuditableReceipt rejects modified results", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const originalResults = [{ id: "1" }];
  const modifiedResults = [{ id: "2" }];

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    originalResults
  );

  const validation = validatesAuditableReceipt(
    auditableReceipt,
    queryText,
    modifiedResults
  );

  assert.equal(validation.valid, false);
  assert.equal(validation.resultHashValid, false);
  assert(validation.reason.includes("mismatch"));
});

test("createsQueryReference generates report-ready reference with short hash", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const results = [{ id: "1" }];

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    results
  );

  const reference = createsQueryReference(
    auditableReceipt,
    "test-scenario-lineage"
  );

  assert.equal(reference.queryName, "test-scenario-lineage");
  assert.equal(reference.shortHash.length, 12);
  assert(reference.contentHash.length > 32);
  assert(reference.timestamp);
});

test("formatsQueryEvidenceForReport creates markdown evidence section", () => {
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const results = [{ id: "1" }];

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    results
  );

  const reference = createsQueryReference(
    auditableReceipt,
    "test-scenario-lineage"
  );

  const markdown = formatsQueryEvidenceForReport([reference]);

  assert(markdown.includes("test-scenario-lineage"));
  assert(markdown.includes(reference.shortHash));
  assert(markdown.includes("Hash:"));
  assert(markdown.includes("Content:"));
});

test("QueryEvidenceRegistry registers and regenerates query/result pairs by hash", () => {
  const index = new QueryEvidenceRegistry();
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const results = [{ id: "1", name: "Test" }];

  index.register("test-query", queryText, results, receipt);

  const auditableReceipt = projectsAuditableQueryReceipt(
    receipt,
    queryText,
    results
  );
  const contentHash = auditableReceipt.auditability.contentHash;

  const regenerated = index.regenerates(contentHash);

  assert(regenerated);
  assert.equal(regenerated.queryName, "test-query");
  assert.equal(regenerated.queryText, queryText);
  assert.deepEqual(regenerated.results, results);
});

test("QueryHashIndex looks up by query name", () => {
  const index = new QueryHashIndex();
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";
  const results = [{ id: "1" }];

  index.register("named-query", queryText, results, receipt);

  const found = index.lookupByName("named-query");

  assert(found);
  assert.equal(found.queryName, "named-query");
  assert.equal(found.queryText, queryText);
});

test("QueryHashIndex exports index metadata", () => {
  const index = new QueryHashIndex();
  const receipt = { queryId: "test.query.v1" };

  index.register("query-1", "SELECT 1", [{ result: 1 }], receipt);
  index.register("query-2", "SELECT 2", [{ result: 2 }], receipt);

  const exported = index.export();

  assert.equal(exported.documentKind, "query-hash-index.v1");
  assert.equal(exported.queryCount, 2);
  assert.equal(exported.entries.length, 2);
  assert(exported.entries[0].contentHash);
  assert(exported.entries[0].queryHash);
});

test("QueryHashIndex query hash uniquely identifies query independently", () => {
  const index = new QueryHashIndex();
  const receipt = { queryId: "test.query.v1" };
  const queryText = "SELECT id FROM tests";

  // Same query, different results
  index.register("query-1", queryText, [{ id: "1" }], receipt);
  index.register("query-2", queryText, [{ id: "2" }], receipt);

  const entry1 = index.export().entries[0];
  const entry2 = index.export().entries[1];

  assert.equal(
    entry1.queryHash,
    entry2.queryHash,
    "Same query text should have same queryHash"
  );
  assert.notEqual(
    entry1.contentHash,
    entry2.contentHash,
    "Different results should have different contentHash"
  );
});

test("auditable receipt enables evidence traceability in reports", () => {
  // Simulate report generation with evidence
  const report = {
    title: "Transformation Readiness Report",
    sections: [],
  };

  const queryReferences = [];

  // Register multiple queries as evidence
  const index = new QueryHashIndex();
  const receipt = { queryId: "test.query.v1" };

  const queries = [
    {
      name: "test-inventory",
      text: "SELECT COUNT(*) FROM tests",
      results: [{ count: 178 }],
    },
    {
      name: "test-scenario-lineage",
      text: "SELECT * FROM test_scenario_lineage",
      results: [{ testId: "1", scenarioId: "s1" }],
    },
    {
      name: "test-production-reachability",
      text: "SELECT * FROM test_production_reachability",
      results: [{ testId: "1", callables: 825 }],
    },
  ];

  queries.forEach((q) => {
    index.register(q.name, q.text, q.results, receipt);
    const auditableReceipt = projectsAuditableQueryReceipt(
      receipt,
      q.text,
      q.results
    );
    queryReferences.push(
      createsQueryReference(auditableReceipt, q.name)
    );
  });

  // Add to report
  report.evidenceQueries = queryReferences;

  // Verify all queries can be regenerated
  const exported = index.export();
  assert.equal(
    exported.queryCount,
    3,
    "All 3 queries registered in index"
  );

  // Each query can be looked up and regenerated
  queries.forEach((q) => {
    const found = index.lookupByName(q.name);
    assert(found, `Query ${q.name} can be regenerated`);
    assert.deepEqual(found.results, q.results);
  });

  // Markdown evidence can be formatted
  const markdown = formatsQueryEvidenceForReport(queryReferences);
  assert(markdown.includes("test-inventory"));
  assert(markdown.includes("test-scenario-lineage"));
  assert(markdown.includes("test-production-reachability"));
});
