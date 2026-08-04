&feature:source-facts.cli-project
Feature: Project governed artifacts from authority

  &scenario:source-facts.cli-project.from-authority-declarations
  Scenario: Project executable bodies and contracts from canonical authority

    &given:canonical-authority-exists
    Given canonical authority documents exist for a declared feature

    &when:project-command-invoked
    When the user invokes the project command against the authority

    &then:artifacts-are-projected
    Then executable JSON or code projections are generated from the authority

    &and:projection-status-is-recorded
    And the projection status and any missing authority gaps are documented
