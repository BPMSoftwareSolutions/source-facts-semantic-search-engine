import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeSelectedSourceFactsScope } from '../analyze-selected-source-facts-scope.js';

const defaultEffectsIndex = 'C:/source/repos/bpm/intelligence/01-cognitive-governance/cognitive-codebase/runtime/node/dist/effects/index.js';
const effectsIndexPath = path.resolve(process.env.COGNITIVE_CODEBASE_EFFECTS_INDEX_PATH || defaultEffectsIndex);
const effectsRuntime = await import(pathToFileURL(effectsIndexPath).href);

if (!effectsRuntime.effectRegistry || typeof effectsRuntime.effectRegistry !== 'object') {
  throw new Error(`Cognitive codebase effect registry is unavailable: ${effectsIndexPath}`);
}

effectsRuntime.effectRegistry['source-facts-query'] = {
  analyze: analyzeSelectedSourceFactsScope,
};
