"use strict";

const client = require("nekos.life"),
  neko = new client(),
  Discord = require("discord.js");

module.exports = {
  name: "pussy",
  description: "Some pussy pics",
  usage: "(Prefix)pussy",
  cooldown: 10,
  nsfw: true,
  category: "nsfw",
  async execute(message, args, client) {
    async function pussy() {
      const GIF = await neko.nsfw.pussy();
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTitle(`Sus... but okay.`)
        .setDescription(`Provided by our [lewd api.](https://lewd.tritan.dev)`)
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color)
        .setImage(GIF.url);
      message.channel.send({ embeds: [embed] });
    }
    pussy();
  }
};
