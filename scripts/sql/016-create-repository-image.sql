-- Exact, current-state repository content for database-only workspace projection.
-- This is an observation plane. Capturing bytes never admits their meaning as
-- canonical authority. One RootId has one current image; identical content is
-- stored once globally by sha256 digest.
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

IF OBJECT_ID('inventory.RepositoryContent', 'U') IS NULL
BEGIN
    CREATE TABLE inventory.RepositoryContent
    (
        ContentDigest varchar(80) NOT NULL,
        ByteLength bigint NOT NULL,
        Content varbinary(max) NOT NULL,
        CONSTRAINT PK_RepositoryContent PRIMARY KEY (ContentDigest),
        CONSTRAINT CK_RepositoryContent_ByteLength CHECK (ByteLength >= 0 AND ByteLength = DATALENGTH(Content))
    );
END;
GO

IF OBJECT_ID('inventory.RepositoryImage', 'U') IS NULL
BEGIN
    CREATE TABLE inventory.RepositoryImage
    (
        RootId nvarchar(400) NOT NULL,
        ImageType varchar(80) NOT NULL,
        WorkspaceRoot nvarchar(1024) NULL,
        DiscoveryMode varchar(80) NOT NULL,
        ImageDigest varchar(80) NOT NULL,
        ArtifactCount int NOT NULL,
        TotalByteLength bigint NOT NULL,
        DirectoriesJson nvarchar(max) NOT NULL,
        CapturedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositoryImage_CapturedAtUtc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_RepositoryImage PRIMARY KEY (RootId),
        CONSTRAINT FK_RepositoryImage_SourceRoot FOREIGN KEY (RootId) REFERENCES inventory.SourceRoot(RootId),
        CONSTRAINT CK_RepositoryImage_Type CHECK (ImageType = 'repository-current-image.v1'),
        CONSTRAINT CK_RepositoryImage_Directories CHECK (ISJSON(DirectoriesJson) = 1),
        CONSTRAINT CK_RepositoryImage_Counts CHECK (ArtifactCount >= 0 AND TotalByteLength >= 0)
    );
END;
GO

IF OBJECT_ID('inventory.RepositoryArtifact', 'U') IS NULL
BEGIN
    CREATE TABLE inventory.RepositoryArtifact
    (
        RootId nvarchar(400) NOT NULL,
        RelativePath nvarchar(1024) NOT NULL,
        ArtifactPathKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', RootId + N'|' + RelativePath)) PERSISTED,
        ArtifactType varchar(40) NOT NULL,
        ArtifactClass varchar(80) NOT NULL,
        MediaType nvarchar(160) NOT NULL,
        Encoding varchar(40) NULL,
        FileMode varchar(12) NOT NULL,
        ByteLength bigint NOT NULL,
        ContentDigest varchar(80) NOT NULL,
        AuthorityDisposition varchar(80) NOT NULL,
        CONSTRAINT PK_RepositoryArtifact PRIMARY KEY NONCLUSTERED (RootId, ArtifactPathKey),
        CONSTRAINT FK_RepositoryArtifact_Image FOREIGN KEY (RootId) REFERENCES inventory.RepositoryImage(RootId),
        CONSTRAINT FK_RepositoryArtifact_Content FOREIGN KEY (ContentDigest) REFERENCES inventory.RepositoryContent(ContentDigest),
        CONSTRAINT CK_RepositoryArtifact_Type CHECK (ArtifactType IN ('file', 'symbolic-link')),
        CONSTRAINT CK_RepositoryArtifact_Authority CHECK (AuthorityDisposition = 'OBSERVED_NOT_ADMITTED'),
        CONSTRAINT CK_RepositoryArtifact_ByteLength CHECK (ByteLength >= 0)
    );
    CREATE UNIQUE INDEX UQ_RepositoryArtifact_RootPath ON inventory.RepositoryArtifact(ArtifactPathKey);
    CREATE INDEX IX_RepositoryArtifact_ContentDigest ON inventory.RepositoryArtifact(ContentDigest);
END;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadRepositoryImage
    @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 51010, 'Repository image payload must be valid JSON.', 1;

    DECLARE @RootId nvarchar(400) = JSON_VALUE(@PayloadJson, '$.rootId');
    DECLARE @ImageType varchar(80) = JSON_VALUE(@PayloadJson, '$.imageType');
    DECLARE @WorkspaceRoot nvarchar(1024) = JSON_VALUE(@PayloadJson, '$.workspaceRoot');
    DECLARE @DiscoveryMode varchar(80) = JSON_VALUE(@PayloadJson, '$.discoveryMode');
    DECLARE @ImageDigest varchar(80) = JSON_VALUE(@PayloadJson, '$.imageDigest');
    DECLARE @ArtifactCount int = TRY_CONVERT(int, JSON_VALUE(@PayloadJson, '$.artifactCount'));
    DECLARE @TotalByteLength bigint = TRY_CONVERT(bigint, JSON_VALUE(@PayloadJson, '$.totalByteLength'));
    DECLARE @DirectoriesJson nvarchar(max) = JSON_QUERY(@PayloadJson, '$.directories');

    IF NULLIF(@RootId, N'') IS NULL OR @ImageType <> 'repository-current-image.v1' OR NULLIF(@ImageDigest, '') IS NULL
        THROW 51011, 'Repository image identity is incomplete.', 1;
    IF @ArtifactCount IS NULL OR @TotalByteLength IS NULL OR @DirectoriesJson IS NULL
        THROW 51012, 'Repository image counts or directory manifest are incomplete.', 1;

    DECLARE @Artifacts TABLE
    (
        RelativePath nvarchar(1024) NOT NULL,
        ArtifactType varchar(40) NOT NULL,
        ArtifactClass varchar(80) NOT NULL,
        MediaType nvarchar(160) NOT NULL,
        Encoding varchar(40) NULL,
        FileMode varchar(12) NOT NULL,
        ByteLength bigint NOT NULL,
        ContentDigest varchar(80) NOT NULL,
        AuthorityDisposition varchar(80) NOT NULL,
        Content varbinary(max) NOT NULL
    );

    INSERT INTO @Artifacts
    SELECT source.RelativePath, source.ArtifactType, source.ArtifactClass, source.MediaType,
           source.Encoding, source.FileMode, source.ByteLength, source.ContentDigest,
           source.AuthorityDisposition,
           CAST(N'' AS xml).value('xs:base64Binary(sql:column("source.ContentBase64"))', 'varbinary(max)')
    FROM OPENJSON(@PayloadJson, '$.artifacts') WITH
    (
        RelativePath nvarchar(1024) '$.relativePath', ArtifactType varchar(40) '$.artifactType',
        ArtifactClass varchar(80) '$.artifactClass', MediaType nvarchar(160) '$.mediaType',
        Encoding varchar(40) '$.encoding', FileMode varchar(12) '$.fileMode',
        ByteLength bigint '$.byteLength', ContentDigest varchar(80) '$.contentDigest',
        AuthorityDisposition varchar(80) '$.authorityDisposition', ContentBase64 nvarchar(max) '$.contentBase64'
    ) source;

    IF @ArtifactCount <> (SELECT COUNT(*) FROM @Artifacts)
        THROW 51013, 'Repository image artifact count does not match its payload.', 1;
    IF @TotalByteLength <> (SELECT COALESCE(SUM(ByteLength), 0) FROM @Artifacts)
        THROW 51014, 'Repository image total byte length does not match its payload.', 1;
    IF EXISTS (SELECT RelativePath FROM @Artifacts GROUP BY RelativePath HAVING COUNT(*) > 1)
        THROW 51015, 'Repository image contains duplicate relative paths.', 1;
    IF EXISTS
    (
        SELECT 1 FROM @Artifacts
        WHERE ByteLength <> DATALENGTH(Content)
           OR ContentDigest <> CONCAT('sha256:', LOWER(CONVERT(varchar(64), HASHBYTES('SHA2_256', Content), 2)))
    )
        THROW 51016, 'Repository artifact bytes do not match their declared digest or length.', 1;

    BEGIN TRY
        BEGIN TRANSACTION;
        MERGE inventory.SourceRoot WITH (HOLDLOCK) AS target
        USING (SELECT @RootId AS RootId, @WorkspaceRoot AS WorkspaceRoot) AS source
        ON source.RootId = target.RootId
        WHEN MATCHED THEN UPDATE SET WorkspaceRoot = source.WorkspaceRoot, UpdatedAtUtc = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN INSERT (RootId, WorkspaceRoot) VALUES (source.RootId, source.WorkspaceRoot);

        IF EXISTS
        (
            SELECT 1 FROM @Artifacts source
            JOIN inventory.RepositoryContent target ON target.ContentDigest = source.ContentDigest
            WHERE target.ByteLength <> source.ByteLength OR target.Content <> source.Content
        )
            THROW 51017, 'A repository content digest conflicts with stored bytes.', 1;

        INSERT inventory.RepositoryContent (ContentDigest, ByteLength, Content)
        SELECT source.ContentDigest, MAX(source.ByteLength), MAX(source.Content)
        FROM @Artifacts source
        WHERE NOT EXISTS (SELECT 1 FROM inventory.RepositoryContent target WHERE target.ContentDigest = source.ContentDigest)
        GROUP BY source.ContentDigest;

        -- Semantic analysis is derived from the exact current image. Replacing
        -- that image invalidates the derived rows before artifact replacement.
        IF OBJECT_ID('observation.RepositorySemanticFact', 'U') IS NOT NULL
            DELETE FROM observation.RepositorySemanticFact WHERE RootId = @RootId;
        IF OBJECT_ID('observation.RepositoryArtifactSemanticCoverage', 'U') IS NOT NULL
            DELETE FROM observation.RepositoryArtifactSemanticCoverage WHERE RootId = @RootId;
        IF OBJECT_ID('observation.RepositorySemanticAnalysis', 'U') IS NOT NULL
            DELETE FROM observation.RepositorySemanticAnalysis WHERE RootId = @RootId;

        DELETE FROM inventory.RepositoryArtifact WHERE RootId = @RootId;
        MERGE inventory.RepositoryImage AS target
        USING (SELECT @RootId AS RootId) AS source ON source.RootId = target.RootId
        WHEN MATCHED THEN UPDATE SET ImageType = @ImageType, WorkspaceRoot = @WorkspaceRoot,
            DiscoveryMode = @DiscoveryMode, ImageDigest = @ImageDigest, ArtifactCount = @ArtifactCount,
            TotalByteLength = @TotalByteLength, DirectoriesJson = @DirectoriesJson, CapturedAtUtc = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN INSERT
            (RootId, ImageType, WorkspaceRoot, DiscoveryMode, ImageDigest, ArtifactCount, TotalByteLength, DirectoriesJson)
            VALUES (@RootId, @ImageType, @WorkspaceRoot, @DiscoveryMode, @ImageDigest, @ArtifactCount, @TotalByteLength, @DirectoriesJson);

        INSERT inventory.RepositoryArtifact
            (RootId, RelativePath, ArtifactType, ArtifactClass, MediaType, Encoding, FileMode, ByteLength, ContentDigest, AuthorityDisposition)
        SELECT @RootId, RelativePath, ArtifactType, ArtifactClass, MediaType, Encoding, FileMode, ByteLength, ContentDigest, AuthorityDisposition
        FROM @Artifacts;

        DELETE content
        FROM inventory.RepositoryContent content
        WHERE NOT EXISTS (SELECT 1 FROM inventory.RepositoryArtifact artifact WHERE artifact.ContentDigest = content.ContentDigest);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;

    SELECT CONCAT('R|', @ImageDigest, '|', @ArtifactCount, '|', @TotalByteLength,
                  '|REPOSITORY_CURRENT_IMAGE_ADMITTED') AS ResultLine;
END;
GO
