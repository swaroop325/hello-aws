

// app.js
const express = require("express");
const healthRoutes = require("./routes/health");
const { PORT } = require("./constants");

const app = express();


// Use health check route
app.use(healthRoutes);

// Start the application
async function startApp() {
  try {

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
