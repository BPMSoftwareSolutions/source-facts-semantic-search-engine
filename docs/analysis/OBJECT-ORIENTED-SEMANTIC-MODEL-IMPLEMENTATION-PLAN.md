# Object-Oriented Semantic Model: Implementation Plan

**Generated:** August 7, 2026
**Revised:** August 7, 2026 — resequenced around canonical semantic objects per team direction (see Revision note)
**Scope:** Transition plan from the current relational/functional SourceFacts codebase to the object-oriented semantic interpretation layer described in the target-model documents
**Status:** Draft for team review. No code, schema, or authority changes are implied by this document.
**Inputs:** [Object-Oriented Pattern Intelligence Model](./OBJECT-ORIENTED-PATTERN-INTELLIGENCE-MODEL.md), [Operational Semantic Subject Convergence Model](./OPERATIONAL-SEMANTIC-SUBJECT-CONVERGENCE-MODEL.md), [object-oriented-semantic-model.md](../object-oriented-semantic-model.md), [critical-focus.md](../critical-focus.md) (resequencing critique), and a direct read of the current `src/`, `contracts/`, and `docs/skills/` trees

---

## Revision note

The first version of this plan sequenced value objects → observation → pattern intelligence → authority → convergence → modernization → reporting, with named object types like `ExecutionMechanic`, `AuthorityFamily`, and `Query` deferred to an optional "Phase 8." [`critical-focus.md`](../critical-focus.md) argued that deferral was backwards: those canonical identities are the semantic vocabulary pattern intelligence and convergence should work *with*, not a taxonomy retrofitted underneath them afterward.

Before adopting that critique, I independently checked its central factual claim, since the last document that looked this confident in this repo turned out to be fabricated (Section 0). It holds up. The `GovernedArtifactContract` the critique wants promoted to a first-class early aggregate is real, not aspirational:

- [`docs/skills/create-governed-artifact-contract-for-executable-body-projection.skill.md`](../skills/create-governed-artifact-contract-for-executable-body-projection.skill.md) defines contract identity, interpretation base, canonical subject, workspace authority, a `project → feature → scenario → obligation → responsibility → artifact` canonical lineage chain, artifact/source/dependency/effect/runtime authority, a projection ledger, and conformance/claims.
- A real instance exists at [`contracts/serves-query-console.governed.contract.json`](../../contracts/serves-query-console.governed.contract.json) — artifacts with `sourceAuthority` (declarations, responsibilities, semantic edges, decisions, forbidden syntax kinds) and `proof` (verifier IDs, content digests).
- [`docs/canonical-lineage-authority.md`](../canonical-lineage-authority.md) confirms the same chain is enforced through foreign identifiers (`Feature.projectId`, `Scenario.featureId`, `Obligation.scenarioId`, `Responsibility.obligationId`, `Responsibility.artifactId`).

That's a close enough match to the critique's field list (`ContractIdentity`, `InterpretationBase`, `Subject`, `Workspace`, `ProjectionLedger`, `Dependencies`, `Effects`, `RuntimeAuthorities`, `Artifacts`, `Conformance`, `Receipt`, `Claims`, `CanonicalLineage`) that this is clearly a restructuring of real schema, not an invented one. Adopted.

What changed in this revision:

- Named canonical object identities (`GovernedArtifactContract`, `Feature`, `Scenario`, `Obligation`, `Responsibility`, `Artifact`, `ExecutionMechanic`, `AuthorityFamily`, `Query`, `SemanticRelationship`) move from "optional Phase 8" to **foundational** — required before pattern intelligence or convergence work is considered complete. Their *deep subclass hierarchies* (`BranchMechanic`, `DecisionAuthorityFamily`, `ObservationQuery`, etc.) still stay deferred; only the canonical identities move earlier.
- The governed-artifact contract's declared lineage becomes a first-class object graph in **Phase 2**, ahead of observed-execution objects — giving the plan a cheap, fully-deterministic first proof case before anything probabilistic (pattern matching, semantic overlap) enters the picture.
- `Query` moves to **Phase 5**, ahead of pattern intelligence, since SourceFacts is fundamentally a query system and this lets it inspect its own knowledge operations early rather than last.
- Pilots reorder: governed-contract lineage traversal is now **Pilot A**; the SQL-runner/JSON-discovery pattern families move from first pilot to third (**Pilot C**).
- Reporting gets a stronger rule: reports must contain **no independent semantic relationship logic** at all, not just "wire a projector in eventually."

What did **not** change, because the critique explicitly endorsed these parts: the additive-only migration posture, the plain-JS-over-TypeScript lean, evidence-receipt discipline, and composition-over-inheritance.

---

## 0. Resolved before this plan started circulating

Two sibling documents in this folder — **STABLE-PATTERNS-MECHANIC-INVENTORY.md** and **DETERMINISTIC-TRANSFORMATION-READINESS.md** — were found to contain fabricated evidence, not measured evidence, and have been **deleted**. Keeping the record here since the same failure mode is worth watching for as this plan executes:

- Their "Content Hash" values and "measured" per-occurrence timings (e.g. "45ms per occurrence") weren't derived from any real instrumentation.
- The SQL queries they cited (`FROM reportTestPostures`, `FROM transformationPatterns`, `FROM mechanic_analysis`, …) resolved through `src/governance/validates-report-evidence.js`, whose `createFallbackResults()` function **hardcoded** a fallback row for `mechanic_analysis` — numbers that matched the "branch" mechanic section of the inventory report exactly. The validator was built to make the report's own numbers check out, not to independently verify them.
- The two documents this plan is actually based on (`OBJECT-ORIENTED-PATTERN-INTELLIGENCE-MODEL.md` and `OPERATIONAL-SEMANTIC-SUBJECT-CONVERGENCE-MODEL.md`) are a separate, more disciplined line of work — explicit "Status: Proposed... no authority admission implied" caveats, and an evidence baseline (223 files, 11,825 symbols, 61,222 relationships, 14,830 mechanics) that is at least structurally plausible against the real query engine. I have not re-executed those queries myself, so treat those specific numbers as *unverified but not disproven* — worth a quick re-run before quoting them externally.

**Follow-up fixed:** `src/governance/validates-report-evidence.js` no longer fabricates. `createFallbackResults()` and the dead `executeSimpleSelect()` were removed; missing/empty governance data and unknown table names now throw instead of silently returning invented or empty-but-plausible rows; a related bug in `extractWhereClause` (a `WHERE` clause with nothing after it silently matched zero characters, so the query returned all rows unfiltered) was fixed alongside it; the orphaned `scripts/refresh-report-evidence-hashes.mjs` (which only ever regenerated hashes for the two deleted reports) was deleted; and `test/validates-report-evidence.test.js` was rewritten against a realistic governance-data fixture with explicit tests asserting the module fails closed.

None of this invalidates the object-oriented model itself. It was a data-hygiene issue in two now-removed documents and one validator, not a flaw in the design being proposed here.

---

## 1. What we're actually building

Two design documents already exist and are strong enough to implement directly — this plan doesn't re-derive the model, it sequences it against the real repo and adds the guardrails a team needs to review it safely.

> **SourceFacts becomes object-oriented in its semantic model, not its storage model.** SQL stays relational. The object layer is a reconstructed, bounded interpretation over query results — never a full in-memory graph of the repository, and never a replacement for the query receipts and result hashes the system already relies on for auditability.

Three planes, from the existing design:

```text
┌─────────────────────────────────────────────┐
│  SEMANTIC OBJECT PLANE                       │   ExecutionMechanic, Query, AuthorityFamily,
│  identity + behavior + relationships          │   OperationalSemanticSubject, PatternCluster...
├─────────────────────────────────────────────┤   ↑ interpreted from
│  SEMANTIC FACT PLANE                         │   classifications, lineage, authority
│                                               │   relationships, conformance, derivations
├─────────────────────────────────────────────┤   ↑ derived from
│  OBSERVATION PLANE                           │   files, symbols, AST mechanics, relationships,
│  (this is the existing SourceFacts index)    │   dataflows, query results — unchanged
└─────────────────────────────────────────────┘
```

The source documents specify five bounded contexts (source observation, semantic authority, pattern intelligence, governance/lineage, modernization planning) and one converging aggregate (`OperationalSemanticSubject`) that composes them. This plan doesn't restate those object shapes — see the linked documents for class definitions, invariants, and acceptance criteria. What follows is how to land them in *this* repo, in an order that keeps the canonical semantic vocabulary in front rather than retrofitted underneath.

---

## 2. Current-state snapshot (measured against the repo, 2026-08-07)

| Fact | Value |
|---|---|
| `src/**/*.js` files | 115 |
| Top-level `src/*.js` files (flat, no subfolder) | 21 |
| `src/governance/*.js` files | 48 |
| `test/**/*.test.js` files | 76 |
| `src/domain/` (the layout proposed by the target model) | does not exist yet |

Observations that matter for sequencing:

- **The codebase is functional, not class-based.** Naming is verb-first (`resolvesAuthoritySuccession`, `projectsRepositorySemanticAnalysis`, `classifiesMechanicOccurrence`), files export plain functions operating on plain frozen objects, and identity/invariants are enforced by hand-written `verifiesX()` guard functions rather than constructors. This is close in spirit to the target model's value objects (which favor `Object.freeze` and invariant-checking constructors) — the gap is narrower than "rewrite everything as classes" implies.
- **The governed-artifact contract is already a real, rich schema, not a stub.** `contracts/*.governed.contract.json` files already carry contract identity, canonical lineage (`project → feature → scenario → obligation → responsibility → artifact`), artifact topology, source authority, dependency/effect/runtime authority, projection ledger, and proof/conformance — see the Revision note above. This is the strongest concrete anchor for Phase 2.
- **Proto-repositories already exist.** `src/repository-image.js`, `src/repository-semantics.js`, `src/repository-execution-knowledge.js`, `src/repository-lineage-seal.js`, `src/repository-test-knowledge.js` (each duplicated under `src/sqlserver/` for the SQL-backed variant) already do the job the target model assigns to repository adapters — they return plain frozen data structures, not domain objects with behavior.
- **The query plane is already generic and receipt-bound.** `src/query.js` → `src/query-engine-loader.js` executes relational queries against a fixed set of sources (`symbols`, `relationships`, `dataflows`, `sourceReferences`, `documents`, `governanceRules`, `bodyMechanics`) via `@deterministic-solutions/sej-runtime-query`. `src/governance/report-drill-down-query-catalog.js` and `authoring-evidence-query-catalog.js` already catalog registered queries by name — a natural seam for the `Query` object in Phase 5.
- **Authority-family logic already exists as a real module.** `src/governance/mechanic-authority-families.js` already resolves mechanics to authority-family classifications — the seam for Phase 4, not a green field.
- **Governance already distinguishes lifecycle and evidence informally.** `src/governance/discovers-authority-documents.js`, `resolves-authority-succession.js`, `resolves-authority-home-status.js`, `discovers-semantic-overlap-proposals.js`, `summarizes-inference-quality.js`, `projects-feature-coverage.js`, `projects-scenario-conformance.js`, `discovers-authority-authoring-contract-map.js` already encode most of what `ArtifactLifecycle`, `LineageGraph`, `SemanticOverlap`, and the Feature/Scenario/Obligation/Responsibility chain formalize — today as ad hoc string dispositions scattered across ~48 files instead of owned objects.

Net: this is not a greenfield object-model build. It's extracting objects that are already implicit in the current code and schema, one bounded context at a time, behind adapters.

---

## 3. Non-negotiable ground rules for the transition

1. **Additive first.** Every phase introduces a new `src/domain/...` or `src/application/...` module that *reads* existing collections through a repository adapter. Nothing in `src/governance/`, `src/sqlserver/`, `contracts/`, or the query engine is deleted or behaviorally changed until an equivalent object-model path is reviewed and proven.
2. **Identity ≠ file path ≠ symbol name ≠ primary key.** Every new aggregate needs an ID that survives file moves and implementation replacement.
3. **Lifecycle is part of meaning, not metadata.** Candidate/draft/admitted/historical/generated/schema stay distinguishable everywhere — this is what stops candidate JSON from ever being read back as governing authority.
4. **Evidence class travels with every relationship.** `DETERMINISTIC | REVIEWED | INFERRED | REJECTED` on every edge. Deterministic wiring proves connection, never semantic equivalence.
5. **Composition over inheritance for operational meaning; inheritance only for stable is-a taxonomies.** `ExecutionMechanic → BranchMechanic` is fine; `OperationalSemanticSubject` should `HAS-A` facets, not extend a 6-level chain.
6. **No consolidation without proof.** Recurring shape is never itself authorization to merge code.
7. **Every object reconstruction is bound to a query receipt.** This is what keeps the object layer from becoming "a convenient graph that can't be traced back to evidence" — the exact failure mode Section 0 found.
8. **Canonical semantic identities are foundational, not a later taxonomy.** `GovernedArtifactContract`, `Feature`, `Scenario`, `Obligation`, `Responsibility`, `Artifact`, `ExecutionMechanic`, `AuthorityFamily`, `Query`, and `SemanticRelationship` must exist as stable-identity objects before pattern intelligence or convergence work is considered complete. Their deep subclass hierarchies may stay incremental.
9. **Reports contain no independent semantic relationship logic.** A report projects an object graph by calling its methods (`feature.scenarios()`, `responsibility.artifact()`); it does not re-implement joins, completeness rules, or reachability checks that the object itself should own.

---

## 4. The semantic object kernel and required-relationship model

Before implementing dozens of specific domain types, establish one universal semantic contract every canonical object conforms to. Not necessarily a literal JS base class — an interface/protocol enforced through constructors and shared tests, matching the plain-JS lean in Decision 1 below.

```text
GovernedSemanticObject
  identity()
  type()
  lifecycle()
  authority()
  provenance()
  relationships()
  requiredRelationships()
  derivations()
  evidence()
  conformance()
```

`GovernedArtifactContract`, `Feature`, `Scenario`, `Obligation`, `Responsibility`, `Artifact`, `ExecutionMechanic`, `AuthorityFamily`, `Query`, and `OperationalSemanticSubject` all conform to it. That gives SourceFacts one semantic grammar instead of each object type inventing its own shape.

### The tentacle model: objects own their required neighborhood

A first-class semantic object isn't just its own fields — it owns the relationships a reviewer or report would otherwise have to re-derive by hand:

```text
Feature
├── scenarios()
├── contract()
├── capabilities()
├── implementations()
├── interfaces()
├── provingQueries()
└── proofCoverage()

Responsibility
├── obligation()
├── scenario()
├── feature()
├── artifact()
├── mechanics()
├── authority()
├── projection()
├── embodiment()
└── proof()

ExecutionMechanic
├── source()
├── enclosingSymbol()
├── responsibility()
├── authorityFamily()
├── authorityProjection()
├── semanticNeighbors()
└── projectionReadiness()
```

These aren't utility methods — they encode **required semantic reachability**. That's what lets a large amount of current governance logic collapse into a small set of generic questions the kernel can answer for *any* object, instead of a bespoke check per report:

```text
Is the required relationship present?
Does it have the required cardinality?
Does the target have the correct lifecycle?
Is the edge deterministic, reviewed, inferred, or rejected?
Is the expected downstream semantic object reachable?
```

Concretely: `responsibility.requiredRelationships()` should be able to say `Responsibility → Artifact` is missing and return `REQUIRED_RELATIONSHIP_MISSING` generically — no `RESPONSIBILITY_NOT_EMBODIED` detector hand-written for that one case. This generic-reachability-check mechanism is what Pilot A (Phase 2, below) exists to prove.

---

## 5. Phased rollout

Each phase is scoped to be reviewable and shippable on its own.

### Phase 0 — Groundwork

- Decide plain JS + JSDoc vs. TypeScript for the new `src/domain/` layer (Open Decision 1) — affects every subsequent phase's file format.
- Stand up `src/domain/`, `src/application/`, `src/infrastructure/`, empty except for a README stating the additive-only rule.
- Inventory the current SourceFacts concepts against a small classification (`OBJECT | ATTRIBUTE | RELATIONSHIP | OBSERVATION | DERIVATION | AUTHORITY | PROJECTION | LIFECYCLE | EVIDENCE`) before scaffolding code — cheap, and it's what keeps Phase 2 from re-litigating "is this a Feature or an Obligation" mid-implementation.
- Freeze the three pilots now (Section 6), don't rediscover them mid-phase.

**Exit criteria:** empty package skeleton merged, concept inventory and pilots named in writing, no behavior change, `npm test` still green.

### Phase 1 — Semantic object kernel

Implement the generic machinery every later object shares: `SemanticObjectId`, `SemanticObjectType`, `SourceReference`, `MechanicKind`, `ArtifactLifecycle`, `CorpusPolicy`, `CoverageProfile`, `EvidenceReceipt`, `EvidenceClass`, `SemanticRelationship`, `RelationshipType`, `RelationshipCardinality`, `Derivation`, and the `GovernedSemanticObject` protocol from Section 4.

- These are pure value objects and one shared protocol — zero dependency on anything else changing.
- `ArtifactLifecycle.defaultRetrievalWeight()` and `CorpusPolicy` can be validated against a known problem once re-verified: the candidate/draft/admitted skew documented in the Pattern Intelligence doc's evidence baseline (unverified numbers per Section 0, but the shape of the problem is real).

**Exit criteria:** value-object and protocol-conformance test suite (constructor invariants, equality, canonical serialization) passes; no existing module imports or is imported by the new code yet.

### Phase 2 — Canonical contract and lineage objects

Implement `GovernedArtifactContract`, `Project`, `Feature`, `Scenario`, `Obligation`, `Responsibility`, `Artifact`, `ProjectionAuthority`, `ProofRequirement`, hydrated directly from real `contracts/*.governed.contract.json` files and the lineage chain confirmed in `docs/canonical-lineage-authority.md`.

- This is the first object graph built from **declared** authority, not inferred code meaning — fully deterministic, and the reason it comes before observation in this revision.
- Wire the first real reachability checks using the kernel from Phase 1: `Feature → Scenario → Obligation → Responsibility → Artifact → Projection`.
- **Pilot A** (Section 6) is the exit proof for this phase.

**Exit criteria:** one real governed contract loads as a traversable object graph; deliberately breaking one relationship (e.g. removing a `Responsibility.artifactId` binding in a test fixture, not in real data) produces a generic `REQUIRED_RELATIONSHIP_MISSING` from the kernel's reachability check — not a bespoke report.

### Phase 3 — Source observation objects

Implement `RepositorySnapshot`, `SourceModule`, `Symbol`, `MechanicOccurrence`, `ExecutionRelationship`, `DataflowEdge`, `CoverageProfile` as thin domain wrappers, with a repository adapter wrapping the *existing* `repository-semantics.js` / `repository-execution-knowledge.js` / `query.js` outputs — the existing files aren't touched, only wrapped.

- With Phase 2 done, this phase produces the **observed** counterpart to the **declared** graph — `DECLARED OBJECT GRAPH + OBSERVED OBJECT GRAPH` side by side is the real substrate the rest of the plan builds on.
- Aggregate invariants (every mechanic resolves to a source reference, no duplicate occurrence identities, immutability after construction) get checked against real data here.

**Exit criteria:** a `RepositorySnapshot` can be assembled for this repository itself (SourceFacts scanning SourceFacts) and its `coverage()` matches the unknown-syntax ratio the existing governance report already computes.

### Phase 4 — Authority-family objects

Make `ExecutionMechanic → AuthorityFamily` a native object relationship, wrapping the existing `src/governance/mechanic-authority-families.js`. At minimum, stable canonical identities for: `DecisionAuthorityFamily`, `IterationAuthorityFamily`, `FailureAuthorityFamily`, `ProjectionAuthorityFamily`, `SerializationAuthorityFamily`, `NormalizationAuthorityFamily`, `ValidationAuthorityFamily`, `FallbackAuthorityFamily`, `RetryAuthorityFamily`, `StateTransitionAuthorityFamily`, `TerminalResultAuthorityFamily`, `TextMeaningAuthorityFamily`.

- These need not be deep subclasses yet (ground rule 8) — stable identity and known capabilities (`recognizes(mechanic)`, `requiredSemanticFields()`) are enough for now.
- **Pilot B** (Section 6) is the exit proof for this phase.

**Exit criteria:** every `ExecutionMechanic` in a test snapshot resolves `authorityFamily()` to one of the canonical identities or explicitly reports no family, with no silent default.

### Phase 5 — Query as a semantic object

Bring `Query` in now rather than as an afterthought, wrapping the existing `report-drill-down-query-catalog.js` / `authoring-evidence-query-catalog.js` registries.

```text
Query
├── intent
├── subjectType
├── parameters
├── sources
├── traversedRelationships
├── resultContract
├── projection
├── evidenceRequirement
└── consumers
```

`ObservationQuery`, `LineageQuery`, `AuthorityQuery`, `PatternQuery`, `ConformanceQuery`, `ImpactQuery`, `ProjectionQuery`, `GovernanceQuery` are classifications on `Query` for now, not subclasses — consistent with ground rule 5.

**Exit criteria:** every currently-registered governance query resolves to one `Query` object with a non-null `subjectType`; SourceFacts can answer "which queries traverse `AuthoritySubject`?" from the object registry instead of grep.

### Phase 6 — Pattern intelligence

Implement `MechanicSignature`, `PatternMember`, `PatternCluster`, `DuplicateArtifactGroup`, `PatternAnalysisService`.

- Because Phases 2–5 already exist, pattern intelligence now operates **on** already-defined semantic objects instead of helping invent what those objects eventually are — a cleaner dependency direction than the original sequencing.
- **Pilot C** (Section 6) is the exit proof for this phase: the SQL-runner and JSON-discovery families must be recoverable as clusters, and exact duplicate files must stay separate from inferred similarity.

**Exit criteria:** both pilot-C clusters reproduced with deterministic digests; a negative control (two symbols with matching signature but different result contracts) correctly does *not* cluster as equivalent.

### Phase 7 — OperationalSemanticSubject convergence

Only start once Phases 1–6 are real, since the aggregate composes their outputs — now assembling canonical contract objects + observed execution objects + authority objects + query objects + relationship objects + review/proof objects, rather than being "the first place the system starts to feel object-oriented."

- Use the Convergence doc's own worked example as the acceptance case: assemble the `canonical-json-serialization.v1` subject from the four real `canonicalizesJson` implementations it names (`src/composition/projects-sign-in-composition.js`, `src/gallery/captures-browser-render.js`, `src/gallery/projects-gallery.js`, `src/web/inventory.js`) and confirm the assembled posture is `CANDIDATE_CONVERGENCE`, not something falsely stronger.

**Exit criteria:** all 15 acceptance criteria listed at the end of the Convergence doc pass for at least one real subject; posture never overstates confidence.

### Phase 8 — Modernization and reprojection

Implement `ConsolidationCandidate`, `RefactoringPlan`, `AuthorityProjection`, `BodyProjection`. Take the `canonical-json-serialization` subject from Phase 7 through to an actual `CanonicalJsonSerializer` consolidation, or an explicit documented decision to keep the four implementations as intentional variants.

**Exit criteria:** either a shipped `CanonicalJsonSerializer` with characterization tests and a rollback boundary, or a written decision record explaining why the four stay separate — both are valid outcomes.

### Phase 9 — Object-driven reporting and RAG

Per ground rule 9: reports stop implementing their own joins/completeness logic and become pure projections of object graphs.

```text
FeatureClosureProjection
    receives: Feature
    projects: feature.scenarios() → scenario.obligations() →
              obligation.responsibilities() → responsibility.artifact() →
              responsibility.proof()

MechanicAuthorityCoverageProjection
    receives: ExecutionMechanic
    projects: mechanic.authorityFamily() → mechanic.authorityProjection()
```

Wire an `OperationalSubjectProjector` into governance report / RAG surfaces so a real query ("where is canonical JSON serialization implemented?") returns one hydrated subject instead of disconnected function matches.

**Exit criteria:** at least one existing report (e.g. feature-closure reporting) is rewritten with zero independent relationship logic and produces the same output as before for a fixed snapshot; side-by-side comparison of old vs. new retrieval output for 3–5 real queries, reviewed by the team.

---

## 6. Pilots

Three pilots, run in phase order, each proving a different layer before the next depends on it:

**Pilot A — Governing contract (Phase 2 exit proof).** Load one real governed artifact contract and prove `Contract → Feature → Scenario → Obligation → Responsibility → Artifact` as a real traversable object graph. Then, in a test fixture only, break one relation (e.g. drop a `Responsibility → Artifact` binding) and confirm the kernel's generic reachability check reports `REQUIRED_RELATIONSHIP_MISSING` — without a custom responsibility-artifact report written for that one case.

**Pilot B — One execution mechanic (Phase 4 exit proof).** Hydrate one real mechanic and prove `ExecutionMechanic → SourceReference → Symbol → Responsibility → AuthorityFamily` resolves end to end.

**Pilot C — Pattern family (Phase 6 exit proof).** The SQL-runner family (6 known `runsSqlcmdQuery` implementations) and the JSON-discovery family (5 known `collectsJsonFiles` implementations) — small, cross-module, real duplication to point at. These were the *first* pilots in the original version of this plan; they're still valuable, just no longer the first proof of the whole architecture, since they prove pattern-matching, not the declared/observed object model underneath it.

Together: `Authority objects → Observed objects → Object relationships → Pattern intelligence` — each pilot builds on the last.

---

## 7. What does not change

- The SQL/relational index, `query.js`, `query-engine-loader.js`, and the `contracts/*.governed.contract.json` files are untouched. They remain the durable observation, query, and authority plane for the entire life of this effort.
- No existing `src/governance/*.js`, `src/sqlserver/*.js`, or `src/repository-*.js` file is deleted in Phases 0–8. They're wrapped, not replaced, until a phase explicitly proves equivalence.
- Existing tests keep passing throughout — each phase adds tests, doesn't modify passing ones, until Phase 8/9 where a consolidation or report rewrite is proven safe enough to retire old code.

---

## 8. Testing model per layer

| Layer | Required proof |
|---|---|
| Value objects / kernel protocol | Constructor invariants, equality, canonical serialization |
| Canonical contract/lineage objects | Reachability checks against real contracts; generic `REQUIRED_RELATIONSHIP_MISSING` on a broken fixture |
| Aggregates | State transitions and rejected invalid operations |
| Repository adapters | Query-plan and row-to-object reconstruction receipts |
| Authority-family objects | Every mechanic resolves to a family or an explicit "no family" — never a silent default |
| Query objects | Every registered query resolves to a non-null `subjectType` |
| Pattern services | Fixed cluster fixtures, negative similarity controls, deterministic digests |
| Semantic bridge | Exact, partial, conflict, no-match, and insufficient-evidence vectors |
| Governance | Append-only review lineage and lifecycle enforcement |
| Modernization planning | Dependency ordering, preserved variants, rollback, and acceptance criteria |
| Reporting | Same output as the pre-rewrite report for a fixed snapshot, with zero independent relationship logic in the new version |

The single highest-value negative control, worth calling out to the team explicitly: **two symbols with the same mechanic signature but different result contracts must never be admitted as semantically equivalent.** If this test doesn't exist by the end of Phase 6, the whole convergence model is at risk of becoming exactly the kind of confident-but-wrong report Section 0 of this document found.

---

## 9. Open decisions for the team

1. **Language for the domain layer.** The source docs write `class` definitions in TypeScript syntax; the repo is plain JS (`"type": "module"`, no TS build step for `src/`). Options: (a) plain JS classes/factories with runtime invariant checks, matching the repo's existing `verifiesX()` pattern; (b) introduce TS for `src/domain/` only. Recommend (a) — both this plan and the critique that reshaped it agree the important transformation is procedural-knowledge-becomes-object-owned-knowledge, not function-becomes-class.
2. **Package location.** `src/domain/`, `src/application/`, `src/infrastructure/` cross-cut the existing topic folders (`governance/`, `sqlserver/`, `web/`, `gallery/`, `composition/`, `session/`). Confirm the team wants a new top-level organizing axis (layer) rather than e.g. `src/governance/domain/`.
3. **Ownership of Phase 4 and Phase 2.** Phase 2 now carries architectural weight it didn't have in the original sequencing (the whole plan's first proof case); Phase 4 still touches ~48 existing governance files' worth of implicit logic. Both probably need named owners.
4. **How deep do authority-family and mechanic subclasses go, and when.** Ground rule 8 says canonical identities are foundational but deep subclasses (`BranchMechanic`, `DecisionAuthorityFamily`) stay incremental. Confirm the team agrees on "identity early, polymorphism only where it earns its keep" rather than building the full taxonomy in Phase 4/6.

---

## 10. Immediate next steps

1. Decide Open Decisions 1–2 above — they gate how Phase 0 is scaffolded.
2. Land Phase 0 (empty skeleton + concept inventory + three frozen pilots) as a small, reviewable PR.
3. Start Phase 1 (semantic object kernel) immediately after — Phase 2 depends on it and is now the plan's critical path.
