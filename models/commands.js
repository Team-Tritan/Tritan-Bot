const mongoose = require("mongoose");

const commandSchema = mongoose.Schema({
  commandName: String,
  timesUsed: Number,
  data: Array
});

module.exports = mongoose.model("Commands", commandSchema, "Commands");
