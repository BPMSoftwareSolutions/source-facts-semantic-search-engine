export function projectsDesignDocument({ session, contract }) {
  const lines = [];
  lines.push(`# Design Document: ${contract.subject}`);
  lines.push("");
  lines.push(`_Projected from session \`${session.sessionId}\` and contract \`${contract.contractId}\`. This document is a deterministic projection — every claim below cites session or contract evidence; edits belong in the session or contract, not this file._`);
  lines.push("");

  lines.push("## 1. Human Intent");
  lines.push("");
  const latestIntent = session.intentRevisions[session.intentRevisions.length - 1];
  lines.push(latestIntent.intentText);
  if (latestIntent.rationale !== null) lines.push("", `> ${latestIntent.rationale}`);
  lines.push("");

  lines.push("## 2. Intended Audience");
  lines.push("");
  lines.push(contract.audience);
  lines.push("");

  lines.push("## 3. Website Purpose");
  lines.push("");
  lines.push(contract.purpose);
  lines.push("");

  lines.push("## 4. Page Regions");
  lines.push("");
  for (const region of contract.pageRegions) {
    const suffix = region.notes !== null ? ` — ${region.notes}` : "";
    lines.push(`${"  ".repeat(region.depth)}- ${region.name}${suffix}`);
  }
  lines.push("");

  lines.push("## 5. Reused Know-How");
  lines.push("");
  const knowHowEntries = contract.pageRegions.flatMap((region) =>
    region.reusedKnowHow.map((item) => ({ region: region.name, ...item })));
  if (knowHowEntries.length === 0) {
    lines.push("_No reused know-how was cited for this contract._");
  } else {
    for (const entry of knowHowEntries) {
      const evidence = entry.evidenceReferences.length > 0 ? entry.evidenceReferences.join(", ") : "none cited";
      lines.push(`- **${entry.region}** reuses _${entry.label}_ (evidence: ${evidence})`);
    }
  }
  lines.push("");

  lines.push("## 6. Selections Made");
  lines.push("");
  if (session.selections.length === 0) {
    lines.push("_No selections recorded yet._");
  } else {
    for (const selection of session.selections) {
      lines.push(`- **${selection.category}**: ${selection.selectedLabel} — ${selection.rationale}`);
    }
  }
  lines.push("");

  lines.push("## 7. Considered and Rejected Patterns");
  lines.push("");
  const rejected = session.considerations.filter((consideration) => consideration.outcome === "rejected");
  if (rejected.length === 0) {
    lines.push("_No candidates were rejected in this session._");
  } else {
    for (const consideration of rejected) {
      lines.push(`- ~~${consideration.candidateLabel}~~ (${consideration.category}) — ${consideration.rationale}`);
    }
  }
  lines.push("");

  lines.push("## 8. Evidence Queries Run");
  lines.push("");
  if (session.queries.length === 0) {
    lines.push("_No queries recorded._");
  } else {
    for (const query of session.queries) {
      lines.push(`${query.ordinal}. \`${query.queryText}\` — ${query.resultSummary}`);
    }
  }
  lines.push("");

  lines.push("## 9. Selected Layout");
  lines.push("");
  lines.push(contract.selectedLayout !== null
    ? `${contract.selectedLayout.label} — ${contract.selectedLayout.rationale}`
    : "_No layout selected yet._");
  lines.push("");

  lines.push("## 10. Terminal Disposition");
  lines.push("");
  lines.push(session.terminalDisposition ?? "_Session still open._");
  lines.push("");

  return lines.join("\n");
}

export function projectsCandidateAstText({ contract }) {
  const lines = [contract.subject];
  for (const region of contract.pageRegions) {
    const indent = region.depth === 0 ? "" : "    ".repeat(region.depth - 1) + "    ";
    lines.push(`${indent}└── ${region.name}`);
  }
  return `${lines.join("\n")}\n`;
}
