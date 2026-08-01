#!/usr/bin/env node
import fs from "node:fs/promises";
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

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const command = args[0];

if (command === "project") {
  await runProject(args.slice(1));
} else if (command === "query") {
  await runQuery(args.slice(1));
} else if (command === "web") {
  await runWeb(args.slice(1));
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
    throw new Error("--policy <web-know.workspace.json> is required.");
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
          flags[normalizeLongOption(current)] = next;
          index++;
          continue;
      }
    }
    switch (current) {
      case "--pretty":
      case "--summary":
      case "--prove":
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
  stream.write(`  source-facts-se web inventory --policy <web-know.workspace.json> [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se web project --policy <web-know.workspace.json> [--inventory <file>] [--output <file>] [--pretty] [--summary]\n`);
  stream.write(`  source-facts-se web query [--index <file>] --query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se web query \"<sql>\" [--pretty]\n`);
  stream.write(`  source-facts-se web gallery plan [--index <file>] [--inventory <file>] [--query <saved-query-id>] [--policy <policy-id-or-file>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web gallery project [--index <file>] [--inventory <file>] [--query <saved-query-id>] [--policy <policy-id-or-file>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web gallery serve --dir <gallery-output-dir>\n`);
  stream.write(`  source-facts-se web gallery prove --dir <gallery-output-dir>\n`);
  stream.write(`  source-facts-se web compose sign-in --request <file> --manifest <gallery-manifest> [--authorities <dir>] [--output <dir>] [--summary]\n`);
  stream.write(`  source-facts-se web north-star sign-in [--index <file>] [--inventory <file>] [--request <file>] [--layout <id-or-source>] [--authentication-entry <id-or-source>] [--messaging <id-or-source>] [--theme <id-or-source>] [--output <dir>] [--prove] [--summary]\n`);
  stream.write(`\n`);
  stream.write(`Examples:\n`);
  stream.write(`  source-facts-se project --workspace C:/lab/repos/contract-driven-artifact-governance-engine --pretty\n`);
  stream.write(`  source-facts-se query --index ./source-fact-index.json \"SELECT symbolId, name FROM symbols\"\n`);
  stream.write(`  source-facts-se web inventory --policy ./web-know.workspace.json --pretty --summary\n`);
  stream.write(`  source-facts-se web project --policy ./web-know.workspace.json --pretty --summary\n`);
  stream.write(`  source-facts-se web query --index ./web-surface-index.json \"SELECT familyId, entryRelativePath FROM webFamilies\"\n`);
  stream.write(`  source-facts-se web gallery project --index ./web-surface-index.json --inventory ./web-surface.inventory.json --query enterprise-pages --output ./enterprise-gallery --summary\n`);
  stream.write(`  source-facts-se web compose sign-in --request ./compositions/enterprise-sign-in.request.v1.json --manifest ./sign-in-gallery/enterprise-gallery-manifest.json --output ./sign-in-composition --summary\n`);
  stream.write(`  source-facts-se web north-star sign-in --index ./web-surface-index.json --inventory ./web-surface.inventory.json --output ./sign-in-north-star --prove --summary\n`);
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
