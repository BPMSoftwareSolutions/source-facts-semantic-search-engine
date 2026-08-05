import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

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
    if (!artifacts.has(row.artifactId)) throw new Error(`Responsibility '${row.responsibilityId}' references unknown artifact '${row.artifactId}'.`);
  }
  return lineage;
}

export function projectsEngineeringTruthSqlPayload({ contract, report, contractSourcePath = null, reportSourcePath = null } = {}) {
  requiredObject(contract, "contract");
  requiredObject(report, "report");
  const lineage = validatesCanonicalLineage(contract);
  const interfaceGovernance = requiredObject(report.interfaceGovernance, "report.interfaceGovernance");
  const testTraceability = requiredObject(report.testTraceability, "report.testTraceability");
  const contractSnapshotId = digest(contract);
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
      sourcePath: contractSourcePath,
      authorityDigest: contractSnapshotId,
    },
    observation: {
      observationSnapshotId,
      indexId: report.index?.indexId ?? null,
      reportType: report.reportType,
      repositoryId: report.repository?.repositoryId ?? null,
      generatedAtUtc: report.generatedAtUtc ?? null,
      sourcePath: reportSourcePath,
      observationDigest: observationSnapshotId,
    },
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
    await writeFile(scriptPath, `SET NOCOUNT ON;\nDECLARE @Payload nvarchar(max) = N'';\n${assignments}\nDECLARE @Result TABLE (ContractSnapshotId varchar(80), ObservationSnapshotId varchar(80), AlreadyLoaded bit, FeaturesLoaded int, CallablesLoaded int, TestsLoaded int);\nINSERT @Result EXEC ingestion.LoadEngineeringTruth @PayloadJson = @Payload;\nSELECT (SELECT * FROM @Result FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS StepJson;\n`, "utf8");
    const stdout = await runsSqlcmd({ sqlcmdPath, connection, scriptPath });
    const result = parsesJsonRow(stdout);
    return {
      ...payloadSummary(payload),
      disposition: result.AlreadyLoaded ? "ENGINEERING_TRUTH_ALREADY_LOADED" : "ENGINEERING_TRUTH_LOADED",
      alreadyLoaded: Boolean(result.AlreadyLoaded),
      databaseCounts: { features: result.FeaturesLoaded, callables: result.CallablesLoaded, tests: result.TestsLoaded },
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
    },
  };
}

function runsSqlcmd({ sqlcmdPath, connection, scriptPath }) {
  return new Promise((resolve, reject) => {
    const args = [...connection.buildsArgs(), "-i", scriptPath, "-h", "-1", "-w", "8000", "-y", "8000", "-b"];
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
