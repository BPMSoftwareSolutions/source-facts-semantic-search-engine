function formatsCount(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

function formatsPercent(numerator, denominator) {
  if (denominator === 0) return "n/a";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function formatsMechanicEvidence(mechanicsByType) {
  const entries = Object.entries(mechanicsByType);
  if (entries.length === 0) return "none statically observed";
  return entries.map(([mechanic, count]) => `${count} ${mechanic}`).join(", ");
}

function formatsScenarioConformanceFeatures(report) {
  const lines = [];
  for (const feature of report.scenarioConformance.features) {
    lines.push(`## Feature: \`${feature.featureId}\``);
    lines.push("");
    lines.push(feature.purpose);
    lines.push("");
    lines.push(`Feature authority: \`${feature.authorityFile}\``);
    lines.push("");
    if (feature.classifications.length > 0) {
      lines.push(`Optional classifications: ${feature.classifications.map((classification) => `\`${classification.relationship}:${classification.classificationId}\``).join(", ")}. These are derived labels, not feature parents.`);
      lines.push("");
    }

    for (const scenario of feature.scenarios) {
        lines.push(`### Scenario: \`${scenario.scenarioId}\``);
        lines.push("");
        lines.push(scenario.purpose);
        lines.push("");
        lines.push(`Closure: \`${scenario.closureDisposition}\``);
        lines.push("");
        lines.push(scenario.blockers.length > 0
          ? `Blockers: ${scenario.blockers.map((blocker) => `\`${blocker}\``).join(", ")}`
          : "Blockers: none.");
        lines.push("");
        lines.push("| Responsibility | Obligation | Authority meaning | Binding | Projected body | Connected meaning | Static body evidence | Execution | Proof |");
        lines.push("|---|---|---|---|---|---|---|---|---|");

        for (const obligation of scenario.obligations) {
          if (obligation.responsibilities.length === 0) {
            lines.push(`| (unassigned) | \`${obligation.obligationId}\` — ${obligation.statement} | ${obligation.authorityStatus} | MISSING | (none) | NONE | none | NOT OBSERVED | NOT OBSERVED |`);
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
              + ` | ${responsibility.proofStatus} |`,
            );
          }
        }
        lines.push("");
    }
  }
  return lines;
}

function formatsUnclassifiedInventory(report) {
  const { unclassifiedInventory, executionMechanics, knowHowRegistry, healingDraftRegistry } = report;
  const noLineageCount = unclassifiedInventory.mechanicsByFeatureCoveragePosture.FEATURE_COVERAGE_MISSING ?? 0;
  const lines = [
    "## Unclassified Inventory",
    "",
    "These facts are inside the report subject but are not allowed to influence a",
    "feature or scenario verdict until explicit lineage places them on the spine.",
    "",
    "| Inventory | Count | Disposition |",
    "|---|---:|---|",
    `| Static mechanics without scenario lineage | ${formatsCount(noLineageCount)} | \`NO_SCENARIO_LINEAGE\` |`,
    `| Authority documents without canonical scenario lineage | ${formatsCount(unclassifiedInventory.unclassifiedAuthorityDocumentCount)} | \`AUTHORITY_WITHOUT_SCENARIO_LINEAGE\` |`,
    `| Admitted know-how without obligation lineage | ${formatsCount(unclassifiedInventory.knowHowWithoutScenarioLineage)} | \`UNCLASSIFIED_KNOW_HOW\` |`,
    `| Healing drafts without a scenario target | ${formatsCount(unclassifiedInventory.healingDraftsWithoutScenarioTarget)} | \`HEALING_WITHOUT_SCENARIO_TARGET\` |`,
    "",
  ];

  if (noLineageCount > 0) {
    lines.push("### Mechanics without scenario lineage");
    lines.push("");
    lines.push("| Mechanic | Occurrences | Files |");
    lines.push("|---|---:|---:|");
    for (const entry of executionMechanics.byMechanicType) {
      const occurrences = report.occurrences.filter(
        (occurrence) => occurrence.mechanic === entry.mechanic && occurrence.featureCoveragePosture === "FEATURE_COVERAGE_MISSING",
      );
      if (occurrences.length === 0) continue;
      lines.push(`| ${entry.mechanic} | ${formatsCount(occurrences.length)} | ${new Set(occurrences.map((occurrence) => occurrence.modulePath)).size} |`);
    }
    lines.push("");
  }

  if (unclassifiedInventory.unclassifiedAuthorityDocuments.length > 0) {
    lines.push("### Authority without scenario lineage");
    lines.push("");
    for (const document of unclassifiedInventory.unclassifiedAuthorityDocuments) {
      const posture = report.featureCoverage.entityCoverage.authoritySubjects
        .find((entry) => entry.authorityFile === document.authorityFile)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${document.authorityFile}\` (${document.documentKind}) — \`${posture}\``);
    }
    lines.push("");
  }

  if (knowHowRegistry.knowHowRecords.length > 0) {
    lines.push("### Know-how awaiting obligation lineage");
    lines.push("");
    for (const record of knowHowRegistry.knowHowRecords) {
      const posture = report.featureCoverage.entityCoverage.knowHow
        .find((entry) => entry.knowHowId === record.knowHowId)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${record.knowHowId}\` — \`${posture}\` — ${record.statement}`);
    }
    lines.push("");
  }

  if (healingDraftRegistry.drafts.length > 0) {
    lines.push("### Healing drafts awaiting a scenario target");
    lines.push("");
    for (const draft of healingDraftRegistry.drafts) {
      const posture = report.featureCoverage.entityCoverage.healingDrafts
        .find((entry) => entry.draftFile === draft.draftFile)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${draft.draftFile}\` — \`${posture}\` — targets \`${draft.subjectId ?? "(unspecified)"}\`, but declares no canonical feature / scenario / responsibility / obligation tuple.`);
    }
    lines.push("");
  }
  return lines;
}

export function formatsScenarioConformanceReportMarkdown(report) {
  const { repository, index, disposition, generatedAtUtc, scenarioConformance, featureCoverage, subjectScope } = report;
  const { summary } = scenarioConformance;
  const featureSummary = featureCoverage.summary;
  const lines = [
    "# Source Facts Self-Governance Report",
    "",
    "Feature Coverage and Scenario Conformance View",
    "",
    "| | |",
    "|---|---|",
    "| **Report type** | `source-facts-self-governance-report.v1` |",
    `| **Generated** | ${generatedAtUtc} |`,
    `| **Repository** | ${repository.repositoryId} |`,
    `| **Workspace** | \`${repository.workspaceRoot ?? "(unknown)"}\` |`,
    `| **Scan ID** | ${index.scanId ?? "(unknown)"} |`,
    `| **Disposition** | \`${disposition}\` |`,
    "",
    "## Executive Summary",
    "",
    "This report is organized around canonical feature coverage and scenario closure. Static",
    "mechanics, authority documents, wiring, reviews, know-how, and healing drafts are",
    "supporting evidence only. They cannot establish conformance without an explicit",
    "feature → scenario → responsibility → obligation → authority → execution → proof lineage and a passing",
    "execution proof.",
    "",
    "| Feature coverage posture | Count |",
    "|---|---:|",
    `| Canonical features | ${formatsCount(featureSummary.canonicalFeatures)} |`,
    `| Scenarios | ${formatsCount(featureSummary.scenarios)} |`,
    `| Fully conformant scenarios | ${formatsCount(featureSummary.fullyConformantScenarios)} |`,
    `| Partially conformant scenarios | ${formatsCount(featureSummary.partiallyConformantScenarios)} |`,
    `| Feature proposals pending review | ${formatsCount(featureSummary.featureProposalsPendingReview)} |`,
    `| Live inference evaluations | ${formatsCount(featureSummary.liveInferenceEvaluations)} |`,
    `| Uncovered feature-inference clusters | ${formatsCount(featureSummary.uncoveredFeatureClusters)} |`,
    `| Optional capability relations proposed | ${formatsCount(featureSummary.capabilityRelationsProposed)} |`,
    `| Duplicate proposals prevented | ${formatsCount(featureSummary.duplicateProposalsPrevented)} |`,
    `| Unclassified mechanics | ${formatsCount(featureSummary.unclassifiedMechanics)} |`,
  ];

  for (const [blocker, count] of Object.entries(summary.byBlocker).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`| Scenarios affected by \`${blocker}\` | ${formatsCount(count)} |`);
  }

  lines.push("");
  lines.push("## Feature Coverage Proposals");
  lines.push("");
  if (featureCoverage.proposals.length === 0) {
    lines.push("No in-subject feature coverage proposals were discovered.");
    lines.push("");
  } else {
    lines.push("Proposals are inferred coverage candidates, not canonical feature authority.");
    lines.push("");
    lines.push("| Proposed feature | Evidence cluster | Scenarios | Coverage gained | Status | Duplicate check |");
    lines.push("|---|---|---:|---:|---|---|");
    for (const proposal of featureCoverage.proposals) {
      const cluster = `${proposal.evidence.symbols.length} responsibility symbols, ${proposal.matchedOccurrences} targeted ${proposal.evidence.mechanics.join("/")} mechanics (${proposal.coverageTarget.serializationOccurrencesInSourceFile ?? proposal.matchedOccurrences} in source file)`;
      lines.push(`| \`${proposal.featureId}\` — ${proposal.featureTitle} | ${cluster} | ${proposal.scenarios.length} | ${proposal.coverageTarget.responsibilitiesCovered ?? proposal.responsibilities.length} responsibilities | \`FEATURE_PROPOSAL_REVIEW_REQUIRED\` | \`${proposal.duplicateDisposition}\` |`);
      lines.push(`|  | Fingerprint: \`${proposal.fingerprint}\`${proposal.fingerprintVerified ? " (verified)" : " (DECLARED FINGERPRINT MISMATCH)"} |  |  |  |  |`);
    }
    lines.push("");
    for (const proposal of featureCoverage.proposals) {
      lines.push(`### Proposed Feature: \`${proposal.featureId}\``);
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
      lines.push(`Evidence: ${proposal.evidence.sourceFiles.map((file) => `\`${file}\``).join(", ")}; symbols ${proposal.evidence.symbols.map((symbol) => `\`${symbol}\``).join(", ")}; know-how ${proposal.evidence.knowHow.map((item) => `\`${item}\``).join(", ")}.`);
      lines.push("");
      if (proposal.capabilityRelations.length > 0) {
        lines.push("Optional capability relationship proposals (not feature parents):");
        lines.push("");
        for (const relation of proposal.capabilityRelations) {
          lines.push(`- \`${relation.relationship}\` → \`${relation.candidateCapabilityId}\` — \`${relation.disposition}\`; evidence: ${relation.evidence?.sharedSubject ?? "(none)"} / ${relation.evidence?.sharedOutcome ?? "(none)"}.`);
        }
        lines.push("");
      }
    }
  }

  lines.push("## Live Feature-Inference Evaluations");
  lines.push("");
  lines.push("These are real model calls over deterministic query clusters. They are observational test evidence only: they do not establish feature coverage or capability placement.");
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
    lines.push("## Uncovered Feature-Inference Clusters");
    lines.push("");
    lines.push("These bounded clusters are eligible inference inputs after deterministic duplicate checking.");
    lines.push("");
    lines.push("| Evidence cluster | Mechanics | Occurrences | Coverage posture |");
    lines.push("|---|---|---:|---|");
    for (const cluster of featureCoverage.uncoveredClusters.slice(0, 30)) {
      lines.push(`| \`${cluster.modulePath}#${cluster.responsibility ?? "(module-scope)"}\` | ${cluster.mechanics.join(", ")} | ${cluster.occurrences} | \`FEATURE_COVERAGE_MISSING\` |`);
    }
    if (featureCoverage.uncoveredClusters.length > 30) lines.push(`| … | ${featureCoverage.uncoveredClusters.length - 30} additional cluster(s) in JSON |  |  |`);
    lines.push("");
  }

  lines.push("## Canonical Feature Drill-Down");
  lines.push("");
  if (summary.featuresDiscovered === 0) {
    lines.push("**No canonical feature lineage is declared for this report subject.** The scan can inventory static mechanics, but it cannot make a scenario-conformance claim. The next required authority is a canonical feature declaration for this workspace.");
    lines.push("");
  } else {
    lines.push("| Feature | Optional classifications | Scenarios | Responsibilities | Conformant |");
    lines.push("|---|---|---:|---:|---:|");
    for (const feature of scenarioConformance.features) {
      const scenarios = feature.scenarios;
      const responsibilities = scenarios.flatMap((scenario) => scenario.obligations).flatMap((obligation) => obligation.responsibilities);
      const conformant = scenarios.filter((scenario) => scenario.closureDisposition === "CONFORMANT").length;
      const classifications = feature.classifications.length === 0 ? "none detected" : feature.classifications.map((classification) => `\`${classification.classificationId}\``).join(", ");
      lines.push(`| \`${feature.featureId}\` | ${classifications} | ${scenarios.length} | ${responsibilities.length} | ${conformant}/${scenarios.length} (${formatsPercent(conformant, scenarios.length)}) |`);
    }
    lines.push("");
  }

  lines.push(...formatsScenarioConformanceFeatures(report));
  lines.push(...formatsUnclassifiedInventory(report));
  lines.push("## Subject Boundary");
  lines.push("");
  lines.push(`Scope mode: \`${subjectScope.scopeMode}\`; repository-relative workspace prefix: \`${subjectScope.workspaceRelativePrefix || "(repository root)"}\`.`);
  lines.push("");
  lines.push("| Evidence class | Discovered | In subject | Excluded as out of subject |");
  lines.push("|---|---:|---:|---:|");
  lines.push(`| Authority documents | ${subjectScope.authorityDocumentsDiscovered} | ${subjectScope.authorityDocumentsInScope} | ${subjectScope.authorityDocumentsExcluded} |`);
  lines.push(`| Semantic-overlap proposal batches | ${subjectScope.proposalBatchesDiscovered} | ${subjectScope.proposalBatchesInScope} | ${subjectScope.proposalBatchesExcluded} |`);
  lines.push(`| Feature-coverage proposals | ${subjectScope.featureCoverageProposalsDiscovered} | ${subjectScope.featureCoverageProposalsInScope} | ${subjectScope.featureCoverageProposalsExcluded} |`);
  lines.push(`| Live feature-inference evaluations | ${subjectScope.featureCoverageInferenceEvaluationsDiscovered} | ${subjectScope.featureCoverageInferenceEvaluationsInScope} | ${subjectScope.featureCoverageInferenceEvaluationsExcluded} |`);
  lines.push(`| Know-how records | ${subjectScope.knowHowRecordsDiscovered} | ${subjectScope.knowHowRecordsInScope} | ${subjectScope.knowHowRecordsExcluded} |`);
  lines.push(`| Healing drafts | ${subjectScope.healingDraftsDiscovered} | ${subjectScope.healingDraftsInScope} | ${subjectScope.healingDraftsExcluded} |`);
  lines.push("");
  lines.push("Excluded evidence is not called orphaned: it belongs to a different subject and is not judged by this scan.");
  lines.push("");
  lines.push("## Disposition");
  lines.push("");
  lines.push(`\`${disposition}\` — this static run does not execute scenario proofs or gate a build. A scenario remains non-conformant until its declared responsibilities, authority, binding, projected body, live execution, and passing proof all close.`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function formatsScenarioConformanceReportSummary(report) {
  const { summary } = report.scenarioConformance;
  const featureSummary = report.featureCoverage.summary;
  const lines = [
    "Source Facts Self-Governance — Scenario Conformance",
    `Repository: ${report.repository.repositoryId}`,
    `Workspace: ${report.repository.workspaceRoot ?? "(unknown)"}`,
    `Canonical features: ${featureSummary.canonicalFeatures}; scenarios: ${featureSummary.scenarios}; conformant: ${featureSummary.fullyConformantScenarios}`,
    `Feature proposals pending review: ${featureSummary.featureProposalsPendingReview}; uncovered feature-inference clusters: ${featureSummary.uncoveredFeatureClusters}`,
  ];
  for (const [blocker, count] of Object.entries(summary.byBlocker).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`  ${blocker}: ${count} scenario(s)`);
  }
  const noLineage = report.unclassifiedInventory.mechanicsByFeatureCoveragePosture.FEATURE_COVERAGE_MISSING ?? 0;
  lines.push(`Unclassified mechanics: ${noLineage}`);
  lines.push(`Healing drafts without scenario target: ${report.unclassifiedInventory.healingDraftsWithoutScenarioTarget}`);
  lines.push(`Authority documents outside subject and excluded: ${report.subjectScope.authorityDocumentsExcluded}`);
  lines.push(`Disposition: ${report.disposition}`);
  return `${lines.join("\n")}\n`;
}
