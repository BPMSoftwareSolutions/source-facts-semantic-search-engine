CREATE OR ALTER PROCEDURE ingestion.LoadEngineeringTruth
    @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 51000, 'PayloadJson must be valid JSON.', 1;

    DECLARE @ContractSnapshotId varchar(80) = JSON_VALUE(@PayloadJson, '$.contract.contractSnapshotId');
    DECLARE @ObservationSnapshotId varchar(80) = JSON_VALUE(@PayloadJson, '$.observation.observationSnapshotId');
    IF @ContractSnapshotId IS NULL THROW 51000, 'contract.contractSnapshotId is required.', 1;
    IF @ObservationSnapshotId IS NULL THROW 51000, 'observation.observationSnapshotId is required.', 1;

    DECLARE @AlreadyLoaded bit = CASE
        WHEN EXISTS (SELECT 1 FROM authority.ContractSnapshot WHERE ContractSnapshotId = @ContractSnapshotId)
         AND EXISTS (SELECT 1 FROM observation.ObservationSnapshot WHERE ObservationSnapshotId = @ObservationSnapshotId)
        THEN 1 ELSE 0 END;

    BEGIN TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM authority.ContractSnapshot WHERE ContractSnapshotId = @ContractSnapshotId)
    BEGIN
        INSERT authority.ContractSnapshot
            (ContractSnapshotId, ContractId, ContractType, ProjectId, SubjectId, SourcePath, AuthorityDigest)
        SELECT ContractSnapshotId, ContractId, ContractType, ProjectId, SubjectId, SourcePath, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.contract') WITH
        (
            ContractSnapshotId varchar(80) '$.contractSnapshotId', ContractId nvarchar(160) '$.contractId',
            ContractType nvarchar(160) '$.contractType', ProjectId nvarchar(160) '$.projectId',
            SubjectId nvarchar(160) '$.subjectId', SourcePath nvarchar(1024) '$.sourcePath',
            AuthorityDigest varchar(80) '$.authorityDigest'
        );

        INSERT artifact.Artifact
            (ContractSnapshotId, ArtifactId, ArtifactKind, Purpose, RelativePath, MediaType, ProjectionProfileId, AuthorityDigest)
        SELECT @ContractSnapshotId, ArtifactId, ArtifactKind, Purpose, RelativePath, MediaType, ProjectionProfileId, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.artifacts') WITH
        (
            ArtifactId nvarchar(160) '$.artifactId', ArtifactKind nvarchar(160) '$.artifactKind',
            Purpose nvarchar(max) '$.purpose', RelativePath nvarchar(1024) '$.relativePath',
            MediaType nvarchar(160) '$.mediaType', ProjectionProfileId nvarchar(160) '$.projectionProfileId',
            AuthorityDigest varchar(80) '$.authorityDigest'
        );

        INSERT lineage.Project (ContractSnapshotId, ProjectId, AuthorityDigest)
        SELECT @ContractSnapshotId, ProjectId, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.projects') WITH (ProjectId nvarchar(160) '$.projectId', AuthorityDigest varchar(80) '$.authorityDigest');

        INSERT lineage.Feature (ContractSnapshotId, FeatureId, ProjectId, Purpose, AuthorityDigest)
        SELECT @ContractSnapshotId, FeatureId, ProjectId, Purpose, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.features') WITH
        (FeatureId nvarchar(160) '$.featureId', ProjectId nvarchar(160) '$.projectId', Purpose nvarchar(max) '$.purpose', AuthorityDigest varchar(80) '$.authorityDigest');

        INSERT lineage.Scenario (ContractSnapshotId, ScenarioId, FeatureId, Purpose, AuthorityDigest)
        SELECT @ContractSnapshotId, ScenarioId, FeatureId, Purpose, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.scenarios') WITH
        (ScenarioId nvarchar(160) '$.scenarioId', FeatureId nvarchar(160) '$.featureId', Purpose nvarchar(max) '$.purpose', AuthorityDigest varchar(80) '$.authorityDigest');

        INSERT lineage.Obligation (ContractSnapshotId, ObligationId, ScenarioId, Statement, AuthorityDigest)
        SELECT @ContractSnapshotId, ObligationId, ScenarioId, Statement, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.obligations') WITH
        (ObligationId nvarchar(160) '$.obligationId', ScenarioId nvarchar(160) '$.scenarioId', Statement nvarchar(max) '$.statement', AuthorityDigest varchar(80) '$.authorityDigest');

        INSERT lineage.Responsibility
            (ContractSnapshotId, ResponsibilityId, ObligationId, ResponsibilityType, ProjectionProfileId, ArtifactId, AuthorityDigest)
        SELECT @ContractSnapshotId, ResponsibilityId, ObligationId, ResponsibilityType, ProjectionProfileId, ArtifactId, AuthorityDigest
        FROM OPENJSON(@PayloadJson, '$.responsibilities') WITH
        (
            ResponsibilityId nvarchar(160) '$.responsibilityId', ObligationId nvarchar(160) '$.obligationId',
            ResponsibilityType nvarchar(160) '$.responsibilityType', ProjectionProfileId nvarchar(160) '$.projectionProfileId',
            ArtifactId nvarchar(160) '$.artifactId', AuthorityDigest varchar(80) '$.authorityDigest'
        );
    END;

    IF NOT EXISTS (SELECT 1 FROM observation.ObservationSnapshot WHERE ObservationSnapshotId = @ObservationSnapshotId)
    BEGIN
        INSERT observation.ObservationSnapshot
            (ObservationSnapshotId, IndexId, ReportType, RepositoryId, GeneratedAtUtc, SourcePath, ObservationDigest)
        SELECT ObservationSnapshotId, IndexId, ReportType, RepositoryId, GeneratedAtUtc, SourcePath, ObservationDigest
        FROM OPENJSON(@PayloadJson, '$.observation') WITH
        (
            ObservationSnapshotId varchar(80) '$.observationSnapshotId', IndexId varchar(120) '$.indexId',
            ReportType nvarchar(160) '$.reportType', RepositoryId nvarchar(400) '$.repositoryId',
            GeneratedAtUtc datetime2(7) '$.generatedAtUtc', SourcePath nvarchar(1024) '$.sourcePath',
            ObservationDigest varchar(80) '$.observationDigest'
        );

        INSERT observation.Callable
            (ObservationSnapshotId, CallableKey, CallableId, SymbolName, ModulePath, SymbolKind, SourceReferenceId, DeclarationLine, ClosureClassification)
        SELECT @ObservationSnapshotId, CallableKey, CallableId, SymbolName, ModulePath, SymbolKind, SourceReferenceId, DeclarationLine, ClosureClassification
        FROM OPENJSON(@PayloadJson, '$.callables') WITH
        (
            CallableKey varchar(80) '$.callableKey', CallableId nvarchar(900) '$.callableId', SymbolName nvarchar(400) '$.symbolName',
            ModulePath nvarchar(1024) '$.modulePath', SymbolKind nvarchar(80) '$.symbolKind', SourceReferenceId nvarchar(900) '$.sourceReferenceId',
            DeclarationLine int '$.declarationLine', ClosureClassification nvarchar(120) '$.closureClassification'
        );

        INSERT observation.CliCommand
            (ObservationSnapshotId, CommandId, CommandName, HandlerSymbolId, InterfaceStatus, AdmissionDisposition)
        SELECT @ObservationSnapshotId, CommandId, CommandName, HandlerSymbolId, InterfaceStatus, AdmissionDisposition
        FROM OPENJSON(@PayloadJson, '$.commands') WITH
        (
            CommandId nvarchar(240) '$.commandId', CommandName nvarchar(160) '$.commandName', HandlerSymbolId nvarchar(900) '$.handlerSymbolId',
            InterfaceStatus nvarchar(120) '$.interfaceStatus', AdmissionDisposition nvarchar(120) '$.admissionDisposition'
        );

        INSERT observation.CommandReachability
            (ObservationSnapshotId, CommandId, CallableKey, Depth, PathWitnessJson, RelationshipIdsJson, ResolutionDisposition)
        SELECT @ObservationSnapshotId, CommandId, CallableKey, Depth, PathWitnessJson, RelationshipIdsJson, ResolutionDisposition
        FROM OPENJSON(@PayloadJson, '$.commandReachability') WITH
        (
            CommandId nvarchar(240) '$.commandId', CallableKey varchar(80) '$.callableKey', Depth int '$.depth',
            PathWitnessJson nvarchar(max) '$.pathWitnessJson', RelationshipIdsJson nvarchar(max) '$.relationshipIdsJson',
            ResolutionDisposition nvarchar(120) '$.resolutionDisposition'
        );

        INSERT [test].TestCase
            (ObservationSnapshotId, TestId, TestName, TestFilePath, Framework, StartLine, ExecutionStatus, RuntimeResultDisposition)
        SELECT @ObservationSnapshotId, TestId, TestName, TestFilePath, Framework, StartLine, ExecutionStatus, RuntimeResultDisposition
        FROM OPENJSON(@PayloadJson, '$.tests') WITH
        (
            TestId varchar(80) '$.testId', TestName nvarchar(max) '$.testName', TestFilePath nvarchar(1024) '$.testFilePath',
            Framework nvarchar(120) '$.framework', StartLine int '$.startLine', ExecutionStatus nvarchar(120) '$.executionStatus',
            RuntimeResultDisposition nvarchar(160) '$.runtimeResultDisposition'
        );

        INSERT [test].TestProductionReachability
            (ObservationSnapshotId, TestId, CallableKey, Depth, ReachabilityPosture, PathWitnessJson)
        SELECT @ObservationSnapshotId, TestId, CallableKey, Depth, ReachabilityPosture, PathWitnessJson
        FROM OPENJSON(@PayloadJson, '$.testProductionReachability') WITH
        (
            TestId varchar(80) '$.testId', CallableKey varchar(80) '$.callableKey', Depth int '$.depth',
            ReachabilityPosture nvarchar(120) '$.reachabilityPosture', PathWitnessJson nvarchar(max) '$.pathWitnessJson'
        );
    END;

    -- Cross-plane rows are admitted only when both independently loaded identities
    -- exist. Identifier coincidence never creates an authority row.
    INSERT binding.ResponsibilityCommand
        (ContractSnapshotId, ObservationSnapshotId, ResponsibilityId, CommandId, BindingDisposition)
    SELECT @ContractSnapshotId, @ObservationSnapshotId, source.ResponsibilityId, source.CommandId, source.BindingDisposition
    FROM OPENJSON(@PayloadJson, '$.responsibilityCommands') WITH
        (ResponsibilityId nvarchar(160) '$.responsibilityId', CommandId nvarchar(240) '$.commandId', BindingDisposition nvarchar(120) '$.bindingDisposition') source
    JOIN lineage.Responsibility r ON r.ContractSnapshotId = @ContractSnapshotId AND r.ResponsibilityId = source.ResponsibilityId
    WHERE NOT EXISTS (SELECT 1 FROM binding.ResponsibilityCommand existing WHERE existing.ContractSnapshotId = @ContractSnapshotId AND existing.ObservationSnapshotId = @ObservationSnapshotId AND existing.ResponsibilityId = source.ResponsibilityId AND existing.CommandId = source.CommandId);

    INSERT binding.ResponsibilityCallable
        (ContractSnapshotId, ObservationSnapshotId, ResponsibilityId, CallableKey, Depth, CommandId, BindingDisposition)
    SELECT @ContractSnapshotId, @ObservationSnapshotId, source.ResponsibilityId, source.CallableKey, source.Depth, source.CommandId, source.BindingDisposition
    FROM OPENJSON(@PayloadJson, '$.responsibilityCallables') WITH
        (ResponsibilityId nvarchar(160) '$.responsibilityId', CallableKey varchar(80) '$.callableKey', Depth int '$.depth', CommandId nvarchar(240) '$.commandId', BindingDisposition nvarchar(120) '$.bindingDisposition') source
    JOIN lineage.Responsibility r ON r.ContractSnapshotId = @ContractSnapshotId AND r.ResponsibilityId = source.ResponsibilityId
    WHERE NOT EXISTS (SELECT 1 FROM binding.ResponsibilityCallable existing WHERE existing.ContractSnapshotId = @ContractSnapshotId AND existing.ObservationSnapshotId = @ObservationSnapshotId AND existing.ResponsibilityId = source.ResponsibilityId AND existing.CallableKey = source.CallableKey);

    INSERT [test].ScenarioTestBinding
        (ContractSnapshotId, ObservationSnapshotId, ScenarioId, ResponsibilityId, TestId, BindingDisposition)
    SELECT @ContractSnapshotId, @ObservationSnapshotId, source.ScenarioId, source.ResponsibilityId, source.TestId, source.BindingDisposition
    FROM OPENJSON(@PayloadJson, '$.scenarioTestBindings') WITH
        (ScenarioId nvarchar(160) '$.scenarioId', ResponsibilityId nvarchar(160) '$.responsibilityId', TestId varchar(80) '$.testId', BindingDisposition nvarchar(160) '$.bindingDisposition') source
    JOIN lineage.Scenario s ON s.ContractSnapshotId = @ContractSnapshotId AND s.ScenarioId = source.ScenarioId
    JOIN lineage.Responsibility r ON r.ContractSnapshotId = @ContractSnapshotId AND r.ResponsibilityId = source.ResponsibilityId
    WHERE NOT EXISTS (SELECT 1 FROM [test].ScenarioTestBinding existing WHERE existing.ContractSnapshotId = @ContractSnapshotId AND existing.ObservationSnapshotId = @ObservationSnapshotId AND existing.ScenarioId = source.ScenarioId AND existing.ResponsibilityId = source.ResponsibilityId AND existing.TestId = source.TestId);

    INSERT proof.ScenarioProof
        (ContractSnapshotId, ObservationSnapshotId, ScenarioId, TestId, ExecutionDisposition, ProofDisposition, ObservedResultJson)
    SELECT @ContractSnapshotId, @ObservationSnapshotId, source.ScenarioId, source.TestId, source.ExecutionDisposition, source.ProofDisposition, source.ObservedResultJson
    FROM OPENJSON(@PayloadJson, '$.scenarioProofs') WITH
        (ScenarioId nvarchar(160) '$.scenarioId', TestId varchar(80) '$.testId', ExecutionDisposition nvarchar(160) '$.executionDisposition', ProofDisposition nvarchar(200) '$.proofDisposition', ObservedResultJson nvarchar(max) '$.observedResultJson') source
    JOIN lineage.Scenario s ON s.ContractSnapshotId = @ContractSnapshotId AND s.ScenarioId = source.ScenarioId
    WHERE NOT EXISTS (SELECT 1 FROM proof.ScenarioProof existing WHERE existing.ContractSnapshotId = @ContractSnapshotId AND existing.ObservationSnapshotId = @ObservationSnapshotId AND existing.ScenarioId = source.ScenarioId AND existing.TestId = source.TestId);

    COMMIT TRANSACTION;

    SELECT @ContractSnapshotId AS ContractSnapshotId, @ObservationSnapshotId AS ObservationSnapshotId,
           @AlreadyLoaded AS AlreadyLoaded,
           (SELECT COUNT(*) FROM lineage.Feature WHERE ContractSnapshotId = @ContractSnapshotId) AS FeaturesLoaded,
           (SELECT COUNT(*) FROM observation.Callable WHERE ObservationSnapshotId = @ObservationSnapshotId) AS CallablesLoaded,
           (SELECT COUNT(*) FROM [test].TestCase WHERE ObservationSnapshotId = @ObservationSnapshotId) AS TestsLoaded;
END;
GO
