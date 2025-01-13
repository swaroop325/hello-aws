// health.js
const express = require("express");
const { checkDbConnection } = require("../services/dbService");

const router = express.Router();

// Health check route
router.get("/health", async (req, res) => {
  if (process.env.TEST_RDS === "true") {
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

module.exports = router;
