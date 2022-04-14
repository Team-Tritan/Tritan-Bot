"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "confessionchannel",
  description: "Select a confessions channel",
  usage: "(Prefix)confessionchannel",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Confession Channel")
        .setDescription("You are not allowed or do not have permission to set the confessions channel.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) =>
        setTimeout(() => {
          m.delete;
        }, 5000)
      );
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    await settings.updateOne({
      confessionsChannel: message.channel.id
    });

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Confession Channel Updated")
      .setDescription(
        `The confessions channel has been set to <#${message.channel.id}> (${message.channel.name}).`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
