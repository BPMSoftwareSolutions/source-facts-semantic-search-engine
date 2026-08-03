# Authority Candidate Projections: serves-query-console.js

**Generated:** 2026-08-02T21:43:49.581Z
**Total Candidates:** 8
**Coverage Status:** Authority Conformance Ratio: 0.0%

**Source file:** `C:\lab\repos\source-facts-semantic-search-engine\src\console\serves-query-console.js`

---

## Overview

The source facts engine has automatically projected **8 authority candidate scaffolds** from observable executable mechanics in `serves-query-console.js`.

This is an HTTP server entrypoint that serves a query console UI and handles client requests. The file is relatively compact (**259 lines**) but has clear responsibilities:
- **Console asset serving:** HTTP GET for HTML/assets
- **Index metadata queries:** GET /api/index-info
- **Relational queries:** POST /api/query with request body
- **Source snippet retrieval:** GET /api/snippet with path and line range
- **Request validation:** Path decoding, method routing, body size limits
- **Security:** CSP headers, path traversal prevention, workspace isolation

Each candidate captures a structural mechanic that requires semantic authority to declare **why** this specific validation, error, or transformation is required.

---

## Branch → Decision Authority Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:45`

**Observed code:**

```
    40:   port = 0,
    41: } = {}) {
    42:   try {
    43:     classifiesLoopbackBind({ hostname });
    44:   } catch (error) {
→   45:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    46:     throw new Error("The query console server may bind only to 127.0.0.1.");
    47:   }
    48:   if (index === null || typeof index !== "object") throw new Error("A loaded source-fact-index.v1 is required.");
    49:   if (typeof consoleAssetPath !== "string" || consoleAssetPath.trim().length === 0) {
    50:     throw new Error("consoleAssetPath is required.");
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
    "modulePath": "serves-query-console.js",
    "mechanic": "branch",
    "startLine": 45,
    "startColumn": 5,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Throw → Failure Disposition Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:45`

**Observed code:**

```
    40:   port = 0,
    41: } = {}) {
    42:   try {
    43:     classifiesLoopbackBind({ hostname });
    44:   } catch (error) {
→   45:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    46:     throw new Error("The query console server may bind only to 127.0.0.1.");
    47:   }
    48:   if (index === null || typeof index !== "object") throw new Error("A loaded source-fact-index.v1 is required.");
    49:   if (typeof consoleAssetPath !== "string" || consoleAssetPath.trim().length === 0) {
    50:     throw new Error("consoleAssetPath is required.");
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "failure-disposition-authority-candidate.v1",
  "candidateId": "failure-error",
  "responsibility": {},
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "throw",
    "startLine": 45,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Object Construction → Projection Mapping Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:13`

**Observed code:**

```
     8: 
     9: // Which pathname belongs to which route, and what it admits, is declared meaning
    10: // now owned by contracts/route-dispatch.authority.json (see docs/serves-query-console-closure-tracker.md).
    11: // This map is residual, mechanical-only: it exists solely to choose 404 vs 405 when
    12: // the authority rejects a request, not to make the routing decision itself.
→   13: const knownPathnameAllow = new Map([
    14:   ["/", "GET, HEAD"],
    15:   ["/index.html", "GET, HEAD"],
    16:   ["/api/index-info", "GET, HEAD"],
    17:   ["/api/query", "POST"],
    18:   ["/api/snippet", "GET, HEAD"],
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "projection-mapping-candidate.v1",
  "projectionMappingId": "project-undefined-result",
  "responsibility": {},
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "object-construction",
    "startLine": 13,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Iteration → Iteration Authority Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:192`

**Observed code:**

```
   187: 
   188:   const allLines = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
   189:   const firstLine = clamp(startLine - context, 1, allLines.length);
   190:   const lastLine = clamp(endLine + context, 1, allLines.length);
   191:   const lines = [];
→  192:   for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1) {
   193:     lines.push({ line: lineNumber, text: allLines[lineNumber - 1] ?? "", hit: lineNumber >= startLine && lineNumber <= endLine });
   194:   }
   195:   return writesJson(response, 200, { available: true, modulePath, startLine, endLine, lines });
   196: }
   197: 
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "iteration-authority-candidate.v1",
  "iterationId": "iterate-undefined",
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "iteration",
    "startLine": 192,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## State Mutation → State Transition Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:60`

**Observed code:**

```
    55:   const cspPolicy = buildsConsoleCsp();
    56: 
    57:   const server = http.createServer((request, response) => {
    58:     handlesRequest({ request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }).catch(() => {
    59:       if (!response.headersSent) writesSecurityHeaders(response, cspPolicy);
→   60:       response.statusCode = 500;
    61:       response.end(JSON.stringify({ error: "Query console server error." }));
    62:     });
    63:   });
    64:   server.on("clientError", (_error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"));
    65: 
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "state-transition-authority-candidate.v1",
  "stateTransitionId": "transition-undefined",
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "state-mutation",
    "startLine": 60,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Serialization → Serialization Profile Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:61`

**Observed code:**

```
    56: 
    57:   const server = http.createServer((request, response) => {
    58:     handlesRequest({ request, response, index, consoleHtml, realWorkspaceRoot, cspPolicy }).catch(() => {
    59:       if (!response.headersSent) writesSecurityHeaders(response, cspPolicy);
    60:       response.statusCode = 500;
→   61:       response.end(JSON.stringify({ error: "Query console server error." }));
    62:     });
    63:   });
    64:   server.on("clientError", (_error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"));
    65: 
    66:   await new Promise((resolve, reject) => {
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "serialization-profile-candidate.v1",
  "serializationProfileId": "serialize-undefined",
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "serialization",
    "startLine": 61,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Exception Handling → Failure Observation Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:42`

**Observed code:**

```
    37:   workspaceRoot = null,
    38:   consoleAssetPath,
    39:   hostname = "127.0.0.1",
    40:   port = 0,
    41: } = {}) {
→   42:   try {
    43:     classifiesLoopbackBind({ hostname });
    44:   } catch (error) {
    45:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    46:     throw new Error("The query console server may bind only to 127.0.0.1.");
    47:   }
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "failure-observation-candidate.v1",
  "failureObservationId": "observe-failure-undefined",
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "exception-handling",
    "startLine": 42,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Fallback → Fallback Policy Candidate

**Count:** 1 candidate(s) of this type

### Example from `serves-query-console.js:48`

**Observed code:**

```
    43:     classifiesLoopbackBind({ hostname });
    44:   } catch (error) {
    45:     if (error?.disposition !== "HOSTNAME_NOT_ADMITTED") throw error;
    46:     throw new Error("The query console server may bind only to 127.0.0.1.");
    47:   }
→   48:   if (index === null || typeof index !== "object") throw new Error("A loaded source-fact-index.v1 is required.");
    49:   if (typeof consoleAssetPath !== "string" || consoleAssetPath.trim().length === 0) {
    50:     throw new Error("consoleAssetPath is required.");
    51:   }
    52:   const resolvedAssetPath = path.resolve(consoleAssetPath);
    53:   const consoleHtml = await readFile(resolvedAssetPath, "utf8");
```

**Projected candidate:**

```json
{
  "authorityCandidateType": "fallback-policy-candidate.v1",
  "fallbackPolicyId": "fallback-undefined",
  "source": {
    "modulePath": "serves-query-console.js",
    "mechanic": "fallback",
    "startLine": 48,
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
This pattern appears **1 time(s)** in the indexed codebase. Each occurrence represents a point where semantic authority must declare the **why** that is currently hidden in code structure.

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Mechanics Observed | 8 |
| Unique Candidates Generated | 8 |
| Fully Authorized | 0 |
| Partially Covered | 0 |
| Unresolved (Awaiting Semantic Decision) | 8 |
| Authority Conformance Ratio | 0.0% |
| Admission Gate Status | NOT_READY |

---

## The Productivity Advantage

This HTTP server file shows how projection surfaces only the semantic decisions:

**Without authority projection:** An agent must understand 259 lines of async I/O, Node.js HTTP APIs, path manipulation, error recovery, and validation logic. High cognitive load to reconstruct all constraints.

**With authority projection:** An agent confirms decisions in pre-shaped JSON scaffolds. Low token cost, high precision, only semantic gaps remain flagged.

Each candidate shows:
- **Source location:** Exact file, line of the mechanic
- **Observed code:** Real code snippet from the source
- **Extracted structure:** Conditions, fields, invocations parsed from syntax
- **Unresolved decisions:** Precisely what a human must confirm

### What Each Candidate Represents

All candidates are `AUTHORITY_CANDIDATE_PROJECTED` — they capture everything syntax reveals, with flags marking what only semantics can determine.

**Examples of unresolved semantic decisions:**

- **Decision:** "Is this pathname validation canonical or overly strict?"
- **Failure:** "Should failed path traversal checks return 404 or 403?"
- **Validation:** "What is the correct max request body size? Why 65536?"
- **Throw:** "Is this error condition canonical or does it indicate a bug?"
- **Fallback:** "Should missing snippet context default to 2 lines or 0?"

---

## Next Steps for Your Team

1. **Review candidates** with domain experts to resolve unresolved decisions
2. **Document authority** once semantic meaning is confirmed (e.g., "path traversal checks MUST be canonical for security")
3. **Bind candidates to authority** once semantic meaning is confirmed
4. **Mark as `AUTHORITY_BOUND`** when all unresolved decisions are answered
5. **Recalculate coverage** — as binding progresses, conformance ratio rises

The engine does not claim syntax alone reveals complete meaning. Rather, it surfaces exactly where human semantic judgment is required, and provides a scaffold so agents spend their tokens on meaning, not structure.

