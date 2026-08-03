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

/**
 * Answers "does this file already have data-driven capabilities wired in,"
 * independent of whether that wiring adds up to formal governance yet.
 * Direct (one-hop) import evidence only -- see resolves-data-driven-wiring.js.
 */
function formatsDataDrivenWiring(report) {
  const wired = report.dataDrivenWiring.filter((entry) => entry.wiringDisposition !== "NONE");
  const totalFiles = report.dataDrivenWiring.length;

  const lines = [
    "## Data-Driven Wiring",
    "",
    "A different question again: not \"is this occurrence governed\" or \"does an",
    "authority document claim this file,\" but \"does this file's own source code",
    "already import a JSON contract/authority artifact and/or invoke a semantic",
    "execution runtime.\" Detected directly from the scanner's import (`dependency`)",
    "relationships -- one hop only, not followed transitively through local helpers.",
    "",
    `${formatsCount(wired.length)} of ${formatsCount(totalFiles)} file(s) with observed mechanics have some direct wiring toward the contract/semantic layer.`,
    "",
  ];

  if (wired.length === 0) {
    lines.push("No file with observed mechanics directly imports a JSON contract or a semantic execution runtime.");
  } else {
    lines.push("| File | Wiring | Imports contract data | Invokes semantic runtime |");
    lines.push("|---|---|---|---|");
    for (const entry of wired) {
      const contractImports = entry.importsContractData.length > 0 ? entry.importsContractData.map((value) => `\`${value}\``).join(", ") : "—";
      const runtimeImports = entry.invokesSemanticRuntime.length > 0 ? entry.invokesSemanticRuntime.map((value) => `\`${value}\``).join(", ") : "—";
      lines.push(`| \`${entry.modulePath}\` | ${entry.wiringDisposition} | ${contractImports} | ${runtimeImports} |`);
    }
  }
  lines.push("");

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
  const { executionMechanics, authoritySources, otherAuthorityDocuments, dataDrivenWiring, repository, disposition, generatedAtUtc } = report;
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
  lines.push(`Data-driven wiring: ${wired.length} of ${dataDrivenWiring.length} file(s) with observed mechanics directly import a contract and/or semantic runtime`);
  for (const entry of wired) {
    lines.push(`  ${entry.modulePath} [${entry.wiringDisposition}]`);
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
