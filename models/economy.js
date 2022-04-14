const mongoose = require("mongoose");

const economySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  beg: {
    type: Number
  },
  steal: {
    type: Number
  },
  work: {
    type: Number
  },
  passive_mode: {
    type: Boolean
  }
});

module.exports = mongoose.model("Economy", economySchema, "Economy");
