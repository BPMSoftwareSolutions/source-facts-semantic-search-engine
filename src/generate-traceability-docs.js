import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

export async function generatesTraceabilityDocs(reportPath, graphPath, indexPath, outputPath) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  const index = JSON.parse(readFileSync(indexPath, "utf8"));

  const timestamp = new Date().toISOString();
  const reportIndexId = report.index?.indexId ?? report.indexId ?? "unknown";
  const reportScanId = report.index?.scanId ?? report.manifest?.scanId ?? "unknown";
  const graphIndexId = graph.indexId ?? "unknown";
  const repositoryId = report.repository?.repositoryId ?? report.index?.subject?.repositoryId ?? report.manifest?.scanRequest?.workspaceId ?? "unknown";
  const scenarioConformance = report.scenarioConformance?.summary ?? report.scenarioConformance ?? {};
  const featureCoverage = report.featureCoverage?.summary ?? report.featureCoverage ?? {};
  const evidence = report.evidence?.summary ?? report.evidence ?? {};
  const authority = report.authority?.summary ?? report.authority ?? {};
  const findings = report.findings?.summary ?? report.findings ?? {};
  const evaluationLimits = report.evaluationLimits?.summary ?? report.evaluationLimits ?? {};

  const canonicalScenarioCount = scenarioConformance.canonicalScenarioCount
    ?? report.scenarioConformance?.canonicalScenarioCount
    ?? 0;
  const structurallyClosedCount = scenarioConformance.structurallyClosedCount
    ?? report.scenarioConformance?.structurallyClosedCount
    ?? 0;
  const executionEvaluatedCount = scenarioConformance.executionEvaluatedCount
    ?? report.scenarioConformance?.executionEvaluatedCount
    ?? 0;
  const conformantCount = scenarioConformance.conformantCount
    ?? report.scenarioConformance?.conformantCount
    ?? 0;

  const canonicalFeatureCount = featureCoverage.canonicalFeatureCount
    ?? report.featureCoverage?.canonicalFeatureCount
    ?? 0;
  const proposedFeatureCount = featureCoverage.proposedFeatureCount
    ?? report.featureCoverage?.proposedFeatureCount
    ?? 0;

  const canonicalMechanicsCount = evidence.canonicalMechanicsCount ?? report.evidence?.canonicalMechanicsCount ?? 0;
  const proposedMechanicsCount = evidence.proposedMechanicsCount ?? report.evidence?.proposedMechanicsCount ?? 0;
  const ambiguousMechanicsCount = evidence.ambiguousMechanicsCount ?? report.evidence?.ambiguousMechanicsCount ?? 0;
  const unlinkedMechanicsCount = evidence.unlinkedMechanicsCount ?? report.evidence?.unlinkedMechanicsCount ?? 0;
  const unresolvedClustersCount = evidence.unresolvedClustersCount ?? report.evidence?.unresolvedClustersCount ?? 0;

  const canonicalLinageCount = authority.canonicalLinageCount ?? authority.canonicalLineageCount
    ?? report.authority?.canonicalLinageCount ?? report.authority?.canonicalLineageCount ?? 0;
  const proposedLineageCount = authority.proposedLineageCount ?? report.authority?.proposedLineageCount ?? 0;
  const missingLineageCount = authority.missingLineageCount ?? report.authority?.missingLineageCount ?? 0;

  const implementationVariantsCount = findings.implementationVariantsCount ?? report.findings?.implementationVariantsCount ?? 0;
  const multipleOwnersCount = findings.multipleOwnersCount ?? report.findings?.multipleOwnersCount ?? 0;
  const projectionGapsCount = findings.projectionGapsCount ?? report.findings?.projectionGapsCount ?? 0;

  const authorityDepthCount = evaluationLimits.authorityDepthCount ?? report.evaluationLimits?.authorityDepthCount ?? 0;
  const bodyOutOfScopeCount = evaluationLimits.bodyOutOfScopeCount ?? report.evaluationLimits?.bodyOutOfScopeCount ?? 0;
  const bodyNotObservedCount = evaluationLimits.bodyNotObservedCount ?? report.evaluationLimits?.bodyNotObservedCount ?? 0;

  const symbolCounts = countSymbolsByKind(index.symbols ?? []);

  const markdown = `# Traceability Metrics Report

**Generated:** ${timestamp}
**Report Index ID:** \`${reportIndexId}\`
**Report Scan ID:** \`${reportScanId}\`
**Call Graph Index ID:** \`${graphIndexId}\`
**Repository:** ${repositoryId}

---

## 1. Entry Point Reachability (Call Graph)

| Metric | Value |
|---|---:|
| CLI command roots | ${graph.summary.commandRootCount} |
| Exported function roots | ${graph.summary.exportedFunctionRootCount ?? 0} |
| Total entry points | ${graph.summary.totalRootCount ?? graph.summary.commandRootCount} |
| Runtime callable functions | ${graph.summary.runtimeCallableCount} |
| Reachable from entry points | ${graph.summary.reachableCallableCount} |
| Unreachable (dead code) | ${graph.summary.unreachableCallableCount} |
| Invocation edges | ${graph.summary.invocationEdgeCount} |
| Resolved edges | ${graph.summary.resolvedInvocationEdgeCount} |
| Ambiguous edges | ${graph.summary.ambiguousInvocationEdgeCount} |
| Unresolved edges | ${graph.summary.unresolvedInvocationEdgeCount} |
| Max call depth | ${graph.summary.maxDepth} |

**Reachability Coverage:** \`${((graph.summary.reachableCallableCount / graph.summary.runtimeCallableCount) * 100).toFixed(1)}%\`

---

## 2. Symbol Inventory (Source Index)

| Symbol Kind | Count |
|---|---:|
| Functions | ${symbolCounts.function} |
| Variables | ${symbolCounts.variable} |
| Parameters | ${symbolCounts.parameter} |
| Classes | ${symbolCounts.class} |
| **Total** | **${symbolCounts.total}** |

---

## 3. Feature Coverage (Governance Report)

| Measure | Value |
|---|---:|
| Canonical features | ${canonicalFeatureCount} |
| Proposed features | ${proposedFeatureCount} |
| Canonical scenarios | ${canonicalScenarioCount} |
| Scenarios structurally closed | ${structurallyClosedCount} |
| Scenarios with execution evaluated | ${executionEvaluatedCount} |
| Scenarios runtime conformant | ${conformantCount} |

**Structural Closure Rate:** \`${calculateRate(structurallyClosedCount, canonicalScenarioCount)}%\`
**Runtime Conformance Rate:** \`${calculateRate(conformantCount, canonicalScenarioCount)}%\`

---

## 4. Evidence Lineage (Mechanics and Clusters)

| Lineage Type | Count |
|---|---:|
| Mechanics with canonical scenario lineage | ${canonicalMechanicsCount} |
| Mechanics with proposed scenario lineage | ${proposedMechanicsCount} |
| Mechanics with ambiguous lineage | ${ambiguousMechanicsCount} |
| Mechanics without scenario lineage | ${unlinkedMechanicsCount} |
| Unresolved responsibility clusters | ${unresolvedClustersCount} |

---

## 5. Authority Document Status

| Status | Count |
|---|---:|
| With canonical scenario lineage | ${canonicalLinageCount} |
| With proposed scenario lineage | ${proposedLineageCount} |
| Without scenario lineage | ${missingLineageCount} |

---

## 6. Completeness Dimensions (Round 1 Baseline)

| Dimension | Symbol | Current Status | Target |
|---|---|---|---|
| Inventory completeness | \`I\` | Measured | 100% |
| Reachability closure | \`R\` | ${((graph.summary.reachableCallableCount / graph.summary.runtimeCallableCount) * 100).toFixed(1)}% | 100% |
| Canonical lineage coverage | \`L\` | ${calculateRate(canonicalMechanicsCount, unlinkedMechanicsCount + canonicalMechanicsCount)}% | 100% |
| Capability mapping | \`C\` | Pending | 100% |
| Structural closure | \`S\` | ${calculateRate(structurallyClosedCount, canonicalScenarioCount)}% | 100% |
| Runtime proof coverage | \`P\` | ${calculateRate(conformantCount, canonicalScenarioCount)}% | 100% |

**Strict Traceability Score:** \`min(I, R, L, C, S, P) = TBD\`

---

## 7. Lineage Quality Findings

| Finding | Count |
|---|---:|
| Implementation variants declared as distinct responsibilities | ${implementationVariantsCount} |
| Multiple responsibility owners requiring review | ${multipleOwnersCount} |
| Projection obligations without projecting relationship | ${projectionGapsCount} |

---

## 8. Evaluation Limits (Structural Blockers)

| Limit Type | Count |
|---|---:|
| Authority wiring not evaluated (depth limit) | ${authorityDepthCount} |
| Body not evaluated outside subject | ${bodyOutOfScopeCount} |
| Body not statically observed | ${bodyNotObservedCount} |

---

## Artifact Identity

This report ties metrics to three versioned artifacts:

1. **Source-facts index:** \`${reportIndexId}\` (scan: \`${reportScanId}\`)
2. **Call-graph index:** \`${graphIndexId}\`
3. **Report generation:** ${timestamp}

Metrics should be regenerated whenever the source-facts index changes. This document should not be manually edited; update the generator script in \`src/generate-traceability-docs.js\` instead.

---

**Round 1 Readiness:** Metrics are now versioned and reproducible from the index. Documentation will remain current with each governance run.
`;

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, markdown, "utf8");
  return outputPath;
}

function countSymbolsByKind(symbols) {
  const counts = {
    function: 0,
    variable: 0,
    parameter: 0,
    class: 0,
    total: symbols.length,
  };

  for (const symbol of symbols) {
    if (symbol.kind === "function") counts.function++;
    else if (symbol.kind === "variable") counts.variable++;
    else if (symbol.kind === "parameter") counts.parameter++;
    else if (symbol.kind === "class") counts.class++;
  }

  return counts;
}

function calculateRate(numerator, denominator) {
  if (!numerator || !denominator || denominator === 0) return "0";
  return ((numerator / denominator) * 100).toFixed(1);
}
