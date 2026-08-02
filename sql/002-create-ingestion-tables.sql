-- Load control and reproducibility. One receipt row is written per load attempt,
-- for the whole index (not per table) -- StepsJson carries the per-table breakdown
-- (table name, row count, elapsed ms) so a single receipt still shows exactly which
-- slice took how long. There is deliberately no separate "raw payload" or
-- "per-finding" bookkeeping table: the source JSON already exists on disk wherever
-- `project` wrote it, and a failed step surfaces as an ordinary error from the
-- loader immediately, not as a buried row to query later.

IF OBJECT_ID('ingestion.Finding', 'U') IS NOT NULL DROP TABLE ingestion.Finding;
IF OBJECT_ID('ingestion.Receipt', 'U') IS NOT NULL DROP TABLE ingestion.Receipt;
IF OBJECT_ID('ingestion.LoadPackage', 'U') IS NOT NULL DROP TABLE ingestion.LoadPackage;
GO

CREATE TABLE ingestion.Receipt
(
    ReceiptId               uniqueidentifier NOT NULL CONSTRAINT DF_Receipt_Id DEFAULT NEWSEQUENTIALID(),
    IndexId                 varchar(120)     NOT NULL,
    Disposition             varchar(40)      NOT NULL,   -- LOAD_ADMITTED | LOAD_ALREADY_ADMITTED
    AlreadyLoaded           bit              NOT NULL CONSTRAINT DF_Receipt_AlreadyLoaded DEFAULT 0,
    FilesLoaded             int              NOT NULL CONSTRAINT DF_Receipt_FilesLoaded DEFAULT 0,
    SymbolsLoaded           int              NOT NULL CONSTRAINT DF_Receipt_SymbolsLoaded DEFAULT 0,
    RelationshipsLoaded     int              NOT NULL CONSTRAINT DF_Receipt_RelationshipsLoaded DEFAULT 0,
    DataflowsLoaded         int              NOT NULL CONSTRAINT DF_Receipt_DataflowsLoaded DEFAULT 0,
    SourceReferencesLoaded  int              NOT NULL CONSTRAINT DF_Receipt_SourceReferencesLoaded DEFAULT 0,
    DocumentsLoaded         int              NOT NULL CONSTRAINT DF_Receipt_DocumentsLoaded DEFAULT 0,
    GovernanceRulesLoaded   int              NOT NULL CONSTRAINT DF_Receipt_GovernanceRulesLoaded DEFAULT 0,
    BodyMechanicsLoaded     int              NOT NULL CONSTRAINT DF_Receipt_BodyMechanicsLoaded DEFAULT 0,
    StepsJson               nvarchar(max)    NULL,        -- [{ table, rows, elapsedMs }, ...]
    TotalElapsedMs          int              NULL,
    LoadedAtUtc             datetime2(7)     NOT NULL CONSTRAINT DF_Receipt_LoadedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Receipt PRIMARY KEY (ReceiptId),
    CONSTRAINT CK_Receipt_StepsJson CHECK (StepsJson IS NULL OR ISJSON(StepsJson) = 1)
);
GO
