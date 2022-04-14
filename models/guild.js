const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  guildCreated: String,
  prefix: String,
  is_premium: Boolean,
  is_blacklisted: Boolean,
  event_logs: String,
  join_leave: String,
  rank_channel: String,
  mute_role: String,
  customStatsRole: String,
  badges: String,
  betaGuild: Boolean,
  vanityURL: String,
  vanityRedirect: String,
  disabledBumpReminders: Boolean,
  auto_delete_channel: String,
  auto_delete_keyword: String,
  appeal_link: String,
  antiInvite: Boolean,
  antiLink: Boolean,
  countingChannel: String,
  countingLastNumber: Number,
  cantCountRole: String,
  confessionsChannel: String,
  autoCommandDeletion: {
    type: Boolean,
    default: true
  },
  automod: {
    anti_links: Boolean,
    anti_invites: Boolean,
    anti_scam: Boolean,
    anti_ghostping: Boolean,
    max_mentions: Number,
    max_role_mentions: Number,
    max_lines: Number
  }
});

module.exports = mongoose.model("Guild", guildSchema, "Guilds");
