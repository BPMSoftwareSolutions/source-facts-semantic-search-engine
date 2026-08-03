#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultCandidatesPath = path.join(repositoryRoot, "contracts", "serves-query-console.candidates.json");
const defaultContractPath = path.join(repositoryRoot, "contracts", "serves-query-console.governed.contract.json");
const defaultWorkspaceRoot = path.join(repositoryRoot, "src", "console");
const defaultOutputPath = path.join(repositoryRoot, "docs", "console-candidates-detailed-report.md");
const defaultContextLines = 4;
const engineModulePath = path.resolve(repositoryRoot, "..", "contract-driven-artifact-governance-engine", "lib", "governed-artifact-engine.mjs");

const TYPE_META = {
  "decision-authority-candidate.v1": {
    title: "Branch → Decision Authority Candidate",
    transition: "Decision tables, predicate data, and AST-backed branch conditions",
    audit: "These mechanics still need condition semantics, outcome semantics, and no-match policy to be described as data instead of control flow.",
  },
  "failure-disposition-authority-candidate.v1": {
    title: "Throw → Failure Disposition Candidate",
    transition: "Error ontology, failure-policy data, and canonical rejection semantics",
    audit: "These mechanics need the error identity, precondition, and fallback-vs-canonical disposition to move out of executable throw sites.",
  },
  "projection-mapping-candidate.v1": {
    title: "Object Construction → Projection Mapping Candidate",
    transition: "AST object-shape data, field mapping declarations, and schema projections",
    audit: "These mechanics are still constructing output objects in code; the field-by-field projection should become declarative mapping data.",
  },
  "iteration-authority-candidate.v1": {
    title: "Iteration → Iteration Authority Candidate",
    transition: "Iteration policy, collection order data, and explicit continuation/termination rules",
    audit: "This mechanic should be a data-driven iteration contract instead of a hard-coded loop body.",
  },
  "state-transition-authority-candidate.v1": {
    title: "State Mutation → State Transition Candidate",
    transition: "Effect data, state-transition declarations, and proof requirements",
    audit: "These mechanics still mutate state directly and need effect declarations that can be audited independently of the code path.",
  },
  "serialization-profile-candidate.v1": {
    title: "Serialization → Serialization Profile Candidate",
    transition: "Canonical byte rules, encoding policy, and stable serialization profiles",
    audit: "These mechanics should be described as serialization data so byte-for-byte output is reproducible and reviewable.",
  },
  "validation-policy-candidate.v1": {
    title: "Validation → Validation Policy Candidate",
    transition: "Validation schema data and explicit failure-policy declarations",
    audit: "These mechanics still encode validation decisions in code and should move into policy data plus declared failure handling.",
  },
  "failure-observation-candidate.v1": {
    title: "Exception Handling → Failure Observation Candidate",
    transition: "Catch semantics, error-classification data, and observation policy",
    audit: "These mechanics should describe which failures are observed and which are rethrown as data, not as nested try/catch logic.",
  },
  "fallback-policy-candidate.v1": {
    title: "Fallback → Fallback Policy Candidate",
    transition: "Missing-value policy, default-value data, and canonical fallback rules",
    audit: "These mechanics still embed default selection behavior in code and should become explicit fallback data.",
  },
  "normalization-authority-candidate.v1": {
    title: "Normalization → Normalization Candidate",
    transition: "Translation ontology, canonical forms, and lossiness policy",
    audit: "These mechanics need their source variants and canonical target to be declared as transformation data.",
  },
};

const ORDERED_TYPES = [
  "decision-authority-candidate.v1",
  "failure-disposition-authority-candidate.v1",
  "projection-mapping-candidate.v1",
  "iteration-authority-candidate.v1",
  "state-transition-authority-candidate.v1",
  "serialization-profile-candidate.v1",
  "validation-policy-candidate.v1",
  "failure-observation-candidate.v1",
  "fallback-policy-candidate.v1",
  "normalization-authority-candidate.v1",
];


const { proveGovernedArtifactFamily } = await import(pathToFileURL(engineModulePath).href);

const options = parseArguments(process.argv.slice(2));
const candidatesPath = path.resolve(options.candidates ?? defaultCandidatesPath);
const contractPath = path.resolve(options.contract ?? defaultContractPath);
const workspaceRoot = path.resolve(options.workspace ?? defaultWorkspaceRoot);
const reportPath = path.resolve(options.output ?? defaultOutputPath);
const contextLines = Number.isInteger(options.contextLines) && options.contextLines > 0 ? options.contextLines : defaultContextLines;

const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));
const engineResult = proveGovernedArtifactFamily({
  contractPath,
  workspacePath: workspaceRoot,
  writeReceipt: false,
});

const report = buildReport({
  candidatesData,
  engineResult,
  workspaceRoot,
  contextLines,
});

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");

process.stdout.write(`${reportPath}\n`);
process.stdout.write(
  [
    `Candidates summarized: ${candidatesData.candidates.length}`,
    `Binding suggestions requiring authority: ${candidatesData.bindingSuggestions.filter((suggestion) => suggestion.authorityMechanicId === null).length}`,
    `Engine findings: ${engineResult.findings?.length ?? 0}`,
  ].join("\n") + "\n",
);

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--candidates" || argument === "--contract" || argument === "--workspace" || argument === "--output" || argument === "--context-lines") {
      if (value === undefined) {
        throw new Error(`Missing value for ${argument}`);
      }
      index += 1;
      if (argument === "--candidates") {
        options.candidates = value;
      } else if (argument === "--contract") {
        options.contract = value;
      } else if (argument === "--workspace") {
        options.workspace = value;
      } else if (argument === "--output") {
        options.output = value;
      } else if (argument === "--context-lines") {
        options.contextLines = Number.parseInt(value, 10);
      }
    } else if (argument === "--help" || argument === "-h") {
      printUsageAndExit();
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function printUsageAndExit() {
  process.stdout.write([
    "Usage:",
    "  node scripts/generate-console-authority-candidates-detailed-report.mjs [--candidates <path>] [--contract <path>] [--workspace <path>] [--output <path>] [--context-lines <n>]",
  ].join("\n") + "\n");
  process.exit(0);
}

function buildReport({ candidatesData, engineResult, workspaceRoot, contextLines }) {
  const groupedCandidates = groupCandidatesByType(candidatesData.candidates);
  const unresolvedBindings = candidatesData.bindingSuggestions.filter((suggestion) => suggestion.authorityMechanicId === null);
  const engineSummary = summarizeEngineFindings(engineResult);
  const now = new Date().toISOString();

  const lines = [];
  lines.push(`# Authority Candidate Detailed Report: serves-query-console`);
  lines.push("");
  lines.push(`**Generated:** ${now}`);
  lines.push(`**${sourceFilesLabel(candidatesData)}:** ${renderSourceFiles(candidatesData)}`);
  lines.push(`**Workspace:** \`${workspaceRoot}\``);
  lines.push(`**Violations detected:** ${candidatesData.generatedFromViolations?.violationCount ?? candidatesData.violations?.length ?? 0}`);
  lines.push(`**Candidates projected:** ${candidatesData.candidates.length}`);
  lines.push(`**Bindings mapped to known authority:** ${candidatesData.coverageSummary?.violationsMappedToAuthority ?? 0}`);
  lines.push(`**Bindings still requiring authority:** ${unresolvedBindings.length}`);
  lines.push(`**Engine findings:** ${engineSummary.totalFindings}`);
  lines.push("");
  lines.push("## Executive Summary");
  lines.push("");
  lines.push("The query tool now classifies real mechanic families instead of `unknown`, which makes the authority candidate report usable for semantic migration. The remaining work is concentrated in projection mappings, fallback/default policies, state transitions, serialization, and a small set of unresolved throw/validation cases.");
  lines.push("");
  lines.push("## Data Transition Map");
  lines.push("");
  lines.push("| Candidate Type | Mechanics Observed | Data Transition Needed |");
  lines.push("| --- | --- | --- |");
  for (const type of ORDERED_TYPES) {
    const meta = TYPE_META[type];
    const group = groupedCandidates.get(type) ?? [];
    if (group.length === 0) continue;
    lines.push(`| \`${type}\` | ${group.length} | ${meta.transition} |`);
  }
  lines.push("");
  lines.push("## Candidate Families");
  lines.push("");

  for (const type of ORDERED_TYPES) {
    const meta = TYPE_META[type];
    const group = groupedCandidates.get(type) ?? [];
    if (group.length === 0) continue;
    const representative = group[0];
    const uniquePrompts = uniqueRequiredPrompts(group);
    const sourceFiles = [...new Set(group.map((candidate) => candidate.source?.modulePath).filter(Boolean))].sort();

    lines.push(`### ${meta.title}`);
    lines.push("");
    lines.push(`**Count:** ${group.length}`);
    lines.push(`**Unique source files:** ${sourceFiles.length > 0 ? sourceFiles.join(", ") : "n/a"}`);
    lines.push(`**Data transition:** ${meta.transition}`);
    lines.push(`**Representative source:** \`${representative.source?.modulePath ?? "unknown"}:${representative.source?.startLine ?? "?"}\``);
    lines.push("");
    lines.push("**Observed code:**");
    lines.push("");
    lines.push("```text");
    lines.push(renderSnippet(workspaceRoot, representative.source?.modulePath, representative.source?.startLine, contextLines));
    lines.push("```");
    lines.push("");
    lines.push("**Projected candidate:**");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(representative, null, 2));
    lines.push("```");
    lines.push("");
    lines.push("**Unresolved prompts:**");
    for (const prompt of uniquePrompts.slice(0, 10)) {
      lines.push(`- ${prompt}`);
    }
    if (uniquePrompts.length > 10) {
      lines.push(`- ... ${uniquePrompts.length - 10} more`);
    }
    lines.push("");
    lines.push("**Why this still needs data:**");
    lines.push(meta.audit);
    lines.push("");
  }

  lines.push("## Unresolved Binding Audit");
  lines.push("");
  lines.push(`The following mechanics still need authority binding after projection (${unresolvedBindings.length} unresolved mappings):`);
  lines.push("");
  lines.push("| Violation | Mechanic | Source Location | Why it is unresolved |");
  lines.push("| --- | --- | --- | --- |");
  for (const item of unresolvedBindings) {
    lines.push(`| \`${item.violationId}\` | \`${item.mechanicType}\` | \`${item.sourceLocation}\` | ${item.reason} |`);
  }
  lines.push("");

  lines.push("## Engine Audit");
  lines.push("");
  lines.push("| Artifact | Findings | Audit note |");
  lines.push("| --- | --- | --- |");
  for (const artifact of engineSummary.artifacts) {
    lines.push(`| \`${artifact.artifactId}\` | ${artifact.findingIds.map((findingId) => `\`${findingId}\``).join(", ")} | ${artifact.note} |`);
  }
  lines.push("");

  lines.push("### Content Digest Mismatch");
  lines.push("");
  lines.push("| Artifact | Expected | Observed |");
  lines.push("| --- | --- | --- |");
  for (const digest of engineSummary.digestMismatches) {
    lines.push(`| \`${digest.artifactId}\` | \`${digest.expected}\` | \`${digest.observed}\` |`);
  }
  lines.push("");

  lines.push("### Transition Notes");
  lines.push("");
  lines.push("The governed-artifacts engine is still rejecting the projected artifacts because the code bodies are not yet fully data-driven. The audit surface splits into two groups:");
  lines.push("");
  lines.push("| Group | What remains executable | What should become data |");
  lines.push("| --- | --- | --- |");
  lines.push("| Helper bundle | route maps, header policy, error serialization, fallback/default logic, snippet iteration | authority JSON for decisions, projections, iteration bounds, and failure policies |");
  lines.push("| Thin adapters | import/execute wrappers still carrying boundary mechanics | sealed semantic invocation contracts and imported bundle data |");
  lines.push("| Console entrypoints | route fallback and response shaping still contain branches, exceptions, and object construction | AST-backed projection mappings and explicit result contracts |");
  lines.push("");

  lines.push("## Next Steps");
  lines.push("");
  lines.push("1. Move the remaining throw/validation mechanics in `serves-query-console*.mjs` into explicit validation and failure-policy data.");
  lines.push("2. Promote the helper bundle policies to declared projection mappings and result contracts.");
  lines.push("3. Reproject the governed contract, then rerun the trust gate until digest and semantic-edge findings disappear.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function groupCandidatesByType(candidates) {
  const grouped = new Map();
  for (const candidate of candidates) {
    const type = candidate.authorityCandidateType ?? "unknown";
    const list = grouped.get(type) ?? [];
    list.push(candidate);
    grouped.set(type, list);
  }
  for (const [type, list] of grouped.entries()) {
    grouped.set(type, dedupeCandidates(list));
  }
  return grouped;
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const deduped = [];
  for (const candidate of candidates) {
    const key = [
      candidate.source?.modulePath ?? "",
      candidate.source?.startLine ?? "",
      candidate.source?.endLine ?? "",
      candidate.source?.mechanic ?? "",
    ].join(":");
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }
  return deduped;
}

function uniqueRequiredPrompts(candidates) {
  const prompts = new Set();
  for (const candidate of candidates) {
    for (const prompt of candidate.requiredHumanResolution ?? []) {
      prompts.add(prompt);
    }
    for (const value of Object.values(candidate)) {
      if (value && typeof value === "object" && Array.isArray(value.requiredHumanResolution)) {
        for (const prompt of value.requiredHumanResolution) {
          prompts.add(prompt);
        }
      }
    }
  }
  return [...prompts].sort();
}

function renderSnippet(workspaceRoot, modulePath, lineNumber, contextLines) {
  if (typeof modulePath !== "string" || modulePath.length === 0 || !Number.isInteger(lineNumber)) {
    return "<source snippet unavailable>";
  }
  const fullPath = path.resolve(workspaceRoot, modulePath);
  if (!fs.existsSync(fullPath)) {
    return `<source file not found: ${modulePath}>`;
  }
  const lines = fs.readFileSync(fullPath, "utf8").replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
  const start = Math.max(0, lineNumber - 1 - contextLines);
  const end = Math.min(lines.length, lineNumber + contextLines);
  const width = String(end).length;
  const rendered = [];
  for (let index = start; index < end; index += 1) {
    const isTarget = index + 1 === lineNumber;
    const marker = isTarget ? "->" : "  ";
    const lineNo = String(index + 1).padStart(width, " ");
    rendered.push(`${marker} ${lineNo}: ${lines[index]}`);
  }
  return rendered.join("\n");
}

function summarizeEngineFindings(result) {
  const findings = result.findings ?? [];
  const byArtifact = new Map();
  for (const finding of findings) {
    const artifactId = finding.artifactId ?? "unknown";
    const entry = byArtifact.get(artifactId) ?? {
      artifactId,
      count: 0,
      findingIds: new Set(),
      note: "",
    };
    entry.count += 1;
    entry.findingIds.add(finding.findingId);
    if (finding.findingId === "source-authority-declaration-mismatch") {
      entry.note = summarizeSourceAuthorityMismatch(finding);
    } else if (finding.findingId === "declared-content-digest-mismatch") {
      entry.note = `Content digest mismatch: expected ${finding.expected}, observed ${finding.observed}.`;
    } else if (!entry.note) {
      entry.note = summarizeGenericFinding(finding);
    }
    byArtifact.set(artifactId, entry);
  }

  const digestMismatches = findings
    .filter((finding) => finding.findingId === "declared-content-digest-mismatch")
    .map((finding) => ({
      artifactId: finding.artifactId ?? "unknown",
      expected: finding.expected,
      observed: finding.observed,
    }))
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId));

  const artifacts = [...byArtifact.values()]
    .map((entry) => ({
      artifactId: entry.artifactId,
      count: entry.count,
      findingIds: [...entry.findingIds],
      note: entry.note || "See detailed engine findings for the specific unresolved edges.",
    }))
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId));

  return {
    totalFindings: findings.length,
    artifacts,
    digestMismatches,
  };
}

function summarizeSourceAuthorityMismatch(finding) {
  const nested = finding.authorityFindings ?? [];
  const representative = nested.slice(0, 4).map((entry) => {
    if (entry.findingId === "UNDECLARED_SEMANTIC_EDGE") {
      return `${entry.observed?.responsibilityDeclaration ?? "module"} → ${entry.observed?.operation ?? "unknown operation"}`;
    }
    if (entry.findingId === "DECLARED_PROJECTION_MAPPING_MISSING") {
      return `${entry.authorityId ?? "projection"} missing`;
    }
    if (entry.findingId === "DECLARED_RESULT_CONTRACT_MISSING") {
      return `${entry.authorityId ?? "result contract"} missing`;
    }
    return entry.findingId;
  });
  return representative.length > 0
    ? `Representative unresolved edges: ${representative.join("; ")}.`
    : "Authority declarations do not yet cover the observed execution mechanics.";
}

function summarizeGenericFinding(finding) {
  if (finding.findingId === "semantic-body-responsibility-cardinality") {
    return "The body still has more than one executable semantic boundary and must be reduced to a single declared invocation.";
  }
  if (finding.findingId === "semantic-execution-boundary-unresolved") {
    return "The execution boundary is still not sealed as data-only behavior.";
  }
  return "See the governed-artifacts receipt for the exact unresolved edge.";
}

function toWorkspaceRelative(value) {
  if (typeof value !== "string") return "";
  return value.replaceAll("\\", "/");
}

function resolvedSourceFiles(candidatesData) {
  const sourceFiles = candidatesData.generatedFromViolations?.sourceFiles;
  if (Array.isArray(sourceFiles) && sourceFiles.length > 0) return sourceFiles;
  const codeFile = candidatesData.generatedFromViolations?.codeFile;
  return [codeFile ?? "contracts/serves-query-console.candidates.json"];
}

function sourceFilesLabel(candidatesData) {
  return resolvedSourceFiles(candidatesData).length > 1 ? "Candidate sources" : "Candidate source";
}

function renderSourceFiles(candidatesData) {
  return resolvedSourceFiles(candidatesData)
    .map((file) => `\`${toWorkspaceRelative(file)}\``)
    .join(", ");
}
