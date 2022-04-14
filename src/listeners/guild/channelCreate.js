"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, channel) => {
  if (!channel.guild) return;

  let settings = await client.models.guild.findOne({
    guildID: channel.guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  channel.guild
    .fetchAuditLogs({
      type: "CHANNEL_CREATE",
      limit: 1
    })
    .then(async (audit) => {
      let user = audit.entries.first().executor;
      if (!user) return;

      let embed = new MessageEmbed()
        .setAuthor({ name: user.tag + ` (${user.id})`, iconURL: user.displayAvatarURL() })
        .setTitle("✅ Channel Created")
        .setDescription(
          `Channel **#${channel.name}** \`(${channel.id})\`) has been created by **${user.tag}** \`(${user.id})\`. `
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp();

      const thisWebhook = await client.models.webhooks.findOne({
        guildID: settings.guildID,
        channelID: settings.event_logs
      });

      if (thisWebhook) {
        const webhookClient = new WebhookClient({
          id: thisWebhook.webhookID,
          token: thisWebhook.webhookSecret
        });

        try {
          return await webhookClient.send({
            username: "Tritan Bot",
            avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
            embeds: [embed]
          });
        } catch (e) {
          await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.event_logs
          });
        }
      }
    });
};
