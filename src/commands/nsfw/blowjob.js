"use strict";

const superagent = require("snekfetch"),
  { MessageEmbed } = require("discord.js");

module.exports = {
  name: "blowjob",
  description: "Blowjob hentai",
  usage: "(Prefix)blowjob",
  cooldown: 10,
  nsfw: true,
  category: "nsfw",
  async execute(message, args) {
    superagent.get("https://purrbot.site/api/img/nsfw/blowjob/gif").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("As you requested :p")
        .setDescription(`Provided by our [lewd api.](https://lewd.tritan.dev)`)
        .setImage(response.body.link)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      message.channel.send({ embeds: [lewdembed] });
    });
  }
};
