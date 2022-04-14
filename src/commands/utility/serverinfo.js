"use strict";

const { MessageEmbed } = require("discord.js"),
  numeral = require("numeral");

module.exports = {
  name: "serverinfo",
  aliases: ["server"],
  usage: "(Prefix)serverinfo",
  description: "View the server's profile card!",
  category: "Utility",
  async execute(message) {
    await message.client.guilds.fetch(message.guild.id);

    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching server info from the API.`
    );

    const guildInfo = await message.client.models.guild.findOne({ guildID: message.guild.id });

    try {
      await guildInfo.updateOne({ guildName: message.guild.name });
    } catch {
      console.log("Failed to update guild name in serverinfo command.");
    }

    let embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle("Server Info")
      .addField("🎉 Server Name:", message.guild.name, true)
      .addField("#️⃣ Server ID:", message.guild.id, true)
      .addField("🔑 Premium Status:", guildInfo.is_premium.toString(), true)
      .addField("❌ Blacklist Status:", guildInfo.is_blacklisted.toString(), true)
      .addField("🤖 Beta Status:", guildInfo.betaGuild.toString(), true)
      .addField("🌟 Awarded Badges:", guildInfo.badges || "None", true)
      .addField("⏱️ Server Created:", message.guild.createdAt.toString(), true)
      .addField("⭐ Server Owner:", `<@${message.guild.ownerId}>`, true)
      .addField("🌎 Server Region:", message.guild.preferredLocale, true)
      .addField("🔒 Verification Level:", message.guild.verificationLevel, true)
      .addField("⭕ Total Roles:", message.guild.roles.cache.size.toString(), true)
      .addField("📨 Channel Count:", message.guild.channels.cache.size.toString(), true)
      .addField(
        "📝 Text Channels:",
        message.guild.channels.cache.filter((channel) => channel.type === "GUILD_TEXT").size.toString(),
        true
      )
      .addField(
        "🔊 Voice Channels:",
        message.guild.channels.cache.filter((channel) => channel.type === "GUILD_VOICE  ce").size.toString(),
        true
      )
      .addField("⛽ Member Count:", message.guild.memberCount.toString(), true)
      .addField("🤖 Total Bots:", message.guild.members.cache.filter((m) => m.user.bot).size.toString(), true)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    waiting.edit({ content: null, embeds: [embed] });
  }
};
