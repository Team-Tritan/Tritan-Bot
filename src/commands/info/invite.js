"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite the bot to another server :)",
  usage: "(Prefix)invite",
  category: "Info",
  execute(message) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .addField(
        `Invite Link:`,
        `[Click Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};

module.exports.slash = {
  name: "invite",
  description: "Get the invite link for Tritan Bot.",
  async execute(client, interaction) {
    await interaction.deferReply();

    interaction.followUp(
      `https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands`
    );
  }
};
