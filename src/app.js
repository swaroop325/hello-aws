const TEST_RDS = process.env.TEST_RDS || false;

// app.js
const express = require("express");
const { createDbPool } = require("./config/db");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 8080;

// Use health check route
app.use(healthRoutes);

// Start the application
async function startApp() {
  try {
    const pool = await createDbPool();

    // Graceful shutdown handling
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      await pool.end(); // Close the pool
      process.exit(0);
    });

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start the app:", err);
    process.exit(1);
  }
}

startApp();
