// @generated
// project-id: governed-message-artifact-family
// feature-id: project-governed-messages
// scenario-id: project-a-declared-message
// obligation-id: produce-one-canonical-message
// responsibility-id: executes-message-projection
// projection-profile-id: javascript-semantic-execution-body.v1
// semantic-authority-sha256: sha256:99e7c4623f2beb14eeb0e56038e4bcfcfef9b6eb9a1fa1d19042f0c8cbe17b9b
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:02577b536a6500ee15f35eaa6535aeb740742567ae39626a042a87c9badc2106
// body-sha256: sha256:86ed7080b7613b3ad28896f6648b30371bf9bd5389b1a891a34c23ceab07370d
// artifact-provenance-sha256: sha256:114aedc46306dba2cd13da296e8b77e958b7943b218361c8890f1664c8201739
//
import { executeSemanticProjection } from "contract-driven-artifact-governance-engine";
import messageSchema from "../contracts/message.schema.json" with { type: "json" };
import projectMessageAuthority from "../contracts/project-message.authority.json" with { type: "json" };

export function projectMessage(value) {
  return executeSemanticProjection(projectMessageAuthority, messageSchema, value);
}
