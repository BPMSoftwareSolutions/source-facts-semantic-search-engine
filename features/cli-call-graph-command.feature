&feature:source-facts.cli-call-graph
Feature: Project call graph from CLI interface surface

  &scenario:source-facts.cli-call-graph.from-entry-point
  Scenario: Project reachable callables from a CLI entry point

    &given:validated-source-index
    Given a validated SourceFacts index containing callable and relationship facts

    &when:call-graph-projection-requested
    When the call graph is projected from a declared CLI entry point

    &then:reachable-callables-returned
    Then every statically resolvable callable is included in the reachable execution slice

    &and:unresolved-edges-classified
    And every unresolved runtime-sensitive edge receives an explicit disposition
