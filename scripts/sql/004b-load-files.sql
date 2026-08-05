SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadFiles
    @IndexId varchar(120),
    @FilesJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO inventory.SourceFile (IndexId, RootId, FileId, RelativePath, ContentHash, DeclarationCount, RelationshipCount, ControlFlowCount, SyntaxCount, UnknownSyntaxCount)
    SELECT @IndexId, COALESCE(source.RootId, scan.WorkspaceId), source.FileId, source.RelativePath, source.ContentHash, source.DeclarationCount, source.RelationshipCount, source.ControlFlowCount, source.SyntaxCount, source.UnknownSyntaxCount
    FROM OPENJSON(@FilesJson) WITH (
        RootId             nvarchar(400) '$.rootId',
        FileId             varchar(120)   '$.fileId',
        RelativePath       nvarchar(1024) '$.relativePath',
        ContentHash        varchar(120)   '$.contentHash',
        DeclarationCount   int            '$.counts.declarations',
        RelationshipCount  int            '$.counts.relationships',
        ControlFlowCount   int            '$.counts.controlFlow',
        SyntaxCount        int            '$.counts.syntax',
        UnknownSyntaxCount int            '$.counts.unknownSyntax'
    ) AS source
    JOIN inventory.Scan AS scan
        ON scan.IndexId = @IndexId;

    SELECT COUNT(*) AS RecordCount FROM inventory.SourceFile WHERE IndexId = @IndexId;
END
GO
