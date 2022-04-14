"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dashboard",
  description: "Get the link to the dashboard:)",
  usage: "(Prefix)dashboard",
  category: "Info",
  execute(message) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setDescription(`All configuration can be done via the Dashboard (https://tritan.gg].`)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] });
  }
};
