import { loadsQueryEngineStartResult } from "./query-engine-loader.js";

export async function executeRelationalQuery(index, commandText) {
  if (commandText.length === 0) {
    throw new Error("query is required.");
  }

  const { engine } = await loadsQueryEngineStartResult();
  const request = Object.freeze({
    requestType: "executes-relational-query-request.v1",
    requestId: "source-facts-semantic-query",
    payload: Object.freeze({
      commandText,
      sources: Object.freeze({
        symbols: index.symbols,
        relationships: index.relationships,
        dataflows: index.dataflows,
        sourceReferences: index.sourceReferences,
        documents: index.documents ?? [],
        governanceRules: index.governanceRules ?? [],
        bodyMechanics: index.bodyMechanics ?? [],
      }),
    }),
  });
  return await engine.invoke(request);
}
