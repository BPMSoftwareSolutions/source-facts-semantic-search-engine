import { randomUUID } from "node:crypto";
import { invokesLiveModelInference } from "./invokes-live-model-inference.js";
import { createsProposalFeatureFingerprint, validatesFeatureCoverageProposal } from "./projects-feature-coverage.js";

const responseSchema = Object.freeze({
  type: "object",
  required: ["feature", "scenarios", "responsibilities", "obligations", "capabilityRelationDisposition", "capabilityRelations", "confidence", "rationale"],
  properties: {
    feature: {
      type: "object",
      required: ["candidateFeatureId", "title", "narrative"],
      properties: {
        candidateFeatureId: { type: "string" },
        title: { type: "string" },
        narrative: {
          type: "object",
          required: ["asA", "iNeed", "soThat"],
          properties: {
            asA: { type: "string" },
            iNeed: { type: "string" },
            soThat: { type: "string" },
          },
        },
      },
    },
    scenarios: {
      type: "array",
      items: {
        type: "object",
        required: ["candidateScenarioId", "title", "given", "when", "then", "primaryObligationId", "observableResult", "conformanceSignal"],
        properties: {
          candidateScenarioId: { type: "string" },
          title: { type: "string" },
          given: { type: "array", items: { type: "string" } },
          when: { type: "array", items: { type: "string" } },
          then: { type: "array", items: { type: "string" } },
          primaryObligationId: { type: "string" },
          observableResult: { type: "string" },
          conformanceSignal: { type: "string" },
        },
      },
    },
    responsibilities: {
      type: "array",
      items: {
        type: "object",
        required: ["candidateResponsibilityId", "scenarioId", "obligationId", "sourceFile", "symbol"],
        properties: {
          candidateResponsibilityId: { type: "string" },
          scenarioId: { type: "string" },
          obligationId: { type: "string" },
          sourceFile: { type: "string" },
          symbol: { type: "string" },
        },
      },
    },
    obligations: {
      type: "array",
      items: {
        type: "object",
        required: ["candidateObligationId", "scenarioId", "statement"],
        properties: {
          candidateObligationId: { type: "string" },
          scenarioId: { type: "string" },
          statement: { type: "string" },
        },
      },
    },
    capabilityRelationDisposition: {
      type: "string",
      enum: [
        "CAPABILITY_RELATION_PROPOSED",
        "CAPABILITY_RELATION_AMBIGUOUS",
        "FEATURE_SUPPORTS_MULTIPLE_CAPABILITIES",
        "NO_CAPABILITY_RELATION_DETECTED",
      ],
    },
    capabilityRelations: {
      type: "array",
      items: {
        type: "object",
        required: ["candidateCapabilityId", "name", "supportedByFeatures", "evidence"],
        properties: {
          candidateCapabilityId: { type: "string" },
          name: { type: "string" },
          supportedByFeatures: { type: "array", items: { type: "string" } },
          evidence: {
            type: "object",
            required: ["sharedSubject", "sharedOutcome", "sharedResponsibilities"],
            properties: {
              sharedSubject: { type: "string" },
              sharedOutcome: { type: "string" },
              sharedResponsibilities: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
    confidence: { type: "number" },
    rationale: { type: "string" },
  },
});

const systemPrompt = `You perform FEATURE COVERAGE INFERENCE, not governance admission.

Infer the smallest coherent human-facing feature/scenario package that explains the bounded source-fact query result and supplied semantic evidence.

Hard constraints:
- The source-fact query result defines the cluster. Do not expand its occurrence count or mechanics.
- Do not create one feature per syntax mechanic, object construction, or function. Mechanics are evidence subordinate to user-visible behavior.
- Use the exact feature ID supplied by the caller.
- Each scenario owns exactly one primary obligation. Each responsibility resolves to one supplied source file and one supplied symbol.
- Describe observable results and execution-proof signals, not static-presence checks.
- Do not claim this proposal is admitted authority or conformant.
- Do not invent source files or symbols outside the supplied grounding manifest.
- Feature is authored; capability is detected. A feature must stand alone. Return no capability relation unless the scenario, responsibility, obligation, and authority evidence supports it.
- A capability relation is FEATURE_CONTRIBUTES_TO_CAPABILITY, never ownership, and never participates in feature identity or scenario closure.
- Respond only with the declared JSON shape.`;

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))].sort();
}

function formatsEvidenceFiles(title, files) {
  if (files.length === 0) return `## ${title}\n(none supplied)`;
  return `## ${title}\n${files.map((file) => `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n")}`;
}

function buildsUserPrompt({
  clusterId,
  featureIdHint,
  mechanics,
  symbols,
  uncoveredOccurrences,
  queryEvidence,
  sourceEvidenceFiles,
  authorityEvidenceFiles,
  knowHowEvidenceFiles,
}) {
  const sourcePaths = sourceEvidenceFiles.map((file) => file.path);
  return `## Bounded source-fact cluster
Cluster: ${clusterId}
Required feature ID: ${featureIdHint}
Uncovered occurrences: ${uncoveredOccurrences}
Mechanics: ${mechanics.join(", ")}
Allowed source files: ${sourcePaths.join(", ")}
Allowed responsibility symbols: ${symbols.join(", ")}
Query input hash: ${queryEvidence.inputHash ?? "(unavailable)"}
Query result hash: ${queryEvidence.resultHash ?? "(unavailable)"}
Query: ${queryEvidence.commandText ?? "(unavailable)"}

${formatsEvidenceFiles("Executable source evidence", sourceEvidenceFiles)}

${formatsEvidenceFiles("Semantic authority evidence", authorityEvidenceFiles)}

${formatsEvidenceFiles("Reviewed know-how evidence", knowHowEvidenceFiles)}

## Task
Infer one coherent feature package for this entire cluster. Preserve the exact required feature ID. Produce one or more user-observable scenarios, with exactly one primary obligation per scenario and responsibilities grounded only in the allowed source files and symbols. Capability is optional derived classification: use NO_CAPABILITY_RELATION_DETECTED with an empty capabilityRelations array unless this evidence directly supports a contributes-to relationship.`;
}

function inferenceReceipt(response) {
  return Object.freeze({
    performedBy: "live model call via invokes-live-model-inference.js (generic-llm-connector)",
    providerAuthorityId: response.resolvedAuthority?.providerAuthorityId ?? null,
    providerKind: response.resolvedAuthority?.providerKind ?? null,
    resolvedModel: response.resolvedAuthority?.resolvedModel ?? null,
    requestId: response.requestId,
    invocationId: response.invocationId ?? null,
    requestHash: response.proof?.requestHash ?? null,
    responseHash: response.proof?.responseHash ?? null,
    usage: response.usage ?? null,
    startedAt: response.proof?.startedAt ?? null,
    completedAt: response.proof?.completedAt ?? null,
    durationMilliseconds: response.proof?.durationMilliseconds ?? null,
  });
}

function validatesGrounding(candidate, { featureIdHint, sourcePaths, symbols }) {
  const findings = [];
  if (candidate.feature?.candidateFeatureId !== featureIdHint) findings.push("FEATURE_ID_CHANGED_BY_MODEL");
  const allowedFiles = new Set(sourcePaths);
  const allowedSymbols = new Set(symbols);
  for (const responsibility of candidate.responsibilities ?? []) {
    if (!allowedFiles.has(responsibility.sourceFile)) findings.push(`RESPONSIBILITY_SOURCE_NOT_GROUNDED:${responsibility.sourceFile}`);
    if (!allowedSymbols.has(responsibility.symbol)) findings.push(`RESPONSIBILITY_SYMBOL_NOT_GROUNDED:${responsibility.symbol}`);
  }
  for (const relation of candidate.capabilityRelations ?? []) {
    const supportedBy = relation.supportedByFeatures ?? [];
    if (supportedBy.length === 0 || supportedBy.some((featureId) => featureId !== featureIdHint)) {
      findings.push(`CAPABILITY_RELATION_FEATURE_NOT_GROUNDED:${relation.candidateCapabilityId}`);
    }
  }
  return findings;
}

/**
 * Obtains a live, review-only feature proposal from the real inference target.
 * Query evidence and file/symbol grounding remain deterministic; only the
 * semantic feature package is model-authored. The caller stores the result as
 * a non-admissible evaluation artifact, never as canonical authority.
 */
export async function proposesFeatureCoverage({
  clusterId,
  featureIdHint,
  sourceEvidenceFiles,
  authorityEvidenceFiles = [],
  knowHowEvidenceFiles = [],
  mechanics,
  symbols,
  uncoveredOccurrences,
  queryEvidence,
  requestId = `feature-coverage-${randomUUID()}`,
  maximumOutputTokens = 16384,
  invoke = invokesLiveModelInference,
}) {
  if (!Array.isArray(sourceEvidenceFiles) || sourceEvidenceFiles.length === 0) throw new Error("At least one source evidence file is required.");
  if (!Array.isArray(mechanics) || mechanics.length === 0) throw new Error("At least one queried mechanic is required.");
  if (!Array.isArray(symbols) || symbols.length === 0) throw new Error("At least one grounded responsibility symbol is required.");
  if (!Number.isInteger(uncoveredOccurrences) || uncoveredOccurrences < 1) throw new Error("The source-fact query must return at least one uncovered occurrence.");

  const sourcePaths = uniqueSorted(sourceEvidenceFiles.map((file) => file.path));
  const groundedSymbols = uniqueSorted(symbols);
  const groundedMechanics = uniqueSorted(mechanics);
  const modelRequest = {
    "$schema": "../authority/model-request.schema.v1.json",
    requestId,
    providerAuthorityId: "primary-cognitive-provider",
    modelAlias: "instruction-capable-model",
    interaction: {
      mode: "structured-generation",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildsUserPrompt({
          clusterId,
          featureIdHint,
          mechanics: groundedMechanics,
          symbols: groundedSymbols,
          uncoveredOccurrences,
          queryEvidence,
          sourceEvidenceFiles,
          authorityEvidenceFiles,
          knowHowEvidenceFiles,
        }) },
      ],
    },
    responsePolicy: {
      format: "json",
      maximumOutputTokens,
      temperature: 0,
      schema: responseSchema,
    },
    executionPolicy: {
      timeoutMilliseconds: 60000,
      attemptAuthority: { maximumAuthorizedAttempts: 1 },
      providerSubstitution: { allowed: false },
    },
    evidencePolicy: {
      captureRequestHash: true,
      captureResponseHash: true,
      captureResolvedProvider: true,
      captureResolvedModel: true,
      captureTokenUsage: true,
      captureTiming: true,
    },
  };

  const response = await invoke(modelRequest);
  if (response.disposition !== "MODEL_RESPONSE_OBTAINED") {
    const detail = Array.isArray(response.findings) ? response.findings.map((finding) => finding.detail).filter(Boolean).join("; ") : "";
    throw new Error(`Model invocation did not succeed: disposition=${response.disposition}${detail ? ` (${detail})` : ""}`);
  }
  const inferred = response.result?.structuredValue;
  if (inferred === null || typeof inferred !== "object") throw new Error("Model response did not contain a structured feature package.");

  const candidate = {
    documentKind: "feature-coverage-proposal.v1",
    lifecycle: "INFERRED_NOT_ADMITTED",
    proposalId: `${featureIdHint}-${requestId}`,
    feature: inferred.feature,
    scenarios: inferred.scenarios,
    responsibilities: inferred.responsibilities,
    obligations: inferred.obligations,
    capabilityRelationDisposition: inferred.capabilityRelationDisposition,
    capabilityRelations: (inferred.capabilityRelations ?? []).map((relation) => Object.freeze({
      relationship: "FEATURE_CONTRIBUTES_TO_CAPABILITY",
      lifecycle: "INFERRED_NOT_ADMITTED",
      disposition: inferred.capabilityRelationDisposition,
      ...relation,
    })),
    evidence: {
      sourceFiles: sourcePaths,
      symbols: groundedSymbols,
      mechanics: groundedMechanics,
      authoritySubjects: uniqueSorted(authorityEvidenceFiles.map((file) => file.path)),
      knowHow: uniqueSorted(knowHowEvidenceFiles.map((file) => file.path)),
      inferenceBatches: [],
      healingDrafts: [],
    },
    coverageTarget: {
      currentlyUncoveredOccurrences: uncoveredOccurrences,
      responsibilitiesCovered: inferred.responsibilities?.length ?? 0,
    },
    queryEvidence: Object.freeze({ ...queryEvidence }),
    modelAssessment: Object.freeze({ confidence: inferred.confidence, rationale: inferred.rationale }),
    inference: inferenceReceipt(response),
  };
  candidate.featureFingerprint = createsProposalFeatureFingerprint(candidate);

  const findings = [
    ...validatesGrounding(candidate, { featureIdHint, sourcePaths, symbols: groundedSymbols }),
    ...validatesFeatureCoverageProposal(candidate),
  ];
  if (findings.length > 0) throw new Error(`Live feature proposal failed deterministic validation: ${findings.join(", ")}`);

  return Object.freeze(candidate);
}

export function wrapsFeatureCoverageInferenceEvaluation(candidate, {
  evaluationId = `feature-coverage-evaluation-${randomUUID()}`,
} = {}) {
  return Object.freeze({
    documentKind: "feature-coverage-inference-evaluation.v1",
    lifecycle: "OBSERVATIONAL_NOT_ADMISSIBLE",
    evaluationId,
    note: "This artifact proves a live inference call and preserves its candidate for comparison. It is never feature authority and never establishes coverage.",
    candidate,
  });
}
