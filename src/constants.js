require("dotenv").config();

const REGION = process.env.AWS_REGION || "ap-southeast-1";
const PORT = Number(process.env.PORT) || 8080;

// RDS
const TEST_RDS = process.env.TEST_RDS || false;
const RDS_PASSWORD = process.env.RDS_PASSWORD || "";
const RDS_HOST = process.env.RDS_HOST || "localhost";
const RDS_USER = process.env.RDS_USER || "postgres";
const RDS_DB_NAME = process.env.RDS_DB_NAME || "";
const RDS_PORT = Number(process.env.RDS_PORT || 5432);
const REJECT_UNAUTHORISED = process.env.REJECT_UNAUTHORISED || false;
const TEST_LAMBDA = process.env.TEST_LAMBDA || "false";
const TEST_LAMBDA_FUNCTION_NAME = process.env.TEST_LAMBDA_FUNCTION_NAME;

// S3
// const TEST_S3 = process.env.TEST_S3 || false;
// const BUCKET_NAME = process.env.BUCKET_NAME || "";
const TEST_S3 = process.env.TEST_S3;

//transfer-family
const BUCKET_NAME = process.env.BUCKET_NAME || "";
const TRANSFER_SERVER_ID = process.env.TRANSFER_SERVER_ID;

// REDIS
const TEST_REDIS = process.env.TEST_REDIS || false;
const REDIS_HOST = process.env.REDIS_HOST || false;
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

const TEST_SES = false;
const TEST_SQS = false;
const TEST_SNS = true;
const TEST_KMS = false;
const TEST_EVENTBRIDGE = true;

module.exports = {
  REGION,
  TEST_RDS,
  PORT,
  RDS_PASSWORD,
  RDS_USER,
  RDS_HOST,
  TEST_S3,
  RDS_DB_NAME,
  RDS_PORT,
  REJECT_UNAUTHORISED,
  BUCKET_NAME,
  TEST_REDIS,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  TEST_KMS,
  TEST_SES,
  TEST_SNS,
  TEST_SQS,
  TEST_EVENTBRIDGE,
  TRANSFER_SERVER_ID,
  TEST_LAMBDA,
  TEST_LAMBDA_FUNCTION_NAME,
};
