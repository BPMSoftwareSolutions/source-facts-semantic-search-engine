SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

-- Used by the loader to decide whether an IndexId is already fully loaded before
-- attempting any inserts, and to report existing counts on an already-admitted load.
CREATE OR ALTER PROCEDURE ingestion.CountsForIndex
    @IndexId varchar(120)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CASE WHEN EXISTS (SELECT 1 FROM inventory.Scan WHERE IndexId = @IndexId) THEN 1 ELSE 0 END AS ScanExists,
        (SELECT COUNT(*) FROM inventory.SourceFile WHERE IndexId = @IndexId)      AS FilesLoaded,
        (SELECT COUNT(*) FROM source.Symbol WHERE IndexId = @IndexId)             AS SymbolsLoaded,
        (SELECT COUNT(*) FROM fact.Relationship WHERE IndexId = @IndexId)         AS RelationshipsLoaded,
        (SELECT COUNT(*) FROM fact.DataFlow WHERE IndexId = @IndexId)             AS DataflowsLoaded,
        (SELECT COUNT(*) FROM source.SourceReference WHERE IndexId = @IndexId)    AS SourceReferencesLoaded,
        (SELECT COUNT(*) FROM fact.Document WHERE IndexId = @IndexId)             AS DocumentsLoaded,
        (SELECT COUNT(*) FROM fact.GovernanceRule WHERE IndexId = @IndexId)       AS GovernanceRulesLoaded,
        (SELECT COUNT(*) FROM fact.ExecutableMechanic WHERE IndexId = @IndexId)   AS BodyMechanicsLoaded;
END
GO
