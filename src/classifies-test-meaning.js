const proofTypes = Object.freeze([
  "SCENARIO_TEST",
  "RESPONSIBILITY_TEST",
  "INTEGRATION_TEST",
  "KERNEL_TEST",
  "ADAPTER_TEST",
  "PROJECTION_TEST",
  "EQUIVALENCE_TEST",
  "REGRESSION_EVIDENCE",
  "DUPLICATE_TEST",
  "POTENTIAL_CAPABILITY",
  "HISTORICAL_OR_INACTIVE",
  "NOISE_OR_UNRESOLVED",
]);

export const canonicalTestMeaningProofTypes = proofTypes;

export function classifiesTestMeaning({ testCase, invocations = [], assertions = [], fixtureUsages = [], mockUsages = [], candidates = [] } = {}) {
  if (!testCase) throw new Error("testCase is required.");
  const searchable = `${testCase.testFilePath} ${testCase.testName} ${testCase.suitePath.join(" ")} ${invocations.map((row) => `${row.invocationName} ${row.importedModulePath ?? ""}`).join(" ")}`.toLowerCase();
  const productionInvocations = invocations.filter((row) => row.importedModulePath?.startsWith("src/"));
  const scenarioIds = [...new Set(candidates.map((row) => row.scenarioId))];
  const evidence = [
    `assertions:${assertions.length}`,
    `fixtures:${fixtureUsages.length}`,
    `mocks:${mockUsages.length}`,
    `production-invocations:${productionInvocations.length}`,
    `candidate-scenarios:${scenarioIds.length}`,
  ];

  let recommendedProofType;
  let confidence;
  let recommendedOntologyLane = "CANDIDATE";
  if (testCase.executionStatus !== "ENABLED" || /\b(?:deprecated|obsolete|legacy-only|historical)\b/u.test(searchable)) {
    recommendedProofType = "HISTORICAL_OR_INACTIVE"; confidence = "HIGH"; recommendedOntologyLane = "INACTIVE";
    evidence.push(`execution-status:${testCase.executionStatus}`);
  } else if (/\b(?:equivalence|equivalent|parity|round[ -]?trip)\b/u.test(searchable)) {
    recommendedProofType = "EQUIVALENCE_TEST"; confidence = "HIGH"; evidence.push("vocabulary:equivalence");
  } else if (/\b(?:projection|projected|projects|reproject|extract|reconstruct|generate)\b/u.test(searchable)) {
    recommendedProofType = "PROJECTION_TEST"; confidence = productionInvocations.length > 0 ? "HIGH" : "MEDIUM"; evidence.push("vocabulary:projection");
  } else if (scenarioIds.length > 1 || /\b(?:integration|end[ -]?to[ -]?end|pipeline|workflow)\b/u.test(searchable)) {
    recommendedProofType = "INTEGRATION_TEST"; confidence = scenarioIds.length > 1 ? "HIGH" : "MEDIUM"; evidence.push("composition-evidence");
  } else if (scenarioIds.length === 1) {
    recommendedProofType = "SCENARIO_TEST"; confidence = "HIGH"; evidence.push(`candidate-scenario:${scenarioIds[0]}`);
  } else if (/\b(?:sqlserver|sql|filesystem|file-system|browser|parser|scanner|cli|adapter|http|playwright)\b/u.test(searchable)) {
    recommendedProofType = "ADAPTER_TEST"; confidence = "MEDIUM"; evidence.push("vocabulary:adapter-boundary");
  } else if (/\b(?:kernel|runtime|query-engine|schema|validator|ast|taxonomy)\b/u.test(searchable)) {
    recommendedProofType = "KERNEL_TEST"; confidence = "MEDIUM"; evidence.push("vocabulary:shared-kernel");
  } else if (productionInvocations.length > 0) {
    recommendedProofType = "POTENTIAL_CAPABILITY"; confidence = "MEDIUM"; evidence.push("production-behavior-without-canonical-scenario");
  } else if (assertions.length > 0) {
    recommendedProofType = "REGRESSION_EVIDENCE"; confidence = "LOW"; evidence.push("asserted-behavior-without-production-binding");
  } else {
    recommendedProofType = "NOISE_OR_UNRESOLVED"; confidence = "LOW"; recommendedOntologyLane = "UNRESOLVED"; evidence.push("no-assertion-or-production-binding");
  }

  return Object.freeze({
    testId: testCase.testId,
    recommendedProofType,
    recommendedOntologyLane,
    confidence,
    classificationDisposition: "DETERMINISTIC_RECOMMENDATION_NOT_ADMITTED",
    reviewDisposition: "REVIEW_REQUIRED",
    evidence: Object.freeze(evidence),
  });
}
