import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { validatesSelfGovernanceReport } from "./governance/validates-self-governance-report.js";
import { validatesSourceFactIndex } from "./validate-index.js";
import {
  validatesTraceabilityMetricCatalog,
  validatesTraceabilityQueryReceipts,
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
  };
  const orderedMetricValues = [];

  for (const metric of metricCatalog.metrics) {
    if (resolved.has(metric.metricId)) continue;
    orderedMetricValues.push({
      ...resolveMetric(
        metric.metricId,
        metricById,
        artifactByKind,
        queryReceiptById,
        {
          reportBinding,
          indexBinding,
          graphBinding,
          catalogBinding,
        },
        resolved,
        new Set(),
      ),
      source: metric.source,
      resultType: metric.resultType,
      section: metric.section,
      query: metric.query ?? null,
    });
  }

  const sections = sectionsFromMetrics(orderedMetricValues);
  const timestamp = new Date().toISOString();
  const markdown = buildsTraceabilityMarkdown({
    timestamp,
    reportBinding,
    indexBinding,
    graphBinding,
    sections,
    resolved,
  });
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, markdown, "utf8");

  if (closureReceiptPath !== null) {
    const artifactHash = hashText(markdown);
    const closureReceipt = buildsClosureReceipt({
      timestamp,
      report,
      graph,
      index,
      queryReceipts,
      metricCatalog,
      metricValues: orderedMetricValues,
      documentPath: outputPath,
      documentHash: artifactHash,
    });
    mkdirSync(path.dirname(closureReceiptPath), { recursive: true });
    writeFileSync(closureReceiptPath, `${JSON.stringify(closureReceipt, null, 2)}\n`, "utf8");
  }

  return outputPath;
}

function validateArtifactCompatibility(report, graph, index) {
  const reportIndexId = readRequiredString(report, "index.indexId", "Report indexId");
  const reportScanId = readRequiredString(report, "index.scanId", "Report scanId");
  const sourceIndexId = readRequiredString(index, "indexId", "Source indexId");
  const sourceScanId = readRequiredString(index, "manifest.scanId", "Source scanId");
  const graphIndexId = readRequiredString(graph, "indexId", "Call-graph indexId");
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
    },
    indexBinding: {
      indexId: sourceIndexId,
      scanId: sourceScanId,
      workspaceId: sourceWorkspaceId ?? "unknown",
    },
    graphBinding: { indexId: graphIndexId },
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
  timestamp,
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
  lines.push(`**Generated:** ${timestamp}`);
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

function resolveMetric(metricId, metricById, artifactByKind, queryReceiptById, context, resolved, seenIds) {
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

  if (metric.query?.queryId !== undefined) {
    const receipt = queryReceiptById.get(metric.query.queryId);
    if (receipt === undefined) {
      throw new Error(`QUERY_RECEIPT_MISSING: ${metric.query.queryId} for ${metricId}.`);
    }
    if (receipt.disposition !== "RELATIONAL_QUERY_EXECUTED") {
      throw new Error(`QUERY_RECEIPT_STALE: ${metric.query.queryId} for ${metricId} was ${receipt.disposition}.`);
    }
    validatesQueryReceiptBinding(metric, receipt, context);
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
    value = source.addendMetricIds.reduce((total, addendMetricId) => (
      total + resolveMetric(addendMetricId, metricById, artifactByKind, queryReceiptById, context, resolved, seenIds).value
    ), 0);
  } else if (source.valueMode === "ratio") {
    const numeratorMetric = resolveMetric(
      source.numeratorMetricId,
      metricById,
      artifactByKind,
      queryReceiptById,
      context,
      resolved,
      seenIds,
    );
    const denominatorMetric = resolveMetric(
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
  const resolvedResult = Object.freeze({
    metricId,
    section: metric.section,
    source,
    value: resolvedValue,
    resultType: metric.resultType,
    query: metric.query ?? null,
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

function validatesQueryReceiptBinding(metric, receipt, { reportBinding, indexBinding, graphBinding, catalogBinding }) {
  if (receipt.queryText === undefined || receipt.queryText.length === 0) {
    throw new Error(`QUERY_RECEIPT_TEXT_MISSING: ${metric.metricId} has no query text for ${metric.query?.queryId}.`);
  }
  if (metric.query?.queryText !== undefined && metric.query.queryText !== receipt.queryText) {
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
}

function resolvesExpectedReceiptBinding(artifactKind, { reportBinding, indexBinding, graphBinding }) {
  if (artifactKind === "call-graph") {
    return Object.freeze({
      artifactKind: "call-graph",
      indexId: graphBinding.indexId,
      scanId: null,
    });
  }
  if (artifactKind === "source-fact-index") {
    return Object.freeze({
      artifactKind: "source-fact-index",
      indexId: indexBinding.indexId,
      scanId: indexBinding.scanId,
    });
  }
  if (artifactKind === "governance-report") {
    return Object.freeze({
      artifactKind: "governance-report",
      indexId: reportBinding.indexId,
      scanId: reportBinding.scanId,
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
  timestamp,
  report,
  graph,
  index,
  queryReceipts,
  metricCatalog,
  metricValues,
  documentPath,
  documentHash,
}) {
  const metricRows = metricValues.map((metric) => ({
    metricId: metric.metricId,
    value: metric.value,
    section: metric.section,
    resultType: metric.resultType,
    queryId: metric.query?.queryId ?? null,
    metricDisposition: metric.disposition ?? "DERIVATION_COMPLETED",
  }));

  return {
    receiptType: "traceability-documentation-closure-receipt.v1",
    generatedAtUtc: timestamp,
    reportBinding: {
      repositoryId: report.repository?.repositoryId ?? report.subject?.repositoryId ?? null,
      reportIndexId: report.index?.indexId ?? null,
      reportScanId: report.index?.scanId ?? null,
    },
    indexBinding: {
      sourceIndexId: index.indexId ?? null,
      sourceScanId: index.manifest?.scanId ?? null,
      workspaceId: index.workspace?.workspaceId ?? null,
    },
    graphBinding: {
      graphIndexId: graph.indexId ?? null,
      summary: graph.summary ?? null,
    },
    metricCatalog: {
      catalogType: metricCatalog.catalogType ?? null,
      catalogVersion: metricCatalog.catalogVersion ?? null,
    },
    document: {
      path: documentPath,
      hash: documentHash,
    },
    queryReceiptCount: queryReceipts.queryReceipts?.length ?? 0,
    renderedMetricCount: metricRows.length,
    metricRows,
  };
}
