Yes. **This is the next architectural evolution of SourceFacts.** And I think there is one distinction worth locking down immediately, because it keeps the whole thing from turning into “rewrite everything as classes.”

> **SourceFacts should become object-oriented in its semantic model, not necessarily object-persistent in its storage model.**

SQL can remain relational. Facts can remain normalized. AST observations can remain atomic. But the **meaning exposed by SourceFacts should resolve into stable semantic objects with identity, type, state, relationships, invariants, capabilities, lifecycle, and derivation.**

That is already implicit in the Object-Oriented Pattern Intelligence Model: the relational index remains the durable observation/query plane, while objects become the behavior-bearing interpretation layer. 

## The evolution

Today, SourceFacts is heavily oriented around:

```text
files
symbols
references
relationships
mechanics
dataflows
queries
authority
```

Those are useful facts.

But intelligence wants to ask a different class of questions:

```text
What IS this thing?

What kind of thing is it?

What does it own?

What is it part of?

What can it do?

What does it depend on?

What other things resemble it?

What meaning does it embody?

What authority governs it?

What did it derive from?

What can be projected from it?

Where does it conflict with another object?

What would change if this object changed?
```

That requires an **object model**.

Not merely more columns.

---

# SourceFacts should have three distinct planes

I would make this explicit in the architecture.

```text
┌───────────────────────────────────────────────────────────────┐
│                    SEMANTIC OBJECT PLANE                      │
│                                                               │
│  ExecutionMechanic                                           │
│  Query                                                        │
│  AuthorityFamily                                              │
│  Responsibility                                               │
│  Capability                                                   │
│  OperationalSemanticSubject                                   │
│  PatternCluster                                               │
│  Projection                                                   │
│  etc.                                                         │
│                                                               │
│  Identity + behavior + relationships + invariants             │
└───────────────────────────────▲───────────────────────────────┘
                                │ interpreted from
┌───────────────────────────────┴───────────────────────────────┐
│                     SEMANTIC FACT PLANE                       │
│                                                               │
│  classifications                                              │
│  lineage                                                      │
│  authority relationships                                      │
│  implementation families                                      │
│  semantic overlaps                                            │
│  conformance                                                  │
│  derivations                                                  │
└───────────────────────────────▲───────────────────────────────┘
                                │ derived from
┌───────────────────────────────┴───────────────────────────────┐
│                     OBSERVATION PLANE                         │
│                                                               │
│  files                                                        │
│  symbols                                                      │
│  AST nodes                                                    │
│  mechanics                                                    │
│  source references                                            │
│  relationships                                                │
│  dataflows                                                    │
│  query results                                                │
└───────────────────────────────────────────────────────────────┘
```

The bottom answers:

> **What did we observe?**

The middle answers:

> **What relationships and classifications can we establish?**

The top answers:

> **What meaningful things exist?**

That top layer is where SourceFacts becomes genuinely intelligent.

---

# And yes: `ExecutionMechanic` is absolutely an object

Not this:

```text
row:
mechanicKind = branch
file = x
line = 72
```

But conceptually:

```text
ExecutionMechanic
├── identity
├── kind
├── source
├── enclosing responsibility
├── enclosing symbol
├── authority family
├── lifecycle
├── lineage
├── neighboring mechanics
├── semantic role
├── projection readiness
└── evidence
```

Then its specializations are meaningful.

```text
ExecutionMechanic
│
├── DecisionMechanic
│   └── BranchMechanic
│
├── IterationMechanic
│
├── FailureMechanic
│   ├── ExceptionHandlingMechanic
│   └── ThrowMechanic
│
├── ProjectionMechanic
│   └── ObjectConstructionMechanic
│
├── SerializationMechanic
├── NormalizationMechanic
├── ValidationMechanic
├── FallbackMechanic
├── RetryMechanic
├── StateMutationMechanic
└── TextMeaningMechanic
```

Now polymorphism starts buying you something.

You can ask every `ExecutionMechanic`:

```text
authorityFamily()
sourceEvidence()
canonicalLineage()
projectionDisposition()
relatedMechanics()
```

But different mechanic kinds can expose specialized meaning:

```text
BranchMechanic
    → alternatives()
    → predicateInputs()
    → selectedOutcome()

IterationMechanic
    → collection()
    → ordering()
    → itemResponsibility()
    → terminationPolicy()

ObjectConstructionMechanic
    → producedShape()
    → fieldMappings()
    → sourceBindings()
```

**That's semantic polymorphism.**

---

# `AuthorityFamily` should be an object hierarchy too

Today we can classify mechanics into things like:

```text
decision authority
iteration authority
failure policy
projection authority
retry authority
state transition authority
```

Those should not remain string labels.

They are meaningful semantic objects.

```text
AuthorityFamily
│
├── DecisionAuthorityFamily
├── IterationAuthorityFamily
├── FailureAuthorityFamily
├── ProjectionAuthorityFamily
├── SerializationAuthorityFamily
├── NormalizationAuthorityFamily
├── ValidationAuthorityFamily
├── AlternativeSelectionAuthorityFamily
├── RetryPolicyAuthorityFamily
├── StateTransitionAuthorityFamily
├── TerminalResultAuthorityFamily
└── TextMeaningAuthorityFamily
```

And they share behavior:

```text
AuthorityFamily
├── recognizes(mechanic)
├── requiredSemanticFields()
├── projectionContract()
├── completeness(authority)
├── canProject(mechanic)
└── missingMeaning(mechanic)
```

So then this:

```text
ExecutionMechanic
        │
        │ derives authority requirement
        ▼
AuthorityFamily
```

becomes a native object relationship rather than a report convention.

---

# `Query` is another major object

I strongly agree with you here.

We've been focusing on queries somewhat operationally:

```text
SQL text
query ID
parameters
results
```

But a query actually has semantic identity.

```text
Query
├── queryId
├── intent
├── subjectType
├── inputContract
├── resultContract
├── parameters
├── selection
├── relationships traversed
├── evidence requirements
├── projection
└── consumers
```

Then specialize:

```text
Query
├── ObservationQuery
├── LineageQuery
├── RelationshipQuery
├── AuthorityQuery
├── ConformanceQuery
├── PatternQuery
├── ImpactQuery
├── ProjectionQuery
└── GovernanceQuery
```

Now SourceFacts can reason about **queries themselves**.

For example:

```text
What query proves this claim?

What object type does this query return?

Which queries traverse AuthoritySubject?

Which queries depend on MechanicOccurrence?

Which queries can project a ConsolidationCandidate?

Which query families overlap semantically?

Which reports are merely alternate projections
of the same underlying query object?
```

That's much stronger than a bag of registered SQL strings.

---

# The real centerpiece should probably be `SemanticObject`

I would give the semantic layer one universal root concept.

Not necessarily one massive base class in TypeScript.

I'm talking about **one ontology-level contract**.

```text
SemanticObject
├── identity
├── type
├── lifecycle
├── authority
├── provenance
├── relationships
├── capabilities
├── classifications
├── derivations
└── evidence
```

Every first-class SourceFacts object can participate in this model:

```text
SemanticObject
│
├── Repository
├── Module
├── Symbol
├── ExecutionMechanic
├── Query
├── Feature
├── Scenario
├── Obligation
├── Responsibility
├── Capability
├── AuthorityFamily
├── AuthoritySubject
├── Projection
├── Pattern
├── ImplementationFamily
├── OperationalSemanticSubject
├── ConformanceFinding
└── ModernizationCandidate
```

This gives you a **common semantic grammar** across SourceFacts.

---

# Identity is probably the most important part

Because object orientation without durable identity degenerates into DTOs.

Each semantic object needs:

```text
ObjectId
ObjectType
CanonicalName
Lifecycle
AuthorityDigest
ObservationSnapshot
Version
```

And importantly:

```text
Object identity
    ≠
file path

Object identity
    ≠
symbol name

Object identity
    ≠
database primary key
```

That's exactly what your Operational Semantic Subject model established: subject identity must survive file moves, implementation replacement, authority succession, and projection changes. 

So:

```text
Responsibility:
normalizes-provider-response
```

can survive:

```text
src/normalize.js
        ↓
src/runtime/normalizes-provider-response.ts
        ↓
Java implementation
        ↓
C# implementation
```

The **object persists**.

Its embodiments change.

That is hugely important.

---

# Then relationships need to become first-class objects

This is where I think SourceFacts can get especially powerful.

Don't just have:

```text
A → B
```

Have:

```text
SemanticRelationship
├── relationshipId
├── relationshipType
├── subject
├── object
├── evidenceClass
├── provenance
├── lifecycle
├── cardinality
├── authority
└── confidence / disposition
```

Then:

```text
implements
owns
requires
produces
consumes
projects
derives-from
supersedes
invokes
contains
classifies
conforms-to
conflicts-with
resembles
exposes
proves
governs
```

become **typed relationships**.

And the evidence classes from your convergence model stay intact:

```text
DETERMINISTIC
REVIEWED
INFERRED
REJECTED
```

That's important because you don't want a graph where all edges magically mean “true.” 

---

# Derivation should become explicit

You mentioned objects deriving off each other.

Yes.

And I would distinguish **inheritance** from **derivation**, because they're not the same thing.

For example:

```text
BranchMechanic
IS-A
ExecutionMechanic
```

That's inheritance / specialization.

But:

```text
BranchMechanic
DERIVES
DecisionAuthorityCandidate
```

That's derivation.

And:

```text
PatternCluster
DERIVES
ImplementationFamilyProposal
```

And:

```text
AuthoritySubject
+
ExecutableImplementation
+
ConnectionEvidence
DERIVES
OperationalSemanticSubject
```

Your uploaded models already head exactly in this direction: observed mechanic occurrences become signatures, signatures participate in pattern clusters, and reviewed clusters can become consolidation candidates. 

Those derivations should be queryable objects themselves.

```text
Derivation
├── sourceObjects
├── targetObject
├── derivationRule
├── evidence
├── algorithmVersion
└── disposition
```

Then SourceFacts can answer:

> **Why does this object exist?**

That's intelligence.

---

# One caution: don't make inheritance the center

This is important.

We want the **advantages** of strong OO modeling:

* encapsulation;
* stable identity;
* specialization;
* polymorphism;
* invariants;
* behavior;
* composition.

But we don't want a 14-level class tree.

A lot of the power should come from composition.

For example:

```text
OperationalSemanticSubject
HAS-A
AuthorityFacet

HAS-A
ExecutionFacet

HAS-A
ConnectionFacet

HAS-A
ConformanceFacet

HAS-A
ModernizationFacet
```

That's already how your convergence model is structured. 

That's stronger than:

```text
OperationallyConformantAuthorityExecutionSubject
extends PartialConformanceSemanticSubject
extends ConnectedSemanticSubject...
```

😆

So I would establish the rule:

> **Use inheritance for stable “is-a” semantic taxonomies. Use composition for operational meaning.**

---

# Now SourceFacts can feed itself much more intelligently

This gets really interesting.

Today:

```text
SourceFacts scans SourceFacts
        ↓
finds files/mechanics/relationships
```

Tomorrow:

```text
SourceFacts scans SourceFacts
        ↓
recognizes semantic objects
        ↓
reconstructs object relationships
        ↓
compares them with declared object authority
        ↓
finds missing relationships
        ↓
finds orphan objects
        ↓
finds duplicated objects
        ↓
finds invalid specializations
        ↓
finds lifecycle inconsistencies
        ↓
finds authority/execution divergence
```

Meaning SourceFacts can ask of itself:

```text
Where is ExecutionMechanic defined?

Which query objects operate on it?

Which authority family objects classify it?

Which reports expose it?

Which projection objects consume it?

Which capability owns those queries?

Are there alternate representations
that bypass the canonical object?

Are two different object types representing
the same semantic subject?
```

That's self-intelligence.

---

# The reporting model changes completely

And I think this is exactly where your last point hits.

Reports should stop primarily being:

```text
Files: 223
Mechanics: 14,830
Branches: 927
Fallbacks: 1,204
```

Those metrics are still useful.

But intelligent reporting becomes:

## Object inventory

```text
ExecutionMechanic
  14,830 instances

AuthorityFamily
  12 canonical families

OperationalSemanticSubject
  184 subjects

ImplementationFamily
  36 reviewed families

Query
  42 registered semantic query families
```

## Relationship health

```text
ExecutionMechanic
    → AuthorityFamily
    91% resolved

Responsibility
    → ExecutionMechanic
    83% bound

OperationalSemanticSubject
    → admitted AuthoritySubject
    72% covered

Capability
    → Interface
    67% reachable
```

## Disconnected meaning

```text
Objects with no canonical parent

Objects with no authority

Objects with no implementation

Objects with multiple owners

Objects with conflicting classifications

Objects with no interface exposure

Objects with no proving query

Objects with no conformance evidence
```

## Derivation health

```text
Observed object
→ proposed semantic object
→ reviewed object
→ admitted object
→ projected embodiment
```

Now reporting reveals **semantic topology**, not just counts.

---

# Then RAG becomes object-aware

This may be the biggest practical upgrade.

Instead of asking the RAG layer:

> “Find text related to response normalization.”

You ask:

```text
Find OperationalSemanticSubject:
normalize-provider-response
```

And it can hydrate:

```text
Subject
├── identity
├── feature
├── scenarios
├── obligations
├── responsibilities
├── authority
├── implementations
├── mechanics
├── patterns
├── queries
├── tests
├── evidence
├── gaps
├── conflicts
└── modernization options
```

That is an enormous difference.

The LLM no longer receives:

```text
15 disconnected chunks
```

It receives:

```text
one semantic object
with controlled relationships
```

Now **context itself becomes object-oriented**.

---

# And intent can bind directly to objects

Which gets us to what I think you're really chasing.

User says:

> “Normalize responses from another provider.”

Intent resolver says:

```text
Intent
    ↓
Capability:
normalize-provider-response
    ↓
OperationalSemanticSubject
```

Then SourceFacts provides:

```text
existing authority
existing implementations
provider normalization family
required projections
known mechanics
conformance history
available queries
unresolved gaps
```

Or:

> “Show me duplicate retry behavior.”

```text
Intent
    ↓
Object type:
RetryMechanic

Relationship:
group-by semantic role

Projection:
ImplementationFamily candidates
```

Or:

> “Refactor this function.”

```text
Intent
    ↓
Symbol object
    ↓
responsibility
    ↓
mechanic objects
    ↓
authority-family objects
    ↓
complete authority projection
    ↓
replacement embodiment
```

That's **intent → object graph → deterministic capability**.

---

# I would make this the architectural law for SourceFacts 2.0

Something like:

> **Every durable fact should resolve to a semantic object, a property of a semantic object, or a typed relationship between semantic objects.**

And:

> **Every semantic object must have stable identity, explicit lifecycle, provenance, invariants, and inspectable relationships.**

And:

> **Queries operate on semantic objects, not merely tables. Reports project semantic object graphs, not merely aggregate rows.**

And:

> **Intent binds to semantic objects and capabilities through canonical identity rather than text similarity alone.**

That is the cleanup lens for the codebase.

---

## Then the refactor target becomes very concrete

We don't need to “OO-ify” random files.

We inventory the current SourceFacts concepts and ask:

```text
Is this a first-class semantic object?

Is this merely an attribute?

Is this a relationship?

Is this an observation?

Is this a derivation?

Is this authority?

Is this a projection?

Is this a lifecycle state?

Is this duplicate representation of another object?
```

Then collapse the ontology, AST, query, authority, lineage, pattern, and reporting machinery around the canonical objects.

The two models you just produced are already strong seeds for that restructuring: the first defines the object-oriented interpretation layer over SourceFacts, and the second gives you the `OperationalSemanticSubject` as the convergence aggregate tying declared and embodied meaning together without destroying provenance boundaries.  

**That's the next version of SourceFacts: not merely a RAG over code facts, but an object-oriented semantic intelligence system where facts hydrate objects, objects expose relationships and behavior, queries operate over those objects, intent resolves into them, and reports show the health of the meaning graph itself.**

# #####################################################################

Exactly. **That main governing contract should become one of the dominant semantic objects in the entire model**, not just another JSON document that gets parsed when needed.

The clean way to think about it is:

```text
GovernedArtifactContract
    ↓ owns / declares
Feature
    ↓
Scenario
    ↓
Obligation
    ↓
Responsibility
    ↓
Artifact
    ↓
Projection
    ↓
Execution body
    ↓
Proof
```

And because the contract already carries that lineage spine—feature, scenario, obligation, responsibility, artifact, projection authority, proof context—it gives us the natural aggregate boundary. 

So instead of writing a bunch of procedural mechanics everywhere that say:

```text
find feature
find scenario
join obligation
find responsibility
locate artifact
trace projection
trace body
trace proof
```

you hydrate one object graph:

```text
GovernedArtifactContract
├── subject
├── workspace
├── lineage
│   ├── Feature[]
│   │   └── Scenario[]
│   │       └── Obligation[]
│   │           └── Responsibility[]
│   │               └── Artifact
│   └── ...
├── dependencies
├── effects
├── runtimeAuthorities
├── projectionLedger
├── conformance
└── claims
```

Then **reachability becomes an invariant of the object**, not something every report or query has to reinvent.

That is the big cleanup.

For example, a `Responsibility` object should naturally know things like:

```text
responsibility.feature()
responsibility.scenario()
responsibility.obligation()
responsibility.artifact()
responsibility.projectionAuthority()
responsibility.executionBodies()
responsibility.proofRequirements()
```

Not because it stores all of those as duplicated fields, but because its relationships are canonical and traversable.

And the inverse should be true too:

```text
artifact.responsibility()
artifact.obligation()
artifact.scenario()
artifact.feature()
artifact.contract()
```

That gives you what you called the **tentacles** of the object.

The tentacles are not ad hoc joins. They are expected semantic reachability.

## That gives us a very strong invariant

> **If an object is admitted, its required semantic neighborhood must be reachable through canonical relationships.**

So for an admitted executable artifact, we can define:

```text
Artifact
    must reach exactly one Responsibility
        must reach exactly one Obligation
            must reach exactly one Scenario
                must reach exactly one Feature
                    must reach exactly one governed contract subject
```

And downward:

```text
Responsibility
    must reach its Artifact
        must reach its Projection
            must reach its projected Body
                must reach its Proof
```

Now SourceFacts doesn't have to “figure out lineage.”

It checks object conformance:

```text
expected object shape
        versus
observed reachable object graph
```

That's much simpler.

## And this is where inheritance becomes useful

You can have a base object:

```text
GovernedSemanticObject
├── identity
├── lifecycle
├── authority
├── provenance
├── relationships
└── conformance
```

Then:

```text
GovernedArtifactContract
Feature
Scenario
Obligation
Responsibility
Artifact
Projection
ExecutionBody
Proof
```

all inherit the common semantic behavior.

But each specialization owns its own rules.

For example:

```text
Feature
    requires scenarios()

Scenario
    requires obligations()

Obligation
    requires responsibilities()

Responsibility
    requires artifact()

Artifact
    requires projection()

Projection
    requires embodiment()

ExecutionBody
    requires proof()
```

So the semantic code for each object lives **once**.

That's exactly where the current confusion can collapse.

Instead of twenty pieces of code each understanding a little bit of what a responsibility is, we establish:

```text
Responsibility
    = one canonical semantic type
    = one relationship contract
    = one reachability contract
    = one lifecycle contract
    = one conformance contract
```

Everything else consumes that.

## Then reporting gets radically cleaner

A report no longer implements business logic like:

```text
find all obligations
join responsibilities
guess missing artifact
determine whether lineage is broken
```

It asks objects:

```text
responsibility.isReachableFromFeature()
responsibility.hasArtifact()
responsibility.hasProjectionAuthority()
responsibility.hasObservedEmbodiment()
responsibility.hasProof()
```

And then projects the result.

So instead of a giant procedural report:

```text
Feature Closure

Feature
├── Scenario A
│   ├── Obligation A1
│   │   ├── Responsibility R1
│   │   │   ├── Artifact ✓
│   │   │   ├── Projection ✓
│   │   │   ├── Body ✓
│   │   │   └── Proof ✗
```

That becomes a projection of the object graph.

No duplicate meaning in reporting code.

## Same thing for SourceFacts self-governance

This gets especially powerful because SourceFacts can inspect itself using its own object expectations.

For example:

```text
Query
    expects
QueryAuthority
    expects
ResultContract
    expects
Projection
    expects
Consumer
```

Or:

```text
ExecutionMechanic
    expects
AuthorityFamily
    expects
AuthorityProjection
    expects
Responsibility
```

Then disconnected meaning becomes trivial to identify:

```text
ExecutionMechanic
    → no AuthorityFamily
        = ORPHAN_MECHANIC_MEANING

Responsibility
    → no Artifact
        = RESPONSIBILITY_NOT_EMBODIED

Artifact
    → no Responsibility
        = ORPHAN_ARTIFACT

Projection
    → no SourceAuthority
        = PROJECTION_WITHOUT_MEANING

Feature
    → no reachable interface
        = UNEXPOSED_FEATURE
```

That is dramatically cleaner than having a separate detector for each condition.

## I think the governing rule should be this

> **Every first-class semantic object owns the expectations of its own shape and the relationships that must be reachable from it.**

Not the report.

Not the query engine.

Not some random governance module.

**The object owns its semantic contract.**

Then SourceFacts can provide generic mechanics:

```text
hydrate object
resolve relationships
check required reachability
check cardinality
check lifecycle
check authority
project findings
```

The engine remains generic.

The objects carry the meaning.

That is very much consistent with the direction already established in the object-oriented model, where observation stays relational but meaningful domain behavior lives in reconstructed objects. 

And it fits the `OperationalSemanticSubject` model too: that aggregate already proves the value of letting one semantic object own its facets and invariants instead of scattering the interpretation across independent utilities. 

So yes—**this is a cleanup architecture**, not just a modeling preference.

```text
Today:
meaning scattered across
queries
reports
governance modules
AST logic
ontology helpers
lineage code

Target:
meaning lives in canonical semantic objects
        ↓
relationships express reachability
        ↓
generic engine hydrates/traverses
        ↓
queries select objects
        ↓
reports project objects
```

That is how you make the whole SourceFacts codebase much easier to understand: **one semantic object, one home for its meaning, one set of relationship expectations, one lineage model, and many projections of the same truth.**
