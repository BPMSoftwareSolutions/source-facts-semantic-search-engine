-- Views only. This schema exists so SSMS/ad hoc SQL has ready-made starting points;
-- it does not replace ad hoc querying against fact.* and source.* directly.
--
-- reporting.SourceAuthorityAlignment is intentionally absent: the engine does not
-- currently load any declared contract/ontology material (composition-authorities
-- is a separate, unrelated capability of this repository), so there is nothing to
-- align fact.ExecutableMechanic against yet. Add the view once that data is loaded.

IF OBJECT_ID('reporting.ForbiddenExecutableMechanic', 'V') IS NOT NULL DROP VIEW reporting.ForbiddenExecutableMechanic;
GO
CREATE VIEW reporting.ForbiddenExecutableMechanic AS
SELECT
    f.IndexId,
    f.RootId AS SourceRootId,
    f.RelativePath,
    s.Name              AS EnclosingSymbolName,
    s.SymbolKind         AS EnclosingSymbolKind,
    m.MechanicKind,
    m.EvidenceKind,
    m.Classification,
    m.VerificationDisposition,
    r.StartLine,
    r.StartColumn,
    r.EndLine,
    r.EndColumn
FROM fact.ExecutableMechanic AS m
JOIN inventory.SourceFile AS f
    ON f.IndexId = m.IndexId AND f.RootId = m.RootId AND f.RelativePath = m.ModulePath
JOIN source.SourceReference AS r
    ON r.SourceReferenceKey = m.SourceReferenceKey
LEFT JOIN source.Symbol AS s
    ON s.SymbolKey = m.FromSymbolKey;
GO

IF OBJECT_ID('reporting.FunctionMechanicSummary', 'V') IS NOT NULL DROP VIEW reporting.FunctionMechanicSummary;
GO
CREATE VIEW reporting.FunctionMechanicSummary AS
SELECT
    m.IndexId,
    m.RootId AS SourceRootId,
    m.ModulePath,
    s.Name                                                         AS EnclosingSymbolName,
    COUNT_BIG(*)                                                   AS MechanicOccurrenceCount,
    COUNT(DISTINCT m.MechanicKind)                                 AS MechanicFamilyCount,
    SUM(CASE WHEN m.MechanicKind = 'branch' THEN 1 ELSE 0 END)              AS Branches,
    SUM(CASE WHEN m.MechanicKind = 'iteration' THEN 1 ELSE 0 END)           AS Iterations,
    SUM(CASE WHEN m.MechanicKind = 'exception-handling' THEN 1 ELSE 0 END)  AS ExceptionHandling,
    SUM(CASE WHEN m.MechanicKind = 'throw' THEN 1 ELSE 0 END)               AS Throws,
    SUM(CASE WHEN m.MechanicKind = 'object-construction' THEN 1 ELSE 0 END) AS ObjectConstructions,
    SUM(CASE WHEN m.MechanicKind = 'serialization' THEN 1 ELSE 0 END)       AS Serializations,
    SUM(CASE WHEN m.MechanicKind = 'normalization' THEN 1 ELSE 0 END)       AS Normalizations,
    SUM(CASE WHEN m.MechanicKind = 'validation' THEN 1 ELSE 0 END)          AS Validations,
    SUM(CASE WHEN m.MechanicKind = 'fallback' THEN 1 ELSE 0 END)            AS Fallbacks,
    SUM(CASE WHEN m.MechanicKind = 'retry' THEN 1 ELSE 0 END)               AS Retries,
    SUM(CASE WHEN m.MechanicKind = 'state-mutation' THEN 1 ELSE 0 END)      AS StateMutations
FROM fact.ExecutableMechanic AS m
LEFT JOIN source.Symbol AS s
    ON s.SymbolKey = m.FromSymbolKey
GROUP BY m.IndexId, m.RootId, m.ModulePath, s.Name;
GO

IF OBJECT_ID('reporting.UnresolvedRelationship', 'V') IS NOT NULL DROP VIEW reporting.UnresolvedRelationship;
GO
CREATE VIEW reporting.UnresolvedRelationship AS
SELECT
    rel.IndexId,
    r.ModulePath,
    rel.RelationshipKind,
    rel.ToSymbolCandidate,
    rel.FromSymbolResolution,
    r.StartLine,
    r.StartColumn
FROM fact.Relationship AS rel
JOIN source.SourceReference AS r
    ON r.SourceReferenceKey = rel.SourceReferenceKey
WHERE rel.FromSymbolResolution = 'unresolved' OR rel.ToSymbolId IS NULL;
GO

-- Executable-mechanic observations that fall within a mechanic kind the loaded
-- workspace's own governance profile has declared forbidden for a semantic-authority
-- body, and that remain unevaluated. This is a same-scan overlap on mechanic kind,
-- not yet a proof that a specific occurrence is bound to that authority.
IF OBJECT_ID('reporting.UngovernedBody', 'V') IS NOT NULL DROP VIEW reporting.UngovernedBody;
GO
CREATE VIEW reporting.UngovernedBody AS
SELECT
    m.IndexId,
    m.RootId AS SourceRootId,
    m.ModulePath,
    s.Name                    AS EnclosingSymbolName,
    m.MechanicKind,
    m.VerificationDisposition,
    g.ProfilePath              AS GoverningProfilePath,
    g.ExecutionPortEffect,
    r.StartLine,
    r.StartColumn
FROM fact.ExecutableMechanic AS m
JOIN fact.GovernanceRule AS g
    ON g.IndexId = m.IndexId AND g.Mechanic = m.MechanicKind
JOIN source.SourceReference AS r
    ON r.SourceReferenceKey = m.SourceReferenceKey
LEFT JOIN source.Symbol AS s
    ON s.SymbolKey = m.FromSymbolKey
WHERE m.VerificationDisposition = 'OBSERVED_NOT_EVALUATED';
GO
