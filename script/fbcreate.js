const axios = require('axios');

module.exports.config = {
  name: 'fbcreate',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['createfb', 'genfb'],
  description: 'Creates a Facebook account using an external API.',
  usage: 'fbcreate <email>',
  credits: 'converted by ChatGPT',
  cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (args.length === 0) {
    return api.sendMessage('Usage: fbcreate <email>', threadID, messageID);
  }

  const email = encodeURIComponent(args[0]); // Ensure valid URL format

  api.sendMessage('Creating Facebook account, please wait...', threadID, async (err, info) => {
    if (err) return;

    try {
      const url = `https://haji-mix.up.railway.app/api/fbcreate?amount=1&email=${email}&api_key=aafe0d9d17114eb257c6b98a02a6047cf0f7e4f5cd956515f2d3f295e8fb8b56`;
      const response = await axios.get(url);
      const result = response.data;

      if (!result.success || !result.data || !result.data[0].account) {
        throw new Error('API did not return valid account data');
      }

      const acc = result.data[0].account;

      const message = 
        `🎉 Facebook Account Created:\n\n` +
        `📧 Email: ${acc.email}\n` +
        `🔐 Password: ${acc.password}\n` +
        `👤 Name: ${acc.name}\n` +
        `🎂 Birthday: ${acc.birthday}\n` +
        `🚻 Gender: ${acc.gender === 'M' ? 'Male' : acc.gender === 'F' ? 'Female' : acc.gender}\n` +
        `✅ Verification: ${acc.verificationRequired ? 'Required' : 'Not Required'}\n` +
        `📩 Message: ${acc.message || 'N/A'}`;

      return api.editMessage(message, info.messageID);
    } catch (error) {
      console.error('fbcreate command error:', error.message);
      return api.editMessage('❌ Error: Failed to create Facebook account.', info.messageID);
    }
  });
};