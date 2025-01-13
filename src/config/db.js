// db.js
const { Pool } = require("pg");
const { getRdsPasswordFromSecretsManager } = require("./awsSecretManager");
const {
  RDS_HOST,
  RDS_USER,
  RDS_DB_NAME,
  RDS_PORT,
  REJECT_UNAUTHORISED,
} = require("../constants");

async function createDbPool() {
  try {
    const RDS_PASSWORD = await getRdsPasswordFromSecretsManager();

    const pool = new Pool({
      host: RDS_HOST || "localhost",
      user: RDS_USER || "postgres",
      password: RDS_PASSWORD,
      database: RDS_DB_NAME || "",
      port: RDS_PORT,
      max: 10, // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      ssl: { rejectUnauthorized: REJECT_UNAUTHORISED },
    });

    return pool;
  } catch (err) {
    console.error("Failed to create DB pool:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

module.exports = {
  createDbPool,
};
