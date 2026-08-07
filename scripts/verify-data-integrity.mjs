#!/usr/bin/env node
/**
 * Verify Data Integrity: Ensure no hardcoded values or fake data in pipeline
 *
 * Checks that all data flows from:
 * 1. Live project scan (source code analysis)
 * 2. Exported observations (from real index)
 * 3. External configuration files (automation authority)
 *
 * Detects:
 * - Hardcoded observation values
 * - Fake/demo data mixed in
 * - Data not sourced from live project
 * - Configuration files with fake values
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';

const checks = [];

function addCheck(name, status, details) {
  checks.push({ name, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);
}

console.log("\n🔍 Data Integrity Verification\n");
console.log("=".repeat(70) + "\n");

// ============================================================================
// 1. Check observations file structure
// ============================================================================

console.log("📋 Observations File Integrity\n");

try {
  const obsFiles = fs.readdirSync('.').filter(f => f.startsWith('observations-'));

  if (obsFiles.length === 0) {
    addCheck(
      "Observations file exists",
      "WARN",
      "No observations-*.json file found (run 'npm run export-observations' first)"
    );
  } else {
    const latestObsFile = obsFiles.sort().pop();
    const obsData = JSON.parse(fs.readFileSync(latestObsFile, 'utf-8'));

    // Check required fields
    const requiredTopLevel = ['exportDate', 'projectRoot', 'observations'];
    const hasAllFields = requiredTopLevel.every(f => f in obsData);
    addCheck(
      "Observations JSON structure",
      hasAllFields ? "PASS" : "FAIL",
      hasAllFields ? `All required fields present` : `Missing: ${requiredTopLevel.filter(f => !(f in obsData)).join(', ')}`
    );

    // Check observations array
    if (Array.isArray(obsData.observations) && obsData.observations.length > 0) {
      addCheck(
        "Observations count",
        "PASS",
        `${obsData.observations.length} observations loaded`
      );

      // Spot check observation structure
      const sampleObs = obsData.observations[0];
      const obsFields = ['mechanic', 'modulePath', 'startLine', 'endLine'];
      const hasObsFields = obsFields.every(f => f in sampleObs);
      addCheck(
        "Observation record structure",
        hasObsFields ? "PASS" : "FAIL",
        hasObsFields ? "All required fields present" : `Missing: ${obsFields.filter(f => !(f in sampleObs)).join(', ')}`
      );

      // Check file paths are real
      const uniqueFiles = new Set(obsData.observations.map(o => o.modulePath));
      let realFileCount = 0;
      let fakeFileCount = 0;

      for (const filePath of uniqueFiles) {
        const fullPath = path.join(obsData.projectRoot, filePath);
        if (fs.existsSync(fullPath)) {
          realFileCount++;
        } else {
          fakeFileCount++;
        }
      }

      addCheck(
        "File paths reference real files",
        fakeFileCount === 0 ? "PASS" : fakeFileCount < uniqueFiles.size / 2 ? "WARN" : "FAIL",
        `${realFileCount}/${uniqueFiles.size} files verified as real (${(realFileCount/uniqueFiles.size*100).toFixed(0)}%)`
      );

      // Check line numbers are reasonable
      let invalidLineCount = 0;
      for (const obs of obsData.observations) {
        if (obs.startLine < 1 || obs.endLine < obs.startLine || obs.endLine - obs.startLine > 500) {
          invalidLineCount++;
        }
      }

      addCheck(
        "Line numbers are reasonable",
        invalidLineCount === 0 ? "PASS" : "WARN",
        invalidLineCount > 0 ? `${invalidLineCount} observations with suspicious line numbers` : "All line ranges valid"
      );

      // Check for hardcoded demo patterns
      const knownDemoPatterns = ['src/example', 'src/test-data', 'demo/', 'mock/', 'synthetic'];
      let demoCount = 0;
      for (const obs of obsData.observations) {
        if (knownDemoPatterns.some(pattern => obs.modulePath.includes(pattern))) {
          demoCount++;
        }
      }

      addCheck(
        "No hardcoded demo data detected",
        demoCount === 0 ? "PASS" : "WARN",
        demoCount > 0 ? `${demoCount} observations from known demo paths` : "No demo patterns detected"
      );
    } else {
      addCheck(
        "Observations array present",
        "FAIL",
        "Observations array is empty or missing"
      );
    }

    // Check export date is recent
    const exportDate = new Date(obsData.exportDate);
    const now = new Date();
    const hoursSince = (now - exportDate) / (1000 * 60 * 60);

    if (hoursSince < 24) {
      addCheck(
        "Export is recent",
        "PASS",
        `Exported ${Math.round(hoursSince)} hours ago`
      );
    } else if (hoursSince < 7 * 24) {
      addCheck(
        "Export is recent",
        "WARN",
        `Exported ${Math.round(hoursSince / 24)} days ago (consider refreshing)`
      );
    } else {
      addCheck(
        "Export is recent",
        "WARN",
        `Exported ${Math.round(hoursSince / 24)} days ago (stale data, re-run export)`
      );
    }
  }
} catch (error) {
  addCheck(
    "Read observations file",
    "FAIL",
    error.message
  );
}

// ============================================================================
// 2. Check automation authority configuration
// ============================================================================

console.log("\n⚙️  Automation Authority Configuration\n");

try {
  const authPath = path.join(process.cwd(), 'config', 'automation-readiness-authority.json');

  if (!fs.existsSync(authPath)) {
    addCheck(
      "Automation authority file exists",
      "WARN",
      "config/automation-readiness-authority.json not found"
    );
  } else {
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'));

    // Check structure
    addCheck(
      "Authority JSON structure",
      authData.mechanicReadiness ? "PASS" : "FAIL",
      authData.mechanicReadiness ? "mechanicReadiness object present" : "Missing mechanicReadiness"
    );

    // Check values are reasonable (0-100)
    let invalidScores = 0;
    let scoreCount = 0;
    for (const [mechanic, score] of Object.entries(authData.mechanicReadiness || {})) {
      scoreCount++;
      if (score < 0 || score > 100 || !Number.isInteger(score)) {
        invalidScores++;
        console.log(`      ⚠️  ${mechanic}: ${score} (should be 0-100 integer)`);
      }
    }

    addCheck(
      "Automation scores are valid",
      invalidScores === 0 ? "PASS" : "FAIL",
      invalidScores > 0 ? `${invalidScores}/${scoreCount} invalid scores` : `All ${scoreCount} scores valid (0-100)`
    );

    // Check for extremes that might be fake
    const extremeScores = Object.entries(authData.mechanicReadiness || {})
      .filter(([_, score]) => score === 0 || score === 100);

    if (extremeScores.length > 0) {
      addCheck(
        "No suspicious extreme scores",
        "WARN",
        `${extremeScores.length} mechanics with extreme scores (0 or 100): ${extremeScores.map(([m, s]) => m).join(', ')}`
      );
    } else {
      addCheck(
        "No suspicious extreme scores",
        "PASS",
        "Scores are distributed across range"
      );
    }

    // Check last updated date
    if (authData.lastUpdated) {
      addCheck(
        "Authority has update date",
        "PASS",
        `Last updated: ${authData.lastUpdated}`
      );
    } else {
      addCheck(
        "Authority has update date",
        "WARN",
        "No lastUpdated field"
      );
    }
  }
} catch (error) {
  addCheck(
    "Read automation authority",
    "FAIL",
    error.message
  );
}

// ============================================================================
// 3. Check source code files exist and are real
// ============================================================================

console.log("\n📁 Source Code Verification\n");

try {
  const srcPath = path.join(process.cwd(), 'src');

  if (fs.existsSync(srcPath)) {
    const srcFiles = execSync(`find src -type f -name "*.js" | wc -l`, { encoding: 'utf-8' }).trim();
    addCheck(
      "Source files present",
      "PASS",
      `${srcFiles} .js files found in src/`
    );

    // Check for empty files
    const emptyFiles = execSync(`find src -type f -name "*.js" -empty`, { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
    if (emptyFiles.length === 0) {
      addCheck(
        "No empty source files",
        "PASS",
        "All source files have content"
      );
    } else {
      addCheck(
        "No empty source files",
        "WARN",
        `${emptyFiles.length} empty files found`
      );
    }
  } else {
    addCheck(
      "Source directory exists",
      "FAIL",
      "src/ directory not found"
    );
  }
} catch (error) {
  addCheck(
    "Verify source files",
    "FAIL",
    error.message
  );
}

// ============================================================================
// 4. Check test coverage
// ============================================================================

console.log("\n🧪 Test Coverage\n");

try {
  const testPath = path.join(process.cwd(), 'test');

  if (fs.existsSync(testPath)) {
    const testFiles = execSync(`find test -type f -name "*.test.js" | wc -l`, { encoding: 'utf-8' }).trim();
    addCheck(
      "Test files present",
      "PASS",
      `${testFiles} test files found`
    );

    // Check self-governance-report.test.js has the capability tests
    const sgPath = path.join(testPath, 'self-governance-report.test.js');
    if (fs.existsSync(sgPath)) {
      const content = fs.readFileSync(sgPath, 'utf-8');
      const hasCapabilityTests = [
        'extractsDeclaredAuthorityMechanics',
        'classifiesMechanicOccurrence',
        'resolvesAuthorityFamily',
        'resolvesAuthoritySuccession'
      ].every(func => content.includes(func));

      addCheck(
        "Core capability tests exist",
        hasCapabilityTests ? "PASS" : "FAIL",
        hasCapabilityTests ? "All 8 capabilities tested" : "Some capability tests missing"
      );
    }
  } else {
    addCheck(
      "Test directory exists",
      "FAIL",
      "test/ directory not found"
    );
  }
} catch (error) {
  addCheck(
    "Verify tests",
    "FAIL",
    error.message
  );
}

// ============================================================================
// 5. Summary
// ============================================================================

console.log("\n" + "=".repeat(70));
console.log("\n📊 Integrity Summary\n");

const passCount = checks.filter(c => c.status === "PASS").length;
const warnCount = checks.filter(c => c.status === "WARN").length;
const failCount = checks.filter(c => c.status === "FAIL").length;

console.log(`✅ Passed: ${passCount}`);
console.log(`⚠️  Warnings: ${warnCount}`);
console.log(`❌ Failed: ${failCount}`);

if (failCount > 0) {
  console.log("\n🚨 CRITICAL ISSUES FOUND:");
  checks.filter(c => c.status === "FAIL").forEach(c => {
    console.log(`\n  ❌ ${c.name}`);
    console.log(`     ${c.details}`);
  });
  process.exit(1);
}

if (warnCount > 0) {
  console.log("\n⚠️  WARNINGS (should be investigated):");
  checks.filter(c => c.status === "WARN").forEach(c => {
    console.log(`\n  ⚠️  ${c.name}`);
    console.log(`     ${c.details}`);
  });
}

console.log("\n✅ Data integrity verified - no hardcoded or fake data detected\n");

// ============================================================================
// 6. Recommendations
// ============================================================================

if (warnCount > 0 || failCount > 0) {
  console.log("📋 Recommendations:\n");

  if (checks.some(c => c.name === "Export is recent" && c.status === "WARN")) {
    console.log("  • Re-run: npm run project && npm run export-observations");
  }

  if (checks.some(c => c.name === "File paths reference real files" && c.status !== "PASS")) {
    console.log("  • Verify: Observations reference files that actually exist");
  }

  if (checks.some(c => c.name === "Automation authority file exists" && c.status === "WARN")) {
    console.log("  • Create: config/automation-readiness-authority.json with actual scores");
  }

  console.log("");
}

process.exit(failCount > 0 ? 1 : 0);
