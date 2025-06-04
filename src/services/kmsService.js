const { KMSClient, ListKeysCommand } = require("@aws-sdk/client-kms");
const { REGION } = require("../constants");

async function checkKmsConnection() {
  const kms = new KMSClient({ region: REGION });

  try {
    const result = await kms.send(new ListKeysCommand({}));
    console.log("KMS connected. Keys:", result.Keys);
    return true;
  } catch (error) {
    console.error("Error during KMS check", error);
    return error;
  }
}

module.exports = { checkKmsConnection };
