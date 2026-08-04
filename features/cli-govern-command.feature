&feature:source-facts.cli-govern
Feature: Govern SourceFacts workspace and generate compliance report

  &scenario:source-facts.cli-govern.scan-and-report
  Scenario: Scan workspace and generate self-governance report

    &given:workspace-contains-authority
    Given a workspace containing SourceFacts authority documents and source code

    &when:govern-command-invoked
    When the user invokes the govern command on the workspace

    &then:report-is-generated
    Then a comprehensive self-governance report is generated with feature coverage and scenario conformance

    &and:lineage-quality-findings-identified
    And lineage-quality findings and evaluation limits are explicitly documented
