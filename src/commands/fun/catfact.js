"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "catfact",
  usage: "(Prefix)catfact",
  description: "Says a random cat fact.",
  category: "Fun",
  async execute(message, client) {
    try {
      const res = await fetch("https://catfact.ninja/fact");
      const fact = await res.json().fact;
      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("🐱 Cat Fact")
        .setDescription(fact)
        .setFooter(`Requested By: ${message.member.displayName}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(message.client.logger.yellow("[ERROR: Catfact Command]"), `${error}`);
      return message.channel.send("A 3rd party API error has occured, please try again later.", error);
    }
  }
};
