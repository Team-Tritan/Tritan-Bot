"use strict";

const mongoose = require("mongoose"),
  discord = require("discord.js");

module.exports = {
  name: "ccadd",
  description: "Add a custom command to your guild.",
  usage: "(Prefix)ccadd <command name> <command response>",
  category: "Custom Commands",
  async execute(message, args) {
    const client = message.client;

    if (!message.member.permissions.has(discord.Permissions.FLAGS.MANAGE_GUILD)) {
      return message
        .reply("You don't have enough permission to run this command.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let name = args[0];
    if (!name) {
      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Custom Commands`)
        .setDescription(
          "You are missing an argument for this command.\n\nExample: *ccadd <command name> <command response>"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      return message.channel.send({ embeds: [embed] });
    }

    args.shift();

    let response = args.join(" ");
    if (!response) {
      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Custom Commands`)
        .setDescription(
          "You are missing an argument for this command.\n\nExample: *ccadd <command name> <command response>"
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
      return message.channel.send({ embeds: [embed] });
    }

    let newCC = new client.models.cc({
      _id: mongoose.Types.ObjectId(),
      guildID: message.guild.id,
      name: name,
      response: response
    });

    newCC
      .save()
      .then((result) => console.log(message.client.logger.yellow("Saved Database Record", result)))
      .catch((err) => console.error(err));

    const embed = new discord.MessageEmbed()
      .setAuthor({ name: `Tritan Bot`, iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp" })
      .setTitle(`Custom Commands`)
      .setDescription("Your custom command has been saved.")
      .addField("Name", name, true)
      .addField("Response", response, true)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
    return message.channel.send({ embeds: [embed] });
  }
};
