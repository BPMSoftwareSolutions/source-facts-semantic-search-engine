SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadExecutableMechanics
    @IndexId varchar(120),
    @BodyMechanicsJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO fact.ExecutableMechanic (IndexId, ExecutableMechanicFactId, MechanicKind, ModulePath, SourceReferenceId, FromSymbolId, EvidenceKind, Classification, VerificationDisposition)
    SELECT @IndexId, MechanicId, MechanicKind, ModulePath, SourceReferenceId, FromSymbolId, EvidenceKind, Classification, VerificationDisposition
    FROM OPENJSON(@BodyMechanicsJson) WITH (
        MechanicId               varchar(120)   '$.mechanicId',
        MechanicKind             varchar(40)    '$.mechanic',
        ModulePath               nvarchar(1024) '$.modulePath',
        SourceReferenceId        nvarchar(900)  '$.sourceReferenceId',
        FromSymbolId             nvarchar(900)  '$.fromSymbolId',
        EvidenceKind             varchar(80)    '$.evidenceKind',
        Classification           varchar(80)    '$.classification',
        VerificationDisposition  varchar(80)    '$.verificationDisposition'
    );

    SELECT COUNT(*) AS RecordCount FROM fact.ExecutableMechanic WHERE IndexId = @IndexId;
END
GO
