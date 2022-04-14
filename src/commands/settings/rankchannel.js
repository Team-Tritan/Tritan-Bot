"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "rankchannel",
  description: "Run this command in your rank channel to send level up messages.",
  usage: "(Prefix)rankchannel",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Rank Channel")
        .setDescription("You are not allowed or do not have permission to set the logging channel.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });
    await settings.updateOne({
      rank_channel: message.channel.id
    });

    const log_channel = await message.client.channels.fetch(message.channel.id);
    let create = await log_channel.createWebhook("Tritan Bot: Logging", {
      avatar: `${message.client.config.embeds.authorIcon}`
    });

    const newWebhook = new message.client.models.webhooks({
      _id: mongoose.Types.ObjectId(),
      guildID: message.guild.id,
      channelID: message.channel.id,
      webhookID: create.id,
      webhookSecret: create.token
    });
    await newWebhook
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Rank Channel Updated")
      .setDescription(`The rank channel has been set to <#${message.channel.id}> (${message.channel.name}).`)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
