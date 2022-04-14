"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "weakmeme",
  usage: "(Prefix)weakmeme",
  description: "Pulls a meme from Reddit for a quick laugh! :)",
  category: "Fun",
  async execute(message, client) {
    let res = await fetch("https://meme-api.herokuapp.com/gimme");
    res = await res.json();
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setDescription(res.title)
      .setImage(res.url)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
