"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = async (client, message, editedMessage) => {
  if (!message.guild) return;

  const settings = await client.models.guild.findOne({
    guildID: message.guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  if (message.author.bot) return;
  if (message === editedMessage) return;
  if (message.channel.type !== "GUILD_TEXT") return;
  if (!message.author.tag) return;
  if (message === null) return;
  if (editedMessage === null) return;

  let guild = message.guild;

  const embed = new MessageEmbed()
    .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.avatarURL())
    .setDescription(
      `Message \`${message.id}\` has been edited in **#${message.channel.name}** \`(${message.channel.id})\` by **${message.author.tag}** \`(${message.author.id})\`.\n\n**Before:** ${message}\n**After:** ${editedMessage}\n\n[Jump to the message.](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`
    )
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const thisWebhook = await client.models.webhooks.findOne({
    guildID: settings.guildID,
    channelID: settings.event_logs
  });

  if (thisWebhook) {
    const webhookClient = new WebhookClient({ id: thisWebhook.webhookID, token: thisWebhook.webhookSecret });

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
};
