"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "wallpaper",
  description: "Sends the user a possibly nsfw wallpaper image.",
  category: "Image/Gifs",
  nsfw: true,
  async execute(message) {
    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    superagent.get("https://nekos.life/api/v2/img/wallpaper").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
