"use strict";

const { MessageEmbed } = require("discord.js"),
  request = require("node-superfetch");

module.exports = {
  name: "chuck",
  usage: "(Prefix)chuck",
  description: "Grab a random funny Chick Norris joke!",
  category: "Fun",
  async execute(message) {
    const { body } = await request.get("http://api.icndb.com/jokes/random").query({
      escape: "javascript",
      exclude: message.channel.nsfw ? "" : "[explicit]"
    });

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Chuck Norris Joke`)
      .setDescription(body.value.joke)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] });
  }
};
