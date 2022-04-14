"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch");

module.exports = {
  name: "horoscope",
  description: "Sends your daily horoscope!",
  usage: "(Prefix) horoscope <sun sign>",
  category: "Fun",
  premium: true,
  async execute(message, args, client) {
    const sign = args.join(" ");
    if (!sign) {
      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`Horoscope: Invalid Arguments`)
        .setThumbnail(
          `https://img.pngio.com/free-clipart-of-horoscope-astrology-zodiac-libra-scales-libra-scales-png-4000_4298.png`
        )
        .setDescription(
          "Please add the horoscope sign you would like to view at the end of this command. \n Example: `*horoscope libra`"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    }

    try {
      fetch(`http://horoscope-api.herokuapp.com/horoscope/today/${sign}`)
        .then((res) => res.json())
        .then((json) => {
          const embed = new MessageEmbed()
            .setAuthor(`${message.author.tag}'s Horoscope`, message.author.displayAvatarURL())
            .setDescription(json.horoscope)
            .setThumbnail(
              `https://img.pngio.com/free-clipart-of-horoscope-astrology-zodiac-libra-scales-libra-scales-png-4000_4298.png`
            )
            .setFooter(`Requested Horoscope for ${sign}`)
            .setTimestamp()
            .setColor(message.client.config.embeds.embed_color);
          message.channel.send({ embeds: [embed] });
        });
    } catch (err) {
      return message.channel.send("Something went wrong. Please try again in a few seconds.", err);
    }
  }
};
