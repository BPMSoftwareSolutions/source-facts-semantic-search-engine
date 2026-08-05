CREATE OR ALTER VIEW reporting.FeatureTestDisposition
AS
SELECT
    f.ContractSnapshotId,
    f.FeatureId,
    s.ScenarioId,
    o.ObligationId,
    r.ResponsibilityId,
    COUNT(DISTINCT stb.TestId) AS LinkedTestCount,
    CASE WHEN COUNT(DISTINCT stb.TestId) = 0 THEN 'FEATURE_TEST_MISSING' ELSE 'FEATURE_TEST_MAPPED' END AS TestLineageDisposition
FROM lineage.Feature f
JOIN lineage.Scenario s ON s.ContractSnapshotId = f.ContractSnapshotId AND s.FeatureId = f.FeatureId
JOIN lineage.Obligation o ON o.ContractSnapshotId = s.ContractSnapshotId AND o.ScenarioId = s.ScenarioId
JOIN lineage.Responsibility r ON r.ContractSnapshotId = o.ContractSnapshotId AND r.ObligationId = o.ObligationId
LEFT JOIN [test].ScenarioTestBinding stb ON stb.ContractSnapshotId = s.ContractSnapshotId AND stb.ScenarioId = s.ScenarioId AND stb.ResponsibilityId = r.ResponsibilityId
GROUP BY f.ContractSnapshotId, f.FeatureId, s.ScenarioId, o.ObligationId, r.ResponsibilityId;
GO

CREATE OR ALTER VIEW reporting.FeatureEngineeringClosure
AS
SELECT
    f.ContractSnapshotId, f.FeatureId, s.ScenarioId, o.ObligationId, r.ResponsibilityId,
    implementation.CommandId, command.CommandName, command.HandlerSymbolId,
    callable.CallableId, callable.ModulePath, callable.SymbolName,
    implementation.Depth, reach.PathWitnessJson, reach.ResolutionDisposition,
    testCase.TestId, testCase.TestName, testCase.TestFilePath,
    stb.BindingDisposition, proof.ExecutionDisposition, proof.ProofDisposition
FROM lineage.Feature f
JOIN lineage.Scenario s ON s.ContractSnapshotId = f.ContractSnapshotId AND s.FeatureId = f.FeatureId
JOIN lineage.Obligation o ON o.ContractSnapshotId = s.ContractSnapshotId AND o.ScenarioId = s.ScenarioId
JOIN lineage.Responsibility r ON r.ContractSnapshotId = o.ContractSnapshotId AND r.ObligationId = o.ObligationId
LEFT JOIN binding.ResponsibilityCallable implementation ON implementation.ContractSnapshotId = r.ContractSnapshotId AND implementation.ResponsibilityId = r.ResponsibilityId
LEFT JOIN observation.Callable callable ON callable.ObservationSnapshotId = implementation.ObservationSnapshotId AND callable.CallableKey = implementation.CallableKey
LEFT JOIN observation.CliCommand command ON command.ObservationSnapshotId = implementation.ObservationSnapshotId AND command.CommandId = implementation.CommandId
LEFT JOIN observation.CommandReachability reach ON reach.ObservationSnapshotId = implementation.ObservationSnapshotId AND reach.CommandId = implementation.CommandId AND reach.CallableKey = implementation.CallableKey
LEFT JOIN [test].ScenarioTestBinding stb ON stb.ContractSnapshotId = s.ContractSnapshotId AND stb.ScenarioId = s.ScenarioId AND stb.ResponsibilityId = r.ResponsibilityId
LEFT JOIN [test].TestCase testCase ON testCase.ObservationSnapshotId = stb.ObservationSnapshotId AND testCase.TestId = stb.TestId
LEFT JOIN proof.ScenarioProof proof ON proof.ContractSnapshotId = s.ContractSnapshotId AND proof.ObservationSnapshotId = stb.ObservationSnapshotId AND proof.ScenarioId = s.ScenarioId AND proof.TestId = stb.TestId;
GO
