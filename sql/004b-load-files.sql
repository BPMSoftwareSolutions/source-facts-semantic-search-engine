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

    INSERT INTO inventory.SourceFile (IndexId, FileId, RelativePath, ContentHash, DeclarationCount, RelationshipCount, ControlFlowCount, SyntaxCount, UnknownSyntaxCount)
    SELECT @IndexId, FileId, RelativePath, ContentHash, DeclarationCount, RelationshipCount, ControlFlowCount, SyntaxCount, UnknownSyntaxCount
    FROM OPENJSON(@FilesJson) WITH (
        FileId             varchar(120)   '$.fileId',
        RelativePath       nvarchar(1024) '$.relativePath',
        ContentHash        varchar(120)   '$.contentHash',
        DeclarationCount   int            '$.counts.declarations',
        RelationshipCount  int            '$.counts.relationships',
        ControlFlowCount   int            '$.counts.controlFlow',
        SyntaxCount        int            '$.counts.syntax',
        UnknownSyntaxCount int            '$.counts.unknownSyntax'
    );

    SELECT COUNT(*) AS RecordCount FROM inventory.SourceFile WHERE IndexId = @IndexId;
END
GO
