"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  usage: "(Prefix)userinfo <mention>",
  description: "View someone else's profile card!",
  category: "Utility",
  async execute(message, args) {
    const member =
      message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let target = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!member)
      return message.reply(
        "you need to specify which member by mention or ID. If you've already done so, this user is no longer in the guild as I can't access their data."
      );

    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching user info from the API.`
    );

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("User Info")
      .setDescription(`[Avatar URL](${target.displayAvatarURL()})`)
      .setThumbnail(target.avatarURL())
      .addField("Username:", "<@" + target.id + ">", true)
      .addField("Nickname:", member.displayName, true)
      .addField("User ID:", target.id, true)
      .addField("Account Created:", target.createdAt.toString(), true)
      .addField("Joined Guild:", member.joinedAt.toString(), true)
      .addField(
        "Voice:",
        member.voice.channel
          ? member.voice.channel.name + ` (${member.voice.channel.id})`
          : "Not currently in a voice channel.",
        true
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    let roleEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("User Roles & Permissions")
      .addField(
        "Some Roles:",
        await message.client.functions.shorten(member.roles.cache.map((role) => role).join(", ")),
        false
      )
      .addField(
        "Permissions:",
        await message.client.functions.shorten(
          member.permissions
            .toArray()
            .map((x) =>
              x
                .split("_")
                .map((y) => y[0] + y.slice(1).toLowerCase())
                .join(" ")
            )
            .join(", ")
        )
      )
      .setThumbnail(target.avatarURL())
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    waiting.edit({ content: null, embeds: [embed, roleEmbed] });
  }
};

module.exports.slash = {
  name: "user",
  description: "Commands having to do with users",
  options: [
    {
      name: "info",
      description: "List information about a specific user.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          type: "USER",
          description: "The user to search for.",
          required: true
        }
      ]
    }
  ],
  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "info") {
      await interaction.defer;

      const member = interaction.options.getMember("user");
      const target = interaction.options.getUser("user");

      let embed = new MessageEmbed()
        .setAuthor({
          name: `${client.config.embeds.authorName}`,
          iconURL: `${client.config.embeds.authorIcon}`
        })
        .setTitle("User Info")
        .setDescription(`[Avatar URL](${target.displayAvatarURL()})`)
        .setThumbnail(target.avatarURL())
        .addField("Username:", "<@" + target.id + ">", true)
        .addField("Nickname:", member.displayName, true)
        .addField("User ID:", target.id, true)
        .addField("Account Created:", target.createdAt.toString(), true)
        .addField("Joined Guild:", member.joinedAt.toString(), true)
        .addField(
          "Voice:",
          member.voice.channel
            ? member.voice.channel.name + ` (${member.voice.channel.id})`
            : "Not currently in a voice channel.",
          true
        )
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();

      let roleEmbed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle("User Roles & Permissions")
        .addField(
          "Some Roles:",
          await client.functions.shorten(member.roles.cache.map((role) => role).join(", ")),
          false
        )
        .addField(
          "Permissions:",
          await client.functions.shorten(
            member.permissions
              .toArray()
              .map((x) =>
                x
                  .split("_")
                  .map((y) => y[0] + y.slice(1).toLowerCase())
                  .join(" ")
              )
              .join(", ")
          )
        )
        .setThumbnail(target.avatarURL())
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
        .setTimestamp();
      return interaction.reply({ content: null, embeds: [embed, roleEmbed] });
    }
  }
};
