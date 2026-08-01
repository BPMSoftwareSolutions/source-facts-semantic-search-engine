export function addSourceReference(context) {
  const referenceId = `${context.modulePath}:${context.location.start}:${context.location.length}`;
  if (context.referenceById.has(referenceId)) {
    return Object.freeze({ referenceId });
  }
  const endPosition = calculateEndPosition({
    text: context.sourceText,
    start: context.location.start,
    length: context.location.length,
    line: context.location.line,
    column: context.location.column,
  });
  context.referenceById.add(referenceId);
  const sourceReference = Object.freeze({
    referenceId,
    modulePath: context.modulePath,
    startLine: context.location.line,
    startColumn: context.location.column,
    endLine: endPosition.endLine,
    endColumn: endPosition.endColumn,
    kind: context.kind,
    sourceKind: context.sourceKind,
  });
  context.sourceReferences.push(sourceReference);
  return sourceReference;
}

export function calculateEndPosition({ text, start, length, line, column }) {
  if (length <= 0) {
    return Object.freeze({ endLine: line, endColumn: column });
  }
  const snippet = text.slice(start, start + length);
  let endLine = line;
  let endColumn = column;
  for (let index = 0; index < snippet.length; index++) {
    const next = snippet[index];
    if (next === "\r") {
      if (snippet[index + 1] === "\n") continue;
      endLine += 1;
      endColumn = 1;
      continue;
    }
    if (next === "\n") {
      endLine += 1;
      endColumn = 1;
      continue;
    }
    endColumn += 1;
  }
  return Object.freeze({ endLine, endColumn });
}
