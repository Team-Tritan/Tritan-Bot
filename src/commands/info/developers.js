"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "developers",
  aliases: ["devs"],
  category: "Info",
  description: "Lists the develoeprs of Tritan Bot",
  usage: "(Prefix)developers",
  async execute(message) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .addField("Owner", "- Dylan_James")
      .addField("Contributing Developers", "- Crafterzman\n- Windows\n- Nirlep\n- MaximKing")
      .addField(
        "Links",
        "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&scope=bot) | " +
          "[Support Server](https://discord.gg/eEYxRqx2Bw)** | " +
          "**[Website](https://tritan.gg)**"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
