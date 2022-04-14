"use strict";

const { MessageEmbed, MessageAttachment } = require("discord.js"),
  moment = require("moment"),
  fs = require("fs");

module.exports = {
  name: "rolelist",
  description: "Check all members of a certain role! or maybe all!",
  usage: "(Prefix)rolelist <all | role name | @role>",
  category: "Utility",
  async execute(message, args) {
    const filedescriptor = Date.now();
    var file = fs.createWriteStream(`./tmp/rolelist-${filedescriptor}.txt`);
    file.on("error", function (err) {
      console.log(err);
    });

    setTimeout(() => {}, 5000);

    let client = message.client;

    let prefix = "*";

    await message.client.guilds.fetch(message.guild.id);
    await message.guild.members.fetch();

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[0]) ||
      message.guild.roles.cache.find(
        (rl) => rl.name.toLowerCase() === args.slice(0).join(" ").toLowerCase()
      ) ||
      message.guild.roles.cache.find((rl) => rl.name.toUpperCase() === args.slice(0).join(" ").toUpperCase());

    let embedValid = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setDescription(
        `Please provide a valid role by name, ID, or mention.\n Ex: *rolelist all | role name | @role | id`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    if (!args[0]) return message.channel.send({ embeds: [embedValid] });

    if (args[0].toLowerCase() === "everyone" || args[0].toLowerCase() === "all")
      role = message.guild.roles.everyone;

    if (!role) return message.channel.send({ embeds: [embedValid] });
    const memberRole = role;

    const members = message.guild.members.cache
      .filter((m) => {
        if (m.roles.cache.find((r) => r === memberRole)) return true;
      })
      .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1))
      .map((m) => m.user);

    const uwu = members.join("\n");
    const uwu2 = await message.client.functions.shorten(uwu);

    const membersForFile = message.guild.members.cache
      .filter((m) => {
        if (m.roles.cache.find((r) => r === memberRole)) return true;
      })
      .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1))
      .map((m) => m.user.tag + " (" + m.user.id + ")");

    file.write(membersForFile.join("\n"));
    file.end();

    setTimeout(() => {}, 5000);

    const finished_file = new MessageAttachment(`./tmp/rolelist-${filedescriptor}.txt`);

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle(`Role List: ${message.client.functions.capitalize(memberRole.name)} [${members.length}]`)
      .setDescription(await uwu2)
      .addField("Full List:", "See the file attached for the entire list.")
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    return message.channel.send({ embeds: [embed], files: [finished_file] });
  }
};

module.exports.slash = {
  name: "role",
  description: "Commands having to do with roles",
  options: [
    {
      name: "list",
      description: "List the users in a role.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          type: "ROLE",
          description: "The role to search for",
          required: true
        }
      ]
    },
    {
      name: "info",
      description: "Get information about a role",
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          type: "ROLE",
          description: "The role to search for",
          required: true
        }
      ]
    }
  ],
  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "list") {
      const filedescriptor = Date.now();
      var file = fs.createWriteStream(`./tmp/rolelist-${filedescriptor}.txt`);
      file.on("error", function (err) {
        console.log(err);
      });

      setTimeout(() => {}, 5000);

      await interaction.client.guilds.fetch(interaction.guild.id);
      await interaction.guild.members.fetch();

      let role = interaction.options.getRole("role");

      const memberRole = role;

      const members = interaction.guild.members.cache
        .filter((m) => {
          if (m.roles.cache.find((r) => r === memberRole)) return true;
        })
        .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1))
        .map((m) => m.user);

      const uwu = members.join("\n");
      const uwu2 = await client.functions.shorten(uwu);

      const membersForFile = interaction.guild.members.cache
        .filter((m) => {
          if (m.roles.cache.find((r) => r === memberRole)) return true;
        })
        .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1))
        .map((m) => m.user.tag + " (" + m.user.id + ")");

      file.write(membersForFile.join("\n"));
      file.end();

      setTimeout(() => {}, 5000);

      const finished_file = new MessageAttachment(`./tmp/rolelist-${filedescriptor}.txt`);

      const embed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle(`Role List: ${client.functions.capitalize(memberRole.name)} [${members.length}]`)
        .setDescription(await uwu2)
        .addField("Full List:", "See the file attached for the entire list.")
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();

      return interaction.reply({ embeds: [embed], files: [finished_file] });
    }

    if (interaction.options.getSubcommand() === "info") {
      let role = interaction.options.getRole("role");

      const embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setDescription(`**Role Info: ${role.name}**`)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .addField(
          "General",
          `**❯ Name:** ${role.name}\n**❯ ID:** ${
            role.id
          }\n**❯ Hex Color:** ${role.hexColor.toUpperCase()}\n**❯ Created on:** ${moment(
            role.createdTimestamp
          ).format("Do MMMM YYYY HH:mm")}`
        )
        .addField(
          "Server",
          `**❯ Position:** ${role.position}\n**❯ Hoisted:** ${role.hoist}\n**❯ Mentionable:** ${role.mentionable}\n**❯ Members:** ${role.members.size}`
        )
        .addField(
          "Permissions:",
          "..." +
            (await client.functions.shorten(
              role.permissions
                .toArray()
                .map((x) =>
                  x
                    .split("_")
                    .map((y) => y[0] + y.slice(1).toLowerCase())
                    .join(" ")
                )
                .join(", ")
            ))
        );
      return interaction.reply({ content: null, embeds: [embed] });
    }
  }
};
