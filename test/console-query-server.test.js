import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { projectSourceFactsWorkspace } from "../src/project.js";
import { servesQueryConsole } from "../src/console/serves-query-console.mjs";

const consoleAssetPath = path.join(process.cwd(), "source-facts-query-console", "index.html");

async function buildsFixtureIndex(workspaceRoot) {
  fs.writeFileSync(path.join(workspaceRoot, "body.mjs"), [
    "export function execute(request) {",
    "  if (request.valid) return JSON.stringify(request);",
    "  throw new Error('invalid');",
    "}",
    "",
  ].join("\n"), "utf8");
  return projectSourceFactsWorkspace({ workspaceRoot, workspaceId: "fixture" });
}

test("serves live index metadata, executes SQL over the real engine, and resolves exact source snippets", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "console-query-source-"));
  let consoleServer;
  try {
    const index = await buildsFixtureIndex(workspaceRoot);
    consoleServer = await servesQueryConsole({ index, workspaceRoot, consoleAssetPath, port: 0 });

    const homeResponse = await fetch(consoleServer.url);
    assert.equal(homeResponse.status, 200);
    assert.match(await homeResponse.text(), /Semantic Refactor Console/);
    assert.match(homeResponse.headers.get("content-security-policy"), /connect-src 'self'/);

    const infoResponse = await fetch(`${consoleServer.url}/api/index-info`);
    const info = await infoResponse.json();
    assert.equal(info.indexType, "source-fact-index.v1");
    assert.equal(info.workspaceId, "fixture");
    assert.equal(info.workspaceRootAvailable, true);
    assert.ok(info.counts.bodyMechanics > 0);

    const queryResponse = await fetch(`${consoleServer.url}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commandText: "SELECT bm.mechanic, bm.modulePath, sr.startLine, sr.endLine, sym.name AS enclosingSymbol "
          + "FROM bodyMechanics bm JOIN sourceReferences sr ON bm.sourceReferenceId = sr.referenceId "
          + "LEFT JOIN symbols sym ON bm.fromSymbolId = sym.symbolId WHERE bm.mechanic = 'branch'",
      }),
    });
    assert.equal(queryResponse.status, 200);
    const receipt = await queryResponse.json();
    assert.equal(receipt.disposition, "RELATIONAL_QUERY_EXECUTED");
    assert.equal(receipt.result.value.rows.length, 1);
    const [row] = receipt.result.value.rows;
    assert.equal(row.modulePath, "body.mjs");
    assert.equal(row.enclosingSymbol, "execute");

    const snippetParams = new URLSearchParams({ modulePath: row.modulePath, startLine: String(row.startLine), endLine: String(row.endLine), context: "1" });
    const snippetResponse = await fetch(`${consoleServer.url}/api/snippet?${snippetParams}`);
    const snippet = await snippetResponse.json();
    assert.equal(snippet.available, true);
    const hitLine = snippet.lines.find((line) => line.hit);
    assert.match(hitLine.text, /if \(request\.valid\)/);

    const rejectedResponse = await fetch(`${consoleServer.url}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commandText: "SELECT * FROM nonexistentTable" }),
    });
    const rejected = await rejectedResponse.json();
    assert.equal(rejectedResponse.status, 200);
    assert.equal(rejected.disposition, "RELATIONAL_QUERY_REJECTED");

    assert.equal((await fetch(`${consoleServer.url}/api/query`)).status, 405);
    assert.equal((await fetch(`${consoleServer.url}/api/query`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, 400);
    assert.equal((await fetch(`${consoleServer.url}/nowhere`)).status, 404);

    const escapeParams = new URLSearchParams({ modulePath: "../../../../etc/passwd", startLine: "1", endLine: "1" });
    const escapeResponse = await fetch(`${consoleServer.url}/api/snippet?${escapeParams}`);
    const escapeBody = await escapeResponse.json();
    assert.equal(escapeBody.available, false);
  } finally {
    await consoleServer?.close();
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("reports snippets unavailable without throwing when no workspace root can be resolved", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "console-query-source-noroot-"));
  let consoleServer;
  try {
    const index = await buildsFixtureIndex(workspaceRoot);
    consoleServer = await servesQueryConsole({ index, workspaceRoot: null, consoleAssetPath, port: 0 });
    const infoResponse = await fetch(`${consoleServer.url}/api/index-info`);
    const info = await infoResponse.json();
    assert.equal(info.workspaceRootAvailable, false);
    const snippetResponse = await fetch(`${consoleServer.url}/api/snippet?modulePath=body.mjs&startLine=1&endLine=1`);
    const snippet = await snippetResponse.json();
    assert.equal(snippet.available, false);
    assert.equal(snippet.reason, "WORKSPACE_ROOT_UNAVAILABLE");
  } finally {
    await consoleServer?.close();
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});

test("only binds to the loopback interface", async () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "console-query-source-hostcheck-"));
  try {
    const index = await buildsFixtureIndex(workspaceRoot);
    await assert.rejects(
      servesQueryConsole({ index, consoleAssetPath, hostname: "0.0.0.0" }),
      /may bind only to 127\.0\.0\.1/,
    );
  } finally {
    fs.rmSync(workspaceRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
  }
});
