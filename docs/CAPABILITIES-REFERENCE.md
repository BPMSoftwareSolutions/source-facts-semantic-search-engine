# Deterministic Transformation Capabilities Reference

This document maps the 8 core capabilities discovered from test suite analysis to their implementations, with usage examples.

## Quick Start

Run the capabilities demo:

```bash
npm run capabilities-demo
```

This shows all 8 capabilities in action with concrete examples.

---

## 1. Authority Extractor

**Question:** What declared authority exists?

**Implementation:** [`src/governance/classifies-execution-mechanics.js`](../src/governance/classifies-execution-mechanics.js)

**Function:** `extractsDeclaredAuthorityMechanics(document, filePath)`

**What it does:**
- Reads authority declaration documents (JSON contracts)
- Extracts declared mechanics with their source locations
- Validates schema version and structure
- Returns only `AUTHORITY_BOUND` mechanics

**Example:**
```javascript
const authorityDoc = {
  schemaVersion: "authority-declaration.v1",
  authority: {
    mechanics: [
      {
        mechanicId: "resolve-user-decision",
        mechanic: "branch",
        sourceLocation: "src/auth.js:10-12",
        coverage: "AUTHORITY_BOUND"
      }
    ]
  }
};

const declared = extractsDeclaredAuthorityMechanics(authorityDoc, "contracts/auth.authority.json");
// → [{ mechanicId: "resolve-user-decision", mechanic: "branch", ... }]
```

**Used by:** `projectsSelfGovernanceReport`, compliance checking, authority home resolution

---

## 2. Mechanic Classifier

**Question:** What kind of executable mechanic is this?

**Implementation:** [`src/governance/classifies-execution-mechanics.js`](../src/governance/classifies-execution-mechanics.js)

**Function:** `classifiesMechanicOccurrence(occurrence, declaredMechanics, options)`

**What it does:**
- Analyzes a code occurrence (branch, loop, throw, etc.)
- Compares against declared authority
- Classifies governance posture (AUTHORIZED, UNAUTHORIZED, etc.)
- Determines violation type and remediation need

**Example:**
```javascript
const occurrence = {
  mechanic: "branch",
  modulePath: "src/auth.js",
  startLine: 11,
  endLine: 11
};

const classification = classifiesMechanicOccurrence(occurrence, declaredMechanics);
// → {
//     posture: "UNAUTHORIZED_EXECUTABLE_MEANING",
//     authorityDisposition: "AUTHORITY_ADMITTED",
//     violationDisposition: "OUTSIDE_KERNEL_EXECUTABLE_MECHANIC_VIOLATION",
//     remediationDisposition: "REPLACEMENT_REQUIRED"
//   }
```

**Used by:** Violation detection, conformance checking, remediation planning

---

## 3. Authority Family Resolver

**Question:** Which authority family owns this mechanic?

**Implementation:** [`src/governance/mechanic-authority-families.js`](../src/governance/mechanic-authority-families.js)

**Function:** `resolvesAuthorityFamily(mechanic)`

**What it does:**
- Maps execution mechanics to their semantic authority families
- Provides canonical family names
- Enables grouping by governance domain

**Example:**
```javascript
resolvesAuthorityFamily("branch");      // → "decision-authority"
resolvesAuthorityFamily("loop");        // → "iteration-authority"
resolvesAuthorityFamily("throw");       // → "terminal-result-authority"
resolvesAuthorityFamily("construction"); // → "projection-authority"
```

**Supported mechanics:**
- Control flow: branch, conditional, loop, iteration
- Error handling: throw, try/catch, fallback, retry
- Data transformation: construction, mutation, projection
- Other: text, state-transition, validation

**Used by:** Governance reports, violation categorization, capability discovery

---

## 4. Authority Succession Resolver

**Question:** What is the current authority successor?

**Implementation:** [`src/governance/resolves-authority-succession.js`](../src/governance/resolves-authority-succession.js)

**Function:** `resolvesAuthoritySuccession(report, occurrence, options)`

**What it does:**
- Tracks authority version lineage
- Identifies deprecated vs. current versions
- Determines successor authority
- Detects migration requirements

**Example succession chains:**
```
authority-v1.0 → authority-v1.1 (patch)
authority-v1.1 → decision-authority-v2.0 (major)
decision-authority-v2.0 (current)
```

**Used by:** Authority migration tracking, deprecation warnings, upgrade paths

---

## 5. Data-Driven Wiring Detector

**Question:** Does execution resolve through declared data?

**Implementation:** [`src/governance/resolves-data-driven-wiring.js`](../src/governance/resolves-data-driven-wiring.js)

**Function:** `resolvesDataDrivenWiring(occurrence, dataflowIndex)`

**What it does:**
- Analyzes whether a mechanic's execution depends on external data
- Detects opportunities to externalize decisions
- Maps data dependencies for transformation
- Identifies automation-safe patterns

**Example:**
```javascript
// Code with branch on external config
if (config.featureEnabled) {
  processRequest();
} else {
  skipRequest();
}

// Can be transformed to:
// decision: config.featureEnabled → "process" | "skip"
// then: switch(decision) { case "process": ... }
```

**Used by:** Automation readiness scoring, capability externalization, data projection

---

## 6. Automation Readiness Classifier

**Question:** How safely can this occurrence be automated?

**Implementation:** [`src/governance/classifies-automation-readiness.js`](../src/governance/classifies-automation-readiness.js)

**Function:** `classifiesAutomationReadiness(occurrence, context)`

**What it does:**
- Scores how deterministically a pattern can be extracted
- Assesses transformation safety (0-100%)
- Identifies patterns needing manual review
- Suggests automation strategy

**Readiness levels:**
- **95-100%:** Simple, fully deterministic patterns (constants, known types)
- **75-94%:** Clear patterns with minor ambiguities
- **50-74%:** Patterns requiring careful semantic analysis
- **<50%:** Requires human review or specification

**Used by:** Transformation planning, resource allocation, risk assessment

---

## 7. Know-How Registry Manager

**Question:** What reviewed know-how is reusable?

**Implementation:** [`src/governance/discovers-know-how-registry.js`](../src/governance/discovers-know-how-registry.js)

**Function:** `discoversKnowHowRegistry(report, options)`

**What it does:**
- Catalogs proven transformation patterns
- Tracks cross-repository reuse
- Maintains maturity/admission status
- Enables pattern deduplication

**Registry states:**
- `OBSERVED` — Found in test/code evidence
- `PROPOSED` — System derived candidate lineage
- `REVIEW_REQUIRED` — Ambiguous meaning/boundary
- `ADMITTED` — Canonical capability authority
- `SUPERSEDED` — Replaced by newer authority
- `REJECTED_DUPLICATE` — Existing capability owns meaning

**Example pattern:**
```
Pattern: Decision authority with branch normalization
Applicability: 7 repositories
Maturity: ADMITTED
Confidence: 94%
```

**Used by:** Capability library growth, pattern deduplication, cross-org learning

---

## 8. Semantic Overlap Detector

**Question:** Does existing authority already express this meaning?

**Implementation:** [`src/governance/discovers-semantic-overlap-proposals.js`](../src/governance/discovers-semantic-overlap-proposals.js)

**Function:** `discoversSemanticOverlapProposalBatches(report, candidates)`

**What it does:**
- Compares candidate capabilities against existing authority
- Computes semantic fingerprints for matching
- Flags duplicate patterns
- Suggests consolidation

**Semantic fingerprint components:**
- Verb (resolve, classify, extract, project)
- Subject concept (branch condition, object shape)
- Input concepts (data dependencies)
- Output concept (result disposition)
- Effect class (pure, side-effect, stateful)
- Authority family requirements

**Example:**
```javascript
Candidate: "Normalize branch conditions"
Existing match: "Decision authority normalization (v2.1)"
Overlap score: 92%
Recommendation: "Reuse existing authority"
```

**Used by:** Library deduplication, capability consolidation, waste detection

---

## Capability Constellation

These 8 capabilities work together as a deterministic transformation engine:

```
Observed Code
    ↓
[1] Extract Authority
    ↓
[2] Classify Mechanics
    ↓
[3] Resolve Family
    ↓
[5] Detect Data Wiring
    ↓
[6] Assess Automation
    ↓
[4] Check Succession
    ↓
[7] Check Registry
    ↓
[8] Detect Overlaps
    ↓
Transformation Action
```

## Transformation Maturity Levels

**Level 1 — Collapse:**
Remove mechanically noisy bodies, externalize known patterns

**Level 2 — Data-drive:**
Move extracted mechanics into canonical authority

**Level 3 — Reproject:**
Generate collapsed code from authority (code becomes disposable)

**Level 4 — Delete & Regenerate:**
Source = projection (economics fully change)

---

## Running the Capabilities

### See All 8 Capabilities in Action

Run the demo (shows each capability with example data):

```bash
npm run capabilities-demo
```

**Output shows:**
- What each capability does
- Example input/output
- Semantic questions answered
- How they work together

### Run Full Governance Report

To see all 8 capabilities applied to **your live repository**:

```bash
# Step 1: Generate project index
npm run project

# Step 2: Run full self-governance report (uses all 8 capabilities)
npm run govern
```

**What `npm run govern` produces:**
- Authority extraction results
- Mechanic classification breakdown
- Family resolution mapping
- Succession tracking
- Data wiring analysis
- Automation readiness scores
- Know-how registry proposals
- Semantic overlap detection
- Comprehensive governance report

**To validate report contents:**

```bash
# Check report was generated and has results
npm run govern 2>&1 | tail -50

# Extract just the readiness summary
npm run govern 2>&1 | grep -A 20 "Summary"

# Get the mechanismics observed
npm run govern 2>&1 | grep "observed:"
```

---

## Test Coverage

Each capability is tested in [`test/self-governance-report.test.js`](../test/self-governance-report.test.js):

- Authority extraction validation
- Mechanic classification accuracy
- Family resolution completeness
- Automation scoring correctness
- Registry discovery quality
- Overlap detection precision

Run tests:
```bash
npm test
```

---

## Key Insights

> **Stable pattern = deterministic transformation opportunity**

Once a mechanic has:
1. Stable observed shape (from code)
2. Stable semantic interpretation (from authority)
3. Proven transformation capability (tested)

→ Continuing to spend cognitive effort on it is waste.

The strategic loop becomes:
```
Find stable pattern
    ↓
Prove transformer once
    ↓
Register capability
    ↓
Apply everywhere
    ↓
Collapse bodies
    ↓
Grow authority
    ↓
Reproject
```

That's how SourceFacts transforms from analysis to **repository transformation engine**.
