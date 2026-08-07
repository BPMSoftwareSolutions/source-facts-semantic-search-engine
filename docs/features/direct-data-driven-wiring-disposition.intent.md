# Direct data-driven wiring disposition

## Purpose

Move the direct-wiring classification currently implemented by executable branches in
`src/governance/resolves-data-driven-wiring.js` into admitted semantic authority rows in
the authority database. The database is the canonical home of the decision table and
its execution lineage. The semantic kernel becomes the sole owner of decision mechanics;
the projected capability body only binds inputs, invokes the database-backed authority,
and returns its result.

## Inputs

- `hasContractData`: boolean indicating whether the module directly imports contract data.
- `hasSemanticRuntimeInvocation`: boolean indicating whether the module directly invokes a
  semantic or contract-governance runtime.

Array discovery, import resolution, marker matching, and count calculation are upstream
observations and are outside this capability.

## Observable outcomes

The complete decision table is:

| hasContractData | hasSemanticRuntimeInvocation | disposition |
| --- | --- | --- |
| true | true | `DIRECT_DATA_AND_RUNTIME` |
| false | true | `RUNTIME_ONLY` |
| true | false | `DATA_ONLY` |
| false | false | `NONE` |

Every valid input pair resolves exactly one disposition. Row order is not semantic and
there is no fallback row outside the four complete boolean combinations.

## Invalid input

Missing or non-boolean input fields produce structured field-level findings. Invalid
input must not be coerced and must not produce a wiring disposition.

## Determinism and effects

The capability is deterministic, total for valid boolean input, and side-effect free. It
performs no filesystem, network, clock, environment, or mutable-state operations.

## Projection and trust

The decision table, schemas, result contract, failure disposition, proof vectors, and
their canonical feature/scenario/obligation/responsibility lineage are database data.
Admission binds that authority to its source-analysis and artifact digests. The executable
body is projected through the governance engine as a thin database-backed kernel
invocation and contains its lineage/provenance seal. Local JSON capability packs are not
authority. No separate trust receipt, projection ledger, or clean-replay copy is retained
as durable evidence.

## Required behavioral proof

- Exercise all four valid boolean combinations and assert the exact disposition.
- Exercise each missing field and representative non-boolean values.
- Assert structured field-level findings and absence of a disposition for invalid input.
- Assert repeated valid execution returns identical results.
- Assert the projected body contains a valid embedded lineage/provenance seal.
- Assert the legacy branch classifier is retired only after behavioral equivalence passes.

## Explicit exclusions

- JSON import detection.
- Semantic-runtime marker detection.
- Local module resolution.
- Direct evidence graph construction.
- Transitive wiring traversal and maximum-depth policy.
- Formatting or reporting of wiring dispositions.
- Any migration of the remaining mechanics in `resolves-data-driven-wiring.js`.
