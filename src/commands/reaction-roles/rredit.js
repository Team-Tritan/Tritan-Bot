"use strict";

const { MessageEmbed } = require("discord.js"),
  react = require("../../helpers/client/reactionRoles");

module.exports = {
  name: "rredit",
  description: "Edit a pre-existing reaction role.",
  usage: "(Prefix)redit <message id> <new role id> <emoji>",
  category: "Reaction Roles",
  async execute(message, args, client) {
    const messageid = args[0];
    const roleid = args[1];
    const emoji = args[2];

    if (!messageid || !roleid || !emoji) {
      let missingArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Editing")
        .setDescription(
          "Please provide the following arguments:\n`*rredit <message id> <new role id> <emoji>`"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [missingArgs] });
    }

    try {
      await react.createrr(client, message.guild.id, messageid, roleid, emoji);
      let uwu = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Editing")
        .setDescription(
          `Successfully edited the reaction role for ${emoji} on message \`${messageid}\` for role <@&${roleid}>.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [uwu] });
    } catch {
      return message.channel.send(
        "I was unable to edit the reaction role, please double check your arguments and try again."
      );
    }
  }
};
