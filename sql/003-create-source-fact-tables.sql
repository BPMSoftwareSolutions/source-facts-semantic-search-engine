-- Tables mirror the field names the engine actually emits in source-fact-index.v1
-- (see ../src/project.js and ../contracts/source-fact-index.schema.v1.json). Columns
-- are not invented ahead of real data: fields the projector does not yet populate
-- (e.g. a declared semantic-authority registry) are left out rather than stubbed.
--
-- IndexId is the content-derived sha256 identity of the whole index and is the
-- idempotency key for a load: re-loading an unchanged index is a no-op, so most
-- fact tables carry IndexId as part of their key instead of inventing a surrogate
-- "version" hash the engine does not itself produce.
--
-- Two identifiers are NOT bounded-length hashes: SourceReferenceId embeds a file's
-- relative path ("<modulePath>:<start>:<length>"), and SymbolId embeds relative
-- path + scope + name. Either can exceed SQL Server's 900-byte index key limit on a
-- large enterprise workspace, so source.SourceReference and source.Symbol are keyed
-- by a persisted SHA2_256 hash of (IndexId, naturalId) instead of the natural pair,
-- the same content-addressing approach the engine itself uses everywhere else. Every
-- fact table that references a source reference or symbol carries the matching
-- computed hash column so the foreign key is still enforced.

-- Required session-level SET options for creating indexes (including primary keys)
-- on the persisted computed hash columns below.
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;
GO

IF OBJECT_ID('fact.GovernanceRule', 'U') IS NOT NULL DROP TABLE fact.GovernanceRule;
IF OBJECT_ID('fact.Document', 'U') IS NOT NULL DROP TABLE fact.Document;
IF OBJECT_ID('fact.ExecutableMechanic', 'U') IS NOT NULL DROP TABLE fact.ExecutableMechanic;
IF OBJECT_ID('fact.DataFlow', 'U') IS NOT NULL DROP TABLE fact.DataFlow;
IF OBJECT_ID('fact.Relationship', 'U') IS NOT NULL DROP TABLE fact.Relationship;
IF OBJECT_ID('source.Symbol', 'U') IS NOT NULL DROP TABLE source.Symbol;
IF OBJECT_ID('source.SourceReference', 'U') IS NOT NULL DROP TABLE source.SourceReference;
IF OBJECT_ID('inventory.SourceFile', 'U') IS NOT NULL DROP TABLE inventory.SourceFile;
IF OBJECT_ID('inventory.Scan', 'U') IS NOT NULL DROP TABLE inventory.Scan;
GO

CREATE TABLE inventory.Scan
(
    IndexId                 varchar(120)   NOT NULL,   -- index.indexId
    ScanId                  varchar(200)   NOT NULL,   -- index.manifest.scanId
    IndexType                varchar(80)   NOT NULL,
    IndexSchemaVersion       varchar(40)   NOT NULL,
    EngineName                varchar(120) NOT NULL,
    EngineVersion              varchar(40) NOT NULL,
    WorkspaceId              nvarchar(400) NOT NULL,
    WorkspaceRoot            nvarchar(1024) NULL,
    WorkspaceRootHash         varchar(120) NOT NULL,
    LanguageId                 varchar(80) NOT NULL,
    LanguageProfileVersion     varchar(40) NULL,
    DocumentRootHash           varchar(120) NULL,
    FilesObserved       int NOT NULL,
    DeclarationCount    int NOT NULL,
    RelationshipCount   int NOT NULL,
    ControlFlowCount    int NOT NULL,
    SyntaxCount          int NOT NULL,
    UnknownSyntaxCount   int NOT NULL,
    DocumentFactCount    int NOT NULL,
    GovernanceRuleCount  int NOT NULL,
    BodyMechanicCount    int NOT NULL,
    DataflowCount        int NOT NULL,
    UnknownSyntaxRatio   decimal(9, 6) NOT NULL,
    ObservedAtUtc        datetime2(7) NOT NULL CONSTRAINT DF_Scan_ObservedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Scan PRIMARY KEY (IndexId)
);
GO

CREATE TABLE inventory.SourceFile
(
    IndexId            varchar(120)   NOT NULL,
    FileId             varchar(120)   NOT NULL,
    RelativePath       nvarchar(1024) NOT NULL,
    ContentHash        varchar(120)   NOT NULL,
    DeclarationCount   int NOT NULL,
    RelationshipCount  int NOT NULL,
    ControlFlowCount   int NOT NULL,
    SyntaxCount        int NOT NULL,
    UnknownSyntaxCount int NOT NULL,
    CONSTRAINT PK_SourceFile PRIMARY KEY (IndexId, FileId),
    CONSTRAINT FK_SourceFile_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId)
);
GO

CREATE TABLE source.SourceReference
(
    IndexId            varchar(120)   NOT NULL,
    SourceReferenceId  nvarchar(900)  NOT NULL,   -- "<modulePath>:<start>:<length>", unbounded length
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    ModulePath         nvarchar(1024) NOT NULL,
    ReferenceKind      varchar(40)    NOT NULL,   -- declaration | relationship | control-flow | syntax | structured-data
    SourceKind         varchar(80)    NULL,
    StartLine          int NOT NULL,
    StartColumn        int NOT NULL,
    EndLine            int NOT NULL,
    EndColumn          int NOT NULL,
    CONSTRAINT PK_SourceReference PRIMARY KEY (SourceReferenceKey),
    CONSTRAINT FK_SourceReference_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId)
);
CREATE INDEX IX_SourceReference_IndexId ON source.SourceReference(IndexId);
GO

CREATE TABLE source.Symbol
(
    IndexId               varchar(120)   NOT NULL,
    SymbolId              nvarchar(900)  NOT NULL,   -- "<relativePath>#<kind>:<scopePath><name>[~ordinal]", unbounded length
    SymbolKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SymbolId)) PERSISTED,
    SymbolKind            varchar(40)    NOT NULL,
    Name                  nvarchar(400)  NULL,
    ModulePath             nvarchar(1024) NOT NULL,
    SourceReferenceId       nvarchar(900) NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    DeclarationLine int NOT NULL,
    DeclarationColumn int NOT NULL,
    DeclarationHeaderHash varchar(120) NULL,
    SymbolVersionId       varchar(120) NOT NULL,
    SourceKind             varchar(80) NULL,
    ModuleHash              varchar(120) NULL,
    ScopePartsJson          nvarchar(max) NULL,   -- JSON array of strings, engine-authored ordering
    CONSTRAINT PK_Symbol PRIMARY KEY (SymbolKey),
    CONSTRAINT FK_Symbol_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_Symbol_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey),
    CONSTRAINT CK_Symbol_ScopePartsJson CHECK (ScopePartsJson IS NULL OR ISJSON(ScopePartsJson) = 1)
);
CREATE INDEX IX_Symbol_IndexId ON source.Symbol(IndexId);
GO

CREATE TABLE fact.Relationship
(
    IndexId               varchar(120)  NOT NULL,
    RelationshipId        varchar(120)  NOT NULL,
    RelationshipKind      varchar(80)   NOT NULL,
    SourceReferenceId     nvarchar(900) NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    FromSymbolId          nvarchar(900) NULL,
    FromSymbolKey AS CASE WHEN FromSymbolId IS NULL THEN NULL ELSE CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + FromSymbolId)) END PERSISTED,
    FromSymbolResolution  varchar(40)   NOT NULL,   -- enclosing-callable | unresolved
    ToSymbolId            nvarchar(900) NULL,       -- never resolved by the current engine; kept for schema fidelity
    ToSymbolCandidate     nvarchar(800) NULL,
    Operator              varchar(80)   NULL,
    -- RelationshipId alone is not reliably unique: the engine hashes it from the
    -- *enclosing* expression's start offset, so multiple distinct relationships on
    -- the same line (observed: 129 collisions in this repo's own self-analysis) can
    -- share one RelationshipId even though their SourceReferenceId (exact token
    -- location) differs. SourceReferenceKey is always distinct within a collision
    -- group, so it's included in the key rather than silently dropping rows.
    CONSTRAINT PK_Relationship PRIMARY KEY (IndexId, RelationshipId, SourceReferenceKey),
    CONSTRAINT FK_Relationship_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_Relationship_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey),
    CONSTRAINT FK_Relationship_FromSymbol FOREIGN KEY (FromSymbolKey) REFERENCES source.Symbol(SymbolKey)
);
CREATE INDEX IX_Relationship_SourceReferenceKey ON fact.Relationship(SourceReferenceKey);
CREATE INDEX IX_Relationship_FromSymbolKey ON fact.Relationship(FromSymbolKey);
GO

CREATE TABLE fact.DataFlow
(
    IndexId                    varchar(120)  NOT NULL,
    DataflowId                 varchar(120)  NOT NULL,
    DataflowKind                varchar(80)  NOT NULL,
    FromCandidate                nvarchar(800) NULL,
    FromBindingKind                varchar(80) NULL,
    ToCandidate                    nvarchar(800) NULL,
    ToBindingKind                    varchar(80) NULL,
    ToRole                             varchar(80) NULL,
    CalleeCandidate                    nvarchar(800) NULL,
    ArgumentIndex                       int NULL,
    EnclosingSymbolId          nvarchar(900) NULL,
    EnclosingSymbolKey AS CASE WHEN EnclosingSymbolId IS NULL THEN NULL ELSE CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + EnclosingSymbolId)) END PERSISTED,
    EnclosingSymbolResolution    varchar(40) NOT NULL,
    SourceReferenceId          nvarchar(900) NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    -- Same reasoning as fact.Relationship: DataflowId is hashed from a coarse anchor
    -- (relativePath + dataflowKind + toRole + start), not the exact token location,
    -- so it is not reliably unique on its own.
    CONSTRAINT PK_DataFlow PRIMARY KEY (IndexId, DataflowId, SourceReferenceKey),
    CONSTRAINT FK_DataFlow_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_DataFlow_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey),
    CONSTRAINT FK_DataFlow_EnclosingSymbol FOREIGN KEY (EnclosingSymbolKey) REFERENCES source.Symbol(SymbolKey)
);
CREATE INDEX IX_DataFlow_SourceReferenceKey ON fact.DataFlow(SourceReferenceKey);
CREATE INDEX IX_DataFlow_EnclosingSymbolKey ON fact.DataFlow(EnclosingSymbolKey);
GO

-- The key table for refactor analysis: every executable-mechanic observation the
-- engine can currently detect, still OBSERVED_NOT_EVALUATED until a governance
-- binding establishes applicability (see fact.GovernanceRule).
CREATE TABLE fact.ExecutableMechanic
(
    IndexId                   varchar(120)  NOT NULL,
    ExecutableMechanicFactId  varchar(120)  NOT NULL,
    MechanicKind              varchar(40)   NOT NULL,
    ModulePath                nvarchar(1024) NOT NULL,
    SourceReferenceId         nvarchar(900) NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    FromSymbolId               nvarchar(900) NULL,
    FromSymbolKey AS CASE WHEN FromSymbolId IS NULL THEN NULL ELSE CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + FromSymbolId)) END PERSISTED,
    EvidenceKind                varchar(80) NULL,
    Classification               varchar(80) NOT NULL,
    VerificationDisposition      varchar(80) NOT NULL,
    CONSTRAINT PK_ExecutableMechanic PRIMARY KEY (IndexId, ExecutableMechanicFactId),
    CONSTRAINT FK_ExecutableMechanic_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_ExecutableMechanic_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey),
    CONSTRAINT FK_ExecutableMechanic_FromSymbol FOREIGN KEY (FromSymbolKey) REFERENCES source.Symbol(SymbolKey),
    -- Kept in sync with the mechanic kinds src/project.js can actually emit
    -- (projectsRelationshipMechanics / projectsControlMechanics). Widen this list
    -- there first if the engine starts detecting a new kind.
    CONSTRAINT CK_ExecutableMechanic_MechanicKind CHECK (MechanicKind IN (
        'branch', 'iteration', 'exception-handling', 'throw', 'object-construction',
        'serialization', 'normalization', 'validation', 'fallback', 'retry',
        'state-mutation', 'meaning-hidden-in-text'
    ))
);
CREATE INDEX IX_ExecutableMechanic_SourceReferenceKey ON fact.ExecutableMechanic(SourceReferenceKey);
CREATE INDEX IX_ExecutableMechanic_FromSymbolKey ON fact.ExecutableMechanic(FromSymbolKey);
GO

CREATE TABLE fact.Document
(
    IndexId                varchar(120)   NOT NULL,
    DocumentFactId         varchar(120)   NOT NULL,
    DocumentFactVersionId  varchar(120)   NOT NULL,
    RelativePath           nvarchar(1024) NOT NULL,
    Pointer                nvarchar(1024) NOT NULL,   -- JSON pointer within the document
    ValueType              varchar(40)    NOT NULL,
    ValuePreview            nvarchar(400) NULL,
    ValuePathJson            nvarchar(max) NULL,       -- JSON array of pointer segments
    ScalarValueText           nvarchar(max) NULL,      -- present only for non-object/array valueType
    SourceReferenceId       nvarchar(900) NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    CONSTRAINT PK_Document PRIMARY KEY (IndexId, DocumentFactId),
    CONSTRAINT FK_Document_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_Document_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey),
    CONSTRAINT CK_Document_ValuePathJson CHECK (ValuePathJson IS NULL OR ISJSON(ValuePathJson) = 1)
);
CREATE INDEX IX_Document_SourceReferenceKey ON fact.Document(SourceReferenceKey);
GO

CREATE TABLE fact.GovernanceRule
(
    IndexId                    varchar(120)   NOT NULL,
    RuleId                     varchar(120)   NOT NULL,
    RuleType                   varchar(80)    NOT NULL,
    ProfilePath                nvarchar(1024) NOT NULL,
    PolicyPointer              nvarchar(1024) NOT NULL,
    ProfileType                 varchar(120)  NULL,
    Applicability                nvarchar(400) NULL,
    ExecutionPortEffect           varchar(120) NOT NULL,
    SemanticAuthorityLocation      varchar(120) NULL,
    Mechanic                   varchar(40)    NOT NULL,
    SourceReferenceId          nvarchar(900)  NOT NULL,
    SourceReferenceKey AS CONVERT(varbinary(32), HASHBYTES('SHA2_256', IndexId + N'|' + SourceReferenceId)) PERSISTED,
    CONSTRAINT PK_GovernanceRule PRIMARY KEY (IndexId, RuleId),
    CONSTRAINT FK_GovernanceRule_Scan FOREIGN KEY (IndexId) REFERENCES inventory.Scan(IndexId),
    CONSTRAINT FK_GovernanceRule_SourceReference FOREIGN KEY (SourceReferenceKey) REFERENCES source.SourceReference(SourceReferenceKey)
);
CREATE INDEX IX_GovernanceRule_SourceReferenceKey ON fact.GovernanceRule(SourceReferenceKey);
GO
