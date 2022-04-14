"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverstats",
  description: "Get some server stats!",
  usage: "(Prefix)serverstats",
  category: "Utility",
  async execute(message) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching server info from the API.`
    );

    await message.client.guilds.fetch(message.guild.id);
    await message.guild.members.fetch();

    const guild = message.guild;
    const ServerEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle("Server Stats")
      .addField("👥  Member Count: ", "**" + guild.memberCount.toString() + "**" + " members!")
      .addField("👑  Server Owner: ", `<@${guild.ownerId}>`)
      .addField("🔌  Server ID: ", guild.id.toString())
      .addField("📅  Creation Date:", guild.createdAt.toString())
      .addField(
        "🤖  Bot Count:",
        "**" + message.guild.members.cache.filter((member) => member.user.bot).size + "**" + " Bot(s)"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    waiting.edit({ content: null, embeds: [ServerEmbed] });
  }
};
