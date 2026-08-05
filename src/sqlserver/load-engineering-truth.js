import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { projectsContractAuthorityDocument } from "./contract-authority-document.js";

function digest(value) {
  return `sha256:${createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value), "utf8").digest("hex")}`;
}

function requiredObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} is required.`);
  return value;
}

function unique(rows, key) {
  return [...new Map(rows.map((row) => [key(row), row])).values()];
}

function normalizesEnterpriseContext(enterpriseContext, label, { repositoryId = null, workspaceId = null } = {}) {
  if (enterpriseContext === null || enterpriseContext === undefined) return null;
  if (typeof enterpriseContext !== "object" || Array.isArray(enterpriseContext)) {
    throw new Error(`${label} must be an object when provided.`);
  }
  const context = enterpriseContext;
  return Object.freeze({
    enterpriseId: context.enterpriseId ?? null,
    portfolioId: context.portfolioId ?? null,
    domainId: context.domainId ?? null,
    applicationId: context.applicationId ?? null,
    capabilityId: context.capabilityId ?? null,
    repositoryId: context.repositoryId ?? repositoryId ?? null,
    workspaceId: context.workspaceId ?? workspaceId ?? null,
    contextAuthorityId: context.contextAuthorityId ?? null,
  });
}

function validatesEnterpriseContextConsistency(contractContext, reportContext) {
  if (contractContext === null || reportContext === null) return;
  for (const key of ["enterpriseId", "portfolioId", "domainId", "applicationId", "capabilityId", "repositoryId", "workspaceId", "contextAuthorityId"]) {
    const contractValue = contractContext[key];
    const reportValue = reportContext[key];
    if (contractValue != null && reportValue != null && contractValue !== reportValue) {
      throw new Error(`contract.enterpriseContext.${key} (${contractValue}) must match report.enterpriseContext.${key} (${reportValue}).`);
    }
  }
}

export function validatesReportEnterpriseContextMatchesRepository(report) {
  requiredObject(report, "report");
  const repository = report.repository ?? null;
  const enterpriseContext = report.enterpriseContext ?? null;
  if (repository === null || typeof repository !== "object" || Array.isArray(repository) || enterpriseContext === null) return;

  if (enterpriseContext.repositoryId != null && repository.repositoryId != null && enterpriseContext.repositoryId !== repository.repositoryId) {
    throw new Error(`report.enterpriseContext.repositoryId (${enterpriseContext.repositoryId}) must match report.repository.repositoryId (${repository.repositoryId}).`);
  }
  if (enterpriseContext.workspaceId != null && repository.workspaceId != null && enterpriseContext.workspaceId !== repository.workspaceId) {
    throw new Error(`report.enterpriseContext.workspaceId (${enterpriseContext.workspaceId}) must match report.repository.workspaceId (${repository.workspaceId}).`);
  }
}

const enterpriseSubjectOrder = Object.freeze([
  { field: "enterpriseId", subjectType: "enterprise" },
  { field: "portfolioId", subjectType: "portfolio" },
  { field: "domainId", subjectType: "domain" },
  { field: "applicationId", subjectType: "application" },
  { field: "capabilityId", subjectType: "capability" },
  { field: "repositoryId", subjectType: "repository" },
  { field: "workspaceId", subjectType: "workspace" },
]);

export function buildsEnterpriseSubjectRegistry(...enterpriseContexts) {
  const subjects = new Map();
  const relationships = new Map();

  for (const context of enterpriseContexts.filter((value) => value !== null && value !== undefined)) {
    const chain = enterpriseSubjectOrder
      .map((entry) => ({ ...entry, subjectId: context[entry.field] }))
      .filter((entry) => entry.subjectId !== null && entry.subjectId !== undefined);

    let previous = null;
    for (const entry of chain) {
      const subjectKey = `${entry.subjectType}\0${entry.subjectId}`;
      if (!subjects.has(subjectKey)) {
        subjects.set(subjectKey, {
          subjectType: entry.subjectType,
          subjectId: entry.subjectId,
          enterpriseId: context.enterpriseId ?? null,
          portfolioId: context.portfolioId ?? null,
          domainId: context.domainId ?? null,
          applicationId: context.applicationId ?? null,
          capabilityId: context.capabilityId ?? null,
          repositoryId: context.repositoryId ?? null,
          workspaceId: context.workspaceId ?? null,
          contextAuthorityId: context.contextAuthorityId ?? null,
          authorityDigest: digest({
            subjectType: entry.subjectType,
            subjectId: entry.subjectId,
            enterpriseId: context.enterpriseId ?? null,
            portfolioId: context.portfolioId ?? null,
            domainId: context.domainId ?? null,
            applicationId: context.applicationId ?? null,
            capabilityId: context.capabilityId ?? null,
            repositoryId: context.repositoryId ?? null,
            workspaceId: context.workspaceId ?? null,
            contextAuthorityId: context.contextAuthorityId ?? null,
          }),
        });
      }
      if (previous !== null) {
        const relationshipKey = `${previous.subjectType}\0${previous.subjectId}\0${entry.subjectType}\0${entry.subjectId}\0CONTEXT_PARENT_OF`;
        if (!relationships.has(relationshipKey)) {
          relationships.set(relationshipKey, {
          fromSubjectType: previous.subjectType,
          fromSubjectId: previous.subjectId,
          toSubjectType: entry.subjectType,
          toSubjectId: entry.subjectId,
          relationshipType: "CONTEXT_PARENT_OF",
          enterpriseId: context.enterpriseId ?? null,
          portfolioId: context.portfolioId ?? null,
          domainId: context.domainId ?? null,
          applicationId: context.applicationId ?? null,
          capabilityId: context.capabilityId ?? null,
          repositoryId: context.repositoryId ?? null,
          workspaceId: context.workspaceId ?? null,
          contextAuthorityId: context.contextAuthorityId ?? null,
          authorityDigest: digest({
            fromSubjectType: previous.subjectType,
            fromSubjectId: previous.subjectId,
            toSubjectType: entry.subjectType,
            toSubjectId: entry.subjectId,
            relationshipType: "CONTEXT_PARENT_OF",
            enterpriseId: context.enterpriseId ?? null,
            portfolioId: context.portfolioId ?? null,
            domainId: context.domainId ?? null,
            applicationId: context.applicationId ?? null,
            capabilityId: context.capabilityId ?? null,
            repositoryId: context.repositoryId ?? null,
            workspaceId: context.workspaceId ?? null,
            contextAuthorityId: context.contextAuthorityId ?? null,
          }),
        });
      }
      }
      previous = entry;
    }
  }

  return {
    enterpriseSubjects: [...subjects.values()].sort((left, right) => left.subjectType.localeCompare(right.subjectType) || String(left.subjectId).localeCompare(String(right.subjectId))),
    enterpriseSubjectRelationships: [...relationships.values()].sort((left, right) =>
      left.fromSubjectType.localeCompare(right.fromSubjectType)
      || String(left.fromSubjectId).localeCompare(String(right.fromSubjectId))
      || left.toSubjectType.localeCompare(right.toSubjectType)
      || String(left.toSubjectId).localeCompare(String(right.toSubjectId))),
  };
}

function validatesCanonicalLineage(contract) {
  const lineage = requiredObject(contract.lineage, "contract.lineage");
  if (lineage.authorityType !== "canonical-lineage-authority.v1") throw new Error("contract.lineage must be canonical-lineage-authority.v1.");
  const artifacts = new Set((contract.artifacts ?? []).map((row) => row.artifactId));
  const projects = new Set([lineage.projectId]);
  const features = new Set((lineage.features ?? []).map((row) => row.featureId));
  const scenarios = new Set((lineage.scenarios ?? []).map((row) => row.scenarioId));
  const obligations = new Set((lineage.obligations ?? []).map((row) => row.obligationId));
  for (const row of lineage.features ?? []) if (!projects.has(row.projectId)) throw new Error(`Feature '${row.featureId}' references unknown project '${row.projectId}'.`);
  for (const row of lineage.scenarios ?? []) if (!features.has(row.featureId)) throw new Error(`Scenario '${row.scenarioId}' references unknown feature '${row.featureId}'.`);
  for (const row of lineage.obligations ?? []) if (!scenarios.has(row.scenarioId)) throw new Error(`Obligation '${row.obligationId}' references unknown scenario '${row.scenarioId}'.`);
  for (const row of lineage.responsibilities ?? []) {
    if (!obligations.has(row.obligationId)) throw new Error(`Responsibility '${row.responsibilityId}' references unknown obligation '${row.obligationId}'.`);
    if (row.artifactId != null && !artifacts.has(row.artifactId)) throw new Error(`Responsibility '${row.responsibilityId}' references unknown artifact '${row.artifactId}'.`);
  }
  return lineage;
}

export function projectsEngineeringTruthSqlPayload({ contract, report, contractSourcePath = null, reportSourcePath = null } = {}) {
  requiredObject(contract, "contract");
  requiredObject(report, "report");
  validatesReportEnterpriseContextMatchesRepository(report);
  const lineage = validatesCanonicalLineage(contract);
  const interfaceGovernance = requiredObject(report.interfaceGovernance, "report.interfaceGovernance");
  const testTraceability = requiredObject(report.testTraceability, "report.testTraceability");
  const reportEnterpriseContext = normalizesEnterpriseContext(report.enterpriseContext, "report.enterpriseContext", {
    repositoryId: report.repository?.repositoryId ?? null,
    workspaceId: report.repository?.workspaceId ?? null,
  });
  const contractEnterpriseContext = normalizesEnterpriseContext(contract.enterpriseContext ?? reportEnterpriseContext, "contract.enterpriseContext", {
    repositoryId: reportEnterpriseContext?.repositoryId ?? null,
    workspaceId: reportEnterpriseContext?.workspaceId ?? null,
  });
  validatesEnterpriseContextConsistency(contractEnterpriseContext, reportEnterpriseContext);
  const enterpriseRegistry = buildsEnterpriseSubjectRegistry(contractEnterpriseContext, reportEnterpriseContext);
  const contractSnapshotId = digest(contract);
  const contractAuthorityDocument = projectsContractAuthorityDocument(contract);
  if (contractAuthorityDocument.contractDocument.authorityDigest !== contractSnapshotId) {
    throw new Error("Normalized contract authority document does not match the contract snapshot digest.");
  }
  const observationSnapshotId = digest(report);
  const callableKey = (symbolId) => digest(String(symbolId));
  const commandId = (command) => digest(`${command.commandName}\0${command.entryPointId}`);
  const commandsByEntryPoint = new Map((interfaceGovernance.commands ?? []).map((row) => [row.entryPointId, row]));

  const observedCallableRows = [
    ...(interfaceGovernance.callableInventory ?? []).map((row) => ({
    callableKey: callableKey(row.symbolId),
    callableId: row.symbolId,
    symbolName: row.name ?? null,
    modulePath: row.modulePath,
    symbolKind: row.kind ?? null,
    sourceReferenceId: row.sourceReferenceId ?? null,
    declarationLine: row.declarationLine ?? null,
    closureClassification: row.cliClosureClassification ?? null,
    })),
    // Test reachability can legitimately terminate at an exported variable or
    // another production declaration outside the callable-only inventory. It is
    // still an observed implementation node and must retain its own identity.
    ...(testTraceability.productionReachability ?? []).map((row) => ({
      callableKey: callableKey(row.productionSymbolId),
      callableId: row.productionSymbolId,
      symbolName: row.productionSymbolName ?? null,
      modulePath: row.productionModulePath,
      symbolKind: null,
      sourceReferenceId: null,
      declarationLine: null,
      closureClassification: row.cliClosureClassification ?? null,
    })),
  ];
  const callables = unique(observedCallableRows, (row) => row.callableKey);

  const commands = (interfaceGovernance.commands ?? []).map((row) => ({
    commandId: commandId(row),
    commandName: row.commandName,
    handlerSymbolId: row.entryPointId,
    interfaceStatus: row.interfaceStatus ?? null,
    admissionDisposition: row.admissionDisposition ?? null,
  }));

  const commandReachability = unique((interfaceGovernance.reachability ?? []).flatMap((row) => {
    const command = commandsByEntryPoint.get(row.entryPointId);
    return command ? [{
      commandId: commandId(command), callableKey: callableKey(row.reachableSymbolId ?? row.symbolId), depth: row.depth,
      pathWitnessJson: JSON.stringify(row.pathWitness ?? []), relationshipIdsJson: JSON.stringify(row.relationshipIds ?? []),
      resolutionDisposition: row.resolutionDisposition ?? "OBSERVED_RESOLUTION_UNCLASSIFIED",
    }] : [];
  }), (row) => `${row.commandId}\0${row.callableKey}`);

  const declaredResponsibilityCommands = (interfaceGovernance.commands ?? []).flatMap((command) =>
    (command.canonicalResponsibilityIds ?? []).map((responsibilityId) => ({
      responsibilityId, commandId: commandId(command), bindingDisposition: "OBSERVED_CANONICAL_COMMAND_BINDING",
    })));

  const artifactPathById = new Map((contract.artifacts ?? []).map((row) => [row.artifactId, String(row.relativePath).replaceAll("\\", "/")]));
  const ownedRoots = (lineage.responsibilities ?? []).flatMap((responsibility) => {
    const ownedPath = artifactPathById.get(responsibility.artifactId);
    if (ownedPath === undefined) return [];
    return callables.filter((callable) => String(callable.modulePath ?? "").replaceAll("\\", "/") === ownedPath)
      .map((callable) => ({ responsibilityId: responsibility.responsibilityId, callableKey: callable.callableKey }));
  });
  const ownedRootCommands = ownedRoots.flatMap((root) => commandReachability
    .filter((reach) => reach.callableKey === root.callableKey)
    .map((reach) => ({ responsibilityId: root.responsibilityId, commandId: reach.commandId, bindingDisposition: "OBSERVED_OWNED_ARTIFACT_COMMAND_BINDING" })));
  const responsibilityCommands = unique([...declaredResponsibilityCommands, ...ownedRootCommands], (row) => `${row.responsibilityId}\0${row.commandId}`);

  const responsibilityCallables = unique([
    ...ownedRoots.map((root) => ({ ...root, commandId: null, depth: 0, bindingDisposition: "OBSERVED_OWNED_ARTIFACT_ROOT" })),
    ...responsibilityCommands.flatMap((binding) => commandReachability
    .filter((reach) => reach.commandId === binding.commandId)
    .map((reach) => ({ ...binding, callableKey: reach.callableKey, depth: reach.depth, bindingDisposition: "OBSERVED_COMMAND_REACHABILITY" }))),
  ],
  (row) => `${row.responsibilityId}\0${row.callableKey}`);

  const tests = (testTraceability.inventory ?? []).map((row) => ({
    testId: row.testId, testName: row.testName, testFilePath: row.modulePath, framework: row.framework ?? null,
    startLine: row.startLine ?? null, executionStatus: row.executionStatus ?? "UNKNOWN",
    runtimeResultDisposition: row.runtimeResultDisposition ?? "TEST_EXECUTION_NOT_EVALUATED",
  }));

  const testProductionReachability = unique((testTraceability.productionReachability ?? []).map((row) => ({
    testId: row.testId, callableKey: callableKey(row.productionSymbolId), depth: row.depth,
    reachabilityPosture: row.reachabilityPosture, pathWitnessJson: JSON.stringify(row.pathWitness ?? []),
  })), (row) => `${row.testId}\0${row.callableKey}`);

  const scenarioTestBindings = unique((testTraceability.scenarioLineage ?? []).map((row) => ({
    scenarioId: row.scenarioId, responsibilityId: row.responsibilityId, testId: row.testId,
    bindingDisposition: row.lineageStatus ?? "OBSERVED_SCENARIO_TEST_BINDING",
  })), (row) => `${row.scenarioId}\0${row.responsibilityId}\0${row.testId}`);

  const proofByScenario = new Map((testTraceability.scenarioProofCoverage ?? []).map((row) => [row.scenarioId, row]));
  const scenarioProofs = unique((testTraceability.scenarioLineage ?? []).map((row) => ({
    scenarioId: row.scenarioId,
    testId: row.testId,
    executionDisposition: row.executionDisposition ?? "TEST_EXECUTION_NOT_EVALUATED",
    proofDisposition: proofByScenario.get(row.scenarioId)?.proofDisposition ?? row.proofPosture ?? "PROOF_NOT_EVALUATED",
    observedResultJson: row.observedResult == null ? null : JSON.stringify(row.observedResult),
  })), (row) => `${row.scenarioId}\0${row.testId}`);

  const rowDigest = (row) => digest(row);
  return {
    payloadType: "engineering-truth-sql-load.v1",
    contract: {
      contractSnapshotId,
      contractId: contract.contract?.contractId ?? contract.contract?.id ?? null,
      contractType: contract.contract?.contractType ?? contract.contract?.contractKind ?? null,
      projectId: lineage.projectId,
      subjectId: contract.subject?.subjectId ?? null,
      enterpriseContext: contractEnterpriseContext,
      sourcePath: contractSourcePath,
      authorityDigest: contractSnapshotId,
    },
    contractDocument: contractAuthorityDocument.contractDocument,
    contractNodes: contractAuthorityDocument.contractNodes,
    observation: {
      observationSnapshotId,
      indexId: report.index?.indexId ?? null,
      reportType: report.reportType,
      repositoryId: report.repository?.repositoryId ?? null,
      enterpriseContext: reportEnterpriseContext,
      generatedAtUtc: report.generatedAtUtc ?? null,
      sourcePath: reportSourcePath,
      observationDigest: observationSnapshotId,
    },
    enterpriseSubjects: enterpriseRegistry.enterpriseSubjects,
    enterpriseSubjectRelationships: enterpriseRegistry.enterpriseSubjectRelationships,
    projects: [{ projectId: lineage.projectId, authorityDigest: rowDigest({ projectId: lineage.projectId }) }],
    artifacts: (contract.artifacts ?? []).map((row) => ({
      artifactId: row.artifactId, artifactKind: row.artifactKind, purpose: row.purpose, relativePath: row.relativePath,
      mediaType: row.mediaType, projectionProfileId: row.projection?.projectorId ?? null, authorityDigest: rowDigest(row),
    })),
    features: (lineage.features ?? []).map((row) => ({ ...row, authorityDigest: rowDigest(row) })),
    scenarios: (lineage.scenarios ?? []).map((row) => ({ ...row, authorityDigest: rowDigest(row) })),
    obligations: (lineage.obligations ?? []).map((row) => ({ ...row, authorityDigest: rowDigest(row) })),
    responsibilities: (lineage.responsibilities ?? []).map((row) => ({ ...row, authorityDigest: rowDigest(row) })),
    callables, commands, commandReachability, responsibilityCommands, responsibilityCallables,
    tests, testProductionReachability, scenarioTestBindings, scenarioProofs,
  };
}

export function projectsCanonicalIntentRegistryContract({ intents, projectId = "source-facts-semantic-search-engine", enterpriseContext = null } = {}) {
  if (!Array.isArray(intents) || intents.length === 0) throw new Error("At least one canonical feature intent is required.");
  for (const intent of intents) {
    if (intent?.documentKind !== "canonical-feature-intent.v1") throw new Error("Every intent must be canonical-feature-intent.v1.");
  }
  const resolvedEnterpriseContext = normalizesEnterpriseContext(enterpriseContext, "enterpriseContext", { repositoryId: projectId, workspaceId: null });
  return {
    contract: { contractId: "canonical-feature-intent-registry.v1", contractType: "canonical-feature-intent-registry.v1" },
    subject: { subjectId: projectId },
    enterpriseContext: resolvedEnterpriseContext,
    artifacts: [],
    lineage: {
      authorityType: "canonical-lineage-authority.v1",
      projectId,
      features: intents.map((intent) => ({
        featureId: intent.featureId, projectId, purpose: intent.purpose,
        lifecycleStatus: intent.lifecycle ?? null, authorityStatus: intent.authorityStatus ?? null,
      })),
      scenarios: intents.flatMap((intent) => intent.scenarios.map((scenario) => ({
        scenarioId: scenario.scenarioId, featureId: intent.featureId, purpose: scenario.purpose,
      }))),
      // The intent format identifies an obligation but does not declare a separate
      // obligation statement. Preserve that absence instead of copying scenario prose.
      obligations: intents.flatMap((intent) => intent.scenarios.map((scenario) => ({
        obligationId: scenario.obligationId, scenarioId: scenario.scenarioId, statement: null,
      }))),
      responsibilities: intents.flatMap((intent) => intent.scenarios.map((scenario) => ({
        responsibilityId: scenario.responsibilityId, obligationId: scenario.obligationId,
        responsibilityType: "feature-intent", projectionProfileId: "implementation-symbol-binding.v1", artifactId: null,
      }))),
    },
  };
}

export async function loadsEngineeringTruthIntoSqlServer({ contract, report, contractSourcePath = null, reportSourcePath = null, connection, sqlcmdPath = "sqlcmd" } = {}) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") throw new Error("connection is required (see resolves-sql-connection.js).");
  const payload = projectsEngineeringTruthSqlPayload({ contract, report, contractSourcePath, reportSourcePath });
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-truthload-"));
  const scriptPath = path.join(workDirectory, "load.sql");
  try {
    // Inline bounded chunks because Azure SQL cannot OPENROWSET a file on the
    // caller's workstation. Keeping each literal below 4,000 NVARCHAR characters
    // also avoids SQL Server's implicit literal truncation boundary.
    const json = JSON.stringify(payload);
    const chunks = json.match(/[\s\S]{1,3500}/gu) ?? [];
    const assignments = chunks.map((chunk) => `SET @Payload += N'${chunk.replaceAll("'", "''")}';`).join("\n");
    await writeFile(scriptPath, `SET NOCOUNT ON;\nDECLARE @Payload nvarchar(max) = N'';\n${assignments}\nDECLARE @Result TABLE (ContractSnapshotId varchar(80), ObservationSnapshotId varchar(80), AlreadyLoaded bit, FeaturesLoaded int, CallablesLoaded int, TestsLoaded int, EnterpriseSubjectsLoaded int, EnterpriseSubjectRelationshipsLoaded int);\nINSERT @Result EXEC ingestion.LoadEngineeringTruth @PayloadJson = @Payload;\nSELECT (SELECT * FROM @Result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS StepJson;\n`, "utf8");
    const stdout = await runsSqlcmd({ sqlcmdPath, connection, scriptPath });
    const result = parsesJsonRow(stdout);
    return {
      ...payloadSummary(payload),
      disposition: result.AlreadyLoaded ? "ENGINEERING_TRUTH_ALREADY_LOADED" : "ENGINEERING_TRUTH_LOADED",
      alreadyLoaded: Boolean(result.AlreadyLoaded),
      databaseCounts: {
        features: result.FeaturesLoaded,
        callables: result.CallablesLoaded,
        tests: result.TestsLoaded,
        enterpriseSubjects: result.EnterpriseSubjectsLoaded,
        enterpriseSubjectRelationships: result.EnterpriseSubjectRelationshipsLoaded,
      },
    };
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

function payloadSummary(payload) {
  return {
    contractSnapshotId: payload.contract.contractSnapshotId,
    observationSnapshotId: payload.observation.observationSnapshotId,
    projectedCounts: {
      features: payload.features.length, scenarios: payload.scenarios.length, obligations: payload.obligations.length,
      responsibilities: payload.responsibilities.length, artifacts: payload.artifacts.length, commands: payload.commands.length,
      callables: payload.callables.length, commandReachability: payload.commandReachability.length, tests: payload.tests.length,
      testProductionReachability: payload.testProductionReachability.length, scenarioTestBindings: payload.scenarioTestBindings.length,
      contractNodes: payload.contractNodes.length,
      enterpriseSubjects: payload.enterpriseSubjects.length, enterpriseSubjectRelationships: payload.enterpriseSubjectRelationships.length,
    },
  };
}

function runsSqlcmd({ sqlcmdPath, connection, scriptPath }) {
  return new Promise((resolve, reject) => {
    const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", "8000", "-y", "8000", "-b"];
    const child = spawn(sqlcmdPath, args, { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => reject(new Error(`Unable to run sqlcmd: ${error.message}`)));
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`)));
  });
}

function parsesJsonRow(stdout) {
  const text = stdout.split(/\r?\n/u).map((line) => line.trimEnd()).filter(Boolean).join("");
  if (text.length === 0) throw new Error("sqlcmd returned no engineering-truth load receipt.");
  return JSON.parse(text);
}
