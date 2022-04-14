"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shard",
  description: "Get the shard ID of your guild.",
  usage: "(Prefix)shard",
  category: "Info",
  async execute(message) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, pulling shard info from the server.`
    );
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Shard Info`)
      .addField("Guild:", message.guild.name, true)
      .addField(`Guild ID:`, message.guild.id, true)
      .addField("Shard ID:", message.guild.shardId.toString(), true)
      .addField("Shard Ping:", message.client.ws.ping + "ms.")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    waiting.edit({ content: null, embeds: [embed] });
  }
};

module.exports.slash = {
  name: "shard",
  description: "Get the shard ID of your guild.",

  async execute(client, interaction) {
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${client.config.embeds.authorName}`,
        iconURL: `${client.config.embeds.authorIcon}`
      })
      .setTitle(`Shard Info`)
      .addField("Guild:", interaction.guild.name, true)
      .addField(`Guild ID:`, interaction.guild.id, true)
      .addField("Shard ID:", interaction.guild.shardId.toString(), true)
      .addField("Shard Ping:", interaction.client.ws.ping + "ms.")
      .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setTimestamp()
      .setColor(client.config.embeds.embed_color);

    return interaction.reply({ embeds: [embed] });
  }
};
