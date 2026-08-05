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

export async function admitsMechanicAuthorityInSqlServer({ rootId, mechanicOccurrenceId, authorityData, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.length === 0) throw new Error("rootId is required.");
  if (typeof mechanicOccurrenceId !== "string" || mechanicOccurrenceId.length === 0) throw new Error("mechanicOccurrenceId is required.");
  if (authorityData === null || typeof authorityData !== "object") throw new Error("authorityData is required.");
  const payload = { rootId, mechanicOccurrenceId, authorityData };
  const query = `SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(payload))}; EXEC ingestion.AdmitMechanicAuthority @PayloadJson=@PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const row = lines.find((line) => line.startsWith("M|"));
  if (!row) throw new Error("SQL Server returned no mechanic authority admission result.");
  const [, analysisDigest, occurrenceId, authorityDigest, disposition] = row.split("|");
  if (occurrenceId !== mechanicOccurrenceId) throw new Error("SQL Server mechanic authority admission identity mismatch.");
  return Object.freeze({ rootId, analysisDigest, mechanicOccurrenceId, authorityDigest, disposition });
}

function verifiesConnection(connection){if(connection===null||typeof connection!=="object"||typeof connection.buildsArgs!=="function")throw new Error("connection is required (see resolves-sql-connection.js).");}
async function runsSqlcmdQuery({connection,sqlcmdPath,query}){const directory=await mkdtemp(path.join(tmpdir(),"source-facts-operational-"));const scriptPath=path.join(directory,"query.sql");try{await writeFile(scriptPath,query,"utf8");return await new Promise((resolve,reject)=>{const child=spawn(sqlcmdPath,[...connection.buildsArgs(),"-i",scriptPath,"-f","65001","-h","-1","-w","8000","-y","8000","-b"],{windowsHide:true,env:connection.appliesToChildEnv({...process.env})});let stdout="",stderr="";child.stdout.on("data",chunk=>{stdout+=chunk;});child.stderr.on("data",chunk=>{stderr+=chunk;});child.on("error",reject);child.on("close",code=>code===0?resolve(stdout.split(/\r?\n/u).map(line=>line.trimEnd()).filter(Boolean)):reject(new Error(`sqlcmd exited with code ${code}: ${(stderr||stdout).trim()}`)));});}finally{await rm(directory,{recursive:true,force:true,maxRetries:5,retryDelay:50});}}
function sqlStringLiteral(value){return `N'${String(value).replaceAll("'","''")}'`;}
