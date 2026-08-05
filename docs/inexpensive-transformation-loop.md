Exactly. **That is the inexpensive transformation loop we have been building toward.**

The query should not merely tell us:

```text
A branch exists here.
```

It should return:

```text
A branch exists here.

It belongs to this execution workflow.

It is reachable from this interface.

It occurs inside this responsibility candidate.

Its authority family is decision authority.

Here is the standard candidate decision-authority shape.

These fields were derived deterministically.

These semantic fields still require completion.
```

# The native query result

Conceptually:

```sql
SELECT *
FROM projection.CurrentExecutionMechanicAuthorityCandidates
WHERE ApplicationId = @ApplicationId
  AND ResponsibilityId = @ResponsibilityId
ORDER BY ObservedOrdinal;
```

The result should contain both the observed mechanic and its projected authority counterpart:

```json
{
  "mechanicOccurrenceId": "sha256:...",
  "mechanicKind": "branch",

  "executionContext": {
    "interfaceId": "source-facts.govern",
    "rootCallableId": "governsWorkspace",
    "callableId": "resolvesGovernanceDisposition",
    "callPathDepth": 3,
    "responsibilityId": "resolves-workspace-governance"
  },

  "sourceEvidence": {
    "artifactId": "src/governance/...",
    "sourceReferenceId": "sha256:..."
  },

  "authorityProjection": {
    "authorityFamily": "decision-authority",
    "authorityData": {
      "decisionId": "resolve-workspace-governance-disposition",
      "inputs": [],
      "rules": [],
      "outcomes": [],
      "noMatchDisposition": "DECISION_NOT_RESOLVED"
    }
  },

  "derivedFields": [
    "authorityFamily",
    "decisionId"
  ],

  "missingFields": [
    "inputs",
    "rules",
    "outcomes"
  ],

  "projectionDisposition": "HUMAN_SEMANTIC_COMPLETION_REQUIRED"
}
```

That is the replacement scaffold.

The agent or authority engineer no longer has to reread the implementation and invent the JSON structure from scratch.

# The query should support three useful levels

## 1. Mechanic-level projection

One mechanic occurrence becomes one candidate authority envelope.

```text
branch
    → decision authority

iteration
    → iteration authority

object construction
    → projection authority

validation
    → validation authority

retry
    → retry-policy authority
```

This answers:

> What is the data counterpart of this exact executable mechanic?

## 2. Responsibility-level projection

All mechanics reachable within one responsibility are assembled into one ordered candidate slice:

```text
Responsibility
├── observations
├── decisions
├── iterations
├── transformations
├── validations
├── failure policies
├── terminal results
├── effects
└── proof requirements
```

This answers:

> What authority would need to exist for this complete responsibility to become projectable?

## 3. Workflow-level projection

The call graph connects multiple responsibilities beneath an interface:

```text
CLI command
    ↓
handler
    ↓
responsibility A
    ↓
responsibility B
    ↓
responsibility C
```

The query can project:

```text
candidate feature workflow
candidate scenarios
candidate responsibility sequence
authority gaps
projectable portions
unsupported portions
```

This answers:

> What complete operational capability is this code path currently implementing?

# AST and semantics can both be projected

The result can expose several related candidate forms.

## Semantic authority candidate

```json
{
  "authorityFamily": "decision-authority",
  "decisionId": "resolve-contract-selection",
  "inputs": [],
  "rules": [],
  "outcomes": []
}
```

## Semantic AST candidate

```json
{
  "kind": "semantic-decision-invocation",
  "authorityId": "resolve-contract-selection",
  "input": "$.context",
  "assign": "$.resolvedContract"
}
```

## Target body shape candidate

```json
{
  "kind": "semantic-invocation-function",
  "name": "resolvesContractSelection",
  "operations": [
    {
      "operation": "invoke",
      "edgeId": "resolve-contract-selection"
    }
  ]
}
```

Those are different projections of the same observed execution meaning:

```text
Observed mechanic
    ↓
authority-family data
    ↓
semantic execution AST
    ↓
target-language body profile
```

The query can return all three without executing a projector or writing files.

# Why this stays inexpensive

The expensive work happens only when repository content changes:

```text
Repository image changes
    ↓
refresh call graph
    ↓
refresh mechanic facts
    ↓
refresh lineage candidates
    ↓
refresh candidate authority rows
```

Routine usage is then:

```text
SELECT
→ indexed joins
→ candidate authority data
→ done
```

No repeated parsing.
No repeated grep.
No repeated model interpretation.
No report generation.
No proof sidecars.

The database already knows:

* the current repository image;
* the current call graph;
* mechanic occurrences;
* source references;
* test relationships;
* semantic observations;
* canonical lineage that has already been admitted.

The authority-projection query simply joins those facts and applies the standard mechanic-to-authority mappings.

# The human or model work becomes much smaller

Instead of asking an agent:

> Read these six files and write the authority contract.

We ask:

> Complete the unresolved fields in these database-projected authority candidates.

The difference is enormous:

```text
Before
├── discover files
├── grep mechanics
├── open bodies
├── reconstruct call paths
├── classify mechanics
├── invent authority shape
├── author JSON
└── validate

After
├── query candidate authority
├── complete missing semantics
├── review
└── admit
```

The system has already done the mechanical work.

The cognitive task is reduced to the part that actually requires cognition:

```text
What does this rule mean?
Which outcome is intended?
Which failure posture is canonical?
Which behavior should remain active?
```

# Admission must remain separate

The query result is still a **candidate**, not automatically canonical authority.

```text
Observed implementation
    ↓
candidate authority projection
    ↓
review and completion
    ↓
admission
    ↓
responsibility closure
    ↓
body projection
```

This is important because the existing implementation may contain:

* accidental fallback;
* legacy behavior;
* duplicated rules;
* stale branches;
* defensive code that should not survive;
* tests for behavior that is no longer intentional.

The query should expose all of it, but authority admission decides what belongs in the future system.

# The transformation query should show readiness

For every responsibility, SQL should be able to answer:

| Field                     | Meaning                                       |
| ------------------------- | --------------------------------------------- |
| Observed mechanic count   | How much executable meaning currently exists  |
| Candidate authority count | How much has a projected data counterpart     |
| Admitted authority count  | How much meaning has been reviewed            |
| Missing semantic fields   | What remains to be defined                    |
| Unsupported mechanics     | What requires new primitives or adapters      |
| Test coverage             | Which scenarios and expectations exercise it  |
| Projection readiness      | Whether the responsibility can be reprojected |
| Replacement disposition   | What action should happen next                |

Example:

```text
Responsibility:
reconstructs-contract-from-sql

Observed mechanics:              31
Candidate authority projected:   31
Authority admitted:              24
Human semantic decisions:         4
New runtime primitives required:  2
Not applicable:                   1

Projection disposition:
AUTHORITY_COMPLETION_REQUIRED
```

That is a fact-driven backlog item.

# Once authority closes

When every applicable mechanic has admitted authority:

```text
Observed responsibility
    ↓
closed SQL authority slice
    ↓
semantic execution bundle
    ↓
target AST
    ↓
projected executable body
    ↓
equivalence proof
```

Then the original body can be replaced.

And the next scan should report:

```text
Authored execution mechanics removed
Projected semantic delegation present
Authority lineage current
Tests conforming
Responsibility projectable
```

# The governing operating loop

```text
Query observed mechanics
    ↓
receive projected data counterparts
    ↓
complete unresolved meaning
    ↓
admit authority
    ↓
project replacement body
    ↓
execute canonical tests
    ↓
refresh facts
    ↓
select the next highest-value slice
```

So yes: **the query becomes the inexpensive bridge from existing executable mechanics into authored semantic authority**.

We are no longer asking an agent to discover the architecture from source every time. We are giving it a relationally assembled, call-graph-aware authority draft and asking it only to resolve the remaining meaning.

That is how filling the authority layer becomes routine enough to operate across SourceFacts—and eventually across enterprise repositories at scale.
