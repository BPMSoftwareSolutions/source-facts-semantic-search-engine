# Authority Candidate Projections

**Generated:** 2026-08-02T21:28:47.516Z
**Total Candidates:** 44
**Coverage Status:** Authority Conformance Ratio: 0.0%

---

## Overview

The source facts engine has automatically projected **44 authority candidate scaffolds** from observed executable mechanics across the indexed codebase. Each candidate captures structural evidence from the code, requiring only semantic confirmation from domain experts.

This report demonstrates the transformation from observed code mechanics to pre-shaped semantic authority candidates.

---

## Branch → Decision Authority Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:27

**Observed Mechanic:** `branch`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "resolve-undefined",
  "responsibility": {
    "description": "Decision point in undefined"
  },
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "branch",
    "startLine": 27,
    "startColumn": 3,
    "sourceSnippet": "<source snippet unavailable>"
  },
  "inputs": [
    {
      "inputId": "condition",
      "candidatePath": "<condition-path>",
      "observedType": "unknown",
      "observedComparison": "unknown",
      "observedValue": "<condition-value>",
      "requiredHumanResolution": [
        "extract condition from source",
        "confirm input type",
        "confirm comparison operator"
      ]
    }
  ],
  "candidateOutcomes": [
    {
      "outcomeId": "outcome-true",
      "description": "Truthy branch",
      "observedEffect": "<effect>",
      "resultExpression": "<result>",
      "requiredHumanResolution": [
        "extract true branch outcome"
      ]
    },
    {
      "outcomeId": "outcome-false",
      "description": "Falsy branch",
      "observedEffect": "<effect>",
      "resultExpression": "<result>",
      "requiredHumanResolution": [
        "extract false branch outcome"
      ]
    }
  ],
  "nomatchBehavior": {
    "description": "Behavior when no condition matches",
    "observedBehavior": "unknown",
    "requiredHumanResolution": [
      "confirm no-match handling"
    ]
  },
  "semanticCompleteness": {
    "allConditionsIdentified": false,
    "allOutcomesIdentified": false,
    "resultTypesClarified": false,
    "priorityOrdering": "unspecified"
  },
  "requiredHumanResolution": [
    "confirm condition is complete and accurate",
    "confirm all outcomes are identified",
    "confirm no-match behavior",
    "confirm result type per outcome",
    "confirm decision priority/precedence"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- confirm condition is complete and accurate
- confirm all outcomes are identified
- confirm no-match behavior
- confirm result type per outcome
- confirm decision priority/precedence

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Throw → Failure Disposition Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:28

**Observed Mechanic:** `throw`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "failure-disposition-authority-candidate.v1",
  "candidateId": "failure-error",
  "responsibility": {},
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "throw",
    "startLine": 28,
    "sourceSnippet": "throw <error>"
  },
  "failureIdentity": {
    "errorType": "Error",
    "errorCode": null,
    "errorMessage": null,
    "canonicalFailureId": "failure-error"
  },
  "precondition": {
    "description": "Condition that triggers this throw",
    "observedCondition": "<inferred from context>",
    "requiredHumanResolution": [
      "identify exact precondition that triggers this throw",
      "confirm whether this is canonical vs error-handling throw"
    ]
  },
  "resultUnion": {
    "successPath": "<infer from function return type>",
    "failurePath": "Error",
    "description": "This function returns success OR this failure type"
  },
  "requiredHumanResolution": [
    "confirm failure identity (type, code, message)",
    "confirm precondition",
    "confirm whether canonical behavior or fallback",
    "confirm error classification"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- confirm failure identity (type, code, message)
- confirm precondition
- confirm whether canonical behavior or fallback
- confirm error classification

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Object Construction → Projection Mapping Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:28

**Observed Mechanic:** `object-construction`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "projection-mapping-candidate.v1",
  "projectionMappingId": "project-undefined-result",
  "responsibility": {},
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "object-construction",
    "startLine": 28,
    "sourceSnippet": "return { ... }"
  },
  "resultContract": {
    "contractId": "undefined-result",
    "description": "Result object constructed by this function"
  },
  "fields": [
    {
      "outputPath": [
        "field"
      ],
      "sourceExpression": "<source>",
      "sourceType": "unknown",
      "transformationRequired": false,
      "requiredHumanResolution": [
        "extract field mapping from source"
      ]
    }
  ],
  "omittedFieldPolicy": {
    "description": "Fields from input that are NOT included in output",
    "omittedFields": [],
    "requiredHumanResolution": [
      "identify which input fields are omitted",
      "confirm omission is intentional",
      "confirm no data loss"
    ]
  },
  "requiredHumanResolution": [
    "confirm result contract identity",
    "confirm all field mappings are correct",
    "confirm transformation functions",
    "confirm field ordering semantics",
    "confirm omitted-field policy"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- confirm result contract identity
- confirm all field mappings are correct
- confirm transformation functions
- confirm field ordering semantics
- confirm omitted-field policy

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Iteration → Iteration Authority Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:16

**Observed Mechanic:** `iteration`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "iteration-authority-candidate.v1",
  "iterationId": "iterate-undefined",
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "iteration",
    "startLine": 16,
    "sourceSnippet": "for (...) { ... }"
  },
  "sourceCollectionExpression": "<collection>",
  "itemIdentity": "<item-variable>",
  "orderCandidate": "source-order",
  "forEach": {
    "observedInvocation": "<function-called>",
    "inputExpression": "<item-expression>"
  },
  "collect": {
    "target": "<collection-variable>",
    "operation": "append"
  },
  "stopWhen": {
    "observedExpression": "<stop-condition>",
    "candidateDisposition": "<stop-on-condition>"
  },
  "requiredHumanResolution": [
    "identify collection source",
    "confirm iteration order is semantically significant",
    "confirm per-item processing",
    "confirm collection/aggregation behavior",
    "confirm stopping conditions"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- identify collection source
- confirm iteration order is semantically significant
- confirm per-item processing
- confirm collection/aggregation behavior
- confirm stopping conditions

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## State Mutation → State Transition Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:17

**Observed Mechanic:** `state-mutation`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "state-transition-authority-candidate.v1",
  "stateTransitionId": "transition-undefined",
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "state-mutation",
    "startLine": 17,
    "sourceSnippet": "<mutation>"
  },
  "mutatedState": {
    "stateIdentity": "<variable-or-object>",
    "currentValueType": "<type>",
    "description": "What state is being modified"
  },
  "preconditions": {
    "description": "Conditions that must be true for this mutation",
    "requirements": [],
    "requiredHumanResolution": [
      "identify all preconditions",
      "confirm mutation safety",
      "confirm idempotency"
    ]
  },
  "proof": {
    "proofRequirement": "Demonstrate this mutation is safe under concurrency",
    "idempotent": "unknown",
    "commutative": "unknown",
    "requiredHumanResolution": [
      "confirm idempotency guarantee",
      "confirm commutativity guarantee",
      "confirm no deadlock risk"
    ]
  },
  "requiredHumanResolution": [
    "identify mutated state",
    "confirm preconditions",
    "prove safety",
    "confirm idempotency",
    "confirm no side effects beyond declared state"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- identify mutated state
- confirm preconditions
- prove safety
- confirm idempotency
- confirm no side effects beyond declared state

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Serialization → Serialization Profile Candidate

**Count:** 4 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-semantic-runtime.mjs:44

**Observed Mechanic:** `serialization`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "serialization-profile-candidate.v1",
  "serializationProfileId": "serialize-undefined",
  "source": {
    "modulePath": "browser-semantic-runtime.mjs",
    "mechanic": "serialization",
    "startLine": 44,
    "sourceSnippet": "JSON.stringify(...)"
  },
  "encoding": {
    "format": "unknown",
    "charset": "utf-8",
    "determinism": {
      "required": true,
      "description": "Same input must always produce same bytes",
      "observedStrategy": "unknown"
    }
  },
  "canonicalization": {
    "fieldOrdering": {
      "strategy": "unknown",
      "requiredHumanResolution": [
        "confirm field order strategy"
      ]
    },
    "whitespace": {
      "strategy": "unknown",
      "requiredHumanResolution": [
        "confirm whitespace handling"
      ]
    },
    "escaping": {
      "strategy": "unknown",
      "requiredHumanResolution": [
        "confirm escape strategy"
      ]
    }
  },
  "resultContractId": "undefined-serialized",
  "requiredHumanResolution": [
    "confirm encoding format",
    "confirm canonicalization strategy",
    "confirm determinism requirement",
    "confirm whether hash-sensitive"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- confirm encoding format
- confirm canonicalization strategy
- confirm determinism requirement
- confirm whether hash-sensitive

**Why this pattern matters:**
This pattern appears **4 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Validation → Validation Policy Candidate

**Count:** 3 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** governed-artifact-engine.mjs:699

**Observed Mechanic:** `validation`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "validation-policy-candidate.v1",
  "validationPolicyId": "validate-undefined",
  "source": {
    "modulePath": "governed-artifact-engine.mjs",
    "mechanic": "validation",
    "startLine": 699,
    "sourceSnippet": "<validation check>"
  },
  "validatedContract": {
    "contractId": "<contract being validated>",
    "schemaPath": "<path-to-schema>",
    "validator": "<ajv|joi|custom>"
  },
  "successPath": {
    "behavior": "continue",
    "resultType": "<type-after-success>"
  },
  "failurePath": {
    "behavior": "throw",
    "errorIdentity": "<error-type>",
    "requiredHumanResolution": [
      "confirm error handling strategy",
      "confirm error type and message"
    ]
  },
  "requiredHumanResolution": [
    "identify validated contract",
    "confirm success path behavior",
    "confirm failure path behavior",
    "confirm error classification"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- identify validated contract
- confirm success path behavior
- confirm failure path behavior
- confirm error classification

**Why this pattern matters:**
This pattern appears **3 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Exception Handling → Failure Observation Candidate

**Count:** 4 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:154

**Observed Mechanic:** `exception-handling`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "failure-observation-candidate.v1",
  "failureObservationId": "observe-failure-undefined",
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "exception-handling",
    "startLine": 154,
    "sourceSnippet": "try { ... } catch { ... }"
  },
  "caughtErrors": {
    "errorTypes": [
      "<error-type>"
    ],
    "description": "Which error types are observed here"
  },
  "observationOnly": {
    "description": "Does catch only observe, or also transform/rethrow?",
    "requiredHumanResolution": [
      "confirm catch block observes only vs transforms",
      "confirm error classification"
    ]
  },
  "postCatchBehavior": {
    "behavior": "<continue|rethrow|transform>",
    "nextDisposition": "<what-happens-after>"
  },
  "requiredHumanResolution": [
    "identify caught error types",
    "confirm observe-only vs transform behavior",
    "confirm error classification authority",
    "confirm post-catch disposition"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- identify caught error types
- confirm observe-only vs transform behavior
- confirm error classification authority
- confirm post-catch disposition

**Why this pattern matters:**
This pattern appears **4 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Fallback → Fallback Policy Candidate

**Count:** 5 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** browser-application-runtime.mjs:27

**Observed Mechanic:** `fallback`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "fallback-policy-candidate.v1",
  "fallbackPolicyId": "fallback-undefined",
  "source": {
    "modulePath": "browser-application-runtime.mjs",
    "mechanic": "fallback",
    "startLine": 27,
    "sourceSnippet": "value ?? default"
  },
  "missingValueDetection": {
    "condition": "<null|undefined|falsy>",
    "observedExpression": "<expression>",
    "requiredHumanResolution": [
      "confirm missing-value condition"
    ]
  },
  "fallbackValue": {
    "expression": "<fallback-expression>",
    "type": "<fallback-type>",
    "requiredHumanResolution": [
      "confirm fallback value is correct"
    ]
  },
  "fallbackNature": {
    "isCanonical": false,
    "isEmergency": true,
    "description": "Is this a normal default or emergency fallback?"
  },
  "requiredHumanResolution": [
    "confirm missing-value detection",
    "confirm fallback value",
    "confirm whether fallback is canonical or emergency",
    "confirm no data loss"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- confirm missing-value detection
- confirm fallback value
- confirm whether fallback is canonical or emergency
- confirm no data loss

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Normalization → Normalization Candidate

**Count:** 3 candidate(s)

**Observed mechanic pattern:** Executable code containing a specific control-flow or data-transformation mechanic.

**Projected candidate:** Pre-shaped JSON authority scaffold with:
- Source location (file, line)
- Structural evidence (conditions, fields, invocations)
- Flagged unresolved decisions for human/agent completion

### Example

**Source Location:** governed-artifact-engine.mjs:185

**Observed Mechanic:** `normalization`

**Projected Candidate:**

```json
{
  "authorityCandidateType": "normalization-authority-candidate.v1",
  "normalizationId": "normalize-undefined",
  "source": {
    "modulePath": "governed-artifact-engine.mjs",
    "mechanic": "normalization",
    "startLine": 185,
    "sourceSnippet": "<transformation>"
  },
  "sourceVariants": {
    "description": "What forms can input take?",
    "variants": [
      "<variant1>",
      "<variant2>"
    ],
    "requiredHumanResolution": [
      "identify all source variants"
    ]
  },
  "canonicalTarget": {
    "description": "What is the single canonical form?",
    "form": "<canonical-representation>",
    "requiredHumanResolution": [
      "confirm canonical form"
    ]
  },
  "lossiness": {
    "isLossy": false,
    "description": "Does transformation lose information?",
    "requiredHumanResolution": [
      "confirm lossiness"
    ]
  },
  "classification": {
    "applied": "<classification>",
    "requiredHumanResolution": [
      "confirm classification applied"
    ]
  },
  "requiredHumanResolution": [
    "identify all source variants",
    "confirm canonical target",
    "confirm lossiness",
    "confirm classification"
  ],
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

**Unresolved Decisions:**
- identify all source variants
- confirm canonical target
- confirm lossiness
- confirm classification

**Why this pattern matters:**
This pattern appears **3 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare meaning that is currently hidden in code.

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Mechanics Observed | 44 |
| Unique Candidates Generated | 44 |
| Fully Authorized | 0 |
| Partially Covered | 0 |
| Unresolved (Awaiting Semantic Decision) | 44 |
| Authority Conformance Ratio | 0.0% |
| Admission Gate Status | NOT_READY |

---

## What Each Candidate Represents

Each authority candidate is a **mostly-projected semantic record**. The structure is derived directly from observed code:

- **Source location:** Exact file, line, and column of the mechanic
- **Mechanic type:** Classification (branch, throw, iteration, etc.)
- **Structural evidence:** Extracted expressions, field names, invocations
- **Unresolved decisions:** Specific questions only domain experts can answer
- **Status:** All candidates are `AUTHORITY_CANDIDATE_PROJECTED` — ready for semantic review

### What Requires Human/Agent Decision

Each candidate flags exactly what is ambiguous or hidden in code:

- **Decision candidates:** "Are all predicates identified? What should no-match do?"
- **Failure candidates:** "Is this canonical failure or error handling?"
- **Projection candidates:** "Are all output fields necessary? Is transformation correct?"
- **Serialization candidates:** "What canonicalization strategy applies here?"
- **State mutation candidates:** "Under what preconditions is this safe? Is it idempotent?"

---

## Next Steps

1. **Review candidates** with domain experts to resolve unresolved decisions
2. **Bind candidates to authority** once semantic meaning is confirmed
3. **Recalculate coverage** as binding progresses
4. **Generate replacement code** when authority conformance reaches 100%

The engine does not claim that syntax reveals complete product meaning. Rather, it surfaces exactly where human judgment is required, eliminating the need to reconstruct structure from scratch.

