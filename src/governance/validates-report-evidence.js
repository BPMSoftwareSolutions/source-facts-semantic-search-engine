import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function normalizeQueryText(queryText) {
  return queryText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ");
}

function normalizeTableName(tableName) {
  return (tableName || "")
    .trim()
    .replace(/^[^:]+::/, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function getCollectionForTable(tableName, governanceData) {
  const normalized = normalizeTableName(tableName);
  const tableMap = {
    reporttestpostures: governanceData?.testTraceability?.testPostures ?? [],
    reporttestproductionreachability: governanceData?.testTraceability?.productionReachability ?? [],
    reporttestinventory: governanceData?.testTraceability?.inventory ?? [],
    reporttestsummarystack: governanceData?.testTraceability?.summary ?? [],
    reporttestscenariolineage: governanceData?.testTraceability?.scenariolineage ?? [],
    reportscenarioproofcoverage: governanceData?.testTraceability?.scenarioProofCoverage ?? [],
    reporttestoriginatingclifeatures: governanceData?.testTraceability?.originatingCliFeatures ?? [],
    reporttestwithoutcanonicallineage: governanceData?.testTraceability?.withoutCanonicalLineage ?? [],
    reporttestremovalimpact: governanceData?.testTraceability?.removalImpact ?? [],
    reporttestclicoverage: governanceData?.testTraceability?.testCliCoverage ?? [],
    reportmechanicoccurrences: governanceData?.occurrences ?? [],
    reportoccurrenceevidence: governanceData?.occurrences ?? [],
    reportfeaturecoveragesummary: governanceData?.featureCoverage?.summary ?? [],
    reportscenarioconformancesummary: governanceData?.scenarioConformance?.summary ?? [],
    reportcanonicalfeatures: governanceData?.featureCoverage?.entityCoverage ?? [],
    reportcanonicalscenarios: governanceData?.featureCoverage?.entityCoverage ?? [],
  };

  if (!Object.prototype.hasOwnProperty.call(tableMap, normalized)) {
    throw new Error(`Unknown governance table '${tableName}'; no fabricated results will be returned.`);
  }

  return tableMap[normalized];
}

function extractWhereClause(sql) {
  const whereMatch = sql.match(/where\s+(.+?)(?=\s+group\s+by|\s+order\s+by|$)/i);
  return whereMatch ? whereMatch[1].trim() : "";
}

function extractGroupByClause(sql) {
  const groupMatch = sql.match(/group\s+by\s+([a-z0-9_]+)/i);
  return groupMatch ? groupMatch[1].trim() : null;
}

function extractOrderByClause(sql) {
  const orderMatch = sql.match(/order\s+by\s+([a-z0-9_]+)/i);
  return orderMatch ? orderMatch[1].trim() : null;
}

function extractTableName(sql) {
  const match = sql.match(/from\s+([a-z0-9_.:-]+)/i);
  return match ? match[1].trim() : "";
}

function parseConditions(whereClause) {
  if (!whereClause) return [];
  return whereClause
    .split(/\s+and\s+/i)
    .map((condition) => condition.trim())
    .filter(Boolean);
}

function evaluateCondition(row, condition) {
  const eqMatch = condition.match(/([a-z0-9_]+)\s*=\s*'([^']*)'/i);
  if (eqMatch) {
    const [, field, expected] = eqMatch;
    return String(row[field] ?? "") === expected;
  }

  const inMatch = condition.match(/([a-z0-9_]+)\s+in\s*\(([^)]*)\)/i);
  if (inMatch) {
    const [, field, valuesText] = inMatch;
    const values = valuesText
      .split(",")
      .map((value) => value.trim().replace(/^'|'$/g, ""));
    return values.includes(String(row[field] ?? ""));
  }

  const likeMatch = condition.match(/([a-z0-9_]+)\s+like\s*'([^']*)'/i);
  if (likeMatch) {
    const [, field, pattern] = likeMatch;
    const value = String(row[field] ?? "");
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/%/g, ".*")
      .replace(/_/g, ".");
    return new RegExp(`^${escaped}$`, "i").test(value);
  }

  return true;
}

function applyWhere(rows, whereClause) {
  if (!whereClause) return rows;
  const conditions = parseConditions(whereClause);
  return rows.filter((row) => conditions.every((condition) => evaluateCondition(row, condition)));
}

function applyGroupBy(rows, groupBy, sql) {
  if (!groupBy) return rows;
  const groups = new Map();
  for (const row of rows) {
    const key = row[groupBy];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  return Array.from(groups.entries()).map(([groupValue, groupRows]) => {
    const row = { [groupBy]: groupValue };

    if (sql.includes("count(distinct") || sql.includes("count(distinct")) {
      const distinctMatch = sql.match(/count\(distinct\s+([a-z0-9_]+)\)/i);
      if (distinctMatch) {
        const [, field] = distinctMatch;
        row["test_count"] = new Set(groupRows.map((entry) => entry[field])).size;
      }
    }

    if (sql.includes("count(*)")) {
      row["occurrences"] = groupRows.length;
    }

    if (sql.includes("sum(")) {
      const sumMatch = sql.match(/sum\(([a-z0-9_]+)\)/i);
      if (sumMatch) {
        const [, field] = sumMatch;
        row["callables"] = groupRows.reduce((total, entry) => total + Number(entry[field] ?? 0), 0);
      }
    }

    if (sql.includes("count(*) as test_count") || sql.includes("count(*) as total_test_runs")) {
      row["test_count"] = groupRows.length;
    }

    return row;
  });
}

function applyOrderBy(rows, orderBy) {
  if (!orderBy) return rows;
  return rows.slice().sort((left, right) => {
    const leftValue = left[orderBy];
    const rightValue = right[orderBy];
    if (leftValue === rightValue) return 0;
    return leftValue > rightValue ? 1 : -1;
  });
}

/**
 * Validates report evidence by:
 * 1. Extracting queries from report markdown
 * 2. Running queries against governance artifacts
 * 3. Computing content hashes
 * 4. Verifying hashes match report declarations
 * 5. Checking if table data matches query results
 */
export function validatesReportEvidence(reportPath, governanceArtifactPath) {
  if (!reportPath || !governanceArtifactPath) {
    return {
      valid: false,
      errors: ["Missing reportPath or governanceArtifactPath"],
      sections: [],
    };
  }

  const reportContent = readFileSync(reportPath, "utf-8");
  const governanceData = JSON.parse(
    readFileSync(governanceArtifactPath, "utf-8")
  );

  const results = {
    reportPath: reportPath,
    governanceArtifact: governanceArtifactPath,
    validatedAt: new Date().toISOString(),
    sections: [],
    errors: [],
  };

  const sectionPattern = /\*\*Content Hash:\*\*\s*`([a-f0-9]{60,66})`/g;
  let match;
  let sectionCount = 0;

  while ((match = sectionPattern.exec(reportContent)) !== null) {
    sectionCount++;
    const declaredHash = match[1].trim();
    const queryText = extractMatchingQuery(reportContent, match.index);

    const sectionResult = validatesSectionEvidence(
      queryText,
      declaredHash,
      governanceData
    );

    results.sections.push({
      sectionNumber: sectionCount,
      query: queryText.substring(0, 120),
      declaredHash: declaredHash.substring(0, 12),
      fullHash: declaredHash,
      ...sectionResult,
    });

    if (!sectionResult.valid) {
      results.errors.push(
        `Section ${sectionCount}: Hash mismatch or query failed`
      );
    }
  }

  results.valid =
    results.errors.length === 0 && results.sections.every((s) => s.valid);
  results.sectionsValidated = sectionCount;
  results.sectionsValid = results.sections.filter((s) => s.valid).length;

  return results;
}

/**
 * Validate a single section's evidence
 */
export function validatesSectionEvidence(
  queryText,
  declaredHash,
  governanceData
) {
  try {
    const results = parseAndExecuteQuery(queryText, governanceData);

    if (!results) {
      return {
        valid: false,
        error: "Query returned no results",
        queryExecuted: false,
      };
    }

    const normalizedQuery = normalizeQueryText(queryText);
    const resultJson = JSON.stringify(results, null, 0);
    const combinedContent = `${normalizedQuery}\n---\n${resultJson}`;

    const computedHash = crypto
      .createHash("sha256")
      .update(combinedContent)
      .digest("hex");

    const hashMatches = computedHash === declaredHash;

    return {
      valid: hashMatches,
      queryExecuted: true,
      resultRowCount: Array.isArray(results) ? results.length : 1,
      declaredHashPrefix: declaredHash.substring(0, 12),
      computedHashPrefix: computedHash.substring(0, 12),
      hashMatches: hashMatches,
      computedHash: computedHash,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message,
      queryExecuted: false,
    };
  }
}

/**
 * Very basic SQL parser for governance queries
 * Supports SELECT from reportTestPostures and similar
 */
export function parseAndExecuteQuery(sql, governanceData) {
  const normalizedSql = normalizeQueryText(sql).replace(/\s+/g, " ").trim();
  const lowerSql = normalizedSql.toLowerCase();

  if (!normalizedSql) {
    return [];
  }

  if (!governanceData || Object.keys(governanceData).length === 0) {
    throw new Error("No governance artifact data was provided; refusing to fabricate query results.");
  }

  const tableName = extractTableName(normalizedSql);
  const rows = getCollectionForTable(tableName, governanceData);
  const whereClause = extractWhereClause(normalizedSql);
  const filteredRows = applyWhere(rows, whereClause);

  if (lowerSql.includes("count(*)") || lowerSql.includes("count ( *)")) {
    return [{ count: filteredRows.length }];
  }

  if (lowerSql.includes("group by")) {
    return applyGroupBy(filteredRows, extractGroupByClause(normalizedSql), normalizedSql);
  }

  if (lowerSql.includes("select * from")) {
    return filteredRows;
  }

  if (lowerSql.includes("sum(") || lowerSql.includes("count(distinct")) {
    const row = {};
    if (lowerSql.includes("count(distinct")) {
      const distinctMatch = normalizedSql.match(/count\(distinct\s+([a-z0-9_]+)\)/i);
      if (distinctMatch) {
        row["count"] = new Set(filteredRows.map((entry) => entry[distinctMatch[1]])).size;
      }
    }
    if (lowerSql.includes("sum(")) {
      const sumMatch = normalizedSql.match(/sum\(([a-z0-9_]+)\)/i);
      if (sumMatch) {
        row["sum"] = filteredRows.reduce((total, entry) => total + Number(entry[sumMatch[1]] ?? 0), 0);
      }
    }
    return [row];
  }

  return filteredRows;
}

function extractMatchingQuery(reportContent, hashIndex) {
  const beforeHash = reportContent.slice(0, hashIndex);
  const match = beforeHash.match(/```sql\s*([\s\S]*?)```/g);

  if (!match || match.length === 0) {
    return "";
  }

  const lastSqlBlock = match[match.length - 1];
  return lastSqlBlock
    .replace(/^```sql\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

/**
 * Generate validation report
 */
export function generatesValidationReport(validationResults) {
  return `
# Report Evidence Validation

**Validated:** ${validationResults.validatedAt}
**Report:** ${validationResults.reportPath}
**Governance Artifact:** ${validationResults.governanceArtifact}

## Summary

- **Sections Validated:** ${validationResults.sectionsValidated}
- **Sections Valid:** ${validationResults.sectionsValid}
- **Overall Status:** ${validationResults.valid ? "✅ PASS" : "❌ FAIL"}
- **Errors:** ${validationResults.errors.length}

## Section Details

${validationResults.sections
  .map(
    (section, i) => `
### Section ${section.sectionNumber}

- **Query:** \`${section.query}...\`
- **Declared Hash:** \`${section.declaredHash}\`
- **Status:** ${section.valid ? "✅ VALID" : "❌ INVALID"}
- **Rows:** ${section.resultRowCount || "N/A"}
- **Query Executed:** ${section.queryExecuted ? "Yes" : "No"}
${section.hashMatches !== undefined ? `- **Hash Match:** ${section.hashMatches ? "Yes" : "No"}` : ""}
${section.error ? `- **Error:** ${section.error}` : ""}
`
  )
  .join("\n")}

## Verification

${validationResults.valid ? "✅ All sections validated successfully. Report evidence ties out." : "❌ Some sections failed validation. Review errors above."}

---

**To regenerate this validation:**
\`\`\`bash
node -e "
import { validatesReportEvidence, generatesValidationReport } from './src/governance/validates-report-evidence.js';
const results = validatesReportEvidence(
  '${validationResults.reportPath}',
  '${validationResults.governanceArtifact}'
);
console.log(generatesValidationReport(results));
"
\`\`\`
`;
}

/**
 * Export validation results as JSON
 */
export function exportsValidationJSON(validationResults) {
  return {
    documentKind: "report-evidence-validation.v1",
    timestamp: validationResults.validatedAt,
    report: validationResults.reportPath,
    artifact: validationResults.governanceArtifact,
    summary: {
      totalSections: validationResults.sectionsValidated,
      validSections: validationResults.sectionsValid,
      overallValid: validationResults.valid,
      errorCount: validationResults.errors.length,
    },
    sections: validationResults.sections,
    errors: validationResults.errors,
  };
}
