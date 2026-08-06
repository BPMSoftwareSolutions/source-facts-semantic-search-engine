import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { analyzeSelectedSourceFactsScope } from '../src/analyze-selected-source-facts-scope.js';

const cliPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/cli.js');

test('analyzes bounded file and folder scope without mutating source', async () => {
  const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'source-facts-selected-scope-'));
  try {
    const sourceRoot = path.join(repositoryRoot, 'src');
    await mkdir(sourceRoot, { recursive: true });
    const firstPath = path.join(sourceRoot, 'first.ts');
    await writeFile(firstPath, 'export function first(value) { if (value) return String(value); throw new Error("missing"); }\n', 'utf8');
    await writeFile(path.join(sourceRoot, 'second.ts'), 'export const second = 2;\n', 'utf8');
    const before = createHash('sha256').update(await readFile(firstPath)).digest('hex');

    const file = await analyzeSelectedSourceFactsScope({ repositoryRoot, scopeKind: 'file', scopePath: 'src/first.ts', sourceFactsCliPath: cliPath, evidenceRoot: path.join(repositoryRoot, 'evidence/file') });
    assert.equal(file.disposition, 'SOURCE_FACTS_ANALYSIS_COMPLETE');
    assert.equal(file.filesAnalyzed, 1);
    assert.ok(file.executionMechanics[0].symbols.length > 0);

    const folder = await analyzeSelectedSourceFactsScope({ repositoryRoot, scopeKind: 'folder', scopePath: 'src', sourceFactsCliPath: cliPath, evidenceRoot: path.join(repositoryRoot, 'evidence/folder'), maxFiles: 10, maxBytes: 100000 });
    assert.equal(folder.disposition, 'SOURCE_FACTS_ANALYSIS_COMPLETE');
    assert.equal(folder.filesAnalyzed, 2);
    assert.equal(folder.truncated, false);
    assert.equal(createHash('sha256').update(await readFile(firstPath)).digest('hex'), before);
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});

test('fails closed for invalid scope and unavailable runtime', async () => {
  const repositoryRoot = await mkdtemp(path.join(os.tmpdir(), 'source-facts-selected-scope-invalid-'));
  try {
    const invalid = await analyzeSelectedSourceFactsScope({ repositoryRoot, scopeKind: 'file', scopePath: '../outside.ts', sourceFactsCliPath: cliPath });
    assert.equal(invalid.disposition, 'INVALID_SCOPE');
    const blocked = await analyzeSelectedSourceFactsScope({ repositoryRoot, scopeKind: 'folder', scopePath: '.', sourceFactsCliPath: '' });
    assert.equal(blocked.disposition, 'BLOCKED_RUNTIME');
  } finally {
    await rm(repositoryRoot, { recursive: true, force: true });
  }
});
