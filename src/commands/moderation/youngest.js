"use strict";

const { MessageEmbed, MessageAttachment } = require("discord.js"),
  fs = require("fs");

module.exports = {
  name: "youngest",
  description: "Find all youngest alts with the provided join date (days)",
  usage: "(Prefix)youngest <number of days since account creation>",
  category: "Moderation",
  async execute(message, args) {
    await message.guild.members.fetch();
    await message.client.guilds.fetch(message.guild.id);

    let days = args[0];
    if (!days)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector: Young Accounts`)
            .setDescription(`Please provide a valid Days Duration`)
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    if (isNaN(days))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector: Young Accounts`)
            .setDescription(`Please provide a valid Days Duration`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    let day = Number(days);

    if (day > 100)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle(`Alt Detector`)
            .setDescription(`:x: | You may only find alts of an account age of **100 days** or below`)
            .setColor(message.client.config.colors.EMBED_COLOR)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    let array = [];

    message.guild.members.cache.forEach(async (user) => {
      let math = day * 86400000;

      let x = Date.now() - user.joinedAt;
      let created = Math.floor(x / 86400000);

      if (day > created) {
        array.push(`${user.user.tag} | ${user.id} | Joined At: ${user.joinedAt}`);
      }
    });

    const string = array.join("\n\n");
    const embedable = await message.client.functions.shorten(string);

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Alt Detector: Account Age < ${days} Days`)
      .setDescription(embedable)
      .setColor(message.client.config.embeds.embed_color);

    message.channel.send({
      embeds: [embed]
    });
  }
};
