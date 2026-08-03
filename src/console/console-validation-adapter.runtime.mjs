// @generated
// project-id: serves-query-console
// feature-id: project-console-contract
// scenario-id: project-governed-console-contract
// obligation-id: console-contract-is-projected
// responsibility-id: console-validation-adapter.v1.responsibility.v1
// projection-profile-id: provenance-sealed-source-projector.v1
// semantic-authority-sha256: none
// projection-authority-sha256: sha256:2fc2f89e1ec5402d34ff86655f554b3e8add78a4bc6f6ba07086a86e8e927ad3
// lineage-sha256: sha256:4cd6f3df99b3bc291227e640eb7939dbba45818dd6220d0c7b097866e13aceb2
// body-sha256: sha256:af22a8c405f63481e5815878ffc7c7a2bc67bdac70f04439facc98e8e4705960
// artifact-provenance-sha256: sha256:df9f7469509a8c7787e005035aea7cb3a1e6ec72d401f1bce7b55c8fe122e1e1
//

import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";
import consoleValidationBundle from "./contracts/console-validation.bundle.json" assert { type: "json" };

export function validatesConsoleParameters(parameters) {
  return executeSemanticAuthority(consoleValidationBundle, {
    ...parameters,
    validation: "parameters"
  });
}

export function validatesLoopbackBinding(hostname) {
  return executeSemanticAuthority(consoleValidationBundle, {
    validation: "loopback-binding",
    hostname
  });
}
