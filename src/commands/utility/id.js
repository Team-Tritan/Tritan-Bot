"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "id",
  aliases: ["member-id"],
  description: "Get the ID of a member in your guild.",
  usage: "(Prefix)id <user mention>",
  category: "Utility",
  async execute(message, args) {
    var mention = message.mentions.users.first();
    if (!mention) return message.channel.send("Mention a user to get their ID");
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching user ID from the API.`
    );
    const userID = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setDescription(`${mention}'s ID is ${mention.id}.`)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.embeds.embed_color);
    waiting.edit({ content: null, embeds: [userID] });
  }
};
