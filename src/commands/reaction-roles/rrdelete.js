"use strict";

const { MessageEmbed } = require("discord.js"),
  react = require("../../helpers/client/reactionRoles");

module.exports = {
  name: "rrdelete",
  description: "Stop listening to reactions on an existing reaction role message",
  usage: "(Prefix)rrdelete <message id> <emoji>",
  category: "Reaction Roles",
  async execute(message, args, client) {
    const messageid = args[0];
    const emoji = args[1];

    if (!messageid || !emoji) {
      let missingArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Removal")
        .setDescription("Please provide the following arguments:\n`*rrdelete <message id> <emoji>`")
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [missingArgs] });
    }

    try {
      await react.deleterr(client, message.guild.id, messageid, emoji);
      let uwu = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Removal")
        .setDescription(
          `Successfully disabled role assignment for ${emoji} on message \`${messageid}\`.\n\nPlease note that you may need to remove the reactions manually.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [uwu] });
    } catch {
      return message.channel.send(
        "I was unable to delete the reaction role, please double check your arguments and try again."
      );
    }
  }
};
