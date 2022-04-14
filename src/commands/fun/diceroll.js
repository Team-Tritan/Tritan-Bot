"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "diceroll",
  description: "Roll the dice!",
  usage: "(Prefix)diceroll <optional number of sides>",
  category: "Fun",
  execute(message, args, client) {
    let limit = args[0];
    if (!limit) limit = 6;

    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0) this.sendErrorMessage(message, "Please specify the number of dice sides.");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("🎲  Dice Roll")
      .setDescription(`You rolled a **${n}**!`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    message.channel.send({ embeds: [embed] });
  }
};
