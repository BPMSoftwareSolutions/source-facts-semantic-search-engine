&feature:source-facts.cli-repository-projection
Feature: Persist and reconstruct a complete repository from SQL

  &scenario:source-facts.cli-repository-projection.load-current-image
  Scenario: Replace the current repository image with exact governed artifacts

    &given:governed-repository-working-tree-exists
    Given a governed repository working tree contains source, tests, scripts, contracts, documentation, and runtime manifests

    &when:load-repository-command-invoked
    When the user invokes the load-repository command for a durable root identity

    &then:current-repository-image-is-persisted
    Then every included artifact is persisted with its exact bytes, digest, path, type, and operational classification

    &and:capture-does-not-admit-semantics
    And the captured implementation remains observed rather than automatically admitted semantic authority

  &scenario:source-facts.cli-repository-projection.extract-current-image
  Scenario: Reconstruct the complete current repository without its original disk workspace

    &given:current-repository-image-is-loaded
    Given one complete current repository image is loaded in SQL Server

    &when:extract-repository-command-invoked
    When the user invokes the extract-repository command into an empty directory

    &then:complete-repository-is-reconstructed
    Then every stored directory and artifact is reconstructed solely from SQL

    &and:projected-image-digest-agrees
    And every projected byte length, content digest, and repository image digest agrees

  &scenario:source-facts.cli-repository-projection.analyze-current-image
  Scenario: Normalize repository knowledge from the SQL-backed current image

    &given:complete-current-repository-image-is-in-sql
    Given every governed repository artifact and its exact bytes are available from SQL

    &when:analyze-repository-command-invoked
    When the user invokes the analyze-repository command for the durable root identity

    &then:typed-repository-knowledge-is-persisted
    Then typed SQL, Gherkin, Markdown, JSON, package, and runtime facts are persisted as current observations

    &and:every-artifact-has-semantic-coverage
    And every artifact has an explicit projected, delegated, exact-only, binary, or failed analysis disposition
