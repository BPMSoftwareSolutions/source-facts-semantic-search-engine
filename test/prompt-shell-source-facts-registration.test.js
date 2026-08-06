import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('registers the real SourceFacts analysis effect in the cognitive command runtime', async () => {
  const effectsIndexPath = path.resolve(process.env.COGNITIVE_CODEBASE_EFFECTS_INDEX_PATH || 'C:/source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/runtime/node/dist/effects/index.js');
  process.env.COGNITIVE_CODEBASE_EFFECTS_INDEX_PATH = effectsIndexPath;
  await import('../src/prompt-shell/registers-source-facts-query-effect.js');
  const effectsRuntime = await import(pathToFileURL(effectsIndexPath).href);
  const effect = effectsRuntime.effectRegistry['source-facts-query'];
  assert.equal(typeof effect?.analyze, 'function');
  const invalid = await effect.analyze({ repositoryRoot: process.cwd(), scopeKind: 'file', scopePath: '../outside.ts', sourceFactsCliPath: path.resolve('src/cli.js') });
  assert.equal(invalid.disposition, 'INVALID_SCOPE');
});
