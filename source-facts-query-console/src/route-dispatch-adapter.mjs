import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { executeSemanticAuthority } from "../../../contract-driven-artifact-governance-engine/lib/semantic-execution-runtime.mjs";

const bundlePath = fileURLToPath(new URL("../contracts/route-dispatch.bundle.json", import.meta.url));
const routeDispatchBundle = JSON.parse(readFileSync(bundlePath, "utf8"));

export function classifiesRoute(routeRequest) {
  return executeSemanticAuthority(routeDispatchBundle, routeRequest);
}
