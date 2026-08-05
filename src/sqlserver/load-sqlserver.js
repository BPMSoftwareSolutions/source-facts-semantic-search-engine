import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validatesLoadReceipt } from "./validates-load-receipt.js";

const sqlcmdOutputWidth = 8000;

// One root, one current index, one transaction. A rescan replaces the prior
// root-scoped fact graph atomically, while ingestion receipts retain lightweight
// load history. Loads via
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

  const loaded = await runsAtomicIndexLoad(runner, index);
  const steps = loaded.steps ?? [];
  for (const step of steps) reportsStep({ ...step, alreadyLoaded: false });
  const finalCounts = {
    files: loaded.files ?? 0,
    symbols: loaded.symbols ?? 0,
    relationships: loaded.relationships ?? 0,
    dataflows: loaded.dataflows ?? 0,
    sourceReferences: loaded.sourceReferences ?? 0,
    documents: loaded.documents ?? 0,
    governanceRules: loaded.governanceRules ?? 0,
    bodyMechanics: loaded.bodyMechanics ?? 0,
  };

  return await validatesLoadReceipt({
    receiptType: "sql-server-load-receipt.v1",
    indexId,
    disposition: "LOAD_ADMITTED",
    alreadyLoaded: false,
    counts: finalCounts,
    steps,
    totalElapsedMs: loaded.totalElapsedMs ?? Date.now() - startedAt,
  });
}

async function runsAtomicIndexLoad(runner, index) {
  return await runsScriptForJsonRow(runner, buildsAtomicLoadScript(index));
}

function buildsAtomicLoadScript(index) {
  const header = { indexId: index.indexId, indexType: index.indexType, manifest: index.manifest, workspace: index.workspace, coverage: index.coverage };
  const indexIdLiteral = sqlStringLiteral(index.indexId);
  const loadBatches = [];
  for (const [ordinal, step] of arraySteps.entries()) {
    const variableStem = `${step.jsonKey[0].toUpperCase()}${step.jsonKey.slice(1)}`;
    const jsonVariable = `@${variableStem}Json`;
    const batches = chunksJsonArray(index[step.jsonKey] ?? []);
    for (const batch of batches) loadBatches.push(`SET NOCOUNT ON;
SET XACT_ABORT ON;
DECLARE @IndexId varchar(120) = ${indexIdLiteral};
DECLARE ${jsonVariable} nvarchar(max);
${buildsNvarcharAssignment(jsonVariable, batch)}
DECLARE @StepStartedAt datetime2(7) = SYSUTCDATETIME();
DECLARE @PriorRows int = (SELECT [Rows] FROM #Counts WHERE JsonKey = N'${step.jsonKey}');
    DECLARE @${variableStem}Result TABLE (RecordCount int);
INSERT INTO @${variableStem}Result
EXEC ${step.procedure} @IndexId = @IndexId, ${step.jsonParam} = ${jsonVariable};
DECLARE @Rows int = COALESCE((SELECT SUM(RecordCount) FROM @${variableStem}Result), 0);
UPDATE #Counts SET [Rows] = @Rows WHERE JsonKey = N'${step.jsonKey}';
INSERT INTO #StepBatches (StepOrdinal, [Table], [Rows], ElapsedMs)
VALUES (${ordinal + 2}, N'${step.table}', @Rows - @PriorRows, DATEDIFF(millisecond, @StepStartedAt, SYSUTCDATETIME()));
GO`);
  }
  return `SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;
CREATE TABLE #LoadContext (LoadStartedAt datetime2(7) NOT NULL);
CREATE TABLE #StepBatches (StepOrdinal int NOT NULL, [Table] nvarchar(200) NOT NULL, [Rows] int NOT NULL, ElapsedMs int NOT NULL);
CREATE TABLE #Counts (JsonKey nvarchar(80) NOT NULL PRIMARY KEY, [Rows] int NOT NULL);
INSERT INTO #LoadContext VALUES (SYSUTCDATETIME());
INSERT INTO #Counts (JsonKey,[Rows]) VALUES ${arraySteps.map((step) => `(N'${step.jsonKey}',0)`).join(",")};
DECLARE @Payload nvarchar(max) = ${sqlNvarcharMaxExpression(JSON.stringify(header))};
DECLARE @StepStartedAt datetime2(7) = SYSUTCDATETIME();
DECLARE @ScanResult TABLE (IndexId varchar(120), RootId nvarchar(400), ScanId varchar(200), WorkspaceId nvarchar(400), FilesObserved int);
INSERT INTO @ScanResult EXEC ingestion.LoadScan @Payload = @Payload;
INSERT INTO #StepBatches (StepOrdinal,[Table],[Rows],ElapsedMs)
SELECT 1,N'inventory.Scan',FilesObserved,DATEDIFF(millisecond,@StepStartedAt,SYSUTCDATETIME()) FROM @ScanResult;
GO
${loadBatches.join("\n")}
SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRY
    DECLARE @IndexId varchar(120) = ${indexIdLiteral};
    DECLARE @TotalElapsedMs int = DATEDIFF(millisecond,(SELECT LoadStartedAt FROM #LoadContext),SYSUTCDATETIME());
    DECLARE @StepsJson nvarchar(max) = (SELECT [Table] AS [table],SUM([Rows]) AS [rows],SUM(ElapsedMs) AS elapsedMs FROM #StepBatches GROUP BY StepOrdinal,[Table] ORDER BY StepOrdinal FOR JSON PATH);
    ${arraySteps.map((step) => `DECLARE @${step.jsonKey}Count int = (SELECT [Rows] FROM #Counts WHERE JsonKey=N'${step.jsonKey}');`).join("\n    ")}
    DECLARE @ReceiptResult TABLE (ReceiptId uniqueidentifier, LoadedAtUtc datetime2(7));
    INSERT INTO @ReceiptResult
    EXEC ingestion.RecordLoadReceipt
        @IndexId = @IndexId, @Disposition = 'LOAD_ADMITTED', @AlreadyLoaded = 0,
        @FilesLoaded = @filesCount, @SymbolsLoaded = @symbolsCount, @RelationshipsLoaded = @relationshipsCount,
        @DataflowsLoaded = @dataflowsCount, @SourceReferencesLoaded = @sourceReferencesCount,
        @DocumentsLoaded = @documentsCount, @GovernanceRulesLoaded = @governanceRulesCount,
        @BodyMechanicsLoaded = @bodyMechanicsCount, @StepsJson = @StepsJson, @TotalElapsedMs = @TotalElapsedMs;
    COMMIT TRANSACTION;

    SELECT (SELECT
        @filesCount AS files,
        @symbolsCount AS symbols,
        @relationshipsCount AS relationships,
        @dataflowsCount AS dataflows,
        @sourceReferencesCount AS sourceReferences,
        @documentsCount AS documents,
        @governanceRulesCount AS governanceRules,
        @bodyMechanicsCount AS bodyMechanics,
        JSON_QUERY(@StepsJson) AS steps,
        @TotalElapsedMs AS totalElapsedMs
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS StepJson;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
`;
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
    const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", String(sqlcmdOutputWidth), "-y", String(sqlcmdOutputWidth), "-b"];
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

// sqlcmd becomes prohibitively slow when a generated batch contains a single
// line tens of megabytes long. Keep every token bounded while preserving one
// nvarchar(max) value and the loader's one-transaction replacement boundary.
export function sqlNvarcharMaxExpression(value, chunkSize = 3900) {
  const text = String(value);
  const chunks = [];
  for (let offset = 0; offset < text.length;) {
    let end = Math.min(offset + chunkSize, text.length);
    if (end < text.length && /[\uD800-\uDBFF]/u.test(text[end - 1])) end -= 1;
    chunks.push(`N'${text.slice(offset, end).replace(/'/g, "''")}'`);
    offset = end;
  }
  if (chunks.length === 0) return "CAST(N'' AS nvarchar(max))";
  chunks[0] = `CAST(${chunks[0]} AS nvarchar(max))`;
  return chunks.join(" +\n    ");
}

function buildsNvarcharAssignment(variable, value, chunkSize = 3900) {
  const text = String(value);
  if (text.length === 0) return `    SET ${variable} = CAST(N'' AS nvarchar(max));`;
  const statements = [];
  for (let offset = 0; offset < text.length;) {
    let end = Math.min(offset + chunkSize, text.length);
    if (end < text.length && /[\uD800-\uDBFF]/u.test(text[end - 1])) end -= 1;
    const literal = `N'${text.slice(offset, end).replace(/'/g, "''")}'`;
    statements.push(statements.length === 0
      ? `    SET ${variable} = CAST(${literal} AS nvarchar(max));`
      : `    SET ${variable} += ${literal};`);
    offset = end;
  }
  return statements.join("\n");
}

function chunksJsonArray(rows, maxCharacters = 250_000) {
  if (!Array.isArray(rows) || rows.length === 0) return ["[]"];
  const batches = [];
  let members = [];
  let length = 2;
  for (const row of rows) {
    const member = JSON.stringify(row);
    const additional = member.length + (members.length === 0 ? 0 : 1);
    if (members.length > 0 && length + additional > maxCharacters) {
      batches.push(`[${members.join(",")}]`);
      members = [];
      length = 2;
    }
    members.push(member);
    length += member.length + (members.length === 1 ? 0 : 1);
  }
  batches.push(`[${members.join(",")}]`);
  return batches;
}
