"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "bird",
  usage: "(Prefix)bird",
  description: "Finds a random bird for your viewing pleasure.",
  category: "Image/Gifs",
  async execute(message) {
    const res = await fetch("http://shibe.online/api/birds");
    const img = (await res.json())[0];
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setImage(img)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
