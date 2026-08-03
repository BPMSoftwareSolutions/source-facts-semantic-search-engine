import assert from "node:assert/strict";
import { test } from "node:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics } from "../src/governance/classifies-execution-mechanics.js";
import { detectsAuthorityDocumentKind, authorityDeclarationKind } from "../src/governance/detects-authority-document-kind.js";
import { resolvesAuthorityFamily } from "../src/governance/mechanic-authority-families.js";
import { resolvesDataDrivenWiring } from "../src/governance/resolves-data-driven-wiring.js";
import { resolvesMechanicLocationReachability, measuresContractSemanticVolume } from "../src/governance/measures-contract-semantic-volume.js";
import { extractsCandidateAuthorityMechanics, resolvesCandidateAuthorityMatch, classifiesAutomationReadiness } from "../src/governance/classifies-automation-readiness.js";
import { resolvesAuthoritySuccession } from "../src/governance/resolves-authority-succession.js";
import { discoversSemanticOverlapProposalBatches } from "../src/governance/discovers-semantic-overlap-proposals.js";
import { summarizesSemanticOverlapProposalBatch } from "../src/governance/summarizes-semantic-overlap-proposals.js";
import { summarizesInferenceQuality } from "../src/governance/summarizes-inference-quality.js";
import { extractsReviewedKnowHow } from "../src/governance/extracts-reviewed-know-how.js";
import { admitsKnowHow } from "../src/governance/admits-know-how.js";
import { projectsAuthorityRemediationCandidate } from "../src/governance/projects-authority-remediation-candidate.js";
import { discoversKnowHowRegistry } from "../src/governance/discovers-know-how-registry.js";
import { summarizesKnowHowRegistry } from "../src/governance/summarizes-know-how-registry.js";
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
  const sourceReferences = [];
  const relationships = [];
  let refCounter = 0;

  function addsDependency(modulePath, specifier) {
    refCounter += 1;
    const referenceId = `ref-${refCounter}`;
    sourceReferences.push({ referenceId, modulePath, startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 });
    relationships.push({ relationshipId: `rel-${refCounter}`, relationshipKind: "dependency", sourceReferenceId: referenceId, toSymbolCandidate: specifier });
  }

  // Direct evidence: imports both a JSON contract and the semantic runtime.
  addsDependency("src/wired.mjs", "./contracts/wired.authority.json");
  addsDependency("src/wired.mjs", "../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs");

  // Transitive positive: only imports wired.mjs locally, no direct evidence of its own.
  addsDependency("src/one-hop-away.mjs", "./wired.mjs");

  // Bare (non-relative) specifier that happens to equal a real file's path if it
  // were (wrongly) treated as local -- must never be followed as a graph edge.
  addsDependency("src/bare-importer.mjs", "wired.mjs");

  // Cycle: neither side has any evidence anywhere in the loop.
  addsDependency("src/cycle-a.mjs", "./cycle-b.mjs");
  addsDependency("src/cycle-b.mjs", "./cycle-a.mjs");

  // Dead-end chain: terminates within one hop with nothing found -- a confident NONE.
  // dead-end-helper.mjs is registered via its own (non-local, non-evidence) import so
  // it counts as a *known, resolved* file with zero further local edges -- a genuine
  // dead end, not an unresolvable specifier that would dead-end for the wrong reason.
  addsDependency("src/dead-end.mjs", "./dead-end-helper.mjs");
  addsDependency("src/dead-end-helper.mjs", "node:path");

  // Chain exactly as long as the default max hop depth (4), with no evidence
  // anywhere -- the search should stop at the cap, not claim a confident NONE.
  addsDependency("src/chain-l0.mjs", "./chain-l1.mjs");
  addsDependency("src/chain-l1.mjs", "./chain-l2.mjs");
  addsDependency("src/chain-l2.mjs", "./chain-l3.mjs");
  addsDependency("src/chain-l3.mjs", "./chain-l4.mjs");
  addsDependency("src/chain-l4.mjs", "node:path");

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

test("resolvesDataDrivenWiring detects direct JSON-contract and semantic-runtime imports", () => {
  const index = buildsDependencyIndex();
  const wired = resolvesDataDrivenWiring(index, "", ["src/wired.mjs"]).find((entry) => entry.modulePath === "src/wired.mjs");
  assert.deepEqual(wired.importsContractData, ["./contracts/wired.authority.json"]);
  assert.deepEqual(wired.invokesSemanticRuntime, ["../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"]);
  assert.equal(wired.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");
  assert.equal(wired.hopCount, null);
  assert.equal(wired.hopPath, null);
});

test("resolvesDataDrivenWiring follows one local hop to find transitive evidence", () => {
  const index = buildsDependencyIndex();
  const oneHopAway = resolvesDataDrivenWiring(index, "", ["src/one-hop-away.mjs"]).find((entry) => entry.modulePath === "src/one-hop-away.mjs");
  assert.equal(oneHopAway.wiringDisposition, "TRANSITIVE_DATA_AND_RUNTIME");
  assert.deepEqual(oneHopAway.transitiveContractPaths, ["./contracts/wired.authority.json"]);
  assert.deepEqual(oneHopAway.transitiveRuntimePaths, ["../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs"]);
  assert.equal(oneHopAway.hopCount, 1);
  assert.deepEqual(oneHopAway.hopPath, ["src/one-hop-away.mjs", "src/wired.mjs"]);
});

test("resolvesDataDrivenWiring never follows a bare (non-relative) specifier as a local hop", () => {
  const index = buildsDependencyIndex();
  const bareImporter = resolvesDataDrivenWiring(index, "", ["src/bare-importer.mjs"]).find((entry) => entry.modulePath === "src/bare-importer.mjs");
  assert.equal(bareImporter.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring terminates safely on an import cycle", () => {
  const index = buildsDependencyIndex();
  const cycleA = resolvesDataDrivenWiring(index, "", ["src/cycle-a.mjs"]).find((entry) => entry.modulePath === "src/cycle-a.mjs");
  assert.equal(cycleA.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring reports a confident NONE when the local chain terminates within depth", () => {
  const index = buildsDependencyIndex();
  const deadEnd = resolvesDataDrivenWiring(index, "", ["src/dead-end.mjs"]).find((entry) => entry.modulePath === "src/dead-end.mjs");
  assert.equal(deadEnd.wiringDisposition, "NONE");
});

test("resolvesDataDrivenWiring reports NOT_DETERMINED_BEYOND_MAX_DEPTH instead of a false NONE at the depth cap", () => {
  const index = buildsDependencyIndex();
  const chainStart = resolvesDataDrivenWiring(index, "", ["src/chain-l0.mjs"], { maxHopDepth: 4 }).find((entry) => entry.modulePath === "src/chain-l0.mjs");
  assert.equal(chainStart.wiringDisposition, "NOT_DETERMINED_BEYOND_MAX_DEPTH");

  // A shallower search that reaches the same unresolved evidence sooner behaves the same way.
  const shallowSearch = resolvesDataDrivenWiring(index, "", ["src/chain-l0.mjs"], { maxHopDepth: 2 }).find((entry) => entry.modulePath === "src/chain-l0.mjs");
  assert.equal(shallowSearch.wiringDisposition, "NOT_DETERMINED_BEYOND_MAX_DEPTH");
});

test("projectsSelfGovernanceReport exposes dataDrivenWiring scoped to files with observed mechanics", async () => {
  const index = { ...buildsDependencyIndex(), bodyMechanics: [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "src/wired.mjs", sourceReferenceId: "ref-1", fromSymbolId: null },
    { mechanicId: "bm-2", mechanic: "branch", modulePath: "src/one-hop-away.mjs", sourceReferenceId: "ref-3", fromSymbolId: null },
  ] };
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "wiring-test", authorityDocuments: [] });
  await validatesSelfGovernanceReport(report);

  const wiredEntry = report.dataDrivenWiring.find((entry) => entry.modulePath === "src/wired.mjs");
  assert.equal(wiredEntry.wiringDisposition, "DIRECT_DATA_AND_RUNTIME");
  const oneHopEntry = report.dataDrivenWiring.find((entry) => entry.modulePath === "src/one-hop-away.mjs");
  assert.equal(oneHopEntry.wiringDisposition, "TRANSITIVE_DATA_AND_RUNTIME");
  // cycle-a.mjs has no observed mechanics, so it's outside this report's scope entirely.
  assert.equal(report.dataDrivenWiring.some((entry) => entry.modulePath === "src/cycle-a.mjs"), false);
});

test("resolvesMechanicLocationReachability resolves exact matches, unique suffix matches, ambiguity, and moved/removed files", () => {
  const knownModulePaths = new Set(["src/console/foo.mjs", "src/other/foo.mjs", "src/console/bar.mjs"]);

  const exact = resolvesMechanicLocationReachability("src/console/bar.mjs:10", knownModulePaths);
  assert.equal(exact.status, "RESOLVED");
  assert.equal(exact.resolvedModulePath, "src/console/bar.mjs");

  // "foo.mjs" alone matches two known files by suffix -- must not silently pick one.
  const ambiguous = resolvesMechanicLocationReachability("foo.mjs:5", knownModulePaths);
  assert.equal(ambiguous.status, "AMBIGUOUS");
  assert.equal(ambiguous.resolvedModulePath, null);

  const suffix = resolvesMechanicLocationReachability("bar.mjs:5", knownModulePaths);
  assert.equal(suffix.status, "RESOLVED_BY_SUFFIX");
  assert.equal(suffix.resolvedModulePath, "src/console/bar.mjs");

  const moved = resolvesMechanicLocationReachability("src/console/gone.mjs:1", knownModulePaths);
  assert.equal(moved.status, "MOVED_OR_REMOVED");

  const unresolvable = resolvesMechanicLocationReachability("", knownModulePaths);
  assert.equal(unresolvable.status, "UNRESOLVABLE_LOCATION");
});

test("measuresContractSemanticVolume measures per-mechanic reachability for authority-declaration-shaped documents", () => {
  const draftDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    authority: {
      mechanics: [
        { mechanicId: "m1", mechanic: "branch", sourceLocation: "src/console/bar.mjs:10", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
        { mechanicId: "m2", mechanic: "fallback", sourceLocation: "src/console/vanished.mjs:5", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
        { mechanicId: "m3", mechanic: "throw", sourceLocation: "bar.mjs:20", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
      ],
    },
  };
  const knownModulePaths = new Set(["src/console/bar.mjs"]);
  const [measurement] = measuresContractSemanticVolume(
    [{ document: draftDocument, filePath: "contracts/x.draft.json", documentKind: "authority-declaration.draft.v1" }],
    knownModulePaths,
  );

  assert.equal(measurement.totalSemanticElements, 3);
  assert.equal(measurement.semanticElementCounts.mechanics, 3);
  assert.equal(measurement.reachableSemanticElements, 2); // m1 (exact) + m3 (suffix)
  assert.equal(measurement.orphanedSemanticElements, 1); // m2, moved or removed
  assert.equal(measurement.mechanicReachability.total, 3);
  assert.equal(measurement.mechanicReachability.byStatus.RESOLVED, 1);
  assert.equal(measurement.mechanicReachability.byStatus.RESOLVED_BY_SUFFIX, 1);
  assert.equal(measurement.mechanicReachability.byStatus.MOVED_OR_REMOVED, 1);
  assert.equal(measurement.artifactReachability, null);
});

test("measuresContractSemanticVolume measures per-artifact reachability for governed-artifact-contract documents", () => {
  const contractDocument = {
    contract: { contractId: "example.v1" },
    artifacts: [
      {
        artifactId: "reachable-artifact.v1",
        relativePath: "src/console/bar.mjs",
        sourceAuthority: { decisions: [{ decisionId: "d1" }], semanticEdges: [{ edgeId: "e1" }, { edgeId: "e2" }] },
      },
      {
        artifactId: "orphaned-artifact.v1",
        relativePath: "src/console/vanished.mjs",
        sourceAuthority: { failurePolicies: [{ failurePolicyId: "f1" }] },
      },
    ],
  };
  const knownModulePaths = new Set(["src/console/bar.mjs"]);
  const [measurement] = measuresContractSemanticVolume(
    [{ document: contractDocument, filePath: "contracts/example.contract.json", documentKind: "governed-artifact-contract" }],
    knownModulePaths,
  );

  assert.equal(measurement.totalSemanticElements, 4);
  assert.equal(measurement.reachableSemanticElements, 3); // decisions + semanticEdges on the reachable artifact
  assert.equal(measurement.orphanedSemanticElements, 1); // failurePolicies on the orphaned artifact
  assert.equal(measurement.mechanicReachability, null);
  assert.equal(measurement.artifactReachability.length, 2);
  const orphaned = measurement.artifactReachability.find((artifact) => artifact.artifactId === "orphaned-artifact.v1");
  assert.equal(orphaned.reachable, false);
  assert.equal(orphaned.semanticElementCount, 1);
});

test("measuresContractSemanticVolume returns an empty measurement for documents with neither mechanics nor artifacts", () => {
  const bundleDocument = { bundleType: "semantic-execution-bundle.v1", bundleId: "x.v1" };
  const [measurement] = measuresContractSemanticVolume(
    [{ document: bundleDocument, filePath: "contracts/x.bundle.json", documentKind: "semantic-execution-bundle.v1" }],
    new Set(),
  );
  assert.equal(measurement.totalSemanticElements, 0);
  assert.equal(measurement.mechanicReachability, null);
  assert.equal(measurement.artifactReachability, null);
});

test("projectsSelfGovernanceReport exposes contractSemanticVolume for every discovered authority document", async () => {
  const index = buildsSyntheticIndex();
  const draftAuthorityDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    authority: { mechanics: [{ mechanicId: "d1", mechanic: "branch", sourceLocation: "src/example.js:11", coverage: "AUTHORITY_CANDIDATE_PROJECTED" }] },
  };
  const authorityDocuments = [
    buildsAuthorityDocumentEntry("contracts/example.authority.json"),
    { filePath: "contracts/example.draft.json", document: draftAuthorityDocument, documentKind: detectsAuthorityDocumentKind(draftAuthorityDocument) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.contractSemanticVolume.length, 2);
  const draftMeasurement = report.contractSemanticVolume.find((entry) => entry.authorityFile === "contracts/example.draft.json");
  assert.equal(draftMeasurement.reachableSemanticElements, 1);
  assert.equal(draftMeasurement.orphanedSemanticElements, 0);
});

test("extractsCandidateAuthorityMechanics keeps only non-AUTHORITY_BOUND mechanics with a resolvable location, plus their coverageDisposition", () => {
  const document = {
    schemaVersion: "authority-declaration.draft.v1",
    sourceFile: "widget.mjs",
    authority: {
      mechanics: [
        { mechanicId: "bound", mechanic: "branch", sourceLocation: "src/widget.mjs:5", coverage: "AUTHORITY_BOUND" },
        // Real drafts (e.g. serves-query-console.authority.draft.json) nest
        // coverageDisposition under decisions, not at the mechanic's own top level.
        { mechanicId: "candidate", mechanic: "fallback", sourceLocation: "widget.mjs:20-22", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
        { mechanicId: "flattened-candidate", mechanic: "validation", sourceLocation: "widget.mjs:30", coverage: "AUTHORITY_CANDIDATE_PROJECTED", coverageDisposition: "SEMANTIC_DECISION_REQUIRED" },
        { mechanicId: "no-location", mechanic: "throw", coverage: "AUTHORITY_CANDIDATE_PROJECTED" },
      ],
    },
  };
  const candidates = extractsCandidateAuthorityMechanics(document, "contracts/widget.draft.json");
  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].mechanicId, "candidate");
  assert.equal(candidates[0].coverage, "AUTHORITY_CANDIDATE_PROJECTED");
  assert.equal(candidates[0].coverageDisposition, "SEMANTIC_DECISION_REQUIRED");
  assert.deepEqual(candidates[0].location, { modulePath: "widget.mjs", startLine: 20, endLine: 22 });
  // A top-level coverageDisposition (no nested decisions object) still resolves as a fallback.
  assert.equal(candidates[1].mechanicId, "flattened-candidate");
  assert.equal(candidates[1].coverageDisposition, "SEMANTIC_DECISION_REQUIRED");
});

test("resolvesCandidateAuthorityMatch resolves a candidate declared without a path prefix by unique suffix, requiring both mechanic type and line overlap", () => {
  const candidates = extractsCandidateAuthorityMechanics({
    authority: {
      mechanics: [
        { mechanicId: "candidate", mechanic: "fallback", sourceLocation: "widget.mjs:20-22", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
      ],
    },
  }, "contracts/widget.draft.json");
  const knownModulePaths = new Set(["src/console/widget.mjs"]);

  const matched = resolvesCandidateAuthorityMatch({ mechanic: "fallback", modulePath: "src/console/widget.mjs", startLine: 21, endLine: 21 }, candidates, knownModulePaths);
  assert.equal(matched.mechanicId, "candidate");

  const wrongMechanic = resolvesCandidateAuthorityMatch({ mechanic: "throw", modulePath: "src/console/widget.mjs", startLine: 21, endLine: 21 }, candidates, knownModulePaths);
  assert.equal(wrongMechanic, null);

  const outsideLines = resolvesCandidateAuthorityMatch({ mechanic: "fallback", modulePath: "src/console/widget.mjs", startLine: 100, endLine: 100 }, candidates, knownModulePaths);
  assert.equal(outsideLines, null);
});

test("classifiesAutomationReadiness tiers ungoverned occurrences by candidate reachability, coverageDisposition, and authority home status", () => {
  assert.equal(classifiesAutomationReadiness({ posture: "GOVERNED_BY_SEMANTIC_AUTHORITY", authorityHomeStatus: "AUTHORITY_HOME_EXISTS", candidateMatch: null }).automationDisposition, "ALREADY_GOVERNED");
  assert.equal(classifiesAutomationReadiness({ posture: "KERNEL_PRIMITIVE", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: null }).automationDisposition, "NOT_APPLICABLE");
  assert.equal(classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_AMBIGUOUS", candidateMatch: null }).automationDisposition, "NOT_CURRENTLY_PROJECTABLE");

  const semanticDecisionCandidate = { mechanicId: "c1", coverageDisposition: "SEMANTIC_DECISION_REQUIRED" };
  const readyCandidate = { mechanicId: "c2", coverageDisposition: null };
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: semanticDecisionCandidate }).automationDisposition,
    "REQUIRES_HUMAN_SEMANTIC_DECISION",
  );
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: readyCandidate }).automationDisposition,
    "AUTOMATABLE_AFTER_REVIEW",
  );

  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE", candidateMatch: null }).automationDisposition,
    "AUTOMATABLE_AFTER_AUTHORITY_COMPLETION",
  );
  assert.equal(
    classifiesAutomationReadiness({ posture: "UNKNOWN_CLASSIFICATION", authorityHomeStatus: "AUTHORITY_HOME_MISSING", candidateMatch: null }).automationDisposition,
    "REQUIRES_NEW_AUTHORITY",
  );
});

test("projectsSelfGovernanceReport classifies automation readiness per occurrence, finding a reachable draft candidate the exact-match authority home index misses", async () => {
  const index = buildsSyntheticIndex();
  const admittedAuthorityDocument = buildsAuthorityDocumentEntry("contracts/example.authority.json");
  // Declares sourceFile without the "src/" prefix the admitted authority document
  // uses -- resolvesAuthorityHomeStatus's exact-match home index will not claim
  // src/example.js from this document at all, but the suffix-aware candidate
  // matcher below still finds this candidate for the fallback occurrence.
  const draftDocument = {
    schemaVersion: "authority-declaration.draft.v1",
    sourceFile: "example.js",
    authority: {
      mechanics: [
        { mechanicId: "draft-fallback", mechanic: "fallback", sourceLocation: "example.js:40", coverage: "AUTHORITY_CANDIDATE_PROJECTED", decisions: { coverageDisposition: "SEMANTIC_DECISION_REQUIRED" } },
      ],
    },
  };
  const authorityDocuments = [
    admittedAuthorityDocument,
    { filePath: "contracts/example.draft.json", document: draftDocument, documentKind: detectsAuthorityDocumentKind(draftDocument) },
  ];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  const governedOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.automationDisposition, "ALREADY_GOVERNED");

  const fallbackOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "fallback");
  assert.equal(fallbackOccurrence.automationDisposition, "REQUIRES_HUMAN_SEMANTIC_DECISION");
  assert.equal(fallbackOccurrence.candidateAuthorityFile, "contracts/example.draft.json");
  assert.equal(fallbackOccurrence.candidateMechanicId, "draft-fallback");
  assert.deepEqual(fallbackOccurrence.missingTissue, ["RESPONSIBILITY_BINDING_MISSING", "EXECUTION_BINDING_MISSING", "EQUIVALENCE_PROOF_MISSING"]);

  const throwOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "throw");
  assert.equal(throwOccurrence.automationDisposition, "REQUIRES_NEW_AUTHORITY");
  assert.equal(throwOccurrence.candidateAuthorityFile, null);

  assert.equal(report.automationReadiness.byDisposition.ALREADY_GOVERNED, 1);
  assert.equal(report.automationReadiness.byDisposition.REQUIRES_HUMAN_SEMANTIC_DECISION, 1);
  assert.equal(report.automationReadiness.byDisposition.REQUIRES_NEW_AUTHORITY, 1);
});

test("detectsAuthorityDocumentKind falls back to authority-declaration-unmarked.v1 for a document with a mechanics-array shape but no marker field", () => {
  const unmarked = { sourceFile: "x.mjs", authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "x.mjs:1" }] } };
  assert.equal(detectsAuthorityDocumentKind(unmarked), "authority-declaration-unmarked.v1");

  // An empty or malformed mechanics array must not be treated as evidence of this shape.
  assert.equal(detectsAuthorityDocumentKind({ authority: { mechanics: [] } }), null);
  assert.equal(detectsAuthorityDocumentKind({ mechanics: [{ mechanicId: "m1" }] }), null);
});

function buildsMinimalSuccessionIndex({ sourceReferences = [], relationships = [], bodyMechanics = [] }) {
  return {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "succession-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "succession-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
}

function addsDependencyRef(sourceReferences, relationships, modulePath, specifier, refIdPrefix) {
  const referenceId = `${refIdPrefix}-dep`;
  sourceReferences.push({ referenceId, modulePath, startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 });
  relationships.push({ relationshipId: `${refIdPrefix}-rel`, relationshipKind: "dependency", sourceReferenceId: referenceId, toSymbolCandidate: specifier });
}

function addsMechanicRef(sourceReferences, bodyMechanics, modulePath, mechanic, line, refIdPrefix) {
  const referenceId = `${refIdPrefix}-ref`;
  sourceReferences.push({ referenceId, modulePath, startLine: line, endLine: line, startColumn: 1, endColumn: 1 });
  bodyMechanics.push({ mechanicId: `${refIdPrefix}-bm`, mechanic, modulePath, sourceReferenceId: referenceId, fromSymbolId: null });
}

function buildsAuthoritySuccessionDocument(sourceFile, mechanics) {
  return {
    document: { sourceFile, authority: { mechanics } },
    filePath: "contracts/x.authority.json",
  };
}

test("resolvesAuthoritySuccession follows a re-export shim to a successor file that carries every declared mechanic type", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl.mjs", "shim");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/impl.mjs" },
    { mechanic: "fallback", modulePath: "src/impl.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "shim.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_RESOLVED");
  assert.equal(result.successorFile, "src/impl.mjs");
  assert.equal(result.hopCount, 1);
  assert.equal(result.mechanicsPresentInSuccessor, 2);
  assert.equal(result.recommendedAction, "REVIEW_AND_REBIND_TO_SUCCESSOR");
});

test("resolvesAuthoritySuccession treats a source file that already carries every declared mechanic type as already current", () => {
  const index = buildsMinimalSuccessionIndex({});
  const knownModulePaths = new Set(["src/file.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/file.mjs" },
    { mechanic: "fallback", modulePath: "src/file.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("file.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "file.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "file.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SOURCE_STILL_CURRENT");
  assert.equal(result.successorFile, null);
  assert.equal(result.recommendedAction, "NONE_ALREADY_CURRENT");
});

test("resolvesAuthoritySuccession treats a source file with any of its own mechanics as still current -- incomplete, not a shim needing a successor search", () => {
  // The anchor has its own "branch" mechanic (so it is not a re-export shim), but
  // the document also declares a "retry" mechanic never observed there. A naive
  // "must cover every declared type" trigger would wrongly go hunting a
  // successor from a substantial file that plainly isn't a passthrough.
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/file.mjs", "./unrelated.mjs", "file");
  const knownModulePaths = new Set(["src/file.mjs", "src/unrelated.mjs"]);
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const occurrences = [
    { mechanic: "branch", modulePath: "src/file.mjs" },
    { mechanic: "retry", modulePath: "src/unrelated.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("file.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "file.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "retry", sourceLocation: "file.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SOURCE_CURRENT_BUT_INCOMPLETE");
  assert.equal(result.successorFile, null, "must not search further hops away from a file that already has its own mechanics");
  assert.equal(result.mechanicsPresentInSuccessor, 1);
  assert.equal(result.recommendedAction, "REVIEW_SOURCE_FOR_MISSING_MECHANIC_TYPES");
});

test("resolvesAuthoritySuccession reports no current successor when the declared sourceFile does not exist and there is no anchor to search from", () => {
  const index = buildsMinimalSuccessionIndex({});
  const knownModulePaths = new Set(["src/unrelated.mjs"]);
  const authorityDocuments = [buildsAuthoritySuccessionDocument("gone.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "gone.mjs:10", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences: [], index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_HAS_NO_CURRENT_SUCCESSOR");
  assert.equal(result.anchorFile, null);
  assert.equal(result.recommendedAction, "RECONCILE_MANUALLY_NO_ANCHOR");
});

test("resolvesAuthoritySuccession reports ambiguous when the shim's chain forks to two files that both carry mechanics", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl-a.mjs", "shim-a");
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl-b.mjs", "shim-b");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl-a.mjs", "src/impl-b.mjs"]);
  const occurrences = [
    { mechanic: "branch", modulePath: "src/impl-a.mjs" },
    { mechanic: "branch", modulePath: "src/impl-b.mjs" },
  ];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_AMBIGUOUS");
  assert.equal(result.successorFile, null);
  assert.equal(result.recommendedAction, "RECONCILE_MANUALLY_AMBIGUOUS_SUCCESSOR");
});

test("resolvesAuthoritySuccession reports partial overlap when the resolved successor only carries some declared mechanic types", () => {
  const sourceReferences = [];
  const relationships = [];
  addsDependencyRef(sourceReferences, relationships, "src/shim.mjs", "./impl.mjs", "shim");
  const bodyMechanics = [];
  addsMechanicRef(sourceReferences, bodyMechanics, "src/impl.mjs", "branch", 5, "impl-branch");
  const index = buildsMinimalSuccessionIndex({ sourceReferences, relationships, bodyMechanics });
  const knownModulePaths = new Set(["src/shim.mjs", "src/impl.mjs"]);
  const occurrences = [{ mechanic: "branch", modulePath: "src/impl.mjs" }];
  const authorityDocuments = [buildsAuthoritySuccessionDocument("shim.mjs", [
    { mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" },
    { mechanicId: "m2", mechanic: "fallback", sourceLocation: "shim.mjs:20", coverage: "AUTHORITY_BOUND" },
  ])];

  const [result] = resolvesAuthoritySuccession({ authorityDocuments, occurrences, index, workspaceRelativePrefix: "", knownModulePaths });
  assert.equal(result.succession, "AUTHORITY_SUCCESSOR_PARTIAL");
  assert.equal(result.successorFile, "src/impl.mjs");
  assert.equal(result.mechanicsPresentInSuccessor, 1);
  assert.equal(result.mechanicsDeclared, 2);
  assert.equal(result.recommendedAction, "REVIEW_PARTIAL_SUCCESSOR_AND_AUTHOR_GAPS");
});

test("projectsSelfGovernanceReport exposes authoritySuccession, resolving a re-export shim's successor end to end", async () => {
  const sourceReferences = [
    { referenceId: "ref-shim-dep", modulePath: "shim.mjs", startLine: 1, endLine: 1, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-impl-branch", modulePath: "impl.mjs", startLine: 5, endLine: 5, startColumn: 1, endColumn: 1 },
  ];
  const relationships = [
    { relationshipId: "rel-shim", relationshipKind: "dependency", sourceReferenceId: "ref-shim-dep", toSymbolCandidate: "./impl.mjs" },
  ];
  const bodyMechanics = [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "impl.mjs", sourceReferenceId: "ref-impl-branch", fromSymbolId: null },
  ];
  const index = {
    indexType: "source-fact-index.v1",
    indexId: "sha256:test",
    manifest: { scanId: "scan-1", scanRequest: { workspaceId: "succession-report-test", workspaceRoot: "C:/fake/src" } },
    workspace: { workspaceId: "succession-report-test" },
    symbols: [],
    relationships,
    dataflows: [],
    sourceReferences,
    documents: [],
    governanceRules: [],
    bodyMechanics,
  };
  // No schemaVersion/authorityType/etc -- only detectable via the mechanics-array structural fallback.
  const unmarkedDocument = { sourceFile: "shim.mjs", authority: { mechanics: [{ mechanicId: "m1", mechanic: "branch", sourceLocation: "shim.mjs:10", coverage: "AUTHORITY_BOUND" }] } };
  const authorityDocuments = [{ filePath: "contracts/shim.authority.complete.json", document: unmarkedDocument, documentKind: detectsAuthorityDocumentKind(unmarkedDocument) }];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "succession-report-test", authorityDocuments, workspaceRelativePrefix: "" });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.authoritySuccession.length, 1);
  assert.equal(report.authoritySuccession[0].succession, "AUTHORITY_SUCCESSOR_RESOLVED");
  assert.equal(report.authoritySuccession[0].successorFile, "impl.mjs");
  assert.equal(report.authoritySuccession[0].recommendedAction, "REVIEW_AND_REBIND_TO_SUCCESSOR");
});

function buildsProposalBatchDocument({ withReviewFindings = true } = {}) {
  return {
    documentKind: "semantic-overlap-proposal-batch.v1",
    lifecycle: "INFERRED_NOT_ADMITTED",
    subject: { historicalAuthorityFile: "contracts/x.authority.complete.json", resolvedSuccessorFile: "src/x.runtime.impl.mjs" },
    inference: { resolvedModel: "gemini-flash-latest", completedAt: "2026-08-03T21:17:46.489Z" },
    proposals: [
      { authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP" },
      { authorityMechanicId: "m2", overlapDisposition: "PROPOSED_EXACT_OVERLAP" },
      { authorityMechanicId: "m3", overlapDisposition: "PROPOSED_NO_MATCH" },
    ],
    reviewFindings: withReviewFindings
      ? [{ authorityMechanicId: "m2", reviewVerdict: "AMEND_TO_PARTIAL_OVERLAP", correctedDisposition: "PROPOSED_PARTIAL_OVERLAP", reason: "Overclaimed coverage on the success path." }]
      : [],
  };
}

test("summarizesSemanticOverlapProposalBatch derives disposition tallies from proposals and reviewFindings rather than trusting a self-reported summary block", () => {
  const summary = summarizesSemanticOverlapProposalBatch({ filePath: "reviews/x.json", document: buildsProposalBatchDocument() });

  assert.equal(summary.lifecycle, "INFERRED_NOT_ADMITTED");
  assert.equal(summary.historicalAuthorityFile, "contracts/x.authority.complete.json");
  assert.equal(summary.resolvedSuccessorFile, "src/x.runtime.impl.mjs");
  assert.equal(summary.totalProposed, 3);
  // Raw model output, unamended.
  assert.deepEqual(summary.modelDispositionCounts, { PROPOSED_EXACT_OVERLAP: 2, PROPOSED_NO_MATCH: 1 });
  // m2's disposition flips to PARTIAL_OVERLAP once the review finding is applied; m1 and m3 are untouched.
  assert.deepEqual(summary.reviewedDispositionCounts, { PROPOSED_EXACT_OVERLAP: 1, PROPOSED_PARTIAL_OVERLAP: 1, PROPOSED_NO_MATCH: 1 });
  assert.equal(summary.reviewFindings.length, 1);
  assert.equal(summary.reviewFindings[0].authorityMechanicId, "m2");
});

test("summarizesSemanticOverlapProposalBatch leaves both tallies identical when no review findings exist yet -- unreviewed is not the same as confirmed", () => {
  const summary = summarizesSemanticOverlapProposalBatch({ filePath: "reviews/x.json", document: buildsProposalBatchDocument({ withReviewFindings: false }) });
  assert.deepEqual(summary.modelDispositionCounts, summary.reviewedDispositionCounts);
  assert.equal(summary.reviewFindings.length, 0);
});

function buildsInferenceQualityDocument() {
  return {
    proposals: [
      { authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
      { authorityMechanicId: "m2", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
      { authorityMechanicId: "m3", overlapDisposition: "PROPOSED_EXACT_OVERLAP", confidence: 1 },
    ],
    reviewOutcomes: [
      { authorityMechanicId: "m1", outcome: "APPROVED_UNCHANGED" },
      { authorityMechanicId: "m2", outcome: "AMENDED" },
      // m3 intentionally has no recorded outcome.
    ],
    reviewFindings: [
      { authorityMechanicId: "m2", correctedDisposition: "PROPOSED_PARTIAL_OVERLAP", correctedConfidence: 0.5, additionalFinding: "found something else along the way" },
    ],
    knowHowExtracted: [
      { knowHowId: "insight-one", kind: "implementation-gap", generalizability: "repository-specific", statement: "insight one", reviewFinding: "m2", supportingSubjects: ["thing-a"] },
      "insight two as a legacy bare string",
    ],
    candidateAuthorities: [{ candidateAuthorityId: "cand-1", family: "serialization", rationale: "because" }],
  };
}

test("summarizesInferenceQuality tallies review outcomes, tracks unrecorded outcomes as unrecorded (not as an assumed pass), and averages confidence before/after review", () => {
  const quality = summarizesInferenceQuality(buildsInferenceQualityDocument());
  assert.equal(quality.proposalsGenerated, 3);
  assert.deepEqual(quality.reviewOutcomeCounts, { APPROVED_UNCHANGED: 1, AMENDED: 1, APPROVED_WITH_ADDITIONAL_FINDING: 0, REJECTED: 0 });
  assert.equal(quality.unrecordedOutcomes, 1);
  assert.equal(quality.modelConfidenceAverage, 1);
  // m1 keeps confidence 1 (no finding), m2 drops to its correctedConfidence 0.5, m3 keeps 1 (no finding).
  assert.equal(quality.reviewedConfidenceAverage, (1 + 0.5 + 1) / 3);
  assert.equal(quality.newDeterministicFindingsFromReview, 1);
  assert.equal(quality.knowHowExtracted.length, 2);
  assert.equal(quality.knowHowExtracted[0].knowHowId, "insight-one");
  assert.equal(quality.knowHowExtracted[0].kind, "implementation-gap");
  // A legacy bare-string entry is tolerated, not upgraded by guessing a kind for it.
  assert.equal(quality.knowHowExtracted[1].statement, "insight two as a legacy bare string");
  assert.equal(quality.knowHowExtracted[1].kind, "unclassified");
  assert.equal(quality.candidateAuthorities.length, 1);
  assert.equal(quality.candidateAuthorities[0].candidateAuthorityId, "cand-1");
});

test("summarizesInferenceQuality tolerates a document with none of the optional review fields present", () => {
  const quality = summarizesInferenceQuality({ proposals: [{ authorityMechanicId: "m1", overlapDisposition: "PROPOSED_EXACT_OVERLAP" }] });
  assert.equal(quality.proposalsGenerated, 1);
  assert.equal(quality.unrecordedOutcomes, 1);
  assert.equal(quality.modelConfidenceAverage, null);
  assert.equal(quality.reviewedConfidenceAverage, null);
  assert.equal(quality.newDeterministicFindingsFromReview, 0);
  assert.deepEqual(quality.knowHowExtracted, []);
  assert.deepEqual(quality.candidateAuthorities, []);
});

test("extractsReviewedKnowHow shapes structured entries, defaults an unknown kind to unclassified, and slugifies a missing knowHowId", () => {
  const document = {
    knowHowExtracted: [
      { knowHowId: "real-id", statement: "a real statement", kind: "implementation-gap", generalizability: "repository-specific", reviewFinding: "m1", supportingSubjects: ["thing"] },
      { statement: "no id given", kind: "not-a-known-kind" },
      "a legacy bare string",
    ],
  };
  const candidates = extractsReviewedKnowHow({ filePath: "reviews/x.json", document });
  assert.equal(candidates.length, 3);
  assert.equal(candidates[0].knowHowId, "real-id");
  assert.equal(candidates[0].kind, "implementation-gap");
  // Unknown kind is not trusted blindly -- falls back to unclassified rather than inventing a category.
  assert.equal(candidates[1].kind, "unclassified");
  assert.equal(candidates[1].knowHowId, "reviews-x-json-know-how-2");
  assert.equal(candidates[2].statement, "a legacy bare string");
  assert.equal(candidates[2].kind, "unclassified");
  assert.equal(candidates[2].generalizability, "unclassified");
});

test("admitsKnowHow stamps a canonical ADMITTED record carrying forward the candidate's evidence lineage", () => {
  const candidate = {
    knowHowId: "some-id",
    statement: "a statement",
    kind: "governance-invariant",
    generalizability: "cross-repository",
    reviewFinding: "m1",
    supportingSubjects: ["a", "b"],
    sourceBatchFile: "reviews/x.json",
  };
  const record = admitsKnowHow(candidate, { admittedBy: "test-reviewer", admittedAtUtc: "2026-01-01T00:00:00.000Z", repositoryId: "test-repo" });
  assert.equal(record.documentKind, "reviewed-engineering-know-how.v1");
  assert.equal(record.lifecycle, "ADMITTED");
  assert.equal(record.knowHowId, "some-id");
  assert.equal(record.kind, "governance-invariant");
  assert.deepEqual(record.scope, { repositoryId: "test-repo", generalizability: "cross-repository" });
  assert.deepEqual(record.evidence, { inferenceBatch: "reviews/x.json", reviewFinding: "m1", supportingSubjects: ["a", "b"] });
  assert.equal(record.admittedBy, "test-reviewer");
});

test("projectsAuthorityRemediationCandidate never claims authored authority -- lifecycle stays CANDIDATE_NOT_AUTHORED", () => {
  const candidateAuthority = { candidateAuthorityId: "success-response-serialization", family: "serialization", rationale: "close the gap" };
  const record = projectsAuthorityRemediationCandidate(candidateAuthority, {
    citesKnowHowIds: ["success-path-serialization-duplicated-inline"],
    sourceEvidence: { inferenceBatch: "reviews/x.json", targetFile: "src/x.mjs" },
    projectedAtUtc: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(record.documentKind, "authority-remediation-candidate.v1");
  assert.equal(record.lifecycle, "CANDIDATE_NOT_AUTHORED");
  assert.equal(record.candidateAuthorityId, "success-response-serialization");
  assert.deepEqual(record.citesKnowHow, ["success-path-serialization-duplicated-inline"]);
  assert.deepEqual(record.sourceEvidence, { inferenceBatch: "reviews/x.json", targetFile: "src/x.mjs" });
});

test("discoversKnowHowRegistry separates admitted know-how from authority-remediation candidates and ignores unrelated JSON", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-know-how-"));
  try {
    await mkdir(path.join(tempDir, "authority-remediation-candidates"), { recursive: true });
    await writeFile(path.join(tempDir, "kh1.json"), JSON.stringify({ documentKind: "reviewed-engineering-know-how.v1", knowHowId: "kh1" }), "utf8");
    await writeFile(path.join(tempDir, "authority-remediation-candidates", "cand1.json"), JSON.stringify({ documentKind: "authority-remediation-candidate.v1", candidateAuthorityId: "cand1" }), "utf8");
    await writeFile(path.join(tempDir, "unrelated.json"), JSON.stringify({ documentKind: "something-else.v1" }), "utf8");

    const registry = await discoversKnowHowRegistry(tempDir, { relativeTo: tempDir });
    assert.equal(registry.admittedKnowHow.length, 1);
    assert.equal(registry.admittedKnowHow[0].document.knowHowId, "kh1");
    assert.equal(registry.authorityRemediationCandidates.length, 1);
    assert.equal(registry.authorityRemediationCandidates[0].document.candidateAuthorityId, "cand1");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("summarizesKnowHowRegistry tallies admitted know-how by kind and generalizability, and keeps remediation candidates explicitly unauthored", () => {
  const admittedKnowHow = [
    { filePath: "know-how/a.json", document: { knowHowId: "a", lifecycle: "ADMITTED", kind: "implementation-gap", statement: "s1", scope: { generalizability: "repository-specific" }, evidence: { inferenceBatch: "reviews/x.json" } } },
    { filePath: "know-how/b.json", document: { knowHowId: "b", lifecycle: "ADMITTED", kind: "governance-invariant", statement: "s2", scope: { generalizability: "cross-repository" }, evidence: { inferenceBatch: "reviews/x.json" } } },
  ];
  const authorityRemediationCandidates = [
    { filePath: "know-how/authority-remediation-candidates/c.json", document: { candidateAuthorityId: "c", lifecycle: "CANDIDATE_NOT_AUTHORED", family: "serialization", rationale: "r", citesKnowHow: ["a"] } },
  ];

  const summary = summarizesKnowHowRegistry({ admittedKnowHow, authorityRemediationCandidates });
  assert.equal(summary.admittedKnowHowCount, 2);
  assert.deepEqual(summary.byKind, { "implementation-gap": 1, "governance-invariant": 1 });
  assert.deepEqual(summary.byGeneralizability, { "repository-specific": 1, "cross-repository": 1 });
  assert.equal(summary.authorityRemediationCandidateCount, 1);
  assert.equal(summary.authorityRemediationCandidates[0].lifecycle, "CANDIDATE_NOT_AUTHORED");
  assert.deepEqual(summary.authorityRemediationCandidates[0].citesKnowHow, ["a"]);
});

test("projectsSelfGovernanceReport exposes knowHowRegistry, purely descriptive and schema-valid, defaulting to empty when nothing is discovered", async () => {
  const index = buildsSyntheticIndex();
  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [] });
  await validatesSelfGovernanceReport(report);
  assert.equal(report.knowHowRegistry.admittedKnowHowCount, 0);
  assert.equal(report.knowHowRegistry.authorityRemediationCandidateCount, 0);

  const knowHowRegistry = {
    admittedKnowHow: [{ filePath: "know-how/a.json", document: { knowHowId: "a", lifecycle: "ADMITTED", kind: "implementation-gap", statement: "s1", scope: { generalizability: "repository-specific" }, evidence: { inferenceBatch: "reviews/x.json" } } }],
    authorityRemediationCandidates: [],
  };
  const reportWithRegistry = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [], knowHowRegistry });
  await validatesSelfGovernanceReport(reportWithRegistry);
  assert.equal(reportWithRegistry.knowHowRegistry.admittedKnowHowCount, 1);
});

test("discoversSemanticOverlapProposalBatches finds only documentKind semantic-overlap-proposal-batch.v1 files, recursively, ignoring unrelated JSON", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "sfse-reviews-"));
  try {
    await mkdir(path.join(tempDir, "nested"), { recursive: true });
    await writeFile(path.join(tempDir, "batch-a.json"), JSON.stringify(buildsProposalBatchDocument()), "utf8");
    await writeFile(path.join(tempDir, "nested", "batch-b.json"), JSON.stringify(buildsProposalBatchDocument()), "utf8");
    await writeFile(path.join(tempDir, "not-a-batch.json"), JSON.stringify({ documentKind: "something-else.v1" }), "utf8");
    await writeFile(path.join(tempDir, "unparseable.json"), "{ not valid json", "utf8");

    const batches = await discoversSemanticOverlapProposalBatches(tempDir, { relativeTo: tempDir });
    assert.deepEqual(batches.map((batch) => batch.filePath).sort(), ["batch-a.json", "nested/batch-b.json"]);
    assert.equal(batches[0].document.documentKind, "semantic-overlap-proposal-batch.v1");
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("discoversSemanticOverlapProposalBatches returns an empty list for a directory that does not exist", async () => {
  const batches = await discoversSemanticOverlapProposalBatches("C:/definitely/does/not/exist/reviews");
  assert.deepEqual(batches, []);
});

test("projectsSelfGovernanceReport exposes semanticOverlapProposals as a purely observational tally, never affecting governance counts", async () => {
  const index = buildsSyntheticIndex();
  const semanticOverlapProposalBatches = [{ filePath: "reviews/x.json", document: buildsProposalBatchDocument() }];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments: [], semanticOverlapProposalBatches });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.semanticOverlapProposals.length, 1);
  assert.equal(report.semanticOverlapProposals[0].proposalFile, "reviews/x.json");
  assert.deepEqual(report.semanticOverlapProposals[0].reviewedDispositionCounts, { PROPOSED_EXACT_OVERLAP: 1, PROPOSED_PARTIAL_OVERLAP: 1, PROPOSED_NO_MATCH: 1 });
  assert.equal(report.semanticOverlapProposals[0].inferenceQuality.proposalsGenerated, 3);
  // Untouched by the proposal batch -- this remains purely deterministic.
  assert.equal(report.executionMechanics.governed, 0);
});
