import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the SQL inventory enforces one current scan per durable source root", async () => {
  const schema = await readFile(new URL("../scripts/sql/003-create-source-fact-tables.sql", import.meta.url), "utf8");
  assert.match(schema, /CREATE TABLE inventory\.SourceRoot/u);
  assert.match(schema, /CONSTRAINT UQ_Scan_RootId UNIQUE \(RootId\)/u);
  assert.match(schema, /CONSTRAINT FK_Scan_SourceRoot FOREIGN KEY \(RootId\)/u);
  assert.match(schema, /CONSTRAINT FK_SourceFile_ScanRoot FOREIGN KEY \(IndexId, RootId\)/u);
  assert.match(schema, /CONSTRAINT FK_ExecutableMechanic_ScanRoot FOREIGN KEY \(IndexId, RootId\)/u);
  assert.match(schema, /SourceFilePathKey[\s\S]*HASHBYTES\('SHA2_256'/u);
});

test("the in-place migration retires full historical graphs but retains receipts", async () => {
  const migration = await readFile(new URL("../scripts/sql/003a-migrate-source-root-current-state.sql", import.meta.url), "utf8");
  assert.match(migration, /ROW_NUMBER\(\) OVER \(PARTITION BY RootId ORDER BY ObservedAtUtc DESC/u);
  assert.match(migration, /DELETE target FROM inventory\.Scan/u);
  assert.doesNotMatch(migration, /DELETE FROM ingestion\.Receipt/u);
  assert.match(migration, /COMMIT TRANSACTION/u);
});

test("the loader replaces a root within one transaction", async () => {
  const loader = await readFile(new URL("../src/sqlserver/load-sqlserver.js", import.meta.url), "utf8");
  const loadScan = await readFile(new URL("../scripts/sql/004a-load-scan.sql", import.meta.url), "utf8");
  assert.match(loader, /BEGIN TRANSACTION/u);
  assert.match(loader, /IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION/u);
  assert.match(loadScan, /IF @@TRANCOUNT = 0/u);
  assert.match(loadScan, /WHERE RootId = @RootId/u);
  assert.match(loadScan, /DELETE FROM inventory\.Scan WHERE IndexId = @PreviousIndexId/u);
});
