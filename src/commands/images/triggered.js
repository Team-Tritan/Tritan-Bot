"use strict";

const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
  name: "triggered",
  description: "Get triggered!",
  category: "Image/Gifs",
  usage: "(Prefix)triggered <optional ID or mention>",
  async execute(message, args) {
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

    let link = `https://some-random-api.ml/canvas/triggered/?avatar=${user.displayAvatarURL({
      format: "png"
    })}`;

    let attachment = new MessageAttachment(link, "triggered.gif");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`${user.username} just got triggered!`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    message.channel.send({ embeds: [embed], files: [attachment] });
  }
};
