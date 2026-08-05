&feature:source-facts.cli-repository-lineage-seal
Feature: Seal and validate repository lineage in SQL

  &scenario:source-facts.cli-repository-lineage-seal.refresh-from-database-origin
  Scenario: Seal current repository lineage without disk proof artifacts

    &given:repository-image-analysis-and-intent-are-current-in-sql
    Given the repository image, semantic analysis, and canonical feature intent are current in SQL

    &when:seal-repository-command-invoked
    When the user invokes the seal-repository command

    &then:lineage-digest-is-stored-in-sql
    Then one current lineage digest binding those identities is stored in SQL

    &and:no-disk-proof-receipt-is-created
    And no disk proof receipt is created

  &scenario:source-facts.cli-repository-lineage-seal.validate-current-closure
  Scenario: Validate current lineage through one inexpensive SQL closure query

    &given:repository-lineage-seal-exists-in-sql
    Given a current repository lineage seal exists in SQL

    &when:validate-repository-seal-command-invoked
    When the user invokes the validate-repository-seal command

    &then:current-identities-and-seal-are-compared
    Then current database identities and the stored seal are compared

    &and:governance-completeness-remains-explicit
    And cryptographic integrity remains separate from governance completeness
