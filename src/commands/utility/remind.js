"use strict";

const { MessageEmbed } = require("discord.js"),
  ms = require("ms"),
  mongoose = require("mongoose");

module.exports = {
  name: "remind",
  description: "Set a reminder",
  usage: "(Prefix)remind <time (Ex. 10m, 10s, 1d)> <title>",
  aliases: ["rem", "r", "remindme"],
  category: "Utility",

  async execute(message, args, client) {
    let time = args[0];
    if (!time) {
      const timeEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
        .setTitle(":x: Set Reminder")
        .setDescription(
          "Please set an amount of time you would like your reminder to be!\n\n`*remind <time (Ex. 10m, 10s, 1d)> <title>`"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply({ embeds: [timeEmbed] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!args.slice(1).join(" ")) {
      const timeEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
        .setTitle(":x: Set Reminder")
        .setDescription(
          "You need to include a reminder title.\n\n`*remind <time (Ex. 10m, 10s, 1d)> <title>`"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply({ embeds: [timeEmbed] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    const newReminder = new message.client.models.reminders({
      _id: mongoose.Types.ObjectId(),
      active: true,
      authorTag: message.author.tag,
      authorID: message.author.id,
      guildID: message.guild.id,
      reminderText: args.slice(1).join(" "),
      reminderChannelID: message.channel.id,
      reminderTime: Date.now() + ms(time),
      bumpReminder: false
    });

    newReminder.save().then((result) => {
      const reminderID = result.id;

      const reminderSet = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
        .setTitle("Reminder Set!")
        .setDescription(
          `Will do! I'll remind you about \`${args.slice(1).join(" ")}\` in ${ms(ms(time), {
            long: true
          })}.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Reminder ID: ${reminderID}`, message.author.displayAvatarURL());
      message.channel.send({ content: "<@!" + message.author.id + ">", embeds: [reminderSet] });
    });
  }
};

module.exports.slash = {
  name: "remind",
  description: "Set a reminder",
  options: [
    {
      name: "time",
      description: "The amount of time you want to set the reminder for. Example: 2h, 1d, 5m.",
      type: "STRING",
      required: true
    },
    {
      name: "text",
      description: "The text you want to be reminded of.",
      type: "STRING",
      required: true
    }
  ],

  async execute(client, interaction) {
    let time = interaction.options.getString("time");
    let text = interaction.options.getString("text");

    const newReminder = new client.models.reminders({
      _id: mongoose.Types.ObjectId(),
      active: true,
      authorTag: interaction.user.tag,
      authorID: interaction.user.id,
      guildID: interaction.guild.id,
      reminderText: text,
      reminderChannelID: interaction.channel.id,
      reminderTime: Date.now() + ms(time),
      bumpReminder: false
    });

    newReminder.save().then((result) => {
      const reminderID = result.id;

      const reminderSet = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
        .setTitle("Reminder Set!")
        .setDescription(
          `Will do! I'll remind you about \`${text}\` in ${ms(ms(time), {
            long: true
          })}.`
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Reminder ID: ${reminderID}`, interaction.user.displayAvatarURL());
      return interaction.reply({ content: "<@!" + interaction.user.id + ">", embeds: [reminderSet] });
    });
  }
};
