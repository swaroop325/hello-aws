// health.js
const express = require("express");
const { checkDbConnection } = require("../services/dbService");
const { checkS3Connection } = require("../services/s3Service");
const { TEST_RDS, TEST_S3, TEST_REDIS } = require("../constants");
const { checkRedisConnection } = require("../config/redisConfig");

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
  if (TEST_S3 === "true") {
    const s3 = await checkS3Connection();
    if (s3) {
      res
        .status(200)
        .send("Service is UP!! S3 connection is established:: " + s3);
    } else {
      res.status(500).send("S3 Connection Error:: " + s3);
    }
  }
});

router.get("/redis", async (req, res) => {
  if (TEST_REDIS === "true") {
    redisStatus = await checkRedisConnection();
    if (redisStatus) {
      return res.status(200).send("Redis Connection is successfull");
    } else {
      return res.status(500).send("Redis Connection Error");
    }
  }
});

module.exports = router;
