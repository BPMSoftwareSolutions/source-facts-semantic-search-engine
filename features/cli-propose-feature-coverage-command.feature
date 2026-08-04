&feature:source-facts.cli-propose-feature-coverage
Feature: Propose feature coverage from source evidence

  &scenario:source-facts.cli-propose-feature-coverage.discover-candidate-features
  Scenario: Discover and propose feature candidates from unresolved evidence clusters

    &given:source-facts-index-available
    Given a validated SourceFacts index with source facts and call graph data

    &when:propose-feature-coverage-command-invoked
    When the user invokes the propose-feature-coverage command

    &then:feature-candidates-are-proposed
    Then feature coverage proposals are generated from responsibility evidence clusters

    &and:proposals-retain-lineage
    And each proposal retains evidence lineage to its source facts and mechanics

  &scenario:source-facts.cli-propose-feature-coverage.evaluate-with-llm-inference
  Scenario: Evaluate feature proposals with live LLM inference

    &given:feature-candidates-proposed
    Given feature coverage proposals have been discovered from static evidence

    &when:inference-evaluation-requested
    When the user invokes inference evaluation on the proposed candidates

    &then:llm-evaluations-are-recorded
    Then live model inference results are recorded as observational discovery evidence

    &and:inference-does-not-admit-features
    And inference results remain observational and do not automatically admit features
