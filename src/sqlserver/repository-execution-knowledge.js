import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { verifiesRepositoryExecutionKnowledge } from "../repository-execution-knowledge.js";

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
  const query = `SET NOCOUNT ON; SELECT CONCAT('O|',SourceFileCount,'|',CallableCount,'|',CommandCount,'|',ReachabilityRowCount,'|',MechanicCount,'|',TestMechanicCount,'|',InterfaceReachableMechanicCount,'|',ResponsibilityLinkedMechanicCount,'|',ResponsibilityOwnedMechanicCount,'|',TestReachedMechanicCount,'|',AuthorityAdmittedMechanicCount,'|',ReachableUnownedCallableCount,'|',UnreachableCallableCount,'|',AuthorityCompletionBacklogCount,'|',ExecutionAnalysisDisposition) FROM projection.CurrentOperationalExecutionSummary WHERE RootId=${sqlStringLiteral(rootId)};`;
  const lines = await queryRunner({ connection, sqlcmdPath, query }); const row = lines.find((line) => line.startsWith("O|"));
  if (!row) return Object.freeze({ rootId, disposition: "OPERATIONAL_EXECUTION_KNOWLEDGE_MISSING" });
  const [, sourceFileCount, callableCount, commandCount, reachabilityRowCount, mechanicCount, testMechanicCount, interfaceReachableMechanicCount, responsibilityLinkedMechanicCount, responsibilityOwnedMechanicCount, testReachedMechanicCount, authorityAdmittedMechanicCount, reachableUnownedCallableCount, unreachableCallableCount, authorityCompletionBacklogCount, executionAnalysisDisposition] = row.split("|");
  return Object.freeze({ rootId, sourceFileCount:Number(sourceFileCount), callableCount:Number(callableCount), commandCount:Number(commandCount), reachabilityRowCount:Number(reachabilityRowCount), mechanicCount:Number(mechanicCount), testMechanicCount:Number(testMechanicCount), interfaceReachableMechanicCount:Number(interfaceReachableMechanicCount), responsibilityLinkedMechanicCount:Number(responsibilityLinkedMechanicCount), responsibilityOwnedMechanicCount:Number(responsibilityOwnedMechanicCount), testReachedMechanicCount:Number(testReachedMechanicCount), authorityAdmittedMechanicCount:Number(authorityAdmittedMechanicCount), reachableUnownedCallableCount:Number(reachableUnownedCallableCount), unreachableCallableCount:Number(unreachableCallableCount), authorityCompletionBacklogCount:Number(authorityCompletionBacklogCount), executionAnalysisDisposition, disposition:"OPERATIONAL_EXECUTION_KNOWLEDGE_QUERIED" });
}

export async function admitsMechanicAuthorityInSqlServer({ rootId, mechanicOccurrenceId, authorityData, expectedAnalysisDigest = null, expectedArtifactDigest = null, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof mechanicOccurrenceId !== "string" || mechanicOccurrenceId.length === 0) throw new Error("mechanicOccurrenceId is required.");
  if (authorityData === null || typeof authorityData !== "object") throw new Error("authorityData is required.");
  const payload = { rootId, mechanicOccurrenceId, authorityData, ...(expectedAnalysisDigest === null ? {} : { expectedAnalysisDigest }), ...(expectedArtifactDigest === null ? {} : { expectedArtifactDigest }) };
  const query = `SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(payload))}; EXEC ingestion.AdmitMechanicAuthority @PayloadJson=@PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const row = lines.find((line) => line.startsWith("M|"));
  if (!row) throw new Error("SQL Server returned no mechanic authority admission result.");
  const [, analysisDigest, occurrenceId, authorityDigest, disposition] = row.split("|");
  if (occurrenceId !== mechanicOccurrenceId) throw new Error("SQL Server mechanic authority admission identity mismatch.");
  return Object.freeze({ rootId, analysisDigest, mechanicOccurrenceId, authorityDigest, disposition });
}

export async function queriesCurrentMechanicAuthorityCandidates({ rootId, mechanicKind = "branch", mechanicOccurrenceId = null, limit = 100, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof mechanicKind !== "string" || mechanicKind.length === 0) throw new Error("mechanicKind is required.");
  if (mechanicOccurrenceId !== null && (typeof mechanicOccurrenceId !== "string" || mechanicOccurrenceId.length === 0)) throw new Error("mechanicOccurrenceId must be a non-empty string or null.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error("limit must be an integer from 1 through 1000.");
  const occurrenceFilter = mechanicOccurrenceId === null ? "" : ` AND mechanic.MechanicOccurrenceId=${sqlStringLiteral(mechanicOccurrenceId)}`;
  const query = `SET NOCOUNT ON; SELECT CONCAT('C|',(SELECT candidate.MechanicOccurrenceId mechanicOccurrenceId,candidate.MechanicKind mechanicKind,candidate.ArtifactId artifactId,candidate.ArtifactDigest artifactDigest,candidate.ExecutionAnalysisDigest executionAnalysisDigest,candidate.StartLine startLine,candidate.StartColumn startColumn,candidate.AuthorityFamily authorityFamily FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) FROM (SELECT TOP (${limit}) mechanic.MechanicOccurrenceId,mechanic.MechanicKind,mechanic.ArtifactId,mechanic.ArtifactDigest,mechanic.ExecutionAnalysisDigest,mechanic.StartLine,mechanic.StartColumn,mechanic.AuthorityFamily FROM projection.CurrentExecutionMechanicOccurrence mechanic WHERE mechanic.RootId=${sqlStringLiteral(rootId)} AND mechanic.MechanicKind=${sqlStringLiteral(mechanicKind)} AND mechanic.AdmissionDisposition<>'AUTHORITY_ADMITTED'${occurrenceFilter} ORDER BY mechanic.ArtifactId,mechanic.StartLine,mechanic.StartColumn,mechanic.MechanicOccurrenceId) candidate;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  return Object.freeze(lines.filter((line) => line.startsWith("C|")).map((line) => Object.freeze(JSON.parse(line.slice(2)))));
}

function verifiesConnection(connection){if(connection===null||typeof connection!=="object"||typeof connection.buildsArgs!=="function")throw new Error("connection is required (see resolves-sql-connection.js).");}
async function runsSqlcmdQuery({connection,sqlcmdPath,query}){const directory=await mkdtemp(path.join(tmpdir(),"source-facts-operational-"));const scriptPath=path.join(directory,"query.sql");try{await writeFile(scriptPath,query,"utf8");return await new Promise((resolve,reject)=>{const child=spawn(sqlcmdPath,[...connection.buildsArgs(),"-i",scriptPath,"-f","65001","-h","-1","-w","8000","-y","8000","-b"],{windowsHide:true,env:connection.appliesToChildEnv({...process.env})});let stdout="",stderr="";child.stdout.on("data",chunk=>{stdout+=chunk;});child.stderr.on("data",chunk=>{stderr+=chunk;});child.on("error",reject);child.on("close",code=>code===0?resolve(stdout.split(/\r?\n/u).map(line=>line.trimEnd()).filter(Boolean)):reject(new Error(`sqlcmd exited with code ${code}: ${(stderr||stdout).trim()}`)));});}finally{await rm(directory,{recursive:true,force:true,maxRetries:5,retryDelay:50});}}
function sqlStringLiteral(value){return `N'${String(value).replaceAll("'","''")}'`;}
