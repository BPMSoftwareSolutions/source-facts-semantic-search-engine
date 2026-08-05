import assert from "node:assert/strict";
import test from "node:test";
import { refreshesRepositoryLineageSealInSqlServer, validatesRepositoryLineageSealInSqlServer } from "../src/sqlserver/repository-lineage-seal.js";

const connection = { buildsArgs: () => [], appliesToChildEnv: (env) => env };

test("refreshes and validates the current SQL lineage seal without receipt files", async () => {
  let refreshQuery;
  const refreshed = await refreshesRepositoryLineageSealInSqlServer({ rootId: "root", applicationId: "app", connection, queryRunner: async ({ query }) => { refreshQuery = query; return ["R|sha256:seal|REPOSITORY_AUTHORITY_INCOMPLETE|10|1|20|20|400|0|sha256:contract"]; } });
  assert.equal(refreshed.signingDisposition, "DIGEST_SEALED_NOT_SIGNED");
  assert.match(refreshQuery, /projection\.RefreshRepositoryLineageSeal/u);

  let validationQuery;
  const validated = await validatesRepositoryLineageSealInSqlServer({ rootId: "root", connection, queryRunner: async ({ query }) => { validationQuery = query; return ["V|sha256:seal|LINEAGE_SEAL_VALID|REPOSITORY_AUTHORITY_INCOMPLETE|DIGEST_SEALED_NOT_SIGNED|10|1|20|20|400|0|sha256:contract"]; } });
  assert.equal(validated.disposition, "REPOSITORY_LINEAGE_SEAL_VALID");
  assert.match(validationQuery, /projection\.CurrentRepositoryGovernanceClosure/u);
  assert.doesNotMatch(validationQuery, /RepositoryArtifact|RepositorySemanticFact|lineage\.Feature/u);
});
