import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  mechanicAuthorityFamilies,
  resolvesAuthorityFamily,
  resolvesMechanicAuthorityKind,
} from "../src/governance/mechanic-authority-families.js";
import {
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
});

test("repeated candidate projection is byte-identical and stably ordered", () => {
  const occurrences = mechanicAuthorityFamilies.slice(0, 3).map((entry, index) => occurrence(entry.mechanicKind, index + 1));
  const contexts = new Map(occurrences.map((item) => [item.mechanicId, completeContext]));
  const first = projectsExecutionMechanicAuthorityRows(occurrences, contexts);
  const second = projectsExecutionMechanicAuthorityRows(occurrences, contexts);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first.map((row) => row.ExecutionOrdinal), [10, 20, 30]);
});

test("SQL script 010 exposes one read-only native view and the same twelve-family registry", async () => {
  const sql = await readFile(new URL("../scripts/sql/010-create-mechanic-authority-query.sql", import.meta.url), "utf8");
  assert.match(sql, /CREATE VIEW projection\.ExecutionMechanicAuthority/u);
  assert.equal((sql.match(/^\s*\('[^']+',\s+'[^']+',\s+'[^']+'\),?\s*$/gmu) ?? []).length, 12);
  assert.doesNotMatch(sql, /(?:reporting|proof)\./u);
  const viewBody = sql.slice(sql.indexOf("CREATE VIEW projection.ExecutionMechanicAuthority"));
  assert.doesNotMatch(viewBody, /\b(?:INSERT|UPDATE|DELETE|MERGE|EXEC(?:UTE)?)\b/iu);
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
