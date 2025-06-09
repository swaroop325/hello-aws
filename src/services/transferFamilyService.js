const {
  TransferClient,
  DescribeServerCommand,
} = require("@aws-sdk/client-transfer");
const { REGION, TRANSFER_SERVER_ID } = require("../constants");

async function checkTransferFamilyHealth() {
  const client = new TransferClient({ region: REGION });

  try {
    const result = await client.send(
      new DescribeServerCommand({ ServerId: TRANSFER_SERVER_ID })
    );
    console.log("Transfer Family server state:", result?.Server?.State);
    return result?.Server?.State === "ONLINE";
  } catch (err) {
    console.error("Error checking Transfer Family health:", err);
    return false;
  }
}

module.exports = { checkTransferFamilyHealth };
