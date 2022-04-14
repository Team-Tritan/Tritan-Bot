"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "disableautodelete",
  description: "Disable auto deletion of messages in a channel.",
  usage: "(Prefix)disableautodelete",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Auto Deletion")
        .setDescription("You are not allowed or do not have permission to set the logging channel.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 10000));
    }
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    if (settings.auto_delete_channel) {
      await settings.updateOne({ auto_delete_channel: null });
    }

    let disabled = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Auto Deletion Disabled")
      .setDescription(`The auto deletion channel has been disabled for this guild.`)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [disabled] });
  }
};
