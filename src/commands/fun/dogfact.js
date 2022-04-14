"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "dogfact",
  usage: "(Prefix)dogfact",
  description: "Shows a random dog fact.",
  category: "Fun",
  async execute(message, client) {
    const res = await fetch("https://dog-api.kinduff.com/api/facts");
    const fact = await res.json();

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("🐶  Dog Fact")
      .setDescription(fact.facts[0])
      .setFooter(
        `Requested by: ${message.member.displayName}`,
        message.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
