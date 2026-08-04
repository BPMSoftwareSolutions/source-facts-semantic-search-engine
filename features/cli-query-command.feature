&feature:source-facts.cli-query
Feature: Query SourceFacts semantic search console

  &scenario:source-facts.cli-query.from-command-line
  Scenario: Execute a semantic query from CLI

    &given:source-index-available
    Given a validated SourceFacts index is available

    &when:query-command-invoked
    When the user invokes the query command with a search expression

    &then:matching-facts-returned
    Then matching source facts are returned in canonical order

    &and:unresolved-symbols-classified
    And any unresolved symbols receive an explicit disposition
