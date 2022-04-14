"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  Levels = require("discord-xp");

module.exports = {
  name: "setxp",
  description: "Set a person's XP",
  usage: "(Prefix)xp <mention> <XP level>",
  category: "Leaderboards",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      let mPermEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Missing Permissions")
        .setDescription(
          "Error, unable to set xp." +
            " <@" +
            message.author.id +
            "> does not have the correct permissions to run this command."
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [mPermEmbed] }).catch(console.error);
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply("You need to mention a user, ID's will not work here.");

    const amount = args[1];
    try {
      Levels.setXp(target.id, message.guild.id, amount);
      let embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setDescription(`**${target.tag}**'s XP has been set to ${amount}.`)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [embed] }).catch(console.error);
    } catch (e) {
      return message.channel.send("Error, please try again. ", e);
    }
  }
};
