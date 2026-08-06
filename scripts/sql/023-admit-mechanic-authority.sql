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
    AdmissionDisposition nvarchar(80) NOT NULL,
    AdmittedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_MechanicAuthorityAdmission_AdmittedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_MechanicAuthorityAdmission PRIMARY KEY NONCLUSTERED (AnalysisDigest, MechanicOccurrenceId),
    CONSTRAINT CK_MechanicAuthorityAdmission_Json CHECK (ISJSON(AuthorityDataJson)=1),
    CONSTRAINT CK_MechanicAuthorityAdmission_Disposition CHECK (AdmissionDisposition = 'AUTHORITY_ADMITTED')
);
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
    DECLARE @ExpectedAnalysisDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedAnalysisDigest');
    DECLARE @ExpectedArtifactDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.expectedArtifactDigest');
    DECLARE @AuthorityDataJson nvarchar(max)=JSON_QUERY(@PayloadJson,'$.authorityData');
    IF @RootId IS NULL OR @MechanicOccurrenceId IS NULL THROW 51091,'Mechanic authority admission requires rootId and mechanicOccurrenceId.',1;
    IF ISJSON(@AuthorityDataJson)<>1 THROW 51092,'Admitted authority data must be JSON.',1;

    DECLARE @AnalysisDigest varchar(80),@SourceFactIndexId varchar(120);
    SELECT @AnalysisDigest=AnalysisDigest,@SourceFactIndexId=SourceFactIndexId
    FROM projection.CurrentRepositoryExecutionAnalysis
    WHERE RootId=@RootId AND ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT';
    IF @AnalysisDigest IS NULL THROW 51093,'Root does not have a current execution analysis.',1;
    IF @ExpectedAnalysisDigest IS NOT NULL AND @ExpectedAnalysisDigest<>@AnalysisDigest THROW 51095,'Current execution analysis does not match deterministic lowering evidence.',1;

    DECLARE @AuthorityFamily varchar(80),@CurrentArtifactDigest varchar(80);
    SELECT @AuthorityFamily=AuthorityFamily,@CurrentArtifactDigest=ArtifactDigest
    FROM projection.CurrentExecutionMechanicOccurrence
    WHERE SourceFactIndexId=@SourceFactIndexId AND RootId=@RootId AND MechanicOccurrenceId=@MechanicOccurrenceId;
    IF @AuthorityFamily IS NULL THROW 51094,'Mechanic occurrence has no current, supported authority family to admit against.',1;
    IF @ExpectedArtifactDigest IS NOT NULL AND COALESCE(@CurrentArtifactDigest,'')<>@ExpectedArtifactDigest THROW 51096,'Current source artifact does not match deterministic lowering evidence.',1;

    DECLARE @AuthorityDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),@AuthorityDataJson)),2)));

    MERGE authority.MechanicAuthorityAdmission AS target
    USING (SELECT @AnalysisDigest AS AnalysisDigest,@MechanicOccurrenceId AS MechanicOccurrenceId) AS source
      ON source.AnalysisDigest=target.AnalysisDigest AND source.MechanicOccurrenceId=target.MechanicOccurrenceId
    WHEN MATCHED THEN UPDATE SET
        AuthorityFamily=@AuthorityFamily, AuthorityDataJson=@AuthorityDataJson,
        AuthorityDigest=@AuthorityDigest, AdmissionDisposition='AUTHORITY_ADMITTED', AdmittedAtUtc=SYSUTCDATETIME()
    WHEN NOT MATCHED THEN INSERT (AnalysisDigest,MechanicOccurrenceId,AuthorityFamily,AuthorityDataJson,AuthorityDigest,AdmissionDisposition)
        VALUES (@AnalysisDigest,@MechanicOccurrenceId,@AuthorityFamily,@AuthorityDataJson,@AuthorityDigest,'AUTHORITY_ADMITTED');

    SELECT CONCAT('M|',@AnalysisDigest,'|',@MechanicOccurrenceId,'|',@AuthorityDigest,'|MECHANIC_AUTHORITY_ADMITTED') ResultLine;
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
WHERE currentAnalysis.ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT';
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
