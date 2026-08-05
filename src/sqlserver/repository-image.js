import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { verifiesRepositoryImage } from "../repository-image.js";

const sqlcmdOutputWidth = 8000;

export async function loadsRepositoryImageIntoSqlServer({ image, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  verifiesRepositoryImage(image);
  const payload = JSON.stringify(image);
  const query = `SET NOCOUNT ON;
DECLARE @PayloadJson nvarchar(max) = ${sqlStringLiteral(payload)};
EXEC ingestion.LoadRepositoryImage @PayloadJson = @PayloadJson;`;
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const result = lines.find((line) => line.startsWith("R|"));
  if (!result) throw new Error("SQL Server returned no repository image load result.");
  const [, imageDigest, artifactCount, totalByteLength, disposition] = result.split("|");
  if (imageDigest !== image.imageDigest) throw new Error("SQL Server repository image identity does not match the requested image.");
  return Object.freeze({ rootId: image.rootId, imageDigest, artifactCount: Number(artifactCount), totalByteLength: Number(totalByteLength), disposition });
}

export async function extractsRepositoryImageFromSqlServer({ rootId, connection, sqlcmdPath = "sqlcmd", queryRunner = runsSqlcmdQuery } = {}) {
  verifiesConnection(connection);
  if (typeof rootId !== "string" || rootId.trim().length === 0) throw new Error("rootId is required.");
  const query = buildsExtractionQuery(rootId);
  const lines = await queryRunner({ connection, sqlcmdPath, query });
  const headerChunks = [];
  const artifactMetadataChunks = new Map();
  const artifactContentChunks = new Map();
  for (const line of lines) {
    const separators = indexesOfSeparators(line, 3);
    if (line.startsWith("H|") && separators.length >= 2) {
      const ordinal = Number(line.slice(2, separators[1]));
      if (ordinal !== headerChunks.length) throw new Error("SQL Server returned repository image header chunks out of order.");
      headerChunks.push(line.slice(separators[1] + 1));
    } else if ((line.startsWith("A|") || line.startsWith("C|")) && separators.length >= 3) {
      const artifactOrdinal = Number(line.slice(2, separators[1]));
      const chunkOrdinal = Number(line.slice(separators[1] + 1, separators[2]));
      const target = line[0] === "A" ? artifactMetadataChunks : artifactContentChunks;
      const chunks = target.get(artifactOrdinal) ?? [];
      if (chunkOrdinal !== chunks.length) throw new Error(`SQL Server returned repository artifact ${artifactOrdinal} chunks out of order.`);
      chunks.push(line.slice(separators[2] + 1));
      target.set(artifactOrdinal, chunks);
    }
  }
  if (headerChunks.length === 0) throw new Error(`No current repository image exists for root '${rootId}'.`);
  const header = JSON.parse(Buffer.from(headerChunks.join(""), "base64").toString("utf16le"));
  const artifacts = [...artifactMetadataChunks.entries()].sort(([left], [right]) => left - right).map(([ordinal, chunks]) => {
    const metadata = JSON.parse(Buffer.from(chunks.join(""), "base64").toString("utf16le"));
    const contentChunks = artifactContentChunks.get(ordinal);
    if (!contentChunks) throw new Error(`SQL Server returned no content for repository artifact '${metadata.relativePath}'.`);
    return { ...metadata, contentBase64: contentChunks.join("") };
  });
  const image = { ...header, artifacts };
  verifiesRepositoryImage(image);
  return Object.freeze(image);
}

function buildsExtractionQuery(rootId) {
  return `SET NOCOUNT ON;
SET ANSI_NULLS ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET QUOTED_IDENTIFIER ON;
SET NUMERIC_ROUNDABORT OFF;
DECLARE @RootId nvarchar(400) = ${sqlStringLiteral(rootId)};
IF NOT EXISTS (SELECT 1 FROM inventory.RepositoryImage WHERE RootId = @RootId) THROW 51020, 'Repository image was not found.', 1;
;WITH HeaderSource AS
(
    SELECT (SELECT image.ImageType AS imageType, image.RootId AS rootId, image.WorkspaceRoot AS workspaceRoot,
                   image.DiscoveryMode AS discoveryMode, image.ImageDigest AS imageDigest,
                   image.ArtifactCount AS artifactCount, image.TotalByteLength AS totalByteLength,
                   JSON_QUERY(image.DirectoriesJson) AS directories
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES) AS JsonValue
    FROM inventory.RepositoryImage image WHERE image.RootId = @RootId
), HeaderEncoded AS
(
    SELECT CAST(N'' AS xml).value('xs:base64Binary(sql:column("BinaryJson"))', 'varchar(max)') AS RowBase64
    FROM (SELECT CONVERT(varbinary(max), JsonValue) AS BinaryJson FROM HeaderSource) encoded
), HeaderChunks AS
(
    SELECT 0 AS ChunkOrdinal, SUBSTRING(RowBase64, 1, 7000) AS Chunk, RowBase64 FROM HeaderEncoded
    UNION ALL SELECT ChunkOrdinal + 1, SUBSTRING(RowBase64, (ChunkOrdinal + 1) * 7000 + 1, 7000), RowBase64
    FROM HeaderChunks WHERE (ChunkOrdinal + 1) * 7000 < LEN(RowBase64)
), ArtifactSource AS
(
    SELECT ROW_NUMBER() OVER (ORDER BY artifact.RelativePath COLLATE Latin1_General_100_BIN2) - 1 AS ArtifactOrdinal, content.Content,
           (SELECT artifact.RelativePath AS relativePath, artifact.ArtifactType AS artifactType,
                   artifact.ArtifactClass AS artifactClass, artifact.MediaType AS mediaType,
                   artifact.Encoding AS encoding, artifact.FileMode AS fileMode,
                   artifact.ByteLength AS byteLength, artifact.ContentDigest AS contentDigest,
                   artifact.AuthorityDisposition AS authorityDisposition
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES) AS MetadataJson
    FROM inventory.RepositoryArtifact artifact
    JOIN inventory.RepositoryContent content ON content.ContentDigest = artifact.ContentDigest
    WHERE artifact.RootId = @RootId
), ArtifactEncoded AS
(
    SELECT ArtifactOrdinal,
           CAST(N'' AS xml).value('xs:base64Binary(sql:column("MetadataBinary"))', 'varchar(max)') AS MetadataBase64,
           CAST(N'' AS xml).value('xs:base64Binary(sql:column("Content"))', 'varchar(max)') AS ContentBase64
    FROM (SELECT ArtifactOrdinal, Content, CONVERT(varbinary(max), MetadataJson) AS MetadataBinary FROM ArtifactSource) encoded
), ArtifactMetadataChunks AS
(
    SELECT ArtifactOrdinal, 0 AS ChunkOrdinal, SUBSTRING(MetadataBase64, 1, 7000) AS Chunk, MetadataBase64
    FROM ArtifactEncoded
    UNION ALL SELECT ArtifactOrdinal, ChunkOrdinal + 1, SUBSTRING(MetadataBase64, (ChunkOrdinal + 1) * 7000 + 1, 7000), MetadataBase64
    FROM ArtifactMetadataChunks WHERE (ChunkOrdinal + 1) * 7000 < LEN(MetadataBase64)
), ArtifactContentChunks AS
(
    SELECT ArtifactOrdinal, 0 AS ChunkOrdinal, SUBSTRING(ContentBase64, 1, 7000) AS Chunk, ContentBase64
    FROM ArtifactEncoded
    UNION ALL SELECT ArtifactOrdinal, ChunkOrdinal + 1, SUBSTRING(ContentBase64, (ChunkOrdinal + 1) * 7000 + 1, 7000), ContentBase64
    FROM ArtifactContentChunks WHERE (ChunkOrdinal + 1) * 7000 < LEN(ContentBase64)
), OutputLines AS
(
    SELECT 0 AS TypeOrdinal, 0 AS ArtifactOrdinal, ChunkOrdinal, CONCAT('H|', ChunkOrdinal, '|', Chunk) AS OutputLine FROM HeaderChunks
    UNION ALL SELECT 1, ArtifactOrdinal, ChunkOrdinal, CONCAT('A|', ArtifactOrdinal, '|', ChunkOrdinal, '|', Chunk) FROM ArtifactMetadataChunks
    UNION ALL SELECT 2, ArtifactOrdinal, ChunkOrdinal, CONCAT('C|', ArtifactOrdinal, '|', ChunkOrdinal, '|', Chunk) FROM ArtifactContentChunks
)
SELECT OutputLine FROM OutputLines ORDER BY TypeOrdinal, ArtifactOrdinal, ChunkOrdinal OPTION (MAXRECURSION 0);`;
}

function indexesOfSeparators(value, maximum) {
  const indexes = [];
  for (let index = 0; index < value.length && indexes.length < maximum; index++) if (value[index] === "|") indexes.push(index);
  return indexes;
}

async function runsSqlcmdQuery({ connection, sqlcmdPath, query }) {
  const workDirectory = await mkdtemp(path.join(tmpdir(), "source-facts-repository-image-"));
  const scriptPath = path.join(workDirectory, "query.sql");
  try {
    await writeFile(scriptPath, query, "utf8");
    return await new Promise((resolve, reject) => {
      const args = [...connection.buildsArgs(), "-i", scriptPath, "-f", "65001", "-h", "-1", "-w", String(sqlcmdOutputWidth), "-y", String(sqlcmdOutputWidth), "-b"];
      const child = spawn(sqlcmdPath, args, { windowsHide: true, env: connection.appliesToChildEnv({ ...process.env }) });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("error", reject);
      child.on("close", (code) => code === 0
        ? resolve(stdout.split(/\r?\n/u).map((line) => line.trimEnd()).filter((line) => line.length > 0))
        : reject(new Error(`sqlcmd exited with code ${code}: ${(stderr || stdout).trim()}`)));
    });
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

function verifiesConnection(connection) {
  if (connection === null || typeof connection !== "object" || typeof connection.buildsArgs !== "function") {
    throw new Error("connection is required (see resolves-sql-connection.js).");
  }
}

function sqlStringLiteral(value) {
  return `N'${String(value).replace(/'/g, "''")}'`;
}
