&feature:source-facts.cli-operational-execution-knowledge
Feature: Navigate current operational execution knowledge from SQL

  &scenario:source-facts.cli-operational-execution-knowledge.analyze-from-sql-image
  Scenario: Analyze complete execution mechanics and reachability from the SQL repository image

    &given:current-sql-repository-image-exists
    Given one current repository image exists in SQL

    &when:analyze-execution-command-invoked
    When the user invokes the analyze-execution command

    &then:mechanics-and-call-graph-persisted
    Then complete source mechanics and callable reachability are persisted against the current image digest

    &and:observation-does-not-admit-authority
    And observed reachability, applicability, and candidate authority remain unadmitted

  &scenario:source-facts.cli-operational-execution-knowledge.query-current-graph
  Scenario: Query current operational execution knowledge inexpensively

    &given:current-execution-analysis-exists
    Given execution analysis matching the current repository image exists in SQL

    &when:execution-knowledge-command-invoked
    When the user invokes the execution-knowledge command

    &then:reachability-and-authority-gaps-returned
    Then interface, responsibility, test, and authority reachability gaps are returned directly

    &and:no-source-workspace-is-read
    And the original source workspace is not read and no report sidecar is created
