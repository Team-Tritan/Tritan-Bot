"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, message) => {
  if (!message.content) return;
  if (!message.channel) return;
  if (!message.author) return;
  if (!message.author.tag) return;
  if (!message.id) return;

  client.snipes.set(message.channel.id, {
    author: message.author.tag,
    author_id: message.author.id,
    author_avatar: message.author.displayAvatarURL(),
    content: message.content || "No message content recorded, this was most likely a bot embed.",
    channel: message.channel.name,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });

  const settings = await client.models.guild.findOne({
    guildID: message.guild.id
  });
  if (!settings.event_logs) {
    return;
  }

  let embed = new MessageEmbed()
    .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.avatarURL())
    .setDescription(
      `Message \`${message.id}\` has been deleted in **#${message.channel.name}** \`(${message.channel.id})\`.\n\n**Message:** ` +
        (await message.client.functions.shorten(message.content))
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
