/**
 * Test-to-Scenario Vocabulary Cross-Correlation Analysis
 *
 * Extracts domain vocabulary from tests, scenarios, and features,
 * then performs semantic cross-correlation to uncover directional
 * relationships based on shared vocabulary and domain concepts.
 */

import { createHash } from "node:crypto";

const stopwords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "by", "do", "for",
  "from", "had", "has", "have", "he", "her", "hers", "him", "his", "how",
  "if", "in", "into", "is", "it", "its", "may", "no", "not", "of", "on",
  "or", "our", "ours", "she", "so", "that", "the", "their", "theirs",
  "them", "then", "there", "these", "they", "this", "to", "too", "was",
  "we", "what", "which", "who", "whom", "why", "with", "you", "your"
]);

function rowId(queryId, identity) {
  const hash = createHash("sha256")
    .update(JSON.stringify(canonicalizes(identity)), "utf8")
    .digest("hex");
  return `${queryId}:sha256:${hash}`;
}

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalizes(value[key])])
    );
  }
  return value;
}

/**
 * Tokenize text into meaningful vocabulary terms.
 * Removes stopwords, normalizes case, handles camelCase/snake_case.
 */
function extractsVocabulary(text) {
  if (!text || typeof text !== "string") return [];

  // Split on whitespace and punctuation
  const tokens = text
    .toLowerCase()
    .split(/\s+|[_\-.,!?;:()[\]{}'""`]+/)
    .filter(Boolean);

  const vocabulary = new Set();

  for (const token of tokens) {
    // Skip very short tokens and stopwords
    if (token.length < 2 || stopwords.has(token)) continue;

    // Handle camelCase: "testUserLogin" -> "test", "user", "login"
    const camelCaseTerms = token
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .split(/\s+/)
      .filter(t => t.length >= 2 && !stopwords.has(t));

    for (const term of camelCaseTerms) {
      vocabulary.add(term);
    }
  }

  return [...vocabulary].sort();
}

/**
 * Compute Jaccard similarity between two vocabulary sets.
 * Returns value 0-1 where 1 is perfect match.
 */
function computeSimilarity(vocab1, vocab2) {
  if (vocab1.length === 0 && vocab2.length === 0) return 1.0;
  if (vocab1.length === 0 || vocab2.length === 0) return 0.0;

  const set1 = new Set(vocab1);
  const set2 = new Set(vocab2);
  const intersection = [...set1].filter(v => set2.has(v)).length;
  const union = new Set([...set1, ...set2]).size;

  return union === 0 ? 0 : intersection / union;
}

/**
 * Extract key terms (higher priority terms) from vocabulary.
 * Identifies domain concepts like "login", "user", "permission", etc.
 */
function extractsKeyTerms(vocabulary) {
  // Known domain concept patterns
  const domainPatterns = [
    /^(user|account|permission|role|auth|login|session|token)/,
    /^(create|read|update|delete|remove|add|fetch|get|set)/,
    /^(test|validate|verify|check|assert|expect)/,
    /^(error|exception|fail|invalid|unauthorized)/,
    /^(config|option|setting|parameter|argument)/,
    /^(database|store|cache|index|query)/,
  ];

  return vocabulary.filter(term =>
    domainPatterns.some(pattern => pattern.test(term))
  );
}

/**
 * Projects test vocabulary with extracted terms and relationships.
 */
function projectsTestVocabulary(context) {
  if (!context.testTraceability?.inventory) return [];

  return context.testTraceability.inventory.map(test => {
    const vocabulary = extractsVocabulary(
      [test.testName, ...test.suite].join(" ")
    );
    const keyTerms = extractsKeyTerms(vocabulary);

    return {
      resultRowId: rowId("test.vocabulary.v1", { testId: test.testId }),
      testId: test.testId,
      testFile: test.modulePath,
      testName: test.testName,
      testSuite: test.suite,
      vocabulary: vocabulary.map(term => ({
        term,
        isKeyTerm: keyTerms.includes(term),
      })),
      vocabularySize: vocabulary.length,
      keyTermCount: keyTerms.length,
      keyTerms,
    };
  });
}

/**
 * Projects scenario vocabulary with extracted terms.
 */
function projectsScenarioVocabulary(context) {
  const rows = [];

  if (!context.scenarioConformance?.features) return rows;

  for (const feature of context.scenarioConformance.features) {
    for (const scenario of feature.scenarios) {
      // Combine feature and scenario text for context
      const scenarioText = [
        feature.purpose,
        scenario.purpose,
        ...scenario.obligations.map(o => o.statement),
      ]
        .filter(Boolean)
        .join(" ");

      const vocabulary = extractsVocabulary(scenarioText);
      const keyTerms = extractsKeyTerms(vocabulary);

      rows.push({
        resultRowId: rowId("scenario.vocabulary.v1", {
          scenarioId: scenario.scenarioId
        }),
        featureId: feature.featureId,
        featurePurpose: feature.purpose ? String(feature.purpose).slice(0, 5000) : "",
        scenarioId: scenario.scenarioId,
        scenarioPurpose: scenario.purpose ? String(scenario.purpose).slice(0, 5000) : "",
        obligationCount: scenario.obligations.length,
        obligationStatements: (scenario.obligations || []).slice(0, 10).map(o =>
          String(o.statement || "").slice(0, 500)
        ),
        vocabulary: vocabulary.map(term => ({
          term,
          isKeyTerm: keyTerms.includes(term),
        })),
        vocabularySize: vocabulary.length,
        keyTermCount: keyTerms.length,
        keyTerms,
      });
    }
  }

  return rows;
}

/**
 * Cross-correlates tests with scenarios based on vocabulary overlap.
 * Shows which tests are semantically related to which scenarios.
 */
function correlatesTestsWithScenarios(testVocab, scenarioVocab) {
  const correlations = [];

  for (const test of testVocab) {
    for (const scenario of scenarioVocab) {
      // Compute different types of similarity
      const allVocabSimilarity = computeSimilarity(
        test.keyTerms,
        scenario.keyTerms
      );

      // Key term overlap (more meaningful)
      const keyTermOverlap = test.keyTerms.filter(term =>
        scenario.keyTerms.includes(term)
      );
      const keyTermSimilarity = keyTermOverlap.length > 0
        ? keyTermOverlap.length /
          (Math.max(test.keyTermCount, scenario.keyTermCount) || 1)
        : 0;

      // Only report correlations above threshold
      if (keyTermSimilarity >= 0.2 || allVocabSimilarity >= 0.3) {
        correlations.push({
          resultRowId: rowId("test.scenario.correlation.v1", {
            testId: test.testId,
            scenarioId: scenario.scenarioId,
          }),
          testId: test.testId,
          testName: test.testName,
          testFile: test.modulePath,
          scenarioId: scenario.scenarioId,
          scenarioPurpose: scenario.scenarioPurpose,
          featureId: scenario.featureId,
          featurePurpose: scenario.featurePurpose,
          sharedKeyTerms: keyTermOverlap.sort(),
          sharedKeyTermCount: keyTermOverlap.length,
          keyTermSimilarity: parseFloat(keyTermSimilarity.toFixed(3)),
          vocabularySimilarity: parseFloat(allVocabSimilarity.toFixed(3)),
          correlationStrength:
            keyTermSimilarity >= 0.5
              ? "STRONG_VOCABULARY_CORRELATION"
              : keyTermSimilarity >= 0.3
                ? "MODERATE_VOCABULARY_CORRELATION"
                : "WEAK_VOCABULARY_CORRELATION",
          directionality: "TEST_TO_SCENARIO",
        });
      }
    }
  }

  return correlations.sort(
    (a, b) =>
      b.keyTermSimilarity - a.keyTermSimilarity ||
      b.sharedKeyTermCount - a.sharedKeyTermCount
  );
}

/**
 * Analyzes test-scenario correlations discovered via test traceability.
 * Compares against vocabulary-based correlations to validate/extend.
 */
function correlatesViaTraceability(context, vocabularyCorrelations) {
  if (!context.testTraceability?.scenarioLineage) return [];

  const tracedCorrelations = new Map();
  const vocabCorrelationKeys = new Set(
    vocabularyCorrelations.map(c => `${c.testId}\0${c.scenarioId}`)
  );

  for (const lineage of context.testTraceability.scenarioLineage) {
    const key = `${lineage.testId}\0${lineage.scenarioId}`;
    if (!tracedCorrelations.has(key)) {
      tracedCorrelations.set(key, {
        testId: lineage.testId,
        scenarioId: lineage.scenarioId,
        byTraceability: [],
      });
    }
    tracedCorrelations
      .get(key)
      .byTraceability.push({
        obligationId: lineage.obligationId,
        responsibilityId: lineage.responsibilityId,
        lineageStatus: lineage.lineageStatus,
      });
  }

  const rows = [];
  for (const [key, data] of tracedCorrelations.entries()) {
    const isValidatedByVocab = vocabCorrelationKeys.has(key);
    rows.push({
      resultRowId: rowId("test.scenario.traceability.v1", {
        testId: data.testId,
        scenarioId: data.scenarioId,
      }),
      testId: data.testId,
      scenarioId: data.scenarioId,
      traceabilityBindings: data.byTraceability.length,
      isValidatedByVocabularyAnalysis: isValidatedByVocab,
      discoveryMethod: isValidatedByVocab
        ? "VOCABULARY_AND_TRACEABILITY"
        : "TRACEABILITY_ONLY",
    });
  }

  return rows;
}

/**
 * Projects summary statistics on vocabulary coverage.
 */
function summarizesVocabularyCoverage(testVocab, scenarioVocab, correlations) {
  const allTestTerms = new Set();
  const allScenarioTerms = new Set();
  const allTestKeyTerms = new Set();
  const allScenarioKeyTerms = new Set();

  for (const test of testVocab) {
    test.keyTerms.forEach(t => allTestKeyTerms.add(t));
    test.vocabulary.forEach(v => allTestTerms.add(v.term));
  }

  for (const scenario of scenarioVocab) {
    scenario.keyTerms.forEach(t => allScenarioKeyTerms.add(t));
    scenario.vocabulary.forEach(v => allScenarioTerms.add(v.term));
  }

  const sharedKeyTerms = [...allTestKeyTerms].filter(t =>
    allScenarioKeyTerms.has(t)
  );
  const uniqueTestKeyTerms = [...allTestKeyTerms].filter(
    t => !allScenarioKeyTerms.has(t)
  );
  const uniqueScenarioKeyTerms = [...allScenarioKeyTerms].filter(
    t => !allTestKeyTerms.has(t)
  );

  return {
    resultRowId: rowId("vocabulary.coverage.summary.v1", {}),
    testsAnalyzed: testVocab.length,
    scenariosAnalyzed: scenarioVocab.length,
    correlationsDiscovered: correlations.length,
    sharedKeyTermCount: sharedKeyTerms.length,
    sharedKeyTerms,
    uniqueTestKeyTermCount: uniqueTestKeyTerms.length,
    uniqueScenarioKeyTermCount: uniqueScenarioKeyTerms.length,
    averageTestVocabularySize:
      testVocab.length > 0
        ? Math.round(
            testVocab.reduce((sum, t) => sum + t.vocabularySize, 0) /
              testVocab.length
          )
        : 0,
    averageScenarioVocabularySize:
      scenarioVocab.length > 0
        ? Math.round(
            scenarioVocab.reduce((sum, s) => sum + s.vocabularySize, 0) /
              scenarioVocab.length
          )
        : 0,
    correlationCoverage:
      testVocab.length > 0
        ? parseFloat(
            ((correlations.length / (testVocab.length * scenarioVocab.length)) *
              100)
              .toFixed(1)
          )
        : 0,
  };
}

/**
 * Main entry point: Orchestrates vocabulary extraction and correlation.
 */
export function projectsTestVocabularyCrossCorrelation(context) {
  // Extract vocabulary from tests
  const testVocabulary = projectsTestVocabulary(context);

  // Extract vocabulary from scenarios
  const scenarioVocabulary = projectsScenarioVocabulary(context);

  // Correlate based on shared vocabulary
  const vocabularyCorrelations = correlatesTestsWithScenarios(
    testVocabulary,
    scenarioVocabulary
  );

  // Compare with traceability findings
  const traceabilityCorrelations = correlatesViaTraceability(
    context,
    vocabularyCorrelations
  );

  // Generate summary
  const summary = summarizesVocabularyCoverage(
    testVocabulary,
    scenarioVocabulary,
    vocabularyCorrelations
  );

  return {
    summary: [summary],
    testVocabulary,
    scenarioVocabulary,
    vocabularyCorrelations,
    traceabilityCorrelations,
  };
}
