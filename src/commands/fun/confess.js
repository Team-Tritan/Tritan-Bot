"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "confess",
  description: "Make an annonymous confession",
  usage: "(Prefix)confess <confession>",
  aliases: ["confession"],
  category: "Fun",
  async execute(message, args) {
    const client = message.client;
    const settings = await client.models.guild.findOne({ guildID: message.guild.id });
    const confession = args.join(" ");
    const confessionsChannel = client.channels.cache.get(settings.confessionsChannel);

    if (!confession) {
      let embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Anonymous Confession")
        .setDescription(
          "You are missing your confession arguments.\n\nExample: `*confess this is a confession`."
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!confessionsChannel) {
      return message.channel
        .send("A confessions channel has not been setup in this guild, or can not be found.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (confession) {
      try {
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Anonymous Confession")
          .setDescription(await message.client.functions.shorten(confession))
          .setColor(message.client.config.embeds.embed_color)
          .setTimestamp();
        return confessionsChannel.send({ embeds: [embed] });
      } catch (e) {
        return message.channel
          .send(`Unable to post the confession due to an error. \n\n${e}`)
          .then((m) => setTimeout(() => m.delete(), 10000));
      }
    }
  }
};
