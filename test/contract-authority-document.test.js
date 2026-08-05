import assert from "node:assert/strict";
import test from "node:test";
import {
  extractsContractAuthorityDocumentFromSqlServer,
  projectsContractAuthorityDocument,
  reconstructsContractAuthorityDocument,
} from "../src/sqlserver/contract-authority-document.js";

function fixture() {
  return {
    $schema: "https://canonical.local/contract.schema.json",
    contract: { contractId: "contract.v1", purpose: "canonical → normalized", admitted: true, revision: 1.25, retiredAt: null },
    authority: {
      "path/with~tokens": ["alpha", false, 0, { operation: "normalize", inputs: ["raw"] }],
    },
  };
}

test("normalized contract authority nodes reconstruct the exact admitted semantic document", () => {
  const contract = fixture();
  const projected = projectsContractAuthorityDocument(contract);
  const reconstructed = reconstructsContractAuthorityDocument(projected.contractNodes, {
    expectedDigest: projected.contractDocument.authorityDigest,
  });

  assert.deepEqual(reconstructed.contract, contract);
  assert.equal(JSON.stringify(reconstructed.contract), projected.contractDocument.canonicalJson);
  assert.equal(reconstructed.contractSnapshotId, projected.contractDocument.authorityDigest);
  assert.equal(reconstructed.nodeCount, projected.contractNodes.length);
  assert.ok(projected.contractNodes.some((row) => row.jsonPointer === "/authority/path~1with~0tokens/3/inputs/0"));
});

test("SQL extraction reconstructs authority solely from normalized database rows", async () => {
  const projected = projectsContractAuthorityDocument(fixture());
  const lines = [
    `M|${projected.contractDocument.authorityDigest}|${projected.contractDocument.canonicalByteLength}|${projected.contractDocument.authorityDigest}`,
    `D|${Buffer.from(projected.contractDocument.canonicalJson, "utf16le").toString("base64")}`,
    ...projected.contractNodes.map((row) => `N|${row.nodeOrdinal}|0|${Buffer.from(JSON.stringify(row), "utf16le").toString("base64")}`),
  ];
  let capturedQuery = null;
  const result = await extractsContractAuthorityDocumentFromSqlServer({
    contractId: "contract.v1",
    connection: { buildsArgs: () => [], appliesToChildEnv: (env) => env },
    queryRunner: async ({ query }) => {
      capturedQuery = query;
      return lines;
    },
  });

  assert.deepEqual(result.contract, fixture());
  assert.match(capturedQuery, /FROM authority\.ContractNode/u);
  assert.match(capturedQuery, /FROM authority\.ContractDocument/u);
  assert.match(capturedQuery, /snapshot\.ContractId = N'contract\.v1'/u);
});

test("contract reconstruction fails closed on missing, reordered, or changed normalized authority", () => {
  const projected = projectsContractAuthorityDocument(fixture());
  assert.throws(
    () => reconstructsContractAuthorityDocument(projected.contractNodes.slice(0, -1), { expectedDigest: projected.contractDocument.authorityDigest }),
    /does not match admitted snapshot/u,
  );

  const reordered = structuredClone(projected.contractNodes);
  [reordered[1].nodeOrdinal, reordered[2].nodeOrdinal] = [reordered[2].nodeOrdinal, reordered[1].nodeOrdinal];
  assert.throws(() => reconstructsContractAuthorityDocument(reordered), /invalid authority digest|missing parent|out of order/u);

  const changed = structuredClone(projected.contractNodes);
  changed.find((row) => row.valueType === "string" && row.scalarValue === "alpha").scalarValue = "changed";
  assert.throws(() => reconstructsContractAuthorityDocument(changed), /invalid authority digest/u);
});
