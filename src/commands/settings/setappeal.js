"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "setappeal",
  description: "Add an appeal link to be sent to members when infractions are given",
  usage: "(Prefix)setappeal [appeal link]",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Appeal Link")
        .setDescription("You are not allowed or do not have permission to set the appeal link.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    const url = args.join(" ");

    if (!url) {
      let noArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(":x: You are missing something!")
        .setDescription(
          `You ran the command, but without adding the appeal link.\n\n**Example:** ${settings.prefix}setappeal https://website.com/appeals`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noArgs] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    if (url) {
      try {
        await settings.updateOne({
          appeal_link: url
        });
      } catch (e) {
        return message.channel.send(
          `There was an error saving this record to the database, please try again.`,
          e
        );
      }

      let success = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Appeal Link")
        .setDescription(`This guild's appeal link has been successfully updated to ${url}.`)
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [success] }).then((m) => setTimeout(() => m.delete(), 5000));
    }
  }
};
