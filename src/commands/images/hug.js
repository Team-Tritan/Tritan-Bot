"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "hug",
  description: "Hug a user",
  Usage: "(Prefix)hug <mention or ID>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("mention someone to give a hug to.");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} lease wait, fetching from the API.`
    );

    superagent.get("https://nekos.life/api/v2/img/hug").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got a hug from " + message.author.toString() + ".")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
