const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  messageCount: Number
});

module.exports = mongoose.model("Messages", messagesSchema, "Messages");
