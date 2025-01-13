// health.js
const express = require("express");
const { checkDbConnection } = require("../services/dbService");
const { checkS3Connection } = require("../services/s3Service");
const { TEST_RDS, TEST_S3 } = require("../constants");

const router = express.Router();

// Health check route
router.get("/health", async (req, res) => {
  if (TEST_RDS === "true") {
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

router.get("/s3", async (req, res) => {
  if (TEST_S3) {
    const s3 = await checkS3Connection();
    if (isDbHealthy) {
      res
        .status(200)
        .send("Service is UP!! Database connection is established");
    } else {
      res.status(500).send("Database Connection Error");
    }
  }
});

module.exports = router;
