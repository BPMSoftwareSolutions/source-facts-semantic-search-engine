import assert from 'node:assert/strict';
import { sourceFactsQueryEffect } from '../../../runtime/node/src/effects/registers-source-facts-query-effect.js';

const fileResult = await sourceFactsQueryEffect.analyze({
  repositoryRoot: process.cwd(),
  scopeKind: 'file',
  scopePath: 'runtime/node/src/effects/registers-source-facts-query-effect.js',
  evidenceRoot: 'evidence/runs/source-facts-query/projected-verifier',
  runId: 'projected-verifier',
});
assert.equal(fileResult.disposition, 'SOURCE_FACTS_ANALYSIS_COMPLETE');
assert.equal(fileResult.filesAnalyzed, 1);
assert.ok(fileResult.executionMechanics[0].symbols.length > 0);

const invalidResult = await sourceFactsQueryEffect.analyze({
  repositoryRoot: process.cwd(),
  scopeKind: 'file',
  scopePath: '../outside.ts',
});
assert.equal(invalidResult.disposition, 'INVALID_SCOPE');
assert.equal(invalidResult.analyzed, false);
process.stdout.write('ARTIFACT_TEST_CONFORMS\n');
