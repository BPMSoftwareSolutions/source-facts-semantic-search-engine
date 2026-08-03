#!/usr/bin/env node
// @generated
// project-id: governed-message-artifact-family
// feature-id: project-governed-messages
// scenario-id: run-the-message-command
// obligation-id: emit-the-message-once
// responsibility-id: entry-point-for-message-command
// projection-profile-id: javascript-command-body.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:c9117da1186d31ea5c799a86d0bfb3fbd37b70d5f0a6c2f46f1274b7c1816c91
// body-sha256: sha256:f3cfcfa696be55f4bfbefbb191f267fa678051f6e8ebe2539975365c31117ae1
// artifact-provenance-sha256: sha256:7ace53075e2c86a16fccb6cb9bcb016233fc630e0e2155f33a28e86dabee7add
//

import { readFileSync } from "node:fs";
import { projectMessage } from "../src/project-message.mjs";

const input = process.argv[2] ?? new URL("../contracts/message.json", import.meta.url);
const value = JSON.parse(readFileSync(input, "utf8"));
process.stdout.write(projectMessage(value));
