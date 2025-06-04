// health.js
const express = require("express");
const { checkDbConnection } = require("../services/dbService");
const { checkS3Connection } = require("../services/s3Service");
const { TEST_RDS, TEST_S3, TEST_REDIS, TEST_SES, TEST_SQS, TEST_SNS, TEST_KMS, TEST_EVENTBRIDGE } = require("../constants");
const { checkRedisConnection } = require("../config/redisConfig");
const { checkSesConnection } = require("../services/sesService");
const { checkSnsConnection } = require("../services/snsService");
const { checkSqsConnection } = require("../services/sqsService");
const { checkKmsConnection } = require("../services/kmsService");
const { checkEventBridgeConnection } = require("../services/eventBridgeService");

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
    res.status(200).send("Service is UP!! Definition 9");
  }
});

router.get("/s3", async (req, res) => {
  if (TEST_S3 === "true") {
    res.status(200).json({ "message": "true" })
    try {
      const s3 = await checkS3Connection();
      if (s3) {
        res
          .status(200)
          .send("Service is UP!! S3 connection is established:: " + s3);
      } else {
        res.status(500).send("S3 Connection Error:: " + s3);
      }
    } catch (error) {
      res.status(500).json({ error: error })
    }

  }
  else {
    res.status(500).json({ "message": "false" })
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

router.get("/ses", async (req, res) => {
  if (!TEST_SES) return res.status(200).send("SES check disabled");
  const sesStatus = await checkSesConnection();
  return sesStatus
    ? res.status(200).send("SES Connection is successful")
    : res.status(500).send("SES Connection Error");
});

router.get("/sqs", async (req, res) => {
  if (!TEST_SQS) return res.status(200).send("SQS check disabled");
  const sqsStatus = await checkSqsConnection();
  return sqsStatus
    ? res.status(200).send("SQS Connection is successful")
    : res.status(500).send("SQS Connection Error");
});

router.get("/sns", async (req, res) => {
  if (!TEST_SNS) return res.status(200).send("SNS check disabled");
  const snsStatus = await checkSnsConnection();
  return snsStatus
    ? res.status(200).send("SNS Connection is successful")
    : res.status(500).send("SNS Connection Error");
});

router.get("/kms", async (req, res) => {
  if (!TEST_KMS) return res.status(200).send("KMS check disabled");
  const kmsStatus = await checkKmsConnection();
  return kmsStatus
    ? res.status(200).send("KMS Connection is successful")
    : res.status(500).send("KMS Connection Error");
});

router.get("/eventbridge", async (req, res) => {
  if (!TEST_EVENTBRIDGE) return res.status(200).send("EventBridge check disabled");
  const eventbridgeStatus = await checkEventBridgeConnection();
  return eventbridgeStatus
    ? res.status(200).send("EventBridge Connection is successful")
    : res.status(500).send("EventBridge Connection Error");
});

module.exports = router;


module.exports = router;
