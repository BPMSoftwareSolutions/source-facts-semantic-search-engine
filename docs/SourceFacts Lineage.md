Exactly. The report should not merely **state facts**; it should carry the **query lineage that produced each fact**.

Right now, this report gives values such as:

* 4 canonical features;
* 6 canonical scenarios;
* 5,154 mechanics without scenario lineage;
* 592 unresolved responsibility-evidence clusters;
* 2 authority documents with canonical scenario lineage. 

But those numbers are not directly inspectable from the report itself. A reader cannot answer:

```text
Which query produced this?
Which index did it run against?
What rows came back?
Was the result transformed?
Can I reproduce it?
```

That needs to change.

# The report needs a query provenance layer

Every factual section should point to one or more registered queries.

The chain should be:

```text
Rendered fact
    ↓
Metric or claim ID
    ↓
Query receipt
    ↓
Registered query
    ↓
Bound index and scan
    ↓
Result rows
```

For example:

```text
Mechanics without scenario lineage: 5,154
```

should be backed by something like:

```yaml
claimId: self-governance.mechanics-without-lineage.v1
queryId: feature-coverage.mechanics-without-lineage.v1
indexId: sha256:...
scanId: 49c9632...
rowCount: 1
resultHash: sha256:...
valuePointer: /rows/0/mechanicCount
```

# Each report table needs inspectable query references

The executive summary could become:

| Dimension                                   | Count | Query                                                    |
| ------------------------------------------- | ----: | -------------------------------------------------------- |
| Canonical feature declarations              |     4 | `feature-coverage.canonical-features.v1`                 |
| Canonical scenarios                         |     6 | `scenario-conformance.canonical-scenarios.v1`            |
| Mechanics with proposed scenario lineage    |   158 | `feature-coverage.proposed-lineage-mechanics.v1`         |
| Mechanics without scenario lineage          | 5,154 | `feature-coverage.unlined-mechanics.v1`                  |
| Unresolved responsibility-evidence clusters |   592 | `feature-coverage.unresolved-responsibility-clusters.v1` |

The query identifier should link to a query appendix or query receipt artifact.

# The report should include three inspectability levels

## 1. Inline query identity

Every factual table row should identify its source query.

```text
Query: feature-coverage.unlined-mechanics.v1
```

## 2. Query receipt summary

The report should show:

```text
Index ID
Scan ID
Query hash
Result hash
Row count
Execution disposition
```

## 3. Full query text

A query appendix should contain the exact executable SQL or registered query definition.

```sql
SELECT COUNT(*) AS mechanicCount
FROM bodyMechanics bm
LEFT JOIN scenarioMechanicLineage sml
  ON sml.bodyMechanicId = bm.bodyMechanicId
WHERE sml.lineageDisposition IS NULL
   OR sml.lineageDisposition = 'NO_SCENARIO_LINEAGE';
```

The exact collection and field names may differ, but the principle is essential.

# Not every reported fact is a direct query result

The report contains different claim types, and they should be labeled.

## Direct fact

Produced directly by a query.

```text
Canonical scenarios: 6
```

## Derived metric

Calculated from one or more query results.

```text
Scenario closure rate: 33.3%
```

This should cite numerator and denominator query IDs.

## Classification

Produced by deterministic rules over queried evidence.

```text
STRUCTURALLY_CLOSED
```

This needs a classifier ID, rule version, and input receipt IDs.

## Inference

Produced by an LLM.

```text
Serialize successful query-console responses
```

This needs the inference request, evidence-query receipts, model identity, and response hash.

## Human-reviewed authority

Produced by admission or review.

```text
SCENARIO_LINEAGE_CANONICAL
```

This needs the canonical authority document and review/admission receipt.

The report should never render all five as if they are equivalent facts.

# The query receipt contract

A compact receipt might look like:

```json
{
  "documentKind": "source-facts-query-receipt.v1",
  "queryId": "feature-coverage.mechanics-without-lineage.v1",
  "queryVersion": "1.0.0",
  "queryHash": "sha256:...",
  "index": {
    "indexId": "sha256:...",
    "scanId": "49c9632b..."
  },
  "execution": {
    "disposition": "RELATIONAL_QUERY_EXECUTED",
    "rowCount": 1,
    "resultHash": "sha256:..."
  },
  "result": {
    "rows": [
      {
        "mechanicCount": 5154
      }
    ]
  }
}
```

Then the report references that receipt rather than recomputing the number independently.

# Query lineage for every report section

## Executive Summary

Each count gets a query ID.

## Feature Coverage Proposals

The report should identify:

* query that found the evidence symbols;
* query that found the 20 matching serialization mechanics;
* query that resolved source files;
* query that checked canonical feature duplicates;
* inference request built from those receipts.

## Unresolved Responsibility Evidence

Each cluster row should cite the query that produced:

* symbol identity;
* mechanic types;
* occurrence count;
* cluster kind;
* reachability or interface posture.

## Canonical Feature Drill-Down

Each cell should have evidence lineage:

```text
Authority declaration
→ authority-document query

Binding
→ binding query

Declared body
→ source symbol query

Authority execution wiring
→ graph query

Runtime execution
→ execution receipt query

Proof result
→ proof receipt query
```

## Evidence Without Canonical Lineage

The count and each listed artifact should come from a query whose full result can be inspected.

## Subject Boundary

The discovered, in-subject, and excluded values should also be query-backed—not calculated only inside the formatter.

# Use stable query IDs, not embedded ad hoc SQL

The report should not contain arbitrary anonymous SQL everywhere.

Use a registered query catalog:

```text
feature-coverage.canonical-features.v1
feature-coverage.proposed-features.v1
feature-coverage.mechanics-by-lineage.v1
feature-coverage.unresolved-responsibility-clusters.v1
scenario-conformance.structural-status.v1
scenario-conformance.runtime-status.v1
authority.scenario-lineage-posture.v1
subject-boundary.evidence-disposition.v1
```

Each query ID should bind:

```text
query text
input collections
expected result schema
scope policy
version
content hash
```

That makes the report stable and reproducible.

# The report should include a query evidence appendix

A compact appendix could look like:

## Query Evidence Register

| Query ID                                  | Section                 | Rows | Result hash  | Status   |
| ----------------------------------------- | ----------------------- | ---: | ------------ | -------- |
| `feature-coverage.summary.v1`             | Executive Summary       |    1 | `sha256:...` | Executed |
| `feature-coverage.proposal-evidence.v1`   | Feature Proposals       |   20 | `sha256:...` | Executed |
| `feature-coverage.unresolved-clusters.v1` | Responsibility Evidence |  592 | `sha256:...` | Executed |
| `scenario-conformance.drilldown.v1`       | Canonical Features      |    9 | `sha256:...` | Executed |
| `subject-boundary.evidence.v1`            | Subject Boundary        |    6 | `sha256:...` | Executed |

Then:

## Registered Queries

### `feature-coverage.summary.v1`

```sql
...
```

### `feature-coverage.unresolved-clusters.v1`

```sql
...
```

# The rendered fact should be reconcilable

The strongest rule is:

> Every factual value rendered in the self-governance report must be reproducible from a bound query receipt.

That means the report generator should perform a reconciliation pass:

```text
rendered claim
→ claim source receipt
→ result value
→ rendered value
```

Any mismatch fails generation.

Dispositions:

```text
QUERY_RECEIPT_MISSING
QUERY_RECEIPT_STALE
QUERY_RESULT_SHAPE_INVALID
RENDERED_VALUE_MISMATCH
QUERY_INDEX_MISMATCH
QUERY_SCOPE_MISMATCH
UNSUPPORTED_FACTUAL_CLAIM
```

# The LLM sections need query provenance too

The feature proposal currently says it is based on:

* 3 symbols;
* 20 matching serialization mechanics;
* one source file;
* one know-how record. 

That inference packet should explicitly list the receipts:

```json
{
  "evidenceReceipts": [
    "receipt:feature-symbols:sha256:...",
    "receipt:serialization-mechanics:sha256:...",
    "receipt:source-files:sha256:...",
    "receipt:know-how-lineage:sha256:..."
  ]
}
```

Then the LLM output is inspectable all the way down:

```text
Gherkin proposal
→ inference response
→ inference request
→ query receipts
→ index facts
```

# The corrected report architecture

```text
Self-Governance Report
│
├── Factual Views
│   └── every value backed by query receipt
│
├── Deterministic Classifications
│   └── classifier version + evidence receipt IDs
│
├── Inference Proposals
│   └── model receipt + evidence query receipts
│
├── Canonical Authority
│   └── admitted document + admission receipt
│
├── Runtime Proof
│   └── execution and proof receipts
│
└── Query Evidence Appendix
    ├── query register
    ├── exact query text
    ├── input identities
    ├── result hashes
    └── reconciliation results
```

# The key implementation change

Do not let `projectsSelfGovernanceReport` calculate facts from internal arrays and then merely print them.

Instead:

```text
registered queries
→ query receipts
→ report projection
```

The report becomes a **view over receipts**.

That gives you exactly what you are asking for:

```text
fact
→ inspect query
→ inspect rows
→ inspect source references
→ rerun query
→ verify same result
```

The self-governance report should govern itself at the claim level. Every fact must show how it became a fact.

# ############################################

Exactly. That is now a **non-negotiable invariant**:

> **Every factual claim in the self-governance report must resolve to an inspectable query result. No exceptions.**

That includes:

* counts;
* percentages;
* lists;
* classifications;
* lineage postures;
* structural statuses;
* wiring dispositions;
* feature coverage;
* scenario coverage;
* authority coverage;
* runtime evidence;
* proof outcomes;
* subject-boundary counts;
* duplicate checks;
* capability relations;
* unresolved clusters.

## The hard rule

```text
No query result
=
no fact
```

Not:

```text
formatter calculated it
```

Not:

```text
the model inferred it
```

Not:

```text
the code obviously contains it
```

Not:

```text
the report generator already had the array in memory
```

If it appears as a fact, it must have a query receipt.

## Required lineage

```text
Rendered fact
    ↓
Claim ID
    ↓
Query result
    ↓
Query receipt
    ↓
Registered query
    ↓
Bound index / graph / contract / proof source
```

## Even deterministic classifications need query results

For example:

```text
STRUCTURALLY_CLOSED
```

cannot merely be calculated inside a JavaScript function and printed.

It must be queryable as a result row:

```json
{
  "scenarioId": "delegate-console-mechanics",
  "structuralStatus": "STRUCTURALLY_CLOSED",
  "missingResponsibilityCount": 0,
  "missingObligationCount": 0,
  "missingAuthorityCount": 0,
  "missingBindingCount": 0,
  "missingBodyCount": 0
}
```

The classification rule may be deterministic, but the result must still be inspectable.

## LLM output is not a fact until queried as evidence

The Gherkin proposal itself is an inference artifact.

The report may state:

```text
Proposed feature: serialize-successful-responses
```

only because a query over the proposal registry returned it.

Likewise:

```text
Model proposed 3 scenarios
```

must come from a query result over the inference artifact.

So even inference is reported through the query plane:

```text
LLM artifact
→ indexed facts
→ query result
→ report
```

## No hidden report calculations

The report generator should not independently compute:

* totals;
* rollups;
* percentages;
* statuses;
* filters;
* deduplication;
* joins;
* classifications.

Those belong in registered queries or deterministic query-backed projections.

The renderer’s job becomes:

```text
read validated query receipts
→ format results
→ render provenance
```

Nothing more.

## The report should fail closed

Any unsupported fact should stop generation with a typed failure:

```text
FACT_QUERY_RECEIPT_MISSING
FACT_QUERY_RESULT_NOT_INSPECTABLE
FACT_QUERY_RESULT_STALE
FACT_QUERY_SCOPE_MISMATCH
FACT_QUERY_INDEX_MISMATCH
FACT_RENDER_VALUE_MISMATCH
FACT_WITHOUT_REGISTERED_QUERY
```

No `unknown`.
No fallback zero.
No silent omission.
No “best effort.”

## Inspectability means the reader can do four things

For every fact, the report must let the reader:

1. See the query ID.
2. See the exact query text.
3. Inspect the returned rows.
4. Re-run it against the bound evidence source.

That is the standard.

## The governing invariant

```text
EVERY FACT
MUST HAVE
ONE OR MORE
CORRESPONDING
INSPECTABLE QUERY RESULTS
```

And the inverse should also hold:

```text
Every rendered factual claim
must reconcile exactly
to the result value
from its cited query receipt.
```

That turns the self-governance report into a fully inspectable evidence surface rather than another generated narrative.
