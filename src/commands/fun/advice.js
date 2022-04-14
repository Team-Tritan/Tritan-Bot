"use strict";

const { MessageEmbed } = require("discord.js"),
  request = require("superagent");

module.exports = {
  name: "advice",
  description: "Gives you some random advice",
  usage: "(prefix)advice",
  category: "Fun",
  async execute(message, args) {
    request.get("http://api.adviceslip.com/advice").end((err, res) => {
      if (!err && res.status === 200) {
        try {
          JSON.parse(res.text);
        } catch (e) {
          return message.channel.send("An api error occurred, please try again later..");
        }

        const advice = JSON.parse(res.text);

        const embed = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle(`Advice`)
          .setDescription(advice.slip.advice)
          .setColor(message.client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send({ embeds: [embed] });
      } else {
        return message.channel.send(`The api is a little busy at the moment, please try this again later.`);
      }
    });
  }
};
