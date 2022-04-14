"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "poke",
  usage: "(Prefix)poke <mention or ID>",
  description: "Allows you to poke another user, no this isn't facebook.",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if (!user) return message.reply("You need to mention or provide a user ID of someone to poke!");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );

    superagent.get("https://nekos.life/api/v2/img/poke").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got poked by " + message.author.toString() + ".")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
