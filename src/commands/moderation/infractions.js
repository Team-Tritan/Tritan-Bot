"use strict";

// Infraction Group for Slash Commands

const { MessageEmbed, Permissions, MessageAttachment } = require("discord.js"),
  mongoose = require("mongoose"),
  fs = require("fs");

module.exports.slash = {
  name: "infractions",
  description: "Search for notes & infraction by user or staff member.",
  options: [
    {
      name: "search",
      description: "Search for a user's infractions.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to see infractions given to.",
          type: "USER",
          required: true
        }
      ]
    },
    {
      name: "staff",
      description: "Search for a user's infractions.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "staff",
          description: "The user you want to see infractions given to.",
          type: "USER",
          required: true
        }
      ]
    },
    {
      name: "info",
      description: "Get information about a specific infraction.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The ID of the infraction you want to specifically see.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "delete",
      description: "Get information about a specific infraction.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The ID of the infraction you want to delete.",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "reason",
      description: "Change the reason on an infraction.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The ID of the infraction you'd like to change.",
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
    // Infraction Search
    if (interaction.options.getSubcommand() === "search") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.reply(`You don't have enough permission to view this member's infractions.`);
      }

      if (!interaction.options.getMember("user")) {
        return interaction.reply({
          content: `You must specify a user or staff member option to search for.`
        });
      }

      const filedescriptor = Date.now();
      var file = fs.createWriteStream(`./tmp/user-infractions-${filedescriptor}.txt`);
      file.on("error", function (err) {
        console.log(err);
      });

      setTimeout(() => {}, 5000);

      await interaction.guild.members.fetch();
      let target = interaction.options.getMember("user");

      let array = [];

      let warnings = await client.models.infractions.find({
        TargetID: target.user.id,
        GuildID: interaction.guild.id
      });

      if (warnings.length == 0) {
        file.write("No infractions to display.");
      } else {
        warnings.forEach(async (warning) => {
          file.write(
            `ID: ${warning._id}\nMember: ${warning.TargetTag}\nType: ${warning.InfractionType}\nModerator: ${warning.ModeratorTag}\nReason: ${warning.Reason}\nTime/Date: ${warning.Time}\n\n\n`
          );
          array.push(
            `ID: \`${warning._id}\`\nMember: \`${warning.TargetTag}\n\`Type: \`${warning.InfractionType}\n\`Moderator: \`${warning.ModeratorTag}\n\`Reason: \`${warning.Reason}\n\`Time/Date: \`${warning.Time}\n\``
          );
        });
      }

      file.end();

      const finished_file = new MessageAttachment(`./tmp/user-infractions-${filedescriptor}.txt`);

      const string = array.join("\n\n");
      const embedable = await client.functions.shorten(string);

      const embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`Infractions Search`)
        .setDescription(`There are no infractions with this user.`);
      if (array.length > 0) {
        embed.setDescription(`${embedable}`);
        embed.addField("Note", "For the entire list, reference the txt file provided.");
      }
      embed
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(
          "Requested by: " + interaction.user.tag,
          interaction.user.displayAvatarURL({ dynamic: true })
        );

      interaction.reply({
        embeds: [embed],
        files: [finished_file]
      });
    }

    // Infraction Staff
    if (interaction.options.getSubcommand() === "staff") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.reply(`You don't have enough permission to view this member's infractions.`);
      }

      if (!interaction.options.getMember("staff")) {
        return interaction.reply({
          content: `You must specify a user or staff member option to search for.`
        });
      }

      const filedescriptor = Date.now();
      var file = fs.createWriteStream(`./tmp/user-infractions-${filedescriptor}.txt`);
      file.on("error", function (err) {
        console.log(err);
      });

      setTimeout(() => {}, 5000);

      await interaction.guild.members.fetch();
      let target = interaction.options.getMember("staff");

      let array = [];

      let warnings = await client.models.infractions.find({
        ModeratorID: target.user.id,
        GuildID: interaction.guild.id
      });

      if (warnings.length == 0) {
        file.write("No infractions to display.");
      } else {
        warnings.forEach(async (warning) => {
          file.write(
            `ID: ${warning._id}\nMember: ${warning.TargetTag}\nType: ${warning.InfractionType}\nModerator: ${warning.ModeratorTag}\nReason: ${warning.Reason}\nTime/Date: ${warning.Time}\n\n\n`
          );
          array.push(
            `ID: \`${warning._id}\`\nMember: \`${warning.TargetTag}\n\`Type: \`${warning.InfractionType}\n\`Moderator: \`${warning.ModeratorTag}\n\`Reason: \`${warning.Reason}\n\`Time/Date: \`${warning.Time}\n\``
          );
        });
      }

      file.end();

      const finished_file = new MessageAttachment(`./tmp/user-infractions-${filedescriptor}.txt`);

      const string = array.join("\n\n");
      const embedable = await client.functions.shorten(string);

      const embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle(`Infractions Search`)
        .setDescription(`There are no infractions from this user.`);
      if (array.length > 0) {
        embed.setDescription(`${embedable}`);
        embed.addField("Note", "For the entire list, reference the txt file provided.");
      }
      embed
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(
          "Requested by: " + interaction.user.tag,
          interaction.user.displayAvatarURL({ dynamic: true })
        );

      interaction.reply({
        embeds: [embed],
        files: [finished_file]
      });
    }

    // Infraction Info

    if (interaction.options.getSubcommand() === "info") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.reply({
          content: "You don't have enough permission to view this member's infractions.",
          ephemeral: true
        });
      }
      let target = await interaction.options.getString("id");
      let warning = await client.models.infractions
        .findOne({ _id: target })
        .catch((e) =>
          interaction.reply({ content: "There are no infractions with this ID.", ephemeral: true })
        );

      const embed = new MessageEmbed();
      embed.setAuthor(`${client.config.embeds.authorName}`, `${client.config.embeds.authorIcon}`);
      embed.setTitle(`Infraction Info`);
      embed.setThumbnail(interaction.guild.iconURL({ dynamic: true }));
      embed.setTimestamp();
      embed.setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
      embed.setColor(client.config.embeds.embed_color);
      embed.addField("ID", `${warning._id}`);
      embed.addField("Guild Name", `${warning.GuildName}`);
      embed.addField("Guild ID", `${warning.GuildID}`);
      embed.addField("Member", `${warning.TargetTag}`);
      embed.addField("Member ID", `${warning.TargetID}`);
      embed.addField("Infraction Type", `${warning.InfractionType}`);
      embed.addField("Moderator", `${warning.ModeratorTag}`);
      embed.addField("Moderator ID", `${warning.ModeratorID}`);
      embed.addField("Reason", `${warning.Reason}`);
      embed.addField("Time", `${warning.Time}`);

      return interaction.reply({ embeds: [embed] });
    }

    // Infraction Delete
    if (interaction.options.getSubcommand() === "delete") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return interaction.reply("You don't have enough permission to view this member's infractions.");
      }

      const caseID = interaction.options.getString("id");

      client.models.infractions
        .findByIdAndDelete(caseID)
        .then(async (document) => {
          if (!document)
            return interaction.reply({ content: "That is an invalid infraction ID!", ephemeral: true });

          if (document.user == interaction.member.id) {
            const newinf = new client.models.infractions({
              _id: document._id + 2,
              GuildID: document.GuildID,
              GuildName: document.GuildName,
              TargetID: document.TargetID,
              TargetTag: document.TargetTag,
              ModeratorID: document.ModeratorID,
              ModeratorTag: document.ModeratorTag,
              InfractionType: document.InfractionType,
              Reason: "Tried to self delete an infraction",
              Time: document.Time
            });
            await newinf.save();
            return interaction.reply("You can't delete infractions for yourself!");
          } else {
            const embed = new MessageEmbed();
            embed.setAuthor(`${client.config.embeds.authorName}`, `${client.config.embeds.authorIcon}`);
            embed.setTitle("Successfully Deleted Infraction");
            embed.setDescription(`Infraction ${caseID} has been removed from our records.`);
            embed.setTimestamp();
            embed.setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
            embed.setColor(client.config.embeds.embed_color);
            return interaction.reply({ embeds: [embed] });
          }
        })
        .catch((err) => {
          client.sentry.captureException(err);
          return interaction.reply(`Error when deleting infraction, please try again later.\n${err}`);
        });
    }

    // Change Reason
    if (interaction.options.getSubcommand() === "reason") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return interaction.reply("You don't have enough permission to update this infraction.");
      }

      let infID = interaction.options.getString("id");
      let newReason = interaction.options.getString("reason");

      const infractionToUpdate = client.models.infractions.findOne({ _id: infID });
      const settings = await client.models.guild.findOne({ guildID: interaction.guild.id });
      try {
        infractionToUpdate.updateOne({ Reason: newReason }).then((i) => {
          console.log(i);
        });
      } catch (error) {
        const errorE = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle(`${client.config.helpers.error_x} Failed to update reason, please try again later.`)
          .addField("Error", error)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Updated by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return interaction.reply({ embeds: [errorE] });
      }

      const success = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("Update Infraction Reason")
        .setDescription(
          `${interaction.user.tag} \`(${interaction.user.id})\` has updated the reason for infraction \`${infID}\` to \`${newReason}\``
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Updated by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
      await interaction.reply({ embeds: [success] });

      if (settings.event_logs) {
        const log_channel = await client.channels.fetch(settings.event_logs);
        log_channel.send({ embeds: [success] });
      }
    }
  }
};
