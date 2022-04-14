"use strict";

const { MessageEmbed, MessageAttachment } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "pat",
  description: "Allows you to pat another user",
  usage: "(Prefix)pat <mention or ID>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if (!user) return message.reply("You need to mention or provide a user id.");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );

    superagent.get("https://nekos.life/api/v2/img/pat").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got a pat from " + message.author.toString() + ".")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
