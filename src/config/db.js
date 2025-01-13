// db.js
const { Pool } = require('pg');
const { getRdsPasswordFromSecretsManager } = require('./awsSecretsManager');

async function createDbPool() {
  try {
    const RDS_PASSWORD = await getRdsPasswordFromSecretsManager();

    const pool = new Pool({
      host: process.env.RDS_HOST || 'localhost',
      user: process.env.RDS_USER || 'postgres',
      password: RDS_PASSWORD,
      database: process.env.RDS_DB_NAME || '',
      port: Number(process.env.RDS_PORT || 5432),
      max: 10,  // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      ssl: { rejectUnauthorized: process.env.REJECT_UNAUTHORISED || false },
    });

    return pool;
  } catch (err) {
    console.error('Failed to create DB pool:', err);
    process.exit(1);  // Exit if DB connection fails
  }
}

module.exports = {
  createDbPool,
};
