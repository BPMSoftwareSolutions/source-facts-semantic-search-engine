-- Classify every current observed test without promoting inference into authority.
-- Reviewed meaning is stored separately and only applies to the exact analysis digest.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

IF COL_LENGTH('testobservation.RepositoryTestAnalysis','MeaningRecommendationCount') IS NULL
    ALTER TABLE testobservation.RepositoryTestAnalysis ADD MeaningRecommendationCount int NULL, UnresolvedMeaningCount int NULL;
GO

IF OBJECT_ID('testobservation.TestMeaningClassification','U') IS NULL
CREATE TABLE testobservation.TestMeaningClassification
(
    RootId nvarchar(400) NOT NULL,
    TestId varchar(80) NOT NULL,
    RecommendedProofType nvarchar(80) NOT NULL,
    RecommendedOntologyLane nvarchar(40) NOT NULL,
    Confidence nvarchar(20) NOT NULL,
    ClassificationDisposition nvarchar(100) NOT NULL,
    ReviewDisposition nvarchar(80) NOT NULL,
    EvidenceJson nvarchar(max) NOT NULL,
    CONSTRAINT PK_CurrentTestMeaningClassification PRIMARY KEY (RootId,TestId),
    CONSTRAINT FK_CurrentTestMeaningClassification_Test FOREIGN KEY (RootId,TestId) REFERENCES testobservation.TestCase(RootId,TestId),
    CONSTRAINT CK_CurrentTestMeaningClassification_Evidence CHECK (ISJSON(EvidenceJson)=1),
    CONSTRAINT CK_CurrentTestMeaningClassification_ProofType CHECK (RecommendedProofType IN
      ('SCENARIO_TEST','RESPONSIBILITY_TEST','INTEGRATION_TEST','KERNEL_TEST','ADAPTER_TEST','PROJECTION_TEST','EQUIVALENCE_TEST','REGRESSION_EVIDENCE','DUPLICATE_TEST','POTENTIAL_CAPABILITY','HISTORICAL_OR_INACTIVE','NOISE_OR_UNRESOLVED')),
    CONSTRAINT CK_CurrentTestMeaningClassification_Lane CHECK (RecommendedOntologyLane IN ('ACTIVE_CANONICAL','CANDIDATE','INACTIVE','HISTORICAL','EXCLUDED','UNRESOLVED')),
    CONSTRAINT CK_CurrentTestMeaningClassification_Confidence CHECK (Confidence IN ('HIGH','MEDIUM','LOW'))
    ,CONSTRAINT CK_CurrentTestMeaningClassification_Disposition CHECK (ClassificationDisposition='DETERMINISTIC_RECOMMENDATION_NOT_ADMITTED' AND ReviewDisposition='REVIEW_REQUIRED')
);
GO

IF OBJECT_ID('testauthority.TestMeaningReview','U') IS NULL
CREATE TABLE testauthority.TestMeaningReview
(
    TestMeaningReviewId varchar(80) NOT NULL,
    RootId nvarchar(400) NOT NULL,
    TestId varchar(80) NOT NULL,
    TestAnalysisDigest varchar(80) NOT NULL,
    ReviewedProofType nvarchar(80) NOT NULL,
    OntologyLane nvarchar(40) NOT NULL,
    ReviewDisposition nvarchar(80) NOT NULL,
    ReviewEvidenceJson nvarchar(max) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    ReviewedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_TestMeaningReview_ReviewedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_TestMeaningReview PRIMARY KEY (TestMeaningReviewId),
    CONSTRAINT CK_TestMeaningReview_Evidence CHECK (ISJSON(ReviewEvidenceJson)=1),
    CONSTRAINT CK_TestMeaningReview_Disposition CHECK (ReviewDisposition IN ('REVIEW_ADMITTED','REVIEW_REJECTED','REVIEW_DEFERRED'))
);
GO

IF COL_LENGTH('testauthority.TestMeaningReview','TestMeaningReviewId') IS NULL
    ALTER TABLE testauthority.TestMeaningReview ADD TestMeaningReviewId varchar(80) NULL;
GO
IF EXISTS
(
    SELECT 1 FROM sys.key_constraints keyConstraint
    JOIN sys.index_columns indexColumn ON indexColumn.object_id=keyConstraint.parent_object_id AND indexColumn.index_id=keyConstraint.unique_index_id
    JOIN sys.columns columnMetadata ON columnMetadata.object_id=indexColumn.object_id AND columnMetadata.column_id=indexColumn.column_id
    WHERE keyConstraint.name='PK_TestMeaningReview' AND columnMetadata.name='RootId'
)
BEGIN
    EXEC(N'UPDATE testauthority.TestMeaningReview SET TestMeaningReviewId=CONCAT(''sha256:'',LOWER(CONVERT(varchar(64),HASHBYTES(''SHA2_256'',CONVERT(varchar(max),CONCAT(RootId,''|'',TestId,''|'',TestAnalysisDigest))),2)))');
    EXEC(N'ALTER TABLE testauthority.TestMeaningReview ALTER COLUMN TestMeaningReviewId varchar(80) NOT NULL');
    EXEC(N'ALTER TABLE testauthority.TestMeaningReview DROP CONSTRAINT PK_TestMeaningReview');
    EXEC(N'ALTER TABLE testauthority.TestMeaningReview ADD CONSTRAINT PK_TestMeaningReview PRIMARY KEY (TestMeaningReviewId)');
END;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadRepositoryTestKnowledge @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 51050, 'Repository test knowledge payload must be JSON.', 1;
    DECLARE @RootId nvarchar(400)=JSON_VALUE(@PayloadJson,'$.rootId'), @ApplicationId nvarchar(160)=JSON_VALUE(@PayloadJson,'$.applicationId');
    DECLARE @ImageDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.imageDigest'), @ContractSnapshotId varchar(80)=JSON_VALUE(@PayloadJson,'$.contractSnapshotId'), @AnalysisDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.analysisDigest');
    IF JSON_VALUE(@PayloadJson,'$.analysisType') <> 'repository-test-knowledge.v2' THROW 51051, 'Unexpected repository test knowledge type.', 1;
    IF NOT EXISTS (SELECT 1 FROM inventory.RepositoryImage WHERE RootId=@RootId AND ImageDigest=@ImageDigest) THROW 51052, 'Repository test knowledge does not match the current image.', 1;
    IF NOT EXISTS (SELECT 1 FROM authority.ContractSnapshot WHERE ContractSnapshotId=@ContractSnapshotId AND ProjectId=@RootId AND ApplicationId=@ApplicationId) THROW 51053, 'Repository test knowledge does not match loaded canonical intent authority.', 1;
    IF (SELECT COUNT(*) FROM OPENJSON(@PayloadJson,'$.testCases')) <> (SELECT COUNT(*) FROM OPENJSON(@PayloadJson,'$.meaningClassifications')) THROW 51070, 'Every observed test requires one meaning recommendation.', 1;
    BEGIN TRANSACTION;
      DELETE FROM testexecution.RepositoryTestClosureSeal WHERE RootId=@RootId;
      DELETE FROM testbinding.TestVectorArtifact WHERE RootId=@RootId;
      DELETE FROM testbinding.TestCaseCandidate WHERE RootId=@RootId;
      DELETE FROM testobservation.TestMeaningClassification WHERE RootId=@RootId;
      DELETE FROM testobservation.Assertion WHERE RootId=@RootId;
      DELETE FROM testobservation.FixtureUsage WHERE RootId=@RootId;
      DELETE FROM testobservation.MockUsage WHERE RootId=@RootId;
      DELETE FROM testobservation.TestInvocation WHERE RootId=@RootId;
      DELETE FROM testobservation.TestCase WHERE RootId=@RootId;
      DELETE FROM testobservation.TestSuite WHERE RootId=@RootId;
      DELETE FROM testobservation.TestArtifact WHERE RootId=@RootId;
      DELETE FROM testobservation.RepositoryTestAnalysis WHERE RootId=@RootId;
      INSERT testobservation.RepositoryTestAnalysis
        (RootId,ApplicationId,ImageDigest,ContractSnapshotId,AnalysisDigest,TestArtifactCount,TestCaseCount,SuiteCount,AssertionCount,FixtureUsageCount,MockUsageCount,InvocationCount,CandidateTestCount,UnboundTestCount,MeaningRecommendationCount,UnresolvedMeaningCount)
      SELECT @RootId,@ApplicationId,@ImageDigest,@ContractSnapshotId,@AnalysisDigest,
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.testArtifacts')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.testCases')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.suites')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.assertions')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.fixtureUsages')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.mockUsages')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.invocations')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.candidateTests')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.unboundTests')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.meaningRecommendations')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.unresolvedMeanings'));
      INSERT testobservation.TestArtifact SELECT @RootId,JSON_VALUE(value,'$.testArtifactKey'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.contentDigest'),TRY_CONVERT(int,JSON_VALUE(value,'$.testCaseCount')),JSON_VALUE(value,'$.analysisDisposition') FROM OPENJSON(@PayloadJson,'$.artifacts');
      INSERT testobservation.TestSuite SELECT @RootId,JSON_VALUE(value,'$.suiteId'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.parentSuiteId'),JSON_VALUE(value,'$.suiteName'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.suites');
      INSERT testobservation.TestCase SELECT @RootId,JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.suiteId'),JSON_QUERY(value,'$.suitePath'),JSON_VALUE(value,'$.testName'),JSON_VALUE(value,'$.framework'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.executionStatus'),JSON_VALUE(value,'$.currentPosture'),JSON_VALUE(value,'$.canonicalBindingDisposition'),JSON_VALUE(value,'$.candidateBindingDisposition') FROM OPENJSON(@PayloadJson,'$.testCases');
      INSERT testobservation.Assertion SELECT @RootId,JSON_VALUE(value,'$.assertionId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.assertionKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.expressionText') FROM OPENJSON(@PayloadJson,'$.assertions');
      INSERT testobservation.FixtureUsage SELECT @RootId,JSON_VALUE(value,'$.fixtureUsageId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.fixtureKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.fixtureUsages');
      INSERT testobservation.MockUsage SELECT @RootId,JSON_VALUE(value,'$.mockUsageId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.mockKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.mockUsages');
      INSERT testobservation.TestInvocation SELECT @RootId,JSON_VALUE(value,'$.invocationId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.invocationName'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.importedModulePath'),JSON_VALUE(value,'$.importedSymbolName') FROM OPENJSON(@PayloadJson,'$.invocations');
      INSERT testbinding.TestCaseCandidate SELECT @RootId,JSON_VALUE(value,'$.candidateId'),JSON_VALUE(value,'$.testId'),@ContractSnapshotId,JSON_VALUE(value,'$.featureId'),JSON_VALUE(value,'$.scenarioId'),JSON_VALUE(value,'$.obligationId'),JSON_VALUE(value,'$.responsibilityId'),TRY_CONVERT(int,JSON_VALUE(value,'$.distinctScenarioCount')),JSON_VALUE(value,'$.bindingDisposition') FROM OPENJSON(@PayloadJson,'$.candidates');
      INSERT testobservation.TestMeaningClassification
      SELECT @RootId,JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.recommendedProofType'),JSON_VALUE(value,'$.recommendedOntologyLane'),JSON_VALUE(value,'$.confidence'),JSON_VALUE(value,'$.classificationDisposition'),JSON_VALUE(value,'$.reviewDisposition'),JSON_QUERY(value,'$.evidence') FROM OPENJSON(@PayloadJson,'$.meaningClassifications');
    COMMIT;
    SELECT CONCAT('R|',@AnalysisDigest,'|',JSON_VALUE(@PayloadJson,'$.summary.testArtifacts'),'|',JSON_VALUE(@PayloadJson,'$.summary.testCases'),'|',JSON_VALUE(@PayloadJson,'$.summary.assertions'),'|',JSON_VALUE(@PayloadJson,'$.summary.candidateTests'),'|',JSON_VALUE(@PayloadJson,'$.summary.unboundTests'),'|',JSON_VALUE(@PayloadJson,'$.summary.meaningRecommendations'),'|',JSON_VALUE(@PayloadJson,'$.summary.unresolvedMeanings'),'|TEST_KNOWLEDGE_ADMITTED_AS_OBSERVATION') ResultLine;
END;
GO

CREATE OR ALTER VIEW projection.CurrentTestMeaning AS
SELECT analysis.RootId,analysis.ApplicationId,analysis.AnalysisDigest TestAnalysisDigest,testCase.TestId,testCase.TestFilePath,testCase.TestName,testCase.ExecutionStatus,
       classification.RecommendedProofType,classification.RecommendedOntologyLane,classification.Confidence,classification.EvidenceJson,
       candidate.FeatureId CandidateFeatureId,candidate.ScenarioId CandidateScenarioId,candidate.ResponsibilityId CandidateResponsibilityId,candidate.CandidateScenarioCount,
       JSON_QUERY((SELECT invocation.InvocationName invocationName,invocation.ImportedModulePath importedModulePath,invocation.ImportedSymbolName importedSymbolName FROM testobservation.TestInvocation invocation WHERE invocation.RootId=testCase.RootId AND invocation.TestId=testCase.TestId ORDER BY invocation.StartLine,invocation.InvocationId FOR JSON PATH)) ObservedInvocationsJson,
       JSON_QUERY((SELECT assertion.AssertionKind assertionKind,assertion.ExpressionText expressionText FROM testobservation.Assertion assertion WHERE assertion.RootId=testCase.RootId AND assertion.TestId=testCase.TestId ORDER BY assertion.StartLine,assertion.AssertionId FOR JSON PATH)) AssertionsJson,
       JSON_QUERY((SELECT fixture.FixtureKind fixtureKind FROM testobservation.FixtureUsage fixture WHERE fixture.RootId=testCase.RootId AND fixture.TestId=testCase.TestId ORDER BY fixture.StartLine,fixture.FixtureUsageId FOR JSON PATH)) FixturesJson,
       COALESCE(review.ReviewedProofType,classification.RecommendedProofType) EffectiveProofType,
       COALESCE(review.OntologyLane,classification.RecommendedOntologyLane) EffectiveOntologyLane,
       COALESCE(review.ReviewDisposition,classification.ReviewDisposition) ReviewDisposition,
       CASE WHEN review.ReviewDisposition='REVIEW_ADMITTED' THEN 'REVIEWED_MEANING_AUTHORITY' ELSE 'OBSERVED_MEANING_RECOMMENDATION' END MeaningAuthorityDisposition
FROM testobservation.RepositoryTestAnalysis analysis
JOIN testobservation.TestCase testCase ON testCase.RootId=analysis.RootId
JOIN testobservation.TestMeaningClassification classification ON classification.RootId=testCase.RootId AND classification.TestId=testCase.TestId
OUTER APPLY
(
  SELECT CASE WHEN COUNT(DISTINCT c.ScenarioId)=1 THEN MAX(c.FeatureId) END FeatureId,
         CASE WHEN COUNT(DISTINCT c.ScenarioId)=1 THEN MAX(c.ScenarioId) END ScenarioId,
         CASE WHEN COUNT(DISTINCT c.ScenarioId)=1 THEN MAX(c.ResponsibilityId) END ResponsibilityId,
         COUNT(DISTINCT c.ScenarioId) CandidateScenarioCount
  FROM testbinding.TestCaseCandidate c WHERE c.RootId=testCase.RootId AND c.TestId=testCase.TestId
) candidate
LEFT JOIN testauthority.TestMeaningReview review ON review.RootId=testCase.RootId AND review.TestId=testCase.TestId AND review.TestAnalysisDigest=analysis.AnalysisDigest;
GO

CREATE OR ALTER VIEW projection.CurrentTestMeaningCoverage AS
SELECT analysis.RootId,analysis.ApplicationId,analysis.ImageDigest,analysis.AnalysisDigest TestAnalysisDigest,
       analysis.TestCaseCount ObservedTestCount,COUNT(meaning.TestId) MeaningRecommendationCount,
       SUM(CASE WHEN meaning.ReviewDisposition='REVIEW_ADMITTED' THEN 1 ELSE 0 END) ReviewedPostureCount,
       SUM(CASE WHEN meaning.EffectiveProofType='NOISE_OR_UNRESOLVED' THEN 1 ELSE 0 END) UnresolvedTestCount,
       SUM(CASE WHEN meaning.EffectiveProofType IN ('POTENTIAL_CAPABILITY','REGRESSION_EVIDENCE') THEN 1 ELSE 0 END) CandidateMissingIntentCount,
       SUM(CASE WHEN meaning.EffectiveProofType IN ('DUPLICATE_TEST','HISTORICAL_OR_INACTIVE') THEN 1 ELSE 0 END) DuplicateOrInactiveTestCount,
       (SELECT COUNT(*) FROM testauthority.TestVector vector WHERE vector.ContractSnapshotId=analysis.ContractSnapshotId AND vector.LifecycleStatus='TEST_VECTOR_ADMITTED') ActiveCanonicalVectorCount,
       (SELECT COUNT(*) FROM testauthority.TestVector vector JOIN testauthority.TestProjectionProfile profile ON profile.ProjectionProfileId=vector.ProjectionProfileId WHERE vector.ContractSnapshotId=analysis.ContractSnapshotId AND vector.LifecycleStatus='TEST_VECTOR_ADMITTED' AND profile.ProjectionDisposition='TEST_VECTOR_PROJECTABLE') ProjectableCanonicalVectorCount,
       (SELECT COUNT(*) FROM lineage.Scenario scenario JOIN lineage.Feature feature ON feature.ContractSnapshotId=scenario.ContractSnapshotId AND feature.FeatureId=scenario.FeatureId WHERE scenario.ContractSnapshotId=analysis.ContractSnapshotId AND feature.LifecycleStatus='FEATURE_INTENT_ADMITTED' AND feature.AuthorityStatus='FEATURE_LINEAGE_CLOSED') CanonicalScenarioCount,
       (SELECT COUNT(*) FROM testauthority.ScenarioProofPolicy policy WHERE policy.ContractSnapshotId=analysis.ContractSnapshotId AND policy.ExpectedTestVectorCount IS NOT NULL) ScenarioRequirementDeclaredCount,
       COALESCE((SELECT ClosedScenarioCount FROM projection.CurrentRepositoryTestClosure closure WHERE closure.RootId=analysis.RootId),0) ProofClosedScenarioCount,
       CASE WHEN COUNT(meaning.TestId)<>analysis.TestCaseCount THEN 'TEST_MEANING_RECOMMENDATION_INCOMPLETE'
            WHEN SUM(CASE WHEN meaning.ReviewDisposition='REVIEW_ADMITTED' THEN 1 ELSE 0 END)<>analysis.TestCaseCount THEN 'TEST_MEANING_REVIEW_INCOMPLETE'
            ELSE 'CANONICAL_TEST_MEANING_COVERAGE_CLOSED' END TestMeaningCoverageDisposition
FROM testobservation.RepositoryTestAnalysis analysis
LEFT JOIN projection.CurrentTestMeaning meaning ON meaning.RootId=analysis.RootId
GROUP BY analysis.RootId,analysis.ApplicationId,analysis.ImageDigest,analysis.AnalysisDigest,analysis.ContractSnapshotId,analysis.TestCaseCount;
GO

CREATE OR ALTER VIEW projection.CurrentCapabilityBacklog AS
SELECT RootId,ApplicationId,TestAnalysisDigest,TestId,TestFilePath,TestName,RecommendedProofType,Confidence,EvidenceJson,ObservedInvocationsJson,
       CASE WHEN RecommendedProofType='POTENTIAL_CAPABILITY' THEN 'POTENTIAL_CAPABILITY_REVIEW'
            WHEN RecommendedProofType='REGRESSION_EVIDENCE' THEN 'MISSING_CANONICAL_INTENT_REVIEW'
            ELSE 'UNRESOLVED_TEST_MEANING_REVIEW' END BacklogDisposition
FROM projection.CurrentTestMeaning
WHERE ReviewDisposition<>'REVIEW_ADMITTED' AND RecommendedProofType IN ('POTENTIAL_CAPABILITY','REGRESSION_EVIDENCE','NOISE_OR_UNRESOLVED');
GO
