export function evaluatesExecutableMechanicConformance(report) {
  const violationCount = report?.executionMechanics?.outsideKernelViolations;
  if (!Number.isInteger(violationCount) || violationCount < 0) {
    throw new Error("report.executionMechanics.outsideKernelViolations must be a non-negative integer.");
  }
  return Object.freeze({
    conforms: violationCount === 0,
    violationCount,
    disposition: violationCount === 0
      ? "EXECUTABLE_MECHANIC_KERNEL_BOUNDARY_CONFORMS"
      : "EXECUTABLE_MECHANIC_KERNEL_BOUNDARY_VIOLATION",
  });
}
