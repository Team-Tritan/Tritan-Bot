"use strict";

const { MessageEmbed, Util, WebhookClient } = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
  const settings = await client.models.guild.findOne({
    guildID: newMember.guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let diff = oldMember.roles.cache.filter((r) => !newMember.roles.cache.has(r.id)).first();
      const embed = new MessageEmbed()
        .setAuthor({
          name: newMember.user.tag + ` (${newMember.user.id})`,
          iconURL: newMember.user.avatarURL()
        })
        .setTitle(`🎈 Role Removed`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `**Role Removed:** ${diff.name} \`(${diff.id})\`\n**Some Roles:** ${newMember.roles.cache
            .map((role) => role)
            .join(", ")}`
        )
        .setTimestamp();

      const splitDescription = Util.splitMessage(embed.description, {
        maxLength: 2048,
        char: "\n",
        prepend: "",
        append: ""
      });

      splitDescription.forEach(async (m) => {
        embed.setDescription(m);

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
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      let diff = newMember.roles.cache.filter((r) => !oldMember.roles.cache.has(r.id)).first();
      const embed2 = new MessageEmbed()
        .setColor(client.config.embeds.embed_color)
        .setAuthor({
          name: newMember.user.tag + ` (${newMember.user.id})`,
          iconURL: newMember.user.avatarURL()
        })
        .setTitle(`🎈 Role Added`)
        .setDescription(
          `**Role Added:** ${diff.name} \`(${diff.id})\`\n**Some Roles:** ${newMember.roles.cache
            .map((role) => role)
            .join(", ")}`
        )
        .setTimestamp();

      const splitDescription = Util.splitMessage(embed2.description, {
        maxLength: 2048,
        char: "\n",
        prepend: "",
        append: ""
      });

      splitDescription.forEach(async (m) => {
        embed2.setDescription(m);

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
              embeds: [embed2]
            });
          } catch {
            return await client.models.webhooks.findOneAndDelete({
              guildID: settings.guildID,
              channelID: settings.event_logs
            });
          }
        }
      });
    }
  }
};
