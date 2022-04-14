"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, role) => {
  const settings = await client.models.guild.findOne({
    guildID: role.guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  role.guild
    .fetchAuditLogs({
      type: "ROLE_CREATE",
      limit: 1
    })
    .then(async (audit) => {
      let user = audit.entries.first().executor;
      if (!user) return;
      let embed = new MessageEmbed()
        .setAuthor(role.guild.name, role.guild.iconURL())
        .setTitle("🆕 Role Created:")
        .addField(`Name:`, role.name, true)
        .addField(`Created by:`, user.tag + ` \`(${user.id})\``, true)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Role ID: ${role.id}`);

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
        } catch {
          return await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.event_logs
          });
        }
      }
    });
};
