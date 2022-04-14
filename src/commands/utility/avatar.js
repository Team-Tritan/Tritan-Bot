"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  usage: "(Prefix)avatar <optional ID or mention>",
  description: "View an avatar!",
  category: "Utility",
  execute(message, args) {
    let user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("User Avatar")
      .addField(`Avatar URL:`, `[Click Me](${user.displayAvatarURL()})`)
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024
        })
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};

module.exports.slash = {
  name: "avatar",
  description: "View a user's avatar. ",
  options: [
    {
      name: "user",
      description: "The user for the avatar to list.",
      type: "USER"
    }
  ],
  execute(interaction, args) {
    let user = interaction.getUser(user);

    let embed = new MessageEmbed()
      .setAuthor(
        `${interaction.client.config.embeds.authorName}`,
        `${interaction.client.config.embeds.authorIcon}`
      )
      .setTitle("User Avatar")
      .addField(`Avatar URL:`, `[Click Me](${user.displayAvatarURL()})`)
      .setImage(
        user.displayAvatarURL({
          dynamic: true,
          size: 1024
        })
      )
      .setColor(interaction.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${interaction.author.tag}`, interaction.author.displayAvatarURL());
    return interaction.reply({ embeds: [embed] }).catch(console.error);
  }
};
