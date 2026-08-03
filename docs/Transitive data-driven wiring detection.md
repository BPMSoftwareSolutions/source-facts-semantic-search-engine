Yes — the feature needs an explicit **report-projection scenario** so the transitive resolution is not implemented invisibly beneath the report.

The current report expressly describes wiring as “one hop only” and currently reports only direct wiring fields, so the feature is incomplete until that analytics surface changes. 

Add this scenario:

```gherkin
  Scenario: Display transitive data-driven wiring analytics in the governance report
    Given direct and transitive data-driven wiring have been resolved for every
      file with observed mechanics
    When the source-facts self-governance report is projected
    Then the Data-Driven Wiring section reports separate counts for files with
      direct wiring, transitive wiring, no determined wiring, and wiring not
      determined beyond the maximum traversal depth
    And each transitively wired file identifies its wiring disposition,
      evidence-providing file, hop count, and complete local hop path
```

That is the tight atomic scenario. I would then add a second focused scenario for preserving the report’s direct/transitive distinction:

```gherkin
  Scenario: Preserve direct and transitive wiring evidence separately in the report
    Given a file has no direct contract or runtime import
    And the file reaches contract or runtime evidence through one or more local
      import hops
    When its Data-Driven Wiring report row is projected
    Then its direct importsContractData and invokesSemanticRuntime values remain false
    And its transitive contract paths, transitive runtime paths, and hop path are
      displayed as separate evidence
```

## Recommended complete feature

```gherkin
Feature: Transitive data-driven wiring detection
  # Extends resolves-data-driven-wiring.js beyond its current one-hop limit.
  # Today a file is only marked wired if it directly imports a JSON contract
  # (import ... from "*.json") or a known semantic-execution runtime module.
  # A file that imports a local helper which itself imports the runtime is
  # invisible to that check today, even though it is one hop from governed.

  Background:
    Given the source-fact-index for the workspace already contains "dependency"
      relationships resolved to their owning file via sourceReferenceId
    And direct wiring detection (importsContractData / invokesSemanticRuntime)
      continues to run unchanged as the base case of this resolution

  Scenario: Detect wiring through one local import hop
    Given file "A.mjs" has no direct import of a JSON contract or a semantic
      execution runtime
    And file "A.mjs" imports local file "B.mjs" via a relative specifier
    And file "B.mjs" directly imports a JSON contract and a semantic execution
      runtime
    When data-driven wiring is resolved for file "A.mjs"
    Then file "A.mjs" is reported with wiring disposition
      "TRANSITIVE_DATA_AND_RUNTIME"
    And the report attributes that evidence to file "B.mjs" by name
    And file "A.mjs" is never conflated with a file that imports the contract
      or runtime directly

  Scenario: Only follow local relative-path specifiers as hops
    Given file "A.mjs" imports a bare package specifier that is not a relative path
    When resolving A's transitive wiring
    Then that import is not followed as a local hop
    And it is still evaluated as a candidate for A's own direct evidence

  Scenario: Terminate safely on an import cycle
    Given file "A.mjs" imports file "B.mjs"
    And file "B.mjs" imports file "A.mjs"
    When resolving transitive wiring starting from "A.mjs"
    Then resolution completes without infinite recursion
    And each file's own direct evidence is still reported correctly

  Scenario: Cap traversal depth
    Given a chain of locally imported files longer than the configured maximum
      hop count
    When resolving transitive wiring
    Then traversal stops at the maximum depth
    And files beyond that depth are reported as
      "NOT_DETERMINED_BEYOND_MAX_DEPTH"
      rather than silently reported as "NONE"

  Scenario: Preserve the existing direct-only fields and add transitive ones
    Given the current dataDrivenWiring entry shape includes importsContractData,
      invokesSemanticRuntime, and wiringDisposition
    When transitive resolution is added
    Then importsContractData and invokesSemanticRuntime continue to mean direct
      evidence found in the file's own import statements
    And transitiveContractPaths, transitiveRuntimePaths, and hopPath carry the
      transitive evidence separately
    And every existing test in self-governance-report.test.js for direct detection
      continues to pass unchanged

  Scenario: Display transitive data-driven wiring analytics in the governance report
    Given direct and transitive data-driven wiring have been resolved for every
      file with observed mechanics
    When the source-facts self-governance report is projected
    Then the Data-Driven Wiring section reports separate counts for files with
      direct wiring, transitive wiring, no determined wiring, and wiring not
      determined beyond the maximum traversal depth
    And each transitively wired file identifies its wiring disposition,
      evidence-providing file, hop count, and complete local hop path

  Scenario: Preserve direct and transitive wiring evidence separately in the report
    Given a file has no direct contract or runtime import
    And the file reaches contract or runtime evidence through one or more local
      import hops
    When its Data-Driven Wiring report row is projected
    Then its direct importsContractData and invokesSemanticRuntime values remain false
    And its transitive contract paths, transitive runtime paths, and hop path are
      displayed as separate evidence
```

## Report analytics this scenario should drive

The report summary should evolve from:

```text
3 of 50 files have some direct wiring
```

into something like:

| Wiring posture              | Files | Share |
| --------------------------- | ----: | ----: |
| Direct data and runtime     |     1 |  2.0% |
| Direct runtime only         |     2 |  4.0% |
| Transitive data and runtime |     8 | 16.0% |
| Transitive runtime only     |     6 | 12.0% |
| None determined             |    31 | 62.0% |
| Beyond maximum depth        |     2 |  4.0% |

And the drill-down should make the causal path visible:

| File    | Wiring                            | Direct evidence | Transitive evidence  | Hops | Hop path                             |
| ------- | --------------------------------- | --------------- | -------------------- | ---: | ------------------------------------ |
| `A.mjs` | `TRANSITIVE_DATA_AND_RUNTIME`     | —               | `B.mjs`              |    1 | `A.mjs → B.mjs`                      |
| `C.mjs` | `TRANSITIVE_RUNTIME_ONLY`         | —               | `runtime-helper.mjs` |    2 | `C.mjs → B.mjs → runtime-helper.mjs` |
| `D.mjs` | `NOT_DETERMINED_BEYOND_MAX_DEPTH` | —               | —                    |   3+ | traversal capped                     |

That makes the analytics honest:

```text
Direct wiring
    ≠
Transitive wiring
    ≠
No wiring
    ≠
Wiring not fully determined
```

And it gives the remediation report a much stronger signal: a file with transitive wiring already has a nearby authority path that may be reusable, while a file with no determined wiring likely needs a new authority home or explicit adapter/kernel classification.
