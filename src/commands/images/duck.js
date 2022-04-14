"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "duck",
  description: "Finds a random duck for your viewing pleasure.",
  usage: "(Prefix)duck",
  category: "Image/Gifs",
  async execute(message, args) {
    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    const res = await fetch("https://random-d.uk/api/v2/random");
    const img = (await res.json()).url;
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setImage(img)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    m.edit({ content: null, embeds: [embed] });
  }
};
