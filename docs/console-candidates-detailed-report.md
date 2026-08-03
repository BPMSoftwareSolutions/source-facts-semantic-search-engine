# Authority Candidate Detailed Report: serves-query-console

**Generated:** 2026-08-03T13:40:22.450Z
**Candidate sources:** `.governance/projections/governed-message-artifact-family.ledger.json`, `console-authority-bundles.mjs`, `console-validation-adapter.mjs`, `serves-query-console.conformant.mjs`, `serves-query-console.mjs`, `serves-query-console.projected.mjs`
**Workspace:** `C:\lab\repos\source-facts-semantic-search-engine\src\console`
**Violations detected:** 505
**Candidates projected:** 505
**Bindings mapped to known authority:** 485
**Bindings still requiring authority:** 20
**Engine findings:** 41

## Executive Summary

The query tool now classifies real mechanic families instead of `unknown`, which makes the authority candidate report usable for semantic migration. The remaining work is concentrated in projection mappings, fallback/default policies, state transitions, serialization, and a small set of unresolved throw/validation cases.

## Data Transition Map

| Candidate Type | Mechanics Observed | Data Transition Needed |
| --- | --- | --- |
| `decision-authority-candidate.v1` | 49 | Decision tables, predicate data, and AST-backed branch conditions |
| `failure-disposition-authority-candidate.v1` | 13 | Error ontology, failure-policy data, and canonical rejection semantics |
| `projection-mapping-candidate.v1` | 131 | AST object-shape data, field mapping declarations, and schema projections |
| `iteration-authority-candidate.v1` | 2 | Iteration policy, collection order data, and explicit continuation/termination rules |
| `state-transition-authority-candidate.v1` | 74 | Effect data, state-transition declarations, and proof requirements |
| `serialization-profile-candidate.v1` | 91 | Canonical byte rules, encoding policy, and stable serialization profiles |
| `validation-policy-candidate.v1` | 5 | Validation schema data and explicit failure-policy declarations |
| `failure-observation-candidate.v1` | 31 | Catch semantics, error-classification data, and observation policy |
| `fallback-policy-candidate.v1` | 75 | Missing-value policy, default-value data, and canonical fallback rules |
| `normalization-authority-candidate.v1` | 1 | Translation ontology, canonical forms, and lossiness policy |

## Candidate Families

### Branch → Decision Authority Candidate

**Count:** 49
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Decision tables, predicate data, and AST-backed branch conditions
**Representative source:** `serves-query-console.conformant.mjs:68`

**Observed code:**

```text
   64:   // AUTHORITY-DELEGATED: Validate hostname (loopback only)
   65:   try {
   66:     await classifiesLoopbackBind({ hostname });
   67:   } catch (error) {
-> 68:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
   69:     throw new Error("The query console server may bind only to 127.0.0.1.");
   70:   }
   71: 
   72:   // AUTHORITY-DELEGATED: Validate required parameters
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "resolve-serves-query-console",
  "responsibility": {
    "responsibilityId": "servesQueryConsole",
    "description": "Decision point in servesQueryConsole"
  },
  "source": {
    "modulePath": "serves-query-console.conformant.mjs",
    "sourceReferenceId": "serves-query-console.conformant.mjs:2900:64",
    "enclosingSymbol": "servesQueryConsole",
    "mechanic": "branch",
    "startLine": 68,
    "endLine": 68,
    "startColumn": 1,
    "endColumn": 1,
    "sourceSnippet": "    if (error?.disposition !== \"HOSTNAME_NOT_ADMITTED\") throw error;"
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

**Unresolved prompts:**
- confirm all outcomes are identified
- confirm condition is complete and accurate
- confirm decision priority/precedence
- confirm no-match behavior
- confirm no-match handling
- confirm result type per outcome

**Why this still needs data:**
These mechanics still need condition semantics, outcome semantics, and no-match policy to be described as data instead of control flow.

### Throw → Failure Disposition Candidate

**Count:** 13
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Error ontology, failure-policy data, and canonical rejection semantics
**Representative source:** `serves-query-console.conformant.mjs:68`

**Observed code:**

```text
   64:   // AUTHORITY-DELEGATED: Validate hostname (loopback only)
   65:   try {
   66:     await classifiesLoopbackBind({ hostname });
   67:   } catch (error) {
-> 68:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
   69:     throw new Error("The query console server may bind only to 127.0.0.1.");
   70:   }
   71: 
   72:   // AUTHORITY-DELEGATED: Validate required parameters
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "failure-disposition-authority-candidate.v1",
  "candidateId": "failure-serves-query-console-error",
  "responsibility": {
    "responsibilityId": "servesQueryConsole"
  },
  "source": {
    "modulePath": "serves-query-console.conformant.mjs",
    "sourceReferenceId": "serves-query-console.conformant.mjs:2952:12",
    "enclosingSymbol": "servesQueryConsole",
    "mechanic": "throw",
    "startLine": 68,
    "endLine": 68,
    "sourceSnippet": "    if (error?.disposition !== \"HOSTNAME_NOT_ADMITTED\") throw error;"
  },
  "failureIdentity": {
    "errorType": "Error",
    "errorCode": "HOSTNAME_NOT_ADMITTED",
    "errorMessage": "HOSTNAME_NOT_ADMITTED",
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

**Unresolved prompts:**
- confirm error classification
- confirm failure identity (type, code, message)
- confirm precondition
- confirm whether canonical behavior or fallback
- confirm whether this is canonical vs error-handling throw
- identify exact precondition that triggers this throw

**Why this still needs data:**
These mechanics need the error identity, precondition, and fallback-vs-canonical disposition to move out of executable throw sites.

### Object Construction → Projection Mapping Candidate

**Count:** 131
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, console-authority-bundles.mjs, console-validation-adapter.mjs, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** AST object-shape data, field mapping declarations, and schema projections
**Representative source:** `console-authority-bundles.mjs:30`

**Observed code:**

```text
   26:  * Authority source: known-pathname-allow-map
   27:  * Mechanic type: object-construction
   28:  */
   29: export function pathnameLookupAuthority({ pathname }) {
-> 30:   const knownPathnameAllow = new Map([
   31:     ["/", "GET, HEAD"],
   32:     ["/index.html", "GET, HEAD"],
   33:     ["/api/index-info", "GET, HEAD"],
   34:     ["/api/query", "POST"],
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "projection-mapping-candidate.v1",
  "projectionMappingId": "project-pathname-lookup-authority-result",
  "candidateId": "project-pathname-lookup-authority-result",
  "responsibility": {
    "responsibilityId": "pathnameLookupAuthority"
  },
  "source": {
    "modulePath": "console-authority-bundles.mjs",
    "sourceReferenceId": "console-authority-bundles.mjs:1276:173",
    "enclosingSymbol": "pathnameLookupAuthority",
    "mechanic": "object-construction",
    "startLine": 30,
    "endLine": 36,
    "sourceSnippet": "  const knownPathnameAllow = new Map([\n    [\"/\", \"GET, HEAD\"],\n    [\"/index.html\", \"GET, HEAD\"],\n    [\"/api/index-info\", \"GET, HEAD\"],\n    [\"/api/query\", \"POST\"],\n    [\"/api/snippet\", \"GET, HEAD\"],\n  ]);"
  },
  "resultContract": {
    "contractId": "pathnameLookupAuthority-result",
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

**Unresolved prompts:**
- confirm all field mappings are correct
- confirm field ordering semantics
- confirm no data loss
- confirm omission is intentional
- confirm omitted-field policy
- confirm result contract identity
- confirm transformation functions
- identify which input fields are omitted

**Why this still needs data:**
These mechanics are still constructing output objects in code; the field-by-field projection should become declarative mapping data.

### Iteration → Iteration Authority Candidate

**Count:** 2
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, console-authority-bundles.mjs
**Data transition:** Iteration policy, collection order data, and explicit continuation/termination rules
**Representative source:** `console-authority-bundles.mjs:122`

**Observed code:**

```text
   118:   const lastLine = Math.max(1, Math.min(endLine + contextLines, allLines.length));
   119: 
   120:   // Authority: Iteration in ascending order, hit-flag classification
   121:   const lines = [];
-> 122:   for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {
   123:     lines.push({
   124:       line: lineNumber,
   125:       text: allLines[lineNumber - 1] ?? "",
   126:       hit: lineNumber >= startLine && lineNumber <= endLine
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "iteration-authority-candidate.v1",
  "iterationId": "iterate-extracts-snippet-lines",
  "candidateId": "iterate-extracts-snippet-lines",
  "source": {
    "modulePath": "console-authority-bundles.mjs",
    "sourceReferenceId": "console-authority-bundles.mjs:4289:232",
    "enclosingSymbol": "extractsSnippetLines",
    "mechanic": "iteration",
    "startLine": 122,
    "endLine": 128,
    "sourceSnippet": "  for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {\n    lines.push({\n      line: lineNumber,\n      text: allLines[lineNumber - 1] ?? \"\",\n      hit: lineNumber >= startLine && lineNumber <= endLine\n    });\n  }"
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

**Unresolved prompts:**
- confirm collection/aggregation behavior
- confirm iteration order is semantically significant
- confirm per-item processing
- confirm stopping conditions
- identify collection source

**Why this still needs data:**
This mechanic should be a data-driven iteration contract instead of a hard-coded loop body.

### State Mutation → State Transition Candidate

**Count:** 74
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, console-authority-bundles.mjs, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Effect data, state-transition declarations, and proof requirements
**Representative source:** `console-authority-bundles.mjs:122`

**Observed code:**

```text
   118:   const lastLine = Math.max(1, Math.min(endLine + contextLines, allLines.length));
   119: 
   120:   // Authority: Iteration in ascending order, hit-flag classification
   121:   const lines = [];
-> 122:   for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {
   123:     lines.push({
   124:       line: lineNumber,
   125:       text: allLines[lineNumber - 1] ?? "",
   126:       hit: lineNumber >= startLine && lineNumber <= endLine
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "state-transition-authority-candidate.v1",
  "stateTransitionId": "transition-extracts-snippet-lines",
  "candidateId": "transition-extracts-snippet-lines",
  "source": {
    "modulePath": "console-authority-bundles.mjs",
    "sourceReferenceId": "console-authority-bundles.mjs:4346:15",
    "enclosingSymbol": "extractsSnippetLines",
    "mechanic": "state-mutation",
    "startLine": 122,
    "endLine": 122,
    "sourceSnippet": "  for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {"
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

**Unresolved prompts:**
- confirm commutativity guarantee
- confirm idempotency
- confirm idempotency guarantee
- confirm mutation safety
- confirm no deadlock risk
- confirm no side effects beyond declared state
- confirm preconditions
- identify all preconditions
- identify mutated state
- prove safety

**Why this still needs data:**
These mechanics still mutate state directly and need effect declarations that can be audited independently of the code path.

### Serialization → Serialization Profile Candidate

**Count:** 91
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Canonical byte rules, encoding policy, and stable serialization profiles
**Representative source:** `serves-query-console.conformant.mjs:92`

**Observed code:**

```text
   88:       realWorkspaceRoot,
   89:       cspPolicy
   90:     }).catch((error) => {
   91:       // AUTHORITY-DELEGATED: Error disposition and response format
-> 92:       const errorResponse = serializesErrorResponse({ error, context: "request-handler-uncaught" });
   93:       if (!response.headersSent) {
   94:         const securityHeaders = projectsSecurityHeaders({ context: "error" });
   95:         Object.entries(securityHeaders).forEach(([key, value]) => {
   96:           response.setHeader(key, value);
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "serialization-profile-candidate.v1",
  "serializationProfileId": "serialize-serves-query-console",
  "candidateId": "serialize-serves-query-console",
  "source": {
    "modulePath": "serves-query-console.conformant.mjs",
    "sourceReferenceId": "serves-query-console.conformant.mjs:3892:71",
    "enclosingSymbol": "servesQueryConsole",
    "mechanic": "serialization",
    "startLine": 92,
    "endLine": 92,
    "sourceSnippet": "      const errorResponse = serializesErrorResponse({ error, context: \"request-handler-uncaught\" });"
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
  "resultContractId": "servesQueryConsole-serialized",
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

**Unresolved prompts:**
- confirm canonicalization strategy
- confirm determinism requirement
- confirm encoding format
- confirm whether hash-sensitive

**Why this still needs data:**
These mechanics should be described as serialization data so byte-for-byte output is reproducible and reviewable.

### Validation → Validation Policy Candidate

**Count:** 5
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, console-authority-bundles.mjs, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Validation schema data and explicit failure-policy declarations
**Representative source:** `console-authority-bundles.mjs:189`

**Observed code:**

```text
   185:  *
   186:  * Delegates through the validation adapter so the body stays thin and projected.
   187:  */
   188: export function validatesConsoleParameters(parameters) {
-> 189:   return validatesConsoleParametersFromAdapter(parameters);
   190: }
   191: 
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "validation-policy-candidate.v1",
  "validationPolicyId": "validate-validates-console-parameters",
  "candidateId": "validate-validates-console-parameters",
  "source": {
    "modulePath": "console-authority-bundles.mjs",
    "sourceReferenceId": "console-authority-bundles.mjs:6347:49",
    "enclosingSymbol": "validatesConsoleParameters",
    "mechanic": "validation",
    "startLine": 189,
    "endLine": 189,
    "sourceSnippet": "  return validatesConsoleParametersFromAdapter(parameters);"
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

**Unresolved prompts:**
- confirm error classification
- confirm error handling strategy
- confirm error type and message
- confirm failure path behavior
- confirm success path behavior
- identify validated contract

**Why this still needs data:**
These mechanics still encode validation decisions in code and should move into policy data plus declared failure handling.

### Exception Handling → Failure Observation Candidate

**Count:** 31
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Catch semantics, error-classification data, and observation policy
**Representative source:** `serves-query-console.conformant.mjs:65`

**Observed code:**

```text
   61:   hostname = "127.0.0.1",
   62:   port = 0,
   63: } = {}) {
   64:   // AUTHORITY-DELEGATED: Validate hostname (loopback only)
-> 65:   try {
   66:     await classifiesLoopbackBind({ hostname });
   67:   } catch (error) {
   68:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
   69:     throw new Error("The query console server may bind only to 127.0.0.1.");
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "failure-observation-candidate.v1",
  "failureObservationId": "observe-failure-serves-query-console",
  "candidateId": "observe-failure-serves-query-console",
  "source": {
    "modulePath": "serves-query-console.conformant.mjs",
    "sourceReferenceId": "serves-query-console.conformant.mjs:2822:223",
    "enclosingSymbol": "servesQueryConsole",
    "mechanic": "exception-handling",
    "startLine": 65,
    "endLine": 70,
    "sourceSnippet": "  try {\n    await classifiesLoopbackBind({ hostname });\n  } catch (error) {\n    if (error?.disposition !== \"HOSTNAME_NOT_ADMITTED\") throw error;\n    throw new Error(\"The query console server may bind only to 127.0.0.1.\");\n  }"
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

**Unresolved prompts:**
- confirm catch block observes only vs transforms
- confirm error classification
- confirm error classification authority
- confirm observe-only vs transform behavior
- confirm post-catch disposition
- identify caught error types

**Why this still needs data:**
These mechanics should describe which failures are observed and which are rethrown as data, not as nested try/catch logic.

### Fallback → Fallback Policy Candidate

**Count:** 75
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json, console-authority-bundles.mjs, serves-query-console.conformant.mjs, serves-query-console.mjs, serves-query-console.projected.mjs
**Data transition:** Missing-value policy, default-value data, and canonical fallback rules
**Representative source:** `console-authority-bundles.mjs:37`

**Observed code:**

```text
   33:     ["/api/index-info", "GET, HEAD"],
   34:     ["/api/query", "POST"],
   35:     ["/api/snippet", "GET, HEAD"],
   36:   ]);
-> 37:   return knownPathnameAllow.get(pathname) ?? null;
   38: }
   39: 
   40: /**
   41:  * BUNDLE 2: projectsSecurityHeaders
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "fallback-policy-candidate.v1",
  "fallbackPolicyId": "fallback-pathname-lookup-authority",
  "candidateId": "fallback-pathname-lookup-authority",
  "source": {
    "modulePath": "console-authority-bundles.mjs",
    "sourceReferenceId": "console-authority-bundles.mjs:1460:40",
    "enclosingSymbol": "pathnameLookupAuthority",
    "mechanic": "fallback",
    "startLine": 37,
    "endLine": 37,
    "sourceSnippet": "  return knownPathnameAllow.get(pathname) ?? null;"
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

**Unresolved prompts:**
- confirm fallback value
- confirm fallback value is correct
- confirm missing-value condition
- confirm missing-value detection
- confirm no data loss
- confirm whether fallback is canonical or emergency

**Why this still needs data:**
These mechanics still embed default selection behavior in code and should become explicit fallback data.

### Normalization → Normalization Candidate

**Count:** 1
**Unique source files:** .governance/projections/governed-message-artifact-family.ledger.json
**Data transition:** Translation ontology, canonical forms, and lossiness policy
**Representative source:** `.governance/projections/governed-message-artifact-family.ledger.json:389`

**Observed code:**

```text
   385:           "exception-handling",
   386:           "throw",
   387:           "object-construction",
   388:           "serialization",
-> 389:           "normalization",
   390:           "validation",
   391:           "fallback",
   392:           "retry",
   393:           "state-mutation",
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "normalization-authority-candidate.v1",
  "normalizationId": "normalize-.governance/projections/governed-message-artifact-",
  "candidateId": "normalize-.governance/projections/governed-message-artifact-",
  "source": {
    "modulePath": ".governance/projections/governed-message-artifact-family.ledger.json",
    "sourceReferenceId": ".governance/projections/governed-message-artifact-family.ledger.json:13094:15",
    "enclosingSymbol": ".governance/projections/governed-message-artifact-family.ledger.json",
    "mechanic": "normalization",
    "startLine": 389,
    "endLine": 389,
    "sourceSnippet": "          \"normalization\","
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

**Unresolved prompts:**
- confirm canonical form
- confirm canonical target
- confirm classification
- confirm classification applied
- confirm lossiness
- identify all source variants

**Why this still needs data:**
These mechanics need their source variants and canonical target to be declared as transformation data.

## Unresolved Binding Audit

The following mechanics still need authority binding after projection (20 unresolved mappings):

| Violation | Mechanic | Source Location | Why it is unresolved |
| --- | --- | --- | --- |
| `validation-violation-17` | `validation` | `console-authority-bundles.mjs:189` | No authority mechanic was matched for validation |
| `throw-violation-25` | `throw` | `serves-query-console.conformant.mjs:68` | No authority mechanic was matched for throw |
| `throw-violation-27` | `throw` | `serves-query-console.conformant.mjs:69` | No authority mechanic was matched for throw |
| `validation-violation-29` | `validation` | `serves-query-console.conformant.mjs:73` | No authority mechanic was matched for validation |
| `throw-violation-42` | `throw` | `serves-query-console.conformant.mjs:118` | No authority mechanic was matched for throw |
| `throw-violation-65` | `throw` | `serves-query-console.conformant.mjs:166` | No authority mechanic was matched for throw |
| `throw-violation-183` | `throw` | `serves-query-console.mjs:42` | No authority mechanic was matched for throw |
| `throw-violation-185` | `throw` | `serves-query-console.mjs:43` | No authority mechanic was matched for throw |
| `validation-violation-187` | `validation` | `serves-query-console.mjs:47` | No authority mechanic was matched for validation |
| `throw-violation-200` | `throw` | `serves-query-console.mjs:92` | No authority mechanic was matched for throw |
| `throw-violation-223` | `throw` | `serves-query-console.mjs:140` | No authority mechanic was matched for throw |
| `throw-violation-341` | `throw` | `serves-query-console.projected.mjs:42` | No authority mechanic was matched for throw |
| `throw-violation-343` | `throw` | `serves-query-console.projected.mjs:43` | No authority mechanic was matched for throw |
| `validation-violation-345` | `validation` | `serves-query-console.projected.mjs:47` | No authority mechanic was matched for validation |
| `throw-violation-358` | `throw` | `serves-query-console.projected.mjs:92` | No authority mechanic was matched for throw |
| `throw-violation-381` | `throw` | `serves-query-console.projected.mjs:140` | No authority mechanic was matched for throw |
| `throw-violation-497` | `throw` | `.governance/projections/governed-message-artifact-family.ledger.json:386` | No authority mechanic was matched for throw |
| `validation-violation-501` | `validation` | `.governance/projections/governed-message-artifact-family.ledger.json:390` | No authority mechanic was matched for validation |
| `retry-violation-503` | `retry` | `.governance/projections/governed-message-artifact-family.ledger.json:392` | No authority mechanic was matched for retry |
| `meaning-hidden-in-text-violation-505` | `meaning-hidden-in-text` | `.governance/projections/governed-message-artifact-family.ledger.json:394` | No authority mechanic was matched for meaning-hidden-in-text |

## Engine Audit

| Artifact | Findings | Audit note |
| --- | --- | --- |
| `console-authority-bundles.v1` | `source-authority-declaration-mismatch`, `declared-content-digest-mismatch` | Content digest mismatch: expected sha256:5cc66ee3c54f818c1374752e10ddb1f0d5401d5bae372f863a1b8b17a307ab12, observed sha256:4d57ab91d3c4ee4f04a05ff3d41971ea374ba8218461feb5bfb021aa4ae30ed5. |
| `console-routing-adapter.v1` | `semantic-body-responsibility-cardinality`, `semantic-execution-boundary-unresolved`, `source-authority-declaration-mismatch`, `declared-content-digest-mismatch` | Content digest mismatch: expected sha256:6bbd94bbaa2769d4c6c3b309673d2b1a182922982e7dff3eea8e737baf9c7f0c, observed sha256:fb4fcc1b19139ea67d2ab47a9480123fdc0e4f1fe0a991eaaaeea629b5bc2ef8. |
| `console-snippet-adapter.v1` | `semantic-body-responsibility-cardinality`, `semantic-execution-boundary-unresolved`, `source-authority-declaration-mismatch`, `declared-content-digest-mismatch` | Content digest mismatch: expected sha256:0822c7734edcaa941c44ae47bcb6cc15130a673c793b352d1760d3e837440592, observed sha256:e54c39e3372353b26bf83c2dd82ab6b6784a4baf296977a5954d156afeed743b. |
| `console-validation-adapter.v1` | `semantic-body-responsibility-cardinality`, `semantic-execution-boundary-unresolved`, `source-authority-declaration-mismatch`, `declared-content-digest-mismatch` | Content digest mismatch: expected sha256:6baebab67aee792c5c0aa92c2e3088ed7ec56cc5ef58ea838eb0c697d56ade13, observed sha256:ea203ad1fe1a7895edcd6fc4f0a9caaab7b5bf9a7534322b07260216eab7be0e. |
| `serves-query-console-conformant.v1` | `source-authority-declaration-mismatch`, `declared-content-digest-mismatch`, `semantic-edge-authority-unresolved` | Content digest mismatch: expected sha256:d240eab49e9b87da69495c9bd3e64b401c32ae71b5fa766ae8a107cc7b215c83, observed sha256:f76f955d1246f4510ba948f51f9fb0f16fb444908d2f43a49ed215b81bd5b43e. |
| `serves-query-console-projected.v1` | `source-authority-declaration-mismatch`, `declared-content-digest-mismatch`, `semantic-edge-authority-unresolved` | Content digest mismatch: expected sha256:94481a642dd3cf5d29a69376008ccdcbf1424ce8cfb3ffa1d6240a4d5601cd59, observed sha256:55dcdcd3eeaf8d93545ca098d6082fe14adfc70f814175a3c30c401618db0fb5. |
| `serves-query-console.v1` | `source-authority-declaration-mismatch`, `declared-content-digest-mismatch`, `semantic-edge-authority-unresolved` | Content digest mismatch: expected sha256:643f8253d9b946554b258f02828215ca2980964df8b4b8181f649cd17bfdd3a7, observed sha256:7e58bea1f0cff62c98d386ec872704a736b003a2dec07ac10a797f54379c6d71. |

### Content Digest Mismatch

| Artifact | Expected | Observed |
| --- | --- | --- |
| `console-authority-bundles.v1` | `sha256:5cc66ee3c54f818c1374752e10ddb1f0d5401d5bae372f863a1b8b17a307ab12` | `sha256:4d57ab91d3c4ee4f04a05ff3d41971ea374ba8218461feb5bfb021aa4ae30ed5` |
| `console-routing-adapter.v1` | `sha256:6bbd94bbaa2769d4c6c3b309673d2b1a182922982e7dff3eea8e737baf9c7f0c` | `sha256:fb4fcc1b19139ea67d2ab47a9480123fdc0e4f1fe0a991eaaaeea629b5bc2ef8` |
| `console-snippet-adapter.v1` | `sha256:0822c7734edcaa941c44ae47bcb6cc15130a673c793b352d1760d3e837440592` | `sha256:e54c39e3372353b26bf83c2dd82ab6b6784a4baf296977a5954d156afeed743b` |
| `console-validation-adapter.v1` | `sha256:6baebab67aee792c5c0aa92c2e3088ed7ec56cc5ef58ea838eb0c697d56ade13` | `sha256:ea203ad1fe1a7895edcd6fc4f0a9caaab7b5bf9a7534322b07260216eab7be0e` |
| `serves-query-console-conformant.v1` | `sha256:d240eab49e9b87da69495c9bd3e64b401c32ae71b5fa766ae8a107cc7b215c83` | `sha256:f76f955d1246f4510ba948f51f9fb0f16fb444908d2f43a49ed215b81bd5b43e` |
| `serves-query-console-projected.v1` | `sha256:94481a642dd3cf5d29a69376008ccdcbf1424ce8cfb3ffa1d6240a4d5601cd59` | `sha256:55dcdcd3eeaf8d93545ca098d6082fe14adfc70f814175a3c30c401618db0fb5` |
| `serves-query-console.v1` | `sha256:643f8253d9b946554b258f02828215ca2980964df8b4b8181f649cd17bfdd3a7` | `sha256:7e58bea1f0cff62c98d386ec872704a736b003a2dec07ac10a797f54379c6d71` |

### Transition Notes

The governed-artifacts engine is still rejecting the projected artifacts because the code bodies are not yet fully data-driven. The audit surface splits into two groups:

| Group | What remains executable | What should become data |
| --- | --- | --- |
| Helper bundle | route maps, header policy, error serialization, fallback/default logic, snippet iteration | authority JSON for decisions, projections, iteration bounds, and failure policies |
| Thin adapters | import/execute wrappers still carrying boundary mechanics | sealed semantic invocation contracts and imported bundle data |
| Console entrypoints | route fallback and response shaping still contain branches, exceptions, and object construction | AST-backed projection mappings and explicit result contracts |

## Next Steps

1. Move the remaining throw/validation mechanics in `serves-query-console*.mjs` into explicit validation and failure-policy data.
2. Promote the helper bundle policies to declared projection mappings and result contracts.
3. Reproject the governed contract, then rerun the trust gate until digest and semantic-edge findings disappear.

