import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const excludedDirectories = new Set([".git", "node_modules", "dist", "dist-test", "release"]);

export async function projectsJsonWorkspace(workspaceRoot) {
  const relativePaths = await listsJsonFiles(workspaceRoot);
  const documents = [];
  for (const relativePath of relativePaths) {
    const absolutePath = path.resolve(workspaceRoot, ...relativePath.split("/"));
    const text = await readFile(absolutePath, "utf8");
    const parsed = parsesJsonWithLocations(relativePath, text);
    documents.push(Object.freeze({
      relativePath,
      text,
      contentHash: `sha256:${sha256(text)}`,
      rootValue: parsed.value,
      nodes: parsed.nodes,
    }));
  }
  return Object.freeze(documents);
}

async function listsJsonFiles(workspaceRoot) {
  const root = path.resolve(workspaceRoot);
  const pending = [root];
  const paths = [];
  while (pending.length > 0) {
    const current = pending.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!excludedDirectories.has(entry.name)) pending.push(path.join(current, entry.name));
        continue;
      }
      if (!entry.isFile() || entry.name === "package-lock.json" || path.extname(entry.name).toLowerCase() !== ".json") continue;
      paths.push(path.relative(root, path.join(current, entry.name)).replaceAll("\\", "/"));
    }
  }
  return paths.sort(compareOrdinal);
}

function parsesJsonWithLocations(relativePath, text) {
  let cursor = 0;
  const nodes = [];
  const lineStarts = buildsLineStarts(text);

  function skipWhitespace() {
    while (cursor < text.length && /\s/u.test(text[cursor])) cursor++;
  }

  function parseValue(jsonPointer, propertyName = null) {
    skipWhitespace();
    const start = cursor;
    const token = text[cursor];
    let value;
    let valueType;
    if (token === "{") {
      valueType = "object";
      value = parseObject(jsonPointer);
    } else if (token === "[") {
      valueType = "array";
      value = parseArray(jsonPointer);
    } else if (token === '"') {
      valueType = "string";
      value = parseString();
    } else if (token === "t") {
      consumeLiteral("true");
      valueType = "boolean";
      value = true;
    } else if (token === "f") {
      consumeLiteral("false");
      valueType = "boolean";
      value = false;
    } else if (token === "n") {
      consumeLiteral("null");
      valueType = "null";
      value = null;
    } else {
      valueType = "number";
      value = parseNumber();
    }
    const end = cursor;
    const position = resolvesLineAndColumn(lineStarts, start);
    nodes.push(Object.freeze({
      jsonPointer,
      propertyName,
      valueType,
      ...(valueType === "object" || valueType === "array" ? {} : { value }),
      start,
      length: end - start,
      line: position.line,
      column: position.column,
      sourceKind: "JsonValue",
      relativePath,
    }));
    return value;
  }

  function parseObject(jsonPointer) {
    cursor++;
    skipWhitespace();
    const result = {};
    const keys = new Set();
    if (text[cursor] === "}") {
      cursor++;
      return result;
    }
    while (cursor < text.length) {
      skipWhitespace();
      if (text[cursor] !== '"') fail("Expected an object property name");
      const propertyName = parseString();
      if (keys.has(propertyName)) fail(`Duplicate object property ${JSON.stringify(propertyName)}`);
      keys.add(propertyName);
      skipWhitespace();
      if (text[cursor] !== ":") fail("Expected ':' after an object property name");
      cursor++;
      const childPointer = `${jsonPointer}/${escapesJsonPointer(propertyName)}`;
      result[propertyName] = parseValue(childPointer, propertyName);
      skipWhitespace();
      if (text[cursor] === "}") {
        cursor++;
        return result;
      }
      if (text[cursor] !== ",") fail("Expected ',' between object properties");
      cursor++;
    }
    fail("Unterminated object");
  }

  function parseArray(jsonPointer) {
    cursor++;
    skipWhitespace();
    const result = [];
    if (text[cursor] === "]") {
      cursor++;
      return result;
    }
    while (cursor < text.length) {
      result.push(parseValue(`${jsonPointer}/${result.length}`));
      skipWhitespace();
      if (text[cursor] === "]") {
        cursor++;
        return result;
      }
      if (text[cursor] !== ",") fail("Expected ',' between array items");
      cursor++;
    }
    fail("Unterminated array");
  }

  function parseString() {
    const start = cursor;
    cursor++;
    while (cursor < text.length) {
      const token = text[cursor];
      if (token === "\\") {
        cursor += 2;
        continue;
      }
      cursor++;
      if (token === '"') return JSON.parse(text.slice(start, cursor));
    }
    fail("Unterminated string");
  }

  function parseNumber() {
    const match = text.slice(cursor).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/u);
    if (match === null) fail("Expected a JSON value");
    cursor += match[0].length;
    return Number(match[0]);
  }

  function consumeLiteral(literal) {
    if (text.slice(cursor, cursor + literal.length) !== literal) fail(`Expected ${literal}`);
    cursor += literal.length;
  }

  function fail(message) {
    const position = resolvesLineAndColumn(lineStarts, cursor);
    throw new SyntaxError(`${relativePath}:${position.line}:${position.column}: ${message}`);
  }

  const value = parseValue("");
  skipWhitespace();
  if (cursor !== text.length) fail("Unexpected content after the root JSON value");
  return Object.freeze({ value, nodes: Object.freeze(nodes) });
}

function buildsLineStarts(text) {
  const starts = [0];
  for (let index = 0; index < text.length; index++) {
    if (text[index] === "\n") starts.push(index + 1);
  }
  return starts;
}

function resolvesLineAndColumn(lineStarts, offset) {
  let low = 0;
  let high = lineStarts.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (lineStarts[middle] <= offset) low = middle + 1;
    else high = middle - 1;
  }
  return Object.freeze({ line: high + 1, column: offset - lineStarts[high] + 1 });
}

function escapesJsonPointer(value) {
  return value.replaceAll("~", "~0").replaceAll("/", "~1");
}

function compareOrdinal(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
