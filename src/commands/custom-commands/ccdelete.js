"use strict";

const mongoose = require("mongoose"),
  discord = require("discord.js");

module.exports = {
  name: "ccdelete",
  description: "Remove a custom command from your guild.",
  usage: "(Prefix)ccdelete <command id>",
  category: "Custom Commands",
  async execute(message, args) {
    const client = message.client;

    if (!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_GUILD)) {
      return message
        .reply("You don't have enough permission to run this command.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let id = args[0];
    if (!id) {
      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Delete Custom Command`)
        .setDescription(
          "You are missing an argument for this command. To get the command ID, run *cclist. \n\nExample: *ccremove <command id>"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      return message.channel.send({ embeds: [embed] });
    }

    try {
      await client.models.cc.findOneAndDelete({ _id: id });

      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Delete Custom Command`)
        .setDescription(`Custom command with ID \`${id}\` has been removed.`)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      return message.channel.send({ embeds: [embed] });
    } catch (e) {
      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Delete Custom Commands`)
        .setDescription(`Unable to delete the custom command, is the ID correct?`)
        .addField("Error", e.toString())
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      return message.channel.send({ embeds: [embed] });
    }
  }
};
