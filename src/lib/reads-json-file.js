import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { once } from "node:events";
import readline from "node:readline";
import { finished } from "node:stream/promises";

const defaultStreamingThresholdBytes = 256 * 1024 * 1024;

export async function readsJsonFile(filePath, { streamingThresholdBytes = defaultStreamingThresholdBytes, includeKeys = null } = {}) {
  const fileStats = await stat(filePath);
  if (fileStats.size < streamingThresholdBytes) {
    const value = JSON.parse(stripsByteOrderMark(await readFile(filePath, "utf8")));
    return includeKeys === null ? value : selectsKeys(value, includeKeys);
  }
  return await readsLineDelimitedTopLevelJson(filePath, includeKeys);
}

async function readsLineDelimitedTopLevelJson(filePath, includeKeys) {
  const result = {};
  const included = includeKeys === null ? null : new Set(includeKeys);
  let activeArrayKey = null;
  let collectsActiveArray = false;
  const input = createReadStream(filePath, { encoding: "utf8" });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  let lineNumber = 0;
  for await (const rawLine of lines) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (line.length === 0 || line === "{" || line === "}") continue;
    if (activeArrayKey !== null) {
      if (line === "]" || line === "],") {
        activeArrayKey = null;
        continue;
      }
      const itemText = line.endsWith(",") ? line.slice(0, -1) : line;
      if (collectsActiveArray) result[activeArrayKey].push(JSON.parse(itemText));
      continue;
    }

    const colonIndex = findsPropertyColon(line);
    if (colonIndex < 0) throw new Error(`Invalid streamed JSON property at line ${lineNumber}.`);
    const key = JSON.parse(line.slice(0, colonIndex));
    const rawValue = line.slice(colonIndex + 1).trimStart();
    if (rawValue === "[" || rawValue === "[,") {
      collectsActiveArray = included === null || included.has(key);
      if (collectsActiveArray) result[key] = [];
      activeArrayKey = key;
      continue;
    }
    if (included !== null && !included.has(key)) continue;
    const valueText = rawValue.endsWith(",") ? rawValue.slice(0, -1) : rawValue;
    result[key] = JSON.parse(valueText);
  }
  await finished(input);
  if (!input.closed) await once(input, "close");
  if (activeArrayKey !== null) throw new Error(`Unterminated streamed JSON array '${activeArrayKey}'.`);
  return result;
}

function selectsKeys(value, includeKeys) {
  const included = new Set(includeKeys);
  return Object.fromEntries(Object.entries(value).filter(([key]) => included.has(key)));
}

function findsPropertyColon(line) {
  let escaped = false;
  for (let index = 1; index < line.length; index++) {
    const character = line[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === '"' && line[index + 1] === ":") return index + 1;
  }
  return -1;
}

function stripsByteOrderMark(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
