Yes — and this confirms something important:

> **Your governed artifact contract already contains the canonical lineage spine.**

You do **not** need to invent another conceptual model before loading SQL. You already have:

```text
project
→ feature
→ scenario
→ obligation
→ responsibility
→ artifact
```

inside `lineage`, and the schema requires that lineage as part of every admitted governed artifact contract. 

The move now is to **relationalize this contract faithfully**, then add observed execution/test facts beside it rather than stuffing more report logic into JavaScript.

# What the schema already gives us

## Canonical lineage authority

The `canonicalLineage` definition already provides:

* `projectId`
* feature records
* scenario records
* obligation records
* responsibility records
* responsibility-to-artifact bindings
* projection profile identities 

The exact chain is encoded through foreign identifiers:

```text
Feature.projectId
Scenario.featureId
Obligation.scenarioId
Responsibility.obligationId
Responsibility.artifactId
```

That is the SQL lineage spine.

## Artifact family authority

Each artifact already has:

* identity;
* kind;
* purpose;
* relative path;
* media type;
* projection authority;
* relationships;
* proof requirements;
* optional source authority. 

So SQL can connect canonical responsibility directly to the governed artifact representing it.

## Source authority

The schema already supports implementation-level declarations through `sourceAuthority`, including:

* declarations;
* responsibilities;
* semantic edges;
* decisions;
* iterations;
* failure policies;
* projection mappings;
* result contracts;
* forbidden syntax kinds. 

This is crucial because it means the contract can describe the intended implementation boundary without polluting canonical lineage.

## Proof and conformance

The artifact contract already provides:

* verifier IDs;
* expected content hash;
* expected byte length;
* artifact evaluations;
* expected exit codes;
* expected output fragments;
* claims. 

That gives us declared proof authority, though not yet observed test-run testimony.

# The key separation for SQL

The database should preserve four different truth planes.

```text
1. Canonical authority
2. Declared implementation authority
3. Observed execution and source facts
4. Observed proof and test execution
```

Do not flatten those together.

## Plane 1 — Canonical authority

Loaded from:

```text
contract
subject
lineage
designAuthority
```

These rows answer:

```text
What is admitted?
Why does it exist?
Which feature owns it?
Which scenario owns the obligation?
Which responsibility owns the artifact?
```

## Plane 2 — Declared implementation authority

Loaded from:

```text
artifacts
sourceAuthority
projection
relationships
dependencies
effects
runtimeAuthorities
conformance
```

These rows answer:

```text
What implementation structure is authorized?
Which declarations and semantic edges should exist?
Which projector and authority produce the artifact?
Which verifier is expected?
```

## Plane 3 — Observed source and execution

Loaded from SourceFacts and call-graph outputs:

```text
observed files
observed symbols
observed callables
observed invocation edges
observed mechanics
CLI command roots
root-to-callable paths
resolution dispositions
```

These rows answer:

```text
What actually exists?
What does the CLI reach?
What is outside interface reachability?
```

## Plane 4 — Observed tests and proof

Loaded from test indexing and execution receipts:

```text
test cases
test-to-production reachability
assertions
fixtures
test executions
observed signals
scenario proof receipts
```

These rows answer:

```text
Which test exercises this feature?
Did the test run?
Did its assertions prove the canonical expectation?
```

# Recommended SQL projection of this schema

## Contract tables

```text
authority.GovernedArtifactContract
authority.Subject
authority.Workspace
authority.InterpretationBase
authority.DesignAuthority
authority.DesignDecision
authority.DesignDeviation
authority.DesignTieOut
```

## Canonical lineage tables

```text
lineage.Project
lineage.Feature
lineage.Scenario
lineage.Obligation
lineage.Responsibility
lineage.ResponsibilityArtifact
```

Suggested columns:

```sql
lineage.Feature
---------------
ContractSnapshotId
FeatureId
ProjectId
Purpose
AuthorityDigest
LifecycleStatus

lineage.Scenario
----------------
ContractSnapshotId
ScenarioId
FeatureId
Purpose
AuthorityDigest

lineage.Obligation
------------------
ContractSnapshotId
ObligationId
ScenarioId
Statement
AuthorityDigest

lineage.Responsibility
----------------------
ContractSnapshotId
ResponsibilityId
ObligationId
ResponsibilityType
ProjectionProfileId
ArtifactId
AuthorityDigest
```

The schema already defines all of those identities. 

# Artifact and implementation tables

```text
artifact.Artifact
artifact.ArtifactRelationship
artifact.ProjectionAuthority
artifact.ProofRequirement
artifact.Dependency
artifact.Effect
artifact.RuntimeAuthority
```

Then source authority:

```text
implementation.SourceAuthority
implementation.Declaration
implementation.ResponsibilityDeclaration
implementation.SemanticEdge
implementation.DecisionAuthority
implementation.IterationAuthority
implementation.FailurePolicy
implementation.ProjectionMapping
implementation.ProjectionField
implementation.ResultContract
implementation.ForbiddenSyntaxKind
```

# Where the call graph belongs

The call graph is **observed execution topology**, not part of canonical lineage and not directly part of `sourceAuthority`.

Store it separately:

```text
observation.CliCommand
observation.CliCommandHandler
observation.Callable
observation.InvocationEdge
observation.CommandReachability
observation.RootPathWitness
observation.EdgeResolution
```

Then bind it back to governed responsibilities:

```text
binding.ResponsibilityImplementationRoot
binding.ResponsibilityCommand
binding.ResponsibilityCallable
```

That gives this query chain:

```text
lineage.Feature
→ lineage.Scenario
→ lineage.Obligation
→ lineage.Responsibility
→ binding.ResponsibilityImplementationRoot
→ observation.CommandReachability
→ observation.Callable
```

# Where tests belong

The current schema does not appear to contain a first-class test-case registry or scenario-test binding model.

It has declared artifact evaluations, but those are command-level verifier instructions:

```text
command
expectedExitCode
expectedStdoutContains
```

That is not enough to represent:

```text
feature
→ scenario
→ test case
→ production graph
→ observed assertion
→ proof receipt
```

So SQL needs an observational test plane outside the governed artifact contract:

```text
test.TestFile
test.TestSuite
test.TestCase
test.TestProductionReachability
test.TestAssertion
test.TestFixture
test.ScenarioTestBinding
test.TestExecution
```

Later, an admitted test-lineage contract may govern those bindings, but the observed test facts should still remain separate.

# First query: Does this feature have a test?

Once loaded, the query becomes simple:

```sql
SELECT
    f.FeatureId,
    s.ScenarioId,
    o.ObligationId,
    r.ResponsibilityId,
    COUNT(DISTINCT stb.TestId) AS LinkedTestCount,
    CASE
        WHEN COUNT(DISTINCT stb.TestId) = 0
            THEN 'FEATURE_TEST_MISSING'
        ELSE 'FEATURE_TEST_MAPPED'
    END AS TestLineageDisposition
FROM lineage.Feature f
JOIN lineage.Scenario s
  ON s.FeatureId = f.FeatureId
 AND s.ContractSnapshotId = f.ContractSnapshotId
JOIN lineage.Obligation o
  ON o.ScenarioId = s.ScenarioId
 AND o.ContractSnapshotId = s.ContractSnapshotId
JOIN lineage.Responsibility r
  ON r.ObligationId = o.ObligationId
 AND r.ContractSnapshotId = o.ContractSnapshotId
LEFT JOIN test.ScenarioTestBinding stb
  ON stb.ScenarioId = s.ScenarioId
 AND stb.ResponsibilityId = r.ResponsibilityId
WHERE f.FeatureId = @FeatureId
GROUP BY
    f.FeatureId,
    s.ScenarioId,
    o.ObligationId,
    r.ResponsibilityId;
```

# Second query: Feature, call graph, and test

```sql
SELECT
    f.FeatureId,
    s.ScenarioId,
    o.ObligationId,
    r.ResponsibilityId,

    command.CommandId,
    handler.HandlerSymbolId,

    reach.CallableId,
    callable.ModulePath,
    callable.SymbolName,
    reach.Depth,
    reach.PathWitnessId,

    testCase.TestId,
    testCase.TestName,
    testCase.TestFilePath,

    binding.BindingDisposition,
    execution.ExecutionDisposition,
    proof.ProofDisposition
FROM lineage.Feature f
JOIN lineage.Scenario s
  ON s.FeatureId = f.FeatureId
JOIN lineage.Obligation o
  ON o.ScenarioId = s.ScenarioId
JOIN lineage.Responsibility r
  ON r.ObligationId = o.ObligationId

LEFT JOIN binding.ResponsibilityCommand rc
  ON rc.ResponsibilityId = r.ResponsibilityId
LEFT JOIN observation.CliCommand command
  ON command.CommandId = rc.CommandId
LEFT JOIN observation.CliCommandHandler handler
  ON handler.CommandId = command.CommandId
LEFT JOIN binding.ResponsibilityCallable reach
  ON reach.ResponsibilityId = r.ResponsibilityId
LEFT JOIN observation.Callable callable
  ON callable.CallableId = reach.CallableId

LEFT JOIN test.ScenarioTestBinding binding
  ON binding.ScenarioId = s.ScenarioId
 AND binding.ResponsibilityId = r.ResponsibilityId
LEFT JOIN test.TestCase testCase
  ON testCase.TestId = binding.TestId
LEFT JOIN test.TestExecution execution
  ON execution.TestId = testCase.TestId
LEFT JOIN proof.ScenarioProof proof
  ON proof.ScenarioId = s.ScenarioId
 AND proof.TestId = testCase.TestId

WHERE f.FeatureId = @FeatureId
ORDER BY
    s.ScenarioId,
    reach.Depth,
    callable.ModulePath,
    callable.SymbolName,
    testCase.TestName;
```

That is the query you have been asking for.

# One important schema observation

The current canonical lineage supports:

```text
one responsibility
→ one artifact
```

through required `artifactId`.

That is strong for body ownership.

But a responsibility’s current implementation may involve:

* one root artifact;
* several root symbols;
* many supporting callables;
* shared infrastructure.

Do not overload the lineage `artifactId` to list the whole graph.

Use it as the governed ownership artifact, then derive and persist the graph through bindings:

```text
canonical responsibility
→ owned artifact
→ implementation roots
→ observed supporting closure
```

# Another important observation

`designAuthority` is now required and binds conversation decisions, deviations, and artifact tie-outs. 

That should also be durably backed, but it should not be mixed into feature runtime analytics.

Keep it queryable as a separate provenance plane:

```sql
SELECT
    decision.DecisionId,
    decision.Statement,
    decision.Disposition,
    tie.ArtifactId
FROM authority.DesignDecision decision
LEFT JOIN authority.DesignTieOut tie
  ON tie.DecisionId = decision.DecisionId
WHERE decision.ContractSnapshotId = @ContractSnapshotId;
```

That gives you design traceability without contaminating execution truth.

# What to freeze now

Freeze additions to the schema unless a missing durable concept blocks ingestion.

The current schema already gives enough authority structure to start.

The immediate work is:

```text
1. Load governed artifact contracts.
2. Normalize canonical lineage into SQL.
3. Load Gherkin features and anchors.
4. Reconcile Gherkin IDs with canonical lineage IDs.
5. Load CLI command graphs.
6. Bind responsibilities to implementation roots.
7. Load test inventory.
8. bind tests to scenarios and responsibilities.
9. expose feature closure queries.
10. prove database results match the current report.
```

# Bottom line

This schema is not an obstacle.

It is already the foundation.

```text
Governed artifact contract
    = admitted authority snapshot

SQL Server
    = durable relational projection of that authority
      plus observed source, execution, and proof facts

Queries
    = current engineering truth

Reports
    = optional projections of query results
```

The only major missing durable domain for the immediate objective is a **first-class test-lineage and test-execution model**.

Everything else needed to connect:

```text
feature
→ scenario
→ obligation
→ responsibility
→ artifact
→ implementation graph
```

is already represented in this governed artifact schema.

# Implemented SQL vertical slice

The repository now implements the first durable projection of these planes:

```text
governed artifact contract
  -> authority.ContractSnapshot
  -> artifact.Artifact
  -> lineage.Project / Feature / Scenario / Obligation / Responsibility

self-governance report
  -> observation.ObservationSnapshot
  -> observation.CliCommand / Callable / CommandReachability
  -> test.TestCase / TestProductionReachability

explicit reconciliation
  -> binding.ResponsibilityCommand / ResponsibilityCallable
  -> test.ScenarioTestBinding
  -> proof.ScenarioProof
```

The SQL deployment is defined by:

```text
scripts/sql/001-create-schemas.sql
scripts/sql/006-create-engineering-truth-tables.sql
scripts/sql/007-load-engineering-truth.sql
scripts/sql/008-create-engineering-truth-views.sql
```

The load command is:

```powershell
node src/cli.js load-engineering-truth `
  --contract ./contracts/serves-query-console.governed.contract.json `
  --intent-dir ./features `
  --report ./artifacts/governance/source-facts-self-governance-report.json `
  --connection-env source-facts-semantic-search-engine `
  --summary
```

Two ready-to-query views expose the initial outcomes:

```sql
SELECT *
FROM reporting.FeatureTestDisposition
WHERE FeatureId = @FeatureId;

SELECT *
FROM reporting.FeatureEngineeringClosure
WHERE FeatureId = @FeatureId
ORDER BY ScenarioId, ResponsibilityId, Depth, ModulePath, SymbolName;
```

Snapshots use content-derived identities, so authority and observation versions
remain distinct. Cross-plane rows are inserted only when both referenced identities
exist. Owned-artifact path matches may establish observed implementation roots, but
they remain explicitly classified bindings rather than canonical authority.

The repository load uses two independent authority snapshots: the governed console
contract contributes three scenarios, and the canonical feature-intent registry
contributes six more. Intent responsibilities deliberately retain nullable artifact
ownership and obligation statements because that format does not declare either;
their lifecycle remains `FEATURE_INTENT_PROPOSED`. This produces nine distinct
repository scenarios without silently promoting proposed intent or inventing
governed artifacts.
