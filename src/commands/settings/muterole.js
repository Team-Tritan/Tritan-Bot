"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "muterole",
  description: "Set the mute role in your server.",
  usage: "(Prefix)muterole <mention or ID>",
  category: "Settings",
  async execute(message, args) {
    if (!args[0]) return message.channel.send("You need to tag your mute role when running this command.");
    const role = message.mentions.roles.first().id || message.guild.roles.cache.get(args[0]);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Set Mute Role")
        .setDescription("You are not allowed or do not have permission to set the mute role.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });
    await settings.updateOne({
      mute_role: role
    });

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Mute Role Updated")
      .setDescription(`The mute role has been set to <@&${role}>.`)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
