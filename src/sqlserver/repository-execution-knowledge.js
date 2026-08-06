import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { verifiesRepositoryExecutionKnowledge } from "../repository-execution-knowledge.js";
import { validatesDeterministicMechanicAuthority } from "../governance/validates-deterministic-mechanic-authority.js";

export async function recordsRepositoryExecutionKnowledgeInSqlServer({ analysis, observationSnapshotId, contractSnapshotId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection); verifiesRepositoryExecutionKnowledge(analysis);
  const payload = { ...analysis.summary, rootId: analysis.rootId, applicationId: analysis.applicationId, repositoryImageDigest: analysis.repositoryImageDigest, sourceFactIndexId: analysis.sourceFactIndexId, observationSnapshotId, contractSnapshotId, analysisDigest: analysis.analysisDigest };
  const query = `SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(payload))}; EXEC ingestion.RecordRepositoryExecutionAnalysis @PayloadJson=@PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const row = lines.find((line) => line.startsWith("X|"));
  if (!row) throw new Error("SQL Server returned no repository execution-analysis result.");
  const [, analysisDigest, sourceFactIndexId, disposition] = row.split("|");
  if (analysisDigest !== analysis.analysisDigest || sourceFactIndexId !== analysis.sourceFactIndexId) throw new Error("SQL Server execution-analysis identity mismatch.");
  return Object.freeze({ rootId: analysis.rootId, analysisDigest, sourceFactIndexId, observationSnapshotId, disposition });
}

export async function queriesCurrentOperationalExecutionSummary({ rootId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  const query = `SET NOCOUNT ON; SELECT CONCAT('O|',SourceFileCount,'|',CallableCount,'|',CommandCount,'|',ReachabilityRowCount,'|',MechanicCount,'|',TestMechanicCount,'|',InterfaceReachableMechanicCount,'|',ResponsibilityLinkedMechanicCount,'|',ResponsibilityOwnedMechanicCount,'|',TestReachedMechanicCount,'|',AuthorityAdmittedMechanicCount,'|',ReachableUnownedCallableCount,'|',UnreachableCallableCount,'|',AuthorityCompletionBacklogCount,'|',OutsideKernelViolationCount,'|',AuthorityBoundViolationCount,'|',KernelAllowedMechanicCount,'|',FalsePositiveMechanicCount,'|',ExecutionAnalysisDisposition) FROM projection.CurrentOperationalExecutionSummary WHERE RootId=${sqlStringLiteral(rootId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query }); const row = lines.find((line) => line.startsWith("O|"));
  if (!row) return Object.freeze({ rootId, disposition: "OPERATIONAL_EXECUTION_KNOWLEDGE_MISSING" });
  const [, sourceFileCount, callableCount, commandCount, reachabilityRowCount, mechanicCount, testMechanicCount, interfaceReachableMechanicCount, responsibilityLinkedMechanicCount, responsibilityOwnedMechanicCount, testReachedMechanicCount, authorityAdmittedMechanicCount, reachableUnownedCallableCount, unreachableCallableCount, authorityCompletionBacklogCount, outsideKernelViolationCount, authorityBoundViolationCount, kernelAllowedMechanicCount, falsePositiveMechanicCount, executionAnalysisDisposition] = row.split("|");
  return Object.freeze({ rootId, sourceFileCount:Number(sourceFileCount), callableCount:Number(callableCount), commandCount:Number(commandCount), reachabilityRowCount:Number(reachabilityRowCount), mechanicCount:Number(mechanicCount), testMechanicCount:Number(testMechanicCount), interfaceReachableMechanicCount:Number(interfaceReachableMechanicCount), responsibilityLinkedMechanicCount:Number(responsibilityLinkedMechanicCount), responsibilityOwnedMechanicCount:Number(responsibilityOwnedMechanicCount), testReachedMechanicCount:Number(testReachedMechanicCount), authorityAdmittedMechanicCount:Number(authorityAdmittedMechanicCount), reachableUnownedCallableCount:Number(reachableUnownedCallableCount), unreachableCallableCount:Number(unreachableCallableCount), authorityCompletionBacklogCount:Number(authorityCompletionBacklogCount), outsideKernelViolationCount:Number(outsideKernelViolationCount), authorityBoundViolationCount:Number(authorityBoundViolationCount), kernelAllowedMechanicCount:Number(kernelAllowedMechanicCount), falsePositiveMechanicCount:Number(falsePositiveMechanicCount), executionAnalysisDisposition, disposition:"OPERATIONAL_EXECUTION_KNOWLEDGE_QUERIED" });
}

export async function admitsMechanicAuthorityInSqlServer({ rootId, mechanicOccurrenceId, mechanicKind, lowererVersion, authorityData, expectedAnalysisDigest, expectedArtifactDigest, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof mechanicOccurrenceId !== "string" || mechanicOccurrenceId.length === 0) throw new Error("mechanicOccurrenceId is required.");
  if (typeof mechanicKind !== "string" || mechanicKind.length === 0) throw new Error("mechanicKind is required.");
  if (typeof lowererVersion !== "string" || lowererVersion.length === 0) throw new Error("lowererVersion is required.");
  if (authorityData === null || typeof authorityData !== "object") throw new Error("authorityData is required.");
  requiresDigest("expectedAnalysisDigest", expectedAnalysisDigest);
  requiresDigest("expectedArtifactDigest", expectedArtifactDigest);
  await validatesDeterministicMechanicAuthority(authorityData, mechanicKind, { mechanicOccurrenceId });
  const payload = { rootId, mechanicOccurrenceId, mechanicKind, lowererVersion, authorityData, expectedAnalysisDigest, expectedArtifactDigest };
  const query = `SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(payload))}; EXEC ingestion.AdmitMechanicAuthority @PayloadJson=@PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const row = lines.find((line) => line.startsWith("M|"));
  if (!row) throw new Error("SQL Server returned no mechanic authority admission result.");
  const [, analysisDigest, occurrenceId, authorityDigest, disposition] = row.split("|");
  if (occurrenceId !== mechanicOccurrenceId) throw new Error("SQL Server mechanic authority admission identity mismatch.");
  return Object.freeze({ rootId, analysisDigest, mechanicOccurrenceId, authorityDigest, disposition });
}

export async function recordsMechanicAuthorityLoweringAttemptInSqlServer({ rootId, mechanicOccurrenceId, mechanicKind, artifactId, expectedAnalysisDigest, expectedArtifactDigest, lowererVersion, loweringDisposition, rejectionReason = null, requiredPrimitive = null, authorityData = null, mode = "DRY_RUN", message = null, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  for (const [name, value] of Object.entries({ rootId, mechanicOccurrenceId, mechanicKind, artifactId, lowererVersion, loweringDisposition, mode })) {
    if (typeof value !== "string" || value.length === 0) throw new Error(`${name} is required.`);
  }
  requiresDigest("expectedAnalysisDigest", expectedAnalysisDigest);
  requiresDigest("expectedArtifactDigest", expectedArtifactDigest);
  if (authorityData !== null) await validatesDeterministicMechanicAuthority(authorityData, mechanicKind, { mechanicOccurrenceId });
  const payload = { rootId, mechanicOccurrenceId, mechanicKind, artifactId, expectedAnalysisDigest, expectedArtifactDigest, lowererVersion, loweringDisposition, rejectionReason, requiredPrimitive, authorityData, mode, message };
  const query = `SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(payload))}; EXEC ingestion.RecordMechanicAuthorityLoweringAttempt @PayloadJson=@PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const row = lines.find((line) => line.startsWith("L|"));
  if (!row) throw new Error("SQL Server returned no mechanic authority lowering-attempt result.");
  const [, analysisDigest, occurrenceId, disposition] = row.split("|");
  if (analysisDigest !== expectedAnalysisDigest || occurrenceId !== mechanicOccurrenceId) throw new Error("SQL Server mechanic authority lowering-attempt identity mismatch.");
  return Object.freeze({ rootId, analysisDigest, mechanicOccurrenceId, disposition });
}

export async function queriesCurrentMechanicAuthorityCandidates({ rootId, mechanicKind = "branch", mechanicOccurrenceId = null, limit = 100, lowererVersion, retryRejected = false, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof mechanicKind !== "string" || mechanicKind.length === 0) throw new Error("mechanicKind is required.");
  if (mechanicOccurrenceId !== null && (typeof mechanicOccurrenceId !== "string" || mechanicOccurrenceId.length === 0)) throw new Error("mechanicOccurrenceId must be a non-empty string or null.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error("limit must be an integer from 1 through 1000.");
  if (typeof lowererVersion !== "string" || lowererVersion.length === 0) throw new Error("lowererVersion is required.");
  const mechanicFilter = mechanicKind === "all" ? "" : ` AND mechanic.MechanicKind=${sqlStringLiteral(mechanicKind)}`;
  const occurrenceFilter = mechanicOccurrenceId === null ? "" : ` AND mechanic.MechanicOccurrenceId=${sqlStringLiteral(mechanicOccurrenceId)}`;
  const retryFilter = retryRejected ? "" : ` AND (mechanic.LoweringDisposition<>'DETERMINISTIC_AUTHORITY_REJECTED' OR mechanic.LowererVersion<>${sqlStringLiteral(lowererVersion)})`;
  const query = `SET NOCOUNT ON; SELECT CONCAT('C|',(SELECT candidate.MechanicOccurrenceId mechanicOccurrenceId,candidate.MechanicKind mechanicKind,candidate.ArtifactId artifactId,candidate.ArtifactDigest artifactDigest,candidate.ExecutionAnalysisDigest executionAnalysisDigest,candidate.StartLine startLine,candidate.StartColumn startColumn,candidate.AuthorityFamily authorityFamily FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) FROM (SELECT TOP (${limit}) mechanic.MechanicOccurrenceId,mechanic.MechanicKind,mechanic.ArtifactId,mechanic.ArtifactDigest,mechanic.ExecutionAnalysisDigest,mechanic.StartLine,mechanic.StartColumn,mechanic.AuthorityFamily FROM projection.CurrentMechanicAuthorityTransformationQueue mechanic WHERE mechanic.RootId=${sqlStringLiteral(rootId)}${mechanicFilter} AND mechanic.AuthorityAdmissionStatus<>'AUTHORITY_ADMITTED' AND mechanic.CurrentPosture='CURRENT_REPOSITORY_IMAGE'${retryFilter}${occurrenceFilter} ORDER BY mechanic.ProjectionBlocking DESC,mechanic.InterfaceReachabilityCount DESC,mechanic.TestReachabilityCount DESC,mechanic.ArtifactId,mechanic.StartLine,mechanic.StartColumn,mechanic.MechanicOccurrenceId) candidate;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  return Object.freeze(lines.filter((line) => line.startsWith("C|")).map((line) => Object.freeze(JSON.parse(line.slice(2)))));
}

function verifiesConnection(connection){if(connection===null||typeof connection!=="object"||typeof connection.buildsArgs!=="function")throw new Error("connection is required (see resolves-sql-connection.js).");}
function requiresDigest(name,value){if(typeof value!=="string"||!/^sha256:[0-9a-f]{64}$/u.test(value))throw new Error(`${name} must be a sha256 digest.`);}
async function runsSqlcmdQuery({connection,sqlcmdPath,query}){const directory=await mkdtemp(path.join(tmpdir(),"source-facts-operational-"));const scriptPath=path.join(directory,"query.sql");try{await writeFile(scriptPath,query,"utf8");return await new Promise((resolve,reject)=>{const child=spawn(sqlcmdPath,[...connection.buildsArgs(),"-i",scriptPath,"-f","65001","-h","-1","-w","8000","-y","8000","-b"],{windowsHide:true,env:connection.appliesToChildEnv({...process.env})});let stdout="",stderr="";child.stdout.on("data",chunk=>{stdout+=chunk;});child.stderr.on("data",chunk=>{stderr+=chunk;});child.on("error",reject);child.on("close",code=>code===0?resolve(stdout.split(/\r?\n/u).map(line=>line.trimEnd()).filter(Boolean)):reject(new Error(`sqlcmd exited with code ${code}: ${(stderr||stdout).trim()}`)));});}finally{await rm(directory,{recursive:true,force:true,maxRetries:5,retryDelay:50});}}
function sqlStringLiteral(value){return `N'${String(value).replaceAll("'","''")}'`;}
