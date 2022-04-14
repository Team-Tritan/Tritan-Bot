"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "countingchannel",
  description: "Run this command in the counting channel for Tritan to auto moderate.",
  usage: "(Prefix)countingchannel",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Counting Channel")
        .setDescription("You are not allowed or do not have permission to set the counting channel.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    await settings.updateOne({
      countingChannel: message.channel.id
    });

    await settings.updateOne({
      countingLastNumber: 0
    });

    const newsettings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Counting Channel Updated")
      .setDescription(
        `The counting channel has been set to <#${message.channel.id}> (${
          message.channel.name
        }), your next number should be ${
          newsettings.countingLastNumber + 1
        }.\n\nIf you would like to change the starting number, run ${settings.prefix}currentcount #.`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
