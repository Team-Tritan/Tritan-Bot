"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "slap",
  description: "Allows you to slap a user",
  usage: "(Prefix)slap  <mention or ID>",
  category: "Image/Gifs",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
    if (!user) return message.reply("You need to mention or provide a user ID of someone to slap!");

    const m = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching from the API.`
    );

    superagent.get("https://nekos.life/api/v2/img/slap").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got slapped by " + message.author.toString() + ".")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ embeds: [lewdembed] });
    });
  }
};
