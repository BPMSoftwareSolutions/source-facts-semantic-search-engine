-- Current operational execution graph: SQL repository image -> Source Facts ->
-- call reachability -> mechanics -> candidate authority -> tests and lineage.
-- Observed reachability and mechanics remain evidence, never inferred authority.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

IF OBJECT_ID('observation.RepositoryExecutionAnalysis','U') IS NULL
CREATE TABLE observation.RepositoryExecutionAnalysis
(
    RootId nvarchar(400) NOT NULL PRIMARY KEY,
    ApplicationId nvarchar(160) NOT NULL,
    RepositoryImageDigest varchar(80) NOT NULL,
    SourceFactIndexId varchar(120) NOT NULL,
    ObservationSnapshotId varchar(80) NOT NULL,
    ContractSnapshotId varchar(80) NOT NULL,
    AnalysisDigest varchar(80) NOT NULL,
    SourceFileCount int NOT NULL,
    CallableCount int NOT NULL,
    CommandCount int NOT NULL,
    ReachabilityRowCount int NOT NULL,
    MechanicCount int NOT NULL,
    TestFileCount int NOT NULL,
    TestMechanicCount int NOT NULL,
    AnalyzedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositoryExecutionAnalysis_AnalyzedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RepositoryExecutionAnalysis_Image FOREIGN KEY (RootId) REFERENCES inventory.RepositoryImage(RootId),
    CONSTRAINT FK_RepositoryExecutionAnalysis_Observation FOREIGN KEY (ObservationSnapshotId) REFERENCES observation.ObservationSnapshot(ObservationSnapshotId)
);
GO

IF COL_LENGTH('observation.RepositoryExecutionAnalysis','ContractSnapshotId') IS NULL
    ALTER TABLE observation.RepositoryExecutionAnalysis ADD ContractSnapshotId varchar(80) NULL;
GO

-- Execution analyses are digest-bound historical observations. They must not
-- prevent the current Source Facts scan from being atomically replaced.
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_RepositoryExecutionAnalysis_Scan' AND parent_object_id=OBJECT_ID('observation.RepositoryExecutionAnalysis'))
    ALTER TABLE observation.RepositoryExecutionAnalysis DROP CONSTRAINT FK_RepositoryExecutionAnalysis_Scan;
GO

IF OBJECT_ID('authority.MechanicApplicabilityReview','U') IS NULL
CREATE TABLE authority.MechanicApplicabilityReview
(
    AnalysisDigest varchar(80) NOT NULL,
    SourceFactIndexId varchar(120) NOT NULL,
    RootId nvarchar(400) NOT NULL,
    MechanicOccurrenceId varchar(120) NOT NULL,
    ApplicabilityDisposition nvarchar(80) NOT NULL,
    ReviewDisposition nvarchar(80) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    ReviewedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_MechanicApplicabilityReview_ReviewedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_MechanicApplicabilityReview PRIMARY KEY NONCLUSTERED (AnalysisDigest,MechanicOccurrenceId),
    CONSTRAINT CK_MechanicApplicabilityReview_Disposition CHECK (ApplicabilityDisposition IN ('AUTHORITY_REQUIRED','MECHANICAL_ADAPTER','KERNEL_PRIMITIVE','GENERATED_PROJECTION','NOT_APPLICABLE','FALSE_POSITIVE','HUMAN_REVIEW_REQUIRED')),
    CONSTRAINT CK_MechanicApplicabilityReview_Review CHECK (ReviewDisposition='APPLICABILITY_ADMITTED')
);
GO


-- A reviewed disposition remains attributable to its exact analysis digest,
-- but it must not retain obsolete mechanic rows after a newer scan is loaded.
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_MechanicApplicabilityReview_Mechanic' AND parent_object_id=OBJECT_ID('authority.MechanicApplicabilityReview'))
    ALTER TABLE authority.MechanicApplicabilityReview DROP CONSTRAINT FK_MechanicApplicabilityReview_Mechanic;
GO

CREATE OR ALTER PROCEDURE ingestion.RecordRepositoryExecutionAnalysis @PayloadJson nvarchar(max)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF ISJSON(@PayloadJson)<>1 THROW 51080,'Repository execution analysis payload must be JSON.',1;
 DECLARE @RootId nvarchar(400)=JSON_VALUE(@PayloadJson,'$.rootId'),@ApplicationId nvarchar(160)=JSON_VALUE(@PayloadJson,'$.applicationId');
 DECLARE @ImageDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.repositoryImageDigest'),@IndexId varchar(120)=JSON_VALUE(@PayloadJson,'$.sourceFactIndexId'),@ObservationSnapshotId varchar(80)=JSON_VALUE(@PayloadJson,'$.observationSnapshotId'),@ContractSnapshotId varchar(80)=JSON_VALUE(@PayloadJson,'$.contractSnapshotId'),@AnalysisDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.analysisDigest');
 IF NOT EXISTS (SELECT 1 FROM inventory.RepositoryImage WHERE RootId=@RootId AND ImageDigest=@ImageDigest) THROW 51081,'Execution analysis does not match the current repository image.',1;
 IF NOT EXISTS (SELECT 1 FROM inventory.Scan WHERE IndexId=@IndexId AND RootId=@RootId) THROW 51082,'Execution analysis source-fact index is not current for the repository root.',1;
 IF NOT EXISTS (SELECT 1 FROM observation.ObservationSnapshot WHERE ObservationSnapshotId=@ObservationSnapshotId AND IndexId=@IndexId AND RepositoryId=@RootId AND ApplicationId=@ApplicationId) THROW 51083,'Execution analysis observation does not match its source-fact index and enterprise context.',1;
 IF NOT EXISTS (SELECT 1 FROM authority.ContractSnapshot WHERE ContractSnapshotId=@ContractSnapshotId AND RepositoryId=@RootId AND ApplicationId=@ApplicationId) THROW 51084,'Execution analysis contract does not match its enterprise context.',1;
 MERGE observation.RepositoryExecutionAnalysis target USING (SELECT @RootId RootId) source ON source.RootId=target.RootId
 WHEN MATCHED THEN UPDATE SET ApplicationId=@ApplicationId,RepositoryImageDigest=@ImageDigest,SourceFactIndexId=@IndexId,ObservationSnapshotId=@ObservationSnapshotId,ContractSnapshotId=@ContractSnapshotId,AnalysisDigest=@AnalysisDigest,
   SourceFileCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.sourceFiles')),CallableCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.callables')),CommandCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.commands')),ReachabilityRowCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.reachabilityRows')),MechanicCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.mechanics')),TestFileCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.testFiles')),TestMechanicCount=TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.testMechanics')),AnalyzedAtUtc=SYSUTCDATETIME()
 WHEN NOT MATCHED THEN INSERT (RootId,ApplicationId,RepositoryImageDigest,SourceFactIndexId,ObservationSnapshotId,ContractSnapshotId,AnalysisDigest,SourceFileCount,CallableCount,CommandCount,ReachabilityRowCount,MechanicCount,TestFileCount,TestMechanicCount)
 VALUES (@RootId,@ApplicationId,@ImageDigest,@IndexId,@ObservationSnapshotId,@ContractSnapshotId,@AnalysisDigest,TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.sourceFiles')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.callables')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.commands')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.reachabilityRows')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.mechanics')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.testFiles')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.testMechanics')));
 SELECT CONCAT('X|',@AnalysisDigest,'|',@IndexId,'|REPOSITORY_EXECUTION_KNOWLEDGE_RECORDED') ResultLine;
END;
GO

CREATE OR ALTER VIEW projection.CurrentRepositoryExecutionAnalysis AS
SELECT analysis.*,
 CASE WHEN image.RootId IS NULL THEN 'REPOSITORY_IMAGE_MISSING'
      WHEN analysis.RepositoryImageDigest<>image.ImageDigest THEN 'EXECUTION_ANALYSIS_STALE'
      WHEN scan.IndexId IS NULL OR snapshot.ObservationSnapshotId IS NULL OR contract.ContractSnapshotId IS NULL THEN 'EXECUTION_ANALYSIS_SUBJECT_MISSING'
      ELSE 'EXECUTION_ANALYSIS_CURRENT' END ExecutionAnalysisDisposition
FROM observation.RepositoryExecutionAnalysis analysis
LEFT JOIN inventory.RepositoryImage image ON image.RootId=analysis.RootId
LEFT JOIN inventory.Scan scan ON scan.IndexId=analysis.SourceFactIndexId AND scan.RootId=analysis.RootId
LEFT JOIN observation.ObservationSnapshot snapshot ON snapshot.ObservationSnapshotId=analysis.ObservationSnapshotId AND snapshot.IndexId=analysis.SourceFactIndexId
LEFT JOIN authority.ContractSnapshot contract ON contract.ContractSnapshotId=analysis.ContractSnapshotId;
GO

CREATE OR ALTER VIEW projection.CurrentExecutionMechanicOccurrence AS
WITH CurrentAnalysis AS
(
 SELECT * FROM projection.CurrentRepositoryExecutionAnalysis WHERE ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'
), Ownership AS
(
 SELECT analysis.RootId,binding.CallableKey,
  CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(feature.FeatureId) END FeatureId,
  CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(scenario.ScenarioId) END ScenarioId,
  CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(obligation.ObligationId) END ObligationId,
  CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(responsibility.ResponsibilityId) END ResponsibilityId,
  CASE WHEN COUNT(DISTINCT responsibility.ResponsibilityId)=1 THEN MAX(binding.BindingDisposition) END ResponsibilityBindingDisposition,
  COUNT(DISTINCT responsibility.ResponsibilityId) CandidateResponsibilityCount
 FROM CurrentAnalysis analysis
 JOIN binding.ResponsibilityCallable binding ON binding.ContractSnapshotId=analysis.ContractSnapshotId AND binding.ObservationSnapshotId=analysis.ObservationSnapshotId
 JOIN lineage.Responsibility responsibility ON responsibility.ContractSnapshotId=binding.ContractSnapshotId AND responsibility.ResponsibilityId=binding.ResponsibilityId
 JOIN lineage.Obligation obligation ON obligation.ContractSnapshotId=responsibility.ContractSnapshotId AND obligation.ObligationId=responsibility.ObligationId
 JOIN lineage.Scenario scenario ON scenario.ContractSnapshotId=obligation.ContractSnapshotId AND scenario.ScenarioId=obligation.ScenarioId
 JOIN lineage.Feature feature ON feature.ContractSnapshotId=scenario.ContractSnapshotId AND feature.FeatureId=scenario.FeatureId
 GROUP BY analysis.RootId,binding.CallableKey
), Reachability AS
(
 SELECT analysis.RootId,reach.CallableKey,COUNT(DISTINCT reach.CommandId) InterfaceCount,MIN(reach.Depth) MinimumPathDepth
 FROM CurrentAnalysis analysis JOIN observation.CommandReachability reach ON reach.ObservationSnapshotId=analysis.ObservationSnapshotId AND reach.ResolutionDisposition='STATICALLY_RESOLVED'
 GROUP BY analysis.RootId,reach.CallableKey
), TestReachBase AS
(
 SELECT DISTINCT RootId,ImportedSymbolName,TestId FROM testobservation.TestInvocation WHERE ImportedSymbolName IS NOT NULL
), TestReach AS
(
 SELECT RootId,ImportedSymbolName,COUNT(*) TestCaseCount,
  CONCAT('[',STRING_AGG(CONVERT(nvarchar(max),CONCAT('{"testCaseId":"',STRING_ESCAPE(TestId,'json'),'"}')),','),']') TestCaseIdsJson
 FROM TestReachBase GROUP BY RootId,ImportedSymbolName
)
SELECT currentAnalysis.RootId,currentAnalysis.ApplicationId,currentAnalysis.RepositoryImageDigest,currentAnalysis.AnalysisDigest ExecutionAnalysisDigest,
 mechanic.IndexId SourceFactIndexId,mechanic.ExecutableMechanicFactId MechanicOccurrenceId,mechanic.MechanicKind,family.AuthorityFamily,family.AuthorityKind,
 artifact.RelativePath ArtifactId,CASE WHEN mechanic.ModulePath LIKE 'test/%' THEN 'test' WHEN mechanic.ModulePath LIKE 'scripts/%' THEN 'script' WHEN mechanic.ModulePath LIKE 'src/%' THEN 'production' ELSE 'repository-support' END ArtifactRole,
 mechanic.FromSymbolId BodySymbolId,callable.CallableKey,callable.SymbolName,mechanic.SourceReferenceId,reference.StartLine,reference.StartColumn,artifact.ContentDigest ArtifactDigest,
 ownership.FeatureId,ownership.ScenarioId,ownership.ObligationId,ownership.ResponsibilityId,ownership.ResponsibilityBindingDisposition,COALESCE(ownership.CandidateResponsibilityCount,0) CandidateResponsibilityCount,
 COALESCE(reachability.InterfaceCount,0) InterfaceCount,reachability.MinimumPathDepth,COALESCE(testReach.TestCaseCount,0) TestCaseCount,testReach.TestCaseIdsJson,
 COALESCE(applicability.ApplicabilityDisposition,'HUMAN_REVIEW_REQUIRED') ApplicabilityDisposition,
 CASE WHEN applicability.ReviewDisposition='APPLICABILITY_ADMITTED' THEN 'REVIEWED_APPLICABILITY_AUTHORITY' ELSE 'APPLICABILITY_REVIEW_REQUIRED' END ApplicabilityAuthorityDisposition,
 authorityProjection.ProjectionDisposition AuthorityProjectionDisposition,'CANDIDATE_NOT_ADMITTED' AdmissionDisposition,
 CASE WHEN artifact.RootId IS NULL OR sourceFile.ContentHash<>artifact.ContentDigest THEN 'SOURCE_EVIDENCE_STALE' ELSE 'CURRENT_REPOSITORY_IMAGE' END CurrentPosture
FROM CurrentAnalysis currentAnalysis
JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=currentAnalysis.SourceFactIndexId AND mechanic.RootId=currentAnalysis.RootId
LEFT JOIN authority.MechanicAuthorityFamily family ON family.MechanicKind=mechanic.MechanicKind
LEFT JOIN source.SourceReference reference ON reference.SourceReferenceKey=mechanic.SourceReferenceKey
LEFT JOIN inventory.SourceFile sourceFile ON sourceFile.IndexId=mechanic.IndexId AND sourceFile.RootId=mechanic.RootId AND sourceFile.RelativePath=mechanic.ModulePath
LEFT JOIN inventory.RepositoryArtifact artifact ON artifact.RootId=currentAnalysis.RootId AND artifact.RelativePath=mechanic.ModulePath
LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=currentAnalysis.ObservationSnapshotId AND callable.CallableId=mechanic.FromSymbolId
LEFT JOIN Ownership ownership ON ownership.RootId=currentAnalysis.RootId AND ownership.CallableKey=callable.CallableKey
LEFT JOIN Reachability reachability ON reachability.RootId=currentAnalysis.RootId AND reachability.CallableKey=callable.CallableKey
LEFT JOIN TestReach testReach ON testReach.RootId=currentAnalysis.RootId AND testReach.ImportedSymbolName=callable.SymbolName
LEFT JOIN authority.MechanicApplicabilityReview applicability ON applicability.AnalysisDigest=currentAnalysis.AnalysisDigest AND applicability.SourceFactIndexId=mechanic.IndexId AND applicability.RootId=mechanic.RootId AND applicability.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
LEFT JOIN projection.ExecutionMechanicAuthority authorityProjection ON authorityProjection.SourceFactIndexId=mechanic.IndexId AND authorityProjection.RootId=mechanic.RootId AND authorityProjection.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
;
GO

CREATE OR ALTER VIEW projection.CurrentOperationalExecutionKnowledge AS
SELECT mechanic.RootId,mechanic.ApplicationId,command.CommandId InterfaceId,command.CommandName,command.HandlerSymbolId RootCallableId,
 mechanic.FeatureId,mechanic.ScenarioId,mechanic.ObligationId,mechanic.ResponsibilityId,callable.CallableId,callable.ModulePath,
 reach.PathWitnessJson CallPath,reach.Depth PathDepth,mechanic.ArtifactId,mechanic.ArtifactRole,mechanic.MechanicOccurrenceId,mechanic.MechanicKind,mechanic.AuthorityFamily,
 mechanic.ApplicabilityDisposition,mechanic.ApplicabilityAuthorityDisposition,mechanic.AuthorityProjectionDisposition,mechanic.AdmissionDisposition,mechanic.TestCaseIdsJson,
 CASE WHEN reach.CommandId IS NOT NULL THEN 'INTERFACE_REACHABLE' ELSE 'NOT_INTERFACE_REACHABLE' END InterfaceReachabilityDisposition,
 CASE WHEN mechanic.ResponsibilityBindingDisposition='RESPONSIBILITY_CALLABLE_BOUND' THEN 'RESPONSIBILITY_REACHABLE' WHEN mechanic.ResponsibilityId IS NOT NULL THEN 'RESPONSIBILITY_CANDIDATE_REACHABLE' ELSE 'RESPONSIBILITY_OWNERSHIP_UNRESOLVED' END ResponsibilityReachabilityDisposition,
 CASE WHEN mechanic.TestCaseCount>0 THEN 'TEST_REACHABLE' ELSE 'TEST_REACHABILITY_NOT_OBSERVED' END TestReachabilityDisposition,
 CASE WHEN mechanic.AdmissionDisposition='AUTHORITY_ADMITTED' THEN 'AUTHORITY_REACHABLE' ELSE 'AUTHORITY_COMPLETION_REQUIRED' END AuthorityReachabilityDisposition,
 CASE WHEN mechanic.CurrentPosture<>'CURRENT_REPOSITORY_IMAGE' THEN 'SOURCE_EVIDENCE_STALE' WHEN mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED' THEN 'AUTHORITY_COMPLETION_REQUIRED' ELSE 'AUTHORITY_SLICE_CLOSED' END ProjectionReadiness
FROM projection.CurrentExecutionMechanicOccurrence mechanic
LEFT JOIN observation.Callable callable ON callable.CallableKey=mechanic.CallableKey AND callable.ObservationSnapshotId=(SELECT ObservationSnapshotId FROM projection.CurrentRepositoryExecutionAnalysis WHERE RootId=mechanic.RootId AND ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT')
LEFT JOIN observation.CommandReachability reach ON reach.CallableKey=callable.CallableKey AND reach.ObservationSnapshotId=callable.ObservationSnapshotId AND reach.ResolutionDisposition='STATICALLY_RESOLVED'
LEFT JOIN observation.CliCommand command ON command.ObservationSnapshotId=reach.ObservationSnapshotId AND command.CommandId=reach.CommandId;
GO

CREATE OR ALTER VIEW projection.CurrentReachableUnownedCallables AS
SELECT analysis.RootId,analysis.ApplicationId,callable.CallableId,callable.SymbolName,callable.ModulePath,COUNT(DISTINCT reach.CommandId) InterfaceCount,MIN(reach.Depth) MinimumPathDepth,
 CASE WHEN EXISTS (SELECT 1 FROM testobservation.TestInvocation invocation WHERE invocation.RootId=analysis.RootId AND invocation.ImportedSymbolName=callable.SymbolName) THEN 'TEST_REACHABLE' ELSE 'TEST_REACHABILITY_NOT_OBSERVED' END TestReachabilityDisposition,
 'REACHABLE_CALLABLE_OWNERSHIP_REQUIRED' BacklogDisposition
FROM projection.CurrentRepositoryExecutionAnalysis analysis
JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId
JOIN observation.CommandReachability reach ON reach.ObservationSnapshotId=callable.ObservationSnapshotId AND reach.CallableKey=callable.CallableKey AND reach.ResolutionDisposition='STATICALLY_RESOLVED'
WHERE analysis.ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'
AND NOT EXISTS (SELECT 1 FROM binding.ResponsibilityCallable binding WHERE binding.ObservationSnapshotId=analysis.ObservationSnapshotId AND binding.CallableKey=callable.CallableKey AND binding.ContractSnapshotId=analysis.ContractSnapshotId)
GROUP BY analysis.RootId,analysis.ApplicationId,callable.CallableId,callable.SymbolName,callable.ModulePath;
GO

CREATE OR ALTER VIEW projection.CurrentUnreachableRepositoryBodies AS
SELECT analysis.RootId,analysis.ApplicationId,callable.CallableId,callable.SymbolName,callable.ModulePath,callable.ClosureClassification,
 CASE WHEN EXISTS (SELECT 1 FROM testobservation.TestInvocation invocation WHERE invocation.RootId=analysis.RootId AND invocation.ImportedSymbolName=callable.SymbolName) THEN 'TEST_REACHABLE' ELSE 'TEST_REACHABILITY_NOT_OBSERVED' END TestReachabilityDisposition,
 CASE WHEN EXISTS (SELECT 1 FROM binding.ResponsibilityCallable binding WHERE binding.ObservationSnapshotId=analysis.ObservationSnapshotId AND binding.ContractSnapshotId=analysis.ContractSnapshotId AND binding.CallableKey=callable.CallableKey) THEN 'INTERNAL_OR_INACCESSIBLE_CAPABILITY_REVIEW' ELSE 'FAT_OR_NOISE_REVIEW_CANDIDATE' END BacklogDisposition
FROM projection.CurrentRepositoryExecutionAnalysis analysis JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId
WHERE analysis.ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT' AND NOT EXISTS (SELECT 1 FROM observation.CommandReachability reach WHERE reach.ObservationSnapshotId=analysis.ObservationSnapshotId AND reach.CallableKey=callable.CallableKey AND reach.ResolutionDisposition='STATICALLY_RESOLVED');
GO

CREATE OR ALTER VIEW projection.CurrentResponsibilityProjectionReadiness AS
SELECT seal.RootId,responsibility.ResponsibilityId,COUNT(mechanic.MechanicOccurrenceId) ObservedMechanicCount,
 SUM(CASE WHEN mechanic.AdmissionDisposition='AUTHORITY_ADMITTED' THEN 1 ELSE 0 END) AdmittedAuthorityCount,
 SUM(CASE WHEN mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED' THEN 1 ELSE 0 END) MissingAuthorityCount,
 SUM(CASE WHEN mechanic.ApplicabilityAuthorityDisposition<>'REVIEWED_APPLICABILITY_AUTHORITY' THEN 1 ELSE 0 END) ApplicabilityReviewRequiredCount,
 CASE WHEN COUNT(mechanic.MechanicOccurrenceId)=0 THEN 'NO_OBSERVED_MECHANICS' WHEN SUM(CASE WHEN mechanic.ApplicabilityAuthorityDisposition<>'REVIEWED_APPLICABILITY_AUTHORITY' THEN 1 ELSE 0 END)>0 THEN 'APPLICABILITY_REVIEW_REQUIRED' WHEN SUM(CASE WHEN mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED' THEN 1 ELSE 0 END)>0 THEN 'AUTHORITY_COMPLETION_REQUIRED' ELSE 'AUTHORITY_SLICE_CLOSED' END ClosureDisposition
FROM projection.RepositoryLineageSeal seal JOIN lineage.Responsibility responsibility ON responsibility.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId
LEFT JOIN projection.CurrentExecutionMechanicOccurrence mechanic ON mechanic.RootId=seal.RootId AND mechanic.ResponsibilityId=responsibility.ResponsibilityId
GROUP BY seal.RootId,responsibility.ResponsibilityId;
GO

CREATE OR ALTER VIEW projection.CurrentScenarioExecutionCoverage AS
SELECT seal.RootId,scenario.ScenarioId,COUNT(DISTINCT meaning.TestId) CandidateTestCount,COUNT(DISTINCT invocation.InvocationId) ObservedInvocationCount,COUNT(DISTINCT mechanic.ExecutableMechanicFactId) ExercisedMechanicCount,COUNT(DISTINCT reach.CommandId) InterfaceCount,
 CASE WHEN COUNT(DISTINCT meaning.TestId)=0 THEN 'SCENARIO_TEST_MEANING_MISSING' WHEN COUNT(DISTINCT mechanic.ExecutableMechanicFactId)=0 THEN 'SCENARIO_EXECUTION_PATH_UNRESOLVED' ELSE 'SCENARIO_EXECUTION_EVIDENCE_OBSERVED_NOT_ADMITTED' END ExecutionCoverageDisposition
FROM projection.RepositoryLineageSeal seal JOIN lineage.Scenario scenario ON scenario.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId
LEFT JOIN projection.CurrentTestMeaning meaning ON meaning.RootId=seal.RootId AND meaning.CandidateScenarioId=scenario.ScenarioId
LEFT JOIN testobservation.TestInvocation invocation ON invocation.RootId=meaning.RootId AND invocation.TestId=meaning.TestId
LEFT JOIN projection.CurrentRepositoryExecutionAnalysis analysis ON analysis.RootId=seal.RootId AND analysis.ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'
LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId AND callable.SymbolName=invocation.ImportedSymbolName AND (invocation.ImportedModulePath IS NULL OR callable.ModulePath LIKE CONCAT(invocation.ImportedModulePath,'.%'))
LEFT JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=analysis.SourceFactIndexId AND mechanic.RootId=analysis.RootId AND mechanic.FromSymbolId=callable.CallableId
LEFT JOIN observation.CommandReachability reach ON reach.ObservationSnapshotId=analysis.ObservationSnapshotId AND reach.CallableKey=callable.CallableKey AND reach.ResolutionDisposition='STATICALLY_RESOLVED'
GROUP BY seal.RootId,scenario.ScenarioId;
GO

CREATE OR ALTER VIEW projection.CurrentAuthorityCompletionBacklog AS
WITH CurrentAnalysis AS
(
 SELECT * FROM projection.CurrentRepositoryExecutionAnalysis WHERE ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'
), Reachability AS
(
 SELECT analysis.RootId,reach.CallableKey,COUNT(DISTINCT reach.CommandId) InterfaceCount
 FROM CurrentAnalysis analysis JOIN observation.CommandReachability reach ON reach.ObservationSnapshotId=analysis.ObservationSnapshotId AND reach.ResolutionDisposition='STATICALLY_RESOLVED'
 GROUP BY analysis.RootId,reach.CallableKey
), TestReach AS
(
 SELECT RootId,ImportedSymbolName,COUNT(DISTINCT TestId) TestCaseCount FROM testobservation.TestInvocation WHERE ImportedSymbolName IS NOT NULL GROUP BY RootId,ImportedSymbolName
), Ownership AS
(
 SELECT analysis.RootId,binding.CallableKey,CASE WHEN COUNT(DISTINCT binding.ResponsibilityId)=1 THEN MAX(binding.ResponsibilityId) END ResponsibilityId
 FROM CurrentAnalysis analysis JOIN binding.ResponsibilityCallable binding ON binding.ContractSnapshotId=analysis.ContractSnapshotId AND binding.ObservationSnapshotId=analysis.ObservationSnapshotId
 GROUP BY analysis.RootId,binding.CallableKey
)
SELECT analysis.RootId,ownership.ResponsibilityId,mechanic.FromSymbolId BodySymbolId,callable.SymbolName,mechanic.ModulePath ArtifactId,mechanic.MechanicKind,family.AuthorityFamily,
 COUNT(*) OccurrenceCount,COALESCE(MAX(reachability.InterfaceCount),0) InterfaceCount,COALESCE(MAX(testReach.TestCaseCount),0) TestCaseCount,
 COALESCE(MAX(reachability.InterfaceCount),0)*100+COALESCE(MAX(testReach.TestCaseCount),0)*10+COUNT(*) LeverageScore,
 CASE WHEN ownership.ResponsibilityId IS NULL THEN 'RESPONSIBILITY_OWNERSHIP_REQUIRED' WHEN MAX(applicability.ReviewDisposition) IS NULL THEN 'MECHANIC_APPLICABILITY_REVIEW_REQUIRED' ELSE 'MECHANIC_AUTHORITY_COMPLETION_REQUIRED' END BacklogDisposition
FROM CurrentAnalysis analysis
JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=analysis.SourceFactIndexId AND mechanic.RootId=analysis.RootId
LEFT JOIN authority.MechanicAuthorityFamily family ON family.MechanicKind=mechanic.MechanicKind
LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId AND callable.CallableId=mechanic.FromSymbolId
LEFT JOIN Reachability reachability ON reachability.RootId=analysis.RootId AND reachability.CallableKey=callable.CallableKey
LEFT JOIN TestReach testReach ON testReach.RootId=analysis.RootId AND testReach.ImportedSymbolName=callable.SymbolName
LEFT JOIN Ownership ownership ON ownership.RootId=analysis.RootId AND ownership.CallableKey=callable.CallableKey
LEFT JOIN authority.MechanicApplicabilityReview applicability ON applicability.AnalysisDigest=analysis.AnalysisDigest AND applicability.SourceFactIndexId=mechanic.IndexId AND applicability.RootId=mechanic.RootId AND applicability.MechanicOccurrenceId=mechanic.ExecutableMechanicFactId
GROUP BY analysis.RootId,ownership.ResponsibilityId,mechanic.FromSymbolId,callable.SymbolName,mechanic.ModulePath,mechanic.MechanicKind,family.AuthorityFamily;
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
  CONVERT(int,0) AuthorityAdmittedMechanicCount,
  COUNT(DISTINCT CONCAT(COALESCE(mechanic.FromSymbolId,mechanic.ModulePath),'|',mechanic.MechanicKind)) AuthorityCompletionBacklogCount
 FROM CurrentAnalysis analysis
 JOIN fact.ExecutableMechanic mechanic ON mechanic.IndexId=analysis.SourceFactIndexId AND mechanic.RootId=analysis.RootId
 LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId=analysis.ObservationSnapshotId AND callable.CallableId=mechanic.FromSymbolId
 LEFT JOIN Reachable reachable ON reachable.ObservationSnapshotId=analysis.ObservationSnapshotId AND reachable.CallableKey=callable.CallableKey
 LEFT JOIN Linked linked ON linked.ObservationSnapshotId=analysis.ObservationSnapshotId AND linked.CallableKey=callable.CallableKey AND linked.ContractSnapshotId=analysis.ContractSnapshotId
 LEFT JOIN Owned owned ON owned.ObservationSnapshotId=analysis.ObservationSnapshotId AND owned.CallableKey=callable.CallableKey AND owned.ContractSnapshotId=analysis.ContractSnapshotId
 LEFT JOIN TestSymbol testSymbol ON testSymbol.RootId=analysis.RootId AND testSymbol.ImportedSymbolName=callable.SymbolName
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
