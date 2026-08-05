Yes. **This is the next standard we need.**

Right now, the governed artifact contract has separate homes for decisions, iterations, failure policies, projection mappings, result contracts, semantic edges, and forbidden syntax kinds. That is a strong beginning, but it does not yet provide a **uniform, machine-projectable counterpart for every forbidden executable mechanic**. 

The standard should establish:

```text
observed executable mechanic
        ↓
canonical mechanic classification
        ↓
required authority family
        ↓
standard authority shape
        ↓
projection readiness
        ↓
replacement execution body
```

# Governing rule

> **Every forbidden executable mechanic must resolve to exactly one declared semantic-authority counterpart, or receive an explicit non-projectable disposition.**

The tools must never guess merely from syntax that the authority is complete.

```text
Observed mechanic
    ≠
admitted meaning

Observed mechanic
    +
canonical lineage
    +
semantic interpretation
    +
complete authority
    =
projectable replacement
```

The engineering standard already establishes that decisions, DTO construction, control flow, failure behavior, effects, and proof belong above the projection boundary. 

# Exact repository projection companion plane

The universal mechanic envelope governs executable meaning, but executable meaning
alone is not a complete repository. SQL scripts, tests, feature declarations,
documentation, schemas, package metadata, lockfiles, and binary assets also belong
to the deployable workspace boundary.

Source Facts therefore keeps two non-interchangeable representations:

```text
repository-current-image.v1 = exact current bytes and operational file metadata
executable-mechanic-authority.v1 = admitted projectable semantic meaning
```

Repository capture never admits semantics. Each captured artifact is
`OBSERVED_NOT_ADMITTED` until an explicit feature, responsibility, mechanic, or
artifact contract binds its meaning. Conversely, semantic authority does not claim
byte-complete repository reconstruction unless its declared artifacts are available
through the exact-content plane or a closed deterministic projector.

One current repository image is stored per durable `RootId`; identical content is
deduplicated by digest rather than copied for every path. Database-only extraction
must verify all content digests and the complete image digest before projection into
an empty workspace.

Normalized repository knowledge is a third, still observational plane:

```text
repository-current-image.v1
    -> repository-semantic-analysis.v1
    -> explicit artifact coverage + typed observed facts
    -> human or governed admission workflow
    -> canonical authority
```

The analysis must originate from the database-backed image, cover every artifact,
and preserve failures and unsupported formats as explicit dispositions. SQL,
Gherkin, Markdown, JSON, and package/runtime manifests have initial typed analyzers;
JavaScript and TypeScript delegate to Source Facts. No analyzer output is authority
until a separate admission binds it to canonical lineage.

# The universal mechanic-authority envelope

Every data counterpart should use the same outer shape:

```json
{
  "authorityType": "executable-mechanic-authority.v1",
  "mechanicAuthorityId": "resolve-existing-target-disposition",
  "mechanicKind": "branch",

  "lineage": {
    "featureId": "shape-a-file-system",
    "scenarioId": "reject-a-target-conflict",
    "obligationId": "reject-unauthorized-target-replacement",
    "responsibilityId": "resolves-target-disposition",
    "artifactId": "file-system-shaper-runtime"
  },

  "semanticSubject": {
    "subjectId": "target-placement-disposition",
    "purpose": "Resolve whether a declared placement may proceed."
  },

  "inputs": [],
  "authority": {},
  "outputs": [],
  "execution": {},
  "proof": {},

  "sourceEvidence": [
    {
      "sourceFactId": "source-fact-...",
      "mechanicOccurrenceId": "mechanic-...",
      "sourceReferenceId": "source-reference-..."
    }
  ],

  "lifecycle": {
    "status": "proposed",
    "admissionDisposition": "INFERRED_NOT_ADMITTED"
  }
}
```

## Required common fields

| Field                 | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `mechanicAuthorityId` | Stable identity for the data counterpart                    |
| `mechanicKind`        | One of the governed mechanic taxonomy values                |
| `lineage`             | Feature → scenario → obligation → responsibility → artifact |
| `semanticSubject`     | What the mechanic means in this context                     |
| `inputs`              | Declared facts consumed                                     |
| `authority`           | Kind-specific semantic authority                            |
| `outputs`             | Declared results or signals                                 |
| `execution`           | Ordering, bindings, and runtime posture                     |
| `proof`               | Evidence required to establish equivalence                  |
| `sourceEvidence`      | Exact observed code facts that motivated the authority      |
| `lifecycle`           | Proposed, reviewed, admitted, projected, proven             |

That gives all analysis tools one stable envelope, while the `authority` member varies by mechanic kind.

# Standard counterpart for every forbidden mechanic

| Executable mechanic      | Canonical data counterpart                                         |
| ------------------------ | ------------------------------------------------------------------ |
| `branch`                 | Decision authority                                                 |
| `iteration`              | Iteration authority                                                |
| `exception-handling`     | Failure observation and disposition authority                      |
| `throw`                  | Terminal failure/result authority                                  |
| `object-construction`    | Semantic projection authority                                      |
| `serialization`          | Serialization profile authority                                    |
| `normalization`          | Translation and canonicalization authority                         |
| `validation`             | Contract and constraint authority                                  |
| `fallback`               | Alternative-selection decision authority                           |
| `retry`                  | Continuation and retry policy authority                            |
| `state-mutation`         | State-transition authority                                         |
| `meaning-hidden-in-text` | Vocabulary, classification, template, or text-projection authority |

---

# 1. Branch → decision authority

A branch means that the implementation is selecting among outcomes.

```json
{
  "mechanicKind": "branch",
  "authority": {
    "authorityKind": "decision-authority.v1",
    "decisionId": "resolve-target-disposition",
    "inputs": [
      "target.exists",
      "source.hash",
      "target.hash",
      "policy.existingTarget"
    ],
    "rules": [
      {
        "ruleId": "authorize-new-target",
        "when": {
          "target.exists": false
        },
        "then": {
          "disposition": "PLACEMENT_AUTHORIZED"
        }
      },
      {
        "ruleId": "declare-existing-equivalent-target",
        "when": {
          "target.exists": true,
          "source.hash": {
            "equalsPath": "target.hash"
          }
        },
        "then": {
          "disposition": "PLACEMENT_NOOP"
        }
      }
    ],
    "noMatchDisposition": "TARGET_DISPOSITION_UNRESOLVED",
    "multipleMatchDisposition": "TARGET_DISPOSITION_AMBIGUOUS"
  }
}
```

Required semantics:

```text
inputs
rules
outcomes
no-match posture
multiple-match posture
selected-rule testimony
```

The current contract’s `decisionAuthority` records syntax and policy, but the projectable form must evolve from:

```text
conditionExpression + policy text
```

to:

```text
typed inputs + structured rules + typed outcomes
```

# 2. Iteration → iteration authority

An iteration means that collection selection, ordering, continuation, stopping, and aggregation are currently authored in code.

```json
{
  "mechanicKind": "iteration",
  "authority": {
    "authorityKind": "iteration-authority.v1",
    "iterationId": "execute-authorized-file-operations",
    "collection": {
      "sourcePath": ["resolvedPlan", "operations"]
    },
    "ordering": {
      "kind": "ascending-property",
      "propertyPath": ["sequence"]
    },
    "selection": {
      "kind": "all-items"
    },
    "perItem": {
      "invokeResponsibilityId": "executes-authorized-file-operation"
    },
    "continuation": {
      "continueWhenSignal": "OPERATION_COMPLETED"
    },
    "stopConditions": [
      "BLOCKING_OPERATION_FAILURE"
    ],
    "aggregation": {
      "kind": "collect-results",
      "outputId": "operation-results"
    },
    "emptyCollectionDisposition": "NO_OPERATIONS_REQUIRED"
  }
}
```

Required semantics:

```text
collection
ordering
filtering
per-item responsibility
continuation
stop conditions
aggregation
empty-collection behavior
```

The standard already says these meanings belong in semantic iteration authority rather than in an authored loop. 

# 3. Exception handling → failure observation and disposition

`try/catch` contains two distinct concerns:

```text
mechanically observe a failure
+
semantically decide what that failure means
```

```json
{
  "mechanicKind": "exception-handling",
  "authority": {
    "authorityKind": "failure-policy-authority.v1",
    "failurePolicyId": "file-copy-failure-policy",
    "observationContractId": "observed-file-copy-failure.v1",
    "classifications": [
      {
        "classificationId": "classify-missing-source",
        "when": {
          "failureCode": "SOURCE_NOT_FOUND"
        },
        "resolveAs": "MISSING_SOURCE"
      },
      {
        "classificationId": "classify-transient-io",
        "when": {
          "failureCode": "TRANSIENT_IO_FAILURE"
        },
        "resolveAs": "TRANSIENT_FAILURE"
      }
    ],
    "dispositions": [
      {
        "classification": "MISSING_SOURCE",
        "result": "PLACEMENT_REJECTED"
      },
      {
        "classification": "TRANSIENT_FAILURE",
        "result": "RETRY_ELIGIBLE"
      }
    ],
    "unclassifiedDisposition": "UNCLASSIFIED_EXECUTION_FAILURE"
  }
}
```

The catch boundary observes. The authority classifies and decides.

# 4. Throw → terminal failure/result authority

A throw is not simply another exception-handling record. It represents a terminal outcome being physically expressed as a language exception.

```json
{
  "mechanicKind": "throw",
  "authority": {
    "authorityKind": "terminal-result-authority.v1",
    "terminalResultId": "reject-target-conflict",
    "resultKind": "failure",
    "disposition": "TARGET_CONFLICT",
    "resultContractId": "file-placement-result.v1",
    "payloadProjectionId": "project-target-conflict-result",
    "terminal": true,
    "retryEligible": false
  }
}
```

The target projection may choose:

```text
exception
result union member
HTTP response
CLI exit result
message rejection
batch disposition
```

The semantic authority should not require a throw in every target language.

# 5. Object construction → projection authority

Object construction usually hides DTO or result-shaping meaning.

```json
{
  "mechanicKind": "object-construction",
  "authority": {
    "authorityKind": "projection-authority.v1",
    "projectionId": "project-index-information-result",
    "inputContractId": "source-index.v1",
    "outputContractId": "index-information-result.v1",
    "cardinality": "one-to-one",
    "fields": [
      {
        "outputPath": ["indexId"],
        "operation": "read-path",
        "sourcePath": ["index", "indexId"]
      },
      {
        "outputPath": ["fileCount"],
        "operation": "count",
        "sourcePath": ["index", "files"]
      },
      {
        "outputPath": ["disposition"],
        "operation": "constant",
        "value": "INDEX_INFORMATION_PROJECTED"
      }
    ],
    "missingValuePolicy": "reject-projection",
    "additionalFieldPolicy": "reject"
  }
}
```

The current contract already has `projectionMappings`, but a standard projectable mapping needs typed operations rather than raw `sourceExpression` text. 

# 6. Serialization → serialization profile authority

Serialization is distinct from object projection.

Projection answers:

```text
What semantic result exists?
```

Serialization answers:

```text
How is that result physically encoded?
```

```json
{
  "mechanicKind": "serialization",
  "authority": {
    "authorityKind": "serialization-profile-authority.v1",
    "serializationProfileId": "canonical-json.v1",
    "inputContractId": "index-information-result.v1",
    "mediaType": "application/json",
    "encoding": "utf-8",
    "propertyOrdering": "canonical",
    "lineEnding": "none",
    "numberPolicy": "json-number",
    "nullPolicy": "preserve",
    "undefinedPolicy": "reject",
    "additionalValuePolicy": "reject",
    "maximumByteLength": 1048576
  }
}
```

This should align with the semantic execution bundle’s explicit serialization profile and finite runtime posture rather than being hidden in `JSON.stringify`. 

# 7. Normalization → translation and canonicalization authority

Normalization converts multiple acceptable representations into one canonical representation.

```json
{
  "mechanicKind": "normalization",
  "authority": {
    "authorityKind": "normalization-authority.v1",
    "normalizationId": "normalize-command-name",
    "inputConceptId": "observed-command-name",
    "outputConceptId": "canonical-command-name",
    "operations": [
      {
        "sequence": 1,
        "operation": "trim-whitespace"
      },
      {
        "sequence": 2,
        "operation": "case-fold",
        "profileId": "unicode-simple-case-fold.v1"
      },
      {
        "sequence": 3,
        "operation": "translate-value",
        "translationId": "command-alias-to-canonical-command"
      }
    ],
    "alreadyCanonicalDisposition": "CANONICAL_VALUE_PRESERVED",
    "unrecognizedDisposition": "NORMALIZATION_VALUE_UNRECOGNIZED"
  }
}
```

Required distinction:

```text
normalization
≠
validation

Normalization produces a canonical candidate.
Validation determines whether that candidate is admitted.
```

# 8. Validation → contract and constraint authority

Validation must identify the governed contract, the evaluated constraints, and the result posture.

```json
{
  "mechanicKind": "validation",
  "authority": {
    "authorityKind": "validation-authority.v1",
    "validationId": "validate-source-index",
    "subjectContractId": "source-fact-index.v1",
    "schemaId": "source-fact-index.schema.v1",
    "constraints": [
      {
        "constraintId": "index-type-required",
        "constraintKind": "required-property",
        "subjectPath": ["indexType"],
        "requiredDisposition": "CONSTRAINT_SATISFIED"
      },
      {
        "constraintId": "symbol-identities-unique",
        "constraintKind": "unique-by-path",
        "collectionPath": ["symbols"],
        "keyPath": ["symbolId"],
        "requiredDisposition": "CONSTRAINT_SATISFIED"
      }
    ],
    "successDisposition": "SOURCE_INDEX_VALID",
    "failureDisposition": "SOURCE_INDEX_INVALID",
    "mutationPolicy": "forbidden"
  }
}
```

Validation should never silently coerce, default, or remove data.

# 9. Fallback → alternative-selection authority

Fallback is a decision over ordered alternatives. It should not be represented as `a ?? b ?? c` in source.

```json
{
  "mechanicKind": "fallback",
  "authority": {
    "authorityKind": "alternative-selection-authority.v1",
    "selectionId": "resolve-query-source",
    "alternatives": [
      {
        "priority": 1,
        "sourceId": "explicit-source",
        "eligibleWhen": {
          "signal": "EXPLICIT_SOURCE_AVAILABLE"
        }
      },
      {
        "priority": 2,
        "sourceId": "workspace-default-source",
        "eligibleWhen": {
          "signal": "WORKSPACE_DEFAULT_AVAILABLE"
        }
      }
    ],
    "selectionPolicy": "first-eligible",
    "noAlternativeDisposition": "QUERY_SOURCE_NOT_RESOLVED",
    "multipleEligibleDisposition": "USE_HIGHEST_PRIORITY"
  }
}
```

Required semantics:

```text
candidate alternatives
eligibility
priority
selection rule
no-alternative result
ambiguity result
```

# 10. Retry → continuation policy authority

Retry is not merely iteration. It is iteration governed by outcome classification and continuation authority.

```json
{
  "mechanicKind": "retry",
  "authority": {
    "authorityKind": "retry-policy-authority.v1",
    "retryPolicyId": "provider-request-retry",
    "attemptResponsibilityId": "executes-provider-request-attempt",
    "eligibleClassifications": [
      "PROVIDER_RATE_LIMITED",
      "PROVIDER_TEMPORARILY_UNAVAILABLE"
    ],
    "attemptBudget": {
      "maximumAttempts": 3
    },
    "continuation": {
      "strategy": "continue-while-authorized",
      "progressSignalRequired": false
    },
    "timing": {
      "strategy": "exponential-backoff",
      "initialDelayMilliseconds": 500,
      "maximumDelayMilliseconds": 5000
    },
    "stopDispositions": [
      "NON_RETRYABLE_FAILURE",
      "ATTEMPT_BUDGET_EXHAUSTED",
      "CANCELLATION_OBSERVED"
    ],
    "exhaustedDisposition": "RETRY_EXHAUSTED"
  }
}
```

Retry authority may reference iteration authority internally, but it remains its own mechanic family because its meaning is continuation after failure or incomplete progress.

# 11. State mutation → state-transition authority

A mutation should be represented as an authorized transition, not as an arbitrary assignment.

```json
{
  "mechanicKind": "state-mutation",
  "authority": {
    "authorityKind": "state-transition-authority.v1",
    "stateModelId": "governance-run-state.v1",
    "states": [
      "declared",
      "scanned",
      "indexed",
      "reconciled",
      "proven",
      "rejected"
    ],
    "transitions": [
      {
        "transitionId": "mark-indexed",
        "from": "scanned",
        "to": "indexed",
        "whenSignal": "SOURCE_INDEX_CREATED"
      },
      {
        "transitionId": "reject-reconciliation",
        "from": "indexed",
        "to": "rejected",
        "whenSignal": "BLOCKING_RECONCILIATION_FAILURE"
      }
    ],
    "invalidTransitionDisposition": "STATE_TRANSITION_NOT_AUTHORIZED",
    "concurrencyPolicy": "compare-current-state",
    "transitionReceiptRequired": true
  }
}
```

This is the data counterpart for:

```text
assignment
push
set
delete
increment
status change
mutable collection update
```

# 12. Meaning hidden in text → vocabulary/text authority

This is the broadest mechanic and needs sub-classification.

Text may be:

```text
canonical vocabulary
user-facing message
template
query
prompt
policy sentence
disposition
error message
formatting fragment
embedded JSON or SQL
```

```json
{
  "mechanicKind": "meaning-hidden-in-text",
  "authority": {
    "authorityKind": "text-meaning-authority.v1",
    "textAuthorityId": "query-source-not-resolved-message",
    "textKind": "user-facing-message",
    "semanticConceptId": "query-source-not-resolved",
    "vocabularyId": "source-facts-query-dispositions.v1",
    "template": {
      "templateId": "query-source-not-resolved.v1",
      "segments": [
        {
          "kind": "literal",
          "value": "No admitted query source could be resolved."
        }
      ]
    },
    "localizationPolicy": "localizable",
    "renderingProfileId": "plain-text.v1",
    "semanticDisposition": "QUERY_SOURCE_NOT_RESOLVED"
  }
}
```

For classification literals:

```json
{
  "textKind": "canonical-vocabulary-term",
  "termId": "feature-test-missing",
  "canonicalValue": "FEATURE_TEST_MISSING",
  "conceptId": "feature-test-lineage-disposition"
}
```

The rule should be:

> Text that carries identity, policy, classification, mapping, instruction, or outcome meaning must resolve to governed vocabulary or text authority.

# Proposed schema shape

I would add a new required or progressively admitted member beneath `sourceAuthority`:

```json
{
  "sourceAuthority": {
    "mechanicAuthorities": [
      {
        "authorityType": "executable-mechanic-authority.v1",
        "mechanicAuthorityId": "resolve-target-disposition",
        "mechanicKind": "branch",
        "lineage": {},
        "semanticSubject": {},
        "inputs": [],
        "authority": {},
        "outputs": [],
        "execution": {},
        "proof": {},
        "sourceEvidence": [],
        "lifecycle": {}
      }
    ]
  }
}
```

And define the kind-specific member as:

```json
{
  "oneOf": [
    { "$ref": "#/$defs/branchMechanicAuthority" },
    { "$ref": "#/$defs/iterationMechanicAuthority" },
    { "$ref": "#/$defs/exceptionHandlingMechanicAuthority" },
    { "$ref": "#/$defs/throwMechanicAuthority" },
    { "$ref": "#/$defs/objectConstructionMechanicAuthority" },
    { "$ref": "#/$defs/serializationMechanicAuthority" },
    { "$ref": "#/$defs/normalizationMechanicAuthority" },
    { "$ref": "#/$defs/validationMechanicAuthority" },
    { "$ref": "#/$defs/fallbackMechanicAuthority" },
    { "$ref": "#/$defs/retryMechanicAuthority" },
    { "$ref": "#/$defs/stateMutationMechanicAuthority" },
    { "$ref": "#/$defs/textMeaningMechanicAuthority" }
  ]
}
```

# Do not discard the existing arrays yet

The existing structures remain useful:

```text
decisions
iterations
failurePolicies
projectionMappings
resultContracts
```

But the new mechanic authority should become the **canonical coverage and projection index**.

It can reference the existing authority records:

```json
{
  "mechanicKind": "branch",
  "authority": {
    "authorityKind": "decision-authority-reference.v1",
    "decisionId": "resolve-target-disposition"
  }
}
```

That prevents duplication while giving every mechanic a uniform lookup surface.

```text
mechanic authority
→ points to complete authority family
→ binds source evidence
→ binds canonical lineage
→ declares projection readiness
```

# SQL shape

Preserve the admitted canonical contract document and normalize its complete
ordered JSON authority tree before loading kind-specific query tables. The
canonical document is the immutable byte authority; normalized nodes are the
reconstructable and queryable semantic representation. Their digests must
agree before projection.

```text
authority.ContractDocument
authority.ContractNode
```

Use one common mechanic table plus kind-specific tables.

```text
authority.ExecutableMechanicAuthority
authority.MechanicSourceEvidence
authority.MechanicInput
authority.MechanicOutput
authority.MechanicProofRequirement
```

Common columns:

```text
MechanicAuthorityKey
ContractSnapshotId
MechanicAuthorityId
MechanicKind
FeatureId
ScenarioId
ObligationId
ResponsibilityId
ArtifactId
AuthorityReferenceType
AuthorityReferenceId
LifecycleStatus
AdmissionDisposition
ProjectionReadiness
AuthorityDigest
```

Kind-specific tables:

```text
authority.DecisionRule
authority.IterationModel
authority.FailureClassification
authority.TerminalResult
authority.ProjectionField
authority.SerializationProfile
authority.NormalizationOperation
authority.ValidationConstraint
authority.AlternativeSelection
authority.RetryPolicy
authority.StateTransition
authority.TextMeaning
```

# Projection-readiness dispositions

Every observed occurrence should resolve to one of:

```text
MECHANIC_AUTHORITY_ADMITTED
MECHANIC_AUTHORITY_PROPOSED
MECHANIC_AUTHORITY_INCOMPLETE
MECHANIC_AUTHORITY_AMBIGUOUS
MECHANIC_AUTHORITY_NOT_FOUND
MECHANIC_NOT_APPLICABLE
MECHANIC_KERNEL_OR_ADAPTER_ALLOWED
MECHANIC_NOT_CURRENTLY_PROJECTABLE
```

And where admitted:

```text
BODY_REPLACEMENT_PROJECTABLE
BODY_REPLACEMENT_REQUIRES_ADAPTER
BODY_REPLACEMENT_REQUIRES_KERNEL_PRIMITIVE
BODY_REPLACEMENT_BLOCKED_BY_MISSING_AUTHORITY
```

# The automatic projection query

This is the query the refactoring agent ultimately needs:

```sql
SELECT
    occurrence.MechanicOccurrenceId,
    occurrence.MechanicKind,
    occurrence.SourceReferenceId,
    occurrence.EnclosingSymbolId,

    authority.MechanicAuthorityId,
    authority.AuthorityReferenceType,
    authority.AuthorityReferenceId,
    authority.ProjectionReadiness,

    lineage.FeatureId,
    lineage.ScenarioId,
    lineage.ObligationId,
    lineage.ResponsibilityId
FROM observation.ExecutableMechanicOccurrence occurrence
LEFT JOIN binding.MechanicAuthorityBinding binding
  ON binding.MechanicOccurrenceId = occurrence.MechanicOccurrenceId
LEFT JOIN authority.ExecutableMechanicAuthority authority
  ON authority.MechanicAuthorityKey = binding.MechanicAuthorityKey
LEFT JOIN lineage.Responsibility lineage
  ON lineage.ResponsibilityId = authority.ResponsibilityId
WHERE occurrence.MechanicKind IN (
    'branch',
    'iteration',
    'exception-handling',
    'throw',
    'object-construction',
    'serialization',
    'normalization',
    'validation',
    'fallback',
    'retry',
    'state-mutation',
    'meaning-hidden-in-text'
);
```

Then:

```text
observed mechanic
→ authority counterpart
→ canonical lineage
→ target projection profile
→ replacement body
```

# The critical standard

The final invariant should be:

> **Every forbidden executable mechanic occurrence must be bound to one source-backed mechanic authority whose kind-specific data is sufficient to re-express the same meaning through the semantic kernel and a target-language projector.**

And the replacement test is:

```text
Observed legacy behavior
        =
direct semantic execution
        =
projected-body execution
        =
declared scenario expectation
```

That is the complete bridge from mechanic detection to automatic authority proposal, admission, and body replacement.
