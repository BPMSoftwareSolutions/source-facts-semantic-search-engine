> Target-state design for the full `serves-query-console.js` decomposition. Empirical migration status (what's actually built, validated, and wired in) is tracked in [serves-query-console-closure-tracker.md](serves-query-console-closure-tracker.md); that tracker's "Migration log" is the source of truth for progress against this plan. One correction against this document, confirmed against the real `bound-semantic-execution-authority.schema.json`: `context.catalogs` is `const: []` in the current runtime — there is no generic top-level "catalog" construct. Data this doc calls a "catalog" (route-method admission, CSP directives, security headers, disposition messages) has to live as `semanticLayer.facts` / `ontology.translations` / `ontology.classifications` entries instead. The per-function contract sketches below are the intended shape; treat exact field names as aspirational until a given piece is actually validated and logged in the tracker.

Yes. Now we can model this file as **one governed artifact family containing several distinct responsibilities**, rather than treating the whole module as one giant capability.

The source currently combines server composition, HTTP routing, request-body collection, source-snippet resolution, security policy, response projection, path classification, and numeric bounding. 

# 1. First establish the semantic subjects

```text
Query Console Server
├── Server Binding
├── Server Configuration
├── Security Header Policy
├── Route Dispatch
├── Console Asset Delivery
├── Index Information Projection
├── Query Execution
├── Source Snippet Retrieval
├── JSON Request Collection
├── HTTP Response Projection
├── Path Containment Classification
└── Numeric Range Bounding
```

These do not all belong to the same ontology region.

A better contract decomposition is:

```text
Query Console Application
├── Query Console Server Authority
├── HTTP Route Authority
├── HTTP Response Authority
├── Request Body Authority
├── Source Snippet Authority
├── Path Relationship Authority
└── Security Policy Authority
```

The executable module may remain one physical file initially, but its contract should expose these as separate responsibilities.

---

# 2. Existing module-level entities

The file contains several module-level objects and values that should become declared authority.

## `knownPathnameAllow`

This is not merely a JavaScript `Map`.

It is a **route-method admission catalog**:

```json
{
  "catalogId": "query-console-route-method-catalog.v1",
  "entries": [
    {
      "pathname": "/",
      "admittedMethods": ["GET", "HEAD"],
      "routeId": "console-html"
    },
    {
      "pathname": "/index.html",
      "admittedMethods": ["GET", "HEAD"],
      "routeId": "console-html"
    },
    {
      "pathname": "/api/index-info",
      "admittedMethods": ["GET", "HEAD"],
      "routeId": "index-info"
    },
    {
      "pathname": "/api/query",
      "admittedMethods": ["POST"],
      "routeId": "query"
    },
    {
      "pathname": "/api/snippet",
      "admittedMethods": ["GET", "HEAD"],
      "routeId": "snippet"
    }
  ],
  "unrecognizedPathDisposition": "NOT_FOUND",
  "recognizedPathUnadmittedMethodDisposition": "METHOD_NOT_ALLOWED"
}
```

The residual `knownPathnameAllow` map should disappear once the routing authority returns a total result such as:

```text
ROUTE_ADMITTED
PATH_NOT_ADMITTED
METHOD_NOT_ADMITTED
```

The route authority should produce the `Allow` methods when applicable, so the executable body does not need a second route catalog.

---

## Request and snippet limits

These constants are policy:

```javascript
const maxRequestBodyBytes = 65536;
const defaultSnippetContextLines = 2;
const maxSnippetContextLines = 20;
const maxSnippetSpanLines = 400;
```

Represent them as a policy authority:

```json
{
  "policyId": "query-console-operating-limits.v1",
  "requestBody": {
    "maximumBytes": 65536,
    "exceededDisposition": "REQUEST_BODY_TOO_LARGE"
  },
  "snippet": {
    "defaultContextLines": 2,
    "minimumContextLines": 0,
    "maximumContextLines": 20,
    "maximumSpanLines": 400
  }
}
```

These are not implementation constants. They determine admitted behavior.

---

## Content Security Policy directives

The array inside `buildsConsoleCsp` is a catalog:

```json
{
  "policyId": "query-console-content-security-policy.v1",
  "directives": [
    {
      "directive": "default-src",
      "values": ["'none'"]
    },
    {
      "directive": "script-src",
      "values": ["'self'", "'unsafe-inline'"]
    },
    {
      "directive": "style-src",
      "values": ["'self'", "'unsafe-inline'"]
    },
    {
      "directive": "connect-src",
      "values": ["'self'"]
    },
    {
      "directive": "img-src",
      "values": ["'self'", "data:"]
    },
    {
      "directive": "font-src",
      "values": ["'self'"]
    },
    {
      "directive": "base-uri",
      "values": ["'none'"]
    },
    {
      "directive": "form-action",
      "values": ["'none'"]
    },
    {
      "directive": "frame-ancestors",
      "values": ["'none'"]
    }
  ],
  "serialization": {
    "directiveSeparator": "; ",
    "valueSeparator": " "
  }
}
```

The resulting CSP string is a projection of this catalog.

---

# 3. Function-to-contract mapping

| Function                | Canonical responsibility                                | Primary authority type                                 | Residual mechanics                        |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| `buildsConsoleCsp`      | Projects the admitted CSP policy                        | catalog + projection                                   | string joining                            |
| `servesQueryConsole`    | Establishes and returns a loopback query-console server | execution model + server policy                        | Node HTTP/filesystem effects              |
| `handlesRequest`        | Executes one classified HTTP route                      | route ontology + execution model                       | request/response port invocation          |
| `writesSnippetResponse` | Resolves and projects a bounded source snippet          | classifications, obligations, transformations, results | filesystem effects                        |
| `readsJsonBody`         | Collects and decodes one bounded JSON request body      | event protocol + limits + result union                 | Node stream events and JSON parser        |
| `methodNotAllowed`      | Projects a 405 response                                 | response projection                                    | response mutation                         |
| `writesJson`            | Serializes and writes a JSON HTTP response              | response projection + serializer binding               | `JSON.stringify`, headers, response write |
| `writesSecurityHeaders` | Applies declared security headers                       | header catalog + iteration authority                   | `setHeader` effects                       |
| `isSameOrDescendant`    | Classifies a candidate path relative to a root          | path relationship classification                       | bounded text/path comparison              |
| `clamp`                 | Bounds one number to a declared interval                | numeric transformation                                 | arithmetic primitive                      |

---

# 4. `buildsConsoleCsp`

## Current responsibility

```text
CSP directive catalog
    ↓
serialize directives
    ↓
CSP header value
```

## Contract representation

```json
{
  "transformationId": "project-query-console-csp",
  "sourceAuthorityId": "query-console-content-security-policy.v1",
  "targetPropertyId": "content-security-policy-header-value",
  "outputPath": ["value"],
  "resultIds": [
    "content-security-policy-projected"
  ],
  "unavailableDisposition": "CSP_POLICY_UNAVAILABLE",
  "invalidTypeDisposition": "CSP_POLICY_INVALID"
}
```

## Desired body

```javascript
export function buildsConsoleCsp() {
  return executeSemanticAuthority(
    queryConsoleCspAuthority,
    {}
  );
}
```

Or eliminate the function entirely and project the CSP into the server context during server-authority resolution.

---

# 5. `servesQueryConsole`

This is the composition boundary.

Its semantic responsibilities are currently:

```text
validate server request
classify hostname admission
resolve console asset path
read console asset
resolve optional workspace root
project CSP
create HTTP server
bind server
classify bound address
project public server handle
```

These should become an ordered execution model.

## Server request concept

```json
{
  "conceptId": "query-console-server-request",
  "conceptType": "server-start-request",
  "isA": [],
  "abstract": false,
  "schemaId": "query-console-server-request.v1"
}
```

## Request schema

```json
{
  "index": "source-fact-index.v1",
  "workspaceRoot": "string|null",
  "consoleAssetPath": "non-empty-path",
  "hostname": "string",
  "port": "integer"
}
```

## Server operating policy

```json
{
  "policyId": "query-console-server-policy.v1",
  "hostname": {
    "admittedValues": ["127.0.0.1"],
    "rejectionDisposition": "HOSTNAME_NOT_ADMITTED"
  },
  "port": {
    "minimum": 0,
    "maximum": 65535,
    "zeroDisposition": "ALLOCATE_AVAILABLE_PORT"
  },
  "workspaceRoot": {
    "optional": true,
    "resolutionFailureDisposition": "WORKSPACE_ROOT_UNAVAILABLE"
  },
  "consoleAsset": {
    "required": true,
    "mediaType": "text/html"
  }
}
```

## Execution model

```json
{
  "executionModelId": "start-query-console-server",
  "steps": [
    {
      "sequence": 1,
      "operation": "validate-input",
      "authorityId": "query-console-server-request.v1"
    },
    {
      "sequence": 2,
      "operation": "classify",
      "authorityId": "classify-loopback-bind"
    },
    {
      "sequence": 3,
      "operation": "resolve-console-asset-path"
    },
    {
      "sequence": 4,
      "operation": "invoke-port",
      "portId": "read-text-file"
    },
    {
      "sequence": 5,
      "operation": "resolve-optional-workspace-root"
    },
    {
      "sequence": 6,
      "operation": "project",
      "authorityId": "project-query-console-csp"
    },
    {
      "sequence": 7,
      "operation": "invoke-port",
      "portId": "create-http-server"
    },
    {
      "sequence": 8,
      "operation": "invoke-port",
      "portId": "bind-http-server"
    },
    {
      "sequence": 9,
      "operation": "classify",
      "authorityId": "classify-bound-server-address"
    },
    {
      "sequence": 10,
      "operation": "project",
      "authorityId": "project-query-console-server-handle"
    }
  ]
}
```

## Server handle result projection

The current returned object:

```javascript
{
  url,
  cspPolicy,
  hostname,
  port: address.port,
  close: ...
}
```

should be a declared result contract.

The close operation itself cannot be ordinary data, so the result should bind an admitted server-handle port/reference:

```json
{
  "resultId": "query-console-server-started",
  "discriminator": {
    "field": "disposition",
    "value": "QUERY_CONSOLE_SERVER_STARTED"
  },
  "fields": {
    "url": "$.server.url",
    "cspPolicy": "$.security.cspPolicy",
    "hostname": "$.binding.hostname",
    "port": "$.binding.port",
    "serverHandleId": "$.server.handleId"
  }
}
```

The host application can resolve `serverHandleId` to a mechanical close operation.

Do not put an executable closure into the canonical semantic result.

---

# 6. `handlesRequest`

This function contains the most important semantic region in the module.

## Current internal flow

```text
apply security headers
decode request URL
classify route
classify rejection
select route body
execute route body
write response
```

## Route request concept

```json
{
  "conceptId": "query-console-http-request",
  "conceptType": "http-request",
  "isA": [],
  "abstract": false,
  "schemaId": "query-console-http-request.v1"
}
```

## Route classification

The existing `classifiesRoute` authority should become total.

```text
Inputs
├── pathname
└── method

Results
├── CONSOLE_HTML_ROUTE
├── INDEX_INFO_ROUTE
├── QUERY_ROUTE
├── SNIPPET_ROUTE
├── PATH_NOT_ADMITTED
└── METHOD_NOT_ADMITTED
```

Each admitted route result should carry its execution identity:

```json
{
  "routeId": "index-info",
  "handlerAuthorityId": "serve-index-information",
  "responseProfileId": "json-success-response.v1"
}
```

## Route execution model

```json
{
  "executionModelId": "handle-query-console-request",
  "steps": [
    {
      "sequence": 1,
      "operation": "apply-security-header-catalog"
    },
    {
      "sequence": 2,
      "operation": "parse-request-url"
    },
    {
      "sequence": 3,
      "operation": "classify-route"
    },
    {
      "sequence": 4,
      "operation": "select-route-result"
    },
    {
      "sequence": 5,
      "operation": "execute-selected-route"
    },
    {
      "sequence": 6,
      "operation": "write-selected-response"
    }
  ],
  "terminalResults": [
    "HTTP_RESPONSE_WRITTEN",
    "REQUEST_URL_INVALID",
    "PATH_NOT_ADMITTED",
    "METHOD_NOT_ADMITTED",
    "ROUTE_EXECUTION_FAILED"
  ]
}
```

The `routeBodies` object should not exist in authored code. It is an execution-binding catalog.

```json
{
  "catalogId": "query-console-route-handler-bindings.v1",
  "bindings": [
    {
      "routeId": "console-html",
      "executionAuthorityId": "serve-console-html"
    },
    {
      "routeId": "index-info",
      "executionAuthorityId": "serve-index-info"
    },
    {
      "routeId": "query",
      "executionAuthorityId": "execute-console-query"
    },
    {
      "routeId": "snippet",
      "executionAuthorityId": "serve-source-snippet"
    }
  ]
}
```

---

# 7. The route body objects

The `routeBodies` object contains four separately meaningful responsibilities.

## `console-html`

```text
HTML asset
+
HEAD/GET policy
+
HTTP metadata
→ HTML response
```

Authority:

```json
{
  "projectionId": "project-console-html-response",
  "fields": {
    "statusCode": {
      "value": 200
    },
    "headers.Content-Type": {
      "value": "text/html; charset=utf-8"
    },
    "headers.Content-Length": "$.consoleHtml.byteLength",
    "body": {
      "decision": "select-head-or-html-body"
    }
  }
}
```

The `HEAD` behavior is a decision:

```json
{
  "classificationId": "classify-http-response-body-presence",
  "cases": [
    {
      "method": "HEAD",
      "stateId": "body-omitted"
    },
    {
      "method": "GET",
      "stateId": "body-present"
    }
  ]
}
```

---

## `index-info`

The object construction is a projection mapping.

```json
{
  "projectionId": "project-source-index-information-response",
  "fields": {
    "indexType": "$.index.indexType",
    "indexId": "$.index.indexId",
    "workspaceId": "$.index.workspace.workspaceId",
    "workspaceRootAvailable": {
      "operation": "test-presence",
      "source": "$.realWorkspaceRoot"
    },
    "coverage": "$.index.coverage",
    "counts.files": {
      "operation": "count",
      "source": "$.index.files"
    },
    "counts.symbols": {
      "operation": "count",
      "source": "$.index.symbols"
    },
    "counts.relationships": {
      "operation": "count",
      "source": "$.index.relationships"
    },
    "counts.dataflows": {
      "operation": "count",
      "source": "$.index.dataflows"
    },
    "counts.sourceReferences": {
      "operation": "count",
      "source": "$.index.sourceReferences"
    },
    "counts.bodyMechanics": {
      "operation": "count",
      "source": "$.index.bodyMechanics"
    }
  },
  "missingValuePolicy": "write-null"
}
```

This is one of the cleanest immediate migrations.

---

## `query`

This is a composed capability:

```text
collect JSON body
    ↓
resolve command text
    ↓
validate command text presence
    ↓
execute relational query
    ↓
project query response
```

Represent it as:

```json
{
  "executionModelId": "execute-query-console-query",
  "steps": [
    {
      "sequence": 1,
      "operation": "invoke-port",
      "portId": "read-json-request-body"
    },
    {
      "sequence": 2,
      "operation": "resolve-property",
      "propertyId": "query-command-text"
    },
    {
      "sequence": 3,
      "operation": "evaluate-obligation",
      "obligationId": "command-text-required"
    },
    {
      "sequence": 4,
      "operation": "invoke-port",
      "portId": "execute-relational-query"
    },
    {
      "sequence": 5,
      "operation": "project",
      "projectionId": "project-json-http-response"
    }
  ]
}
```

---

## `snippet`

This is simply a semantic edge:

```json
{
  "routeId": "snippet",
  "invokes": "serve-source-snippet",
  "inputProjectionId": "project-source-snippet-request"
}
```

---

# 8. `writesSnippetResponse`

This function should be decomposed into an ontology-driven pipeline.

## Concepts

```text
Snippet request
Module path
Requested source span
Context line count
Workspace root
Candidate source path
Resolved source path
Source file
Normalized source text
Source line
Snippet line
Snippet response
```

## Classifications

```text
workspace-root-state
snippet-request-state
snippet-span-state
candidate-path-relationship
resolved-path-state
source-file-state
source-read-state
```

## Obligations

```text
workspace root available
module path present
module path free of NUL
start line is valid
end line follows start line
span is within maximum
candidate path stays in workspace
real path stays in workspace
candidate is a file
source text is readable
```

## Result union

```text
SNIPPET_AVAILABLE
WORKSPACE_ROOT_UNAVAILABLE
INVALID_SNIPPET_REQUEST
INVALID_SNIPPET_SPAN
PATH_ESCAPES_WORKSPACE
SOURCE_FILE_UNREADABLE
```

## Request projection

```json
{
  "projectionId": "project-source-snippet-request",
  "fields": {
    "modulePath": "$.parsedUrl.searchParams.modulePath",
    "startLine": {
      "operation": "parse-integer",
      "source": "$.parsedUrl.searchParams.startLine",
      "radix": 10
    },
    "endLine": {
      "operation": "parse-integer-or-default",
      "source": "$.parsedUrl.searchParams.endLine",
      "defaultSource": "$.startLine",
      "radix": 10
    },
    "contextLines": {
      "operation": "bounded-integer-or-default",
      "source": "$.parsedUrl.searchParams.context",
      "default": 2,
      "minimum": 0,
      "maximum": 20
    }
  }
}
```

## Candidate path transformation

```json
{
  "transformationId": "resolve-snippet-candidate-path",
  "sourceAuthorityId": "snippet-module-path",
  "targetPropertyId": "candidate-source-path",
  "operations": [
    {
      "operation": "normalize-path-separators"
    },
    {
      "operation": "resolve-under-root",
      "root": "$.realWorkspaceRoot"
    }
  ]
}
```

## Text normalization

```json
{
  "transformationId": "normalize-source-line-endings",
  "input": "$.sourceText",
  "operations": [
    {
      "replace": "\r\n",
      "with": "\n"
    },
    {
      "replace": "\r",
      "with": "\n"
    },
    {
      "split": "\n"
    }
  ],
  "output": "$.sourceLines"
}
```

## Snippet line iteration

```json
{
  "iterationId": "project-source-snippet-lines",
  "collection": {
    "operation": "inclusive-integer-range",
    "start": "$.firstLine",
    "end": "$.lastLine"
  },
  "order": "ascending",
  "forEach": {
    "projectionId": "project-source-snippet-line"
  },
  "collect": "lines"
}
```

## Snippet-line projection

```json
{
  "projectionId": "project-source-snippet-line",
  "fields": {
    "line": "$.lineNumber",
    "text": "$.sourceLines[$.lineNumberMinusOne]",
    "hit": {
      "operation": "within-inclusive-range",
      "value": "$.lineNumber",
      "minimum": "$.requestedStartLine",
      "maximum": "$.requestedEndLine"
    }
  }
}
```

## Successful result

```json
{
  "resultId": "source-snippet-available",
  "discriminator": {
    "field": "available",
    "value": true
  },
  "projectionId": "project-source-snippet-response"
}
```

This entire function is a good example of meaning that belongs in ontology and transformations, with filesystem operations left behind declared ports.

---

# 9. `readsJsonBody`

This is not merely parsing JSON. It is a bounded asynchronous stream protocol.

## Concepts

```text
HTTP request body stream
Request body chunk
Received byte count
Collected body bytes
Decoded body text
Parsed JSON body
Request body failure
```

## State model

```json
{
  "stateModelId": "json-request-body-collection.v1",
  "states": [
    "awaiting-data",
    "collecting",
    "size-limit-exceeded",
    "stream-ended",
    "stream-failed",
    "decoding",
    "parsing",
    "completed",
    "rejected"
  ],
  "transitions": [
    {
      "from": "awaiting-data",
      "to": "collecting",
      "when": "data-chunk-observed"
    },
    {
      "from": "collecting",
      "to": "size-limit-exceeded",
      "when": "received-byte-count-exceeds-limit"
    },
    {
      "from": "collecting",
      "to": "stream-ended",
      "when": "end-observed"
    },
    {
      "from": "stream-ended",
      "to": "completed",
      "when": "empty-body"
    },
    {
      "from": "stream-ended",
      "to": "decoding",
      "when": "body-bytes-present"
    },
    {
      "from": "decoding",
      "to": "parsing",
      "when": "utf8-text-produced"
    },
    {
      "from": "parsing",
      "to": "completed",
      "when": "valid-json-produced"
    },
    {
      "from": "parsing",
      "to": "rejected",
      "when": "json-parse-failed"
    }
  ]
}
```

## Results

```text
JSON_BODY_READ
EMPTY_JSON_BODY
REQUEST_BODY_TOO_LARGE
REQUEST_BODY_INVALID_JSON
REQUEST_BODY_STREAM_FAILED
```

## Ports

```text
observe-request-data
observe-request-end
observe-request-error
destroy-request-stream
concatenate-buffer-chunks
decode-utf8
parse-json
```

The Node event binding remains mechanical. The state transitions, limits, and dispositions belong in authority.

---

# 10. `methodNotAllowed`

This should become one response projection:

```json
{
  "projectionId": "project-method-not-allowed-response",
  "fields": {
    "statusCode": {
      "value": 405
    },
    "headers.Allow": "$.allow",
    "headers.Content-Type": {
      "value": "application/json; charset=utf-8"
    },
    "body.error": {
      "value": "Method not allowed."
    }
  }
}
```

The literal message should be part of a response-message catalog:

```json
{
  "messageId": "method-not-allowed",
  "text": "Method not allowed."
}
```

---

# 11. `writesJson`

This is a reusable HTTP response capability.

## Request contract

```json
{
  "responseHandleId": "response-...",
  "statusCode": 200,
  "value": {},
  "serializationProfileId": "canonical-json.v1"
}
```

## Semantic responsibility

```text
serialize value
calculate byte length
project response headers
write status
write headers
end response with body
```

## Projection

```json
{
  "projectionId": "project-json-http-response",
  "fields": {
    "statusCode": "$.statusCode",
    "headers.Content-Type": {
      "value": "application/json; charset=utf-8"
    },
    "headers.Content-Length": "$.serializedBody.byteLength",
    "body": "$.serializedBody.text"
  }
}
```

## Effects

```text
serialize-json
calculate-byte-length
set-http-status
set-http-header
end-http-response
```

The response object mutation stays in the HTTP response adapter.

---

# 12. `writesSecurityHeaders`

The headers are declarative facts.

```json
{
  "catalogId": "query-console-security-header-catalog.v1",
  "headers": [
    {
      "name": "Content-Security-Policy",
      "valueSource": "$.cspPolicy"
    },
    {
      "name": "Cache-Control",
      "value": "no-store"
    },
    {
      "name": "Cross-Origin-Resource-Policy",
      "value": "same-origin"
    },
    {
      "name": "Referrer-Policy",
      "value": "no-referrer"
    },
    {
      "name": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "name": "Permissions-Policy",
      "value": "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()"
    }
  ]
}
```

Execution becomes declared iteration:

```json
{
  "iterationId": "apply-query-console-security-headers",
  "collection": "$.securityHeaderCatalog.headers",
  "order": "catalog-order",
  "forEach": {
    "invokePortId": "set-http-header"
  }
}
```

---

# 13. `isSameOrDescendant`

This is one path-relationship classification.

```json
{
  "classificationId": "classify-path-relationship",
  "classificationType": "path-relationship",
  "inputs": [
    "candidatePath",
    "rootPath",
    "pathComparisonPolicy"
  ],
  "states": [
    "same",
    "descendant",
    "outside"
  ]
}
```

Then an obligation:

```json
{
  "obligationId": "candidate-path-remains-in-workspace",
  "classificationId": "classify-path-relationship",
  "satisfiedStateIds": [
    "same",
    "descendant"
  ],
  "failureDisposition": "PATH_ESCAPES_WORKSPACE"
}
```

The function no longer returns an unlabelled Boolean. It produces a meaningful relationship state, from which a Boolean can be projected when needed.

---

# 14. `clamp`

This should not remain a domain function.

It is a generic bounded-number transformation:

```json
{
  "transformationId": "bound-number-to-inclusive-range",
  "inputs": [
    "value",
    "minimum",
    "maximum"
  ],
  "result": {
    "operation": "minimum",
    "values": [
      {
        "operation": "maximum",
        "values": [
          "$.value",
          "$.minimum"
        ]
      },
      "$.maximum"
    ]
  }
}
```

Or use an admitted runtime primitive:

```text
clamp-number.v1
```

No query-console-specific code should own this operation.

---

# 15. Error/message catalog

The file contains business and operational meanings hidden in text:

```text
The query console server may bind only to 127.0.0.1.
A loaded source-fact-index.v1 is required.
consoleAssetPath is required.
Query console server error.
Bad request.
Not found.
Method not allowed.
commandText is required.
modulePath and a numeric startLine are required.
Request body too large.
Request body must be valid JSON.
```

Represent them as results, not free-floating strings.

```json
{
  "catalogId": "query-console-disposition-catalog.v1",
  "dispositions": [
    {
      "disposition": "HOSTNAME_NOT_ADMITTED",
      "httpStatus": null,
      "message": "The query console server may bind only to 127.0.0.1."
    },
    {
      "disposition": "REQUEST_URL_INVALID",
      "httpStatus": 400,
      "message": "Bad request."
    },
    {
      "disposition": "PATH_NOT_ADMITTED",
      "httpStatus": 404,
      "message": "Not found."
    },
    {
      "disposition": "METHOD_NOT_ADMITTED",
      "httpStatus": 405,
      "message": "Method not allowed."
    },
    {
      "disposition": "COMMAND_TEXT_REQUIRED",
      "httpStatus": 400,
      "message": "commandText is required."
    },
    {
      "disposition": "REQUEST_BODY_TOO_LARGE",
      "httpStatus": 413,
      "message": "Request body too large."
    },
    {
      "disposition": "REQUEST_BODY_INVALID_JSON",
      "httpStatus": 400,
      "message": "Request body must be valid JSON."
    }
  ]
}
```

---

# 16. Ports and effects

These are the irreducible mechanics that should remain below the semantic layer.

```text
Filesystem ports
├── read-text-file
├── resolve-real-path
├── observe-file-stat
└── resolve-path

HTTP server ports
├── create-http-server
├── bind-http-server
├── observe-server-address
├── close-http-server
└── observe-client-error

HTTP request ports
├── parse-request-url
├── observe-request-data
├── observe-request-end
├── observe-request-error
└── destroy-request

HTTP response ports
├── set-http-status
├── set-http-header
├── observe-headers-sent
└── end-http-response

Data ports
├── parse-json
├── serialize-json
├── decode-utf8
├── concatenate-byte-chunks
└── calculate-byte-length

Query port
└── execute-relational-query
```

None of these ports should decide what status code, header, route, disposition, or result applies.

---

# 17. Suggested contract artifact family

```text
contracts/
├── serves-query-console.authority.json
├── query-console-route.authority.json
├── query-console-security-policy.authority.json
├── query-console-http-response.authority.json
├── reads-json-request-body.authority.json
├── serves-source-snippet.authority.json
├── classifies-path-relationship.authority.json
├── query-console-operating-limits.authority.json
├── query-console-disposition-catalog.json
└── query-console-ports.authority.json
```

Then projected bundles:

```text
contracts/projected/
├── serves-query-console.bundle.json
├── handles-query-console-request.bundle.json
├── reads-json-request-body.bundle.json
├── serves-source-snippet.bundle.json
├── writes-json-response.bundle.json
├── applies-security-headers.bundle.json
└── classifies-path-relationship.bundle.json
```

Adapters:

```text
src/
├── serves-query-console-adapter.mjs
├── handles-query-console-request-adapter.mjs
├── reads-json-request-body-adapter.mjs
├── serves-source-snippet-adapter.mjs
├── writes-json-response-adapter.mjs
├── applies-security-headers-adapter.mjs
└── classifies-path-relationship-adapter.mjs
```

---

# 18. Target module shape

Once the contract is fully projected, this entire source file should collapse toward something like:

```javascript
import {
  queryConsoleAuthority
} from "../contracts/projected/serves-query-console.bundle.mjs";

import {
  executeSemanticAuthority
} from "contract-driven-artifact-governance-engine";

export async function servesQueryConsole(request) {
  return executeSemanticAuthority(
    queryConsoleAuthority,
    request
  );
}
```

HTTP, filesystem, stream, and query implementations are seated through declared ports.

The key movement is:

```text
Current file
├── catalogs
├── limits
├── policies
├── decisions
├── state transitions
├── DTO construction
├── result messages
├── iteration
├── routing
└── mechanics

Target contract
├── catalogs
├── limits
├── policies
├── classifications
├── obligations
├── transformations
├── results
├── execution models
└── port bindings

Target body
└── executeSemanticAuthority(...)
```

This file is an excellent migration subject because nearly every category you want to remove from executable code is physically present in one bounded module.
