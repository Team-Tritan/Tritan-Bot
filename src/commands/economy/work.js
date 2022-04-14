"use strict";

const { defaultRequestInstrumentationOptions } = require("@sentry/tracing");
const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose"),
  ms = require("parse-ms");

module.exports = {
  name: "work",
  description: "Work for some coins!",
  usage: "(Prefix)work",
  category: "Economy",
  async execute(message) {
    let client = message.client;

    let minAmount = 1;
    let maxAmount = 10000;
    let timeout = 3600000;

    let user = message.author;

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

    let work = wallet.work;
    if (work !== null && timeout - (Date.now() - work) > 0) {
      let time = ms(timeout - (Date.now() - work));

      let timeEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You've already been paid within the hour. You can work again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
        )
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [timeEmbed] });
    } else {
      let amount = await client.functions.getRandomInt(minAmount, maxAmount);

      await wallet.updateOne({ $set: { balance: wallet.balance + amount } });
      await wallet.updateOne({ $set: { work: Date.now() } });
      let moneyEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You just received \`${amount}\` coins for one hour of work, you can work again in 59m.`
        )
        .setColor(client.config.embeds.embed_color);
      return message.channel.send({ embeds: [moneyEmbed] });
    }
  }
};

module.exports.slash = {
  name: "work",
  description: "Work for some coins!",
  async execute(client, interaction) {
    let minAmount = 1;
    let maxAmount = 10000;
    let timeout = 3600000;

    let user = interaction.user;

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

    let work = wallet.work;
    if (work !== null && timeout - (Date.now() - work) > 0) {
      let time = ms(timeout - (Date.now() - work));

      let timeEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You've already been paid within the hour. You can work again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
        )
        .setColor(client.config.embeds.embed_color);
      return interaction.reply({ embeds: [timeEmbed] });
    } else {
      let amount = await client.functions.getRandomInt(minAmount, maxAmount);

      await wallet.updateOne({ $set: { balance: wallet.balance + amount } });
      await wallet.updateOne({ $set: { work: Date.now() } });
      let moneyEmbed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setDescription(
          `You just received \`${amount}\` coins for one hour of work, you can work again in 59m.`
        )
        .setColor(client.config.embeds.embed_color);
      return interaction.reply({ embeds: [moneyEmbed] });
    }
  }
};
