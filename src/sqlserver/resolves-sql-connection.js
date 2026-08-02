// Resolves a SQL Server connection descriptor from either explicit local
// trusted-connection parameters, or an ADO.NET-style connection string held in a
// named environment variable (the shape Azure SQL connection strings use). The
// password never leaves this module as a returned plain field the caller could log
// by accident -- callers get it only via applyToChildEnv, which sets it directly on
// a child_process env object.

export function resolvesTrustedConnection({ server, database }) {
  if (typeof server !== "string" || server.trim().length === 0) throw new Error("server is required for a trusted connection.");
  return Object.freeze({
    mode: "trusted",
    server,
    database,
    buildsArgs: () => ["-S", server, "-E", "-d", database],
    appliesToChildEnv: (env) => env,
  });
}

export function resolvesSqlAuthConnectionFromEnv(envVarName) {
  const connectionString = process.env[envVarName];
  if (typeof connectionString !== "string" || connectionString.trim().length === 0) {
    throw new Error(`Environment variable '${envVarName}' is not set or empty.`);
  }
  const parts = parsesConnectionString(connectionString);
  const server = (parts["server"] ?? "").replace(/^tcp:/iu, "");
  const database = parts["initial catalog"] ?? parts["database"];
  const user = parts["user id"] ?? parts["uid"];
  const password = parts["password"] ?? parts["pwd"];
  if (server.length === 0) throw new Error(`Connection string in '${envVarName}' is missing Server.`);
  if (typeof database !== "string" || database.length === 0) throw new Error(`Connection string in '${envVarName}' is missing Initial Catalog.`);
  if (typeof user !== "string" || user.length === 0) throw new Error(`Connection string in '${envVarName}' is missing User ID.`);
  if (typeof password !== "string" || password.length === 0) throw new Error(`Connection string in '${envVarName}' is missing Password.`);

  return Object.freeze({
    mode: "sql-auth",
    server,
    database,
    buildsArgs: () => ["-S", server, "-U", user, "-d", database, "-N"],
    appliesToChildEnv: (env) => ({ ...env, SQLCMDPASSWORD: password }),
  });
}

function parsesConnectionString(connectionString) {
  const parts = {};
  for (const segment of connectionString.split(";")) {
    const separatorIndex = segment.indexOf("=");
    if (separatorIndex < 0) continue;
    const key = segment.slice(0, separatorIndex).trim().toLowerCase();
    const value = segment.slice(separatorIndex + 1).trim();
    if (key.length > 0) parts[key] = value;
  }
  return parts;
}
