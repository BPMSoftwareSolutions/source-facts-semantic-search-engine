That question is exposing a **real dependency**, but the proposed choices are too fragmented.

The agent is treating the empty intersection as a reason to choose another analytical side quest:

```text
reachable body ∩ rich authority = ∅
```

That observation is useful. But the answer is **not**:

* build a placeholder classifier;
* build a matcher guaranteed to return zero matches;
* investigate orphaning without completing the healing path.

You said you do not want partial work. So the next capability must **create the overlap and carry it through to an actionable conformance result**.

# What should be built next

> **Reconcile orphaned semantic authority to the current executable body, then perform full meaning-overlap analysis and emit the exact remediation required for binding and replacement.**

That is one complete vertical slice:

```text
Rich orphaned authority
        ↓
Resolve historical body identity
        ↓
Find current successor body
        ↓
Establish or reject semantic continuity
        ↓
Rebind authority provisionally to current source
        ↓
Extract authority meaning
        ↓
Extract body meaning
        ↓
Compare meaning
        ↓
Classify exact / partial / conflict / missing
        ↓
Project remediation plan
```

The empty intersection is not a reason to stop.

It tells you the **first operation of the overlap pipeline must be authority migration or successor resolution**.

---

# Why the recommended classifier is insufficient

The “real-vs-placeholder classifier” would accurately tell you:

```text
158 reachable candidates contain placeholders.
```

You already know that.

It does not:

* recover the 25 rich mechanics;
* determine whether they belong to the current runtime body;
* compare them with current code;
* resolve semantic continuity;
* move anything closer to binding;
* project a replacement body;
* increase conformance.

It is another reporting layer around an already-understood condition.

That is exactly the kind of structural operational work you said you want to avoid.

---

# Why the full overlap engine alone is also insufficient

A matcher with no live rich authority/body pair will produce:

```text
NO_MATCHABLE_SUBJECTS
```

That might be architecturally clean, but operationally it is dead on arrival.

The matching engine must be delivered with a **seated subject**.

Otherwise, you built infrastructure without healing anything.

---

# Why “investigate orphaning first” is still incomplete

Investigation is appropriate only if it ends in a deterministic verdict:

```text
serves-query-console.js
        ↓
renamed / split / replaced / removed
        ↓
current successor body or no successor
```

But “investigate” cannot be the end product.

The complete capability must establish one of these:

```text
AUTHORITY_SUCCESSOR_CONFIRMED

AUTHORITY_SUCCESSOR_PARTIAL

AUTHORITY_SPLIT_ACROSS_CURRENT_BODIES

AUTHORITY_HAS_NO_CURRENT_SUCCESSOR

AUTHORITY_CONFLICTS_WITH_CURRENT_IMPLEMENTATION
```

Then it must continue into overlap analysis for any confirmed successor.

---

# The actual next vertical slice

I would call it:

# **Reconcile Orphaned Authority with Current Executable Meaning**

Its public outcome:

> Determine whether rich semantic authority attached to a historical body still describes one or more current executable responsibilities, and produce an exact migration, completion, binding, or retirement plan.

## Complete pipeline

```text
1. Load orphaned rich authority mechanics
2. Recover their historical semantic subjects
3. Locate candidate current bodies
4. Compare structural and semantic evidence
5. Resolve successor cardinality
6. Rebase authority references when continuity is proven
7. Extract canonical authority facts
8. Extract canonical body-meaning facts
9. Perform overlap analysis
10. Project a remediation contract
```

That creates the missing intersection rather than merely reporting that it is empty.

---

# How successor resolution should work

Do not rely on filenames alone.

The old path may have disappeared because the body was:

* renamed;
* split;
* consolidated;
* wrapped;
* projected into another file;
* replaced by adapters plus bundles.

Use multiple evidence dimensions.

```text
Historical authority
├── responsibility names
├── mechanic kinds
├── source expressions
├── field names
├── invoked operations
├── result vocabulary
├── failure dispositions
├── route names
└── semantic identifiers
```

Compare against current bodies:

```text
Current source facts
├── declarations
├── calls
├── object fields
├── literals
├── branches
├── imports
├── result shapes
├── responsibilities
└── dependency relationships
```

Then classify each historical mechanic:

```text
EXACT_SUCCESSOR_MATCH

PROBABLE_SUCCESSOR_MATCH

SPLIT_SUCCESSOR_MATCH

NO_SUCCESSOR_MATCH

AMBIGUOUS_SUCCESSOR_MATCH
```

Only exact or human-approved probable matches move forward.

---

# The likely console story

Based on the names already surfaced, there may have been an evolution like:

```text
Historical:
serves-query-console.js
serves-query-console.mjs

Current:
serves-query-console.runtime.impl.mjs
console-authority-runtime.mjs
console-routing-adapter.mjs
console-validation-adapter.mjs
semantic execution bundles
```

That suggests the old monolithic meaning may now be distributed.

So the correct question is not merely:

```text
Was serves-query-console.js renamed?
```

It is:

```text
Which historical responsibilities moved into which current bodies and authorities?
```

The result may be a split:

```text
Historical authority
├── request routing
│     → console-request-routing.bundle.json
├── validation
│     → console-validation.bundle.json
├── snippet retrieval
│     → console-snippet-retrieval.bundle.json
├── mechanical HTTP handling
│     → serves-query-console.runtime.impl.mjs
└── projection / serialization
      → current runtime or missing authority
```

That would explain why some old rich authority is orphaned while newer reachable draft mechanics remain placeholders.

The rich meaning may already have moved into **bundles with a different document shape**, while the old authority file still points at the retired monolith.

That is exactly why this next slice must reconcile semantic subjects across authority shapes, not merely remap a path.

---

# Required feature

```gherkin
Feature: Reconcile orphaned semantic authority with current executable meaning

  Background:
    Given rich admitted semantic authority references a source body that no longer exists
    And the current workspace contains executable bodies and authority documents
      that may represent successors to that historical subject

  Scenario: Resolve one historical authority mechanic to one current successor
    Given a historical authority mechanic has non-placeholder semantic content
    And exactly one current responsibility carries equivalent structural and
      semantic evidence
    When authority succession is resolved
    Then the current responsibility is identified as the exact successor
    And the historical source reference is not treated as current authority binding

  Scenario: Resolve historical authority split across current responsibilities
    Given one historical body contained multiple semantic responsibilities
    And those responsibilities now exist across several current bodies or bundles
    When authority succession is resolved
    Then each historical semantic subject is mapped independently
    And no current body is claimed to inherit unrelated historical meaning

  Scenario: Reject ambiguous authority succession
    Given more than one current responsibility is a plausible successor
    When authority succession is resolved
    Then the disposition is AUTHORITY_SUCCESSOR_AMBIGUOUS
    And no binding or source-reference migration is projected

  Scenario: Compare reconciled authority meaning with current body meaning
    Given a historical authority subject has a confirmed current successor
    When semantic overlap is evaluated
    Then the overlap is classified as EXACT, PARTIAL, CONFLICT, or NO_MATCH
    And every classification identifies the supporting authority and source facts

  Scenario: Project the complete healing action
    Given authority succession and semantic overlap have been resolved
    When the remediation contract is projected
    Then it declares whether to migrate, extend, split, bind, replace, or retire
    And it identifies every unresolved human semantic decision
```

---

# Final outputs

This capability should produce more than another report section.

## 1. Authority succession map

```json
{
  "historicalAuthority": "contracts/serves-query-console.authority.json",
  "historicalSource": "src/console/serves-query-console.js",
  "subjects": [
    {
      "historicalResponsibility": "route-request",
      "currentSuccessor": "src/console/contracts/console-request-routing.bundle.json",
      "disposition": "EXACT_SUCCESSOR_MATCH"
    },
    {
      "historicalResponsibility": "validate-request",
      "currentSuccessor": "src/console/contracts/console-validation.bundle.json",
      "disposition": "EXACT_SUCCESSOR_MATCH"
    }
  ]
}
```

## 2. Meaning-overlap results

```json
{
  "subject": "route-request",
  "authorityMeaning": {},
  "currentMeaning": {},
  "overlapDisposition": "PARTIAL_SEMANTIC_OVERLAP",
  "authorityOnlyMeaning": [],
  "bodyOnlyMeaning": [],
  "conflicts": []
}
```

## 3. Remediation plan

```json
{
  "action": "MIGRATE_SPLIT_AND_BIND",
  "steps": [
    "supersede stale authority source reference",
    "retain reusable semantic decisions",
    "bind routing meaning to current routing bundle",
    "bind validation meaning to current validation bundle",
    "author missing projection authority for residual body mechanics",
    "run equivalence proof",
    "retire historical authority document"
  ]
}
```

---

# The answer to give the agent

Use **Something narrower**, but specify this:

> Build a complete vertical slice that reconciles the orphaned rich authority to the current executable and authority topology, then runs meaning-overlap analysis on the confirmed successors and projects the exact remediation plan. Do not build a placeholder classifier by itself, and do not build a matcher that has no seated subject. Determine whether the historical `serves-query-console` meaning was renamed, split across current bodies/bundles, superseded, or retired. For every confirmed successor, extract authority meaning and current body meaning, classify EXACT/PARTIAL/CONFLICT/NO_MATCH, and emit the required migrate/extend/bind/replace/retire actions. The slice is complete only when it turns at least one currently orphaned rich semantic subject into either a current actionable authority connection or a proven retirement decision.

That keeps the agent on the shortest road to healing:

```text
orphaned rich meaning
        ↓
recover its current subject
        ↓
compare truth
        ↓
connect or retire
```

No classifier-only detour. No zero-result infrastructure build. No investigation report that stops before remediation.
