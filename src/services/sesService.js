const { SESClient, ListIdentitiesCommand } = require("@aws-sdk/client-ses");
const { REGION } = require("../constants");

async function checkSesConnection() {
  const ses = new SESClient({ region: REGION });

  try {
    const result = await ses.send(new ListIdentitiesCommand({}));
    console.log("SES connected. Verified identities:", result.Identities);
    return true;
  } catch (error) {
    console.error("Error during SES Invocation", error);
    return error;
  }
}

module.exports = {
  checkSesConnection,
};
