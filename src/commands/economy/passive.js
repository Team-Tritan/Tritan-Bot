"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "passive",
  description: "Turn on/off passive mode to prevent people from stealing from you.",
  usage: "(Prefix)passive",
  category: "Economy",
  async execute(message) {
    let client = message.client;
    let user = message.author;

    const wallet = await client.models.economy.findOne({ userId: user.id });

    // If on, turn off
    if (wallet.passive_mode) {
      await wallet.updateOne({ $set: { passive_mode: false } });
      let embed = new MessageEmbed()
        .setAuthor(message.author.tag + ` (${user.id})`, user.displayAvatarURL())
        .setDescription(`Passive mode has been turned \`off\`. `)
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    }

    // If off, turn on
    if (!wallet.passive_mode) {
      await wallet.updateOne({ $set: { passive_mode: true } });
      let embed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(`Passive mode has been turned \`on\`, you can't be robbed.`)
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    }
  }
};

module.exports.slash = {
  name: "passive",
  description: "Turn on/off passive mode to prevent people from stealing from you.",
  async execute(client, interaction) {
    let user = interaction.user;

    const wallet = await client.models.economy.findOne({ userId: user.id });

    // If on, turn off
    if (wallet.passive_mode) {
      await wallet.updateOne({ $set: { passive_mode: false } });
      let embed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(`Passive mode has been turned \`off\`. `)
        .setColor(client.config.embeds.embed_color);
      return interaction.reply({ embeds: [embed] });
    }

    // If off, turn on
    if (!wallet.passive_mode) {
      await wallet.updateOne({ $set: { passive_mode: true } });
      let embed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(`Passive mode has been turned \`on\`, you can't be robbed.`)
        .setColor(client.config.embeds.embed_color);
      return interaction.reply({ embeds: [embed] });
    }
  }
};
