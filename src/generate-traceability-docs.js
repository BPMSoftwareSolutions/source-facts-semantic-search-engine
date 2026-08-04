import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { validatesSelfGovernanceReport } from "./governance/validates-self-governance-report.js";
import { validatesSourceFactIndex } from "./validate-index.js";
import { executeRelationalQuery } from "./query.js";
import {
  validatesTraceabilityMetricCatalog,
  validatesTraceabilityQueryReceipts,
  validatesTraceabilityClosureReceiptIntegrity,
} from "./validates-traceability-artifacts.js";

const sectionHeadings = Object.freeze({
  "entry-point-reachability": "1. Entry Point Reachability (Call Graph)",
  "symbol-inventory": "2. Symbol Inventory (Source Index)",
  "feature-coverage": "3. Feature Coverage (Governance Report)",
  "mechanic-evidence": "4. Evidence Lineage (Mechanics and Clusters)",
  "authority-document-status": "5. Authority Document Status",
  "derived-rates": "6. Completeness Dimensions (Round 1 Baseline)",
  "findings": "7. Lineage Quality Findings",
  "evaluation-limits": "8. Evaluation Limits (Structural Blockers)",
});
const sectionOrder = Object.keys(sectionHeadings);

export async function generatesTraceabilityDocs(
  reportPath,
  graphPath,
  indexPath,
  outputPath,
  {
    metricCatalogPath = path.resolve(process.cwd(), "contracts", "traceability-metric-catalog.json"),
    queryReceiptPath = null,
    closureReceiptPath = null,
  } = {},
) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  if (typeof queryReceiptPath !== "string" || queryReceiptPath.length === 0) {
    throw new Error("QUERY_RECEIPT_MISSING: query receipts path is required for traceability generation.");
  }
  const queryReceipts = JSON.parse(readFileSync(queryReceiptPath, "utf8"));
  const metricCatalog = JSON.parse(readFileSync(metricCatalogPath, "utf8"));

  await validatesSelfGovernanceReport(report);
  await validatesSourceFactIndex(index);
  await validatesTraceabilityMetricCatalog(metricCatalog);
  await validatesTraceabilityQueryReceipts(queryReceipts);

  const {
    reportBinding,
    indexBinding,
    graphBinding,
  } = validateArtifactCompatibility(report, graph, index);

  const artifactByKind = Object.freeze({
    "source-fact-index": index,
    "governance-report": report,
    "call-graph": graph,
    derived: Object.freeze({}),
  });
  const queryIndexByArtifactKind = Object.freeze({
    "source-fact-index": index,
    "governance-report": buildsArtifactQueryIndex("governance-report", report),
    "call-graph": buildsArtifactQueryIndex("call-graph", graph),
  });
  const queryReceiptById = normalizesQueryReceipts(queryReceipts);
  const metricById = new Map();
  for (const metric of metricCatalog.metrics) {
    if (metricById.has(metric.metricId)) {
      throw new Error(`DUPLICATE_METRIC_ID: ${metric.metricId} appears multiple times.`);
    }
    metricById.set(metric.metricId, metric);
  }
  const resolved = new Map();
  const catalogBinding = {
    catalogType: metricCatalog.catalogType ?? null,
    catalogVersion: metricCatalog.catalogVersion ?? null,
    catalogFingerprint: buildsCatalogFingerprint(metricCatalog),
    catalogSchemaVersion: metricCatalog.schemaVersion ?? null,
    catalogContentHash: hashArtifact(metricCatalog),
  };
  const orderedMetricValues = [];

  for (const metric of metricCatalog.metrics) {
    if (resolved.has(metric.metricId)) continue;
    orderedMetricValues.push({
      ...(await resolveMetric(
        metric.metricId,
        metricById,
        artifactByKind,
        queryReceiptById,
        {
          reportBinding,
          indexBinding,
          graphBinding,
          catalogBinding,
          queryIndexByArtifactKind,
        },
        resolved,
        new Set(),
      )),
      source: metric.source,
      resultType: metric.resultType,
      section: metric.section,
      query: metric.query ?? null,
    });
  }

  const sections = sectionsFromMetrics(orderedMetricValues);
  const markdown = buildsTraceabilityMarkdown({
    reportBinding,
    indexBinding,
    graphBinding,
    sections,
    resolved,
  });

  let closureReceipt = null;
  if (closureReceiptPath !== null) {
    const artifactHash = hashText(markdown);
    const closureConditions = evaluatesDocumentationClosure({
      metricCatalog,
      queryReceiptById,
      metricValues: orderedMetricValues,
      documentHash: artifactHash,
    });
    closureReceipt = buildsClosureReceipt({
      reportBinding,
      indexBinding,
      graphBinding,
      catalogBinding,
      queryReceiptById,
      queryReceipts,
      metricValues: orderedMetricValues,
      documentPath: outputPath,
      documentHash: artifactHash,
      closureConditions,
    });
    await validatesTraceabilityClosureReceiptIntegrity(closureReceipt);
    if (closureReceipt.disposition !== "CLOSED") {
      throw new Error(`DOCUMENTATION_CLOSURE_FAILED: ${closureReceipt.failedConditions.join(", ")}.`);
    }
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, markdown, "utf8");
  if (closureReceiptPath !== null) {
    mkdirSync(path.dirname(closureReceiptPath), { recursive: true });
    writeFileSync(closureReceiptPath, `${JSON.stringify(closureReceipt, null, 2)}\n`, "utf8");
  }

  return outputPath;
}

function validateArtifactCompatibility(report, graph, index) {
  const reportIndexId = readRequiredString(report, "/index/indexId", "Report indexId");
  const reportScanId = readRequiredString(report, "/index/scanId", "Report scanId");
  const sourceIndexId = readRequiredString(index, "/indexId", "Source indexId");
  const sourceScanId = readRequiredString(index, "/manifest/scanId", "Source scanId");
  const graphIndexId = readRequiredString(graph, "/indexId", "Call-graph indexId");
  const reportRepositoryId = report.repository?.repositoryId ?? report.subject?.repositoryId ?? null;
  const sourceWorkspaceId = index.workspace?.workspaceId ?? null;

  if (sourceIndexId !== reportIndexId || sourceIndexId !== graphIndexId) {
    throw new Error(
      `ARTIFACT_INDEX_MISMATCH: report index ${reportIndexId} and graph index ${graphIndexId} must both match source index ${sourceIndexId}.`,
    );
  }

  if (reportRepositoryId !== null && sourceWorkspaceId !== null && reportRepositoryId !== sourceWorkspaceId) {
    throw new Error(
      `REPORT_SCOPE_MISMATCH: report repository ${reportRepositoryId} is not compatible with source workspace ${sourceWorkspaceId}.`,
    );
  }

  return {
    reportBinding: {
      indexId: reportIndexId,
      scanId: reportScanId,
      repositoryId: reportRepositoryId ?? "unknown",
      reportType: report.reportType ?? null,
      schemaVersion: report.schemaVersion ?? null,
      generatedAtUtc: report.generatedAtUtc ?? null,
      contentHash: hashArtifact(report),
    },
    indexBinding: {
      indexId: sourceIndexId,
      scanId: sourceScanId,
      workspaceId: sourceWorkspaceId ?? "unknown",
      indexType: index.indexType ?? null,
      schemaVersion: index.manifest?.schemaVersion ?? null,
      contentHash: hashArtifact(index),
    },
    graphBinding: {
      indexId: graphIndexId,
      graphType: graph.callGraphType ?? null,
      contentHash: hashArtifact(graph),
    },
  };
}

function sectionsFromMetrics(metrics) {
  const bySection = new Map();
  for (const metric of metrics) {
    const section = metric.section;
    const sectionMetrics = bySection.get(section) ?? [];
    sectionMetrics.push(metric);
    bySection.set(section, sectionMetrics);
  }
  return bySection;
}

function buildsTraceabilityMarkdown({
  reportBinding,
  indexBinding,
  graphBinding,
  sections,
  resolved,
}) {
  const lines = [];
  const formattedSectionIds = new Set();

  lines.push("# Traceability Metrics Report");
  lines.push("");
  lines.push(`**Report Index ID:** \`${reportBinding.indexId}\``);
  lines.push(`**Report Scan ID:** \`${reportBinding.scanId}\``);
  lines.push(`**Call-graph Index ID:** \`${graphBinding.indexId}\``);
  lines.push(`**Source index ID:** \`${indexBinding.indexId}\``);
  lines.push(`**Repository:** ${reportBinding.repositoryId}`);
  lines.push("");

  for (const section of sectionOrder) {
    const rows = sections.get(section);
    if (rows === undefined || rows.length === 0) continue;
    formattedSectionIds.add(section);
    lines.push(`## ${sectionHeadings[section]}`);
    lines.push("");
    lines.push("| Metric | Value |");
    lines.push("|---|---:|");
    for (const row of rows) {
      lines.push(`| ${row.metricId} (${row.section}) | ${formatMetric(row.value, row.resultType, row.disposition)} |`);
    }
    lines.push("");
  }

  const strictTraceability = buildsStrictTraceability(resolved);
  if (strictTraceability !== null) {
    lines.push(`**Strict Traceability Score:** \`${strictTraceability}\``);
    lines.push("");
  }

  lines.push("## Artifact Identity");
  lines.push("");
  lines.push("These values are validated and fail-fast bound to this output.");
  lines.push("");
  lines.push(`- Report index: \`${reportBinding.indexId}\``);
  lines.push(`- Report scan: \`${reportBinding.scanId}\``);
  lines.push(`- Source index: \`${indexBinding.indexId}\``);
  lines.push(`- Source scan: \`${indexBinding.scanId}\``);
  lines.push(`- Call-graph index: \`${graphBinding.indexId}\``);
  lines.push("");

  if (formattedSectionIds.size === 0) {
    lines.push("No metrics were rendered. Check the metric catalog and receipts.");
    lines.push("");
  }

  const unknownSections = [...sections.keys()].filter((section) => !formattedSectionIds.has(section));
  if (unknownSections.length > 0) {
    lines.push("## Cataloged but Unrendered Sections");
    lines.push("");
    lines.push(`- ${unknownSections.join(", ")}`);
    lines.push("");
  }

  return `${lines.join("\n")} \n`;
}

function buildsStrictTraceability(resolved) {
  const relevantMetrics = [
    "traceability.rate.reachability-coverage.v1",
    "traceability.rate.canonical-lineage-coverage.v1",
    "traceability.rate.structural-closure.v1",
    "traceability.rate.runtime-conformance.v1",
  ];
  const values = relevantMetrics
    .map((metricId) => resolved.get(metricId))
    .filter((row) => row !== undefined && typeof row.value === "number" && Number.isFinite(row.value));
  if (values.length === 0) return null;
  const minimum = values.reduce((min, row) => Math.min(min, row.value), 100);
  return `${minimum.toFixed(1)}%`;
}

function formatMetric(value, resultType, disposition) {
  if (!Number.isFinite(value)) return "unknown";
  if (resultType === "percentage") return `${value.toFixed(1)}%`;
  if (disposition === "ZERO_DENOMINATOR") return `0.0%`;
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed ? value.toFixed(1) : value));
}

async function resolveMetric(metricId, metricById, artifactByKind, queryReceiptById, context, resolved, seenIds) {
  const metric = metricById.get(metricId);
  if (metric === undefined) {
    throw new Error(`METRIC_POINTER_NOT_FOUND: ${metricId} is referenced but not present in the catalog.`);
  }
  const cached = resolved.get(metricId);
  if (cached !== undefined) return cached;
  if (seenIds.has(metricId)) {
    throw new Error(`METRIC_POINTER_NOT_FOUND: cyclic metric definition detected at ${metricId}.`);
  }
  seenIds.add(metricId);

  let verifiedQuery = null;
  if (metric.query?.queryId !== undefined) {
    const receipt = queryReceiptById.get(metric.query.queryId);
    if (receipt === undefined) {
      throw new Error(`QUERY_RECEIPT_MISSING: ${metric.query.queryId} for ${metricId}.`);
    }
    if (receipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
      throw new Error(`QUERY_RECEIPT_STALE: ${metric.query.queryId} for ${metricId} was ${receipt.disposition}.`);
    }
    verifiedQuery = await validatesQueryReceiptBinding(metric, receipt, context);
  }

  const { source } = metric;
  let value;
  if (source.valueMode === "artifact-pointer") {
    const artifact = artifactByKind[source.artifactKind];
    if (artifact === undefined) throw new Error(`MISSING_ARTIFACT: ${source.artifactKind} artifact not available for ${metricId}.`);
    if (typeof source.pointer !== "string" || source.pointer.length === 0) {
      throw new Error(`METRIC_POINTER_NOT_FOUND: metric ${metricId} missing source pointer.`);
    }
    const found = readsJsonPointer(artifact, source.pointer);
    if (found === undefined) throw new Error(`METRIC_POINTER_NOT_FOUND: ${source.pointer} for ${metricId}.`);
    value = readNumberValue(found, metricId);
  } else if (source.valueMode === "symbol-count") {
    if (source.artifactKind !== "source-fact-index") {
      throw new Error(`MISSING_ARTIFACT: symbol-count requires source-fact-index for ${metricId}.`);
    }
    if (typeof source.symbolKind !== "string" || source.symbolKind.length === 0) {
      throw new Error(`METRIC_POINTER_NOT_FOUND: missing symbol kind for ${metricId}.`);
    }
    value = countSymbolsByKind(artifactByKind["source-fact-index"], source.symbolKind);
  } else if (source.valueMode === "sum-symbol-counts") {
    if (source.artifactKind !== "source-fact-index") {
      throw new Error(`MISSING_ARTIFACT: sum-symbol-counts requires source-fact-index for ${metricId}.`);
    }
    if (!Array.isArray(source.symbolKinds) || source.symbolKinds.length === 0) {
      throw new Error(`METRIC_POINTER_NOT_FOUND: missing symbol kinds for ${metricId}.`);
    }
    value = source.symbolKinds.reduce((total, symbolKind) => total + countSymbolsByKind(artifactByKind["source-fact-index"], symbolKind), 0);
  } else if (source.valueMode === "sum-metrics") {
    if (!Array.isArray(source.addendMetricIds) || source.addendMetricIds.length === 0) {
      throw new Error(`METRIC_POINTER_NOT_FOUND: missing addend metric ids for ${metricId}.`);
    }
    value = 0;
    for (const addendMetricId of source.addendMetricIds) {
      const addend = await resolveMetric(
        addendMetricId,
        metricById,
        artifactByKind,
        queryReceiptById,
        context,
        resolved,
        seenIds,
      );
      value += addend.value;
    }
  } else if (source.valueMode === "ratio") {
    const numeratorMetric = await resolveMetric(
      source.numeratorMetricId,
      metricById,
      artifactByKind,
      queryReceiptById,
      context,
      resolved,
      seenIds,
    );
    const denominatorMetric = await resolveMetric(
      source.denominatorMetricId,
      metricById,
      artifactByKind,
      queryReceiptById,
      context,
      resolved,
      seenIds,
    );
    if (numeratorMetric === undefined || denominatorMetric === undefined) {
      throw new Error(`METRIC_POINTER_NOT_FOUND: ratio metric references missing components for ${metricId}.`);
    }
    if (numeratorMetric.value === 0 || denominatorMetric.value === 0) {
      value = 0;
    } else if (metric.resultType === "percentage") {
      value = (numeratorMetric.value / denominatorMetric.value) * 100;
    } else {
      value = numeratorMetric.value / denominatorMetric.value;
    }
  } else {
    throw new Error(`METRIC_POINTER_NOT_FOUND: unsupported value mode ${source.valueMode} for ${metricId}.`);
  }

  const resolvedValue = readNumberValue(value, metricId);
  if (verifiedQuery !== null) {
    const queriedValue = readsSingleMetricQueryValue(metric, verifiedQuery);
    if (queriedValue !== resolvedValue) {
      throw new Error(`QUERY_RESULT_METRIC_MISMATCH: ${metricId} query returned ${String(queriedValue)} but the resolved metric value is ${String(resolvedValue)}.`);
    }
  }
  const resolvedResult = Object.freeze({
    metricId,
    section: metric.section,
    source,
    value: resolvedValue,
    resultType: metric.resultType,
    query: metric.query ?? null,
    queryVerified: verifiedQuery !== null,
    disposition: metric.disposition ?? "DERIVATION_COMPLETED",
  });
  resolved.set(metricId, resolvedResult);
  return resolvedResult;
}

function countSymbolsByKind(index, symbolKind) {
  const symbols = Array.isArray(index.symbols) ? index.symbols : [];
  let count = 0;
  for (const symbol of symbols) {
    if (symbol?.kind === symbolKind) count += 1;
  }
  return count;
}

export function buildsArtifactQueryIndex(artifactKind, artifact) {
  if (artifactKind === "source-fact-index") return artifact;
  if (artifactKind !== "governance-report" && artifactKind !== "call-graph") {
    throw new Error(`QUERY_ARTIFACT_NOT_QUERYABLE: ${artifactKind}.`);
  }
  const documents = [];
  visitsArtifactValues(artifact, "", (value, pointer) => {
    const valueType = readsArtifactValueType(value);
    const documentFactId = createHash("sha256")
      .update(`${artifactKind}\0${pointer}\0${valueType}`, "utf8")
      .digest("hex");
    documents.push(Object.freeze({
      documentFactId,
      documentFactVersionId: hashText(`${documentFactId}\0${JSON.stringify(value)}`),
      relativePath: `${artifactKind}.json`,
      pointer,
      valueType,
      valuePreview: summarizesArtifactValue(value),
      valuePath: Object.freeze(readsJsonPointerParts(pointer)),
      ...(valueType === "object" || valueType === "array" ? {} : { value }),
      sourceReferenceId: `${artifactKind}:${pointer}`,
    }));
  });
  return Object.freeze({
    symbols: Object.freeze([]),
    relationships: Object.freeze([]),
    dataflows: Object.freeze([]),
    sourceReferences: Object.freeze([]),
    documents: Object.freeze(documents),
    governanceRules: Object.freeze([]),
    bodyMechanics: Object.freeze([]),
  });
}

function visitsArtifactValues(value, pointer, visitor) {
  visitor(value, pointer);
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) {
      visitsArtifactValues(value[index], `${pointer}/${index}`, visitor);
    }
    return;
  }
  for (const key of Object.keys(value).sort()) {
    visitsArtifactValues(value[key], `${pointer}/${escapesJsonPointerPart(key)}`, visitor);
  }
}

function readsArtifactValueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function summarizesArtifactValue(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object") return `{${Object.keys(value).length} properties}`;
  return String(value).slice(0, 240);
}

function readsJsonPointerParts(pointer) {
  if (pointer === "") return [];
  return pointer.slice(1).split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function escapesJsonPointerPart(value) {
  return value.replaceAll("~", "~0").replaceAll("/", "~1");
}

function normalizesQueryReceipts(receipts) {
  const receiptsById = new Map();
  for (const receipt of receipts.queryReceipts ?? []) {
    if (receiptsById.has(receipt.queryId)) {
      throw new Error(`DUPLICATE_QUERY_ID: ${receipt.queryId} appears multiple times.`);
    }
    receiptsById.set(receipt.queryId, receipt);
  }
  return receiptsById;
}

async function validatesQueryReceiptBinding(metric, receipt, {
  reportBinding,
  indexBinding,
  graphBinding,
  catalogBinding,
  queryIndexByArtifactKind,
}) {
  if (receipt.queryText === undefined || receipt.queryText.length === 0) {
    throw new Error(`QUERY_RECEIPT_TEXT_MISSING: ${metric.metricId} has no query text for ${metric.query?.queryId}.`);
  }
  if (typeof metric.query?.queryText !== "string" || metric.query.queryText.length === 0) {
    throw new Error(`CATALOG_QUERY_TEXT_MISSING: ${metric.metricId} has no admitted query text for ${metric.query?.queryId}.`);
  }
  if (metric.query.queryText !== receipt.queryText) {
    throw new Error(`QUERY_RECEIPT_TEXT_MISMATCH: ${metric.metricId} expected ${JSON.stringify(metric.query.queryText)} received ${JSON.stringify(receipt.queryText)}.`);
  }
  if (receipt.queryTextHash !== hashText(receipt.queryText)) {
    throw new Error(`QUERY_RECEIPT_HASH_MISMATCH: ${metric.metricId} has incorrect query text hash for ${metric.query?.queryId}.`);
  }

  if (receipt.catalogBinding === undefined) {
    throw new Error(`QUERY_RECEIPT_CATALOG_BINDING_MISSING: ${metric.metricId} for ${metric.query?.queryId}.`);
  }
  if (receipt.catalogBinding.catalogType !== catalogBinding.catalogType) {
    throw new Error(`QUERY_RECEIPT_CATALOG_BINDING_MISMATCH: ${metric.metricId} catalogType ${receipt.catalogBinding.catalogType} does not match expected ${catalogBinding.catalogType}.`);
  }
  if (receipt.catalogBinding.catalogVersion !== catalogBinding.catalogVersion) {
    throw new Error(`QUERY_RECEIPT_CATALOG_BINDING_MISMATCH: ${metric.metricId} catalogVersion ${receipt.catalogBinding.catalogVersion} does not match expected ${catalogBinding.catalogVersion}.`);
  }
  if (receipt.catalogBinding.catalogFingerprint !== catalogBinding.catalogFingerprint) {
    throw new Error(`QUERY_RECEIPT_CATALOG_BINDING_MISMATCH: ${metric.metricId} catalogFingerprint ${receipt.catalogBinding.catalogFingerprint} does not match expected ${catalogBinding.catalogFingerprint}.`);
  }

  const expectedReceiptBinding = resolvesExpectedReceiptBinding(metric.source.artifactKind, {
    reportBinding,
    indexBinding,
    graphBinding,
  });
  if (receipt.artifactBinding === undefined) {
    throw new Error(`QUERY_RECEIPT_ARTIFACT_BINDING_MISSING: ${metric.metricId} for ${metric.query?.queryId}.`);
  }
  if (receipt.artifactBinding.artifactKind !== expectedReceiptBinding.artifactKind) {
    throw new Error(`QUERY_RECEIPT_ARTIFACT_BINDING_MISMATCH: ${metric.metricId} artifact kind ${receipt.artifactBinding.artifactKind} does not match expected ${expectedReceiptBinding.artifactKind}.`);
  }
  if (receipt.artifactBinding.indexId !== expectedReceiptBinding.indexId) {
    throw new Error(`QUERY_RECEIPT_ARTIFACT_BINDING_MISMATCH: ${metric.metricId} artifact indexId ${receipt.artifactBinding.indexId} does not match expected ${expectedReceiptBinding.indexId}.`);
  }
  if (expectedReceiptBinding.scanId !== null && receipt.artifactBinding.scanId !== expectedReceiptBinding.scanId) {
    throw new Error(`QUERY_RECEIPT_ARTIFACT_BINDING_MISMATCH: ${metric.metricId} artifact scanId ${receipt.artifactBinding.scanId} does not match expected ${expectedReceiptBinding.scanId}.`);
  }
  if (receipt.artifactBinding.artifactContentHash !== expectedReceiptBinding.artifactContentHash) {
    throw new Error(`QUERY_RECEIPT_ARTIFACT_CONTENT_HASH_MISMATCH: ${metric.metricId} artifactContentHash ${receipt.artifactBinding.artifactContentHash} does not match expected ${expectedReceiptBinding.artifactContentHash} for ${metric.query?.queryId}.`);
  }

  const queryIndex = queryIndexByArtifactKind[metric.source.artifactKind];
  if (queryIndex === undefined) {
    throw new Error(`QUERY_ARTIFACT_NOT_QUERYABLE: ${metric.metricId} uses ${metric.source.artifactKind}.`);
  }
  const queryExecutionReceipt = await executeRelationalQuery(queryIndex, metric.query.queryText);
  if (queryExecutionReceipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
    throw new Error(`QUERY_RECEIPT_QUERY_EXECUTION_FAILED: ${metric.metricId} query execution for ${metric.query?.queryId} ended with ${queryExecutionReceipt.disposition}.`);
  }
  if (queryExecutionReceipt.result?.value?.commandText !== receipt.queryText) {
    throw new Error(`QUERY_RECEIPT_QUERY_TEXT_MISMATCH: ${metric.metricId} command text reported by engine does not match query receipt.`);
  }

  if (typeof receipt.inputHash !== "string" || receipt.inputHash.length === 0) {
    throw new Error(`QUERY_RECEIPT_INPUT_HASH_MISSING: ${metric.metricId} for ${metric.query?.queryId}.`);
  }
  if (receipt.inputHash !== queryExecutionReceipt.inputHash) {
    throw new Error(`QUERY_RECEIPT_INPUT_HASH_MISMATCH: ${metric.metricId} input hash ${receipt.inputHash} does not match expected value for ${metric.query?.queryId}.`);
  }
  if (typeof receipt.rowCount !== "number" || Number.isInteger(receipt.rowCount) === false || receipt.rowCount < 0) {
    throw new Error(`QUERY_RECEIPT_ROW_COUNT_MISMATCH: ${metric.metricId} rowCount ${String(receipt.rowCount)} is invalid for ${metric.query?.queryId}.`);
  }
  const actualRowCount = queryExecutionReceipt.result?.value?.rowCount;
  if (typeof actualRowCount !== "number" || Number.isInteger(actualRowCount) === false || actualRowCount < 0) {
    throw new Error(`QUERY_RECEIPT_ROW_COUNT_MISMATCH: ${metric.metricId} executed rowCount ${String(actualRowCount)} is invalid for ${metric.query?.queryId}.`);
  }
  if (actualRowCount !== receipt.rowCount) {
    throw new Error(`QUERY_RECEIPT_ROW_COUNT_MISMATCH: ${metric.metricId} rowCount ${String(receipt.rowCount)} does not match executed result ${String(actualRowCount)} for ${metric.query?.queryId}.`);
  }
  if (typeof receipt.resultHash !== "string" || receipt.resultHash.length === 0) {
    throw new Error(`QUERY_RECEIPT_RESULT_HASH_MISSING: ${metric.metricId} for ${metric.query?.queryId}.`);
  }
  if (receipt.resultHash !== queryExecutionReceipt.resultHash) {
    throw new Error(`QUERY_RECEIPT_RESULT_HASH_MISMATCH: ${metric.metricId} result hash ${receipt.resultHash} does not match expected value for ${metric.query?.queryId}.`);
  }
  return queryExecutionReceipt;
}

function readsSingleMetricQueryValue(metric, queryExecutionReceipt) {
  const rows = queryExecutionReceipt.result?.value?.rows;
  if (!Array.isArray(rows) || rows.length !== 1) {
    throw new Error(`QUERY_RESULT_SHAPE_MISMATCH: ${metric.metricId} must return exactly one row.`);
  }
  const row = rows[0];
  if (row === null || typeof row !== "object" || Object.keys(row).length !== 1 || !("value" in row)) {
    throw new Error(`QUERY_RESULT_SHAPE_MISMATCH: ${metric.metricId} must return exactly one column named value.`);
  }
  return readNumberValue(row.value, metric.metricId);
}

function resolvesExpectedReceiptBinding(artifactKind, { reportBinding, indexBinding, graphBinding }) {
  if (artifactKind === "call-graph") {
    return Object.freeze({
      artifactKind: "call-graph",
      indexId: graphBinding.indexId,
      scanId: null,
      artifactContentHash: graphBinding.contentHash,
    });
  }
  if (artifactKind === "source-fact-index") {
    return Object.freeze({
      artifactKind: "source-fact-index",
      indexId: indexBinding.indexId,
      scanId: indexBinding.scanId,
      artifactContentHash: indexBinding.contentHash,
    });
  }
  if (artifactKind === "governance-report") {
    return Object.freeze({
      artifactKind: "governance-report",
      indexId: reportBinding.indexId,
      scanId: reportBinding.scanId,
      artifactContentHash: reportBinding.contentHash,
    });
  }
  return Object.freeze({
    artifactKind: "derived",
    indexId: "derived-no-binding",
    scanId: null,
  });
}

function buildsCatalogFingerprint(metricCatalog) {
  return hashText(JSON.stringify(canonicalizes(metricCatalog)));
}

function hashArtifact(artifact) {
  return hashText(JSON.stringify(canonicalizes(artifact)));
}

function canonicalizes(value) {
  if (Array.isArray(value)) return value.map(canonicalizes);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalizes(value[key])]));
  }
  return value;
}

function readRequiredString(value, pointer, label) {
  const candidate = readsJsonPointer(value, pointer);
  if (typeof candidate !== "string" || candidate.length === 0) {
    throw new Error(`ARTIFACT_INDEX_MISMATCH: required value "${label}" is missing at ${pointer}.`);
  }
  return candidate;
}

function readNumberValue(value, metricId) {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(numericValue)) return numericValue;
  throw new Error(`METRIC_POINTER_NOT_FOUND: ${metricId} resolved to a non-numeric value (${String(value)}).`);
}

function readsJsonPointer(root, pointer) {
  if (pointer === "") return root;
  if (typeof pointer !== "string" || pointer[0] !== "/") {
    throw new Error(`Invalid pointer '${pointer}'.`);
  }
  let current = root;
  for (const rawPart of pointer.slice(1).split("/")) {
    if (current === null || current === undefined) return undefined;
    const part = rawPart.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(current)) {
      const index = Number(part);
      if (Number.isInteger(index) === false) return undefined;
      current = current[index];
      continue;
    }
    current = current?.[part];
  }
  return current;
}

function hashText(text) {
  return `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function buildsClosureReceipt({
  reportBinding,
  indexBinding,
  graphBinding,
  catalogBinding,
  queryReceiptById,
  metricValues,
  documentPath,
  documentHash,
  closureConditions,
}) {
  const generatedAtUtc = new Date().toISOString();
  const orderedQueryReceiptRows = [...queryReceiptById.values()]
    .map((receipt) => ({
      queryId: receipt.queryId,
      queryTextHash: receipt.queryTextHash,
      inputHash: receipt.inputHash,
      resultHash: receipt.resultHash,
      rowCount: receipt.rowCount,
      disposition: receipt.disposition,
      artifactBinding: receipt.artifactBinding,
    }))
    .sort((left, right) => left.queryId.localeCompare(right.queryId));

  const metricRows = metricValues.map((metric) => {
    const sourceReceipt = metric.query?.queryId === undefined ? null : queryReceiptById.get(metric.query.queryId) ?? null;
    return {
      metricId: metric.metricId,
      value: metric.value,
      section: metric.section,
      resultType: metric.resultType,
      queryId: metric.query?.queryId ?? null,
      metricDisposition: metric.disposition ?? "DERIVATION_COMPLETED",
      sourceQueryTextHash: sourceReceipt?.queryTextHash ?? null,
      sourceResultHash: sourceReceipt?.resultHash ?? null,
    };
  });

  const queryReceiptBundle = {
    receiptType: "traceability-query-receipts.v1",
    queryReceiptCount: orderedQueryReceiptRows.length,
    queryReceiptRows: orderedQueryReceiptRows,
  };
  const queryReceiptBundleHash = hashText(JSON.stringify(canonicalizes(queryReceiptBundle)));
  const metricRowsHash = hashText(JSON.stringify(canonicalizes(metricRows)));
  const failedConditions = closureConditions
    .filter((condition) => condition.disposition !== "PASSED")
    .map((condition) => condition.conditionId);
  const disposition = failedConditions.length === 0 ? "CLOSED" : "OPEN";

  const deterministicPayload = {
    receiptType: "traceability-documentation-closure-receipt.v1",
    disposition,
    reportBinding: {
      repositoryId: reportBinding.repositoryId,
      reportIndexId: reportBinding.indexId,
      reportScanId: reportBinding.scanId,
      reportType: reportBinding.reportType ?? null,
      schemaVersion: reportBinding.schemaVersion ?? null,
      contentHash: reportBinding.contentHash,
      generatedAtUtc: reportBinding.generatedAtUtc ?? null,
    },
    indexBinding: {
      sourceIndexId: indexBinding.indexId,
      sourceScanId: indexBinding.scanId,
      workspaceId: indexBinding.workspaceId,
      indexType: indexBinding.indexType ?? null,
      schemaVersion: indexBinding.schemaVersion ?? null,
      contentHash: indexBinding.contentHash,
    },
    graphBinding: {
      graphType: graphBinding.graphType ?? null,
      graphIndexId: graphBinding.indexId,
      contentHash: graphBinding.contentHash,
    },
    catalogBinding: {
      catalogType: catalogBinding.catalogType,
      catalogVersion: catalogBinding.catalogVersion ?? null,
      catalogSchemaVersion: catalogBinding.catalogSchemaVersion ?? null,
      catalogFingerprint: catalogBinding.catalogFingerprint,
      contentHash: catalogBinding.catalogContentHash,
    },
    queryReceiptBundle,
    metricRows,
    document: {
      path: path.basename(documentPath),
      hash: documentHash,
    },
    queryReceiptCount: orderedQueryReceiptRows.length,
    renderedMetricCount: metricValues.length,
    queryReceiptBundleHash,
    metricRowsHash,
    closureConditions,
    failedConditionCount: failedConditions.length,
    failedConditions,
  };

  const deterministicReceiptHash = hashText(JSON.stringify(canonicalizes(deterministicPayload)));

  return {
    ...deterministicPayload,
    generatedAtUtc,
    deterministicReceiptHash,
  };
}

function evaluatesDocumentationClosure({ metricCatalog, queryReceiptById, metricValues, documentHash }) {
  const requiredQueryIds = metricCatalog.metrics
    .filter((metric) => metric.claimType === "factual")
    .map((metric) => metric.query?.queryId)
    .filter((queryId) => typeof queryId === "string")
    .sort();
  const receivedQueryIds = [...queryReceiptById.keys()].sort();
  const exactReceiptSet = JSON.stringify(requiredQueryIds) === JSON.stringify(receivedQueryIds);
  const allFactualQueriesVerified = metricValues
    .filter((metric) => metric.source.artifactKind !== "derived")
    .every((metric) => metric.queryVerified === true);
  const allMetricValuesFinite = metricValues.every((metric) => Number.isFinite(metric.value));
  const allCatalogMetricsRendered = metricValues.length === metricCatalog.metrics.length;
  const documentHashValid = /^sha256:[0-9a-f]{64}$/u.test(documentHash);
  return Object.freeze([
    closureCondition("traceability.exact-query-receipt-set.v1", exactReceiptSet),
    closureCondition("traceability.all-factual-queries-verified.v1", allFactualQueriesVerified),
    closureCondition("traceability.all-metric-values-finite.v1", allMetricValuesFinite),
    closureCondition("traceability.all-catalog-metrics-rendered.v1", allCatalogMetricsRendered),
    closureCondition("traceability.document-content-hash.v1", documentHashValid),
  ]);
}

function closureCondition(conditionId, passed) {
  return Object.freeze({ conditionId, disposition: passed ? "PASSED" : "FAILED" });
}
