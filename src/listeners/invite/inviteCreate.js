"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, invite) => {
  await invite.guild.members.fetch();

  const settings = await client.models.guild.findOne({
    guildID: invite.guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  let embed = new MessageEmbed()
    .setAuthor(invite.inviter.tag + ` (${invite.inviter.id})`, invite.inviter.avatarURL())
    .setTitle("🛎️ Invite Created")
    .setDescription(
      `An invite code \`(${invite.code})\` has been created in **#${invite.channel.name}** \`(${invite.channel.id})\` by **${invite.inviter.tag}** \`(${invite.inviter.id})\`.\n\n${invite.url}`
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
