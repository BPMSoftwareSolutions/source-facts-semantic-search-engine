import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { projectsRepositorySemanticAnalysis, verifiesRepositorySemanticAnalysis } from "../src/repository-semantics.js";

test("projects typed SQL, Gherkin, Markdown, JSON, package, runtime, and explicit coverage facts", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-facts-semantics-"));
  try {
    await writes(root, "package.json", JSON.stringify({ name: "fixture", version: "1.0.0", scripts: { test: "node --test" }, engines: { node: ">=20" }, dependencies: { ajv: "8.0.0" } }));
    await writes(root, "package-lock.json", JSON.stringify({ lockfileVersion: 3, packages: { "": { version: "1.0.0" }, "node_modules/ajv": { version: "8.0.0", integrity: "sha512:test" } } }));
    await writes(root, "scripts/schema.sql", "-- CREATE TABLE ignored.CommentedOut(Id int);\nCREATE OR ALTER PROCEDURE ingestion.LoadThing AS\nSELECT 'FROM ignored.StringLiteral' AS Value FROM inventory.SourceFile;\nGO\n");
    await writes(root, "features/thing.feature", "&feature:fixture.thing\nFeature: Thing\n\n&scenario:fixture.thing.works\nScenario: It works\n&given:input-exists\nGiven input exists\n");
    await writes(root, "docs/design.md", "# Design\n\n[Contract](../contracts/thing.json)\n\n```sql\nSELECT 1;\n```\n");
    await writes(root, "contracts/thing.json", JSON.stringify({ contract: { id: "thing.v1", admitted: true } }));
    await writes(root, "src/index.mjs", "export const value = 1;\n");
    await writes(root, "assets/value.bin", Buffer.from([0, 255, 4]));

    const image = await capturesRepositoryImage({ workspaceRoot: root, rootId: "semantic-fixture" });
    const first = projectsRepositorySemanticAnalysis(image);
    const second = projectsRepositorySemanticAnalysis(image);
    verifiesRepositorySemanticAnalysis(first);
    assert.equal(first.analysisDigest, second.analysisDigest);
    assert.equal(first.coverage.length, image.artifactCount);
    assert.equal(first.summary.artifactsAnalyzed, image.artifactCount);
    assert.ok(first.facts.every((fact) => fact.authorityDisposition === "OBSERVED_NOT_ADMITTED"));
    assert.ok(first.facts.some((fact) => fact.factKind === "runtime-script" && fact.name === "test"));
    assert.ok(first.facts.some((fact) => fact.factKind === "runtime-dependency" && fact.name === "ajv"));
    assert.ok(first.facts.some((fact) => fact.factKind === "sql-object-declaration" && fact.name === "ingestion.LoadThing"));
    assert.ok(first.facts.some((fact) => fact.factKind === "sql-object-reference" && fact.name === "inventory.SourceFile"));
    assert.ok(!first.facts.some((fact) => fact.name === "ignored.CommentedOut" || fact.name === "ignored.StringLiteral"));
    assert.ok(first.facts.some((fact) => fact.factKind === "gherkin-feature" && fact.name === "fixture.thing"));
    assert.ok(first.facts.some((fact) => fact.factKind === "markdown-heading" && fact.name === "Design"));
    assert.ok(first.facts.some((fact) => fact.factKind === "json-scalar" && fact.name === "/contract/id"));
    assert.equal(first.coverage.find((row) => row.relativePath === "src/index.mjs").analysisDisposition, "DELEGATED_TO_SOURCE_FACT_ENGINE");
    assert.equal(first.coverage.find((row) => row.relativePath === "assets/value.bin").analysisDisposition, "BINARY_CONTENT");
  } finally {
    await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

test("records an analyzer failure without losing repository-wide coverage", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-facts-semantics-invalid-"));
  try {
    await writes(root, "contracts/invalid.json", "{ invalid }");
    const image = await capturesRepositoryImage({ workspaceRoot: root, rootId: "invalid-semantic-fixture" });
    const analysis = projectsRepositorySemanticAnalysis(image);
    assert.equal(analysis.coverage.length, 1);
    assert.equal(analysis.coverage[0].analysisDisposition, "ANALYZER_FAILED");
    assert.match(analysis.coverage[0].diagnostic, /JSON/u);
  } finally {
    await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

async function writes(root, relativePath, content) {
  const target = path.join(root, ...relativePath.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}
