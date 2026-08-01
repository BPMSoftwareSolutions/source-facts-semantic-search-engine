#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { projectSourceFactsWorkspace } from "./project.js";
import { executeRelationalQuery } from "./query.js";
import { validatesSourceFactIndex } from "./validate-index.js";
import { projectsWebSurfaceInventory } from "./web/inventory.js";
import { projectsWebSurfaceIndex } from "./web/project-web-surfaces.js";
import { validatesWebSurfaceInventory, validatesWebSurfaceIndex, validatesWebKnowWorkspace } from "./web/validate-web-index.js";

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

  const json = pretty
    ? JSON.stringify(index, null, 2)
    : JSON.stringify(index);
  await fs.writeFile(outputPath, json, "utf8");
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatSummary(index));
  }
}

async function runQuery(rawArgs) {
  const { flags, positional } = parseArgs(rawArgs);
  const indexPath = path.resolve(flags.index ?? path.join(process.cwd(), "source-fact-index.json"));
  const queryText = resolveQueryText(flags, positional);
  const index = JSON.parse(await fs.readFile(indexPath, "utf8"));
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
  } else {
    writeUsage(process.stderr);
    process.exitCode = 1;
  }
}

async function runWebInventory(rawArgs) {
  const { flags } = parseArgs(rawArgs);
  const policy = await readsPolicy(flags.policy);
  const outputPath = path.resolve(flags.output ?? path.join(process.cwd(), "web-surface.inventory.json"));
  const pretty = flags.pretty === true;

  const inventory = await projectsWebSurfaceInventory({ policy });
  await validatesWebSurfaceInventory(inventory);

  const json = pretty ? JSON.stringify(inventory, null, 2) : JSON.stringify(inventory);
  await fs.writeFile(outputPath, json, "utf8");
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
    ? JSON.parse(stripsByteOrderMark(await fs.readFile(path.resolve(flags.inventory), "utf8")))
    : undefined;

  const index = await projectsWebSurfaceIndex({ policy, inventory });
  await validatesWebSurfaceIndex(index);

  const json = pretty ? JSON.stringify(index, null, 2) : JSON.stringify(index);
  await fs.writeFile(outputPath, json, "utf8");
  process.stdout.write(`${outputPath}\n`);
  if (flags.summary === true) {
    process.stdout.write(formatWebIndexSummary(index));
  }
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
          flags[normalizeLongOption(current)] = next;
          index++;
          continue;
      }
    }
    switch (current) {
      case "--pretty":
      case "--summary":
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
  stream.write(`\n`);
  stream.write(`Examples:\n`);
  stream.write(`  source-facts-se project --workspace C:/lab/repos/contract-driven-artifact-governance-engine --pretty\n`);
  stream.write(`  source-facts-se query --index ./source-fact-index.json \"SELECT symbolId, name FROM symbols\"\n`);
  stream.write(`  source-facts-se web inventory --policy ./web-know.workspace.json --pretty --summary\n`);
  stream.write(`  source-facts-se web project --policy ./web-know.workspace.json --pretty --summary\n`);
}

function normalizeLongOption(value) {
  const withPrefixRemoved = value.slice(2);
  return withPrefixRemoved.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
