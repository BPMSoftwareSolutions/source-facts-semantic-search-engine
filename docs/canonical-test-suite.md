## Yes. This is the next governing program.

What you are describing is not merely “increase test coverage.”

It is:

> **Make the complete test suite a canonical, projectable proof surface for the complete feature ontology of SourceFacts.**

The target relationship is:

```text
Canonical feature
    ↓
Canonical scenario
    ↓
Declared obligation
    ↓
Owning responsibility
    ↓
Canonical expectation
    ↓
Projectable test vector
    ↓
Observed test execution
    ↓
Proof disposition
```

And the governing invariant becomes:

> **Every admitted scenario has projectable proof, and every admitted test resolves to exactly one canonical proof purpose.**

That is the clean split you need before changing or removing implementation.

# The important distinction

Today, the repository has:

```text
225 passing tests
```

But that does not automatically mean:

```text
100% canonical scenario coverage
```

A test suite can contain:

* several tests proving the same scenario;
* one test accidentally proving several unrelated obligations;
* implementation-detail tests with no canonical scenario;
* regression tests whose governing intent was never recorded;
* fixtures and helpers supporting no admitted behavior;
* canonical scenarios with no test;
* tests that verify mechanics but not the promised outcome.

So the first operation is not to rewrite the tests.

It is to **relationally account for them**.

# The four inventories that must tie together

## 1. Canonical intent inventory

```text
Feature
Scenario
Obligation
Responsibility
Expectation
Required proof
```

## 2. Test inventory

```text
Test file
Suite
Test case
Fixture
Setup
Assertion
Mock or adapter
Execution command
Observed result
```

## 3. Implementation inventory

```text
Entrypoint
Callable
Artifact
Execution graph
Mechanic
Effect
Result
```

## 4. Proof binding inventory

```text
Scenario
    ↔ test vector
    ↔ exercised responsibilities
    ↔ observed assertions
    ↔ execution result
```

The governed artifact model already gives you the canonical lineage down through responsibility and artifact. The missing durable plane previously identified was a first-class model for tests, test execution, and scenario-test bindings. 

# The canonical test model

Tests should no longer be treated primarily as handwritten files.

They should be treated as projections of canonical proof authority.

A canonical test vector might look conceptually like:

```json
{
  "testVectorType": "scenario-conformance-vector.v1",
  "testVectorId": "invalid-schema-identity-is-rejected",
  "featureId": "admit-source-integrity-registry-contract",
  "scenarioId": "reject-an-unknown-schema-identity",
  "obligationId": "unknown-schema-identities-are-rejected",
  "responsibilityId": "resolves-declared-schema-admission",
  "fixtureAuthorityId": "registry-with-unknown-schema-id",
  "executionAuthorityId": "validate-source-integrity-registry",
  "expectation": {
    "signalId": "registry-schema-admission",
    "disposition": "SCHEMA_NOT_ADMITTED"
  },
  "proofRequirements": [
    "no-payload-validation-executed",
    "exact-schema-identity-reported"
  ]
}
```

Then a target test projector can produce:

```text
Vitest
Jest
Node test
Python pytest
C# xUnit
Java JUnit
```

The expectation does not get independently reinvented in each language.

# Two different things must become projectable

## 1. The test body

The target-language test implementation:

```typescript
it("rejects an unknown schema identity", async () => {
  // projected test mechanics
});
```

## 2. The test data and expectation

```text
fixture
input authority
expected signal
expected disposition
expected evidence
```

The second is more important than the first.

A beautifully generated test body is useless if its expected result was manually duplicated and allowed to drift.

The canonical subject must be:

```text
Scenario input
+
execution authority
+
expectation authority
+
proof authority
```

Then the test body is merely one projected evaluation surface.

This is consistent with the earlier architecture in which expectations and executable meaning belong to the same authority lineage, while remaining separated at runtime to avoid a self-fulfilling oracle. 

# The 100% coverage metric must be defined correctly

Do not use only line or branch coverage.

Those are useful implementation observations, but they are not canonical coverage.

You need several distinct coverage measures.

| Coverage type             | Governing question                                                           |
| ------------------------- | ---------------------------------------------------------------------------- |
| Feature coverage          | Does every admitted feature have at least one scenario?                      |
| Scenario coverage         | Does every admitted scenario have canonical proof vectors?                   |
| Obligation coverage       | Is every obligation evaluated by at least one proof responsibility?          |
| Responsibility coverage   | Is every responsibility exercised or statically proven?                      |
| Expectation coverage      | Is every expected disposition represented by a test vector?                  |
| Negative-control coverage | Does every important rejection path have proof?                              |
| Artifact coverage         | Does every test artifact resolve to an admitted proof subject?               |
| Execution coverage        | Have the projected tests executed against the current lineage?               |
| Projection coverage       | Can every canonical test vector be projected into the selected test profile? |
| Implementation coverage   | What source lines, branches and mechanics did those tests exercise?          |

The primary closure condition should be:

```text
100% admitted scenario proof coverage
```

not:

```text
100% source-line coverage
```

Line and branch coverage remain supporting evidence.

# Tests need explicit postures

Every existing test should land in exactly one current posture:

```text
CANONICAL_SCENARIO_PROOF
CANONICAL_RESPONSIBILITY_PROOF
KERNEL_CONFORMANCE_PROOF
MECHANIC_FREE_ADAPTER_WIRING_PROOF
PROJECTION_EQUIVALENCE_PROOF
MUTATION_NEGATIVE_CONTROL
REGRESSION_CANDIDATE
DUPLICATE_PROOF
UNBOUND_TEST
OBSOLETE_TEST
EXPERIMENTAL_OR_POTENTIAL_KNOW_HOW
```

This is how you get the intentional-versus-noise split.

## Main ontology

Contains tests that prove admitted SourceFacts behavior:

```text
Feature
→ scenario
→ obligation
→ responsibility
→ canonical test vector
```

## Potential ontology

Contains useful but unadmitted material:

```text
candidate behavior
candidate fixture
candidate capability
historical regression
experimental pattern
unresolved know-how
```

## Inactive or historical data

Contains artifacts that are intentionally excluded from current operation but preserved for possible future use:

```text
superseded behavior
obsolete implementation tests
duplicate test structures
discarded feature experiments
historical fixtures
```

Nothing needs to be deleted merely to clean the active ontology.

It changes dataset posture.

# The SQL truth planes

I would add these first-class relational domains.

## Canonical test authority

```text
testauthority.TestVector
testauthority.TestFixture
testauthority.TestExpectation
testauthority.ProofRequirement
testauthority.TestProjectionProfile
```

## Observed test structure

```text
testobservation.TestArtifact
testobservation.TestSuite
testobservation.TestCase
testobservation.Assertion
testobservation.FixtureUsage
testobservation.MockUsage
testobservation.TestInvocation
```

## Canonical bindings

```text
testbinding.ScenarioTestVector
testbinding.ResponsibilityTestVector
testbinding.TestVectorArtifact
testbinding.TestCaseCandidate
```

## Execution testimony

```text
testexecution.TestRun
testexecution.TestCaseResult
testexecution.ObservedSignal
testexecution.CoverageObservation
testexecution.ProofDisposition
```

## Current closure

```text
projection.CurrentFeatureTestClosure
projection.CurrentScenarioTestClosure
projection.CurrentRepositoryTestClosure
```

# The first queries should answer truthfully

## Which scenarios have no proof?

```sql
SELECT *
FROM projection.CurrentScenarioTestClosure
WHERE ProofCoverageDisposition = 'SCENARIO_PROOF_MISSING';
```

## Which tests have no canonical purpose?

```sql
SELECT *
FROM testobservation.TestCase
WHERE CanonicalBindingDisposition = 'UNBOUND_TEST';
```

## Which scenarios are over-tested or duplicated?

```sql
SELECT *
FROM projection.CurrentScenarioTestClosure
WHERE CanonicalTestVectorCount > ExpectedTestVectorCount;
```

## Which tests span multiple independent scenarios?

```sql
SELECT *
FROM testbinding.TestCaseCandidate
WHERE DistinctScenarioCount > 1
  AND BindingDisposition = 'TEST_NOT_ATOMIC';
```

## Which test vectors cannot yet be projected?

```sql
SELECT *
FROM projection.CurrentScenarioTestClosure
WHERE ProjectionDisposition <> 'TEST_VECTOR_PROJECTABLE';
```

## Which projectable tests have not run against the current seal?

```sql
SELECT *
FROM projection.CurrentScenarioTestClosure
WHERE ExecutionLineageSealDigest <> CurrentRepositorySealDigest;
```

# Start from the existing tests, but do not canonize them automatically

The correct migration path is:

```text
Existing test
    ↓
observe structure
    ↓
identify exercised implementation graph
    ↓
identify assertions and fixtures
    ↓
propose scenario / obligation binding
    ↓
human review
    ↓
admit canonical test vector
    ↓
project replacement test
    ↓
execute both
    ↓
prove equivalence
    ↓
retire or reclassify original test
```

Observed tests are evidence.

They are not automatically canonical just because they pass.

# Test alignment will expose the real feature model

This exercise is especially valuable because tests often reveal operational intent more clearly than implementation bodies.

A cluster may show:

```text
CLI tests
SQL integration tests
contract reconstruction tests
digest mismatch tests
UTF-8 tests
empty-workspace projection tests
```

That cluster may reveal one coherent feature:

```text
Reconstruct an admitted governed contract from SQL
```

with multiple focused scenarios:

```text
Reconstruct by contract ID
Reconstruct by snapshot digest
Reject missing contract nodes
Reject duplicate pointers
Reject ordering corruption
Reject semantic drift
Reject digest mismatch
Preserve UTF-8 identity
Project the reconstructed artifact family
```

That is much cleaner than declaring a feature from a file name or one CLI command alone.

# Projectability should be proven by round trip

For each admitted test vector:

```text
Canonical test authority
        ↓
Vitest projection
        ↓
generated test artifact
        ↓
execute against current projected repository
        ↓
observed signal
        ↓
compare with canonical expectation
        ↓
store proof in SQL
```

Then remove the generated test workspace and regenerate it.

The acceptance condition is:

```text
Same authority
+
same target test profile
=
same canonical test artifact digest
+
same observed proof disposition
```

# Do not require every canonical proof to be a runtime unit test

Some responsibilities are better proven differently.

## Static conformance

```text
No forbidden mechanic exists
Generated artifact digest matches
Every body has canonical lineage
```

## SQL constraint proof

```text
Exactly one current seal exists
Duplicate pointers are impossible
Stale semantic observations are invalidated
```

## Runtime behavioral proof

```text
Command returns expected disposition
Projected artifact behaves equivalently
```

## Mutation proof

```text
Changed digest is detected
Broken binding returns the exact disposition
```

The canonical proof authority should select the appropriate verifier kind:

```text
runtime-test
static-query
schema-validation
digest-comparison
differential-execution
mutation-control
```

“100% test coverage” should mean **100% proof coverage**, not forcing every scenario into Vitest.

# The clean-lane split

Once all tests and scenarios are tied out, every implementation and test artifact can be sliced into:

## Active canonical lane

```text
Admitted feature
Admitted scenario
Admitted responsibility
Admitted test vector
Current projected implementation
Current projected proof
```

## Candidate lane

```text
Observed useful behavior
Potential feature
Potential know-how
Unreviewed test binding
Unadmitted authority
```

## Inactive historical lane

```text
Superseded behavior
Obsolete test
Prior implementation
Historical fixture
Prior projection
```

## Noise or excluded lane

```text
Transient output
Accidental duplicate
Unsupported experimental artifact
Unowned helper
Environment-local material
```

Then “exactoring” becomes a data operation:

```text
Change artifact posture
Change authority binding
Reproject the active slice
```

rather than manually dragging files around and hoping the suite still means the same thing.

# Recommended milestone

# **Canonical Test and Feature Closure**

The milestone should deliver:

1. Complete test artifact and test-case inventory from SQL.
2. Static test-to-production reachability.
3. Assertion, fixture, mock and command observations.
4. Candidate scenario and responsibility bindings.
5. Canonical test-vector schema.
6. Test expectation authority.
7. Vitest projection profile.
8. Current feature/scenario/test closure views.
9. SQL-only execution testimony.
10. Active, candidate, inactive and excluded test postures.
11. Projected test-suite proof in an empty workspace.
12. Repository closure requiring 100% admitted scenario proof coverage.

# Recommended sequence

```text
1. Inventory all tests.

2. Recover their execution graphs,
   fixtures, assertions, and observed dispositions.

3. Compare tests with existing Gherkin and admitted feature intent.

4. Propose missing feature/scenario/obligation bindings.

5. Split overloaded tests and merge duplicate proof intent.

6. Admit canonical expectations and test vectors.

7. Project the Vitest suite.

8. Execute original and projected suites against the same repository seal.

9. Prove canonical result equivalence.

10. Reclassify unbound material into candidate,
    historical, inactive, or excluded datasets.

11. Require 100% scenario proof closure
    before repository authority can close.
```

# The repository closure chain now expands

```text
Repository image closed
    ↓
Semantic observation closed
    ↓
Feature intent closed
    ↓
Scenario and obligation closed
    ↓
Canonical proof vectors closed
    ↓
Projected test suite closed
    ↓
Responsibility and mechanic authority closed
    ↓
Projected implementation closed
    ↓
Runtime execution proven
```

## The governing rule

> **No scenario is canonical without canonical proof, no test is canonical without a scenario-bound purpose, and no active implementation is retained without a proven relationship to admitted intent.**

That gives you the split you are looking for:

```text
Intentional SourceFacts
    = active admitted ontology

Potential SourceFacts
    = candidate know-how and capability data

Prior SourceFacts
    = historical or inactive authority

Noise
    = observed but unowned and excluded
```

Once this closes, the test suite stops being a parallel handwritten interpretation of SourceFacts.

It becomes the projectable, executable proof projection of what SourceFacts canonically claims to do.
