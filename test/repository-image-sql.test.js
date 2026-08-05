import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage } from "../src/repository-image.js";
import { extractsRepositoryImageFromSqlServer, loadsRepositoryImageIntoSqlServer } from "../src/sqlserver/repository-image.js";

const connection = { buildsArgs: () => [], appliesToChildEnv: (env) => env };

test("loads a digest-verified repository image through the current-state ingestion procedure", async () => {
  const image = await fixtureImage();
  let capturedQuery = null;
  const receipt = await loadsRepositoryImageIntoSqlServer({
    image,
    connection,
    queryRunner: async ({ query }) => {
      capturedQuery = query;
      return [`R|${image.imageDigest}|${image.artifactCount}|${image.totalByteLength}|REPOSITORY_CURRENT_IMAGE_ADMITTED`];
    },
  });
  assert.equal(receipt.disposition, "REPOSITORY_CURRENT_IMAGE_ADMITTED");
  assert.match(capturedQuery, /ingestion\.LoadRepositoryImage/u);
  assert.match(capturedQuery, /contentBase64/u);
});

test("extracts every artifact solely from SQL content rows and verifies the complete image", async () => {
  const image = await fixtureImage();
  const { artifacts, ...header } = image;
  const lines = [`H|0|${encodes(header)}`];
  artifacts.forEach((artifact, ordinal) => {
    const { contentBase64, ...metadata } = artifact;
    lines.push(`A|${ordinal}|0|${encodes(metadata)}`);
    lines.push(`C|${ordinal}|0|${contentBase64}`);
  });
  let capturedQuery = null;
  const extracted = await extractsRepositoryImageFromSqlServer({
    rootId: image.rootId,
    connection,
    queryRunner: async ({ query }) => {
      capturedQuery = query;
      return lines;
    },
  });
  assert.deepEqual(extracted.artifacts, image.artifacts);
  assert.equal(extracted.imageDigest, image.imageDigest);
  assert.match(capturedQuery, /inventory\.RepositoryContent/u);
  assert.match(capturedQuery, /WHERE artifact\.RootId = @RootId/u);
});

async function fixtureImage() {
  const root = await mkdtemp(path.join(os.tmpdir(), "source-facts-sql-image-"));
  try {
    await mkdir(path.join(root, "scripts"), { recursive: true });
    await writeFile(path.join(root, "scripts", "run.mjs"), "export const run = true;\n", "utf8");
    await writeFile(path.join(root, "README.md"), "# Fixture\n", "utf8");
    return await capturesRepositoryImage({ workspaceRoot: root, rootId: "repository-image-sql-fixture" });
  } finally {
    await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
}

function encodes(value) {
  return Buffer.from(JSON.stringify(value), "utf16le").toString("base64");
}
