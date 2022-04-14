"use strict";

const { MessageEmbed, Permissions } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = {
  name: `kick`,
  description: `Kick Mentioned User`,
  usage: "(Prefix)kick <mention or id> <Reason>",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message
        .reply("You don't have enough permission to kick this member.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    await message.client.guilds.fetch(message.guild.id);

    let target;
    if (message.mentions.users.first())
      target = message.guild.members.cache.get(message.mentions.users.first().id);

    if (!message.mentions.users.first()) target = message.guild.members.cache.get(args[0]);

    if (!target)
      return message
        .reply("You need to tag a user or enter their ID to kick them.")
        .then((m) => setTimeout(() => m.delete(), 10000));

    if (!target === message.author) {
      return message.reply("I'll ignore that, this time...").then((m) => setTimeout(() => m.delete(), 10000));
    }

    const reason = args.slice(1).join(" ") || "No reason provided.";

    if (!reason)
      return message.reply("You need to specify a reason.").then((m) => setTimeout(() => m.delete(), 10000));

    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message
        .reply("You don't have enough permission to kick this member.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });

    if (!settings.event_logs) {
      return message
        .reply("You need to set a logging channel before using any moderation commands.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let targetEmbed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🥾 Member Kicked`)
      .setColor(message.client.config.embeds.embed_color)
      .setThumbnail(target.user.displayAvatarURL());
    if (!settings.appeal_link) {
      targetEmbed.setDescription(
        `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${message.author.tag}** \`(${message.author.id})\` for \`${reason}\`.`
      );
    }

    if (settings.appeal_link) {
      targetEmbed.setDescription(
        `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${message.author.tag}(()) \`(${message.author.id})\` for \`${reason}\`.\n\n[Appeal Kick](${settings.appeal_link})`
      );
    }

    targetEmbed.setTimestamp().setFooter(`${message.guild.name}`, message.guild.iconURL());

    try {
      target.send({ embeds: [targetEmbed] });
    } catch {
      message
        .reply("Unable to dm this specific member... kicking.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    try {
      target.kick({ reason: reason });
    } catch {
      message
        .reply("I was unable to kick this member, something weird must be going on.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let logEmbed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🥾 Member Kicked`)
      .setColor(message.client.config.embeds.embed_color)
      .setDescription(
        `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${message.author.tag}** \`(${message.author.id})\` for \`${reason}\`.`
      )
      .setTimestamp()
      .setFooter(`${message.guild.name}`, message.guild.iconURL());

    const log_channel = await message.client.channels.fetch(settings.event_logs);

    log_channel.send({ embeds: [logEmbed] });
    message.channel.send({ embeds: [logEmbed] }).then((m) => setTimeout(() => m.delete(), 10000));

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: target.user.id,
      TargetTag: target.user.tag,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Kick",
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
  name: "kick",
  description: "Kick a user",
  options: [
    {
      name: "by-mention",
      description: "Kick a user by mention.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you'd like to kick.",
          type: "USER",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the kick.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "by-id",
      description: "Kick a user by ID.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user-id",
          description: "The user ID of the person you'd like to kick.",
          type: "STRING",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the kick.",
          type: "STRING",
          required: true
        }
      ]
    }
  ],

  async execute(client, interaction, args) {
    await interaction.deferReply();

    if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return interaction.followUp("You don't have enough permission to kick this member.");
    }

    if (interaction.options.getSubcommand() === "by-mention") {
      let target = interaction.options.getMember("user");

      if (!target === interaction.user) {
        return interaction.followUp("I'll ignore that, this time...");
      }

      const reason = interaction.options.getString("reason");

      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.followUp("You don't have enough permission to kick this member.");
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp(
          "You need to set a logging channel before using any moderation commands."
        );
      }

      let targetEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`🥾 Member Kicked`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(target.user.displayAvatarURL());
      if (!settings.appeal_link) {
        targetEmbed.setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        );
      }

      if (settings.appeal_link) {
        targetEmbed.setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}(()) \`(${interaction.user.id})\` for \`${reason}\`.\n\n[Appeal Kick](${settings.appeal_link})`
        );
      }

      targetEmbed.setTimestamp().setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());

      try {
        target.send({ embeds: [targetEmbed] });
      } catch {
        interaction.followUp("Unable to dm this specific member... kicking.");
      }

      try {
        target.kick({ reason: reason });
      } catch {
        return interaction.followUp("I was unable to kick this member, something weird must be going on.");
      }

      let logEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`🥾 Member Kicked`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        )
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());

      const log_channel = await client.channels.fetch(settings.event_logs);

      log_channel.send({ embeds: [logEmbed] });
      interaction.followUp({ embeds: [logEmbed] });

      const newInfraction = new client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: interaction.guild.id,
        GuildName: interaction.guild.name,
        TargetID: target.user.id,
        TargetTag: target.user.tag,
        ModeratorID: interaction.user.id,
        ModeratorTag: interaction.user.tag,
        InfractionType: "Kick",
        Reason: reason,
        Time: interaction.createdAt
      });
      newInfraction
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));
    }

    if (interaction.options.getSubcommand() === "by-id") {
      let targetID = interaction.options.getString("user-id");
      let target = client.guilds.cache.get(interaction.guild.id).members.cache.get(targetID);

      if (!target === interaction.user) {
        return interaction.followUp("I'll ignore that, this time...");
      }

      const reason = interaction.options.getString("reason");

      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.followUp("You don't have enough permission to kick this member.");
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp(
          "You need to set a logging channel before using any moderation commands."
        );
      }

      let targetEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`🥾 Member Kicked`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(target.user.displayAvatarURL());
      if (!settings.appeal_link) {
        targetEmbed.setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        );
      }

      if (settings.appeal_link) {
        targetEmbed.setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}(()) \`(${interaction.user.id})\` for \`${reason}\`.\n\n[Appeal Kick](${settings.appeal_link})`
        );
      }

      targetEmbed.setTimestamp().setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());

      try {
        target.send({ embeds: [targetEmbed] });
      } catch {
        interaction.followUp("Unable to dm this specific member... kicking.");
      }

      try {
        target.kick({ reason: reason });
      } catch {
        return interaction.followUp("I was unable to kick this member, something weird must be going on.");
      }

      let logEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`🥾 Member Kicked`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `**${target.user.tag}** \`(${target.user.id})\` has been kicked by **${interaction.user.tag}** \`(${interaction.user.id})\` for \`${reason}\`.`
        )
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL());

      const log_channel = await client.channels.fetch(settings.event_logs);

      log_channel.send({ embeds: [logEmbed] });
      interaction.followUp({ embeds: [logEmbed] });

      const newInfraction = new client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: interaction.guild.id,
        GuildName: interaction.guild.name,
        TargetID: target.user.id,
        TargetTag: target.user.tag,
        ModeratorID: interaction.user.id,
        ModeratorTag: interaction.user.tag,
        InfractionType: "Kick",
        Reason: reason,
        Time: interaction.createdAt
      });
      newInfraction
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));
    }
  }
};
