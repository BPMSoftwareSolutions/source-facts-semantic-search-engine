import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { effectRegistry } from './index.js';

const blockedUnconfigured = Object.freeze({ disposition: 'BLOCKED_RUNTIME', analyzed: false, findings: Object.freeze([{ field: 'sourceFactsCliPath', code: 'SOURCE_FACTS_RUNTIME_UNCONFIGURED' }]) });
const blockedExport = Object.freeze({ disposition: 'BLOCKED_RUNTIME', analyzed: false, findings: Object.freeze([{ field: 'sourceFactsRuntime', code: 'ANALYSIS_EXPORT_UNAVAILABLE' }]) });

async function analyzesSourceFactsQuery(options = {}) {
  const cliPath = options.sourceFactsCliPath || process.env.SOURCE_FACTS_CLI_PATH || 'C:/lab/repos/source-facts-semantic-search-engine/src/cli.js';
  if (typeof cliPath !== 'string' || cliPath.trim() === '') return blockedUnconfigured;
  const modulePath = path.join(path.dirname(path.resolve(cliPath)), 'analyze-selected-source-facts-scope.js');
  const runtime = await import(pathToFileURL(modulePath).href);
  if (typeof runtime.analyzeSelectedSourceFactsScope !== 'function') return blockedExport;
  return runtime.analyzeSelectedSourceFactsScope(Object.assign({}, options, { sourceFactsCliPath: cliPath }));
}

export const sourceFactsQueryEffect = Object.freeze({ analyze: analyzesSourceFactsQuery });

export function registersSourceFactsQueryEffect() {
  effectRegistry['source-facts-query'] = sourceFactsQueryEffect;
}
