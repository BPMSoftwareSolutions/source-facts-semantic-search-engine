function padsColumn(value, width) {
  return String(value).padEnd(width, " ");
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
    `Governed by semantic authority:    ${executionMechanics.governed}`,
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

  lines.push("");
  lines.push(`Disposition: ${disposition} (no build gate wired yet)`);

  return `${lines.join("\n")}\n`;
}
