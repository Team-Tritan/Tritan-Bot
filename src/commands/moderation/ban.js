"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "ban",
  description: "Give a user the ban hammer!",
  usage: "(Prefix)ban <user id or mention> <reason>",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.channel.send(":no_entry_sign: You do not have permission to use this command.");
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    const user = message.mentions.users.first() || (await message.client.users.fetch(args[0]));
    if (!user) return await message.channel.send("Unable to find a user with this ID.");

    const reason = args.slice(1).join(" ") || "No reason provided.";

    try {
      let userEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`${message.client.config.helpers.ban} Member Banned`)
        .setColor(message.client.config.embeds.embed_color)
        .setThumbnail(user.user.displayAvatarURL());
      if (!settings.appeal_link) {
        userEmbed.setDescription(
          `**${user.tag}** \`${user.id}\` has been banned by **${message.author.tag}** \`${message.author.id}\` for \`${reason}\`.`
        );
      }

      if (settings.appeal_link) {
        userEmbed.setDescription(
          `**${user.tag}** \`${user.id}\` has been banned by **${message.author.tag}** \`${message.author.id}\` for \`${reason}\`.\n\n[Appeal Ban](${settings.appeal_link})`
        );
      }

      userEmbed.setTimestamp().setFooter(`${message.guild.name}`, message.guild.iconURL());

      user.send({ embeds: [userEmbed] });
    } catch {
      message.reply(`I couldn't dm this member, banning.`).then((m) => setTimeout(() => m.delete(), 10000));
    }

    try {
      await message.guild.members.ban(user, { reason: reason });
    } catch (error) {
      return message
        .reply(`This member has not been banned.\n${error}`)
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: user.id,
      TargetTag: user.username + "#" + user.discriminator,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Ban",
      Reason: reason,
      Time: message.createdAt
    });

    newInfraction
      .save()
      .then((result) => console.log(message.client.logger.yellow("[Saved Database Record]"), result));

    if (settings.event_logs) {
      let logEmbed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`${message.client.config.helpers.ban} Member Banned`)
        .setColor(message.client.config.embeds.embed_color)
        .setDescription(
          `**${user.tag}** \`${user.id}\` has been banned by **${message.author.tag}** \`${message.author.id}\` for \`${reason}\`.`
        )
        .setTimestamp()
        .setFooter(`${message.guild.name}`, message.guild.iconURL());

      const log_channel = await message.client.channels.fetch(settings.event_logs);

      log_channel.send({ embeds: [logEmbed] });
      message.channel.send({ embeds: [logEmbed] }).then((m) => setTimeout(() => m.delete(), 10000));
    }
  }
};
