"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "nick",
  description: "Change a user's nickname",
  usage: "(Prefix)nick <user mention> <new nickname>",
  category: "Moderation",
  async execute(message, args) {
    await message.client.guilds.fetch(message.guild.id);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
      let noperms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`🔒 Change Nickname`)
        .setDescription(
          `${message.client.config.helpers.error_x} You don't have permission to manage nicknames.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply({ embeds: [noperms] });
    }

    var member = message.mentions.members.first();

    if (!member) {
      let noMention = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`🔒 Change Nickname`)
        .setDescription(
          `${message.client.config.helpers.error_x} You need to mention a user to change their nickname.`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply({ embeds: [noMention] });
    }

    var name = message.content.replace(message.content.split(" ")[0], "");

    name = name.replace(`<@!${member.id}>`, "");

    name = name.trim();

    var h = member.roles.highest.position;
    var y = message.guild.members.cache.get(message.client.user.id).roles.highest.position;
    if (h > y || h == y) {
      let cantdo = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`🔒 Change Nickname`)
        .setDescription(
          `Cannot change **<@${member.id}>**'s nickname, please make sure my role is above theirs. `
        )
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.reply({ embeds: [cantdo] });
    } else {
      await member.setNickname(name);
    }

    let success = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🔒 Change Nickname`)
      .setDescription(`I've changed their nickname. :thumbsup:`)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.reply({ embeds: [success] });
  }
};
