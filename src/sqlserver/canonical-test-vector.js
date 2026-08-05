import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export async function extractsCanonicalTestVectorFromSqlServer({ rootId, testVectorId, connection, sqlcmdPath="sqlcmd", queryRunner=runsSqlcmdQuery }={}) {
  verifiesConnection(connection);
  const query=`SET NOCOUNT ON;
SET ANSI_NULLS ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON; SET QUOTED_IDENTIFIER ON; SET NUMERIC_ROUNDABORT OFF;
DECLARE @RootId nvarchar(400)=${sqlStringLiteral(rootId)},@TestVectorId nvarchar(200)=${sqlStringLiteral(testVectorId)};
DECLARE @Json nvarchar(max)=(SELECT seal.RootId rootId,image.ImageDigest repositoryImageDigest,testSeal.TestClosureSealDigest testClosureSealDigest,vector.TestVectorId testVectorId,vector.ScenarioId scenarioId,vector.ResponsibilityId responsibilityId,vector.VerifierKind verifierKind,
 JSON_QUERY((SELECT vector.FixtureAuthorityId fixtureAuthorityId,fixture.AuthorityDigest authorityDigest,JSON_QUERY(fixture.FixtureJson) fixture FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) fixture,
 JSON_QUERY((SELECT vector.ExecutionAuthorityId executionAuthorityId,executionAuthority.ModulePath modulePath,executionAuthority.ExportName exportName,executionAuthority.InvocationKind invocationKind,executionAuthority.AuthorityDigest authorityDigest FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) execution,
 JSON_QUERY((SELECT expectation.SignalId signalId,expectation.ExpectedDisposition expectedDisposition,JSON_QUERY(expectation.ExpectationJson) expectation,expectation.AuthorityDigest authorityDigest FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) expectation,
 JSON_QUERY((SELECT profile.ProjectionProfileId projectionProfileId,profile.Framework framework,profile.LanguageId languageId,profile.ProfileVersion profileVersion,profile.ProfileDigest profileDigest FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES)) projectionProfile,
 JSON_QUERY((SELECT requirement.ProofRequirementId proofRequirementId,requirement.RequirementKind requirementKind,requirement.RequirementStatement requirementStatement,requirement.AuthorityDigest authorityDigest FROM testauthority.ProofRequirement requirement WHERE requirement.ContractSnapshotId=vector.ContractSnapshotId AND requirement.TestVectorId=vector.TestVectorId ORDER BY requirement.ProofRequirementId FOR JSON PATH)) proofRequirements
 FROM projection.RepositoryLineageSeal seal JOIN inventory.RepositoryImage image ON image.RootId=seal.RootId JOIN testexecution.RepositoryTestClosureSeal testSeal ON testSeal.RootId=seal.RootId JOIN testauthority.TestVector vector ON vector.ContractSnapshotId=seal.CanonicalIntentContractSnapshotId JOIN testauthority.TestFixture fixture ON fixture.ContractSnapshotId=vector.ContractSnapshotId AND fixture.FixtureAuthorityId=vector.FixtureAuthorityId JOIN testauthority.TestExecutionAuthority executionAuthority ON executionAuthority.ContractSnapshotId=vector.ContractSnapshotId AND executionAuthority.ExecutionAuthorityId=vector.ExecutionAuthorityId JOIN testauthority.TestExpectation expectation ON expectation.ContractSnapshotId=vector.ContractSnapshotId AND expectation.TestVectorId=vector.TestVectorId JOIN testauthority.TestProjectionProfile profile ON profile.ProjectionProfileId=vector.ProjectionProfileId WHERE seal.RootId=@RootId AND vector.TestVectorId=@TestVectorId AND vector.LifecycleStatus='TEST_VECTOR_ADMITTED' FOR JSON PATH,WITHOUT_ARRAY_WRAPPER,INCLUDE_NULL_VALUES);
IF @Json IS NULL THROW 51065,'Current admitted canonical test vector was not found.',1;
SELECT CONCAT('A|',CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@Binary"))','varchar(max)')) FROM (SELECT CONVERT(varbinary(max),@Json) BinaryValue) unused CROSS APPLY (SELECT CONVERT(varbinary(max),@Json) [@Binary]) valueHolder;`;
  // SQL Server cannot bind the alias above through sql:variable, so use a compact
  // base64 expression with sql:column instead.
  const fixedQuery=query.replace(`CAST(N'' AS xml).value('xs:base64Binary(sql:variable("@Binary"))','varchar(max)')`, `CAST(N'' AS xml).value('xs:base64Binary(sql:column("Encoded.BinaryValue"))','varchar(max)')`).replace("FROM (SELECT CONVERT(varbinary(max),@Json) BinaryValue) unused CROSS APPLY (SELECT CONVERT(varbinary(max),@Json) [@Binary]) valueHolder", "FROM (SELECT CONVERT(varbinary(max),@Json) BinaryValue) Encoded");
  const lines=await queryRunner({connection,sqlcmdPath,query:fixedQuery}); const row=lines.find((line)=>line.startsWith("A|")); if(!row) throw new Error("SQL Server returned no canonical test vector authority.");
  return Object.freeze(JSON.parse(Buffer.from(row.slice(2),"base64").toString("utf16le")));
}

export async function recordsCanonicalTestExecutionInSqlServer({ result, connection, sqlcmdPath="sqlcmd", queryRunner=runsSqlcmdQuery }={}) {
  verifiesConnection(connection);
  const query=`SET NOCOUNT ON; DECLARE @PayloadJson nvarchar(max)=${sqlStringLiteral(JSON.stringify(result))}; EXEC ingestion.RecordCanonicalTestExecution @PayloadJson=@PayloadJson;`;
  const lines=await queryRunner({connection,sqlcmdPath,query}); const row=lines.find((line)=>line.startsWith("E|")); if(!row) throw new Error("SQL Server returned no canonical test execution result.");
  const [,testRunId,conformanceDisposition,disposition]=row.split("|"); if(testRunId!==result.testRunId) throw new Error("SQL Server test-run identity mismatch.");
  return Object.freeze({testRunId,conformanceDisposition,disposition});
}

function verifiesConnection(connection){if(connection===null||typeof connection!=="object"||typeof connection.buildsArgs!=="function")throw new Error("connection is required (see resolves-sql-connection.js).");}
async function runsSqlcmdQuery({connection,sqlcmdPath,query}){const directory=await mkdtemp(path.join(tmpdir(),"source-facts-canonical-test-"));const scriptPath=path.join(directory,"query.sql");try{await writeFile(scriptPath,query,"utf8");return await new Promise((resolve,reject)=>{const child=spawn(sqlcmdPath,[...connection.buildsArgs(),"-i",scriptPath,"-f","65001","-h","-1","-w","8000","-y","8000","-b"],{windowsHide:true,env:connection.appliesToChildEnv({...process.env})});let stdout="",stderr="";child.stdout.on("data",(chunk)=>{stdout+=chunk;});child.stderr.on("data",(chunk)=>{stderr+=chunk;});child.on("error",reject);child.on("close",(code)=>code===0?resolve(stdout.split(/\r?\n/u).map((line)=>line.trimEnd()).filter(Boolean)):reject(new Error(`sqlcmd exited with code ${code}: ${(stderr||stdout).trim()}`)));});}finally{await rm(directory,{recursive:true,force:true,maxRetries:5,retryDelay:50});}}
function sqlStringLiteral(value){return `N'${String(value).replaceAll("'","''")}'`;}
