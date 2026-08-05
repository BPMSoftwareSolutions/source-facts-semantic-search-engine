# Trustworthy Enterprise Data Loop

## Yes. Let’s pull this back to the actual objective.

The objective right now is **not** to perfect every proof abstraction, authority family, or vector model.

It is to establish a trustworthy enterprise data loop:

```text
Observe what exists
    ↓
Establish identity and meaning
    ↓
Separate intentional capability from fat/noise
    ↓
Project the intentional slice
    ↓
Use the resulting facts to choose the next transformation
```

That is the center.

# What we are trying to establish

For SourceFacts, we need one clean, queryable model:

```text
Application
└── Capability
    └── Feature
        └── Scenario
            └── Obligation
                └── Responsibility
                    ├── Implementation artifacts
                    ├── Tests
                    └── Proof
```

Then every active artifact in the repository should answer:

```text
What capability does this support?
Which feature and scenario own it?
What responsibility does it embody?
Which tests prove that scenario or responsibility?
Can the artifact and its tests be projected?
Is it intentional, candidate, historical, or noise?
```

That identity is what allows enterprise data to flow in without becoming another pile of unclassified material.

# The immediate test-suite goal

The simple governing goal is:

> **Every admitted scenario must be canonically tied to sufficient tests, and those tests must be projectable.**

That does **not** mean one test per scenario mechanically.

It means:

```text
Every scenario
    ↓
has declared expected behavior
    ↓
has sufficient canonical test coverage
    ↓
has projectable test authority
    ↓
can execute and prove the scenario
```

So the closure question is straightforward:

```text
How many canonical scenarios exist?
How many have sufficient test coverage?
How many tests are projectable?
How many scenarios remain unproven?
```

We should be able to query those facts directly.

# What about the remaining 200-plus tests?

This is now the most important analysis queue.

We currently know there are hundreds of physical tests, but most are not yet bound to canonical meaning. That does **not** mean they are bad. It means their role is unresolved.

Each observed test needs to be classified into a meaningful enterprise posture.

## The first-pass classification

```text
SCENARIO_TEST
    Proves a canonical scenario outcome.

RESPONSIBILITY_TEST
    Proves one responsibility beneath a scenario.

INTEGRATION_TEST
    Proves several canonical responsibilities compose.

KERNEL_TEST
    Proves generic semantic/runtime machinery.

ADAPTER_TEST
    Proves filesystem, SQL, parser, network, or other mechanics.

PROJECTION_TEST
    Proves authority projects into the expected artifact.

EQUIVALENCE_TEST
    Compares semantic execution with projected execution.

REGRESSION_EVIDENCE
    Captures behavior whose canonical intent is not yet defined.

DUPLICATE_TEST
    Repeats proof already supplied elsewhere.

POTENTIAL_CAPABILITY
    Reveals useful behavior not currently part of admitted SourceFacts.

HISTORICAL_OR_INACTIVE
    Preserved knowledge that is not part of the current product.

NOISE_OR_UNRESOLVED
    Has no established active purpose yet.
```

That is the slice we need.

We are not trying to force all 232 tests directly beneath seven scenarios. Some may prove infrastructure. Some may expose missing scenarios. Some may reveal separate capabilities. Some may simply be fat.

# The tests are evidence for discovering the real capability model

This is important: the existing Gherkin inventory may not yet represent everything SourceFacts operationally does.

So we need to analyze from both directions:

```text
Canonical scenarios
    ↓
Which tests prove them?

Existing tests
    ↓
Which capability, feature, scenario,
responsibility, or infrastructure concern do they reveal?
```

That gives us two fact sets:

## Missing proof

```text
Scenario exists
but sufficient tests do not.
```

## Missing intent

```text
Tests and operational behavior exist
but no canonical scenario currently owns them.
```

Both should produce backlog items.

# The next milestone should be clarity, not 7/7 by force

The correct immediate milestone is not simply:

```text
Get seven scenarios green.
```

It should be:

# **Canonical Test Meaning Coverage**

That means every observed test receives a reviewed posture.

Example result:

```text
Observed tests:                      232

Bound to canonical scenarios:        48
Bound to responsibilities:           72
Kernel and adapter conformance:       54
Projection/equivalence proof:         18
Candidate missing feature intent:     21
Duplicate or superseded:              11
Unresolved:                            8
```

Those numbers are illustrative, but that is the shape of the answer we need.

Then we know what SourceFacts actually contains.

# The facts should drive the next priority

You said the most important thing:

> What do the facts say today, and what do we want the facts to say in the next iteration?

That should become the transformation loop.

## Current-state facts

```text
How many operational capabilities exist?
How many features and scenarios are admitted?
How many tests exist?
How many tests have canonical meaning?
How many scenarios have sufficient proof?
How many artifacts are intentional?
How many are candidates, inactive, duplicate, or unresolved?
How much of the active slice is projectable?
```

## Target-state facts for the next iteration

Example:

```text
Today:
232 tests
14 candidate bindings
215 unbound
1 of 7 scenarios closed

Next iteration:
232 tests classified
0 tests without a posture
all 7 scenarios have a declared test requirement
at least 3 scenarios fully proven
all canonical vectors projectable
candidate capability backlog generated
```

That is a concrete iteration.

# The active ontology versus the backlog

Your data should separate into deliberate lanes.

## Active enterprise ontology

What SourceFacts intentionally supports now:

```text
Admitted capabilities
Admitted features
Admitted scenarios
Admitted responsibilities
Current implementation
Canonical tests
Current proof
```

## Candidate capability backlog

Useful observed behavior that may become part of SourceFacts:

```text
Potential feature
Potential scenario
Potential shared capability
Potential know-how
Potential reusable test vector
```

## Historical or inactive knowledge

```text
Superseded behavior
Prior implementations
Old tests
Deprecated scripts
Former authority
```

## Noise or excluded material

```text
Transient outputs
Accidental duplication
Unowned helpers
Environment-local files
Unsupported experiments
```

The key point is that we do not have to delete potentially useful knowledge.

We remove it from the **active ontology** and retain it in a different data posture.

# Where “vectors” fit—and where they do not

Vectors are useful, but they are not the primary business language.

A vector is simply:

```text
One declared scenario input
+
one expected result
+
one executable proof case
```

That helps project tests and prove different behavior classes.

But the language we should emphasize is:

```text
Capability
Feature
Scenario
Obligation
Responsibility
Expectation
Test
Proof
```

Vectors are implementation units beneath that model.

They should not obscure what we are trying to learn:

> What does SourceFacts intentionally do, and how do we know it works?

# What should happen next

## 1. Freeze the currently observed test inventory

We already have the SQL-origin inventory. Preserve its image and test-analysis digests.

## 2. Produce a test-meaning classification query

For every test case, return:

```text
Test identity
Observed invocation
Assertions
Fixtures
Candidate feature
Candidate scenario
Candidate responsibility
Recommended proof type
Current posture
Confidence/evidence
Review disposition
```

## 3. Review the highest-confidence clusters first

Group tests by:

```text
CLI command
called production responsibility
asserted disposition
database objects touched
fixture family
test title vocabulary
source module
```

This will expose coherent capability clusters quickly.

## 4. Compare the clusters against canonical Gherkin

For each cluster:

```text
Existing scenario found
    → bind tests and determine sufficient coverage

No scenario found
    → create a feature/scenario candidate backlog item

Multiple scenarios found
    → resolve ambiguity or split the test

Duplicate proof found
    → classify duplicate or historical
```

## 5. Define sufficient test coverage per scenario

Not every scenario needs the same number of tests.

For each scenario, declare:

```text
Required positive cases
Required rejection cases
Required boundary cases
Required mutation controls
Required integration proof
```

## 6. Project the canonical suite

Once the meaning is reviewed:

```text
Canonical feature/scenario authority
    ↓
canonical test authority
    ↓
projected Vitest suite
```

## 7. Move non-active material out of the main ontology

No need to physically delete immediately.

Change its SQL posture:

```text
ACTIVE_CANONICAL
CANDIDATE
INACTIVE
HISTORICAL
EXCLUDED
```

# The enterprise-level payoff

Once this stabilizes, you can pump additional applications and repositories into the same model.

Each application enters as:

```text
Repository image
    ↓
artifact inventory
    ↓
semantic observations
    ↓
capability and feature candidates
    ↓
test meaning
    ↓
reviewed enterprise ontology
    ↓
projectable active slice
```

Then SourceFacts becomes the transformation engine:

```text
Facts identify current state
Facts expose ambiguity and fat
Facts generate the backlog
Authority defines the target state
Projection performs the transformation
Facts prove the new state
```

# The next concrete dashboard—or preferably SQL view

The primary query result should be something like:

| Metric                                     | Current |                    Next target |
| ------------------------------------------ | ------: | -----------------------------: |
| Observed tests                             |     232 |                            232 |
| Tests with reviewed posture                |      17 |                            232 |
| Active canonical tests                     |       1 |                TBD from review |
| Canonical scenarios                        |       7 | Updated from discovered intent |
| Scenarios with declared proof requirements |       1 |                           100% |
| Scenarios proof-closed                     |       1 |          Next selected tranche |
| Candidate missing scenarios                | Unknown |              Fully inventoried |
| Duplicate/inactive tests                   | Unknown |               Fully classified |
| Projectable canonical tests                |       1 |           100% of active suite |
| Unresolved tests                           |     215 |                              0 |

That is the fact-driven work queue.

## The governing focus

> **First establish identity and meaning for every observed test. Then use those facts to determine the true canonical scenario inventory, the active test suite, the capability backlog, and the material that belongs outside the main ontology.**

The near-term goal is not to solve every future enterprise-governance concern.

It is:

```text
Know what we have
    ↓
know what it means
    ↓
know what belongs
    ↓
know what is proven
    ↓
know what can be projected
    ↓
let those facts determine the next slice
```

That is the streamlining foundation.
