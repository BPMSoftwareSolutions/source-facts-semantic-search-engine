-- Durable projection of canonical authority beside observed call/test evidence.
-- Snapshot identifiers are content-derived in the Node loader. Nothing here
-- promotes an observation into authority merely because the identifiers match.

IF OBJECT_ID('proof.ScenarioProof', 'U') IS NOT NULL DROP TABLE proof.ScenarioProof;
IF OBJECT_ID('[test].ScenarioTestBinding', 'U') IS NOT NULL DROP TABLE [test].ScenarioTestBinding;
IF OBJECT_ID('[test].TestProductionReachability', 'U') IS NOT NULL DROP TABLE [test].TestProductionReachability;
IF OBJECT_ID('[test].TestCase', 'U') IS NOT NULL DROP TABLE [test].TestCase;
IF OBJECT_ID('binding.ResponsibilityCallable', 'U') IS NOT NULL DROP TABLE binding.ResponsibilityCallable;
IF OBJECT_ID('binding.ResponsibilityCommand', 'U') IS NOT NULL DROP TABLE binding.ResponsibilityCommand;
IF OBJECT_ID('observation.CommandReachability', 'U') IS NOT NULL DROP TABLE observation.CommandReachability;
IF OBJECT_ID('observation.CliCommand', 'U') IS NOT NULL DROP TABLE observation.CliCommand;
IF OBJECT_ID('observation.Callable', 'U') IS NOT NULL DROP TABLE observation.Callable;
IF OBJECT_ID('observation.ObservationSnapshot', 'U') IS NOT NULL DROP TABLE observation.ObservationSnapshot;
IF OBJECT_ID('lineage.Responsibility', 'U') IS NOT NULL DROP TABLE lineage.Responsibility;
IF OBJECT_ID('lineage.Obligation', 'U') IS NOT NULL DROP TABLE lineage.Obligation;
IF OBJECT_ID('lineage.Scenario', 'U') IS NOT NULL DROP TABLE lineage.Scenario;
IF OBJECT_ID('lineage.Feature', 'U') IS NOT NULL DROP TABLE lineage.Feature;
IF OBJECT_ID('lineage.Project', 'U') IS NOT NULL DROP TABLE lineage.Project;
IF OBJECT_ID('artifact.Artifact', 'U') IS NOT NULL DROP TABLE artifact.Artifact;
IF OBJECT_ID('authority.ContractSnapshot', 'U') IS NOT NULL DROP TABLE authority.ContractSnapshot;
GO

CREATE TABLE authority.ContractSnapshot
(
    ContractSnapshotId varchar(80) NOT NULL,
    ContractId nvarchar(160) NULL,
    ContractType nvarchar(160) NULL,
    ProjectId nvarchar(160) NOT NULL,
    SubjectId nvarchar(160) NULL,
    SourcePath nvarchar(1024) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    LoadedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_ContractSnapshot_LoadedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ContractSnapshot PRIMARY KEY (ContractSnapshotId)
);

CREATE TABLE artifact.Artifact
(
    ContractSnapshotId varchar(80) NOT NULL,
    ArtifactId nvarchar(160) NOT NULL,
    ArtifactKind nvarchar(160) NOT NULL,
    Purpose nvarchar(max) NOT NULL,
    LifecycleStatus nvarchar(160) NULL,
    AuthorityStatus nvarchar(200) NULL,
    RelativePath nvarchar(1024) NOT NULL,
    MediaType nvarchar(160) NOT NULL,
    ProjectionProfileId nvarchar(160) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_Artifact PRIMARY KEY (ContractSnapshotId, ArtifactId),
    CONSTRAINT FK_Artifact_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId)
);

CREATE TABLE lineage.Project
(
    ContractSnapshotId varchar(80) NOT NULL,
    ProjectId nvarchar(160) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_LineageProject PRIMARY KEY (ContractSnapshotId, ProjectId),
    CONSTRAINT FK_LineageProject_Contract FOREIGN KEY (ContractSnapshotId) REFERENCES authority.ContractSnapshot(ContractSnapshotId)
);

CREATE TABLE lineage.Feature
(
    ContractSnapshotId varchar(80) NOT NULL,
    FeatureId nvarchar(160) NOT NULL,
    ProjectId nvarchar(160) NOT NULL,
    Purpose nvarchar(max) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_LineageFeature PRIMARY KEY (ContractSnapshotId, FeatureId),
    CONSTRAINT FK_LineageFeature_Project FOREIGN KEY (ContractSnapshotId, ProjectId) REFERENCES lineage.Project(ContractSnapshotId, ProjectId)
);

CREATE TABLE lineage.Scenario
(
    ContractSnapshotId varchar(80) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    FeatureId nvarchar(160) NOT NULL,
    Purpose nvarchar(max) NOT NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_LineageScenario PRIMARY KEY (ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_LineageScenario_Feature FOREIGN KEY (ContractSnapshotId, FeatureId) REFERENCES lineage.Feature(ContractSnapshotId, FeatureId)
);

CREATE TABLE lineage.Obligation
(
    ContractSnapshotId varchar(80) NOT NULL,
    ObligationId nvarchar(160) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    Statement nvarchar(max) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_LineageObligation PRIMARY KEY (ContractSnapshotId, ObligationId),
    CONSTRAINT FK_LineageObligation_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId)
);

CREATE TABLE lineage.Responsibility
(
    ContractSnapshotId varchar(80) NOT NULL,
    ResponsibilityId nvarchar(160) NOT NULL,
    ObligationId nvarchar(160) NOT NULL,
    ResponsibilityType nvarchar(160) NOT NULL,
    ProjectionProfileId nvarchar(160) NOT NULL,
    ArtifactId nvarchar(160) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    CONSTRAINT PK_LineageResponsibility PRIMARY KEY (ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_LineageResponsibility_Obligation FOREIGN KEY (ContractSnapshotId, ObligationId) REFERENCES lineage.Obligation(ContractSnapshotId, ObligationId),
    CONSTRAINT FK_LineageResponsibility_Artifact FOREIGN KEY (ContractSnapshotId, ArtifactId) REFERENCES artifact.Artifact(ContractSnapshotId, ArtifactId)
);

CREATE TABLE observation.ObservationSnapshot
(
    ObservationSnapshotId varchar(80) NOT NULL,
    IndexId varchar(120) NULL,
    ReportType nvarchar(160) NOT NULL,
    RepositoryId nvarchar(400) NULL,
    GeneratedAtUtc datetime2(7) NULL,
    SourcePath nvarchar(1024) NULL,
    ObservationDigest varchar(80) NOT NULL,
    LoadedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_ObservationSnapshot_LoadedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ObservationSnapshot PRIMARY KEY (ObservationSnapshotId)
);

CREATE TABLE observation.Callable
(
    ObservationSnapshotId varchar(80) NOT NULL,
    CallableKey varchar(80) NOT NULL,
    CallableId nvarchar(900) NOT NULL,
    SymbolName nvarchar(400) NULL,
    ModulePath nvarchar(1024) NOT NULL,
    SymbolKind nvarchar(80) NULL,
    SourceReferenceId nvarchar(900) NULL,
    DeclarationLine int NULL,
    ClosureClassification nvarchar(120) NULL,
    CONSTRAINT PK_ObservedCallable PRIMARY KEY (ObservationSnapshotId, CallableKey),
    CONSTRAINT FK_ObservedCallable_Snapshot FOREIGN KEY (ObservationSnapshotId) REFERENCES observation.ObservationSnapshot(ObservationSnapshotId)
);

CREATE TABLE observation.CliCommand
(
    ObservationSnapshotId varchar(80) NOT NULL,
    CommandId nvarchar(240) NOT NULL,
    CommandName nvarchar(160) NOT NULL,
    HandlerSymbolId nvarchar(900) NOT NULL,
    InterfaceStatus nvarchar(120) NULL,
    AdmissionDisposition nvarchar(120) NULL,
    CONSTRAINT PK_CliCommand PRIMARY KEY (ObservationSnapshotId, CommandId),
    CONSTRAINT FK_CliCommand_Snapshot FOREIGN KEY (ObservationSnapshotId) REFERENCES observation.ObservationSnapshot(ObservationSnapshotId)
);

CREATE TABLE observation.CommandReachability
(
    ObservationSnapshotId varchar(80) NOT NULL,
    CommandId nvarchar(240) NOT NULL,
    CallableKey varchar(80) NOT NULL,
    Depth int NOT NULL,
    PathWitnessJson nvarchar(max) NOT NULL,
    RelationshipIdsJson nvarchar(max) NOT NULL,
    ResolutionDisposition nvarchar(120) NOT NULL,
    CONSTRAINT PK_CommandReachability PRIMARY KEY (ObservationSnapshotId, CommandId, CallableKey),
    CONSTRAINT FK_CommandReachability_Command FOREIGN KEY (ObservationSnapshotId, CommandId) REFERENCES observation.CliCommand(ObservationSnapshotId, CommandId),
    CONSTRAINT FK_CommandReachability_Callable FOREIGN KEY (ObservationSnapshotId, CallableKey) REFERENCES observation.Callable(ObservationSnapshotId, CallableKey),
    CONSTRAINT CK_CommandReachability_Path CHECK (ISJSON(PathWitnessJson) = 1),
    CONSTRAINT CK_CommandReachability_Relationships CHECK (ISJSON(RelationshipIdsJson) = 1)
);

CREATE TABLE binding.ResponsibilityCommand
(
    ContractSnapshotId varchar(80) NOT NULL,
    ObservationSnapshotId varchar(80) NOT NULL,
    ResponsibilityId nvarchar(160) NOT NULL,
    CommandId nvarchar(240) NOT NULL,
    BindingDisposition nvarchar(120) NOT NULL,
    CONSTRAINT PK_ResponsibilityCommand PRIMARY KEY (ContractSnapshotId, ObservationSnapshotId, ResponsibilityId, CommandId),
    CONSTRAINT FK_ResponsibilityCommand_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_ResponsibilityCommand_Command FOREIGN KEY (ObservationSnapshotId, CommandId) REFERENCES observation.CliCommand(ObservationSnapshotId, CommandId)
);

CREATE TABLE binding.ResponsibilityCallable
(
    ContractSnapshotId varchar(80) NOT NULL,
    ObservationSnapshotId varchar(80) NOT NULL,
    ResponsibilityId nvarchar(160) NOT NULL,
    CallableKey varchar(80) NOT NULL,
    Depth int NOT NULL,
    CommandId nvarchar(240) NULL,
    BindingDisposition nvarchar(120) NOT NULL,
    CONSTRAINT PK_ResponsibilityCallable PRIMARY KEY (ContractSnapshotId, ObservationSnapshotId, ResponsibilityId, CallableKey),
    CONSTRAINT FK_ResponsibilityCallable_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_ResponsibilityCallable_Callable FOREIGN KEY (ObservationSnapshotId, CallableKey) REFERENCES observation.Callable(ObservationSnapshotId, CallableKey)
);

CREATE TABLE [test].TestCase
(
    ObservationSnapshotId varchar(80) NOT NULL,
    TestId varchar(80) NOT NULL,
    TestName nvarchar(max) NOT NULL,
    TestFilePath nvarchar(1024) NOT NULL,
    Framework nvarchar(120) NULL,
    StartLine int NULL,
    ExecutionStatus nvarchar(120) NOT NULL,
    RuntimeResultDisposition nvarchar(160) NOT NULL,
    CONSTRAINT PK_TestCase PRIMARY KEY (ObservationSnapshotId, TestId),
    CONSTRAINT FK_TestCase_Snapshot FOREIGN KEY (ObservationSnapshotId) REFERENCES observation.ObservationSnapshot(ObservationSnapshotId)
);

CREATE TABLE [test].TestProductionReachability
(
    ObservationSnapshotId varchar(80) NOT NULL,
    TestId varchar(80) NOT NULL,
    CallableKey varchar(80) NOT NULL,
    Depth int NOT NULL,
    ReachabilityPosture nvarchar(120) NOT NULL,
    PathWitnessJson nvarchar(max) NOT NULL,
    CONSTRAINT PK_TestProductionReachability PRIMARY KEY (ObservationSnapshotId, TestId, CallableKey),
    CONSTRAINT FK_TestProductionReachability_Test FOREIGN KEY (ObservationSnapshotId, TestId) REFERENCES [test].TestCase(ObservationSnapshotId, TestId),
    CONSTRAINT FK_TestProductionReachability_Callable FOREIGN KEY (ObservationSnapshotId, CallableKey) REFERENCES observation.Callable(ObservationSnapshotId, CallableKey),
    CONSTRAINT CK_TestProductionReachability_Path CHECK (ISJSON(PathWitnessJson) = 1)
);

CREATE TABLE [test].ScenarioTestBinding
(
    ContractSnapshotId varchar(80) NOT NULL,
    ObservationSnapshotId varchar(80) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    ResponsibilityId nvarchar(160) NOT NULL,
    TestId varchar(80) NOT NULL,
    BindingDisposition nvarchar(160) NOT NULL,
    CONSTRAINT PK_ScenarioTestBinding PRIMARY KEY (ContractSnapshotId, ObservationSnapshotId, ScenarioId, ResponsibilityId, TestId),
    CONSTRAINT FK_ScenarioTestBinding_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_ScenarioTestBinding_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId) REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
    CONSTRAINT FK_ScenarioTestBinding_Test FOREIGN KEY (ObservationSnapshotId, TestId) REFERENCES [test].TestCase(ObservationSnapshotId, TestId)
);

CREATE TABLE proof.ScenarioProof
(
    ContractSnapshotId varchar(80) NOT NULL,
    ObservationSnapshotId varchar(80) NOT NULL,
    ScenarioId nvarchar(160) NOT NULL,
    TestId varchar(80) NOT NULL,
    ExecutionDisposition nvarchar(160) NOT NULL,
    ProofDisposition nvarchar(200) NOT NULL,
    ObservedResultJson nvarchar(max) NULL,
    CONSTRAINT PK_ScenarioProof PRIMARY KEY (ContractSnapshotId, ObservationSnapshotId, ScenarioId, TestId),
    CONSTRAINT FK_ScenarioProof_Scenario FOREIGN KEY (ContractSnapshotId, ScenarioId) REFERENCES lineage.Scenario(ContractSnapshotId, ScenarioId),
    CONSTRAINT FK_ScenarioProof_Test FOREIGN KEY (ObservationSnapshotId, TestId) REFERENCES [test].TestCase(ObservationSnapshotId, TestId),
    CONSTRAINT CK_ScenarioProof_Result CHECK (ObservedResultJson IS NULL OR ISJSON(ObservedResultJson) = 1)
);
GO
