import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const consoleWorkspaceRoot = path.join(repositoryRoot, "src", "console");
const consoleContractsRoot = path.join(repositoryRoot, "contracts");
const defaultTemplateContractPath = path.join(consoleContractsRoot, "serves-query-console.contract.json");
const defaultAuthorityPath = path.join(consoleContractsRoot, "serves-query-console.authority.json");
const defaultAuthorityCompletePath = path.join(consoleContractsRoot, "serves-query-console.authority.complete.json");
const defaultBindingPath = path.join(consoleContractsRoot, "serves-query-console.binding.json");
const defaultViolationBindingsPath = path.join(consoleContractsRoot, "serves-query-console.violation-bindings.json");
const defaultOutputPath = path.join(consoleContractsRoot, "serves-query-console.governed.contract.json");
const defaultStrategyDocPath = path.join(repositoryRoot, "docs", "automated-conformance-projection-strategy.md");
const externalGovernanceEnginePath = path.resolve(repositoryRoot, "..", "contract-driven-artifact-governance-engine", "bin", "governed-artifacts.mjs");

function normalizesPathKey(value) {
  return typeof value === "string" ? value.replaceAll("\\", "/") : "";
}

function loadsJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function loadsText(filePath) {
  return readFileSync(filePath, "utf8");
}

function sha256Text(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function absoluteFilePath(relativePath) {
  return path.resolve(repositoryRoot, relativePath);
}

function fileDigest(filePath) {
  const text = readFileSync(filePath, "utf8");
  return {
    contentSha256: sha256Text(text),
    expectedByteLength: Buffer.byteLength(text, "utf8"),
    text,
  };
}

function makeIdentifier(base) {
  return String(base)
    .replace(/[^A-Za-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\-+/, "")
    .replace(/\-+$/, "")
    .toLowerCase();
}

function buildModuleResponsibility(responsibilityId, purpose) {
  return Object.freeze({
    declaration: "<module>",
    purpose,
    responsibilityId,
    responsibilityType: "module",
  });
}

function buildFunctionResponsibility(responsibilityId, declaration, purpose, functionKind = "function-declaration") {
  return Object.freeze({
    declaration,
    functionKind,
    purpose,
    responsibilityId,
    responsibilityType: "function",
  });
}

function buildDependency({
  dependencyId,
  specifier,
  usedByArtifacts,
  allowedImports = [],
  allowedInvocations = [],
  portEffect,
}) {
  return Object.freeze({
    dependencyId,
    specifier,
    allowedImports,
    allowedInvocations,
    usedByArtifacts,
    authority: Object.freeze({
      authorityType: "port-authority.v1",
      effect: portEffect,
      portId: dependencyId,
    }),
  });
}

function buildDependencyAuthorityReference(dependencyId) {
  return Object.freeze({
    authorityType: "dependency-authority",
    dependencyId,
  });
}

function buildResponsibilityAuthorityReference(responsibilityId) {
  return Object.freeze({
    authorityType: "responsibility-authority",
    responsibilityId,
  });
}

function buildArtifactReferenceEdge({
  edgeId,
  responsibilityId,
  operation,
  purpose,
  artifactId,
  artifactResponsibilityId,
  semanticEdge,
  occurrences = 1,
}) {
  return Object.freeze({
    edgeId,
    responsibilityId,
    edgeKind: "reference",
    operation,
    argumentExpressions: [],
    occurrences,
    authorities: [buildResponsibilityAuthorityReference(artifactResponsibilityId)],
    purpose,
  });
}

function buildDependencyReferenceEdge({
  edgeId,
  responsibilityId,
  operation,
  purpose,
  dependencyId,
  occurrences = 1,
}) {
  return Object.freeze({
    edgeId,
    responsibilityId,
    edgeKind: "reference",
    operation,
    argumentExpressions: [],
    occurrences,
    authorities: [buildDependencyAuthorityReference(dependencyId)],
    purpose,
  });
}

function buildInvocationEdge({
  edgeId,
  responsibilityId,
  operation,
  argumentExpressions,
  purpose,
  dependencyIds,
  occurrences = 1,
}) {
  return Object.freeze({
    edgeId,
    responsibilityId,
    edgeKind: "invocation",
    operation,
    argumentExpressions,
    occurrences,
    authorities: dependencyIds.map((dependencyId) => buildDependencyAuthorityReference(dependencyId)),
    purpose,
  });
}

function buildDecisionAuthority({
  decisionId,
  responsibilityId,
  syntaxKind,
  conditionExpression,
  occurrences = 1,
  policy,
}) {
  return Object.freeze({
    decisionId,
    responsibilityId,
    syntaxKind,
    conditionExpression,
    occurrences,
    policy,
  });
}

function buildIterationAuthority({
  iterationId,
  responsibilityId,
  syntaxKind,
  controlExpression,
  occurrences = 1,
  continuationPolicy,
  terminationPolicy,
}) {
  return Object.freeze({
    iterationId,
    responsibilityId,
    syntaxKind,
    controlExpression,
    occurrences,
    continuationPolicy,
    terminationPolicy,
  });
}

function buildFailurePolicy({
  failurePolicyId,
  responsibilityId,
  syntaxKind,
  expression = undefined,
  occurrences = 1,
  policy,
}) {
  return Object.freeze({
    failurePolicyId,
    responsibilityId,
    syntaxKind,
    ...(expression === undefined ? {} : { expression }),
    occurrences,
    policy,
  });
}

function buildProjectionMapping({
  projectionMappingId,
  responsibilityId,
  occurrences = 1,
  fields,
  purpose,
}) {
  return Object.freeze({
    projectionMappingId,
    responsibilityId,
    occurrences,
    fields,
    purpose,
  });
}

function buildResultContract({
  resultContractId,
  resultKind,
  mediaType = "application/json",
  source,
  projectionMapping = undefined,
  purpose,
}) {
  return Object.freeze({
    resultContractId,
    resultKind,
    mediaType,
    source,
    ...(projectionMapping === undefined ? {} : { projectionMapping }),
    purpose,
  });
}

function buildSemanticAuthority({
  moduleResponsibilityId,
  modulePurpose,
  declarations,
  functionResponsibilities,
  semanticEdges = [],
  decisions = [],
  iterations = [],
  failurePolicies = [],
  projectionMappings = [],
  resultContracts = [],
  forbiddenSyntaxKinds = [],
}) {
  return Object.freeze({
    declarations: Object.freeze([...new Set(declarations)]),
    responsibilities: Object.freeze([
      buildModuleResponsibility(moduleResponsibilityId, modulePurpose),
      ...functionResponsibilities,
    ]),
    semanticEdges: Object.freeze(semanticEdges),
    decisions: Object.freeze(decisions),
    iterations: Object.freeze(iterations),
    failurePolicies: Object.freeze(failurePolicies),
    projectionMappings: Object.freeze(projectionMappings),
    resultContracts: Object.freeze(resultContracts),
    forbiddenSyntaxKinds: Object.freeze([...new Set(forbiddenSyntaxKinds)]),
  });
}

function buildTextArtifact({
  artifactId,
  relativePath,
  purpose,
  sourceAuthority,
  relationships = [],
}) {
  const absolutePath = absoluteFilePath(relativePath);
  const { contentSha256, expectedByteLength, text } = fileDigest(absolutePath);
  return Object.freeze({
    artifactId,
    artifactKind: "javascript-module",
    purpose,
    relativePath: normalizesPathKey(relativePath),
    mediaType: "text/javascript",
    projection: Object.freeze({
      projectorId: "utf8-text-projector.v1",
      authorityId: `${artifactId}.projection-authority.v1`,
      authority: Object.freeze({
        authorityType: "utf8-text.v1",
        text,
      }),
    }),
    relationships: Object.freeze(relationships),
    sourceAuthority,
    proof: Object.freeze({
      verifierIds: Object.freeze(["content-digest-verifier.v1"]),
      contentSha256,
      expectedByteLength,
    }),
  });
}

function buildsConsoleAuthorityBundlesSourceAuthority() {
  return buildSemanticAuthority({
    moduleResponsibilityId: "console-authority-bundles-module.v1",
    modulePurpose: "Aggregates console authority helpers for the query console source bodies.",
    declarations: [
      "pathnameLookupAuthority",
      "projectsSecurityHeaders",
      "serializesErrorResponse",
      "classifiesErrorDisposition",
      "extractsSnippetLines",
      "normalizesPathSegments",
      "normalizesLineEndings",
      "normalizesPathForComparison",
      "buildsErrorResponse",
      "selectsDefaultValue",
      "validatesConsoleParameters",
    ],
    functionResponsibilities: [
      buildFunctionResponsibility(
        "pathname-lookup-authority.v1",
        "pathnameLookupAuthority",
        "Maps a pathname to the admitted fallback HTTP methods."
      ),
      buildFunctionResponsibility(
        "projects-security-headers.v1",
        "projectsSecurityHeaders",
        "Projects the admitted security headers for the console response."
      ),
      buildFunctionResponsibility(
        "serializes-error-response.v1",
        "serializesErrorResponse",
        "Serializes a console error response into the admitted JSON shape."
      ),
      buildFunctionResponsibility(
        "classifies-error-disposition.v1",
        "classifiesErrorDisposition",
        "Classifies route or hostname error disposition for the fallback path."
      ),
      buildFunctionResponsibility(
        "extracts-snippet-lines.v1",
        "extractsSnippetLines",
        "Builds the ordered snippet line list from the input text."
      ),
      buildFunctionResponsibility(
        "normalizes-path-segments.v1",
        "normalizesPathSegments",
        "Normalizes path segments by splitting on both path separators."
      ),
      buildFunctionResponsibility(
        "normalizes-line-endings.v1",
        "normalizesLineEndings",
        "Normalizes line endings to LF before splitting text."
      ),
      buildFunctionResponsibility(
        "normalizes-path-for-comparison.v1",
        "normalizesPathForComparison",
        "Normalizes paths for platform-aware comparison."
      ),
      buildFunctionResponsibility(
        "builds-error-response.v1",
        "buildsErrorResponse",
        "Builds the admitted JSON error response envelope."
      ),
      buildFunctionResponsibility(
        "selects-default-value.v1",
        "selectsDefaultValue",
        "Selects the admitted default value when the primary value is falsy."
      ),
      buildFunctionResponsibility(
        "validates-console-parameters.v1",
        "validatesConsoleParameters",
        "Re-exports the console parameter validation authority."
      ),
    ],
    semanticEdges: [
      buildArtifactReferenceEdge({
        edgeId: "console-validation-adapter-reexport.v1",
        responsibilityId: "console-authority-bundles-module.v1",
        operation: "validatesConsoleParameters",
        purpose: "Re-exports the validation adapter authority into the helper bundle module.",
        artifactId: "console-validation-adapter.v1",
        artifactResponsibilityId: "validates-console-parameters.v1",
        semanticEdge: "console-validation-adapter-reexport.v1",
      }),
    ],
    decisions: [
      buildDecisionAuthority({
        decisionId: "classifies-error-disposition.v1",
        responsibilityId: "classifies-error-disposition.v1",
        syntaxKind: "IfStatement",
        conditionExpression: "error?.disposition !== 'HOSTNAME_NOT_ADMITTED'",
        occurrences: 1,
        policy: "Only HOSTNAME_NOT_ADMITTED is transformed; all other errors rethrow.",
      }),
      buildDecisionAuthority({
        decisionId: "normalizes-path-for-comparison.v1",
        responsibilityId: "normalizes-path-for-comparison.v1",
        syntaxKind: "ConditionalExpression",
        conditionExpression: "process.platform === 'win32' && toLowerCase",
        occurrences: 1,
        policy: "Lowercase only on Windows when requested.",
      }),
      buildDecisionAuthority({
        decisionId: "selects-default-value.v1",
        responsibilityId: "selects-default-value.v1",
        syntaxKind: "LogicalOrExpression",
        conditionExpression: "value || defaultValue",
        occurrences: 1,
        policy: "Use the default value when the primary value is falsy.",
      }),
    ],
    iterations: [
      buildIterationAuthority({
        iterationId: "extracts-snippet-lines.v1",
        responsibilityId: "extracts-snippet-lines.v1",
        syntaxKind: "ForStatement",
        controlExpression: "for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1)",
        occurrences: 1,
        continuationPolicy: "Advance while the line number stays within the snippet window.",
        terminationPolicy: "Stop after the last admitted snippet line.",
      }),
    ],
    projectionMappings: [
      buildProjectionMapping({
        projectionMappingId: "pathname-lookup-authority.v1",
        responsibilityId: "pathname-lookup-authority.v1",
        occurrences: 1,
        fields: [
          {
            outputField: "allowMethods",
            sourceExpression: "knownPathnameAllow.get(pathname)",
          },
        ],
        purpose: "Map each admitted pathname to the allowed HTTP methods.",
      }),
      buildProjectionMapping({
        projectionMappingId: "projects-security-headers.v1",
        responsibilityId: "projects-security-headers.v1",
        occurrences: 1,
        fields: [
          {
            outputField: "securityHeaders",
            sourceExpression: "{ Content-Security-Policy, Cache-Control, Cross-Origin-Resource-Policy, Referrer-Policy, X-Content-Type-Options, Permissions-Policy }",
          },
        ],
        purpose: "Project the admitted console security headers.",
      }),
      buildProjectionMapping({
        projectionMappingId: "normalizes-path-segments.v1",
        responsibilityId: "normalizes-path-segments.v1",
        occurrences: 1,
        fields: [
          {
            outputField: "segments",
            sourceExpression: "modulePath.split('/').flatMap((segment) => segment.split(backslash))",
          },
        ],
        purpose: "Normalize mixed path separators into path segments.",
      }),
      buildProjectionMapping({
        projectionMappingId: "normalizes-line-endings.v1",
        responsibilityId: "normalizes-line-endings.v1",
        occurrences: 1,
        fields: [
          {
            outputField: "lines",
            sourceExpression: "text.replaceAll('\\r\\n', '\\n').replaceAll('\\r', '\\n').split('\\n')",
          },
        ],
        purpose: "Normalize line endings to LF before splitting text.",
      }),
      buildProjectionMapping({
        projectionMappingId: "builds-error-response.v1",
        responsibilityId: "builds-error-response.v1",
        occurrences: 1,
        fields: [
          {
            outputField: "body",
            sourceExpression: "{ error: message }",
          },
        ],
        purpose: "Build the admitted JSON error response body.",
      }),
    ],
    resultContracts: [
      buildResultContract({
        resultContractId: "serializes-error-response.v1",
        resultKind: "console-error-response",
        mediaType: "application/json",
        source: {
          sourceType: "return",
          responsibilityId: "serializes-error-response.v1",
          returnKind: "explicit-return",
          expression: "JSON.stringify({ error: message })",
          occurrences: 1,
        },
        purpose: "Returns the admitted console error response body.",
      }),
      buildResultContract({
        resultContractId: "extracts-snippet-lines.v1",
        resultKind: "console-snippet-lines",
        mediaType: "application/json",
        source: {
          sourceType: "return",
          responsibilityId: "extracts-snippet-lines.v1",
          returnKind: "explicit-return",
          expression: "lines",
          occurrences: 1,
        },
        purpose: "Returns the admitted snippet line array.",
      }),
      buildResultContract({
        resultContractId: "builds-error-response.v1",
        resultKind: "console-error-envelope",
        mediaType: "application/json",
        source: {
          sourceType: "return",
          responsibilityId: "builds-error-response.v1",
          returnKind: "explicit-return",
          expression: "{ statusCode, body: { error: message } }",
          occurrences: 1,
        },
        purpose: "Returns the admitted statusCode/body error envelope.",
      }),
      buildResultContract({
        resultContractId: "validates-console-parameters.v1",
        resultKind: "console-validation-result",
        mediaType: "application/json",
        source: {
          sourceType: "return",
          responsibilityId: "validates-console-parameters.v1",
          returnKind: "explicit-return",
          expression: "executeSemanticAuthority(consoleValidationBundle, parameters)",
          occurrences: 1,
        },
        purpose: "Returns the admitted console validation result.",
      }),
    ],
    forbiddenSyntaxKinds: [
      "DebuggerStatement",
      "DoStatement",
      "DynamicImportExpression",
      "SwitchStatement",
      "WhileStatement",
      "WithStatement",
    ],
  });
}

function buildsDelegatingAdapterSourceAuthority({
  moduleResponsibilityId,
  modulePurpose,
  functionDefinitions,
  bundleDependencyId,
  bundleVariableName,
  runtimeDependencyId,
  forbiddenSyntaxKinds = [
    "DebuggerStatement",
    "DoStatement",
    "DynamicImportExpression",
    "IfStatement",
    "SwitchStatement",
    "TryStatement",
    "CatchClause",
    "ThrowStatement",
    "WhileStatement",
    "WithStatement",
  ],
}) {
  const functionResponsibilities = functionDefinitions.map((definition) =>
    buildFunctionResponsibility(
      definition.responsibilityId,
      definition.functionName,
      definition.purpose,
      "function-declaration"
    )
  );

  const semanticEdges = [];
  const resultContracts = [];

  for (const definition of functionDefinitions) {
    semanticEdges.push(
      buildDependencyReferenceEdge({
        edgeId: `${definition.responsibilityId}-bundle-reference.v1`,
        responsibilityId: definition.responsibilityId,
        operation: bundleVariableName,
        purpose: `Binds ${bundleVariableName} to the admitted semantic authority bundle.`,
        dependencyId: bundleDependencyId,
      })
    );

    semanticEdges.push(
      buildInvocationEdge({
        edgeId: `${definition.responsibilityId}-authority-invocation.v1`,
        responsibilityId: definition.responsibilityId,
        operation: "executeSemanticAuthority",
        argumentExpressions: [bundleVariableName, definition.argumentExpression],
        purpose: `Delegates ${definition.functionName} to the semantic execution runtime.`,
        dependencyIds: [bundleDependencyId, runtimeDependencyId],
      })
    );

    resultContracts.push(
      buildResultContract({
        resultContractId: definition.resultContractId,
        resultKind: definition.resultKind,
        mediaType: "application/json",
        source: {
          sourceType: "return",
          responsibilityId: definition.responsibilityId,
          returnKind: "explicit-return",
          expression: `executeSemanticAuthority(${bundleVariableName}, ${definition.argumentExpression})`,
          occurrences: 1,
        },
        purpose: definition.resultPurpose,
      })
    );
  }

  return buildSemanticAuthority({
    moduleResponsibilityId,
    modulePurpose,
    declarations: functionDefinitions.map((definition) => definition.functionName),
    functionResponsibilities,
    semanticEdges,
    resultContracts,
    forbiddenSyntaxKinds,
  });
}

function buildsConsoleServerSourceAuthority({
  artifactId,
  moduleResponsibilityId,
  modulePurpose,
  exportedFunctionNames,
  authorityComplete,
  bundleArtifactId,
  validationArtifactId,
  routeDependencyId,
  loopbackDependencyId,
  cspDependencyId,
  queryDependencyId,
}) {
  const mechanicById = new Map((authorityComplete.authority?.mechanics ?? []).map((mechanic) => [mechanic.mechanicId, mechanic]));

  const functionResponsibilities = [
    buildFunctionResponsibility(
      `${artifactId}-entrypoint.v1`,
      "servesQueryConsole",
      "Starts the loopback HTTP server and wires the admitted console authority."
    ),
    buildFunctionResponsibility(
      `${artifactId}-request-handler.v1`,
      "handleRequestWithAuthority",
      "Handles each request using the admitted console authority surfaces."
    ),
    buildFunctionResponsibility(
      `${artifactId}-console-html.v1`,
      "handleConsoleHtml",
      "Projects the admitted console HTML response."
    ),
    buildFunctionResponsibility(
      `${artifactId}-index-info.v1`,
      "handleIndexInfo",
      "Projects the admitted index metadata response."
    ),
    buildFunctionResponsibility(
      `${artifactId}-query.v1`,
      "handleQuery",
      "Delegates query execution to the admitted relational engine."
    ),
    buildFunctionResponsibility(
      `${artifactId}-snippet.v1`,
      "handleSnippet",
      "Projects the admitted snippet response."
    ),
    buildFunctionResponsibility(
      `${artifactId}-json-body.v1`,
      "readJsonBody",
      "Reads and parses a JSON request body."
    ),
  ];

  const semanticEdges = [
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-console-authority-bundles-reference.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      operation: "pathnameLookupAuthority",
      purpose: "Binds the console authority helper bundle into the server entrypoint.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "pathname-lookup-authority.v1",
      semanticEdge: `${artifactId}-console-authority-bundles-reference.v1`,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-console-validation-reference.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      operation: "validatesConsoleParameters",
      purpose: "Binds console parameter validation into the server entrypoint.",
      artifactId: validationArtifactId,
      artifactResponsibilityId: "validates-console-parameters.v1",
      semanticEdge: `${artifactId}-console-validation-reference.v1`,
    }),
    buildDependencyReferenceEdge({
      edgeId: `${artifactId}-loopback-bind-dependency.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      operation: "classifiesLoopbackBind",
      purpose: "Binds loopback admission to the external source-facts console authority.",
      dependencyId: loopbackDependencyId,
    }),
    buildDependencyReferenceEdge({
      edgeId: `${artifactId}-route-dispatch-dependency.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      operation: "classifiesRoute",
      purpose: "Binds route classification to the external source-facts console authority.",
      dependencyId: routeDependencyId,
    }),
    buildDependencyReferenceEdge({
      edgeId: `${artifactId}-csp-dependency.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      operation: "projectsCspPolicy",
      purpose: "Binds the console CSP policy projection to the external source-facts authority.",
      dependencyId: cspDependencyId,
    }),
    buildDependencyReferenceEdge({
      edgeId: `${artifactId}-relational-query-dependency.v1`,
      responsibilityId: `${artifactId}-query.v1`,
      operation: "executeRelationalQuery",
      purpose: "Binds SQL execution to the query engine dependency.",
      dependencyId: queryDependencyId,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-security-headers-reference.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      operation: "projectsSecurityHeaders",
      purpose: "Binds the admitted security header projection from the helper bundle.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "projects-security-headers.v1",
      semanticEdge: `${artifactId}-security-headers-reference.v1`,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-error-response-reference.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      operation: "serializesErrorResponse",
      purpose: "Binds console error serialization from the helper bundle.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "serializes-error-response.v1",
      semanticEdge: `${artifactId}-error-response-reference.v1`,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-error-disposition-reference.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      operation: "classifiesErrorDisposition",
      purpose: "Binds error disposition handling from the helper bundle.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "classifies-error-disposition.v1",
      semanticEdge: `${artifactId}-error-disposition-reference.v1`,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-snippet-lines-reference.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      operation: "extractsSnippetLines",
      purpose: "Binds snippet line extraction from the helper bundle.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "extracts-snippet-lines.v1",
      semanticEdge: `${artifactId}-snippet-lines-reference.v1`,
    }),
    buildArtifactReferenceEdge({
      edgeId: `${artifactId}-failure-policies-reference.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      operation: "validatesConsoleParameters",
      purpose: "Binds the helper bundle exported validation function into the entrypoint.",
      artifactId: bundleArtifactId,
      artifactResponsibilityId: "validates-console-parameters.v1",
      semanticEdge: `${artifactId}-failure-policies-reference.v1`,
    }),
    {
      edgeId: `${artifactId}-security-header-write.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      edgeKind: "write",
      operation: "response.setHeader",
      argumentExpressions: ["key", "value"],
      occurrences: 1,
      authorities: [
        buildDependencyAuthorityReference(cspDependencyId),
        buildDependencyAuthorityReference(queryDependencyId),
      ],
      purpose: "Writes the admitted security headers to the console response.",
    },
    {
      edgeId: `${artifactId}-response-write.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      edgeKind: "write",
      operation: "response.end",
      argumentExpressions: ["body"],
      occurrences: 1,
      authorities: [buildDependencyAuthorityReference(queryDependencyId)],
      purpose: "Writes the admitted JSON response body.",
    },
    {
      edgeId: `${artifactId}-server-listen.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      edgeKind: "invocation",
      operation: "server.listen",
      argumentExpressions: ["{ host: hostname, port }"],
      occurrences: 1,
      authorities: [buildDependencyAuthorityReference(loopbackDependencyId)],
      purpose: "Starts the HTTP server on the admitted loopback host.",
    },
  ];

  const decisions = [
    buildDecisionAuthority({
      decisionId: `${artifactId}-error-disposition.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      syntaxKind: "IfStatement",
      conditionExpression: mechanicById.get("error-disposition-check")?.semantic?.condition ?? "error?.disposition !== 'HOSTNAME_NOT_ADMITTED'",
      occurrences: mechanicById.get("error-disposition-check")?.coverage === "AUTHORITY_BOUND" ? 1 : 0 || 1,
      policy: mechanicById.get("error-disposition-check")?.decisions?.why_re_throw ?? "Only HOSTNAME_NOT_ADMITTED is transformed; all other errors rethrow.",
    }),
    buildDecisionAuthority({
      decisionId: `${artifactId}-index-required.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      syntaxKind: "IfStatement",
      conditionExpression: mechanicById.get("index-required-validation")?.semantic?.fallback_detection ?? "index === null || typeof index !== 'object'",
      occurrences: 1,
      policy: mechanicById.get("index-required-validation")?.decisions?.recovery_allowed ?? "The console requires a loaded source-fact index.",
    }),
    buildDecisionAuthority({
      decisionId: `${artifactId}-asset-path-required.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      syntaxKind: "IfStatement",
      conditionExpression: mechanicById.get("asset-path-validation")?.semantic?.fallback_detection ?? "typeof consoleAssetPath !== 'string' || consoleAssetPath.trim().length === 0",
      occurrences: 1,
      policy: "The console asset path must be a non-empty string.",
    }),
    buildDecisionAuthority({
      decisionId: `${artifactId}-route-dispatch.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      syntaxKind: "IfStatement",
      conditionExpression: "classifiesRoute returns a routeId or the request falls back to the admitted pathname lookup.",
      occurrences: 1,
      policy: "Only admitted console routes are dispatched.",
    }),
    buildDecisionAuthority({
      decisionId: `${artifactId}-path-comparison.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      syntaxKind: "ConditionalExpression",
      conditionExpression: "process.platform === 'win32'",
      occurrences: 1,
      policy: "Normalize paths only as needed for platform-aware comparison.",
    }),
  ];

  const iterations = [
    buildIterationAuthority({
      iterationId: `${artifactId}-file-lines-iteration.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      syntaxKind: "ForStatement",
      controlExpression: mechanicById.get("file-lines-iteration")?.semantic?.body?.join(" -> ") ?? "for (let lineNumber = firstLine; lineNumber <= lastLine; lineNumber += 1)",
      occurrences: 1,
      continuationPolicy: "Advance in ascending line-number order.",
      terminationPolicy: "Stop after the last admitted line.",
    }),
  ];

  const failurePolicies = [
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-hostname-validation-loopback.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      syntaxKind: "CatchClause",
      expression: "throw new Error('The query console server may bind only to 127.0.0.1.')",
      occurrences: 1,
      policy: "Only HOSTNAME_NOT_ADMITTED is transformed; other errors are rethrown.",
    }),
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-query-body-parse.v1`,
      responsibilityId: `${artifactId}-query.v1`,
      syntaxKind: "TryStatement",
      expression: "readJsonBody(request)",
      occurrences: 1,
      policy: "Malformed JSON request bodies become a 400 response.",
    }),
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-url-decode.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      syntaxKind: "TryStatement",
      expression: "decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname)",
      occurrences: 1,
      policy: "Malformed URLs become a 400 response.",
    }),
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-snippet-validation.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      syntaxKind: "ThrowStatement",
      expression: "throw new Error('modulePath and a numeric startLine are required.')",
      occurrences: 1,
      policy: "Invalid snippet inputs fail closed.",
    }),
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-snippet-range.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      syntaxKind: "ThrowStatement",
      expression: "throw new Error('endLine must be >= startLine and within 400 lines.')",
      occurrences: 1,
      policy: "Snippet ranges must stay within the admitted bounds.",
    }),
    buildFailurePolicy({
      failurePolicyId: `${artifactId}-uncaught-error.v1`,
      responsibilityId: `${artifactId}-entrypoint.v1`,
      syntaxKind: "CatchClause",
      expression: "serializesErrorResponse({ error, context: 'request-handler-uncaught' })",
      occurrences: 1,
      policy: "Uncaught request-handler errors become admitted JSON error responses.",
    }),
  ];

  const projectionMappings = [
    buildProjectionMapping({
      projectionMappingId: `${artifactId}-pathname-allow-map.v1`,
      responsibilityId: `${artifactId}-request-handler.v1`,
      occurrences: 1,
      fields: [
        {
          outputField: "allowMethods",
          sourceExpression: "knownPathnameAllow.get(pathname)",
        },
      ],
      purpose: "Map admitted pathnames to their allowed HTTP methods.",
    }),
    buildProjectionMapping({
      projectionMappingId: `${artifactId}-line-ending-normalization.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      occurrences: 1,
      fields: [
        {
          outputField: "lines",
          sourceExpression: "text.replaceAll('\\r\\n', '\\n').replaceAll('\\r', '\\n').split('\\n')",
        },
      ],
      purpose: "Normalize line endings before splitting a snippet into lines.",
    }),
    buildProjectionMapping({
      projectionMappingId: `${artifactId}-path-segment-normalization.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      occurrences: 1,
      fields: [
        {
          outputField: "segments",
          sourceExpression: "modulePath.split('/').flatMap((segment) => segment.split(backslash))",
        },
      ],
      purpose: "Normalize mixed path separators into path segments.",
    }),
    buildProjectionMapping({
      projectionMappingId: `${artifactId}-path-case-normalization.v1`,
      responsibilityId: `${artifactId}-snippet.v1`,
      occurrences: 1,
      fields: [
        {
          outputField: "comparisonPath",
          sourceExpression: "process.platform === 'win32' ? path.toLowerCase() : path",
        },
      ],
      purpose: "Normalize path comparison semantics per platform.",
    }),
  ];

  const resultContracts = [
    buildResultContract({
      resultContractId: `${artifactId}-error-response.v1`,
      resultKind: "console-error-response",
      mediaType: "application/json",
      source: {
        sourceType: "return",
        responsibilityId: `${artifactId}-request-handler.v1`,
        returnKind: "explicit-return",
        expression: "JSON.stringify(errorResponse.body)",
        occurrences: 1,
      },
      purpose: "Returns the admitted console error response shape.",
    }),
    buildResultContract({
      resultContractId: `${artifactId}-query-response.v1`,
      resultKind: "console-query-response",
      mediaType: "application/json",
      source: {
        sourceType: "return",
        responsibilityId: `${artifactId}-query.v1`,
        returnKind: "explicit-return",
        expression: "JSON.stringify(receipt)",
        occurrences: 1,
      },
      purpose: "Returns the admitted relational query receipt.",
    }),
    buildResultContract({
      resultContractId: `${artifactId}-snippet-response.v1`,
      resultKind: "console-snippet-response",
      mediaType: "application/json",
      source: {
        sourceType: "return",
        responsibilityId: `${artifactId}-snippet.v1`,
        returnKind: "explicit-return",
        expression: "JSON.stringify({ available: true, modulePath, startLine, endLine, lines })",
        occurrences: 1,
      },
      purpose: "Returns the admitted snippet response shape.",
    }),
    buildResultContract({
      resultContractId: `${artifactId}-index-info-response.v1`,
      resultKind: "console-index-info-response",
      mediaType: "application/json",
      source: {
        sourceType: "return",
        responsibilityId: `${artifactId}-index-info.v1`,
        returnKind: "explicit-return",
        expression: "JSON.stringify({ indexType, indexId, workspaceId, workspaceRootAvailable, coverage, counts })",
        occurrences: 1,
      },
      purpose: "Returns the admitted index-info response shape.",
    }),
  ];

  return buildSemanticAuthority({
    moduleResponsibilityId,
    modulePurpose,
    declarations: exportedFunctionNames,
    functionResponsibilities,
    semanticEdges,
    decisions,
    iterations,
    failurePolicies,
    projectionMappings,
    resultContracts,
    forbiddenSyntaxKinds: [
      "DebuggerStatement",
      "DoStatement",
      "DynamicImportExpression",
      "SwitchStatement",
      "WhileStatement",
      "WithStatement",
    ],
  });
}

function buildsConsoleGovernedContract({
  workspaceRoot = consoleWorkspaceRoot,
  templateContractPath = defaultTemplateContractPath,
  authorityPath = defaultAuthorityPath,
  authorityCompletePath = defaultAuthorityCompletePath,
  bindingPath = defaultBindingPath,
  violationBindingsPath = defaultViolationBindingsPath,
  strategyDocPath = defaultStrategyDocPath,
  outputPath = defaultOutputPath,
} = {}) {
  const template = loadsJson(templateContractPath);
  const authority = loadsJson(authorityPath);
  const authorityComplete = loadsJson(authorityCompletePath);
  const binding = loadsJson(bindingPath);
  const violationBindings = loadsJson(violationBindingsPath);
  const strategyDoc = loadsText(strategyDocPath);

  const artifactSpecs = [
    {
      artifactId: "console-authority-bundles.v1",
      relativePath: "src/console/console-authority-bundles.mjs",
      purpose: "Aggregates the console helper authorities for the query console source bodies.",
      sourceAuthority: buildsConsoleAuthorityBundlesSourceAuthority(),
      relationships: [
        {
          relationshipType: "reads",
          artifactId: "console-validation-adapter.v1",
        },
      ],
    },
    {
      artifactId: "console-routing-adapter.v1",
      relativePath: "src/console/console-routing-adapter.mjs",
      purpose: "Delegates console request routing to the semantic execution runtime.",
      sourceAuthority: buildsDelegatingAdapterSourceAuthority({
        moduleResponsibilityId: "console-routing-adapter-module.v1",
        modulePurpose: "Delegates console request routing to the semantic execution runtime.",
        functionDefinitions: [
          {
            functionName: "routesConsoleRequest",
            responsibilityId: "routes-console-request.v1",
            purpose: "Routes a console request through the admitted semantic authority bundle.",
            argumentExpression: "requestContext",
            resultContractId: "console-route-result.v1",
            resultKind: "console-route-result",
            resultPurpose: "Returns the console route result from the admitted runtime.",
          },
        ],
        bundleDependencyId: "console-request-routing-bundle.v1",
        bundleVariableName: "consoleRoutingBundle",
        runtimeDependencyId: "semantic-authority-runtime.v1",
      }),
    },
    {
      artifactId: "console-validation-adapter.v1",
      relativePath: "src/console/console-validation-adapter.mjs",
      purpose: "Delegates console parameter validation to semantic execution authorities.",
      sourceAuthority: buildsDelegatingAdapterSourceAuthority({
        moduleResponsibilityId: "console-validation-adapter-module.v1",
        modulePurpose: "Delegates console parameter validation to semantic execution authorities.",
        functionDefinitions: [
          {
            functionName: "validatesConsoleParameters",
            responsibilityId: "validates-console-parameters.v1",
            purpose: "Validates the admitted console server initialization parameters.",
            argumentExpression: "parameters",
            resultContractId: "console-validation-result.v1",
            resultKind: "console-validation-result",
            resultPurpose: "Returns the admitted console parameter validation result.",
          },
          {
            functionName: "validatesLoopbackBinding",
            responsibilityId: "validates-loopback-binding.v1",
            purpose: "Validates that the console binds only to loopback.",
            argumentExpression: "{ validation: 'loopback-binding', hostname }",
            resultContractId: "console-loopback-validation-result.v1",
            resultKind: "console-loopback-validation-result",
            resultPurpose: "Returns the admitted loopback binding validation result.",
          },
        ],
        bundleDependencyId: "console-validation-bundle.v1",
        bundleVariableName: "consoleValidationBundle",
        runtimeDependencyId: "semantic-authority-runtime.v1",
      }),
    },
    {
      artifactId: "console-snippet-adapter.v1",
      relativePath: "src/console/console-snippet-adapter.mjs",
      purpose: "Delegates snippet line extraction to semantic execution authorities.",
      sourceAuthority: buildsDelegatingAdapterSourceAuthority({
        moduleResponsibilityId: "console-snippet-adapter-module.v1",
        modulePurpose: "Delegates snippet line extraction to semantic execution authorities.",
        functionDefinitions: [
          {
            functionName: "extractsSnippetLines",
            responsibilityId: "extracts-snippet-lines.v1",
            purpose: "Builds the admitted snippet lines through the semantic execution runtime.",
            argumentExpression: "snippetRequest",
            resultContractId: "console-snippet-lines-result.v1",
            resultKind: "console-snippet-lines-result",
            resultPurpose: "Returns the admitted snippet line result.",
          },
        ],
        bundleDependencyId: "console-snippet-retrieval-bundle.v1",
        bundleVariableName: "consoleSnippetBundle",
        runtimeDependencyId: "semantic-authority-runtime.v1",
      }),
    },
    {
      artifactId: "serves-query-console.v1",
      relativePath: "src/console/serves-query-console.mjs",
      purpose: "Serves the console HTTP entrypoint using authority-backed routing, validation, and snippet retrieval.",
      sourceAuthority: buildsConsoleServerSourceAuthority({
        artifactId: "serves-query-console",
        moduleResponsibilityId: "serves-query-console-module.v1",
        modulePurpose: "Serves the console HTTP entrypoint using authority-backed routing, validation, and snippet retrieval.",
        exportedFunctionNames: [
          "servesQueryConsole",
          "handleRequestWithAuthority",
          "handleConsoleHtml",
          "handleIndexInfo",
          "handleQuery",
          "handleSnippet",
          "readJsonBody",
        ],
        authorityComplete,
        bundleArtifactId: "console-authority-bundles.v1",
        validationArtifactId: "console-validation-adapter.v1",
        routeDependencyId: "route-dispatch-authority.v1",
        loopbackDependencyId: "loopback-bind-authority.v1",
        cspDependencyId: "csp-policy-authority.v1",
        queryDependencyId: "relational-query-runtime.v1",
      }),
      relationships: [
        {
          relationshipType: "reads",
          artifactId: "console-authority-bundles.v1",
        },
      ],
    },
    {
      artifactId: "serves-query-console-conformant.v1",
      relativePath: "src/console/serves-query-console.conformant.mjs",
      purpose: "Projected conformant console snapshot used during the migration pilot.",
      sourceAuthority: buildsConsoleServerSourceAuthority({
        artifactId: "serves-query-console-conformant",
        moduleResponsibilityId: "serves-query-console-conformant-module.v1",
        modulePurpose: "Projected conformant console snapshot used during the migration pilot.",
        exportedFunctionNames: [
          "servesQueryConsole",
          "handleRequestWithAuthority",
          "handleConsoleHtml",
          "handleIndexInfo",
          "handleQuery",
          "handleSnippet",
          "readJsonBody",
        ],
        authorityComplete,
        bundleArtifactId: "console-authority-bundles.v1",
        validationArtifactId: "console-validation-adapter.v1",
        routeDependencyId: "route-dispatch-authority.v1",
        loopbackDependencyId: "loopback-bind-authority.v1",
        cspDependencyId: "csp-policy-authority.v1",
        queryDependencyId: "relational-query-runtime.v1",
      }),
      relationships: [
        {
          relationshipType: "derived-from",
          artifactId: "serves-query-console.v1",
        },
      ],
    },
    {
      artifactId: "serves-query-console-projected.v1",
      relativePath: "src/console/serves-query-console.projected.mjs",
      purpose: "Projected console snapshot used during the migration pilot.",
      sourceAuthority: buildsConsoleServerSourceAuthority({
        artifactId: "serves-query-console-projected",
        moduleResponsibilityId: "serves-query-console-projected-module.v1",
        modulePurpose: "Projected console snapshot used during the migration pilot.",
        exportedFunctionNames: [
          "servesQueryConsole",
          "handleRequestWithAuthority",
          "handleConsoleHtml",
          "handleIndexInfo",
          "handleQuery",
          "handleSnippet",
          "readJsonBody",
        ],
        authorityComplete,
        bundleArtifactId: "console-authority-bundles.v1",
        validationArtifactId: "console-validation-adapter.v1",
        routeDependencyId: "route-dispatch-authority.v1",
        loopbackDependencyId: "loopback-bind-authority.v1",
        cspDependencyId: "csp-policy-authority.v1",
        queryDependencyId: "relational-query-runtime.v1",
      }),
      relationships: [
        {
          relationshipType: "derived-from",
          artifactId: "serves-query-console.v1",
        },
      ],
    },
  ];

  const artifacts = artifactSpecs.map((artifact) =>
    buildTextArtifact({
      artifactId: artifact.artifactId,
      relativePath: artifact.relativePath,
      purpose: artifact.purpose,
      sourceAuthority: artifact.sourceAuthority,
      relationships: artifact.relationships ?? [],
    })
  );

  const dependencies = [
    buildDependency({
      dependencyId: "semantic-authority-runtime.v1",
      specifier: "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs",
      usedByArtifacts: [
        "console-routing-adapter.v1",
        "console-validation-adapter.v1",
        "console-snippet-adapter.v1",
      ],
      allowedImports: ["executeSemanticAuthority"],
      allowedInvocations: ["executeSemanticAuthority"],
      portEffect: "execute-semantic-authority",
    }),
    buildDependency({
      dependencyId: "relational-query-runtime.v1",
      specifier: "../query.js",
      usedByArtifacts: [
        "serves-query-console.v1",
        "serves-query-console-conformant.v1",
        "serves-query-console-projected.v1",
      ],
      allowedImports: ["executeRelationalQuery"],
      allowedInvocations: ["executeRelationalQuery"],
      portEffect: "execute-relational-query",
    }),
    buildDependency({
      dependencyId: "route-dispatch-authority.v1",
      specifier: "../../source-facts-query-console/src/route-dispatch-adapter.mjs",
      usedByArtifacts: [
        "serves-query-console.v1",
        "serves-query-console-conformant.v1",
        "serves-query-console-projected.v1",
      ],
      allowedImports: ["classifiesRoute"],
      allowedInvocations: ["classifiesRoute"],
      portEffect: "classify-route",
    }),
    buildDependency({
      dependencyId: "loopback-bind-authority.v1",
      specifier: "../../source-facts-query-console/src/loopback-bind-adapter.mjs",
      usedByArtifacts: [
        "serves-query-console.v1",
        "serves-query-console-conformant.v1",
        "serves-query-console-projected.v1",
      ],
      allowedImports: ["classifiesLoopbackBind"],
      allowedInvocations: ["classifiesLoopbackBind"],
      portEffect: "classify-loopback-bind",
    }),
    buildDependency({
      dependencyId: "csp-policy-authority.v1",
      specifier: "../../source-facts-query-console/src/csp-policy-adapter.mjs",
      usedByArtifacts: [
        "serves-query-console.v1",
        "serves-query-console-conformant.v1",
        "serves-query-console-projected.v1",
      ],
      allowedImports: ["projectsCspPolicy"],
      allowedInvocations: ["projectsCspPolicy"],
      portEffect: "project-csp-policy",
    }),
    buildDependency({
      dependencyId: "console-request-routing-bundle.v1",
      specifier: "./contracts/console-request-routing.bundle.json",
      usedByArtifacts: ["console-routing-adapter.v1"],
      allowedImports: ["default"],
      allowedInvocations: [],
      portEffect: "read-semantic-authority",
    }),
    buildDependency({
      dependencyId: "console-validation-bundle.v1",
      specifier: "./contracts/console-validation.bundle.json",
      usedByArtifacts: ["console-validation-adapter.v1"],
      allowedImports: ["default"],
      allowedInvocations: [],
      portEffect: "read-semantic-authority",
    }),
    buildDependency({
      dependencyId: "console-snippet-retrieval-bundle.v1",
      specifier: "./contracts/console-snippet-retrieval.bundle.json",
      usedByArtifacts: ["console-snippet-adapter.v1"],
      allowedImports: ["default"],
      allowedInvocations: [],
      portEffect: "read-semantic-authority",
    }),
  ];

  const contract = structuredClone(template);
  contract.contract = Object.freeze({
    contractType: "governed-artifact-contract.v1",
    contractId: "serves-query-console-governed-contract",
    status: "admitted",
    contractVersion: "1.0.0",
  });
  contract.subject = Object.freeze({
    subjectType: "console-module-family",
    subjectId: "serves-query-console",
    purpose: "Query console HTTP server and its helper modules are projected from contract-authored authority.",
    authority: Object.freeze({
      closedLoop: [
        "authority",
        "binding",
        "projection",
        "workspace",
        "trust",
      ],
      consoleArtifacts: artifacts.map((artifact) => artifact.artifactId),
      consoleWorkspaceRoot: normalizesPathKey(path.relative(repositoryRoot, workspaceRoot)) || ".",
    }),
  });
  contract.workspace = Object.freeze({
    workspaceRoot: ".",
    artifactRoot: ".",
    governedScope: Object.freeze({
      scopeType: "declared-artifact-scope.v1",
      inventoryMode: "declared-paths",
      governedDirectories: Object.freeze(["src/console"]),
      outsideScopePosture: "outside-authority",
      requiredDisposition: "ARTIFACT_SCOPE_CLOSED",
    }),
    pathExceptions: Object.freeze([]),
  });
  contract.projectionLedger = Object.freeze({
    relativePath: ".governance/projections/serves-query-console.governed.ledger.json",
  });
  contract.receipt = Object.freeze({
    relativePath: ".governance/receipts/serves-query-console.governed.receipt.json",
  });
  contract.dependencies = dependencies;
  contract.effects = [];
  contract.runtimeAuthorities = [];
  contract.artifacts = artifacts;
  contract.exclusions = [];
  contract.conformance = Object.freeze({
    artifactEvaluations: [
      {
        evaluationId: "validate-console-governed-contract.v1",
        verifierId: "command-exit-verifier.v1",
        command: [
          "node",
          externalGovernanceEnginePath,
          "validate",
          "--contract",
          outputPath,
        ],
        expectedExitCode: 0,
        expectedStdoutContains: "CONTRACT_VALID",
      },
    ],
  });
  contract.claims = [
    { claimId: "console-contract-complete.v1", claim: "COMPLETE" },
    { claimId: "console-contract-authority-closed.v1", claim: "CONTRACT_AUTHORITY_CLOSED" },
  ];
  contract.lineage = Object.freeze({
    authorityType: "canonical-lineage-authority.v1",
    projectId: "serves-query-console",
    features: [
      {
        featureId: "serve-query-console",
        projectId: "serves-query-console",
        purpose: "Serve the query console HTTP entrypoint with authority-backed routing, validation, and snippet retrieval.",
      },
      {
        featureId: "delegate-console-authority",
        projectId: "serves-query-console",
        purpose: "Delegate the admitted console mechanics to helper authorities and runtime dependencies.",
      },
      {
        featureId: "project-console-contract",
        projectId: "serves-query-console",
        purpose: "Project a governed contract draft from the current authority and source-fact evidence.",
      },
    ],
    scenarios: [
      {
        featureId: "serve-query-console",
        scenarioId: "serve-console-over-loopback",
        purpose: "The console binds only to loopback and serves query, index, and snippet responses.",
      },
      {
        featureId: "delegate-console-authority",
        scenarioId: "delegate-console-mechanics",
        purpose: "The console body delegates routing, validation, and snippet extraction to admitted authorities.",
      },
      {
        featureId: "project-console-contract",
        scenarioId: "project-governed-console-contract",
        purpose: "The translator emits a governed contract draft without hand-authoring the contract bytes.",
      },
    ],
    obligations: [
      {
        obligationId: "console-serves-loopback-only",
        scenarioId: "serve-console-over-loopback",
        statement: "The console server must bind only to the loopback interface.",
      },
      {
        obligationId: "console-delegates-mechanics",
        scenarioId: "delegate-console-mechanics",
        statement: "The console source body must delegate admitted mechanics to authority surfaces.",
      },
      {
        obligationId: "console-contract-is-projected",
        scenarioId: "project-governed-console-contract",
        statement: "The console governed contract must be projected from source facts and admitted authority data.",
      },
    ],
    responsibilities: artifacts.map((artifact) => ({
      artifactId: artifact.artifactId,
      obligationId:
        artifact.artifactId === "serves-query-console.v1" ||
        artifact.artifactId === "serves-query-console-conformant.v1" ||
        artifact.artifactId === "serves-query-console-projected.v1"
          ? "console-serves-loopback-only"
          : artifact.artifactId === "console-authority-bundles.v1"
            ? "console-delegates-mechanics"
            : "console-contract-is-projected",
      projectionProfileId: "utf8-text-projector.v1",
      responsibilityId: `${artifact.artifactId}.responsibility.v1`,
      responsibilityType: "semantic-execution",
    })),
  });
  contract.designAuthority = Object.freeze({
    authorityType: "conversation-design-authority.v1",
    conversationDigest: sha256Text(strategyDoc),
    decisions: [
      {
        decisionId: "console-stage-4-translator.v1",
        source: "docs/automated-conformance-projection-strategy.md",
        statement: "Project the console governed contract from the current authority complete file and the console source bytes.",
        disposition: "accepted",
      },
      {
        decisionId: "console-draft-contract-as-separate-artifact.v1",
        source: "docs/automated-conformance-projection-strategy.md",
        statement: "Emit the governed contract draft as a separate artifact instead of overwriting the template example in place.",
        disposition: "accepted",
      },
    ],
    deviations: [
      {
        decisionId: "bundle-generation-pending.v1",
        proposed: "Generate the console helper bundle JSON files from governed semantic authorities.",
        implemented: "The translator declares the bundle JSONs as dependencies while the runtime bundle files remain pending.",
        reason: "The contract drafting step is intentionally ahead of bundle materialization.",
        impact: "The contract is reviewable now while the bundle projection step remains a follow-on task.",
      },
    ],
    tieOut: [
      {
        decisionId: "console-stage-4-translator.v1",
        artifactIds: artifacts.map((artifact) => artifact.artifactId),
      },
      {
        decisionId: "console-draft-contract-as-separate-artifact.v1",
        artifactIds: ["serves-query-console-governed-contract.v1"],
      },
    ],
  });

  return contract;
}

function writesGovernedContract(contract, outputPath) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
}

export function projectsConsoleGovernedContract(options = {}) {
  try {
    const outputPath = path.resolve(options.outputPath ?? defaultOutputPath);
    const contract = buildsConsoleGovernedContract({
      workspaceRoot: options.workspaceRoot ?? consoleWorkspaceRoot,
      templateContractPath: options.templateContractPath ?? defaultTemplateContractPath,
      authorityPath: options.authorityPath ?? defaultAuthorityPath,
      authorityCompletePath: options.authorityCompletePath ?? defaultAuthorityCompletePath,
      bindingPath: options.bindingPath ?? defaultBindingPath,
      violationBindingsPath: options.violationBindingsPath ?? defaultViolationBindingsPath,
      strategyDocPath: options.strategyDocPath ?? defaultStrategyDocPath,
      outputPath,
    });
    writesGovernedContract(contract, outputPath);
    return {
      success: true,
      file: outputPath,
      artifactCount: contract.artifacts.length,
      contract,
      message: `Saved console governed contract to ${outputPath}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
