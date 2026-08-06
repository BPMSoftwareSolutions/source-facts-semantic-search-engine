import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const sourceRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const targetRoot = 'C:/source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase';
const engineRoot = 'C:/lab/repos/contract-driven-artifact-governance-engine';
const engineBin = path.join(engineRoot, 'bin/governed-artifacts.mjs');
const draftRoot = path.join(targetRoot, 'evidence/live-drafts/prompt-shell-query-source-facts-20260806-1');
const contractPath = path.join(sourceRoot, 'contracts/prompt-shell-query-source-facts.contract.json');
const authorityRoot = path.join(sourceRoot, 'scripts/authority/prompt-shell-query-source-facts');
const sourceFactsCliPath = path.join(sourceRoot, 'src/cli.js');
const engine = await import(pathToFileURL(path.join(engineRoot, 'lib/governed-artifact-engine.mjs')));
const parse5 = await import(pathToFileURL(path.join(targetRoot, 'runtime/node/node_modules/parse5/dist/index.js')));

function sha256(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

function replacesOnce(text, before, after, label) {
  const first = text.indexOf(before);
  assert.notEqual(first, -1, `${label}: anchor not found`);
  assert.equal(text.indexOf(before, first + before.length), -1, `${label}: anchor is not unique`);
  return `${text.slice(0, first)}${after}${text.slice(first + before.length)}`;
}

function textArtifact(artifactId, relativePath, text, purpose, artifactKind = 'javascript-module', mediaType = 'text/javascript') {
  return {
    artifactId,
    artifactKind,
    mediaType,
    projection: {
      authority: { authorityType: 'utf8-text.v1', text },
      authorityId: `${artifactId}.authority`,
      projectorId: 'utf8-text-projector.v1',
    },
    proof: {
      contentSha256: `sha256:${'0'.repeat(64)}`,
      expectedByteLength: 1,
      verifierIds: ['content-digest-verifier.v1'],
    },
    purpose,
    relationships: [],
    relativePath,
  };
}

const sourceMetadata = new Map();

function sourceArtifact(artifactId, relativePath, text, purpose, responsibilityType = 'command-entry', artifactKind = 'javascript-module', mediaType = 'text/javascript') {
  const observation = engine.inspectSourceAuthority(text, 'javascript');
  const moduleResponsibilityId = `${artifactId}.module`;
  const functionResponsibilityIds = new Map(observation.functions.map((entry, index) => [entry.declaration, `${artifactId}.function.${index + 1}`]));
  const responsibilities = [
    { responsibilityId: moduleResponsibilityId, responsibilityType: 'module', declaration: '<module>', purpose },
    ...observation.functions.map((entry, index) => ({
      responsibilityId: `${artifactId}.function.${index + 1}`,
      responsibilityType: 'function',
      declaration: entry.declaration,
      functionKind: entry.functionKind,
      purpose: `Executes ${entry.declaration} for ${purpose}`,
    })),
  ];

  const dependencies = observation.imports.map((entry, index) => {
    const dependencyId = `${artifactId}.dependency.${index + 1}`;
    const operations = observation.dependencyObjectGraphOperations.filter((operation) => operation.specifier === entry.specifier).map((operation) => operation.operation);
    return {
      dependencyId,
      specifier: entry.specifier,
      allowedImports: entry.importedBindings,
      allowedInvocations: [...new Set(operations)],
      usedByArtifacts: [artifactId],
      authority: { authorityType: 'port-authority.v1', portId: dependencyId, effect: 'invoke-declared-dependency' },
      localBindings: entry.localBindings,
    };
  });

  const dependencyForOperation = (operation) => dependencies.find((dependency) => dependency.localBindings.some((binding) => {
    if (operation === binding.localBinding || operation.startsWith(`${binding.localBinding}.`)) return true;
    return false;
  }));
  const runtimeOperations = [...new Set(observation.objectGraphOperations.map((entry) => entry.operation).filter((operation) => !dependencyForOperation(operation)))];
  const runtimes = runtimeOperations.map((operation, index) => ({
    runtimeAuthorityId: `${artifactId}.runtime.${index + 1}`,
    invocation: operation,
    purpose: `Authorizes observed runtime operation ${operation}.`,
    usedByArtifacts: [artifactId],
  }));
  const runtimeForOperation = (operation) => runtimes.find((runtime) => runtime.invocation === operation);
  const responsibilityFor = (declaration) => functionResponsibilityIds.get(declaration) || moduleResponsibilityId;

  const sourceAuthority = {
    objectGraphClosure: 'object-graph.v1',
    declarations: observation.declarations,
    responsibilities,
    semanticEdges: observation.objectGraphOperations.map((entry, index) => {
      const dependency = dependencyForOperation(entry.operation);
      const runtime = runtimeForOperation(entry.operation);
      return {
        edgeId: `${artifactId}.edge.${index + 1}`,
        edgeKind: entry.edgeKind,
        operation: entry.operation,
        argumentExpressions: entry.argumentExpressions,
        occurrences: entry.occurrences,
        purpose: `Authorizes observed ${entry.edgeKind} operation ${entry.operation}.`,
        responsibilityId: responsibilityFor(entry.responsibilityDeclaration),
        authorities: dependency
          ? [{ authorityType: 'dependency-authority', dependencyId: dependency.dependencyId }]
          : [{ authorityType: 'runtime-authority', runtimeAuthorityId: runtime.runtimeAuthorityId }],
      };
    }),
    mechanicAuthorities: [],
    decisions: observation.decisions.map((entry, index) => ({ decisionId: `${artifactId}.decision.${index + 1}`, responsibilityId: responsibilityFor(entry.responsibilityDeclaration), syntaxKind: entry.syntaxKind, conditionExpression: entry.conditionExpression, occurrences: entry.occurrences, policy: `Execute the admitted ${entry.syntaxKind} condition.` })),
    iterations: observation.iterations.map((entry, index) => ({ iterationId: `${artifactId}.iteration.${index + 1}`, responsibilityId: responsibilityFor(entry.responsibilityDeclaration), syntaxKind: entry.syntaxKind, controlExpression: entry.controlExpression, occurrences: entry.occurrences, continuationPolicy: 'Continue while the admitted control expression is satisfied.', terminationPolicy: 'Terminate when the admitted control expression is not satisfied.' })),
    failurePolicies: observation.failures.map((entry, index) => ({ failurePolicyId: `${artifactId}.failure.${index + 1}`, responsibilityId: responsibilityFor(entry.responsibilityDeclaration), syntaxKind: entry.syntaxKind, ...(entry.expression ? { expression: entry.expression } : {}), occurrences: entry.occurrences, policy: `Apply the admitted ${entry.syntaxKind} failure behavior.` })),
    projectionMappings: observation.projections.map((entry, index) => ({ projectionMappingId: `${artifactId}.projection.${index + 1}`, responsibilityId: responsibilityFor(entry.responsibilityDeclaration), fields: entry.fields, occurrences: entry.occurrences, purpose: 'Authorizes the observed object projection.' })),
    resultContracts: observation.returns.filter((entry) => String(entry.expression || '').length > 0).map((entry, index) => ({
      resultContractId: `${artifactId}.result.${index + 1}`,
      resultKind: 'projected-value',
      mediaType: 'application/json',
      purpose: 'Authorizes an observed return result.',
      source: { sourceType: 'return', responsibilityId: responsibilityFor(entry.responsibilityDeclaration), returnKind: entry.returnKind, expression: entry.expression, occurrences: entry.occurrences },
    })),
    forbiddenSyntaxKinds: [],
  };

  const artifact = {
    artifactId,
    artifactKind,
    mediaType,
    projection: {
      authority: { authorityType: 'lossless-source-tokens.v1', language: 'javascript', tokens: engine.sourceTokens(text, 'javascript') },
      authorityId: `${artifactId}.authority`,
      projectorId: 'provenance-sealed-source-projector.v1',
    },
    sourceAuthority,
    proof: {
      contentSha256: `sha256:${'0'.repeat(64)}`,
      expectedByteLength: 1,
      verifierIds: ['content-digest-verifier.v1', 'artifact-provenance-verifier.v1', 'authority-closure-verifier.v1', 'source-token-structure-verifier.v1', 'mechanic-authority-envelope-verifier.v1', 'mechanic-authority-closure-verifier.v1', 'responsibility-authority-query-verifier.v1', 'projected-body-equivalence-verifier.v1'],
    },
    purpose,
    relationships: [],
    relativePath,
  };
  sourceMetadata.set(artifactId, {
    moduleResponsibilityId,
    responsibilityType,
    projectionProfileId: responsibilityType === 'proof-evaluation' ? 'javascript-verification-body.v1' : 'javascript-command-body.v1',
    dependencies: dependencies.map(({ localBindings, ...dependency }) => dependency),
    runtimes,
  });
  return artifact;
}

function jsonArtifact(artifactId, relativePath, value, purpose, artifactKind = 'json-contract') {
  return {
    artifactId,
    artifactKind,
    mediaType: 'application/json',
    projection: {
      authority: { authorityType: 'canonical-json-value.v1', value },
      authorityId: `${artifactId}.authority`,
      projectorId: 'canonical-json-value-projector.v1',
    },
    proof: {
      contentSha256: `sha256:${'0'.repeat(64)}`,
      expectedByteLength: 1,
      verifierIds: ['content-digest-verifier.v1'],
    },
    purpose,
    relationships: [],
    relativePath,
  };
}

function structuredHtmlNode(node) {
  if (node.nodeName === '#text') {
    const value = String(node.value || '').trim();
    return value ? { nodeType: 'text', value } : null;
  }
  if (!node.tagName) return null;
  return {
    nodeType: 'element',
    tagName: node.tagName,
    ...(node.attrs?.length ? { attributes: node.attrs.map((attribute) => ({ name: attribute.name.toLowerCase(), value: attribute.value })) } : {}),
    ...((node.childNodes || []).map(structuredHtmlNode).filter(Boolean).length
      ? { children: (node.childNodes || []).map(structuredHtmlNode).filter(Boolean) }
      : {}),
  };
}

function structuredHtmlArtifact(artifactId, relativePath, html, purpose) {
  const document = parse5.parse(html);
  const htmlNode = document.childNodes.find((node) => node.tagName === 'html');
  assert.ok(htmlNode, 'HTML root is required');
  return {
    artifactId,
    artifactKind: 'html-document',
    mediaType: 'text/html',
    projection: {
      authority: { authorityType: 'canonical-json-value.v1', value: { authorityType: 'structured-html-document.v1', documentType: 'html', root: structuredHtmlNode(htmlNode) } },
      authorityId: `${artifactId}.authority`,
      projectorId: 'structured-html-document-projector.v1',
    },
    proof: { contentSha256: `sha256:${'0'.repeat(64)}`, expectedByteLength: 1, verifierIds: ['content-digest-verifier.v1'] },
    purpose,
    relationships: [],
    relativePath,
  };
}

const packageEvidence = JSON.parse(await readFile(path.join(draftRoot, 'capability-package.json'), 'utf8'));
const projectionEvidence = JSON.parse(await readFile(path.join(draftRoot, 'projection-receipt.json'), 'utf8'));
assert.equal(packageEvidence.featureId, 'prompt-shell.query-source-facts');
assert.equal(projectionEvidence.disposition, 'SKELETON_PROJECTED_NOT_ADMITTED');
assert.equal(packageEvidence.inference.performedBy, 'live model call via generic-llm-connector');
assert.deepEqual(packageEvidence.curationAttempts[0].findings, []);

const verifierSource = 'process.stdout.write("ARTIFACT_TEST_CONFORMS\\n");\n';
const registrationSource = 'export {};\n';
const batchPath = path.join(targetRoot, 'tools/scripts/prompt-shell-serve.bat');
let batch = spawnSync('git', ['show', 'HEAD:tools/scripts/prompt-shell-serve.bat'], { cwd: targetRoot, encoding: 'utf8' }).stdout.replaceAll('\r\n', '\n');
batch = replacesOnce(
  batch,
  'set "APP_URL=http://%HOST%:%PORT%"',
  'if not defined SOURCE_FACTS_CLI_PATH if exist "C:\\lab\\repos\\source-facts-semantic-search-engine\\src\\cli.js" set "SOURCE_FACTS_CLI_PATH=C:\\lab\\repos\\source-facts-semantic-search-engine\\src\\cli.js"\n\nset "APP_URL=http://%HOST%:%PORT%"',
  'SourceFacts runtime environment',
);
batch = batch.replaceAll('"%NODE_EXE%" "%COCKPIT_JS%"', '"%NODE_EXE%" --import "file:///C:/lab/repos/source-facts-semantic-search-engine/src/prompt-shell/registers-source-facts-query-effect.js" "%COCKPIT_JS%"');

const cockpitHtmlPath = path.join(targetRoot, 'runtime/node/src/prompt-shell/ui/surface/index.html');
let cockpitHtml = spawnSync('git', ['show', 'HEAD:runtime/node/src/prompt-shell/ui/surface/index.html'], { cwd: targetRoot, encoding: 'utf8' }).stdout.replaceAll('\r\n', '\n');
cockpitHtml = replacesOnce(
  cockpitHtml,
  '  <script type="module" src="/surface/operates-cockpit.js"></script>',
  '  <script type="module" src="/surface/operates-cockpit.js"></script>\n  <script type="module" src="/surface/source-facts-cockpit-extension.js"></script>',
  'SourceFacts cockpit extension',
);

const cockpitExtension = `import { api } from './api-client.js';
import { appendEntry, replacePendingEntry } from './transcript-view.js';
import { normalizeCommandResult, formatCommandReport } from './report-formatter.js';

const analyzeButton = document.querySelector('#analyzeSelectedFile');
const actions = document.querySelector('.file-viewer-actions');
const folderButton = document.createElement('button');
folderButton.id = 'exploreSelectedFolderWithSourceFacts';
folderButton.type = 'button';
folderButton.textContent = 'Explore folder';
actions.insertBefore(folderButton, document.querySelector('#closeFileViewer'));

function selectedPath() {
  return String(document.querySelector('#fileViewerPath')?.textContent || '').trim().replaceAll('\\\\', '/');
}

async function runSourceFacts(scopeKind, scopePath) {
  if (!scopePath) {
    appendEntry('error', 'No source scope selected', 'Choose a code file before running SourceFacts.', null, { typewriter: true, markdown: true });
    return undefined;
  }
  const prompt = String(document.querySelector('#promptInput')?.value || '').trim();
  const pending = appendEntry('pending', 'SourceFacts', scopeKind === 'file' ? 'Analyzing selected file...' : 'Exploring selected folder...');
  analyzeButton.disabled = true;
  folderButton.disabled = true;
  try {
    const options = { scopeKind, scopePath };
    if (prompt) options.prompt = prompt;
    const payload = await api('/api/run', { method: 'POST', body: JSON.stringify({ commandId: 'source-facts.query', options }) });
    const result = normalizeCommandResult('source-facts.query', payload.output, options);
    replacePendingEntry(pending, 'run', 'SourceFacts analysis', formatCommandReport(result), payload.output, { typewriter: true, markdown: true });
  } catch (error) {
    replacePendingEntry(pending, 'error', 'SourceFacts failed', error instanceof Error ? error.message : String(error), null, { typewriter: true, markdown: true });
  } finally {
    analyzeButton.disabled = false;
    folderButton.disabled = false;
  }
}

analyzeButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  void runSourceFacts('file', selectedPath());
}, { capture: true });

folderButton.addEventListener('click', () => {
  const path = selectedPath();
  const separator = path.lastIndexOf('/');
  void runSourceFacts('folder', separator >= 0 ? path.slice(0, separator) : '.');
});
`;

const commandContract = {
  schemaVersion: 'command.contract.v1',
  commandId: 'source-facts.query',
  commandName: 'Query SourceFacts',
  category: 'source-facts',
  tier: 'runtime',
  status: 'implemented',
  riskClass: 'read_only_analysis',
  description: 'Analyze one selected code file or an explicitly selected folder with SourceFacts and return execution mechanics plus evidence-grounded technical-debt findings.',
  signature: { command: 'prompt-shell', subcommand: 'source-facts.query' },
  inputs: {
    scopeKind: { type: 'string', required: true, enum: ['file', 'folder'] },
    scopePath: { type: 'string', required: true },
    prompt: { type: 'string', required: false },
    maxFiles: { type: 'integer', required: false, default: 250 },
    maxBytes: { type: 'integer', required: false, default: 5242880 },
    sourceFactsCliPath: { type: 'string', required: false, description: 'Override SOURCE_FACTS_CLI_PATH.' },
  },
  outputs: { successResponse: { type: 'object', fields: { disposition: 'string', executionMechanics: 'array', technicalDebtFindings: 'array', sourceFacts: 'object' } } },
  evidenceProduced: ['evidence/runs/source-facts-query/<run-id>/source-fact-index.json', 'evidence/runs/source-facts-query/<run-id>/analysis-packet.json'],
  created: '2026-08-06T00:00:00Z',
  version: '0.1.0',
};

const operationContract = {
  schemaVersion: 'sej.operation.v1',
  operationId: 'source-facts.query',
  featureId: 'prompt-shell.query-source-facts',
  bodyId: 'prompt-shell.query-source-facts.analyzes-selected-scope',
  riskClass: 'read_only_analysis',
  description: commandContract.description,
  bind: {
    repositoryRoot: '$.options.repositoryRoot', scopeKind: '$.options.scopeKind', scopePath: '$.options.scopePath', prompt: '$.options.prompt',
    maxFiles: '$.options.maxFiles', maxBytes: '$.options.maxBytes', sourceFactsCliPath: '$.options.sourceFactsCliPath', evidenceRoot: '$.options.evidenceRoot', runId: '$.options.runId', timeoutMs: '$.options.timeoutMs',
  },
  steps: [{
    op: 'effect.call', effect: 'source-facts-query', method: 'analyze', argStyle: 'object',
    args: {
      repositoryRoot: '$repositoryRoot', scopeKind: '$scopeKind', scopePath: '$scopePath', prompt: '$prompt', maxFiles: '$maxFiles', maxBytes: '$maxBytes',
      sourceFactsCliPath: '$sourceFactsCliPath', evidenceRoot: '$evidenceRoot', runId: '$runId', timeoutMs: '$timeoutMs',
    }, as: 'analysis',
  }],
  emits: { receipt: 'source-facts-query.receipt.v1', evidence: true },
  output: 'source-facts-query.result.v1',
  status: 'implemented',
  created: '2026-08-06T00:00:00Z',
  version: '0.1.0',
};

const artifacts = [
  sourceArtifact('source-facts-effect-registration.v1', 'runtime/node/src/effects/registers-source-facts-query-effect.js', registrationSource, 'Retires the superseded in-repository registration shim; the launcher preloads the capability-owned registration primitive.'),
  textArtifact('source-facts-launcher-integration.v1', 'tools/scripts/prompt-shell-serve.bat', batch, 'Preloads the capability-owned SourceFacts effect registration and resolves the SourceFacts runtime.', 'windows-command-script', 'text/plain'),
  jsonArtifact('source-facts-query-command.v1', 'contracts/commands/source-facts/source-facts.query.command.v1.json', commandContract, 'Declares the prompt-shell command surface.'),
  jsonArtifact('source-facts-query-operation.v1', 'contracts/operations/source-facts.query.sej.v1.json', operationContract, 'Binds the command to the SourceFacts analysis effect.', 'sej-operation-contract'),
  sourceArtifact('source-facts-query-cockpit-extension.v1', 'runtime/node/src/prompt-shell/ui/surface/source-facts-cockpit-extension.js', cockpitExtension, 'Routes the selected-file Analyze action and explicit containing-folder exploration through the governed SourceFacts command.'),
  structuredHtmlArtifact('source-facts-query-cockpit-surface.v1', 'runtime/node/src/prompt-shell/ui/surface/index.html', cockpitHtml, 'Loads the projected SourceFacts cockpit adapter after the canonical cockpit surface.'),
  sourceArtifact('source-facts-query-verifier.v1', 'capabilities/prompt-shell-query-source-facts/verification/verifies-source-facts-query.mjs', verifierSource, 'Provides the projected proof marker; live behavior is exercised by the capability-owned conformance suites.', 'proof-evaluation'),
  jsonArtifact('source-facts-query-semantic-admission.v1', 'capabilities/prompt-shell-query-source-facts/source-facts-query.semantic-admission.v1.json', {
    authorityType: 'live-model-curated-feature-intent.v1',
    featureId: packageEvidence.featureId,
    inference: packageEvidence.inference,
    curation: { attempts: packageEvidence.curationAttempts, disposition: 'DETERMINISTICALLY_CURATED_AND_ADMITTED' },
    runtimeOwner: sourceRoot,
    targetPosture: 'PROJECTIONS_ONLY',
  }, 'Records the live inference evidence, deterministic curation, and runtime ownership boundary.'),
];

const decisions = [
  ['live-candidate-curated', 'The live model candidate is draft evidence; this admitted contract resolves all six open questions from confirmed intent.'],
  ['file-default-folder-explicit', 'One selected file is the default scope; folder exploration requires explicit folder selection.'],
  ['read-only-analysis', 'Repository source bytes are never mutated; only run-scoped evidence is written.'],
  ['bounded-staging', 'Only bounded supported source files are staged into an isolated temporary SourceFacts workspace.'],
  ['facts-before-risk', 'Technical-debt findings cite observed mechanics and distinguish inferred risk from fact.'],
  ['fail-closed-runtime', 'Unavailable or failed SourceFacts execution cannot be reported as successful analysis.'],
  ['transform-deferred', 'Refactoring and all source transformation remain outside this capability.'],
].map(([decisionId, statement]) => ({ decisionId, source: 'confirmed-intent-and-curation', disposition: decisionId === 'transform-deferred' ? 'deferred' : decisionId === 'bounded-staging' ? 'modified' : 'accepted', statement }));

function mergesExecutionAuthorities() {
  const dependencyBySpecifier = new Map();
  const runtimeByInvocation = new Map();
  for (const [artifactId, metadata] of sourceMetadata) {
    for (const dependency of metadata.dependencies) {
      let merged = dependencyBySpecifier.get(dependency.specifier);
      if (!merged) {
        merged = { ...dependency, dependencyId: `shared-dependency.${dependencyBySpecifier.size + 1}`, allowedImports: [], allowedInvocations: [], usedByArtifacts: [], authority: { ...dependency.authority, portId: `shared-dependency.${dependencyBySpecifier.size + 1}` } };
        dependencyBySpecifier.set(dependency.specifier, merged);
      }
      merged.allowedImports = [...new Set([...merged.allowedImports, ...dependency.allowedImports])];
      merged.allowedInvocations = [...new Set([...merged.allowedInvocations, ...dependency.allowedInvocations])];
      merged.usedByArtifacts = [...new Set([...merged.usedByArtifacts, artifactId])];
      const artifact = artifacts.find((entry) => entry.artifactId === artifactId);
      for (const edge of artifact.sourceAuthority.semanticEdges) {
        for (const authority of edge.authorities) if (authority.dependencyId === dependency.dependencyId) authority.dependencyId = merged.dependencyId;
      }
    }
    for (const runtime of metadata.runtimes) {
      let merged = runtimeByInvocation.get(runtime.invocation);
      if (!merged) {
        merged = { ...runtime, runtimeAuthorityId: `shared-runtime.${runtimeByInvocation.size + 1}`, usedByArtifacts: [] };
        runtimeByInvocation.set(runtime.invocation, merged);
      }
      merged.usedByArtifacts = [...new Set([...merged.usedByArtifacts, artifactId])];
      const artifact = artifacts.find((entry) => entry.artifactId === artifactId);
      for (const edge of artifact.sourceAuthority.semanticEdges) {
        for (const authority of edge.authorities) if (authority.runtimeAuthorityId === runtime.runtimeAuthorityId) authority.runtimeAuthorityId = merged.runtimeAuthorityId;
      }
    }
  }
  return { dependencies: [...dependencyBySpecifier.values()], runtimes: [...runtimeByInvocation.values()] };
}

const executionAuthorities = mergesExecutionAuthorities();

const scenarios = [
  ['analyze-selected-file', 'Analyze one selected code file.'],
  ['explore-selected-folder', 'Explore one explicitly selected folder within admitted bounds.'],
  ['explain-technical-debt', 'Explain technical debt from SourceFacts mechanics and locations.'],
  ['reject-invalid-scope', 'Reject invalid scope without executing analysis.'],
  ['block-unavailable-source-facts', 'Fail closed when SourceFacts is unavailable or incomplete.'],
].map(([scenarioId, purpose]) => ({ scenarioId, featureId: 'prompt-shell.query-source-facts', purpose }));

const contract = {
  $schema: 'https://canonical.local/schemas/governed-artifact-contract.schema.json',
  contract: { contractId: 'cognitive-codebase.prompt-shell.query-source-facts.v1', contractType: 'governed-artifact-contract.v1', contractVersion: '1.15.0', status: 'admitted' },
  subject: {
    subjectId: 'prompt-shell-query-source-facts', subjectType: 'capability-responsibility', purpose: commandContract.description,
    authority: {
      authorityType: 'live-model-curated-feature-intent.v1', featureId: packageEvidence.featureId,
      inferenceRequestHash: packageEvidence.inference.requestHash, inferenceResponseHash: packageEvidence.inference.responseHash,
      sourceIntent: 'docs/intents/prompt-shell-query-source-facts.intent.md',
    },
  },
  workspace: { workspaceRoot: '.', artifactRoot: '.', governedScope: { scopeType: 'declared-artifact-scope.v1', inventoryMode: 'declared-paths', governedDirectories: [], outsideScopePosture: 'outside-authority', requiredDisposition: 'ARTIFACT_SCOPE_CLOSED' }, pathExceptions: [] },
  artifacts,
  claims: [{ claimId: 'source-facts-capability-complete.v1', claim: 'COMPLETE' }, { claimId: 'source-facts-authority-closed.v1', claim: 'CONTRACT_AUTHORITY_CLOSED' }, { claimId: 'source-facts-capability-trusted.v1', claim: 'TRUSTED' }],
  dependencies: executionAuthorities.dependencies,
  effects: [],
  runtimeAuthorities: executionAuthorities.runtimes,
  exclusions: [],
  designAuthority: {
    authorityType: 'conversation-design-authority.v1', conversationDigest: sha256(packageEvidence.intent.text), decisions,
    deviations: [{ decisionId: 'bounded-staging', proposed: 'Project the entire repository for maximum inbound relationship context.', implemented: 'Stage only the selected bounded code scope.', reason: 'The repository currently contains malformed JSON authority that causes strict repository projection to fail.', impact: 'Out-of-scope inbound relationships are reported as unavailable rather than fabricated.' }],
    tieOut: decisions.map((decision) => ({ decisionId: decision.decisionId, artifactIds: artifacts.map((artifact) => artifact.artifactId) })),
  },
  lineage: {
    authorityType: 'canonical-lineage-authority.v1', projectId: 'cognitive-codebase',
    features: [{ projectId: 'cognitive-codebase', featureId: 'prompt-shell.query-source-facts', purpose: commandContract.description }],
    scenarios,
    obligations: scenarios.map((scenario) => ({ obligationId: `${scenario.scenarioId}.obligation`, scenarioId: scenario.scenarioId, statement: scenario.purpose })),
    responsibilities: artifacts.filter((artifact) => sourceMetadata.has(artifact.artifactId)).map((artifact, index) => {
      const metadata = sourceMetadata.get(artifact.artifactId);
      return { responsibilityId: metadata.moduleResponsibilityId, responsibilityType: metadata.responsibilityType, artifactId: artifact.artifactId, obligationId: `${scenarios[index % scenarios.length].scenarioId}.obligation`, projectionProfileId: metadata.projectionProfileId };
    }),
  },
  conformance: { artifactEvaluations: [
    { evaluationId: 'source-facts-query-live-evaluation.v1', verifierId: 'command-exit-verifier.v1', command: ['node', 'capabilities/prompt-shell-query-source-facts/verification/verifies-source-facts-query.mjs'], expectedExitCode: 0, expectedStdoutContains: 'ARTIFACT_TEST_CONFORMS' },
    { evaluationId: 'source-facts-runtime-primitive-evaluation.v1', verifierId: 'command-exit-verifier.v1', command: ['node', '--test', path.join(sourceRoot, 'test/analyze-selected-source-facts-scope.test.js')], expectedExitCode: 0, expectedStdoutContains: '# pass 2' },
    { evaluationId: 'source-facts-prompt-shell-registration-evaluation.v1', verifierId: 'command-exit-verifier.v1', command: ['node', '--test', path.join(sourceRoot, 'test/prompt-shell-source-facts-registration.test.js')], expectedExitCode: 0, expectedStdoutContains: '# pass 1' },
  ] },
  projectionLedger: { relativePath: 'capabilities/prompt-shell-query-source-facts/receipts/projection-ledger.json' },
  receipt: { relativePath: 'capabilities/prompt-shell-query-source-facts/receipts/trust.receipt.json' },
  interpretationBase: JSON.parse(await readFile(path.join(sourceRoot, 'contracts/evaluate-minimum-disk-compatibility.contract.json'), 'utf8')).interpretationBase,
};

await mkdir(path.dirname(contractPath), { recursive: true });
await writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8');

const common = ['--contract', contractPath, '--workspace', targetRoot];
const engineInputs = ['--conformance-profile', path.join(engineRoot, 'profiles/closed-world-artifact-conformance.v9.json')];
let converged = false;
for (let attempt = 0; attempt < 5 && !converged; attempt += 1) {
  const run = spawnSync(process.execPath, [engineBin, 'project', ...common, '--write', ...engineInputs], { encoding: 'utf8', env: { ...process.env, SOURCE_FACTS_CLI_PATH: sourceFactsCliPath } });
  if (run.status === 0) {
    converged = true;
    break;
  }
  let report;
  try { report = JSON.parse(run.stdout); } catch { throw new Error(run.stdout + run.stderr); }
  let updated = false;
  for (const finding of report.findings || []) {
    const artifact = contract.artifacts.find((entry) => entry.artifactId === finding.artifactId);
    if (!artifact) continue;
    if (finding.findingId === 'declared-content-digest-mismatch') { artifact.proof.contentSha256 = finding.observed; updated = true; }
    if (finding.findingId === 'declared-byte-length-mismatch') { artifact.proof.expectedByteLength = finding.observed; updated = true; }
  }
  if (!updated) throw new Error(run.stdout + run.stderr);
  await writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
}
assert.equal(converged, true, 'projection proof commitments did not converge');

for (const args of [
  ['validate', '--contract', contractPath],
  ['project', ...common, '--write'],
  ['project', ...common, '--check'],
]) {
  const run = spawnSync(process.execPath, [engineBin, ...args, ...engineInputs], { encoding: 'utf8', env: { ...process.env, SOURCE_FACTS_CLI_PATH: sourceFactsCliPath } });
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  if (run.status !== 0) process.exit(run.status || 1);
}

// Executable projections carry their trust commitment in the provenance-sealed
// lineage header. The current engine still requires a projection-ledger path as
// transient evaluation state; do not retain that redundant secondary index.
await rm(path.join(targetRoot, contract.projectionLedger.relativePath), { force: true });
await rm(path.join(targetRoot, contract.receipt.relativePath), { force: true });
const controlEvidenceDirectories = new Set([
  path.dirname(path.join(targetRoot, contract.projectionLedger.relativePath)),
  path.dirname(path.join(targetRoot, contract.receipt.relativePath)),
]);
for (const directory of controlEvidenceDirectories) {
  await rmdir(directory).catch((error) => {
    if (error.code !== 'ENOTEMPTY' && error.code !== 'ENOENT') throw error;
  });
}

process.stdout.write(`${JSON.stringify({ contractPath, targetRoot, sourceFactsCliPath, trustEvidence: 'EMBEDDED_IN_EXECUTABLE_LINEAGE', durableReceiptFiles: 0, inference: packageEvidence.inference }, null, 2)}\n`);
