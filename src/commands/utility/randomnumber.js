"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "randomnumber",
  description: "Get a random number from 1 to 10.",
  usage: "(Prefix)randomnumber",
  category: "Utility",
  execute(message, args) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Random Number")
      .setDescription(`Your random number is: ${Math.floor(Math.random() * 10) + 1}`)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [embed] });
  }
};
