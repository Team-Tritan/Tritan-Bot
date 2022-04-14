"use strict";

const Levels = require("discord-xp"),
  Discord = require("discord.js");

module.exports = {
  name: "resetlb",
  description: "Reset's the leaderboard for your server",
  usage: "(prefix)resetlb",
  category: "Leaderboards",
  async execute(message, args, client) {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
      return message.channel.send(
        ":x: You need to have the manage messages permissions to reset the leaderboard."
      );
    }

    try {
      Levels.deleteGuild(message.guild.id);
    } catch (e) {
      return message.channel.send(":x: | An error has occurred, please report this to my developers.");
    }
    return message.channel.send(":white_check_mark: | The leaderboard has been reset.");
  }
};
