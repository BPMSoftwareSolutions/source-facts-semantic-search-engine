Exactly. You are turning the `.feature` file from prose into a **canonical semantic interface**.

The Gherkin remains readable by humans, but every meaningful node also carries a stable identity that resolves into canonical intent, authority, execution, and proof.

# The canonical chain

```text
.feature file
    ↓
canonical feature intent
    ↓
scenario intent
    ↓
responsibility
    ↓
obligation
    ↓
semantic / ontology / context authority
    ↓
binding
    ↓
projected executable body
    ↓
execution and proof
```

And every link is queryable.

# Canonical identifiers inside Gherkin

A convention could look like:

```gherkin
@feature-id:source-facts.project-call-graph
@intent-id:intent.project-call-graph.v1
Feature: Project interface reachability

  @scenario-id:source-facts.project-call-graph.from-cli
  @responsibility-id:projects-cli-entrypoint-call-graph
  @obligation-id:project-all-resolvable-cli-reachability
  Scenario: Project reachable callables from a CLI entry point
    @given-id:source-index-is-available
    Given a validated SourceFacts index containing callable and relationship facts

    @when-id:call-graph-projection-is-requested
    When the call graph is projected from a declared CLI entry point

    @then-id:reachable-callables-are-projected
    Then every statically resolvable callable is included in the reachable execution slice

    @and-id:unresolved-edges-are-classified
    And every unresolved runtime-sensitive edge receives an explicit disposition
```

Whether the marker is literally `@`, `&`, or another admitted syntax is secondary. The important thing is that the parser treats it as structured identity, not a comment.

Using your ampersand convention:

```gherkin
&feature:source-facts.project-call-graph
Feature: Project interface reachability

  &scenario:source-facts.project-call-graph.from-cli
  &responsibility:projects-cli-entrypoint-call-graph
  &obligation:project-all-resolvable-cli-reachability
  Scenario: Project reachable callables from a CLI entry point

    &given:source-index-is-available
    Given a validated SourceFacts index containing callable and relationship facts

    &when:call-graph-projection-is-requested
    When the call graph is projected from a declared CLI entry point

    &then:reachable-callables-are-projected
    Then every statically resolvable callable is included

    &and:unresolved-edges-are-classified
    And every unresolved runtime-sensitive edge receives an explicit disposition
```

# The `.feature` file and intent document play different roles

The `.feature` file owns the readable behavioral expression:

```text
actor
behavior
conditions
observable outcome
```

The canonical intent document owns the structured meaning:

```json
{
  "documentKind": "canonical-feature-intent.v1",
  "featureId": "source-facts.project-call-graph",
  "featureFile": "features/project-call-graph.feature",
  "featureAnchor": "&feature:source-facts.project-call-graph",
  "purpose": "Project interface-to-execution reachability from SourceFacts relationships.",
  "scenarios": [
    {
      "scenarioId": "source-facts.project-call-graph.from-cli",
      "featureAnchor": "&scenario:source-facts.project-call-graph.from-cli",
      "responsibilityId": "projects-cli-entrypoint-call-graph",
      "obligationId": "project-all-resolvable-cli-reachability",
      "givenId": "source-index-is-available",
      "whenId": "call-graph-projection-is-requested",
      "thenId": "reachable-callables-are-projected",
      "andId": "unresolved-edges-are-classified"
    }
  ]
}
```

The intent document should not duplicate the Gherkin text as an uncontrolled second copy. It should reference the canonical anchors and hold the structured semantics that cannot live cleanly in Gherkin.

# Bidirectional validation

The relationship must be checked both ways.

```text
.feature → intent
intent → .feature
```

Required invariants:

```text
Every feature anchor resolves to exactly one feature intent.
Every scenario anchor resolves to exactly one scenario intent.
Every responsibility belongs to exactly one scenario in the monotonic model.
Every obligation belongs to exactly one responsibility.
Every Given/When/Then/And ID exists in canonical intent.
No canonical intent points to a missing Gherkin anchor.
No Gherkin anchor exists without canonical intent coverage.
```

Typed failures:

```text
FEATURE_ANCHOR_UNRESOLVED
SCENARIO_ANCHOR_DUPLICATED
RESPONSIBILITY_CARDINALITY_INVALID
OBLIGATION_CARDINALITY_INVALID
GHERKIN_STEP_INTENT_MISSING
INTENT_FEATURE_FILE_MISMATCH
CANONICAL_ID_REUSED
```

# The query engine becomes the projection plane

This is the powerful part.

A query should be able to resolve:

```text
feature write-up
→ canonical intent
→ scenario
→ responsibility
→ obligation
→ semantic authority
→ ontology entities
→ context bindings
→ execution mechanics
→ call graph
→ source references
→ projection target
```

For example:

```sql
SELECT *
FROM canonicalFeatureTrace
WHERE featureId = 'source-facts.project-call-graph'
ORDER BY scenarioId, responsibilityId, obligationId;
```

The result should include:

* `.feature` file and anchor;
* canonical intent file;
* scenario IDs;
* responsibility and obligation;
* interface surface;
* call-graph roots and paths;
* source symbols;
* existing authority;
* missing authority;
* projection status;
* proof status.

# Queries should also identify missing semantic layers

A query can classify each responsibility:

```text
FEATURE_DECLARED
SCENARIO_DECLARED
RESPONSIBILITY_DECLARED
OBLIGATION_DECLARED
SEMANTIC_AUTHORITY_MISSING
ONTOLOGY_AUTHORITY_MISSING
CONTEXT_BINDING_MISSING
EXECUTION_BINDING_MISSING
PROJECTION_AVAILABLE
PROJECTION_NOT_AVAILABLE
```

Then the refactoring agent does not ask broadly, “What should I write?”

It receives:

```text
This scenario and obligation are canonical.
This execution slice is connected.
These mechanics remain inline.
These semantic decisions are observable.
These authority layers are missing.
These are the expected JSON schemas.
```

# Proposal projection when canonical authority is missing

This is exactly right:

```text
query result
→ evidence bundle
→ authority proposal
```

Suppose a canonical scenario exists, but the body contains inline branching, fallback, normalization, and serialization.

The query engine can produce:

```json
{
  "featureId": "source-facts.project-call-graph",
  "scenarioId": "source-facts.project-call-graph.from-cli",
  "responsibilityId": "projects-cli-entrypoint-call-graph",
  "obligationId": "project-all-resolvable-cli-reachability",
  "authorityCoverage": {
    "decision": "MISSING",
    "fallback": "MISSING",
    "normalization": "MISSING",
    "serialization": "MISSING"
  },
  "observedMechanics": [
    {
      "mechanic": "branch",
      "sourceReferenceId": "..."
    },
    {
      "mechanic": "fallback",
      "sourceReferenceId": "..."
    }
  ],
  "proposalTargets": [
    "decision-authority",
    "missing-value-policy",
    "normalization-profile",
    "result-contract"
  ]
}
```

The projector can then produce draft JSON authority.

# Proposed projection artifacts

The query-backed projector may generate:

```text
canonical-feature-intent proposal
scenario-intent proposal
responsibility authority
obligation authority
decision authority
validation policy
failure policy
ontology entity definitions
context relationships
result contract
semantic execution bundle
binding
projection mapping
equivalence vectors
```

Each proposed field must retain evidence lineage:

```json
{
  "decisionId": "classify-entrypoint-reachability",
  "lifecycle": "INFERRED_NOT_ADMITTED",
  "evidence": [
    {
      "queryId": "authoring.decision-evidence.v1",
      "resultRowId": "decision-0042",
      "sourceReferenceId": "source-ref-9281"
    }
  ]
}
```

# Projection can work in both directions

## From intent to code

```text
.feature
→ canonical intent
→ authority
→ projector
→ executable body
```

## From code to proposed intent

```text
interface call graph
→ source facts
→ execution mechanics
→ query evidence
→ proposed feature / intent / authority
```

This creates the idempotent loop:

```text
observe
→ propose
→ review
→ admit
→ project
→ prove
→ rescan
→ resolve to the same canonical identities
```

# The query catalog becomes a semantic build system

The query engine is no longer just retrieving rows.

It becomes capable of projecting governed artifacts because queries can resolve complete semantic neighborhoods.

```text
Query:
Show the complete authority gap for this scenario responsibility.

Result:
Feature identity
Scenario identity
Responsibility identity
Obligation identity
Gherkin anchors
Interface root
Call graph
Data flow
Mechanics
Existing authority
Missing authority
Projection schemas
Proof candidates
```

That result is effectively an input contract for a projector.

# Canonical query families

The essential families become:

```text
gherkin.feature-by-id.v1
gherkin.scenario-by-id.v1
gherkin.step-identities.v1

intent.feature-by-id.v1
intent.scenario-lineage.v1
intent.responsibility-obligation.v1

trace.feature-to-interface.v1
trace.feature-to-callgraph.v1
trace.scenario-to-source-facts.v1
trace.obligation-to-mechanics.v1

authority.coverage-by-obligation.v1
authority.missing-by-responsibility.v1
authority.overlap-and-conflict.v1

projection.authority-proposal-input.v1
projection.execution-bundle-input.v1
projection.body-replacement-input.v1
projection.proof-vector-input.v1
```

# The strongest invariant

> Every feature statement, scenario, responsibility, obligation, semantic authority element, executable mechanic, and proof must be resolvable through a query path anchored in canonical identity.

That means the system can no longer lie through disconnected prose.

The `.feature` file says what behavior matters.

The intent authority says what that behavior means.

The semantic and ontology layers say how that meaning is structured.

The execution authority says how it is realized.

The query engine proves every connection.

And wherever a connection is missing, the same query plane produces the evidence needed to propose the missing projection.

That is absolutely serious.

# ####################################################################

Exactly. **That is the full deterministic intent-discovery and projection lifecycle.**

The key realization is that the current codebase is not merely an implementation to govern. It is also **evidence of latent intent**.

You are using SourceFacts on itself to move through this progression:

```text
existing executable behavior
→ discovered intent
→ feature write-up
→ canonical intent
→ semantic / ontology / context authority
→ execution authority
→ projected executable body
```

## The complete end-to-end flow

```text
1. Observe existing code
   ↓
2. Resolve interface surfaces
   ↓
3. Trace call graph and data flow
   ↓
4. Discover latent feature intent
   ↓
5. Propose .feature write-up
   ↓
6. Canonicalize feature and scenario identities
   ↓
7. Bind responsibilities and obligations
   ↓
8. Author semantic, ontology, context, and data authority
   ↓
9. Bind executable mechanics to authority
   ↓
10. Project executable JSON or code bodies
   ↓
11. Prove equivalence
   ↓
12. Rescan and resolve to the same canonical identities
```

That is the entire conveyor.

# The current code is evidence, not authority

At the beginning, the code may contain:

* hidden decisions;
* inline fallbacks;
* duplicated serialization;
* embedded validation;
* state transitions;
* exception policy;
* result shaping;
* implicit context;
* undeclared ontology relationships.

Those mechanics show that meaning exists, but they do not yet prove that the meaning is correct or canonical.

So the initial disposition is:

```text
EXECUTABLE_MEANING_OBSERVED
INTENT_NOT_YET_CANONICAL
```

The SourceFacts queries gather enough evidence to propose what the intent appears to be.

# The feature file establishes the behavioral boundary

The `.feature` file becomes the first explicit intent surface.

```gherkin
&feature:source-facts.project-call-graph
Feature: Project interface reachability

  &scenario:source-facts.project-call-graph.from-cli
  Scenario: Project reachable callables from a CLI entry point

    &given:validated-source-index
    Given a validated SourceFacts index

    &when:call-graph-is-projected
    When call graph projection is requested for a CLI entry point

    &then:reachable-callables-are-returned
    Then every resolvable reachable callable is returned

    &and:unresolved-edges-are-classified
    And every unresolved edge receives an explicit disposition
```

This says what the behavior is supposed to mean at the interface level.

# Canonical intent gives the feature durable identity

The canonical intent document then locks the feature into structured meaning:

```json
{
  "documentKind": "canonical-feature-intent.v1",
  "featureId": "source-facts.project-call-graph",
  "featureFile": "features/project-call-graph.feature",
  "featureAnchor": "&feature:source-facts.project-call-graph",
  "scenarios": [
    {
      "scenarioId": "source-facts.project-call-graph.from-cli",
      "scenarioAnchor": "&scenario:source-facts.project-call-graph.from-cli",
      "responsibilityId": "project-cli-entrypoint-call-graph",
      "obligationId": "return-all-resolvable-reachable-callables",
      "givenId": "validated-source-index",
      "whenId": "call-graph-is-projected",
      "thenId": "reachable-callables-are-returned",
      "andId": "unresolved-edges-are-classified"
    }
  ]
}
```

Now the feature text, scenario text, responsibility, and obligation cannot drift independently.

# Then the semantic layers fill in

From that canonical intent, the system builds the structured layers required for execution.

## Semantic authority

Defines decisions and obligations:

```text
what conditions exist
what outcomes are permitted
what failures mean
what defaults apply
```

## Ontology authority

Defines entities and relationships:

```text
CLI entry point
callable
relationship edge
reachable execution slice
runtime resolution candidate
```

## Context authority

Defines which meaning applies where:

```text
which repository
which workspace
which CLI command
which graph scope
which scenario
```

## Data authority

Defines shapes and contracts:

```text
call graph input
entry point identity
path witness
edge disposition
projection result
```

# Execution can take more than one form

This is an important part of the model.

## Executable JSON already exists

Then the chain is:

```text
feature
→ canonical intent
→ semantic authority
→ executable JSON
→ runtime
```

The JSON is already the executable projection.

## Executable mechanics remain in code

Then the chain is:

```text
feature
→ canonical intent
→ authority
→ binding
→ existing code mechanics
```

The body is not yet projected, but it is now connected.

That means the code can receive a disposition such as:

```text
CONNECTED_TO_CANONICAL_INTENT
AUTHORITY_PARTIAL
BODY_NOT_YET_PROJECTED
```

That alone is major progress because the body is no longer anonymous meaning.

# Connectability comes before full projection

You do not need to wait until every projector exists.

The first objective is:

> Every executable behavior is connectable to a canonical feature, scenario, responsibility, and obligation.

Then each body can be classified:

```text
CANONICAL_INTENT_CONNECTED
SEMANTIC_AUTHORITY_COMPLETE
ONTOLOGY_AUTHORITY_COMPLETE
CONTEXT_AUTHORITY_COMPLETE
EXECUTION_BINDING_COMPLETE
PROJECTION_AVAILABLE
BODY_PROJECTED
EQUIVALENCE_PROVEN
```

That gives you a deterministic maturity ladder.

# Queries drive each transition

The query engine can answer:

```text
Which CLI surface reaches this symbol?
Which feature covers this interface behavior?
Which scenario owns this responsibility?
Which obligation explains this branch?
Which authority already exists?
Which authority is missing?
Which JSON schema should be authored?
Which body mechanics can be replaced?
Which proof vectors are required?
```

Then queries can project evidence bundles for each missing layer.

```text
query
→ evidence bundle
→ authority proposal
→ review
→ admission
→ projection
```

# The initial self-study is perfect

SourceFacts is an ideal first test subject because:

* the implementation already exists;
* the interfaces are visible;
* the call graph exists;
* the query engine exists;
* the report exposes missing lineage;
* the repository contains both JSON authority and inline mechanics;
* the system can inspect itself.

So the first pass is not speculative greenfield design.

It is:

```text
Look at what SourceFacts already does.
Trace it from CLI to execution.
Write the features that accurately describe it.
Canonicalize those features.
Connect the existing code.
Author missing authority.
Project bodies where possible.
```

# The monotonic transformation

The repository moves through these states:

```text
NO_DECLARED_INTENT
    ↓
FEATURE_INTENT_PROPOSED
    ↓
FEATURE_INTENT_CANONICAL
    ↓
SCENARIO_LINEAGE_COMPLETE
    ↓
RESPONSIBILITY_AND_OBLIGATION_BOUND
    ↓
SEMANTIC_LAYERS_COMPLETE
    ↓
EXECUTION_CONNECTED
    ↓
EXECUTION_PROJECTABLE
    ↓
BODY_PROJECTED
    ↓
EQUIVALENCE_PROVEN
```

Each step preserves what was already admitted and removes ambiguity.

# The final state

The mature system should let one query resolve the complete chain:

```text
feature file
→ feature anchor
→ canonical intent
→ scenario anchor
→ responsibility
→ obligation
→ semantic authority
→ ontology
→ context
→ data contract
→ execution binding
→ executable JSON or code projection
→ call graph
→ source references
→ proof receipt
```

And when any link is missing, that same query plane should return:

```text
missing link
required schema
available evidence
proposal target
projection readiness
```

That is the end-to-end system you are describing.

It begins with code that has behavior but no explicit intent.

It ends with executable behavior that is a provable projection of canonical feature intent.
