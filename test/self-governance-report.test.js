import assert from "node:assert/strict";
import { test } from "node:test";
import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics } from "../src/governance/classifies-execution-mechanics.js";
import { detectsAuthorityDocumentKind, authorityDeclarationKind } from "../src/governance/detects-authority-document-kind.js";
import { resolvesAuthorityFamily } from "../src/governance/mechanic-authority-families.js";
import { resolvesDataDrivenWiring } from "../src/governance/resolves-data-driven-wiring.js";
import { projectsSelfGovernanceReport } from "../src/governance/projects-self-governance-report.js";
import { validatesSelfGovernanceReport } from "../src/governance/validates-self-governance-report.js";

function buildsAuthorityDocument() {
  return {
    schemaVersion: "authority-declaration.v1",
    sourceFile: "src/example.js",
    authority: {
      mechanics: [
        {
          mechanicId: "resolve-example-decision",
          mechanic: "branch",
          sourceLocation: "src/example.js:10-12",
          coverage: "AUTHORITY_BOUND",
        },
        {
          mechanicId: "draft-only-mechanic",
          mechanic: "fallback",
          sourceLocation: "src/example.js:30",
          coverage: "AUTHORITY_CANDIDATE_PROJECTED",
        },
      ],
    },
  };
}

function buildsAuthorityDocumentEntry(filePath, document = buildsAuthorityDocument()) {
  return { filePath, document, documentKind: detectsAuthorityDocumentKind(document) };
}

test("extractsDeclaredAuthorityMechanics only admits AUTHORITY_BOUND mechanics with a resolvable location", () => {
  const declared = extractsDeclaredAuthorityMechanics(buildsAuthorityDocument(), "contracts/example.authority.json");
  assert.equal(declared.length, 1);
  assert.equal(declared[0].mechanicId, "resolve-example-decision");
  assert.deepEqual(declared[0].location, { modulePath: "src/example.js", startLine: 10, endLine: 12 });
});

test("extractsDeclaredAuthorityMechanics ignores documents with a different or missing schemaVersion", () => {
  assert.deepEqual(extractsDeclaredAuthorityMechanics({ schemaVersion: "authority-declaration.draft.v1" }, "x.json"), []);
  assert.deepEqual(extractsDeclaredAuthorityMechanics(null, "x.json"), []);
});

test("classifiesMechanicOccurrence marks an overlapping same-mechanic occurrence as governed", () => {
  const declared = extractsDeclaredAuthorityMechanics(buildsAuthorityDocument(), "contracts/example.authority.json");

  const governed = classifiesMechanicOccurrence({ mechanic: "branch", modulePath: "src/example.js", startLine: 11, endLine: 11 }, declared);
  assert.equal(governed.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
  assert.equal(governed.governingMechanicId, "resolve-example-decision");
  assert.equal(governed.governingAuthorityFile, "contracts/example.authority.json");

  const wrongMechanic = classifiesMechanicOccurrence({ mechanic: "throw", modulePath: "src/example.js", startLine: 11, endLine: 11 }, declared);
  assert.equal(wrongMechanic.posture, "UNKNOWN_CLASSIFICATION");

  const outsideLocation = classifiesMechanicOccurrence({ mechanic: "branch", modulePath: "src/example.js", startLine: 50, endLine: 50 }, declared);
  assert.equal(outsideLocation.posture, "UNKNOWN_CLASSIFICATION");
});

test("detectsAuthorityDocumentKind recognizes schemas beyond authority-declaration.v1", () => {
  assert.equal(detectsAuthorityDocumentKind(buildsAuthorityDocument()), authorityDeclarationKind);
  assert.equal(detectsAuthorityDocumentKind({ authorityType: "semantic-projection-authority.v1" }), "semantic-projection-authority.v1");
  assert.equal(detectsAuthorityDocumentKind({ bundleType: "semantic-execution-bundle.v1" }), "semantic-execution-bundle.v1");
  assert.equal(detectsAuthorityDocumentKind({ ledgerType: "governed-artifact-projection-ledger.v1" }), "governed-artifact-projection-ledger.v1");
  assert.equal(detectsAuthorityDocumentKind({ contract: { contractId: "x.v1" } }), "governed-artifact-contract");
  assert.equal(detectsAuthorityDocumentKind({ someUnrelatedField: true }), null);
  assert.equal(detectsAuthorityDocumentKind(null), null);
});

test("resolvesAuthorityFamily maps known mechanics and falls back for unknown ones", () => {
  assert.equal(resolvesAuthorityFamily("branch"), "decision");
  assert.equal(resolvesAuthorityFamily("object-construction"), "projection-mapping");
  assert.equal(resolvesAuthorityFamily("state-mutation"), "state-transition");
  assert.equal(resolvesAuthorityFamily("not-a-real-mechanic"), "unclassified");
});

function buildsSyntheticIndex({ modulePathPrefix = "src/" } = {}) {
  const path = (name) => `${modulePathPrefix}${name}`;
  const sourceReferences = [
    { referenceId: "ref-1", modulePath: path("example.js"), startLine: 11, endLine: 11, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-2", modulePath: path("example.js"), startLine: 40, endLine: 40, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-3", modulePath: path("other.js"), startLine: 5, endLine: 5, startColumn: 1, endColumn: 1 },
  ];
  const symbols = [
    { symbolId: "sym-1", name: "resolvesExample", modulePath: path("example.js") },
  ];
  const bodyMechanics = [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: path("example.js"), sourceReferenceId: "ref-1", fromSymbolId: "sym-1" },
    { mechanicId: "bm-2", mechanic: "fallback", modulePath: path("example.js"), sourceReferenceId: "ref-2", fromSymbolId: null },
    { mechanicId: "bm-3", mechanic: "throw", modulePath: path("other.js"), sourceReferenceId: "ref-3", fromSymbolId: null },
  ];
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "self-governance-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "self-governance-test" },
    symbols,
    relationships: [],
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
}

test("projectsSelfGovernanceReport classifies observed mechanics against admitted authority evidence", async () => {
  const index = buildsSyntheticIndex();
  const authorityDocuments = [buildsAuthorityDocumentEntry("contracts/example.authority.json")];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.executionMechanics.observed, 3);
  assert.equal(report.executionMechanics.governed, 1);
  assert.equal(report.executionMechanics.byPosture.GOVERNED_BY_SEMANTIC_AUTHORITY, 1);
  assert.equal(report.executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, 2);

  const branchSummary = report.executionMechanics.byMechanicType.find((entry) => entry.mechanic === "branch");
  assert.equal(branchSummary.authorityFamily, "decision");
  assert.equal(branchSummary.observed, 1);
  assert.equal(branchSummary.governed, 1);
  assert.equal(branchSummary.files, 1);
  assert.equal(branchSummary.byHomeStatus.AUTHORITY_HOME_EXISTS, 1);

  const governedOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
  assert.equal(governedOccurrence.governingMechanicId, "resolve-example-decision");
  assert.equal(governedOccurrence.authorityFamily, "decision");
  assert.equal(governedOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS");
  assert.equal(governedOccurrence.authorityHomeFile, "contracts/example.authority.json");

  // Same file as the governed branch, same authority document claims it, but this
  // specific occurrence isn't AUTHORITY_BOUND -- a home exists but doesn't cover it.
  const fallbackOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "fallback");
  assert.equal(fallbackOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE");

  // Different file, no authority document claims it at all.
  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_MISSING");
  assert.equal(throwOccurrence.authorityHomeFile, null);

  const fileBreakdownForExample = report.fileBreakdown.find((entry) => entry.mechanic === "branch" && entry.modulePath === "src/example.js");
  assert.equal(fileBreakdownForExample.occurrenceCount, 1);
  assert.equal(fileBreakdownForExample.governedCount, 1);
  assert.deepEqual(fileBreakdownForExample.responsibilities, ["resolvesExample"]);
  assert.equal(fileBreakdownForExample.homeStatus, "AUTHORITY_HOME_EXISTS");

  assert.equal(report.authoritySources.length, 1);
  assert.equal(report.authoritySources[0].mechanicsDeclared, 2);
  assert.equal(report.authoritySources[0].mechanicsAuthorityBound, 1);
  assert.equal(report.disposition, "OBSERVATIONAL_NO_GATE_APPLIED");
});

test("projectsSelfGovernanceReport reports everything as unknown when no authority evidence is supplied", async () => {
  const index = buildsSyntheticIndex();
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [] });
  assert.equal(report.executionMechanics.governed, 0);
  assert.equal(report.executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, 3);
  assert.equal(report.authoritySources.length, 0);
  assert.ok(report.fileBreakdown.every((entry) => entry.homeStatus === "AUTHORITY_HOME_MISSING"));
});

test("projectsSelfGovernanceReport flags a file claimed by more than one authority document as ambiguous", async () => {
  const index = buildsSyntheticIndex();
  const authorityDocuments = [
    buildsAuthorityDocumentEntry("contracts/example-a.authority.json", { ...buildsAuthorityDocument(), sourceFile: "src/other.js" }),
    buildsAuthorityDocumentEntry("contracts/example-b.authority.json", { ...buildsAuthorityDocument(), sourceFile: "src/other.js" }),
  ];
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_AMBIGUOUS");
});

test("projectsSelfGovernanceReport normalizes workspace-relative modulePath to the repository-relative form authority documents use", async () => {
  // Regression test: a scan run with --workspace ./src emits modulePath like
  // "example.js" (relative to src/), while authority documents declare paths
  // relative to the repository root, e.g. "src/example.js". Without
  // workspaceRelativePrefix these can never match even for the identical file.
  const workspaceRelativeIndex = buildsSyntheticIndex({ modulePathPrefix: "" });
  const authorityDocuments = [buildsAuthorityDocumentEntry("contracts/example.authority.json")];

  const unnormalized = await projectsSelfGovernanceReport({ index: workspaceRelativeIndex, repositoryId: "self-governance-test", authorityDocuments });
  assert.equal(unnormalized.executionMechanics.governed, 0, "without the prefix, the identical file/line never resolves");

  const normalized = await projectsSelfGovernanceReport({
    index: workspaceRelativeIndex,
    repositoryId: "self-governance-test",
    authorityDocuments,
    workspaceRelativePrefix: "src",
  });
  assert.equal(normalized.executionMechanics.governed, 1);
  const governedOccurrence = normalized.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.modulePath, "src/example.js");
  assert.equal(governedOccurrence.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
});

test("projectsSelfGovernanceReport treats non-authority-declaration.v1 documents as an unverified home, not as missing or as coverage", async () => {
  const index = buildsSyntheticIndex();
  const governedArtifactContract = {
    contract: { contractId: "example-contract.v1" },
    artifacts: [{ artifactId: "other-module.v1", relativePath: "src/other.js" }],
  };
  const authorityDocuments = [
    { filePath: "contracts/example.governed.contract.json", document: governedArtifactContract, documentKind: detectsAuthorityDocumentKind(governedArtifactContract) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  // This document isn't authority-declaration.v1, so it must never grant GOVERNED coverage.
  assert.equal(report.executionMechanics.governed, 0);

  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.authorityHomeStatus, "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE");
  assert.equal(throwOccurrence.authorityHomeVerified, false);
  assert.equal(throwOccurrence.authorityHomeFile, "contracts/example.governed.contract.json");

  // authoritySources stays scoped to authority-declaration.v1; this shows up separately.
  assert.equal(report.authoritySources.length, 0);
  assert.equal(report.otherAuthorityDocuments.length, 1);
  assert.equal(report.otherAuthorityDocuments[0].documentKind, "governed-artifact-contract");
  assert.deepEqual(report.otherAuthorityDocuments[0].claimedFiles, ["src/other.js"]);
});

function buildsDependencyIndex() {
  const sourceReferences = [
    { referenceId: "ref-import-1", modulePath: "src/wired.mjs", startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-import-2", modulePath: "src/wired.mjs", startLine: 2, endLine: 2, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-import-3", modulePath: "src/one-hop-away.mjs", startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 },
  ];
  const relationships = [
    {
      relationshipId: "rel-1",
      relationshipKind: "dependency",
      sourceReferenceId: "ref-import-1",
      toSymbolCandidate: "./contracts/wired.authority.json",
    },
    {
      relationshipId: "rel-2",
      relationshipKind: "dependency",
      sourceReferenceId: "ref-import-2",
      toSymbolCandidate: "../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs",
    },
    {
      relationshipId: "rel-3",
      relationshipKind: "dependency",
      sourceReferenceId: "ref-import-3",
      toSymbolCandidate: "./wired.mjs",
    },
  ];
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "wiring-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "wiring-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics: [],
  };
}

test("resolvesDataDrivenWiring detects direct JSON-contract and semantic-runtime imports, one hop only", () => {
  const index = buildsDependencyIndex();

  const wired = resolvesDataDrivenWiring(index, "", ["src/wired.mjs"]).find((entry) => entry.modulePath === "src/wired.mjs");
  assert.deepEqual(wired.importsContractData, ["./contracts/wired.authority.json"]);
  assert.deepEqual(wired.invokesSemanticRuntime, ["../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"]);
  assert.equal(wired.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");

  // one-hop-away.mjs only imports wired.mjs (a local file), not the contract or
  // runtime directly -- the design deliberately does not follow that transitively.
  const oneHopAway = resolvesDataDrivenWiring(index, "", ["src/one-hop-away.mjs"]).find((entry) => entry.modulePath === "src/one-hop-away.mjs");
  assert.equal(oneHopAway.wiringDisposition, "NONE");
});

test("projectsSelfGovernanceReport exposes dataDrivenWiring scoped to files with observed mechanics", async () => {
  const index = { ...buildsDependencyIndex(), bodyMechanics: [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "src/wired.mjs", sourceReferenceId: "ref-import-1", fromSymbolId: null },
  ] };
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "wiring-test", authorityDocuments: [] });
  await validatesSelfGovernanceReport(report);

  const wiredEntry = report.dataDrivenWiring.find((entry) => entry.modulePath === "src/wired.mjs");
  assert.equal(wiredEntry.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");
  // one-hop-away.mjs has no observed mechanics, so it's outside this report's scope entirely.
  assert.equal(report.dataDrivenWiring.some((entry) => entry.modulePath === "src/one-hop-away.mjs"), false);
});
