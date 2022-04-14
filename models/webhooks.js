const mongoose = require("mongoose");

const webhooksModel = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  channelID: String,
  webhookID: String,
  webhookSecret: String
});

module.exports = mongoose.model("Webhooks", webhooksModel, "Webhooks");
