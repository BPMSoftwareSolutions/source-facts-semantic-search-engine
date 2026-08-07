# Auditable Query Evidence: Hash-Based Traceability

**Purpose:** Enable reports to cite data sources by content hash, allowing readers to regenerate and verify query/result pairs without file persistence.

---

## The Problem Solved

**Old approach:**
```
Report cites query:
  "Data from test inventory"
  
Reader cannot verify:
  ❌ Which exact query was run?
  ❌ What exact results were returned?
  ❌ Has the data been modified?
  ❌ Can I regenerate these results?
```

**New approach (hash-based evidence):**
```
Report cites query:
  "Data from test inventory (hash: a1b2c3d4e5f6)"
  
Reader can verify:
  ✅ Hash uniquely identifies query + results
  ✅ Run query again, compute hash, compare
  ✅ Hash mismatch = data was modified
  ✅ Regenerate by running query and validating hash
```

---

## How It Works

### 1. Capturing Evidence

When generating a report, register each query you use:

```javascript
import { QueryEvidenceRegistry } from "../src/governance/projects-auditable-query-receipt.js";

const registry = new QueryEvidenceRegistry();

// Run a governance query
const results = await govArtifacts.query(
  "SELECT COUNT(*) FROM tests"
);

// Register the query + results as evidence
registry.register(
  "test-inventory-count",           // Name for this evidence
  "SELECT COUNT(*) FROM tests",     // Query executed
  results,                            // Results obtained
  receipt                             // Query receipt from governance
);

// Later: export evidence references for report
const evidence = registry.exportEvidence();
```

### 2. Evidence Output

```json
{
  "documentKind": "query-evidence-registry.v1",
  "purpose": "Hash-based evidence referencing governance artifacts",
  "registryNote": "Hashes reference live governance queries - not persisted query files",
  "registeredAt": "2026-08-07T14:32:15.847Z",
  "evidenceCount": 3,
  "evidence": [
    {
      "queryName": "test-inventory-count",
      "shortHash": "a1b2c3d4e5f6",
      "contentHash": "a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef01234567890",
      "queryHash": "b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef01234567890ab",
      "governance": {
        "artifact": "source-facts-self-governance-report.v1.json",
        "queryId": "test.inventory.v1"
      },
      "timestamp": "2026-08-07T14:32:15.847Z"
    },
    // ... more evidence entries
  ]
}
```

### 3. Using Evidence in Reports

Insert evidence hash references in markdown:

```markdown
## Analysis: Test Suite Inventory

This analysis used the following data sources:

**Query:** `test-inventory-count`
```
Hash: a1b2c3d4e5f6
Content: a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef01234567890
```

**Results:** 178 total tests in inventory

**Verification:**
To regenerate these results:
1. Run: `SELECT COUNT(*) FROM tests`
2. Compute SHA256 hash of query + results
3. Compare to `a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef01234567890`
```

---

## Hash Internals

### Content Hash (Proof of Execution)

Combines query + results into one hash:

```
Content = NormalizedQuery \n--- \n JSONResults
SHA256(Content) = 64-char hex hash
```

**Properties:**
- ✅ Deterministic (same query + results = same hash)
- ✅ Proof that THIS query produced THESE results
- ✅ Tamper-evident (any change = different hash)
- ✅ Can be verified by re-running query

**Examples:**

Same query, different results → different content hash:
```
Query: "SELECT id FROM tests"
Results-A: [{"id": "1"}]  → Hash A
Results-B: [{"id": "2"}]  → Hash B
A ≠ B ✓
```

Same query with different formatting → same content hash (whitespace normalized):
```
Query-1: "SELECT id FROM tests"
Query-2: "SELECT  id  FROM  tests"  (extra spaces)
Results: [{"id": "1"}]

Hash-1 = Hash-2 ✓ (formatting ignored)
```

### Query Hash (Query Identity)

Hash of normalized query text only:

```
QueryHash = SHA256(NormalizedQuery)
```

**Use:** Identify which query was run, regardless of results

### Result Hash (Result Identity)

Hash of results JSON only:

```
ResultHash = SHA256(JSONResults)
```

**Use:** Identify what results were obtained, regardless of query

---

## Verifying Evidence

### Verification Process

```javascript
import { validatesAuditableReceipt } from "../src/governance/projects-auditable-query-receipt.js";

// To verify evidence in a report:
const validation = validatesAuditableReceipt(
  originalReceipt,              // From report evidence
  reRunQueryText,               // Re-run same query
  reRunResults                  // Obtain same results
);

if (validation.valid) {
  console.log("✅ Evidence verified - query/results unchanged");
} else {
  console.log("❌ Evidence invalid - data was modified");
  console.log(validation.reason);  // Explains what changed
}
```

### What Can Be Detected

If someone modifies data after report generation:

```javascript
// Original evidence
originalHash = "a1b2c3d4e5f6..."

// Tampered with results
tamperedResults = [{ id: "999" }]

// Re-compute hash
newHash = SHA256(query + tamperedResults)
// newHash ≠ originalHash → DETECTED! ✓
```

---

## Using Evidence in Transformation Roadmap

### Example: Deterministic Transformation Report

```markdown
## Phase 1: Authority Mechanic Extraction

This analysis measured transformation capacity using:

**Source Query:** `mechanic-occurrences-inventory`
```
Hash: d4e5f6a1b2c3
Content: d4e5f6a1b2c3789abcdef0123456789abcdef0123456789abcdef01234567890
```

**Data Cited:**
- 287 branch mechanics found (from query hash verification)
- 3,847 lines of code measured
- 49 tests validating transformation

**Verification:** Anyone can verify by:
1. Re-running `SELECT * FROM mechanics WHERE type = 'branch'`
2. Computing SHA256 hash
3. Comparing to `d4e5f6a1b2c3789abcdef0123456789abcdef0123456789abcdef01234567890`
```

---

## Integration with Governance Artifacts

### No File Persistence

The hash system **does NOT store full query/result pairs as files**.

Instead:
- **Hash stored in report** ← immutable evidence
- **Query text in report** ← human-readable reference
- **Results** ← derived from re-running query against governance artifacts

### Regeneration Flow

```
Report reader wants to verify:
    ↓
Re-runs query against governance artifacts
    ↓
Gets results
    ↓
Computes SHA256(query + results)
    ↓
Compares to hash in report
    ↓
✅ Match → Evidence valid
❌ No match → Evidence tampered
```

---

## Report Evidence Checklist

When generating reports with evidence:

- [x] Register each query used in analysis
- [x] Capture query text (normalized)
- [x] Capture results obtained
- [x] Get content hash from receipt
- [x] Export evidence registry
- [x] Cite short hash (first 12 chars) in report text
- [x] Reference full hash in evidence appendix
- [x] Document which governance artifacts were queried
- [x] Note timestamp when queries were executed

---

## Example: Transformation Readiness Report Evidence Section

```markdown
---

## Appendix: Data Evidence

All metrics in this report are derived from governance artifacts.
Use the hashes below to verify and regenerate results.

### Query Evidence Registry

Generated: 2026-08-07T14:32:15Z
Source Artifacts: source-facts-self-governance-report.v1.json

| Query Name | Short Hash | Full Content Hash | Timestamp |
|---|---|---|---|
| test-inventory | a1b2c3d4e5f6 | a1b2c3d4...34567890 | 2026-08-07T14:32:10Z |
| mechanic-branches | b2c3d4e5f6a1 | b2c3d4e5...45678901 | 2026-08-07T14:32:11Z |
| mechanic-iterations | c3d4e5f6a1b2 | c3d4e5f6...56789012 | 2026-08-07T14:32:12Z |
| test-scenario-lineage | d4e5f6a1b2c3 | d4e5f6a1...67890123 | 2026-08-07T14:32:13Z |
| test-production-reachability | e5f6a1b2c3d4 | e5f6a1b2...78901234 | 2026-08-07T14:32:14Z |

### Verification Instructions

To verify any query result:

1. **Identify the query** from the table above
2. **Re-run the query** against `source-facts-self-governance-report.v1.json`
3. **Compute SHA256** of: `NormalizedQuery + "\\n---\\n" + JSONResults`
4. **Compare** to the "Full Content Hash" in the table
5. **Result:**
   - ✅ Hash matches → Evidence is verified, no tampering
   - ❌ Hash differs → Evidence was modified, regenerate report

### Example Verification

```bash
# Verify test-inventory query
QUERY_TEXT="SELECT COUNT(*) FROM tests"
RESULTS='[{"count": 178}]'
COMBINED="${QUERY_TEXT}\n---\n${RESULTS}"
HASH=$(echo -n "${COMBINED}" | sha256sum | cut -d' ' -f1)
# HASH should equal: a1b2c3d4...34567890

if [ "$HASH" == "a1b2c3d4...34567890" ]; then
  echo "✅ Evidence verified"
else
  echo "❌ Evidence mismatch - regenerate from artifacts"
fi
```

---

## Why This Matters

### Traditional Reports
```
"Based on test data we analyzed..."
Reader: 😕 What data? How can I verify?
```

### Hash-Based Evidence
```
"Based on test data (hash: a1b2c3d4e5f6) we analyzed..."
Reader: ✅ Can re-run query, verify hash, trust results
```

### Transformation Implications

This enables reports to be:
- **Auditable** — anyone can verify data sources
- **Reproducible** — readers can regenerate findings
- **Tamper-evident** — hash mismatch signals data changed
- **Governance-native** — evidence references live artifacts
- **Link-preserving** — hashes don't change unless data does

---

## Implementation Checklist

- [x] SHA256 hashing of query + results
- [x] Deterministic query normalization (whitespace)
- [x] Content-addressable evidence references
- [x] QueryEvidenceRegistry for capturing evidence
- [x] Validation functions for verifying hashes
- [x] Governance artifact integration
- [x] Markdown evidence formatting
- [ ] (Optional) Signed evidence blocks for additional security

---

## Next Steps

1. **Integrate into existing reports** (Transformation Readiness, Mechanic Inventory, etc.)
2. **Add evidence registry to report generation pipeline**
3. **Include evidence verification links in published reports**
4. **Train readers on evidence verification process**
5. **Publish governance artifacts with queryable interfaces** (enables verification)
