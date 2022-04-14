"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "tickle",
  description: "Allows you to tickle a user",
  usage: "(Prefix)tickle <user mention>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if (!user) return message.reply("You need to mention or provide a user ID of someone to tickle!");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );
    superagent.get("https://nekos.life/api/v2/img/tickle").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(user.username + " just got tickled by " + message.author.username)
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got tickled by " + message.author.toString() + ".")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.emebds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
