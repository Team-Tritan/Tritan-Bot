"use strict";

const Ascii = require("ascii-table"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "automod",
  description: "Shows the status of the automod for this guild.",
  usage: "(prefix)automod",
  category: "automod",
  async execute(message, client) {
    let settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    const { automod } = settings;

    const table = new Ascii("").setHeading("Feature", "Status");
    const logChannel = settings.event_logs
      ? message.guild.channels.cache.get(settings.event_logs).toString()
      : "Not Configured";

    table
      .addRow("Max Lines", automod.max_lines || "Disabled")
      .addRow("Max Mentions", automod.max_mentions || "Disabled")
      .addRow("Max Role Mentions", automod.max_role_mentions || "Disabled")
      .addRow("AntiLinks", automod.anti_links ? "Enabled" : "Disabled")
      .addRow("AntiScam", automod.anti_scam ? "Enabled" : "Disabled")
      .addRow("AntiInvites", automod.anti_invites ? "Enabled" : "Disabled");

    message.channel.send({
      content: `**Log Channel:** ${logChannel}`,
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: message.client.config.embeds.authorName,
            iconURL: message.client.config.embeds.authorIcon
          })
          .setColor(message.client.config.embeds.embed_color)
          .setTimestamp()
          .setTitle("Auto Mod Configuration")
          .setDescription("```" + table.toString() + "```")
          .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
      ]
    });
  }
};
