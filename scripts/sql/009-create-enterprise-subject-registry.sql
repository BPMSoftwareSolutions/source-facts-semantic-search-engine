IF OBJECT_ID('enterprise.SubjectRelationship', 'U') IS NOT NULL DROP TABLE enterprise.SubjectRelationship;
IF OBJECT_ID('enterprise.Subject', 'U') IS NOT NULL DROP TABLE enterprise.Subject;
GO

CREATE TABLE enterprise.Subject
(
    SubjectType nvarchar(40) NOT NULL,
    SubjectId nvarchar(400) NOT NULL,
    EnterpriseId nvarchar(160) NULL,
    PortfolioId nvarchar(160) NULL,
    DomainId nvarchar(160) NULL,
    ApplicationId nvarchar(160) NULL,
    CapabilityId nvarchar(160) NULL,
    RepositoryId nvarchar(400) NULL,
    WorkspaceId nvarchar(400) NULL,
    ContextAuthorityId nvarchar(160) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    LoadedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_EnterpriseSubject_LoadedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_EnterpriseSubject PRIMARY KEY (SubjectType, SubjectId)
);

CREATE TABLE enterprise.SubjectRelationship
(
    FromSubjectType nvarchar(40) NOT NULL,
    FromSubjectId nvarchar(400) NOT NULL,
    ToSubjectType nvarchar(40) NOT NULL,
    ToSubjectId nvarchar(400) NOT NULL,
    RelationshipType nvarchar(80) NOT NULL,
    EnterpriseId nvarchar(160) NULL,
    PortfolioId nvarchar(160) NULL,
    DomainId nvarchar(160) NULL,
    ApplicationId nvarchar(160) NULL,
    CapabilityId nvarchar(160) NULL,
    RepositoryId nvarchar(400) NULL,
    WorkspaceId nvarchar(400) NULL,
    ContextAuthorityId nvarchar(160) NULL,
    AuthorityDigest varchar(80) NOT NULL,
    LoadedAtUtc datetime2(7) NOT NULL CONSTRAINT DF_EnterpriseSubjectRelationship_LoadedAtUtc DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_EnterpriseSubjectRelationship PRIMARY KEY (FromSubjectType, FromSubjectId, ToSubjectType, ToSubjectId, RelationshipType),
    CONSTRAINT FK_EnterpriseSubjectRelationship_From FOREIGN KEY (FromSubjectType, FromSubjectId) REFERENCES enterprise.Subject(SubjectType, SubjectId),
    CONSTRAINT FK_EnterpriseSubjectRelationship_To FOREIGN KEY (ToSubjectType, ToSubjectId) REFERENCES enterprise.Subject(SubjectType, SubjectId)
);
GO
