#!/usr/bin/env node
// Admits reviewed know-how candidates from a reviews/*.json batch into
// know-how/ (durable, ADMITTED records) and projects any candidate
// authorities the batch identified into know-how/authority-remediation-candidates/
// (still explicitly un-authored, lifecycle CANDIDATE_NOT_AUTHORED).
//
// Admission itself is not a decision made here -- see admits-know-how.js.
// The decision already happened as human review of the source batch
// (reviewOutcomes[]/reviewFindings[]); this script only shapes and persists
// the result.
//
// Usage: node scripts/admit-know-how-from-review.mjs [--batch-file <path>] [--know-how-dir <dir>] [--admitted-by <name>] [--repository-id <id>]

import path from "node:path";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extractsReviewedKnowHow } from "../src/governance/extracts-reviewed-know-how.js";
import { admitsKnowHow } from "../src/governance/admits-know-how.js";
import { projectsAuthorityRemediationCandidate } from "../src/governance/projects-authority-remediation-candidate.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parsesArgs(argv) {
  const flags = {};
  for (let index = 0; index < argv.length; index++) {
    if (argv[index].startsWith("--")) {
      flags[argv[index].slice(2)] = argv[index + 1];
      index++;
    }
  }
  return flags;
}

async function main() {
  const flags = parsesArgs(process.argv.slice(2));
  const batchFile = path.resolve(repositoryRoot, flags["batch-file"] ?? "reviews/serves-query-console.authority-complete.semantic-overlap-proposals.json");
  const knowHowDir = path.resolve(repositoryRoot, flags["know-how-dir"] ?? "know-how");
  const admittedBy = flags["admitted-by"] ?? "human-review-in-conversation";
  const repositoryId = flags["repository-id"] ?? "source-facts-semantic-search-engine";

  const batchRelativePath = path.relative(repositoryRoot, batchFile).replaceAll("\\", "/");
  const document = JSON.parse(await readFile(batchFile, "utf8"));
  const admittedAtUtc = new Date().toISOString();

  const candidates = extractsReviewedKnowHow({ filePath: batchRelativePath, document });
  await mkdir(knowHowDir, { recursive: true });

  const admittedByKnowHowId = new Map();
  for (const candidate of candidates) {
    const record = admitsKnowHow(candidate, { admittedBy, admittedAtUtc, repositoryId });
    const outPath = path.join(knowHowDir, `${record.knowHowId}.json`);
    await writeFile(outPath, JSON.stringify(record, null, 2), "utf8");
    admittedByKnowHowId.set(candidate.knowHowId, candidate.kind);
    process.stdout.write(`admitted know-how [${record.kind}] -> ${path.relative(repositoryRoot, outPath).replaceAll("\\", "/")}\n`);
  }

  const candidateAuthorities = Array.isArray(document.candidateAuthorities) ? document.candidateAuthorities : [];
  const implementationGapKnowHowIds = candidates.filter((candidate) => candidate.kind === "implementation-gap").map((candidate) => candidate.knowHowId);

  if (candidateAuthorities.length > 0) {
    const remediationDir = path.join(knowHowDir, "authority-remediation-candidates");
    await mkdir(remediationDir, { recursive: true });

    for (const candidateAuthority of candidateAuthorities) {
      const record = projectsAuthorityRemediationCandidate(candidateAuthority, {
        citesKnowHowIds: implementationGapKnowHowIds,
        sourceEvidence: {
          inferenceBatch: batchRelativePath,
          targetFile: document.subject?.resolvedSuccessorFile ?? null,
        },
        projectedAtUtc: admittedAtUtc,
      });
      const outPath = path.join(remediationDir, `${record.candidateAuthorityId}.json`);
      await writeFile(outPath, JSON.stringify(record, null, 2), "utf8");
      process.stdout.write(`projected authority remediation candidate -> ${path.relative(repositoryRoot, outPath).replaceAll("\\", "/")}\n`);
    }
  }

  process.stdout.write(`\n${candidates.length} know-how record(s) admitted, ${candidateAuthorities.length} authority remediation candidate(s) projected.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
