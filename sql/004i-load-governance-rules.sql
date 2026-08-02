SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER PROCEDURE ingestion.LoadGovernanceRules
    @IndexId varchar(120),
    @GovernanceRulesJson nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO fact.GovernanceRule (IndexId, RuleId, RuleType, ProfilePath, PolicyPointer, ProfileType, Applicability, ExecutionPortEffect, SemanticAuthorityLocation, Mechanic, SourceReferenceId)
    SELECT @IndexId, RuleId, RuleType, ProfilePath, PolicyPointer, ProfileType, Applicability, ExecutionPortEffect, SemanticAuthorityLocation, Mechanic, SourceReferenceId
    FROM OPENJSON(@GovernanceRulesJson) WITH (
        RuleId                     varchar(120)   '$.ruleId',
        RuleType                   varchar(80)    '$.ruleType',
        ProfilePath                nvarchar(1024) '$.profilePath',
        PolicyPointer              nvarchar(1024) '$.policyPointer',
        ProfileType                varchar(120)   '$.profileType',
        Applicability               nvarchar(400) '$.applicability',
        ExecutionPortEffect        varchar(120)   '$.executionPortEffect',
        SemanticAuthorityLocation  varchar(120)   '$.semanticAuthorityLocation',
        Mechanic                   varchar(40)    '$.mechanic',
        SourceReferenceId          nvarchar(900)  '$.sourceReferenceId'
    );

    SELECT COUNT(*) AS RecordCount FROM fact.GovernanceRule WHERE IndexId = @IndexId;
END
GO
