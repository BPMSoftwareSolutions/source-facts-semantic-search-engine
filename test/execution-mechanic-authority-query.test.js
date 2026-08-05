import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import {
  mechanicAuthorityFamilies,
  resolvesAuthorityFamily,
  resolvesMechanicAuthorityKind,
} from "../src/governance/mechanic-authority-families.js";
import {
  derivesCanonicalSourceOrderKey,
  projectsExecutionMechanicAuthorityData,
  projectsExecutionMechanicAuthorityRows,
} from "../src/governance/projects-execution-mechanic-authority-data.js";

const completeContext = Object.freeze({
  applicationId: "source-facts-semantic-search-engine",
  featureId: "source-facts.project-authority-from-execution-mechanics",
  scenarioId: "source-facts.project-mechanic-authority-data",
  obligationId: "every-classified-mechanic-produces-one-authority-data-result",
  responsibilityId: "projects-execution-mechanic-authority-data",
  sourceFactIndexId: "sha256:index",
});

function occurrence(mechanicKind, ordinal = 1) {
  return Object.freeze({
    mechanicId: `sha256:mechanic-${ordinal}`,
    mechanic: mechanicKind,
    rootId: "workspace-root",
    modulePath: "src/example.js",
    sourceStartLine: ordinal,
    sourceStartColumn: 1,
    sourceReferenceId: `src/example.js:${ordinal}:1`,
  });
}

test("the canonical registry closes all twelve mechanic families and authority kinds", () => {
  assert.equal(mechanicAuthorityFamilies.length, 12);
  assert.equal(new Set(mechanicAuthorityFamilies.map((entry) => entry.mechanicKind)).size, 12);
  assert.equal(new Set(mechanicAuthorityFamilies.map((entry) => entry.authorityFamily)).size, 12);
  for (const entry of mechanicAuthorityFamilies) {
    assert.equal(resolvesAuthorityFamily(entry.mechanicKind), entry.authorityFamily);
    assert.equal(resolvesMechanicAuthorityKind(entry.mechanicKind), entry.authorityKind);
  }
});

test("every known mechanic projects one standard non-admitted candidate row", () => {
  for (const [index, registryEntry] of mechanicAuthorityFamilies.entries()) {
    const row = projectsExecutionMechanicAuthorityData(occurrence(registryEntry.mechanicKind, index + 1), completeContext);
    assert.equal(row.AuthorityFamily, registryEntry.authorityFamily);
    assert.equal(row.AuthorityData.authorityKind, registryEntry.authorityKind);
    assert.equal(row.ProjectionDisposition, "HUMAN_SEMANTIC_COMPLETION_REQUIRED");
    assert.ok(row.MissingFields.length > 0);
    assert.equal(JSON.stringify(row).includes("AUTHORITY_ADMITTED"), false);
  }
});

test("candidate projection returns explicit lineage, evidence, and unsupported dispositions", () => {
  const mechanic = occurrence("branch");
  assert.equal(projectsExecutionMechanicAuthorityData(mechanic).ProjectionDisposition, "LINEAGE_CONTEXT_INCOMPLETE");
  assert.equal(
    projectsExecutionMechanicAuthorityData({ ...mechanic, sourceReferenceId: null }, completeContext).ProjectionDisposition,
    "SOURCE_EVIDENCE_INCOMPLETE",
  );
  assert.equal(
    projectsExecutionMechanicAuthorityData({ ...mechanic, mechanic: "unknown" }, completeContext).ProjectionDisposition,
    "AUTHORITY_FAMILY_UNSUPPORTED",
  );
  const ambiguous = projectsExecutionMechanicAuthorityData(mechanic, { ...completeContext, lineageCandidateCount: 2 });
  assert.equal(ambiguous.ProjectionDisposition, "LINEAGE_CONTEXT_AMBIGUOUS");
  assert.equal(ambiguous.ResponsibilityId, null);
});

test("canonical source order is independent of caller order and agrees with its ordinal", () => {
  const occurrences = [
    { ...occurrence("branch", 8), modulePath: "src/z.js", sourceReferenceId: "src/z.js:8:1" },
    { ...occurrence("iteration", 2), modulePath: "src/a.js", sourceReferenceId: "src/a.js:2:1" },
    { ...occurrence("throw", 1), rootId: "another-root", modulePath: "src/a.js", sourceReferenceId: "src/a.js:1:1" },
  ];
  const contexts = new Map(occurrences.map((item) => [item.mechanicId, completeContext]));
  const forward = projectsExecutionMechanicAuthorityRows(occurrences, contexts);
  const shuffled = projectsExecutionMechanicAuthorityRows([occurrences[1], occurrences[0], occurrences[2]], contexts);
  assert.deepEqual(shuffled, forward);
  assert.deepEqual(forward.map((row) => row.ObservedOrdinal), [10, 20, 30]);
  assert.deepEqual(forward.map((row) => row.SourceOrderKey), [...forward.map((row) => row.SourceOrderKey)].sort());
  assert.equal(forward[0].SourceOrderKey, derivesCanonicalSourceOrderKey(occurrences[2], completeContext));
});

test("repeated candidate projection reports observed order without claiming execution order", () => {
  const occurrences = mechanicAuthorityFamilies.slice(0, 3).map((entry, index) => occurrence(entry.mechanicKind, index + 1));
  const contexts = new Map(occurrences.map((item) => [item.mechanicId, completeContext]));
  const first = projectsExecutionMechanicAuthorityRows(occurrences, contexts);
  const second = projectsExecutionMechanicAuthorityRows(occurrences, contexts);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first.map((row) => row.ObservedOrdinal), [10, 20, 30]);
  assert.deepEqual(first.map((row) => row.ExecutionOrdinal), [null, null, null]);
  assert.equal(first.every((row) => row.MissingFields.includes("executionOrdinal")), true);
  assert.equal(first.every((row) => typeof row.SourceOrderKey === "string"), true);
});

test("SQL script 010 exposes one read-only native view and the same twelve-family registry", async () => {
  const sql = await readFile(new URL("../scripts/sql/010-create-mechanic-authority-query.sql", import.meta.url), "utf8");
  assert.match(sql, /CREATE VIEW projection\.ExecutionMechanicAuthority/u);
  assert.equal((sql.match(/^\s*\('[^']+',\s+'[^']+',\s+'[^']+'\),?\s*$/gmu) ?? []).length, 12);
  assert.doesNotMatch(sql, /(?:reporting|proof)\./u);
  const viewBody = sql.slice(sql.indexOf("CREATE VIEW projection.ExecutionMechanicAuthority"));
  assert.doesNotMatch(viewBody, /\b(?:INSERT|UPDATE|DELETE|MERGE|EXEC(?:UTE)?)\b/iu);
  assert.match(viewBody, /AS ObservedOrdinal/u);
  assert.match(viewBody, /COUNT\(\*\) OVER[\s\S]*AS CandidateCount/u);
  assert.match(viewBody, /selectedLineage\.CandidateCount = 1/u);
  assert.match(viewBody, /LINEAGE_CONTEXT_AMBIGUOUS/u);
  assert.match(viewBody, /CONCAT\(mechanic\.RootId, N'\|', mechanic\.ModulePath/u);
  assert.match(viewBody, /CAST\(NULL AS int\) AS ExecutionOrdinal/u);
  assert.match(viewBody, /HUMAN_CLASSIFICATION_REQUIRED/u);
  for (const entry of mechanicAuthorityFamilies) {
    assert.ok(sql.includes(`'${entry.mechanicKind}'`));
    assert.ok(sql.includes(`'${entry.authorityFamily}'`));
  }
});

test("the SourceFacts JSON schema closes over exactly the canonical mechanic registry", async () => {
  const schema = JSON.parse(await readFile(new URL("../contracts/source-fact-index.schema.v1.json", import.meta.url), "utf8"));
  const schemaKinds = schema.properties.bodyMechanics.items.properties.mechanic.enum;
  assert.deepEqual(schemaKinds, mechanicAuthorityFamilies.map((entry) => entry.mechanicKind));
});

test("the candidate-row schema closes every family and forbids semantic execution order claims", async () => {
  const schema = JSON.parse(await readFile(
    new URL("../schemas/execution-mechanic-authority-candidate.schema.json", import.meta.url),
    "utf8",
  ));
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  for (const [index, entry] of mechanicAuthorityFamilies.entries()) {
    const row = projectsExecutionMechanicAuthorityData(
      occurrence(entry.mechanicKind, index + 1),
      { ...completeContext, observedOrdinal: (index + 1) * 10 },
    );
    assert.equal(validate(row), true, JSON.stringify(validate.errors));
    assert.equal(row.ExecutionOrdinal, null);
  }
  const unsupported = projectsExecutionMechanicAuthorityData(
    { ...occurrence("unknown", 99), mechanic: "unknown" },
    { ...completeContext, observedOrdinal: 10 },
  );
  assert.equal(validate(unsupported), true, JSON.stringify(validate.errors));
});
