import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

export async function generatesTraceabilityDocs(reportPath, graphPath, indexPath, outputPath) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  const index = JSON.parse(readFileSync(indexPath, "utf8"));

  const timestamp = new Date().toISOString();
  const reportIndexId = report.indexId ?? "unknown";
  const reportScanId = report.manifest?.scanId ?? "unknown";
  const graphIndexId = graph.indexId ?? "unknown";

  const symbolCounts = countSymbolsByKind(index.symbols ?? []);

  const markdown = `# Traceability Metrics Report

**Generated:** ${timestamp}
**Report Index ID:** \`${reportIndexId}\`
**Report Scan ID:** \`${reportScanId}\`
**Call Graph Index ID:** \`${graphIndexId}\`
**Repository:** ${report.manifest?.scanRequest?.workspaceId ?? "unknown"}

---

## 1. Entry Point Reachability (Call Graph)

| Metric | Value |
|---|---:|
| Command roots discovered | ${graph.summary.commandRootCount} |
| Runtime callable functions | ${graph.summary.runtimeCallableCount} |
| Reachable from CLI | ${graph.summary.reachableCallableCount} |
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
| Canonical features | ${report.featureCoverage?.canonicalFeatureCount ?? 0} |
| Proposed features | ${report.featureCoverage?.proposedFeatureCount ?? 0} |
| Canonical scenarios | ${report.scenarioConformance?.canonicalScenarioCount ?? 0} |
| Scenarios structurally closed | ${report.scenarioConformance?.structurallyClosedCount ?? 0} |
| Scenarios with execution evaluated | ${report.scenarioConformance?.executionEvaluatedCount ?? 0} |
| Scenarios runtime conformant | ${report.scenarioConformance?.conformantCount ?? 0} |

**Structural Closure Rate:** \`${calculateRate(report.scenarioConformance?.structurallyClosedCount, report.scenarioConformance?.canonicalScenarioCount)}%\`
**Runtime Conformance Rate:** \`${calculateRate(report.scenarioConformance?.conformantCount, report.scenarioConformance?.canonicalScenarioCount)}%\`

---

## 4. Evidence Lineage (Mechanics and Clusters)

| Lineage Type | Count |
|---|---:|
| Mechanics with canonical scenario lineage | ${report.evidence?.canonicalMechanicsCount ?? 0} |
| Mechanics with proposed scenario lineage | ${report.evidence?.proposedMechanicsCount ?? 0} |
| Mechanics with ambiguous lineage | ${report.evidence?.ambiguousMechanicsCount ?? 0} |
| Mechanics without scenario lineage | ${report.evidence?.unlinkedMechanicsCount ?? 0} |
| Unresolved responsibility clusters | ${report.evidence?.unresolvedClustersCount ?? 0} |

---

## 5. Authority Document Status

| Status | Count |
|---|---:|
| With canonical scenario lineage | ${report.authority?.canonicalLinageCount ?? 0} |
| With proposed scenario lineage | ${report.authority?.proposedLineageCount ?? 0} |
| Without scenario lineage | ${report.authority?.missingLineageCount ?? 0} |

---

## 6. Completeness Dimensions (Round 1 Baseline)

| Dimension | Symbol | Current Status | Target |
|---|---|---|---|
| Inventory completeness | \`I\` | Measured | 100% |
| Reachability closure | \`R\` | ${((graph.summary.reachableCallableCount / graph.summary.runtimeCallableCount) * 100).toFixed(1)}% | 100% |
| Canonical lineage coverage | \`L\` | ${calculateRate(report.evidence?.canonicalMechanicsCount, report.evidence?.unlinkedMechanicsCount + (report.evidence?.canonicalMechanicsCount ?? 0))}% | 100% |
| Capability mapping | \`C\` | Pending | 100% |
| Structural closure | \`S\` | ${calculateRate(report.scenarioConformance?.structurallyClosedCount, report.scenarioConformance?.canonicalScenarioCount)}% | 100% |
| Runtime proof coverage | \`P\` | ${calculateRate(report.scenarioConformance?.conformantCount, report.scenarioConformance?.canonicalScenarioCount)}% | 100% |

**Strict Traceability Score:** \`min(I, R, L, C, S, P) = TBD\`

---

## 7. Lineage Quality Findings

| Finding | Count |
|---|---:|
| Implementation variants declared as distinct responsibilities | ${report.findings?.implementationVariantsCount ?? 0} |
| Multiple responsibility owners requiring review | ${report.findings?.multipleOwnersCount ?? 0} |
| Projection obligations without projecting relationship | ${report.findings?.projectionGapsCount ?? 0} |

---

## 8. Evaluation Limits (Structural Blockers)

| Limit Type | Count |
|---|---:|
| Authority wiring not evaluated (depth limit) | ${report.evaluationLimits?.authorityDepthCount ?? 0} |
| Body not evaluated outside subject | ${report.evaluationLimits?.bodyOutOfScopeCount ?? 0} |
| Body not statically observed | ${report.evaluationLimits?.bodyNotObservedCount ?? 0} |

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
