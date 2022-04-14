"use strict";

const client = require("nekos.life"),
  neko = new client(),
  Discord = require("discord.js");

module.exports = {
  name: "boobs",
  description: "Boobs hentai",
  usage: "(Prefix)boobs",
  cooldown: 10,
  nsfw: true,
  category: "nsfw",
  async execute(message, args, client) {
    async function boobs() {
      const GIF = await neko.nsfw.hentai();
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTitle(`Here ya go!`)
        .setDescription(`Provided by our [lewd api.](https://lewd.tritan.dev)`)
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color)
        .setImage(GIF.url);
      message.channel.send({ embeds: [embed] });
    }
    boobs();
  }
};
