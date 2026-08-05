&feature:source-facts.cli-extract-contract
Feature: Extract an admitted contract from SQL authority

  &scenario:source-facts.cli-extract-contract.reconstruct-from-normalized-authority
  Scenario: Reconstruct a complete contract without reading a disk authority

    &given:canonical-contract-document-and-normalized-nodes-are-loaded
    Given canonical contract bytes and the complete normalized authority-node tree are loaded in SQL Server

    &when:extract-contract-command-invoked
    When the user invokes the extract-contract command for an admitted contract identity

    &then:contract-is-reconstructed-from-sql
    Then the complete semantic contract is reconstructed from normalized SQL authority

    &and:canonical-and-normalized-digests-agree
    And its canonical bytes, normalized tree, and admitted snapshot digest agree
