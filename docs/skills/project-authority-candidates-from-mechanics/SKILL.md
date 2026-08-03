---
name: project-authority-candidates-from-mechanics
description: Transform observed executable mechanics into JSON semantic authority candidate scaffolds. Maps each mechanic occurrence (branch, throw, validation, etc.) to its target authority family, extracts evidence from source code, and generates pre-shaped JSON with unresolved semantic decisions flagged for human/agent completion.
---

# Project Authority Candidates from Mechanics

This skill implements the **Author** stage of the core migration loop:

```
Observed mechanics
        ↓
Authority family resolution
        ↓
Evidence extraction
        ↓
Candidate JSON projection
        ↓
Semantic decision identification
        ↓
Authority candidates (ready for human/agent completion)
```

Instead of asking an agent to author semantic authority from scratch, you hand it a partially-filled JSON scaffold with the hard structural work already done. The agent confirms meaning instead of reconstructing structure.

## When to Use This

- You have **observed mechanics** (from the `generate-test-scenarios-from-source-facts` skill)
- You need to **migrate code to declared authority** (the core migration loop)
- You want to **reduce agent token cost** by pre-structuring the semantic decisions
- You need **continuous authority enforcement** (track which mechanics are covered, which aren't)
- You're building a **legacy semantic extraction system** that transforms hidden code meaning into explicit JSON

## Prerequisites

1. **Observed mechanics inventory** (list of mechanic type, source location, enclosing function)
2. **Source code** (to extract expressions, invocations, field names, etc.)
3. **Authority family mapping** (mechanic type → target authority family)
4. **Responsibility/domain context** (what business domain each function belongs to)

## Authority Family Mapping Reference

This is your lookup table for step 1:

```json
{
  "mechanicAuthorityProjectionProfiles": [
    {
      "mechanic": "branch",
      "description": "Conditional decisions with multiple outcomes",
      "targetAuthorityFamilies": [
        "decision",
        "classification",
        "result-selection"
      ],
      "keySemanticDimensions": [
        "condition/predicate",
        "outcomes (all branches)",
        "no-match behavior",
        "result semantics per outcome"
      ]
    },
    {
      "mechanic": "iteration",
      "description": "Loop-based processing of collections",
      "targetAuthorityFamilies": [
        "iteration",
        "execution-model",
        "aggregation"
      ],
      "keySemanticDimensions": [
        "collection source",
        "iteration order (semantically significant?)",
        "per-item processing",
        "aggregation/collection",
        "stopping conditions",
        "error/blocking behavior"
      ]
    },
    {
      "mechanic": "exception-handling",
      "description": "Try/catch blocks capturing errors",
      "targetAuthorityFamilies": [
        "failure-observation",
        "failure-policy"
      ],
      "keySemanticDimensions": [
        "what error types are caught",
        "observe-only vs. transform behavior",
        "error classification",
        "disposition after catch"
      ]
    },
    {
      "mechanic": "throw",
      "description": "Explicit error/failure disposition",
      "targetAuthorityFamilies": [
        "failure-disposition",
        "result-union"
      ],
      "keySemanticDimensions": [
        "error/failure identity",
        "error message/code",
        "precondition that triggers throw",
        "whether this is canonical vs. fallback failure"
      ]
    },
    {
      "mechanic": "object-construction",
      "description": "Building output objects/DTOs",
      "targetAuthorityFamilies": [
        "projection-mapping",
        "result-contract"
      ],
      "keySemanticDimensions": [
        "every output field",
        "source of each field (expression, constant, or transformation)",
        "whether all input fields map to output",
        "omitted-field policy",
        "field ordering semantics"
      ]
    },
    {
      "mechanic": "serialization",
      "description": "Encoding data to wire/storage format",
      "targetAuthorityFamilies": [
        "serialization-profile"
      ],
      "keySemanticDimensions": [
        "encoding (JSON, MessagePack, etc.)",
        "canonicalization (consistent order/whitespace?)",
        "newline policy",
        "escape/quote handling",
        "determinism requirement"
      ]
    },
    {
      "mechanic": "normalization",
      "description": "Data transformation to canonical form",
      "targetAuthorityFamilies": [
        "translation",
        "classification",
        "projection"
      ],
      "keySemanticDimensions": [
        "source variants (what forms exist?)",
        "canonical target form",
        "whether transformation is lossy",
        "classification applied"
      ]
    },
    {
      "mechanic": "validation",
      "description": "Schema/contract validation checks",
      "targetAuthorityFamilies": [
        "schema-binding",
        "validation-policy",
        "failure-disposition"
      ],
      "keySemanticDimensions": [
        "what contract/schema is validated",
        "success path behavior",
        "failure path behavior",
        "error classification"
      ]
    },
    {
      "mechanic": "fallback",
      "description": "Default values or null coalescing",
      "targetAuthorityFamilies": [
        "decision",
        "missing-value-policy"
      ],
      "keySemanticDimensions": [
        "missing/null detection",
        "fallback value or expression",
        "whether fallback is canonical or emergency"
      ]
    },
    {
      "mechanic": "retry",
      "description": "Retry loops with continuation logic",
      "targetAuthorityFamilies": [
        "continuation-policy",
        "iteration",
        "failure-policy"
      ],
      "keySemanticDimensions": [
        "what triggers retry (error type, condition)",
        "retry limits/backoff",
        "progress tracking",
        "stop conditions"
      ]
    },
    {
      "mechanic": "state-mutation",
      "description": "Side effects and state changes",
      "targetAuthorityFamilies": [
        "state-transition",
        "effect",
        "proof-requirement"
      ],
      "keySemanticDimensions": [
        "what state is mutated",
        "preconditions (when allowed)",
        "proof of side-effect safety",
        "idempotency/commutativity"
      ]
    },
    {
      "mechanic": "meaning-hidden-in-text",
      "description": "Semantic content encoded as strings/comments",
      "targetAuthorityFamilies": [
        "concept",
        "fact",
        "taxonomy",
        "policy",
        "identifier"
      ],
      "keySemanticDimensions": [
        "what concept/meaning is hidden",
        "where it appears",
        "should it be elevated to a declaration"
      ]
    }
  ]
}
```

## Workflow

### Step 1: Gather Observed Mechanics

Use the `generate-test-scenarios-from-source-facts` skill output. You need:
- **Mechanic type** (branch, throw, etc.)
- **Source location** (file, line, column)
- **Enclosing symbol** (function/class name)
- **Mechanic detail** (condition expression, invocation, field names, etc.)

Example input:
```json
{
  "mechanic": "branch",
  "modulePath": "governed-artifact-engine.mjs",
  "startLine": 215,
  "startColumn": 3,
  "enclosingSymbol": "validateConformanceProfile",
  "conditionExpression": "profile.version !== expectedVersion"
}
```

### Step 2: Resolve Authority Family

Look up the mechanic type in the **Authority Family Mapping** (above).

For `branch` → target families are `["decision", "classification", "result-selection"]`

**Decision:** Which family is most appropriate?
- If it selects between behaviors → `decision`
- If it classifies input → `classification`
- If it picks which result to return → `result-selection`

For this example: `decision` (the condition branches to accept or reject)

### Step 3: Extract Evidence from Source

Read the source code at the given line and column. Extract:

**For branches:**
- Condition expression (exact code)
- All possible outcomes (both branches)
- What happens in each branch (function calls, returns, assignments)
- Whether there's a default/no-match case

**For throws:**
- Error type and message
- What precondition triggers it
- Whether it's canonical failure or error handling fallback

**For object-construction:**
- Every output field name
- Source of each field (variable, constant, expression, function call)
- Whether any fields are omitted from input

**For serialization:**
- Encoding/format
- Whitespace handling
- Field ordering
- Canonicalization (same input → same output bytes?)

**For state-mutation:**
- What state/variable changes
- Preconditions (is mutation always safe?)
- Dependencies (what must be true first?)

### Step 4: Project Candidate JSON Scaffold

Generate JSON following these templates. Keep it **partial**—mark uncertainties as unresolved decisions.

#### Template: Decision Authority Candidate

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "<camelCase-decision-identifier>",
  "responsibility": {
    "responsibilityId": "<responsibility-that-owns-this-decision>",
    "description": "Human-readable description of what this function/responsibility does"
  },
  "source": {
    "modulePath": "<file-path>",
    "enclosingSymbol": "<function-name>",
    "mechanic": "branch",
    "startLine": <line-number>,
    "startColumn": <column>,
    "sourceSnippet": "<exact code from source>"
  },
  "inputs": [
    {
      "inputId": "<snake_case_input_id>",
      "candidatePath": "<object.field.path>",
      "observedType": "<inferred-type>",
      "observedComparison": "<equals|less|greater|contains|regex|custom>",
      "observedValue": "<literal-or-expression>",
      "requiredHumanResolution": [
        "confirm input type",
        "confirm whether input is validated upstream"
      ]
    }
  ],
  "candidateOutcomes": [
    {
      "outcomeId": "<outcome-identifier>",
      "description": "What happens if this outcome is selected",
      "observedEffect": "<function-call-or-return>",
      "resultExpression": "<what-is-returned-or-thrown>",
      "requiredHumanResolution": [
        "confirm this is desired semantics",
        "confirm error/result type"
      ]
    }
  ],
  "nomatchBehavior": {
    "description": "What happens if no condition matches",
    "observedBehavior": "<return-undefined|throw|fallthrough>",
    "requiredHumanResolution": [
      "confirm whether no-match is possible",
      "confirm desired no-match behavior"
    ]
  },
  "semanticCompleteness": {
    "allConditionsIdentified": true,
    "allOutcomesIdentified": true,
    "resultTypesClarified": false,
    "priorityOrdering": "unspecified"
  },
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

#### Template: Failure Disposition Authority Candidate

```json
{
  "authorityCandidateType": "failure-disposition-authority-candidate.v1",
  "candidateId": "<camelCase-failure-identifier>",
  "responsibility": {
    "responsibilityId": "<responsibility-that-owns-this-failure>"
  },
  "source": {
    "modulePath": "<file>",
    "enclosingSymbol": "<function>",
    "mechanic": "throw",
    "startLine": <line>,
    "sourceSnippet": "<exact throw statement>"
  },
  "failureIdentity": {
    "errorType": "<Error|CustomError|exception-type>",
    "errorCode": "<CODE_CONSTANT|null>",
    "errorMessage": "<message-template>",
    "canonicalFailureId": "<canonical-failure-identifier>"
  },
  "precondition": {
    "description": "What must be true to trigger this failure",
    "observedCondition": "<condition-expression>",
    "requiredHumanResolution": [
      "confirm this failure is canonical behavior (not error handling)",
      "confirm precondition is complete"
    ]
  },
  "resultUnion": {
    "successPath": "<type-of-success-result>",
    "failurePath": "<this-failure-type>",
    "description": "This function returns success OR this failure"
  },
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

#### Template: Projection Mapping Authority Candidate

```json
{
  "authorityCandidateType": "projection-mapping-candidate.v1",
  "projectionMappingId": "<camelCase-projection-id>",
  "responsibility": {
    "responsibilityId": "<responsibility>"
  },
  "source": {
    "modulePath": "<file>",
    "enclosingSymbol": "<function>",
    "mechanic": "object-construction",
    "startLine": <line>,
    "sourceSnippet": "<return { ... } statement>"
  },
  "resultContract": {
    "contractId": "<result-type-identifier>",
    "description": "Shape of object being constructed"
  },
  "fields": [
    {
      "outputPath": ["<field>", "nested", "path"],
      "sourceExpression": "<input.field>",
      "sourceType": "<inferred-type>",
      "transformationRequired": false,
      "constant": null,
      "requiredHumanResolution": [
        "confirm field is necessary",
        "confirm source field exists"
      ]
    },
    {
      "outputPath": ["<field>"],
      "constant": {
        "type": "string",
        "value": "<literal-value>"
      },
      "sourceExpression": null,
      "requiredHumanResolution": [
        "confirm constant is canonical",
        "confirm whether this should be parameterized"
      ]
    },
    {
      "outputPath": ["<field>"],
      "operationCandidate": {
        "kind": "invoke-declared-transformation",
        "observedInvocation": "<functionName(args)>",
        "invocationTarget": "<target-function-id>"
      },
      "requiredHumanResolution": [
        "confirm transformation semantics",
        "confirm transformation is deterministic"
      ]
    }
  ],
  "omittedFieldPolicy": {
    "description": "Fields from input that are NOT in output",
    "omittedFields": ["<field>", "<field>"],
    "requiredHumanResolution": [
      "confirm omission is intentional",
      "confirm no data loss"
    ]
  },
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

#### Template: Serialization Profile Authority Candidate

```json
{
  "authorityCandidateType": "serialization-profile-candidate.v1",
  "serializationProfileId": "<camelCase-serialization-id>",
  "source": {
    "modulePath": "<file>",
    "enclosingSymbol": "<function>",
    "mechanic": "serialization",
    "startLine": <line>,
    "sourceSnippet": "<JSON.stringify or encoding call>"
  },
  "encoding": {
    "format": "<json|utf8|msgpack|custom>",
    "charset": "utf-8",
    "determinism": {
      "required": true,
      "description": "Same input must always produce same bytes",
      "observedStrategy": "<canonicalize|sort-keys|deterministic-order>"
    }
  },
  "canonicalization": {
    "fieldOrdering": {
      "strategy": "<source-order|alphabetical|declared-order>",
      "requiredHumanResolution": [
        "confirm field order is semantically significant"
      ]
    },
    "whitespace": {
      "strategy": "<compact|pretty|newlines>",
      "requiredHumanResolution": [
        "confirm whitespace policy (affects hash?)"
      ]
    },
    "escaping": {
      "strategy": "<json-standard|unicode|custom>",
      "requiredHumanResolution": [
        "confirm escape handling"
      ]
    }
  },
  "resultContractId": "<output-type>",
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

#### Template: Validation Policy Authority Candidate

```json
{
  "authorityCandidateType": "validation-policy-candidate.v1",
  "validationPolicyId": "<camelCase-validation-id>",
  "source": {
    "modulePath": "<file>",
    "enclosingSymbol": "<function>",
    "mechanic": "validation",
    "startLine": <line>,
    "sourceSnippet": "<validation-check>"
  },
  "validatedContract": {
    "contractId": "<input-type>",
    "schemaPath": "<path-to-schema.json>",
    "validator": "<ajv|joi|custom>"
  },
  "successPath": {
    "behavior": "<continue|return-true|proceed-to-next>",
    "resultType": "<type-after-success>"
  },
  "failurePath": {
    "behavior": "<throw|return-false|return-error>",
    "errorIdentity": "<error-type>",
    "requiredHumanResolution": [
      "confirm error handling strategy"
    ]
  },
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

### Step 5: Flag Unresolved Semantic Decisions

For each candidate, populate `requiredHumanResolution` array with questions that only a human/domain expert can answer:

**Generic questions for all types:**
- Is this the canonical semantic meaning?
- Are there alternative interpretations?
- Does this decision belong in a separate authority, or is it part of a larger decision?

**Decision-specific:**
- Are all conditions identified?
- Is the priority/precedence of conditions correct?
- What should happen if no condition matches?

**Throw-specific:**
- Is this error canonical behavior or a fallback?
- Should this be classified differently?

**Object-construction-specific:**
- Are all output fields necessary?
- Is the transformation of any field correct?
- Are any input fields being dropped unintentionally?

**State-mutation-specific:**
- Under what preconditions is this mutation safe?
- Is the mutation idempotent?
- What proof is needed?

### Step 6: Batch and Organize

Group candidates by:
1. **Responsibility** (which business function owns them)
2. **Authority family** (all decisions together, all failures together, etc.)
3. **Coverage disposition** (fully decided vs. partially decided vs. unresolved)

This becomes your **authority inventory**: a map of what semantic authority exists, what's missing, and what needs human/agent completion.

### Step 7: Output Format

Generate a JSON file per responsibility or per function:

```json
{
  "generatedAtUtc": "2026-08-02T14:30:00Z",
  "sourceFile": "governed-artifact-engine.mjs",
  "responsibility": "validateConformanceProfile",
  "symbolId": "governed-artifact-engine.mjs#function:validateConformanceProfile",
  "observedMechanicsCount": 8,
  "candidates": [
    { "...decision candidate..." },
    { "...failure candidate..." },
    { "...projection candidate..." }
  ],
  "coverageSummary": {
    "totalMechanics": 8,
    "fullyAuthorized": 0,
    "partiallyCovered": 2,
    "unresolved": 6,
    "authorityConformanceRatio": 0.0
  },
  "admissionGate": {
    "status": "NOT_READY",
    "blockers": [
      "6 unresolved semantic decisions",
      "Missing error classification authority",
      "Result type contract undefined"
    ]
  }
}
```

## Example: Complete Walkthrough

### Input: Observed Branch Mechanic

```json
{
  "mechanic": "branch",
  "modulePath": "governed-artifact-engine.mjs",
  "startLine": 162,
  "startColumn": 3,
  "enclosingSymbol": "processContract",
  "sourceCode": "if (contract.status === \"admitted\") { return processContract(contract); } throw new Error(\"CONTRACT_NOT_ADMITTED\");"
}
```

### Step 1: Authority Family
**Lookup:** branch → [decision, classification, result-selection]  
**Choose:** decision (selecting which outcome to execute)

### Step 2: Extract Evidence

```
Condition: contract.status === "admitted"
Input: contract.status (type: string)
Outcomes:
  - True: return processContract(contract)
  - False: throw new Error("CONTRACT_NOT_ADMITTED")
No default case (throw covers false)
```

### Step 3: Project Candidate JSON

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "resolve-contract-admission-disposition",
  "responsibility": {
    "responsibilityId": "processes-contract",
    "description": "Determine whether contract is in admitted state and process accordingly"
  },
  "source": {
    "modulePath": "governed-artifact-engine.mjs",
    "enclosingSymbol": "processContract",
    "mechanic": "branch",
    "startLine": 162,
    "startColumn": 3,
    "sourceSnippet": "if (contract.status === \"admitted\") { return processContract(contract); } throw new Error(\"CONTRACT_NOT_ADMITTED\");"
  },
  "inputs": [
    {
      "inputId": "contract_admission_status",
      "candidatePath": "contract.status",
      "observedType": "string",
      "observedComparison": "equals",
      "observedValue": "admitted",
      "requiredHumanResolution": [
        "confirm contract.status is validated upstream",
        "confirm 'admitted' is the only valid processing state",
        "are there other valid states that should branch differently?"
      ]
    }
  ],
  "candidateOutcomes": [
    {
      "outcomeId": "contract-admitted-process",
      "description": "Contract is in admitted state, proceed with processing",
      "observedEffect": "return processContract(contract)",
      "resultExpression": "processContract(contract)",
      "requiredHumanResolution": [
        "confirm processContract is the correct semantic action",
        "confirm return value type"
      ]
    },
    {
      "outcomeId": "contract-not-admitted-reject",
      "description": "Contract not admitted, reject with error",
      "observedEffect": "throw new Error(\"CONTRACT_NOT_ADMITTED\")",
      "resultExpression": "Error",
      "requiredHumanResolution": [
        "confirm this is canonical rejection",
        "should error be classified (e.g., ContractNotAdmittedError)?",
        "should error message be parameterized?"
      ]
    }
  ],
  "nomatchBehavior": {
    "description": "No match case is covered by throw in false branch",
    "observedBehavior": "throw",
    "requiredHumanResolution": [
      "confirm all contract.status values are covered"
    ]
  },
  "semanticCompleteness": {
    "allConditionsIdentified": true,
    "allOutcomesIdentified": true,
    "resultTypesClarified": false,
    "priorityOrdering": "not-applicable"
  },
  "status": "AUTHORITY_CANDIDATE_PROJECTED",
  "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
}
```

### Step 4: Unresolved Decisions (for human/agent)

```
1. What are all valid contract.status values?
2. Are there states besides "admitted" that should process?
3. Should processContract be a declared operation or inline?
4. Is CONTRACT_NOT_ADMITTED the canonical failure identity?
5. Should different admission failures have different errors?
```

---

## Continuous Authority Enforcement

Once a mechanic is **AUTHORITY_BOUND** (admitted authority exists), the engine becomes a guard:

```
New code change
        ↓
Same mechanic observed
        ↓
No matching authority binding
        ↓
BODY_SEMANTIC_DRIFT
        ↓
CI/CD gate RED
```

This prevents:
- Forbidden mechanics from being reintroduced
- Undeclared side effects
- Unvalidated data flows
- Decision changes without authority update

---

## Automation Hints

This skill can be **semi-automated**:

### Fully Automatable
- ✅ Locate mechanics by type (query facts)
- ✅ Extract source snippets (read code at line)
- ✅ Structure basic candidate JSON scaffolds
- ✅ Identify output fields (parse AST)
- ✅ Detect invocations (relationship queries)

### Requires Human/Agent Judgment
- ❌ Confirm canonical semantics (what *should* happen)
- ❌ Identify responsibility ownership (who owns this decision)
- ❌ Resolve ambiguous outcomes (multiple valid interpretations)
- ❌ Set priority/ordering (which condition checked first)
- ❌ Prove safety (state mutations are idempotent)

**Suggested:** Automate Steps 1-5, hand to human/agent for Step 6-7

---

## Integration with Migration Loop

This skill feeds into:

```
Observe (query mechanics) ← [generate-test-scenarios-from-source-facts]
        ↓
Map (identify authority families) ← [project-authority-candidates-from-mechanics]
        ↓
Author (write JSON authority) ← [Human/agent completes unresolved decisions]
        ↓
Close (bind mechanics to authority) ← [Coverage resolver verifies]
        ↓
Project (generate replacement code) ← [Projection engine]
        ↓
Prove (semantic equivalence) ← [Differential vector executor]
        ↓
Replace (retire legacy body) ← [Migration gate]
```

---

## Troubleshooting

### Candidates Too Vague
- **Problem:** `requiredHumanResolution` is too generic
- **Solution:** Extract more detail from source (what is the exact condition? all branches covered?)
- **Check:** Do you have the complete source snippet, or just a line number?

### Wrong Authority Family Chosen
- **Problem:** Candidate JSON doesn't match the mechanic
- **Solution:** Re-read the Authority Family Mapping; confirm mechanic type is correct
- **Example:** A state mutation looks like object-construction but isn't (it modifies an external variable)

### Too Many Unresolved Decisions
- **Problem:** Candidate has 10+ unresolved questions
- **Solution:** This likely means multiple authority families apply; split into separate candidates
- **Example:** A branch that selects between two error types AND modifies state → split into decision + state-transition

### Coverage Ratio Won't Close
- **Problem:** Mechanics keep appearing that don't map to any authority
- **Solution:** These may be edge cases or deprecated code; check if responsibility boundaries are correct
- **Check:** Is the mechanic truly part of this responsibility, or should it belong to a dependency?

---

## Time Investment

- **Per mechanic:** 2-5 minutes to extract evidence and project candidate
- **Per function (typical 5-8 mechanics):** 15-30 minutes
- **Per module (100+ mechanics):** 4-8 hours with semi-automation

**Token cost for agent:** Reduced by ~60% because structure is pre-generated

---

## References

- Core migration loop: "The core migration loop.md"
- Mechanic types: `fact.ExecutableMechanic.MechanicKind`
- Authority family taxonomy: suggested mapping above
- Related skill: `generate-test-scenarios-from-source-facts` (provides input)
- Next stage: Authority coverage resolver (validates binding closure)
