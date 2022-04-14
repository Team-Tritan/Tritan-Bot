"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "report",
  description: "Reports a member, useable by all server members.",
  usage: "(Prefix)report <mention> <reason>",
  category: "Moderation",
  async execute(message, args) {
    let target =
      message.guild.members.cache.get(message.mentions.users.first().id) ||
      message.guild.members.cache.get(args[0]);

    let reason = args.slice(1).join(" ");

    if (!target) return message.reply("please specify a member to report!");
    if (!reason) return message.reply("please specify a reason for this report!");

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });

    if (!settings.event_logs)
      return message.channel.send(
        "A staff member with permission needs to set a logging channel for your report."
      );

    try {
      const newreport = new message.client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        TargetID: target.user.id,
        TargetTag: target.user.tag,
        ModeratorID: message.author.id,
        ModeratorTag: message.author.tag,
        InfractionType: "Report",
        Reason: reason,
        Time: message.createdAt
      });

      newreport.save().then((result) => console.log(result));
    } catch (err) {
      console.error(err);
      return message.reply("I was unable to submit a report for this user, they may have left the guild.");
    }

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🚨 Member Report`)
      .setColor(message.client.config.embeds.embed_color)
      .setThumbnail(target.user.avatarURL)
      .addField("Reported Member:", `${target.user.tag} (ID: ${target.user.id})`)
      .addField("Reported By:", `${message.author.tag} (ID: ${message.author.id})`)
      .addField("Time:", message.createdAt)
      .addField("Channel:", message.channel)
      .addField("Reason", reason)
      .setFooter(`Reported by ${message.author.tag}`, message.author.displayAvatarURL());
    const log_channel = await message.client.channels.fetch(settings.event_logs);
    log_channel.send({ embeds: [embed] });
    return message.channel.send(`${target} was reported for \`${reason}\``);
  }
};
