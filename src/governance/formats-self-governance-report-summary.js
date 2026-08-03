function padsColumn(value, width) {
  return String(value).padEnd(width, " ");
}

function formatsCount(value) {
  return value.toLocaleString("en-US");
}

function formatsPercent(numerator, denominator) {
  if (denominator === 0) return "n/a";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

/**
 * An authority source can declare AUTHORITY_BOUND mechanics whose sourceLocation
 * no longer resolves against any observed occurrence -- typically because the
 * declared source file was renamed after the authority was authored. That is a
 * silent governance gap: the authority record still claims coverage. Surface it
 * explicitly rather than let a 0-governed count pass without explanation.
 */
function findsDanglingAuthoritySources(report) {
  return report.authoritySources
    .map((source) => {
      const resolvedCount = report.occurrences.filter((occurrence) => occurrence.governingAuthorityFile === source.authorityFile).length;
      return { ...source, resolvedCount };
    })
    .filter((source) => source.mechanicsAuthorityBound > 0 && source.resolvedCount === 0);
}

const maxFilesShownPerMechanic = 5;

function formatsFileDrillDown(report) {
  const lines = [];
  const filesByMechanic = new Map();
  for (const entry of report.fileBreakdown) {
    const entries = filesByMechanic.get(entry.mechanic) ?? [];
    entries.push(entry);
    filesByMechanic.set(entry.mechanic, entries);
  }

  for (const mechanicEntry of report.executionMechanics.byMechanicType) {
    const files = filesByMechanic.get(mechanicEntry.mechanic) ?? [];
    if (files.length === 0) continue;

    lines.push(`### ${mechanicEntry.mechanic} (${mechanicEntry.authorityFamily} authority family)`);
    lines.push("");
    lines.push("| File | Occurrences | Governed | Home status | Responsibilities |");
    lines.push("|---|---:|---:|---|---|");
    for (const file of files.slice(0, maxFilesShownPerMechanic)) {
      const responsibilities = file.responsibilities.length > 0 ? file.responsibilities.slice(0, 3).join(", ") : "(module scope)";
      const homeStatusCell = file.homeStatus === "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE" && !file.authorityHomeVerified
        ? `${file.homeStatus} (unverified schema)`
        : file.homeStatus;
      lines.push(`| \`${file.modulePath}\` | ${file.occurrenceCount} | ${file.governedCount} | ${homeStatusCell} | ${responsibilities} |`);
    }
    if (files.length > maxFilesShownPerMechanic) {
      lines.push("");
      lines.push(`*${files.length - maxFilesShownPerMechanic} more file(s) for \`${mechanicEntry.mechanic}\` omitted; see \`fileBreakdown\` in the JSON report.*`);
    }
    lines.push("");
  }

  return lines;
}

const wiringDispositionLabels = Object.freeze({
  DIRECT_DATA_AND_RUNTIME: "Direct data and runtime",
  RUNTIME_ONLY: "Direct runtime only",
  DATA_ONLY: "Direct data only",
  TRANSITIVE_DATA_AND_RUNTIME: "Transitive data and runtime",
  TRANSITIVE_RUNTIME_ONLY: "Transitive runtime only",
  TRANSITIVE_DATA_ONLY: "Transitive data only",
  NOT_DETERMINED_BEYOND_MAX_DEPTH: "Not determined (beyond max depth)",
  NONE: "None determined",
});

/**
 * Answers "does this file already have data-driven capabilities wired in,"
 * independent of whether that wiring adds up to formal governance yet.
 * Direct = the file's own imports. Transitive = reached through one or more
 * local ("./" / "../") import hops from a local helper file. See
 * resolves-data-driven-wiring.js for the traversal rules (cycle-safe,
 * depth-capped, non-local specifiers never followed as hops).
 */
function formatsDataDrivenWiring(report) {
  const totalFiles = report.dataDrivenWiring.length;
  const byDisposition = new Map();
  for (const entry of report.dataDrivenWiring) {
    byDisposition.set(entry.wiringDisposition, (byDisposition.get(entry.wiringDisposition) ?? 0) + 1);
  }

  const lines = [
    "## Data-Driven Wiring",
    "",
    "A different question again: not \"is this occurrence governed\" or \"does an",
    "authority document claim this file,\" but \"does this file's own source code",
    "already import a JSON contract/authority artifact and/or invoke a semantic",
    "execution runtime\" -- directly, or transitively through a local helper file.",
    "Detected from the scanner's import (`dependency`) relationships.",
    "",
    "| Wiring posture | Files | Share |",
    "|---|---:|---:|",
    ...Object.keys(wiringDispositionLabels).map((disposition) => {
      const count = byDisposition.get(disposition) ?? 0;
      return `| ${wiringDispositionLabels[disposition]} | ${formatsCount(count)} | ${formatsPercent(count, totalFiles)} |`;
    }),
    "",
  ];

  const notable = report.dataDrivenWiring.filter((entry) => entry.wiringDisposition !== "NONE");
  if (notable.length === 0) {
    lines.push("No file with observed mechanics has any determined wiring toward the contract/semantic layer.");
  } else {
    lines.push("| File | Wiring | Direct evidence | Transitive evidence | Hops | Hop path |");
    lines.push("|---|---|---|---|---:|---|");
    for (const entry of notable) {
      const directEvidence = [...entry.importsContractData, ...entry.invokesSemanticRuntime];
      const transitiveEvidence = [...entry.transitiveContractPaths, ...entry.transitiveRuntimePaths];
      const directCell = directEvidence.length > 0 ? directEvidence.map((value) => `\`${value}\``).join(", ") : "—";
      const transitiveCell = transitiveEvidence.length > 0 ? transitiveEvidence.map((value) => `\`${value}\``).join(", ") : "—";
      const hopCell = entry.hopCount ?? (entry.wiringDisposition === "NOT_DETERMINED_BEYOND_MAX_DEPTH" ? "capped" : "—");
      const hopPathCell = entry.hopPath !== null ? entry.hopPath.map((value) => `\`${value}\``).join(" → ") : "—";
      lines.push(`| \`${entry.modulePath}\` | ${entry.wiringDisposition} | ${directCell} | ${transitiveCell} | ${hopCell} | ${hopPathCell} |`);
    }
  }
  lines.push("");

  return lines;
}

const mechanicReachabilityStatusLabels = Object.freeze({
  RESOLVED: "Resolved (exact path)",
  RESOLVED_BY_SUFFIX: "Resolved (matched by unique suffix)",
  MOVED_OR_REMOVED: "Moved or removed",
  AMBIGUOUS: "Ambiguous (multiple files match)",
  UNRESOLVABLE_LOCATION: "No usable sourceLocation",
});

const maxUnreachableArtifactsShown = 5;

/**
 * "How much declared meaning exists in this repo's contracts, and how much of
 * it is reachable from files that still exist." Not the same question as
 * governance coverage or wiring -- a document can carry real decisions,
 * semantic edges, and mechanics that were authored in good faith and then
 * orphaned when the file they described moved or was replaced.
 */
function formatsContractSemanticVolume(report) {
  const documents = report.contractSemanticVolume;
  const totals = documents.reduce((accumulator, entry) => {
    accumulator.total += entry.totalSemanticElements;
    accumulator.reachable += entry.reachableSemanticElements;
    accumulator.orphaned += entry.orphanedSemanticElements;
    accumulator.undetermined += entry.undeterminedSemanticElements;
    return accumulator;
  }, { total: 0, reachable: 0, orphaned: 0, undetermined: 0 });

  const lines = [
    "## Contract Semantic Volume",
    "",
    "A third question, distinct from coverage and wiring: how much declared",
    "meaning -- decisions, semantic edges, failure policies, projection",
    "mappings, result contracts, mechanics -- exists across every discovered",
    "authority-shaped document, and how much of it still points at a file that",
    "exists in the current scan versus one that moved, was renamed, or was",
    "removed. This is measured per-artifact or per-mechanic where the document",
    "shape allows it (exact), and left undetermined where it doesn't rather",
    "than guessed.",
    "",
    `${formatsCount(totals.total)} total semantic element(s) declared across ${formatsCount(documents.length)} document(s).`,
    "",
    "| | Elements | Share |",
    "|---|---:|---:|",
    `| Reachable | ${formatsCount(totals.reachable)} | ${formatsPercent(totals.reachable, totals.total)} |`,
    `| Orphaned (target moved or removed) | ${formatsCount(totals.orphaned)} | ${formatsPercent(totals.orphaned, totals.total)} |`,
    `| Undetermined | ${formatsCount(totals.undetermined)} | ${formatsPercent(totals.undetermined, totals.total)} |`,
    "",
  ];

  const withContent = documents.filter((entry) => entry.totalSemanticElements > 0);
  if (withContent.length === 0) {
    lines.push("No discovered document carries measurable semantic content.");
    lines.push("");
    return lines;
  }

  lines.push("| Document | Kind | Total | Reachable | Orphaned | Undetermined |");
  lines.push("|---|---|---:|---:|---:|---:|");
  for (const entry of withContent) {
    lines.push(`| \`${entry.authorityFile}\` | ${entry.documentKind} | ${entry.totalSemanticElements} | ${entry.reachableSemanticElements} | ${entry.orphanedSemanticElements} | ${entry.undeterminedSemanticElements} |`);
  }
  lines.push("");

  for (const entry of withContent) {
    if (entry.mechanicReachability !== null) {
      lines.push(`**${entry.authorityFile}** -- mechanic-location reachability (${entry.mechanicReachability.total} mechanic(s) declared):`);
      lines.push("");
      for (const [status, label] of Object.entries(mechanicReachabilityStatusLabels)) {
        const count = entry.mechanicReachability.byStatus[status];
        if (count > 0) lines.push(`- ${label}: ${count}`);
      }
      lines.push("");
    }
    if (entry.artifactReachability !== null) {
      const unreachableArtifacts = entry.artifactReachability
        .filter((artifact) => !artifact.reachable && artifact.semanticElementCount > 0)
        .sort((left, right) => right.semanticElementCount - left.semanticElementCount);
      if (unreachableArtifacts.length > 0) {
        lines.push(`**${entry.authorityFile}** -- orphaned artifacts (semantic content whose declared file no longer exists):`);
        lines.push("");
        lines.push("| Artifact | Declared path | Orphaned elements |");
        lines.push("|---|---|---:|");
        for (const artifact of unreachableArtifacts.slice(0, maxUnreachableArtifactsShown)) {
          lines.push(`| \`${artifact.artifactId ?? "(unnamed)"}\` | \`${artifact.relativePath ?? "(unspecified)"}\` | ${artifact.semanticElementCount} |`);
        }
        if (unreachableArtifacts.length > maxUnreachableArtifactsShown) {
          lines.push("");
          lines.push(`*${unreachableArtifacts.length - maxUnreachableArtifactsShown} more orphaned artifact(s) omitted; see \`contractSemanticVolume\` in the JSON report.*`);
        }
        lines.push("");
      }
    }
  }

  return lines;
}

const automationDispositionLabels = Object.freeze({
  ALREADY_GOVERNED: "Already governed",
  AUTOMATABLE_AFTER_REVIEW: "Automatable after review",
  REQUIRES_HUMAN_SEMANTIC_DECISION: "Requires human semantic decision",
  AUTOMATABLE_AFTER_AUTHORITY_COMPLETION: "Automatable after authority completion",
  REQUIRES_NEW_AUTHORITY: "Requires new authority",
  NOT_CURRENTLY_PROJECTABLE: "Not currently projectable",
  NOT_APPLICABLE: "Not applicable (mechanical/kernel/backlog)",
});

const maxAutomationCandidateGroupsShown = 10;

/**
 * A fourth question, narrower than coverage, home status, or wiring: for
 * every occurrence that isn't yet GOVERNED_BY_SEMANTIC_AUTHORITY, can
 * connecting it to authority be automated without new authoring, and if not,
 * exactly what connective tissue is missing? A reachable not-yet-admitted
 * candidate is necessary but not sufficient -- see classifiesAutomationReadiness
 * for why REQUIRES_HUMAN_SEMANTIC_DECISION and AUTOMATABLE_AFTER_REVIEW are
 * both "candidate found" outcomes with different implications.
 */
function formatsAutomationReadiness(report) {
  const observed = report.executionMechanics.observed;
  const byDisposition = report.automationReadiness.byDisposition;

  const lines = [
    "## Automation Readiness",
    "",
    "A fourth question, narrower than coverage or wiring: for every occurrence",
    "that isn't yet `GOVERNED_BY_SEMANTIC_AUTHORITY`, can connecting it to",
    "authority be automated without new authoring, and if not, exactly what is",
    "missing? Reachable candidate evidence is necessary but not sufficient -- a",
    "candidate can carry its own `coverageDisposition` (this repo's drafts only",
    "use `SEMANTIC_DECISION_REQUIRED` today) declaring that a human judgment",
    "call is still open even though the mechanical scaffolding (type, location,",
    "semantic shape) is already complete.",
    "",
    "| Automation posture | Occurrences | Share |",
    "|---|---:|---:|",
    ...Object.keys(automationDispositionLabels).map((disposition) => {
      const count = byDisposition[disposition] ?? 0;
      return `| ${automationDispositionLabels[disposition]} | ${formatsCount(count)} | ${formatsPercent(count, observed)} |`;
    }),
    "",
  ];

  const candidateBacked = report.occurrences.filter((occurrence) => occurrence.candidateAuthorityFile !== null);
  if (candidateBacked.length === 0) {
    lines.push("No ungoverned occurrence currently resolves to a reachable, not-yet-admitted candidate mechanic.");
    lines.push("");
    return lines;
  }

  const byFileMechanic = new Map();
  for (const occurrence of candidateBacked) {
    const key = `${occurrence.mechanic} ${occurrence.modulePath} ${occurrence.automationDisposition} ${occurrence.candidateAuthorityFile}`;
    const entry = byFileMechanic.get(key) ?? {
      mechanic: occurrence.mechanic,
      modulePath: occurrence.modulePath,
      automationDisposition: occurrence.automationDisposition,
      candidateAuthorityFile: occurrence.candidateAuthorityFile,
      count: 0,
    };
    entry.count += 1;
    byFileMechanic.set(key, entry);
  }

  const grouped = [...byFileMechanic.values()].sort((left, right) => right.count - left.count || left.modulePath.localeCompare(right.modulePath));
  lines.push("| Mechanic | File | Automation posture | Candidate authority | Occurrences |");
  lines.push("|---|---|---|---|---:|");
  for (const entry of grouped.slice(0, maxAutomationCandidateGroupsShown)) {
    lines.push(`| ${entry.mechanic} | \`${entry.modulePath}\` | ${automationDispositionLabels[entry.automationDisposition]} | \`${entry.candidateAuthorityFile}\` | ${entry.count} |`);
  }
  if (grouped.length > maxAutomationCandidateGroupsShown) {
    lines.push("");
    lines.push(`*${grouped.length - maxAutomationCandidateGroupsShown} more file/mechanic group(s) omitted; see \`occurrences\` in the JSON report.*`);
  }
  lines.push("");

  return lines;
}

const authoritySuccessionLabels = Object.freeze({
  AUTHORITY_SOURCE_STILL_CURRENT: "Source still current (no succession needed)",
  AUTHORITY_SOURCE_CURRENT_BUT_INCOMPLETE: "Source still current, but missing some declared mechanic types",
  AUTHORITY_SUCCESSOR_RESOLVED: "Successor resolved (all mechanic types present)",
  AUTHORITY_SUCCESSOR_PARTIAL: "Successor resolved (partial mechanic-type overlap)",
  AUTHORITY_SUCCESSOR_RESOLVED_NO_MECHANIC_OVERLAP: "Successor resolved (no mechanic-type overlap -- low confidence)",
  AUTHORITY_SUCCESSOR_AMBIGUOUS: "Successor ambiguous (chain forks)",
  AUTHORITY_SUCCESSOR_NOT_DETERMINED_BEYOND_MAX_DEPTH: "Successor not determined (beyond max hop depth)",
  AUTHORITY_HAS_NO_CURRENT_SUCCESSOR: "No current successor found",
});

/**
 * A fifth question, at the document level rather than the occurrence level:
 * when a declared sourceFile exists but no longer carries its declared
 * mechanic types (a re-export shim left behind by a runtime split), is
 * there a current file downstream in the local import graph that plausibly
 * inherited that meaning? See resolvesAuthoritySuccession for why this
 * claims only mechanic-TYPE presence, never a semantic verdict.
 */
function formatsAuthoritySuccession(report) {
  const entries = report.authoritySuccession;
  const lines = [
    "## Authority Succession",
    "",
    "A fifth question, at the document level: when a declared `sourceFile`",
    "exists but no longer carries its declared mechanic types -- a re-export",
    "shim left behind by a runtime split, e.g. `serves-query-console.mjs` ->",
    "`.runtime.mjs` -> `.runtime.impl.mjs` -- is there a current file",
    "downstream in the local import graph that plausibly inherited that",
    "meaning? This claims only mechanic-TYPE presence in a resolved",
    "successor, never a semantic verdict on whether the declared meaning",
    "itself still holds -- that remains a human review decision.",
    "",
  ];

  if (entries.length === 0) {
    lines.push("No discovered authority document declares both a `sourceFile` and a mechanics array.");
    lines.push("");
    return lines;
  }

  lines.push("| Authority file | Declared source | Succession | Successor file | Hops | Mechanics present |");
  lines.push("|---|---|---|---|---:|---:|");
  for (const entry of entries) {
    const successorCell = entry.successorFile !== null ? `\`${entry.successorFile}\`` : "—";
    const hopCell = entry.hopCount ?? "—";
    lines.push(`| \`${entry.authorityFile}\` | \`${entry.declaredSourceFile}\` | ${authoritySuccessionLabels[entry.succession]} | ${successorCell} | ${hopCell} | ${entry.mechanicsPresentInSuccessor}/${entry.mechanicsDeclared} |`);
  }
  lines.push("");

  const needsAttention = entries.filter((entry) => entry.recommendedAction !== "NONE_ALREADY_CURRENT");
  if (needsAttention.length > 0) {
    lines.push("Recommended next action:");
    lines.push("");
    for (const entry of needsAttention) {
      lines.push(`- \`${entry.authorityFile}\`: **${entry.recommendedAction}**`);
    }
    lines.push("");
  }

  return lines;
}

function formatsDispositionCounts(counts) {
  const entries = Object.entries(counts);
  if (entries.length === 0) return "(none)";
  return entries.map(([disposition, count]) => `${disposition}: ${count}`).join(", ");
}

/**
 * A sixth section, structurally different from every other one: everything
 * here originated outside this deterministic pipeline (a live model call,
 * reviewed by a human) and is discovered from reviews/ rather than computed.
 * It is never governance evidence -- lifecycle stays INFERRED_NOT_ADMITTED
 * (or whatever a review recorded) and nothing here feeds executionMechanics,
 * automationReadiness, or any other coverage number in this report.
 */
function formatsSemanticOverlapProposals(report) {
  const batches = report.semanticOverlapProposals;
  const lines = [
    "## Semantic Overlap Proposals",
    "",
    "A sixth source, gathered from outside the deterministic pipeline: agent-",
    "inferred, human-reviewed proposals for whether current code still embodies",
    "specific historical authority meaning. Discovered from `reviews/` (never",
    "`contracts/`, never scanned as authority). Every batch keeps its own",
    "lifecycle -- nothing here is admitted authority, and nothing here changes",
    "any coverage number elsewhere in this report.",
    "",
  ];

  if (batches.length === 0) {
    lines.push("No semantic-overlap proposal batches found under `reviews/`.");
    lines.push("");
    return lines;
  }

  for (const batch of batches) {
    lines.push(`### \`${batch.proposalFile}\``);
    lines.push("");
    lines.push(`- **Lifecycle:** \`${batch.lifecycle}\``);
    lines.push(`- **Subject:** \`${batch.historicalAuthorityFile ?? "(unspecified)"}\` -> \`${batch.resolvedSuccessorFile ?? "(unspecified)"}\``);
    lines.push(`- **Inferred by:** ${batch.inferenceModel ?? "(unspecified)"} at ${batch.inferredAtUtc ?? "(unspecified)"}`);
    lines.push(`- **Model proposed:** ${formatsCount(batch.totalProposed)} proposal(s) -- ${formatsDispositionCounts(batch.modelDispositionCounts)}`);
    lines.push(`- **After human review:** ${formatsDispositionCounts(batch.reviewedDispositionCounts)}`);
    lines.push("");
    if (batch.reviewFindings.length > 0) {
      lines.push("| Mechanic | Review verdict | Corrected disposition | Reason |");
      lines.push("|---|---|---|---|");
      for (const finding of batch.reviewFindings) {
        lines.push(`| \`${finding.authorityMechanicId ?? "(unspecified)"}\` | ${finding.reviewVerdict ?? "(unspecified)"} | ${finding.correctedDisposition ?? "—"} | ${finding.reason ?? ""} |`);
      }
      lines.push("");
    }

    const quality = batch.inferenceQuality;
    lines.push("**Inference quality** -- not a benchmark of the model; a benchmark of how efficiently this review converted candidate understanding into admitted knowledge:");
    lines.push("");
    lines.push("| Metric | Value |");
    lines.push("|---|---:|");
    lines.push(`| Proposals generated | ${formatsCount(quality.proposalsGenerated)} |`);
    lines.push(`| Approved unchanged | ${formatsCount(quality.reviewOutcomeCounts.APPROVED_UNCHANGED)} |`);
    lines.push(`| Approved with additional finding | ${formatsCount(quality.reviewOutcomeCounts.APPROVED_WITH_ADDITIONAL_FINDING)} |`);
    lines.push(`| Amended | ${formatsCount(quality.reviewOutcomeCounts.AMENDED)} |`);
    lines.push(`| Rejected | ${formatsCount(quality.reviewOutcomeCounts.REJECTED)} |`);
    if (quality.unrecordedOutcomes > 0) {
      lines.push(`| Unrecorded (no review outcome logged) | ${formatsCount(quality.unrecordedOutcomes)} |`);
    }
    lines.push(`| Model confidence (average) | ${quality.modelConfidenceAverage === null ? "n/a" : quality.modelConfidenceAverage.toFixed(2)} |`);
    lines.push(`| Confidence after review (average) | ${quality.reviewedConfidenceAverage === null ? "n/a" : quality.reviewedConfidenceAverage.toFixed(2)} |`);
    lines.push(`| New deterministic findings from review | ${formatsCount(quality.newDeterministicFindingsFromReview)} |`);
    lines.push(`| Know-how extracted | ${formatsCount(quality.knowHowExtracted.length)} |`);
    lines.push(`| Candidate authorities identified | ${formatsCount(quality.candidateAuthorities.length)} |`);
    lines.push("");

    if (quality.knowHowExtracted.length > 0) {
      lines.push("Know-how extracted:");
      lines.push("");
      for (const item of quality.knowHowExtracted) {
        lines.push(`- **[${item.kind}, ${item.generalizability}]** ${item.statement}`);
      }
      lines.push("");
    }

    if (quality.candidateAuthorities.length > 0) {
      lines.push("Candidate authorities identified:");
      lines.push("");
      for (const candidate of quality.candidateAuthorities) {
        lines.push(`- **${candidate.candidateAuthorityId ?? "(unnamed)"}** (${candidate.family ?? "unclassified"}) -- ${candidate.rationale ?? ""}`);
      }
      lines.push("");
    }
  }

  return lines;
}

/**
 * A seventh section, downstream of Semantic Overlap Proposals: what has
 * actually been admitted, versus what is still merely proposed. know-how/ is
 * a separate directory from reviews/ on purpose -- everything here already
 * passed human review and was deliberately kept, but an authority-remediation
 * candidate is still explicitly not authority (CANDIDATE_NOT_AUTHORED) even
 * though its know-how lineage has been admitted.
 */
function formatsKnowHowRegistry(report) {
  const registry = report.knowHowRegistry;
  const lines = [
    "## Know-How Registry",
    "",
    "What review has actually admitted, downstream of Semantic Overlap",
    "Proposals. Discovered from `know-how/` (distinct from `reviews/`, which",
    "holds proposals no human has acted on yet). An authority-remediation",
    "candidate here is still explicitly not authority -- lifecycle stays",
    "`CANDIDATE_NOT_AUTHORED` until a human writes and admits the real",
    "authority document.",
    "",
  ];

  if (registry.admittedKnowHowCount === 0 && registry.authorityRemediationCandidateCount === 0) {
    lines.push("No admitted know-how or authority-remediation candidates found under `know-how/`.");
    lines.push("");
    return lines;
  }

  lines.push(`${formatsCount(registry.admittedKnowHowCount)} admitted know-how record(s), ${formatsCount(registry.authorityRemediationCandidateCount)} authority-remediation candidate(s).`);
  lines.push("");
  if (Object.keys(registry.byKind).length > 0) {
    lines.push(`By kind: ${Object.entries(registry.byKind).map(([kind, count]) => `${kind} (${count})`).join(", ")}`);
  }
  if (Object.keys(registry.byGeneralizability).length > 0) {
    lines.push(`By generalizability: ${Object.entries(registry.byGeneralizability).map(([scope, count]) => `${scope} (${count})`).join(", ")}`);
  }
  lines.push("");

  if (registry.knowHowRecords.length > 0) {
    lines.push("| Know-how ID | Kind | Generalizability | Statement |");
    lines.push("|---|---|---|---|");
    for (const record of registry.knowHowRecords) {
      lines.push(`| \`${record.knowHowId ?? "(unnamed)"}\` | ${record.kind} | ${record.generalizability} | ${record.statement} |`);
    }
    lines.push("");
  }

  if (registry.authorityRemediationCandidates.length > 0) {
    lines.push("| Candidate authority | Lifecycle | Family | Cites know-how | Rationale |");
    lines.push("|---|---|---|---|---|");
    for (const candidate of registry.authorityRemediationCandidates) {
      lines.push(`| \`${candidate.candidateAuthorityId ?? "(unnamed)"}\` | \`${candidate.lifecycle}\` | ${candidate.family ?? "unclassified"} | ${candidate.citesKnowHow.map((id) => `\`${id}\``).join(", ") || "—"} | ${candidate.rationale} |`);
    }
    lines.push("");
  }

  return lines;
}

export function formatsSelfGovernanceReportMarkdown(report) {
  const { executionMechanics, authoritySources, otherAuthorityDocuments, repository, index, disposition, generatedAtUtc } = report;
  const observed = executionMechanics.observed;
  const danglingSources = findsDanglingAuthoritySources(report);

  const lines = [
    "# Source Facts Self-Governance Report",
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
    "SourceFacts indexed its own source tree and classified every observed executable",
    "mechanic against admitted (`AUTHORITY_BOUND`) semantic authority. This report is",
    "**observational**: no build gate, backlog baseline, or regression policy is wired",
    "to it yet, so nothing here blocks a build.",
    "",
    "| Metric | Count | Share of observed |",
    "|---|---:|---:|",
    `| Execution mechanics observed | ${formatsCount(observed)} | 100.0% |`,
    `| Governed by semantic authority | ${formatsCount(executionMechanics.governed)} | ${formatsPercent(executionMechanics.governed, observed)} |`,
    `| Unknown classification | ${formatsCount(executionMechanics.byPosture.UNKNOWN_CLASSIFICATION)} | ${formatsPercent(executionMechanics.byPosture.UNKNOWN_CLASSIFICATION, observed)} |`,
    `| Authorized temporary backlog | ${formatsCount(executionMechanics.byPosture.AUTHORIZED_TEMPORARY_BACKLOG)} | ${formatsPercent(executionMechanics.byPosture.AUTHORIZED_TEMPORARY_BACKLOG, observed)} |`,
    `| Unauthorized executable meaning | ${formatsCount(executionMechanics.byPosture.UNAUTHORIZED_EXECUTABLE_MEANING)} | ${formatsPercent(executionMechanics.byPosture.UNAUTHORIZED_EXECUTABLE_MEANING, observed)} |`,
    `| Mechanical adapter operation | ${formatsCount(executionMechanics.byPosture.MECHANICAL_ADAPTER_OPERATION)} | ${formatsPercent(executionMechanics.byPosture.MECHANICAL_ADAPTER_OPERATION, observed)} |`,
    `| Kernel primitive | ${formatsCount(executionMechanics.byPosture.KERNEL_PRIMITIVE)} | ${formatsPercent(executionMechanics.byPosture.KERNEL_PRIMITIVE, observed)} |`,
    "",
    "## Coverage by Mechanic Type",
    "",
    "Home status answers a different question than coverage: coverage is whether an",
    "occurrence resolves to an admitted authority mechanic; home status is whether an",
    "authority *file* claiming that mechanic's file exists at all, even incompletely.",
    "",
    "| Mechanic | Authority family | Observed | Files | Governed | Home exists | Home incomplete | Home missing | Coverage |",
    "|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ...executionMechanics.byMechanicType.map((entry) => [
      "|", entry.mechanic,
      "|", entry.authorityFamily,
      "|", formatsCount(entry.observed),
      "|", formatsCount(entry.files),
      "|", formatsCount(entry.governed),
      "|", formatsCount(entry.byHomeStatus.AUTHORITY_HOME_EXISTS),
      "|", formatsCount(entry.byHomeStatus.AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE),
      "|", formatsCount(entry.byHomeStatus.AUTHORITY_HOME_MISSING),
      "|", formatsPercent(entry.governed, entry.observed), "|",
    ].join(" ")),
    "",
    "## File Drill-Down",
    "",
    "Top files per mechanic type by occurrence count. Full per-file detail for every",
    "mechanic/file pair is in `fileBreakdown` in the JSON report.",
    "",
    ...formatsFileDrillDown(report),
    ...formatsDataDrivenWiring(report),
    ...formatsContractSemanticVolume(report),
    ...formatsAuthoritySuccession(report),
    ...formatsSemanticOverlapProposals(report),
    ...formatsKnowHowRegistry(report),
    ...formatsAutomationReadiness(report),
    "## Authority Sources",
    "",
  ];

  if (authoritySources.length === 0) {
    lines.push("No admitted authority documents (`authority-declaration.v1`) were discovered under the scanned authority directory.");
  } else {
    lines.push("| Authority file | Declares governance for | Mechanics declared | Authority-bound | Resolved against observed code |");
    lines.push("|---|---|---:|---:|---:|");
    for (const source of authoritySources) {
      const resolvedCount = report.occurrences.filter((occurrence) => occurrence.governingAuthorityFile === source.authorityFile).length;
      const resolvedCell = source.mechanicsAuthorityBound > 0 && resolvedCount === 0
        ? "0 ⚠️"
        : String(resolvedCount);
      lines.push(`| \`${source.authorityFile}\` | \`${source.sourceFile ?? "(unspecified)"}\` | ${source.mechanicsDeclared} | ${source.mechanicsAuthorityBound} | ${resolvedCell} |`);
    }
  }

  lines.push("");
  lines.push("## Other Authority Documents");
  lines.push("");
  lines.push("Authority-shaped JSON documents this report found but cannot verify mechanic-by-");
  lines.push("mechanic, because they use a different convention than `authority-declaration.v1`");
  lines.push("(a bundle, a full governed-artifact contract, a projection ledger, ...). They still");
  lines.push("count toward `AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE` for any file they claim, rather");
  lines.push("than being silently ignored.");
  lines.push("");
  if (otherAuthorityDocuments.length === 0) {
    lines.push("None found.");
  } else {
    lines.push("| Document | Kind | Claimed files |");
    lines.push("|---|---|---|");
    for (const other of otherAuthorityDocuments) {
      const claimedFiles = other.claimedFiles.length > 0
        ? other.claimedFiles.map((file) => `\`${file}\``).join(", ")
        : "(not determinable from this document alone)";
      lines.push(`| \`${other.authorityFile}\` | ${other.documentKind} | ${claimedFiles} |`);
    }
  }

  const ambiguousFiles = report.fileBreakdown.filter((entry) => entry.homeStatus === "AUTHORITY_HOME_AMBIGUOUS");
  const missingHomeFileCount = new Set(
    report.fileBreakdown.filter((entry) => entry.homeStatus === "AUTHORITY_HOME_MISSING").map((entry) => entry.modulePath),
  ).size;

  lines.push("");
  lines.push("## Notable Findings");
  lines.push("");
  const findings = [];
  for (const source of danglingSources) {
    findings.push(
      `**Dangling authority source:** \`${source.authorityFile}\` declares ${source.mechanicsAuthorityBound} \`AUTHORITY_BOUND\` mechanic(s) against \`${source.sourceFile ?? "(unspecified)"}\`, but none resolved against any observed occurrence in this scan. The declared source file most likely no longer exists at that path (renamed or moved), so its coverage cannot currently be verified.`,
    );
  }
  for (const entry of ambiguousFiles) {
    findings.push(
      `**Ambiguous authority home:** \`${entry.modulePath}\` (${entry.mechanic}) is claimed by more than one authority document as its \`sourceFile\`. Only one is being used for resolution; this needs an authoring decision, not an automatic pick.`,
    );
  }
  if (missingHomeFileCount > 0) {
    findings.push(
      `**${missingHomeFileCount} distinct file(s)** contain at least one mechanic with no authority document claiming them at all (\`AUTHORITY_HOME_MISSING\`). See File Drill-Down above and \`fileBreakdown\` in the JSON report for the full list.`,
    );
  }
  if (findings.length === 0) {
    lines.push("- No dangling, ambiguous, or missing authority-home findings.");
  } else {
    for (const finding of findings) lines.push(`- ${finding}`);
  }

  lines.push("");
  lines.push("## Disposition");
  lines.push("");
  lines.push(`\`${disposition}\` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.`);
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function formatsSelfGovernanceReportSummary(report) {
  const { executionMechanics, authoritySources, otherAuthorityDocuments, dataDrivenWiring, contractSemanticVolume, authoritySuccession, semanticOverlapProposals, knowHowRegistry, automationReadiness, repository, disposition, generatedAtUtc } = report;
  const lines = [
    "Source Facts Self-Governance Report",
    `Generated: ${generatedAtUtc}`,
    `Repository: ${repository.repositoryId}`,
    `Workspace: ${repository.workspaceRoot ?? "(unknown)"}`,
    "",
    `Execution mechanics observed:      ${executionMechanics.observed}`,
    `Governed by semantic authority:    ${executionMechanics.governed} (${formatsPercent(executionMechanics.governed, executionMechanics.observed)})`,
    `Unknown classification:            ${executionMechanics.byPosture.UNKNOWN_CLASSIFICATION}`,
    "",
    "By mechanic type:",
  ];

  const mechanicWidth = Math.max(8, ...executionMechanics.byMechanicType.map((entry) => entry.mechanic.length)) + 2;
  for (const entry of executionMechanics.byMechanicType) {
    lines.push(
      `  ${padsColumn(entry.mechanic, mechanicWidth)}observed ${entry.observed}  files ${entry.files}  governed ${entry.governed}  `
      + `home[exists ${entry.byHomeStatus.AUTHORITY_HOME_EXISTS} incomplete ${entry.byHomeStatus.AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE} missing ${entry.byHomeStatus.AUTHORITY_HOME_MISSING}]`,
    );
  }

  lines.push("");
  lines.push("Authority sources:");
  if (authoritySources.length === 0) {
    lines.push("  (none discovered)");
  } else {
    for (const source of authoritySources) {
      lines.push(`  ${source.authorityFile} -> ${source.sourceFile ?? "(unspecified)"} (${source.mechanicsAuthorityBound}/${source.mechanicsDeclared} bound)`);
    }
  }

  lines.push("");
  lines.push(`Other authority-shaped documents found (unverified schemas): ${otherAuthorityDocuments.length}`);
  for (const other of otherAuthorityDocuments) {
    lines.push(`  ${other.authorityFile} (${other.documentKind}) -> ${other.claimedFiles.length > 0 ? other.claimedFiles.join(", ") : "(no claimed files determinable)"}`);
  }

  const wired = dataDrivenWiring.filter((entry) => entry.wiringDisposition !== "NONE");
  lines.push("");
  lines.push(`Data-driven wiring: ${wired.length} of ${dataDrivenWiring.length} file(s) with observed mechanics have determined wiring (direct or transitive)`);
  for (const entry of wired) {
    const hopSuffix = entry.hopPath !== null ? ` via ${entry.hopPath.slice(1).join(" -> ")}` : "";
    lines.push(`  ${entry.modulePath} [${entry.wiringDisposition}]${hopSuffix}`);
  }

  const semanticTotals = contractSemanticVolume.reduce((accumulator, entry) => {
    accumulator.total += entry.totalSemanticElements;
    accumulator.reachable += entry.reachableSemanticElements;
    accumulator.orphaned += entry.orphanedSemanticElements;
    return accumulator;
  }, { total: 0, reachable: 0, orphaned: 0 });
  lines.push("");
  lines.push(`Contract semantic volume: ${semanticTotals.total} element(s) declared across ${contractSemanticVolume.length} document(s) -- ${semanticTotals.reachable} reachable, ${semanticTotals.orphaned} orphaned`);

  const needsSuccessionAttention = authoritySuccession.filter((entry) => entry.recommendedAction !== "NONE_ALREADY_CURRENT");
  lines.push("");
  lines.push(`Authority succession: ${authoritySuccession.length} document(s) checked, ${needsSuccessionAttention.length} need attention`);
  for (const entry of needsSuccessionAttention) {
    lines.push(`  ${entry.authorityFile} [${entry.succession}] -> ${entry.successorFile ?? "(none)"} :: ${entry.recommendedAction}`);
  }

  lines.push("");
  lines.push(`Semantic overlap proposals (inferred, reviewed -- not authority): ${semanticOverlapProposals.length} batch(es) found under reviews/`);
  for (const batch of semanticOverlapProposals) {
    lines.push(`  ${batch.proposalFile} [${batch.lifecycle}] ${batch.historicalAuthorityFile ?? "(unspecified)"} -> ${batch.resolvedSuccessorFile ?? "(unspecified)"}`);
    lines.push(`    model: ${formatsDispositionCounts(batch.modelDispositionCounts)}`);
    lines.push(`    after review: ${formatsDispositionCounts(batch.reviewedDispositionCounts)}`);
    const quality = batch.inferenceQuality;
    lines.push(
      `    inference quality: ${quality.reviewOutcomeCounts.APPROVED_UNCHANGED} unchanged, `
      + `${quality.reviewOutcomeCounts.APPROVED_WITH_ADDITIONAL_FINDING} approved+finding, `
      + `${quality.reviewOutcomeCounts.AMENDED} amended, ${quality.reviewOutcomeCounts.REJECTED} rejected -- `
      + `confidence ${quality.modelConfidenceAverage?.toFixed(2) ?? "n/a"} -> ${quality.reviewedConfidenceAverage?.toFixed(2) ?? "n/a"}, `
      + `${quality.knowHowExtracted.length} know-how item(s), ${quality.candidateAuthorities.length} candidate authority(ies)`,
    );
  }

  lines.push("");
  lines.push(`Know-how registry: ${knowHowRegistry.admittedKnowHowCount} admitted know-how record(s), ${knowHowRegistry.authorityRemediationCandidateCount} authority-remediation candidate(s)`);
  for (const record of knowHowRegistry.knowHowRecords) {
    lines.push(`  [${record.kind}/${record.generalizability}] ${record.knowHowId}`);
  }
  for (const candidate of knowHowRegistry.authorityRemediationCandidates) {
    lines.push(`  candidate authority: ${candidate.candidateAuthorityId} [${candidate.lifecycle}] (${candidate.family ?? "unclassified"})`);
  }

  lines.push("");
  lines.push("Automation readiness:");
  for (const [disposition_, count] of Object.entries(automationReadiness.byDisposition)) {
    lines.push(`  ${disposition_}: ${count} (${formatsPercent(count, executionMechanics.observed)})`);
  }

  const dangling = findsDanglingAuthoritySources(report);
  if (dangling.length > 0) {
    lines.push("");
    lines.push("Notable: authority-bound mechanics did not resolve against any observed occurrence for:");
    for (const source of dangling) {
      lines.push(`  ${source.authorityFile} (declared source file: ${source.sourceFile ?? "(unspecified)"})`);
    }
  }

  lines.push("");
  lines.push(`Disposition: ${disposition} (no build gate wired yet)`);

  return `${lines.join("\n")}\n`;
}
