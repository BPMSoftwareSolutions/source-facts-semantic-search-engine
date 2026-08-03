# Authority Candidate Projections

**Generated:** 2026-08-02T21:28:47.516Z
**Total Candidates:** 44
**Coverage Status:** Authority Conformance Ratio: 0.0%

**Source workspace:** `C:\lab\repos\contract-driven-artifact-governance-engine\lib\`

---

## Overview

The source facts engine has automatically projected **44 authority candidate scaffolds** from observed executable mechanics across the indexed codebase.

This report demonstrates the transformation from **observed code** (actual source) to **projected candidates** (pre-shaped semantic authority scaffolds). Each candidate captures structural evidence extracted directly from the code, requiring only semantic confirmation from domain experts.

The agent is no longer staring at a blank schema—it is **completing a mostly projected semantic record**.

---

## Branch → Decision Authority Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:27`

**Observed code:**

```
    22: function readSegments(source, path) {
    23:   return path.reduce((value, segment) => value?.[segment], source);
    24: }
    25: 
    26: function executeApplicationProjection(authority, browserPort) {
→   27:   if (!browserPort || typeof browserPort.document !== "object") {
    28:     throw new Error(authority.failure.message);
    29:   }
    30:   return Object.fromEntries(
    31:     authority.projection.fields.map((field) => [
    32:       field.outputField,
```

**Projected candidate:**

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

**Unresolved decisions:**
- confirm condition is complete and accurate
- confirm all outcomes are identified
- confirm no-match behavior
- confirm result type per outcome
- confirm decision priority/precedence

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Throw → Failure Disposition Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:28`

**Observed code:**

```
    23:   return path.reduce((value, segment) => value?.[segment], source);
    24: }
    25: 
    26: function executeApplicationProjection(authority, browserPort) {
    27:   if (!browserPort || typeof browserPort.document !== "object") {
→   28:     throw new Error(authority.failure.message);
    29:   }
    30:   return Object.fromEntries(
    31:     authority.projection.fields.map((field) => [
    32:       field.outputField,
    33:       readSegments(browserPort, field.sourcePath)
```

**Projected candidate:**

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

**Unresolved decisions:**
- confirm failure identity (type, code, message)
- confirm precondition
- confirm whether canonical behavior or fallback
- confirm error classification

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Object Construction → Projection Mapping Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:28`

**Observed code:**

```
    23:   return path.reduce((value, segment) => value?.[segment], source);
    24: }
    25: 
    26: function executeApplicationProjection(authority, browserPort) {
    27:   if (!browserPort || typeof browserPort.document !== "object") {
→   28:     throw new Error(authority.failure.message);
    29:   }
    30:   return Object.fromEntries(
    31:     authority.projection.fields.map((field) => [
    32:       field.outputField,
    33:       readSegments(browserPort, field.sourcePath)
```

**Projected candidate:**

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

**Unresolved decisions:**
- confirm result contract identity
- confirm all field mappings are correct
- confirm transformation functions
- confirm field ordering semantics
- confirm omitted-field policy

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Iteration → Iteration Authority Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:16`

**Observed code:**

```
    11: 
    12: import { executeBrowserSemanticAuthority } from "./browser-semantic-runtime.mjs";
    13: 
    14: function readPath(source, path) {
    15:   let value = source;
→   16:   for (const segment of path.split(".")) {
    17:     value = value?.[segment];
    18:   }
    19:   return value;
    20: }
    21: 
```

**Projected candidate:**

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

**Unresolved decisions:**
- identify collection source
- confirm iteration order is semantically significant
- confirm per-item processing
- confirm collection/aggregation behavior
- confirm stopping conditions

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## State Mutation → State Transition Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:17`

**Observed code:**

```
    12: import { executeBrowserSemanticAuthority } from "./browser-semantic-runtime.mjs";
    13: 
    14: function readPath(source, path) {
    15:   let value = source;
    16:   for (const segment of path.split(".")) {
→   17:     value = value?.[segment];
    18:   }
    19:   return value;
    20: }
    21: 
    22: function readSegments(source, path) {
```

**Projected candidate:**

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

**Unresolved decisions:**
- identify mutated state
- confirm preconditions
- prove safety
- confirm idempotency
- confirm no side effects beyond declared state

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Serialization → Serialization Profile Candidate

**Count:** 4 candidate(s) of this type

### Example from `browser-semantic-runtime.mjs:44`

**Observed code:**

```
    39: }
    40: 
    41: function typedValueMatches(typedValue, value) {
    42:   return (
    43:     typedValue.type === jsonType(value) &&
→   44:     JSON.stringify(typedValue.value) === JSON.stringify(value)
    45:   );
    46: }
    47: 
    48: function sourceValue(value) {
    49:   return value?.state === "value" ? value.value : value;
```

**Projected candidate:**

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

**Unresolved decisions:**
- confirm encoding format
- confirm canonicalization strategy
- confirm determinism requirement
- confirm whether hash-sensitive

**Why this pattern matters:**
This pattern appears **4 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Validation → Validation Policy Candidate

**Count:** 3 candidate(s) of this type

### Example from `governed-artifact-engine.mjs:699`

**Observed code:**

```
   694:   );
   695:   if (!bundleArtifact) {
   696:     throw new Error("Deterministic ontology bundle is unresolved.");
   697:   }
   698:   const bundle = artifactSemanticExecutionBundle(bundleArtifact);
→  699:   if (!bundle || validateSemanticExecutionBundle(bundle).length > 0) {
   700:     throw new Error("Deterministic ontology bundle is not closed.");
   701:   }
   702:   return { bundleArtifact, bundle };
   703: }
   704: 
```

**Projected candidate:**

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

**Unresolved decisions:**
- identify validated contract
- confirm success path behavior
- confirm failure path behavior
- confirm error classification

**Why this pattern matters:**
This pattern appears **3 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Exception Handling → Failure Observation Candidate

**Count:** 4 candidate(s) of this type

### Example from `browser-application-runtime.mjs:154`

**Observed code:**

```
   149:       writePath(scope, step.target, evaluate(step.value, scope));
   150:       continue;
   151:     }
   152:     if (step.operation === "invoke-authority") {
   153:       const bundleId = scope.context.authoritySelections[step.authoritySelection];
→  154:       try {
   155:         writePath(
   156:           scope,
   157:           step.target,
   158:           executeBrowserSemanticAuthority(
   159:             scope.bundles.get(bundleId),
```

**Projected candidate:**

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

**Unresolved decisions:**
- identify caught error types
- confirm observe-only vs transform behavior
- confirm error classification authority
- confirm post-catch disposition

**Why this pattern matters:**
This pattern appears **4 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Fallback → Fallback Policy Candidate

**Count:** 5 candidate(s) of this type

### Example from `browser-application-runtime.mjs:27`

**Observed code:**

```
    22: function readSegments(source, path) {
    23:   return path.reduce((value, segment) => value?.[segment], source);
    24: }
    25: 
    26: function executeApplicationProjection(authority, browserPort) {
→   27:   if (!browserPort || typeof browserPort.document !== "object") {
    28:     throw new Error(authority.failure.message);
    29:   }
    30:   return Object.fromEntries(
    31:     authority.projection.fields.map((field) => [
    32:       field.outputField,
```

**Projected candidate:**

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

**Unresolved decisions:**
- confirm missing-value detection
- confirm fallback value
- confirm whether fallback is canonical or emergency
- confirm no data loss

**Why this pattern matters:**
This pattern appears **5 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Normalization → Normalization Candidate

**Count:** 3 candidate(s) of this type

### Example from `governed-artifact-engine.mjs:185`

**Observed code:**

```
   180:   }
   181:   if (value && typeof value === "object") {
   182:     return Object.fromEntries(
   183:       Object.keys(value)
   184:         .sort()
→  185:         .map((key) => [key, canonicalize(value[key])])
   186:     );
   187:   }
   188:   return value;
   189: }
   190: 
```

**Projected candidate:**

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

**Unresolved decisions:**
- identify all source variants
- confirm canonical target
- confirm lossiness
- confirm classification

**Why this pattern matters:**
This pattern appears **3 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

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

## The Productivity Advantage

This is the huge productivity advantage of projection:

**Without authority projection:** Agents must read 9,473-line files and manually construct semantic records from scratch. High token cost, high uncertainty, high noise.

**With authority projection:** Agents confirm meaning in pre-shaped JSON scaffolds. Low token cost, high precision, only the semantic decisions remain.

Each candidate shows:
- **Source location:** Exact file, line, column of the mechanic
- **Observed code:** Real code snippet from the source (when available)
- **Extracted structure:** Conditions, fields, invocations parsed from syntax
- **Unresolved decisions:** Precisely what a human must confirm

### What Each Candidate Represents

All candidates are `AUTHORITY_CANDIDATE_PROJECTED` — they capture everything syntax reveals, with flags marking what only semantics can determine.

**Examples of unresolved semantic decisions across types:**

- **Decision:** "Are all predicates identified? What should no-match do? What is the result type?"
- **Failure:** "Is this canonical failure behavior or error-handling fallback?"
- **Projection:** "Are all output fields necessary? Is each transformation correct? Are fields omitted intentionally?"
- **Iteration:** "Is order semantically significant? What stopping conditions matter? What happens to partial results?"
- **State Mutation:** "Under what preconditions is this safe? Is it idempotent? Is it commutative?"
- **Serialization:** "What canonicalization strategy? Is determinism required? Hash-sensitive?"

---

## Next Steps for Your Team

1. **Review candidates** with domain experts to resolve unresolved decisions
2. **Bind candidates to authority** once semantic meaning is confirmed
3. **Mark as `AUTHORITY_BOUND`** when all unresolved decisions are answered
4. **Recalculate coverage** — as binding progresses, conformance ratio rises
5. **Generate replacement code** — when conformance reaches 100%, the engine can project deterministic replacement implementations

The engine does not claim syntax alone reveals complete meaning. Rather, it surfaces exactly where human semantic judgment is required, and provides a scaffold so agents spend their tokens on meaning, not structure.

