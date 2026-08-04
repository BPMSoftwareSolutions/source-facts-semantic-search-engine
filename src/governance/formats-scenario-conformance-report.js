import { queryRows } from "./projects-report-query-lineage.js";

function formatsCount(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

function formatsMechanicEvidence(mechanicsByType) {
  const entries = Object.entries(mechanicsByType);
  if (entries.length === 0) return "none statically observed";
  return entries.map(([mechanic, count]) => `${count} ${mechanic}`).join(", ");
}

function formatsCodeList(values, emptyText = "none") {
  if (values.length === 0) return emptyText;
  return values.map((value) => `\`${value}\``).join(", ");
}

function queryAnchorId(queryId) {
  return `query-result-${queryId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function formatsQueryLink(queryId, label = queryId) {
  return `[\`${label}\`](#${queryAnchorId(queryId)})`;
}

function formatsFactLink(value, queryId, { code = false } = {}) {
  const label = code ? `\`${value}\`` : String(value);
  return `[${label}](#${queryAnchorId(queryId)})`;
}

function receiptFor(report, queryId) {
  return report.queryLineage.queryReceipts.find((entry) => entry.queryId === queryId);
}

function formatsReceiptSummary(report, queryId) {
  const receipt = receiptFor(report, queryId);
  return `${formatsQueryLink(queryId)} — ${formatsCount(receipt.execution.rowCount)} row(s), result \`${receipt.execution.resultHash}\``;
}

function formatsDrillDownLink(drillDown) {
  const bindings = Object.keys(drillDown.parameterBindings ?? {}).length === 0
    ? ""
    : ` ${Object.entries(drillDown.parameterBindings).map(([key, value]) => `\`${key}=${value}\``).join(" ")}`;
  return `${formatsQueryLink(drillDown.queryId, drillDown.label)}${bindings}`;
}

function formatsNextQueries(report, queryId) {
  const receipt = receiptFor(report, queryId);
  return receipt.drillDowns.map(formatsDrillDownLink).join(" · ");
}

function formatsScenarioConformanceFeatures(report) {
  const queryId = "scenario-conformance.drilldown.v1";
  const lines = [
    "Claim type: `QUERYED_DETERMINISTIC_CLASSIFICATION`",
    "",
    `Supporting query result: ${formatsReceiptSummary(report, queryId)}`,
    "",
  ];
  for (const feature of queryRows(report, queryId)) {
    lines.push(`## Feature: \`${feature.featureId}\``);
    lines.push("");
    lines.push(feature.purpose);
    lines.push("");
    lines.push(`Canonical feature authority: \`${feature.authorityFile}\``);
    lines.push("");
    if (feature.classifications.length > 0) {
      lines.push(`Source lineage classification: ${feature.classifications.map((classification) => `\`${classification.classificationId}\``).join(", ")}. This is source-family metadata, not a capability relation or feature parent.`);
      lines.push("");
    }
    if (feature.lineageQualityFindings.length > 0) {
      lines.push(`Feature lineage-quality findings: ${formatsCodeList(feature.lineageQualityFindings)}.`);
      lines.push("");
    }

    for (const scenario of feature.scenarios) {
      lines.push(`### Scenario: \`${scenario.scenarioId}\``);
      lines.push("");
      lines.push(scenario.purpose);
      lines.push("");
      lines.push("| Evaluation dimension | Result | Query result |");
      lines.push("|---|---|---|");
      lines.push(`| Scenario lineage | ${formatsFactLink(scenario.lineageStatus, queryId, { code: true })} | ${formatsQueryLink(queryId)} |`);
      lines.push(`| Structural status | ${formatsFactLink(scenario.structuralStatus, queryId, { code: true })} | ${formatsQueryLink(queryId)} |`);
      lines.push(`| Runtime conformance | ${formatsFactLink(scenario.runtimeConformance, queryId, { code: true })} | ${formatsQueryLink(queryId)} |`);
      lines.push(`| Structural blockers | ${formatsFactLink(formatsCodeList(scenario.structuralBlockers), queryId)} | ${formatsQueryLink(queryId)} |`);
      lines.push(`| Evaluation limits | ${formatsFactLink(formatsCodeList(scenario.evaluationLimits), queryId)} | ${formatsQueryLink(queryId)} |`);
      lines.push(`| Lineage-quality findings | ${formatsFactLink(formatsCodeList(scenario.lineageQualityFindings), queryId)} | ${formatsQueryLink(queryId)} |`);
      lines.push("");
      lines.push("| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result | Query result |");
      lines.push("|---|---|---|---|---|---|---|---|---|---|");

      for (const obligation of scenario.obligations) {
        if (obligation.responsibilities.length === 0) {
          lines.push(`| (unassigned) | \`${obligation.obligationId}\` — ${obligation.statement} | ${obligation.authorityStatus} | MISSING | (none) | NOT EVALUATED | none | NOT EVALUATED | NOT EVALUATED | ${formatsQueryLink(queryId)} |`);
          continue;
        }
        for (const responsibility of obligation.responsibilities) {
          lines.push(
            `| \`${responsibility.responsibilityId ?? "(undeclared)"}\``
            + ` | \`${obligation.obligationId}\` — ${obligation.statement}`
            + ` | ${obligation.authorityStatus}`
            + ` | ${responsibility.bindingStatus}`
            + ` | \`${responsibility.bodyFile ?? "(undeclared)"}\` (${responsibility.bodyStatus})`
            + ` | ${responsibility.wiringStatus}`
            + ` | ${formatsMechanicEvidence(responsibility.mechanicsByType)}`
            + ` | ${responsibility.executionStatus}`
            + ` | ${responsibility.proofStatus}`
            + ` | ${formatsQueryLink(queryId)} |`,
          );
        }
      }
      lines.push("");
    }
  }
  return lines;
}

function formatsUnclassifiedInventory(report) {
  const unclassifiedInventory = queryRows(report, "feature-coverage.unclassified-inventory.v1")[0];
  const noLineageCount = unclassifiedInventory.mechanicsByFeatureCoveragePosture.FEATURE_COVERAGE_MISSING ?? 0;
  const lines = [
    "## Evidence Without Canonical Lineage",
    "",
    "Claim type: `QUERYED_GAP_FACT`",
    "",
    "These facts are inside the report subject but have no admitted scenario lineage. A proposal is",
    "shown as proposed coverage; it is never counted as canonical coverage.",
    "",
    "| Inventory | Count | Disposition | Query |",
    "|---|---:|---|---|",
    `| Static mechanics without canonical or proposed lineage | ${formatsFactLink(formatsCount(noLineageCount), "feature-coverage.unclassified-inventory.v1")} | ${formatsFactLink("NO_SCENARIO_LINEAGE", "feature-coverage.unclassified-inventory.v1", { code: true })} | ${formatsQueryLink("feature-coverage.unclassified-inventory.v1")} |`,
    `| Authority documents without canonical scenario lineage | ${formatsFactLink(formatsCount(unclassifiedInventory.unclassifiedAuthorityDocumentCount), "feature-coverage.unclassified-inventory.v1")} | inspect per-item posture below | ${formatsQueryLink("feature-coverage.unclassified-inventory.v1")} |`,
    `| Admitted know-how without canonical obligation lineage | ${formatsFactLink(formatsCount(unclassifiedInventory.knowHowWithoutScenarioLineage), "feature-coverage.unclassified-inventory.v1")} | inspect per-item posture below | ${formatsQueryLink("feature-coverage.unclassified-inventory.v1")} |`,
    `| Healing drafts without a canonical scenario target | ${formatsFactLink(formatsCount(unclassifiedInventory.healingDraftsWithoutScenarioTarget), "feature-coverage.unclassified-inventory.v1")} | ${formatsFactLink("HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET", "feature-coverage.unclassified-inventory.v1", { code: true })} | ${formatsQueryLink("feature-coverage.unclassified-inventory.v1")} |`,
    "",
  ];

  if (noLineageCount > 0) {
    lines.push("### Mechanics without lineage");
    lines.push("");
    lines.push("| Mechanic | Occurrences | Files | Query |");
    lines.push("|---|---:|---:|---|");
    for (const entry of queryRows(report, "feature-coverage.unlined-mechanics.v1")) {
      lines.push(`| ${entry.mechanic} | ${formatsFactLink(formatsCount(entry.occurrenceCount), "feature-coverage.unlined-mechanics.v1")} | ${formatsFactLink(entry.fileCount, "feature-coverage.unlined-mechanics.v1")} | ${formatsQueryLink("feature-coverage.unlined-mechanics.v1")} |`);
    }
    lines.push("");
  }

  if (unclassifiedInventory.unclassifiedAuthorityDocuments.length > 0) {
    lines.push("### Authority without canonical scenario lineage");
    lines.push("");
    for (const document of unclassifiedInventory.unclassifiedAuthorityDocuments) {
      const posture = unclassifiedInventory.entityCoverage.authoritySubjects
        .find((entry) => entry.authorityFile === document.authorityFile)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${document.authorityFile}\` (${document.documentKind}) — \`${posture}\``);
    }
    lines.push("");
  }

  if (unclassifiedInventory.knowHowRecords.length > 0) {
    lines.push("### Know-how without canonical obligation lineage");
    lines.push("");
    for (const record of unclassifiedInventory.knowHowRecords) {
      const posture = unclassifiedInventory.entityCoverage.knowHow
        .find((entry) => entry.knowHowId === record.knowHowId)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${record.knowHowId}\` — \`${posture}\` — ${record.statement}`);
    }
    lines.push("");
  }

  if (unclassifiedInventory.healingDrafts.length > 0) {
    lines.push("### Healing drafts without a canonical scenario target");
    lines.push("");
    for (const draft of unclassifiedInventory.healingDrafts) {
      const posture = unclassifiedInventory.entityCoverage.healingDrafts
        .find((entry) => entry.draftFile === draft.draftFile)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${draft.draftFile}\` — \`${posture}\` — targets \`${draft.subjectId ?? "(unspecified)"}\`, but declares no canonical feature / scenario / responsibility / obligation tuple.`);
    }
    lines.push("");
  }
  return lines;
}

function pushesCountBreakdown(lines, heading, values, queryId) {
  for (const [label, count] of Object.entries(values).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`| ${heading} \`${label}\` | ${formatsFactLink(formatsCount(count), queryId)} | ${formatsQueryLink(queryId)} |`);
  }
}

function addsExecutiveDrillDownColumn(lines, report) {
  const header = lines.indexOf("| Dimension | Count | Query |");
  if (header < 0) return;
  lines[header] = "| Dimension | Count | Proving query | Drill down |";
  lines[header + 1] = "|---|---:|---|---|";
  for (let index = header + 2; index < lines.length; index++) {
    if (!lines[index].startsWith("|")) break;
    const match = lines[index].match(/\[`([^`]+)`\]\(#query-result-[^)]+\) \|$/);
    if (!match) continue;
    lines[index] = lines[index].replace(/ \|$/, ` | ${formatsNextQueries(report, match[1])} |`);
  }
}

function formatsQueryEvidenceAppendix(report, receiptDirectory) {
  const lines = [
    "## Query Evidence Appendix",
    "",
    "### Query Evidence Register",
    "",
    "| Query ID | Purpose | Rows | Query hash | Result hash | Status |",
    "|---|---|---:|---|---|---|",
  ];
  const registrations = new Map(report.queryLineage.registeredQueries.map((query) => [query.queryId, query]));
  for (const receipt of report.queryLineage.queryReceipts) {
    const query = registrations.get(receipt.queryId);
    lines.push(`| ${formatsQueryLink(receipt.queryId)} | ${query?.section ?? "(unregistered)"} | ${receipt.execution.rowCount} | \`${receipt.queryHash}\` | \`${receipt.execution.resultHash}\` | \`${receipt.execution.disposition}\` |`);
  }
  lines.push("", "### Drill-Down Query Register", "");
  lines.push("| Parent query | Depth | Next query | Parameter bindings | Purpose |");
  lines.push("|---|---:|---|---|---|");
  for (const query of report.queryLineage.registeredQueries) {
    for (const drillDown of query.drillDowns) {
      const bindings = Object.keys(drillDown.parameterBindings).length === 0
        ? "none"
        : Object.entries(drillDown.parameterBindings).map(([key, value]) => `\`${key}=${value}\``).join(", ");
      lines.push(`| ${formatsQueryLink(query.queryId)} | ${query.depth} | ${formatsQueryLink(drillDown.queryId)} | ${bindings} | ${drillDown.label} |`);
    }
  }
  lines.push("", "### Registered Queries and Results", "");
  for (const query of report.queryLineage.registeredQueries) {
    const receipt = report.queryLineage.queryReceipts.find((entry) => entry.queryId === query.queryId);
    const claims = report.queryLineage.claims.filter((claim) => claim.queryId === query.queryId);
    const resultJson = JSON.stringify(receipt.result.rows, null, 2);
    const artifactName = `${queryAnchorId(query.queryId).replace(/^query-result-/, "")}.json`;
    const artifactLink = `${receiptDirectory}/${artifactName}`;
    lines.push(`<a id="${queryAnchorId(query.queryId)}"></a>`, "");
    lines.push(`#### \`${query.queryId}\``, "");
    lines.push("| Binding | Value |", "|---|---|");
    lines.push(`| Purpose | ${query.section} |`);
    lines.push(`| Version | \`${query.queryVersion}\` |`);
    lines.push(`| Index ID | \`${receipt.index.indexId ?? "(unknown)"}\` |`);
    lines.push(`| Scan ID | \`${receipt.index.scanId ?? "(unknown)"}\` |`);
    lines.push(`| Scope | \`${query.scopePolicy}\` |`);
    lines.push(`| Query hash | \`${query.queryHash}\` |`);
    lines.push(`| Result hash | \`${receipt.execution.resultHash}\` |`);
    lines.push(`| Rows | ${receipt.execution.rowCount} |`);
    lines.push(`| Execution | \`${receipt.execution.disposition}\` |`);
    lines.push(`| Full receipt artifact | [Open query, rows, and claim pointers](${artifactLink}) |`);
    lines.push(`| Next queries | ${receipt.drillDowns.length === 0 ? "terminal physical/healing evidence" : receipt.drillDowns.map(formatsDrillDownLink).join("<br>")} |`);
    lines.push("", "```sql", query.queryText, "```", "");
    if (receipt.execution.rowCount <= 20 && resultJson.length <= 20_000) {
      lines.push(`<details><summary>Inspect ${receipt.execution.rowCount} result row(s) inline</summary>`, "", "```json", resultJson, "```", "", "</details>", "");
    } else {
      lines.push(`Full ${receipt.execution.rowCount}-row result: [open the bound receipt artifact](${artifactLink}).`, "");
    }
    if (claims.length <= 50) {
      lines.push(`<details><summary>Inspect ${claims.length} rendered claim pointer(s) inline</summary>`, "");
      if (claims.length === 0) {
        lines.push("No scalar claims were rendered from this empty result.", "");
      } else {
        for (const claim of claims) {
          lines.push(`- \`${claim.reportPointer}\` ← \`${claim.valuePointer}\` (${claim.claimType})`);
        }
        lines.push("");
      }
      lines.push("</details>", "");
    } else {
      lines.push(`Full ${claims.length}-pointer claim map: [open the bound receipt artifact](${artifactLink}).`, "");
    }
  }
  return lines;
}

function formatsClaimReconciliation(report) {
  const value = report.queryLineage.reconciliation;
  return [
    "## Report Claim Reconciliation",
    "",
    "| Check | Result |",
    "|---|---:|",
    `| Registered factual claim values | ${value.claimCount} |`,
    `| Claims with query pointers | ${value.claimsWithQueryPointers} |`,
    `| Claims with required drill-down path | ${value.claimsWithRequiredDrillDownPath} |`,
    `| Claims lacking drill-down path | ${value.claimsLackingDrillDownPath} |`,
    `| Broken drill-down query references | ${value.brokenDrillDownQueryReferences} |`,
    `| Invalid parameter bindings | ${value.invalidDrillDownParameterBindings} |`,
    `| Drill-down result-schema failures | ${value.drillDownResultSchemaFailures} |`,
    `| Missing query pointers | ${value.missingQueryPointers} |`,
    `| Unsupported factual claims | ${value.unsupportedFactualClaims} |`,
    `| Stale receipts | ${value.staleReceipts} |`,
    `| Index mismatches | ${value.indexMismatches} |`,
    `| Scope mismatches | ${value.scopeMismatches} |`,
    `| Result-shape failures | ${value.resultShapeFailures} |`,
    `| Result-hash failures | ${value.resultHashFailures} |`,
    `| Rendered-value mismatches | ${value.renderedValueMismatches} |`,
    `| Deterministic rerun mismatches | ${value.deterministicRerunMismatches} |`,
    "",
    `**Reconciliation disposition:** \`${value.disposition}\``,
    "",
  ];
}

function formatsAuthorityAuthoringReadiness(report) {
  const value = report.queryLineage.authoringReconciliation;
  const queryId = "authoring.reconciliation.v1";
  return [
    "## Authority Authoring Readiness",
    "",
    "Claim type: `QUERYED_DETERMINISTIC_CLASSIFICATION`",
    "",
    `Reconciliation query: ${formatsQueryLink(queryId)}`,
    "",
    "| Check | Result | Proving query |",
    "|---|---:|---|",
    `| Healing candidates | ${formatsFactLink(value.healingCandidates, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Candidates with authoring evidence bundle | ${formatsFactLink(value.candidatesWithAuthoringEvidenceBundle, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Candidates with complete query provenance | ${formatsFactLink(value.candidatesWithCompleteQueryProvenance, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Candidates with unresolved required evidence | ${formatsFactLink(value.candidatesWithUnresolvedRequiredEvidence, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Candidates ready for semantic authority authoring | ${formatsFactLink(value.candidatesReadyForSemanticAuthorityAuthoring, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Candidates ready for projection | ${formatsFactLink(value.candidatesReadyForProjection, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Declared responsibilities with authoring bundles | ${formatsFactLink(value.declaredResponsibilityBundles, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Declared responsibilities awaiting interface evidence for authoring | ${formatsFactLink(value.declaredResponsibilitiesBlockedByInterface, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Declared responsibilities ready for projection | ${formatsFactLink(value.declaredResponsibilitiesReadyForProjection, queryId)} | ${formatsQueryLink(queryId)} |`,
    `| Declared responsibilities projectable with interface evidence gap | ${formatsFactLink(value.declaredResponsibilitiesProjectableWithInterfaceEvidenceGap, queryId)} | ${formatsQueryLink(queryId)} |`,
    "",
    "### Authoring Actions",
    "",
    "| Action | Query |",
    "|---|---|",
    `| Build authority evidence bundle | ${formatsQueryLink("authoring.semantic-authority-evidence-bundle.v1")} |`,
    `| Inspect inferred feature/scenario context | ${formatsQueryLink("authoring.scenario-context.v1")} |`,
    `| Inspect decision policy | ${formatsQueryLink("authoring.decision-evidence.v1")} |`,
    `| Inspect data shapes | ${formatsQueryLink("authoring.object-shape-evidence.v1")} |`,
    `| Inspect failure behavior | ${formatsQueryLink("authoring.failure-policy-evidence.v1")} |`,
    `| Inspect existing authority overlap | ${formatsQueryLink("authoring.authority-overlap.v1")} |`,
    `| Inspect admitted contract maps | ${formatsQueryLink("authoring.contract-map.v1")} |`,
    `| Build projection target | ${formatsQueryLink("authoring.projection-target.v1")} |`,
    `| Build proof vectors | ${formatsQueryLink("authoring.proof-vector-candidates.v1")} |`,
    "",
    "Lifecycle: `OBSERVED_EVIDENCE` â†’ `INFERRED_AUTHORITY_DRAFT` â†’ `REVIEWED_AUTHORITY_DRAFT` â†’ `ADMITTED_AUTHORITY` â†’ `PROJECTED_BODY` â†’ `EQUIVALENCE_PROVEN`.",
    "",
  ];
}

export function formatsScenarioConformanceReportMarkdown(report, { receiptDirectory = "source-facts-self-governance-report.receipts" } = {}) {
  const { repository, index, disposition, generatedAtUtc } = report;
  const summary = queryRows(report, "scenario-conformance.summary.v1")[0];
  const featureSummary = queryRows(report, "feature-coverage.summary.v1")[0];
  const subjectScope = queryRows(report, "subject-boundary.evidence.v1")[0];
  const featureCoverage = {
    ...report.featureCoverage,
    proposals: queryRows(report, "feature-coverage.proposal-evidence.v1"),
    liveInferenceEvaluations: queryRows(report, "feature-coverage.live-inference.v1"),
    uncoveredClusters: queryRows(report, "feature-coverage.unresolved-clusters.v1"),
  };
  const scenarioConformance = {
    ...report.scenarioConformance,
    features: queryRows(report, "scenario-conformance.drilldown.v1"),
  };
  const { catalog, reconciliation } = report.queryLineage;
  const lines = [
    "# Source Facts Self-Governance Report",
    "",
    "Honest Feature Coverage and Scenario Evaluation View",
    "",
    "| | |",
    "|---|---|",
    "| **Report type** | `source-facts-self-governance-report.v1` |",
    `| **Generated** | ${generatedAtUtc} |`,
    `| **Repository** | ${repository.repositoryId} |`,
    `| **Workspace** | \`${repository.workspaceRoot ?? "(unknown)"}\` |`,
    `| **Source index ID** | \`${index.indexId ?? "(unknown)"}\` |`,
    `| **Scan ID** | \`${index.scanId ?? "(unknown)"}\` |`,
    `| **Query catalog** | \`${catalog.catalogId}\` |`,
    `| **Query catalog hash** | \`${catalog.catalogHash}\` |`,
    `| **Query receipts** | ${reconciliation.receiptsExecuted} executed / ${reconciliation.receiptsValid} valid |`,
    `| **Render reconciliation** | \`${reconciliation.disposition}\` |`,
    `| **Unsupported factual claims** | ${reconciliation.unsupportedFactualClaims} |`,
    `| **Disposition** | \`${disposition}\` |`,
    "",
    "## Executive Summary",
    "",
    "This report keeps four independent questions separate: whether lineage is canonical or proposed,",
    "whether the declared structure is closed, whether execution was evaluated, and whether a proof",
    "passed. Static source evidence and live LLM inference calls can support discovery, but neither is",
    "a runtime execution receipt for a scenario.",
    "",
    "| Dimension | Count | Query |",
    "|---|---:|---|",
    `| Canonical feature declarations | ${formatsFactLink(formatsCount(featureSummary.canonicalFeatures), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Proposed features, not admitted | ${formatsFactLink(formatsCount(featureSummary.proposedFeatures), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios | ${formatsFactLink(formatsCount(featureSummary.canonicalScenarios), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Proposed scenarios, not admitted | ${formatsFactLink(formatsCount(featureSummary.proposedScenarios), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios structurally closed | ${formatsFactLink(formatsCount(featureSummary.scenariosStructurallyClosed), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios structurally incomplete | ${formatsFactLink(formatsCount(featureSummary.scenariosStructurallyIncomplete), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios with structural status not evaluated | ${formatsFactLink(formatsCount(featureSummary.scenariosStructuralStatusNotEvaluated), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios with execution evaluated | ${formatsFactLink(formatsCount(featureSummary.scenariosExecutionEvaluated), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios with runtime conformance \`NOT_EVALUATED\` | ${formatsFactLink(formatsCount(featureSummary.scenariosRuntimeNotEvaluated), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios conformant by execution proof | ${formatsFactLink(formatsCount(featureSummary.fullyConformantScenarios), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Canonical scenarios with lineage-quality findings | ${formatsFactLink(formatsCount(featureSummary.scenariosWithLineageQualityFindings), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Mechanics with canonical scenario lineage | ${formatsFactLink(formatsCount(featureSummary.mechanicsWithCanonicalLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Mechanics with proposed scenario lineage | ${formatsFactLink(formatsCount(featureSummary.mechanicsWithProposedLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Mechanics with ambiguous scenario lineage | ${formatsFactLink(formatsCount(featureSummary.mechanicsWithAmbiguousLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Mechanics without scenario lineage | ${formatsFactLink(formatsCount(featureSummary.mechanicsWithoutLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Authority documents with canonical scenario lineage | ${formatsFactLink(formatsCount(featureSummary.authorityWithCanonicalLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Authority documents with proposed scenario lineage | ${formatsFactLink(formatsCount(featureSummary.authorityWithProposedLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Authority documents with ambiguous scenario lineage | ${formatsFactLink(formatsCount(featureSummary.authorityWithAmbiguousLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Authority documents without scenario lineage | ${formatsFactLink(formatsCount(featureSummary.authorityWithoutLineage), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Unresolved responsibility-evidence clusters | ${formatsFactLink(formatsCount(featureSummary.unresolvedEvidenceClusters), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Clusters confirmed as feature candidates | ${formatsFactLink(formatsCount(featureSummary.confirmedFeatureCandidateClusters), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Live LLM inference evaluations | ${formatsFactLink(formatsCount(featureSummary.liveInferenceEvaluations), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Optional capability relations proposed from evidence | ${formatsFactLink(formatsCount(featureSummary.capabilityRelationsProposed), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
    `| Duplicate proposals prevented | ${formatsFactLink(formatsCount(featureSummary.duplicateProposalsPrevented), "feature-coverage.summary.v1")} | ${formatsQueryLink("feature-coverage.summary.v1")} |`,
  ];

  pushesCountBreakdown(lines, "Scenarios with structural blocker", summary.byStructuralBlocker, "scenario-conformance.summary.v1");
  pushesCountBreakdown(lines, "Scenarios with evaluation limit", summary.byEvaluationLimit, "scenario-conformance.summary.v1");
  pushesCountBreakdown(lines, "Scenarios with lineage-quality finding", summary.byLineageQualityFinding, "scenario-conformance.summary.v1");
  addsExecutiveDrillDownColumn(lines, report);

  lines.push("");
  lines.push("**Query evidence**");
  lines.push("");
  lines.push(`- ${formatsReceiptSummary(report, "feature-coverage.summary.v1")}`);
  lines.push(`- ${formatsReceiptSummary(report, "scenario-conformance.summary.v1")}`);
  lines.push(`- ${formatsReceiptSummary(report, "feature-coverage.unresolved-clusters.v1")}`);
  lines.push("");
  lines.push("## Feature Coverage Proposals");
  lines.push("");
  lines.push("Claim type: `QUERYED_INFERENCE_ARTIFACT_FACT`");
  lines.push("");
  lines.push(`Query result: ${formatsReceiptSummary(report, "feature-coverage.proposal-evidence.v1")}`);
  lines.push("");
  if (featureCoverage.proposals.length === 0) {
    lines.push("No in-subject feature coverage proposals were discovered.");
    lines.push("");
  } else {
    lines.push("These are inferred candidates. They do not become canonical feature or scenario lineage until admitted into canonical authority.");
    lines.push("");
    lines.push("| Proposed feature | Evidence cluster | Scenarios | Responsibilities | Coverage posture | Duplicate check | Query result |");
    lines.push("|---|---|---:|---:|---|---|---|");
    for (const proposal of featureCoverage.proposals) {
      const mechanics = proposal.evidence.mechanics.length > 0 ? proposal.evidence.mechanics.join("/") : "unspecified";
      const cluster = `${proposal.evidenceSymbolCount} symbols; ${proposal.matchedOccurrences} matching ${mechanics} mechanics`;
      lines.push(`| \`${proposal.featureId}\` — ${proposal.featureTitle} | ${formatsFactLink(cluster, "feature-coverage.proposal-evidence.v1")} | ${formatsFactLink(proposal.scenarioCount, "feature-coverage.proposal-evidence.v1")} | ${formatsFactLink(proposal.responsibilityCount, "feature-coverage.proposal-evidence.v1")} | ${formatsFactLink(proposal.lifecycle === "ADMITTED" ? "FEATURE_COVERED" : "FEATURE_COVERAGE_PROPOSED", "feature-coverage.proposal-evidence.v1", { code: true })} | ${formatsFactLink(proposal.duplicateDisposition, "feature-coverage.proposal-evidence.v1", { code: true })} | ${formatsQueryLink("feature-coverage.proposal-evidence.v1")} |`);
      lines.push(`|  | Fingerprint: \`${proposal.fingerprint}\`${proposal.fingerprintVerified ? " (verified)" : " (DECLARED FINGERPRINT MISMATCH)"} |  |  |  |  | ${formatsQueryLink("feature-coverage.proposal-evidence.v1")} |`);
    }
    lines.push("");
    for (const proposal of featureCoverage.proposals) {
      lines.push(`### Proposed Feature: \`${proposal.featureId}\``);
      lines.push("");
      lines.push(`Lifecycle: ${formatsFactLink(proposal.lifecycle, "feature-coverage.proposal-evidence.v1", { code: true })}  `);
      lines.push(`Proposal query: ${formatsQueryLink("feature-coverage.proposal-evidence.v1")}`);
      lines.push("");
      lines.push(`**As a** ${proposal.narrative.asA}; **I need** ${proposal.narrative.iNeed}; **so that** ${proposal.narrative.soThat}.`);
      lines.push("");
      lines.push("```gherkin");
      lines.push(`Feature: ${proposal.featureTitle}`);
      for (const scenario of proposal.scenarios) {
        lines.push("");
        lines.push(`  Scenario: ${scenario.title}`);
        for (const [position, given] of (scenario.given ?? []).entries()) lines.push(`    ${position === 0 ? "Given" : "And"} ${given}`);
        for (const [position, when] of (scenario.when ?? []).entries()) lines.push(`    ${position === 0 ? "When" : "And"} ${when}`);
        for (const [position, then] of (scenario.then ?? []).entries()) lines.push(`    ${position === 0 ? "Then" : "And"} ${then}`);
      }
      lines.push("```");
      lines.push("");
      lines.push(`Evidence files: ${formatsCodeList(proposal.evidence.sourceFiles)}; symbols: ${formatsCodeList(proposal.evidence.symbols)}; know-how: ${formatsCodeList(proposal.evidence.knowHow)}.`);
      lines.push("");
      if (proposal.capabilityRelations.length > 0) {
        lines.push("Optional capability relationship proposals (evidence-derived, never feature parents):");
        lines.push("");
        for (const relation of proposal.capabilityRelations) {
          lines.push(`- \`${relation.relationship}\` → \`${relation.candidateCapabilityId}\` — \`${relation.disposition}\`; evidence: ${relation.evidence?.sharedSubject ?? "(none)"} / ${relation.evidence?.sharedOutcome ?? "(none)"}.`);
        }
        lines.push("");
      }
    }
  }

  lines.push("## Live LLM Feature-Inference Evaluations");
  lines.push("");
  lines.push("Claim type: `QUERYED_INFERENCE_ARTIFACT_FACT`");
  lines.push("");
  lines.push("These are receipts from real model calls over deterministic query results. They test the inference target, but remain observational discovery evidence: they neither admit a feature nor execute a product scenario.");
  lines.push("");
  lines.push(`Query result: ${formatsReceiptSummary(report, "feature-coverage.live-inference.v1")}`);
  lines.push("");
  if (featureCoverage.liveInferenceEvaluations.length === 0) {
    lines.push("No in-subject live feature-inference evaluation artifacts were discovered.");
    lines.push("");
  } else {
    lines.push("| Candidate feature | Model call | Query receipt | Candidate comparison | Optional capability relation | Lifecycle |");
    lines.push("|---|---|---|---|---|---|");
    for (const evaluation of featureCoverage.liveInferenceEvaluations) {
      const modelCall = `\`${evaluation.model ?? "(unknown)"}\`; ${formatsCount(evaluation.usage?.totalTokens)} tokens; ${formatsCount(evaluation.durationMilliseconds)} ms; request \`${evaluation.requestHash ?? "(none)"}\`; response \`${evaluation.responseHash ?? "(none)"}\``;
      const queryReceipt = `${formatsCount(evaluation.queryEvidence?.rowCount)} rows; input \`${evaluation.queryEvidence?.inputHash ?? "(none)"}\`; result \`${evaluation.queryEvidence?.resultHash ?? "(none)"}\``;
      const capabilityRelations = evaluation.capabilityRelations.length === 0
        ? `\`${evaluation.capabilityRelationDisposition ?? "NO_CAPABILITY_RELATION_DETECTED"}\``
        : evaluation.capabilityRelations.map((relation) => `\`${relation.disposition}:${relation.candidateCapabilityId}\``).join(", ");
      lines.push(`| \`${evaluation.featureId}\` — ${evaluation.featureTitle} | ${modelCall} | ${queryReceipt} | \`${evaluation.comparisonDisposition}\` | ${capabilityRelations} | \`${evaluation.lifecycle}\` |`);
      lines.push(`|  | Evaluation: \`${evaluation.evaluationFile}\` | Fingerprint: \`${evaluation.fingerprint}\` |  |  |  |`);
    }
    lines.push("");
  }

  if (featureCoverage.uncoveredClusters.length > 0) {
    lines.push("## Unresolved Responsibility Evidence");
    lines.push("");
    lines.push("Claim type: `QUERYED_GAP_FACT`");
    lines.push("");
    lines.push("These are bounded static-evidence clusters, not feature candidates. A function or module scope becomes eligible for feature inference only after a separate feature-shaping review establishes an actor, outcome, scenario boundary, responsibility, and obligation.");
    lines.push("");
    lines.push(`Query result: ${formatsReceiptSummary(report, "feature-coverage.unresolved-clusters.v1")}`);
    lines.push("");
    lines.push("| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility | Query result |");
    lines.push("|---|---|---|---:|---|---|---|");
    for (const cluster of featureCoverage.uncoveredClusters.slice(0, 30)) {
      lines.push(`| \`${cluster.modulePath}#${cluster.responsibility ?? "(module-scope)"}\` | \`${cluster.clusterKind}\` | ${cluster.mechanics.join(", ")} | ${formatsFactLink(cluster.occurrences, "feature-coverage.unresolved-clusters.v1")} | \`${cluster.featureCandidateDisposition}\` | \`${cluster.inferenceEligibility}\` | ${formatsQueryLink("feature-coverage.unresolved-clusters.v1")} |`);
    }
    if (featureCoverage.uncoveredClusters.length > 30) lines.push(`| … |  | Full result continues in the cited query receipt |  |  |  | ${formatsQueryLink("feature-coverage.unresolved-clusters.v1")} |`);
    lines.push("");
  }

  lines.push("## Canonical Feature Drill-Down");
  lines.push("");
  lines.push("Claim type: `QUERYED_CANONICAL_AUTHORITY_FACT` and `QUERYED_DETERMINISTIC_CLASSIFICATION`");
  lines.push("");
  lines.push(`Query result: ${formatsReceiptSummary(report, "scenario-conformance.drilldown.v1")}`);
  lines.push("");
  if (summary.featuresDiscovered === 0) {
    lines.push("**No canonical feature lineage is declared for this report subject.** Static mechanics and inference proposals can be inventoried, but no canonical scenario structural or runtime verdict can be made.");
    lines.push("");
  } else {
    lines.push("| Feature | Source lineage classification | Scenarios | Responsibilities | Structurally closed | Runtime conformant | Lineage-quality findings | Query result |");
    lines.push("|---|---|---:|---:|---:|---:|---:|---|");
    for (const feature of scenarioConformance.features) {
      const classifications = feature.classifications.length === 0 ? "none detected" : feature.classifications.map((classification) => `\`${classification.classificationId}\``).join(", ");
      lines.push(`| \`${feature.featureId}\` | ${classifications} | ${formatsFactLink(feature.scenarioCount, "scenario-conformance.drilldown.v1")} | ${formatsFactLink(feature.responsibilityCount, "scenario-conformance.drilldown.v1")} | ${formatsFactLink(feature.structurallyClosedCount, "scenario-conformance.drilldown.v1")} | ${formatsFactLink(feature.runtimeConformantCount, "scenario-conformance.drilldown.v1")} | ${formatsFactLink(feature.lineageQualityFindingCount, "scenario-conformance.drilldown.v1")} | ${formatsQueryLink("scenario-conformance.drilldown.v1")} |`);
    }
    lines.push("");
  }

  lines.push(...formatsScenarioConformanceFeatures(report));
  lines.push(...formatsUnclassifiedInventory(report));
  lines.push("## Subject Boundary");
  lines.push("");
  lines.push("Claim type: `QUERYED_SCOPE_FACT`");
  lines.push("");
  lines.push(`Scope mode: \`${subjectScope.scopeMode}\`; repository-relative workspace prefix: \`${subjectScope.workspaceRelativePrefix || "(repository root)"}\`.`);
  lines.push("");
  lines.push(`Query result: ${formatsReceiptSummary(report, "subject-boundary.evidence.v1")}`);
  lines.push("");
  lines.push("| Evidence class | Discovered | In subject | Excluded as out of subject | Query result |");
  lines.push("|---|---:|---:|---:|---|");
  lines.push(`| Authority documents | ${formatsFactLink(subjectScope.authorityDocumentsDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.authorityDocumentsInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.authorityDocumentsExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push(`| Semantic-overlap proposal batches | ${formatsFactLink(subjectScope.proposalBatchesDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.proposalBatchesInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.proposalBatchesExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push(`| Feature-coverage proposals | ${formatsFactLink(subjectScope.featureCoverageProposalsDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.featureCoverageProposalsInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.featureCoverageProposalsExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push(`| Live feature-inference evaluations | ${formatsFactLink(subjectScope.featureCoverageInferenceEvaluationsDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.featureCoverageInferenceEvaluationsInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.featureCoverageInferenceEvaluationsExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push(`| Know-how records | ${formatsFactLink(subjectScope.knowHowRecordsDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.knowHowRecordsInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.knowHowRecordsExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push(`| Healing drafts | ${formatsFactLink(subjectScope.healingDraftsDiscovered, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.healingDraftsInScope, "subject-boundary.evidence.v1")} | ${formatsFactLink(subjectScope.healingDraftsExcluded, "subject-boundary.evidence.v1")} | ${formatsQueryLink("subject-boundary.evidence.v1")} |`);
  lines.push("");
  lines.push("Excluded evidence is not called orphaned: it belongs to a different subject and is not judged by this scan.");
  lines.push("");
  lines.push(...formatsAuthorityAuthoringReadiness(report));
  lines.push(...formatsClaimReconciliation(report));
  lines.push(...formatsQueryEvidenceAppendix(report, receiptDirectory));
  lines.push("## Disposition");
  lines.push("");
  lines.push(`\`${disposition}\` — this run statically evaluates declarations and wiring evidence. It does not execute product scenarios or their proof verifiers. Runtime conformance therefore remains \`NOT_EVALUATED\` unless a separate execution receipt is supplied.`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function formatsScenarioConformanceReportSummary(report) {
  const { summary } = report.scenarioConformance;
  const featureSummary = report.featureCoverage.summary;
  const lines = [
    "Source Facts Self-Governance — Honest Scenario Evaluation",
    `Repository: ${report.repository.repositoryId}`,
    `Workspace: ${report.repository.workspaceRoot ?? "(unknown)"}`,
    `Features: ${featureSummary.canonicalFeatures} canonical, ${featureSummary.proposedFeatures} proposed`,
    `Scenarios: ${featureSummary.canonicalScenarios} canonical, ${featureSummary.proposedScenarios} proposed`,
    `Structural: ${featureSummary.scenariosStructurallyClosed} closed, ${featureSummary.scenariosStructurallyIncomplete} incomplete, ${featureSummary.scenariosStructuralStatusNotEvaluated} not evaluated`,
    `Runtime: ${featureSummary.scenariosExecutionEvaluated} execution-evaluated, ${featureSummary.fullyConformantScenarios} conformant, ${featureSummary.scenariosRuntimeNotEvaluated} not evaluated`,
    `Mechanics lineage: ${featureSummary.mechanicsWithCanonicalLineage} canonical, ${featureSummary.mechanicsWithProposedLineage} proposed, ${featureSummary.mechanicsWithoutLineage} none`,
    `Authority lineage: ${featureSummary.authorityWithCanonicalLineage} canonical, ${featureSummary.authorityWithProposedLineage} proposed, ${featureSummary.authorityWithoutLineage} none`,
    `Unresolved responsibility-evidence clusters: ${featureSummary.unresolvedEvidenceClusters}; confirmed feature candidates: ${featureSummary.confirmedFeatureCandidateClusters}`,
  ];
  for (const [finding, count] of Object.entries(summary.byLineageQualityFinding).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`  lineage quality ${finding}: ${count} scenario(s)`);
  }
  lines.push(`Healing drafts without canonical scenario target: ${report.unclassifiedInventory.healingDraftsWithoutScenarioTarget}`);
  lines.push(`Authority documents outside subject and excluded: ${report.subjectScope.authorityDocumentsExcluded}`);
  lines.push(`Disposition: ${report.disposition}`);
  return `${lines.join("\n")}\n`;
}
