import { randomUUID } from "node:crypto";
import { invokesLiveModelInference } from "./invokes-live-model-inference.js";

const responseSchema = Object.freeze({
  type: "object",
  required: ["proposals"],
  properties: {
    proposals: {
      type: "array",
      items: {
        type: "object",
        required: [
          "authorityMechanicId",
          "overlapDisposition",
          "confidence",
          "currentEvidenceLocation",
          "authorityOnlyMeaning",
          "bodyOnlyMeaning",
          "conflicts",
          "recommendedAction",
          "rationale",
        ],
        properties: {
          authorityMechanicId: { type: "string", description: "Must exactly match one of the given historical mechanicId values." },
          overlapDisposition: {
            type: "string",
            enum: ["PROPOSED_EXACT_OVERLAP", "PROPOSED_PARTIAL_OVERLAP", "PROPOSED_CONFLICT", "PROPOSED_NO_MATCH", "INSUFFICIENT_EVIDENCE"],
          },
          confidence: { type: "number", description: "0.0 to 1.0" },
          currentEvidenceLocation: { type: "string", description: "e.g. 'someFunction(), lines 38-44', or empty string if none found" },
          authorityOnlyMeaning: { type: "array", items: { type: "string" }, description: "Meaning the historical authority declares that current code does not appear to carry" },
          bodyOnlyMeaning: { type: "array", items: { type: "string" }, description: "Behavior current code has that the historical authority did not declare" },
          conflicts: { type: "array", items: { type: "string" } },
          recommendedAction: {
            type: "string",
            enum: ["REBASE_AND_BIND", "EXTEND_THEN_BIND", "SPLIT_AUTHORITY", "SUPERSEDE_CONFLICTING_AUTHORITY", "RETIRE_NO_MATCH_AUTHORITY", "AUTHOR_MISSING_BODY_MEANING", "REQUEST_MORE_EVIDENCE"],
          },
          rationale: { type: "string" },
        },
      },
    },
  },
});

function buildsMechanicsBlock(mechanics) {
  return mechanics.map((mechanic, index) => `
### Historical mechanic ${index + 1}: ${mechanic.mechanicId}
- mechanic type: ${mechanic.mechanic}
- declared (possibly stale) location: ${mechanic.sourceLocation}
- responsibility: ${mechanic.responsibility ?? "(unspecified)"}
- declared semantic content: ${JSON.stringify(mechanic.semantic ?? mechanic.decisions ?? {}, null, 2)}
`).join("\n");
}

const systemPrompt = `You are performing SEMANTIC OVERLAP PROPOSAL, not admission. You compare rich, hand-authored historical authority meaning against current executable source code and PROPOSE whether the current code still embodies the historical meaning.

Hard constraints:
- You are proposing, not deciding. Never claim certainty you cannot support from the given evidence.
- Cite concrete evidence (function names, variable names, literal values, control-flow shape) for every claim.
- If the current code only partially covers a historical mechanic's meaning, say exactly what's missing.
- If you cannot find clear current evidence either way, use disposition INSUFFICIENT_EVIDENCE rather than guessing.
- Do not invent function names, files, or behavior that is not present in the evidence given to you.
- Respond only with the declared JSON shape.`;

function buildsUserPrompt({ historicalAuthorityFile, declaredSourceFile, resolvedSuccessorFile, successionEvidence, mechanicsBlock, evidenceFiles }) {
  const evidenceBlock = evidenceFiles.map((file) => `## ${file.path}\n\`\`\`\n${file.content}\n\`\`\``).join("\n\n");
  return `## Historical authority document
File: ${historicalAuthorityFile}
${declaredSourceFile ? `Declared sourceFile: ${declaredSourceFile}\n` : ""}${successionEvidence ? `Succession evidence: ${successionEvidence}\n` : ""}Current resolved successor: ${resolvedSuccessorFile}

## The historical mechanics to evaluate
${mechanicsBlock}

## Current evidence
${evidenceBlock}

## Your task
For EACH historical mechanic listed above, produce one proposal: does the current evidence still embody that mechanic's declared meaning? Cite the specific current function/lines that support your proposal, or state plainly that you found none.`;
}

/**
 * The live half of the loop that discovers-semantic-overlap-proposals.js and
 * admits-know-how.js only ever consumed from disk. This is the part that was
 * missing from the pipeline: everything downstream of a reviews/*.json batch
 * was a real, tested, re-runnable capability, but the batch itself could
 * previously only be produced by hand. This function is that missing first
 * step, callable the same way (and tested the same way, via an injectable
 * `invoke`) as everything else in this module family.
 *
 * Output lifecycle is always INFERRED_NOT_ADMITTED with empty
 * reviewFindings/reviewOutcomes/knowHowExtracted/candidateAuthorities --
 * this function performs inference, never review. A human (or a future
 * reviewing capability) edits the written file to add those before
 * admits-know-how.js can act on it.
 */
export async function proposesSemanticOverlap({
  historicalAuthorityFile,
  historicalAuthorityDocument,
  resolvedSuccessorFile,
  successionEvidence = null,
  evidenceFiles,
  requestId = `semantic-overlap-${randomUUID()}`,
  maximumOutputTokens = 32768,
  invoke = invokesLiveModelInference,
}) {
  const mechanics = historicalAuthorityDocument.authority?.mechanics ?? historicalAuthorityDocument.mechanics ?? [];
  if (!Array.isArray(mechanics) || mechanics.length === 0) {
    throw new Error(`${historicalAuthorityFile} declares no mechanics array to propose overlap for.`);
  }
  if (!Array.isArray(evidenceFiles) || evidenceFiles.length === 0) {
    throw new Error("At least one evidence file (the resolved successor's source) is required.");
  }

  const declaredSourceFile = typeof historicalAuthorityDocument.sourceFile === "string" ? historicalAuthorityDocument.sourceFile : null;
  const mechanicsBlock = buildsMechanicsBlock(mechanics);
  const userPrompt = buildsUserPrompt({ historicalAuthorityFile, declaredSourceFile, resolvedSuccessorFile, successionEvidence, mechanicsBlock, evidenceFiles });

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
  const proposals = response.result?.structuredValue?.proposals;
  if (!Array.isArray(proposals)) {
    throw new Error("Model response did not contain a proposals array.");
  }

  return Object.freeze({
    documentKind: "semantic-overlap-proposal-batch.v1",
    lifecycle: "INFERRED_NOT_ADMITTED",
    note: "Proposals only. Nothing in this file is admitted authority, a binding, or a governance decision. reviews/ is never scanned by discoversAuthorityDocuments. This batch has not been reviewed yet -- a human must edit reviewFindings/reviewOutcomes/knowHowExtracted/candidateAuthorities before admits-know-how.js can act on it.",
    subject: Object.freeze({
      historicalAuthorityFile,
      historicalDeclaredSourceFile: declaredSourceFile,
      resolvedSuccessorFile,
      successionEvidence,
    }),
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
    reviewCaveats: Object.freeze([
      "This batch has not been reviewed. reviewFindings, reviewOutcomes, knowHowExtracted, and candidateAuthorities are all empty until a human reviews the proposals below and edits this file.",
    ]),
    reviewFindings: Object.freeze([]),
    reviewOutcomes: Object.freeze([]),
    knowHowExtracted: Object.freeze([]),
    candidateAuthorities: Object.freeze([]),
    proposals: Object.freeze(proposals),
  });
}
