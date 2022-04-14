"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, guild) => {
  if (guild.name === undefined) return;
  if (guild.id === undefined) return;

  let embed = new MessageEmbed()
    .setAuthor(guild.name, guild.iconURL())
    .setTitle(`❌ Left Guild`)
    .addField(`Server Name:`, `${guild.name}`, false)
    .addField(`Guild ID:`, `${guild.id}`, false)
    .addField(`Guild Member Count:`, `${guild.memberCount}`, false)
    .addField(`Shard:`, `${guild.shardId}`, false)
    .setColor(client.config.embeds.embed_color)
    .setTimestamp()
    .setFooter("Tritan Bot");

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.BOT_JOINLEAVE_CHANNEL_WEBHOOK_SECRET
  });

  webhookClient.send({
    username: "Tritan Bot",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [embed]
  });
};
