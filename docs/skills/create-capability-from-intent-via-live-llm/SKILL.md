---
name: create-capability-from-intent-via-live-llm
description: Turn confirmed natural-language feature intent into a real executable capability through a live LLM, deterministic curation, admitted semantic authority, governance-engine projection, behavioral proof, and a TRUSTED receipt. Use when asked to add, generate, or extend a capability without hand-authoring target implementation files, especially in runtime-capability-evaluator or another contract-driven projected workspace.
---

# Create a capability from intent through a live LLM

Produce this chain:

```text
confirmed intent
  -> live model candidate
  -> deterministic validation and curation
  -> admitted governed contract
  -> projector-only target mutation
  -> executable verification
  -> clean reprojection
  -> TRUSTED receipt
```

Treat the live model output as a candidate, never as admitted authority. Treat generated stubs and passing wiring tests as insufficient. Call the result real only after the governance engine projects the complete artifact family and its gate returns `TRUSTED`.

## Non-negotiable rules

1. Never hand-author, patch, or repair a projected target artifact.
2. Author only intent, curation/admission authority, and deterministic compiler/projector tooling outside the target projection scope.
3. Use the governance engine as the sole writer of target bundles, bodies, verifiers, commands, ledgers, and receipts.
4. Preserve live-inference request/response hashes, provider, resolved model, invocation ID, and curation findings.
5. Reject invalid model output. Feed exact deterministic findings back to the live model and require a complete corrected candidate.
6. Do not invent unresolved business meaning. Ask one focused semantic question or explicitly exclude/defer the unresolved policy.
7. Use a fresh exclusive capability subtree unless a broader admitted contract explicitly owns integration into an existing scope.
8. Require clean reprojection, behavioral execution, structured invalid-input behavior, and a trust gate before reporting completion.

## Step 1: Read the current lifecycle state

Inspect existing feature intent, admitted contracts, projection receipts, semantic bundles, and executable state. Identify the highest-impact unresolved semantic responsibility.

Do not ask a generic question such as "What should we work on?" Propose one concrete next capability and one default rule. Example:

```text
The next unprojected requirement is minimum disk capacity.
Suggested rule: availableDiskMb >= requiredDiskMb is compatible; below is
incompatible and reports both values; negative/non-integer values produce
structured findings. Filesystem probing and unit conversion stay outside.
Should I run that through the live LLM -> contract -> projection -> gate flow?
```

Wait for confirmation when the choice changes domain semantics.

## Step 2: Capture confirmed intent

Write a natural-language intent document. State:

- purpose and inputs;
- observable compatible, incompatible, and invalid outcomes;
- equality/boundary behavior;
- configuration versus hard-coded policy;
- determinism and side-effect posture;
- output facts that must be reported;
- required behavioral proofs;
- explicit exclusions.

The intent document is authority input, not a projected executable artifact.

## Step 3: Invoke the live model

From `source-facts-semantic-search-engine`, run:

```powershell
node src/cli.js draft-capability `
  --intent-file <absolute-intent-path> `
  --feature-id <stable-feature-id> `
  --output <new-absolute-evidence-directory>
```

Use a new evidence directory. Do not overwrite an earlier live run; evidence is immutable.

Require the package to identify:

- feature, scenarios, obligations, and responsibilities;
- unique body and semantic-edge identities;
- input/output fields;
- dependencies, effects, and failure semantics;
- proof expectations and open questions;
- live inference provenance.

## Step 4: Curate fail-closed

Run deterministic candidate validation. At minimum reject:

- changed feature identity;
- duplicate scenario, obligation, responsibility, body, or edge identities;
- invalid JavaScript identifiers;
- missing observable scenarios;
- malformed input/output fields;
- claims of admission, proof, or release readiness.

On failure, make another live request containing the exact findings and rejected candidate. Require a corrected complete blueprint, not an explanation. Authorize at most three curation attempts per run.

Persist every attempt with its findings and inference receipt. A failed first candidate followed by a valid second candidate is useful proof that deterministic governance, not model confidence, controls admission.

## Step 5: Resolve semantic authority

Compare the valid candidate with confirmed intent and available runtime primitives.

- Apply rules already explicit in user-confirmed intent.
- Exclude policies explicitly placed outside the capability.
- Defer open questions that do not block the admitted slice.
- Stop and ask one focused question when an unresolved choice would materially change behavior.
- Never convert a draft skeleton directly into admitted executable files.

Record accepted, modified, excluded, and deferred decisions in design authority and tie every accepted decision to its governed artifacts.

## Step 6: Compile the governed contract

Build the admitted contract outside the target capability subtree. Use an existing admitted contract as a structural template only when its semantic pattern genuinely matches. Transform identities and authority structurally; do not perform blind text substitution.

The contract must bind:

- exact live-inference request and response hashes;
- canonical lineage from feature through artifact;
- bounded input schemas and structured invalid-input behavior;
- deterministic ontology authority and execution graph;
- result projection, including required observed and expected values;
- thin executable body authority;
- verifier and command authority;
- dependencies, effects, and runtime invocations;
- proof digests and byte lengths;
- design decisions, deviations, exclusions, and tie-out;
- exclusive workspace scope, ledger, receipt, and conformance evaluation.

If the runtime cannot express confirmed meaning, extend the governance engine as a separately tested primitive or closure rule. Do not bury the missing behavior in a target body.

Reference implementations in this repository:

- `scripts/project-live-memory-capability.mjs`
- `scripts/project-live-disk-capability.mjs`
- `contracts/evaluate-minimum-memory-compatibility.contract.json`
- `contracts/evaluate-minimum-disk-compatibility.contract.json`

## Step 7: Project through the governance engine

Use the sibling governance engine CLI:

```powershell
node <engine>/bin/governed-artifacts.mjs validate `
  --contract <contract> 

node <engine>/bin/governed-artifacts.mjs project `
  --contract <contract> `
  --workspace <exclusive-capability-root> `
  --write

node <engine>/bin/governed-artifacts.mjs gate `
  --contract <contract> `
  --workspace <exclusive-capability-root> `
  --write-receipt
```

Close proof commitments from deterministic projected bytes, then rerun validation and projection. Never obtain digests from manually authored target files.

Inherited path exceptions must match the actual isolated workspace. Remove irrelevant `.git` or `node_modules` exceptions from the new contract rather than weakening inventory closure.

## Step 8: Exercise behavior

Execute the projected verifier and direct probes for:

- equality at the boundary;
- value above the minimum;
- value below the minimum;
- negative input;
- non-integer input.

Check exact dispositions and required output facts. Invalid input must fail with structured field-level findings, not silently become compatible or incompatible.

## Step 9: Prove replay

Run projection in check mode:

```powershell
node <engine>/bin/governed-artifacts.mjs project `
  --contract <contract> `
  --workspace <exclusive-capability-root> `
  --check
```

Require every declared artifact and the projection ledger to report `CONFORMS`. Re-run the trust gate after any authority, runtime, verifier, or proof change.

Also run focused tests for live-candidate validation/curation and any governance-engine extension. Report unrelated release-seal drift separately; never hide it behind the capability's local trust result.

## Completion criteria

Report success only when all are true:

```text
live model provenance captured
curation findings preserved
contract valid
projector is sole target writer
projected verifier passes
boundary and invalid probes pass
clean reprojection conforms
receipt trustDisposition == TRUSTED
receipt trustPosture == CONFORMS
```

State explicitly when the capability is isolated but not yet composed into a parent evaluator or published in a newly sealed engine release.

## Handoff

Return clickable paths to:

- immutable live evidence package;
- admitted contract;
- deterministic projection compiler;
- projected semantic bundle;
- projected executable body;
- projected verifier;
- TRUSTED receipt.

Include the live provider/model and request/response hashes, a compact behavior table, replay status, and every remaining boundary. Do not call draft stubs, identity-only wiring tests, or hand-authored target code a real capability.
