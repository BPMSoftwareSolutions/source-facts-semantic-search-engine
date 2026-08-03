#!/usr/bin/env node
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { projectSourceFactsWorkspace } from "./project.js";
import { executeRelationalQuery } from "./query.js";
import { validatesSourceFactIndex } from "./validate-index.js";
import { projectsWebSurfaceInventory } from "./web/inventory.js";
import { projectsWebSurfaceIndex } from "./web/project-web-surfaces.js";
import { validatesWebSurfaceInventory, validatesWebSurfaceIndex, validatesWebKnowWorkspace } from "./web/validate-web-index.js";
import { deducesWebQuerySourceNames, executesWebRelationalQuery } from "./web/web-query.js";
import { writesJsonFile } from "./lib/writes-json-file.js";
import { readsJsonFile } from "./lib/reads-json-file.js";
import {
  galleryArtifactNames,
  resolvesGalleryPreviewPolicy,
  writesGalleryPlan,
  writesGalleryProjection,
} from "./gallery/projects-gallery.js";
import { servesIsolatedPreviews } from "./gallery/serves-isolated-previews.js";
import { capturesBrowserRenders } from "./gallery/captures-browser-render.js";
import {
  validatesEnterpriseGalleryManifest,
  validatesSurfacePreviewPlan,
  validatesSurfacePreviewPolicy,
} from "./gallery/validates-gallery-artifacts.js";
import { compositionArtifactNames, writesSignInComposition } from "./composition/writes-sign-in-composition.js";
import { northStarArtifactNames, runsSignInNorthStar } from "./composition/runs-sign-in-north-star.js";
import { loadsSourceFactIndexIntoSqlServer } from "./sqlserver/load-sqlserver.js";
import { resolvesTrustedConnection, resolvesSqlAuthConnectionFromEnv } from "./sqlserver/resolves-sql-connection.js";
import { projectsAuthorityFromMechanics } from "./projects-authority-candidates.js";
import { AuthorityProjectorFromViolations, projectAuthorityCandidatesFromViolations } from "./projects-authority-from-violations.js";
import { projectsConsoleGovernedContract } from "./projects-governed-console-contract.js";
import { discoversAuthorityDocumentsAcrossRoots } from "./governance/discovers-authority-documents.js";
import { discoversSemanticOverlapProposalBatches } from "./governance/discovers-semantic-overlap-proposals.js";
import { discoversKnowHowRegistry } from "./governance/discovers-know-how-registry.js";
import { proposesSemanticOverlap } from "./governance/proposes-semantic-overlap.js";
import { projectsSelfGovernanceReport } from "./governance/projects-self-governance-report.js";
import { validatesSelfGovernanceReport } from "./governance/validates-self-governance-report.js";
import { formatsSelfGovernanceReportSummary, formatsSelfGovernanceReportMarkdown } from "./governance/formats-self-governance-report-summary.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const consoleWorkspaceRoot = path.join(repositoryRoot, "src", "console");
const consoleAuthorityFile = path.join(repositoryRoot, "contracts", "serves-query-console.authority.json");
const consoleCandidatesOutputFile = path.join(repositoryRoot, "contracts", "serves-query-console.candidates.json");
const consoleAuthorityDraftOutputFile = path.join(repositoryRoot, "contracts", "serves-query-console.authority.draft.json");
const externalGovernanceEnginePath = path.resolve(repositoryRoot, "..", "contract-driven-artifact-governance-engine", "bin", "governed-artifacts.mjs");
const consoleViolationModulePaths = Object.freeze([
  "console-authority-bundles.mjs",
  "console-routing-adapter.mjs",
  "console-snippet-adapter.mjs",
  "console-validation-adapter.mjs",
  "serves-query-console.conformant.mjs",
  "serves-query-console.mjs",
  "serves-query-console.projected.mjs",
  "serves-query-console.runtime.mjs",
]);
const consoleViolationMechanics = Object.freeze(Object.keys(new AuthorityProjectorFromViolations().authorityFamilyMap));

const args = process.argv.slice(2);
const command = args[0];

if (command === "project") {
  await runProject(args.slice(1));
} else if (command === "query") {
  await runQuery(args.slice(1));
} else if (command === "project-authority") {
  await runProjectAuthority(args.slice(1));
} else if (command === "project-authority-violations") {
  await runProjectAuthorityViolations(args.slice(1));
} else if (command === "project-console-contract" || command === "project-governed-console-contract") {
  await runProjectConsoleContract(args.slice(1));
} else if (command === "govern") {
  await runGovern(args.slice(1));
} else if (command === "propose-semantic-overlap") {
  await runProposeSemanticOverlap(args.slice(1));
} else if (command === "web") {
  await runWeb(args.slice(1));
} else if (command === "console") {
  await runConsole(args.slice(1));
} else if (command === "load-sqlserver") {
  await runLoadSqlServer(args.slice(1));
} else if (command === "ingest") {
  await runIngest(args.slice(1));
} else if (command === "help" || command === "--help" || command === "-h" || command === undefined) {
  writeUsage(process.stdout);
} else {
  writeUsage(process.stderr);
  process.exitCode = 1;
}

async function runProject(rawArgs) {
  const { flags, positional } = parseArgs(rawArgs);
  const workspaceRoot = path.resolve(flags.workspace ?? process.cwd());
  const workspaceId = flags.workspaceId ?? path.basename(workspaceRoot);
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "source-fact-index.json"));
  const pretty = flags.pretty === true;

  const index = await projectSourceFactsWorkspace({
    workspaceRoot,
    workspaceId,
    languageId: "typescript",
  });
  await validatesSourceFactIndex(index);

  await writesJsonFile(outputPath, index, { pretty });
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatSummary(index));
  }
}

async function runQuery(rawArgs) {
  const { flags, positional } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "source-fact-index.json"));
  const queryText = resolveQueryText(flags, positional);
  const index = await readsJsonFile(indexPath);
  const result = await executeRelationalQuery(index, queryText);
  const pretty = flags.pretty === true;
  process.stdout.write(pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result));
}

async function runProjectAuthority(rawArgs) {
  const { flags, positional } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "source-fact-index.json"));
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "authority-candidates.json"));
  const modulePath = flags.module ?? "";
  const responsibilityId = flags.responsibility ?? "";

  const index = await readsJsonFile(indexPath);
  const candidates = await projectsAuthorityFromMechanics(index, new Map(), {
    modulePath,
    responsibilityId
  });

  await writesJsonFile(outputPath, candidates, { pretty: true });
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(`Generated ${candidates.candidates?.length || 0} authority candidates\n`);
    process.stdout.write(`Coverage: ${(candidates.coverageSummary?.authorityConformanceRatio * 100).toFixed(1)}%\n`);
    process.stdout.write(`Gate status: ${candidates.coverageSummary?.admissionGateStatus}\n`);
  }
}

async function runProjectAuthorityViolations(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const workspaceRoot = path.resolve(flags.workspace ?? consoleWorkspaceRoot);
  const workspaceId = flags.workspaceId ?? path.basename(workspaceRoot);
  const codeFile = path.resolve(flags.codeFile ?? path.join(consoleWorkspaceRoot, "serves-query-console.mjs"));
  const authorityFile = path.resolve(flags.authorityFile ?? consoleAuthorityFile);
  const outputPath = path.resolve(flags.output ?? consoleCandidatesOutputFile);
  const authorityOutputPath = path.resolve(flags.authorityOutput ?? consoleAuthorityDraftOutputFile);
  const modulePaths = typeof flags.modules === "string"
    ? flags.modules.split(",").map((entry) => entry.trim()).filter(Boolean)
    : consoleViolationModulePaths;

  const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId, languageId: "typescript" });
  await validatesSourceFactIndex(index);

  const whereClauses = [`bm.mechanic IN (${consoleViolationMechanics.map(quoteSqlLiteral).join(", ")})`];
  if (modulePaths !== null && modulePaths.length > 0) {
    whereClauses.push(`bm.modulePath IN (${modulePaths.map(quoteSqlLiteral).join(", ")})`);
  }

  const queryText = [
    "SELECT bm.mechanic AS mechanic,",
    "       bm.modulePath AS modulePath,",
    "       bm.sourceReferenceId AS sourceReferenceId,",
    "       bm.fromSymbolId AS fromSymbolId,",
    "       sr.startLine AS startLine,",
    "       sr.endLine AS endLine,",
    "       sym.name AS symbolName",
    "FROM bodyMechanics bm",
    "JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId",
    "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId",
    `WHERE ${whereClauses.join(" AND ")}`,
    "ORDER BY bm.modulePath, sr.startLine, sr.endLine, bm.mechanic",
  ].join(" ");

  const receipt = await executeRelationalQuery(index, queryText);
  if (receipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new Error(`Violation query failed: ${JSON.stringify(receipt, null, 2)}`);
  }
  const bodyViolations = receipt.result.value.rows;

  const governanceReceipt = await executeRelationalQuery(
    index,
    [
      "SELECT gr.mechanic AS mechanic,",
      "       gr.profilePath AS modulePath,",
      "       gr.sourceReferenceId AS sourceReferenceId,",
      "       sr.startLine AS startLine,",
      "       sr.endLine AS endLine,",
      "       NULL AS fromSymbolId,",
      "       NULL AS symbolName,",
      "       gr.executionPortEffect AS codePattern,",
      "       gr.semanticAuthorityLocation AS reason",
      "FROM governanceRules gr",
      "JOIN sourceReferences sr ON gr.sourceReferenceId = sr.referenceId",
      `WHERE gr.mechanic IN (${consoleViolationMechanics.map(quoteSqlLiteral).join(", ")})`,
    ].join(" "),
  );
  if (governanceReceipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new Error(`Governance rule query failed: ${JSON.stringify(governanceReceipt, null, 2)}`);
  }

  const governanceViolations = governanceReceipt.result.value.rows.filter((row) => {
    if (typeof row.modulePath !== "string" || row.modulePath.length === 0) {
      return false;
    }
    if (modulePaths.includes(row.modulePath)) {
      return true;
    }
    return row.modulePath.includes("governed-message-artifact-family") || row.modulePath.includes("serves-query-console");
  });

  const violations = [...bodyViolations, ...governanceViolations];

  const result = await projectAuthorityCandidatesFromViolations(
    codeFile,
    authorityFile,
    violations,
    outputPath,
    { workspaceRoot, authorityOutputPath },
  );

  if (!result.success) {
    throw new Error(`Failed to project authority candidates from violations: ${result.error ?? "unknown error"}`);
  }

  process.stdout.write(`${outputPath}\n`);
  if (result.authorityFile) {
    process.stdout.write(`${result.authorityFile}\n`);
  }
  if (flags.summary === true) {
    process.stdout.write(formatsViolationCandidatesSummary(violations, result.candidatesData));
  }
}

async function runProjectConsoleContract(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const workspaceRoot = typeof flags.workspace === "string" ? path.resolve(flags.workspace) : consoleWorkspaceRoot;
  const result = projectsConsoleGovernedContract({
    workspaceRoot,
    ...(typeof flags.templateContract === "string" ? { templateContractPath: path.resolve(flags.templateContract) } : {}),
    ...(typeof flags.authorityFile === "string" ? { authorityPath: path.resolve(flags.authorityFile) } : {}),
    ...(typeof flags.authorityComplete === "string" ? { authorityCompletePath: path.resolve(flags.authorityComplete) } : {}),
    ...(typeof flags.binding === "string" ? { bindingPath: path.resolve(flags.binding) } : {}),
    ...(typeof flags.violationBindings === "string" ? { violationBindingsPath: path.resolve(flags.violationBindings) } : {}),
    ...(typeof flags.strategyDoc === "string" ? { strategyDocPath: path.resolve(flags.strategyDoc) } : {}),
    ...(typeof flags.output === "string" ? { outputPath: path.resolve(flags.output) } : {}),
  });

  if (!result.success) {
    throw new Error(`Failed to project console governed contract: ${result.error}`);
  }

  process.stdout.write(`${result.file}\n`);
  if (flags.summary === true) {
    process.stdout.write(`Artifact count: ${result.artifactCount}\n`);
    process.stdout.write(`${result.message}\n`);
  }

  if (flags.project === true || flags.gate === true) {
    const engineResults = [];
    if (flags.project === true) {
      engineResults.push(runsGovernedArtifactsOperation("project", result.file, workspaceRoot, flags.write === true));
    }
    if (flags.gate === true) {
      engineResults.push(runsGovernedArtifactsOperation("gate", result.file, workspaceRoot, true));
    }
    const failingResult = engineResults.find((entry) => entry.status !== 0);
    if (failingResult) {
      process.exitCode = failingResult.status ?? 1;
    }
  }
}

async function runGovern(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const pretty = flags.pretty === true;

  let index;
  let workspaceRoot;
  if (typeof flags.index === "string") {
    index = await readsJsonFile(path.resolve(flags.index));
    workspaceRoot = index.manifest?.scanRequest?.workspaceRoot ?? null;
  } else {
    workspaceRoot = path.resolve(flags.workspace ?? path.join(repositoryRoot, "src"));
    const workspaceId = flags.workspaceId ?? path.basename(workspaceRoot);
    index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId, languageId: "typescript" });
    await validatesSourceFactIndex(index);
  }

  const authorityDir = path.resolve(flags.authorityDir ?? path.join(repositoryRoot, "contracts"));
  const authorityRoots = [authorityDir, ...(typeof workspaceRoot === "string" ? [workspaceRoot] : [])];
  const authorityDocuments = await discoversAuthorityDocumentsAcrossRoots(authorityRoots, { relativeTo: repositoryRoot });

  const reviewsDir = path.resolve(flags.reviewsDir ?? path.join(repositoryRoot, "reviews"));
  const semanticOverlapProposalBatches = await discoversSemanticOverlapProposalBatches(reviewsDir, { relativeTo: repositoryRoot });

  const knowHowDir = path.resolve(flags.knowHowDir ?? path.join(repositoryRoot, "know-how"));
  const knowHowRegistry = await discoversKnowHowRegistry(knowHowDir, { relativeTo: repositoryRoot });

  const report = await projectsSelfGovernanceReport({
    index,
    repositoryId: flags.repositoryId ?? index.workspace?.workspaceId ?? "source-facts-semantic-search-engine",
    authorityDocuments,
    semanticOverlapProposalBatches,
    knowHowRegistry,
    workspaceRelativePrefix: resolvesWorkspaceRelativePrefix(repositoryRoot, workspaceRoot),
  });
  await validatesSelfGovernanceReport(report);

  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "source-facts-self-governance-report.json"));
  const summaryPath = outputPath.replace(/\.json$/i, ".md");
  await writesJsonFile(outputPath, report, { pretty });
  await fs.writeFile(summaryPath, formatsSelfGovernanceReportMarkdown(report), "utf8");

  process.stdout.write(`${outputPath}\n${summaryPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatsSelfGovernanceReportSummary(report));
  }
}

/**
 * The live-inference half of the loop govern's semanticOverlapProposals
 * section only ever reads from disk. Produces a real
 * semantic-overlap-proposal-batch.v1 file under reviews/ via an actual model
 * call (proposesSemanticOverlap / invokes-live-model-inference.js spawning
 * the sibling generic-llm-connector) -- not a hand-run script. The written
 * batch is always INFERRED_NOT_ADMITTED with empty review fields; a human
 * edits the file to add reviewFindings/reviewOutcomes/knowHowExtracted/
 * candidateAuthorities before scripts/admit-know-how-from-review.mjs can act
 * on it.
 */
async function runProposeSemanticOverlap(rawArgs) {
  const { flags } = parseArgs(rawArgs);

  if (typeof flags.historicalAuthorityFile !== "string" || typeof flags.successorFile !== "string") {
    process.stderr.write("propose-semantic-overlap requires --historical-authority-file <path> and --successor-file <path>\n");
    process.exitCode = 1;
    return;
  }

  const historicalAuthorityPath = path.resolve(repositoryRoot, flags.historicalAuthorityFile);
  const successorPath = path.resolve(repositoryRoot, flags.successorFile);
  const relatedPaths = typeof flags.relatedFiles === "string"
    ? flags.relatedFiles.split(",").map((entry) => path.resolve(repositoryRoot, entry.trim())).filter((entry) => entry.length > 0)
    : [];

  const historicalAuthorityDocument = await readsJsonFile(historicalAuthorityPath);

  const evidenceFiles = [];
  for (const evidencePath of [successorPath, ...relatedPaths]) {
    evidenceFiles.push({
      path: path.relative(repositoryRoot, evidencePath).replaceAll("\\", "/"),
      content: await fs.readFile(evidencePath, "utf8"),
    });
  }

  const batch = await proposesSemanticOverlap({
    historicalAuthorityFile: path.relative(repositoryRoot, historicalAuthorityPath).replaceAll("\\", "/"),
    historicalAuthorityDocument,
    resolvedSuccessorFile: path.relative(repositoryRoot, successorPath).replaceAll("\\", "/"),
    successionEvidence: flags.successionEvidence ?? null,
    evidenceFiles,
  });

  const defaultOutputName = `${path.basename(historicalAuthorityPath).replace(/\.json$/i, "")}.semantic-overlap-proposals.json`;
  const outputPath = path.resolve(repositoryRoot, flags.output ?? path.join("reviews", defaultOutputName));
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await writesJsonFile(outputPath, batch, { pretty: true });

  process.stdout.write(`${outputPath}\n`);
  process.stdout.write(`${batch.proposals.length} proposal(s) obtained from ${batch.inference.resolvedModel} (${batch.inference.usage?.totalTokens ?? "?"} tokens, ${batch.inference.durationMilliseconds ?? "?"}ms).\n`);
  process.stdout.write("Lifecycle: INFERRED_NOT_ADMITTED -- review this file (reviewFindings/reviewOutcomes/knowHowExtracted/candidateAuthorities) before running scripts/admit-know-how-from-review.mjs.\n");
}

/**
 * Authority documents declare sourceFile/sourceLocation relative to the
 * repository root; a workspace scan emits modulePath relative to whatever
 * --workspace was given. Only prefix when the workspace is actually nested
 * under the repository root -- an out-of-tree scan has no meaningful
 * repository-relative form, so leave modulePath as-is rather than guess.
 */
function resolvesWorkspaceRelativePrefix(repositoryRootPath, workspaceRootPath) {
  if (typeof workspaceRootPath !== "string" || workspaceRootPath.length === 0) return "";
  const relative = path.relative(repositoryRootPath, workspaceRootPath).replaceAll("\\", "/");
  if (relative.length === 0 || relative.startsWith("..") || path.isAbsolute(relative)) return "";
  return relative;
}

function runsGovernedArtifactsOperation(operation, contractPath, workspaceRoot, writeMode) {
  const commandArgs = [
    externalGovernanceEnginePath,
    operation,
    "--contract",
    contractPath,
    "--workspace",
    workspaceRoot,
  ];
  if (operation === "project") {
    commandArgs.push(writeMode ? "--write" : "--check");
  } else if (operation === "gate") {
    commandArgs.push("--write-receipt");
  }

  const result = spawnSync(process.execPath, commandArgs, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });

  if (typeof result.stdout === "string" && result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
  if (typeof result.stderr === "string" && result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
  if (result.error) {
    throw result.error;
  }
  return result;
}

function formatsViolationCandidatesSummary(violations, candidatesData) {
  const coverage = candidatesData?.coverageSummary;
  const lines = [
    `Violations detected: ${violations.length}`,
    `Candidates projected: ${candidatesData?.candidates.length ?? 0}`,
    `Authority draft mechanics: ${candidatesData?.authorityDraft?.authority?.mechanics?.length ?? 0}`,
    `Mapped to known authority: ${coverage?.violationsMappedToAuthority ?? 0}`,
    `Authority mechanics known: ${coverage?.authorityMechanicsKnown ?? 0}`,
  ];
  return `${lines.join("\n")}\n`;
}

function resolvesSqlServerConnection(flags) {
  if (typeof flags.connectionEnv === "string") return resolvesSqlAuthConnectionFromEnv(flags.connectionEnv);
  if (typeof flags.server === "string") return resolvesTrustedConnection({ server: flags.server, database: flags.database ?? "source-facts-semantic-search-engine" });
  throw new Error("Either --connection-env <ENV_VAR> (Azure/SQL auth) or --server <host> [--database <name>] (trusted connection) is required.");
}

async function runLoadSqlServer(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "source-fact-index.json"));
  const index = await readsJsonFile(indexPath);
  const connection = resolvesSqlServerConnection(flags);
  const receipt = await loadsSourceFactIndexIntoSqlServer({
    index,
    connection,
    onStep: (step) => process.stdout.write(`  ${step.table}: ${step.rows} rows in ${step.elapsedMs}ms${step.alreadyLoaded ? " (already loaded)" : ""}\n`),
  });
  process.stdout.write(`${receipt.disposition}\n`);
  if (flags.summary === true) process.stdout.write(formatsSqlServerLoadSummary(receipt));
}

async function runIngest(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const workspaceRoot = path.resolve(flags.workspace ?? process.cwd());
  const workspaceId = flags.workspaceId ?? path.basename(workspaceRoot);
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "source-fact-index.json"));

  const index = await projectSourceFactsWorkspace({ workspaceRoot, workspaceId, languageId: "typescript" });
  await validatesSourceFactIndex(index);
  await writesJsonFile(outputPath, index, { pretty: flags.pretty === true });
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) process.stdout.write(formatSummary(index));

  const connection = resolvesSqlServerConnection(flags);
  const receipt = await loadsSourceFactIndexIntoSqlServer({
    index,
    connection,
    onStep: (step) => process.stdout.write(`  ${step.table}: ${step.rows} rows in ${step.elapsedMs}ms${step.alreadyLoaded ? " (already loaded)" : ""}\n`),
  });
  process.stdout.write(`${receipt.disposition}\n`);
  if (flags.summary === true) process.stdout.write(formatsSqlServerLoadSummary(receipt));
}

function formatsSqlServerLoadSummary(receipt) {
  const lines = [
    `Index ID: ${receipt.indexId}`,
    `Already loaded: ${receipt.alreadyLoaded}`,
    `Files: ${receipt.counts.files}`,
    `Symbols: ${receipt.counts.symbols}`,
    `Relationships: ${receipt.counts.relationships}`,
    `Dataflows: ${receipt.counts.dataflows}`,
    `Source references: ${receipt.counts.sourceReferences}`,
    `Body mechanics: ${receipt.counts.bodyMechanics}`,
    `Total elapsed: ${receipt.totalElapsedMs}ms`,
  ];
  return `${lines.join("\n")}\n`;
}

async function runConsole(rawArgs) {
  const subcommand = rawArgs[0];
  if (subcommand === "serve") {
    await runConsoleServe(rawArgs.slice(1));
  } else {
    writeUsage(process.stderr);
    process.exitCode = 1;
  }
}

async function runConsoleServe(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "source-fact-index.json"));
  const index = await readsJsonFile(indexPath);
  const workspaceRoot = typeof flags.workspace === "string"
    ? path.resolve(flags.workspace)
    : (typeof index.manifest?.scanRequest?.workspaceRoot === "string" ? index.manifest.scanRequest.workspaceRoot : null);
  const consoleAssetPath = path.join(repositoryRoot, "source-facts-query-console", "index.html");
  const port = typeof flags.port === "string" ? Number.parseInt(flags.port, 10) : 0;
  const { servesQueryConsole } = await import("./console/serves-query-console.mjs");
  const consoleServer = await servesQueryConsole({ index, workspaceRoot, consoleAssetPath, port });
  process.stdout.write(`${consoleServer.url}\n`);
  await waitsForTerminationSignal(consoleServer);
}

async function runWeb(rawArgs) {
  const subcommand = rawArgs[0];
  if (subcommand === "inventory") {
    await runWebInventory(rawArgs.slice(1));
  } else if (subcommand === "project") {
    await runWebProject(rawArgs.slice(1));
  } else if (subcommand === "query") {
    await runWebQuery(rawArgs.slice(1));
  } else if (subcommand === "gallery") {
    await runWebGallery(rawArgs.slice(1));
  } else if (subcommand === "compose") {
    await runWebCompose(rawArgs.slice(1));
  } else if (subcommand === "north-star") {
    await runWebNorthStar(rawArgs.slice(1));
  } else {
    writeUsage(process.stderr);
    process.exitCode = 1;
  }
}

async function runWebNorthStar(rawArgs) {
  const subcommand = rawArgs[0];
  if (subcommand !== "sign-in") {
    writeUsage(process.stderr);
    process.exitCode = 1;
    return;
  }
  const { flags } = parseArgs(rawArgs.slice(1));
  const { index, inventory } = await readsGalleryInputs(flags);
  const requestPath = path.resolve(flags.request ?? path.join(repositoryRoot, "compositions", "enterprise-learning-sign-in.request.v1.json"));
  const requestTemplate = await readsJsonFile(requestPath);
  const requestInput = {
    ...requestTemplate,
    ...(typeof flags.subject === "string" ? { subject: flags.subject } : {}),
    ...(typeof flags.purpose === "string" ? { purpose: flags.purpose } : {}),
    ...(typeof flags.audience === "string" ? { audience: flags.audience } : {}),
  };
  const outputDirectory = path.resolve(flags.output ?? flags.dir ?? path.join(process.cwd(), "sign-in-north-star"));
  const result = await runsSignInNorthStar({
    index,
    inventory,
    requestInput,
    outputDirectory,
    selectionOverrides: {
      ...(typeof flags.layout === "string" ? { layout: flags.layout } : {}),
      ...(typeof flags.authenticationEntry === "string" ? { "authentication-entry": flags.authenticationEntry } : {}),
      ...(typeof flags.messaging === "string" ? { messaging: flags.messaging } : {}),
      ...(typeof flags.theme === "string" ? { theme: flags.theme } : {}),
    },
    ...(typeof flags.authorities === "string" ? { authoritiesDirectory: path.resolve(flags.authorities) } : {}),
    previewPolicyId: flags.policy ?? requestInput.previewPolicyId,
    prove: flags.prove === true,
  });
  process.stdout.write(`${path.join(outputDirectory, northStarArtifactNames.report)}\n`);
  process.stdout.write(`${path.join(outputDirectory, northStarArtifactNames.authorityChoices)}\n`);
  process.stdout.write(`${path.join(result.galleryOutputDirectory, galleryArtifactNames.host)}\n`);
  process.stdout.write(`${path.join(result.compositionOutputDirectory, compositionArtifactNames.compatibilityReport)}\n`);
  if (result.composition.contract !== null) {
    process.stdout.write(`${path.join(result.compositionOutputDirectory, compositionArtifactNames.designDocument)}\n`);
    process.stdout.write(`${path.join(result.compositionOutputDirectory, compositionArtifactNames.candidateAst)}\n`);
    process.stdout.write(`${path.join(result.compositionOutputDirectory, compositionArtifactNames.preview)}\n`);
  }
  if (flags.summary === true) process.stdout.write(formatsNorthStarSummary(result));
  if (result.composition.compatibilityReport.disposition !== "COMPATIBLE") process.exitCode = 2;
}

async function runWebCompose(rawArgs) {
  const subcommand = rawArgs[0];
  if (subcommand !== "sign-in") {
    writeUsage(process.stderr);
    process.exitCode = 1;
    return;
  }
  const { flags } = parseArgs(rawArgs.slice(1));
  if (typeof flags.request !== "string") throw new Error("--request <sign-in-composition-request.json> is required.");
  if (typeof flags.manifest !== "string") throw new Error("--manifest <enterprise-gallery-manifest.json> is required.");
  const requestInput = JSON.parse(stripsByteOrderMark(await fs.readFile(path.resolve(flags.request), "utf8")));
  const manifest = JSON.parse(stripsByteOrderMark(await fs.readFile(path.resolve(flags.manifest), "utf8")));
  const outputDirectory = path.resolve(flags.output ?? flags.dir ?? path.join(process.cwd(), "sign-in-composition"));
  const result = await writesSignInComposition({
    requestInput,
    manifest,
    outputDirectory,
    ...(typeof flags.authorities === "string" ? { authoritiesDirectory: path.resolve(flags.authorities) } : {}),
  });
  process.stdout.write(`${path.join(outputDirectory, compositionArtifactNames.compatibilityReport)}\n`);
  if (result.contract !== null) {
    process.stdout.write(`${path.join(outputDirectory, compositionArtifactNames.contract)}\n`);
    process.stdout.write(`${path.join(outputDirectory, compositionArtifactNames.designDocument)}\n`);
    process.stdout.write(`${path.join(outputDirectory, compositionArtifactNames.candidateAst)}\n`);
    process.stdout.write(`${path.join(outputDirectory, compositionArtifactNames.preview)}\n`);
  }
  if (flags.summary === true) {
    process.stdout.write(`Compatibility: ${result.compatibilityReport.disposition}; satisfied: ${result.compatibilityReport.satisfiedCount}; failed: ${result.compatibilityReport.failedCount}\n`);
  }
  if (result.compatibilityReport.disposition !== "COMPATIBLE") process.exitCode = 2;
}

async function runWebGallery(rawArgs) {
  const subcommand = rawArgs[0];
  if (subcommand === "plan") {
    await runWebGalleryPlan(rawArgs.slice(1));
  } else if (subcommand === "project") {
    await runWebGalleryProject(rawArgs.slice(1));
  } else if (subcommand === "serve") {
    await runWebGalleryServe(rawArgs.slice(1));
  } else if (subcommand === "prove") {
    await runWebGalleryProve(rawArgs.slice(1));
  } else {
    writeUsage(process.stderr);
    process.exitCode = 1;
  }
}

async function runWebGalleryPlan(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const { index, inventory } = await readsGalleryInputs(flags);
  const outputDirectory = path.resolve(flags.output ?? flags.dir ?? path.join(process.cwd(), "enterprise-gallery"));
  const result = await writesGalleryPlan({
    index,
    inventory,
    queryId: flags.query ?? "enterprise-pages",
    previewPolicyId: flags.policy ?? "static-no-script.v1",
    outputDirectory,
    writeMode: flags.writeMode ?? "overwrite",
  });
  process.stdout.write(`${path.join(outputDirectory, galleryArtifactNames.selection)}\n`);
  process.stdout.write(`${path.join(outputDirectory, galleryArtifactNames.plan)}\n`);
  if (flags.summary === true) process.stdout.write(formatsGallerySummary(result.selection, result.plan));
}

async function runWebGalleryProject(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const { index, inventory } = await readsGalleryInputs(flags);
  const outputDirectory = path.resolve(flags.output ?? flags.dir ?? path.join(process.cwd(), "enterprise-gallery"));
  const result = await writesGalleryProjection({
    index,
    inventory,
    queryId: flags.query ?? "enterprise-pages",
    previewPolicyId: flags.policy ?? "static-no-script.v1",
    outputDirectory,
    writeMode: flags.writeMode ?? "overwrite",
  });
  process.stdout.write(`${path.join(outputDirectory, galleryArtifactNames.manifest)}\n`);
  process.stdout.write(`${path.join(outputDirectory, galleryArtifactNames.host)}\n`);
  process.stdout.write(`${path.join(outputDirectory, galleryArtifactNames.projectionReceipt)}\n`);
  if (flags.summary === true) process.stdout.write(formatsGallerySummary(result.selection, result.plan));
}

async function runWebGalleryServe(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const outputDirectory = path.resolve(flags.dir ?? flags.output ?? path.join(process.cwd(), "enterprise-gallery"));
  const previewPolicy = await readsPersistedGalleryPolicy(outputDirectory, flags.policy);
  const previewServer = await servesIsolatedPreviews({ outputDirectory, previewPolicy });
  process.stdout.write(`${previewServer.url}\n`);
  await waitsForTerminationSignal(previewServer);
}

async function runWebGalleryProve(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const outputDirectory = path.resolve(flags.dir ?? flags.output ?? path.join(process.cwd(), "enterprise-gallery"));
  const manifest = JSON.parse(stripsByteOrderMark(await fs.readFile(path.join(outputDirectory, galleryArtifactNames.manifest), "utf8")));
  const plan = JSON.parse(stripsByteOrderMark(await fs.readFile(path.join(outputDirectory, galleryArtifactNames.plan), "utf8")));
  const previewPolicy = await readsPersistedGalleryPolicy(outputDirectory, flags.policy);
  await validatesEnterpriseGalleryManifest(manifest);
  await validatesSurfacePreviewPlan(plan);

  const previewServer = await servesIsolatedPreviews({ outputDirectory, previewPolicy });
  let proof;
  try {
    proof = await capturesBrowserRenders({
      manifest,
      plan,
      outputDirectory,
      baseUrl: previewServer.url,
      previewPolicy,
      cspPolicy: previewServer.cspPolicy,
    });
  } finally {
    await previewServer.close();
  }
  for (const emittedFile of proof.emittedFiles.filter((file) => file.path.endsWith(".receipt.json"))) {
    process.stdout.write(`${path.join(outputDirectory, ...emittedFile.path.split("/"))}\n`);
  }
  const renderedCount = proof.receipts.filter((receipt) => receipt.verdict.startsWith("RENDERED_")).length;
  process.stdout.write(`Browser receipts: ${proof.receipts.length}; rendered: ${renderedCount}; browser available: ${proof.browserAvailable}\n`);
}

async function readsGalleryInputs(flags) {
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "web-surface-index.json"));
  const inventoryPath = path.resolve(flags.inventory ?? path.join(path.dirname(indexPath), "web-surface.inventory.json"));
  const index = await readsJsonFile(indexPath);
  const inventory = await readsJsonFile(inventoryPath);
  await validatesWebSurfaceIndex(index);
  await validatesWebSurfaceInventory(inventory);
  return { index, inventory };
}

async function readsPersistedGalleryPolicy(outputDirectory, policyOverride) {
  const persistedPolicyPath = path.join(outputDirectory, galleryArtifactNames.policy);
  let previewPolicy;
  try {
    previewPolicy = JSON.parse(stripsByteOrderMark(await fs.readFile(persistedPolicyPath, "utf8")));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    previewPolicy = await resolvesGalleryPreviewPolicy(policyOverride ?? "static-no-script.v1");
  }
  await validatesSurfacePreviewPolicy(previewPolicy);
  return previewPolicy;
}

function waitsForTerminationSignal(previewServer) {
  return new Promise((resolve, reject) => {
    let closing = false;
    const closes = async () => {
      if (closing) return;
      closing = true;
      process.off("SIGINT", closes);
      process.off("SIGTERM", closes);
      try {
        await previewServer.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    process.on("SIGINT", closes);
    process.on("SIGTERM", closes);
  });
}

async function runWebInventory(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const policy = await readsPolicy(flags.policy);
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "web-surface.inventory.json"));
  const pretty = flags.pretty === true;

  const inventory = await projectsWebSurfaceInventory({ policy });
  await validatesWebSurfaceInventory(inventory);

  await writesJsonFile(outputPath, inventory, { pretty });
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatInventorySummary(inventory));
  }
}

async function runWebProject(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const policy = await readsPolicy(flags.policy);
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "web-surface-index.json"));
  const pretty = flags.pretty === true;
  const inventory = flags.inventory !== undefined
    ? await readsJsonFile(path.resolve(flags.inventory))
    : undefined;

  const index = await projectsWebSurfaceIndex({ policy, inventory });
  await validatesWebSurfaceIndex(index);

  await writesJsonFile(outputPath, index, { pretty });
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatWebIndexSummary(index));
  }
}

async function runWebQuery(rawArgs) {
  const { flags, positional } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "web-surface-index.json"));
  const queryText = resolveQueryText(flags, positional);
  const index = await readsJsonFile(indexPath, { includeKeys: deducesWebQuerySourceNames(queryText) });
  const result = await executesWebRelationalQuery(index, queryText);
  const pretty = flags.pretty === true;
  process.stdout.write(pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result));
}

async function readsPolicy(policyPath) {
  if (policyPath === undefined) {
    throw new Error("--policy <contracts/web-know.workspace.json> is required.");
  }
  const policy = JSON.parse(stripsByteOrderMark(await fs.readFile(path.resolve(policyPath), "utf8")));
  await validatesWebKnowWorkspace(policy);
  return policy;
}

function stripsByteOrderMark(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function formatInventorySummary(inventory) {
  const lines = [
    `Inventory ID: ${inventory.inventoryId}`,
    `Total paths: ${inventory.coverage.totalPaths}`,
    ...Object.entries(inventory.coverage.byDisposition).map(([disposition, count]) => `  ${disposition}: ${count}`),
  ];
  return `${lines.join("\n")}\n`;
}

function formatWebIndexSummary(index) {
  const lines = [
    `Index Type: ${index.indexType}`,
    `HTML documents: ${index.htmlDocuments.length}`,
    `HTML elements: ${index.htmlElements.length}`,
    `CSS stylesheets: ${index.cssStylesheets.length}`,
    `CSS rules: ${index.cssRules.length}`,
    `CSS declarations: ${index.cssDeclarations.length}`,
    `Web relationships: ${index.webRelationships.length}`,
    `Assets: ${index.assets.length}`,
    `Web families: ${index.webFamilies.length}`,
    `JSX elements: ${index.jsxElements.length}`,
    `Webpage classifications: ${index.webpageClassifications.length}`,
    `Diagnostics: ${index.diagnostics.length}`,
    `Index ID: ${index.indexId}`,
  ];
  return `${lines.join("\n")}\n`;
}

function parseArgs(rawArgs) {
  const flags = Object.create(null);
  const positional = [];
  for (let index = 0; index < rawArgs.length; index++) {
    const current = rawArgs[index];
    if (!current.startsWith("-")) {
      positional.push(current);
      continue;
    }
    const next = rawArgs[index + 1];
    if (!current.startsWith("--")) {
      switch (current) {
        case "-w":
          flags.workspace = next;
          index++;
          continue;
        case "-o":
          flags.output = next;
          index++;
          continue;
        default:
          break;
      }
    }
    if (next !== undefined && !next.startsWith("-")) {
      switch (current) {
        case "--workspace":
        case "--workspace-id":
        case "--output":
        case "--index":
        case "--query":
        case "--policy":
        case "--inventory":
        case "--dir":
        case "--write-mode":
        case "--module":
        case "--responsibility":
        case "--code-file":
        case "--authority-file":
        case "--authority-complete":
        case "--authority-output":
        case "--template-contract":
        case "--binding":
        case "--violation-bindings":
        case "--strategy-doc":
        case "--modules":
        case "--request":
        case "--manifest":
        case "--authorities":
        case "--layout":
        case "--authentication-entry":
        case "--messaging":
        case "--theme":
        case "--subject":
        case "--purpose":
        case "--audience":
        case "--server":
        case "--database":
        case "--connection-env":
        case "--port":
        case "--historical-authority-file":
        case "--successor-file":
        case "--related-files":
        case "--succession-evidence":
          flags[normalizeLongOption(current)] = next;
          index++;
          continue;
      }
    }
    switch (current) {
      case "--pretty":
      case "--summary":
      case "--prove":
      case "--project":
      case "--gate":
      case "--write":
      case "--write-receipt":
        flags[current.slice(2)] = true;
        break;
      default:
        flags[current] = true;
        break;
    }
  }
    return { flags, positional };
}

function resolveQueryText(flags, positional) {
  if (flags.query !== undefined) return flags.query;
  return positional.join(" ");
}

function formatSummary(index) {
  const lines = [
    `Index Type: ${index.indexType}`,
    `Files: ${index.files.length}`,
    `Symbols: ${index.symbols.length}`,
    `Relationships: ${index.relationships.length}`,
    `Document facts: ${index.documents?.length ?? 0}`,
    `Coverage unknown ratio: ${(index.coverage.unknownSyntaxRatio * 100).toFixed(2)}%`,
    `Scan ID: ${index.manifest.scanId}`,
  ];
  return `${lines.join("\n")}\n`;
}

function writeUsage(stream) {
  stream.write(`source-facts-semantic-search-engine\n\n`);
  stream.write(`Usage:\n`);
  stream.write(`  source-facts-se project [--workspace <path>] [--workspace-id <id>] [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se query [--index <file>] --query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se web inventory --policy <contracts/web-know.workspace.json> [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se web project --policy <contracts/web-know.workspace.json> [--inventory <file>] [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se web query [--index <file>] --query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se web query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se web gallery plan [--index <file>] [--inventory <file>] [--query <saved-query-id>] [--policy <policy-id-or-file>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web gallery project [--index <file>] [--inventory <file>] [--query <saved-query-id>] [--policy <policy-id-or-file>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web gallery serve --dir <gallery-output-dir>\n`);
  stream.write(`  source-facts-se web gallery prove --dir <gallery-output-dir>\n`);
  stream.write(`  source-facts-se web compose sign-in --request <file> --manifest <gallery-manifest> [--authorities <dir>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web north-star sign-in [--index <file>] [--inventory <file>] [--request <file>] [--layout <id-or-source>] [--authentication-entry <id-or-source>] [--messaging <id-or-source>] [--theme <id-or-source>] [--output <dir>] [--prove] [--summary]\n`);
  stream.write(`  source-facts-se project-authority-violations [--workspace <dir>] [--modules <path,path,...>] [--code-file <file>] [--authority-file <file>] [--output <file>] [--authority-output <file>] [--summary]\n`);
  stream.write(`  source-facts-se project-console-contract [--workspace <dir>] [--template-contract <file>] [--authority-file <file>] [--authority-complete <file>] [--binding <file>] [--violation-bindings <file>] [--strategy-doc <file>] [--output <file>] [--project] [--gate] [--write] [--summary]\n`);
  stream.write(`  source-facts-se govern [--workspace <dir> | --index <file>] [--authority-dir <dir>] [--reviews-dir <dir>] [--repository-id <id>] [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se propose-semantic-overlap --historical-authority-file <file> --successor-file <file> [--related-files <file,file,...>] [--succession-evidence <text>] [--output <file>]\n`);
  stream.write(`  source-facts-se console serve [--index <source-fact-index.json>] [--workspace <dir>] [--port <n>]\n`);
  stream.write(`  source-facts-se load-sqlserver --index <source-fact-index.json> (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]\n`);
  stream.write(`  source-facts-se ingest --workspace <dir> [--workspace-id <id>] [--output <file>] (--connection-env <ENV_VAR> | --server <host> [--database <name>]) [--summary]\n`);
  stream.write(`\n`);
  stream.write(`Examples:\n`);
  stream.write(`  source-facts-se project --workspace C:/lab/repos/contract-driven-artifact-governance-engine --pretty\n`);
  stream.write(`  source-facts-se query --index ./source-fact-index.json \"SELECT symbolId, name FROM symbols\"\n`);
  stream.write(`  source-facts-se web inventory --policy ./contracts/web-know.workspace.json --pretty --summary\n`);
  stream.write(`  source-facts-se web project --policy ./contracts/web-know.workspace.json --pretty --summary\n`);
  stream.write(`  source-facts-se web query --index ./web-surface-index.json \"SELECT familyId, entryRelativePath FROM webFamilies\"\n`);
  stream.write(`  source-facts-se web gallery project --index ./web-surface-index.json --inventory ./web-surface.inventory.json --query enterprise-pages --output ./enterprise-gallery --summary\n`);
  stream.write(`  source-facts-se web compose sign-in --request ./contracts/compositions/enterprise-learning-sign-in.request.v1.json --manifest ./sign-in-gallery/enterprise-gallery-manifest.json --output ./sign-in-composition --summary\n`);
  stream.write(`  source-facts-se web north-star sign-in --index ./web-surface-index.json --inventory ./web-surface.inventory.json --output ./sign-in-north-star --prove --summary\n`);
  stream.write(`  source-facts-se project-authority-violations --workspace ./src/console --authority-file ./contracts/serves-query-console.authority.json --output ./contracts/serves-query-console.candidates.json --authority-output ./contracts/serves-query-console.authority.draft.json --summary\n`);
  stream.write(`  source-facts-se project-console-contract --output ./contracts/serves-query-console.governed.contract.json --project --summary\n`);
  stream.write(`  source-facts-se project-console-contract --output ./contracts/serves-query-console.governed.contract.json --gate --summary\n`);
  stream.write(`  source-facts-se govern --workspace ./src --output ./source-facts-self-governance-report.json --summary\n`);
  stream.write(`  source-facts-se console serve --index ./source-fact-index.json --workspace ./src\n`);
  stream.write(`  source-facts-se load-sqlserver --index ./source-fact-index.json --connection-env source-facts-semantic-search-engine --summary\n`);
  stream.write(`  source-facts-se ingest --workspace ./src --workspace-id self --connection-env source-facts-semantic-search-engine --summary\n`);
}

function formatsGallerySummary(selection, plan) {
  const byDisposition = new Map();
  for (const item of plan.items) byDisposition.set(item.reproductionDisposition, (byDisposition.get(item.reproductionDisposition) ?? 0) + 1);
  const lines = [
    `Query rows: ${selection.queryEnvelope.rowCount}`,
    `Selected: ${selection.selectedCount}`,
    `Rejected: ${selection.rejectedCount}`,
    ...[...byDisposition.entries()].map(([disposition, count]) => `  ${disposition}: ${count}`),
  ];
  return `${lines.join("\n")}\n`;
}

function formatsNorthStarSummary(result) {
  const proof = result.report.gallery.proof;
  const lines = [
    `North star: ${result.report.disposition}`,
    `Gallery: ${result.report.gallery.rowCount} sign-in surface(s); ${result.report.gallery.selectedCount} selected; ${result.report.gallery.rejectedCount} rejected`,
    ...result.report.selectedAuthorities.map((authority) => `  ${authority.authorityKind}: ${authority.authorityId} <- ${authority.sourceRelativePath}`),
    `Compatibility: ${result.report.compatibility.disposition}; ${result.report.compatibility.satisfiedCount} satisfied; ${result.report.compatibility.failedCount} failed`,
    ...(proof === null ? [] : [`Playwright: ${proof.renderedCount}/${proof.receiptCount} rendered; ${proof.blockedCount} blocked`]),
    `Gallery serve: ${result.report.serveCommands.gallery}`,
    ...(result.report.serveCommands.candidate === null ? [] : [`Candidate serve: ${result.report.serveCommands.candidate}`]),
  ];
  return `${lines.join("\n")}\n`;
}

function normalizeLongOption(value) {
  const withPrefixRemoved = value.slice(2);
  return withPrefixRemoved.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}

function quoteSqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}
