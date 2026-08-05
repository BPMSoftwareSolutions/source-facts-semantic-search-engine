SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadScan
    @Payload nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    IF @@TRANCOUNT = 0
        THROW 51000, 'ingestion.LoadScan must run inside the atomic source-root load transaction.', 1;

    DECLARE @IndexId varchar(120) = JSON_VALUE(@Payload, '$.indexId');
    DECLARE @RootId nvarchar(400) = JSON_VALUE(@Payload, '$.workspace.workspaceId');
    DECLARE @WorkspaceRoot nvarchar(1024) = JSON_VALUE(@Payload, '$.manifest.scanRequest.workspaceRoot');
    DECLARE @PreviousIndexId varchar(120);

    IF @IndexId IS NULL OR @RootId IS NULL
        THROW 51000, 'IndexId and workspace.workspaceId (the durable RootId) are required.', 1;

    MERGE inventory.SourceRoot WITH (HOLDLOCK) AS target
    USING (SELECT @RootId AS RootId, @WorkspaceRoot AS WorkspaceRoot) AS source
       ON source.RootId = target.RootId
    WHEN MATCHED THEN
        UPDATE SET WorkspaceRoot = source.WorkspaceRoot, UpdatedAtUtc = SYSUTCDATETIME()
    WHEN NOT MATCHED THEN
        INSERT (RootId, WorkspaceRoot) VALUES (source.RootId, source.WorkspaceRoot);

    SELECT @PreviousIndexId = IndexId
    FROM inventory.Scan WITH (UPDLOCK, HOLDLOCK)
    WHERE RootId = @RootId
      AND IndexId <> @IndexId;

    IF @PreviousIndexId IS NOT NULL
    BEGIN
        IF OBJECT_ID('authority.MechanicCanonicalLineage', 'U') IS NOT NULL
            EXEC sp_executesql
                N'DELETE FROM authority.MechanicCanonicalLineage WHERE IndexId = @RetiredIndexId;',
                N'@RetiredIndexId varchar(120)',
                @RetiredIndexId = @PreviousIndexId;

        DELETE FROM fact.GovernanceRule WHERE IndexId = @PreviousIndexId;
        DELETE FROM fact.Document WHERE IndexId = @PreviousIndexId;
        DELETE FROM fact.ExecutableMechanic WHERE IndexId = @PreviousIndexId;
        DELETE FROM fact.DataFlow WHERE IndexId = @PreviousIndexId;
        DELETE FROM fact.Relationship WHERE IndexId = @PreviousIndexId;
        DELETE FROM source.Symbol WHERE IndexId = @PreviousIndexId;
        DELETE FROM source.SourceReference WHERE IndexId = @PreviousIndexId;
        DELETE FROM inventory.SourceFile WHERE IndexId = @PreviousIndexId;
        DELETE FROM inventory.Scan WHERE IndexId = @PreviousIndexId;
    END;

    INSERT INTO inventory.Scan (
        IndexId, RootId, ScanId, IndexType, IndexSchemaVersion, EngineName, EngineVersion,
        WorkspaceId, WorkspaceRoot, WorkspaceRootHash, LanguageId, LanguageProfileVersion,
        DocumentRootHash, FilesObserved, DeclarationCount, RelationshipCount, ControlFlowCount,
        SyntaxCount, UnknownSyntaxCount, DocumentFactCount, GovernanceRuleCount, BodyMechanicCount,
        DataflowCount, UnknownSyntaxRatio
    )
    SELECT
        j.IndexId, j.WorkspaceId, j.ScanId, j.IndexType, j.IndexSchemaVersion, j.EngineName, j.EngineVersion,
        j.WorkspaceId, j.WorkspaceRoot, j.WorkspaceRootHash, j.LanguageId, j.LanguageProfileVersion,
        j.DocumentRootHash, j.FilesObserved, j.DeclarationCount, j.RelationshipCount, j.ControlFlowCount,
        j.SyntaxCount, j.UnknownSyntaxCount, j.DocumentFactCount, j.GovernanceRuleCount, j.BodyMechanicCount,
        j.DataflowCount, j.UnknownSyntaxRatio
    FROM OPENJSON(@Payload) WITH (
        IndexId                 varchar(120)   '$.indexId',
        IndexType               varchar(80)    '$.indexType',
        IndexSchemaVersion      varchar(40)    '$.manifest.schemaVersion',
        EngineName              varchar(120)   '$.manifest.engine',
        EngineVersion           varchar(40)    '$.manifest.engineVersion',
        ScanId                  varchar(200)   '$.manifest.scanId',
        DocumentRootHash        varchar(120)   '$.manifest.documentRootHash',
        WorkspaceId             nvarchar(400)  '$.workspace.workspaceId',
        WorkspaceRootHash       varchar(120)   '$.workspace.rootHash',
        LanguageId              varchar(80)    '$.workspace.languageId',
        LanguageProfileVersion  varchar(40)    '$.workspace.languageProfileVersion',
        WorkspaceRoot           nvarchar(1024) '$.manifest.scanRequest.workspaceRoot',
        FilesObserved           int            '$.coverage.filesObserved',
        DeclarationCount        int            '$.coverage.declarations',
        RelationshipCount       int            '$.coverage.relationships',
        ControlFlowCount        int            '$.coverage.controlFlow',
        SyntaxCount             int            '$.coverage.syntax',
        UnknownSyntaxCount      int            '$.coverage.unknownSyntax',
        DocumentFactCount       int            '$.coverage.documentFacts',
        GovernanceRuleCount     int            '$.coverage.governanceRules',
        BodyMechanicCount       int            '$.coverage.bodyMechanics',
        DataflowCount           int            '$.coverage.dataflows',
        UnknownSyntaxRatio      decimal(9, 6)  '$.coverage.unknownSyntaxRatio'
    ) AS j;

    SELECT IndexId, RootId, ScanId, WorkspaceId, FilesObserved FROM inventory.Scan WHERE IndexId = @IndexId;
END
GO
