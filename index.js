const { Pool } = require("pg");
const express = require("express");

const PORT = process.env.PORT || 8080;
const RDS_HOST = process.env.RDS_HOST || "localhost";
const RDS_PASSWORD = process.env.RDS_PASSWORD || "";
const RDS_DB_NAME = process.env.RDS_DB_NAME || "";
const RDS_PORT = process.env.RDS_PORT || 5432;
const RDS_USER = process.env.RDS_USER || "postgres";
const REJECT_UNAUTHORISED = process.env.REJECT_UNAUTHORISED || false;

const TEST_RDS = process.env.TEST_RDS || "false";

const pool = new Pool({
  host: RDS_HOST,
  user: RDS_USER,
  password: RDS_PASSWORD,
  database: RDS_DB_NAME,
  port: Number(RDS_PORT),
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  ssl: { rejectUnauthorized: REJECT_UNAUTHORISED }, // Use SSL without verifying certificates
});

// Function to check database connection health
async function checkDbConnection() {
  try {
    const client = await pool.connect(); // Attempt to acquire a client
    await client.query("SELECT 1"); // Simple query to test connection
    client.release(); // Release client back to the pool
    console.log("Database connection is healthy");
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);
    return false;
  }
}

// Set up Express app
const app = express();

// Middleware to ensure app handles errors gracefully
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  if (TEST_RDS) {
    const isDbHealthy = await checkDbConnection();
    if (isDbHealthy) {
      res
        .status(200)
        .send("Service is UP!! Database connection is established");
    } else {
      res.status(500).send("Database Connection Error");
    }
  } else {
    res.status(200).send("Service is UP!!");
  }
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully handle app termination
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await pool.end(); // Close the pool
  process.exit(0);
});
