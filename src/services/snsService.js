const { SNSClient, ListTopicsCommand } = require("@aws-sdk/client-sns");
const { REGION } = require("../constants");

async function checkSnsConnection() {
  const sns = new SNSClient({ region: REGION });

  try {
    const result = await sns.send(new ListTopicsCommand({}));
    console.log("SNS connected. Topics:", result.Topics);
    return true;
  } catch (error) {
    console.error("Error during SNS check", error);
    return error;
  }
}

module.exports = { checkSnsConnection };
