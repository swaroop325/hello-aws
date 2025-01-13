const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { REGION, BUCKET_NAME } = require("../constants");
const s3Client = new S3Client({ region: REGION });

async function checkS3Connection() {
  try {
    // S3 object listing
    const command = new ListObjectsCommand({ Bucket: BUCKET_NAME });
    const data = await s3Client.send(command);

    // Extract object keys (names)
    const objects = data.Contents?.map((item) => item.Key) || [];

    return objects;
  } catch (error) {
    console.error("Error during S3 Invocation", error);
    return error;
  }
}

module.exports = {
  checkS3Connection,
};
