const { Pool } = require("pg");
const express = require("express");

// Create a connection pool using environment variables
const pool = new Pool({
  host: process.env.RDS_HOST || "localhost",   // RDS host
  user: process.env.RDS_USER || "postgres",   // RDS username
  password: process.env.RDS_PASSWORD || "",   // RDS password
  database: process.env.RDS_DB_NAME || "test", // RDS database name
  port: process.env.RDS_PORT || 5432,         // PostgreSQL port
  max: 10,                                    // Maximum number of connections in the pool
  idleTimeoutMillis: 30000,                   // Close idle clients after 30 seconds
  ssl: { rejectUnauthorized: false }, // Use SSL without verifying certificates
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
const PORT = process.env.PORT || 8080;

// Middleware to ensure app handles errors gracefully
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const isDbHealthy = await checkDbConnection();
  if (isDbHealthy) {
    res.status(200).send("Service is UP!! Database connection is established");
  } else {
    res.status(500).send("Database connection error");
  }
});

// Example endpoint with error handling
app.get("/data", async (req, res) => {
  try {
    const client = await pool.connect(); // Acquire a client from the pool
    const result = await client.query("SELECT 1"); // Replace with your query
    client.release(); // Release the client back to the pool
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error querying database:", err.message);
    res.status(500).send("Database error");
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully handle app termination
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await pool.end(); // Close the pool
  process.exit(0);
});
