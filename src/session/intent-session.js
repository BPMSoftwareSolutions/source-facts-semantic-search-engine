import { createHash } from "node:crypto";

const sessionType = "intent-to-product-session.v1";

export function startsSession({ subject, intentText, rationale = null }) {
  requiresNonEmpty("subject", subject);
  requiresNonEmpty("intentText", intentText);
  const sessionId = `sha256:${sha256(`${subject}\0${intentText}`)}`;
  return Object.freeze({
    sessionType,
    sessionId,
    subject,
    intentRevisions: Object.freeze([buildsRevision(1, intentText, rationale)]),
    queries: Object.freeze([]),
    evidenceInspections: Object.freeze([]),
    considerations: Object.freeze([]),
    selections: Object.freeze([]),
    contractRevisions: Object.freeze([]),
    terminalDisposition: null,
  });
}

export function revisesIntent(session, { intentText, rationale = null }) {
  requiresOpenSession(session);
  requiresNonEmpty("intentText", intentText);
  const revision = buildsRevision(session.intentRevisions.length + 1, intentText, rationale);
  return Object.freeze({ ...session, intentRevisions: Object.freeze([...session.intentRevisions, revision]) });
}

export function recordsQuery(session, { queryText, resultSummary, rowCount = null }) {
  requiresOpenSession(session);
  requiresNonEmpty("queryText", queryText);
  requiresNonEmpty("resultSummary", resultSummary);
  const ordinal = session.queries.length + 1;
  const entry = Object.freeze({
    queryId: `sha256:${sha256(`${session.sessionId}\0query\0${ordinal}\0${queryText}`)}`,
    ordinal,
    queryText,
    resultSummary,
    rowCount,
  });
  return Object.freeze({ ...session, queries: Object.freeze([...session.queries, entry]) });
}

export function recordsInspection(session, { sourceReferenceIds, note }) {
  requiresOpenSession(session);
  if (!Array.isArray(sourceReferenceIds) || sourceReferenceIds.length === 0) {
    throw new Error("sourceReferenceIds must be a non-empty array.");
  }
  requiresNonEmpty("note", note);
  const ordinal = session.evidenceInspections.length + 1;
  const entry = Object.freeze({
    inspectionId: `sha256:${sha256(`${session.sessionId}\0inspection\0${ordinal}`)}`,
    ordinal,
    sourceReferenceIds: Object.freeze([...sourceReferenceIds]),
    note,
  });
  return Object.freeze({ ...session, evidenceInspections: Object.freeze([...session.evidenceInspections, entry]) });
}

export function recordsConsideration(session, { category, candidateLabel, evidenceReferences = [], outcome, rationale }) {
  requiresOpenSession(session);
  requiresNonEmpty("category", category);
  requiresNonEmpty("candidateLabel", candidateLabel);
  requiresNonEmpty("rationale", rationale);
  if (outcome !== "selected" && outcome !== "rejected") throw new Error("outcome must be 'selected' or 'rejected'.");
  const ordinal = session.considerations.length + 1;
  const entry = Object.freeze({
    considerationId: `sha256:${sha256(`${session.sessionId}\0consideration\0${ordinal}\0${candidateLabel}`)}`,
    ordinal,
    category,
    candidateLabel,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    outcome,
    rationale,
  });
  return Object.freeze({ ...session, considerations: Object.freeze([...session.considerations, entry]) });
}

export function recordsSelection(session, { category, selectedLabel, consideredConsiderationIds = [], rationale }) {
  requiresOpenSession(session);
  requiresNonEmpty("category", category);
  requiresNonEmpty("selectedLabel", selectedLabel);
  requiresNonEmpty("rationale", rationale);
  const ordinal = session.selections.length + 1;
  const entry = Object.freeze({
    selectionId: `sha256:${sha256(`${session.sessionId}\0selection\0${ordinal}\0${category}`)}`,
    ordinal,
    category,
    selectedLabel,
    consideredConsiderationIds: Object.freeze([...consideredConsiderationIds]),
    rationale,
  });
  return Object.freeze({ ...session, selections: Object.freeze([...session.selections, entry]) });
}

export function revisesContract(session, { summary, contractHash }) {
  requiresOpenSession(session);
  requiresNonEmpty("summary", summary);
  requiresNonEmpty("contractHash", contractHash);
  const ordinal = session.contractRevisions.length + 1;
  const entry = Object.freeze({
    revisionId: `sha256:${sha256(`${session.sessionId}\0contract-revision\0${ordinal}`)}`,
    ordinal,
    summary,
    contractHash,
  });
  return Object.freeze({ ...session, contractRevisions: Object.freeze([...session.contractRevisions, entry]) });
}

export function finalizesSession(session, terminalDisposition) {
  requiresOpenSession(session);
  requiresNonEmpty("terminalDisposition", terminalDisposition);
  return Object.freeze({ ...session, terminalDisposition });
}

function buildsRevision(ordinal, intentText, rationale) {
  return Object.freeze({
    revisionId: `sha256:${sha256(`intent-revision\0${ordinal}\0${intentText}`)}`,
    ordinal,
    intentText,
    rationale,
  });
}

function requiresOpenSession(session) {
  if (session.terminalDisposition !== null) throw new Error("session is already finalized; cannot record further activity.");
}

function requiresNonEmpty(name, value) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${name} must be a non-empty string.`);
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
