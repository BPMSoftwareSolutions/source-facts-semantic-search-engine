import assert from "node:assert/strict";
import test from "node:test";
import { evaluatesExecutableMechanicConformance } from "../src/governance/evaluates-executable-mechanic-conformance.js";

test("only zero outside-kernel executable mechanics conform", () => {
  const conforming = evaluatesExecutableMechanicConformance({ executionMechanics: { outsideKernelViolations: 0 } });
  assert.deepEqual(conforming, {
    conforms: true,
    violationCount: 0,
    disposition: "EXECUTABLE_MECHANIC_KERNEL_BOUNDARY_CONFORMS",
  });

  const violating = evaluatesExecutableMechanicConformance({ executionMechanics: { outsideKernelViolations: 12 } });
  assert.deepEqual(violating, {
    conforms: false,
    violationCount: 12,
    disposition: "EXECUTABLE_MECHANIC_KERNEL_BOUNDARY_VIOLATION",
  });
});

test("the conformance gate rejects missing or fabricated violation counts", () => {
  assert.throws(() => evaluatesExecutableMechanicConformance({}), /outsideKernelViolations/u);
  assert.throws(() => evaluatesExecutableMechanicConformance({ executionMechanics: { outsideKernelViolations: -1 } }), /outsideKernelViolations/u);
});
