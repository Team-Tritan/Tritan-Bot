"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "mute",
  description: "Mute a user by giving them the set mute role.",
  usage: "(Prefix)mute <mention or id> <reason>",
  category: "Moderation",
  async execute(message, args, client) {
    await message.client.guilds.fetch(message.guild.id);

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    if (!settings.mute_role) {
      return message.reply("This guild needs to setup a mute role before using this command.");
    }

    if (
      !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
      !message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)
    )
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle("Missing Permissions")
            .setColor(message.client.config.embeds.embed_color)
            .setDescription(
              `${message.client.config.helpers.error_x} You don't have the permission to mute members, please check the discord permissions and try again.`
            )
        ]
      });

    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle("Missing Permissions")
            .setColor(message.client.config.embeds.embed_color)
            .setDescription(
              ` ${message.client.config.helpers.error_x} **I** don't have the permission to manage roles, therefore I am unable to mute this member.`
            )
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });

    const mutedUser =
      message.guild.members.cache.get(message.mentions.users.first().id) ||
      message.guild.members.cache.get(args[0]);

    if (!mutedUser)
      return message.channel.send(
        `${message.client.config.helpers.error_x} Please provide a valid user mention.`
      );

    const mutedRole = message.guild.roles.cache.find((role) => role.id === settings.mute_role);

    if (mutedUser.roles.cache.some((role) => role.id == settings.mute_role))
      return message.channel.send(
        `${message.client.config.helpers.error_x} The mentioned member is already muted.`
      );

    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(":loud_sound: User Muted")
      .addField("Guild", message.guild.name, true)
      .addField("Member", mutedUser.user.tag + ` (ID: ${mutedUser.id})`, true)
      .addField("Moderator", message.author.tag + ` (ID ${message.author.id})`, true)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Member ID: ${message.author.id}`, message.guild.iconURL())
      .setTimestamp();

    if (!settings.appeal_link) {
      embed.addField("Appeal Infraction:", `[Click Here](${settings.appeal_link})`);
    }

    try {
      mutedUser.send({ embeds: [embed] });
    } catch (error) {
      message
        .reply(`${message.client.config.helpers.error_x} Error, unable to dm this user, muting...`, error)
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    try {
      mutedUser.roles.add(mutedRole);
    } catch (error) {
      return message.reply(
        `${message.client.config.helpers.error_x} Error, unable to mute this user.`,
        error
      );
    }

    message.channel.send(embed);
    try {
      const log_channel = await message.client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: mutedUser.user.id,
      TargetTag: mutedUser.user.tag,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Mute",
      Reason: "User Muted",
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
};
