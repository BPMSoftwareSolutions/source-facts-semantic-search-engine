import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { writesJsonFile } from "../src/lib/writes-json-file.js";
import { readsJsonFile } from "../src/lib/reads-json-file.js";

test("streams deterministic line-delimited JSON without changing top-level property or array order", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "streamed-json-"));
  try {
    const output = path.join(workspace, "nested", "index.json");
    const value = { indexType: "fixture.v1", rows: [{ id: 2 }, { id: 1 }], coverage: { total: 2 } };
    await writesJsonFile(output, value);
    const first = fs.readFileSync(output, "utf8");
    await writesJsonFile(output, value);
    assert.equal(fs.readFileSync(output, "utf8"), first);
    assert.deepEqual(JSON.parse(first), value);
    assert.deepEqual(await readsJsonFile(output, { streamingThresholdBytes: 0 }), value);
    assert.deepEqual(await readsJsonFile(output, { streamingThresholdBytes: 0, includeKeys: ["rows"] }), { rows: value.rows });
  } finally {
    await fs.promises.rm(workspace, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("streams parseable pretty JSON and creates a missing output parent", async () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "streamed-pretty-json-"));
  try {
    const output = path.join(workspace, "new", "directory", "index.json");
    const value = { rows: [{ nested: [1, 2, 3] }], complete: true };
    await writesJsonFile(output, value, { pretty: true });
    assert.deepEqual(JSON.parse(fs.readFileSync(output, "utf8")), value);
    assert.deepEqual(await readsJsonFile(output, { streamingThresholdBytes: 0 }), value);
  } finally {
    await fs.promises.rm(workspace, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});
