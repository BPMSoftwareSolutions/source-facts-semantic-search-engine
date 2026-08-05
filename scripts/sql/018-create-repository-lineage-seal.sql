-- Inexpensive, database-native governance closure. The seal binds the current
-- repository image and semantic analysis to the current canonical feature-intent
-- registry. It writes no disk receipt and never claims a digital signature.
SET XACT_ABORT ON;
SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;
GO

IF OBJECT_ID('projection.RepositoryLineageSeal', 'U') IS NULL
BEGIN
    CREATE TABLE projection.RepositoryLineageSeal
    (
        RootId nvarchar(400) NOT NULL,
        ApplicationId nvarchar(160) NOT NULL,
        RepositoryImageDigest varchar(80) NOT NULL,
        SemanticAnalysisDigest varchar(80) NOT NULL,
        CanonicalIntentContractSnapshotId varchar(80) NOT NULL,
        FeatureCount int NOT NULL,
        ClosedFeatureCount int NOT NULL,
        ScenarioCount int NOT NULL,
        ResponsibilityCount int NOT NULL,
        SemanticFactCount int NOT NULL,
        AnalyzerFailureCount int NOT NULL,
        SealAlgorithm varchar(40) NOT NULL,
        SealDigest varchar(80) NOT NULL,
        SigningDisposition varchar(80) NOT NULL,
        GovernanceDisposition varchar(100) NOT NULL,
        RefreshedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositoryLineageSeal_RefreshedAtUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_RepositoryLineageSeal PRIMARY KEY (RootId),
        CONSTRAINT FK_RepositoryLineageSeal_Image FOREIGN KEY (RootId) REFERENCES inventory.RepositoryImage(RootId),
        CONSTRAINT FK_RepositoryLineageSeal_Analysis FOREIGN KEY (RootId) REFERENCES observation.RepositorySemanticAnalysis(RootId),
        CONSTRAINT FK_RepositoryLineageSeal_Intent FOREIGN KEY (CanonicalIntentContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId),
        CONSTRAINT CK_RepositoryLineageSeal_Counts CHECK
            (FeatureCount >= 0 AND ClosedFeatureCount >= 0 AND ClosedFeatureCount <= FeatureCount
             AND ScenarioCount >= 0 AND ResponsibilityCount >= 0 AND SemanticFactCount >= 0 AND AnalyzerFailureCount >= 0),
        CONSTRAINT CK_RepositoryLineageSeal_Algorithm CHECK (SealAlgorithm = 'SHA2_256'),
        CONSTRAINT CK_RepositoryLineageSeal_Signing CHECK (SigningDisposition IN ('DIGEST_SEALED_NOT_SIGNED', 'DIGITALLY_SIGNED')),
        CONSTRAINT CK_RepositoryLineageSeal_Governance CHECK (GovernanceDisposition IN
            ('REPOSITORY_GOVERNANCE_CLOSED', 'REPOSITORY_AUTHORITY_INCOMPLETE', 'REPOSITORY_ANALYSIS_INCOMPLETE'))
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID('authority.ContractSnapshot')
      AND name = 'IX_ContractSnapshot_CurrentIntent'
)
    CREATE INDEX IX_ContractSnapshot_CurrentIntent
        ON authority.ContractSnapshot (ContractId, ProjectId, ApplicationId, LoadedAtUtc DESC)
        INCLUDE (RepositoryId);
GO

CREATE OR ALTER PROCEDURE projection.RefreshRepositoryLineageSeal
    @RootId nvarchar(400),
    @ApplicationId nvarchar(160)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @ImageDigest varchar(80);
    DECLARE @AnalysisDigest varchar(80);
    DECLARE @SemanticFactCount int;
    SELECT @ImageDigest = image.ImageDigest
    FROM inventory.RepositoryImage image WHERE image.RootId = @RootId;
    SELECT @AnalysisDigest = analysis.AnalysisDigest, @SemanticFactCount = analysis.SemanticFactCount
    FROM observation.RepositorySemanticAnalysis analysis
    WHERE analysis.RootId = @RootId AND analysis.ImageDigest = @ImageDigest;
    IF @ImageDigest IS NULL THROW 51040, 'Current repository image is required before lineage sealing.', 1;
    IF @AnalysisDigest IS NULL THROW 51041, 'Current matching semantic analysis is required before lineage sealing.', 1;

    DECLARE @ContractSnapshotId varchar(80) =
    (
        SELECT TOP (1) snapshot.ContractSnapshotId
        FROM authority.ContractSnapshot snapshot
        WHERE snapshot.ContractId = N'canonical-feature-intent-registry.v1'
          AND snapshot.ProjectId = @RootId
          AND snapshot.ApplicationId = @ApplicationId
          AND snapshot.RepositoryId = @RootId
        ORDER BY snapshot.LoadedAtUtc DESC, snapshot.ContractSnapshotId DESC
    );
    IF @ContractSnapshotId IS NULL THROW 51042, 'Current canonical feature-intent registry is required before lineage sealing.', 1;

    DECLARE @FeatureCount int = (SELECT COUNT(*) FROM lineage.Feature WHERE ContractSnapshotId = @ContractSnapshotId);
    DECLARE @ClosedFeatureCount int =
    (
        SELECT COUNT(*) FROM lineage.Feature
        WHERE ContractSnapshotId = @ContractSnapshotId
          AND LifecycleStatus = 'FEATURE_INTENT_ADMITTED'
          AND AuthorityStatus = 'FEATURE_LINEAGE_CLOSED'
    );
    DECLARE @ScenarioCount int = (SELECT COUNT(*) FROM lineage.Scenario WHERE ContractSnapshotId = @ContractSnapshotId);
    DECLARE @ResponsibilityCount int = (SELECT COUNT(*) FROM lineage.Responsibility WHERE ContractSnapshotId = @ContractSnapshotId);
    DECLARE @AnalyzerFailureCount int =
    (
        SELECT COUNT(*) FROM observation.RepositoryArtifactSemanticCoverage
        WHERE RootId = @RootId AND AnalysisDisposition = 'ANALYZER_FAILED'
    );
    DECLARE @GovernanceDisposition varchar(100) = CASE
        WHEN @AnalyzerFailureCount > 0 THEN 'REPOSITORY_ANALYSIS_INCOMPLETE'
        WHEN @FeatureCount = 0 OR @ClosedFeatureCount <> @FeatureCount THEN 'REPOSITORY_AUTHORITY_INCOMPLETE'
        ELSE 'REPOSITORY_GOVERNANCE_CLOSED'
    END;
    DECLARE @SealMaterial varchar(max) = CONCAT(
        'repository-lineage-seal.v1|', @RootId, '|', @ApplicationId, '|', @ImageDigest, '|', @AnalysisDigest, '|',
        @ContractSnapshotId, '|', @FeatureCount, '|', @ClosedFeatureCount, '|', @ScenarioCount, '|',
        @ResponsibilityCount, '|', @SemanticFactCount, '|', @AnalyzerFailureCount, '|', @GovernanceDisposition
    );
    DECLARE @SealDigest varchar(80) = CONCAT('sha256:', LOWER(CONVERT(varchar(64), HASHBYTES('SHA2_256', @SealMaterial), 2)));

    MERGE projection.RepositoryLineageSeal AS target
    USING (SELECT @RootId AS RootId) AS source ON source.RootId = target.RootId
    WHEN MATCHED THEN UPDATE SET
        ApplicationId = @ApplicationId, RepositoryImageDigest = @ImageDigest,
        SemanticAnalysisDigest = @AnalysisDigest, CanonicalIntentContractSnapshotId = @ContractSnapshotId,
        FeatureCount = @FeatureCount, ClosedFeatureCount = @ClosedFeatureCount,
        ScenarioCount = @ScenarioCount, ResponsibilityCount = @ResponsibilityCount,
        SemanticFactCount = @SemanticFactCount, AnalyzerFailureCount = @AnalyzerFailureCount,
        SealAlgorithm = 'SHA2_256', SealDigest = @SealDigest,
        SigningDisposition = 'DIGEST_SEALED_NOT_SIGNED', GovernanceDisposition = @GovernanceDisposition,
        RefreshedAtUtc = SYSUTCDATETIME()
    WHEN NOT MATCHED THEN INSERT
        (RootId, ApplicationId, RepositoryImageDigest, SemanticAnalysisDigest, CanonicalIntentContractSnapshotId,
         FeatureCount, ClosedFeatureCount, ScenarioCount, ResponsibilityCount, SemanticFactCount,
         AnalyzerFailureCount, SealAlgorithm, SealDigest, SigningDisposition, GovernanceDisposition)
        VALUES
        (@RootId, @ApplicationId, @ImageDigest, @AnalysisDigest, @ContractSnapshotId,
         @FeatureCount, @ClosedFeatureCount, @ScenarioCount, @ResponsibilityCount, @SemanticFactCount,
         @AnalyzerFailureCount, 'SHA2_256', @SealDigest, 'DIGEST_SEALED_NOT_SIGNED', @GovernanceDisposition);

    SELECT CONCAT('R|', @SealDigest, '|', @GovernanceDisposition, '|', @FeatureCount, '|', @ClosedFeatureCount,
                  '|', @ScenarioCount, '|', @ResponsibilityCount, '|', @SemanticFactCount, '|', @AnalyzerFailureCount,
                  '|', @ContractSnapshotId) AS ResultLine;
END;
GO

CREATE OR ALTER VIEW projection.CurrentRepositoryGovernanceClosure
AS
WITH CurrentValues AS
(
    SELECT seal.*,
           image.ImageDigest AS CurrentImageDigest,
           analysis.ImageDigest AS AnalysisImageDigest,
           analysis.AnalysisDigest AS CurrentAnalysisDigest,
           analysis.SemanticFactCount AS CurrentSemanticFactCount,
           snapshot.ContractSnapshotId AS CurrentContractSnapshotId,
           latestSnapshot.ContractSnapshotId AS LatestContractSnapshotId,
           CONCAT(
               'repository-lineage-seal.v1|', seal.RootId, '|', seal.ApplicationId, '|', seal.RepositoryImageDigest, '|',
               seal.SemanticAnalysisDigest, '|', seal.CanonicalIntentContractSnapshotId, '|', seal.FeatureCount, '|',
               seal.ClosedFeatureCount, '|', seal.ScenarioCount, '|', seal.ResponsibilityCount, '|',
               seal.SemanticFactCount, '|', seal.AnalyzerFailureCount, '|', seal.GovernanceDisposition
           ) AS SealMaterial
    FROM projection.RepositoryLineageSeal seal
    LEFT JOIN inventory.RepositoryImage image ON image.RootId = seal.RootId
    LEFT JOIN observation.RepositorySemanticAnalysis analysis ON analysis.RootId = seal.RootId
    LEFT JOIN authority.ContractSnapshot snapshot ON snapshot.ContractSnapshotId = seal.CanonicalIntentContractSnapshotId
    OUTER APPLY
    (
        SELECT TOP (1) candidate.ContractSnapshotId
        FROM authority.ContractSnapshot candidate
        WHERE candidate.ContractId = N'canonical-feature-intent-registry.v1'
          AND candidate.ProjectId = seal.RootId
          AND candidate.ApplicationId = seal.ApplicationId
          AND candidate.RepositoryId = seal.RootId
        ORDER BY candidate.LoadedAtUtc DESC, candidate.ContractSnapshotId DESC
    ) latestSnapshot
), Evaluated AS
(
    SELECT currentValues.*,
           CONCAT('sha256:', LOWER(CONVERT(varchar(64), HASHBYTES('SHA2_256', CONVERT(varchar(max), SealMaterial)), 2))) AS ExpectedSealDigest
    FROM CurrentValues currentValues
)
SELECT RootId, ApplicationId, RepositoryImageDigest, SemanticAnalysisDigest,
       CanonicalIntentContractSnapshotId, FeatureCount, ClosedFeatureCount,
       ScenarioCount, ResponsibilityCount, SemanticFactCount, AnalyzerFailureCount,
       SealAlgorithm, SealDigest, SigningDisposition, GovernanceDisposition,
       CASE
           WHEN CurrentImageDigest IS NULL OR CurrentAnalysisDigest IS NULL OR CurrentContractSnapshotId IS NULL THEN 'LINEAGE_SEAL_SUBJECT_MISSING'
           WHEN RepositoryImageDigest <> CurrentImageDigest OR AnalysisImageDigest <> CurrentImageDigest
                OR SemanticAnalysisDigest <> CurrentAnalysisDigest OR SemanticFactCount <> CurrentSemanticFactCount
                OR CanonicalIntentContractSnapshotId <> LatestContractSnapshotId THEN 'LINEAGE_SEAL_STALE'
           WHEN SealDigest <> ExpectedSealDigest THEN 'LINEAGE_SEAL_INVALID'
           ELSE 'LINEAGE_SEAL_VALID'
       END AS SealIntegrityDisposition,
       RefreshedAtUtc
FROM Evaluated;
GO
