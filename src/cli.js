#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { projectSourceFactsWorkspace } from "./project.js";
import { executeRelationalQuery } from "./query.js";
import { validatesSourceFactIndex } from "./validate-index.js";

const args = process.argv.slice(2);
const command = args[0];

if (command === "project") {
  await runProject(args.slice(1));
} else if (command === "query") {
  await runQuery(args.slice(1));
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
  stream.write(`\n`);
  stream.write(`Examples:\n`);
  stream.write(`  source-facts-se project --workspace C:/lab/repos/contract-driven-artifact-governance-engine --pretty\n`);
  stream.write(`  source-facts-se query --index ./source-fact-index.json \"SELECT symbolId, name FROM symbols\"\n`);
}

function normalizeLongOption(value) {
  const withPrefixRemoved = value.slice(2);
  return withPrefixRemoved.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}
