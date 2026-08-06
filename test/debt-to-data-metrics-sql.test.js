import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/024-create-debt-to-data-metrics.sql", import.meta.url), "utf8");

test("derives repository-level debt-to-data ratios from the existing operational execution summary only", () => {
  assert.match(sql, /CREATE OR ALTER VIEW projection\.CurrentDebtToDataMetrics AS/u);
  assert.match(sql, /FROM projection\.CurrentOperationalExecutionSummary summary/u);
  assert.match(sql, /summary\.OutsideKernelViolationCount\) \/ summary\.MechanicCount/u);
  assert.match(sql, /AS DebtToDataRatio/u);
  assert.match(sql, /summary\.AuthorityBoundViolationCount\) \/ summary\.OutsideKernelViolationCount/u);
  assert.match(sql, /AS AuthorityRecoveryCoverageRatio/u);
  assert.match(sql, /AS KernelConformanceRatio/u);
  assert.match(sql, /AS OwnershipCoverageRatio/u);
  assert.match(sql, /AS InterfaceReachCoverageRatio/u);
  assert.match(sql, /AS TestReachCoverageRatio/u);
  assert.match(sql, /WHEN summary\.MechanicCount = 0 THEN NULL/u);
});

test("classifies each mechanic occurrence into the debt-taxonomy classes derivable from current facts", () => {
  assert.match(sql, /CREATE OR ALTER VIEW projection\.CurrentMechanicDebtClassification AS/u);
  assert.match(sql, /FROM projection\.CurrentExecutionMechanicOccurrence mechanic/u);
  for (const debtClass of ["OWNERSHIP_DEBT", "MECHANIC_DEBT", "AUTHORITY_DEBT", "REPLACEMENT_DEBT", "NO_DEBT"]) {
    assert.match(sql, new RegExp(`'${debtClass}'`, "u"));
  }
  assert.match(sql, /WHEN mechanic\.ResponsibilityId IS NULL THEN 'OWNERSHIP_DEBT'/u);
  assert.match(sql, /WHEN mechanic\.AuthorityProjectionDisposition IN \('LINEAGE_CONTEXT_INCOMPLETE', 'LINEAGE_CONTEXT_AMBIGUOUS'\) THEN 'OWNERSHIP_DEBT'/u);
  assert.match(sql, /WHEN mechanic\.AuthorityProjectionDisposition IN \('AUTHORITY_FAMILY_UNSUPPORTED', 'SOURCE_EVIDENCE_INCOMPLETE'\) THEN 'MECHANIC_DEBT'/u);
  assert.match(sql, /WHEN mechanic\.AuthorityProjectionDisposition = 'HUMAN_SEMANTIC_COMPLETION_REQUIRED' THEN 'AUTHORITY_DEBT'/u);
  assert.match(sql, /WHEN mechanic\.AdmissionDisposition = 'AUTHORITY_ADMITTED' THEN 'REPLACEMENT_DEBT'/u);
  assert.match(sql, /WHEN mechanic\.ViolationDisposition IN \('KERNEL_EXECUTION_ALLOWED', 'FALSE_POSITIVE_EXCLUDED'\) THEN 'NO_DEBT'/u);
});

test("does not fabricate projection, duplication, or inactive-ontology debt classes it cannot yet compute", () => {
  for (const unsupportedClass of ["PROJECTION_DEBT", "DUPLICATION_DEBT", "INACTIVE_ONTOLOGY_DEBT"]) {
    assert.doesNotMatch(sql, new RegExp(`'${unsupportedClass}'`, "u"));
  }
});
