import { randomUUID } from "node:crypto";
import { invokesLiveModelInference } from "./invokes-live-model-inference.js";

const knownHealingDispositions = Object.freeze([
  "HEALING_DRAFT_GENERATED",
  "HEALING_DRAFT_PARTIAL",
  "HUMAN_DECISION_REQUIRED",
  "INSUFFICIENT_EVIDENCE",
  "CONFLICTING_AUTHORITY",
  "NO_SUPPORTED_PROJECTOR",
]);

const draftSectionSchema = Object.freeze({
  type: "object",
  required: ["applicable", "rationale"],
  properties: {
    applicable: { type: "boolean", description: "false if this draft type does not apply to this subject -- leave the rest of the fields empty in that case" },
    rationale: { type: "string" },
  },
});

const responseSchema = Object.freeze({
  type: "object",
  required: ["healingDisposition", "missingTissue", "confidence", "evidenceReferences", "authorityCompletionDraft", "bindingDraft", "runtimeWiringDraft", "collapsedBodyDraft", "equivalenceVectorDraft"],
  properties: {
    healingDisposition: { type: "string", enum: [...knownHealingDispositions] },
    missingTissue: { type: "array", items: { type: "string" } },
    confidence: { type: "number", description: "0.0 to 1.0" },
    evidenceReferences: { type: "array", items: { type: "string" } },
    authorityCompletionDraft: {
      type: "object",
      required: ["applicable", "rationale", "candidateAuthorityId", "family", "mechanics"],
      properties: {
        applicable: draftSectionSchema.properties.applicable,
        rationale: draftSectionSchema.properties.rationale,
        candidateAuthorityId: { type: "string" },
        family: { type: "string" },
        mechanics: {
          type: "array",
          items: {
            type: "object",
            required: ["mechanicId", "mechanic", "responsibility", "semanticSummary", "requiredHumanResolution"],
            properties: {
              mechanicId: { type: "string" },
              mechanic: { type: "string" },
              responsibility: { type: "string" },
              semanticSummary: { type: "string" },
              requiredHumanResolution: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
    bindingDraft: {
      type: "object",
      required: ["applicable", "rationale", "bindingId", "authorityRef", "bodyRef", "runtimePort", "resultContractId"],
      properties: {
        applicable: draftSectionSchema.properties.applicable,
        rationale: draftSectionSchema.properties.rationale,
        bindingId: { type: "string" },
        authorityRef: { type: "string" },
        bodyRef: { type: "string" },
        runtimePort: { type: "string" },
        resultContractId: { type: "string" },
      },
    },
    runtimeWiringDraft: {
      type: "object",
      required: ["applicable", "rationale", "targetFile", "importSpecifier", "invocationSite"],
      properties: {
        applicable: draftSectionSchema.properties.applicable,
        rationale: draftSectionSchema.properties.rationale,
        targetFile: { type: "string" },
        importSpecifier: { type: "string" },
        invocationSite: { type: "string" },
      },
    },
    collapsedBodyDraft: {
      type: "object",
      required: ["applicable", "rationale", "targetFile", "targetResponsibility", "proposedSource", "risks"],
      properties: {
        applicable: draftSectionSchema.properties.applicable,
        rationale: draftSectionSchema.properties.rationale,
        targetFile: { type: "string" },
        targetResponsibility: { type: "string" },
        proposedSource: { type: "string", description: "A draft source excerpt only. Never a claim that this has been applied anywhere." },
        risks: { type: "array", items: { type: "string" } },
      },
    },
    equivalenceVectorDraft: {
      type: "object",
      required: ["applicable", "rationale", "fixtureDescription", "comparisonPoints"],
      properties: {
        applicable: draftSectionSchema.properties.applicable,
        rationale: draftSectionSchema.properties.rationale,
        fixtureDescription: { type: "string" },
        comparisonPoints: { type: "array", items: { type: "string" } },
      },
    },
  },
});

const systemPrompt = `You are drafting SEMANTIC CONNECTIVE TISSUE, not applying it. Given a subject that already has known authority evidence, executable evidence, existing wiring, and known gaps, propose the specific missing pieces (authority completion, binding, runtime wiring, collapsed-body replacement, equivalence vector) needed to connect an executable body to its declared or missing authority meaning.

Hard constraints:
- You are drafting candidates for human review, not making changes. Nothing you produce is applied anywhere.
- Mark a draft section "applicable": false if it does not apply to this subject -- do not force content into every section.
- collapsedBodyDraft.proposedSource is a draft excerpt only, grounded in the actual current code style and imports given to you. Never invent functions, files, or imports that are not present in the evidence.
- Cite concrete evidence (function names, current file paths, existing delegation patterns already visible in the evidence) for every draft you produce.
- Use INSUFFICIENT_EVIDENCE as the healingDisposition, with all draft sections applicable:false, if the evidence does not support a confident draft.
- Respond only with the declared JSON shape.`;

function buildsUserPrompt({ subjectId, authorityEvidence, executableEvidence, existingWiring, knownGaps, requiredOutputs }) {
  return `## Subject
${subjectId}

## Authority evidence (what meaning already exists or is proposed)
${authorityEvidence}

## Executable evidence (current code)
${executableEvidence}

## Existing wiring (what is already connected)
${existingWiring}

## Known gaps (already established by deterministic analysis and/or prior review -- do not re-derive these, use them as ground truth)
${knownGaps.map((gap) => `- ${gap}`).join("\n")}

## Requested outputs
${requiredOutputs.join(", ")}

## Your task
Produce exactly one structured response covering every draft section. Mark inapplicable sections applicable:false. For collapsedBodyDraft, ground proposedSource in the actual import and delegation style already visible in the executable evidence above -- do not invent a different pattern.`;
}

/**
 * Stage 1+2 of the self-healing ladder (Infer, Draft) -- never Stage 3+
 * (Review/Admit/Project/Prove/Auto-heal). This function only ever produces a
 * JSON document under healing/, never writes to contracts/ or src/. There is
 * intentionally no "applies this draft" function anywhere in this codebase:
 * collapsedBodyDraft.proposedSource is a string field in a review artifact,
 * not a file write, and that boundary is not something a future change
 * should casually cross without a dedicated review/admission/projection
 * design of its own (see the report's Generated Healing Candidates section
 * for how far this stops short of application).
 */
export async function generatesConnectiveTissue({
  subjectId,
  authorityEvidence,
  executableEvidence,
  existingWiring,
  knownGaps = [],
  requiredOutputs = ["authority-draft", "binding-draft", "runtime-wiring-draft", "body-projection-draft", "equivalence-vector-draft"],
  requestId = `connective-tissue-${randomUUID()}`,
  maximumOutputTokens = 32768,
  invoke = invokesLiveModelInference,
}) {
  if (typeof subjectId !== "string" || subjectId.length === 0) {
    throw new Error("subjectId is required.");
  }
  if (typeof executableEvidence !== "string" || executableEvidence.length === 0) {
    throw new Error("executableEvidence is required -- connective tissue cannot be drafted without current code to ground it.");
  }

  const userPrompt = buildsUserPrompt({ subjectId, authorityEvidence: authorityEvidence ?? "(none known)", executableEvidence, existingWiring: existingWiring ?? "(none known)", knownGaps, requiredOutputs });

  const modelRequest = {
    "$schema": "../authority/model-request.schema.v1.json",
    requestId,
    providerAuthorityId: "primary-cognitive-provider",
    modelAlias: "instruction-capable-model",
    interaction: {
      mode: "structured-generation",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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
    const detail = Array.isArray(response.findings) ? response.findings.map((finding) => finding.detail).join("; ") : "";
    throw new Error(`Model invocation did not succeed: disposition=${response.disposition}${detail ? ` (${detail})` : ""}`);
  }
  const draft = response.result?.structuredValue;
  if (draft === undefined || draft === null || typeof draft !== "object") {
    throw new Error("Model response did not contain a structured draft.");
  }

  return Object.freeze({
    documentKind: "connective-tissue-draft-batch.v1",
    lifecycle: "DRAFT_NOT_ADMITTED",
    note: "Draft connective tissue only. Nothing here has been applied, admitted as authority, or written to any source file. healing/ is never scanned by discoversAuthorityDocuments and no code in this repository writes collapsedBodyDraft.proposedSource anywhere.",
    subject: Object.freeze({ subjectId, knownGaps: Object.freeze([...knownGaps]) }),
    inference: Object.freeze({
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
    }),
    reviewFindings: Object.freeze([]),
    draft: Object.freeze(draft),
  });
}

export { knownHealingDispositions };
