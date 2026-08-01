#!/usr/bin/env node
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const cwd = path.resolve(process.cwd());

const scannerRoots = deduceScannerPackageRoots(cwd, require);
let scannerLoaded = false;
for (const scannerRoot of scannerRoots) {
  for (const candidate of [
    path.join(scannerRoot, "dist", "index.js"),
    path.join(scannerRoot, "index.js"),
    path.join(scannerRoot, "src", "index.js"),
    path.join(scannerRoot, "src", "index.ts"),
  ]) {
    try {
      const scanner = await import(pathToFileURL(candidate));
      if (typeof scanner.scanSourceCodeTaxonomy === "function") {
        scannerLoaded = true;
        break;
      }
    } catch {
      // continue probing
    }
  }
}

const queryRoots = deduceSejPackageRoots(cwd, require);
let queryLoaded = false;
for (const queryRoot of queryRoots) {
  for (const candidate of [
    path.join(queryRoot, "dist", "composition-root", "starts-query-engine.js"),
    path.join(queryRoot, "composition-root", "starts-query-engine.js"),
  ]) {
    try {
      const module = await import(pathToFileURL(candidate));
      if (typeof module.startsQueryEngine === "function") {
        const runtime = module.startsQueryEngine({ capabilityPacks: [], portAdapters: {} });
        if (runtime?.engine?.invoke && typeof runtime.engine.invoke === "function") {
          queryLoaded = true;
          break;
        }
      }
    } catch {
      // continue probing
    }
  }
}

if (!scannerLoaded || !queryLoaded) {
  const failed = [];
  if (!scannerLoaded) failed.push("@deterministic-solutions/source-code-taxonomy-scanner");
  if (!queryLoaded) failed.push("@deterministic-solutions/sej-runtime-query");
  throw new Error(`Unable to load production dependencies: ${failed.join(", ")}`);
}

console.log("dependencies resolved");

function deduceScannerPackageRoots(cwd, require) {
  const roots = new Set();
  roots.add(path.join(cwd, "node_modules", "@deterministic-solutions", "source-code-taxonomy-scanner"));
  roots.add(path.join(path.dirname(cwd), "node_modules", "@deterministic-solutions", "source-code-taxonomy-scanner"));
  roots.add(path.join(path.dirname(cwd), "source-code-taxonomy-scanner"));
  roots.add(path.join(cwd, "source-code-taxonomy-scanner"));
  try {
    const packagePath = require.resolve("@deterministic-solutions/source-code-taxonomy-scanner/package.json");
    roots.add(path.dirname(packagePath));
  } catch {
    // fallback roots will be tried above
  }
  return [...roots];
}

function deduceSejPackageRoots(cwd, require) {
  const roots = new Set();
  roots.add(path.join(cwd, "node_modules", "@deterministic-solutions", "sej-runtime-query"));
  roots.add(path.join(path.dirname(cwd), "node_modules", "@deterministic-solutions", "sej-runtime-query"));
  roots.add(path.join(path.dirname(cwd), "sej-runtime-query"));
  roots.add(path.join(cwd, "sej-runtime-query"));
  try {
    const packagePath = require.resolve("@deterministic-solutions/sej-runtime-query/package.json");
    roots.add(path.dirname(packagePath));
  } catch {
    // fallback roots will be tried above
  }
  return [...roots];
}
