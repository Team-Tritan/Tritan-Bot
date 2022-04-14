"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "snipe",
  aliases: ["ms", "messagesnipe"],
  usage: "(Prefix)snipe",
  description: "Get the last deleted message in a channel",
  category: "Moderation",
  async execute(message, args) {
    const msg = message.client.snipes.get(message.channel.id);
    if (!msg) return message.channel.send("There are no deleted messages in this channel.");

    if (message.client.config.helpers.developer_ids.includes(msg.author_id)) {
      const embed = new MessageEmbed()
        .setDescription(`I can't publish any snipes authored by my active developers.`)
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Last deleted message in #${msg.channel}.`)
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    const embed = new MessageEmbed()
      .setAuthor(`${msg.author} (ID: ${msg.author_id})`, msg.author_avatar)
      .setDescription(msg.content)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Last deleted message in #${msg.channel}.`)
      .setTimestamp();
    if (msg.image) {
      embed.setImage(msg.image);
    }

    return message.channel.send({ embeds: [embed] });
  }
};

module.exports.slash = {
  name: "snipe",
  description: "Get the last deleted message in the channel.",
  async execute(client, interaction) {
    const msg = client.snipes.get(interaction.channel.id);
    if (!msg) return interaction.reply("There are no deleted messages in this channel.");

    if (client.config.helpers.developer_ids.includes(msg.author_id)) {
      const embed = new MessageEmbed()
        .setDescription(`I can't publish any snipes authored by my active developers.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Last deleted message in #${msg.channel}.`)
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new MessageEmbed()
      .setAuthor(`${msg.author} (ID: ${msg.author_id})`, msg.author_avatar)
      .setDescription(msg.content)
      .setColor(client.config.embeds.embed_color)
      .setFooter(`Last deleted message in #${msg.channel}.`)
      .setTimestamp();
    if (msg.image) {
      embed.setImage(msg.image);
    }

    return interaction.reply({ embeds: [embed] });
  }
};
