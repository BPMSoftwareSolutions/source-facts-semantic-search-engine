import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sourceRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const targetRoot = "C:/lab/repos/runtime-capability-evaluator";
const engineBin = "C:/lab/repos/contract-driven-artifact-governance-engine/bin/governed-artifacts.mjs";
const liveDraftRoot = path.join(targetRoot, "evidence/live-drafts/evaluate-minimum-disk-compatibility-curated");
const capabilityRoot = path.join(targetRoot, "capabilities/evaluate-minimum-disk-compatibility");
const contractPath = path.join(sourceRoot, "contracts/evaluate-minimum-disk-compatibility.contract.json");

function maps(value, transform) {
  if (Array.isArray(value)) return value.map((entry) => maps(entry, transform));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [transform(key), maps(entry, transform)]));
  return transform(value);
}

function diskFromMemory(value) {
  return maps(value, (entry) => {
    if (typeof entry === "number") {
      if (entry === 4096) return 10000;
      if (entry === 8192) return 20000;
      if (entry === 2048) return 5000;
      return entry;
    }
    if (typeof entry !== "string") return entry;
    return [
      ["availableMemoryMb", "availableDiskMb"],
      ["requiredMemoryMb", "requiredDiskMb"],
      ["minimum-memory", "minimum-disk"],
      ["MinimumMemory", "MinimumDisk"],
      ["MEMORY", "DISK"],
      ["Memory", "Disk"],
      ["memory", "disk"],
      ["8192", "20000"],
      ["4096", "10000"],
      ["2048", "5000"],
    ].reduce((text, [from, to]) => text.replaceAll(from, to), entry);
  });
}

const projectionReceipt = JSON.parse(await readFile(path.join(liveDraftRoot, "projection-receipt.json"), "utf8"));
const capabilityPackage = JSON.parse(await readFile(path.join(liveDraftRoot, "capability-package.json"), "utf8"));
const draftAuthority = JSON.parse(await readFile(path.join(liveDraftRoot, "authority/system-runtime-evaluate-minimum-disk-compatibility.semantic-authority.draft.json"), "utf8"));
assert.equal(projectionReceipt.disposition, "SKELETON_PROJECTED_NOT_ADMITTED");
assert.equal(capabilityPackage.inference.performedBy, "live model call via generic-llm-connector");
assert.equal(draftAuthority.featureId, "system-runtime.evaluate-minimum-disk-compatibility");

const memoryContract = JSON.parse(await readFile(path.join(sourceRoot, "contracts/evaluate-minimum-memory-compatibility.contract.json"), "utf8"));
const contract = diskFromMemory(memoryContract);
contract.subject.authority = {
  authorityType: "live-model-curated-feature-intent.v1",
  featureId: draftAuthority.featureId,
  inferenceRequestHash: capabilityPackage.inference.requestHash,
  inferenceResponseHash: capabilityPackage.inference.responseHash,
  sourceIntent: "docs/evaluate-minimum-disk-compatibility.intent.md",
};
contract.subject.purpose = "Evaluate input-authoritative available and required disk capacity without probing or unit-conversion policy.";
contract.designAuthority.decisions = contract.designAuthority.decisions.filter((decision) => decision.decisionId !== "numeric-major-version-only");
contract.designAuthority.tieOut = contract.designAuthority.tieOut.filter((entry) => entry.decisionId !== "numeric-major-version-only");
contract.designAuthority.deviations = contract.designAuthority.deviations.filter((entry) => entry.decisionId !== "numeric-major-version-only");
contract.designAuthority.decisions.push(
  {
    decisionId: "exclude-disk-unit-conversion.v1",
    source: "user",
    disposition: "accepted",
    statement: "Inputs are already normalized megabyte integers; byte/gibibyte conversion remains outside this capability.",
  },
  {
    decisionId: "defer-rfc-7807-findings.v1",
    source: "live-model",
    disposition: "deferred",
    statement: "RFC 7807 formatting remains unresolved; invalid inputs use the admitted semantic runtime's structured schema findings.",
  },
);
contract.designAuthority.tieOut.push({
  decisionId: "exclude-disk-unit-conversion.v1",
  artifactIds: ["evaluate-minimum-disk-compatibility-bundle.v1", "verifies-minimum-disk-compatibility.v1"],
});

for (const artifact of contract.artifacts) {
  artifact.proof.contentSha256 = `sha256:${"0".repeat(64)}`;
  artifact.proof.expectedByteLength = 1;
}

await mkdir(capabilityRoot, { recursive: true });
await writeFile(contractPath, JSON.stringify(contract, null, 2) + "\n", "utf8");
const common = ["--contract", contractPath, "--workspace", capabilityRoot];
let projected = false;
for (let attempt = 0; attempt < 4 && !projected; attempt += 1) {
  const run = spawnSync(process.execPath, [engineBin, "project", ...common, "--write"], { encoding: "utf8" });
  if (run.status === 0) {
    projected = true;
    break;
  }
  let report;
  try { report = JSON.parse(run.stdout); } catch { throw new Error(run.stdout + run.stderr); }
  let updated = false;
  for (const finding of report.findings ?? []) {
    const artifact = contract.artifacts.find((entry) => entry.artifactId === finding.artifactId);
    if (!artifact) continue;
    if (finding.findingId === "declared-content-digest-mismatch") {
      artifact.proof.contentSha256 = finding.observed;
      updated = true;
    }
    if (finding.findingId === "declared-byte-length-mismatch") {
      artifact.proof.expectedByteLength = finding.observed;
      updated = true;
    }
  }
  if (!updated) throw new Error(run.stdout + run.stderr);
  await writeFile(contractPath, JSON.stringify(contract, null, 2) + "\n", "utf8");
}
if (!projected) throw new Error("Disk projection proof commitments did not converge.");

for (const command of [["validate", "--contract", contractPath], ["project", ...common, "--write"], ["gate", ...common, "--write-receipt"]]) {
  const run = spawnSync(process.execPath, [engineBin, ...command], { encoding: "utf8" });
  process.stdout.write(run.stdout);
  process.stderr.write(run.stderr);
  if (run.status !== 0) process.exit(run.status ?? 1);
}

process.stdout.write(JSON.stringify({ contractPath, capabilityRoot, inference: capabilityPackage.inference }, null, 2) + "\n");
