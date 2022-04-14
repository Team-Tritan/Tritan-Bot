"use strict";

const { MessageEmbed } = module.require("discord.js");

module.exports = {
  name: "luckycolor",
  description: "Gives you a random color!",
  usage: "(prefix)luckycolor",
  category: "Fun",
  execute(message, client) {
    let color = "";
    while (color.length < 6) {
      color = Math.floor(Math.random() * 16777215).toString(16);
    }
    let luckycolor = "#" + color;

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Lucky Color")
      .setDescription("Hex Code: " + luckycolor.toUpperCase())
      .setColor(luckycolor)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] });
  }
};
