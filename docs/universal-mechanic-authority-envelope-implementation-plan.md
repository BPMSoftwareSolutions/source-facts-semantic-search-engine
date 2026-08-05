# Universal Mechanic Authority Envelope: Deterministic Implementation Plan

Status: research complete; implementation not started

Plan date: 2026-08-05

Primary proposal: [universal-mechanic-authority-envelope.md](./universal-mechanic-authority-envelope.md)

Canonical contract under change:
C:\lab\repos\contract-driven-artifact-governance-engine\schemas\governed-artifact-contract.schema.json

## 1. Decision

The envelope is implementable, but it is not one schema edit. It is a
coordinated evolution across observation, authority, SQL, target projection, and
proof.

The governing circuit is:

~~~text
observed source mechanics
  -> canonical mechanic authority
  -> durable SQL representation
  -> complete enterprise context
  -> target language and runtime profile
  -> projected execution body
  -> equivalence proof
~~~

SQL becomes the durable execution-authority substrate. It does not become a
semantic inference engine. Source observation remains non-authoritative;
generated authority data remains a candidate until reviewed and admitted.

The projection hard gate is:

> No body projection until the SQL authority slice is closed, unambiguous,
> current, and sufficient for the selected target projection profile.

There is a second, equally important boundary:

> Authority projection is a native query behavior, not a reporting workflow and
> not a proof workflow.

The initial mechanic-authority projection must execute as one parameterized
database query whose result set contains the projected authority data. It must
not require receipt generation, report rendering, companion artifacts, workflow
orchestration, a projection-run object, or additional persistence beyond the
durable source-fact and authority model.

~~~mermaid
flowchart LR
    A["Observed mechanic facts"] --> B["Native authority-projection query"]
    B --> C["Authority-data rows"]
    C --> D["Human semantic completion and review"]
    D --> E["Admitted authority in contract and SQL"]
    E --> F["Closed responsibility authority query"]
    F --> G["Target language projector"]
    G --> H["Projected body"]
    H --> I["Equivalence proof"]
~~~

The query at B is deliberately inexpensive:

~~~text
SELECT
  -> rows
  -> done
~~~

Persistence, body projection, and proof consume its results later. They do not
complicate that query.

## 2. Scope

### In scope

- Standard candidate authority-data shapes for all 12 mechanic kinds.
- One native query returning authority projections for observed mechanics.
- One responsibility-level query assembling admitted execution authority.
- A strict universal envelope in the governed artifact contract.
- Exact SourceFacts occurrence-to-authority binding.
- Contract, engine profile, and SQL migrations.
- A target-profile registry with explicit unsupported dispositions.
- A first TypeScript projection path.
- Behavioral equivalence evaluation for the projected body.
- An exact inventory of source bodies and artifacts affected on disk.

### Out of scope for the initial authority-projection query

- Authority admission or mutation.
- Report generation.
- Receipt generation.
- Markdown or companion-file generation.
- Contract migration.
- Target-projector execution.
- Behavioral equivalence evaluation.
- Promotion of authority or source.

### Out of scope for the first body-projection profile

- Automatically admitting inferred business meaning.
- Generating arbitrary direct TypeScript control flow for all 12 mechanics.
- Treating line overlap as authority identity.
- Claiming retry, external state mutation, arbitrary exception boundaries, or
  arbitrary text templating are projectable before their runtime primitives and
  effect contracts exist.
- Retiring the existing decisions, iterations, failurePolicies,
  projectionMappings, and resultContracts arrays in the same release.

## 3. Canonical feature write-up

The IDs below are durable keys, not documentation labels. Copy them unchanged
into canonicalLineage, SQL, candidate rows, admitted envelopes, target
projection requests, generated source headers, tests, and proof records.

~~~gherkin
&feature:source-facts.project-authority-from-execution-mechanics
Feature: Project authority data from observed execution mechanics

  As an authority engineer
  I need observed execution mechanics projected into canonical authority-data shapes
  So that authority can be completed, stored, queried, and used to project execution bodies

  &scenario:source-facts.classify-mechanic-authority-family
  &responsibility:classifies-execution-mechanic-authority-family
  &obligation:every-observed-mechanic-has-one-authority-family
  Scenario: Classify the authority family for one observed execution mechanic
    Given one observed execution mechanic
    When its authority family is classified
    Then one canonical authority family or explicit unsupported disposition is returned

  &scenario:source-facts.project-mechanic-authority-data
  &responsibility:projects-execution-mechanic-authority-data
  &obligation:every-classified-mechanic-produces-one-authority-data-result
  Scenario: Project authority data for one classified execution mechanic
    Given one classified execution mechanic and its available context
    When authority data is projected
    Then one standard authority-data result is returned
    And every unavailable semantic value is named in MissingFields
    And the result is not admitted automatically

  &scenario:source-facts.query-mechanic-authority-projections
  &responsibility:queries-execution-mechanic-authority-projections
  &obligation:authority-data-is-returned-as-native-query-results
  Scenario: Query authority projections for observed execution mechanics
    Given observed execution mechanics exist for a declared scope
    When their authority projections are queried
    Then matching authority-data rows are returned directly
    And no report receipt sidecar file or second command is required

  &scenario:source-facts.persist-projected-mechanic-authority
  &responsibility:persists-projected-execution-mechanic-authority
  &obligation:every-admitted-authority-has-a-durable-relational-home
  Scenario: Persist reviewed mechanic authority data
    Given a reviewed schema-valid mechanic authority envelope
    When the authority is admitted and loaded
    Then it is stored under its canonical lineage and authority family
    And the original mechanic occurrence remains queryably connected to it

  &scenario:source-facts.query-complete-responsibility-authority
  &responsibility:queries-complete-responsibility-authority
  &obligation:one-query-returns-all-authority-required-to-project-a-responsibility
  Scenario: Query the complete authority for one responsibility
    Given every applicable mechanic owned by a responsibility has admitted authority data
    When the responsibility projection is queried
    Then one complete ordered execution-authority result is returned
    And no unresolved mechanic remains in the responsibility

  &scenario:source-facts.project-body-from-responsibility-authority
  &responsibility:projects-execution-body-from-responsibility-authority
  &obligation:complete-responsibility-authority-produces-one-target-body
  Scenario: Project an execution body from complete responsibility authority
    Given a complete responsibility authority query result
    And a target profile that supports every required operation
    When the selected language projector is applied
    Then one executable body is projected for the responsibility
    And the body contains no independently authored forbidden mechanic meaning

  &scenario:source-facts.prove-projected-body-equivalence
  &responsibility:proves-projected-body-equivalence
  &obligation:projected-execution-matches-declared-authority
  Scenario: Prove the projected body against declared authority
    Given an admitted authority slice and its projected execution body
    When semantic and projected execution are evaluated with the same input
    Then both produce the declared canonical result
    And their ordered effect and terminal dispositions are equal
    And any divergence identifies the authority or projection layer that failed
~~~

### Atomic ownership

Each scenario has one obligation, one responsibility, and one primary result.

| Scenario ID | Obligation ID | Responsibility ID | Primary result |
| --- | --- | --- | --- |
| source-facts.classify-mechanic-authority-family | every-observed-mechanic-has-one-authority-family | classifies-execution-mechanic-authority-family | one family or explicit disposition |
| source-facts.project-mechanic-authority-data | every-classified-mechanic-produces-one-authority-data-result | projects-execution-mechanic-authority-data | one candidate authority-data row |
| source-facts.query-mechanic-authority-projections | authority-data-is-returned-as-native-query-results | queries-execution-mechanic-authority-projections | query result rows |
| source-facts.persist-projected-mechanic-authority | every-admitted-authority-has-a-durable-relational-home | persists-projected-execution-mechanic-authority | admitted durable authority |
| source-facts.query-complete-responsibility-authority | one-query-returns-all-authority-required-to-project-a-responsibility | queries-complete-responsibility-authority | one ordered closed slice |
| source-facts.project-body-from-responsibility-authority | complete-responsibility-authority-produces-one-target-body | projects-execution-body-from-responsibility-authority | one target body |
| source-facts.prove-projected-body-equivalence | projected-execution-matches-declared-authority | proves-projected-body-equivalence | equivalence disposition |

### Canonical mechanic-to-family result

| Mechanic kind | Authority family |
| --- | --- |
| branch | decision-authority |
| iteration | iteration-authority |
| exception-handling | failure-policy-authority |
| throw | terminal-result-authority |
| object-construction | projection-authority |
| serialization | serialization-profile-authority |
| normalization | normalization-authority |
| validation | validation-authority |
| fallback | alternative-selection-authority |
| retry | retry-policy-authority |
| state-mutation | state-transition-authority |
| meaning-hidden-in-text | text-meaning-authority |

## 4. Native authority-projection query contract

### 4.1 Public row shape

The query result is a candidate projection, not an admitted authority.

~~~json
{
  "ApplicationId": "source-facts-semantic-search-engine",
  "MechanicOccurrenceId": "sha256:...",
  "MechanicKind": "branch",
  "AuthorityFamily": "decision-authority",
  "FeatureId": "source-facts.cli-govern",
  "ScenarioId": "source-facts.cli-govern.evaluate-workspace",
  "ObligationId": "return-workspace-governance-disposition",
  "ResponsibilityId": "evaluates-workspace-governance",
  "SourceFactIndexId": "sha256:...",
  "RootId": "workspace-root",
  "SourceReferenceId": "src/file.js:1234:19",
  "ExecutionOrdinal": 10,
  "AuthorityData": {
    "decisionId": "resolve-workspace-governance-disposition",
    "inputs": [],
    "rules": [],
    "outcomes": [],
    "noMatchDisposition": "DECISION_NOT_RESOLVED"
  },
  "ProjectionDisposition": "HUMAN_SEMANTIC_COMPLETION_REQUIRED",
  "MissingFields": [
    "rules",
    "outcomes"
  ]
}
~~~

Allowed projection dispositions:

~~~text
AUTHORITY_DATA_PROJECTED
HUMAN_SEMANTIC_COMPLETION_REQUIRED
AUTHORITY_FAMILY_UNSUPPORTED
LINEAGE_CONTEXT_INCOMPLETE
SOURCE_EVIDENCE_INCOMPLETE
~~~

AUTHORITY_DATA_PROJECTED means every returned value was deterministically
derived from available facts. It does not mean AUTHORITY_ADMITTED.

### 4.2 Public SQL behavior

For one application and mechanic kind:

~~~sql
SELECT
    MechanicOccurrenceId,
    MechanicKind,
    AuthorityFamily,
    FeatureId,
    ScenarioId,
    ObligationId,
    ResponsibilityId,
    SourceFactIndexId,
    RootId,
    SourceReferenceId,
    ExecutionOrdinal,
    AuthorityData,
    ProjectionDisposition,
    MissingFields
FROM projection.ExecutionMechanicAuthority
WHERE ApplicationId = @ApplicationId
  AND MechanicKind = @MechanicKind
ORDER BY ResponsibilityId,
         ExecutionOrdinal,
         MechanicOccurrenceId;
~~~

For incomplete candidates:

~~~sql
SELECT *
FROM projection.ExecutionMechanicAuthority
WHERE ApplicationId = @ApplicationId
  AND ProjectionDisposition = 'HUMAN_SEMANTIC_COMPLETION_REQUIRED'
ORDER BY ResponsibilityId,
         ExecutionOrdinal,
         MechanicOccurrenceId;
~~~

For one responsibility:

~~~sql
SELECT *
FROM projection.ExecutionMechanicAuthority
WHERE ApplicationId = @ApplicationId
  AND ResponsibilityId = @ResponsibilityId
ORDER BY ExecutionOrdinal,
         MechanicOccurrenceId;
~~~

The query does only this:

~~~text
read observed facts
  -> join available lineage and context
  -> classify authority family
  -> shape standard candidate authority data
  -> return rows
~~~

It does not mutate, admit, migrate, execute, prove, render, or emit a receipt.

### 4.3 Responsibility authority query

The downstream body projector uses admitted data, not candidate rows:

~~~sql
SELECT *
FROM projection.ResponsibilityExecutionAuthority
WHERE ApplicationId = @ApplicationId
  AND ResponsibilityId = @ResponsibilityId
  AND TargetProfileId = @TargetProfileId
  AND ClosureDisposition = 'AUTHORITY_SLICE_CLOSED'
ORDER BY ExecutionOrdinal,
         MechanicAuthorityId;
~~~

This result must already contain ordered operations, decisions and rules,
iterations and continuation, projections and field mappings, failure and
terminal dispositions, state transitions, ports and effects, serialization
profiles, target bindings, and proof requirements.

## 5. Research method

### 5.1 Projection boundaries

The first attempt projected the entire repository root:

~~~powershell
node src/cli.js project --workspace "C:\lab\repos\source-facts-semantic-search-engine" --output ".tmp\universal-mechanic-authority-envelope-source-index.json" --summary
~~~

It exhausted approximately 4 GB of heap because the root includes large
generated and dependency surfaces. Do not use that boundary in implementation
or CI. The investigation used fresh, narrow roots:

~~~powershell
node src/cli.js project --workspace "C:\lab\repos\source-facts-semantic-search-engine\src" --output ".tmp\universal-mechanic-authority-envelope-src-index.json" --summary
node src/cli.js project --workspace "C:\lab\repos\source-facts-semantic-search-engine\test" --output ".tmp\universal-mechanic-authority-envelope-test-index.json" --summary
node src/cli.js project --workspace "C:\lab\repos\contract-driven-artifact-governance-engine\lib" --output ".tmp\universal-mechanic-envelope-governance-lib-index.json" --summary
node src/cli.js project --workspace "C:\lab\repos\contract-driven-artifact-governance-engine\schemas" --output ".tmp\universal-mechanic-envelope-governance-schema-index.json" --summary
node src/cli.js project --workspace "C:\lab\repos\source-code-taxonomy-scanner\src" --output ".tmp\universal-mechanic-envelope-taxonomy-src-index.json" --summary
node src/cli.js project --workspace "C:\lab\repos\declarative-typescript-body-projector\src" --output ".tmp\universal-mechanic-envelope-typescript-projector-index.json" --summary
~~~

Observed fresh scan summaries:

| Root | Files | Symbols | Relationships | Scan ID |
| --- | ---: | ---: | ---: | --- |
| source-facts/src | 102 | 7,318 | 34,018 | 890f8f730521be6554bd1ad568539074428fd38988405aa83d9800bcc8af55d5 |
| source-facts/test | 38 | 1,400 | 10,042 | 80108aad80649559dd7dd6f527b45738ec4ccbd66330489751c65b6cb38f655d |
| governance-engine/lib | 5 | 3,009 | 13,805 | c95145c990beb45cf7f2433cb458f3bd005c336e1d986c11b58eb9de1766b863 |
| taxonomy-scanner/src | 16 | 133 | 510 | 6724e546be01c1a26de42bf28a96c0b4ff18c7992d42080a571dd7afaa4f05cd |
| TypeScript projector/src | 21 | 838 | 4,021 | c61e5c4abf9ee7de62c44c77a4ad9478d6b9a1428b0872b6b71936cc8dcfbb00 |

The source-facts/src scan also contained 2,127 document facts and reported
71.25% unknown syntax. Scan IDs identify the investigation inputs; an
implementing agent must expect new IDs after source changes.

The JSON-only schema projection produced 8,113 document facts, but the current
relational query surface did not expose documentFacts for that document-only
index. The canonical schema was inspected directly after SourceFacts narrowed
the repository surface.

## 6. SourceFacts queries used

The exact queries follow. The CLI query text is positional; there is no --sql
option.

### Q01 — mechanic inventory

~~~sql
SELECT mechanic,
       COUNT(*) AS occurrenceCount,
       COUNT(DISTINCT modulePath) AS moduleCount
FROM bodyMechanics
GROUP BY mechanic
ORDER BY mechanic
~~~

Observed source-facts/src result:

| Mechanic | Occurrences | Modules |
| --- | ---: | ---: |
| branch | 1,393 | 83 |
| exception-handling | 122 | 30 |
| fallback | 2,017 | 81 |
| iteration | 472 | 68 |
| normalization | 147 | 32 |
| object-construction | 3,015 | 91 |
| retry | 1 | 1 |
| serialization | 126 | 31 |
| state-mutation | 364 | 61 |
| throw | 253 | 45 |
| validation | 174 | 28 |

No meaning-hidden-in-text row was emitted. The one retry occurrence is the
detector's own regular-expression test. This is proof that syntax classification
must never be promoted to admitted meaning.

Invocation:

~~~powershell
node src/cli.js query --index .tmp/universal-mechanic-authority-envelope-src-index.json "SELECT mechanic, COUNT(*) AS occurrenceCount, COUNT(DISTINCT modulePath) AS moduleCount FROM bodyMechanics GROUP BY mechanic ORDER BY mechanic"
~~~

### Q02 — mechanic hot spots

~~~sql
SELECT modulePath,
       mechanic,
       COUNT(*) AS occurrenceCount
FROM bodyMechanics
GROUP BY modulePath, mechanic
ORDER BY occurrenceCount DESC
LIMIT 60
~~~

This placed the candidate projector, governance report, CLI, project engine, and
SQL loader among the highest-impact modules.

### Q03 — occurrence identity and evidence

~~~sql
SELECT mechanicId,
       mechanic,
       rootId,
       modulePath,
       sourceReferenceId,
       fromSymbolId,
       evidenceKind,
       classification,
       verificationDisposition
FROM bodyMechanics
ORDER BY modulePath, sourceReferenceId, mechanicId
LIMIT 100
~~~

SourceFacts mechanicId maps to envelope mechanicOccurrenceId and SQL
ExecutableMechanicFactId. bodyMechanics has no generic sourceFactId; the
implementation must not invent one.

### Q04 — exact source coordinates

~~~sql
SELECT referenceId,
       modulePath,
       startLine,
       startColumn,
       endLine,
       endColumn,
       kind,
       sourceKind
FROM sourceReferences
ORDER BY modulePath, startLine, startColumn
LIMIT 100
~~~

### Q05 — syntax kinds available for text classification

~~~sql
SELECT sourceKind,
       COUNT(*) AS referenceCount
FROM sourceReferences
WHERE kind = 'syntax'
GROUP BY sourceKind
ORDER BY sourceKind
~~~

Observed values were SourceFile (102), RegularExpressionLiteral (59), and
ExportDeclaration (11). String and template literal profile entries are absent.

### Q06 — current authority and projection bodies

~~~sql
SELECT symbolId,
       name,
       kind,
       modulePath
FROM symbols
WHERE name IN (
  'projectsAuthorityFromMechanics',
  'buildAuthorityMechanicDraft',
  'projectCandidate',
  'projectAuthorityCandidatesFromViolations',
  'resolvesAuthorityFamily',
  'classifiesMechanicOccurrence',
  'classifiesAutomationReadiness',
  'projectsAuthorityRemediationCandidate',
  'discoversAuthorityAuthoringContractMap',
  'projectsSelfGovernanceReport',
  'projectsConsoleGovernedContract',
  'projectsEngineeringTruthSqlPayload',
  'loadsEngineeringTruthIntoSqlServer',
  'projectsControlMechanics',
  'projectsRelationshipMechanics',
  'createsBodyMechanic',
  'runProjectAuthority',
  'runProjectAuthorityViolations'
)
ORDER BY modulePath, name
~~~

### Q07 — producer call path

~~~sql
SELECT fromSymbolId,
       toSymbolCandidate,
       COUNT(*) AS callCount
FROM relationships
WHERE relationshipKind = 'invocation'
  AND fromSymbolId IN (
    'cli.js#function:runProjectAuthority',
    'cli.js#function:runProjectAuthorityViolations',
    'projects-authority-candidates.js#function:projectsAuthorityFromMechanics',
    'projects-authority-from-violations.js#function:projectAuthorityCandidatesFromViolations',
    'sqlserver/load-engineering-truth.js#function:loadsEngineeringTruthIntoSqlServer'
  )
GROUP BY fromSymbolId, toSymbolCandidate
ORDER BY fromSymbolId, toSymbolCandidate
~~~

Material findings:

- runProjectAuthority calls projectsAuthorityFromMechanics.
- runProjectAuthorityViolations calls SourceFacts projection, relational query,
  and projectAuthorityCandidatesFromViolations.
- projectsAuthorityFromMechanics delegates to the candidate projector.
- loadsEngineeringTruthIntoSqlServer delegates to
  projectsEngineeringTruthSqlPayload.

### Q08 — downstream consumers

~~~sql
SELECT fromSymbolId,
       relationshipKind,
       toSymbolCandidate,
       COUNT(*) AS occurrenceCount
FROM relationships
WHERE toSymbolCandidate IN (
  'resolvesAuthorityFamily',
  'classifiesMechanicOccurrence',
  'classifiesAutomationReadiness',
  'projectsAuthorityRemediationCandidate',
  'discoversAuthorityAuthoringContractMap',
  'projectsAuthorityFromMechanics',
  'projectAuthorityCandidatesFromViolations',
  'projectsEngineeringTruthSqlPayload'
)
GROUP BY fromSymbolId, relationshipKind, toSymbolCandidate
ORDER BY toSymbolCandidate, fromSymbolId
~~~

This located the self-governance report, CLI, governed contract projector, and
SQL loader. It also proves the report is a consumer, not a permitted dependency
for native authority projection.

### Q09 — selected module mechanic distribution

~~~sql
SELECT modulePath,
       mechanic,
       COUNT(*) AS occurrenceCount
FROM bodyMechanics
WHERE modulePath IN (
  'project.js',
  'projects-authority-candidates.js',
  'projects-authority-from-violations.js',
  'governance/classifies-execution-mechanics.js',
  'governance/classifies-automation-readiness.js',
  'governance/projects-self-governance-report.js',
  'sqlserver/load-engineering-truth.js',
  'cli.js'
)
GROUP BY modulePath, mechanic
ORDER BY modulePath, mechanic
~~~

### Q10 — governance-engine authority closure

~~~sql
SELECT symbolId,
       name,
       kind,
       modulePath
FROM symbols
WHERE name IN (
  'inspectSourceAuthority',
  'verifySourceAuthorityClosure',
  'verifyStructuredAuthorities',
  'artifactSemanticExecutionBundle',
  'executeSemanticProjection',
  'executeSemanticAuthority',
  'projectArtifactFamily'
)
ORDER BY modulePath, name
~~~

### Q11 — TypeScript projector stages

~~~sql
SELECT symbolId,
       name,
       kind,
       modulePath
FROM symbols
WHERE name IN (
  'projectsSemanticAuthorityToSignedAst',
  'executesSemanticAstProjection',
  'derivesCanonicalTypeScriptFromSemanticAuthority',
  'projectsAdmittedSemanticAst',
  'projectsSemanticAst',
  'constructsTypeScriptAst',
  'printsTypeScriptAst',
  'writesProjectedSource',
  'validatesContract',
  'resolvesLanguageAstProfile'
)
ORDER BY modulePath, name
~~~

### Q12 — TypeScript projector invocation chain

~~~sql
SELECT fromSymbolId,
       toSymbolCandidate,
       COUNT(*) AS callCount
FROM relationships
WHERE relationshipKind = 'invocation'
  AND fromSymbolId IN (
    'ast/projects-semantic-authority-to-ast.ts#function:projectsSemanticAuthorityToSignedAst',
    'bootstrap/executes-semantic-ast-projection.ts#function:executesSemanticAstProjection'
  )
GROUP BY fromSymbolId, toSymbolCandidate
ORDER BY fromSymbolId, toSymbolCandidate
~~~

It establishes the existing deterministic chain:

~~~text
verified semantic authority
  -> derive language-neutral semantic AST
  -> construct TypeScript AST
  -> print and format canonical TypeScript
  -> write source
  -> re-read and compare SHA-256
~~~

### Q13 — TypeScript taxonomy observation body

~~~sql
SELECT symbolId,
       name,
       kind,
       modulePath
FROM symbols
WHERE modulePath = 'adapters/typescript/observes-typescript-node.ts'
  AND kind IN ('function', 'method', 'class')
ORDER BY modulePath, name
~~~

The existing observesTypescriptNodes body already emits source kind, operator,
location, parent kind, and enclosing-callable anchors. Missing literal coverage
is initially a profile-data gap.

### Q14 — affected existing test modules

~~~sql
SELECT modulePath,
       COUNT(*) AS symbolCount
FROM symbols
WHERE modulePath IN (
  'project.test.js',
  'project-candidates-from-violations.test.js',
  'cli-project-authority-violations.test.js',
  'load-engineering-truth.test.js',
  'cli-load-engineering-truth.test.js',
  'load-sqlserver.test.js',
  'reporting-views.test.js',
  'self-governance-report.test.js',
  'serves-query-console.contract.test.js',
  'serves-query-console.mjs.conformance.test.js',
  'serves-query-console.authority-migration.test.js'
)
GROUP BY modulePath
ORDER BY modulePath
~~~

All 11 named test modules were present in the fresh test index. This query
establishes the existing test-body list in section 13.1.

## 7. Current-state conclusions

### Observation

SourceFacts bodyMechanics already provides a stable mechanicId, rootId,
modulePath, exact sourceReferenceId, enclosing fromSymbolId when resolved,
evidenceKind, syntax-derived-candidate classification, and
OBSERVED_NOT_EVALUATED verification disposition.

SQL already persists those rows in fact.ExecutableMechanic with the complete
12-kind check constraint and foreign keys to scan, source reference, and
enclosing symbol. Keep that as the observation plane.

### Candidate projection

projects-authority-candidates.js recognizes all 12 families, but emits
authority-declaration.draft.v1 with authority.mechanics and ad hoc candidate
shapes. Retry and meaning-hidden-in-text fall through to a generic candidate.
It is a useful producer to migrate, not the canonical schema.

### Matching

Current execution-mechanic classification and automation readiness use mechanic
kind plus overlapping source lines. First-match behavior can hide ambiguity.
That is acceptable for diagnostics but forbidden for execution authority.

The admitted binding identity is:

~~~text
(SourceFactIndexId, RootId, ExecutableMechanicFactId)
  -> exactly one admitted MechanicAuthorityId
~~~

### Governed contract

sourceAuthority is closed with additionalProperties false and requires
declarations, responsibilities, semanticEdges, decisions, iterations,
failurePolicies, projectionMappings, resultContracts, and
forbiddenSyntaxKinds. It has no mechanicAuthorities property. A schema and
migration are mandatory.

The next migration is artifact-contract.1.14-to-1.15. The interpreting engine
should become governed-artifact-engine.0.22.0 and the closed-world conformance
profile should advance from v8 to v9.

### SQL

Current SQL has fact.ExecutableMechanic, contract snapshots, artifacts,
project-feature-scenario-obligation-responsibility lineage, observation
snapshots, tests, proofs, and enterprise subject relationships. It lacks
authority-family mapping, admitted mechanic authority, exact occurrence binding,
native authority-projection views, target profiles, responsibility closure, and
mechanic equivalence proof.

### Runtime and projector

The governance runtime supports finite primitives for input, validation, path
reads, constants, presence tests, classification, translation, obligation
evaluation, projection, selection, bounded worklists, result emission, and
canonical serialization.

The TypeScript projector already provides a signed request-to-semantic-AST-to-
TypeScript-AST-to-bytes pipeline. Its AST vocabulary is intentionally narrow.
The first truthful profile is semantic-runtime delegation, not arbitrary direct
lowering of all 12 mechanic kinds.

## 8. Contract implementation

### 8.1 Universal envelope

Add sourceAuthority.mechanicAuthorities as a required array in contract 1.15.0.
Every entry is closed and uses the common outer shape:

~~~json
{
  "authorityType": "executable-mechanic-authority.v1",
  "mechanicAuthorityId": "resolve-existing-target-disposition",
  "mechanicKind": "branch",
  "lineage": {
    "featureId": "shape-a-file-system",
    "scenarioId": "reject-a-target-conflict",
    "obligationId": "reject-unauthorized-target-replacement",
    "responsibilityId": "resolves-target-disposition",
    "artifactId": "file-system-shaper-runtime"
  },
  "semanticSubject": {
    "subjectId": "target-placement-disposition",
    "purpose": "Resolve whether a declared placement may proceed."
  },
  "inputs": [],
  "authority": {},
  "outputs": [],
  "execution": {},
  "proof": {},
  "sourceEvidence": [],
  "lifecycle": {
    "status": "admitted",
    "admissionDisposition": "AUTHORITY_ADMITTED"
  }
}
~~~

All IDs use the existing contract identifier definition. mechanicKind uses the
same 12 values as SourceFacts SQL and the v9 body-purity profile.

The outer inputs and outputs are canonical. Kind-specific authority objects
refer to them by inputId and outputId. They must not duplicate free-form input
or output definitions.

### 8.2 Exact source evidence

Replace the proposal's illustrative generic sourceFactId with fields the current
system produces:

~~~json
{
  "sourceFactIndexId": "sha256:...",
  "rootId": "workspace-root",
  "mechanicOccurrenceId": "sha256:...",
  "sourceReferenceId": "src/file.js:1234:19",
  "sourceFileDigest": "sha256:...",
  "observedMechanicKind": "branch"
}
~~~

| Envelope | SourceFacts JSON | SQL |
| --- | --- | --- |
| sourceFactIndexId | index.indexId | inventory.Scan.IndexId |
| rootId | bodyMechanics.rootId | fact.ExecutableMechanic.RootId |
| mechanicOccurrenceId | bodyMechanics.mechanicId | fact.ExecutableMechanic.ExecutableMechanicFactId |
| sourceReferenceId | bodyMechanics.sourceReferenceId | fact.ExecutableMechanic.SourceReferenceId |
| sourceFileDigest | files.contentHash | inventory.SourceFile.ContentHash |
| observedMechanicKind | bodyMechanics.mechanic | fact.ExecutableMechanic.MechanicKind |

Every migrated authority needs at least one sourceEvidence item. Authority-first
designs with no predecessor may use an empty list only when
execution.origin = authority-first.

### 8.3 Kind-specific schema

authority is a discriminated oneOf selected by authority.authorityKind.

| Mechanic | authorityKind |
| --- | --- |
| branch | decision-authority.v1 |
| iteration | iteration-authority.v1 |
| exception-handling | failure-observation-authority.v1 |
| throw | terminal-disposition-authority.v1 |
| object-construction | semantic-projection-authority.v1 |
| serialization | serialization-profile-authority.v1 |
| normalization | canonicalization-authority.v1 |
| validation | constraint-authority.v1 |
| fallback | alternative-selection-authority.v1 |
| retry | retry-policy-authority.v1 |
| state-mutation | state-transition-authority.v1 |
| meaning-hidden-in-text | text-meaning-authority.v1 |

Each kind definition must require the semantic fields listed in the proposal,
including no-match and ambiguity postures, termination, failure and terminal
dispositions, field mappings, serialization profile, retry bounds, state
transition guards, and text vocabulary/template meaning.

### 8.4 Lifecycle

Authored lifecycle values:

~~~text
proposed
reviewed
admitted
retired
~~~

Admission dispositions:

~~~text
INFERRED_NOT_ADMITTED
HUMAN_SEMANTIC_COMPLETION_REQUIRED
AUTHORITY_REVIEWED
AUTHORITY_ADMITTED
AUTHORITY_RETIRED
~~~

Projected and proven are derived database states from downstream execution and
evaluation. They must not be trusted as authored lifecycle claims.

Only current AUTHORITY_ADMITTED data can enter the responsibility authority
query.

### 8.5 Legacy arrays

Keep decisions, iterations, failurePolicies, projectionMappings, and
resultContracts in 1.15.0.

Migration algorithm:

1. Add mechanicAuthorities as an empty array.
2. Translate a legacy entry to a proposed envelope only when its mapping is
   exact.
3. Preserve incomplete values as candidate references with named missing
   fields.
4. Require review before AUTHORITY_ADMITTED.
5. Make v9 mechanic closure use mechanicAuthorities as canonical.
6. Reject contradictions between legacy arrays and admitted envelopes.
7. Retire legacy arrays only in a later major migration.

## 9. Detector fidelity before authority closure

Detector coverage must be corrected before SQL can claim a closed authority
slice.

1. Add StringLiteral, NoSubstitutionTemplateLiteral, and TemplateExpression to
   the TypeScript syntax classification profile.
2. Add PrefixUnaryExpression and PostfixUnaryExpression to the relationship
   taxonomy.
3. In SourceFacts, project meaning-hidden-in-text candidates only when an
   applicable governance rule says the literal carries executable meaning.
   Literal presence alone is not enough.
4. Extend state-mutation observation to assignment, increment/decrement, and
   explicitly profiled mutator invocations such as set, add, delete, push, pop,
   and splice.
5. Replace substring invocation matching with token/callee classification so
   the detector's own retry regular expression is not a retry occurrence.
6. Close contracts/source-fact-index.schema.v1.json over the same 12 mechanic
   enum values already enforced by SQL.
7. Add negative controls for self-matching detectors, inert text, and
   mutator-like names without mutation.

Exit dispositions:

~~~text
DETECTOR_TAXONOMY_CLOSED
DETECTOR_FALSE_POSITIVE_CONTROLS_PASS
SOURCE_FACT_SCHEMA_AND_SQL_TAXONOMY_EQUAL
~~~

## 10. SQL implementation

### 10.1 Lean native-query slice

Reuse fact.ExecutableMechanic; do not create a duplicate observation table.

Add:

~~~text
authority.MechanicAuthorityFamily
binding.MechanicCanonicalLineage
projection.ExecutionMechanicAuthority
~~~

projection.ExecutionMechanicAuthority is a read-only view. It joins:

~~~text
fact.ExecutableMechanic
  -> source.SourceReference
  -> inventory.SourceFile
  -> binding.ResponsibilityCallable
  -> lineage.Responsibility
  -> lineage.Obligation
  -> lineage.Scenario
  -> lineage.Feature
  -> enterprise.Subject and SubjectRelationship
  -> authority.MechanicAuthorityFamily
~~~

If the existing responsibility-callable and lineage chain resolves every pilot
occurrence, binding.MechanicCanonicalLineage is not populated redundantly. It is
used only for an explicit reviewed occurrence-to-lineage override and must carry
its context-authority digest.

The view shapes AuthorityData and MissingFields with deterministic column and
array order. It has no side effects and stores no query-run state.

### 10.2 Admitted authority slice

Add the durable downstream objects:

~~~text
authority.ExecutableMechanicAuthority
authority.MechanicInput
authority.MechanicOutput
authority.MechanicSourceEvidence
authority.MechanicProofRequirement
authority.MechanicExecutionStep
authority.MechanicPortBinding
authority.MechanicEffectBinding
binding.MechanicAuthorityOccurrence
projection.TargetProfile
projection.TargetProfileMechanic
projection.TargetProfileOperation
projection.ResponsibilityExecutionAuthority
proof.MechanicEquivalenceProof
~~~

Preserve the canonical kind-specific AuthorityJson and its digest on
authority.ExecutableMechanicAuthority. Normalize only fields SQL must order or
validate into child tables:

~~~text
authority.DecisionRule
authority.IterationRule
authority.FailureDisposition
authority.TerminalDisposition
authority.ProjectionFieldMapping
authority.SerializationRule
authority.CanonicalizationOperation
authority.ConstraintRule
authority.AlternativeRule
authority.RetryRule
authority.StateTransition
authority.TextMeaningRule
~~~

### 10.3 Keys

~~~text
ExecutableMechanicAuthority
  primary key:
    (ContractSnapshotId, MechanicAuthorityId)

MechanicSourceEvidence
  primary key:
    (ContractSnapshotId, MechanicAuthorityId,
     SourceFactIndexId, RootId, ExecutableMechanicFactId)

MechanicAuthorityOccurrence
  diagnostic rows may be multiple;
  filtered unique index permits at most one
  AUTHORITY_BINDING_ADMITTED row for:
    (SourceFactIndexId, RootId, ExecutableMechanicFactId)

MechanicExecutionStep
  primary key:
    (ContractSnapshotId, MechanicAuthorityId, Sequence)
  StepId unique within the authority
~~~

Required foreign keys:

~~~text
binding occurrence
  -> fact.ExecutableMechanic
  -> authority.ExecutableMechanicAuthority

mechanic authority
  -> lineage.Responsibility
  -> lineage.Obligation
  -> lineage.Scenario
  -> lineage.Feature
  -> lineage.Project
  -> enterprise context
~~~

ApplicationId and DomainId come from current enterprise context authority, never
from source syntax and never from a report.

### 10.4 Script sequence

Add after 009-create-enterprise-subject-registry.sql:

1. scripts/sql/010-create-mechanic-authority-query.sql
2. scripts/sql/011-create-mechanic-authority-tables.sql
3. scripts/sql/012-load-mechanic-authorities.sql
4. scripts/sql/013-create-responsibility-authority-view.sql
5. scripts/sql/014-create-mechanic-equivalence-proof.sql

010 alone delivers the inexpensive native candidate query. It must not depend
on 011 through 014.

### 10.5 Load algorithm

Extend projectsEngineeringTruthSqlPayload with:

~~~text
mechanicAuthorities
mechanicInputs
mechanicOutputs
mechanicSourceEvidence
mechanicProofRequirements
mechanicExecutionSteps
mechanicPortBindings
mechanicEffectBindings
mechanicOccurrenceBindings
targetProfiles
~~~

Extend ingestion.LoadEngineeringTruth rather than creating a second
non-transactional authority loader.

Load order:

1. contract snapshot;
2. artifact and canonical lineage;
3. observation snapshot and enterprise context;
4. mechanic authority common rows;
5. kind-specific and ordered child rows;
6. exact source-evidence rows;
7. occurrence bindings;
8. target profiles.

Missing foreign keys, digest mismatch, duplicate admitted bindings, and JSON
round-trip mismatch roll back the full admitted-authority load.

The native candidate query remains read-only and is not part of this
transaction.

### 10.6 Responsibility closure

projection.ResponsibilityExecutionAuthority returns rows only when these checks
pass:

1. source index and contract snapshot are current;
2. project-to-responsibility lineage is complete;
3. enterprise-to-application context is complete and unambiguous;
4. every applicable occurrence has exactly one admitted binding;
5. observed and authority mechanic kinds agree;
6. source reference and source file digest agree;
7. the envelope is complete and AUTHORITY_ADMITTED;
8. execution sequence is contiguous and unique;
9. every input, output, rule, port, effect, and runtime reference resolves;
10. the target profile supports every mechanic and operation;
11. all proof requirements exist.

Failure dispositions:

~~~text
AUTHORITY_BINDING_MISSING
AUTHORITY_BINDING_AMBIGUOUS
SOURCE_EVIDENCE_STALE
LINEAGE_INCOMPLETE
ENTERPRISE_CONTEXT_INCOMPLETE
AUTHORITY_INCOMPLETE
EXECUTION_SEQUENCE_INVALID
EXECUTION_BINDING_UNRESOLVED
TARGET_PROFILE_UNSUPPORTED_MECHANIC
TARGET_PROFILE_UNSUPPORTED_OPERATION
PROOF_REQUIREMENT_INCOMPLETE
~~~

Only the all-green subject has AUTHORITY_SLICE_CLOSED.

### 10.7 Reports are diagnostic consumers only

Update reporting views to explain family coverage, missing fields, ambiguity,
staleness, readiness, and proof disposition. Neither the native authority-
projection query nor the responsibility authority query may depend on a
generated report.

## 11. Target body projection

### 11.1 First target profile

Implement:

~~~text
typescript.semantic-runtime-delegation.v1
~~~

It produces a thin governed invocation of a verified semantic execution bundle
through the existing signed semantic-authority-to-AST chain. It does not inline
newly reconstructed business meaning.

### 11.2 Initial support matrix

| Mechanic | Initial disposition | Restriction |
| --- | --- | --- |
| branch | PROJECTABLE_WITH_RESTRICTIONS | finite declared rules supported by existing decision primitives |
| iteration | PROJECTABLE_WITH_RESTRICTIONS | bounded worklist with explicit continuation and termination |
| exception-handling | ADAPTER_REQUIRED | explicit boundary observation and failure-to-result adapter |
| throw | PROJECTABLE_WITH_RESTRICTIONS | terminal result; arbitrary thrown exception unsupported |
| object-construction | PROJECTABLE | declared semantic field projection |
| serialization | PROJECTABLE_WITH_RESTRICTIONS | canonical JSON only |
| normalization | PROJECTABLE_WITH_RESTRICTIONS | declared translations/canonicalization operations |
| validation | PROJECTABLE | declared constraints and result dispositions |
| fallback | PROJECTABLE | ordered alternatives plus no-match and ambiguity posture |
| retry | KERNEL_PRIMITIVE_REQUIRED | attempts, time/backoff, cancellation, idempotency, terminal policy |
| state-mutation | ADAPTER_REQUIRED | declared state transition plus authorized effect and receipt |
| meaning-hidden-in-text | PROJECTABLE_WITH_RESTRICTIONS | constants or closed templates only |

ADAPTER_REQUIRED and KERNEL_PRIMITIVE_REQUIRED block the responsibility query
until a digest-bound adapter or primitive is registered in the selected profile.

### 11.3 Projector input

The selected rows from projection.ResponsibilityExecutionAuthority become one
immutable, canonically ordered body-projection request for the downstream
projector.

That downstream operation may issue a projection receipt because it writes an
artifact. This does not alter the no-receipt rule for the native mechanic-
authority query.

The projector:

1. validates the authority slice and target profile digests;
2. lowers admitted authority to a semantic execution bundle;
3. lowers the bundle invocation to the language-neutral semantic AST;
4. constructs the TypeScript AST;
5. prints and writes canonical source;
6. re-reads the bytes;
7. returns the artifact digest and downstream projection disposition.

It does not query mutable SQL state and does not accept source text as semantic
input.

## 12. Equivalence evaluation

For every scenario fixture:

1. validate the input against its declared contract;
2. execute admitted authority in the semantic runtime;
3. execute the projected target body in an isolated harness;
4. normalize results with the declared serialization profile;
5. compare output kind, fields, terminal disposition, and failure disposition;
6. compare ordered effect receipts, including no-effect testimony;
7. identify the failing authority, lowering, runtime, or artifact layer;
8. run negative controls by mutating authority, profile, runtime, output, effect,
   and artifact bytes.

The equivalence record binds:

- source index and source file digests;
- contract and authority digests;
- enterprise context digest;
- target profile and runtime digests;
- selected responsibility-authority rows;
- semantic AST, target AST, and emitted byte digests;
- fixture corpus digest;
- normalized result and effect digests.

The final positive disposition is PROJECTED_BODY_EQUIVALENT. A projected body
may be promoted into its governed path only after this disposition. The
authority-projection query itself remains proof-free.

## 13. Source bodies and artifacts affected on disk

This is the reviewed implementation inventory. Mandatory means the first
end-to-end pilot cannot ship without the change. Conditional means a body
changes only when the named unsupported mechanic is moved into a supported
target profile.

### 13.1 source-facts-semantic-search-engine

Repository:
C:\lab\repos\source-facts-semantic-search-engine

#### Existing source bodies to modify

| Path | Bodies | Required change |
| --- | --- | --- |
| src/project.js | createsBodyMechanic, projectsControlMechanics, projectsRelationshipMechanics | detector fidelity, literal and mutation coverage, false-positive controls, stable evidence |
| src/projects-authority-candidates.js | AuthorityCandidateProjector.projectCandidate, buildAuthorityMechanicDraft, projectsAuthorityFromMechanics, kind projectors | use the universal candidate row/envelope shapes; add dedicated retry and text projectors |
| src/projects-authority-from-violations.js | projectAuthorityCandidatesFromViolations | preserve exact occurrence IDs and canonical lineage candidates |
| src/governance/mechanic-authority-families.js | resolvesAuthorityFamily | become the single 12-kind family registry used by JS and SQL seed generation |
| src/governance/classifies-execution-mechanics.js | classifiesMechanicOccurrence | exact-ID binding; return missing and ambiguous dispositions |
| src/governance/classifies-automation-readiness.js | classifiesAutomationReadiness | derive readiness from admitted closure and target-profile support |
| src/governance/discovers-authority-authoring-contract-map.js | discoversAuthorityAuthoringContractMap | expose mechanicAuthorities and all kind-specific schema paths |
| src/governance/projects-authority-remediation-candidate.js | projectsAuthorityRemediationCandidate | use standard candidate rows and named missing fields |
| src/governance/projects-self-governance-report.js | projectsSelfGovernanceReport | consume new rows without becoming a query dependency |
| src/projects-governed-console-contract.js | projectsConsoleGovernedContract | migrate the serves-query-console pilot to mechanicAuthorities |
| src/sqlserver/load-engineering-truth.js | projectsEngineeringTruthSqlPayload, loadsEngineeringTruthIntoSqlServer | transactionally load admitted authority, bindings, and profiles |
| src/sqlserver/load-sqlserver.js | SQL execution helpers | add a read-only row-query helper only if the application API must expose SQL rows; do not add query-run persistence |
| src/cli.js | runProjectAuthority, runProjectAuthorityViolations, SQL command dispatch | preserve candidate/admission separation; any convenience command performs one query and prints rows only |

src/query.js and its executeRelationalQuery body are not mandatory for the SQL
view. Modify them only if native SourceFacts JSON-index query parity is an
accepted requirement. If added, expose a mechanicAuthorityProjections source
whose row contract is identical to projection.ExecutionMechanicAuthority; do
not introduce a report command.

#### New source bodies

| Proposed path | Responsibility |
| --- | --- |
| src/governance/projects-execution-mechanic-authority-data.js | projects-execution-mechanic-authority-data |
| src/governance/validates-mechanic-authority-envelope.js | validate reviewed envelopes before admitted loading |
| src/sqlserver/projects-mechanic-authority-sql-payload.js | lossless authority-to-row projection |
| src/sqlserver/queries-execution-mechanic-authority.js | optional thin one-query API returning rows unchanged |
| src/sqlserver/queries-complete-responsibility-authority.js | reject every closure disposition except AUTHORITY_SLICE_CLOSED |
| src/projection/projects-execution-body-from-responsibility-authority.js | call the target projector with the closed ordered slice |
| src/proof/proves-projected-body-equivalence.js | run fixtures and compare semantic and projected execution |

#### Data, schema, and SQL artifacts

| Path | Change |
| --- | --- |
| contracts/source-fact-index.schema.v1.json | close the 12-value mechanic enum and add required evidence |
| scripts/sql/003-create-source-fact-tables.sql | modify only for genuinely new observation columns |
| scripts/sql/004g-load-executable-mechanics.sql | load any new observation evidence |
| scripts/sql/005-create-reporting-views.sql | add diagnostics after authority exists; no query dependency |
| scripts/sql/006-create-engineering-truth-tables.sql | ensure lineage and snapshot keys support new foreign keys |
| scripts/sql/007-load-engineering-truth.sql | transactional admitted-authority load |
| scripts/sql/008-create-engineering-truth-views.sql | add downstream readiness and proof joins |
| scripts/sql/009-create-enterprise-subject-registry.sql | add only indexes/constraints required for unique application/domain joins |
| scripts/sql/010-create-mechanic-authority-query.sql | new native candidate-query objects |
| scripts/sql/011-create-mechanic-authority-tables.sql | new admitted authority and binding objects |
| scripts/sql/012-load-mechanic-authorities.sql | new loading procedure used by LoadEngineeringTruth |
| scripts/sql/013-create-responsibility-authority-view.sql | new admitted responsibility query and closure |
| scripts/sql/014-create-mechanic-equivalence-proof.sql | new downstream proof persistence |

#### Test bodies

Modify:

~~~text
test/project.test.js
test/project-candidates-from-violations.test.js
test/cli-project-authority-violations.test.js
test/load-engineering-truth.test.js
test/cli-load-engineering-truth.test.js
test/load-sqlserver.test.js
test/reporting-views.test.js
test/self-governance-report.test.js
test/serves-query-console.contract.test.js
test/serves-query-console.mjs.conformance.test.js
test/serves-query-console.authority-migration.test.js
~~~

Add:

~~~text
test/execution-mechanic-authority-query.test.js
test/mechanic-authority-envelope.test.js
test/responsibility-execution-authority.test.js
test/projected-body-equivalence.test.js
~~~

### 13.2 contract-driven-artifact-governance-engine

Repository:
C:\lab\repos\contract-driven-artifact-governance-engine

#### Existing source bodies

| Path | Bodies | Required change |
| --- | --- | --- |
| lib/governed-artifact-engine.mjs | inspectSourceAuthority, verifyStructuredAuthorities, verifySourceAuthorityClosure, artifactSemanticExecutionBundle, executeSemanticProjection, projectArtifactFamily | validate universal envelopes, exact authority closure, and v9 profile |
| lib/semantic-execution-runtime.mjs | executeSemanticAuthority | conditional; add only a primitive moved from blocked to supported |

The engine's custom source scanner continues to verify the thin projected body.
It must not replace SourceFacts as occurrence identity for legacy body binding.

#### Governed artifacts

Modify:

~~~text
schemas/governed-artifact-contract.schema.json
registries/migration-registry.json
registries/projector-registry.json
registries/verifier-registry.json
package.json
test/engine.test.mjs
test/semantic-ontology.test.mjs
~~~

Add:

~~~text
schemas/executable-mechanic-authority.schema.json
schemas/responsibility-execution-authority.schema.json
schemas/projected-body-equivalence.schema.json
profiles/closed-world-artifact-conformance.v9.json
profiles/typescript.semantic-runtime-delegation.v1.json
migrations/artifact-contract.1.14-to-1.15.json
test/mechanic-authority-envelope.test.mjs
test/projected-body-equivalence.test.mjs
~~~

Required verifier identities:

~~~text
mechanic-authority-envelope-verifier.v1
mechanic-authority-closure-verifier.v1
responsibility-authority-query-verifier.v1
projected-body-equivalence-verifier.v1
~~~

No verifier or receipt is added to the native candidate query. These verifiers
apply to admitted authority, downstream body projection, and proof.

### 13.3 source-code-taxonomy-scanner

Repository:
C:\lab\repos\source-code-taxonomy-scanner

Initial changes:

~~~text
language-profiles/typescript/typescript-syntax-classification.sej.v1.json
language-profiles/typescript/typescript-relationship-taxonomy.sej.v1.json
proof/scenarios/observe-source-code-taxonomy.scenarios.test.ts
proof/negative-controls/hidden-decision.fixture.ts
~~~

No scanner source-body change is expected initially.
src/adapters/typescript/observes-typescript-node.ts and its
observesTypescriptNodes body already emit source kind, operator, location,
parent kind, and enclosing-callable anchors.

Edit only these bodies if a new failing profile-conformance test proves the
required literal or unary identity is lost:

~~~text
src/adapters/typescript/observes-typescript-node.ts
  observesTypescriptNodes
  readsOperator
~~~

### 13.4 declarative-typescript-body-projector

Repository:
C:\lab\repos\declarative-typescript-body-projector

#### Existing source bodies to modify

| Path | Bodies | Required change |
| --- | --- | --- |
| src/bootstrap/executes-semantic-ast-projection.ts | validatesContract, projectsAdmittedSemanticAst, resolvesLanguageAstProfile, executesSemanticAstProjection, derivesCanonicalTypeScriptFromSemanticAuthority | accept the closed responsibility result and target profile; lower only admitted forms |
| src/ast/projects-semantic-authority-to-ast.ts | projectsSemanticAuthorityToSignedAst | bind parent provenance to authority-slice and profile digests |
| src/contracts/semantic-ast.type.ts | semantic AST types | add only nodes required by the first supported profile |
| src/contracts/projection-context.type.ts | ProjectBodyContext, ProjectedBodyResult | carry slice/profile digests and downstream artifact result |
| src/adapters/constructs-typescript-ast.ts | constructsTypeScriptAst | construct newly admitted semantic nodes |
| src/adapters/prints-typescript-ast.ts | printsTypeScriptAst | preserve deterministic printing for new nodes |
| src/adapters/formats-canonical-typescript.ts | formatsCanonicalTypeScript | add declared anchors only when a new AST node requires them |

#### New source bodies

~~~text
src/contracts/responsibility-execution-authority.type.ts
src/contracts/body-projection-result.type.ts
src/kernel/projects-mechanic-authority-slice.ts
src/operations/projects-responsibility-execution-body.ts
~~~

#### Verified unchanged for the first profile

~~~text
src/kernel/projects-semantic-ast.ts
src/runtime/projects-declarative-typescript-body.ts
src/adapters/writes-projected-source.ts
~~~

They already provide the generic kernel delegation, thin governed body, and
deterministic byte-write boundary. Change them only for a specific failing
acceptance test.

#### Proof bodies

Modify:

~~~text
proof/verifies-semantic-authority-to-ast-transition.ts
proof/verifies-signed-ast-projection.ts
proof/runs-acceptance-corpus.ts
~~~

Add:

~~~text
proof/verifies-mechanic-authority-projection.ts
proof/verifies-projected-body-equivalence.ts
~~~

## 14. Mechanical implementation sequence

Complete phases in order. A later phase may not weaken an earlier gate.

### Phase 0 — admit feature IDs and freeze the pilot

1. Add the feature and seven atomic scenarios from section 3 to canonical
   lineage.
2. Use serves-query-console as the pilot responsibility family.
3. Capture its current SourceFacts index, contract digest, file digests, inputs,
   outputs, terminal dispositions, and effect testimony.
4. Add negative fixtures for missing lineage, unsupported family, incomplete
   semantic fields, missing binding, duplicate binding, stale file digest,
   unsupported retry, and behavior divergence.

Exit:

~~~text
FEATURE_LINEAGE_CLOSED
PILOT_BASELINE_CAPTURED
NEGATIVE_CONTROLS_DECLARED
~~~

### Phase 1 — close observation fidelity

1. Make the taxonomy profile changes in section 9.
2. Update SourceFacts mapping.
3. Close the JSON mechanic enum.
4. Reproject all narrow indexes.
5. Run Q01, Q03, Q04, and Q05.
6. Prove all 12 kinds have fixtures.
7. Prove the detector's retry regular expression is not a retry occurrence.

Exit:

~~~text
DETECTOR_TAXONOMY_CLOSED
DETECTOR_IDENTITIES_STABLE
DETECTOR_NEGATIVE_CONTROLS_PASS
~~~

### Phase 2 — deliver the native query first

1. Create the single 12-kind family registry.
2. Add SQL script 010.
3. Shape one candidate AuthorityData object per mechanic family.
4. Return MissingFields and ProjectionDisposition on every row.
5. Query one occurrence, one responsibility, one mechanic family, and one
   application.
6. Prove repeated identical SELECT operations return identical ordered rows.
7. Prove the query creates no rows and changes no state.
8. Prove it invokes no report, receipt, file writer, projector, or proof body.

Exit:

~~~text
AUTHORITY_PROJECTION_QUERY_AVAILABLE
ALL_TWELVE_FAMILIES_SHAPED
QUERY_IS_READ_ONLY
QUERY_RESULT_IS_THE_PRODUCT
~~~

### Phase 3 — add the canonical envelope

1. Add executable-mechanic-authority.schema.json.
2. Reference it from required sourceAuthority.mechanicAuthorities.
3. Add 1.14-to-1.15 migration.
4. Add v9 conformance and registry entries.
5. Update governed-artifact-engine validation and closure.
6. Add valid and invalid fixtures for every authorityKind.
7. Reject contradictions between legacy arrays and admitted envelopes.

Exit:

~~~text
MECHANIC_AUTHORITY_SCHEMA_CLOSED
ARTIFACT_CONTRACT_1_15_MIGRATION_PROVEN
GOVERNANCE_ENGINE_0_22_INTERPRETS_V9
~~~

### Phase 4 — migrate candidate producers and admit the pilot

1. Make JS candidate projection use the same row shapes as SQL.
2. Add dedicated retry and text candidates.
3. Preserve INFERRED_NOT_ADMITTED or
   HUMAN_SEMANTIC_COMPLETION_REQUIRED.
4. Replace line-overlap matching with exact occurrence identity.
5. Return explicit missing and ambiguous dispositions.
6. Review and complete the serves-query-console envelopes.
7. Admit only schema-valid, lineage-closed pilot authority.

Exit:

~~~text
CANDIDATE_SHAPES_EQUAL_SQL_QUERY_SHAPES
NO_CANDIDATE_AUTO_ADMITTED
EXACT_OCCURRENCE_MATCHING_PROVEN
PILOT_AUTHORITY_ADMITTED
~~~

### Phase 5 — persist and query complete responsibility authority

1. Apply SQL scripts 011 through 013.
2. Extend the engineering-truth payload and transaction.
3. Load the pilot index and 1.15 contract.
4. Reconstitute every envelope and compare its canonical JSON digest.
5. Query projection.ResponsibilityExecutionAuthority.
6. Run every missing, ambiguous, stale, lineage, context, and unsupported-profile
   control.

Exit:

~~~text
MECHANIC_AUTHORITY_LOAD_ADMITTED
AUTHORITY_JSON_ROUND_TRIP_EQUAL
PILOT_AUTHORITY_SLICE_CLOSED
ALL_CLOSURE_NEGATIVE_CONTROLS_BLOCK
~~~

### Phase 6 — project the TypeScript body

1. Register typescript.semantic-runtime-delegation.v1.
2. Implement responsibility-authority-to-semantic-bundle lowering.
3. Reuse the signed semantic-authority-to-AST path.
4. Reject ADAPTER_REQUIRED and KERNEL_PRIMITIVE_REQUIRED before AST
   construction.
5. Project the pilot to a staging path.
6. Reproject and compare semantic AST, TypeScript AST, and emitted bytes.

Exit:

~~~text
TARGET_PROFILE_SUPPORTED
SEMANTIC_AST_PROJECTED
LANGUAGE_AST_CONSTRUCTED
PROJECTED_ARTIFACT_CONFORMS
BYTE_IDENTICAL_REPROJECTION
~~~

### Phase 7 — prove and promote

1. Apply SQL script 014.
2. Execute the baseline fixtures through admitted authority and the staged body.
3. Compare normalized outputs, failures, terminal states, and effects.
4. Run all proof negative controls.
5. Persist the downstream equivalence record.
6. Promote only PROJECTED_BODY_EQUIVALENT bytes.
7. Rescan the promoted body and prove v9 body purity.

Exit:

~~~text
PROJECTED_BODY_EQUIVALENT
PROOF_NEGATIVE_CONTROLS_PASS
PROJECTED_BODY_PROMOTED
PROJECTED_BODY_PURITY_CLOSED
~~~

### Phase 8 — expand profile support one mechanic at a time

For each blocked mechanic:

1. define the missing primitive or adapter authority;
2. register it with a digest;
3. implement it;
4. add positive and negative fixtures;
5. change only that profile disposition;
6. rerun all prior conformance and equivalence tests.

Retry and external state mutation remain last because they require explicit
time, cancellation, idempotency, effects, and receipts.

## 15. Verification commands

### source-facts-semantic-search-engine

~~~powershell
npm test
npm run prove:smoke
npm run prove:smoke:web
node src/cli.js project --workspace "C:\lab\repos\source-facts-semantic-search-engine\src" --output ".tmp\universal-mechanic-authority-envelope-src-index.after.json" --summary
node src/cli.js query --index .tmp/universal-mechanic-authority-envelope-src-index.after.json "SELECT mechanic, COUNT(*) AS occurrenceCount, COUNT(DISTINCT modulePath) AS moduleCount FROM bodyMechanics GROUP BY mechanic ORDER BY mechanic"
~~~

### contract-driven-artifact-governance-engine

~~~powershell
npm test
npm run pack:check
npm run release:check
~~~

Run npm run prove only when its npm audit network operation is authorized.

### source-code-taxonomy-scanner

~~~powershell
npm run conformance
~~~

### declarative-typescript-body-projector

~~~powershell
npm run prove
npm run build
~~~

### SQL acceptance

Run the native candidate query from section 4.2 before applying admitted-
authority scripts 011 through 014. It must return rows and create no state.

After loading admitted authority, run:

~~~sql
SELECT *
FROM projection.ResponsibilityExecutionAuthority
WHERE ApplicationId = N'source-facts-semantic-search-engine'
  AND ResponsibilityId = N'serves-query-console'
  AND TargetProfileId = N'typescript.semantic-runtime-delegation.v1'
ORDER BY ExecutionOrdinal,
         MechanicAuthorityId;
~~~

Expected positive disposition:

~~~text
AUTHORITY_SLICE_CLOSED
~~~

Every negative-control query returns its exact declared closure disposition and
does not invoke the target projector.

## 16. Definition of done

The capability is complete only when:

1. The Gherkin feature is admitted.
2. Every scenario has one obligation and one owning responsibility.
3. The IDs exist in canonical lineage and SQL.
4. All 12 mechanic kinds have standard candidate query shapes.
5. One parameterized SELECT returns projected authority data directly.
6. That SELECT performs no writes and produces no report, receipt, sidecar,
   workflow, migration, body, or proof.
7. Incomplete semantics are returned with named fields and never auto-admitted.
8. Reviewed authority uses the universal envelope and exact occurrence binding.
9. One responsibility query returns a closed, ordered, target-sufficient
   authority slice.
10. Missing, ambiguous, stale, incomplete, and unsupported subjects are blocked.
11. At least one TypeScript body is projected solely from the closed query
    result.
12. Repeating projection from unchanged authority produces identical AST and
    source bytes.
13. The projected body is behaviorally equivalent for results, terminal
    dispositions, failures, and ordered effects.
14. Negative controls detect drift in source, authority, target profile,
    runtime, result, effect, and artifact bytes.
15. No report generator or manual source reread exists between admitted SQL
    authority and target projection.

The completed operational paths are:

~~~text
observed mechanic
  -> SELECT projection.ExecutionMechanicAuthority
  -> candidate authority-data rows
  -> done
~~~

and, after review and admission:

~~~text
SELECT projection.ResponsibilityExecutionAuthority
  -> PROJECT target body
  -> EXECUTE
  -> PROVE
~~~

## 17. Fixed risks and mitigations

| Risk | Fixed mitigation |
| --- | --- |
| Query grows into a workflow | script 010 is a read-only view with rows as its only product |
| Candidate is mistaken for admitted meaning | candidate dispositions can never satisfy AUTHORITY_ADMITTED |
| Line movement breaks authority | bind by index, root, occurrence ID, and file digest |
| Two authorities match | preserve diagnostics; responsibility closure returns AUTHORITY_BINDING_AMBIGUOUS |
| Scanner misses a mechanic | detector fidelity and negative controls precede authority closure |
| SQL order changes projection | explicit ordinal and stable-ID ordering |
| Enterprise context is absent | return ENTERPRISE_CONTEXT_INCOMPLETE |
| Target profile overclaims support | per-mechanic and per-operation profile rows |
| Projector rediscovers meaning | projector accepts the complete closed query result only |
| Runtime changes behavior | equivalence record binds runtime executable digest |
| Generated body is edited | re-read hash and behavior comparison fail |
| Legacy authority contradicts envelope | v9 verifier rejects the contract |
| Retry or effects introduce nondeterminism | remain blocked until time, cancellation, idempotency, and effects are explicit |
