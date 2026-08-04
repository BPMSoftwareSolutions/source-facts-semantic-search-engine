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

const knownMissingTissueKinds = Object.freeze([
  "AUTHORITY_DOCUMENT_MISSING",
  "AUTHORITY_FAMILY_MISSING",
  "AUTHORITY_ENTRY_MISSING",
  "AUTHORITY_HOME_AMBIGUOUS",
  "RESPONSIBILITY_BINDING_MISSING",
  "EXECUTION_BINDING_MISSING",
  "EQUIVALENCE_PROOF_MISSING",
]);

const draftSectionSchema = Object.freeze({
  type: "object",
  required: ["applicable", "rationale"],
  properties: {
    applicable: { type: "boolean", description: "false if this draft type does not apply to this subject -- leave the rest of the fields empty in that case" },
    rationale: { type: "string" },
  },
});

function buildsConditionalSectionSchema(extraProperties, requiredWhenApplicable) {
  return Object.freeze({
    type: "object",
    required: [...draftSectionSchema.required],
    properties: {
      ...draftSectionSchema.properties,
      ...extraProperties,
    },
    allOf: [
      {
        if: { properties: { applicable: { const: true } }, required: ["applicable"] },
        then: { required: [...requiredWhenApplicable] },
      },
      {
        if: { properties: { applicable: { const: false } }, required: ["applicable"] },
        then: {
          not: {
            anyOf: requiredWhenApplicable.map((field) => ({ required: [field] })),
          },
        },
      },
    ],
    additionalProperties: false,
  });

const responseSchema = Object.freeze({
  type: "object",
  required: ["healingDisposition", "missingTissue", "confidence", "evidenceReferences", "authorityCompletionDraft", "bindingDraft", "runtimeWiringDraft", "collapsedBodyDraft", "equivalenceVectorDraft"],
  properties: {
    healingDisposition: { type: "string", enum: [...knownHealingDispositions] },
    missingTissue: { type: "array", items: { type: "string", enum: [...knownMissingTissueKinds] } },
    confidence: { type: "number", minimum: 0, maximum: 1, description: "0.0 to 1.0" },
    evidenceReferences: { type: "array", minItems: 1, items: { type: "string" } },
    authorityCompletionDraft: buildsConditionalSectionSchema({
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
          additionalProperties: false,
        },
      },
    }, ["candidateAuthorityId", "family", "mechanics"]),
    bindingDraft: buildsConditionalSectionSchema({
      bindingId: { type: "string" },
      authorityRef: { type: "string" },
      bodyRef: { type: "string" },
      runtimePort: { type: "string" },
      resultContractId: { type: "string" },
    }, ["bindingId", "authorityRef", "bodyRef", "runtimePort", "resultContractId"]),
    runtimeWiringDraft: buildsConditionalSectionSchema({
      targetFile: { type: "string" },
      importSpecifier: { type: "string" },
      invocationSite: { type: "string" },
    }, ["targetFile", "importSpecifier", "invocationSite"]),
    collapsedBodyDraft: buildsConditionalSectionSchema({
      targetFile: { type: "string" },
      targetResponsibility: { type: "string" },
      proposedSource: { type: "string", description: "A draft source excerpt only. Never a claim that this has been applied anywhere." },
      risks: { type: "array", items: { type: "string" } },
    }, ["targetFile", "targetResponsibility", "proposedSource", "risks"]),
    equivalenceVectorDraft: buildsConditionalSectionSchema({
      fixtureDescription: { type: "string" },
      comparisonPoints: { type: "array", items: { type: "string" } },
    }, ["fixtureDescription", "comparisonPoints"]),
  },
});

const systemPrompt = `You are drafting SEMANTIC CONNECTIVE TISSUE, not applying it. Given a subject that already has known authority evidence, executable evidence, existing wiring, and known gaps, propose the specific missing pieces (authority completion, binding, runtime wiring, collapsed-body replacement, equivalence vector) needed to connect an executable body to its declared or missing authority meaning.

Hard constraints:
- You are drafting candidates for human review, not making changes. Nothing you produce is applied anywhere.
- Mark a draft section "applicable": false if it does not apply to this subject -- do not force content into every section.
- A legitimate recommendation must be recoverable from the evidence manifest. If you cannot point to an allowed file, callable name, or import specifier, do not synthesize one.
- For binding/runtime wiring, use exact callable names, file refs, and import specifiers that already appear in the grounding manifest. Never rename an inline expression into a new helper unless that helper already exists in the evidence.
- If the only current behavior is inline serialization or delegation and there is no named projector/helper in the evidence, prefer NO_SUPPORTED_PROJECTOR or INSUFFICIENT_EVIDENCE instead of inventing a port.
- collapsedBodyDraft.proposedSource is a draft excerpt only, grounded in the actual current code style and imports given to you. Never invent functions, files, or imports that are not present in the evidence or the grounding manifest.
- Cite concrete evidence (function names, current file paths, existing delegation patterns already visible in the evidence) for every draft you produce.
- Use INSUFFICIENT_EVIDENCE as the healingDisposition, with all draft sections applicable:false, if the evidence does not support a confident draft.
- Respond only with the declared JSON shape.`;

function normalizesEvidenceFiles(evidence, defaultPathPrefix) {
  if (Array.isArray(evidence)) {
    return evidence
      .map((item, index) => {
        if (typeof item === "string") {
          const content = item.trim();
          if (content.length === 0) return null;
          return Object.freeze({
            path: `${defaultPathPrefix}-${index + 1}.txt`,
            content,
          });
        }
        if (item === null || typeof item !== "object") return null;
        const pathValue = typeof item.path === "string" && item.path.length > 0
          ? item.path.replaceAll("\\", "/")
          : `${defaultPathPrefix}-${index + 1}.txt`;
        const contentValue = typeof item.content === "string" ? item.content : String(item.content ?? "");
        return Object.freeze({ path: pathValue, content: contentValue });
      })
      .filter((item) => item !== null);
  }

  if (typeof evidence === "string" && evidence.trim().length > 0) {
    return [Object.freeze({ path: `${defaultPathPrefix}.txt`, content: evidence })];
  }

  return [];
}

function formatsEvidenceFiles(evidenceFiles) {
  return evidenceFiles
    .map((file) => `## ${file.path}\n\`\`\`\n${file.content}\n\`\`\``)
    .join("\n\n");
}

function parsesCodeSymbols(content) {
  const symbols = new Set();
  const importSpecifiers = new Set();

  for (const match of content.matchAll(/import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g)) {
    const specifier = match[2];
    if (specifier.startsWith(".")) {
      importSpecifiers.add(specifier);
    }
    for (const entry of match[1].split(",")) {
      const trimmed = entry.trim();
      if (trimmed.length === 0) continue;
      const localName = trimmed.includes(" as ")
        ? trimmed.split(/\s+as\s+/).pop()?.trim()
        : trimmed;
      if (typeof localName === "string" && /^[A-Za-z_$][\w$]*$/.test(localName)) {
        symbols.add(localName);
      }
    }
  }

  for (const match of content.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["']/g)) {
    const localName = match[1];
    const specifier = match[2];
    if (specifier.startsWith(".")) {
      importSpecifiers.add(specifier);
    }
    symbols.add(localName);
  }

  for (const pattern of [
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /export\s+class\s+([A-Za-z_$][\w$]*)\s*/g,
    /class\s+([A-Za-z_$][\w$]*)\s*/g,
    /export\s+const\s+([A-Za-z_$][\w$]*)\s*=/g,
    /export\s+let\s+([A-Za-z_$][\w$]*)\s*=/g,
    /export\s+var\s+([A-Za-z_$][\w$]*)\s*=/g,
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g,
  ]) {
    for (const match of content.matchAll(pattern)) {
      symbols.add(match[1]);
    }
  }

  return { symbols, importSpecifiers };
}

function parsesJsonEvidence(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { authorityIds: new Set(), candidateAuthorityIds: new Set() };
  }

  const authorityIds = new Set();
  const candidateAuthorityIds = new Set();

  const mechanics = parsed?.authority?.mechanics ?? parsed?.mechanics;
  if (Array.isArray(mechanics)) {
    for (const mechanic of mechanics) {
      if (typeof mechanic?.mechanicId === "string" && mechanic.mechanicId.length > 0) {
        authorityIds.add(mechanic.mechanicId);
      }
    }
  }

  if (typeof parsed?.candidateAuthorityId === "string" && parsed.candidateAuthorityId.length > 0) {
    candidateAuthorityIds.add(parsed.candidateAuthorityId);
  }

  return { authorityIds, candidateAuthorityIds };
}

function buildsGroundingManifest({ authorityEvidenceFiles, executableEvidenceFiles, subjectId }) {
  const allowedFiles = new Set();
  const allowedSymbols = new Set();
  const allowedImportSpecifiers = new Set();
  const allowedAuthorityIds = new Set([subjectId]);

  for (const file of [...authorityEvidenceFiles, ...executableEvidenceFiles]) {
    allowedFiles.add(file.path);

    if (/\.(mjs|cjs|js|ts|mts|cts)$/i.test(file.path)) {
      const { symbols, importSpecifiers } = parsesCodeSymbols(file.content);
      for (const symbol of symbols) allowedSymbols.add(symbol);
      for (const importSpecifier of importSpecifiers) allowedImportSpecifiers.add(importSpecifier);
    }

    if (file.path.endsWith(".json")) {
      const { authorityIds, candidateAuthorityIds } = parsesJsonEvidence(file.content);
      for (const id of authorityIds) allowedAuthorityIds.add(id);
      for (const id of candidateAuthorityIds) allowedAuthorityIds.add(id);
    }
  }

  return Object.freeze({
    allowedFiles: Object.freeze(new Set(allowedFiles)),
    allowedSymbols: Object.freeze(new Set(allowedSymbols)),
    allowedImportSpecifiers: Object.freeze(new Set(allowedImportSpecifiers)),
    allowedAuthorityIds: Object.freeze(new Set(allowedAuthorityIds)),
  });
}

function formatsGroundingManifest(manifest) {
  const sorted = (values) => [...values].sort((left, right) => left.localeCompare(right));
  const lines = [
    "## Grounding manifest",
    "",
    "Only use names already present in the allowed lists below. If a section needs a symbol, file, or import specifier that is not listed, mark that section applicable:false instead of inventing it.",
    "",
    "### Allowed files",
    ...sorted(manifest.allowedFiles).map((file) => `- \`${file}\``),
    "",
    "### Allowed callable names",
    ...sorted(manifest.allowedSymbols).map((symbol) => `- \`${symbol}\``),
    "",
    "### Allowed local import specifiers",
    ...sorted(manifest.allowedImportSpecifiers).map((specifier) => `- \`${specifier}\``),
    "",
    "### Allowed authority or candidate ids",
    ...sorted(manifest.allowedAuthorityIds).map((id) => `- \`${id}\``),
    "",
  ];
  return lines.join("\n");
}

function validatesGroundedDraft(draft, groundingManifest, subjectId) {
  const errors = [];
  const validateSlug = (label, value) => {
    if (typeof value !== "string" || value.length === 0) {
      errors.push(`${label} is required`);
      return false;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(value)) {
      errors.push(`${label} must be a lowercase slug, not a path or filename: ${value}`);
      return false;
    }
    return true;
  };
  const validatesFileRef = (label, value) => {
    if (typeof value !== "string" || value.length === 0) {
      errors.push(`${label} is required`);
      return;
    }
    const [filePath, symbolName = null] = value.split("#");
    if (!groundingManifest.allowedFiles.has(filePath)) {
      errors.push(`${label} references file ${filePath} that is not present in the grounding manifest`);
    }
    if (symbolName !== null && !groundingManifest.allowedSymbols.has(symbolName) && !groundingManifest.allowedAuthorityIds.has(symbolName)) {
      errors.push(`${label} references symbol ${symbolName} that is not present in the grounding manifest`);
    }
  };
  const validatesImportSpecifier = (label, value) => {
    if (typeof value !== "string" || value.length === 0) {
      errors.push(`${label} is required`);
      return;
    }
    if (!groundingManifest.allowedImportSpecifiers.has(value)) {
      errors.push(`${label} references import specifier ${value} that is not present in the grounding manifest`);
    }
  };
  const validatesEvidenceReference = (label, value) => {
    if (typeof value !== "string" || value.length === 0) {
      errors.push(`${label} is required`);
      return;
    }
    if (groundingManifest.allowedFiles.has(value) || groundingManifest.allowedSymbols.has(value) || groundingManifest.allowedAuthorityIds.has(value)) {
      return;
    }
    const hashIndex = value.indexOf("#");
    if (hashIndex >= 0) {
      const filePath = value.slice(0, hashIndex);
      const anchor = value.slice(hashIndex + 1);
      if (!groundingManifest.allowedFiles.has(filePath)) {
        errors.push(`${label} references file ${filePath} that is not present in the grounding manifest`);
        return;
      }
      if (groundingManifest.allowedSymbols.has(anchor) || groundingManifest.allowedAuthorityIds.has(anchor)) {
        return;
      }
      errors.push(`${label} references anchor ${anchor} that is not present in the grounding manifest`);
      return;
    }
    const colonIndex = value.indexOf(":");
    if (colonIndex > 0 && !/^[A-Za-z]:[\\/]/.test(value)) {
      const filePath = value.slice(0, colonIndex);
      const anchor = value.slice(colonIndex + 1);
      if (!groundingManifest.allowedFiles.has(filePath)) {
        errors.push(`${label} references file ${filePath} that is not present in the grounding manifest`);
        return;
      }
      if (/^[0-9]+(?:-[0-9]+)?$/.test(anchor) || groundingManifest.allowedSymbols.has(anchor) || groundingManifest.allowedAuthorityIds.has(anchor)) {
        return;
      }
      errors.push(`${label} references anchor ${anchor} that is not present in the grounding manifest`);
      return;
    }
    errors.push(`${label} references value ${value} that is not present in the grounding manifest`);
  };

  if (draft.authorityCompletionDraft?.applicable === true) {
    if (validateSlug("authorityCompletionDraft.candidateAuthorityId", draft.authorityCompletionDraft.candidateAuthorityId)) {
      if (draft.authorityCompletionDraft.candidateAuthorityId !== subjectId && !groundingManifest.allowedAuthorityIds.has(draft.authorityCompletionDraft.candidateAuthorityId)) {
        errors.push(`authorityCompletionDraft.candidateAuthorityId ${draft.authorityCompletionDraft.candidateAuthorityId} is not one of the allowed ids for this subject`);
      }
    }
    for (const mechanic of draft.authorityCompletionDraft.mechanics ?? []) {
      validateSlug("authorityCompletionDraft.mechanics[].mechanicId", mechanic.mechanicId);
    }
  }

  if (draft.bindingDraft?.applicable === true) {
    validateSlug("bindingDraft.bindingId", draft.bindingDraft.bindingId);
    if (typeof draft.bindingDraft.runtimePort !== "string" || !groundingManifest.allowedSymbols.has(draft.bindingDraft.runtimePort)) {
      errors.push(`bindingDraft.runtimePort ${draft.bindingDraft.runtimePort ?? "(missing)"} is not present in the grounding manifest`);
    }
    validatesFileRef("bindingDraft.authorityRef", draft.bindingDraft.authorityRef);
    validatesFileRef("bindingDraft.bodyRef", draft.bindingDraft.bodyRef);
    if (validateSlug("bindingDraft.resultContractId", draft.bindingDraft.resultContractId)) {
      if (draft.bindingDraft.resultContractId !== subjectId && !groundingManifest.allowedAuthorityIds.has(draft.bindingDraft.resultContractId)) {
        errors.push(`bindingDraft.resultContractId ${draft.bindingDraft.resultContractId} is not one of the allowed ids for this subject`);
      }
    }
  }

  if (draft.runtimeWiringDraft?.applicable === true) {
    if (typeof draft.runtimeWiringDraft.targetFile !== "string" || !groundingManifest.allowedFiles.has(draft.runtimeWiringDraft.targetFile)) {
      errors.push(`runtimeWiringDraft.targetFile ${draft.runtimeWiringDraft.targetFile ?? "(missing)"} is not present in the grounding manifest`);
    }
    validatesImportSpecifier("runtimeWiringDraft.importSpecifier", draft.runtimeWiringDraft.importSpecifier);
    validatesEvidenceReference("runtimeWiringDraft.invocationSite", draft.runtimeWiringDraft.invocationSite);
  }

  if (draft.collapsedBodyDraft?.applicable === true) {
    if (typeof draft.collapsedBodyDraft.targetFile !== "string" || !groundingManifest.allowedFiles.has(draft.collapsedBodyDraft.targetFile)) {
      errors.push(`collapsedBodyDraft.targetFile ${draft.collapsedBodyDraft.targetFile ?? "(missing)"} is not present in the grounding manifest`);
    }
  }

  if (Array.isArray(draft.evidenceReferences)) {
    for (const [index, reference] of draft.evidenceReferences.entries()) {
      validatesEvidenceReference(`evidenceReferences[${index}]`, reference);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Model response was not grounded in the provided evidence: ${errors.join("; ")}`);
  }
}

function buildsUserPrompt({ repairPacket, groundingManifest }) {
  const authorityEvidence = formatsEvidenceFiles(repairPacket.authorityEvidence);
  const executableEvidence = formatsEvidenceFiles(repairPacket.executableEvidence);
  const existingWiring = typeof repairPacket.existingWiring === "string" && repairPacket.existingWiring.trim().length > 0
    ? repairPacket.existingWiring
    : "(none known)";
  const knownGaps = Array.isArray(repairPacket.knownGaps) ? repairPacket.knownGaps : [];
  const requiredOutputs = Array.isArray(repairPacket.requiredOutputs) ? repairPacket.requiredOutputs : [];

  return `## Repair packet type
${repairPacket.repairPacketType}

## Subject
${repairPacket.subject.subjectId}

## Admitted scenario target
${JSON.stringify(repairPacket.subject.scenarioTarget, null, 2)}

## Authority evidence (what meaning already exists or is proposed)
${authorityEvidence}

## Executable evidence (current code)
${executableEvidence}

## Existing wiring (what is already connected)
${existingWiring}

${formatsGroundingManifest(groundingManifest)}

## Known gaps (already established by deterministic analysis and/or prior review -- do not re-derive these, use them as ground truth)
${knownGaps.map((gap) => `- ${gap}`).join("\n")}

## Requested outputs
${requiredOutputs.join(", ")}

## Your task
Produce exactly one structured response covering every draft section. Mark inapplicable sections applicable:false. Do not invent runtime ports, body refs, callable names, import specifiers, or file references that are not listed in the grounding manifest. Evidence references must be repo-relative file paths or file#symbol refs, never copied code snippets. If the evidence does not support a confident draft, return INSUFFICIENT_EVIDENCE and set every draft section applicable:false.`;
}
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
  scenarioTarget,
  featureAuthority,
  authorityEvidence,
  executableEvidence,
  existingWiring,
  knownGaps = [],
  requiredOutputs = ["authority-draft", "binding-draft", "runtime-wiring-draft", "collapsed-body-draft", "equivalence-vector-draft"],
  requestId = `connective-tissue-${randomUUID()}`,
  maximumOutputTokens = 32768,
  invoke = invokesLiveModelInference,
}) {
  if (typeof subjectId !== "string" || subjectId.length === 0) {
    throw new Error("subjectId is required.");
  }
  const requiredTargetIds = ["featureId", "scenarioId", "responsibilityId", "obligationId"];
  for (const targetId of requiredTargetIds) {
    if (typeof scenarioTarget?.[targetId] !== "string" || scenarioTarget[targetId].length === 0) {
      throw new Error(`scenarioTarget.${targetId} is required -- connective tissue may only be drafted inside admitted scenario lineage.`);
    }
  }
  const lineage = featureAuthority?.lineage;
  const featureMatches = lineage?.authorityType === "canonical-lineage-authority.v1" && (lineage.features ?? [])
    .some((feature) => feature.featureId === scenarioTarget.featureId);
  const scenarioMatches = featureMatches && (lineage.scenarios ?? [])
    .some((scenario) => scenario.scenarioId === scenarioTarget.scenarioId && scenario.featureId === scenarioTarget.featureId);
  const obligationMatches = scenarioMatches && (lineage.obligations ?? [])
    .some((obligation) => obligation.obligationId === scenarioTarget.obligationId && obligation.scenarioId === scenarioTarget.scenarioId);
  const responsibilityMatches = obligationMatches && (lineage.responsibilities ?? [])
    .some((responsibility) => responsibility.responsibilityId === scenarioTarget.responsibilityId && responsibility.obligationId === scenarioTarget.obligationId);
  const authorityAdmitted = featureAuthority?.contract?.status === "admitted";
  if (!responsibilityMatches || !authorityAdmitted) {
    throw new Error("scenarioTarget does not resolve through an admitted canonical feature authority; admit or extend feature coverage before generating connective tissue.");
  }
  if (!((typeof executableEvidence === "string" && executableEvidence.trim().length > 0) || (Array.isArray(executableEvidence) && executableEvidence.length > 0))) {
    throw new Error("executableEvidence is required -- connective tissue cannot be drafted without current code to ground it.");
  }

  const normalizesLocalEvidence = (evidence, defaultPathPrefix) => {
    if (Array.isArray(evidence)) {
      return evidence
        .map((item, index) => {
          if (typeof item === "string") {
            const content = item.trim();
            if (content.length === 0) return null;
            return Object.freeze({
              path: `${defaultPathPrefix}-${index + 1}.txt`,
              content,
            });
          }
          if (item === null || typeof item !== "object") return null;
          const pathValue = typeof item.path === "string" && item.path.length > 0
            ? item.path.replaceAll("\\", "/")
            : `${defaultPathPrefix}-${index + 1}.txt`;
          const contentValue = typeof item.content === "string" ? item.content : String(item.content ?? "");
          return Object.freeze({ path: pathValue, content: contentValue });
        })
        .filter((item) => item !== null);
    }

    if (typeof evidence === "string" && evidence.trim().length > 0) {
      return [Object.freeze({ path: `${defaultPathPrefix}.txt`, content: evidence })];
    }

    return [];
  };

  const repairPacket = Object.freeze({
    repairPacketType: "connective-tissue-repair-packet.v1",
    subject: Object.freeze({ subjectId, scenarioTarget: Object.freeze({ ...scenarioTarget }) }),
    authorityEvidence: normalizesLocalEvidence(authorityEvidence, "authority-evidence"),
    executableEvidence: normalizesLocalEvidence(executableEvidence, "executable-evidence"),
    existingWiring: typeof existingWiring === "string" && existingWiring.trim().length > 0 ? existingWiring.trim() : null,
    knownGaps: Object.freeze(Array.isArray(knownGaps) ? knownGaps.filter((gap) => typeof gap === "string" && gap.trim().length > 0) : []),
    requiredOutputs: Object.freeze(Array.isArray(requiredOutputs) ? requiredOutputs.filter((output) => typeof output === "string" && output.trim().length > 0) : []),
  });
  const systemPromptLocal = `You are drafting SEMANTIC CONNECTIVE TISSUE, not applying it. Given a subject that already has known authority evidence, executable evidence, existing wiring, and known gaps, propose the specific missing pieces (authority completion, binding, runtime wiring, collapsed-body replacement, equivalence vector) needed to connect an executable body to its declared or missing authority meaning.

Hard constraints:
- You are drafting candidates for human review, not making changes. Nothing you produce is applied anywhere.
- Mark a draft section "applicable": false if it does not apply to this subject -- do not force content into every section.
- A legitimate recommendation must be recoverable from the evidence manifest. If you cannot point to an allowed file, callable name, or import specifier, do not synthesize one.
- For binding/runtime wiring, use exact callable names, file refs, and import specifiers that already appear in the grounding manifest. Never rename an inline expression into a new helper unless that helper already exists in the evidence.
- If the only current behavior is inline serialization or delegation and there is no named projector/helper in the evidence, prefer NO_SUPPORTED_PROJECTOR or INSUFFICIENT_EVIDENCE instead of inventing a port.
- collapsedBodyDraft.proposedSource is a draft excerpt only, grounded in the actual current code style and imports given to you. Never invent functions, files, or imports that are not present in the evidence or the grounding manifest.
- Cite concrete evidence (function names, current file paths, existing delegation patterns already visible in the evidence) for every draft you produce.
- Use INSUFFICIENT_EVIDENCE as the healingDisposition, with all draft sections applicable:false, if the evidence does not support a confident draft.
- Respond only with the declared JSON shape.`;
  const responseSchemaLocal = Object.freeze({
    type: "object",
    required: ["healingDisposition", "missingTissue", "confidence", "evidenceReferences", "authorityCompletionDraft", "bindingDraft", "runtimeWiringDraft", "collapsedBodyDraft", "equivalenceVectorDraft"],
    properties: {
      healingDisposition: { type: "string", enum: [...knownHealingDispositions] },
      missingTissue: { type: "array", items: { type: "string", enum: [...knownMissingTissueKinds] } },
      confidence: { type: "number", minimum: 0, maximum: 1, description: "0.0 to 1.0" },
      evidenceReferences: { type: "array", minItems: 1, items: { type: "string" } },
      authorityCompletionDraft: {
        type: "object",
        required: ["applicable", "rationale"],
        properties: {
          applicable: { type: "boolean" },
          rationale: { type: "string" },
          candidateAuthorityId: { type: "string" },
          family: { type: "string" },
          mechanics: { type: "array", items: { type: "object" } },
        },
        additionalProperties: true,
      },
      bindingDraft: {
        type: "object",
        required: ["applicable", "rationale"],
        properties: {
          applicable: { type: "boolean" },
          rationale: { type: "string" },
          bindingId: { type: "string" },
          authorityRef: { type: "string" },
          bodyRef: { type: "string" },
          runtimePort: { type: "string" },
          resultContractId: { type: "string" },
        },
        additionalProperties: true,
      },
      runtimeWiringDraft: {
        type: "object",
        required: ["applicable", "rationale"],
        properties: {
          applicable: { type: "boolean" },
          rationale: { type: "string" },
          targetFile: { type: "string" },
          importSpecifier: { type: "string" },
          invocationSite: { type: "string" },
        },
        additionalProperties: true,
      },
      collapsedBodyDraft: {
        type: "object",
        required: ["applicable", "rationale"],
        properties: {
          applicable: { type: "boolean" },
          rationale: { type: "string" },
          targetFile: { type: "string" },
          targetResponsibility: { type: "string" },
          proposedSource: { type: "string" },
          risks: { type: "array", items: { type: "string" } },
        },
        additionalProperties: true,
      },
      equivalenceVectorDraft: {
        type: "object",
        required: ["applicable", "rationale"],
        properties: {
          applicable: { type: "boolean" },
          rationale: { type: "string" },
          fixtureDescription: { type: "string" },
          comparisonPoints: { type: "array", items: { type: "string" } },
        },
        additionalProperties: true,
      },
    },
  });
  const formatsEvidenceFilesLocal = (evidenceFiles) => {
    if (!Array.isArray(evidenceFiles) || evidenceFiles.length === 0) {
      return "(none provided)";
    }
    return evidenceFiles
      .map((file) => `## ${file.path}\n\`\`\`\n${file.content}\n\`\`\``)
      .join("\n\n");
  };
  const parsesCodeSymbolsLocal = (content) => {
    const symbols = new Set();
    const importSpecifiers = new Set();

    for (const match of content.matchAll(/import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g)) {
      const specifier = match[2];
      if (specifier.startsWith(".")) {
        importSpecifiers.add(specifier);
      }
      for (const entry of match[1].split(",")) {
        const trimmed = entry.trim();
        if (trimmed.length === 0) continue;
        const localName = trimmed.includes(" as ")
          ? trimmed.split(/\s+as\s+/).pop()?.trim()
          : trimmed;
        if (typeof localName === "string" && /^[A-Za-z_$][\w$]*$/.test(localName)) {
          symbols.add(localName);
        }
      }
    }

    for (const match of content.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["']/g)) {
      const localName = match[1];
      const specifier = match[2];
      if (specifier.startsWith(".")) {
        importSpecifiers.add(specifier);
      }
      symbols.add(localName);
    }

    for (const pattern of [
      /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
      /(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
      /export\s+class\s+([A-Za-z_$][\w$]*)\s*/g,
      /class\s+([A-Za-z_$][\w$]*)\s*/g,
      /export\s+const\s+([A-Za-z_$][\w$]*)\s*=/g,
      /export\s+let\s+([A-Za-z_$][\w$]*)\s*=/g,
      /export\s+var\s+([A-Za-z_$][\w$]*)\s*=/g,
      /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g,
    ]) {
      for (const match of content.matchAll(pattern)) {
        symbols.add(match[1]);
      }
    }

    return { symbols, importSpecifiers };
  };
  const parsesJsonEvidenceLocal = (content) => {
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { authorityIds: new Set(), candidateAuthorityIds: new Set() };
    }

    const authorityIds = new Set();
    const candidateAuthorityIds = new Set();

    const mechanics = parsed?.authority?.mechanics ?? parsed?.mechanics;
    if (Array.isArray(mechanics)) {
      for (const mechanic of mechanics) {
        if (typeof mechanic?.mechanicId === "string" && mechanic.mechanicId.length > 0) {
          authorityIds.add(mechanic.mechanicId);
        }
      }
    }

    if (typeof parsed?.candidateAuthorityId === "string" && parsed.candidateAuthorityId.length > 0) {
      candidateAuthorityIds.add(parsed.candidateAuthorityId);
    }

    return { authorityIds, candidateAuthorityIds };
  };
  const buildsGroundingManifestLocal = ({ authorityEvidenceFiles, executableEvidenceFiles, subjectId: localSubjectId }) => {
    const allowedFiles = new Set();
    const allowedSymbols = new Set();
    const allowedImportSpecifiers = new Set();
    const allowedAuthorityIds = new Set([localSubjectId]);

    for (const file of [...authorityEvidenceFiles, ...executableEvidenceFiles]) {
      allowedFiles.add(file.path);

      if (/\.(mjs|cjs|js|ts|mts|cts)$/i.test(file.path)) {
        const { symbols, importSpecifiers } = parsesCodeSymbolsLocal(file.content);
        for (const symbol of symbols) allowedSymbols.add(symbol);
        for (const importSpecifier of importSpecifiers) allowedImportSpecifiers.add(importSpecifier);
      }

      if (file.path.endsWith(".json")) {
        const { authorityIds, candidateAuthorityIds } = parsesJsonEvidenceLocal(file.content);
        for (const id of authorityIds) allowedAuthorityIds.add(id);
        for (const id of candidateAuthorityIds) allowedAuthorityIds.add(id);
      }
    }

    return Object.freeze({
      allowedFiles: Object.freeze(new Set(allowedFiles)),
      allowedSymbols: Object.freeze(new Set(allowedSymbols)),
      allowedImportSpecifiers: Object.freeze(new Set(allowedImportSpecifiers)),
      allowedAuthorityIds: Object.freeze(new Set(allowedAuthorityIds)),
    });
  };
  const formatsGroundingManifestLocal = (manifest) => {
    const sorted = (values) => [...values].sort((left, right) => left.localeCompare(right));
    const lines = [
      "## Grounding manifest",
      "",
      "Only use names already present in the allowed lists below. If a section needs a symbol, file, or import specifier that is not listed, mark that section applicable:false instead of inventing it.",
      "Evidence references must be repo-relative file paths or file#symbol refs, not raw code snippets.",
      "",
      "### Allowed files",
      ...(manifest.allowedFiles.size > 0 ? sorted(manifest.allowedFiles).map((file) => `- \`${file}\``) : ["- (none)"]),
      "",
      "### Allowed callable names",
      ...(manifest.allowedSymbols.size > 0 ? sorted(manifest.allowedSymbols).map((symbol) => `- \`${symbol}\``) : ["- (none)"]),
      "",
      "### Allowed local import specifiers",
      ...(manifest.allowedImportSpecifiers.size > 0 ? sorted(manifest.allowedImportSpecifiers).map((specifier) => `- \`${specifier}\``) : ["- (none)"]),
      "",
      "### Allowed authority or candidate ids",
      ...(manifest.allowedAuthorityIds.size > 0 ? sorted(manifest.allowedAuthorityIds).map((id) => `- \`${id}\``) : ["- (none)"]),
      "",
    ];
    return lines.join("\n");
  };
  const validatesGroundedDraftLocal = (draft, groundingManifest, localSubjectId) => {
    const errors = [];
    const validateSlug = (label, value) => {
      if (typeof value !== "string" || value.length === 0) {
        errors.push(`${label} is required`);
        return false;
      }
      if (!/^[a-z][a-z0-9-]*$/.test(value)) {
        errors.push(`${label} must be a lowercase slug, not a path or filename: ${value}`);
        return false;
      }
      return true;
    };
    const validatesEvidenceReference = (label, value) => {
      if (typeof value !== "string" || value.length === 0) {
        errors.push(`${label} is required`);
        return;
      }
      if (groundingManifest.allowedFiles.has(value) || groundingManifest.allowedSymbols.has(value) || groundingManifest.allowedAuthorityIds.has(value)) {
        return;
      }
      const hashIndex = value.indexOf("#");
      if (hashIndex >= 0) {
        const filePath = value.slice(0, hashIndex);
        const anchor = value.slice(hashIndex + 1);
        if (!groundingManifest.allowedFiles.has(filePath)) {
          errors.push(`${label} references file ${filePath} that is not present in the grounding manifest`);
          return;
        }
        if (groundingManifest.allowedSymbols.has(anchor) || groundingManifest.allowedAuthorityIds.has(anchor)) {
          return;
        }
        errors.push(`${label} references anchor ${anchor} that is not present in the grounding manifest`);
        return;
      }
      errors.push(`${label} references value ${value} that is not present in the grounding manifest`);
    };
    const validatesImportSpecifier = (label, value) => {
      if (typeof value !== "string" || value.length === 0) {
        errors.push(`${label} is required`);
        return;
      }
      if (!groundingManifest.allowedImportSpecifiers.has(value)) {
        errors.push(`${label} references import specifier ${value} that is not present in the grounding manifest`);
      }
    };

    if (!Array.isArray(draft.evidenceReferences) || draft.evidenceReferences.length === 0) {
      errors.push("evidenceReferences must be a non-empty array");
    } else {
      for (const [index, reference] of draft.evidenceReferences.entries()) {
        validatesEvidenceReference(`evidenceReferences[${index}]`, reference);
      }
    }

    if (typeof draft.confidence !== "number" || Number.isNaN(draft.confidence) || draft.confidence < 0 || draft.confidence > 1) {
      errors.push(`confidence ${draft.confidence ?? "(missing)"} must be between 0 and 1`);
    }

    if (!Array.isArray(draft.missingTissue)) {
      errors.push("missingTissue must be an array");
    } else {
      for (const tissue of draft.missingTissue) {
        if (typeof tissue !== "string" || !knownMissingTissueKinds.includes(tissue)) {
          errors.push(`missingTissue entry ${tissue ?? "(missing)"} is not a recognized missing-tissue kind`);
        }
      }
    }

    if (draft.authorityCompletionDraft?.applicable === true) {
      if (validateSlug("authorityCompletionDraft.candidateAuthorityId", draft.authorityCompletionDraft.candidateAuthorityId)) {
        if (draft.authorityCompletionDraft.candidateAuthorityId !== localSubjectId && !groundingManifest.allowedAuthorityIds.has(draft.authorityCompletionDraft.candidateAuthorityId)) {
          errors.push(`authorityCompletionDraft.candidateAuthorityId ${draft.authorityCompletionDraft.candidateAuthorityId} is not one of the allowed ids for this subject`);
        }
      }
      for (const mechanic of draft.authorityCompletionDraft.mechanics ?? []) {
        validateSlug("authorityCompletionDraft.mechanics[].mechanicId", mechanic.mechanicId);
      }
    }

    if (draft.bindingDraft?.applicable === true) {
      validateSlug("bindingDraft.bindingId", draft.bindingDraft.bindingId);
      if (typeof draft.bindingDraft.runtimePort !== "string" || !groundingManifest.allowedSymbols.has(draft.bindingDraft.runtimePort)) {
        errors.push(`bindingDraft.runtimePort ${draft.bindingDraft.runtimePort ?? "(missing)"} is not present in the grounding manifest`);
      }
      validatesEvidenceReference("bindingDraft.authorityRef", draft.bindingDraft.authorityRef);
      validatesEvidenceReference("bindingDraft.bodyRef", draft.bindingDraft.bodyRef);
      if (validateSlug("bindingDraft.resultContractId", draft.bindingDraft.resultContractId)) {
        if (draft.bindingDraft.resultContractId !== localSubjectId && !groundingManifest.allowedAuthorityIds.has(draft.bindingDraft.resultContractId)) {
          errors.push(`bindingDraft.resultContractId ${draft.bindingDraft.resultContractId} is not one of the allowed ids for this subject`);
        }
      }
    }

    if (draft.runtimeWiringDraft?.applicable === true) {
      if (typeof draft.runtimeWiringDraft.targetFile !== "string" || !groundingManifest.allowedFiles.has(draft.runtimeWiringDraft.targetFile)) {
        errors.push(`runtimeWiringDraft.targetFile ${draft.runtimeWiringDraft.targetFile ?? "(missing)"} is not present in the grounding manifest`);
      }
      validatesImportSpecifier("runtimeWiringDraft.importSpecifier", draft.runtimeWiringDraft.importSpecifier);
      validatesEvidenceReference("runtimeWiringDraft.invocationSite", draft.runtimeWiringDraft.invocationSite);
    }

    if (draft.collapsedBodyDraft?.applicable === true) {
      if (typeof draft.collapsedBodyDraft.targetFile !== "string" || !groundingManifest.allowedFiles.has(draft.collapsedBodyDraft.targetFile)) {
        errors.push(`collapsedBodyDraft.targetFile ${draft.collapsedBodyDraft.targetFile ?? "(missing)"} is not present in the grounding manifest`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Model response was not grounded in the provided evidence: ${errors.join("; ")}`);
    }
  };
  const groundingManifest = buildsGroundingManifestLocal({
    authorityEvidenceFiles: repairPacket.authorityEvidence,
    executableEvidenceFiles: repairPacket.executableEvidence,
    subjectId,
  });
    const userPrompt = `## Repair packet type
${repairPacket.repairPacketType}

## Subject
${repairPacket.subject.subjectId}

## Admitted scenario target
${JSON.stringify(repairPacket.subject.scenarioTarget, null, 2)}

## Authority evidence (what meaning already exists or is proposed)
${formatsEvidenceFilesLocal(repairPacket.authorityEvidence)}

## Executable evidence (current code)
${formatsEvidenceFilesLocal(repairPacket.executableEvidence)}

## Existing wiring (what is already connected)
${typeof repairPacket.existingWiring === "string" && repairPacket.existingWiring.trim().length > 0 ? repairPacket.existingWiring : "(none known)"}

${formatsGroundingManifestLocal(groundingManifest)}

## Known gaps (already established by deterministic analysis and/or prior review -- do not re-derive these, use them as ground truth)
${(repairPacket.knownGaps.length > 0 ? repairPacket.knownGaps : ["(none known)"]).map((gap) => `- ${gap}`).join("\n")}

## Requested outputs
${(repairPacket.requiredOutputs.length > 0 ? repairPacket.requiredOutputs : ["(none specified)"]).join(", ")}

## Your task
Produce exactly one structured response covering every draft section. Mark inapplicable sections applicable:false. Do not invent runtime ports, body refs, callable names, import specifiers, or file references that are not listed in the grounding manifest. Evidence references must be repo-relative file paths or file#symbol refs, never copied code snippets. If the evidence does not support a confident draft, return INSUFFICIENT_EVIDENCE and set every draft section applicable:false.`;

  const modelRequest = {
    "$schema": "../authority/model-request.schema.v1.json",
    requestId,
    providerAuthorityId: "primary-cognitive-provider",
    modelAlias: "instruction-capable-model",
    interaction: {
      mode: "structured-generation",
      messages: [
        { role: "system", content: systemPromptLocal },
        { role: "user", content: userPrompt },
      ],
    },
    responsePolicy: {
      format: "json",
      maximumOutputTokens,
      temperature: 0,
      schema: responseSchemaLocal,
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
  validatesGroundedDraftLocal(draft, groundingManifest, subjectId);

  return Object.freeze({
    documentKind: "connective-tissue-draft-batch.v1",
    lifecycle: "DRAFT_NOT_ADMITTED",
    note: "Draft connective tissue only. Nothing here has been applied, admitted as authority, or written to any source file. healing/ is never scanned by discoversAuthorityDocuments and no code in this repository writes collapsedBodyDraft.proposedSource anywhere.",
    subject: Object.freeze({ subjectId, scenarioTarget: Object.freeze({ ...scenarioTarget }), knownGaps: Object.freeze([...knownGaps]) }),
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
