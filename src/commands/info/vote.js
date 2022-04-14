"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  description: "Support the developement of Tritan Bot!",
  usage: "(Prefix)vote",
  category: "Info",
  execute(message) {
    const voteemb = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Vote for Tritan!")
      .addField("Top.gg", "[Vote!](https://top.gg/bot/732783297872003114/vote)", false)
      .addField("Infinity Bot List", "[Vote!](https://infinitybotlist.com/bots/tritanbot/vote)", false)
      .addField("Discord Labs", "[Vote!](https://bots.discordlabs.org/bot/732783297872003114/vote)", false)
      .addField("Topcord", "[Vote!](https://topcord.xyz/bot/732783297872003114/)", false)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [voteemb] });
  }
};
