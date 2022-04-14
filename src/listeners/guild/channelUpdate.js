"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, oldChannel, newChannel) => {
  if (!newChannel.guild) return;

  const settings = await client.models.guild.findOne({
    guildID: newChannel.guild.id
  });
  if (!settings.event_logs) {
    return;
  }

  if (oldChannel.name !== newChannel.name) {
    let embed = new MessageEmbed()
      .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
      .setTitle(`🚨 Channel Update`)
      .addField(`Old Name:`, oldChannel.name, true)
      .addField("New Name:", newChannel.name, true)
      .setFooter(`Channel ID: ${newChannel.id}`)
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
      } catch {
        return;
      }
    }
  }
  /*  if (oldChannel.position !== newChannel.position) {
    let embed = new MessageEmbed()
      .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
      .setTitle(`🚨 Channel Update`)
      .addField("Channel Name:", newChannel.name)
      .addField(`Old Position:`, oldChannel.position, true)
      .addField("New Position:", newChannel.position, true)
      .setFooter(`Channel ID: ${newChannel.id}`)
      .setColor(client.config.embeds.embed_color)
      .setTimestamp();

    const log_channel = await client.channels.fetch(settings.event_logs);
    const webhooks = await log_channel.fetchWebhooks();
    const webhook = webhooks.first();
    if (webhook) {
      const webhookClient = new WebhookClient(webhook.id, webhook.token);
      await webhookClient
        .send({
          username: "Tritan Bot",
          avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
          embeds: [embed]
        })
    } else {
      let create = await log_channel.createWebhook("Tritan Bot: Logging", {
        avatar: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
      });
      if (!create) return false;
      const webhookClient = new WebhookClient(create.id, create.token);
      await webhookClient
        .send({
          username: "Tritan Bot",
          avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
          embeds: [embed]
        })
    }
  } */

  if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
    let embed = new MessageEmbed()
      .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
      .setTitle(`🚨 Channel Update`)
      .addField("Channel Name:", `${newChannel.name}`)
      .setDescription(`Channel permissions have been updated.`)
      .setFooter(`Channel ID: ${newChannel.id}`)
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
      } catch {
        return;
      }
    }
  }
  if (oldChannel.type !== newChannel.type) {
    let embed = new MessageEmbed()
      .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
      .setTitle(`🚨 Channel Update`)
      .addField("New Channel Type:", `${newChannel.type}`)
      .setDescription(`Channel type have been updated.`)
      .setFooter(`Channel ID: ${newChannel.id}`)
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
      } catch {
        return;
      }
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      let embed = new MessageEmbed()
        .setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
        .setTitle(`🚨 Channel Update`)
        .addField("NSFW?", `${newChannel.type}`)
        .setDescription(`Channel NSFW/SFW Toggle Changed`)
        .setFooter(`Channel ID: ${newChannel.id}`)
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
        } catch {
          return await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.event_logs
          });
        }
      }
    }
  }
};
