import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("../contracts/loopback-bind.bundle.json", import.meta.url));
const loopbackBindBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

export function classifiesLoopbackBind(loopbackBindRequest) {
  return executeSemanticAuthority(loopbackBindBundle, loopbackBindRequest);
}
