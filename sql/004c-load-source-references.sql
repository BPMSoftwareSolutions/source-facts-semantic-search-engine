SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadSourceReferences
    @IndexId varchar(120),
    @SourceReferencesJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO source.SourceReference (IndexId, SourceReferenceId, ModulePath, ReferenceKind, SourceKind, StartLine, StartColumn, EndLine, EndColumn)
    SELECT @IndexId, ReferenceId, ModulePath, ReferenceKind, SourceKind, StartLine, StartColumn, EndLine, EndColumn
    FROM OPENJSON(@SourceReferencesJson) WITH (
        ReferenceId   nvarchar(900)  '$.referenceId',
        ModulePath    nvarchar(1024) '$.modulePath',
        ReferenceKind varchar(40)    '$.kind',
        SourceKind    varchar(80)    '$.sourceKind',
        StartLine     int            '$.startLine',
        StartColumn   int            '$.startColumn',
        EndLine       int            '$.endLine',
        EndColumn     int            '$.endColumn'
    );

    SELECT COUNT(*) AS RecordCount FROM source.SourceReference WHERE IndexId = @IndexId;
END
GO
