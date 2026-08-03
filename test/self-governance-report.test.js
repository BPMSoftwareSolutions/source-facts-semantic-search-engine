import assert from "node:assert/strict";
import { test } from "node:test";
import { classifiesMechanicOccurrence, extractsDeclaredAuthorityMechanics } from "../src/governance/classifies-execution-mechanics.js";
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

function buildsSyntheticIndex() {
  const sourceReferences = [
    { referenceId: "ref-1", modulePath: "src/example.js", startLine: 11, endLine: 11, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-2", modulePath: "src/example.js", startLine: 40, endLine: 40, startColumn: 1, endColumn: 1 },
    { referenceId: "ref-3", modulePath: "src/other.js", startLine: 5, endLine: 5, startColumn: 1, endColumn: 1 },
  ];
  const symbols = [
    { symbolId: "sym-1", name: "resolvesExample", modulePath: "src/example.js" },
  ];
  const bodyMechanics = [
    { mechanicId: "bm-1", mechanic: "branch", modulePath: "src/example.js", sourceReferenceId: "ref-1", fromSymbolId: "sym-1" },
    { mechanicId: "bm-2", mechanic: "fallback", modulePath: "src/example.js", sourceReferenceId: "ref-2", fromSymbolId: null },
    { mechanicId: "bm-3", mechanic: "throw", modulePath: "src/other.js", sourceReferenceId: "ref-3", fromSymbolId: null },
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
  const authorityDocuments = [{ filePath: "contracts/example.authority.json", document: buildsAuthorityDocument() }];

  const report = await projectsSelfGovernanceReport({ index, repositoryId: "self-governance-test", authorityDocuments });
  await validatesSelfGovernanceReport(report);

  assert.equal(report.executionMechanics.observed, 3);
  assert.equal(report.executionMechanics.governed, 1);
  assert.equal(report.executionMechanics.byPosture.GOVERNED_BY_SEMANTIC_AUTHORITY, 1);
  assert.equal(report.executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, 2);

  const branchSummary = report.executionMechanics.byMechanicType.find((entry) => entry.mechanic === "branch");
  assert.deepEqual(branchSummary, { mechanic: "branch", observed: 1, governed: 1 });

  const governedOccurrence = report.occurrences.find((occurrence) => occurrence.mechanic === "branch");
  assert.equal(governedOccurrence.posture, "GOVERNED_BY_SEMANTIC_AUTHORITY");
  assert.equal(governedOccurrence.governingMechanicId, "resolve-example-decision");

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
});
