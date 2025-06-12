const axios = require("axios");

module.exports.config = {
  name: "fbcreate",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: [],
  description: "Create Facebook account using provided email",
  usage: "fbcreate [email]",
  credits: "Dale Mekumi",
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!args[0]) {
    return api.sendMessage(
      "❗ Please provide an email.\n\n📌 Usage: fbcreate hell0w@yopmail.com",
      threadID,
      messageID
    );
  }

  const email = encodeURIComponent(args[0]);

  await api.sendMessage(`🛠️ Creating Facebook account for: ${args[0]}`, threadID, messageID);

  try {
    const response = await axios.get(
      `https://haji-mix.up.railway.app/api/fbcreate?amount=1&email=${email}&api_key=aafe0d9d17114eb257c6b98a02a6047cf0f7e4f5cd956515f2d3f295e8fb8b56`
    );

    const data = response.data;

    if (!data || data.status !== "success") {
      return api.sendMessage(
        `❌ Failed to create Facebook account.\nResponse: ${JSON.stringify(data)}`,
        threadID,
        messageID
      );
    }

    const account = data.result?.[0];

    if (!account) {
      return api.sendMessage("❌ No account data returned.", threadID, messageID);
    }

    const msg = `✅ Facebook Account Created:\n\n📧 Email: ${account.email}\n🔐 Password: ${account.password}\n🆔 UID: ${account.uid}`;

    return api.sendMessage(msg, threadID, messageID);
  } catch (error) {
    console.error("fbcreate command error:", error.message);
    return api.sendMessage(
      `❌ An error occurred: ${error.message}`,
      threadID,
      messageID
    );
  }
};