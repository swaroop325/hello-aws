const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { REGION, TEST_LAMBDA_FUNCTION_NAME } = require("../constants");

const client = new LambdaClient({ region: REGION });

async function checkLambdaConnection() {
  const command = new InvokeCommand({
    FunctionName: TEST_LAMBDA_FUNCTION_NAME,
    InvocationType: "RequestResponse",
    LogType: "None",
  });

  try {
    const response = await client.send(command);
    const rawPayload = new TextDecoder().decode(response.Payload);
    const parsedPayload = JSON.parse(rawPayload);

    console.log("Lambda response:", parsedPayload);

    // Parse the body inside the Lambda response
    const body = JSON.parse(parsedPayload.body);

    return response.StatusCode === 200 && body.message === "Hello from Lambda!";
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return false;
  }
}

module.exports = { checkLambdaConnection };
