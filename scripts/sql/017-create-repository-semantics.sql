-- Current normalized knowledge projected from the exact SQL-backed repository
-- image. These rows remain observation, never canonical authority by inference.
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

IF OBJECT_ID('observation.RepositorySemanticAnalysis', 'U') IS NULL
BEGIN
CREATE TABLE observation.RepositorySemanticAnalysis
(
    RootId nvarchar(400) NOT NULL,
    AnalysisType varchar(80) NOT NULL,
    AnalyzerVersion varchar(40) NOT NULL,
    ImageDigest varchar(80) NOT NULL,
    AnalysisDigest varchar(80) NOT NULL,
    ArtifactCount int NOT NULL,
    SemanticFactCount int NOT NULL,
    SummaryJson nvarchar(max) NOT NULL,
    AnalyzedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositorySemanticAnalysis_AnalyzedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_RepositorySemanticAnalysis PRIMARY KEY (RootId),
    CONSTRAINT FK_RepositorySemanticAnalysis_Image FOREIGN KEY (RootId) REFERENCES inventory.RepositoryImage(RootId),
    CONSTRAINT CK_RepositorySemanticAnalysis_Type CHECK (AnalysisType = 'repository-semantic-analysis.v1'),
    CONSTRAINT CK_RepositorySemanticAnalysis_Counts CHECK (ArtifactCount >= 0 AND SemanticFactCount >= 0),
    CONSTRAINT CK_RepositorySemanticAnalysis_Summary CHECK (ISJSON(SummaryJson) = 1)
);
END;
GO

IF OBJECT_ID('observation.RepositoryArtifactSemanticCoverage', 'U') IS NULL
BEGIN
CREATE TABLE observation.RepositoryArtifactSemanticCoverage
(
    RootId nvarchar(400) NOT NULL,
    RelativePath nvarchar(1024) NOT NULL,
    ArtifactPathKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', RootId + N'|' + RelativePath)) PERSISTED,
    ContentDigest varchar(80) NOT NULL,
    MediaType nvarchar(160) NOT NULL,
    ArtifactClass varchar(80) NOT NULL,
    AnalyzerId varchar(120) NOT NULL,
    AnalysisDisposition varchar(80) NOT NULL,
    SemanticFactCount int NOT NULL,
    Diagnostic nvarchar(max) NULL,
    CONSTRAINT PK_RepositoryArtifactSemanticCoverage PRIMARY KEY NONCLUSTERED (RootId, ArtifactPathKey),
    CONSTRAINT FK_RepositoryArtifactSemanticCoverage_Analysis FOREIGN KEY (RootId) REFERENCES observation.RepositorySemanticAnalysis(RootId),
    CONSTRAINT FK_RepositoryArtifactSemanticCoverage_Artifact FOREIGN KEY (RootId, ArtifactPathKey) REFERENCES inventory.RepositoryArtifact(RootId, ArtifactPathKey),
    CONSTRAINT CK_RepositoryArtifactSemanticCoverage_Count CHECK (SemanticFactCount >= 0),
    CONSTRAINT CK_RepositoryArtifactSemanticCoverage_Disposition CHECK (AnalysisDisposition IN
        ('SEMANTIC_FACTS_PROJECTED', 'DELEGATED_TO_SOURCE_FACT_ENGINE', 'EXACT_CONTENT_ONLY', 'BINARY_CONTENT', 'ANALYZER_FAILED'))
);
END;
GO

IF OBJECT_ID('observation.RepositorySemanticFact', 'U') IS NULL
BEGIN
CREATE TABLE observation.RepositorySemanticFact
(
    RootId nvarchar(400) NOT NULL,
    FactId varchar(80) NOT NULL,
    RelativePath nvarchar(1024) NOT NULL,
    ArtifactPathKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', RootId + N'|' + RelativePath)) PERSISTED,
    FactOrdinal int NOT NULL,
    FactKind varchar(120) NOT NULL,
    FactName nvarchar(1024) NULL,
    FactValue nvarchar(max) NULL,
    StartLine int NULL,
    StartColumn int NULL,
    DetailJson nvarchar(max) NULL,
    AuthorityDisposition varchar(80) NOT NULL,
    CONSTRAINT PK_RepositorySemanticFact PRIMARY KEY NONCLUSTERED (RootId, FactId),
    CONSTRAINT FK_RepositorySemanticFact_Coverage FOREIGN KEY (RootId, ArtifactPathKey) REFERENCES observation.RepositoryArtifactSemanticCoverage(RootId, ArtifactPathKey),
    CONSTRAINT CK_RepositorySemanticFact_Ordinal CHECK (FactOrdinal >= 0),
    CONSTRAINT CK_RepositorySemanticFact_Position CHECK ((StartLine IS NULL AND StartColumn IS NULL) OR (StartLine > 0 AND StartColumn > 0)),
    CONSTRAINT CK_RepositorySemanticFact_Detail CHECK (DetailJson IS NULL OR ISJSON(DetailJson) = 1),
    CONSTRAINT CK_RepositorySemanticFact_Authority CHECK (AuthorityDisposition = 'OBSERVED_NOT_ADMITTED')
);
CREATE INDEX IX_RepositorySemanticFact_Kind ON observation.RepositorySemanticFact(RootId, FactKind);
CREATE INDEX IX_RepositorySemanticFact_Path ON observation.RepositorySemanticFact(ArtifactPathKey, FactOrdinal);
END;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadRepositorySemanticAnalysis
    @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 51030, 'Repository semantic analysis payload must be valid JSON.', 1;

    DECLARE @RootId nvarchar(400) = JSON_VALUE(@PayloadJson, '$.rootId');
    DECLARE @AnalysisType varchar(80) = JSON_VALUE(@PayloadJson, '$.analysisType');
    DECLARE @AnalyzerVersion varchar(40) = JSON_VALUE(@PayloadJson, '$.analyzerVersion');
    DECLARE @ImageDigest varchar(80) = JSON_VALUE(@PayloadJson, '$.imageDigest');
    DECLARE @AnalysisDigest varchar(80) = JSON_VALUE(@PayloadJson, '$.analysisDigest');
    DECLARE @ArtifactCount int = TRY_CONVERT(int, JSON_VALUE(@PayloadJson, '$.summary.artifactsAnalyzed'));
    DECLARE @SemanticFactCount int = TRY_CONVERT(int, JSON_VALUE(@PayloadJson, '$.summary.semanticFacts'));
    DECLARE @SummaryJson nvarchar(max) = JSON_QUERY(@PayloadJson, '$.summary');

    IF NULLIF(@RootId, N'') IS NULL OR @AnalysisType <> 'repository-semantic-analysis.v1'
       OR NULLIF(@AnalyzerVersion, '') IS NULL OR NULLIF(@AnalysisDigest, '') IS NULL
        THROW 51031, 'Repository semantic analysis identity is incomplete.', 1;
    IF NOT EXISTS (SELECT 1 FROM inventory.RepositoryImage WHERE RootId = @RootId AND ImageDigest = @ImageDigest)
        THROW 51032, 'Repository semantic analysis does not match the current repository image.', 1;

    DECLARE @Coverage TABLE
    (
        RelativePath nvarchar(1024) NOT NULL, ContentDigest varchar(80) NOT NULL,
        MediaType nvarchar(160) NOT NULL, ArtifactClass varchar(80) NOT NULL,
        AnalyzerId varchar(120) NOT NULL, AnalysisDisposition varchar(80) NOT NULL,
        SemanticFactCount int NOT NULL, Diagnostic nvarchar(max) NULL
    );
    INSERT @Coverage
    SELECT RelativePath, ContentDigest, MediaType, ArtifactClass, AnalyzerId, AnalysisDisposition, SemanticFactCount, Diagnostic
    FROM OPENJSON(@PayloadJson, '$.coverage') WITH
    (
        RelativePath nvarchar(1024) '$.relativePath', ContentDigest varchar(80) '$.contentDigest',
        MediaType nvarchar(160) '$.mediaType', ArtifactClass varchar(80) '$.artifactClass',
        AnalyzerId varchar(120) '$.analyzerId', AnalysisDisposition varchar(80) '$.analysisDisposition',
        SemanticFactCount int '$.factCount', Diagnostic nvarchar(max) '$.diagnostic'
    );

    DECLARE @Facts TABLE
    (
        FactId varchar(80) NOT NULL, RelativePath nvarchar(1024) NOT NULL,
        FactOrdinal int NOT NULL, FactKind varchar(120) NOT NULL, FactName nvarchar(1024) NULL,
        FactValue nvarchar(max) NULL, StartLine int NULL, StartColumn int NULL,
        DetailJson nvarchar(max) NULL, AuthorityDisposition varchar(80) NOT NULL
    );
    INSERT @Facts
    SELECT FactId, RelativePath, FactOrdinal, FactKind, FactName, FactValue, StartLine, StartColumn,
           DetailJson, AuthorityDisposition
    FROM OPENJSON(@PayloadJson, '$.facts') WITH
    (
        FactId varchar(80) '$.factId', RelativePath nvarchar(1024) '$.relativePath',
        FactOrdinal int '$.factOrdinal', FactKind varchar(120) '$.factKind', FactName nvarchar(1024) '$.name',
        FactValue nvarchar(max) '$.value', StartLine int '$.line', StartColumn int '$.column',
        DetailJson nvarchar(max) '$.detail' AS JSON, AuthorityDisposition varchar(80) '$.authorityDisposition'
    );

    IF @ArtifactCount <> (SELECT COUNT(*) FROM @Coverage) OR @SemanticFactCount <> (SELECT COUNT(*) FROM @Facts)
        THROW 51033, 'Repository semantic analysis counts do not match the payload.', 1;
    IF EXISTS (SELECT RelativePath FROM @Coverage GROUP BY RelativePath HAVING COUNT(*) > 1)
        THROW 51034, 'Repository semantic coverage contains duplicate paths.', 1;
    IF EXISTS (SELECT FactId FROM @Facts GROUP BY FactId HAVING COUNT(*) > 1)
        THROW 51035, 'Repository semantic facts contain duplicate identities.', 1;
    IF EXISTS
    (
        SELECT 1 FROM @Coverage coverage
        LEFT JOIN inventory.RepositoryArtifact artifact
          ON artifact.RootId = @RootId AND artifact.RelativePath = coverage.RelativePath
        WHERE artifact.RootId IS NULL OR artifact.ContentDigest <> coverage.ContentDigest
    )
        THROW 51036, 'Repository semantic coverage does not match current artifact content.', 1;
    IF EXISTS
    (
        SELECT 1 FROM @Facts fact
        LEFT JOIN @Coverage coverage ON coverage.RelativePath = fact.RelativePath
        WHERE coverage.RelativePath IS NULL
    )
        THROW 51037, 'Repository semantic fact has no artifact coverage row.', 1;
    IF EXISTS
    (
        SELECT 1 FROM @Coverage coverage
        OUTER APPLY (SELECT COUNT(*) AS ActualCount FROM @Facts fact WHERE fact.RelativePath = coverage.RelativePath) counts
        WHERE coverage.SemanticFactCount <> counts.ActualCount
    )
        THROW 51038, 'Repository semantic fact counts do not match artifact coverage.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM observation.RepositorySemanticFact WHERE RootId = @RootId;
        DELETE FROM observation.RepositoryArtifactSemanticCoverage WHERE RootId = @RootId;
        MERGE observation.RepositorySemanticAnalysis AS target
        USING (SELECT @RootId AS RootId) AS source ON source.RootId = target.RootId
        WHEN MATCHED THEN UPDATE SET AnalysisType = @AnalysisType, AnalyzerVersion = @AnalyzerVersion,
            ImageDigest = @ImageDigest, AnalysisDigest = @AnalysisDigest, ArtifactCount = @ArtifactCount,
            SemanticFactCount = @SemanticFactCount, SummaryJson = @SummaryJson, AnalyzedAtUtc = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN INSERT
            (RootId, AnalysisType, AnalyzerVersion, ImageDigest, AnalysisDigest, ArtifactCount, SemanticFactCount, SummaryJson)
            VALUES (@RootId, @AnalysisType, @AnalyzerVersion, @ImageDigest, @AnalysisDigest, @ArtifactCount, @SemanticFactCount, @SummaryJson);

        INSERT observation.RepositoryArtifactSemanticCoverage
            (RootId, RelativePath, ContentDigest, MediaType, ArtifactClass, AnalyzerId, AnalysisDisposition, SemanticFactCount, Diagnostic)
        SELECT @RootId, RelativePath, ContentDigest, MediaType, ArtifactClass, AnalyzerId, AnalysisDisposition, SemanticFactCount, Diagnostic
        FROM @Coverage;

        INSERT observation.RepositorySemanticFact
            (RootId, FactId, RelativePath, FactOrdinal, FactKind, FactName, FactValue, StartLine, StartColumn, DetailJson, AuthorityDisposition)
        SELECT @RootId, FactId, RelativePath, FactOrdinal, FactKind, FactName, FactValue, StartLine, StartColumn, DetailJson, AuthorityDisposition
        FROM @Facts;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;

    SELECT CONCAT('R|', @AnalysisDigest, '|', @ArtifactCount, '|', @SemanticFactCount,
                  '|REPOSITORY_SEMANTICS_ADMITTED_AS_OBSERVATION') AS ResultLine;
END;
GO

CREATE OR ALTER VIEW reporting.CurrentRepositorySemanticCoverage
AS
SELECT analysis.RootId, analysis.ImageDigest, analysis.AnalysisDigest,
       coverage.RelativePath, coverage.ContentDigest, coverage.MediaType, coverage.ArtifactClass,
       coverage.AnalyzerId, coverage.AnalysisDisposition, coverage.SemanticFactCount, coverage.Diagnostic
FROM observation.RepositorySemanticAnalysis analysis
JOIN observation.RepositoryArtifactSemanticCoverage coverage ON coverage.RootId = analysis.RootId;
GO

CREATE OR ALTER VIEW reporting.CurrentRepositoryKnowledge
AS
SELECT analysis.RootId, analysis.ImageDigest, analysis.AnalysisDigest,
       fact.RelativePath, fact.FactOrdinal, fact.FactId, fact.FactKind,
       fact.FactName, fact.FactValue, fact.StartLine, fact.StartColumn,
       fact.DetailJson, fact.AuthorityDisposition
FROM observation.RepositorySemanticAnalysis analysis
JOIN observation.RepositorySemanticFact fact ON fact.RootId = analysis.RootId;
GO
