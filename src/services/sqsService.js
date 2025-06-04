const { SQSClient, ListQueuesCommand } = require("@aws-sdk/client-sqs");
const { REGION } = require("../constants");

async function checkSqsConnection() {
  const sqs = new SQSClient({ region: REGION });

  try {
    const result = await sqs.send(new ListQueuesCommand({}));
    console.log("SQS connected. Queues:", result.QueueUrls);
    return true;
  } catch (error) {
    console.error("Error during SQS check", error);
    return error;
  }
}

module.exports = { checkSqsConnection };
