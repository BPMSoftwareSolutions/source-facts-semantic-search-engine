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

export function formatsSelfGovernanceReportMarkdown(report) {
  const { executionMechanics, authoritySources, repository, index, disposition, generatedAtUtc } = report;
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
    "| Mechanic | Observed | Governed | Coverage |",
    "|---|---:|---:|---:|",
    ...executionMechanics.byMechanicType.map(
      (entry) => `| ${entry.mechanic} | ${formatsCount(entry.observed)} | ${formatsCount(entry.governed)} | ${formatsPercent(entry.governed, entry.observed)} |`,
    ),
    "",
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
  lines.push("## Notable Findings");
  lines.push("");
  if (danglingSources.length === 0 && observed > 0 && executionMechanics.governed === 0) {
    lines.push("- No admitted authority mechanic resolved against any observed occurrence. No governance findings beyond the coverage totals above.");
  } else if (danglingSources.length === 0) {
    lines.push("- No dangling authority sources detected.");
  } else {
    for (const source of danglingSources) {
      lines.push(
        `- **Dangling authority source:** \`${source.authorityFile}\` declares ${source.mechanicsAuthorityBound} \`AUTHORITY_BOUND\` mechanic(s) against \`${source.sourceFile ?? "(unspecified)"}\`, but none resolved against any observed occurrence in this scan. The declared source file most likely no longer exists at that path (renamed or moved), so its coverage cannot currently be verified.`,
      );
    }
  }

  lines.push("");
  lines.push("## Disposition");
  lines.push("");
  lines.push(`\`${disposition}\` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.`);
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function formatsSelfGovernanceReportSummary(report) {
  const { executionMechanics, authoritySources, repository, disposition, generatedAtUtc } = report;
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
    lines.push(`  ${padsColumn(entry.mechanic, mechanicWidth)}observed ${entry.observed}  governed ${entry.governed}`);
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
