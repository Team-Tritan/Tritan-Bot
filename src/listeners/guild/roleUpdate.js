"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = async (client, newRole, oldRole) => {
  const settings = await client.models.guild.findOne({
    guildID: newRole.guild.id
  });
  if (!settings.event_logs) {
    return;
  }

  oldRole.guild
    .fetchAuditLogs({
      type: "ROLE_UPDATE",
      limit: 1
    })
    .then(async (audit) => {
      let user = audit.entries.first().executor;
      if (!user) return;

      const embed = new MessageEmbed();
      if (oldRole.name !== newRole.name) {
        embed.setColor(client.config.embeds.embed_color);
        embed.setAuthor(newRole.guild.name, newRole.guild.iconURL());
        embed.setTitle(`📝 Edited Role:`);
        embed.addField("Name Before:", `${newRole.name}`, true);
        embed.addField("Name After:", `${oldRole.name}`, true);
        embed.addField("Changed by:", `${user.tag} \`(${user.id})\``, false);
        embed.setTimestamp();

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
      }
    });
};
