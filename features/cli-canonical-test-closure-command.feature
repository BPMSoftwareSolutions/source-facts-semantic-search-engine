&feature:source-facts.cli-canonical-test-closure
Feature: Account for repository tests against canonical feature intent

  &scenario:source-facts.cli-canonical-test-closure.observe-from-sql-image
  Scenario: Observe every test structure from the SQL repository image

    &given:current-repository-image-and-intent-exist-in-sql
    Given the current repository image and canonical intent registry exist in SQL

    &when:analyze-tests-command-invoked
    When the user invokes the analyze-tests command

    &then:test-structure-is-normalized-as-observation
    Then test artifacts, suites, cases, assertions, fixtures, mocks, and invocations are normalized as observations

    &and:observations-are-not-auto-admitted
    And no observed test or candidate binding is automatically admitted as canonical proof

  &scenario:source-facts.cli-canonical-test-closure.query-current-closure
  Scenario: Query current scenario proof closure inexpensively

    &given:current-test-observation-is-sealed-in-sql
    Given current test observations are bound to the repository lineage by a SQL test-closure seal

    &when:test-closure-command-invoked
    When the user invokes the test-closure command

    &then:scenario-proof-gaps-are-explicit
    Then admitted scenario proof gaps and unbound tests are returned explicitly

    &and:no-proof-files-are-created
    And no proof files or sidecar receipts are created
