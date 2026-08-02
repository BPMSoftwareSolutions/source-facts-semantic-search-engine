import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validatesLoadReceipt } from "./validates-load-receipt.js";

const sqlcmdOutputWidth = 8000;

// One table, one step, one round trip -- each step is independently timed and
// reported before the next one starts, and each is its own committed statement
// rather than one all-or-nothing transaction across the whole index. Loads via
// sqlcmd rather than a driver dependency: this repo's SQL Server access is a local
// trusted (Windows-integrated) connection, which tedious/mssql cannot use without an
// additional native driver; sqlcmd already does this with zero extra dependencies.
const arraySteps = [
  { table: "inventory.SourceFile", jsonKey: "files", procedure: "ingestion.LoadFiles", jsonParam: "@FilesJson" },
  { table: "source.SourceReference", jsonKey: "sourceReferences", procedure: "ingestion.LoadSourceReferences", jsonParam: "@SourceReferencesJson" },
  { table: "source.Symbol", jsonKey: "symbols", procedure: "ingestion.LoadSymbols", jsonParam: "@SymbolsJson" },
  { table: "fact.Relationship", jsonKey: "relationships", procedure: "ingestion.LoadRelationships", jsonParam: "@RelationshipsJson" },
  { table: "fact.DataFlow", jsonKey: "dataflows", procedure: "ingestion.LoadDataFlows", jsonParam: "@DataflowsJson" },
  { table: "fact.ExecutableMechanic", jsonKey: "bodyMechanics", procedure: "ingestion.LoadExecutableMechanics", jsonParam: "@BodyMechanicsJson" },
  { table: "fact.Document", jsonKey: "documents", procedure: "ingestion.LoadDocuments", jsonParam: "@DocumentsJson" },
  { table: "fact.GovernanceRule", jsonKey: "governanceRules", procedure: "ingestion.LoadGovernanceRules", jsonParam: "@GovernanceRulesJson" },
];

export async function loadsSourceFactIndexIntoSqlServer({
  index,
  connection,
  sqlcmdPath = "sqlcmd",
  onStep,
} = {}) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") {
    throw new Error("connection is required (see resolves-sql-connection.js).");
  }
  if (index === null || typeof index !== "object") throw new Error("A loaded source-fact-index.v1 is required.");
  const indexId = index.indexId;
  if (typeof indexId !== "string" || indexId.length === 0) throw new Error("index.indexId is required.");

  const runner = { connection, sqlcmdPath };
  const startedAt = Date.now();
  const reportsStep = typeof onStep === "function" ? onStep : () => {};

  const existing = await checksExistingLoad(runner, indexId);
  if (existing.scanExists) {
    reportsStep({ table: "inventory.Scan", rows: 1, elapsedMs: 0, alreadyLoaded: true });
    return await validatesLoadReceipt({
      receiptType: "sql-server-load-receipt.v1",
      indexId,
      disposition: "LOAD_ALREADY_ADMITTED",
      alreadyLoaded: true,
      counts: existing.counts,
      steps: [],
      totalElapsedMs: Date.now() - startedAt,
    });
  }

  const steps = [];

  const scanStep = await timesStep(() => runsLoadScan(runner, index));
  reportsStep({ table: "inventory.Scan", rows: scanStep.result.FilesObserved ?? 1, elapsedMs: scanStep.elapsedMs, alreadyLoaded: false });
  steps.push({ table: "inventory.Scan", rows: scanStep.result.FilesObserved ?? 1, elapsedMs: scanStep.elapsedMs });

  const counts = {};
  const stepKeyByTable = {
    "inventory.SourceFile": "files",
    "source.SourceReference": "sourceReferences",
    "source.Symbol": "symbols",
    "fact.Relationship": "relationships",
    "fact.DataFlow": "dataflows",
    "fact.ExecutableMechanic": "bodyMechanics",
    "fact.Document": "documents",
    "fact.GovernanceRule": "governanceRules",
  };

  for (const step of arraySteps) {
    const arrayValue = index[step.jsonKey] ?? [];
    const timed = await timesStep(() => runsArrayLoadStep(runner, { indexId, arrayValue, procedure: step.procedure, jsonParam: step.jsonParam }));
    reportsStep({ table: step.table, rows: timed.result.RecordCount ?? 0, elapsedMs: timed.elapsedMs, alreadyLoaded: false });
    steps.push({ table: step.table, rows: timed.result.RecordCount ?? 0, elapsedMs: timed.elapsedMs });
    counts[stepKeyByTable[step.table]] = timed.result.RecordCount ?? 0;
  }

  const totalElapsedMs = Date.now() - startedAt;
  const finalCounts = {
    files: counts.files ?? 0,
    symbols: counts.symbols ?? 0,
    relationships: counts.relationships ?? 0,
    dataflows: counts.dataflows ?? 0,
    sourceReferences: counts.sourceReferences ?? 0,
    documents: counts.documents ?? 0,
    governanceRules: counts.governanceRules ?? 0,
    bodyMechanics: counts.bodyMechanics ?? 0,
  };

  await recordsReceipt(runner, { indexId, disposition: "LOAD_ADMITTED", alreadyLoaded: false, counts: finalCounts, steps, totalElapsedMs });

  return await validatesLoadReceipt({
    receiptType: "sql-server-load-receipt.v1",
    indexId,
    disposition: "LOAD_ADMITTED",
    alreadyLoaded: false,
    counts: finalCounts,
    steps,
    totalElapsedMs,
  });
}

async function timesStep(runsStep) {
  const start = Date.now();
  const result = await runsStep();
  return { result, elapsedMs: Date.now() - start };
}

async function checksExistingLoad(runner, indexId) {
  const script = buildsStepScript({
    declarations: [`DECLARE @IndexId VARCHAR(120) = ${sqlStringLiteral(indexId)};`],
    resultColumns: "ScanExists int, FilesLoaded int, SymbolsLoaded int, RelationshipsLoaded int, DataflowsLoaded int, SourceReferencesLoaded int, DocumentsLoaded int, GovernanceRulesLoaded int, BodyMechanicsLoaded int",
    execStatement: "EXEC ingestion.CountsForIndex @IndexId = @IndexId",
  });
  const row = await runsScriptForJsonRow(runner, script);
  return {
    scanExists: Boolean(row.ScanExists),
    counts: {
      files: row.FilesLoaded ?? 0,
      symbols: row.SymbolsLoaded ?? 0,
      relationships: row.RelationshipsLoaded ?? 0,
      dataflows: row.DataflowsLoaded ?? 0,
      sourceReferences: row.SourceReferencesLoaded ?? 0,
      documents: row.DocumentsLoaded ?? 0,
      governanceRules: row.GovernanceRulesLoaded ?? 0,
      bodyMechanics: row.BodyMechanicsLoaded ?? 0,
    },
  };
}

async function runsLoadScan(runner, index) {
  const header = { indexId: index.indexId, indexType: index.indexType, manifest: index.manifest, workspace: index.workspace, coverage: index.coverage };
  const script = buildsStepScript({
    declarations: [`DECLARE @Payload NVARCHAR(MAX) = ${sqlStringLiteral(JSON.stringify(header))};`],
    resultColumns: "IndexId varchar(120), ScanId varchar(200), WorkspaceId nvarchar(400), FilesObserved int",
    execStatement: "EXEC ingestion.LoadScan @Payload = @Payload",
  });
  return await runsScriptForJsonRow(runner, script);
}

async function runsArrayLoadStep(runner, { indexId, arrayValue, procedure, jsonParam }) {
  const script = buildsStepScript({
    declarations: [
      `DECLARE @IndexId VARCHAR(120) = ${sqlStringLiteral(indexId)};`,
      `DECLARE @Json NVARCHAR(MAX) = ${sqlStringLiteral(JSON.stringify(arrayValue))};`,
    ],
    resultColumns: "RecordCount int",
    execStatement: `EXEC ${procedure} @IndexId = @IndexId, ${jsonParam} = @Json`,
  });
  return await runsScriptForJsonRow(runner, script);
}

async function recordsReceipt(runner, { indexId, disposition, alreadyLoaded, counts, steps, totalElapsedMs }) {
  const script = buildsStepScript({
    declarations: [
      `DECLARE @IndexId VARCHAR(120) = ${sqlStringLiteral(indexId)};`,
      `DECLARE @Disposition VARCHAR(40) = ${sqlStringLiteral(disposition)};`,
      `DECLARE @StepsJson NVARCHAR(MAX) = ${sqlStringLiteral(JSON.stringify(steps))};`,
    ],
    resultColumns: "ReceiptId uniqueidentifier, LoadedAtUtc datetime2(7)",
    execStatement: `EXEC ingestion.RecordLoadReceipt
        @IndexId = @IndexId, @Disposition = @Disposition, @AlreadyLoaded = ${alreadyLoaded ? 1 : 0},
        @FilesLoaded = ${counts.files}, @SymbolsLoaded = ${counts.symbols}, @RelationshipsLoaded = ${counts.relationships},
        @DataflowsLoaded = ${counts.dataflows}, @SourceReferencesLoaded = ${counts.sourceReferences},
        @DocumentsLoaded = ${counts.documents}, @GovernanceRulesLoaded = ${counts.governanceRules},
        @BodyMechanicsLoaded = ${counts.bodyMechanics}, @StepsJson = @StepsJson, @TotalElapsedMs = ${Math.trunc(totalElapsedMs)}`,
  });
  return await runsScriptForJsonRow(runner, script);
}

function buildsStepScript({ declarations, resultColumns, execStatement }) {
  return `SET NOCOUNT ON;
${declarations.join("\n")}
DECLARE @Result TABLE (${resultColumns});
INSERT INTO @Result
${execStatement};
SELECT (SELECT * FROM @Result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS StepJson;
`;
}

async function runsScriptForJsonRow(runner, script) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-sqlload-"));
  const scriptPath = path.join(workDirectory, "step.sql");
  try {
    await writeFile(scriptPath, script, "utf8");
    const stdout = await runsSqlcmd({ ...runner, scriptPath });
    return parsesJsonRow(stdout);
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

function runsSqlcmd({ sqlcmdPath, connection, scriptPath }) {
  return new Promise((resolve, reject) => {
    const args = [...connection.buildsArgs(), "-i", scriptPath, "-h", "-1", "-w", String(sqlcmdOutputWidth), "-y", String(sqlcmdOutputWidth), "-b"];
    const env = connection.appliesToChildEnv({ ...process.env });
    const child = spawn(sqlcmdPath, args, { windowsHide: true, env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => reject(new Error(`Unable to run sqlcmd: ${error.message}`)));
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`));
        return;
      }
      resolve(stdout);
    });
  });
}

function parsesJsonRow(stdout) {
  const joined = stdout
    .split(/\r?\n/u)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
    .join("");
  if (joined.length === 0) throw new Error("sqlcmd returned no output for this step.");
  return JSON.parse(joined);
}

function sqlStringLiteral(value) {
  return `N'${String(value).replace(/'/g, "''")}'`;
}
