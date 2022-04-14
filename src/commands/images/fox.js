"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "fox",
  description: "Shows a cute fox photo!",
  usage: "(Prefix)fox",
  category: "Image/Gifs",
  async execute(message, args) {
    const m = await message.channel.send(
      `${message.client.config.helpers.check_mark} Please wait, fetching from the API.`
    );
    const res = await fetch("https://randomfox.ca/floof/");
    const img = (await res.json()).image;
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
