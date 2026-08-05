-- First reviewed vertical slice: one admitted scenario, independently projected
-- through Vitest, with expectations kept outside the executable test path.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

IF COL_LENGTH('testauthority.TestProjectionProfile','ProfileDigest') IS NULL
    ALTER TABLE testauthority.TestProjectionProfile ADD ProfileDigest varchar(80) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM testauthority.TestProjectionProfile WHERE ProjectionProfileId=N'vitest.v1')
INSERT testauthority.TestProjectionProfile (ProjectionProfileId,Framework,LanguageId,ProfileVersion,ProjectionDisposition,ProfileDigest)
VALUES (N'vitest.v1',N'vitest',N'javascript',N'1',N'TEST_VECTOR_PROJECTABLE',CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256','vitest.v1|vitest|javascript|1|TEST_VECTOR_PROJECTABLE'),2))));
ELSE UPDATE testauthority.TestProjectionProfile SET Framework=N'vitest',LanguageId=N'javascript',ProfileVersion=N'1',ProjectionDisposition=N'TEST_VECTOR_PROJECTABLE',ProfileDigest=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256','vitest.v1|vitest|javascript|1|TEST_VECTOR_PROJECTABLE'),2))) WHERE ProjectionProfileId=N'vitest.v1';
GO

IF OBJECT_ID('testauthority.TestFixture','U') IS NULL
CREATE TABLE testauthority.TestFixture
(
    ContractSnapshotId varchar(80) NOT NULL, FixtureAuthorityId nvarchar(200) NOT NULL,
    FixtureJson nvarchar(max) NOT NULL, AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_TestFixture PRIMARY KEY (ContractSnapshotId,FixtureAuthorityId),
    CONSTRAINT FK_TestFixture_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId),
    CONSTRAINT CK_TestFixture_Json CHECK (ISJSON(FixtureJson)=1)
);
GO

IF OBJECT_ID('testauthority.TestExecutionAuthority','U') IS NULL
CREATE TABLE testauthority.TestExecutionAuthority
(
    ContractSnapshotId varchar(80) NOT NULL, ExecutionAuthorityId nvarchar(200) NOT NULL,
    ModulePath nvarchar(1024) NOT NULL, ExportName nvarchar(300) NOT NULL, InvocationKind nvarchar(100) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_TestExecutionAuthority PRIMARY KEY (ContractSnapshotId,ExecutionAuthorityId),
    CONSTRAINT FK_TestExecutionAuthority_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId)
);
GO

IF OBJECT_ID('testauthority.TestAuthoritySnapshot','U') IS NULL
CREATE TABLE testauthority.TestAuthoritySnapshot
(
    ContractSnapshotId varchar(80) NOT NULL PRIMARY KEY, AuthorityDigest varchar(80) NOT NULL,
    AdmittedVectorCount int NOT NULL, RefreshedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_TestAuthoritySnapshot_RefreshedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_TestAuthoritySnapshot_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId)
);
GO

IF COL_LENGTH('testauthority.TestVector','FixtureAuthorityId') IS NULL ALTER TABLE testauthority.TestVector ADD FixtureAuthorityId nvarchar(200) NULL;
IF COL_LENGTH('testauthority.TestVector','ExecutionAuthorityId') IS NULL ALTER TABLE testauthority.TestVector ADD ExecutionAuthorityId nvarchar(200) NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TestVector_Fixture')
ALTER TABLE testauthority.TestVector ADD CONSTRAINT FK_TestVector_Fixture FOREIGN KEY (ContractSnapshotId,FixtureAuthorityId) REFERENCES testauthority.TestFixture(ContractSnapshotId,FixtureAuthorityId);
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_TestVector_Execution')
ALTER TABLE testauthority.TestVector ADD CONSTRAINT FK_TestVector_Execution FOREIGN KEY (ContractSnapshotId,ExecutionAuthorityId) REFERENCES testauthority.TestExecutionAuthority(ContractSnapshotId,ExecutionAuthorityId);
GO

DECLARE @ContractSnapshotId varchar(80)=
(
    SELECT TOP (1) ContractSnapshotId FROM authority.ContractSnapshot
    WHERE ContractId=N'canonical-feature-intent-registry.v1' AND ProjectId=N'source-facts-semantic-search-engine'
      AND ApplicationId=N'source-facts-semantic-search-engine' AND RepositoryId=N'source-facts-semantic-search-engine'
    ORDER BY LoadedAtUtc DESC,ContractSnapshotId DESC
);
IF @ContractSnapshotId IS NULL THROW 51060,'Current canonical intent registry is required.',1;
IF NOT EXISTS (SELECT 1 FROM lineage.Scenario WHERE ContractSnapshotId=@ContractSnapshotId AND ScenarioId=N'source-facts.classify-mechanic-authority-family') THROW 51061,'Reference scenario is not present in current authority.',1;

DECLARE @FixtureId nvarchar(200)=N'mechanic-authority-family-reference-fixture.v1';
DECLARE @FixtureJson nvarchar(max)=N'{"inputs":["branch","object-construction","state-mutation","not-a-real-mechanic"]}';
DECLARE @FixtureDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),CONCAT(@FixtureId,'|',@FixtureJson))),2)));
DECLARE @ExecutionId nvarchar(200)=N'resolve-authority-family-execution.v1';
DECLARE @ExecutionDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256','resolve-authority-family-execution.v1|src/governance/mechanic-authority-families.js|resolvesAuthorityFamily|map-single-argument'),2)));
DECLARE @VectorId nvarchar(200)=N'classify-mechanic-authority-family.v1';
DECLARE @VectorDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),CONCAT(@VectorId,'|source-facts.classify-mechanic-authority-family|classifies-execution-mechanic-authority-family|runtime-test|vitest.v1|',@FixtureId,'|',@ExecutionId))),2)));
DECLARE @SignalId nvarchar(200)=N'mechanic-authority-family-classification';
DECLARE @ExpectationJson nvarchar(max)=N'{"signalId":"mechanic-authority-family-classification","values":[{"input":"branch","output":"decision-authority"},{"input":"object-construction","output":"projection-authority"},{"input":"state-mutation","output":"state-transition-authority"},{"input":"not-a-real-mechanic","output":null}]}';
DECLARE @ExpectationDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),CONCAT(@SignalId,'|MECHANIC_AUTHORITY_FAMILY_CLASSIFIED|',@ExpectationJson))),2)));

MERGE testauthority.TestFixture target USING (SELECT @ContractSnapshotId ContractSnapshotId,@FixtureId FixtureAuthorityId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.FixtureAuthorityId=target.FixtureAuthorityId
WHEN MATCHED THEN UPDATE SET FixtureJson=@FixtureJson,AuthorityDigest=@FixtureDigest
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,@FixtureId,@FixtureJson,@FixtureDigest);
MERGE testauthority.TestExecutionAuthority target USING (SELECT @ContractSnapshotId ContractSnapshotId,@ExecutionId ExecutionAuthorityId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.ExecutionAuthorityId=target.ExecutionAuthorityId
WHEN MATCHED THEN UPDATE SET ModulePath=N'src/governance/mechanic-authority-families.js',ExportName=N'resolvesAuthorityFamily',InvocationKind=N'map-single-argument',AuthorityDigest=@ExecutionDigest
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,@ExecutionId,N'src/governance/mechanic-authority-families.js',N'resolvesAuthorityFamily',N'map-single-argument',@ExecutionDigest);
MERGE testauthority.TestVector target USING (SELECT @ContractSnapshotId ContractSnapshotId,@VectorId TestVectorId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.TestVectorId=target.TestVectorId
WHEN MATCHED THEN UPDATE SET ScenarioId=N'source-facts.classify-mechanic-authority-family',ResponsibilityId=N'classifies-execution-mechanic-authority-family',VerifierKind=N'runtime-test',ProjectionProfileId=N'vitest.v1',LifecycleStatus=N'TEST_VECTOR_ADMITTED',AuthorityDigest=@VectorDigest,FixtureAuthorityId=@FixtureId,ExecutionAuthorityId=@ExecutionId
WHEN NOT MATCHED THEN INSERT (ContractSnapshotId,TestVectorId,ScenarioId,ResponsibilityId,VerifierKind,ProjectionProfileId,LifecycleStatus,AuthorityDigest,FixtureAuthorityId,ExecutionAuthorityId) VALUES (@ContractSnapshotId,@VectorId,N'source-facts.classify-mechanic-authority-family',N'classifies-execution-mechanic-authority-family',N'runtime-test',N'vitest.v1',N'TEST_VECTOR_ADMITTED',@VectorDigest,@FixtureId,@ExecutionId);
MERGE testauthority.TestExpectation target USING (SELECT @ContractSnapshotId ContractSnapshotId,@VectorId TestVectorId,@SignalId SignalId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.TestVectorId=target.TestVectorId AND source.SignalId=target.SignalId
WHEN MATCHED THEN UPDATE SET ExpectedDisposition=N'MECHANIC_AUTHORITY_FAMILY_CLASSIFIED',ExpectationJson=@ExpectationJson,AuthorityDigest=@ExpectationDigest
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,@VectorId,@SignalId,N'MECHANIC_AUTHORITY_FAMILY_CLASSIFIED',@ExpectationJson,@ExpectationDigest);

DECLARE @Requirement1 nvarchar(200)=N'each-fixture-input-produces-one-observed-value';
DECLARE @Requirement2 nvarchar(200)=N'unsupported-mechanic-produces-null';
MERGE testauthority.ProofRequirement target USING (VALUES
(@ContractSnapshotId,@VectorId,@Requirement1,N'observed-signal-shape',N'Every fixture input produces exactly one ordered observed value.',CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256','each-fixture-input-produces-one-observed-value|observed-signal-shape'),2)))),
(@ContractSnapshotId,@VectorId,@Requirement2,N'negative-control',N'The unsupported mechanic produces null without fallback classification.',CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256','unsupported-mechanic-produces-null|negative-control'),2))))) source(ContractSnapshotId,TestVectorId,ProofRequirementId,RequirementKind,RequirementStatement,AuthorityDigest)
ON source.ContractSnapshotId=target.ContractSnapshotId AND source.TestVectorId=target.TestVectorId AND source.ProofRequirementId=target.ProofRequirementId
WHEN MATCHED THEN UPDATE SET RequirementKind=source.RequirementKind,RequirementStatement=source.RequirementStatement,AuthorityDigest=source.AuthorityDigest
WHEN NOT MATCHED THEN INSERT VALUES (source.ContractSnapshotId,source.TestVectorId,source.ProofRequirementId,source.RequirementKind,source.RequirementStatement,source.AuthorityDigest);
MERGE testauthority.ScenarioProofPolicy target USING (SELECT @ContractSnapshotId ContractSnapshotId,N'source-facts.classify-mechanic-authority-family' ScenarioId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.ScenarioId=target.ScenarioId
WHEN MATCHED THEN UPDATE SET ExpectedTestVectorCount=1,NegativeControlRequired=1,AuthorityDigest=@VectorDigest
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,N'source-facts.classify-mechanic-authority-family',1,1,@VectorDigest);
MERGE testbinding.ScenarioTestVector target USING (SELECT @ContractSnapshotId ContractSnapshotId,N'source-facts.classify-mechanic-authority-family' ScenarioId,@VectorId TestVectorId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.ScenarioId=target.ScenarioId AND source.TestVectorId=target.TestVectorId
WHEN MATCHED THEN UPDATE SET BindingDisposition=N'CANONICAL_TEST_VECTOR_BOUND'
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,N'source-facts.classify-mechanic-authority-family',@VectorId,N'CANONICAL_TEST_VECTOR_BOUND');
MERGE testbinding.ResponsibilityTestVector target USING (SELECT @ContractSnapshotId ContractSnapshotId,N'classifies-execution-mechanic-authority-family' ResponsibilityId,@VectorId TestVectorId) source ON source.ContractSnapshotId=target.ContractSnapshotId AND source.ResponsibilityId=target.ResponsibilityId AND source.TestVectorId=target.TestVectorId
WHEN MATCHED THEN UPDATE SET BindingDisposition=N'CANONICAL_TEST_VECTOR_BOUND'
WHEN NOT MATCHED THEN INSERT VALUES (@ContractSnapshotId,N'classifies-execution-mechanic-authority-family',@VectorId,N'CANONICAL_TEST_VECTOR_BOUND');

DECLARE @AuthoritySetMaterial varchar(max)=CONCAT(@VectorDigest,'|',@FixtureDigest,'|',@ExecutionDigest,'|',@ExpectationDigest,'|',
 (SELECT STRING_AGG(AuthorityDigest,'|') WITHIN GROUP (ORDER BY ProofRequirementId) FROM testauthority.ProofRequirement WHERE ContractSnapshotId=@ContractSnapshotId AND TestVectorId=@VectorId),'|',
 (SELECT ProfileDigest FROM testauthority.TestProjectionProfile WHERE ProjectionProfileId=N'vitest.v1'));
DECLARE @AuthoritySetDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',@AuthoritySetMaterial),2)));
MERGE testauthority.TestAuthoritySnapshot target USING (SELECT @ContractSnapshotId ContractSnapshotId) source ON source.ContractSnapshotId=target.ContractSnapshotId
WHEN MATCHED THEN UPDATE SET AuthorityDigest=@AuthoritySetDigest,AdmittedVectorCount=1,RefreshedAtUtc=SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT (ContractSnapshotId,AuthorityDigest,AdmittedVectorCount) VALUES (@ContractSnapshotId,@AuthoritySetDigest,1);
GO

IF COL_LENGTH('testexecution.RepositoryTestClosureSeal','TestAuthorityDigest') IS NULL ALTER TABLE testexecution.RepositoryTestClosureSeal ADD TestAuthorityDigest varchar(80) NULL;
IF COL_LENGTH('testexecution.TestRun','TestVectorId') IS NULL ALTER TABLE testexecution.TestRun ADD TestVectorId nvarchar(200) NULL,ProjectedTestArtifactDigest varchar(80) NULL,ProjectionProfileDigest varchar(80) NULL,FixtureDigest varchar(80) NULL,RuntimePlanDigest varchar(80) NULL,OutputDigest varchar(80) NULL;
IF COL_LENGTH('testexecution.TestCaseResult','ExpectedSignalJson') IS NULL ALTER TABLE testexecution.TestCaseResult ADD ExpectedSignalJson nvarchar(max) NULL,ConformanceDisposition nvarchar(120) NULL;
GO

CREATE OR ALTER PROCEDURE projection.RefreshRepositoryTestClosureSeal @RootId nvarchar(400)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 DECLARE @RepositorySealDigest varchar(80),@TestAnalysisDigest varchar(80),@ContractSnapshotId varchar(80),@TestAuthorityDigest varchar(80);
 SELECT @RepositorySealDigest=SealDigest,@ContractSnapshotId=CanonicalIntentContractSnapshotId FROM projection.RepositoryLineageSeal WHERE RootId=@RootId;
 SELECT @TestAnalysisDigest=AnalysisDigest FROM testobservation.RepositoryTestAnalysis WHERE RootId=@RootId AND ContractSnapshotId=@ContractSnapshotId;
 SELECT @TestAuthorityDigest=AuthorityDigest FROM testauthority.TestAuthoritySnapshot WHERE ContractSnapshotId=@ContractSnapshotId;
 IF @RepositorySealDigest IS NULL THROW 51054,'Current repository lineage seal is required before test closure sealing.',1;
 IF @TestAnalysisDigest IS NULL THROW 51055,'Current matching test analysis is required before test closure sealing.',1;
 IF @TestAuthorityDigest IS NULL SET @TestAuthorityDigest='sha256:none';
 DECLARE @Material varchar(max)=CONCAT('repository-test-closure-seal.v2|',@RootId,'|',@RepositorySealDigest,'|',@TestAnalysisDigest,'|',@ContractSnapshotId,'|',@TestAuthorityDigest);
 DECLARE @SealDigest varchar(80)=CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',@Material),2)));
 MERGE testexecution.RepositoryTestClosureSeal target USING (SELECT @RootId RootId) source ON source.RootId=target.RootId
 WHEN MATCHED THEN UPDATE SET RepositoryLineageSealDigest=@RepositorySealDigest,TestAnalysisDigest=@TestAnalysisDigest,ContractSnapshotId=@ContractSnapshotId,TestAuthorityDigest=@TestAuthorityDigest,SealAlgorithm='SHA2_256',TestClosureSealDigest=@SealDigest,SigningDisposition='DIGEST_SEALED_NOT_SIGNED',RefreshedAtUtc=SYSUTCDATETIME()
 WHEN NOT MATCHED THEN INSERT (RootId,RepositoryLineageSealDigest,TestAnalysisDigest,ContractSnapshotId,TestAuthorityDigest,SealAlgorithm,TestClosureSealDigest,SigningDisposition) VALUES (@RootId,@RepositorySealDigest,@TestAnalysisDigest,@ContractSnapshotId,@TestAuthorityDigest,'SHA2_256',@SealDigest,'DIGEST_SEALED_NOT_SIGNED');
 SELECT CONCAT('S|',@SealDigest,'|TEST_CLOSURE_SEALED_IN_SQL') ResultLine;
END;
GO

CREATE OR ALTER PROCEDURE ingestion.RecordCanonicalTestExecution @PayloadJson nvarchar(max)
AS
BEGIN
 SET NOCOUNT ON; SET XACT_ABORT ON;
 IF ISJSON(@PayloadJson)<>1 THROW 51062,'Canonical test execution payload must be JSON.',1;
 DECLARE @RootId nvarchar(400)=JSON_VALUE(@PayloadJson,'$.rootId'),@RunId varchar(80)=JSON_VALUE(@PayloadJson,'$.testRunId'),@VectorId nvarchar(200)=JSON_VALUE(@PayloadJson,'$.testVectorId'),@TestClosureSealDigest varchar(80)=JSON_VALUE(@PayloadJson,'$.testClosureSealDigest');
 DECLARE @ContractSnapshotId varchar(80)=(SELECT ContractSnapshotId FROM testexecution.RepositoryTestClosureSeal WHERE RootId=@RootId AND TestClosureSealDigest=@TestClosureSealDigest);
 IF @ContractSnapshotId IS NULL THROW 51063,'Execution does not match the current test closure seal.',1;
 IF NOT EXISTS (SELECT 1 FROM testauthority.TestVector WHERE ContractSnapshotId=@ContractSnapshotId AND TestVectorId=@VectorId AND LifecycleStatus='TEST_VECTOR_ADMITTED') THROW 51064,'Execution test vector is not admitted.',1;
 IF NOT EXISTS (SELECT 1 FROM testexecution.TestRun WHERE TestRunId=@RunId)
 BEGIN
  INSERT testexecution.TestRun (TestRunId,RootId,TestClosureSealDigest,TestCommand,StartedAtUtc,CompletedAtUtc,ExecutionDisposition,TotalCount,PassedCount,FailedCount,TestVectorId,ProjectedTestArtifactDigest,ProjectionProfileDigest,FixtureDigest,RuntimePlanDigest,OutputDigest)
  VALUES (@RunId,@RootId,@TestClosureSealDigest,JSON_VALUE(@PayloadJson,'$.testCommand'),TRY_CONVERT(datetime2(7),JSON_VALUE(@PayloadJson,'$.startedAtUtc')),TRY_CONVERT(datetime2(7),JSON_VALUE(@PayloadJson,'$.completedAtUtc')),JSON_VALUE(@PayloadJson,'$.executionDisposition'),1,CASE WHEN JSON_VALUE(@PayloadJson,'$.conformanceDisposition')='CANONICAL_EXPECTATION_CONFORMS' THEN 1 ELSE 0 END,CASE WHEN JSON_VALUE(@PayloadJson,'$.conformanceDisposition')='CANONICAL_EXPECTATION_CONFORMS' THEN 0 ELSE 1 END,@VectorId,JSON_VALUE(@PayloadJson,'$.projectedTestArtifactDigest'),JSON_VALUE(@PayloadJson,'$.projectionProfileDigest'),JSON_VALUE(@PayloadJson,'$.fixtureDigest'),JSON_VALUE(@PayloadJson,'$.runtimePlanDigest'),JSON_VALUE(@PayloadJson,'$.outputDigest'));
  INSERT testexecution.TestCaseResult (TestRunId,TestVectorId,TestId,ObservedSignalJson,ResultDisposition,ExpectedSignalJson,ConformanceDisposition)
  VALUES (@RunId,@VectorId,NULL,JSON_QUERY(@PayloadJson,'$.observedSignal'),JSON_VALUE(@PayloadJson,'$.executionDisposition'),JSON_QUERY(@PayloadJson,'$.expectedSignal'),JSON_VALUE(@PayloadJson,'$.conformanceDisposition'));
  INSERT testexecution.ProofDisposition VALUES (@RunId,@ContractSnapshotId,N'source-facts.classify-mechanic-authority-family',@VectorId,CASE WHEN JSON_VALUE(@PayloadJson,'$.conformanceDisposition')='CANONICAL_EXPECTATION_CONFORMS' THEN N'SCENARIO_PROOF_PASSED' ELSE N'SCENARIO_PROOF_FAILED' END);
 END;
 SELECT CONCAT('E|',@RunId,'|',JSON_VALUE(@PayloadJson,'$.conformanceDisposition'),'|CANONICAL_TEST_EXECUTION_RECORDED') ResultLine;
END;
GO

CREATE OR ALTER VIEW projection.CurrentRepositoryTestClosure AS
SELECT seal.RootId,seal.ApplicationId,seal.SealDigest CurrentRepositorySealDigest,testSeal.TestClosureSealDigest,testSeal.TestAuthorityDigest,analysis.AnalysisDigest TestAnalysisDigest,
       analysis.TestArtifactCount,analysis.TestCaseCount,analysis.AssertionCount,analysis.CandidateTestCount,analysis.UnboundTestCount,
       SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END) AdmittedScenarioCount,
       SUM(CASE WHEN scenario.ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END) ClosedScenarioCount,
       CASE WHEN analysis.RootId IS NULL THEN 'REPOSITORY_TEST_OBSERVATION_MISSING'
            WHEN analysis.ImageDigest<>seal.RepositoryImageDigest OR analysis.ContractSnapshotId<>seal.CanonicalIntentContractSnapshotId THEN 'REPOSITORY_TEST_OBSERVATION_STALE'
            WHEN testSeal.RootId IS NULL OR testSeal.RepositoryLineageSealDigest<>seal.SealDigest OR testSeal.TestAnalysisDigest<>analysis.AnalysisDigest THEN 'REPOSITORY_TEST_CLOSURE_SEAL_STALE'
            WHEN testSeal.TestClosureSealDigest<>CONCAT('sha256:',LOWER(CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(max),CONCAT('repository-test-closure-seal.v2|',seal.RootId,'|',seal.SealDigest,'|',analysis.AnalysisDigest,'|',seal.CanonicalIntentContractSnapshotId,'|',COALESCE(testSeal.TestAuthorityDigest,'sha256:none')))),2))) THEN 'REPOSITORY_TEST_CLOSURE_SEAL_INVALID'
            WHEN SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END)=0 THEN 'REPOSITORY_SCENARIO_AUTHORITY_INCOMPLETE'
            WHEN SUM(CASE WHEN scenario.FeatureLifecycleStatus='FEATURE_INTENT_ADMITTED' AND scenario.FeatureAuthorityStatus='FEATURE_LINEAGE_CLOSED' THEN 1 ELSE 0 END)<>SUM(CASE WHEN scenario.ProofCoverageDisposition='SCENARIO_PROOF_CLOSED' THEN 1 ELSE 0 END) THEN 'REPOSITORY_SCENARIO_PROOF_INCOMPLETE'
            ELSE 'REPOSITORY_TEST_PROOF_CLOSED' END RepositoryTestDisposition
FROM projection.RepositoryLineageSeal seal
LEFT JOIN testobservation.RepositoryTestAnalysis analysis ON analysis.RootId=seal.RootId
LEFT JOIN testexecution.RepositoryTestClosureSeal testSeal ON testSeal.RootId=seal.RootId
LEFT JOIN projection.CurrentScenarioTestClosure scenario ON scenario.RootId=seal.RootId
GROUP BY seal.RootId,seal.ApplicationId,seal.SealDigest,seal.RepositoryImageDigest,seal.CanonicalIntentContractSnapshotId,testSeal.RootId,testSeal.RepositoryLineageSealDigest,testSeal.TestAnalysisDigest,testSeal.TestAuthorityDigest,testSeal.TestClosureSealDigest,analysis.RootId,analysis.ImageDigest,analysis.ContractSnapshotId,analysis.AnalysisDigest,analysis.TestArtifactCount,analysis.TestCaseCount,analysis.AssertionCount,analysis.CandidateTestCount,analysis.UnboundTestCount;
GO

EXEC projection.RefreshRepositoryTestClosureSeal @RootId=N'source-facts-semantic-search-engine';
GO
