SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadDocuments
    @IndexId varchar(120),
    @DocumentsJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO fact.Document (IndexId, DocumentFactId, DocumentFactVersionId, RelativePath, Pointer, ValueType, ValuePreview, ValuePathJson, ScalarValueText, SourceReferenceId)
    SELECT @IndexId, DocumentFactId, DocumentFactVersionId, RelativePath, Pointer, ValueType, ValuePreview, ValuePathJson, ScalarValueText, SourceReferenceId
    FROM OPENJSON(@DocumentsJson) WITH (
        DocumentFactId        varchar(120)   '$.documentFactId',
        DocumentFactVersionId varchar(120)   '$.documentFactVersionId',
        RelativePath          nvarchar(1024) '$.relativePath',
        Pointer               nvarchar(1024) '$.pointer',
        ValueType             varchar(40)    '$.valueType',
        ValuePreview          nvarchar(400)  '$.valuePreview',
        ValuePathJson         nvarchar(max)  '$.valuePath' AS JSON,
        ScalarValueText       nvarchar(max)  '$.value',
        SourceReferenceId     nvarchar(900)  '$.sourceReferenceId'
    );

    SELECT COUNT(*) AS RecordCount FROM fact.Document WHERE IndexId = @IndexId;
END
GO
