# Project Authority Candidates from Mechanics

## Quick Start

The `project-authority` command transforms observed executable mechanics into JSON semantic authority candidate scaffolds.

### Basic Usage

```bash
node src/cli.js project-authority \
  --index <path-to-index.json> \
  --output <output-path> \
  --module <target-file> \
  --responsibility <function-name> \
  --summary
```

### Example

```bash
# Generate authority candidates for governed-artifact-engine.mjs
node src/cli.js project-authority \
  --index C:\tmp\governed-artifact-index.json \
  --output C:\tmp\authority-candidates.json \
  --module "governed-artifact-engine.mjs" \
  --responsibility "validateConformanceProfile" \
  --summary
```

**Output:**
```
C:\tmp\authority-candidates.json
Generated 8 authority candidates
Coverage: 0.0%
Gate status: NOT_READY
```

## Output Format

The command generates JSON with this structure:

```json
{
  "sourceFile": "governed-artifact-engine.mjs",
  "responsibility": "validateConformanceProfile",
  "generatedAtUtc": "2026-08-02T14:30:00Z",
  "observedMechanicsCount": 8,
  "candidates": [
    {
      "authorityCandidateType": "decision-authority-candidate.v1",
      "candidateId": "resolve-contract-admission-disposition",
      "source": {
        "modulePath": "governed-artifact-engine.mjs",
        "enclosingSymbol": "validateConformanceProfile",
        "mechanic": "branch",
        "startLine": 162,
        "sourceSnippet": "if (contract.status === \"admitted\") { ... }"
      },
      "inputs": [ ... ],
      "candidateOutcomes": [ ... ],
      "requiredHumanResolution": [
        "confirm condition is complete",
        "confirm all outcomes identified",
        "confirm result type per outcome"
      ],
      "status": "AUTHORITY_CANDIDATE_PROJECTED",
      "coverageDisposition": "SEMANTIC_DECISION_REQUIRED"
    },
    { "...more candidates..." }
  ],
  "coverageSummary": {
    "totalMechanics": 8,
    "fullyAuthorized": 0,
    "partiallyCovered": 0,
    "unresolved": 8,
    "authorityConformanceRatio": 0.0,
    "admissionGateStatus": "NOT_READY"
  }
}
```

## Candidate Types Generated

The projector automatically generates the appropriate JSON type for each mechanic:

| Mechanic | Authority Type | Output Template |
|----------|---|---|
| **branch** | decision-authority-candidate.v1 | Condition, inputs, outcomes, no-match behavior |
| **throw** | failure-disposition-authority-candidate.v1 | Error type, precondition, failure identity |
| **object-construction** | projection-mapping-candidate.v1 | Output fields, source mappings, constants |
| **serialization** | serialization-profile-candidate.v1 | Encoding, canonicalization, determinism |
| **validation** | validation-policy-candidate.v1 | Schema, success/failure paths |
| **iteration** | iteration-authority-candidate.v1 | Collection, order, stopping, aggregation |
| **state-mutation** | state-transition-authority-candidate.v1 | Mutated state, preconditions, proof |
| **exception-handling** | failure-observation-candidate.v1 | Caught errors, observation vs transform |
| **fallback** | fallback-policy-candidate.v1 | Missing-value detection, fallback value |
| **normalization** | normalization-authority-candidate.v1 | Source variants, canonical form |

## Workflow: From Mechanics to Authority

```
1. Generate index (project command)
   ↓
2. Project authority candidates (this command) ← YOU ARE HERE
   ↓
3. Human/agent reviews and completes unresolved decisions
   ↓
4. Bind candidates to admitted JSON authority
   ↓
5. Track coverage (which mechanics are authorized)
   ↓
6. When 100% authorized → Replace gate opens
```

## Understanding "Unresolved Decisions"

Each candidate includes a `requiredHumanResolution` array. These are the semantic questions **only a human or domain expert can answer**:

**Example for a branch candidate:**
```json
"requiredHumanResolution": [
  "confirm condition is complete and accurate",
  "confirm all outcomes are identified",
  "confirm no-match behavior",
  "confirm result type per outcome",
  "confirm decision priority/precedence"
]
```

**What to do:**
1. Read the source code at `source.startLine`
2. Answer each question
3. Update the candidate JSON with the confirmed values
4. Mark as `status: "AUTHORITY_BOUND"` when complete

## Real Example: Trace a Branch Decision

### Input: Observed Mechanic

From query on `governed-artifact-engine.mjs`:
```
mechanic: branch
startLine: 162
enclosingSymbol: validateConformanceProfile
sourceSnippet: if (contract.status === "admitted") { return processContract(contract); } throw new Error("CONTRACT_NOT_ADMITTED");
```

### Generated Candidate (Partial)

```json
{
  "authorityCandidateType": "decision-authority-candidate.v1",
  "candidateId": "resolve-contract-admission-disposition",
  "source": {
    "modulePath": "governed-artifact-engine.mjs",
    "startLine": 162,
    "sourceSnippet": "if (contract.status === \"admitted\") { return processContract(contract); } throw new Error(\"CONTRACT_NOT_ADMITTED\");"
  },
  "inputs": [
    {
      "inputId": "contract_admission_status",
      "candidatePath": "contract.status",
      "observedValue": "admitted",
      "requiredHumanResolution": [
        "confirm contract.status is validated upstream",
        "are there other valid states that should branch differently?"
      ]
    }
  ],
  "candidateOutcomes": [
    {
      "outcomeId": "contract-admitted-process",
      "observedEffect": "return processContract(contract)",
      "requiredHumanResolution": [
        "confirm processContract is the correct semantic action"
      ]
    },
    {
      "outcomeId": "contract-not-admitted-reject",
      "observedEffect": "throw new Error(\"CONTRACT_NOT_ADMITTED\")",
      "requiredHumanResolution": [
        "confirm this is canonical rejection",
        "should error be classified?"
      ]
    }
  ]
}
```

### What Needs Completion (Human/Agent Task)

1. **Input validation:** Confirm `contract.status` is validated upstream
2. **All states covered:** Are there states besides "admitted" that need handling?
3. **Outcome semantics:** What does "processContract" represent?
4. **Error classification:** Should this throw a custom `ContractNotAdmittedError`?
5. **No-match handling:** What if `contract.status` is something unexpected?

## Options

| Flag | Required | Description |
|------|----------|---|
| `--index <path>` | Optional | Path to index.json (default: `source-fact-index.json` in cwd) |
| `--output <path>` | Optional | Path for output file (default: `authority-candidates.json` in cwd) |
| `--module <name>` | Optional | Filter by module path (e.g., `"governed-artifact-engine.mjs"`) |
| `--responsibility <id>` | Optional | Filter by function name (e.g., `"validateConformanceProfile"`) |
| `--summary` | Flag | Print summary after generation |
| `--pretty` | Flag | Pretty-print JSON output (default: true) |

## Coverage Tracking

The output includes a `coverageSummary` showing:

```json
{
  "totalMechanics": 8,
  "fullyAuthorized": 0,
  "partiallyCovered": 0,
  "unresolved": 8,
  "authorityConformanceRatio": 0.0,
  "admissionGateStatus": "NOT_READY"
}
```

**Meanings:**
- **fullyAuthorized:** Mechanics completely bound to admitted authority
- **partiallyCovered:** Some semantic decisions made, but incomplete
- **unresolved:** No authority binding yet
- **authorityConformanceRatio:** Fraction of mechanics with complete authority (0.0 = 0%, 1.0 = 100%)
- **admissionGateStatus:** `READY_FOR_REPLACEMENT` when ratio is 1.0, else `NOT_READY`

## Integration with Migration Loop

```text
Source code
    ↓
Observe mechanics (query-source-facts-before-reading-code) ← precursor
    ↓
Project authority candidates (THIS COMMAND) ← automated
    ↓
Human completes unresolved decisions ← manual review
    ↓
Bind to authority (authority-coverage-resolver) ← next stage
    ↓
Project replacement code (projection-engine) ← when 100% authorized
```

## Troubleshooting

### "Generate 0 authority candidates"
- **Check:** Does the index contain mechanics for that module?
- **Fix:** Run `query` command to verify mechanics exist: `SELECT mechanic, COUNT(*) FROM bodyMechanics WHERE modulePath LIKE '%filename%' GROUP BY mechanic`

### "Candidates have too many unresolved decisions"
- **Why:** Source code parsing is limited (would need full AST extraction)
- **What to do:** Read source at line numbers, manually extract:
  - Exact condition expressions
  - All branch outcomes
  - Field mappings
  - Error types and messages

### "Coverage ratio stays at 0%"
- **Why:** Candidates are auto-generated; binding them to authority is manual
- **What to do:** 
  1. Review `requiredHumanResolution` for each candidate
  2. Update fields with confirmed values
  3. Change `status` from `"AUTHORITY_CANDIDATE_PROJECTED"` to `"AUTHORITY_BOUND"`
  4. Re-run coverage analyzer

## Next Steps

1. **Generate candidates** with this command
2. **Save output** to project docs
3. **Route to domain expert** for semantic review
4. **Update JSON** with confirmed decisions
5. **Track in version control** as authority evolves
6. **Run coverage resolver** to measure binding completeness

---

For detailed information on the projection workflow, see `project-authority-candidates-from-mechanics/SKILL.md`.
