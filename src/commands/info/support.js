"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "support",
  usage: "(Prefix)support",
  description: "Need help with Tritan?",
  category: "Info",
  execute(message) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Support Server")
      .setDescription(
        "Join our [support server](https://discord.gg/eEYxRqx2Bw)! We giveaway free premium, beta testing, and you'll be the first to know about any issues or updates."
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [embed] });
  }
};
