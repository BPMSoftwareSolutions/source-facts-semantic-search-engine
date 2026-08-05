-- Native, read-only mechanic-authority candidate projection.
-- The result rows are the product: this script creates no query-run, report,
-- receipt, proof, or projected-body persistence.

IF OBJECT_ID('projection.ExecutionMechanicAuthority', 'V') IS NOT NULL
    DROP VIEW projection.ExecutionMechanicAuthority;
GO

IF OBJECT_ID('authority.MechanicAuthorityFamily', 'U') IS NULL
BEGIN
    CREATE TABLE authority.MechanicAuthorityFamily
    (
        MechanicKind varchar(40) NOT NULL,
        AuthorityFamily varchar(80) NOT NULL,
        AuthorityKind varchar(120) NOT NULL,
        CONSTRAINT PK_MechanicAuthorityFamily PRIMARY KEY (MechanicKind),
        CONSTRAINT UQ_MechanicAuthorityFamily_AuthorityFamily UNIQUE (AuthorityFamily),
        CONSTRAINT CK_MechanicAuthorityFamily_MechanicKind CHECK (MechanicKind IN (
            'branch', 'iteration', 'exception-handling', 'throw', 'object-construction',
            'serialization', 'normalization', 'validation', 'fallback', 'retry',
            'state-mutation', 'meaning-hidden-in-text'
        ))
    );
END;
GO

MERGE authority.MechanicAuthorityFamily AS target
USING (VALUES
    ('branch',                 'decision-authority',              'decision-authority.v1'),
    ('iteration',              'iteration-authority',             'iteration-authority.v1'),
    ('exception-handling',     'failure-policy-authority',        'failure-observation-authority.v1'),
    ('throw',                  'terminal-result-authority',       'terminal-disposition-authority.v1'),
    ('object-construction',    'projection-authority',            'semantic-projection-authority.v1'),
    ('serialization',          'serialization-profile-authority', 'serialization-profile-authority.v1'),
    ('normalization',          'normalization-authority',         'canonicalization-authority.v1'),
    ('validation',             'validation-authority',            'constraint-authority.v1'),
    ('fallback',               'alternative-selection-authority', 'alternative-selection-authority.v1'),
    ('retry',                  'retry-policy-authority',           'retry-policy-authority.v1'),
    ('state-mutation',         'state-transition-authority',      'state-transition-authority.v1'),
    ('meaning-hidden-in-text', 'text-meaning-authority',          'text-meaning-authority.v1')
) AS source (MechanicKind, AuthorityFamily, AuthorityKind)
ON target.MechanicKind = source.MechanicKind
WHEN MATCHED AND (target.AuthorityFamily <> source.AuthorityFamily OR target.AuthorityKind <> source.AuthorityKind)
    THEN UPDATE SET AuthorityFamily = source.AuthorityFamily, AuthorityKind = source.AuthorityKind
WHEN NOT MATCHED BY TARGET
    THEN INSERT (MechanicKind, AuthorityFamily, AuthorityKind)
         VALUES (source.MechanicKind, source.AuthorityFamily, source.AuthorityKind)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
GO

IF OBJECT_ID('binding.MechanicCanonicalLineage', 'U') IS NULL
BEGIN
    CREATE TABLE binding.MechanicCanonicalLineage
    (
        IndexId varchar(120) NOT NULL,
        RootId nvarchar(400) NOT NULL,
        ExecutableMechanicFactId varchar(120) NOT NULL,
        ContractSnapshotId varchar(80) NOT NULL,
        ResponsibilityId nvarchar(160) NOT NULL,
        ContextAuthorityDigest varchar(80) NOT NULL,
        ReviewDisposition varchar(80) NOT NULL,
        CONSTRAINT PK_MechanicCanonicalLineage PRIMARY KEY (IndexId, RootId, ExecutableMechanicFactId),
        CONSTRAINT FK_MechanicCanonicalLineage_Mechanic FOREIGN KEY (IndexId, RootId, ExecutableMechanicFactId)
            REFERENCES fact.ExecutableMechanic(IndexId, RootId, ExecutableMechanicFactId),
        CONSTRAINT FK_MechanicCanonicalLineage_Responsibility FOREIGN KEY (ContractSnapshotId, ResponsibilityId)
            REFERENCES lineage.Responsibility(ContractSnapshotId, ResponsibilityId),
        CONSTRAINT CK_MechanicCanonicalLineage_Review CHECK (ReviewDisposition = 'LINEAGE_OVERRIDE_REVIEWED')
    );
END;
GO

CREATE VIEW projection.ExecutionMechanicAuthority
AS
WITH LineageCandidates AS
(
    SELECT
        mechanic.IndexId,
        mechanic.RootId,
        mechanic.ExecutableMechanicFactId,
        explicit.ContractSnapshotId,
        explicit.ResponsibilityId,
        0 AS BindingPriority
    FROM fact.ExecutableMechanic AS mechanic
    JOIN binding.MechanicCanonicalLineage AS explicit
      ON explicit.IndexId = mechanic.IndexId
     AND explicit.RootId = mechanic.RootId
     AND explicit.ExecutableMechanicFactId = mechanic.ExecutableMechanicFactId
     AND explicit.ReviewDisposition = 'LINEAGE_OVERRIDE_REVIEWED'

    UNION ALL

    SELECT
        mechanic.IndexId,
        mechanic.RootId,
        mechanic.ExecutableMechanicFactId,
        responsibilityCallable.ContractSnapshotId,
        responsibilityCallable.ResponsibilityId,
        1 AS BindingPriority
    FROM fact.ExecutableMechanic AS mechanic
    JOIN observation.ObservationSnapshot AS observationSnapshot
      ON observationSnapshot.IndexId = mechanic.IndexId
    JOIN observation.Callable AS callable
      ON callable.ObservationSnapshotId = observationSnapshot.ObservationSnapshotId
     AND callable.CallableId = mechanic.FromSymbolId
    JOIN binding.ResponsibilityCallable AS responsibilityCallable
      ON responsibilityCallable.ObservationSnapshotId = callable.ObservationSnapshotId
     AND responsibilityCallable.CallableKey = callable.CallableKey
     AND responsibilityCallable.BindingDisposition = 'RESPONSIBILITY_CALLABLE_BOUND'
),
RankedLineage AS
(
    SELECT
        candidate.*,
        ROW_NUMBER() OVER (
            PARTITION BY candidate.IndexId, candidate.RootId, candidate.ExecutableMechanicFactId
            ORDER BY candidate.BindingPriority, contractSnapshot.LoadedAtUtc DESC,
                     candidate.ContractSnapshotId, candidate.ResponsibilityId
        ) AS CandidateRank
    FROM LineageCandidates AS candidate
    JOIN authority.ContractSnapshot AS contractSnapshot
      ON contractSnapshot.ContractSnapshotId = candidate.ContractSnapshotId
),
CandidateBase AS
(
    SELECT
        COALESCE(contractSnapshot.ApplicationId, observedContext.ApplicationId) AS ApplicationId,
        mechanic.ExecutableMechanicFactId AS MechanicOccurrenceId,
        mechanic.MechanicKind,
        family.AuthorityFamily,
        feature.FeatureId,
        scenario.ScenarioId,
        obligation.ObligationId,
        responsibility.ResponsibilityId,
        mechanic.IndexId AS SourceFactIndexId,
        mechanic.RootId,
        mechanic.SourceReferenceId,
        sourceReference.StartLine,
        sourceReference.StartColumn,
        sourceFile.ContentHash AS SourceFileDigest,
        family.AuthorityKind,
        ROW_NUMBER() OVER (
            PARTITION BY mechanic.IndexId, responsibility.ResponsibilityId
            ORDER BY sourceReference.StartLine, sourceReference.StartColumn,
                     mechanic.ExecutableMechanicFactId
        ) * 10 AS ExecutionOrdinal
    FROM fact.ExecutableMechanic AS mechanic
    LEFT JOIN authority.MechanicAuthorityFamily AS family
      ON family.MechanicKind = mechanic.MechanicKind
    LEFT JOIN source.SourceReference AS sourceReference
      ON sourceReference.SourceReferenceKey = mechanic.SourceReferenceKey
    OUTER APPLY
    (
        SELECT TOP (1) file.ContentHash
        FROM inventory.SourceFile AS file
        WHERE file.IndexId = mechanic.IndexId
          AND file.RootId = mechanic.RootId
          AND file.RelativePath = mechanic.ModulePath
        ORDER BY file.FileId
    ) AS sourceFile
    LEFT JOIN RankedLineage AS selectedLineage
      ON selectedLineage.IndexId = mechanic.IndexId
     AND selectedLineage.RootId = mechanic.RootId
     AND selectedLineage.ExecutableMechanicFactId = mechanic.ExecutableMechanicFactId
     AND selectedLineage.CandidateRank = 1
    LEFT JOIN lineage.Responsibility AS responsibility
      ON responsibility.ContractSnapshotId = selectedLineage.ContractSnapshotId
     AND responsibility.ResponsibilityId = selectedLineage.ResponsibilityId
    LEFT JOIN lineage.Obligation AS obligation
      ON obligation.ContractSnapshotId = responsibility.ContractSnapshotId
     AND obligation.ObligationId = responsibility.ObligationId
    LEFT JOIN lineage.Scenario AS scenario
      ON scenario.ContractSnapshotId = obligation.ContractSnapshotId
     AND scenario.ScenarioId = obligation.ScenarioId
    LEFT JOIN lineage.Feature AS feature
      ON feature.ContractSnapshotId = scenario.ContractSnapshotId
     AND feature.FeatureId = scenario.FeatureId
    LEFT JOIN authority.ContractSnapshot AS contractSnapshot
      ON contractSnapshot.ContractSnapshotId = selectedLineage.ContractSnapshotId
    OUTER APPLY
    (
        SELECT TOP (1) snapshot.ApplicationId
        FROM observation.ObservationSnapshot AS snapshot
        WHERE snapshot.IndexId = mechanic.IndexId
        ORDER BY snapshot.LoadedAtUtc DESC, snapshot.ObservationSnapshotId
    ) AS observedContext
)
SELECT
    candidate.ApplicationId,
    candidate.MechanicOccurrenceId,
    candidate.MechanicKind,
    candidate.AuthorityFamily,
    candidate.FeatureId,
    candidate.ScenarioId,
    candidate.ObligationId,
    candidate.ResponsibilityId,
    candidate.SourceFactIndexId,
    candidate.RootId,
    candidate.SourceReferenceId,
    candidate.ExecutionOrdinal,
    JSON_QUERY(CASE candidate.MechanicKind
        WHEN 'branch' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, JSON_QUERY('[]') AS inputs, JSON_QUERY('[]') AS rules, JSON_QUERY('[]') AS outcomes, NULL AS noMatchDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'iteration' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS collectionInputId, NULL AS itemBindingId, NULL AS ordering, NULL AS continuation, NULL AS termination FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'exception-handling' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, JSON_QUERY('[]') AS observedFailures, JSON_QUERY('[]') AS dispositions, NULL AS unhandledDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'throw' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS terminalDisposition, NULL AS resultOutputId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'object-construction' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS projectionId, JSON_QUERY('[]') AS fieldMappings, NULL AS unmappedFieldDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'serialization' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS profileId, NULL AS mediaType, NULL AS encoding, JSON_QUERY('[]') AS rules FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'normalization' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS inputId, NULL AS outputId, JSON_QUERY('[]') AS operations, NULL AS ambiguityDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'validation' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, JSON_QUERY('[]') AS inputIds, JSON_QUERY('[]') AS constraints, NULL AS validOutcome, NULL AS invalidOutcome FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'fallback' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, JSON_QUERY('[]') AS alternatives, JSON_QUERY('[]') AS selectionOrder, NULL AS exhaustedDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'retry' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS operationId, NULL AS maximumAttempts, JSON_QUERY('[]') AS retryableDispositions, NULL AS backoff, NULL AS exhaustedDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'state-mutation' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS stateId, JSON_QUERY('[]') AS fromStates, JSON_QUERY('[]') AS transitions, JSON_QUERY('[]') AS guards, NULL AS effectId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        WHEN 'meaning-hidden-in-text' THEN (SELECT candidate.AuthorityKind AS authorityKind, CONCAT('candidate-', candidate.MechanicOccurrenceId) AS candidateAuthorityId, NULL AS vocabularyId, JSON_QUERY('[]') AS meanings, JSON_QUERY('[]') AS templates, NULL AS unknownTextDisposition FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)
        ELSE NULL
    END) AS AuthorityData,
    CASE
        WHEN candidate.AuthorityFamily IS NULL THEN 'AUTHORITY_FAMILY_UNSUPPORTED'
        WHEN candidate.SourceReferenceId IS NULL OR candidate.SourceFileDigest IS NULL THEN 'SOURCE_EVIDENCE_INCOMPLETE'
        WHEN candidate.ApplicationId IS NULL OR candidate.FeatureId IS NULL OR candidate.ScenarioId IS NULL
          OR candidate.ObligationId IS NULL OR candidate.ResponsibilityId IS NULL THEN 'LINEAGE_CONTEXT_INCOMPLETE'
        ELSE 'HUMAN_SEMANTIC_COMPLETION_REQUIRED'
    END AS ProjectionDisposition,
    JSON_QUERY(CASE candidate.MechanicKind
        WHEN 'branch' THEN '["inputs","rules","outcomes","noMatchDisposition"]'
        WHEN 'iteration' THEN '["collectionInputId","itemBindingId","ordering","continuation","termination"]'
        WHEN 'exception-handling' THEN '["observedFailures","dispositions","unhandledDisposition"]'
        WHEN 'throw' THEN '["terminalDisposition","resultOutputId"]'
        WHEN 'object-construction' THEN '["projectionId","fieldMappings","unmappedFieldDisposition"]'
        WHEN 'serialization' THEN '["profileId","mediaType","encoding","rules"]'
        WHEN 'normalization' THEN '["inputId","outputId","operations","ambiguityDisposition"]'
        WHEN 'validation' THEN '["inputIds","constraints","validOutcome","invalidOutcome"]'
        WHEN 'fallback' THEN '["alternatives","selectionOrder","exhaustedDisposition"]'
        WHEN 'retry' THEN '["operationId","maximumAttempts","retryableDispositions","backoff","exhaustedDisposition"]'
        WHEN 'state-mutation' THEN '["stateId","fromStates","transitions","guards","effectId"]'
        WHEN 'meaning-hidden-in-text' THEN '["vocabularyId","meanings","templates","unknownTextDisposition"]'
        ELSE '[]'
    END) AS MissingFields
FROM CandidateBase AS candidate;
GO
