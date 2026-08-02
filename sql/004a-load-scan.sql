SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadScan
    @Payload nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO inventory.Scan (
        IndexId, ScanId, IndexType, IndexSchemaVersion, EngineName, EngineVersion,
        WorkspaceId, WorkspaceRoot, WorkspaceRootHash, LanguageId, LanguageProfileVersion,
        DocumentRootHash, FilesObserved, DeclarationCount, RelationshipCount, ControlFlowCount,
        SyntaxCount, UnknownSyntaxCount, DocumentFactCount, GovernanceRuleCount, BodyMechanicCount,
        DataflowCount, UnknownSyntaxRatio
    )
    SELECT
        j.IndexId, j.ScanId, j.IndexType, j.IndexSchemaVersion, j.EngineName, j.EngineVersion,
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

    SELECT IndexId, ScanId, WorkspaceId, FilesObserved FROM inventory.Scan WHERE IndexId = JSON_VALUE(@Payload, '$.indexId');
END
GO
