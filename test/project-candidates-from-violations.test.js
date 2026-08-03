import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtempSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { executeRelationalQuery } from "../src/query.js";
import { projectAuthorityCandidatesFromViolations } from "../src/projects-authority-from-violations.js";

const consoleWorkspaceRoot = path.resolve(process.cwd(), "src", "console");
const targetModulePaths = new Set([
  "console-authority-bundles.mjs",
  "console-routing-adapter.mjs",
  "console-snippet-adapter.mjs",
  "console-validation-adapter.mjs",
  "serves-query-console.conformant.mjs",
  "serves-query-console.mjs",
  "serves-query-console.projected.mjs",
]);

const forbiddenMechanics = new Set([
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
  "meaning-hidden-in-text",
]);

async function buildsViolationsFromQuery(index) {
  const receipt = await executeRelationalQuery(
    index,
    [
      "SELECT bm.mechanic AS mechanic,",
      "       bm.modulePath AS modulePath,",
      "       bm.sourceReferenceId AS sourceReferenceId,",
      "       bm.fromSymbolId AS fromSymbolId,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       sym.name AS symbolName",
      "FROM bodyMechanics bm",
      "JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId",
      "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId",
      `WHERE bm.modulePath IN (${[...targetModulePaths].map((modulePath) => `'${modulePath}'`).join(", ")})`,
      `AND bm.mechanic IN (${[...forbiddenMechanics].map((mechanic) => `'${mechanic}'`).join(", ")})`,
      "ORDER BY bm.modulePath, sr.startLine, sr.endLine, bm.mechanic",
    ].join(" "),
  );

  assert.equal(receipt.disposition, "RELATIONAL_QUERY_EXECUTED");
  return receipt.result.value.rows;
}

async function buildsGovernanceViolationsFromQuery(index) {
  const receipt = await executeRelationalQuery(
    index,
    [
      "SELECT gr.mechanic AS mechanic,",
      "       gr.profilePath AS modulePath,",
      "       gr.sourceReferenceId AS sourceReferenceId,",
      "       gr.ruleId AS governanceRuleId,",
      "       gr.executionPortEffect AS codePattern,",
      "       gr.semanticAuthorityLocation AS reason,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       NULL AS fromSymbolId,",
      "       NULL AS symbolName",
      "FROM governanceRules gr",
      "JOIN sourceReferences sr ON gr.sourceReferenceId = sr.referenceId",
    ].join(" "),
  );

  assert.equal(receipt.disposition, "RELATIONAL_QUERY_EXECUTED");
  return receipt.result.value.rows;
}

test("authority candidates are projected from query-detected violations", async () => {
  const index = await projectSourceFactsWorkspace({
    workspaceRoot: consoleWorkspaceRoot,
    workspaceId: "console-authority-candidates",
  });

  const violations = [
    ...(await buildsViolationsFromQuery(index)),
    ...(await buildsGovernanceViolationsFromQuery(index)),
  ];
  assert.ok(violations.length > 0, "query scan should find violations to project");

  const outputDirectory = mkdtempSync(path.join(os.tmpdir(), "source-facts-authority-"));
  const codeFile = "src/console/serves-query-console.mjs";
  const authorityFile = "contracts/serves-query-console.authority.json";
  const outputPath = path.join(outputDirectory, "serves-query-console.candidates.json");
  const authorityOutputPath = path.join(outputDirectory, "serves-query-console.authority.draft.json");

  const result = await projectAuthorityCandidatesFromViolations(
    codeFile,
    authorityFile,
    violations,
    outputPath,
    { workspaceRoot: consoleWorkspaceRoot, authorityOutputPath },
  );

  assert.ok(result.success, result.message);
  assert.ok(result.candidatesData, "should return candidate data");
  assert.equal(result.authorityFile, authorityOutputPath);
  assert.equal(result.candidatesData.violations.length, violations.length);
  assert.equal(result.candidatesData.candidates.length, violations.length);
  assert.equal(result.candidatesData.bindingSuggestions.length, violations.length);
  assert.equal(
    result.candidatesData.authorityDraft.authority.mechanics.length,
    result.candidatesData.candidates.length,
    "authority draft should mirror projected candidates",
  );

  const [candidate] = result.candidatesData.candidates;
  assert.ok(candidate.authorityCandidateType, "candidate should have a type");
  assert.ok(candidate.candidateId, "candidate should have an id");
  assert.ok(candidate.source.sourceSnippet, "candidate should capture source evidence");
  assert.ok(Array.isArray(candidate.requiredHumanResolution), "candidate should flag unresolved decisions");

  const [bindingSuggestion] = result.candidatesData.bindingSuggestions;
  assert.ok(bindingSuggestion.violationId, "binding suggestion should name the violation");
  assert.ok(bindingSuggestion.sourceLocation, "binding suggestion should carry source location");

  const written = JSON.parse(readFileSync(outputPath, "utf8"));
  const writtenAuthority = JSON.parse(readFileSync(authorityOutputPath, "utf8"));
  assert.ok(written.authorityDraft, "written JSON should include authority draft");
  assert.ok(written.bindingSuggestions, "written JSON should include binding suggestions");
  assert.ok(writtenAuthority.authority, "authority draft file should contain authority data");
  assert.equal(writtenAuthority.authority.mechanics.length, violations.length);
  assert.equal(written.candidates.length, violations.length);
});
