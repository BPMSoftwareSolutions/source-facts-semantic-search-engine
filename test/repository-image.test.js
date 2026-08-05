import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { capturesRepositoryImage, projectsRepositoryImageToWorkspace, verifiesRepositoryImage } from "../src/repository-image.js";

test("captures scripts, tests, documentation, contracts, lockfiles, and binary content as exact current-state artifacts", async () => {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), "source-facts-image-source-"));
  const outputRoot = path.join(os.tmpdir(), `source-facts-image-output-${Date.now()}`);
  try {
    await writes(sourceRoot, "src/app.mjs", "export const value = 1;\n");
    await writes(sourceRoot, "scripts/sql/load.sql", "SELECT 1;\r\n");
    await writes(sourceRoot, "test/app.test.mjs", "// proof\n");
    await writes(sourceRoot, "docs/design.md", "# Design\n");
    await writes(sourceRoot, "features/app.feature", "Feature: App\n");
    await writes(sourceRoot, "contracts/app.json", "{\"admitted\":true}\n");
    await writes(sourceRoot, "package-lock.json", "{\"lockfileVersion\":3}\n");
    await writes(sourceRoot, "assets/value.bin", Buffer.from([0, 255, 1, 2]));
    await writes(sourceRoot, ".env", "SECRET=do-not-capture\n");
    await writes(sourceRoot, "node_modules/dependency/index.js", "ignored\n");

    const image = await capturesRepositoryImage({ workspaceRoot: sourceRoot, rootId: "fixture-repository" });
    verifiesRepositoryImage(image);
    assert.equal(image.imageType, "repository-current-image.v1");
    assert.deepEqual(image.artifacts.map((artifact) => artifact.relativePath), [
      "assets/value.bin", "contracts/app.json", "docs/design.md", "features/app.feature", "package-lock.json",
      "scripts/sql/load.sql", "src/app.mjs", "test/app.test.mjs",
    ]);
    assert.ok(image.artifacts.every((artifact) => artifact.authorityDisposition === "OBSERVED_NOT_ADMITTED"));
    assert.equal(image.artifacts.find((artifact) => artifact.relativePath === "scripts/sql/load.sql").artifactClass, "operational-script");
    assert.equal(image.artifacts.find((artifact) => artifact.relativePath === "assets/value.bin").encoding, null);

    const receipt = await projectsRepositoryImageToWorkspace(image, outputRoot);
    assert.equal(receipt.disposition, "REPOSITORY_IMAGE_PROJECTED");
    for (const artifact of image.artifacts) {
      assert.deepEqual(await readFile(path.join(outputRoot, ...artifact.relativePath.split("/"))), Buffer.from(artifact.contentBase64, "base64"));
    }
  } finally {
    await rm(sourceRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
    await rm(outputRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

test("repository image projection refuses to overwrite a populated workspace", async () => {
  const sourceRoot = await mkdtemp(path.join(os.tmpdir(), "source-facts-image-source-"));
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), "source-facts-image-output-"));
  try {
    await writes(sourceRoot, "README.md", "source\n");
    await writes(outputRoot, "owned.txt", "preserve\n");
    const image = await capturesRepositoryImage({ workspaceRoot: sourceRoot, rootId: "fixture-repository" });
    await assert.rejects(() => projectsRepositoryImageToWorkspace(image, outputRoot), /must be empty/u);
    assert.equal(await readFile(path.join(outputRoot, "owned.txt"), "utf8"), "preserve\n");
  } finally {
    await rm(sourceRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
    await rm(outputRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});

async function writes(root, relativePath, content) {
  const target = path.join(root, ...relativePath.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}
