# Skill: Create Governed Artifact Contract for Executable-Body Projection

## Skill Identity

```yaml
skillId: create-governed-artifact-contract-for-executable-body-projection
version: 1.0.0
status: draft
category: deterministic-authority-authoring
```

## Purpose

Create one schema-valid governed artifact contract that admits the complete authority required to project one or more executable bodies without independently authored domain meaning in those bodies.

The skill transforms reviewed canonical intent, responsibility authority, executable-mechanic authority, projection authority, runtime bindings, artifact topology, and proof requirements into one complete governed artifact contract.

The skill does not invent missing business meaning. It fails closed or produces an explicit authority-completion work queue.

## Governing Outcome

```text
Canonical feature intent
    ↓
Scenario
    ↓
Obligation
    ↓
Responsibility
    ↓
Executable-mechanic authority
    ↓
Projection profile
    ↓
Projected artifact family
    ↓
Conformance and proof authority
    ↓
Governed artifact contract
```

The authoritative lineage is:

```text
project
→ feature
→ scenario
→ obligation
→ responsibility
→ artifact
```

## Use This Skill When

Use this skill when:

- a responsibility is ready to become projectable;
- observed execution mechanics have admitted authority counterparts;
- a new capability needs a governed executable-body artifact family;
- an existing handwritten body is being replaced by a projected body;
- a target runtime or language profile must be bound to canonical authority;
- a projected test body, runtime body, adapter body, schema, configuration file, or supporting artifact must enter one governed artifact family.

Do not use this skill merely to document existing files or preserve arbitrary current implementation.

## Required Inputs

### 1. Contract identity

```yaml
contractId: <stable identifier>
contractVersion: <semver>
status: admitted
```

### 2. Interpretation base

Exact admitted identities and SHA-256 digests for:

```yaml
engine:
schema:
conformanceProfile:
projectorRegistry:
verifierRegistry:
migrationRegistry:
```

### 3. Canonical subject

```yaml
subjectType:
subjectId:
purpose:
authority:
```

### 4. Workspace authority

```yaml
workspaceRoot:
artifactRoot:
governedScope:
pathExceptions:
```

Choose exactly one governed-scope posture:

```text
exclusive-artifact-subtree.v1
or
declared-artifact-scope.v1
```

### 5. Canonical lineage

Required chain:

```text
project
→ feature
→ scenario
→ obligation
→ responsibility
→ artifact
```

Each responsibility must identify:

```yaml
responsibilityId:
obligationId:
responsibilityType:
projectionProfileId:
artifactId:
```

### 6. Executable-body authority

For every projected executable body, provide:

- owned declaration;
- responsibility identity;
- semantic edges;
- admitted executable-mechanic authorities;
- decisions;
- iterations;
- failure policies;
- projection mappings;
- result contracts;
- forbidden syntax kinds;
- optional object-graph closure policy.

### 7. Artifact family

For every artifact:

```yaml
artifactId:
artifactKind:
purpose:
relativePath:
mediaType:
projection:
relationships:
proof:
```

Executable bodies should normally also include `sourceAuthority`.

### 8. Dependencies, effects, and runtime authority

Every external dependency, effect, and runtime invocation must be explicitly declared and bound to the artifacts that use it.

No ambient dependency, effect, runtime, or invocation may be inferred at projection time.

### 9. Projection ledger and receipt coordinates

```yaml
projectionLedger:
  relativePath:

receipt:
  relativePath:
```

These fields are required by the current schema even when durable proof is stored in SQL. Their paths must follow the selected runtime/materialization policy.

### 10. Conformance authority and claims

Provide:

- artifact evaluations;
- verifier identities;
- expected exit codes;
- expected output fragments;
- content digests;
- expected byte lengths;
- claim policies.

Allowed top-level claims:

```text
COMPLETE
CONTRACT_AUTHORITY_CLOSED
TRUSTED
```

Never emit a claim whose closure has not been established.

### 11. Design authority

```yaml
authorityType: conversation-design-authority.v1
conversationDigest:
decisions:
deviations:
tieOut:
```

Every accepted design decision must tie to the artifacts it governs.

## Preconditions

Before contract assembly, verify:

```text
1. Schema identity is exact and admitted.
2. Feature identity is admitted.
3. Scenario identity is admitted.
4. Every obligation belongs to exactly one scenario.
5. Every responsibility belongs to exactly one obligation.
6. Every responsibility binds to exactly one owned artifact.
7. Every included mechanic authority is admitted and current.
8. Every required semantic edge has explicit authority references.
9. Every dependency, effect, and runtime invocation is declared.
10. Every artifact has one projection authority.
11. Every artifact has exact proof requirements.
12. Every referenced artifact exists in the declared artifact family.
13. The target projection profile supports every required mechanic.
14. No current authority row is stale relative to its source or authority digest.
```

If any precondition fails, do not emit an admitted contract.

## Skill Workflow

### Step 1 — Resolve the canonical projection subject

Identify the exact project, feature, scenario, obligation, responsibility, and artifact subjects entering the contract.

Return:

```text
CANONICAL_PROJECTION_SUBJECT_RESOLVED
```

or an exact failure disposition.

### Step 2 — Resolve responsibility authority closure

For every responsibility:

- load admitted executable-mechanic authority;
- load decisions, iterations, failures, mappings, and results;
- load semantic edges;
- load required dependencies, effects, and runtime authorities;
- confirm target-profile support;
- confirm current authority digests.

Return `RESPONSIBILITY_AUTHORITY_CLOSED` only when nothing remains unresolved.

### Step 3 — Define artifact topology

Project the intended artifact family before writing contract JSON.

Reject duplicate paths, duplicate artifact IDs, orphan artifacts, and relationships to undeclared artifacts.

### Step 4 — Bind projection authority

For each artifact, select exactly one admitted projector and one authority payload.

Current schema-supported authority forms include:

```text
canonical-json-value.v1
utf8-text.v1
lossless-source-tokens.v1
governed-artifact-contract-markdown.v1
```

For executable-body projection, prefer declared semantic or token authority that reproduces the body deterministically. Do not hide domain meaning in raw text merely to satisfy the schema.

### Step 5 — Bind executable source authority

For each executable body, assemble:

```text
declarations
responsibilities
semanticEdges
mechanicAuthorities
decisions
iterations
failurePolicies
projectionMappings
resultContracts
forbiddenSyntaxKinds
```

The executable body must be a mechanical projection of this authority.

### Step 6 — Bind dependencies, effects, and runtime authorities

Every import and invocation must resolve to one of:

```text
dependency authority
effect authority
runtime authority
responsibility authority
projection authority
failure authority
result authority
```

### Step 7 — Bind proof and conformance

For every artifact:

- calculate expected content SHA-256;
- calculate expected byte length;
- select verifier IDs;
- add required schema or section checks;
- declare command evaluations when applicable.

Do not calculate expected artifact digests from a body that has not been deterministically projected from the assembled authority.

### Step 8 — Bind design authority

Record accepted decisions affecting capability boundary, artifact topology, projection profile, runtime profile, dependency policy, effect policy, proof posture, and deviations.

### Step 9 — Assemble the contract

Emit one object conforming to:

```text
https://canonical.local/schemas/governed-artifact-contract.schema.json
```

No undeclared properties are allowed.

### Step 10 — Validate structurally

Validate with JSON Schema Draft 2020-12 using strict, non-mutating validation:

```text
coerceTypes: false
useDefaults: false
removeAdditional: false
strict: true
validateSchema: true
```

### Step 11 — Validate semantic closure

Schema validity is necessary but insufficient. Also validate:

- lineage referential integrity;
- artifact relationship integrity;
- responsibility-to-artifact ownership;
- source-authority ownership;
- semantic-edge authority references;
- dependency/effect/runtime usage bindings;
- projection authority availability;
- target-profile support;
- proof completeness;
- claim eligibility;
- design-authority tie-out.

### Step 12 — Produce output or work queue

If complete:

```text
GOVERNED_ARTIFACT_CONTRACT_READY_FOR_ADMISSION
```

If incomplete, return an exact work queue. Do not emit an admitted contract with placeholders.

## Required Output

```yaml
resultType: governed-artifact-contract-authoring-result.v1
disposition:
contract:
validation:
closure:
workQueue:
```

### Successful disposition

```text
GOVERNED_ARTIFACT_CONTRACT_READY_FOR_ADMISSION
```

### Incomplete dispositions

```text
CANONICAL_LINEAGE_INCOMPLETE
RESPONSIBILITY_AUTHORITY_INCOMPLETE
MECHANIC_AUTHORITY_MISSING
MECHANIC_AUTHORITY_STALE
PROJECTION_PROFILE_UNSUPPORTED
ARTIFACT_TOPOLOGY_INCOMPLETE
ARTIFACT_RELATIONSHIP_INVALID
DEPENDENCY_AUTHORITY_INCOMPLETE
EFFECT_AUTHORITY_INCOMPLETE
RUNTIME_AUTHORITY_INCOMPLETE
PROOF_AUTHORITY_INCOMPLETE
DESIGN_AUTHORITY_INCOMPLETE
CLAIM_NOT_ELIGIBLE
CONTRACT_SCHEMA_INVALID
```

## Work-Queue Shape

```json
{
  "subjectId": "projects-runtime-compatibility-evaluator",
  "blockingDisposition": "RESPONSIBILITY_AUTHORITY_INCOMPLETE",
  "missing": [
    {
      "subjectType": "mechanic-authority",
      "subjectId": "validate-minimum-runtime-version",
      "requiredAction": "Admit validation authority for the minimum-version obligation."
    }
  ]
}
```

## Governing Rules

1. **No invented authority.** Organize, validate, and assemble admitted authority; never invent business rules, failure meaning, or expectations.
2. **No body-first authoring.** Begin with canonical lineage and authority, not handwritten code.
3. **One responsibility, one owned artifact.** Supporting call-graph closure may span other artifacts, but ownership remains explicit.
4. **Mechanics must be governed.** A projected body may not independently author forbidden mechanics absent from source authority.
5. **Projection is deterministic.** Same authority, projector, profile, and context must produce the same canonical bytes.
6. **Proof is not intent.** Passing tests and existing implementation are evidence, not automatically admitted authority.
7. **SQL may be the durable source.** Disk files are not required to be the durable authority source.
8. **Fail closed.** Unsupported shapes, unresolved references, stale digests, and incomplete proof block admission.

## Agent Operating Instructions

```text
1. Query current admitted feature/scenario lineage.
2. Query responsibility authority closure.
3. Query current mechanic-authority rows.
4. Query artifact topology and target-profile support.
5. Assemble the contract only from current admitted inputs.
6. Validate schema and semantic closure.
7. Return the contract or an exact work queue.
8. Never fill missing semantic fields from intuition.
9. Never use grep or broad file inspection when equivalent SourceFacts queries exist.
10. Never claim COMPLETE, CONTRACT_AUTHORITY_CLOSED, or TRUSTED unless closure queries pass.
```

## Minimal Example Subject

```text
Capability:
Evaluate system runtime compatibility

Feature:
Determine whether a system supports a declared runtime profile

Scenario:
Accept a system satisfying every required runtime condition

Obligation:
Every required runtime condition is satisfied

Responsibility:
Evaluates system runtime compatibility

Artifact:
src/evaluates-system-runtime-compatibility.ts
```

The contract should bind runtime-profile authority, validation mechanic authority, result projection authority, one clean executable body projection, input/result contracts, any required CLI or container adapter, canonical proof vectors, runtime/dependency authority, artifact digests, and conformance evaluations.

## Completion Test

```text
Admitted SQL authority
    ↓
skill creates governed artifact contract
    ↓
contract validates
    ↓
contract is persisted and reconstructed from SQL
    ↓
empty workspace is projected
    ↓
executable bodies are produced
    ↓
canonical tests execute
    ↓
artifact family conforms
```

No manually authored domain mechanics may be required after contract admission.
