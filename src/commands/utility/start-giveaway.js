"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  ms = require("ms");

module.exports = {
  name: "start-giveaway",
  aliases: ["gstart"],
  description: "Begin a reaction based giveaway.",
  usage: "(Prefix)start-giveaway <Channel Tag> <Time (M/H/D)> <# Of Winners> <Title of Giveaway>",
  category: "Utility",
  execute(message, args, client) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      const noPerms = new MessageEmbed();
      noPerms.setAuthor(
        `${message.client.config.embeds.authorName}`,
        `${message.client.config.embeds.authorIcon}`
      );
      noPerms.setTitle("Start Giveaway");
      noPerms.setDescription(":x: You need to have the manage messages permissions to start giveaways.");
      noPerms.setColor(message.client.config.embeds.embed_color);
      noPerms.setTimestamp();
      noPerms.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [noPerms] });
    }

    let giveawayChannel = message.mentions.channels.first();
    if (!giveawayChannel) {
      const invalidChannel = new MessageEmbed();
      invalidChannel.setAuthor(
        `${message.client.config.embeds.authorName}`,
        `${message.client.config.embeds.authorIcon}`
      );
      invalidChannel.setTitle("Start Giveaway");
      invalidChannel.setDescription(
        ":x: You have to mention a valid channel!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidChannel.setColor(message.client.config.embeds.embed_color);
      invalidChannel.setTimestamp();
      invalidChannel.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [invalidChannel] });
    }

    let giveawayDuration = args[1];
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      const invalidDuration = new MessageEmbed();
      invalidDuration.setAuthor(
        `${message.client.config.embeds.authorName}`,
        `${message.client.config.embeds.authorIcon}`
      );
      invalidDuration.setTitle("Start Giveaway");
      invalidDuration.setDescription(
        ":x: You have to mention a valid duration!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidDuration.setColor(message.client.config.embeds.embed_color);
      invalidDuration.setTimestamp();
      invalidDuration.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [invalidDuration] });
    }

    let giveawayNumberWinners = args[2];
    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      const invalidNumber = new MessageEmbed();
      invalidNumber.setAuthor(
        `${message.client.config.embeds.authorName}`,
        `${message.client.config.embeds.authorIcon}`
      );
      invalidNumber.setTitle("Start Giveaway");
      invalidNumber.setDescription(
        ":x: You have to mention a valid number of winners!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidNumber.setColor(message.client.config.embeds.embed_color);
      invalidNumber.setTimestamp();
      invalidNumber.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [invalidNumber] });
    }

    let giveawayPrize = args.slice(3).join(" ");
    if (!giveawayPrize) {
      const invalidPrize = new MessageEmbed();
      invalidPrize.setAuthor(
        `${message.client.config.embeds.authorName}`,
        `${message.client.config.embeds.authorIcon}`
      );
      invalidPrize.setTitle("Start Giveaway");
      invalidPrize.setDescription(
        ":x: You have to mention a valid prize!  \n Ex. (no brackets): `*start-giveaway [Channel Tag] [Time (M/H/D)] [# Of Winners] [Title of Giveaway]`"
      );
      invalidPrize.setColor(message.client.config.embeds.embed_color);
      invalidPrize.setTimestamp();
      invalidPrize.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [invalidPrize] });
    }

    message.client.giveawaysManager.start(giveawayChannel, {
      duration: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayNumberWinners),
      hostedBy: message.author,
      messages: {
        giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
        giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: "React with 👋  to participate!",
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Tritan Bot",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: `Created by: ${message.author}`,
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false
        }
      }
    });

    const success = new MessageEmbed();
    success.setAuthor(
      `${message.client.config.embeds.authorName}`,
      `${message.client.config.embeds.authorIcon}`
    );
    success.setTitle("Start Giveaway");
    success.setDescription(`A giveaway has been started in ${giveawayChannel}!`);
    success.setColor(message.client.config.embeds.embed_color);
    success.setTimestamp();
    success.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send({ embeds: [success] });
  }
};
