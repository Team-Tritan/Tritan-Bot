"use strict";

const { MessageEmbed } = require("discord.js"),
  localcache = require("quick.db");

module.exports = {
  name: "afk",
  description: "Puts a user into an AFK mode, the bot sends the reason when the member is pinged.",
  usage: "(Prefix)afk [reason]",
  category: "Utility",
  async execute(message, args) {
    const status = new localcache.table("AFKs");
    let afk = await status.fetch(message.author.id);
    const embed = new MessageEmbed()
      .setColor(message.client.config.embeds.embed_color)
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

    if (!afk) {
      embed.setDescription(`**${message.author.tag}** is now in AFK mode.`);
      embed.addField(`Reason:`, `${args.join(" ") ? args.join(" ") : "No reason given."}`, false);
      status.set(message.author.id, args.join(" ") || `No reason given.`);
    } else {
      embed.setDescription("You are no longer in AFK mode.");
      status.delete(message.author.id);
    }

    message.channel.send({ embeds: [embed] });
  }
};

module.exports.slash = {
  name: "afk",
  description: "Puts a user into an AFK mode, the bot sends the reason when the member is pinged.",
  options: [
    {
      name: "reason",
      description: "The reason to display to others when they ping you.",
      type: "STRING",
      required: false
    }
  ],
  async execute(client, interaction, args) {
    interaction.deferReply();

    let reason = interaction.options.getString("reason");

    const status = new localcache.table("AFKs");
    let afk = await status.fetch(interaction.user.id);

    const embed = new MessageEmbed()
      .setColor(client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL());

    if (!afk) {
      embed.setDescription(`**${interaction.user.tag}** is now in AFK mode.`);
      embed.addField(`Reason:`, `${reason ? reason : "No reason given."}`, false);
      status.set(interaction.user.id, reason || `No reason given.`);
    } else {
      embed.setDescription("You are no longer in AFK mode.");
      status.delete(interaction.user.id);
    }

    interaction.followUp({ embeds: [embed] });
  }
};
