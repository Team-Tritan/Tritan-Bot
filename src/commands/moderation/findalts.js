"use strict";

const discord = require("discord.js"),
  fs = require("fs");

module.exports = {
  name: "findalts",
  aliases: ["identifyalt", "findalt", "identifyalts"],
  description: "Find all alts in the guild with the provided account age (days)",
  usage: "(Prefix)findalts <days since account creation>",
  category: "Moderation",
  async execute(message, args) {
    const client = message.client;

    await client.guilds.fetch(message.guild.id);
    await message.guild.members.fetch();

    let days = args[0];
    if (!days)
      return message.channel.send({
        embeds: [
          new discord.MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector`)
            .setDescription(`Please provide a valid days duration.`)
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    if (isNaN(days))
      return message.channel.send({
        embeds: [
          new discord.MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector`)
            .setDescription(`Please provide a valid days duration.`)
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    let day = Number(days);

    if (day > 100)
      return message.channel.send({
        embeds: [
          new discord.MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector`)
            .setDescription(
              `${message.client.config.helpers.error_x} | You may only find alts of an account age of **100 days** or below`
            )
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    let array = [];

    message.guild.members.cache.forEach(async (user) => {
      let math = day * 86400000;

      let x = Date.now() - user.user.createdAt;
      let created = Math.floor(x / 86400000);

      if (day > created) {
        array.push(`${user.user.tag} | ${user.id} | Created At: ${user.user.createdAt}`);
      }
    });

    let uwu = array.join("\n\n");
    let string = await client.functions.shorten(uwu);

    let embed = new discord.MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Alt Detector - Account age < ${days} Days`)
      .setDescription(string)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    message.channel.send({
      embeds: [embed]
    });
  }
};
