SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadRelationships
    @IndexId varchar(120),
    @RelationshipsJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO fact.Relationship (IndexId, RelationshipId, RelationshipKind, SourceReferenceId, FromSymbolId, FromSymbolResolution, ToSymbolId, ToSymbolCandidate, Operator)
    SELECT @IndexId, RelationshipId, RelationshipKind, SourceReferenceId, FromSymbolId, FromSymbolResolution, ToSymbolId, ToSymbolCandidate, Operator
    FROM OPENJSON(@RelationshipsJson) WITH (
        RelationshipId        varchar(120)   '$.relationshipId',
        RelationshipKind      varchar(80)    '$.relationshipKind',
        SourceReferenceId     nvarchar(900)  '$.sourceReferenceId',
        FromSymbolId          nvarchar(900)  '$.fromSymbolId',
        FromSymbolResolution  varchar(40)    '$.fromSymbolResolution',
        ToSymbolId            nvarchar(900)  '$.toSymbolId',
        ToSymbolCandidate     nvarchar(800)  '$.toSymbolCandidate',
        Operator              varchar(80)    '$.operator'
    );

    SELECT COUNT(*) AS RecordCount FROM fact.Relationship WHERE IndexId = @IndexId;
END
GO
