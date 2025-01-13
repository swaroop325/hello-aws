// awsSecretsManager.js
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

// Initialize the Secrets Manager client
const secretsClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || "ap-southeast-1",
});

async function getRdsPasswordFromSecretsManager() {
  try {
    // Fetch the secret
    const command = new GetSecretValueCommand({
      SecretId: process.env.RDS_PASSWORD, // Secret name from the environment variable
    });

    const data = await secretsClient.send(command);

    if (data.SecretString) {
      // Parse JSON secret and return the password
      const secret = JSON.parse(data.SecretString);
      return secret.password; // Adjust this based on how the password is stored in your secret
    } else {
      // Handle binary secret (less common for passwords)
      const buff = Buffer.from(data.SecretBinary, "base64");
      return buff.toString("ascii");
    }
  } catch (err) {
    console.error("Error fetching secret from AWS Secrets Manager:", err);
    throw err;
  }
}

module.exports = {
  getRdsPasswordFromSecretsManager,
};
