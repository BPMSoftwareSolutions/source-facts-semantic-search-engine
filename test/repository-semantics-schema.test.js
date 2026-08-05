import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/017-create-repository-semantics.sql", import.meta.url), "utf8");

test("repository semantics schema stores one current analysis with complete explicit coverage", () => {
  assert.match(sql, /CREATE TABLE observation\.RepositorySemanticAnalysis/u);
  assert.match(sql, /CONSTRAINT PK_RepositorySemanticAnalysis PRIMARY KEY \(RootId\)/u);
  assert.match(sql, /CREATE TABLE observation\.RepositoryArtifactSemanticCoverage/u);
  assert.match(sql, /DELEGATED_TO_SOURCE_FACT_ENGINE/u);
  assert.match(sql, /ANALYZER_FAILED/u);
  assert.match(sql, /CREATE TABLE observation\.RepositorySemanticFact/u);
  assert.match(sql, /AuthorityDisposition = 'OBSERVED_NOT_ADMITTED'/u);
  assert.match(sql, /CREATE OR ALTER PROCEDURE ingestion\.LoadRepositorySemanticAnalysis/u);
  assert.match(sql, /CREATE OR ALTER VIEW reporting\.CurrentRepositoryKnowledge/u);
  assert.doesNotMatch(sql, /DROP TABLE observation\.Repository/u);
});
