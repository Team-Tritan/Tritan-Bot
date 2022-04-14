const mongoose = require("mongoose");

const votesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  numberOfVotes: Number
});

module.exports = mongoose.model("Votes", votesSchema, "Votes");
