const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  guildid: { type: String },
  msgid: { type: String },
  roleid: { type: String },
  reaction: { type: String },
  dm: { type: Boolean }
});

module.exports = mongoose.model("Reaction Roles", reactionSchema, "Reaction Roles");
