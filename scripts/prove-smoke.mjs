#!/usr/bin/env node
import assert from "node:assert/strict";
import path from "node:path";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { executeRelationalQuery } from "../src/query.js";
import { validatesSourceFactIndex } from "../src/validate-index.js";

const defaultWorkspace = "C:/lab/repos/contract-driven-artifact-governance-engine";
const workspaceRoot = path.resolve(process.env.SOURCE_FACTS_SMOKE_WORKSPACE ?? process.argv[2] ?? defaultWorkspace);
const workspaceId = path.basename(workspaceRoot);
const expectedMechanics = [
  "branch",
  "iteration",
  "exception-handling",
  "throw",
  "object-construction",
  "serialization",
  "normalization",
  "validation",
  "fallback",
  "retry",
  "state-mutation",
];

const first = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId });
const second = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId });
await validatesSourceFactIndex(first);
await validatesSourceFactIndex(second);
assert.equal(first.indexId, second.indexId, "indexId drifted across unchanged projections");
assert.ok(first.files.length > 0, "no source files were projected");
assert.ok(first.documents.length > 0, "no JSON facts were projected");

const v8Rules = first.governanceRules.filter((rule) =>
  rule.profilePath === "profiles/closed-world-artifact-conformance.v8.json"
  && expectedMechanics.includes(rule.mechanic));
assert.deepEqual(v8Rules.map((rule) => rule.mechanic), expectedMechanics);

const symbolById = new Map(first.symbols.map((symbol) => [symbol.symbolId, symbol]));
for (const relationship of first.relationships) {
  if (relationship.fromSymbolId === null) {
    assert.equal(relationship.fromSymbolResolution, "unresolved");
    continue;
  }
  assert.equal(relationship.fromSymbolResolution, "enclosing-callable");
  assert.ok(["function", "method", "constructor"].includes(symbolById.get(relationship.fromSymbolId)?.kind));
}

const query = await executeRelationalQuery(
  first,
  "SELECT mechanic, profilePath, sourceReferenceId FROM governanceRules LIMIT 3",
);
assert.equal(query.disposition, "RELATIONAL_QUERY_EXECUTED");
assert.equal(query.result.value.rowCount, 3);

console.log(JSON.stringify({
  disposition: "SOURCE_FACTS_SMOKE_PROOF_COMPLETE",
  workspaceRoot,
  indexId: first.indexId,
  files: first.files.length,
  symbols: first.symbols.length,
  relationships: first.relationships.length,
  documentFacts: first.documents.length,
  governanceRules: first.governanceRules.length,
  bodyMechanics: first.bodyMechanics.length,
  v8ForbiddenMechanicsProved: expectedMechanics.length,
  queryDisposition: query.disposition,
}, null, 2));
