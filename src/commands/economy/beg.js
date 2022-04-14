"use strict";

const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose"),
  ms = require("parse-ms");

module.exports = {
  name: "beg",
  category: "Economy",
  description: "Beg for some money if you're too lazy to work today.",
  usage: "(prefix)beg",
  async execute(message, client) {
    let user = message.author;
    let timeout = 39600000;
    let minAmount = 1;
    let maxAmount = 10000;

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

    let amount = await message.client.functions.getRandomInt(minAmount, maxAmount);

    let beg = wallet.beg;
    if (beg !== null && timeout - (Date.now() - beg) > 0) {
      let time = ms(timeout - (Date.now() - beg));

      let timeEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You've already begged today. You can beg again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
        )
        .setColor(message.client.config.embeds.embed_color);

      return message.channel.send({ embeds: [timeEmbed] });
    } else {
      let totalCoins = wallet.balance;

      await wallet.updateOne({ $set: { balance: totalCoins + amount } });

      let moneyEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(`You begged and we provided! You've been given \`${amount}\` coins.`)
        .setColor(message.client.config.embeds.embed_color);

      message.channel.send({ embeds: [moneyEmbed] });

      await wallet.updateOne({ $set: { beg: Date.now() } });
    }
  }
};

module.exports.slash = {
  name: "beg",
  description: "Beg for some money if you're too lazy to work today.",
  async execute(client, interaction) {
    let user = interaction.user;
    let timeout = 39600000;
    let minAmount = 1;
    let maxAmount = 10000;

    const wallet = await client.models.economy.findOne({
      userId: interaction.user.id
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

    let amount = await client.functions.getRandomInt(minAmount, maxAmount);

    let beg = wallet.beg;
    if (beg !== null && timeout - (Date.now() - beg) > 0) {
      let time = ms(timeout - (Date.now() - beg));

      let timeEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You've already begged today. You can beg again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
        )
        .setColor(client.config.embeds.embed_color);

      return interaction.reply({ embeds: [timeEmbed] });
    } else {
      let totalCoins = wallet.balance;

      await wallet.updateOne({ $set: { balance: totalCoins + amount } });

      let moneyEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(`You begged and we provided! You've been given \`${amount}\` coins.`)
        .setColor(client.config.embeds.embed_color);

      interaction.reply({ embeds: [moneyEmbed] });

      await wallet.updateOne({ $set: { beg: Date.now() } });
    }
  }
};
