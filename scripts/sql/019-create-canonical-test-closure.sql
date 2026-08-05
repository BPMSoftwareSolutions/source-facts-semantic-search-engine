-- Canonical test authority remains separate from observed test structure.
-- Current observations are replaced atomically from the SQL repository image;
-- no passing test is promoted to canonical proof by this migration or loader.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

IF SCHEMA_ID('testauthority') IS NULL EXEC('CREATE SCHEMA testauthority');
IF SCHEMA_ID('testobservation') IS NULL EXEC('CREATE SCHEMA testobservation');
IF SCHEMA_ID('testbinding') IS NULL EXEC('CREATE SCHEMA testbinding');
IF SCHEMA_ID('testexecution') IS NULL EXEC('CREATE SCHEMA testexecution');
GO

IF OBJECT_ID('testauthority.TestProjectionProfile', 'U') IS NULL
CREATE TABLE testauthority.TestProjectionProfile
(
    ProjectionProfileId nvarchar(160) NOT NULL PRIMARY KEY,
    Framework nvarchar(120) NOT NULL,
    LanguageId nvarchar(80) NOT NULL,
    ProfileVersion nvarchar(40) NOT NULL,
    ProjectionDisposition nvarchar(120) NOT NULL
);
GO
IF NOT EXISTS (SELECT 1 FROM testauthority.TestProjectionProfile WHERE ProjectionProfileId = N'node-test.esm.v1')
INSERT testauthority.TestProjectionProfile VALUES (N'node-test.esm.v1', N'node:test', N'javascript', N'1', N'TEST_PROJECTION_PROFILE_DECLARED');
GO

IF OBJECT_ID('testauthority.TestVector', 'U') IS NULL
CREATE TABLE testauthority.TestVector
(
    ContractSnapshotId varchar(80) NOT NULL,
    TestVectorId nvarchar(200) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    ResponsibilityId nvarchar(160) NOT NULL,
    VerifierKind nvarchar(80) NOT NULL,
    ProjectionProfileId nvarchar(160) NULL,
    LifecycleStatus nvarchar(80) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_TestVector PRIMARY KEY (ContractSnapshotId, TestVectorId),
    CONSTRAINT FK_TestVector_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_TestVector_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_TestVector_Profile FOREIGN KEY (ProjectionProfileId) REFERENCES testauthority.TestProjectionProfile(ProjectionProfileId)
);
GO

IF OBJECT_ID('testauthority.TestExpectation', 'U') IS NULL
CREATE TABLE testauthority.TestExpectation
(
    ContractSnapshotId varchar(80) NOT NULL,
    TestVectorId nvarchar(200) NOT NULL,
    SignalId nvarchar(200) NOT NULL,
    ExpectedDisposition nvarchar(200) NOT NULL,
    ExpectationJson nvarchar(max) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_TestExpectation PRIMARY KEY (ContractSnapshotId, TestVectorId, SignalId),
    CONSTRAINT FK_TestExpectation_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId),
    CONSTRAINT CK_TestExpectation_Json CHECK (ExpectationJson IS NULL OR ISJSON(ExpectationJson) = 1)
);
GO

IF OBJECT_ID('testauthority.ProofRequirement', 'U') IS NULL
CREATE TABLE testauthority.ProofRequirement
(
    ContractSnapshotId varchar(80) NOT NULL,
    TestVectorId nvarchar(200) NOT NULL,
    ProofRequirementId nvarchar(200) NOT NULL,
    RequirementKind nvarchar(80) NOT NULL,
    RequirementStatement nvarchar(max) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_ProofRequirement PRIMARY KEY (ContractSnapshotId, TestVectorId, ProofRequirementId),
    CONSTRAINT FK_ProofRequirement_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId)
);
GO

IF OBJECT_ID('testauthority.ScenarioProofPolicy', 'U') IS NULL
CREATE TABLE testauthority.ScenarioProofPolicy
(
    ContractSnapshotId varchar(80) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    ExpectedTestVectorCount int NULL,
    NegativeControlRequired bit NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_ScenarioProofPolicy PRIMARY KEY (ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_ScenarioProofPolicy_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT CK_ScenarioProofPolicy_Count CHECK (ExpectedTestVectorCount IS NULL OR ExpectedTestVectorCount > 0)
);
GO

IF OBJECT_ID('testobservation.RepositoryTestAnalysis', 'U') IS NULL
CREATE TABLE testobservation.RepositoryTestAnalysis
(
    RootId nvarchar(400) NOT NULL PRIMARY KEY,
    ApplicationId nvarchar(160) NOT NULL,
    ImageDigest varchar(80) NOT NULL,
    ContractSnapshotId varchar(80) NOT NULL,
    AnalysisDigest varchar(80) NOT NULL,
    TestArtifactCount int NOT NULL,
    TestCaseCount int NOT NULL,
    SuiteCount int NOT NULL,
    AssertionCount int NOT NULL,
    FixtureUsageCount int NOT NULL,
    MockUsageCount int NOT NULL,
    InvocationCount int NOT NULL,
    CandidateTestCount int NOT NULL,
    UnboundTestCount int NOT NULL,
    AnalyzedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositoryTestAnalysis_AnalyzedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RepositoryTestAnalysis_Image FOREIGN KEY (RootId) REFERENCES inventory.RepositoryImage(RootId),
    CONSTRAINT FK_RepositoryTestAnalysis_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId)
);
GO

IF OBJECT_ID('testobservation.TestArtifact', 'U') IS NULL
CREATE TABLE testobservation.TestArtifact
(
    RootId nvarchar(400) NOT NULL,
    TestArtifactKey varchar(80) NOT NULL,
    TestFilePath nvarchar(1024) NOT NULL,
    ContentDigest varchar(80) NOT NULL,
    TestCaseCount int NOT NULL,
    AnalysisDisposition nvarchar(120) NOT NULL,
    CONSTRAINT PK_CurrentTestArtifact PRIMARY KEY (RootId, TestArtifactKey),
    CONSTRAINT FK_CurrentTestArtifact_Analysis FOREIGN KEY (RootId) REFERENCES testobservation.RepositoryTestAnalysis(RootId)
);
GO

IF OBJECT_ID('testobservation.TestSuite', 'U') IS NULL
CREATE TABLE testobservation.TestSuite
(
    RootId nvarchar(400) NOT NULL,
    SuiteId varchar(80) NOT NULL,
    TestFilePath nvarchar(1024) NOT NULL,
    ParentSuiteId varchar(80) NULL,
    SuiteName nvarchar(max) NOT NULL,
    StartLine int NOT NULL,
    CONSTRAINT PK_CurrentTestSuite PRIMARY KEY (RootId, SuiteId),
    CONSTRAINT FK_CurrentTestSuite_Analysis FOREIGN KEY (RootId) REFERENCES testobservation.RepositoryTestAnalysis(RootId)
);
GO

IF OBJECT_ID('testobservation.TestCase', 'U') IS NULL
CREATE TABLE testobservation.TestCase
(
    RootId nvarchar(400) NOT NULL,
    TestId varchar(80) NOT NULL,
    TestFilePath nvarchar(1024) NOT NULL,
    SuiteId varchar(80) NULL,
    SuitePathJson nvarchar(max) NOT NULL,
    TestName nvarchar(max) NOT NULL,
    Framework nvarchar(120) NOT NULL,
    StartLine int NOT NULL,
    ExecutionStatus nvarchar(80) NOT NULL,
    CurrentPosture nvarchar(100) NOT NULL,
    CanonicalBindingDisposition nvarchar(100) NOT NULL,
    CandidateBindingDisposition nvarchar(100) NOT NULL,
    CONSTRAINT PK_CurrentTestCase PRIMARY KEY (RootId, TestId),
    CONSTRAINT FK_CurrentTestCase_Analysis FOREIGN KEY (RootId) REFERENCES testobservation.RepositoryTestAnalysis(RootId),
    CONSTRAINT FK_CurrentTestCase_Suite FOREIGN KEY (RootId, SuiteId) REFERENCES testobservation.TestSuite(RootId, SuiteId),
    CONSTRAINT CK_CurrentTestCase_SuitePath CHECK (ISJSON(SuitePathJson) = 1),
    CONSTRAINT CK_CurrentTestCase_Posture CHECK (CurrentPosture IN ('CANONICAL_SCENARIO_PROOF','CANONICAL_RESPONSIBILITY_PROOF','KERNEL_CONFORMANCE_PROOF','ADAPTER_MECHANICS_PROOF','PROJECTION_EQUIVALENCE_PROOF','MUTATION_NEGATIVE_CONTROL','REGRESSION_CANDIDATE','DUPLICATE_PROOF','UNBOUND_TEST','OBSOLETE_TEST','EXPERIMENTAL_OR_POTENTIAL_KNOW_HOW'))
);
GO

IF OBJECT_ID('testobservation.Assertion', 'U') IS NULL
CREATE TABLE testobservation.Assertion
(
    RootId nvarchar(400) NOT NULL, AssertionId varchar(80) NOT NULL, TestId varchar(80) NOT NULL,
    AssertionKind nvarchar(200) NOT NULL, StartLine int NOT NULL, ExpressionText nvarchar(max) NOT NULL,
    CONSTRAINT PK_CurrentAssertion PRIMARY KEY (RootId, AssertionId),
    CONSTRAINT FK_CurrentAssertion_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId)
);
GO
IF OBJECT_ID('testobservation.FixtureUsage', 'U') IS NULL
CREATE TABLE testobservation.FixtureUsage
(
    RootId nvarchar(400) NOT NULL, FixtureUsageId varchar(80) NOT NULL, TestId varchar(80) NOT NULL,
    FixtureKind nvarchar(200) NOT NULL, StartLine int NOT NULL,
    CONSTRAINT PK_CurrentFixtureUsage PRIMARY KEY (RootId, FixtureUsageId),
    CONSTRAINT FK_CurrentFixtureUsage_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId)
);
GO
IF OBJECT_ID('testobservation.MockUsage', 'U') IS NULL
CREATE TABLE testobservation.MockUsage
(
    RootId nvarchar(400) NOT NULL, MockUsageId varchar(80) NOT NULL, TestId varchar(80) NOT NULL,
    MockKind nvarchar(200) NOT NULL, StartLine int NOT NULL,
    CONSTRAINT PK_CurrentMockUsage PRIMARY KEY (RootId, MockUsageId),
    CONSTRAINT FK_CurrentMockUsage_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId)
);
GO
IF OBJECT_ID('testobservation.TestInvocation', 'U') IS NULL
CREATE TABLE testobservation.TestInvocation
(
    RootId nvarchar(400) NOT NULL, InvocationId varchar(80) NOT NULL, TestId varchar(80) NOT NULL,
    InvocationName nvarchar(300) NOT NULL, StartLine int NOT NULL, ImportedModulePath nvarchar(1024) NULL, ImportedSymbolName nvarchar(300) NULL,
    CONSTRAINT PK_CurrentTestInvocation PRIMARY KEY (RootId, InvocationId),
    CONSTRAINT FK_CurrentTestInvocation_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId)
);
GO

IF OBJECT_ID('testbinding.TestCaseCandidate', 'U') IS NULL
CREATE TABLE testbinding.TestCaseCandidate
(
    RootId nvarchar(400) NOT NULL, CandidateId varchar(80) NOT NULL, TestId varchar(80) NOT NULL,
    ContractSnapshotId varchar(80) NOT NULL, FeatureId nvarchar(160) NOT NULL, ScenarioId nvarchar(160) NOT NULL,
    ObligationId nvarchar(160) NOT NULL, ResponsibilityId nvarchar(160) NOT NULL,
    DistinctScenarioCount int NOT NULL, BindingDisposition nvarchar(100) NOT NULL,
    CONSTRAINT PK_TestCaseCandidate PRIMARY KEY (RootId, CandidateId),
    CONSTRAINT FK_TestCaseCandidate_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId),
    CONSTRAINT FK_TestCaseCandidate_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_TestCaseCandidate_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT CK_TestCaseCandidate_Disposition CHECK (BindingDisposition IN ('CANDIDATE_NOT_ADMITTED','TEST_NOT_ATOMIC'))
);
GO

IF OBJECT_ID('testbinding.ScenarioTestVector', 'U') IS NULL
CREATE TABLE testbinding.ScenarioTestVector
(
    ContractSnapshotId varchar(80) NOT NULL, ScenarioId nvarchar(160) NOT NULL, TestVectorId nvarchar(200) NOT NULL,
    BindingDisposition nvarchar(100) NOT NULL,
    CONSTRAINT PK_ScenarioTestVector PRIMARY KEY (ContractSnapshotId, ScenarioId, TestVectorId),
    CONSTRAINT FK_ScenarioTestVector_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_ScenarioTestVector_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId)
);
GO
IF OBJECT_ID('testbinding.ResponsibilityTestVector', 'U') IS NULL
CREATE TABLE testbinding.ResponsibilityTestVector
(
    ContractSnapshotId varchar(80) NOT NULL, ResponsibilityId nvarchar(160) NOT NULL, TestVectorId nvarchar(200) NOT NULL,
    BindingDisposition nvarchar(100) NOT NULL,
    CONSTRAINT PK_ResponsibilityTestVector PRIMARY KEY (ContractSnapshotId, ResponsibilityId, TestVectorId),
    CONSTRAINT FK_ResponsibilityTestVector_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_ResponsibilityTestVector_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId)
);
GO
IF OBJECT_ID('testbinding.TestVectorArtifact', 'U') IS NULL
CREATE TABLE testbinding.TestVectorArtifact
(
    TestVectorArtifactId varchar(80) NOT NULL, ContractSnapshotId varchar(80) NOT NULL, TestVectorId nvarchar(200) NOT NULL, RootId nvarchar(400) NOT NULL, TestId varchar(80) NOT NULL,
    BindingDisposition nvarchar(100) NOT NULL,
    CONSTRAINT PK_TestVectorArtifact PRIMARY KEY (TestVectorArtifactId),
    CONSTRAINT FK_TestVectorArtifact_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId),
    CONSTRAINT FK_TestVectorArtifact_Test FOREIGN KEY (RootId, TestId) REFERENCES testobservation.TestCase(RootId, TestId)
);
GO

IF OBJECT_ID('testexecution.TestRun', 'U') IS NULL
CREATE TABLE testexecution.TestRun
(
    TestRunId varchar(80) NOT NULL PRIMARY KEY, RootId nvarchar(400) NOT NULL, TestClosureSealDigest varchar(80) NOT NULL,
    TestCommand nvarchar(1000) NOT NULL, StartedAtUtc datetime2(7) NOT NULL, CompletedAtUtc datetime2(7) NULL,
    ExecutionDisposition nvarchar(120) NOT NULL, TotalCount int NULL, PassedCount int NULL, FailedCount int NULL
);
GO

IF OBJECT_ID('testexecution.RepositoryTestClosureSeal', 'U') IS NULL
CREATE TABLE testexecution.RepositoryTestClosureSeal
(
    RootId nvarchar(400) NOT NULL PRIMARY KEY,
    RepositoryLineageSealDigest varchar(80) NOT NULL,
    TestAnalysisDigest varchar(80) NOT NULL,
    ContractSnapshotId varchar(80) NOT NULL,
    SealAlgorithm varchar(40) NOT NULL,
    TestClosureSealDigest varchar(80) NOT NULL,
    SigningDisposition varchar(80) NOT NULL,
    RefreshedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_RepositoryTestClosureSeal_RefreshedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RepositoryTestClosureSeal_RepositorySeal FOREIGN KEY (RootId) REFERENCES projection.RepositoryLineageSeal(RootId),
    CONSTRAINT FK_RepositoryTestClosureSeal_TestAnalysis FOREIGN KEY (RootId) REFERENCES testobservation.RepositoryTestAnalysis(RootId),
    CONSTRAINT FK_RepositoryTestClosureSeal_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId),
    CONSTRAINT CK_RepositoryTestClosureSeal_Algorithm CHECK (SealAlgorithm='SHA2_256'),
    CONSTRAINT CK_RepositoryTestClosureSeal_Signing CHECK (SigningDisposition='DIGEST_SEALED_NOT_SIGNED')
);
GO
IF OBJECT_ID('testexecution.TestCaseResult', 'U') IS NULL
CREATE TABLE testexecution.TestCaseResult
(
    TestRunId varchar(80) NOT NULL, TestVectorId nvarchar(200) NOT NULL, TestId varchar(80) NULL,
    ObservedSignalJson nvarchar(max) NULL, ResultDisposition nvarchar(120) NOT NULL,
    CONSTRAINT PK_TestCaseResult PRIMARY KEY (TestRunId, TestVectorId),
    CONSTRAINT FK_TestCaseResult_Run FOREIGN KEY (TestRunId) REFERENCES testexecution.TestRun(TestRunId),
    CONSTRAINT CK_TestCaseResult_Signal CHECK (ObservedSignalJson IS NULL OR ISJSON(ObservedSignalJson) = 1)
);
GO
IF OBJECT_ID('testexecution.CoverageObservation', 'U') IS NULL
CREATE TABLE testexecution.CoverageObservation
(
    CoverageObservationId varchar(80) NOT NULL, TestRunId varchar(80) NOT NULL, CoverageSubjectType nvarchar(80) NOT NULL, CoverageSubjectId nvarchar(400) NOT NULL,
    CoverageKind nvarchar(80) NOT NULL, CoveredCount int NOT NULL, TotalCount int NOT NULL,
    CONSTRAINT PK_CoverageObservation PRIMARY KEY (CoverageObservationId),
    CONSTRAINT FK_CoverageObservation_Run FOREIGN KEY (TestRunId) REFERENCES testexecution.TestRun(TestRunId)
);
GO
IF OBJECT_ID('testexecution.ProofDisposition', 'U') IS NULL
CREATE TABLE testexecution.ProofDisposition
(
    TestRunId varchar(80) NOT NULL, ContractSnapshotId varchar(80) NOT NULL, ScenarioId nvarchar(160) NOT NULL,
    TestVectorId nvarchar(200) NOT NULL, ProofDisposition nvarchar(160) NOT NULL,
    CONSTRAINT PK_CurrentProofDisposition PRIMARY KEY (TestRunId, ContractSnapshotId, ScenarioId, TestVectorId),
    CONSTRAINT FK_CurrentProofDisposition_Run FOREIGN KEY (TestRunId) REFERENCES testexecution.TestRun(TestRunId),
    CONSTRAINT FK_CurrentProofDisposition_Vector FOREIGN KEY (ContractSnapshotId, TestVectorId) REFERENCES testauthority.TestVector(ContractSnapshotId, TestVectorId)
);
GO

CREATE OR ALTER PROCEDURE ingestion.LoadRepositoryTestKnowledge @PayloadJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF ISJSON(@PayloadJson) <> 1 THROW 51050, 'Repository test knowledge payload must be JSON.', 1;
    DECLARE @RootId nvarchar(400) = JSON_VALUE(@PayloadJson, '$.rootId');
    DECLARE @ApplicationId nvarchar(160) = JSON_VALUE(@PayloadJson, '$.applicationId');
    DECLARE @ImageDigest varchar(80) = JSON_VALUE(@PayloadJson, '$.imageDigest');
    DECLARE @ContractSnapshotId varchar(80) = JSON_VALUE(@PayloadJson, '$.contractSnapshotId');
    DECLARE @AnalysisDigest varchar(80) = JSON_VALUE(@PayloadJson, '$.analysisDigest');
    IF JSON_VALUE(@PayloadJson, '$.analysisType') <> 'repository-test-knowledge.v1' THROW 51051, 'Unexpected repository test knowledge type.', 1;
    IF NOT EXISTS (SELECT 1 FROM inventory.RepositoryImage WHERE RootId=@RootId AND ImageDigest=@ImageDigest) THROW 51052, 'Repository test knowledge does not match the current image.', 1;
    IF NOT EXISTS (SELECT 1 FROM authority.ContractSnapshot WHERE ContractSnapshotId=@ContractSnapshotId AND ProjectId=@RootId AND ApplicationId=@ApplicationId) THROW 51053, 'Repository test knowledge does not match loaded canonical intent authority.', 1;
    BEGIN TRANSACTION;
      DELETE FROM testexecution.RepositoryTestClosureSeal WHERE RootId=@RootId;
      DELETE FROM testbinding.TestVectorArtifact WHERE RootId=@RootId;
      DELETE FROM testbinding.TestCaseCandidate WHERE RootId=@RootId;
      DELETE FROM testobservation.Assertion WHERE RootId=@RootId;
      DELETE FROM testobservation.FixtureUsage WHERE RootId=@RootId;
      DELETE FROM testobservation.MockUsage WHERE RootId=@RootId;
      DELETE FROM testobservation.TestInvocation WHERE RootId=@RootId;
      DELETE FROM testobservation.TestCase WHERE RootId=@RootId;
      DELETE FROM testobservation.TestSuite WHERE RootId=@RootId;
      DELETE FROM testobservation.TestArtifact WHERE RootId=@RootId;
      DELETE FROM testobservation.RepositoryTestAnalysis WHERE RootId=@RootId;

      INSERT testobservation.RepositoryTestAnalysis
        (RootId,ApplicationId,ImageDigest,ContractSnapshotId,AnalysisDigest,TestArtifactCount,TestCaseCount,SuiteCount,AssertionCount,FixtureUsageCount,MockUsageCount,InvocationCount,CandidateTestCount,UnboundTestCount)
      SELECT @RootId,@ApplicationId,@ImageDigest,@ContractSnapshotId,@AnalysisDigest,
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.testArtifacts')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.testCases')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.suites')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.assertions')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.fixtureUsages')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.mockUsages')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.invocations')),TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.candidateTests')),
        TRY_CONVERT(int,JSON_VALUE(@PayloadJson,'$.summary.unboundTests'));
      INSERT testobservation.TestArtifact SELECT @RootId,JSON_VALUE(value,'$.testArtifactKey'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.contentDigest'),TRY_CONVERT(int,JSON_VALUE(value,'$.testCaseCount')),JSON_VALUE(value,'$.analysisDisposition') FROM OPENJSON(@PayloadJson,'$.artifacts');
      INSERT testobservation.TestSuite SELECT @RootId,JSON_VALUE(value,'$.suiteId'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.parentSuiteId'),JSON_VALUE(value,'$.suiteName'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.suites');
      INSERT testobservation.TestCase SELECT @RootId,JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.testFilePath'),JSON_VALUE(value,'$.suiteId'),JSON_QUERY(value,'$.suitePath'),JSON_VALUE(value,'$.testName'),JSON_VALUE(value,'$.framework'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.executionStatus'),JSON_VALUE(value,'$.currentPosture'),JSON_VALUE(value,'$.canonicalBindingDisposition'),JSON_VALUE(value,'$.candidateBindingDisposition') FROM OPENJSON(@PayloadJson,'$.testCases');
      INSERT testobservation.Assertion SELECT @RootId,JSON_VALUE(value,'$.assertionId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.assertionKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.expressionText') FROM OPENJSON(@PayloadJson,'$.assertions');
      INSERT testobservation.FixtureUsage SELECT @RootId,JSON_VALUE(value,'$.fixtureUsageId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.fixtureKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.fixtureUsages');
      INSERT testobservation.MockUsage SELECT @RootId,JSON_VALUE(value,'$.mockUsageId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.mockKind'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')) FROM OPENJSON(@PayloadJson,'$.mockUsages');
      INSERT testobservation.TestInvocation SELECT @RootId,JSON_VALUE(value,'$.invocationId'),JSON_VALUE(value,'$.testId'),JSON_VALUE(value,'$.invocationName'),TRY_CONVERT(int,JSON_VALUE(value,'$.startLine')),JSON_VALUE(value,'$.importedModulePath'),JSON_VALUE(value,'$.importedSymbolName') FROM OPENJSON(@PayloadJson,'$.invocations');
      INSERT testbinding.TestCaseCandidate SELECT @RootId,JSON_VALUE(value,'$.candidateId'),JSON_VALUE(value,'$.testId'),@ContractSnapshotId,JSON_VALUE(value,'$.featureId'),JSON_VALUE(value,'$.scenarioId'),JSON_VALUE(value,'$.obligationId'),JSON_VALUE(value,'$.responsibilityId'),TRY_CONVERT(int,JSON_VALUE(value,'$.distinctScenarioCount')),JSON_VALUE(value,'$.bindingDisposition') FROM OPENJSON(@PayloadJson,'$.candidates');
    COMMIT;
    SELECT CONCAT('R|',@AnalysisDigest,'|',JSON_VALUE(@PayloadJson,'$.summary.testArtifacts'),'|',JSON_VALUE(@PayloadJson,'$.summary.testCases'),'|',JSON_VALUE(@PayloadJson,'$.summary.assertions'),'|',JSON_VALUE(@PayloadJson,'$.summary.candidateTests'),'|',JSON_VALUE(@PayloadJson,'$.summary.unboundTests'),'|TEST_KNOWLEDGE_ADMITTED_AS_OBSERVATION') ResultLine;
END;
GO

CREATE OR ALTER PROCEDURE projection.RefreshRepositoryTestClosureSeal @RootId nvarchar(400)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    DECLARE @RepositorySealDigest varchar(80),@TestAnalysisDigest varchar(80),@ContractSnapshotId varchar(80);
    SELECT @RepositorySealDigest=SealDigest,@ContractSnapshotId=CanonicalIntentContractSnapshotId FROM projection.RepositoryLineageSeal WHERE RootId=@RootId;
    SELECT @TestAnalysisDigest=AnalysisDigest FROM testobservation.RepositoryTestAnalysis WHERE RootId=@RootId AND ContractSnapshotId=@ContractSnapshotId;
    IF @RepositorySealDigest IS NULL THROW 51054, 'Current repository lineage seal is required before test closure sealing.', 1;
    IF @TestAnalysisDigest IS NULL THROW 51055, 'Current matching test analysis is required before test closure sealing.', 1;
    DECLARE @Material varchar(max)=CONCAT('repository-test-closure-seal.v1|',@RootId,'|',@RepositorySealDigest,'|',@TestAnalysisDigest,'|',@ContractSnapshotId);
    DECLARE @SealDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',@Material),2)));
    MERGE testexecution.RepositoryTestClosureSeal target USING (SELECT @RootId RootId) source ON source.RootId=target.RootId
    WHEN MATCHED THEN UPDATE SET RepositoryLineageSealDigest=@RepositorySealDigest,TestAnalysisDigest=@TestAnalysisDigest,ContractSnapshotId=@ContractSnapshotId,SealAlgorithm='SHA2_256',TestClosureSealDigest=@SealDigest,SigningDisposition='DIGEST_SEALED_NOT_SIGNED',RefreshedAtUtc=SYSUTCDATETIME()
    WHEN NOT MATCHED THEN INSERT (RootId,RepositoryLineageSealDigest,TestAnalysisDigest,ContractSnapshotId,SealAlgorithm,TestClosureSealDigest,SigningDisposition) VALUES (@RootId,@RepositorySealDigest,@TestAnalysisDigest,@ContractSnapshotId,'SHA2_256',@SealDigest,'DIGEST_SEALED_NOT_SIGNED');
    SELECT CONCAT('S|',@SealDigest,'|TEST_CLOSURE_SEALED_IN_SQL') ResultLine;
END;
GO

CREATE OR ALTER VIEW projection.CurrentScenarioTestClosure AS
SELECT seal.RootId, seal.ApplicationId, seal.SealDigest AS CurrentRepositorySealDigest,
       scenario.FeatureId, scenario.ScenarioId, obligation.ObligationId, responsibility.ResponsibilityId,
       feature.LifecycleStatus AS FeatureLifecycleStatus, feature.AuthorityStatus AS FeatureAuthorityStatus,
       policy.ExpectedTestVectorCount,
       (SELECT COUNT(*) FROM testauthority.TestVector vector WHERE vector.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId AND vector.ScenarioId=scenario.ScenarioId AND vector.LifecycleStatus='TEST_VECTOR_ADMITTED') CanonicalTestVectorCount,
       (SELECT COUNT(DISTINCT candidate.TestId) FROM testbinding.TestCaseCandidate candidate WHERE candidate.RootId=seal.RootId AND candidate.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId AND candidate.ScenarioId=scenario.ScenarioId) CandidateTestCount,
       CASE
         WHEN feature.LifecycleStatus <> 'FEATURE_INTENT_ADMITTED' OR feature.AuthorityStatus <> 'FEATURE_LINEAGE_CLOSED' THEN 'SCENARIO_AUTHORITY_NOT_ADMITTED'
         WHEN NOT EXISTS (SELECT 1 FROM testauthority.TestVector vector WHERE vector.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId AND vector.ScenarioId=scenario.ScenarioId AND vector.LifecycleStatus='TEST_VECTOR_ADMITTED') THEN 'SCENARIO_PROOF_MISSING'
         WHEN EXISTS (SELECT 1 FROM testauthority.TestVector vector LEFT JOIN testauthority.TestProjectionProfile profile ON profile.ProjectionProfileId=vector.ProjectionProfileId WHERE vector.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId AND vector.ScenarioId=scenario.ScenarioId AND (profile.ProjectionDisposition IS NULL OR profile.ProjectionDisposition<>'TEST_VECTOR_PROJECTABLE')) THEN 'TEST_VECTOR_NOT_PROJECTABLE'
         WHEN NOT EXISTS (SELECT 1 FROM testexecution.ProofDisposition proof JOIN testexecution.TestRun run ON run.TestRunId=proof.TestRunId WHERE proof.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId AND proof.ScenarioId=scenario.ScenarioId AND run.TestClosureSealDigest=(SELECT currentTestSeal.TestClosureSealDigest FROM testexecution.RepositoryTestClosureSeal currentTestSeal WHERE currentTestSeal.RootId=seal.RootId) AND proof.ProofDisposition='SCENARIO_PROOF_PASSED') THEN 'SCENARIO_PROOF_NOT_EXECUTED_CURRENT_LINEAGE'
         ELSE 'SCENARIO_PROOF_CLOSED' END ProofCoverageDisposition
FROM projection.RepositoryLineageSeal seal
JOIN lineage.Feature feature ON feature.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId
JOIN lineage.Scenario scenario ON scenario.ContractSnapshotId=feature.ContractSnapshotId AND scenario.FeatureId=feature.FeatureId
JOIN lineage.Obligation obligation ON obligation.ContractSnapshotId=scenario.ContractSnapshotId AND obligation.ScenarioId=scenario.ScenarioId
JOIN lineage.Responsibility responsibility ON responsibility.ContractSnapshotId=obligation.ContractSnapshotId AND responsibility.ObligationId=obligation.ObligationId
LEFT JOIN testauthority.ScenarioProofPolicy policy ON policy.ContractSnapshotId=scenario.ContractSnapshotId AND policy.ScenarioId=scenario.ScenarioId;
GO

CREATE OR ALTER VIEW projection.CurrentFeatureTestClosure AS
SELECT RootId,ApplicationId,FeatureId,FeatureLifecycleStatus,FeatureAuthorityStatus,COUNT(*) ScenarioCount,
       SUM(CASE WHEN ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END) ClosedScenarioCount,
       CASE WHEN SUM(CASE WHEN ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END)=COUNT(*) THEN 'FEATURE_PROOF_CLOSED' ELSE 'FEATURE_PROOF_INCOMPLETE' END FeatureProofDisposition
FROM projection.CurrentScenarioTestClosure GROUP BY RootId,ApplicationId,FeatureId,FeatureLifecycleStatus,FeatureAuthorityStatus;
GO

CREATE OR ALTER VIEW projection.CurrentRepositoryTestClosure AS
SELECT seal.RootId,seal.ApplicationId,seal.SealDigest CurrentRepositorySealDigest,testSeal.TestClosureSealDigest,analysis.AnalysisDigest TestAnalysisDigest,
       analysis.TestArtifactCount,analysis.TestCaseCount,analysis.AssertionCount,analysis.CandidateTestCount,analysis.UnboundTestCount,
       SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END) AdmittedScenarioCount,
       SUM(CASE WHEN scenario.ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END) ClosedScenarioCount,
       CASE WHEN analysis.RootId IS NULL THEN 'REPOSITORY_TEST_OBSERVATION_MISSING'
            WHEN analysis.ImageDigest<>seal.RepositoryImageDigest OR analysis.ContractSnapshotId<>seal.CanonicalIntentContractSnapshotId THEN 'REPOSITORY_TEST_OBSERVATION_STALE'
            WHEN testSeal.RootId IS NULL OR testSeal.RepositoryLineageSealDigest<>seal.SealDigest OR testSeal.TestAnalysisDigest<>analysis.AnalysisDigest THEN 'REPOSITORY_TEST_CLOSURE_SEAL_STALE'
            WHEN testSeal.TestClosureSealDigest<>CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),CONCAT('repository-test-closure-seal.v1|',seal.RootId,'|',seal.SealDigest,'|',analysis.AnalysisDigest,'|',seal.CanonicalIntentContractSnapshotId))),2))) THEN 'REPOSITORY_TEST_CLOSURE_SEAL_INVALID'
            WHEN SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END)=0 THEN 'REPOSITORY_SCENARIO_AUTHORITY_INCOMPLETE'
            WHEN SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END)<>SUM(CASE WHEN scenario.ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END) THEN 'REPOSITORY_SCENARIO_PROOF_INCOMPLETE'
            ELSE 'REPOSITORY_TEST_PROOF_CLOSED' END RepositoryTestDisposition
FROM projection.RepositoryLineageSeal seal
LEFT JOIN testobservation.RepositoryTestAnalysis analysis ON analysis.RootId=seal.RootId
LEFT JOIN testexecution.RepositoryTestClosureSeal testSeal ON testSeal.RootId=seal.RootId
LEFT JOIN projection.CurrentScenarioTestClosure scenario ON scenario.RootId=seal.RootId
GROUP BY seal.RootId,seal.ApplicationId,seal.SealDigest,seal.RepositoryImageDigest,seal.CanonicalIntentContractSnapshotId,testSeal.RootId,testSeal.RepositoryLineageSealDigest,testSeal.TestAnalysisDigest,testSeal.TestClosureSealDigest,analysis.RootId,analysis.ImageDigest,analysis.ContractSnapshotId,analysis.AnalysisDigest,analysis.TestArtifactCount,analysis.TestCaseCount,analysis.AssertionCount,analysis.CandidateTestCount,analysis.UnboundTestCount;
GO
