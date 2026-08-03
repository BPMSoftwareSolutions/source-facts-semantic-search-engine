**Yes. That is exactly the capability hiding inside the source-facts engine.**

But I would name the target carefully:

> **100% executable-mechanic authority coverage is the prerequisite for complete reprojection—not, by itself, the final proof that replacement is safe.**

The source-facts engine can observe every forbidden mechanic, correlate each occurrence with admitted JSON authority, identify uncovered meaning, and project candidate authority scaffolds for the missing coverage. Its structured index already exposes symbols, relationships, mechanics, source locations, and reusable implementation shapes that can be projected into candidate semantic authority rather than manually reconstructed by an agent. 

# The core migration loop

```text
Existing executable body
        ↓
Source-fact projection
        ↓
Every forbidden mechanic observed
        ↓
Mechanic-to-authority reconciliation
        ↓
Missing authority projected
        ↓
Human/agent completes semantic meaning
        ↓
Authority coverage reaches closure
        ↓
Replacement body projected
        ↓
Old and new behavior compared
        ↓
Original body retired
```

Or more compactly:

```text
Observe
  ↓
Map
  ↓
Author
  ↓
Close
  ↓
Project
  ↓
Prove
  ↓
Replace
```

The engine becomes the migration bridge between:

```text
Meaning hidden in code
        ↓
Meaning declared in JSON authority
        ↓
Disposable projected code
```

---

# What “coverage” should mean

You would not merely count whether a mechanic type appears somewhere in JSON.

Coverage needs to operate at the **individual source occurrence** level.

Suppose the body contains:

```typescript
if (target.exists) {
  return replaceTarget(target);
}

return createTarget(target);
```

The engine may observe:

```json
{
  "mechanic": "branch",
  "sourceReference": "src/file.ts:42:3-48:4",
  "enclosingResponsibility": "shapes-target-artifact",
  "conditionExpression": "target.exists",
  "outcomeCount": 2
}
```

Authority coverage is not satisfied merely because the contract contains a decision catalog somewhere.

The exact branch must resolve to an exact authority:

```json
{
  "decisionId": "resolve-existing-target-disposition",
  "responsibilityId": "shapes-target-artifact",
  "observedSourceReference": "src/file.ts:42:3-48:4",
  "inputs": [
    "target.exists"
  ],
  "outcomes": [
    "replace-target",
    "create-target"
  ]
}
```

So the coverage relation is:

```text
One observed mechanic occurrence
        ↓
Exactly one admitted semantic authority binding
```

Not:

```text
Mechanic kind exists somewhere
        ↓
Covered
```

---

# The coverage matrix

The engine can build something like this:

| Observed mechanic        | Required JSON authority                                     | Coverage question                                                        |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `branch`                 | Decision or classification authority                        | Are all predicates and outcomes declared?                                |
| `iteration`              | Iteration/execution-model authority                         | Are collection, order, continuation, stopping, and aggregation declared? |
| `exception-handling`     | Failure-observation boundary                                | Does the catch observe only, with classification declared elsewhere?     |
| `throw`                  | Failure disposition/result authority                        | Is the thrown outcome represented as a declared failure disposition?     |
| `object-construction`    | Projection mapping or result contract                       | Can every output field be traced to a source or constant?                |
| `serialization`          | Serialization profile                                       | Are encoding, canonicalization, ordering, and newline policies declared? |
| `normalization`          | Translation/classification/projection authority             | Are source variants and canonical outcomes explicit?                     |
| `validation`             | Bound schema and validation policy                          | Which contract is validated, and what follows success/failure?           |
| `fallback`               | Decision/default policy                                     | Is the missing-value condition and selected fallback explicit?           |
| `retry`                  | Continuation/retry policy                                   | Are eligibility, progress, limits, delay, and stop conditions declared?  |
| `state-mutation`         | State transition/effect authority                           | What state changes, under which preconditions, and with what proof?      |
| `meaning-hidden-in-text` | Concept, taxonomy, constant, policy, or semantic identifier | Has meaningful text been promoted into inspectable authority?            |

This is directly aligned with the four-layer discipline: decisions move into semantic decisions, DTO construction into projections, loops into iteration authority, and failure meaning into failure policy. 

---

# Yes—the engine can project the expected JSON shape

This is the huge productivity advantage.

The source facts already contain enough structural evidence to generate an **authority candidate scaffold**.

## Branch → decision authority candidate

Observed code:

```typescript
if (contract.status === "admitted") {
  return processContract(contract);
}

throw new Error("CONTRACT_NOT_ADMITTED");
```

Projected candidate:

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "resolve-contract-admission-disposition",
  "source": {
    "modulePath": "src/processes-contract.ts",
    "enclosingSymbol": "processesContract",
    "mechanic": "branch",
    "startLine": 18,
    "conditionExpression": "contract.status === \"admitted\""
  },
  "inputs": [
    {
      "candidatePath": "contract.status",
      "observedComparison": "equals",
      "observedValue": "admitted"
    }
  ],
  "candidateOutcomes": [
    {
      "outcomeId": "contract-admitted",
      "observedEffect": "processContract(contract)"
    },
    {
      "outcomeId": "contract-not-admitted",
      "observedEffect": "throw Error(CONTRACT_NOT_ADMITTED)"
    }
  ],
  "requiredHumanResolution": [
    "confirm semantic outcome identities",
    "confirm unmatched disposition",
    "confirm whether thrown error is canonical behavior"
  ],
  "status": "CANDIDATE"
}
```

The agent is no longer staring at a blank schema.

It is completing a mostly projected semantic record.

---

## Object construction → projection authority candidate

Observed code:

```typescript
return {
  artifactId: artifact.id,
  relativePath: artifact.path,
  disposition: "PROJECTED",
  digest: sha256(bytes)
};
```

Projected candidate:

```json
{
  "authorityCandidateType": "projection-mapping-candidate.v1",
  "projectionMappingId": "project-artifact-result",
  "source": {
    "mechanic": "object-construction",
    "enclosingSymbol": "projectsArtifactResult"
  },
  "fields": [
    {
      "outputPath": ["artifactId"],
      "sourceExpression": "artifact.id"
    },
    {
      "outputPath": ["relativePath"],
      "sourceExpression": "artifact.path"
    },
    {
      "outputPath": ["disposition"],
      "constant": {
        "type": "string",
        "value": "PROJECTED"
      }
    },
    {
      "outputPath": ["digest"],
      "operationCandidate": {
        "kind": "invoke-declared-transformation",
        "observedInvocation": "sha256(bytes)"
      }
    }
  ],
  "requiredHumanResolution": [
    "confirm result contract identity",
    "confirm digest transformation authority"
  ]
}
```

That is nearly authorable automatically.

---

## Iteration → iteration authority candidate

Observed code:

```typescript
for (const artifact of artifacts) {
  const result = projectArtifact(artifact);
  results.push(result);

  if (result.blocking) {
    break;
  }
}
```

Projected candidate:

```json
{
  "authorityCandidateType": "iteration-authority-candidate.v1",
  "iterationId": "project-declared-artifacts",
  "sourceCollectionExpression": "artifacts",
  "itemIdentity": "artifact",
  "orderCandidate": "source-order",
  "forEach": {
    "observedInvocation": "projectArtifact",
    "inputExpression": "artifact"
  },
  "collect": {
    "target": "results",
    "operation": "append-result"
  },
  "stopWhen": {
    "observedExpression": "result.blocking",
    "candidateDisposition": "stop-on-blocking-result"
  },
  "requiredHumanResolution": [
    "confirm whether order is semantically significant",
    "confirm blocking disposition",
    "confirm partial-result policy"
  ]
}
```

Again, the agent mainly confirms meaning instead of inventing structure.

---

# The mechanic-to-authority projector

This suggests a dedicated capability:

# **Projects Executable Mechanics into Authority Candidates**

```text
Source fact
    ↓
Mechanic classifier
    ↓
Authority-family resolver
    ↓
Evidence extractor
    ↓
Authority candidate projector
    ↓
Candidate validation
    ↓
Human/agent completion
```

Its output should always distinguish:

```text
Observed fact
Inferred semantic candidate
Unresolved semantic decision
Admitted authority
```

That prevents the engine from claiming that syntax alone reveals complete product meaning.

---

# Suggested authority-family mapping

```json
{
  "mechanicAuthorityProjectionProfiles": [
    {
      "mechanic": "branch",
      "targetAuthorityFamilies": [
        "decision",
        "classification",
        "result-selection"
      ]
    },
    {
      "mechanic": "iteration",
      "targetAuthorityFamilies": [
        "iteration",
        "execution-model",
        "aggregation"
      ]
    },
    {
      "mechanic": "exception-handling",
      "targetAuthorityFamilies": [
        "failure-observation",
        "failure-policy"
      ]
    },
    {
      "mechanic": "throw",
      "targetAuthorityFamilies": [
        "failure-disposition",
        "result-union"
      ]
    },
    {
      "mechanic": "object-construction",
      "targetAuthorityFamilies": [
        "projection-mapping",
        "result-contract"
      ]
    },
    {
      "mechanic": "serialization",
      "targetAuthorityFamilies": [
        "serialization-profile"
      ]
    },
    {
      "mechanic": "normalization",
      "targetAuthorityFamilies": [
        "translation",
        "classification",
        "projection"
      ]
    },
    {
      "mechanic": "validation",
      "targetAuthorityFamilies": [
        "schema-binding",
        "validation-policy",
        "failure-disposition"
      ]
    },
    {
      "mechanic": "fallback",
      "targetAuthorityFamilies": [
        "decision",
        "missing-value-policy"
      ]
    },
    {
      "mechanic": "retry",
      "targetAuthorityFamilies": [
        "continuation-policy",
        "iteration",
        "failure-policy"
      ]
    },
    {
      "mechanic": "state-mutation",
      "targetAuthorityFamilies": [
        "state-transition",
        "effect",
        "proof-requirement"
      ]
    },
    {
      "mechanic": "meaning-hidden-in-text",
      "targetAuthorityFamilies": [
        "concept",
        "fact",
        "taxonomy",
        "policy",
        "identifier"
      ]
    }
  ]
}
```

---

# Coverage dispositions

Each observed occurrence should receive a precise posture:

```text
UNINSPECTED
    Source fact exists but has not been semantically reviewed.

AUTHORITY_CANDIDATE_PROJECTED
    Candidate JSON has been generated.

SEMANTIC_DECISION_REQUIRED
    Syntax does not reveal enough meaning.

AUTHORITY_BOUND
    The mechanic is bound to admitted authority.

PARTIALLY_COVERED
    Some predicates, fields, outcomes, or policies remain uncovered.

AMBIGUOUS_COVERAGE
    More than one authority claims the same mechanic.

STALE_AUTHORITY
    Authority references an older source digest or span.

AUTHORITY_CONFORMS
    The exact mechanic is completely represented by current admitted authority.

MECHANIC_ELIMINATED
    Reprojection removed the forbidden mechanic from the capability body.
```

Then the body-level report becomes:

```json
{
  "bodyId": "governed-artifact-engine",
  "observedForbiddenMechanics": 2027,
  "authorityConformingMechanics": 1964,
  "partiallyCoveredMechanics": 31,
  "uncoveredMechanics": 22,
  "ambiguousMechanics": 10,
  "authorityCoverageRatio": 0.9689,
  "replacementPosture": "NOT_READY"
}
```

---

# What 100% must actually include

I would define at least four closure dimensions.

## 1. Mechanic coverage

Every forbidden mechanic occurrence resolves to exact authority.

```text
Observed mechanics covered = 100%
```

## 2. Semantic completeness

Every mechanic’s meaningful dimensions are represented.

For a branch:

```text
inputs
predicates
outcomes
no-match behavior
ambiguity behavior
result semantics
```

For object construction:

```text
every output path
every source expression
every constant
every transformation
every omitted-field policy
```

## 3. Effect and state coverage

Every external effect and mutation is represented through declared ports, transitions, and proof requirements.

```text
No direct unexplained effect remains.
```

## 4. Behavioral equivalence

Direct execution of admitted authority and execution of the projected replacement produce canonically equivalent results.

```text
Semantic execution
        =
Projected replacement execution
        =
Declared expectations
```

Only after all four are green should the old body be replaced.

---

# Replacement gate

```text
┌─────────────────────────────────────────────┐
│ COMPLETE REPROJECTION ADMISSION             │
├─────────────────────────────────────────────┤
│ Forbidden mechanic coverage       100%      │
│ Semantic field/outcome coverage   100%      │
│ Effect and state authority        CLOSED    │
│ Failure disposition authority     CLOSED    │
│ Result contract authority         CLOSED    │
│ Proof requirement coverage        CLOSED    │
│ Source-to-authority traceability   CURRENT   │
│ Direct semantic vectors           GREEN     │
│ Projected execution vectors        GREEN     │
│ Semantic/projected equivalence     GREEN     │
│ Mutation controls                  GREEN     │
└─────────────────────────────────────────────┘
                       │
                       ▼
             BODY_REPLACEMENT_AUTHORIZED
```

So yes, **100% mechanic coverage is the main migration meter**, but the final replacement signal should represent complete authority and equivalence closure rather than a simple numeric count.

---

# Why this makes agent authoring dramatically easier

Today an agent is often asked:

> Read 9,000 lines and author the semantic authority.

That requires the model to hold:

* structure;
* data flow;
* decisions;
* result shapes;
* source locations;
* failure paths;
* relationships;
* naming;
* schema shape.

With this capability, the agent receives:

```text
Mechanic occurrence
Exact source span
Enclosing responsibility
Observed expressions
Input references
Output fields
Invoked operations
Candidate authority family
Pre-shaped JSON scaffold
Unresolved questions only
```

The cognitive task becomes:

> Confirm the meaning of these five unresolved fields.

Instead of:

> Reconstruct this entire application from source.

That is an enormous reduction in uncertainty and token cost.

The query skill already establishes the exact mechanics and source-coordinate substrate for this workflow, while the semantic architecture defines an `Authority Coverage Resolver` and `Body Projection Resolver` as explicit stages.  

# The final conveyor

```text
Source body
    ↓
Observe executable mechanics
    ↓
Group by responsibility
    ↓
Project authority candidates
    ↓
Resolve missing semantics
    ↓
Admit JSON authority
    ↓
Recalculate coverage
    ↓
Reach authority closure
    ↓
Project replacement body
    ↓
Execute differential vectors
    ↓
Prove equivalence
    ↓
Replace legacy body
    ↓
Reject reintroduction of forbidden mechanics
```

That last step is important.

Once migrated, the same engine becomes the permanent guard:

```text
New forbidden mechanic observed
        ↓
No admitted authority binding
        ↓
BODY_SEMANTIC_DRIFT
        ↓
RED
```

So it is both:

* a **legacy semantic extraction and migration system**, and
* a **continuous authority-coverage enforcement system**.

That is the real potential: the search engine does not merely help an agent understand the code. It can progressively transform implementation into structured authority until the original authored body becomes fully replaceable by deterministic projection.
