"use strict";

const { MessageEmbed } = require("discord.js"),
  { post } = require("snekfetch");

module.exports = {
  name: "pastebin",
  description: "Upload text to a pastebin, returns a link.",
  usage: "(Prefix)pastebin <text>",
  aliases: ["pb", "bin", "codebin", "hastebin"],
  category: "Utility",
  premium: true,
  async execute(message, args) {
    const waiting = await message.channel.send(`${message.client.config.helpers.birb} Please wait...`);
    const text = args.join("  ");
    const { body } = await post("https://bin.tritan.gg/documents").send(text);
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Pastebin")
      .setDescription(`https://bin.tritan.gg/${body.key}.js`)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
    waiting.edit({ content: null, embeds: [embed] });
  }
};
