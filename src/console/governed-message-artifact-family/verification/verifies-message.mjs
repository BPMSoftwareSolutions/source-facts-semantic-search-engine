// @generated
// project-id: governed-message-artifact-family
// feature-id: project-governed-messages
// scenario-id: verify-the-projected-message
// obligation-id: prove-the-message-conforms
// responsibility-id: evaluates-message-proof
// projection-profile-id: javascript-verification-body.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:9e7af8b2fe7a738361a29b0809cb7b2e7eebf4eb893ae6b473748b6e5bce0a04
// body-sha256: sha256:7c7276f2dc4548dfe248afccc4ffd405ce85516947feacbf7c7036aa3b4e9c52
// artifact-provenance-sha256: sha256:17fe5c0495df7b77c44a3db7d7d95089e72b8a41379ee474a25b8821e25bbf84
//
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { projectMessage } from "../src/project-message.mjs";

const value = JSON.parse(readFileSync(new URL("../contracts/message.json", import.meta.url), "utf8"));
assert.equal(projectMessage(value), "{\n  \"message\": \"Schema to contract to artifacts to conformance to trust.\"\n}\n");
process.stdout.write("ARTIFACT_TEST_CONFORMS\n");
