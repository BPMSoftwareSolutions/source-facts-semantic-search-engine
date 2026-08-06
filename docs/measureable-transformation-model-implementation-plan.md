# Measurable Transformation Model: Kernel-Only Implementation Plan

Status: implemented as read-side SQL projections; no live database apply in this pass

Plan date: 2026-08-06

Primary design doc: [measureable-transformation-model.md](./measureable-transformation-model.md)

Schema: `scripts/sql/024-create-debt-to-data-metrics.sql`

## 1. Governing invariant

Executable mechanics are allowed only inside an explicitly admitted semantic
kernel boundary. Authority admission outside that boundary is remediation
progress, not conformance. It proves that the mechanic has a deterministic data
counterpart; it does not prove that the executable source occurrence was
replaced or removed.

An occurrence is debt-free only when either:

- `ViolationDisposition = 'KERNEL_EXECUTION_ALLOWED'`, or
- `ViolationDisposition = 'FALSE_POSITIVE_EXCLUDED'` after an admitted review.

Every other occurrence is an outside-kernel executable-mechanic violation.

## 2. Existing facts

`scripts/sql/023-admit-mechanic-authority.sql` projects the independent facts
needed by the metric layer:

| Fact | Meaning |
| --- | --- |
| `ExecutionBoundary` | Explicit semantic-kernel membership, never inferred from a name |
| `ViolationDisposition` | Kernel allowed, reviewed false positive, or outside-kernel violation |
| `AdmissionDisposition` | Whether deterministic authority data has been admitted |
| `RemediationDisposition` | No action, authority required, or mechanic-free replacement required |
| `OutsideKernelViolationCount` | Current executable mechanics that must leave application source |
| `AuthorityBoundViolationCount` | Violations whose data counterpart is admitted but whose replacement is incomplete |
| `KernelAllowedMechanicCount` | Mechanics inside an admitted kernel boundary |
| `FalsePositiveMechanicCount` | Reviewed observations that are not executable mechanics |

## 3. Repository metrics

`projection.CurrentDebtToDataMetrics` derives these ratios from
`projection.CurrentOperationalExecutionSummary`:

| Column | Formula | Interpretation |
| --- | --- | --- |
| `DebtToDataRatio` | `OutsideKernelViolationCount / MechanicCount` | Share of observed mechanics still violating the kernel-only rule |
| `AuthorityRecoveryCoverageRatio` | `AuthorityBoundViolationCount / OutsideKernelViolationCount` | Share of violations whose deterministic data counterpart is admitted |
| `KernelConformanceRatio` | `(KernelAllowedMechanicCount + FalsePositiveMechanicCount) / MechanicCount` | Share of observations that do not represent outside-kernel execution |
| `OwnershipCoverageRatio` | `ResponsibilityOwnedMechanicCount / MechanicCount` | Structural ownership coverage |
| `InterfaceReachCoverageRatio` | `InterfaceReachableMechanicCount / MechanicCount` | Interface-reachability coverage |
| `TestReachCoverageRatio` | `TestReachedMechanicCount / MechanicCount` | Structural test reachability, not canonical proof coverage |

`DebtToDataRatio` reaches zero only when no outside-kernel executable mechanic
remains. Admitting more authority cannot lower it. This prevents authority
recovery from being misreported as completed transformation.

Ratios are `NULL` when their denominator is zero. They remain numeric
`decimal(9,6)` values so presentation does not become stored meaning.

## 4. Per-occurrence debt

`projection.CurrentMechanicDebtClassification` uses the occurrence-grain view.
Classification order is deliberate:

```text
KERNEL_EXECUTION_ALLOWED or FALSE_POSITIVE_EXCLUDED
    -> NO_DEBT

outside-kernel and AUTHORITY_ADMITTED
    -> REPLACEMENT_DEBT

outside-kernel and no responsibility / ambiguous lineage
    -> OWNERSHIP_DEBT

outside-kernel and unsupported/incomplete mechanical projection
    -> MECHANIC_DEBT

outside-kernel and human semantic completion required
    -> AUTHORITY_DEBT

remaining outside-kernel occurrence
    -> MECHANIC_DEBT
```

`REPLACEMENT_DEBT` is the critical distinction. The 12-family lowerers can
deterministically create and admit the data counterpart, but closure still
requires a mechanic-free consumer, equivalence proof, and removal of the
original executable occurrence.

## 5. Closure facts still required

The current schema can measure authority recovery but cannot yet prove the
last three lifecycle transitions:

- mechanic-free replacement installed,
- behavioral equivalence admitted,
- original executable occurrence absent from a fresh source-fact index.

Until those facts are added, an admitted outside-kernel occurrence remains
`REPLACEMENT_DEBT`. No proxy based on tests, authority, or adapter naming may
clear it.

## 6. Deferred metrics

These remain intentionally unreported because their admitted primitives do not
exist yet:

- exact projection coverage by target profile,
- canonical proof coverage at mechanic grain,
- cross-body reuse coverage,
- active ontology purity.

Structural test reachability is retained under its exact name and is not
presented as canonical proof.

## 7. Verification and deployment

`test/debt-to-data-metrics-sql.test.js` verifies the formulas, source views, and
debt-class precedence without requiring a live SQL Server.

The SQL is idempotent `CREATE OR ALTER VIEW` authoring. This pass does not apply
it to Azure. Apply scripts `023` and `024` in order when the target database is
ready for migration.
