"use strict";

const { MessageEmbed } = require("discord.js"),
  react = require("../../helpers/client/reactionRoles");

module.exports = {
  name: "rrstats",
  description: "Get stats on the reaction role users.",
  usage: "(Prefix)rrstats",
  category: "Reaction Roles",
  async execute(message, args, client) {
    let stats = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Reaction Role Stats")
      .addField("Reaction Roles:", "```" + client.react.size + "```")
      .addField("Fetched Servers:", "```" + client.fetchforguild.size + "```")
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [stats] });
  }
};
