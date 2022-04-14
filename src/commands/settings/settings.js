"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports.slash = {
  name: "settings",
  description: "View or change settings for your server.",
  options: [
    {
      name: "delete-commands",
      description: "Toggle anti-invite settings for your server.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "enabled",
          description: "Enable anti-invite settings for your server.",
          type: "BOOLEAN",
          required: true
        }
      ]
    },
    {
      name: "bump-reminders",
      description: "Enable/disable bump reminders for your server.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "enabled",
          description: "Enable/disable bump reminders for your server.",
          type: "BOOLEAN",
          required: true
        }
      ]
    },
    {
      name: "cant-count-role",
      description: "Enable the cant count role for your counting channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          description: "The role to give to people who can't count.",
          type: "ROLE",
          required: true
        }
      ]
    },
    {
      name: "confessions-channel",
      description: "Enable the confessions channel for your guild.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel to enable for confessions.",
          type: "CHANNEL",
          required: true
        }
      ]
    },
    {
      name: "counting-channel",
      description: "Enable the counting channel for your guild.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel to enable for counting.",
          type: "CHANNEL",
          required: true
        }
      ]
    },
    {
      name: "join-leave",
      description: "Enable join/leave logs in a specific channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel to send join/leave logs in.",
          type: "CHANNEL",
          required: true
        }
      ]
    },
    {
      name: "mute-role",
      description: "Setup the mute role to be given with the mute command",
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          description: "The role to be given when muting people.",
          type: "ROLE",
          required: true
        }
      ]
    },
    {
      name: "rank-channel",
      description: "Enable the rank channel for your guild.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel to enable for rank messages.",
          type: "CHANNEL",
          required: true
        }
      ]
    },
    {
      name: "appeal-link",
      description: "Send an appeal link when infractions are given out.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "link",
          description: "Your server's appeal link.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "counting-setnumber",
      description: "Set the next number in your counting channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "number",
          description: "The number that the current count should be",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "set-prefix",
      description: "Set the prefix for message based commands.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "prefix",
          description: "A one or two character prefix for message based commands.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "star-channel",
      description: "Setup the starboards channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel for stared messages to go to.",
          type: "CHANNEL",
          required: true
        }
      ]
    },
    {
      name: "set-logs",
      description: "Setup the logging channel..",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel for stared messages to go to.",
          type: "CHANNEL",
          required: true
        }
      ]
    }
  ],
  async execute(client, interaction) {
    // Delete Commands
    if (interaction.options.getSubcommand() == "delete-commands") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Command Deletion Setup")
          .setDescription(
            "You are not allowed or do not have permission to turn on/off the anti-invite setting."
          )
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      const status = interaction.options.getBoolean("enabled");

      if (status == true) {
        try {
          await settings.updateOne({ autoCommandDeletion: true });
          let success = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Command Deletion Setup")
            .setDescription(`Auto command deletion for this server has been \`enabled\`.`)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [success] });
        } catch (e) {
          let failure = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Command Deletion Setup")
            .setDescription(`An error has occured.\n\`${e}\``)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [failure] });
        }
      } else if (status == false) {
        try {
          await settings.updateOne({ autoCommandDeletion: false });
          let success = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Command Deletion Setup")
            .setDescription(`Auto command deletion for this server has been \`disabled\`.`)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [success] });
        } catch (e) {
          let failure = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Command Deletion Setup")
            .setDescription(`An error has occured.\n\`${e}\``)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [failure] });
        }
      }
    }

    // Bump Reminders
    if (interaction.options.getSubcommand() == "bump-reminders") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Bump Reminders Setup")
          .setDescription(
            "You are not allowed or do not have permission to turn on/off the anti-invite setting."
          )
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      const status = interaction.options.getBoolean("enabled");

      if (status == true) {
        try {
          await settings.updateOne({ disabledBumpReminders: false });
          let success = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Bump Reminders Setup")
            .setDescription(`Bump reminders for this server has been \`enabled\`.`)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [success] });
        } catch (e) {
          let failure = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Bump Reminders Setup")
            .setDescription(`An error has occured.\n\`${e}\``)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [failure] });
        }
      } else if (status == false) {
        try {
          await settings.updateOne({ disabledBumpReminders: true });
          let success = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Bump Reminders Setup")
            .setDescription(`Bump reminders for this server has been \`disabled\`.`)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [success] });
        } catch (e) {
          let failure = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle("Bump Reminders Setup")
            .setDescription(`An error has occured.\n\`${e}\``)
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
          return interaction.reply({ embeds: [failure] });
        }
      }
    }

    // Cant Count Role
    if (interaction.options.getSubcommand() == "cant-count-role") {
      const role = interaction.options.getRole("role");
      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Can't Count Role")
          .setDescription("You are not allowed or do not have permission to set the can't count role.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      await settings.updateOne({
        cantCountRole: role.id
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Can't Count Role")
        .setDescription(`The can't count role has been set to <@&${role.id}>.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Confessions Channel
    if (interaction.options.getSubcommand() == "confessions-channel") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Confession Channel Setup")
          .setDescription("You are not allowed or do not have permission to set the confessions channel.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      const channel = interaction.options.getChannel("channel");

      await settings.updateOne({
        confessionsChannel: channel.id
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Confession Channel Updated")
        .setDescription(`The confessions channel has been set to <#${channel.id}> (${channel.name}).`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Counting Channel
    if (interaction.options.getSubcommand() == "counting-channel") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Counting Channel Setup")
          .setDescription("You are not allowed or do not have permission to set the confessions channel.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      const channel = interaction.options.getChannel("channel");

      await settings.updateOne({
        countingChannel: channel.id
      });

      await settings.updateOne({
        countingLastNumber: 0
      });

      const newsettings = await client.models.guild.findOne({ guildID: interaction.guild.id });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Counting Channel Updated")
        .setDescription(
          `The counting channel has been set to <#${channel.id}> (${
            channel.name
          }), your next number should be ${
            newsettings.countingLastNumber + 1
          }.\n\nIf you would like to change the starting number, run ${settings.prefix}currentcount #.`
        )
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Join Leave
    if (interaction.options.getSubcommand() === "join-leave") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Join/Leave Logs")
          .setDescription("You are not allowed or do not have permission to set the logging channel.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const channel = interaction.options.getChannel("channel");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      await settings.updateOne({
        join_leave: channel.id
      });

      const log_channel = await client.channels.fetch(channel.id);
      let create = await log_channel.createWebhook("Tritan Bot: Logging", {
        avatar: `${client.config.embeds.authorIcon}`
      });

      const newWebhook = new client.models.webhooks({
        _id: mongoose.Types.ObjectId(),
        guildID: interaction.guild.id,
        channelID: channel.id,
        webhookID: create.id,
        webhookSecret: create.token
      });
      await newWebhook
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Join/Leave Channel Updated")
        .setDescription(`The join/leave channel has been set to <#${channel.id}> (${channel.name}).`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Mute Role

    if (interaction.options.getSubcommand() === "mute-role") {
      const role = interaction.options.getRole("role");

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Mute Role")
          .setDescription("You are not allowed or do not have permission to set the mute role.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });
      await settings.updateOne({
        mute_role: role.id
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Mute Role Updated")
        .setDescription(`The mute role has been set to <@&${role.id}>.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Rank Channel
    if (interaction.options.getSubcommand() === "rank-channel") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Rank Channel")
          .setDescription("You are not allowed or do not have permission to set the rank channel.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const channel = interaction.options.getChannel("channel");

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      await settings.updateOne({
        rank_channel: channel.id
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Rank Channel Updated")
        .setDescription(`The rank channel has been set to <#${channel.id}> (${channel.name}).`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Appeal Link
    if (interaction.options.getSubcommand() === "appeal-link") {
      const link = interaction.options.getString("link");

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Appeal Link")
          .setDescription("You are not allowed or do not have permission to set the appeal link.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      await settings.updateOne({
        appeal_link: link
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Appeal Link Updated")
        .setDescription(`The appeal link has been set to ${link}.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Set Count
    if (interaction.options.getSubcommand() === "counting-setnumber") {
      const number = interaction.options.getString("number");
      const countingNumber = parseInt(number);

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Count")
          .setDescription("You are not allowed or do not have permission to set the count.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      await settings.updateOne({
        countingLastNumber: countingNumber
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Count Updated")
        .setDescription(`The count has been set to ${number}.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Set Prefix
    if (interaction.options.getSubcommand() === "set-prefix") {
      const prefix = interaction.options.getString("prefix");

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Prefix")
          .setDescription("You are not allowed or do not have permission to set the prefix.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({
        guildID: interaction.guild.id
      });

      await settings.updateOne({
        prefix: prefix
      });

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Prefix Updated")
        .setDescription(`The prefix has been set to ${prefix}.`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }

    // Star Channel
    if (interaction.options.getSubcommand() === "star-channel") {
      const channel = interaction.options.getChannel("channel");

      if (client.starboardsManager.starboards.find((s) => s.guildId === interaction.guild.id)) {
        try {
          client.starboardsManager.delete(channel.id, "⭐");
          let embed = new MessageEmbed()
            .setAuthor({
              name: `${client.config.embeds.authorName}`,
              iconURL: `${client.config.embeds.authorIcon}`
            })
            .setTitle(`${client.config.helpers.check_mark} Success!`)
            .setDescription(
              `The starboard channel has been reset as there is already a channel stored, please run this command again in the channel you wish to set as the starboard.`
            )
            .setColor(client.config.embeds.embed_color)
            .setTimestamp()
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
          return interaction.reply({ embeds: [embed] });
        } catch {
          return interaction.reply(
            "Please make sure you're running this command in the current starboard channel if you're trying to disable/change the channel."
          );
        }
      }

      try {
        client.starboardsManager.create(channel, {
          allowNsfw: true,
          starBotMsg: true,
          selfStar: true,
          starEmbed: true,
          color: client.config.embeds.embed_color,
          threshold: 1
        });

        let embed = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle(`${client.config.helpers.check_mark} Success!`)
          .setDescription(`The starboard for this guild has been set as ${channel}.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return interaction.reply({ embeds: [embed] });
      } catch (e) {
        return interaction.reply("Unable to process this command, please try again later.", e);
      }
    }

    // Set Logs
    if (interaction.options.getSubcommand() === "set-logs") {
      const channel = interaction.options.getChannel("channel");

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        let noPerms = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Set Logging Channel")
          .setDescription("You are not allowed or do not have permission to set the logging channel.")
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ embeds: [noPerms] });
      }

      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      await settings.updateOne({
        event_logs: channel.id
      });

      const log_channel = await client.channels.fetch(channel.id);
      let create = await log_channel.createWebhook("Tritan Bot: Logging", {
        avatar: `${client.config.embeds.authorIcon}`
      });

      const newWebhook = new client.models.webhooks({
        _id: mongoose.Types.ObjectId(),
        guildID: interaction.guild.id,
        channelID: channel.id,
        webhookID: create.id,
        webhookSecret: create.token
      });
      await newWebhook
        .save()
        .then((result) => console.log(result))
        .catch((err) => console.error(err));

      let SetCH = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Logging Channel Updated")
        .setDescription(`The logging channel has been set to <#${channel.id}> (${channel.name}).`)
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ embeds: [SetCH] });
    }
  }
};
