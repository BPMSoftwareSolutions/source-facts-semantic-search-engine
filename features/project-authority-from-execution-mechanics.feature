&feature:source-facts.project-authority-from-execution-mechanics
Feature: Project authority data from observed execution mechanics

  &scenario:source-facts.classify-mechanic-authority-family
  Scenario: Classify the authority family for one observed execution mechanic
    &given:observed-mechanic-available
    Given one observed execution mechanic
    &when:authority-family-classified
    When its authority family is classified
    &then:one-family-or-unsupported-returned
    Then one canonical authority family or explicit unsupported disposition is returned

  &scenario:source-facts.project-mechanic-authority-data
  Scenario: Project authority data for one classified execution mechanic
    &given:classified-mechanic-context-available
    Given one classified execution mechanic and its available context
    &when:authority-data-projected
    When authority data is projected
    &then:standard-candidate-row-returned
    Then one standard non-admitted authority-data result is returned with every unavailable semantic value named

  &scenario:source-facts.query-mechanic-authority-projections
  Scenario: Query authority projections for observed execution mechanics
    &given:observed-mechanics-exist
    Given observed execution mechanics exist for a declared scope
    &when:authority-projections-queried
    When their authority projections are queried
    &then:native-authority-rows-returned
    Then matching authority-data rows are returned directly without a report receipt sidecar or second command

  &scenario:source-facts.persist-projected-mechanic-authority
  Scenario: Persist reviewed mechanic authority data
    &given:reviewed-envelope-available
    Given a reviewed schema-valid mechanic authority envelope
    &when:authority-admitted-and-loaded
    When the authority is admitted and loaded
    &then:authority-and-occurrence-persisted
    Then it is stored under canonical lineage with the original occurrence queryably connected

  &scenario:source-facts.query-complete-responsibility-authority
  Scenario: Query the complete authority for one responsibility
    &given:responsibility-authority-admitted
    Given every applicable mechanic owned by a responsibility has admitted authority data
    &when:responsibility-projection-queried
    When the responsibility projection is queried
    &then:closed-ordered-slice-returned
    Then one complete ordered execution-authority result is returned with no unresolved mechanic

  &scenario:source-facts.project-body-from-responsibility-authority
  Scenario: Project an execution body from complete responsibility authority
    &given:closed-slice-and-supported-profile
    Given a complete responsibility authority query result and a target profile supporting every required operation
    &when:language-projector-applied
    When the selected language projector is applied
    &then:executable-body-projected
    Then one executable body is projected without independently authored forbidden mechanic meaning

  &scenario:source-facts.prove-projected-body-equivalence
  Scenario: Prove the projected body against declared authority
    &given:authority-and-projected-body-available
    Given an admitted authority slice and its projected execution body
    &when:semantic-and-projected-execution-evaluated
    When semantic and projected execution are evaluated with the same input
    &then:results-effects-and-terminals-equal
    Then declared results ordered effects and terminal dispositions are equal or identify the failing layer
