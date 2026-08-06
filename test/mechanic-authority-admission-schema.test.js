import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql=await readFile(new URL("../scripts/sql/023-admit-mechanic-authority.sql",import.meta.url),"utf8");

test("admits completed mechanic authority into a queryable table and closes the read-side gap",()=>{
  assert.match(sql,/CREATE TABLE authority\.MechanicAuthorityAdmission/u);
  assert.match(sql,/CHECK \(ISJSON\(AuthorityDataJson\)=1\)/u);
  assert.match(sql,/CHECK \(AdmissionDisposition = 'AUTHORITY_ADMITTED'\)/u);
  assert.match(sql,/CREATE OR ALTER PROCEDURE ingestion\.AdmitMechanicAuthority @PayloadJson nvarchar\(max\)/u);
  assert.match(sql,/MECHANIC_AUTHORITY_ADMITTED/u);
  assert.match(sql,/FROM projection\.CurrentRepositoryExecutionAnalysis\s*\n\s*WHERE RootId=@RootId AND ExecutionAnalysisDisposition='EXECUTION_ANALYSIS_CURRENT'/u);
  assert.match(sql,/FROM projection\.CurrentExecutionMechanicOccurrence\s*\n\s*WHERE SourceFactIndexId=@SourceFactIndexId AND RootId=@RootId AND MechanicOccurrenceId=@MechanicOccurrenceId/u);
  assert.match(sql,/@ExpectedAnalysisDigest<>@AnalysisDigest THROW 51095/u);
  assert.match(sql,/@CurrentArtifactDigest,''\)<>@ExpectedArtifactDigest THROW 51096/u);
  assert.match(sql,/MERGE authority\.MechanicAuthorityAdmission AS target/u);

  assert.match(sql,/COALESCE\(admission\.AdmissionDisposition,'CANDIDATE_NOT_ADMITTED'\) AdmissionDisposition/u);
  assert.doesNotMatch(sql,/'CANDIDATE_NOT_ADMITTED' AdmissionDisposition/u);
  assert.match(sql,/admission\.AuthorityDataJson AdmittedAuthorityDataJson,admission\.AuthorityDigest AdmittedAuthorityDigest/u);
  assert.match(sql,/LEFT JOIN authority\.MechanicAuthorityAdmission admission ON admission\.AnalysisDigest=currentAnalysis\.AnalysisDigest AND admission\.MechanicOccurrenceId=mechanic\.ExecutableMechanicFactId/u);

  assert.match(sql,/CREATE OR ALTER VIEW projection\.CurrentAuthorityCompletionBacklog AS/u);
  assert.match(sql,/FROM projection\.CurrentExecutionMechanicOccurrence mechanic\s*\nWHERE mechanic\.AdmissionDisposition<>'AUTHORITY_ADMITTED'/u);

  assert.doesNotMatch(sql,/CONVERT\(int,0\) AuthorityAdmittedMechanicCount/u);
  assert.match(sql,/COUNT\(DISTINCT CASE WHEN admitted\.MechanicOccurrenceId IS NOT NULL THEN mechanic\.ExecutableMechanicFactId END\) AuthorityAdmittedMechanicCount/u);
  assert.match(sql,/COUNT\(DISTINCT CASE WHEN admitted\.MechanicOccurrenceId IS NULL THEN CONCAT\(COALESCE\(mechanic\.FromSymbolId,mechanic\.ModulePath\),'\|',mechanic\.MechanicKind\) END\) AuthorityCompletionBacklogCount/u);
  assert.match(sql,/LEFT JOIN authority\.MechanicAuthorityAdmission admitted ON admitted\.AnalysisDigest=analysis\.AnalysisDigest AND admitted\.MechanicOccurrenceId=mechanic\.ExecutableMechanicFactId/u);
});
