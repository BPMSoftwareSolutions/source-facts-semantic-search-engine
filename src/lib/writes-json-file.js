import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { once } from "node:events";
import { finished } from "node:stream/promises";

export async function writesJsonFile(filePath, value, { pretty = false } = {}) {
  await mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  const stream = createWriteStream(filePath, { encoding: "utf8" });
  const completion = finished(stream);
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      await writesChunk(stream, JSON.stringify(value, null, pretty ? 2 : undefined));
    } else {
      await writesTopLevelObject(stream, value, pretty);
    }
    stream.end();
    await completion;
  } catch (error) {
    stream.destroy(error);
    await completion.catch(() => undefined);
    throw error;
  }
}

async function writesTopLevelObject(stream, value, pretty) {
  const entries = Object.entries(value);
  await writesChunk(stream, "{\n");
  for (let index = 0; index < entries.length; index++) {
    const [key, child] = entries[index];
    if (pretty) await writesChunk(stream, `  ${JSON.stringify(key)}: `);
    else await writesChunk(stream, `${JSON.stringify(key)}:`);
    if (Array.isArray(child)) await writesArray(stream, child, pretty);
    else await writesChunk(stream, JSON.stringify(child));
    if (index < entries.length - 1) await writesChunk(stream, ",\n");
  }
  await writesChunk(stream, "\n}\n");
}

async function writesArray(stream, values, pretty) {
  if (values.length === 0) {
    await writesChunk(stream, "[]");
    return;
  }
  await writesChunk(stream, "[\n");
  for (let index = 0; index < values.length; index++) {
    await writesChunk(stream, `${pretty ? "    " : ""}${JSON.stringify(values[index])}`);
    if (index < values.length - 1) await writesChunk(stream, ",\n");
  }
  await writesChunk(stream, pretty ? "\n  ]" : "\n]");
}

async function writesChunk(stream, chunk) {
  if (!stream.write(chunk)) await once(stream, "drain");
}
