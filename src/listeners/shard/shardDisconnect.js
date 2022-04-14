"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, event) => {
  console.log(client.logger.yellowBright("[SHARD DISCONENCTED]"), `Shard ${event} has disconnected.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🔴 **Shard ${event}** has disconnected.`)
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_SECRET
  });

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
};
