-- In-place upgrade for databases created before inventory.SourceRoot and RootId.
-- It intentionally retains only the newest scan per durable root. Full historical
-- fact graphs are retired; ingestion.Receipt remains as lightweight load history.
SET XACT_ABORT ON;
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;
GO

BEGIN TRANSACTION;

IF OBJECT_ID('inventory.SourceRoot', 'U') IS NULL
BEGIN
    CREATE TABLE inventory.SourceRoot
    (
        RootId             nvarchar(400)  NOT NULL,
        WorkspaceRoot      nvarchar(1024) NULL,
        CreatedAtUtc       datetime2(7)   NOT NULL CONSTRAINT DF_SourceRoot_CreatedAtUtc DEFAULT SYSUTCDATETIME(),
        UpdatedAtUtc       datetime2(7)   NOT NULL CONSTRAINT DF_SourceRoot_UpdatedAtUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_SourceRoot PRIMARY KEY (RootId)
    );
END;

IF COL_LENGTH('inventory.Scan', 'RootId') IS NULL
    ALTER TABLE inventory.Scan ADD RootId nvarchar(400) NULL;
IF COL_LENGTH('inventory.SourceFile', 'RootId') IS NULL
    ALTER TABLE inventory.SourceFile ADD RootId nvarchar(400) NULL;
IF COL_LENGTH('fact.ExecutableMechanic', 'RootId') IS NULL
    ALTER TABLE fact.ExecutableMechanic ADD RootId nvarchar(400) NULL;
GO

UPDATE inventory.Scan SET RootId = WorkspaceId WHERE RootId IS NULL;
UPDATE target
SET RootId = scan.RootId
FROM inventory.SourceFile AS target
JOIN inventory.Scan AS scan ON scan.IndexId = target.IndexId
WHERE target.RootId IS NULL;
UPDATE target
SET RootId = scan.RootId
FROM fact.ExecutableMechanic AS target
JOIN inventory.Scan AS scan ON scan.IndexId = target.IndexId
WHERE target.RootId IS NULL;

CREATE TABLE #Retired (IndexId varchar(120) NOT NULL PRIMARY KEY);
WITH Ranked AS
(
    SELECT IndexId,
           ROW_NUMBER() OVER (PARTITION BY RootId ORDER BY ObservedAtUtc DESC, IndexId DESC) AS ScanRank
    FROM inventory.Scan
)
INSERT INTO #Retired (IndexId)
SELECT IndexId FROM Ranked WHERE ScanRank > 1;

IF OBJECT_ID('authority.MechanicCanonicalLineage', 'U') IS NOT NULL
    EXEC sp_executesql N'DELETE lineage FROM authority.MechanicCanonicalLineage AS lineage JOIN #Retired AS retired ON retired.IndexId = lineage.IndexId;';

DELETE target FROM fact.GovernanceRule AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM fact.Document AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM fact.ExecutableMechanic AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM fact.DataFlow AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM fact.Relationship AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM source.Symbol AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM source.SourceReference AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM inventory.SourceFile AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;
DELETE target FROM inventory.Scan AS target JOIN #Retired AS retired ON retired.IndexId = target.IndexId;

MERGE inventory.SourceRoot AS target
USING
(
    SELECT RootId, MAX(WorkspaceRoot) AS WorkspaceRoot
    FROM inventory.Scan
    GROUP BY RootId
) AS source
ON source.RootId = target.RootId
WHEN MATCHED THEN UPDATE SET WorkspaceRoot = source.WorkspaceRoot, UpdatedAtUtc = SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT (RootId, WorkspaceRoot) VALUES (source.RootId, source.WorkspaceRoot);

ALTER TABLE inventory.Scan ALTER COLUMN RootId nvarchar(400) NOT NULL;
ALTER TABLE inventory.SourceFile ALTER COLUMN RootId nvarchar(400) NOT NULL;
ALTER TABLE fact.ExecutableMechanic ALTER COLUMN RootId nvarchar(400) NOT NULL;

IF COL_LENGTH('inventory.SourceFile', 'SourceFilePathKey') IS NULL
    ALTER TABLE inventory.SourceFile ADD SourceFilePathKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + RootId + N'|' + RelativePath)) PERSISTED;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Scan_SourceRoot')
    ALTER TABLE inventory.Scan ADD CONSTRAINT FK_Scan_SourceRoot FOREIGN KEY (RootId) REFERENCES inventory.SourceRoot(RootId);
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_Scan_RootId')
    ALTER TABLE inventory.Scan ADD CONSTRAINT UQ_Scan_RootId UNIQUE (RootId);
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_Scan_IndexId_RootId')
    ALTER TABLE inventory.Scan ADD CONSTRAINT UQ_Scan_IndexId_RootId UNIQUE (IndexId, RootId);

IF NOT EXISTS
(
    SELECT 1
    FROM sys.key_constraints AS keyConstraint
    JOIN sys.index_columns AS indexColumn
      ON indexColumn.object_id = keyConstraint.parent_object_id
     AND indexColumn.index_id = keyConstraint.unique_index_id
    JOIN sys.columns AS columnDefinition
      ON columnDefinition.object_id = indexColumn.object_id
     AND columnDefinition.column_id = indexColumn.column_id
    WHERE keyConstraint.parent_object_id = OBJECT_ID('inventory.SourceFile')
      AND keyConstraint.type = 'PK'
      AND columnDefinition.name = 'RootId'
)
BEGIN
    ALTER TABLE inventory.SourceFile DROP CONSTRAINT PK_SourceFile;
    ALTER TABLE inventory.SourceFile ADD CONSTRAINT PK_SourceFile PRIMARY KEY NONCLUSTERED (IndexId, RootId, FileId);
END;
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_SourceFile_Path')
    ALTER TABLE inventory.SourceFile ADD CONSTRAINT UQ_SourceFile_Path UNIQUE (SourceFilePathKey);
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_SourceFile_ScanRoot')
    ALTER TABLE inventory.SourceFile ADD CONSTRAINT FK_SourceFile_ScanRoot FOREIGN KEY (IndexId, RootId) REFERENCES inventory.Scan(IndexId, RootId);

IF NOT EXISTS
(
    SELECT 1
    FROM sys.key_constraints AS keyConstraint
    JOIN sys.index_columns AS indexColumn
      ON indexColumn.object_id = keyConstraint.parent_object_id
     AND indexColumn.index_id = keyConstraint.unique_index_id
    JOIN sys.columns AS columnDefinition
      ON columnDefinition.object_id = indexColumn.object_id
     AND columnDefinition.column_id = indexColumn.column_id
    WHERE keyConstraint.parent_object_id = OBJECT_ID('fact.ExecutableMechanic')
      AND keyConstraint.type = 'PK'
      AND columnDefinition.name = 'RootId'
)
BEGIN
    ALTER TABLE fact.ExecutableMechanic DROP CONSTRAINT PK_ExecutableMechanic;
    ALTER TABLE fact.ExecutableMechanic ADD CONSTRAINT PK_ExecutableMechanic PRIMARY KEY NONCLUSTERED (IndexId, RootId, ExecutableMechanicFactId);
END;
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ExecutableMechanic_ScanRoot')
    ALTER TABLE fact.ExecutableMechanic ADD CONSTRAINT FK_ExecutableMechanic_ScanRoot FOREIGN KEY (IndexId, RootId) REFERENCES inventory.Scan(IndexId, RootId);

COMMIT TRANSACTION;
GO
