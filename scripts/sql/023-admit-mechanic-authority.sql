-- Closes the mechanic-authority admission gap: without this table and
-- procedure, a completed candidate authority envelope has nowhere in the
-- database to go, and AdmissionDisposition/AuthorityAdmittedMechanicCount
-- can never be anything other than their hardcoded "not admitted" values.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

IF OBJECT_ID('authority.MechanicAuthorityAdmission','U') IS NULL
CREATE TABLE authority.MechanicAuthorityAdmission
(
    AnalysisDigest varchar(80) NOT NULL,
    MechanicOccurrenceId varchar(120) NOT NULL,
    AuthorityFamily varchar(80) NOT NULL,
    AuthorityDataJson nvarchar(max) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    AuthoritySchemaId varchar(200) NOT NULL,
    AuthorityBasis varchar(80) NOT NULL,
    LowererVersion varchar(120) NOT NULL,
    AdmissionDisposition nvarchar(80) NOT NULL,
    AdmittedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_MechanicAuthorityAdmission_AdmittedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_MechanicAuthorityAdmission PRIMARY KEY NONCLUSTERED (AnalysisDigest, MechanicOccurrenceId),
    CONSTRAINT CK_MechanicAuthorityAdmission_Json CHECK (ISJSON(AuthorityDataJson)=1),
    CONSTRAINT CK_MechanicAuthorityAdmission_Disposition CHECK (AdmissionDisposition = 'AUTHORITY_ADMITTED')
);
GO

IF COL_LENGTH('authority.MechanicAuthorityAdmission','AuthoritySchemaId') IS NULL
ALTER TABLE authority.MechanicAuthorityAdmission ADD AuthoritySchemaId varchar(200) NULL;
IF COL_LENGTH('authority.MechanicAuthorityAdmission','AuthorityBasis') IS NULL
ALTER TABLE authority.MechanicAuthorityAdmission ADD AuthorityBasis varchar(80) NULL;
IF COL_LENGTH('authority.MechanicAuthorityAdmission','LowererVersion') IS NULL
ALTER TABLE authority.MechanicAuthorityAdmission ADD LowererVersion varchar(120) NULL;
GO

IF OBJECT_ID('observation.MechanicAuthorityLoweringAttempt','U') IS NULL
CREATE TABLE observation.MechanicAuthorityLoweringAttempt
(
    LoweringAttemptId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_MechanicAuthorityLoweringAttempt PRIMARY KEY,
    RootId nvarchar(400) NOT NULL,
    AnalysisDigest varchar(80) NOT NULL,
    MechanicOccurrenceId varchar(120) NOT NULL,
    MechanicKind varchar(80) NOT NULL,
    ArtifactId nvarchar(1024) NOT NULL,
    ArtifactDigest varchar(80) NOT NULL,
    LowererVersion varchar(120) NOT NULL,
    AttemptMode varchar(20) NOT NULL,
    LoweringDisposition varchar(80) NOT NULL,
    RejectionReason varchar(120) NULL,
    RequiredPrimitive varchar(200) NULL,
    AuthorityDigest varchar(80) NULL,
    AdmissionDisposition varchar(80) NULL,
    DetailMessage nvarchar(2000) NULL,
    AttemptedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_MechanicAuthorityLoweringAttempt_AttemptedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_MechanicAuthorityLoweringAttempt_Mode CHECK (AttemptMode IN ('DRY_RUN','ADMIT')),
    CONSTRAINT CK_MechanicAuthorityLoweringAttempt_Disposition CHECK (LoweringDisposition IN ('DETERMINISTIC_AUTHORITY_PROJECTED','DETERMINISTIC_AUTHORITY_REJECTED','DETERMINISTIC_AUTHORITY_ADMITTED')),
    CONSTRAINT CK_MechanicAuthorityLoweringAttempt_Rejection CHECK
    (
        (LoweringDisposition='DETERMINISTIC_AUTHORITY_REJECTED' AND RejectionReason IS NOT NULL AND RequiredPrimitive IS NOT NULL)
        OR (LoweringDisposition<>'DETERMINISTIC_AUTHORITY_REJECTED' AND RejectionReason IS NULL)
    )
);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id=OBJECT_ID('observation.MechanicAuthorityLoweringAttempt') AND name='IX_MechanicAuthorityLoweringAttempt_Current')
CREATE INDEX IX_MechanicAuthorityLoweringAttempt_Current
ON observation.MechanicAuthorityLoweringAttempt (RootId,AnalysisDigest,MechanicOccurrenceId,LoweringAttemptId DESC);
GO

-- Admitted authority is attributable to its exact analysis digest, but must
-- not block a newer scan from replacing mechanic rows -- same rationale as
-- authority.MechanicApplicabilityReview carrying no FK to fact.ExecutableMechanic.
CREATE OR ALTER PROCEDURE ingestion.AdmitMechanicAuthority @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson)<>1 THROW 51090,'Mechanic authority admission payload must be JSON.',1;

    DECLARE @RootId nvarchar(400)=JSON_VALUE(@PayloadJson,'$.rootId');
    DECLARE @MechanicOccurrenceId varchar(120)=JSON_VALUE(@PayloadJson,'$.mechanicOccurrenceId');
    DECLARE @MechanicKind varchar(80)=JSON_VALUE(@PayloadJson,'$.mechanicKind');
    DECLARE @ExpectedAnalysisDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedAnalysisDigest');
    DECLARE @ExpectedArtifactDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedArtifactDigest');
    DECLARE @LowererVersion varchar(120)=JSON_VALUE(@PayloadJson,'$.lowererVersion');
    DECLARE @AuthorityDataJson nvarchar(max)=JSON_QUERY(@PayloadJson,'$.authorityData');
    IF @RootId IS NULL OR @MechanicOccurrenceId IS NULL OR @MechanicKind IS NULL THROW 51091,'Mechanic authority admission requires rootId, mechanicOccurrenceId, and mechanicKind.',1;
    IF @ExpectedAnalysisDigest IS NULL OR @ExpectedArtifactDigest IS NULL OR @LowererVersion IS NULL THROW 51097,'Mechanic authority admission requires analysis digest, artifact digest, and lowerer version CAS evidence.',1;
    IF ISJSON(@AuthorityDataJson)<>1 THROW 51092,'Admitted authority data must be JSON.',1;
    IF JSON_VALUE(@AuthorityDataJson,'$.authorityBasis')<>'DETERMINISTIC_SYNTAX_LOWERING'
       OR JSON_VALUE(@AuthorityDataJson,'$.syntaxProfile') NOT IN ('typescript-branch-authority.v2','typescript-mechanic-authority.v1')
       OR JSON_VALUE(@AuthorityDataJson,'$.candidateAuthorityId')<>CONCAT('candidate-',@MechanicOccurrenceId)
       THROW 51098,'Admitted authority data does not carry the required deterministic mechanic-authority envelope.',1;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @AnalysisDigest varchar(80),@SourceFactIndexId varchar(120);
        SELECT @AnalysisDigest=analysis.AnalysisDigest,@SourceFactIndexId=analysis.SourceFactIndexId
        FROM observation.RepositoryExecutionAnalysis analysis WITH (UPDLOCK,HOLDLOCK)
        JOIN inventory.RepositoryImage image WITH (HOLDLOCK) ON image.RootId=analysis.RootId AND image.ImageDigest=analysis.RepositoryImageDigest
        JOIN inventory.Scan scan WITH (HOLDLOCK) ON scan.IndexId=analysis.SourceFactIndexId AND scan.RootId=analysis.RootId
        JOIN observation.ObservationSnapshot snapshot WITH (HOLDLOCK) ON snapshot.ObservationSnapshotId=analysis.ObservationSnapshotId AND snapshot.IndexId=analysis.SourceFactIndexId
        JOIN authority.ContractSnapshot contract WITH (HOLDLOCK) ON contract.ContractSnapshotId=analysis.ContractSnapshotId
        WHERE analysis.RootId=@RootId;
        IF @AnalysisDigest IS NULL THROW 51093,'Root does not have a current execution analysis.',1;
        IF @ExpectedAnalysisDigest<>@AnalysisDigest THROW 51095,'Current execution analysis does not match deterministic lowering evidence.',1;

        DECLARE @AuthorityFamily varchar(80),@ExpectedAuthorityKind varchar(80),@CurrentArtifactDigest varchar(80),@CurrentMechanicKind varchar(80),@ArtifactId nvarchar(1024);
        SELECT @AuthorityFamily=family.AuthorityFamily,@ExpectedAuthorityKind=family.AuthorityKind,@CurrentArtifactDigest=artifact.ContentDigest,@CurrentMechanicKind=mechanic.MechanicKind,@ArtifactId=artifact.RelativePath
        FROM fact.ExecutableMechanic mechanic WITH (UPDLOCK,HOLDLOCK)
        JOIN authority.MechanicAuthorityFamily family WITH (HOLDLOCK) ON family.MechanicKind=mechanic.MechanicKind
        JOIN inventory.RepositoryArtifact artifact WITH (HOLDLOCK) ON artifact.RootId=mechanic.RootId AND artifact.RelativePath=mechanic.ModulePath
        WHERE mechanic.IndexId=@SourceFactIndexId AND mechanic.RootId=@RootId AND mechanic.ExecutableMechanicFactId=@MechanicOccurrenceId;
        IF @AuthorityFamily IS NULL THROW 51094,'Mechanic occurrence has no current, supported authority family to admit against.',1;
        IF @CurrentMechanicKind<>@MechanicKind OR JSON_VALUE(@AuthorityDataJson,'$.authorityKind')<>@ExpectedAuthorityKind THROW 51098,'Authority kind does not match the current mechanic authority family.',1;
        IF COALESCE(@CurrentArtifactDigest,'')<>@ExpectedArtifactDigest THROW 51096,'Current source artifact does not match deterministic lowering evidence.',1;

        DECLARE @AuthorityDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),@AuthorityDataJson)),2)));
        DECLARE @ExistingAuthorityDigest varchar(80),@ExistingAuthoritySchemaId varchar(200),@ExistingAuthorityBasis varchar(80),@Disposition varchar(80);
        SELECT @ExistingAuthorityDigest=AuthorityDigest,@ExistingAuthoritySchemaId=AuthoritySchemaId,@ExistingAuthorityBasis=AuthorityBasis FROM authority.MechanicAuthorityAdmission WITH (UPDLOCK,HOLDLOCK)
        WHERE AnalysisDigest=@AnalysisDigest AND MechanicOccurrenceId=@MechanicOccurrenceId;
        IF @ExistingAuthoritySchemaId IS NOT NULL AND @ExistingAuthoritySchemaId NOT IN ('deterministic-branch-authority.schema.json','deterministic-mechanic-authority.schema.json')
            THROW 51100,'Existing authority carries an unsupported schema identity.',1;
        IF @ExistingAuthoritySchemaId='deterministic-mechanic-authority.schema.json' AND @ExistingAuthorityBasis<>'DETERMINISTIC_SYNTAX_LOWERING'
            THROW 51101,'Existing deterministic authority carries an invalid authority basis.',1;
        IF @ExistingAuthoritySchemaId='deterministic-mechanic-authority.schema.json' AND @ExistingAuthorityDigest<>@AuthorityDigest
            THROW 51099,'A different authority payload is already admitted for this analysis and mechanic occurrence.',1;
        IF @ExistingAuthorityDigest IS NULL
        BEGIN
            INSERT authority.MechanicAuthorityAdmission (AnalysisDigest,MechanicOccurrenceId,AuthorityFamily,AuthorityDataJson,AuthorityDigest,AuthoritySchemaId,AuthorityBasis,LowererVersion,AdmissionDisposition)
            VALUES (@AnalysisDigest,@MechanicOccurrenceId,@AuthorityFamily,@AuthorityDataJson,@AuthorityDigest,'deterministic-mechanic-authority.schema.json','DETERMINISTIC_SYNTAX_LOWERING',@LowererVersion,'AUTHORITY_ADMITTED');
            INSERT observation.MechanicAuthorityLoweringAttempt
                (RootId,AnalysisDigest,MechanicOccurrenceId,MechanicKind,ArtifactId,ArtifactDigest,LowererVersion,AttemptMode,LoweringDisposition,AuthorityDigest,AdmissionDisposition)
            VALUES
                (@RootId,@AnalysisDigest,@MechanicOccurrenceId,@MechanicKind,@ArtifactId,@CurrentArtifactDigest,@LowererVersion,'ADMIT','DETERMINISTIC_AUTHORITY_ADMITTED',@AuthorityDigest,'MECHANIC_AUTHORITY_ADMITTED');
            SET @Disposition='MECHANIC_AUTHORITY_ADMITTED';
        END
        ELSE IF @ExistingAuthoritySchemaId IS NULL OR @ExistingAuthoritySchemaId='deterministic-branch-authority.schema.json'
        BEGIN
            UPDATE authority.MechanicAuthorityAdmission
            SET AuthorityFamily=@AuthorityFamily,AuthorityDataJson=@AuthorityDataJson,AuthorityDigest=@AuthorityDigest,
                AuthoritySchemaId='deterministic-mechanic-authority.schema.json',AuthorityBasis='DETERMINISTIC_SYNTAX_LOWERING',LowererVersion=@LowererVersion,
                AdmissionDisposition='AUTHORITY_ADMITTED',AdmittedAtUtc=SYSUTCDATETIME()
            WHERE AnalysisDigest=@AnalysisDigest AND MechanicOccurrenceId=@MechanicOccurrenceId;
            INSERT observation.MechanicAuthorityLoweringAttempt
                (RootId,AnalysisDigest,MechanicOccurrenceId,MechanicKind,ArtifactId,ArtifactDigest,LowererVersion,AttemptMode,LoweringDisposition,AuthorityDigest,AdmissionDisposition)
            VALUES
                (@RootId,@AnalysisDigest,@MechanicOccurrenceId,@MechanicKind,@ArtifactId,@CurrentArtifactDigest,@LowererVersion,'ADMIT','DETERMINISTIC_AUTHORITY_ADMITTED',@AuthorityDigest,'MECHANIC_AUTHORITY_LEGACY_REPLACED');
            SET @Disposition='MECHANIC_AUTHORITY_LEGACY_REPLACED';
        END
        ELSE SET @Disposition='MECHANIC_AUTHORITY_ALREADY_ADMITTED';
        COMMIT TRANSACTION;
        SELECT CONCAT('M|',@AnalysisDigest,'|',@MechanicOccurrenceId,'|',@AuthorityDigest,'|',@Disposition) ResultLine;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT>0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE ingestion.RecordMechanicAuthorityLoweringAttempt @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson)<>1 THROW 51100,'Mechanic authority lowering-attempt payload must be JSON.',1;
    DECLARE @RootId nvarchar(400)=JSON_VALUE(@PayloadJson,'$.rootId'),@MechanicOccurrenceId varchar(120)=JSON_VALUE(@PayloadJson,'$.mechanicOccurrenceId');
    DECLARE @MechanicKind varchar(80)=JSON_VALUE(@PayloadJson,'$.mechanicKind'),@ArtifactId nvarchar(1024)=JSON_VALUE(@PayloadJson,'$.artifactId');
    DECLARE @ExpectedAnalysisDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedAnalysisDigest'),@ExpectedArtifactDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedArtifactDigest');
    DECLARE @LowererVersion varchar(120)=JSON_VALUE(@PayloadJson,'$.lowererVersion'),@AttemptMode varchar(20)=JSON_VALUE(@PayloadJson,'$.mode');
    DECLARE @LoweringDisposition varchar(80)=JSON_VALUE(@PayloadJson,'$.loweringDisposition'),@RejectionReason varchar(120)=JSON_VALUE(@PayloadJson,'$.rejectionReason');
    DECLARE @RequiredPrimitive varchar(200)=JSON_VALUE(@PayloadJson,'$.requiredPrimitive'),@DetailMessage nvarchar(2000)=JSON_VALUE(@PayloadJson,'$.message');
    DECLARE @AuthorityDataJson nvarchar(max)=JSON_QUERY(@PayloadJson,'$.authorityData');
    IF @RootId IS NULL OR @MechanicOccurrenceId IS NULL OR @MechanicKind IS NULL OR @ArtifactId IS NULL OR @ExpectedAnalysisDigest IS NULL OR @ExpectedArtifactDigest IS NULL OR @LowererVersion IS NULL
        THROW 51101,'Lowering-attempt identity and CAS evidence are required.',1;
    IF @LoweringDisposition NOT IN ('DETERMINISTIC_AUTHORITY_PROJECTED','DETERMINISTIC_AUTHORITY_REJECTED') THROW 51102,'Unexpected lowering-attempt disposition.',1;
    IF @LoweringDisposition='DETERMINISTIC_AUTHORITY_REJECTED' AND (@RejectionReason IS NULL OR @RequiredPrimitive IS NULL) THROW 51103,'Rejected lowering attempts require a reason and primitive.',1;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @AnalysisDigest varchar(80),@SourceFactIndexId varchar(120),@CurrentArtifactDigest varchar(80),@CurrentMechanicKind varchar(80);
        SELECT @AnalysisDigest=analysis.AnalysisDigest,@SourceFactIndexId=analysis.SourceFactIndexId
        FROM observation.RepositoryExecutionAnalysis analysis WITH (UPDLOCK,HOLDLOCK)
        JOIN inventory.RepositoryImage image WITH (HOLDLOCK) ON image.RootId=analysis.RootId AND image.ImageDigest=analysis.RepositoryImageDigest
        JOIN inventory.Scan scan WITH (HOLDLOCK) ON scan.IndexId=analysis.SourceFactIndexId AND scan.RootId=analysis.RootId
        WHERE analysis.RootId=@RootId;
        IF @AnalysisDigest IS NULL OR @AnalysisDigest<>@ExpectedAnalysisDigest THROW 51104,'Current execution analysis does not match lowering-attempt evidence.',1;
        SELECT @CurrentArtifactDigest=artifact.ContentDigest,@CurrentMechanicKind=mechanic.MechanicKind
        FROM fact.ExecutableMechanic mechanic WITH (UPDLOCK,HOLDLOCK)
        JOIN inventory.RepositoryArtifact artifact WITH (HOLDLOCK) ON artifact.RootId=mechanic.RootId AND artifact.RelativePath=mechanic.ModulePath
        WHERE mechanic.IndexId=@SourceFactIndexId AND mechanic.RootId=@RootId AND mechanic.ExecutableMechanicFactId=@MechanicOccurrenceId AND artifact.RelativePath=@ArtifactId;
        IF @CurrentMechanicKind<>@MechanicKind OR COALESCE(@CurrentArtifactDigest,'')<>@ExpectedArtifactDigest THROW 51105,'Current mechanic or artifact does not match lowering-attempt evidence.',1;
        DECLARE @AuthorityDigest varchar(80)=CASE WHEN @AuthorityDataJson IS NULL THEN NULL ELSE CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),@AuthorityDataJson)),2))) END;
        INSERT observation.MechanicAuthorityLoweringAttempt
            (RootId,AnalysisDigest,MechanicOccurrenceId,MechanicKind,ArtifactId,ArtifactDigest,LowererVersion,AttemptMode,LoweringDisposition,RejectionReason,RequiredPrimitive,AuthorityDigest,DetailMessage)
        VALUES
            (@RootId,@AnalysisDigest,@MechanicOccurrenceId,@MechanicKind,@ArtifactId,@CurrentArtifactDigest,@LowererVersion,@AttemptMode,@LoweringDisposition,@RejectionReason,@RequiredPrimitive,@AuthorityDigest,@DetailMessage);
        COMMIT TRANSACTION;
        SELECT CONCAT('L|',@AnalysisDigest,'|',@MechanicOccurrenceId,'|MECHANIC_AUTHORITY_LOWERING_ATTEMPT_RECORDED') ResultLine;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT>0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER VIEW projection.CurrentExecutionMechanicOccurrence AS
SELECT currentAnalysis.RootId,currentAnalysis.ApplicationId,currentAnalysis.RepositoryImageDigest,currentAnalysis.AnalysisDigest ExecutionAnalysisDigest,
 mechanic.IndexId SourceFactIndexId,mechanic.ExecutableMechanicFactId MechanicOccurrenceId,mechanic.MechanicKind,family.AuthorityFamily,family.AuthorityKind,
 artifact.RelativePath ArtifactId,CASE WHEN mechanic.ModulePath LIKE 'test/%' THEN 'test' WHEN mechanic.ModulePath LIKE 'scripts/%' THEN 'script' WHEN mechanic.ModulePath LIKE 'src/%' THEN 'production' ELSE 'repository-support' END ArtifactRole,
 mechanic.FromSymbolId BodySymbolId,callable.CallableKey,callable.SymbolName,mechanic.SourceReferenceId,reference.StartLine,reference.StartColumn,artifact.ContentDigest ArtifactDigest,
 ownership.FeatureId,ownership.ScenarioId,ownership.ObligationId,ownership.ResponsibilityId,ownership.ResponsibilityBindingDisposition,ownership.CandidateResponsibilityCount,
 reachability.InterfaceCount,reachability.MinimumPathDepth,testReach.TestCaseCount,testReach.TestCaseIdsJson,
 COALESCE(applicability.ApplicabilityDisposition,'HUMAN_REVIEW_REQUIRED') ApplicabilityDisposition,
 CASE WHEN applicability.ReviewDisposition='APPLICABILITY_ADMITTED' THEN 'REVIEWED_APPLICABILITY_AUTHORITY' ELSE 'APPLICABILITY_REVIEW_REQUIRED' END ApplicabilityAuthorityDisposition,
 authorityProjection.ProjectionDisposition AuthorityProjectionDisposition,
 COALESCE(admission.AdmissionDisposition,'CANDIDATE_NOT_ADMITTED') AdmissionDisposition,
 admission.AuthorityDataJson AdmittedAuthorityDataJson,admission.AuthorityDigest AdmittedAuthorityDigest,
 CASE WHEN artifact.RootId IS NULL OR sourceFile.ContentHash<>artifact.ContentDigest THEN 'SOURCE_EVIDENCE_STALE' ELSE 'CURRENT_REPOSITORY_IMAGE' END CurrentPosture
FROM projection.CurrentRepositoryExecutionAnalysis currentAnalysis
JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=currentAnalysis.SourceFactIndexId AND mechanic.RootId=currentAnalysis.RootId
LEFT JOIN authority.MechanicAuthorityFamily family ON family.MechanicKind=mechanic.MechanicKind
LEFT JOIN source.SourceReference reference ON reference.SourceReferenceKey=mechanic.SourceReferenceKey
LEFT JOIN inventory.SourceFile sourceFile ON sourceFile.IndexId=mechanic.IndexId AND sourceFile.RootId=mechanic.RootId AND sourceFile.RelativePath=mechanic.ModulePath
LEFT JOIN inventory.RepositoryArtifact artifact ON artifact.RootId=currentAnalysis.RootId AND artifact.RelativePath=mechanic.ModulePath
LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=currentAnalysis.ObservationSnapshotId AND callable.CallableId=mechanic.FromSymbolId
OUTER APPLY
(
 SELECT CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(feature.FeatureId) END FeatureId,
        CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(scenario.ScenarioId) END ScenarioId,
        CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(obligation.ObligationId) END ObligationId,
        CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(responsibility.ResponsibilityId) END ResponsibilityId,
        CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(binding.BindingDisposition) END ResponsibilityBindingDisposition,
        COUNT(DISTINCT responsibility.ResponsibilityId) CandidateResponsibilityCount
 FROM binding.ResponsibilityCallable binding
 JOIN lineage.Responsibility responsibility ON responsibility.ContractSnapshotId=binding.ContractSnapshotId AND responsibility.ResponsibilityId=binding.ResponsibilityId
 JOIN lineage.Obligation obligation ON obligation.ContractSnapshotId=responsibility.ContractSnapshotId AND obligation.ObligationId=responsibility.ObligationId
 JOIN lineage.Scenario scenario ON scenario.ContractSnapshotId=obligation.ContractSnapshotId AND scenario.ScenarioId=obligation.ScenarioId
 JOIN lineage.Feature feature ON feature.ContractSnapshotId=scenario.ContractSnapshotId AND feature.FeatureId=scenario.FeatureId
 WHERE binding.ContractSnapshotId=currentAnalysis.ContractSnapshotId
   AND binding.ObservationSnapshotId=currentAnalysis.ObservationSnapshotId AND binding.CallableKey=callable.CallableKey
) ownership
OUTER APPLY (SELECT COUNT(DISTINCT reach.CommandId) InterfaceCount,MIN(reach.Depth) MinimumPathDepth FROM observation.CommandReachability reach WHERE reach.ObservationSnapshotId=currentAnalysis.ObservationSnapshotId AND reach.CallableKey=callable.CallableKey AND reach.ResolutionDisposition='STATICALLY_RESOLVED') reachability
OUTER APPLY
(
 SELECT COUNT(DISTINCT invocation.TestId) TestCaseCount,
        JSON_QUERY((SELECT DISTINCT nested.TestId testCaseId FROM testobservation.TestInvocation nested WHERE nested.RootId=currentAnalysis.RootId AND nested.ImportedSymbolName=callable.SymbolName AND (nested.ImportedModulePath IS NULL OR callable.ModulePath LIKE CONCAT(nested.ImportedModulePath,'.%')) FOR JSON PATH)) TestCaseIdsJson
 FROM testobservation.TestInvocation invocation WHERE invocation.RootId=currentAnalysis.RootId AND invocation.ImportedSymbolName=callable.SymbolName AND (invocation.ImportedModulePath IS NULL OR callable.ModulePath LIKE CONCAT(invocation.ImportedModulePath,'.%'))
) testReach
LEFT JOIN authority.MechanicApplicabilityReview applicability ON applicability.AnalysisDigest=currentAnalysis.AnalysisDigest AND applicability.SourceFactIndexId=mechanic.IndexId AND applicability.RootId=mechanic.RootId AND applicability.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
LEFT JOIN projection.ExecutionMechanicAuthority authorityProjection ON authorityProjection.SourceFactIndexId=mechanic.IndexId AND authorityProjection.RootId=mechanic.RootId AND authorityProjection.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
LEFT JOIN authority.MechanicAuthorityAdmission admission ON admission.AnalysisDigest=currentAnalysis.AnalysisDigest AND admission.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
 AND admission.AuthoritySchemaId='deterministic-mechanic-authority.schema.json' AND admission.AuthorityBasis='DETERMINISTIC_SYNTAX_LOWERING'
WHERE currentAnalysis.ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT';
GO

CREATE OR ALTER VIEW projection.CurrentMechanicAuthorityTransformationQueue AS
WITH RankedAttempt AS
(
    SELECT attempt.*,
           ROW_NUMBER() OVER (PARTITION BY attempt.RootId,attempt.AnalysisDigest,attempt.MechanicOccurrenceId ORDER BY attempt.LoweringAttemptId DESC) AttemptRank
    FROM observation.MechanicAuthorityLoweringAttempt attempt
)
SELECT mechanic.RootId,mechanic.ExecutionAnalysisDigest,mechanic.MechanicOccurrenceId,mechanic.MechanicKind,mechanic.AuthorityFamily,
       mechanic.ArtifactId,mechanic.ArtifactDigest,mechanic.StartLine,mechanic.StartColumn,mechanic.SourceReferenceId,
       mechanic.ResponsibilityId,mechanic.BodySymbolId CallableId,mechanic.InterfaceCount InterfaceReachabilityCount,
       mechanic.TestCaseCount TestReachabilityCount,mechanic.CurrentPosture,
       latest.LowererVersion,COALESCE(latest.LoweringDisposition,'NOT_EVALUATED') LoweringDisposition,
       latest.RejectionReason,latest.RequiredPrimitive,latest.DetailMessage LoweringDetail,
       mechanic.AdmissionDisposition AuthorityAdmissionStatus,
       CONVERT(bit,CASE WHEN mechanic.ResponsibilityId IS NOT NULL AND mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED' THEN 1 ELSE 0 END) ProjectionBlocking,
       (CASE WHEN mechanic.ResponsibilityId IS NOT NULL THEN 1000 ELSE 0 END)
         + COALESCE(mechanic.InterfaceCount,0)*100
         + COALESCE(mechanic.TestCaseCount,0)*10
         + CASE WHEN latest.LoweringDisposition IS NULL THEN 5 ELSE 0 END PriorityScore
FROM projection.CurrentExecutionMechanicOccurrence mechanic
LEFT JOIN RankedAttempt latest ON latest.RootId=mechanic.RootId AND latest.AnalysisDigest=mechanic.ExecutionAnalysisDigest
  AND latest.MechanicOccurrenceId=mechanic.MechanicOccurrenceId AND latest.AttemptRank=1;
GO

CREATE OR ALTER VIEW projection.CurrentAuthorityCompletionBacklog AS
SELECT mechanic.RootId,mechanic.ResponsibilityId,mechanic.BodySymbolId,mechanic.SymbolName,mechanic.ArtifactId,mechanic.MechanicKind,mechanic.AuthorityFamily,
 COUNT(*) OccurrenceCount,COALESCE(MAX(mechanic.InterfaceCount),0) InterfaceCount,COALESCE(MAX(mechanic.TestCaseCount),0) TestCaseCount,
 COALESCE(MAX(mechanic.InterfaceCount),0)*100+COALESCE(MAX(mechanic.TestCaseCount),0)*10+COUNT(*) LeverageScore,
 CASE WHEN mechanic.ResponsibilityId IS NULL THEN 'RESPONSIBILITY_OWNERSHIP_REQUIRED'
      WHEN MAX(CASE WHEN mechanic.ApplicabilityAuthorityDisposition='REVIEWED_APPLICABILITY_AUTHORITY' THEN 1 ELSE 0 END)=0 THEN 'MECHANIC_APPLICABILITY_REVIEW_REQUIRED'
      ELSE 'MECHANIC_AUTHORITY_COMPLETION_REQUIRED' END BacklogDisposition
FROM projection.CurrentExecutionMechanicOccurrence mechanic
WHERE mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED'
GROUP BY mechanic.RootId,mechanic.ResponsibilityId,mechanic.BodySymbolId,mechanic.SymbolName,mechanic.ArtifactId,mechanic.MechanicKind,mechanic.AuthorityFamily;
GO

CREATE OR ALTER VIEW projection.CurrentOperationalExecutionSummary AS
WITH CurrentAnalysis AS
(
 SELECT * FROM projection.CurrentRepositoryExecutionAnalysis WHERE ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'
), Reachable AS
(
 SELECT DISTINCT ObservationSnapshotId,CallableKey FROM observation.CommandReachability WHERE ResolutionDisposition='STATICALLY_RESOLVED'
), Owned AS
(
 SELECT DISTINCT binding.ObservationSnapshotId,binding.CallableKey,binding.ContractSnapshotId
 FROM binding.ResponsibilityCallable binding WHERE binding.BindingDisposition='RESPONSIBILITY_CALLABLE_BOUND'
), Linked AS
(
 SELECT DISTINCT binding.ObservationSnapshotId,binding.CallableKey,binding.ContractSnapshotId
 FROM binding.ResponsibilityCallable binding
), TestSymbol AS
(
 SELECT DISTINCT RootId,ImportedSymbolName FROM testobservation.TestInvocation WHERE ImportedSymbolName IS NOT NULL
), MechanicRollup AS
(
 SELECT analysis.RootId,
  COUNT(DISTINCT CASE WHEN reachable.CallableKey IS NOT NULL THEN mechanic.ExecutableMechanicFactId END) InterfaceReachableMechanicCount,
  COUNT(DISTINCT CASE WHEN linked.CallableKey IS NOT NULL THEN mechanic.ExecutableMechanicFactId END) ResponsibilityLinkedMechanicCount,
  COUNT(DISTINCT CASE WHEN owned.CallableKey IS NOT NULL THEN mechanic.ExecutableMechanicFactId END) ResponsibilityOwnedMechanicCount,
  COUNT(DISTINCT CASE WHEN testSymbol.ImportedSymbolName IS NOT NULL THEN mechanic.ExecutableMechanicFactId END) TestReachedMechanicCount,
  COUNT(DISTINCT CASE WHEN admitted.MechanicOccurrenceId IS NOT NULL THEN mechanic.ExecutableMechanicFactId END) AuthorityAdmittedMechanicCount,
  COUNT(DISTINCT CASE WHEN admitted.MechanicOccurrenceId IS NULL THEN CONCAT(COALESCE(mechanic.FromSymbolId,mechanic.ModulePath),'|',mechanic.MechanicKind) END) AuthorityCompletionBacklogCount
 FROM CurrentAnalysis analysis
 JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=analysis.SourceFactIndexId AND mechanic.RootId=analysis.RootId
 LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId AND callable.CallableId=mechanic.FromSymbolId
 LEFT JOIN Reachable reachable ON reachable.ObservationSnapshotId=analysis.ObservationSnapshotId AND reachable.CallableKey=callable.CallableKey
 LEFT JOIN Linked linked ON linked.ObservationSnapshotId=analysis.ObservationSnapshotId AND linked.CallableKey=callable.CallableKey AND linked.ContractSnapshotId=analysis.ContractSnapshotId
 LEFT JOIN Owned owned ON owned.ObservationSnapshotId=analysis.ObservationSnapshotId AND owned.CallableKey=callable.CallableKey AND owned.ContractSnapshotId=analysis.ContractSnapshotId
 LEFT JOIN TestSymbol testSymbol ON testSymbol.RootId=analysis.RootId AND testSymbol.ImportedSymbolName=callable.SymbolName
 LEFT JOIN authority.MechanicAuthorityAdmission admitted ON admitted.AnalysisDigest=analysis.AnalysisDigest AND admitted.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
  AND admitted.AuthoritySchemaId='deterministic-mechanic-authority.schema.json' AND admitted.AuthorityBasis='DETERMINISTIC_SYNTAX_LOWERING'
 GROUP BY analysis.RootId
), CallableRollup AS
(
 SELECT analysis.RootId,
  COUNT(DISTINCT CASE WHEN reachable.CallableKey IS NOT NULL AND linked.CallableKey IS NULL THEN callable.CallableKey END) ReachableUnownedCallableCount,
  COUNT(DISTINCT CASE WHEN reachable.CallableKey IS NULL THEN callable.CallableKey END) UnreachableCallableCount
 FROM CurrentAnalysis analysis
 JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId
 LEFT JOIN Reachable reachable ON reachable.ObservationSnapshotId=analysis.ObservationSnapshotId AND reachable.CallableKey=callable.CallableKey
 LEFT JOIN Linked linked ON linked.ObservationSnapshotId=analysis.ObservationSnapshotId AND linked.CallableKey=callable.CallableKey AND linked.ContractSnapshotId=analysis.ContractSnapshotId
 GROUP BY analysis.RootId
)
SELECT analysis.RootId,analysis.SourceFileCount,analysis.CallableCount,analysis.CommandCount,analysis.ReachabilityRowCount,analysis.MechanicCount,analysis.TestMechanicCount,
 COALESCE(mechanic.InterfaceReachableMechanicCount,0) InterfaceReachableMechanicCount,
 COALESCE(mechanic.ResponsibilityLinkedMechanicCount,0) ResponsibilityLinkedMechanicCount,
 COALESCE(mechanic.ResponsibilityOwnedMechanicCount,0) ResponsibilityOwnedMechanicCount,
 COALESCE(mechanic.TestReachedMechanicCount,0) TestReachedMechanicCount,
 COALESCE(mechanic.AuthorityAdmittedMechanicCount,0) AuthorityAdmittedMechanicCount,
 COALESCE(callable.ReachableUnownedCallableCount,0) ReachableUnownedCallableCount,
 COALESCE(callable.UnreachableCallableCount,0) UnreachableCallableCount,
 COALESCE(mechanic.AuthorityCompletionBacklogCount,0) AuthorityCompletionBacklogCount,
 analysis.ExecutionAnalysisDisposition
FROM projection.CurrentRepositoryExecutionAnalysis analysis
LEFT JOIN MechanicRollup mechanic ON mechanic.RootId=analysis.RootId
LEFT JOIN CallableRollup callable ON callable.RootId=analysis.RootId;
GO
