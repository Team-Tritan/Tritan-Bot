const mongoose = require("mongoose");

const remindersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  active: Boolean,
  authorTag: String,
  authorID: String,
  guildID: String,
  reminderText: String,
  reminderTime: Number,
  reminderChannelID: String,
  bumpReminder: Boolean,
  voteReminder: Boolean
});

module.exports = mongoose.model("Reminders", remindersSchema, "Reminders");
