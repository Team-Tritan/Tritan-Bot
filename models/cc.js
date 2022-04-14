const mongoose = require("mongoose");

const ccSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  name: String,
  response: String
});

module.exports = mongoose.model("Custom Commands", ccSchema, "Custom Commands");
