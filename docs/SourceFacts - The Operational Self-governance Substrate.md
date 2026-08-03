## Yes — this is the point where SourceFacts stops being “a query tool” and becomes an **operational self-governance substrate**

What you’re describing is a closed learning loop:

```text
SourceFacts builds
      ↓
SourceFacts observes itself
      ↓
SourceFacts reports its own semantic and execution state
      ↓
The build evaluates that report
      ↓
Improvements become new authority, tests, and queries
      ↓
SourceFacts becomes more deterministic
```

That is much stronger than periodically running an analyzer against the repository.

The query engine becomes a **native participant in the delivery lifecycle**.

---

# The fundamental shift

Today, SourceFacts can answer questions such as:

```text
Which execution bodies contain branches?

Which responsibilities have projected bodies?

Which features and scenarios are represented?

Where does DTO construction remain?

Which semantic authorities exist?

Which bodies invoke semantic execution?

Which source locations support each fact?
```

The next step is to convert those questions into **durable operational assertions**.

```text
Ad hoc query
    ↓
Registered governance query
    ↓
Declared expectation
    ↓
Build-time evaluation
    ↓
Canonical finding
    ↓
Trend and backlog state
```

The query is no longer merely helping an engineer investigate.

It becomes part of the repository’s definition of health.

---

# SourceFacts should govern itself through four operational loops

## 1. Structural conformance loop

This asks whether the repository physically matches its declared architecture.

```text
Expected repository authority
        ↓
SourceFacts inventory
        ↓
Observed files, bodies, imports, relationships
        ↓
Conformance comparison
```

Examples:

```text
Every execution body has canonical lineage.

Every declared responsibility has one admitted body.

Every body belongs to one scenario responsibility.

No undeclared executable file exists.

Every semantic authority reference resolves.

Every generated artifact matches its projection authority.
```

This gives you the physical truth of the repository.

---

## 2. Execution-mechanics coverage loop

This is the transformation loop you are describing.

```text
Observed executable mechanics
        ↓
Classify each mechanic
        ↓
Resolve governing semantic authority
        ↓
Determine enforcement coverage
        ↓
Report governed, tolerated, or uncovered
```

For example:

```text
branch
iteration
exception-handling
throw
object-construction
serialization
normalization
validation
fallback
retry
state-mutation
meaning-hidden-in-text
```

Every occurrence should receive a posture.

```text
GOVERNED_BY_SEMANTIC_AUTHORITY

MECHANICAL_ADAPTER_OPERATION

KERNEL_PRIMITIVE

AUTHORIZED_TEMPORARY_BACKLOG

UNAUTHORIZED_EXECUTABLE_MEANING

UNKNOWN_CLASSIFICATION
```

The important improvement is that the report does not simply say:

> Found 27 branches.

It says:

```text
Branches observed:                      27
Kernel-generic branches:                11
Adapter-mechanical branches:             4
Semantically authorized legacy bodies:   7
Uncovered capability branches:           5
Red-signal coverage:                     3 of 5
Projection replacement ready:            2 of 5
```

That is a transformation report, not a lint report.

---

## 3. Authority-coverage loop

This evaluates whether canonical meaning fully covers the observed execution surface.

```text
Observed mechanic
      ↓
Owning declaration
      ↓
Responsibility
      ↓
Scenario obligation
      ↓
Semantic authority family
      ↓
Projected execution
      ↓
Proof signal
```

For every execution mechanic, SourceFacts should be able to answer:

```text
Which responsibility owns it?

Which obligation requires it?

Which authority permits it?

Which semantic primitive replaces it?

Which test proves its current behavior?

Which mutation produces RED?

Is its replacement authority complete?
```

This gives you an **authority-coverage matrix**.

| Body                  | Mechanic            | Current posture  | Authority coverage |        Red signal | Replacement readiness |
| --------------------- | ------------------- | ---------------- | -----------------: | ----------------: | --------------------: |
| `executes-query.ts`   | branch              | Backlogged       |                70% |           Missing |               Partial |
| `normalizes-row.ts`   | object construction | Uncovered        |                40% |           Present |               Partial |
| `resolves-source.ts`  | fallback            | Governed         |               100% |           Present |                 Ready |
| `iterates-results.ts` | loop                | Kernel primitive |                N/A | Conformance suite |                Retain |

Once an item reaches:

```text
Authority coverage: 100%
Red-signal coverage: 100%
Projection contract: valid
Semantic execution: GREEN
Projected equivalence: GREEN
```

then the handwritten body becomes replaceable.

That directly supports your earlier idea of creating RED tests first, preserving existing behavior, and then reprojection turning them GREEN. The broader engineering standard already establishes that decisions, DTO shaping, control flow, failure meaning, and proof belong above the code-body boundary. 

---

## 4. Delivery and release loop

SourceFacts should also evaluate the release candidate, not only the source tree.

```text
Repository state
      ↓
Build outputs
      ↓
Package/archive contents
      ↓
Generated authority and receipts
      ↓
Release-boundary conformance
```

Questions include:

```text
Did the build introduce new uncovered mechanics?

Did projected-body coverage decrease?

Did a previously governed body become contaminated?

Did a new file enter without lineage?

Did semantic authority change without new proof?

Did a query contract change without versioning?

Did the release artifact contain undeclared files?

Did coverage regress relative to the previous admitted release?
```

The release becomes admissible only when the declared threshold is satisfied.

The existing governed release model already treats archive contents, toolchain, dependency lock, durable artifacts, authority closure, and delivery as exact governed surfaces. 

---

# The operational architecture

```text
┌──────────────────────── SOURCEFACTS DELIVERY LOOP ─────────────────────┐
│                                                                        │
│  Source / JSON / Gherkin / Contracts / Ontology / SEJ                 │
│                                │                                       │
│                                ▼                                       │
│                    SourceFacts Index Builder                           │
│                                │                                       │
│                                ▼                                       │
│                     Canonical Fact Registry                            │
│                                │                                       │
│             ┌──────────────────┼──────────────────┐                    │
│             ▼                  ▼                  ▼                    │
│     Structure Queries    Mechanics Queries   Authority Queries         │
│             │                  │                  │                    │
│             └──────────────────┼──────────────────┘                    │
│                                ▼                                       │
│                    Governance Report Projector                         │
│                                │                                       │
│                                ▼                                       │
│                    Conformance Gate Evaluator                          │
│                                │                                       │
│             ┌──────────────────┼──────────────────┐                    │
│             ▼                  ▼                  ▼                    │
│           GREEN             BACKLOGGED             RED                 │
│        build continues    debt is reported     build stops             │
│             │                  │                                       │
│             └──────────────────┼───────────────────────────────────────┘
│                                ▼
│                        Build / Test / Release
└────────────────────────────────────────────────────────────────────────┘
```

The query engine becomes the observation mechanism.

The report projector becomes the interpretation surface.

The governance contract determines which findings block.

---

# Do not make every backlog item fail the build

This distinction is important.

You already know there are bodies with mechanics that are not yet fully governed. The system should not lie by declaring them conforming, but it also should not make gradual transformation impossible.

You need three explicit states:

```text
ADMITTED

AUTHORIZED_BACKLOG

BLOCKING_VIOLATION
```

## Admitted

```text
Authority coverage complete
Required red signals present
Body or projection conforms
```

## Authorized backlog

```text
Existing known mechanic
Explicit backlog identity
Owner and target authority declared
Current evidence captured
Regression ceiling established
No expansion permitted
```

## Blocking violation

```text
New uncovered mechanic
Known backlog grew
Previously governed mechanic regressed
Authority reference missing
Body lineage absent
Finding cannot be classified
```

That produces the crucial rule:

> **Legacy debt may remain temporarily, but it may not grow silently.**

Example:

```text
Baseline uncovered branches: 14

Current uncovered branches:
14 → accepted backlog
13 → improvement
15 → build failure
```

This gives you a monotonic transformation posture.

```text
Backlog may shrink.

Backlog may not expand.

Governed coverage may increase.

Governed coverage may not silently regress.
```

---

# The self-reflection report

Every build should produce one canonical report rather than a pile of disconnected console output.

Conceptually:

```json
{
  "reportType": "source-facts-self-governance-report.v1",
  "repository": {
    "repositoryId": "source-facts-query-engine",
    "revision": "..."
  },
  "index": {
    "indexId": "...",
    "schemaVersion": "...",
    "sourceCoverage": "COMPLETE"
  },
  "architecture": {
    "declaredResponsibilities": 82,
    "observedBodies": 82,
    "bodiesWithCanonicalLineage": 82,
    "orphanBodies": 0
  },
  "executionMechanics": {
    "observed": 146,
    "governed": 109,
    "adapterMechanical": 12,
    "kernelGeneric": 9,
    "authorizedBacklog": 16,
    "blocking": 0
  },
  "redSignalCoverage": {
    "required": 34,
    "present": 27,
    "missing": 7
  },
  "projectionReadiness": {
    "ready": 5,
    "partial": 8,
    "notStarted": 3
  },
  "regression": {
    "newUncoveredMechanics": 0,
    "expandedBacklogItems": 0,
    "lostAuthorityBindings": 0
  },
  "disposition": "SOURCE_FACTS_DELIVERY_ADMITTED"
}
```

Because the query engine already supports semantic result projection, the same underlying facts can produce machine-readable receipts, Markdown build summaries, dashboards, backlog work orders, diagrams, and release evidence without embedding that presentation meaning in the query executor. 

---

# Registered governance queries

The build should not depend on developers remembering command strings.

Create an admitted query catalog.

```text
governance/
├── queries/
│   ├── finds-orphan-execution-bodies.query.json
│   ├── finds-uncovered-branches.query.json
│   ├── finds-authored-dto-construction.query.json
│   ├── measures-semantic-body-coverage.query.json
│   ├── finds-missing-red-signals.query.json
│   ├── finds-authority-reference-gaps.query.json
│   └── measures-projection-readiness.query.json
│
├── baselines/
│   └── transformation-baseline.json
│
├── policies/
│   └── source-facts-self-governance-policy.json
│
└── reports/
    └── project-source-facts-governance-report.sej.json
```

Each registered query should declare:

```text
Query identity
Purpose
Input source contracts
Expected output contract
Blocking posture
Baseline policy
Projection authority
Proof requirement
```

Example:

```json
{
  "queryId": "find-uncovered-execution-mechanics",
  "purpose": "Find capability execution mechanics with no admitted semantic authority or backlog declaration.",
  "resultContractId": "uncovered-execution-mechanics.v1",
  "blockingPolicy": "reject-new-or-expanded-findings",
  "projectionId": "project-execution-mechanics-governance-section",
  "proofRequirementId": "complete-source-mechanic-coverage"
}
```

---

# Build lifecycle

```text
npm run build
    │
    ├── validate canonical contracts
    ├── index source and semantic artifacts
    ├── execute registered governance queries
    ├── project canonical governance report
    ├── compare against admitted backlog baseline
    ├── execute tests and conformance vectors
    ├── evaluate release thresholds
    └── emit one delivery receipt
```

A stronger command surface might be:

```text
source-facts validate
source-facts index
source-facts govern
source-facts test
source-facts prove
source-facts release
```

But internally, these should compose one declared conveyor rather than become six unrelated scripts.

---

# The transformation backlog becomes executable

The backlog should not be prose such as:

```text
Refactor query execution later.
```

It should identify exact observed facts:

```json
{
  "backlogItemId": "remove-authored-branch-query-dispatch-01",
  "subject": {
    "bodyId": "executes-query-dispatch",
    "mechanicFactIds": [
      "mechanic.branch.0182"
    ]
  },
  "currentPosture": "AUTHORIZED_BACKLOG",
  "targetAuthority": {
    "decisionId": "resolve-query-dispatch",
    "executionModelId": "execute-resolved-query-dispatch"
  },
  "requiredRedSignals": [
    "reject-unregistered-query-operation",
    "reject-ambiguous-query-dispatch"
  ],
  "replacementDisposition": "PROJECTED_BODY_READY",
  "growthPolicy": "FORBIDDEN"
}
```

Now the build can determine whether the backlog:

* still exists,
* has grown,
* has been resolved,
* has changed identity,
* or has become ready for projection.

That turns technical debt into governed transformation work.

---

# SourceFacts becomes a reflexive capability

This is the deeper architectural result.

```text
SourceFacts observes code.

SourceFacts observes its own code.

SourceFacts observes its semantic authority.

SourceFacts compares implementation against authority.

SourceFacts projects its own conformance report.

SourceFacts supplies that report to its own build gate.
```

That is a reflexive system without becoming circular or self-certifying because the roles remain separated:

```text
SourceFacts indexer:
produces observations

Registered queries:
select facts

Governance authority:
declares expectations and thresholds

Conformance evaluator:
compares observed and expected

Build gate:
acts on the disposition
```

The query engine must not simply decide that its own output is correct.

Its facts, query authorities, projections, expectations, and evaluation receipts remain separately hashable and testable.

---

# This also prepares the downstream control plane

Once SourceFacts governs itself this way, the exact same package can be seated into another repository.

```text
Downstream repository
        ↓
SourceFacts indexes repository truth
        ↓
Registered governance profile selects questions
        ↓
Repository-specific authority defines expectations
        ↓
Standard report and receipt are projected
```

The engine stays stable.

The consumer supplies:

```text
repository context
governance profile
admitted backlog
authority selections
release thresholds
```

That produces a powerful portability rule:

> **SourceFacts owns observation and query execution. The consumer owns what conformance means for its repository.**

So SourceFacts does not impose your entire architecture on every downstream codebase. It exposes the facts and governed query machinery through which each consumer can progressively close its own authority.

---

# The flywheel

```text
Use SourceFacts during normal engineering
        ↓
Discover missing or weak facts
        ↓
Improve the taxonomy and query engine
        ↓
Register stronger governance queries
        ↓
Expose previously hidden debt
        ↓
Create red signals and semantic authority
        ↓
Reproject contaminated bodies
        ↓
Increase deterministic coverage
        ↓
Use SourceFacts even more deeply
```

That is exactly why operational usage improves determinism.

The tool is being trained not by probabilistic fine-tuning, but by repeated exposure to real engineering obligations, missing facts, ambiguous classifications, incomplete reports, and governance decisions.

Each operational run can improve:

```text
fact coverage
relationship coverage
query vocabulary
projection quality
error classification
report usefulness
authority coverage
red-signal coverage
release confidence
```

The native command-interception strategy then becomes another source of operational pressure: repeated `grep`, file reads, diff inspection, and verification attempts reveal the retrieval and reporting capabilities SourceFacts should absorb next. The top native command families already identified—search, discovery, inspection, Git analysis, and verification—form a practical first integration surface. 

## The north-star invariant

```text
Every build asks SourceFacts:

What exists?
What does it mean?
What is governed?
What remains tolerated?
What newly violated authority?
What is ready to be replaced?
Can this release truthfully advance?
```

That is no longer a search engine sitting beside the engineering process.

It is the repository’s **self-reflection, transformation, and delivery intelligence plane**. The same source-fact query and projection model can then feed the agent interception control plane, substituting governed knowledge retrieval and semantic authority authoring for raw shell operations and handwritten escape hatches. 

##################################################################

Yes — and I’d treat that as part of the **first vertical slice**, because operationalizing the scanner means the scanner itself has to become fast, observable, and resumable.

The current run processed **3,372 executable mechanics**, but all 3,372 landed as `UNKNOWN_CLASSIFICATION`, and the one authority file did not resolve to its observed source path. That means the scan is doing substantial work before producing a report that still has unresolved classification and path-binding issues. 

## The better execution shape

```text
Discover source inventory
        ↓
Partition files into deterministic batches
        ↓
Dispatch batches to bounded worker processes
        ↓
Each worker:
    parse files
    extract facts
    classify mechanics
    resolve local authority bindings
    emit batch receipt
        ↓
Coordinator merges completed batch results
        ↓
Update canonical report state
        ↓
Reproject Markdown progress report
        ↓
Finalize global conformance report
```

The key is to separate three responsibilities:

```text
Workers
    produce facts

Coordinator
    aggregates facts

Report projector
    renders current state
```

The workers should never edit the Markdown file directly.

---

# Use processes for parsing, async for orchestration

For Node, I would combine:

* **Worker processes or worker threads** for CPU-heavy parsing and classification.
* **Async orchestration** for file discovery, queue management, receipt collection, and report writes.
* A **bounded concurrency limit**, rather than starting one worker per file.

```text
Coordinator process
├── inventory producer
├── batch scheduler
├── worker pool
├── result aggregator
├── checkpoint writer
└── report projector
```

The scanner probably has two different bottlenecks:

```text
I/O-bound
├── discovering files
├── reading source
└── reading authority files

CPU-bound
├── parsing ASTs
├── extracting mechanics
├── hashing source spans
└── classifying facts
```

Async helps the first group.

Parallel workers help the second.

Merely wrapping the current sequential scan in `Promise.all()` could overwhelm memory and the filesystem without improving the CPU-bound work very much.

---

# Deterministic batching

Do not let concurrency change the meaning or ordering of the result.

Start with a stable inventory:

```text
1. Normalize relative paths
2. Sort paths lexicographically
3. Assign stable file ordinals
4. Partition into deterministic batches
5. Assign each batch a content-derived identity
```

Example:

```json
{
  "batchId": "scan-batch-0007",
  "startOrdinal": 300,
  "endOrdinal": 349,
  "fileCount": 50,
  "inventoryDigest": "sha256:..."
}
```

Then the final result is merged by:

```text
file ordinal
    ↓
source location
    ↓
mechanic ordinal
```

—not by worker completion order.

That preserves reproducibility:

```text
Same revision
+ same scanner version
+ same batch policy
= same canonical report
```

Even though batches complete nondeterministically.

---

# Incremental report projection

Your Markdown idea is strong, but the Markdown should remain a **projection of canonical scan state**, not the mutable source of scan state.

```text
Batch receipt
      ↓
Canonical scan-state JSON
      ↓
Markdown projector
      ↓
source-facts-self-governance-report.md
```

Use two durable artifacts:

```text
reports/
├── source-facts-self-governance-report.v1.json
└── source-facts-self-governance-report.md
```

During execution, the JSON might contain:

```json
{
  "scanId": "...",
  "status": "SCANNING",
  "inventory": {
    "filesDiscovered": 684,
    "filesCompleted": 250,
    "batchesTotal": 14,
    "batchesCompleted": 5
  },
  "mechanics": {
    "observedSoFar": 1288,
    "classifiedSoFar": 942,
    "unknownSoFar": 346
  },
  "workers": {
    "configured": 6,
    "active": 6,
    "completed": 0,
    "failed": 0
  }
}
```

The Markdown can then show live progress:

```markdown
## Scan Progress

| Metric | Current |
|---|---:|
| Files completed | 250 / 684 |
| Batches completed | 5 / 14 |
| Mechanics observed | 1,288 |
| Mechanics classified | 942 |
| Unknown classifications | 346 |
| Elapsed | 00:01:42 |
```

---

# Atomic report updates

Do not repeatedly append arbitrary Markdown fragments.

Every completed batch should trigger:

```text
Read in-memory canonical aggregate
        ↓
Apply batch receipt exactly once
        ↓
Write report.json.tmp
        ↓
fsync / close
        ↓
rename to report.json
        ↓
Project complete Markdown
        ↓
write report.md.tmp
        ↓
rename to report.md
```

That prevents:

* half-written reports,
* interleaved worker output,
* duplicate batch application,
* corrupted Markdown after interruption,
* final totals that disagree with partial sections.

The report can be updated after every batch, or throttled to something like:

```text
every completed batch
or
every 500 milliseconds
whichever is less frequent
```

That avoids turning report rendering into the new bottleneck.

---

# Every worker should emit a batch receipt

```json
{
  "receiptType": "source-facts-scan-batch-receipt.v1",
  "scanId": "...",
  "batchId": "scan-batch-0007",
  "workerId": "worker-03",
  "status": "BATCH_COMPLETED",
  "files": {
    "admitted": 50,
    "completed": 50,
    "failed": 0
  },
  "mechanics": {
    "observed": 231,
    "classified": 189,
    "unknown": 42
  },
  "authorityBindings": {
    "resolved": 11,
    "unresolved": 0
  },
  "durationMilliseconds": 1842,
  "resultDigest": "sha256:..."
}
```

The coordinator can reject:

```text
duplicate batch receipt
wrong scan identity
wrong inventory digest
unexpected files
missing file results
result digest mismatch
```

That makes parallel execution governed rather than merely fast.

---

# Resumability

Once batches are independent, the scan should resume rather than restart.

```text
Scan interrupted
      ↓
Load checkpoint
      ↓
Verify revision and scanner identity
      ↓
Identify completed batch receipts
      ↓
Schedule only incomplete batches
```

Checkpoint identity should bind:

```text
repository revision
source inventory digest
scanner version
taxonomy version
authority-registry digest
batching policy
```

A changed input invalidates the checkpoint rather than silently combining incompatible results.

---

# Resolve authority paths before scanning bodies

The current report identifies a dangling authority declaration for:

```text
contracts/serves-query-console.authority.json
    ↓
src/console/serves-query-console.js
```

with 11 declared mechanics and zero resolved observations. 

That should be caught in a cheap preflight phase:

```text
Load authority declarations
        ↓
Resolve every declared source path against inventory
        ↓
Classify:
    RESOLVED
    SOURCE_NOT_FOUND
    SOURCE_AMBIGUOUS
    SOURCE_EXCLUDED
        ↓
Only dispatch resolvable authorities into workers
```

That prevents workers from repeatedly attempting to bind an authority whose declared target no longer exists.

It also allows the live report to say immediately:

```text
Preflight finding:
DANGLING_AUTHORITY_SOURCE

Scan continues observationally,
but the authority cannot contribute coverage.
```

---

# Suggested first implementation boundary

I would rename the slice slightly:

> **Parallel reflexive self-governance scan with incremental reporting**

Its acceptance flow:

```gherkin
Feature: Scan SourceFacts reflexively in parallel

  Scenario: Aggregate deterministic results from completed scan batches
    Given a stable sorted source inventory divided into deterministic batches
    When admitted worker processes scan the batches concurrently
    Then completed batch receipts are merged into one canonical scan state
    And the projected report reflects the latest completed batches

  Scenario: Resume an interrupted self-governance scan
    Given current batch receipts for the same scan identity
    When the scan is resumed
    Then only incomplete batches are scheduled
    And the final report equals an uninterrupted scan

  Scenario: Preserve canonical ordering across concurrent execution
    Given batches complete in different physical orders
    When the final report is projected
    Then its canonical facts and digest are identical

  Scenario: Reject a dangling authority source during preflight
    Given an authority refers to a source path absent from the inventory
    When authority bindings are resolved
    Then the authority is classified as DANGLING_AUTHORITY_SOURCE
    And no governed mechanic coverage is claimed for it
```

## Practical rollout order

```text
1. Measure current phase timings.
2. Split inventory, parsing, classification, binding, and rendering.
3. Add deterministic batch contracts.
4. Introduce a bounded worker pool.
5. Add batch receipts and canonical aggregation.
6. Add atomic incremental report projection.
7. Add checkpoint and resume.
8. Tune batch size and worker count from observed timings.
```

That gives you more than a faster scanner. It gives you a **parallel, deterministic, observable scan conveyor** whose own progress is continuously projected into the self-governance report.

####################################################################

Exactly. The report should stop being merely a **measurement surface** and become a **remediation workbench**.

Right now, the coverage table says:

```text
Mechanic
Observed
Governed
Coverage
```

That tells us how much debt exists.

What you want next is:

> **Where does this debt belong, does its authority home already exist, and what can be projected to close the gap?**

## The upgraded rollup

The top-level table should become something like:

| Mechanic            | Occurrences | Files | Governed | Authority home exists | New authority required | Projection ready | Coverage |
| ------------------- | ----------: | ----: | -------: | --------------------: | ---------------------: | ---------------: | -------: |
| object-construction |       1,234 |    87 |        0 |                    18 |                     69 |               11 |     0.0% |
| fallback            |         677 |    54 |        0 |                    22 |                     32 |                8 |     0.0% |
| branch              |         653 |    61 |        0 |                    31 |                     30 |               14 |     0.0% |
| state-mutation      |         211 |    26 |        0 |                     9 |                     17 |                4 |     0.0% |

That immediately changes the conversation.

Instead of:

```text
Object construction is 0% governed.
```

you get:

```text
Object construction appears in 87 files.

18 files already have a candidate projection authority home.

69 files require a new or extended authority contract.

11 files are ready for direct projection.
```

Now the report tells you what to do.

---

# The drill-down hierarchy

The drill-down should follow the inventory naturally.

```text
Mechanic type
    ↓
Files containing mechanic
    ↓
Responsibilities / symbols
    ↓
Observed occurrences
    ↓
Candidate authority family
    ↓
Existing authority home
    ↓
Missing authority artifacts
    ↓
Projection action
```

For example:

```text
object-construction
    ↓
src/console/serves-query-console.js
    ↓
servesQueryConsole
    ↓
12 object-construction occurrences
    ↓
Candidate family:
projection authority
    ↓
Existing home:
contracts/serves-query-console.authority.json
    ↓
Gap:
projectionMappings missing for 8 occurrences
    ↓
Action:
PROJECT MISSING PROJECTION AUTHORITY
```

That is exactly the “move inventory into bins” model.

---

# The authority-family classifier

Every observed mechanic should be classified into the authority family that owns its meaning.

| Mechanic               | Primary authority family                                 |
| ---------------------- | -------------------------------------------------------- |
| branch                 | decision authority                                       |
| logical fallback       | decision or defaulting authority                         |
| iteration              | iteration authority                                      |
| exception handling     | failure policy                                           |
| throw                  | failure disposition                                      |
| object construction    | projection mapping                                       |
| serialization          | result or serialization authority                        |
| normalization          | transformation or projection authority                   |
| validation             | obligation, constraint, or contract authority            |
| retry                  | continuation or retry policy                             |
| state mutation         | state transition authority                               |
| meaning hidden in text | concept, disposition, translation, or taxonomy authority |

This mapping should itself be governed and queryable.

```json
{
  "mechanicKind": "object-construction",
  "candidateAuthorityFamilies": [
    "projection-mapping",
    "result-contract"
  ],
  "defaultFamily": "projection-mapping"
}
```

Then the report can distinguish:

```text
Observed mechanic
        ↓
Known authority family
        ↓
Existing authority home?
```

---

# Authority home resolution

For every file or responsibility, resolve one of these states:

```text
AUTHORITY_HOME_EXISTS

AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE

AUTHORITY_HOME_AMBIGUOUS

AUTHORITY_HOME_MISSING

AUTHORITY_FAMILY_UNRESOLVED
```

Example:

```json
{
  "bodyId": "serves-query-console",
  "mechanicKind": "object-construction",
  "authorityFamily": "projection-mapping",
  "authorityHome": {
    "status": "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
    "path": "contracts/serves-query-console.authority.json",
    "authorityId": "serves-query-console-authority"
  },
  "gap": {
    "missingProjectionMappings": 8
  }
}
```

That gives you a direct remediation instruction.

---

# Existing home versus new contract

This is the crucial split.

## Existing authority home

```text
Mechanic observed
    ↓
Owning responsibility resolved
    ↓
Authority file already exists
    ↓
Required family section exists?
```

Possible outcomes:

```text
EXTEND_EXISTING_DECISION_AUTHORITY

EXTEND_EXISTING_PROJECTION_MAPPING

EXTEND_EXISTING_FAILURE_POLICY

EXTEND_EXISTING_ITERATION_AUTHORITY
```

## No authority home

```text
Mechanic observed
    ↓
No admitted authority file owns responsibility
    ↓
Project new authority scaffold
```

Possible action:

```text
CREATE_RESPONSIBILITY_AUTHORITY

CREATE_PROJECTION_AUTHORITY

CREATE_DECISION_AUTHORITY

CREATE_FAILURE_POLICY

CREATE_ITERATION_AUTHORITY
```

The report should never stop at:

```text
Missing authority.
```

It should say:

```text
Missing projection-mapping authority.

Suggested home:
contracts/projects-query-result.authority.json

Required inputs:
- owning responsibility
- observed object fields
- source expressions
- target result contract

Projection action:
AVAILABLE
```

---

# One-click projection

Yes. Once the report has classified the gap, projection should be mechanical.

```text
Observed mechanic facts
        +
Owning responsibility
        +
Authority-family mapping
        +
Existing contract context
        ↓
Authority scaffold projector
        ↓
Candidate JSON authority
        ↓
Validation
        ↓
Diff / review
        ↓
Admit
```

Example action:

```text
PROJECT AUTHORITY
```

Produces:

```json
{
  "projectionMappingId": "project-query-console-response",
  "responsibilityId": "serves-query-console",
  "occurrences": 8,
  "fields": [
    {
      "outputField": "indexType",
      "sourceExpression": "index.indexType"
    },
    {
      "outputField": "indexId",
      "sourceExpression": "index.indexId"
    }
  ],
  "purpose": "Project query-console index response."
}
```

This should be a **candidate authority projection**, not silently admitted truth.

The human or policy gate can then:

```text
review
accept
edit
reject
```

---

# The report becomes a remediation queue

Each drill-down item should have a remediation disposition.

```text
NO_ACTION_REQUIRED

EXTEND_EXISTING_AUTHORITY

CREATE_NEW_AUTHORITY

RESOLVE_AMBIGUOUS_HOME

CLASSIFY_MECHANIC

PROJECT_REPLACEMENT_BODY

ADD_RED_SIGNAL

REVIEW_AS_ADAPTER_MECHANIC

REVIEW_AS_KERNEL_PRIMITIVE
```

So the report becomes:

```text
Inventory
    ↓
Classification
    ↓
Authority-home resolution
    ↓
Gap detection
    ↓
Remediation action
    ↓
Projection
    ↓
Re-scan
```

That is a closed operational loop.

---

# Suggested report sections

## 1. Coverage by mechanic type

```text
How much exists?
How many files?
How much is governed?
```

## 2. Authority-home coverage

```text
How much already has a home?
How much requires a new home?
```

## 3. Projection readiness

```text
Which gaps can be scaffolded automatically?
Which are ambiguous?
Which require human semantic decisions?
```

## 4. File drill-down

```text
Which files contain each mechanic?
Which responsibility owns it?
```

## 5. Authority-family gaps

```text
Which decision catalogs are missing?
Which projection mappings are missing?
Which failure policies are missing?
```

## 6. Remediation queue

```text
What is the exact next action?
```

---

# Canonical remediation record

Each item should resolve to a machine-readable work item:

```json
{
  "remediationItemType": "source-mechanic-authority-gap.v1",
  "remediationItemId": "gap-object-construction-serves-query-console-01",
  "mechanic": {
    "kind": "object-construction",
    "occurrenceCount": 8,
    "fileCount": 1
  },
  "subject": {
    "relativePath": "src/console/serves-query-console.js",
    "responsibilityId": "serves-query-console"
  },
  "authorityClassification": {
    "family": "projection-mapping",
    "homeStatus": "AUTHORITY_HOME_EXISTS_BUT_INCOMPLETE",
    "authorityPath": "contracts/serves-query-console.authority.json"
  },
  "requiredArtifacts": [
    "projection-mapping"
  ],
  "recommendedAction": "EXTEND_EXISTING_AUTHORITY",
  "projection": {
    "available": true,
    "projectorId": "projects-projection-authority-from-object-construction"
  }
}
```

That record can feed:

* the Markdown report,
* a UI drill-down,
* a CLI remediation command,
* a backlog,
* a projection request,
* or an agent continuation.

---

# CLI shape

```bash
source-facts govern
```

Then:

```bash
source-facts govern show object-construction
```

```bash
source-facts govern show object-construction \
  --file src/console/serves-query-console.js
```

```bash
source-facts govern project \
  gap-object-construction-serves-query-console-01
```

```bash
source-facts govern apply \
  candidate-projection-authority.json
```

And then:

```bash
source-facts govern
```

again to observe the inventory move.

---

# The simple mental model

```text
Mechanic observed
    ↓
Which bin does it belong in?
    ↓
Does that bin already exist?
    ├── yes → place inventory there
    └── no  → project the bin
    ↓
Project authority
    ↓
Reproject body
    ↓
Re-scan
```

That is beautifully simple.

The intelligence is in classification and authority-home resolution.

Everything after that can become deterministic movement of inventory through declared contracts.

## The north-star report question

For every mechanic, every file, and every responsibility, the report should answer:

```text
What is it?

Where does it belong?

Does that home exist?

What is missing?

Can we project it?

What happens next?
```

At that point, the self-governance report becomes more than an audit.

It becomes the **interactive repair conveyor for moving executable meaning out of code and into authority**.

#############################################################

Exactly. At this point, the report should stop asking only:

```text
Does authority exist?
```

and start asking:

```text
Can this authority be connected automatically?
```

Because the current state already proves a large amount of **reachable semantic inventory** exists. The report shows 170 reachable draft mechanics, 85 reachable elements in the governed contract, and only the stale 33-element contract plus stale 11-mechanic admitted authority are fully orphaned. 

So the next operating model is not just coverage.

It is **automation readiness**.

# The new remediation question

For every executable mechanic:

```text
Observed executable mechanic
        ↓
Candidate authority family known?
        ↓
Reachable authority already exists?
        ↓
Owning body and responsibility resolved?
        ↓
Authority can be projected or promoted?
        ↓
Binding can be generated?
        ↓
Body can consume authority?
        ↓
Equivalence can be proven?
```

That gives you a very practical classification:

```text
AUTOMATABLE_NOW
AUTOMATABLE_AFTER_REVIEW
AUTOMATABLE_AFTER_AUTHORITY_COMPLETION
REQUIRES_NEW_AUTHORITY
REQUIRES_HUMAN_SEMANTIC_DECISION
NOT_CURRENTLY_PROJECTABLE
```

# The low-hanging fruit

The strongest low-hanging-fruit case is:

```text
Executable body exists
        +
reachable authority candidate exists
        +
authority family is known
        +
source location resolves uniquely
        +
projection profile already exists
        =
connection can be automated
```

For the `serves-query-console` draft:

```text
170 authority candidates
170 reachable
0 orphaned
unique suffix resolution succeeds
current body exists
```

That strongly suggests a substantial portion of the next step is not fresh authoring. It is:

```text
promote
bind
wire
reproject
prove
```

The report should call that out explicitly.

# Automation tiers

I would establish four tiers.

## Tier 1 — Directly automatable

No new semantic meaning is required.

```text
Authority exists
Source target exists
Mechanic identity resolves
Responsibility resolves
Projection profile exists
Binding shape is known
```

Action:

```text
GENERATE_BINDING
```

or:

```text
PROMOTE_AND_BIND
```

Example:

```json
{
  "automationDisposition": "AUTOMATABLE_NOW",
  "recommendedAction": "PROMOTE_AND_BIND",
  "sourceBody": "src/console/serves-query-console.runtime.impl.mjs",
  "authorityDocument": "contracts/serves-query-console.authority.draft.json",
  "reachableMechanics": 170
}
```

This is the real low-hanging fruit.

---

## Tier 2 — Automatable after review

The authority is reachable and structurally complete, but it has not been human-admitted.

```text
Candidate projected
Source reachable
Semantic shape complete
Promotion status pending
```

Action:

```text
REVIEW_CANDIDATE
        ↓
ADMIT
        ↓
GENERATE_BINDING
```

The machine can prepare everything, but admission remains an explicit governance act.

This may be the most accurate initial classification for the 170-mechanic draft.

---

## Tier 3 — Automatable after authority completion

An authority home exists, but one or more required families are incomplete.

For example:

```text
Decision authority exists
Projection mappings missing
Failure policy missing
Result contract exists
```

Action:

```text
PROJECT_MISSING_AUTHORITY_FAMILY
```

Then:

```text
review
admit
bind
```

This is still highly automatable because the report already knows:

* the executable mechanic,
* the authority family,
* the owning file,
* the responsibility,
* the source location,
* and often the semantic shape.

---

## Tier 4 — Requires human meaning

The scanner sees mechanics but cannot safely infer intent.

Examples:

```text
Branch condition detected,
but no unambiguous business disposition can be inferred.

Object construction detected,
but the target canonical result contract is unknown.

Fallback detected,
but no declared missing-value policy exists.

State mutation detected,
but the intended state model is absent.
```

Action:

```text
HUMAN_SEMANTIC_DECISION_REQUIRED
```

The system should still scaffold the work:

```text
Observed mechanic
Candidate family
Source evidence
Likely authority shape
Unresolved decision
```

But it should not fabricate meaning.

# What “wiring” actually means

The connection is not one generic link. It is a small authority chain.

```text
Observed mechanic
    ↓
Authority mechanic entry
    ↓
Responsibility authority
    ↓
Semantic authority family
    ↓
Execution binding
    ↓
Runtime invocation
    ↓
Projected body
```

For a branch:

```text
Observed IfStatement
        ↓
decision authority
        ↓
execution binding
        ↓
semantic runtime
        ↓
body no longer owns branch meaning
```

For object construction:

```text
Observed object construction
        ↓
projection mapping
        ↓
result contract
        ↓
projection binding
        ↓
body consumes projected result
```

For failure handling:

```text
Observed try/catch or throw
        ↓
failure policy
        ↓
failure classification binding
        ↓
semantic execution
```

So the report should show not only “authority reachable,” but:

```text
Which connection is missing?
```

# Missing tissue classification

This is probably the most useful next report layer.

```text
AUTHORITY_DOCUMENT_MISSING
AUTHORITY_FAMILY_MISSING
AUTHORITY_ENTRY_MISSING
RESPONSIBILITY_BINDING_MISSING
SOURCE_BINDING_MISSING
EXECUTION_BINDING_MISSING
RUNTIME_WIRING_MISSING
PROJECTED_BODY_MISSING
EQUIVALENCE_PROOF_MISSING
```

That turns vague remediation into exact missing connective tissue.

Example:

| File                                    | Mechanic            | Authority                 | Missing tissue       | Automation                     |
| --------------------------------------- | ------------------- | ------------------------- | -------------------- | ------------------------------ |
| `serves-query-console.runtime.impl.mjs` | branch              | reachable draft           | admission + binding  | Automatable after review       |
| `serves-query-console.runtime.impl.mjs` | object construction | reachable draft           | projection binding   | Automatable now                |
| `cli.js`                                | fallback            | no authority home         | missing-value policy | Human decision required        |
| `project.js`                            | retry               | no continuation authority | retry policy         | Authority projection candidate |

# Add an Automation Readiness section

The report should include a top-level rollup like:

| Automation posture                     | Mechanics | Files | Share |
| -------------------------------------- | --------: | ----: | ----: |
| Automatable now                        |        94 |     1 |  2.6% |
| Automatable after review               |        76 |     1 |  2.1% |
| Automatable after authority completion |       420 |    12 | 11.7% |
| Requires new authority                 |     2,500 |    48 | 69.4% |
| Requires human semantic decision       |       510 |    19 | 14.2% |

The current exact numbers would need to be computed, but the report now has enough evidence to derive them honestly.

# Projectability must be explicit

For each remediation item, declare:

```text
Projectable?
```

But not as a loose boolean.

Use:

```text
PROJECTABLE_NOW
PROJECTABLE_AFTER_PROMOTION
PROJECTABLE_AFTER_AUTHORITY_COMPLETION
PROJECTABLE_AFTER_HUMAN_DECISION
NOT_PROJECTABLE_WITH_CURRENT_PROFILE
```

And explain why.

```json
{
  "projectability": {
    "status": "PROJECTABLE_AFTER_PROMOTION",
    "missingPrerequisites": [
      "authority-admission",
      "execution-binding"
    ],
    "availableProjectors": [
      "projects-authority-binding.v1",
      "projects-semantic-runtime-body.v1"
    ]
  }
}
```

# The automation pipeline

For the directly projectable case:

```text
1. Select reachable candidate mechanics.
2. Resolve current source body.
3. Resolve owning responsibilities.
4. Validate candidate authority shape.
5. Promote candidate into admitted authority.
6. Generate authority binding.
7. Generate or update runtime wiring.
8. Project collapsed execution body.
9. Execute direct semantic evaluation.
10. Execute projected body.
11. Compare canonical results.
12. Update governance report.
```

The operator experience could be nearly trivial:

```bash
source-facts govern show --automation-ready
```

Then:

```bash
source-facts govern project \
  --remediation promote-and-bind-serves-query-console
```

Then:

```text
170 reachable candidate mechanics found
170 source locations resolved
170 authority entries validated
1 binding projected
1 runtime body projected
semantic equivalence: GREEN
governed coverage updated
```

# One important safeguard

Reachability alone must not equal admission.

```text
Reachable
    ≠
Semantically correct
```

A candidate can point at current source and still encode the wrong interpretation.

So automation should distinguish:

```text
Mechanical automation:
path resolution
binding generation
projection
body wiring
receipt generation

Governance decision:
candidate meaning is accepted
```

The machine can automate everything around the decision.

The actual admission decision remains explicit unless a policy already authorizes automatic promotion for that candidate class.

# Report-driven buttons

Every drill-down item should effectively expose one action.

```text
PROMOTE AND BIND
EXTEND EXISTING AUTHORITY
PROJECT MISSING FAMILY
PROJECT EXECUTION BINDING
PROJECT COLLAPSED BODY
RUN EQUIVALENCE PROOF
REVIEW SEMANTIC DECISION
RETIRE ORPHANED AUTHORITY
```

That is where the report becomes operational.

Not:

```text
Here are your problems.
```

But:

```text
Here are the problems,
here is what is already complete,
here is what can be automated,
and here is the exact next operation.
```

# The simplest mental model

```text
Meaning exists?
    ├── no  → author meaning
    └── yes
         ↓
Source reachable?
    ├── no  → migrate or retire
    └── yes
         ↓
Admitted?
    ├── no  → review and promote
    └── yes
         ↓
Bound?
    ├── no  → generate binding
    └── yes
         ↓
Body consumes authority?
    ├── no  → project wiring/body
    └── yes
         ↓
Equivalent?
    ├── no  → repair projection
    └── yes → GOVERNED
```

That is the conveyor.

## The key operational metric

The next report should surface:

```text
Automation Opportunity
=
reachable authority
+
known authority family
+
resolvable source target
+
available projector
-
unresolved semantic decisions
```

That gives you the low-hanging-fruit score.

And for the current console authority draft, the report is already telling you something very valuable:

> There are 170 reachable mechanic candidates that likely do not need to be rediscovered. They need to be reviewed, promoted, bound, and seated into the executable path.

That is exactly the kind of inventory movement the system should automate.

# Implementation note (2026-08-03)

The observational slice of this proposal is now implemented: `classifiesAutomationReadiness`
(`src/governance/classifies-automation-readiness.js`) scores every ungoverned occurrence,
`projectsSelfGovernanceReport` carries `automationDisposition` / `missingTissue` /
`candidateAuthorityFile` per occurrence plus a top-level `automationReadiness.byDisposition`
rollup, and the markdown/summary formatters render an "Automation Readiness" section. What
was **not** built is the pipeline tail (`PROMOTE_AND_BIND`, binding generation, the
`source-facts govern project --remediation ...` CLI) -- no projector or binding-generation
machinery exists yet to execute those actions, and fabricating the classification for actions
this codebase can't perform would be worse than not offering them.

Running it against this repo's own 170-candidate `serves-query-console.authority.draft.json`
corrects the "low-hanging fruit" read above: **0** occurrences land in `AUTOMATABLE_AFTER_REVIEW`
and **158** land in `REQUIRES_HUMAN_SEMANTIC_DECISION`. Every one of those 170 draft mechanics
carries `coverage: "AUTHORITY_CANDIDATE_PROJECTED"` *and* a nested
`decisions.coverageDisposition: "SEMANTIC_DECISION_REQUIRED"` -- the draft itself already
declares, mechanic by mechanic, that a human judgment call is still open. Reachability was
never the missing piece for this draft; every one of its candidates already says so itself.
"Automation Opportunity" as defined above (reachable + known family + resolvable target +
available projector − unresolved semantic decisions) evaluates to zero here specifically
*because* the subtraction term is 170 for 170. The tissue that's missing across this repo as a
whole is overwhelmingly `REQUIRES_NEW_AUTHORITY` (3,500 of 3,658 non-exempt occurrences,
95.7%) -- files with no candidate and no authority home at all, not files one review step away.
