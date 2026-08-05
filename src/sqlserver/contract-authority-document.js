import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const valueTypes = new Set(["null", "boolean", "number", "string", "array", "object"]);

function digest(value) {
  return `sha256:${createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value), "utf8").digest("hex")}`;
}

function escapesJsonPointerToken(value) {
  return String(value).replaceAll("~", "~0").replaceAll("/", "~1");
}

function valueTypeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function scalarValueOf(value, valueType) {
  if (valueType === "null" || valueType === "array" || valueType === "object") return null;
  return valueType === "string" ? value : JSON.stringify(value);
}

export function projectsContractAuthorityNodes(contract) {
  if (contract === null || typeof contract !== "object" || Array.isArray(contract)) {
    throw new Error("contract must be a JSON object.");
  }
  const nodes = [];
  const visit = (value, { jsonPointer, parentPointer, pathSegment, arrayIndex, siblingOrdinal }) => {
    const valueType = valueTypeOf(value);
    if (!valueTypes.has(valueType)) throw new Error(`Unsupported contract value at '${jsonPointer}': ${valueType}.`);
    const node = {
      nodeOrdinal: nodes.length,
      jsonPointer,
      pointerDigest: digest(jsonPointer),
      parentPointer,
      parentPointerDigest: parentPointer === null ? null : digest(parentPointer),
      pathSegment,
      arrayIndex,
      siblingOrdinal,
      valueType,
      scalarValue: scalarValueOf(value, valueType),
    };
    nodes.push(Object.freeze({ ...node, nodeDigest: digest(node) }));
    if (valueType === "array") {
      value.forEach((child, index) => visit(child, {
        jsonPointer: `${jsonPointer}/${index}`,
        parentPointer: jsonPointer,
        pathSegment: null,
        arrayIndex: index,
        siblingOrdinal: index,
      }));
    } else if (valueType === "object") {
      Object.entries(value).forEach(([key, child], index) => visit(child, {
        jsonPointer: `${jsonPointer}/${escapesJsonPointerToken(key)}`,
        parentPointer: jsonPointer,
        pathSegment: key,
        arrayIndex: null,
        siblingOrdinal: index,
      }));
    }
  };
  visit(contract, { jsonPointer: "", parentPointer: null, pathSegment: null, arrayIndex: null, siblingOrdinal: 0 });
  return Object.freeze(nodes);
}

export function projectsContractAuthorityDocument(contract) {
  const contractNodes = projectsContractAuthorityNodes(contract);
  const canonicalJson = JSON.stringify(contract);
  const authorityDigest = digest(canonicalJson);
  return Object.freeze({
    contractDocument: Object.freeze({
      canonicalJson,
      canonicalByteLength: Buffer.byteLength(canonicalJson, "utf8"),
      authorityDigest,
    }),
    contractNodes,
  });
}

function parsesScalar(row) {
  switch (row.valueType) {
    case "null": return null;
    case "string": return row.scalarValue;
    case "boolean":
      if (row.scalarValue === "true") return true;
      if (row.scalarValue === "false") return false;
      throw new Error(`Contract node '${row.jsonPointer}' has an invalid boolean value.`);
    case "number": {
      const value = JSON.parse(row.scalarValue);
      if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Contract node '${row.jsonPointer}' has an invalid number value.`);
      return value;
    }
    default: throw new Error(`Contract node '${row.jsonPointer}' is not scalar.`);
  }
}

export function reconstructsContractAuthorityDocument(nodes, { expectedDigest = null } = {}) {
  if (!Array.isArray(nodes) || nodes.length === 0) throw new Error("At least one contract authority node is required.");
  const ordered = [...nodes].sort((left, right) => left.nodeOrdinal - right.nodeOrdinal);
  const byPointer = new Map();
  let root = null;

  for (let index = 0; index < ordered.length; index++) {
    const row = ordered[index];
    if (row.nodeOrdinal !== index) throw new Error(`Contract node ordinal ${row.nodeOrdinal} is not contiguous at position ${index}.`);
    if (!valueTypes.has(row.valueType)) throw new Error(`Contract node '${row.jsonPointer}' has unknown value type '${row.valueType}'.`);
    if (byPointer.has(row.jsonPointer)) throw new Error(`Duplicate contract node pointer '${row.jsonPointer}'.`);
    const pointerDigest = digest(row.jsonPointer);
    if (row.pointerDigest !== undefined && row.pointerDigest !== pointerDigest) throw new Error(`Contract node '${row.jsonPointer}' has an invalid pointer digest.`);
    const nodeAuthority = {
      nodeOrdinal: row.nodeOrdinal,
      jsonPointer: row.jsonPointer,
      pointerDigest,
      parentPointer: row.parentPointer,
      parentPointerDigest: row.parentPointer === null ? null : digest(row.parentPointer),
      pathSegment: row.pathSegment,
      arrayIndex: row.arrayIndex,
      siblingOrdinal: row.siblingOrdinal,
      valueType: row.valueType,
      scalarValue: row.scalarValue,
    };
    if (row.nodeDigest !== undefined && row.nodeDigest !== digest(nodeAuthority)) throw new Error(`Contract node '${row.jsonPointer}' has an invalid authority digest.`);
    const value = row.valueType === "object" ? {} : row.valueType === "array" ? [] : parsesScalar(row);

    if (index === 0) {
      if (row.jsonPointer !== "" || row.parentPointer !== null || row.valueType !== "object") {
        throw new Error("The first contract authority node must be the root object.");
      }
      root = value;
    } else {
      const parent = byPointer.get(row.parentPointer);
      if (parent === undefined) throw new Error(`Contract node '${row.jsonPointer}' references missing parent '${row.parentPointer}'.`);
      if (Array.isArray(parent)) {
        if (!Number.isInteger(row.arrayIndex) || row.arrayIndex !== parent.length || row.pathSegment !== null) {
          throw new Error(`Contract array node '${row.jsonPointer}' is out of order or malformed.`);
        }
        parent.push(value);
      } else if (parent !== null && typeof parent === "object") {
        if (typeof row.pathSegment !== "string" || row.arrayIndex !== null || Object.hasOwn(parent, row.pathSegment)) {
          throw new Error(`Contract object node '${row.jsonPointer}' has an invalid or duplicate member.`);
        }
        parent[row.pathSegment] = value;
      } else {
        throw new Error(`Contract node '${row.jsonPointer}' has a scalar parent.`);
      }
    }
    byPointer.set(row.jsonPointer, value);
  }

  const reconstructedDigest = digest(root);
  if (expectedDigest !== null && reconstructedDigest !== expectedDigest) {
    throw new Error(`Reconstructed contract digest ${reconstructedDigest} does not match admitted snapshot ${expectedDigest}.`);
  }
  return Object.freeze({ contract: root, contractSnapshotId: reconstructedDigest, nodeCount: ordered.length });
}

function sqlLiteral(value) {
  return `N'${String(value).replaceAll("'", "''")}'`;
}

async function runsSqlcmdLines({ connection, sqlcmdPath, query }) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-contract-extract-"));
  const scriptPath = path.join(workDirectory, "extract.sql");
  try {
    await writeFile(scriptPath, query, "utf8");
    const stdout = await new Promise((resolve, reject) => {
      const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", "8000", "-y", "8000", "-b"];
      const child = spawn(sqlcmdPath, args, { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
      let childStdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => { childStdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("error", (error) => reject(new Error(`Unable to run sqlcmd: ${error.message}`)));
      child.on("close", (code) => code === 0 ? resolve(childStdout) : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || childStdout).trim()}`)));
    });
    return stdout.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  } finally {
    await rm(workDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
}

export async function extractsContractAuthorityDocumentFromSqlServer({ contractSnapshotId = null, contractId = null, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdLines } = {}) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") throw new Error("connection is required.");
  if ((contractSnapshotId === null) === (contractId === null)) throw new Error("Exactly one of contractSnapshotId or contractId is required.");
  const selector = contractSnapshotId !== null
    ? `snapshot.ContractSnapshotId = ${sqlLiteral(contractSnapshotId)}`
    : `snapshot.ContractId = ${sqlLiteral(contractId)}`;
  const query = `SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;
DECLARE @Snapshot varchar(80) = (SELECT TOP (1) snapshot.ContractSnapshotId FROM authority.ContractSnapshot snapshot WHERE ${selector} ORDER BY snapshot.LoadedAtUtc DESC, snapshot.ContractSnapshotId DESC);
IF @Snapshot IS NULL THROW 51000, 'Contract snapshot was not found.', 1;
SELECT CONCAT('M|', document.ContractSnapshotId, '|', document.CanonicalByteLength, '|', document.AuthorityDigest)
FROM authority.ContractDocument document
WHERE document.ContractSnapshotId = @Snapshot;
;WITH ChunkOffsets AS
(
    SELECT 1 AS StartAt
    UNION ALL
    SELECT StartAt + 2500
    FROM ChunkOffsets
    WHERE StartAt + 2500 <= (SELECT LEN(CanonicalJson) FROM authority.ContractDocument WHERE ContractSnapshotId = @Snapshot)
)
SELECT CONCAT('D|', encoded.ChunkBase64)
FROM ChunkOffsets
CROSS APPLY
(
    SELECT CAST(N'' AS xml).value('xs:base64Binary(sql:column("binaryChunk.Value"))', 'varchar(max)') AS ChunkBase64
    FROM
    (
        SELECT CONVERT(varbinary(max), SUBSTRING(document.CanonicalJson, ChunkOffsets.StartAt, 2500)) AS Value
        FROM authority.ContractDocument document
        WHERE document.ContractSnapshotId = @Snapshot
    ) binaryChunk
) encoded
ORDER BY ChunkOffsets.StartAt
OPTION (MAXRECURSION 0);
;WITH EncodedNodes AS
(
    SELECT node.NodeOrdinal,
           encoded.RowBase64
    FROM authority.ContractNode node
    CROSS APPLY
    (
        SELECT CAST(N'' AS xml).value('xs:base64Binary(sql:column("binaryJson.Value"))', 'varchar(max)') AS RowBase64
        FROM
        (
            SELECT CONVERT(varbinary(max), (
                SELECT node.NodeOrdinal AS nodeOrdinal, node.JsonPointer AS jsonPointer,
                       node.ParentJsonPointer AS parentPointer, node.PathSegment AS pathSegment,
                       node.PointerDigest AS pointerDigest, node.ParentPointerDigest AS parentPointerDigest,
                       node.ArrayIndex AS arrayIndex, node.SiblingOrdinal AS siblingOrdinal,
                       node.ValueType AS valueType, node.ScalarValue AS scalarValue, node.NodeDigest AS nodeDigest
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES
            )) AS Value
        ) binaryJson
    ) encoded
    WHERE node.ContractSnapshotId = @Snapshot
), NodeChunks AS
(
    SELECT NodeOrdinal, 0 AS ChunkOrdinal, SUBSTRING(RowBase64, 1, 7000) AS Chunk, RowBase64
    FROM EncodedNodes
    UNION ALL
    SELECT NodeOrdinal, ChunkOrdinal + 1, SUBSTRING(RowBase64, (ChunkOrdinal + 1) * 7000 + 1, 7000), RowBase64
    FROM NodeChunks
    WHERE (ChunkOrdinal + 1) * 7000 < LEN(RowBase64)
)
SELECT CONCAT('N|', NodeOrdinal, '|', ChunkOrdinal, '|', Chunk)
FROM NodeChunks
ORDER BY NodeOrdinal, ChunkOrdinal
OPTION (MAXRECURSION 0);`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const metadata = lines.find((line) => line.startsWith("M|"))?.split("|") ?? [];
  const [, snapshotId, byteLengthText, authorityDigest] = metadata;
  if (snapshotId === undefined || authorityDigest !== snapshotId) throw new Error("SQL Server returned invalid canonical contract metadata.");
  const documentChunks = lines.filter((line) => line.startsWith("D|")).map((line) => Buffer.from(line.slice(2), "base64"));
  const nodeChunks = new Map();
  for (const line of lines.filter((candidate) => candidate.startsWith("N|"))) {
    const firstSeparator = line.indexOf("|", 2);
    const secondSeparator = line.indexOf("|", firstSeparator + 1);
    const nodeOrdinal = Number.parseInt(line.slice(2, firstSeparator), 10);
    const chunkOrdinal = Number.parseInt(line.slice(firstSeparator + 1, secondSeparator), 10);
    const chunks = nodeChunks.get(nodeOrdinal) ?? [];
    if (chunkOrdinal !== chunks.length) throw new Error(`SQL Server returned contract node ${nodeOrdinal} chunks out of order.`);
    chunks.push(line.slice(secondSeparator + 1));
    nodeChunks.set(nodeOrdinal, chunks);
  }
  if (documentChunks.length === 0 || nodeChunks.size === 0) throw new Error("SQL Server returned incomplete contract authority storage.");
  const canonicalJson = Buffer.concat(documentChunks).toString("utf16le");
  const canonicalByteLength = Buffer.byteLength(canonicalJson, "utf8");
  const expectedByteLength = Number.parseInt(byteLengthText, 10);
  if (canonicalByteLength !== expectedByteLength) throw new Error(`Canonical contract byte length ${canonicalByteLength} does not match SQL authority metadata ${expectedByteLength}.`);
  const canonicalContract = JSON.parse(canonicalJson);
  if (digest(canonicalContract) !== snapshotId) throw new Error("Canonical contract bytes do not match the admitted snapshot digest.");
  const nodes = [...nodeChunks.entries()].sort(([left], [right]) => left - right)
    .map(([, chunks]) => JSON.parse(Buffer.from(chunks.join(""), "base64").toString("utf16le")));
  const reconstructed = reconstructsContractAuthorityDocument(nodes, { expectedDigest: snapshotId });
  if (JSON.stringify(reconstructed.contract) !== canonicalJson) throw new Error("Normalized contract authority is not semantically equal to the canonical contract bytes.");
  return reconstructed;
}
