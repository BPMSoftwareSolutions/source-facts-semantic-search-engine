import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { projectsJsonWorkspace } from "./json-projector.js";
import { addSourceReference } from "./lib/source-reference.js";

const engineVersion = "0.2.0";
const indexSchemaVersion = "1.1.0";
const scannedSourceExtensions = Object.freeze([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts"]);
const ignoredDirectories = Object.freeze(new Set([".git", "node_modules", "dist", "release"]));
const scopeDeclarationKinds = Object.freeze(new Set(["function", "method", "constructor", "class", "interface"]));
let scannerRuntime;

export async function projectSourceFactsWorkspace(options) {
  const request = readsProjectRequest(options);
  const scanSourceCodeTaxonomy = await loadsScanner();
  const scan = await scanSourceCodeTaxonomy(request);
  const scanFacts = scan.facts;
  if (scanFacts.files.length === 0) {
    const hasSupportedFiles = await readsSourceFilePresence(request.workspaceRoot, new Set(scannedSourceExtensions));
    if (hasSupportedFiles) {
      throw new Error("scan returned 0 source files even though supported file extensions were present. check scanner profile and exclusion filters.");
    }
  }

  const workspaceRoot = request.workspaceRoot;
  const files = [];
  const symbols = [];
  const relationships = [];
  const dataflows = [];
  const sourceReferences = [];
  const documents = [];
  const governanceRules = [];
  const bodyMechanics = [];
  const referenceById = new Set();
  const declarationsByModule = new Map();
  const sourceTextCache = new Map();

  for (const file of scanFacts.files) {
    const sourceText = await readsSourceText(workspaceRoot, file.relativePath, sourceTextCache);
    const declarationRows = buildsDeclarationRows({
      relativePath: file.relativePath,
      declarations: file.declarations,
      sourceText,
    });

    files.push(Object.freeze({
      fileId: file.fileId,
      relativePath: file.relativePath,
      contentHash: file.contentHash,
      counts: Object.freeze({
        declarations: declarationRows.length,
        relationships: file.relationships.length,
        controlFlow: file.controlFlowFacts.length,
        syntax: file.syntaxFacts.length,
        unknownSyntax: file.unknownSyntax.length,
      }),
    }));

    for (const declaration of declarationRows) {
      const sourceReference = addSourceReference({
        kind: "declaration",
        sourceKind: declaration.sourceKind,
        location: declaration.location,
        modulePath: file.relativePath,
        sourceText,
        referenceById,
        sourceReferences,
      });
      symbols.push(Object.freeze({
        symbolId: declaration.symbolId,
        kind: declaration.kind,
        name: declaration.name,
        modulePath: file.relativePath,
        sourceReferenceId: sourceReference.referenceId,
        declarationLine: declaration.location.line,
        declarationColumn: declaration.location.column,
        declarationHeaderHash: declaration.headerHash,
        symbolVersionId: declaration.symbolVersionId,
        sourceKind: declaration.sourceKind,
        moduleHash: file.contentHash,
        scopeParts: declaration.scopeParts,
      }));
    }

    declarationsByModule.set(file.relativePath, declarationRows);

    for (const relationship of file.relationships) {
      const sourceReference = addSourceReference({
        kind: "relationship",
        sourceKind: relationship.sourceKind,
        location: relationship.location,
        modulePath: file.relativePath,
        sourceText,
        referenceById,
        sourceReferences,
      });
      const fromSymbolId = relationship.enclosingCallableStart === undefined
        ? null
        : declarationRows.find((declaration) => declaration.start === relationship.enclosingCallableStart)?.symbolId ?? null;
      relationships.push(Object.freeze({
        relationshipId: createSha256(`${file.fileId}\0${relationship.location.start}\0${relationship.kind}\0${relationship.name ?? ""}`),
        relationshipKind: relationship.kind,
        sourceReferenceId: sourceReference.referenceId,
        fromSymbolId,
        fromSymbolResolution: fromSymbolId === null ? "unresolved" : "enclosing-callable",
        toSymbolId: null,
        toSymbolCandidate: relationship.name ?? null,
        operator: relationship.operator ?? null,
      }));
      const relationshipRow = relationships[relationships.length - 1];
      bodyMechanics.push(...projectsRelationshipMechanics(relationshipRow, file.relativePath));
    }

    for (const control of file.controlFlowFacts) {
      const sourceReference = addSourceReference({
        kind: "control-flow",
        sourceKind: control.sourceKind,
        location: control.location,
        modulePath: file.relativePath,
        sourceText,
        referenceById,
        sourceReferences,
      });
      bodyMechanics.push(...projectsControlMechanics({
        control,
        modulePath: file.relativePath,
        sourceReferenceId: sourceReference.referenceId,
        fromSymbolId: control.enclosingCallableStart === undefined
          ? null
          : declarationRows.find((declaration) => declaration.start === control.enclosingCallableStart)?.symbolId ?? null,
      }));
    }

    for (const syntax of file.syntaxFacts) {
      addSourceReference({
        kind: "syntax",
        sourceKind: syntax.sourceKind,
        location: syntax.location,
        modulePath: file.relativePath,
        sourceText,
        referenceById,
        sourceReferences,
      });
    }

    for (const unknown of file.unknownSyntax) {
      addSourceReference({
        kind: "unknown",
        sourceKind: unknown.location.sourceKind ?? unknown.sourceKind ?? "Unknown",
        location: unknown.location,
        modulePath: file.relativePath,
        sourceText,
        referenceById,
        sourceReferences,
      });
    }
  }

  const jsonDocuments = await projectsJsonWorkspace(workspaceRoot);
  for (const document of jsonDocuments) {
    const projected = projectsDocumentFacts({ document, referenceById, sourceReferences });
    documents.push(...projected.facts);
    governanceRules.push(...projectsGovernanceRules(document, projected.factsByPointer));
  }

  const totalUnknown = files.reduce((sum, file) => sum + file.counts.unknownSyntax, 0);
  const totalDeclarations = files.reduce((sum, file) => sum + file.counts.declarations, 0);
  const totalRelationships = files.reduce((sum, file) => sum + file.counts.relationships, 0);
  const totalControlFlow = files.reduce((sum, file) => sum + file.counts.controlFlow, 0);
  const totalSyntax = files.reduce((sum, file) => sum + file.counts.syntax, 0);
  const totalObservedFacts = totalDeclarations + totalRelationships + totalControlFlow + totalSyntax + totalUnknown;
  const totalDocuments = documents.length;
  const documentRootHash = `sha256:${createSha256(jsonDocuments.map((document) => `${document.relativePath}\0${document.contentHash}\0`).join(""))}`;
  const workspaceRootHash = `sha256:${createSha256(`${scanFacts.workspace.rootHash}\0${documentRootHash}`)}`;

  const indexType = "source-fact-index.v1";
  return Object.freeze({
    indexType,
    indexId: `sha256:${createSha256(`${indexType}\0${indexSchemaVersion}\0${engineVersion}\0${request.workspaceId}\0${scan.scanId}\0${workspaceRootHash}`)}`,
    manifest: Object.freeze({
      schemaVersion: indexSchemaVersion,
      engine: "source-facts-semantic-search-engine",
      engineVersion,
      scanId: scan.scanId,
      documentRootHash,
      scanRequest: Object.freeze({ ...request, languageId: scanFacts.language.languageId }),
    }),
    workspace: Object.freeze({
      workspaceId: request.workspaceId,
      rootHash: workspaceRootHash,
      languageId: scanFacts.language.languageId,
      languageProfileVersion: scanFacts.language.profileVersion,
    }),
    files: Object.freeze(files),
    symbols: Object.freeze(symbols),
    relationships: Object.freeze(relationships),
    dataflows: Object.freeze(dataflows),
    sourceReferences: Object.freeze(sourceReferences),
    documents: Object.freeze(documents),
    governanceRules: Object.freeze(governanceRules),
    bodyMechanics: Object.freeze(bodyMechanics),
    coverage: Object.freeze({
      filesObserved: files.length,
      declarations: totalDeclarations,
      relationships: totalRelationships,
      controlFlow: totalControlFlow,
      syntax: totalSyntax,
      unknownSyntax: totalUnknown,
      documentFacts: totalDocuments,
      governanceRules: governanceRules.length,
      bodyMechanics: bodyMechanics.length,
      unknownSyntaxRatio: totalObservedFacts === 0 ? 0 : totalUnknown / totalObservedFacts,
    }),
  });
}

async function loadsScanner() {
  if (scannerRuntime !== undefined) return scannerRuntime;
  const require = createRequire(import.meta.url);
  const packageRoots = deduceScannerPackageRoots(require);
  const candidates = [
    path.join("dist", "index.js"),
    path.join("index.js"),
    path.join("src", "index.js"),
    path.join("src", "index.ts"),
  ];
  for (const packageRoot of packageRoots) {
    for (const candidate of candidates) {
      try {
        const moduleUrl = pathToFileURL(path.join(packageRoot, candidate));
        const scanner = await import(moduleUrl);
        if (typeof scanner.scanSourceCodeTaxonomy === "function") {
          scannerRuntime = scanner.scanSourceCodeTaxonomy;
          return scannerRuntime;
        }
      } catch {
        // continue trying fallback module paths
      }
    }
  }
  throw new Error("Unable to load source-code-taxonomy scanner entrypoint.");
}

function deduceScannerPackageRoots(require) {
  const packageRoots = new Set();
  const cwd = path.resolve(process.cwd());
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  packageRoots.add(path.join(cwd, "node_modules", "@deterministic-solutions", "source-code-taxonomy-scanner"));
  packageRoots.add(path.join(path.dirname(cwd), "node_modules", "@deterministic-solutions", "source-code-taxonomy-scanner"));
  packageRoots.add(path.join(scriptDir, "..", "node_modules", "@deterministic-solutions", "source-code-taxonomy-scanner"));
  packageRoots.add(path.join(path.dirname(scriptDir), "source-code-taxonomy-scanner"));
  try {
    const packagePath = require.resolve("@deterministic-solutions/source-code-taxonomy-scanner/package.json");
    packageRoots.add(path.dirname(packagePath));
  } catch {
    // fallback roots are enough for local workspaces and direct package consumption
  }
  return [...packageRoots];
}

function buildsDeclarationRows({ relativePath, declarations, sourceText }) {
  const declarationRecords = declarations
    .filter((declaration) => typeof declaration.name === "string" && declaration.name.length > 0)
    .map((declaration) => ({
      kind: declaration.kind,
      name: declaration.name,
      sourceKind: declaration.sourceKind,
      start: declaration.location.start,
      end: declaration.location.start + declaration.location.length,
      location: declaration.location,
      enclosingDeclarationStart: declaration.enclosingDeclarationStart ?? null,
    }))
    .sort((left, right) => (left.start - right.start) || (left.end - right.end));

  const declarationByStart = new Map(declarationRecords.map((declaration) => [declaration.start, declaration]));
  const scopePartsByStart = new Map();
  const resolvesScopeParts = (declaration, visited = new Set()) => {
    if (scopePartsByStart.has(declaration.start)) return scopePartsByStart.get(declaration.start);
    if (declaration.enclosingDeclarationStart === null || visited.has(declaration.start)) return [];
    const parent = declarationByStart.get(declaration.enclosingDeclarationStart);
    if (parent === undefined) return [];
    visited.add(declaration.start);
    const parts = [...resolvesScopeParts(parent, visited), `${parent.kind}:${normalizesLogicalName(parent.name)}`];
    scopePartsByStart.set(declaration.start, parts);
    return parts;
  };
  const identityOrdinals = new Map();
  const declarationRows = [];
  for (const declaration of declarationRecords) {
    const scopeParts = resolvesScopeParts(declaration);
    const scopePath = scopeParts.length === 0 ? "" : `${scopeParts.join("/")}/`;
    const declarationText = sourceText.slice(declaration.start, declaration.end);
    const headerHash = createSha256(normalizeForHeaderDigest(extractDeclarationHeader(declarationText, declaration.kind)));
    const logicalName = normalizesLogicalName(declaration.name);
    const logicalKey = `${relativePath}#${declaration.kind}:${scopePath}${logicalName}`;
    const ordinal = (identityOrdinals.get(logicalKey) ?? 0) + 1;
    identityOrdinals.set(logicalKey, ordinal);
    const symbolId = ordinal === 1 ? logicalKey : `${logicalKey}~${ordinal}`;
    const row = Object.freeze({
      kind: declaration.kind,
      name: declaration.name,
      sourceKind: declaration.sourceKind,
      start: declaration.start,
      end: declaration.end,
      location: declaration.location,
      scopeParts: Object.freeze(scopeParts),
      headerHash,
      symbolId,
      symbolVersionId: `sha256:${createSha256(`${symbolId}\0${headerHash}`)}`,
    });
    declarationRows.push(row);
  }
  return declarationRows;
}

function normalizesLogicalName(name) {
  return name.replace(/\s+/gu, "");
}

function normalizeForHeaderDigest(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n\r]*/g, "").replace(/\s+/g, "");
}

function extractDeclarationHeader(text, kind) {
  if (!scopeDeclarationKinds.has(kind)) return text;
  const bodyStart = text.indexOf("{");
  return bodyStart === -1 ? text : text.slice(0, bodyStart);
}

function projectsDocumentFacts({ document, referenceById, sourceReferences }) {
  const facts = [];
  const factsByPointer = new Map();
  for (const node of document.nodes) {
    const sourceReference = addSourceReference({
      kind: "structured-data",
      sourceKind: node.sourceKind,
      location: node,
      modulePath: document.relativePath,
      sourceText: document.text,
      referenceById,
      sourceReferences,
    });
    const value = readsJsonPointer(document.rootValue, node.jsonPointer);
    const documentFactId = createSha256(`${document.relativePath}\0${node.jsonPointer}\0${node.valueType}`);
    const fact = Object.freeze({
      documentFactId,
      documentFactVersionId: `sha256:${createSha256(`${documentFactId}\0${JSON.stringify(value)}`)}`,
      relativePath: document.relativePath,
      pointer: node.jsonPointer,
      valueType: node.valueType,
      valuePreview: summarizeJsonValue(value),
      valuePath: Object.freeze(readsJsonPointerParts(node.jsonPointer)),
      ...(node.valueType === "object" || node.valueType === "array" ? {} : { value: node.value }),
      sourceReferenceId: sourceReference.referenceId,
    });
    facts.push(fact);
    factsByPointer.set(node.jsonPointer, fact);
  }
  return Object.freeze({ facts: Object.freeze(facts), factsByPointer });
}

function projectsGovernanceRules(document, factsByPointer) {
  const rules = [];
  visitsJson(document.rootValue, "", (candidate, pointer) => {
    if (
      candidate === null
      || typeof candidate !== "object"
      || Array.isArray(candidate)
      || !Array.isArray(candidate.forbiddenExecutableMechanics)
      || typeof candidate.executionPortEffect !== "string"
    ) return;
    for (let index = 0; index < candidate.forbiddenExecutableMechanics.length; index++) {
      const mechanic = candidate.forbiddenExecutableMechanics[index];
      if (typeof mechanic !== "string") continue;
      const itemPointer = `${pointer}/forbiddenExecutableMechanics/${index}`;
      const sourceFact = factsByPointer.get(itemPointer);
      if (sourceFact === undefined) continue;
      rules.push(Object.freeze({
        ruleId: createSha256(`${document.relativePath}\0${itemPointer}\0${mechanic}`),
        ruleType: "forbidden-executable-mechanic",
        profilePath: document.relativePath,
        policyPointer: pointer,
        profileType: candidate.profileType ?? null,
        applicability: candidate.applicability ?? null,
        executionPortEffect: candidate.executionPortEffect,
        semanticAuthorityLocation: candidate.semanticAuthorityLocation ?? null,
        mechanic,
        sourceReferenceId: sourceFact.sourceReferenceId,
      }));
    }
  });
  return rules;
}

function visitsJson(value, pointer, visitor) {
  visitor(value, pointer);
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) visitsJson(value[index], `${pointer}/${index}`, visitor);
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    visitsJson(child, `${pointer}/${escapeJsonPointerToken(key)}`, visitor);
  }
}

function projectsRelationshipMechanics(relationship, modulePath) {
  const mechanics = [];
  if (relationship.relationshipKind === "object-construction") mechanics.push("object-construction");
  if (relationship.relationshipKind === "binary-operation") {
    if (relationship.operator === "BarBarToken" || relationship.operator === "QuestionQuestionToken") mechanics.push("fallback");
    if (relationship.operator?.includes("Assignment") || relationship.operator === "EqualsToken") mechanics.push("state-mutation");
  }
  if (relationship.relationshipKind === "invocation" && typeof relationship.toSymbolCandidate === "string") {
    const candidate = relationship.toSymbolCandidate.toLowerCase();
    if (/stringify|serializ|tojson/u.test(candidate)) mechanics.push("serialization");
    if (/normaliz|canonicaliz/u.test(candidate)) mechanics.push("normalization");
    if (/validat|assert/u.test(candidate)) mechanics.push("validation");
    if (/retry/u.test(candidate)) mechanics.push("retry");
  }
  return mechanics.map((mechanic) => createsBodyMechanic({
    mechanic,
    modulePath,
    sourceReferenceId: relationship.sourceReferenceId,
    fromSymbolId: relationship.fromSymbolId,
    evidenceKind: relationship.relationshipKind,
  }));
}

function projectsControlMechanics({ control, modulePath, sourceReferenceId, fromSymbolId }) {
  const mechanics = [];
  if (control.kind === "condition" || control.kind === "branch") mechanics.push("branch");
  if (control.kind === "loop") mechanics.push("iteration");
  if (control.kind === "exception-boundary" || control.kind === "catch-boundary") mechanics.push("exception-handling");
  if (control.kind === "throw") mechanics.push("throw");
  return mechanics.map((mechanic) => createsBodyMechanic({
    mechanic,
    modulePath,
    sourceReferenceId,
    fromSymbolId,
    evidenceKind: control.kind,
  }));
}

function createsBodyMechanic({ mechanic, modulePath, sourceReferenceId, fromSymbolId, evidenceKind }) {
  return Object.freeze({
    mechanicId: createSha256(`${modulePath}\0${sourceReferenceId}\0${mechanic}`),
    mechanic,
    modulePath,
    sourceReferenceId,
    fromSymbolId,
    evidenceKind,
    classification: "syntax-derived-candidate",
    verificationDisposition: "OBSERVED_NOT_EVALUATED",
  });
}

function summarizeJsonValue(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(${value.length})`;
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.length <= 160 ? value : `${value.slice(0, 157)}...`;
  if (typeof value === "object") return `object(${Object.keys(value).length})`;
  return String(value);
}

function escapeJsonPointerToken(value) {
  return String(value).replace(/~/g, "~0").replace(/\//g, "~1");
}

function readsJsonPointer(root, pointer) {
  let value = root;
  for (const part of readsJsonPointerParts(pointer)) value = value?.[part];
  return value;
}

function readsJsonPointerParts(pointer) {
  if (pointer === "") return [];
  return pointer.slice(1).split("/").map((part) => part.replace(/~1/gu, "/").replace(/~0/gu, "~"));
}

async function readsSourceFilePresence(workspaceRoot, expectedExtensions) {
  const root = path.resolve(workspaceRoot);
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name)) continue;
        stack.push(path.join(current, entry.name));
        continue;
      }
      if (!entry.isFile()) continue;
      const extension = path.extname(entry.name).toLowerCase();
      if (expectedExtensions.has(extension)) return true;
    }
  }
  return false;
}

async function readsSourceText(workspaceRoot, relativePath, cache) {
  const cached = cache.get(relativePath);
  if (cached !== undefined) return cached;
  const root = path.resolve(workspaceRoot);
  const target = path.resolve(root, ...relativePath.split("/"));
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Source path escapes the authorized workspace.");
  }
  const sourceText = await readFile(target, "utf8");
  cache.set(relativePath, sourceText);
  return sourceText;
}

function readsProjectRequest(options) {
  if (typeof options.workspaceRoot !== "string" || options.workspaceRoot.trim().length === 0) {
    throw new Error("workspace is required.");
  }
  const workspaceRoot = path.resolve(options.workspaceRoot);
  return Object.freeze({
    workspaceId: options.workspaceId ?? path.basename(workspaceRoot),
    workspaceRoot,
  });
}

function createSha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
