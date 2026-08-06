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
  assert.match(sql,/FROM observation\.RepositoryExecutionAnalysis analysis WITH \(UPDLOCK,HOLDLOCK\)/u);
  assert.match(sql,/FROM fact\.ExecutableMechanic mechanic WITH \(UPDLOCK,HOLDLOCK\)/u);
  assert.match(sql,/@ExpectedAnalysisDigest<>@AnalysisDigest THROW 51095/u);
  assert.match(sql,/@CurrentArtifactDigest,''\)<>@ExpectedArtifactDigest THROW 51096/u);
  assert.match(sql,/SET TRANSACTION ISOLATION LEVEL SERIALIZABLE/u);
  assert.match(sql,/BEGIN TRANSACTION/u);
  assert.match(sql,/WITH \(UPDLOCK,HOLDLOCK\)/u);
  assert.doesNotMatch(sql,/MERGE authority\.MechanicAuthorityAdmission AS target/u);
  assert.match(sql,/MECHANIC_AUTHORITY_ALREADY_ADMITTED/u);
  assert.match(sql,/MECHANIC_AUTHORITY_LEGACY_REPLACED/u);
  assert.match(sql,/A different authority payload is already admitted/u);
  assert.match(sql,/Existing authority carries an unsupported schema identity/u);
  assert.match(sql,/Existing deterministic authority carries an invalid authority basis/u);
  assert.match(sql,/COL_LENGTH\('authority\.MechanicAuthorityAdmission','AuthoritySchemaId'\)/u);
  assert.match(sql,/admission\.AuthoritySchemaId='deterministic-mechanic-authority\.schema\.json'/u);
  assert.match(sql,/@ExistingAuthoritySchemaId='deterministic-branch-authority\.schema\.json'/u);
  assert.match(sql,/typescript-mechanic-authority\.v1/u);
  assert.match(sql,/CREATE TABLE observation\.MechanicAuthorityLoweringAttempt/u);
  assert.match(sql,/CREATE OR ALTER PROCEDURE ingestion\.RecordMechanicAuthorityLoweringAttempt/u);
  assert.match(sql,/CREATE OR ALTER VIEW projection\.CurrentMechanicAuthorityTransformationQueue/u);
  assert.match(sql,/latest\.RejectionReason,latest\.RequiredPrimitive/u);

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
