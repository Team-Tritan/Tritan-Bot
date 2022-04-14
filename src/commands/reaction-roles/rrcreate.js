"use strict";

const { MessageEmbed } = require("discord.js"),
  react = require("../../helpers/client/reactionRoles");

module.exports = {
  name: "rrcreate",
  description: "Enable a reaction role on a pre-existing message.",
  usage: "(Prefix)rrcreate <channel id> <message id> <role id> <emoji>",
  category: "Reaction Roles",
  async execute(message, args, client) {
    const channel = args[0];
    const messageid = args[1];
    const roleid = args[2];
    const emoji = args[3];

    if (!channel || !messageid || !roleid || !emoji) {
      let missingArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Setup")
        .setDescription(
          "Please provide the following arguments:\n`*rrcreate <channel id> <message id> <role id> <emoji>`"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [missingArgs] });
    }

    try {
      await react.createrr(client, message.guild.id, messageid, roleid, emoji, "false");
      const m = await client.channels.cache.get(channel).messages.fetch(messageid);
      m.react(emoji);

      let uwu = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reaction Role Setup")
        .setDescription(`Successfully created ${emoji} on message \`${messageid}\` for role <@&${roleid}>.`)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [uwu] });
    } catch {
      return message.channel.send(
        "I was unable to create the reaction role, please double check your arguments and try again."
      );
    }
  }
};
