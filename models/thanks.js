const mongoose = require("mongoose");

const thanksSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  thanks: Number
});

module.exports = mongoose.model("Thanks", thanksSchema, "Thanks");
