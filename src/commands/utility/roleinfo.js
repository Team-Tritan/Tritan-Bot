"use strict";

const { MessageEmbed } = require("discord.js"),
  moment = require("moment");

const option = {
  true: "Yes",
  false: "No"
};

module.exports = {
  name: "roleinfo",
  aliases: ["role-info"],
  description: "Displays information about a provided role.",
  usage: "(Prefix)roleinfo <role mention or id>",
  category: "Utility",
  async execute(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]); // Lib Error? Roles.cache.get reuturns undefined in every case.
    if (!role) {
      return message.channel.send("Please specify a role by mention or ID.");
    }

    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching role info from the API.`
    );

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setDescription(`**Role Info: ${role.name}**`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(message.client.config.embeds.embed_color)
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
          (await message.client.functions.shorten(
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
    return waiting.edit({ content: null, embeds: [embed] });
  }
};
