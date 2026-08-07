#!/usr/bin/env node
/**
 * Detect stable patterns in execution mechanics from live project data
 *
 * A stable pattern is one that:
 * 1. Appears repeatedly (multiple observations)
 * 2. Has consistent semantic meaning (same authority family)
 * 3. Has determinizable data dependencies (high wiring clarity)
 * 4. Has proven automation safety (high readiness score)
 * 5. Occurs across multiple contexts (generalizable)
 */

import { resolvesAuthorityFamily } from "../src/governance/mechanic-authority-families.js";
import { projectSourceFactsWorkspace } from "../src/project.js";

/**
 * Analyzes a collection of mechanic occurrences to detect stable patterns
 */
function detectsStablePatterns(occurrences, options = {}) {
  const {
    minObservations = 3,        // Minimum times pattern must occur
    minAutomationScore = 75,    // Minimum safety score (0-100)
    minFileVariety = 2,         // Minimum different files
    deduplicationKey = null,    // Optional custom fingerprint function
    automationAuthority = null, // Map of mechanic → readiness score
  } = options;

  // Group occurrences by mechanic type
  const byMechanic = new Map();

  occurrences.forEach((occurrence) => {
    const key = occurrence.mechanic;
    if (!byMechanic.has(key)) {
      byMechanic.set(key, []);
    }
    byMechanic.get(key).push(occurrence);
  });

  // Analyze each mechanic type
  const candidates = [];

  for (const [mechanic, observations] of byMechanic) {
    if (observations.length < minObservations) continue;

    const family = resolvesAuthorityFamily(mechanic);
    const analysis = analyzesMechanicObservations(observations, {
      mechanic,
      family,
      minFileVariety,
      minAutomationScore,
      deduplicationKey,
      automationAuthority,
    });

    if (analysis.isStable) {
      candidates.push(analysis);
    }
  }

  // Sort by stability score (highest first)
  candidates.sort((a, b) => b.stabilityScore - a.stabilityScore);

  return candidates;
}

/**
 * Analyzes individual observations of a mechanic type
 */
function analyzesMechanicObservations(observations, context) {
  const {
    mechanic,
    family,
    minFileVariety,
    minAutomationScore,
    deduplicationKey,
    automationAuthority,
  } = context;

  const uniqueFiles = new Set(observations.map(o => o.modulePath));
  const fileCount = uniqueFiles.size;

  // Score components
  const automationScore = analyzeAutomationReadiness(mechanic, automationAuthority);

  const scores = {
    frequency: Math.min(100, (observations.length / 10) * 100),      // 0-100
    variety: fileCount >= minFileVariety ? 100 : (fileCount / minFileVariety) * 100,  // 0-100
    consistency: analyzeConsistency(observations),                    // 0-100
    dataWiring: analyzeDataWiringPatterns(observations),             // 0-100
    automation: automationScore ?? 0,                                 // 0-100 or 0 if not provided
  };

  // Weighted stability score
  const stabilityScore = (
    scores.frequency * 0.2 +      // How often observed
    scores.variety * 0.2 +         // Across how many contexts
    scores.consistency * 0.2 +      // How similar are observations
    scores.dataWiring * 0.2 +       // How clear is data flow
    scores.automation * 0.2         // How safe to automate
  );

  // If automation authority is not provided, skip that check
  const automationCheck = automationScore === null || scores.automation >= minAutomationScore;

  const isStable =
    stabilityScore >= 70 &&
    automationCheck &&
    fileCount >= minFileVariety;

  return Object.freeze({
    // Pattern identification
    mechanic,
    family,

    // Observations
    observationCount: observations.length,
    fileCount,
    filesAffected: Array.from(uniqueFiles).sort(),

    // Scores (0-100)
    scores: Object.freeze({ ...scores }),
    stabilityScore: Math.round(stabilityScore),
    automationReadiness: scores.automation,

    // Assessment
    isStable,
    readinessLevel: categorizeReadiness(stabilityScore, automationScore),
    automationAuthorityProvided: automationScore !== null,

    // Actionability
    recommendation: recommendsAction(mechanic, stabilityScore, scores),
    nextSteps: suggestsNextSteps(mechanic, isStable, scores),

    // Details
    observations,
  });
}

/**
 * Analyzes how consistently a pattern appears
 * (same line types, same context, etc.)
 */
function analyzeConsistency(observations) {
  if (observations.length < 2) return 100;

  // Simplified: check if observations are in similar contexts
  // In production, would analyze AST structure, surrounding code, etc.

  const lineRanges = observations.map(o => ({
    start: o.startLine ?? 0,
    end: o.endLine ?? o.startLine ?? 0,
    size: (o.endLine ?? o.startLine ?? 0) - (o.startLine ?? 0) + 1,
  }));

  // Compute average size and variance
  const avgSize = lineRanges.reduce((sum, r) => sum + r.size, 0) / lineRanges.length;
  const variance = lineRanges.reduce((sum, r) => sum + Math.pow(r.size - avgSize, 2), 0) / lineRanges.length;
  const stdDev = Math.sqrt(variance);
  const coeffVariation = stdDev / avgSize;

  // Low variation = high consistency (max 100)
  const consistency = Math.max(0, 100 - (coeffVariation * 100));
  return Math.round(consistency);
}

/**
 * Analyzes whether pattern has clear data dependencies
 */
function analyzeDataWiringPatterns(observations) {
  // In full implementation, would:
  // - Analyze dataflow index
  // - Check for consistent dependency patterns
  // - Score externalizability

  // For demo: assume consistent patterns have higher wiring clarity
  const consistencyCount = observations.filter(o =>
    o.modulePath && o.startLine && o.endLine
  ).length;

  return Math.round((consistencyCount / observations.length) * 100);
}

/**
 * Scores how safely a mechanic type can be automated
 * Loads from automation readiness authority (external configuration)
 */
function analyzeAutomationReadiness(mechanic, automationAuthority = null) {
  if (automationAuthority && automationAuthority[mechanic] !== undefined) {
    return automationAuthority[mechanic];
  }

  // If no authority provided, return null (no hardcoded default)
  return null;
}

/**
 * Categorizes overall readiness level
 */
function categorizeReadiness(score, automationScore) {
  // If automation readiness not provided, mark as pending
  if (automationScore === null) {
    if (score >= 90) return "CANDIDATE_REQUIRES_AUTOMATION_ASSESSMENT";
    if (score >= 75) return "CANDIDATE_REQUIRES_AUTOMATION_ASSESSMENT";
    return "REQUIRES_ANALYSIS";
  }

  if (score >= 90) return "READY_FOR_DETERMINISTIC_TRANSFORMATION";
  if (score >= 75) return "CANDIDATE_FOR_PATTERN_REGISTRATION";
  if (score >= 60) return "REQUIRES_ANALYSIS";
  return "NOT_READY";
}

/**
 * Recommends action based on pattern analysis
 */
function recommendsAction(mechanic, stabilityScore, scores) {
  if (stabilityScore >= 90) {
    return `"${mechanic}" pattern is stable and ready for deterministic transformation. Register as canonical capability.`;
  }
  if (stabilityScore >= 75) {
    return `"${mechanic}" pattern shows promise (score: ${Math.round(stabilityScore)}). Requires semantic analysis and test proof before registration.`;
  }
  if (scores.automation < 70) {
    return `"${mechanic}" pattern needs manual review for safe automation (score: ${Math.round(scores.automation)}/100).`;
  }
  return `"${mechanic}" pattern needs more observations or consistency analysis before consideration.`;
}

/**
 * Suggests concrete next steps
 */
function suggestsNextSteps(mechanic, isStable, scores) {
  const steps = [];

  if (scores.frequency < 80) {
    steps.push("Collect more observations to establish pattern frequency");
  }
  if (scores.variety < 80) {
    steps.push("Find pattern occurrences in more files/modules");
  }
  if (scores.consistency < 80) {
    steps.push("Analyze and document semantic consistency rules");
  }
  if (scores.dataWiring < 80) {
    steps.push("Map data dependencies and externalizability");
  }
  if (scores.automation < 80) {
    steps.push("Create transformation prototype and test");
  }

  if (isStable) {
    steps.push("Write transformation capability proof (test suite)");
    steps.push("Register in know-how registry");
    steps.push("Apply deterministically across repository");
  }

  return steps;
}

// ============================================================================
// Load automation readiness authority
// ============================================================================

async function loadAutomationAuthority() {
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const authorityPath = path.default.join(process.cwd(), 'config', 'automation-readiness-authority.json');
    const data = fs.default.readFileSync(authorityPath, 'utf-8');
    const authority = JSON.parse(data);
    return authority.mechanicReadiness || null;
  } catch (error) {
    console.warn("⚠️  Could not load automation readiness authority");
    console.warn("    Expected: config/automation-readiness-authority.json\n");
    return null;
  }
}

// ============================================================================
// Load observations from live project or JSON file
// ============================================================================

async function loadObservations() {
  const inputPath = process.argv[2];
  const fs = await import('node:fs');
  const path = await import('node:path');

  if (inputPath) {
    // Load from JSON file
    try {
      const data = fs.readFileSync(inputPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading observations from ${inputPath}:`, error.message);
      process.exit(1);
    }
  }

  // Load from live project index
  console.log("📁 Scanning project for execution mechanics...\n");

  try {
    const index = await projectSourceFactsWorkspace(process.cwd());

    // Extract mechanic observations from index
    const observations = (index.bodyMechanics || []).map(mechanic => {
      const sourceRef = (index.sourceReferences || [])
        .find(ref => ref.referenceId === mechanic.sourceReferenceId);

      return {
        occurrenceId: mechanic.bodyMechanicId || mechanic.mechanicId,
        mechanic: mechanic.mechanic,
        modulePath: mechanic.modulePath,
        startLine: sourceRef?.startLine ?? null,
        endLine: sourceRef?.endLine ?? null,
      };
    });

    return observations;
  } catch (error) {
    console.error("Could not load from project. Use JSON file or demo data.");
    console.error(`Error: ${error.message}\n`);

    return null;
  }
}

console.log("🔍 Stable Pattern Detection for Execution Mechanics\n");
console.log("=".repeat(70) + "\n");

// Load observations and automation authority
const observations = await loadObservations();
const automationAuthority = await loadAutomationAuthority();

if (!observations || observations.length === 0) {
  console.error("❌ No observations found.\n");
  console.error("To use this tool, you need mechanic observations data.\n");
  console.error("Option 1: Export from live project");
  console.error("  npm run project              (generate project index)");
  console.error("  npm run export-observations  (extract mechanic data)");
  console.error("  npm run detect-stable-patterns observations-*.json\n");
  console.error("Option 2: Provide observations JSON file");
  console.error("  npm run detect-stable-patterns <your-observations.json>\n");
  console.error("Format for observations:");
  console.error("  [");
  console.error('    { "mechanic": "branch", "modulePath": "src/file.js", "startLine": 10, "endLine": 15 },');
  console.error('    { "mechanic": "construction", "modulePath": "src/file.js", "startLine": 20, "endLine": 25 }');
  console.error("  ]\n");
  process.exit(1);
}

console.log(`✅ Loaded ${observations.length} mechanic observations\n`);

// Detect stable patterns
const stablePatterns = detectsStablePatterns(observations, {
  minObservations: 3,
  minAutomationScore: 70,
  minFileVariety: 2,
  automationAuthority,
});

console.log("📊 Pattern Stability Analysis Results\n");

stablePatterns.forEach((pattern, index) => {
  console.log(`${index + 1}. ${pattern.mechanic.toUpperCase()}`);
  console.log(`   Family: ${pattern.family || "unknown"}`);
  console.log(`   Observations: ${pattern.observationCount} occurrences across ${pattern.fileCount} files`);
  console.log(`   Files: ${pattern.filesAffected.join(", ")}`);
  console.log("");

  console.log("   📈 Stability Scores (0-100):");
  const scores = pattern.scores;
  Object.entries(scores).forEach(([key, value]) => {
    const bars = "█".repeat(Math.floor(value / 10));
    const empty = "░".repeat(10 - Math.floor(value / 10));
    console.log(`      ${key.padEnd(15)} [${bars}${empty}] ${Math.round(value)}`);
  });

  console.log(`\n   Overall Stability: ${pattern.stabilityScore}/100`);
  console.log(`   Automation Ready: ${pattern.automationReadiness}/100`);
  console.log(`   Readiness Level: ${pattern.readinessLevel}`);
  console.log("");
  console.log(`   💡 Recommendation:`);
  console.log(`      ${pattern.recommendation}`);
  console.log("");

  if (pattern.nextSteps.length > 0) {
    console.log(`   📋 Next Steps:`);
    pattern.nextSteps.forEach((step, i) => {
      console.log(`      ${i + 1}. ${step}`);
    });
  }
  console.log("");
  console.log("   " + "-".repeat(66));
  console.log("");
});

// Summary
console.log("\n" + "=".repeat(70));
console.log("\n📋 Summary\n");

const ready = stablePatterns.filter(p => p.isStable && p.stabilityScore >= 90);
const candidates = stablePatterns.filter(p => p.isStable && p.stabilityScore < 90);

console.log(`✅ Ready for deterministic transformation: ${ready.length}`);
ready.forEach(p => {
  console.log(`   • ${p.mechanic} (score: ${p.stabilityScore})`);
});

console.log(`\n🔶 Candidate patterns (require analysis): ${candidates.length}`);
candidates.forEach(p => {
  console.log(`   • ${p.mechanic} (score: ${p.stabilityScore})`);
});

console.log(`\n📊 Total patterns analyzed: ${stablePatterns.length}`);

// Strategic insight
console.log("\n" + "=".repeat(70));
console.log("\n🎯 Strategic Insight\n");

if (ready.length > 0) {
  console.log(`You have ${ready.length} pattern(s) ready for immediate registration:`);
  ready.forEach(p => {
    console.log(`\n  "${p.mechanic}" pattern:`);
    console.log(`    • Proven in ${p.observationCount} real locations`);
    console.log(`    • Automation safety: ${p.automationReadiness}%`);
    console.log(`    • Impact: Apply to ALL ${p.observationCount} occurrences deterministically`);
    console.log(`    • Economics: Replace manual review with rule-based transformation`);
  });
}

if (candidates.length > 0) {
  console.log(`\n${candidates.length} pattern(s) near ready (score 70-89):`);
  candidates.forEach(p => {
    const gaps = p.nextSteps.slice(0, 2); // Show top 2 gaps
    console.log(`\n  "${p.mechanic}" pattern needs:`);
    gaps.forEach(gap => console.log(`    • ${gap}`));
  });
}

console.log("\n" + "=".repeat(70));
console.log("\n✨ Patterns graduate from \"observations\" to \"deterministic transformation\"");
console.log("   when they have stable shape + clear semantics + proven safety.\n");
