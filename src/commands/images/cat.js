"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "cat",
  description: "Sends a random image of a cat",
  usage: "(Prefix)cat",
  category: "Image/Gifs",
  async execute(message) {
    const m = await message.channel.send(
      `${message.client.config.helpers.check_mark} Please wait, fetching from the API.`
    );
    superagent.get("https://nekos.life/api/v2/img/meow").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
