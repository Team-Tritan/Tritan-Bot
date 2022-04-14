"use strict";

const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose"),
  ms = require("parse-ms");

module.exports = {
  name: "steal",
  description: "Steal's a random amount of someone else's coins!",
  usage: "(Prefix)steal <mention or ID>",
  category: "Economy",
  async execute(message, args) {
    let client = message.client;
    let timeout = 39600000;

    if (!args[0]) {
      let noArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`:x: No Arguments`)
        .setDescription(
          `You need to mention a user or use a user ID while running this command. Run \`*help steal\` for more info.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [noArgs] });
    }

    let user = message.mentions.users.first() || (await message.client.users.fetch(args[0]));

    if (!user) {
      let noUser = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`:x: Unable to Find User`)
        .setDescription(`I was unable to find that user, are you sure they're in this guild?`)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [noUser] });
    }

    const targetWallet = await client.models.economy.findOne({
      userId: user.id
    });
    if (!targetWallet) {
      const newWallet = new message.client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: user.id,
        balance: 0
      });
      newWallet.save();
      return message.channel.send(
        "A wallet has been created for your target, please run this command again."
      );
    }

    if (targetWallet.passive_mode) {
      let embed = new MessageEmbed()
        .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
        .setDescription(`The person you tried to steal from is in passive mode, pick someone else.`)
        .setColor(client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    }

    const robberWallet = await client.models.economy.findOne({
      userId: message.author.id
    });
    if (!robberWallet) {
      const newWallet = new message.client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: message.author.id,
        balance: 0
      });
      newWallet.save();
      return message.channel.send("A wallet has been created for you, please run this command again.");
    }

    if (user) {
      let steal = robberWallet.steal;
      if (steal !== null && timeout - (Date.now() - steal) > 0) {
        let time = ms(timeout - (Date.now() - steal));
        let timeEmbed = new MessageEmbed()
          .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
          .setDescription(
            `You've already stole from someone today! You can try again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
          )
          .setColor(message.client.config.embeds.embed_color);
        return message.channel.send({ embeds: [timeEmbed] });
      }

      if (targetWallet.balance < 1) {
        let brokebitch = new MessageEmbed()
          .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
          .setDescription(`You shouldn't steal from the poor, they don't have enough to steal from!`)
          .setColor(client.config.embeds.embed_color);
        return message.channel.send({ embeds: [brokebitch] });
      }

      if (!targetWallet) {
        let noWallet = new MessageEmbed()
          .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
          .setDescription(`The person you tried to steal from does not have a wallet.`)
          .setColor(client.config.embeds.embed_color);
        return message.channel.send({ embeds: [noWallet] });
      }

      const stolenAmount = await client.functions.getRandomInt(1, targetWallet.balance);

      try {
        await targetWallet.updateOne({
          balance: targetWallet.balance - stolenAmount
        });
      } catch (error) {
        return message.channel.send(`There has been an internal error. ${error}`);
      }

      try {
        await robberWallet.updateOne({
          balance: robberWallet.balance + stolenAmount
        });
      } catch (error) {
        return message.channel.send(`There has been an internal error. ${error}`);
      }

      let stolen = new MessageEmbed()
        .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
        .setDescription(`You just stole \`${stolenAmount}\` coins from ${user.tag}!`)
        .setColor(client.config.embeds.embed_color);

      await robberWallet.updateOne({ $set: { steal: Date.now() } });

      return message.channel.send({ embeds: [stolen] });
    }
  }
};

module.exports.slash = {
  name: "steal",
  description: "Turn on/off passive mode to prevent people from stealing from you.",
  options: [
    {
      name: "user",
      description: "The user to steal from",
      type: "USER",
      required: true
    }
  ],
  async execute(client, interaction) {
    await interaction.deferReply();

    let timeout = 39600000;

    let user = interaction.options.getUser("user");

    const targetWallet = await client.models.economy.findOne({
      userId: user.id
    });
    if (!targetWallet) {
      const newWallet = new client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: user.id,
        balance: 0
      });
      newWallet.save();
      return interaction.followUp(
        "A wallet has been created for your target, please run this command again."
      );
    }

    if (targetWallet.passive_mode) {
      let embed = new MessageEmbed()
        .setAuthor(interaction.user.tag + ` (${interaction.user.id})`, interaction.user.displayAvatarURL())
        .setDescription(`The person you tried to steal from is in passive mode, pick someone else.`)
        .setColor(client.config.embeds.embed_color);
      return interaction.followUp({ embeds: [embed] });
    }

    const robberWallet = await client.models.economy.findOne({
      userId: interaction.user.id
    });
    if (!robberWallet) {
      const newWallet = new message.client.models.economy({
        _id: mongoose.Types.ObjectId(),
        userId: interaction.user.id,
        balance: 0
      });
      newWallet.save();
      return interaction.followUp("A wallet has been created for you, please run this command again.");
    }

    if (user) {
      let steal = robberWallet.steal;
      if (steal !== null && timeout - (Date.now() - steal) > 0) {
        let time = ms(timeout - (Date.now() - steal));
        let timeEmbed = new MessageEmbed()
          .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
          .setDescription(
            `You've already stole from someone today! You can try again in ${time.hours}h ${time.minutes}m ${time.seconds}s. `
          )
          .setColor(client.config.embeds.embed_color);
        return interaction.followUp({ embeds: [timeEmbed] });
      }

      if (targetWallet.balance < 1) {
        let brokebitch = new MessageEmbed()
          .setAuthor(interaction.user.tag + ` (${interaction.user.id})`, interaction.user.displayAvatarURL())
          .setDescription(`You shouldn't steal from the poor, they don't have enough to steal from!`)
          .setColor(client.config.embeds.embed_color);
        return interaction.followUp({ embeds: [brokebitch] });
      }

      if (!targetWallet) {
        let noWallet = new MessageEmbed()
          .setAuthor(interaction.user.tag + ` (${interaction.user.id})`, interaction.user.displayAvatarURL())
          .setDescription(`The person you tried to steal from does not have a wallet.`)
          .setColor(client.config.embeds.embed_color);
        return interaction.reply({ embeds: [noWallet] });
      }

      const stolenAmount = await client.functions.getRandomInt(1, targetWallet.balance);

      try {
        await targetWallet.updateOne({
          balance: targetWallet.balance - stolenAmount
        });
      } catch (error) {
        return interaction.reply(`There has been an internal error. ${error}`);
      }

      try {
        await robberWallet.updateOne({
          balance: robberWallet.balance + stolenAmount
        });
      } catch (error) {
        return interaction.reply(`There has been an internal error. ${error}`);
      }

      let stolen = new MessageEmbed()
        .setAuthor(interaction.user.tag + ` (${interaction.user.id})`, interaction.user.displayAvatarURL())
        .setDescription(`You just stole \`${stolenAmount}\` coins from ${user.tag}!`)
        .setColor(client.config.embeds.embed_color);

      await robberWallet.updateOne({ $set: { steal: Date.now() } });

      return interaction.reply({ embeds: [stolen] });
    }
  }
};
