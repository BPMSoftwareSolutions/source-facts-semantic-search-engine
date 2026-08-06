-- Debt-to-data metrics: read-only ratios and per-occurrence debt-class
-- projection over facts 022/023 already compute. Adds no observation, no
-- table, and no admission behavior -- see
-- docs/measureable-transformation-model-implementation-plan.md for the
-- taxonomy this implements and the classes it deliberately leaves out
-- because their underlying facts do not exist yet.
SET XACT_ABORT ON;
SET NOCOUNT ON;
GO

CREATE OR ALTER VIEW projection.CurrentDebtToDataMetrics AS
SELECT
    summary.RootId,
    summary.MechanicCount AS ObservedMechanicCount,
    summary.OutsideKernelViolationCount,
    summary.AuthorityBoundViolationCount,
    summary.KernelAllowedMechanicCount,
    summary.FalsePositiveMechanicCount,
    summary.AuthorityAdmittedMechanicCount,
    summary.AuthorityCompletionBacklogCount,
    summary.ResponsibilityOwnedMechanicCount,
    summary.InterfaceReachableMechanicCount,
    summary.TestReachedMechanicCount,
    CASE WHEN summary.MechanicCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.OutsideKernelViolationCount) / summary.MechanicCount
    END AS DebtToDataRatio,
    CASE WHEN summary.OutsideKernelViolationCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.AuthorityBoundViolationCount) / summary.OutsideKernelViolationCount
    END AS AuthorityRecoveryCoverageRatio,
    CASE WHEN summary.MechanicCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.KernelAllowedMechanicCount + summary.FalsePositiveMechanicCount) / summary.MechanicCount
    END AS KernelConformanceRatio,
    CASE WHEN summary.MechanicCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.ResponsibilityOwnedMechanicCount) / summary.MechanicCount
    END AS OwnershipCoverageRatio,
    CASE WHEN summary.MechanicCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.InterfaceReachableMechanicCount) / summary.MechanicCount
    END AS InterfaceReachCoverageRatio,
    -- Structural test-invocation reachability, not admitted canonical
    -- test-vector coverage (that is projection.CurrentTestMeaning, scoped
    -- to scenarios). Named distinctly so it is not read as the doc's
    -- "Canonical Test Coverage".
    CASE WHEN summary.MechanicCount = 0 THEN NULL
         ELSE CONVERT(decimal(9,6), summary.TestReachedMechanicCount) / summary.MechanicCount
    END AS TestReachCoverageRatio,
    summary.ExecutionAnalysisDisposition
FROM projection.CurrentOperationalExecutionSummary summary;
GO

CREATE OR ALTER VIEW projection.CurrentMechanicDebtClassification AS
SELECT
    mechanic.RootId,
    mechanic.ApplicationId,
    mechanic.MechanicOccurrenceId,
    mechanic.MechanicKind,
    mechanic.AuthorityFamily,
    mechanic.ArtifactId,
    mechanic.ResponsibilityId,
    mechanic.AuthorityProjectionDisposition,
    mechanic.AdmissionDisposition,
    mechanic.ExecutionBoundary,
    mechanic.ViolationDisposition,
    mechanic.RemediationDisposition,
    COALESCE(mechanic.TestCaseCount, 0) AS TestCaseCount,
    CASE
        WHEN mechanic.ViolationDisposition IN ('KERNEL_EXECUTION_ALLOWED', 'FALSE_POSITIVE_EXCLUDED') THEN 'NO_DEBT'
        WHEN mechanic.AdmissionDisposition = 'AUTHORITY_ADMITTED' THEN 'REPLACEMENT_DEBT'
        WHEN mechanic.ResponsibilityId IS NULL THEN 'OWNERSHIP_DEBT'
        WHEN mechanic.AuthorityProjectionDisposition IN ('LINEAGE_CONTEXT_INCOMPLETE', 'LINEAGE_CONTEXT_AMBIGUOUS') THEN 'OWNERSHIP_DEBT'
        WHEN mechanic.AuthorityProjectionDisposition IN ('AUTHORITY_FAMILY_UNSUPPORTED', 'SOURCE_EVIDENCE_INCOMPLETE') THEN 'MECHANIC_DEBT'
        WHEN mechanic.AuthorityProjectionDisposition = 'HUMAN_SEMANTIC_COMPLETION_REQUIRED' THEN 'AUTHORITY_DEBT'
        ELSE 'MECHANIC_DEBT'
    END AS DebtClass
FROM projection.CurrentExecutionMechanicOccurrence mechanic;
GO
