# Measurable Mechanic-Violation Transformation Model

## Governing invariant

Executable mechanics are allowed only inside the admitted semantic kernel.

Every genuine executable-mechanic occurrence outside that boundary is a
conformance violation. Authority admission does not legalize the occurrence.
An adapter, generated projection, temporary backlog item, or authority-bound
body remains nonconformant while the mechanic still exists outside the kernel.

The only states that clear a mechanic violation are:

1. The occurrence is inside an explicitly admitted kernel boundary.
2. Admitted evidence proves the scanner observation is a false positive.
3. The outside-kernel mechanic has been removed from the current repository image.

## Why the 12-family lowerers exist

The deterministic lowerers are violation-removal machinery. They extract the
data counterpart of these forbidden outside-kernel mechanic families:

- `branch`
- `iteration`
- `exception-handling`
- `throw`
- `object-construction`
- `serialization`
- `normalization`
- `validation`
- `fallback`
- `retry`
- `state-mutation`
- `meaning-hidden-in-text`

Lowering is not the end state. It is the first remediation step that makes an
observed violation mechanically actionable without asking a model to infer
syntax that the AST already declares.

## Transformation lifecycle

```text
OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION
  -> STRUCTURALLY_LOWERED
  -> SEMANTICALLY_COMPLETE
  -> AUTHORITY_ADMITTED
  -> MECHANIC_FREE_REPLACEMENT_PROJECTED
  -> EQUIVALENCE_PROVEN
  -> ORIGINAL_MECHANIC_REMOVED
  -> VIOLATION_CLOSED
```

Each transition requires durable evidence. No earlier state implies a later
state.

### Current implemented boundary

The repository currently implements:

```text
observe
  -> classify exact source occurrence
  -> deterministically lower supported syntax
  -> validate closed family authority
  -> record projection or rejection attempt
  -> atomically admit authority with analysis and artifact CAS evidence
```

The repository does not yet implement the generic mechanic-free replacement
projector or equivalence-proof closure for all authority families. Those are the
next remediation stages, not current accomplishments.

## Classification model

Every observed occurrence must expose four independent dimensions.

| Dimension | Values | Meaning |
| --- | --- | --- |
| Execution boundary | `SEMANTIC_KERNEL`, `OUTSIDE_SEMANTIC_KERNEL` | Whether executable mechanics are permitted at this location |
| Authority disposition | `AUTHORITY_ADMITTED`, `AUTHORITY_MISSING`, `AUTHORITY_NOT_REQUIRED_IN_KERNEL`, `AUTHORITY_NOT_APPLICABLE_FALSE_POSITIVE` | Whether recoverable authority exists |
| Violation disposition | `OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION`, `KERNEL_EXECUTION_ALLOWED`, `FALSE_POSITIVE_EXCLUDED` | Whether the current occurrence violates the invariant |
| Remediation disposition | `AUTHORITY_REQUIRED`, `REPLACEMENT_REQUIRED`, `NONE` | The next required action |

Authority status and violation status must never be collapsed into one field.
An authority-bound outside-kernel occurrence has:

```text
authorityDisposition = AUTHORITY_ADMITTED
violationDisposition = OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION
remediationDisposition = REPLACEMENT_REQUIRED
```

## Mechanic-free application boundary

Outside the semantic kernel, projected execution may:

- load admitted data;
- bind declared inputs;
- invoke a kernel primitive;
- return the kernel result;
- perform transport wiring that contains no executable mechanic.

Outside the kernel, projected execution may not implement branching,
iteration, validation, retry, fallback, state mutation, construction policy,
serialization policy, normalization policy, exception policy, or hidden text
interpretation. Those semantics belong in admitted data executed by the kernel.

## Metrics

All metrics are scoped to one current execution-analysis digest and count exact
mechanic occurrences unless explicitly named as grouped metrics.

### Current violation count

```text
Current Outside-Kernel Violations =
count(current occurrences where
  executionBoundary = OUTSIDE_SEMANTIC_KERNEL and
  violationDisposition = OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION)
```

This is the primary debt measure. The target is zero.

### Authority recovery coverage

```text
Authority Recovery Coverage =
authority-bound outside-kernel violations
/
current outside-kernel violations
```

This measures migration progress, not conformance and not debt retirement.

### Deterministic lowering coverage

```text
Deterministic Lowering Coverage =
successfully lowered current outside-kernel violations
/
current outside-kernel violations evaluated by the current lowerer version
```

Rejected syntax remains a violation and carries an exact rejection reason and
required primitive.

### Replacement coverage

```text
Replacement Coverage =
violations with a mechanic-free replacement artifact
/
current outside-kernel violations
```

This remains zero until replacement projectors and artifact testimony exist.

### Proof coverage

```text
Proof Coverage =
replacement artifacts with admitted equivalence proof
/
replacement artifacts requiring proof
```

### Retirement rate

```text
Retirement Rate =
baseline violation identities absent from the current repository image
with admitted replacement and proof testimony
/
baseline outside-kernel violations
```

Removal without replacement and proof is not successful retirement.

## Prioritization

The currently implemented priority score uses only facts already present in
the transformation queue:

```text
responsibility ownership
+ interface reachability
+ test reachability
+ not-yet-evaluated priority
```

Business criticality, change frequency, production failure history,
cross-application duplication, and projector effort are future inputs. They
must not appear in measured reporting until each has an admitted source,
formula, and query lineage.

## SQL operational surfaces

- `projection.CurrentExecutionMechanicOccurrence` exposes boundary, authority,
  violation, and remediation dispositions independently.
- `projection.CurrentExecutableMechanicViolation` is the current exact
  outside-kernel violation inventory.
- `projection.CurrentMechanicAuthorityTransformationQueue` prioritizes
  deterministic authority recovery while keeping admitted-but-unremoved
  occurrences projection-blocking.
- `authority.MechanicAuthorityAdmission` stores admitted recovered authority.
- `observation.MechanicAuthorityLoweringAttempt` stores deterministic projection
  and rejection evidence.
- `authority.ExecutableMechanicKernelBoundary` is the explicit allow boundary;
  no repository or path is treated as kernel by naming convention alone.

## Burn-down reporting

A valid iteration report binds every number to a query receipt and analysis
digest:

```text
Analysis digest
Current outside-kernel violations
Authority-required violations
Authority-bound violations awaiting replacement
Lowering rejections by reason and required primitive
Mechanic-free replacements projected
Equivalence proofs admitted
Original mechanics removed
Kernel mechanics allowed
False positives excluded
```

Illustrative numbers must be labeled as examples. Production figures require
the exact population, unit, query identity, analysis digest, and timestamp.

## Closure rule

An outside-kernel mechanic violation is closed only when the current repository
image no longer contains that occurrence and durable evidence binds its admitted
authority, mechanic-free replacement, and equivalence proof.

```text
Admission is recovery progress.
Replacement is remediation progress.
Proof establishes confidence.
Removal closes the violation.
Zero outside-kernel mechanics is conformance.
```
