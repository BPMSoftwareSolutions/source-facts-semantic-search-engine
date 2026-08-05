import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { projectsRepositorySemanticAnalysis } from "../src/repository-semantics.js";
import { loadsRepositorySemanticAnalysisIntoSqlServer } from "../src/sqlserver/repository-semantics.js";

test("loads normalized repository knowledge as current observed SQL rows", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-facts-semantics-sql-"));
  try {
    await mkdir(path.join(root, "scripts"), { recursive: true });
    await writeFile(path.join(root, "scripts", "query.sql"), "SELECT * FROM inventory.SourceFile;\n", "utf8");
    const image = await capturesRepositoryImage({ workspaceRoot: root, rootId: "semantic-sql-fixture" });
    const analysis = projectsRepositorySemanticAnalysis(image);
    let capturedQuery = null;
    const receipt = await loadsRepositorySemanticAnalysisIntoSqlServer({
      analysis,
      connection: { buildsArgs: () => [], appliesToChildEnv: (env) => env },
      queryRunner: async ({ query }) => {
        capturedQuery = query;
        return [`R|${analysis.analysisDigest}|${analysis.summary.artifactsAnalyzed}|${analysis.summary.semanticFacts}|REPOSITORY_SEMANTICS_ADMITTED_AS_OBSERVATION`];
      },
    });
    assert.equal(receipt.disposition, "REPOSITORY_SEMANTICS_ADMITTED_AS_OBSERVATION");
    assert.equal(receipt.semanticFactCount, analysis.facts.length);
    assert.match(capturedQuery, /ingestion\.LoadRepositorySemanticAnalysis/u);
    assert.match(capturedQuery, /OBSERVED_NOT_ADMITTED/u);
  } finally {
    await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});
