"use strict";

const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "balance",
  aliases: ["bal"],
  category: "Economy",
  description: "Get your economy coin balance!",
  usage: "(prefix)balance <optional mention>",
  async execute(message, client) {
    const user = message.mentions.users.first() || message.author;

    const wallet = await message.client.models.economy.findOne({
      userId: message.author.id
    });

    if (!wallet) {
      const newWallet = new message.client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: user.id,
        balance: 0
      });
      newWallet.save();
      return message.channel.send("A wallet has been created for you, please run this command again.");
    }

    let moneyEmbed = new MessageEmbed()
      .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
      .setDescription(`You have a balance of \`${wallet.balance}\` coins, spend them wisely.`)
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [moneyEmbed] });
  }
};

module.exports.slash = {
  name: "balance",
  description: "Get your economy coin balance!",
  async execute(client, interaction) {
    const user = interaction.user;

    const wallet = await client.models.economy.findOne({
      userId: user.id
    });

    if (!wallet) {
      const newWallet = new client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: user.id,
        balance: 0
      });
      newWallet.save();
      return interaction.reply("A wallet has been created for you, please run this command again.");
    }

    let moneyEmbed = new MessageEmbed()
      .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
      .setDescription(`You have a balance of \`${wallet.balance}\` coins, spend them wisely.`)
      .setColor(client.config.embeds.embed_color);
    return interaction.reply({ embeds: [moneyEmbed] });
  }
};
