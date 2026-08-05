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
scripts/sql/009-create-enterprise-subject-registry.sql
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

# ###################################################################################

Exactly. **The enterprise model cannot stop at project → feature → scenario.** That lineage is necessary, but it needs a larger contextual spine so every artifact, feature, test, call graph, and proof can be sliced by the enterprise boundary that matters.

Your current contract already gives you a strong local lineage:

```text
project
→ feature
→ scenario
→ obligation
→ responsibility
→ artifact
```

and it already carries subject, workspace, dependencies, effects, runtime authorities, design authority, projection authority, and proof. 

Now it needs an enterprise context layer above and alongside that lineage.

# The enterprise hierarchy

I would establish this as the primary organizing spine:

```text
Enterprise
  ↓
Business domain
  ↓
Application / product
  ↓
Capability
  ↓
Feature
  ↓
Scenario
  ↓
Obligation
  ↓
Responsibility
  ↓
Artifact
```

But do **not** assume one rigid tree can represent every useful view.

Some classifications are hierarchical:

```text
enterprise
→ domain
→ application
→ feature
```

Others are cross-cutting dimensions:

```text
data domain
security zone
deployment environment
technology stack
business owner
repository
release
regulatory boundary
customer journey
operating region
```

So the right SQL and schema model is:

> **One canonical lineage spine plus multiple typed classification dimensions.**

# Recommended enterprise context model

Add a top-level context authority concept, either inside `lineage` or as a sibling to it:

```json
{
  "enterpriseContext": {
    "enterpriseId": "deterministic-solutions",
    "portfolioId": "engineering-intelligence",
    "domainId": "software-governance",
    "applicationId": "source-facts-semantic-search-engine",
    "capabilityIds": [
      "source-fact-querying",
      "cli-execution-graph-analysis",
      "feature-lineage-governance"
    ],
    "repositoryIds": [
      "source-facts-semantic-search-engine"
    ],
    "contextTags": [
      {
        "dimension": "technology",
        "value": "node"
      },
      {
        "dimension": "data-platform",
        "value": "sql-server"
      }
    ]
  }
}
```

The exact field names can change, but the distinctions should stay explicit.

# Do not overload `projectId`

Right now, `canonicalLineage.projectId` is useful, but it should not be forced to mean all of these at once:

```text
enterprise portfolio
business domain
application
repository
deployment
product
project
```

Those are different identities.

A clean model would separate:

```text
EnterpriseId
PortfolioId
DomainId
ApplicationId
ProductId
ProjectId
RepositoryId
WorkspaceId
```

Not every contract needs every level populated, but each identity must mean exactly one thing.

# Core dimensions to support

## Organizational

```text
enterprise
business unit
portfolio
program
team
owner
```

## Business meaning

```text
business domain
subdomain
business capability
customer journey
business process
```

## Software

```text
application
product
service
component
repository
package
workspace
```

## Execution

```text
interface
CLI command
API route
scheduled job
event consumer
runtime
environment
deployment
```

## Data

```text
data domain
dataset
entity
schema
database
data product
```

## Governance

```text
authority owner
regulatory scope
security classification
risk tier
lifecycle
admission status
```

These should be queryable dimensions, not buried in free text.

# SQL model

I would create a generic enterprise subject model plus typed tables.

```text
enterprise.Subject
enterprise.SubjectType
enterprise.SubjectRelationship
enterprise.SubjectClassification
enterprise.ClassificationDimension
```

Then strongly typed projections:

```text
enterprise.Application
enterprise.Domain
enterprise.Capability
enterprise.Repository
enterprise.Environment
enterprise.Team
```

Conceptually:

```sql
enterprise.Subject
------------------
SubjectId
SubjectType
CanonicalName
Lifecycle
AuthorityDigest

enterprise.SubjectRelationship
------------------------------
RelationshipId
FromSubjectId
RelationshipType
ToSubjectId
AuthorityDigest

enterprise.SubjectClassification
--------------------------------
SubjectId
DimensionId
ClassificationValueId
AuthorityDigest
```

This supports both trees and cross-cutting views.

# Relationship examples

```text
application belongs-to domain
application contains capability
repository implements application
feature realizes capability
scenario belongs-to feature
responsibility implements obligation
artifact embodies responsibility
test proves scenario
CLI command exposes capability
dataset supports application
team owns capability
deployment runs application
```

Do not encode all of those as generic text. Use governed relationship types.

# Enterprise queries this unlocks

```sql
Which features belong to this application?
```

```sql
Which tests prove capabilities in the healthcare domain?
```

```sql
Which CLI commands expose governance capabilities?
```

```sql
Which repositories implement the same responsibility?
```

```sql
Which applications have feature scenarios without tests?
```

```sql
Which domains contain executable mechanics without canonical authority?
```

```sql
Which shared capabilities are duplicated across applications?
```

```sql
Which artifacts are reachable from no admitted interface in this portfolio?
```

That is where this becomes enterprise engineering intelligence rather than repository reporting.

# Application boundary must be explicit

Every durable observation should carry or resolve to:

```text
EnterpriseId
ApplicationId
RepositoryId
RevisionId
ScanId
```

Then feature and execution facts inherit the context through foreign keys.

For example:

```text
Application
→ RepositoryRevision
→ Scan
→ CLICommand
→ Callable
→ SourceFact
```

and:

```text
Application
→ Feature
→ Scenario
→ Responsibility
→ Test
```

This lets the same feature ID pattern exist in different applications without accidental collision.

# Identity strategy

Use globally stable IDs, not names alone.

```text
application:source-facts-semantic-search-engine
domain:software-governance
capability:cli-execution-graph-analysis
feature:source-facts.cli-call-graph
```

The physical database key may be surrogate, but the canonical identity should remain durable and content-addressable where appropriate.

A useful pattern:

```text
SubjectKey          internal SQL key
CanonicalId         stable semantic identity
AuthorityDigest     exact current authority
SnapshotId          historical version
```

# History and upstream flow

When you say “drive the data upstream,” the flow should be:

```text
repository observations
    ↓
application-level model
    ↓
domain-level aggregation
    ↓
portfolio-level intelligence
    ↓
enterprise authority registry
```

Not direct uncontrolled writes from repositories into enterprise truth.

Use governed promotion:

```text
observed locally
→ reconciled to application
→ classified into domain
→ admitted upstream
```

Each promotion should retain:

* source repository;
* revision;
* scan;
* authority digest;
* application context;
* classification disposition;
* promotion receipt.

# Keep authority and analytics separate

The enterprise database should hold:

```text
canonical authority snapshots
observed facts
derived relationships
analytics projections
```

but those should not be indistinguishable.

Suggested schemas:

```text
authority
enterprise
lineage
observation
execution
test
proof
analytics
```

Then:

```text
authority = what is admitted
observation = what was found
analytics = what was derived
```

# What to add to the governed artifact schema

The current schema should gain a compact enterprise-context reference, not a giant embedded enterprise ontology.

For example:

```json
{
  "enterpriseContext": {
    "enterpriseId": "deterministic-solutions",
    "domainId": "software-governance",
    "applicationId": "source-facts-semantic-search-engine",
    "repositoryId": "source-facts-semantic-search-engine",
    "capabilityIds": [
      "feature-lineage-governance"
    ],
    "contextAuthorityId": "source-facts-enterprise-context.v1"
  }
}
```

The detailed domain/application relationships can live in a separate enterprise authority registry.

That prevents every artifact contract from duplicating the enterprise taxonomy.

# The right architectural shape

```text
Enterprise Canonical Authority
        ↓
Domain and application context
        ↓
Governed artifact contract
        ↓
Feature / scenario lineage
        ↓
Execution graph
        ↓
Tests and proof
        ↓
Observed application state
        ↓
Enterprise analytics
```

So yes—keep application, domain, capability, repository, environment, and ownership in the model from the start.

The repository-level schema is already strong enough to govern an artifact family. The next expansion is to make each contract a **context-bound slice of an enterprise authority graph**, so the same facts can be analyzed locally, by application, by domain, by portfolio, or across the entire enterprise without changing their meaning.
