import assert from "node:assert/strict";
import { test } from "node:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { generatesConnectiveTissue } from "../src/governance/generates-connective-tissue.js";
import { discoversHealingDrafts } from "../src/governance/discovers-healing-drafts.js";
import { summarizesHealingDraftRegistry } from "../src/governance/summarizes-healing-drafts.js";
import { projectsSelfGovernanceReport } from "../src/governance/projects-self-governance-report.js";
import { validatesSelfGovernanceReport } from "../src/governance/validates-self-governance-report.js";
import { formatsSelfGovernanceReportMarkdown, formatsSelfGovernanceReportSummary } from "../src/governance/formats-self-governance-report-summary.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = path.join(repoRoot, "src", "cli.js");

function buildsMinimalIndex() {
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "healing-test", workspaceRoot: "C:/tmp/workspace" } },
    workspace: { workspaceId: "healing-test" },
    symbols: [],
    relationships: [],
    dataflows: [],
    sourceReferences: [],
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
  };
}

function buildsHealingDraft({ subjectId = "success-response-serialization", healingDisposition = "HEALING_DRAFT_GENERATED", confidence = 0.93, applicableTissues = ["authorityCompletionDraft"] } = {}) {
  const section = (applicable, rationale, extras = {}) => Object.freeze({ applicable, rationale, ...extras });

  return Object.freeze({
    documentKind: "connective-tissue-draft-batch.v1",
    lifecycle: "DRAFT_NOT_ADMITTED",
    subject: Object.freeze({ subjectId, knownGaps: Object.freeze(["missing success-path serialization authority"]) }),
    inference: Object.freeze({ resolvedModel: "gemini-flash-latest" }),
    reviewFindings: Object.freeze([]),
    draft: Object.freeze({
      healingDisposition,
      missingTissue: Object.freeze(["AUTHORITY_DOCUMENT_MISSING"]),
      confidence,
      evidenceReferences: Object.freeze(["src/console/serves-query-console.runtime.impl.mjs"]),
      authorityCompletionDraft: section(applicableTissues.includes("authorityCompletionDraft"), "The response serialization gap is visible in the console runtime.", {
        candidateAuthorityId: "success-response-serialization",
        family: "serialization",
        mechanics: Object.freeze([]),
      }),
      bindingDraft: section(applicableTissues.includes("bindingDraft"), "No direct binding exists yet."),
      runtimeWiringDraft: section(applicableTissues.includes("runtimeWiringDraft"), "No runtime wiring draft is needed yet."),
      collapsedBodyDraft: section(applicableTissues.includes("collapsedBodyDraft"), "No collapsed body draft is needed yet."),
      equivalenceVectorDraft: section(applicableTissues.includes("equivalenceVectorDraft"), "No equivalence vector draft is needed yet."),
    }),
  });
}

test("generatesConnectiveTissue builds a structured repair packet and preserves the returned draft", async () => {
  let capturedRequest;
  const responseDraft = {
    healingDisposition: "HEALING_DRAFT_GENERATED",
    missingTissue: ["AUTHORITY_DOCUMENT_MISSING"],
    confidence: 0.93,
    evidenceReferences: ["src/console/serves-query-console.runtime.impl.mjs"],
    authorityCompletionDraft: { applicable: true, rationale: "Authority completion is needed.", candidateAuthorityId: "success-response-serialization", family: "serialization", mechanics: [] },
    bindingDraft: { applicable: false, rationale: "No binding yet." },
    runtimeWiringDraft: { applicable: false, rationale: "No wiring yet." },
    collapsedBodyDraft: { applicable: false, rationale: "No body replacement yet." },
    equivalenceVectorDraft: { applicable: false, rationale: "No proof yet." },
  };

  const batch = await generatesConnectiveTissue({
    subjectId: "success-response-serialization",
    authorityEvidence: "contracts/serves-query-console.authority.draft.json",
    executableEvidence: "src/console/serves-query-console.runtime.impl.mjs",
    existingWiring: "serializesErrorResponse is already delegated",
    knownGaps: ["success-path JSON.stringify is duplicated inline"],
    requiredOutputs: ["authority-draft", "binding-draft"],
    requestId: "test-request",
    invoke: async (modelRequest) => {
      capturedRequest = modelRequest;
      return {
        requestId: "test-request",
        invocationId: "inv-1",
        disposition: "MODEL_RESPONSE_OBTAINED",
        resolvedAuthority: {
          providerAuthorityId: "primary-cognitive-provider",
          providerKind: "gemini",
          resolvedModel: "gemini-flash-latest",
        },
        result: { format: "json", structuredValue: responseDraft },
        usage: { totalTokens: 42 },
        proof: {
          requestHash: "sha256:abc",
          responseHash: "sha256:def",
          startedAt: "2026-08-03T21:17:46.489Z",
          completedAt: "2026-08-03T21:17:47.489Z",
          durationMilliseconds: 1000,
        },
      };
    },
  });

  assert.equal(batch.documentKind, "connective-tissue-draft-batch.v1");
  assert.equal(batch.lifecycle, "DRAFT_NOT_ADMITTED");
  assert.equal(batch.subject.subjectId, "success-response-serialization");
  assert.deepEqual(batch.subject.knownGaps, ["success-path JSON.stringify is duplicated inline"]);
  assert.equal(batch.draft.healingDisposition, "HEALING_DRAFT_GENERATED");
  assert.equal(batch.inference.resolvedModel, "gemini-flash-latest");
  assert.equal(capturedRequest.interaction.messages[1].content.includes("success-response-serialization"), true);
  assert.equal(capturedRequest.interaction.messages[1].content.includes("serializesErrorResponse"), true);
  assert.equal(capturedRequest.responsePolicy.maximumOutputTokens, 32768);
  assert.equal(capturedRequest.responsePolicy.temperature, 0);
});

test("discoversHealingDrafts and summarizesHealingDraftRegistry count reviewed-only drafts without trusting unrelated JSON", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-healing-"));
  try {
    await mkdir(path.join(tempDir, "nested"), { recursive: true });
    await writeFile(path.join(tempDir, "draft-a.json"), JSON.stringify(buildsHealingDraft({ applicableTissues: ["authorityCompletionDraft", "bindingDraft"] })), "utf8");
    await writeFile(path.join(tempDir, "nested", "draft-b.json"), JSON.stringify(buildsHealingDraft({ subjectId: "normalizes-line-endings", healingDisposition: "INSUFFICIENT_EVIDENCE", applicableTissues: ["runtimeWiringDraft"] })), "utf8");
    await writeFile(path.join(tempDir, "not-a-draft.json"), JSON.stringify({ documentKind: "something-else.v1" }), "utf8");
    await writeFile(path.join(tempDir, "broken.json"), "{ not valid json", "utf8");

    const batches = await discoversHealingDrafts(tempDir, { relativeTo: tempDir });
    assert.deepEqual(batches.map((batch) => batch.filePath), ["draft-a.json", "nested/draft-b.json"]);

    const registry = summarizesHealingDraftRegistry(batches);
    assert.equal(registry.totalDrafts, 2);
    assert.equal(registry.byDisposition.HEALING_DRAFT_GENERATED, 1);
    assert.equal(registry.byDisposition.INSUFFICIENT_EVIDENCE, 1);
    assert.equal(registry.byTissueType.authorityCompletionDraft, 1);
    assert.equal(registry.byTissueType.bindingDraft, 1);
    assert.equal(registry.byTissueType.runtimeWiringDraft, 1);
    assert.equal(registry.drafts[0].subjectId, "success-response-serialization");
    assert.equal(registry.drafts[1].subjectId, "normalizes-line-endings");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("projectsSelfGovernanceReport and its formatters surface the healing draft registry", async () => {
  const index = buildsMinimalIndex();
  const healingDraftBatches = [{ filePath: "healing/success-response-serialization.connective-tissue-draft.json", document: buildsHealingDraft({ applicableTissues: ["authorityCompletionDraft", "bindingDraft"] }) }];

  const report = await projectsSelfGovernanceReport({
    index,
    repositoryId: "healing-test",
    authorityDocuments: [],
    healingDraftBatches,
  });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.healingDraftRegistry.totalDrafts, 1);
  assert.equal(report.healingDraftRegistry.byDisposition.HEALING_DRAFT_GENERATED, 1);
  assert.equal(report.healingDraftRegistry.byTissueType.authorityCompletionDraft, 1);

  const markdown = formatsSelfGovernanceReportMarkdown(report);
  const summary = formatsSelfGovernanceReportSummary(report);
  assert.equal(markdown.includes("## Generated Healing Candidates"), true);
  assert.equal(markdown.includes("success-response-serialization.connective-tissue-draft.json"), true);
  assert.equal(summary.includes("Healing draft registry: 1 draft batch(es)"), true);
  assert.equal(summary.includes("authorityCompletionDraft"), true);
});

test("cli govern accepts the healing seam directories and repository override", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-govern-"));
  try {
    const workspaceDir = path.join(tempDir, "workspace");
    const authorityDir = path.join(tempDir, "authority");
    const reviewsDir = path.join(tempDir, "reviews");
    const knowHowDir = path.join(tempDir, "know-how");
    const healingDir = path.join(tempDir, "healing");
    await mkdir(workspaceDir, { recursive: true });
    await mkdir(authorityDir, { recursive: true });
    await mkdir(reviewsDir, { recursive: true });
    await mkdir(path.join(knowHowDir, "authority-remediation-candidates"), { recursive: true });
    await mkdir(healingDir, { recursive: true });

    const indexPath = path.join(tempDir, "source-fact-index.json");
    const outputPath = path.join(tempDir, "report.json");
    await writeFile(indexPath, JSON.stringify({
      indexType: "source-fact-index.v1",
      indexId: "sha256:test",
      manifest: { scanId: "scan-1", scanRequest: { workspaceId: "healing-cli-test", workspaceRoot: workspaceDir } },
      workspace: { workspaceId: "healing-cli-test" },
      symbols: [],
      relationships: [],
      dataflows: [],
      sourceReferences: [],
      documents: [],
      governanceRules: [],
      bodyMechanics: [],
    }), "utf8");

    await writeFile(path.join(authorityDir, "example.authority.json"), JSON.stringify({
      schemaVersion: "authority-declaration.v1",
      sourceFile: "src/example.js",
      authority: {
        mechanics: [
          { mechanicId: "m1", mechanic: "branch", sourceLocation: "src/example.js:1", coverage: "AUTHORITY_BOUND" },
        ],
      },
    }), "utf8");

    await writeFile(path.join(reviewsDir, "batch.json"), JSON.stringify({
      documentKind: "semantic-overlap-proposal-batch.v1",
      lifecycle: "INFERRED_NOT_ADMITTED",
      subject: { historicalAuthorityFile: "contracts/example.authority.json", resolvedSuccessorFile: "src/example.js" },
      inference: { resolvedModel: "gemini-flash-latest", completedAt: "2026-08-03T21:17:46.489Z" },
      proposals: [{ authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 0.95 }],
      reviewFindings: [],
      reviewOutcomes: [],
      knowHowExtracted: [],
      candidateAuthorities: [],
    }), "utf8");

    await writeFile(path.join(knowHowDir, "admitted.json"), JSON.stringify({
      documentKind: "reviewed-engineering-know-how.v1",
      knowHowId: "kh1",
      lifecycle: "ADMITTED",
      kind: "implementation-gap",
      statement: "s1",
      scope: { generalizability: "repository-specific" },
      evidence: { inferenceBatch: "reviews/batch.json" },
    }), "utf8");
    await writeFile(path.join(knowHowDir, "authority-remediation-candidates", "cand.json"), JSON.stringify({
      documentKind: "authority-remediation-candidate.v1",
      candidateAuthorityId: "cand1",
      lifecycle: "CANDIDATE_NOT_AUTHORED",
      family: "serialization",
      rationale: "r",
      citesKnowHow: ["kh1"],
    }), "utf8");

    await writeFile(path.join(healingDir, "draft.json"), JSON.stringify(buildsHealingDraft()), "utf8");

    const result = spawnSync(
      process.execPath,
      [
        cliPath,
        "govern",
        "--index",
        indexPath,
        "--authority-dir",
        authorityDir,
        "--reviews-dir",
        reviewsDir,
        "--know-how-dir",
        knowHowDir,
        "--healing-dir",
        healingDir,
        "--repository-id",
        "custom-repo",
        "--output",
        outputPath,
        "--summary",
      ],
      {
        cwd: repoRoot,
        encoding: "utf8",
      },
    );

    assert.equal(result.status, 0, `CLI failed with status ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);

    const report = JSON.parse(readFileSync(outputPath, "utf8"));
    assert.equal(report.repository.repositoryId, "custom-repo");
    assert.equal(report.authoritySources.length, 1);
    assert.equal(report.semanticOverlapProposals.length, 1);
    assert.equal(report.knowHowRegistry.admittedKnowHowCount, 1);
    assert.equal(report.knowHowRegistry.authorityRemediationCandidateCount, 1);
    assert.equal(report.healingDraftRegistry.totalDrafts, 1);
    assert.ok(result.stdout.includes(outputPath));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
