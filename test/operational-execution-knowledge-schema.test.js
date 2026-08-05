import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql=await readFile(new URL("../scripts/sql/022-create-operational-execution-knowledge.sql",import.meta.url),"utf8");

test("joins current image mechanics, call reachability, ownership, tests, and authority without promoting observations",()=>{
  for(const subject of ["observation.RepositoryExecutionAnalysis","projection.CurrentExecutionMechanicOccurrence","projection.CurrentOperationalExecutionKnowledge","projection.CurrentReachableUnownedCallables","projection.CurrentUnreachableRepositoryBodies","projection.CurrentResponsibilityProjectionReadiness","projection.CurrentScenarioExecutionCoverage","projection.CurrentAuthorityCompletionBacklog","projection.CurrentOperationalExecutionSummary"]) assert.match(sql,new RegExp(subject.replace(".","\\."),"u"));
  assert.match(sql,/CANDIDATE_NOT_ADMITTED/u); assert.match(sql,/APPLICABILITY_REVIEW_REQUIRED/u); assert.match(sql,/EXECUTION_ANALYSIS_STALE/u);
  assert.match(sql,/DROP CONSTRAINT FK_RepositoryExecutionAnalysis_Scan/u);
  assert.match(sql,/DROP CONSTRAINT FK_MechanicApplicabilityReview_Mechanic/u);
  assert.match(sql,/SELECT mechanic\.RootId,mechanic\.ApplicationId/u);
  assert.match(sql,/ResolutionDisposition='STATICALLY_RESOLVED'/u);
});
