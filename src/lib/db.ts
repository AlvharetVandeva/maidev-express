import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

function missingDatabaseUrl(): never {
  throw new Error("DATABASE_URL is not defined");
}

export const sql = connectionString
  ? postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : (missingDatabaseUrl as unknown as ReturnType<typeof postgres>);
