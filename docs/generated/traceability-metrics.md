# Traceability Metrics Report

**Generated:** 2026-08-04T13:29:42.281Z
**Report Index ID:** `unknown`
**Report Scan ID:** `unknown`
**Call Graph Index ID:** `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4`
**Repository:** unknown

---

## 1. Entry Point Reachability (Call Graph)

| Metric | Value |
|---|---:|
| Command roots discovered | 15 |
| Runtime callable functions | 667 |
| Reachable from CLI | 535 |
| Unreachable (dead code) | 132 |
| Invocation edges | 6126 |
| Resolved edges | 1361 |
| Ambiguous edges | 8 |
| Unresolved edges | 4757 |
| Max call depth | 10 |

**Reachability Coverage:** `80.2%`

---

## 2. Symbol Inventory (Source Index)

| Symbol Kind | Count |
|---|---:|
| Functions | 619 |
| Variables | 2593 |
| Parameters | 1735 |
| Classes | 3 |
| **Total** | **4995** |

---

## 3. Feature Coverage (Governance Report)

| Measure | Value |
|---|---:|
| Canonical features | 0 |
| Proposed features | 0 |
| Canonical scenarios | 0 |
| Scenarios structurally closed | 0 |
| Scenarios with execution evaluated | 0 |
| Scenarios runtime conformant | 0 |

**Structural Closure Rate:** `0%`
**Runtime Conformance Rate:** `0%`

---

## 4. Evidence Lineage (Mechanics and Clusters)

| Lineage Type | Count |
|---|---:|
| Mechanics with canonical scenario lineage | 0 |
| Mechanics with proposed scenario lineage | 0 |
| Mechanics with ambiguous lineage | 0 |
| Mechanics without scenario lineage | 0 |
| Unresolved responsibility clusters | 0 |

---

## 5. Authority Document Status

| Status | Count |
|---|---:|
| With canonical scenario lineage | 0 |
| With proposed scenario lineage | 0 |
| Without scenario lineage | 0 |

---

## 6. Completeness Dimensions (Round 1 Baseline)

| Dimension | Symbol | Current Status | Target |
|---|---|---|---|
| Inventory completeness | `I` | Measured | 100% |
| Reachability closure | `R` | 80.2% | 100% |
| Canonical lineage coverage | `L` | 0% | 100% |
| Capability mapping | `C` | Pending | 100% |
| Structural closure | `S` | 0% | 100% |
| Runtime proof coverage | `P` | 0% | 100% |

**Strict Traceability Score:** `min(I, R, L, C, S, P) = TBD`

---

## 7. Lineage Quality Findings

| Finding | Count |
|---|---:|
| Implementation variants declared as distinct responsibilities | 0 |
| Multiple responsibility owners requiring review | 0 |
| Projection obligations without projecting relationship | 0 |

---

## 8. Evaluation Limits (Structural Blockers)

| Limit Type | Count |
|---|---:|
| Authority wiring not evaluated (depth limit) | 0 |
| Body not evaluated outside subject | 0 |
| Body not statically observed | 0 |

---

## Artifact Identity

This report ties metrics to three versioned artifacts:

1. **Source-facts index:** `unknown` (scan: `unknown`)
2. **Call-graph index:** `sha256:323891e7cc2dc48c8d12eba5b176d791b7d97da90ddeae8136530b12155bfaf4`
3. **Report generation:** 2026-08-04T13:29:42.281Z

Metrics should be regenerated whenever the source-facts index changes. This document should not be manually edited; update the generator script in `src/generate-traceability-docs.js` instead.

---

**Round 1 Readiness:** Metrics are now versioned and reproducible from the index. Documentation will remain current with each governance run.
