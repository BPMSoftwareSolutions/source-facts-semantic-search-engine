&feature:source-facts.cli-sync-self-governance
Feature: Sync self-governance to the database

  &scenario:source-facts.cli-sync-self-governance.generate-and-sync
  Scenario: Generate the report and load canonical governance snapshots

    &given:self-governance-inputs-and-sql-connection-ready
    Given a workspace, canonical governance sources, and a SQL Server connection are available

    &when:sync-self-governance-command-invoked
    When the user invokes the sync-self-governance command

    &then:self-governance-report-is-written
    Then the self-governance report is generated and written to disk

    &and:canonical-governance-snapshots-are-loaded
    And the governed contract and canonical intent registry are loaded into the database
