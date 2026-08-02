SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.RecordLoadReceipt
    @IndexId varchar(120),
    @Disposition varchar(40),
    @AlreadyLoaded bit,
    @FilesLoaded int,
    @SymbolsLoaded int,
    @RelationshipsLoaded int,
    @DataflowsLoaded int,
    @SourceReferencesLoaded int,
    @DocumentsLoaded int,
    @GovernanceRulesLoaded int,
    @BodyMechanicsLoaded int,
    @StepsJson nvarchar(max),
    @TotalElapsedMs int
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ReceiptId uniqueidentifier = NEWID();

    INSERT INTO ingestion.Receipt (
        ReceiptId, IndexId, Disposition, AlreadyLoaded,
        FilesLoaded, SymbolsLoaded, RelationshipsLoaded, DataflowsLoaded,
        SourceReferencesLoaded, DocumentsLoaded, GovernanceRulesLoaded, BodyMechanicsLoaded,
        StepsJson, TotalElapsedMs
    )
    VALUES (
        @ReceiptId, @IndexId, @Disposition, @AlreadyLoaded,
        @FilesLoaded, @SymbolsLoaded, @RelationshipsLoaded, @DataflowsLoaded,
        @SourceReferencesLoaded, @DocumentsLoaded, @GovernanceRulesLoaded, @BodyMechanicsLoaded,
        @StepsJson, @TotalElapsedMs
    );

    SELECT ReceiptId, LoadedAtUtc
    FROM ingestion.Receipt
    WHERE ReceiptId = @ReceiptId;
END
GO
