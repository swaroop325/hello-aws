const REGION = process.env.AWS_REGION || "ap-southeast-1";

const PORT = process.env.PORT || 8080;

const TEST_RDS = process.env.TEST_RDS || false;
const RDS_PASSWORD = process.env.RDS_PASSWORD || "";
const RDS_HOST = process.env.RDS_HOST || "localhost";
const RDS_USER = process.env.RDS_USER || "postgres";
const RDS_DB_NAME = process.env.RDS_DB_NAME || "";
const RDS_PORT = Number(process.env.RDS_PORT || 5432);
const REJECT_UNAUTHORISED = process.env.REJECT_UNAUTHORISED || false;
const BUCKET_NAME = process.env.BUCKET_NAME || "";

const TEST_S3 = process.env.TEST_S3 || false;
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
};
