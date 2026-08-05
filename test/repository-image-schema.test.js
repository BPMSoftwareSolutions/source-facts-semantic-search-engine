import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../scripts/sql/016-create-repository-image.sql", import.meta.url), "utf8");

test("repository image schema keeps one current root image and deduplicates exact content", () => {
  assert.match(sql, /CREATE TABLE inventory\.RepositoryImage/u);
  assert.match(sql, /CONSTRAINT PK_RepositoryImage PRIMARY KEY \(RootId\)/u);
  assert.match(sql, /CREATE TABLE inventory\.RepositoryContent/u);
  assert.match(sql, /CONSTRAINT PK_RepositoryContent PRIMARY KEY \(ContentDigest\)/u);
  assert.match(sql, /CREATE TABLE inventory\.RepositoryArtifact/u);
  assert.match(sql, /AuthorityDisposition = 'OBSERVED_NOT_ADMITTED'/u);
  assert.match(sql, /CREATE OR ALTER PROCEDURE ingestion\.LoadRepositoryImage/u);
  assert.match(sql, /DELETE FROM inventory\.RepositoryArtifact WHERE RootId = @RootId/u);
  assert.match(sql, /DELETE FROM observation\.RepositorySemanticAnalysis WHERE RootId = @RootId/u);
  assert.match(sql, /REPOSITORY_CURRENT_IMAGE_ADMITTED/u);
});
