"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "servericon",
  aliases: ["si"],
  usage: "(Prefix)servericon",
  description: "Displays the server's icon.",
  category: "Utility",
  async execute(message) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching server icon from the API.`
    );
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp();
    waiting.edit({ content: null, embeds: [embed] });
  }
};
