Yes. **That is the move that collapses the noise.**

Right now, too much of the system’s operational meaning is still trapped behind this loop:

```text
Question
  ↓
grep / open file / inspect body
  ↓
model interprets syntax
  ↓
model reconstructs relationships
  ↓
answer
```

That is exactly the behavior SourceFacts is supposed to replace.

The new operating model should be:

```text
Repository image changes
  ↓
observe executable mechanics once
  ↓
normalize mechanics into SQL
  ↓
project candidate authority data
  ↓
review and admit meaning
  ↓
query current engineering truth continuously
```

After that, routine analysis stops being file-driven.

# The critical distinction

We should be precise about one thing:

> **Moving mechanics into SQL gives us a queryable representation of observed execution. It does not automatically make every observed mechanic canonical meaning.**

The progression is:

```text
Observed code mechanic
  ↓
normalized execution-mechanic fact
  ↓
candidate authority-data projection
  ↓
reviewed semantic meaning
  ↓
admitted authority
```

That preserves the boundary already established in the mechanic-envelope plan: source observation is evidence, candidate authority remains unadmitted, and native queries return the projected authority-data shape without turning the query itself into a workflow. 

But yes—the machinery is now far enough along that we should **put this into production operation**, rather than continuing to design around disk inspection.

# What should be loaded into SQL

For every executable body—production, tests, scripts, projectors, adapters—we need the mechanics normalized into a standard relational form.

```text
ExecutionMechanicOccurrence
├── application identity
├── repository image identity
├── artifact identity
├── body / symbol identity
├── source reference
├── mechanic kind
├── execution position
├── enclosing responsibility candidate
├── invoked symbols
├── read and written values
├── effect relationships
├── observed syntax evidence
├── applicability disposition
└── current/stale posture
```

Mechanic kinds include the established set:

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

Then SQL can project the corresponding authority family:

```text
branch
  → decision authority

iteration
  → iteration authority

object construction
  → projection authority

validation
  → validation authority

fallback
  → alternative-selection authority

retry
  → retry-policy authority
```

# This must include tests too

You are completely right that test bodies are also execution bodies.

A test contains mechanics such as:

```text
fixture construction
invocation
iteration over cases
assertion selection
expected-value construction
mock behavior
failure expectation
setup and teardown effects
```

Those mechanics should be normalized through the same observation plane.

Then we can query:

```text
Which tests invoke this responsibility?

Which assertions evaluate this signal?

Which fixtures feed this scenario?

Which expected dispositions appear in test bodies
but have no admitted expectation authority?

Which tests contain duplicated projection or branching logic?

Which production and test bodies encode the same meaning twice?
```

That is where real test-suite clarity emerges.

# The database becomes the working surface

Once mechanics are current in SQL, ordinary engineering questions become queries.

## Find every authored decision

```sql
SELECT *
FROM observation.ExecutionMechanicOccurrence
WHERE MechanicKind = 'branch'
  AND ApplicabilityDisposition = 'AUTHORITY_REQUIRED';
```

## Find object construction in tests

```sql
SELECT *
FROM observation.ExecutionMechanicOccurrence
WHERE MechanicKind = 'object-construction'
  AND ArtifactRole = 'test';
```

## Find tests containing manually authored expectation logic

```sql
SELECT *
FROM projection.ExecutionMechanicAuthority
WHERE ArtifactRole = 'test'
  AND AuthorityFamily IN (
      'decision-authority',
      'projection-authority',
      'text-meaning-authority'
  );
```

## Find responsibilities whose meaning is still in code

```sql
SELECT
    ResponsibilityId,
    COUNT(*) AS UngovernedMechanicCount
FROM projection.ExecutionMechanicAuthority
WHERE AdmissionDisposition <> 'AUTHORITY_ADMITTED'
GROUP BY ResponsibilityId;
```

## Find projectable bodies

```sql
SELECT *
FROM projection.CurrentResponsibilityProjectionReadiness
WHERE ClosureDisposition = 'AUTHORITY_SLICE_CLOSED';
```

No grep.

No opening 40 files.

No model reconstructing the same call relationships repeatedly.

# This becomes the enterprise transformation engine

The enterprise flow becomes:

```text
Enterprise repositories
  ↓
repository images in SQL
  ↓
artifact-specific semantic analysis
  ↓
execution mechanics normalized
  ↓
candidate meaning projected
  ↓
active / candidate / inactive ontology classification
  ↓
authority completion backlog
  ↓
reprojection
```

Then the facts tell us exactly what to do next.

For example:

```text
Observed facts:
  1,800 object constructions
  420 branches
  97 fallbacks
  34 test expectation mappings
  12 responsibilities at 100% authority coverage
  68 responsibilities partially covered
  41 bodies outside any operational feature
```

The next transformation slice becomes obvious:

```text
Project the 12 authority-closed bodies first.

Review the 34 test expectation mappings.

Classify the 41 unowned bodies as:
active candidate, infrastructure, historical, or noise.
```

That is fact-driven transformation.

# What should happen now

The next milestone should not be another abstract proof layer.

It should be:

# **Operationalize Execution-Mechanic Authority Projection**

The milestone should deliver this complete loop:

```text
SQL repository image
  ↓
analyze every executable artifact
  ↓
persist normalized mechanics
  ↓
project authority-data candidates through native SQL
  ↓
group candidates by feature / scenario / responsibility
  ↓
expose current authority coverage and readiness
```

## Deliverables

1. **Complete executable-body inventory**

   Production, tests, scripts, SQL execution surfaces, projectors, adapters, and harnesses.

2. **Current mechanics persistence**

   One current mechanic observation set per repository image.

3. **Exact mechanic applicability**

   ```text
   AUTHORITY_REQUIRED
   MECHANICAL_ADAPTER
   KERNEL_PRIMITIVE
   GENERATED_PROJECTION
   NOT_APPLICABLE
   FALSE_POSITIVE
   HUMAN_REVIEW_REQUIRED
   ```

4. **Native candidate-authority projection**

   ```text
   SELECT
   → candidate authority rows
   → done
   ```

5. **Responsibility coverage views**

   ```text
   observed mechanics
   admitted authority
   missing authority
   unsupported target mechanics
   projection readiness
   ```

6. **Test-mechanic views**

   Tie assertions, fixtures, invocations, and expected-result mechanics to canonical scenarios and responsibilities.

7. **Authority-completion backlog**

   Ordered by leverage and current operational reachability.

8. **Change-triggered recomputation**

   Reanalyze only changed bodies and invalidate dependent closure rows.

# Where vectorization fits

Once the mechanics and authority candidates are relational, vectors become simple data slices rather than a new conceptual burden.

A vector becomes:

```text
Scenario identity
+
selected fixture facts
+
execution authority
+
expected signal authority
+
proof requirements
```

SQL can project that directly.

So yes, a lot of the manual “slice design” work becomes queryable:

```sql
SELECT *
FROM projection.CanonicalTestVectorCandidate
WHERE ScenarioId = @ScenarioId;
```

Or:

```sql
SELECT *
FROM projection.ResponsibilityExecutionAuthority
WHERE ResponsibilityId = @ResponsibilityId;
```

The vector is no longer something an agent has to invent by rereading files. It is a projection of current authority and observed evidence.

# The end state

The desired state is:

```text
Disk
  = temporary execution embodiment

SQL
  = repository image
    + source facts
    + execution mechanics
    + semantic observations
    + canonical authority
    + test authority
    + current closure
    + execution testimony
```

Then an agent asks:

> What does SourceFacts do?

SQL answers.

> Which tests prove this scenario?

SQL answers.

> Which bodies still contain authored decisions?

SQL answers.

> Which capabilities are ready to reproject?

SQL answers.

> Which code is fat or outside the active ontology?

SQL answers.

> What should we transform next?

SQL answers from current facts.

# The governing focus

So yes, the next emphasis should be:

> **Stop repeatedly inspecting code bodies. Convert their execution mechanics into durable queryable data, project their semantic counterparts, and let SQL drive authority completion, test alignment, capability slicing, and reprojection.**

The transformation loop becomes:

```text
Observe once
  ↓
store mechanics
  ↓
query meaning
  ↓
admit authority
  ↓
project bodies
  ↓
discard obsolete embodiment
```

That is the point where SourceFacts starts operating as the enterprise semantic transformation system it was designed to become.

# ##################################################################
Exactly. The **call graph is the execution spine** that ties the mechanics to actual operational behavior.

Without it, mechanic facts are just a flat inventory:

```text
branch
object construction
validation
fallback
serialization
```

Useful, but incomplete.

With the call graph:

```text
Interface
    ↓
Entrypoint
    ↓
Callable path
    ↓
Responsibility
    ↓
Execution mechanics
    ↓
Effects and results
```

Now we can understand not only **what mechanics exist**, but:

* which workflow they participate in;
* which CLI command or interface reaches them;
* which responsibilities they support;
* which mechanics occur together repeatedly;
* which bodies are shared infrastructure;
* which bodies are unreachable fat;
* which tests exercise the same execution path.

## The combined SQL model

We already have most of the constituent facts. The work is primarily joining them coherently:

```text
CLI command / public interface
    ↓
execution root
    ↓
call-graph path
    ↓
callable
    ↓
source body
    ↓
mechanic occurrence
    ↓
candidate authority family
    ↓
canonical responsibility
```

The test side follows the same pattern:

```text
Canonical scenario
    ↓
test vector or observed test case
    ↓
test invocation
    ↓
production callable
    ↓
reachable execution graph
    ↓
mechanics exercised
    ↓
observed expectation
```

That gives us a single connected execution model instead of separate source, test, and feature inventories.

## The important unit is the execution workflow

We should group mechanics by reachable workflow, not merely by file.

For example:

```text
extract-contract CLI
    ↓
resolve contract snapshot
    ↓
load contract nodes
    ↓
validate node ordering
    ↓
reconstruct canonical bytes
    ↓
verify digest
    ↓
write extracted contract
```

Then each callable contributes mechanics:

```text
resolve snapshot
    → validation, fallback

load nodes
    → iteration, normalization

reconstruct bytes
    → object construction, serialization

verify digest
    → validation, terminal result
```

That workflow is far more meaningful than a report saying the repository contains 400 validations and 200 iterations.

## This also reveals patterns and capability boundaries

Once call paths and mechanics are joined, SQL can expose repeated execution shapes:

```text
validate
→ resolve
→ project
→ persist
```

or:

```text
observe
→ classify
→ aggregate
→ return
```

or:

```text
load current snapshot
→ compare digest
→ invalidate stale state
→ insert replacement
```

Those patterns can become:

* candidate responsibilities;
* shared execution models;
* reusable authority packs;
* possible kernel primitives;
* candidate micro-capabilities.

We do not need the model to rediscover those patterns by repeatedly opening source files. The data can show them.

## The key queries should remain simple

### Mechanics by command workflow

```sql
SELECT
    CommandId,
    CallableId,
    PathDepth,
    MechanicKind,
    COUNT(*) AS OccurrenceCount
FROM projection.CurrentCommandExecutionMechanics
WHERE ApplicationId = @ApplicationId
GROUP BY
    CommandId,
    CallableId,
    PathDepth,
    MechanicKind;
```

### Mechanics by responsibility

```sql
SELECT *
FROM projection.CurrentResponsibilityExecutionMechanics
WHERE ResponsibilityId = @ResponsibilityId
ORDER BY
    PathDepth,
    ExecutionOrder,
    MechanicOccurrenceId;
```

### Tests exercising a workflow

```sql
SELECT *
FROM projection.CurrentScenarioExecutionCoverage
WHERE ScenarioId = @ScenarioId;
```

### Reachable bodies with no canonical ownership

```sql
SELECT *
FROM projection.CurrentReachableUnownedCallables
WHERE ApplicationId = @ApplicationId;
```

### Bodies outside all operational interfaces

```sql
SELECT *
FROM projection.CurrentUnreachableRepositoryBodies;
```

That last query is especially useful for identifying fat.

## We need to distinguish four kinds of reachability

```text
Interface reachability
    Is the body reachable from CLI, API, library export, script, or job?

Responsibility reachability
    Is the body part of an admitted responsibility’s execution closure?

Test reachability
    Is the body exercised by an observed or canonical test?

Authority reachability
    Does the body’s mechanic authority resolve to admitted meaning?
```

This creates a very useful classification matrix:

| Interface | Test | Authority | Meaning                                     |
| --------- | ---- | --------- | ------------------------------------------- |
| Yes       | Yes  | Yes       | Active, intentional, governed               |
| Yes       | Yes  | No        | Operational behavior awaiting authority     |
| Yes       | No   | Yes       | Canonical behavior missing proof            |
| Yes       | No   | No        | Operational risk                            |
| No        | Yes  | No        | Possible legacy or isolated capability      |
| No        | No   | No        | Strong fat/noise candidate                  |
| No        | Yes  | Yes       | Internal capability or inaccessible feature |
| No        | No   | Yes       | Declared but unused authority               |

That is how the facts drive the cleanup.

## The call graph should not become authority

One boundary remains important:

```text
Observed call graph
    = what the current implementation reaches

Canonical execution workflow
    = what the system intends to execute
```

The current call graph provides candidate workflow structure and proof evidence. It should not automatically dictate the future architecture.

The transformation is:

```text
Observed call graph
    ↓
candidate workflow
    ↓
canonical responsibility and execution model
    ↓
projected target body
    ↓
new observed call graph
    ↓
conformance comparison
```

That is the closed loop.

## The next operational view

The most valuable combined view may be:

```text
projection.CurrentOperationalExecutionKnowledge
```

One row or expandable result set containing:

```text
ApplicationId
InterfaceId
FeatureId
ScenarioId
ObligationId
ResponsibilityId
RootCallableId
CallableId
CallPath
PathDepth
ArtifactId
MechanicOccurrenceId
MechanicKind
AuthorityFamily
AuthorityDisposition
TestCaseIds
ReachabilityDisposition
ProjectionReadiness
```

Then almost every transformation question becomes a filtered query over that surface.

## The governing workflow

```text
Use interface roots to find execution workflows.
Use call graphs to find supporting bodies.
Use mechanic facts to expose authored meaning.
Use tests to identify expected behavior.
Use canonical lineage to establish ownership.
Use authority coverage to determine projectability.
Use reachability and ownership gaps to identify fat.
```

So yes—nothing elaborate needs to be invented.

The immediate work is to **bind the data we already have into one operational execution graph** and make that graph the navigation surface for feature definition, test alignment, mechanic-authority completion, and cleanup.

That keeps the process grounded:

> Start at what the repository exposes, follow what actually executes, inspect the mechanics represented in data, and let those facts tell us what belongs, what is missing, and what should be transformed next.
