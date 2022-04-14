"use strict";

const superagent = require("snekfetch"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "yaoi",
  description: "Some nice threesome hentai",
  usage: "(Prefix)threesome",
  cooldown: 10,
  nsfw: true,
  category: "nsfw",
  async execute(message, args) {
    superagent.get("https://lewd.tritan.gg/api/v1/yaoi").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Here's some yaoi senpai.")
        .setDescription(`Provided by our [lewd api.](https://lewd.tritan.dev)`)
        .setImage(response.body.url)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      message.channel.send({ embeds: [lewdembed] });
    });
  }
};
