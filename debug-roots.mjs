import { projectsCliEntryPointCallGraph } from "./src/call-graph.js";
import path from "path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".");

const index = {
  indexType: "source-fact-index.v1",
  indexId: `sha256:${"a".repeat(64)}`,
  manifest: {
    schemaVersion: "1.1.0",
    engine: "source-facts-semantic-search-engine",
    engineVersion: "0.2.0",
    scanId: "b".repeat(64),
    documentRootHash: `sha256:${"c".repeat(64)}`,
    scanRequest: {
      workspaceId: "fixture",
      workspaceRoot: repoRoot,
    },
  },
  workspace: {
    workspaceId: "fixture",
    rootHash: `sha256:${"d".repeat(64)}`,
    languageId: "typescript",
    languageProfileVersion: "1.0.0",
  },
  files: [],
  symbols: [
    { symbolId: "src/cli.js#function:runGovern", name: "runGovern", modulePath: "src/cli.js", kind: "function", isExported: true, declarationLine: 10, declarationColumn: 1, sourceReferenceId: "src/cli.js:10:1" },
    { symbolId: "src/governance/projects-self-governance-report.js#function:projectsSelfGovernanceReport", name: "projectsSelfGovernanceReport", modulePath: "src/governance/projects-self-governance-report.js", kind: "function", isExported: true, declarationLine: 20, declarationColumn: 1, sourceReferenceId: "src/governance/projects-self-governance-report.js:20:1" },
    { symbolId: "src/governance/proposes-feature-coverage.js#function:proposesFeatureCoverage", name: "proposesFeatureCoverage", modulePath: "src/governance/proposes-feature-coverage.js", kind: "function", isExported: true, declarationLine: 30, declarationColumn: 1, sourceReferenceId: "src/governance/proposes-feature-coverage.js:30:1" },
  ],
  relationships: [
    { relationshipId: "1".repeat(64), relationshipKind: "invocation", sourceReferenceId: "src/cli.js:120:12", fromSymbolId: null, toSymbolId: "src/cli.js#function:runGovern", toSymbolCandidate: "runGovern", modulePath: "src/cli.js" },
  ],
  sourceReferences: [
    { referenceId: "src/cli.js:120:12", modulePath: "src/cli.js", startLine: 120, startColumn: 12, endLine: 120, endColumn: 26, kind: "invocation", sourceKind: "call-expression" },
  ],
  dataflows: [],
  documents: [],
  governanceRules: [],
  bodyMechanics: [],
  coverage: { filesObserved: 0, declarations: 3, relationships: 1, controlFlow: 0, syntax: 0, unknownSyntax: 0, documentFacts: 0, governanceRules: 0, bodyMechanics: 0, dataflows: 0, unknownSyntaxRatio: 0 },
};

const graph = projectsCliEntryPointCallGraph(index, { rootModulePath: "src/cli.js", runtimeModulePrefix: "src/" });

console.log("Roots found:", graph.summary.commandRootCount);
console.log("Total roots:", graph.roots.length);
console.log("Root types:");
graph.roots.forEach(root => {
  console.log(`  - ${root.name} (${root.entryKind})`);
});
