const { EventBridgeClient, ListEventBusesCommand } = require("@aws-sdk/client-eventbridge");
const { REGION } = require("../constants");

async function checkEventBridgeConnection() {
  const ebClient = new EventBridgeClient({ region: REGION });

  try {
    const result = await ebClient.send(new ListEventBusesCommand({}));
    console.log("EventBridge connected. Event Buses:", result.EventBuses);
    return true;
  } catch (error) {
    console.error("Error during EventBridge check", error);
    return error;
  }
}

module.exports = { checkEventBridgeConnection };
