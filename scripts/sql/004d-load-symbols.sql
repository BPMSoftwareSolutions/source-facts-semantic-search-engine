SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadSymbols
    @IndexId varchar(120),
    @SymbolsJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO source.Symbol (IndexId, SymbolId, SymbolKind, Name, ModulePath, SourceReferenceId, DeclarationLine, DeclarationColumn, DeclarationHeaderHash, SymbolVersionId, SourceKind, ModuleHash, ScopePartsJson)
    SELECT @IndexId, SymbolId, SymbolKind, Name, ModulePath, SourceReferenceId, DeclarationLine, DeclarationColumn, DeclarationHeaderHash, SymbolVersionId, SourceKind, ModuleHash, ScopePartsJson
    FROM OPENJSON(@SymbolsJson) WITH (
        SymbolId              nvarchar(900)  '$.symbolId',
        SymbolKind            varchar(40)    '$.kind',
        Name                  nvarchar(400)  '$.name',
        ModulePath             nvarchar(1024) '$.modulePath',
        SourceReferenceId       nvarchar(900) '$.sourceReferenceId',
        DeclarationLine int '$.declarationLine',
        DeclarationColumn int '$.declarationColumn',
        DeclarationHeaderHash varchar(120) '$.declarationHeaderHash',
        SymbolVersionId       varchar(120) '$.symbolVersionId',
        SourceKind             varchar(80) '$.sourceKind',
        ModuleHash              varchar(120) '$.moduleHash',
        ScopePartsJson          nvarchar(max) '$.scopeParts' AS JSON
    );

    SELECT COUNT(*) AS RecordCount FROM source.Symbol WHERE IndexId = @IndexId;
END
GO
