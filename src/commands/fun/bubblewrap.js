"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bubblewrap",
  description: "Gives you a virtual bubblewrap!",
  usage: "(Prefix)bubblewrap",
  category: "Fun",
  execute(message) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Pop the bubblewrap!`)
      .setDescription(
        ("||owo||".repeat(Math.ceil(Math.random() * 5 + 7)) + "\n").repeat(Math.ceil(Math.random() * 5 + 7))
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] });
  }
};
