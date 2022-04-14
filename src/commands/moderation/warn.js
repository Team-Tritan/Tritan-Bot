"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "warn",
  description: "Warn a user for breaking your server rules, is logged as an infraction.",
  usage: "(Prefix)warn <user id or mention> <reason>",
  category: "Moderation",
  async execute(message, args) {
    await message.guild.members.fetch();
    await message.client.guilds.fetch(message.guild.id);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.reply("You don't have enough permission to warn this member.");
    }

    let target;
    if (message.mentions.users.first())
      target = message.guild.members.cache.get(message.mentions.users.first().id);

    if (!message.mentions.users.first()) target = message.guild.members.cache.get(args[0]);

    const reason = args.slice(1).join(" ") || "No reason provided.";

    if (!target) return message.reply("please specify a member to warn.");
    if (!reason) return message.reply("please specify a reason for this warning.");

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });

    if (!settings.event_logs) {
      return message.reply("you need to set a logging channel before using any moderation commands.");
    }

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🚨 Member Warning`)
      .setColor(message.client.config.embeds.embed_color)
      .setThumbnail(target.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(`${message.guild.name}`, message.guild.iconURL());
    if (!settings.appeal_link) {
      embed.setDescription(
        `**${target.user.tag}** \`(${target.user.id})\` has been warned by **${message.author.tag}** \`(${message.author.id})\` for \`${reason}\`.`
      );
    }

    if (settings.appeal_link) {
      embed.setDescription(
        `**${target.user.tag}** \`(${target.user.id})\` has been warned by **${message.author.tag}** \`(${message.author.id})\` for \`${reason}\`.\n\n[Appeal Warning](${settings.appeal_link})`
      );
    }
    try {
      target.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message
        .reply("I was unable to dm this member, warning...")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }
    const log_channel = await message.client.channels.fetch(settings.event_logs);
    log_channel.send({ embeds: [embed] });

    message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 10000));

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: target.user.id,
      TargetTag: target.user.tag,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Warning",
      Reason: reason,
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
};

module.exports.slash = {
  name: "warn",
  description: "Warn a user",
  options: [
    {
      name: "by-mention",
      description: "Warn a user by mention.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you'd like to warn.",
          type: "USER",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the warning.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "by-id",
      description: "Warn a user by id.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user-id",
          description: "The user ID of the person you'd like to warn.",
          type: "STRING",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the warning.",
          type: "STRING",
          required: true
        }
      ]
    }
  ],

  async execute(client, interaction, args) {
    await interaction.deferReply();

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return interaction.followUp("You don't have enough permission to warn this member.");
    }

    if (interaction.options.getSubcommand() === "by-mention") {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp({
          content: "You need to set a logging channel before using any moderation commands.",
          ephemeral: true
        });
      }

      let embed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`🚨 Member Warning`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());
      if (!settings.appeal_link) {
        embed.setDescription(
          `**${user.tag}** \`(${user.id})\` has been warned by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        );
      }

      if (settings.appeal_link) {
        embed.setDescription(
          `**${user.tag}** \`(${user.id})\` has been warned by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.\n\n[Appeal Warning](${settings.appeal_link})`
        );
      }
      try {
        user.send({ embeds: [embed] });
      } catch (err) {
        console.error(err);
        interaction.followUp({ content: "I was unable to dm this member, warning..." });
      }
      const log_channel = await client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [embed] });

      const newInfraction = new client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: interaction.guild.id,
        GuildName: interaction.guild.name,
        TargetID: user.id,
        TargetTag: user.tag,
        ModeratorID: interaction.user.id,
        ModeratorTag: interaction.user.tag,
        InfractionType: "Warning",
        Reason: reason,
        Time: interaction.createdAt
      });
      newInfraction
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));

      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand() === "by-id") {
      const userid = interaction.options.getString("user-id");
      const user = await client.users.fetch(userid);

      const reason = interaction.options.getString("reason");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp({
          content: "You need to set a logging channel before using any moderation commands.",
          ephemeral: true
        });
      }

      let embed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`🚨 Member Warning`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());
      if (!settings.appeal_link) {
        embed.setDescription(
          `**${user.tag}** \`(${user.id})\` has been warned by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        );
      }

      if (settings.appeal_link) {
        embed.setDescription(
          `**${user.tag}** \`(${user.id})\` has been warned by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.\n\n[Appeal Warning](${settings.appeal_link})`
        );
      }
      try {
        user.send({ embeds: [embed] });
      } catch (err) {
        console.error(err);
        interaction.followUp({ content: "I was unable to dm this member, warning..." });
      }
      const log_channel = await client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [embed] });

      const newInfraction = new client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: interaction.guild.id,
        GuildName: interaction.guild.name,
        TargetID: user.id,
        TargetTag: user.tag,
        ModeratorID: interaction.user.id,
        ModeratorTag: interaction.user.tag,
        InfractionType: "Warning",
        Reason: reason,
        Time: interaction.createdAt
      });
      newInfraction
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));

      return interaction.followUp({ embeds: [embed] });
    }
  }
};
