SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadDataFlows
    @IndexId varchar(120),
    @DataflowsJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO fact.DataFlow (IndexId, DataflowId, DataflowKind, FromCandidate, FromBindingKind, ToCandidate, ToBindingKind, ToRole, CalleeCandidate, ArgumentIndex, EnclosingSymbolId, EnclosingSymbolResolution, SourceReferenceId)
    SELECT @IndexId, DataflowId, DataflowKind, FromCandidate, FromBindingKind, ToCandidate, ToBindingKind, ToRole, CalleeCandidate, ArgumentIndex, EnclosingSymbolId, EnclosingSymbolResolution, SourceReferenceId
    FROM OPENJSON(@DataflowsJson) WITH (
        DataflowId                varchar(120)  '$.dataflowId',
        DataflowKind              varchar(80)   '$.dataflowKind',
        FromCandidate             nvarchar(800) '$.fromCandidate',
        FromBindingKind           varchar(80)   '$.fromBindingKind',
        ToCandidate               nvarchar(800) '$.toCandidate',
        ToBindingKind             varchar(80)   '$.toBindingKind',
        ToRole                    varchar(80)   '$.toRole',
        CalleeCandidate           nvarchar(800) '$.calleeCandidate',
        ArgumentIndex             int           '$.argumentIndex',
        EnclosingSymbolId         nvarchar(900) '$.enclosingSymbolId',
        EnclosingSymbolResolution varchar(40)   '$.enclosingSymbolResolution',
        SourceReferenceId         nvarchar(900) '$.sourceReferenceId'
    );

    SELECT COUNT(*) AS RecordCount FROM fact.DataFlow WHERE IndexId = @IndexId;
END
GO
