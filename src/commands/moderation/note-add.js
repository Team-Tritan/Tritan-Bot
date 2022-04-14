"use strict";

const { MessageEmbed, Permissions, IntegrationApplication } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "note-add",
  description: "Add a note to a users account, searchable with viewing infractions.",
  usage: "(Prefix)add-note <user mention or id> <reason>",
  aliases: ["add-note"],
  category: "Moderation",
  async execute(message, args) {
    await message.client.guilds.fetch(message.guild.id);

    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message.reply("You don't have enough permission to add a note to this member.");
    }

    let target;

    if (message.mentions.users.first())
      target = message.guild.members.cache.get(message.mentions.users.first().id);

    if (!message.mentions.users.first()) target = message.guild.members.cache.get(args[0]);

    let reason = args.slice(1).join(" ");

    if (!target) return message.reply("Unable to find this user, are they in your guild?");
    if (!reason) return message.reply("Please specify a reason for this note.");

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });
    if (!settings.event_logs) {
      return message.reply("You need to set a logging channel before using any moderation commands.");
    }

    try {
      const newInfraction = new message.client.models.infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        TargetID: target.user.id,
        TargetTag: target.user.tag,
        ModeratorID: message.author.id,
        ModeratorTag: message.author.tag,
        InfractionType: "Note",
        Reason: reason,
        Time: message.createdAt
      });
      newInfraction.save().then((result) => console.log(result));
    } catch (err) {
      console.error(err);
      return message
        .reply("I was unable to save a note for this user, they may not be in your guild at this time.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`📝 Note Added`)
      .setColor(message.client.config.embeds.embed_color)
      .setThumbnail(target.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(`${message.guild.name}`, message.guild.iconURL())
      .setDescription(
        `**${message.author.tag}** \`(${message.author.id})\` has added a note to **${target.user.tag}** \`(${target.user.id})\` for \`${reason}\`.`
      );

    const log_channel = await message.client.channels.fetch(settings.event_logs);
    log_channel.send({ embeds: [embed] });
    return message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 10000));
  }
};

module.exports.slash = {
  name: "note-add",
  description: "Add a note to a user",
  options: [
    {
      name: "by-mention",
      description: "Add a note to a user by mention.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you'd like to add a note too.",
          type: "USER",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the note.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "by-id",
      description: "Add a note to a user by id.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user-id",
          description: "The user ID of the person you'd like to add a note to.",
          type: "STRING",
          required: true
        },
        {
          name: "reason",
          description: "The reason for the note.",
          type: "STRING",
          required: true
        }
      ]
    }
  ],
  async execute(client, interaction, args) {
    await interaction.deferReply();

    if (interaction.options.getSubcommand() === "by-mention") {
      await client.guilds.fetch(interaction.guild.id);

      let target = interaction.options.getMember("user");
      let reason = interaction.options.getString("reason");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp(
          "You need to set a logging channel before using any moderation commands."
        );
      }

      try {
        const newInfraction = new client.models.infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: interaction.guild.id,
          GuildName: interaction.guild.name,
          TargetID: target.user.id,
          TargetTag: target.user.tag,
          ModeratorID: interaction.user.id,
          ModeratorTag: interaction.user.tag,
          InfractionType: "Note",
          Reason: reason,
          Time: interaction.createdAt
        });
        newInfraction.save().then((result) => console.log(result));
      } catch (err) {
        console.error(err);
        return interaction.followUp(
          "I was unable to save a note for this user, they may not be in your guild at this time."
        );
      }

      let embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`📝 Note Added`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(target.user.displayAvatarURL())
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL())
        .setDescription(
          `**${interaction.user.tag}** \`(${interaction.user.id})\` has added a note to **${target.user.tag}** \`(${target.user.id})\` for \`${reason}\`.`
        );

      const log_channel = await client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [embed] });
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand() === "by-id") {
      await client.guilds.fetch(interaction.guild.id);

      let targetID = interaction.options.getString("user-id");
      let target = client.guilds.cache.get(interaction.guild.id).members.cache.get(targetID);
      let reason = interaction.options.getString("reason");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      if (!settings.event_logs) {
        return interaction.followUp(
          "You need to set a logging channel before using any moderation commands."
        );
      }

      try {
        const newInfraction = new client.models.infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: interaction.guild.id,
          GuildName: interaction.guild.name,
          TargetID: target.user.id,
          TargetTag: target.user.tag,
          ModeratorID: interaction.user.id,
          ModeratorTag: interaction.user.tag,
          InfractionType: "Note",
          Reason: reason,
          Time: interaction.createdAt
        });
        newInfraction.save().then((result) => console.log(result));
      } catch (err) {
        console.error(err);
        return interaction.followUp(
          "I was unable to save a note for this user, they may not be in your guild at this time."
        );
      }

      let embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`📝 Note Added`)
        .setColor(client.config.embeds.embed_color)
        .setThumbnail(target.user.displayAvatarURL())
        .setTimestamp()
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL())
        .setDescription(
          `**${interaction.user.tag}** \`(${interaction.user.id})\` has added a note to **${target.user.tag}** \`(${target.user.id})\` for \`${reason}\`.`
        );

      const log_channel = await client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [embed] });
      return interaction.followUp({ embeds: [embed] });
    }
  }
};
