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

function formatsScenarioConformanceFeatures(report) {
  const lines = [];
  for (const feature of report.scenarioConformance.features) {
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
      lines.push(`Scenario lineage: \`${scenario.lineageStatus}\`; structural status: \`${scenario.structuralStatus}\`; runtime conformance: \`${scenario.runtimeConformance}\`.`);
      lines.push("");
      lines.push(`Structural blockers: ${formatsCodeList(scenario.structuralBlockers)}.`);
      lines.push("");
      lines.push(`Evaluation limits: ${formatsCodeList(scenario.evaluationLimits)}.`);
      lines.push("");
      lines.push(`Lineage-quality findings: ${formatsCodeList(scenario.lineageQualityFindings)}.`);
      lines.push("");
      lines.push("| Responsibility | Obligation | Authority declaration | Binding | Declared body | Authority execution wiring | Static body evidence | Runtime execution | Proof result |");
      lines.push("|---|---|---|---|---|---|---|---|---|");

      for (const obligation of scenario.obligations) {
        if (obligation.responsibilities.length === 0) {
          lines.push(`| (unassigned) | \`${obligation.obligationId}\` — ${obligation.statement} | ${obligation.authorityStatus} | MISSING | (none) | NOT EVALUATED | none | NOT EVALUATED | NOT EVALUATED |`);
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
    "## Evidence Without Canonical Lineage",
    "",
    "These facts are inside the report subject but have no admitted scenario lineage. A proposal is",
    "shown as proposed coverage; it is never counted as canonical coverage.",
    "",
    "| Inventory | Count | Disposition |",
    "|---|---:|---|",
    `| Static mechanics without canonical or proposed lineage | ${formatsCount(noLineageCount)} | \`NO_SCENARIO_LINEAGE\` |`,
    `| Authority documents without canonical scenario lineage | ${formatsCount(unclassifiedInventory.unclassifiedAuthorityDocumentCount)} | inspect per-item posture below |`,
    `| Admitted know-how without canonical obligation lineage | ${formatsCount(unclassifiedInventory.knowHowWithoutScenarioLineage)} | inspect per-item posture below |`,
    `| Healing drafts without a canonical scenario target | ${formatsCount(unclassifiedInventory.healingDraftsWithoutScenarioTarget)} | \`HEALING_WITHOUT_CANONICAL_SCENARIO_TARGET\` |`,
    "",
  ];

  if (noLineageCount > 0) {
    lines.push("### Mechanics without lineage");
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
    lines.push("### Authority without canonical scenario lineage");
    lines.push("");
    for (const document of unclassifiedInventory.unclassifiedAuthorityDocuments) {
      const posture = report.featureCoverage.entityCoverage.authoritySubjects
        .find((entry) => entry.authorityFile === document.authorityFile)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${document.authorityFile}\` (${document.documentKind}) — \`${posture}\``);
    }
    lines.push("");
  }

  if (knowHowRegistry.knowHowRecords.length > 0) {
    lines.push("### Know-how without canonical obligation lineage");
    lines.push("");
    for (const record of knowHowRegistry.knowHowRecords) {
      const posture = report.featureCoverage.entityCoverage.knowHow
        .find((entry) => entry.knowHowId === record.knowHowId)?.featureCoveragePosture ?? "FEATURE_COVERAGE_MISSING";
      lines.push(`- \`${record.knowHowId}\` — \`${posture}\` — ${record.statement}`);
    }
    lines.push("");
  }

  if (healingDraftRegistry.drafts.length > 0) {
    lines.push("### Healing drafts without a canonical scenario target");
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

function pushesCountBreakdown(lines, heading, values) {
  for (const [label, count] of Object.entries(values).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(`| ${heading} \`${label}\` | ${formatsCount(count)} |`);
  }
}

export function formatsScenarioConformanceReportMarkdown(report) {
  const { repository, index, disposition, generatedAtUtc, scenarioConformance, featureCoverage, subjectScope } = report;
  const { summary } = scenarioConformance;
  const featureSummary = featureCoverage.summary;
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
    `| **Scan ID** | ${index.scanId ?? "(unknown)"} |`,
    `| **Disposition** | \`${disposition}\` |`,
    "",
    "## Executive Summary",
    "",
    "This report keeps four independent questions separate: whether lineage is canonical or proposed,",
    "whether the declared structure is closed, whether execution was evaluated, and whether a proof",
    "passed. Static source evidence and live LLM inference calls can support discovery, but neither is",
    "a runtime execution receipt for a scenario.",
    "",
    "| Dimension | Count |",
    "|---|---:|",
    `| Canonical feature declarations | ${formatsCount(featureSummary.canonicalFeatures)} |`,
    `| Proposed features, not admitted | ${formatsCount(featureSummary.proposedFeatures)} |`,
    `| Canonical scenarios | ${formatsCount(featureSummary.canonicalScenarios)} |`,
    `| Proposed scenarios, not admitted | ${formatsCount(featureSummary.proposedScenarios)} |`,
    `| Canonical scenarios structurally closed | ${formatsCount(featureSummary.scenariosStructurallyClosed)} |`,
    `| Canonical scenarios structurally incomplete | ${formatsCount(featureSummary.scenariosStructurallyIncomplete)} |`,
    `| Canonical scenarios with structural status not evaluated | ${formatsCount(featureSummary.scenariosStructuralStatusNotEvaluated)} |`,
    `| Canonical scenarios with execution evaluated | ${formatsCount(featureSummary.scenariosExecutionEvaluated)} |`,
    `| Canonical scenarios with runtime conformance \`NOT_EVALUATED\` | ${formatsCount(featureSummary.scenariosRuntimeNotEvaluated)} |`,
    `| Canonical scenarios conformant by execution proof | ${formatsCount(featureSummary.fullyConformantScenarios)} |`,
    `| Canonical scenarios with lineage-quality findings | ${formatsCount(featureSummary.scenariosWithLineageQualityFindings)} |`,
    `| Mechanics with canonical scenario lineage | ${formatsCount(featureSummary.mechanicsWithCanonicalLineage)} |`,
    `| Mechanics with proposed scenario lineage | ${formatsCount(featureSummary.mechanicsWithProposedLineage)} |`,
    `| Mechanics with ambiguous scenario lineage | ${formatsCount(featureSummary.mechanicsWithAmbiguousLineage)} |`,
    `| Mechanics without scenario lineage | ${formatsCount(featureSummary.mechanicsWithoutLineage)} |`,
    `| Authority documents with canonical scenario lineage | ${formatsCount(featureSummary.authorityWithCanonicalLineage)} |`,
    `| Authority documents with proposed scenario lineage | ${formatsCount(featureSummary.authorityWithProposedLineage)} |`,
    `| Authority documents with ambiguous scenario lineage | ${formatsCount(featureSummary.authorityWithAmbiguousLineage)} |`,
    `| Authority documents without scenario lineage | ${formatsCount(featureSummary.authorityWithoutLineage)} |`,
    `| Unresolved responsibility-evidence clusters | ${formatsCount(featureSummary.unresolvedEvidenceClusters)} |`,
    `| Clusters confirmed as feature candidates | ${formatsCount(featureSummary.confirmedFeatureCandidateClusters)} |`,
    `| Live LLM inference evaluations | ${formatsCount(featureSummary.liveInferenceEvaluations)} |`,
    `| Optional capability relations proposed from evidence | ${formatsCount(featureSummary.capabilityRelationsProposed)} |`,
    `| Duplicate proposals prevented | ${formatsCount(featureSummary.duplicateProposalsPrevented)} |`,
  ];

  pushesCountBreakdown(lines, "Scenarios with structural blocker", summary.byStructuralBlocker);
  pushesCountBreakdown(lines, "Scenarios with evaluation limit", summary.byEvaluationLimit);
  pushesCountBreakdown(lines, "Scenarios with lineage-quality finding", summary.byLineageQualityFinding);

  lines.push("");
  lines.push("## Feature Coverage Proposals");
  lines.push("");
  if (featureCoverage.proposals.length === 0) {
    lines.push("No in-subject feature coverage proposals were discovered.");
    lines.push("");
  } else {
    lines.push("These are inferred candidates. They do not become canonical feature or scenario lineage until admitted into canonical authority.");
    lines.push("");
    lines.push("| Proposed feature | Evidence cluster | Scenarios | Responsibilities | Coverage posture | Duplicate check |");
    lines.push("|---|---|---:|---:|---|---|");
    for (const proposal of featureCoverage.proposals) {
      const mechanics = proposal.evidence.mechanics.length > 0 ? proposal.evidence.mechanics.join("/") : "unspecified";
      const cluster = `${proposal.evidence.symbols.length} symbols; ${proposal.matchedOccurrences} matching ${mechanics} mechanics`;
      lines.push(`| \`${proposal.featureId}\` — ${proposal.featureTitle} | ${cluster} | ${proposal.scenarios.length} | ${proposal.responsibilities.length} | \`${proposal.lifecycle === "ADMITTED" ? "FEATURE_COVERED" : "FEATURE_COVERAGE_PROPOSED"}\` | \`${proposal.duplicateDisposition}\` |`);
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
  lines.push("These are receipts from real model calls over deterministic query results. They test the inference target, but remain observational discovery evidence: they neither admit a feature nor execute a product scenario.");
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
    lines.push("These are bounded static-evidence clusters, not feature candidates. A function or module scope becomes eligible for feature inference only after a separate feature-shaping review establishes an actor, outcome, scenario boundary, responsibility, and obligation.");
    lines.push("");
    lines.push("| Evidence cluster | Cluster kind | Mechanics | Occurrences | Feature candidacy | Inference eligibility |");
    lines.push("|---|---|---|---:|---|---|");
    for (const cluster of featureCoverage.uncoveredClusters.slice(0, 30)) {
      lines.push(`| \`${cluster.modulePath}#${cluster.responsibility ?? "(module-scope)"}\` | \`${cluster.clusterKind}\` | ${cluster.mechanics.join(", ")} | ${cluster.occurrences} | \`${cluster.featureCandidateDisposition}\` | \`${cluster.inferenceEligibility}\` |`);
    }
    if (featureCoverage.uncoveredClusters.length > 30) lines.push(`| … |  | ${featureCoverage.uncoveredClusters.length - 30} additional cluster(s) in JSON |  |  |  |`);
    lines.push("");
  }

  lines.push("## Canonical Feature Drill-Down");
  lines.push("");
  if (summary.featuresDiscovered === 0) {
    lines.push("**No canonical feature lineage is declared for this report subject.** Static mechanics and inference proposals can be inventoried, but no canonical scenario structural or runtime verdict can be made.");
    lines.push("");
  } else {
    lines.push("| Feature | Source lineage classification | Scenarios | Responsibilities | Structurally closed | Runtime conformant | Lineage-quality findings |");
    lines.push("|---|---|---:|---:|---:|---:|---:|");
    for (const feature of scenarioConformance.features) {
      const scenarios = feature.scenarios;
      const responsibilities = scenarios.flatMap((scenario) => scenario.obligations).flatMap((obligation) => obligation.responsibilities);
      const structurallyClosed = scenarios.filter((scenario) => scenario.structuralStatus === "STRUCTURALLY_CLOSED").length;
      const conformant = scenarios.filter((scenario) => scenario.runtimeConformance === "CONFORMANT").length;
      const classifications = feature.classifications.length === 0 ? "none detected" : feature.classifications.map((classification) => `\`${classification.classificationId}\``).join(", ");
      lines.push(`| \`${feature.featureId}\` | ${classifications} | ${scenarios.length} | ${responsibilities.length} | ${structurallyClosed} | ${conformant} | ${feature.lineageQualityFindings.length} |`);
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
