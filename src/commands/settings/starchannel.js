"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "starchannel",
  description: "Set or unset the starboard channel",
  usage: "(Prefix)starchannel <optional number of stars>",
  category: "Settings",
  async execute(message, args) {
    const disNumber = args[0];
    const x = Number(disNumber);

    if (message.client.starboardsManager.starboards.find((s) => s.guildID === message.guild.id)) {
      try {
        message.client.starboardsManager.delete(message.channel.id, "⭐");
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle(`${message.client.config.helpers.check_mark} Success!`)
          .setDescription(
            `The starboard channel has been reset as there is already a channel stored, please run this command again in the channel you wish to set as the starboard.`
          )
          .setColor(message.client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send({ embeds: [embed] });
      } catch {
        return message.reply(
          "Please make sure you're running this command in the current starboard channel if you're trying to disable/change the channel."
        );
      }
    }

    try {
      message.client.starboardsManager.create(message.channel, {
        allowNsfw: true,
        starBotMsg: true,
        selfStar: true,
        starEmbed: true,
        color: message.client.config.embeds.embed_color,
        threshold: x
      });

      let embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`${message.client.config.helpers.check_mark} Success!`)
        .setDescription(`The starboard for this guild has been set as ${message.channel}.`)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [embed] });
    } catch (e) {
      return message.channel.send("Unable to process this command, please try again later.", e);
    }
  }
};
