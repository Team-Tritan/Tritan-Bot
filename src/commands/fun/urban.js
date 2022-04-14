"use strict";

const { MessageEmbed } = require("discord.js"),
  fetch = require("node-fetch"),
  querystring = require("querystring");

module.exports = {
  name: "urban",
  description: "Get an explanation about literally anything",
  usage: "(Prefix)urban [word]",
  nsfw: true,
  category: "Fun",
  async execute(message, args, client) {
    const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...`.trim() : str.trim());

    try {
      if (!args.length) {
        return message.channel.send("You need to supply a search term!");
      }

      const query = querystring.stringify({
        term: args.join(" ")
      });

      const { list } = await fetch(`http://api.urbandictionary.com/v0/define?${query}`).then((response) =>
        response.json()
      );

      if (!list.length) {
        return message.channel.send(`No results found for **${args.join(" ")}**.`);
      }

      const [answer] = list;

      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("** Urban Dictionary: " + answer.word + "**")
        .setURL(answer.permalink)
        .addField("Definition", trim(answer.definition, 512))
        .addField("Example", trim(answer.example, 512))
        .addField("Rating", `${answer.thumbs_up} :+1:     ${answer.thumbs_down} :-1:`)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Uh Oh! there was an error!")
        .addField(
          "Please contact the developers",
          "Join the support server [Here](https://discord.gg/ScUgyE2)"
        )
        .setDescription(error)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      return message.reply({ embeds: [errorEmbed] });
    }
  }
};
