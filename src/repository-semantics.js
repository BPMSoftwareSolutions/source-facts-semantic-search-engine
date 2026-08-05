import { createHash } from "node:crypto";
import { verifiesRepositoryImage } from "./repository-image.js";

const analyzerVersion = "0.1.0";

export function projectsRepositorySemanticAnalysis(image) {
  verifiesRepositoryImage(image);
  const coverage = [];
  const facts = [];
  for (const artifact of image.artifacts) {
    const result = analyzesArtifact(artifact);
    const artifactFacts = result.facts.map((fact, ordinal) => freezesFact({
      rootId: image.rootId,
      relativePath: artifact.relativePath,
      ordinal,
      ...fact,
    }));
    facts.push(...artifactFacts);
    coverage.push(Object.freeze({
      relativePath: artifact.relativePath,
      contentDigest: artifact.contentDigest,
      mediaType: artifact.mediaType,
      artifactClass: artifact.artifactClass,
      analyzerId: result.analyzerId,
      analysisDisposition: result.analysisDisposition,
      factCount: artifactFacts.length,
      diagnostic: result.diagnostic ?? null,
    }));
  }
  const summary = Object.freeze({
    artifactsAnalyzed: coverage.length,
    semanticFacts: facts.length,
    byDisposition: countsBy(coverage, "analysisDisposition"),
    byAnalyzer: countsBy(coverage, "analyzerId"),
    byFactKind: countsBy(facts, "factKind"),
  });
  const authority = {
    analysisType: "repository-semantic-analysis.v1",
    analyzerVersion,
    rootId: image.rootId,
    imageDigest: image.imageDigest,
    coverage,
    facts,
    summary,
  };
  return Object.freeze({ ...authority, analysisDigest: digest(authority) });
}

export function verifiesRepositorySemanticAnalysis(analysis) {
  if (analysis?.analysisType !== "repository-semantic-analysis.v1") throw new Error("A repository-semantic-analysis.v1 payload is required.");
  if (!Array.isArray(analysis.coverage) || !Array.isArray(analysis.facts)) throw new Error("Repository semantic coverage and facts are required.");
  if (analysis.coverage.length !== analysis.summary?.artifactsAnalyzed) throw new Error("Repository semantic artifact coverage count is invalid.");
  if (analysis.facts.length !== analysis.summary?.semanticFacts) throw new Error("Repository semantic fact count is invalid.");
  const paths = new Set();
  for (const row of analysis.coverage) {
    if (paths.has(row.relativePath)) throw new Error(`Duplicate semantic coverage path '${row.relativePath}'.`);
    paths.add(row.relativePath);
  }
  for (const fact of analysis.facts) {
    if (!paths.has(fact.relativePath)) throw new Error(`Semantic fact '${fact.factId}' has no artifact coverage row.`);
    if (fact.factId !== factIdOf(fact)) throw new Error(`Semantic fact '${fact.factId}' has an invalid identity.`);
  }
  const { analysisDigest: _analysisDigest, ...authority } = analysis;
  if (digest(authority) !== analysis.analysisDigest) throw new Error("Repository semantic analysis digest is invalid.");
  return analysis;
}

function analyzesArtifact(artifact) {
  if (artifact.artifactType === "symbolic-link") return exactOnly("symbolic-link-reference.v1", "EXACT_CONTENT_ONLY");
  if (artifact.encoding !== "utf-8") return exactOnly("binary-content.v1", "BINARY_CONTENT");
  const text = Buffer.from(artifact.contentBase64, "base64").toString("utf8");
  if (artifact.relativePath === "package.json") return analyzesPackageManifest(text);
  if (artifact.relativePath === "package-lock.json") return analyzesPackageLock(text);
  switch (artifact.mediaType) {
    case "application/json": return analyzesJson(text);
    case "application/sql": return analyzesSql(text);
    case "text/x-gherkin": return analyzesGherkin(text);
    case "text/markdown": return analyzesMarkdown(text);
    case "text/javascript":
    case "text/typescript": return {
      analyzerId: "source-fact-engine-delegation.v1",
      analysisDisposition: "DELEGATED_TO_SOURCE_FACT_ENGINE",
      facts: [{ factKind: "source-module", name: artifact.relativePath, value: null, line: 1, column: 1, detail: { contentDigest: artifact.contentDigest } }],
    };
    default: return exactOnly("exact-text-content.v1", "EXACT_CONTENT_ONLY");
  }
}

function analyzesPackageManifest(text) {
  return analyzesParsedJson(text, "package-manifest.v1", (document) => {
    const facts = [];
    for (const property of ["name", "version", "type", "private", "description"]) {
      if (document[property] !== undefined) facts.push(jsonFact("package-property", property, document[property], `/${property}`));
    }
    for (const [name, command] of Object.entries(document.scripts ?? {})) facts.push(jsonFact("runtime-script", name, command, `/scripts/${escapesPointer(name)}`));
    for (const [engine, constraint] of Object.entries(document.engines ?? {})) facts.push(jsonFact("runtime-engine", engine, constraint, `/engines/${escapesPointer(engine)}`));
    for (const scope of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
      for (const [name, constraint] of Object.entries(document[scope] ?? {})) {
        facts.push(jsonFact("runtime-dependency", name, constraint, `/${scope}/${escapesPointer(name)}`, { dependencyScope: scope }));
      }
    }
    for (const [name, target] of Object.entries(typeof document.bin === "string" ? { [document.name ?? "default"]: document.bin } : document.bin ?? {})) {
      facts.push(jsonFact("executable-entrypoint", name, target, `/bin/${escapesPointer(name)}`));
    }
    return facts;
  });
}

function analyzesPackageLock(text) {
  return analyzesParsedJson(text, "package-lock.v1", (document) => {
    const facts = [jsonFact("lockfile-version", "lockfileVersion", document.lockfileVersion, "/lockfileVersion")];
    for (const [packagePath, entry] of Object.entries(document.packages ?? {})) {
      facts.push(jsonFact("locked-package", packagePath || ".", entry.version ?? null, `/packages/${escapesPointer(packagePath)}`, {
        resolved: entry.resolved ?? null,
        integrity: entry.integrity ?? null,
        link: entry.link === true,
      }));
    }
    return facts;
  });
}

function analyzesJson(text) {
  return analyzesParsedJson(text, "json-pointer-scalars.v1", (document) => {
    const facts = [];
    visitsJson(document, "", (value, pointer) => {
      if (value === null || typeof value !== "object") facts.push(jsonFact("json-scalar", pointer || "/", value, pointer || "/"));
    });
    return facts;
  });
}

function analyzesParsedJson(text, analyzerId, projector) {
  try {
    return { analyzerId, analysisDisposition: "SEMANTIC_FACTS_PROJECTED", facts: projector(JSON.parse(text)) };
  } catch (error) {
    return { analyzerId, analysisDisposition: "ANALYZER_FAILED", facts: [], diagnostic: error instanceof Error ? error.message : String(error) };
  }
}

function analyzesGherkin(text) {
  const facts = [];
  const pendingAnchors = [];
  for (const [index, lineText] of linesOf(text).entries()) {
    const trimmed = lineText.trim();
    const anchor = trimmed.match(/^&([a-z]+):(.+)$/u);
    if (anchor) {
      pendingAnchors.push({ kind: anchor[1], id: anchor[2] });
      facts.push({ factKind: "gherkin-anchor", name: anchor[1], value: anchor[2], line: index + 1, column: lineText.indexOf("&") + 1, detail: null });
      continue;
    }
    const declaration = trimmed.match(/^(Feature|Scenario(?: Outline)?|Background):\s*(.+)$/u);
    if (declaration) {
      const kind = declaration[1].startsWith("Scenario") ? "gherkin-scenario" : declaration[1] === "Feature" ? "gherkin-feature" : "gherkin-background";
      facts.push({ factKind: kind, name: pendingAnchors.findLast((entry) => kind.endsWith(entry.kind))?.id ?? declaration[2], value: declaration[2], line: index + 1, column: lineText.indexOf(declaration[1]) + 1, detail: { anchors: [...pendingAnchors] } });
      pendingAnchors.length = 0;
      continue;
    }
    const step = trimmed.match(/^(Given|When|Then|And|But)\s+(.+)$/u);
    if (step) {
      facts.push({ factKind: "gherkin-step", name: pendingAnchors.at(-1)?.id ?? `${step[1].toLowerCase()}-${index + 1}`, value: step[2], line: index + 1, column: lineText.indexOf(step[1]) + 1, detail: { keyword: step[1], anchors: [...pendingAnchors] } });
      pendingAnchors.length = 0;
    }
  }
  return { analyzerId: "gherkin-authority.v1", analysisDisposition: "SEMANTIC_FACTS_PROJECTED", facts };
}

function analyzesMarkdown(text) {
  const facts = [];
  let activeFence = null;
  for (const [index, lineText] of linesOf(text).entries()) {
    const fence = lineText.match(/^\s*(```+|~~~+)\s*([^\s]*)/u);
    if (fence) {
      if (activeFence === null) {
        activeFence = { marker: fence[1][0], startLine: index + 1, language: fence[2] || null };
      } else if (fence[1][0] === activeFence.marker) {
        facts.push({ factKind: "markdown-code-block", name: activeFence.language ?? "plain", value: null, line: activeFence.startLine, column: 1, detail: { language: activeFence.language, endLine: index + 1 } });
        activeFence = null;
      }
      continue;
    }
    if (activeFence !== null) continue;
    const heading = lineText.match(/^(#{1,6})\s+(.+)$/u);
    if (heading) facts.push({ factKind: "markdown-heading", name: heading[2].trim(), value: null, line: index + 1, column: 1, detail: { level: heading[1].length } });
    for (const link of lineText.matchAll(/\[([^\]]+)\]\(([^)]+)\)/gu)) {
      facts.push({ factKind: "markdown-link", name: link[1], value: link[2], line: index + 1, column: (link.index ?? 0) + 1, detail: null });
    }
  }
  if (activeFence !== null) return { analyzerId: "markdown-structure.v1", analysisDisposition: "ANALYZER_FAILED", facts, diagnostic: `Unterminated code fence at line ${activeFence.startLine}.` };
  return { analyzerId: "markdown-structure.v1", analysisDisposition: "SEMANTIC_FACTS_PROJECTED", facts };
}

function analyzesSql(text) {
  const facts = [];
  const code = masksSqlNonCode(text);
  const lines = linesOf(code);
  let batchOrdinal = 0;
  lines.forEach((lineText, index) => {
    if (/^\s*GO(?:\s+\d+)?\s*(?:--.*)?$/iu.test(lineText)) {
      facts.push({ factKind: "sql-batch-boundary", name: `batch-${batchOrdinal}`, value: null, line: index + 1, column: 1, detail: { batchOrdinal } });
      batchOrdinal++;
    }
  });
  const declarationPattern = /\bCREATE\s+(?:OR\s+ALTER\s+)?(PROCEDURE|PROC|TABLE|VIEW|FUNCTION|TRIGGER|SCHEMA|INDEX)\s+((?:\[[^\]]+\]|[A-Za-z0-9_.$#-]+)(?:\.(?:\[[^\]]+\]|[A-Za-z0-9_.$#-]+))?)/giu;
  for (const match of code.matchAll(declarationPattern)) {
    const position = positionOf(text, match.index ?? 0);
    facts.push({ factKind: "sql-object-declaration", name: normalizesSqlIdentifier(match[2]), value: match[1].toLowerCase(), ...position, detail: { objectKind: match[1].toLowerCase() } });
  }
  const referencePattern = /\b(FROM|JOIN|INTO|UPDATE|MERGE\s+INTO|REFERENCES|EXEC(?:UTE)?)\s+((?:\[[^\]]+\]|[A-Za-z0-9_.$#-]+)(?:\.(?:\[[^\]]+\]|[A-Za-z0-9_.$#-]+))?)/giu;
  for (const match of code.matchAll(referencePattern)) {
    const position = positionOf(text, match.index ?? 0);
    facts.push({ factKind: "sql-object-reference", name: normalizesSqlIdentifier(match[2]), value: match[1].toLowerCase().replace(/\s+/gu, "-"), ...position, detail: { operation: match[1].toLowerCase() } });
  }
  return { analyzerId: "sql-server-structure.v1", analysisDisposition: "SEMANTIC_FACTS_PROJECTED", facts };
}

function masksSqlNonCode(text) {
  const characters = text.split("");
  let index = 0;
  let blockCommentDepth = 0;
  while (index < characters.length) {
    if (blockCommentDepth > 0) {
      if (characters[index] === "/" && characters[index + 1] === "*") {
        characters[index++] = " ";
        characters[index++] = " ";
        blockCommentDepth++;
      } else if (characters[index] === "*" && characters[index + 1] === "/") {
        characters[index++] = " ";
        characters[index++] = " ";
        blockCommentDepth--;
      } else {
        if (characters[index] !== "\r" && characters[index] !== "\n") characters[index] = " ";
        index++;
      }
      continue;
    }
    if (characters[index] === "-" && characters[index + 1] === "-") {
      while (index < characters.length && characters[index] !== "\r" && characters[index] !== "\n") characters[index++] = " ";
      continue;
    }
    if (characters[index] === "/" && characters[index + 1] === "*") {
      characters[index++] = " ";
      characters[index++] = " ";
      blockCommentDepth = 1;
      continue;
    }
    if (characters[index] === "'") {
      characters[index++] = " ";
      while (index < characters.length) {
        if (characters[index] === "'" && characters[index + 1] === "'") {
          characters[index++] = " ";
          characters[index++] = " ";
        } else if (characters[index] === "'") {
          characters[index++] = " ";
          break;
        } else {
          if (characters[index] !== "\r" && characters[index] !== "\n") characters[index] = " ";
          index++;
        }
      }
      continue;
    }
    index++;
  }
  return characters.join("");
}

function freezesFact(fact) {
  const projected = {
    factId: "",
    relativePath: fact.relativePath,
    factOrdinal: fact.ordinal,
    factKind: fact.factKind,
    name: fact.name == null ? null : String(fact.name),
    value: fact.value == null ? null : typeof fact.value === "string" ? fact.value : JSON.stringify(fact.value),
    line: fact.line ?? null,
    column: fact.column ?? null,
    detail: fact.detail ?? null,
    authorityDisposition: "OBSERVED_NOT_ADMITTED",
  };
  projected.factId = factIdOf(projected);
  return Object.freeze(projected);
}

function factIdOf(fact) {
  return digest({ relativePath: fact.relativePath, factOrdinal: fact.factOrdinal, factKind: fact.factKind, name: fact.name, value: fact.value, line: fact.line, column: fact.column, detail: fact.detail });
}

function jsonFact(factKind, name, value, pointer, detail = null) {
  return { factKind, name, value, line: null, column: null, detail: { jsonPointer: pointer, ...(detail ?? {}) } };
}

function visitsJson(value, pointer, visit) {
  visit(value, pointer);
  if (Array.isArray(value)) value.forEach((child, index) => visitsJson(child, `${pointer}/${index}`, visit));
  else if (value !== null && typeof value === "object") Object.entries(value).forEach(([key, child]) => visitsJson(child, `${pointer}/${escapesPointer(key)}`, visit));
}

function exactOnly(analyzerId, analysisDisposition) {
  return { analyzerId, analysisDisposition, facts: [] };
}

function linesOf(text) {
  return text.split(/\r?\n/u);
}

function positionOf(text, offset) {
  const before = text.slice(0, offset);
  const lines = before.split(/\r?\n/u);
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

function normalizesSqlIdentifier(value) {
  return value.replaceAll("[", "").replaceAll("]", "");
}

function escapesPointer(value) {
  return String(value).replaceAll("~", "~0").replaceAll("/", "~1");
}

function countsBy(rows, key) {
  return Object.freeze(Object.fromEntries([...rows.reduce((map, row) => map.set(row[key], (map.get(row[key]) ?? 0) + 1), new Map()).entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)));
}

function digest(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;
}
