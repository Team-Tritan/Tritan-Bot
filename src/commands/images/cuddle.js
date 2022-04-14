"use strict";

const { MessageEmbed } = require("discord.js"),
  superagent = require("snekfetch");

module.exports = {
  name: "cuddle",
  description: "Sends a cute gif when mentioning a user to cuddle.",
  usage: "(Prefix)cuddle [user mention]",
  category: "Image/Gifs",
  async execute(message, args) {
    if (message.guild === null) return;
    const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!user) return message.reply("you need to mention someone to cuddle.");
    const m = await message.channel.send(
      `${message.client.config.helpers.check_mark} Please wait, fetching from the API.`
    );
    superagent.get("https://nekos.life/api/v2/img/cuddle").end((err, response) => {
      const lewdembed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setImage(response.body.url)
        .setDescription(user.toString() + " just got a cuddle from " + message.author.toString() + ".")
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setColor(message.client.config.embeds.embed_color);
      m.edit({ content: null, embeds: [lewdembed] });
    });
  }
};
