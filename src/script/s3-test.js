const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Readable } = require("stream");

const REGION = process.env.AWS_REGION || "ap-southeast-1";
const BUCKET_NAME = process.env.BUCKET_NAME || "cloudbox-workload-test-sara";

const s3 = new S3Client({ region: REGION });

async function uploadObject() {
  const content = "Hello from ECS Transfer Family test!";
  const key = "health-test-v2.txt";

  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: content,
  });

  await s3.send(putCommand);
  console.log(`✅ Uploaded: ${key}`);
  return key;
}

async function downloadObject(key) {
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3.send(getCommand);
  const body = await streamToString(response.Body);
  console.log(`✅ Downloaded: ${key}`);
  console.log(`📄 Content: ${body}`);
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

(async () => {
  try {
    const key = await uploadObject();
    await downloadObject(key);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
