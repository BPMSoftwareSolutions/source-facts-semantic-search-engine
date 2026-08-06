import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const supportedExtensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']);

function sha256(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

function portable(value) {
  return String(value).replaceAll('\\', '/');
}

function isInside(root, candidate) {
  const normalizedRoot = path.resolve(String(root).replace(/^\\\\\?\\/, ''));
  const normalizedCandidate = path.resolve(String(candidate).replace(/^\\\\\?\\/, ''));
  return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`);
}

function positiveInteger(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function listsSupportedFiles(scopePath, scopeKind) {
  if (scopeKind === 'file') return [scopePath];
  const pending = [scopePath];
  const files = [];
  while (pending.length > 0) {
    const current = pending.pop();
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (!['.git', 'node_modules', 'dist', 'release'].includes(entry.name)) pending.push(absolute);
        continue;
      }
      if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
    }
  }
  return files.sort((left, right) => portable(left).localeCompare(portable(right)));
}

function runsSourceFacts(cliPath, workspaceRoot, workspaceId, outputPath, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [
      cliPath,
      'project',
      '--workspace', workspaceRoot,
      '--workspace-id', workspaceId,
      '--output', outputPath,
      '--pretty',
    ], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    const timer = setTimeout(() => child.kill(), timeoutMs);
    child.once('error', (error) => {
      clearTimeout(timer);
      resolve({ exitCode: null, stdout, stderr, error: error.message });
    });
    child.once('close', (code) => {
      clearTimeout(timer);
      resolve({ exitCode: code, stdout, stderr, error: null });
    });
  });
}

function mapsIndexPaths(index, stagedToRepositoryPath) {
  const mapPath = (value) => stagedToRepositoryPath.get(portable(value)) || portable(value);
  for (const file of index.files || []) file.relativePath = mapPath(file.relativePath);
  for (const symbol of index.symbols || []) symbol.modulePath = mapPath(symbol.modulePath);
  for (const reference of index.sourceReferences || []) reference.modulePath = mapPath(reference.modulePath);
  for (const mechanic of index.bodyMechanics || []) mechanic.modulePath = mapPath(mechanic.modulePath);
  for (const flow of index.dataflows || []) flow.modulePath = mapPath(flow.modulePath);
  return index;
}

function buildsExecutionMechanics(index, selectedFiles) {
  const references = new Map((index.sourceReferences || []).map((row) => [row.referenceId, row]));
  return selectedFiles.map((relativePath) => {
    const symbols = (index.symbols || []).filter((row) => row.modulePath === relativePath);
    const relationshipRows = (index.relationships || []).filter((row) => references.get(row.sourceReferenceId)?.modulePath === relativePath);
    const mechanics = (index.bodyMechanics || []).filter((row) => row.modulePath === relativePath);
    const dataflows = (index.dataflows || []).filter((row) => row.modulePath === relativePath);
    return {
      relativePath,
      symbols,
      relationships: relationshipRows.map((row) => ({ ...row, sourceReference: references.get(row.sourceReferenceId) || null })),
      mechanics,
      dataflows,
      summary: {
        declarations: symbols.length,
        relationships: relationshipRows.length,
        bodyMechanics: mechanics.length,
        dataflows: dataflows.length,
      },
    };
  });
}

function createsFinding(kind, severity, relativePath, evidence, statement, recommendation, inferenceStatus = 'mechanically-observed') {
  return {
    findingId: sha256(JSON.stringify({ kind, relativePath, evidence })).slice(0, 31),
    kind,
    severity,
    relativePath,
    inferenceStatus,
    statement,
    evidence,
    recommendation,
  };
}

function explainsTechnicalDebt(mechanics, coverage) {
  const findings = [];
  for (const file of mechanics) {
    if (file.summary.declarations >= 20) {
      findings.push(createsFinding('oversized-responsibility-surface', 'high', file.relativePath,
        { declarationCount: file.summary.declarations, symbolIds: file.symbols.map((row) => row.symbolId) },
        `The file declares ${file.summary.declarations} symbols, concentrating a broad responsibility surface.`,
        'Explore responsibility clusters and candidate semantic-body boundaries before transforming the file.'));
    }
    if (file.summary.relationships >= 50) {
      findings.push(createsFinding('high-execution-fan-out', 'high', file.relativePath,
        { relationshipCount: file.summary.relationships, relationshipIds: file.relationships.map((row) => row.relationshipId) },
        `The file contains ${file.summary.relationships} observed relationships, indicating dense execution coupling.`,
        'Group relationships by enclosing callable and inspect the highest-coupled execution paths.'));
    }
    const mutations = file.mechanics.filter((row) => row.mechanic === 'state-mutation');
    if (mutations.length > 0) {
      findings.push(createsFinding('state-mutation-surface', 'medium', file.relativePath,
        { occurrenceIds: mutations.map((row) => row.occurrenceId), sourceReferenceIds: mutations.map((row) => row.sourceReferenceId) },
        `The file contains ${mutations.length} observed state-mutation mechanics.`,
        'Inspect whether each mutation is declared by effect or authority contracts.', 'observed-mechanic-with-inferred-risk'));
    }
    const controls = file.mechanics.filter((row) => ['branch', 'fallback', 'throw', 'validation', 'exception-handling'].includes(row.mechanic));
    if (controls.length >= 15) {
      findings.push(createsFinding('control-flow-complexity', 'medium', file.relativePath,
        { occurrenceIds: controls.map((row) => row.occurrenceId), mechanicKinds: [...new Set(controls.map((row) => row.mechanic))] },
        `The file contains ${controls.length} observed branch, fallback, validation, or failure mechanics.`,
        'Trace these mechanics to scenarios and proof vectors before proposing decomposition.', 'observed-mechanic-with-inferred-risk'));
    }
  }
  if (Number(coverage?.unknownSyntaxRatio || 0) > 0.2) {
    findings.push(createsFinding('source-facts-coverage-gap', 'high', '<scope>',
      { unknownSyntaxRatio: coverage.unknownSyntaxRatio, unknownSyntax: coverage.unknownSyntax },
      'SourceFacts reported a material unknown-syntax ratio; analysis completeness is constrained.',
      'Treat unclassified mechanics as unresolved evidence before making transformation decisions.', 'analysis-coverage-risk'));
  }
  return findings.sort((left, right) => left.findingId.localeCompare(right.findingId));
}

function invalidScope(findings) {
  return { disposition: 'INVALID_SCOPE', findings, analyzed: false };
}

export async function analyzeSelectedSourceFactsScope(options = {}) {
    const startedAt = Date.now();
    const scopeKind = options.scopeKind;
    if (!['file', 'folder'].includes(scopeKind)) return invalidScope([{ field: 'scopeKind', code: 'FILE_OR_FOLDER_REQUIRED' }]);
    if (typeof options.scopePath !== 'string' || options.scopePath.trim() === '') return invalidScope([{ field: 'scopePath', code: 'REQUIRED' }]);
    const maxFiles = positiveInteger(options.maxFiles, scopeKind === 'file' ? 1 : 250);
    const maxBytes = positiveInteger(options.maxBytes, 5 * 1024 * 1024);
    if (maxFiles === null || maxBytes === null) return invalidScope([{ field: maxFiles === null ? 'maxFiles' : 'maxBytes', code: 'POSITIVE_INTEGER_REQUIRED' }]);

    let repositoryRoot;
    let selectedPath;
    const requestedRepositoryRoot = path.resolve(options.repositoryRoot || process.cwd());
    try {
      repositoryRoot = await realpath(requestedRepositoryRoot);
      selectedPath = await realpath(path.resolve(repositoryRoot, options.scopePath));
    } catch (error) {
      return invalidScope([{ field: 'scopePath', code: 'PATH_NOT_READABLE', detail: error.message }]);
    }
    if (!isInside(repositoryRoot, selectedPath)) return invalidScope([{ field: 'scopePath', code: 'OUTSIDE_REPOSITORY_ROOT' }]);
    const selectedStat = await lstat(selectedPath);
    if ((scopeKind === 'file' && !selectedStat.isFile()) || (scopeKind === 'folder' && !selectedStat.isDirectory())) {
      return invalidScope([{ field: 'scopeKind', code: 'PATH_KIND_MISMATCH' }]);
    }
    if (scopeKind === 'file' && !supportedExtensions.has(path.extname(selectedPath).toLowerCase())) {
      return invalidScope([{ field: 'scopePath', code: 'UNSUPPORTED_SOURCE_FILE' }]);
    }

    const cliCandidate = options.sourceFactsCliPath || process.env.SOURCE_FACTS_CLI_PATH;
    if (typeof cliCandidate !== 'string' || cliCandidate.trim() === '') {
      return { disposition: 'BLOCKED_RUNTIME', analyzed: false, findings: [{ field: 'sourceFactsCliPath', code: 'SOURCE_FACTS_RUNTIME_UNCONFIGURED' }] };
    }
    let cliPath;
    try {
      cliPath = await realpath(path.resolve(cliCandidate));
    } catch (error) {
      return { disposition: 'BLOCKED_RUNTIME', analyzed: false, findings: [{ field: 'sourceFactsCliPath', code: 'SOURCE_FACTS_RUNTIME_UNAVAILABLE', detail: error.message }] };
    }

    let candidates;
    try {
      candidates = await listsSupportedFiles(selectedPath, scopeKind);
    } catch (error) {
      return invalidScope([{ field: 'scopePath', code: 'SCOPE_ENUMERATION_FAILED', detail: error.message }]);
    }
    if (candidates.length === 0) {
      return {
        disposition: 'NO_SUPPORTED_SOURCE_FILES', analyzed: true, scope: { scopeKind, selectedPath: portable(path.relative(repositoryRoot, selectedPath)) },
        filesConsidered: 0, filesAnalyzed: 0, bytesAnalyzed: 0, truncated: false, executionMechanics: [], technicalDebtFindings: [],
      };
    }

    const selected = [];
    let selectedBytes = 0;
    for (const candidate of candidates) {
      const candidateStat = await lstat(candidate);
      if (selected.length >= maxFiles || selectedBytes + candidateStat.size > maxBytes) continue;
      selected.push({ absolutePath: candidate, size: candidateStat.size });
      selectedBytes += candidateStat.size;
    }
    if (selected.length === 0) {
      return invalidScope([{ field: 'maxBytes', code: 'LIMIT_EXCLUDES_ALL_SUPPORTED_FILES', observedSmallestFileBytes: Math.min(...await Promise.all(candidates.map(async (file) => (await lstat(file)).size))) }]);
    }

    const runId = String(options.runId || `source-facts-query-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '-');
    const evidenceRoot = options.evidenceRoot
      ? path.resolve(repositoryRoot, path.relative(requestedRepositoryRoot, path.resolve(options.evidenceRoot)))
      : path.join(repositoryRoot, 'evidence', 'runs', 'source-facts-query', runId);
    if (!isInside(repositoryRoot, evidenceRoot)) return invalidScope([{ field: 'evidenceRoot', code: 'OUTSIDE_REPOSITORY_ROOT' }]);
    await mkdir(evidenceRoot, { recursive: true });
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'source-facts-query-'));
    const stagedToRepositoryPath = new Map();
    try {
      for (const item of selected) {
        const repositoryRelative = portable(path.relative(repositoryRoot, item.absolutePath));
        const stagedRelative = scopeKind === 'file' ? path.basename(item.absolutePath) : portable(path.relative(selectedPath, item.absolutePath));
        const destination = path.join(temporaryRoot, ...stagedRelative.split('/'));
        await mkdir(path.dirname(destination), { recursive: true });
        await copyFile(item.absolutePath, destination);
        stagedToRepositoryPath.set(portable(stagedRelative), repositoryRelative);
      }
      const indexPath = path.join(evidenceRoot, 'source-fact-index.json');
      const execution = await runsSourceFacts(cliPath, temporaryRoot, runId, indexPath, positiveInteger(options.timeoutMs, 120000) || 120000);
      if (execution.exitCode !== 0) {
        const blocked = {
          disposition: 'BLOCKED_SOURCE_FACTS', analyzed: false, sourceFacts: { cliPath, exitCode: execution.exitCode, stdout: execution.stdout, stderr: execution.stderr, error: execution.error },
          findings: [{ field: 'sourceFacts', code: 'PROJECTION_FAILED' }],
        };
        await writeFile(path.join(evidenceRoot, 'analysis-packet.json'), `${JSON.stringify(blocked, null, 2)}\n`, 'utf8');
        return blocked;
      }
      const index = mapsIndexPaths(JSON.parse(await readFile(indexPath, 'utf8')), stagedToRepositoryPath);
      await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
      const selectedRelativePaths = selected.map((item) => portable(path.relative(repositoryRoot, item.absolutePath)));
      const executionMechanics = buildsExecutionMechanics(index, selectedRelativePaths);
      const technicalDebtFindings = explainsTechnicalDebt(executionMechanics, index.coverage);
      const result = {
        disposition: 'SOURCE_FACTS_ANALYSIS_COMPLETE',
        analyzed: true,
        runId,
        scope: { scopeKind, selectedPath: portable(path.relative(repositoryRoot, selectedPath)), repositoryRootId: path.basename(repositoryRoot) },
        filesConsidered: candidates.length,
        filesAnalyzed: selected.length,
        omittedFiles: candidates.length - selected.length,
        bytesAnalyzed: selectedBytes,
        supportedExtensions: [...supportedExtensions].sort(),
        truncated: selected.length < candidates.length,
        sourceFacts: { indexId: index.indexId, indexHash: sha256(JSON.stringify(index)), cliPath, engine: index.manifest?.engine, engineVersion: index.manifest?.engineVersion, indexPath },
        executionMechanics,
        technicalDebtFindings,
        limitations: scopeKind === 'file' ? ['Inbound relationships outside the staged file are not projected in this run.'] : [],
        elapsedMs: Date.now() - startedAt,
      };
      await writeFile(path.join(evidenceRoot, 'analysis-packet.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
      return result;
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
}
