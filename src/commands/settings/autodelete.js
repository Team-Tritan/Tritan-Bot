"use strict";

const mongoose = require("mongoose"),
  { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "autodelete",
  description: "Autodelete all messages in the channel that this command is being ran in.",
  usage: "(Prefix)autodelete",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Auto Deletion")
        .setDescription("You are not allowed or do not have permission to set the auto deletion channel.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new message.client.models.guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            guildCreated: message.guild.createdAt,
            guildIcon: message.guild.iconURL(),
            prefix: message.client.config.helpers.default_prefix,
            is_premium: false,
            is_blacklisted: false,
            event_logs: null,
            join_leave: null,
            auto_delete_channel: message.channel.id
          });
          newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          let SetCH = new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle("Auto Deletion Channel Set")
            .setDescription(
              `The auto deletion channel has been set to <#${message.channel.id}> (${message.channel.name}).`
            )
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          return message.channel.send({ embeds: [SetCH] });
        }
      }
    );

    await settings.updateOne({
      auto_delete_channel: message.channel.id
    });

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Auto Deletion Channel Updated")
      .setDescription(
        `The auto deletion channel has been set to <#${message.channel.id}> (${message.channel.name}).`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
