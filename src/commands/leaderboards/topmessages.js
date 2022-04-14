"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "topmessages",
  description: "View a guild's message leaderboard :)",
  category: "Leaderboards",
  usage: "(Prefix)topmessages",
  async execute(message, args) {
    const embed = new MessageEmbed();
    embed.setAuthor(message.guild.name, message.guild.iconURL());
    embed.setTitle("🏅 Message Counts");
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.embeds.embed_color);
    embed.setThumbnail(message.guild.iconURL());
    embed.setURL(`https://tritan.gg/public/${message.guild.id}/messages`);
    embed.setDescription(
      "To see your message count leaderboard, please click on the link above to be redirected to our dashboard."
    );
    return message.channel.send({ embeds: [embed] });
  }
};
