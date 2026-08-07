#!/usr/bin/env node
/**
 * Export mechanic observations from project index to JSON
 *
 * This creates a data file that can be analyzed for stable patterns
 */

import { projectSourceFactsWorkspace } from "../src/project.js";
import fs from "node:fs";
import path from "node:path";

async function exportMechanicsObservations() {
  console.log("📊 Exporting mechanic observations from project index...\n");

  try {
    const index = await projectSourceFactsWorkspace(process.cwd());

    if (!index.bodyMechanics || index.bodyMechanics.length === 0) {
      console.warn("⚠️  No body mechanics found in project index.");
      console.warn("Try running: npm run project");
      process.exit(0);
    }

    // Extract observations
    const sourceRefMap = new Map(
      (index.sourceReferences || []).map(ref => [ref.referenceId, ref])
    );

    const observations = (index.bodyMechanics || [])
      .map(mechanic => {
        const sourceRef = sourceRefMap.get(mechanic.sourceReferenceId);
        return {
          occurrenceId: mechanic.bodyMechanicId || mechanic.mechanicId,
          mechanic: mechanic.mechanic,
          modulePath: mechanic.modulePath,
          startLine: sourceRef?.startLine ?? null,
          endLine: sourceRef?.endLine ?? null,
          sourceReferenceId: mechanic.sourceReferenceId,
          fromSymbolId: mechanic.fromSymbolId || null,
        };
      })
      .filter(o => o.mechanic && o.modulePath); // Only valid observations

    // Group by mechanic for summary
    const byMechanic = new Map();
    observations.forEach(o => {
      if (!byMechanic.has(o.mechanic)) {
        byMechanic.set(o.mechanic, []);
      }
      byMechanic.get(o.mechanic).push(o);
    });

    // Write output file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = `observations-${timestamp}.json`;

    fs.writeFileSync(outputPath, JSON.stringify({
      exportDate: new Date().toISOString(),
      projectRoot: process.cwd(),
      indexId: index.indexId,
      scanId: index.manifest?.scanId,
      totalObservations: observations.length,
      mechanicSummary: Object.fromEntries(
        Array.from(byMechanic.entries()).map(([mechanic, obs]) => [
          mechanic,
          { count: obs.length, files: new Set(obs.map(o => o.modulePath)).size }
        ])
      ),
      observations,
    }, null, 2));

    console.log(`✅ Exported ${observations.length} observations\n`);
    console.log(`📋 Summary by mechanic:`);
    for (const [mechanic, obs] of byMechanic) {
      const files = new Set(obs.map(o => o.modulePath)).size;
      console.log(`   • ${mechanic.padEnd(15)} ${obs.length.toString().padStart(3)} occurrences, ${files} files`);
    }

    console.log(`\n📄 Saved to: ${outputPath}\n`);
    console.log(`Use for pattern analysis:`);
    console.log(`   npm run detect-stable-patterns ${outputPath}\n`);

  } catch (error) {
    console.error("❌ Error exporting observations:", error.message);
    process.exit(1);
  }
}

exportMechanicsObservations();
