# Source Facts Self-Governance Report

| | |
|---|---|
| **Report type** | `source-facts-self-governance-report.v1` |
| **Generated** | 2026-08-03T18:14:12.903Z |
| **Repository** | src |
| **Workspace** | `C:\lab\repos\source-facts-semantic-search-engine\src` |
| **Scan ID** | 5ac1fbb86ad644223cdfbe6756af1d1f8689dcf5bb0c6d38aca40d556bd2ed93 |
| **Disposition** | `OBSERVATIONAL_NO_GATE_APPLIED` |

## Executive Summary

SourceFacts indexed its own source tree and classified every observed executable
mechanic against admitted (`AUTHORITY_BOUND`) semantic authority. This report is
**observational**: no build gate, backlog baseline, or regression policy is wired
to it yet, so nothing here blocks a build.

| Metric | Count | Share of observed |
|---|---:|---:|
| Execution mechanics observed | 3,383 | 100.0% |
| Governed by semantic authority | 0 | 0.0% |
| Unknown classification | 3,383 | 100.0% |
| Authorized temporary backlog | 0 | 0.0% |
| Unauthorized executable meaning | 0 | 0.0% |
| Mechanical adapter operation | 0 | 0.0% |
| Kernel primitive | 0 | 0.0% |

## Coverage by Mechanic Type

| Mechanic | Observed | Governed | Coverage |
|---|---:|---:|---:|
| object-construction | 1,236 | 0 | 0.0% |
| fallback | 689 | 0 | 0.0% |
| branch | 652 | 0 | 0.0% |
| state-mutation | 211 | 0 | 0.0% |
| iteration | 156 | 0 | 0.0% |
| validation | 103 | 0 | 0.0% |
| throw | 92 | 0 | 0.0% |
| serialization | 85 | 0 | 0.0% |
| exception-handling | 84 | 0 | 0.0% |
| normalization | 74 | 0 | 0.0% |
| retry | 1 | 0 | 0.0% |

## Authority Sources

| Authority file | Declares governance for | Mechanics declared | Authority-bound | Resolved against observed code |
|---|---|---:|---:|---:|
| `contracts/serves-query-console.authority.json` | `src/console/serves-query-console.js` | 11 | 11 | 0 ⚠️ |

## Notable Findings

- **Dangling authority source:** `contracts/serves-query-console.authority.json` declares 11 `AUTHORITY_BOUND` mechanic(s) against `src/console/serves-query-console.js`, but none resolved against any observed occurrence in this scan. The declared source file most likely no longer exists at that path (renamed or moved), so its coverage cannot currently be verified.

## Disposition

`OBSERVATIONAL_NO_GATE_APPLIED` — this run only observes and classifies; it does not gate a build. A future slice adds a registered query catalog, a backlog baseline, and a regression gate that can act on these classifications.

