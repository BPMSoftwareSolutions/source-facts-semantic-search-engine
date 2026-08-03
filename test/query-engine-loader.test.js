import assert from "node:assert/strict";
import test from "node:test";
import { loadsQueryEngineStartResult } from "../src/query-engine-loader.js";

test("reuses the default query engine start result across repeated loads", async () => {
  const first = await loadsQueryEngineStartResult();
  const second = await loadsQueryEngineStartResult();

  assert.strictEqual(first, second);
  assert.strictEqual(first.engine, second.engine);
});
